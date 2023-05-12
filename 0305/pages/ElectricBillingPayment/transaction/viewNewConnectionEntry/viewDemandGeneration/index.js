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
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/demandGenerationSchema";
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
import CheckIcon from "@mui/icons-material/Check";

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
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState({});
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [generateDemandLetterFlag, setGenerateDemandLetterFlag] = useState(true);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [ward, setWard] = useState("");
  const [department, setDepartment] = useState("");
  const [zone, setZone] = useState("");
  const [consumerName, setConsumerName] = useState("");
  const [consumerAddress, setConsumerAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [consumptionType, setConsumptionType] = useState("");
  const [loadType, setLoadType] = useState("");
  const [phaseType, setPhaseType] = useState("");
  const [slabType, setSlabType] = useState("");
  const [usageType, setUsageType] = useState("");
  const [msedclCategory, setMsedclCategory] = useState("");
  const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState("");
  const [subDivision, setSubDivision] = useState("");
  const [departmentCategory, setDepartmentCategory] = useState("");
  const [buttonInputState, setButtonInputState] = useState();
  const [dgDyApprovalRemarks, setDgDyApprovalRemarks] = useState("");
  const [dgExApprovalRemarks, setDgExApprovalRemarks] = useState("");
  const [approvalFlag, setApprovalFlag] = useState(false);
  const [completedFlag, setCompletedFlag] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [fetchData, setFetchData] = useState(null);
  const [documentList, setDocumentList] = useState([]);
  const [demandGenerationFlag, setDemandGenerationFlag] = useState(false);

  const [aOneForm, setAOneForm] = useState(null);
  const [proofOfOwnership, setProofOfOwnership] = useState(null);
  const [identyProof, setIdentyProof] = useState(null);
  const [castCertificate, setCastCertificate] = useState(null);
  const [statuatoryAndRegulatoryPermission, setStatuatoryAndRegulatoryPermission] = useState(null);
  const [industrialRegistration, setIndustrialRegistration] = useState(null);
  const [loadProfileSheet, setLoadProfileSheet] = useState(null);

  console.log("dgDyApprovalRemarks", dgDyApprovalRemarks);
  console.log("dgExApprovalRemarks", dgExApprovalRemarks);

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

  console.log("authority", authority);

  useEffect(() => {
    getNewConnectionsData();
  }, [router.query.id]);

  useEffect(() => {
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
    handleDocumentChecklist()
  }, [dataSource]);

  const handleDocumentChecklist = () => {
      console.log("handleDocumentChecklist",dataSource?.transactionDocumentsList)
     setAOneForm(dataSource?.transactionDocumentsList && dataSource?.transactionDocumentsList.find((obj)=> obj.documentKey == 6)) 
     setProofOfOwnership(dataSource?.transactionDocumentsList && dataSource?.transactionDocumentsList.find((obj)=> obj.documentKey == 7)) 
     setIdentyProof(dataSource?.transactionDocumentsList && dataSource?.transactionDocumentsList.find((obj)=> obj.documentKey == 3)) 
     setCastCertificate(dataSource?.transactionDocumentsList && dataSource?.transactionDocumentsList.find((obj)=> obj.documentKey == 8)) 
     setStatuatoryAndRegulatoryPermission(dataSource?.transactionDocumentsList && dataSource?.transactionDocumentsList.find((obj)=> obj.documentKey == 91)) 
     setIndustrialRegistration(dataSource?.transactionDocumentsList && dataSource?.transactionDocumentsList.find((obj)=> obj.documentKey == 91)) 
     setLoadProfileSheet(dataSource?.transactionDocumentsList && dataSource?.transactionDocumentsList.find((obj)=> obj.documentKey == 91)) 
  }

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
    setConsumerName(dataSource?.consumerName ? dataSource?.consumerName : "-");
    setConsumerAddress(dataSource?.consumerAddress ? dataSource?.consumerAddress : "-");
    setPincode(dataSource?.pinCode ? dataSource?.pinCode : "-");
  };

  // get Consumption Type
  const getConsumptionType = () => {
    axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
      let temp = res.data.mstConsumptionTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.consumptionTypeKey);
      setConsumptionType(_res?.consumptionType ? _res?.consumptionType : "-");
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
    console.log("connectionId", connectionId);
    axios
      .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.trnNewConnectionEntryList;
        // console.log("Result",result)
        let _res = result.find((obj) => obj.id == connectionId);
        setDataSource(_res);
        setDocumentList(_res?.transactionDocumentsList);
      });
  };

  const onSubmitForm = (btnType) => {
    // dispatch(setNewEntryConnection(formData))
    // Save - DB

    if (btnType === "Save") {
      console.log("save dg", btnType);
      let formData;
      authority[0] === "PROPOSAL APPROVAL"
        ? (formData = {
            ...dataSource,
            dgDyApprovalRemarks,
            isApproved: true,
            isComplete: false,
          })
        : (formData = {
            ...dataSource,
            dgExApprovalRemarks,
            isApproved: true,
            isComplete: false,
          });
      console.log("Save New COnnection ............ 71", formData);
      const tempData = axios
        .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Approved!", `Connection ${dataSource?.id} Approved successfully !`, "success");
            getNewConnectionsData();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            router.push("/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry");
          }
        });
    }
    // Update Data Based On ID
    else if (btnType === "Reject") {
      console.log("reject DG", btnType);
      let formData;
      authority[0] === "PROPOSAL APPROVAL"
        ? (formData = {
            ...dataSource,
            dgDyApprovalRemarks,
            isApproved: false,
            isComplete: false,
          })
        : (formData = {
            ...dataSource,
            dgExApprovalRemarks,
            isApproved: false,
            isComplete: false,
          });
      const tempData = axios
        .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            sweetAlert("Reject!", `Connection ${dataSource?.id} Rejected successfully !`, "success");
            getNewConnectionsData();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            router.push("/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry");
          }
        });
    } else if (btnType === "sendToMsecdl") {
      let _body = {
        ...dataSource,
        isSentToMsecdl: true,
      };
      console.log("Save New COnnection ............ 19");
      const tempData = axios
        .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("DownLoad!", `Connection ${dataSource?.id} Send to MSEDCL successfully !`, "success");
            getNewConnectionsData();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            router.push("/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry");
          }
        });
    }
  };

  const generateDemandLetter = () => {
    handleOpen();
  };

  const handleDigitalSignature = () => {
    setDemandGenerationFlag(true);
    handleClose();
  };

  // cancell Button
  const cancelButton = () => {
    authority && authority[0] == "PROPOSAL APPROVAL"
    ?
    setDgDyApprovalRemarks("")
    :  
      setDgExApprovalRemarks("")
    router.push("/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry");
  };

  const clearButton = () => {
    authority && authority[0] == "PROPOSAL APPROVAL"
    ?
    setDgDyApprovalRemarks("")
    :  
      setDgExApprovalRemarks("")
    
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

      <FormProvider {...methods}>
        <form>
          {/* Firts Row */}

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
                value={consumerName}
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
                value={consumerAddress}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                value={pincode}
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

            {/* Attachment */}

            <Grid container rowSpacing={2} columnSpacing={1} className={styles.attachmentContainer}>
              <h4 style={{ marginTop: "40px", marginLeft: "8px" }}>
                Note: Attached file should have max 2MB size in JPG, JPEG, PNG, & PDF format
              </h4>

              {/* A-1 Form */}
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
                  <label>A-1 Form for Power Supply</label>
                  <br />
                  <label>- {aOneForm ? aOneForm.remark : ""}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.viewButton}>
                  {aOneForm ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${aOneForm?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained">View</Button>
                    </a>
                  ) : (
                    <Button variant="contained" disabled>
                      View
                    </Button>
                  )}
                </Grid>
              </Grid>

              {/* Proof of Ownership */}
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
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10} style={{ marginRight: "15px" }}>
                  <label>Proof of Ownership or Occupancy of Premises:</label>
                  <br />
                  <label>- {proofOfOwnership ? proofOfOwnership.remark : ""}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.viewButton}>
                  {proofOfOwnership ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${proofOfOwnership?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained">View</Button>
                    </a>
                  ) : (
                    <Button variant="contained" disabled>
                      View
                    </Button>
                  )}
                </Grid>
              </Grid>

              {/* Identity Proof */}
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
                  <label style={{ textAlign: "left" }}>Identity Proof (Any one of the following)</label>
                  <br />
                  <label>- {identyProof ? identyProof.remark : ""}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.viewButton}>
                  {identyProof ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${identyProof?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained">View</Button>
                    </a>
                  ) : (
                    <Button variant="contained" disabled>
                      View
                    </Button>
                  )}
                </Grid>
              </Grid>

              {/* Cast Certificate */}
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
                  <label style={{ textAlign: "left" }}>
                    Documents required for relevant category (If applicable)
                  </label>
                  <br />
                  <label>- {castCertificate ? castCertificate.remark : ""}</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.viewButton}>
                  {castCertificate ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${castCertificate?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained">View</Button>
                    </a>
                  ) : (
                    <Button variant="contained" disabled>
                      View
                    </Button>
                  )}
                </Grid>
              </Grid>

              {/* Only For Industrial Connection */}

              {/* Statutory And Regulatory Permission */}
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
                  <h4>Remark</h4>
                  <br />
                  <label style={{ textAlign: "left" }}>
                    1. Required Statutory & regulatory permission is to be submitted.
                  </label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.viewButton}>
                  {statuatoryAndRegulatoryPermission ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${statuatoryAndRegulatoryPermission?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained">View</Button>
                    </a>
                  ) : (
                    <Button variant="contained" disabled>
                      View
                    </Button>
                  )}
                </Grid>
              </Grid>

              {/* Industrial Registration */}
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
                  <label>2. For industrial connection purpose following additional documents required:</label>
                  <label style={{ textAlign: "left" }}>a. Industrial Registration / DIC Certificate.</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.viewButton}>
                  {industrialRegistration ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${industrialRegistration?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained">View</Button>
                    </a>
                  ) : (
                    <Button variant="contained" disabled>
                      View
                    </Button>
                  )}
                </Grid>
              </Grid>

              {/* Sheet For Load profile */}
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
                  <label style={{ textAlign: "left" }}>b. Separate sheet for Load profile"</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.viewButton}>
                  {loadProfileSheet ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${loadProfileSheet?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained">View</Button>
                    </a>
                  ) : (
                    <Button variant="contained" disabled>
                      View
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/* Add Remarks */}

            {authority && authority[0] === "ENTRY" ? (
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
                  {" "}
                  <TextField
                    id="standard-textarea"
                    label="Remarks"
                    sx={{ m: 1, minWidth: "81%" }}
                    multiline
                    value={
                      authority && authority[0] == "PROPOSAL APPROVAL"
                        ? dgDyApprovalRemarks
                        : dgExApprovalRemarks
                    }
                    variant="outlined"
                    onChange={(e) => {
                      authority && authority[0] == "PROPOSAL APPROVAL"
                        ? setDgDyApprovalRemarks(e.target.value)
                        : setDgExApprovalRemarks(e.target.value);
                    }}
                    error={!!errors.remarks}
                    helperText={errors?.remarks ? errors.remarks.message : null}
                    // InputLabelProps={{
                    //     //true
                    //     shrink:
                    //         (watch("label2") ? true : false) ||
                    //         (router.query.label2 ? true : false),
                    // }}
                  />
                </Grid>
              </Grid>
            )}

            {/* view generated forms */}
            <Grid
              container
              rowSpacing={2}
              columnSpacing={1}
              sx={{ paddingLeft: "110px", paddingTop: "40px" }}
            >
              {/* Demand Letter */}

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
                  <label>Demand Letter</label>
                </Grid>
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                  <Button variant="contained" onClick={generateDemandLetter}>
                    View
                  </Button>
                </Grid>
                {demandGenerationFlag ? (
                  <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    <CheckIcon style={{ color: "#556CD6" }} />
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>

            {/* View Demand Letter */}

            <div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  {/* <center>
                              <div>
                                <Document file={samplePdf} onLoadSuccess={onDocumentLoadSuccess} />
                                {Array.from(
                                  new Array(numPages),
                                  (el, next) => (
                                    <Page key={`Page_${index + 1}`} pageNumber={index + 1} />
                                  )
                                )}
  
                              </div>
                            </center> */}

                  <Grid container rowSpacing={5}>
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
                      <h3>Demand Letter Generated</h3>
                    </Grid>
                    {authority && authority[0] === "ENTRY" ? (
                      <></>
                    ) : (
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
                        <label>
                          <b>Add Digital Signature:</b>
                        </label>
                        &nbsp;
                        <Button variant="contained" onClick={handleDigitalSignature}>
                          Digital Signature
                          {/* {<FormattedLabel id="saveAsDraft" />} */}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Modal>
            </div>

            {/* Button Row */}
            {console.log("dataSource",dataSource)}
            {authority && (authority.find((val)=>val === "ENTRY") || authority.find((val)=>val === 'PAYMENT VERIFICATION') ) ? (
              <Grid container mt={5} rowSpacing={2} columnSpacing={1} border px={5}>
                {/* Save ad Draft */}

                <Grid
                  item
                  xl={6}
                  lg={6}
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

                {dataSource?.status === 13 ? (
                  <>
                    <Grid
                      item
                      xl={6}
                      lg={6}
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
                        onClick={() => {
                          onSubmitForm("sendToMsecdl");
                        }}
                      >
                        Download Demand Letter & Send To MSEDCL
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            ) : (
              <Grid container mt={5} rowSpacing={2} border px={5}>
                {/* Save ad Draft */}
                

                {/* <Grid
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
                  <Button
                    onClick={() => {
                      onSubmitForm("Save");
                    }}
                    variant="contained"
                    disabled={!demandGenerationFlag}
                  >
                    Approve
                  </Button>
                </Grid> */}

                {(authority &&
                  authority[0] === "PROPOSAL APPROVAL" &&
                 (dataSource?.status == 21 ||
                  dataSource?.status == 13 || dataSource?.status == 14) ) ||
                (authority &&
                  authority[0] === "FINAL_APPROVAL" &&
                  (dataSource?.status == 13 ||
                  dataSource?.status == 17 ||
                  dataSource?.status == 18)
                  ) ? (
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
                    <Button
                      onClick={() => {
                        onSubmitForm("Save");
                      }}
                      variant="contained"
                      disabled
                    >
                      Approve
                    </Button>
                  </Grid>
                ) : (
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
                    <Button
                      onClick={() => {
                        onSubmitForm("Save");
                      }}
                      variant="contained"
                      // disabled={
                      //   officialNotesheetFlag && billAFlag && billBFlag && formAFlag && formBFlag
                      //     ? false
                      //     : true
                      // }
                    >
                      Approve
                    </Button>
                  </Grid>
                )}

{(authority &&
                  authority[0] === "PROPOSAL APPROVAL" &&
                 (dataSource?.status == 21 ||
                  dataSource?.status == 13 || dataSource?.status == 14) ) ||
                (authority &&
                  authority[0] === "FINAL_APPROVAL" &&
                 ( dataSource?.status == 13 ||
                  dataSource?.status == 17 ||
                  dataSource?.status == 18)
                  ) ? (
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
                    <Button
                      onClick={() => {
                        onSubmitForm("Reject");
                      }}
                      variant="contained"
                      disabled
                    >
                      Reject
                    </Button>
                  </Grid>
                ) : (
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
                    <Button
                      onClick={() => {
                        onSubmitForm("Reject");
                      }}
                      variant="contained"
                      // disabled={
                      //   officialNotesheetFlag && billAFlag && billBFlag && formAFlag && formBFlag
                      //     ? false
                      //     : true
                      // }
                    >
                      Reject
                    </Button>
                  </Grid>
                )}

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
                  <Button onClick={clearButton} variant="contained">
                    Clear
                  </Button>
                </Grid>

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
            )}
          </Grid>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;
