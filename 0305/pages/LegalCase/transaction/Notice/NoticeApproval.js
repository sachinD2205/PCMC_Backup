import { Visibility } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import FileTable from "../../FileUpload/FileTableLcWithoutAddButton";

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

//
const NoticeApproval = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(noticeSchema),
  });
  const handleClose = () => setOpen(false);
  const router = useRouter();
  const [rowsData, setRowsData] = useState([]);
  const noticeData = useSelector((state) => state.user.selectedNotice);
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [approveRejectRemarkMode, setApproveRejectRemarkMode] = useState("");
  const handleOpen = (approveRejectRemarkMode) => {
    setOpen(true);
    setApproveRejectRemarkMode(approveRejectRemarkMode);
  };
  const [departments, setDepartments] = useState([]);
  const [_departmentList, _setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  // const [noticeData, setNoticeData] = useState();
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state.labels.language);
  const [userData, setUserData] = useState();
  // columns - attachment
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

  // columns -- Remark History
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
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remarks" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  // concerDept
  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      // field: "locationName",
      field: language === "en" ? "locationNameEn" : "locationNameMr",

      // locationNameMar
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      // field: "departmentId",
      // departmentNameMr
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",

      headerName: <FormattedLabel id="subDepartment" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
  ];

  // userName
  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setEmployeeList(r.data.user);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // designation Name
  const getDesignationName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/designation/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setDesignationList(r.data.designation);
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

  // department Name
  const getDepartmentName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setDepartments(r.data.department);
          _setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // submit
  const onFinish = (data) => {
    let bodyForApiApproveTrnNoticeByLegalHod;
    if (approveRejectRemarkMode == "Reassign") {
      bodyForApiApproveTrnNoticeByLegalHod = {
        id: noticeData?.id,
        // hodRejectionRemark: data?.remark,
        // hodRejectionRemarkMr: data?.remarkMr,
        hodRejectionRemark: data?.remark,
       
        hodRejectionRemarkMr: data?.remarkMr,
      };
    }
    if (approveRejectRemarkMode == "Approve") {
      bodyForApiApproveTrnNoticeByLegalHod = {
        id: noticeData?.id,
        hodApprovalRemark: data?.remark,
        hodApprovalRemarkMr: data?.remarkMr,


        // hodRejectionRemark: data?.remark,
        // hodRejectionRemarkMr: data?.remarkMr,
      };
    } else {
      bodyForApiApproveTrnNoticeByLegalHod = {
        id: noticeData?.id,
        // hodApprovalRemark: data?.remark,
        // hodApprovalRemarkMr: data?.remarkMr,


        hodRejectionRemark: data?.remark,
        hodRejectionRemarkMr: data?.remarkMr,
      };
    }

    // const bodyForApiApproveTrnNoticeByLegalHod = {
    //   id: noticeData?.id,
    //   hodApprovalRemark: data?.remark,
    //   hodApprovalRemarkMr: data?.remarkMr,
    // };

    console.log("bodyForApiApproveTrnNoticeByLegalHod", bodyForApiApproveTrnNoticeByLegalHod);
if(approveRejectRemarkMode == "Reassign"){


  axios
  .post(`${urls.LCMSURL}/notice/reassignTrnNoticeByLegalHod`, bodyForApiApproveTrnNoticeByLegalHod, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    console.log("resDetails", res);
    if (res.status == 201 || res.status == 200) {
      sweetAlert("Saved!", "notice send successfully !", "success");
      router.push(`/LegalCase/transaction/newNotice`);
    } else {
      console.log("Login Failed ! Please Try Again !");
    }
  })
  .catch((err) => {
    console.log("455454", err);
    toast("Failed ! Please Try Again !", {
      type: "error",
    });
  });
}

