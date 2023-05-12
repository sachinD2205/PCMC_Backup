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
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/billGenerationSchema";
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
import { toast } from "react-toastify";
import CheckIcon from '@mui/icons-material/Check';


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
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
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
    const [buttonInputState, setButtonInputState] = useState();
    const [dyRemark, setDyRemark] = useState("")
    const [exRemark, setExRemark] = useState("")

    const [previousReadingDate, setPreviousReadingDate] = useState("");
    const [currentReadingDate, setCurrentReadingDate] = useState("");
    const [previousReading, setPreviousReading] = useState("");
    const [currentReading, setCurrentReading] = useState("");
    const [consumedUnit, setConsumedUnit] = useState("");
    const [toBePaidAmount, setToBePaidAmount] = useState("");
    const [billDueDate, setBillDueDate] = useState("");
    const [meterStatus, setMeterStatus] = useState("");
    const [arrears, setArrears] = useState("");
    const [dyApprovalRemark, setDyApprovalRemark] = useState("");
    const [exApprovalRemark, setExApprovalRemark] = useState("");
    const [connectionData, setConnectionData] = useState({})

    const [officialNotesheetFlag, setOfficialNotesheetFlag] = useState(false)
    const [billAFlag, setBillAFlag] = useState(false)
    const [billBFlag, setBillBFlag] = useState(false)
    const [formAFlag, setFormAFlag] = useState(false)
    const [formBFlag, setFormBFlag] = useState(false)

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();
    const [fetchData, setFetchData] = useState(null);
    const [isVerified, setIsVerified] = useState([])

    const language = useSelector((state) => state.labels.language);

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

    const handleDigitalSignature = () => {
        handleClose();
    }


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

    const getBillDetails = () => {
        setPreviousReading(dataSource?.prevReading ? dataSource?.prevReading : "-");
        setPreviousReadingDate(dataSource?.prevReadingDate ? dataSource?.prevReadingDate : "-");
        setCurrentReading(dataSource?.currReading ? dataSource?.currReading : "-");
        setCurrentReadingDate(dataSource?.currReadingDate ? dataSource?.currReadingDate : "-");
        setBillDueDate(dataSource?.billDueDate ? dataSource?.billDueDate : "-");
        setConsumedUnit(dataSource?.consumedUnit ? dataSource?.consumedUnit : "-");
        setToBePaidAmount(dataSource?.toBePaidAmount ? dataSource?.toBePaidAmount : "-");
        setArrears(dataSource?.arrears ? dataSource?.arrears : "-");
    }

    const getMeterStatus = () => {
        axios.get(`${urls.EBPSURL}/mstMeterStatus/getAll`).then((res) => {
            let temp = res.data.mstMeterStatusList;
            console.log("temp", temp);
            let _res = temp.find((obj) => obj.id === dataSource?.meterStatusKey)
            setMeterStatus(_res?.meterStatus ? _res?.meterStatus : "-");
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
        setDyRemark(dataSource?.dyApprovalRemark ? dataSource?.dyApprovalRemark : "-");
        setExRemark(dataSource?.exApprovalRemark ? dataSource?.exApprovRemark : "-");
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
    const getAllBillData = async () => {
        let connectionId = router.query.id
        console.log("connectionId", connectionId);
        await axios
            .get(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/getAll`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            .then((r) => {
                let result = r.data.trnMeterReadingAndBillGenerateList;

                let _res = result.find((obj) => obj.id == connectionId)
                console.log("Result", _res)
                if (_res) {
                    setDataSource(_res)
                }
                else {
                    toast("Bill Details not found", {
                        type: "error",
                    });
                    router.push('/ElectricBillingPayment/transaction/billGenerationAndPayment/newBillEntry')
                }

            });
    };

    const onSubmitForm = (btnType) => {
        // dispatch(setNewEntryConnection(formData))
        // Save - DB

        if (btnType === "Save") {
            let formData
            authority[0] === "PROPOSAL APPROVAL" ?
                formData = {
                    ...dataSource,
                    dyApprovalRemark,
                    isApproved: true,
                }
                :
                formData = {
                    ...dataSource,
                    exApprovalRemark,
                    isApproved: true,
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
                        sweetAlert("Approved!", `Bill ${dataSource?.id} Approved Successfully !`, "success");
                        getAllBillData();
                        setButtonInputState(false);
                        setEditButtonInputState(false);
                        setDeleteButtonState(false);
                        router.push('/ElectricBillingPayment/transaction/billGenerationAndPayment/newBillEntry')
                    }
                });
        }
        // Update Data Based On ID
        else if (btnType === "Reject") {
            let formData
            authority[0] === "PROPOSAL APPROVAL" ?
                formData = {
                    ...dataSource,
                    dyApprovalRemark,
                    isApproved: false,
                    isComplete: false,
                }
                :
                formData = {
                    ...dataSource,
                    exApprovalRemark,
                    isApproved: false,
                    isComplete: false,
                }
            const tempData = axios
                .post(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/save`, formData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        sweetAlert("Reject!", `Bill ${dataSource?.id} Rejected Successfully !`, "success");
                        getAllBillData();
                        router.push('/ElectricBillingPayment/transaction/billGenerationAndPayment/newBillEntry')
                    }
                });
        }
        else if (btnType === "sendToMsecdl") {
            let _body = {
                ...dataSource,
                isSentToMsecdl: true,
            }
            console.log("Save New COnnection ............ 19")
            const tempData = axios
                .post(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/save`, _body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })
                .then((res) => {
                    if (res.status == 201) {
                        sweetAlert("DownLoad!", `Bill ${dataSource?.id} Downloaded Successfully !`, "success");
                        getAllBillData();
                        setFetchData(tempData);
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
                            // backgroundColor:'#0E4C92'
                            // backgroundColor:'		#0F52BA'
                            // backgroundColor:'		#0F52BA'
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    >
                        <h2>
                            Meter Reading & Bill Generation Details
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


                        {/* View Generated forms */}

                        <Grid container rowSpacing={2} columnSpacing={1} sx={{ paddingLeft: "100px", paddingTop: "40px" }}>

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
                                <Grid item xl={1}
                                    lg={1}
                                    md={1}
                                    sm={1}
                                    xs={1}>
                                    <Button variant="contained" onClick={() => { generateOfficialNotesheet() }}>
                                        View
                                    </Button>
                                </Grid>
                                {
                                    officialNotesheetFlag ?
                                        <Grid item xl={1}
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}>
                                            <CheckIcon style={{ color: "#556CD6" }} />
                                        </Grid>
                                        : <></>
                                }
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
                                <Grid item xl={1}
                                    lg={1}
                                    md={1}
                                    sm={1}
                                    xs={1}>
                                    <Button variant="contained" onClick={() => { generateBillA() }}>
                                        View
                                    </Button>
                                </Grid>
                                {
                                    billAFlag ?
                                        <Grid item xl={1}
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}>
                                            <CheckIcon style={{ color: "#556CD6" }} />
                                        </Grid>
                                        : <></>
                                }
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
                                <Grid item xl={1}
                                    lg={1}
                                    md={1}
                                    sm={1}
                                    xs={1}>
                                    <Button variant="contained" onClick={() => { generateBillB() }}>
                                        View
                                    </Button>
                                </Grid>
                                {
                                    billBFlag ?
                                        <Grid item xl={1}
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}>
                                            <CheckIcon style={{ color: "#556CD6" }} />
                                        </Grid>
                                        : <></>
                                }
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
                                <Grid item xl={1}
                                    lg={1}
                                    md={1}
                                    sm={1}
                                    xs={1}>
                                    <Button variant="contained" onClick={() => { generateFormA() }}>
                                    View
                                    </Button>
                                </Grid>
                                {
                                    formAFlag ?
                                        <Grid item xl={1}
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}>
                                            <CheckIcon style={{ color: "#556CD6" }} />
                                        </Grid>
                                        : <></>
                                }
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
                                <Grid item xl={1}
                                    lg={1}
                                    md={1}
                                    sm={1}
                                    xs={1}>
                                    <Button variant="contained"
                                        onClick={() => { generateFormB() }}>
                                       View
                                    </Button>
                                </Grid>
                                {
                                    formBFlag ?
                                        <Grid item xl={1}
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}>
                                            <CheckIcon style={{ color: "#556CD6" }} />
                                        </Grid>
                                        : <></>
                                }
                            </Grid>

                        </Grid>

                        {/* Add Remarks */}

                        {
                            authority && authority[0] === "ENTRY" ?
                                <></> :

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
                                            sx={{ m: 1, minWidth: '83%' }}
                                            multiline
                                            value={authority && authority[0] == "PROPOSAL APPROVAL" ? dyApprovalRemark : exApprovalRemark}
                                            variant="outlined"
                                            onChange={(e) => { authority && authority[0] == "PROPOSAL APPROVAL" ? setDyApprovalRemark(e.target.value) : setExApprovalRemark(e.target.value) }}
                                            error={!!errors.remarks}
                                            helperText={
                                                errors?.remarks ? errors.remarks.message : null
                                            }
                                        // InputLabelProps={{
                                        //     //true
                                        //     shrink:
                                        //         (watch("label2") ? true : false) ||
                                        //         (router.query.label2 ? true : false),
                                        // }}
                                        />
                                    </Grid>

                                </Grid>

                        }


                        {/* Modal For Generated Form */}

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
                                            <h3>Form Generated</h3>
                                        </Grid>
                                        {
                                            authority && authority[0] === "ENTRY" ?
                                                <></>
                                                :
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
                                                    <label><b>Add Digital Signature:</b></label>&nbsp;
                                                    <Button variant="contained" onClick={handleDigitalSignature}>
                                                        Digital Signature
                                                        {/* {<FormattedLabel id="saveAsDraft" />} */}
                                                    </Button>
                                                </Grid>
                                        }
                                    </Grid>
                                </Box>
                            </Modal>
                        </div>

                        {/* Button Row */}

                        {
                            authority && authority[0] === "ENTRY" ?
                                <Grid container mt={5} rowSpacing={2} columnSpacing={1} border px={5} sx={{ marginLeft: '110px' }}>
                                    {/* Save ad Draft */}
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

                                </Grid> :
                                dataSource?.status == 8 ?
                                    <Grid container mt={5} rowSpacing={2} columnSpacing={1} border px={5} sx={{ marginLeft: '110px' }}>
                                        {/* Save ad Draft */}
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

                                    </Grid> :
                                    <Grid container mt={5} rowSpacing={2} border px={5}>
                                        {/* Save ad Draft */}

                                        {
                                        authority && authority[0] === "PROPOSAL APPROVAL" && dataSource?.status == 5 && dataSource?.status == 7 || authority && authority[0] === 'FINAL_APPROVAL' && dataSource?.status == 7  ? 
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
                                        <Button onClick={() => { onSubmitForm("Save") }} variant="contained" disabled>
                                            Approve
                                        </Button>
                                    </Grid>
                                    :
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
                                    <Button onClick={() => { onSubmitForm("Save") }} variant="contained" disabled={officialNotesheetFlag && billAFlag && billBFlag && formAFlag && formBFlag ? false : true}>
                                        Approve
                                    </Button>
                                </Grid>
                                    }

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
                                            <Button onClick={() => { onSubmitForm("Reject") }} variant="contained" disabled={authority && authority[0] == "PROPOSAL APPROVAL" && dataSource.dyApprovalStatus == "N" || authority && authority[0] == "FINAL_APPROVAL" && dataSource.exApprovalStatus == "N"}>
                                                Reject
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
                                                onClick={clearButton}
                                                variant="contained"
                                            >
                                                Clear
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
