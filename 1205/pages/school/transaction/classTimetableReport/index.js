import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
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
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import ClassTimetableReportToPrint from "../../../../components/school/ClassTimetableReportToPrint";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";

const Index = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [classTimetableReport, setClassTimetableReport] = useState();
  const [classTimetableTeachersReport, setClassTimetableTeachersReport] = useState();
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

  const getSubjectList = () => {
    if (schoolId && classId && academicYearId && divisionId) {
      axios
        .get(
          `${urls.SCHOOL}/mstAcademicSubject/getFilterSubject?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}`,
        )
        .then((r) => {
          console.log("res");
          const subjectList = r.data?.map(({ id, subjectName }) => ({
            value: id,
            label: subjectName,
          }));
          setSubjectList(subjectList);
        });
    }
  };

  const getTeacherList = () => {
    if (schoolId && classId && academicYearId && divisionId) {
      axios.get(`${urls.SCHOOL}/mstTeacher/getTeacherList?schoolKey=${schoolId}`).then((r) => {
        console.log("mstTeacher", r);
        const teacherList = r.data?.map(({ id, firstName, middleName, lastName }) => ({
          value: id,
          label: `${firstName} ${middleName} ${lastName}`,
        }));
        setTeacherList(teacherList);
      });
    }
  };

  useEffect(() => {
    getSubjectList();
    getTeacherList();
  }, [schoolId, classId, academicYearId, divisionId]);

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
  useEffect(() => {
    if (classTimetableTeachersReport && classTimetableReport) {
      handlePrint();
    }
  }, [classTimetableReport, classTimetableTeachersReport]);

  const findReport = async (formValue) => {
    setLoading(true);
    try {
      await axios
        .get(
          `${urls.SCHOOL}/trnClassTimetable/getTimetableForDivision?schoolKey=${formValue.schoolId}&academicYearKey=${formValue.academicYearId}&classKey=${formValue.classId}&divisionKey=${formValue.divisionId}`,
        )
        .then((r) => {
          console.log("response", r);
          if (r.status === 200) {
            setClassTimetableReport(r?.data?.trnClassTimetableList);
            let _teacherSub = r?.data?.trnClassTimetableList[0]?.subjectWiseTeacherDao?.map((i) => {
              return {
                id: i?.id,
                subjectName: subjectList?.find((sub) => sub?.value === i?.subjectKey)?.label,
                teacherName: teacherList?.find((teacher) => teacher?.value === i?.teacherKey)?.label,
              };
            });
            setClassTimetableTeachersReport(_teacherSub);
            // console.log("_teacherSub", _teacherSub);
            // handlePrint();
            setIsReady("none");
          }
        });
      // setIsReady("none");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("classTimetableReport", classTimetableReport);

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
            <h2 style={{ marginBottom: 0 }}>{labels.classTimetableReport}</h2>
          </Grid>
        </Grid>
        <Paper style={{ display: isReady }}>
          {classTimetableReport && classTimetableTeachersReport && (
            <ClassTimetableReportToPrint
              ref={componentRef}
              data={classTimetableReport}
              teacherSubData={classTimetableTeachersReport}
            />
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
                    setClassTimetableReport();
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
