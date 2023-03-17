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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
// import samplePdf from "../../../../../public/certificate.pdf"
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { setNewEntryConnection } from '../../../../../features/userSlice'
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
    const [dataSource, setDataSource] = useState({});
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [connectionData, setConnectionData] = useState({})
    const [previousReadingDate, setPreviousReadingDate] = useState("");
    const [currentReadingDate, setCurrentReadingDate] = useState("");
    const [previousReading, setPreviousReading] = useState("");
    const [currentReading, setCurrentReading] = useState("");
    const [consumedUnit, setConsumedUnit] = useState("");
    const [toBePaidAmount, setToBePaidAmount] = useState("");
    const [billDueDate, setBillDueDate] = useState("");
    const [meterStatus, setMeterStatus] = useState("");
    const [arrears, setArrears] = useState("");
    const [dyRemark, setDyRemark] = useState("");
    const [exRemark, setExRemark] = useState("");
    const [checkNoAndUtrNo, setCheckNoAndUtrNo] = useState("");
    const [amountPaid, setamountPaid] = useState("");
    const [paymentMode, setPaymentMode] = useState("");

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
    const [sanctionedDemand, setSanctionedDemand] = useState("");
    const [contractDemand, setContractDemand] = useState("");
    const [billingCycle, setBillingCycle] = useState("");
    const [geoCodeGisId, setGeoCodeGisId] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [isVerified, setIsVerified] = useState([])

    const [officialNotesheetFlag, setOfficialNotesheetFlag] = useState(false)
    const [billAFlag, setBillAFlag] = useState(false)
    const [billBFlag, setBillBFlag] = useState(false)
    const [formAFlag, setFormAFlag] = useState(false)
    const [formBFlag, setFormBFlag] = useState(false)



    const language = useSelector((state) => state.labels.language);

    //get logged in user
    const user = useSelector((state) => state.user.user);

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
    console.log("dataSource", dataSource);

    useEffect(() => {
        getAllBillData();
    }, [router.query.id])


    useEffect(() => {
        getBillDetails();
        getMeterStatus();
        getPaymentMode();
        getConnectionById();
    }, [dataSource]);

    useEffect(() => {
        getWard()
        getDepartment()
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
        getBillingCycle();
        getMeterStatus()
    }, [connectionData])

    const generateOfficialNotesheet = () => {
        handleOpen();
        setOfficialNotesheetFlag(true);
    }

    const generateFormA = () => {
        handleOpen();
        setFormAFlag(true);
    }

    const generateFormB = () => {
        handleOpen();
        setFormBFlag(true);

    }

    const generateBillA = () => {
        handleOpen();
        setBillAFlag(true);
    }

    const generateBillB = () => {
        handleOpen();
        setBillBFlag(true);
    }

    function showDateFormat(date) {
        let formattedDate = date?.split("T");
        return formattedDate ? formattedDate[0] : "-"
    }

    const getConnectionById = () => {
        axios.get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }).then((res) => {
            let temp = res.data.trnNewConnectionEntryList;
            setConnectionData(temp && temp.find((obj) => {
                return obj.id == dataSource?.newConnectionKey;
            }));
        });
    }
    console.log("dataSource", dataSource)

    const getBillDetails = () => {
        setPreviousReading(dataSource?.prevReading ? dataSource?.prevReading : "-");
        setPreviousReadingDate(dataSource?.prevReadingDate ? dataSource?.prevReadingDate : "-");
        setCurrentReading(dataSource?.currReading ? dataSource?.currReading : "-");
        setCurrentReadingDate(dataSource?.currReadingDate ? dataSource?.currReadingDate : "-");
        setBillDueDate(dataSource?.billDueDate ? dataSource?.billDueDate : "-");
        setConsumedUnit(dataSource?.consumedUnit ? dataSource?.consumedUnit : "-");
        setToBePaidAmount(dataSource?.toBePaidAmount ? dataSource?.toBePaidAmount : "-");
        setArrears(dataSource?.arrears ? dataSource?.arrears : "-");
        setCheckNoAndUtrNo(dataSource?.transactionNo ? dataSource?.transactionNo : "-")
        setamountPaid(dataSource?.amountPaid ? dataSource?.amountPaid : "-")
        setDyRemark(dataSource?.dyApprovalRemark ? dataSource?.dyApprovalRemark : "-")
        setExRemark(dataSource?.exApprovalRemark ? dataSource?.exApprovalRemark : "-")
    }

    const getMeterStatus = () => {
        axios.get(`${urls.EBPSURL}/mstMeterStatus/getAll`).then((res) => {
            let temp = res.data.mstMeterStatusList;
            console.log("temp", temp);
            let _res = temp.find((obj) => obj.id === dataSource?.meterStatusKey)
            setMeterStatus(_res?.meterStatus ? _res?.meterStatus : "-");
        });
    }

    // Get Payment Mode

    const getPaymentMode = () => {
        axios.get(`${urls.EBPSURL}/master/paymentMode/getAll`).then((res) => {
            console.log("getPaymentMode", res.data);
            let temp = res.data.paymentMode;
            let _res = temp.find((obj) => obj.id === dataSource?.paymentModeKey)
            setPaymentMode(_res?.paymentMode);
        });
    }

    // get Ward Name
    const getWard = () => {
        axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
            let temp = res.data.ward;
            console.log("temp", temp);
            let _res = temp.find((each) => {
                return each.id === connectionData?.wardKey
            })
            setWard(_res?.wardName ? _res?.wardName : "-");
        });
    };

    // get Department Name
    const getDepartment = () => {
        axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
            let temp = res.data.department;
            let _res = temp.find((obj) => obj.id === connectionData?.departmentKey)
            setDepartment(_res?.department ? _res?.department : "-");
        });
    };

    // get Zone Name
    const getZone = () => {
        axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
            let temp = res.data.zone;
            let _res = temp.find((obj) => obj.id === connectionData?.zoneKey)
            setZone(_res?.zoneName ? _res?.zoneName : "-");
        });
    };

    const getConsumerDetails = () => {
        setConsumerName(connectionData?.consumerName ? connectionData?.consumerName : "-");
        setConsumerAddress(connectionData?.consumerAddress ? connectionData?.consumerAddress : "-");
        setPincode(connectionData?.pinCode ? connectionData?.pinCode : "-");
        showDateFormat(connectionData?.meterConnectionDate)
        setSanctionedDemand(connectionData?.sanctionedDemand ? connectionData?.sanctionedDemand : "-");
        setContractDemand(connectionData?.contractDemand ? connectionData?.contractDemand : "-");
        setGeoCodeGisId(connectionData?.geoCodeGisId ? connectionData?.geoCodeGisId : "-");
        setLatitude(connectionData?.latitude ? connectionData?.latitude : "-");
        setLongitude(connectionData?.longitude ? connectionData?.longitude : "-");
        setPreviousReadingDate(dataSource?.prevReadingDate);
        setCurrentReadingDate(dataSource?.currReadingDate);
        setBillDueDate(dataSource?.billDueDate);
        setCurrentReading(dataSource?.currReading ? dataSource?.currReading : "-");
        setPreviousReading(dataSource?.prevReading ? dataSource?.prevReading : "-");
        setConsumedUnit(dataSource?.consumedUnit ? dataSource?.consumedUnit : "-");
        setToBePaidAmount(dataSource?.toBePaidAmount ? dataSource?.toBePaidAmount : "-");
        setArrears(dataSource?.arrears ? dataSource?.arrears : "-");
    }

    // get Consumption Type
    const getConsumptionType = () => {
        axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
            let temp = res.data.mstConsumptionTypeList;
            let _res = temp.find((obj) => obj.id === connectionData?.consumptionTypeKey)
            setConsumptionType(_res?.consumptionType ? _res?.consumptionType : "-");
        });
    };

    // get Billing Cycle
    const getBillingCycle = () => {
        axios.get(`${urls.EBPSURL}/mstBillingCycle/getAll`).then((res) => {
            let temp = res.data.mstBillingCycleList;
            let _res = temp.find((obj) => obj.id === connectionData?.billingCycleKey)
            setBillingCycle(_res?.billingCycle ? _res?.billingCycle : "-");
        });
    };

    // get Load Type
    const getLoadType = () => {
        axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
            let temp = res.data.mstLoadTypeList;
            let _res = temp.find((obj) => obj.id === connectionData?.loadTypeKey)
            setLoadType(_res?.loadType ? _res?.loadType : "-");
        });
    };

    // get Phase Type
    const getPhaseType = () => {
        axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
            let temp = res.data.mstPhaseTypeList;
            let _res = temp.find((obj) => obj.id === connectionData?.phaseKey)
            setPhaseType(_res?.phaseType ? _res?.phaseType : "-");
        });
    };

    // get Slab Type
    const getSlabType = () => {
        axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
            let temp = res.data.mstSlabTypeList;
            let _res = temp.find((obj) => obj.id === connectionData?.slabTypeKey)
            setSlabType(_res?.slabType ? _res?.slabType : "-");
        });
    };

    // get Usage Type
    const getUsageType = () => {
        axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
            let temp = res.data.mstEbUsageTypeList;
            let _res = temp.find((obj) => obj.id === connectionData?.usageTypeKey)
            setUsageType(_res?.usageType ? _res?.usageType : "-");
        });
    };

    // get Msedcl Category  
    const getMsedclCategory = () => {
        axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
            let temp = res.data.mstMsedclCategoryList;
            let _res = temp.find((obj) => obj.id === connectionData?.msedclCategoryKey)
            setMsedclCategory(_res?.msedclCategory ? _res?.msedclCategory : "-");
        });
    };

    // get Billing Division And Unit 
    const getBillingDivisionAndUnit = () => {
        axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
            let temp = res.data.mstBillingUnitList;
            let _res = temp.find((obj) => obj.id === connectionData?.billingUnitKey)
            setBillingDivisionAndUnit(`${_res?.divisionName ? _res?.divisionName : "-"}/${_res?.billingUnit ? _res?.billingUnit : "-"}`);
        });
    };

    // get SubDivision
    const getSubDivision = () => {
        axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
            let temp = res.data.mstSubDivisionList;
            let _res = temp.find((obj) => obj.id === connectionData?.subDivisionKey)
            setSubDivision(_res?.subDivision ? _res?.subDivision : "-");
        });
    };

    // get Department Category
    const getDepartmentCategory = () => {
        axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
            let temp = res.data.mstDepartmentCategoryList;
            let _res = temp.find((obj) => obj.id === connectionData?.departmentCategoryKey)
            setDepartmentCategory(_res?.departmentCategory ? _res?.departmentCategory : "-");
        });
    };

    // Get Table - Data
    const getAllBillData = () => {
        let connectionId = router.query.id
        console.log("connectionId", connectionId);
        axios
            .get(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/getAll`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            .then((r) => {
                let result = r.data.trnMeterReadingAndBillGenerateList;
                // console.log("Result",result)
                let _res = result.find((obj) => obj.id == connectionId)
                setDataSource(_res)
            });
    };

    const onSubmitForm = (btnType) => {

        if (btnType === "Save") {
            let formData = {
                ...dataSource,
                isComplete: true,
            }

            console.log("Save New COnnection ............ 71", formData)
            const tempData = axios
                .post(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/save`, formData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })
                .then((res) => {
                    if (res.status == 201) {
                        sweetAlert("Completed!", `Bill ${dataSource?.id} Generation Completed Successfully !`, "success");
                        getAllBillData();
                        router.push('/ElectricBillingPayment/transaction/billGenerationAndPayment/newBillEntry')
                    }
                });
        }

    };

    const generateDemandLetter = () => {
        handleOpen();
    }


    // cancell Button
    const cancelButton = () => {
        reset({
            ...resetValuesCancel,
        });
        router.push('/ElectricBillingPayment/transaction/billGenerationAndPayment/newBillEntry')
    };

    const clearButton = () => {
        reset({
            ...resetValuesCancel,
        });
    }

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

                    {/* Consumer Details */}

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
                            Consumer Details
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
                                label="Meter Connection Date"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={showDateFormat(dataSource?.meterConnectionDate)}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

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
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={sanctionedDemand}
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
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={contractDemand}
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
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={geoCodeGisId}
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
                                sx={{ m: 1, minWidth: '50%' }}
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
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={latitude}
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
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={longitude}
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
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    >
                        <h2>
                            Bill Generation Details
                            {/* <FormattedLabel id="demandGenerationDetials" /> */}
                        </h2>
                    </Box>

                    <Grid container sx={{ padding: "10px" }}>

                        {/* Previous Reading Date */}

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
                                label="Previous Reading Date"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={showDateFormat(previousReadingDate)}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Previous Reading */}

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
                                label="Previous Reading"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={previousReading}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Current Reading Date */}

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
                                label="Current Reading Date"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={showDateFormat(currentReadingDate)}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Current Reading */}

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
                                label="Current Reading"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={currentReading}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Bill Due Date */}

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
                                label="Bill Due Date"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={showDateFormat(billDueDate)}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Consumed Unit */}

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
                                label="Consumed Unit"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={consumedUnit}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Meter Status */}

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
                                label="Meter Status"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={meterStatus}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* To Be Paid Amount */}

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
                                label="To Be Paid Amount"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={toBePaidAmount}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Arrears */}

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
                                label="Arrears"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={arrears}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Dy Remarks */}

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
                                label="Deputy Remark"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={dyRemark}
                            />
                        </Grid>

                        {/* Executive Remark */}

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
                                label="Executive Remark"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={exRemark}
                                defaultValue={exRemark}
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
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    >
                        <h2>
                            Bill Payment Details
                            {/* <FormattedLabel id="demandGenerationDetials" /> */}
                        </h2>
                    </Box>

                    {/* view generated forms */}
                    <Grid container rowSpacing={2} columnSpacing={1} sx={{ paddingLeft: "100px", paddingTop: "40px", paddingBottom: "30px" }}>

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
                            }}>
                            <Grid item xl={10}
                                lg={10}
                                md={10}
                                sm={10}
                                xs={10}>
                                <label >Official Notesheet</label>
                            </Grid>
                            <Grid item xl={2}
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}>
                                <Button variant="contained" onClick={() => { generateOfficialNotesheet() }}>
                                    View
                                </Button>
                            </Grid>
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
                            }}>
                            <Grid item xl={10}
                                lg={10}
                                md={10}
                                sm={10}
                                xs={10}>
                                <label >Bill Approval Letter - Part A</label>
                            </Grid>
                            <Grid item xl={2}
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}>
                                <Button variant="contained" onClick={() => { generateBillA() }}>
                                    View
                                </Button>
                            </Grid>
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
                            }}>
                            <Grid item xl={10}
                                lg={10}
                                md={10}
                                sm={10}
                                xs={10}>
                                <label >Bill Approval Letter - Part B</label>
                            </Grid>
                            <Grid item xl={2}
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}>
                                <Button variant="contained" onClick={() => { generateBillB() }}>
                                    View
                                </Button>
                            </Grid>
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
                            }}>
                            <Grid item xl={10}
                                lg={10}
                                md={10}
                                sm={10}
                                xs={10}>
                                <label > Form No. 22 – A</label>
                            </Grid>
                            <Grid item xl={2}
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}>
                                <Button variant="contained" onClick={() => { generateFormA() }}>
                                    View
                                </Button>
                            </Grid>
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
                            }}>
                            <Grid item xl={10}
                                lg={10}
                                md={10}
                                sm={10}
                                xs={10}>
                                <label > Form No. 22 – B</label>
                            </Grid>
                            <Grid item xl={2}
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}>
                                <Button variant="contained"
                                    onClick={() => { generateFormB() }}>
                                    View
                                </Button>
                            </Grid>
                        </Grid>

                    </Grid>

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
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={showDateFormat(dataSource?.paymentDate ? dataSource?.paymentDate : "-")}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Payment Mode */}

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
                                label="Payment Mode"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={paymentMode}
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
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={amountPaid}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Cheque No/ UTR No */}

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
                                label="Cheque No/ UTR No"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={checkNoAndUtrNo}
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
                                            <h3>Form Letter Generated</h3>
                                        </Grid>

                                    </Grid>
                                </Box>
                            </Modal>
                        </div>

                        {/* Button Row */}

                        {
                            <Grid container mt={5} rowSpacing={2} columnSpacing={0} border px={5} sx={{ marginLeft: '110px' }}>
                                {/* Save ad Draft */}

                                <Grid item xl={6}
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                    <Button variant="contained" onClick={() => { onSubmitForm("Save") }} disabled={authority && authority[0] !== "ENTRY"}>
                                        Complete
                                    </Button>
                                </Grid>

                                <Grid item xl={3}
                                    lg={3}
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
                                        onClick={cancelButton}
                                    >
                                        Exit
                                        {/* {<FormattedLabel id="cancel" />} */}
                                    </Button>
                                </Grid>

                            </Grid>

                        }

                    </Grid>

                </form>
            </FormProvider>

        </Paper>
    );
};

export default Index;
