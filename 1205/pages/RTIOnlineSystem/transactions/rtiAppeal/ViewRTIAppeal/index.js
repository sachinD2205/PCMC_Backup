import {
    Box,
    Button,
    FormLabel,
    Radio, InputLabel,
    RadioGroup,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextField,
    ThemeProvider,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import theme from "../../../../../theme";
import CheckIcon from '@mui/icons-material/Check';
import DownloadIcon from "@mui/icons-material/Download"
import {
    DatePicker,
    LocalizationProvider,
    TimePicker,
} from "@mui/x-date-pickers"
import VisibilityIcon from "@mui/icons-material/Visibility"
import {
    getDocumentFromLocalStorage,
    removeDocumentToLocalStorage,
} from "../../../../../components/redux/features/RTIOnlineSystem/rtiOnlineSystem"
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DataGrid } from "@mui/x-data-grid";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import decisionSchema from "../../../../../containers/schema/rtiOnlineSystemSchema/decisionSchema";
import {  useSelector } from "react-redux";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

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
        mode: "onChange",
    });


    const {
        register: register1,
        handleSubmit: handleSubmit2,
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
        methods: methods3,
        reset: reset3,
        control: control3,
        setValue: setValue2,
        formState: { errors: error3 },
    } = useForm({
        criteriaMode: 'all',
        resolver: yupResolver(decisionSchema),
    })

    const language = useSelector((state) => state?.labels?.language);
    const [totalAmount, setTotalAmt] = useState(null)
    const [crAreaNames, setCRAreaName] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [isBplval, setIsBpl] = useState(null)
    const [chargeTypeVal, setChargeType] = useState(null)
    const [appReceievedDetails, setApplicationReceivedDetails] = useState(null)
    const [deliveryDetails, setDeliveryDetails] = useState()
    const [deliveryDetails1, setDeliveryDetails1] = useState()
    const [genderVal, setGender] = useState(null)
    const [chargeTypeDetails, setChargeTypeDetails] = useState([])
    const router = useRouter();
    const [appealId, setAppealId] = useState(null)
    const inputState = getValues("inputState");
    const [wards, setWards] = useState([]);
    const [subDepartments, setSubDepartmentList] = useState([])
    const [isOpenPayment, setIsOpenPayment] = useState(false)
    const [isHearingSchedule, setHearingSchedule] = useState(false)
    const [showDisabled, showDisable] = useState(false)
    const [hearingId, setHearingId] = useState(null)
    const [applicationKey, setApplicationKey] = useState(null)
    const [dataSource, setDataSource] = useState([]);
    const [document, setDocument] = useState()
    const [document1, setDocument1] = useState()
    const [applicationNumber, setApplicationNumber] = useState(null)
    const [deptId, setDeptId] = useState(null)
    const [hasDependant, setHasDependant] = useState(false)
    const [completeAttach, setCompleteAttach] = useState([])
    const [applicationDoc, setApplicationDoc] = useState([])
    const [childDept, setChildDept] = useState([])
    const [applications, setApplicationDetails] = useState([])
    const [pageNo, setPageNo] = useState();
    const logedInUser = localStorage.getItem("loggedInUser")
    let user = useSelector((state) => state.user.user)
    const [statusVal, setStatusVal] = useState(null)
    const [isDecisionEntry, setDecisionEntry] = useState(false)
    const [hearingDetails, setHearingDetails] = useState([])
    const [appealDoc, setAppealDoc] = useState([])
    const [decisionDetailsrow, setDecisionDoc] = useState([])
    const [educationVal, setEducation] = useState(null)
    const [selectdeliveryDetails, setSelectedDeliveryDetails] = useState(null)
    const [zoneDetails, setZoneDetails] = useState();
    const [applicationId, setApplicationID] = useState(null)
    const [departments, setDepartments] = useState([]);
    const [genderDetails, setGenderDetails] = useState([])
    const [loiDetails, setLoiDetails] = useState([])
    const [amount, setRatePerPage] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")
    );

    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time)
    };

    useEffect(() => {
        getCRAreaName()
        getZone()
        getWards()
        getDepartments()
        getGenders()
        getSubDepartments()
        getChargeType()
    }, []);

    useEffect(() => {
        getRTIApplicationById()
    }, [applicationKey])

    useEffect(() => {
        if (router.query.id) {
            setValue("appealApplicationNo", router.query.id)
            getAppealDetails()
        }
    }, [router.query.id])

    useEffect(() => {
        getLoi()
    }, [applicationId])

    // hearing table for citizen
    const columnsCitizen = [
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

    // hearing table for dept user
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

    // Document table
    const docColumns = [
        {
            field: "id",
            headerName: <FormattedLabel id="srNo" />,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "filenm",
            headerName: <FormattedLabel id="fileNm" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth:200,
        },
        {
            field: "documentType",
            headerName: <FormattedLabel id="fileType" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth:200,
        },
        {
            field: "Action",
            headerName: <FormattedLabel id="actions" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth:200,
            renderCell: (record) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            gap: 12,
                        }}
                    >
                        <IconButton
                            color="primary"
                            onClick={() => {
                                window.open(
                                    `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                                    "_blank"
                                )
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </div>
                )
            },
        },
    ]

    // child dept column
    const childDeptColumns = [
        {
            field: "srNo",
            headerName: <FormattedLabel id="srNo" />,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "departmentName",
            headerName: <FormattedLabel id="departmentKey" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth:200,
        },
        {
            field: "transferRemark",
            headerName: <FormattedLabel id='transferRemark' />,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth:200,
        },
        {
            field: "infoPages",
            headerName: <FormattedLabel id="noOfPages" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth:200,
        },
        {
            field: "remark",
            headerName: <FormattedLabel id="remark" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth:200,
        },
        {
            field: "status",
            headerName: <FormattedLabel id="status" />,
            headerAlign: "center",
            align: "center",
            minWidth:200,
        },
        {
            field: "completedDate",
            headerName: <FormattedLabel id="completeDate" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth:200,
        },
        {
            field: "Action",
            headerName: <FormattedLabel id="viewAttach" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth:200,
            renderCell: (record) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            gap: 12,
                        }}
                    >
                        <IconButton
                            color="primary"
                            onClick={() => {
                                if (record.row.documentPath) {
                                    window.open(
                                        `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                                        "_blank"
                                    )
                                }
                            }}
                        >
                            <VisibilityIcon style={{ color: record.row.documentPath ? "#556CD6" : "grey" }} />
                        </IconButton>
                    </div>
                )
            },
        },
    ]

    // getAreaName
    const getCRAreaName = () => {
        axios
            .get(`${urls.CfcURLMaster}/area/getAll`)
            .then((r) => {
                setCRAreaName(
                    r.data.area.map((row) => ({
                        id: row.id,
                        crAreaName: row.areaName,
                        crAreaNameMr: row.areaNameMr,
                    })),
                );
            });
    };

    // load zone
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
        })
    }

    // load wards
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

    // get charge type
    const getChargeType = () => {
        axios.get(`${urls.CFCURL}/master/serviceChargeType/getAll`).then((r) => {
            setChargeTypeDetails(
                r.data.serviceChargeType.map((row) => ({
                    id: row.id,
                    serviceChargeType: row.serviceChargeType,
                }))
            );
        });
    };

    // get all subdept
    const getSubDepartments = () => {
        axios
            .get(
                `${urls.RTI}/master/subDepartment/getAll`
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

    // Get all department
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

    // load gender
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

    // load get loi
    const getLoi = () => {
        if (localStorage.getItem("loggedInUser") === "citizenUser") {
            axios.get(`${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${applicationId}`, {
                headers: {
                    UserId: user.id
                }
            }).then((res) => {
                if (res.data.trnAppealLoiList.length != 0) {
                    setLOIDetails(res)
                }
            });
        } else {
            axios.get(`${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${applicationId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }).then((res) => {
                if (res.data.trnAppealLoiList.length != 0) {
                    setLOIDetails(res)
                }
            });
        }
    }

    // Set loi details on ui
    const setLOIDetails = (res) => {
        setLoiDetails(res.data.trnAppealLoiList[0])
        setChargeType(res.data?.trnAppealLoiList[0].chargeTypeKey)
        setValue1("chargeTypeKey", res.data?.trnAppealLoiList[0].chargeTypeKey)
        setValue1("noOfPages", res.data.trnAppealLoiList[0].noOfPages)
        setValue1("amount", res.data?.trnAppealLoiList[0].amount)
        setValue1("totalAmount", res.data?.trnAppealLoiList[0].totalAmount)
        setValue1("remarks", res.data?.trnAppealLoiList[0].remarks)
        setPageNo(res.data.trnAppealLoiList[0].noOfPages)
        setRatePerPage(res.data?.trnAppealLoiList[0].amount)
        setTotalAmt(res.data?.trnAppealLoiList[0].totalAmount)
    }

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
                // setValue1("hearingDate", moment(
                //     r.data.hearingDate
                // ).format("DD-MM-YYYY"))
                // setValue1("hearingRemark", r.data.remarks)
                setSelectedDate(r.data.hearingDate);
                setSelectedTime(r.data.hearingTimeV3)
                setHearingId(r.data.id)
                setHearingDetails(r.data)
                const doc = []

            });
        } else {
            axios.get(`${urls.RTI}/trnRtiHearing/getById?id=${hearingByid}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            }).then((r) => {
                console.log("hearing data ", r.data)
                setValue1("venue", r.data.venue)
                // setValue1("hearingTime", r.data.hearingTimeV3)
                // setValue1("hearingDate", moment(
                //     r.data.hearingDate
                // ).format("DD-MM-YYYY"))
                setSelectedDate(r.data.hearingDate);
                setSelectedTime(r.data.hearingTimeV3)
                setValue1("hearingRemark", r.data.remarks)
                setHearingId(r.data.id)
                setHearingDetails(r.data)
            });
        }
    }

    // load appeal details
    const getAppealDetails = () => {
        if (logedInUser === "citizenUser") {
            axios.get(`${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${router.query.id}`, {
                headers: {
                    UserId: user.id
                },
            }).then((res) => {
                setAppealDetails(res)
            })
        } else {
            axios.get(`${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${router.query.id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            },).then((res) => {
                setAppealDetails(res)
            })
        }
    }

    // set appeal detailsF
    const setAppealDetails = (res) => {
        setApplicationDetails(res.data)
        setAppealId(res.data.id)
        setValue("applicantFirstName", res.data?.applicantFirstName)
        setValue("applicantMiddleName", res.data?.applicantMiddleName)
        setValue("applicantLastName", res.data?.applicantLastName)
        setValue("applicantName", res?.data.applicantFirstName + " " + res?.data.applicantMiddleName + " " + res?.data.applicantLastName)
        setValue("address", res.data?.address)
        setApplicationKey(res.data?.applicationKey)
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
        setValue("concernedOfficeDetails", res.data?.concernedOfficeDetails)
        setValue("informationSubjectDesc", res.data?.informationSubjectDesc)
        setValue("informationDescription", res.data?.informationDescription)
        setStatusVal(res.data.status)
        setValue("selectedReturnMedia2", res?.data?.selectedReturnMedia)
        setDeliveryDetails1(res?.data?.selectedReturnMedia)
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
                hearingTime: moment(row.hearingTimeV3).format('hh:mm a'),
                venue: row.venue,
                remarks: row.remarks
            }))
        );
        if (res.data.trnRtiHearingDaoList.length != 0) {
            setValue2("decisionDetails", res.data.trnRtiHearingDaoList[0].decisionDetails)
            setValue2("decisionStatus", res.data.trnRtiHearingDaoList[0].decisionStatus)

            setValue2("remarks", res.data.trnRtiHearingDaoList[0].remarks)

            const doc = []
            if (res.data.trnRtiHearingDaoList[0].decisionOrderDocumentPath != null) {
                doc.push({
                    id: 1,
                    filenm: "Decision Order Document",
                    documentPath: res.data.trnRtiHearingDaoList[0].decisionOrderDocumentPath,
                    documentType: res.data.trnRtiHearingDaoList[0].decisionOrderDocumentPath.split(".").pop().toUpperCase()
                });
            }
            if (res.data.trnRtiHearingDaoList[0].informationDeliveredDocumentPath != null) {
                doc.push({
                    id: 2,
                    filenm: "Information Delivered Document",
                    documentPath: res.data.trnRtiHearingDaoList[0].informationDeliveredDocumentPath,
                    documentType: res.data.trnRtiHearingDaoList[0].informationDeliveredDocumentPath.split(".").pop().toUpperCase()
                })
            }
            setDecisionDoc(doc)
        }


        const doc = []
        if (res.data.attachedDocument1 != null) {
            doc.push({
                id: 1,
                filenm: res.data.attachedDocument1.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument1,
                documentType: res.data.attachedDocument1.split(".").pop().toUpperCase()
            });
        }
        if (res.data.attachedDocument2 != null) {
            doc.push({
                id: 2,
                filenm: res.data.attachedDocument2.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument2,
                documentType: res.data.attachedDocument2.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument3 != null) {
            doc.push({
                id: 3,
                filenm: res.data.attachedDocument3.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument3,
                documentType: res.data.attachedDocument3.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument4 != null) {
            doc.push({
                id: 4,
                filenm: res.data.attachedDocument4.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument4,
                documentType: res.data.attachedDocument4.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument5 != null) {
            doc.push({
                id: 5,
                filenm: res.data.attachedDocument5.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument5,
                documentType: res.data.attachedDocument5.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument6 != null) {
            doc.push({
                id: 6,
                filenm: res.data.attachedDocument6.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument6,
                documentType: res.data.attachedDocument6.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument7 != null) {
            doc.push({
                id: 7,
                filenm: res.data.attachedDocument7.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument7,
                documentType: res.data.attachedDocument7.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument8 != null) {
            doc.push({
                id: 8,
                filenm: res.data.attachedDocument8.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument8,
                documentType: res.data.attachedDocument8.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument9 != null) {
            doc.push({
                id: 9,
                filenm: res.data.attachedDocument9.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument9,
                documentType: res.data.attachedDocument9.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument10 != null) {
            doc.push({
                id: 10,
                filenm: res.data.attachedDocument10.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument10,
                documentType: res.data.attachedDocument10.split(".").pop().toUpperCase()
            })
        }
        setAppealDoc(doc)
    }

    // for fetching rti application no and applicant name on hearing modal
    const getRTIApplicationById = () => {
        if (logedInUser === "citizenUser") {
            axios.get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationKey}`, {
                headers: {
                    UserId: user.id
                }
            },).then((res) => {
                setRTIApplicationDetails(res)
                setApplicationDetailsOnForm(res.data)
            })
        } else {
            axios.get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationKey}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            },).then((res) => {
                setRTIApplicationDetails(res)
                setApplicationDetailsOnForm(res.data)
            })
        }
    }
    
