import {
  AddOutlined,
  ClearOutlined,
  SaveOutlined,
  ToggleOff,
  ToggleOn,
  UpdateOutlined,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
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
  Slide,
  Snackbar,
  TextField,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";
import { nextTick } from "../../../../util/util";

const Index = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });

  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [exam, setExam] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [termList] = useState([
    { id: 1, termName: "Term 1" },
    { id: 2, termName: "Term 2" },
  ]);

  const language = useSelector((state) => state.labels.language);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  useEffect(() => setLabels(schoolLabels[language ?? "en"]), [setLabels, language]);

  const schoolId = watch("schoolId");
  const classId = watch("classId");
  const [examList, setExamList] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    Promise.all([getSchoolList(), getAcademicYearList()]);
  }, []);

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
  }, [schoolId, setValue]);

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
      setLoading(true);
      try {
        fetchExams(page, rowsPerPage);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    getExamList();
  }, [page, rowsPerPage, setValue, setError]);

  const fetchExams = async (pageNo, pageSize) => {
    const { data } = await axios.get(`${urls.SCHOOL}/mstExam/getAll`, {
      params: { pageSize, pageNo },
    });
    setExamList(data.mstExamList);
    setTotalElements(data.totalElements);
  };

  const onSubmitForm = async (formData) => {
    const payload = exam == null ? {} : { id: exam.id };
    try {
      let body = {
        ...payload,
        schoolKey: formData.schoolId,
        classKey: formData.classId,
        divisionKey: formData.divisionId,
        academicYearKey: formData.academicYearId,
        schoolName: schoolList?.find((item) => item?.id === formData.schoolId)?.schoolName,
        className: classList?.find((item) => item?.id === formData.classId)?.className,
        divisionName: divisionList?.find((item) => item?.id === formData.divisionId)?.divisionName,
        academicYearName: `${
          academicYearList?.find((item) => item?.id === formData.academicYearId)?.academicYear
        }`,
        examName: formData.examName,
        examDate: formData.examDate.toISOString(),
        outOfMarks: parseFloat(formData.outOfMarks),
        fromTime: formData.examFromTime.toISOString(),
        toTime: formData.examToTime.toISOString(),
        activeFlag: "Y",
      };

      await axios.post(`${urls.SCHOOL}/mstExam/save`, body);
      sweetAlert(labels.success, exam == null ? labels.examSaved : labels.examUpdated, "success");
      setExam(null);
      handleExitClick();
      setLoading(true);
      await fetchExams(page, rowsPerPage);
    } catch (e) {
      sweetAlert(labels.error, e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => async () => {
    if (isOpenCollapse) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${urls.SCHOOL}/mstExam/getById?id=${id}`);
      const {
        schoolKey,
        academicYearKey,
        classKey,
        divisionKey,
        examName,
        examDate,
        fromTime,
        toTime,
        outOfMarks,
      } = data;
      setValue("schoolId", schoolKey);
      setValue("academicYearId", academicYearKey);
      setValue("termId", 1);
      setValue("examName", examName);
      setValue("examDate", moment(examDate));
      setValue("examFromTime", moment(fromTime));
      setValue("examToTime", moment(toTime));
      setValue("outOfMarks", outOfMarks);
      await nextTick(100);
      setValue("classId", classKey);
      await nextTick(100);
      setValue("divisionId", divisionKey);
      setIsOpenCollapse(true);
      setSlideChecked(true);
      setExam({ ...data });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteClick = (id, activeFlag) => async () => {
    if (isOpenCollapse) {
      return;
    }
    setLoading(true);
    try {
      const result = await sweetAlert({
        title: activeFlag === "Y" ? labels.deactivate : labels.activate,
        text: activeFlag === "Y" ? labels.areYouSureToDeactivate : labels.areYouSureToActivate,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (result) {
        const body = {
          activeFlag: activeFlag === "Y" ? "N" : "Y",
          id,
        };
        await axios.post(`${urls.SCHOOL}/mstExam/save`, body);
        sweetAlert(
          labels.success,
          activeFlag === "Y" ? labels.deactivateSuccess : labels.activateSuccess,
          "success",
        );
        await fetchExams(page, rowsPerPage);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExitClick = () => {
    reset({
      keepDirtyValues: false,
      keepErrors: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false,
    });
    setExam(null);
    setIsOpenCollapse(false);
    setSlideChecked(false);
  };

  const columns = [
    {
      field: "id",
      headerName: labels.srNo,
      type: "number",
      width: 100,
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
      headerName: labels.division,
      flex: 1,
    },
    {
      field: "examName",
      headerName: labels.examName,
      flex: 1,
    },
    {
      field: "examDate",
      headerName: labels.examDate,
      valueFormatter: ({ value }) => (value != null ? moment(value).format("DD-MM-YYYY") : ""),
      flex: 1,
    },
    {
      field: "fromTime",
      headerName: labels.examFromTime,
      valueFormatter: ({ value }) => (value != null ? moment(value).format("hh:mm A") : ""),
      flex: 1,
    },
    {
      field: "toTime",
      headerName: labels.examToTime,
      valueFormatter: ({ value }) => (value != null ? moment(value).format("hh:mm A") : ""),
      flex: 1,
    },
    {
      field: "actions",
      headerName: labels.actions,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ id, row }) => {
        return [
          row.activeFlag === "Y" ? (
            <GridActionsCellItem
              key={`${id}_edit`}
              icon={<EditIcon />}
              label={labels.edit}
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
          ) : (
            <></>
          ),
          <GridActionsCellItem
            key={`${id}_toggle`}
            icon={row.activeFlag === "Y" ? <ToggleOn /> : <ToggleOff />}
            label={labels.toggle}
            onClick={handleDeleteClick(id, row.activeFlag)}
            color={row.activeFlag === "Y" ? "success" : "error"}
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
            <h2 style={{ marginBottom: 0 }}>{labels.exam}</h2>
          </Grid>
        </Grid>
        {isOpenCollapse && (
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={language}>
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
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
                            <Select variant="standard" {...field}>
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
                        <Controller
                          control={control}
                          name="examName"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={labels.examName}
                              variant="standard"
                              required
                              error={!!errors.examName}
                              helperText={errors.examName ? labels.examNameRequired : null}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
                    <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                      <FormControl fullWidth>
                        <Controller
                          control={control}
                          name="examDate"
                          rules={{ required: true }}
                          defaultValue={null}
                          render={({ field }) => (
                            <DatePicker
                              label={<span className="required">{labels.examDate}</span>}
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              {...field}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  fullWidth
                                  error={!!errors.examDate}
                                  helperText={errors.examDate ? labels.examDateRequired : null}
                                />
                              )}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                      <FormControl fullWidth>
                        <Controller
                          control={control}
                          name="examFromTime"
                          rules={{ required: true }}
                          defaultValue={null}
                          render={({ field }) => (
                            <TimePicker
                              label={<span className="required">{labels.examFromTime}</span>}
                              variant="standard"
                              inputFormat="hh:mm a"
                              {...field}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  fullWidth
                                  error={!!errors.examFromTime}
                                  helperText={errors.examFromTime ? labels.examFromTimeRequired : null}
                                />
                              )}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                      <FormControl fullWidth>
                        <Controller
                          control={control}
                          name="examToTime"
                          rules={{ required: true }}
                          defaultValue={null}
                          render={({ field }) => (
                            <TimePicker
                              label={<span className="required">{labels.examToTime}</span>}
                              variant="standard"
                              inputFormat="hh:mm a"
                              {...field}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  fullWidth
                                  error={!!errors.examToTime}
                                  helperText={errors.examToTime ? labels.examToTimeRequired : null}
                                />
                              )}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" display="flex" spacing={4} justifyContent="center">
                    <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                      <FormControl fullWidth>
                        <Controller
                          control={control}
                          name="outOfMarks"
                          rules={{ required: true, min: 1 }}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={labels.outOfMarks}
                              variant="standard"
                              type="number"
                              error={!!errors.outOfMarks}
                              helperText={errors.outOfMarks ? labels.outOfMarksRequired : null}
                            />
                          )}
                        />
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
                    paddingTop={8}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || isSubmitting}
                      endIcon={exam == null ? <SaveOutlined /> : <UpdateOutlined />}
                    >
                      {exam == null ? labels.save : labels.update}
                    </Button>
                    <Button
                      disabled={loading || isSubmitting}
                      variant="contained"
                      color="warning"
                      endIcon={<ClearOutlined />}
                      onClick={() => reset()}
                    >
                      {labels.clear}
                    </Button>
                    <Button
                      disabled={loading || isSubmitting}
                      variant="contained"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => handleExitClick()}
                    >
                      {labels.exit}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Slide>
          </LocalizationProvider>
        )}
        <Grid
          container
          direction="row"
          display="flex"
          spacing={4}
          gap={2}
          justifyContent="flex-end"
          paddingTop={4}
        >
          <Button
            variant="contained"
            disabled={loading || isOpenCollapse}
            endIcon={<AddOutlined />}
            onClick={() => {
              setExam(null);
              setIsOpenCollapse(true);
              setSlideChecked(true);
            }}
          >
            {labels.add}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                printOptions: {
                  copyStyles: true,
                  hideToolbar: true,
                  hideFooter: true,
                },
              },
            }}
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
            pagination
            paginationMode="server"
            loading={loading}
            rowCount={totalElements}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            page={page}
            pageSize={rowsPerPage}
            rows={examList}
            columns={columns}
            isRowSelectable={() => false}
            onPageChange={(value) => setPage(value)}
            onPageSizeChange={(value) => setRowsPerPage(value)}
          />
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
