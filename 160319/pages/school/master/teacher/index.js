// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
    Box, Button, Divider, FormControl,
    FormHelperText,
    Grid, InputLabel,
    MenuItem,
    Paper,
    Select,
    Slide,
    TextField
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
    DataGrid
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import sweetAlert from "sweetalert";
import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/subDivisionSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";
import teacherSchema from "../../../../containers/schema/school/masters/teacherSchema";

const Index = () => {
    const {
        register,
        control,
        handleSubmit,
        methods,
        reset,
        watch,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
        resolver: yupResolver(teacherSchema),
        mode: "onChange",

    });
    const language = useSelector((state) => state.labels.language);
    const router = useRouter();
    const [dataSource, setDataSource] = useState([]);
    const [id, setID] = useState();

    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [fetchData, setFetchData] = useState(null);

    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [buttonInputState, setButtonInputState] = useState();
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [slideChecked, setSlideChecked] = useState(false);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
    const [schoolList, setSchoolList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const schoolId = watch("schoolKey");

    // For Paginantion
    const [data, setData] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
    });

    useEffect(() => {
        setLabels(schoolLabels[language ?? "en"]);
    }, [setLabels, language]);


    useEffect(() => {
        const getSchoolList = async () => {
            try {
                const { data } = await axios.get(`${urls.SCHOOL}/mstSchool/getAll`);
                const schools = data.mstSchoolList.map(({ id, schoolName }) => ({ id, schoolName }));
                setSchoolList(schools);
            } catch (e) {
                setError(e.message);
                setIsOpen(true);
            }
        };


        getSchoolList();
    }, []);


    const cancellButton = () => {
        reset({
            ...resetValuesCancell,
            id,
        });
    };


    useEffect(() => {
        getTeachersMaster();
    }, [fetchData]);


    // Get Table - Data
    const getTeachersMaster = (_pageSize = 10, _pageNo = 0) => {
        // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
        axios
            .get(`${urls.SCHOOL}/mstTeacher/getAll`, {
                params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                },
            })
            .then((r) => {
                let result = r.data.mstTeacherList;
                console.log("mstTeacherList", result);

                let _res = result.map((r, i) => {
                    return {
                        activeFlag: r.activeFlag,
                        id: r.id,
                        srNo: i + 1,
                        schoolName: r.schoolName ? r.schoolName : "-",
                        schoolKey: r.schoolKey,
                        teacherName: `${r.firstName} ${r.middleName} ${r.lastName}`,
                        contactDetails: r.contactDetails,
                        emailDetails: r.emailDetails,
                        aadharNumber: r.aadharNumber,
                        firstName: r.firstName,
                        middleName: r.middleName,
                        lastName: r.lastName,
                        gender: r.gender,
                        motherTongueName: r.motherTongueName,
                        permanentAddress: r.permanentAddress,
                        pincode: r.pincode,
                    };
                });
                console.log("Result", _res);
                setDataSource([..._res]);
                setData({
                    rows: _res,
                    totalRows: r.data.totalElements,
                    rowsPerPageOptions: [10, 20, 50, 100],
                    pageSize: r.data.pageSize,
                    page: r.data.pageNo,
                });
            });
    };


    const onSubmitForm = (formData) => {
        console.log("fromData", formData);
        // Save - DB
        let _body = {
            ...formData,
            activeFlag: formData.activeFlag,
            schoolName: schoolList?.find((item) => item?.id === schoolId)?.schoolName,
        };
        if (btnSaveText === "Save") {
            console.log("_body", _body);
            const tempData = axios
                .post(`${urls.SCHOOL}/mstTeacher/save`, _body)
                .then((res) => {
                    console.log("res---", res);
                    if (res.status == 201) {
                        sweetAlert("Saved!", "Record Saved successfully !", "success");
                        setButtonInputState(false);
                        setIsOpenCollapse(false);
                        setFetchData(tempData);
                        setEditButtonInputState(false);
                        setDeleteButtonState(false);
                    }
                });

        }
        // Update Data Based On ID
        else if (btnSaveText === "Update") {
            console.log("_body", _body);
            const tempData = axios
                .post(`${urls.SCHOOL}/mstTeacher/save`, _body)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        formData.id
                            ? sweetAlert(
                                "Updated!",
                                "Record Updated successfully !",
                                "success"
                            )
                            : sweetAlert("Saved!", "Record Saved successfully !", "success");
                        getTeachersMaster();
                        // setButtonInputState(false);
                        setEditButtonInputState(false);
                        setDeleteButtonState(false);
                        setIsOpenCollapse(false);
                    }
                });
        }
    };


    const deleteById = (value, _activeFlag) => {
        let body = {
            activeFlag: _activeFlag,
            id: value,
        };
        console.log("body", body);
        if (_activeFlag === "N") {
            swal({
                title: "Inactivate?",
                text: "Are you sure you want to Inactivate this Record ? ",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                console.log("inn", willDelete);
                if (willDelete === true) {
                    axios
                        .post(`${urls.SCHOOL}/mstTeacher/save`, body)
                        .then((res) => {
                            console.log("delet res", res);
                            if (res.status == 201) {
                                swal("Record is Successfully Deleted!", {
                                    icon: "success",
                                });
                                getTeachersMaster();
                                setButtonInputState(false)
                                // setButtonInputState(false);
                            }
                        });
                } else if (willDelete == null) {
                    swal("Record is Safe");
                }
            });
        } else {
            swal({
                title: "Activate?",
                text: "Are you sure you want to Activate this Record ? ",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                console.log("inn", willDelete);
                if (willDelete === true) {
                    axios
                        .post(`${urls.SCHOOL}/mstTeacher/save`, body)
                        .then((res) => {
                            console.log("delet res", res);
                            if (res.status == 201) {
                                swal("Record is Successfully Deleted!", {
                                    icon: "success",
                                });
                                // getPaymentRate();
                                getTeachersMaster();
                                setButtonInputState(false);
                            }
                        });
                } else if (willDelete == null) {
                    swal("Record is Safe");
                }
            });
        }
    };



    const exitButton = () => {
        reset({
            ...resetValuesExit,
        });
        setButtonInputState(false);
        setSlideChecked(false);
        setSlideChecked(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
    };

    const resetValuesCancell = {
        schoolKey: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        contactDetails: "",
        emailDetails: "",
        aadharNumber: "",
        motherTongueName: "",
        permanentAddress: "",
        pincode: "",

    };

    const resetValuesExit = {
        id: null,
        schoolKey: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        contactDetails: "",
        emailDetails: "",
        aadharNumber: "",
        motherTongueName: "",
        permanentAddress: "",
        pincode: "",
    };



    const columns = [
        {
            field: "srNo",
            headerName: labels.srNo,
            align: "center",
            headerAlign: "center",
            width: 100,
        },
        {
            field: "schoolName",
            headerName: labels.schoolName,
            width: 150,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "teacherName",
            headerName: labels.teacherName,
            minWidth: 100,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "contactDetails",
            headerName: labels.mobileNumber,
            minWidth: 50,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },

        {
            field: "emailDetails",
            headerName: labels.emailID,
            minWidth: 150,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },



        {
            field: "aadharNumber",
            headerName: labels.aadharNumber,
            minWidth: 150,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },


        {
            field: "actions",
            headerName: labels.actions,
            headerAlign: "center",
            width: 50,
            align: "center",
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton
                            disabled={editButtonInputState}
                            onClick={() => {
                                setBtnSaveText("Update"),
                                    setID(params.row.id),
                                    setIsOpenCollapse(true),
                                    setSlideChecked(true);

                                // setButtonInputState(true);
                                reset(params.row);

                            }}
                        >
                            <EditIcon style={{ color: "#556CD6" }} />
                        </IconButton>

                        <IconButton
                            disabled={editButtonInputState}
                            onClick={() => {
                                setBtnSaveText("Update"),
                                    setID(params.row.id),

                                    // setIsOpenCollapse(true),
                                    setSlideChecked(true);
                                setButtonInputState(true);
                                console.log("params.row: ", params.row);
                                reset(params.row);
                            }}
                        >
                            {params.row.activeFlag == "Y" ? (
                                <ToggleOnIcon
                                    style={{ color: "green", fontSize: 30 }}
                                    onClick={() => deleteById(params.id, "N")}
                                />
                            ) : (
                                <ToggleOffIcon
                                    style={{ color: "red", fontSize: 30 }}
                                    onClick={() => deleteById(params.id, "Y")}
                                />
                            )}
                        </IconButton>

                    </Box>



                );
            },

        },
    ];

    return (
        <>

            <Paper
                elevation={8}
                variant="outlined"
                sx={{
                    border: 1,
                    borderColor: "grey.500",
                    marginLeft: "10px",
                    marginRight: "10px",
                    // marginTop: "10px",
                    // marginBottom: "60px",
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
                    <h2> {labels.schoolTeacher} </h2>
                </Box>
                <Divider />
                <Box
                    sx={{
                        marginLeft: 5,
                        marginRight: 5,
                        // marginTop: 2,
                        // marginBottom: 5,
                        padding: 1,
                        // border:1,
                        // borderColor:'grey.500'
                    }}
                >
                    <Box>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmitForm)}>
                                {isOpenCollapse && (
                                    <Slide
                                        direction="down"
                                        in={slideChecked}
                                        mountOnEnter
                                        unmountOnExit
                                    >
                                        <Grid container sx={{ padding: "10px" }}>

                                            {/* School Key */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <FormControl
                                                    // variant="outlined"
                                                    variant="standard"
                                                    size="small"
                                                    // sx={{ m: 1, minWidth: 120 }}
                                                    error={!!errors.schoolId}
                                                >
                                                    <InputLabel>{labels.selectSchool}</InputLabel>
                                                    <Controller
                                                        render={({ field }) => (
                                                            <Select
                                                                // required
                                                                disabled={router?.query?.pageMode === "View"}
                                                                sx={{ width: 300 }}
                                                                // sx={{ width: 200 }}
                                                                value={field.value}
                                                                // onChange={(value) => field.onChange(value)}
                                                                {...register("schoolKey")}
                                                            >
                                                                {schoolList &&
                                                                    schoolList.map((school, index) => (
                                                                        <MenuItem
                                                                            key={index}
                                                                            value={school.id}
                                                                        >
                                                                            {school.schoolName}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        )}
                                                        name="schoolKey"
                                                        control={control}
                                                        defaultValue=""
                                                    />
                                                    <FormHelperText>
                                                        {errors?.schoolKey
                                                            ? errors.schoolKey.message
                                                            : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>

                                            {/* firstName */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    label={labels.firstName}
                                                    // value={approvalId}
                                                    sx={{ width: 300 }}
                                                    variant="standard"
                                                    {...register("firstName")}
                                                    error={!!errors.firstName}
                                                    helperText={
                                                        errors?.firstName ? errors.firstName.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
                                            </Grid>
                                            {/* middleName */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    label={labels.middleName}
                                                    // value={approvalId}
                                                    sx={{ width: 300 }}
                                                    variant="standard"
                                                    {...register("middleName")}
                                                    error={!!errors.middleName}
                                                    helperText={
                                                        errors?.middleName ? errors.middleName.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
                                            </Grid>
                                            {/* lastName */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    label={labels.surnameName}
                                                    // value={approvalId}
                                                    sx={{ width: 300 }}
                                                    variant="standard"
                                                    {...register("lastName")}
                                                    error={!!errors.lastName}
                                                    helperText={
                                                        errors?.lastName ? errors.lastName.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
                                            </Grid>
                                            {/* gender */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <FormControl>
                                                    <FormLabel>
                                                        {labels.gender}
                                                    </FormLabel>

                                                    <Controller
                                                        name="gender"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <RadioGroup
                                                                {...field}
                                                                row
                                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                                name="row-radio-buttons-group"
                                                            // {...register("gender")}
                                                            >
                                                                <FormControlLabel
                                                                    value="M"
                                                                    control={<Radio />}
                                                                    label={labels.male}
                                                                />
                                                                <FormControlLabel
                                                                    value="F"
                                                                    control={<Radio />}
                                                                    label={labels.female}
                                                                />
                                                            </RadioGroup>
                                                        )}
                                                    />
                                                    <FormHelperText>
                                                        {errors?.gender
                                                            ? errors.gender.message
                                                            : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Grid>
                                            {/* contactDetails */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    label={labels.mobileNumber}
                                                    // value={approvalId}
                                                    sx={{ width: 300 }}
                                                    variant="standard"
                                                    {...register("contactDetails")}
                                                    error={!!errors.contactDetails}
                                                    helperText={
                                                        errors?.contactDetails ? errors.contactDetails.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
                                            </Grid>
                                            {/* emailDetails */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    label={labels.emailID}
                                                    // value={approvalId}
                                                    sx={{ width: 300 }}
                                                    variant="standard"
                                                    {...register("emailDetails")}
                                                    error={!!errors.emailDetails}
                                                    helperText={
                                                        errors?.emailDetails ? errors.emailDetails.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
                                            </Grid>
                                            {/* aadharNumber */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    label={labels.aadharNumber}
                                                    // value={approvalId}
                                                    sx={{ width: 300 }}
                                                    variant="standard"
                                                    {...register("aadharNumber")}
                                                    error={!!errors.aadharNumber}
                                                    helperText={
                                                        errors?.aadharNumber ? errors.aadharNumber.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
                                            </Grid>
                                            {/* motherTongueName */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    label={labels.motherTongue}
                                                    // value={approvalId}
                                                    sx={{ width: 300 }}
                                                    variant="standard"
                                                    {...register("motherTongueName")}
                                                    error={!!errors.motherTongueName}
                                                    helperText={
                                                        errors?.motherTongueName ? errors.motherTongueName.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
                                            </Grid>
                                            {/* permanentAddress */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    label={labels.permanentAddress}
                                                    // value={approvalId}
                                                    sx={{ width: 300 }}
                                                    variant="standard"
                                                    {...register("permanentAddress")}
                                                    error={!!errors.permanentAddress}
                                                    helperText={
                                                        errors?.permanentAddress ? errors.permanentAddress.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
                                            </Grid>
                                            {/* pincode */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    label={labels.pincode}
                                                    // value={approvalId}
                                                    sx={{ width: 300 }}
                                                    variant="standard"
                                                    {...register("pincode")}
                                                    error={!!errors.pincode}
                                                    helperText={
                                                        errors?.pincode ? errors.pincode.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
                                            </Grid>

                                            {/* photograph */}
                                            <Grid item
                                                xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "start",
                                                }} >
                                                <TextField
                                                    disabled={router?.query?.pageMode === "View"}
                                                    id="standard-textarea"
                                                    sx={{ width: 300 }}
                                                    label="Photograph"
                                                    type="file"
                                                    variant="standard"
                                                    // {...register("photograph")}
                                                    error={!!errors.label2}
                                                    helperText={
                                                        errors?.label2 ? errors.label2.message : null
                                                    }
                                                // InputLabelProps={{
                                                //     //true
                                                //     shrink:
                                                //         (watch("label2") ? true : false) ||
                                                //         (router.query.label2 ? true : false),
                                                // }}
                                                />
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
                                                    <Button
                                                        sx={{ marginRight: 8 }}
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<SaveIcon />}
                                                    >
                                                        {labels.save}
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        sx={{ marginRight: 8 }}
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<ClearIcon />}
                                                        onClick={() => cancellButton()}
                                                    >
                                                        {labels.clear}
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<ExitToAppIcon />}
                                                        onClick={() => exitButton()}
                                                    >
                                                        {labels.exit}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Slide>
                                )}
                            </form>
                        </FormProvider>
                    </Box>
                </Box>
                <div
                    // className={styles.addbtn}
                    style={{
                        display: "flex",
                        justifyContent: "right",
                        marginTop: 10,
                        marginRight: 40,
                        marginBottom: 10,
                    }}
                >

                    <div >
                        <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            // type='primary'
                            disabled={buttonInputState}
                            onClick={() => {
                                reset({
                                    ...resetValuesExit,
                                });
                                setEditButtonInputState(true);
                                setDeleteButtonState(true);
                                setBtnSaveText("Save");
                                setButtonInputState(true);
                                setSlideChecked(true);
                                setIsOpenCollapse(!isOpenCollapse);
                            }}
                        >
                            {labels.add}
                        </Button>
                    </div>


                </div>
                <div>
                    {/* </Paper> */}

                    {/* New Table */}
                    <Box
                        sx={{
                            height: 500,
                            // width: 1000,
                            // marginLeft: 10,

                            // width: '100%',

                            overflowX: 'auto',
                        }}
                    >
                        <DataGrid
                            // disableColumnFilter
                            // disableColumnSelector
                            // disableToolbarButton
                            // disableDensitySelector
                            components={{ Toolbar: GridToolbar }}
                            componentsProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: { debounceMs: 500 },
                                    // printOptions: { disableToolbarButton: true },
                                    // disableExport: true,
                                    // disableToolbarButton: true,
                                    // csvOptions: { disableToolbarButton: true },
                                },
                            }}
                            autoHeight
                            sx={{
                                // marginLeft: 5,
                                // marginRight: 5,
                                // marginTop: 5,
                                // marginBottom: 5,

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
                            // rows={dataSource}
                            // columns={columns}
                            // pageSize={5}
                            // rowsPerPageOptions={[5]}
                            //checkboxSelection

                            density="compact"
                            // autoHeight={true}
                            // rowHeight={50}
                            pagination
                            paginationMode="server"
                            // loading={data.loading}
                            rowCount={data.totalRows}
                            rowsPerPageOptions={data.rowsPerPageOptions}
                            page={data.page}
                            pageSize={data.pageSize}
                            rows={data.rows}
                            columns={columns}
                            onPageChange={(_data) => {
                                getTeachersMaster(data.pageSize, _data);
                            }}
                            onPageSizeChange={(_data) => {
                                console.log("222", _data);
                                // updateData("page", 1);
                                getTeachersMaster(_data, data.page);
                            }}
                        />
                    </Box>
                </div>


            </Paper>
        </>
    );
};

export default Index;





