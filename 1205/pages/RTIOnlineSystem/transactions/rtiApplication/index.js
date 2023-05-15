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
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import trnRtiApplicationSchema from "../../../../containers/schema/rtiOnlineSystemSchema/trnRtiApplicationSchema.js";
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



    const language = useSelector((state) => state.labels.language);
    const [areaId, setAreaId] = useState([]);
    const [zoneDetails, setZoneDetails] = useState();
    const [departments, setDepartments] = useState([]);
    const router = useRouter();
    const inputState = getValues("inputState");
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

    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")
    );

    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

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

    useEffect(() => {
        getZone()
        getGenders()
        getWards()
        getDepartments()
    }, []);


    // set zone and ward dependant after area key found
    useEffect(() => {
        if (watch("areaKey")) {
            let filteredArrayZone = areaId?.filter((obj) => obj?.areaId === watch("areaKey"));
            let flArray1 = zoneDetails?.filter((obj) => {
                return filteredArrayZone?.some((item) => {
                    return item?.zoneId === obj?.id;
                });
            });
            let flArray2 = wards?.filter((obj) => {
                return filteredArrayZone?.some((item) => {
                    return item?.wardId === obj?.id;
                });
            });
            setValue("zoneKey", flArray1[0]?.id);
            setValue("wardKey", flArray2[0]?.id);
        } else {
            setValue("zoneKey", "");
            setValue("wardKey", "");
        }
    });

    useEffect(() => {
        getApplicationDetails()
    }, ['applicationNo']);

    useEffect(() => {
        if (watch("areaKey")) {
            getAreas();
        }
    }, [watch("areaKey")]);

    useEffect(() => {
        setCitizenData()
    }, [userCitizen && language])

    useEffect(() => {
        getSubDepartmentDetails()
    }, [watch("departmentKey")])

    useEffect(() => {
    }, [watch("isApplicantBelowToPovertyLine")]);

    // get areas
    const getAreas = () => {
        axios
            .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAreaName?moduleId=9&areaName=${watch("areaName")}`)
            .then((res) => {
                if (res?.status === 200 || res?.status === 201) {
                    if (res?.data.length !== 0) {
                        setAreaId(
                            res?.data?.map((r, i) => ({
                                id: r.id,
                                srNo: i + 1,
                                areaId: r.areaId,
                                zoneId: r.zoneId,
                                wardId: r.wardId,
                                zoneName: r.zoneName,
                                zoneNameMr: r.zoneNameMr,
                                wardName: r.wardName,
                                wardNameMr: r.wardNameMr,
                                areaName: r.areaName,
                                areaNameMr: r.areaNameMr,
                            })),
                        );
                        setValue("areaName", "");
                    } else {
                        sweetAlert({
                            title: language == "en" ? "OOPS!" : "अरेरे",
                            text: language == "en" ? "There are no areas match with your search!" : "तुमच्या शोधाशी जुळणारे कोणतेही क्षेत्र नाहीत",
                            icon: "warning",
                            dangerMode: true,
                            closeOnClickOutside: false,
                        });
                    }
                } else {
                    sweetAlert({
                        title: language == "en" ? "OOPS!" : "अरेरे",
                        text: language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
                        icon: "error",
                        dangerMode: true,
                        closeOnClickOutside: false,
                    });
                }
            })
            .catch((error1) => {
                sweetAlert({
                    title: language == "en" ? "OOPS!" : "अरेरे",
                    text: `${error1}`,
                    icon: "error",
                    dangerMode: true,
                    closeOnClickOutside: false,
                });
            });
    };

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

    // get application details
    const getApplicationDetails = (applicationNo) => {
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
                    setApplicationDetails(res.data)
                })
        } else {
            axios
                .get(
                    `${urls.RTI}/trnRtiApplication/searchByApplicationNumber?applicationNumber=${applicationNo
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

    //payment status change
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
                        setIsModalOpenForResolved(false)
                        sweetAlert({
                            title: language == "en" ? "Saved!" : "जतन केले",
                            text: language == "en" ? "RTI Application Saved successfully !" : "RTI अर्ज यशस्वीरित्या जतन झाला!",
                            icon: "success",
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {

                            if (will) {
                                sweetAlert({
                                    text: language == "en" ? ` Your Application No Is : ${res.data.message.split('[')[1].split(']')[0]}` : `तुमचा अर्ज क्र : ${res.data.message.split('[')[1].split(']')[0]}`,
                                    icon: "success",
                                    buttons: [language == "en" ? "View Acknowledgement" : "पावती पहा", language == "en" ? "Go To Application List" : "अर्ज सूचीवर जा"],
                                    dangerMode: false,
                                    closeOnClickOutside: false,
                                }).then((will) => {
                                    if (will) {
                                        {
                                            router.push('/RTIOnlineSystem/transactions/rtiApplication/rtiApplicationList')
                                        }
                                        removeDocumentToLocalStorage("RTIRelatedDocuments")

                                    } else {
                                        router.push({
                                            pathname:
                                                "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
                                            query: { id: res.data.message.split('[')[1].split(']')[0] },
                                        })
                                        removeDocumentToLocalStorage("RTIRelatedDocuments")
                                    }
                                })
                            }
                        })
                    }
                    else {
                        sweetAlert(language == "en" ? "Error!" : "त्रुटी!", language == "en" ? "Something Went Wrong !" : "काहीतरी चूक झाली !", "error");
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
                        sweetAlert({
                            title: language == "en" ? "Saved!" : "जतन केले",
                            text: language == "en" ? "RTI Application Saved successfully !" : "RTI अर्ज यशस्वीरित्या जतन झाला!",
                            icon: "success",
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {
                            if (will) {
                                sweetAlert({
                                    // title: "Great!",
                                    text: language == "en" ? ` Your Application No Is : ${res.data.message.split('[')[1].split(']')[0]}` : ` तुमचा अर्ज क्र: ${res.data.message.split('[')[1].split(']')[0]}`,
                                    icon: "success",
                                    buttons: [language == "en" ? "View Acknowledgement" : "पावती पहा", language == "en" ? "Go To Application List" : "अर्ज सूचीवर जा"],
                                    dangerMode: false,
                                    closeOnClickOutside: false,
                                }).then((will) => {
                                    if (will) {
                                        {
                                            router.push('/RTIOnlineSystem/transactions/rtiApplication/rtiApplicationList')
                                        }
                                        removeDocumentToLocalStorage("RTIRelatedDocuments")

                                    } else {
                                        router.push({
                                            pathname:
                                                "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication?id",
                                            query: { id: res.data.message.split('[')[1].split(']')[0] },
                                        })
                                        removeDocumentToLocalStorage("RTIRelatedDocuments")

                                    }
                                })
                            }
                        })
                    }
                    else {
                        sweetAlert(language == "en" ? "Error!" : "त्रुटी!", language == "en" ? "Something Went Wrong !" : "काहीतरी चूक झाली !", "error");
                    }
                });
        }
    }

    // citizen user data fetch on Ui
    const setCitizenData = () => {
        if (logedInUser === "citizenUser") {
            setValue("applicantFirstName", language == "en" ? userCitizen?.firstName : userCitizen?.firstNamemr)
            setValue("applicantMiddleName", language == "en" ? userCitizen?.middleName : userCitizen?.middleNamemr)
            setValue("applicantLastName", language == "en" ? userCitizen?.surname : userCitizen?.surnamemr)
            setValue("emailId", userCitizen?.emailID)
            setValue("pinCode", userCitizen?.ppincode)
            setValue("contactDetails", userCitizen?.mobile)
            setValue("gender", userCitizen?.gender)
        }
    }

    // Cfc user data fetch on ui
    useEffect(() => {
        if (logedInUser === "cfcUser") {
            setValue("applicantFirstName", language == "en" ? userCFC?.firstNameEn : userCFC?.firstNamemr)
            setValue("applicantMiddleName", language == "en" ? userCFC?.middleNameEn : userCFC?.middleNameMr)
            setValue("applicantLastName", language == "en" ? userCFC?.lastNameEn : userCFC?.lastNameMr)
            setValue("emailId", userCFC?.email)
        }
    }, [userCFC && language])

    // get zone
    const getZone = () => {
        axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
            setZoneDetails(
                res.data.zone.map((r, i) => ({
                    id: r.id,
                    srNo: i + 1,
                    zoneName: r.zoneName,
                    zoneNameMr: r.zoneNameMr,
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

    // get sub department by dept id
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
                            subDepartmentMr: r.subDepartmentMr
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
                    departmentMr: row.departmentMr
                }))
            );
        });
    };

    // get wards
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

    // on submit Rti application
    const onSubmitForm = (formData) => {
        const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
        const toDate = moment(formData.toDate).format("YYYY-MM-DD");
        const isBpl = formData.isApplicantBelowToPovertyLine
        const bplCardIssueYear = formData.yearOfIssues
        const bplCardIssuingAuthority = formData.issuingAuthority
        const selectedReturnMedia = formData.selectedReturnMedia
        const attachmentDetails = getDocumentFromLocalStorage(
            "RTIRelatedDocuments"
        )
            ? getDocumentFromLocalStorage("RTIRelatedDocuments")
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
            fromDate,
            toDate,
            isBpl,
            bplCardIssueYear,
            bplCardIssuingAuthority,
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
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`, body, {
                    headers: {
                        UserId: user.id
                    },
                },)
                .then((res) => {
                    console.log("res", isBpl);
                    var a = res.data.message;
                    if (res.status == 201) {
                        setAlertAfterSubmitApplication(res, isBpl)
                    }
                    else {
                        sweetAlert(language == "en" ? "Error!" : "त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
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
                    if (res.status == 201) {
                        setAlertAfterSubmitApplication(res, isBpl)
                    }
                    else {
                        sweetAlert(language == "en" ? "Error!" : "त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
                    }
                });
        }
    };


    const setAlertAfterSubmitApplication = (res, isBpl) => {
        if (isBpl === "true") {
            sweetAlert({
                title: language == "en" ? "Saved!" : "जतन केले",
                text: language == "en" ? "RTI Application Saved successfully !" : "RTI अर्ज यशस्वीरित्या जतन झाला!",
                icon: "success",
                dangerMode: false,
                closeOnClickOutside: false,
            }).then((will) => {
                if (will) {
                    sweetAlert({
                        text: language == "en" ? ` Your Application No Is : ${res.data.message.split('[')[1].split(']')[0]}` : `तुमचा अर्ज क्र : ${res.data.message.split('[')[1].split(']')[0]}`,
                        icon: "success",
                        buttons: [language == "en" ? "View Acknowledgement" : "पावती पहा", language == "en" ? "Go To Application List" : "अर्ज सूचीवर जा"],
                        dangerMode: false,
                        closeOnClickOutside: false,
                    }).then((will) => {
                        if (will) {
                            {
                                router.push('/RTIOnlineSystem/transactions/rtiApplication/rtiApplicationList')
                            }
                            removeDocumentToLocalStorage("RTIRelatedDocuments")

                        } else {
                            router.push({
                                pathname:
                                    "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
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

    const cancellButton = () => {
        removeDocumentToLocalStorage("RTIRelatedDocuments")
        router.push({
            pathname: "/RTIOnlineSystem/transactions/rtiApplication/rtiApplicationList",
        })
    };

    const resetValuesCancell = {
        fromDate: null,
        toDate: null,
        address: "",
        education: "",
        wardKey: "",
        zoneKey: "",
        departmentKey: "",
        subDepartmentKey: "",
        isApplicantBelowToPovertyLine: '',
        bplCardNo: "",
        yearOfIssues: "",
        issuingAuthority: "",
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
                        // marginLeft: "5px",
                        // marginRight: "5px",
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
                            // marginLeft: 5,
                            // marginRight: 5,
                            // padding: 1,
                        }}>
                        <Box>
                            {/* <FormProvider {...methods}> */}
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
                                    {/* applicant first name */}
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
                                            // sx={{ minWidth: "230px" }}
                                            disabled={logedInUser === "citizenUser" ? true : false}
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

                                    {/*applicant middle name */}
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
                                            // sx={{ minWidth: "230px" }}
                                            disabled={logedInUser === "citizenUser" ? true : false}
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

                                    {/* applicant last name */}
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
                                            // sx={{ minWidth: "230px" }}
                                            disabled={logedInUser === "citizenUser" ? true : false}
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

                                    {/* gender */}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <FormControl
                                            // sx={{ minWidth: "230px", }}
                                            variant="standard"
                                            error={!!errors.gender}
                                            disabled={logedInUser === "citizenUser" ? true : false}
                                        >
                                            <InputLabel
                                                id="demo-simple-select-standard-label"
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
                                                                        language == "en" ? value?.gender : value?.genderMr
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
                                                {errors?.gender ? errors.gender.message : null}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>

                                    {/* pincode */}
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
                                            // sx={{ minWidth: "230px" }}
                                            id="standard-textarea"
                                            disabled={logedInUser === "citizenUser" ? true : false}
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

                                    {/* contact details */}
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
                                            // sx={{ minWidth: "230px" }}
                                            id="standard-textarea"
                                            type="number"
                                            disabled={logedInUser === "citizenUser" ? true : false}
                                            label={<FormattedLabel id="contactDetails" />}
                                            variant="standard"
                                            {...register("contactDetails")}
                                            error={!!errors.contactDetails}
                                            helperText={
                                                errors?.contactDetails ? errors.contactDetails.message : null
                                            }
                                        />
                                    </Grid>

                                    {/* address */}
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
                                            sx={{ minWidth: "88%" }}
                                            multiline
                                            minRows={1}
                                            maxRows={6}
                                            label={<FormattedLabel id="address" required />}
                                            variant="standard"
                                            {...register("address")}
                                            error={!!errors.address}
                                            helperText={
                                                errors?.address ? errors.address.message : null
                                            }
                                        />
                                    </Grid>


                                    {/*email id  */}
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

                                            // sx={{ minWidth: "230px" }}
                                            variant="standard"
                                            {...register("emailId")}
                                            error={!!errors.emailId}
                                            helperText={
                                                errors?.emailId ? errors.emailId.message : null
                                            }
                                        />
                                    </Grid>

                                    {/* education */}
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
                                                // sx={{ minWidth: "230px", }}
                                                id='demo-row-radio-buttons-group-label'
                                            >
                                                {<FormattedLabel id='education' required />}
                                            </FormLabel>

                                            <Controller
                                                name='education'
                                                control={control}
                                                defaultValue=''
                                                {...register("education")}
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
                                                            value='Literate'
                                                            {...register("education")}
                                                            disabled={inputState}
                                                            control={<Radio size='small' />}
                                                            label={<FormattedLabel id='literate' />}
                                                            error={!!errors.education}
                                                            helperText={
                                                                errors?.education ? errors.education.message : null
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            value='Illiterate'
                                                            {...register("education")}
                                                            disabled={inputState}
                                                            control={<Radio size='small' />}
                                                            label={<FormattedLabel id='illiterate' />}
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

                                    {/* Button Row */}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        sx={{
                                            border: 1,
                                            borderColor: "grey.500",
                                            // marginLeft: "45px",
                                            // marginRight: "45px",
                                            padding: 1,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Grid
                                            container
                                            spacing={2}
                                            style={{
                                                padding: "10px",
                                                display: "flex",
                                                alignItems: "baseline",
                                            }}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                md={12}
                                                lg={12}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "baseline",
                                                    gap: 15,
                                                }}
                                            >
                                                {areaId.length === 0 ? (
                                                    <>
                                                        <TextField
                                                            style={{
                                                                backgroundColor: "white",
                                                                width: "300px",
                                                            }}
                                                            id="outlined-basic"
                                                            label={language === "en" ? "Search By Area Name" : "क्षेत्राच्या नावाने शोधा"}
                                                            placeholder={
                                                                language === "en"
                                                                    ? "Enter Area Name, Like 'Dehu'"
                                                                    : "'देहू' प्रमाणे क्षेत्राचे नाव प्रविष्ट करा"
                                                            }
                                                            variant="standard"
                                                            {...register("areaName")}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => {
                                                                if (watch("areaName")) {
                                                                    getAreas();
                                                                } else {
                                                                    sweetAlert({
                                                                        title: "OOPS!",
                                                                        text: "Please Enter The Area Name first",
                                                                        icon: "warning",
                                                                        dangerMode: true,
                                                                        closeOnClickOutside: false,
                                                                    });
                                                                }
                                                            }}
                                                            size="small"
                                                            style={{ backgroundColor: "green", color: "white" }}
                                                        >
                                                            <FormattedLabel id="getDetails" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FormControl style={{ minWidth: "150px",gap:15 }} error={!!errors.areaKey}>
                                                            <InputLabel id="demo-simple-select-standard-label">
                                                                <FormattedLabel id="results" />
                                                            </InputLabel>
                                                            <Controller
                                                                render={({ field }) => (
                                                                    <Select
                                                                        style={{ backgroundColor: "inherit" }}
                                                                        fullWidth
                                                                        variant="standard"
                                                                        value={field.value}
                                                                        onChange={(value) => {
                                                                            field.onChange(value);
                                                                        }}
                                                                        label="Complaint Type"
                                                                    >
                                                                        {areaId &&
                                                                            areaId?.map((areaId, index) => (
                                                                                <MenuItem key={index} value={areaId.areaId}>
                                                                                    {language == "en" ? areaId?.areaName : areaId?.areaNameMr}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                )}
                                                                name="areaKey"
                                                                control={control}
                                                                defaultValue=""
                                                            />
                                                            <FormHelperText>{errors?.areaKey ? errors.areaKey.message : null}</FormHelperText>
                                                        </FormControl>

                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => {
                                                                setAreaId([]);
                                                                setValue("areaKey", "");
                                                            }}
                                                            size="small"
                                                        >
                                                            <FormattedLabel id="searchArea" />
                                                        </Button>
                                                    </>
                                                )}
                                            </Grid>

                                            <Grid
                                                item
                                                lg={2}
                                                md={2}
                                                sx={{
                                                    display: "flex",
                                                    // justifyContent: "center",
                                                    alignItems: "center",
                                                 }}
                                            ></Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={5}
                                                md={5}
                                                lg={5}
                                                sx={{
                                                    display: "flex",
                                                    // justifyContent: "center",
                                                    alignItems: "center",
                                                 }}
                                            >
                                                <FormControl style={{ minWidth: "300px" }} error={!!errors.zoneKey}>
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        <FormattedLabel id="zoneKey" />
                                                    </InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                fullWidth
                                                                disabled
                                                                variant="standard"
                                                                value={field.value}
                                                                onChange={(value) => {
                                                                    field.onChange(value);
                                                                }}
                                                                label="Complaint Type"
                                                            >
                                                                {zoneDetails &&
                                                                    zoneDetails?.map((zoneDetails, index) => (
                                                                        <MenuItem key={index} value={zoneDetails.id}>
                                                                            {language == "en"
                                                                                ? //@ts-ignore
                                                                                zoneDetails?.zoneName
                                                                                : // @ts-ignore
                                                                                zoneDetails?.zoneNameMr}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        )}
                                                        name="zoneKey"
                                                        control={control}
                                                        defaultValue=""
                                                    />
                                                    <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
                                                </FormControl>
                                            </Grid>

                                            <Grid
                                                item
                                                xs={8}
                                                sm={5}
                                                md={5}
                                                lg={5}
                                                style={{
                                                    display: "flex",
                                                    // justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                // xs={{
                                                //     justifyContent: "center",
                                                // }}
                                            >
                                                <FormControl style={{ minWidth: "300px" }} error={!!errors.wardKey}>
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        <FormattedLabel id="wardKey" />
                                                    </InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                disabled
                                                                fullWidth
                                                                variant="standard"
                                                                value={field.value}
                                                                onChange={(value) => {
                                                                    field.onChange(value);
                                                                }}
                                                                label="Complaint Type"
                                                            >
                                                                {wards &&
                                                                    wards?.map((wards, index) => (
                                                                        <MenuItem key={index} value={wards.id}>
                                                                            {language == "en"
                                                                                ? //@ts-ignore
                                                                                wards?.wardName
                                                                                : // @ts-ignore
                                                                                wards?.wardNameMr}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        )}
                                                        name="wardKey"
                                                        control={control}
                                                        defaultValue=""
                                                    />
                                                    <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
                                                </FormControl>
                                            </Grid>

                                            <Grid
                                                item
                                                lg={2}
                                                md={2}
                                                sx={{
                                                    display: "flex",
                                                    // justifyContent: "center",
                                                    alignItems: "center",
                                                 }}
                                            ></Grid>
                                        </Grid>
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
                                                sx={{ width: 230, marginTop: "2%" }}
                                                variant="standard"
                                                error={!!errors.zoneKey}
                                            >
                                                <InputLabel
                                                    id="demo-simple-select-standard-label"
                                                // disabled={isDisabled}
                                                >
                                                    <FormattedLabel id="zoneKey" required/>
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
                                                                          language == "en" ? value?.zoneName:value?.zoneNameMr
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
                                                    <FormattedLabel id="wardKey" required/>
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
                                                                            language == "en" ? value?.wardName:value.wardNameMr
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
                                        </Grid> */}

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
                                                <FormattedLabel id="departmentKey" required />
                                            </InputLabel>
                                            <Controller
                                                render={({ field }) => (
                                                    <Select
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
                                                                    {language == "en" ? department.department : department.departmentMr}
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
                                                <FormattedLabel id="subDepartmentKey" required />
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
                                                                    {language == "en" ? subDepartment.subDepartment : subDepartment.subDepartmentMr}
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
                                                id='demo-row-radio-buttons-group-label'
                                            >
                                                {<FormattedLabel id='isApplicantBelowToPovertyLine' required />}
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
                                                            label=
                                                            {
                                                                <span style={{ fontSize: 14 }}>
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
                                                                            // marginTop: 3,
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
                                                                <span style={{ fontSize: 14 }}>
                                                                    {<FormattedLabel id="toDate" />}
                                                                </span>
                                                            }
                                                            minDate={watch("fromDate")}
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
                                            justifyContent: "left",
                                            alignItems: "left",
                                        }}
                                    >
                                        <FormControl
                                            sx={{ marginLeft: "42px", }}
                                        >
                                            <FormLabel
                                                id='demo-row-radio-buttons-group-label'
                                            >
                                                {<FormattedLabel id='requiredInfoDeliveryDetails' required />}
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
                                                            value='byHand'
                                                            // sx={{ width: 100,  marginLeft:7}}
                                                            {...register("selectedReturnMedia")}
                                                            disabled={inputState}
                                                            control={<Radio size='small' />}
                                                            label={<FormattedLabel id='byHand' />}
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
                                            sx={{ minWidth: "88%" }}
                                            id="standard-textarea"
                                            label={<FormattedLabel id="description" required />}
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
                                        <Box sx={{ width: "88%" }}>
                                            <RTIDocument />
                                        </Box>
                                    </Grid>

                                    <Grid
                                        container
                                        // spacing={5}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {watch("isApplicantBelowToPovertyLine") == "false" && <><Grid >
                                            <Button
                                                sx={{ margin: 1 }}
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                endIcon={<SaveIcon />}
                                            >
                                                <FormattedLabel id="saveAndPay" />
                                            </Button>
                                        </Grid></>}
                                        {watch("isApplicantBelowToPovertyLine") == "true" && <><Grid  >
                                            <Button
                                                sx={{ margin: 1 }}
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
                            {/* </FormProvider> */}
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