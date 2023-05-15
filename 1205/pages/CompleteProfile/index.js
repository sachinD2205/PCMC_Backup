import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import urls from "../../URLS/urls";
import schema from "../../containers/schema/common/CompleteProfileSchema";
import { login, setMenu, setUsersCitizenDashboardData } from "../../features/userSlice";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../../styles/cfc/cfc.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const CompleteProfile = () => {
  const router = useRouter();

  // const [hintQuestion, setHintQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [emailChecked, setEmailChecked] = useState(true);
  const [resendOTP, setResendOTP] = useState(false);
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [titleNames, setTitleNames] = useState([]);
  const [genderNames, setGenderNames] = useState([]);
  const language = useSelector((state) => state?.labels.language);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const user = useSelector((state) => {
    return state.user.user;
  });

  const dispatch = useDispatch();

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [audienceSample, setAudienceSample] = useState(user);

  // CheckBox Value
  const [isPermanentAddressSame, setIsPermanentAddressSame] = useState(false);

  // const resetValuesExit = {
  //   cBuildingNo: "",
  //   cBuildingNoMr: "",
  //   cBuildingName: "",
  //   cBuildingNameMr: "",
  //   cRoadName: "",
  //   cLandmark: "",
  //   cState: "",
  //   cCity: "",
  //   cPinCode: "",
  //   cCityMr: "",
  //   cStateMr: "",
  //   cLandmarkMr: "",
  //   cRoadNameMr: "",
  // };

  // For Checked and UnCheck Checkbox
  const handlePaddressCheck = (e) => {
    console.log("e.target.checked", e.target.checked);
    setIsPermanentAddressSame(e.target.checked);
  };

  // useEffect(() => {
  //   isPermanentAddressSame === false &&
  //     reset({
  //       ...resetValuesExit,
  //     });
  // }, [isPermanentAddressSame]);

  useEffect(() => {
    setAudienceSample(user);
    let _res = audienceSample;
    console.log("_res", _res);

    // reset({..._res})

    setValue("title", _res.title);
    setValue("titleMr", _res.title);
    setValue("firstName", _res.firstName);
    setValue("firstNameMr", _res.firstNamemr);
    setValue("middleName", _res.middleName);
    setValue("middleNameMr", _res.middleNamemr);
    setValue("lastName", _res.surname);
    setValue("lastNameMr", _res.surnamemr);
    setValue("mobileNumber", _res.mobile);
    setValue("email", _res.emailID);
    setValue("gender", _res.gender);
    setValue("dateOfBirth", _res.dateOfBirth);
    setValue("loginId", _res.username);
    // setValue("hintQuestion", questions.find((f) => f.id == _res.hintQuestion)?.question);
    setValue("hintQuestion", _res.hintQuestion);
    setValue("hintQuestionAnswer", _res.answer);
    setValue("cBuildingNo", _res.cflatBuildingNo);
    setValue("cBuildingNoMr", _res.cflatBuildingNoMr);
    setValue("cBuildingName", _res.cbuildingName);
    setValue("cBuildingNameMr", _res.cbuildingNameMr);
    setValue("cRoadName", _res.croadName);
    setValue("cRoadNameMr", _res.croadNameMr);
    setValue("cLandmark", _res.clandmark);
    setValue("cLandmarkMr", _res.clandmarkMr);
    setValue("cCity", _res.ccity);
    setValue("cCityMr", _res.ccityMr);
    setValue("cState", _res.cstate);
    setValue("cStateMr", _res.cstateMr);
    setValue("cPinCode", _res.cpinCode);

    //permanant
    setValue("pBuildingNo", _res.pflatBuildingNo);
    setValue("pBuildingNoMr", _res.pflatBuildingNoMr);
    setValue("pBuildingName", _res.pbuildingName);
    setValue("pBuildingNameMr", _res.pbuildingNameMr);
    setValue("pRoadName", _res.proadName);
    setValue("pRoadNameMr", _res.proadNameMr);
    setValue("pLandmark", _res.plandmark);
    setValue("pLandmarkMr", _res.plandmarkMr);
    setValue("pCity", _res.pcity);
    setValue("pCityMr", _res.pcityMr);
    setValue("pState", _res.pstate);
    setValue("pStateMr", _res.pstateMr);
    setValue("pPinCode", _res.ppincode);
    // setValue("setIsPermanentAddressSame", _res.permanentAddress);
    // setValue("setIsPermanentAddressSame", _res.permanentAddress === "true" ? true : false);

    setIsPermanentAddressSame(_res.permanentAddress);
    // setValue("permanentAddress", _res.hintQuestion);
    // setValue("permanentAddress", _res.hintQuestionAnswer);
  }, [user]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleEmailCheckedChange = (event) => {
    setEmailChecked(event.target.checked);
  };
  // const {
  //   control,
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });

  useEffect(() => {
    getWardNames();
    getZoneName();
    getTitle();
    getGender();
    getQuestions();
  }, []);

  const getQuestions = () => {
    axios.get(`${urls.CfcURLMaster}/question/getAll`).then((r) => {
      console.log("rr", r);
      setQuestions(
        r.data.questionMaster.map((row) => ({
          id: row.id,
          question: row.question,
          questionMar: row.questionMar,
        })),
      );
    });
  };

  const handleSelectChange = (event) => {
    console.log("event");
    setHintQuestion(event.target.value);
  };
  const onGenerateOTPClick = () => {
    console.log("genrate otp");
    setResendOTP(true);
    toast("OTP sent", {
      type: "success",
    });
  };

  const verifyOTP = () => {
    setPhoneNumberVerified(true);
  };

  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      );
    });
  };

  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        })),
      );
    });
  };

  const getTitle = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      console.log("res title", r);
      setTitleNames(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        })),
      );
    });
  };
  const getGender = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      console.log("res title", r);
      setGenderNames(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
        // r?.data?.gender,
      );
    });
  };

  const onFinish = (values) => {
    console.log("values", values);
    const dateBirth = moment(values.dateOfBirth).format("YYYY-MM-DD");
    // const dateBirth = moment(values.dateOfBirth).format("DD-MM-YYYY");

    const body = {
      firstName: values.firstName,
      middleName: values.middleName,
      surname: values.lastName,
      emailID: values.email,
      mobile: values.mobileNumber,
      username: values.loginId,
      password: values.password,
      hintQuestion: values.hintQuestion,
      answer: values.hintQuestionAnswer,
      zone: values.zoneName,
      ward: values.wardName,
      title: values.title,
      titleMr: values.titleMr,
      gender: values.gender,
      cflatBuildingNo: values.cBuildingNo,
      cbuildingName: values.cBuildingName,
      croadName: values.cRoadName,
      clandmark: values.cLandmark,
      cstate: values.cState,
      ccity: values.cCity,
      cpinCode: values.cPinCode,
      firstNamemr: values.firstNameMr,
      middleNamemr: values.middleNameMr,
      surnamemr: values.lastNameMr,
      ccityMr: values.cCityMr,
      cstateMr: values.cStateMr,
      clandmarkMr: values.cLandmarkMr,
      croadNameMr: values.cRoadNameMr,
      cbuildingNameMr: values.cBuildingNameMr,
      cflatBuildingNoMr: values.cBuildingNoMr,
      //permanant Add
      pflatBuildingNo: values.pBuildingNo,
      pbuildingName: values.pBuildingName,
      proadName: values.pRoadName,
      plandmark: values.pLandmark,
      pstate: values.pState,
      pcity: values.pCity,
      ppincode: values.pPinCode,
      pcityMr: values.pCityMr,
      pstateMr: values.pStateMr,
      plandmarkMr: values.pLandmarkMr,
      proadNameMr: values.pRoadNameMr,
      pbuildingNameMr: values.pBuildingNameMr,
      pflatBuildingNoMr: values.pBuildingNoMr,
      //other
      id: audienceSample.id,
      dateOfBirth: dateBirth,
      permanentAddress: values.isPermanentAddressSame,
    };

    console.log("body", body);

    const headers = { Accept: "application/json" };

    axios
      .post(`${urls.CFCURL}/transaction/citizen/completeProfile`, body, {
        headers,
      })
      .then((_res) => {
        if (_res.status == 200) {
          dispatch(login(_res.data));
          dispatch(setUsersCitizenDashboardData(_res.data));
          dispatch(setMenu(_res.data.menuCodes));
          localStorage.setItem("loggedInUser", "citizenUser");
          router.push("/dashboard");

          toast("Registered Successfully", {
            type: "success",
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast("Registeration Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  useEffect(() => {
    console.log("questions", questions);
  }, [questions]);

  return (
    <form onSubmit={handleSubmit(onFinish)}>
      <Box
        sx={{
          // background: "rgb(252,0,255)",
          background: "linear-gradient(90deg, rgba(252,0,255,1) 0%, rgba(0,219,222,1) 100%)",
          borderRadius: "10px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <IconButton
          sx={{ color: "white" }}
          aria-label="upload picture"
          component="label"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h5" sx={{ color: "white" }}>
            {language == "en" ? "Complete Profile" : "प्रोफाइल पूर्ण करा"}
          </Typography>
        </Box>
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <Accordion sx={{ padding: "10px" }}>
            <AccordionSummary
              sx={{
                background: "linear-gradient(90deg, rgba(194,229,156,1) 0%, rgba(100,179,244,1) 100%)",
                color: "black",
                borderRadius: "10px",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="linear-gradient(to bottom, #33ccff 0%, #ff33cc 100%)"
              // backgroundColor="#0070f3"
              // sx={{
              //   backgroundColor: '0070f3',
              // }}
            >
              <Typography>{<FormattedLabel id="personalInformation" />}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Paper
                sx={{
                  // marginLeft: 3,
                  // marginRight: 3,
                  // marginBottom: 3,
                  paddingTop: 3,
                  backgroundColor: "#F5F5F5",
                }}
                elevation={5}
              >
                <Grid
                  container
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid
                    xs={1}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={!!errors.title}
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="titleEnglish" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            size="small"
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="titleEnglish" />}
                          >
                            {titleNames?.map((title, index) => {
                              return (
                                <MenuItem key={index} value={title.id}>
                                  {title.title}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                        name="title"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.title ? errors.title.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    xs={3}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="firstName" />}
                      variant="outlined"
                      // disabled
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("firstName")}
                      error={errors.firstName}
                      // helperText = {`errors.${field.stateName}.message`}
                      helperText={errors.firstName?.message}
                    />
                  </Grid>

                  <Grid
                    xs={3}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="middleName" />}
                      variant="outlined"
                      // disabled
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      error={errors.middleName}
                      {...register("middleName")}
                      // helperText = {`errors.${field.stateName}.message`}
                      helperText={errors.middleName?.message}
                    />
                  </Grid>

                  <Grid
                    xs={3}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="middleName" />}
                      variant="outlined"
                      // disabled
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("lastName")}
                      error={errors.lastName}
                      // helperText = {`errors.${field.stateName}.message`}
                      helperText={errors.lastName?.message}
                    />
                  </Grid>
                </Grid>
                <br />
                <Grid
                  container
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid
                    item
                    xs={1}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={!!errors.titleMr}
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="titleMarathi" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            size="small"
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="titleMarathi" />}
                          >
                            {titleNames?.map((title, index) => {
                              return (
                                <MenuItem key={index} value={title.id}>
                                  {title.titleMr}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                        name="titleMr"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.titleMr ? errors.titleMr.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    xs={3}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="firstNameMr" />}
                      variant="outlined"
                      // required={field.required}
                      // label={name}
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("firstNameMr")}
                      error={errors.firstNameMr}
                      helperText={errors.firstNameMr?.message}
                      // helperText = {`errors.${field.stateName}.message`}
                    />
                  </Grid>
                  <Grid
                    xs={3}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="middleNameMr" />}
                      variant="outlined"
                      // required={field.required}
                      // label={name}
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      error={errors.middleNameMr}
                      {...register("middleNameMr")}
                      // helperText = {`errors.${field.stateName}.message`}
                      helperText={errors.middleNameMr?.message}
                    />
                  </Grid>
                  <Grid
                    xs={3}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="lastNameMr" />}
                      variant="outlined"
                      // required={field.required}
                      // label={name}
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("lastNameMr")}
                      error={errors.lastNameMr}
                      // helperText = {`errors.${field.stateName}.message`}
                      helperText={errors.lastNameMr?.message}
                    />
                  </Grid>
                </Grid>
                <br />

                <Grid
                  container
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                  py={1}
                >
                  <Grid item xs={1}></Grid>
                  <Grid item xs={3}>
                    {/* <FormControl fullWidth sx={{ width: "100%", backgroundColor: "white" }}>
                      <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="dob" />}
                    </InputLabel>
                      <Controller
                        control={control}
                        name="dateOfBirth"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              // inputFormat="yyyy/MM/dd"
                              label={<FormattedLabel id="dob" />}
                              inputFormat="dd/mm/yyyy"
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(moment(date, "DD-MM-YYYY").format("DD-MM-YYYY"))
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  error={errors?.dateOfBirth ? true : false}
                                  fullWidth
                                  variant="outlined"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.dateOfBirth ? (
                          <span style={{ color: "red" }}>{errors.dateOfBirth.message}</span>
                        ) : null}
                      </FormHelperText>
                    </FormControl> */}
                    <FormControl style={{ backgroundColor: "white" }} error={!!errors.toDate}>
                      <Controller
                        error={errors?.dateOfBirth ? true : false}
                        control={control}
                        name="dateOfBirth"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="dob" />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                // <TextField
                                //   error={errors?.dateOfBirth ? true : false}
                                //   {...params}
                                //   size="small"
                                //   fullWidth
                                //   InputLabelProps={{
                                //     style: {
                                //       fontSize: 12,
                                //       marginTop: 3,
                                //     },
                                //   }}
                                // />
                                <TextField
                                  {...params}
                                  size="small"
                                  error={errors?.dateOfBirth ? true : false}
                                  fullWidth
                                  variant="outlined"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.dateOfBirth ? (
                          <span style={{ color: "red" }}>{errors.dateOfBirth.message}</span>
                        ) : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="outlined" size="small" fullWidth error={!!errors.gender}>
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="gender" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "5px",
                            }}
                            // disabled
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="gender" />}
                          >
                            {genderNames?.map((val, index) => {
                              return (
                                <MenuItem key={index} value={val.id}>
                                  {val.gender}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                        name="gender"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.gender ? errors.gender.message : null}</FormHelperText>
                    </FormControl>
                    {/* <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.religion}
                        >
                          <InputLabel id="demo-simple-select-standard-label">Application On</InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="application"
                              >
                                {application &&
                                  application.map((appId, index) => (
                                    <MenuItem key={index} value={appId.id}>
                                      {lang === "en"
                                        ? applicationId.applicationId
                                        : applicationId.applicationNameEng} 
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="applicationId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.applicationId ? errors.applicationId.message : null}
                          </FormHelperText>
                        </FormControl> */}
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label={<FormattedLabel id="mobileNo" />}
                      variant="outlined"
                      // disabled
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("mobileNumber")}
                      error={errors.mobileNumber}
                      helperText={errors.mobileNumber?.message}
                    />
                  </Grid>
                </Grid>
                <br />
                <Grid
                  container
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                  py={1}
                >
                  <Grid item xs={1}></Grid>
                  <Grid item xs={5}>
                    <TextField
                      label={<FormattedLabel id="email" />}
                      variant="outlined"
                      // disabled
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                        "&.MuiFormHelperText-root.Mui-error": {
                          color: "red",
                        },
                      }}
                      //   onChange={(e) => setUser(e.target.value)}
                      {...register("email")}
                      error={errors.email}
                      helperText={errors.email?.message}
                    />
                    {/* <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={emailChecked}
                      onChange={handleEmailCheckedChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <Typography>Use my email id as login id</Typography>
                  </Box> */}
                  </Grid>

                  <Grid item xs={4.5}></Grid>

                  {/* {!phoneNumberVerified ? (
                  <>
                    <Grid
                      item
                      xs={3}
                      style={{ display: "flex", alignItems: "end" }}
                    >
                      {!resendOTP ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={onGenerateOTPClick}
                          sx={{
                            backgroundColor: "#CAD9E5",
                            color: "black",
                          }}
                          className={styles.button}
                        >
                          GENERATE OTP
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            backgroundColor: "#CAD9E5",
                            color: "black",
                          }}
                          className={styles.button}
                        >
                          RESEND OTP
                        </Button>
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>Verify OTP</Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "5px",
                        }}
                        error={phoneNumberVerified === false}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              onClick={() => {
                                verifyOTP();
                              }}
                            >
                              <IconButton
                                aria-label="toggle password visibility"
                                edge="end"
                              >
                                <ArrowForwardIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid
                    item
                    xs={7}
                    style={{
                      display: "flex",
                      alignItems: "end",
                    }}
                  >
                    <Box
                      p={1}
                      sx={{
                        color: "green",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                        width: "100%",
                      }}
                    >
                      Phone number verified successfully
                    </Box>
                  </Grid>
                )} */}
                </Grid>
                <br />
              </Paper>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ padding: "10px" }}>
            <AccordionSummary
              sx={{
                background: "linear-gradient(90deg, rgba(194,229,156,1) 0%, rgba(100,179,244,1) 100%)",
                color: "black",
                borderRadius: "10px",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              backgroundColor="#0070f3"
              id="panel1a-header"
            >
              <Typography>{<FormattedLabel id="currentAddress" />}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper
                sx={{
                  // marginLeft: 3,
                  // marginRight: 3,
                  // marginBottom: 3,
                  paddingTop: 3,
                  backgroundColor: "#F5F5F5",
                }}
                elevation={5}
              >
                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      size="small"
                      label={<FormattedLabel id="buildingNo" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "white",
                        // width: "80%",
                      }}
                      {...register("cBuildingNo")}
                      helperText={errors.cBuildingNo?.message}
                      error={errors.cBuildingNo}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="buildingName" />}
                      InputLabelProps={{
                        backgroundColor: "white",
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "5px",
                      }}
                      {...register("cBuildingName")}
                      helperText={errors.cBuildingName?.message}
                      error={errors.cBuildingName}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="roadName" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cRoadName")}
                      helperText={errors.cRoadName?.message}
                      error={errors.cRoadName}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="buildingNoMr" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cBuildingNoMr")}
                      helperText={errors.cBuildingNoMr?.message}
                      error={errors.cBuildingNoMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="buildingNameMr" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cBuildingNameMr")}
                      helperText={errors.cBuildingNameMr?.message}
                      error={errors.cBuildingNameMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="roadNameMr" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cRoadNameMr")}
                      helperText={errors.cRoadNameMr?.message}
                      error={errors.cRoadNameMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="landMark" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cLandmark")}
                      helperText={errors.cLandmark?.message}
                      error={errors.cLandmark}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="landMarkMr" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cLandmarkMr")}
                      helperText={errors.cLandmarkMr?.message}
                      error={errors.cLandmarkMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="city" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cCity")}
                      helperText={errors.cCity?.message}
                      error={errors.cCity}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  {" "}
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="cityMr" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cCityMr")}
                      helperText={errors.cCityMr?.message}
                      error={errors.cCityMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="state" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cState")}
                      helperText={errors.cState?.message}
                      error={errors.cState}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="stateMr" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cStateMr")}
                      helperText={errors.cStateMr?.message}
                      error={errors.cStateMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="pinCode" />}
                      InputLabelProps={{
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      type="number"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("cPinCode")}
                      helperText={errors.cPinCode?.message}
                      error={errors.cPinCode}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={4}></Grid>

                  {/* <Grid item xs={3}>
                              <Typography>Landmark(Marathi)</Typography>
                              <TextField
                                InputLabelProps={{
                                  style: { color: '#000000', fontSize: '15px' },
                                }}
                                sx={{
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '5px',
                                }}
                                {...register('landmarkMr')}
                                helperText={errors.landmarkMr?.message}
                                error={errors.landmarkMr}
                                inputProps={{ style: { fontSize: '15px' } }}
                                variant="outlined"
                                fullWidth
                                size="small"
                              />
                            </Grid> */}
                </Grid>
              </Paper>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ padding: "10px" }}>
            <AccordionSummary
              sx={{
                background: "linear-gradient(90deg, rgba(194,229,156,1) 0%, rgba(100,179,244,1) 100%)",
                color: "black",
                borderRadius: "10px",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              backgroundColor="#0070f3"
              id="panel1a-header"
            >
              <Typography>{<FormattedLabel id="permanentAddress" />}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* <Grid container>
                <Grid
                  item
                  xs={1}
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Grid>
                <Grid
                  item
                  xs={10}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography>Same as current address</Typography>
                </Grid>
              </Grid> */}
              <Paper
                sx={{
                  paddingTop: 3,
                  backgroundColor: "#F5F5F5",
                }}
                elevation={5}
              >
                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid item xs={11}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="isPermanentAddressSame"
                          //permanentAddress
                          control={control}
                          render={({ field: props }) => (
                            <Checkbox
                              {...props}
                              // checked={props.value}
                              checked={isPermanentAddressSame}
                              onChange={(e) => {
                                // call function For Checked and UnChecked Checkbox
                                handlePaddressCheck(e);

                                if (e.target.checked) {
                                  //pBuildingNo: cBuildingNo
                                  //pBuildingName:cBuildingName
                                  //////////////////

                                  setValue("pBuildingNo", watch("cBuildingNo") ? watch("cBuildingNo") : "-");
                                  setValue(
                                    "pBuildingNoMr",
                                    watch("cBuildingNoMr") ? watch("cBuildingNoMr") : "-",
                                  );
                                  setValue(
                                    "pBuildingName",
                                    watch("cBuildingName") ? watch("cBuildingName") : "-",
                                  );
                                  setValue(
                                    "pBuildingNameMr",
                                    watch("cBuildingNameMr") ? watch("cBuildingNameMr") : "-",
                                  );
                                  setValue("pRoadName", watch("cRoadName") ? watch("cRoadName") : "-");
                                  setValue("pLandmark", watch("cLandmark") ? watch("cLandmark") : "-");
                                  setValue("pState", watch("cState") ? watch("cState") : "-");
                                  setValue("pCity", watch("cCity") ? watch("cCity") : "-");
                                  setValue("pPinCode", watch("cPinCode") ? watch("cPinCode") : "-");
                                  setValue("pCityMr", watch("cCityMr") ? watch("cCityMr") : "-");
                                  setValue("pStateMr", watch("cStateMr") ? watch("cStateMr") : "-");
                                  setValue("pLandmarkMr", watch("cLandmarkMr") ? watch("cLandmarkMr") : "-");
                                  setValue("pRoadNameMr", watch("cRoadNameMr") ? watch("cRoadNameMr") : "-");
                                } else {
                                  setValue("pBuildingNo", e.target.checked === false && "");
                                  setValue("pBuildingNoMr", e.target.checked === false && "");
                                  setValue("pBuildingName", e.target.checked === false && "");
                                  setValue("pBuildingNoMr", e.target.checked === false && "");
                                  setValue("pBuildingNameMr", e.target.checked === false && "");
                                  setValue("pRoadName", e.target.checked === false && "");
                                  setValue("pLandmark", e.target.checked === false && "");
                                  setValue("pState", e.target.checked === false && "");
                                  setValue("pCity", e.target.checked === false && "");
                                  setValue("pStateMr", e.target.checked === false && "");
                                  setValue("pLandmarkMr", e.target.checked === false && "");
                                  setValue("pRoadNameMr", e.target.checked === false && "");
                                  setValue("pPinCode", e.target.checked === false && "");
                                  setValue("pCityMr", e.target.checked === false && "");
                                }
                                props.onChange(e.target.checked);
                              }}
                            />
                          )}
                        />
                      }
                      label={<FormattedLabel id="isPAddressSame" />}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="buildingNo" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame === true ? true : false,
                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pBuildingNo")}
                      helperText={errors.pBuildingNo?.message}
                      error={errors.pBuildingNo}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="buildingName" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pBuildingName")}
                      helperText={errors.pBuildingName?.message}
                      error={errors.pBuildingName}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="roadName" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pRoadName")}
                      helperText={errors.pRoadName?.message}
                      error={errors.pRoadName}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="buildingNoMr" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pBuildingNoMr")}
                      helperText={errors.pBuildingNoMr?.message}
                      error={errors.pBuildingNoMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="buildingNameMr" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pBuildingNameMr")}
                      helperText={errors.pBuildingNameMr?.message}
                      error={errors.pBuildingNameMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="roadNameMr" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pRoadNameMr")}
                      helperText={errors.pRoadNameMr?.message}
                      error={errors.pRoadNameMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="landMark" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pLandmark")}
                      helperText={errors.pLandmark?.message}
                      error={errors.pLandmark}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="landMarkMr" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pLandmarkMr")}
                      helperText={errors.pLandmarkMr?.message}
                      error={errors.pLandmarkMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="city" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pCity")}
                      helperText={errors.pCity?.message}
                      error={errors.pCity}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="state" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame === true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pState")}
                      helperText={errors.pState?.message}
                      error={errors.pState}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="pinCode" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      type="number"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pPinCode")}
                      helperText={errors.pPinCode?.message}
                      error={errors.pPinCode}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="cityMr" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame == true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pCityMr")}
                      helperText={errors.pCityMr?.message}
                      error={errors.pCityMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ padding: 2 }}
                  spacing={4}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid
                    xs={4}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <TextField
                      label={<FormattedLabel id="stateMr" />}
                      InputLabelProps={{
                        shrink: isPermanentAddressSame === true ? true : false,

                        style: { color: "#000000", fontSize: "15px" },
                      }}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("pStateMr")}
                      helperText={errors.pStateMr?.message}
                      error={errors.pStateMr}
                      inputProps={{ style: { fontSize: "15px" } }}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid
                    xs={8}
                    item
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  ></Grid>
                </Grid>
              </Paper>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ padding: "10px" }}>
            <AccordionSummary
              sx={{
                background: "linear-gradient(90deg, rgba(194,229,156,1) 0%, rgba(100,179,244,1) 100%)",
                color: "black",
                borderRadius: "10px",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="#0070f3"
            >
              <Typography>{<FormattedLabel id="credentials" />}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper
                sx={{
                  paddingTop: 3,
                  paddingBottom: 3,
                  backgroundColor: "#F5F5F5",
                }}
                elevation={5}
              >
                <Grid
                  container
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                  py={1}
                >
                  <Grid item xs={4}>
                    <TextField
                      label={<FormattedLabel id="loginId" />}
                      variant="outlined"
                      //   label=" "
                      fullWidth
                      size="small"
                      // disabled
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("loginId")}
                      helperText={errors.loginId?.message}
                      error={errors.loginId}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                  py={1}
                >
                  <Grid item xs={11}>
                    <FormControl variant="outlined" size="small" fullWidth error={!!errors.hintQuestion}>
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="hintQuestion" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "5px",
                            }}
                            // disabled
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="hintQuestion" />}
                          >
                            {questions?.map((val, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={val.id}
                                  style={{
                                    display: val?.question ? "flex" : "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  {val?.question}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                        name="hintQuestion"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.hintQuestion ? errors.hintQuestion.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid
                  container
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  py={1}
                >
                  <Grid item xs={11}>
                    <TextField
                      label={<FormattedLabel id="answer" />}
                      variant="outlined"
                      //   label="Answer"
                      fullWidth
                      size="small"
                      // disabled
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      {...register("hintQuestionAnswer")}
                      helperText={errors.hintQuestionAnswer?.message}
                      error={errors.hintQuestionAnswer}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </AccordionDetails>
          </Accordion>

          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "15px",
            }}
          >
            <Button
              size="small"
              variant="contained"
              sx={{
                // textTransform: "capitalize",
                // width: "50%",
                // backgroundColor: "#CAD9E5",
                // color: "black",
                ":hover": {
                  bgcolor: "blue",
                  color: "#fff",
                },
              }}
              type="submit"
            >
              Update
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default CompleteProfile;
