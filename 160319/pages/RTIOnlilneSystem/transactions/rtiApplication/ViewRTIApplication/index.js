import {
    Box,
    Link,
    FormLabel,
    Radio,
    RadioGroup,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    Button,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextareaAutosize,
    TextField,
    ThemeProvider,
    IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Delete, Visibility } from "@mui/icons-material"

import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import PaymentsIcon from '@mui/icons-material/Payments';
import DownloadIcon from "@mui/icons-material/Download"
import PrintIcon from '@mui/icons-material/Print';
import theme from "../../../../../theme"
import CheckIcon from '@mui/icons-material/Check';
import PreviewIcon from '@mui/icons-material/Preview';
import {
    getDocumentFromLocalStorage,
    removeDocumentToLocalStorage,
} from "../../../../../components/redux/features/RTIOnlineSystem/rtiOnlineSystem"
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import RTIDocument from "../../../Document/RTIDocument.js";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel.js";
// import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/connectionEntrySchema";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import trnRtiApplicationSchema from "../../../../../containers/schema/rtiOnlineSystemSchema/trnRtiApplicationSchema.js";
import urls from "../../../../../URLS/urls.js";
import { useDispatch, useSelector } from "react-redux";
import loiGeneratedSchema from "../../../../../containers/schema/rtiOnlineSystemSchema/loiGeneratedSchema.js";
import UploadButton from "../../../../../components/fileUpload/UploadButton";

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
    const [pageNo, setPageNo] = useState()
    const [amount, setRatePerPage] = useState(null)
    const [totalAmount, setTotalAmt] = useState(null)

    const onChangeRate = (event) => {
        setTotalAmt(null)
        setPageNo(event.target.value)
        if (event.target.value <= 20) {
            sweetAlert("No of pages should be greater than 20!");
        } else {
            setTotalAmt(event.target.value * amount)
        }
    }

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
        resolver: yupResolver(loiGeneratedSchema),
    })
    const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false)
    const [chargeTypeVal, setChargeType] = useState(null)
    const [genderVal, setGender] = useState(null)
    const [educationVal, setEducation] = useState(null)
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
    const dispatch = useDispatch();
    const inputState = getValues("inputState");
    const entryConnectionData = useSelector((state) => state.user.entryConnectionData);
    const [wards, setWards] = useState([]);
    const [deptId, setDeptId] = useState(null)
    const [subDepartments, setSubDepartmentList] = useState([])
    const [applications, setApplicationDetails] = useState([])
    const [deliveryDetails, setDeliveryDetails] = useState(null)
    const [selectdeliveryDetails, setSelectedDeliveryDetails] = useState(null)
    const [document, setDocument] = useState()
    const [isLoiGenerated, setLOIGenerated] = useState(false)
    const [isBplval, setIsBpl] = useState(null)
    const [appReceievedDetails, setApplicationReceivedDetails] = useState(null)
    const [statusVal, setStatusVal] = useState(null)
    const [genderDetails, setGenderDetails] = useState([])
    const [serviceDetails, setServiceDetails] = useState([])
    const [chargeTypeDetails, setChargeTypeDetails] = useState([])
    const [isOpenPayment, setIsOpenPayment] = useState(false)
    let user = useSelector((state) => state.user.user)
    const [loiDetails, setLoiDetails] = useState([])
    const [applicationId, setApplicationID] = useState(null)
    const [dataSource, setDataSource] = useState([])
    const [completeAttach, setCompleteAttach] = useState([])
    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")

    );
    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    const logedInUser = localStorage.getItem("loggedInUser")


    const docColumns = [
        {
            field: "id",
            headerName: "Sr No.",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "documentPath",
            headerName: "File Name",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "documentType",
            headerName: "File Type",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },

        {
            field: "Action",
            headerName: "Actions",
            headerAlign: "center",
            align: "center",
            flex: 1,
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

    useEffect(() => {
        getZone()
        getWards()
        getDepartments()
        getSubDepartmentDetails()
        getGenders()
    }, []);


    useEffect(() => {
    }, [watch("noOfPages")])

    useEffect(() => {
        getApplicationById()

    }, []);

    const handleCancel = () => {
        setIsModalOpenForResolved(false)
        setValue("isLOIGenerated", "false")
        setLOIGenerated(false)
        setTotalAmt(null)
    }

    const handleCancel3 = () => {
        setIsOpenPayment(false)
    }


    const loiGenerated = () => {
        setLOIOpen(true)
    }

    const handleCancel1 = () => {
        setLOIOpen(false)
    }

    useEffect(() => {
        getService()
    }, []);

    useEffect(() => {
        getChargeType()
        getChargeTypes()
    }, []);

    const getService = () => {
        axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
            setServiceDetails(
                r.data.service.map((row) => ({
                    id: row.id,
                    serviceName: row.serviceName,
                }))
            );
        });
    };

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

    const getChargeTypes = () => {
        axios.get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=103`).then((r) => {
            setRatePerPage(r.data.serviceCharge[0].serviceChargeType)
            setValue1("amount", r.data.serviceCharge[0].serviceChargeType)
        });
    };

    useEffect(() => {
        if (watch("isLOIGenerated") === "true") {
            setIsModalOpenForResolved(true)
        } else {
            setIsModalOpenForResolved(false)
        }
    }, [watch("isLOIGenerated")]);

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

    const getLoi = (aa) => {
        if (logedInUser === "citizenUser") {
            axios.get(`${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${aa}`, {
                headers: {
                    UserId: user.id
                }
            }).then((res) => {
                if (res.data.trnAppealLoiList.length != 0) {
                    setLOIDetails(res)
                }
            });
        } else {
            axios.get(`${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${aa}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }).then((res) => {
                if (res.data.trnAppealLoiList.length != 0) {
                    setLOIDetails(res)
                }
            });
        }
        // }
    }

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

    const getApplicationById = () => {
        if (router.query.id) {
            if (logedInUser === "citizenUser") {
                axios.get(`${urls.RTI}/trnRtiApplication/searchByApplicationNumber?applicationNumber=${router.query.id}`, {
                    headers: {
                        UserId: user.id
                    }
                },).then((res) => {
                    setRtiApplication(res)
                })
            } else {
                axios.get(`${urls.RTI}/trnRtiApplication/searchByApplicationNumber?applicationNumber=${router.query.id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                },).then((res) => {
                    setRtiApplication(res)
                })
            }
        }
    }

    const setRtiApplication = (res) => {
        setApplicationDetails(res.data)
        setApplicationID(res.data?.id)
        getLoi(res.data?.id)
        setValue("applicantFirstName", res.data?.applicantFirstName)
        setValue1("applicantFirstName", res.data?.applicantFirstName + " " + res.data?.applicantMiddleName + " " + res.data?.applicantLastName)
        setValue1("serviceName", "RTI")
        setValue("applicantMiddleName", res.data?.applicantMiddleName)
        setValue("applicantLastName", res.data?.applicantLastName)
        setValue("address", res.data?.address)
        setValue("gender", genderDetails?.find((obj) => { return obj.id == res.data?.gender }) ? genderDetails.find((obj) => { return obj.id == res.data?.gender }).gender : "-")
        setGender(res.data?.gender)
        setValue("pinCode", res.data?.pinCode)
        setValue("contactDetails", res.data?.contactDetails)
        setValue1("applicationNo", res.data?.applicationNo)
        setValue("emailId", res.data?.emailId)
        setEducation(res.data?.education)
        setValue("zoneKey", zoneDetails?.find((obj) => { return obj.id == res.data?.zoneKey }) ? zoneDetails.find((obj) => { return obj.id == res.data?.zoneKey }).zoneName : "-",)
        setDeptId(res.data?.departmentKey)
        setValue("wardKey", wards?.find((obj) => { return obj.id == res.data?.wardKey }) ? wards.find((obj) => { return obj.id == res.data.wardKey }).wardName : "-",)
        setValue("departmentKey", departments?.find((obj) => { return obj.id == res.data?.departmentKey }) ? departments.find((obj) => { return obj.id == res.data.departmentKey }).department : "-")
        setValue("subDepartmentKey", subDepartments?.find((obj) => { return obj.id == res.data?.subDepartmentKey }) ? subDepartments.find((obj) => { return obj.id == res.data.subDepartmentKey }).subDepartment : "-")
        setIsBpl(res.data?.isBpl)
        setValue("bplCardNo", res.data?.bplCardNo)
        setValue("yearOfIssues", res.data?.bplCardIssueYear)
        setValue("informationSubject", res.data?.subject)
        setValue("issuingAuthority", res.data?.bplCardIssuingAuthority)
        setValue("remarks", res.data?.remarks)
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
        setDeliveryDetails(res.data?.informationReturnMedia)
        setSelectedDeliveryDetails(res.data?.selectedReturnMedia)
        setValue("description", res.data?.description)
        setApplicationReceivedDetails(res.data?.createdUserType == 1 ? "citizenuser" :
            res.data?.createdUserType == 2 ? "cfcuser" :
                res.data?.createdUserType == 3 ? "pcmcportal" :
                    res.data?.createdUserType == 4 ? "aaplesarkar" : "")
        setStatusVal(res.data.status)
        setValue("infoPages", res.data?.infoPages),
            setValue("infoRemark", res.data?.infoAvailableRemarks),
            setValue("status", res.data.status == 2 ? "Send For Payment"
                : res.data.status == 3 ? "In Progress"
                    : res.data.status == 4 ? "LOI Generated"
                        : res.data.status == 5 ? "Payment Received"
                            : res.data.status == 6 ? "Send to Applete Officer"
                                : res.data.status == 7 ? "Hearing Scheduled"
                                    : res.data.status == 8 ? "Hearing Rescheduled"
                                        : res.data.status == 9 ? "Decision Done"
                                            : res.data.status == 11 ? "Complete"
                                                : res.data.status == 12 ? "Close"
                                                    : res.data.status == 14 ? "Information Ready" : "",)

        const doc = []
        if (res.data.attachedDocument1 != null) {
            doc.push({
                id: 1,
                documentPath: res.data.attachedDocument1,
                documentType: res.data.attachedDocument1.split(".").pop().toUpperCase()
            });
        }
        if (res.data.attachedDocument2 != null) {
            doc.push({
                id: 2,
                documentPath: res.data.attachedDocument2,
                documentType: res.data.attachedDocument2.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument3 != null) {
            doc.push({
                id: 3,
                documentPath: res.data.attachedDocument3,
                documentType: res.data.attachedDocument3.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument4 != null) {
            doc.push({
                id: 4,
                documentPath: res.data.attachedDocument4,
                documentType: res.data.attachedDocument4.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument5 != null) {
            doc.push({
                id: 5,
                documentPath: res.data.attachedDocument5,
                documentType: res.data.attachedDocument5.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument6 != null) {
            doc.push({
                id: 6,
                documentPath: res.data.attachedDocument6,
                documentType: res.data.attachedDocument6.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument7 != null) {
            doc.push({
                id: 7,
                documentPath: res.data.attachedDocument7,
                documentType: res.data.attachedDocument7.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument8 != null) {
            doc.push({
                id: 8,
                documentPath: res.data.attachedDocument8,
                documentType: res.data.attachedDocument8.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument9 != null) {
            doc.push({
                id: 9,
                documentPath: res.data.attachedDocument9,
                documentType: res.data.attachedDocument9.split(".").pop().toUpperCase()
            })
        }
        if (res.data.attachedDocument10 != null) {
            doc.push({
                id: 10,
                documentPath: res.data.attachedDocument10,
                documentType: res.data.attachedDocument10.split(".").pop().toUpperCase()
            })
        }
        const completeDoc = []
        if (res.data.attachedDocumentPath != null) {
            completeDoc.push({
                id: 1,
                documentPath: res.data.attachedDocumentPath,
                documentType: res.data.attachedDocumentPath.split(".").pop().toUpperCase()
            })
            setCompleteAttach(completeDoc)
        }

        setDataSource(doc)
    }

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

    const getSubDepartmentDetails = () => {
        axios
            .get(
                `${urls.RTI}/master/subDepartment/getAllByDeptWise/${deptId}`
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

    const updateCompleteStatus = () => {
        const fileObj = {
            documentPath: "",
            mediaKey: 1,
            mediaType: "image",
            remark: "rem 1"
        }
        if (watch("remarks")) {
            const body = {
                id: applicationId,
                activeFlag: "Y",
                ...applications,
                remarks: watch("remarks"),
                informationReturnMedia: watch("informationReturnMedia"),
                attachedDocumentPath: document,
                isComplete: "true",
                isApproved: false,
            }
            if (logedInUser === "citizenUser") {
                const tempData = axios
                    .post(`${urls.RTI}/trnRtiApplication/save`,
                        body, {
                        headers: {
                            UserId: user.id
                        },
                    })
                    .then((res) => {
                        console.log("res", res);
                        if (res.status == 201) {
                            removeDocumentToLocalStorage("RTIRelatedDocuments")
                            getApplicationById()
                            sweetAlert("Saved!", "RTI Application Complete successfully !", "success");
                        }
                        else {
                            sweetAlert("Error!", "Something Went Wrong !", "error");
                        }
                    });
            } else {
                const tempData = axios
                    .post(`${urls.RTI}/trnRtiApplication/save`,
                        body, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((res) => {
                        console.log("res", res);
                        if (res.status == 201) {
                            removeDocumentToLocalStorage("RTIRelatedDocuments")
                            getApplicationById()
                            sweetAlert("Saved!", "RTI Application Complete successfully !", "success");
                        }
                        else {
                            sweetAlert("Error!", "Something Went Wrong !", "error");
                        }
                    });
            }
        } else {

        }
    }

    const updateInfoReady = () => {
        if (watch("infoRemark")) {
            const body = {
                id: applicationId,
                activeFlag: "Y",
                ...applications,
                infoPages: watch("infoPages"),
                infoAvailableRemarks: watch("infoRemark"),
                isComplete: "true",
                isApproved: false,
            }
            if (logedInUser === "citizenUser") {
                const tempData = axios
                    .post(`${urls.RTI}/trnRtiApplication/save`,
                        body, {
                        headers: {
                            UserId: user.id
                        },
                    })
                    .then((res) => {
                        console.log("res", res);
                        if (res.status == 201) {
                            removeDocumentToLocalStorage("RTIRelatedDocuments")
                            getApplicationById()
                            sweetAlert("Saved!", "Record Saved successfully !", "success");
                        }
                        else {
                            sweetAlert("Error!", "Something Went Wrong !", "error");
                        }
                    });
            } else {
                const tempData = axios
                    .post(`${urls.RTI}/trnRtiApplication/save`,
                        body, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((res) => {
                        console.log("res", res);
                        if (res.status == 201) {
                            removeDocumentToLocalStorage("RTIRelatedDocuments")
                            getApplicationById()
                            sweetAlert("Saved!", "Record Saved successfully !", "success");
                        }
                        else {
                            sweetAlert("Error!", "Something Went Wrong !", "error");
                        }
                    });
            }
        } else {

        }
    }

    const changePaymentStatus = () => {
        const body = {
            id: applicationId,
            activeFlag: "Y",
            ...applications,
            isApproved: false,
            isComplete: false,
        }
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`,
                    body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        removeDocumentToLocalStorage("RTIRelatedDocuments")
                        getApplicationById()
                        setIsOpenPayment(false)
                        sweetAlert("Saved!", "Payment Done successful!", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`,
                    body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        removeDocumentToLocalStorage("RTIRelatedDocuments")
                        getApplicationById()
                        setIsOpenPayment(false)
                        sweetAlert("Saved!", "Payment Done successfully !", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    }

    const onSubmitForm = (formData) => {
        console.log("formData ", formData);
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
            informationReturnMedia,
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
        console.log("body", body);
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnRtiApplication/save`, body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        removeDocumentToLocalStorage("RTIRelatedDocuments")
                        router.push('/RTIOnlilneSystem/transactions/rtiApplication/rtiApplicationList')
                        sweetAlert("Saved!", "Record Saved successfully !", "success");
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
                        removeDocumentToLocalStorage("RTIRelatedDocuments")
                        router.push('/RTIOnlilneSystem/transactions/rtiApplication/rtiApplicationList')
                        sweetAlert("Saved!", "Record Saved successfully !", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    };

    const OnSubmitloiGenerated = (formData) => {
        const body = {
            ...formData,
            noOfPages: pageNo,
            totalAmount: totalAmount,
            applicationKey: applicationId
        }
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnAppealLoi/save`, body, {
                    headers: {
                        UserId: user.id
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        resetLOI()
                        sweetAlert("Saved!", "LOI Generated Successfully!", "success");
                        setIsModalOpenForResolved(false)
                        getApplicationById()
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnAppealLoi/save`, body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        resetLOI()
                        sweetAlert("Saved!", "LOI Generated Successfully!", "success");
                        setIsModalOpenForResolved(false)
                        getApplicationById()
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    }

    const loiPayment = () => {
        const body = {
            activeFlag: "Y",
            isComplete: false,
            isApproved: false,
            ...loiDetails,
        }
        if (logedInUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.RTI}/trnAppealLoi/save`, body, {
                    headers: {
                        UserId: user.id
                    }
                },)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        removeDocumentToLocalStorage("RTIRelatedDocuments")
                        sweetAlert("Saved!", "LOI Payment Successful!", "success");
                        setIsModalOpenForResolved(false)
                        getApplicationById()
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.RTI}/trnAppealLoi/save`, body, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                },)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        removeDocumentToLocalStorage("RTIRelatedDocuments")
                        sweetAlert("Saved!", "LOI Payment Successful!", "success");
                        setIsModalOpenForResolved(false)
                        getApplicationById()
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                }); 0
        }
    }

    const resetLOI = () => {
        const resetField = {
            applicationNo: "",
            applicantFirstName: "",
            serviceName: "",
            amount: "",
            noOfPages: "",
            chargeType: "",
            totalAmount: "",
        }
    }

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
                        marginBottom: 5,
                        marginRight: "10px",
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
                        <h2> <FormattedLabel id="ViewrtiApplication" /></h2>
                    </Box>

                    <Divider />
                    <Box
                        sx={{
                            marginLeft: 5,
                            marginRight: 5,
                            padding: 1,
                        }}>
                        <Box >
                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <Grid container sx={{ padding: "10px" }}>

                                        {/* Application received by */}
                                        {authority && authority.find((val) => val === "RTI_ADHIKARI") && <Grid
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

                                        {/* Applicant first Name */}
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
                                        </Grid>

                                        {/* Applicant middle Name */}
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
                                        </Grid>

                                        {/* Applicant last name */}
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
                                                sx={{ width: 230 }}
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
                                                sx={{ width: 230 }}
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
                                                sx={{ width: 230 }}
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
                                                sx={{ width: 230 }}
                                                variant="standard"
                                                {...register("emailId")}
                                                error={!!errors.emailId}
                                                helperText={
                                                    errors?.emailId ? errors.emailId.message : null
                                                }
                                            />
                                        </Grid>

                                        {/* Education */}
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
                                                    sx={{ width: "230px", marginTop: "25px" }}
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
                                                                value='educated'
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
                                                sx={{ width: 230 }}
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
                                                sx={{ width: 230 }}
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
                                                sx={{ width: 230 }}
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
                                                sx={{ width: 230 }}
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
                                                    sx={{ width: "230px", marginTop: "25px" }}
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
                                                sx={{ width: 230 }}
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
                                                sx={{ width: 230 }}
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

                                        {/* Info SUbject */}
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
                                                sx={{ width: 590 }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
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
                                        {/*  */}

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
                                            <FormControl sx={{ width: 230, marginTop: "10px", }}>
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
                                                                value='personally'
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

                    </Box>

                    {(dataSource.length != 0) && <div>
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2> <FormattedLabel id="documents" /></h2>
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
                            rows={dataSource}
                            columns={docColumns}
                        />
                    </div>}

                    {!isBplval && ((authority && authority.find((val) => val === "RTI_ADHIKARI")) && statusVal == 3) ? (
                        <Grid
                            item
                            xl={4}
                            lg={4}
                            md={8}
                            sm={6}
                            xs={6}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: 10
                            }}
                        >
                            <FormControl flexDirection='row'>
                                <FormLabel
                                    sx={{ width: 230, marginTop: "15px", }}
                                    id='demo-row-radio-buttons-group-label'
                                >
                                    {<FormattedLabel id='isLOIGenerated' />}
                                </FormLabel>

                                <Controller
                                    name='isLOIGenerated'
                                    control={control}

                                    defaultValue=''
                                    {...register("isLOIGenerated")}
                                    render={({ field }) => (
                                        <RadioGroup

                                            value={field.value}
                                            onChange={(value) => {
                                                field.onChange(value)
                                            }}
                                            selected={field.value}
                                            row
                                            aria-labelledby='demo-row-radio-buttons-group-label'
                                        >
                                            <FormControlLabel
                                                value={"true"}
                                                {...register("isLOIGenerated")}
                                                control={<Radio />}
                                                label={<FormattedLabel id='yes' />}
                                                error={!!errors.isLOIGenerated}
                                                helperText={
                                                    errors?.isLOIGenerated ? errors.isLOIGenerated.message : null
                                                }
                                            />
                                            <FormControlLabel
                                                value={"false"}
                                                {...register("isLOIGenerated")}
                                                control={<Radio />}
                                                label={<FormattedLabel id='no' />}
                                                error={!!errors.isLOIGenerated}
                                                helperText={
                                                    errors?.isLOIGenerated ? errors.isLOIGenerated.message : null
                                                }
                                            />
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </Grid>) : ("")}
                    {(statusVal === 5 || ((statusVal === 4) &&
                        ((logedInUser !== "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (logedInUser != "citizenUser"))) || statusVal === 11 || statusVal == 14) && <div>
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
                                        sx={{ width: 230 }}
                                        disabled={(statusVal === 4 || statusVal == 5 || statusVal == 11 || statusVal == 14) ? true : false}
                                        onChange={onChangeRate}
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
                                        sx={{ width: "230px", marginTop: "2%" }}
                                        variant="standard"
                                        error={!!error2.chargeTypeKey}
                                        disabled={(statusVal === 4 || statusVal == 5 || statusVal == 11 || statusVal == 14) ? true : false}
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
                                        id="standard-textarea"
                                        sx={{ width: 230 }}
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
                                        // value={totalAmount}
                                        sx={{ width: 230 }}
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
                                        disabled={(statusVal === 4 || statusVal == 5 || statusVal == 11 || statusVal == 14) ? true : false}
                                        label={<FormattedLabel id="remark" />}
                                        id="standard-textarea"
                                        sx={{ width: 640 }}
                                        variant="standard"
                                        {...register1("remarks")}
                                        error={!!error2.remarks}
                                        helperText={
                                            error2?.remarks ? error2.remarks.message : null
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </div>}

                    {/* Header for RTI Adhikari */}
                    {((authority && authority.find((val) => val === "RTI_ADHIKARI")) && (((watch("isLOIGenerated") === "false" || isBplval) && statusVal === 3) || statusVal === 14 || statusVal === 11 || statusVal === 5)) && <Box
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            // paddingTop: "10px",
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    > <h2> <FormattedLabel id="infoReady" /></h2>
                    </Box>}

                    {/* header for user */}
                    {((logedInUser === "citizenUser") || ((logedInUser === "departmentUser") && (authority && authority.find((val) => val != "RTI_ADHIKARI")))) && (statusVal === 14 || statusVal === 11) && <Box
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            // paddingTop: "10px",
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    >
                        <h2> <FormattedLabel id="infoReady" /></h2>
                    </Box>}

                    <Box
                        sx={{
                            marginLeft: 5,
                            marginRight: 5,
                            padding: 1,
                        }}>
                        <Box >
                            <Grid container sx={{ padding: "10px" }}>
                                {/* information remark */}
                                {((authority && authority.find((val) => val === "RTI_ADHIKARI") && (((watch("isLOIGenerated") === "false" || isBplval) && statusVal === 3) || statusVal === 5)) ||
                                    (statusVal == 11 || statusVal == 14)) &&
                                    <Grid
                                        item
                                        xl={(authority && authority.find((val) => val === "RTI_ADHIKARI")) ? 12 : 8}
                                        lg={(authority && authority.find((val) => val === "RTI_ADHIKARI")) ? 12 : 8}
                                        md={(authority && authority.find((val) => val === "RTI_ADHIKARI")) ? 12 : 8}
                                        sm={(authority && authority.find((val) => val === "RTI_ADHIKARI")) ? 12 : 6}
                                        xs={(authority && authority.find((val) => val === "RTI_ADHIKARI")) ? 12 : 6}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <TextField
                                            sx={{ width: (authority && authority.find((val) => val === "RTI_ADHIKARI")) ? "88%" : 600 }}
                                            disabled={(statusVal === 14 || statusVal === 11) ? true : false}
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
                                    </Grid>}

                                {/* information ready date */}
                                {(statusVal === 11 || statusVal == 14) && ((logedInUser === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (logedInUser === "citizenUser")) && <Grid
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
                                        label={statusVal == 14 ? <FormattedLabel id="infoReadyDate" /> : <FormattedLabel id="completeDate" />}
                                        multiline
                                        variant="standard"
                                        {...register("applicationDate")}
                                        error={!!errors.applicationDate}
                                        helperText={
                                            errors?.applicationDate ? errors.applicationDate.message : null
                                        }
                                    />
                                </Grid>}

                                {/* complete remark */}
                                {(((authority && authority.find((val) => val === "RTI_ADHIKARI")) && statusVal == 14) ||
                                    statusVal == 11) &&
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
                                            sx={{ width: (authority && authority.find((val) => val === "RTI_ADHIKARI")) ? "88%" : "86%" }}
                                            disabled={(statusVal === 11) ? true : false}
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
                                    </Grid>}

                                {/* information return media */}
                                {
                                    (((authority && authority.find((val) => val === "RTI_ADHIKARI")) && statusVal == 14) ||
                                        statusVal == 11) &&
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

                                }

                            </Grid>
                        </Box>
                    </Box>
                    {((authority && authority.find((val) => val === "RTI_ADHIKARI")) && statusVal == 11) && <div>
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
                    {(authority && authority.find((val) => val === "RTI_ADHIKARI") && statusVal === 14) && <Grid item xl={4}
                        lg={4}
                        md={4}
                        sm={4}
                        xs={4}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // marginTop: 2
                        }}>
                        <UploadButton
                            appName="RTI"
                            serviceName="RTI-Application"
                            filePath={setDocument}
                            fileName={document} />
                    </Grid>}
                    {/* </Grid> */}

                    {/* Payment getway button */}
                    {(((logedInUser === "departmentUser") && (authority && authority.find((val) => val !== "RTI_ADHIKARI")) ||
                        (logedInUser === "citizenUser")) && (statusVal === 2)) && <Grid item
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
                    {/* // */}

                    {/* view loi buttonn*/}
                    {((statusVal === 4) &&
                        ((logedInUser === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (logedInUser === "citizenUser"))) && <Grid item
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
                                endIcon={<PreviewIcon />}
                                onClick={() => setIsModalOpenForResolved(true)}
                            >
                                <FormattedLabel id="viewLoi" />
                            </Button>
                        </Grid>}
                    {/* // */}

                    {/* complete status buttonn*/}
                    {(statusVal === 14) && (authority && authority.find((val) => val === "RTI_ADHIKARI")) && <>
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
                                sx={{ marginRight: 8 }}
                                variant="contained"
                                color="primary"
                                style={{ borderRadius: "20px" }}
                                size="small"
                                endIcon={<CheckIcon />}
                                onClick={() => updateCompleteStatus()}
                            >
                                <FormattedLabel id="completeApplication" />
                            </Button>
                        </Grid></>}

                    {/* information ready button */}
                    {(((watch("isLOIGenerated") === "false" || isBplval) && statusVal == 3) || (statusVal === 5)) && (authority && authority.find((val) => val === "RTI_ADHIKARI")) && <>
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
                                marginBottom: 2

                            }}>
                            <Button
                                sx={{ marginRight: 8 }}
                                variant="contained"
                                color="primary"
                                style={{ borderRadius: "20px" }}
                                size="small"
                                endIcon={<CheckIcon />}
                                onClick={() => updateInfoReady()}
                            >
                                <FormattedLabel id="infoReady" />
                            </Button>
                        </Grid></>}
                    {/* // */}

                    {/* when status is complete then show print button */}
                    {(statusVal === 11) && ((logedInUser === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (logedInUser === "citizenUser")) && <>
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
                                marginBottom: 2

                            }}>
                            <Button
                                sx={{ marginRight: 8 }}
                                variant="contained"
                                color="primary"
                                style={{ borderRadius: "20px" }}
                                size="small"
                                endIcon={<PrintIcon />}
                                onClick={() => { }}
                            >
                                <FormattedLabel id="print" />
                            </Button>
                        </Grid></>}

                    {/* download Aknowldgement */}
                    {((logedInUser === "citizenUser") || ((logedInUser === "departmentUser") && (authority && authority.find((val) => val !== "RTI_ADHIKARI")))) && (statusVal === 3) &&
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
                                    // router.push({
                                    //   pathname: "/grievanceMonitoring/dashboard",
                                    // })
                                }}
                            >
                                Downoad Acknowledgement
                            </Button>
                        </Grid></>}
                </Paper>
            </ThemeProvider>
            {/* </Box> */}
            <Modal
                title="Modal For LOI"
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
                        height: "65vh",
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
                                <h2> <FormattedLabel id="loiGenerate" /></h2>
                            </Box>
                            <FormProvider {...methods2}>
                                <form onSubmit={handleSubmit2(OnSubmitloiGenerated)}>
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
                                                label={<FormattedLabel id="applicantName" />}
                                                multiline
                                                variant="standard"
                                                {...register1("applicantFirstName")}
                                                error={!!error2.applicantFirstName}
                                                helperText={
                                                    error2?.applicantFirstName ? error2.applicantFirstName.message : null
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
                                            <TextField
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ width: 230 }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="serviceName" />}
                                                multiline
                                                variant="standard"
                                                {...register1("serviceName")}
                                                error={!!error2.serviceName}
                                                helperText={
                                                    error2?.serviceName ? error2.serviceName.message : null
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
                                                sx={{ width: 230 }}
                                                disabled={(statusVal === 4 || statusVal == 5 || statusVal == 11 || statusVal == 14) ? true : false}
                                                onChange={onChangeRate}
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
                                                sx={{ width: "230px", marginTop: "2%" }}
                                                variant="standard"
                                                error={!!error2.chargeTypeKey}
                                                disabled={(statusVal === 4 || statusVal == 5 || statusVal == 11 || statusVal == 14) ? true : false}
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
                                                id="standard-textarea"
                                                sx={{ width: 230 }}
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
                                                // value={totalAmount}
                                                sx={{ width: 230 }}
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
                                                disabled={(statusVal === 4 || statusVal == 5 || statusVal == 11 || statusVal == 14) ? true : false}
                                                label={<FormattedLabel id="remark" />}
                                                id="standard-textarea"
                                                sx={{ width: 600 }}
                                                variant="standard"
                                                {...register1("remarks")}
                                                error={!!error2.remarks}
                                                helperText={
                                                    error2?.remarks ? error2.remarks.message : null
                                                }
                                            />
                                        </Grid>

                                        <Grid container sx={{ padding: "10px" }}>
                                            {(statusVal == 3) && <Grid item xl={6}
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
                                                    <FormattedLabel id="loiGenerateBtn" />
                                                </Button>
                                            </Grid>}
                                            {(statusVal === 4) && <Grid item xl={6}
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
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => loiPayment()}
                                                    endIcon={<SaveIcon />}
                                                >
                                                    <FormattedLabel id="payment" />
                                                </Button>
                                            </Grid>}

                                            <Grid item
                                                spacing={3}
                                                xl={statusVal == 4 || statusVal == 3 ? 6 : 12}
                                                lg={statusVal == 4 || statusVal == 3 ? 6 : 12}
                                                md={statusVal == 4 || statusVal == 3 ? 6 : 12}

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
                                                    onClick={() => handleCancel()}
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


            <Modal
                title="Modal For Payment"
                open={isOpenPayment}
                onOk={true}
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
                                        onClick={() => handleCancel3()}
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
            {/* </BasicLayout> */}
        </>
    );


};





export default EntryForm;