import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/zone";
import { language } from "../../../features/labelSlice";
import styles from "../../../styles/cfc/cfc.module.css";

const OfficeLocation = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();

  useEffect(() => {
    getZone();
    getPinCodes();
  }, []);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  const router = useRouter();

  const exitBack = () => {
    router.back();
  };

  const getZone = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    setLoad(true);
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res, i) => {
        if (res.status == 200) {
          setLoad(false);
          let result = res.data.officeLocation;
          let _res = result.map((res, i) => {
            console.log("res payment mode", res);
            return {
              srNo: i + 1 + _pageNo * _pageSize,
              activeFlag: res.activeFlag,
              gisId: res.gisId,
              id: res.id,
              officeLocationCode: res.officeLocationCode,
              officeLocationName: res.officeLocationName,
              officeLocationNameMar: res.officeLocationNameMar,
              officeLocationArea: res.officeLocationArea,
              officeLocationAreaMar: res.officeLocationAreaMar,
              officeLocationNameAddress: res.officeLocationNameAddress,
              officeLocationNameAddressMar: res.officeLocationNameAddressMar,
              officeLocationPincode: res.officeLocationPincode,
              officeLocationLandmark: res.officeLocationLandmark,
              officeLocationLandmarkMr: res.officeLocationLandmarkMr,
              isDepartmentLocation: res.isDepartmentLocation,
              latitude: res.latitude,
              longitude: res.longitude,

              status: res.activeFlag === "Y" ? "Active" : "InActive",
            };
          });
        }

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });

        setLoad(false);
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  };

  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Deactivate?",
  //       text: "Are you sure you want to deactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/zone/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully Deactivated!", {
  //               icon: "success",
  //             });
  //             getZone();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/zone/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully activated!", {
  //               icon: "success",
  //             });
  //             getZone();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };

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
          axios
            .post(`${urls.CFCURL}/master/mstOfficeLocation/save`, body)

            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getZone();
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
          axios.post(`${urls.CFCURL}/master/mstOfficeLocation/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getZone();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
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

  const [pincodes, setPinCodes] = useState([]);

  // getCrPinCodes
  const getPinCodes = () => {
    axios.get(`${urls.CFCURL}/master/pinCode/getAll`).then((r) => {
      setPinCodes(
        r.data.pinCode.map((row) => ({
          id: row.id,
          crPincode: row.pinCode,
          crPincodeMr: row.pinCodeMr,
          prPincode: row.pinCode,
          prPincodeMr: row.pinCodeMr,
        })),
      );
    });
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      // fromDate,
      // toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.CFCURL}/master/mstOfficeLocation/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 200) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getZone();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  const resetValuesExit = {
    officeLocationCode: "",
    officeLocationName: "",
    officeLocationNameMar: "",
    officeLocationArea: "",
    officeLocationAreaMar: "",
    officeLocationNameAddress: "",
    officeLocationNameAddressMar: "",
    officeLocationPincode: "",
    officeLocationLandmark: "",
    officeLocationLandmarkMr: "",
    isDepartmentLocation: "",
    latitude: "",
    longitude: "",
  };

  const resetValues = {
    officeLocationCode: "",
    officeLocationName: "",
    officeLocationNameMar: "",
    officeLocationArea: "",
    officeLocationAreaMar: "",
    officeLocationNameAddress: "",
    officeLocationNameAddressMar: "",
    officeLocationPincode: "",
    officeLocationLandmark: "",
    officeLocationLandmarkMr: "",
    isDepartmentLocation: "",
    latitude: "",
    longitude: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    // fromDate: "",
    // toDate: "",
    officeLocationCode: "",
    officeLocationName: "",
    officeLocationNameMar: "",
    officeLocationArea: "",
    officeLocationAreaMar: "",
    officeLocationNameAddress: "",
    officeLocationNameAddressMar: "",
    officeLocationPincode: "",
    officeLocationLandmark: "",
    officeLocationLandmarkMr: "",
    isDepartmentLocation: "",
    latitude: "",
    longitude: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      width: 90,
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "officeLocationCode",
      headerName: <FormattedLabel id="officeLocationCode" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "officeLocationName" : "officeLocationNameMar",
      headerName:
        language === "en" ? (
          <FormattedLabel id="officeLocationName" />
        ) : (
          <FormattedLabel id="officeLocationNameMar" />
        ),
      // type: "number",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: language === "en" ? "officeLocationArea" : "officeLocationAreaMar",
      headerName:
        language === "en" ? (
          <FormattedLabel id="officeLocationArea" />
        ) : (
          <FormattedLabel id="officeLocationAreaMar" />
        ),
      // type: "number",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },

    // {
    //   field: "status",
    //   headerName: <FormattedLabel id="status" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 80,
    // },
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
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
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
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  //   public String officeLocationCode;

  //     public String officeLocationName;

  //     public String officeLocationNameMar;

  //     public String officeLocationArea;

  //     public String officeLocationAreaMar;

  //     public String officeLocationNameAddress;

  //     public String officeLocationNameAddressMar;

  //     public Long officeLocationPincode;

  //     public String officeLocationLandmark;

  //     public String isDepartmentLocation;

  //     public String status;

  //     public String gisId;

  //     public Double latitude;

  //     public Double longitude;

  //     public String uploadLocationImage;

  return (
    <>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "36%" }}>
            {<FormattedLabel id="officeLocation" />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValues,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper style={{ paddingTop: isOpenCollapse ? "20px" : "0px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <Paper
              sx={{
                marginLeft: 3,
                marginRight: 3,
                marginBottom: 3,
                padding: 2,
                backgroundColor: "#F5F5F5",
              }}
              elevation={5}
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px" }}>
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
                      <TextField
                        sx={{ width: "80%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        // label="CFC Name Mr"
                        label={<FormattedLabel id="officeLocationName" />}
                        variant="outlined"
                        {...register("officeLocationName")}
                        error={!!errors.officeLocationName}
                        helperText={errors?.officeLocationName ? errors.officeLocationName.message : null}
                      />
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
                      <TextField
                        sx={{ width: "80%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        // label="CFC Name Mr"
                        label={<FormattedLabel id="officeLocationNameMar" />}
                        variant="outlined"
                        {...register("officeLocationNameMar")}
                        error={!!errors.officeLocationNameMar}
                        helperText={
                          errors?.officeLocationNameMar ? errors.officeLocationNameMar.message : null
                        }
                      />
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
                      <TextField
                        sx={{ width: "80%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        // label="CFC Name Mr"
                        label={<FormattedLabel id="officeLocationArea" />}
                        variant="outlined"
                        {...register("officeLocationArea")}
                        error={!!errors.officeLocationArea}
                        helperText={errors?.officeLocationArea ? errors.officeLocationArea.message : null}
                      />
                    </Grid>
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
                    <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="officeLocationAreaMar" />}
                      variant="outlined"
                      {...register("officeLocationAreaMar")}
                      error={!!errors.officeLocationAreaMar}
                      helperText={errors?.officeLocationAreaMar ? errors.officeLocationAreaMar.message : null}
                    />
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
                    <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="officeLocationNameAddress" />}
                      variant="outlined"
                      {...register("officeLocationNameAddress")}
                      error={!!errors.officeLocationNameAddress}
                      helperText={
                        errors?.officeLocationNameAddress ? errors.officeLocationNameAddress.message : null
                      }
                    />
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
                    <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="officeLocationNameAddressMar" />}
                      variant="outlined"
                      {...register("officeLocationNameAddressMar")}
                      error={!!errors.officeLocationNameAddressMar}
                      helperText={
                        errors?.officeLocationNameAddressMar
                          ? errors.officeLocationNameAddressMar.message
                          : null
                      }
                    />
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
                    <FormControl sx={{ marginTop: 2, width: "80%" }} error={!!errors.crPincode}>
                      <InputLabel id="demo-simple-select-outlined-label">
                        {<FormattedLabel id="officeLocationPincode" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            variant="outlined"
                            // disabled={inputState}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="officeLocationPincode" />}
                          >
                            {pincodes &&
                              pincodes.map((pincode, index) => (
                                <MenuItem key={index} value={pincode.id}>
                                  {language === "en" ? pincode?.crPincode : pincode?.crPincodeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="officeLocationPincode"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.officeLocationPincode ? errors.officeLocationPincode.message : null}
                      </FormHelperText>
                    </FormControl>
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
                    <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="officeLocationLandmark" />}
                      variant="outlined"
                      {...register("officeLocationLandmark")}
                      error={!!errors.officeLocationLandmark}
                      helperText={
                        errors?.officeLocationLandmark ? errors.officeLocationLandmark.message : null
                      }
                    />
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
                    <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="isDepartmentLocation" />}
                      variant="outlined"
                      {...register("isDepartmentLocation")}
                      error={!!errors.isDepartmentLocation}
                      helperText={errors?.isDepartmentLocation ? errors.isDepartmentLocation.message : null}
                    />
                  </Grid>
                </Grid>
                {/* gis */}
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
                    <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC ID"
                      label={<FormattedLabel id="gisId" />}
                      variant="outlined"
                      {...register("gisId")}
                      error={!!errors.gisId}
                      helperText={errors?.gisId ? errors.gisId.message : null}
                    />
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
                    <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="latitude" />}
                      variant="outlined"
                      {...register("latitude")}
                      error={!!errors.latitude}
                      helperText={errors?.latitude ? errors.latitude.message : null}
                    />
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
                    <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="longitude" />}
                      variant="outlined"
                      {...register("longitude")}
                      error={!!errors.longitude}
                      helperText={errors?.longitude ? errors.longitude.message : null}
                    />
                  </Grid>
                </Grid>
                <Grid container style={{ padding: "10px" }}>
                  {/* <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      sx={{ marginTop: 5 }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="fromDate" />}</span>}
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "80%" }}
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
                      <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                    </FormControl>
                  </Grid> */}
                  {/* <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      sx={{ marginTop: 5 }}
                      error={!!errors.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="toDate" />}</span>}
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "80%" }}
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
                      <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                    </FormControl>
                  </Grid> */}
                  <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "80%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="officeLocationCode" />}
                      variant="outlined"
                      {...register("officeLocationCode")}
                      error={!!errors.officeLocationCode}
                      helperText={errors?.officeLocationCode ? errors.officeLocationCode.message : null}
                    />
                  </Grid>
                </Grid>
                <Grid container className={styles.feildres} spacing={2}>
                  <Grid item>
                    <Button
                      type="submit"
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<SaveIcon />}
                    >
                      <FormattedLabel id="Save" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<ClearIcon />}
                      onClick={() => {
                        reset({
                          ...resetValuesExit,
                        });
                      }}
                    >
                      {<FormattedLabel id="clear" />}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      // color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Slide>
        )}

        <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
            autoHeight={data.pageSize}
            density="compact"
            sx={{
              "& .super-app-theme--cell": {
                backgroundColor: "#E3EAEA",
                borderLeft: "10px solid white",
                borderRight: "10px solid white",
                borderTop: "4px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                // transform: "scale(1.1)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E3EAEA",
                // color: "white",
              },
              // "& .MuiDataGrid-columnHeadersInner": {
              //   backgroundColor: "#87E9F7",
              // },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },
              "& .MuiDataGrid-column": {
                backgroundColor: "red",
              },
            }}
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
              getZone(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getZone(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default OfficeLocation;
