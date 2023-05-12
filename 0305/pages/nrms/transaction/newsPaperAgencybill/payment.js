// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useDispatch } from "react-redux";
import moment from "moment"
import { EyeFilled } from "@ant-design/icons";
import CheckIcon from '@mui/icons-material/Check'
// import UploadButton from "../../../../containers/reuseableComponents/UploadButton";
import UploadButton from "../../../../containers/NRMS_ReusableComponent/UploadButton";
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';


import {
    Box,
    Divider,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputBase,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slide,
    TextField,
    Toolbar,
    Typography,
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
// import styles from "./index.module.css";
// import styles from "../../../../../styles/ElectricBillingPayment_Styles/subDivision.module.css";

// import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/subDivisionSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/NRMS_ReusableComponent/FormattedLable";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { setApprovalOfNews } from "../../../../features/userSlice";
import { Label, Update } from "@mui/icons-material";
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
        // resolver: yupResolver(schema),
        mode: "onChange",

    });
    const language = useSelector((state) => state.labels.language);
    const router = useRouter();
    const [tableData, setTableData] = useState();
    const [dataSource, setDataSource] = useState([]);
    const [courtNames, setCourtNames] = useState([]);
    const [advocateNames, setAdvocateNames] = useState([]);
    const [id, setID] = useState();
    const [caseTypes, setCaseTypes] = useState([]);
    const [caseStages, setCaseStages] = useState([]);
    const [cutNews, setCutNews] = useState('');
    const [caseEntry, setCaseEntry] = useState([]);
    const [allTabelData, setAllTabelData] = useState([]);
    const [ward, setWard] = useState([]);
    const [rotationGroup, setRotationGroup] = useState([]);
    const [subGroup, setSubGroup] = useState([]);
    const [department, setDepartment] = useState([]);
    const [parameterName, setParameterName] = useState([]);
    const [newsPaper, setNewsPaper] = useState([]);
    const [number, setNumber] = useState('');
    const [aOneForm, setAOneForm] = useState()
    const [newsRequest, setNewsRequest] = useState("")
    const [newsLevel, setNewsLevel] = useState("")
    const [newsRequestDoc, setNewsRequestDoc] = useState("")
    const [zone, setZone] = useState("")
    const [image, setImage] = useState()
    const [selectedObject, setSelectedObject] = useState()
    const [valueData, setValueData] = useState()
    const [updateData, setUpdateData] = useState([]);
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [fetchData, setFetchData] = useState(null);
    const [rotationSubGroup, setRotationSubGroup] = useState();
    const [isdisabled, setIsDisabled] = useState();
    const [bill, setBill] = useState();

    const [editData, setEditData] = useState({})
    const { inputData, setInputData } = useState();
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [buttonInputState, setButtonInputState] = useState();
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    // const [slideChecked, setSlideChecked] = useState(false);

    const dispatch = useDispatch();
    const [data, setData] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
    });

    useEffect(() => {

        getDepartment();

        getNewsPaper();


    }, []);

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
    // const getAllEditTableData = (id) => {
    //     axios
    //         .get(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/getAll`)
    //         .then((r) => {
    //             console.log(
    //                 ":aaaa",
    //                 id,
    //                 r.data.trnPaperCuttingBookList.find((row) => id == row.id),
    //             );
    //             setValueData(r.data.trnPaperCuttingBookList.find((row) => id == row.id));
    //         });

    // }
    console.log("valueData", valueData)

    useEffect(() => {
        let _res = valueData;

        console.log("editData", valueData)
        if (btnSaveText === "Update") {

            setValue("departmentName", _res?.departmentName ? _res?.departmentName : "-")
            setValue("newspaperName", _res?.newspaperName ? _res?.newspaperName : "-")

            setValue("fromDate", _res?.fromDate ? _res?.fromDate : "-");

            setValue("attachement", _res?.attachement ? _res?.attachement : "-");

        }
    }
        , [valueData]);

    const getDepartment = () => {
        axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
            setDepartment(res.data.department

            );
            // console.log("res.data", r.data);
        });
    };
    const getNewsPaper = () => {
        axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
            setNewsPaper(
                r?.data?.newspaperMasterList?.map((r, i) => ({
                    id: r.id,
                    newspaperName: r.newspaperName,
                }))
            );
        });
    };
    const cancellButton = () => {
        reset({
            ...resetValuesCancell,
            id,
        });
    };

    useEffect(() => {
        if (router.query.id != undefined) {
            // getAllEditTableData(router.query.id);
            setBtnSaveText("Update")
            console.log("hwllo", router.query.id)
        }

    }, [router.query.id]);

    useEffect(() => {
        getAllTableData();
    }, [fetchData]);

    // Get Table - Data
    const getAllTableData = (_pageSize = 10, _pageNo = 0) => {
        console.log("_pageSize,_pageNo", _pageSize, _pageNo);
        axios
            .get(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/getAll`, {
                params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                },
            })
            .then((r) => {
                console.log(";rressss", r);
                let result = r.data.trnNewspaperAgencyBillSubmissionList;
                console.log("@@@@@@", result);

                // console.log("billingDivisionAndUnit", billingDivisionAndUnit)

                // let _res = result.map((r, i) => {
                let _res = result.map((r, i) => {
                    return {

                        activeFlag: r.activeFlag,
                        devisionKey: r.divisionKey,
                        srNo: i + 1,
                        id: r.id,
                        attachement: r.attachement,
                        departmentName: r.departmentName,
                        newspaperName: r.newspaperName,
                        // publishedDate: val,
                        sequenceNumber: r.sequenceNumber,


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

    const onSubmitForm = (btnType) => {

        if (btnSaveText === 'Save') {
            _body = {
                ...selectedObject,
                isApproved: true,
                isComplete: false,
            }

            console.log('_body', _body)
            const tempData = axios
                .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body)
                .then((res) => {
                    console.log('res---', res)
                    if (res.status == 201) {
                        sweetAlert('Payment Successfull', 'success')
                        router.push({

                            pathname:
                                '/nrms/transaction/newsPaperAgencybill/',
                            query: {
                                pageMode: "View",

                            },
                        })

                    }
                })
        }
        // Update Data Based On ID
        else if (btnSaveText === 'Update') {
            console.log('_body', _body)
            const tempData = axios
                .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body)
                .then((res) => {
                    console.log('res', res)
                    if (res.status == 201) {
                        billData.id
                            ? sweetAlert(
                                'Updated!',
                                'Record Updated successfully !',
                                'success',
                            )
                            : sweetAlert('Saved!', 'Record Saved successfully !', 'success')
                        getAllTableData()
                        // setButtonInputState(false);
                        router.push({

                            pathname:
                                '/nrms/transaction/newsPaperAgencybill/',
                            query: {
                                pageMode: "View",

                            },
                        })
                    }
                })
        }
    }
    // console.log("data.status === 6",data.status ==5)
    const exitButton = () => {
        reset({
            ...resetValuesExit,
        });
        router.push({

            pathname:
                '/nrms/transaction/paperCuttingBook/',
            query: {
                pageMode: "View",
            },
        })

    };

    const resetValuesCancell = {
        wardName: "",
        departmentName: "",
        priority: "",
        newsAdvertisementSubject: "",
        newsAdvertisementDescription: "",
        rotationGroupName: "",
        rotationSubGroupName: "",
        newsPaperLevel: "",
        typeOfNews: "",
        workName: "",
        newsAttachement: "",

    };

    const resetValuesExit = {
        wardName: "",
        departmentName: "",
        priority: "",
        newsAdvertisementSubject: "",
        newsAdvertisementDescription: "",
        rotationGroupName: "",
        rotationSubGroupName: "",
        newsPaperLevel: "",
        typeOfNews: "",
        workName: "",
        id: null,
        newsAttachement: "",
    };


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
                    <h2>
                        {/* <FormattedLabel id="newsPublish" /> */}
                        Account Details
                    </h2>
                </Box>

                <Box
                    sx={{
                        // marginLeft: 5,
                        // marginRight: 5,
                        marginTop: 2,
                        // marginBottom: 5,
                        // padding: 1,
                        // border:1,
                        // borderColor:'grey.500'
                    }}
                >

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <Grid>


                                <Grid container sx={{ padding: '10px' }}>
                                    {/* Date Picker */}

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

                                            id="standard-textarea"
                                            label="Bank Name"
                                            // value={approvalId}
                                            sx={{ width: 300 }}
                                            multiline
                                            variant="standard"

                                            {...register("newsRotationNumber")}
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
                                            alignItems: "start",
                                        }}
                                    >
                                        {/* {console.log("approvalId",approvalId)} */}
                                        <TextField

                                            id="standard-textarea"
                                            label="Account Number"
                                            // value={approvalId}
                                            sx={{ width: 300 }}
                                            multiline
                                            variant="standard"

                                            {...register("newsRotationNumber")}
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
                                            alignItems: "start",
                                        }}
                                    >
                                        {/* {console.log("approvalId",approvalId)} */}
                                        <TextField

                                            id="standard-textarea"
                                            label="IFSC Code"
                                            // value={approvalId}
                                            sx={{ width: 300 }}
                                            multiline
                                            variant="standard"

                                            {...register("newsRotationNumber")}
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
                                </Grid>

                                <Grid
                                    container
                                    spacing={5}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingTop: '10px',
                                        marginTop: '50px',
                                    }}
                                >
                                    {/* sdfgtjhdty */}

                                    {/* Save ad Draft */}
                                    <Grid item
                                    >
                                        <Button
                                            sx={{ marginRight: 8 }}
                                            variant="contained"
                                            color="primary"
                                            // endIcon={<ClearIcon />}
                                            onClick={() => {
                                                sweetAlert('Payment Successfull', 'success')
                                                router.push({
                                                    pathname: '/nrms/transaction/newsPaperAgencybill',
                                                })
                                            }}
                                        >
                                            {/* <FormattedLabel id="clear" /> */}
                                            Payment
                                        </Button>
                                    </Grid>

                                    {/* dsghfjhyfjfhjkfhy */}
                                </Grid>
                            </Grid>
                        </form>
                    </FormProvider>

                </Box>

            </Paper>
        </>
    );
};

export default Index;