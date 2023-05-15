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
import RTIAppealDocument from "../../Document/RTIAppealDocument";
import {
    getDocumentFromLocalStorage,
    removeDocumentToLocalStorage,
} from "../../../../components/redux/features/RTIOnlineSystem/rtiOnlineSystem"
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import trnRtiAppealSchema from "../../../../containers/schema/rtiOnlineSystemSchema/trnRtiAppealSchema.js";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls.js";
import { useDispatch, useSelector } from "react-redux";

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
        resolver: yupResolver(trnRtiAppealSchema),
        mode: "onChange",
    });

    const [reload, setCancelbutton] = useState()
    const language = useSelector((state) => state?.labels?.language);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const router = useRouter();
    const [applicationId, setApplicationID] = useState(null)
    const [isBpl, setIsBpl] = useState(null)
    const entryConnectionData = useSelector((state) => state.user.entryConnectionData);
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false)
    const [applicationDetails, setApplicationDetails] = useState([])
    const [applicationNo, setApplicationNumberDetails] = useState([])
    const [departments, setDepartments] = useState([]);
    let user = useSelector((state) => state.user.user)
    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")
    );
    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;
    const logedInUser = localStorage.getItem("loggedInUser")

    useEffect(() => {
        if (router.query.id != undefined) {
            setValue("applicationNo", router.query.id)
        }
        getPaymentMode()
    }, []);

    useEffect(() => {
        getDepartments()
    }, [])

    const handleCancel = () => {
        setIsModalOpenForResolved(false)
    }

    // load department
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

    // change payment status
    const changePaymentStatus = () => {
        const body = {
            activeFlag: "Y",
            isComplete: false,
            isApproved: false,
            ...applicationDetails,
        }
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`, body, {
                    headers: {
                        UserId: user.id
                    }
                },)
                .then((res) => {
                    if (res.status == 201) {
                        setIsModalOpenForResolved(false)
                        sweetAlert({
                            title: language == "en" ? "Saved!" : "जतन केले!",
                            text: language == "en" ? "RTI Appeal Saved Successfully !" : "आरटीआय अपील यशस्वीरित्या जतन झाले!",
                            icon: "success",
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {

                            if (will) {
                                sweetAlert({
                                    text: language == "en" ? ` Your Appeal No Is : ${res.data.message.split('[')[1].split(']')[0]}` : ` तुमचे अपील क्र: ${res.data.message.split('[')[1].split(']')[0]}`,
                                    icon: "success",
                                    buttons: [language == "en" ? "View Acknowledgement" : "पावती पहा", language == "en" ? "Go To Appeal List" : "अपील सूचीवर जा"],
                                    dangerMode: false,
                                    closeOnClickOutside: false,
                                }).then((will) => {
                                    if (will) {
                                        {
                                            router.push('/RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList')
                                        }
                                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                    } else {
                                        router.push({
                                            pathname:
                                                "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                                            query: { id: res.data.message.split('[')[1].split(']')[0] },
                                        })
                                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                    }
                                })
                            }
                        })
                    }
                    else {
                        sweetAlert(language == "en" ? "Error!" : "त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`, body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                },)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        setIsModalOpenForResolved(false)

                        sweetAlert({
                            title: language == "en" ? "Saved!" : "जतन केले!",
                            text: language == "en" ? "RTI Appeal Saved Successfully !" : "आरटीआय अपील यशस्वीरित्या जतन झाले!",
                            icon: "success",
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {
                            if (will) {
                                sweetAlert({
                                    text: language == "en" ? ` Your Appeal No Is : ${res.data.message.split('[')[1].split(']')[0]}` : ` तुमचे अपील क्र: ${res.data.message.split('[')[1].split(']')[0]}`,
                                    icon: "success",
                                    buttons: [language == "en" ? "View Acknowledgement" : "पावती पहा", language == "en" ? "Go To Appeal List" : "अपील सूचीवर जा"],
                                    dangerMode: false,
                                    closeOnClickOutside: false,
                                }).then((will) => {
                                    if (will) {
                                        {
                                            router.push('/RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList')
                                        }
                                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                    } else {
                                        router.push({
                                            pathname:
                                                "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                                            query: { id: res.data.message.split('[')[1].split(']')[0] },
                                        })
                                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                    }
                                })
                            }
                        })
                    }
                    else {
                        sweetAlert(language == "en" ? "Error!" : "त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
                    }
                });
        }
    }

    // load payment mode
    const getPaymentMode = () => {
        axios.get(`${urls.RTI}/master/paymentMode/getAll`).then((res) => {
            setPaymentDetails(
                res.data.paymentMode.map((r, i) => ({
                    id: r.id,
                    srNo: i + 1,
                    paymentMode: r.paymentMode,
                    paymentModePrefix: r.paymentModePrefix,
                    remark: r.remark,
                }))
            )
        })
    }

    // get application by application no
    const searchApplication = () => {
        console.log("departments ", departments)
        if (watch("applicationNo")) {
            if (logedInUser === "citizenUser") {
                axios
                    .get(
                        `${urls.RTI}/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${watch(
                            "applicationNo"
                        )}`, {
                        headers: {
                            UserId: user.id
                        },
                    })
                    .then((res) => {
                        setValue("applicantFirstName", res.data?.applicantFirstName)
                        setValue("applicantMiddleName", res.data?.applicantMiddleName)
                        setValue("applicantLastName", res.data?.applicantLastName)
                        setValue("address", res.data?.address)
                        setValue("informationDescription", res.data?.description)
                        setApplicationID(res.data.id)
                        setIsBpl(res.data.isBpl)
                        setValue("concernedOfficeDetails", departments?.find((obj) => {
                            return obj.id == res.data.departmentKey
                        }) ? departments.find((obj) => {
                            return obj.id == res.data.departmentKey
                        }).department : "-")
                        if (res.data.userDao) {
                            setValue("officerDetails", res.data.userDao.firstNameEn + res.data.userDao.middleNameEn + res.data.userDao.lastNameEn)
                        }
                    })
            } else {
                axios.get(`${urls.RTI}/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${watch("applicationNo")}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                    .then((res) => {
                        setValue("applicantFirstName", res.data?.applicantFirstName)
                        setValue("applicantMiddleName", res.data?.applicantMiddleName)
                        setValue("applicantLastName", res.data?.applicantLastName)
                        setValue("address", res.data?.address)
                        setValue("informationDescription", res.data?.description)
                        setValue("concernedOfficeDetails", departments?.find((obj) => {
                            return obj.id == res.data.departmentKey
                        }) ? departments.find((obj) => {
                            return obj.id == res.data.departmentKey
                        }).department : "-")
                        setValue("officerDetails", res.data.userDao.firstNameEn + res.data.userDao.middleNameEn + res.data.userDao.lastNameEn)
                        setIsBpl(res.data.isBpl)
                        setApplicationID(res.data.id)
                    })
            }
        }
    };

    const onSubmitForm = (formData) => {
        const dateOfOrderAgainstAppeal = moment(formData.dateOfOrderAgainstAppeal).format("YYYY-MM-DD");
        const attachmentDetails = getDocumentFromLocalStorage(
            "RTIAppealRelatedDocuments"
        )
            ? getDocumentFromLocalStorage("RTIAppealRelatedDocuments")
            : "";
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
            applicationKey: applicationId,
            isBpl: isBpl,
            dateOfOrderAgainstAppeal,
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
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`, body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    if (res.status == 201) {
                        afterSaveShowAlert(res)
                    }
                    else {
                        sweetAlert(language == "en" ? "Error!" : "त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`, body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        afterSaveShowAlert(res)
                    }
                    else {
                        sweetAlert(language == "en" ? "Error!" : "त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
                    }
                });
        }
    };
    // manage save in one method
    const afterSaveShowAlert = (res) => {
        if (isBpl) {
            sweetAlert({
                title: language == "en" ? "Saved!" : "जतन केले!",
                text: language == "en" ? "RTI Appeal Saved successfully !" : "आरटीआय अपील यशस्वीरित्या जतन झाले!",
                icon: "success",
                dangerMode: false,
                closeOnClickOutside: false,
            }).then((will) => {
                if (will) {
                    sweetAlert({
                        text: language == "en" ? ` Your Appeal No Is : ${res.data.message.split('[')[1].split(']')[0]}` : ` आपले अपील क्र : ${res.data.message.split('[')[1].split(']')[0]}`,
                        icon: "success",
                        buttons: [language == "en" ? "View Acknowledgement" : "पावती पहा", language == "en" ? "Go To Appeal List" : "अपील सूचीवर जा"],
                        dangerMode: false,
                        closeOnClickOutside: false,
                    }).then((will) => {
                        if (will) {
                            {
                                router.push('/RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList')
                            }
                            removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                        } else {
                            router.push({
                                pathname:
                                    "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                                query: { id: res.data.message.split('[')[1].split(']')[0] },
                            })
                            removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
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

    // get application details by application no
    const getApplicationDetails = (applicationNo) => {
        if (logedInUser === "citizenUser") {
            axios
                .get(
                    `${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${applicationNo}`, {
                    headers: {
                        UserId: user.id
                    }
                })
                .then((res) => {
                    setApplicationDetails(res.data)
                })
        } else {
            axios
                .get(
                    `${urls.RTI}/trnRtiAppeal/searchByApplicationNumber?applicationNumber=${applicationNo
                    }`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })
                .then((res) => {
                    setApplicationDetails(res.data)
                })
        }
    }

    // cancel button
    const cancellButton = () => {
        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
        router.push({
            pathname: "/RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList",
        })
    };

    const resetValuesCancell = {
        // applicationNo: "",
        // applicantFirstName: "",
        // applicantMiddleName: "",
        // applicantLastName: "",
        // address: "",
        // officerDetails: "",
        // dateOfOrderAgainstAppeal: null,
        // informationDescription: "",
        // informationSubjectDesc: "",
        // concernedOfficeDetails: "",
        // informationPurpose: "",
        appealReason: "",
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
                        // marginLeft: "10px",
                        // marginRight: "10px",
                        // marginBottom: "20px",
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
                        <h2> <FormattedLabel id="rtiAppeal" /></h2>
                    </Box>

                    <Divider />
                    <Box>
                        <Box >
                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                <Grid
                                    container
                                    spacing={2}
                                    style={{
                                        padding: "10px",
                                        display: "flex",
                                        alignItems: "baseline",
                                    }}
                                >
                                        {/* <Grid
                                            container > */}
                                        <Grid item
                                            xl={10}
                                            lg={10}
                                            md={10}
                                            sm={12}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}  >
                                            <TextField
                                                autoFocus
                                                sx={{ width: "80%" }}
                                                id="standard-basic"
                                                label={<FormattedLabel id="applicationNo" />}
                                                variant="standard"
                                                {...register("applicationNo")}
                                                error={!!errors.applicationNo}
                                                helperText={
                                                    errors?.applicationNo
                                                        ? errors.applicationNo.message
                                                        : null
                                                }
                                            />
                                            </Grid>
                                            <Grid item
                                                xl={2}
                                                lg={2}
                                                md={2}
                                                sm={12}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}  
                                               >
                                                <Button
                                                     sx={{ marginTop: 2,marginLeft:"-10px" }}
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<SearchIcon />}
                                                    onClick={() => searchApplication()}
                                                >
                                                    <FormattedLabel id="search" />
                                                </Button>
                                            </Grid>
                                        {/* </Grid> */}
                                        {/* </Grid> */}
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                sx={{ minWidth: "260px", marginTop: 5 }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-basic"
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

                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                sx={{ minWidth: "260px", marginTop: 5 }}
                                                id="standard-basic"
                                                label={<FormattedLabel id="applicantMiddleName" />}
                                                multiline
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                variant="standard"
                                                {...register("applicantMiddleName")}
                                                error={!!errors.applicantMiddleName}
                                                helperText={
                                                    errors?.applicantMiddleName ? errors.applicantMiddleName.message : null
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
                                                sx={{ minWidth: "260px  ", marginTop: 5 }}
                                                id="standard-basic"
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
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
                                                sx={{ width: "89%" }}
                                                id="standard-basic"
                                                label={<FormattedLabel id="address" />}
                                                multiline
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
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
                                                sx={{ width: "89%" }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="descriptionOfInfo" />}
                                                multiline
                                                variant="standard"
                                                {...register("informationDescription")}
                                                error={!!errors.informationDescription}
                                                helperText={
                                                    errors?.informationDescription ? errors.informationDescription.message : null
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
                                                sx={{ width: "89%", marginTop: 1 }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="concernOfficerDeptnmWhoseInfoRequired" required />}
                                                multiline
                                                variant="standard"
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                {...register("concernedOfficeDetails")}
                                                error={!!errors.concernedOfficeDetails}
                                                helperText={
                                                    errors?.concernedOfficeDetails ? errors.concernedOfficeDetails.message : null
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
                                                sx={{ width: "89%", marginTop: 1 }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="reasonForAppeal" required />}
                                                multiline
                                                variant="standard"
                                                {...register("appealReason")}
                                                error={!!errors.appealReason}
                                                helperText={
                                                    errors?.appealReason ? errors.appealReason.message : null
                                                }
                                            />
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box sx={{ width: "88%", marginTop: 5 }}>
                                                <RTIAppealDocument />
                                            </Box>
                                        </Grid>

                                        <Grid
                                            container
                                            // spacing={5}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginBottom:"40px"
                                            }}>

                                            <Grid item>
                                                {!isBpl && <Button
                                                    sx={{ margin: 1 }}
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<SaveIcon />}
                                                >
                                                    <FormattedLabel id="saveAndPay" />
                                                </Button>}
                                                {isBpl && (<Button
                                                     sx={{ margin: 1 }}
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<SaveIcon />}
                                                >
                                                    <FormattedLabel id="save" />
                                                </Button>)}
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    sx={{ margin: 1 }}
                                                    variant="contained"
                                                    color="primary"
                                                    // endIcon={<ClearIcon />}
                                                    onClick={() => cancellButton()}
                                                >
                                                    <FormattedLabel id="back" />
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
                                        </>
                                    </Box>
                                </Box>
                            </Modal>
                        </Box>
                    </Box>
                </Paper>
            </ThemeProvider>
        </>
    );
};

export default EntryForm;