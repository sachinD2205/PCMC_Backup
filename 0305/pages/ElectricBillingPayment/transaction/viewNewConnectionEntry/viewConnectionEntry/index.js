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
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/connectionEntrySchema";
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
import theme from "../../../../../theme.js";
import styles from "./view.module.css";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
// import samplePdf from "../../../../../public/certificate.pdf"
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { setNewEntryConnection } from "../../../../../features/userSlice";
import IconButton from "@mui/material/IconButton";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
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
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const router = useRouter();
  const [dataSource, setDataSource] = useState({});
  const [ward, setWard] = useState("");
  const [department, setDepartment] = useState("");
  const [zone, setZone] = useState("");
  const [consumptionType, setConsumptionType] = useState("");
  const [loadType, setLoadType] = useState("");
  const [phaseType, setPhaseType] = useState("");
  const [slabType, setSlabType] = useState("");
  const [usageType, setUsageType] = useState("");
  const [msedclCategory, setMsedclCategory] = useState("");
  const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState("");
  const [subDivision, setSubDivision] = useState("");
  const [departmentCategory, setDepartmentCategory] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [desc, setDesc] = useState("");
  const [bank, setBank] = useState("");
  const [branch, setBranch] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [meterConnectionDate, setMeterConnectionDate] = useState("");
  const [sanctionedDemand, setSanctionedDemand] = useState("");
  const [contractDemand, setContractDemand] = useState("");
  const [billingCycle, setBillingCycle] = useState("");
  const [geoCodeGisId, setGeoCodeGisId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [buttonInputState, setButtonInputState] = useState();
  const [remark, setRemark] = useState("");
  const [approvalFlag, setApprovalFlag] = useState(false);
  const [completedFlag, setCompletedFlag] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [fetchData, setFetchData] = useState(null);
  const [documentList, setDocumentList] = useState([]);

  const language = useSelector((state) => state.labels.language);

  // get Connection Entry Data

  const entryConnectionData = useSelector((state) => state.user.entryConnectionData);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  useEffect(() => {
    getNewConnectionsData();
  });

  useEffect(() => {
    getNewConnectionsData();
  }, [router.query.id]);

  useEffect(() => {
    getNewConnectionsData();
    getWard();
    getDepartment();
    getZone();
    getConsumerDetails();
    getConsumptionType();
    getLoadType();
    getPhaseType();
    getSlabType();
    getUsageType();
    getMsedclCategory();
    getBillingDivisionAndUnit();
    getSubDivision();
    getDepartmentCategory();
    getBank();
    getBillingCycle();
  }, [dataSource]);

  function showDateFormat(date) {
    let formattedDate = date?.split("T");
    return formattedDate ? formattedDate[0] : "-";
  }

  //get Bank details
  const getBank = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((res) => {
      let temp = res.data.bank;
      let _res = temp.find((each) => {
        return each.id === dataSource?.bankBranchNameKey;
      });
      setBank(_res?.bankName ? _res?.bankName : "-");
      setBranch(_res?.branchName ? _res?.branchName : "-");
    });
  };

  // get Ward Name
  const getWard = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      let temp = res.data.ward;
      let _res = temp.find((each) => {
        return each.id === dataSource?.wardKey;
      });
      setWard(_res?.wardName ? _res?.wardName : "-");
    });
  };

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      let temp = res.data.department;
      let _res = temp.find((obj) => obj.id === dataSource?.departmentKey);
      setDepartment(_res?.department ? _res?.department : "-");
    });
  };

  // get Zone Name
  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      let temp = res.data.zone;
      let _res = temp.find((obj) => obj.id === dataSource?.zoneKey);
      setZone(_res?.zoneName ? _res?.zoneName : "-");
    });
  };

  const getConsumerDetails = () => {
    // setConsumerName(dataSource?.consumerName ? dataSource?.consumerName : "-");
    // setConsumerAddress(dataSource?.consumerAddress ? dataSource?.consumerAddress : "-");
    // setPincode(dataSource?.pinCode ? dataSource?.pinCode : "-");
    // setSanctionedLoad(dataSource?.sanctionedLoad ? dataSource?.sanctionedLoad : "-");
    // setConnectedLoad(dataSource?.connectedLoad ? dataSource?.connectedLoad : "-");
    // setQuotationDate(dataSource?.quotationDate ? dataSource?.quotationDate : "-");
    // setQuotationAmount(dataSource?.quotationAmount ? dataSource?.quotationAmount : "-");
    setQuotationNo(dataSource?.quotationNo ? dataSource?.quotationNo : "-");
    // setDesc(dataSource?.quotationDescription ? dataSource?.quotationDescription : "-");
    setIfscCode(dataSource?.ifscCode ? dataSource?.ifscCode : "-");
    showDateFormat(dataSource?.meterConnectionDate);
    setSanctionedDemand(dataSource?.sanctionedDemand ? dataSource?.sanctionedDemand : "-");
    setContractDemand(dataSource?.contractDemand ? dataSource?.contractDemand : "-");
    setGeoCodeGisId(dataSource?.geoCodeGisId ? dataSource?.geoCodeGisId : "-");
    setLatitude(dataSource?.latitude ? dataSource?.latitude : "-");
    setLongitude(dataSource?.longitude ? dataSource?.longitude : "-");
  };

  // get Consumption Type
  const getConsumptionType = () => {
    axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
      let temp = res.data.mstConsumptionTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.consumptionTypeKey);
      setConsumptionType(_res?.consumptionType ? _res?.consumptionType : "-");
    });
  };

  // get Billing Cycle
  const getBillingCycle = () => {
    axios.get(`${urls.EBPSURL}/mstBillingCycle/getAll`).then((res) => {
      let temp = res.data.mstBillingCycleList;
      let _res = temp.find((obj) => obj.id === dataSource?.billingCycleKey);
      setBillingCycle(_res?.billingCycle ? _res?.billingCycle : "-");
    });
  };

  // get Load Type
  const getLoadType = () => {
    axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
      let temp = res.data.mstLoadTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.loadTypeKey);
      setLoadType(_res?.loadType ? _res?.loadType : "-");
    });
  };

  // get Phase Type
  const getPhaseType = () => {
    axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
      let temp = res.data.mstPhaseTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.phaseKey);
      setPhaseType(_res?.phaseType ? _res?.phaseType : "-");
    });
  };

  // get Slab Type
  const getSlabType = () => {
    axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
      let temp = res.data.mstSlabTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.slabTypeKey);
      setSlabType(_res?.slabType ? _res?.slabType : "-");
    });
  };

  // get Usage Type
  const getUsageType = () => {
    axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
      let temp = res.data.mstEbUsageTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.usageTypeKey);
      setUsageType(_res?.usageType ? _res?.usageType : "-");
    });
  };

  // get Msedcl Category
  const getMsedclCategory = () => {
    axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
      let temp = res.data.mstMsedclCategoryList;
      let _res = temp.find((obj) => obj.id === dataSource?.msedclCategoryKey);
      setMsedclCategory(_res?.msedclCategory ? _res?.msedclCategory : "-");
    });
  };

  // get Billing Division And Unit
  const getBillingDivisionAndUnit = () => {
    axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
      let temp = res.data.mstBillingUnitList;
      let _res = temp.find((obj) => obj.id === dataSource?.billingUnitKey);
      setBillingDivisionAndUnit(
        `${_res?.divisionName ? _res?.divisionName : "-"}/${_res?.billingUnit ? _res?.billingUnit : "-"}`,
      );
    });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
      let temp = res.data.mstSubDivisionList;
      let _res = temp.find((obj) => obj.id === dataSource?.subDivisionKey);
      setSubDivision(_res?.subDivision ? _res?.subDivision : "-");
    });
  };

  // get Department Category
  const getDepartmentCategory = () => {
    axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
      let temp = res.data.mstDepartmentCategoryList;
      let _res = temp.find((obj) => obj.id === dataSource?.departmentCategoryKey);
      setDepartmentCategory(_res?.departmentCategory ? _res?.departmentCategory : "-");
    });
  };

  // Get Table - Data
  const getNewConnectionsData = () => {
    let connectionId = router.query.id;
    axios
      .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.trnNewConnectionEntryList;
        let _res = result.find((obj) => obj.id == connectionId);
        setDataSource(_res);
        setDocumentList(_res?.transactionDocumentsList);
      });
  };

  // cancell Button
  const cancelButton = () => {
    reset({
      ...resetValuesCancel,
    });
    router.push("/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry");
  };

  // Reset Values Cancell
  const resetValuesCancel = {
    remarks: "",
  };

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
            New Connection For Demand Generation Details
              {/* <FormattedLabel id="demandGenerationDetials" /> */}
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
                label="Zone"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={zone}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Ward"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={ward}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Department Name"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={department}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Consumer Name"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.consumerName ? dataSource?.consumerName : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Consumer Address"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.consumerAddress ? dataSource?.consumerAddress : "-"}
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
                label="Pincode"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.pinCode ? dataSource?.pinCode : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Consumption Type"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={consumptionType}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Load Type */}

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
                label="Load Type"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={loadType}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Phase Type"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={phaseType}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Slab Type"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={slabType}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Usage Type"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={usageType}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="MSEDCL Category"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={msedclCategory}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Billing Division/Unit"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={billingDivisionAndUnit}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="SubDivision"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={subDivision}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Department Category"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={departmentCategory}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
            New Connection For Quotation Entry Details
              {/* <FormattedLabel id="demandGenerationDetials" /> */}
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Sanctioned Load */}

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
                label="Sanctioned Load"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.sanctionedLoad ? dataSource?.sanctionedLoad : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Connected Load */}

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
                label="Connected Load"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.connectedLoad ? dataSource?.connectedLoad : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Quotation Date */}

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
                label="Quotation Date"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={moment(dataSource.quotationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Second Row */}

            {/* Quotation Number */}

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
                label="Quotation Number"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={quotationNo}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Quotation Amount */}

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
                label="Quotation Amount"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.quotationAmount ? dataSource?.quotationAmount : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Description */}

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
                label="Description"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.quotationDescription ? dataSource?.quotationDescription : "-"}
              />
            </Grid>

            {/* Bank */}

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
                label="Bank"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={bank}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Branch */}

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
                label="Branch"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={branch}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* IFSC Code */}

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
                label="IFSC Code"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.ifscCode ? dataSource?.ifscCode : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
            New Connection For Payment Entry Details
              {/* <FormattedLabel id="demandGenerationDetials" /> */}
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Payment Date*/}

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
                label="Payment Date"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={moment(dataSource?.paymentDate, "YYYY-MM-DD").format("DD-MM-YYYY")}  
              />
            </Grid>

            {/* Check No/UTR NO */}

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
                id="standard-textarea"
                label="Cheque No/UTR No"
                variant="standard"
                value={dataSource?.transactionNo ? dataSource?.transactionNo : "-"}
              />
            </Grid>

            {/* Contract Demand */}

            <Grid
              item
              xl={3}
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
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label="Amount"
                multiline
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                value={dataSource?.amountPaid ? dataSource?.amountPaid : "-"}
                error={!!errors.amountPaid}
                helperText={errors?.amountPaid ? errors.amountPaid.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
             New Connection Entry Details
              {/* <FormattedLabel id="demandGenerationDetials" /> */}
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Sanctioned Demand */}

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
                label="Sanctioned Demand"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.sanctionedDemand ? dataSource?.sanctionedDemand : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Contract Demand */}

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
                label="Contract Demand"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.contractDemand ? dataSource?.contractDemand : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Geo Code/Gis Id"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.geoCodeGisId ? dataSource?.geoCodeGisId : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Billing Cycle"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={billingCycle}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Latitude"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.latitude ? dataSource?.latitude : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label="Longitude"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dataSource?.longitude ? dataSource?.longitude : "-"}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Button Row */}

           
              <Grid
                container
                mt={5}
                rowSpacing={2}
                columnSpacing={1}
                border
                px={5}
              >
                {/* Save ad Draft */}

                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button variant="contained" onClick={cancelButton}>
                    Exit
                    {/* {<FormattedLabel id="cancel" />} */}
                  </Button>
                </Grid>

               
              </Grid>
         
          </Grid>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;
