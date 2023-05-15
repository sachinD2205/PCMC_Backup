import styles from "../../visitorEntry.module.css";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import Head from "next/head";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { employeeNames, options } from "../../../../components/security/contsants";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import sweetAlert from "sweetalert";
import schema from "../../../../containers/schema/securityManagementSystemSchema/transactions/departmentKeyIssue";
import { yupResolver } from "@hookform/resolvers/yup";
import ComponentToPrintDeptKeyIssue from "../../../../components/security/ComponentToPrintDeptKeyIssue";
import { useReactToPrint } from "react-to-print";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import UploadButtonThumbOP from "../../../../components/security/DocumentsUploadThumbOP";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";
import Fingerprint from "../../../../components/common/fingerPrint";

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

function DepartmentKeyIssue() {
  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    defaultValues: {
      departmentOnOffStatus: "N",
      fanOnOffStatus: "N",
      lightOnOffStatus: "N",
      isDepartmentUser: "department_user",
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

  let appName = "SM";
  let serviceName = "SM-DKI";
  // let pageMode = router?.query?.pageMode;
  let pageMode = "DEPARTMENT KEY ISSUE";

  const language = useSelector((state) => state.labels.language);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [rowId, setRowId] = useState("");

  const [loading, setLoading] = useState(false);

  const [nextEntryNumber, setNextEntryNumber] = useState();
  const [printData, setPrintData] = useState();

  const [keyIssueAt, setKeyIssueAt] = useState(new Date());

  const [base64String, setBase64String] = React.useState("");
  const [fingerPrintImg, setFingerPrintImg] = React.useState("");
  const [info, setInfo] = React.useState("");

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [open, setOpen] = useState(false);
  const [paramsData, setParamsData] = useState(false);

  const [employee, setEmployee] = useState([]);

  const [employeeId, setEmployeeId] = useState();
  const [empDetails, setEmpDetails] = useState(false);

  const getEmployeeDetails = () => {
    console.log("selectedEmployee EI", employeeId);
    // Filter through employee list to get the selected employee details based on employee id
    let selectedEmployee = employee.filter((item) => item.empCode === employeeId);
    console.log("selectedEmployee", selectedEmployee);

    setValue("mobileNumber", selectedEmployee[0]?.phoneNo);
    setValue("employeeKey", selectedEmployee[0]?.firstNameEn + " " + selectedEmployee[0]?.lastNameEn);
  };

  useEffect(() => {
    getEmployeeDetails();
  }, [empDetails]);

  useEffect(() => {
    getDepartment();
    getEmployee();
    getBuildings();
    getZoneKeys();
    getNextEntryNumber();
    getWardKeys();
  }, []);

  useEffect(() => {
    getDepartment();
    getEmployee();
    getBuildings();
    getZoneKeys();
    getNextEntryNumber();
    getWardKeys();
  }, [window.location.reload]);

  useEffect(() => {
    getAllVisitors();
  }, [wardKeys, zoneKeys, departments]);

  const getNextEntryNumber = () => {
    axios.get(`${urls.SMURL}/trnDepartmentKeyInOut/getNextIssueNo`).then((r) => {
      setNextEntryNumber(r.data);
      setValue("keyIssueNo", r.data);
    });
  };

  //buildings
  const [buildings, setBuildings] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  // get buildings
  const getBuildings = () => {
    axios.get(`${urls.SMURL}/mstBuildingMaster/getAll`).then((r) => {
      let result = r.data.mstBuildingMasterList;
      setBuildings(result);
    });
  };

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  const handleOpen = (_data) => {
    setOpen(true);
    setParamsData(_data);
  };

  const handleClose = () => setOpen(false);

  const searchEmployeeDetails = async (userId) => {
    await axios
      .post(`${urls.CFCURL}/master/user/getById=${userId}`)
      // .post(`http://localhost:8090/cfc/api/master/user/getById=${userId}`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res emplo", r);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
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

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const getFilterWards = (value) => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`, {
        params: { moduleId: 21, zoneId: value.target.value },
      })
      .then((r) => {
        setWardKeys(r.data);
      });
  };

  const getEmployee = () => {
    axios.get(`${urls.CFCURL}/master/user/getAll`).then((res) => {
      let _res = res.data.user;

      setEmployee(
        _res.map((val) => {
          return {
            id: val.id,
            firstNameEn: val.firstNameEn,
            lastNameEn: val.lastNameEn,
            empCode: val.empCode,
            phoneNo: val.phoneNo,
          };
        }),
      );
    });
  };

  const resetValuesCancell = {
    departmentKey: null,
    keyIssueAt: new Date(),
    buildingKey: null,
    zoneKey: null,
    wardKey: null,
    mobileNumber: "",
    employeeKey: null,
    remark: "",
  };

  const getAllVisitors = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.SMURL}/trnDepartmentKeyInOut/getAll`, {
        // .get(`http://192.168.68.125:9010/sm/api/trnDepartmentKeyInOut/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        setLoading(false);
        let result = r.data.trnDepartmentKeyInOutList;
        console.log("result1", result);
        let _res = result?.map((r, i) => {
          return {
            ...r,
            departmentKey: departments?.find((obj) => obj?.id === r?.departmentKey)?.department
              ? departments?.find((obj) => obj?.id === r?.departmentKey)?.department
              : "-",
            deptKey: r?.departmentKey,
            // employeeName: employee?.find((obj) => obj?.id === r?.employeeKey)?.firstNameEn
            //   ? employee?.find((obj) => obj?.id === r?.employeeKey)?.firstNameEn +
            //     " " +
            //     employee?.find((obj) => obj?.id === r?.employeeKey)?.lastNameEn
            //   : "-",
            employeeName: r.employeeKey,
            employeeKey: r.employeeKey,
            id: r.id,
            keyIssueAt: r.keyIssueAt ? moment(r.keyIssueAt).format("DD-MM-YYYY hh:mm A") : "-",
            kIA: r?.keyIssueAt,
            keyReceivedAt: r.keyReceivedAt ? moment(r.keyReceivedAt).format("DD-MM-YYYY hh:mm A") : "-",
            keyStatus: r.keyStatus,
            mobileNumber: r.mobileNumber,
            subDepartmentKey: r.subDepartmentKey,
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            visitorStatus: r.visitorStatus === "I" ? "In" : "Out",
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            ward: r?.wardKey,
            zone: r?.zoneKey,
            wardKey: r?.wardKey
              ? wardKeys?.find((obj) => {
                  return obj?.id == r.wardKey;
                })?.wardName
              : "-",
            zoneKey: r?.zoneKey ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName : "-",
            issueNo: r?.issueNo,
          };
        });
        // setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const columns = [
    {
      field: "srNo",
      // headerName: "Sr No",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "issueNo",
      // headerName: "Sr No",
      headerName: <FormattedLabel id="issueNo" />,
      flex: 0.4,
      headerAlign: "center",
    },

    {
      hide: false,
      field: "zoneKey",
      headerName: <FormattedLabel id="zone" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "wardKey",
      headerName: <FormattedLabel id="ward" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: <FormattedLabel id="deptName" />,
      minWidth: 220,
      headerAlign: "center",
    },
    // {
    //   hide: false,
    //   field: "employeeKey",
    //   headerName: "Employee Key",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      hide: false,
      field: "employeeName",
      headerName: <FormattedLabel id="employeeName" />,
      flex: 1.3,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyIssueAt",
      headerName: <FormattedLabel id="keyIssueAt" />,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyReceivedAt",
      headerName: <FormattedLabel id="keyReceivedAt" />,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyStatus",
      headerName: <FormattedLabel id="keyStatus" />,
      flex: 1,
      maxWidth: 100,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "mobileNumber",
      headerName: <FormattedLabel id="mobile" />,
      flex: 1,
      maxWidth: 100,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "subDepartmentKey",
      headerName: "Sub Department Key",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.keyStatus == "Key Issued" && (
              <Tooltip title="Receive Key">
                <IconButton
                  onClick={() => {
                    handleOpen(params);
                  }}
                >
                  <KeyOffIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  const onSubmitForm = (formData, btnType) => {
    console.log("formData", formData);

    // Save - DB
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      console.log("save");
      _body = {
        ...formData,
        departmentKey: Number(formData?.departmentKey),
        employeeKey: formData?.employeeKey,
        employeeName: employee?.find((obj) => obj?.id === formData?.employeeKey)?.firstNameEn,
        wardKey: Number(formData?.wardKey),
        zoneKey: Number(formData?.zoneKey),
        buildingName: Number(formData?.buildingName),
        keyIssueAt: moment(formData?.keyIssueAt).format("YYYY-MM-DDTHH:mm:ss"),
        fingerPrint: base64String,
      };
    } else {
      console.log("update", formData);

      _body = {
        ...formData,
        id: formData?.id,
        departmentKey: formData?.deptKey,
        employeeKey: formData?.employeeKey,
        employeeName: employee?.find((obj) => obj?.id === formData?.employeeKey)?.firstNameEn,
        keyReceivedAt: moment(watch("keyReceivedAt")).format("YYYY-MM-DDTHH:mm:ss"),
        keyIssueAt: moment(formData?.kIA).format("YYYY-MM-DDTHH:mm:ss"),
        // keyIssueAt: formData?.kIA,
        // keyIssueAt: formData?.keyIssueAt,
        keyStatus: "key Received",
        wardKey: formData?.ward,
        zoneKey: formData?.zone,
        fingerPrint: fingerPrintImg,
      };
    }

    if (btnSaveText === "Save" && btnType !== "Checkout") {
      console.log("1", _body);
      const tempData = axios
        .post(`${urls.SMURL}/trnDepartmentKeyInOut/save`, {
          // .post(`http://192.168.68.125:9010/sm/api/trnDepartmentKeyInOut/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            getAllVisitors();
            reset();
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            exitButton();
            setBase64String("");
            setFingerPrintImg("");
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Checkout" || btnType === "Checkout") {
      console.log("2", _body);
      const tempData = axios
        .post(`${urls.SMURL}/trnDepartmentKeyInOut/save`, {
          // .post(`http://192.168.68.125:9010/sm/api/trnDepartmentKeyInOut/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            getAllVisitors();
            reset();
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setOpen(false);
            exitButton();
          }
        });
    }
  };

  // function capture finger
  const CaptureFinger = () => {
    // call http request using axios

    var MFS100Request = {
      Quality: 0,
      TimeOut: 100,
    };
    var jsondata = JSON.stringify(MFS100Request);

    axios.post(`http://localhost:8004/mfs100/capture`, jsondata, {}).then((r) => {
      console.log("r", r);
      const url = "data:image/bmp;base64," + r.data.BitmapData;
      let _file;
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          _file = new File([blob], "fingerprint.png", { type: "image/png" });
          console.log("loglog", _file);
          let formData = new FormData();
          formData.append("file", _file);
          formData.append("appName", appName);
          formData.append("serviceName", serviceName);
          axios.post(`${urls.CFCURL}/file/upload`, formData).then((r) => {
            let f = r.data.filePath;
            console.log("fff34", f);
          });
        });

      setBase64String("data:image/bmp;base64," + r.data.BitmapData);
    });
  };

  return (
    <Paper>
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
              <FormattedLabel id="departmentKeyIssue" />{" "}
            </h2>
          </Box>
          <Head>
            <title>Department-Key-Issue</title>
          </Head>
          <div>{printData && <ComponentToPrintDeptKeyIssue ref={componentRef} data={printData} />}</div>
          {isOpenCollapse ? (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                sx={{ width: "45%" }}
                fullWidth
                id="outlined-basic"
                label="Employee Id"
                size="small"
                variant="outlined"
                {...register("employeeId")}
                error={!!errors.employeeId}
                helperText={
                  errors?.employeeId ? errors.employeeId.message : null
                }
              />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  searchEmployeeDetails(watch("employeeId"));
                }}
              >
                Search Emploee Details
              </Button>
            </Grid>
          </Grid> */}
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6}>
                    <Controller
                      name="key_issue_no"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="keyIssueNo" required />}
                          // label="Key Issue No"
                          fullWidth
                          disabled
                          value={nextEntryNumber}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ width: "90%" }}
                          size="small"
                          // error={errors.key_issue_no}
                          // helperText={errors.key_issue_no ? errors.key_issue_no.message : null}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.keyStatus}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentKeyStatus" required />
                      </InputLabel>
                      <Controller
                        defaultValue="Key Issued"
                        name="keyStatus"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value}
                            fullWidth
                            disabled
                            label={<FormattedLabel id="departmentKeyStatus" required />}
                          >
                            <MenuItem value={"Key Received"}>Key Received</MenuItem>
                            <MenuItem value={"Key Issued"}>Key Issued</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      // required
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.zoneKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="zoneName" />
                      </InputLabel>
                      <Controller
                        name="zoneKey"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
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
                      {/* <FormHelperText style={{ color: "red" }}>
                        {errors?.zoneKey ? errors.zoneKey.message : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.wardKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel
                          id="wardName"
                          //  required
                        />
                      </InputLabel>
                      <Controller
                        name="wardKey"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value}
                            fullWidth
                            label={<FormattedLabel id="wardName" />}
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
                      {/* <FormHelperText style={{ color: "red" }}>
                        {errors?.wardKey ? errors.wardKey.message : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={6} item>
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
                      <FormHelperText>
                        {errors.departmentKey ? errors.departmentKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.buildingName}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="buildingName" required />
                      </InputLabel>
                      <Controller
                        name="buildingName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
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
                        {errors?.buildingName ? errors.buildingName.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6}>
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      // error={!!errors.keyIssueAt}
                      fullWidth
                    >
                      <Controller
                        name="keyIssueAt"
                        control={control}
                        defaultValue={new Date()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              {...field}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  // error={!!errors.keyIssueAt}
                                  // label="Dept Key Issued Date"
                                  label={<FormattedLabel id="keyIssueAt" required />}
                                  size="small"
                                  fullWidth
                                  sx={{ width: "90%" }}
                                />
                              )}
                              label="Dept Key Issued Date"
                              value={field.value}
                              // onChange={(date) => field.onChange(date)}
                              onChange={(event) => {
                                field.onChange(event);
                                setKeyIssueAt(event);
                              }}
                              // defaultValue={new Date()}
                              inputFormat="DD-MM-YYYY hh:mm:ss"
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {/* {errors?.keyIssueAt ? errors.keyIssueAt.message : null} */}
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
                    <Typography>
                      {" "}
                      <FormattedLabel id="departmentPersonPhoto" />
                    </Typography>
                    <Box>
                      <UploadButtonThumbOP
                        appName={appName}
                        fileName={"departmentPersonPhoto.png"}
                        serviceName={serviceName}
                        fileDtl={getValues("departmentPersonPhoto")}
                        fileKey={"departmentPersonPhoto"}
                        showDel={pageMode != "DEPARTMENT KEY ISSUE" ? false : true}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  {/* <Grid item xs={6}>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="mobile" required />}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          error={errors.mobileNumber}
                          helperText={errors.mobileNumber ? errors.mobileNumber.message : null}
                        />
                      )}
                    />
                  </Grid> */}
                  <Grid item xs={6}>
                    <Controller
                      name="remark"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="remark" />}
                          fullWidth
                          sx={{ width: "90%" }}
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                {/* <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Controller
                      name="isDepartmentUser"
                      control={control}
                      defaultValue="department_user"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          defaultValue="department_user"
                        >
                          <FormControlLabel
                            value="department_user"
                            control={<Radio />}
                            label={<FormattedLabel id="departmentUser" />}
                          />
                          <FormControlLabel
                            value="other_user"
                            control={<Radio />}
                            label={<FormattedLabel id="otherUser" />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid> */}

                {/* Employee Id */}
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6}>
                    <TextField
                      sx={{ width: "90%" }}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="outlined-basic"
                      label="Employee Id"
                      size="small"
                      variant="outlined"
                      {...register("empId")}
                      onChange={(e) => {
                        // Set Employee Id
                        setEmployeeId(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {/* add a button and call function to get employee details */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setEmpDetails(!empDetails);
                      }}
                    >
                      <FormattedLabel id="getEmployeeDetails" />
                    </Button>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6}>
                    {/* {watch("isDepartmentUser") === "department_user" ? ( */}
                    <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.employeeKey}>
                      <InputLabel shrink id="demo-simple-select-standard-label">
                        <FormattedLabel id="employeeName" required />
                      </InputLabel>
                      <Controller
                        name="employeeKey"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value}
                            InputLabelProps={
                              {
                                // style: { fontSize: 15 },
                                //true
                                // shrink: watch("employeeKey") ? true : false,
                              }
                            }
                            fullWidth
                            label={<FormattedLabel id="employeeName" required />}
                            size="small"
                          >
                            {employee.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.firstNameEn + " " + item.lastNameEn}>
                                  {item.firstNameEn + " " + item.lastNameEn}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText>
                        {errors.employeeKey ? errors.employeeKey.message : null}
                      </FormHelperText>
                    </FormControl>
                    {/* ) : (
                      <TextField
                        sx={{ width: "90%" }}
                        fullWidth
                        id="outlined-basic"
                        label={<FormattedLabel id="otherPersonName" required />}
                        size="small"
                        variant="outlined"
                        {...register("employeeKey")}
                      />
                    )} */}
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="mobile" required />}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          error={errors.mobileNumber}
                          helperText={errors.mobileNumber ? errors.mobileNumber.message : null}
                        />
                      )}
                    />
                  </Grid>

                  {/* <Box>
                    <Fingerprint
                      base64String={base64String}
                      setFingerPrintImg={setFingerPrintImg}
                      setBase64String={setBase64String}
                      appName={appName}
                      serviceName={serviceName}
                    />
                  </Box> */}
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  {/* <Grid item xs={6}>
                    {watch("isDepartmentUser") === "department_user" ? (
                      <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.employeeKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="employeeName" required />
                        </InputLabel>
                        <Controller
                          name="employeeKey"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value}
                              fullWidth
                              label={<FormattedLabel id="employeeName" required />}
                              size="small"
                            >
                              {employee.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.firstNameEn + " " + item.lastNameEn}>
                                    {item.firstNameEn + " " + item.lastNameEn}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors.employeeKey ? errors.employeeKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    ) : (
                      <TextField
                        sx={{ width: "90%" }}
                        fullWidth
                        id="outlined-basic"
                        label={<FormattedLabel id="otherPersonName" required />}
                        size="small"
                        variant="outlined"
                        {...register("employeeKey")}
                      />
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="mobile" required />}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          error={errors.mobileNumber}
                          helperText={errors.mobileNumber ? errors.mobileNumber.message : null}
                        />
                      )}
                    />
                  </Grid> */}

                  <Box>
                    <Fingerprint
                      base64String={base64String}
                      setFingerPrintImg={setFingerPrintImg}
                      setBase64String={setBase64String}
                      appName={appName}
                      serviceName={serviceName}
                    />
                  </Box>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={4} sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
                    <Button variant="contained" size="small" type="submit">
                      <FormattedLabel id="save" />
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                <Grid item xs={10}></Grid>
                <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
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

              <Box>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Box>
                      <Box>
                        <FormControl
                          style={{ backgroundColor: "white" }}
                          error={!!errors.keyReceivedAt}
                          fullWidth
                        >
                          <Controller
                            name="keyReceivedAt"
                            control={control}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                  {...field}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={!!errors.keyReceivedAt}
                                      label="Dept Key Recieved Date"
                                      fullWidth
                                      size="small"
                                    />
                                  )}
                                  label="Dept Key Recieved Date"
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  defaultValue={new Date()}
                                  inputFormat="DD-MM-YYYY hh:mm:ss"
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.keyReceivedAt ? errors.keyReceivedAt.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Box>
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
                          setBtnSaveText("Checkout");
                          setRowId(paramsData.row.id);
                          onSubmitForm(paramsData.row, "Checkout");
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </Box>
              <Box>
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
                  autoHeight={data.pageSize}
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
                  // autoHeight={true}
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
                    getAllVisitors(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    // updateData("page", 1);
                    getAllVisitors(_data, data.page);
                  }}
                />
              </Box>
            </>
          )}
        </>
      )}
    </Paper>
  );
}
export default DepartmentKeyIssue;
