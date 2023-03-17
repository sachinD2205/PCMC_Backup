// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

import {
    Box,
    Button,
    FormControl,
    Grid,
    InputBase,
    InputLabel,
    Paper,
    Slide,
    Select,
    TextField,
    Toolbar,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
    DataGrid,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/billingCycleSchema";
import sweetAlert from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { Divider } from "antd";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import academicSubjectSchema from "../../../../containers/schema/school/transactions/academicSubjectSchema";



const Index = () => {
    const {
        register,
        control,
        handleSubmit,
        methods,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
        resolver: yupResolver(academicSubjectSchema),
        mode: "onChange",
    });

    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [dataSource, setDataSource] = useState([]);
    const [buttonInputState, setButtonInputState] = useState();
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [id, setID] = useState();
    const [fetchData, setFetchData] = useState(null);
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [slideChecked, setSlideChecked] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const router = useRouter();
    const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);



    const schoolId = watch("schoolId");
    const academicYearId = watch("academicYearId");
    const teacherKey = watch("teacherKey");
    const classId = watch("classId");
    const divisionId = watch("divisionId");


    const [schoolList, setSchoolList] = useState([]);
    const [academicYearList, setAcademicYearList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [divisionList, setDivisionList] = useState([]);


    // const [schoolId, setSchoolId] = useState("");
    // const [academicYearId, setAcademicYearId] = useState("");
    // const [classId, setClassId] = useState("");
    // const [divisionId, setDivisionId] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");

    const language = useSelector((state) => state.labels.language);

    const [data, setData] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
    });


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

        const getAcademicYearList = async () => {
            try {
                const { data } = await axios.get(`${urls.SCHOOL}/mstAcademicYear/getAll`);
                const academicYears = data.mstAcademicYearList.map(({ id, academicYear }) => ({ id, academicYear }));
                setAcademicYearList(academicYears);
            } catch (e) {
                setError(e.message);
                setIsOpen(true);
            }
        };

        const getTeacherList = async () => {
            try {
                const { data } = await axios.get(
                    `${urls.SCHOOL}/mstTeacher/getAll`
                );
                const teachers = data.mstTeacherList.map(({ id, firstName, middleName, lastName }) => ({
                    id,
                    teacherName: `${firstName} ${middleName} ${lastName}`
                })
                );
                setTeachersList(teachers);
            } catch (e) {
                setError(e.message);
            }
        };

        getTeacherList();
        getSchoolList();
        getAcademicYearList();
    }, [setError, setIsOpen]);

    useEffect(() => {
        const getClassList = async () => {
            setValue("classId", "");
            if (schoolId == null || schoolId === "") {
                setClassList([]);
                return;
            }
            try {
                const { data } = await axios.get(`${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`);
                const classes = data.mstClassList.map(({ id, className }) => ({ id, className }));
                setClassList(classes);
            } catch (e) {
                setError(e.message);
                setIsOpen(true);
            }
        };
        getClassList();
    }, [schoolId, setValue, setError, setIsOpen]);

    useEffect(() => {
        const getDivisionList = async () => {
            setValue("divisionId", "");
            if (schoolId == null || schoolId === "" || classId == null || classId === "") {
                setDivisionList([]);
                return;
            }
            try {
                const { data } = await axios.get(
                    `${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`,
                );
                const divisions = data.mstDivisionList.map(({ id, divisionName }) => ({ id, divisionName }));
                setDivisionList(divisions);
            } catch (e) {
                setError(e.message);
                setIsOpen(true);
            }
        };
        getDivisionList();
    }, [classId, schoolId, setValue, setIsOpen, setError]);



    // Get Table - Data

    useEffect(() => {
        getAcademicSubjectMaster();
    }, [fetchData]);

    const getAcademicSubjectMaster = (_pageSize = 20, _pageNo = 0) => {
        // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
        axios
            .get(`${urls.SCHOOL}/mstAcademicSubject/getAll`, {
                params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                },
            })
            .then((r) => {
                // console.log("mstSubject", r);
                let result = r.data.mstAcademicSubjectList;
                console.log("mstAcademicSubjectList", result);

                let _res = result.map((r, i) => {
                    // console.log("44");
                    return {
                        // r.data.map((r, i) => ({
                        activeFlag: r.activeFlag,

                        id: r.id,
                        srNo: i + 1,
                        schoolName: r.schoolName ? r.schoolName : `-`,
                        subjectName: r.subjectName ? r.subjectName : `-`,
                        className: r.className ? r.className : `-`,
                        divisionName: r.divisionName ? r.divisionName : `-`,
                    };
                });
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



    const onSubmitForm = (fromData) => {
        console.log("fromData", fromData);
        // Save - DB
        let _body = {
            ...fromData,
            activeFlag: fromData.activeFlag,
            schoolKey: schoolId,
            classKey: classId,
            divisionKey: divisionId,
            academicYearKey: academicYearId,
            schoolName: schoolList?.find((item)=> item?.id === schoolId)?.schoolName,
            className: classList?.find((item)=> item?.id === classId)?.className,
            divisionName: divisionList?.find((item)=> item?.id === divisionId)?.divisionName,
        };
        if (btnSaveText === "Save") {
            const tempData = axios
                .post(`${urls.SCHOOL}/mstAcademicSubject/save`, _body)
                .then((res) => {
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
            const tempData = axios
                .post(`${urls.SCHOOL}/mstAcademicSubject/save`, _body)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        fromData.id
                            ? sweetAlert(
                                "Updated!",
                                "Record Updated successfully !",
                                "success"
                            )
                            : sweetAlert("Saved!", "Record Saved successfully !", "success");
                        getAcademicSubjectMaster();
                        setButtonInputState(false);
                        setEditButtonInputState(false);
                        setDeleteButtonState(false);
                        setIsOpenCollapse(false);
                    }
                });
        }
    };

    // Delete By ID
    const deleteById = (value, _activeFlag) => {
        let body = {
            activeFlag: _activeFlag,
            id: value,
        };
        console.log("body", body);
        if (_activeFlag === "N") {
            swal({
                title: "Inactivate?",
                text: "Are you sure you want to inactivate this Record ? ",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                console.log("inn", willDelete);
                if (willDelete === true) {
                    axios.post(`${urls.SCHOOL}/mstAcademicSubject/save`, body).then((res) => {
                        console.log("delet res", res);
                        if (res.status == 201) {
                            swal("Record is Successfully Deleted!", {
                                icon: "success",
                            });
                            getAcademicSubjectMaster();
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
                text: "Are you sure you want to activate this Record ? ",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                console.log("inn", willDelete);
                if (willDelete === true) {
                    axios.post(`${urls.SCHOOL}/mstAcademicSubject/save`, body).then((res) => {
                        console.log("delet res", res);
                        if (res.status == 201) {
                            swal("Record is Successfully Activated!", {
                                icon: "success",
                            });
                            // getPaymentRate();
                            getAcademicSubjectMaster();
                            // setButtonInputState(false);
                        }
                    });
                } else if (willDelete == null) {
                    swal("Record is Safe");
                }
            });
        }
    };

    // Exit Button
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

    // cancell Button
    const cancellButton = () => {
        reset({
            ...resetValuesCancell,
            id,
        });
    };

    // Reset Values Cancell
    const resetValuesCancell = {
        schoolName: "",
        className: "",
        divisionName: "",
        subjectName: "",
        // academicYear: "",
        // academicYearFrom: "",
        // academicYearTo: "",
    };

    // Reset Values Exit
    const resetValuesExit = {
        // academicYear: "",
        // academicYearFrom: "",
        // academicYearTo: "",
        id: null,
        schoolName: "",
        className: "",
        divisionName: "",
        subjectName: "",
    };

    const columns = [
        {
            field: "srNo",
            headerName: "srNo",
            // <FormattedLabel id="srNo" />
            flex: 1,
        },
        {
            field: "schoolName",
            headerName: "School Name",

            // headerName: <FormattedLabel id="bookClassification" />,
            flex: 1,
        },
        {
            field: "className",
            headerName: "Class Name",

            // headerName: <FormattedLabel id="bookClassification" />,
            flex: 1,
        },
        {
            field: "divisionName",
            headerName: "Division Name",

            // headerName: <FormattedLabel id="bookClassification" />,
            flex: 1,
        },
        {
            field: "subjectName",
            headerName: "Subject Name",

            // headerName: <FormattedLabel id="bookClassification" />,
            flex: 1,
        },
        // {

        //   field: "academicYearTo",
        //   headerName: "To Date",

        //   // headerName: <FormattedLabel id="bookClassification" />,
        //   flex: 1,
        // },

        {
            field: "actions",
            // headerName: <FormattedLabel id="actions" />,
            width: 120,
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
                                setButtonInputState(true);
                                // console.log("params.row: ", params.row);
                                reset(params.row);
                            }}
                        >
                            <EditIcon style={{ color: "#556CD6" }} />
                        </IconButton>
                        {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
                        <IconButton
                            disabled={editButtonInputState}
                            onClick={() => {
                                setBtnSaveText("Update"),
                                    setID(params.row.id),
                                    //   setIsOpenCollapse(true),
                                    setSlideChecked(true);
                                // setButtonInputState(true);
                                // console.log("params.row: ", params.row);
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

    // Row

    return (
        <Paper
            elevation={8}
            variant="outlined"
            sx={{
                border: 1,
                borderColor: "grey.500",
                marginLeft: "10px",
                marginRight: "10px",
                // marginTop: "50px",
                // marginBottom: "60px",
                padding: 1,
            }}
        >
            <Box
                style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    // backgroundColor:'#0E4C92'
                    // backgroundColor:'		#0F52BA'
                    // backgroundColor:'		#0F52BA'
                    background:
                        "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
            >
                <h2>
                    {/* <FormattedLabel id="bookClassification" /> */}
                    Academic Subject
                </h2>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: 30,
                    marginRight: 5,
                    // marginTop: 2,
                    // marginBottom: 3,
                    padding: 2,
                    // border:1,
                    // borderColor:'grey.500'
                }}
            >
                <Box p={1}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            {isOpenCollapse && (
                                <Slide
                                    direction="down"
                                    in={slideChecked}
                                    mountOnEnter
                                    unmountOnExit
                                >
                                    <Grid container>

                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={12} p={1}>
                                            <FormControl
                                                // variant="outlined"
                                                variant="standard"
                                                size="small"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                error={!!errors.schoolId}
                                            >
                                                <InputLabel required error={!!errors.schoolId}>
                                                    {labels.selectSchool}
                                                </InputLabel>
                                                <Controller
                                                    control={control}
                                                    name="schoolId"
                                                    rules={{ required: true }}
                                                    defaultValue=""
                                                    render={({ field }) => (
                                                        <Select
                                                            variant="standard"
                                                            {...field}
                                                            error={!!errors.schoolId}
                                                        >
                                                            {schoolList &&
                                                                schoolList.map((school) => (
                                                                    <MenuItem key={school.id} value={school.id}>
                                                                        {school.schoolName}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {errors?.schoolId ? errors.schoolId.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={12} p={1}>
                                            <FormControl
                                                // variant="outlined"
                                                variant="standard"
                                                size="small"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                error={!!errors.academicYearId}
                                            >
                                                <InputLabel required error={!!errors.academicYearId}>
                                                    {labels.selectAcademicYear}
                                                </InputLabel>
                                                <Controller
                                                    control={control}
                                                    name="academicYearId"
                                                    rules={{ required: true }}
                                                    defaultValue=""
                                                    render={({ field }) => (
                                                        <Select variant="standard" {...field}>
                                                            {academicYearList &&
                                                                academicYearList.map((academicYear) => (
                                                                    <MenuItem
                                                                        key={academicYear.id}
                                                                        value={academicYear.id}
                                                                    >
                                                                        {academicYear.academicYear}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {errors?.academicYearId ? errors.academicYearId.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={12} p={1}>
                                            <FormControl
                                                // variant="outlined"
                                                variant="standard"
                                                size="small"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                error={!!errors.classId}
                                            >
                                                <InputLabel required error={!!errors.classId}>
                                                    {labels.selectClass}
                                                </InputLabel>
                                                <Controller
                                                    control={control}
                                                    name="classId"
                                                    rules={{ required: true }}
                                                    defaultValue=""
                                                    render={({ field }) => (
                                                        <Select variant="standard" {...field}>
                                                            {classList &&
                                                                classList.map((classN) => (
                                                                    <MenuItem key={classN.id} value={classN.id}>
                                                                        {classN.className}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {errors?.classId ? errors.classId.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={12} p={1}>
                                            <FormControl
                                                // variant="outlined"
                                                variant="standard"
                                                size="small"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                error={!!errors.divisionId}
                                            >
                                                <InputLabel required error={!!errors.divisionId}>
                                                    {labels.selectDivision}
                                                </InputLabel>
                                                <Controller
                                                    control={control}
                                                    name="divisionId"
                                                    rules={{ required: true }}
                                                    defaultValue=""
                                                    render={({ field }) => (
                                                        <Select variant="standard" {...field}>
                                                            {divisionList &&
                                                                divisionList.map((division) => (
                                                                    <MenuItem key={division.id} value={division.id}>
                                                                        {division.divisionName}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {errors?.divisionId ? errors.divisionId.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item
                                            xl={6}
                                            lg={6}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            p={1}
                                        // sx={{
                                        //   display: "flex",
                                        //   justifyContent: "center",
                                        //   alignItems: "center",
                                        // }}
                                        >
                                            <TextField
                                                // label={<FormattedLabel id="bookClassification" />}
                                                id="standard-basic"
                                                variant="standard"
                                                label="Subject Name"
                                                {...register("subjectName")}
                                                error={!!errors.subjectName}
                                                sx={{ width: 230 }}
                                                InputProps={{ style: { fontSize: 18 } }}
                                                InputLabelProps={{
                                                    style: { fontSize: 15 },
                                                    //true
                                                    shrink:
                                                        (watch("subjectName") ? true : false) ||
                                                        (router.query.subjectName ? true : false),
                                                }}
                                                helperText={
                                                    errors?.subjectName ? errors.subjectName.message : null
                                                }
                                            />
                                        </Grid>


                                        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
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
                                                    Save
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
                                                    Clear
                                                    {/* <FormattedLabel id="clear" /> */}
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<ExitToAppIcon />}
                                                    onClick={() => exitButton()}
                                                >
                                                    Exit
                                                    {/* <FormattedLabel id="exit" /> */}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        {/* </div> */}
                                    </Grid>
                                </Slide>
                            )}
                        </form>
                    </FormProvider>
                </Box>
            </Box>

            <div className={styles.addbtn}>
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
                    {/* <FormattedLabel id="add" /> */}
                    Add
                </Button>
            </div>

            <DataGrid
                headerName="Water"
                getRowId={(row) => row.srNo}
                autoHeight
                sx={{
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
                density="compact"
                // rows={studentList}
                // columns={columns}
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
                    getAcademicSubjectMaster(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);   
                    getAcademicSubjectMaster(_data, data.page);
                }}
            />
        </Paper>
    );
};

export default Index;



