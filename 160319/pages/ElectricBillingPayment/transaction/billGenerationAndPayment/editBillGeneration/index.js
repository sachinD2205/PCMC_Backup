import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Slide,
    InputLabel,
    ListItemText,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextareaAutosize,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import BasicLayout from "../../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/billGenerationSchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../../../features/labelSlice";
import urls from "../../../../../URLS/urls";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

// import samplePdf from "../../../../../public/certificate.pdf"
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { setNewEntryConnection } from '../../../../../features/userSlice'
import IconButton from "@mui/material/IconButton";
import UploadButton from "../../../../../components/fileUpload/UploadButton";


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
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "75%",
        height: "75%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        overflow: "scroll",
    };

    const router = useRouter();
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [dataSource, setDataSource] = useState({});
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [ward, setWard] = useState("");
    const [department, setDepartment] = useState("");
    const [zone, setZone] = useState("");
    const [consumerName, setConsumerName] = useState("")
    const [consumerAddress, setConsumerAddress] = useState("")
    const [pincode, setPincode] = useState("")
    const [consumptionType, setConsumptionType] = useState("");
    const [loadType, setLoadType] = useState("");
    const [phaseType, setPhaseType] = useState("");
    const [slabType, setSlabType] = useState("");
    const [usageType, setUsageType] = useState("");
    const [msedclCategory, setMsedclCategory] = useState("");
    const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState("");
    const [subDivision, setSubDivision] = useState("");
    const [departmentCategory, setDepartmentCategory] = useState("");
    const [sanctionedDemand, setSanctionedDemand] = useState("");
    const [contractDemand, setContractDemand] = useState("");
    const [billingCycle, setBillingCycle] = useState("");
    const [geoCodeGisId, setGeoCodeGisId] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [consumerNo, setConsumerNo] = useState("");
    const [meterStatus, setMeterStatus] = useState([]);
    const [previousReadingDate, setPreviousReadingDate] = useState(null);
    const [currentReadingDate, setCurrentReadingDate] = useState(null);
    const [billDueDate, setBillDueDate] = useState(null);
    const [previousReading, setPreviousReading] = useState("");
    const [currentReading, setCurrentReading] = useState("");
    const [toBePaidAmount, setToBePaidAmount] = useState("");
    const [meterStatusKey, setMeterStatusKey] = useState("");
    const [arrears, setArrears] = useState("");
    const [buttonInputState, setButtonInputState] = useState();
    const [officialNotesheetFlag, setOfficialNotesheetFlag] = useState(false)
    const [billAFlag, setBillAFlag] = useState(false)
    const [billBFlag, setBillBFlag] = useState(false)
    const [formAFlag, setFormAFlag] = useState(false)
    const [formBFlag, setFormBFlag] = useState(false)
    const [choice, setChoice] = useState("")
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openEntryConnections, setOpenEntryConnections] = React.useState(false);
    const handleOpenEntryConnections = () => setOpenEntryConnections(true);
    const handleCloseEntryConnections = () => setOpenEntryConnections(false);
    const dispatch = useDispatch();
    const [fetchData, setFetchData] = useState(null);
    const [documentList, setDocumentList] = useState([])
    const [searchedConnections, setSearchedConnections] = useState({
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
    });

    const generateDocumentsFlag = {
        officialNotesheet: true,
        billA: true,
        billB: true,
        formA: true,
        formB: true
    }

    // dispatch(setGenerateDocumentsFlags(generateDocumentsFlag));



    const language = useSelector((state) => state.labels.language);

    // get Connection Entry Data

    const entryConnectionData = useSelector((state) => state.user.entryConnectionData);

    //get logged in user
    const user = useSelector((state) => state.user.user);

    // selected menu from drawer

    let selectedMenuFromDrawer = Number(
        localStorage.getItem("selectedMenuFromDrawer")
    );

    console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

    // get authority of selected user

    const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
    })?.roles;

    useEffect(() => {
        getWard();
        getDepartment();
        getZone();
        getConsumerDetails();
        getConsumptionType();
        getLoadType();
        getPhaseType();
        getSlabType();
        getUsageType();
        getMsedclCategory();
        getBillingDivisionAndUnit();
        getSubDivision();
        getDepartmentCategory();
        getBillingCycle();
        getMeterStatus()
    }, [dataSource]);

    useEffect(() => {
        getAllBillData(router.query.id);
    }, [router.query.id]);

    // Get Table - Data
    const getAllBillData = (id) => {
        axios
            .get(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/getAll`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })
            .then((r) => {
                let result = r.data.trnMeterReadingAndBillGenerateList;
                console.log("result", result);
                let temp = result && result.find((obj) => {
                    return obj.id == id;
                })
                console.log("getAllBillData", temp);
                setFetchData(temp);
                setConsumerNo(temp?.consumerNo)
                handleSelectConnection(temp?.newConnectionKey)
                setPreviousReadingDate(temp?.prevReadingDate);
                setCurrentReadingDate(temp?.currReadingDate);
                setPreviousReading(temp?.prevReading);
                setCurrentReading(temp?.currReading);
                setBillDueDate(temp?.billDueDate);
                setToBePaidAmount(temp?.toBePaidAmount);
                setMeterStatusKey(temp?.meterStatusKey);
                setArrears(temp?.arrears);
            });
    };

    // handle search connections
    const handleSearchConnections = () => {
        handleOpenEntryConnections();
        console.log("consumerNo", consumerNo)
        axios.get(`${urls.EBPSURL}/trnNewConnectionEntry/search/consumerNo?consumerNo=${consumerNo}`,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        )
            .then((r) => {
                let result = r.data.trnNewConnectionEntryList;
                console.log("searched connection", result);

                if (subDivision) {
                    let _res = result.map((r, i) => {
                        console.log("r", r)
                        return {
                            activeFlag: r.activeFlag,
                            id: r.id,
                            srNo: (i + 1),
                            consumerNo: r.consumerNo,
                            consumerName: r.consumerName,
                            consumerNameMr: r.consumerNameMr,
                            consumerAddress: r.consumerAddress,
                            consumerAddressMr: r.consumerAddressMr,
                            meterNo: r.meterNo,
                        };
                    });

                    setSearchedConnections({
                        rows: _res,
                        totalRows: r.data.totalElements,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: r.data.pageSize,
                        page: r.data.pageNo,
                    });
                }
            });
    }

    const generateOfficialNotesheet = () => {
        handleOpen();
        setOfficialNotesheetFlag(true);
    }

    const generateFormA = () => {
        handleOpen();
        setFormAFlag(true);
    }

    const generateFormB = () => {
        handleOpen();
        setFormBFlag(true);

    }

    const generateBillA = () => {
        handleOpen();
        setBillAFlag(true);
    }

    const generateBillB = () => {
        handleOpen();
        setBillBFlag(true);
    }

    const handleSelectConnection = (id) => {
        console.log("selected id", id)
        getNewConnectionsData(id);
    }

    function showDateFormat(date) {
        let formattedDate = date?.split("T");
        return formattedDate ? formattedDate[0] : "-"
    }


    // get Meter Status
    const getMeterStatus = () => {
        axios.get(`${urls.EBPSURL}/mstMeterStatus/getAll`).then((res) => {
            setMeterStatus(res.data.mstMeterStatusList);
            console.log("getUsageType.data", res.data);
        });
    };

    // get Msedcl Category  
    const getMsedclCategoryDetails = () => {
        axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
            setMsedclCategoryDetails(res.data.mstMsedclCategoryList);
            console.log("getMsedclCategory.data", res.data);
        });
    };

    // get Ward Name
    const getWard = () => {
        console.log("dataSource", dataSource);
        axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
            let temp = res.data.ward;
            console.log("temp", temp);
            let _res = temp.find((each) => {
                return each.id === dataSource?.wardKey
            })
            setWard(_res?.wardName ? _res?.wardName : "-");
        });
    };

    // get Department Name
    const getDepartment = () => {
        axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
            let temp = res.data.department;
            let _res = temp.find((obj) => obj.id === dataSource?.departmentKey)
            setDepartment(_res?.department ? _res?.department : "-");
        });
    };

    // get Zone Name
    const getZone = () => {
        axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
            let temp = res.data.zone;
            let _res = temp.find((obj) => obj.id === dataSource?.zoneKey)
            setZone(_res?.zoneName ? _res?.zoneName : "-");
        });
    };

    const getConsumerDetails = () => {
        setConsumerName(dataSource?.consumerName ? dataSource?.consumerName : "-");
        setConsumerAddress(dataSource?.consumerAddress ? dataSource?.consumerAddress : "-");
        setPincode(dataSource?.pinCode ? dataSource?.pinCode : "-");
        showDateFormat(dataSource?.meterConnectionDate)
        setSanctionedDemand(dataSource?.sanctionedDemand ? dataSource?.sanctionedDemand : "-");
        setContractDemand(dataSource?.contractDemand ? dataSource?.contractDemand : "-");
        setGeoCodeGisId(dataSource?.geoCodeGisId ? dataSource?.geoCodeGisId : "-");
        setLatitude(dataSource?.latitude ? dataSource?.latitude : "-");
        setLongitude(dataSource?.longitude ? dataSource?.longitude : "-");
    }

    // get Consumption Type
    const getConsumptionType = () => {
        axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
            let temp = res.data.mstConsumptionTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.consumptionTypeKey)
            setConsumptionType(_res?.consumptionType ? _res?.consumptionType : "-");
        });
    };

    // get Billing Cycle
    const getBillingCycle = () => {
        axios.get(`${urls.EBPSURL}/mstBillingCycle/getAll`).then((res) => {
            let temp = res.data.mstBillingCycleList;
            let _res = temp.find((obj) => obj.id === dataSource?.billingCycleKey)
            setBillingCycle(_res?.billingCycle ? _res?.billingCycle : "-");
        });
    };

    // get Load Type
    const getLoadType = () => {
        axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
            let temp = res.data.mstLoadTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.loadTypeKey)
            setLoadType(_res?.loadType ? _res?.loadType : "-");
        });
    };

    // get Phase Type
    const getPhaseType = () => {
        axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
            let temp = res.data.mstPhaseTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.phaseKey)
            setPhaseType(_res?.phaseType ? _res?.phaseType : "-");
        });
    };

    // get Slab Type
    const getSlabType = () => {
        axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
            let temp = res.data.mstSlabTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.slabTypeKey)
            setSlabType(_res?.slabType ? _res?.slabType : "-");
        });
    };

    // get Usage Type
    const getUsageType = () => {
        axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
            let temp = res.data.mstEbUsageTypeList;
            let _res = temp.find((obj) => obj.id === dataSource?.usageTypeKey)
            setUsageType(_res?.usageType ? _res?.usageType : "-");
        });
    };

    // get Msedcl Category  
    const getMsedclCategory = () => {
        axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
            let temp = res.data.mstMsedclCategoryList;
            let _res = temp.find((obj) => obj.id === dataSource?.msedclCategoryKey)
            setMsedclCategory(_res?.msedclCategory ? _res?.msedclCategory : "-");
        });
    };

    // get Billing Division And Unit 
    const getBillingDivisionAndUnit = () => {
        axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
            let temp = res.data.mstBillingUnitList;
            let _res = temp.find((obj) => obj.id === dataSource?.billingUnitKey)
            setBillingDivisionAndUnit(`${_res?.divisionName ? _res?.divisionName : "-"}/${_res?.billingUnit ? _res?.billingUnit : "-"}`);
        });
    };

    // get SubDivision
    const getSubDivision = () => {
        axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
            let temp = res.data.mstSubDivisionList;
            let _res = temp.find((obj) => obj.id === dataSource?.subDivisionKey)
            setSubDivision(_res?.subDivision ? _res?.subDivision : "-");
        });
    };

    // get Department Category
    const getDepartmentCategory = () => {
        axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
            let temp = res.data.mstDepartmentCategoryList;
            let _res = temp.find((obj) => obj.id === dataSource?.departmentCategoryKey)
            setDepartmentCategory(_res?.departmentCategory ? _res?.departmentCategory : "-");
        });
    };

    // Get Table - Data
    const getNewConnectionsData = (connectionId) => {
        axios
            .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            .then((r) => {
                let result = r.data.trnNewConnectionEntryList;
                let _res = result.find((obj) => obj.id == connectionId)
                setDataSource(_res)
                handleCloseEntryConnections();
            });
    };

    const onSubmitForm = () => {
        console.log("adas")
        let _formData = {
            prevReadingDate: previousReadingDate,
            currReadingDate: currentReadingDate,
            prevReading: previousReading,
            currReading: currentReading,
            billDueDate,
            consumedUnit: Math.abs(previousReading - currentReading),
            consumerNo,
            toBePaidAmount,
            meterStatusKey,
            arrears,
            id: fetchData?.id,
            applicationNo: dataSource?.applicationNo,
            wardKey: dataSource?.wardKey,
            newConnectionKey: dataSource?.id,
            subDivisionKey: dataSource?.subDivisionKey,
            msedclCategoryKey: dataSource?.msedclCategoryKey,
            isApproved: null,
            isComplete: false,
            status: fetchData.status,
            activeFlag: fetchData?.activeFlag,
        };
        console.log("Save New COnnection ............ 14", _formData)
        const tempData = axios
            .post(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/save`, _formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            .then((res) => {
                if (res.status == 201) {
                    sweetAlert("Update!", `Bill ${fetchData?.id} Update & Reassign successfully !`, "success");
                    getAllBillData();
                    setDeleteButtonState(false);
                    router.push('/ElectricBillingPayment/transaction/billGenerationAndPayment/newBillEntry')
                }
            });
    };

    //generate Button

    // const handleGenerateButton = (formType) => {

    //    if( formType == "officialNotesheet" ){
    //     router.push(
    //         `/ElectricBillingPayment/transaction/billGenerationAndPayment/generatedDocuments/officialNotesheet`
    //     )
    //    }
    //    else if( formType == "formA" ){
    //     router.push(
    //         `/ElectricBillingPayment/transaction/billGenerationAndPayment/generatedDocuments/formA`
    //     )
    //    }
    //    else if( formType == "formB" ){
    //     router.push(
    //         `/ElectricBillingPayment/transaction/billGenerationAndPayment/generatedDocuments/formB`
    //     )
    //    }
    //    else if( formType == "billA" ){
    //     router.push(
    //         `/ElectricBillingPayment/transaction/billGenerationAndPayment/generatedDocuments/billA`
    //     )
    //    } else if( formType == "billB" ){
    //     router.push(
    //         `/ElectricBillingPayment/transaction/billGenerationAndPayment/generatedDocuments/billB`
    //     )
    //    }
    // }

    // Exit Button
    const handleExitButton = () => {
        reset({
            ...resetValuesForClear,
            id: null
        });
        setButtonInputState(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
        router.push(
            `/ElectricBillingPayment/transaction/billGenerationAndPayment/newBillEntry`
        )
    };

    // cancell Button
    const handleClearButton = () => {
        reset({
            ...resetValuesForClear,
            id: id ? id : null,
        });
    };

    // Reset Values Cancell
    const resetValuesForClear = {
        consumerName: "",
        consumerAddress: "",
        pinCode: "",
        zoneKey: "",
        wardKey: "",
        departmentKey: "",
        consumptionTypeKey: "",
        loadTypeKey: "",
        phaseKey: "",
        slabTypeKey: "",
        usageTypeKey: "",
        msedclCategoryKey: "",
        billingUnitKey: "",
        subDivisionKey: "",
        departmentCategoryKey: "",
        transactionDocumentsList: [
            {
                documentPath: "",
                mediaKey: "",
                mediaType: "",
                remark: ""
            }
        ]
    };

    const columns = [
        //Sr No
        { field: "srNo", width: 50, headerName: <FormattedLabel id="srNo" />, flex: 1 },

        // consumerNo
        {
            field: language === "en" ? "consumerNo" : "consumerNoMr",
            // headerName: <FormattedLabel id="consumerName" />,
            headerName: <label>Consumer Number</label>,
            flex: 1,
        },

        // consumerName
        {
            field: language === "en" ? "consumerName" : "consumerNameMr",
            // headerName: <FormattedLabel id="consumerName" />,
            headerName: <label>Consumer Name</label>,
            flex: 1,
        },

        // consumerAddress
        {
            field: language === "en" ? "consumerAddress" : "consumerAddressMr",
            // headerName: <FormattedLabel id="consumerAddress" />,
            headerName: <label>Consumer Address</label>,
            flex: 1,
        },

        // meterNo
        {
            field: language === "en" ? "meterNo" : "=meterNoMr",
            // headerName: <FormattedLabel id="MeterNumber" />,
            headerName: <label>Meter Number</label>,
            flex: 1,
        },

        {
            field: "actions",
            headerName: <FormattedLabel id="actions" />,
            width: 130,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton
                            onClick={() => { handleSelectConnection(params.row.id) }}
                        >
                            <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
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

            <FormProvider>
                <form>
                    {/* Firts Row */}

                    {/* search conneaction entry by consumer number */}

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
                            Search Entry Connection
                            {/* <FormattedLabel id="demandGenerationDetials" /> */}
                        </h2>
                    </Box>

                    <Grid container sx={{ padding: "10px" }}>

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
                                <TextField
                                    disabled={router?.query?.pageMode === "View"}
                                    id="standard-textarea"
                                    label="Consumer Number"
                                    sx={{ m: 1, minWidth: '75%' }}
                                    variant="standard"
                                    value={consumerNo}
                                    onChange={(e) => { setConsumerNo(e.target.value) }}
                                    error={!!errors.consumerNo}
                                    helperText={
                                        errors?.consumerNo ? errors.consumerNo.message : null
                                    }
                                />
                            </Grid>
                            <Grid item xl={2}
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}>
                                <Button variant="contained" onClick={handleSearchConnections}>
                                    Search
                                    {/* {<FormattedLabel id="saveAsDraft" />} */}
                                </Button>
                            </Grid>
                        </Grid>

                    </Grid>

                    {/* Modal to select Entry Connections */}

                    <div>
                        <Modal
                            open={openEntryConnections}
                            onClose={handleCloseEntryConnections}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
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
                                    rowCount={searchedConnections.totalRows}
                                    rowsPerPageOptions={searchedConnections.rowsPerPageOptions}
                                    page={searchedConnections.page}
                                    pageSize={searchedConnections.pageSize}
                                    rows={searchedConnections.rows}
                                    columns={columns}
                                    onPageChange={(_data) => {
                                        handleSearchConnections(searchedConnections.pageSize, _data);
                                    }}
                                    onPageSizeChange={(_data) => {
                                        console.log("222", _data);
                                        // updateData("page", 1);
                                        handleSearchConnections(_data, searchedConnections.page);
                                    }}
                                />
                            </Box>
                        </Modal>
                    </div>

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
                            Consumer Details
                            {/* <FormattedLabel id="demandGenerationDetials" /> */}
                        </h2>
                    </Box>

                    <Grid container sx={{ padding: "10px" }}>

                        {/* Zone */}

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
                            <TextField
                                id="standard-textarea"
                                label="Zone"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={zone}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Ward Name */}

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
                            <TextField
                                id="standard-textarea"
                                label="Ward"
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

                        {/* Department Name */}

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

                        {/* Second Row */}

                        {/* Consumer Name */}

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
                            <TextField
                                id="standard-textarea"
                                label="Consumer Name"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={consumerName}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/*Consumer Address */}

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
                            <TextField
                                id="standard-textarea"
                                label="Consumer Address"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={consumerAddress}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Pin Code */}

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
                            <TextField
                                id="standard-textarea"
                                label="Pincode"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={pincode}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Consumption Type */}

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
                            <TextField
                                id="standard-textarea"
                                label="Consumption Type"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={consumptionType}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Load Type */}

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
                            <TextField
                                id="standard-textarea"
                                label="Load Type"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={loadType}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Phase Type */}

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
                            <TextField
                                id="standard-textarea"
                                label="Phase Type"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={phaseType}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Slab Type */}

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
                            <TextField
                                id="standard-textarea"
                                label="Slab Type"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={slabType}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Usage Type */}

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
                            <TextField
                                id="standard-textarea"
                                label="Usage Type"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={usageType}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* MSEDCL Category */}

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
                            <TextField
                                id="standard-textarea"
                                label="MSEDCL Category"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={msedclCategory}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Billing Division/Unit */}

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
                            <TextField
                                id="standard-textarea"
                                label="Billing Division/Unit"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={billingDivisionAndUnit}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* SubDivision */}

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
                            <TextField
                                id="standard-textarea"
                                label="SubDivision"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={subDivision}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Department Category */}

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
                            <TextField
                                id="standard-textarea"
                                label="Department Category"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={departmentCategory}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>



                        {/* Meter Connection Date */}

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
                            <TextField
                                id="standard-textarea"
                                label="Meter Connection Date"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={showDateFormat(dataSource?.meterConnectionDate)}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Sanctioned Demand */}

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
                            <TextField
                                id="standard-textarea"
                                label="Sanctioned Demand"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={sanctionedDemand}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Contract Demand */}

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
                            <TextField
                                id="standard-textarea"
                                label="Contract Demand"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={contractDemand}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Second Row */}

                        {/* Geo Code/Gis Id */}

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
                            <TextField
                                id="standard-textarea"
                                label="Geo Code/Gis Id"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={geoCodeGisId}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Billing Cycle */}

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
                            <TextField
                                id="standard-textarea"
                                label="Billing Cycle"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={billingCycle}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Latitude */}

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
                            <TextField
                                id="standard-textarea"
                                label="Latitude"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={latitude}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Longitude */}

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
                            <TextField
                                id="standard-textarea"
                                label="Longitude"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="outlined"
                                value={longitude}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                    </Grid>

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
                            <FormattedLabel id="meterReadingAndBillGeneration" />
                        </h2>
                    </Box>

                    <Grid container sx={{ padding: "10px" }}>

                        {/* Second Row */}

                        {/*Previous Reading Date */}

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
                                variant="standard"
                                sx={{ m: 1, minWidth: '50%' }}
                                error={!!errors.previousReadingDate}
                            >
                                <Controller
                                    // variant="standard"
                                    control={control}
                                    name="prevReadingDate"
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                                variant="standard"
                                                inputFormat="YYYY/MM/DD"
                                                label={
                                                    <span style={{ fontSize: 16 }}>
                                                        {<FormattedLabel id="prevReadingDate" />}
                                                    </span>
                                                }
                                                value={previousReadingDate}
                                                onChange={(date) =>
                                                    setPreviousReadingDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                                                }
                                                selected={field.value}
                                                center
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        variant="standard"
                                                        sx={{ width: 230 }}
                                                        InputLabelProps={{
                                                            style: {
                                                                fontSize: 12,
                                                                marginTop: 3,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                <FormHelperText>
                                    {errors?.previousReadingDate ? errors.previousReadingDate.message : null}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        {/*Previous Reading */}

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
                            <TextField
                                disabled={router?.query?.pageMode === "View"}
                                id="standard-textarea"
                                label={
                                    <span style={{ fontSize: 16 }}>
                                        {<FormattedLabel id="prevReading" />}
                                    </span>
                                }
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="standard"
                                value={previousReading}
                                onChange={(e) => { setPreviousReading(e.target.value) }}
                                error={!!errors.prevReading}
                                helperText={
                                    errors?.prevReading ? errors.prevReading.message : null
                                }
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/*current Reading Date */}

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
                                variant="standard"
                                sx={{ m: 1, minWidth: '50%' }}
                                error={!!errors.currentReadingDate}
                            >
                                <Controller
                                    // variant="standard"
                                    control={control}
                                    name="currReadingDate"
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                                variant="standard"
                                                inputFormat="YYYY/MM/DD"
                                                label={
                                                    <span style={{ fontSize: 16 }}>
                                                        {<FormattedLabel id="currReadingDate" />}
                                                    </span>
                                                }
                                                value={currentReadingDate}
                                                onChange={(date) =>
                                                    setCurrentReadingDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                                                }
                                                selected={field.value}
                                                center
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        variant="standard"
                                                        sx={{ width: 230 }}
                                                        InputLabelProps={{
                                                            style: {
                                                                fontSize: 12,
                                                                marginTop: 3,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                <FormHelperText>
                                    {errors?.currentReadingDate ? errors.currentReadingDate.message : null}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        {/*current Reading */}

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
                            <TextField
                                disabled={router?.query?.pageMode === "View"}
                                id="standard-textarea"
                                label={
                                    <span style={{ fontSize: 16 }}>
                                        {<FormattedLabel id="currReading" />}
                                    </span>
                                }
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="standard"
                                value={currentReading}
                                onChange={(e) => { setCurrentReading(e.target.value) }}
                                error={!!errors.currReading}
                                helperText={
                                    errors?.currReading ? errors.currReading.message : null
                                }
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                        </Grid>

                        {/* Consumed Unit */}

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
                            <TextField
                                id="standard-textarea"
                                label="Consumed Unit"
                                sx={{ m: 1, minWidth: '50%' }}
                                variant="standard"
                                value={previousReading - currentReading ? Math.abs(previousReading - currentReading) : ""}
                            />
                        </Grid>

                        {/* To Be Paid Amount */}

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
                            <TextField
                                disabled={router?.query?.pageMode === "View"}
                                id="standard-textarea"
                                label="To Be Paid Amount"
                                sx={{ m: 1, minWidth: '50%' }}
                                multiline
                                variant="standard"
                                value={toBePaidAmount}
                                onChange={(e) => { setToBePaidAmount(e.target.value) }}
                                error={!!errors.toBePaidAmount}
                                helperText={
                                    errors?.toBePaidAmount ? errors.toBePaidAmount.message : null
                                }
                            />
                        </Grid>

                        {/*Bill Due Date */}

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
                                variant="standard"
                                sx={{ m: 1, minWidth: '50%' }}
                                error={!!errors.billDueDate}
                            >
                                <Controller
                                    // variant="standard"
                                    control={control}
                                    name="billDueDate"
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                                variant="standard"
                                                inputFormat="YYYY/MM/DD"
                                                label={
                                                    <span style={{ fontSize: 16 }}>
                                                        Bill Due Date
                                                        {/* Opinion Request Date */}
                                                        {/* {<FormattedLabel id="opinionRequestDate" />} */}
                                                    </span>
                                                }
                                                value={billDueDate}
                                                onChange={(date) =>
                                                    setBillDueDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                                                }
                                                selected={field.value}
                                                center
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        variant="standard"
                                                        sx={{ width: 230 }}
                                                        InputLabelProps={{
                                                            style: {
                                                                fontSize: 12,
                                                                marginTop: 3,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                <FormHelperText>
                                    {errors?.billDueDate ? errors.billDueDate.message : null}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* Meter Status */}

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
                                sx={{ m: 1, minWidth: '50%' }}
                                error={!!errors.meterStatusKey}
                            >
                                <InputLabel id="demo-simple-select-standard-label">
                                    {<FormattedLabel id="meterStatus" />}
                                </InputLabel>
                                <Controller
                                    render={({ field }) => (
                                        <Select
                                            disabled={router?.query?.pageMode === "View"}
                                            value={meterStatusKey}
                                            onChange={(e) => setMeterStatusKey(e.target.value)}
                                        // label={<FormattedLabel id="meterStatus" />}
                                        // InputLabelProps={{
                                        //   //true
                                        //   shrink:
                                        //     (watch("officeLocation") ? true : false) ||
                                        //     (router.query.officeLocation ? true : false),
                                        // }}
                                        >
                                            {meterStatus &&
                                                meterStatus.map((type, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={type.id}
                                                    >
                                                        {type.meterStatus}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    )}
                                    name="meterStatusKey"
                                    control={control}
                                    defaultValue=""
                                />
                                <FormHelperText>
                                    {errors?.meterStatusKey
                                        ? errors.meterStatusKey.message
                                        : null}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* Arrears */}

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
                            <TextField
                                disabled={router?.query?.pageMode === "View"}
                                id="standard-textarea"
                                label="Arrears"
                                sx={{ m: 1, minWidth: '50%' }}
                                multiline
                                variant="standard"
                                value={arrears}
                                onChange={(e) => { setArrears(e.target.value) }}
                                error={!!errors.arrears}
                                helperText={
                                    errors?.arrears ? errors.arrears.message : null
                                }
                            />
                        </Grid>

                        {/* Generate forms */}
                        <Grid container rowSpacing={2} columnSpacing={1} sx={{ paddingLeft: "100px", paddingTop: "10px" }}>
                            {/* Official Notesheet */}
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
                                    <label >Official Notesheet</label>
                                </Grid>
                                <Grid item xl={2}
                                    lg={2}
                                    md={2}
                                    sm={2}
                                    xs={2}>
                                    {
                                        fetchData?.officialNotesheet ?
                                            <Button variant="contained">
                                                View
                                            </Button>
                                            : <Button variant="contained" onClick={() => { setChoice("officialNotesheet"), generateOfficialNotesheet() }}>
                                                Generate
                                            </Button>
                                    }
                                </Grid>
                            </Grid>

                            {/* Bill Approval Letter - Part A */}
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
                                    <label >Bill Approval Letter - Part A</label>
                                </Grid>
                                <Grid item xl={2}
                                    lg={2}
                                    md={2}
                                    sm={2}
                                    xs={2}>
                                    {
                                        fetchData?.billApprovalLetterA ?
                                            <Button variant="contained">
                                                View
                                            </Button>
                                            : <Button variant="contained" onClick={() => { setChoice("billA"), generateBillA() }}>
                                                Generate
                                            </Button>
                                    }
                                </Grid>
                            </Grid>

                            {/* Bill Approval Letter - Part B */}
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
                                    <label >Bill Approval Letter - Part B</label>
                                </Grid>
                                <Grid item xl={2}
                                    lg={2}
                                    md={2}
                                    sm={2}
                                    xs={2}>
                                    {
                                        fetchData?.billApprovalLetterB ?
                                            <Button variant="contained">
                                                View
                                            </Button>
                                            : <Button variant="contained" onClick={() => { setChoice("billB"), generateBillB() }}>
                                                Generate
                                            </Button>
                                    }
                                </Grid>
                            </Grid>

                            {/*  Form No. 22 – A */}
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
                                    <label > Form No. 22 – A</label>
                                </Grid>
                                <Grid item xl={2}
                                    lg={2}
                                    md={2}
                                    sm={2}
                                    xs={2}>
                                    {
                                        fetchData?.formNo22A ?
                                            <Button variant="contained">
                                                View
                                            </Button>
                                            : <Button variant="contained" onClick={() => { setChoice("formA"), generateFormA() }}>
                                                Generate
                                            </Button>
                                    }
                                </Grid>
                            </Grid>

                            {/* Form No. 22 – B */}
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
                                    <label > Form No. 22 – B</label>
                                </Grid>
                                <Grid item xl={2}
                                    lg={2}
                                    md={2}
                                    sm={2}
                                    xs={2}>
                                    {
                                        fetchData?.formNo22B ?
                                            <Button variant="contained">
                                                View
                                            </Button>
                                            : <Button variant="contained" onClick={() => { setChoice("formB"), generateFormB() }}>
                                                Generate
                                            </Button>
                                    }
                                </Grid>
                            </Grid>

                        </Grid>

                        {/* View Form-22 Letter */}

                        <div>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    {/* <center>
                      <div>
                        <Document file={samplePdf} onLoadSuccess={onDocumentLoadSuccess} />
                        {Array.from(
                          new Array(numPages),
                          (el, next) => (
                            <Page key={`Page_${index + 1}`} pageNumber={index + 1} />
                          )
                        )}

                      </div>
                    </center> */}

                                    <Grid container rowSpacing={5}>

                                        <Grid item xl={12}
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                            <h3>FORM-22 Letter Generated</h3>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Modal>
                        </div>

                        {/* Button Row */}

                        <Grid container mt={5} border px={5}>
                            {/* Save ad Draft */}
                            <Grid container mt={5}>

                                <Grid item xl={4}
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
                                    <Button variant="contained" onClick={onSubmitForm}>
                                        Update & Reassign
                                        {/* {<FormattedLabel id="saveAsDraft" />} */}
                                    </Button>
                                </Grid>




                                <Grid item xl={4}
                                    lg={4}
                                    md={6}
                                    sm={6}
                                    xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                    <Button
                                        onClick={handleClearButton}
                                        variant="contained"
                                    >
                                        Clear
                                        {/* {<FormattedLabel id="submit" />} */}
                                    </Button>
                                </Grid>

                                <Grid item xl={4}
                                    lg={4}
                                    md={6}
                                    sm={6}
                                    xs={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleExitButton}
                                    >
                                        Exit
                                        {/* {<FormattedLabel id="cancel" />} */}
                                    </Button>
                                </Grid>

                            </Grid>
                        </Grid>

                    </Grid>

                </form>
            </FormProvider>

        </Paper>
    );
};

export default Index;
