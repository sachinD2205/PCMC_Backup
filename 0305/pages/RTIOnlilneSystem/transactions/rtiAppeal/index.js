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
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [btnSaveText, setBtnSaveText] = useState("Save");


    const router = useRouter();
    const [slideChecked, setSlideChecked] = useState(false);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [buttonInputState, setButtonInputState] = useState();
    const [meterConnectionDate, setMeterConnectionDate] = useState()
    const dispatch = useDispatch();
    const [applicationId, setApplicationID] = useState(null)
    const [isBpl, setIsBpl] = useState(null)
    const inputState = getValues("inputState");
    const entryConnectionData = useSelector((state) => state.user.entryConnectionData);
    const [wards, setWards] = useState([]);
    const [applicationNO, setApplicationNO] = useState(null)
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false)
    const [applicationDetails, setApplicationDetails] = useState([])
    const [applicationNo, setApplicationNumberDetails] = useState([])
    const [departments, setDepartments] = useState([]);

    console.log("connection Entry", entryConnectionData)

    let user = useSelector((state) => state.user.user)

    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")

    );
    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    console.log("authority", authority);

    const userCitizen = useSelector((state) => {
        console.log("userDetails", state?.user?.user?.userDao?.id)
        return state?.user?.user?.id
    })

    const userCFC = useSelector((state) => {
        console.log("userDetails", state?.user?.user?.userDao?.id)
        return state?.user?.user?.id
    })
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
                    console.log("res", res);
                    if (res.status == 201) {
                        setIsModalOpenForResolved(false)
                        sweetAlert({
                            title: "Saved!",
                            text: "RTI Appeal Saved successfully !",
                            icon: "success",
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {

                            if (will) {
                                sweetAlert({
                                    // title: "Great!",
                                    text: ` Your Appeal No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                    icon: "success",
                                    buttons: ["View Acknowledgement", "Go To Appeal List"],
                                    dangerMode: false,
                                    closeOnClickOutside: false,
                                }).then((will) => {
                                    if (will) {
                                        {
                                            router.push('/RTIOnlilneSystem/transactions/rtiAppeal/rtiAppealList')
                                        }
                                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                    } else {
                                        router.push({
                                            pathname:
                                                "/RTIOnlilneSystem/transactions/acknowledgement/rtiAppeal",
                                            query: { id: res.data.message.split('[')[1].split(']')[0] },
                                        })
                                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

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
                            title: "Saved!",
                            text: "RTI Appeal Saved successfully !",
                            icon: "success",
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {
                            if (will) {
                                sweetAlert({
                                    // title: "Great!",
                                    text: ` Your Appeal No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                    icon: "success",
                                    buttons: ["View Acknowledgement", "Go To Appeal List"],
                                    dangerMode: false,
                                    closeOnClickOutside: false,
                                }).then((will) => {
                                    if (will) {
                                        {
                                            router.push('/RTIOnlilneSystem/transactions/rtiAppeal/rtiAppealList')
                                        }
                                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                    } else {
                                        router.push({
                                            pathname:
                                                "/RTIOnlilneSystem/transactions/acknowledgement/rtiAppeal",
                                            query: { id: res.data.message.split('[')[1].split(']')[0] },
                                        })
                                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

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


    useEffect(() => {
        // if (watch("departmentName")) {
        // }

    }, [watch("applicationNo")])

    // get departments
    const searchApplication = () => {
        console.log("departments ",departments)
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
                      if(res.data.userDao){
                        setValue("officerDetails" , res.data.userDao.firstNameEn +  res.data.userDao.middleNameEn +  res.data.userDao.lastNameEn)

                      }
                      
                        // alert(isBpl)
                    })
            } else {
                axios.get(`${urls.RTI}/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${watch("applicationNo")}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                )
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
                        console.log("res.data.userDao ",res.data.userDao)
                        setValue("officerDetails" , res.data.userDao.firstNameEn +  res.data.userDao.middleNameEn +  res.data.userDao.lastNameEn)
                        setIsBpl(res.data.isBpl)
                        // alert(isBpl)
                        setApplicationID(res.data.id)
                    })
            }
        }
    };


    const onSubmitForm = (formData) => {
        console.log("formData ", formData);
        const dateOfOrderAgainstAppeal = moment(formData.dateOfOrderAgainstAppeal).format("YYYY-MM-DD");

        const attachmentDetails = getDocumentFromLocalStorage(
            "RTIAppealRelatedDocuments"
        )
            ? getDocumentFromLocalStorage("RTIAppealRelatedDocuments")
            : "";
        console.log(getDocumentFromLocalStorage(
            "RTIAppealRelatedDocuments"
        ));

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
        let temp = {};
        console.log("body", body);
        if (logedInUser === "citizenUser") {

            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`, body, {
                    headers: {
                        // Authorization: `Bearer ${user.token}`,
                        UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {

                        if (isBpl) {
                            // sweetAlert("Saved!", "Record Saved successfully !", "success");
                            // router.push('/RTIOnlilneSystem/transactions/rtiAppeal/rtiAppealList')
                            // removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                            sweetAlert({
                                title: "Saved!",
                                text: "RTI Appeal Saved successfully !",
                                icon: "success",
                                dangerMode: false,
                                closeOnClickOutside: false,
                            }).then((will) => {
                                if (will) {
                                    sweetAlert({
                                        // title: "Great!",
                                        text: ` Your Appeal Appeal No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                        icon: "success",
                                        buttons: ["View Acknowledgement", "Go To Appeal List"],
                                        dangerMode: false,
                                        closeOnClickOutside: false,
                                    }).then((will) => {
                                        if (will) {
                                            {
                                                router.push('/RTIOnlilneSystem/transactions/rtiAppeal/rtiAppealList')
                                            }
                                            removeDocumentToLocalStorage("RTIAppealRelatedDocuments")

                                        } else {
                                            router.push({
                                                pathname:
                                                    "/RTIOnlilneSystem/transactions/acknowledgement/rtiAppeal",
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
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`, body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        // UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        sweetAlert("Saved!", "Record Saved successfully !", "success");

                        router.push('/RTIOnlilneSystem/transactions/rtiAppeal/rtiAppealList')
                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    };


    const getApplicationDetails = (applicationNo) => {
        // if (watch("applicationNo")) {
        if (logedInUser === "citizenUser") {
            axios
                .get(
                    `${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${applicationNo
                    }`
                    , {
                        headers: {
                            UserId: user.id
                        }
                    })
                .then((res) => {
                    console.log("Appeal ID" + res.data?.id)
                    setApplicationDetails(res.data)
                })
        } else {
            axios
                .get(
                    `${urls.RTI}/trnRtiAppeal/searchByApplicationNumber?applicationNumber=${applicationNo
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

    const cancellButton = () => {
        reset({
            ...resetValuesCancell,
        });
        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
        window.location.reload()
    };

    const resetValuesCancell = {
        applicationNo: "",
        applicantFirstName: "",
        applicantMiddleName: "",
        applicantLastName: "",
        address: "",
        officerDetails: "",
        dateOfOrderAgainstAppeal: null,
        informationDescription: "",
        // informationSubjectDesc: "",
        concernedOfficeDetails: "",
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
                        marginLeft: "10px",
                        marginRight: "10px",
                        // marginTop: "10px",
                        marginBottom: "20px",
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
                                            container
                                            columns={{ xs: 4, sm: 8, md: 12 }}
                                        >
                                            <Grid item
                                                xl={12}
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }} >
                                                <TextField
                                                    autoFocus
                                                    sx={{ width: "73%" }}
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
                                                <Grid item>
                                                    <Button
                                                        sx={{ marginLeft: 5 }}
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<SearchIcon />}
                                                        onClick={() => searchApplication()}
                                                    >
                                                        <FormattedLabel id="search" />
                                                    </Button>
                                                </Grid>
                                            </Grid>
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
                                                sx={{ minWidth: "230px", marginTop: 5 }}
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
                                                sx={{ minWidth: "230px", marginTop: 5 }}

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
                                                sx={{ minWidth: "230px", marginTop: 5 }}
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

                                        {/* <Grid
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
                                                style={{ backgroundColor: "white", minWidth: "230px" }}
                                                // sx={{ marginTop: 2 }}
                                                error={!!errors.dateOfOrderAgainstAppeal}
                                            >
                                                <Controller
                                                    control={control}
                                                    name="dateOfOrderAgainstAppeal"
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                inputFormat="DD/MM/YYYY"
                                                                label={
                                                                    <span style={{ fontSize: 16 }}>
                                                                        {<FormattedLabel id="dateOfOfficialorderAgainstAppeal" />}
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
                                                    {errors?.dateOfOrderAgainstAppeal ? errors.dateOfOrderAgainstAppeal.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid> */}

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
                                                id="standard-textarea"
                                                label={<FormattedLabel id="descInfoOfOfficer" required />}
                                                multiline
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                variant="standard"
                                                {...register("officerDetails")}
                                                error={!!errors.officerDetails}
                                                helperText={
                                                    errors?.officerDetails ? errors.officerDetails.message : null
                                                }
                                            />

                                        </Grid>
                                        {/* <Grid
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
                                                label={<FormattedLabel id="reqInfoSubjectAndDesc" />}
                                                multiline
                                                variant="standard"
                                                {...register("informationSubjectDesc")}
                                                error={!!errors.informationSubjectDesc}
                                                helperText={
                                                    errors?.informationSubjectDesc ? errors.informationSubjectDesc.message : null
                                                }
                                            />
                                        </Grid> */}

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
                                        {/* 
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
                                                label={<FormattedLabel id="requiredInfoPurpose" required/>}
                                                multiline
                                                variant="standard"
                                                {...register("informationPurpose")}
                                                error={!!errors.informationPurpose}
                                                helperText={
                                                    errors?.informationPurpose ? errors.informationPurpose.message : null
                                                }
                                            />
                                        </Grid> */}

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

                                        {/* <Grid item
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
                                                sx={{ minWidth: "230px", marginTop: "2%" }}
                                                variant="standard"
                                                error={!!errors.paymentModeKey}
                                            >
                                                <InputLabel
                                                    id="demo-simple-select-standard-label"
                                                // disabled={isDisabled}
                                                >
                                                    <FormattedLabel id="paymentModeKey" />
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
                                                            {paymentDetails &&
                                                                paymentDetails.map((value, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={
                                                                            value?.id
                                                                        }
                                                                    >
                                                                        {
                                                                            value?.paymentMode
                                                                        }
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="paymentModeKey"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.paymentModeKey ? errors.paymentModeKey.message : null}
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
                                                label={<FormattedLabel id="paymentAmount" />}
                                                id="standard-textarea"
                                                sx={{ minWidth: "230px" }}
                                                variant="standard"
                                                {...register("paymentAmount")}
                                                error={!!errors.paymentAmount}
                                                helperText={
                                                    errors?.paymentAmount ? errors.paymentAmount.message : null
                                                }
                                            />
                                        </Grid> */}




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
                                            spacing={5}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                paddingTop: "10px",
                                                marginTop: "20px",
                                            }}
                                        >


                                            <Grid item>

                                                {!isBpl && <Button
                                                    sx={{ marginRight: 8 }}
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<SaveIcon />}
                                                >
                                                    {/* {? ( */}
                                                    <FormattedLabel id="saveAndPay" />
                                                    {/* ) : (
                                                        <FormattedLabel id="" />
                                                    )} */}
                                                </Button>}
                                                {isBpl && (<Button
                                                    sx={{ marginRight: 8 }}
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
                                                    sx={{ marginRight: 8 }}
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<ClearIcon />}
                                                    onClick={() => cancellButton()}
                                                >
                                                    <FormattedLabel id="clear" />
                                                </Button>
                                            </Grid>
                                            {/* <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<ExitToAppIcon />}
                                                    onClick={() => exitButton()}
                                                >
                                                    <FormattedLabel id="exit" />
                                                </Button>
                                            </Grid> */}
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