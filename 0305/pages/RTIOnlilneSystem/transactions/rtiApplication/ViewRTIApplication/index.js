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
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add"
import { DataGrid } from "@mui/x-data-grid"
import DownloadIcon from "@mui/icons-material/Download"
import PrintIcon from '@mui/icons-material/Print';
import theme from "../../../../../theme"
import CheckIcon from '@mui/icons-material/Check';
import {
    getDocumentFromLocalStorage,
    removeDocumentToLocalStorage,
} from "../../../../../components/redux/features/RTIOnlineSystem/rtiOnlineSystem"
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel.js";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
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
        // if (event.target.value <= 20) {
        //     sweetAlert("No of pages should be greater than 20!");
        // } else {
        setTotalAmt(event.target.value * amount)
        // }
    }

    const {
        register: register1,
        handleSubmit: handleSubmit2,
        // @ts-ignore
        methods: methods2,
        reset: reset2,
        watch: watch1,
        control: control2,
        setValue: setValue1,
        formState: { errors: error2 },
    } = useForm({
        criteriaMode: 'all',
        resolver: yupResolver(loiGeneratedSchema),
    })
    const [selectDepartment, setSubDepartments] = useState(null)
    const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false)
    const [isMultiDept, setIsMultiDept] = useState(false)
    const [chargeTypeVal, setChargeType] = useState(null)
    const [genderVal, setGender] = useState(null)
    const [educationVal, setEducation] = useState(null)
    const [zoneDetails, setZoneDetails] = useState();
    const [departments, setDepartments] = useState([]);
    const [subDepartments, setSubDepartmentList] = useState([])
    const router = useRouter();
    const dispatch = useDispatch();
    const inputState = getValues("inputState");
    const [wards, setWards] = useState([]);
    const [deptId, setDeptId] = useState(null)
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
    const [childDept, setChildDept] = useState([])
    const [completeAttach, setCompleteAttach] = useState([])
    const [applicationNumber, setApplicationNumber] = useState(null)
    const [hasDependant, setHasDependant] = useState(false)
    const [noOfpagesinChild, setNoOfPagesinChild] = useState(0)
    const logedInUser = localStorage.getItem("loggedInUser")

    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")
    );

    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;


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
        },
        {
            field: "transferRemark",
            headerName: <FormattedLabel id="transferRemark" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
        },

        {
            field: "infoPages",
            headerName: <FormattedLabel id="noOfPages" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "remark",
            headerName: <FormattedLabel id="remark" />,
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "status",
            headerName: <FormattedLabel id="status" />,
            headerAlign: "center",
            align: "center",
            // flex: 1,
        },
        {
            field: "completedDate",
            headerName: <FormattedLabel id="completeDate"/>,
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "Action",
            headerName: <FormattedLabel id="viewAttach" />,
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

    const docColumns = [
        {
            field: "id",
            headerName: <FormattedLabel id="srNo" />,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "filenm",
            headerName: <FormattedLabel id="fileNm"/>,
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "documentType",
            headerName: <FormattedLabel id='fileType'/>,
            headerAlign: "center",
            align: "center",
            flex: 1,
        },

        {
            field: "Action",
            headerName: <FormattedLabel id="actions"/>,
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
                            }}>
                            <VisibilityIcon />
                        </IconButton>
                    </div>
                )
            },
        },
    ]

    const getSubDepartmentDetails = () => {
        if (watch("childdepartment")) {
            axios
                .get(
                    `${urls.RTI}/master/subDepartment/getAllByDeptWise/${watch(
                        "childdepartment"
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

    useEffect(() => {
        getZone()
        getWards()
        getDepartments()
        getSubDepartments()
        getGenders()
    }, []);

    useEffect(() => {
    }, [watch("noOfPages")])

    useEffect(() => {
        getApplicationById()
    }, [departments]);

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
        setIsMultiDept(false)
        setValue("isApplicationMultiDept", "false")

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
            setPageNo(noOfpagesinChild)
            setIsModalOpenForResolved(true)
        } else {
            setIsModalOpenForResolved(false)
        }
    }, [watch("isLOIGenerated")]);

    useEffect(() => {
        console.log("chhild ", childDept.length == 0)
        if (!hasDependant && childDept.length == 0) {
            if (watch("isApplicationMultiDept") === "true") {
                setValue("isLOIGenerated", "")
                setValue("childdepartment", "")
                setValue("childsubDept", "")
                setValue1("childRemark", "")


                setIsMultiDept(true)
            } else {
                setIsMultiDept(false)
            }
        }

    }, [watch("isApplicationMultiDept")]);

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
        if (localStorage.getItem("loggedInUser") === "citizenUser") {
            axios.get(`${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${router.query.id}`, {
                headers: {
                    UserId: user.id
                }
            }).then((res) => {
                if (res.data.trnAppealLoiList.length != 0) {
                    setLOIDetails(res)
                }
            });
        } else {
            axios.get(`${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${router.query.id}`, {
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
        console.log("logedInUser ", logedInUser)

        if (router.query.id) {
            if (localStorage.getItem("loggedInUser") === "citizenUser") {
                axios.get(`${urls.RTI}/trnRtiApplication/getById?id=${router.query.id}`, {
                    headers: {
                        UserId: user.id
                    }
                },).then((res) => {
                    setApplicationDetails(res.data)
                    setRtiApplication(res.data)

                })
            } else {
                axios.get(`${urls.RTI}/trnRtiApplication/getById?id=${router.query.id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                },).then((res) => {
                    setApplicationDetails(res.data)
                    setRtiApplication(res.data)
                })
            }
        }
    }

    useEffect(() => {
        getSubDepartmentDetails()
    }, [watch("childdepartment")])


    const setRtiApplication = (_res) => {
        if (zoneDetails && wards && departments && subDepartments) {
            setValue("zoneKey", zoneDetails?.find((obj) => { return obj.id == _res?.zoneKey }) ? zoneDetails.find((obj) => { return obj.id == _res?.zoneKey }).zoneName : "-",)
            setValue("wardKey", wards?.find((obj) => { return obj.id == _res?.wardKey }) ? wards.find((obj) => { return obj.id == _res.wardKey }).wardName : "-",)
            setValue("departmentKey", departments?.find((obj) => { return obj.id == _res?.departmentKey }) ? departments.find((obj) => { return obj.id == _res.departmentKey }).department : "-")
            setValue("subDepartmentKey", subDepartments?.find((obj) => { return obj.id == _res?.subDepartmentKey }) ? subDepartments.find((obj) => { return obj.id == _res.subDepartmentKey }).subDepartment : "-")
        }
        setApplicationID(_res?.id)
        getLoi(_res?.id)
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
        setDeliveryDetails(_res?.selectedReturnMedia)
        setSelectedDeliveryDetails(_res?.informationReturnMedia)

        setValue("description", _res?.description)
        setValue("additionalInfo", _res?.additionalInfo)
        setValue("parentRemark", _res?.transferRemark)
        setValue("forwardRemark", _res?.forwardRemark)
        setApplicationReceivedDetails(_res?.createdUserType == 1 ? "citizenuser" :
            _res?.createdUserType == 2 ? "cfcuser" :
                _res?.createdUserType == 3 ? "pcmcportal" :
                    _res?.createdUserType == 4 ? "aaplesarkar" : "")
        setStatusVal(_res.status)
        setValue("infoPages", _res?.infoPages),
            setValue("infoRemark", _res?.infoAvailableRemarks),
            setValue("status", _res.status == 2 ? "Send For Payment"
                : _res.status == 3 ? "In Progress"
                    : _res.status == 4 ? "LOI Generated"
                        : _res.status == 5 ? "Payment Received"
                            : _res.status == 6 ? "Send to Applete Officer"
                                : _res.status == 7 ? "Hearing Scheduled"
                                    : _res.status == 8 ? "Hearing Rescheduled"
                                        : _res.status == 9 ? "Decision Done"
                                            : _res.status == 11 ? "Complete"
                                                : _res.status == 12 ? "Close"
                                                    : _res.status == 14 ? "Information Ready" : "",)
        if (_res.userDao != null) {
            setValue("rtiFullName", _res.userDao.firstNameEn + _res.userDao.middleNameEn + _res.userDao.lastNameEn)
            setValue("rtiEmailId", _res.userDao.email)
            setValue("rtiContact", _res.userDao.phoneNo)

        }

        const doc = []
        if (_res.attachedDocument1 != null) {
            doc.push({
                id: 1,
                filenm: _res.attachedDocument1.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument1,
                documentType: _res.attachedDocument1.split(".").pop().toUpperCase()
            });
        }
        if (_res.attachedDocument2 != null) {
            doc.push({
                id: 2,
                filenm: _res.attachedDocument2.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument2,
                documentType: _res.attachedDocument2.split(".").pop().toUpperCase()
            })
        }
        if (_res.attachedDocument3 != null) {
            doc.push({
                id: 3,
                filenm: _res.attachedDocument3.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument3,
                documentType: _res.attachedDocument3.split(".").pop().toUpperCase()
            })
        }
        if (_res.attachedDocument4 != null) {
            doc.push({
                id: 4,
                filenm: _res.attachedDocument4.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument4,
                documentType: _res.attachedDocument4.split(".").pop().toUpperCase()
            })
        }
        if (_res.attachedDocument5 != null) {
            doc.push({
                id: 5,
                filenm: _res.attachedDocument5.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument5,
                documentType: _res.attachedDocument5.split(".").pop().toUpperCase()
            })
        }
        if (_res.attachedDocument6 != null) {
            doc.push({
                id: 6,
                filenm: _res.attachedDocument6.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument6,
                documentType: _res.attachedDocument6.split(".").pop().toUpperCase()
            })
        }
        if (_res.attachedDocument7 != null) {
            doc.push({
                id: 7,
                filenm: _res.attachedDocument7.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument7,
                documentType: _res.attachedDocument7.split(".").pop().toUpperCase()
            })
        }
        if (_res.attachedDocument8 != null) {
            doc.push({
                id: 8,
                filenm: _res.attachedDocument8.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument8,
                documentType: _res.attachedDocument8.split(".").pop().toUpperCase()
            })
        }
        if (_res.attachedDocument9 != null) {
            doc.push({
                id: 9,
                filenm: _res.attachedDocument9.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument9,
                documentType: _res.attachedDocument9.split(".").pop().toUpperCase()
            })
        }
        if (_res.attachedDocument10 != null) {
            doc.push({
                id: 10,
                filenm: _res.attachedDocument10.split("/").pop().split("_").pop(),
                documentPath: _res.attachedDocument10,
                documentType: _res.attachedDocument10.split(".").pop().toUpperCase()
            })
        }
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

        setDataSource(doc)
        console.log("CCCCCCCCCCCCCCCC ", childDept)
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
                    // if(res.status==11){
                    // if(res.attachedDocumentPath){
                    filenm: (res.status == 11 && res.attachedDocumentPath) ? res.attachedDocumentPath.split("/").pop() : "",
                    documentPath: (res.status == 11 && res.attachedDocumentPath) ? res.attachedDocumentPath : "",
                    documentType: (res.status == 11 && res.attachedDocumentPath) ? res.attachedDocumentPath.split(".").pop().toUpperCase() : ""
                };
                // }


            })
            setChildDept([..._res1]);
        }


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
                infoPages: watch("infoPages"),
                isComplete: "true",
                isApproved: false,
            }
            if (localStorage.getItem("loggedInUser") === "citizenUser") {
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
                            sweetAlert("Saved!", `RTI Application No ${res.data.message.split('[')[1].split(']')[0]} is Completed successfully !`, "success");
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
                            sweetAlert("Saved!", `RTI Application No ${res.data.message.split('[')[1].split(']')[0]} is Completed successfully !`, "success");
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
            if (localStorage.getItem("loggedInUser") === "citizenUser") {
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
                            sweetAlert("Saved!", `RTI Applicaction No. ${res.data.messages.split('[')[1].split(']')[0]} is in Information Ready state`, "success");
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
                            sweetAlert("Saved!", `RTI Applicaction No. ${res.data.message.split('[')[1].split(']')[0]} is in Information Ready state`, "success");
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
        if (localStorage.getItem("loggedInUser") === "citizenUser") {
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
                        sweetAlert("Saved!", "Payment Done successful!", "success");
                    }
                    else {
                        sweetAlert("Error!", "Something Went Wrong !", "error");
                    }
                });
        }
    }


    const onSubmitAddChildren = () => {
        // var dependentRtiApplicationDaoList=[]
        const dependentRtiApplicationDaoList = [{
            departmentKey: watch("childdepartment"),
            subDepartmentKey: watch("childsubDept"),
            "transferRemark": watch1("childRemark"),
            "isBpl": isBplval,
            isTransfer: false,
            
        }]


        const body = {
            ...applications,
            dependentRtiApplicationDaoList,
            dependentStatus:null
        }
        console.log("Body ", body)


        const tempData = axios
            .post(`${urls.RTI}/trnRtiApplication/save/dependent`, body, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            },)
            .then((res) => {
                console.log("res", res);
                if (res.status == 201) {
                    sweetAlert(`Child RTI Application No.${watch("applicationNo")} is added successfully !!!`);
                    setIsMultiDept(false)
                    getApplicationById()
                }
            })

    }

    const OnSubmitloiGenerated = (formData) => {
        const body = {
            ...formData,
            noOfPages: pageNo,
            totalAmount: totalAmount,
            applicationKey: applicationId
        }
        if (pageNo <= 20) {
            sweetAlert("No of pages should be greater than 20");
            setPageNo(0)
            setTotalAmt(0)
        } else {

            if (localStorage.getItem("loggedInUser") === "citizenUser") {
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
                            getApplicationById()
                            sweetAlert("Saved!", "LOI Generated Successfully!", "success");
                            setIsModalOpenForResolved(false)

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
                            getApplicationById()
                            sweetAlert("Saved!", "LOI Generated Successfully!", "success");
                            setIsModalOpenForResolved(false)
                        }
                        else {
                            sweetAlert("Error!", "Something Went Wrong !", "error");
                        }
                    });
            }
        }
    }

    const loiPayment = () => {
        const body = {
            activeFlag: "Y",
            isComplete: false,
            isApproved: false,
            ...loiDetails,
        }
        if (localStorage.getItem("loggedInUser") === "citizenUser") {
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
                                <form >
                                    <Grid container sx={{ padding: "10px" }}>

                                        {/* Application received by */}
                                        {authority && authority.find((val) => val === "RTI_ADHIKARI") &&
                                            <Grid
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
                                                    // marginLeft:30
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

                                        {applications.parentId == null && authority && authority.find((val) => val === "RTI_ADHIKARI") ? <Grid
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
                                        </Grid> : <Grid
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
                                        ></Grid>}
                                        {(applications.parentId != null && authority && authority.find((val) => val === "RTI_ADHIKARI")) && <Grid
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
                                                sx={{ width: 230 }}
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                id="standard-textarea"
                                                label={<FormattedLabel id="applicationType" />}
                                                multiline
                                                variant="standard"
                                                {...register("applicationType")}
                                                error={!!errors.applicationType}
                                                helperText={
                                                    errors?.applicationType ? errors.applicationType.message : null
                                                }
                                            />
                                        </Grid>}

                                        {((applications.parentId != null && authority && authority.find((val) => val === "RTI_ADHIKARI") || (localStorage.getItem("loggedInUser") == "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI") && applications.parentId == null) || localStorage.getItem("loggedInUser") === "citizenUser")) && <Grid
                                            item
                                            // xl={(localStorage.getItem("loggedInUser") == "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")?12:4}
                                            // lg={(localStorage.getItem("loggedInUser") == "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")?12:4}
                                            // md={(localStorage.getItem("loggedInUser") == "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")?12:4}
                                            // sm={(localStorage.getItem("loggedInUser") == "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")?12:4}
                                            // xs={(localStorage.getItem("loggedInUser") == "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")?12:4}
                                            xl={((localStorage.getItem("loggedInUser") == "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI") && applications.parentId == null) || localStorage.getItem("loggedInUser") === "citizenUser") ? 12 : 4}
                                            lg={((localStorage.getItem("loggedInUser") == "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI") && applications.parentId == null) || localStorage.getItem("loggedInUser") === "citizenUser") ? 12 : 4}
                                            md={((localStorage.getItem("loggedInUser") == "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI") && applications.parentId == null) || localStorage.getItem("loggedInUser") === "citizenUser") ? 12 : 4}
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
                                                label={<FormattedLabel id="applicationNo" />}
                                                multiline
                                                variant="standard"
                                                {...register("applicationNo")}
                                                error={!!errors.applicationNo}
                                                helperText={
                                                    errors?.applicationNo ? errors.applicationNo.message : null
                                                }
                                            />
                                        </Grid>}
                                        {(applications.parentId != null && authority && authority.find((val) => val === "RTI_ADHIKARI")) && <Grid item
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
                                        ></Grid>}
                                        {/* <Grid item
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
                                            ></Grid> */}
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
                                                            value={deliveryDetails}
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

                                        {(applications.parentId != null && authority && authority.find((val) => val === "RTI_ADHIKARI")) && <Grid
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
                                                label={<FormattedLabel id="parentRemark" />}
                                                multiline
                                                variant="standard"
                                                {...register("parentRemark")}
                                                error={!!errors.parentRemark}
                                                helperText={
                                                    errors?.parentRemark ? errors.parentRemark.message : null
                                                }
                                            />
                                        </Grid>}

                                        {(applications.isTransfer && authority && authority.find((val) => val === "RTI_ADHIKARI")) && <Grid
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
                            rows={dataSource}
                            columns={docColumns}
                        />
                    </div>}

                    {/* multi department radio button */}
                    {(authority && authority.find((val) => val === "RTI_ADHIKARI")) && ((statusVal === 3 || statusVal === 4 || statusVal === 14 || statusVal === 11 || statusVal === 5) && (applications.parentId == null)) && <div>
                        {((statusVal === 4 || statusVal === 14 || statusVal === 11 || statusVal === 5 || (statusVal === 3 && childDept.length != 0))) ? (
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
                                    marginLeft: 10
                                }}
                            >
                                <FormControl >
                                    <FormLabel
                                        sx={{ width: "400px", }}
                                        id='demo-row-radio-buttons-group-label'
                                    >
                                        {<FormattedLabel id='isApplicationMultiDept' />}
                                    </FormLabel>

                                    <Controller
                                        disabled={true}
                                        InputLabelProps={{ shrink: true }}
                                        name='isApplicationMultiDept'
                                        control={control}
                                        render={({ field }) => (
                                            <RadioGroup
                                                disabled={inputState}
                                                value={hasDependant}
                                                // onChange={(value) => field.onChange(value)}
                                                selected={field.value}
                                                row
                                                aria-labelledby='demo-row-radio-buttons-group-label'
                                            >
                                                <FormControlLabel
                                                    value='true'
                                                    disabled={inputState}
                                                    control={<Radio size='small' />}
                                                    label={<FormattedLabel id='yes' />}
                                                    error={!!errors.isApplicationMultiDept}
                                                    helperText={
                                                        errors?.isApplicationMultiDept ? errors.isApplicationMultiDept.message : null
                                                    }
                                                />
                                                <FormControlLabel
                                                    value='false'
                                                    disabled={inputState}
                                                    control={<Radio size='small' />}
                                                    label={<FormattedLabel id='no' />}
                                                    error={!!errors.isApplicationMultiDept}
                                                    helperText={
                                                        errors?.isApplicationMultiDept ? errors.isApplicationMultiDept.message : null
                                                    }
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        ) : <Grid
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={4}
                            xs={4}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: 10
                            }}
                        >
                            <FormControl flexDirection='row'>
                                <FormLabel
                                    sx={{ width: 230, }}
                                    id='demo-row-radio-buttons-group-label'
                                >
                                    {<FormattedLabel id='isApplicationMultiDept' />}
                                </FormLabel>

                                <Controller
                                    name='isApplicationMultiDept'
                                    control={control}
                                    disabled={true}
                                    defaultValue=''
                                    {...register("isApplicationMultiDept")}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value}
                                            // onChange={(value) => {
                                            // disabled={true}field.onChange(value)
                                            // }}
                                            selected={field.value}
                                            row
                                            aria-labelledby='demo-row-radio-buttons-group-label'
                                        >
                                            <FormControlLabel
                                                value={"true"}
                                                {...register("isApplicationMultiDept")}
                                                control={<Radio />}
                                                label={<FormattedLabel id='yes' />}
                                                error={!!errors.isApplicationMultiDept}
                                                helperText={
                                                    errors?.isApplicationMultiDept ? errors.isApplicationMultiDept.message : null
                                                }
                                            />
                                            <FormControlLabel
                                                value={"false"}
                                                {...register("isApplicationMultiDept")}
                                                control={<Radio />}
                                                label={<FormattedLabel id='no' />}
                                                error={!!errors.isApplicationMultiDept}
                                                helperText={
                                                    errors?.isApplicationMultiDept ? errors.isApplicationMultiDept.message : null
                                                }
                                            />
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </Grid>}

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
                                    <h2>Child Departments</h2>
                                </Box>

                                <Grid container style={{ padding: "10px" }}>
                                    {statusVal === 3 && <Grid
                                        item
                                        xs={12}
                                        style={{ display: "flex", justifyContent: "end" }}
                                    >
                                        <Button
                                            variant="contained"
                                            endIcon={<AddIcon />}
                                            type="primary"

                                            onClick={() => {
                                                setValue("isLOIGenerated", "")
                                                setValue("childdepartment", "")
                                                setValue("childsubDept", "")
                                                setValue1("childRemark", "")
                                                setIsMultiDept(true)
                                            }}
                                        >
                                            <FormattedLabel id="add" />{" "}
                                        </Button>
                                    </Grid>}
                                </Grid>
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
                    </div>}


                    {/* loi generation radio button */}
                    {((authority && authority.find((val) => val === "RTI_ADHIKARI")) && !isBplval &&
                        ((statusVal == 3 && ((watch("isApplicationMultiDept") == "false" || applications.dependentStatus === 11) && applications.parentId == null))
                        )) ? (
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

                    {/* loi generate View */}
                    {loiDetails.length != 0 && (applications.parentId == null) && (statusVal === 5 || ((statusVal === 4) &&
                        ((localStorage.getItem("loggedInUser") !== "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") != "citizenUser"))) || statusVal === 11 || statusVal == 14) && <div>
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
                                        InputLabelProps={{ shrink: true }}
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
                                        InputLabelProps={{ shrink: true }}

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

                    {/* Header for RTI Adhikari */}
                    {(authority && authority.find((val) => val === "RTI_ADHIKARI") &&
                        ((((watch("isLOIGenerated") === "false" && !isBplval) ||
                            (isBplval && applications.dependentStatus == 11) ||
                            (watch("isApplicationMultiDept") == "false" && ((!isBplval && watch("isLOIGenerated") === "false") || isBplval)) || applications.parentId != null) && statusVal === 3) || statusVal === 11 || statusVal === 14 || statusVal == 5)) &&
                        <Box
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
                    {(((localStorage.getItem("loggedInUser") === "citizenUser") || ((localStorage.getItem("loggedInUser") === "departmentUser") && (authority && authority.find((val) => val != "RTI_ADHIKARI")))) && (statusVal === 14 || statusVal === 11)) && <Box
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
                            {/* information remark */}
                            {((authority && authority.find((val) => val === "RTI_ADHIKARI") &&
                                ((((watch("isLOIGenerated") === "false" && !isBplval) || (isBplval && applications.dependentStatus == 11) || (watch("isApplicationMultiDept") == "false" && ((!isBplval && watch("isLOIGenerated") === "false") || isBplval))) && statusVal === 3) || statusVal === 5)) ||
                                (statusVal == 11 || statusVal == 14) && applications.parentId == null) &&
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
                                </Grid>


                                    {/* information ready date */}
                                    {(statusVal == 14) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) &&
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
                                </Grid>}

                            {/* complete remark */}
                            {((authority && authority.find((val) => val === "RTI_ADHIKARI") ||
                                (localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") == "citizenUser" && statusVal != 14)) &&
                                (statusVal == 14 || statusVal == 11 || (((applications.parentId != null)) && statusVal === 3))) &&
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


                            {((authority && authority.find((val) => val === "RTI_ADHIKARI")) &&
                                (((applications.parentId != null && statusVal === 11) ||
                                    (statusVal === 3 && applications.parentId != null)))) &&
                                <Grid container sx={{ padding: "10px" }}>
                                    {((applications.infoPages && statusVal === 11) || statusVal === 3) && <Grid
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
                                            label={<FormattedLabel id="noOfPages" />}
                                            id="standard-textarea"
                                            disabled={localStorage.getItem("loggedInUser") === "citizenUser" ? true : false}

                                            sx={{ width: 230 }}
                                            variant="standard"
                                            {...register("infoPages")}
                                            error={!!errors.infoPages}
                                            helperText={
                                                errors?.infoPages ? errors.infoPages.message : null
                                            }
                                        />
                                    </Grid>}
                                    {statusVal != 11 && <Grid item xl={4}
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
                                        <div style={{ display: "block", }}>
                                            Attach document<br />
                                            <UploadButton
                                                appName="RTI"
                                                serviceName="RTI-Application"
                                                filePath={setDocument}
                                                fileName={document} />
                                        </div>
                                    </Grid>}
                                </Grid>}
                            {/* information return media */}


                            {
                                (((authority && authority.find((val) => val === "RTI_ADHIKARI")) && statusVal == 14) ||
                                    applications.parentId == null && statusVal == 11) &&
                                <Grid container>
                                    {(statusVal === 11) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) && <Grid
                                        item
                                        xl={4}
                                        lg={4}
                                        md={4}
                                        sm={4}
                                        xs={4}
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

                                    <Grid
                                        item
                                        xl={(statusVal === 11) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) ? 8 : 12}
                                        lg={(statusVal === 11) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) ? 8 : 12}
                                        md={(statusVal === 11) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) ? 8 : 12}
                                        sm={(statusVal === 11) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) ? 8 : 12}
                                        xs={(statusVal === 11) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) ? 8 : 12}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <FormControl sx={{ width: 350, marginTop: "10px" }}>
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
                                                        value={(statusVal !== 11) ? field.value : selectdeliveryDetails}
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

                                    {(statusVal == 11||statusVal == 14) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) &&
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={4}
                                            xs={4}
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
                                                label={"RTI Adhikari Full Name"}
                                                multiline
                                                variant="standard"
                                                {...register("rtiFullName")}
                                                error={!!errors.rtiFullName}
                                                helperText={
                                                    errors?.rtiFullName ? errors.rtiFullName.message : null
                                                }
                                            />
                                        </Grid>}
                                    {(statusVal == 11||statusVal == 14) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) &&
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={4}
                                            xs={4}
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

                                                label={<FormattedLabel id="emailId" />}
                                                multiline
                                                variant="standard"
                                                {...register("rtiEmailId")}
                                                error={!!errors.rtiEmailId}
                                                helperText={
                                                    errors?.rtiEmailId ? errors.rtiEmailId.message : null
                                                }
                                            />
                                        </Grid>}
                                    {(statusVal == 11||statusVal == 14) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) &&
                                        <Grid item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={4}
                                            xs={4}
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
                                                // label={"RTI Adhikari Full Name"}
                                                label={<FormattedLabel id="contactDetails" />}
                                                multiline
                                                variant="standard"
                                                {...register("rtiContact")}
                                                error={!!errors.rtiContact}
                                                helperText={
                                                    errors?.rtiContact ? errors.rtiContact.message : null
                                                }
                                            />
                                        </Grid>}

                                </Grid>
                            }

                            {/* </Grid> */}
                        </Box>
                    </Box>
                    {((authority && authority.find((val) => val === "RTI_ADHIKARI")) && statusVal == 11 && completeAttach.length != 0) && <div>
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

                    {(authority && authority.find((val) => val === "RTI_ADHIKARI") && statusVal === 14) &&
                        <Grid item xl={4}
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
                    {(((localStorage.getItem("loggedInUser") === "departmentUser") && (authority && authority.find((val) => val !== "RTI_ADHIKARI")) ||
                        (localStorage.getItem("loggedInUser") === "citizenUser")) && (statusVal === 2)) && <Grid item
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
                        ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser"))) &&
                        <div >
                            <Grid item
                                xl={6}
                                lg={6}
                                md={6}
                                sm={6}
                                xs={6} sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: 2

                                }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ borderRadius: "20px" }}
                                    size="small"
                                    endIcon={<DownloadIcon />}
                                    onClick={() => {
                                        router.push({
                                            pathname: "/RTIOnlilneSystem/transactions/acknowledgement/LoiGenerationRecipt",
                                            query: { id: applicationNumber },
                                        })
                                    }}
                                >
                                    <FormattedLabel id="downloadLoiReceipt" />
                                </Button>
                            </Grid>
                        </div>
                    }

                    {/* complete status buttonn*/}
                    {(statusVal === 14 || (statusVal == 3 && applications.parentId != null)) && (authority && authority.find((val) => val === "RTI_ADHIKARI")) && <>
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
                    {((((watch("isLOIGenerated") === "false" && !isBplval) || (isBplval && applications.dependentStatus == 11) || (watch("isApplicationMultiDept") == "false" && ((!isBplval && watch("isLOIGenerated") === "false") || isBplval))) && statusVal === 3) || (statusVal === 5)) && (authority && authority.find((val) => val === "RTI_ADHIKARI")) && <>
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
                    {(statusVal === 11) && ((localStorage.getItem("loggedInUser") === "departmentUser" && authority && authority.find((val) => val !== "RTI_ADHIKARI")) || (localStorage.getItem("loggedInUser") === "citizenUser")) && <>
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
                    {((localStorage.getItem("loggedInUser") === "citizenUser") || ((localStorage.getItem("loggedInUser") === "departmentUser") && (authority && authority.find((val) => val !== "RTI_ADHIKARI")))) && (statusVal === 3) &&
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
                                type="button"
                                variant="contained"
                                color="primary"
                                endIcon={<DownloadIcon />}
                                style={{ borderRadius: "20px" }}
                                size="small"
                                onClick={() => {
                                    router.push({
                                        pathname: "/RTIOnlilneSystem/transactions/acknowledgement/rtiApplication",
                                        query: { id: applicationNumber },
                                    })
                                }}
                            >
                                <FormattedLabel id="downloadAcknowldgement" />
                            </Button>
                        </Grid></>
                    }
                </Paper>
            </ThemeProvider>


            {/* Modal for loi */}
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
                                                sx={{ width: 610 }}
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

            {/* modal for payment */}
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


            {/* modal for multi department */}
            <Modal
                title="Modal For Multi Department"
                open={isMultiDept}
                onOk={true}
                onClose={handleCancel1} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
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
                        height: "48vh",
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
                                <h2> <FormattedLabel id="addDepartment" /></h2>
                            </Box>
                            <FormProvider {...methods2}>
                                <Grid container sx={{ padding: "10px" }}>
                                    <Grid item
                                        xl={6}
                                        lg={6}
                                        md={6}
                                        sm={6}
                                        xs={6}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                        <FormControl
                                            sx={{ width: 380, marginTop: "2%" }}
                                            variant="standard"
                                            error={!!errors.childdepartment}
                                        >
                                            <InputLabel id="demo-simple-select-standard-label">
                                                <FormattedLabel id="departmentKey" required />
                                            </InputLabel>
                                            <Controller
                                                render={({ field }) => (
                                                    <Select
                                                        // sx={{ width: 250 }}
                                                        autoFocus
                                                        fullWidth
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            field.onChange(value)
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
                                                name="childdepartment"
                                                control={control}
                                                defaultValue=""
                                            />
                                            <FormHelperText>
                                                {errors?.childdepartment ? errors.childdepartment.message : null}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>

                                    {(subDepartments.length != 0 && watch("childdepartment")) && <Grid item
                                        xl={6}
                                        lg={6}
                                        md={6}
                                        sm={6}
                                        xs={6}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <FormControl
                                            sx={{ width: 380, marginTop: "2%" }}
                                            variant="standard"
                                            error={!!errors.childsubDept}
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
                                                                    {subDepartment.subDepartment}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                )}
                                                name="childsubDept"
                                                control={control}
                                                defaultValue=""
                                            />
                                            <FormHelperText>
                                                {errors?.childsubDept ? errors.childsubDept.message : null}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>}
                                    <Grid item
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
                                            sx={{ width: "85%" }}
                                            variant="standard"
                                            {...register1("childRemark")}
                                            error={!!error2.childRemark}
                                            helperText={
                                                error2?.childRemark ? error2.childRemark.message : null
                                            }
                                        />
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
                                                onClick={() => onSubmitAddChildren()}
                                                endIcon={<SaveIcon />}
                                            >
                                                <FormattedLabel id="save" />
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
                                                marginTop: 5

                                            }}>
                                            <Button
                                                sx={{ marginRight: 8 }}
                                                variant="contained"
                                                color="primary"
                                                endIcon={<ClearIcon />}
                                                onClick={() => handleCancel1()}
                                            >
                                                <FormattedLabel id="closeModal" />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* </form> */}
                            </FormProvider>
                        </>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};





export default EntryForm;