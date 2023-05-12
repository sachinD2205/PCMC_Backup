import { EditFilled, SaveFilled } from "@ant-design/icons";
import { CancelOutlined, ClearOutlined, SearchOutlined, UpdateOutlined } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridRowModes, useGridApiContext } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import StudentsMarksReportToPrint from "../../../../components/school/StudentsMarksReportToPrint";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";

const Index = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [termList, setTermList] = useState([
    { id: 1, termName: "Term 1" },
    { id: 2, termName: "Term 2" },
  ]);
  const [marks, setMarks] = useState([]);
  const [rowModes, setRowModes] = useState({});
  const [loading, setLoading] = useState(false);

  const [sem1MarksPrintData, setSem1MarksPrintData] = useState();
  const [sem2MarksPrintData, setSem2MarksPrintData] = useState();
  const [studentPrintData, setStudentPrintData] = useState();
  const [isReady, setIsReady] = useState("none");

  const [error, setError] = useState(null);

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(() => setLabels(schoolLabels[language ?? "en"]), [setLabels, language]);
  const {
    watch,
    control,
    trigger,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });

  const schoolId = watch("schoolId");
  const academicYearId = watch("academicYearId");
  const classId = watch("classId");
  const divisionId = watch("divisionId");
  const examId = watch("examId");
  const termId = watch("termId");
  const student = watch("student");

  useEffect(() => {
    const getSchoolList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstSchool/getAll`);
        const schools = data.mstSchoolList.map(({ id, schoolName, schoolNameMr }) => ({
          id,
          schoolName,
          schoolNameMr,
        }));
        setSchoolList(schools);
      } catch (e) {
        setError(e.message);
      }
    };
    const getAcademicYearList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstAcademicYear/getAll`);
        const academicYears = data.mstAcademicYearList.map(({ id, academicYear }) => ({ id, academicYear }));
        setAcademicYearList(academicYears);
      } catch (e) {
        setError(e.message);
      }
    };
    Promise.all([getSchoolList(), getAcademicYearList()]);
  }, [setError, setValue]);

  useEffect(() => {
    const getClassList = async () => {
      if (schoolId == null || schoolId.length === 0) {
        setValue("classId", "");
        setClassList([]);
        return;
      }
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`);
        const classes = data.mstClassList.map(({ id, className }) => ({ id, className }));
        setClassList(classes);
      } catch (e) {
        setError(e.message);
      }
    };
    getClassList();
  }, [schoolId, setValue, setError]);

  useEffect(() => {
    const getDivisionList = async () => {
      if (schoolId == null || schoolId.length === 0 || classId == null || classId.length === 0) {
        setValue("divisionId", "");
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
      }
    };
    getDivisionList();
  }, [classId, schoolId, setValue, setError]);

  useEffect(() => {
    const getExamList = async () => {
      if (
        schoolId == null ||
        schoolId.length === 0 ||
        academicYearId == null ||
        academicYearId.length === 0 ||
        classId == null ||
        classId.length === 0 ||
        divisionId == null ||
        divisionId == null ||
        divisionId.length === 0 ||
        termId == null ||
        termId.length === 0
      ) {
        setValue("examId", "");
        setExamList([]);
        return;
      }
      axios
        .get(
          `${urls.SCHOOL}/mstExam/getDataAsperTerm?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}&termKey=${termId}`,
        )
        .then((r) => {
          console.log("Re", r);
          setExamList(
            r.data.map((row) => ({
              id: row.id,
              examName: row.examName,
            })),
          );
        });
      // try {
      //   const { data } = await axios.get(
      //     `${urls.SCHOOL}/mstExam/getDataAsperTerm?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}&termKey=${termId}`,
      //   );
      //   const exams = data.mstExamList.map(({ id, examName }) => ({ id, examName }));
      //   setExamList(exams);
      // } catch (e) {
      //   setError(e.message);
      // }
    };
    getExamList();
  }, [schoolId, academicYearId, classId, divisionId, watch("termId"), setValue, setError]);

  useEffect(() => {
    const getStudentList = async () => {
      if (
        schoolId == null ||
        schoolId.length === 0 ||
        academicYearId == null ||
        academicYearId.length === 0 ||
        classId == null ||
        classId.length === 0 ||
        divisionId == null ||
        divisionId.length === 0
      ) {
        setValue("student", null);
        setStudentList([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstStudent/getAllStudentByDiv?schoolKey=${schoolId}&acYearKey=${academicYearId}&classKey=${classId}&divKey=${divisionId}`,
        );
        const students = data.mstStudentList.map(({ id, ...props }) => ({
          id: id,
          studentName: `${props.firstName} ${props.middleName} ${props.lastName}`,
        }));
        setStudentList(students);
      } catch (e) {
        setError(e.message);
      }
    };
    getStudentList();
  }, [schoolId, academicYearId, classId, divisionId, setValue, setError]);

  const findMarks = async () => {
    const isValid = await trigger();
    if (!isValid) {
      setMarks([]);
      return;
    }
    setLoading(true);
    try {
      const [stuRes, subRes] = await Promise.all([
        axios.get(
          // `${urls.SCHOOL}/trnExamMarksRegister/getStudentMarksForExam?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}&studentKey=${student.id}&examKey=${examId}`,
          `${urls.SCHOOL}/trnExamMarksRegister/getStudentMarksForTerm?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}&studentKey=${student.id}&termKey=${termId}`,
        ),
        axios.get(
          // `${urls.SCHOOL}/mstAcademicSubject/getAll?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}`,
          `${urls.SCHOOL}/mstAcademicSubject/getFilterSubject?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}`,
        ),
      ]);

      const studentMarks = stuRes.data.trnExamMarksRegisterList.map((m) => ({
        id: m.id,
        subjectKey: m.subjectKey,
        subject: m.subjectName,
        marksObtained: m.obtainedMarks,
        outOfMarks: m.outOfMarks,
        remark: m.subjectRemark,
        activeFlag: m.activeFlag,
      }));
      // console.log("stuRes.data.trnExamMarksRegisterList", stuRes.data.trnExamMarksRegisterList)
      const subjectMarks = subRes.data.map((sub) => ({
        id: nanoid(),
        subjectKey: sub.id,
        subject: sub.subjectName,
        marksObtained: 0.0,
        outOfMarks: 0.0,
        remark: "",
        activeFlag: "Y",
      }));
      if (studentMarks.length === 0) {
        setMarks(subjectMarks);
        return;
      }
      const actualMarks = studentMarks.map((mark) => mark.subjectKey);
      subjectMarks.forEach((subject) => {
        if (!actualMarks.includes(subject.subjectKey)) {
          studentMarks.push(subject);
        }
      });
      setMarks(studentMarks);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // student marks data by Id sending to the printCompo on onClick of generate report
  const handleMarksPrintData = async () => {
    const isValid = await trigger();
    if (!isValid) {
      setSem1MarksPrintData();
      setSem2MarksPrintData();
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${urls.SCHOOL}/trnExamMarksRegister/getStudentMarksForTerm?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}&studentKey=${student.id}&termKey=0`,
      );
      console.log("response", data.trnExamMarksRegisterList);

      const studentMarksData = data.trnExamMarksRegisterList.map((m) => ({
        id: m.id,
        subjectKey: m.subjectKey,
        subject: m.subjectName,
        marksObtained: m.obtainedMarks,
        outOfMarks: m.outOfMarks,
        remark: m.subjectRemark,
        grade: m.grade,
        gradeMr: m.gradeMr,
        activeFlag: m.activeFlag,
        studentName: m.studentName,
        schoolName: m.schoolName,
        className: m.className,
        divisionName: m.divisionName,
        subjectName: m.subjectName,
        subjectKey: m.subjectKey,
        examTermName: m.examTermName,
        examTermKey: m.examTermKey,
        subjectRemark: m.subjectRemark,
      }));
      // console.log("studentMarksData", studentMarksData)
      let studentTerm1 = studentMarksData?.filter((data) => data?.examTermKey === 1);
      let studentTerm2 = studentMarksData?.filter((data) => data?.examTermKey === 2);
      console.log("student term1", studentTerm1);
      console.log("student term2", studentTerm2);
      setSem1MarksPrintData(studentTerm1);
      setSem2MarksPrintData(studentTerm2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  //student data by Id sending to the printCompo on onClick of generate report
  const handleStudentPrintData = async () => {
    const isValid = await trigger();
    if (!isValid) {
      setStudentPrintData();
      return;
    }
    setLoading(true);
    try {
      await axios.get(`${urls.SCHOOL}/mstStudent/getById?id=${student.id}`).then((r) => {
        console.log("response", r);
        if (r.status === 200) {
          setStudentPrintData(r.data);
          handlePrint();
        }
      });
      // const studentById = stuData;
      // setStudentPrintData(studentById);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMarks = async () => {
    setLoading(true);
    const valid = await trigger();
    if (!valid) {
      setLoading(false);
      return;
    }
    try {
      const payload = marks.map(({ id, ...props }) => {
        const m = {
          schoolKey: schoolId,
          academicYearKey: academicYearId,
          classKey: classId,
          divisionKey: divisionId,
          studentKey: student.id,
          studentName: student.studentName,
          examKey: examId,
          examName: examList.find((exam) => exam.id === examId).examName,
          examTermKey: termId,
          examTermName: termList.find((term) => term.id === termId).termName,
          subjectKey: props.subjectKey,
          subjectName: props.subject,
          obtainedMarks: props.marksObtained,
          outOfMarks: props.outOfMarks,
          subjectRemark: props.remark,
          activeFlag: props.activeFlag,
        };
        if (typeof id === "number") {
          m.id = id;
        }
        return m;
      });
      console.log("payload", payload);
      await axios.post(`${urls.SCHOOL}/trnExamMarksRegister/saveList`, payload);
      swal(labels.success, labels.marksUpdated, "success");
    } catch (e) {
      swal(labels.error, e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => () => {
    setRowModes({ ...rowModes, [id]: { mode: GridRowModes.Edit, fieldToFocus: "marksObtained" } });
  };

  const handleSaveClick = (id) => () => {
    setRowModes({ ...rowModes, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModes({
      ...rowModes,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const processRowUpdate = (newRow) => {
    setMarks(marks.map((row) => (row.id === newRow.id ? newRow : row)));
    return newRow;
  };

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  const columns = [
    {
      field: "subject",
      headerName: labels.subject,
      type: "string",
      flex: 1,
    },
    {
      field: "marksObtained",
      headerName: labels.marksObtained,
      type: "number",
      width: 200,
      editable: true,
      preProcessEditCellProps: ({ props, otherFieldsProps }) => {
        if (otherFieldsProps.outOfMarks.value < props.value) {
          return { ...props, error: true, errorText: labels.marksError };
        }
        return { ...props, error: false, errorText: "" };
      },
      renderEditCell: (params) => <EditCellComponent {...params} />,
    },
    {
      field: "outOfMarks",
      headerName: labels.outOfMarks,
      type: "number",
      width: 200,
      editable: true,
      preProcessEditCellProps: ({ props, otherFieldsProps }) => {
        if (otherFieldsProps.marksObtained.value > props.value) {
          return { ...props, error: true, errorText: labels.marksError };
        }
        return { ...props, error: false, errorText: "" };
      },
      renderEditCell: (params) => <EditCellComponent {...params} />,
    },
    {
      field: "remark",
      headerName: labels.remark,
      type: "string",
      flex: 1,
      editable: true,
      renderEditCell: (params) => <EditCellComponent {...params} />,
    },
    {
      field: "actions",
      type: "actions",
      headerName: labels.actions,
      width: 150,
      getActions: ({ id }) => {
        const isInEditMode = rowModes[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`${id}_save`}
              icon={<SaveFilled />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`${id}_cancel`}
              icon={<CancelOutlined />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={`${id}_edit`}
            icon={<EditFilled />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  return (
    <Paper
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        padding: 1,
      }}
    >
      <Grid container gap={4} direction="column">
        <Grid
          container
          display="flex"
          justifyContent="center"
          justifyItems="center"
          padding={2}
          sx={{
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <Grid item>
            <h2 style={{ marginBottom: 0 }}>{labels.examMarks}</h2>
          </Grid>
        </Grid>
        <Paper style={{ display: isReady }}>
          {studentPrintData && (
            <StudentsMarksReportToPrint
              ref={componentRef}
              term1={sem1MarksPrintData}
              term2={sem2MarksPrintData}
              stuData={studentPrintData}
              language={language}
            />
          )}
        </Paper>
        <form>
          <Grid container display="flex" direction="column" gap={2}>
            <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <FormControl fullWidth>
                  <InputLabel required error={!!errors.schoolId}>
                    {labels.selectSchool}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="schoolId"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select variant="standard" {...field} error={!!errors.schoolId}>
                        {schoolList &&
                          schoolList.map((school) => (
                            <MenuItem key={school.id} value={school.id}>
                              {language == "en" ? school?.schoolName : school?.schoolNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.schoolId}>
                    {errors.schoolId ? labels.schoolRequired : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <FormControl fullWidth>
                  <InputLabel required error={!!errors.academicYearId}>
                    {labels.selectAcademicYear}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="academicYearId"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select variant="standard" {...field} error={!!errors.academicYearId}>
                        {academicYearList &&
                          academicYearList.map((academicYear) => (
                            <MenuItem key={academicYear.id} value={academicYear.id}>
                              {academicYear.academicYear}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.academicYearId}>
                    {errors.academicYearId ? labels.academicYearRequired : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <FormControl fullWidth>
                  <InputLabel required error={!!errors.classId}>
                    {labels.selectClass}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="classId"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select variant="standard" {...field}>
                        {classList &&
                          classList.map((classN) => (
                            <MenuItem key={classN.id} value={classN.id}>
                              {classN.className}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.classId}>
                    {errors.classId ? labels.classRequired : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <FormControl fullWidth>
                  <InputLabel required error={!!errors.divisionId}>
                    {labels.selectDivision}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="divisionId"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select variant="standard" {...field}>
                        {divisionList &&
                          divisionList.map((division) => (
                            <MenuItem key={division.id} value={division.id}>
                              {division.divisionName}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.divisionId}>
                    {errors.divisionId ? labels.divisionRequired : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <FormControl fullWidth>
                  <InputLabel required error={!!errors.termId}>
                    {labels.selectTerm}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="termId"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select variant="standard" {...field}>
                        {termList &&
                          termList.map((term) => (
                            <MenuItem key={term.id} value={term.id}>
                              {term.termName}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.termId}>
                    {errors.termId ? labels.termRequired : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <FormControl fullWidth>
                  <InputLabel required error={!!errors.examId}>
                    {labels.selectExam}
                  </InputLabel>
                  <Controller
                    control={control}
                    name="examId"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select variant="standard" {...field}>
                        {examList &&
                          examList.map((exam) => (
                            <MenuItem key={exam.id} value={exam.id}>
                              {exam.examName}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText error={!!errors.examId}>
                    {errors.examId ? labels.examRequired : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <Controller
                  control={control}
                  defaultValue={null}
                  name="student"
                  rules={{ required: true }}
                  render={({ field: { onChange, ...props } }) => (
                    <Autocomplete
                      options={studentList}
                      onChange={(_, newValue) => onChange(newValue)}
                      fullWidth
                      getOptionLabel={(option) => option.studentName}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          variant="standard"
                          {...params}
                          label={labels.selectStudent}
                          error={errors.student}
                          helperText={errors.student ? labels.studentRequired : null}
                        />
                      )}
                      {...props}
                    />
                  )}
                ></Controller>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              display="flex"
              spacing={4}
              gap={2}
              justifyContent="center"
              paddingTop={4}
            >
              <Button
                variant="contained"
                disabled={loading || !isValid}
                startIcon={<SearchOutlined />}
                onClick={findMarks}
              >
                {labels.search}
              </Button>
              <Button
                disabled={loading}
                variant="contained"
                color="warning"
                startIcon={<ClearOutlined />}
                onClick={() => {
                  reset();
                  setMarks([]);
                  setRowModes([]);
                }}
              >
                {labels.clear}
              </Button>
              <Button
                variant="contained"
                disabled={loading || !isValid}
                // onClick={findMarks}
                onClick={() => {
                  // setPrintData("");
                  handleMarksPrintData();
                  handleStudentPrintData();
                  // handlePrint();
                  setIsReady("none");
                  console.log("sem1MarksPrintData", sem1MarksPrintData);
                  console.log("studentPrintData", studentPrintData);
                }}
              >
                {labels.printReport}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={language}>
                <DataGrid
                  hideFooter={true}
                  editMode="row"
                  autoHeight
                  getRowId={(row) => row.id}
                  rowModesModel={rowModes}
                  onRowEditStart={handleRowEditStart}
                  onRowEditStop={handleRowEditStop}
                  onRowModesModelChange={(newModel) => setRowModes(newModel)}
                  processRowUpdate={processRowUpdate}
                  onProcessRowUpdateError={(error) => setError(JSON.stringify(error))}
                  sx={{
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  density="compact"
                  rows={marks}
                  columns={columns}
                  experimentalFeatures={{ newEditingApi: true }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              container
              direction="row"
              display="flex"
              spacing={4}
              gap={2}
              justifyContent="center"
              paddingTop={4}
            >
              <Button
                variant="contained"
                startIcon={<UpdateOutlined />}
                disabled={marks.length == 0 || !isValid || loading}
                onClick={updateMarks}
              >
                <span>{labels.updateMarks}</span>
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Snackbar
        open={error?.length > 0}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: "100%" }} onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Index;

function EditCellComponent(props) {
  const { id, value: valueProp, field, colDef } = props;
  const [value, setValue] = React.useState(valueProp);
  const apiRef = useGridApiContext();

  const handleValueChange = (event) => {
    const newValue = event.target.value; // The new value entered by the user

    apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 });
    setValue(newValue);
  };
  React.useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);
  let typ = colDef.type === "number" ? "number" : "text";
  let cmp = (
    <TextField
      type={typ}
      error={props.error}
      value={value}
      size="small"
      onChange={handleValueChange}
      fullWidth
    />
  );
  if (props.error) {
    cmp = <Tooltip title={props.errorText ?? ""}>{cmp}</Tooltip>;
  }
  return cmp;
}
