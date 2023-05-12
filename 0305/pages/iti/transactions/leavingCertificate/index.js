import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import LeavingCertificateToPrint from "../../../../components/school/LeavingCertificateToPrint";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Divider } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import studentLeavingCertificateSchema from "../../../../containers/schema/school/transactions/studentLeavingCertificateSchema";
import urls from "../../../../URLS/urls";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(studentLeavingCertificateSchema),
    mode: "onChange",
  });
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [id, setID] = useState();

  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [fetchData, setFetchData] = useState(null);

  const [showFile, setShowFile] = useState(false);
  const [printData, setPrintData] = useState();
  const [isReady, setIsReady] = useState("none");

  const schoolId = watch("schoolKey");
  const classId = watch("classKey");
  const academicYearId = watch("academicYearKey");
  const divisionId = watch("divisionKey");
  const studentID = watch("studentKey");
  const studentDateOfBirth = watch("studentDateOfBirth");
  const studentAdmissionDate = watch("studentAdmissionDate");

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

  useEffect(() => {
    const getSchoolList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstSchool/getAll`);
        const schools = data.mstSchoolList.map(({ id, schoolName }) => ({ id, schoolName }));
        setSchoolList(schools);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };

    const getAcademicYearList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstAcademicYear/getAll`);
        const academicYears = data.mstAcademicYearList.map(({ id, academicYear }) => ({ id, academicYear }));
        setAcademicYearList(academicYears);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };
    getSchoolList();
    getAcademicYearList();
  }, [setError, setIsOpen]);

  useEffect(() => {
    const getClassList = async () => {
      setValue("classId", "");
      if (schoolId == null || schoolId === "") {
        setClassList([]);
        return;
      }
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`);
        const classes = data.mstClassList.map(({ id, className }) => ({ id, className }));
        setClassList(classes);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };
    getClassList();
  }, [schoolId, setValue, setError, setIsOpen]);

  useEffect(() => {
    const getDivisionList = async () => {
      setValue("divisionKey", "");
      if (schoolId == null || schoolId === "" || classId == null || classId === "") {
        setDivisionList([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`,
        );
        const divisions = data.mstDivisionList.map(({ id, divisionName }) => ({ id, divisionName }));
        setDivisionList(divisions);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };
    getDivisionList();
  }, [classId, schoolId, setValue, setIsOpen, setError]);

  useEffect(() => {
    const getStudentList = async () => {
      setValue("studentKey", "");
      if (
        schoolId == null ||
        schoolId === "" ||
        classId == null ||
        classId === "" ||
        divisionId == null ||
        divisionId == ""
      ) {
        setStudentList([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstStudent/getAllStudentByDiv?schoolKey=${schoolId}&acYearKey=${academicYearId}&classKey=${classId}&divKey=${divisionId}`,
        );
        const students = data.mstStudentList.map(({ id, firstName, middleName, lastName }) => ({
          id,
          studentName: `${firstName} ${middleName} ${lastName}`,
        }));
        setStudentList(students);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };
    getStudentList();
    console.log("studentID", studentID);
  }, [classId, schoolId, divisionId, academicYearId, setValue, setIsOpen, setError]);

  useEffect(() => {
    const getStudent = async () => {
      if (
        schoolId == null ||
        schoolId === "" ||
        classId == null ||
        classId === "" ||
        divisionId == null ||
        divisionId === "" ||
        academicYearId == null ||
        academicYearId === "" ||
        studentID == null ||
        studentID === ""
      ) {
        setStudentData([]);
        return;
      }
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstStudent/getById?id=${studentID}`);

        const student = data;
        setStudentData(student);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };

    getStudent();
  }, [classId, schoolId, divisionId, academicYearId, studentID, setIsOpen, setError]);
  // console.log("studentData", studentData)

  useEffect(() => {
    // console.log("Student", studentData)
    getStudentInfo();
  }, [studentData]);

  const getStudentInfo = () => {
    setValue("studentFirstName", studentData?.firstName);
    setValue("studentMiddleName", studentData?.middleName);
    setValue("studentLastName", studentData?.lastName);
    setValue("studentAdmissionDate", studentData?.lastSchoolAdmissionDate);
    setValue("studentGeneralRegisterNumber", studentData?.admissionRegitrationNo);
    setValue("studentRollNo", studentData?.rollNumber);
    setValue("studentAddress", studentData?.parentAddress);
    setValue("studentMobileNumber", studentData?.contactDetails);
    setValue("studentDateOfBirth", studentData?.dateOfBirth);
    setValue("studentEmailId", studentData?.studentEmailId);
  };
  useEffect(() => {
    getLeavingCertificateMaster();
  }, [fetchData]);

  // Get Table - Data
  const getLeavingCertificateMaster = (_pageSize = 10, _pageNo = 0) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.SCHOOL}/trnLeavingCertificate/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        let result = r.data.trnLeavingCertificateList;
        console.log("trnLeavingCertificateList", result);

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            schoolName: r.schoolName ? r.schoolName : "-",
            studentGeneralRegisterNumber: r.studentGeneralRegisterNumber,
            studentName: `${r.studentFirstName} ${r.studentMiddleName} ${r.studentLastName}`,
            studentMotherName: r.studentMotherName,
            studentDateOfBirth: r.studentDateOfBirth,
            studentPlaceOfBirth: r.studentPlaceOfBirth,
            lastSchoolName: r.lastSchoolName,
            dateOfAdmission: r.dateOfAdmission,
            studentBehaviour: r.studentBehaviour,
            schoolLeavingDate: r.schoolLeavingDate,
            lastClassAndFrom: r.lastClassAndFrom,
            leavingReason: r.leavingReason,
            remark: r.remark,

            mobileNumber: r.studentMobileNumber,
            emailID: r.studentEmailId,
            rollNumber: r.studentRollNo,
          };
        });
        console.log("Result", _res);
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

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    // Save - DB
    let _body = {
      ...formData,
      activeFlag: formData.activeFlag,
      schoolName: schoolList?.find((item) => item?.id === schoolId)?.schoolName,
      className: classList?.find((item) => item?.id === classId)?.className,
      divisionName: divisionList?.find((item) => item?.id === divisionId)?.divisionName,
    };
    if (btnSaveText === "Save") {
      console.log("Body", _body);
      const tempData = axios.post(`${urls.SCHOOL}/trnLeavingCertificate/save`, _body).then((res) => {
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
      const tempData = axios.post(`${urls.SCHOOL}/trnLeavingCertificate/save`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getLeavingCertificateMaster();
          setFetchData(tempData);
          setButtonInputState(false);
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
          axios.post(`${urls.SCHOOL}/trnLeavingCertificate/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getLeavingCertificateMaster();
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
          axios.post(`${urls.SCHOOL}/trnLeavingCertificate/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              // getPaymentRate();
              getLeavingCertificateMaster();
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
    schoolName: "",
    className: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
    schoolName: "",
    className: "",
  };

  //for print the leaving certificate
  //   const componentRef = useRef(null);

  //   console.log("componentRef", componentRef);

  //   const handlePrint = useReactToPrint({
  //     content: () => componentRef.current,
  //     documentTitle: "new document",
  //   });

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: "schoolName",
      headerName: labels.schoolName,
      flex: 1,
    },
    {
      field: "studentName",
      headerName: labels.studentName,
      flex: 1,
    },
    {
      field: "mobileNumber",
      headerName: labels.mobileNumber,
      flex: 1,
    },
    {
      field: "emailID",
      headerName: labels.emailID,
      flex: 1,
    },
    {
      field: "rollNumber",
      headerName: labels.rollNumber,
      flex: 1,
    },

    {
      field: "Actions",
      headerName: labels.actions,
      width: 180,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              // disabled={editButtonInputState}
              onClick={() => {
                setPrintData(params.row);
                handlePrint();
                setIsReady("none");
                console.log("printData", printData);
              }}
            >
              <PrintIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        padding: 1,
        paddingBottom: "30px",
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
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>{labels.schoolLeavingCert}</h2>
      </Box>
      <Paper style={{ display: isReady }}>
        {printData && <LeavingCertificateToPrint ref={componentRef} data={printData} />}
      </Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginLeft: 30,
          marginRight: 5,
          // marginTop: 2,
          // marginBottom: 3,
          padding: 2,
          // border:1,
          // borderColor:'grey.500'
        }}
      >
        <Box p={1}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              {isOpenCollapse && (
                <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                  <Grid container sx={{ padding: "10px" }}>
                    {/* Select School */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel>{labels.selectSchool}</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              // required
                              variant="standard"
                              disabled={router?.query?.pageMode === "View"}
                              sx={{ width: 230 }}
                              // sx={{ width: 200 }}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              {...register("schoolKey")}
                            >
                              {schoolList &&
                                schoolList.map((school, index) => (
                                  <MenuItem key={index} value={school.id}>
                                    {school.schoolName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="schoolKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.schoolKey ? errors.schoolKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Select AY */}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel>{labels.selectAcademicYear}</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // required
                              // readOnly={readonlyFields}
                              variant="standard"
                              disabled={router?.query?.pageMode === "View"}
                              sx={{ width: 230 }}
                              // sx={{ width: 200 }}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              {...register("academicYearKey")}
                            >
                              {academicYearList &&
                                academicYearList.map((AY, index) => (
                                  <MenuItem key={index} value={AY.id}>
                                    {AY.academicYear}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="academicYearKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.academicYearKey ? errors.academicYearKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel>{labels.selectClass}</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // required
                              // readOnly={readonlyFields}
                              variant="standard"
                              disabled={router?.query?.pageMode === "View"}
                              sx={{ width: 230 }}
                              // sx={{ width: 200 }}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              {...register("classKey")}
                            >
                              {classList &&
                                classList.map((school, index) => (
                                  <MenuItem key={index} value={school.id}>
                                    {school.className}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="classKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.classKey ? errors.classKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel>Select Division</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // required
                              // readOnly={readonlyFields}
                              variant="standard"
                              disabled={router?.query?.pageMode === "View"}
                              sx={{ width: 230 }}
                              // sx={{ width: 200 }}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              {...register("divisionKey")}
                            >
                              {divisionList &&
                                divisionList.map((div, index) => (
                                  <MenuItem key={index} value={div.id}>
                                    {div.divisionName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="divisionKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.divisionKey ? errors.divisionKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel>{labels.selectStudent}</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // required
                              // readOnly={readonlyFields}
                              variant="standard"
                              disabled={router?.query?.pageMode === "View"}
                              sx={{ width: 230 }}
                              // sx={{ width: 200 }}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              {...register("studentKey")}
                            >
                              {studentList &&
                                studentList.map((student) => (
                                  <MenuItem key={student.id} value={student.id}>
                                    {student.studentName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="studentKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.studentKey ? errors.studentKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Divider />

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.firstName}
                        // value={firstName}
                        {...register("studentFirstName")}
                        error={!!errors.studentFirstName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("studentFirstName") ? true : false) ||
                            (router.query.studentFirstName ? true : false),
                        }}
                        helperText={errors?.studentFirstName ? errors.studentFirstName.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.middleName}
                        // value={middleName}
                        {...register("studentMiddleName")}
                        error={!!errors.studentMiddleName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("studentMiddleName") ? true : false) ||
                            (router.query.studentMiddleName ? true : false),
                        }}
                        helperText={errors?.studentMiddleName ? errors.studentMiddleName.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.surnameName}
                        // value={lastName}
                        {...register("studentLastName")}
                        error={!!errors.studentLastName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("studentLastName") ? true : false) ||
                            (router.query.studentLastName ? true : false),
                        }}
                        helperText={errors?.studentLastName ? errors.studentLastName.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Controller
                        control={control}
                        name="studentAdmissionDate"
                        rules={{ required: true }}
                        defaultValue={null}
                        render={({ field: { onChange, ...props } }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              label={<span className="required">{labels.admissionDate}</span>}
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              {...props}
                              onChange={(date) => onChange(moment(date).format("YYYY-MM-DD"))}
                              selected={studentAdmissionDate}
                              center
                              renderInput={(params) => <TextField {...params} variant="standard" />}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentGeneralRegisterNumber}
                        // value={StudRegNo}
                        {...register("studentGeneralRegisterNumber")}
                        error={!!errors.studentGeneralRegisterNumber}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("studentGeneralRegisterNumber") ? true : false) ||
                            (router.query.studentGeneralRegisterNumber ? true : false),
                        }}
                        helperText={
                          errors?.studentGeneralRegisterNumber
                            ? errors.studentGeneralRegisterNumber.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.rollNumber}
                        {...register("studentRollNo")}
                        error={!!errors.studentRollNo}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("studentRollNo") ? true : false) ||
                            (router.query.studentRollNo ? true : false),
                        }}
                        helperText={errors?.studentRollNo ? errors.studentRollNo.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.address}
                        {...register("studentAddress")}
                        error={!!errors.studentAddress}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("studentAddress") ? true : false) ||
                            (router.query.studentAddress ? true : false),
                        }}
                        helperText={errors?.studentAddress ? errors.studentAddress.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.mobileNumber}
                        {...register("studentMobileNumber")}
                        error={!!errors.studentMobileNumber}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("studentMobileNumber") ? true : false) ||
                            (router.query.studentMobileNumber ? true : false),
                        }}
                        helperText={errors?.studentMobileNumber ? errors.studentMobileNumber.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.emailID}
                        {...register("studentEmailId")}
                        error={!!errors.studentEmailId}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("studentEmailId") ? true : false) ||
                            (router.query.studentEmailId ? true : false),
                        }}
                        helperText={errors?.studentEmailId ? errors.studentEmailId.message : null}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        style={{ marginTop: 10 }}
                        error={!!errors.studentDateOfBirth}
                      >
                        <Controller
                          control={control}
                          name="studentDateOfBirth"
                          rules={{ required: true }}
                          defaultValue={null}
                          render={({ field: { onChange, ...props } }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                label={<span className="required">{labels.dateOfbirth}</span>}
                                variant="standard"
                                inputFormat="DD/MM/YYYY"
                                {...props}
                                onChange={(date) => onChange(moment(date).format("YYYY-MM-DD"))}
                                selected={studentDateOfBirth}
                                center
                                renderInput={(params) => (
                                  <TextField {...params} variant="standard" fullWidth />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.studentDateOfBirth ? errors.studentDateOfBirth.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.remark}
                        // value={birthPlace}
                        {...register("bonafiedRemark")}
                        error={!!errors.remark}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("bonafiedRemark") ? true : false) || (router.query.remark ? true : false),
                        }}
                        // helperText={
                        //     errors?.remark ? errors.remark.message : null
                        // }
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
                          Save
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
                          Clear
                          {/* <FormattedLabel id="clear" /> */}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          Exit
                          {/* <FormattedLabel id="exit" /> */}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Slide>
              )}
            </form>
          </FormProvider>
        </Box>
      </Box>
      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          type="primary"
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
          {labels.add}
        </Button>
      </div>
      <DataGrid
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
        headerName="Water"
        getRowId={(row) => row.srNo}
        autoHeight
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
        // rows={studentList}
        // columns={columns}
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
          getLeavingCertificateMaster(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getLeavingCertificateMaster(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
