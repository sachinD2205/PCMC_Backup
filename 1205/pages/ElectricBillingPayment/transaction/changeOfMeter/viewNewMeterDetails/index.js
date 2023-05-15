import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Slide,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import BasicLayout from "../../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/changeOfLoadSchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../../../features/labelSlice";
import urls from "../../../../../URLS/urls";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
  };

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  const router = useRouter();
  const [consumerNo, setConsumerNo] = useState("");
  const [openEntryConnections, setOpenEntryConnections] = React.useState(false);
  const [changeMeterData, setChangeMeterData] = useState({});
  const [open, setOpen] = React.useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [openViewForm, setOpenViewForm] = React.useState(false);
  const handleOpenEntryConnections = () => setOpenEntryConnections(true);
  const handleCloseEntryConnections = () => setOpenEntryConnections(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenViewForm = () => setOpenViewForm(true);
  const handleCloseViewForm = () => setOpenViewForm(false);
  const [dataSource, setDataSource] = useState({});
  const [searchedConnections, setSearchedConnections] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [loadTypeDropDown, setLoadTypeDropDown] = useState([
    {
      id: 1,
      loadType: "",
      loadTypeMr: "",
    },
  ]);

  useEffect(() => {
    getChangeOfMeterData(router.query.id);
   approvalValidation()

  }, [router.query.id]);

  useEffect(() => {
    let _res = changeMeterData;
    setValue("oldCapacity", _res ? _res?.oldCapacity : "-");
    setValue("oldCapacityKey", _res ? _res?.oldCapacityKey : "-");
    setValue("oldQuantity", _res ? _res?.oldQuantity : "-");
    setValue("quantity", _res ? _res?.quantity : "-");
    setValue("newCapacity", _res ? _res?.newCapacity : "-");
    setValue("newCapacityKey", _res ? _res?.newCapacityKey : "-");
    setValue("newQuantity", _res ? _res?.newQuantity : "-");
    setValue("increaseLoad", _res ? _res?.increaseLoad : "-");
    setValue("baseLineLoad", _res ? _res?.baseLineLoad : "-");
    setValue("reasonForChange", _res ? _res?.reasonForChange : "-");
    getMeterStatus();
  }, [changeMeterData]);

  useEffect(()=>{
    let _res = changeMeterData;
    getNewMeterStatus(_res?.newMeterStatusKey)
    setValue('oldMeterClosingDate', _res?.oldMeterClosingDate ? _res?.oldMeterClosingDate : "-")
    setValue('oldMeterLastReading', _res?.oldMeterLastReading ? _res?.oldMeterLastReading : "-")
    setValue('newMeterInitialReading', _res?.newMeterInitialReading ? _res?.newMeterInitialReading : "-")
    setValue('newMeterInstallationDate', _res?.newMeterInstallationDate ? _res?.newMeterInstallationDate : "-")
    setValue('newMeterNo', _res?.newMeterNo ? _res?.newMeterNo : "-")
    setValue('reasonForChange', _res?.reasonForChange ? _res?.reasonForChange : "-")
    setValue('oldMeterNo', _res?.oldMeterNo ? _res?.oldMeterNo : "-")
  },[changeMeterData]);

  useEffect(() => {
    getWard();
    getDepartment();
    getZone();
    getConsumptionType();
    getLoadType();
    getPhaseType();
    getSlabType();
    getUsageType();
    getMsedclCategory();
    getBillingDivisionAndUnit();
    getSubDivision();
    getDepartmentCategory();
    getBillingCycle();

    let _res = dataSource;
    console.log("dataSource",dataSource)
    setValue(
      "consumerName",
      !_res?.consumerName ? "-" : language === "en" ? _res?.consumerName : _res?.consumerName,
    );
    setValue(
      "consumerAddress",
      !_res?.consumerAddress ? "-" : language === "en" ? _res?.consumerAddress : _res?.consumerAddress,
    );
    setValue("pinCode", !_res?.pinCode ? "-" : language === "en" ? _res?.pinCode : _res?.pinCode);
    setValue("meterConnectionDate", !_res?.meterConnectionDate ? "-" : _res?.meterConnectionDate);
    setValue(
      "geoCodeGisId",
      !_res?.geoCodeGisId ? "-" : language === "en" ? _res?.geoCodeGisId : _res?.geoCodeGisId,
    );
    setValue("latitude", !_res?.latitude ? "-" : language === "en" ? _res?.latitude : _res?.latitude);
    setValue("longitude", !_res?.longitude ? "-" : language === "en" ? _res?.longitude : _res?.longitude);
  }, [dataSource, language]);

  const getMeterStatus = () => {
    axios.get(`${urls.EBPSURL}/mstMeterStatus/getAll`).then((res) => {
      let temp = res.data.mstMeterStatusList;
      let result = temp && temp.find((each)=>each.id == changeMeterData?.oldMeterStatusKey)
      console.log("getMeterStatus", result);
      setValue('oldMeterStatusKey', !result ? "-" : language == "en" ? result?.meterStatus : result?.meterStatusMr)
    });
  };

  const getNewMeterStatus = (newMeterStatusKey) => {
    axios.get(`${urls.EBPSURL}/mstMeterStatus/getAll`).then((res) => {
      let temp = res.data.mstMeterStatusList;
      let result = temp && temp.find((each)=>each.id == newMeterStatusKey)
      console.log("getMeterStatus", result);
      setValue('newMeterStatusKey', !result ? "-" : language == "en" ? result?.meterStatus : result?.meterStatusMr)
    });
  };

  // get Ward Name
  const getWard = () => {
    // console.log("dataSource", dataSource);
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      let temp = res.data.ward;
      // console.log("getWard", temp);
      let _res = temp.find((each) => {
        return each.id === dataSource?.wardKey;
      });
      setValue("wardKey", !_res?.wardName ? "-" : language === "en" ? _res?.wardName : _res?.wardNameMr);
    });
  };

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      let temp = res.data.department;
      // console.log("getDepartment",temp)
      let _res = temp.find((obj) => obj.id === dataSource?.departmentKey);
      setValue(
        "departmentKey",
        !_res?.department ? "-" : language === "en" ? _res?.department : _res?.departmentMr,
      );
    });
  };

  // get Zone Name
  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      let temp = res.data.zone;
      // console.log("getZone",temp)
      let _res = temp.find((obj) => obj.id === dataSource?.zoneKey);
      setValue("zoneKey", !_res?.zoneName ? "-" : language === "en" ? _res?.zoneName : _res?.zoneNameMr);
    });
  };

  // get Consumption Type
  const getConsumptionType = () => {
    axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
      let temp = res.data.mstConsumptionTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.consumptionTypeKey);
      console.log("getConsumptionType",_res);
      setValue(
        "consumptionType",
        !_res?.consumptionType ? "-" : language === "en" ? _res?.consumptionType : _res?.consumptionTypeMr,
      );
    });
  };

  // get Billing Cycle
  const getBillingCycle = () => {
    axios.get(`${urls.EBPSURL}/mstBillingCycle/getAll`).then((res) => {
      let temp = res.data.mstBillingCycleList;
      // console.log("getBillingCycle",temp);
      let _res = temp.find((obj) => obj.id === dataSource?.billingCycleKey);
      setValue(
        "billingCycleKey",
        !_res?.billingCycle ? "-" : language === "en" ? _res?.billingCycle : _res?.billingCycleMr,
      );
    });
  };

  // get Load Type
  const getLoadType = () => {
    axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
      let temp = res.data.mstLoadTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.loadTypeKey);
      console.log("getLoadType", _res);
      setValue("loadTypeKey", !_res ? "-" : language == "en" ? _res?.loadType : _res?.loadTypeMr);
    });
  };

  // get Phase Type
  const getPhaseType = () => {
    axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
      let temp = res.data.mstPhaseTypeList;
      // console.log("getPhaseType",temp);
      let _res = temp.find((obj) => obj.id === dataSource?.phaseKey);
      setValue("phaseKey", !_res?.phaseType ? "-" : language === "en" ? _res?.phaseType : _res?.phaseTypeMr);
    });
  };

  // get Slab Type
  const getSlabType = () => {
    axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
      let temp = res.data.mstSlabTypeList;
      // console.log("getSlabType",temp);
      let _res = temp.find((obj) => obj.id === dataSource?.slabTypeKey);
      setValue("slabTypeKey", !_res?.slabType ? "-" : language === "en" ? _res?.slabType : _res?.slabTypeMr);
    });
  };

  // get Usage Type
  const getUsageType = () => {
    axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
      let temp = res.data.mstEbUsageTypeList;
      // console.log("getUsageType",temp);
      let _res = temp.find((obj) => obj.id === dataSource?.usageTypeKey);
      setValue(
        "usageTypeKey",
        !_res?.usageType ? "-" : language === "en" ? _res?.usageType : _res?.usageTypeMr,
      );
    });
  };

  // get Msedcl Category
  const getMsedclCategory = () => {
    axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
      let temp = res.data.mstMsedclCategoryList;
      // console.log("getMsedclCategory",temp);
      let _res = temp.find((obj) => obj.id === dataSource?.msedclCategoryKey);
      setValue(
        "msedclCategoryKey",
        !_res?.msedclCategory ? "-" : language === "en" ? _res?.msedclCategory : _res?.msedclCategoryMr,
      );
    });
  };

  // get Billing Division And Unit
  const getBillingDivisionAndUnit = () => {
    axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
      let temp = res.data.mstBillingUnitList;
      // console.log("getBillingDivisionAndUnit",dataSource);
      let _res = temp.find((obj) => obj.id === dataSource?.billingUnitKey);
      setValue(
        "billingUnitKey",
        !_res?.billingUnitNo
          ? "-"
          : language === "en"
          ? `${_res?.divisionName}/${_res?.billingUnitNo}`
          : `${_res?.divisionNameMr}/${_res?.billingUnitNo}`,
      );
    });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
      let temp = res.data.mstSubDivisionList;
      // console.log("getSubDivision",temp);
      let _res = temp.find((obj) => obj.id === dataSource?.subDivisionKey);
      setValue(
        "subDivisionKey",
        !_res?.subDivision ? "-" : language === "en" ? _res?.subDivision : _res?.subDivisionMr,
      );
    });
  };

  // get Department Category
  const getDepartmentCategory = () => {
    axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
      let temp = res.data.mstDepartmentCategoryList;
      // console.log("getDepartmentCategory",temp);
      let _res = temp.find((obj) => obj.id === dataSource?.departmentCategoryKey);
      setValue(
        "departmentCategoryKey",
        !_res?.departmentCategory
          ? "-"
          : language === "en"
          ? _res?.departmentCategory
          : _res?.departmentCategoryMr,
      );
    });
  };

  const getChangeOfMeterData = (id) => {
    console.log("ChangeMeterId", id);
    if (id) {
      axios
        .get(`${urls.EBPSURL}/trnChangeOfMeter/getById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          let temp = res.data;
          console.log("getChangeOfMeterData", res.data);
          setConsumerNo(temp?.consumerNo);
          handleSearchConnections(temp?.consumerNo);
          setChangeMeterData(temp);
        });
    }
  };

  // handle search connections
  const handleSearchConnections = (consumerNo) => {
    console.log("consumerNo", consumerNo);
    if (consumerNo) {
      axios
        .get(`${urls.EBPSURL}/trnNewConnectionEntry/search/consumerNo?consumerNo=${consumerNo}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          let result = r.data.trnNewConnectionEntryList;
          console.log("handleSearchConnections", result);
          setDataSource(result[0]);
        });
    }
  };

  const approvalValidation = () => {
    let dyEng = authority && authority.find((val) => val === "DEPUTY_ENGINEER");
    let exeEng = authority && authority.find((val) => val === "EXECUTIVE_ENGINEER");

    console.log("disable",dyEng === "DEPUTY_ENGINEER" && changeMeterData?.status == 3)

    return dyEng === "DEPUTY_ENGINEER" &&
      (changeMeterData?.status == 3)
      ? false
      : exeEng === "EXECUTIVE_ENGINEER" && (changeMeterData?.status == 5)
      ? false
      : true;
  };

  const onSubmitForm = (btnType) => {
    let formData = {
      ...changeMeterData,
      remarks: formData?.remarks,
      isComplete: false,
    };
    if (btnType === "Save") {
      let _body = {
        ...formData,
        isApproved: true,
      };
      console.log("Approve button ...........", _body);
      const tempData = axios
        .post(`${urls.EBPSURL}/trnChangeOfMeter/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Approve!", "Changed Meter Send For Approval Successfully !", "success");
            getChangeOfMeterData();
            router.push("/ElectricBillingPayment/transaction/changeOfMeter/changeOfMeterDetails");
          }
        });
    } else if (btnType === "Revert") {
      let _body = {
        ...formData,
        isApproved: false,
      };
      console.log("Revert button ...........", _body);
      const tempData = axios
        .post(`${urls.EBPSURL}/trnChangeOfMeter/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Revert!", "Changed Meter Send For Revert Successfully !", "success");
            getChangeOfMeterData();
            router.push("/ElectricBillingPayment/transaction/changeOfMeter/changeOfMeterDetails");
          }
        });
    } else if (btnType === "Complete") {
      let _body = {
        ...formData,
        isApproved: null,
        isComplete: true,
      };
      console.log("Complete button ...........", _body);
      const tempData = axios
        .post(`${urls.EBPSURL}/trnChangeOfMeter/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Complete!", "Changed Meter Send For Complete Successfully !", "success");
            getChangeOfMeterData();
            router.push("/ElectricBillingPayment/transaction/changeOfMeter/changeOfMeterDetails");
          }
        });
    } else if (btnType === "Reject") {
      let _body = {
        ...formData,
        isApproved: null,
        isComplete: false,
        isReject: true,
      };
      console.log("Reject button ...........", _body);
      const tempData = axios
        .post(`${urls.EBPSURL}/trnChangeOfMeter/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Reject!", "Changed Meter Send For Rejected Successfully !", "success");
            getChangeOfMeterData();
            router.push("/ElectricBillingPayment/transaction/changeOfMeter/changeOfMeterDetails");
          }
        });
    }
  };

  // cancell Button
  const handleClearButton = () => {
    reset({
      ...resetValuesForClear,
      id: id ? id : null,
    });
  };

  // Reset Values Cancell
  const resetValuesForClear = {
    loadTypeKey: "",
  };

  // Exit Button
  const handleExitButton = () => {
    reset({
      ...resetValuesForClear,
      id: null,
    });
    router.push(`/ElectricBillingPayment/transaction/changeOfMeter/changeOfMeterDetails`);
  };

  const columns = [
    //Sr No
    { field: "srNo", width: 50, headerName: <FormattedLabel id="srNo" />, flex: 1 },

    // consumerNo
    {
      field: language === "en" ? "consumerNo" : "consumerNo",
      headerName: <FormattedLabel id="consumerNo" />,
      flex: 1,
    },

    // consumerName
    {
      field: language === "en" ? "consumerName" : "consumerNameMr",
      headerName: <FormattedLabel id="consumerName" />,
      flex: 1,
    },

    // consumerAddress
    {
      field: language === "en" ? "consumerAddress" : "consumerAddressMr",
      headerName: <FormattedLabel id="consumerAddress" />,
      flex: 1,
    },

    // meterNo
    {
      field: language === "en" ? "meterNo" : "=meterNoMr",
      headerName: <FormattedLabel id="MeterNumber" />,
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                handleSelectConnection(params.row.id);
              }}
            >
              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Row

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
      <FormProvider {...methods}>
        <form>
          {/* Firts Row */}

          {/* search conneaction entry by consumer number */}

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
              <FormattedLabel id="searchEntryConnection" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <TextField
                  disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  label={<FormattedLabel id="consumerNo" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  value={consumerNo}
                  onChange={(e) => {
                    setConsumerNo(e.target.value);
                  }}
                  error={!!errors.consumerNo}
                  helperText={errors?.consumerNo ? errors.consumerNo.message : null}
                />
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button variant="contained" onClick={handleSearchConnections}>
                  {<FormattedLabel id="search" />}
                </Button>
              </Grid>
            </Grid>
          </Grid>

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
              <FormattedLabel id="consumerDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Zone */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="zone" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("zoneKey")}
                InputLabelProps={{
                  //true
                  shrink: (watch("zoneKey") ? true : false) || (router.query.zoneKey ? true : false),
                }}
              />
            </Grid>

            {/* Ward Name */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="ward" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("wardKey")}
                InputLabelProps={{
                  //true
                  shrink: (watch("wardKey") ? true : false) || (router.query.wardKey ? true : false),
                }}
              />
            </Grid>

            {/* Department Name */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="deptName" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("departmentKey")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("departmentKey") ? true : false) || (router.query.departmentKey ? true : false),
                }}
              />
            </Grid>

            {/* Second Row */}

            {/* Consumer Name */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="consumerName" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("consumerName")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("consumerName") ? true : false) || (router.query.consumerName ? true : false),
                }}
              />
            </Grid>

            {/*Consumer Address */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="consumerAddress" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("consumerAddress")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("consumerAddress") ? true : false) ||
                    (router.query.consumerAddress ? true : false),
                }}
              />
            </Grid>

            {/* Pin Code */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="pincode" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("pinCode")}
                InputLabelProps={{
                  //true
                  shrink: (watch("pinCode") ? true : false) || (router.query.pinCode ? true : false),
                }}
              />
            </Grid>

            {/* Consumption Type */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="consumptionType" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("consumptionType")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("consumptionType") ? true : false) ||
                    (router.query.consumptionType ? true : false),
                }}
              />
            </Grid>

            {/* Phase Type */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="phaseType" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("phaseKey")}
                InputLabelProps={{
                  //true
                  shrink: (watch("phaseKey") ? true : false) || (router.query.phaseKey ? true : false),
                }}
              />
            </Grid>

            {/* Slab Type */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="slabType" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("slabTypeKey")}
                InputLabelProps={{
                  //true
                  shrink: (watch("slabTypeKey") ? true : false) || (router.query.slabTypeKey ? true : false),
                }}
              />
            </Grid>

            {/* Usage Type */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="ebUsageType" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("usageTypeKey")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("usageTypeKey") ? true : false) || (router.query.usageTypeKey ? true : false),
                }}
              />
            </Grid>

            {/* MSEDCL Category */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="msedclCategory" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("msedclCategoryKey")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("msedclCategoryKey") ? true : false) ||
                    (router.query.msedclCategoryKey ? true : false),
                }}
              />
            </Grid>

            {/* Billing Division/Unit */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="billingUnitAndDivision" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("billingUnitKey")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("billingUnitKey") ? true : false) || (router.query.billingUnitKey ? true : false),
                }}
              />
            </Grid>

            {/* SubDivision */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="subDivision" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("subDivisionKey")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("subDivisionKey") ? true : false) || (router.query.subDivisionKey ? true : false),
                }}
              />
            </Grid>

            {/* Department Category */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="departmentCategory" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("departmentCategoryKey")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("departmentCategoryKey") ? true : false) ||
                    (router.query.departmentCategoryKey ? true : false),
                }}
              />
            </Grid>

            {/* Meter Connection Date */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="meterConnectionDate" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={moment(watch('meterConnectionDate')).format("DD-MM-YYYY")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("meterConnectionDate") ? true : false) ||
                    (router.query.meterConnectionDate ? true : false),
                }}
              />
            </Grid>

            {/* Second Row */}

            {/* Geo Code/Gis Id */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="geoCodeGisId" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("geoCodeGisId")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("geoCodeGisId") ? true : false) || (router.query.geoCodeGisId ? true : false),
                }}
              />
            </Grid>

            {/* Billing Cycle */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="billingCycle" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("billingCycleKey")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("billingCycleKey") ? true : false) ||
                    (router.query.billingCycleKey ? true : false),
                }}
              />
            </Grid>

            {/* Latitude */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="latitude" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("latitude")}
                InputLabelProps={{
                  //true
                  shrink: (watch("latitude") ? true : false) || (router.query.latitude ? true : false),
                }}
              />
            </Grid>

            {/* Longitude */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="longitude" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={watch("longitude")}
                InputLabelProps={{
                  //true
                  shrink: (watch("longitude") ? true : false) || (router.query.longitude ? true : false),
                }}
              />
            </Grid>
          </Grid>

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
              <FormattedLabel id="changeOfMeter" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>

            {/* Old Meter Closing Date */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="oldMeterClosingDate"
                id="standard-textarea"
                label={<FormattedLabel id="oldMeterClosingDate" />}
                variant="standard"
                value={moment(watch('oldMeterClosingDate')).format("DD-MM-YYYY")}
                error={!!errors.oldMeterClosingDate}
                helperText={errors?.oldMeterClosingDate ? errors?.oldMeterClosingDate.message : null}
                InputLabelProps={{
                  //true
                  shrink: (watch("oldMeterClosingDate") ? true : false) || (router.query.oldMeterClosingDate ? true : false),
                }}
              />
            </Grid>

            {/* Old Meter Last Reading */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="oldMeterLastReading"
                id="standard-textarea"
                label={<FormattedLabel id="oldMeterLastReading" />}
                variant="standard"
                value={watch("oldMeterLastReading")}
                error={!!errors.oldMeterLastReading}
                helperText={errors?.oldMeterLastReading ? errors?.oldMeterLastReading.message : null}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("oldMeterLastReading") ? true : false) ||
                    (router.query.oldMeterLastReading ? true : false),
                }}
              />
            </Grid>

            {/* Old Meter No */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="oldMeterNo"
                id="standard-textarea"
                label={<FormattedLabel id="oldMeterNo" />}
                variant="standard"
                value={watch("oldMeterNo")}
                error={!!errors.oldMeterNo}
                helperText={errors?.oldMeterNo ? errors?.oldMeterNo.message : null}
                InputLabelProps={{
                  //true
                  shrink: (watch("oldMeterNo") ? true : false) || (router.query.oldMeterNo ? true : false),
                }}
              />
            </Grid>

            {/* Old Meter Status Key */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="oldMeterStatusKey"
                id="standard-textarea"
                label={<FormattedLabel id="oldMeterStatus" />}
                variant="standard"
                value={watch("oldMeterStatusKey")}
                error={!!errors.oldMeterStatusKey}
                helperText={errors?.oldMeterStatusKey ? errors?.oldMeterStatusKey.message : null}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("oldMeterStatusKey") ? true : false) ||
                    (router.query.oldMeterStatusKey ? true : false),
                }}
              />
            </Grid>

            {/* New Meter Initial Reading */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="newMeterInitialReading"
                id="standard-textarea"
                label={<FormattedLabel id="newMeterInitialReading" />}
                variant="standard"
                value={watch("newMeterInitialReading") }
                error={!!errors.newMeterInitialReading}
                helperText={errors?.newMeterInitialReading ? errors?.newMeterInitialReading.message : null}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("newMeterInitialReading") ? true : false) ||
                    (router.query.newMeterInitialReading ? true : false),
                }}
              />
            </Grid>

            {/* New Meter Installation Date */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="newMeterInstallationDate"
                id="standard-textarea"
                label={<FormattedLabel id="newMeterInstallationDate" />}
                variant="standard"
                value={moment(watch('newMeterInstallationDate')).format("DD-MM-YYYY")}
                error={!!errors.newMeterInstallationDate}
                helperText={errors?.newMeterInstallationDate ? errors?.newMeterInstallationDate.message : null}
                InputLabelProps={{
                  //true
                  shrink: (watch("newMeterInstallationDate") ? true : false) || (router.query.newMeterInstallationDate ? true : false),
                }}
              />
            </Grid>

            {/* New Meter No */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="newMeterNo"
                id="standard-textarea"
                label={<FormattedLabel id="newMeterNo" />}
                variant="standard"
                value={watch('newMeterNo')}
                error={!!errors.newMeterNo}
                helperText={errors?.newMeterNo ? errors?.newMeterNo.message : null}
                InputLabelProps={{
                  //true
                  shrink: (watch("newMeterNo") ? true : false) || (router.query.newMeterNo ? true : false),
                }}
              />
            </Grid>

            {/* New Meter Status Key */}

            {/* <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="newMeterStatusKey"
                id="standard-textarea"
                label={<FormattedLabel id="newMeterStatus" />}
                variant="standard"
                {...register("newMeterStatusKey")}
                error={!!errors.newMeterStatusKey}
                helperText={errors?.newMeterStatusKey ? errors?.newMeterStatusKey.message : null}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("newMeterStatusKey") ? true : false) ||
                    (router.query.newMeterStatusKey ? true : false),
                }}
              />
            </Grid> */}

            {/* New Meter Status */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="newMeterStatusKey"
                id="standard-textarea"
                label={<FormattedLabel id="newMeterStatus" />}
                variant="standard"
                value={watch("newMeterStatusKey")}
                error={!!errors.newMeterStatusKey}
                helperText={errors?.newMeterStatusKey ? errors?.newMeterStatusKey.message : null}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("newMeterStatusKey") ? true : false) ||
                    (router.query.newMeterStatusKey ? true : false),
                }}
              />
            </Grid>

            {/* Reason for Change */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                name="reasonForChange"
                id="standard-textarea"
                label={<FormattedLabel id="reasonForChange" />}
                variant="standard"
                value={watch("reasonForChange")}
                error={!!errors.reasonForChange}
                helperText={errors?.reasonForChange ? errors?.reasonForChange.message : null}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("reasonForChange") ? true : false) ||
                    (router.query.reasonForChange ? true : false),
                }}
              />
            </Grid>
          </Grid>

          {/* Add Remarks */}

          {authority &&
          authority.find((val) => val === "ENTRY") &&
          authority &&
          authority.find((val) => val === "PAYMENT VERIFICATION") ? (
            <></>
          ) : (
            <Grid container mt={5}>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-textarea"
                  label="Remarks"
                  sx={{ m: 1, minWidth: "83%" }}
                  multiline
                  variant="outlined"
                  {...register("remarks")}
                  error={!!errors.remarks}
                  helperText={errors?.remarks ? errors.remarks.message : null}
                  InputLabelProps={{
                    //true
                    shrink: (watch("remarks") ? true : false) || (router.query.remarks ? true : false),
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* Button Row */}

          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                disabled={approvalValidation()}
                onClick={() => {
                  onSubmitForm("Save");
                }}
              >
                {<FormattedLabel id="approve" />}
              </Button>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                variant="contained"
                disabled={approvalValidation()}
                onClick={() => {
                  onSubmitForm("Revert");
                }}
                // disabled={
                //   officialNotesheetFlag && billAFlag && billBFlag && formAFlag && formBFlag
                //     ? false
                //     : true
                // }
              >
                {<FormattedLabel id="revert" />}
              </Button>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                variant="contained"
                disabled={approvalValidation()}
                onClick={() => {
                  onSubmitForm("Reject");
                }}
                // disabled={
                //   officialNotesheetFlag && billAFlag && billBFlag && formAFlag && formBFlag
                //     ? false
                //     : true
                // }
              >
                {<FormattedLabel id="reject" />}
              </Button>
            </Grid>

            {/* <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  onSubmitForm("Complete");
                }}
                // disabled={
                //   officialNotesheetFlag && billAFlag && billBFlag && formAFlag && formBFlag
                //     ? false
                //     : true
                // }
              >
                {<FormattedLabel id="complete" />}
              </Button>
            </Grid> */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button variant="contained" onClick={handleExitButton}>
                {<FormattedLabel id="exit" />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;
