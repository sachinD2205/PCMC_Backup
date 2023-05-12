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
  RadioGroup,
  FormControlLabel,
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
import { useRouter } from "next/router";
import { addLEVEL_WISE_ESCALATIONToLocalStorage } from "../../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import Schema from "../../../../containers/schema/grievanceMonitoring/totalLevelsAndDefaultDurationSchema";

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

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [departments, setDepartments] = useState([
    {
      id: 1,
      departmentEn: "",
      departmentMr: "",
    },
  ]);

  const [subDepartments, setSubDepartmentList] = useState([]);
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);
  const [totalLevels, setLevels] = React.useState("");

  const [complaintTypes, setcomplaintTypes] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const router = useRouter();

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

  // Get Table - Data
  const getAllAmenities = (_pageSize = 10, _pageNo = 0) => {
    console.log("onPageChange", "_pageSize", _pageSize, "_pageNo", _pageNo);

    axios
      .get(`${urls.GM}/complaintTypeLevels/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        let result = res?.data?.complaintTypeLevelsList;
        let _res = result?.map((val, i) => {
          return {
            id: val.id,
            activeFlag: val.activeFlag,
            srNo: i + 1,
            complaintSubTypeName: val.complaintSubTypeName,
            complaintTypeName: val.complaintTypeName,
            defaultEscDuration: val.defaultEscDuration,
            subDepName: val.subDepName ? val.subDepName : "---",
            totalLevels: val.totalLevels,
            depName: val.depName,
            complaintSubTypeKey: val.complaintSubTypeKey,
            complaintTypeKey: val.complaintTypeKey,
            deptKey: val.deptKey,
            subDepartmentKey: val.subDepartmentKey,
            areaKey: val.areaKey,
            zoneKey: val.zoneKey,
            wardKey: val.wardKey,
            selectedOption: val.durationType,
          };
        });
        setData({
          rows: _res,
          totalRows: res?.data?.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res?.data?.pageSize,
          page: res?.data?.pageNo,
        });
      });
  };

  useEffect(() => {
    getAllAmenities();
  }, []);

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
            .post(`${urls.GM}/complaintTypeLevels/save`, body)
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
            .post(`${urls.GM}/complaintTypeLevels/save`, body)
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
    complaintSubTypeName: "",
    complaintTypeName: "",
    defaultEscDuration: "",
    subDepName: "",
    totalLevels: "",
    depName: "",
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
    complaintSubTypeName: "",
    complaintTypeName: "",
    defaultEscDuration: "",
    subDepName: "",
    totalLevels: "",
    depName: "",
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

    setSubDepartmentList([]);
    setComplaintSubTypes([]);
    setDeptFlag(false);
    setComplaintFlag(false);
    //
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
    if (watch("deptKey")) {
      if (watch("complaintTypeKey") || complaintFlag) {
        // alert('watch("complaintTypeKey"), complaintFlag');
        // alert("watch('complaintTypeKey'), watch('deptKey), complaintFlag");
        getComplaintSubType();
      }
    }
    // if (!watch("complaintTypeKey")) {
    //   setComplaintSubTypes([]);
    // }
  }, [watch("complaintTypeKey"), watch("deptKey"), complaintFlag]);
  //////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (watch("deptKey")) {
      if (complaintTypes.length === 0 || !watch("complaintTypeKey")) {
        setComplaintSubTypes([]);
      }
    }
  });

  //////////////////////////////////////////////////////////////////

  const getComplaintTypes = () => {
    if (watch("deptKey")) {
      axios
        .get(`${urls.GM}/complaintTypeMaster/getByDepId?id=${watch("deptKey")}`)
        .then((res) => {
          setcomplaintTypes(
            res?.data?.complaintTypeMasterList?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              // complaintTypeId: r.id,
              complaintTypeEn: r.complaintType,
              complaintTypeMr: r.complaintTypeMr,
              departmentId: r.departmentId,
              departmentName: r.departmentName,
            })),
          );
        })
        .catch((error) => sweetAlert(error));
    } else {
      setValue("complaintTypeKey", "");
    }
  };
  useEffect(() => {
    getComplaintTypes();
  }, [watch("deptKey")]);

  // Get Table - Data
  const getComplaintSubType = () => {
    if (watch("complaintTypeKey")) {
      //   alert("getComplaintSubType");
      //   alert(watch("complaintTypeKey"));
      axios
        .get(`${urls.GM}/complaintSubTypeMaster/getAllByCmplId?id=${watch("complaintTypeKey")}`)
        .then((res) => {
          setComplaintSubTypes(
            res.data.complaintSubTypeMasterList.map((r, i) => ({
              id: r.id,
              complaintSubType: r.complaintSubType,
              complaintTypeMr: r.complaintTypeMr,
              complaintTypeId: r.complaintTypeId,
            })),
          );
        });
    }
  };
  //////////////////////////////////////////////////////////////////

  let checkingSandU = (finalBodyForApi, finalBodyForUpdate) => {
    if (btnSaveText === "Save") {
      // alert("SAVE");
      return axios.post(`${urls.GM}/complaintTypeLevels/save`, finalBodyForApi);
    } else {
      // alert("UPDATE");
      return axios.post(`${urls.GM}/complaintTypeLevels/save`, finalBodyForUpdate);
    }
  };
  ///////////////////////////////////////////////////////////////
  const [daysToMinutes, setDaysToMinutes] = useState(null);
  let convertDaysToMinute = () => {
    let days = watch("defaultEscDuration");
    let minutes;

    minutes = days * 24 * 60;
    console.log("minutes", minutes);
    setDaysToMinutes(minutes);
  };

  useEffect(() => {
    convertDaysToMinute();
  }, [watch("defaultEscDuration")]);

  /////////////////////////////////////////////////////////////////
  const [hoursToMinutes, setHoursToMinutes] = useState(null);
  let convertHoursToMinute = () => {
    let hours = watch("defaultEscDurationInHours");
    let minutes;

    minutes = hours * 60;
    console.log("minutes", minutes);
    setHoursToMinutes(minutes);
  };

  useEffect(() => {
    convertHoursToMinute();
  }, [watch("defaultEscDurationInHours")]);
  ///////////////////////////////////////////////////////////////

  //////////////////////////////////////RADIOS BUTTONS////////////////////////////////////////////
  const [selectedOption, setSelectedOption] = React.useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  // OnSubmit Form

  const onSubmitForm = (formData) => {
    console.log("formData:::", formData);

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
    const finalBodyForApi = {
      deptKey: formData.deptKey,
      subDepartmentKey: formData.subDepartmentKey,
      complaintTypeKey: formData.complaintTypeKey,
      complaintSubTypeKey: formData.complaintSubTypeKey,
      // defaultEscDuration: daysToMinutes !== null ? daysToMinutes : "",
      // defaultEscDurationInHours: hoursToMinutes !== null ? hoursToMinutes : "",
      totalLevels: formData.totalLevels,
      areaKey: watch("areaKey"),
      zoneKey: watch("zoneKey"),
      wardKey: watch("wardKey"),
      defaultEscDuration: valueToSend,
      durationType: selectedOption,
    };

    const finalBodyForUpdate = {
      id: rowId !== null ? rowId : null,
      activeFlag: "Y",
      deptKey: formData.deptKey,
      subDepartmentKey: formData.subDepartmentKey,
      complaintTypeKey: formData.complaintTypeKey,
      complaintSubTypeKey: formData.complaintSubTypeKey,
      // defaultEscDuration: Number(formData.defaultEscDuration),
      // defaultEscDuration: daysToMinutes !== null ? daysToMinutes : "",
      // defaultEscDurationInHours: hoursToMinutes !== null ? hoursToMinutes : "",
      totalLevels: formData.totalLevels,
      areaKey: watch("areaKey"),
      zoneKey: watch("zoneKey"),
      wardKey: watch("wardKey"),
      defaultEscDuration: valueToSend,
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
          setDeptFlag(false);
          setComplaintFlag(false);
          setSubDepartmentList([]);
          setComplaintSubTypes([]);
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
          setDeptFlag(false);
          setComplaintFlag(false);
          setSubDepartmentList([]);
          setComplaintSubTypes([]);
        } else {
          swal("Something went wrong!", {
            icon: "error",
          });
          getAllAmenities();
          setButtonInputState(false);
          setDeptFlag(false);
          setComplaintFlag(false);
          setSubDepartmentList([]);
          setComplaintSubTypes([]);
        }
        // console.log("error", error);
      });
  };

  /////////////////////////////////ESCALATES//////////////////////////////////
  let handleSaveForEscalate = (formData) => {
    console.log("handleSaveForEscalate", formData);
    if (submitEscalate !== null) {
      console.log("submitEscalate", submitEscalate);
      let finalBodyForApiEscalate = {
        complaintTypeLevelsKey: submitEscalate.complaintTypeKey,
        level: watch("level"),
        duration: watch("duration") ? Number(watch("duration")) : null,
      };
      axios.post(`${urls.GM}/levelwiseEscalationDuration/save`, finalBodyForApiEscalate);
    }
  };
  //////////////////////////////////////////////////////////////////////////////

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, headerAlign: "center", align: "center" },
    {
      field: "complaintTypeName",
      headerName: <FormattedLabel id="complaintName" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "complaintSubTypeName",
      headerName: <FormattedLabel id="complaintSubTypeName" />,
      headerAlign: "center",
      minWidth: 250,
    },
    {
      field: "depName",
      headerName: <FormattedLabel id="depName" />,
      headerAlign: "center",
      minWidth: 230,
    },
    {
      field: "subDepName",
      headerName: <FormattedLabel id="subDepName" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalLevels",
      headerName: <FormattedLabel id="totalLevels" />,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "defaultEscDuration",
      // headerName: <FormattedLabel id="defaultEscDurationDays" />,
      headerName: "Esc Duration",
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        console.log(":para", params?.row);
        return (
          <div>
            {params?.row?.selectedOption === "days" && (
              <div>
                {params?.row?.defaultEscDuration / 1440}{" "}
                {params?.row?.defaultEscDuration / 1440 == 1 ? "day" : params?.row?.selectedOption}
              </div>
            )}
            {params?.row?.selectedOption === "hours" && (
              <div>
                {params?.row?.defaultEscDuration / 60} {params?.row?.selectedOption}
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
            {/* {console.log(":log", params)} */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setRowId(params?.row?.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                // areaId.push(params?.row?.areaKey);
                // setValue("defaultEscDuration", params?.row?.defaultEscDuration / 1440);
                setDeptFlag(true);
                setComplaintFlag(true);
                setSelectedOption(params?.row?.selectedOption);
                {
                  params?.row?.selectedOption === "days" &&
                    setValue("days", params?.row?.defaultEscDuration / 1440);
                }
                {
                  params?.row?.selectedOption === "hours" &&
                    setValue("hours", params?.row?.defaultEscDuration / 60);
                }
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
                  setRowId(params.row.id),
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

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                // setEscalates(!escalates),
                //   setSlideCheckedForEscalate(true),
                //   setButtonInputState(!buttonInputState);
                console.log("ESCALATION", params.row);
                // setValue("complaintTypeLevelsKey", params?.row?.complaintTypeName);
                // setValue(
                //   "subComplaintTypeLevelsKey",
                //   params?.row?.complaintSubTypeName ? params?.row?.complaintSubTypeName : null,
                // );
                // setValue("totalLevel", params?.row?.totalLevels);
                // setSubmitEscalate(params.row);

                addLEVEL_WISE_ESCALATIONToLocalStorage("Level_Wise_Escalation", {
                  ...params.row,
                  defaultEscDuration:
                    params.row.selectedOption === "days"
                      ? params?.row?.defaultEscDuration / 1440
                      : params?.row?.defaultEscDuration / 60,
                });

                router.push({
                  pathname: "/grievanceMonitoring/masters/toAddLevelWiseEscalation",
                });
              }}
            >
              <Tooltip title={`ADD ESCALATION AGAINST THIS RECORD`}>
                <ArrowUpwardIcon />
              </Tooltip>
            </IconButton>
          </div>
        );
      },
    },
  ];

  /////////////////////////////////////////////////
  let pushToArray = [];
  let settngLevels = () => {
    if (watch("totalLevel")) {
      for (let i = 1; i <= watch("totalLevel"); i++) {
        pushToArray.push(i);
      }
      setLevelsToSend(pushToArray);
    }
  };

  useEffect(() => {
    if (escalates === true) {
      settngLevels();
      //   console.log("levelsToSend", levelsToSend);
    }
  }, [escalates]);

  //////////////////////////////////// ADD HOURS FIELD ////////////////////
  const [hoursValue, setHoursValue] = useState("");
  const handleChange = (event) => {
    setHoursValue(event.target.value);
  };

  const options = [];
  for (let i = 6; i <= 24; i++) {
    options.push(
      <MenuItem key={i} value={i}>
        {i}
      </MenuItem>,
    );
  }

  //   useEffect(() => {
  //     if (levelsToSend?.length > 0) {
  //       let abc = levelsToSend?.map((obj) => obj);
  //       console.log("levelsToSend.map", abc);
  //       console.log("levelsToSend", levelsToSend);
  //     }
  //   });

  ////////////////////////////////AREA ZONE WARD MAPPING////////////////////////////
  const [areaId, setAreaId] = useState([]);

  // const language = useSelector((state) => state?.labels.language)
  // moduleId=9&

  const getAreas = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAreaName?moduleId=9&areaName=${watch("areaName")}`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          if (res?.data.length !== 0) {
            setAreaId(
              res?.data?.map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                areaId: r.areaId,
                zoneId: r.zoneId,
                wardId: r.wardId,
                zoneName: r.zoneName,
                zoneNameMr: r.zoneNameMr,
                wardName: r.wardName,
                wardNameMr: r.wardNameMr,
                areaName: r.areaName,
                areaNameMr: r.areaNameMr,
              })),
            );
            setValue("areaName", "");
          } else {
            sweetAlert({
              title: "OOPS!",
              text: "There are no areas match with your search!",
              icon: "warning",
              dangerMode: true,
              closeOnClickOutside: false,
            });
          }
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error1) => {
        sweetAlert({
          title: "OOPS!",
          text: `${error1}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        });
      });
  };

  ////////////////////////////WARD API//////////////
  const [allZones, setAllZones] = useState([]);
  const [allWards, setAllWards] = useState([]);

  const getAllZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllZones(
            res?.data?.zone?.map((r, i) => ({
              id: r.id,
              zoneName: r.zoneName,
              zoneNameMr: r.zoneNameMr,
            })),
          );
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error2) => {
        sweetAlert({
          title: "OOPS!",
          text: `${error2}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        });
      });
  };

  ////////////////////////////ZONE API//////////////
  const getAllWards = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllWards(
            res?.data?.ward?.map((r, i) => ({
              id: r.id,
              wardName: r.wardName,
              wardNameMr: r.wardNameMr,
            })),
          );
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error3) => {
        sweetAlert({
          title: "OOPS!",
          text: `${error3}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        });
      });
  };

  useEffect(() => {
    getAllZones();
    getAllWards();
  }, []);

  // useEffect(() => {
  //   if (watch("areaKey")) {
  //     let setZoneValue = allZones?.find((obj) => obj.id === areaId[0]?.zoneId)?.id;

  //     let setWardValue = allWards?.find((obj) => obj.id === areaId[0]?.wardId)?.id;

  //     setValue("zoneKey", setZoneValue);
  //     setValue("wardKey", setWardValue);
  //   } else {
  //     setValue("zoneKey", "");
  //     setValue("wardKey", "");
  //   }
  // });

  useEffect(() => {
    if (watch("areaKey")) {
      // alert("andr aaya first");
      let filteredArrayZone = areaId?.filter((obj) => obj?.areaId === watch("areaKey"));

      let flArray1 = allZones?.filter((obj) => {
        // alert("andar aaya");
        return filteredArrayZone.some((item) => {
          return item?.zoneId === obj?.id;
        });
      });
      console.log(":flArray1", flArray1[0]?.id);

      ////////////////////////////////////////////////////////
      let flArray2 = allWards?.filter((obj) => {
        // alert("andar aaya")
        return filteredArrayZone.some((item) => {
          return item.wardId === obj?.id;
        });
      });
      console.log(":flArray1", flArray2[0]?.id);

      setValue("zoneKey", flArray1[0]?.id);
      setValue("wardKey", flArray2[0]?.id);
    } else {
      setValue("zoneKey", "");
      setValue("wardKey", "");
    }
  }, [watch("areaKey")]);

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
                <FormattedLabel id="totalLevelsAndDefaultDuration" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {isOpenCollapse && (
            <>
              <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                <div>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    {/* ////////////////////////////////////////First Line////////////////////////////////////// */}
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      {/* //////////////////////////////////////////// */}
                      <Grid
                        container
                        spacing={2}
                        style={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={4}
                          lg={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "baseline",
                            gap: 5,
                          }}
                        >
                          {areaId.length === 0 ? (
                            <>
                              <TextField
                                autoFocus
                                style={{
                                  backgroundColor: "white",
                                  width: "230px",
                                  // color: "black",
                                }}
                                id="outlined-basic"
                                // label={language === "en" ? "Application Number" : "अर्ज क्रमांक"}
                                label="Search By Area Name"
                                placeholder="Enter Area Name, Like 'Dehu'"
                                variant="standard"
                                {...register("areaName")}
                                error={!!errors.areaName}
                                helperText={errors?.areaName ? errors.areaName.message : null}
                              />
                              <Button
                                variant="contained"
                                onClick={() => {
                                  if (watch("areaName")) {
                                    getAreas();
                                  } else {
                                    sweetAlert({
                                      title: "OOPS!",
                                      text: "Please Enter The Area Name first",
                                      icon: "warning",
                                      dangerMode: true,
                                      closeOnClickOutside: false,
                                    });
                                  }
                                }}
                                size="small"
                                style={{ backgroundColor: "green", color: "white" }}
                              >
                                {/* <FormattedLabel id="getDetails" /> */}
                                Get Result
                              </Button>
                            </>
                          ) : (
                            <>
                              <FormControl style={{ minWidth: "230px" }} error={!!errors.areaKey}>
                                <InputLabel id="demo-simple-select-standard-label">
                                  {/* <FormattedLabel id="complaintTypes" /> */}
                                  Results
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      style={{ backgroundColor: "inherit" }}
                                      fullWidth
                                      variant="standard"
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      label="Complaint Type"
                                    >
                                      {areaId &&
                                        areaId.map((areaId, index) => (
                                          <MenuItem key={index} value={areaId.areaId}>
                                            {areaId?.areaName}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="areaKey"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.areaKey ? errors.areaKey.message : null}
                                </FormHelperText>
                              </FormControl>

                              {/* ////////////////// */}
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  setAreaId([]);
                                  setValue("areaKey", "");
                                }}
                                size="small"
                              >
                                {/* <FormattedLabel id="getDetails" /> */}
                                Search Area
                              </Button>
                            </>
                          )}
                        </Grid>

                        {/* ////////////////////////////////////DROPDOWN FIELD//////////////////////// */}
                        <Grid
                          item
                          xs={12}
                          sm={3.5}
                          md={3.5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl style={{ minWidth: "230px" }} error={!!errors.zoneKey}>
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* <FormattedLabel id="complaintTypes" /> */}
                              Zone
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  fullWidth
                                  disabled
                                  variant="standard"
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  label="Complaint Type"
                                >
                                  {allZones &&
                                    allZones.map((allZones, index) => (
                                      <MenuItem key={index} value={allZones.id}>
                                        {/* {language == "en"
                          ? //@ts-ignore
                            complaintType.complaintTypeEn
                          : // @ts-ignore
                            complaintType?.complaintTypeMr} */}
                                        {allZones?.zoneName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="zoneKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={3.5}
                          md={3.5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl style={{ minWidth: "230px" }} error={!!errors.wardKey}>
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* <FormattedLabel id="complaintTypes" /> */}
                              Ward
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled
                                  fullWidth
                                  variant="standard"
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  label="Complaint Type"
                                >
                                  {allWards &&
                                    allWards?.map((allWards, index) => (
                                      <MenuItem key={index} value={allWards.id}>
                                        {/* {language == "en"
                          ? //@ts-ignore
                            complaintType.complaintTypeEn
                          : // @ts-ignore
                            complaintType?.complaintTypeMr} */}
                                        {allWards.wardName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="wardKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      {/* /////////////////////////////////////////////// */}

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
                        <FormControl style={{ minWidth: "230px" }} error={!!errors.deptKey}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="departmentName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{ width: 250 }}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label={<FormattedLabel id="departmentName" />}
                              >
                                {departments &&
                                  departments?.map((department, index) => (
                                    <MenuItem key={index} value={department.id}>
                                      {language == "en"
                                        ? //@ts-ignore
                                          department.departmentEn
                                        : // @ts-ignore
                                          department?.departmentMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="deptKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>{errors?.deptKey ? errors.deptKey.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>

                      {subDepartments?.length !== 0 ? (
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
                          <FormControl style={{ minWidth: "230px" }} error={!!errors.subDepartmentKey}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="subDepartmentName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // sx={{ width: 250 }}
                                  fullWidth
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Sub Department Name"
                                >
                                  {subDepartments &&
                                    subDepartments?.map((subDepartment, index) => (
                                      <MenuItem key={index} value={subDepartment.id}>
                                        {language == "en"
                                          ? //@ts-ignore
                                            subDepartment.subDepartmentEn
                                          : // @ts-ignore
                                            subDepartment?.subDepartmentMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="subDepartmentKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.subDepartmentKey ? errors.subDepartmentKey.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : (
                        ""
                      )}

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
                        <FormControl style={{ minWidth: "230px" }} error={!!errors.complaintTypeKey}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="complaintTypes" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label="Complaint Type"
                              >
                                {complaintTypes &&
                                  complaintTypes.map((complaintType, index) => (
                                    <MenuItem key={index} value={complaintType.id}>
                                      {language == "en"
                                        ? //@ts-ignore
                                          complaintType.complaintTypeEn
                                        : // @ts-ignore
                                          complaintType?.complaintTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="complaintTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.complaintTypeKey ? errors.complaintTypeKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {complaintSubTypes?.length !== 0 ? (
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
                          <FormControl style={{ minWidth: "230px" }} error={!!errors.complaintSubTypeKey}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="complaintSubTypes" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  fullWidth
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Sub-Complaint Type"
                                >
                                  {complaintSubTypes &&
                                    complaintSubTypes.map((complaintSubType, index) => (
                                      <MenuItem key={index} value={complaintSubType.id}>
                                        {complaintSubType.complaintSubType}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="complaintSubTypeKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.complaintSubTypeKey ? errors.complaintSubTypeKey.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      ) : (
                        ""
                      )}

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
                        <FormControl style={{ minWidth: "230px" }} error={!!errors.totalLevels}>
                          <InputLabel id="demo-simple-select-label">
                            <FormattedLabel id="levels" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={field.value}
                                label="Level"
                                //   onChange={(event) => setLevels(event.target.value)}
                                onChange={(value) => field.onChange(value)}
                              >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={7}>7</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                                <MenuItem value={9}>9</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                              </Select>
                            )}
                            name="totalLevels"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.totalLevels ? errors.totalLevels.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* <Grid
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
                          // style={{ backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="defaultEscDurationDays" />}
                          // variant="outlined"
                          variant="standard"
                          {...register("defaultEscDuration")}
                          error={!!errors.defaultEscDuration}
                          helperText={errors?.defaultEscDuration ? errors.defaultEscDuration.message : null}
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
                          <InputLabel id="demo-simple-select-label">
                            <FormattedLabel id="defaultEscDurationHours" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label={<FormattedLabel id="defaultEscDurationHours" />}
                                //   onChange={(event) => setLevels(event.target.value)}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                              >
                                {options}
                              </Select>
                            )}
                            name="defaultEscDurationInHours"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
                      </Grid> */}

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
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
                              <div style={{ display: "flex", alignItems: "baseline", flexDirection: "row" }}>
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

                      {/* ////////////////// */}
                      {/* <Select value={value} onChange={handleChange}>
                        {options}
                      </Select> */}
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
                          onClick={() => cancellButton()}
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
                          onClick={() => exitButton()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </Slide>
              {/* ///////////////////////////////////////////////////////////////// */}
            </>
          )}
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {escalates && (
            <Slide direction="down" in={slideCheckedForEscalate} mountOnEnter unmountOnExit>
              <div>
                <form>
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
                        label="Complaint Type"
                        // variant="outlined"
                        variant="standard"
                        {...register("complaintTypeLevelsKey")}
                        error={!!errors.complaintTypeLevelsKey}
                        helperText={
                          errors?.complaintTypeLevelsKey ? errors.complaintTypeLevelsKey.message : null
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
                        label="Complaint Sub Type"
                        // variant="outlined"
                        variant="standard"
                        {...register("subComplaintTypeLevelsKey")}
                        error={!!errors.subComplaintTypeLevelsKey}
                        helperText={
                          errors?.subComplaintTypeLevelsKey ? errors.subComplaintTypeLevelsKey.message : null
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
                        label="Total Levels"
                        // variant="outlined"
                        variant="standard"
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
                        <InputLabel id="demo-simple-select-label">Levels</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={field.value}
                              label="Levels"
                              //   onChange={(event) => setLevels(event.target.value)}
                              onChange={(value) => field.onChange(value)}
                            >
                              {levelsToSend &&
                                levelsToSend?.map((obj, index) => (
                                  <MenuItem key={index} value={obj}>
                                    {obj}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="level"
                          control={control}
                          defaultValue=""
                        />
                      </FormControl>
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
                      <TextField
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label="Escalation Duration"
                        // variant="outlined"
                        variant="standard"
                        {...register("duration")}
                        error={!!errors.duration}
                        helperText={errors?.duration ? errors.duration.message : null}
                      />
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
                        type="button"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                        onClick={handleSaveForEscalate}
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
                          setValue("level", "");
                          setValue("duration", "");
                          setEscalates(!escalates),
                            setSlideCheckedForEscalate(true),
                            setButtonInputState(!buttonInputState);
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
              rows={data?.rows}
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