else{
   axios
      .post(`${urls.LCMSURL}/notice/approveTrnNoticeByLegalHod`, bodyForApiApproveTrnNoticeByLegalHod, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("resDetails", res);
        if (res.status == 201 || res.status == 200) {
          sweetAlert("Saved!", "notice send successfully !", "success");
          router.push(`/LegalCase/transaction/newNotice`);
        } else {
          console.log("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log("455454", err);
        toast("Failed ! Please Try Again !", {
          type: "error",
        });
      });

}




   
  };

  useEffect(() => {
    getDepartmentName();
    getOfficeLocation();
    getDesignationName();
    getUserName();
    // setNoticeData(selectedNotice);
    setUserData(user);
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log("noticeData", noticeData);
    setValue("noticeRecivedDate", noticeData?.noticeRecivedDate);
    setValue("noticeDate", noticeData?.noticeDate);
    setValue("noticeRecivedFromAdvocatePerson", noticeData?.noticeRecivedFromAdvocatePerson);
    setValue("requisitionDate", noticeData?.requisitionDate);
    setValue("noticeRecivedFromAdvocatePerson", noticeData?.noticeReceivedFromAdvocatePerson);
    setValue("noticeRecivedFromAdvocatePersonMr", noticeData?.noticeReceivedFromAdvocatePersonMr);
    setValue("noticeDetails", noticeData?.noticeDetails);
    setValue("inwardNo", noticeData?.inwardNo);

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

    setRowsData(_ress);
  }, [officeLocationList, departments, noticeData, user]);

  useEffect(() => {
    const noticeAttachment = [...noticeData.noticeAttachment];
    const noticeHisotry = [...noticeData.noticeHisotry];
    if (employeeList.length > 0 && departments.length > 0) {
      setLoading(false);
      let _noticeAttachment = noticeAttachment.map((file, index) => {
        console.log("23", file);
        return {
          id: file.id,
          srNo: file.id,
          originalFileName: file.originalFileName ? file.originalFileName : "Not Available",
          extension: file.extension ? file.extension : "Not Available",
          attachedNameEn: file.attachedNameEn ? file.attachedNameEn : "Not Available",
          attachedNameMr: file.attachedNameMr ? file.attachedNameMr : "Not Available",
          filePath: file.filePath ? file.filePath : "-",
        };
      });

      let _noticeHisotry = noticeHisotry.map((file, index) => {
        console.log("24", departments, file);
        return {
          id: index,
          srNo: index + 1,
          remark: file.remark ? file.remark : "-",
          designation: file.designation ? file.designation : "Not Available",

          noticeRecivedFromPerson: employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)
            ?.firstNameEn
            ? employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)?.firstNameEn
            : "-",
          department: departments?.find((obj) => obj.id === file.noticeRecivedFromPerson)?.department,
          noticeSentDate: file.noticeSentDate ? file.noticeSentDate : "-",
        };
      });
      _noticeAttachment !== null && setMainFiles([..._noticeAttachment]);
      _noticeHisotry !== null && setDataSource([..._noticeHisotry]);
    }
  }, [employeeList, departments]);

  useEffect(() => {
    console.log("Language bol: ", language);
    console.log("Files:", mainFiles, additionalFiles);
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {}, [approveRejectRemarkMode]);

  // view
  return (
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

          <div style={{ marginBottom: "5vh" }}>
            <ThemeProvider theme={theme}>
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
                                helperText={errors?.requisitionDate ? errors?.requisitionDate.message : null}
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
                <strong>Concerned Department List</strong>
              </div>

              <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
                <DataGrid
                  getRowId={(row) => row.srNo}
                  density="compact"
                  autoHeight={true}
                  pagination
                  paginationMode="server"
                  rows={rowsData}
                  columns={_col}
                  onPageChange={(_data) => {}}
                  onPageSizeChange={(_data) => {}}
                />
              </Grid>
            </ThemeProvider>
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
                  rows={dataSource}
                  columns={_columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  //checkboxSelection
                />
              </Grid>
            </Grid>
          </div>
          */}

          <Stack
            direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
            spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
            justifyContent="center"
            alignItems="center"
            marginTop="5"
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpen("Approve")}
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
  );
};

export default NoticeApproval;
