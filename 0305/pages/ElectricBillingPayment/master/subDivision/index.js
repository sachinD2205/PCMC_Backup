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
    Grid,
    InputBase,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slide,
    TextField,
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
import { FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css
import styles from "../../../../styles/ElectricBillingPayment_Styles/subDivision.module.css";
import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/subDivisionSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";

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
        resolver: yupResolver(schema),
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
    const [division, setDivision] = useState([]);

    const router = useRouter();

    const language = useSelector((state) => state.labels.language);

    const [data, setData] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
    });

    useEffect(() => {
        getSubDivision();
        getbillingUnitAndDivision();
    }, [fetchData]);

    // Get Table - Data
    const getSubDivision = (_pageSize = 10, _pageNo = 0) => {
        console.log("_pageSize,_pageNo", _pageSize, _pageNo);
        axios
            .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
                params: {
                    pageSize: _pageSize,
                    pageNo: _pageNo,
                },
            })
            .then((r) => {
                console.log(";r", r);
                let result = r.data.mstSubDivisionList;
                console.log("result", result);

                let _res = result && result.map((r, i) => {
                    return {
                        // r.data.map((r, i) => ({
                        activeFlag: r.activeFlag,
                        devisionKey: r.divisionKey,
                        id: r.id,
                        srNo: (i + 1) + (_pageNo * _pageSize),
                        subDivision: r.subDivision,
                        subDivisionMr: r.subDivisionMr,
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

    const getbillingUnitAndDivision = (_pageSize = 10000, _pageNo = 0) => {
        axios
          .get(`${urls.EBPSURL}/mstBillingUnit/getAll`, {
            params: {
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
          })
          .then((r) => {
            let result = r.data.mstBillingUnitList;
            setDivision([...result]);
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
            console.log("_body", _body);
            const tempData = axios
                .post(`${urls.EBPSURL}/mstSubDivision/save`, _body)
                .then((res) => {
                    console.log("res---", res)
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
                .post(`${urls.EBPSURL}/mstSubDivision/save`, _body)
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
                        getSubDivision();
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
                        .post(`${urls.EBPSURL}/mstSubDivision/save`, body)
                        .then((res) => {
                            console.log("delet res", res);
                            if (res.status == 201) {
                                swal("Record is Successfully Deleted!", {
                                    icon: "success",
                                });
                                getSubDivision();
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
                        .post(`${urls.EBPSURL}/mstSubDivision/save`, body)
                        .then((res) => {
                            console.log("delet res", res);
                            if (res.status == 201) {
                                swal("Record is Successfully Activated!", {
                                    icon: "success",
                                });
                                // getPaymentRate();
                                getSubDivision();
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
        subDivision: "",
        subDivisionMr: "",
    };

    // Reset Values Exit
    const resetValuesExit = {
        subDivision: "",
        subDivisionMr: "",
        id: null,
    };

    const columns = [
        { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
        // { field: "courtNo", headerName: "Court No", flex: 1 },
        {
            // field: "subDivision",
            field: language === "en" ? "subDivision" : "subDivisionMr",
            headerName: <FormattedLabel id="subDivision" />,
            flex: 1,
        },

        {
            // field: "subDivision",
            field: language === "en" ? "division" : "divisionMr",
            headerName: <FormattedLabel id="division" />,
            flex: 1,
        },

        {
            field: "actions",
            headerName: <FormattedLabel id="actions" />,
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
                    <FormattedLabel id="subDivision" />
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
                                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <FormControl style={{width:"75%"}}>
                                    <FormattedLabel id="division" />
                                    <Select
                                        labelId="Division"
                                        id="demo-simple-select"
                                        // value={divisionKey}
                                        label="Division(In English)"
                                        variant="standard"
                                        {...register("divisionKey")}
                                        error={!!errors.divisionKey}
                                        InputProps={{ style: { fontSize: 18 } }}
                                        InputLabelProps={{
                                            style: { fontSize: 15 },
                                            //true
                                            shrink:
                                                (watch("divisionKey") ? true : false) ||
                                                (router.query.divisionKey ? true : false),
                                        }}
                                        helperText={
                                            errors?.divisionKey ? errors.divisionKey.message : null
                                        }
                                    >
                                        {division && division.map((item,index)=>(
                                            <MenuItem key={index} value={item.id}>{item.divisionName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                <FormControl style={{width:"75%"}}>
                                    <FormattedLabel id="division" />
                                    <Select
                                        labelId="Division (In Marathi)"
                                        id="demo-simple-select"
                                        // value={divisionKey}
                                        label={<FormattedLabel id="divisionMr" />}
                                        variant="standard"
                                        {...register("divisionKeyMR")}
                                        error={!!errors.divisionKeyMR}
                                        InputProps={{ style: { fontSize: 18 } }}
                                        InputLabelProps={{
                                            style: { fontSize: 15 },
                                            //true
                                            shrink:
                                                (watch("divisionKeyMR") ? true : false) ||
                                                (router.query.divisionKeyMR ? true : false),
                                        }}
                                        helperText={
                                            errors?.divisionKeyMR ? errors.divisionKeyMR.message : null
                                        }
                                    >
                                       {division && division.map((item,index)=>(
                                        
                                           <MenuItem key={index} value={item.id}>{item.divisionNameMr}</MenuItem>
                                       ))}
                                    </Select>
                                </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <TextField
                                        style={{width:"75%"}}
                                        label={<FormattedLabel id="subDivisionEn" />}
                                        id="standard-basic"
                                        variant="standard"
                                        {...register("subDivision")}
                                        error={!!errors.subDivision}
                                        InputProps={{ style: { fontSize: 18 } }}
                                        InputLabelProps={{
                                            style: { fontSize: 15 },
                                            //true
                                            shrink:
                                                (watch("subDivision") ? true : false) ||
                                                (router.query.subDivision ? true : false),
                                        }}
                                        helperText={
                                            errors?.subDivision ? errors.subDivision.message : null
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <TextField
                                    style={{width:"75%"}}
                                        label={<FormattedLabel id="subDivisionMr" />}
                                        id="standard-basic"
                                        variant="standard"
                                        {...register("subDivisionMr")}
                                        error={!!errors.subDivisionMr}
                                        InputProps={{ style: { fontSize: 18 } }}
                                        InputLabelProps={{
                                            style: { fontSize: 15 },
                                            //true
                                            shrink:
                                                (watch("subDivisionMr") ? true : false) ||
                                                (router.query.subDivisionMr ? true : false),
                                        }}
                                        helperText={
                                            // errors?.studentName ? errors.studentName.message : null
                                            errors?.subDivisionMr ? errors.subDivisionMr.message : null
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
                                                <FormattedLabel id="update" />
                                            ) : (
                                                <FormattedLabel id="save" />
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
                                            <FormattedLabel id="clear" />
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            endIcon={<ExitToAppIcon />}
                                            onClick={() => exitButton()}
                                        >
                                            <FormattedLabel id="exit" />
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
                    <FormattedLabel id="add" />
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
                    getSubDivision(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getSubDivision(_data, data.page);
                }}
            />
        </Paper>
    );
};

export default Index;
