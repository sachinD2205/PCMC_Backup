import React, { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../../styles/[zoneAndWardMappingMaster].module.css";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import router from "next/router";
import sweetAlert from "sweetalert";
import {
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Card,
  Box,
  IconButton,
  Slide,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  FormLabel,
  Backdrop,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Head from "next/head";
import axios from "axios";
// import schema from "../../../containers/schema/common/ZoneAndWardMappingMaster";
import { Clear, ExitToApp, l, Save } from "@mui/icons-material";
import { useState } from "react";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import { language } from "../../../features/labelSlice";
import { useSelector } from "react-redux";

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
    // resolver: yupResolver(schema),
  });

  let DataBharaychaKiNahi = false; //Used to decide page type (edit/viewable/new)
  // let id = router.query.id;

  const language = useSelector((state) => state?.labels?.language);

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
  // const [loading, setLoading] = useState(false);
  const [id, setID] = useState();
  const [areaList, setareaList] = useState([]);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

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
    getarea();
  }, []);

  useEffect(() => {
    getZoneAndWard();
  }, [departmentList, zoneList, wardList, areaList]);

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

  const getarea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r.data.area);
          setareaList(r.data.area);
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
        // if (r.status == 200) {
        //   console.log("res Application", r);
        //   let applications = {};
        //   r.data.map((r) => (applications[r.id] = r.applicationNameEng));
        //   _setApplicationList(applications);
        //   setApplicationList(r.data.application);
        //   setOpen(false);
        // }
        _setApplicationList(r.data.applications);
        setApplicationList(r.data.application);
      })
      .catch((err) => {
        setOpen(false);
        // console.log("err", err);
      });
  };

  const getZoneAndWard = (_pageSize = 10, _pageNo = 0) => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log("res mst", res);
        if (res.status == 200) {
          setOpen(false);
          let result = res.data.zoneWardAreaMapping;
          let _res = result.map((val, i) => {
            return {
              activeFlag: val.activeFlag,
              srNo: val.id,
              // applicationNameEng: _applicationList[val.application]
              //   ? _applicationList[val.application]
              //   : "-",
              area: val.area,
              areaCol: areaList.find((f) => f.id == val.area)?.areaName,
              departmentName: _departmentList[val.department] ? _departmentList[val.department] : "-",
              id: val.id,

              // zoneName: _zoneList[val.zone] ? _zoneList[val.zone] : "-",
              // wardName: _wardList[val.ward] ? _wardList[val.ward] : "-",

              zoneName: zoneList.find((f) => f.id == val.zone)?.zoneNo,
              wardName: wardList.find((f) => f.id == val.ward)?.wardName,

              department: val.department,
              departmentCol: departmentList.find((f) => f.id == val.department)?.department,
              wardNumber: val.ward,
              zoneNumber: val.zone,
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
    console.log("Form Data ", data);
    setOpen(true);

    const bodyForAPI = {
      ...data,
      activeFlag: btnSaveText === "Update" ? data.activeFlag : null,
      zone: Number(data.zoneNumber),
      ward: Number(data.wardNumber),
      department: "",
      area: Number(data.area),
    };

    console.log("bodyForAPI", bodyForAPI);

    await axios.post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, bodyForAPI).then((response) => {
      console.log("save data", response);
      if (response.status == 200) {
        data.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getZoneAndWard();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
        setOpen(false);
      }
    });
  };

  // const onSubmit = (formData) => {
  //   alert("hi");
  //   console.log("formData", formData);
  //   // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
  //   // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
  //   const finalBodyForApi = {
  //     ...formData,
  //     // fromDate,
  //     // toDate,
  //   };

  //   console.log("finalBodyForApi", finalBodyForApi);

  //   axios.post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, finalBodyForApi).then((res) => {
  //     console.log("save data", res);
  //     if (res.status == 200) {
  //       formData.id
  //         ? sweetAlert("Updated!", "Record Updated successfully !", "success")
  //         : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //       getZoneAndWard();
  //       setButtonInputState(false);
  //       setIsOpenCollapse(false);
  //       setEditButtonInputState(false);
  //       setDeleteButtonState(false);
  //     }
  //   });
  // };

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

  // const deleteById = (value, _activeFlag) => {
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
  //         axios
  //           .post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, body)

  //           .then((res) => {
  //             console.log("delet res", res);
  //             if (res.status == 200) {
  //               swal("Record is Successfully Inactivated!", {
  //                 icon: "success",
  //               });
  //               getZoneAndWard();
  //               setButtonInputState(false);
  //             }
  //           });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
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
  //             swal("Record is Successfully activated!", {
  //               icon: "success",
  //             });
  //             getZoneAndWard();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
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
            .post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, body)

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
          axios.post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, body).then((res) => {
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
    area: null,
    zoneNumber: null,
    wardNumber: null,
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
      headerName: "Application Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "departmentName",
    //   headerName: "Department Name",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "areaCol",
      headerName: "Office Location",
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
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      //   width: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "wardNumber",
    //   headerName: <FormattedLabel id="wardNumber" />,
    //   width: 100,
    //   //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "wardName",
      headerName: <FormattedLabel id="wardName" />,
      //   width: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "status",
    //   headerName: <FormattedLabel id="status" />,
    //   //   width: 160,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "actions",
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
    area: null,
    zoneNumber: "",
    wardNumber: "",
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
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        {language === "en" ? "Zone Ward And Area Mapping" : "झोन वॉर्ड आणि क्षेत्र मॅपिंग"}
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      {/* <Head>
        <title>Zone And Ward Mapping</title>
      </Head> */}
      <div className={styles.main}>
        <div className={styles.left}>
          <Card style={{ padding: "2% 2%" }}>
            {/* <Button onClick={handleToggle}>Show backdrop</Button> */}
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
              onClick={handleClose}
            >
              Loading....
              <CircularProgress color="inherit" />
            </Backdrop>
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
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  // label={<FormattedLabel id="departmentName" />}
                                  label="Application Name"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {applicationList.length > 0
                                    ? applicationList.map((department, index) => {
                                        return (
                                          <MenuItem key={index} value={department.id}>
                                            {department.applicationNameEng}
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
                            <InputLabel id="demo-simple-select-label">Area name</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="Area name"
                                  value={field.value}
                                  // onChange={(value) => field.onChange(value)}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    // handleApplicationNameChange(value);
                                  }}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {areaList.length > 0
                                    ? areaList.map((val, id) => {
                                        return (
                                          <MenuItem key={id} value={val.id}>
                                            {language === "en" ? val.areaName : val.areaNameMr}
                                          </MenuItem>
                                        );
                                      })
                                    : "Not Available"}
                                </Select>
                              )}
                              name="area"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.area ? errors.area.message : null}
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

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button size="small" variant="contained" type="submit" endIcon={<Save />}>
                            <FormattedLabel id={btnSaveText} />
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            endIcon={<Clear />}
                            onClick={cancellButton}
                          >
                            Clear
                          </Button>
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={onBack}
                            endIcon={<ExitToApp />}
                          >
                            Exit
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  </Slide>
                )}

                <Grid container style={{ padding: "10px" }}>
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
                        setButtonInputState(true);
                        setSlideChecked(true);
                        setIsOpenCollapse(!isOpenCollapse);
                      }}
                    >
                      <FormattedLabel id="add" />
                    </Button>
                  </Grid>
                </Grid>

                <Box style={{ height: "auto", overflow: "auto" }}>
                  <DataGrid
                    sx={{
                      // fontSize: 16,
                      // fontFamily: 'Montserrat',
                      // font: 'center',
                      // backgroundColor:'yellow',
                      // // height:'auto',
                      // border: 2,
                      // borderColor: "primary.light",
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
                    density="compact"
                    autoHeight={true}
                    // rowHeight={50}
                    pagination
                    paginationMode="server"
                    // loading={data.loading}
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
                      // updateData("page", 1);
                      getZoneAndWard(_data, data.page);
                    }}
                  />
                </Box>

                {/* <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '5vh',
                  marginLeft: '15vw',
                  marginRight: '15vw',
                }}
              >
                <h3>Zone Address</h3>
                <TextArea
                  autoSize={{ minRows: 3, maxRows: 15 }}
                  style={{
                    backgroundColor: 'whitesmoke',
                    marginBottom: '3vh',
                  }}
                  //   {...register('zoneAddress')}
                  //   error={!!errors.zoneAddress}
                  //   helperText={errors?.zoneAddress ? errors.zoneAddress.message : null}
                  disabled={isDisabled}
                  defaultValue={
                    router.query.zoneAddress ? router.query.zoneAddress : ''
                  }
                />
              </div> */}
              </form>
            </FormProvider>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Index;
