import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Paper,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Input,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

import schema from "../../../../containers/schema/fireBrigadeSystem/occuranceRegisterTransaction";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useSelector } from "react-redux";
import { TimePicker } from "@mui/x-date-pickers";
import UploadButton from "../../../../components/fireBrigadeSystem/UploadButton";

const Form = () => {
  // const language = useSelector((state) => state?.labels.language);

  // Exit button Routing
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [vardiTypes, setVardiTypes] = useState();
  const [fireStation, setfireStation] = useState();
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState([]);
  const [showVardiOther, setShowVardiOther] = useState([]);
  // Fetch User From cfc User (Optional)
  const [userLst, setUserLst] = useState([]);

  // useEffect(() => {
  //   getUser();
  //   getVardiTypes();
  //   getFireStationName();
  // }, []);

  // get employee from cfc
  // const getUser = () => {
  //   axios.get(`${urls.CFCURL}/master/user/getAll`).then((res) => {
  //     setUserLst(res?.data);
  //   });
  // };

  // get fire station name
  // const getFireStationName = () => {
  //   axios
  //     .get(
  //       `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`
  //     )
  //     .then((res) => {
  //       console.log("resss", res.data);
  //       setfireStation(res?.data);
  //     });
  // };

  // get Vardi Types
  // const getVardiTypes = () => {
  //   axios
  //     .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`)
  //     .then((res) => {
  //       setVardiTypes(res?.data);
  //     });
  // };

  const onSubmitForm = (fromData) => {
    const finalBody = {
      ...fromData,
      dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
        "YYYY-DD-MMThh:mm:ss"
      ),
    };

    axios
      .post(`${urls.FbsURL}/transaction/trnOccuranceRegister/save`, finalBody)
      .then((res) => {
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          // setButtonInputState(false);
          // setIsOpenCollapse(false);
          // setFetchData(tempData);

          router.back();
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);
        }
      });
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("hello", router.query.informerName);
      setBtnSaveText("Update");
      reset(router.query);
    }
  }, []);

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {};

  // View
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
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname:
                        "/FireBrigadeSystem/transactions/occuranceBookEntry",
                    })
                  }
                />
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
                {/* {btnSaveText == "Update" ? (
                  <FormattedLabel id="emergencyServicesUpdate" />
                ) : (
                  <FormattedLabel id="emergencyServices" />
                )} */}
                <FormattedLabel id="occuranceBookEntry" />
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
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "5px",
                        paddingLeft: 10,
                      }}
                    >
                      {<FormattedLabel id="occurrenceBookEntry" />}
                      {/* Occurrence Book Entry */}
                    </h3>
                  </div>
                </div>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="occuranceNo" />}
                      // label="Occurance No "
                      variant="standard"
                      {...register("informerName")}
                      error={!!errors.informerName}
                      helperText={
                        errors?.informerName
                          ? errors.informerName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      style={{ marginTop: 10 }}
                      error={!!errors.dateAndTimeOfVardi}
                    >
                      <Controller
                        control={control}
                        defaultValue={moment().format("YYYY-DD-MMThh:mm:ss")}
                        // name="dateAndTimeOfVardi"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              // label="Date Of Incident *"
                              label={<FormattedLabel id="dateOfIncident" />}
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-DD-MM hh:mm:ss")
                                )
                              }
                              //selected={field.value}
                              renderInput={(params) => (
                                <TextField size="small" {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.DateOfIncident
                          ? errors.DateOfIncident.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      style={{ marginTop: 10 }}
                      error={!!errors.vardiDispatchTime}
                    >
                      <Controller
                        control={control}
                        name="vehicleDispatchTime"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                              // label="Time Of Incident *"
                              label={<FormattedLabel id="timeOfIncident" />}
                              value={field.value}
                              onChange={(time) => field.onChange(time)}
                              selected={field.value}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.TimeOfIncident
                          ? errors.TimeOfIncident.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="Occurance Details *"
                      label={<FormattedLabel id="occuranceDetails" />}
                      variant="standard"
                      {...register("informerNameMr")}
                      error={!!errors.OccuranceDetails}
                      helperText={
                        errors?.OccuranceDetails
                          ? errors.OccuranceDetails.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="Informer Details *"
                      label={<FormattedLabel id="informerDetails" />}
                      variant="standard"
                      {...register("informerDetails")}
                      error={!!errors.informerDetails}
                      helperText={
                        errors?.informerDetails
                          ? errors.informerDetails.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="Address of Informer *"
                      label={<FormattedLabel id="addressOfInformer" />}
                      variant="standard"
                      {...register("informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="Incidance took Place *"
                      label={<FormattedLabel id="incidanceTookPlace" />}
                      variant="standard"
                      {...register("informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="Damage Details *"
                      label={<FormattedLabel id="damageDetails" />}
                      variant="standard"
                      {...register("informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl>
                      {/* <FormLabel id="demo-radio-buttons-group-label">
                        Occurance Within PCMC Area *
                      </FormLabel> */}
                      <FormattedLabel id="occurancePcmcArea" />
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      type={"number"}
                      id="standard-basic"
                      // label="Charges if Outside PCMC *"
                      label={<FormattedLabel id="chargesIfOutsidePCMC" />}
                      variant="standard"
                      {...register("informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="Details Description of incident Site *"
                      label={<FormattedLabel id="detailsOfIncidentSite" />}
                      variant="standard"
                      {...register("informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      id="standard-basic"
                      // label="Remark *"
                      label={<FormattedLabel id="remark" />}
                      variant="standard"
                      {...register("informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    {/* <Typography>Upload Images *</Typography> */}
                    <FormattedLabel id="uploadImages" />
                    <UploadButton
                      Change={(e) => {
                        handleFile1(e, "documentsUpload");
                      }}
                      {...register("documentsUpload")}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={5}
                    style={{ marginLeft: "-2rem" }}
                    className={styles.feildres}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="geoLocation" />}
                      variant="standard"
                      // {...register("gISLocation")}
                      // error={!!errors.gISLocation}
                      // helperText={
                      //   errors?.gISLocation
                      //     ? errors.gISLocation.message
                      //     : null
                      // }
                    />
                  </Grid>
                  <Grid item xs={3} className={styles.feildres}></Grid>
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
                      {btnSaveText == "Update" ? (
                        "Update"
                      ) : (
                        <FormattedLabel id="save" />
                      )}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      {<FormattedLabel id="clear" />}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<ExitToAppIcon />}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/FireBrigadeSystem/transactions/occuranceRegister",
                        })
                      }
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default Form;
