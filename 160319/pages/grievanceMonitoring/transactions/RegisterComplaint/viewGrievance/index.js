import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  LinearProgress,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import styles from "../../../../../components/grievanceMonitoring/view.module.css";
import theme from "../../../../../theme";
import { TimePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadButtonOP from "../../../../../components/grievanceMonitoring/DocumentUploadButtonGrievance";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DownloadIcon from "@mui/icons-material/Download";
import Document from "../../../../../pages/grievanceMonitoring/uploadDocuments/Documents";
import {
  addQueryDataToLocalStorage,
  getDocumentFromLocalStorage,
  getDocumentFromLocalStorageForSendingTheData,
  removeDocumentToLocalStorage,
} from "../../../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import Schema from "../../../../../containers/schema/grievanceMonitoring/TransactionsSchema's/viewGrievance";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा");
  const [buttonInputState, setButtonInputState] = useState();
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [comittees1, setcomittees1] = useState([]);
  const [lockFields, setLockFields] = useState(true);
  const [showSaveButton, setshowSaveButton] = useState(true);
  const [attachment, setAttachment] = useState("");
  const [fullName, setFullName] = useState(null);

  const router = useRouter();

  console.log(".........router", router.query.id);

  const user = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.userDao?.id);
    return state?.user?.user?.userDao?.id;
  });

  const logedInUser = localStorage.getItem("loggedInUser");
  console.log(":78", logedInUser);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
    getAllAmenities();
  }, []);

  // Get Table - Data
  const getAllAmenities = (_pageSize = 10, _pageNo = 0) => {
    axios.get(`${urls.GM}/trnRegisterComplaint/getComplaintById?id=${router.query.id}`).then((res) => {
      let result = res?.data;
      console.log("42", result.id);
      setValue("grievanceRaiseDate", result.grievanceDate);
      setValue("grievanceId", result.id);
      setValue("complaintStatusText", result.complaintStatusText);
      setValue("board", result.location);
      setValue("subject", result.subject);
      setValue("complaintDescription", result.complaintDescription);
      setValue("complaintType", result.complaintType);
      setValue("deptName", result.deptName);
      setValue("subDepartmentText", result.subDepartmentText);
      setFullName(result.firstName + " " + result.middleName + " " + result.surname);
      // let _res = result?.map((val) => {
      //   setValue("grievanceRaiseDate", val.grievanceDate)
      //   console.log(":3", val.grievanceDate)
      //   return {
      //     activeFlag: val.activeFlag,
      //     id: val.id,
      //     srNo: i + 1,
      //     grievanceDate: val.grievanceDate,
      //     complaintStatus: val.complaintStatus,
      //     meetingPlace: val.meetingPlace,
      //     remark: val.description,
      //   }
      // })
      // setData({
      //   rows: _res,
      //   totalRows: res.data.totalElements,
      //   rowsPerPageOptions: [10, 20, 50, 100],
      //   pageSize: res.data.pageSize,
      //   page: res.data.pageNo,
      // })
      // return _res
    });
  };

  console.log("data1", data);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // Save - DB
    // alert("Clicked...")
    console.log("form Data", formData);
    const finalBodyForApi = {
      id: watch("grievanceId"),
      remark: watch("reply"),
      trnAttacheDocumentDtos: getDocumentFromLocalStorageForSendingTheData("GrievanceRelatedDocuments")
        ? getDocumentFromLocalStorageForSendingTheData("GrievanceRelatedDocuments")
        : "",
    };

    console.log("420", finalBodyForApi);
    sweetAlert({
      title: "Are you sure?",
      text: "Do you want to close this grievance?",
      icon: "warning",
      buttons: ["Cancle", "Yes"],
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .post(`${urls.GM}/trnRegisterComplaint/closeComplaint`, finalBodyForApi)
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert("Closed!", "Grievance Closed successfully !", "success").then((will) => {
                console.log(":lk", will);
                if (will) {
                  reset({
                    grievanceId: "",
                    grievanceRaiseDate: "",
                    currentStatus: "",
                    board: "",
                    subject: "",
                    complaintDescription: "",
                    reply: "",
                  });
                  removeDocumentToLocalStorage("GrievanceRelatedDocuments");
                  {
                    logedInUser === "departmentUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
                      });
                  }
                  {
                    logedInUser === "citizenUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/citizenUserDashboard",
                      });
                  }
                  {
                    logedInUser === "cfcUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
                      });
                  }
                } else {
                  reset({
                    grievanceId: "",
                    grievanceRaiseDate: "",
                    currentStatus: "",
                    board: "",
                    subject: "",
                    complaintDescription: "",
                    reply: "",
                  });
                  removeDocumentToLocalStorage("GrievanceRelatedDocuments");
                  {
                    logedInUser === "departmentUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
                      });
                  }
                  {
                    logedInUser === "citizenUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/citizenUserDashboard",
                      });
                  }
                  {
                    logedInUser === "cfcUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
                      });
                  }
                }
              });
            }
          })
          .catch((error) => {
            if (error.request.status === 500) {
              swal(error.response.data.message, {
                icon: "error",
              });

              setButtonInputState(false);
            } else {
              swal("Something went wrong!", {
                icon: "error",
              });

              setButtonInputState(false);
            }
            // console.log("error", error);
          });
      } else {
        sweetAlert("Your Grievance is not Closed");
      }
    });
  };

  const handleReopenButton = () => {
    // Save - DB
    // alert("Clicked...")
    const finalBodyForApi = {
      id: watch("grievanceId"),
      remark: watch("reply"),
      trnAttacheDocumentDtos: getDocumentFromLocalStorageForSendingTheData("GrievanceRelatedDocuments")
        ? getDocumentFromLocalStorageForSendingTheData("GrievanceRelatedDocuments")
        : "",
    };

    console.log("420", finalBodyForApi);
    sweetAlert({
      title: "Are you sure?",
      text: "Do you want to Re-open this grievance?",
      icon: "warning",
      buttons: ["Cancle", "Yes"],
      dangerMode: true,
      closeOnClickOutside: false,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .post(`${urls.GM}/trnRegisterComplaint/reopenComplaint`, finalBodyForApi)
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert("Re-Opened!", "Grievance Re-Opened successfully !", "success").then((will) => {
                console.log(":lk", will);
                if (will) {
                  reset({
                    grievanceId: "",
                    grievanceRaiseDate: "",
                    currentStatus: "",
                    board: "",
                    subject: "",
                    complaintDescription: "",
                    reply: "",
                  });
                  removeDocumentToLocalStorage("GrievanceRelatedDocuments");
                  {
                    logedInUser === "departmentUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
                      });
                  }
                  {
                    logedInUser === "citizenUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/citizenUserDashboard",
                      });
                  }
                  {
                    logedInUser === "cfcUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
                      });
                  }
                } else {
                  reset({
                    grievanceId: "",
                    grievanceRaiseDate: "",
                    currentStatus: "",
                    board: "",
                    subject: "",
                    complaintDescription: "",
                    reply: "",
                  });
                  removeDocumentToLocalStorage("GrievanceRelatedDocuments");
                  {
                    logedInUser === "departmentUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
                      });
                  }
                  {
                    logedInUser === "citizenUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/citizenUserDashboard",
                      });
                  }
                  {
                    logedInUser === "cfcUser" &&
                      router.push({
                        pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
                      });
                  }
                }
              });
            }
          })
          .catch((error) => {
            if (error.request.status === 500) {
              swal(error.response.data.message, {
                icon: "error",
              });

              setButtonInputState(false);
            } else {
              swal("Something went wrong!", {
                icon: "error",
              });

              setButtonInputState(false);
            }
            // console.log("error", error);
          });
      } else {
        sweetAlert("Your Grievance is not Closed");
      }
    });
  };

  const handleClosureButton = () => {
    sweetAlert({
      title: "Are you sure?",
      text: "If you clicked yes your grievance get close otherwise not!",
      icon: "warning",
      buttons: ["Cancle", "Yes"],
      dangerMode: false,
    }).then((willDelete) => {
      if (willDelete) {
        sweetAlert("Your Grievance is colsed");
      } else {
        sweetAlert("Your Action is Retrieved");
      }
    });
  };

  const handleDocumentButton = (e) => {
    console.log(":41", e);
    sweetAlert({
      title: "Are you sure?",
      text: "If you clicked yes you can upload your Documents otherwise not!",
      icon: "warning",
      buttons: ["Cancle", "Yes"],
      dangerMode: false,
    }).then((willDelete) => {
      if (willDelete) {
        sweetAlert("Your Documents is uploaded");
      } else {
        sweetAlert("Your Action is Retrieved");
      }
    });
  };
  ///////////////////////////// SENDING TO DOWNLOAD ////////////////////////////
  let dataObject = null;

  useEffect(() => {
    if (
      watch("grievanceRaiseDate")
      // watch("grievanceId") &&
      // watch("complaintStatusText") &&
      // watch("deptName") &&
      // watch("subDepartmentText") &&
      // watch("complaintType") &&
      // watch("subject") &&
      // watch("complaintDescription") &&
      // fullName
    ) {
      dataObject = {
        grievanceRaiseDate: watch("grievanceRaiseDate") ? watch("grievanceRaiseDate") : "",
        grievanceId: watch("grievanceId") ? watch("grievanceId") : "",
        complaintStatusText: watch("complaintStatusText") ? watch("complaintStatusText") : "",
        deptName: watch("deptName") ? watch("deptName") : "",
        subDepartmentText: watch("subDepartmentText") ? watch("subDepartmentText") : "",
        complaintType: watch("complaintType") ? watch("complaintType") : "",
        subject: watch("subject") ? watch("subject") : "",
        complaintDescription: watch("complaintDescription") ? watch("complaintDescription") : "",
        complaintRaisedBy: fullName !== null ? fullName : "",
      };
    }
  }, [
    watch("grievanceRaiseDate"),
    watch("grievanceId"),
    watch("complaintStatusText"),
    watch("deptName"),
    watch("subDepartmentText"),
    watch("complaintType"),
    watch("subject"),
    watch("complaintDescription"),
    fullName,
  ]);

  // Row

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "99%",
                height: "auto",
                overflow: "auto",
                padding: "0.5%",
                color: "black",
                fontSize: 15,
                fontWeight: 400,
                // borderRadius: 100,
              }}
            >
              <strong>
                <FormattedLabel id="viewGrievance" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          <div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl style={{ backgroundColor: "white" }} error={!!errors.grievanceRaiseDate}>
                    <Controller
                      control={control}
                      name="grievanceRaiseDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="grievanceRaiseDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                InputLabelProps={
                                  {
                                    // style: {
                                    //   fontSize: 12,
                                    //   marginTop: 3,
                                    // },
                                  }
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.grievanceRaiseDate ? errors.grievanceRaiseDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    InputLabelProps={{
                      shrink: watch("grievanceId") ? true : false,
                    }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label={<FormattedLabel id="grievanceId" />}
                    variant="standard"
                    {...register("grievanceId")}
                    // error={!!errors.committeeId}
                    // helperText={
                    //   errors?.committeeId ? errors.committeeId.message : null
                    // }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    InputLabelProps={{
                      shrink: watch("complaintStatusText") ? true : false,
                    }}
                    label={<FormattedLabel id="complaintStatusText" />}
                    {...register("complaintStatusText")}
                  />
                </Grid>

                {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label="Board"
                    InputLabelProps={{ shrink: watch("board") ? true : false }}
                    variant="standard"
                    {...register("board")}
                    // error={!!errors.meetingPlace}
                    // helperText={
                    //   errors?.meetingPlace ? errors.meetingPlace.message : null
                    // }
                  />
                </Grid> */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="departmentName" />}
                    InputLabelProps={{
                      shrink: watch("deptName") ? true : false,
                    }}
                    variant="standard"
                    {...register("deptName")}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="subDepartmentName" />}
                    InputLabelProps={{
                      shrink: watch("subDepartmentText") ? true : false,
                    }}
                    variant="standard"
                    {...register("subDepartmentText")}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="complaintType" />}
                    InputLabelProps={{
                      shrink: watch("complaintType") ? true : false,
                    }}
                    variant="standard"
                    {...register("complaintType")}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    InputLabelProps={{
                      shrink: watch("subject") ? true : false,
                    }}
                    sx={{ width: "88%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="subjects" />}
                    variant="standard"
                    {...register("subject")}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled
                    label={<FormattedLabel id="complaintDescription" />}
                    multiline
                    // minRows={2}
                    // maxRows={2}
                    // style={{ resize: "vertical", overflow: "auto" }}
                    sx={{ width: "88%" }}
                    // maxlength="50"
                    InputLabelProps={{
                      shrink: watch("complaintDescription") ? true : false,
                    }}
                    id="standard-basic"
                    // label="Complaint Description"
                    variant="standard"
                    {...register("complaintDescription")}
                  />
                </Grid>

                {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // sx={{ marginRight: 8 }}
                    type="button"
                    variant="contained"
                    color="error"
                    endIcon={<CloseIcon />}
                    style={{ borderRadius: "20px" }}
                    size="small"
                    onClick={handleClosureButton}
                  >
                   
               Close Grievance
                  </Button>
                </Grid>   */}
              </Grid>
              {watch("complaintStatusText") === "Close" && (
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "60%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="reply" />}
                      variant="standard"
                      {...register("reply")}
                    />
                  </Grid>
                </Grid>
              )}

              {/* ................................... */}
              {logedInUser === "departmentUser" && watch("complaintStatusText") === "Open" && (
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "60%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="reply" />}
                      variant="standard"
                      {...register("reply")}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ width: "88%" }}>
                      <Document />
                    </Box>
                  </Grid>
                </Grid>
              )}
              {/* ........................................... */}

              {watch("complaintStatusText") === "Close" && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: "88%" }}>
                    <Document />
                  </Box>
                </Grid>
              )}

              {/* /////////////////////////////////// */}

              {/* //////////////////////////////////////////////////////// */}

              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // sx={{ marginRight: 8 }}
                    type="button"
                    variant="contained"
                    color="primary"
                    endIcon={<CloudUploadIcon />}
                    style={{ borderRadius: "20px" }}
                    size="small"
                    onClick={handleDocumentButton}
                  >
                    {/* {language === "en" ? btnSaveText : btnSaveTextMr} */}
                {/* Upload Document
                  </Button> */}
                {/* </Grid>  */}

                {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "2%",
                    paddingBottom: "1%",
                  }}
                >
                  {/* <div> */}
                {/* <Typography> Upload Image/Document</Typography> */}
                {/* <UploadButtonOP
                    appName="RaiseGrivance"
                    serviceName="PARTMAP"
                    // fileDtl={getValues('gageProofDocument')}
                    // fileKey={'gageProofDocument'}
                    // showDel={pageMode ? false : true}
                    label="Upload Image/Document"
                    filePath={attachment}
                    fileUpdater={setAttachment}
                  /> */}
                {/* </div> */}
                {/* </Grid> */}
              </Grid>
              {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // sx={{ marginRight: 8 }}
                    // disabled={showSaveButton}
                    type="submit"
                    variant="contained"
                    color="error"
                    endIcon={<CloseIcon />}
                    style={{ borderRadius: "20px" }}
                    size="small"
                  >
                    Close Grievance
                  </Button>
                </Grid> */}

                {/* ........................................ */}
                <Grid
                  item
                  xs={12}
                  sm={3}
                  md={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // sx={{ marginRight: 8 }}
                    // disabled={showSaveButton}
                    type="button"
                    variant="contained"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    style={{ borderRadius: "20px" }}
                    size="small"
                    onClick={() => {
                      // router.push({
                      //   pathname: "/grievanceMonitoring/dashboard",
                      // })
                      {
                        logedInUser === "departmentUser" &&
                          router.push({
                            pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
                          });
                      }
                      {
                        logedInUser === "citizenUser" &&
                          router.push({
                            pathname: "/grievanceMonitoring/dashboards/citizenUserDashboard",
                          });
                      }
                      {
                        logedInUser === "cfcUser" &&
                          router.push({
                            pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
                          });
                      }
                    }}
                  >
                    <FormattedLabel id="backToDashboard" />
                  </Button>
                </Grid>
                {/* ................Conditionals.................. */}
                {logedInUser === "departmentUser" && watch("complaintStatusText") === "Open" && (
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      // sx={{ marginRight: 8 }}
                      // disabled={showSaveButton}
                      type="submit"
                      variant="contained"
                      color="primary"
                      endIcon={<CloseIcon />}
                      style={{ borderRadius: "20px" }}
                      size="small"
                    >
                      <FormattedLabel id="closeGrievance" />
                    </Button>
                  </Grid>
                )}

                {/* ................Conditionals.................. */}

                {watch("complaintStatusText") === "Close" ? (
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      endIcon={<LockOpenIcon />}
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={handleReopenButton}
                    >
                      {/* <FormattedLabel id="reOpen" /> */}
                      {language === "en" ? "RE-OPEN" : "पुन्हा उघडा"}
                    </Button>
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      // sx={{ marginRight: 8 }}
                      // disabled={showSaveButton}
                      type="button"
                      variant="contained"
                      color="primary"
                      endIcon={<DownloadIcon />}
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => {
                        dataObject !== null &&
                          router.push(
                            {
                              pathname:
                                "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance/downloadAcknowledgement",
                              query: {
                                // dataForDownload: JSON.stringify(dataObject),
                                dataForDownload: addQueryDataToLocalStorage("QueryParamsData", dataObject),
                              },
                            },
                            "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance/downloadAcknowledgement",
                          );
                      }}
                    >
                      {/* <FormattedLabel id="downloadAcknowledgement" /> */}
                      {language === "en" ? "Download Acknowledgement" : "पावती डाउनलोड करा"}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  );
};
export default Index;
