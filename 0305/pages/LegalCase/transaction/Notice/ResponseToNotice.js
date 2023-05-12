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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/LegalCase_Styles/parawiseReport.module.css";

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

const ResponseToNotice = () => {
  const methods = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      parawiseTrnParawiseReportDaoLst: [
        { issueNo: "", paragraphWiseAnswerDraftOfIssues: "", paragraphWiseAnswerDraftOfIssuesMarathi: "" },
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
  const [parawiseReport, setParawiseReport] = useState([]);

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
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      );
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
    if (noticeIdPassed == null) return;

    let url = `${urls.LCMSURL}/parawiseReport/getAllByNoticeId?noticeId=${noticeIdPassed}`;

    console.log("url", url);
    axios
      .get(url)
      .then((r) => {
        console.log("res parawiseReport", r);
        if (r.status == 200) {
          console.log("res office location", r);
          setParawiseReport(r.data);

          // remove all from Fields
          remove();

          console.log("fieldsSagar", r.data);

          // Iterate r.data
          r.data.map((item, index) => {
            console.log("fieldsSagarItem", item);
            let dept = item?.departmentId;
            //let parawiseRemarkEnglish = item.parawiseRemarkEnglish;
            let parawiseRemarkMarathi = item?.parawiseRemarkMarathi;

            // convert parawiseRemarkEnglish from string to json array
            //"[{"issueNo":"","noticeId":388,"parawiseRemarkEnglish":"","parawiseRemarkMarathi":""}]"
            // Convert above string to json

            let parawiseRemarkEnglishJson = JSON.parse(item.parawiseRemarkEnglish);

            console.log("fieldsSagarDataNonJson", item.parawiseRemarkEnglish);
            console.log("fieldsSagarData", parawiseRemarkEnglishJson);

            // Iterate parawiseRemarkEnglishJson
            parawiseRemarkEnglishJson.map((item1, index) => {
              // check if issueNo is not empty

              console.log("fieldsSagarDataItem1", item1);
              if (true) {
                // append to Fields
                append({
                  departmentId: dept,
                  departmentName: departments?.find((obj) => obj?.id === dept)?.department,
                  issueNo: item1.issueNo,
                  parawiseRemarkEnglish: item1.parawiseRemarkEnglish,
                  parawiseRemarkMarathi: item1.parawiseRemarkMarathi,
                  parawiseLegalClerkRemarkEnglish: "",
                  parawiseLegalClerkRemarkMarathi: "",
                });
              }
            });

            console.log("fieldsSagarFields", fields);
          });
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

  const submitParaWiseReport = (data1) => {
    console.log("fieldsData", data1);
    console.log("fields", fields);

    // convert fields to json array
    let data = data1.parawiseReportDao.map((item) => {
      console.log("itemSagar", item);
      return {
        issueNo: item.issueNo,
        noticeId: Number(selectedNotice.id),
        departmentId: item.departmentId,
        parawiseRemarkEnglish: item.parawiseRemarkEnglish,
        parawiseRemarkMarathi: item.parawiseRemarkMarathi,
        parawiseLegalClerkRemarkEnglish: item.parawiseLegalClerkRemarkEnglish,
        parawiseLegalClerkRemarkMarathi: item.parawiseLegalClerkRemarkMarathi,
      };
    });

    // convert json array to string
    data = JSON.stringify(data);

    console.log("fieldsSagar", data);

    let bodyForApiApproveParawiseReport;

    bodyForApiApproveParawiseReport = {
      id: Number(selectedNotice.id),
      //departmentId: user?.userDao?.department,
      clerkApprovalRemarkAfterParawise: data,
      clerkApprovalRemarkAfterParawiseMr: data,
    };

    console.log("fieldsSagarbodyForApiResponseToNoticeAfterParawise", bodyForApiApproveParawiseReport);

    axios
      .post(`${urls.LCMSURL}/notice/approveTrnNoticeAfterParawiseByClerk`, bodyForApiApproveParawiseReport, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 201 || r.status == 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(`/LegalCase/transaction/newNotice`);
        } else {
          console.log("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log("errror4545", err);
        toast("Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  const onSubmitForm = (data) => {
    let bodyForApiApproveParawiseReport;
    if (approveRejectRemarkMode == "Reassign") {
      bodyForApiApproveParawiseReport = {
        id: noticeId,
        clerkRejectionRemarkAfterParawise: data?.remark,
        clerkRejectionRemarkAfterParawiseMr: data?.remarkMr,
      };
    }
    if (approveRejectRemarkMode == "Approve") {
      bodyForApiApproveParawiseReport = {
        id: noticeId,
        clerkApprovalRemarkAfterParawise: data?.remark,
        clerkApprovalRemarkAfterParawiseMr: data?.remarkMr,
      };
    } else {
      bodyForApiApproveParawiseReport = {
        id: noticeId,
        clerkApprovalRemarkAfterParawise: data?.remark,
        clerkApprovalRemarkAfterParawiseMr: data?.remarkMr,
      };
    }

    // console.log("data", data, _data);

    // const bodyForApiResponseToNoticeAfterParawise = {
    //   id: noticeId,
    //   clerkApprovalRemarkAfterParawise: "sagarclerkRemark",
    //   clerkApprovalRemarkAfterParawiseMr: "-",
    // };

    console.log("bodyForApiResponseToNoticeAfterParawise", bodyForApiApproveParawiseReport);

    axios
      .post(`${urls.LCMSURL}/notice/approveTrnNoticeAfterParawiseByClerk`, bodyForApiApproveParawiseReport, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 201 || r.status == 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(`/LegalCase/transaction/newNotice`);
        } else {
          console.log("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log("errror4545", err);
        toast("Failed ! Please Try Again !", {
          type: "error",
        });
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
      field: "paragraphWiseAnswerDraftOfIssues",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAnswerDraftOfIssuesMarathi",
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
    setNoticeData(selectedNotice);
  }, []);

  useEffect(() => {
    if (noticeData) {
      getParawiseReport(noticeData?.id);
    }
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
    if (true) {
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
        paragraphWiseAnswerDraftOfIssues: val?.paragraphWiseAnswerDraftOfIssues,
        paragraphWiseAnswerDraftOfIssuesMarathi: val?.paragraphWiseAnswerDraftOfIssuesMarathi,
        issueNo: val?.issueNo,
      };
    });

    setParawiseReportList(_parawiseReport);

    console.log("_parawiseReport", _parawiseReport);
  }, [noticeData]);

  useEffect(() => {
    console.log("parawiseReportList", parawiseReportList);
    console.log("concerDeptList", concerDeptList);
  }, [concerDeptList, noticeHistoryList, finalFiles, parawiseReportList]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  // view
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitParaWiseReport)}>
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
                >
                  {/* Form Header */}
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
                    <h2>Response To Notice</h2>
                  </Box>
                </Box>
                <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "40px",
                    marginRight: "65px",
                    borderRadius: 100,
                  }}
                >
                  <strong>{<FormattedLabel id="noticeDetails" />}</strong>
                </div>

                <ThemeProvider theme={theme}>
                  <div style={{ marginBottom: "5vh" }}>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl sx={{ marginTop: 0 }} error={!!errors.noticeDate}>
                          <Controller
                            control={control}
                            name="noticeDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16, marginTop: 2 }}>
                                      <FormattedLabel id="noticeDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  disabled
                                  onChange={(date) => {
                                    field.onChange(moment(date).format("YYYY-MM-DD"));
                                  }}
                                  // selected={field.value}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                      error={!!errors.noticeDate}
                                      helperText={errors?.noticeDate ? errors?.noticeDate.message : null}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          disabled
                          InputLabelProps={{ shrink: true }}
                          id="standard-basic"
                          label={<FormattedLabel id="inwardNo" />}
                          variant="standard"
                          {...register("inwardNo")}
                          error={!!errors.inwardNo}
                        />
                      </Grid>

                      {/* Notice Received from Advocate in English */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          disabled
                          InputLabelProps={{ shrink: true }}
                          label={<FormattedLabel id="noticeReceviedFromAdvocateEn" />}
                          variant="standard"
                          {...register("noticeRecivedFromAdvocatePerson")}
                          error={!!errors.noticeRecivedFromAdvocatePerson}
                          helperText={
                            errors?.noticeRecivedFromAdvocatePerson
                              ? errors.noticeRecivedFromAdvocatePerson.message
                              : null
                          }
                        />
                      </Grid>

                      {/* Notice Recived from Advocate in Marathi */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          disabled
                          InputLabelProps={{ shrink: true }}
                          label={<FormattedLabel id="noticeReceviedFromAdvocateMr" />}
                          variant="standard"
                          {...register("noticeRecivedFromAdvocatePersonMr")}
                          error={!!errors.noticeRecivedFromAdvocatePersonMr}
                          helperText={
                            errors?.noticeRecivedFromAdvocatePersonMr
                              ? errors.noticeRecivedFromAdvocatePersonMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl error={!!errors.noticeRecivedDate} sx={{ marginTop: 0 }}>
                          <Controller
                            control={control}
                            name="noticeRecivedDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  disabled
                                  label={
                                    <span style={{ fontSize: 16, marginTop: 2 }}>
                                      <FormattedLabel id="noticeRecivedDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={!!errors.noticeRecivedDate}
                                      helperText={
                                        errors?.noticeRecivedDate ? errors?.noticeRecivedDate.message : null
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
                          {/* <FormHelperText>
                                {errors?.noticeRecivedDate
                                  ? errors.noticeRecivedDate.message
                                  : null}
                              </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl error={!!errors.requisitionDate} sx={{ marginTop: 0 }}>
                          <Controller
                            control={control}
                            name="requisitionDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16, marginTop: 2 }}>
                                      <FormattedLabel id="requisitionDate" />
                                    </span>
                                  }
                                  disabled
                                  value={field.value}
                                  onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={!!errors.requisitionDate}
                                      helperText={
                                        errors?.requisitionDate ? errors?.requisitionDate.message : null
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
                          {/* <FormHelperText>
                                {errors?.requisitionDate
                                  ? errors?.requisitionDate.message
                                  : null}
                              </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          disabled
                          id="standard-basic"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.noticeDetails}
                          helperText={errors?.noticeDetails ? errors.noticeDetails.message : null}
                          size="small"
                          {...register("noticeDetails")}
                          label={<FormattedLabel id="noticeDetails" />}
                        />
                      </Grid>
                    </Grid>

                    {/** 
                    <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
                      <DataGrid
                        getRowId={(row) => row.srNo}
                        density="compact"
                        autoHeight={true}
                        pagination
                        paginationMode="server"
                        rows={
                          concerDeptList == [] || concerDeptList == undefined || concerDeptList == ""
                            ? []
                            : concerDeptList
                        }
                        columns={_col}
                        onPageChange={(_data) => {}}
                        onPageSizeChange={(_data) => {}}
                      />
                    </Grid>
                    */}
                  </div>
                </ThemeProvider>

                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="noticeAttachment" />}</strong>
                  </div>
                  <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
                    <Grid item xs={12}>
                      <FileTable
                        appName="LCMS" //Module Name
                        serviceName={"L-Notice"} //Transaction Name
                        fileName={attachedFile} //State to attach file
                        filePath={setAttachedFile} // File state upadtion function
                        newFilesFn={setAdditionalFiles} // File data function
                        columns={columns} //columns for the table
                        rows={finalFiles} //state to be displayed in table
                        uploading={setUploading}
                        showNoticeAttachment={router.query.showNoticeAttachment}
                      />
                    </Grid>
                  </Grid>
                </div>

                <h1>Response to Notice</h1>

                <Box
                  sx={{
                    border: "0.1rem outset black",
                    marginTop: "10px",
                  }}
                >
                  <Grid className={styles.theme1} container>
                    <Grid
                      item
                      xs={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h3>Department</h3>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h3>Point No</h3>
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h3>Points Explanation</h3>
                    </Grid>
                  </Grid>
                  <Box
                    overflow="auto"
                    height={550}
                    flex={1}
                    flexDirection="column"
                    display="flex"
                    p={2}
                    padding="0px"
                    // sx={{
                    //   border: "0.2rem outset black",
                    //   marginTop:"10px"
                    // }}
                  >
                    {fields.map((parawise, index) => {
                      return (
                        <>
                          <Grid container className={styles.theme2} component={Box} style={{ marginTop: 20 }}>
                            <Grid item xs={0.1}></Grid>

                            <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
                              <TextField
                                disabled
                                placeholder="Department"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(`parawiseReportDao.${index}.departmentName`)}
                              ></TextField>
                            </Grid>
                            <Grid item xs={0.1}></Grid>

                            <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
                              <TextField
                                disabled
                                placeholder="Issue No"
                                size="small"
                                type="number"
                                // oninput="auto_height(this)"
                                {...register(`parawiseReportDao.${index}.issueNo`)}
                              ></TextField>
                            </Grid>

                            <Grid item xs={0.2}></Grid>
                            {/* para for english */}
                            <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                              <TextField // style={auto_height_style}
                                // rows="1"
                                // style={{ width: 500 }}
                                disabled
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Paragraph Wise Answer Draft Of Issues(In English)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(`parawiseReportDao.${index}.parawiseRemarkEnglish`)}
                              ></TextField>
                            </Grid>

                            <Grid item xs={0.3}></Grid>

                            {/* para for Marathi */}
                            <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                              <TextField // style={auto_height_style}
                                // rows="1"
                                // style={{ width: 500 }}
                                disabled
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Paragraph Wise Answer Draft Of Issues(In Marathi)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(`parawiseReportDao.${index}.parawiseRemarkMarathi`)}
                              ></TextField>
                            </Grid>
                          </Grid>

                          {/* responses by legal clerk*/}
                          <Grid container className={styles.theme2} component={Box} style={{ marginTop: 20 }}>
                            <Grid item xs={1.1}></Grid>

                            <Grid item xs={1.1}></Grid>

                            <Grid item xs={0.2}></Grid>
                            {/* para for english */}
                            <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                              <TextField // style={auto_height_style}
                                // rows="1"
                                // style={{ width: 500 }}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Legal Clerk Response(In English)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(`parawiseReportDao.${index}.parawiseLegalClerkRemarkEnglish`)}
                              ></TextField>
                            </Grid>

                            <Grid item xs={0.3}></Grid>

                            {/* para for Marathi */}
                            <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                              <TextField // style={auto_height_style}
                                // rows="1"
                                // style={{ width: 500 }}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Legal Clerk Response(In Marathi)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(`parawiseReportDao.${index}.parawiseLegalClerkRemarkMarathi`)}
                              ></TextField>
                            </Grid>
                          </Grid>
                        </>
                      );
                    })}
                    {/* </ThemeProvider> */}
                  </Box>
                </Box>
                {/**
                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="noticeHistory" />}</strong>
                  </div>
                  <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
                    <Grid item xs={12}>
                      <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                        rows={
                          noticeHistoryList == [] || noticeHistoryList == undefined || noticeHistoryList == ""
                            ? []
                            : noticeHistoryList
                        }
                        columns={_columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        //checkboxSelection
                      />
                    </Grid>
                  </Grid>
                </div>

                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="parawiseReport" />}</strong>
                  </div>
                  <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
                    <Grid item xs={12}>
                      <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                        rows={
                          parawiseReportList == [] ||
                          parawiseReportList == undefined ||
                          parawiseReportList == ""
                            ? []
                            : parawiseReportList
                        }
                        columns={parawiseRportColums}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        //checkboxSelection
                      />
                    </Grid>
                  </Grid>
                </div>
                 */}

                {/**
                <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "40px",
                    marginRight: "65px",
                    borderRadius: 100,
                  }}
                >
                  <strong>Parawise Remark Clerk</strong>
                </div>
                <Grid container style={{ marginBottom: "5vh" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItem: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <TextField
                      disabled
                      id="standard-basic"
                      variant="standard"
                      // InputLabelProps={{ shrink: true }}
                      error={!!errors.parawiseRemarkEnglish}
                      helperText={errors?.parawiseRemarkEnglish ? errors.parawiseRemarkEnglish.message : null}
                      size="small"
                      {...register("parawiseRemarkEnglish")}
                      label="parawise remark english"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItem: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <TextField
                      disabled
                      id="standard-basic"
                      variant="standard"
                      // InputLabelProps={{ shrink: true }}
                      error={!!errors.parawiseRemarkMarathi}
                      helperText={errors?.parawiseRemarkMarathi ? errors.parawiseRemarkMarathi.message : null}
                      size="small"
                      {...register("parawiseRemarkMarathi")}
                      label="parawise remark marathi"
                    />
                  </Grid>
                </Grid>
                 /*}
                   <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "40px",
                    marginRight: "65px",
                    borderRadius: 100,
                  }}
                >
                  <strong>Parawise Remark Clerk</strong>
                </div>

                {/**
                <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "40px",
                    marginRight: "65px",
                    borderRadius: 100,
                  }}
                >
                  <strong>Parawise Respone </strong>
                </div>

                 <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
                      <DataGrid
                        getRowId={(row) => row.srNo}
                        density="compact"
                        autoHeight={true}
                        pagination
                        paginationMode="server"
                        rows={
                          concerDeptList == [] || concerDeptList == undefined || concerDeptList == ""
                            ? []
                            : concerDeptList
                        }
                        columns={_col}
                        onPageChange={(_data) => {}}
                        onPageSizeChange={(_data) => {}}
                      />
                    </Grid>
                */}

                <Stack
                  direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
                  spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                  justifyContent="center"
                  alignItems="center"
                  marginTop="5"
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    //onClick={() => submitParaWiseReport()}
                    sx={{ backgroundColor: "#00A65A" }}
                    name="Approve"
                    endIcon={<TaskAltIcon />}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpen("Reassign")}
                    sx={{ backgroundColor: "#00A65A" }}
                    name="Reassign"
                    endIcon={<UndoIcon />}
                  >
                    Reassign
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ backgroundColor: "#DD4B39" }}
                    endIcon={<CloseIcon />}
                    onClick={() => {
                      router.push("/LegalCase/transaction/newNotice");
                    }}
                  >
                    Exit
                  </Button>
                </Stack>

                {/** Modal */}
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <form onSubmit={handleSubmit(onFinish)}>
                    <Box sx={style}>
                      <Box sx={{ padding: "10px" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Enter Remark
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          {...register("remark")}
                          label={<FormattedLabel id="enterRemarkEn" />}
                        />
                      </Box>

                      {/* remarks in Marathi */}
                      <Box
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {/* remarks in Marathi */}
                        <TextField
                          fullWidth
                          size="small"
                          {...register("remarkMr")}
                          label={<FormattedLabel id="enterRemarkMr" />}
                        />
                      </Box>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          padding: "10px",
                        }}
                      >
                        <Button variant="contained" size="small" type="submit">
                          Submit
                        </Button>
                        <Button variant="contained" size="small" onClick={handleClose}>
                          CANCEL
                        </Button>
                      </Box>
                    </Box>
                  </form>
                </Modal>
              </>
            )}
          </Paper>
        </form>
      </FormProvider>
    </>
  );
};

export default ResponseToNotice;
