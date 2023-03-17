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
import React, { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";
import { useReactToPrint } from "react-to-print";
import StudentsAttendanceReportToPrint from "../../../../components/school/StudentsAttendanceReportToPrint";

const Index = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState();
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");

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

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const schoolId = watch("schoolId");
  const academicYearId = watch("academicYearId");
  const classId = watch("classId");
  const divisionId = watch("divisionId");

  console.log("fromDate", fromDate);
  console.log("toDate", toDate);

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

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  const findReport = async (formValue) => {
    setLoading(true);
    try {
      await axios
        .get(
          `${urls.SCHOOL}/trnStudentAttendance/getAttendanceReportByDate?schoolKey=${formValue.schoolId}
                &academicYearKey=${formValue.academicYearId}&classKey=${formValue.classId}&divKey=${
            formValue.divisionId
          }
                &fromDate=${moment(formValue.fromDate).format("DD/MM/YYYY")}&toDate=${moment(
            formValue.toDate,
          ).format("DD/MM/YYYY")}`,
        )
        .then((r) => {
          console.log("response", r);
          if (r.status === 200) {
            setStudentAttendance(r.data.trnStudentAttendanceList);
            handlePrint();
            setIsReady("none");
          }
        });
      } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("studentsAttData", studentAttendance);

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
            <h2 style={{ marginBottom: 0 }}>{labels.studentsAttendanceReport}</h2>
          </Grid>
        </Grid>
        <Paper style={{ display: isReady }}>
          {studentAttendance && (
            <StudentsAttendanceReportToPrint ref={componentRef} data={studentAttendance} />
          )}
        </Paper>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(findReport)}>
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
              <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
                <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                  <Controller
                    control={control}
                    name="fromDate"
                    rules={{ required: true }}
                    defaultValue={null}
                    render={({ field: { onChange, ...props } }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          label={<span className="required">{labels.fromDate}</span>}
                          variant="standard"
                          inputFormat="DD/MM/YYYY"
                          {...props}
                          onChange={(date) => onChange(moment(date).format("YYYY-MM-DD"))}
                          selected={fromDate}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              fullWidth
                              error={!!errors.fromDate}
                              helperText={errors.fromDate ? labels.dateRequired : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
                <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                  <Controller
                    control={control}
                    name="toDate"
                    rules={{ required: true }}
                    defaultValue={null}
                    render={({ field: { onChange, ...props } }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          label={<span className="required">{labels.toDate}</span>}
                          variant="standard"
                          inputFormat="DD/MM/YYYY"
                          {...props}
                          onChange={(date) => onChange(moment(date).format("YYYY-MM-DD"))}
                          selected={toDate}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              fullWidth
                              error={!!errors.toDate}
                              helperText={errors.toDate ? labels.dateRequired : null}
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
                  <span>{labels.generateReport}</span>
                </Button>

                <Button
                  disabled={loading}
                  variant="contained"
                  color="warning"
                  startIcon={<ClearOutlined />}
                  onClick={() => {
                    reset();
                    setStudentAttendance();
                  }}
                >
                  {labels.clear}
                </Button>
              </Grid>
            </Grid>
          </form>
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
