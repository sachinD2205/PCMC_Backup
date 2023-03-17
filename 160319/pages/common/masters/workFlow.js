import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  label,
  Select,
  TextField,
  Toolbar,
  Typography,
  ListItemText,
  RadioGroup,
  Radio,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../containers/schema/common/workFlowSchema"
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import sweetAlert from "sweetalert";
import styles from "../../../styles/[DepartmentUserRegister].module.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";

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

const WorkFlow = () => {
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
      departmentName: "aa",
      designationName: "bb",
      locationName: "cc",
      serviceName:"dd",
      zoneName:"ee",
      wardName:"ww"
    },
    defaultValues: {
      applicationRolesList: [
        {  departmentName: "", designationName: "", locationName: "",serviceName:"" , zoneName:"",wardName:""},
      ],
    },
    resolver: yupResolver(schema),
  });
  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const  [zoneList,setZoneList]=useState([]);
  const  [wardList,setWardList]=useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // const [isDepartmentChecked, setIsDepartmentChecked] = useState(false);
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
      typeof value === "string" ? value.split(",") : value
    );
  };

  const _handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedModuleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      // name: "applicationName",
      name: "applicationRolesList",
      control,
      // defaultValues: [
      //   {applicationName:'aa',
      // }]
    }
  );

  // useEffect(() => {
  //   console.log(
  //     "444",
  //     router.query,
  //     router.query.mode === "edit"
  //       ? setDataFromDUR(false)
  //       : setDataFromDUR(true)
  //   );
  //   if (router.query.mode === "edit") {
  //     setDataFromDUR(true);
  //   }
  //   if (router.query.mode === undefined) {
  //     setDataFromDUR(false);
  //   }
  //   reset(router.query);
  //   setValue("mobileNumber", router.query.mobileNo);
  //   setValue("userName", router.query.username);
  //   setValue(
  //     "isDepartmentChecked",
  //     router.query.isDepartmentUser === "true" ? true : false
  //   );
  //   setValue("isCFCChecked", router.query.isCfcUser === "true" ? true : false);
  //   setValue(
  //     "isOtherUserChecked",
  //     router.query.isOtherUser === "true" ? true : false
  //   );
  // }, [router.query.pageMode]);

  useEffect(() => {
    if (getValues(`applicationRolesList.length`) == 0) {
      appendUI();
    }
  }, []);

  useEffect(() => {
    getDepartmentName();
    getDesignationName();
    getApplicationsName();
    getRoleName();
    getLocationName();
    getServiceList();
    getOfficeLocation();
    getZone();
    getWard();
  }, []);

  const appendUI = () => {
    append({
      applicationName: "",
      roleName: "",
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

  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res zone", r);
          setZoneList(r.data.zone);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getWard = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res ward", r);
          setWardList(r.data.ward);
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
      .get(`${urls.CFCURL}/master/role/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res role", r);
          setRoleList(r.data.role);
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
          setLocationList(r.data.locality);
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
          console.log("res service", r);
          setServiceList(r.data.service);
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
            r.data.officeLocation

          );
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onFinish = (data) => {
    console.log("data", data);

    let applicationArray = data.applicationRolesList.map((val) => {
      return {
        officeId: val.locationName,
        departmentId: val.departmentName,
        designationId: val.designationName,
        serviceId:val.serviceName  ,
        zoneId:val.zoneName  ,
        wardId:val.wardName  ,

      };
    });

    console.log("applicationArray", applicationArray);

    const body = {
     
      department: data.departmentId,
      designation: data.designationName,
      officeDepartmentDesignationUserDaoLst: applicationArray,
      roles: selectedRoleName,
      service:data.serviceId,
      zone:data.zoneId,
      ward:data.wardId
      
      // applications: selectedModuleName,
      // cFCUser: data.isCFCChecked,
      // otherUser: data.isOtherUserChecked,
      // deptUser: data.isDepartmentChecked,
    };

    console.log("body", body);

    const headers = { Accept: "application/json" };


      // Reset Values Exit
  const resetValuesExit = {
    department: "",
    designation: "",
    officeDepartmentDesignationUserDaoLst: "",
    roles: "",
    service:"",
    zone:"",
    ward:"",
  };
     // Exit Button
     const exitButton = () => {
      
      router.push("./workFlow");
    
  
  };
  
    // axios
    //   .post(`${urls.AuthURL}/signup`, body, { headers })

    //   .then((r) => {
    //     if (r.status == 200) {
    //       console.log("res", r);
    //       toast("Registered Successfully", {
    //         type: "success",
    //       });
    //       router.push("./login");

    //       // D:\Workspace\FrontEnd\NewFrontEnd\pages\login.js
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //     toast("Registeration Failed ! Please Try Again !", {
    //       type: "error",
    //     });
    //   });

    axios.post(`${urls.CFCURL}/master/workFlow/save`, body,{headers}).then((res) => {
      if (res.status == 200) {
        
           sweetAlert("Saved!", "Record Saved successfully !", "success");
          getDepartmentName();
          getDesignationName();
          getApplicationsName();
          getRoleName();
          getLocationName();
          getServiceList();
          getOfficeLocation();
          getZone();
          getWard();

      }
    });
  };

// Filter Method
  const handleApplicationNameChange = (value) => {
    console.log("value", value);
    let test = [];

    let _ch =
      serviceList &&
      serviceList.filter((txt) => {
        return value.target.value === txt.departmentId && txt;
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
      departmentList &&
        departmentList.map((val) => {
          let _ch =
            serviceList &&
            serviceList.filter((txt) => {
              return val.id === txt.departmentId && txt;
            });
          console.log("_ch", _ch);
        })
    );
    console.log("arr", test);
  };

  const handleDepartmentChecked = (e) => {
    console.log("e", e);
    // setIsDepartmentChecked(e.target.checked);
  };

  const handleCFCChecked = (e) => {
    setIsCFCChecked(e.target.checked);
  };

  const handleOtherUserChecked = (e) => {
    setIsOtherUserChecked(e.target.checked);
  };

  return (
    <>

    <form onSubmit={handleSubmit(onFinish)}>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#556CD6",
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
        Work Flow Master
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Box style={{ padding: "20px" }}>
          <Typography variant="h6">Select Workflow</Typography>
          <Divider style={{ background: "black" }} />
        </Box>
      <div>
        <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xs={6}
         
            style={{ display: "flex", justifyContent: "center" }}
          >

         
            <span style={{marginTop:15,marginRight:10}}>
             <InputLabel id="demo-simple-select-standard-label">
                Department Name :
              </InputLabel>
              </span>

             <FormControl
              variant="standard"
              // sx={{ minWidth: 120 }}
              error={!!errors.department}
            >
             
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    // onChange={(value) => field.onChange(value)}
                    onChange={(value) => {
                      field.onChange(value);
                       handleApplicationNameChange(value);
                    }}
                    label="Department"
                  >
                    {departmentList &&
                      departmentList.map((department, index) => {
                        return (
                          <MenuItem key={index} value={department.id}>
                            {department.department}
                          </MenuItem>
                        );
                      })}
                  </Select>
                )}
                name="department"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.department ? errors.department.message : null}
              </FormHelperText>




            </FormControl> 



          </Grid>
          <Grid
            item
            xs={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
             <span style={{marginTop:15,marginRight:10}}>

          
             <InputLabel id="demo-simple-select-standard-label">
                Service Name:
              </InputLabel>
              </span>
            <FormControl
              variant="standard"
            //   sx={{ m: 4, minWidth: 120, marginLeft: "9vw" }}
              error={!!errors.service}
            >
             
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                   
                    label="Service Name"
                  >
                    {serviceList &&
                      serviceList.map((serviceName, index) => (
                        <MenuItem key={index} value={serviceName.id}>
                          {serviceName.serviceName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="serviceName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.service ? errors.service.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xs={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
  <span style={{marginTop:15,marginRight:10}}>

<InputLabel id="demo-simple-select-standard-label">
                Zone:
              </InputLabel>

                  
  </span>
            <FormControl
              variant="standard"
            //   sx={{ m: 4, minWidth: 120, marginLeft: "9vw" }}
              error={!!errors.zone}
            >
             
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Zone"
                  >
                    {zoneList &&
                      zoneList.map((zoneName, index) => (
                        <MenuItem key={index} value={zoneName.id}>
                          {zoneName.zoneName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="zoneName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.zone ? errors.zone.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={6}
            style={{ display: "flex", justifyContent: "center" }}
          >

<span style={{marginTop:15,marginRight:10}}>
 <InputLabel id="demo-simple-select-standard-label">
                Ward:
              </InputLabel>
</span>
            <FormControl
              variant="standard"
              // sx={{ m: 4, minWidth: 120, marginLeft: "9vw" }}
              error={!!errors.ward}
            >
             
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Ward"
                  >
                    {wardList &&
                      wardList.map((wardName, index) => (
                        <MenuItem key={index} value={wardName.id}>
                          {wardName.wardName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="wardName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.ward ? errors.ward.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
       
        <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xs={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
 <span style={{marginTop:11,marginRight:10}}>
 <InputLabel id="demo-simple-select-standard-label">
                Location Type:
              </InputLabel>
</span>
   <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="All" control={<Radio />} label="All" />
        <FormControlLabel value="Zone-Ward" control={<Radio />} label="Zone-Ward" />
      
      </RadioGroup>


          </Grid>
         
        </Grid>
        <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            
          </Grid>
        </Grid>
    

        <Box style={{ padding: "20px" }}>
          <Typography variant="h6">Add WorkFlow Steps</Typography>
          <Divider style={{ background: "black" }} />
        </Box>
        <Grid container>
          <Grid item xs={11} style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                appendUI();
              }}
            >
              Add more
            </Button>
          </Grid>
        </Grid>
        <Grid container style={{ padding: "10px", backgroundColor: "#F9F9F9" }}>
          {fields.map((witness, index) => {
            return (
              <>
               <Grid
                    item
                    xs={2}
                    // style={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl fullWidth style={{ width: "48%" }} size="small">
                      <InputLabel id="demo-simple-select-label">
                        Event
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
                  </Grid>
                  <Grid
                  item
                  xs={2}
                //   style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                    OfficeLocation
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="OfficeLocation"
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
                      name={`applicationRolesList[${index}].locationName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.locationName
                        ? errors.locationName.message
                        : null}
                    </FormHelperText>
                  </FormControl>




                </Grid>
                  <Grid
                  item
                  xs={2}
                //   style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      DepartmentName
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
                      name={`applicationRolesList[${index}].departmentName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.departmentName
                        ? errors.departmentName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

              
               
                <Grid
                  item
                  xs={2}
                //   style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                    Desg/Emp
                    </InputLabel>
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
                      name={`applicationRolesList[${index}].designationName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.designationName
                        ? errors.designationName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                 <Grid
                    item
                    xs={2}
                    // style={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl style={{ width: "48%" }} size="small">
                      <InputLabel id="demo-simple-select-label">
                      Multiselect dropdown
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Multiselect dropdown"
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
                  <Grid   item
                    xs={1}>

 
               <TextField id="demo-helper-text-misaligned-no-helper" label="SLA" />
               </Grid>

                  <Grid
                    item
                    xs={1}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
<TextField id="demo-helper-text-misaligned-no-helper" label="numberOfApprover" />
                  
 
                  </Grid> 
              
   <Grid container style={{ padding: "10px", backgroundColor: "#F9F9F9" }}>
   <Grid
                  item
                  xs={11}
                //   style={{
                //     display: "flex",
                //     justifyContent: "center",
                //     alignItems: "center",
                //   }}
                >
                    </Grid>
                <Grid
                  item
                  xs={1}
                //   style={{
                //     display: "flex",
                //     justifyContent: "center",
                //     alignItems: "center",
                //   }}
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
                </Grid>
                </Grid>
              </>
            );
          })}
        </Grid>
        <Grid
          container
          style={{ padding: "10px", display: "flex", justifyContent: "center" }}
        >
          <Grid item xs={1}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              style={{ color: "white", backgroundColor: "#00A65A" }}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              size="small"
              style={{ color: "white", backgroundColor: "#367FA9" }}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });

              }}
            >
              Reset
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              size="small"
              style={{ color: "white", backgroundColor: "red" }}
             
              onClick={() => exitButton()}
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <Toolbar />
      </div>
    </form>

    </>
  );
};

export default WorkFlow;
