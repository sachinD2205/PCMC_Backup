import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import styles from "../../../../styles/LegalCase_Styles/parawiseReport.module.css";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import FileTable from "../../FileUpload/FileTableLcWithoutAddButton";
import { Visibility } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { toast, ToastContainer } from "react-toastify";
import UndoIcon from "@mui/icons-material/Undo";
import sweetAlert from "sweetalert";
import DeleteIcon from "@mui/icons-material/Delete";

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

const DigitalSignature = () => {
  const methods = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      parawiseTrnParawiseReportDaoLst: [
        { issueNo: "", paragraphWiseAanswerDraftOfIssues: "", paragraphWiseAanswerDraftOfIssuesMarathi: "" },
      ],
    },
  });

  const {
    getValues,
    setValue,
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [noticeId, setNoticeId] = React.useState(null);
  const router = useRouter();

  const [requisitionDate, setRequisitionDate] = React.useState(null);
  let pageType = false;
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [mode, setMode] = useState();
  const token = useSelector((state) => state.user.user.token);
  const [employeeList, setEmployeeList] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [authority, setAuthority] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [audienceSample, setAudienceSample] = useState(selectedNotice);
  const [noticeData, setNoticeData] = useState();
  const language = useSelector((state) => state.labels.language);
  // noticeData
  const [concerDeptList, setConcernDeptList] = useState([]);
  const [noticeHistoryList, setNoticeHistoryList] = useState([]);
  const [approveRejectRemarkMode, setApproveRejectRemarkMode] = useState("");
  const handleOpen = (approveRejectRemarkMode) => {
    setOpen(true);
    setApproveRejectRemarkMode(approveRejectRemarkMode);
  };
  const handleClose = () => setOpen(false);
  const [parawiseReportList, setParawiseReportList] = useState([]);
  const [open, setOpen] = useState(false);
  const selectedNotice = useSelector((state) => {
    console.log("selectedNotice", state.user.selectedNotice);
    return state.user.selectedNotice;
  });

  const [parawiseReportId, setParawiseReportId] = useState();
  const [parawiseReport, setParawiseReport] = useState();

  let user = useSelector((state) => state.user.user);

  //key={field.id}

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "parawiseReportDao", // unique name for your Field Array
  });

  const onFinish = () => {};
  // userName
  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res user", r);
          setEmployeeList(r.data.user);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // departments
  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      let ds = res.data.department.map((r, i) => ({
        id: r.id,
        department: r.department,
      }));

      console.log("ds", ds);
      setDepartments(ds);
    });
  };

  // authority
  const getAuthority = () => {
    axios.get(`${urls.CFCURL}/master/employee/getAll`).then((res) => {
      console.log("Authority yetayt ka re: ", res.data);
      setAuthority(
        res.data.map((r, i) => ({
          id: r.id,
          firstName: r.firstName,
          middleName: r.middleName,
          lastName: r.lastName,
          department: r.department,
          departmentName: departments?.find((obj) => obj?.id === r.department)?.department,
        })),
      );
    });
  };

  // ParawiseReport
  const getParawiseReport = (noticeIdPassed) => {
    let url = `${urls.LCMSURL}/parawiseReport/getByNoticeIdAndDeptId?noticeId=${noticeIdPassed}&deptId=${user?.userDao?.department}`;

    console.log("url", url);
    axios
      .get(url)
      .then((r) => {
        console.log("res parawiseReport", r);
        if (r.status == 200) {
          console.log("res office location", r);
          setParawiseReport(r.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // Location
  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(r.data.officeLocation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // Notice Attachments
  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: <FormattedLabel id="action" />,
      headerName: "Action",
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,

                  "_blank",
                );
              }}
            >
              <Visibility />
            </IconButton>
          </>
        );
      },
    },
  ];

  // Notice Remark
  const _columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeSentDate",
      headerName: <FormattedLabel id="remarkDate" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeRecivedFromPerson",
      headerName: <FormattedLabel id="user" />,
      width: 250,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "department",
      headerName: <FormattedLabel id="deptName" />,
      // type: "number",
      width: 150,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  // concer Dept noticeAttachment
  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "locationNameEn" : "locationNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: <FormattedLabel id="subDepartment" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
  ];

  // parawiseRportColumns
  const parawiseRportColums = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "issueNo",
      headerName: <FormattedLabel id="issueNo" />,
      flex: 1,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAanswerDraftOfIssues",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAanswerDraftOfIssuesMarathi",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  // Parawise Response
  // const parawiseResponseColumn = [
  //   {
  //     headerName: <FormattedLabel id="srNo" />,
  //     field: "srNo",
  //     width: 100,
  //     align: "center",
  //     headerAlign: "center",
  //     renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
  //   },
  //   {
  //     headerName: "Parawise Remark English",
  //     field: "parawiseRemarkEnglish",
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     headerName: "Parawise Remark Marathi",
  //     field: "parawiseRemarkMarathi",
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  // ];

  useEffect(() => {
    getDepartments();
    getOfficeLocation();
    getUserName();
    getAuthority();
  }, []);

  useEffect(() => {
    // set NotifData only if departments is not null and not empty
    if (departments != null && departments.length > 0) {
      console.log("departments", departments);
      setNoticeData(selectedNotice);
    }
  }, [departments]);

  useEffect(() => {
    let clerkApprovalRemarkAfterParawise = noticeData?.clerkApprovalRemarkAfterParawise;
    console.log("clerkApprovalRemarkAfterParawise", clerkApprovalRemarkAfterParawise);

    // check if clerkApprovalRemarkAfterParawise is not null
    if (clerkApprovalRemarkAfterParawise == null) {
      return;
    }

    // convert clerkApprovalRemarkAfterParawise to json array
    let _clerkApprovalRemarkAfterParawise = JSON.parse(clerkApprovalRemarkAfterParawise);
    console.log("_clerkApprovalRemarkAfterParawise", _clerkApprovalRemarkAfterParawise);

    // iterate over _clerkApprovalRemarkAfterParawise
    remove();

    _clerkApprovalRemarkAfterParawise?.map((item, i) => {
      console.log("valjsonsagar", item);
      console.log("i", i);
      if (item.issueNo != null && item.issueNo != "") {
        // append to Fields
        append({
          departmentId: item.departmentId,
          // fetch departmentName from department id by refering to departmentList if departmentList is not null else assign "sagar"
          departmentName: departments?.find((dept) => dept.id === item.departmentId)?.department,
          issueNo: item.issueNo,
          parawiseRemarkEnglish: item.parawiseRemarkEnglish,
          parawiseRemarkMarathi: item.parawiseRemarkMarathi,
          parawiseLegalClerkRemarkEnglish: item.parawiseLegalClerkRemarkEnglish,
          parawiseLegalClerkRemarkMarathi: item.parawiseLegalClerkRemarkMarathi,
        });
      }

      console.log("fields", fields);
    });
  }, [noticeData]);

  useEffect(() => {
    console.log("Notice DAta", noticeData);
    setValue("noticeRecivedDate", noticeData?.noticeRecivedDate);
    setValue("noticeDate", noticeData?.noticeDate);
    setValue("noticeRecivedFromAdvocatePerson", noticeData?.noticeRecivedFromAdvocatePerson);
    setValue("requisitionDate", noticeData?.requisitionDate);
    setValue("noticeRecivedFromAdvocatePerson", noticeData?.noticeReceivedFromAdvocatePerson);
    setValue("noticeRecivedFromAdvocatePersonMr", noticeData?.noticeReceivedFromAdvocatePersonMr);
    setValue("noticeDetails", noticeData?.noticeDetails);
    setValue("inwardNo", noticeData?.inwardNo);

    // notice id
    setNoticeId(noticeData?.id);

    getParawiseReport(noticeData?.id);

    // concernDept - Details
    let _ress = noticeData?.concernDeptUserList?.map((val, i) => {
      console.log("resd", val);
      return {
        srNo: i + 1,
        id: i,
        departmentNameEn: departments?.find((obj) => obj?.id === val.departmentId)?.department,
        departmentNameMr: departments?.find((obj) => obj?.id === val.departmentId)?.departmentMr,
        locationNameEn: officeLocationList?.find((obj) => obj?.id === val.locationId)?.officeLocationName,
        locationNameMr: officeLocationList?.find((obj) => obj?.id === val.locationId)?.officeLocationNameMar,
        departmentId: val?.departmentId,
        locationId: val?.locationId,
      };
    });
    setConcernDeptList(_ress);

    // Notice History
    let _noticeHisotry = noticeData?.noticeHisotry?.map((file, index) => {
      return {
        id: index,
        srNo: index + 1,
        remark: file.remark ? file.remark : "-",
        designation: file.designation ? file.designation : "Not Available",
        noticeRecivedFromPerson: employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)
          ?.firstNameEn
          ? employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)?.firstNameEn
          : "Not Available",
        department: departments?.find((obj) => obj.id === selectedNotice.concernDeptUserList[0]?.departmentId)
          ?.department
          ? departments?.find((obj) => obj.id === selectedNotice.concernDeptUserList[0]?.departmentId)
              ?.department
          : "Not Available",
        noticeSentDate: file.noticeSentDate ? file.noticeSentDate : "Not Available",
      };
    });

    setNoticeHistoryList(_noticeHisotry);

    // Notice Attachment
    if (employeeList.length > 0 && departments.length > 0) {
      const noticeAttachment = [...selectedNotice.noticeAttachment];
      let _noticeAttachment = noticeAttachment.map((file, index) => {
        console.log("23", file);
        return {
          id: file.id ? file.id : "Not Available",
          srNo: file.id ? file.id : "Not Available",
          originalFileName: file.originalFileName ? file.originalFileName : "Not Available",
          extension: file.extension ? file.extension : "Not Available",
          attachedNameEn: file.attachedNameEn ? file.attachedNameEn : "Not Available",
          attachedNameMr: file.attachedNameMr ? file.attachedNameMr : "Not Available",
          filePath: file.filePath ? file.filePath : "-",
        };
      });
      _noticeAttachment !== null && setMainFiles([..._noticeAttachment]);
    }

    // Parawise Report
    let _parawiseReport = noticeData?.parawiseTrnParawiseReportDaoLst?.map((val, i) => {
      console.log("resd", val);
      return {
        srNo: i + 1,
        id: i,
        paragraphWiseAanswerDraftOfIssues: val?.paragraphWiseAanswerDraftOfIssues,
        paragraphWiseAanswerDraftOfIssuesMarathi: val?.paragraphWiseAanswerDraftOfIssuesMarathi,
        issueNo: val?.issueNo,
      };
    });
    setParawiseReportList(_parawiseReport);

    // add data in fields
  }, [officeLocationList, departments, employeeList, authority, noticeData]);

  useEffect(() => {
    console.log("parawiseReportList", parawiseReportList);
    console.log("concerDeptList", concerDeptList);
  }, [concerDeptList, noticeHistoryList, finalFiles, parawiseReportList]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  // for Reset
  useEffect(() => {
    if (router.query.pageMode == "Final") {
      console.log("Data------", router.query);
      setValue("noticeReceivedFromAdvocatePerson", router.query.noticeReceivedFromAdvocatePerson);
      setValue("advocateAddress", router.query.advocateAddress);
      setValue("clerkRemarkEn", router.query.clerkRemarkEn);
      setValue("noticeRecivedDate", router.query.noticeRecivedDate);

      // setValue("caseNumber", router.query.caseNumber);
      reset(router.query);

      getParawiseReport(noticeData?.id);
    }
  }, []);

  // Save - DB
  const onSubmitForm = (Data) => {
    console.log("data", Data);
    // const opinionRequestDate = moment(Data.opinionRequestDate).format("DD-MM-YYYY");
    let body = {
      ...Data,
      opinionRequestDate,
      opinionAdvPanelList: selectedID.map((val) => {
        return {
          advocate: val,
        };
      }),

      // role: "OPINION_CREATE",
      status: buttonText === "saveAsDraft" ? "OPINION_DRAFT" : "OPINION_CREATED",
      sentToAdvocate: buttonText === "saveAsDraft" ? "N" : "Y",
      role: buttonText === "saveAsDraft" ? "OPINION_SAVE_AS_DRAFT" : "CREATE_OPINION",

      // role:
      //   Data.target.textContent === "Submit"
      //     ? "OPINION_CREATE"
      //     : "OPINION_DRAFT",

      reportAdvPanelList: selectedID1.map((val) => {
        return {
          advocate: val,
        };
      }),

      // id: null,
      //name
      id: router.query.pageMode == "Opinion" ? null : Data.id,

      // role :"OPINION_DRAFT"

      // role:"OPINION_SAVE_AS_DRAFT"
    };

    console.log("body", body);

    axios
      .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res123", res);
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/opinion`);
        }
      });
  };

  // view
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmitForm)}>
          <Paper
            sx={{
              margin: 3,
              padding: 2,
            }}
            elevation={5}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <Box
                  style={{
                    marginTop: "10px",
                  }}
                ></Box>

                <FormProvider {...methods}>
                  <Paper>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                      <Box
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            overflow: "hidden",
                            fontSize: "10px",
                            whiteSpace: "normal",
                            backgroundColor: "green",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#fff",
                              color: "#556CD6",
                            },
                          }}
                        >
                          Apply Digital Signature
                        </Button>
                      </Box>
                      <Grid container>
                        <Grid item xs={8}>
                          <Typography>Notice Reply Draft.</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>PIMPRI CHINCHWAD MUNICIPAL CORPORATION</Typography>
                          <Typography>PIMPRI- 411018.</Typography>
                          <Typography></Typography>
                          {/* <Typography>जा.क्र.</Typography> */}
                        </Grid>
                      </Grid>

                      {/* Date Picker */}
                      <Grid container>
                        <Grid item xs={8}></Grid>
                        <Grid
                          item
                          sx={{
                            marginTop: "5px",
                          }}
                          xs={0.6}
                        >
                          <Typography>Date - </Typography>
                        </Grid>
                        <Grid item>
                          <TextField
                            //  disabled
                            id="standard-textarea"
                            // label="Department Name"
                            // label={<FormattedLabel id="opinionSubject" />}

                            placeholder="Department Name"
                            multiline
                            variant="standard"
                            // style={{ width: 200 }}
                            {...register("noticeRecivedDate")}
                            error={!!errors.noticeRecivedDate}
                            helperText={errors?.noticeRecivedDate ? errors.noticeRecivedDate.message : null}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("opinionSubject") ? true : false) || (router.query.opinionSubject ? true : false),
                            // }}

                            InputProps={{
                              disableUnderline: true,
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid
                          item
                          sx={{
                            marginLeft: "10px",
                          }}
                          xs={4}
                        >
                          <Typography>To,</Typography>
                        </Grid>
                      </Grid>

                      <Box>
                        <Grid
                          container
                          sx={{
                            marginLeft: "10px",
                          }}
                        >
                          {/* textfield for Department Name */}
                          <Grid item>
                            <TextField
                              sx={{ width: 200 }}
                              // disabled={router?.query?.pageMode === "View"}
                              id="standard-textarea"
                              // label="Department Name"
                              // label={<FormattedLabel id="opinionSubject" />}

                              placeholder="Department Name"
                              variant="standard"
                              // style={{ width: 200 }}
                              {...register("noticeReceivedFromAdvocatePerson")}
                              error={!!errors.noticeReceivedFromAdvocatePerson}
                              helperText={
                                errors?.noticeReceivedFromAdvocatePerson
                                  ? errors.noticeReceivedFromAdvocatePerson.message
                                  : null
                              }
                              InputProps={{
                                disableUnderline: true,
                                // style: { fontWeight: 'bold' },
                              }}

                              // disabled
                            />
                          </Grid>
                        </Grid>

                        {/* for Advocate Address */}
                        <Grid
                          container
                          sx={{
                            marginLeft: "10px",
                          }}
                        >
                          {/* textfield for Department Name */}
                          <Grid item>
                            <TextField
                              sx={{ width: 200 }}
                              // disabled={router?.query?.pageMode === "View"}
                              id="standard-textarea"
                              // label="Department Name"
                              // label={<FormattedLabel id="opinionSubject" />}

                              placeholder="Department Name"
                              variant="standard"
                              // style={{ width: 200 }}
                              {...register("advocateAddress")}
                              error={!!errors.advocateAddress}
                              helperText={errors?.advocateAddress ? errors.advocateAddress.message : null}
                              InputProps={{
                                disableUnderline: true,
                                // style: { fontWeight: 'bold' },
                              }}

                              // disabled
                            />
                          </Grid>
                        </Grid>
                     
                        <Grid
                          container
                          sx={{
                            marginTop: "40px",
                          }}
                          spacing={1}
                        >
                          <Grid item xs={4}></Grid>
                         
                          <Grid item xs={6}>
                            <TextField
                              variant="standard"
                              id="myTextField"
                              //  disabled
                              InputProps={{
                                disableUnderline: true,
                                // style: { fontWeight: 'bold' },
                              }}
                              fullWidth
                              {...register("opinionSubject")}
                            />
                          </Grid>
                        </Grid>

                       

                      
                          {/* <Box
                           
                            height="100%"
                            flex={1}
                            flexDirection="column"
                            display="flex"
                            p={2}
                            padding="0px"
                            
                          > */}
                            {/* Response to notice Details */}
                            {fields.map((parawise, index) => {
                              return (
                                <>
                                  <Grid
                                    container
                                    // className={styles.theme2}
                                    // component={Box}
                                    style={{ marginTop: 20 }}
                                  >
                                    <Grid item xs={0.1}></Grid>

                                  
                                    <Grid item xs={0.1}></Grid>


                                    <Grid item xs={0.2}></Grid>
                                    

                                    <Grid item xs={0.3}></Grid>

                                  
                                  </Grid>

                                  {/* responses by legal clerk*/}
                                  <Grid
                                    container
                                    className={styles.theme2}
                                    component={Box}
                                    style={{ marginTop: 20, marginBottom: "20px"  , marginLeft:"80px"}}
                                  >
                                    <Grid item
                                     xs={0.4} 
                                    //  sx={{ display: "flex", justifyContent: "center" }}
                                     >
                                      <TextField
                                        disabled
                                        variant="standard"
                                        InputProps={{ disableUnderline: true }}
                                        placeholder="Issue No"
                                        size="small"
                                        type="number"
                                        // oninput="auto_height(this)"
                                        {...register(`parawiseReportDao.${index}.issueNo`)}
                                      ></TextField>
                                    </Grid>
                                  


                                    <Grid item xs={0.1}></Grid>
                                    {/* para for english */}
                                    <Grid item xs={10} sx={{ display: "flex", justifyContent: "center" }}>
                                      <TextField // style={auto_height_style}
                                        disabled
                                        // rows="1"
                                        // style={{ width: 500 }}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Legal Clerk Response(In English)"
                                        variant="standard"
                                        InputProps={{ disableUnderline: true }}
                                        size="small"
                                        // oninput="auto_height(this)"
                                        {...register(
                                          `parawiseReportDao.${index}.parawiseLegalClerkRemarkEnglish`,
                                        )}
                                      ></TextField>
                                    </Grid>

                                    <Grid item xs={0.3}></Grid>

                                   
                                  </Grid>


                                  {/* Grid for Marathi Remark */}
                                  <Grid
                                    container
                                    className={styles.theme2}
                                    component={Box}
                                    style={{ marginTop: 20, marginBottom: "20px" , marginLeft:"80px" }}
                                  >
                                    <Grid item
                                     xs={0.5} 
                                    //  sx={{ display: "flex", justifyContent: "center" }}
                                     >
                                      
                                    </Grid>
                                  

                                    {/* para for Marathi */}
                                    <Grid item xs={10}
                                     sx={{ display: "flex", justifyContent: "center" }}
                                     >
                                      <TextField // style={auto_height_style}
                                        disabled
                                        // rows="1"
                                        // style={{ width: 500 }}
                                        variant="standard"
                                        InputProps={{ disableUnderline: true }}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Legal Clerk Response(In Marathi)"
                                        size="small"
                                        // oninput="auto_height(this)"
                                        {...register(
                                          `parawiseReportDao.${index}.parawiseLegalClerkRemarkMarathi`,
                                        )}
                                      ></TextField>
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            })}
                            {/* </ThemeProvider> */}
                          {/* </Box> */}
                        {/* </Box> */}

                        <Grid
                          container
                          sx={{
                            marginTop: "120px",
                          }}
                        >
                          <Grid item xs={8.5}></Grid>
                          <Grid
                            item
                            xs={3.5}
                            sx={{
                              marginBottom: "50px",
                            }}
                          >
                            <h4>PIMPRI CHINCHWAD MUNICIPAL CORPORATION</h4>
                            <h4>PIMPRI- 411018.</h4>
                            <Typography></Typography>
                            {/* <Typography>जा.क्र.</Typography> */}
                          </Grid>
                        </Grid>

                        {/* </Box> */}
                      </Box>
                    </form>
                  </Paper>
                </FormProvider>
              </>
            )}
          </Paper>
        </form>
      </FormProvider>
    </>
  );
};

export default DigitalSignature;
