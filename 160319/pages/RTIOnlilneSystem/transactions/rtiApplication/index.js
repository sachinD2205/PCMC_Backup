import {
    Box,
    Button,
    FormLabel,

    Radio,
    RadioGroup,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextareaAutosize,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import theme from "../../../../theme";
import { Add } from "@mui/icons-material"

import {
    getDocumentFromLocalStorage,
    removeDocumentToLocalStorage,
} from "../../../../components/redux/features/RTIOnlineSystem/rtiOnlineSystem"
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import RTIDocument from "../../Document/RTIDocument.js";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel.js";
// import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/connectionEntrySchema";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { PaymentIcon } from "@mui/icons-material";
import { useEffect } from "react";
import { height } from "@mui/system";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import trnRtiApplicationSchema from "../../../../containers/schema/rtiOnlineSystemSchema/trnRtiApplicationSchema.js";
import urls from "../../../../URLS/urls.js";
import { useDispatch, useSelector } from "react-redux";
import UploadButton from "../../Document/UploadButton";

import styles from "../../../../components/grievanceMonitoring/view.module.css"

const EntryForm = () => {
    const {
        register,
        control,
        handleSubmit,
        methods,
        setValue,
        getValues,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
        resolver: yupResolver(trnRtiApplicationSchema),
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




    const [zoneDetails, setZoneDetails] = useState();
    const [departments, setDepartments] = useState([]);
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [id, setID] = useState();
    const router = useRouter();
    const [slideChecked, setSlideChecked] = useState(false);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [buttonInputState, setButtonInputState] = useState();
    const [meterConnectionDate, setMeterConnectionDate] = useState()
    const dispatch = useDispatch();
    const inputState = getValues("inputState");
    const entryConnectionData = useSelector((state) => state.user.entryConnectionData);
    const [wards, setWards] = useState([]);
    const [selectDepartment, setSubDepartments] = useState(null)
    const [subDepartments, setSubDepartmentList] = useState([])
    let user = useSelector((state) => state.user.user)
    const [genderDetails, setGenderDetails] = useState(false)
    const [isBplval, setIsBpl] = useState(false)
    const logedInUser = localStorage.getItem("loggedInUser")
    const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false)
    const [applicationDetails, setApplicationDetails] = useState([])
    const [applicationNo, setApplicationNumberDetails] = useState([])
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const [applicationId, setApplicationId] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadDoc, setUploadDoc] = useState();
    const [attachedFile, setAttachedFile] = useState("")

    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")

    );
    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    console.log("authority", authority);

    useEffect(() => {
        getZone()
        getGenders()
        getWards()
        getDepartments()
    }, []);

    useEffect(() => {
        getApplicationDetails()
    }, ['applicationNo']);
    const handleClose = () => {
        setOpen(false)
    }

    function temp(arg) {
        filePath = arg
    }

    // getGenders
    const getGenders = () => {
        axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
            setGenderDetails(
                r.data.gender.map((row) => ({
                    id: row.id,
                    gender: row.gender,
                    genderMr: row.genderMr,
                })),
            );
        });
    };

    const getApplicationDetails = (applicationNo) => {
        // if (watch("applicationNo")) {
        if (logedInUser === "citizenUser") {
            axios
                .get(
                    `${urls.RTI}/trnRtiApplication/searchByApplicationNumber?applicationNumber=${applicationNo
                    }`
                    , {
                        headers: {
                            UserId: user.id
                        }
                    })
                .then((res) => {
                    console.log("Application ID" + res.data?.id)
                    setApplicationDetails(res.data)
                })
        } else {
            axios
                .get(
                    `${urls.RTI}/trnRtiApplication/searchByApplicationNumber?applicationNumber=${applicationNo
                    }`
                    , {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        }
                    })
                .then((res) => {
                    console.log("Application ID" + res.data?.id)
                    setApplicationDetails(res.data)
                })
        }
        // }
    }

    const userCitizen = useSelector((state) => {
        console.log("userDetails", state?.user?.user)
        return state?.user?.user
    })

    const userCFC = useSelector((state) => {
        console.log("userDetails", state?.user?.user?.userDao)
        return state?.user?.user?.userDao
    })

    const handleCancel = () => {
        setIsModalOpenForResolved(false)
    }

    const changePaymentStatus = () => {
        const body = {
            activeFlag: "Y",
            isComplete: false,
            isApproved: false,
            paymentModeKey: 1,
            paymentAmount: 1000,
            transactionRefNo: 4562214455,
            transactionDateTime: null,
            "transactionStatus": null,
            ...applicationDetails,
        }

        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`, body, {
                    headers: {
                        UserId: user.id
                    }
                },)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        // removeDocumentToLocalStorage("RTIRelatedDocuments")
                        // router.push('/RTIOnlilneSystem/transactions/rtiApplication/rtiApplicationList')
                        // sweetAlert("Saved!", "Record Saved successfully !", "success");
                        setIsModalOpenForResolved(false)
                        sweetAlert({
                            title: "Saved!",
                            text: "RTI Application Saved successfully !",
                            icon: "success",
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {

                            if (will) {
                                sweetAlert({
                                    // title: "Great!",
                                    text: ` Your Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                    icon: "success",
                                    buttons: ["View Acknowledgement", "Go To Application List"],
                                    dangerMode: false,
                                    closeOnClickOutside: false,
                                }).then((will) => {
                                    if (will) {
                                        {
                                            router.push('/RTIOnlilneSystem/transactions/rtiApplication/rtiApplicationList')
                                        }
                                        removeDocumentToLocalStorage("RTIRelatedDocuments")

                                    } else {
                                        router.push({
                                            pathname:
                                                "/RTIOnlilneSystem/transactions/rtiApplication/ViewRTIApplication",
                                            query: { id: res.data.message.split('[')[1].split(']')[0] },
                                        })
                                        removeDocumentToLocalStorage("RTIRelatedDocuments")

                                    }
                                })
                            }
                        })
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`, body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                },)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        setIsModalOpenForResolved(false)

                        // removeDocumentToLocalStorage("RTIRelatedDocuments")
                        // router.push('/RTIOnlilneSystem/transactions/rtiApplication/rtiApplicationList')
                        // sweetAlert("Saved!", "Record Saved successfully !", "success");
                        sweetAlert({
                            title: "Saved!",
                            text: "RTI Application Saved successfully !",
                            icon: "success",
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {
                            if (will) {
                                sweetAlert({
                                    // title: "Great!",
                                    text: ` Your Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                    icon: "success",
                                    buttons: ["View Acknowledgement", "Go To Application List"],
                                    dangerMode: false,
                                    closeOnClickOutside: false,
                                }).then((will) => {
                                    if (will) {
                                        {
                                            router.push('/RTIOnlilneSystem/transactions/rtiApplication/rtiApplicationList')
                                        }
                                        removeDocumentToLocalStorage("RTIRelatedDocuments")

                                    } else {
                                        router.push({
                                            pathname:
                                                "/RTIOnlilneSystem/transactions/rtiApplication/ViewRTIApplication",
                                            query: { id: res.data.message.split('[')[1].split(']')[0] },
                                        })
                                        removeDocumentToLocalStorage("RTIRelatedDocuments")

                                    }
                                })
                            }
                        })
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    }

    useEffect(() => {
        if (logedInUser === "citizenUser") {
            setValue("applicantFirstName", userCitizen?.firstName)
            setValue("applicantMiddleName", userCitizen?.middleName)
            setValue("applicantLastName", userCitizen?.surname)
            setValue("emailId", userCitizen?.emailID)
            setValue("pinCode", userCitizen?.ppincode)
            setValue("contactDetails", userCitizen?.mobile)
            setValue("gender", userCitizen?.gender)
        }
    }, [userCitizen])

    useEffect(() => {
        if (logedInUser === "cfcUser") {
            setValue("applicantFirstName", userCFC?.firstNameEn)
            setValue("applicantMiddleName", userCFC?.middleNameEn)
            setValue("applicantLastName", userCFC?.lastNameEn)
            setValue("emailId", userCFC?.email)
        }
    }, [userCFC])

    const getZone = () => {
        axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
            setZoneDetails(
                res.data.zone.map((r, i) => ({
                    id: r.id,
                    srNo: i + 1,
                    zoneName: r.zoneName,
                    zone: r.zone,
                    ward: r.ward,
                    area: r.area,
                    zooAddress: r.zooAddress,
                    zooAddressAreaInAcres: r.zooAddressAreaInAcres,
                    zooApproved: r.zooApproved,
                    zooFamousFor: r.zooFamousFor,
                }))
            )
            setIsBpl(false)
        })
    }

    useEffect(() => {
        getSubDepartmentDetails()
    }, [watch("departmentKey")])

    useEffect(() => {
        console.log("watch", watch("isApplicantBelowToPovertyLine"));
    }, [watch("isApplicantBelowToPovertyLine")]);


    const getSubDepartmentDetails = () => {
        if (watch("departmentKey")) {
            axios
                .get(
                    `${urls.RTI}/master/subDepartment/getAllByDeptWise/${watch(
                        "departmentKey"
                    )}`,
                )
                .then((res) => {
                    setSubDepartmentList(
                        res.data.subDepartment.map((r, i) => ({
                            id: r.id,
                            srNo: i + 1,
                            departmentId: r.department,
                            subDepartment: r.subDepartment,
                        }))
                    )
                })
        }
    }

    // get departments
    const getDepartments = () => {
        axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
            setDepartments(
                r.data.department.map((row) => ({
                    id: row.id,
                    department: row.department,
                }))
            );
        });
    };

    const getWards = () => {
        axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
            setWards(
                r.data.ward.map((row) => ({
                    id: row.id,
                    wardName: row.wardName,
                    wardNameMr: row.wardNameMr,
                    wardNo: row.wardNo,
                    wardNoMr: row.wardNoMr,
                })),
            );
        });
    };


    const onSubmitForm = (formData) => {
        const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
        const toDate = moment(formData.toDate).format("YYYY-MM-DD");
        const isBpl = formData.isApplicantBelowToPovertyLine
        const bplCardIssueYear = formData.yearOfIssues
        const bplCardIssuingAuthority = formData.issuingAuthority
        const subject = formData.informationSubject
        const selectedReturnMedia = formData.selectedReturnMedia
        const attachmentDetails = getDocumentFromLocalStorage(
            "RTIRelatedDocuments"
        )
            ? getDocumentFromLocalStorage("RTIRelatedDocuments")
            : "";
        console.log(getDocumentFromLocalStorage(
            "RTIRelatedDocuments"
        ))

        const attachedDocument1 = null;
        const attachedDocument2 = null;
        const attachedDocument3 = null;
        const attachedDocument4 = null;
        const attachedDocument5 = null;
        const attachedDocument6 = null;
        const attachedDocument7 = null;
        const attachedDocument8 = null;
        const attachedDocument9 = null;
        const attachedDocument10 = null;
        // 
        for (var i = 0; i < attachmentDetails.length; i++) {
            if (i === 0) {
                attachedDocument1 = attachmentDetails[i].documentPath
            } else if (i === 1) {
                attachedDocument2 = attachmentDetails[i].documentPath
            } else if (i === 2) {
                attachedDocument3 = attachmentDetails[i].documentPath
            } else if (i === 3) {
                attachedDocument4 = attachmentDetails[i].documentPath
            } else if (i === 4) {
                attachedDocument5 = attachmentDetails[i].documentPath
            } else if (i === 5) {
                attachedDocument6 = attachmentDetails[i].documentPath
            } else if (i === 6) {
                attachedDocument7 = attachmentDetails[i].documentPath
            } else if (i === 7) {
                attachedDocument8 = attachmentDetails[i].documentPath
            } else if (i === 8) {
                attachedDocument9 = attachmentDetails[i].documentPath
            } else if (i == 9) {
                attachedDocument10 = attachmentDetails[i].documentPath
            }
        }

        const body = {
            ...formData,
            fromDate,
            toDate,
            isBpl,
            bplCardIssueYear,
            bplCardIssuingAuthority,
            subject,
            selectedReturnMedia,
            attachedDocument1,
            attachedDocument2,
            attachedDocument3,
            attachedDocument4,
            attachedDocument5,
            attachedDocument6,
            attachedDocument7,
            attachedDocument8,
            attachedDocument9,
            attachedDocument10
        };
        let temp = {};
        console.log("body", JSON.stringify(body));
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`, body, {
                    headers: {
                        // Authorization: `Bearer ${user.token}`,
                        UserId: user.id
                    },
                },)
                .then((res) => {
                    console.log("res", isBpl);
                    var a = res.data.message;
                    if (res.status == 201) {
                        if (isBpl === "true") {
                            // sweetAlert("Saved!", "Record Saved successfully !", "success");
                            sweetAlert({
                                title: "Saved!",
                                text: "RTI Application Saved successfully !",
                                icon: "success",
                                dangerMode: false,
                                closeOnClickOutside: false,
                            }).then((will) => {
                                if (will) {
                                    sweetAlert({
                                        // title: "Great!",
                                        text: ` Your Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                        icon: "success",
                                        buttons: ["View Acknowledgement", "Go To Application List"],
                                        dangerMode: false,
                                        closeOnClickOutside: false,
                                    }).then((will) => {
                                        if (will) {
                                            {
                                                router.push('/RTIOnlilneSystem/transactions/rtiApplication/rtiApplicationList')
                                            }
                                            removeDocumentToLocalStorage("RTIRelatedDocuments")

                                        } else {
                                            router.push({
                                                pathname:
                                                    "/RTIOnlilneSystem/transactions/rtiApplication/ViewRTIApplication",
                                                query: { id: res.data.message.split('[')[1].split(']')[0] },
                                            })
                                            removeDocumentToLocalStorage("RTIRelatedDocuments")

                                        }
                                    })
                                }
                            })
                        } else {
                            var a = res.data.message;
                            getApplicationDetails(res.data.message.split('[')[1].split(']')[0])
                            setApplicationNumberDetails(res.data.message.split('[')[1].split(']')[0])
                            setIsModalOpenForResolved(true)
                        }

                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`, body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        if (isBpl === "true") {
                            // sweetAlert("Saved!", "Record Saved successfully !", "success");
                            // var a = res.data.message;
                            // removeDocumentToLocalStorage("RTIRelatedDocuments")
                            // router.push('/RTIOnlilneSystem/transactions/rtiApplication/rtiApplicationList')
                            sweetAlert({
                                title: "Saved!",
                                text: "RTI Application Saved successfully !",
                                icon: "success",
                                dangerMode: false,
                                closeOnClickOutside: false,
                            }).then((will) => {
                                if (will) {
                                    sweetAlert({
                                        // title: "Great!",
                                        text: ` Your Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                        icon: "success",
                                        buttons: ["View Acknowledgement", "Go To Application List"],
                                        dangerMode: false,
                                        closeOnClickOutside: false,
                                    }).then((will) => {
                                        if (will) {
                                            {
                                                router.push('/RTIOnlilneSystem/transactions/rtiApplication/rtiApplicationList')
                                            }
                                            removeDocumentToLocalStorage("RTIRelatedDocuments")

                                        } else {
                                            router.push({
                                                pathname:
                                                    "/RTIOnlilneSystem/transactions/rtiApplication/ViewRTIApplication",
                                                query: { id: res.data.message.split('[')[1].split(']')[0] },
                                            })
                                            removeDocumentToLocalStorage("RTIRelatedDocuments")

                                        }
                                    })
                                }

                            })

                        } else {
                            var a = res.data.message;
                            console.log("AAAAAAAAAA " + a)
                            console.log("HHHHHHHHHHHHHHHHh " + res.data.message.split('[')[1].split(']')[0])
                            getApplicationDetails(res.data.message.split('[')[1].split(']')[0])
                            setApplicationNumberDetails(res.data.message.split('[')[1].split(']')[0])
                            setIsModalOpenForResolved(true)
                        }
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    };

    const onRadioButtonPress = (itemIdx) => {
        console.log("Clicked", itemIdx);
    };
 

    const cancellButton = () => {
        reset({
            ...resetValuesCancell,

        });
    };

    const resetValuesCancell = {
        fromDate: null,
        toDate: null,
        applicantFirstName: "",
        applicantMiddleName: "",
        applicantLastName: "",
        gender: "",
        address: "",
        pinCode: "",

        contactDetails: "",
        emailId: "",
        education: "",

        wardKey: "",
        zoneKey: "",
        departmentKey: "",
        subDepartmentKey: "",
        isApplicantBelowToPovertyLine: "",

        bplCardNo: "",
        yearOfIssues: "",
        issuingAuthority: "",
        informationSubject: "",

        description: "",

    };


    // View
    return (
        <>
            <ThemeProvider theme={theme}>
                <Paper
                    elevation={8}
                    variant="outlined"
                    sx={{
                        border: 1,
                        borderColor: "grey.500",
                        marginLeft: "10px",
                        marginRight: "10px",
                        // marginTop: "10px",
                        marginBottom: "60px",
                        padding: 1,
                    }}
                >
                    <Box
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    >
                        <h2> <FormattedLabel id="rtiApplication" /></h2>
                    </Box>

                    <Divider />
                    <Box
                        sx={{
                            marginLeft: 5,
                            marginRight: 5,
                            marginBottom: 5,
                            padding: 1,
                        }}>
                        <Box p={4}>
                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
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
                                            <TextField
                                                sx={{ minWidth: "230px" }}
                                                disabled={logedInUser === "citizenUser" ? true : false}
                                                // InputLabelProps={{ shrink: logedInUser === "citizenUser" ? true : false }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicantFirstName" />}
                                                multiline
                                                variant="standard"
                                                {...register("applicantFirstName")}
                                                error={!!errors.applicantFirstName}
                                                helperText={
                                                    errors?.applicantFirstName ? errors.applicantFirstName.message : null
                                                }
                                            />
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
                                                sx={{ minWidth: "230px" }}
                                                disabled={logedInUser === "citizenUser" ? true : false}
                                                // InputLabelProps={{ shrink: logedInUser === "citizenUser" ? true : false }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicantMiddleName" />}
                                                multiline
                                                variant="standard"
                                                {...register("applicantMiddleName")}
                                                error={!!errors.applicantMiddleName}
                                                helperText={
                                                    errors?.applicantMiddleName ? errors.applicantMiddleName.message : null
                                                }
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
                                                sx={{ minWidth: "230px" }}
                                                disabled={logedInUser === "citizenUser" ? true : false}
                                                // InputLabelProps={{ shrink: logedInUser === "citizenUser" ? true : false }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicantLastName" />}
                                                multiline
                                                variant="standard"
                                                {...register("applicantLastName")}
                                                error={!!errors.applicantLastName}
                                                helperText={
                                                    errors?.applicantLastName ? errors.applicantLastName.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "justify-flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <FormControl
                                                sx={{ minWidth: "230px", marginTop: "2%" }}
                                                variant="standard"
                                                error={!!errors.gender}
                                                disabled={logedInUser === "citizenUser" ? true : false}
                                            // InputLabelProps={{ shrink: logedInUser === "citizenUser" ? true : false }}
                                            >
                                                <InputLabel
                                                    id="demo-simple-select-standard-label"
                                                // disabled={isDisabled}
                                                >
                                                    <FormattedLabel id="gender" />
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            value={
                                                                field.value
                                                            }
                                                            onChange={(value) => field.onChange(value)}
                                                        >
                                                            {genderDetails &&
                                                                genderDetails.map((value, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={
                                                                            value?.id
                                                                        }
                                                                    >
                                                                        {
                                                                            value?.gender
                                                                        }
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="gender"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.zoneKey ? errors.zoneKey.message : null}
                                                </FormHelperText>
                                            </FormControl>
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
                                            <TextField
                                                sx={{ minWidth: "230px" }}
                                                id="standard-textarea"
                                                disabled={logedInUser === "citizenUser" ? true : false}
                                                // InputLabelProps={{ shrink: logedInUser === "citizenUser" ? true : false }}
                                                label={<FormattedLabel id="pinCode" />}
                                                type="number"
                                                variant="standard"
                                                {...register("pinCode")}
                                                error={!!errors.pinCode}
                                                helperText={
                                                    errors?.pinCode ? errors.pinCode.message : null
                                                }
                                            />
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
                                            <TextField
                                                sx={{ minWidth: "230px" }}
                                                id="standard-textarea"
                                                type="number"
                                                disabled={logedInUser === "citizenUser" ? true : false}
                                                // InputLabelProps={{ shrink: logedInUser === "citizenUser" ? true : false }}
                                                label={<FormattedLabel id="contactDetails" />}

                                                variant="standard"
                                                {...register("contactDetails")}
                                                error={!!errors.contactDetails}
                                                helperText={
                                                    errors?.contactDetails ? errors.contactDetails.message : null
                                                }
                                            />
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
                                            <TextField
                                                id="standard-basic"
                                                sx={{ width: "88%" }}
                                                multiline
                                                minRows={1}
                                                maxRows={6}
                                                label={<FormattedLabel id="address" />}

                                                variant="standard"
                                                {...register("address")}
                                                error={!!errors.address}
                                                helperText={
                                                    errors?.address ? errors.address.message : null
                                                }
                                            />
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
                                            <TextField
                                                label={<FormattedLabel id="emailId" />}
                                                id="standard-textarea"
                                                disabled={logedInUser === "citizenUser" ? true : false}

                                                sx={{ width: 230 }}
                                                variant="standard"
                                                {...register("emailId")}
                                                error={!!errors.emailId}
                                                helperText={
                                                    errors?.emailId ? errors.emailId.message : null
                                                }
                                            />
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
                                            <FormControl flexDirection='row'>
                                                <FormLabel
                                                    sx={{ width: 230, marginTop: "25px" }}
                                                    id='demo-row-radio-buttons-group-label'
                                                >
                                                    {<FormattedLabel id='education' />}
                                                </FormLabel>

                                                <Controller
                                                    name='education'
                                                    control={control}
                                                    defaultValue=''
                                                    {...register("education ")}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            disabled={inputState}
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            selected={field.value}
                                                            row
                                                            aria-labelledby='demo-row-radio-buttons-group-label'
                                                        >
                                                            <FormControlLabel
                                                                value='educated'
                                                                {...register("education")}

                                                                disabled={inputState}
                                                                control={<Radio size='small' />}
                                                                label={<FormattedLabel id='educated' />}
                                                                error={!!errors.education}
                                                                helperText={
                                                                    errors?.education ? errors.education.message : null
                                                                }
                                                            />
                                                            <FormControlLabel
                                                                value='unEducated'
                                                                {...register("education")}
                                                                disabled={inputState}
                                                                control={<Radio size='small' />}
                                                                label={<FormattedLabel id='unEducated' />}
                                                                error={!!errors.education}
                                                                helperText={
                                                                    errors?.education ? errors.education.message : null
                                                                }
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>

                                        {/* Button Row */}

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                            <FormControl
                                                sx={{ width: 230, marginTop: "2%" }}
                                                variant="standard"
                                                error={!!errors.zoneKey}
                                            >
                                                <InputLabel
                                                    id="demo-simple-select-standard-label"
                                                // disabled={isDisabled}
                                                >
                                                    <FormattedLabel id="zoneKey" />
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            value={
                                                                field.value
                                                            }
                                                            onChange={(value) => field.onChange(value)}
                                                        >
                                                            {zoneDetails &&
                                                                zoneDetails.map((value, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={
                                                                            value?.id
                                                                        }
                                                                    >
                                                                        {
                                                                            value?.zoneName
                                                                        }
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="zoneKey"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.zoneKey ? errors.zoneKey.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                            <FormControl

                                                sx={{ width: 230, marginTop: "2%" }}
                                                variant="standard"
                                                error={!!errors.wardKey}
                                            >
                                                <InputLabel
                                                    id="demo-simple-select-standard-label"
                                                // disabled={isDisabled}
                                                >
                                                    <FormattedLabel id="wardKey" />
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            value={
                                                                field.value
                                                            }
                                                            onChange={(value) => field.onChange(value)}
                                                        >
                                                            {wards &&
                                                                wards.map((value, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={
                                                                            value?.id
                                                                        }
                                                                    >
                                                                        {
                                                                            value?.wardName
                                                                        }
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="wardKey"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.wardKey ? errors.wardKey.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                            <FormControl
                                                sx={{ width: 230, marginTop: "2%" }}
                                                variant="standard"
                                                error={!!errors.departmentKey}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    <FormattedLabel id="departmentKey" />
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            // sx={{ width: 250 }}
                                                            autoFocus
                                                            fullWidth
                                                            value={field.value}
                                                            onChange={(value) => {
                                                                field.onChange(value),
                                                                    setSubDepartments(value.target.value)
                                                                getSubDepartmentDetails()
                                                            }}
                                                            label={<FormattedLabel id="departmentKey" />}
                                                        >
                                                            {departments &&
                                                                departments.map((department, index) => (
                                                                    <MenuItem key={index} value={department.id}>
                                                                        {department.department}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="departmentKey"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.departmentKey ? errors.departmentKey.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        {/* {subDepartments.length !== 0 ? ( */}
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <FormControl
                                                sx={{ width: 230, marginTop: "2%" }}
                                                variant="standard"
                                                error={!!errors.subDepartmentKey}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    <FormattedLabel id="subDepartmentKey" />
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            fullWidth
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            label={<FormattedLabel id="subDepartmentKey" />
                                                            }
                                                        >
                                                            {subDepartments &&
                                                                subDepartments?.map((subDepartment, index) => (
                                                                    <MenuItem key={index} value={subDepartment.id}>
                                                                        {subDepartment.subDepartment}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="subDepartmentKey"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.subDepartmentKey ? errors.subDepartmentKey.message : null}
                                                </FormHelperText>
                                            </FormControl>
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

                                            <FormControl>
                                                <FormLabel
                                                    sx={{ width: 230, marginTop: "10px" }}
                                                    id='demo-row-radio-buttons-group-label'
                                                >
                                                    {<FormattedLabel id='isApplicantBelowToPovertyLine' />}
                                                </FormLabel>
                                                <RadioGroup
                                                    style={{ marginTop: 5 }}
                                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                                    row
                                                    name='isApplicantBelowToPovertyLine'
                                                    control={control}
                                                    defaultValue=''
                                                    {...register("isApplicantBelowToPovertyLine")}
                                                >
                                                    <FormControlLabel
                                                        value="true"
                                                        control={<Radio />}
                                                        label={<FormattedLabel id='yes' />}
                                                        name="RadioButton"
                                                        {...register("isApplicantBelowToPovertyLine")}
                                                        error={!!errors.isApplicantBelowToPovertyLine}
                                                        helperText={
                                                            errors?.isApplicantBelowToPovertyLine
                                                                ? errors.isApplicantBelowToPovertyLine.message
                                                                : null
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        // style={{ marginLeft: 50 }}
                                                        value="false"
                                                        control={<Radio />}
                                                        label={<FormattedLabel id='no' />}
                                                        name="RadioButton"
                                                        {...register("isApplicantBelowToPovertyLine")}
                                                        error={!!errors.isApplicantBelowToPovertyLine}
                                                        helperText={
                                                            errors?.isApplicantBelowToPovertyLine
                                                                ? errors.isApplicantBelowToPovertyLine.message
                                                                : null
                                                        }
                                                    />

                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>

                                        {watch("isApplicantBelowToPovertyLine") == "true" && <>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={6}
                                                sm={6}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <TextField
                                                    sx={{ width: 230 }}
                                                    id="standard-textarea"
                                                    label={<FormattedLabel id="bplCardNo" />}
                                                    multiline
                                                    variant="standard"
                                                    {...register("bplCardNo")}
                                                    error={!!errors.bplCardNo}
                                                    helperText={
                                                        errors?.bplCardNo ? errors.bplCardNo.message : null
                                                    }
                                                />
                                            </Grid>
                                        </>}
                                        {watch("isApplicantBelowToPovertyLine") == "true" && <>
                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={6}
                                                sm={6}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            ><TextField
                                                    sx={{ width: 230 }}
                                                    id="standard-textarea"
                                                    label={<FormattedLabel id="yearOfIssues" />}
                                                    multiline
                                                    variant="standard"
                                                    {...register("yearOfIssues")}
                                                    error={!!errors.yearOfIssues}
                                                    helperText={
                                                        errors?.yearOfIssues ? errors.yearOfIssues.message : null
                                                    } />
                                            </Grid>
                                        </>}

                                        {watch("isApplicantBelowToPovertyLine") == "true" && <>

                                            <Grid
                                                item
                                                xl={4}
                                                lg={4}
                                                md={6}
                                                sm={6}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <TextField
                                                    sx={{ width: 230 }}
                                                    id="standard-textarea"
                                                    label={<FormattedLabel id="issuingAuthority" />}
                                                    multiline
                                                    variant="standard"
                                                    {...register("issuingAuthority")}
                                                    error={!!errors.issuingAuthority}
                                                    helperText={
                                                        errors?.issuingAuthority ? errors.issuingAuthority.message : null
                                                    }
                                                />
                                            </Grid>
                                        </>}


                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                sx={{ width: 570 }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="informationSubject" />}
                                                multiline
                                                variant="standard"
                                                {...register("informationSubject")}
                                                error={!!errors.informationSubject}
                                                helperText={
                                                    errors?.informationSubject ? errors.informationSubject.message : null
                                                }
                                            />
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
                                                // marginLeft: 7
                                            }}
                                        >
                                            <FormControl
                                                sx={{ width: 230, marginTop: "10px", }}
                                            >

                                                <FormLabel
                                                    id='demo-row-radio-buttons-group-label'
                                                >
                                                    {<FormattedLabel id='requiredInfoDeliveryDetails' />}
                                                </FormLabel>

                                                <Controller
                                                    name='selectedReturnMedia'
                                                    control={control}
                                                    defaultValue=''
                                                    {...register("selectedReturnMedia")}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            disabled={inputState}
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            selected={field.value}
                                                            row
                                                            aria-labelledby='demo-row-radio-buttons-group-label'
                                                        >
                                                            <FormControlLabel
                                                                // sx={{ width: 100,  marginLeft:7}}
                                                                {...register("selectedReturnMedia")}
                                                                value='byPost'
                                                                disabled={inputState}
                                                                control={<Radio size='small' />}
                                                                label={<FormattedLabel id='byPost' />}
                                                                error={!!errors.selectedReturnMedia}
                                                                helperText={
                                                                    errors?.selectedReturnMedia ? errors.selectedReturnMedia.message : null
                                                                }
                                                            />
                                                            <FormControlLabel
                                                                value='personally'
                                                                // sx={{ width: 100,  marginLeft:7}}
                                                                {...register("selectedReturnMedia")}
                                                                disabled={inputState}
                                                                control={<Radio size='small' />}
                                                                label={<FormattedLabel id='personally' />}
                                                                error={!!errors.selectedReturnMedia}
                                                                helperText={
                                                                    errors?.selectedReturnMedia ? errors.selectedReturnMedia.message : null
                                                                }
                                                            />
                                                            <FormControlLabel
                                                                value='softCopy'
                                                                {...register("selectedReturnMedia")}
                                                                disabled={inputState}
                                                                control={<Radio size='small' />}
                                                                label={<FormattedLabel id='softCopy' />}
                                                                error={!!errors.selectedReturnMedia}
                                                                helperText={
                                                                    errors?.selectedReturnMedia ? errors.selectedReturnMedia.message : null
                                                                }
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </FormControl>
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
                                            <FormControl
                                                style={{ backgroundColor: "white", width: 230 }}
                                                sx={{ marginTop: 2 }}
                                                error={!!errors.fromDate}
                                            >
                                                <Controller
                                                    control={control}
                                                    name="fromDate"
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                inputFormat="DD/MM/YYYY"
                                                                label={
                                                                    <span style={{ fontSize: 16 }}>
                                                                        {<FormattedLabel id="fromDate" />}
                                                                    </span>
                                                                }
                                                                value={field.value}
                                                                onChange={(date) => field.onChange(date)}
                                                                selected={field.value}
                                                                center
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
                                                <FormHelperText>
                                                    {errors?.fromDate ? errors.fromDate.message : null}
                                                </FormHelperText>
                                            </FormControl>
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
                                            <FormControl
                                                style={{ backgroundColor: "white", width: 230, }}
                                                sx={{ marginTop: 2 }}
                                                error={!!errors.toDate}
                                            >
                                                <Controller
                                                    control={control}
                                                    name="toDate"
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                inputFormat="DD/MM/YYYY"
                                                                label={
                                                                    <span style={{ fontSize: 16 }}>
                                                                        {<FormattedLabel id="toDate" />}
                                                                    </span>
                                                                }
                                                                value={field.value}
                                                                onChange={(date) => field.onChange(date)}
                                                                selected={field.value}
                                                                center
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
                                                <FormHelperText>
                                                    {errors?.toDate ? errors.toDate.message : null}
                                                </FormHelperText>
                                            </FormControl>
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
                                        ></Grid>
                                        <Grid
                                            item
                                            spacing={3}
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                        </Grid>
                                        <Grid
                                            item
                                            spacing={3}
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
                                                sx={{ width: "88%" }}

                                                id="standard-textarea"
                                                label={<FormattedLabel id="description" />}
                                                multiline
                                                variant="standard"
                                                {...register("description")}
                                                error={!!errors.description}
                                                helperText={
                                                    errors?.description ? errors.description.message : null
                                                }
                                            />
                                        </Grid>


                                        <Grid
                                            item
                                            spacing={3}
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
                                                sx={{ width: "88%" }}

                                                id="standard-textarea"
                                                label="Additional Information"
                                                // label={<FormattedLabel id="description" />}
                                                multiline
                                                variant="standard"
                                                {...register("description")}
                                                error={!!errors.description}
                                                helperText={
                                                    errors?.description ? errors.description.message : null
                                                }
                                            />
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            spacing={3}
                                            md={12}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box sx={{ width: "88%", marginTop: 5 }}>
                                                <RTIDocument />
                                            </Box>
                                        </Grid>

                                        <Grid
                                            container
                                            spacing={5}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                paddingTop: "10px",
                                                marginTop: "20px",
                                            }}
                                        >
                                            {watch("isApplicantBelowToPovertyLine") == "false" && <><Grid item>
                                                <Button
                                                    sx={{ marginRight: 8 }}
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<SaveIcon />}
                                                >
                                                    <FormattedLabel id="saveAndPay" />
                                                </Button>
                                            </Grid></>}
                                            {watch("isApplicantBelowToPovertyLine") == "true" && <><Grid item>
                                                <Button
                                                    sx={{ marginRight: 8 }}
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<SaveIcon />}
                                                >
                                                    <FormattedLabel id="save" />
                                                </Button>
                                            </Grid></>}
                                            <Grid item>
                                                <Button
                                                    sx={{ marginRight: 8 }}
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<ClearIcon />}
                                                    onClick={() => cancellButton()}
                                                >
                                                    <FormattedLabel id="clear" />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>
                            </FormProvider>
                            <Modal
                                title="Modal For Payment"
                                open={isModalOpenForResolved}
                                onOk={true}
                                onClose={handleCancel} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
                                footer=""
                                // width="1800px"
                                // height="auto"
                                sx={{
                                    padding: 5,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "90%",
                                        backgroundColor: "white",
                                        height: "40vh",
                                    }}
                                >

                                    <Box style={{ height: "60vh" }}>
                                        <>
                                            {/* <form onSubmit={handleSubmit(onSubmitForm)}> */}
                                            <Grid container sx={{ padding: "10px" }}>
                                                <Grid item
                                                    spacing={3}
                                                    xl={6}
                                                    lg={6}
                                                    md={6}

                                                    sm={12}
                                                    xs={12} sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginTop: 20
                                                    }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<ExitToAppIcon />}
                                                        onClick={() => changePaymentStatus()}
                                                    >
                                                        <FormattedLabel id="payment" />
                                                    </Button>
                                                </Grid>
                                                <Grid item
                                                    spacing={3}
                                                    xl={6}
                                                    lg={6}
                                                    md={6}

                                                    sm={12}
                                                    xs={12} sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginTop: 20
                                                    }}>
                                                    <Button
                                                        sx={{ marginRight: 8 }}
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<ClearIcon />}
                                                        onClick={() => handleCancel()}
                                                    >
                                                        <FormattedLabel id="closeModal" />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            {/* </form> */}
                                        </>
                                    </Box>
                                </Box>
                            </Modal>
                        </Box>
                    </Box>
                </Paper>
            </ThemeProvider>
            {/* </Box> */}

            {/* </BasicLayout> */}
        </>
    );
};

export default EntryForm;