import React from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { setApprovalOfNews } from "../../../../features/userSlice"
import { useDispatch } from "react-redux";


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
    ListItemText,
    MenuItem,
    Paper,
    Select,
    TextareaAutosize,
    TextField,
    ThemeProvider,
    Typography,
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





    // const[ data,setData]=useState([]);

    useEffect(() => {
        // getWard();
        getAllTableData();
        // getDepartment();
        // getRotationGroup();
        // getRotationSubGroup();
        // getNewsPaper();

        // getDate();
    }, []);;
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





    // let approvalData = useSelector((state) => state.user.setApprovalOfNews)

    let approvalId = router?.query?.id;



    const getAllTableData = () => {
        // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
        axios
            .get(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/getAll`)
            .then((r) => {
                console.log(";rressss", r);
                let result = r.data.trnNewspaperAgencyBillSubmissionList;
                console.log("getAllTableData", result);
                let _res = result.map((r, i) => {
                    console.log("4e4", r);



                })
                result && result.map((each) => {
                    if (each.id == approvalId) {
                        setSelectedObject(each)

                    }
                })


            }
            )
    }



    console.log("selectedobject", selectedObject)

    const geyBillApproval = () => {

        setDepartment(selectedObject?.departmentName ? selectedObject?.departmentName : "-");
        setNewspaperName(selectedObject?.newspaperName ? selectedObject?.newspaperName : "-");
        setDate(selectedObject?.newsAdvertismentPublishedDate ? selectedObject?.newsAdvertismentPublishedDate : "-");

        setNewsDescription(selectedObject?.newsAdvertismentDescription ? selectedObject?.newsAdvertismentDescription : "-");
        setNewsPublishedInSqMeter(selectedObject?.newsPublishedInSqMeter ? selectedObject?.newsPublishedInSqMeter : "-");
        setBill(selectedObject?.billAmount ? selectedObject?.billAmount : "-");
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
            const tempData = axios
                .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, formData)
                .then((res) => {
                    if (res.status == 201) {
                        sweetAlert("Saved!", "Record Approved successfully !", "success");
                        getAllTableData();
                        setButtonInputState(false);
                        setIsOpenCollapse(false);
                        setFetchData(tempData);
                        // setEditButtonInputState(false);
                        // setDeleteButtonState(false);
                    }
                });
        }
        // Update Data Based On ID
        else if (btnType === "Reject") {
            let _body = {
                ...formData,
                isApproved: false
            }
            const tempData = axios
                .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body)
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
                    }
                });
        }
    };



    // useEffect(() => {
    //     reset(approvalData)
    // }, [approvalData])



    // useEffect(()=>{
    //   reset(router.query)
    //  },[router.isReady])


    // View
    return (
        <>
            {/* <BasicLayout> */}
            {/* <Box display="inkenline-block"> */}
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

                            Approval Bill

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
                                                alignItems: "start",
                                            }}
                                        >
                                            {/* {console.log("approvalId",approvalId)} */}
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
                                                label="News Rotation Number"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={newsRotationNumber}
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
                                                label="News Advertisement Description"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={newsDescription}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>



                                        {/* Priority */}

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
                                                label="Publish News Date"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={selectedDate}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>



                                        {/* Second Row */}

                                        {/* News/Advertisement Subject */}

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
                                                label="News Published In Sq.meter"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={newsPublishedInSqMeter}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>


                                        {/*  */}

                                        {/* Work Name */}

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
                                                label="Bill Amount"
                                                sx={{ m: 1, minWidth: '50%' }}
                                                variant="outlined"
                                                value={bill}
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>



                                        {/* Attachement */}




                                        {/* Finalised news published in sq.meter */}






                                        {/* Finalised Bill amount */}

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
                                                sx={{
                                                    width: '400px',
                                                    // marginLeft: '10px'
                                                }}
                                                multiline
                                                value={remark}
                                                variant="outlined"
                                                onChange={(e) => { setRemark(e.target.value) }}
                                                error={!!errors.remarks}
                                                helperText={
                                                    errors?.remarks ? errors.remarks.message : null
                                                }
                                            // InputLabelProps={{
                                            //     //true
                                            //     shrink:
                                            //         (watch("label2") ? true : false) ||
                                            //         (router.query.label2 ? true : false),
                                            // }}
                                            />
                                        </Grid>

                                        <Grid container rowSpacing={2} columnSpacing={1} >



                                            <Grid
                                                item
                                                xl={3}
                                                lg={3}
                                                md={3}
                                                sm={3}
                                                xs={3}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}>

                                                <Grid item xl={3}
                                                    lg={3}
                                                    md={3}
                                                    sm={3}
                                                    xs={3}>

                                                    <InputLabel>View Bill</InputLabel>

                                                </Grid>
                                                <Grid item xl={1}
                                                    lg={1}
                                                    md={1}
                                                    sm={1}
                                                    xs={1}
                                                >
                                                    <a
                                                        href={`${urls.CFCURL}/file/preview?filePath=${selectedObject?.newsAttachement}`}
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
                                        {/* 
                          
   {/* Button Row */}
                                        <Grid container
                                            spacing={5}

                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                paddingTop: "10px",
                                                marginTop: "50px",

                                            }}>
                                            {/* Save ad Draft */}


                                            {/* Approve */}

                                            <div >
                                                <Button
                                                    sx={{ marginRight: 8 }}
                                                    variant="contained"
                                                    color="primary"
                                                    // endIcon={<ClearIcon />}
                                                    onClick={() => { onSubmitForm("Save") }}

                                                >
                                                    {/* <FormattedLabel id="clear" /> */}
                                                    Approve
                                                </Button>
                                            </div>
                                            {/* Reject */}

                                            <Button
                                                sx={{ marginRight: 8 }}

                                                variant="contained"
                                                color="primary"

                                                onClick={() => { onSubmitForm("Reject") }}
                                            >
                                                {/* <FormattedLabel id="clear" /> */}
                                                Reject
                                            </Button>

                                            {/* Reassign */}

                                            <Button
                                                sx={{ marginRight: 8 }}

                                                variant="contained"
                                                color="primary"
                                                onClick={() =>
                                                    router.push(
                                                        `/nrms/transaction/newsPaperAgencybill/`
                                                    )
                                                }

                                            // onClick={() => { onSubmitForm("Reject") }}
                                            >
                                                {/* <FormattedLabel id="clear" /> */}
                                                Reassign
                                            </Button>

                                            {/* Exit */}
                                            <Button
                                                sx={{ marginRight: 8 }}
                                                width
                                                variant="contained"
                                                onClick={() =>
                                                    router.push(
                                                        `/nrms/transaction/newsPaperAgencybill/`
                                                    )
                                                }
                                            >
                                                Exit
                                                {/* {<FormattedLabel id="cancel" />} */}
                                            </Button>





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
