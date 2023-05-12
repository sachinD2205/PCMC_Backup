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
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/billPaymentSchema";
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
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
// import samplePdf from "../../../../../public/certificate.pdf"
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { setNewEntryConnection } from '../../../../../features/userSlice'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import UploadButton from "../../../../../components/fileUpload/UploadButton";


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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const router = useRouter();
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [dataSource, setDataSource] = useState([]);
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [generateFormFlag, setGenerateFormFlag] = useState(false)
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [slideChecked, setSlideChecked] = useState(false);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [ward, setWard] = useState("");
    const [department, setDepartment] = useState("");
    const [zone, setZone] = useState("");
    const [consumerName, setConsumerName] = useState("")
    const [consumerAddress, setConsumerAddress] = useState("")
    const [pincode, setPincode] = useState("")
    const [consumptionType, setConsumptionType] = useState("");
    const [loadType, setLoadType] = useState("");
    const [phaseType, setPhaseType] = useState("");
    const [slabType, setSlabType] = useState("");
    const [usageType, setUsageType] = useState("");
    const [msedclCategory, setMsedclCategory] = useState("");
    const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState("");
    const [subDivision, setSubDivision] = useState("");
    const [departmentCategory, setDepartmentCategory] = useState("");
    const [remark, setRemark] = useState("");
    const [sanctionedLoad, setSanctionedLoad] = useState("");
    const [connectedLoad, setConnectedLoad] = useState("");
    const [quotationDate, setQuotationDate] = useState("");
    const [quotationAmount, setQuotationAmount] = useState("");
    const [quotationNo, setQuotationNo] = useState("");
    const [desc, setDesc] = useState("");
    const [bank, setBank] = useState("");
    const [branch, setBranch] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [amount, setAmount] = useState("");
    const [checkNoOrUtrNo, setCheckNoOrUtrNo] = useState("");
    const [buttonInputState, setButtonInputState] = useState();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();
    const [fetchData, setFetchData] = useState(null);
    const [paymentDate, setPaymentDate] = useState()
    const [billingCycle, setBillingCycle] = useState([]);
    const [dgDyApprovalRemarks, setDgDyApprovalRemarks] = useState("");
    const [dgExApprovalRemarks, setDgExApprovalRemarks] = useState("");
    const [billDyApprovalRemarks, setBillDyApprovalRemarks] = useState("");
    const [billExApprovalRemarks, setBillExApprovalRemarks] = useState("");

    const language = useSelector((state) => state.labels.language);

    //get logged in user
    const user = useSelector((state) => state.user.user);

    //get entry Connection data from store
    const entryConnectionData = useSelector((state) => state.user.entryConnectionData);

    // selected menu from drawer

    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")
    );

    console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

    // get authority of selected user

    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    console.log("authority", authority);

    useEffect(() => {
        getNewConnectionsData();
    }, [router.query.id])

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

    console.log("dataSource", dataSource);

    function showDateFormat(date) {
        let formattedDate = date?.split("T");
        return formattedDate ? formattedDate[0] : "-"
    }


    //get Bank details
    const getBank = () => {
        axios.get(`${urls.CFCURL}/master/bank/getAll`).then((res) => {
            let temp = res.data.bank;
            let _res = temp.find((each) => {
                return each.id === dataSource?.bankBranchNameKey
            })
            setBank(_res?.bankName ? _res?.bankName : "-");
            setBranch(_res?.branchName ? _res?.branchName : "-");
        });
    };

    // get Ward Name
    const getWard = () => {
        axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
            let temp = res.data.ward;
            let _res = temp.find((each) => {
                return each.id === dataSource?.wardKey
            })
            setWard(_res?.wardName ? _res?.wardName : "-");
        });
    };

    // get Department Name
    const getDepartment = () => {
        axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
            let temp = res.data.department;
            let _res = temp.find((obj) => obj.id === dataSource?.departmentKey)
            setDepartment(_res?.department ? _res?.department : "-");
        });
    };

    // get Zone Name
    const getZone = () => {
        axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
            let temp = res.data.zone;
            let _res = temp.find((obj) => obj.id === dataSource?.zoneKey)
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
        setDgDyApprovalRemarks(dataSource?.dgDyApprovalRemarks ? dataSource?.dgDyApprovalRemarks : "-")
        setDgExApprovalRemarks(dataSource?.dgExApprovalRemarks ? dataSource?.dgExApprovalRemarks : "-")
        setBillDyApprovalRemarks(dataSource?.blDyApprovalRemarks ? dataSource?.blDyApprovalRemarks : "-")
        setBillExApprovalRemarks(dataSource?.blExApprovalRemarks ? dataSource?.blExApprovalRemarks : "-")
        setPaymentDate(dataSource?.paymentDate && dataSource?.paymentDate);
        setCheckNoOrUtrNo(dataSource?.transactionNo && dataSource?.transactionNo)
        setAmount(dataSource?.amountPaid && dataSource?.amountPaid);
    }

    // get Consumption Type
    const getConsumptionType = () => {
        axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
            let temp = res.data.mstConsumptionTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.consumptionTypeKey)
            setConsumptionType(_res?.consumptionType ? _res?.consumptionType : "-");
        });
    };

    // get Load Type
    const getLoadType = () => {
        axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
            let temp = res.data.mstLoadTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.loadTypeKey)
            setLoadType(_res?.loadType ? _res?.loadType : "-");
        });
    };

    // get Phase Type
    const getPhaseType = () => {
        axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
            let temp = res.data.mstPhaseTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.phaseKey)
            setPhaseType(_res?.phaseType ? _res?.phaseType : "-");
        });
    };

    // get Slab Type
    const getSlabType = () => {
        axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
            let temp = res.data.mstSlabTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.slabTypeKey)
            setSlabType(_res?.slabType ? _res?.slabType : "-");
        });
    };

    // get Usage Type
    const getUsageType = () => {
        axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
            let temp = res.data.mstEbUsageTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.usageTypeKey)
            setUsageType(_res?.usageType ? _res?.usageType : "-");
        });
    };

    // get Msedcl Category  
    const getMsedclCategory = () => {
        axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
            let temp = res.data.mstMsedclCategoryList;
            let _res = temp.find((obj) => obj.id === dataSource?.msedclCategoryKey)
            setMsedclCategory(_res?.msedclCategory ? _res?.msedclCategory : "-");
        });
    };

    // get Billing Division And Unit 
    const getBillingDivisionAndUnit = () => {
        axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
            let temp = res.data.mstBillingUnitList;
            let _res = temp.find((obj) => obj.id === dataSource?.billingUnitKey)
            setBillingDivisionAndUnit(`${_res?.divisionName ? _res?.divisionName : "-"}/${_res?.billingUnit ? _res?.billingUnit : "-"}`);
        });
    };

    // get SubDivision
    const getSubDivision = () => {
        axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
            let temp = res.data.mstSubDivisionList;
            let _res = temp.find((obj) => obj.id === dataSource?.subDivisionKey)
            setSubDivision(_res?.subDivision ? _res?.subDivision : "-");
        });
    };

    // get Department Category
    const getDepartmentCategory = () => {
        axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
            let temp = res.data.mstDepartmentCategoryList;
            let _res = temp.find((obj) => obj.id === dataSource?.departmentCategoryKey)
            setDepartmentCategory(_res?.departmentCategory ? _res?.departmentCategory : "-");
        });
    };

    // Get Table - Data
    const getNewConnectionsData = () => {
        const connectionId = router.query.id;

        axios
            .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`,{
                headers:{
                    Authorization:`Bearer ${user.token}`,
                  }
            })
            .then((r) => {
                let result = r.data.trnNewConnectionEntryList;
                let _res = result.find((obj) => {
                    return obj.id == connectionId
                })
                setDataSource(_res);
            });
    };

    const onSubmitForm = () => {

        let _formData = {
            paymentDate,
            transactionNo: checkNoOrUtrNo,
            amountPaid: amount,
            isComplete: false,
        };

        // Save - DB
        const _body = {
            ...dataSource,
            ..._formData
        }
            console.log("Save New COnnection ............ 1",_body)
            const tempData = axios
                .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, _body, {
                    headers:{
                        Authorization:`Bearer ${user.token}`,
                      }
                })
                .then((res) => {
                    if (res.status == 201) {
                        sweetAlert("Updated!", `Connection ${dataSource?.id} Updated successfully !`, "success");
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

    const generateForm = () => {
        setGenerateFormFlag(true)
        handleOpen();
    }

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
        billingCycleKey: "",
        billingCycleKeyMr: "",
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
                <form>

                    {/* Display Details for Demand Generation Entry */}

                    <Box
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            // backgroundColor:'#0E4C92'
                            // backgroundColor:'		#0F52BA'
                            // backgroundColor:'		#0F52BA'
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    >
                        <h2>
                        New Connection For Demand Generation Details
                            <FormattedLabel id="demandGenerationDetials" />
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                label="DG Dy Approval Remark"
                                sx={{ m: 1, minWidth: '50%' }}
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
                                label="DG EX Approval Remark"
                                sx={{ m: 1, minWidth: '50%' }}
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

                    {/* Display Details for Quotation Entry */}

                    <Box
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            // backgroundColor:'#0E4C92'
                            // backgroundColor:'		#0F52BA'
                            // backgroundColor:'		#0F52BA'
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={showDateFormat(quotationDate)}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                label="Bill Dy Approval Remark"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={billDyApprovalRemarks}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* bill EXE Remark */}

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
                                label="Bill EX Approval Remark"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={billExApprovalRemarks}
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
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    >
                        <h2>
                        New Connection For Payment Entry
                            {/* <FormattedLabel id="billingCycle" /> */}
                        </h2>
                    </Box>

                    {/* Firts Row */}
                    <Grid container sx={{ padding: "10px" }}>

                    <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            sx={{ paddingLeft: "110px", paddingTop: "40px", paddingBottom: "40px" }}
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
                <label>Official Notesheet</label>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button variant="contained" onClick={generateForm}>
                  View
                </Button>
              </Grid>
            </Grid>

            {/* Bill A */}
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
                <label>Bill A</label>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button variant="contained" onClick={generateForm}>
                  View
                </Button>
              </Grid>
            </Grid>

            {/* Bill B */}
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
                <label>Bill B</label>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button variant="contained" onClick={generateForm}>
                  View
                </Button>
              </Grid>
            </Grid>

            {/* Form A */}
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
                <label>Form A</label>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button variant="contained" onClick={generateForm}>
                  View
                </Button>
              </Grid>
            </Grid>

            {/* Form B */}
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
                <label>Form B</label>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button variant="contained" onClick={generateForm}>
                  View
                </Button>
              </Grid>
            </Grid>
          </Grid>

                        {/* First Row */}

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
                            {/* payment date in English */}
                            <FormControl
                                variant="standard"
                                sx={{ m: 1, minWidth: '50%' }}
                                error={!!errors.paymentDate}
                            >
                                <Controller
                                    // variant="standard"
                                    control={control}
                                    name="Payment Date"
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                                variant="standard"
                                                inputFormat="DD-MM-YYYY"
                                                label={
                                                    <span style={{ fontSize: 16 }}>
                                                        Payment Date
                                                        {/* Opinion Request Date */}
                                                        {/* {<FormattedLabel id="opinionRequestDate" />} */}
                                                    </span>
                                                }
                                                value={paymentDate}
                                                onChange={(date) =>
                                                    setPaymentDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                                                }
                                                selected={field.value}
                                                center
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        variant="standard"
                                                        sx={{ width: 230 }}
                                                        InputLabelProps={{
                                                            style: {
                                                                fontSize: 12,
                                                                marginTop: 3,
                                                            },

                                                            //true
                                                            // shrink:
                                                            //     (watch("meterConnectionDate") ? true : false) ||
                                                            //     (router.query.meterConnectionDate
                                                            //         ? true
                                                            //         : false),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                <FormHelperText>
                                    {errors?.paymentDate ? errors.paymentDate.message : null}
                                </FormHelperText>
                            </FormControl>
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
                                sx={{ m: 1, minWidth: '50%' }}
                                disabled={router?.query?.pageMode === "View"}
                                id="standard-textarea"
                                label="Cheque No/UTR No"
                                variant="standard"
                                value={checkNoOrUtrNo}
                                onChange={(e) => setCheckNoOrUtrNo(e.target.value)}
                                error={!!errors.checkNoOrUtrNo}
                                helperText={
                                    errors?.checkNoOrUtrNo ? errors.checkNoOrUtrNo.message : null
                                }
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
                                label="Amount"
                                multiline
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="standard"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                error={!!errors.amount}
                                helperText={
                                    errors?.amount ? errors.amount.message : null
                                }
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
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

                                        <Grid item xl={12}
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                            <h3>Demand Letter Generated</h3>
                                        </Grid>

                                        <Grid item xl={12}
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                            <Button variant="contained" onClick={handleClose}>
                                               DownLoad
                                                {/* {<FormattedLabel id="saveAsDraft" />} */}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Modal>
                        </div>

                        {/* Button Row */}

                        <Grid container mt={5} border px={5}>
                            {/* Save ad Draft */}

                            <Grid item xl={4}
                                lg={4}
                                md={6}
                                sm={6}
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Button onClick={onSubmitForm} variant="contained">
                                    Update
                                    {/* {<FormattedLabel id="saveAsDraft" />} */}
                                </Button>
                            </Grid>

                            <Grid item xl={4}
                                lg={4}
                                md={6}
                                sm={6}
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Button
                                    onClick={() => setButtonText("Clear")}
                                    variant="contained"
                                >
                                    Clear
                                    {/* {<FormattedLabel id="submit" />} */}
                                </Button>
                            </Grid>

                            <Grid item xl={4}
                                lg={4}
                                md={6}
                                sm={6}
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        router.push(
                                            `/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry`
                                        )
                                    }
                                >
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


  //msedclCateogryKey