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
  const [loadTypeDropDown, setLoadTypeDropDown] = useState([]);
  const [phaseTypeDropDown, setPhaseTypeDropDown] = useState([]);
  const [tariffCategoryDropDown, setTariffCategoryDropDown] = useState([])
  const [divisionDropDown, setDivisionDropDown] = useState([{
    id:1,
    division:"",
    divisionMr: "",
  }]);
  const [subDivisionDropDown, setSubDivisionDropDown] = useState([]);
  const [meterStatusDropDown, setMeterStatusDropDown] = useState([]);
  const [loadEquipementCapacityDropDown, setLoadEquipementCapacityDropDown] = useState([]);
  const [loadEquipementDetailsDropDown, setLoadEquipementDetailsDropDown] = useState([]);

  const [loading, setLoading] = useState(false);



  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
      getZoneData();
      getWardData();
      getLoadTypeData()
      getPhaseTypeData();
      getSubDivision();
      getDivisionData();
      getMeterStatusData();
      getTariffCategoryData();
      getLoadEquipementCapacity();
      getLoadEquipementDetails();
  },[])

  const getZoneData = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZoneDropDown(res.data.zone);
      console.log("getZone.data", res.data);
    });
  }

  const getWardData = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`)
      .then((res) => {
        setWardDropDown(res.data.ward);
        console.log("getWardData", res.data);
      });
  };

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

// get SubDivision
const getSubDivision = () => {
  axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
    let temp = res.data.mstSubDivisionList;
    console.log("getSubDivision",temp)
    setSubDivisionDropDown(temp);
  });
};

  const getDivisionData = () => {
    axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
      let temp = res.data.mstBillingUnitList;
      let _res =
      temp &&
      temp.map((r) => {
        return {
          id: r.id,
          division: r.divisionName,
          divisionMr: r.divisionNameMr,
        };
      });
     setDivisionDropDown(_res);
    });
  }

  const getMeterStatusData = () => {
    axios.get(`${urls.EBPSURL}/mstMeterStatus/getAll`).then((res) => {
      setMeterStatusDropDown(res.data.mstMeterStatusList);
      console.log("getMeterStatusData.data", res.data);
    });
  }

  const getTariffCategoryData = () => {
    axios.get(`${urls.EBPSURL}/mstTariffCategory/getAll`).then((res) => {
      setTariffCategoryDropDown(res.data.mstTariffCategoryList);
      console.log("getTariffCategoryData.data", res.data);
    });
  }

  const getLoadEquipementCapacity = () => {
    axios.get(`${urls.EBPSURL}/mstLoadEquipmentCapacity/getAll`).then((res) => {
      setLoadEquipementCapacityDropDown(res.data.mstLoadEquipmentCapacityList);
      console.log("getLoadEquipementCapacity.data", res.data);
    });
  }

  const getLoadEquipementDetails = () => {
    axios.get(`${urls.EBPSURL}/mstLoadEquipmentDetails/getAll`).then((res) => {
      setLoadEquipementDetailsDropDown(res.data.mstLoadEquipmentDetailsList);
      console.log("getLoadType.data", res.data);
    });
  }

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
    consumerNo: "",
    consumerName: "",
    consumedUnit: "",
    billAmount: "",
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
        consumerName: watch("consumerName") ? watch("consumerName") : null,
        zone: watch("zone") ? watch("zone") : null,
        division: watch("division") ? watch("division") : null,
        subdivision: watch("subDivision") ? watch("subDivision") : null,
        phasetype: watch("phasetype") ? watch("phasetype") : null,
        meterStatusKey: watch("meterStatusKey") ? watch("meterStatusKey") : null,
        billAmount: watch("billAmount") ? watch("billAmount") : null,
        consumedUnit: watch("consumedUnit") ? watch("consumedUnit") : null,
        loadEquipementCapacity: watch("loadEquipementCapacity") ? watch("loadEquipementCapacity") : null,
        loadEquipementDetails: watch("loadEquipementDetails") ? watch("loadEquipementDetails") : null,
      };

    console.log("apiBodyToSend",apiBodyToSend)

      ///////////////////////////////////////////
      setLoading(true);
      axios
        .post(`${urls.EBPSURL}/report/getMeterWiseConsumption`, apiBodyToSend)
        .then((res) => {
         
          if (res?.status === 200 || res?.status === 201) {
            console.log(":log", res);
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // srNo: i + 1,
                  consumerNo: r.consumerNo,
                  consumerName: r.consumerName,
                  consumerNameMr: r.consumerNameMr,
                  zoneName: !(zoneDropDown?.find((obj) => { return obj.id == r?.zoneKey })) ? "-" : zoneDropDown.find((obj) => { return obj.id == r?.zoneKey }).zoneName,
                  zoneNameMr: !(zoneDropDown?.find((obj) => { return obj.id == r?.zoneKey })) ? "-" : zoneDropDown.find((obj) => { return obj.id == r?.zoneKey }).zoneNameMr,
                  wardName: !(wardDropDown?.find((obj) => { return obj.id == r?.wardKey })) ? "-" : wardDropDown.find((obj) => { return obj.id == r?.wardKey }).wardName,
                  wardNameMr: !(wardDropDown?.find((obj) => { return obj.id == r?.wardKey })) ? "-" : wardDropDown.find((obj) => { return obj.id == r?.wardKey }).wardNameMr,
                  phaseType: !(phaseTypeDropDown?.find((obj) => { return obj.id == r?.phaseTypeKey })) ? "-" : phaseTypeDropDown.find((obj) => { return obj.id == r?.phaseTypeKey }).phaseType,
                  phaseTypeMr: !(phaseTypeDropDown?.find((obj) => { return obj.id == r?.phaseTypeKey })) ? "-" : phaseTypeDropDown.find((obj) => { return obj.id == r?.phaseTypeKey }).phaseTypeMr,
                  division: !(divisionDropDown?.find((obj) => { return obj.id == r?.divisionKey })) ? "-" : divisionDropDown.find((obj) => { return obj.id == r?.divisionKey }).division,
                  divisionMr: !(divisionDropDown?.find((obj) => { return obj.id == r?.divisionKey })) ? "-" : divisionDropDown.find((obj) => { return obj.id == r?.divisionKey }).divisionMr,
                  subDivision: !(subDivisionDropDown?.find((obj) => { return obj.id == r?.subDivisionKey })) ? "-" : subDivisionDropDown.find((obj) => { return obj.id == r?.subDivisionKey }).subDivision,
                  subDivisionMr: !(subDivisionDropDown?.find((obj) => { return obj.id == r?.subDivisionKey })) ? "-" : subDivisionDropDown.find((obj) => { return obj.id == r?.subDivisionKey }).subDivisionMr,
                  meterStatus: !(meterStatusDropDown?.find((obj) => { return obj.id == r?.meterStatusKey })) ? "-" : meterStatusDropDown.find((obj) => { return obj.id == r?.meterStatusKey }).meterStatus,
                  meterStatusMr: !(meterStatusDropDown?.find((obj) => { return obj.id == r?.meterStatusKey })) ? "-" : meterStatusDropDown.find((obj) => { return obj.id == r?.meterStatusKey }).meterStatusMr,
                  loadType: !(loadTypeDropDown?.find((obj) => { return obj.id == r?.loadTypeKey })) ? "-" : loadTypeDropDown.find((obj) => { return obj.id == r?.loadTypeKey }).loadType,
                  loadTypeMr: !(loadTypeDropDown?.find((obj) => { return obj.id == r?.loadTypeKey })) ? "-" : loadTypeDropDown.find((obj) => { return obj.id == r?.loadTypeKey }).loadTypeMr,
                  allocatedLoad: r.allocatedLoad,
                  meterNo: r.meterNo,
                  prevMeterReading: r.prevReading,
                  currMeterReading: r.currentReading,
                  billAmount:r.billAmount,
                  consumedUnit:r.consumedUnit,
                  loadEquipementCapacity: r.capacity,

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
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "consumerNo",
      headerName: <FormattedLabel id="consumerNo" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "consumerName" : "consumerNameMr" ,
      headerName: <FormattedLabel id="consumerName" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "zoneName" : "zoneNameMr" ,
      headerName: <FormattedLabel id="zone" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "wardName" : "wardNameMr" ,
      headerName: <FormattedLabel id="ward" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "division" : "divisionMr" ,
      headerName: <FormattedLabel id="division" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "subDivision" : "subDivisionMr" ,
      headerName: <FormattedLabel id="subDivision" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "phaseType" : "phaseTypeMr" ,
      headerName: <FormattedLabel id="phaseType" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "meterStatus" : "meterStatusMr" ,
      headerName: <FormattedLabel id="meterStatus" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "allocatedLoad",
      headerName: <FormattedLabel id="allocatedLoad" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "meterNo",
      headerName: <FormattedLabel id="meterNo" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "loadType" : "loadTypeMr" ,
      headerName: <FormattedLabel id="loadType" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "prevMeterReading",
      headerName: <FormattedLabel id="prevMeterReading" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "currMeterReading",
      headerName: <FormattedLabel id="currMeterReading" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "billAmount",
      headerName: <FormattedLabel id="billAmount" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "consumedUnit",
      headerName: <FormattedLabel id="consumedUnit" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "tariffCategory",
    //   headerName: <FormattedLabel id="tarriffCategory" />,
    //   minWidth: 230,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "equipmentDetails",
    //   headerName: <FormattedLabel id="loadEquipmentDetails" />,
    //   minWidth: 230,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "loadEquipementCapacity",
    //   headerName: <FormattedLabel id="loadEquipementCapacity" />,
    //   minWidth: 230,
    //   headerAlign: "center",
    //   align: "center",
    // },
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
              <FormattedLabel id="meterWiseConsumption" />
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
            <FormControl style={{ backgroundColor: "white"}}  error={!!errors.fromDate}>
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
            <FormControl style={{ backgroundColor: "white"}} error={!!errors.toDate}>
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
                id="standard-basic"
                label={<FormattedLabel id="consumerNo" />}
                variant="standard"
                InputLabelProps={{ shrink: watch('consumerNo') ? true : false }}
                {...register("consumerNo")}
                error={!!errors.consumerNo}
                helperText={errors?.consumerNo ? errors.consumerNo.message : null}
              />
            </Grid>

             {/* Consumer Name */}
             <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="consumerName" />}
                variant="standard"
                InputLabelProps={{ shrink: watch('consumerName') ? true : false }}
                {...register("consumerName")}
                error={!!errors.consumerName}
                helperText={errors?.consumerName ? errors.consumerName.message : null}
              />
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
                     {language == "en" ? each.zoneName : each.zoneNameMr}
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

             {/* ward */}
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
                             {language == "en" ? each.wardName : each.wardNameMr}
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
                            {language === "en" ? each.division : each.divisionMr}
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
                           {language == "en" ? each.subDivision : each.subDivisionMr}
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
                      {...register("phasetype")}
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
                             {language == "en" ? each.phaseType : each.phaseTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="phasetype"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.phasetype ? errors.phasetype.message : null}</FormHelperText>
              </FormControl>
            </Grid>

             {/* meterStatus */}
             <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.meterStatusKey}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="meterStatus" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("meterStatusKey")}
                      label={<FormattedLabel id="meterStatus" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {meterStatusDropDown &&
                        meterStatusDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                         {language == "en" ? each.meterStatus : each.meterStatusMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="meterStatusKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.meterStatusKey ? errors.meterStatusKey.message : null}</FormHelperText>
              </FormControl>
            </Grid>

  {/* bill amount */}
  <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="billAmount" />}
                variant="standard"
                InputLabelProps={{ shrink: watch('billAmount') ? true : false }}
                {...register("billAmount")}
                error={!!errors.billAmount}
                helperText={errors?.billAmount ? errors.billAmount.message : null}
              />
            </Grid>

              {/* consumed unit */}
              <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="consumedUnit" />}
                variant="standard"
                InputLabelProps={{ shrink: watch('consumedUnit') ? true : false }}
                {...register("consumedUnit")}
                error={!!errors.consumedUnit}
                helperText={errors?.consumedUnit ? errors.consumedUnit.message : null}
              />
            </Grid>

               {/* tariffCategory */}
               <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.tariffCategoryKey}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="tarriffCategory" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("tariffCategoryKey")}
                      label={<FormattedLabel id="tariffCategory" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {tariffCategoryDropDown &&
                        tariffCategoryDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                           {language == "en" ? each.tariffCategory : each.tariffCategoryMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="tariffCategoryKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.tariffCategoryKey ? errors.tariffCategoryKey.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* load equipement capacity */}
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.loadEquipementCapacity}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="loadEquipementCapacity" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      {...register("loadEquipementCapacity")}
                      label={<FormattedLabel id="loadEquipementCapacity" />}
                    >
                      {loadEquipementCapacityDropDown &&
                        loadEquipementCapacityDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {language === "en" ? each.loadEquipmentCapacity : each.loadEquipmentCapacityMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="loadEquipementCapacity"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.loadEquipementCapacity ? errors.loadEquipementCapacity.message : null}</FormHelperText>
              </FormControl>
            </Grid>

             {/* load equipement details */}
             <Grid item xs={12} sm={6} md={6} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.loadEquipementDetails}
              >
                <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="loadEquipmentDetails" />}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      {...register("loadEquipementDetails")}
                      label={<FormattedLabel id="loadEquipmentDetails" />}
                  
                    >
                      {loadEquipementDetailsDropDown &&
                        loadEquipementDetailsDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {language === "en" ? each.equipmentDetails : each.equipmentDetailsMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="loadEquipementDetails"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.loadEquipementDetails ? errors.loadEquipementDetails.message : null}</FormHelperText>
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