// set appeal details on form
    const setApplicationDetailsOnForm = (_res) => {
        setValue("areaKey", crAreaNames?.find((obj) => { return obj.id == _res?.areaKey }) ? crAreaNames.find((obj) => { return obj.id == _res?.areaKey }).crAreaName : "-",)
        setValue("zoneKey", zoneDetails?.find((obj) => { return obj.id == _res?.zoneKey }) ? zoneDetails.find((obj) => { return obj.id == _res?.zoneKey }).zoneName : "-",)
        setValue("wardKey", wards?.find((obj) => { return obj.id == _res?.wardKey }) ? wards.find((obj) => { return obj.id == _res.wardKey }).wardName : "-",)
        setValue("departmentKey", departments?.find((obj) => { return obj.id == _res?.departmentKey }) ? departments.find((obj) => { return obj.id == _res.departmentKey }).department : "-")
        setValue("subDepartmentKey", subDepartments?.find((obj) => { return obj.id == _res?.subDepartmentKey }) ? subDepartments.find((obj) => { return obj.id == _res.subDepartmentKey }).subDepartment : "-")
        setApplicationID(_res?.id)
        setValue("applicantFirstName", _res?.applicantFirstName)
        setValue1("applicantFirstName", _res?.applicantFirstName + " " + _res?.applicantMiddleName + " " + _res?.applicantLastName)
        setValue1("serviceName", "RTI")
        setValue("applicantMiddleName", _res?.applicantMiddleName)
        setValue("applicantLastName", _res?.applicantLastName)
        setValue("address", _res?.address)
        setValue("gender", genderDetails?.find((obj) => { return obj.id == _res?.gender }) ? genderDetails.find((obj) => { return obj.id == _res?.gender }).gender : "-")
        setGender(_res?.gender)
        setValue("pinCode", _res?.pinCode)
        setValue("contactDetails", _res?.contactDetails)
        setValue1("applicationNo", _res?.applicationNo)
        setApplicationNumber(_res?.applicationNo)
        setValue("emailId", _res?.emailId)
        setEducation(_res?.education)
        setDeptId(_res?.departmentKey)
        setIsBpl(_res?.isBpl)
        setValue("bplCardNo", _res?.bplCardNo)
        setValue("yearOfIssues", _res?.bplCardIssueYear)
        setValue("informationSubject", _res?.subject)
        setValue("issuingAuthority", _res?.bplCardIssuingAuthority)
        setValue("remarks", _res?.remarks)
        setValue("completeRemark", _res?.remarks)
        setValue("applicationNo", _res?.applicationNo)
        setValue("applicationType", "Child Application")
        setHasDependant(_res?.hasDependant == null ? false : _res?.hasDependant)
        setValue("fromDate",
            moment(
                _res?.fromDate,
            ).format("DD-MM-YYYY")),
            setValue("toDate", moment(_res?.toDate,
            ).format("DD-MM-YYYY"))
        setValue("applicationDate",
            moment(
                _res?.applicationDate,
            ).format("DD-MM-YYYY")),
            setValue("toDate", moment(_res?.toDate,
            ).format("DD-MM-YYYY"))
        setDeliveryDetails(_res?.informationReturnMedia)
        setSelectedDeliveryDetails(_res?.informationReturnMedia)
        setValue("informationReturnMedia1", _res?.selectedReturnMedia && _res?.selectedReturnMedia.toUpperCase())
        setValue("description", _res?.description)
        setValue("additionalInfo", _res?.additionalInfo)
        setValue("parentRemark", _res?.transferRemark)
        setValue("forwardRemark", _res?.forwardRemark)
        setApplicationReceivedDetails(_res?.createdUserType == 1 ? "citizenuser" :
            _res?.createdUserType == 2 ? "cfcuser" :
                _res?.createdUserType == 3 ? "pcmcportal" :
                    _res?.createdUserType == 4 ? "aaplesarkar" : "")
        setValue("infoPages", _res?.infoPages),
        setValue("infoRemark", _res?.infoAvailableRemarks);


        const completeDoc = []
        if (_res.attachedDocumentPath != null) {
            completeDoc.push({
                id: 1,
                filenm: _res.attachedDocumentPath.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocumentPath,
                documentType: _res.attachedDocumentPath.split(".").pop().toUpperCase()
            })
            setCompleteAttach(completeDoc)
        }

        if (_res.dependentRtiApplicationDaoList && departments) {
            const _res1 = _res.dependentRtiApplicationDaoList.map((res, i) => {
                return {
                    srNo: (i + 1),
                    id: res.id,
                    applicationNo: res.applicationNo,
                    departmentName: departments.find((filterData) => {
                        console.log("dept ", res?.departmentKey)
                        return filterData?.id == res?.departmentKey;
                    })?.department,
                    createdDate: res.createdDate,
                    description: res.description,
                    subject: res.subject,
                    applicationDate: moment(
                        res.applicationDate,
                    ).format("DD-MM-YYYY"),
                    completedDate: moment(
                        res.completionDate,
                    ).format("DD-MM-YYYY"),
                    statusVal: res.status,
                    transferRemark: res.transferRemark,
                    status: res.status == 2 ? "Send For Payment"
                        : res.status == 3 ? "In Progress"
                            : res.status == 4 ? "LOI Generated"
                                : res.status == 5 ? "Payment Received"
                                    : res.status == 6 ? "Send to Applete Officer"
                                        : res.status == 7 ? "Hearing Scheduled"
                                            : res.status == 8 ? "Hearing Rescheduled"
                                                : res.status == 9 ? "Decision Done"
                                                    : res.status == 11 ? "Complete"
                                                        : res.status == 12 ? "Close"
                                                            : res.status == 14 ? "Information Ready" : "",
                    activeFlag: res.activeFlag,
                    remark: res.remarks,
                    infoPages: res.infoPages,
                    filenm: (res.status == 11 && res.attachedDocumentPath) ? res.attachedDocumentPath.split("/").pop() : "",
                    documentPath: (res.status == 11 && res.attachedDocumentPath) ? res.attachedDocumentPath : "",
                    documentType: (res.status == 11 && res.attachedDocumentPath) ? res.attachedDocumentPath.split(".").pop().toUpperCase() : ""
                };
            })
            setChildDept([..._res1]);
        }
    }

