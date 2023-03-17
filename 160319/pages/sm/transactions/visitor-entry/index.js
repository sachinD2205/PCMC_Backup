import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { default as React, useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert";
import ComponentToPrint from "../../../../components/security/ComponentToPrint";
import styles from "../../../../components/security/ComponentToPrint.module.css";
import { priorityList } from "../../../../components/security/contsants";
import UploadButtonThumbOP from "../../../../components/security/DocumentsUploadThumbOP";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/securityManagementSystemSchema/transactions/VisitorEntry";
import urls from "../../../../URLS/urls";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function VisitorEntry() {
  const [priority, setPriority] = useState(priorityList[0].value);
  const router = useRouter();
  let appName = "SM";
  let serviceName = "SM-VE";
  // let pageMode = router?.query?.pageMode;
  let pageMode = "VISITOR ENTRY";

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   getValues,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  //   defaultValues: {
  //     visitorPhoto: null,
  //   },
  // });

  const theme = useTheme();

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      visitorPhoto: null,
      priority: "Emergency Visit",
    },
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const [isReady, setIsReady] = useState("none");

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   getValues,
  //   formState: { errors },
  // } = useFormContext();
  const language = useSelector((state) => state.labels.language);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [rowId, setRowId] = useState("");
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [printData, setPrintData] = useState();
  const [searchEmpData, setSearchEmpData] = useState([]);

  const [open, setOpen] = useState(false);
  const [paramsData, setParamsData] = useState(false);
  const [totalInOut, setTotalInOut] = useState();
  const [nextEntryNumber, setNextEntryNumber] = useState();

  useEffect(() => {
    getDepartment();
    // getNextEntryNumber();
    getZoneKeys();
    getBuildings();
    getWardKeys();
    getInOut();
  }, []);

  useEffect(() => {
    getDepartment();
    // getNextEntryNumber();
    getZoneKeys();
    getBuildings();
    getWardKeys();
    getInOut();
  }, [window.location.reload]);

  useEffect(() => {
    getAllVisitors();
  }, [wardKeys, zoneKeys, departments, buildings]);

  useEffect(() => {
    if (printData) {
      handlePrint();
    }
  }, [printData]);

  const getAllVisitors = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.SMURL}/trnVisitorEntryPass/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        getNextEntryNumber();
        console.log("visitor entry", r);
        let result = r.data.trnVisitorEntryPassList;
        let count = 0;
        let _res = result?.map((r, i) => {
          // "2023-03-04T03:00:00.000+00:00"
          console.log("r32", moment(r.inTime).format("LLLL"));

          return {
            ...r,
            inTime: r.inTime ? moment(r.inTime).format("DD-MM-YYYY hh:mm") : "Not Available",
            inTm: r.inTime,
            outTime: r.outTime ? moment(r.outTime).format("DD-MM-YYYY hh:mm") : "Not Available",
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            visitorStatus: r.visitorStatus === "I" ? "In" : "Out",
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            depeart: r?.departmentKeysList,
            departmentName: r?.departmentKeysList
              ? JSON.parse(r?.departmentKeysList)
                  ?.map((val) => {
                    return departments?.find((obj) => {
                      return obj?.id == val && obj;
                    })?.department;
                  })
                  ?.toString()
              : "-",
            wardKey: r.wardKey
              ? wardKeys?.find((obj) => {
                  return obj?.id == r.wardKey;
                })?.wardName
              : "-",
            zoneKey: r.zoneKey ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName : "-",
            zone: r?.zoneKey,
            ward: r?.wardKey,
          };
        });
        // setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  //buildings
  const [buildings, setBuildings] = useState([]);
  // get buildings
  const getBuildings = () => {
    axios.get(`${urls.SMURL}/mstBuildingMaster/getAll`).then((r) => {
      console.log("building master", r);
      let result = r.data.mstBuildingMasterList;
      setBuildings(result);
    });
  };

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);
  // get Zone Keys
  const getZoneKeys = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        })),
      );
    });
  };

  // Ward Keys
  const [wardKeys, setWardKeys] = useState([]);
  // get Ward Keys
  const getWardKeys = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        })),
      );
    });
  };

  const getInOut = () => {
    axios.get(`${urls.SMURL}/trnVisitorEntryPass/getTotalInOut`).then((r) => {
      console.log("all check in", r);
      setTotalInOut(r.data);
    });
  };

  const searchEmployeeDetails = async (mobileNum) => {
    await axios.get(`${urls.SMURL}/trnVisitorEntryPass/getByMobNo?mobileNo=${mobileNum}`).then((r) => {
      if (r.status == 200) {
        console.log("res emplo", r);

        r?.data?.trnVisitorEntryPassList?.length === 0 &&
          toast("Data Not Found !!!", {
            type: "error",
          }),
          setSearchEmpData(r?.data?.trnVisitorEntryPassList);
      }
    });
  };

  const getNextEntryNumber = () => {
    axios.get(`${urls.SMURL}/trnVisitorEntryPass/getNextEntryNumber`).then((r) => {
      console.log("Nex Entry Number", r);
      setNextEntryNumber(r.data);
    });
  };

  const onSubmitForm = (formData, btnType) => {
    console.log("formData", formData);

    // Save - DB
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      console.log("save");
      _body = {
        departmentKeys: formData?.departmentName,
        // departmentKey: Number(formData?.departmentKey),
        subDepartmentKey: 2,
        visitorPhoto: formData?.visitorPhoto,
        visitorName: formData?.visitorName,
        visitorNumber: formData?.visitorNumber,
        toWhomWantToMeet: formData?.toWhomWantToMeet,
        purpose: formData?.purpose,
        priority: formData?.priority,
        mobileNumber: formData?.mobileNumber,
        notoriousEntry: formData?.notoriousEntry ? "T" : "F",
        visitorStatus: formData?.visitorStatus,
        documentType: "Adhaar Card",
        departmentName: departments?.find((obj) => obj?.id === formData?.departmentKey)?.department,
        // inTime: formData?.inTime.toISOString(),
        inTime: moment(formData?.inTime).format("YYYY-MM-DDThh:mm:ss"),
        personalEquipments: formData.personalEquipments,
        visitorStatus: "I",
        zoneKey: Number(formData?.zoneKey),
        wardKey: Number(formData?.wardKey),
        buildingName: formData?.buildingName,
      };
    } else {
      console.log("update", moment(formData?.inTime).format("YYYY-MM-DDThh:mm:ss"));
      _body = {
        id: formData?.id,
        departmentKeys: JSON.parse(formData?.departmentKeysList),
        // departmentKey: Number(formData?.departmentKey),
        subDepartmentKey: 2,
        visitorPhoto: formData?.visitorPhoto,
        visitorName: formData?.visitorName,
        visitorNumber: formData?.visitorNumber,
        toWhomWantToMeet: formData?.toWhomWantToMeet,
        purpose: formData?.purpose,
        priority: formData?.priority,
        mobileNumber: formData?.mobileNumber,
        notoriousEntry: formData?.notoriousEntry ? "T" : "F",
        documentType: "Adhaar Card",
        departmentName: departments?.find((obj) => obj?.id === formData?.departmentKey)?.department,
        // inTime: formData?.inTime,
        inTime: moment(formData?.inTm).format("YYYY-MM-DDThh:mm:ss"),
        outTime: moment(watch("outTime")).format("YYYY-MM-DDThh:mm:ss"),
        personalEquipments: formData.personalEquipments,
        visitorStatus: "O",
      };
    }

    console.log("_body", _body);
    console.log("123", btnSaveText, btnType);

    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(`${urls.SMURL}/trnVisitorEntryPass/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            getAllVisitors();
            getInOut();
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Checkout" || btnType === "Checkout") {
      var d = new Date(); // for now
      const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(`${urls.SMURL}/trnVisitorEntryPass/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            formData.id
              ? sweetAlert("Updated!", "Record Updated successfully !", "success")
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            setFetchData(tempData);
            setIsOpenCollapse(false);
            setOpen(false);
            getAllVisitors();
            getInOut();
          }
        });
    }
  };

  const createColumn = () => {
    if (data?.rows[0]) {
      return Object?.keys(data?.rows[0]).map((row) => {
        return {
          field: row,
          headerName: row.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
            return str.toUpperCase();
          }),
          flex: 1,
        };
      });
    } else {
      return [];
    }
  };

  const handleOpen = (_data) => {
    setOpen(true);
    setParamsData(_data);
  };

  const getFilterWards = (value) => {
    axios
      .get(`${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`, {
        params: { departmentId: 21, zoneId: value.target.value },
      })
      .then((r) => {
        console.log("Filtered Wards", r);
        setWardKeys(r.data);
      });
  };

  const handleClose = () => setOpen(false);

  const componentRef = useRef();

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: "new document",
  });

  const resetValuesCancell = {
    visitorName: "",
    visitorPhoto: "",
    // departmentName: "",
    toWhomWantToMeet: "",
    purpose: "",
    priority: "",
    mobileNumber: "",
    inTime: null,
    outTime: null,
    notoriousEntry: null,
    visitorStatus: "",
    personalEquipments: "",
    aadhar_card_no: "",
    buildingKey: null,
    // departmentName: null,
    zoneKey: null,
    wardKey: null,
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const TempPrinter = (props) => {
    return (
      <div className={styles.main} ref={props.toPrint}>
        <div className={styles.small}>
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/logo.png" alt="" height="100vh" width="100vw" />
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4">पिंपरी चिंचवड महानगरपालिका</Typography>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              <h2 className={styles.heading}>
                <b>प्रवेश पास</b>
              </h2>
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {" "}
              <Typography>
                वेळ आत : {moment(props?.data?.inTime, "DD-MM-YYYY hh:mm:ss").format("DD-MM-YYYY hh:mm:ss")}
              </Typography>
            </Grid>
            {/* <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography>
                  दिनांक : {moment(props?.data?.inTime, "YYYY-MM-DD").format("DD-MM-YYYY")}
                </Typography>
              </Grid> */}

            {console.log("111d", props?.data?.outTime)}
            {props?.data?.outTime !== "Not Available" && (
              <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {" "}
                <Typography>
                  वेळ बाहेर :{" "}
                  {moment(props?.data?.outTime, "DD-MM-YYYY hh:mm:ss").format("DD-MM-YYYY hh:mm:ss")}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={9}></Grid>
            <Grid item xs={3}>
              <img
                src={`${urls.CFCURL}/file/preview?filePath=${props?.data?.visitorPhoto}`}
                alt="123"
                height="100vh"
                width="100vw"
              />
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={9}>
              <Typography>1) अभ्यागत क्रमांक : {props?.data?.visitorEntryNumber}</Typography>
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              <Typography>2) नागरिकाचे नाव श्री/श्रीमती : {props?.data?.visitorName}</Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              <Typography>3) कोणाला भेटायचे : {props?.data?.toWhomWantToMeet}</Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              <Typography>4) भेटण्याचे कारण : {props?.data?.purpose}</Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              <Typography>5) मोबाईल नंबर : {props?.data?.mobileNumber}</Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              <Typography>6) विभागाचे नाव : {props?.data?.departmentName}</Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              <Typography>मनपा अधिकारी/कर्मचारी यांची स्वाक्षरी : </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Grid container sx={{ padding: "5px" }}>
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="subtitle2">पिंपरी चिंचवड महानगरपलिका,</Typography>
              <Typography variant="subtitle2">मुंबई-पुणे महामार्ग पिंपरी पुणे 411-018,</Typography>
              <Typography variant="subtitle2">महाराष्ट्र, भारत</Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sx={{
                display: "flex",
                flexDirection: "column",
                // alignItems: "center",
                // justifyContent: "center",
              }}
            >
              <Typography>फोन क्रमांक:91-020-2742-5511/12/13/14</Typography>
              <Typography>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/qrcode1.png" alt="" height="70vh" width="70vw" />
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/barcode.png" alt="" height="50vh" width="100vw" />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "5px" }}>
            <Grid item xs={12}>
              <Typography>टीप : परत जाताना कृपया सुरक्षा विभागाकडे पास जमा करा </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      maxWidth: 60,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "visitorPhoto",
      headerName: <FormattedLabel id="visitorPhoto" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "visitorName",
      headerName: <FormattedLabel id="visitorName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "zoneKey",
      headerName: <FormattedLabel id="zone" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "wardKey",
      headerName: <FormattedLabel id="ward" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentName",
      headerName: <FormattedLabel id="deptName" />,
      // flex: 1,
      minWidth: 150,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "toWhomWantToMeet",
      headerName: <FormattedLabel id="toWhomWantToMeet" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "purpose",
      headerName: <FormattedLabel id="purpose" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "priority",
      headerName: <FormattedLabel id="priority" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "mobileNumber",
      headerName: <FormattedLabel id="mobileNumber" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "inTime",
      headerName: <FormattedLabel id="inTime" />,
      flex: 1,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "outTime",
      headerName: <FormattedLabel id="outTime" />,
      flex: 1,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "notoriousEntry",
      headerName: <FormattedLabel id="notoriousEntry" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "visitorStatus",
      headerName: <FormattedLabel id="visitorStatus" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "documentType",
      headerName: "Document Type",
      flex: 1,
      headerAlign: "center",
    },

    {
      hide: true,
      field: "personalEquipments",
      headerName: <FormattedLabel id="personalEquipments" />,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              // disabled={editButtonInputState}
              onClick={() => {
                console.log("printData", params.row);

                setPrintData(params.row);
                // handlePrint();
                setIsReady("none");
              }}
            >
              <Paper style={{ display: isReady }}>
                <ComponentToPrint ref={componentRef} data={printData} />
                {/* <TempPrinter toPrint={componentRef} data={printData} /> */}
                {/* <TempPrinter toPrint={componentRef} data={params.row} /> */}
              </Paper>
              <PrintIcon style={{ color: "#556CD6" }} />
            </IconButton>

            {params.row.visitorStatus == "In" && (
              <IconButton
                onClick={() => {
                  handleOpen(params);
                }}
              >
                <ExitToAppIcon style={{ color: "#556CD6" }} />
              </IconButton>
            )}
          </Box>
        );
      },
    },
  ];
  const getDepartment = () => {
    axios.get(`${urls.CfcURLMaster}/department/getAll`).then((res) => {
      console.log("dept", res);
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      );
    });
  };

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
      <Paper style={{ display: isReady }}>
        {/* <ComponentToPrint ref={componentRef} data={printData} /> */}
        {/* <TempPrinter toPrint={componentRef} data={printData} /> */}
        <TempPrinter toPrint={componentRef} data={printData} />
      </Paper>
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
          {/* Visitor In/Out Entry */}
          <FormattedLabel id="visitorInOutEntry" />
        </h2>
      </Box>

      <Head>
        <title>Visitor-Entry</title>
      </Head>

      {isOpenCollapse ? (
        <>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "45%" }}
                    fullWidth
                    id="outlined-basic"
                    // label="Visitor Mobile No."
                    label={<FormattedLabel id="visitorMobileNo" />}
                    size="small"
                    variant="outlined"
                    {...register("searchEmployeeId")}
                    // error={errors.searchEmployeeId}
                    // helperText={errors.searchEmployeeId ? errors.searchEmployeeId.message : null}
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    disabled={!watch("searchEmployeeId")}
                    size="small"
                    onClick={() => {
                      searchEmployeeDetails(watch("searchEmployeeId"));
                    }}
                  >
                    <FormattedLabel id="searchVisitorDetails" />
                  </Button>
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                {searchEmpData.length > 0 && (
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <FormControl fullWidth size="small" sx={{ width: "45%" }} error={errors.buildingKey}>
                      <InputLabel id="demo-simple-select-standard-label">Visitor List</InputLabel>
                      <Controller
                        name="visitor"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              console.log("321", value.target.value);
                              setValue("visitorName", value?.target?.value?.visitorName);
                              setValue("toWhomWantToMeet", value?.target?.value?.toWhomWantToMeet);
                              setValue("mobileNumber", value?.target?.value?.mobileNumber);
                              setValue("purpose", value?.target?.value?.purpose);
                              setValue("inTime", value?.target?.value?.inTime);
                              setValue("personalEquipments", value?.target?.value?.personalEquipments);
                              setValue("priority", value?.target?.value?.priority);
                              setValue("zoneKey", value?.target?.value?.zoneKey);
                              setValue("wardKey", value?.target?.value?.wardKey);
                            }}
                            fullWidth
                            label="Visitor List"
                          >
                            {searchEmpData?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item}>
                                  {item.visitorName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {/* {errors?.buildingKey ? errors.buildingKey.message : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    // label="Visitor Number"
                    label={<FormattedLabel id="visitorNumber" required />}
                    size="small"
                    fullWidth
                    disabled
                    value={nextEntryNumber}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("visitorNumber")}
                    sx={{ width: "90%" }}
                    error={!!errors.visitorNumber}
                    helperText={errors?.visitorNumber ? errors.visitorNumber.message : null}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label={<FormattedLabel id="visitorName" required />}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("visitorName")}
                    sx={{ width: "90%" }}
                    error={!!errors.visitorName}
                    helperText={errors?.visitorName ? errors.visitorName.message : null}
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                  <FormControl
                    // required
                    fullWidth
                    size="small"
                    sx={{ width: "90%" }}
                    error={errors.zoneKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="zoneName" required />
                    </InputLabel>
                    <Controller
                      name="zoneKey"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          // {...field}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            getFilterWards(value);
                          }}
                          fullWidth
                          label="Zone Name"
                        >
                          {zoneKeys.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item.id}>
                                {item.zoneName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.zoneKey ? errors.zoneKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                  <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.wardKey}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="wardName" required />
                    </InputLabel>
                    <Controller
                      defaultValue=""
                      name="wardKey"
                      control={control}
                      render={({ field }) => (
                        <Select
                          // {...field}
                          onChange={(value) => field.onChange(value)}
                          value={field.value}
                          fullWidth
                          label={<FormattedLabel id="wardName" required />}
                        >
                          {wardKeys.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item.id}>
                                {item.wardName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.wardKey ? errors.wardKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                  <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.buildingKey}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="buildingName" required />
                    </InputLabel>
                    <Controller
                      name="buildingKey"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          // {...field}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          fullWidth
                          label={<FormattedLabel id="buildingName" required />}
                        >
                          {buildings?.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item.id}>
                                {item.buildingName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.buildingKey ? errors.buildingKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  {/* <FormControl
                    fullWidth
                    size="small"
                    sx={{ width: "90%" }}
                    error={errors.departmentKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Department Name
                    </InputLabel>
                    <Controller
                      name="departmentKey"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Department Name"
                          value={field.value}
                          fullWidth
                          size="small"
                        >
                          {departments?.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item.id}>
                                {item.department}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                    />
                    <FormHelperText>
                      {errors?.departmentKey
                        ? errors.departmentKey.message
                        : null}
                    </FormHelperText>
                  </FormControl> */}

                  <FormControl
                    fullWidth
                    size="small"
                    sx={{ width: "90%" }}
                    // error={errors.departmentKey}
                  >
                    <Controller
                      name="departmentName"
                      control={control}
                      type="text"
                      defaultValue={[]}
                      render={({ field }) => (
                        <FormControl>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="deptName" required />}
                          </InputLabel>
                          <Select
                            size="small"
                            {...field}
                            value={field.value}
                            // labelId="Department Name"
                            label={<FormattedLabel id="deptName" />}
                            multiple
                            defaultValue={[]}
                          >
                            {departments.map((age, i) => (
                              <MenuItem value={age.id} key={i}>
                                {age.department}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label={<FormattedLabel id="toWhomWantToMeet" required />}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("toWhomWantToMeet")}
                    sx={{ width: "90%" }}
                    error={!!errors.toWhomWantToMeet}
                    helperText={errors?.toWhomWantToMeet ? errors.toWhomWantToMeet.message : null}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl fullWidth size="small" sx={{ width: "90%" }} error={!!errors.priority}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="priority" required />
                    </InputLabel>
                    <Controller
                      name="priority"
                      control={control}
                      // defaultValue="Emergency Visit"
                      render={({ field }) => (
                        <Select
                          {...field}
                          // defaultValue="Emergency Visit"
                          label="Priority"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {priorityList.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item.label}>
                                {item.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                    />
                    <FormHelperText>{errors?.priority ? errors.priority.message : null}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    {...register("mobileNumber")}
                    label={<FormattedLabel id="mobileNumber" required />}
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // id="standard-basic"
                    // variant="standard"
                    id="outlined-basic"
                    variant="outlined"
                    sx={{
                      width: "90%",
                    }}
                    error={errors.mobileNumber}
                    helperText={errors.mobileNumber ? errors.mobileNumber.message : null}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Controller
                    name="notoriousEntry"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        {...field}
                        control={<Checkbox />}
                        label={<FormattedLabel id="notoriousEntry" required />}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    <FormattedLabel id="visitorPhoto" required />
                  </Typography>
                  <Box sx={{ border: "1px solid gray", borderRadius: "5px" }}>
                    <UploadButtonThumbOP
                      appName={appName}
                      fileName={"visitorPhoto.png"}
                      serviceName={serviceName}
                      fileDtl={getValues("visitorPhoto")}
                      fileKey={"visitorPhoto"}
                      showDel={pageMode != "VISITOR ENTRY" ? false : true}
                    />
                    {console.log("llllje", watch("visitorPhoto"))}
                    {/* <Button variant="contained" component="label" size="small">
                    Upload
                    <input hidden accept="image/*" multiple type="file" />
                  </Button> */}
                  </Box>

                  {/* <Controller
                  name="visitorPhoto"
                  control={control}
                  render={({ field }) => (
                    <Button variant="contained" component="label" size="small">
                      Upload
                      <input
                        {...field}
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                      />
                    </Button>
                  )}
                /> */}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label={<FormattedLabel id="purpose" required />}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("purpose")}
                    sx={{ width: "90%" }}
                    error={!!errors.purpose}
                    helperText={errors?.purpose ? errors.purpose.message : null}
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Controller
                    name="aadhar_card_no"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={<FormattedLabel id="aadharNo" />}
                        fullWidth
                        sx={{ width: "90%" }}
                        size="small"
                        error={errors.aadhar_card_no}
                        helperText={errors.aadhar_card_no ? errors.aadhar_card_no.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Controller
                    control={control}
                    name="inTime"
                    defaultValue={new Date()}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          {...field}
                          renderInput={(props) => (
                            <TextField
                              {...props}
                              size="small"
                              fullWidth
                              sx={{ width: "90%" }}
                              error={errors.inTime}
                              helperText={errors?.inTime ? errors.inTime.message : null}
                            />
                          )}
                          label={<FormattedLabel id="visitorInDateTime" required />}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          disablePast
                          disableFuture
                          defaultValue={new Date()}
                          inputFormat="DD-MM-YYYY hh:mm:ss"
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Divider style={{ background: "black" }} variant="middle" />
                <Grid item xs={12}>
                  <TextField
                    sx={{ width: "95%" }}
                    fullWidth
                    id="outlined-basic"
                    label={<FormattedLabel id="personalEquipments" />}
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    {...register("personalEquipments")}
                    error={!!errors.personalEquipments}
                    helperText={errors?.personalEquipments ? errors.personalEquipments.message : null}
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ paddingBottom: "20px" }}>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button variant="contained" size="small" type="submit">
                    {<FormattedLabel id="save" />}
                  </Button>
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      reset({
                        ...resetValuesCancell,
                      })
                    }
                  >
                    {<FormattedLabel id="clear" />}
                  </Button>
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setIsOpenCollapse(!isOpenCollapse);
                      exitButton();
                    }}
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </>
      ) : (
        <>
          <Grid
            container
            sx={{
              padding: "10px",
              border: "1px solid gray",
              borderRadius: "10px",
            }}
          >
            <Grid
              xs={4}
              item
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>{`Date : ${moment(new Date()).format("DD-MM-YYYY")}`}</Typography>
            </Grid>
            <Grid
              xs={4}
              item
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "so",
              }}
            >
              <Typography>Total in : {totalInOut?.Values[0]["Total_in"]}</Typography>
            </Grid>
            <Grid
              xs={3}
              item
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "so",
              }}
            >
              <Typography>Total out : {totalInOut?.Values[0]["Total_out"]}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                // type='primary'
                // disabled={buttonInputState}
                onClick={() => {
                  // reset({
                  //   ...resetValuesExit,
                  // });
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("Save");
                  // setButtonInputState(true);
                  // setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>

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
              getAllVisitors(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAllVisitors(_data, data.page);
            }}
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box
                sx={{
                  padding: "10px",
                }}
              >
                {" "}
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Controller
                    control={control}
                    name="outTime"
                    defaultValue={new Date()}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          {...field}
                          renderInput={(props) => (
                            <TextField
                              {...props}
                              size="small"
                              fullWidth
                              sx={{ width: "90%" }}
                              error={errors.outTime}
                              helperText={errors?.outTime ? errors.outTime.message : null}
                            />
                          )}
                          disablePast
                          defaultValue={new Date()}
                          inputFormat="DD-MM-YYYY hh:mm:ss"
                          label="Visitor Out Date Time"
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
                {/* <Controller
                  control={control}
                  name="outTime"
                  defaultValue={new Date()}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        renderInput={(props) => (
                          <TextField {...props} size="small" fullWidth />
                        )}
                        label="Visitor Out Date Time"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                    </LocalizationProvider>
                  )}
                /> */}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setBtnSaveText("Checkout");
                    setRowId(paramsData.row.id);
                    console.log("paramsData.row", paramsData.row);
                    onSubmitForm(paramsData.row, "Checkout");
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </Paper>
  );
}

export default VisitorEntry;
