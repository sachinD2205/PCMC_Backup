import { EditFilled, SaveFilled } from "@ant-design/icons";
import { AddOutlined, CancelOutlined, ClearOutlined, ToggleOff, ToggleOn } from "@mui/icons-material";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  styled,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridRowModes, useGridApiContext } from "@mui/x-data-grid";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";

const Index = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [days, setDays] = useState([]);
  const [rowModes, setRowModes] = useState({});
  const [loading, setLoading] = useState(false);

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
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const schoolId = watch("schoolId");
  const academicYearId = watch("academicYearId");
  const classId = watch("classId");
  const divisionId = watch("divisionId");

  useEffect(() => {
    const getSchoolList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstSchool/getAll`);
        const schools = data.mstSchoolList.map(({ id, schoolName }) => ({ id, schoolName }));
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
    const getSubjectList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstSubject/getAll`);
        const subjectList = data.mstSubjectList.map(({ id, subjectName }) => ({
          value: id,
          label: subjectName,
        }));
        setSubjectList(subjectList);
      } catch (e) {
        setError(e.message);
      }
    };
    const getTeacherList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstTeacher/getAll`);
        const teacherList = data.mstTeacherList.map(({ id, firstName, middleName, lastName }) => ({
          value: id,
          label: `${firstName} ${middleName} ${lastName}`,
        }));
        setTeacherList(teacherList);
      } catch (e) {
        setError(e.message);
      }
    };
    Promise.all([getSchoolList(), getAcademicYearList(), getSubjectList(), getTeacherList()]);
  }, [setError, setValue]);

  useEffect(() => {
    const getClassList = async () => {
      if (schoolId == null || schoolId === "") {
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
      if (schoolId == null || schoolId === "" || classId == null || classId === "") {
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
    if (
      schoolId == null ||
      schoolId === "" ||
      classId == null ||
      classId === "" ||
      divisionId == null ||
      divisionId === ""
    ) {
      setDays([]);
      return;
    }
    const findTimetable = async ({ schoolId, classId, academicYearId, divisionId }) => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/trnClassTimetable/getTimetableForDivision?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}`,
        );
        const timetable = data.trnClassTimetableList.map(
          ({ id, weekDayKey, fromTime, toTime, subjectKey, teacherKey, activeFlag }) => ({
            id,
            day: weekDayKey,
            from: moment(fromTime, "HH:mm"),
            to: moment(toTime, "HH:mm"),
            subject: subjectKey ?? "",
            teacher: teacherKey ?? "",
            activeFlag: activeFlag === "Y",
          }),
        );
        setDays(timetable);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    findTimetable({ schoolId, classId, academicYearId, divisionId });
  }, [divisionId, schoolId, academicYearId, classId, setValue, setError]);

  const addNewRow = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    const id = nanoid();
    setDays((prev) => [
      ...prev,
      {
        id,
        day: "",
        from: "",
        to: "",
        subject: "",
        teacher: "",
        activeFlag: true,
        isNew: true,
      },
    ]);
    setRowModes((prev) => ({ ...prev, [id]: { mode: GridRowModes.Edit, fieldToFocus: "day" } }));
  };
  const handleEditClick = (id) => () => {
    setRowModes({ ...rowModes, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModes({ ...rowModes, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    if (typeof id === "number") {
      setLoading(true);
      const row = days.find((row) => row.id === id);
      try {
        const timetable = {
          id: id,
          schoolKey: schoolId,
          academicYearKey: academicYearId,
          classKey: classId,
          divisionKey: divisionId,
          weekDayKey: row.day,
          fromTime: row.from.format("HH:mm"),
          toTime: row.to.format("HH:mm"),
          subjectKey: row.subject,
          subjectName: subjectList.find((subject) => subject.value === row.subject)?.label,
          teacherKey: row.teacher,
          teacherName: teacherList.find((teacher) => teacher.value === row.teacher)?.label,
          activeFlag: !row.activeFlag ? "Y" : "N",
        };
        await axios.post(`${urls.SCHOOL}/trnClassTimetable/save`, timetable);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
      setDays([...days.filter((row) => row.id !== id), { ...row, activeFlag: !row.activeFlag }]);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModes({
      ...rowModes,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = days.find((row) => row.id === id);
    if (editedRow.isNew) {
      setDays(days.filter((row) => row.id !== id));
    }
  };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const processRowUpdate = async (newRow) => {
    // Save timetable
    setLoading(true);
    const timetable = {
      schoolKey: schoolId,
      academicYearKey: academicYearId,
      classKey: classId,
      divisionKey: divisionId,
      weekDayKey: newRow.day,
      fromTime: newRow.from.format("HH:mm"),
      toTime: newRow.to.format("HH:mm"),
      subjectKey: newRow.subject,
      subjectName: subjectList.find((subject) => subject.value === newRow.subject)?.label,
      teacherKey: newRow.teacher,
      schoolName: schoolList?.find((school) => school.id === schoolId)?.schoolName,
      className: classList?.find((item) => item.id === classId)?.className,
      divisionName: divisionList?.find((item) => item.id === divisionId)?.divisionName,
      teacherName: teacherList.find((teacher) => teacher.value === newRow.teacher)?.label,
      activeFlag: newRow.activeFlag ? "Y" : "N",
    };
    if (typeof newRow.id === "number") {
      timetable.id = newRow.id;
    }
    const { data } = await axios.post(`${urls.SCHOOL}/trnClassTimetable/save`, timetable);
    setLoading(false);
    const updatedRow = { ...newRow, isNew: false, id: data.id };
    setDays(days.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const isDisableAdd = () => {
    if (schoolId == null || academicYearId == null || classId == null || divisionId == null) {
      return true;
    }
    if (schoolId == "" || academicYearId == "" || classId == "" || divisionId == "") {
      return true;
    }
    return false;
  };

  const columns = [
    {
      field: "day",
      headerName: labels.day,
      type: "singleSelect",
      width: 150,
      editable: true,
      valueFormatter: ({ value }) => labels[value],
      valueOptions: [
        { value: "2", label: labels[2] },
        { value: "3", label: labels[3] },
        { value: "4", label: labels[4] },
        { value: "5", label: labels[5] },
        { value: "6", label: labels[6] },
        { value: "7", label: labels[7] },
      ],
      preProcessEditCellProps: ({ props }) => {
        const hasError = props.value === "";
        return { ...props, error: hasError };
      },
    },
    {
      field: "from",
      headerName: labels.from,
      type: "time",
      width: 150,
      editable: true,
      valueFormatter: ({ value }) => (moment.isMoment(value) ? value.format("hh:mm A") : ""),
      renderEditCell: (params) => <GridEditTimeCell {...params} />,
      preProcessEditCellProps: ({ props }) => ({ ...props, error: props.value == null }),
    },
    {
      field: "to",
      headerName: labels.to,
      type: "time",
      width: 150,
      editable: true,
      valueFormatter: ({ value }) => (moment.isMoment(value) ? value.format("hh:mm A") : ""),
      renderEditCell: (params) => <GridEditTimeCell {...params} />,
      preProcessEditCellProps: ({ props }) => ({ ...props, error: props.value == null }),
    },
    {
      field: "subject",
      headerName: labels.subject,
      type: "singleSelect",
      flex: 1,
      editable: true,
      valueFormatter: ({ value }) => subjectList.find((subject) => subject.value === value)?.label,
      valueOptions: subjectList,
      preProcessEditCellProps: ({ props }) => ({ ...props, error: props.value === "" }),
    },
    {
      field: "teacher",
      headerName: labels.teacher,
      type: "singleSelect",
      flex: 1,
      editable: true,
      valueFormatter: ({ value }) => teacherList.find((teacher) => teacher.value === value)?.label,
      valueOptions: teacherList,
      preProcessEditCellProps: ({ props }) => ({ ...props, error: props.value === "" }),
    },
    {
      field: "actions",
      type: "actions",
      headerName: labels.actions,
      width: 150,
      getActions: ({ id, row }) => {
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
          row.activeFlag ? (
            <GridActionsCellItem
              key={`${id}_edit`}
              icon={<EditFilled />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
          ) : (
            <></>
          ),
          <GridActionsCellItem
            key={`${id}_toggle`}
            icon={row.activeFlag ? <ToggleOn /> : <ToggleOff />}
            label="Toggle"
            onClick={handleDeleteClick(id)}
            color={row.activeFlag ? "success" : "error"}
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
            <h2 style={{ marginBottom: 0 }}>{labels.addNewTimetable}</h2>
          </Grid>
        </Grid>
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
              <Button
                variant="contained"
                disabled={isDisableAdd() || loading}
                startIcon={<AddOutlined />}
                onClick={addNewRow}
              >
                {labels.add}
              </Button>
              <Button
                disabled={loading}
                variant="contained"
                color="warning"
                startIcon={<ClearOutlined />}
                onClick={() => reset()}
              >
                {labels.clear}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={language}>
                <DataGrid
                  headerName={labels.periodList}
                  hideFooter={true}
                  editMode="row"
                  autoHeight
                  rowModesModel={rowModes}
                  onRowModesModelChange={(newModel) => setRowModes(newModel)}
                  onRowEditStart={handleRowEditStart}
                  onRowEditStop={handleRowEditStop}
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
                  rows={days}
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
            ></Grid>
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

const GridEditTimeInput = styled(InputBase)({
  fontSize: "inherit",
  padding: "0 9px",
});
function GridEditTimeCell({ id, field, value }) {
  const apiRef = useGridApiContext();

  const handleChange = (newValue) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <TimePicker
      value={value}
      renderInput={({ inputRef, inputProps, InputProps, disabled, error }) => (
        <GridEditTimeInput
          fullWidth
          autoFocus
          ref={inputRef}
          {...InputProps}
          disabled={disabled}
          error={error}
          inputProps={inputProps}
        />
      )}
      onChange={handleChange}
    />
  );
}

export default Index;
