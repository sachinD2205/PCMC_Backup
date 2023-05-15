import { yupResolver } from "@hookform/resolvers/yup";
import { Add, Delete } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  styled,
} from "@mui/material";
import { DataGrid, useGridApiContext } from "@mui/x-data-grid";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import timeTableSchema from "../../../../containers/schema/school/transactions/timeTableSchema";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";

const Index = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  const [timeTable, setTimeTable] = useState([]);
  const [newStateTableData, setNewStateTableData] = useState([]);
  const [timeTableTeachersList, setTimeTableTeachersList] = useState([]);
  const [Id, setId] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [teacherSubText, setTeacherSubText] = useState("addTeacher");
  const [timetableText, setTimetableText] = useState("addTimetable");
  const [teacherSubId, setTeacherSubId] = useState();
  const [timetableId, setTimetableId] = useState();
  const [tempOldData, setTempOldData] = useState([]);
  const [tempOldTimetableData, setTempOldTimetableData] = useState([]);

  const [error, setError] = useState(null);

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(() => setLabels(schoolLabels[language ?? "en"]), [setLabels, language]);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(timeTableSchema),
    mode: "onChange",
    defaultValues: {
      id: null,
    },
  });
  const {
    watch,
    control,
    trigger,
    reset,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = methods;

  const schoolId = watch("schoolId");
  const academicYearId = watch("academicYearId");
  const classId = watch("classId");
  const divisionId = watch("divisionId");

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

  useEffect(() => {
    getSubjectList();
  }, [schoolId, classId, academicYearId, divisionId]);

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
    getTeacherList();
  }, [schoolId, classId, academicYearId, divisionId]);

  useEffect(() => {}, []);

  useEffect(() => {
    const getSchoolList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstSchool/getAll`);
        const schools = data?.mstSchoolList.map(({ id, schoolName, schoolNameMr }) => ({
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
        const academicYears = data?.mstAcademicYearList.map(({ id, academicYear }) => ({ id, academicYear }));
        setAcademicYearList(academicYears);
      } catch (e) {
        setError(e.message);
      }
    };
    Promise.all([getSchoolList(), getAcademicYearList()]);
  }, [setError, setValue]);

  useEffect(() => {
    const getClassList = async () => {
      if (schoolId == null || schoolId === "") {
        // setValue("classId", "");

        setClassList([]);
        return;
      }
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`);
        const classes = data?.mstClassList.map(({ id, className }) => ({ id, className }));
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
        // setValue("divisionId", "");
        setDivisionList([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`,
        );
        const divisions = data?.mstDivisionList.map(({ id, divisionName }) => ({ id, divisionName }));
        setDivisionList(divisions);
      } catch (e) {
        setError(e.message);
      }
    };
    getDivisionList();
  }, [classId, schoolId, setValue, setError]);

  useEffect(() => {
    console.log("newStateTableData", newStateTableData);
  }, [newStateTableData]);

  const isDisableAddSubndTime = () => {
    if (
      watch("fromTime") == null ||
      watch("toTime") == null ||
      watch("monDay") == null ||
      watch("tuesDay") == null ||
      watch("wednesDay") == null ||
      watch("thursday") == null ||
      watch("friDay") == null ||
      watch("saturDay") == null
    ) {
      return true;
    }
    if (
      watch("monDay") == "" ||
      watch("tuesDay") == "" ||
      watch("wednesDay") == "" ||
      watch("thursday") == "" ||
      watch("friDay") == "" ||
      watch("saturDay") == "" ||
      watch("saturDay") == ""
    ) {
      return true;
    }
    return false;
  };
  const isDisableAddSubndTeacher = () => {
    if (watch("teacherKey") == null || watch("subjectKey") == null) {
      return true;
    }
    if (watch("teacherKey") == "" || watch("subjectKey") == "") {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log("aala re timetable", timeTable);
  }, [timeTable]);

  const findTimetable = () => {
    if (schoolId && academicYearId && classId && divisionId) {
      axios
        .get(
          `${urls.SCHOOL}/trnClassTimetable/getTimetableForDivision?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}`,
        )
        .then((r) => {
          let result = r.data?.trnClassTimetableList;
          console.log("result", result);

          if (r.data?.trnClassTimetableList[0]?.timeTableDao?.length > 0) {
            setNewStateTableData(
              r.data?.trnClassTimetableList[0]?.timeTableDao?.map((i) => {
                return {
                  // fromTime: moment(i?.fromTime).format("HH:mm a"),
                  // toTime: moment(i?.toTime).format("HH:mm a"),

                  fromTime: i?.fromTime,
                  toTime: i?.toTime,
                  id: i?.id,
                  activeFlag: i?.activeFlag,
                  classTimeTableKey: i.classTimeTableKey,
                  // periodDao: {
                  periodDaoId: i?.periodDao?.id,
                  periodtimeTableKey: i?.periodDao?.timeTableKey,
                  monDay: i?.periodDao?.monDay,
                  tuesDay: i?.periodDao?.tuesDay,
                  wednesDay: i?.periodDao?.wednesDay,
                  thursday: i?.periodDao?.thursday,
                  friDay: i?.periodDao?.friDay,
                  saturDay: i?.periodDao?.saturDay,
                  // },
                };
              }),
            );
          }
          if (result[0]?.activeFlag == "Y") {
            setBtnSaveText("Update");
            setId(result[0]?.id);
          }
          console.log("result", result);
          let _res = result?.map((r, i) => {
            return {
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1,
              schoolName: r.schoolName,
              className: r.className,
              schoolKey: r.schoolKey,
              academicYearKey: r.academicYearKey,
              academicYearName: r.academicYearName,
              classKey: r.classKey,
              divisionKey: r.divisionKey,
              divisionName: r.divisionName,
              timeTableDao: r?.timeTableDao?.map((i) => {
                return {
                  id: i.id,
                  fromTime: i?.fromTime,
                  toTime: i?.toTime,
                  // periodid: i?.periodDao?.id,
                  monDay: i?.periodDao?.monDay,
                  tuesDay: i?.periodDao?.tuesDay,
                  wednesDay: i?.periodDao?.wednesDay,
                  thursday: i?.periodDao?.thursday,
                  friDay: i?.periodDao?.friDay,
                  saturDay: i?.periodDao?.saturDay,
                };
              }),
              subjectWiseTeacherDao: r?.subjectWiseTeacherDao?.map((i) => {
                return {
                  id: i?.id,
                  classTimeTableKey: i?.classTimeTableKey,
                  teacherKey: i?.teacherKey,
                  subjectKey: i?.subjectKey,
                  subjectName: subjectList?.find((sub) => sub?.value === i?.subjectKey)?.label,
                  teacherName: teacherList?.find((teacher) => teacher?.value == i?.teacherKey)?.label,
                };
              }),
            };
          });
          console.log("_res", _res[0]?.timeTableDao);
          console.log("subjectWiseTeacherDao", _res[0]?.subjectWiseTeacherDao);
          let a = _res[0]?.timeTableDao ?? [];
          let b = _res[0]?.subjectWiseTeacherDao ?? [];

          setTimeTable(a);
          setTimeTableTeachersList(b);
        });
    }
  };
  useEffect(() => {
    findTimetable();
  }, [subjectList, teacherList]);

  const updateTimetableList = (rowData, action) => {
    console.log("tableData123", timeTable);
    console.log("rowData", rowData, action);

    if (action == "delete") {
      setTimeTable(() => {
        // @ts-ignore
        return timeTable?.filter((obj) => obj.id != rowData.id);
      });

      let _updatedData = newStateTableData?.map((obj) => {
        if (obj.id === rowData.id) {
          return { ...obj, activeFlag: "N" };
        } else {
          return obj;
        }
      });
      console.log("_updatedData", _updatedData);
      setNewStateTableData(_updatedData);
      // setNewStateTableData(() => {
      //   return newStateTableData?.filter((obj) => (obj.activeFlag = "N"));
      // });
    } else if (action == "UpdateTimetable") {
      console.log("rowData", rowData);

      let _updatedTimetable = newStateTableData?.map((row) => {
        if (row.id === timetableId) {
          return {
            ...rowData,
            fromTime: moment(rowData.fromTime).format("HH:mm a"),
            toTime: moment(rowData.toTime).format("HH:mm a"),
            id: timetableId,
            classTimeTableKey: row?.classTimeTableKey,
            periodtimeTableKey: row?.periodtimeTableKey,
            activeFlag: "Y",
            periodDaoId: row?.periodDaoId,
          };
        } else {
          return row;
        }
      });
      console.log("_updatedTimetable", _updatedTimetable);
      // setTimeTable(_updatedTimetable);
      setNewStateTableData(_updatedTimetable);
      setTimetableText("addTimetable");

      if (newStateTableData) {
        setTempOldTimetableData(_updatedTimetable);
      }
    } else {
      // @ts-ignore
      console.log("aaala", newStateTableData);
      // setNewStateTableData((oldData) => {
      //   return [...oldData, tableRow];
      // });
      setNewStateTableData((oldData) => {
        return [
          ...oldData,
          {
            // tableRow,
            fromTime: moment(rowData.fromTime).format("HH:mm a"),
            toTime: moment(rowData.toTime).format("HH:mm a"),
            monDay: rowData?.monDay,
            tuesDay: rowData?.tuesDay,
            wednesDay: rowData?.wednesDay,
            thursday: rowData?.thursday,
            friDay: rowData?.friDay,
            saturDay: rowData?.saturDay,
            // @ts-ignore
            id: (newStateTableData[newStateTableData?.length - 1]?.id ?? 0) + 1,
          },
        ];
      });
      if (newStateTableData) {
        setTempOldTimetableData((oldData) => {
          return [
            ...newStateTableData,
            {
              fromTime: moment(rowData.fromTime).format("HH:mm a"),
              toTime: moment(rowData.toTime).format("HH:mm a"),
              monDay: rowData?.monDay,
              tuesDay: rowData?.tuesDay,
              wednesDay: rowData?.wednesDay,
              thursday: rowData?.thursday,
              friDay: rowData?.friDay,
              saturDay: rowData?.saturDay,
              // id: (timeTableTeachersList[timeTableTeachersList?.length - 1]?.id ?? 0) + 1,
              id: null,
            },
          ];
        });
      }
    }
  };
  console.log("timeTable", timeTable);
  console.log("timeTableTeachersList", timeTableTeachersList);

  // ----------------- update and delete timetableTeacher and subjects-------------------------------------------------
  const updateTimetableTeachersList = (rowData, action) => {
    console.log("rowData", rowData, action);

    if (action == "delete") {
      setTimeTableTeachersList(() => {
        // @ts-ignore
        return timeTableTeachersList?.filter((obj) => obj.id != rowData.id);
      });
    } else if (action == "UpdateTeacherSub") {
      let _updatedRows = timeTableTeachersList?.map((row) => {
        if (row.id === teacherSubId) {
          return {
            ...rowData,
            id: teacherSubId,
            classTimeTableKey: row?.classTimeTableKey,
            subjectName: subjectList?.find((sub) => sub?.value === rowData?.subjectKey)?.label,
            teacherName: teacherList?.find((teacher) => teacher?.value == rowData?.teacherKey)?.label,
          };
        } else {
          return row;
        }
      });
      console.log("_updatedRows", _updatedRows);
      setTimeTableTeachersList(_updatedRows);
      setTempOldData(_updatedRows);
      setTeacherSubText("addTeacher");
    } else {
      // @ts-ignore
      setTimeTableTeachersList((oldData) => {
        return [
          ...oldData,
          {
            teacherKey: rowData.teacherKey,
            subjectKey: rowData.subjectKey,
            subjectName: subjectList?.find((sub) => sub?.value === rowData?.subjectKey)?.label,
            teacherName: teacherList?.find((teacher) => teacher?.value == rowData?.teacherKey)?.label,
            id: (timeTableTeachersList[timeTableTeachersList?.length - 1]?.id ?? 0) + 1,
            // id: null,
          },
        ];
      });

      if (timeTableTeachersList) {
        setTempOldData((oldData) => {
          return [
            ...timeTableTeachersList,
            {
              teacherKey: rowData.teacherKey,
              subjectKey: rowData.subjectKey,
              subjectName: subjectList?.find((sub) => sub?.value === rowData?.subjectKey)?.label,
              teacherName: teacherList?.find((teacher) => teacher?.value == rowData?.teacherKey)?.label,
              // id: (timeTableTeachersList[timeTableTeachersList?.length - 1]?.id ?? 0) + 1,
              id: null,
            },
          ];
        });
      }
    }
  };
  // -------------------------------------------------------------------------------------------------------------------

  const finalSubmit = (data) => {
    // data for Save new timetable--------------------------------------------------------------------------------------

    let _newTimetable = newStateTableData?.map((data) => {
      return {
        // id: data?.id,
        fromTime: data?.fromTime,
        toTime: data?.toTime,
        // activeFlag: data?.activeFlag,
        periodDao: {
          monDay: data?.monDay,
          tuesDay: data?.tuesDay,
          wednesDay: data?.wednesDay,
          thursday: data?.thursday,
          friDay: data?.friDay,
          saturDay: data?.saturDay,
          // id: data?.periodDaoId,
          // activeFlag: "Y",
        },
      };
    });

    let _newteacherSub = timeTableTeachersList?.map((data) => {
      return {
        // id: data?.id,
        subjectKey: data?.subjectKey,
        teacherKey: data?.teacherKey,
      };
    });

    const _data = {
      schoolKey: schoolId,
      schoolName: schoolList?.find((school) => school?.id === schoolId)?.schoolName,

      academicYearKey: academicYearId,
      academicYearName: academicYearList?.find((AY) => AY?.id === academicYearId)?.academicYear,

      classKey: classId,
      className: classList?.find((item) => item.id === classId)?.className,

      divisionKey: divisionId,
      divisionName: divisionList?.find((item) => item.id === divisionId)?.divisionName,

      timeTableDao: _newTimetable,
      subjectWiseTeacherDao: _newteacherSub,
      activeFlag: "Y",
    };

    // data for Update timetable--------------------------------------------------------------------------------------------------

    let _newStateTableData = tempOldTimetableData?.map((data) => {
      return {
        id: data?.id,
        classTimeTableKey: data?.classTimeTableKey,
        fromTime: data?.fromTime,
        toTime: data?.toTime,
        activeFlag: data?.activeFlag,
        periodDao: {
          monDay: data?.monDay,
          tuesDay: data?.tuesDay,
          wednesDay: data?.wednesDay,
          thursday: data?.thursday,
          friDay: data?.friDay,
          saturDay: data?.saturDay,
          timeTableKey: data?.periodtimeTableKey,
          id: data?.periodDaoId,
          activeFlag: "Y",
        },
      };
    });

    let _teacherSub = tempOldData?.map((data) => {
      return {
        id: data?.id,
        classTimeTableKey: data?.classTimeTableKey,
        subjectKey: data?.subjectKey,
        teacherKey: data?.teacherKey,
      };
    });

    let _payLoad = {
      id: Id,
      schoolKey: schoolId,
      schoolName: schoolList?.find((school) => school?.id === schoolId)?.schoolName,

      academicYearKey: academicYearId,
      academicYearName: academicYearList?.find((AY) => AY?.id === academicYearId)?.academicYear,

      classKey: classId,
      className: classList?.find((item) => item.id === classId)?.className,

      divisionKey: divisionId,
      divisionName: divisionList?.find((item) => item.id === divisionId)?.divisionName,
      activeFlag: "Y",
      timeTableDao: _newStateTableData,
      subjectWiseTeacherDao: _teacherSub,
    };
    console.log("_newStateTableData", _newStateTableData);

    console.log("btnSaveText: ", btnSaveText);

    // Save new timetable
    if (btnSaveText == "Save") {
      console.log("_newTimetable", _newTimetable);
      console.log("_newteacherSub", _newteacherSub);
      console.log("_data", _data);
      // console.log("Teachers: ", _teacherSub);
      axios.post(`${urls.SCHOOL}/trnClassTimetable/save`, _data).then((res) => {
        if (res.status == 200 || res.status == 201) {
          console.log("Success data: ", res.data);
          sweetAlert("Success!", "Class Timetable Created Successfully !", "success");
        }
      });

      // if data exist then Update timetable
    } else if (btnSaveText == "Update") {
      console.log("_newStateTableData", _newStateTableData);
      console.log("_teacherSub", _teacherSub);
      console.log("_payLoad", _payLoad);
      axios.post(`${urls.SCHOOL}/trnClassTimetable/save`, _payLoad).then((res) => {
        if (res.status == 200 || res.status == 201) {
          console.log("Success data: ", res.data);
          sweetAlert("Upadated!", "Class Timetable Updated Successfully !", "success");
        }
      });
    }
  };

  const timeTableColumns = [
    {
      field: "fromTime",
      align: "center",
      headerAlign: "center",
      headerName: labels.fromTime,
      flex: 1,
    },
    {
      field: "toTime",
      align: "center",
      headerAlign: "center",
      headerName: labels.toTime,
      flex: 1,
    },
    {
      field: "monDay",
      align: "center",
      headerAlign: "center",
      headerName: labels.Monday,
      flex: 1,
    },
    {
      field: "tuesDay",
      align: "center",
      headerAlign: "center",
      headerName: labels.Tuesday,
      flex: 1,
    },
    {
      field: "wednesDay",
      align: "center",
      headerAlign: "center",
      headerName: labels.Wednesday,
      flex: 1,
    },
    {
      field: "thursday",
      align: "center",
      headerAlign: "center",
      headerName: labels.Thursday,
      flex: 1,
    },
    {
      field: "friDay",
      align: "center",
      headerAlign: "center",
      headerName: labels.Friday,
      flex: 1,
    },
    {
      field: "saturDay",
      align: "center",
      headerAlign: "center",
      headerName: labels.Saturday,
      flex: 1,
    },
    {
      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: labels.actions,
      width: 80,
      renderCell: (params) => {
        return (
          <>
            {/* <IconButton
              sx={{ color: "red" }}
              onClick={() => {
                updateTimetableList(params.row, "delete");
              }}
            >
              <Delete />
            </IconButton> */}
            {/* <IconButton
              onClick={() => {
                // setBtnSaveText("Update"),
                // setID(params.row.id),
                updateTimetableList(params.row, "Update");
                console.log("params.row: ", params.row);
                // reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton> */}
            <IconButton
              onClick={() => {
                setTimetableId(params?.row?.id);
                setTimetableText("UpdateTimetable");
                console.log("params.row: ", params.row);
                setValue("fromTime", moment(params?.row?.fromTime, "HH:mm a"));
                setValue("toTime", moment(params?.row?.toTime, "HH:mm a"));
                setValue("monDay", params?.row?.monDay);
                setValue("tuesDay", params?.row?.tuesDay);
                setValue("wednesDay", params?.row?.wednesDay);
                setValue("thursday", params?.row?.thursday);
                setValue("friDay", params?.row?.friDay);
                setValue("saturDay", params?.row?.saturDay);
                // reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </>
        );
      },
    },
  ];
  const timeTableTeachersListColumns = [
    {
      field: "subjectName",
      align: "center",
      headerAlign: "center",
      headerName: labels.subject,
      flex: 1,
    },
    {
      field: "teacherName",
      align: "center",
      headerAlign: "center",
      headerName: labels.teacher,
      flex: 1,
    },
    {
      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: labels.actions,
      width: 80,
      renderCell: (params) => {
        return (
          <>
            {/* <IconButton
              sx={{ color: "red" }}
              onClick={() => {
                updateTimetableTeachersList(params.row, "delete");
              }}
            >
              <Delete />
            </IconButton> */}
            <IconButton
              onClick={() => {
                setTeacherSubId(params?.row?.id);
                setTeacherSubText("UpdateTeacherSub");
                console.log("params.row: ", params.row);
                setValue("teacherKey", params?.row?.teacherKey);
                setValue("subjectKey", params?.row?.subjectKey);
                // reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </>
        );
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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(finalSubmit)}>
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
                                {language == "en" ? school.schoolName : school.schoolNameMr}
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
              <Divider />
            </Grid>

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
                <h2 style={{ marginBottom: 0 }}>{labels.timeAndSub}</h2>
              </Grid>
            </Grid>
            <Grid
              container
              marginTop={1}
              direction="row"
              display="flex"
              spacing={4}
              gap={2}
              justifyContent="center"
              paddingTop={4}
              paddingLeft={4}
            >
              <FormControl>
                <Controller
                  control={control}
                  name="fromTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label={labels.fromTime}
                        value={field.value}
                        onChange={(time) => {
                          field.onChange(moment(time).format("YYYY-MM-DDTHH:mm"));
                          // field.onChange(moment(time).format("HH:mm a"));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            sx={{ width: 120 }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {/* <FormHelperText>{error?.ipdOpeningTime ? error.ipdOpeningTime.message : null}</FormHelperText> */}
              </FormControl>

              <FormControl>
                <Controller
                  control={control}
                  name="toTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label={labels.toTime}
                        value={field.value}
                        onChange={(time) => {
                          field.onChange(moment(time).format("YYYY-MM-DDTHH:mm"));
                          // field.onChange(moment(time).format("HH:mm a"));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            sx={{ width: 120 }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {/* <FormHelperText>{error?.ipdOpeningTime ? error.ipdOpeningTime.message : null}</FormHelperText> */}
              </FormControl>

              <FormControl sx={{ width: 100 }}>
                <InputLabel required>{labels.Monday}</InputLabel>
                <Controller
                  control={control}
                  name="monDay"
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      variant="standard"
                      // {...field}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      {subjectList &&
                        subjectList.map((sub, i) => (
                          <MenuItem key={i} value={sub.label}>
                            {sub.label}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {/* <FormHelperText>{errors?.monDay ? errors.monDay.message : null}</FormHelperText> */}
              </FormControl>
              <FormControl sx={{ width: 100 }}>
                <InputLabel required>{labels.Tuesday}</InputLabel>
                <Controller
                  control={control}
                  name="tuesDay"
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select variant="standard" {...field}>
                      {subjectList &&
                        subjectList.map((sub, i) => (
                          <MenuItem key={i} value={sub.label}>
                            {sub.label}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {/* <FormHelperText>{errors?.tuesDay ? errors.tuesDay.message : null}</FormHelperText> */}
              </FormControl>
              <FormControl sx={{ width: 100 }}>
                <InputLabel required>{labels.Wednesday}</InputLabel>
                <Controller
                  control={control}
                  name="wednesDay"
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select variant="standard" {...field}>
                      {subjectList &&
                        subjectList.map((sub, i) => (
                          <MenuItem key={i} value={sub.label}>
                            {sub.label}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {/* <FormHelperText>{errors?.wednesDay ? errors.wednesDay.message : null}</FormHelperText> */}
              </FormControl>
              <FormControl sx={{ width: 100 }}>
                <InputLabel required>{labels.Thursday}</InputLabel>
                <Controller
                  control={control}
                  name="thursday"
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select variant="standard" {...field}>
                      {subjectList &&
                        subjectList.map((sub, i) => (
                          <MenuItem key={i} value={sub.label}>
                            {sub.label}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {/* <FormHelperText>{errors?.thursday ? errors.thursday.message : null}</FormHelperText> */}
              </FormControl>
              <FormControl sx={{ width: 100 }}>
                <InputLabel required>{labels.Friday}</InputLabel>
                <Controller
                  control={control}
                  name="friDay"
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select variant="standard" {...field}>
                      {subjectList &&
                        subjectList.map((sub, i) => (
                          <MenuItem key={i} value={sub.label}>
                            {sub.label}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {/* <FormHelperText>{errors?.friDay ? errors.friDay.message : null}</FormHelperText> */}
              </FormControl>
              <FormControl sx={{ width: 100 }}>
                <InputLabel required>{labels.Saturday}</InputLabel>
                <Controller
                  control={control}
                  name="saturDay"
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select variant="standard" {...field}>
                      {subjectList &&
                        subjectList.map((sub, i) => (
                          <MenuItem key={i} value={sub.label}>
                            {sub.label}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {/* <FormHelperText>{errors?.saturDay ? errors.saturDay.message : null}</FormHelperText> */}
              </FormControl>
              <div className={styles.addbtn}>
                <Button
                  variant="contained"
                  disabled={isDisableAddSubndTime()}
                  endIcon={<Add />}
                  onClick={() => {
                    let temp = {
                      fromTime: watch("fromTime"),
                      toTime: watch("toTime"),
                      monDay: watch("monDay"),
                      tuesDay: watch("tuesDay"),
                      wednesDay: watch("wednesDay"),
                      thursday: watch("thursday"),
                      friDay: watch("friDay"),
                      saturDay: watch("saturDay"),
                    };
                    updateTimetableList(temp, timetableText);

                    setValue("fromTime", null);
                    setValue("toTime", null);
                    setValue("monDay", "");
                    setValue("tuesDay", "");
                    setValue("wednesDay", "");
                    setValue("thursday", "");
                    setValue("friDay", "");
                    setValue("saturDay", "");
                  }}
                >
                  {labels.save}
                </Button>
              </div>
              {/* <Button
                  type="submit"
                  variant="contained"
                  // startIcon={<ClearOutlined />}
                  onClick={() => reset()}
                >
                  {labels.save}
                </Button> */}
              {/* </Grid> */}
              <Grid item xs={12}>
                <DataGrid
                  autoHeight
                  sx={{
                    "& .cellColor": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },
                  }}
                  rows={newStateTableData ? newStateTableData : []}
                  //@ts-ignore
                  columns={timeTableColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                />
              </Grid>
            </Grid>
            <Grid
              container
              display="flex"
              justifyContent="center"
              justifyItems="center"
              padding={2}
              marginTop={2}
              sx={{
                background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              <Grid item>
                <h2 style={{ marginBottom: 0 }}>{labels.teachersForSubjects}</h2>
              </Grid>
            </Grid>
            <Grid
              container
              marginTop={1}
              direction="row"
              display="flex"
              spacing={4}
              gap={2}
              justifyContent="center"
              paddingTop={4}
              paddingLeft={4}
            >
              <FormControl sx={{ width: 200 }}>
                <InputLabel required>{labels.selectSubject}</InputLabel>
                <Controller
                  control={control}
                  name="subjectKey"
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select variant="standard" {...field}>
                      {subjectList &&
                        subjectList.map((sub, i) => (
                          <MenuItem key={i} value={sub.value}>
                            {sub.label}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {/* <FormHelperText>{errors?.friDay ? errors.friDay.message : null}</FormHelperText> */}
              </FormControl>
              <FormControl sx={{ width: 200 }}>
                <InputLabel required>{labels.selectTeacher}</InputLabel>
                <Controller
                  control={control}
                  name="teacherKey"
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select variant="standard" {...field}>
                      {teacherList &&
                        teacherList.map((teacher, i) => (
                          <MenuItem key={i} value={teacher.value}>
                            {teacher.label}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {/* <FormHelperText>{errors?.saturDay ? errors.saturDay.message : null}</FormHelperText> */}
              </FormControl>
              <div className={styles.addbtn}>
                <Button
                  variant="contained"
                  disabled={isDisableAddSubndTeacher()}
                  endIcon={<Add />}
                  onClick={() => {
                    updateTimetableTeachersList(
                      {
                        subjectKey: watch("subjectKey"),
                        teacherKey: watch("teacherKey"),
                      },
                      teacherSubText,
                    );
                    setValue("teacherKey", "");
                    setValue("subjectKey", "");
                  }}
                >
                  {labels.save}
                </Button>
              </div>
              <Grid item xs={12}>
                <DataGrid
                  autoHeight
                  sx={{
                    "& .cellColor": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },
                  }}
                  rows={timeTableTeachersList ? timeTableTeachersList : []}
                  //@ts-ignore
                  columns={timeTableTeachersListColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={5}
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "10px",
                marginTop: "20px",
                marginBottom: "20px",
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
                  onClick={() => {
                    reset();
                    setTimeTableTeachersList([]);
                    setNewStateTableData([]);
                    setTimeTable([]);
                  }}
                >
                  {labels.clear}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ExitToAppIcon />}
                  // onClick={() => exitButton()}
                >
                  {labels.exit}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
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
