import {
    Alert,
    FormControl,
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
  import React, { useEffect, useState } from "react";
  import { useSelector } from "react-redux";
  import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
  import urls from "../../../../URLS/urls";
  
  const Index = () => {
    const [schoolList, setSchoolList] = useState([]);
    const [academicYearList, setAcademicYearList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [divisionList, setDivisionList] = useState([]);
    const [studentList, setStudentList] = useState([]);
  
    const [schoolId, setSchoolId] = useState("");
    const [academicYearId, setAcademicYearId] = useState("");
    const [classId, setClassId] = useState("");
    const [divisionId, setDivisionId] = useState("");
    const [selectedDate, handleDateChange] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
  
    const language = useSelector((state) => state?.labels?.language);
  
    const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  
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
        setClassId("");
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
    }, [schoolId, setClassId, setError, setIsOpen]);
  
    useEffect(() => {
      const getDivisionList = async () => {
        setDivisionId("");
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
    }, [classId, schoolId, setDivisionId, setIsOpen, setError]);
  
    useEffect(() => {
      const getStudents = async () => {
        if (
          schoolId == null ||
          schoolId === "" ||
          classId == null ||
          classId === "" ||
          divisionId == null ||
          divisionId === "" ||
          academicYearId == null ||
          academicYearId === ""
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
            presentAbsent: true,
          }));
          setStudentList(students);
        } catch (e) {
          setError(e.message);
          setIsOpen(true);
        }
      };
      getStudents();
    }, [classId, schoolId, divisionId, academicYearId, setIsOpen, setError]);
  
    const columns = [
      {
        field: "id",
        headerName: "Id",
        type: "number",
      },
      {
        field: "studentName",
        headerName: labels.studentName,
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
          <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
            <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
              <FormControl fullWidth>
                <InputLabel>{labels.selectSchool}</InputLabel>
                <Select variant="standard" value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>
                  {schoolList &&
                    schoolList.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.schoolName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
              <FormControl fullWidth>
                <InputLabel>{labels.selectAcademicYear}</InputLabel>
                <Select
                  value={academicYearId}
                  variant="standard"
                  onChange={(e) => setAcademicYearId(e.target.value)}
                >
                  {academicYearList &&
                    academicYearList.map((academicYear) => (
                      <MenuItem key={academicYear.id} value={academicYear.id}>
                        {academicYear.academicYear}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
            <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
              <FormControl fullWidth>
                <InputLabel>{labels.selectClass}</InputLabel>
                <Select variant="standard" value={classId} onChange={(e) => setClassId(e.target.value)}>
                  {classList &&
                    classList.map((classN) => (
                      <MenuItem key={classN.id} value={classN.id}>
                        {classN.className}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
              <FormControl fullWidth>
                <InputLabel>{labels.selectDivision}</InputLabel>
                <Select variant="standard" value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
                  {divisionList &&
                    divisionList.map((division) => (
                      <MenuItem key={division.id} value={division.id}>
                        {division.divisionName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
            <Grid item lg={2} md={3} sm={6} xs={12} display="flex" p={1}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  variant="standard"
                  inputFormat="DD/MM/YYYY"
                  label={<span style={{ fontSize: 16 }}>{labels.date}</span>}
                  value={selectedDate}
                  onChange={(date) => handleDateChange(moment(date).format("YYYY-MM-DD"))}
                  selected={selectedDate}
                  center
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      fullWidth
                      InputLabelProps={{ style: { fontSize: 12 } }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              headerName="Student List"
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
              density="compact"
              rows={studentList}
              columns={columns}
            />
          </Grid>
        </Grid>
        <Snackbar
          open={isOpen}
          autoHideDuration={10000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => {
            setIsOpen(!isOpen);
          }}
        >
          <Alert
            severity="error"
            sx={{ width: "100%" }}
            onClose={() => {
              setIsOpen(!isOpen);
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    );
  };
  
  export default Index;
  