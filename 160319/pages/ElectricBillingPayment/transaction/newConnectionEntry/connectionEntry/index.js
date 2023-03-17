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
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
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
  const [sanctionedLoad, setSanctionedLoad] = useState("");
  const [connectedLoad, setConnectedLoad] = useState("");
  const [quotationDate, setQuotationDate] = useState("");
  const [quotationAmount, setQuotationAmount] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [desc, setDesc] = useState("");
  const [bank, setBank] = useState("");
  const [branch, setBranch] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [checkNoOrUtrNo, setCheckNoOrUtrNo] = useState("");
  const [amount, setAmount] = useState("");
  const [contractDemand, setContractDemand] = useState("");
  const [sanctionedDemand, setSanctionedDemand] = useState("");
  const [vanNo, setVanNo] = useState("");
  const [geoCodeGisId, setGeoCodeGisId] = useState("");
  const [consumerNo, setConsumerNo] = useState("");
  const [meterNo, setMeterNo] = useState("");
  const [billingCycleKey, setBillingCycleKey] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [meterConnectionDate, setMeterConnectionDate] = useState(null);
  const [billingCycle, setBillingCycle] = useState([]);
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
    getBillingCycle();
    getNewConnectionsData();
  }, []);

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
    getBank();
  }, [dataSource]);

  //Show File Name
  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    return fileNamee[1];
  }

  function showDateFormat(date) {
    let formattedDate = date?.split("T");
    return formattedDate ? formattedDate[0] : "-";
  }

  // get Billing Cycle
  const getBillingCycle = () => {
    axios.get(`${urls.EBPSURL}/mstBillingCycle/getAll`).then((res) => {
      setBillingCycle(res.data.mstBillingCycleList);
      console.log("getBillingCycle", res.data);
    });
  };

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
    setConsumerName(dataSource?.consumerName ? dataSource?.consumerName : "-");
    setConsumerAddress(dataSource?.consumerAddress ? dataSource?.consumerAddress : "-");
    setPincode(dataSource?.pinCode ? dataSource?.pinCode : "-");
    setSanctionedLoad(dataSource?.sanctionedLoad ? dataSource?.sanctionedLoad : "-");
    setConnectedLoad(dataSource?.connectedLoad ? dataSource?.connectedLoad : "-");
    setQuotationDate(dataSource?.quotationDate ? dataSource?.quotationDate : "-");
    setQuotationAmount(dataSource?.quotationAmount ? dataSource?.quotationAmount : "-");
    setQuotationNo(dataSource?.quotationNo ? dataSource?.quotationNo : "-");
    setDesc(dataSource?.quotationDescription ? dataSource?.quotationDescription : "-");
    setIfscCode(dataSource?.ifscCode ? dataSource?.ifscCode : "-");
    showDateFormat(dataSource?.paymentDate);
    setCheckNoOrUtrNo(dataSource?.transactionNo ? dataSource?.transactionNo : "-");
    setAmount(dataSource?.amountPaid ? dataSource?.amountPaid : "-");
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

  const onSubmitForm = (formData) => {
    let _formData = {
      ...dataSource,
      isComplete: true,
   ...formData,
    };
    console.table("Save New COnnection ............ 14", formData);
    const tempData = axios
        .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, _formData,  {
            headers: {
              Authorization: `Bearer ${user.token}`,
            }
          })
        .then((res) => {
            if (res.status == 201) {
                sweetAlert("Completed!", "Record Completed successfully !", "success");
                getNewConnectionsData();
                setButtonInputState(false);
                setIsOpenCollapse(false);
                setFetchData(tempData);
                setEditButtonInputState(false);
                setDeleteButtonState(false);
                router.push('/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry')
            }
        });
  };

  const generateDemandLetter = () => {
    handleOpen();
  };

  // Delete By ID
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
        console.log("Save New COnnection ............ 15");
        if (willDelete === true) {
          axios
            .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getNewConnectionsData();
                // setButtonInputState(false);
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
          console.log("Save New COnnection ............ 16");
          axios
            .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getNewConnectionsData();
                // setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
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
              Demand Generation Details
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
              Quotation Entry Details
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
                label="Connected Load"
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
                label="Quotation Date"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={showDateFormat(dataSource?.quotationDate)}
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
                label="Description"
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
                value={ifscCode}
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
              Payment Entry Details
              {/* <FormattedLabel id="demandGenerationDetials" /> */}
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Payment Date */}

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
                value={showDateFormat(dataSource?.paymentDate)}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Check No/UTR No */}

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
                label="Cheque No/UTR No"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={checkNoOrUtrNo}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Amount */}

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
                label="Amount"
                sx={{ m: 1, minWidth: "50%" }}
                variant="outlined"
                value={amount}
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
              Connection Entry
              {/* <FormattedLabel id="billingCycle" /> */}
            </h2>
          </Box>

          {/* Firts Row */}
          <Grid container sx={{ padding: "10px" }}>
            {/* First Row */}

            {/* Meter Connection Date*/}

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
              {/* Meter Connection Date in English */}
              <FormControl error={!!errors.meterConnectionDate}>
              <Controller
                control={control}
                sx={{ m: 1, minWidth: "50%" }}
                name="meterConnectionDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      label='Meter Connection Date'
                      // @ts-ignore
                      value={field.value}
                      onChange={(date) => field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "230px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>{errors?.meterConnectionDate ? errors.meterConnectionDate.message : null}</FormHelperText>
            </FormControl>
            </Grid>

            {/* sanctioned Demand */}

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
                name="sanctionedDemand"
                id="standard-textarea"
                label="Sanctioned Demand"
                defaultValue={null}
                variant="standard"
                // value={sanctionedDemand}
                {...register("sanctionedDemand")}
                // onChange={(e) => setSanctionedDemand(e.target.value)}
                error={!!errors.sanctionedDemand}
                helperText={errors?.sanctionedDemand ? errors.sanctionedDemand.message : null}
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
                label="Contract Demand"
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                // value={contractDemand}
                {...register("contractDemand")}
                // onChange={(e) => setContractDemand(e.target.value)}
                error={!!errors.contractDemand}
                helperText={errors?.contractDemand ? errors.contractDemand.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* VAN Number */}

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
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label="VAN Number"
                multiline
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                // value={vanNo}
                {...register("vanNo")}
                // onChange={(e) => setVanNo(e.target.value)}
                error={!!errors.vanNo}
                helperText={errors?.vanNo ? errors.vanNo.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* GeoCode/GIS ID */}

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
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label="GeoCode/GIS ID"
                multiline
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                // value={geoCodeGisId}
                {...register("geoCodeGisId")}
                // onChange={(e) => setGeoCodeGisId(e.target.value)}
                error={!!errors.geoCodeGisId}
                helperText={errors?.geoCodeGisId ? errors.geoCodeGisId.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Consumer No */}

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
                label="Consumer No."
                sx={{ m: 1, minWidth: "50%" }}
                multiline
                variant="standard"
                // value={consumerNo}
                {...register("consumerNo")}
                // onChange={(e) => setConsumerNo(e.target.value)}
                error={!!errors.consumerNo}
                helperText={errors?.consumerNo ? errors.consumerNo.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            {/* Meter No */}

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
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label="Meter No"
                multiline
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                // value={meterNo}
                {...register("meterNo")}
                // onChange={(e) => setMeterNo(e.target.value)}
                error={!!errors.meterNo}
                helperText={errors?.meterNo ? errors.meterNo.message : null}
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
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.billingCycleKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {/* {<FormattedLabel id="NewsWardName" />} */}
                  Billing Cycle
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      // sx={{ width: 200 }}
                      value={field.value}
                      // onChange={(value) => field.onChange(value)}
                      {...register("billingCycleKey")}
                      // onChange={(e) => setBillingCycleKey(e.target.value)}
                      label={<FormattedLabel id="billingCycle" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {billingCycle &&
                        billingCycle.map((cycle, index) => (
                          <MenuItem key={index} value={cycle.id}>
                            {cycle.billingCycle}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="billingCycleKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.billingCycleKey ? errors.billingCycleKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Latitude */}

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
                label="Latitude"
                variant="standard"
                sx={{ m: 1, minWidth: "50%" }}
                // value={latitude}
                {...register("latitude")}
                // onChange={(e) => setLatitude(e.target.value)}
                error={!!errors.latitude}
                helperText={errors?.latitude ? errors.latitude.message : null}
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
                disabled={router?.query?.pageMode === "View"}
                id="standard-textarea"
                label="Longitude"
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                // value={longitude}
                {...register("longitude")}
                // onChange={(e) => setLongitude(e.target.value)}
                error={!!errors.longitude}
                helperText={errors?.longitude ? errors.longitude.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
              />
            </Grid>

            <Grid>
              {/* Button Row */}

              {(user && authority[0] === "ENTRY") || authority[0] === "PAYMENT VERIFICATION" ? (
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
                      Exit
                      {/* {<FormattedLabel id="cancel" />} */}
                    </Button>
                  </Grid>

                  {dataSource?.status == 7 && authority[0] === "PAYMENT VERIFICATION" ? (
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
                            handleOpen();
                          }}
                        >
                          Download Form-22
                        </Button>
                      </Grid>
                    </>
                  ) : (
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
                        type="submit"
                        variant="contained"
                        disabled={authority && authority[0] !== "ENTRY"}
                      >
                        Complete
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Grid container mt={5} rowSpacing={2} border px={5}>
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
                    <Button variant="contained" onClick={handleOpen}>
                      View Demand Letter
                    </Button>
                  </Grid>

                  {/* <Grid item xl={2}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Button variant="contained">
                    Digital Signature
                </Button>
            </Grid> */}

                  <Grid
                    item
                    xl={2}
                    lg={2}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained">Approve</Button>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    lg={2}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained">Reject</Button>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    lg={2}
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
                    xl={1}
                    lg={2}
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
                  Form - 22 Letter
                </Box>
              </Modal>
            </div>
          </Grid>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;
