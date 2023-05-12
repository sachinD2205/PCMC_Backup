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
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/Menu";
import styles from "../../../styles/cfc/cfc.module.css";
import { useRouter } from "next/router";

const Menu = () => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      selectedChildOrParent: false,
    },
  });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [services, setServices] = useState([]);
  const [_services, _setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [_applications, _setApplications] = useState([]);
  const [icons, setIcons] = useState([]);
  const [menus, setMenus] = useState([]);
  const [showParent, setShowParent] = useState(false);

  const language = useSelector((state) => state.labels.language);

  console.log("selectedApp", selectedApp);

  const router = useRouter();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const [open, setOpen] = useState();

  const handleLoad = () => {
    setOpen(true);
  };

  let lang = useSelector((state) => {
    return state.user.lang;
  });

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState(0);

  const [theValue, setTheValue] = useState(control._defaultValues[name]);

  const handleChange = (event) => {
    setTheValue(event.target.value);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [isParentState, setIsParentState] = useState();

  let abc = [];
  //  = [{activeFlag: 'val.activeFlag',
  //   srNo:   1,
  //   billPrefix: 'val.billPrefix',
  //   billType: 'val.billType',
  //   id: 1,
  //   fromDate: "2022-11-23T04:00:00",
  //   toDate: "2022-11-23T04:00:00",
  //   remark: 'val.remark',
  //   status: 'val.activeFlag' === "Y" ? "Active" : "Inactive",}];

  // const { data } = useDemoData({
  //   dataSource
  // });

  useEffect(() => {
    getMenu();
    getApplication();
    getServices();
    getIcon();
    getParentMenu();
  }, []);

  // useEffect(() => {
  //   getBillType();
  // },[rowCount])

  const getParentMenu = () => {
    axios.get(`${urls.CFCURL}/master/menu/getAllParents`, {}).then((res) => {
      setMenus(res.data.menu);
    });
  };

  const getMenu = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    setOpen(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/menu/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        setOpen(false);

        console.log("menu response", res);
        let result = res.data.menu;
        let _res = result.map((val, i) => {
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: i + 1 + _pageNo * _pageSize,
            menuNameMr: val.menuNameMr,
            menuCode: val.menuCode ? val.menuCode : "-",
            // clickTo: val.clickTo,
            menuNameEng: val.menuNameEng,
            appId: val.appId,
            applicationNameColEn: applications.find((f) => f.id == val.appId)?.applicationNameEng,
            applicationNameColMr: applications.find((f) => f.id == val.appId)?.applicationNameMr,

            // appId: _applications[val.appId] ? _applications[val.appId] : null,
            // appId: _applications[val.appId] ? _applications[val.appId] : val.appId,
            serviceId: val.serviceId,
            serviceFeild: val.serviceId
              ? services.find((f) => f.id == val.serviceId)?.serviceName
              : "Service Not Availble",
            serviceFeildMr: val.serviceId ? services.find((f) => f.id == val.serviceId)?.serviceNameMr : "-",
            // serviceId: services[val.serviceId] ? services[val.serviceId].serviceId : null,
            icon: val.icon,
            // icon: icons[val.icon] ? icons[val.icon] : "-",
            isParent: val.isParent,

            // isChild: val.isChild,
            content: val.content,
            breadcrumName: val.breadcrumName,
            remark: val.remark,
            clickTo: val.clickTo,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        // let parents = res.data.menu.filter((val) => val.isParent == "Y");
        // console.log("parents", parents);

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        setOpen(false);
      })
      .catch((Err) => {
        console.log(Err);
        setOpen(false);
      });
  };

  const getServices = () => {
    setOpen(true);

    axios
      .get(`${urls.CFCURL}/master/service/getAll`)

      .then((r) => {
        setOpen(false);

        _setServices(r.data.service);

        setServices(r.data.service);
        // if (r.status == 200) {
        //   console.log("service res", r);
        //   let services = {};
        //   r.data.service.map((r) => (services[r.id] = r.serviceName));
        //   _setServices(services);
        //   setServices(r.data.service);
        // } else {
        //   message.error("Data Loading.. !");
        // }
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);

        toast("Data Loading.. !", {
          type: "error",
        });
      });
  };

  const getApplication = () => {
    setOpen(true);

    axios
      .get(`${urls.CFCURL}/master/application/getAll`)

      .then((r) => {
        setOpen(false);

        _setApplications(r.data.application);
        setApplications(r.data.application);
        // if (r.status == 200) {
        //   console.log("application res", r);

        //   //   setApplications(r.data);
        //   let applications = {};
        //   r.data.map((r) => (applications[r.id] = r.applicationNameEng));
        //   _setApplications(applications);
        //   setApplications(r.data.application);

        //   //   setApplications(
        //   //     r.data.filter((val) => {
        //   //       return val.module === 1;
        //   //     })
        //   //   );
        // } else {
        //   message.error("Data Loading.. !");
        // }
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);

        toast("Data Loading.. !", {
          type: "error",
        });
      });
  };

  const getIcon = () => {
    axios
      .get(`${urls.CFCURL}/master/icon/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("icon res", r);

          setIcons(r.data.icon);
        } else {
          message.error("Data Loading.. !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Data Loading.. !", {
          type: "error",
        });
      });
  };

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
  //         axios.post(`${urls.CFCURL}/master/menu/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             getMenu();
  //             setButtonInputState(false);
  //           }
  //         });
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
  //         axios.post(`${urls.CFCURL}/master/menu/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             getMenu();
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
    // console.log('body', body)
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // // console.log('inn', willDelete)
        if (willDelete === true) {
          axios.post(`${urls.BaseURL}/menu/save`, body).then((res) => {
            // console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Inactivated!", {
                icon: "success",
              });
              getMenu();
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
        // console.log('inn', willDelete)
        if (willDelete === true) {
          axios.post(`${urls.BaseURL}/menu/save`, body).then((res) => {
            // console.log('delet res', res)
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getMenu();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    menuCode: "",
    menuNameEng: "",
    menuNameMr: "",
    clickTo: "",
    appId: null,
    serviceId: null,
    icon: null,
    isParent: null,
    parentId: null,
    content: "",
    breadcrumName: "",
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

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const finalBodyForApi = {
      ...formData,
      // activeFlag: btnSaveText === "Update" ? null : null,
      isParent: isParentState === "Y" ? "Y" : null,

      // isParent: formData.selectedChildOrParent === "Y" ? "Y" : "N",

      // breadcrumName:formData.clickTo,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.CFCURL}/master/menu/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 200) {
        if (res.data?.errors?.length > 0) {
          res.data?.errors?.map((x) => {
            if (x.field == "menuNameEng") {
              console.log("x.code", x.code);
              setError("menuNameEng", { message: x.code });
            } else if (x.field == "menuNameMr") {
              setError("menuNameMr", { message: x.code });
            }
          });
        } else {
          formData.id
            ? sweetAlert("Menu Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Menu added successfully", "Record Saved successfully !", "success");
          getMenu();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      } else if (res.status == 500) {
        formData.id
          ? sweetAlert("Failed!", "Internal Server Error !", "Failed")
          : sweetAlert("Failed", "Internal Server Error !", "Failed");
      } else if (res.status == 400 || res.status == 400) {
        formData.id
          ? sweetAlert("Failed!", "Enter Valid data !", "Check Enter Data")
          : sweetAlert("Failed", "Enter Valid data !", "Check Enter Data");
      }
    });
  };

  const [selectedApp, setSelectedApp] = useState();

  const handleApplicationNameChange = (value) => {
    setSelectedApp(value.target.value);
    console.log("value.target.value", value.target.value);
  };

  // Reset Values Cancell || Exit
  const resetValues = {
    menuCode: "",
    menuNameEng: "",
    menuNameMr: "",
    clickTo: "",
    appId: null,
    serviceId: null,
    icon: null,
    isParent: null,
    parentId: null,
    content: "",
    breadcrumName: "",
  };

  const resetValuesExit = {
    menuCode: "",
    menuNameEng: "",
    menuNameMr: "",
    clickTo: "",
    appId: null,
    serviceId: null,
    icon: null,
    isParent: null,
    parentId: null,
    content: "",
    breadcrumName: "",
  };

  const columns = [
    {
      field: "srNo",
      width: 90,
      headerName: <FormattedLabel id="srNo" />,
      cellClassName: "super-app-theme--cell",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "menuNameEng",
      headerName: <FormattedLabel id="menuNameEng" />,
      width: 200,
    },
    {
      field: "menuNameMr",
      headerName: <FormattedLabel id="menuNameMr" />,
      width: 230,
    },
    {
      field: "clickTo",
      headerName: <FormattedLabel id="clickTo" />,
      width: 300,
    },
    {
      field: language === "en" ? "applicationNameColEn" : "applicationNameColMr",
      // field: "appId",
      headerName: <FormattedLabel id="appId" />,
      width: 230,
    },
    {
      field: language === "en" ? "serviceFeild" : "serviceFeildMr",
      headerName: <FormattedLabel id="serviceId" />,
      // type: "number",
      width: 200,
    },
    // {
    //   field: "icon",
    //   headerName: <FormattedLabel id="icon" />,
    //   // type: "number",
    //   width: 50,
    // },
    {
      field: "isParent",
      headerName: <FormattedLabel id="isParent" />,
      // type: "number",
      width: 100,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",

      headerAlign: "center",
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
              </IconButton>
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id), setSlideChecked(true);
                setButtonInputState(true);
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
          <Box className={styles.h1Tag} sx={{ paddingLeft: "37%" }}>
            {<FormattedLabel id="menu" />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValues,
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
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper style={{ paddingTop: isOpenCollapse ? "20px" : "0px" }}>
        {isOpenCollapse && (
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
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px", paddingTop: "40px" }}>
                  <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "86%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="Bill prefix"
                      label={<FormattedLabel id="menuCode" />}
                      variant="outlined"
                      {...register("menuCode")}
                      error={!!errors.menuCode}
                      helperText={errors?.menuCode ? errors.menuCode.message : null}
                    />
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
                    <TextField
                      sx={{ width: "86%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="Bill prefix"
                      label={<FormattedLabel id="menuNameEng" />}
                      variant="outlined"
                      {...register("menuNameEng")}
                      error={!!errors.menuNameEng}
                      helperText={errors?.menuNameEng ? errors.menuNameEng.message : null}
                    />
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
                    <TextField
                      sx={{ width: "86%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="Bill prefix"
                      label={<FormattedLabel id="menuNameMr" />}
                      variant="outlined"
                      {...register("menuNameMr")}
                      error={!!errors.menuNameMr}
                      helperText={errors?.menuNameMr ? errors.menuNameMr.message : null}
                    />
                  </Grid>
                </Grid>

                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "86%" }}
                      size="small"
                      style={{ backgroundColor: "white", width: "86%" }}
                      id="outlined-basic"
                      // label="Bill Type"
                      label={<FormattedLabel id="clickTo" />}
                      variant="outlined"
                      {...register("clickTo")}
                      error={!!errors.clickTo}
                      helperText={errors?.clickTo ? errors.clickTo.message : null}
                    />
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
                    <FormControl size="small" sx={{ width: "86%" }} error={!!errors.appId}>
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="appId" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={<FormattedLabel id="appId" />}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              handleApplicationNameChange(value);
                              console.log("56value", value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            {applications.length > 0
                              ? applications.map((application, index) => {
                                  console.log("");
                                  return (
                                    <MenuItem key={index} value={application.id}>
                                      {lang === "en"
                                        ? application.applicationNameEng
                                        : application.applicationNameMr}
                                    </MenuItem>
                                  );
                                })
                              : "NA"}
                          </Select>
                        )}
                        name="appId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.appId ? errors.appId.message : null}
                      </FormHelperText>
                    </FormControl>
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
                    <FormControl size="small" sx={{ m: 1, width: "86%" }} error={!!errors.serviceId}>
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="serviceId" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={<FormattedLabel id="serviceId" />}
                            value={field.value}
                            // {...register("applicationName")}
                            // onChange={(value) => field.onChange(value)}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            {services.length > 0
                              ? services
                                  .filter((val) => val.application == selectedApp)
                                  .map((service, index) => {
                                    return (
                                      <MenuItem key={index} value={service.id}>
                                        {language === "en" ? service.serviceName : service.serviceNameMr}
                                      </MenuItem>
                                    );
                                  })
                              : "NA"}
                          </Select>
                        )}
                        name="serviceId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.serviceId ? errors.serviceId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl size="small" sx={{ m: 1, width: "86%" }} error={!!errors.icon}>
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="icon" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={<FormattedLabel id="icon" />}
                            value={field.value}
                            // {...register("applicationName")}
                            // onChange={(value) => field.onChange(value)}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            {icons.length > 0
                              ? icons.map((icon, index) => {
                                  console.log("33", icon);
                                  return (
                                    <MenuItem key={index} value={icon.id}>
                                      {icon.iconName}
                                    </MenuItem>
                                  );
                                })
                              : "NA"}
                          </Select>
                        )}
                        name="icon"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.icon ? errors.icon.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "86%" }}
                      size="small"
                      style={{ backgroundColor: "white", width: "86%" }}
                      id="outlined-basic"
                      // label="Bill Type"
                      label={<FormattedLabel id="breadcrumName" />}
                      variant="outlined"
                      {...register("breadcrumName")}
                      error={!!errors.breadcrumName}
                      helperText={errors?.breadcrumName ? errors.breadcrumName.message : null}
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "86%" }}
                      size="small"
                      style={{ backgroundColor: "white", width: "86%" }}
                      id="outlined-basic"
                      // label="Bill Type"
                      label={<FormattedLabel id="content" />}
                      variant="outlined"
                      {...register("content")}
                      error={!!errors.content}
                      helperText={errors?.content ? errors.content.message : null}
                    />
                  </Grid>
                </Grid>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl component="fieldset" error={!!errors.selectedChildOrParent}>
                      <Controller
                        // rules={{ required: true }}
                        error={errors?.selectedChildOrParent ? true : false}
                        control={control}
                        name="selectedChildOrParent"
                        render={({ field }) => (
                          <RadioGroup
                            // error={errors.selectedChildOrParent}
                            {...field}
                            onChange={(e) => {
                              setIsParentState(e.target.value);
                              console.log("e.target.value666", e.target.value), setShowParent(false);
                              if (e.target.value === "Y") {
                                setShowParent(false);
                              } else {
                                setShowParent(true);
                              }
                            }}
                          >
                            <FormControlLabel
                              value="Y"
                              control={<Radio />}
                              label={<FormattedLabel id="isParent" />}
                            />
                            <FormControlLabel
                              value="N"
                              control={<Radio />}
                              label={<FormattedLabel id="isChild" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.selectedChildOrParent ? errors.selectedChildOrParent.message : null}
                      </FormHelperText>
                    </FormControl>
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
                    {showParent ? (
                      <FormControl size="small" sx={{ m: 1, width: "86%" }} error={!!errors.parentId}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="parentId" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label={<FormattedLabel id="parentId" />}
                              value={field.value}
                              // {...register("applicationName")}
                              // onChange={(value) => field.onChange(value)}
                              onChange={(value) => {
                                console.log("value", value);
                                field.onChange(value);
                              }}
                              style={{ backgroundColor: "white" }}
                            >
                              {menus.length > 0
                                ? menus.map((menu, index) => {
                                    return (
                                      <MenuItem key={index} value={menu.id}>
                                        {menu.menuNameEng}
                                      </MenuItem>
                                    );
                                  })
                                : "NA"}
                            </Select>
                          )}
                          name="parentId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.parentId ? errors.parentId.message : null}
                        </FormHelperText>
                      </FormControl>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>

                <Grid
                  container
                  className={styles.feildres}
                  spacing={2}
                  sx={{ marginTop: "50px", marginBottom: "20px" }}
                >
                  <Grid item>
                    <Button
                      className={styles.button}
                      type="submit"
                      size="small"
                      variant="outlined"
                      endIcon={<SaveIcon />}
                    >
                      <FormattedLabel id={btnSaveText} />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      className={styles.button}
                      size="small"
                      variant="outlined"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Slide>
        )}

        {/* <Grid container style={{ padding: "10px" }}>
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
        </Grid> */}

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
            autoHeight
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
              "& .MuiDataGrid-cell:hover": {
                // transform: "scale(1.1)",
              },
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
            // loading={data.loading}
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getMenu(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getMenu(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Menu;
