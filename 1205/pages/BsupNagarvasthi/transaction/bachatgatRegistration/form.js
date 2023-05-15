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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "../../../../theme";
import UploadButton from "../../singleFileUploadButton/UploadButton";

import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import bachatgatRegistration from "../../../../containers/schema/BsupNagarvasthiSchema/bachatgatRegistration";
import Document from "../../uploadDocuments/Documents";
import { yupResolver } from "@hookform/resolvers/yup";


const BachatGatCategory = () => {
    const {
        reset,
        register,
        control,
        watch,
        handleSubmit,
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

    const router = useRouter();
    localStorage.removeItem("bsupDocuments");
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: "trnBachatgatRegistrationMembersList",
        control,
    });
    const language = useSelector((state) => state.labels.language);
    const [showAlert, setAlert] = useState(false)
    const [areaId, setAreaId] = useState([]);
    const [zoneNames, setZoneNames] = useState([]);
    const [wardNames, setWardNames] = useState([]);
    const [crAreaNames, setCRAreaName] = useState([]);
    const [bankMaster, setBankMasters] = useState([]);
    const [bachatGatCategory, setBachatGatCategory] = useState([]);
    const user = useSelector((state) => state.user.user);
    const loggedUser = localStorage.getItem("loggedInUser")
    const [count, setCount] = useState(0)
    const [id, setID] = useState()
    const [memberDesignation, setMemberDesignation] = useState([])
    const [areaNm, setAreaNm] = useState(null)
    let userCitizen = useSelector((state) => {
        return state?.user?.user
    });
    const [docUpload, setDocUpload] = useState([]);


    // set citizen personal details
    useEffect(() => {
        if (loggedUser === "citizenUser") {
            setValue("applicantFirstName", language == "en" ? userCitizen?.firstName : userCitizen?.firstNamemr)
            setValue("applicantMiddleName", language == "en" ? userCitizen?.middleName : userCitizen?.middleNamemr)
            setValue("applicantLastName", language == "en" ? userCitizen?.surname : userCitizen?.surnamemr)
            setValue("emailId", userCitizen?.emailID)
            setValue("mobileNo", userCitizen?.mobile)
        }
    }, [userCitizen])




    useEffect(() => {
        const res = []
        // for (var i = memberDesignation.length - 1; i >= 0; i--) {
        //     for (var j = 0; j < fields.length; j++) {
        //         if (memberDesignation[i].department === fields[j].designation) {
        //             memberDesignation.splice(i, 1);
        //         }
        //     }
        // }
        // setMemberDesignation(memberDesignation)
        console.log("res wihtout ", memberDesignation)

    }, [fields])


    useEffect(() => {
        getZoneName();
        getWardNames();
        getCRAreaName();
        getBachatGatCategory();
        getBank();
        const array = [
            { id: 1, department: "President" },
            { id: 2, department: "Vice-President" },
            { id: 3, department: "Secretary" },
            { id: 4, department: "Member" },
        ]
        setMemberDesignation([...array])

        setDocUpload([{
            id: 1,
            title: "Passbook Front Page",
            documentPath: "",
        },
        {
            id: 2,
            title: "Passbook Back Page",
            documentPath: "",
        }]);

    }, []);

    useEffect(() => {
        setAreaNm(crAreaNames &&
            crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
            ? crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
            : "-")
    }, [watch("areaKey")]);


    useEffect(() => {
        console.log("areaNm", areaNm)
        if (areaNm != "-" && areaNm != null) {
            getAreas()
        }
    }, [areaNm])

    const getAreas = () => {
        axios
            .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAreaName?moduleId=23&areaName=${watch("areaName")}`)
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
                        setValue("zoneKey", "");
                        setValue("wardKey", "");
                        sweetAlert({
                            title: "OOPS!",
                            text: "There are no areas match with your search!",
                            icon: "warning",
                            dangerMode: true,
                            closeOnClickOutside: false,
                        });
                    }
                } else {
                    setValue("zoneKey", "");
                    setValue("wardKey", "");
                    sweetAlert({
                        title: "OOPS!",
                        text: "Something went wrong!",
                        icon: "error",
                        dangerMode: true,
                        closeOnClickOutside: false,
                    });
                }
            })
            .catch((error1) => {
                setValue("zoneKey", "");
                setValue("wardKey", "");
                sweetAlert({
                    title: "OOPS!",
                    text: `${error1}`,
                    icon: "error",
                    dangerMode: true,
                    closeOnClickOutside: false,
                });
            });
    };


    useEffect(() => {
        if (watch("areaKey")) {
            let filteredArrayZone = areaId?.filter((obj) => obj?.areaId === watch("areaKey"));

            console.log("filteredArrayZone ", filteredArrayZone)
            let flArray1 = zoneNames?.filter((obj) => {
                return filteredArrayZone?.some((item) => {
                    return item?.zoneId === obj?.id;
                });
            });

            let flArray2 = wardNames?.filter((obj) => {
                return filteredArrayZone?.some((item) => {
                    return item?.wardId === obj?.id;
                });
            });
            console.log(":flArray1", flArray2[0]?.id);

            setValue("zoneKey", flArray1[0]?.id);
            setValue("wardKey", flArray2[0]?.id);
        } else {
            setValue("zoneKey", "");
            setValue("wardKey", "");
        }
    }, [areaId]);


    const checkAdhar = (value) => {
        if (value != undefined && value) {
            if (loggedUser === "citizenUser") {
                const tempData = axios
                    .get(`${urls.BSUPURL}/trnBachatgatRegistrationMembers/isMemberAlreadyExist?aadharNo=${value}`, {
                        headers: {
                            UserId: user.id,
                        },
                    })
                    .then((res) => {
                        // if (res.status == 201) {
                        console.log(res.data.message)
                        if (res.data.message == "Member Exist in our system..") {
                            // alert("Member Exist in our system")
                            sweetAlert("Member Exist in our system")
                            setAlert(true)
                        } else {
                            setAlert(false)
                        }
                        // }
                    });
            } else {
                const tempData = axios
                    .get(`${urls.BSUPURL}/trnBachatgatRegistrationMembers/isMemberAlreadyExist?aadharNo=${value}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((res) => {
                        // if (res.status == 201) {
                        console.log(res.data.message)
                        if (res.data.message == "Member Exist in our system..") {
                            sweetAlert("Member Exist in our system")
                            setAlert(true)
                        } else {
                            setAlert(false)
                        }

                        // }
                    });
            }
        }
    }

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

    //load ward details
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

    // load AreaName
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
            return r.data.bank;
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


    // add member ui dynamically
    const appendUI = () => {
        setCount(count < 20 ? count + 1 : count);
        if (showAlert) {
            sweetAlert("Member Exist in our system")
        } else if (count <= 20) {
            append({
                // applicationName: "",
                // roleName: "",
            });

        } else {
            sweetAlert("Members are less than 20")
        }
    };

    // save bachatgat registration
    const onSubmitForm = (formData) => {
        console.log(docUpload)

        if (showAlert) {
            sweetAlert("Member Exist in our system")
        } else {
            const finalBodyForApi = {
                ...formData,
                trnBachatgatRegistrationDocumentsList:
                    JSON.parse(localStorage.getItem("bsupDocuments"))?.map((obj) => {
                        return {
                            "activeFlag": "Y",
                            "bachatgatModificationKey": null,
                            "bachatgatNo": obj.bachatgatNo,
                            bachatgatRegistrationKey: null,
                            // "bachatgatRegistrationKey": router.query.id,
                            "bachatgatRenewalKey": null,
                            "documentFlow": null,
                            "documentPath": obj.documentPath,
                            "documentTypeKey": null,
                            "fileType": obj.documentType,
                            "serviceWiseChecklistKey": null,
                            "trnBachatgatRegistrationDocumentsList": null,
                            "trnType": "BGR"
                        };
                    }),
                trnBachatgatRegistrationMembersList: formData.trnBachatgatRegistrationMembersList,
                "passbookFrontPage": docUpload && docUpload.find((obj) =>
                    obj.title == "Passbook Front Page")?.documentPath,

                "passbookLastPage": docUpload && docUpload.find((obj) =>
                    obj.title == "Passbook Back Page")?.documentPath,

                "frontPageFileType": docUpload && docUpload.find((obj) =>
                    obj.title == "Passbook Front Page")?.documentPath.split(".").pop(),
                "lastPageFileType": docUpload && docUpload.find((obj) =>
                    obj.title == "Passbook Back Page")?.documentPath.split(".").pop()

            };
            console.log("finalBodyForApi ", finalBodyForApi)
            if (loggedUser === "citizenUser") {
                const tempData = axios
                    .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, finalBodyForApi, {
                        headers: {
                            UserId: user.id,
                        },
                    })
                    .then((res) => {
                        if (res.status == 201) {
                            localStorage.removeItem("bsupDocuments");
                            localStorage.removeItem("bsupAlreadyDocuments");

                            sweetAlert({
                                text: ` Your Bachatgat Registration No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                icon: "success",
                                buttons: ["View Acknowledgement", "Go To Dashboard"],
                                dangerMode: false,
                                closeOnClickOutside: false,
                            }).then((will) => {
                                if (will) {
                                    {
                                        router.push('/BsupNagarvasthi/transaction/bachatgatRegistration')
                                    }
                                } else {
                                    router.push({
                                        pathname:
                                            "/BsupNagarvasthi/transaction/acknowledgement",
                                        query: { id: res.data.message.split('[')[1].split(']')[0], trn: "R" },
                                    })
                                }
                            })
                        }
                    });
            } else {
                const tempData = axios
                    .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, finalBodyForApi, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((res) => {
                        if (res.status == 201) {
                            localStorage.removeItem("bsupDocuments");
                            localStorage.removeItem("bsupAlreadyDocuments");

                            sweetAlert({
                                text: ` Your Bachatgat Registration No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
                                icon: "success",
                                buttons: ["View Acknowledgement", "Go To Dashboard"],
                                dangerMode: false,
                                closeOnClickOutside: false,
                            }).then((will) => {
                                if (will) {
                                    {
                                        router.push('/BsupNagarvasthi/transaction/bachatgatRegistration')
                                    }
                                } else {
                                    router.push({
                                        pathname:
                                            "/BsupNagarvasthi/transaction/acknowledgement",
                                        query: { id: res.data.message.split('[')[1].split(']')[0], trn: "R" },
                                    })
                                }
                            })
                        }
                    });
            }
        }
    };

    const cancellButton = () => {
        reset({
            ...resetValuesCancell,
            id,
        });
    };

    const resetValuesCancell = {
        geoCode: "",
        cfcApplicationNo: "",
        applicationNo: "",
        flatBuildingNo: "",
        buildingName: "",
        roadName: "",
        bachatgatName: "",
        landlineNo: "",
        buildingName: "",
        accountNo: "",
        bankAccountFullName: "",
        roadName: "",
        ifscCode: "",
        micrCode: "",
        flatBuldingNo: "",
        totalMembersCount: "",
        branchName: "",
        category: "",
        landmark: "",
        pinCode: "",
        presidentFirstName: "",
        presidentMiddleName: "",
        presidentLastName: "",
        startDate: null,
        areaKey: "",
        zoneKey: "",
        wardKey: ""
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
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid container style={{ padding: "10px" }}>
                        {/* Area Name */}
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
                                        // autoFocus
                                        style={{
                                            backgroundColor: "white",
                                            width: "300px",
                                            // color: "black",
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
                                    <FormControl style={{ minWidth: "200px" }} error={!!errors.areaKey}>
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
                                                                {language === "en" ? areaId?.areaName : areaId?.areaNameMr}
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

                                    {/* ////////////////// */}
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
                                                        {language === "en" ? auditorium.zoneName : auditorium.zoneNameMr}
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
                                                        {language === "en" ? service.wardName : service.wardNameMr}
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

                        {/* geoCode */}
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
                                label={<FormattedLabel id="gisgioCode" />}
                                variant="standard"
                                {...register("geoCode")}
                                error={!!errors.geoCode}
                                helperText={errors?.geoCode ? errors.geoCode.message : null}
                            />
                        </Grid>

                        {/* bachatgat category name */}
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
                                <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="bachatgatCat" />
                                </InputLabel>
                                <Controller
                                    render={({ field }) => (
                                        <Select
                                            sx={{ minWidth: 220 }}
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                        >
                                            {bachatGatCategory &&
                                                bachatGatCategory.map((service, index) => (
                                                    <MenuItem key={index} value={service.id}>
                                                        {language == "en" ? service.bachatGatCategoryName : service.bachatGatCategoryNameMr}
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
                                variant="standard"
                                {...register("bachatgatName")}
                                error={!!errors.bachatgatName}
                                helperText={errors?.bachatgatName ? errors.bachatgatName.message : null}
                            />
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
                                style={{ marginTop: 2, marginLeft: 10 }}
                                error={!!errors.fromDate}
                            >
                                <Controller
                                    control={control}
                                    name="startDate"
                                    sx={{ minWidth: "80%" }}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                                sx={{ minWidth: "80%" }}
                                                variant="standard"
                                                inputFormat="DD/MM/YYYY"
                                                label={<span style={{ fontSize: 16 }}>
                                                    {<FormattedLabel id="bachatgatStartDate" />}</span>}
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
                        </Grid>

                        {/* extra div */}
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{ display: "flex", justifyContent: "center" }}
                        ></Grid>

                        {/* {/* bachatgat  address box*/}
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
                                {...register("presidentFirstName")}
                                error={!!errors.presidentFirstName}
                                helperText={errors?.presidentFirstName ? errors.presidentFirstName.message : null}
                            />
                        </Grid>

                        {/* president middle name */}
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
                                {...register("presidentMiddleName")}
                                error={!!errors.presidentMiddleName}
                                helperText={errors?.presidentMiddleName ? errors.presidentMiddleName.message : null}
                            />
                        </Grid>

                        {/* president last name */}
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
                                {...register("presidentLastName")}
                                error={!!errors.presidentLastName}
                                helperText={errors?.presidentLastName ? errors.presidentLastName.message : null}
                            />
                        </Grid>

                        {/* total members count */}
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
                                {...register("pinCode")}
                                error={!!errors.pinCode}
                                helperText={errors?.pinCode ? errors.pinCode.message : null}
                            />
                        </Grid>

                        {/*  Applicant Name Details box*/}
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
                                disabled={loggedUser === "citizenUser" ? true : false}
                                label={<FormattedLabel id="applicantFirstName" />}
                                variant="standard"
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
                                disabled={loggedUser === "citizenUser" ? true : false}
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
                                disabled={loggedUser === "citizenUser" ? true : false}
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
                                disabled={loggedUser === "citizenUser" ? true : false}
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
                                disabled={loggedUser === "citizenUser" ? true : false}
                                label={<FormattedLabel id="emailId" />}
                                variant="standard"
                                {...register("emailId")}
                                error={!!errors.emailId}
                                helperText={errors?.emailId ? errors.emailId.message : null}
                            />
                        </Grid>

                        {/* Bank details box */}
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

                        {/* Bank name */}
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
                            <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.bankBranchKey}>
                                <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="bankName" /></InputLabel>
                                <Controller
                                    render={({ field }) => (
                                        <Select
                                            sx={{ minWidth: 220 }}
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                        >
                                            {bankMaster &&
                                                bankMaster.map((service, index) => (
                                                    <MenuItem key={index} value={service.id}>
                                                        {language == "en" ? service.bankName : service.bankNameMr}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    )}
                                    name="bankBranchKey"
                                    control={control}
                                    defaultValue=""
                                />
                                <FormHelperText>{errors?.bankBranchKey ? errors.bankBranchKey.message : null}</FormHelperText>
                            </FormControl>
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

                                error={!!errors.ifscCode}
                                helperText={errors?.ifscCode ? errors.bankIFSC.message : null}
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
                                {...register("micrCode")}
                                error={!!errors.micrCode}
                                helperText={errors?.micrCode ? errors.micrCode.message : null}
                            />
                        </Grid>

                        


                        <Grid container sx={{ padding: "10px" }}>
                            {docUpload &&
                                docUpload.map((obj, index) => {
                                    return (
                                        <Grid
                                            container
                                            sx={{
                                                padding: "20px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "baseline",
                                                backgroundColor: "whitesmoke",
                                            }}>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={1}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "start",
                                                    alignItems: "baseline",
                                                }}
                                            >
                                                <strong>{index + 1}</strong>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={7}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "start",
                                                    alignItems: "baseline",
                                                }}
                                            >
                                                <strong>{obj?.title}</strong>
                                            </Grid>
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
                                                    alignItems: "baseline",
                                                }}
                                            >
                                                <UploadButton
                                                    appName="BSUP"
                                                    serviceName="BSUP-BachatgatRegistration"
                                                    label={<FormattedLabel id="uploadDocs" />}
                                                    filePath={obj.documentPath}
                                                    objId={obj.id}
                                                    uploadDoc={docUpload}
                                                    setUploadDoc={setDocUpload}
                                                />
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                        </Grid>

                        {/* Member information box */}
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

                        {/* add more btn */}
                        <Grid container>
                            <Grid item xs={12} style={{ display: "flex", justifyContent: "end", margin: "10px" }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                        appendUI();
                                    }}
                                >
                                    <FormattedLabel id="addMore" />
                                </Button>
                            </Grid>
                        </Grid>

                        {/* rendering members details */}
                        <Grid container style={{ backgroundColor: "white" }}>
                            {fields.map((_parawise, index) => {
                                return (
                                    <>
                                        <Grid
                                            item
                                            xs={2.5}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <TextField
                                                label={<FormattedLabel id="memFullName" />}
                                                size="small"
                                                {...register(`trnBachatgatRegistrationMembersList.${index}.fullName`)}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={2.5}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <TextField
                                                label={<FormattedLabel id="memFullAdd" />}
                                                size="small"
                                                {...register(`trnBachatgatRegistrationMembersList.${index}.address`)}
                                            />
                                        </Grid>
                                        <Grid
                                            xs={2.5}
                                            item
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <FormControl
                                                error={!!errors.designation}
                                                variant="standard"
                                                fullWidth
                                                size="small"
                                                sx={{ marignTop: 20 }}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    <FormattedLabel id="memDesign" /></InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            sx={{ minWidth: 230, marignTop: "10px" }}
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            label="Member Designation"
                                                            value={field.value}
                                                            onChange={(value) => { field.onChange(value) }}
                                                        >
                                                            {console.log("DD ", memberDesignation)}
                                                            {
                                                                memberDesignation && memberDesignation.map((auditorium, index) => (
                                                                    <MenuItem key={index} value={auditorium.department}>
                                                                        {auditorium.department}
                                                                    </MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    )}
                                                    {...register(`trnBachatgatRegistrationMembersList.${index}.designation`)}
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.designation ? errors?.designation.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={2.5}
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <TextField
                                                onMouseLeave={(e) => {
                                                    checkAdhar(e.target.value)
                                                }}
                                                label={<FormattedLabel id="memAdharNo" />}
                                                size="small"
                                                {...register(`trnBachatgatRegistrationMembersList.${index}.aadharNumber`)}
                                            />
                                        </Grid>

                                        {console.log("Field ", fields[0].fullName)}
                                        {index != 0 && <Grid
                                            item
                                            xs={2}
                                            style={{
                                                display: "flex",
                                                justifyContent: "end",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                style={{
                                                    color: "white",
                                                    backgroundColor: "red",
                                                    height: "30px",
                                                }}
                                                onClick={() => {
                                                    remove(index);
                                                }}
                                            >
                                                <FormattedLabel id="delete" />
                                            </Button>
                                        </Grid>}
                                    </>
                                );
                            })}
                        </Grid>

                        {/* required document box */}
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
                                <FormattedLabel id="requiredDoc" />
                            </h2>
                        </Box>

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
                                    type="submit"
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<SaveIcon />}
                                >
                                    <FormattedLabel id="save" />
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

                        <Divider />
                    </Grid>
                </form>
            </Paper>
        </ThemeProvider>
    );
};

export default BachatGatCategory;
