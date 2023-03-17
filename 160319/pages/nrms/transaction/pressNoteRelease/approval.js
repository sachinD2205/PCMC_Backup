import React from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { setApprovalOfNews } from "../../../../features/userSlice"
import { useDispatch } from "react-redux";
import styles from "./view.module.css";


import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    Paper,
    TextField,
    ThemeProvider,


} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../../features/labelSlice";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";


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
        resolver: yupResolver(schema),
        mode: "onChange",
    });
    const router = useRouter();
    const [remark, setRemark] = useState("")

    const [moduleName, setModuleName] = useState([]);
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [fetchData, setFetchData] = useState(null);
    const [buttonInputState, setButtonInputState] = useState();
    const [ward, setWard] = useState([]);
    const [rotationGroup, setRotationGroup] = useState([]);
    const [rotationSubGroup, setRotationSubGroup] = useState([]);
    const [department, setDepartment] = useState([]);
    const [parameterName, setParameterName] = useState([]);
    const [newsPaper, setNewsPaper] = useState([]);
    const [id, setID] = useState();
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [slideChecked, setSlideChecked] = useState(false);
    const dispatch = useDispatch();
    const [selectedObject, setSelectedObject] = useState();
    const [dataSource, setDataSource] = useState();
    const [newspaperName, setNewspaperName] = useState();
    const [subject, setSubject] = useState();
    const [work, setWork] = useState();
    const [description, setDescription] = useState();
    const [group, setGroup] = useState();
    const [newsPublishedInSqMeter, setNewsPublishedInSqMeter] = useState();
    const [paperLevel, setPaperLevel] = useState();
    const [bill, setBill] = useState();
    const [newsType, setNewsType] = useState();
    const [date, setDate] = useState();
    const [newsRotationNumber, setNewsRotationNumber] = useState();
    const [newsDescription, setNewsDescription] = useState();
    const [selectedDate, setSelectedDate] = useState();
    const [priority, setPriority] = useState();
    const [id1, setId1] = useState();
    const [isdisabled, setIsDisabled] = useState();

    const validate = () => {
        return (
            // (authority &&
            //   authority[0] == "RTI_APPEAL_ADHIKARI" &&
            //   selectedObject?.status == 0) ||

            (authority &&
                authority[0] == "RTI_APPEAL_ADHIKARI" &&
                (selectedObject?.status == 5 || selectedObject?.status == 7)) ||
            (authority &&
                authority[0] == "DEPT_USER" &&
                (selectedObject?.status == 7 || selectedObject?.status == 8)) ||
            (authority &&
                authority[0] == "ENTRY" &&
                (selectedObject?.status == 9 || selectedObject?.status == 10))


        );
    };

    useEffect(() => {
        const isdisabled = validate();
        setIsDisabled(isdisabled);
    }, [
        selectedObject?.status == 5,
        selectedObject?.status == 7 || selectedObject?.status == 8,

        selectedObject?.status == 9 || selectedObject?.status == 10,

        // dataSource.status == 9,
    ]);

    // dataSource.status == 2,
    // dataSource.status == 3 || dataSource.status == 4 || dataSource.status == 16,
    // dataSource.status == 5 || dataSource.status == 6,
    useEffect(() => {

        getAllTableData();

    }, [router.query.id]);;
    useEffect(() => {
        geyBillApproval();

    })

    const user = useSelector((state) => state.user.user);

    console.log("user", user);

    // selected menu from drawer

    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")
    );

    console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

    // get authority of selected user

    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    console.log("authority", authority);
    let approvalId = router?.query?.id;
    console.log("appppp", router?.query?.id)

    const getAllTableData = () => {

        const noteId = router.query.id;
        // console.log("_pageSize,_pageNo", _pageSize, _pageNo);

        axios
            .get(`${urls.NRMS}/trnPressNoteRequestApproval/getAll`)
            .then((r) => {
                console.log("adagdshjagd")
                console.log("rressss", router.query.id);
                let result = r.data.trnPressNoteRequestApprovalList;
                console.log("getAllTableData", result);
                let _res = result.find((r, i) => {
                    console.log("4e2", r.id == noteId);
                    return r.id == noteId;
                })

                console.log("4e4", _res);
                setSelectedObject(_res)

            }
            )
    }
    useEffect(() => {
        getAllTableData();
    }, [getValues("id")]);

    console.log("selectedobject", selectedObject)

    const geyBillApproval = () => {
        setDepartment(selectedObject?.departmentName ? selectedObject?.departmentName : "-");
        setWard(selectedObject?.wardName ? selectedObject?.wardName : "-");
        setId1(selectedObject?.id ? selectedObject?.id : "-");
        setNewspaperName(selectedObject?.newspaperName ? selectedObject?.newspaperName : "-");
        setDate(selectedObject?.createDtTm ? selectedObject?.createDtTm : "-");
        setPriority(selectedObject?.priority ? selectedObject?.priority : "-");
        setSubject(selectedObject?.newsAdSubject ? selectedObject?.newsAdSubject : "-");
        setNewsPublishedInSqMeter(selectedObject?.rotationGroupName ? selectedObject?.rotationGroupName : "-");
        setBill(selectedObject?.newsPaperLevel ? selectedObject?.newsPaperLevel : "-");
        setNewsRotationNumber(selectedObject?.newsRotationNumber ? selectedObject?.newsRotationNumber : "-");
        // setSelectedDate(val)
        let str = date?.split("T")
        let val = str && str[0]
        setSelectedDate(val ? val : "-")
    }
    console.log("sssssss", selectedDate)
    const onSubmitForm = (btnType) => {
        let formData = {
            ...selectedObject,
            remarks: remark,
            isApproved: true,
        };
        console.log("form data --->", formData)
        dispatch(setApprovalOfNews(formData))
        // Save - DB

        if (btnType === "Save") {

            formData = {
                ...selectedObject,
                remarks: remark,
                isApproved: true,
                isComplete: false,
            }

            const tempData = axios
                .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, formData)
                .then((res) => {
                    if (res.status == 201  && authority && authority[0] === "DEPT_USER") {
                        sweetAlert("Approved!", "Record Approved successfully !", "success");
                        getAllTableData();
                        setButtonInputState(false);
                        setIsOpenCollapse(false);
                        setFetchData(tempData);
                        // setEditButtonInputState(false);
                        // setDeleteButtonState(false);
                        router.push('/nrms/transaction/pressNoteRelease/')
                    }
                    else if (res.status == 201 &&   authority && authority[0] === "RTI_APPEAL_ADHIKARI") {
                        sweetAlert("Release Order Generate!", "Record Generate successfully !", "success");
                        getAllTableData();
                        setButtonInputState(false);
                        setIsOpenCollapse(false);
                        setFetchData(tempData);
                     
                        router.push('/nrms/transaction/AdvertisementRotation//')
                      }
                    else if (res.status == 201 &&   authority && authority[0] === "ENTRY") {
                        sweetAlert("Verify!", "Record Verify successfully !", "success");
                        getAllTableData();
                        setButtonInputState(false);
                        setIsOpenCollapse(false);
                        setFetchData(tempData);
                     
                        router.push('/nrms/transaction/AdvertisementRotation//')
                      }
                });
        }
        // Update Data Based On ID
        else if (btnType === "Reject") {
            formData = {
                ...selectedObject,
                remarks: remark,
                isApproved: true,
                isComplete: false,
            }
            let _body = {
                ...formData,
                isApproved: false
            }
            const tempData = axios
                .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, _body)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        formData.id
                            ? sweetAlert(
                                "Updated!",
                                "Record Rejected successfully !",
                                "success"
                            )
                            : sweetAlert("Saved!", "Record Rejected successfully !", "success");
                        getAllTableData();                    // setButtonInputState(false);
                        // setEditButtonInputState(false);
                        // setDeleteButtonState(false);
                        // setIsOpenCollapse(false);
                        router.push('/nrms/transaction/pressNoteRelease/')
                    }
                });
        }
    };

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
                        marginBottom: "60px",
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
                        <h2>

                            Approval Of Press Note Publish Request

                            {/* <FormattedLabel id="addHearing" /> */}
                        </h2>
                    </Box>

                    <Divider />

                    <Box
                        sx={{
                            marginLeft: 5,
                            marginRight: 5,
                            // marginTop: 2,
                            marginBottom: 5,
                            padding: 1,
                            // border:1,
                            // borderColor:'grey.500'
                        }}
                    >
                        <Box p={4}>
                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit
                                    (onSubmitForm)
                                }>
                                    {/* Firts Row */}

                                    <Grid container sx={{ padding: "10px" }}>

                                        {/* <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            p={1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "start",
                                            }}
                                        >
                                    
                                            <TextField
                                                disabled={router?.query?.pageMode === "View"}
                                                id="standard-textarea"
                                                label="Publish Request Number"
                                                value={approvalId}
                                                sx={{ m: 1, minWidth: '50%' }}
                                                multiline
                                                variant="outlined"

                                                error={!!errors.label2}
                                                helperText={
                                                    errors?.label2 ? errors.label2.message : null
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
                                            p={1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                id="standard-textarea"
                                                label="Press Note Release Order Number"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={id1}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>

                                        {/* Department Name */}

                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            p={1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                id="standard-textarea"
                                                label="Ward Name"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={ward}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            p={1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                id="standard-textarea"
                                                label="Department Name"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={department}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            p={1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                id="standard-textarea"
                                                label="Priority"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={priority}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            p={1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                id="standard-textarea"
                                                label="Pree Note Subject"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={subject}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            p={1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                id="standard-textarea"
                                                label="News Paper Name"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={newspaperName}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            p={1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <TextField
                                                id="standard-textarea"
                                                label="Release Date"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={selectedDate}

                                            />
                                        </Grid>
                                        {
                                            authority && authority[0] === "RTI_APPEAL_ADHIKARI" ?
                                                <></> :

                                                <Grid
                                                    item
                                                    xl={6}
                                                    lg={6}
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                    p={1}

                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <TextField
                                                        id="standard-textarea"
                                                        label="Remarks"
                                                        disabled={!isdisabled}
                                                        sx={{
                                                            width: '700px',
                                                            marginLeft: '65px'
                                                        }}
                                                        multiline

                                                        // : dgExApprovalRemarks

                                                        variant="outlined"

                                                        error={!!errors.remarks}
                                                        helperText={
                                                            errors?.remarks ? errors.remarks.message : null
                                                        }

                                                    />
                                                </Grid>


                                        }

                                        {
                                            authority && authority[0] === "DEPT_USER" || "ENTRY" ?
                                                (
                                                    <>
                                                        <Grid container rowSpacing={2} columnSpacing={1} className={styles.attachmentContainer}>

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

                                                                <Grid item xl={10}
                                                                    lg={10}
                                                                    md={10}
                                                                    sm={10}
                                                                    xs={10}>

                                                                    <InputLabel>Press Release Order:</InputLabel>

                                                                </Grid>
                                                                <Grid item xl={2}
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={2}
                                                                    xs={2}
                                                                    className={styles.viewButton}  >
                                                                    <Button variant="contained"
                                                                        sx={{
                                                                            margin: "30px"


                                                                        }}
                                                                        onClick={() => {

                                                                            const record = selectedObject;
                                                                            router.push({
                                                                                pathname: "/nrms/transaction/releasingOrder/press",
                                                                                query: {
                                                                                    pageMode: "View",
                                                                                    ...record,
                                                                                },
                                                                            });

                                                                        }}
                                                                    >
                                                                        View
                                                                    </Button>
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

                                                                <Grid item xl={10}
                                                                    lg={10}
                                                                    md={10}
                                                                    sm={10}
                                                                    xs={10}>

                                                                    <InputLabel>View Attachement</InputLabel>

                                                                </Grid>
                                                                <Grid item xl={2}
                                                                    lg={2}
                                                                    md={2}
                                                                    sm={2}
                                                                    xs={2}
                                                                    className={styles.viewButton}  >
                                                                    <a
                                                                        href={`${urls.CFCURL}/file/preview?filePath=${selectedObject?.pressAttachment}`}
                                                                        target="__blank"
                                                                    >
                                                                        <Button variant="contained"
                                                                            sx={{
                                                                                margin: "30px",

                                                                                // display: "flex",
                                                                                // justifyContent: "center",
                                                                                // alignItems: "center"
                                                                            }}>
                                                                            View
                                                                        </Button>
                                                                    </a>
                                                                </Grid>

                                                            </Grid>


                                                        </Grid>

                                                    </>) :
                                                (
                                                    <></>

                                                )};




                                        {/* Button Row */}

                                        <Grid container
                                            spacing={5}

                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                paddingTop: "10px",
                                                marginTop: "60px",

                                            }}>
                                            {
                                                authority && authority[0] === "RTI_APPEAL_ADHIKARI" ? (
                                                    <>

                                                        {/* <label>Generate News Releasing Order</label> */}
                                                        <Button
                                                            sx={{ marginRight: 8 }}
                                                            disabled={!isdisabled}
                                                            onClick={() => {
                                                                { onSubmitForm("Save") }
                                                                const record = selectedObject;
                                                                router.push({
                                                                    pathname: "/nrms/transaction/releasingOrder/news",
                                                                    query: {
                                                                        pageMode: "View",
                                                                        ...record,
                                                                    },
                                                                });

                                                            }}

                                                            variant="contained"
                                                            color="success"
                                                        >
                                                            {/* <FormattedLabel id="clear" /> */}
                                                            Releasing Order
                                                        </Button>


                                                    </>
                                                )
                                                    : (

                                                        <>

                                                            {/* Save ad Draft */}
                                                            {
                                                                authority && authority[0] === "RTI_APPEAL_ADHIKARI" ?
                                                                    <></> :
                                                                    (<> <div >
                                                                        <Button
                                                                            sx={{ marginRight: 8 }}
                                                                            variant="contained"
                                                                            color="primary"
                                                                            // endIcon={<ClearIcon />}
                                                                            onClick={() => { onSubmitForm("Save") }}
                                                                            disabled={!isdisabled}
                                                                        >
                                                                         
                                                                            {/* <FormattedLabel id="clear" /> */}
                                                                            Approve
                                                                        </Button>
                                                                    </div>
                                                                        <Button
                                                                            sx={{ marginRight: 8 }}

                                                                            variant="contained"
                                                                            color="primary"

                                                                            onClick={() => { onSubmitForm("Reject") }}
                                                                            disabled={!isdisabled}
                                                                        >
                                                                            {/* <FormattedLabel id="clear" /> */}
                                                                            Reject
                                                                        </Button>
                                                                    </>
                                                                    )
                                                            }
                                                        </>
                                                    )}


                                            {/* {
                        authority && authority[0] === "ENTRY" ? */}
                                            <Button
                                                sx={{ marginRight: 8 }}
                                                width
                                                variant="contained"
                                                onClick={() =>
                                                    router.push(
                                                        `/nrms/transaction/pressNoteRelease/`
                                                    )
                                                }
                                            >
                                                Exit
                                                {/* {<FormattedLabel id="cancel" />} */}
                                            </Button>

                                            {/* :

                          <></>
                      } */}
                                        </Grid>


                                    </Grid>
                                </form>
                            </FormProvider>
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
