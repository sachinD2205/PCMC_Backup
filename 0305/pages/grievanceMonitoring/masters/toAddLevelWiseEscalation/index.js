import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  LinearProgress,
  ThemeProvider,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import styles from "./view.module.css";
import theme from "../../../../theme";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { getLEVEL_WISE_ESCALATIONFromLocalStorage } from "../../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
    mode: "onSubmit",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा");
  const [rowId, setRowId] = useState(null);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);
  const [totalLevels, setLevels] = React.useState("");

  const [complaintTypes, setcomplaintTypes] = useState([
    // {
    //   id: 1,
    //   complaintTypeEn: "",
    //   complaintTypeMr: "",
    // },
  ]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((store) => store.labels.language);
  const [tempSubDept, setTempSubDept] = useState();
  const [tempType, setTempType] = useState();
  const [tempSubType, setTempSubType] = useState();
  const [deptFlag, setDeptFlag] = useState(false);
  const [complaintFlag, setComplaintFlag] = useState(false);
  ////////////////////////////////// FOR ESCALATING ////////////////////////////////////
  const [escalates, setEscalates] = useState(false);
  const [slideCheckedForEscalate, setSlideCheckedForEscalate] = useState(false);
  const [levelsToSend, setLevelsToSend] = useState([]);
  const [submitEscalate, setSubmitEscalate] = useState(null);
  const [daysToMinutes, setDaysToMinutes] = useState(null);

  const [levelsDropdown, setLevelsDropdown] = useState([]);
  const [levelVariable, setLevelVariable] = useState([]);
  /////////////////////////// DATA FROM LOCAL STORAGE //////////////////////////
  const [dataFromLocalStorage] = useState(
    getLEVEL_WISE_ESCALATIONFromLocalStorage("Level_Wise_Escalation")
      ? getLEVEL_WISE_ESCALATIONFromLocalStorage("Level_Wise_Escalation")
      : [],
  );

  // Get Table - Data
  const getAllAmenities = (_pageSize = 10, _pageNo = 0) => {
    console.log("onPageChange", "_pageSize", _pageSize, "_pageNo", _pageNo);

    axios
      .get(`${urls.GM}/levelwiseEscalationDuration/getByComplaintId?id=${dataFromLocalStorage?.id}`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      //   ?.levelwiseEscalationDurationList;
      .then((res) => {
        let result = res?.data;
        let _res = result?.map((val, i) => {
          return {
            id: val.id,
            activeFlag: val.activeFlag,
            srNo: i + 1,
            complaintTypeLevelsKey: val.complaintTypeLevelsKey,
            complaintTypeEn: dataFromLocalStorage?.complaintTypeName,
            complaintTypeMr: dataFromLocalStorage?.complaintTypeName,
            deptKey: val.deptKey,
            departmentEn: dataFromLocalStorage?.depName,
            departmentMr: dataFromLocalStorage?.depName,
            subDepartmentKey: val.subDepartmentKey,
            subDepartmentEn: dataFromLocalStorage?.subDepName,
            subDepartmentMr: dataFromLocalStorage?.subDepName,
            level: val.level,
            duration: val.duration,
            durationType: val.durationType,
          };
        });

        setData({
          rows: _res,
          totalRows: res?.data?.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res?.data?.pageSize,
          page: res?.data?.pageNo,
        });

        setLevelVariable(_res.map((obj) => obj.level));
      });
  };

  useEffect(() => {
    getAllAmenities();
  }, [dataFromLocalStorage?.id]);

  // useEffect(() => {
  //   getAllAmenities();
  // }, [complaintTypes]);

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("520", body);
        if (willDelete === true) {
          axios
            .post(`${urls.GM}/levelwiseEscalationDuration/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is De-Activated Successfully!", {
                  icon: "success",
                });
                getAllAmenities();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllAmenities();
                setButtonInputState(false);
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                });
                getAllAmenities();
                setButtonInputState(false);
              }
              // console.log("error", error);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
          setButtonInputState(false);
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
        // console.log("inn", willDelete);
        console.log("620", body);

        if (willDelete === true) {
          axios
            .post(`${urls.GM}/levelwiseEscalationDuration/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Activated Successfully!", {
                  icon: "success",
                });
                getAllAmenities();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllAmenities();
                setButtonInputState(false);
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                });
                getAllAmenities();
                setButtonInputState(false);
              }
              // console.log("error", error);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
          setButtonInputState(false);
        }
      });
    }
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    complaintTypeLevelsKey: "",
    deptKey: "",
    subDepartmentKey: "",
    level: "",
    duration: "",
  };
  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setValue("deptKey", "");
    setValue("complaintTypeKey", "");
    setSubDepartmentList([]);
    setComplaintSubTypes([]);
    setDeptFlag(false);
    setComplaintFlag(false);
  };
  // Reset Values Exit
  const resetValuesExit = {
    complaintTypeLevelsKey: "",
    deptKey: "",
    subDepartmentKey: "",
    level: "",
    duration: "",
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

    // setSubDepartmentList([]);
  };
  ///////////////////////////////////////////////////////////////////
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          departmentEn: r.department,
          departmentMr: r.departmentMr,
        })),
      );
    });
  };
  useEffect(() => {
    getComplaintTypes();
    getDepartment();
  }, []);
  //////////////////////////////////////////////////////////////////
  const getSubDepartmentDetails = () => {
    if (watch("deptKey")) {
      //   alert(watch("deptKey"));
      axios.get(`${urls.GM}/master/subDepartment/getAllByDeptWise/${watch("deptKey")}`).then((res) => {
        setSubDepartmentList(
          res?.data?.subDepartment?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentId: r.department,
            subDepartmentEn: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          })),
        );
        // if (tempSubDept) {
        //   setValue(
        //     "subDepartmentKey",
        //     res?.data?.subDepartment?.find((obj) => tempSubDept == obj.subDepartment)?.id,
        //   );
        // }
      });
    }
  };

  useEffect(() => {
    if (watch("deptKey") || deptFlag) {
      // alert('watch("deptKey"), deptFlag');
      // alert(watch("deptKey"));
      getSubDepartmentDetails();
    }
  }, [watch("deptKey"), deptFlag]);

  //////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (watch("complaintTypeKey") || complaintFlag) {
      // alert('watch("complaintTypeKey"), complaintFlag');
      // alert(watch("complaintTypeKey"));
      getComplaintSubType();
    }
  }, [watch("complaintTypeKey"), complaintFlag]);
  //////////////////////////////////////////////////////////////////

  const getComplaintTypes = () => {
    axios.get(`${urls.GM}/complaintTypeMaster/getAll`).then((res) => {
      setcomplaintTypes(
        res?.data?.complaintTypeMasterList?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          // complaintTypeId: r.id,
          complaintTypeEn: r.complaintType,
          complaintTypeMr: r.complaintTypeMr,
        })),
      );
    });
  };

  // Get Table - Data
  const getComplaintSubType = () => {
    if (watch("complaintTypeKey")) {
      //   alert("getComplaintSubType");
      //   alert(watch("complaintTypeKey"));
      axios
        .get(`${urls.GM}/complaintSubTypeMaster/getAllByCmplId?id=${watch("complaintTypeKey")}`)
        .then((res) => {
          setComplaintSubTypes(
            res?.data?.complaintSubTypeMasterList?.map((r, i) => ({
              id: r.id,
              complaintSubType: r.complaintSubType,
              complaintTypeId: r.complaintTypeId,
            })),
          );
          // if (tempSubType) {
          //   // alert(tempSubType);
          //   setValue(
          //     "complaintSubTypeKey",
          //     res?.data?.complaintSubTypeMasterList?.find((obj) => tempSubType == obj.complaintSubType)?.id,
          //   );
          // }
        });
    }
  };
  ///////////////////////////////////////////////////////////////////

  let checkingSandU = (finalBodyForApi, finalBodyForUpdate) => {
    if (btnSaveText === "Save") {
      // alert("SAVE");
      return axios.post(`${urls.GM}/levelwiseEscalationDuration/save`, finalBodyForApi);
    } else {
      // alert("UPDATE");
      return axios.post(`${urls.GM}/levelwiseEscalationDuration/save`, finalBodyForUpdate);
    }
  };

  //////////////////////////////////////RADIOS BUTTONS////////////////////////////////////////////
  const [selectedOption, setSelectedOption] = React.useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  // OnSubmit Form

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    console.log("formData", formData);

    ///////////////////////////////////////////////////////////////////
    let valueToSend = 0;
    if (selectedOption === "days") {
      // Convert days to minutes before sending to backend
      valueToSend = parseInt(formData.days) * 24 * 60;
    } else if (selectedOption === "hours") {
      // Convert hours to minutes before sending to backend
      valueToSend = parseInt(formData.hours) * 60;
    }
    // Send valueToSend to backend
    console.log(`Sending ${valueToSend} minutes to backend`);
    //////////////////////////////////////////////////////////////////
    let finalBodyForApi = {
      complaintTypeLevelsKey: dataFromLocalStorage?.id,
      level: formData.level,
      //   duration: watch("duration") ? Number(watch("duration")) : null,
      duration: valueToSend,
      durationType: selectedOption,
    };

    const finalBodyForUpdate = {
      // id: rowId !== null ? rowId : null,
      id: formData.id,
      activeFlag: "Y",
      complaintTypeLevelsKey: dataFromLocalStorage?.id,
      level: formData.level,
      //   duration: watch("duration") ? Number(watch("duration")) : null,
      // duration: Number(formData.duration),
      duration: valueToSend,
      durationType: selectedOption,
    };

    console.log("420", finalBodyForApi);

    checkingSandU(finalBodyForApi, finalBodyForUpdate)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          rowId
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAllAmenities();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setSelectedOption("");
        }
      })
      .catch((error) => {
        if (error.request.status === 500) {
          swal(error.response.data.message, {
            icon: "error",
          });
          getAllAmenities();
          setButtonInputState(false);
        } else {
          swal("Something went wrong!", {
            icon: "error",
          });
          getAllAmenities();
          setButtonInputState(false);
        }
        // console.log("error", error);
      });
  };

  /////////////////////////////////ESCALATES//////////////////////////////////
  let handleSaveForEscalate = (formData) => {
    console.log("submitEscalate", submitEscalate);
    alert("handleSaveForEscalate");
    console.log("handleSaveForEscalate", formData);
    let finalBodyForApiEscalate = {
      complaintTypeLevelsKey: dataFromLocalStorage?.id,
      level: formData.level,
      //   duration: watch("duration") ? Number(watch("duration")) : null,
      duration: Number(formData.duration),
    };
    axios.post(`${urls.GM}/levelwiseEscalationDuration/save`, finalBodyForApiEscalate);
  };
  //////////////////////////////////////////////////////////////////////////////

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, headerAlign: "center", align: "center" },
    {
      field: language === "en" ? "complaintTypeEn" : "complaintTypeMr",
      headerName: <FormattedLabel id="complaintType" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentEn" : "departmentMr",
      headerName: <FormattedLabel id="depName" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: language === "en" ? "subDepartmentEn" : "subDepartmentEn",
      headerName: <FormattedLabel id="subDepName" />,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "level",
      headerName: <FormattedLabel id="level" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "defaultEscDuration",
      headerName: <FormattedLabel id="durations" />,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        console.log(":para", params?.row);
        return (
          <div>
            {params?.row?.durationType === "days" && (
              <div>
                {params?.row?.duration / 1440}{" "}
                {params?.row?.duration / 1440 == 1 ? "day" : params?.row?.durationType}
              </div>
            )}
            {params?.row?.durationType === "hours" && (
              <div>
                {params?.row?.duration / 60} {params?.row?.durationType}
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", justifyContent: "center", alignContent: "center", gap: 10 }}>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);

                setValue("duration", params?.row?.duration / 1440);
                setDeptFlag(true);
                setComplaintFlag(true);
                ////////////////////////////ESCALATION////////////////////////////
              }}
            >
              <Tooltip title={`EDIT THIS RECORD`}>
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row.id);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title={`DE-ACTIVATE THIS RECORD`}>
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={`ACTIVATE THIS RECORD`}>
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
            {/* /////////////////////////////////////////////////// */}

            {/* <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setEscalates(!escalates),
                  setSlideCheckedForEscalate(true),
                  setButtonInputState(!buttonInputState);
                console.log("ESCALATION", params.row);
                setValue("complaintTypeLevelsKey", params?.row?.complaintTypeName);
                setValue(
                  "subComplaintTypeLevelsKey",
                  params?.row?.complaintSubTypeName ? params?.row?.complaintSubTypeName : null,
                );
                setValue("totalLevel", params?.row?.totalLevels);
                setSubmitEscalate(params.row);
              }}
            >
              <Tooltip title={`ADD ESCALATION AGAINST THIS RECORD`}>
                <ArrowUpwardIcon />
              </Tooltip>
            </IconButton> */}
          </div>
        );
      },
    },
  ];

  /////////////////////////////////////////////////
  let pushToArray = [];
  let settngLevels = () => {
    if (dataFromLocalStorage?.totalLevels) {
      for (let i = 1; i <= dataFromLocalStorage?.totalLevels; i++) {
        // if (data?.rows?.length > 0) {
        //   if (data?.rows?.find((dd) => dd?.level != i)) {
        //     pushToArray.push(i);
        //   }
        // }
        //  else {
        pushToArray.push(i);
        // }
      }
      setLevelsToSend(pushToArray);
    }
  };

  useEffect(() => {
    if (dataFromLocalStorage?.totalLevels) {
      settngLevels();
      //   console.log("levelsToSend", levelsToSend);
    }
  }, [dataFromLocalStorage?.totalLevels]);

  ///////////////////////////////////////////////////////////////
  let convertDaysToMinute = () => {
    let days = watch("duration");
    let minutes;

    minutes = days * 24 * 60;
    console.log("minutes", minutes);
    setDaysToMinutes(minutes);
  };

  useEffect(() => {
    convertDaysToMinute();
  }, [watch("duration")]);

  ////////////////////////////////////////
  // let levelVariable = [];
  // useEffect(() => {
  //   if (data?.rows?.length > 0) {
  //     // alert("levelVariable");
  //     // levelVariable = data?.rows?.map((obj) => obj.level);
  //     setLevelVariable(data?.rows?.map((obj) => obj.level));
  //   }
  // }, []);

  // useEffect(() => {
  //   if (levelVariable !== null) {
  //     console.log("levelVariable", JSON.stringify(levelVariable) === JSON.stringify(levelsToSend));
  //     // let mergeTwoArrays = [...levelVariable, ...levelsToSend];
  //     // let ResultMerge = [...new Set(mergeTwoArrays)];
  //     // console.log(":47", ResultMerge);
  //     // setLevelsDropdown(ResultMerge);
  //   }
  // }, []);

  let mergeTwoArrays = () => {
    // alert(levelVariable.length);
    // alert(levelsToSend.length);

    // if (levelVariable && levelsToSend.length > 0) {
    if (levelVariable && levelsToSend.length > 0) {
      console.log("mergeTwoArrays", levelVariable, "levelsToSend", levelsToSend);
      // alert("inside");
      // let mergeTwoArrays = [...levelVariable, ...levelsToSend];
      // let ResultMerge = [...new Set(mergeTwoArrays)];
      let ResultMerge = levelsToSend?.filter((item) => !levelVariable?.includes(item));
      console.log(":47", ResultMerge);
      setLevelsDropdown(ResultMerge);
    }
  };

  useEffect(() => {
    // if (slideChecked === true) {
    //   mergeTwoArrays(levelVariable, levelsToSend);
    // }
    mergeTwoArrays(levelVariable, levelsToSend);
  }, [slideChecked, isOpenCollapse, levelVariable, levelsToSend]);

  // Row

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "98%",
                height: "auto",
                overflow: "auto",
                padding: "0.5%",
                color: "black",
                fontSize: 19,
                fontWeight: 500,
                // borderRadius: 100,
              }}
            >
              <strong className={styles.fancy_link1}>
                <FormattedLabel id="levelWiseEscalationDuration" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <div>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="complaintType" />}
                        // variant="outlined"
                        variant="standard"
                        {...register("complaintTypeKey")}
                        error={!!errors.complaintTypeKey}
                        helperText={errors?.complaintTypeKey ? errors.complaintTypeKey.message : null}
                        value={
                          // complaintTypes?.find((obj) => obj.id === dataFromLocalStorage?.complaintTypeKey)
                          //   ?.complaintTypeEn
                          dataFromLocalStorage?.complaintTypeName
                        }
                      />
                    </Grid>
                    {/* /////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="complaintSubType" />}
                        // variant="outlined"
                        variant="standard"
                        {...register("subComplaintTypeLevelsKey")}
                        error={!!errors.subComplaintTypeLevelsKey}
                        helperText={
                          errors?.subComplaintTypeLevelsKey ? errors.subComplaintTypeLevelsKey.message : null
                        }
                        value={dataFromLocalStorage?.complaintSubTypeName}
                      />
                    </Grid>
                    {/* /////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="totalLevels" />}
                        // variant="outlined"
                        variant="standard"
                        value={dataFromLocalStorage?.totalLevels}
                        {...register("totalLevel")}
                        error={!!errors.totalLevel}
                        helperText={errors?.totalLevel ? errors.totalLevel.message : null}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl style={{ minWidth: "230px" }}>
                        <InputLabel id="demo-simple-select-label">{<FormattedLabel id="level" />}</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={field.value}
                              label={<FormattedLabel id="level" />}
                              //   onChange={(event) => setLevels(event.target.value)}
                              onChange={(value) => field.onChange(value)}
                            >
                              {/* {levelsToSend &&
                                levelsToSend?.map((obj, index) => {
                                  return (
                                    <MenuItem key={index} value={obj}>
                                      {obj}
                                    </MenuItem>
                                  );
                                })} */}
                              {levelsDropdown &&
                                levelsDropdown?.map((obj, index) => {
                                  return (
                                    <MenuItem key={index} value={obj}>
                                      {obj}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          )}
                          name="level"
                          control={control}
                          defaultValue=""
                        />
                      </FormControl>
                    </Grid>

                    {/* //////////////////////////////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      style={{
                        // justifyContent: "center",
                        marginLeft: "10vh",
                      }}
                    >
                      <Controller
                        name="selectedOption"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange } }) => (
                          <RadioGroup
                            value={selectedOption}
                            onChange={(e) => {
                              onChange(e);
                              handleOptionChange(e);
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "baseline", flexDirection: "column" }}>
                              <FormControlLabel
                                value="days"
                                control={<Radio color="primary" />}
                                label="Escalation period in Days"
                              />
                              <FormControlLabel
                                value="hours"
                                control={<Radio color="primary" />}
                                label="Escalation period in Hours"
                              />
                            </div>
                          </RadioGroup>
                        )}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                        // marginLeft: "10vh",
                      }}
                    >
                      {selectedOption === "days" ? (
                        <Controller
                          name="days"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }) => (
                            <>
                              {/* <input type="number" {...field} /> */}
                              <TextField label="Days" {...field} />
                            </>
                          )}
                        />
                      ) : (
                        <Controller
                          name="hours"
                          control={control}
                          defaultValue=""
                          rules={{ required: true }}
                          render={({ field }) => (
                            <>
                              Hours:
                              <Select label="Hours" {...field}>
                                {[...Array(18)].map((_, i) => (
                                  <MenuItem key={i + 6} value={i + 6}>
                                    {i + 6}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        />
                      )}
                    </Grid>
                  </Grid>

                  {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}
                  <Grid container style={{ padding: "10px" }} spacing={2}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        // sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                        // onClick={handleSaveForEscalate}
                      >
                        {language === "en" ? btnSaveText : btnSaveTextMr}
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        // sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => {
                          setValue("level", "");
                          setValue("duration", "");
                        }}
                      >
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => {
                          //   setValue("level", "");
                          //   setValue("duration", "");
                          //   setEscalates(!escalates),
                          //     setSlideCheckedForEscalate(true),
                          //     setButtonInputState(!buttonInputState);
                          exitButton();
                        }}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Slide>
          )}
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          <Grid
            container
            style={{ padding: "10px" }}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={9}></Grid>
            <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
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
                  setBtnSaveTextMr("जतन करा");
                  setButtonInputState(true);
                  setSlideChecked(true);
                  // mergeTwoArrays(levelVariable, levelsToSend);
                  // mergeTwoArrays();
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                {<FormattedLabel id="add" />}
              </Button>
            </Grid>
          </Grid>

          <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
            <DataGrid
              autoHeight={true}
              sx={{
                overflowY: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {
                  backgroundColor: "white",
                  display: "flex",
                  overflow: "auto !important",
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 0 },
                  disableExport: true,
                  disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                  printOptions: { disableToolbarButton: true },
                },
              }}
              // rowHeight={50}
              pagination
              paginationMode="server"
              rowCount={data?.totalRows}
              rowsPerPageOptions={data?.rowsPerPageOptions}
              page={data?.page}
              pageSize={data?.pageSize}
              rows={data?.rows || []}
              columns={columns}
              onPageChange={(_data) => {
                getAllAmenities(data?.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("onPageChange", _data, data?.page);
                getAllAmenities(_data, data?.page);
              }}
            />
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