// set application details on form
    const setRTIApplicationDetails = (res) => {
        setValue1("applicantName", res.data.applicantFirstName + " " + res.data.applicantMiddleName + " " + res.data.applicantLastName)
        setValue1("rtiapplicationNo", res.data.applicationNo)
        setValue1("description", res.data.description)
        setValue("informationSubject", res.data?.subject)
        setValue("fromDate",
            moment(
                res.data?.fromDate,
            ).format("DD-MM-YYYY")),
            setValue("toDate", moment(res.data?.toDate,
            ).format("DD-MM-YYYY"))
        setValue("applicationDate",
            moment(
                res.data?.applicationDate,
            ).format("DD-MM-YYYY")),
            setValue("toDate", moment(res.data?.toDate,
            ).format("DD-MM-YYYY"))
        const doc = []
        if (res.data.attachedDocument1 != null) {
            doc.push({
                id: 1,
                filenm: res.data.attachedDocument1.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument1,
                documentType: res.data.attachedDocument1.split(".").pop().toUpperCase()
            });
        }
        if (res.data.attachedDocument2 != null) {
            doc.push({
                id: 2,
                filenm: res.data.attachedDocument2.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument2,
                documentType: res.data.attachedDocument2.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument3 != null) {
            doc.push({
                id: 3,
                filenm: res.data.attachedDocument3.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument3,
                documentType: res.data.attachedDocument3.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument4 != null) {
            doc.push({
                id: 4,
                filenm: res.data.attachedDocument4.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument4,
                documentType: res.data.attachedDocument4.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument5 != null) {
            doc.push({
                id: 5,
                filenm: res.data.attachedDocument5.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument5,
                documentType: res.data.attachedDocument5.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument6 != null) {
            doc.push({
                id: 6,
                filenm: res.data.attachedDocument6.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument6,
                documentType: res.data.attachedDocument6.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument7 != null) {
            doc.push({
                id: 7,
                filenm: res.data.attachedDocument7.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument7,
                documentType: res.data.attachedDocument7.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument8 != null) {
            doc.push({
                id: 8,
                filenm: res.data.attachedDocument8.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument8,
                documentType: res.data.attachedDocument8.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument9 != null) {
            doc.push({
                id: 9,
                filenm: res.data.attachedDocument9.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument9,
                documentType: res.data.attachedDocument9.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument10 != null) {
            doc.push({
                id: 10,
                filenm: res.data.attachedDocument10.split('/').pop().split("_").pop(),
                documentPath: res.data.attachedDocument10,
                documentType: res.data.attachedDocument10.split(".").pop().toUpperCase()
            })
        }
        setApplicationDoc(doc)
    }

    // payment modal close
    const handleCancel3 = () => {
        setIsOpenPayment(false)
    }

    // hearing modal close
    const handleCancel4 = () => {
        setHearingSchedule(false)
        showDisable(false)
    }

    // decision modal close
    const handleCancel5 = () => {
        setDecisionEntry(false)
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
                    if (res.status == 201) {
                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
                        getAppealDetails()
                        setIsOpenPayment(false)
                        sweetAlert(language=="en"?"Saved!":"जतन केले!", language=="en"?"Payment Done successful!":"पेमेंट यशस्वी झाले!", "success");
                    }
                    else {
                        sweetAlert(language=="en"?"Error!":"त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
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
                    if (res.status == 201) {
                        removeDocumentToLocalStorage("RTIAppealRelatedDocuments")
                        getAppealDetails()
                        setIsOpenPayment(false)
                        sweetAlert(language=="en"?"Saved!":"जतन केले!", language=="en"?"Payment Done successful!":"पेमेंट यशस्वी झाले!", "success");
                    }
                    else {
                        sweetAlert(language=="en"?"Error!":"त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
                    }
                });
        }
    }

    // decision submit
    const onSubmitDecision = (formData) => {
        const body = {
            ...hearingDetails,
            hearingTimeV3: hearingDetails.hearingTimeV3,
            decisionDetails: formData.decisionDetails,
            decisionStatus: formData.decisionStatus,
            remarks: formData.decisionRemarks,
            decisionOrderDocumentPath: document,
            informationDeliveredDocumentPath: document1,
            activeFlag: "Y",
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
                    if (res.status == 201) {
                        sweetAlert(language=="en"?"Saved!":"जतन केले!",language=="en"? "Decision Entry Successfully!":"निर्णय एंट्री यशस्वीरित्या जतन केली!", "success");
                        setDecisionEntry(false)
                        getAppealDetails()
                    }
                    else {
                        sweetAlert(language=="en"?"Error!":"त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
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
                    if (res.status == 201) {
                        sweetAlert(language=="en"?"Saved!":"जतन केले!",language=="en"? "Decision Entry Successfully!":"निर्णय एंट्री यशस्वीरित्या जतन केली!", "success");
                        setDecisionEntry(false)
                        getAppealDetails()
                    }
                    else {
                        sweetAlert(language=="en"?"Error!":"त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
                    }
                });
        }
    }

    // hearing submit
    const onSubmitHearing = (formData) => {
        const body = {
            ...formData,
            hearingDate: selectedDate,
            hearingTimeV3: selectedTime,
            appealKey: appealId,
            isRescheduled: dataSource.length != 0 ? true : false,
            remarks: dataSource.length != 0 ? formData.hearingRemark : "",
            id: dataSource.length != 0 ? hearingId : null
        }
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiHearing/save`, body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    if (res.status == 201) {
                        sweetAlert(language=="en"?"Saved!":"जतन केले!",language=="en"?"Hearing Scheduled Successfully!":"सुनावणी यशस्वीरित्या शेड्यूल झाली!", "success");
                        setHearingSchedule(false)
                        getAppealDetails()
                    }
                    else {
                        sweetAlert(language=="en"?"Error!":"त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
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
                        sweetAlert(language=="en"?"Saved!":"जतन केले!",language=="en"?"Hearing Scheduled Successfully!":"सुनावणी यशस्वीरित्या शेड्यूल झाली!", "success");
                        setHearingSchedule(false)
                        getAppealDetails()
                    }
                    else {
                        sweetAlert(language=="en"?"Error!":"त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
                    }
                });
        }
    }

    // complete status of appeal
    const updateCompleteStatus = () => {
        const body = {
            ...applications,
            selectedReturnMedia: watch("selectedReturnMedia2"),
            isComplete: "true",
            isApproved: false,
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
                        getAppealDetails()
                        sweetAlert(language=="en"?"Saved!":"जतन केले!",language=="en"?"RTI Appeal completed!":"आरटीआय अपील पूर्ण झाले!", "success");
                        router.push({
                            pathname: "/RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList",
                        })
                    }
                    else {
                        sweetAlert(language=="en"?"Error!":"त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
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
                        sweetAlert(language=="en"?"Saved!":"जतन केले!",language=="en"?"RTI Appeal completed!":"आरटीआय अपील पूर्ण झाले!", "success");
                        router.push({
                            pathname: "/RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList",
                        })
                    }
                    else {
                        sweetAlert(language=="en"?"Error!":"त्रुटी", language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!", "error");
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
                                    {authority && authority.find((val) => val === "RTI_APPEAL_ADHIKARI") && <><Grid
                                        item
                                        xl={8}
                                        lg={8}
                                        md={8}
                                        sm={12}
                                        xs={12}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <FormControl sx={{ width: "100% ", marginLeft: 10 }}>
                                            <FormLabel

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
                                    </Grid>

                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                        </Grid>
                                    </>}

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
                                            sx={{ width: 240 }}
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
                                        md={4}
                                        sm={12}
                                        xs={12}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",   
                                        }}
                                    >
                                        <TextField
                                            sx={{ width: 240 }}
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            id="standard-textarea"
                                            label={<FormattedLabel id="appealApplicationNo" />}
                                            multiline
                                            variant="standard"
                                            {...register("appealApplicationNo")}
                                            error={!!errors.applicationNo}
                                            helperText={
                                                errors?.applicationNo ? errors.applicationNo.message : null
                                            }
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        xl={4}
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {/* current status */}
                                        <TextField
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ width: 240 }}
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
                                    {/* applicant middle name */}
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
                                    </Grid> */}

                                    {/* applicant last name */}
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
                                    </Grid> */}

                                    {/* Address */}
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
                                    </Grid> */}

                                    {/* from Date */}
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
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ width: 230 }}
                                            id="standard-textarea"
                                            label={<FormattedLabel id="fromDate" />}
                                            multiline
                                            variant="standard"
                                            {...register("fromDate")}
                                            error={!!errors.fromDate}
                                            helperText={
                                                errors?.fromDate ? errors.fromDate.message : null
                                            }
                                        />
                                    </Grid> */}
                                    {/*  */}

                                    {/* to date */}
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
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ width: 230 }}
                                            id="standard-textarea"
                                            label={<FormattedLabel id="toDate" />}
                                            multiline
                                            variant="standard"
                                            {...register("toDate")}
                                            error={!!errors.toDate}
                                            helperText={
                                                errors?.toDate ? errors.toDate.message : null
                                            }
                                        />
                                    </Grid> */}
                                    {/*  */}
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
                                            label={<FormattedLabel id="requiredInfoPurpose" />}
                                            multiline
                                            variant="standard"
                                            {...register("informationPurpose")}
                                            error={!!errors.informationPurpose}
                                            helperText={
                                                errors?.informationPurpose ? errors.informationPurpose.message : null
                                            }
                                        />
                                    </Grid> */}

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
                                </Grid>

                                {/* download Aknowldgement */}
                                {((logedInUser === "citizenUser") || ((logedInUser === "departmentUser") && (authority && authority.find((val) => val !== "RTI_APPEAL_ADHIKARI")))) && (statusVal === 3) &&
                                    <><Grid
                                        xl={4}
                                        lg={4}
                                        md={6}
                                        sm={6}
                                        xs={12}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginBottom: 2

                                        }}>

                                        <Button
                                            // sx={{ marginRight: 8 }}
                                            // disabled={showSaveButton}
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            endIcon={<DownloadIcon />}
                                            style={{ borderRadius: "20px" }}
                                            size="small"
                                            onClick={() => {
                                                router.push({
                                                    pathname: "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                                                    query: { id: router.query.id },
                                                })
                                            }}
                                        >
                                            <FormattedLabel id="downloadAcknowldgement" />
                                        </Button>
                                    </Grid></>
                                }
                            </form>
                        </FormProvider>
                    </Box>
                    {(appealDoc.length != 0) && <div>
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2> <FormattedLabel id="RTIAppealdoc" /></h2>
                        </Box>
                        <DataGrid
                            autoHeight
                            sx={{
                                padding: "10px",
                                overflowY: "scroll",
                                "& .MuiDataGrid-virtualScrollerContent": {},
                                "& .MuiDataGrid-columnHeadersInner": {
                                    backgroundColor: "#556CD6",
                                    color: "white",
                                },

                                "& .MuiDataGrid-cell:hover": {
                                    color: "primary.main",
                                },
                            }}
                            density="standard"
                            pagination
                            paginationMode="server"
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            rows={appealDoc}
                            columns={docColumns}
                        />
                    </div>}
                    {authority && authority.find((val) => val === "RTI_APPEAL_ADHIKARI") && <div>
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

                        <Grid container sx={{ padding: "10px" }}>
                            {/* <Grid
                                item
                                xl={4}
                                lg={4}
                                md={4}
                                sm={12}
                                xs={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    // marginLeft:30
                                }}
                            >
                                <TextField
                                    sx={{ width: 240 }}
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    id="standard-textarea"
                                    label={<FormattedLabel id="applicationNo" />}
                                    multiline
                                    variant="standard"
                                    {...register("applicationNo")}
                                    error={!!errors.applicationNo}
                                    helperText={
                                        errors?.applicationNo ? errors.applicationNo.message : null
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
                                    label={<FormattedLabel id="applicantFirstName" />}
                                    multiline
                                    variant="standard"
                                    {...register("applicantFirstName")}
                                    error={!!errors.applicantFirstName}
                                    helperText={
                                        errors?.applicantFirstName ? errors.applicantFirstName.message : null
                                    }
                                />
                            </Grid> */}

                            {/* Applicant middle Name */}
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
                                    sx={{ width: 230 }}
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
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
                            </Grid> */}

                            {/* Applicant last name */}
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
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ width: 230 }}
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
                            </Grid> */}
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
                                    sx={{ width: 240 }}
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    id="standard-basic"
                                    label={<FormattedLabel id="applicantName" />}
                                    multiline
                                    variant="standard"
                                    {...register("applicantName")}

                                />
                            </Grid>
                            {/* Gender */}
                            <Grid item
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
                            ><TextField
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ width: 240 }}
                                    id="standard-textarea"
                                    label={<FormattedLabel id="gender" />}
                                    multiline
                                    variant="standard"
                                    {...register("gender")}
                                    error={!!errors.gender}
                                    helperText={
                                        errors?.gender ? errors.gender.message : null
                                    }
                                />
                            </Grid>

                            {/* Pincode */}
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
                                    sx={{ width: 240 }}
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    id="standard-textarea"
                                    label={<FormattedLabel id="pinCode" />}
                                    multiline
                                    variant="standard"
                                    {...register("pinCode")}
                                    error={!!errors.pinCode}
                                    helperText={
                                        errors?.pinCode ? errors.pinCode.message : null
                                    }
                                />
                            </Grid>

                            {/* Contact details */}
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
                                    sx={{ width: 240 }}
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    id="standard-textarea"
                                    label={<FormattedLabel id="contactDetails" />}
                                    multiline
                                    variant="standard"
                                    {...register("contactDetails")}
                                    error={!!errors.contactDetails}
                                    helperText={
                                        errors?.contactDetails ? errors.contactDetails.message : null
                                    }
                                />
                            </Grid>
                            {/* Email id */}
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
                                    label={<FormattedLabel id="emailId" />}
                                    id="standard-textarea"
                                    sx={{ width: 240 }}
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
                                        sx={{ width:240, marginTop: "25px" }}
                                        id='demo-row-radio-buttons-group-label'
                                    >
                                        {<FormattedLabel id='education' />}
                                    </FormLabel>

                                    <Controller
                                        disabled={true}
                                        InputLabelProps={{ shrink: true }}
                                        name='education'
                                        control={control}
                                        render={({ field }) => (
                                            <RadioGroup
                                                disabled={inputState}
                                                value={educationVal}
                                                // onChange={(value) => field.onChange(value)}
                                                selected={field.value}
                                                row
                                                aria-labelledby='demo-row-radio-buttons-group-label'
                                            >
                                                <FormControlLabel
                                                    value='Literate'
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
                                    sx={{ width: "88%" }}
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    id="standard-textarea"
                                    label={<FormattedLabel id="address" />}
                                    multiline
                                    variant="standard"
                                    {...register("address")}
                                    error={!!errors.address}
                                    helperText={
                                        errors?.address ? errors.address.message : null
                                    }
                                />
                            </Grid>



                            {/* area */}
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
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    label={<FormattedLabel id="areaKey" />}
                                    id="standard-textarea"
                                    sx={{ width: 240 }}
                                    variant="standard"
                                    {...register("areaKey")}
                                    error={!!errors.areaKey}
                                    helperText={
                                        errors?.areaKey ? errors.areaKey.message : null
                                    }
                                />
                            </Grid>

                            {/* ZOne*/}
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
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    label={<FormattedLabel id="zoneKey" />}
                                    id="standard-textarea"
                                    sx={{ width: 240 }}
                                    variant="standard"
                                    {...register("zoneKey")}
                                    error={!!errors.zoneKey}
                                    helperText={
                                        errors?.zoneKey ? errors.zoneKey.message : null
                                    }
                                />
                            </Grid>

                            {/* Ward */}
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
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    label={<FormattedLabel id="wardKey" />}
                                    id="standard-textarea"
                                    sx={{ width: 240 }}
                                    variant="standard"
                                    {...register("wardKey")}
                                    error={!!errors.wardKey}
                                    helperText={
                                        errors?.wardKey ? errors.wardKey.message : null
                                    }
                                />
                            </Grid>

                            {/* Department */}
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
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    label={<FormattedLabel id="departmentKey" />}
                                    id="standard-textarea"
                                    sx={{ width: 240 }}
                                    variant="standard"
                                    {...register("departmentKey")}
                                    error={!!errors.departmentKey}
                                    helperText={
                                        errors?.departmentKey ? errors.departmentKey.message : null
                                    }
                                />
                            </Grid>

                            {/* Sub department */}
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >

                                <TextField
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    label={<FormattedLabel id="subDepartmentKey" />}
                                    id="standard-textarea"
                                    sx={{ width: 240 }}
                                    variant="standard"
                                    {...register("subDepartmentKey")}
                                    error={!!errors.subDepartmentKey}
                                    helperText={
                                        errors?.subDepartmentKey ? errors.subDepartmentKey.message : null
                                    }
                                />
                            </Grid>

                            {/* is bpl radio button */}
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
                                        sx={{ width:240, marginTop: "25px" }}
                                        id='demo-row-radio-buttons-group-label'
                                    >
                                        {<FormattedLabel id='isApplicantBelowToPovertyLine' />}
                                    </FormLabel>

                                    <Controller
                                        disabled={true}
                                        InputLabelProps={{ shrink: true }}
                                        name='isApplicantBelowToPovertyLine'
                                        control={control}
                                        render={({ field }) => (

                                            <RadioGroup
                                                value={isBplval}
                                                selected={field.value}
                                                row
                                                aria-labelledby='demo-row-radio-buttons-group-label'
                                            >
                                                <FormControlLabel
                                                    value='true'
                                                    control={<Radio />}
                                                    label={<FormattedLabel id='yes' />}
                                                    error={!!errors.isApplicantBelowToPovertyLine}
                                                    helperText={
                                                        errors?.isApplicantBelowToPovertyLine ? errors.isApplicantBelowToPovertyLine.message : null
                                                    }
                                                />
                                                <FormControlLabel
                                                    value='false'
                                                    control={<Radio />}
                                                    label={<FormattedLabel id='no' />}
                                                    error={!!errors.isApplicantBelowToPovertyLine}
                                                    helperText={
                                                        errors?.isApplicantBelowToPovertyLine ? errors.isApplicantBelowToPovertyLine.message : null
                                                    }
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            {/* bpl card no */}
                            {isBplval ? <Grid
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
                                    sx={{ width: 240 }}
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
                            </Grid> : <></>}

                            {/* years of issues */}
                            {isBplval ? <Grid
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
                                    sx={{ width: 240 }}
                                    id="standard-textarea"
                                    label={<FormattedLabel id="yearOfIssues" />}
                                    multiline
                                    variant="standard"
                                    {...register("yearOfIssues")}
                                    error={!!errors.yearOfIssues}
                                    helperText={
                                        errors?.yearOfIssues ? errors.yearOfIssues.message : null
                                    }
                                />
                            </Grid> : <></>}

                            {/* issuing authority */}
                            {isBplval ? <Grid
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
                                    sx={{ width: 240 }}
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
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
                            </Grid> : <></>}

                            {/* delivery details i.e., by post, personally, soft copy */}
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
                                <FormControl sx={{ width: 240, marginTop: "10px", }}>
                                    <FormLabel
                                        // sx={{ width: "400px", marginTop: 3 }}
                                        id='demo-row-radio-buttons-group-label'
                                    >
                                        {<FormattedLabel id='requiredInfoDeliveryDetails' />}
                                    </FormLabel>

                                    <Controller
                                        disabled={true}
                                        InputLabelProps={{ shrink: true }}
                                        name='selectedReturnMedia'
                                        control={control}
                                        render={({ field }) => (
                                            <RadioGroup
                                                disabled={inputState}
                                                value={selectdeliveryDetails}
                                                // onChange={(value) => field.onChange(value)}
                                                selected={field.value}
                                                row
                                                aria-labelledby='demo-row-radio-buttons-group-label'
                                            >
                                                <FormControlLabel
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
                            {/*  */}

                            {/* from Date */}
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
                                    sx={{ width: 240 }}
                                    id="standard-textarea"
                                    label={<FormattedLabel id="fromDate" />}
                                    multiline
                                    variant="standard"
                                    {...register("fromDate")}
                                    error={!!errors.fromDate}
                                    helperText={
                                        errors?.fromDate ? errors.fromDate.message : null
                                    }
                                />
                            </Grid>
                            {/*  */}

                            {/* to date */}
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
                                    sx={{ width: 240 }}
                                    id="standard-textarea"
                                    label={<FormattedLabel id="toDate" />}
                                    multiline
                                    variant="standard"
                                    {...register("toDate")}
                                    error={!!errors.toDate}
                                    helperText={
                                        errors?.toDate ? errors.toDate.message : null
                                    }
                                />
                            </Grid>
                            {/*  */}

                            {/* description */}
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
                            {/*  */}

                            {(applications.isTransfer) && <Grid
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
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    id="standard-textarea"
                                    // label="Additional Information"
                                    label={<FormattedLabel id="forwardRemark" />}
                                    multiline
                                    variant="standard"
                                    {...register("forwardRemark")}
                                    error={!!errors.forwardRemark}
                                    helperText={
                                        errors?.forwardRemark ? errors.forwardRemark.message : null
                                    }
                                />
                            </Grid>}
                        </Grid>

                        {/* loi generate View */}

                        {(applicationDoc.length != 0) && <div>
                            <Box
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    paddingTop: "10px",
                                    background:
                                        "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                                }}
                            >
                                <h2> <FormattedLabel id="RTIApplicationdoc" /></h2>
                            </Box>
                            <DataGrid
                                autoHeight
                                sx={{
                                    padding: "10px",
                                    overflowY: "scroll",
                                    "& .MuiDataGrid-virtualScrollerContent": {},
                                    "& .MuiDataGrid-columnHeadersInner": {
                                        backgroundColor: "#556CD6",
                                        color: "white",
                                    },

                                    "& .MuiDataGrid-cell:hover": {
                                        color: "primary.main",
                                    },
                                }}
                                density="standard"
                                pagination
                                paginationMode="server"
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                rows={applicationDoc}
                                columns={docColumns}
                            />
                        </div>}

                        {loiDetails.length != 0 && <div>
                            <Box
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    paddingTop: "10px",
                                    background:
                                        "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                                }}
                            >
                                <h2> <FormattedLabel id="loiGenerate" /></h2>
                            </Box>
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
                                        sx={{ width: 240 }}
                                        InputLabelProps={{ shrink: true }}
                                        disabled={(statusVal === 4 || statusVal == 5 || statusVal == 11 || statusVal == 14) ? true : false}
                                        // onChange={onChangeRate}
                                        id="standard-textarea"
                                        label={<FormattedLabel id="noOfPages" />}
                                        multiline
                                        value={pageNo}
                                        variant="standard"
                                        // {...register1("noOfPages")}
                                        error={!!error2.noOfPages}
                                        helperText={
                                            error2?.noOfPages ? error2.noOfPages.message : null
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
                                        sx={{ width: 240, marginTop: "2%" }}
                                        variant="standard"
                                        error={!!error2.chargeTypeKey}
                                        disabled={true}
                                    >
                                        <InputLabel
                                            id="demo-simple-select-standard-label"
                                        >
                                            <FormattedLabel id="chargeType" />
                                        </InputLabel>
                                        <Controller
                                            render={({ field }) => (
                                                <Select
                                                    labelId="demo-simple-select-standard-label"
                                                    id="demo-simple-select-standard"
                                                    value={
                                                        field.value
                                                    }
                                                    {...register1("chargeTypeKey")}

                                                    onChange={(value) => {
                                                        field.onChange(value)
                                                        setChargeType(field.value)
                                                    }}
                                                >
                                                    {chargeTypeDetails &&
                                                        chargeTypeDetails.map((value, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                value={
                                                                    value?.id
                                                                }
                                                            >
                                                                {
                                                                    value?.serviceChargeType
                                                                }
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            )}
                                            name="chargeTypeKey"
                                            control={control2}
                                            defaultValue=""
                                        />
                                        <FormHelperText>
                                            {error2?.chargeTypeKey ? error2.chargeTypeKey.message : null}
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
                                        alignItems: "center", marginTop: 2
                                    }}
                                >
                                    <TextField
                                        label={<FormattedLabel id="ratePerPage" />}
                                        disabled={true}
                                        InputLabelProps={{ shrink: true }}

                                        id="standard-textarea"
                                        sx={{ width: 240 }}
                                        variant="standard"
                                        {...register1("amount")}
                                        error={!!error2.amount}
                                        helperText={
                                            error2?.amount ? error2.amount.message : null
                                        }
                                    />
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
                                        alignItems: "center", marginTop: 2
                                    }}>
                                    <TextField
                                        disabled={true}
                                        value={totalAmount}
                                        InputLabelProps={{ shrink: true }}
                                        label={<FormattedLabel id="totalAmount" />}
                                        id="standard-textarea"
                                        sx={{ width: 240 }}
                                        variant="standard"
                                        {...register1("totalAmount")}
                                        error={!!error2.totalAmount}
                                        helperText={
                                            error2?.totalAmount ? error2.totalAmount.message : null
                                        }
                                    />
                                </Grid>

                                <Grid item
                                    xl={8}
                                    lg={8}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center", marginTop: 2
                                    }}>
                                    <TextField
                                        disabled={true}
                                        label={<FormattedLabel id="remark" />}
                                        id="standard-textarea"
                                        sx={{ width: 640 }}
                                        variant="standard"
                                        InputLabelProps={{ shrink: true }}

                                        {...register1("remarks")}
                                        error={!!error2.remarks}
                                        helperText={
                                            error2?.remarks ? error2.remarks.message : null
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </div>}

                        {childDept.length != 0 &&
                            (<div>
                                <Box
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        paddingTop: "10px",
                                        background:
                                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                                    }}
                                >
                                    <h2><FormattedLabel id="childDeptTitle" /></h2>
                                </Box>
                                <DataGrid
                                    autoHeight
                                    sx={{
                                        padding: "10px",
                                        overflowY: "scroll",
                                        "& .MuiDataGrid-virtualScrollerContent": {},
                                        "& .MuiDataGrid-columnHeadersInner": {
                                            backgroundColor: "#556CD6",
                                            color: "white",
                                        },

                                        "& .MuiDataGrid-cell:hover": {
                                            color: "primary.main",
                                        },
                                    }}
                                    density="standard"
                                    pagination
                                    paginationMode="server"
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    rows={childDept}
                                    columns={childDeptColumns}
                                />
                            </div>)}
                        {/* header for user */}
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                // paddingTop: "10px",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2> <FormattedLabel id="applicationinfoReady" /></h2>
                        </Box>

                        <Box
                            sx={{
                                marginLeft: 5,
                                marginRight: 5,
                                padding: 1,
                            }}>
                            <Box >
                                <Grid container sx={{ padding: "10px" }}> <Grid
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
                                        label={<FormattedLabel id="informationRemark" />}
                                        multiline
                                        variant="standard"
                                        {...register("infoRemark")}
                                        error={!!errors.infoRemark}
                                        helperText={
                                            errors?.infoRemark ? errors.infoRemark.message : null
                                        }
                                    />
                                </Grid>
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
                                    }}>
                                    <TextField
                                        sx={{ width: "86%" }}
                                        disabled={true}
                                        InputLabelProps={{ shrink: true }}
                                        id="standard-textarea"
                                        label={<FormattedLabel id="completeRemark" />}
                                        multiline
                                        variant="standard"
                                        {...register("remarks")}
                                        error={!!errors.remarks}
                                        helperText={
                                            errors?.remarks ? errors.remarks.message : null
                                        }
                                    />
                                </Grid>

                                <Grid container sx={{ padding: "10px" }}>
                                    {applications.infoPages && <Grid
                                        item
                                        xl={4}
                                        lg={4}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <TextField
                                            label={<FormattedLabel id="noOfPages" />}
                                            id="standard-textarea"
                                            disabled={true}

                                            sx={{ width: 240 }}
                                            variant="standard"
                                            {...register("infoPages")}
                                            error={!!errors.infoPages}
                                            helperText={
                                                errors?.infoPages ? errors.infoPages.message : null
                                            }
                                        />
                                    </Grid>}
                                </Grid>
                                {/* information return media */}
                                <Grid container>
                                    <Grid
                                        item
                                        xl={4}
                                        lg={4}
                                        md={4}
                                        sm={12}
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
                                            sx={{ width: 240 }}
                                            id="standard-textarea"
                                            label={<FormattedLabel id="completeDate" />}
                                            multiline
                                            variant="standard"
                                            {...register("applicationDate")}
                                            error={!!errors.applicationDate}
                                            helperText={
                                                errors?.applicationDate ? errors.applicationDate.message : null
                                            }
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        xl={8}
                                        lg={8}
                                        md={8}
                                        sm={8}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <TextField
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ width: 240 }}
                                            id="standard-textarea"
                                            label={<FormattedLabel id="informationReturnMedia" />}
                                            multiline
                                            variant="standard"
                                            {...register("informationReturnMedia1")}
                                            error={!!errors.informationReturnMedia1}
                                            helperText={
                                                errors?.informationReturnMedia1 ? errors.informationReturnMedia1.message : null
                                            }
                                        />

                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        {(completeAttach.length != 0) && <div>
                            <DataGrid
                                autoHeight
                                sx={{
                                    margin: "10px",
                                    overflowY: "scroll",
                                    "& .MuiDataGrid-virtualScrollerContent": {},
                                    "& .MuiDataGrid-columnHeadersInner": {
                                        backgroundColor: "#556CD6",
                                        color: "white",
                                    },

                                    "& .MuiDataGrid-cell:hover": {
                                        color: "primary.main",
                                    },
                                }}
                                density="standard"
                                pagination
                                paginationMode="server"
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                rows={completeAttach}
                                columns={docColumns}
                            />
                        </div>}
                    </div>}


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
                            autoHeight
                            sx={{
                                marginTop: 2,
                                overflowY: "scroll",
                                "& .MuiDataGrid-virtualScrollerContent": {},
                                "& .MuiDataGrid-columnHeadersInner": {
                                    backgroundColor: "#556CD6",
                                    color: "white",
                                },
                                "& .MuiDataGrid-cell:hover": {
                                    color: "primary.main",
                                },
                            }}
                            density="density"
                            // pagination
                            // paginationMode="server
                            rowsPerPageOptions={[5]}
                            rows={dataSource}
                            columns={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") ? columns : columnsCitizen}
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
                                margin: 2
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


                    {/* <Box style={{ height: "30vh" }}> */}
                    {(statusVal === 11 || statusVal == 14) && <>
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2> <FormattedLabel id="decisionDetails" /></h2>
                        </Box>
                        <FormProvider {...methods2}>
                            <form>
                                <Grid container sx={{ padding: "10px" }}>
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
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ width: "84%" }}
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
                                        }}
                                    >
                                        <TextField
                                            sx={{ width: 240 }}
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
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
                                        }}
                                    >
                                        <TextField
                                            sx={{ width: 610 }}
                                            disabled={true}
                                            InputLabelProps={{ shrink: true }}
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

                                </Grid>
                            </form>
                        </FormProvider>

                        {authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") && <DataGrid
                            autoHeight
                            sx={{
                                marginTop: 2,
                                overflowY: "scroll",
                                "& .MuiDataGrid-virtualScrollerContent": {},
                                "& .MuiDataGrid-columnHeadersInner": {
                                    backgroundColor: "#556CD6",
                                    color: "white",
                                },
                                "& .MuiDataGrid-cell:hover": {
                                    color: "primary.main",
                                },
                            }}
                            density="standard"
                            // pagination
                            // paginationMode="server"
                            // rowCount={totalElements}
                            rowsPerPageOptions={[5]}
                            // pageSize={pageSize}
                            rows={decisionDetailsrow}
                            columns={docColumns}
                        />}
                    </>}
                    {/* </Box> */}

                    {((authority && authority.find((val) => val === "RTI_APPEAL_ADHIKARI") &&
                        (statusVal == 14 || statusVal == 11)) ||
                        ((logedInUser == "citizenUser" || (logedInUser == "departmentUser" &&
                            authority && authority.find((val) => val != "RTI_APPEAL_ADHIKARI"))) && statusVal == 11)
                    )
                        && <div>
                            <Box
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    paddingTop: "10px",
                                    background:
                                        "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                                }}
                            >
                                <h2> <FormattedLabel id="appealInfoReady" /></h2>
                            </Box>


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
                                        InputLabelProps={{ shrink: true }}
                                        name='selectedReturnMedia2'
                                        control={control}
                                        defaultValue=''
                                        {...register("selectedReturnMedia2")}
                                        render={({ field }) => (
                                            <RadioGroup
                                                value={(statusVal == 11) ? deliveryDetails1 : field.value}
                                                onChange={(value) => {
                                                    field.onChange(value)
                                                    console.log(value)
                                                }}
                                                selected={(statusVal == 14 && authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI")) ? field.value : deliveryDetails}
                                                row
                                                aria-labelledby='demo-row-radio-buttons-group-label'
                                            >
                                                <FormControlLabel
                                                    value='byPost'
                                                    // disabled={inputState}
                                                    control={<Radio size='small' />}
                                                    label={<FormattedLabel id='byPost' />}
                                                    error={!!errors.selectedReturnMedia2}
                                                    helperText={
                                                        errors?.selectedReturnMedia2 ? errors.selectedReturnMedia2.message : null
                                                    }
                                                    {...register("selectedReturnMedia2")}

                                                />
                                                <FormControlLabel
                                                    value='byHand'
                                                    // disabled={inputState}
                                                    control={<Radio size='small' />}
                                                    label={<FormattedLabel id='byHand' />}
                                                    error={!!errors.selectedReturnMedia2}
                                                    helperText={
                                                        errors?.selectedReturnMedia2 ? errors.selectedReturnMedia2.message : null
                                                    }
                                                    {...register("selectedReturnMedia2")}

                                                />
                                                <FormControlLabel
                                                    value='softCopy'
                                                    // disabled={inputState}
                                                    control={<Radio size='small' />}
                                                    label={<FormattedLabel id='softCopy' />}
                                                    error={!!errors.selectedReturnMedia2}
                                                    helperText={
                                                        errors?.selectedReturnMedia2 ? errors.selectedReturnMedia2.message : null
                                                    }
                                                    {...register("selectedReturnMedia2")}

                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            {(logedInUser == "citizenUser" || (logedInUser == "departmentUser" &&
                            authority && authority.find((val) => val != "RTI_APPEAL_ADHIKARI") && statusVal==10))&& <DataGrid
                            autoHeight
                            sx={{
                                marginTop: 2,
                                overflowY: "scroll",
                                "& .MuiDataGrid-virtualScrollerContent": {},
                                "& .MuiDataGrid-columnHeadersInner": {
                                    backgroundColor: "#556CD6",
                                    color: "white",
                                },
                                "& .MuiDataGrid-cell:hover": {
                                    color: "primary.main",
                                },
                            }}
                            density="standard"
                            // pagination
                            // paginationMode="server"
                            // rowCount={totalElements}
                            rowsPerPageOptions={[5]}
                            // pageSize={pageSize}
                            rows={decisionDetailsrow}
                            columns={docColumns}
                        />}

                            {(statusVal === 14) && (<Grid item
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
                                    sx={{ marginRight: 8 }}
                                    variant="contained"
                                    color="primary"
                                    style={{ borderRadius: "20px" }}
                                    size="small"
                                    endIcon={<CheckIcon />}
                                    onClick={() => updateCompleteStatus()}
                                >
                                    <FormattedLabel id="completeAppeal" />
                                </Button>
                            </Grid>)}
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
                scrollable={true}
                title="Modal For Hearing Schedule"
                open={isHearingSchedule}
                onClose={handleCancel4}
                // footer=""
                // sx={{
                //     padding: 5,
                //     display: "flex",
                //     justifyContent: "center",
                //     height: "100%",
                // }}
                style={{

                    maxheight: "85%",
                    margin: "50px",
                    // marginbottom: "50px",
                }}
            >
                <Box
                    sx={{
                        overflowY: "scroll",
                        width: "90%",
                        marginLeft: "5%",
                        marginRight: "10%",
                        backgroundColor: "white",
                        // height: "100%",
                    }}
                >
                    <Box >
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
                                            xl={6}
                                            lg={6}
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
                                                sx={{ width: "80%" }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicationNo" />}
                                                multiline
                                                variant="standard"
                                                {...register("appealApplicationNo")}
                                                error={!!error2.applicationNo}
                                                helperText={
                                                    error2?.applicationNo ? error2.applicationNo.message : null
                                                }
                                            />
                                        </Grid>
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
                                            <TextField
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ width: "80%" }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicantName" />}
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
                                                sx={{ width: "90%" }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="description" />}
                                                multiline
                                                variant="standard"
                                                {...register1("description")}
                                                error={!!error2.description}
                                                helperText={
                                                    error2?.description ? error2.description.message : null
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
                                                style={{ backgroundColor: "white", minWidth: "80%" }}
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
                                                                disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI" && (hearingDetails.status != 11 && hearingDetails.status != 9)) ? false : true}
                                                                value={selectedDate}
                                                                onDateChange={handleDateChange}
                                                                selected={field.value}


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
                                                style={{ marginTop: 10, minWidth: "80%" }}
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
                                                                id="standard-textarea"
                                                                disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI" && (hearingDetails.status != 11 && hearingDetails.status != 9)) ? false : true}
                                                                // value={field.value}
                                                                value={selectedTime}
                                                                // onChange={e => handleTimeChange(e.target.value)}
                                                                {...register1("hearingTime")}
                                                                label={
                                                                    <span style={{ fontSize: 16 }}>
                                                                        {<FormattedLabel id="scheduleTime" />}
                                                                    </span>
                                                                }
                                                                onChange={
                                                                    // field.onChange(time)
                                                                    handleTimeChange
                                                                }
                                                                // selected={hearingTimeVal}
                                                                renderInput={(params) => (
                                                                    <TextField
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
                                                disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI" && (hearingDetails.status != 11 && hearingDetails.status != 9)) ? false : true}

                                                InputLabelProps={{ shrink: true }}
                                                sx={{ width: "80%", marginTop: 2 }}
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
                                                alignItems: "center",
                                            }}>
                                            <TextField
                                                label={<FormattedLabel id="remark" />}
                                                id="standard-textarea"
                                                sx={{ width: "90%", marginTop: 2 }}
                                                variant="standard"
                                                disabled={authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI" && (hearingDetails.status != 11 && hearingDetails.status != 9)) ? false : true}
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

                                            {((dataSource.length != 0 && dataSource.length != 3) &&
                                                (authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI")) &&
                                                (hearingDetails.status != 11 && hearingDetails.status !== 9)) &&
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


                                            {(authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI" && (hearingDetails.status !== 11 && hearingDetails.status !== 9)) && (dataSource.length != 0)
                                            ) &&
                                                <Grid item
                                                    xl={dataSource.length == 3 ? 6 : 4}
                                                    lg={dataSource.length == 3 ? 6 : 4}
                                                    md={dataSource.length == 3 ? 6 : 4}
                                                    sm={dataSource.length == 3 ? 6 : 4}
                                                    xs={dataSource.length == 3 ? 6 : 4} sx={{
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




                                            <Grid item
                                                xl={((authority && authority.find((val) => val == "RTI_APPEAL_ADHIKARI") && (hearingDetails.status == 11 || hearingDetails.status == 9))) ? 12 : 4}
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
                style={{

                    maxheight: "70%",
                    margin: "50px",
                    // marginbottom: "50px",
                }}
            >
                <Box
                    sx={{
                        overflowY: "scroll",
                        backgroundColor: "white",
                        height: "70vh",
                    }}
                >
                    <Box >
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
                                                sx={{ width: 240 }}
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
                                                sx={{ width: 240 }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicationNo" />}
                                                multiline
                                                variant="standard"
                                                {...register("appealApplicationNo")}
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

                                                sx={{ width: 240 }}
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
                                                sx={{ width: 240 }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="decisionStatus" />}
                                                // mult iline
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
                                                {...register2("decisionRemarks")}
                                                error={!!error3.decisionRemarks}
                                                helperText={
                                                    error3?.decisionRemarks ? error3.decisionRemarks.message : null
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



