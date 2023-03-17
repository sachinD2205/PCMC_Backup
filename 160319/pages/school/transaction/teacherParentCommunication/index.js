import {
  Box,
  Button, FormControl, FormHelperText, Grid, InputLabel,
  MenuItem,
  Paper, Select, Slide, TextField
} from "@mui/material";
import {
  GridToolbar
} from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import teacherParentCommSchema from "../../../../containers/schema/school/transactions/teacherParentCommSchema";
import urls from "../../../../URLS/urls";

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
    resolver: yupResolver(teacherParentCommSchema),
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

  const schoolId = watch("schoolKey");
  const academicYearId = watch("academicYearKey");
  const teacherKey = watch("teacherKey");
  const classId = watch("classKey");
  const divisionId = watch("divisionKey");
  const studentId = watch("studentKey");


  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [teachersList, setTeachersList] = useState([]);


  // const [schoolId, setSchoolId] = useState("");
  // const [academicYearId, setAcademicYearId] = useState("");
  // const [classId, setClassId] = useState("");
  // const [divisionId, setDivisionId] = useState("");
  // const [studentId, setstudentId] = useState("");

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

    const getTeacherList = async () => {
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstTeacher/getAll`
        );
        const teachers = data.mstTeacherList.map(({ id, firstName, middleName, lastName }) => ({
          id,
          teacherName: `${firstName} ${middleName} ${lastName}`
        })
        );
        setTeachersList(teachers);
      } catch (e) {
        setError(e.message);
      }
    };

    getTeacherList();
    getSchoolList();
    getAcademicYearList();
  }, [setError, setIsOpen]);

  useEffect(() => {
    const getClassList = async () => {
      setValue("classKey", "");
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
      if (schoolId == null || schoolId === "" || classId == null || classId === "" || divisionId == null || divisionId == "") {
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
    // console.log("studentList", studentList)
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
        studentId == null ||
        studentId === ""
      ) {
        setStudentData([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstStudent/getById?id=${studentId}`,
        );

        const student = data
        setStudentData(student);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };

    getStudent();
  }, [classId, schoolId, divisionId, academicYearId, studentId, setIsOpen, setError]);


  useEffect(() => {
    getTeacherParentCommunicationMaster();
  }, [fetchData]);


  // Get Table - Data
  const getTeacherParentCommunicationMaster = (_pageSize = 10, _pageNo = 0) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.SCHOOL}/trnTeacherParentComm/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        let result = r.data.trnTeacherParentCommList;
        console.log("trnTeacherParentCommList", result);

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            schoolName: r.schoolName ? r.schoolName : "-",
            className: r.className,
            schoolKey: r.schoolKey,
            academicYearKey: r.academicYearKey,
            classKey: r.classKey,
            divisionKey: r.divisionKey,
            studentKey: r.studentKey,
            divisionName: r.divisionName,
            studentName: r.studentName,
            teacherName: r.teacherName,
            teacherKey: r.teacherKey,
            commSubject: r.commSubject,
            commMessage: r.commMessage,
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
      schoolKey: schoolId,
      classKey: classId,
      divisionKey: divisionId,
      studentKey: studentId,
      academicYearKey: academicYearId,
      // get school name from schoolId via schoolList 
      schoolName: schoolList?.find((item) => item?.id === schoolId)?.schoolName,
      className: classList?.find((item) => item?.id === classId)?.className,
      divisionName: divisionList?.find((item) => item?.id === divisionId)?.divisionName,
      studentName: studentList?.find((item) => item?.id === studentId)?.studentName,
      teacherName: teachersList?.find((item) => item?.id === teacherKey)?.teacherName,
    };
    if (btnSaveText === "Save") {
      console.log("Body", _body);
      const tempData = axios
        .post(`${urls.SCHOOL}/trnTeacherParentComm/save`, _body)
        .then((res) => {
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
      const tempData = axios
        .post(`${urls.SCHOOL}/trnTeacherParentComm/save`, _body)
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                "Updated!",
                "Record Updated successfully !",
                "success"
              )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getTeacherParentCommunicationMaster();
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
          axios.post(`${urls.SCHOOL}/trnTeacherParentComm/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getTeacherParentCommunicationMaster();
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
          axios.post(`${urls.SCHOOL}/trnTeacherParentComm/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              // getPaymentRate();
              getTeacherParentCommunicationMaster();
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
    schoolKey: "",
    academicYearKey: "",
    classKey: "",
    divisionKey: "",
    teacherKey: "",
    studentKey: "",
    commSubject: "",
    commMessage: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
    schoolKey: "",
    academicYearKey: "",
    classKey: "",
    divisionKey: "",
    teacherKey: "",
    studentKey: "",
    commSubject: "",
    commMessage: "",
  };

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
      field: "className",
      headerName: labels.className,
      flex: 1,
    },
    {
      field: "divisionName",
      headerName: labels.divisionName,
      flex: 1,
    },
    {
      field: "studentName",
      headerName: labels.studentName,
      flex: 1,
    },
    {
      field: "teacherName",
      headerName: labels.teacherName,
      flex: 1,
    },
    {
      field: "commSubject",
      headerName: labels.subject,
      flex: 1,
    },
    {
      field: "commMessage",
      headerName: labels.message,
      flex: 1,
    },

    {
      field: "actions",
      headerName: labels.actions,
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
                  setEditButtonInputState(true);
                setDeleteButtonState(true);
                setIsOpenCollapse(!isOpenCollapse);
                setID(params.row.id),
                  // setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                // console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),

                  // setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
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
        <Grid item>
          <h2>
            {labels.teacherParentCommunication}
          </h2>
        </Grid>
      </Box>
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
        }}>
        <Box p={1}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              {isOpenCollapse && (
                <Slide
                  direction="down"
                  in={slideChecked}
                  mountOnEnter
                  unmountOnExit
                >
                  <Grid container sx={{ padding: "10px" }}>

                    <Grid item
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
                        error={!!errors.schoolId}
                      >
                        <InputLabel required error={!!errors.schoolId}>
                          {labels.selectSchool}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="schoolKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              variant="standard"
                              {...field}
                              error={!!errors.schoolKey}
                            >
                              {schoolList &&
                                schoolList.map((school) => (
                                  <MenuItem key={school.id} value={school.id}>
                                    {school.schoolName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.schoolKey ? errors.schoolKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item
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
                        error={!!errors.academicYearKey}
                      >
                        <InputLabel required error={!!errors.academicYearKey}>
                          {labels.selectAcademicYear}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="academicYearKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {academicYearList &&
                                academicYearList.map((academicYear) => (
                                  <MenuItem
                                    key={academicYear.id}
                                    value={academicYear.id}
                                  >
                                    {academicYear.academicYear}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.academicYearKey ? errors.academicYearKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item
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
                        error={!!errors.classKey}
                      >
                        <InputLabel required error={!!errors.academicYearKey}>
                          {labels.selectClass}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="classKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {classList &&
                                classList.map((item) => (
                                  <MenuItem
                                    key={item.id}
                                    value={item.id}
                                  >
                                    {item.className}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.classKey ? errors.classKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item
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
                        error={!!errors.classKey}
                      >
                        <InputLabel required error={!!errors.academicYearKey}>
                          {labels.selectDivision}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="divisionKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {divisionList &&
                                divisionList.map((item) => (
                                  <MenuItem
                                    key={item.id}
                                    value={item.id}
                                  >
                                    {item.divisionName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.divisionKey ? errors.divisionKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item
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
                        error={!!errors.classKey}
                      >
                        <InputLabel required error={!!errors.studentKey}>
                          {labels.selectStudent}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="studentKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {studentList &&
                                studentList.map((item) => (
                                  <MenuItem
                                    key={item.id}
                                    value={item.id}
                                  >
                                    {item.studentName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.studentKey ? errors.studentKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <FormControl
                        variant="standard"
                        size="small"
                        sx={{ m: 1, minWidth: '50%' }}
                        error={!!errors.teacherKey}
                      >
                        <InputLabel>{labels.teacherName}</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              value={field.value}
                              {...register("teacherKey")}
                            >
                              {teachersList &&
                                teachersList.map((each, index) => (
                                  <MenuItem key={index} value={each.id}>
                                    {each.teacherName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="teacherKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.teacherKey ? errors.teacherKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* <Divider /> */}

                    <Grid item
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.subject}
                        // value={firstName}
                        {...register("commSubject")}
                        error={!!errors.commSubject}
                        sx={{ m: 1, minWidth: '50%' }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 }
                        }}
                        helperText={
                          errors?.commSubject ? errors.commSubject.message : null
                        }
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12} p={1} sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.message}
                        // value={middleName}
                        {...register("commMessage")}
                        error={!!errors.commMessage}
                        sx={{ m: 1, minWidth: '50%' }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 }
                        }}
                        helperText={
                          errors?.commMessage ? errors.commMessage.message : null
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
                          {labels.save}
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
                          {labels.clear}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {labels.exit}
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
          type='primary'
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
          getTeacherParentCommunicationMaster(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);   
          getTeacherParentCommunicationMaster(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
