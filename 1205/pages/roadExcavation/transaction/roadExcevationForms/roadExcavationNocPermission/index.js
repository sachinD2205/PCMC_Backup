import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useState } from "react";
import theme from "../../../../../theme";
import * as yup from "yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { yupResolver } from "@hookform/resolvers/yup";

import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { roadExcavationCitizenSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import FileTable from "../../../../../components/roadExcevation/FileUpload/FileTable"

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
  const language = useSelector((store) => store.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);
  //upload states
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  // const [authorizedToUpload, setAuthorizedToUpload] = useState(false);

  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
      //   width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      flex: 1,
      // width: 140,
    },
    // language == "en"
    //   ? {
    //       headerName: "Uploaded By",
    //       field: "attachedNameEn",
    //       flex: 2,
    //       // width: 300,
    //     }
    //   : {
    //       headerName: "द्वारे अपलोड केले",
    //       field: "attachedNameMr",
    //       flex: 2,
    //       // width: 300,
    //     },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,
      // width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`, "_blank");
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("finalFiles", finalFiles);
  }, [finalFiles]);
  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  // const authority = user?.menus?.find((r) => {
  //   return r.id == selectedMenuFromDrawer;
  // })?.roles;

  // console.log("authority", authority);

  // let juniorEngineer = authority && authority.find((val) => val === "JUNIOR_ENGINEER")
  // let deputyEngineer = authority && authority.find((val) => val === "DEPUTY_ENGINEER")
  // let executiveEngineer = authority && authority.find((val) => val === "EXECUTIVE_ENGINEER")

  // console.log("juniorEngineer", juniorEngineer);
  // console.log("deputyEngineer", deputyEngineer);
  // console.log("executiveEngineer", executiveEngineer);

  //clear

  const [btnSaveText, setbtnSaveText] = useState("Save");
  const clearButton = () => {
    console.log("clear");
    reset({
      ...resetValuesClear,
    });
  };

  // Reset Values Clear
  const resetValuesClear = {
    companyName: "",
    roadType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    landlineNo: "",
    mobileNo: "",
    email: "",
    eligibleForSchemeYn: "",
    mainScheme: "",
    subScheme: "",
    permitPeriod: "",
    scopeOfWork: "",
    startLat: "",
    endLat: "",
    startLng: "",
    endLng: "",
    locationSameAsPcmcOrderYn: "",
    locationRemark: "",
    lengthSameAsPcmcOrderYn: "",
    lengthRemark: "",
    depthSameAsPcmcOrderYn: "",
    depthRemark: "",
    widthSameAsPcmcOrderYn: "",
    widthRemark: "",
  };

  const handleUploadDocument = (path) => {
    console.log("handleUploadDocument", path);
    let temp = {
      documentPath: path,
      documentKey: 1,
      documentType: "",
      remark: "",
    };
    setDoc(temp);
  };

  let onSubmitFunc = (formData) => {
    console.log("onSubmitFunc", formData);
    console.log("onSubmitFunc", attachedFile);
    let body={
      ...formData,
      fileAttachementDao:finalFiles       
    }
    if (btnSaveText === "Save") {
      if (loggedInUser === "citizenUser") {
        const tempData = axios
          .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/save`, body, {
            headers: {
              UserId: user.id,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              sweetAlert("Saved!", "Road Excevation Application Saved successfully !", "success");
              // router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
            }
          });
      } else {
        const tempData = axios
          .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/save`, body, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              sweetAlert("Saved!", "Road Excevation Application Saved successfully !", "success");
              // router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
            }
          });
      }
    }
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
              {/* <Grid
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
                // variant="outlined"
                variant="standard"
                {...register("applicationNumber")}
                error={!!errors.applicationNumber}
                helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
              />
            </Grid> */}
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
                  {...register("companyName")}
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
                  {...register("firstName")}
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
                  {...register("middleName")}
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
                  {...register("lastName")}
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
                  {...register("landlineNo")}
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
                  {...register("mobileNo")}
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
                  {...register("emailAddress")}
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
                  {...register("mainScheme")}
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
                  {...register("subScheme")}
                  error={!!errors.subScheme}
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
                  {...register("permitPeriod")}
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
                  {...register("scopeOfWork")}
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
                  {...register("startLat")}
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
                  {...register("endLat")}
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
                  {...register("startLng")}
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
                  {...register("endLng")}
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
                  {...register("locationRemark")}
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
                  id="lengthRemark"
                  name="lengthRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  {...register("lengthRemark")}
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
                  id="depthRemark"
                  name="depthRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  {...register("depthRemark")}
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
                  id="widthRemark"
                  name="widthRemark"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  {...register("widthRemark")}
                  error={!!errors.widthRemark}
                  helperText={errors?.widthRemark ? errors.widthRemark.message : null}
                />
              </Grid>
            </Grid>
                  {/* file upload */}
                 
                <Grid container spacing={2} >
                  <Grid item>
                    <Typography
                      sx={{
                        marginTop: "10px",
                      }}
                    >
                      <h2>Required Documents</h2>
                    </Typography>
                  </Grid>
                  <Grid item>
                   
                  </Grid>
                </Grid>

                  <Grid item xs={12}>
                    <FileTable
                      appName="ROAD" //Module Name
                      serviceName={"R-NOC"} //Transaction Name
                      fileName={attachedFile} //State to attach file
                      filePath={setAttachedFile} // File state upadtion function
                      newFilesFn={setAdditionalFiles} // File data function
                      columns={_columns} //columns for the table
                      rows={finalFiles} //state to be displayed in table
                      uploading={setUploading}
                      // authorizedToUpload={authorizedToUpload}
                      />
                  </Grid>

            <Grid
              container
              xs
              md={6}
              mdOffset={3}
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid item>
                <Button type="submit" variant="outlined">
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={clearButton}>
                  Clear
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined">Exit</Button>
              </Grid>
            </Grid>
            {/* //////////////////////////////////// */}
          </form>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
