///////////////////////////////////////////////////////////////////////////////////////////////////////////

import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import styles from "./view.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });
  const [data, setData] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [departmentDropDown, setDepartmentDropDown] = useState([]);
  const [phaseTypeDropDown, setPhaseTypeDropDown] = useState([]);
  const [loadTypeDropDown, setLoadTypeDropDown] = useState([]);
  const [msedclCategoryDropDown, setMsedclCategoryDropDown] = useState([]);
  const [divisionDropDown, setDivisionDropDown] = useState([]);
  const [subDivisionDropDown, setSubDivisionDropDown] = useState([]);
  const [consumptionTypeDropDown, setConsumptionTypeDropDown] = useState([]);

  const [loading, setLoading] = useState(false);

  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
      getZoneData();
      getDepartmentData();
      getPhaseTypeData();
      getLoadTypeData();
      getMsedclCategoryData();
      getSubDivisionData();
      getDivisionData();
      getConsumptionTypeData();
  },[])

  useEffect(()=>{
    if(watch('department') && watch('zone')){
      getZoneWiseWard();
    }
  },[watch('department'), watch('zone')])

  const getZoneData = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZoneDropDown(res.data.zone);
      console.log("getZone.data", res.data);
    });
  }

  const getZoneWiseWard = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`, {
        params: {
          departmentId: watch('department'),
          zoneId: watch('zone'),
        },
      })
      .then((res) => {
        setWardDropDown(res.data);
        console.log("getZoneWiseWard", res.data);
      });
  };

  const getDepartmentData = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
      setDepartmentDropDown(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
        })),
      );
      console.log("res.data", r.data);
    });
  }

  const getPhaseTypeData = () => {
    axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
      setPhaseTypeDropDown(res.data.mstPhaseTypeList);
      console.log("getPhaseType.data", res.data);
    });
  }

  const getLoadTypeData = () => {
    axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
      setLoadTypeDropDown(res.data.mstLoadTypeList);
      console.log("getLoadType.data", res.data);
    });
  }

  const getMsedclCategoryData = () => {
    axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
      setMsedclCategoryDropDown(res.data.mstMsedclCategoryList);
      console.log("getMsedclCategory.data", res.data);
    });
  }

  const getSubDivisionData = () => {
    axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
      setSubDivisionDropDown(res.data.mstSubDivisionList);
      console.log("getSubDivision.data", res.data);
    });
  }

  const getDivisionData = () => {
    axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
      let temp = res.data.mstBillingUnitList;
      console.log("getBillingDivisionAndUnit.data", temp);
      setDivisionDropDown(
        temp.map((each) => {
          return {
            id: each.id,
            division : each.divisionName,
          };
        }),
      );
    });
  }

  const getConsumptionTypeData = () => {
    axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
      setConsumptionTypeDropDown(res.data.mstConsumptionTypeList);
      console.log("getConsumptionType", res.data);
    });
  }

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
    consumerNo: "",
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const onSubmitFunc = (formData) => {
    console.log("formData",formData)
    delete formData.fromDate;
    delete formData.toDate;
    if (watch("fromDate") && watch("toDate")) {
      // alert("onSubmitFunc");
      let sendFromDate = moment(watch("fromDate")).format("YYYY-MM-DD hh:mm:ss");
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DD hh:mm:ss");

      let apiBodyToSend = {
        strFromDate: sendFromDate,
        strToDate: sendToDate,
        consumerNo: watch("consumerNo") ? watch("consumerNo") : null,
        ward: watch("ward") ? watch("ward") : null,
        zone: watch("zone") ? watch("zone") : null,
        department: watch("department") ? watch("department") : null,
        phase: watch("phase") ? watch("phase") : null,
        loadType: watch("loadType") ? watch("loadType") : null,
        msedclCategory: watch("msedclCategory") ? watch("msedclCategory") : null,
        division: watch("division") ? watch("division") : null,
        subDivision: watch("subDivision") ? watch("subDivision") : null,
        consumptionType: watch("consumptionType") ? watch("consumptionType") : null,
      };

    console.log("apiBodyToSend",apiBodyToSend)

      ///////////////////////////////////////////
      setLoading(true);
      axios
        .post(`${urls.EBPSURL}/report/getYearWiseElectricBillDetails`, apiBodyToSend)
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // srNo: i + 1,
                  consumerNo: r.connsumerNo,
                  consumerName: r.consumerName,
                  aprilUnit: r.month === 4 ? r.currentReading : "0",
                  aprilAmount: r.month === 4 ? r.billedAmount : "0",
                  mayUnit: r.month === 5 ? r.currentReading : "0",
                  mayAmount: r.month === 5 ? r.billedAmount : "0",
                  juneUnit: r.month === 6 ? r.currentReading : "0",
                  juneAmount: r.month === 6 ? r.billedAmount : "0",
                  julyUnit: r.month === 7 ? r.currentReading : "0",
                  julyAmount: r.month === 7 ? r.billedAmount : "0",
                  augUnit: r.month === 8 ? r.currentReading : "0",
                  augAmount: r.month === 8 ? r.billedAmount : "0",
                  septUnit: r.month === 9 ? r.currentReading : "0",
                  septAmount: r.month === 9 ? r.billedAmount : "0",
                  octUnit: r.month === 10 ? r.currentReading : "0",
                  octAmount: r.month === 10 ? r.billedAmount : "0",
                  novUnit: r.month === 11 ? r.currentReading : "0",
                  novAmount: r.month === 11 ? r.billedAmount : "0",
                  decUnit: r.month === 12 ? r.currentReading : "0",
                  decAmount: r.month === 12 ? r.billedAmount : "0",
                  janUnit: r.month === 1 ? r.currentReading : "0",
                  janAmount: r.month === 1 ? r.billedAmount : "0",
                  febUnit: r.month === 2 ? r.currentReading : "0",
                  febAmount: r.month === 2 ? r.billedAmount : "0",
                  marchUnit: r.month === 3 ? r.currentReading : "0",
                  marchAmount: r.month === 3 ? r.billedAmount : "0",
                })),
              );
              setLoading(false);
            } else {
              sweetAlert({
                title: "Oops!",
                text: "There is nothing to show you!",
                icon: "warning",
                // buttons: ["No", "Yes"],
                dangerMode: false,
                closeOnClickOutside: false,
              });
              setData([]);
              setLoading(false);
            }
          } else {
            setData([]);
            sweetAlert("Something Went Wrong!");
            setLoading(false);
          }
        })
        .catch((error) => {
          setData([]);
          sweetAlert(error);
          setLoading(false);
        });
    } else {
      sweetAlert({
        title: "Oops!",
        text: "All Three Values Are Required!",
        icon: "warning",
        // buttons: ["No", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setData([]);
    }
  };

  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "id",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: <FormattedLabel id="consumerNo" />,
      field: "consumerNo",
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: <FormattedLabel id="consumerName" />,
      field: "consumerName",
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "aprilUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "aprilAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mayUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mayAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "juneUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "juneAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "julyUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "julyAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "augUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "augAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "septUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "septAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "octUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "octAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "novUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "novAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "decUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "decAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "janUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "janAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "febUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "febAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "marchUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "marchAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
  ]; 

  const columnGroupingModel = [
      {
        groupId: "April",
        children: [{ field: 'aprilUnit' },{field: 'aprilAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "May",
        children: [{ field: 'mayUnit' },{field: 'mayAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "June",
        children: [{ field: 'juneUnit' },{field: 'juneAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "July",
        children: [{ field: 'julyUnit' },{field: 'julyAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "August",
        children: [{ field: 'augUnit' },{field: 'augAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "September",
        children: [{ field: 'septUnit' },{field: 'septAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "October",
        children: [{ field: 'octUnit' },{field: 'octAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "November",
        children: [{ field: 'novUnit' },{field: 'novAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "December",
        children: [{ field: 'decUnit' },{field: 'decAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "January",
        children: [{ field: 'janUnit' },{field: 'janAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "February",
        children: [{ field: 'febUnit' },{field: 'febAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
      {
        groupId: "March",
        children: [{ field: 'marchUnit' },{field: 'marchAmount'}],
        minWidth: 250,
        headerAlign: "center",
        align: "center",
      },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    console.log(":generateCSVFile", data);

    const csv = [
      columns
        .map((c) => c.headerName)
        .map((obj) => obj?.props?.id)
        .join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    // downloadLink.download = "data.csv";
    downloadLink.download = "data.csv";
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  ///////////////////////////////////////////

  function generatePDF(data) {
    const columnsData = columns.map((c) => c.headerName).map((obj) => obj?.props?.id);
    const rowsData = data.map((row) => columns.map((col) => row[col.field]));
    console.log(
      ":45",
      columns.map((c) => c.headerName).map((obj) => obj),
    );
    const doc = new jsPDF();
    doc.autoTable({
      head: [columnsData],
      body: rowsData,
    });
    doc.save("datagrid.pdf");
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          margin: "30px",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>
              <FormattedLabel id="yearWiseReport" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} style={{ margin: "10px", width: "80%" }}>
            <form onSubmit={handleSubmit(onSubmitFunc)}>
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "baseline",
                }}
              >
                {/* From Date */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center"}}>
            <FormControl style={{ backgroundColor: "white", marginLeft: "30px" }}  error={!!errors.fromDate}>
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="fromDate" required/>
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            disableFuture
                            renderInput={(params) => (
                              <TextField {...params} size="small" fullWidth variant="standard" />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                  </FormControl>
            </Grid>

            {/* To Date */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
            <FormControl style={{ backgroundColor: "white", marginLeft: "30px" }} error={!!errors.toDate}>
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="toDate" required/>
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            minDate={watch('fromDate')}
                            disableFuture
                            renderInput={(params) => (
                              <TextField {...params} size="small" fullWidth variant="standard" />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                  </FormControl>
            </Grid>

            {/* Consumer No */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
              type="number"
                sx={{ width: "70%" }}
                id="standard-basic"
                label={<FormattedLabel id="consumerNo" />}
                variant="standard"
                InputLabelProps={{ shrink: watch('consumerNo') ? true : false }}
                {...register("consumerNo")}
                error={!!errors.consumerNo}
                helperText={errors?.consumerNo ? errors.consumerNo.message : null}
              />
            </Grid>

            
            {/* department */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.department}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="deptName" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("department")}
                      label={<FormattedLabel id="deptName" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {departmentDropDown &&
                        departmentDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {language == "en" ? each.department : each.departmentMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="department"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.department ? errors.department.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* zone */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.zone}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="zone" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("zone")}
                      label={<FormattedLabel id="zone" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {zoneDropDown &&
                        zoneDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {each.zoneName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="zone"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.zone ? errors.zone.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Ward */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.ward}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="ward" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("ward")}
                      label={<FormattedLabel id="ward" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {wardDropDown &&
                        wardDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {each.wardName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="ward"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.ward ? errors.ward.message : null}</FormHelperText>
              </FormControl>
            </Grid>


            {/* phaseType */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.phase}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="phaseType" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("phase")}
                      label={<FormattedLabel id="phaseType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {phaseTypeDropDown &&
                        phaseTypeDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {each.phaseType}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="phase"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.phase ? errors.phase.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* loadType */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.loadType}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="loadType" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("loadType")}
                      label={<FormattedLabel id="loadType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {loadTypeDropDown &&
                        loadTypeDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {each.loadType}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="loadType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.loadType ? errors.loadType.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* MSEDCL category */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.msedclCategory}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="msedclCategory" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("msedclCategory")}
                      label={<FormattedLabel id="msedclCategory" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {msedclCategoryDropDown &&
                        msedclCategoryDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {each.msedclCategory}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="msedclCategory"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.msedclCategory ? errors.msedclCategory.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* division */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.division}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="division" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("division")}
                      label={<FormattedLabel id="division" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {divisionDropDown &&
                        divisionDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {each.division}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="division"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.division ? errors.division.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* SubDivision */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.subDivision}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="subDivision" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("subDivision")}
                      label={<FormattedLabel id="subDivision" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {subDivisionDropDown &&
                        subDivisionDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {each.subDivision}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="subDivision"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.subDivision ? errors.subDivision.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Consumption Type */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.consumptionType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="consumptionType" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("consumptionType")}
                      label={<FormattedLabel id="consumptionType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {consumptionTypeDropDown &&
                        consumptionTypeDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {each.consumptionType}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="consumptionType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.consumptionType ? errors.consumptionType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
              </Grid>

              {/* ////////////////////////////// */}

              <Grid
                container
                // spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                }}
              >
                {/* ///////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button type="submit" variant="contained"   disabled={watch("fromDate") == null || watch("toDate") == null} color="success" endIcon={<ArrowUpwardIcon />}>
                      {<FormattedLabel id="submit" />}
                    </Button>
                  </Paper>
                </Grid>

               
                {/* ///////////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      variant="contained"
                      color="success"
                      endIcon={<DownloadIcon />}
                      onClick={() => generateCSVFile(data)}
                    >
                      {<FormattedLabel id="downloadEXCELL" />}
                    </Button>
                  </Paper>
                </Grid>
                {/* ////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      variant="contained"
                      color="success"
                      endIcon={<DownloadIcon />}
                      onClick={() => generatePDF(data)}
                    >
                      {<FormattedLabel id="downloadPDF" />}
                    </Button>
                  </Paper>
                </Grid>

                {/* //////////////////////////////////// */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button
                      // sx={{ marginRight: 8 }}
                      type="button"
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={onCancel}
                    >
                      {<FormattedLabel id="cancel" />}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </Paper>
          {loading ? (
            <CircularProgress color="success" />
          ) : data.length !== 0 ? (
            <div style={{ width: "100%" }}>
              <DataGrid
                autoHeight
                experimentalFeatures={{ columnGrouping: true }}
                sx={{
                  overflowY: "scroll",
                  "& .MuiDataGrid-virtualScrollerContent": {
                    // backgroundColor:'red',
                    // height: '800px !important',
                    // display: "flex",
                    // flexDirection: "column-reverse",
                    // overflow:'auto !important'
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
                // disableColumnFilter
                // disableColumnSelector
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 0 },
                    disableExport: true,
                    disableToolbarButton: false,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                rows={data ? data : []}
                columns={columns}
                density="standard"
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                columnGroupingModel={columnGroupingModel}
              />
            </div>
          ) : (
            ""
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;


