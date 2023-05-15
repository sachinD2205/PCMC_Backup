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
  Alert,
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

import schema from "../../../containers/schema/common/DepartmentUserRegisterSchema";
// import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import styles from "../../../styles/cfc/cfc.module.css";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import swal from "sweetalert";

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
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      departmentId: "",
      designationId: "",
      officeId: "",
    },
    defaultValues: {
      officeDepartmentDesignationUserDaoLst: [
        { activeFlag: "", id: "", departmentId: "", designationId: "", officeId: "" },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    // name: "applicationName",
    name: "officeDepartmentDesignationUserDaoLst",
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

  const [primaryLocationChange, setPrimaryLocationChange] = useState();

  const [locationChange, setLocationChange] = useState();

  const [departmentNameChange, setDepartmentNameChange] = useState();

  const [departmentChange, setDepartmentChange] = useState();

  useEffect(() => {
    getDepartmentNameList();
    getDesignationNameList();
  }, []);

  const language = useSelector((state) => state.labels.language);

  const [departmentListName, setDepartmentListName] = useState([]);
  const [designationListName, setDesignationListName] = useState([]);

  const getDepartmentNameList = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res department22", r);
          setDepartmentListName(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDesignationNameList = () => {
    axios
      .get(`${urls.CFCURL}/master/designation/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("333res designation", r);
          setDesignationListName(r.data.designation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

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
    console.log("router.query", router.query);
    if (router.query.mode === "edit") {
      setDataFromDUR(true);
    }
    // if (router.query.mode === "view") {
    //   setDataFromDUR(true);
    // }
    if (router.query.mode === undefined) {
      setDataFromDUR(false);
    }
    reset(router.query);

    setValue("officeDepartmentDesignationUserDaoLst", []);

    // if (router.query.mode == "edit") {
    axios
      .get(`${urls.CFCURL}/master/user/getById?userId=${router.query.id}`)
      .then((r) => {
        if (r.status == 200) {
          console.log("332233", r?.data);
          setSelectedModuleName(r.data.applications);
          let officeDepartmentDesignationUserDaoLst =
            r?.data?.officeDepartmentDesignationUserDaoLst &&
            r?.data?.officeDepartmentDesignationUserDaoLst.map((val) => {
              console.log("value33", val);
              return {
                officeId: val.officeId,
                departmentId: val.departmentId,
                designationId: val.designationId,
                id: val.id,
                activeFlag: val.activeFlag,
              };
            });

          console.log("officeDepartmentDesignationUserDaoLst43434", officeDepartmentDesignationUserDaoLst);
          setValue("officeDepartmentDesignationUserDaoLst", officeDepartmentDesignationUserDaoLst);

          console.log(
            "officeDepartmentDesignationUserDaoLst**",
            getValues("officeDepartmentDesignationUserDaoLst"),
          );
        }
      })
      .catch((err) => {
        console.log("errApplication", err);
      });
    // }
    // else {
    // setValue("officeDepartmentDesignationUserDaoLst", []);
    // }

    setIsCFCChecked(router.query.isCfcUser);
    setIsOtherUserChecked(router.query.isOtherUser == "false" ? "false" : "true");
    setIsDepartmentChecked(router.query.isDepartmentUser);
    setValue("mobileNumber", router.query.mobileNo);
    // setValue("userName", router.query.userName);
    setValue("isDepartmentChecked", router.query.isDepartmentUser === "true" ? true : false);
    setValue("isCFCChecked", router.query.isCfcUser === "true" ? true : false);
    setValue("isOtherUserChecked", router.query.isOtherUser === "true" ? true : false);
    setValue("employeeCode", router.query.employeeCode);

    // setValue("primaryDesignation", router.query.primaryDesignation);
    // setValue("primaryDepartment", router.query.primaryDepartment);
    // setValue("primaryOffice", router.query.primaryOffice);

    // setEmployeeCode(router.query.employeeCode);
    // console.log("employeeCodeState", router.query);
  }, []);

  useEffect(() => {
    console.log("32232332", watch(`officeDepartmentDesignationUserDaoLst.length`));

    if (watch(`officeDepartmentDesignationUserDaoLst.length`) == 0) {
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
    getEmployeeCode();
  }, []);

  const [employeeCodeState, setEmployeeCode] = useState();

  const getEmployeeCode = () => {
    axios
      .get(
        `${urls.AuthURL}/getNextUserName
    `,
      )
      .then((r) => {
        if (r.status == 200) {
          console.log("12345", r.data);
          setEmployeeCode(r.data);
          setValue("empCode", r.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

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
      .get(`${urls.CFCURL}/master/departmentAndOfficeLocationMapping/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res department", r);
          setDepartmentList(r.data.departmentAndOfficeLocationMapping);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDesignationName = () => {
    axios
      .get(`${urls.CFCURL}/master/departmentAndDesignationMapping/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res designation", r);
          setDesignationList(r.data.departmentAndDesignationMapping);
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
          setApplicationList(r.data.application);
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
          setRoleList(r?.data?.mstRole);
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
            r?.data?.officeLocation,
          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onFinish = (data) => {
    console.log("iiii222", data.officeDepartmentDesignationUserDaoLst);

    let applicationArray =
      data?.officeDepartmentDesignationUserDaoLst &&
      data?.officeDepartmentDesignationUserDaoLst?.map((val) => {
        return {
          // officeId: val.locationName,
          // departmentId: val.departmentName,
          // designationId: val.designationName,
          id: val.id,
          activeFlag: val.activeFlag,
          officeId: val.officeId,
          departmentId: val.departmentId,
          designationId: val.designationId,
        };
      });

    console.log("applicationArray", applicationArray);

    const body = {
      activeFlag: data.activeFlag,
      id: data.id ? Number(data.id) : null,
      // userName: employeeCodeState,
      // empCode: employeeCodeState,
      userName: data.userName,
      empCode: data.empCode,
      password: data.password,
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
      officeDepartmentDesignationUserDaoLst: applicationArray,
      // officeDepartmentDesignationUserDaoLst: getValues("officeDepartmentDesignationUserDaoLst"),
      // roles: selectedRoleName,
      applications: selectedModuleName,
      cFCUser: data.isCFCChecked,
      otherUser: data.isOtherUserChecked,
      deptUser: data.isDepartmentChecked,

      // primaryDesignation: data.primaryDesignation,
      // primaryDepartment: data.primaryDepartment,
      // primaryOffice: data.primaryOffice,
    };

    console.log("body", body);

    const headers = { Accept: "application/json" };

    swal({
      title: "Save?",
      text: "Are you sure you want to Save this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    swal({
      title: "Confirmation",
      text: "Are you sure want to Create User ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${urls.AuthURL}/signup`, body, { headers })
          .then((r) => {
            if (r.status == 200) {
              data.id
                ? swal({
                    title: "Updated",
                    text: "User Updated Successfully",
                    icon: "success",
                    // buttons: ["Cancel", "Save"],
                  })
                : swal({
                    title: "Created",
                    text: "User Created Successfully",
                    icon: "success",
                    // buttons: ["Cancel", "Save"],
                  });
              // toast("User Created Successfully", {
              //   type: "success",
              // });

              router.push("/common/masters/departmentUserList");
            } else if (r.status == 400) {
              toast("400 ! Bad Request", {
                type: "failure",
              });
            }
          })
          .catch((err) => {
            console.log("22222", err?.response?.data);
            // if (err.response?.data?.length > 0) {
            //   err.response?.data?.map((x) => {
            //     if (x.field == "email") {
            //       setError("email", { message: x.code });
            //     } else if (x.field == "userName") {
            //       setError("userName", { message: x.code });
            //     }
            //   });
            // } else {
            sweetAlert(
              err?.response?.data,
              "Email all ready exits...Try again with different E-mail or userName !!",
              // "Try again with different E-mail or userName",
              "warning",
            );
            // console.log("err", err.response.data);
            // toast(err.response.data, {
            //   type: "error",
            // });
            // }
          });
      }
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
    selectedModuleName: "",
    isOtherUserChecked: "",
    isCFCChecked: "",
    isDepartmentChecked: "",
    primaryOffice: "",
    primaryDepartment: "",
    primaryDesignation: "",
  };

  // Exit Button
  const exitButton = () => {
    // router.push("./departmentUserList");
    router.push("/common/masters/departmentUserList");
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
        applicationList?.map((val) => {
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
                <FormattedLabel id="departmentUserRegister" />
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
            <Box className={styles.feildHead}>
              <FormattedLabel id="userDetails" />
            </Box>
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
                    label={<FormattedLabel id="firstName" />}
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
                    label={<FormattedLabel id="middleName" />}
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
                    label={<FormattedLabel id="lastName" />}
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
                    label={<FormattedLabel id="firstNameMr" />}
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
                    label={<FormattedLabel id="middleNameMr" />}
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
                    label={<FormattedLabel id="lastNameMr" />}
                    variant="outlined"
                    readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("lastNameMr")}
                    error={errors.lastNameMr}
                    helperText={errors.lastNameMr?.message}
                  />
                </Grid>
              </Grid>
              <br />
              <Alert variant="outlined" color="info">
                you can login through your- E-mail, Mobile Number, Employee Code or via User Name
              </Alert>
              <br />

              <Grid container style={{ padding: "10px" }}>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="userEmail" />}
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
                    label={<FormattedLabel id="mobileNo" />}
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // readonly={dataFromDUR}
                    // value={router.query.empCode ? router.query.empCode : employeeCodeState}
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="employeeCode" />}
                    variant="outlined"
                    style={{ backgroundColor: "white" }}
                    // {...register("employeeCodeState")}
                    {...register("empCode")}
                    error={errors.empCode}
                    helperText={errors.empCode?.message}
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
                    // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    readonly={dataFromDUR}
                    // value={router.query.employeeCode ? router.query.employeeCode : employeeCodeState}
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="userN" />}
                    variant="outlined"
                    // readonly={dataFromDUR}
                    style={{ backgroundColor: "white" }}
                    {...register("userName")}
                    // {...register("employeeCodeState")}
                    error={errors.userName}
                    helperText={errors.userName?.message}
                  />
                </Grid>
                <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    sx={{ width: "86%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="password" />}
                    // readonly
                    readonly={dataFromDUR}
                    // defaultValue="Admin@123"
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
              <Grid container style={{ padding: "10px" }}>
                {/*   <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <FormControl style={{ width: "86%" }} size="small" error={!!errors.primaryOffice}>
                    <InputLabel id="demo-simple-select-label">
                      <FormattedLabel id="primaryLocationName" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          error={errors?.primaryOffice ? true : false}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="primaryLocationName" />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            setPrimaryLocationChange(value.target.value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {officeLocationList.length > 0
                            ? officeLocationList?.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {language === "en" ? val.officeLocationName : val.officeLocationNameMar}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name="primaryOffice"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.primaryOffice ? errors.primaryOffice.message : null}
                    </FormHelperText>
                  </FormControl> 
                </Grid>*/}
                {/* <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <FormControl style={{ width: "86%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      <FormattedLabel id="primaryDepartmentName" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          error={errors?.primaryDepartment ? true : false}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="primaryDepartmentName" />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            setDepartmentNameChange(value.target.value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {departmentListName.length > 0
                            ? departmentListName
                                // .filter((item) => item.id == primaryLocationChange)
                                ?.map((val, id) => {
                                  console.log("555", val, primaryLocationChange);
                                  return (
                                    <MenuItem key={id} value={val.id}>
                                 
                                      {language === "en" ? val.department : val.departmentMr}
                                    </MenuItem>
                                  );
                                })
                            : "Not Available"}
                        </Select>
                      )}
                      name="primaryDepartment"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.primaryDepartment ? errors.primaryDepartment.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                {/* {language === "en"
                                        ? departmentList.find((f) => f.id == val.department)?.department
                                        : departmentList.find((f) => f.id == val.department)?.departmentMr} */}
                {/* <Grid item xs={4} style={{ display: "flex", justifyContent: "center" }}>
                  <FormControl style={{ width: "86%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      <FormattedLabel id="primaryDesignationName" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          error={errors?.primaryDesignation ? true : false}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="primaryDesignationName" />}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ backgroundColor: "white" }}
                        >
                          {designationListName.length > 0
                            ? designationListName
                                // .filter((f) => f.id == departmentNameChange)
                                ?.map((val, id) => {
                                  return (
                                    <MenuItem key={id} value={val.id}>
                                 
                                      {language === "en" ? val.designation : val.designationMr}
                                    </MenuItem>
                                  );
                                })
                            : "Not Available"}
                        </Select>
                      )}
                      name="primaryDesignation"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.primaryDesignation ? errors.primaryDesignation.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                {/* {language === "en"
                                        ? designationListName.find((f) => f.id == val.designation)
                                            ?.designation
                                        : designationListName.find((f) => f.id == val.designation)
                                            ?.designationMr} */}
              </Grid>
              <Grid container columns={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: "23px" }}>
                <Grid item xs={12} sx={{ marginLeft: 2 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">
                      <FormattedLabel id="moduleName" />
                    </InputLabel>
                    <Select
                      // required
                      // {...register("applications")}
                      // error={errors?.selectedModuleName < 1 ? true : false}
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      // maxRows={3}
                      // multiline
                      sx={{ backgroundColor: "white" }}
                      value={selectedModuleName}
                      // readonly={dataFromDUR}
                      onChange={_handleChange}
                      label={<FormattedLabel id="moduleName" />}
                      renderValue={(selected) => selected.join(", ")}
                      // MenuProps={MenuProps}
                    >
                      {applicationList.length > 0
                        ? applicationList?.map((name, index) => {
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
                    <FormHelperText style={{ color: "red" }}>
                      {/* {errors?.selectedModuleName < 1 ? errors.applications.message : null} */}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                {/* <Grid container style={{ padding: "10px" }}> */}
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
                    sx={{
                      backgroundColor: "white",
                      border: "1px dotted black",
                      paddingRight: 3,
                      marginRight: language === "en" ? 10 : 2,
                    }}
                    control={
                      <Checkbox
                        checked={isDepartmentChecked}
                        sx={{
                          backgroundColor: "white",
                          marginRight: 1,
                        }}
                      />
                    }
                    // readonly={dataFromDUR}
                    {...register("isDepartmentChecked")}
                    onChange={handleDepartmentChecked}
                    label={<FormattedLabel id="isDepartmentUser" />}
                  />
                </Grid>

                {/* </Grid> */}
                {/* <Grid container style={{ padding: "10px" }}> */}
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
                    sx={{
                      backgroundColor: "white",
                      border: "1px dotted black",
                      paddingRight: 3,
                      marginRight: language === "en" ? 17 : 5,
                    }}
                    readonly={dataFromDUR}
                    control={
                      <Checkbox
                        checked={isCFCChecked}
                        sx={{
                          backgroundColor: "white",
                          marginRight: 1,
                        }}
                      />
                    }
                    {...register("isCFCChecked")}
                    onChange={handleCFCChecked}
                    label={<FormattedLabel id="isCfcUser" />}
                  />
                </Grid>
                {/* </Grid> */}
              </Grid>
              {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    readonly={dataFromDUR}
                    control={<Checkbox checked={isOtherUserChecked} />}
                    {...register("isOtherUserChecked")}
                    onChange={handleOtherUserChecked}
                    label={<FormattedLabel id="isOtherUser" />}
                  />
                </Grid> */}

              {/* <Box style={{ padding: "20px" }}>
                <Typography variant="h6">Applications Roles List</Typography>
                <Divider style={{ background: "black" }} />
              </Box> */}
              <br />
              <br />
              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>
                  {/* <FormattedLabel id="officeDepartmentDesignationUserDaoLst" /> */}
                  <FormattedLabel id="applicationRolesList" />
                </Box>
              </Box>
              <br />

              <Container>
                <Paper component={Box} p={1}>
                  <Box style={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}>
                    {router.query.mode === "view" ? (
                      <></>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<AddBoxOutlinedIcon />}
                        onClick={() => {
                          appendUI();
                        }}
                      >
                        <FormattedLabel id="addMore" />
                      </Button>
                    )}
                  </Box>
                  {console.log("333", fields.length)}
                  {fields?.map((witness, index) => {
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
                              <InputLabel id="demo-simple-select-label">
                                <FormattedLabel id="locationName" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    error={
                                      errors?.officeDepartmentDesignationUserDaoLst?.[index]?.officeId
                                        ? true
                                        : false
                                    }
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label={<FormattedLabel id="locationName" />}
                                    value={field.value}
                                    // onChange={(value) => field.onChange(value)}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      setLocationChange(value.target.value);
                                    }}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {officeLocationList.length > 0
                                      ? officeLocationList?.map((val, id) => {
                                          return (
                                            <MenuItem key={id} value={val.id}>
                                              {language === "en"
                                                ? val.officeLocationName
                                                : val.officeLocationNameMar}
                                            </MenuItem>
                                          );
                                        })
                                      : "Not Available"}
                                  </Select>
                                )}
                                // name={`officeDepartmentDesignationUserDaoLst[${index}].locationName`}
                                name={`officeDepartmentDesignationUserDaoLst.${index}.officeId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.officeDepartmentDesignationUserDaoLst?.[index]?.officeId
                                  ? errors?.officeDepartmentDesignationUserDaoLst?.[index]?.officeId.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item md={4}>
                            <FormControl style={{ width: "100%" }} size="small">
                              <InputLabel id="demo-simple-select-label">
                                <FormattedLabel id="departmentName" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    error={
                                      errors?.officeDepartmentDesignationUserDaoLst?.[index]?.departmentId
                                        ? true
                                        : false
                                    }
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label={<FormattedLabel id="departmentName" />}
                                    value={field.value}
                                    // onChange={(value) => field.onChange(value)}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      setDepartmentChange(value.target.value);
                                    }}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {departmentListName.length > 0
                                      ? departmentListName
                                          // .filter((item) => item.id == locationChange)
                                          ?.map((val, id) => {
                                            return (
                                              <MenuItem key={id} value={val.id}>
                                                {/* {language === "en"
                                                  ? departmentListName.find((f) => f.id === val.department)
                                                      ?.department
                                                  : departmentListName.find((f) => f.id === val.department)
                                                      ?.departmentMr} */}
                                                {language === "en" ? val.department : val.departmentMr}
                                              </MenuItem>
                                            );
                                          })
                                      : "Not Available"}
                                  </Select>
                                )}
                                // name={`officeDepartmentDesignationUserDaoLst[${index}].departmentName`}
                                name={`officeDepartmentDesignationUserDaoLst.${index}.departmentId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.officeDepartmentDesignationUserDaoLst?.[index]?.departmentId
                                  ? errors?.officeDepartmentDesignationUserDaoLst?.[index]?.departmentId
                                      .message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item md={3}>
                            <FormControl style={{ width: "100%" }} size="small">
                              <InputLabel id="demo-simple-select-label">
                                <FormattedLabel id="designationName" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    error={
                                      errors?.officeDepartmentDesignationUserDaoLst?.[index]?.designationId
                                        ? true
                                        : false
                                    }
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label={<FormattedLabel id="designationName" />}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    {designationListName.length > 0
                                      ? designationListName
                                          // .filter((f) => f.id == departmentChange)
                                          ?.map((val, id) => {
                                            return (
                                              <MenuItem key={id} value={val.id}>
                                                {/* {
                                                  designationListName.find((f) => f.id === val.designation)
                                                    ?.designationMr
                                                } */}
                                                {language === "en" ? val.designation : val.designationMr}
                                              </MenuItem>
                                            );
                                          })
                                      : "Not Available"}
                                  </Select>
                                )}
                                // name={`officeDepartmentDesignationUserDaoLst[${index}].designationName`}
                                name={`officeDepartmentDesignationUserDaoLst.${index}.designationId`}
                                control={control}
                                defaultValue=""
                                key={witness.id}
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.officeDepartmentDesignationUserDaoLst?.[index]?.designationId
                                  ? errors?.officeDepartmentDesignationUserDaoLst?.[index]?.designationId
                                      .message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {router.query.mode === "view" ? (
                            <></>
                          ) : (
                            <>
                              <Grid item xs={1} className={styles.feildres}>
                                <IconButton
                                  color="error"
                                  // onClick={() => {
                                  //   remove(index, {
                                  //     activeFlag: "",
                                  //     id: "",
                                  //     departmentId: "",
                                  //     designationId: "",
                                  //     officeId: "",
                                  //   });
                                  // remove(index);
                                  // }}
                                  onClick={() => remove(index)}
                                >
                                  <DeleteIcon sx={{ fontSize: 35 }} />
                                </IconButton>
                              </Grid>
                            </>
                          )}
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
                      name={`officeDepartmentDesignationUserDaoLst[${index}].applicationName`}
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
                      name={`officeDepartmentDesignationUserDaoLst[${index}].serviceName`}
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
                      name={`officeDepartmentDesignationUserDaoLst[${index}].roleName`}
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
              {router.query.mode === "view" ? (
                <></>
              ) : (
                <>
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
                </>
              )}
              {/* <Toolbar /> */}
            </div>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default DepartmentUserRegister;
