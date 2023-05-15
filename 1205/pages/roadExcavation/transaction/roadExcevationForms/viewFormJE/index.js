import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useState } from "react";
import theme from "../../../../../theme";
import * as yup from "yup";
import router from "next/router";


import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import { yupResolver } from "@hookform/resolvers/yup";

import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { roadExcavationCitizenSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
import urls from "../../../../../URLS/urls";
import axios from "axios";

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
    // criteriaMode: "all",
    resolver: yupResolver(yup.object().shape({ ...roadExcavationCitizenSchema })),
    // mode: "onSubmit",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "witnesses", // unique name for your Field Array
  });

  console.log(":fields", fields);
  const [doc, setDoc] = useState();
  const [dataSource, setDataSource] = useState();
  const [actionJE, setactionJE] = useState();
  const [remarkJE, setremarkJE] = useState();

 
  const language = useSelector((store) => store.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  // console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

 // get authority of selected user

 const authority = user?.menus?.find((r) => {
  return r.id == selectedMenuFromDrawer;
})?.roles;

console.log("authority", authority);

  useEffect(() => {
    getSingleApplicationData( router.query.id)
    
  }, [router.query.id]);

  
  //get single application data
  const getSingleApplicationData =(id,_pageSize = 10, _pageNo = 0)=>{
    axios
    .get(`${urls.RENPURL}/trnExcavationRoadCpmpletion/getAll`, {
      params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then((r) => {
        let result = r.data.trnExcavationRoadCpmpletionList;
      console.log("allresult",result);
      let temp=result && result.find(each=>each.id==id)
      setDataSource(temp);
  
    })
  }
  console.log("getPhotopassDataById", dataSource);
  

  const getServiceCharges = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    axios
      .get(`${urls.BaseURL}/servicecharges/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      }).then((r) => {
        // let result = r.data.trnExcavationRoadCpmpletionList;
      console.log("charge",r);
     
    })
    }

//assigning value to fields
useEffect(() => {
  let res = dataSource;
  getServiceCharges()
  setValue("applicationNumber", res ? res?.applicationNo : "-");
  setValue("companyName", res ? res?.companyName : "-");
  setValue("firstName", res ? res?.firstName : "-");
  setValue("middleName", res ? res?.middleName : "-");
  setValue("lastName", res ? res?.lastName : "-");
  setValue("mobileNo", res ? res?.mobileNo : "-");
  setValue("landlineNo", res ? res?.landlineNo : "-");
  setValue("emailAddress", res ? res?.emailAddress : "-");
  setValue("mainScheme", res ? res?.mainScheme : "-");
  setValue("subScheme", res ? res?.subScheme : "-");
  setValue("permitPeriod", res ? res?.permitPeriod : "-");
  setValue("scopeOfWork", res ? res?.scopeOfWork : "-");
  setValue("startLat", res ? res?.startLat : "-");
  setValue("endLat", res ? res?.endLat : "-");
  setValue("startLng", res ? res?.startLng : "-");
  setValue("endLng", res ? res?.endLng : "-");
  setValue("locationSameAsPcmcOrderYn", res ? res?.locationSameAsPcmcOrderYn : null);
  setValue("locationRemark", res ? res?.locationRemark : "-");
  setValue("lengthSameAsPcmcOrderYn", res ? res?.lengthSameAsPcmcOrderYn : null);
  setValue("lengthRemark", res ? res?.lengthRemark : "-");
  setValue("depthSameAsPcmcOrderYn", res ? res?.depthSameAsPcmcOrderYn : null);
  setValue("depthRemark", res ? res?.depthRemark : "-");
  setValue("widthSameAsPcmcOrderYn", res ? res?.widthSameAsPcmcOrderYn : null);
  setValue("widthRemark", res ? res?.widthRemark : "-");
  setValue("deputyEngineerRemark", res ? res?.deputyEngineerRemark : "-");
  setValue("excutiveEngineerRemark", res ? res?.excutiveEngineerRemark : "-");
  setValue("additionalCityEngineerRemark", res ? res?.additionalCityEngineerRemark : "-");
  setValue("additionalCommissionerRemark", res ? res?.additionalCommissionerRemark: "-");
  setValue("commissionerRemark", res ? res?.commissionerRemark: "-");
}, [dataSource]);


  const [btnSaveText, setbtnSaveText] = useState("Save");
  const clearButton = () => {
    console.log("clear");
    reset({
      ...resetValuesClear,
    });
  };

  //LOI Generation start
  let generateLOI = () => {
    let body={
      "id":router.query.id,
      "role":"LOI_GENRATION",
      "trnLoiDao":{
        "mstServiceChargesId":60
      }
       
    }
           const tempData = axios
          .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/saveApprove`, body, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status == 201 || res.status == 200) {
              sweetAlert("Saved!", "LOI Genrated Successfully !", "success");
              router.push("/roadExcavation/transaction/roadExcavationForms/roadExcavationDetails");
            }
          });
      
    
  };

  //LOI Generation end


  // Reset Values Clear
  
  // const handleUploadDocument = (path) => {
  //   console.log("handleUploadDocument", path);
  //   let temp = {
  //     documentPath: path,
  //     documentKey: 1,
  //     documentType: "",
  //     remark: "",
  //   };
  //   setDoc(temp);
  // };

  let onSubmitFunc = () => {
    let body={
      "id":router.query.id,
      "action":actionJE,
      "remark":remarkJE,
      "role":authority[0]
       
    }
   
        const tempData = axios
          .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/saveApprove`, body, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              sweetAlert("Saved!", "Road Excevation Application Saved successfully !", "success");
              router.push("/roadExcavation/transaction/roadExcavationForms/roadExcavationDetails");
            }
          });
      
    
  };


  

 

  return (
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          margin: "30px",
          marginBottom: "100px",
        }}
        elevation={2}
      >
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
              <FormattedLabel id="RoadExcavation_NocPermission" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitFunc)}>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
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
                style={{ backgroundColor: "white", width: "250px" }}
                id="applicationNumber"
                name="applicationNumber"
                label={<FormattedLabel id="applicationNumber" />}
                variant="standard"
                value={watch("applicationNumber")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicationNumber") ? true : false,
                }}
                error={!!errors.applicationNumber}
                helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
              />
            </Grid>
              {/* ////////////////////////////////////////// */}
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="companyName"
                  name="companyName"
                  label={<FormattedLabel id="companyName" />}
                  variant="standard"
                  value={watch("companyName")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("companyName") ? true : false,
                  }}          
                  error={!!errors.companyName}
                  helperText={errors?.companyName ? errors.companyName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
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
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="BRTS Road"
                    name="roadType"
                    {...register("roadType")}
                  >
                    <FormControlLabel value="BRTS Road" control={<Radio />} label="BRTS Road" />
                    <FormControlLabel value="Internal Road" control={<Radio />} label="Internal Road" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {/* ////////////////////////////////////////// */}
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="firstName"
                  name="firstName"
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  value={watch("firstName")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("firstName") ? true : false,
                  }}
                  error={!!errors.firstName}
                  helperText={errors?.firstName ? errors.firstName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="middleName"
                  name="middleName"
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  value={watch("middleName")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("middleName") ? true : false,
                  }}     
                               error={!!errors.middleName}
                  helperText={errors?.middleName ? errors.middleName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lastName"
                  name="lastName"
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  value={watch("lastName")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("lastName") ? true : false,
                  }}                
                    error={!!errors.lastName}
                  helperText={errors?.lastName ? errors.lastName.message : null}
                />
              </Grid>

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  sx={{ width: 250 }}
                  id="landlineNo"
                  name="landlineNo"
                  label={<FormattedLabel id="landLineNo" />}
                  variant="standard"
                  value={watch("landlineNo")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("landlineNo") ? true : false,
                  }}              
                      error={!!errors.landlineNo}
                  helperText={errors?.landlineNo ? errors.landlineNo.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="mobileNo"
                  name="mobileNo"
                  // label={<FormattedLabel id="amenities" />}
                  label="Mobile No."
                  // variant="outlined"
                  variant="standard"
                  value={watch("mobileNo")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("mobileNo") ? true : false,
                  }}              
                      error={!!errors.mobileNo}
                  helperText={errors?.mobileNo ? errors.mobileNo.message : null}
                />
              </Grid>
              {/* //////////////////////////////////////////////////// */}
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="emailAddress"
                  name="emailAddress"
                  // label={<FormattedLabel id="amenities" />}
                  label="emailAddress "
                  // variant="outlined"
                  variant="standard"
                  value={watch("emailAddress")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("emailAddress") ? true : false,
                  }}                     
                  error={!!errors.emailAddress}
                  helperText={errors?.emailAddress ? errors.emailAddress.message : null}
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
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="mainScheme"
                  name="mainScheme"
                  // label={<FormattedLabel id="amenities" />}
                  label="Main Scheme"
                  // variant="outlined"
                  variant="standard"
                  value={watch("mainScheme")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("mainScheme") ? true : false,
                  }}                 
                   error={!!errors.mainScheme}
                  helperText={errors?.mainScheme ? errors.mainScheme.message : null}
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
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="subScheme"
                  name="subScheme"
                  // label={<FormattedLabel id="amenities" />}
                  label="Sub Scheme"
                  // variant="outlined"
                  variant="standard"
                  value={watch("subScheme")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("subScheme") ? true : false,
                  }}                   error={!!errors.subScheme}
                  helperText={errors?.subScheme ? errors.subScheme.message : null}
                />
              </Grid>
            </Grid>

            {/* /////////////////////////////////////////////////////////////////////////////////////// */}

            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <FormControl>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      sx={{
                        marginTop: "6px",
                      }}
                    >
                      {" "}
                      <FormLabel id="demo-row-radio-buttons-group-label">Eligible for Scheme</FormLabel>
                    </Grid>
                    <Grid item>
                      <FormControl flexDirection="row">
                        <Controller
                          name="eligibleForSchemeYn"
                          control={control}
                          defaultValue={"Y"}
                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel value="Y" control={<Radio />} label={"Yes"} />
                              <FormControlLabel value="N" control={<Radio />} label={"No"} />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              {/* ////////////////////////////////////////// */}
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="permitPeriod"
                  name="permitPeriod"
                  // label={<FormattedLabel id="amenities" />}
                  label="Permit Period"
                  // variant="outlined"
                  variant="standard"
                  value={watch("permitPeriod")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("permitPeriod") ? true : false,
                  }}                 
                   error={!!errors.permitPeriod}
                  helperText={errors?.permitPeriod ? errors.permitPeriod.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="scopeOfWork"
                  name="scopeOfWork"
                  // label={<FormattedLabel id="amenities" />}
                  label="Scope Of Work"
                  // variant="outlined"
                  variant="standard"
                  value={watch("scopeOfWork")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("scopeOfWork") ? true : false,
                  }}                  
                  error={!!errors.scopeOfWork}
                  helperText={errors?.scopeOfWork ? errors.scopeOfWork.message : null}
                />
              </Grid>
            </Grid>

            {/* ////////////////////////////////////////// */}
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="startLat"
                  name="startLat"
                  // label={<FormattedLabel id="amenities" />}
                  label="START Latitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  value={watch("startLat")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("startLat") ? true : false,
                  }}                 
                   error={!!errors.startLat}
                  helperText={errors?.startLat ? errors.startLat.message : null}
                />
              </Grid>
              {/*///////////////////////////////////////// */}
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="endLat"
                  name="endLat"
                  // label={<FormattedLabel id="amenities" />}
                  label="END Latitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  value={watch("endLat")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("endLat") ? true : false,
                  }} 
                                    error={!!errors.endLat}
                  helperText={errors?.endLat ? errors.endLat.message : null}
                />
              </Grid>
              {/*///////////////////////////////////////// */}
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="startLng"
                  name="startLng"
                  // label={<FormattedLabel id="amenities" />}
                  label="START Longitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  value={watch("startLng")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("startLng") ? true : false,
                  }}
                                     error={!!errors.startLng}
                  helperText={errors?.startLng ? errors.startLng.message : null}
                />
              </Grid>
              {/*///////////////////////////////////////// */}
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
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="endLng"
                  name="endLng"
                  // label={<FormattedLabel id="amenities" />}
                  label="END Longitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  value={watch("endLng")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("endLng") ? true : false,
                  }} 
                                   error={!!errors.endLng}
                  helperText={errors?.endLng ? errors.endLng.message : null}
                />
              </Grid>
              {/*///////////////////////////////////////// */}
              
            </Grid>

            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
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
                <Typography> Is Location excavation is same as per PCMC order?</Typography>
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
                <FormControl flexDirection="row">
                  <Controller
                    name="locationSameAsPcmcOrderYn"
                    control={control}
                    defaultValue={"Y"}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        selected={field.value}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                      >
                        <FormControlLabel value="Y" control={<Radio />} label={"Yes"} />
                        <FormControlLabel value="N" control={<Radio />} label={"No"} />
                      </RadioGroup>
                    )}
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="locationRemark"
                  name="locationRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  // value={watch("locationRemark")}
                  variant="standard"
                  value={watch("locationRemark")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("locationRemark") ? true : false,
                  }}                   
                  error={!!errors.locationRemark}
                  helperText={errors?.locationRemark ? errors.locationRemark.message : null}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
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
                <Typography> Is Length excavation is same as per PCMC order?</Typography>
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
                <FormControl flexDirection="row">
                  <Controller
                    name="lengthSameAsPcmcOrderYn"
                    control={control}
                    defaultValue={"Y"}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
                        selected={field.value}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                      >
                        <FormControlLabel value="Y" control={<Radio />} label={"Yes"} />
                        <FormControlLabel value="N" control={<Radio />} label={"No"} />
                      </RadioGroup>
                    )}
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="lengthRemark"
                  name="lengthRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("lengthRemark")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("lengthRemark") ? true : false,
                  }}                  
                  error={!!errors.lengthRemark}
                  helperText={errors?.lengthRemark ? errors.lengthRemark.message : null}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
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
                <Typography> Is Depth excavation is same as per PCMC order?</Typography>
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
                <FormControl flexDirection="row">
                  <Controller
                    name="depthSameAsPcmcOrderYn"
                    control={control}
                    defaultValue={"Y"}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
                        selected={field.value}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                      >
                        <FormControlLabel value="Y" control={<Radio />} label={"Yes"} />
                        <FormControlLabel value="N" control={<Radio />} label={"No"} />
                      </RadioGroup>
                    )}
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="depthRemark"
                  name="depthRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("depthRemark")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("depthRemark") ? true : false,
                  }}                   
                  error={!!errors.depthRemark}
                  helperText={errors?.depthRemark ? errors.depthRemark.message : null}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
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
                <Typography> Is Width excavation is same as per PCMC order?</Typography>
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
                <FormControl flexDirection="row">
                  <Controller
                    name="widthSameAsPcmcOrderYn"
                    control={control}
                    defaultValue={"Y"}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
                        selected={field.value}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                      >
                        <FormControlLabel value="Y" control={<Radio />} label={"Yes"} />
                        <FormControlLabel value="N" control={<Radio />} label={"No"} />
                      </RadioGroup>
                    )}
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
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="widthRemark"
                  name="widthRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("widthRemark")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("widthRemark") ? true : false,
                  }}                 
                   error={!!errors.widthRemark}
                  helperText={errors?.widthRemark ? errors.widthRemark.message : null}
                />
              </Grid>
            </Grid>

                    {/* table */}
<h3>Uploaded Document</h3>
            <Table>
      <TableHead>
        <TableRow>
          <TableCell>Sr.No</TableCell>
          <TableCell>Document Name</TableCell>
          <TableCell>Doc type</TableCell>
          <TableCell>View</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataSource
        &&
         dataSource.fileAttachementDao
.map((row,index) => (
          <TableRow key={row.id}>
              <TableCell>{index+1}</TableCell>
            <TableCell>{row.fileName}</TableCell>
            <TableCell>{row.extension}</TableCell>
            <TableCell> <Tooltip title="View">
            <a
            href={`${urls.CFCURL}/file/preview?filePath=${row.filePath}`}
            target='__blank'
          >
              <IconButton>               
                <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
              </IconButton>
                  </a>
            </Tooltip></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

{/* get remark code start*/}
{
  dataSource && dataSource.applicationStatus==="APPROVE_BY_COMMISSIONER" && <>
  <h1 style={{marginTop:"20px"}}>Remarks</h1>
  <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="deputyEngineerRemark"
                  name="deputyEngineerRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Deputy Engineer Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("deputyEngineerRemark")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("deputyEngineerRemark") ? true : false,
                  }}                   
                  error={!!errors.deputyEngineerRemark}
                  helperText={errors?.deputyEngineerRemark ? errors.deputyEngineerRemark.message : null}
                />              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="excutiveEngineerRemark"
                  name="excutiveEngineerRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Excutive Engineer Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("excutiveEngineerRemark")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("excutiveEngineerRemark") ? true : false,
                  }}                   
                  error={!!errors.excutiveEngineerRemark}
                  helperText={errors?.excutiveEngineerRemark ? errors.excutiveEngineerRemark.message : null}
                />              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="additionalCityEngineerRemark"
                  name="additionalCityEngineerRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Additional City Engineer Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("additionalCityEngineerRemark")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("additionalCityEngineerRemark") ? true : false,
                  }}                   
                  error={!!errors.additionalCityEngineerRemark}
                  helperText={errors?.additionalCityEngineerRemark ? errors.additionalCityEngineerRemark.message : null}
                /> 
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="additionalCommissionerRemark"
                  name="additionalCommissionerRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Additional Commissioner Engineer Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("additionalCommissionerRemark")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("additionalCommissionerRemark") ? true : false,
                  }}                   
                  error={!!errors.additionalCommissionerRemark}
                  helperText={errors?.additionalCommissionerRemark ? errors.additionalCommissionerRemark.message : null}
                /> 
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="commissionerRemark"
                  name="commissionerRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Additional City Engineer Remark "
                  // variant="outlined"
                  variant="standard"
                  value={watch("commissionerRemark")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("commissionerRemark") ? true : false,
                  }}                   
                  error={!!errors.commissionerRemark}
                  helperText={errors?.commissionerRemark ? errors.commissionerRemark.message : null}
                /> 
              </Grid>
              
              </Grid>
              <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
                border:"solid 2px black",
                marginTop:"20px"
              }}
            >
              {/* ////////////////////////////////////////// */}
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
                <FormControl xs={12}
                  sm={6}
                  md={4} error={!!errors.wardId}>
                  <InputLabel>chargeTypeName</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        variant="standard"
                      >

                        <MenuItem value={"chargeTypeName1"}>chargeTypeName1</MenuItem>
                        <MenuItem value={"chargeTypeName2"}>chargeTypeName2</MenuItem>
                        <MenuItem value={"chargeTypeName3"}>chargeTypeName3</MenuItem>
                        <MenuItem value={"chargeTypeName4"}>chargeTypeName4</MenuItem>
                      </Select>
                    )}
                    name="chargeTypeName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.chargeTypeName ? errors.chargeTypeName.message : null}</FormHelperText>
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
              > <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  label={<FormattedLabel id="amount" />}
                  // variant="outlined"
                  variant="standard"
                  {...register("amount")}
                  error={!!errors.amount}
                  helperText={errors?.amount ? errors.amount.message : null}
                /></Grid>
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
              > <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  label={<FormattedLabel id="totalAmount" />}
                  // variant="outlined"
                  variant="standard"
                  {...register("totalAmount")}
                  error={!!errors.totalAmount}
                  helperText={errors?.totalAmount ? errors.totalAmount.message : null}
                /></Grid>
            </Grid>
              
  
  </>
}
{/* get remark code end*/}
            <hr/>

           {
           dataSource && dataSource.applicationStatus=== "APPLICATION_CREATED" &&
              <> <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl xs={12}
                  sm={6}
                  md={6} 
                 >
                  <InputLabel>Action</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={actionJE}
                        onChange={(e) => setactionJE(e.target.value)}
                        variant="standard"
                      >

                        <MenuItem value={"REVERT"}>REVERT</MenuItem>
                        <MenuItem value={"REJECT"}>REJECT</MenuItem>
                        <MenuItem value={"APPROVE"}>APPROVE</MenuItem>
                      </Select>
                    )}
                    name="action"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.action ? errors.action.message : null}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                  <TextField
                  autoFocus
                  id="remark"
                  name="remark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark"
                  // variant="outlined"
                  variant="standard"
                 
                        onChange={(e) => setremarkJE(e.target.value)}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}
                />

              </Grid>
              </Grid></>

           }

            <Grid
              container
              
              xs={8}
                sm={8}
                md={8}
              mdOffset={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {dataSource && dataSource.applicationStatus === "APPLICATION_CREATED" && <Grid item>
                <Button type="submit" variant="outlined">
                  Save
                </Button>
              </Grid>}
              {
                dataSource && dataSource.applicationStatus === "APPROVE_BY_COMMISSIONER" && <Grid item>
                <Button  variant="outlined" onClick={generateLOI}>
                  Generate LOI
                </Button>
              </Grid>
              }
              
            </Grid>
            {/* //////////////////////////////////// */}
          </form>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
