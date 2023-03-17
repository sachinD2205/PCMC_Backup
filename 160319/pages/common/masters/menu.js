import {
  Box,
  Button,
  Divider,
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
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../containers/schema/common/Menu";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";

const Menu = () => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
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
  const [selectedApp, setSelectedApp] = useState(null);

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
  }, []);

  // useEffect(() => {
  //   getBillType();
  // },[rowCount])

  const getMenu = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/menu/getAll`, {

 
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log("menu response", res);
        let result = res.data.menu;
        let _res = result.map((val, i) => {
          return {
            activeFlag: val.activeFlag,
            srNo: val.id,
            menuNameMr:val.menuNameMr,
            menuCode: val.menuCode ? val.menuCode : "-",
            // clickTo: val.clickTo,
            menuNameEng: val.menuNameEng,
            // appId:val.appId,
            appId: _applications[val.appId] ? _applications[val.appId] : "-",
            // serviceId:val.serviceId,
            serviceId: services[val.serviceId]
              ? services[val.serviceId].serviceId
              : "-",

              icon:icons[val.icon] ? icons[val.icon] : "-",
              isParent:val.isParent,
            content: val.content,
            breadcrumName:val.breadcrumName,
            id: val.id,
            remark: val.remark,
            clickTo:val.clickTo,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setMenus(
          result.filter((val) => {
            return val.isParent === "Y";
          })
        );

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)

   
      .then((r) => {
        if (r.status == 200) {
          console.log("service res", r);

          let services = {};
          r.data.service.map((r) => (services[r.id] = r.serviceName));
          _setServices(services);
          setServices(r.data.service);
          //   setServices(r.data.service);
        } else {
          message.error("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Login Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  const getApplication = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`)

     
      .then((r) => {
        if (r.status == 200) {
          console.log("application res", r);

          //   setApplications(r.data);
          let applications = {};
          r.data.map((r) => (applications[r.id] = r.applicationNameEng));
          _setApplications(applications);
          setApplications(r.data);

          //   setApplications(
          //     r.data.filter((val) => {
          //       return val.module === 1;
          //     })
          //   );
        } else {
          message.error("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Login Failed ! Please Try Again !", {
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
          message.error("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Login Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

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
            .post(`${urls.CFCURL}/master/menu/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
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
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/menu/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
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
    content:"",
    breadcrumName:""
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
      isParent: formData.selectedChildOrParent === "Y" ? "Y" : null,
      // breadcrumName:formData.clickTo,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/menu/save`, finalBodyForApi)
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getMenu();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const handleApplicationNameChange = (value) => {
    setSelectedApp(value.target.value);
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
    content:"",
    breadcrumName:""
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      //   flex: 1,
      Width: 10,
      
    },
    {
      field: "menuCode",
      headerName: <FormattedLabel id="menuCode" />,
     width:30
    },
    {
      field: "menuNameEng",
      headerName: <FormattedLabel id="menuNameEng" />,
      // type: "number",
      //   flex: 1,
      Width: 70,
      
    },
    {
      field: "menuNameMr",
      headerName: <FormattedLabel id="menuNameMr" />,
      // type: "number",
      //   flex: 1,
      Width: 70,
      
    },
    {
      field: "clickTo",
      headerName: <FormattedLabel id="clickTo" />,
      // type: "number",
      //   flex: 1,
      Width: 100,
     
    },
    {
      field: "appId",
      headerName: <FormattedLabel id="appId" />,
     width:120,
    },
    {
      field: "serviceId",
      headerName: <FormattedLabel id="serviceId" />,
      // type: "number",
     width:120,
    },
    {
      field: "icon",
      headerName: <FormattedLabel id="icon" />,
      // type: "number",
    width:50
    },
    {
      field: "isParent",
      headerName: <FormattedLabel id="isParent" />,
      // type: "number",
      width:60
    },
    {
      field: "breadcrumName",
      headerName: <FormattedLabel id="breadcrumName" />,
      // type: "number",
      width:100
    },
    {
      field: "content",
      headerName: <FormattedLabel id="content" />,
      // type: "number",
      width:60
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
     width:30
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
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                setValue("appId",selectedApp)
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
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
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
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
Menu 
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper style={{ margin: "50px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
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
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="Bill prefix"
                    label={<FormattedLabel id="menuCode" />}
                    variant="outlined"
                    {...register("menuCode")}
                    error={!!errors.menuCode}
                    helperText={
                      errors?.menuCode ? errors.menuCode.message : null
                    }
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
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="Bill prefix"
                    label={<FormattedLabel id="menuNameEng" />}
                    variant="outlined"
                    {...register("menuNameEng")}
                    error={!!errors.menuNameEng}
                    helperText={
                      errors?.menuNameEng ? errors.menuNameEng.message : null
                    }
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
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="Bill prefix"
                    label={<FormattedLabel id="menuNameMr" />}
                    variant="outlined"
                    {...register("menuNameMr")}
                    error={!!errors.menuNameMr}
                    helperText={
                      errors?.menuNameMr ? errors.menuNameMr.message : null
                    }
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
                    size="small"
                    style={{ backgroundColor: "white", width: "55%" }}
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
                  <FormControl size="small" sx={{ width: "55%" }}>
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
                          // {...register("applicationName")}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {applications.length > 0
                            ? applications.map((application, index) => {
                                console.log("");
                                return (
                                  <MenuItem key={index} value={application.id}>
                                    {application.applicationNameEng}
                                    {/* {lang === "en"
                                      ? application.applicationNameEng
                                      : application.applicationNameMr} */}
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
                  <FormControl size="small" sx={{ m: 1, width: "50%" }}>
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
                                .filter(
                                  (val) => val.application === selectedApp
                                )
                                .map((service, index) => {
                                  return (
                                    <MenuItem key={index} value={service.id}>
                                      {service.serviceName}
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
                  <FormControl size="small" sx={{ m: 1, width: "50%" }}>
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
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl component="fieldset">
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="selectedChildOrParent"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          onChange={(e) => {
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
                    <FormControl size="small" sx={{ m: 1, width: "50%" }}>
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
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  xs={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white", width: "55%" }}
                    id="outlined-basic"
                    // label="Bill Type"
                    label={<FormattedLabel id="breadcrumName" />}
                    variant="outlined"
                    {...register("breadcrumName")}
                    error={!!errors.breadcrumName}
                    helperText={
                      errors?.breadcrumName
                        ? errors.breadcrumName.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  xs={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white", width: "55%" }}
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
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
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
                    sx={{ marginRight: 8 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id="clear" />
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
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={9}></Grid>
          <Grid
            item
            xs={2}
            style={{ display: "flex", justifyContent: "center" }}
          >
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
              getMenu(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getMenu(_data, data.page);
            }}
          />
        </Box>

        {/* <DataGrid
            autoHeight
            sx={{
              margin: 5,
            }}
            rows={dataSource}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              getBillType(newPageSize);
              setPageSize(newPageSize);
            }}
            onPageChange={(e) => {
              console.log("event", e);
              setPageNo(e);
              setTotalElements(res.data.totalElements);
              console.log("dataSource->", dataSource);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pagination
            rowCount={totalElements}
          /> */}
      </Paper>
    </>
  );
};

export default Menu;
