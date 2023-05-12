import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import styles from "../../../../components/streetVendorManagementSystem/styles/noHawkingZone.module.css";
import schema from "../../../../components/streetVendorManagementSystem/schema/NoHawkingZoneSchema";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import { useSelector } from "react-redux";
import theme from "../../../../theme";
// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const language = useSelector((state) => state?.labels?.language);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [noHawkingZoneData, setNoHawkingZoneData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Zone
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setZoneNames(
            res?.data?.zone?.map((row) => ({
              id: row?.id,
              zoneName: row?.zoneName,
              zoneNameMr: row?.zoneNameMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch(() => {
        <Failed />;
      });
  };

  // Area
  const getArea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`)
      .then((res) => {
        console.log("areaNames", res?.data?.area);
        if (res?.status == 200 || res?.status == 201) {
          setAreaNames(
            res?.data?.area?.map((row) => ({
              id: row?.id,
              areaNameMr: row?.areaNameMr,
              areaName: row?.areaName,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch(() => {
        <Failed />;
      });
  };

  // Get Table - Data
  const getNoHawkingZone = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.HMSURL}/noHawkingZone/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let response = res?.data?.noHawkingZone;
          console.log("noHawkingZonedsfdsf", response);
          let _res = response.map((r, i) => {
            console.log("areaNames", r?.areaName);
            return {
              id: r.id,
              srNo: i + 1,
              noHawkingZoneprefix: r.noHawkingZoneprefix,
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              gisId: r.gisId,
              remarks: r.remarks,
              activeFlag: r.activeFlag,
              noHawkingZoneprefixMr: r.noHawkingZoneprefixMr,
              citySurveyNo: r.citySurveyNo,
              noHawkingZoneName: r.noHawkingZoneName,
              noHawkingZoneNameMr: r.noHawkingZoneNameMr,
              declarationDate: moment(r.declarationDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              declarationOrderNo: r.declarationOrderNo,
              declarationOrder: r.declarationOrder,
              noHawkingZoneInfo: r.noHawkingZoneInfo,
              noHawkingZoneInfoMr: r.noHawkingZoneInfoMr,
              zone: r.zone,
              zoneNameEn: zoneNames?.find((obj) => obj?.id == r.zone)?.zoneName,
              zoneNameMr: zoneNames?.find((obj) => obj?.id == r.zone)?.zoneNameMr,
              areaName: r.areaName,
              areaNameEn: areaNames?.find((obj) => obj?.id == r?.areaName)?.areaName,
              areaNameMr: areaNames?.find((obj) => obj?.id == r?.areaName)?.areaNameMr,
            };
          });

          console.log("_resNoHawkingZone", _res);

          setNoHawkingZoneData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        } else {
          <Failed />;
        }
      })
      .catch(() => {
        <Failed />;
      });
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
      activeFlag: "Y",
    };

    axios
      .post(`${urls.HMSURL}/noHawkingZone/save`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 201 || res?.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getNoHawkingZone();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        } else {
          <Failed />;
        }
      })
      .catch(() => {
        <Failed />;
      });
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/noHawkingZone/save`, body).then((res) => {
            if (res.status == 200 || res?.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getNoHawkingZone();
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
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/noHawkingZone/save`, body).then((res) => {
            if (res.status == 200 || res?.status == 201) {
              swal("Record is Successfully Activated !", {
                icon: "success",
              });
              getNoHawkingZone();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
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

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    id: null,
    noHawkingZoneprefix: "",
    noHawkingZoneprefixMr: "",
    fromDate: null,
    gisId: "",
    citySurveyNo: "",
    zone: null,
    areaName: null,
    noHawkingZoneName: "",
    noHawkingZoneNameMr: "",
    declarationDate: null,
    declarationOrderNo: "",
    declarationOrder: "",
    noHawkingZoneInfo: "",
    noHawkingZoneInfoMr: "",
    remarks: "",
    toDate: null,
    // capacityOfHawkingZone:"",
    // noOfHawkersPresent:"",
    // item:null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
    noHawkingZoneprefix: "",
    noHawkingZoneprefixMr: "",
    fromDate: null,
    gisId: "",
    citySurveyNo: "",
    zone: null,
    areaName: null,
    noHawkingZoneName: "",
    noHawkingZoneNameMr: "",
    declarationDate: null,
    declarationOrderNo: "",
    declarationOrder: "",
    noHawkingZoneInfo: "",
    noHawkingZoneInfoMr: "",
    remarks: "",
    toDate: null,
    // capacityOfHawkingZone:"",
    // noOfHawkersPresent:"",
    // item:null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 120,
    },

    {
      field: "noHawkingZoneprefix",
      headerName: <FormattedLabel id="noHawkingZonePrefixEn" />,
      description: <FormattedLabel id="noHawkingZonePrefixEn" />,
      width: 150,
    },
    {
      field: "noHawkingZoneprefixMr",
      headerName: <FormattedLabel id="noHawkingZonePrefixMr" />,
      description: <FormattedLabel id="noHawkingZonePrefixMr" />,
      width: 150,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      description: <FormattedLabel id="fromDate" />,
      width: 150,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      width: 150,
    },
    {
      field: language == "en" ? "zoneNameEn" : "zoneNameMr",
      headerName: <FormattedLabel id="zoneName" />,
      description: <FormattedLabel id="zoneName" />,
      width: 150,
    },
    {
      field: language == "en" ? "areaNameEn" : "areaNameMr",
      headerName: <FormattedLabel id="areaName" />,
      description: <FormattedLabel id="areaName" />,
      width: 150,
    },
    {
      field: "gisId",
      headerName: <FormattedLabel id="gisId" />,
      description: <FormattedLabel id="gisId" />,
      width: 120,
    },
    {
      field: "citySurveyNo",
      headerName: <FormattedLabel id="citySurveyNo" />,
      description: <FormattedLabel id="citySurveyNo" />,
      width: 150,
    },
    {
      field: "noHawkingZoneName",
      headerName: <FormattedLabel id="noHawkingZoneEn" />,
      description: <FormattedLabel id="noHawkingZoneEn" />,
      width: 150,
    },
    {
      field: "noHawkingZoneNameMr",
      headerName: <FormattedLabel id="noHawkingZoneMr" />,
      description: <FormattedLabel id="noHawkingZoneMr" />,
      width: 150,
    },
    {
      field: "declarationDate",
      headerName: <FormattedLabel id="declarationDate" />,
      description: <FormattedLabel id="declarationDate" />,
      width: 150,
    },
    {
      field: "declarationOrderNo",
      headerName: <FormattedLabel id="declarationOrderNo" />,
      description: <FormattedLabel id="declarationOrderNo" />,
      width: 150,
    },
    {
      field: "declarationOrder",
      headerName: <FormattedLabel id="declarationOrder" />,
      description: <FormattedLabel id="declarationOrder" />,
      width: 150,
    },

    {
      field: "noHawkingZoneInfo",
      headerName: <FormattedLabel id="noHawkingZoneInfoEn" />,
      description: <FormattedLabel id="noHawkingZoneInfoEn" />,
      width: 150,
    },
    {
      headerName: <FormattedLabel id="noHawkingZoneInfoMr" />,
      description: <FormattedLabel id="noHawkingZoneInfoMr" />,
      field: "noHawkingZoneInfoMr",
      width: 150,
    },

    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 150,
    },
    // {
    //   field: "capacityOfHawkingZone",
    //   headerName: "Capacity Of Hawking Zone",
    //   //type: "number",
    //   // flex: 3,
    //   width:200,
    // },
    // {
    //   field: "noOfHawkersPresent",
    //   headerName: "No Of Hawkers Present",
    //   //type: "number",
    //   // flex: 3,
    //   width:200,
    // },
    // {
    //   field: "itemName",
    //   headerName: "Constraint",
    //   //type: "number",
    //   // flex: 3,
    //   width:100,
    // },

    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
      headerAlign: "center",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params?.row?.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params?.row);
              }}
            >
              <EditIcon sx={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton>
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

  useEffect(() => {
    getZone();
    getArea();
  }, []);

  useEffect(() => {
    getNoHawkingZone();
  }, [zoneNames, areaNames]);

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 20,
            marginBottom: 5,
            padding: 1,
          }}
          elevation={5}
        >
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "65px",
              borderRadius: 100,
            }}
          >
            <strong>{<FormattedLabel id="noHawkingZone" />}</strong>
          </div>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid container style={{ marginBottom: "7vh" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          autoFocus
                          id="standard-basic"
                          label=<FormattedLabel id="noHawkingZonePrefixEn" />
                          variant="standard"
                          {...register("noHawkingZoneprefix")}
                          error={!!errors?.noHawkingZoneprefix}
                          helperText={
                            errors?.noHawkingZoneprefix ? errors?.noHawkingZoneprefix?.message : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="noHawkingZonePrefixMr" />
                          variant="standard"
                          {...register("noHawkingZoneprefixMr")}
                          error={!!errors?.noHawkingZoneprefixMr}
                          helperText={
                            errors?.noHawkingZoneprefixMr ? errors?.noHawkingZoneprefixMr?.message : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{ display: "flex", justifyContent: "center", alignItem: "center" }}
                      >
                        <FormControl style={{ marginTop: 0 }} error={!!errors?.fromDate}>
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
                                      <FormattedLabel id="fromDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.fromDate ? errors?.fromDate?.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{ display: "flex", justifyContent: "center", alignItem: "center" }}
                      >
                        <FormControl style={{ marginTop: 0 }} error={!!errors?.toDate}>
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
                                      <FormattedLabel id="toDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>{errors?.toDate ? errors?.toDate?.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl variant="standard" error={!!errors?.zone}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="zoneName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label=<FormattedLabel id="zoneName" />
                              >
                                {zoneNames &&
                                  zoneNames.map((zoneName, index) => (
                                    <MenuItem key={index} value={zoneName?.id}>
                                      {language == "en" ? zoneName?.zoneName : zoneName?.zoneNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zone"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>{errors?.zone ? errors?.zone?.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl sx={{ marginTop: 2 }} error={!!errors.areaName}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="areaName" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="areaName" />}
                              >
                                {areaNames &&
                                  areaNames.map((areaName, index) => (
                                    <MenuItem key={index} value={areaName.id}>
                                      {language == "en" ? areaName?.areaName : areaName?.areaNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="areaName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.areaName ? errors?.areaName?.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="gisId" />
                          variant="standard"
                          {...register("gisId")}
                          error={!!errors.gisId}
                          helperText={errors?.gisId ? errors.gisId.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="citySurveyNo" />
                          variant="standard"
                          {...register("citySurveyNo")}
                          error={!!errors.citySurveyNo}
                          helperText={errors?.citySurveyNo ? errors.citySurveyNo.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="noHawkingZoneEn" />
                          variant="standard"
                          {...register("noHawkingZoneName")}
                          error={!!errors.noHawkingZoneName}
                          helperText={errors?.noHawkingZoneName ? errors.noHawkingZoneName.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="noHawkingZoneMr" />
                          variant="standard"
                          {...register("noHawkingZoneNameMr")}
                          error={!!errors.noHawkingZoneNameMr}
                          helperText={errors?.noHawkingZoneNameMr ? errors.noHawkingZoneNameMr.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl style={{ marginTop: 10 }} error={!!errors.declarationDate}>
                          <Controller
                            control={control}
                            name="declarationDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="declarationDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  // onChange={(date) => field.onChange(date)}
                                  onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.declarationDate ? errors.declarationDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="declarationOrderNumber" />
                          variant="standard"
                          {...register("declarationOrderNo")}
                          error={!!errors.declarationOrderNo}
                          helperText={errors?.declarationOrderNo ? errors.declarationOrderNo.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="declarationOrder" />
                          variant="standard"
                          {...register("declarationOrder")}
                          error={!!errors.declarationOrder}
                          helperText={errors?.declarationOrder ? errors.declarationOrder.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="noHawkingZoneInfoEn" />
                          variant="standard"
                          {...register("noHawkingZoneInfo")}
                          error={!!errors.noHawkingZoneInfo}
                          helperText={errors?.noHawkingZoneInfo ? errors.noHawkingZoneInfo.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="noHawkingZoneInfoMr" />
                          variant="standard"
                          {...register("noHawkingZoneInfoMr")}
                          error={!!errors.noHawkingZoneInfoMr}
                          helperText={
                            errors?.noHawkingZoneInfoMr ? errors?.noHawkingZoneInfoMr?.message : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="remark" />
                          variant="standard"
                          {...register("remarks")}
                          error={!!errors.remarks}
                          helperText={errors?.remarks ? errors.remarks.message : null}
                        />
                      </Grid>
                    </Grid>
                    <Stack
                      direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
                      spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                      justifyContent="center"
                      alignItems="center"
                      marginTop="5"
                    >
                      <Button type="submit" variant="contained" color="success" endIcon={<SaveIcon />}>
                        {btnSaveText == "Save" ? (
                          <FormattedLabel id="save" />
                        ) : (
                          <FormattedLabel id="update" />
                        )}
                      </Button>
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Stack>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}
          {/** Add Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "2vh",
              marginRight: "40px",
            }}
          >
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setEditButtonInputState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />
            </Button>
          </div>

          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                printOptions: { disableToolbarButton: true },
                // disableExport: true,
                // disableToolbarButton: true,
                csvOptions: { disableToolbarButton: true },
              },
            }}
            components={{ Toolbar: GridToolbar }}
            sx={{
              m: 5,
              overflowY: "scroll",
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            columns={columns}
            density="compact"
            autoHeight={true}
            pagination
            paginationMode="server"
            page={noHawkingZoneData?.page}
            rowCount={noHawkingZoneData?.totalRows}
            rowsPerPageOptions={noHawkingZoneData?.rowsPerPageOptions}
            pageSize={noHawkingZoneData?.pageSize}
            rows={noHawkingZoneData?.rows}
            onPageChange={(_data) => {
              getNoHawkingZone(noHawkingZoneData?.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getNoHawkingZone(_data, noHawkingZoneData?.page);
            }}
          />
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
