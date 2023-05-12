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
import Schema from "../../.../../../../containers/schema/grievanceMonitoring/userBasedOnDepartmentSchema";
import CircularProgress from "@mui/material/CircularProgress";

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
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [usersAgainstDept, setUsersAgainstDept] = useState([]);
  const [dataForUpdate, setDataForUpdate] = useState([]);
  const [tempUser, settempUser] = useState(false);
  const [complaintFlag, setComplaintFlag] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((store) => store.labels.language);

  //////////////////////..DEPT KEY..//////////////////////
  // const userDeptKey = useSelector((state) => {
  //   console.log("userDetails", state?.user?.user?.userDao?.department);
  //   return state?.user?.user?.userDao?.department;
  // });
  //////////////////////..DEPT KEY..//////////////////////

  // Get Table - Data
  const getAllUsersWithDept = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.GM}/empGrievanceLevelMapping/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let result = res?.data?.empGrievanceLevelMappingList;
          let _res = result?.map((val, i) => {
            console.log("44");
            return {
              activeFlag: val.activeFlag,
              id: val.id,
              srNo: i + 1,
              depName: val.depName,
              userKey: val.userKey,
              user_NameEn: val.firstName + " " + val.middleName + " " + val.lastName,
              user_NameMr: val.firstNameMr + " " + val.middleNameMr + " " + val.lastNameMr,
              userName: val.userName,
              level: val.level,
              deptKey: val.deptKey,
              complaintTypeKey: val.complaintTypeKey,
              complaintTypeName: val.complaintTypeName,
              complaintSubTypeKey: val.complaintSubTypeKey,
              complaintSubTypeName: val.complaintSubTypeName,
              //////area zone ward///////////////
              areaKey: val.areaKey,
              wardKey: val.wardKey,
              zoneKey: val.zoneKey,
            };
          });

          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          setLoading(false);
        } else {
          sweetAlert("Something Went Wrong!");
          setLoading(false);
        }
      })
      .catch((error) => {
        sweetAlert(error);
        setLoading(false);
      });
  };

  ////////////////////DEPARTMENT////////////
  const [departments, setDepartments] = useState([
    {
      id: 1,
      departmentEn: "",
      departmentMr: "",
    },
  ]);

  const [complaintTypes, setComplaintTypes] = useState([]);

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
    getAllUsersWithDept();
  }, []);

  /////////////////////////////////////////////////////////////

  useEffect(() => {
    getDepartment();
  }, []);
  ///////////////////////////////////////////
  let getAllUsers = () => {
    axios.get(`${urls.GM}/master/user/getAllBydept?dept=${watch("deptKey")}`).then((res) => {
      console.log(";res", res);

      let result = res.data?.user;
      let _res = result?.map((val, i) => {
        console.log("44");
        return {
          activeFlag: val.activeFlag,
          id: val.id,
          srNo: i + 1,
          // firstNameEn: val.firstNameEn,
          // firstNameMr: val.firstNameMr,
          // middleNameEn: val.middleNameEn,
          // middleNameMr: val.middleNameMr,
          // lastNameEn: val.lastNameEn,
          // lastNameMr: val.lastNameMr,
          userName: val.userName,
          FullNameEn: val.firstNameEn + " " + val.middleNameEn + " " + val.lastNameEn,
          FullNameMr: val.firstNameMr + " " + val.middleNameMr + " " + val.lastNameMr,
        };
      });
      setUsersAgainstDept(_res);
    });
  };

  useEffect(() => {
    if (watch("deptKey") || tempUser) {
      getAllUsers();
    }
  }, [watch("deptKey"), tempUser]);

  //////////////////////////////////////////////////////////////////

  const getComplaintTypes = () => {
    if (watch("deptKey")) {
      axios
        .get(`${urls.GM}/complaintTypeMaster/getByDepId?id=${watch("deptKey")}`)
        .then((res) => {
          setComplaintTypes(
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
    }
  };
  useEffect(() => {
    getComplaintTypes();
  }, [watch("deptKey")]);

  ////////////////////SUB COMPLAINT DEPT.//////////
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);
  const getComplaintSubType = () => {
    if (watch("complaintTypeKey")) {
      axios
        .get(`${urls.GM}/complaintSubTypeMaster/getAllByCmplId?id=${watch("complaintTypeKey")}`)
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            setComplaintSubTypes(
              res.data.complaintSubTypeMasterList.map((r, i) => ({
                id: r.id,
                complaintSubType: r.complaintSubType,
                complaintTypeMr: r.complaintTypeMr,
                complaintTypeId: r.complaintTypeId,
              })),
            );
          }
        })
        .catch((error) => {
          sweetAlert("Something went wrong!");
        });
    }
  };

  useEffect(() => {
    if (watch("complaintTypeKey") || complaintFlag) {
      // alert('watch("complaintTypeKey"), complaintFlag');
      // alert(watch("complaintTypeKey"));
      getComplaintSubType();
    }
  }, [watch("complaintTypeKey"), complaintFlag]);

  useEffect(() => {
    if (watch("deptKey")) {
      if (complaintTypes.length === 0 || !watch("complaintTypeKey")) {
        setComplaintSubTypes([]);
      }
    }
  });

  //////////////////////////////////////
  let checkingSandU = (finalBodyForApi, finalBodyForUpdate) => {
    if (btnSaveText === "Save") {
      return axios.post(`${urls.GM}/empGrievanceLevelMapping/save`, finalBodyForApi);
    } else {
      return axios.post(`${urls.GM}/empGrievanceLevelMapping/save`, finalBodyForUpdate);
    }
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      deptKey: formData.deptKey,
      level: formData.level,
      userKey: formData.userKey,
      complaintTypeKey: formData.complaintTypeKey,
      complaintSubTypeKey: formData.complaintSubTypeKey,
      areaKey: watch("areaKey"),
      zoneKey: watch("zoneKey"),
      wardKey: watch("wardKey"),
    };

    const finalBodyForUpdate = {
      activeFlag: formData.activeFlag,
      id: formData.id,
      deptKey: formData.deptKey,
      level: formData.level,
      userKey: formData.userKey,
      complaintTypeKey: formData.complaintTypeKey,
      complaintSubTypeKey: formData.complaintSubTypeKey,
      areaKey: watch("areaKey"),
      zoneKey: watch("zoneKey"),
      wardKey: watch("wardKey"),
    };

    checkingSandU(finalBodyForApi, finalBodyForUpdate)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAllUsersWithDept();
          settempUser(false);
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setValue("deptKey", "");
          setUsersAgainstDept([]);
          setComplaintSubTypes([]);
          setComplaintFlag(false);
        }
      })
      .catch((error) => {
        if (error.request.status === 500) {
          swal(error.response.data.message, {
            icon: "error",
          });
          getAllUsersWithDept();
          setButtonInputState(false);
          setComplaintFlag(false);
          setComplaintSubTypes([]);
        } else {
          swal("Something went wrong!", {
            icon: "error",
          });
          getAllUsersWithDept();
          setButtonInputState(false);
          setComplaintFlag(false);
          setComplaintSubTypes([]);
        }
        // console.log("error", error);
      });
  };

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
            .post(`${urls.GM}/empGrievanceLevelMapping/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is De-Activated Successfully!", {
                  icon: "success",
                });
                getAllUsersWithDept();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllUsersWithDept();
                setButtonInputState(false);
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                });
                getAllUsersWithDept();
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
            .post(`${urls.GM}/empGrievanceLevelMapping/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Activated Successfully!", {
                  icon: "success",
                });
                getAllUsersWithDept();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllUsersWithDept();
                setButtonInputState(false);
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                });
                getAllUsersWithDept();
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
    setDeleteButtonState(false);
    setValue("deptKey", "");
    setValue("complaintTypeKey", "");
    setValue("complaintSubTypeKey", "");
    setUsersAgainstDept([]);
    setComplaintTypes([]);
    setComplaintSubTypes([]);
    settempUser(false);
    setComplaintFlag(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setValue("deptKey", "");
    setValue("complaintTypeKey", "");
    setValue("complaintSubTypeKey", "");
    setUsersAgainstDept([]);
    setComplaintTypes([]);
    setComplaintSubTypes([]);
    settempUser(false);
    setComplaintFlag(false);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    depName: "",
    deptKey: "",
    complaintTypeKey: "",
    userKey: "",
    level: "",
    user_NameEn: "",
    user_NameMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    depName: "",
    deptKey: "",
    complaintTypeKey: "",
    userKey: "",
    level: "",
    user_NameEn: "",
    user_NameMr: "",
    id: null,
  };

  /////////////////////...FOR UPDATE.../////////////////

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: language === "en" ? "user_NameEn" : "user_NameMr",
      headerName: <FormattedLabel id="userName" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "depName",
      headerName: <FormattedLabel id="depName" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "complaintTypeName",
      headerName: "Complaint Name",
      minWidth: 200,
      headerAlign: "center",
    },
    // {
    //   field: "complaintSubTypeKey",
    //   headerName: <FormattedLabel id="depName" />,
    //   minWidth: 200,
    //   headerAlign: "center",
    // },
    {
      field: "level",
      headerName: <FormattedLabel id="level" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // { field: "status", headerName: <FormattedLabel id="status" /> },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 180,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
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
                settempUser(true);
                setComplaintFlag(true);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
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
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </div>
        );
      },
    },
  ];

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

      // let setZoneValue = allZones?.find(
      //   (obj) => obj.id === areaId[0]?.zoneId
      // )?.id

      // let setWardValue = allWards?.find(
      //   (obj) => obj.id === areaId[0]?.wardId
      // )?.id

      setValue("zoneKey", flArray1[0]?.id);
      setValue("wardKey", flArray2[0]?.id);
    } else {
      setValue("zoneKey", "");
      setValue("wardKey", "");
    }
  }, [watch("areaKey")]);
  //////////////////////////////////////////////////////////////////////////////////

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
              }}
            >
              <strong className="fancy_link1">
                <FormattedLabel id="addUsersBasedOnDepartment" />
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
                    {/* /////////////////////////////////////////////// */}

                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                        marginLeft: "4px",
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
                                  allWards.map((allWards, index) => (
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
                                departments.map((department, index) => (
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

                    {/* /////////////////////////////// */}
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

                    {/* //////////////////////////// */}

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
                      <FormControl style={{ minWidth: "230px" }} error={!!errors.userKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="user" />
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
                              label={<FormattedLabel id="user" />}
                            >
                              {usersAgainstDept &&
                                usersAgainstDept.map((user, index) => (
                                  <MenuItem key={index} value={user.id}>
                                    {language == "en"
                                      ? //@ts-ignore
                                        user.FullNameEn
                                      : // @ts-ignore
                                        user?.FullNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="userKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.userKey ? errors.userKey.message : null}</FormHelperText>
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
                      <FormControl style={{ minWidth: "230px" }} error={!!errors.level}>
                        <InputLabel id="demo-simple-select-label">{<FormattedLabel id="level" />}</InputLabel>
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
                          name="level"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.level ? errors.level.message : null}</FormHelperText>
                      </FormControl>
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
          )}
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

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
              <CircularProgress color="success" />
            </div>
          ) : (
            <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
              <DataGrid
                sx={{
                  overflowY: "scroll",

                  "& .MuiDataGrid-virtualScrollerContent": {
                    // backgroundColor:'red',
                    // height: '800px !important',
                    // display: "flex",
                    // flexDirection: "column-reverse",
                    // overflow:'auto !important'
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
                    quickFilterProps: { debounceMs: 500 },
                    disableExport: true,
                    disableToolbarButton: true,
                    csvOptions: { disableToolbarButton: true },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                autoHeight={true}
                // rowHeight={50}
                pagination
                paginationMode="server"
                // loading={data.loading}
                rowCount={data?.totalRows}
                rowsPerPageOptions={data?.rowsPerPageOptions}
                page={data?.page}
                pageSize={data?.pageSize}
                rows={data?.rows || []}
                columns={columns}
                onPageChange={(_data) => {
                  getAllUsersWithDept(data?.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getAllUsersWithDept(_data, data?.page);
                }}
              />
            </Box>
          )}
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
