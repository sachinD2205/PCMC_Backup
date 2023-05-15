import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import ReplyIcon from "@mui/icons-material/Reply";
import UploadButton from "../../../../components/fileUpload/UploadButton";
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
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Divider, TimePicker } from "antd";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/securityManagementSystemSchema/transactions/VehicleEntry";
import urls from "../../../../URLS/urls";
import { options, vehicleTypes } from "../../../../components/security/contsants";
import styles from "../../visitorEntry.module.css";

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

import dynamic from "next/dynamic";
import UploadButtonThumbOP from "../../../../components/security/DocumentsUploadThumbOP";
import { toast } from "react-toastify";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";
import Fingerprint from "../../../../components/common/fingerPrint";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function VehicleEntry() {
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
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      vehiclePhoto: null,
      vehicle: "government_vehicle",
      vehicleInOrOut: "vehicleIn",
    },
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
  let serviceName = "SM-VEE";
  // let pageMode = router?.query?.pageMode;
  let pageMode = "VEHICLE ENTRY";

  const language = useSelector((state) => state.labels.language);
  // const { control, handleSubmit } = useForm({});
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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [outRemark, setOutRemark] = useState("");
  const [OutMeterReading, setOutMeterReading] = useState("");
  const [open, setOpen] = useState(false);
  const [paramsData, setParamsData] = useState(false);
  const [totalInOut, setTotalInOut] = useState();
  const [nextVehicleNumber, setNextVehicleNumber] = useState(0);

  const [base64String, setBase64String] = useState("");
  const [fingerPrintImg, setFingerPrintImg] = useState("");

  useEffect(() => {
    console.log("1");
    getDepartment();
    getWardKeys();
    getZoneKeys();
    getBuildings();
    getNextEntryNumber();
    getBuildings();
    getZoneKeys();
    getInOut();
  }, []);

  useEffect(() => {
    getDepartment();
    getWardKeys();
    getZoneKeys();
    getBuildings();
    getNextEntryNumber();
    getBuildings();
    getZoneKeys();
    getInOut();
  }, [window.location.reload]);

  useEffect(() => {
    getAllVehicle();
  }, [wardKeys, zoneKeys, departments, buildings]);

  //buildings
  const [buildings, setBuildings] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  // get buildings
  const getBuildings = () => {
    axios.get(`${urls.SMURL}/mstBuildingMaster/getAll`).then((r) => {
      console.log("building master", r);
      let result = r.data.mstBuildingMasterList;
      setBuildings(result);
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

  const getFilterWards = (value) => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`, {
        params: { moduleId: 21, zoneId: value.target.value },
      })
      .then((r) => {
        setWardKeys(r.data);
      });
  };

  const handleUploadDocument = (path) => {
    setValue("authorityLetter", path);
  };

  const getAllVehicle = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.SMURL}/trnVehicleInOut/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        let result = r.data.trnVehicleInOutList;
        console.log("TESTING", result);
        setLoading(false);
        let _res = result?.map((r, i) => {
          return {
            ...r,
            inTime: r.inTime,
            inMeterReading: r.inMeterReading,
            outMeterReading: r.outMeterReading,
            totalKm: r.totalKm,
            inTimeFormatted: r.inTime ? moment(r.inTime).format("DD-MM-YYYY hh:mm A") : "",
            outTime: r.outTime,
            outTimeFormatted: r.outTime ? moment(r.outTime).format("DD-MM-YYYY hh:mm A") : "",
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            inOutStatus: r.inOutStatus === "I" ? "In" : "Out",
            vehicalEntry: r.vehicalEntry,
            vehicalEntryMr: r.vehicalEntryMr,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            departmentKey: r.departmentKey
              ? departments?.find((obj) => obj?.id == r.departmentKey)?.department
              : "-",
            wardKey: r.wardKey
              ? wardKeys?.find((obj) => {
                  return obj?.id == r.wardKey;
                })?.wardName
              : "-",
            zoneKey: r.zoneKey ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName : "-",
            zone: r?.zoneKey,
            ward: r?.wardKey,
            dept: r?.departmentKey,
            vehicleEntryNumber: r?.vehicleEntryNumber,
          };
        });
        setDataSource([..._res]);
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

  const getInOut = () => {
    axios.get(`${urls.SMURL}/trnVehicleInOut/getTotalInOut`).then((r) => {
      console.log("all check in", r);
      setTotalInOut(r.data);
    });
  };

  const searchVehicleDetails = async (vehicleNo) => {
    console.log("vehicleNo", vehicleNo);
    await axios
      .get(`${urls.SMURL}/trnVehicleInOut/getByVehicleNo?vehicleNo=${vehicleNo}`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res emplo", r);
          setValue("driver_name", r?.data?.trnVehicleInOutList[0]?.driverName);
          setValue("vehicle_number", r?.data?.trnVehicleInOutList[0]?.vehicleNumber);
          setValue("vehicle_name", r?.data?.trnVehicleInOutList[0]?.vehicleName);
          setValue("mobile_number", r?.data?.trnVehicleInOutList[0]?.driverNumber);
          setValue("vehicleInDateTime", r?.data?.trnVehicleInOutList[0]?.inTime);
          setValue("licence_number", r?.data?.trnVehicleInOutList[0]?.driverLicenceNumber);
          setValue("inRemark", r?.data?.trnVehicleInOutList[0]?.inRemark);
          setValue("travel_destination", r?.data?.trnVehicleInOutList[0]?.travelDestination);
          setValue("approx_km", r?.data?.trnVehicleInOutList[0]?.approxKm);
          setValue("current_meter_reading", r?.data?.trnVehicleInOutList[0]?.meterReading);

          r.data.trnVehicleInOutList.length === 0 &&
            toast("Data Not Found !!!", {
              type: "error",
            });
        }
      })
      .catch((err) => {
        toast("Something went wrong !!!", {
          type: "error",
        });
        console.log("err", err);
      });
  };

  const getNextEntryNumber = () => {
    axios.get(`${urls.SMURL}/trnVehicleInOut/getNextEntryNumber`).then((r) => {
      console.log("Nex Entry Number", r);
      setValue("vehicleInNumber", r.data);
      setNextVehicleNumber(r.data);
    });
  };

  const onSubmitForm = (formData, btnType) => {
    console.log("formData", formData);
    // Save - DB
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      _body = {
        inOutStatus: formData.vehicleInOrOut == "vehicleOut" ? "O" : "I",
        departmentKey: formData.departmentKey,
        departmentName: departments?.find((obj) => obj?.id === formData?.departmentKey)?.department,
        subDepartmentKey: 2,
        employeeVehicleKey: 1,
        tokenNumber: formData.vehicle_token_number,
        ownerStatus: "demo",
        vehicleNumber: formData.vehicle_number.toUpperCase(),
        // vehicleType: formData.vehicle,
        vehicleType: formData.vehicle_name,
        driverName: formData.driver_name,
        driverNumber: formData.mobile_number,
        vehicleName: "demo",
        travelDestination: formData.travel_destination,
        approxKm: formData.approx_km,
        driverLicenceNumber: formData.licence_number,
        // meterReading: formData.current_meter_reading,
        inMeterReading: formData.current_meter_reading,
        // inTime: formData.vehicleInDateTime,
        inTime: moment(formData?.vehicleInDateTime).format("YYYY-MM-DDTHH:mm:ss"),
        driverAuthorization: "demo",
        inRemark: formData.inRemark,
        zoneKey: formData.zoneKey,
        wardKey: formData.wardKey,
        // buildingName: formData?.buildingKey,
        buildingName: Number(formData?.buildingName),
        vehiclePhoto: formData?.vehiclePhoto,
        // vehicleInNumber: formData.vehicleInNumber,
        vehicleEntryNumber: watch("vehicleInNumber"),
        fingerPrint: fingerPrintImg,
        authorityLetter: formData?.authorityLetter,
      };
      console.log("1", _body);
    } else {
      _body = {
        id: formData.id,
        departmentKey: formData.dept,
        departmentName: departments?.find((obj) => obj?.id === formData?.departmentKey)?.department,
        subDepartmentKey: 2,
        employeeVehicleKey: 1,
        tokenNumber: formData.vehicle_token_number,
        ownerStatus: "demo",
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicle,
        driverName: formData.driverName,
        driverNumber: formData.driverNumber,
        vehicleName: "demo",
        travelDestination: formData.travelDestination,
        approxKm: formData.approxKm,
        driverLicenceNumber: formData.driverLicenceNumber,
        meterReading: formData.meterReading,
        // inTime: formData.inTime,
        inTime: moment(formData?.inTime).format("YYYY-MM-DDTHH:mm:ss"),
        driverAuthorization: "demo",
        // outTime: outDate.toISOString(),
        // outTime: moment(formData?.outDate).format("YYYY-MM-DDTHH:mm:ss"),
        outTime: moment(watch("vehicleOutDateTime")).format("YYYY-MM-DDTHH:mm:ss"),
        // outTime: moment(outDate).format("YYYY-MM-DDThh:mm:ss"),
        inRemark: formData.inRemark,
        outRemark: outRemark,
        inMeterReading: formData.inMeterReading,
        outMeterReading: OutMeterReading,
        zoneKey: formData?.zone,
        wardKey: formData?.ward,
        buildingName: Number(formData?.buildingName),
        vehiclePhoto: formData?.vehiclePhoto,
        inOutStatus: formData.inOutStatus == "In" ? "O" : "I",
        vehicleEntryNumber: formData.vehicleEntryNumber,
        vehicleType: formData?.vehicleType,
      };
      console.log("2", _body);
      //moment(formData?.inTime).format("YYYY-MM-DDThh:mm:ss")
    }
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      console.log("hdjk");
      const tempData = axios
        .post(`${urls.SMURL}/trnVehicleInOut/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            reset();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            getAllVehicle();
            exitButton();
            getNextEntryNumber();
            getInOut();
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Checkout" || btnType === "Checkout") {
      var d = new Date(); // for now
      const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(`${urls.SMURL}/trnVehicleInOut/save`, {
          ..._body,
          // inOutStatus: "O",
        })
        .then((res) => {
          if (res.status == 201) {
            formData.id
              ? sweetAlert("Updated!", "Record Updated successfully !", "success")
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            setFetchData(tempData);
            setIsOpenCollapse(false);
            exitButton();
            getAllVehicle();
            getInOut();
          }
        });
    }
  };

  const createColumn = () => {
    if (data?.rows[0]) {
      return Object?.keys(data?.rows[0]).map((row) => {
        return {
          field: row,
          headerName: row.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
            return str.toUpperCase();
          }),
          flex: 1,
        };
      });
    } else {
      return [];
    }
  };

  const handleOpen = (data) => {
    console.log("data9", data);
    setOpen(true);
    setParamsData(data);
  };

  const handleClose = () => setOpen(false);

  const columns = [
    // ...createColumn(),
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "ownerStatus",
      headerName: "Owner Status",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: "Department",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "zoneKey",
      headerName: "Zone",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "wardKey",
      headerName: "Ward",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "vehicleNumber",
      headerName: <FormattedLabel id="vehicleNumber" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "vehicleEntryNumber",
      headerName: "Vehicle Entry Number",
      flex: 0.4,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "vehicleType",
      headerName: "Vehicle Type",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "driverName",
      headerName: <FormattedLabel id="driverName" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "driverNumber",
      headerName: <FormattedLabel id="driverNumber" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "vehicleName",
      headerName: "Vehicle",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "inMeterReading",
      headerName: <FormattedLabel id="inMeterReading" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "outMeterReading",
      headerName: <FormattedLabel id="outMeterReading" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "totalKm",
      headerName: <FormattedLabel id="totalKm" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "travelDestination",
      headerName: "Travel Destination",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "approxKm",
      headerName: "Approx Km",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "driverLicenceNumber",
      headerName: <FormattedLabel id="driverLicenceNumber" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "meterReading",
      headerName: "Meter Reading",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "inTimeFormatted",
      headerName: <FormattedLabel id="inTime" />,
      // type: "number",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "outTimeFormatted",
      headerName: <FormattedLabel id="outTime" />,
      // type: "number",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "driverAuthorization",
      headerName: "Driver Authorization",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "inOutStatus",
      headerName: <FormattedLabel id="inOutStatus" />,
      // type: "number",
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
            {/* <IconButton
            >
              <PrintIcon style={{ color: "#556CD6" }} />
            </IconButton> */}
            {params.row.inOutStatus == "In" && (
              <Tooltip title="Vehicle Out">
                <IconButton
                  onClick={() => {
                    handleOpen(params);
                  }}
                >
                  <ExitToAppIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </Tooltip>
            )}
            {params.row.inOutStatus == "Out" && (
              <Tooltip title="Vehicle In">
                <IconButton
                  onClick={() => {
                    handleOpen(params);
                  }}
                >
                  <ReplyIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  const resetValuesCancell = {
    departmentKey: null,
    vehicle_number: "",
    driver_name: "",
    buildingName: null,
    zoneKey: null,
    wardKey: null,
    vehicle_name: null,
    mobile_number: "",
    licence_number: "",
    inRemark: "",
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
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

  useEffect(() => {
    getAllVehicle();
    getDepartment();
  }, []);

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              {/* Vehicle In/Out Entry */}
              <FormattedLabel id="vehicleIn_OutEntry" />
            </h2>
          </Box>
          <Head>
            <title>Vehicle In/Out Entry</title>
          </Head>
          {isOpenCollapse ? (
            <>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
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
                      name="vehicle"
                      control={control}
                      defaultValue="government_vehicle"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          defaultValue="government_vehicle"
                        >
                          <FormControlLabel
                            value="government_vehicle"
                            control={<Radio />}
                            label={<FormattedLabel id="governmentVehicle" />}
                          />
                          <FormControlLabel
                            value="private_vehicle"
                            control={<Radio />}
                            label={<FormattedLabel id="privateVehicle" />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>

                  {/* {watch("vehicle") === "government_vehicle" && ( */}
                  <>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                          sx={{ width: "45%" }}
                          fullWidth
                          id="outlined-basic"
                          // label="Vehicle No."
                          label={<FormattedLabel id="vehicleNumber" />}
                          size="small"
                          placeholder="MH12NN1234"
                          variant="outlined"
                          {...register("enteredVehicleNum")}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          disabled={!watch("enteredVehicleNum")}
                          variant="contained"
                          size="small"
                          onClick={() => {
                            searchVehicleDetails(watch("enteredVehicleNum")?.toUpperCase());
                          }}
                        >
                          <FormattedLabel id="searchVehicleDetails" />
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                  {/* )} */}

                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Controller
                        name="vehicleInOrOut"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="vehicleIn"
                          >
                            <FormControlLabel
                              value="vehicleIn"
                              control={<Radio />}
                              label={<FormattedLabel id="vehicleIn" />}
                            />
                            <FormControlLabel
                              value="vehicleOut"
                              control={<Radio />}
                              label={<FormattedLabel id="vehicleOut" />}
                            />
                          </RadioGroup>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      {console.log("watch ve", watch("vehicleInNumber"))}
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        variant="outlined"
                        id="standard-basic"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        value={nextVehicleNumber}
                        // value={Number(totalInOut?.Values[0]["Total_in"]) + 1}
                        label={<FormattedLabel id="vehicleInNumber" />}
                        size="small"
                        {...register("vehicleInNumber")}
                        error={errors.vehicleInNumber}
                        helperText={errors.vehicleInNumber ? errors.vehicleInNumber.message : null}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        variant="outlined"
                        id="standard-basic"
                        label={<FormattedLabel id="vehicleNumber" required />}
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...register("vehicle_number")}
                        error={errors.vehicle_number}
                        helperText={errors.vehicle_number ? errors.vehicle_number.message : null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        id="standard-basic"
                        variant="outlined"
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        label={<FormattedLabel id="driverName" required />}
                        {...register("driver_name")}
                        error={errors.driver_name}
                        helperText={errors.driver_name ? errors.driver_name.message : null}
                      />
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
                          <FormattedLabel id="wardName" />
                        </InputLabel>
                        <Controller
                          name="wardKey"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // {...field}
                              onChange={(value) => field.onChange(value)}
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
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.departmentKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="departmentName" required />}
                        </InputLabel>
                        <Controller
                          name="departmentKey"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // {...field}
                              onChange={(value) => field.onChange(value)}
                              value={field.value}
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
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.vehicle_name}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="vehicleName" required />}
                        </InputLabel>
                        <Controller
                          name="vehicle_name"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // {...field}
                              onChange={(value) => field.onChange(value)}
                              value={field.value}
                              label={<FormattedLabel id="vehicleName" required />}
                            >
                              {vehicleTypes.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item}>
                                    {item}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.vehicle_name ? errors.vehicle_name.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        name="mobile_number"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            // type="number"
                            {...field}
                            size="small"
                            label={<FormattedLabel id="mobileNumber" required />}
                            fullWidth
                            sx={{ width: "90%" }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={errors.mobile_number}
                            helperText={errors.mobile_number ? errors.mobile_number.message : null}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    {console.log("watch", watch("vehicleInOrOut"))}
                    {watch("vehicleInOrOut") === "vehicleOut" ? (
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Controller
                          control={control}
                          name="vehicleOutDateTime"
                          defaultValue={new Date()}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => (
                                  <TextField {...props} fullWidth sx={{ width: "90%" }} size="small" />
                                )}
                                // label={<FormattedLabel id="vehicleOutDateTime" required />}
                                label="Vehicle Out Date Time"
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                error={errors.vehicleOutDateTime}
                                helperText={
                                  errors.vehicleOutDateTime ? errors.vehicleOutDateTime.message : null
                                }
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Controller
                          control={control}
                          name="vehicleInDateTime"
                          defaultValue={new Date()}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                {...field}
                                renderInput={(props) => (
                                  <TextField {...props} fullWidth sx={{ width: "90%" }} size="small" />
                                )}
                                label={<FormattedLabel id="vehicleInDateTime" required />}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                error={errors.vehicleInDateTime}
                                helperText={
                                  errors.vehicleInDateTime ? errors.vehicleInDateTime.message : null
                                }
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                                defaultValue={new Date()}
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        name="licence_number"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            label={<FormattedLabel id="licenceNumber" required />}
                            fullWidth
                            sx={{ width: "90%" }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={errors.licence_number}
                            helperText={errors.licence_number ? errors.licence_number.message : null}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
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
                        <FormattedLabel id="vehiclePhoto" />
                      </Typography>
                      <Box>
                        <UploadButtonThumbOP
                          appName={appName}
                          fileName={"vehiclePhoto.png"}
                          serviceName={serviceName}
                          fileDtl={getValues("vehiclePhoto")}
                          fileKey={"vehiclePhoto"}
                          showDel={pageMode != "VEHICLE ENTRY" ? false : true}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        size="small"
                        fullWidth
                        sx={{ width: "90%" }}
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="inRemark" />}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        {...register("inRemark")}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
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
                        <FormattedLabel id="authorityLetter" />
                      </Typography>
                      <Box>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          filePath={(path) => {
                            handleUploadDocument(path);
                          }}
                          fileName={getValues("authorityLetter.png") && "authorityLetter.png"}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  {watch("vehicle") === "government_vehicle" && (
                    <>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Controller
                            name="travel_destination"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                label={<FormattedLabel id="travelDestinationDetails" required />}
                                fullWidth
                                sx={{ width: "90%" }}
                                InputLabelProps={{ shrink: true }}
                                error={errors.travel_destination}
                                helperText={
                                  errors.travel_destination ? errors.travel_destination.message : null
                                }
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Controller
                            name="approx_km"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={<FormattedLabel id="approxKm" />}
                                fullWidth
                                sx={{ width: "90%" }}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                // error={!!errors.approx_km}
                                // helperText={errors?.approx_km ? errors.approx_km.message : null}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Controller
                            name="current_meter_reading"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={<FormattedLabel id="currentMeterReading" required />}
                                size="small"
                                fullWidth
                                sx={{ width: "90%" }}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.current_meter_reading}
                                helperText={
                                  errors?.current_meter_reading ? errors.current_meter_reading.message : null
                                }
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}

                  <Box>
                    <Box>
                      {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // margin: ".5vh 0",
                  }}
                >
                  <Controller
                    name="vehicle_in_out"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        row
                        {...field}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue="vehicle_in"
                      >
                        <FormControlLabel
                          value="vehicle_in"
                          control={<Radio />}
                          label="Vehicle IN"
                        />
                        <FormControlLabel
                          value="vehicle_out"
                          control={<Radio />}
                          label="Vehicle OUT"
                        />
                      </RadioGroup>
                    )}
                  />
                </Box> */}
                      {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // margin: "1vh 0",
                  }}
                >
                  <Typography sx={{ margin: "0 20px" }}>
                    Vehicle Type
                  </Typography>
                  <Controller
                    name="vehicle_type"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={vehicleTypes[0].label}>
                        {vehicleTypes.map((item) => {
                          return (
                            <MenuItem value={item.value}>{item.label}</MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </Box> */}
                      {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "1vh 0",
                  }}
                >
                  <Typography sx={{ margin: "0 20px" }}>
                    Vehicle Driver Name
                  </Typography>
                  <Controller
                    name="vehicle_driver_name"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={vehicleDriverNames[0].label}>
                        {vehicleDriverNames.map((item) => {
                          return (
                            <MenuItem value={item.value}>{item.label}</MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </Box> */}

                      {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "1vh 0",
                  }}
                >
                  <Typography sx={{ margin: "0 20px" }}>
                    Vehicle Out Date & Time
                  </Typography>
                  <Controller
                    name="vehicle_out_date_time"
                    control={control}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          disabled={data.rows.length !== 0 ? false : true}
                          label={
                            <span style={{ fontSize: 16 }}>
                              Vehicle Out Time
                            </span>
                          }
                          value={field.value || null}
                          onChange={(time) => field.onChange(time)}
                          selected={field.value}
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
                </Box> */}
                    </Box>
                  </Box>
                  {/* <Box className={styles.DriverThumb}>
                    <Typography sx={{ margin: "0 1vh" }}>
                      <FormattedLabel id="driverThumbSignature" />
                    </Typography>
                    <Button>
                      <FingerprintIcon />
                    </Button>
                  </Box> */}
                  <Box>
                    <Fingerprint
                      base64String={base64String}
                      setFingerPrintImg={setFingerPrintImg}
                      setBase64String={setBase64String}
                      appName={appName}
                      serviceName={serviceName}
                    />
                  </Box>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
                      <Button variant="contained" size="small" type="submit">
                        <FormattedLabel id="save" />
                      </Button>
                    </Grid>
                    <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
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
            </>
          ) : (
            <>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  xs={3}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    {<FormattedLabel id="date" />}
                    {` : ${moment(new Date()).format("DD-MM-YYYY")}`}
                  </Typography>
                </Grid>
                <Grid
                  xs={6}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Chart
                    options={{
                      chart: {
                        stacked: false,
                        xaxis: {
                          categories: ["in,out"],
                        },
                      },
                    }}
                    series={[
                      {
                        name: "In",
                        data: [{ x: 1, y: totalInOut?.Values[0]["Total_in"] }],
                      },
                      {
                        name: "Out",
                        data: [{ x: 1, y: totalInOut?.Values[0]["Total_out"] }],
                      },
                    ]}
                    type="bar"
                    width={"500"}
                    height={"300"}
                  />
                </Grid>

                <Grid
                  xs={3}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    <FormattedLabel id="totalIn" /> : {totalInOut?.Values[0]["Total_in"]}{" "}
                    <FormattedLabel id="totalOut" /> : {totalInOut?.Values[0]["Total_out"]}
                  </Typography>
                </Grid>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    sx={{ margin: "10px" }}
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
                </Box>
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
                  getAllVehicle(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  // updateData("page", 1);
                  getAllVehicle(_data, data.page);
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
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {paramsData?.row?.inOutStatus == "In" ? (
                      <>
                        <FormControl fullWidth>
                          <Controller
                            control={control}
                            name="vehicleOutDateTime"
                            defaultValue={new Date()}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                  {...field}
                                  renderInput={(props) => (
                                    <TextField {...props} fullWidth sx={{ width: "90%" }} size="small" />
                                  )}
                                  label="Vehicle Out Date Time"
                                  minTime={moment(paramsData.row.inTime)}
                                  minDate={moment(paramsData.row.inTime)}
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  inputFormat="DD-MM-YYYY hh:mm:ss"
                                  defaultValue={new Date()}
                                  error={errors.vehicleOutDateTime}
                                  helperText={
                                    errors.vehicleOutDateTime ? errors.vehicleOutDateTime.message : null
                                  }
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </FormControl>
                        {/* <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "10px",
                          }}
                        > */}
                        {/* {paramsData?.row?.inOutStatus == "In" ? ( */}
                        <TextField
                          size="small"
                          fullWidth
                          style={{ backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="currentMeterReading" />}
                          variant="outlined"
                          {...register("outMeterReading")}
                          error={!!errors.outMeterReading}
                          onChange={(e) => {
                            setOutMeterReading(e.target.value);
                            console.log("e.target.value", e.target.value);
                          }}
                          helperText={errors?.outMeterReading ? errors.outMeterReading.message : null}
                        />
                        {/* ) : (
                  <TextField
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="inRemark" />}
                    variant="outlined"
                    {...register("inRemark")}
                  />
                )} */}
                        {/* </Box> */}
                      </>
                    ) : (
                      <FormControl fullWidth>
                        <Controller
                          control={control}
                          name="vehicleInDateTime"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => <TextField {...props} fullWidth size="small" />}
                                label="Vehicle In Date Time"
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                error={errors.vehicleInDateTime}
                                helperText={
                                  errors.vehicleInDateTime ? errors.vehicleInDateTime.message : null
                                }
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </FormControl>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    {/* {paramsData?.row?.inOutStatus == "In" ? ( */}
                    <TextField
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="outRemark" />}
                      variant="outlined"
                      {...register("outRemark")}
                      error={!!errors.outRemark}
                      onChange={(e) => {
                        setOutRemark(e.target.value);
                        console.log("e.target.value", e.target.value);
                      }}
                      helperText={errors?.outRemark ? errors.outRemark.message : null}
                    />
                    {/* ) : (
                  <TextField
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="inRemark" />}
                    variant="outlined"
                    {...register("inRemark")}
                  />
                )} */}
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
                        console.log("paramsData.row", paramsData);
                        setBtnSaveText("Checkout");
                        setRowId(paramsData.row.id);
                        onSubmitForm(paramsData.row, "Checkout");
                        setOpen(false);
                      }}
                    >
                      <FormattedLabel id="submit" />
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </>
          )}
        </>
      )}
    </Paper>
  );
}
export default VehicleEntry;
