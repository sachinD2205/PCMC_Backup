import { yupResolver } from "@hookform/resolvers/yup";
import { Delete, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { default as swal, default as sweetAlert } from "sweetalert";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/LegalCase_Styles/view.module.css";
import urls from "../../../../../URLS/urls";
// import parawiseReportForClerk from "../../../../containers/schema/LegalCaseSchema/courtCaseEntrySchema";

// import SelectOfficeDepartments from "./SelectOfficeDepartments";
// import FooterButtons from "./FooterButtons";
import { DataGrid } from "@mui/x-data-grid";
// import { parawiseReportForClerk } from "../../../../../containers/schema/LegalCaseSchema/courtCaseEntrySchema";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const View = () => {
  const {
    register,
    control,
    handleSubmit,
    // @ts-ignore
    methods,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(parawiseReportForClerk),
    mode: "onChange",
    defaultValues: "",
  });

  //   const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
  //     name: "concernDeptUser",
  //     rules: {
  //       required: true,
  //       message: "At least one is required",
  //     },
  //     control,
  //   });

  const router = useRouter();
  const [parawiseDetails, setParawiseDetails] = useState({});
  const [departments, setDepartments] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [faltugiri, setfaltugiri] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [personName, setPersonName] = useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [courtCaseEntries, setCourtCaseEntries] = useState([]);
  const [noticeNumber, setNoticeNumber] = useState();
  const [officeLocationWiseDepartment, setOfficeLocationWiseDepartment] = useState([]);
  const [departmentWiseEmployee, setDepartmentWiseEmployee] = useState([]);
  const [officeDepartmentDesignationUser, setOfficeDepartmentDesignationUser] = useState(null);
  const [_arr, setArr] = useState([]);
  const selectedNotice = useSelector((state) => {
    return state.user.selectedNotice;
  });
  const [rowsData, setRowsData] = useState([]);

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

  const steps = [
    <FormattedLabel key={1} id="parawiseReport" />,
    // <FormattedLabel key={2} id="documentUpload" />,
  ];

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const newCompleted = completed;
    newCompleted[activeStep - 1] = false;
    setCompleted(newCompleted);
  };

  const handleExit = () => {
    router.push(`/LegalCase/transaction/newCourtCaseEntry`);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      console.log("2313", res);
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
          departmentMr: r.departmentMr,
          departmentMr: r.departmentMr,
        })),
      );
    });
  };

  const onSubmitForm = (data) => {
    // console.log("Form dataaaa", data.parawiseReportRemarkClerk);
    let _body = {
      id: router.query.id,
      parawiseReportRemarkClerk: data.parawiseReportRemarkClerk,
      parawiseReportRemarkClerkMr: data.parawiseReportRemarkClerkMr,
      departmentList: _arr?.map((val, index) => ({
        id: val?.departmentId,
        department: departments?.find((obj) => obj?.id === val.departmentId)?.department,
      })),
      casetatus: "PARAWISE_REPORT_DEPARTMENT_ASSIGNED_AND_SENT_TO_HOD",
    };
    console.log("_body", _body);

    axios
      .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/parawiseReportAssignDepartmentsByClerk`, _body, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .then((res) => {
        console.log("clerK_res", res);
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        }
      });
  };

  function goToNewCourtCaseEntry() {
    router.push(`/LegalCase/transaction/newCourtCaseEntry`);
  }
  const handleDeleteDpt = (props) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let updatedArray = rowsData.filter((obj) => obj.id !== props.id);
        setRowsData(updatedArray);
      } else {
        swal("File is Safe");
      }
    });
  };

  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      // field: "departmentName",
      // departmentNameMr
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",

      headerName: <FormattedLabel id="deptName" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="action" />,
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            {/** deleteButton */}
            {rowsData && (
              <IconButton color="error" onClick={() => handleDeleteDpt(record.row)}>
                <Delete />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];



  useEffect(() => {
    // getOfficeDepartmentDesignationUser();
    console.log("router.query", router.query);
    setValue("courtCaseNumber", router.query.caseNumber);
    setValue("fillingDate", router.query.fillingDate);
  }, []);

  useEffect(() => {
    console.log("departmentName15151", watch("locationName"));
  }, [watch("locationName")]);

  // useEffect(() => {
  //   if (router?.query?.pageMode === 'Edit') {
  //     setAttachedFile(router?.query?.attachedFile)
  //   }
  // }, [])

  // useEffect(() => {
  //   console.log("Table_rowsData", rowsData);
  // }, [rowsData]);

  useEffect(() => {
    getDepartments();
    if (router.query.pageMode === "Edit") {
      // reset(router.query);
      reset(selectedNotice);
      append({
        departmentName: "",
      });
      // attachedFileEdit = router.query.attachedFile
    }
  }, [officeLocationList]);

  // useEffect(() => {
  //   setValue('attachedFile', attachedFile)
  // }, [attachedFile])

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className={styles.small}>
            <Paper
              sx={{
                marginY: "10px",
                paddingY: "10px",
              }}
            >
              <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={index} completed={completed[index]}>
                    <StepButton color="inherit" onClick={handleStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>

              <br></br>
              <Box>
                {allStepsCompleted() ? (
                  goToNewCourtCaseEntry()
                ) : (
                  <>
                    <Box>
                      {activeStep === 0 && (
                        <>
                          {/* Form Header */}
                          <Box
                            style={{
                              display: "flex",
                              // justifyContent: "center",
                              // marginLeft:'50px',
                              paddingTop: "10px",
                              // marginTop: "20px",

                              background:
                                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                            }}
                          >
                           

                            <Typography
                              style={{
                                display: "flex",
                                marginLeft: "30px",
                                color: "white",
                                float: "left",
                                // justifyContent: "center",
                              }}
                            >
                              <h2>
                                <FormattedLabel id="parawiseReport" />
                              </h2>
                            </Typography>
                          </Box>

                          {/* 1st Row */}
                          <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
                            {/* courtCaseNumber Number */}
                            <Grid
                              item
                              xs={12}
                              sm={8}
                              md={6}
                              lg={4}
                              xl={2}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                fullWidth
                                sx={{ width: "90%" }}
                                autoFocus
                                disabled
                                id="standard-basic"
                                InputLabelProps={{ shrink: true }}
                                label={<FormattedLabel id="courtCaseNumber" />}
                                variant="standard"
                                {...register("courtCaseNumber")}
                              />
                            </Grid>

                            {/* Case Date */}
                            <Grid
                              item
                              xs={12}
                              sm={8}
                              md={6}
                              lg={4}
                              xl={2}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <FormControl fullWidth sx={{ width: "90%" }}>
                                <Controller
                                  control={control}
                                  name="fillingDate"
                                  defaultValue={null}
                                  render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                      <DatePicker
                                        inputFormat="DD/MM/YYYY"
                                        disabled
                                        label={
                                          <span style={{ fontSize: 16 }}>
                                            <FormattedLabel id="caseDate" />
                                          </span>
                                        }
                                        value={field.value}
                                        onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                        renderInput={(params) => (
                                          <TextField {...params} variant="standard" size="small" />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  )}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>

                          {/* 2nd row */}
                          <Grid container sx={{ padding: "10px" }}>
                            {/* remarks in English */}
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                multiline
                                fullWidth
                                sx={{ width: "97%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="remarksEn" />}
                                // label="Advocate Address (In English)"

                                variant="standard"
                                {...register("parawiseReportRemarkClerk")}
                                error={!!errors.parawiseReportRemarkClerk}
                                helperText={errors?.parawiseReportRemarkClerk ? errors.parawiseReportRemarkClerk.message : null}
                              />
                            </Grid>

                            {/* remarksMr in Marathi */}
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "10px",
                              }}
                            >
                              <TextField
                                multiline
                                fullWidth
                                sx={{ width: "97%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="remarksMr" />}
                                // label="Advocate Address (In Marathi)"
                                variant="standard"
                                {...register("parawiseReportRemarkClerkMr")}
                                error={!!errors.parawiseReportRemarkClerkMr}
                                helperText={errors?.parawiseReportRemarkClerkMr ? errors.parawiseReportRemarkClerkMr.message : null}
                              />
                            </Grid>
                          </Grid>

                          {/* dept names and table */}
                          <Grid
                            container
                            sx={{ my: "25px" }}
                            // style={{
                            //   display: "flex",
                            //   justifyContent: "center",
                            // }}
                          >
                            {/*  Department name */}
                            <Grid
                              item
                              xs={8}
                              sm={5}
                              md={5}
                              lg={5}
                              xl={5}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <FormControl
                                fullWidth
                                size="small"
                                sx={{ width: "90%" }}
                                error={
                                  rowsData.length === 0 &&
                                  !!errors.department
                                }
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="deptName" />
                                </InputLabel>

                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label={<FormattedLabel id="deptName" />}
                                      value={field.value}
                                      // onChange={(value) => field.onChange(value)}
                                      onChange={(value) => {
                                        field.onChange(value);
                                        // setSelectedDepartment(
                                        //   value.target.value
                                        // );
                                      }}
                                      style={{ backgroundColor: "white" }}
                                    >
                                      {departments.length > 0
                                        ? departments.map((dept, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={dept.id}
                                                style={{
                                                  display: dept.department ? "flex" : "none",
                                                }}
                                              >
                                                {/* {user.department} */}

                                                {language == "en" ? dept?.department : dept?.departmentMr}
                                              </MenuItem>
                                            );
                                          })
                                        : []}
                                    </Select>
                                  )}
                                  name="departmentName"
                                  // name="department"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText style={{ color: "red" }}>
                                  {rowsData.length === 0 &&
                                    (errors?.departmentName ? errors.departmentName.message : null)}
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            {/* Add More Button */}
                            <Grid
                              item
                              xs={2}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                disabled={typeof watch("departmentName") == "string"}
                                variant="contained"
                                size="small"
                                onClick={(e, index) => {
                                  let obj = {
                                    departmentId: watch("departmentName"),
                                    // locationId: watch("locationName"),
                                    // empoyeeId: null,
                                    index: index,
                                  };

                                  let temp;

                                  if (_arr.length > 0) {
                                    setArr([..._arr, obj]);
                                    temp = [..._arr, obj];
                                  } else {
                                    setArr([obj]);
                                    temp = [obj];
                                  }

                                  let _res =
                                    temp?.length > 0 &&
                                    temp?.map((val, i) => {
                                      return {
                                        srNo: i + 1,
                                        id: i,
                                        departmentNameEn: departments?.find(
                                          (obj) => obj?.id === val.departmentId,
                                        )?.department,

                                        departmentNameMr: departments?.find(
                                          (obj) => obj?.id === val.departmentId,
                                        )?.departmentMr,

                                        departmentId: val?.departmentId,
                                      };
                                    });

                                  console.log("Table_res", _res);
                                  setRowsData(_res);

                                  setValue("departmentName", null);
                                }}
                              >
                                <FormattedLabel id="addMore" />
                              </Button>
                            </Grid>
                          </Grid>

                          <Grid container sx={{ padding: "10px" }}>
                            <DataGrid
                              sx={{
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
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Button color="primary" variant="contained" size="small" onClick={handleExit}>
                                <FormattedLabel id="exit" />
                              </Button>
                            </Grid>
                            <Grid item xs={9}>
                              <Button
                                color="primary"
                                variant="contained"
                                onClick={handleBack}
                                disabled={activeStep == 0}
                                sx={{ mr: 1 }}
                                size="small"
                              >
                                <FormattedLabel id="back" />
                              </Button>
                            </Grid>
                            <Grid
                              item
                              xs={2}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {/* {activeStep !== steps.length && (
                                <Button color="primary" variant="contained" type="submit" size="small">
                                  <FormattedLabel id="saveAndNext" />
                                </Button>
                              )} */}
                              <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                // onClick={finalSubmit}
                                type="submit"
                                name="buttonname"
                                value="hiddenvalue"
                              >
                                <FormattedLabel id="save" />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Box>
                    <Box>
                      {/* this step only for docs upload */}
                      {/* {activeStep === 1 && (
                        <>
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
                          <div
                            className={styles.box}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Grid container sx={{ padding: "10px" }}>
                              <Grid item xs={1}>
                                <Button color="primary" variant="contained" size="small" onClick={handleExit}>
                                  <FormattedLabel id="exit" />
                                </Button>
                              </Grid>
                              <Grid item xs={1}>
                                <Button color="primary" variant="contained" onClick={handleBack} size="small">
                                  <FormattedLabel id="back" />
                                </Button>
                              </Grid>
                              <Grid item xs={7}></Grid>
                              <Grid
                                item
                                xs={2}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {activeStep !== steps.length && (
                                  <Box>
                                    <Button
                                      color="primary"
                                      variant="contained"
                                      onClick={finalSubmit}
                                      size="small"
                                    >
                                      <FormattedLabel id="saveAsDraft" />
                                    </Button>
                                  </Box>
                                )}
                              </Grid>
                              <Grid item xs={1}>
                                {activeStep !== steps.length && (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                    onClick={finalSubmit}
                                    name="buttonname"
                                    value="hiddenvalue"
                                  >
                                    <FormattedLabel id="save" />
                                  </Button>
                                )}
                              </Grid>
                            </Grid>
                          </div>
                        </>
                      )} */}
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default View;
