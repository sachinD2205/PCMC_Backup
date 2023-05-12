import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Checkbox,
  ListItemText,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import schema from "../../../../containers/schema/fireBrigadeSystem/emergencyServiceTransaction";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../../URLS/urls";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import FormattedLabel from "../../../../containers/FB_ReusableComponent/reusableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import moment from "moment";

function getStyles(name, personName2, theme) {
  return {
    fontWeight:
      personName2.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Form = () => {
  const [personName2, setPersonName2] = React.useState([]);
  const [personName3, setPersonName3] = React.useState([]);

  const handleChange3 = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName3(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChange2 = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName2(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const theme = useTheme();

  const language = useSelector((state) => state?.labels.language);

  const token = useSelector((state) => state.user.user.token);

  // Exit button Routing
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [vardiTypes, setVardiTypes] = useState();
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState(null);
  const [showVardiOther, setShowVardiOther] = useState([]);
  // Fetch User From cfc User (Optional)
  const [userLst, setUserLst] = useState([]);

  useEffect(() => {
    getUser();
    getVardiTypes();
    getFireStationName();
    getPinCode();
    getSubVardiTypes();
  }, []);

  // get employee from cfc
  const getUser = () => {
    axios.get(`${urls.CFCURL}/master/user/getAll`).then((res) => {
      setUserLst(res?.data?.user);
    });
  };

  // const getById = (appId) => {
  //   axios
  //     .get(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${appId}`
  //     )
  //     .then((res) => {
  //       // setValue("typeOfVardiId", res?.data?.typeOfVardiId);
  //       // reset(res.data.vardiSlip);
  //       setValue("id", res.data.id);
  //     });
  // };

  const [fireStation, setfireStation] = useState();

  // get fire station name
  const getFireStationName = () => {
    axios
      .get(
        `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`
      )
      .then((res) => {
        console.log("resss", res.data);
        setfireStation(res?.data);
      });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`)
      .then((res) => {
        console.log("vardi", res?.data);
        setVardiTypes(res?.data);
      });
  };

  const [subVardiType, setSubVardiType] = useState();

  // transaction/subTypeOfVardi/getSubTypeOfVardiMasterData
  // get Vardi Types
  const getSubVardiTypes = () => {
    axios
      .get(
        `${urls.FbsURL}/transaction/subTypeOfVardi/getSubTypeOfVardiMasterData`
      )
      .then((res) => {
        console.log("sub", res?.data);
        setSubVardiType(res?.data);
      });
  };

  console.log("showVardiOther", showVardiOther);

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);

    const finalBody = {
      // ...fromData,
      id: router?.query?.id ? router.query.id : null,
      role: "CREATE_APPLICATION",
      desg: "DEPT_CLERK",
      pageMode: router.query.id ? null : "DRAFT",

      dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
        "YYYY-MM-DDThh:mm:ss"
      ),
      vardiSlip: {
        ...fromData,
        id: router?.query?.vardiTypeId ? router.query.vardiTypeId : null,

        fireStationName: personName3
          .map((r) => fireStation.find((fire) => fire.fireStationName == r)?.id)
          .toString(),

        employeeName: personName2
          .map(
            (r) =>
              userLst.find(
                (user) =>
                  user.firstNameEn +
                    " " +
                    user.middleNameEn +
                    " " +
                    user.lastNameEn ==
                  r
              )?.id
          )
          .toString(),
      },
    };
    axios
      .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Application Updated")
            : // : swal("Application Created Successfully !",  icon: "success",);
              swal({
                title: "Application Created Successfully",
                text: "application send to the sub fire officer",
                icon: "success",
                button: "Ok",
              });
          router.back();
        }
      });
  };

  const [crPincodes, setCrPinCodes] = useState();

  // fetch pin code from cfc
  const getPinCode = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`)
      .then((res) => {
        console.log("pin", res?.data?.pinCode);
        setCrPinCodes(res?.data?.pinCode);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("hello", router.query.typeOfVardiId);

      setBtnSaveText("Update");

      reset(router.query);

      setSlipHandedOverTo(router.query.slipHandedOverTo);

      setPersonName3(
        typeof router.query.fireStationName === "string"
          ? router.query.fireStationName.split(",")
          : router.query.fireStationName
        // typeof router.query.fireStationName === "string"
        //   ? router.query.fireStationName
        //
        //       // .split(",")
        //       .map(
        //         (rec) =>
        //           fireStation?.find((fire) => fire.id == rec)?.fireStationName
        //       )
        //   : value
      );

      setPersonName2(
        typeof router.query.employeeName === "string"
          ? router.query.employeeName.split(",")
          : router.query.employeeName
      );

      // setValue("id", res.data.id);
      // getById(router.query.id);
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
  const resetValuesCancell = {
    informerName: "",
    informerNameMr: "",
    informerMiddleName: "",
    informerMiddleNameMr: "",
    informerLastName: "",
    informerLastNameMr: "",
    roadName: "",
    area: "",
    areaMr: "",
    city: "",
    cityMr: "",
    mailID: "",
    contactNumber: "",
    vardiPlace: "",
    vardiPlaceMr: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    slipHandedOverToMr: "",
    landmark: "",
    landmarkMr: "",
    vardiReceivedName: "",
    // dateAndTimeOfVardi: "",
    documentsUpload: "",
    fireStationName: "",
    otherVardiType: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    informerName: "",
    informerMiddleName: "",
    informerLastName: "",
    roadName: "",
    area: "",
    city: "",
    contactNumber: "",
    vardiPlace: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    landmark: "",
    vardiReceivedName: "",
    // dateAndTimeOfVardi: "",
    documentsUpload: "",
    mailID: "",
    fireStationName: "",
  };

  let documentsUpload = null;

  let appName = "FBS";
  let serviceName = "M-MBR";
  let applicationFrom = "Web";

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
          <AppBar position='static' sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant='dense'>
              <IconButton
                edge='start'
                color='inherit'
                aria-label='menu'
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname:
                        "/FireBrigadeSystem/transactions/emergencyService",
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
                {btnSaveText == "Update" ? (
                  <FormattedLabel id='emergencyServicesUpdate' />
                ) : (
                  <FormattedLabel id='emergencyServices' />
                )}
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
                {/* <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "5px",
                        paddingLeft: 10,
                      }}
                    >
                      {<FormattedLabel id="informerDetails" />}
                    </h3>
                  </div>
                </div> */}
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id='informerDetails' />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerName' />}
                      variant='standard'
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
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerMiddleName' />}
                      variant='standard'
                      {...register("informerMiddleName")}
                      error={!!errors.informerMiddleName}
                      helperText={
                        errors?.informerMiddleName
                          ? errors.informerMiddleName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerLastName' />}
                      variant='standard'
                      {...register("informerLastName")}
                      error={!!errors.informerLastName}
                      helperText={
                        errors?.informerLastName
                          ? errors.informerLastName.message
                          : null
                      }
                    />
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerNameMr' />}
                      variant='standard'
                      {...register("informerNameMr")}
                      error={!!errors.informerNameMr}
                      helperText={
                        errors?.informerNameMr
                          ? errors.informerNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerMiddleNameMr' />}
                      variant='standard'
                      {...register("informerMiddleNameMr")}
                      error={!!errors.informerMiddleNameMr}
                      helperText={
                        errors?.informerMiddleNameMr
                          ? errors.informerMiddleNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerLastNameMr' />}
                      variant='standard'
                      {...register("informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='area' />}
                      variant='standard'
                      {...register("area")}
                      error={!!errors.area}
                      helperText={errors?.area ? errors.area.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='city' />}
                      incode
                      variant='standard'
                      {...register("city")}
                      error={!!errors.city}
                      helperText={errors?.city ? errors.city.message : null}
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    {/* <FormControl
                      variant="standard"
                      sx={{ width: "80%" }}
                      error={!!errors.crPincode}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="pincode" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="pincode" />}
                          >
                            {crPincodes &&
                              crPincodes.map((crPincode, index) => (
                                <MenuItem key={index} value={crPincode.id}>
                                  {crPincode.pinCode}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="pinCode"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.pinCode ? errors.pinCode.message : null}
                      </FormHelperText>
                    </FormControl> */}
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='email' />}
                      variant='standard'
                      {...register("mailID")}
                      error={!!errors.mailID}
                      helperText={errors?.mailID ? errors.mailID.message : null}
                    />
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='areaMr' />}
                      variant='standard'
                      {...register("areaMr")}
                      error={!!errors.areaMr}
                      helperText={errors?.areaMr ? errors.areaMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='cityMr' />}
                      variant='standard'
                      {...register("cityMr")}
                      error={!!errors.cityMr}
                      helperText={errors?.cityMr ? errors.cityMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='contactNumber' />}
                      variant='standard'
                      {...register("contactNumber")}
                      error={!!errors.contactNumber}
                      helperText={
                        errors?.contactNumber
                          ? errors.contactNumber.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id='vardiDetails' />}
                  </Box>
                </Box>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='occurancePlace' />}
                      variant='standard'
                      {...register("vardiPlace")}
                      error={!!errors.vardiPlace}
                      helperText={
                        errors?.vardiPlace ? errors.vardiPlace.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='landmark' />}
                      variant='standard'
                      {...register("landmark")}
                      error={!!errors.landmark}
                      helperText={
                        errors?.landmark ? errors.landmark.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ width: "58%" }}
                      style={{ marginTop: 10 }}
                      error={!!errors.dateAndTimeOfVardi}
                    >
                      <Controller
                        control={control}
                        // defaultValue={moment(dateAndTimeOfVardi).format(
                        //   "YYYY-DD-MMThh:mm:ss"
                        // )}
                        name="dateAndTimeOfVardi"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              readOnly
                              label={<FormattedLabel id="dateAndTimeOfVardi" />}
                              value={field.value}
                              // onChange={(date) =>
                              //   field.onChange(
                              //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                              //   )
                              // }
                              //selected={field.value}
                              renderInput={(params) => (
                                <TextField                      sx={{ width: "80%" }}
 size="small" {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.dateAndTimeOfVardi
                          ? errors.dateAndTimeOfVardi.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='occurancePlaceMr' />}
                      variant='standard'
                      {...register("vardiPlaceMr")}
                      error={!!errors.vardiPlaceMr}
                      helperText={
                        errors?.vardiPlaceMr
                          ? errors.vardiPlaceMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='landmarkMr' />}
                      variant='standard'
                      {...register("landmarkMr")}
                      error={!!errors.landmarkMr}
                      helperText={
                        errors?.landmarkMr ? errors.landmarkMr.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                {/* Fetch User From cfc User (Optional)*/}
                {/* <div>
                      <FormControl
                        variant="standard"
                             sx={{ minWidth: "70%" }}
                        error={!!errors.typeOfVardiId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="slipHandedOverTo" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="slipHandedOverTo" />}
                            >
                              {userLst &&
                                userLst.map((user, index) => (
                                  <MenuItem key={index} value={user.firstName}>
                                    {user.firstName +
                                      " " +
                                      (typeof user.middleName === "string"
                                        ? user.middleName + " "
                                        : " ") +
                                      user.lastName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="slipHandedOverTo"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.slipHandedOverTo
                            ? errors.slipHandedOverTo.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div> */}

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ minWidth: "80%" }}
                      variant='standard'
                      error={!!errors.typeOfVardiId}
                    >
                      <InputLabel
                        variant='standard'
                        id='demo-simple-select-standard-label'
                      >
                        <FormattedLabel id='typeOfVardi' />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              setShowVardiOther(value.target.value);
                            }}
                            label='Type of Vardi'
                          >
                            <MenuItem value=''>
                              <em>None</em>
                            </MenuItem>
                            {vardiTypes &&
                              vardiTypes.map((vardi, index) => (
                                <MenuItem key={index} value={vardi.id}>
                                  {language == "en"
                                    ? vardi.vardiName
                                    : vardi.vardiNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name='typeOfVardiId'
                        control={control}
                        defaultValue=''
                      />
                      <FormHelperText>
                        {errors?.typeOfVardiId
                          ? errors.typeOfVardiId.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {showVardiOther === 14 ? (
                    <>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id='standard-basic'
                          label={<FormattedLabel id='otherVardiType' />}
                          variant='standard'
                          {...register("otherVardiType")}
                          error={!!errors.otherVardiType}
                          helperText={
                            errors?.otherVardiType
                              ? errors.otherVardiType.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={4} className={styles.feildres}>
                        {/* <FormControl
                      sx={{ minWidth: "80%" }}
                      variant="standard"
                      error={!!errors.typeOfVardiId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="subTypesOfVardi" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              // setShowVardiOther(value.target.value);
                            }}
                            label="Sub Type Of Vardi"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {subVardiType &&
                              subVardiType
                                .filter((u) => u.vardiTypeId == showVardiOther)
                                .map((vardi, index) => (
                                  <MenuItem key={index} value={vardi.id}>
                                    {language == "en"
                                      ? vardi.subVardiName
                                      : vardi.subVardiNameMr}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                        name="subTypeOfVardi"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.typeOfVardiId
                          ? errors.typeOfVardiId.message
                          : null}
                      </FormHelperText>
                    </FormControl> */}
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  )}
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      variant='standard'
                      sx={{ minWidth: "80%" }}
                      error={!!errors.slipHandedOverTo}
                    >
                      <InputLabel id='demo-simple-select-standard-label'>
                        {<FormattedLabel id='slipHandedOverToEmp' />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              setSlipHandedOverTo(value.target.value);
                            }}
                            // onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id='slipHandedOverToEmp' />}
                          >
                            {[
                              { id: 1, menuNameEng: "Yes" },
                              { id: 2, menuNameEng: "No" },
                            ].map((menu, index) => {
                              return (
                                <MenuItem key={index} value={menu.id}>
                                  {menu.menuNameEng}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                        name='slipHandedOverTo'
                        control={control}
                        defaultValue=''
                      />
                      <FormHelperText>
                        {errors?.slipHandedOverTo
                          ? errors.slipHandedOverTo.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {SlipHandedOverTo == 1 ? (
                    <>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <InputLabel id='demo-multiple-chip-label'>
                            Fire Station
                          </InputLabel>
                          <Select
                            labelId='demo-multiple-chip-label'
                            id='demo-multiple-chip'
                            multiple
                            value={personName3}
                            onChange={handleChange3}
                            // onChange={(value) => {
                            //   handleChange3;
                            //   setCrew(value.target.value);
                            //   console.log("bbb", value.target.value);
                            // }}
                            input={
                              <OutlinedInput
                                id='select-multiple-chip'
                                label='Fire Station'
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    sx={{ backgroundColor: "#AFDBEE" }}
                                    key={value}
                                    label={value}
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {fireStation?.map((user, index) => (
                              <MenuItem
                                // key={name}
                                // value={name}
                                key={index}
                                value={
                                  // user.id
                                  user.fireStationName
                                  // language === "en"
                                  //   ? crew.crewName
                                  //   : crew.crewNameMr
                                }
                                style={getStyles(user, personName3, theme)}
                              >
                                <Checkbox
                                  checked={
                                    personName3.indexOf(user.fireStationName) >
                                    -1
                                  }
                                />
                                <ListItemText primary={user.fireStationName} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <InputLabel
                            variant='standard'
                            id='demo-multiple-chip-label'
                          >
                            Employee Name
                          </InputLabel>

                          <Select
                            labelId='demo-multiple-chip-label'
                            id='demo-multiple-chip'
                            multiple
                            value={personName2}
                            onChange={handleChange2}
                            // onChange={(value) => {
                            //   handleChange3;
                            //   setCrew(value.target.value);
                            //   console.log("bbb", value.target.value);
                            // }}
                            input={
                              <OutlinedInput
                                id='select-multiple-chip'
                                label='Employee Name'
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    sx={{ backgroundColor: "#AFDBEE" }}
                                    key={value}
                                    label={value}
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {userLst?.map((user, index) => (
                              <MenuItem
                                // key={name}
                                // value={name}
                                key={index}
                                value={
                                  // user.id
                                  user.firstNameEn +
                                  " " +
                                  user.middleNameEn +
                                  " " +
                                  user.lastNameEn
                                }
                                style={getStyles(user, personName2, theme)}
                              >
                                <Checkbox
                                  checked={
                                    personName2.indexOf(
                                      user.firstNameEn +
                                        " " +
                                        user.middleNameEn +
                                        " " +
                                        user.lastNameEn
                                    ) > -1
                                  }
                                />
                                <ListItemText
                                  primary={
                                    (typeof user?.firstNameEn === "string" &&
                                      user.firstNameEn) +
                                    " " +
                                    (typeof user?.middleNameEn === "string"
                                      ? user.middleNameEn
                                      : " ") +
                                    " " +
                                    (typeof user?.lastNameEn === "string" &&
                                      user.lastNameEn)
                                  }
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  )}
                </Grid>
                <br />
                <br />

                <Grid container className={styles.feildres} spacing={2}>
                  <Grid item>
                    <Button
                      type='submit'
                      size='small'
                      variant='outlined'
                      className={styles.button}
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText == "Update" ? (
                        "Update"
                      ) : (
                        <FormattedLabel id='save' />
                      )}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size='small'
                      variant='outlined'
                      className={styles.button}
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      {<FormattedLabel id='clear' />}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size='small'
                      variant='outlined'
                      className={styles.button}
                      endIcon={<ExitToAppIcon />}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/FireBrigadeSystem/transactions/emergencyService",
                        })
                      }
                    >
                      {<FormattedLabel id='exit' />}
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
