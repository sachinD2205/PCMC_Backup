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
    Modal,

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
// import UploadButton from "../../../../components/fileUpload/UploadButton";

import UploadButton from "../../../../containers/NRMS_ReusableComponent/UploadButton";
// import styles from "./index.module.css";
// import styles from "../../../../../styles/ElectricBillingPayment_Styles/subDivision.module.css";

// import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/subDivisionSchema";
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
import { setApprovalOfNews } from "../../../../features/userSlice";
import styles from "../../transaction/pressNoteRelease/view.module.css";

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
    const language = useSelector((state) => state.labels.language);
    const router = useRouter();
    const [tableData, setTableData] = useState();
    const [dataSource, setDataSource] = useState([]);
    const [id, setID] = useState();
    const [selectedObject, setSelectedObject] = useState()
    const [allTabelData, setAllTabelData] = useState([]);
    const [ward, setWard] = useState([]);
    const [zone, setZone] = useState([]);
    const [rotationGroup, setRotationGroup] = useState([]);
    const [rotationSubGroup, setRotationSubGroup] = useState([]);
    const [department, setDepartment] = useState([]);
    const [newsPaper, setNewsPaper] = useState([]);
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [fetchData, setFetchData] = useState(null);
    const { pressData, setPressData } = useState();
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [buttonInputState, setButtonInputState] = useState();
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [slideChecked, setSlideChecked] = useState(false);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [priority, setPriority] = useState();
    const [date, setDate] = useState();
    const [selectedDate, setSelectedDate] = useState();
    const [pressNote, setPressNote] = useState();
    const [pressNoteDoc, setPressNoteDoc] = useState();
    const [valueData, setValueData] = useState();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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

    // For Paginantion
    const [data, setData] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
    });
    useEffect(() => {

        getDepartment();
        // getRotationGroup();
        // getRotationSubGroup();
        getNewsPaper();
        getZone();

    }, []);

    const getDepartment = () => {
        axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
            setDepartment(res.data.department

            );
            // console.log("res.data", r.data);
        });
    };

    const getAllTableData = (id) => {
        axios
            .get(`${urls.NRMS}/trnPressNoteRequestApproval/getAll`)
            .then((r) => {
                console.log(
                    ":aaaa",
                    id,
                    r?.data?.trnPressNoteRequestApprovalList?.find((row) => id == row.id),
                );
                setValueData(r.data.trnPressNoteRequestApprovalList.find((row) => id == row.id));
            });

    }
    console.log("valueData", valueData)

    useEffect(() => {
        let _res = valueData;

        console.log("editData", valueData)
        if (btnSaveText === "Update") {
            setValue("zoneName", _res?.zoneName ? _res?.zoneName : "-");
            setValue("departmentName", _res?.departmentName ? _res?.departmentName : "-")
            setValue("priority", _res?.priority ? _res?.priority : "-");
            setValue("pressNoteDescription", _res?.pressNoteDescription ? _res?.pressNoteDescription : "-");
            setValue("fromDate", _res?.fromDate ? _res?.fromDate : "-");
            setValue("newsAdSubject", _res?.newsAdSubject ? _res?.newsAdSubject : "-");
            setValue("newspaperName", _res?.newspaperName ? _res?.newspaperName : "-");
          
            setValue("pressAttachment", _res?.pressAttachment ? _res?.pressAttachment : "-");
           
         
        }
    }
        , [valueData]);
    // const getRotationGroup = () => {
    //     console.log("sdafvdaa");
    //     axios.get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`).then((r) => {
    //         console.log("reefsff", r);
    //         setRotationGroup(
    //             r?.data?.newspaperRotationGroupMasterList?.map((r, i) => ({
    //                 id: r.id,
    //                 groupName: r.groupName,
    //                 // groupId: r.groupId,
    //             }))
    //         );
    //         console.log("res.data", r.data);
    //     });
    // };

    // // New Changes

    // const getRotationSubGroup = () => {
    //     axios
    //         .get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getAll`)
    //         .then((r) => {
    //             console.log("iddddd", id)
    //             setRotationSubGroup(
    //                 r?.data?.newspaperRotationSubGroupMasterList?.map((r, i) => ({
    //                     id: r.id,
    //                     subGroupName: r.subGroupName,
    //                     subGroupId: r.subGroupId,
    //                 }))
    //             );
    //         });
    // };
    // console.log("dfb", rotationGroup.subGroupName)


    //   const getRotationGroup = () => {
    //     console.log("sdafvdaa");
    //     axios.get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`).then((r) => {
    //       console.log("reefsff", r);
    //       setRotationGroup(
    //         r?.data?.newspaperRotationGroupMasterList?.map((r, i) => ({
    //           id: r.id,
    //           groupName: r.groupName,
    //           groupId: r.groupId,
    //         }))
    //       );
    //       console.log("res.data", r.data);
    //     });
    //   };

    //   const getRotationSubGroup = (id) => {
    //     console.log("id",id)
    //     axios
    //       .get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getByGroupId?groupId=${id}`)
    //       .then((r) => {
    //         setRotationSubGroup(
    //           r?.data?.newspaperRotationSubGroupMasterList?.map((r, id) => ({
    //             id: r.id,
    //             subGroupName: r.subGroupName,
    //             subGroupId: r.subGroupId,
    //           }))
    //         );
    //       });
    //   };

    //   const getRotationSubGroupName = (field, event) => {
    //     console.log("event.target.value",event.target.value)
    //     field.onChange(event.target.value.name);
    //     // console.log("getValues('rotationGroupName')",getValues('rotationGroupName'))
    //     getRotationSubGroup(event.target.value.id)

    //   };
    const getZone = () => {
        axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
            setZone(res.data.zone);
            console.log("getZone.data", res.data);
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
    // const getNewsPaper = () => {
    //     axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
    //         setNewsPaper(
    //             r?.data?.newspaperMasterList?.map((r, i) => ({
    //                 id: r.id,
    //                 newspaperName: r.newspaperName,
    //             }))
    //         );
    //     });
    // };
    const cancellButton = () => {
        reset({
            ...resetValuesCancell,
            id,
        });
    };

    useEffect(() => {
        if (router.query.id != undefined) {
            getAllTableData(router.query.id);
            setBtnSaveText("Update")
            console.log("hwllo", router.query.id)
        }

    }, [router.query.id]);


    useEffect(() => {
        getAllPressData();

    }, [fetchData]);


    let approvalId = router?.query?.id;



    console.log("selectedobject", selectedObject?.departmentName)

    // const geyBillApproval = () => {

    //     setDepartment(selectedObject?.departmentName ? selectedObject?.departmentName : "-");
    //     setZone(selectedObject?.zoneName ? selectedObject?.zoneName : "-");
    //     setPriority(selectedObject?.priority ? selectedObject?.priority : "-");
    //     setDate(selectedObject?.createDtTm ? selectedObject?.createDtTm
    //         : "-");
    //     setRotationGroup(selectedObject?.rotationGroupName ? selectedObject?.rotationGroupName : "-");
    //     // setSelectedDate(val)
    //     let str = date?.split("T")
    //     let val = str && str[0]
    //     setSelectedDate(val ? val : "-")
    // }
    const getAllPressData = (_pageSize = 10, _pageNo = 0) => {
        console.log("_pageSize,_pageNo", _pageSize, _pageNo);
        axios
            .get(`${urls.NRMS}/trnPressNoteRequestApproval/getAll`, {
                params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                },
            })
            .then((r) => {
                console.log(";rressss", r);
                let result1 = r.data.trnPressNoteRequestApprovalList;
                console.log("@@@@@@", result1.trnPressNoteRequestApprovalList);
                // let _res = result.map((r, i) => {
                let _res = result1.map((r, i) => {
                    console.log("4e4", result1);
                    // fields
                    return {
                        // r.data.map((r, i) => ({
                        activeFlag: r.activeFlag,
                        devisionKey: r.divisionKey,
                        srNo: i + 1,
                        id: r.id,
                        newspaperName: r.newspaperName,
                        wardKey: r.wardKey,
                        zoneName: r.zoneName,
                        pressNoteDescription: r.pressNoteDescription,
                        departmentKey: r.departmentKey,
                        priority: r.priority,
                        newsAdvertismentDescription: r.newsAdvertismentDescription,

                        newsPaperLevel: r.newsPaperLevel,
                        pressAttachment: r.pressAttachment,
                        createDtTm: r.createDtTm,
                        eventDate: r.eventDate,
                        status: r.status === null ? "" :
                            r.status === 0 ? "Save As Draft" :
                                r.status === 1 ? "Approved By HOD" :
                                    r.status === 2 ? "Reject By HOD" :
                                        r.status === 3 ? "Verify By NR Clerk" :
                                            r.status === 4 ? "Reject By  Department Clerk" :
                                                r.status === 5 ? "Approved By NR HOD" :
                                                    r.status === 6 ? "Reject By NR HOD" : "Invalid",
                    };
                });
                setDataSource([..._res]);
                setData({
                    rows: _res,
                    totalRows: r.data.totalElements,
                    rowsPerPageOptions: [10, 20, 50, 100],
                    pageSize: r.data.pageSize,
                    page: r.data.pageNo,
                })
            })
    }

    const onSubmitForm = (formData) => {
        let temp = [];
        const fileObj = {
        }
        temp = [{ ...fileObj, pressAttachment: pressNoteDoc, attachement: pressNote }]
        console.log("fromData", selectedObject);
        let _formData = { ...formData, ...selectedObject, };

        // Save - DB
        let _body = {
            ..._formData,
            pressAttachment: temp[0].pressAttachment,
            attachement: temp[0].attachement,
            activeFlag: formData.activeFlag,

        };


        if (btnSaveText === "Save") {
            console.log("_body", _body);
            const tempData = axios
                .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, _body)
                .then((res) => {
                    console.log("res---", res);
                    if (res.status == 201) {
                        sweetAlert("Saved!", "Record Saved successfully !", "success");
                        setButtonInputState(false);
                        setFetchData(tempData);
                        setEditButtonInputState(false);
                        router.push({
                            pathname:
                                '/nrms/transaction/pressNoteRelease/',
                            query: {
                                pageMode: "View",

                            },
                        })
                    }
                });

        }
        // Update Data Based On ID
        else if (btnSaveText === "Update") {
            console.log("update_body", _body);
            let payload = {
                ...formData,
                status: valueData?.status,
                id: valueData?.id,
                activeFlag: valueData?.activeFlag,
                isComplete: false,
                // pressNoteRequestNo: valueData?.pressNoteRequestNo,
            }
            console.log("payload", payload)
            const tempData = axios
                .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, payload)
                .then((res) => {
                    console.log("res", res);
                    if (res.status == 201) {
                        console.log("updated called")
                        formData.id
                            ? sweetAlert(
                                "Updated!",
                                "Record Updated successfully !",
                                "success"
                            )
                            : sweetAlert("Saved!", "Record Saved successfully !", "success");
                        getAllPressData();
                        // setButtonInputState(false);
                        setEditButtonInputState(false);
                        setDeleteButtonState(false);
                        setIsOpenCollapse(false);
                        router.push({
                            pathname:
                                '/nrms/transaction/pressNoteRelease/',
                            query: {
                                pageMode: "View",
                            },
                        })
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
        router.push({
            pathname:
                '/nrms/transaction/pressNoteRelease/',
            query: {
                pageMode: "View",
            },
        })

    };
    const resetValuesCancell = {
        zoneName: "",
        departmentName: "",
        priority: "",
        newsAdvertisementSubject: "",
        newsAdvertisementDescription: "",
        rotationGroupName: "",
        rotationSubGroupName: "",
        newsPaperLevel: "",
        newsAdSubject: "",
    };
    const resetValuesExit = {
        zoneName: "",
        departmentName: "",
        priority: "",
        newsAdvertisementDescription: "",
        rotationGroupName: "",
        newsAdSubject: "",
        id: null,
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

                        Press Note Release Request

                        {/* <FormattedLabel id="addHearing" /> */}
                    </h2>
                </Box>
                <Divider />
                <Box
                    sx={{
                        // marginLeft: 5,
                        // marginRight: 5,
                        // marginTop: 2,
                        // marginBottom: 5,
                        // padding: 1,
                        // border:1,
                        // borderColor:'grey.500'
                    }}
                >
                    <Box p={1}>



                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmitForm)}>


                                <Grid>

                                    <Grid container sx={{ padding: "10px" }}>
                                        {/* Date Picker */}


                                        {/* from date in marathi */}

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
                                            <FormControl
                                                // variant="outlined"
                                                variant="standard"
                                                size="small"
                                                sx={{ width: 300 }}
                                                error={!!errors.zoneKey}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    {/* Location Name */}
                                                    {/* {<FormattedLabel id="locationName" />} */}
                                                    Zone
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            // disabled={router?.query?.pageMode === "View"}
                                                            // sx={{ width: 200 }}
                                                            value={field.value}
                                                            // onChange={(value) => field.onChange(value)}

                                                            {...register("zoneName")}
                                                        // label={<FormattedLabel id="zone" />}

                                                        // InputLabelProps={{
                                                        //   //true
                                                        //   shrink:
                                                        //     (watch("officeLocation") ? true : false) ||
                                                        //     (router.query.officeLocation ? true : false),
                                                        // }}
                                                        >
                                                            {zone &&
                                                                zone.map((each, index) => (
                                                                    <MenuItem key={index} value={each.zoneName}>
                                                                        {each.zoneName}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="zoneName"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                <FormHelperText>
                                                    {errors?.zoneName
                                                        ? errors.zoneName.message
                                                        : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>


                                        {/* from date in marathi */}
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
                                            <FormControl
                                                // variant="outlined"
                                                variant="standard"
                                                // size="small"
                                                // sx={{ m: 1, minWidth: 120 }}
                                                error={!!errors.concenDeptId}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    {/* Location Name */}
                                                    {/* {<FormattedLabel id="de     partment" />} */}
                                                    Department Name
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            // required
                                                            // disabled={router?.query?.pageMode === "View"}
                                                            sx={{ width: 300 }}
                                                            value={field.value}                              // value={departmentName}
                                                            {...register("departmentName")}
                                                        //   label={<FormattedLabel id="department" />}
                                                        // InputLabelProps={{
                                                        //   //true
                                                        //   shrink:
                                                        //     (watch("officeLocation") ? true : false) ||
                                                        //     (router.query.officeLocation ? true : false),
                                                        // }}
                                                        >

                                                            {department &&
                                                                department.map((department, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={department.department}
                                                                    >
                                                                        {department.department}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="departmentName"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                                            </FormControl>
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
                                            <FormControl
                                                // variant="outlined"
                                                variant="standard"
                                                size="small"
                                                // sx={{ m: 1, minWidth: 120 }}
                                                error={!!errors.concenDeptId}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    {/* Location Name */}
                                                    {/* {<FormattedLabel id="locationName" />} */}
                                                    Priority
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            // required
                                                            // disabled={router?.query?.pageMode === "View"}
                                                            sx={{ width: 300 }}
                                                            value={field.value}
                                                            // onChange={(value) => field.onChange(value)}

                                                            {...register("priority")}
                                                        //   label={<FormattedLabel id="Priority" />}
                                                        // InputLabelProps={{
                                                        //   //true
                                                        //   shrink:
                                                        //     (watch("officeLocation") ? true : false) ||
                                                        //     (router.query.officeLocation ? true : false),
                                                        // }}
                                                        >
                                                            <MenuItem value="High">High</MenuItem>
                                                            <MenuItem value="Medium">Medium</MenuItem>
                                                            <MenuItem value="Low">Low</MenuItem>
                                                        </Select>
                                                    )}
                                                    name="priority"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                                            </FormControl>
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
                                            <FormControl
                                                // variant="outlined"
                                                variant="standard"
                                                size="small"
                                                // sx={{ m: 1, minWidth: 120 }}
                                                error={!!errors.concenDeptId}
                                            >
                                                <InputLabel id="demo-simple-select-standard-label">
                                                    {/* Location Name */}
                                                    {/* {<FormattedLabel id="locationName" />} */}
                                                    Newspaper Name
                                                </InputLabel>
                                                <Controller
                                                    render={({ field }) => (
                                                        <Select
                                                            // required
                                                            // disabled={router?.query?.pageMode === "View"}
                                                            // sx={{ m: 1, minWidth: '50%' }}
                                                            sx={{ width: 300 }}
                                                            value={field.value}
                                                            // onChange={(value) => field.onChange(value)}
                                                            {...register("newspaperName")}
                                                        //   label={<FormattedLabel id="locationName" />}
                                                        >
                                                            {newsPaper &&
                                                                newsPaper.map((newsPaper, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={newsPaper.newspaperName}
                                                                    >
                                                                        {newsPaper.newspaperName}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    )}
                                                    name="newspaperName"
                                                    control={control}
                                                    defaultValue=""
                                                />
                                                {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                                            </FormControl>
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
                                                // required
                                                // disabled={router?.query?.pageMode === "View"}
                                                sx={{ width: 300 }}
                                                id="standard-textarea"
                                                label="Press Note Subject"
                                                multiline
                                                variant="standard"
                                                {...register("newsAdSubject")}
                                                error={!!errors.label2}
                                                helperText={
                                                    errors?.label2 ? errors.label2.message : null
                                                }
                                            InputLabelProps={{
                                                //true
                                                shrink:true
                                                    
                                            }}
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
                                                // required
                                                // disabled={router?.query?.pageMode === "View"}
                                                sx={{ width: 300 }}
                                                id="standard-textarea"
                                                label="Press Note Description"
                                                multiline
                                                variant="standard"
                                                {...register("pressNoteDescription")}
                                                error={!!errors.label2}
                                                helperText={
                                                    errors?.label2 ? errors.label2.message : null
                                                }
                                                InputLabelProps={{
                                                    //true
                                                    shrink:true
                                                        
                                                }}
                                            />
                                        </Grid>


                                        <Grid item
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
                                            }}>
                                            <FormControl
                                                variant="standard"
                                                style={{ marginTop: 10 }}
                                                error={!!errors.fromDate}
                                            >
                                                <Controller
                                                    control={control}
                                                    name="fromDate"
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DatePicker
                                                                variant="standard"
                                                                inputFormat="DD/MM/yyyy"
                                                                label={
                                                                    <span style={{ fontSize: 16 }}>
                                                                        Press Note Publish Date
                                                                    </span>
                                                                }
                                                                value={field.value}
                                                                minDate={new Date()}
                                                                onChange={(date) =>
                                                                    field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                                                                }
                                                                selected={field.value}
                                                                center
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        size="small"
                                                                        variant="standard"
                                                                        sx={{ width: 300 }}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                                <FormHelperText>
                                                    {errors?.fromDate ? errors.fromDate.message : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>

                                    </Grid>
                                    <Box
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            paddingTop: "10px",
                                            marginTop: "30px",
                                            background:
                                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                                        }}

                                    >
                                        <h2>

                                            Attachement

                                            {/* <FormattedLabel id="addHearing" /> */}
                                        </h2>
                                    </Box>
                                    <Grid container sx={{ padding: "10px" }}>

                                        <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            p={1}
                                            style={{
                                                margin: "25px",
                                                marginLeft: '80px'
                                            }}



                                        >
                                            {console.log("ppp", pressNoteDoc)}{" "}
                                            <Typography>
                                                <h3>  Attach Press Note</h3>
                                            </Typography>

                                            {/* {console.log("Doc", docCertificate)} */}
                                        </Grid>
                                        <Grid
                                            item
                                            xl={3}
                                            lg={3}
                                            md={3}
                                            sm={3}
                                            xs={12}
                                            p={1}
                                            style={{ margin: "20px" }}
                                        >
                                            <UploadButton
                                                appName="TP"
                                                serviceName="PARTMAP"
                                                fileUpdater={setPressNoteDoc}
                                                filePath={pressNoteDoc}

                                            // sx={{ width: 200 }}
                                            />{" "}

                                        </Grid>

                                        <Grid
                                            item
                                            xl={3}
                                            lg={3}
                                            md={3}
                                            sm={3}
                                            xs={12}
                                            p={1}
                                            style={{ margin: "20px" }}
                                        >
                                            <UploadButton
                                                appName="TP"
                                                serviceName="PARTMAP"
                                                fileUpdater={setPressNote}
                                                filePath={pressNote}
                                            // sx={{ width: 200 }}
                                            />{" "}
                                        </Grid>



                                    </Grid>
                                    {/* to date in marathi */}
                                    <Grid
                                        container
                                        spacing={5}

                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            paddingTop: "10px",
                                            marginTop: "30px",
                                            marginBottom: "50px",
                                        }}
                                    >
                                        {/* sdfgtjhdty */}
                                        <Grid container ml={5}
                                            border px={5}
                                        >
                                            {/* Save ad Draft */}
                                            <Grid item xs={2}>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    // sx={{ marginRight: 8 }}
                                                    type="submit"
                                                    variant="contained"
                                                    color="success"
                                                    endIcon={<SaveIcon />}

                                                >
                                                    {btnSaveText === "Update"
                                                        ? // <FormattedLabel id="update" />
                                                        "Update"
                                                        : // <FormattedLabel id="save" />
                                                        "Save"}
                                                </Button>

                                            </Grid>

                                            <Grid item xs={2}></Grid>

                                            <Grid item>
                                                <Button
                                                    // sx={{ marginRight: 8 }}
                                                    variant="contained"
                                                    color="primary"
                                                    endIcon={<ClearIcon />}
                                                    onClick={() => cancellButton()}
                                                >
                                                    {/* <FormattedLabel id="clear" /> */}
                                                    Clear
                                                </Button>
                                            </Grid>
                                            <Grid item xs={2}></Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    endIcon={<ExitToAppIcon />}
                                                    onClick={() => exitButton()}
                                                >
                                                    {/* <FormattedLabel id="exit" /> */}
                                                    Exit
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        {/* dsghfjhyfjfhjkfhy */}

                                    </Grid>
                                </Grid>
                            </form>
                        </FormProvider>
                    </Box>
                </Box>

            </Paper>
        </>
    );
};

export default Index;





