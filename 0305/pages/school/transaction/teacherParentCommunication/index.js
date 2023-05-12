import { EyeFilled } from "@ant-design/icons";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";

import { yupResolver } from "@hookform/resolvers/yup";
import { ClearOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import teacherParentCommSchema from "../../../../containers/schema/school/transactions/teacherParentCommSchema";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";

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
  const [showFile, setShowFile] = useState(true);
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

  const [error, setError] = useState("");
  const router = useRouter();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [hanadleStudent, setHanadleStudent] = useState([]);

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [commStudentList, setCommStudentList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "30%",
    // transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleSelectedStudents = (event, studentId) => {
    if (studentId === "all") {
      if (event.target.checked) {
        setSelectedStudents(studentList.map((student) => student.id));
        setHanadleStudent(studentList.map((student) => ({ studentKey: student.id })));
      } else {
        setSelectedStudents([]);
        setHanadleStudent([]);
      }
    } else {
      if (event.target.checked) {
        setSelectedStudents([...selectedStudents, studentId]);
        setHanadleStudent((old) => [...old, { studentKey: studentId }]);
      } else {
        setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
        setHanadleStudent(hanadleStudent.filter((item) => item.studentKey !== studentId));
      }
    }
  };

  // console.log("selectedStudents", selectedStudents);
  // console.log("hanadleStudent", hanadleStudent);

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

  const getSchoolList = () => {
    axios.get(`${urls.SCHOOL}/mstSchool/getAll`).then((r) => {
      setSchoolList(
        r.data.mstSchoolList.map((row) => ({
          id: row.id,
          schoolName: row.schoolName,
          schoolNameMr: row.schoolNameMr,
        })),
      );
    });
  };
  const getAcademicYearList = () => {
    axios.get(`${urls.SCHOOL}/mstAcademicYear/getAll`).then((r) => {
      setAcademicYearList(
        r.data.mstAcademicYearList.map((row) => ({
          id: row.id,
          academicYear: row.academicYear,
        })),
      );
    });
  };
  const getTeacherList = () => {
    axios.get(`${urls.SCHOOL}/mstTeacher/getAll`).then((r) => {
      setTeachersList(
        r.data.mstTeacherList.map((row) => ({
          id: row.id,
          teacherName: `${row.firstName} ${row.middleName} ${row.lastName}`,
        })),
      );
    });
  };

  useEffect(() => {
    getTeacherList();
    getSchoolList();
    getAcademicYearList();
  }, []);

  const getClassList = () => {
    if (schoolId) {
      axios.get(`${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`).then((r) => {
        setClassList(
          r.data.mstClassList.map((row) => ({
            id: row.id,
            className: row.className,
          })),
        );
      });
    }
  };
  useEffect(() => {
    getClassList();
  }, [schoolId, setValue]);

  const getDivisionList = () => {
    if (classId) {
      axios
        .get(`${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`)
        .then((r) => {
          setDivisionList(
            r.data.mstDivisionList.map((row) => ({
              id: row.id,
              divisionName: row.divisionName,
            })),
          );
        });
    }
  };

  useEffect(() => {
    getDivisionList();
  }, [classId]);

  const getStudentList = () => {
    if (divisionId) {
      axios
        .get(
          `${urls.SCHOOL}/mstStudent/getAllStudentByDiv?schoolKey=${schoolId}&acYearKey=${academicYearId}&classKey=${classId}&divKey=${divisionId}`,
        )
        .then((r) => {
          setStudentList(
            r.data.mstStudentList.map((row) => ({
              id: row.id,
              studentName: `${row.firstName} ${row.middleName} ${row.lastName}`,
              studentNameMr: `${row.firstNameMr} ${row.middleNameMr} ${row.lastNameMr}`,
            })),
          );
        });
    }
  };
  useEffect(() => {
    getStudentList();
  }, [divisionId]);

  useEffect(() => {
    getTeacherParentCommunicationMaster();
  }, [fetchData]);

  // Get Table - Data
  const getTeacherParentCommunicationMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc",
  ) => {
    axios
      .get(`${urls.SCHOOL}/trnTeacherParentComm/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
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
            schoolName: r.schoolName,
            schoolNameMr: schoolList?.find((item) => item?.id === r?.schoolKey)?.schoolNameMr,
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
            studentTeacherParentCommDao: r.studentTeacherParentCommDao,
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
      // studentKey: studentId,
      studentTeacherParentCommDao: hanadleStudent,

      academicYearKey: academicYearId,
      // get school name from schoolId via schoolList
      schoolName: schoolList?.find((item) => item?.id === schoolId)?.schoolName,
      schoolNameMr: schoolList?.find((item) => item?.id === schoolId)?.schoolNameMr,
      className: classList?.find((item) => item?.id === classId)?.className,
      divisionName: divisionList?.find((item) => item?.id === divisionId)?.divisionName,
      studentName: studentList?.find((item) => item?.id === studentId)?.studentName,
      teacherName: teachersList?.find((item) => item?.id === teacherKey)?.teacherName,
    };
    if (btnSaveText === "Save") {
      console.log("Body", _body);
      const tempData = axios.post(`${urls.SCHOOL}/trnTeacherParentComm/save`, _body).then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");

          setButtonInputState(false);
          setIsOpenCollapse(false);
          setShowFile(true);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setHanadleStudent([]);
          setSelectedStudents([]);
        }
      });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      const tempData = axios.post(`${urls.SCHOOL}/trnTeacherParentComm/save`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getTeacherParentCommunicationMaster();
          setFetchData(tempData);
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
          setShowFile(true);
          setHanadleStudent([]);
          setSelectedStudents([]);
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
    setShowFile(true);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    setHanadleStudent([]);
    setSelectedStudents([]);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setHanadleStudent([]);
    setSelectedStudents([]);
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
      field: language == "en" ? "schoolName" : "schoolNameMr",
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
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // console.log("commStudentList", commStudentList);
        return (
          <Box>
            <IconButton
              onClick={() => {
                setIsOpen(true);
                // for modal rows
                let _res = params?.row?.studentTeacherParentCommDao.map((val, i) => {
                  return {
                    srNo: i + 1,
                    id: val?.id,
                    studentName: val?.studentName,
                    studentNameMr: val?.studentNameMr,
                    studentKey: val?.studentKey,
                  };
                });
                setCommStudentList(_res);
              }}
            >
              <EyeFilled style={{ color: "#556CD6" }} />
            </IconButton>
          </Box>
        );
      },
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

    // {
    //   field: "actions",
    //   headerName: labels.actions,
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"), setEditButtonInputState(true);
    //             setDeleteButtonState(true);
    //             setIsOpenCollapse(!isOpenCollapse);
    //             setID(params.row.id),
    //               // setIsOpenCollapse(true),
    //               setSlideChecked(true);
    //             setButtonInputState(true);
    //             // console.log("params.row: ", params.row);
    //             reset(params.row);
    //           }}
    //         >
    //           <EditIcon style={{ color: "#556CD6" }} />
    //         </IconButton>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setID(params.row.id),
    //               // setIsOpenCollapse(true),
    //               setSlideChecked(true);
    //             setButtonInputState(true);
    //             console.log("params.row: ", params.row);
    //             reset(params.row);
    //           }}
    //         >
    //           {params.row.activeFlag == "Y" ? (
    //             <ToggleOnIcon
    //               style={{ color: "green", fontSize: 30 }}
    //               onClick={() => deleteById(params.id, "N")}
    //             />
    //           ) : (
    //             <ToggleOffIcon
    //               style={{ color: "red", fontSize: 30 }}
    //               onClick={() => deleteById(params.id, "Y")}
    //             />
    //           )}
    //         </IconButton>
    //       </Box>
    //     );
    //   },
    // },
  ];

  // for modal columns
  const _col = [
    {
      field: "srNo",
      headerName: labels.srNo,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "studentName" : "studentNameMr",
      headerName: labels.studentName,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
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
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Grid item>
          <h2>{labels.teacherParentCommunication}</h2>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginLeft: 5,
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
                            <Select variant="standard" {...field} error={!!errors.schoolKey}>
                              {schoolList &&
                                schoolList.map((school) => (
                                  <MenuItem key={school.id} value={school.id}>
                                    {language == "en" ? school?.schoolName : school?.schoolNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>{errors?.schoolKey ? errors.schoolKey.message : null}</FormHelperText>
                      </FormControl>
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
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="small"
                        sx={{ m: 1, minWidth: "50%" }}
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
                                  <MenuItem key={academicYear.id} value={academicYear.id}>
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
                                  <MenuItem key={item.id} value={item.id}>
                                    {item.className}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
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
                                  <MenuItem key={item.id} value={item.id}>
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
                        error={Boolean(errors.selectedStudents)}
                        variant="standard"
                        sx={{ m: 1, minWidth: "50%", maxWidth: "50%" }}
                      >
                        <InputLabel id="selectedStudents-label">{labels.selectStudent}</InputLabel>
                        <Controller
                          name="selectedStudents"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              labelId="selectedStudents-label"
                              id="selectedStudents"
                              multiple
                              value={selectedStudents}
                              onChange={(e) => {
                                onChange(handleSelectedStudents(e, e.target.value));
                              }}
                              renderValue={(selected) =>
                                selected.includes("all")
                                  ? "Select All"
                                  : selected
                                      .map(
                                        (id) => studentList.find((student) => student.id === id)?.studentName,
                                      )
                                      .join(", ")
                              }
                            >
                              {studentList?.length > 0 && (
                                <MenuItem key="all" value="all">
                                  <Checkbox
                                    checked={selectedStudents.length === studentList.length}
                                    indeterminate={
                                      selectedStudents.length > 0 &&
                                      selectedStudents.length < studentList.length
                                    }
                                    onChange={(e) => handleSelectedStudents(e, "all")}
                                  />
                                  {labels.selectAll}
                                </MenuItem>
                              )}

                              {studentList.map((student) => (
                                <MenuItem key={student.id} value={student.id}>
                                  <Checkbox
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={(e) => handleSelectedStudents(e, student.id)}
                                  />
                                  {language == "en" ? student.studentName : student.studentNameMr}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.selectedStudents && (
                          <FormHelperText>Please select at least one student</FormHelperText>
                        )}
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
                      <FormControl
                        variant="standard"
                        size="small"
                        sx={{ m: 1, minWidth: "50%" }}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.subject}
                        // value={firstName}
                        {...register("commSubject")}
                        error={!!errors.commSubject}
                        sx={{ m: 1, minWidth: "50%" }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("commSubject") ? true : false,
                        }}
                        helperText={errors?.commSubject ? errors.commSubject.message : null}
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
                        label={labels.message}
                        // value={middleName}
                        {...register("commMessage")}
                        error={!!errors.commMessage}
                        sx={{ m: 1, minWidth: "50%" }}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("commMessage") ? true : false,
                        }}
                        helperText={errors?.commMessage ? errors.commMessage.message : null}
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
            setShowFile(false);
          }}
        >
          {labels.add}
        </Button>
      </div>

      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
            hideFooter={true}
            rows={commStudentList}
            columns={_col}
            onPageChange={(_data) => {}}
            onPageSizeChange={(_data) => {}}
          />
          <Grid container paddingTop={2} justifyContent="center" alignItems="center">
            <Button
              style={{ justifyContent: "center" }}
              variant="contained"
              color="warning"
              startIcon={<ClearOutlined />}
              onClick={() => handleClose()}
            >
              {labels.close}
            </Button>
          </Grid>
        </Box>
      </Modal>

      {showFile && (
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
      )}
    </Paper>
  );
};

export default Index;
