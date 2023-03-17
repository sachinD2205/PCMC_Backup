import { yupResolver } from "@hookform/resolvers/yup";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import schema from "../../../containers/schema/DepartmentUserRegisterSchema";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../URLS/urls";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

const DepartmentUserRegister = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      departmentId: "",
      designationId: "",
      officeId: "",
    },
    defaultValues: {
      applicationRolesList: [{ departmentId: "", designationId: "", officeId: "" }],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    // name: "applicationName",
    name: "applicationRolesList",
    control,
    // defaultValues: [
    //   {applicationName:'aa',
    // }]
  });
  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [isDepartmentChecked, setIsDepartmentChecked] = useState(false);
  const [isCFCChecked, setIsCFCChecked] = useState(false);
  const [isOtherUserChecked, setIsOtherUserChecked] = useState(false);

  const [dataFromDUR, setDataFromDUR] = useState(false);

  const [selectedRoleName, setSelectedRoleName] = useState([]);
  const [selectedModuleName, setSelectedModuleName] = useState([]);

  const handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedRoleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const _handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedModuleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  useEffect(() => {
    console.log("444", router.query);
    if (router.query.mode === "edit") {
      setDataFromDUR(true);
    }
    if (router.query.mode === undefined) {
      setDataFromDUR(false);
    }
    reset(router.query);

    setValue("applicationRolesList", []);

    if (router.query.mode == "edit") {
      axios
        .get(`${urls.CFCURL}/master/user/getById?userId=${router.query.id}`)
        .then((r) => {
          if (r.status == 200) {
            console.log("332233", r?.data);
            setSelectedModuleName(r.data.applications);
            let applicationRolesList = r.data.officeDepartmentDesignationUserDaoLst.map((val) => {
              console.log("value33", val);
              return {
                officeId: val.officeId,
                departmentId: val.departmentId,
                designationId: val.designationId,
              };
            });

            console.log("applicationRolesList43434", applicationRolesList);
            setValue("applicationRolesList", applicationRolesList);

            console.log(
              "officeDepartmentDesignationUserDaoLst**",
              getValues("officeDepartmentDesignationUserDaoLst"),
            );
          }
        })
        .catch((err) => {
          console.log("errApplication", err);
        });
    } else {
      setValue("applicationRolesList", []);
    }

    setIsCFCChecked(router.query.isCfcUser);
    setIsOtherUserChecked(router.query.isOtherUser);
    setIsDepartmentChecked(router.query.isDepartmentUser);
    setValue("mobileNumber", router.query.mobileNo);
    setValue("userName", router.query.username);
    setValue("isDepartmentChecked", router.query.isDepartmentUser === "true" ? true : false);
    setValue("isCFCChecked", router.query.isCfcUser === "true" ? true : false);
    setValue("isOtherUserChecked", router.query.isOtherUser === "true" ? true : false);
  }, []);

  useEffect(() => {
    if (getValues(`applicationRolesList.length`) == 0) {
      appendUI();
    }
    // if (getValues(`officeDepartmentDesignationUserDaoLst.length`) == 0) {
    //   appendUI();
    // }
  }, []);

  useEffect(() => {
    getDepartmentName();
    getDesignationName();
    getApplicationsName();
    getRoleName();
    getLocationName();
    getServiceList();
    getOfficeLocation();
  }, []);

  const appendUI = () => {
    append({
      // applicationName: "",
      // roleName: "",
      departmentId: "",
      designationId: "",
      officeId: "",
    });
  };

  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res department", r);
          setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDesignationName = () => {
    axios
      .get(`${urls.CFCURL}/master/designation/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res designation", r);
          setDesignationList(r.data.designation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getApplicationsName = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res application", r);
          setApplicationList(r.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getRoleName = () => {
    axios
      .get(`${urls.CFCURL}/master/mstRole/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res role", r);
          setRoleList(r.data.mstRole);
          // setRoleList(r.data.mstRole.map((val) => val.name));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getLocationName = () => {
    axios
      .get(`${urls.CFCURL}/master/locality/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res location", r);
          setLocationList(r.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getServiceList = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res location", r);
          setServiceList(r.data.locality);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(
            // r.data.officeLocation.map((val) => val.officeLocationName)
            r.data.officeLocation,
          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onFinish = (data) => {
    console.log("222", data);

    let applicationArray = data.applicationRolesList.map((val) => {
      return {
        // officeId: val.locationName,
        // departmentId: val.departmentName,
        // designationId: val.designationName,
        officeId: val.officeId,
        departmentId: val.departmentId,
        designationId: val.designationId,
      };
    });

    console.log("applicationArray", applicationArray);

    const body = {
      userName: data.userName,
      password: data.password,
      empCode: data.employeeCode,
      firstNameEn: data.firstName,
      middleNameEn: data.middleName,
      lastNameEn: data.lastName,
      firstNameMr: data.firstNameMr,
      middleNameMr: data.middleNameMr,
      lastNameMr: data.lastNameMr,
      email: data.email,
      phoneNo: data.mobileNumber,
      department: data.departmentName,
      designation: data.designationName,
      // officeDepartmentDesignationUserDaoLst: applicationArray,
      officeDepartmentDesignationUserDaoLst: getValues("officeDepartmentDesignationUserDaoLst"),
      // roles: selectedRoleName,
      applications: selectedModuleName,
      cFCUser: data.isCFCChecked,
      otherUser: data.isOtherUserChecked,
      deptUser: data.isDepartmentChecked,
    };

    console.log("body", body);

    const headers = { Accept: "application/json" };

    // swal({
    //   title: "Save?",
    //   text: "Are you sure you want to Save this Record ? ",
    //   icon: "warning",
    //   buttons: true,
    //   dangerMode: true,
    // })
    axios
      .post(`${urls.AuthURL}/signup`, body, { headers })
      .then((r) => {
        if (r.status == 200) {
          console.log("res", r);
          toast("Registered Successfully", {
            type: "success",
          });
          router.push("/common/masters/departmentUserList");
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast("Registeration Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  // Reset Values Exit
  const resetValuesExit = {
    userName: "",
    password: "",
    employeeCode: "",
    firstNameEn: "",
    middleNameEn: "",
    lastNameEn: "",
    firstNameMr: "",
    middleNameMr: "",
    lastNameMr: "",
    email: "",
    mobileNumber: "",
    department: "",
    designation: "",
    applicationArray: "",
    // roles: selectedRoleName,
    selectedModuleName: "",
    isOtherUserChecked: "",
    isCFCChecked: "",
    isDepartmentChecked: "",
  };

  // Exit Button
  const exitButton = () => {
    // router.push("./departmentUserList");
    router.push("/DepartmentUserList");
  };
  const handleApplicationNameChange = (value) => {
    console.log("value", value);
    let test = [];

    let _ch =
      serviceList &&
      serviceList.filter((txt) => {
        return value.target.value === txt.application && txt;
      });
    console.log("_ch", _ch);
    test.push(..._ch);

    // applicationList &&
    // applicationList.map((val) => {
    //  let _ch =  serviceList &&
    //     serviceList.filter((txt) => {
    //       return value.target.value === txt.application && txt;
    //     });
    //     console.log('_ch',_ch)
    //     test.push(..._ch);

    // });

    setFilteredServices(test);

    console.log(
      "123",
      applicationList &&
        applicationList.map((val) => {
          let _ch =
            serviceList &&
            serviceList.filter((txt) => {
              return val.id === txt.application && txt;
            });
          console.log("_ch", _ch);
        }),
    );
    console.log("arr", test);
  };

  const handleDepartmentChecked = (e) => {
    console.log("e", e);
    setIsDepartmentChecked(e.target.checked);
  };

  const handleCFCChecked = (e) => {
    setIsCFCChecked(e.target.checked);
  };

  const handleOtherUserChecked = (e) => {
    setIsOtherUserChecked(e.target.checked);
  };

  return (
    <>
      <Box
        style={{
          margin: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: "solid red",
        }}
      >
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
                onClick={() => exitButton()}
              >
                <ArrowBackIcon />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "rgb(7 110 230 / 91%)",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                Department User Register
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <Box className={styles.tableHead}>
            <Box className={styles.feildHead}>User Details</Box>
          </Box>
          <br />
          <form onSubmit={handleSubmit(onFinish)}>
            <div>
              <Grid container style={{ padding: "10px" }}>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="First Name"
                    variant="outlined"
                    readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("firstName")}
                    error={errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="Middle Name"
                    variant="outlined"
                    readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("middleName")}
                    error={errors.middleName}
                    helperText={errors.middleName?.message}
                  />
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="Last Name"
                    variant="outlined"
                    readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("lastName")}
                    error={errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>
              </Grid>
              <Grid container style={{ padding: "10px" }}>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="First Name Marathi"
                    variant="outlined"
                    readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("firstNameMr")}
                    error={errors.firstNameMr}
                    helperText={errors.firstNameMr?.message}
                  />
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="Middle Name Marathi"
                    variant="outlined"
                    readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("middleNameMr")}
                    error={errors.middleNameMr}
                    helperText={errors.middleNameMr?.message}
                  />
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="Last Name Marathi"
                    variant="outlined"
                    readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("lastNameMr")}
                    error={errors.lastNameMr}
                    helperText={errors.lastNameMr?.message}
                  />
                </Grid>
              </Grid>
              <Grid container style={{ padding: "10px" }}>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="Email ID"
                    readonly={dataFromDUR}
                    variant="outlined"
                    style={{ backgroundColor: "white" }}
                    {...register("email")}
                    error={errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="Phone No."
                    variant="outlined"
                    readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("mobileNumber")}
                    error={errors.mobileNumber}
                    helperText={errors.mobileNumber?.message}
                  />
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="Employee Code"
                    readonly={dataFromDUR}
                    variant="outlined"
                    style={{ backgroundColor: "white" }}
                    {...register("employeeCode")}
                    error={errors.employeeCode}
                    helperText={errors.employeeCode?.message}
                  />
                </Grid>

                {/* <Grid item xs={4} style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
                  <FormControl style={{ width: "86%" }} size="small">
                    <InputLabel id="demo-simple-select-label">Primary Department name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Primary Department name"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {departmentList.length > 0
                            ? departmentList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.department}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name="department"
                      control={control}
                      defaultValue=""
                      // key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.department ? errors.department.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
                  <FormControl style={{ width: "86%" }} size="small">
                    <InputLabel id="demo-simple-select-label">Primary Designation name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Primary Designation name"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ backgroundColor: "white" }}
                        >
                          {designationList.length > 0
                            ? designationList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.designation}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name="designation"
                      control={control}
                      defaultValue=""
                      // key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.designation ? errors.designation.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
              </Grid>
              {/* <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xs={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl style={{ width: "48%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Department name
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    readonly={dataFromDUR}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={field.value}
                    label="Department name"
                    onChange={(value) => field.onChange(value)}
                    style={{ backgroundColor: "white" }}
                  >
                    {departmentList.length > 0
                      ? departmentList.map((val, id) => {
                          return (
                            <MenuItem key={id} value={val.id}>
                              {val.department}
                            </MenuItem>
                          );
                        })
                      : "Not Available"}
                  </Select>
                )}
                name="departmentName"
                control={control}
                defaultValue=""
              />

              <FormHelperText style={{ color: "red" }}>
                {errors?.departmentName ? errors.departmentName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl style={{ width: "48%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Location name
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    readonly={dataFromDUR}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={field.value}
                    label="Location name"
                    onChange={(value) => field.onChange(value)}
                    style={{ backgroundColor: "white" }}
                  >
                    {[
                      { id: 1, department: "Location 1" },
                      { id: 2, department: "Location 2" },
                    ].length > 0
                      ? [
                          { id: 1, department: "Location 1" },
                          { id: 2, department: "Location 2" },
                        ].map((val, id) => {
                          return (
                            <MenuItem key={id} value={val.id}>
                              {val.department}
                            </MenuItem>
                          );
                        })
                      : "Not Available"}
                  </Select>
                )}
                name="locationName"
                control={control}
                defaultValue=""
              />

              <FormHelperText style={{ color: "red" }}>
                {errors?.departmentName ? errors.departmentName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl fullWidth style={{ width: "48%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Designation name
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    readonly={dataFromDUR}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Designation name"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    style={{ backgroundColor: "white" }}
                  >
                    {designationList.length > 0
                      ? designationList.map((val, id) => {
                          return (
                            <MenuItem value={val.id} key={id}>
                              {val.designation}
                            </MenuItem>
                          );
                        })
                      : "Not Available"}
                  </Select>
                )}
                name="designationName"
                control={control}
                defaultValue=""
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.designationName
                  ? errors.designationName.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid> */}
              <Grid container style={{ padding: "10px" }}>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="User Name"
                    variant="outlined"
                    readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("userName")}
                    error={errors.userName}
                    helperText={errors.userName?.message}
                  />
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label="Password"
                    // readonly
                    readonly={dataFromDUR}
                    defaultValue="Admin@123"
                    variant="outlined"
                    style={{ backgroundColor: "white" }}
                    {...register("password")}
                    error={errors.password}
                    helperText={errors.password?.message}
                    type={showPassword ? "" : "password"}
                    InputProps={{
                      style: { fontSize: "15px" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl size="small" fullWidth sx={{ width: "50%" }}>
              <InputLabel id="demo-multiple-checkbox-label">Role</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                sx={{ backgroundColor: "white" }}
                value={selectedRoleName}
                readonly={dataFromDUR}
                onChange={handleChange}
                label="Role"
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {roleList.length > 0
                  ? roleList.map((name, index) => {
                      return (
                        <MenuItem key={index} value={name.name}>
                          <Checkbox
                            checked={selectedRoleName.indexOf(name.name) > -1}
                          />
                          <ListItemText primary={name.name} />
                        </MenuItem>
                      );
                    })
                  : []}
              </Select>
            </FormControl>
          </Grid> */}
              </Grid>
              <Grid container columns={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: "23px" }}>
                <Grid item xs={12}>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">Module Name</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      // maxRows={3}
                      // multiline
                      sx={{ backgroundColor: "white" }}
                      value={selectedModuleName}
                      readonly={dataFromDUR}
                      onChange={_handleChange}
                      label="Module Name"
                      renderValue={(selected) => selected.join(", ")}
                      // MenuProps={MenuProps}
                    >
                      {applicationList.length > 0
                        ? applicationList.map((name, index) => {
                            return (
                              <MenuItem key={index} value={name.applicationNameEng}>
                                <Checkbox
                                  checked={selectedModuleName.indexOf(name.applicationNameEng) > -1}
                                />
                                {/* <Checkbox /> */}
                                <ListItemText primary={name.applicationNameEng} />
                              </MenuItem>
                            );
                          })
                        : []}
                    </Select>
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
                  <FormControlLabel
                    control={<Checkbox checked={isDepartmentChecked} />}
                    // readonly={dataFromDUR}
                    {...register("isDepartmentChecked")}
                    onChange={handleDepartmentChecked}
                    label="Is Department User"
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
                  <FormControlLabel
                    // readonly={dataFromDUR}
                    control={<Checkbox checked={isCFCChecked} />}
                    {...register("isCFCChecked")}
                    onChange={handleCFCChecked}
                    label="Is CFC User"
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
                  <FormControlLabel
                    // readonly={dataFromDUR}
                    control={<Checkbox checked={isOtherUserChecked} />}
                    {...register("isOtherUserChecked")}
                    onChange={handleOtherUserChecked}
                    label="Is Other User"
                  />
                </Grid>
              </Grid>

              {/* <Box style={{ padding: "20px" }}>
                <Typography variant="h6">Applications Roles List</Typography>
                <Divider style={{ background: "black" }} />
              </Box> */}
              <br />
              <br />
              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>Applications Roles List</Box>
              </Box>
              <br />

              <Container>
                <Paper component={Box} p={1}>
                  <Box style={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<AddBoxOutlinedIcon />}
                      onClick={() => {
                        appendUI();
                      }}
                    >
                      Add More
                    </Button>
                  </Box>

                  {fields.map((witness, index) => {
                    return (
                      <>
                        <Grid
                          container
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          className={styles.feildres}
                          spacing={3}
                          key={index}
                          p={1}
                          sx={{
                            backgroundColor: "#E8F6F3",
                            // border: "5px solid #E8F6F3",
                            // padding: "5px",
                            paddingBottom: "16px",
                            margin: "5px",
                            width: "99%",
                          }}
                        >
                          <Grid item md={4}>
                            <FormControl style={{ width: "100%" }} size="small">
                              <InputLabel id="demo-simple-select-label">Location name</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Department name"
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
                                // name={`applicationRolesList[${index}].locationName`}
                                name={`applicationRolesList.${index}.officeId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.locationName ? errors.locationName.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item md={4}>
                            <FormControl style={{ width: "100%" }} size="small">
                              <InputLabel id="demo-simple-select-label">Department name</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Department name"
                                    value={field.value}
                                    // onChange={(value) => field.onChange(value)}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      // handleApplicationNameChange(value);
                                    }}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {departmentList.length > 0
                                      ? departmentList.map((val, id) => {
                                          return (
                                            <MenuItem key={id} value={val.id}>
                                              {val.department}
                                            </MenuItem>
                                          );
                                        })
                                      : "Not Available"}
                                  </Select>
                                )}
                                // name={`applicationRolesList[${index}].departmentName`}
                                name={`applicationRolesList.${index}.departmentId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.departmentName ? errors.departmentName.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item md={3}>
                            <FormControl style={{ width: "100%" }} size="small">
                              <InputLabel id="demo-simple-select-label">Designation name</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Designation name"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {designationList.length > 0
                                      ? designationList.map((val, id) => {
                                          return (
                                            <MenuItem key={id} value={val.id}>
                                              {val.designation}
                                            </MenuItem>
                                          );
                                        })
                                      : "Not Available"}
                                  </Select>
                                )}
                                // name={`applicationRolesList[${index}].designationName`}
                                name={`applicationRolesList.${index}.designationId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.designationName ? errors.designationName.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={1} className={styles.feildres}>
                            <IconButton color="error" onClick={() => remove(index)}>
                              <DeleteIcon sx={{ fontSize: 35 }} />
                            </IconButton>
                          </Grid>
                        </Grid>

                        {/* <Grid
                  item
                  xs={4}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Department name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Department name"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {applicationList.length > 0
                            ? applicationList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.applicationNameEng}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name={`applicationRolesList[${index}].applicationName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.applicationName
                        ? errors.applicationName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Service name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Service name"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ backgroundColor: "white" }}
                        >
                          {filteredServices.length > 0
                            ? filteredServices.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.service}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name={`applicationRolesList[${index}].serviceName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.serviceName ? errors.serviceName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                        {/* <Grid
                  item
                  xs={4}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl fullWidth style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Role name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Role name"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ backgroundColor: "white" }}
                        >
                          {roleList.length > 0
                            ? roleList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.name}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name={`applicationRolesList[${index}].roleName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.roleName ? errors.roleName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}

                        {/* <Grid
                          item
                          xs={1}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<DeleteIcon />}
                            style={{
                              color: "white",
                              backgroundColor: "red",
                              height: "30px",
                            }}
                            onClick={() => {
                              // remove({
                              //   applicationName: "",
                              //   roleName: "",
                              // });
                              remove(index);
                            }}
                          >
                            Delete
                          </Button>

                        </Grid> */}
                      </>
                    );
                  })}
                </Paper>
              </Container>
              <br />
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
                    {/* <FormattedLabel id="save" /> */}
                    Save
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
                    {/* {<FormattedLabel id="clear" />} */}
                    Clear
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
                    {/* {<FormattedLabel id="exit" />} */}
                    Exit
                  </Button>
                </Grid>
              </Grid>
              {/* <Toolbar /> */}
            </div>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default DepartmentUserRegister;
