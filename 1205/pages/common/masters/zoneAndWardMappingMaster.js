import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/ZoneAndWardMappingMaster";
import styles from "../../../styles/cfc/cfc.module.css";

const Index = () => {
  // import from use Form

  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  let DataBharaychaKiNahi = false; //Used to decide page type (edit/viewable/new)
  // let id = router.query.id;

  let isDisabled = false;
  let isAcknowledgement = false;
  const [runAgain, setRunAgain] = useState(false);
  const [fieldValues, setFieldValues] = useState({});
  const [collapse, setCollapse] = useState(false);
  const [applicationList, setApplicationList] = useState([]);
  const [_applicationList, _setApplicationList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [_departmentList, _setDepartmentList] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [_zoneList, _setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [_wardList, _setWardList] = useState([]);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  // const [opening, setopening] = useState(false);
  const [id, setID] = useState();
  const [officeLocationList, setOfficeLocationList] = useState([]);

  const router = useRouter();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

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
  };

  const [open, setOpen] = useState();

  const handleOpen = () => {
    setOpen(false);
  };

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let isSave = true;

  useEffect(() => {
    getZone();
    getWard();
    setRunAgain(false);
    getApplicationName();

    getDepartments();
    getOfficeLocation();
  }, []);

  useEffect(() => {
    getZoneAndWard();
  }, [departmentList, zoneList, wardList, officeLocationList]);

  const getDepartments = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/department/getAll`)

      .then((r) => {
        if (r.status == 200) {
          setDepartmentList(r.data.department);
          console.log("res department", r.data.department);
          let departments = {};
          r.data.department.map((r) => (departments[r.id] = r.department));
          _setDepartmentList(departments);

          setOpen(false);
        }
      })
      .catch((err) => {
        setOpen(false);
        // console.log("err", err);
      });
  };

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(r.data.officeLocation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getApplicationName = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/application/getAll`)

      .then((r) => {
        if (r.status == 200) {
          setApplicationList(r.data.application);
          console.log("222res Application", r);
          let applications = {};
          r.data.map((r) => (applications[r.id] = r.applicationNameEng));
          _setApplicationList(applications);
          setOpen(false);
        }
      })
      .catch((err) => {
        setOpen(false);
        // console.log("err", err);
      });
  };

  const getZoneAndWard = (_pageSize = 10, _pageNo = 0) => {
    setOpen(true);
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getAll`,

        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        },
      )
      .then((res) => {
        console.log("res mst", res);
        if (res.status == 200) {
          setOpen(false);
          let result = res.data.zoneAndWardLevelMapping;
          let _res = result.map((val, i) => {
            return {
              activeFlag: val.activeFlag,
              srNo: val.id,
              // applicationNameEng: _applicationList[val.application]
              //   ? _applicationList[val.application]
              //   : "-",
              officeLocation: val.officeLocation,
              officeLocationCol: officeLocationList.find((f) => f.id == val.officeLocation)
                ?.officeLocationName,
              departmentName: _departmentList[val.department] ? _departmentList[val.department] : "-",
              id: val.id,

              zoneNumber: val.zone,
              wardNumber: val.ward,
              // zoneName: _zoneList[val.zone] ? _zoneList[val.zone] : "-",
              // wardName: _wardList[val.ward] ? _wardList[val.ward] : "-",

              zoneName: zoneList.find((f) => f.id == val.zoneNumber)?.zoneNo,

              wardName: val.wardName,
              zoneNameCol: zoneList.find((f) => f.id == val.zone)?.zoneName,
              wardNameCol: wardList.find((f) => f.id == val.ward)?.wardName,

              // zoneName: zoneList.find((f) => f.id == val.zone)?.zoneName,
              // wardName: wardList.find((f) => f.id == val.ward)?.wardName,

              department: val.department,
              departmentCol: departmentList.find((f) => f.id == val.department)?.department,

              status: val.activeFlag === "Y" ? "Active" : "Inactive",
              application: val.application,
              applicationCol: applicationList.find((f) => f.id == val.application)?.applicationNameEng,
            };
          });
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          setDataSource(r.data);
          setOpen(false);
        }
      })
      .catch((err) => {
        setOpen(false);
        // console.log("err", err);
      });
  };

  const getZone = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((res) => {
        if (res.status == 200) {
          setZoneList(res.data.zone);
          console.log("res getZone", res);
          // let result = res.data.zone;
          let zones = {};
          res.data.zone.map((r) => (zones[r.id] = r.zoneName));
          console.log("zones", zones);
          _setZoneList(zones);
          setOpen(false);
        }
      })
      .catch((err) => {
        // console.log("err", err);
        setOpen(false);
      });
  };

  const getWard = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`)
      .then((res) => {
        if (res.status == 200) {
          setWardList(res.data.ward);
          console.log("res getWard", res);
          let wards = {};
          res.data.ward.map((r) => (wards[r.id] = r.wardName));
          console.log("wards", wards);
          _setWardList(wards);
          setOpen(false);
        }
      })
      .catch((err) => {
        setOpen(false);
        // console.log("err", err);
      });
  };

  if (router.query.pageMode === "view") {
    DataBharaychaKiNahi = true;
    isDisabled = true;
    isAcknowledgement = true;
    isSave = false;
  }

  if (router.query.pageMode === "edit") {
    DataBharaychaKiNahi = true;
  }

  const onSubmit = async (data) => {
    setOpen(true);
    const bodyForAPI = {
      ...data,
      activeFlag: btnSaveText === "Update" ? data.activeFlag : null,
      zone: Number(data.zoneNumber),
      ward: Number(data.wardNumber),
      department: Number(data.department),
      officeLocation: Number(data.officeLocation),
    };

    console.log("bodyForAPI", bodyForAPI);

    await axios.post(`${urls.CFCURL}/master/zoneAndWardLevelMapping/save`, bodyForAPI).then((response) => {
      console.log("save data", response);
      if (response.status == 200) {
        // if (res.data?.errors?.length > 0) {
        //   res.data?.errors?.map((x) => {
        //     if (x.field == "department") {
        //       setError("department", { message: x.code });
        //     } else if (x.field == "departmentMr") {
        //       setError("departmentMr", { message: x.code });
        //     }
        //   });
        // } else {
        data.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getZoneAndWard();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
        setOpen(false);
        // }
      }
    });
  };

  // const deleteById = (value, _activeFlag) => {
  //   setOpen(true);
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Inactivate?",
  //       text: "Are you sure you want to inactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/zoneAndWardLevelMapping/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             setOpen(false);
  //             swal("Record is Successfully Deactivated!", {
  //               icon: "success",
  //             });
  //             getZoneAndWard();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //         setOpen(false);
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/zoneAndWardLevelMapping/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             setOpen(false);
  //             swal("Record is Successfully Activated!", {
  //               icon: "success",
  //             });
  //             getZoneAndWard();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //         setOpen(false);
  //       }
  //     });
  //   }
  // };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/zoneAndWardLevelMapping/save`, body)

            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getZoneAndWard();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
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
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.CFCURL}/master/zoneAndWardLevelMapping/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getZoneAndWard();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const resetValuesExit = {
    departmentName: null,
    officeLocation: null,
    zoneNumber: null,
    wardNumber: null,
    zoneName: null,
    wardName: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      //   flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicationCol",
      // headerName: <FormattedLabel id="applicationNameEng" />,
      headerName: <FormattedLabel id="applicationName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="documentName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "officeLocationCol",
      headerName: <FormattedLabel id="officeLocation" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "zoneNumber",
    //   headerName: <FormattedLabel id="zoneNumber" />,
    //   width: 100,
    //   //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "zoneNameCol",
      headerName: <FormattedLabel id="zoneName" />,
      //   width: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wardNameCol",
      headerName: <FormattedLabel id="wardName" />,
      //   width: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wardNumber",
      headerName: <FormattedLabel id="wardNumber" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "zoneNumber",
      headerName: <FormattedLabel id="zoneNumber" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState || params.row.activeFlag === "N" ? false : true}
              // disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip title="Edit">
                  <EditIcon disabled />
                </Tooltip>
              )}
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  const temp = (e) => {
    console.log("File name baherna: ", e.target.files[0]);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    departmentName: null,
    officeLocation: null,
    zoneNumber: "",
    wardNumber: "",
    zoneName: null,
    wardName: null,
  };

  const editById = (values) => {
    console.log("Kasla data edit hotoy: ", values);
    reset({ ...values });
    setCollapse(true);
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // const onBack = () => {
  // const urlLength = router.asPath.split("/").length;
  // const urlArray = router.asPath.split("/");
  // let backUrl = "";
  // if (urlLength > 2) {
  //   for (let i = 0; i < urlLength - 1; i++) {
  //     backUrl += urlArray[i] + "/";
  //   }
  //   console.log("Final URL: ", backUrl);
  //   router.push(`${backUrl}`);
  // } else {
  //   router.push("/dashboard");
  // }
  // };

  const onBack = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  return (
    <>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "34%" }}>
            <FormattedLabel id="zoneAndWardMapping" />
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleOpen}
      >
        opening....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper style={{ paddingTop: isOpenCollapse ? "20px" : "0px" }}>
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <Paper
            sx={{
              marginLeft: 3,
              marginRight: 3,
              marginBottom: 3,
              padding: 2,
              backgroundColor: "#F5F5F5",
            }}
            elevation={5}
          >
            <br />
            <br />
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {isOpenCollapse && (
                  <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                    <div className={styles.fields}>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                            <InputLabel id="demo-simple-select-standard-label">Application Name</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  error={errors?.application ? true : false}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  // label={<FormattedLabel id="departmentName" />}
                                  label="Application Name"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {applicationList.length > 0
                                    ? applicationList.map((app, index) => {
                                        return (
                                          <MenuItem key={index} value={app.id}>
                                            {language === "en"
                                              ? app.applicationNameEng
                                              : app.applicationNameMr}
                                          </MenuItem>
                                        );
                                      })
                                    : "NA"}
                                </Select>
                              )}
                              name="application"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.application ? errors.application.message : null}
                            </FormHelperText>
                          </FormControl>
                          {/* <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                            <InputLabel id="demo-simple-select-standard-label">Department Name</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label={<FormattedLabel id="departmentName" />}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {departmentList.length > 0
                                    ? departmentList.map((department, index) => {
                                        return (
                                          <MenuItem key={index} value={department.id}>
                                            {department.department}
                                          </MenuItem>
                                        );
                                      })
                                    : "NA"}
                                </Select>
                              )}
                              name="department"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.department ? errors.department.message : null}
                            </FormHelperText>
                          </FormControl> */}
                          {/* <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              application Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label={
                                    <FormattedLabel id="applicationNameEng" />
                                  }
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {applicationList.length > 0
                                    ? applicationList.map(
                                        (application, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={application.id}
                                            >
                                              {application.applicationNameEng}
                                            </MenuItem>
                                          );
                                        }
                                      )
                                    : "NA"}
                                </Select>
                              )}
                              name="applicationNameEng"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.applicationNameEng
                                ? errors.applicationNameEng.message
                                : null}
                            </FormHelperText>
                          </FormControl> */}
                        </Grid>
                        <Grid item xs={6} style={{ display: "flex", justifyContent: "center" }}>
                          <FormControl style={{ width: "48%" }} size="small">
                            <InputLabel id="demo-simple-select-label">Location name</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  error={errors?.officeLocation ? true : false}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="Location name"
                                  value={field.value}
                                  // onChange={(value) => field.onChange(value)}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    // handleApplicationNameChange(value);
                                  }}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {officeLocationList.length > 0
                                    ? officeLocationList.map((val, id) => {
                                        return (
                                          <MenuItem key={id} value={val.id}>
                                            {val.officeLocationName}
                                          </MenuItem>
                                        );
                                      })
                                    : "Not Available"}
                                </Select>
                              )}
                              name="officeLocation"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.officeLocation ? errors.officeLocation.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl size="small" sx={{ width: "50%" }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="zoneNumber" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  error={errors?.zoneNumber ? true : false}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  // label="Zone Number"
                                  label={<FormattedLabel id="zoneNumber" />}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value), setSelectedZone(value.target.value);
                                  }}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {zoneList.length > 0
                                    ? zoneList.map((zone, index) => {
                                        return (
                                          <MenuItem key={index} value={zone.id}>
                                            {zone.zoneNo}
                                          </MenuItem>
                                        );
                                      })
                                    : "NA"}
                                </Select>
                              )}
                              name="zoneNumber"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.zoneNumber ? errors.zoneNumber.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "50%",
                              backgroundColor: "white",
                            }}
                            id="outlined-basic"
                            label="Zone name"
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            variant="outlined"
                            value={
                              zoneList?.find((r) => {
                                return r.id === selectedZone;
                              })?.zoneName
                            }
                            disabled={true}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl size="small" sx={{ width: "50%" }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="wardNumber" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  error={errors?.wardNumber ? true : false}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  // label="Ward Number"
                                  label={<FormattedLabel id="wardNumber" />}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value), setSelectedWard(value.target.value);
                                  }}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {wardList.length > 0
                                    ? wardList.map((ward, index) => {
                                        return (
                                          <MenuItem key={index} value={ward.id}>
                                            {ward.wardNo}
                                          </MenuItem>
                                        );
                                      })
                                    : "NA"}
                                </Select>
                              )}
                              name="wardNumber"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.wardNumber ? errors.wardNumber.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "50%",
                              backgroundColor: "white",
                            }}
                            id="outlined-basic"
                            label="Ward name"
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            variant="outlined"
                            value={
                              wardList?.find((r) => {
                                return r.id === selectedWard;
                              })?.wardName
                            }
                            disabled={true}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                            <InputLabel id="demo-simple-select-standard-label">Department Name</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label={<FormattedLabel id="departmentName" />}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {departmentList.length > 0
                                    ? departmentList.map((department, index) => {
                                        return (
                                          <MenuItem key={index} value={department.id}>
                                            {department.department}
                                          </MenuItem>
                                        );
                                      })
                                    : "NA"}
                                </Select>
                              )}
                              name="department"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.department ? errors.department.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <br />
                      <br />
                      <Grid container className={styles.feildres} spacing={2}>
                        <Grid item>
                          <Button
                            type="submit"
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<SaveIcon />}
                          >
                            <FormattedLabel id="Save" />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<ClearIcon />}
                            onClick={() => {
                              reset({
                                ...resetValuesExit,
                              });
                            }}
                          >
                            {<FormattedLabel id="clear" />}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            // color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </Grid>
                      </Grid>
                      <br />
                    </div>
                  </Slide>
                )}
              </form>
            </FormProvider>
          </Paper>
        </Slide>

        <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
            // autoHeight={true}
            autoHeight={data.pageSize}
            density="compact"
            sx={{
              "& .super-app-theme--cell": {
                backgroundColor: "#E3EAEA",
                borderLeft: "10px solid white",
                borderRight: "10px solid white",
                borderTop: "4px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {},
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E3EAEA",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-column": {
                backgroundColor: "red",
              },
            }}
            pagination
            paginationMode="server"
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getZoneAndWard(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              getZoneAndWard(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
