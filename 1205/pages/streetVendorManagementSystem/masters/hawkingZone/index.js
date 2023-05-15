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
import schema from "../../../../components/streetVendorManagementSystem/schema/HawkingZoneSchema";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

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

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const language = useSelector((state) => state?.labels.language);

  const [hawkingZoneData, setHawkingZoneData] = useState({
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

  // Item
  const getItem = () => {
    axios
      .get(`${urls.HMSURL}/item/getAll`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setItemNames(
            r?.data?.item?.map((row) => ({
              id: row?.id,
              item: row?.item,
              itemMr: row?.itemMr,
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

  // getHawkingZone
  const getHawkingZone = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.HMSURL}/hawingZone/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let response = res?.data?.hawkingZone;
          console.log("hawkingZone", response);
          let _res = response.map((r, i) => {
            return {
              id: r.id,
              srNo: i + 1,
              hawkingZonePrefix: r.hawkingZonePrefix,
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              gisId: r.gisId,
              item: r.item,
              hawkingZonePrefixMr: r.hawkingZonePrefixMr,
              hawkingZoneNameMr: r.hawkingZoneNameMr,
              zone: r.zone,
              zoneNameEn: zoneNames?.find((obj) => obj?.id === r.zone)?.zoneName,
              zoneNameMr: zoneNames?.find((obj) => obj?.id === r.zone)?.zoneNameMr,
              areaName: r.areaName,
              areaNameEn: areaNames?.find((obj) => obj?.id === r.areaName)?.areaName,
              areaNameMr: areaNames?.find((obj) => obj?.id === r.areaName)?.areaNameMr,
              itemNameEn: itemNames?.find((obj) => obj?.id === r.item)?.item,
              itemNameMr: itemNames?.find((obj) => obj?.id === r.item)?.itemMr,
              remark: r.remark,
              citySurveyNo: r.citySurveyNo,
              hawkingZoneName: r.hawkingZoneName,
              declarationDate: moment(r.declarationDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              declarationOrderNo: r.declarationOrderNo,
              declarationOrder: r.declarationOrder,
              capacityOfHawkingZone: r.capacityOfHawkingZone,
              noOfHawkersPresent: r.noOfHawkersPresent,
              // constraint1:r.constraint1,
              hawkingZoneInfo: r.hawkingZoneInfo,
              hawkingZoneInfoMr: r.hawkingZoneInfoMr,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          setHawkingZoneData({
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

  // OnSubmit
  const onSubmitForm = (fromData) => {
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
    };

    axios
      .post(`${urls.HMSURL}/hawingZone/save`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 201 || res?.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getHawkingZone();
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
          axios.post(`${urls.HMSURL}/hawingZone/save`, body).then((res) => {
            if (res.status == 200 || res?.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getHawkingZone();
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
          axios.post(`${urls.HMSURL}/hawingZone/save`, body).then((res) => {
            if (res.status == 200 || res?.status == 201) {
              swal("Record is Successfully Activated !", {
                icon: "success",
              });
              getHawkingZone();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };

  // cancell
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    gisId: "",
    hawkingZonePrefix: "",
    citySurveyNo: "",
    hawkingZoneName: "",
    areaName: "",
    declarationDate: null,
    declarationOrderNo: "",
    declarationOrder: "",
    capacityOfHawkingZone: "",
    noOfHawkersPresent: "",
    item: null,
    hawkingZoneInfo: "",
    zone: null,
    remark: "",
  };

  // Reset
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    gisId: "",
    hawkingZonePrefix: "",
    citySurveyNo: "",
    hawkingZoneName: "",
    areaName: "",
    declarationDate: null,
    declarationOrderNo: "",
    declarationOrder: "",
    capacityOfHawkingZone: "",
    noOfHawkersPresent: "",
    item: null,
    hawkingZoneInfo: "",
    zone: null,
    remark: "",
    id: null,
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
      field: "hawkingZonePrefix",
      headerName: <FormattedLabel id="hawkingZonePrefixEn" />,
      description: <FormattedLabel id="hawkingZonePrefixEn" />,
      width: 150,
    },
    {
      field: "hawkingZonePrefixMr",
      headerName: <FormattedLabel id="hawkingZonePrefixMr" />,
      description: <FormattedLabel id="hawkingZonePrefixMr" />,
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
      field: language == "en" ? "itemNameEn" : "itemNameMr",
      headerName: <FormattedLabel id="constraint" />,
      description: <FormattedLabel id="constraint" />,
      width: 150,
    },
    {
      field: "citySurveyNo",
      headerName: <FormattedLabel id="citySurveyNo" />,
      description: <FormattedLabel id="citySurveyNo" />,
      width: 100,
    },
    {
      field: "gisId",
      headerName: <FormattedLabel id="gisId" />,
      description: <FormattedLabel id="gisId" />,
      width: 100,
    },

    {
      field: "hawkingZoneName",
      headerName: <FormattedLabel id="hawkingZoneNameEn" />,
      description: <FormattedLabel id="hawkingZoneNameEn" />,
      width: 150,
    },
    {
      field: "hawkingZoneNameMr",
      headerName: <FormattedLabel id="hawkingZoneNameMr" />,
      description: <FormattedLabel id="hawkingZoneNameMr" />,
      width: 150,
    },

    {
      field: "declarationDate",
      headerName: <FormattedLabel id="declarationDate" />,
      description: <FormattedLabel id="declarationDate" />,
      width: 150,
    },
    {
      field: "declarationOrder",
      headerName: <FormattedLabel id="declarationOrder" />,
      description: <FormattedLabel id="declarationOrder" />,
      width: 150,
    },
    {
      field: "declarationOrderNo",
      headerName: <FormattedLabel id="declarationOrderNo" />,
      description: <FormattedLabel id="declarationOrderNo" />,
      width: 100,
    },

    {
      field: "capacityOfHawkingZone",
      headerName: <FormattedLabel id="capacityOfHawkingZone" />,
      description: <FormattedLabel id="capacityOfHawkingZone" />,
      width: 100,
    },
    {
      field: "noOfHawkersPresent",
      headerName: <FormattedLabel id="numberOfHawkersPresent" />,
      description: <FormattedLabel id="numberOfHawkersPresent" />,
      width: 100,
    },

    {
      field: "hawkingZoneInfo",
      headerName: <FormattedLabel id="hawkingZoneInfo" />,
      description: <FormattedLabel id="hawkingZoneInfo" />,
      width: 150,
    },
    {
      headerName: <FormattedLabel id="hawkingZoneInfoMr" />,
      description: <FormattedLabel id="hawkingZoneInfoMr" />,
      field: "hawkingZoneInfoMr",
      width: 150,
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 150,
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
    getZone();
    getItem();
    getArea();
  }, []);

  useEffect(() => {
    getHawkingZone();
    console.log("useEffect");
  }, [zoneNames, itemNames, areaNames]);

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
            <strong>{<FormattedLabel id="hawkingZone" />}</strong>
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
                          label=<FormattedLabel id="hawkingZonePrefixEn" />
                          variant="standard"
                          {...register("hawkingZonePrefix")}
                          error={!!errors.hawkingZonePrefix}
                          helperText={errors?.hawkingZonePrefix ? errors?.hawkingZonePrefix?.message : null}
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
                          label=<FormattedLabel id="hawkingZonePrefixMr" />
                          {...register("hawkingZonePrefixMr")}
                          error={!!errors?.hawkingZonePrefixMr}
                          variant="standard"
                          helperText={
                            errors?.hawkingZonePrefixMr ? errors?.hawkingZonePrefixMr?.message : null
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
                        <FormControl variant="standard" error={!!errors.item}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="constraint" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label=<FormattedLabel id="constraint" />
                              >
                                {itemNames &&
                                  itemNames.map((itemName, index) => (
                                    <MenuItem key={index} value={itemName.id}>
                                      {language == "en" ? itemName?.item : itemName?.itemMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="item"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>{errors?.item ? errors.item.message : null}</FormHelperText>
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
                          label=<FormattedLabel id="citySurveyNumber" />
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
                          label=<FormattedLabel id="gisId" />
                          variant="standard"
                          {...register("gisId")}
                          error={!!errors?.gisId}
                          helperText={errors?.gisId ? errors?.gisId?.message : null}
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
                          label=<FormattedLabel id="hawkingZoneNameEn" />
                          variant="standard"
                          {...register("hawkingZoneName")}
                          error={!!errors?.hawkingZoneName}
                          helperText={errors?.hawkingZoneName ? errors?.hawkingZoneName.message : null}
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
                          label=<FormattedLabel id="hawkingZoneNameMr" />
                          variant="standard"
                          {...register("hawkingZoneNameMr")}
                          error={!!errors?.hawkingZoneNameMr}
                          helperText={errors?.hawkingZoneNameMr ? errors?.hawkingZoneNameMr.message : null}
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
                        <FormControl error={!!errors.declarationDate} style={{ marginTop: 0 }}>
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
                          label=<FormattedLabel id="declarationOrder" />
                          variant="standard"
                          {...register("declarationOrder")}
                          error={!!errors?.declarationOrder}
                          helperText={errors?.declarationOrder ? errors?.declarationOrder?.message : null}
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
                          label=<FormattedLabel id="declarationOrderNumber" />
                          variant="standard"
                          {...register("declarationOrderNo")}
                          error={!!errors?.declarationOrderNo}
                          helperText={errors?.declarationOrderNo ? errors?.declarationOrderNo?.message : null}
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
                          label=<FormattedLabel id="capacityOfHawkingZone" />
                          variant="standard"
                          {...register("capacityOfHawkingZone")}
                          error={!!errors?.capacityOfHawkingZone}
                          helperText={
                            errors?.capacityOfHawkingZone ? errors?.capacityOfHawkingZone?.message : null
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
                          label=<FormattedLabel id="numberOfHawkersPresent" />
                          variant="standard"
                          {...register("noOfHawkersPresent")}
                          error={!!errors?.noOfHawkersPresent}
                          helperText={errors?.noOfHawkersPresent ? errors?.noOfHawkersPresent?.message : null}
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
                          label=<FormattedLabel id="hawkingZoneInfo" />
                          variant="standard"
                          {...register("hawkingZoneInfo")}
                          error={!!errors.hawkingZoneInfo}
                          helperText={errors?.hawkingZoneInfo ? errors.hawkingZoneInfo.message : null}
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
                          label=<FormattedLabel id="hawkingZoneInfoMr" />
                          variant="standard"
                          {...register("hawkingZoneInfoMr")}
                          error={!!errors?.hawkingZoneInfoMr}
                          helperText={errors?.hawkingZoneInfoMr ? errors?.hawkingZoneInfoMr?.message : null}
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
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={errors?.remark ? errors.remark.message : null}
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
            page={hawkingZoneData?.page}
            rowCount={hawkingZoneData?.totalRows}
            rowsPerPageOptions={hawkingZoneData?.rowsPerPageOptions}
            pageSize={hawkingZoneData?.pageSize}
            rows={hawkingZoneData?.rows}
            onPageChange={(_data) => {
              getHawkingZone(hawkingZoneData?.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getHawkingZone(_data, hawkingZoneData?.page);
            }}
          />
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
