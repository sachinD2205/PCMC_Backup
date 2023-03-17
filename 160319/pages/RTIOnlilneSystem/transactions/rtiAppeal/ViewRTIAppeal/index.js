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
    IconButton,
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
import theme from "../../../../../theme";
import CheckIcon from '@mui/icons-material/Check';


import {
    DatePicker,
    LocalizationProvider,
    TimePicker,
} from "@mui/x-date-pickers"
import VisibilityIcon from "@mui/icons-material/Visibility"

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import {
    getDocumentFromLocalStorage,
    removeDocumentToLocalStorage,
} from "../../../../../components/redux/features/RTIOnlineSystem/rtiOnlineSystem"
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { GridToolbar } from "@mui/x-data-grid";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import hearingScheduleSchema from "../../../../../containers/schema/rtiOnlineSystemSchema/hearingScheduleSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../../URLS/urls";
import { useDispatch, useSelector } from "react-redux";
import decisionSchema from "../../../../../containers/schema/rtiOnlineSystemSchema/decisionSchema";

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
        // resolver: yupResolver(trnRtiAppealSchema),
        mode: "onChange",
    });


    const {
        register: register1,
        handleSubmit: handleSubmit2,
        // @ts-ignore
        methods: methods2,
        reset: reset2,
        control: control2,
        setValue: setValue1,
        formState: { errors: error2 },
    } = useForm({
        criteriaMode: 'all',
        resolver: yupResolver(hearingScheduleSchema),
    })


    const {
        register: register2,
        handleSubmit: handleSubmit3,
        // @ts-ignore
        methods: methods3,
        reset: reset3,
        control: control3,
        setValue: setValue2,
        formState: { errors: error3 },
    } = useForm({
        criteriaMode: 'all',
        resolver: yupResolver(decisionSchema),
    })


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
    const [isBplval, setIsBpl] = useState(null)
    const [isLoiGenerated, setLOIGenerated] = useState(false)
    const [chargeTypeVal, setChargeType] = useState(null)
    const [appReceievedDetails, setApplicationReceivedDetails] = useState(null)
    const { fields, append, remove } = useFieldArray({ name: "slotss", control });

    const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false)
    const [selectedCard, setSelectedCard] = useState(false)
    const [genderVal, setGender] = useState(null)
    const [serviceDetails, setServiceDetails] = useState([]);
    const [chargeTypeDetails, setChargeTypeDetails] = useState([])
    const router = useRouter();
    const [slideChecked, setSlideChecked] = useState(false);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [buttonInputState, setButtonInputState] = useState();
    const [meterConnectionDate, setMeterConnectionDate] = useState()
    const dispatch = useDispatch();
    const [appealId, setAppealId] = useState(null)
    const inputState = getValues("inputState");
    const entryConnectionData = useSelector((state) => state.user.entryConnectionData);
    const [wards, setWards] = useState([]);
    const [applicationNO, setApplicationNO] = useState(null)
    const [subDepartments, setSubDepartmentList] = useState([])
    const [isOpenPayment, setIsOpenPayment] = useState(false)
    const [isHearingSchedule, setHearingSchedule] = useState(false)
    const [showDisabled, showDisable] = useState(false)
    const [hearingId, setHearingId] = useState(null)
    const [applicationKey, setApplicationKey] = useState(null)
    const [dataSource, setDataSource] = useState([]);
    const [document, setDocument] = useState()
    const [document1, setDocument1] = useState()

    const [applications, setApplicationDetails] = useState([])
    const [pageSize, setPageSize] = useState();
    const [totalElements, setTotalElements] = useState();
    const [pageNo, setPageNo] = useState();
    const logedInUser = localStorage.getItem("loggedInUser")
    let user = useSelector((state) => state.user.user)
    const [statusVal, setStatusVal] = useState(null)
    const [isDecisionEntry, setDecisionEntry] = useState(false)
    const [hearingDetails, setHearingDetails] = useState([])

    const columnsCitizen=[
        {
            field: "srNo",
            headerName: <FormattedLabel id="srNo" />,
        },
        {
            field: "hearingDate",
            headerName: <FormattedLabel id="scheduleDate" />,
            flex: 1,
            minWidth: 150,
        },
        {
            field: "hearingTime",
            headerName: <FormattedLabel id="scheduleTime" />,
            flex: 1,
            minWidth: 150,
        },
        {
            field: "venue",
            headerName: <FormattedLabel id="venueForHearing" />,
            flex: 1,
            minWidth: 150,
        },
        {
            field: "remarks",
            headerName: <FormattedLabel id="remark" />,
            flex: 1,
            minWidth: 150,
        },
    ]
    const columns = [
        {
            field: "srNo",
            headerName: <FormattedLabel id="srNo" />,
        },
        {
            field: "hearingDate",
            headerName: <FormattedLabel id="scheduleDate" />,
            flex: 1,
            minWidth: 150,
        },
        {
            field: "hearingTime",
            headerName: <FormattedLabel id="scheduleTime" />,
            flex: 1,
            minWidth: 150,
        },
        {
            field: "venue",
            headerName: <FormattedLabel id="venueForHearing" />,
            flex: 1,
            minWidth: 150,
        },
        {
            field: "actions",
            headerName: <FormattedLabel id="actions" />,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton
                            onClick={() => {
                                getHearingById(params.row.id)

                                showDisable(true)
                                setHearingSchedule(true)
                            }}
                        >
                            <VisibilityIcon style={{ color: "#556CD6" }} />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    useEffect(() => {
        getPaymentMode()
        getAppealDetails()
    }, []);


    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")
    );

    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;


    // load hearing by id(clicking view icon)
    const getHearingById = (hearingByid) => {
        if (logedInUser === "citizenUser") {
            axios.get(`${urls.RTI}/trnRtiHearing/getById?id=${hearingByid}`, {
                headers: {
                    UserId: user.id
                },
            }).then((r) => {
                setValue1("venue", r.data.venue)
                setValue1("hearingTime", r.data.hearingTimeV3)
                setValue1("hearingDate", moment(
                    r.data.hearingDate
                ).format("DD-MM-YYYY"))
                setValue1("hearingRemark", r.data.remarks)
                setHearingId(r.data.id)
                setHearingDetails(r.data)
                // setHearingStatus(r.data.status)


            });
        } else {
            axios.get(`${urls.RTI}/trnRtiHearing/getById?id=${hearingByid}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            }).then((r) => {
                console.log("hearing data ", r.data)
                setValue1("venue", r.data.venue)
                setValue1("hearingTime", r.data.hearingTimeV3)
                setValue1("hearingDate", moment(
                    r.data.hearingDate
                ).format("DD-MM-YYYY"))
                setValue1("hearingRemark", r.data.remarks)
                setHearingId(r.data.id)
                setHearingDetails(r.data)
                // setHearingStatus(r.data.status)


            });
        }
    }

    // load appeal details
    const getAppealDetails = () => {

        console.log("MMMMMMMMMMMMMMM ", moment('2023-03-14T13:40:39').format('hh:mm a'));
        if (logedInUser === "citizenUser") {
            axios.get(`${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${router.query.id}`, {
                headers: {
                    UserId: user.id
                },
            }).then((res) => {
                setApplicationDetails(res.data)
                setAppealId(res.data.id)
                setValue("applicantFirstName", res.data?.applicantFirstName)
                setValue("applicantMiddleName", res.data?.applicantMiddleName)
                setValue("applicantLastName", res.data?.applicantLastName)
                setValue("address", res.data?.address)
                setApplicationKey(res.data?.applicationKey)
                getRTIApplicationById(res.data?.applicationKey)
                setValue("pinCode", res.data?.pinCode)
                setValue("paymentAmount", res.data?.paymentAmount)
                setValue("address", res.data?.address)
                setValue("appealReason", res.data?.appealReason)
                setValue("paymentModeKey", paymentDetails?.find((obj) => { return obj.id == res.data?.paymentModeKey }) ? paymentDetails.find((obj) => { return obj.id == res.data?.paymentModeKey }).paymentMode : "-",)
                setApplicationReceivedDetails(res.data?.createdUserType == 1 ? "citizenuser" :
                    res.data?.createdUserType == 2 ? "cfcuser" :
                        res.data?.createdUserType == 3 ? "pcmcportal" :
                            res.data?.createdUserType == 4 ? "aaplesarkar" : "")
                setValue("officerDetails", res.data?.officerDetails)
                setValue("dateOfOrderAgainstAppeal", moment(
                    res.data?.dateOfOrderAgainstAppeal,
                ).format("DD-MM-YYYY"))
                setValue("informationSubject", res.data?.subject)
                setValue("informationPurpose", res.data?.informationPurpose)
                setValue("concernedOfficeDetails", res.data?.concernedOfficeDetails)
                setValue("informationSubjectDesc", res.data?.informationSubjectDesc)
                setValue("informationDescription", res.data?.informationDescription)
                setStatusVal(res.data.status)
                setValue1("applicationNo", res.data?.applicationNo)
                setValue("status", res.data.status == 2 ? "Send For Payment"
                    : res.data.status == 3 ? "In Progress"
                        : res.data.status == 4 ? "LOI Generated"
                            : res.data.status == 5 ? "Payment Received"
                                : res.data.status == 6 ? "In Progress"
                                    : res.data.status == 7 ? "Hearing Scheduled"
                                        : res.data.status == 8 ? "Hearing Rescheduled"
                                            : res.data.status == 9 ? "Decision Done"
                                                : res.data.status == 11 ? "Complete"
                                                    : res.data.status == 12 ? "Close"
                                                        : res.data.status == 14 ? "Information Ready" : "",)
                setDataSource(
                    res.data.trnRtiHearingDaoList.map((row, i) => ({
                        srNo: i + 1,
                        id: row.id,
                        hearingDate: moment(
                            row.hearingDate
                        ).format("DD-MM-YYYY"),
                        // hearingTime: row.hearingTimeV3,
                        // hearingTime: moment(row.hearingDate + "T" + row.hearingTime).format("hh:mm:A"),
                        hearingTime: moment(row.hearingTimeV3).format("hh:mm:A"),

                        // hearingTime:moment(row.hearingTime, "HH:mm:ss"),
                        venue: row.venue,
                        remarks: row.remarks
                    }))
                );

            })
        } else {
            axios.get(`${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${router.query.id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            },).then((res) => {
                setApplicationDetails(res.data)
                setAppealId(res.data.id)
                setValue("applicantFirstName", res.data?.applicantFirstName)
                setValue("applicantMiddleName", res.data?.applicantMiddleName)
                setValue("applicantLastName", res.data?.applicantLastName)
                setValue("address", res.data?.address)
                setValue("pinCode", res.data?.pinCode)
                setValue("paymentAmount", res.data?.paymentAmount)
                setValue("address", res.data?.address)
                setValue("appealReason", res.data?.appealReason)
                setValue1("applicationNo", res.data?.applicationNo)
                getRTIApplicationById(res.data?.applicationKey)
                setValue("paymentModeKey", paymentDetails?.find((obj) => { return obj.id == res.data?.paymentModeKey }) ? paymentDetails.find((obj) => { return obj.id == res.data?.paymentModeKey }).paymentMode : "-",)
                setApplicationReceivedDetails(res.data?.createdUserType == 1 ? "citizenuser" :
                    res.data?.createdUserType == 2 ? "cfcuser" :
                        res.data?.createdUserType == 3 ? "pcmcportal" :
                            res.data?.createdUserType == 4 ? "aaplesarkar" : "")
                setValue("officerDetails", res.data?.officerDetails)
                setValue("dateOfOrderAgainstAppeal", moment(
                    res.data?.dateOfOrderAgainstAppeal,
                ).format("DD-MM-YYYY"))
                setValue("informationSubject", res.data?.subject)
                setValue("informationPurpose", res.data?.informationPurpose)
                setValue("concernedOfficeDetails", res.data?.concernedOfficeDetails)
                setValue("informationSubjectDesc", res.data?.informationSubjectDesc)
                setValue("informationDescription", res.data?.informationDescription)
                setStatusVal(res.data.status)
                setDataSource(
                    res.data.trnRtiHearingDaoList.map((row, i) => ({
                        srNo: i + 1,
                        id: row.id,
                        hearingDate: moment(
                            row.hearingDate
                        ).format("DD-MM-YYYY"),
                        // hearingTime:row.hearingTime,
                        hearingTime: moment(row.hearingTimeV3).format("hh:mm:A"),


                        // hearingTime:moment(row.hearingTime, "HH:mm:A"),
                        venue: row.venue,
                        remarks: row.remarks
                    }))
                );
                setValue("status", res.data.status == 2 ? "Send For Payment"
                    : res.data.status == 3 ? "In Progress"
                        : res.data.status == 4 ? "LOI Generated"
                            : res.data.status == 5 ? "Payment Received"
                                : res.data.status == 6 ? "In Progress"
                                    : res.data.status == 7 ? "Hearing Scheduled"
                                        : res.data.status == 8 ? "Hearing Rescheduled"
                                            : res.data.status == 9 ? "Decision Done"
                                                : res.data.status == 11 ? "Complete"
                                                    : res.data.status == 12 ? "Close"
                                                        : res.data.status == 14 ? "Information Ready" : "",)

            })
        }
    }

    // for fetching rti application no and applicant name on hearing modal
    const getRTIApplicationById = (applicationKey) => {
        if (logedInUser === "citizenUser") {
            axios.get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationKey}`, {
                headers: {
                    UserId: user.id
                }
            },).then((res) => {

                console.log("Res ", res)
                setValue1("applicantName", res.data.applicantFirstName)
                setValue1("rtiapplicationNo", res.data.applicationNo)
                setValue1("subject", res.data.subject)
            })
        } else {
            axios.get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationKey}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            },).then((res) => {
                console.log("Res ", res)
                setValue1("applicantName", res.data.applicantFirstName)
                setValue1("rtiapplicationNo", res.data.applicationNo)
                setValue1("subject", res.data.subject)

            })
        }
    }

    const handleCancel3 = () => {
        setIsOpenPayment(false)
    }

    const handleCancel4 = () => {
        setHearingSchedule(false)
        reset({
        ...resethearing,
    })
        setValue1("venue", "")
        setValue1("remarks", "")
        showDisable(false)
    }

    const handleCancel5 = () => {
        setDecisionEntry(false)
    }

    const resethearing= {
            rtiapplicationNo: "",
            applicationNo: "",
            applicantName: "",
            subject: "",
            hearingDate: null,
            hearingTime: null,
            venue: "null",
            remarks: "null"
        }
    

    // payment getway
    const changePaymentStatus = () => {
        const body = {
            id: appealId,
            activeFlag: "Y",
            ...applications,
            isApproved: false,
            isComplete: false,
        }
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`,
                    body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
                        getAppealDetails()
                        setIsOpenPayment(false)
                        sweetAlert("Saved!", "Record Saved successfully !", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`,
                    body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
                        getAppealDetails()
                        setIsOpenPayment(false)
                        sweetAlert("Saved!", "Record Saved successfully !", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    }

    // load payment methods
    const getPaymentMode = () => {
        axios.get(`${urls.CFCURL}/master/paymentMode/getAll`).then((res) => {
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

    // decision submit
    const onSubmitDecision = (formData) => {
        console.log("HEaring formdata ", hearingDetails)
        // const time = hearingDetails.hearingDate.split("T")[0] + "T" + hearingDetails.hearingTimeV3;
        const body = {
            // ...formData,
            ...hearingDetails,
        //   venue:hearingDetails.venue,
        //    hearingTime: hearingDetails.hearingTimeV3,
        //    hearingDate:hearingDetails.hearingDate,
            // id:hearingDetails.id,
            // remarks: hearingDetails.remarks,
            hearingTimeV3: hearingDetails.hearingTimeV3,
            decisionDetails: formData.decisionDetails,
            decisionStatus: formData.decisionStatus,
            remarks: formData.remarks,
            decisionOrderDocumentPath: document,
            informationDeliveredDocumentPath: document1,
            activeFlag:"Y",
            // appealKey: appealId,
            // id:hearingId,
            // status:hearingDetails.status
            isComplete: true,
            isRescheduled: false
        }
        console.log("body", body);
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiHearing/save`, body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        sweetAlert("Saved!", "Decision Entry Successfully!", "success");
                        setDecisionEntry(false)
                        getAppealDetails()
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiHearing/save`, body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        sweetAlert("Saved!", "Decision Entry Successfully!", "success");
                        setDecisionEntry(false)
                        getAppealDetails()
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    }

    // hearing submit
    const onSubmitHearing = (formData) => {
        console.log("FORMData " + formData.hearingTime)
        const hearingDate = moment(watch("hearingDate")).format("YYYY-MM-DD");
        const hearingTime = hearingDate + "T" + moment(watch("hearingTime")).format("HH:mm:ss");
        const body = {
            ...formData,
            hearingDate: hearingDate,
            hearingTimeV3: hearingTime,
            appealKey: appealId,
            isRescheduled: dataSource.length != 0 ? true : false,
            remarks: dataSource.length != 0 ? formData.hearingRemark : "",
            id: dataSource.length != 0 ? hearingId : null
        }
        console.log("body", body);
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiHearing/save`, body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        sweetAlert("Saved!", "Hearing Schedule Successfully!", "success");
                        setHearingSchedule(false)
                        getAppealDetails()
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiHearing/save`, body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        sweetAlert("Saved!", "Hearing Schedule Successfully!", "success");
                        setHearingSchedule(false)
                        getAppealDetails()
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    }

    // complete status of appeal
    const updateCompleteStatus = () => {

        const body = {
            // id: appealId,
            ...applications,
            selectedReturnMedia: watch("informationReturnMedia"),
            isComplete: "true",
            isApproved: false,
        }
        console.log("body " + JSON.stringify(body))

        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`,
                    body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        getAppealDetails()
                        sweetAlert("Saved!", "RTI Appeal completed!", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiAppeal/save`,
                    body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        getAppealDetails()
                        sweetAlert("Saved!", "RTI Appeal completed!", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    }

    // View
    return (
        <>
            <ThemeProvider theme={theme} >

                <Paper
                    elevation={8}
                    variant="outlined"
                    sx={{
                        border: 1,
                        borderColor: "grey.500",
                        marginLeft: "10px",
                        marginRight: "10px",
                        // marginTop: "10px",
                        marginBottom: 10,
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
                        <h2> <FormattedLabel id="viewrtiAppeal" /></h2>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            marginLeft: 5,
                            marginRight: 5,
                            marginBottom: 5,
                            padding: 1,
                        }}>
                        <FormProvider {...methods}>
                            <form >
                                <Grid container sx={{ padding: "0px" }}>
                                    {/* application received by */}
                                    {authority && authority.find((val) => val === "RTI_APPEAL_ADHIKARI") && <Grid
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
                                        <FormControl >
                                            <FormLabel
                                                sx={{ width: "400px", }}
                                                id='demo-row-radio-buttons-group-label'
                                            >
                                                {<FormattedLabel id='applicationReceivedBy' />}
                                            </FormLabel>

                                            <Controller
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                name='applicationReceivedBy'
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup
                                                        disabled={inputState}
                                                        value={appReceievedDetails}
                                                        // onChange={(value) => field.onChange(value)}
                                                        selected={field.value}
                                                        row
                                                        aria-labelledby='demo-row-radio-buttons-group-label'
                                                    >
                                                        <FormControlLabel
                                                            value='cfcuser'
                                                            disabled={inputState}
                                                            control={<Radio size='small' />}
                                                            label={<FormattedLabel id='cfcuser' />}
                                                            error={!!errors.applicationReceivedBy}
                                                            helperText={
                                                                errors?.applicationReceivedBy ? errors.applicationReceivedBy.message : null
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            value='citizenuser'
                                                            disabled={inputState}
                                                            control={<Radio size='small' />}
                                                            label={<FormattedLabel id='citizenuser' />}
                                                            error={!!errors.applicationReceivedBy}
                                                            helperText={
                                                                errors?.applicationReceivedBy ? errors.applicationReceivedBy.message : null
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            value='pcmcportal'
                                                            disabled={inputState}
                                                            control={<Radio size='small' />}
                                                            label={<FormattedLabel id='pcmcportal' />}
                                                            error={!!errors.applicationReceivedBy}
                                                            helperText={
                                                                errors?.applicationReceivedBy ? errors.applicationReceivedBy.message : null
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            value='aaplesarkar'
                                                            disabled={inputState}
                                                            control={<Radio size='small' />}
                                                            label={<FormattedLabel id='aaplesarkar' />}
                                                            error={!!errors.applicationReceivedBy}
                                                            helperText={
                                                                errors?.applicationReceivedBy ? errors.applicationReceivedBy.message : null
                                                            }
                                                        />
                                                    </RadioGroup>
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>}

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

                                    {/* applicant middle name */}
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

                                    {/* Address */}
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
                                            sx={{ width: "88% " }}
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

                                    {/* officer details */}
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
                                            sx={{ width: "88%" }}
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            id="standard-textarea"
                                            label={<FormattedLabel id="descInfoOfOfficer" />}
                                            multiline
                                            variant="standard"
                                            {...register("officerDetails")}
                                            error={!!errors.officerDetails}
                                            helperText={
                                                errors?.officerDetails ? errors.officerDetails.message : null
                                            }
                                        />
                                    </Grid>

                                    {/* date of official against appeal */}
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
                                        <TextField
                                            sx={{ minWidth: "230px", }}
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            id="standard-textarea"
                                            label={<FormattedLabel id="dateOfOfficialorderAgainstAppeal" />}
                                            multiline
                                            variant="standard"
                                            {...register("dateOfOrderAgainstAppeal")}
                                            error={!!errors.dateOfOrderAgainstAppeal}
                                            helperText={
                                                errors?.dateOfOrderAgainstAppeal ? errors.dateOfOrderAgainstAppeal.message : null
                                            }
                                        />
                                    </Grid> */}

                                    {/* information description */}
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
                                            sx={{ width: "88%" }}
                                            id="standard-textarea"
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
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

                                    {/* information and description */}
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
                                            sx={{ width: "88%", marginTop: 1 }}
                                            id="standard-textarea"
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
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

                                    {/* concern officer details */}
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
                                            sx={{ width: "88%", marginTop: 1 }}
                                            id="standard-textarea"
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            label={<FormattedLabel id="concernOfficerDeptnmWhoseInfoRequired" />}
                                            multiline
                                            variant="standard"
                                            {...register("concernedOfficeDetails")}
                                            error={!!errors.concernedOfficeDetails}
                                            helperText={
                                                errors?.concernedOfficeDetails ? errors.concernedOfficeDetails.message : null
                                            }
                                        />
                                    </Grid>

                                    {/* information purpose */}
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
                                            sx={{ width: "88%", marginTop: 1 }}
                                            id="standard-textarea"
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            label={<FormattedLabel id="requiredInfoPurpose" />}
                                            multiline
                                            variant="standard"
                                            {...register("informationPurpose")}
                                            error={!!errors.informationPurpose}
                                            helperText={
                                                errors?.informationPurpose ? errors.informationPurpose.message : null
                                            }
                                        />
                                    </Grid>

                                    {/* reason for appeal */}
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
                                            sx={{ width: "88%", marginTop: 1 }}
                                            id="standard-textarea"
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            label={<FormattedLabel id="reasonForAppeal" />}
                                            multiline
                                            variant="standard"
                                            {...register("appealReason")}
                                            error={!!errors.appealReason}
                                            helperText={
                                                errors?.appealReason ? errors.appealReason.message : null
                                            }
                                        />
                                    </Grid>

                                    {/* Payment mode */}
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
                                        <TextField
                                            sx={{ minWidth: "230px", marginTop: 1 }}
                                            id="standard-textarea"
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            label={<FormattedLabel id="paymentModeKey" />}
                                            multiline
                                            variant="standard"
                                            {...register("paymentModeKey")}
                                            error={!!errors.paymentModeKey}
                                            helperText={
                                                errors?.paymentModeKey ? errors.paymentModeKey.message : null
                                            }
                                        />
                                    </Grid> */}

                                    {/* Payment amount */}
                                    {/* <Grid
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
                                            label={<FormattedLabel id="paymentAmount" />}
                                            id="standard-textarea"
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ minWidth: "230px" }}
                                            variant="standard"
                                            {...register("paymentAmount")}
                                            error={!!errors.paymentAmount}
                                            helperText={
                                                errors?.paymentAmount ? errors.paymentAmount.message : null
                                            }
                                        />
                                    </Grid> */}

                                    {/* current status */}
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
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ width: 230 }}
                                            id="standard-textarea"
                                            label={<FormattedLabel id="currentStatus" />}
                                            multiline
                                            variant="standard"
                                            {...register("status")}
                                            error={!!errors.status}
                                            helperText={
                                                errors?.status ? errors.status.message : null
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </form>
                        </FormProvider>
                    </Box>


                    {/* *******************************Hearing Schedule******************************* */}

                    {dataSource.length != 0 && <div>
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2> <FormattedLabel id="hearingSchedule" /></h2>
                        </Box>
                        <DataGrid
                            // components={{ Toolbar: GridToolbar }}
                            // componentsProps={{
                            //     toolbar: {
                            //         showQuickFilter: true,
                            //         quickFilterProps: { debounceMs: 500 },
                            //     },
                            // }}
                            // autoHeight
                            // sx={{
                            //     marginTop: 2,
                            //     overflowY: "scroll",
                            //     "& .MuiDataGrid-virtualScrollerContent": {},
                            //     "& .MuiDataGrid-columnHeadersInner": {
                            //         backgroundColor: "#556CD6",
                            //         color: "white",
                            //     },
                            //     "& .MuiDataGrid-cell:hover": {
                            //         color: "primary.main",
                            //     },
                            // }}
                            density="standard"
                            // pagination
                            // paginationMode="server"
                            rowCount={totalElements}
                            rowsPerPageOptions={[5]}
                            pageSize={pageSize}
                            rows={dataSource}
                            columns={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI")?columns:columnsCitizen}
                        /></div>}
                    {/*  */}

                    {/* Payment visiblity button Disply only user  */}
                    {(((logedInUser === "departmentUser") && (authority && authority.find((val) => val !== "RTI_APPEAL_ADHIKARI")) ||
                        (logedInUser === "citizenUser")) && (statusVal === 2)) &&
                        <Grid item
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12} sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 2
                            }}>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ borderRadius: "20px" }}
                                size="small"
                                endIcon={<ExitToAppIcon />}
                                onClick={() => setIsOpenPayment(true)}
                            >
                                <FormattedLabel id="makePayment" />
                            </Button>
                        </Grid>}

                    {(authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI")) &&
                        <Box >
                            <Box>
                                <Grid container sx={{ padding: "10px" }}>

                                    {/* Schedule Button */}
                                    {(statusVal == 3 || statusVal == 6) && <Grid item
                                        xl={12}
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12} sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginBottom: 2
                                        }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ borderRadius: "20px" }}
                                            size="small"
                                            endIcon={<ExitToAppIcon />}
                                            onClick={() => setHearingSchedule(true)}
                                        >
                                            <FormattedLabel id="hearingSchedule" />
                                        </Button>
                                    </Grid>}
                                    {/* decision button  */}
                                    {/* <Grid item
                                        xl={(statusVal == 3 || statusVal == 6) ? 6 : 12}
                                        lg={(statusVal == 3 || statusVal == 6) ? 6 : 12}
                                        md={(statusVal == 3 || statusVal == 6) ? 6 : 12}
                                        sm={(statusVal == 3 || statusVal == 6) ? 6 : 12}
                                        xs={(statusVal == 3 || statusVal == 6) ? 6 : 12} sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginBottom: 2
                                        }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ borderRadius: "20px" }}
                                            size="small"
                                            endIcon={<ExitToAppIcon />}
                                            onClick={() => setDecisionEntry(true)}
                                        >
                                            <FormattedLabel id="decisionEntry" />
                                        </Button>
                                    </Grid> */}


                                </Grid>

                            </Box>
                        </Box>}

                    {(authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") && statusVal == 14) && <div>
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
                                alignItems: "center", marginBottom: 2
                            }}
                        >
                            <FormControl sx={{ width: 380, marginTop: "10px", marginLeft: 10 }}>
                                <FormLabel
                                    id='demo-row-radio-buttons-group-label'
                                >
                                    {<FormattedLabel id='informationReturnMedia' />}
                                </FormLabel>

                                <Controller
                                    disabled={false}
                                    InputLabelProps={{ shrink: true }}
                                    name='informationReturnMedia'
                                    control={control}
                                    defaultValue=''
                                    {...register("informationReturnMedia")}
                                    render={({ field }) => (
                                        <RadioGroup
                                            disabled={inputState}
                                            value={(statusVal !== 11) ? field.value : deliveryDetails}
                                            onChange={(value) => {
                                                field.onChange(value)
                                                console.log(value)
                                                // setSelectedReturnMedia(field.value)
                                            }}
                                            selected={field.value}
                                            row
                                            aria-labelledby='demo-row-radio-buttons-group-label'
                                        >
                                            <FormControlLabel
                                                value='byPost'
                                                disabled={inputState}
                                                control={<Radio size='small' />}
                                                label={<FormattedLabel id='byPost' />}
                                                error={!!errors.informationReturnMedia}
                                                helperText={
                                                    errors?.informationReturnMedia ? errors.informationReturnMedia.message : null
                                                }
                                                {...register("informationReturnMedia")}

                                            />
                                            <FormControlLabel
                                                value='personally'
                                                disabled={inputState}
                                                control={<Radio size='small' />}
                                                label={<FormattedLabel id='personally' />}
                                                error={!!errors.informationReturnMedia}
                                                helperText={
                                                    errors?.informationReturnMedia ? errors.informationReturnMedia.message : null
                                                }
                                                {...register("informationReturnMedia")}

                                            />
                                            <FormControlLabel
                                                value='softCopy'
                                                disabled={inputState}
                                                control={<Radio size='small' />}
                                                label={<FormattedLabel id='softCopy' />}
                                                error={!!errors.informationReturnMedia}
                                                helperText={
                                                    errors?.informationReturnMedia ? errors.informationReturnMedia.message : null
                                                }
                                                {...register("informationReturnMedia")}

                                            />
                                        </RadioGroup>
                                    )}
                                />
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
                                margin: 2

                            }}>
                            <Button
                                sx={{ marginRight: 8, marginBottom: 2 }}
                                variant="contained"
                                color="primary"
                                style={{ borderRadius: "20px" }}
                                size="small"
                                endIcon={<CheckIcon />}
                                onClick={() => updateCompleteStatus()}
                            >
                                <FormattedLabel id="completeAppeal" />
                            </Button>
                        </Grid>
                    </div>}
                </Paper>
            </ThemeProvider>


            {/* modal for payment */}
            <Modal
                title="Modal For Payment"
                open={isOpenPayment}
                onClose={handleCancel3} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
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
                                        onClick={() => handleCancel3()}
                                    >
                                        <FormattedLabel id="closeModal" />
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Box>
            </Modal>

            {/* modal for Hearing Schedule */}
            <Modal
                title="Modal For Hearing Schedule"
                open={isHearingSchedule}
                onClose={handleCancel4}
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
                        height: "70vh",
                    }}
                >
                    <Box style={{ height: "70vh" }}>
                        <>
                            <Box
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    paddingTop: "10px",
                                    background:
                                        "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                                }}
                            >
                                <h2> <FormattedLabel id="hearingSchedule" /></h2>
                            </Box>
                            <FormProvider {...methods2}>
                                <form onSubmit={handleSubmit2(onSubmitHearing)}>
                                    <Grid container sx={{ padding: "10px" }}>
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
                                            <TextField
                                                sx={{ width: 230 }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="rtiApplicationNO" />}
                                                multiline
                                                variant="standard"
                                                {...register1("rtiapplicationNo")}
                                                error={!!error2.rtiapplicationNo}
                                                helperText={
                                                    error2?.rtiapplicationNo ? error2.rtiapplicationNo.message : null
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
                                                color: "black",
                                            }}
                                        >
                                            <TextField
                                                sx={{ width: 230 }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicationNo" />}
                                                multiline
                                                variant="standard"
                                                {...register1("applicationNo")}
                                                error={!!error2.applicationNo}
                                                helperText={
                                                    error2?.applicationNo ? error2.applicationNo.message : null
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
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}

                                                sx={{ width: 230 }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicantFirstName" />}
                                                multiline
                                                variant="standard"
                                                {...register1("applicantName")}
                                                error={!!error2.applicantName}
                                                helperText={
                                                    error2?.applicantName ? error2.applicantName.message : null
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
                                                marginTop: "2%"
                                            }}
                                        >
                                            <TextField
                                                sx={{ width: 990 }}
                                                disabled={true}
                                                // disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") ? false : true}

                                                id="standard-textarea"
                                                label={<FormattedLabel id="subject" />}
                                                multiline
                                                variant="standard"
                                                {...register1("subject")}
                                                error={!!error2.subject}
                                                helperText={
                                                    error2?.subject ? error2.subject.message : null
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
                                                style={{ backgroundColor: "white", minWidth: "230px" }}
                                                error={!!error2.hearingDate}
                                            >
                                                <Controller
                                                    InputLabelProps={{ shrink: true }}
                                                    control={control}
                                                    defaultValue={null}
                                                    name="hearingDate"
                                                    render={({ field }) => (
                                                         <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                            defaultDate={"23-09-2023"}
                                                                inputFormat="DD-MM-YYYY"
                                                                label={
                                                                    <span style={{ fontSize: 16 }}>
                                                                        {<FormattedLabel id="scheduleDate" />}
                                                                    </span>
                                                                }
                                                                {...register1("hearingDate")}
                                                                // disabled={showDisabled ? true : false}
                                                                disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") ? false : true}
                                                                value={field.value}
                                                                // defaultValue={hearingDate}
                                                                onChange={(date) => field.onChange(date)}
                                                                selected={field.value}
                                                                // selected={field.value
                                                                //     ? moment(field.value).format('DD-MM-YYYY')
                                                                //     : null}
                                                                center
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        size="small"
                                                                        fullWidth
                                                                        {...register1("hearingDate")}
                                                                       
                                                                        variant="standard"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                         </LocalizationProvider>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {error2?.hearingDate ? error2.hearingDate.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item
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
                                                style={{ marginTop: 10 }}
                                                error={!!error2.hearingTime}
                                            >
                                                <Controller
                                                    InputLabelProps={{ shrink: true }}
                                                    name='hearingTime'
                                                    control={control}
                                                    {...register1("hearingTime")}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <TimePicker
                                                                // inputFormat="hh:mm:A"
                                                                id="standard-textarea"
                                                                // disabled={showDisabled ? true : false}
                                                                disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") ? false : true}
                                                                value={field.value}
                                                                {...register1("hearingTime")}
                                                                label={
                                                                    <span style={{ fontSize: 16 }}>
                                                                        {<FormattedLabel id="scheduleTime" />}
                                                                    </span>
                                                                }
                                                                onChange={(time) => {
                                                                    field.onChange(time)
                                                                    console.log("watch ", watch("hearingTime"))
                                                                }}
                                                                selected={field.value}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        // {...params}
                                                                        // size="small"
                                                                        // {...register1("hearingTime")}
                                                                        // id="standard-textarea"
                                                                        // multiline
                                                                        // variant="standard"
                                                                        // InputLabelProps={{ shrink: true }}

                                                                        {...params}
                                                                        size="small"
                                                                        fullWidth
                                                                        {...register1("hearingTime")}

                                                                        variant="standard"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {error2?.hearingTime
                                                        ? error2.hearingTime.message
                                                        : null}
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
                                            <TextField
                                                label={<FormattedLabel id="venueForHearing" />}
                                                id="standard-textarea"
                                                // disabled={showDisabled ? true : false}
                                                disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") ? false : true}

                                                InputLabelProps={{ shrink: true }}
                                                sx={{ width: 230 }}
                                                variant="standard"
                                                {...register1("venue")}
                                                error={!!error2.venue}
                                                helperText={
                                                    error2?.venue ? error2.venue.message : null
                                                }
                                            />
                                        </Grid>
                                        {dataSource.length != 0 && <Grid item
                                            xl={12}
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center", marginTop: 2
                                            }}>
                                            <TextField
                                                label={<FormattedLabel id="remark" />}
                                                id="standard-textarea"
                                                sx={{ width: 990 }}
                                                variant="standard"
                                                disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") ? false : true}
                                                InputLabelProps={{ shrink: true }}
                                                {...register1("hearingRemark")}
                                                error={!!error2.hearingRemark}
                                                helperText={
                                                    error2?.hearingRemark ? error2.hearingRemark.message : null
                                                }
                                            />
                                        </Grid>}


                                        <Grid container sx={{ padding: "10px" }}>
                                            {(showDisabled === false) && (<Grid item
                                                xl={6}
                                                lg={6}
                                                md={6}
                                                sm={6}
                                                xs={6} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 5
                                                }}>
                                                <Button
                                                    sx={{ marginRight: 8 }}
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<SaveIcon />}
                                                >
                                                    <FormattedLabel id="hearingSchedule" />
                                                </Button>
                                            </Grid>)}
                                            {(authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI" && (hearingDetails.status !== 11 &&hearingDetails.status!==9)) && dataSource.length != 0
                                            ) &&
                                                <Grid item
                                                    xl={4}
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={6} sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginTop: 5
                                                    }}>
                                                    <Button
                                                        sx={{ marginRight: 8 }}

                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<ExitToAppIcon />}
                                                        onClick={() => {
                                                            setHearingSchedule(false)
                                                            setDecisionEntry(true)
                                                        }}
                                                    >
                                                        <FormattedLabel id="decisionEntry" />
                                                    </Button>
                                                </Grid>}
                                            {((dataSource.length != 0) &&
                                                (authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI")) &&
                                                    (hearingDetails.status !== 11 &&hearingDetails.status!==9)) &&
                                                (<Grid item
                                                    xl={4}
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={6} sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginTop: 5
                                                    }}>
                                                    <Button
                                                        sx={{ marginRight: 8 }}
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<ExitToAppIcon />}
                                                        onClick={() => {
                                                            setHearingSchedule(true)
                                                        }}
                                                    >
                                                        <FormattedLabel id="hearingReschedule" />
                                                    </Button>
                                                </Grid>)}


                                            <Grid item
                                                // xl={4}
                                                // lg={4}
                                                // md={4}
                                                // sm={6}
                                                // xs={6}
                                                xl={(authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") && (hearingDetails.status == 11 || hearingDetails.status == 9)) ? 12 : 4}
                                                lg={(authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") && (hearingDetails.status == 11 || hearingDetails.status == 9)) ? 12 : 4}
                                                md={(authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") && (hearingDetails.status == 11 || hearingDetails.status == 9)) ? 12 : 4}
                                                sm={12}
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 5
                                                }}>
                                                <Button
                                                    sx={{ marginRight: 8 }}
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<ClearIcon />}
                                                    onClick={() => handleCancel4()}
                                                >
                                                    <FormattedLabel id="closeModal" />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>
                            </FormProvider>
                        </>
                    </Box>
                </Box>
            </Modal>

            {/*modal for decision */}
            <Modal
                title="Modal For Desicion Entry"
                open={isDecisionEntry}
                onClose={handleCancel5} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
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
                        height: "61vh",
                    }}
                >
                    <Box style={{ height: "70vh" }}>
                        <>
                            <Box
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    paddingTop: "10px",
                                    background:
                                        "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                                }}
                            >
                                <h2> <FormattedLabel id="decisionEntry" /></h2>
                            </Box>
                            <FormProvider {...methods2}>
                                <form onSubmit={handleSubmit3(onSubmitDecision)}>
                                    <Grid container sx={{ padding: "10px" }}>
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
                                            <TextField
                                                sx={{ width: 230 }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="rtiApplicationNO" />}
                                                multiline
                                                variant="standard"
                                                {...register1("rtiapplicationNo")}
                                                error={!!error2.rtiapplicationNo}
                                                helperText={
                                                    error2?.rtiapplicationNo ? error2.rtiapplicationNo.message : null
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
                                                color: "black",
                                            }}
                                        >
                                            <TextField
                                                sx={{ width: 230 }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicationNo" />}
                                                multiline
                                                variant="standard"
                                                {...register1("applicationNo")}
                                                error={!!error2.applicationNo}
                                                helperText={
                                                    error2?.applicationNo ? error2.applicationNo.message : null
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
                                                // disabled={true}
                                                // InputLabelProps={{ shrink: true }}

                                                sx={{ width: 230 }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="decisiontakenInHearing" />}
                                                multiline
                                                variant="standard"
                                                {...register2("decisionDetails")}
                                                error={!!error3.decisionDetails}
                                                helperText={
                                                    error3?.decisionDetails ? error3.decisionDetails.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "2%"
                                            }}
                                        >
                                            <TextField
                                                sx={{ width: 230 }}
                                                // disabled={true}

                                                id="standard-textarea"
                                                label={<FormattedLabel id="decisionStatus" />}
                                                multiline
                                                variant="standard"
                                                {...register2("decisionStatus")}
                                                error={!!error3.decisionStatus}
                                                helperText={
                                                    error3?.decisionStatus ? error3.decisionStatus.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xl={8}
                                            lg={8}
                                            md={8}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: "2%"
                                            }}
                                        >
                                            <TextField
                                                sx={{ width: 610 }}
                                                // disabled={true}

                                                id="standard-textarea"
                                                label={<FormattedLabel id="remark" />}
                                                multiline
                                                variant="standard"
                                                {...register2("remarks")}
                                                error={!!error3.remarks}
                                                helperText={
                                                    error3?.remarks ? error3.remarks.message : null
                                                }
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: 2
                                            }}
                                        >
                                            <div style={{ display: "block", }}>
                                                <FormattedLabel id="decisionOrderAttach" /><br />

                                                <UploadButton
                                                    sx={{ width: 20 }}
                                                    appName="RTI"
                                                    serviceName="RTI-Appeal"
                                                    filePath={setDocument}
                                                    fileName={document} />
                                            </div>
                                        </Grid>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginTop: 2
                                            }}
                                        >
                                            <div style={{ display: "block", }}>
                                                <FormattedLabel id="updloadScanInfoDelivered" /><br />
                                                <UploadButton
                                                    sx={{ width: 20 }}
                                                    appName="RTI"
                                                    serviceName="RTI-Appeal"
                                                    filePath={setDocument1}
                                                    fileName={document1} />

                                            </div>
                                        </Grid>
                                        <Grid container sx={{ padding: "10px" }}>
                                            <Grid item xl={6}
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 5
                                                }}>
                                                <Button
                                                    sx={{ marginRight: 8 }}
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<SaveIcon />}
                                                >
                                                    <FormattedLabel id="save" />
                                                </Button>
                                            </Grid>

                                            <Grid item
                                                xl={6}
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 5
                                                }}>
                                                <Button
                                                    sx={{ marginRight: 8 }}
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<ClearIcon />}
                                                    onClick={() => handleCancel5()}
                                                >
                                                    <FormattedLabel id="closeModal" />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>
                            </FormProvider>
                        </>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default EntryForm;



