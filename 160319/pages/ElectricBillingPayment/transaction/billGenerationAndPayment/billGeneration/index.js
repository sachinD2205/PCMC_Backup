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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CheckIcon from "@mui/icons-material/Check";
import OfficialNotesheet from "../generatedDocuments/officialNotesheet";
import FormA from "../generatedDocuments/formA";
import FormB from "../generatedDocuments/formB";
import BillA from "../generatedDocuments/billA";
import BillB from "../generatedDocuments/billB";

// import samplePdf from "../../../../../public/certificate.pdf"
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { setNewEntryConnection } from "../../../../../features/userSlice";
import IconButton from "@mui/material/IconButton";
import UploadButton from "../../../../../components/ElectricBillingComponent/uploadDocument/uploadButton";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    height: "75%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
  };

  const router = useRouter();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState({});
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [generateDemandLetterFlag, setGenerateDemandLetterFlag] = useState(true);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [ward, setWard] = useState("");
  const [department, setDepartment] = useState("");
  const [zone, setZone] = useState("");
  const [consumerName, setConsumerName] = useState("");
  const [consumerAddress, setConsumerAddress] = useState("");
  const [pincode, setPincode] = useState("");
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
  const [previousReading, setPreviousReading] = useState();
  const [currentReading, setCurrentReading] = useState();
  const [buttonInputState, setButtonInputState] = useState();
  const [choice, setChoice] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openViewForm, setOpenViewForm] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenViewForm = () => setOpenViewForm(true);
  const handleCloseViewForm = () => setOpenViewForm(false);
  const [openEntryConnections, setOpenEntryConnections] = React.useState(false);
  const handleOpenEntryConnections = () => setOpenEntryConnections(true);
  const handleCloseEntryConnections = () => setOpenEntryConnections(false);
  const dispatch = useDispatch();
  const [officialNotesheet, setOfficialNotesheet] = useState("");
  const [formA, setFormA] = useState("");
  const [formB, setFormB] = useState("");
  const [billA, setBillA] = useState("");
  const [billB, setBillB] = useState("");
  const [officialNotesheetFlag, setOfficialNotesheetFlag] = useState(false);
  const [formAFlag, setFormAFlag] = useState(false);
  const [formBFlag, setFormBFlag] = useState(false);
  const [billAFlag, setBillAFlag] = useState(false);
  const [billBFlag, setBillBFlag] = useState(false);
  const [searchedConnections, setSearchedConnections] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const billData = {
    prevReadingDate:watch('prevReadingDate'),
    prevReading:watch('prevReading'),
    currReadingDate:watch('currReadingDate'),
    currReading:watch('currReading'),
    consumedUnit:Math.abs(watch('currReading') - watch('prevReading')),
    toBePaidAmount:watch('toBePaidAmount'),
    billDueDate:watch('billDueDate'),
    meterStatusKey:watch('meterStatusKey'),
    arrears:watch('arrears'),
  }

  console.log("generated documents", officialNotesheet, billA, billB, formA, formB)
  console.log("billData",billData)

  //generate Button

  const componentRef1 = useRef();
  const handleGenerateButton1 = useReactToPrint({
    content: () => componentRef1.current,
  });

  const componentRef2 = useRef();
  const handleGenerateButton2 = useReactToPrint({
    content: () => componentRef2.current,
  });

  const componentRef3 = useRef();
  const handleGenerateButton3 = useReactToPrint({
    content: () => componentRef3.current,
  });

  const componentRef4 = useRef();
  const handleGenerateButton4 = useReactToPrint({
    content: () => componentRef4.current,
  });

  const componentRef5 = useRef();
  const handleGenerateButton5 = useReactToPrint({
    content: () => componentRef5.current,
  });

  const generateOfficialNotesheet = () => {
    // setOfficialNotesheetFlag(true);
    handleGenerateButton1();
  };

  const generateBillA = () => {
    // setBillAFlag(true);
    // handleGenerateButton2();
    handleOpen();
  };

  const generateBillB = () => {
    // setBillBFlag(true);
    // handleGenerateButton3();
    handleOpen();
  };

  const generateFormA = () => {
    // setFormAFlag(true);
    // handleGenerateButton4();
    handleOpen();
  };

  const generateFormB = () => {
    // setFormBFlag(true);
    // handleGenerateButton5();
    handleOpen();
  };

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

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
    getMeterStatus();
  }, [dataSource]);

  // handle search connections
  const handleSearchConnections = () => {
    handleOpenEntryConnections();
    console.log("consumerNo", consumerNo);
    axios
      .get(`${urls.EBPSURL}/trnNewConnectionEntry/search/consumerNo?consumerNo=${consumerNo}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.trnNewConnectionEntryList;
        console.log("result", result);

        if (subDivision) {
          let _res = result.map((r, i) => {
            console.log("r", r);
            return {
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1,
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
  };

  const handleSelectConnection = (id) => {
    console.log("selected id", id);
    getNewConnectionsData(id);
  };

  function showDateFormat(date) {
    let formattedDate = date?.split("T");
    return formattedDate ? formattedDate[0] : "-";
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
        return each.id === dataSource?.wardKey;
      });
      setWard(_res?.wardName ? _res?.wardName : "-");
    });
  };

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      let temp = res.data.department;
      let _res = temp.find((obj) => obj.id === dataSource?.departmentKey);
      setDepartment(_res?.department ? _res?.department : "-");
    });
  };

  // get Zone Name
  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      let temp = res.data.zone;
      let _res = temp.find((obj) => obj.id === dataSource?.zoneKey);
      setZone(_res?.zoneName ? _res?.zoneName : "-");
    });
  };

  const getConsumerDetails = () => {
    setConsumerName(dataSource?.consumerName ? dataSource?.consumerName : "-");
    setConsumerAddress(dataSource?.consumerAddress ? dataSource?.consumerAddress : "-");
    setPincode(dataSource?.pinCode ? dataSource?.pinCode : "-");
    showDateFormat(dataSource?.meterConnectionDate);
    setSanctionedDemand(dataSource?.sanctionedDemand ? dataSource?.sanctionedDemand : "-");
    setContractDemand(dataSource?.contractDemand ? dataSource?.contractDemand : "-");
    setGeoCodeGisId(dataSource?.geoCodeGisId ? dataSource?.geoCodeGisId : "-");
    setLatitude(dataSource?.latitude ? dataSource?.latitude : "-");
    setLongitude(dataSource?.longitude ? dataSource?.longitude : "-");
  };

  // get Consumption Type
  const getConsumptionType = () => {
    axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
      let temp = res.data.mstConsumptionTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.consumptionTypeKey);
      setConsumptionType(_res?.consumptionType ? _res?.consumptionType : "-");
    });
  };

  // get Billing Cycle
  const getBillingCycle = () => {
    axios.get(`${urls.EBPSURL}/mstBillingCycle/getAll`).then((res) => {
      let temp = res.data.mstBillingCycleList;
      let _res = temp.find((obj) => obj.id === dataSource?.billingCycleKey);
      setBillingCycle(_res?.billingCycle ? _res?.billingCycle : "-");
    });
  };

  // get Load Type
  const getLoadType = () => {
    axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
      let temp = res.data.mstLoadTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.loadTypeKey);
      setLoadType(_res?.loadType ? _res?.loadType : "-");
    });
  };

  // get Phase Type
  const getPhaseType = () => {
    axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
      let temp = res.data.mstPhaseTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.phaseKey);
      setPhaseType(_res?.phaseType ? _res?.phaseType : "-");
    });
  };

  // get Slab Type
  const getSlabType = () => {
    axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
      let temp = res.data.mstSlabTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.slabTypeKey);
      setSlabType(_res?.slabType ? _res?.slabType : "-");
    });
  };

  // get Usage Type
  const getUsageType = () => {
    axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
      let temp = res.data.mstEbUsageTypeList;
      let _res = temp.find((obj) => obj.id === dataSource?.usageTypeKey);
      setUsageType(_res?.usageType ? _res?.usageType : "-");
    });
  };

  // get Msedcl Category
  const getMsedclCategory = () => {
    axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
      let temp = res.data.mstMsedclCategoryList;
      let _res = temp.find((obj) => obj.id === dataSource?.msedclCategoryKey);
      setMsedclCategory(_res?.msedclCategory ? _res?.msedclCategory : "-");
    });
  };

  // get Billing Division And Unit
  const getBillingDivisionAndUnit = () => {
    axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
      let temp = res.data.mstBillingUnitList;
      let _res = temp.find((obj) => obj.id === dataSource?.billingUnitKey);
      setBillingDivisionAndUnit(
        `${_res?.divisionName ? _res?.divisionName : "-"}/${_res?.billingUnit ? _res?.billingUnit : "-"}`,
      );
    });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
      let temp = res.data.mstSubDivisionList;
      let _res = temp.find((obj) => obj.id === dataSource?.subDivisionKey);
      setSubDivision(_res?.subDivision ? _res?.subDivision : "-");
    });
  };

  // get Department Category
  const getDepartmentCategory = () => {
    axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
      let temp = res.data.mstDepartmentCategoryList;
      let _res = temp.find((obj) => obj.id === dataSource?.departmentCategoryKey);
      setDepartmentCategory(_res?.departmentCategory ? _res?.departmentCategory : "-");
    });
  };

  // Get Table - Data
  const getNewConnectionsData = (connectionId) => {
    axios
      .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.trnNewConnectionEntryList;
        let _res = result.find((obj) => obj.id == connectionId);
        setDataSource(_res);
        handleCloseEntryConnections();
      });
  };

  const onSubmitForm = (formData) => {
    let _formData = {
      ...formData,
      consumedUnit: Math.abs(watch('currReading') - watch('prevReading')),
      consumerNo,
      applicationNo: dataSource?.applicationNo,
      wardKey: dataSource?.wardKey,
      newConnectionKey: dataSource?.id,
      subDivisionKey: dataSource?.subDivisionKey,
      msedclCategoryKey: dataSource?.msedclCategoryKey,
      isComplete:false,
      isApproved:null,
      "billPaymentOption": 4,
      "paymentOption": "BhimUPI",
      "billedAmount": 726,
      "divisionKey": 2,
      "amountToBePaid": "239",
      "snNo": "2",
      "remarks": "paid 200",
      "officialNoteSheet": "testing purpose",
      "billApprovalLetter": "test",
      "formNo22": "filled",
    };
    console.log("save button ...........", formData)
    const tempData = axios
      .post(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/save`, _formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          sweetAlert("Generated!", "Bill Generated Successfully !", "success");
          getNewConnectionsData();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          router.push("/ElectricBillingPayment/transaction/billGenerationAndPayment/newBillEntry");
        }
      });
  };

  console.log("dataSource@@", dataSource);

  // Exit Button
  const handleExitButton = () => {
    reset({
      ...resetValuesForClear,
      id: null,
    });
    setButtonInputState(false);
    6;
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    router.push(`/ElectricBillingPayment/transaction/billGenerationAndPayment/newBillEntry`);
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
        remark: "",
      },
    ],
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
              onClick={() => {
                handleSelectConnection(params.row.id);
              }}
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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
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
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
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
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <TextField
                  disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  label="Consumer Number"
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  value={consumerNo}
                  onChange={(e) => {
                    setConsumerNo(e.target.value);
                  }}
                  error={!!errors.consumerNo}
                  helperText={errors?.consumerNo ? errors.consumerNo.message : null}
                />
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
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
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
                sx={{ m: 1, minWidth: "50%" }}
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
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              Meter Reading & Bill Generation
              {/* <FormattedLabel id="demandGenerationDetials" /> */}
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
              {/* previous reading date in English */}
              <FormControl error={!!errors.prevReadingDate}>
                <Controller
                  control={control}
                  name="prevReadingDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/yyyy"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="prevReadingDate" />
                          </span>
                        }
                        value={field.value}
                        onChange={(date) => {
                          // field.onChange(date)
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                          setPreviousReadingDate(moment(date).format("YYYY-MM-DD"));
                        }}
                        // selected={field.value}
                        // center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            size="small"
                            error={!!errors.prevReadingDate}
                            helperText={errors?.prevReadingDate ? errors?.prevReadingDate.message : null}
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
                label="Previous Reading"
                sx={{ m: 1, minWidth: "50%" }}
                multiline
                variant="standard"
                {...register("prevReading")}
                error={!!errors.prevReading}
                helperText={errors?.prevReading ? errors.prevReading.message : null}
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
              {/* Current reading date in English */}
              <FormControl error={!!errors.currReadingDate}>
                <Controller
                  control={control}
                  name="currReadingDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/yyyy"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="currReadingDate" />
                          </span>
                        }
                        disablePast
                        minDate={previousReadingDate}
                        value={field.value}
                        onChange={(date) => {
                          // field.onChange(date)
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                          setCurrentReadingDate(moment(date).format("YYYY-MM-DD"));
                        }}
                        // selected={field.value}
                        // center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            size="small"
                            error={!!errors.currReadingDate}
                            helperText={
                              errors.currReadingDate
                                ?errors.currReadingDate?.message
                                : null
                            }
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
                label="Current Reading"
                sx={{ m: 1, minWidth: "50%" }}
                multiline
                variant="standard"
                {...register("currReading")}
                error={!!errors.currReading}
                helperText={errors?.currReading ? errors.currReading.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                value={watch('prevReading') - watch('currReading') ? Math.abs(watch('prevReading') - watch('currReading')) : ""}
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
                sx={{ m: 1, minWidth: "50%" }}
                multiline
                variant="standard"
                {...register("toBePaidAmount")}
                error={!!errors.toBePaidAmount}
                helperText={errors?.toBePaidAmount ? errors.toBePaidAmount.message : null}
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
              {/* Current reading date in English */}
              <FormControl error={!!errors.billDueDate}>
                <Controller
                  control={control}
                  name="billDueDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="billDueDate" />
                          </span>
                        }
                        disablePast
                        minDate={currentReadingDate}
                        value={field.value}
                        onChange={(date) => {
                          // field.onChange(date)
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        // selected={field.value}
                        // center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            size="small"
                            error={!!errors.billDueDate}
                            helperText={errors?.billDueDate ? errors?.billDueDate.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.meterStatusKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {/* {<FormattedLabel id="locationName" />} */}
                  Meter Status
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      // sx={{ width: 200 }}
                      value={field.value}
                      // onChange={(value) => field.onChange(value)}

                      {...register("meterStatusKey")}
                      label={<FormattedLabel id="meterStatus" />}
                    >
                      {meterStatus &&
                        meterStatus.map((type, index) => (
                          <MenuItem key={index} value={type.id}>
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
                  {errors?.meterStatusKey ? errors.meterStatusKey.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                multiline
                variant="standard"
                {...register("arrears")}
                error={!!errors.arrears}
                helperText={errors?.arrears ? errors.arrears.message : null}
              />
            </Grid>

            {/* Generate forms */}

            <Grid
              container
              rowSpacing={2}
              columnSpacing={1}
              sx={{ paddingLeft: "100px", paddingTop: "40px" }}
            >
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
                }}
              >
                <Grid item xl={8} lg={8} md={8} sm={8} xs={8}>
                  <label>Official Notesheet</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    disabled={officialNotesheetFlag}
                    onClick={() => {
                      setChoice("officialNotesheet"), generateOfficialNotesheet();
                    }}
                  >
                    Generate
                  </Button>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setOfficialNotesheet}
                    fileName={officialNotesheet}
                  />
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
                }}
              >
                <Grid item xl={8} lg={8} md={8} sm={8} xs={8}>
                  <label>Bill Approval Letter - Part A</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    disabled={billAFlag}
                    onClick={() => {
                      setChoice("billA"), generateBillA();
                    }}
                  >
                    Generate
                  </Button>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setBillA}
                    fileName={billA}
                  />
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
                }}
              >
                <Grid item xl={8} lg={8} md={8} sm={8} xs={8}>
                  <label>Bill Approval Letter - Part B</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    disabled={billBFlag}
                    onClick={() => {
                      setChoice("billB"), generateBillB();
                    }}
                  >
                    Generate
                  </Button>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setBillB}
                    fileName={billB}
                  />
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
                }}
              >
                <Grid item xl={8} lg={8} md={8} sm={8} xs={8}>
                  <label> Form No. 22 – A</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    disabled={formAFlag}
                    onClick={() => {
                      setChoice("formA"), generateFormA();
                    }}
                  >
                    Generate
                  </Button>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setFormA}
                    fileName={formA}
                  />
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
                }}
              >
                <Grid item xl={8} lg={8} md={8} sm={8} xs={8}>
                  <label> Form No. 22 – B</label>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Button
                    variant="contained"
                    disabled={formBFlag}
                    onClick={() => {
                      setChoice("formB"), generateFormB();
                    }}
                  >
                    Generate
                  </Button>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={setFormB}
                    fileName={formB}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Generate Form-22 Letter */}

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
                      }}
                    >
                      <h3>FORM-22 Letter Generated</h3>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>
            </div>

            {/* view Form-22 Letter */}

            <div>
              <Modal
                open={openViewForm}
                onClose={handleCloseViewForm}
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
                      }}
                    >
                      <h3>View FORM-22 Letter</h3>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>
            </div>

            {/* Button Row */}

            <Grid container mt={5} border px={5}>
              {/* Save ad Draft */}
              <Grid container mt={5}>
                {btnSaveText === "Update" ? (
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
                    <Button type="Submit" variant="contained">
                      Update
                      {/* {<FormattedLabel id="update" />} */}
                    </Button>
                  </Grid>
                ) : (
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
                    <Button
                      variant="contained"
                      type="submit"
                      // disabled={
                      //   officialNotesheetFlag && billAFlag && billBFlag && formAFlag && formBFlag
                      //     ? false
                      //     : true
                      // }
                    >
                      Send to Dy. Engineer for Approval
                      {/* {<FormattedLabel id="saveAsDraft" />} */}
                    </Button>
                  </Grid>
                )}

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
                  <Button onClick={handleClearButton} variant="contained">
                    Clear
                    {/* {<FormattedLabel id="submit" />} */}
                  </Button>
                </Grid>

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
                  <Button variant="contained" onClick={handleExitButton}>
                    Exit
                    {/* {<FormattedLabel id="cancel" />} */}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Generate and Access Documents */}
          <Grid Container sx={{ display: "none" }}>
            {dataSource && choice === "officialNotesheet" && (
              <OfficialNotesheet connectionData={dataSource} billData={billData} componentRef={componentRef1} />
            )}
            {dataSource && choice === "billA" && (
              <BillA connectionData={dataSource} componentRef={componentRef2} />
            )}
            {dataSource && choice === "billB" && (
              <BillB connectionData={dataSource} componentRef={componentRef3} />
            )}
            {dataSource && choice === "formA" && (
              <FormA connectionData={dataSource} componentRef={componentRef4} />
            )}
            {dataSource && choice === "formB" && (
              <FormB connectionData={dataSource} componentRef={componentRef5} />
            )}
          </Grid>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;
