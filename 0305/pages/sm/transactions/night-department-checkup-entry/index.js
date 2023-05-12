import styles from "../../visitorEntry.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  buildingNames,
  floorNames,
  options,
  wardNames,
  zoneNames,
} from "../../../../components/security/contsants";
import { useForm, Controller, FormProvider } from "react-hook-form";
import schema from "../../../../containers/schema/securityManagementSystemSchema/transactions/nightDepartmentCheckupEntry";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PrintIcon from "@mui/icons-material/Print";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import UploadButtonThumbOP from "../../../../components/security/DocumentsUploadThumbOP";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function NightDepartmentCheckupEntry() {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   defaultValues: {
  //     departmentOnOffStatus: "N",
  //     fanOnOffStatus: "N",
  //     lightOnOffStatus: "N",
  //   },
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    defaultValues: {
      departmentOnOffStatus: "N",
      fanOnOffStatus: "N",
      lightOnOffStatus: "N",
    },
    resolver: yupResolver(schema),
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

  console.log("444",watch("fanOnOffStatus"))

  let appName = "SM";
  let serviceName = "SM-NCE";
  // let pageMode = router?.query?.pageMode;
  let pageMode = "NIGHT CHECKUP ENTRY";

  const language = useSelector((state) => state.labels.language);
  // const { control, handleSubmit } = useForm({});
  // const onSubmit = (data) => console.log(data);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  // const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [rowId, setRowId] = useState("");
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [open, setOpen] = useState(false);
  const [paramsData, setParamsData] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("1");
    getDepartment();
    getWardKeys();
    getZoneKeys();
    getBuildings();
  }, []);

  useEffect(() => {
    console.log("1");
    getDepartment();
    getWardKeys();
    getZoneKeys();
    getBuildings();
  }, [window.location.reload]);

  useEffect(() => {
    getAllNightEntry();
  }, [wardKeys, zoneKeys, departments, buildings]);

  const onSubmit = (formData, btnType) => {
    console.log("formData", formData);
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      _body = {
        ...formData,
        presentEmployeeCount: Number(formData?.presentEmployeeCount),
        buildingKey: Number(formData?.buildingKey),
        departmentKey: Number(formData?.departmentKey),
        wardKey: Number(formData?.wardKey),
        zoneKey: Number(formData?.zoneKey),
        checkupDateTime: moment(formData?.checkupDateTime).format("YYYY-MM-DDTHH:mm:ss"),
        departmentPhoto: formData?.nightCheckupPhoto,
      };
      console.log("1", _body);
    } else {
      _body = {
        ...formData,
        id: formData.id,
      };
      console.log("2", _body);
    }
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(`${urls.SMURL}/trnNightDepartmentCheckUpEntry/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            getAllNightEntry();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            exitButton();
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Checkout" || btnType === "Checkout") {
      console.log("current ", formData);
      // var d = new Date(); // for now
      // const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(`${urls.SMURL}/trnNightDepartmentCheckUpEntry/save`, {
          ...formData,
        })
        .then((res) => {
          if (res.status == 201) {
            formData.id
              ? sweetAlert("Updated!", "Record Updated successfully !", "success")
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            setFetchData(tempData);
            setIsOpenCollapse(false);
            exitButton();
          }
        });
    }
  };

  const handleOpen = (data) => {
    console.log("data9", data);
    setOpen(true);
    setParamsData(data);
  };

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      );
    });
  };

  //buildings
  const [buildings, setBuildings] = useState([]);
  // get buildings
  const getBuildings = () => {
    axios.get(`${urls.SMURL}/mstBuildingMaster/getAll`).then((r) => {
      console.log("building master", r);
      let result = r.data.mstBuildingMasterList;
      setBuildings(result);
    });
  };

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);
  // get Zone Keys
  const getZoneKeys = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        })),
      );
    });
  };

  // Ward Keys
  const [wardKeys, setWardKeys] = useState([]);
  const [updatedWardKeys, setUpdatedWardKeys] = useState([]);
  // get Ward Keys
  const getWardKeys = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        })),
      );
    });
  };

  const handleClose = () => setOpen(false);

  const getAllNightEntry = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.SMURL}/trnNightDepartmentCheckUpEntry/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        setLoading(false);
        let result = r.data.trnNightDepartmentCheckUpEntryList;
        console.log("result43", result);
        if (wardKeys && zoneKeys && departments) {
          console.log("wardKeys && zoneKeys && departments", wardKeys, zoneKeys, departments);
          let _res = result?.map((r, i) => {
            return {
              // ...r,
              buildingKey: r.buildingKey
                ? buildings?.find((obj) => {
                    console.log("obj2", obj);
                    return obj?.id == r.buildingKey;
                  })?.buildingName
                : "-",
              checkupDateAndTime: r.checkupDateTime
                ? moment(r.checkupDateTime).format("DD-MM-YYYY hh:mm A")
                : "-",
              departmentKey: r.departmentKey
                ? departments?.find((obj) => obj?.id == r.departmentKey)?.department
                : "-",
              departmentOnOffStatus: r.departmentOnOffStatus
                ? r.departmentOnOffStatus == "Y"
                  ? "Open"
                  : "Close"
                : "-",
              fanOnOffStatus: r.fanOnOffStatus ? (r.fanOnOffStatus == "N" ? "Off" : "On") : "-",
              floor: r.floor,
              id: r.id,
              lightOnOffStatus: r.lightOnOffStatus ? (r.lightOnOffStatus == "N" ? "Off" : "On") : "-",
              presentEmployeeCount: r.presentEmployeeCount,
              presentEmployeeName: r.presentEmployeeName,
              remark: r.remark,
              subDepartmentKey: r.subDepartmentKey,
              wardKey: r.wardKey
                ? wardKeys?.find((obj) => {
                    return obj?.id == r.wardKey;
                  })?.wardName
                : "-",
              zoneKey: r.zoneKey ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName : "-",
              zone: r?.zoneKey,
              ward: r?.wardKey,
              srNo: _pageSize * _pageNo + i + 1,
              building: r?.buildingKey,
            };
          });
          console.log("resonse night entry", _res);
          setDataSource(_res);
          setData({
            rows: _res,
            totalRows: r.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getFilterWards = (value) => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`, {
        params: { moduleId: 21, zoneId: value.target.value },
      })
      .then((r) => {
        console.log("Filtered Wards", r);
        setWardKeys(r.data);
      });
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const resetValuesCancell = {
    remark: "",
    presentEmployeeCount: "",
    floor: null,
    checkupDateTime: new Date(),
    buildingKey: null,
    departmentName: null,
    zoneKey: null,
    wardKey: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      maxWidth: 60,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "zoneKey",
      headerName: <FormattedLabel id="zoneName" />,
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "wardKey",
      headerName: <FormattedLabel id="wardName" />,
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "buildingKey",
      headerName: "Building",
      // flex: 1,
      minWidth: 200,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "departmentKey",
      headerName: <FormattedLabel id="departmentName" />,
      // flex: 1,
      minWidth: 200,
      // align: "center",
      headerAlign: "center",
    },

    {
      hide: false,
      field: "checkupDateAndTime",
      headerName: <FormattedLabel id="checkupDateAndTime" />,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "floor",
      headerName: <FormattedLabel id="floor" />,
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "departmentOnOffStatus",
      headerName: <FormattedLabel id="DepartmentOpen_Close" />,
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "fanOnOffStatus",
      headerName: <FormattedLabel id="FanOn_Off" />,
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },

    {
      field: "lightOnOffStatus",
      headerName: <FormattedLabel id="LightOn_Off" />,
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "presentEmployeeCount",
      headerName: "Present Employee Count",
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "presentEmployeeName",
      headerName: "Present Employee Name",
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "subDepartmentKey",
      headerName: "Sub Department Key",
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="nightDepartmentCheckupEntry" />
            </h2>
          </Box>
          <Head>
            <title>Night Department Checkup Entry</title>
          </Head>
          {isOpenCollapse ? (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      // required
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.zoneKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="zoneName" required />
                      </InputLabel>
                      <Controller
                        name="zoneKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              getFilterWards(value);
                            }}
                            fullWidth
                            label="Zone Name"
                          >
                            {zoneKeys.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.zoneName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.zoneKey ? errors.zoneKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.wardKey}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="wardName" required />
                      </InputLabel>
                      <Controller
                        name="wardKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            fullWidth
                            label={<FormattedLabel id="wardName" required />}
                          >
                            {wardKeys.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.wardId}>
                                  {item.wardName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.wardKey ? errors.wardKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.buildingKey}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="buildingName" required />
                      </InputLabel>
                      <Controller
                        name="buildingKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            fullWidth
                            label={<FormattedLabel id="buildingName" required />}
                          >
                            {buildings?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.buildingName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.buildingKey ? errors.buildingKey.message : null}
                      </FormHelperText>
                    </FormControl>
                    {/* <TextField
                size="small"
                fullWidth
                style={{ width: "90%" }}
                id="outlined-basic"
                label="Building Name"
                variant="outlined"
                required
                {...register("buildingName")}
                error={!!errors.buildingName}
                helperText={
                  errors?.buildingName ? errors.buildingName.message : null
                }
              /> */}
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.departmentKey}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentName" required />
                      </InputLabel>
                      <Controller
                        name="departmentKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            fullWidth
                            label={<FormattedLabel id="departmentName" required />}
                          >
                            {departments?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.department}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.departmentKey ? errors.departmentKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography sx={{ fontWeight: 900 }}>
                      <FormattedLabel id="DepartmentOpen_Close" required />
                    </Typography>
                    <FormControl
                      fullWidth
                      required
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.departmentOnOffStatus}
                    >
                      <Controller
                        name="departmentOnOffStatus"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="N"
                            sx={{ display: "flex", justifyContent: "space-evenly" }}
                          >
                            <FormControlLabel
                              value="Y"
                              control={<Radio required={true} />}
                              label={<FormattedLabel id="open" />}
                            />
                            <FormControlLabel
                              value="N"
                              control={<Radio required={true} />}
                              label={<FormattedLabel id="close" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {/* {errors?.departmentOnOffStatus
                    ? errors.departmentOnOffStatus.message
                    : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography sx={{ fontWeight: 900 }}>
                      {<FormattedLabel id="LightOn_Off" required />}{" "}
                    </Typography>
                    <FormControl
                      fullWidth
                      required
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.lightOnOffStatus}
                    >
                      <Controller
                        name="lightOnOffStatus"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            defaultValue="N"
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            sx={{ display: "flex", justifyContent: "space-evenly" }}
                          >
                            <FormControlLabel
                              value="Y"
                              control={<Radio />}
                              label={<FormattedLabel id="on" />}
                            />
                            <FormControlLabel
                              value="N"
                              control={<Radio />}
                              label={<FormattedLabel id="off" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {/* {errors?.lightOnOffStatus
                    ? errors.lightOnOffStatus.message
                    : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography sx={{ fontWeight: 900 }}>
                      {<FormattedLabel id="FanOn_Off" required />}
                    </Typography>
                    <FormControl
                      fullWidth
                      required
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.fanOnOffStatus}
                    >
                      <Controller
                        name="fanOnOffStatus"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            sx={{ display: "flex", justifyContent: "space-evenly" }}
                          >
                            <FormControlLabel
                              value="Y"
                              control={<Radio />}
                              label={<FormattedLabel id="on" />}
                            />
                            <FormControlLabel
                              value="N"
                              control={<Radio />}
                              label={<FormattedLabel id="off" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {/* {errors?.fanOnOffStatus
                    ? errors.fanOnOffStatus.message
                    : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{<FormattedLabel id="departmentPhoto" />}</Typography>
                    <Box>
                      <UploadButtonThumbOP
                        appName={appName}
                        fileName={"nightCheckupPhoto.png"}
                        serviceName={serviceName}
                        fileDtl={getValues("nightCheckupPhoto")}
                        fileKey={"nightCheckupPhoto"}
                        showDel={pageMode != "NIGHT CHECKUP ENTRY" ? false : true}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl fullWidth required size="small" error={errors.checkupDateTime}>
                      <Controller
                        control={control}
                        name="checkupDateTime"
                        defaultValue={new Date()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              {...field}
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  fullWidth
                                  sx={{ width: "90%" }}
                                  error={errors.checkupDateTime}
                                  size="small"
                                />
                              )}
                              label={<FormattedLabel id="checkupDateAndTime" required />}
                              value={field.value}
                              defaultValue={new Date()}
                              onChange={(date) => field.onChange(date)}
                              error={errors.checkupDateTime}
                              helperText={errors.checkupDateTime ? errors.checkupDateTime.message : null}
                              inputFormat="DD-MM-YYYY hh:mm:ss"
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.checkupDateTime ? errors.checkupDateTime.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    item
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.floor}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="floor" required />
                      </InputLabel>
                      <Controller
                        name="floor"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            fullWidth
                            label={<FormattedLabel id="floor" required />}
                          >
                            {[
                              "Basement",
                              "Underground",
                              "Ground",
                              "First",
                              "Second",
                              "Third",
                              "Fourth",
                              "Fifth",
                            ].map((item, i) => {
                              return (
                                <MenuItem key={i} value={item}>
                                  {item}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText>{errors.floor ? errors.floor.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Controller
                      name="presentEmployeeCount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          // label="Present Employee/Person Count"
                          label={<FormattedLabel id="presentEmployeeCount" required />}
                          size="small"
                          error={errors.presentEmployeeCount}
                          helperText={
                            errors.presentEmployeeCount ? errors.presentEmployeeCount.message : null
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography sx={{ margin: "0 20px" }}></Typography>
                    <Controller
                      name="remark"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="remark" />}
                          size="small"
                          sx={{ width: "90%" }}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={4} sx={{display:'flex',justifyContent:'end'}}>
                    <Button variant="contained" size="small" type="submit">
                      <FormattedLabel id="save" />
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{display:'flex',justifyContent:'center'}}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        reset({
                          ...resetValuesCancell,
                        })
                      }
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setIsOpenCollapse(!isOpenCollapse);
                        exitButton();
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          ) : (
            <>
              <Grid container sx={{ padding: "10px" }}>
                <Grid xs={11}></Grid>
                <Grid xs={1}>
                  <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    // type='primary'
                    // disabled={buttonInputState}
                    onClick={() => {
                      // reset({
                      //   ...resetValuesExit,
                      // });
                      setEditButtonInputState(true);
                      setDeleteButtonState(true);
                      setBtnSaveText("Save");
                      // setButtonInputState(true);
                      // setSlideChecked(true);
                      setIsOpenCollapse(!isOpenCollapse);
                    }}
                  >
                    <FormattedLabel id="add" />
                  </Button>
                </Grid>
              </Grid>
              <div className={styles.addbtn} style={{ padding: "10px" }}></div>
              <DataGrid
                // disableColumnFilter
                // disableColumnSelector
                // disableToolbarButton
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    // printOptions: { disableToolbarButton: true },
                    // disableExport: true,
                    // disableToolbarButton: true,
                    // csvOptions: { disableToolbarButton: true },
                  },
                }}
                sx={{
                  // marginLeft: 5,
                  // marginRight: 5,
                  // marginTop: 5,
                  // marginBottom: 5,
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
                // rows={dataSource}
                // pageSize={5}
                // rowsPerPageOptions={[5]}
                //checkboxSelection

                density="compact"
                autoHeight={data.pageSize}
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
                  getAllNightEntry(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getAllNightEntry(_data, data.page);
                }}
              />
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Box
                    sx={{
                      padding: "10px",
                    }}
                  >
                    <Controller
                      control={control}
                      name="outDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DateTimePicker
                            renderInput={(props) => <TextField {...props} size="small" fullWidth />}
                            label="Vehicle Out Date Time"
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            inputFormat="DD-MM-YYYY hh:mm:ss"
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    <TextField
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label="Remark"
                      variant="outlined"
                      {...register("outRemark")}
                      error={!!errors.outRemark}
                      helperText={errors?.outRemark ? errors.outRemark.message : null}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        console.log("paramsData.row", paramsData.row);
                        setBtnSaveText("Checkout");
                        setRowId(paramsData.row.id);
                        onSubmitForm(paramsData.row, "Checkout");
                        // setRowId(params.row.id);
                        // onSubmitForm(params?.row, "Checkout");
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </>
          )}
        </>
      )}
    </>
  );
}
export default NightDepartmentCheckupEntry;
