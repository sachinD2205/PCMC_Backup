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
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../../../features/labelSlice";
import urls from "../../../../../URLS/urls";
import { useDispatch, useSelector } from "react-redux";
// import samplePdf from "../../../../../public/certificate.pdf"
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import UploadButton from "../../../../../components/ElectricBillingComponent/uploadDocument/uploadButton";
import OfficialNotesheet from "../../billGenerationAndPayment/generatedDocuments/officialNotesheet";
import BillA from "../../billGenerationAndPayment/generatedDocuments/billA";
import BillB from "../../billGenerationAndPayment/generatedDocuments/billB";
import FormA from "../../billGenerationAndPayment/generatedDocuments/formA";
import FormB from "../../billGenerationAndPayment/generatedDocuments/formB";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

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
  const [sendFormFlag, setSendFormFlag] = useState(true);
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
  const [dgDyApprovalRemarks, setDgDyApprovalRemarks] = useState("");
  const [dgExApprovalRemarks, setDgExApprovalRemarks] = useState("");
  const [sanctionedLoad, setSanctionedLoad] = useState("");
  const [connectedLoad, setConnectedLoad] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [quotationAmount, setQuotationAmount] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [desc, setDesc] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const [buttonInputState, setButtonInputState] = useState();
  const [approvalFlag, setApprovalFlag] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [fetchData, setFetchData] = useState(null);
  const [entryConnectionId, setEntryConnectionId] = useState(null);
  const [quotationDate, setQuotationDate] = useState(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [branch, setBranch] = useState([]);
  const [bank, setBank] = useState([]);
  const [accountNo, setAccountNo] = useState("");

  const [choice, setChoice] = useState("");
  const [officialNotesheet, setOfficialNotesheet] = useState("");
  const [formA, setFormA] = useState("");
  const [formB, setFormB] = useState("");
  const [billA, setBillA] = useState("");
  const [billB, setBillB] = useState("");
  const [officialNotesheetFlag, setOfficialNotesheetFlag] = useState(false);
  const [formAFlag, setFormAFlag] = useState(false);
  const [formBFlag, setFormBFlag] = useState(false);
  const [billAFlag, setBillAFlag] = useState(false);
  const [billBFlag, setBillBFlag] = useState(false);

  console.log("dataSource", dataSource);
  console.log("branchName", branchName);

  const billData = {
    toBePaidAmount:quotationAmount,
    currReadingDate:quotationDate
  }

  //generate Button

  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });

  const componentRef2 = useRef();
  const handleGenerateButton2 = useReactToPrint({
    content: () => componentRef2.current,
  });

  const componentRef3 = useRef();
  const handleGenerateButton3 = useReactToPrint({
    content: () => componentRef3.current,
  });

  const componentRef4 = useRef();
  const handleGenerateButton4 = useReactToPrint({
    content: () => componentRef4.current,
  });

  const componentRef5 = useRef();
  const handleGenerateButton5 = useReactToPrint({
    content: () => componentRef5.current,
  });

  const generateOfficialNotesheet = () => {
    setOfficialNotesheetFlag(true);
    handleGenerateButton1();
  };

  const generateBillA = () => {
    setBillAFlag(true);
    handleGenerateButton2();
    // handleOpen();
  };

  const generateBillB = () => {
    setBillBFlag(true);
    handleGenerateButton3();
    // handleOpen();
  };

  const generateFormA = () => {
    setFormAFlag(true);
    handleGenerateButton4();
    // handleOpen();
  };

  const generateFormB = () => {
    setFormBFlag(true);
    handleGenerateButton5();
    // handleOpen();
  };

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  //get entry Connection data from store
  const entryConnectionData = useSelector((state) => state.user.entryConnectionData);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  useEffect(() => {
    getBank();
  }, []);

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
  }, []);

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
  }, [dataSource, language]);

  // get all Bank Names

  const getBank = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((res) => {
      setBank(res.data.bank);
    });
  };

  const handleBank = (e) => {
    setSelectedBank(e.target.value);
    let bankName = e.target.value;
    let branchNames = [];
    bank &&
      bank.map((eachBank) => {
        if (eachBank.bankName === e.target.value) {
          if (!branchNames.includes(eachBank.branchName)) {
            branchNames.push(eachBank);
          }
        }
      });
    setBranch(branchNames);
  };

  // get Ward Name
  const getWard = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      let temp = res.data.ward;
      let _res = temp.find((each) => {
        return each.id === dataSource?.wardKey;
      });
      setWard(!_res ? "-" : language == "en" ?  _res?.wardName : _res?.wardNameMr);
    });
  };

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      let temp = res.data.department;
      let _res = temp.find((obj) => obj.id === dataSource?.departmentKey);
      setDepartment(!_res ? "-" : language == "en" ?  _res?.department : _res?.departmentMr);
    });
  };

  // get Zone Name
  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      let temp = res.data.zone;
      let _res = temp.find((obj) => obj.id === dataSource?.zoneKey);
      setZone(!_res ? "-" : language == "en" ?  _res?.zoneName : _res?.zoneNameMr);
    });
  };

  const getConsumerDetails = () => {
    setConsumerName(!dataSource ? "-" : language == "en" ?  dataSource?.consumerName : dataSource?.consumerNameMr);
    setConsumerAddress(!dataSource ? "-" : language == "en" ?  dataSource?.consumerAddress : dataSource?.consumerAddressMr);
    setPincode(dataSource?.pinCode ? dataSource?.pinCode : "-");
    setDgDyApprovalRemarks(!dataSource ? "-" : language == "en" ?  dataSource?.dgDyApprovalRemarks : dataSource?.dgDyApprovalRemarksMr);
    setDgExApprovalRemarks(!dataSource ? "-" : language == "en" ?  dataSource?.dgExApprovalRemarks : dataSource?.dgExApprovalRemarksMr);
  };

  // get Consumption Type
  const getConsumptionType = () => {
    axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
      let temp = res.data.mstConsumptionTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.consumptionTypeKey);
      setConsumptionType(!_res ? "-" : language == "en" ?  _res?.consumptionType : _res?.consumptionTypeMr);
    });
  };

  // get Load Type
  const getLoadType = () => {
    axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
      let temp = res.data.mstLoadTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.loadTypeKey);
      setLoadType(!_res ? "-" : language == "en" ?  _res?.loadType : _res?.loadTypeMr);
    });
  };

  // get Phase Type
  const getPhaseType = () => {
    axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
      let temp = res.data.mstPhaseTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.phaseKey);
      setPhaseType(!_res ? "-" : language == "en" ?  _res?.phaseType : _res?.phaseTypeMr);
    });
  };

  // get Slab Type
  const getSlabType = () => {
    axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
      let temp = res.data.mstSlabTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.slabTypeKey);
      setSlabType(!_res ? "-" : language == "en" ?  _res?.slabType : _res?.slabTypeMr);
    });
  };

  // get Usage Type
  const getUsageType = () => {
    axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
      let temp = res.data.mstEbUsageTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.usageTypeKey);
      setUsageType(!_res ? "-" : language == "en" ?  _res?.usageType : _res?.usageTypeMr);
    });
  };

  // get Msedcl Category
  const getMsedclCategory = () => {
    axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
      let temp = res.data.mstMsedclCategoryList;
      let _res = temp.find((obj) => obj.id === dataSource?.msedclCategoryKey);
      setMsedclCategory(!_res ? "-" : language == "en" ?  _res?.msedclCategory : _res?.msedclCategoryMr);
    });
  };

  // get Billing Division And Unit
  const getBillingDivisionAndUnit = () => {
    axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
      let temp = res.data.mstBillingUnitList;
      let _res = temp.find((obj) => obj.id === dataSource?.billingUnitKey);
      setBillingDivisionAndUnit(
        !_res ? "-" : language == "en" ?  `${_res?.divisionName ? _res?.divisionName : "-"}/${_res?.billingUnit ? _res?.billingUnit : "-"}` : `${_res?.divisionNameMr ? _res?.divisionNameMr : "-"}/${_res?.billingUnit ? _res?.billingUnit : "-"}`
      );
    });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
      let temp = res.data.mstSubDivisionList;
      let _res = temp.find((obj) => obj.id === dataSource?.subDivisionKey);
      setSubDivision(!_res ? "-" : language == "en" ?  _res?.subDivision : _res?.subDivisionMr);
    });
  };

  // get Department Category
  const getDepartmentCategory = () => {
    axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
      let temp = res.data.mstDepartmentCategoryList;
      let _res = temp.find((obj) => obj.id === dataSource?.departmentCategoryKey)
      setDepartmentCategory (!_res ? "-" : language == "en" ?  _res?.departmentCategory : _res?.departmentCategoryMr);
    });
  };

  useEffect(() => {
    getNewConnectionsData();
  }, [fetchData]);

  // Get Table - Data
  const getNewConnectionsData = () => {
    const connectionId = router.query.id;

    axios
      .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.trnNewConnectionEntryList;

        let _res = result.find((obj) => {
          return obj.id == connectionId;
        });
        setDataSource(_res);
      });
  };

  const onSubmitForm = (formData) => {
    let _formData = {
      sanctionedLoad,
      connectedLoad,
      quotationNo,
      quotationAmount,
      quotationDate,
      bankBranchNameKey: selectedBranch,
      ifscCode,
      accountNo,
      quotationDescription: desc,
    };

    // // Save - DB
    const _body = {
      ...dataSource,
      ..._formData,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              "Send!",
              `Quotation against connection ${dataSource?.id} Send successfully !`,
              "success",
            );
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

  const generateForm = () => {
    handleOpen();
    setSendFormFlag(false);
  };

  // Exit Button
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

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    sanctionedLoad: "",
    connectedLoad: "",
    quotationDate: "",
    quotationNo: "",
    quotationAmount: "",
    description: "",
    bankBranchNameKey: "",
    ifscCode: "",
  };

  const handleClearButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Exit
  const resetValuesExit = {
    billingCycleKey: "",
    billingCycleKeyMr: "",
    id: null,
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
        <form onSubmit={handleSubmit(onSubmitForm)}>
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

          <Divider />

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

            {/* DG DY Remark */}

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

            {/* DG EX Remark */}

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

          {/* Enter Details for Connection Entry */}

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

          <Divider />

          <Grid container sx={{ padding: "10px" }}>
            {/* First Row */}

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
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label={<FormattedLabel id="sanctionedLoad" />}
                variant="standard"
                value={sanctionedLoad}
                onChange={(e) => setSanctionedLoad(e.target.value)}
                error={!!errors.sanctionedLoad}
                helperText={errors?.sanctionedLoad ? errors.sanctionedLoad.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label={<FormattedLabel id="connectedLoad" />}
                variant="standard"
                value={connectedLoad}
                onChange={(e) => setConnectedLoad(e.target.value)}
                error={!!errors.connectedLoad}
                helperText={errors?.connectedLoad ? errors.connectedLoad.message : null}
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  sx={{ m: 1, minWidth: "50%" }}
                  disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  label={<FormattedLabel id="quotationDate" />}
                  inputFormat="dd/MM/yyyy"
                  value={quotationDate}
                  onChange={(date) => setQuotationDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                  renderInput={(params) => <TextField {...params} />}
                  error={!!errors.quotationDate}
                  helperText={errors?.quotationDate ? errors.quotationDate.message : null}
                />
              </LocalizationProvider>
            </Grid>

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
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label={<FormattedLabel id="quotationNo" />}
                variant="standard"
                value={quotationNo}
                onChange={(e) => setQuotationNo(e.target.value)}
                error={!!errors.quotationNo}
                helperText={errors?.quotationNo ? errors.quotationNo.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label={<FormattedLabel id="quotationAmount" />}
                variant="standard"
                value={quotationAmount}
                onChange={(e) => setQuotationAmount(e.target.value)}
                error={!!errors.quotationAmount}
                helperText={errors?.quotationAmount ? errors.quotationAmount.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label={<FormattedLabel id="desc" />}
                variant="standard"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                error={!!errors.description}
                helperText={errors?.description ? errors.description.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Bank Name */}

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
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.bankBranchNameKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {<FormattedLabel id="msedclBank" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      value={selectedBank}
                      onChange={handleBank}
                      label={<FormattedLabel id="msedclBank" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {bank &&
                        bank.map((each, index) => (
                          <MenuItem key={index} value={each.bankName}>
                            {language == "en" ? each.bankName : each.bankNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="bankName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bankBranchNameKey ? errors.bankBranchNameKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Branch Name */}

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
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.bankBranchNameKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {<FormattedLabel id="msedclBranch" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      label="Select Service"
                    >
                      {branch &&
                        branch.map((each, index) => {
                          console.log("branch", each);
                          return (
                            <MenuItem key={index} value={each.id}>
                               {language == "en" ? each.branchName : each.branchNameMr}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="bankBranchNameKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bankBranchNameKey ? errors.bankBranchNameKey.message : null}
                </FormHelperText>
              </FormControl>
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
                sx={{ m: 1, minWidth: "50%" }}
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label= {<FormattedLabel id="msedclIFSC" />}
                variant="standard"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                error={!!errors.ifscCode}
                helperText={errors?.ifscCode ? errors.ifscCode.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Acc no */}

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
                label= {<FormattedLabel id="msedclAccNo" />}
                variant="standard"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                error={!!errors.accountNo}
                helperText={errors?.accountNo ? errors.accountNo.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>
            

            {/* Generate forms */}

            <Grid
              container
              rowSpacing={2}
              columnSpacing={1}
              sx={{ paddingLeft: "100px", paddingTop: "40px" }}
            >
              {/* Official Notesheet */}

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
                  <label><FormattedLabel id="officialNotesheet" /></label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    // disabled={officialNotesheetFlag}
                    onClick={() => {
                      setChoice("officialNotesheet"), generateOfficialNotesheet();
                    }}
                  >
                    <FormattedLabel id="generate" />
                  </Button>
                </Grid>
                {/* <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setOfficialNotesheet}
                    fileName={officialNotesheet}
                  />
                </Grid> */}
              </Grid>

              {/* Bill Approval Letter - Part A */}

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
                  <label><FormattedLabel id="billALabel"/></label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    // disabled={billAFlag}
                    onClick={() => {
                      setChoice("billA"), generateBillA();
                    }}
                  >
                      <FormattedLabel id="generate" />
                  </Button>
                </Grid>
                {/* <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setBillA}
                    fileName={billA}
                  />
                </Grid> */}
              </Grid>

              {/* Bill Approval Letter - Part B */}

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
                  <label><FormattedLabel id="billBLabel" /></label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    // disabled={billBFlag}
                    onClick={() => {
                      setChoice("billB"), generateBillB();
                    }}
                  >
                    <FormattedLabel id="generate" />
                  </Button>
                </Grid>
                {/* <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setBillB}
                    fileName={billB}
                  />
                </Grid> */}
              </Grid>

              {/*  Form No. 22 – A */}

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
                  <label> <FormattedLabel id="formALabel" /></label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    // disabled={formAFlag}
                    onClick={() => {
                      setChoice("formA"), generateFormA();
                    }}
                  >
                   <FormattedLabel id="generate" />
                  </Button>
                </Grid>
                {/* <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setFormA}
                    fileName={formA}
                  />
                </Grid> */}
              </Grid>

              {/* Form No. 22 – B */}

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
                  <label><FormattedLabel id="formBLabel" /></label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    // disabled={formBFlag}
                    onClick={() => {
                      setChoice("formB"), generateFormB();
                    }}
                  >
                    <FormattedLabel id="generate" />
                  </Button>
                </Grid>
                {/* <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setFormB}
                    fileName={formB}
                  />
                </Grid> */}
              </Grid>
            </Grid>

            {/* View Form-22 Modal */}

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
                      <h3>Form-22 Generated</h3>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>
            </div>

            {/* Button Row */}

            <Grid container mt={5} border px={5}>
              {/* Save ad Draft */}

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
                  onClick={onSubmitForm}
                  variant="contained"
                  disabled={!(officialNotesheetFlag && billAFlag && billBFlag && formAFlag && formBFlag)}
                >
                  {<FormattedLabel id="sendToDy" />}
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
                }}
              >
                <Button onClick={handleClearButton} variant="contained">
                  {<FormattedLabel id="clear" />}
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
                }}
              >
                <Button
                  variant="contained"
                  onClick={() =>
                    router.push(`/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry`)
                  }
                >
                  {<FormattedLabel id="exit" />}
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Generate and Access Documents */}
          <Grid Container sx={{ display: "none" }}>
            {dataSource && choice === "officialNotesheet" && (
              <OfficialNotesheet
                connectionData={dataSource}
                billData={billData}
                componentRef={componentRef1}
              />
            )}
            {dataSource && choice === "billA" && (
              <BillA connectionData={dataSource} billData={billData} componentRef={componentRef2} />
            )}
            {dataSource && choice === "billB" && (
              <BillB connectionData={dataSource} billData={billData} componentRef={componentRef3} />
            )}
            {dataSource && choice === "formA" && (
              <FormA connectionData={dataSource} billData={billData} componentRef={componentRef4} />
            )}
            {dataSource && choice === "formB" && (
              <FormB connectionData={dataSource} billData={billData}  componentRef={componentRef5} />
            )}
          </Grid>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;

//msedclCateogryKey
