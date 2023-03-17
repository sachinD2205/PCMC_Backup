// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
    Box,
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
    Stack,
    TextField,
    ThemeProvider,
    Toolbar,
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
// import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
// import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/billingCycleSchema";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
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
// import theme from "../../../../theme";
import theme from "../../../../theme"
const Index = () => {
    const {
        register,
        control,
        handleSubmit,
        methods,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
        // resolver: yupResolver(schema),
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

    const [groupNames, setGroupNames] = useState([])
    const language = useSelector((state) => state.labels.language);

    const [data, setData] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
    });

    useEffect(() => {
        getBookClassifications();
    }, [fetchData]);

    const getGroups = (_pageSize = 10, _pageNo = 0) => {
        console.log("_pageSize,_pageNo", _pageSize, _pageNo);
        axios
            .get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`, {
                params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                },
            })
            .then((r) => {
                console.log(";r", r);
                let result = r.data.newspaperRotationGroupMasterList;
                console.log("result", result);
                let _res = result.map((r, i) => {
                    console.log("44");
                    return {
                        // r.data.map((r, i) => ({
                        activeFlag: r.activeFlag,

                        id: r.id,
                        srNo: i + 1,
                        groupName: r.groupName,

                        status: r.activeFlag === "Y" ? "Active" : "Inactive",
                    };
                });
                setGroupNames([..._res]);
            });
    };

    useEffect(() => {
        getGroups()
    }, [])

    // Get Table - Data
    const getBookClassifications = (_pageSize = 10, _pageNo = 0) => {
        console.log("_pageSize,_pageNo", _pageSize, _pageNo);
        axios
            .get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getAll`, {
                params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                },
            })
            .then((r) => {
                console.log(";r", r);
                let result = r.data.newspaperRotationSubGroupMasterList;
                console.log("result", result);

                let _res = result.map((r, i) => {
                    console.log("44");
                    return {
                        // r.data.map((r, i) => ({
                        activeFlag: r.activeFlag,

                        id: r.id,
                        srNo: i + 1,
                        groupId: r.groupId,
                        newspaperLevel: r.newspaperLevel,
                        newspaperLevelMasterKey: r.newspaperLevelMasterKey,
                        newspaperMasterKey: r.newspaperMasterKey,
                        newspaperName: r.newspaperName,
                        newspaperSequenceNumber: r.newspaperSequenceNumber,
                        remark: r.remark,
                        subGroupId: r.subGroupId,
                        subGroupName: r.subGroupName,

                        status: r.activeFlag === "Y" ? "Active" : "Inactive",
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
        };
        if (btnSaveText === "Save") {
            const tempData = axios
                .post(`${urls.NRMS}/newspaperRotationSubGroupMaster/save`, _body)
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
                .post(`${urls.NRMS}/newspaperRotationSubGroupMaster/save`, _body)
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
                        getBookClassifications();
                        // setButtonInputState(false);
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
                    axios
                        // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
                        .post(`${urls.NRMS}/newspaperRotationSubGroupMaster/save`, body)
                        .then((res) => {
                            console.log("delet res", res);
                            if (res.status == 201) {
                                swal("Record is Successfully Deleted!", {
                                    icon: "success",
                                });
                                getBookClassifications();
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
                    axios
                        .delete(`${urls.NRMS}/newspaperRotationSubGroupMaster/delete/${body.id}`)
                        .then((res) => {
                            console.log("delet res", res);
                            if (res.status == 201) {
                                swal("Record is Successfully Activated!", {
                                    icon: "success",
                                });
                                // getPaymentRate();
                                getBookClassifications();
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
        subGroupName: "",
    };

    // Reset Values Exit
    const resetValuesExit = {
        subGroupName: "",

        id: null,
    };

    const columns = [
        { field: "srNo", headerName: "id", flex: 1 },
        {

            field: "subGroupId",

            headerName: "Sub Group ID",
            flex: 1,
        },
        {

            field: "subGroupName",

            headerName: "Sub Group Name",
            flex: 1,
        },
        {

            field: "newspaperName",

            headerName: "News Paper Name",
            flex: 1,
        },
        {

            field: "newspaperSequenceNumber",

            headerName: "Newspaper Sequence Number",
            flex: 1,
        },
        {

            field: "newspaperLevel",

            headerName: "Newspaper Level",
            flex: 1,
        },
        {

            field: "remark",

            headerName: "Remark",
            flex: 1,
        },

        {
            field: "actions",
            headerName: "Actions",
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
                                // setButtonInputState(true);
                                console.log("params.row: ", params.row);
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

    // Row

    return (
        <ThemeProvider theme={theme}>
            <Paper
                elevation={8}
                variant="outlined"
                sx={{
                    border: 1,
                    borderColor: "grey.500",
                    marginLeft: "10px",
                    marginRight: "10px",
                    marginTop: "10px",
                    marginBottom: "60px",
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
                        Newspaper Rotation Sub Group
                    </h2>
                </Box>

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
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <FormControl
                                            variant="standard"
                                            sx={{ marginLeft: 10, marginTop: 3 }}
                                            error={!!errors.studyCenter}
                                        >
                                            <InputLabel id='demo-simple-select-standard-label'>
                                                Group Name
                                            </InputLabel>

                                            <Controller
                                                render={({ field }) => (
                                                    <Select
                                                        // sx={{ width: "100%" }}
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            console.log(value.target.value);
                                                            field.onChange(value);
                                                        }}
                                                        label="Group Name"
                                                    >
                                                        {groupNames &&
                                                            groupNames.map((groupName, index) => (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={groupName.groupName}
                                                                >
                                                                    {groupName.groupName}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                )}
                                                name="groupName"
                                                control={control}
                                                defaultValue=""
                                            />
                                            <FormHelperText>
                                                {errors?.groupName
                                                    ? errors.groupName.message
                                                    : null}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                        <TextField
                                            label="Rotation Sub Group Name"
                                            id="standard-basic"
                                            variant="standard"
                                            {...register("subGroupName")}
                                            error={!!errors.subGroupName}
                                            InputProps={{ style: { fontSize: 18 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 15 },
                                                //true
                                                shrink:
                                                    (watch("subGroupName") ? true : false) ||
                                                    (router.query.subGroupName ? true : false),
                                            }}
                                            helperText={
                                                // errors?.studentName ? errors.studentName.message : null
                                                errors?.subGroupName ? "Rotation Group Name is Required !!!" : null
                                            }
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
                                                {btnSaveText === "Update" ? (
                                                    "Update"
                                                ) : (
                                                    "Save"
                                                )}
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
                                                clear
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                endIcon={<ExitToAppIcon />}
                                                onClick={() => exitButton()}
                                            >
                                                exit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {/* </div> */}
                                </Grid>
                            </Slide>
                        )}
                    </form>
                </FormProvider>

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
                        add
                    </Button>
                </div>

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
                        getBookClassifications(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                        console.log("222", _data);
                        // updateData("page", 1);
                        getBookClassifications(_data, data.page);
                    }}
                />
            </Paper>
        </ThemeProvider>
    );
};

export default Index;

