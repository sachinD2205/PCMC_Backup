import { ClearOutlined, SearchOutlined, UpdateOutlined } from "@mui/icons-material";
import {
  Alert,
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";

const Index = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(() => setLabels(schoolLabels[language ?? "en"]), [setLabels, language]);
  const {
    watch,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const selectedDate = watch("selectedDate");
  const schoolId = watch("schoolId");
  const academicYearId = watch("academicYearId");
  const classId = watch("classId");
  const divisionId = watch("divisionId");

  useEffect(() => {
    const getSchoolList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstSchool/getAll`);
        const schools = data.mstSchoolList.map(({ id, schoolName }) => ({
          id,
          schoolName,
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
    getSchoolList();
    getAcademicYearList();
  }, [setError]);

  useEffect(() => {
    const getClassList = async () => {
      setValue("classId", "");
      if (schoolId == null || schoolId === "") {
        setClassList([]);
        return;
      }
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`);
        const classes = data.mstClassList.map(({ id, className }) => ({
          id,
          className,
        }));
        setClassList(classes);
      } catch (e) {
        setError(e.message);
      }
    };
    getClassList();
  }, [schoolId, setValue, setError]);

  useEffect(() => {
    const getDivisionList = async () => {
      setValue("divisionId", "");
      if (schoolId == null || schoolId === "" || classId == null || classId === "") {
        setDivisionList([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`,
        );
        const divisions = data.mstDivisionList.map(({ id, divisionName }) => ({
          id,
          divisionName,
        }));
        setDivisionList(divisions);
      } catch (e) {
        setError(e.message);
      }
    };
    getDivisionList();
  }, [classId, schoolId, setValue, setError]);

  const findAttendance = async (formValue) => {
    try {
      setLoading(true);
      const [attRes, divRes] = await Promise.all([
        axios.get(
          `${urls.SCHOOL}/trnStudentAttendance/getAttendanceForDivision?schoolKey=${
            formValue.schoolId
          }&academicYearKey=${formValue.academicYearId}&classKey=${formValue.classId}&divKey=${
            formValue.divisionId
          }&yearKey=${moment(formValue.selectedDate).format("YYYY")}&monthKey=${moment(
            formValue.selectedDate,
          ).format("MM")}&dateKey=${moment(formValue.selectedDate).format("DD")}`,
        ),
        axios.get(
          `${urls.SCHOOL}/mstStudent/getAllStudentByDiv?schoolKey=${formValue.schoolId}&acYearKey=${formValue.academicYearId}&classKey=${formValue.classId}&divKey=${formValue.divisionId}`,
        ),
      ]);
      const students = attRes.data.trnStudentAttendanceList.map(({ id, ...props }) => ({
        id,
        studentKey: props.studentKey,
        studentFirstName: props.studentFirstName,
        studentMiddleName: props.studentMiddleName,
        studentLastName: props.studentLastName,
        grNumber: props.grNumber ?? 0,
        studentGeneralAdmissionNumber: 0,
        present: props.studentPresentAbsent === "P",
      }));
      const divisionStudents = divRes.data.mstStudentList.map(({ id, ...props }) => ({
        id: nanoid(),
        studentKey: id,
        studentFirstName: props.firstName,
        studentMiddleName: props.middleName,
        studentLastName: props.lastName,
        grNumber: props.grNumber ?? 0,
        studentGeneralAdmissionNumber: 0,
        present: true,
      }));
      const studentKeys = students.map(({ studentKey }) => studentKey);
      const missingStudents = divisionStudents.filter(({ studentKey }) => !studentKeys.includes(studentKey));
      setStudentList([...students, ...missingStudents]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async () => {
    try {
      setLoading(true);
      const isValid = await trigger();
      if (!isValid) {
        setLoading(false);
        return;
      }
      const attendanceList = studentList.map(({ id, present, ...props }) => {
        const s = {
          schoolKey: schoolId,
          academicYearKey: academicYearId,
          classKey: classId,
          divisionKey: divisionId,
          yearKey: parseInt(moment(selectedDate).format("YYYY")),
          monthKey: parseInt(moment(selectedDate).format("MM")),
          dateKey: parseInt(moment(selectedDate).format("DD")),
          attendanceDate: moment(selectedDate).toISOString(),
          ...props,
          studentPresentAbsent: present ? "P" : "A",
          activeFlag: "Y",
        };
        if (typeof id === "number") {
          s.id = id;
        }
        return s;
      });
      await axios.post(`${urls.SCHOOL}/trnStudentAttendance/saveList`, attendanceList);
      swal(labels.success, labels.attendanceUpdated, "success");
    } catch (e) {
      swal(labels.error, e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const processRowUpdate = (newRow) => {
    const index = studentList.findIndex(({ id }) => id === newRow.id);
    const updatedStudentList = [...studentList];
    updatedStudentList[index] = newRow;
    setStudentList(updatedStudentList);
    return newRow;
  };

  const columns = [
    {
      field: "studentName",
      headerName: labels.studentName,
      valueGetter: ({ row }) => `${row.studentFirstName} ${row.studentMiddleName} ${row.studentLastName}`,
      flex: 1,
    },
    {
      field: "present",
      headerName: labels.presentAbsent,
      type: "boolean",
      editable: true,
      width: 200,
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
        paddingBottom: "30px",
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
            <h2 style={{ marginBottom: 0 }}>{labels.studentDailyAttendance}</h2>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(findAttendance)}>
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
                                {school.schoolName}
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
                    <FormHelperText error={!!errors.academicYearId}>
                      {errors.academicYearId ? labels.academicYearRequired : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
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
              </Grid>
              <Grid container direction="row" display="flex" justifyContent="center">
                <Grid item lg={2} md={3} sm={6} xs={12} display="flex" p={1}>
                  <Controller
                    control={control}
                    name="selectedDate"
                    rules={{ required: true }}
                    defaultValue={null}
                    render={({ field: { onChange, ...props } }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          label={<span className="required">{labels.date}</span>}
                          variant="standard"
                          inputFormat="DD/MM/YYYY"
                          {...props}
                          onChange={(date) => onChange(moment(date).format("YYYY-MM-DD"))}
                          selected={selectedDate}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              fullWidth
                              error={!!errors.selectedDate}
                              helperText={errors.selectedDate ? labels.dateRequired : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
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
                <Button variant="contained" startIcon={<SearchOutlined />} type="submit" disabled={loading}>
                  <span>{labels.search}</span>
                </Button>
                <Button
                  disabled={loading}
                  variant="contained"
                  color="warning"
                  startIcon={<ClearOutlined />}
                  onClick={() => {
                    reset();
                    setStudentList([]);
                  }}
                >
                  {labels.clear}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            getRowId={(row) => row.id}
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
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => setError(JSON.stringify(error))}
            density="compact"
            rows={studentList}
            columns={columns}
            experimentalFeatures={{ newEditingApi: true }}
          />
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
            disabled={studentList.length == 0 || loading}
            onClick={updateAttendance}
          >
            <span>{labels.updateAttendance}</span>
          </Button>
        </Grid>
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
