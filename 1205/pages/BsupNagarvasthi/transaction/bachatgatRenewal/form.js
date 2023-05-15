import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    ThemeProvider,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility"
import theme from "../../../../theme";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import bachatgatRegistration from "../../../../containers/schema/BsupNagarvasthiSchema/bachatgatRegistration";
import { yupResolver } from "@hookform/resolvers/yup";
import Document from "../../uploadDocuments/Documents";

const BachatGatCategory = () => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(bachatgatRegistration),
        defaultValues: {
            trnBachatgatRegistrationMembersList: [
                { fullName: "", designation: "", address: "", aadharNumber: "" },
            ],
        },
    });

    const language = useSelector((state) => state.labels.language);

    const user = useSelector((state) => state.user.user);
    const router = useRouter();
    let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));
    const [statusVal, setStatusVal] = useState(null)
    const [remarkTableData, setRemarkData] = useState([])
    const [memberList, setMemberData] = useState([])
    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    localStorage.removeItem("bsupDocuments");
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: "trnBachatgatRegistrationMembersList",
        control,
    });

    const [zoneNames, setZoneNames] = useState([]);
    const [wardNames, setWardNames] = useState([]);
    const [crAreaNames, setCRAreaName] = useState([]);
    const [bankMaster, setBankMasters] = useState([]);
    const [iFSCCode, setIFSCCode] = useState();
    const [MICRCode, setMICRCode] = useState();
    const [bachatGatCategory, setBachatGatCategory] = useState([]);
    const [selectedBank, setSelectedBank] = useState([]);
    const [registrationDetails, setRegistrationDetails] = useState([]);
    const [fetchDocument, setFetchDocuments] = useState([])
    const [userLst, setUserLst] = useState([]);
    const loggedUser = localStorage.getItem("loggedInUser")
    let userCitizen = useSelector((state) => {
        return state?.user?.user
    });

    // fetch bachatgat regsitration details by id
    useEffect(() => {
        fetchRegistrationDetails()
    }, [router.query.id && bankMaster])

    useEffect(() => {
        getZoneName();
        getWardNames();
        getCRAreaName();
        getBachatGatCategory();
        getBank();
        getUser()
    }, []);

    // load user
    const getUser = () => {
        axios
            .get(`${urls.CFCURL}/master/user/getAll`)
            .then((res) => {
                console.log("res.data", res?.data?.user);
                setUserLst(res?.data?.user);
            })
            .catch((err) => console.log(err));
    };

    // load zone
    const getZoneName = () => {
        axios
            .get(`${urls.CFCURL}/master/zone/getAll`)
            .then((r) => {
                setZoneNames(
                    r.data.zone.map((row) => ({
                        id: row.id,
                        zoneName: row.zoneName,
                        zoneNameMr: row.zoneNameMr,
                    })),
                );
            });
    };

    // load wards
    const getWardNames = () => {
        axios
            .get(`${urls.CFCURL}/master/ward/getAll`)
            .then((r) => {
                setWardNames(
                    r.data.ward.map((row) => ({
                        id: row.id,
                        wardName: row.wardName,
                        wardNameMr: row.wardNameMr,
                    })),
                );
            });
    };

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

    // load bank
    const getBank = () => {
        axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
            setBankMasters(r.data.bank);
        });
    };

    // load bachatgat category
    const getBachatGatCategory = () => {
        axios.get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`).then((r) => {
            setBachatGatCategory(
                r.data.mstBachatGatCategoryList.map((row) => ({
                    id: row.id,
                    bachatGatCategoryName: row.bgCategoryName,
                    bachatGatCategoryNameMr: row.bgCategoryMr,
                })),
            );
        });
    };

    // call api by id
    const fetchRegistrationDetails = () => {
        loggedUser === "citizenUser"
            ? axios
                .get(`${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${router.query.id}`, {
                    headers: {
                        UserId: user.id
                    }
                },
                )
                .then((r) => {
                    setDataOnForm(r.data)
                    setRegistrationDetails(r.data)
                })
            : axios
                .get(
                    `${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${router.query.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    },
                )
                .then((r) => {
                    setDataOnForm(r.data)
                    setRegistrationDetails(r.data)
                });
    }


    const setDataOnForm = (data) => {
        setValue("areaKey", data.areaKey)
        setValue("zoneKey", data.zoneKey)
        setValue("wardKey", data.wardKey)
        setValue("geoCode", data.geoCode)
        setValue("bachatgatName", data.bachatgatName)
        setValue("categoryKey", data.categoryKey)
        setValue("presidentFirstName", data.presidentFirstName)
        setValue("presidentLastName", data.presidentLastName)
        setValue("presidentMiddleName", data.presidentMiddleName)
        setValue("totalMembersCount", data.totalMembersCount)
        setValue("flatBuldingNo", data.flatBuldingNo)
        setValue("buildingName", data.buildingName)
        setValue("roadName", data.roadName)
        setValue("landmark", data.landmark)
        setValue("pinCode", data.pinCode)
        setValue("landlineNo", data.landlineNo)
        setValue("applicantFirstName", data?.applicantFirstName)
        setValue("applicantMiddleName", data?.applicantMiddleName)
        setValue("applicantLastName", data?.applicantLastName)
        setValue("emailId", data?.emailId)
        setValue("mobileNo", data?.mobileNo)
        setStatusVal(data.status)
        setValue("bankNameId", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
            ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
            : "-");
        setValue("bankBranchKey", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
            ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
            : "-");
        setValue("bankIFSC", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
            ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode : "-")
        // setValue("bankMICR", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode
        //     ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode : "-")
        setValue("accountNo", data.accountNo)
        setValue("bankAccountFullName", data.bankAccountFullName)
        setValue("startDate", data.startDate)
        setValue("saSanghatakRemark", data.saSanghatakRemark)
        setValue("deptClerkRemark", data.deptClerkRemark)
        setValue("deptyCommissionerRemark", data.deptyCommissionerRemark)
        setValue("asstCommissionerRemark", data.asstCommissionerRemark)
        setValue("branchName", data.branchName)
        setValue("ifscCode", data.ifscCode)
        setValue('bankMICR', data.micrCode)
        let res = data.trnBachatgatRegistrationMembersList.map((r, i) => {
            return {
                id: i + 1,
                fullName: r.fullName,
                address: r.address,
                designation: r.designation,
                aadharNumber: r.aadharNumber
            }
        })
        setMemberData([...res])
        const bankDoc = []

        let _res = data.trnBachatgatRegistrationDocumentsList.map((r, i) => {
            bankDoc.push({
                id: i + 1,
                title: "other",
                filenm: r.documentPath && r.documentPath.split('/').pop().split("_").pop(),
                documentType: r.documentType,
                documentPath: r.documentPath
            })
        })
        // setFetchDocuments([..._res])

        if (data.passbookFrontPage && data.passbookLastPage) {
            bankDoc.push({
                id: data.trnBachatgatRegistrationDocumentsList.length + 1,
                title: "Passbook Front Page",
                documentType: "r.documentType",
                documentPath: data.passbookFrontPage,
                filenm: data.passbookFrontPage && data.passbookFrontPage.split("/").pop().split("_").pop()
            })
            bankDoc.push({
                id: data.trnBachatgatRegistrationDocumentsList.length + 2,
                title: "Passbook Back Page",
                documentType: "r.documentType",
                documentPath: data.passbookLastPage,
                filenm: data.passbookLastPage && data.passbookLastPage.split("/").pop().split("_").pop()
            })
        } else if (data.passbookLastPage) {
            bankDoc.push({
                id: data.trnBachatgatRegistrationDocumentsList.length + 3,
                title: "Passbook Back Page",
                documentType: "r.documentType",
                documentPath: data.passbookLastPage,
                filenm: data.passbookLastPage && data.passbookLastPage.split("/").pop().split("_").pop()
            })
        }
        else if (data.passbookFrontPage) {
            bankDoc.push({
                id: data.trnBachatgatRegistrationDocumentsList.length + 4,
                title: "Passbook Front Page",
                documentPath: data.passbookFrontPage,
                filenm: data.passbookFrontPage && data.passbookFrontPage.split("/").pop().split("_").pop()
            })
        }
        console.log("bankDoc ", bankDoc)
        setFetchDocuments([...bankDoc])
    }

    // set remark table details
    useEffect(() => {
        setDataToTable()
    }, [registrationDetails])

    const setDataToTable = () => {
        const a = []
        console.log("saSanghatakRemark ", watch("saSanghatakRemark"))
        if (watch("saSanghatakRemark") && watch("deptClerkRemark") && watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 4; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn : "-"
                            : i == 2 ?
                                userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
                                    ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn : "-"
                                : userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
                                    ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn : "-";

                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn : "-"
                            : i == 2 ?
                                userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
                                    ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn : "-"
                                : userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
                                    ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn : "-";
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.saSanghatakRemark : i == 1 ? registrationDetails.deptClerkRemark : i == 2 ? registrationDetails.asstCommissionerRemark : registrationDetails.deptyCommissionerRemark,
                    designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : i == 2 ? "Assistant Commissioner" : "Deputy Commissioner",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.saSanghatakDate
                    ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
                        registrationDetails.deptClerkDate
                    ).format("DD-MM-YYYY HH:mm") : i == 2 ? moment(
                        registrationDetails.asstCommissionerDate
                    ).format("DD-MM-YYYY HH:mm") : moment(
                        registrationDetails.deptyCommissionerDate
                    ).format("DD-MM-YYYY HH:mm"),
                    userName: firstNameEn + " " + lastNameEn
                })
            }
        }
        // 1110
        else if (watch("saSanghatakRemark") && watch("deptClerkRemark") && watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 3; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn : "-"
                            : i == 2 ?
                                userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
                                    ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn : "-"
                                : "";
                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn : "-"
                            : i == 2 ?
                                userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
                                    ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn : "-" : "";

                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.saSanghatakRemark : i == 1 ? registrationDetails.deptClerkRemark : i == 2 ? registrationDetails.asstCommissionerRemark : "",
                    designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : i == 2 ? "Assistant Commissioner" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.saSanghatakDate
                    ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
                        registrationDetails.deptClerkDate
                    ).format("DD-MM-YYYY HH:mm") : i == 2 ? moment(
                        registrationDetails.asstCommissionerDate
                    ).format("DD-MM-YYYY HH:mm") : "",
                    userName: firstNameEn + " " + lastNameEn
                })
            }
        }
        // 1101
        else if (watch("saSanghatakRemark") && watch("deptClerkRemark") && !watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 3; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn : "-"
                            : i == 2 ?
                                userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
                                    ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn : "-" : "";
                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn : "-"
                            : i == 2 ?
                                userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
                                    ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn : "-" : ""

                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.saSanghatakRemark : i == 1 ? registrationDetails.deptClerkRemark : i == 2 ? registrationDetails.deptyCommissionerRemark : "",
                    designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : i == 2 ? "Deputy Commissioner" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.saSanghatakDate
                    ).format("DD-MM-YYYY HH:mm") : i == 1 ?
                        moment(
                            registrationDetails.deptClerkDate
                        ).format("DD-MM-YYYY HH:mm") : i == 2 ?
                            moment(
                                registrationDetails.deptyCommissionerDate
                            ).format("DD-MM-YYYY HH:mm") : "",
                    userName: firstNameEn + " " + lastNameEn

                })
            }
        }
        // 1100
        else if (watch("saSanghatakRemark") && watch("deptClerkRemark") && !watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 2; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn : "-" : "";

                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn : "-" : "";
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.saSanghatakRemark : i == 1 ? registrationDetails.deptClerkRemark : "",
                    designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.saSanghatakDate
                    ).format("DD-MM-YYYY HH:mm") : i == 1 ?
                        moment(
                            registrationDetails.deptClerkDate
                        ).format("DD-MM-YYYY HH:mm") : "",
                    userName: firstNameEn + " " + lastNameEn
                })
            }
        }
        // 1001
        else if (watch("saSanghatakRemark") && !watch("deptClerkRemark") && !watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 2; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn : "-"
                            : "";

                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn : "-"
                            : "";
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.saSanghatakRemark : i == 1 ? registrationDetails.deptyCommissionerRemark : "",
                    designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Deputy Commissioner" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.saSanghatakDate
                    ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
                        registrationDetails.deptyCommissionerDate
                    ).format("DD-MM-YYYY HH:mm") : "",
                    userName: firstNameEn + " " + lastNameEn

                })
            }
        }
        // 1000
        else if (watch("saSanghatakRemark") && !watch("deptClerkRemark") && !watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 1; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn : "-"
                        : "";

                const lastNameEn = i == 0 ?
                    userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
                        ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn : "-"
                    : "";
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.saSanghatakRemark : "",
                    designation: i == 0 ? "Samuh Sanghtak" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.saSanghatakDate
                    ).format("DD-MM-YYYY HH:mm") : "",

                    userName: firstNameEn + " " + lastNameEn

                })
            }

        }    //    0111
        else if (!watch("saSanghatakRemark") && watch("deptClerkRemark") && watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 3; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn : "-"
                            : userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn : "-"

                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn : "-"
                            : userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn : "-"
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.deptClerkRemark : i == 1 ? registrationDetails.asstCommissionerRemark : i == 2 ? registrationDetails.deptyCommissionerRemark : "",
                    designation: i == 0 ? "Department Clerk" : i == 1 ? "Assistant Commissioner" : "Deputy Commissioner",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.deptClerkDate
                    ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
                        registrationDetails.asstCommissionerDate
                    ).format("DD-MM-YYYY HH:mm") : moment(
                        registrationDetails.deptyCommissionerDate
                    ).format("DD-MM-YYYY HH:mm"),
                    userName: firstNameEn + " " + lastNameEn
                })
            }
        }  //0110
        else if (!watch("saSanghatakRemark") && watch("deptClerkRemark") && watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 2; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn : "-"
                            : ""

                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn : "-"
                            : ""
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.deptClerkRemark : i == 1 ? registrationDetails.asstCommissionerRemark : "",
                    designation: i == 0 ? "Department Clerk" : i == 1 ? "Assistant Commissioner" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.deptClerkDate
                    ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
                        registrationDetails.asstCommissionerDate
                    ).format("DD-MM-YYYY HH:mm") : "",
                    userName: firstNameEn + " " + lastNameEn
                })
            }
        }
        // 0101
        else if (!watch("saSanghatakRemark") && watch("deptClerkRemark") && !watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 2; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn : "-"
                            : "";
                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn : "-"
                        : i == 1 ?
                            userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
                                ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn : "-"
                            : ""
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.deptClerkRemark : i == 1 ? registrationDetails.deptyCommissionerRemark : "",
                    designation: i == 0 ? "Department Clerk" : i == 1 ? "Deputy Commissioner" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.deptClerkDate
                    ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
                        registrationDetails.deptyCommissionerDate
                    ).format("DD-MM-YYYY HH:mm") : "",

                    userName: firstNameEn + " " + lastNameEn
                })
            }
        }
        //  0100
        else if (!watch("saSanghatakRemark") && watch("deptClerkRemark") && !watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 1; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn : "-"
                        : "";

                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn : "-"
                        : "";
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.deptClerkRemark : "",
                    designation: i == 0 ? "Department Clerk" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.deptClerkDate
                    ).format("DD-MM-YYYY HH:mm") : "",

                    userName: firstNameEn + " " + lastNameEn

                })
            }
        }
        //  0011
        else if (!watch("saSanghatakRemark") && !watch("deptClerkRemark") && watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 2; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn : "-"
                        : userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn : "-";

                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn : "-"
                        : userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn : "-";
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.asstCommissionerRemark : i == 1 ? registrationDetails.deptyCommissionerRemark : "",
                    designation: i == 0 ? "Assistant Commissioner" : "Deputy Commissioner",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.asstCommissionerDate
                    ).format("DD-MM-YYYY HH:mm") : moment(
                        registrationDetails.deptyCommissionerDate
                    ).format("DD-MM-YYYY HH:mm"),
                    userName: firstNameEn + " " + lastNameEn

                })
            }
        }
        //  0010
        else if (!watch("saSanghatakRemark") && !watch("deptClerkRemark") && watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 1; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn : "-"
                        : "";
                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn : "-"
                        : ""
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.asstCommissionerRemark : "",
                    designation: i == 0 ? "Assistant Commissioner" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.asstCommissionerDate
                    ).format("DD-MM-YYYY HH:mm") : "",

                    userName: firstNameEn + " " + lastNameEn

                })
            }
            // 0001
        }
        // 0001
        else if (!watch("saSanghatakRemark") && !watch("deptClerkRemark") && !watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
            for (var i = 0; i < 1; i++) {
                const firstNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn : "-" : ""

                const lastNameEn =
                    i == 0 ?
                        userLst && userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
                            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn : "-" : ""
                a.push({
                    id: i + 1,
                    remark: i == 0 ? registrationDetails.deptyCommissionerRemark : "",
                    designation: i == 0 ? "Deputy Commissioner" : "",
                    remarkDate: i == 0 ? moment(
                        registrationDetails.deptyCommissionerDate
                    ).format("DD-MM-YYYY HH:mm") : "",
                    userName: firstNameEn + " " + lastNameEn

                })
            }
        }
        setRemarkData([...a])
    }

    // document columns
    const docColumns = [
        {
            field: "id",
            headerName: <FormattedLabel id="srNo"/>,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "title",
            headerName: <FormattedLabel id="docName"/>,
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "filenm",
            headerName: <FormattedLabel id="fileNm"/>,
            headerAlign: "center",
            align: "center",
            flex: 1,
        },

        {
            field: "Action",
            headerName: <FormattedLabel id="view"/>,
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

    // member columns
    const columns = [
        {
            field: "id",
            headerName: <FormattedLabel id="srNo" />,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "fullName",
            headerName: <FormattedLabel id="memFullName" />,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "address",
            headerName: <FormattedLabel id="memFullAdd" />,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "designation",
            headerName: <FormattedLabel id="memDesign" />,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "aadharNumber",
            headerName: <FormattedLabel id="memAdharNo" />,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
    ]



    // approve or revert caalll
    const onRenewal = () => {
        const temp = {
            ...registrationDetails,
            renewalRemarks: watch("renewalRemarks"),
            trnType: null,
            id: null,
            bgRenewalKey: Number(router.query.id),
            trnBachatgatRegistrationMembersList: registrationDetails.trnBachatgatRegistrationMembersList?.map((obj) => {
                return {
                    aadharNumber: obj.aadharNumber,
                    activeFlag: "Y",
                    address: obj.address,
                    bachatgatNo: registrationDetails.bachatgatNo,
                    bachatgatRegistrationKey: router.query.id,
                    designation: obj.designation,
                    fullName: obj.fullName,
                    id: obj.id,
                    trnType: "BGRN"
                }
            }),
            trnBachatgatRegistrationDocumentsList:
                JSON.parse(localStorage.getItem("bsupDocuments"))?.map((obj) => {
                    return {
                        documentPath: obj.documentPath,
                        fileType: obj.documentType,
                        activeFlag: "Y",
                        bachatgatModificationKey: null,
                        bachatgatNo: "BG1682424658888",
                        bachatgatRegistrationKey: router.query.id,
                        bachatgatRenewalKey: null,
                        documentFlow: null,
                        fileType: "PNG",
                        trnType: "BGRN"
                    };
                }),
            saSanghatakRemark: null,
            deptClerkRemark: null,
            asstCommissionerRemark: null,
            deptyCommissionerRemark: null,
            "saSanghatakDate": null,
            "saSanghatakUserId": null,
            "deptClerkDate": null,
            "deptClerkUserId": null,
            "asstCommissionerDate": null,
            "asstCommissionerUserId": null,
            "deptyCommissionerDate": null,
            "deptyCommissionerUserId": null,
            id: null,
            bgRegistrationKey:Number(router.query.id),
        };

        if (loggedUser === "citizenUser") {
            const tempData = axios
                .post(`${urls.BSUPURL}/trnBachatgatRenewal/save`, temp, {
                    headers: {
                        UserId: user.id,
                    },
                })
                .then((res) => {
                    // if (res.status == 201) {
                    //     sweetAlert("Saved!", `Application No ${res.data.message.split('[')[1].split(']')[0]} Renewed succesfully !`);
                    //     // fetchRegistrationDetails()
                    //     // setDataToTable()
                    //     router.push({
                    //         pathname: "/BsupNagarvasthi/transaction/bachatgatRenewal",

                    //     });
                    // }

                    if (res.status == 201) {
                        localStorage.removeItem("bsupDocuments");
                        localStorage.removeItem("bsupAlreadyDocuments");

                        sweetAlert({
                            text: ` Your Bachatgat Renewal Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                            icon: "success",
                            buttons: ["View Acknowledgement", "Go To Dashboard"],
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {
                            if (will) {
                                {
                                    router.push('/BsupNagarvasthi/transaction/bachatgatRenewal')
                                }
                            } else {
                                router.push({
                                    pathname:
                                        "/BsupNagarvasthi/transaction/acknowledgement",
                                    query: { id: res.data.message.split('[')[1].split(']')[0], trn: "BRN" },
                                })
                            }
                        })
                    }
                });
        } else {
            const tempData = axios
                .post(`${urls.BSUPURL}/trnBachatgatRenewal/save`, temp, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    // if (res.status == 201) {
                    //     sweetAlert("Saved!", `Application No ${res.data.message.split('[')[1].split(']')[0]} Renewed succesfully !`, "success");
                    //     // fetchRegistrationDetails()
                    //     // setDataToTable()
                    //     router.push({
                    //         pathname: "/BsupNagarvasthi/transaction/bachatgatRenewal",

                    //     });
                    // }
                    if (res.status == 201) {
                        localStorage.removeItem("bsupDocuments");
                        localStorage.removeItem("bsupAlreadyDocuments");

                        sweetAlert({
                            text: ` Your Bachatgat Renewal Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                            icon: "success",
                            buttons: ["View Acknowledgement", "Go To Dashboard"],
                            dangerMode: false,
                            closeOnClickOutside: false,
                        }).then((will) => {
                            if (will) {
                                {
                                    router.push('/BsupNagarvasthi/transaction/bachatgatRenewal')
                                }
                            } else {
                                router.push({
                                    pathname:
                                        "/BsupNagarvasthi/transaction/acknowledgement",
                                    query: { id: res.data.message.split('[')[1].split(']')[0], trn: "BRN" },
                                })
                            }
                        })
                    }
                });
        }
    };

    // UI
    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={8}
                variant="outlined"
                sx={{
                    border: 1,
                    borderColor: "grey.500",
                    marginLeft: "10px",
                    marginRight: "10px",
                    marginTop: "10px",
                    marginBottom: "60px",
                    padding: 1,
                }}>
                {/* bachatgat details box */}
                <Box
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                    }}
                >
                    <h2>
                        <FormattedLabel id="bachatGatDetails" />
                    </h2>
                </Box>
                <form >
                    <Grid container style={{ padding: "10px" }}>
                        {/* area name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "Center"
                            }}
                        >
                            <FormControl error={errors.areaKey} variant="standard" sx={{ width: "90%" }}>
                                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="areaNm" /></InputLabel>
                                <Controller
                                    render={({ field }) => (
                                        <Select
                                            sx={{ minWidth: 220 }}
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={field.value}
                                            disabled={true}
                                            onChange={(value) => field.onChange(value)}
                                        >
                                            {crAreaNames &&
                                                crAreaNames.map((auditorium, index) => (
                                                    <MenuItem key={index} value={auditorium.id}>
                                                        {auditorium.crAreaName}
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
                        </Grid>

                        {/* Zone Name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "Center"
                            }}
                        >
                            <FormControl error={errors.zoneKey} variant="standard" sx={{ width: "90%" }}>
                                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="zoneNames" /></InputLabel>
                                <Controller
                                    render={({ field }) => (
                                        <Select
                                            disabled={true}
                                            sx={{ minWidth: 220 }}
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                        >
                                            {zoneNames &&
                                                zoneNames.map((auditorium, index) => (
                                                    <MenuItem key={index} value={auditorium.id}>
                                                        {auditorium.zoneName}
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

                        {/* Ward name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "Center"
                            }}
                        >
                            <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.wardKey}>
                                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="wardname" /></InputLabel>
                                <Controller
                                    render={({ field }) => (
                                        <Select
                                            disabled={true}
                                            sx={{ minWidth: 220 }}
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                        >
                                            {wardNames &&
                                                wardNames.map((service, index) => (
                                                    <MenuItem key={index} value={service.id}>
                                                        {service.wardName}
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

                        {/* geo code */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "Center"
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                label={<FormattedLabel id="gisgioCode" />}
                                variant="standard"
                                {...register("geoCode")}
                                error={!!errors.geoCode}
                                helperText={errors?.geoCode ? errors.geoCode.message : null}
                            />
                        </Grid>

                        {/* bachatgat name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            xl={6}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "Center"
                            }}
                        >
                            <TextField
                                id="standard-basic"
                                label={<FormattedLabel id="bachatgatFullName" />}
                                sx={{ width: "90%" }}
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                variant="standard"
                                {...register("bachatgatName")}
                                error={!!errors.bachatgatName}
                                helperText={errors?.bachatgatName ? errors.bachatgatName.message : null}
                            />
                        </Grid>

                        {/* bachatgat category */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "Center"
                            }}
                        >
                            <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.categoryKey}>
                                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="bachatgatCat" /></InputLabel>
                                <Controller
                                    render={({ field }) => (
                                        <Select
                                            disabled={true}
                                            sx={{ minWidth: 220 }}
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                        >
                                            {bachatGatCategory &&
                                                bachatGatCategory.map((service, index) => (
                                                    <MenuItem key={index} value={service.id}>
                                                        {service.bachatGatCategoryName}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    )}
                                    name="categoryKey"
                                    control={control}
                                    defaultValue=""
                                />
                                <FormHelperText>{errors?.categoryKey ? errors.categoryKey.message : null}</FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* Bachat Gat start date */}
                        <Grid item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}>
                            <FormControl
                                variant="standard"
                                style={{ marginTop: 2, }}
                                error={!!errors.fromDate}
                            >
                                <Controller
                                    control={control}
                                    name="startDate"
                                    // sx={{ minWidth: "80%" }}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                            disabled={true}
                                                // sx={{ minWidth: "80%" }}
                                                variant="standard"
                                                inputFormat="DD/MM/YYYY"
                                                label={<span style={{ fontSize: 16 }}>
                                                    {<FormattedLabel id="bachatgatStartDate" />}</span>}
                                                value={field.value}
                                                onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                                selected={field.value}
                                                center
                                                renderInput={(params) => (
                                                    <TextField {...params} size="small" variant="standard" sx={{ width: 280 }} />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                <FormHelperText>{errors?.startDate ? errors.startDate.message : null}</FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* bachatgat address box */}
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                width: "100vw",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2>
                                <FormattedLabel id="bachatgatAddress" />
                            </h2>
                        </Box>

                        {/* president first name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="presidentFirstName" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("presidentFirstName")}
                                error={!!errors.presidentFirstName}
                                helperText={errors?.presidentFirstName ? errors.presidentFirstName.message : null}
                            />
                        </Grid>

                        {/* bahcatgat middle name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="presidentFatherName" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("presidentMiddleName")}
                                error={!!errors.presidentMiddleName}
                                helperText={errors?.presidentMiddleName ? errors.presidentMiddleName.message : null}
                            />
                        </Grid>

                        {/* bahcatgat last name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="presidentLastName" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("presidentLastName")}
                                error={!!errors.presidentLastName}
                                helperText={errors?.presidentLastName ? errors.presidentLastName.message : null}

                            />
                        </Grid>

                        {/* total member */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Tooltip title="Gat Total Members Count">
                                <TextField
                                    id="standard-basic"
                                    label={<FormattedLabel id="totalCount" />}
                                    variant="standard"
                                    disabled={true}
                                    InputLabelProps={{ shrink: true }}
                                    type="number"
                                    sx={{
                                        width: "90%",
                                    }}
                                    {...register("totalMembersCount")}
                                    error={!!errors.totalMembersCount}
                                    helperText={errors?.totalMembersCount ? errors.totalMembersCount.message : null}
                                />
                            </Tooltip>
                        </Grid>

                        {/* building no */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="flatBuildNo" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("flatBuldingNo")}
                                error={!!errors.flatBuldingNo}
                                helperText={errors?.flatBuldingNo ? errors.flatBuldingNo.message : null}
                            />
                        </Grid>

                        {/* building name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="buildingNm" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("buildingName")}
                                error={!!errors.buildingName}
                                helperText={errors?.buildingName ? errors.buildingName.message : null}
                            />
                        </Grid>

                        {/* Road Name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="roadName" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("roadName")}
                                error={!!errors.roadName}
                                helperText={errors?.roadName ? errors.roadName.message : null}
                            />
                        </Grid>

                        {/* Landmark */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="landmark" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("landmark")}
                                error={!!errors.landmark}
                                helperText={errors?.landmark ? errors.landmark.message : null}

                            />
                        </Grid>

                        {/* Pin Code */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="pincode" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("pinCode")}
                                error={!!errors.pinCode}
                                helperText={errors?.pinCode ? errors.pinCode.message : null}
                            />
                        </Grid>

                        {/*   Applicant Name Details*/}
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                width: "100vw",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2>
                                <FormattedLabel id="applicantDetails" />
                            </h2>
                        </Box>

                        {/* applicant first name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="applicantFirstName" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("applicantFirstName")}
                                error={!!errors.applicantFirstName}
                                helperText={errors?.applicantFirstName ? errors.applicantFirstName.message : null}
                            />
                        </Grid>

                        {/* applicant middle name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                label={<FormattedLabel id="applicantMiddleName" />}
                                variant="standard"
                                {...register("applicantMiddleName")}
                                error={!!errors.applicantMiddleName}
                                helperText={errors?.applicantMiddleName ? errors.applicantMiddleName.message : null}
                            />
                        </Grid>

                        {/* applicant last name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "85%" }}
                                id="standard-basic"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                label={<FormattedLabel id="applicantLastName" />}
                                variant="standard"
                                {...register("applicantLastName")}
                                error={!!errors.applicantLastName}
                                helperText={errors?.applicantLastName ? errors.applicantLastName.message : null}
                            />
                        </Grid>

                        {/* Landline No. */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "85%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="landlineNo" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("landlineNo")}
                                error={!!errors.landlineNo}
                                helperText={errors?.landlineNo ? errors.landlineNo.message : null}
                            />
                        </Grid>

                        {/* mobile no */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                label={<FormattedLabel id="mobileNo" />}
                                variant="standard"
                                {...register("mobileNo")}
                                error={!!errors.mobileNo}
                                helperText={errors?.mobileNo ? errors.mobileNo.message : null}
                            />
                        </Grid>

                        {/* Email Id */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                label={<FormattedLabel id="emailId" />}
                                variant="standard"
                                {...register("emailId")}
                                error={!!errors.emailId}
                                helperText={errors?.emailId ? errors.emailId.message : null}
                            />
                        </Grid>

                        {/* bank details box */}
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                width: "100vw",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2>
                                <FormattedLabel id="bankDetails" />
                            </h2>
                        </Box>

                        {/* bank name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="bankName" />}
                                variant="standard"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={true}
                                {...register("bankNameId")}
                                error={!!errors.bankNameId}

                                helperText={errors?.bankNameId ? errors.bankNameId.message : null}
                            />
                        </Grid>

                        {/* Branch Name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="branchName" />}
                                variant="standard"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={true}
                                {...register("branchName")}
                                error={!!errors.branchName}
                                helperText={errors?.branchName ? errors.branchName.message : null}
                            />
                        </Grid>

                        {/* Saving Account No */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="accountNo" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("accountNo")}
                                error={!!errors.accountNo}
                                helperText={errors?.accountNo ? errors.accountNo.message : null}
                            />
                        </Grid>

                        {/* Saving Account Name */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="accountHolderName" />}
                                variant="standard"
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                {...register("bankAccountFullName")}
                                error={!!errors.bankAccountFullName}
                                helperText={errors?.bankAccountFullName ? errors.bankAccountFullName.message : null}
                            />
                        </Grid>

                        {/* ifsc code */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="bankIFSC" />}
                                variant="standard"
                                {...register("ifscCode")}
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.ifscCode}
                                helperText={errors?.ifscCode ? errors.ifscCode.message : null}
                            />
                        </Grid>

                        {/* Bank MICR Code */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                sx={{ width: "90%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="bankMICR" />}
                                variant="standard"
                                {...register("bankMICR")}
                                disabled={true}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.bankMICR}
                                helperText={errors?.bankMICR ? errors.bankMICR.message : null}
                            />
                        </Grid>

                        {/* Bachat Gat start date */}
                        {/* <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                            <FormControl
                                variant="standard"
                                style={{ marginTop: 10, marginLeft: 20, marginTop: "5px" }}
                                error={!!errors.fromDate}
                            >
                                <Controller
                                    control={control}
                                    name="startDate"
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                                disabled={true}
                                                InputLabelProps={{ shrink: true }}
                                                variant="standard"
                                                inputFormat="DD/MM/YYYY"
                                                label={<span style={{ fontSize: 16 }}>
                                                    {<FormattedLabel id="startDate" />}</span>}
                                                value={field.value}
                                                onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                                selected={field.value}
                                                center
                                                renderInput={(params) => (
                                                    <TextField {...params} size="small" variant="standard" sx={{ width: 320 }} />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                <FormHelperText>{errors?.startDate ? errors.startDate.message : null}</FormHelperText>
                            </FormControl>
                        </Grid> */}

                        {/* member info box */}
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                width: "100vw",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2>
                                <FormattedLabel id="memberInfo" />
                            </h2>
                        </Box>
                        {/* members show in table */}
                        <DataGrid
                            autoHeight
                            sx={{
                                marginTop: 5,
                                overflowY: "scroll",
                                overflowX: "scroll",
                                "& .MuiDataGrid-virtualScrollerContent": {},
                                "& .MuiDataGrid-columnHeadersInner": {
                                    backgroundColor: "#556CD6",
                                    color: "white",
                                },
                                "& .MuiDataGrid-cell:hover": {
                                    color: "primary.main",
                                },
                                flexDirection: "column",
                                overflowX: "scroll",
                            }}
                            autoWidth
                            density="standard"
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            rows={memberList}
                            columns={columns}
                        />
                        {/* Required documents */}
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "10px",
                                width: "100vw",
                                background:
                                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                        >
                            <h2>
                                <FormattedLabel id="uploadedDoc" />
                            </h2>
                        </Box>

                        {/* document columns */}
                        <DataGrid
                            autoHeight
                            sx={{
                                marginTop: 5,
                                overflowY: "scroll",
                                overflowX: "scroll",
                                "& .MuiDataGrid-virtualScrollerContent": {},
                                "& .MuiDataGrid-columnHeadersInner": {
                                    backgroundColor: "#556CD6",
                                    color: "white",
                                },
                                "& .MuiDataGrid-cell:hover": {
                                    color: "primary.main",
                                },
                                flexDirection: "column",
                                overflowX: "scroll",
                            }}
                            autoWidth
                            density="standard"
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            rows={fetchDocument}
                            columns={docColumns}
                        />
                        <Divider />
                    </Grid>

                    {/* Required documents */}
                    <Box
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            width: "100vw",
                            background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                    >
                        <h2>
                            <FormattedLabel id="renewalSection" />
                        </h2>
                    </Box>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="renewalRemark" />}
                            variant="standard"
                            {...register("renewalRemarks")}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.renewalRemarks}
                            helperText={errors?.renewalRemarks ? errors.renewalRemarks.message : null}
                        />
                    </Grid>

                    {/* doc table */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "40px" }}>
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
                            <Box sx={{ width: "88%" }}>
                                <Document
                                    appName="BSUP"
                                    serviceName="BSUP-BachatgatRegistration"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    {/* save cancel button button */}
                    <Grid container>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button
                                sx={{}}
                                // type="submit"
                                size="medium"
                                // disabled={watch("renewalRemark")?true:false}
                                variant="contained"
                                color="primary"
                                onClick={onRenewal}
                                endIcon={<SaveIcon />}
                            >
                                <FormattedLabel id="renew" />
                            </Button>
                        </Grid>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button
                                size="medium"
                                variant="contained"
                                color="primary"
                                endIcon={<ClearIcon />}
                                onClick={() => cancellButton()}
                            >
                                <FormattedLabel id="clear" />
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </ThemeProvider>
    );
};

export default BachatGatCategory;
