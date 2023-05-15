import { Clear, ExitToApp, Save } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
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
    setValue,
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
  const [officeLocationList, setofficeLocationList] = useState([]);

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
    getofficeLocation();
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

  const getofficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r.data.officeLocation);
          setofficeLocationList(r.data.officeLocation);
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
          console.log("res Application", r);
          let applications = {};
          r.data.map((r) => (applications[r.id] = r.applicationNameEng));
          _setApplicationList(applications);
          setApplicationList(r.data);
          setOpen(false);
        }
      })
      .catch((err) => {
        setOpen(false);
        // console.log("err", err);
      });
  };

  const getZoneAndWard = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/zoneWardOfficeLoactionMapping/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        console.log("res mst", res);
        if (res.status == 200) {
          setOpen(false);
          let result = res.data.zoneWardOfficeLoactionMapping;
          let _res = result.map((val, i) => {
            return {
              activeFlag: val.activeFlag,
              srNo: val.id,
              id: val.id,

              officeLocation: val.officeLocation,
              officeLocationCol: officeLocationList.find((f) => f.id == val.officeLocation)
                ?.officeLocationName,

              // zoneName: _zoneList[val.zone] ? _zoneList[val.zone] : "-",
              // wardName: _wardList[val.ward] ? _wardList[val.ward] : "-",

              zoneName: zoneList.find((f) => f.id == val.zone)?.zoneNo,
              wardName: wardList.find((f) => f.id == val.ward)?.wardName,

              ward: val.ward,
              zone: val.zone,

              status: val.activeFlag === "Y" ? "Active" : "Inactive",
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
      zone: Number(data.zone),
      ward: Number(data.ward),
      department: "",
      officeLocation: Number(data.officeLocation),
    };

    console.log("bodyForAPI", bodyForAPI);

    await axios
      .post(`${urls.CFCURL}/master/zoneWardOfficeLoactionMapping/save`, bodyForAPI)
      .then((response) => {
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

  //   axios.post(`${urls.CFCURL}/master/zoneWardofficeLocationMapping/save`, finalBodyForApi).then((res) => {
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
  //           .post(`${urls.CFCURL}/master/zoneWardofficeLocationMapping/save`, body)

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
            .post(`${urls.CFCURL}/master/zoneWardOfficeLoactionMapping/save`, body)

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
          axios.post(`${urls.CFCURL}/master/zoneWardOfficeLoactionMapping/save`, body).then((res) => {
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
    zone: null,
    ward: null,
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
      field: "officeLocationCol",
      headerName: "Office Location",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "zone",
      //   headerName: <FormattedLabel id="zoneName" />,
      headerName: "Zone",
      //   width: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      //   width: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ward",
      headerName: <FormattedLabel id="wardName" />,
      headerName: "Ward",
      //   width: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wardName",
      headerName: <FormattedLabel id="wardName" />,
      //   width: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                //   disabled={editButtonInputState && params.row.activeFlag === "N" ? false : true}
                disabled={editButtonInputState}
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
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
                {/* <Tooltip title="Edit">
              <EditIcon style={{ color: "#556CD6" }} />
            </Tooltip> */}
              </IconButton>
            ) : (
              <Tooltip>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
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
    zone: "",
    ward: "",
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

  useEffect(() => {
    setValue(
      "zoneName",
      zoneList?.find((r) => {
        return r.id === watch("zone");
      })?.zoneName,
    );
  }, [watch("zone")]);

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
        {language === "en" ? "Zone Ward And Office Location Mapping" : "झोन वॉर्ड आणि ऑफीस स्थान मॅपिंग"}
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
                        <Grid item xs={8} style={{ display: "flex", justifyContent: "center" }}>
                          <FormControl style={{ width: "63%" }} size="small">
                            <InputLabel id="demo-simple-select-label">Office location name</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="officeLocation name"
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
                                            {language === "en"
                                              ? val.officeLocationName
                                              : val.officeLocationNameMr}
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
                              <FormattedLabel id="zone" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  // label="Zone Number"
                                  label={<FormattedLabel id="zone" />}
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
                              name="zone"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.zone ? errors.zone.message : null}
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
                            sx={{ width: "50%" }}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            style={{ backgroundColor: "white" }}
                            id="outlined-basic"
                            // label="Bill prefix"
                            label={<FormattedLabel id="zoneName" />}
                            variant="outlined"
                            {...register("zoneName")}
                            error={!!errors.zoneName}
                            helperText={errors?.zoneName ? errors.zoneName.message : null}
                          />
                          {/**< <TextField
sx={{ width: "75%" }}
                            // name="zoneName"
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
                            readOnly
                            // disabled={true}
                          /> */}
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
                              <FormattedLabel id="ward" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  // label="Ward Number"
                                  label={<FormattedLabel id="ward" />}
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
                              name="ward"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.ward ? errors.ward.message : null}
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
                            {...register("wardName")}
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
                            // disabled={true}
                            readOnly
                          />
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
                          zoneName: null,
                          wardName: null,
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
                <TextofficeLocation
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
