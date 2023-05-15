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
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/quotationEntrySchema";
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
  const [generateFormFlag, setGenerateFormFlag] = useState(false);
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
  const [sanctionedLoad, setSanctionedLoad] = useState("");
  const [connectedLoad, setConnectedLoad] = useState("");
  const [quotationDate, setQuotationDate] = useState("");
  const [quotationAmount, setQuotationAmount] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [desc, setDesc] = useState("");
  const [bank, setBank] = useState("");
  const [branch, setBranch] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
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
  const [dgDyApprovalRemarks, setDgDyApprovalRemarks] = useState("");
  const [dgExApprovalRemarks, setDgExApprovalRemarks] = useState("");
  const [billDyApprovalRemarks, setBillDyApprovalRemarks] = useState("");
  const [ShowBillDyApprovalRemarks, setShowBillDyApprovalRemarks] = useState("");
  const [billExApprovalRemarks, setBillExApprovalRemarks] = useState("");
  const [officialNotesheetFlag, setOfficialNotesheetFlag] = useState(false);
  const [billAFlag, setBillAFlag] = useState(false);
  const [billBFlag, setBillBFlag] = useState(false);
  const [formAFlag, setFormAFlag] = useState(false);
  const [formBFlag, setFormBFlag] = useState(false);
  const [choice, setChoice] = useState("");

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
  console.log("datasource", dataSource);

  useEffect(() => {
    getNewConnectionsData();
  }, [router.query.id]);
  //   },[fetchData])

  useEffect(() => {
    // getNewConnectionsData();
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
  }, [dataSource, language]);

  const handleDigitalSignature = () => {
    handleClose();
    setGenerateFormFlag(true);
    if (choice === "officialNotesheet") {
      setOfficialNotesheetFlag(true);
    } else if (choice === "billA") {
      setBillAFlag(true);
    } else if (choice === "billB") {
      setBillBFlag(true);
    } else if (choice === "formA") {
      setFormAFlag(true);
    } else if (choice === "formB") {
      setFormBFlag(true);
    }
  };

  //Show formatted date
  function showDateFormat(date) {
    let formattedDate = date?.split("T");
    return formattedDate ? formattedDate[0] : "-";
  }

  const generateForm1 = () => {
    setChoice("officialNotesheet");
    handleOpen();
  };

  const generateForm2 = () => {
    setChoice("billA");
    handleOpen();
  };

  const generateForm3 = () => {
    setChoice("billB");
    handleOpen();
  };

  const generateForm4 = () => {
    setChoice("formA");
    handleOpen();
  };

  const generateForm5 = () => {
    setChoice("formB");
    handleOpen();
  };

  // console.log("dataSource",dataSource);

  //get Bank details
  const getBank = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((res) => {
      let temp = res.data.bank;
      let _res = temp.find((each) => {
        return each.id === dataSource?.bankBranchNameKey;
      });
      setBank(!_res ? "-" : language == "en" ? _res?.bankName : _res?.bankNameMr);
      setBranch(!_res ? "-" : language == "en" ? _res?.branchName : _res?.branchNameMr);
    });
  };

  // get Ward Name
  const getWard = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      let temp = res.data.ward;
      let _res = temp.find((each) => {
        return each.id === dataSource?.wardKey;
      });
      setWard(!_res ? "-" : language == "en" ? _res?.wardName : _res?.wardNameMr);
    });
  };

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      let temp = res.data.department;
      let _res = temp.find((obj) => obj.id === dataSource?.departmentKey);
      setDepartment(!_res ? "-" : language == "en" ? _res?.department : _res?.departmentMr);
    });
  };

  // get Zone Name
  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      let temp = res.data.zone;
      let _res = temp.find((obj) => obj.id === dataSource?.zoneKey);
      setZone(!_res ? "-" : language == "en" ? _res?.zoneName : _res?.zoneNameMr);
    });
  };

  const getConsumerDetails = () => {
    setConsumerName(!dataSource ? "-" : language == "en" ? dataSource?.consumerName : dataSource?.consumerNameMr);
    setConsumerAddress(!dataSource ? "-" : language == "en" ? dataSource?.consumerAddress : dataSource?.consumerAddressMr);
    setPincode(dataSource?.pinCode ? dataSource?.pinCode : "-");
    setSanctionedLoad(dataSource?.sanctionedLoad ? dataSource?.sanctionedLoad : "-");
    setConnectedLoad(dataSource?.connectedLoad ? dataSource?.connectedLoad : "-");
    setQuotationAmount(dataSource?.quotationAmount ? dataSource?.quotationAmount : "-");
    setQuotationNo(dataSource?.quotationNo ? dataSource?.quotationNo : "-");
    setDesc(!dataSource ? "-" : language == "en" ? dataSource?.quotationDescription : dataSource?.quotationDescriptionMr);
    setIfscCode(dataSource?.ifscCode ? dataSource?.ifscCode : "-");
    setAccountNo(dataSource?.accountNo ? dataSource?.accountNo : "-");
    setDgDyApprovalRemarks(dataSource?.dgDyApprovalRemarks ? dataSource?.dgDyApprovalRemarks : "-");
    setDgExApprovalRemarks(dataSource?.dgExApprovalRemarks ? dataSource?.dgExApprovalRemarks : "-");
    setShowBillDyApprovalRemarks(dataSource?.blDyApprovalRemarks ? dataSource?.blDyApprovalRemarks : "-");
  };

  // get Consumption Type
  const getConsumptionType = () => {
    axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
      let temp = res.data.mstConsumptionTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.consumptionTypeKey);
      setConsumptionType(!_res ? "-" : language == "en" ? _res?.consumptionType : _res?.consumptionTypeMr);
    });
  };

  // get Load Type
  const getLoadType = () => {
    axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
      let temp = res.data.mstLoadTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.loadTypeKey);
      setLoadType(!_res ? "-" : language == "en" ? _res?.loadType : _res?.loadTypeMr);
    });
  };

  // get Phase Type
  const getPhaseType = () => {
    axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
      let temp = res.data.mstPhaseTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.phaseKey);
      setPhaseType(!_res ? "-" : language == "en" ? _res?.phaseType : _res?.phaseTypeMr);
    });
  };

  // get Slab Type
  const getSlabType = () => {
    axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
      let temp = res.data.mstSlabTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.slabTypeKey);
      setSlabType(!_res ? "-" : language == "en" ? _res?.slabType : _res?.slabTypeMr);
    });
  };

  // get Usage Type
  const getUsageType = () => {
    axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
      let temp = res.data.mstEbUsageTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.usageTypeKey);
      setUsageType(!_res ? "-" : language == "en" ? _res?.usageType : _res?.usageTypeMr);
    });
  };

  // get Msedcl Category
  const getMsedclCategory = () => {
    axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
      let temp = res.data.mstMsedclCategoryList;
      let _res = temp.find((obj) => obj.id === dataSource?.msedclCategoryKey);
      setMsedclCategory(!_res ? "-" : language == "en" ? _res?.msedclCategory : _res?.msedclCategoryMr);
    });
  };

  // get Billing Division And Unit
  const getBillingDivisionAndUnit = () => {
    axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
      let temp = res.data.mstBillingUnitList;
      let _res = temp.find((obj) => obj.id === dataSource?.billingUnitKey);
      setBillingDivisionAndUnit(
        (!_res ? "-" : language == "en" ? `${_res?.divisionName ? _res?.divisionName : "-"}/${_res?.billingUnit ? _res?.billingUnit : "-"}` 
        : `${_res?.divisionNameMr ? _res?.divisionNameMr : "-"}/${_res?.billingUnit ? _res?.billingUnit : "-"}`)
      );
    });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
      let temp = res.data.mstSubDivisionList;
      let _res = temp.find((obj) => obj.id === dataSource?.subDivisionKey);
      setSubDivision(!_res ? "-" : language == "en" ? _res?.subDivision : _res?.subDivisionMr);
    });
  };

  // get Department Category
  const getDepartmentCategory = () => {
    axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
      let temp = res.data.mstDepartmentCategoryList;
      let _res = temp.find((obj) => obj.id === dataSource?.departmentCategoryKey);
      setDepartmentCategory(!_res ? "-" : language == "en" ? _res?.departmentCategory : _res?.departmentCategoryMr);
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
    // Save - DB

    if (btnType === "Save") {
      let formData;
      authority && authority.find((val)=>val === "PROPOSAL APPROVAL")
        ? (formData = {
            ...dataSource,
            blDyApprovalRemarks: billDyApprovalRemarks,
            isApproved: true,
            isComplete: false,
          })
        : (formData = {
            ...dataSource,
            blExApprovalRemarks: billExApprovalRemarks,
            isApproved: true,
            isComplete: false,
          });
      console.log("Save New COnnection ............ 22");
      const tempData = axios
        .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              "Approved!",
              `Quotation against connection ${dataSource?.id} Approved successfully !`,
              "success",
            );
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
    else if (btnType === "Revert") {
      let formData;
      authority && authority.find((val)=>val === "PROPOSAL APPROVAL")
        ? (formData = {
            ...dataSource,
            blDyApprovalRemarks: billDyApprovalRemarks,
            isApproved: false,
            isComplete: false,
          })
        : (formData = {
            ...dataSource,
            blExApprovalRemarks: billExApprovalRemarks,
            isApproved: false,
            isComplete: false,
          });
      console.log("Save New COnnection ............ 23");
      const tempData = axios
        .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            sweetAlert(
              "Rejected!",
              `Quotation against connection ${dataSource?.id} Rejected successfully !`,
              "success",
            );
            getNewConnectionsData();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            router.push("/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry");
          }
        });
    }
  };

  // cancell Button
  const cancelButton = () => {
    reset({
      ...resetValuesCancel,
    });
    router.push("/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry");
  };

  const clearButton = () => {
    reset({
      ...resetValuesCancel,
    });
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
          <FormattedLabel id="demandGenerationDetials" />
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
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
                label={<FormattedLabel id="zone" />}
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
                label={<FormattedLabel id="ward" />}
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
                label={<FormattedLabel id="deptName" />}
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
                label={<FormattedLabel id="consumerName" />}
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
                label={<FormattedLabel id="consumerAddress" />}
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
                label={<FormattedLabel id="pincode" />}
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
                label={<FormattedLabel id="consumptionType" />}
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
                label={<FormattedLabel id="loadType" />}
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
                label={<FormattedLabel id="phaseType" />}
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
                label={<FormattedLabel id="slabType" />}
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
                label={<FormattedLabel id="ebUsageType" />}
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
                label={<FormattedLabel id="msedclCategory" />}
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
                label={<FormattedLabel id="billingUnitAndDivision" />}
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
                label={<FormattedLabel id="subDivision" />}
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
                label={<FormattedLabel id="departmentCategory" />}
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

            {/* DG Dy Approval Remark */}

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
                label={<FormattedLabel id="dgDyRemark" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dgDyApprovalRemarks}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* DG EXE Remark */}

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
                label={<FormattedLabel id="dgExeRemark" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={dgExApprovalRemarks}
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
            <FormattedLabel id="quotationForNewConnection" />
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
                label={<FormattedLabel id="sanctionedLoad" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={sanctionedLoad}
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
                label={<FormattedLabel id="connectedLoad" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={connectedLoad}
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
                label={<FormattedLabel id="quotationDate" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={moment(
                  dataSource?.quotationDate,
                  'YYYY-MM-DD',
              ).format('DD-MM-YYYY')}
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
                label={<FormattedLabel id="quotationNo" />}
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
                label={<FormattedLabel id="quotationAmount" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={quotationAmount}
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
                label={<FormattedLabel id="desc" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={desc}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label={<FormattedLabel id="msedclBank" />}
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
                label={<FormattedLabel id="msedclBranch" />}
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
                label={<FormattedLabel id="msedclIFSC" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={ifscCode}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Account No */}

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
                label={<FormattedLabel id="msedclAccNo" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={accountNo}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Bill Dy Approval Remark */}

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
                label={<FormattedLabel id="billDyRemark" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={ShowBillDyApprovalRemarks}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Add Remarks */}

            {authority && authority.find((val)=>val === "ENTRY") ? (
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
                    label={<FormattedLabel id="remark" />}
                    sx={{ m: 1, minWidth: "83%" }}
                    multiline
                    value={
                      authority && authority.find((val)=>val === "PROPOSAL APPROVAL")
                        ? billDyApprovalRemarks
                        : billExApprovalRemarks
                    }
                    variant="outlined"
                    onChange={(e) => {
                      authority && authority.find((val)=>val === "PROPOSAL APPROVAL")
                        ? setBillDyApprovalRemarks(e.target.value)
                        : setBillExApprovalRemarks(e.target.value);
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
              {/* Form-22 Letter */}
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
                  <label>{<FormattedLabel id="officialNotesheet" />}</label>
                </Grid>
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                  <Button variant="contained" onClick={generateForm1}>
                  {<FormattedLabel id="view" />}
                  </Button>
                </Grid>
                {officialNotesheetFlag ? (
                  <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    <CheckIcon style={{ color: "#556CD6" }} />
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>

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
                  <label>{<FormattedLabel id="billALabel" />}</label>
                </Grid>
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                  <Button variant="contained" onClick={generateForm2}>
                  {<FormattedLabel id="view" />}
                  </Button>
                </Grid>
                {billAFlag ? (
                  <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    <CheckIcon style={{ color: "#556CD6" }} />
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>

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
                  <label>{<FormattedLabel id="billBLabel" />}</label>
                </Grid>
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                  <Button variant="contained" onClick={generateForm3}>
                  {<FormattedLabel id="view" />}
                  </Button>
                </Grid>
                {billBFlag ? (
                  <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    <CheckIcon style={{ color: "#556CD6" }} />
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>

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
                  <label>{<FormattedLabel id="formALabel" />}</label>
                </Grid>
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                  <Button variant="contained" onClick={generateForm4}>
                  {<FormattedLabel id="view" />}
                  </Button>
                </Grid>
                {formAFlag ? (
                  <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    <CheckIcon style={{ color: "#556CD6" }} />
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>

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
                  <label>{<FormattedLabel id="formBLabel" />}</label>
                </Grid>
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                  <Button variant="contained" onClick={generateForm5}>
                  {<FormattedLabel id="view" />}
                  </Button>
                </Grid>
                {formBFlag ? (
                  <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    <CheckIcon style={{ color: "#556CD6" }} />
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>

            {/* View Form-22 Letter Modal */}

            <div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                
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
                      <h3>Form-22 Letter Generated</h3>
                    </Grid>
                    {authority && authority.find((val)=>val === "ENTRY") ? (
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
                          <b>{<FormattedLabel id="digitalSignatureLabel" />}:</b>
                        </label>
                        &nbsp;
                        <Button variant="contained" onClick={handleDigitalSignature}>
                          {<FormattedLabel id="digitalSignature" />}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Modal>
            </div>

            {/* Button Row */}

            {authority && authority.find((val)=>val === "ENTRY") || authority && authority.find((val)=>val === "PAYMENT VERIFICATION") ? (
              <Grid
                container
                mt={5}
                rowSpacing={2}
                columnSpacing={1}
                border
                px={5}
                sx={{ marginLeft: "110px" }}
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
                    
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container mt={5} rowSpacing={2} border px={5}>
                {/* Save ad Draft */}

                {(authority && authority.find((val)=>val === "PROPOSAL APPROVAL") && (dataSource?.status == 23 || dataSource?.status == 7 || dataSource?.status == 16)) ||
                (authority && authority.find((val)=>val === "FINAL_APPROVAL") && (dataSource?.status == 7 || dataSource?.status == 19 || dataSource?.status == 20)) ? (
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
                      {<FormattedLabel id="approve" />}
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
                      disabled={
                        officialNotesheetFlag && billAFlag && billBFlag && formAFlag && formBFlag
                          ? false
                          : true
                      }
                    >
                      {<FormattedLabel id="approve" />}
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
                  <Button
                    onClick={() => {
                      onSubmitForm("Revert");
                    }}
                    variant="contained"
                  >
                    {<FormattedLabel id="revert" />}
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
                  <Button onClick={clearButton} variant="contained">
                  {<FormattedLabel id="clear" />}
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
                    
                    {<FormattedLabel id="exit" />}
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
