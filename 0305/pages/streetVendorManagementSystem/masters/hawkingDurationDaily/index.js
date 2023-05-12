import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
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
import schema from "../../../../components/streetVendorManagementSystem/schema/HawkingDurationDailySchema";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import { useSelector } from "react-redux";
import { TimePicker } from "@mui/x-date-pickers";

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

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [businessSubTypes, setBusinessSubTypes] = useState([]);
  const language = useSelector((state) => state?.labels.language);
  const [hawkingDurationDaily, setHawkingDurationDaily] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // businessTypes
  const getBusinessTypes = () => {
    axios
      .get(`${urls.HMSURL}/master/businessType/getAll`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          console.log("businessTypes", r?.data?.businessType);
          setBusinessTypes(
            r?.data?.businessType?.map((row) => ({
              id: row?.id,
              businessType: row?.businessType,
              businessTypeMr: row?.businessTypeMr,
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

  // SubBusinessType
  const getBusinessSubTypes = () => {
    axios
      .get(`${urls.HMSURL}/master/businessSubType/getAll`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          console.log("businessSubType", r?.data?.businessSubType);
          setBusinessSubTypes(
            r?.data?.businessSubType?.map((row) => ({
              id: row?.id,
              businessSubType: row?.businessSubType,
              businessSubTypeMr: row?.businessSubTypeMr,
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
  const getHawkingDurationDaily = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.HMSURL}/hawkingDurationDaily/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let response = res?.data?.hawkingDurationDaily;
          console.log("hawkingDurationDailyGet", response);
          let _res = response.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              hawkingDurationDailyPrefix: r?.hawkingDurationDailyPrefix,
              hawkingDurationDailyPrefixMr: r?.hawkingDurationDailyPrefixMr,
              toDate: moment(r?.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDate: moment(r?.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              hawkingDurationDailyFrom: moment(r?.hawkingDurationDailyFrom, "HH:mm:ss").format(
                "YYYY-MM-DD HH:mm:ss",
              ),
              hawkingDurationDailyF: moment(r?.hawkingDurationDailyFrom, "HH:mm:ss").format("hh:mm a"),
              hawkingDurationDailyTo: moment(r?.hawkingDurationDailyTo, "HH:mm:ss").format(
                "YYYY-MM-DD HH:mm:ss",
              ),
              hawkingDurationDailyT: moment(r?.hawkingDurationDailyTo, "HH:mm:ss").format("hh:mm a"),
              businessType: r?.businessType,
              businessTypeEn: businessTypes?.find((obj) => obj?.id === r.businessType)?.businessType,
              businessTypeMr: businessTypes?.find((obj) => obj?.id === r.businessType)?.businessTypeMr,
              businessSubType: r?.businessSubType,
              subBusinessTypeEn: businessSubTypes?.find((obj) => obj?.id === r.businessSubType)
                ?.businessSubType,
              subBusinessTypeMr: businessSubTypes?.find((obj) => obj?.id === r.businessSubType)
                ?.businessSubTypeMr,
              remarks: r?.remarks,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          console.log("___res123", _res);
          setHawkingDurationDaily({
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
  const onSubmitForm = (fromData) => {
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
      hawkingDurationDailyFrom: moment(fromData?.hawkingDurationDailyFrom).format("HH:mm:ss"),
      hawkingDurationDailyTo: moment(fromData?.hawkingDurationDailyTo).format("HH:mm:ss"),
    };

    axios
      .post(`${urls.HMSURL}/hawkingDurationDaily/save`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 201 || res?.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getHawkingDurationDaily();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
        } else {
          <Failed />;
        }
      })
      .catch(() => {
        <Failed />;
      });
  };

  // Delete
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
          axios.post(`${urls.HMSURL}/hawkingDurationDaily/save`, body).then((res) => {
            if (res.status == 200 || res?.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getHawkingDurationDaily();
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
          axios.post(`${urls.HMSURL}/hawkingDurationDaily/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200 || res?.status == 201) {
              swal("Record is Successfully Activated !", {
                icon: "success",
              });
              getHawkingDurationDaily();
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
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
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
    hawkingDurationDailyPrefix: "",
    hawkingDurationDailyPrefixMr: "",
    fromDate: null,
    toDate: null,
    hawkingDurationDailyFrom: null,
    hawkingDurationDailyTo: null,
    businessType: "",
    businessSubType: "",
    remarks: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    hawkingDurationDailyPrefix: "",
    hawkingDurationDailyPrefixMr: "",
    fromDate: null,
    toDate: null,
    hawkingDurationDailyFrom: null,
    hawkingDurationDailyTo: null,
    businessType: "",
    businessSubType: "",
    remarks: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "hawkingDurationDailyPrefix",
      headerName: <FormattedLabel id="hawkingDurationDailyPrefixEn" />,
      description: <FormattedLabel id="hawkingDurationDailyPrefixEn" />,
      align: "left",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "hawkingDurationDailyPrefixMr",
      headerName: <FormattedLabel id="hawkingDurationDailyPrefixMr" />,
      description: <FormattedLabel id="hawkingDurationDailyPrefixMr" />,
      align: "left",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      description: <FormattedLabel id="fromDate" />,
      align: "left",
      headerAlign: "center",
      flex: 2,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      flex: 2,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "hawkingDurationDailyF",
      headerName: <FormattedLabel id="hawkingDurationDailyFrom" />,
      description: <FormattedLabel id="hawkingDurationDailyFrom" />,
      flex: 2,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "hawkingDurationDailyT",
      headerName: <FormattedLabel id="hawkingDurationDailyTo" />,
      description: <FormattedLabel id="hawkingDurationDailyTo" />,
      flex: 2,
      align: "left",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "businessTypeEn" : "businessTypeMr",
      headerName: <FormattedLabel id="businessType" />,
      description: <FormattedLabel id="businessType" />,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "subBusinessTypeEn" : "subBusinessTypeMr",
      headerName: <FormattedLabel id="businessSubType" />,
      description: <FormattedLabel id="businessSubType" />,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      flex: 1,
    },
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
    getBusinessTypes();
    getBusinessSubTypes();
  }, []);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getHawkingDurationDaily();
  }, [businessTypes, businessSubTypes]);

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
            <strong>{<FormattedLabel id="hawkingDurationDaily" />}</strong>
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
                          label=<FormattedLabel id="hawkingDurationDailyPrefixEn" />
                          variant="standard"
                          {...register("hawkingDurationDailyPrefix")}
                          error={!!errors?.hawkingDurationDailyPrefix}
                          helperText={
                            errors?.hawkingDurationDailyPrefix
                              ? errors?.hawkingDurationDailyPrefix?.message
                              : null
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
                          autoFocus
                          id="standard-basic"
                          label=<FormattedLabel id="hawkingDurationDailyPrefixMr" />
                          variant="standard"
                          {...register("hawkingDurationDailyPrefixMr")}
                          error={!!errors?.hawkingDurationDailyPrefixMr}
                          helperText={
                            errors?.hawkingDurationDailyPrefixMr
                              ? errors?.hawkingDurationDailyPrefixMr?.message
                              : null
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
                        style={{ display: "flex", justifyContent: "center", alignItem: "center" }}
                      >
                        <FormControl style={{ marginTop: 0 }} error={!!errors?.hawkingDurationDailyFrom}>
                          <Controller
                            format="HH:mm:ss"
                            control={control}
                            name="hawkingDurationDailyFrom"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="hawkingDurationDailyFrom" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(time) => {
                                    moment(field.onChange(time), "HH:mm:ss a").format("HH:mm:ss a");
                                  }}
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
                            {errors?.hawkingDurationDailyFrom
                              ? errors?.hawkingDurationDailyFrom?.message
                              : null}
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
                        <FormControl style={{ marginTop: 0 }} error={!!errors?.hawkingDurationDailyTo}>
                          <Controller
                            format="HH:mm:ss"
                            control={control}
                            name="hawkingDurationDailyTo"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="hawkingDurationDailyTo" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(time) => {
                                    moment(field.onChange(time), "HH:mm:ss a").format("HH:mm:ss a");
                                  }}
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
                            {errors?.hawkingDurationDailyTo ? errors?.hawkingDurationDailyTo?.message : null}
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
                        <FormControl variant="standard" error={!!errors?.businessType}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="businessType" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label=<FormattedLabel id="businessType" />
                              >
                                {businessTypes &&
                                  businessTypes.map((businessType, index) => (
                                    <MenuItem key={index} value={businessType?.id}>
                                      {language == "en"
                                        ? businessType?.businessType
                                        : businessType?.businessTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="businessType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.businessType ? errors?.businessType?.message : null}
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
                        <FormControl variant="standard" error={!!errors?.businessSubType}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="businessSubType" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label=<FormattedLabel id="itemCategoryT" />
                              >
                                {businessSubTypes &&
                                  businessSubTypes.map((businessSubType, index) => (
                                    <MenuItem key={index} value={businessSubType?.id}>
                                      {language == "en"
                                        ? businessSubType?.businessSubType
                                        : businessSubType?.businessSubTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="businessSubType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.businessSubType ? errors?.businessSubType?.message : null}
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
                setIsOpenCollapse(!isOpenCollapse);
                setSlideChecked(true);
              }}
            >
              Add
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
            page={hawkingDurationDaily?.page}
            rowCount={hawkingDurationDaily?.totalRows}
            rowsPerPageOptions={hawkingDurationDaily?.rowsPerPageOptions}
            pageSize={hawkingDurationDaily?.pageSize}
            rows={hawkingDurationDaily?.rows}
            onPageChange={(_data) => {
              getHawkingDurationDaily(hawkingDurationDaily?.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getHawkingDurationDaily(_data, hawkingDurationDaily?.page);
            }}
          />
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
