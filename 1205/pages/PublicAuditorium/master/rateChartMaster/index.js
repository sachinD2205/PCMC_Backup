import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/rateChartMaster";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[equipmentCharges].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";

const RateChartMaster = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm({ resolver: yupResolver(schema) });
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [loading, setLoading] = useState(false);

  const [chargeNames, setChargeNames] = useState([]);
  const [filteredEquipmentNames, setFilteredEquipmentNames] = useState([]);
  const [equipmentName, setEquipmentName] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [events, setEvents] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getChargeNames();
    getAuditorium();
    getEvents();
    getRateChart();
  }, []);

  useEffect(() => {
    getRateChart();
  }, [chargeNames, auditoriums, events]);

  const getRateChart = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstRateChart/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: "dsc",
        },
      })
      .then((res) => {
        console.log("res RCM", res);
        setLoading(false);
        let result = res.data.mstRateChartList;
        let _res = result.map((val, i) => {
          console.log("222", auditoriums);
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1,
            id: i,
            auditoriumName: val.auditoriumKey
              ? auditoriums?.find((obj) => {
                  return obj?.id == val.auditoriumKey;
                })?.auditoriumNameEn
              : "-",
            auditoriumNameMr: val.auditoriumKey
              ? auditoriums?.find((obj) => {
                  return obj?.id == val.auditoriumKey;
                })?.auditoriumNameMr
              : "-",
            eventName: val.eventKey
              ? events?.find((obj) => {
                  return obj?.id == val.eventKey;
                })?.eventNameEn
              : "-",
            eventName: val.eventKey
              ? events?.find((obj) => {
                  return obj?.id == val.eventKey;
                })?.eventNameEn
              : "-",
            chargeName: val.chargeNameKey
              ? chargeNames?.find((obj) => {
                  return obj?.id == val.chargeNameKey;
                })?.charge
              : "-",
            chargeNameMr: val.changeNameKey
              ? chargeNames?.find((obj) => {
                  return obj?.id == val.chargeNameKey;
                })?.chargeMr
              : "-",
            price: val.price ? val.price : "-",
            fromDate: val.fromDate ? moment(val.fromDate).format("DD-MM-YYYY") : "-",
            id: val.id,
            toDate: val.toDate ? moment(val.toDate).format("DD-MM-YYYY") : "-",
            range: val.rangeKey
              ? [
                  { id: 1, type: "10%" },
                  { id: 2, type: "20%" },
                  { id: 3, type: "30%" },
                  { id: 4, type: "40%" },
                  { id: 5, type: "50%" },
                ].find((obj) => {
                  return obj.id == val.rangeKey;
                })?.type
              : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            _auditoriumName: val?.auditoriumKey,
            eventKey: val?.eventKey,
            charge: val?.chargeNameKey,
            period: val.period ? val.period : '-',
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast("Something went wrong", {
          type: "error",
        });
      });
  };

  const getChargeNames = () => {
    axios.get(`${urls.CFCURL}/master/chargeName/getAll`).then((res) => {
      console.log("11res11", res);

      let result = res.data.chargeName;
      let _res = result.map((val, i) => {
        console.log("44", val);
        return {
          ...val,
        };
      });

      setChargeNames(_res);
    });
  };

  const getAuditorium = () => {
    axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
      console.log("respe", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          id: row.id,
          auditoriumNameEn: row.auditoriumNameEn,
          auditoriumNameMr: row.auditoriumNameMr,
        })),
      );
    });
  };

  const getEvents = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`).then((r) => {
      setEvents(
        r.data.trnAuditoriumEventsList.map((row) => ({
          ...row,
        })),
      );
    });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.PABBMURL}/mstEquipmentCharges/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Inactivated!", {
                icon: "success",
              });
              getRateChart();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.PABBMURL}/mstEquipmentCharges/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              getRateChart();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    remark: "",
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const finalBodyForApi = {
      ...formData,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
      price: Number(formData.price),
      auditoriumKey: Number(formData.auditoriumName),
      rangeKey: Number(formData.range),
      eventKey: Number(formData.eventKey),
      chargeNameKey: Number(formData.charge),

      fromDate: moment(formData.fromDate).format("YYYY-MM-DDTHH:mm:ss"),
      toDate: moment(formData.toDate).format("YYYY-MM-DDTHH:mm:ss"),
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.PABBMURL}/mstRateChart/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 201) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getRateChart();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  const resetValuesExit = {
    fromDate: "",
    toDate: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "auditoriumName" : "auditoriumNameMr",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1.5,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "eventName" : "eventNameMr",
      headerName: <FormattedLabel id="eventName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "chargeName" : "chargeNameMr",
      headerName: <FormattedLabel id="chargeName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "period",
      headerName: "Period (Hrs)",
      flex: 0.8,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: <FormattedLabel id="price" />,
      flex: 0.8,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      flex: 1,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "range",
      headerName: <FormattedLabel id="range" />,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
    
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue("auditoriumName", params.row._auditoriumName);
                setValue("equipmentCategory", params.row._equipmentCategory);
                setValue("equipmentName", params.row._equipmentName);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Paper style={{ marginTop: "10%" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="rateChartMaster" />
          </h2>
        </Box>

        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse && (
              <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.auditoriumName}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="auditorium" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="auditorium" />}
                            >
                              {auditoriums &&
                                auditoriums.map((auditorium, index) => {
                                  console.log("sd23", auditorium);
                                  return (
                                    <MenuItem key={index} value={auditorium.id}>
                                      {auditorium.auditoriumNameEn}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          )}
                          name="auditoriumName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.auditoriumName ? errors.auditoriumName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        variant="outlined"
                        sx={{ width: "90%" }}
                        error={!!errors.eventKey}
                        size="small"
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="selectEvent" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="selectEvent" />}
                            >
                              {events &&
                                events.map((service, index) => (
                                  <MenuItem
                                    key={index}
                                    sx={{
                                      display: service.programEventDescription ? "flex" : "none",
                                    }}
                                    value={service.id}
                                  >
                                    {service.programEventDescription}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="eventKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.eventKey ? errors.eventKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.charge}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">Charge Name</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="equipmentName" />}
                            >
                              {chargeNames?.map((equipmentCat, index) => {
                                console.log("trytry",equipmentCat)
                                return (
                                  <MenuItem
                                    sx={{ display: equipmentCat.charge ? "flex" : "none" }}
                                    key={index}
                                    value={equipmentCat.id}
                                  >
                                    {equipmentCat.charge}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="charge"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.charge ? errors.charge.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    
                  </Grid>

                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.period}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">Period (Hours)</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              // label={<FormattedLabel id="equipmentName" />}
                              label="Period (Hours)"
                            >
                              {[
                                { id: 1, hour: "1 Hr" },
                                { id: 2, hour: "2 Hr" },
                                { id: 3, hour: "3 Hr" },
                                { id: 4, hour: "4 Hr" },
                                { id: 5, hour: "5 Hr" },
                                { id: 6, hour: "6 Hr" },
                                { id: 7, hour: "7 Hr" },
                                { id: 8, hour: "8 Hr" },
                                { id: 9, hour: "9 Hr" },
                                { id: 10, hour: "10 Hr" },
                                { id: 11, hour: "11 Hr" },
                                { id: 12, hour: "12 Hr" },
                                { id: 13, hour: "13 Hr" },
                                { id: 14, hour: "14 Hr" },
                                { id: 15, hour: "15 Hr" },
                                { id: 16, hour: "16 Hr" },
                                { id: 17, hour: "17 Hr" },
                                { id: 18, hour: "18 Hr" },
                                { id: 19, hour: "19 Hr" },
                                { id: 20, hour: "20 Hr" },
                                { id: 21, hour: "21 Hr" },
                                { id: 22, hour: "22 Hr" },
                                { id: 23, hour: "23 Hr" },
                                { id: 24, hour: "24 Hr" },
                              ]?.map((equipmentCat, index) => {
                                return (
                                  <MenuItem key={index} value={equipmentCat.id}>
                                    {equipmentCat.hour}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="period"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.period ? errors.period.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label={<FormattedLabel id="price" />}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                        {...register("price")}
                        error={!!errors.price}
                        helperText={errors?.price ? errors.price.message : null}
                      />
                    </Grid>
                  </Grid>

                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl sx={{ width: "90%" }} error={errors.calendar}>
                        <Controller
                          name="fromDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {/* <FormattedLabel id="eventDate" /> */}
                                    From Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField {...params} size="small" fullWidth error={errors.calendar} />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>{errors?.calendar ? errors.calendar.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl sx={{ width: "90%" }} error={errors.calendar}>
                        <Controller
                          name="toDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {/* <FormattedLabel id="eventDate" /> */}
                                    To Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField {...params} size="small" fullWidth error={errors.calendar} />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>{errors?.calendar ? errors.calendar.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.charge}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">Discount</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Discount"
                            >
                              {[
                                { id: 1, type: "10%" },
                                { id: 2, type: "20%" },
                                { id: 3, type: "30%" },
                                { id: 4, type: "40%" },
                                { id: 5, type: "50%" },
                              ]?.map((equipmentCat, index) => {
                                return (
                                  <MenuItem key={index} value={equipmentCat.id}>
                                    {equipmentCat.type}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="range"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.charge ? errors.charge.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="submit"
                        size="small"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider />
                </form>
              </Slide>
            )}

            {!isOpenCollapse && (
              <>
                <Grid container style={{ padding: "10px" }}>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      endIcon={<AddIcon />}
                      size="small"
                      type="primary"
                      disabled={buttonInputState}
                      onClick={() => {
                        reset({
                          ...resetValuesExit,
                        });
                        setEditButtonInputState(true);
                        setDeleteButtonState(true);
                        setBtnSaveText("Save");
                        setButtonInputState(true);
                        setSlideChecked(true);
                        setIsOpenCollapse(!isOpenCollapse);
                      }}
                    >
                      <FormattedLabel id="add" />
                    </Button>
                  </Grid>
                </Grid>

                <Box style={{ height: "auto", overflow: "auto" }}>
                  <DataGrid
                    sx={{
                      overflowY: "scroll",

                      "& .MuiDataGrid-virtualScrollerContent": {},
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },

                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                    }}
                    density="compact"
                    autoHeight={true}
                    // rowHeight={50}
                    pagination
                    paginationMode="server"
                    // loading={data.loading}
                    rowCount={data.totalRows}
                    rowsPerPageOptions={data.rowsPerPageOptions}
                    page={data.page}
                    pageSize={data.pageSize}
                    rows={data.rows}
                    columns={columns}
                    onPageChange={(_data) => {
                      getRateChart(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getRateChart(_data, data.page);
                    }}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default RateChartMaster;
