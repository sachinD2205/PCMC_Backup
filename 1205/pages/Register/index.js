import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/[register].module.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import urls from "../../URLS/urls";
import AppBarComponent from "../../containers/Layout/components/AppBarComponent";
import schema from "../../containers/schema/RegisterSchema";
import sweetAlert from "sweetalert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Register = () => {
  const router = useRouter();

  const [hintQuestion, setHintQuestion] = useState("");
  const [emailChecked, setEmailChecked] = useState(true);
  const [resendOTP, setResendOTP] = useState(false);
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(null);
  // for email otp
  const [emailVerified, setEmailVerified] = useState(null);
  const [resendEmailOTP, setResendEmailOTP] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [zoneNames, setZoneNames] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [titleNames, setTitleNames] = useState([]);
  const [genderNames, setGenderNames] = useState([]);
  const language = useSelector((state) => state?.labels.language);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleEmailCheckedChange = (event) => {
    setEmailChecked(event.target.checked);
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: "all",
    mode: "onChange",
  });

  // disabled generate otp button
  // enabled button when full name, mobile number and email is entered.
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (
      watch("mobileNumber") &&
      watch("email") &&
      watch("lastName") &&
      watch("middleName") &&
      watch("firstName")
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [watch("mobileNumber"), watch("email"), watch("lastName"), watch("middleName"), watch("firstName")]);

  useEffect(() => {
    getWardNames();
    getZoneName();
    getTitle();
    getGender();
    getQuestions();
  }, []);

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

  const onGenerateEmailOTPClick = (formData) => {
    console.log("formData", formData, watch("firstName"));
    const finalBodyForApi = {
      firstName: watch("firstName"),
      middleName: watch("middleName"),
      lastName: watch("lastName"),
      mobile: watch("mobileNumber"),
      emailID: watch("email"),
    };
    axios
      .post(`${urls.CFCURL}/transaction/citizen/sendOtp`, finalBodyForApi)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          toast("OTP sent", {
            type: "success",
          });
        }
        //  else if (res.status == 400) {
        //   sweetAlert("LOI !", `LOI Generated successfully ! `, "success");
        // }
      })
      .catch((err) => {
        console.log("Error", err?.response?.data);
        sweetAlert(err?.response?.data, "Try with different", "warning");
      });
    // console.log("genrate otp");
    // setResendEmailOTP(true);
    // toast("OTP sent", {
    //   type: "success",
    // });
  };

  const verifyOTP = () => {
    setPhoneNumberVerified(true);
  };

  // Verify Email Otp
  const verifyEmailOTP = () => {
    const body = {
      username: watch("email"),
      otp: watch("emailOtp"),
    };
    axios
      .post(`${urls.CFCURL}/transaction/citizen/verifyOtp`, body)

      .then((r) => {
        if (r.status == 200) {
          setEmailVerified(true);
        } else if (r.status == 401) {
          toast("Invalid OTP Please try Again", {
            type: "error",
          });
        }
      })
      .catch((err) => {
        // setCountDown(countDown + 1);
        // if (countDown == 2) {
        // setLoginData();
        // setShowOTPCitizen(false);
        // setDisableLoginButton(false);
        // }
        console.log("errw", err);
        // setDisableLoginButton(true);
        // setLoading(false);
        // setIsOtpVerifiedCitizen(false);

        toast("Invalid OTP Please try Again !", {
          type: "error",
        });
      });
  };

  const getQuestions = () => {
    axios.get(`${urls.CFCURL}/master/question/getAll`).then((r) => {
      console.log("rr", r);
      setQuestions(
        r.data.questionMaster
          .filter((q) => q.application == 0)
          .map((row) => ({
            id: row.id,
            question: row.question,
            questionMar: row.questionMar,
          })),
      );
    });
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
      );
    });
  };

  const onFinish = (values) => {
    console.log("values", values);

    const body = {
      firstName: values.firstName,
      middleName: values.middleName,
      surname: values.lastName,
      // dateOfBirth: "1995-10-25",
      emailID: values.email,
      mobile: values.mobileNumber,
      username: values.loginId,
      password: values.password,
      hintQuestion: values.hintQuestion,
      answer: values.hintQuestionAnswer,
      zone: values.zoneName,
      ward: values.wardName,
      title: values.title,
      gender: values.gender,
      cflatBuildingNo: values.buildingNo,
      cbuildingName: values.buildingName,
      croadName: values.roadName,
      // clandmark: values.landmark,
      cState: values.cState,
      cCity: values.cCity,
      cpinCode: values.pinCode,
      firstNamemr: values.firstNameMr,
      middleNamemr: values.middleNameMr,
      surnamemr: values.lastNameMr,
      // cCityMr: value.cCityMr,
      // cStateMr:value.cStateMr,
      // clandmarkMr: value.landmarkMr,
      // croadNameMr: value.roadNameMr,
      // cbuildingNameMr: value.buildingNameMr,
      // cflatBuildingNoMr: value.flatBuildingNoMr,
      // permanentAddress: "True",
      // plandmark: "Pune",
    };

    console.log("body", body);

    const headers = { Accept: "application/json" };

    axios
      .post(`${urls.CFCURL}/transaction/citizen/register`, body, { headers })
      .then((r) => {
        if (r.status == 200) {
          console.log("res", r);
          toast("Registered Successfully", {
            type: "success",
          });
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast("Registeration Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onFinish)}>
      <Grid container>
        <Grid item xs={6}>
          <div>{/* <img className={styles.bgLeft} src={"/sign.jpg"} alt="test" /> */}</div>
          <div className={styles.main}>
            <div className={styles.part}>
              <div className={styles.left}>
                <AppBarComponent />
                <Box className={styles.welcome} p={3}>
                  <Box sx={{ display: "flex" }}>
                    <Grid item sx={{ marginLeft: -35 }}>
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{
                          paddingLeft: "10px",
                          color: "blue",
                        }}
                        onClick={() =>
                          router.push({
                            pathname: "/login",
                          })
                        }
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </Grid>
                    <Grid item sx={{ marginLeft: 27 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        WELCOME TO
                      </Typography>
                    </Grid>
                  </Box>
                  <Typography variant="h6">Pimpri Chinchwad Citizen Service Portal</Typography>
                </Box>
                {/* <Box className={styles.welcome} p={1}>
                  <Typography variant="h1">WELCOME TO</Typography>
                  <Typography variant="h2">Pimpri Chinchwad Citizen Service Portal</Typography>
                </Box> */}
                <div className={styles.form}>
                  <div className={styles.fields}>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                      py={1}
                    >
                      <Grid item xs={3.8}>
                        <Typography>First name</Typography>
                        <TextField
                          variant="outlined"
                          // required={field.required}
                          // label={name}
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

                      <Grid item xs={3.8}>
                        <Typography>Middle name</Typography>
                        <TextField
                          variant="outlined"
                          // required={field.required}
                          // label={name}
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

                      <Grid item xs={3.8}>
                        <Typography>Last name</Typography>
                        <TextField
                          variant="outlined"
                          // required={field.required}
                          // label={name}
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

                    <Grid
                      container
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                      py={1}
                    >
                      <Grid item xs={5}>
                        <Typography>Mobile Number</Typography>
                        <TextField
                          variant="outlined"
                          //   label="Mobile Number"
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
                      {!phoneNumberVerified ? (
                        <>
                          <Grid item xs={3} style={{ display: "flex", alignItems: "end" }}>
                            {!resendOTP ? (
                              <Button
                                fullWidth
                                //   size="small"
                                variant="contained"
                                onClick={onGenerateOTPClick}
                                sx={{
                                  backgroundColor: "#0070f3",
                                  color: "white",

                                  ":hover": {
                                    color: "white",
                                  },
                                }}
                                // className={styles.button}
                              >
                                GENERATE OTP
                              </Button>
                            ) : (
                              <Button
                                fullWidth
                                //   size="small"
                                variant="contained"
                                // onClick={onResendOTPClick}
                                sx={{
                                  // backgroundColor: "#CAD9E5",
                                  backgroundColor: "#0070f3",
                                  color: "white",

                                  ":hover": {
                                    color: "white",
                                  },
                                }}
                                // className={styles.button}
                              >
                                RESEND OTP
                              </Button>
                            )}
                          </Grid>
                          <Grid item xs={3}>
                            <Typography>Verify OTP</Typography>
                            <TextField
                              variant="outlined"
                              //   label="Verify OTP"
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
                                      // onClick={handleClickShowPassword}
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
                      )}
                    </Grid>

                    <Grid
                      container
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                      py={1}
                    >
                      <Grid item xs={5}>
                        <Typography>Email Address</Typography>
                        <TextField
                          variant="outlined"
                          //   label="Mobile Number"
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
                        <Box
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
                        </Box>
                      </Grid>
                      {/* email otp */}
                      {!emailVerified ? (
                        <>
                          <Grid
                            item
                            xs={3}
                            sx={{ display: "flex", alignItems: "flex-start", paddingTop: 3.4 }}
                          >
                            {!resendEmailOTP ? (
                              <Button
                                disabled={disabled}
                                fullWidth
                                //   size="small"
                                variant="contained"
                                onClick={onGenerateEmailOTPClick}
                                sx={{
                                  backgroundColor: "#0070f3",
                                  color: "white",
                                  ":hover": {
                                    color: "white",
                                  },
                                }}
                                // className={styles.button}
                              >
                                GENERATE OTP
                              </Button>
                            ) : (
                              <Button
                                fullWidth
                                //   size="small"
                                variant="contained"
                                // onClick={onResendOTPClick}
                                sx={{
                                  backgroundColor: "#0070f3",
                                  color: "white",
                                  ":hover": {
                                    color: "white",
                                  },
                                }}
                                // className={styles.button}
                              >
                                RESEND OTP
                              </Button>
                            )}
                          </Grid>
                          <Grid item xs={3}>
                            <Typography>Verify OTP</Typography>
                            <TextField
                              variant="outlined"
                              //   label="Verify OTP"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              {...register("emailOtp")}
                              error={emailVerified === false}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    onClick={() => {
                                      verifyEmailOTP();
                                    }}
                                  >
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      // onClick={handleClickShowPassword}
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
                            Email verified successfully
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    {/*                      <Grid
                        container
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                        }}
                        py={1}
                      >

                      </Grid> */}

                    {/* <Grid
                        container
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                        }}
                      > */}
                    {/*    <Grid item xs={5}>
                          <FormControl
                            variant="standard"
                            fullWidth
                            error={!!errors.zoneName}
                            size="small"
                            sx={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '5px',
                            }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Zone
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  size="small"
                                  onChange={(value) => field.onChange(value)}
                                  label="zoneName"
                                >
                                  {zoneNames &&
                                    zoneNames.map((zoneName, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={zoneName.id}
                                        >
                                          {language == 'en'
                                            ? zoneName?.zoneName
                                            : zoneName?.zoneNameMr}
                                        </MenuItem>
                                      )
                                    })}
                                </Select>
                              )}
                              name="zoneName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.zoneName
                                ? errors.zoneName.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                          <FormControl
                            variant="standard"
                            error={!!errors.wardName}
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '5px',
                            }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Ward
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="wardName"
                                >
                                  {wardNames &&
                                    wardNames.map((wardName, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={wardName.id}
                                        >
                                          {language == 'en'
                                            ? wardName?.wardName
                                            : wardName?.wardNameMr}
                                        </MenuItem>
                                      )
                                    })}
                                </Select>
                              )}
                              name="wardName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.wardName
                                ? errors.wardName.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid> */}
                    {/* </Grid> */}
                    <Grid
                      container
                      spacing={2}
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                      py={1}
                    >
                      <Grid item xs={5}>
                        <Typography>Gender</Typography>
                        <FormControl variant="outlined" size="small" fullWidth error={!!errors.gender}>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{
                                  backgroundColor: "#FFFFFF",
                                  borderRadius: "5px",
                                }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Gender"
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
                      </Grid>
                      <Grid item xs={5}>
                        <Typography>Login ID</Typography>
                        <TextField
                          variant="outlined"
                          //   label=" "
                          fullWidth
                          size="small"
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
                      spacing={2}
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                      py={1}
                    >
                      <Grid item xs={5}>
                        <Typography>Password</Typography>
                        <TextField
                          InputLabelProps={{
                            style: { color: "#000000", fontSize: "15px" },
                          }}
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
                          sx={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "5px",
                          }}
                          {...register("password")}
                          helperText={errors.password?.message}
                          error={errors.password}
                          inputProps={{ style: { fontSize: "15px" } }}
                          variant="outlined"
                          fullWidth
                          type={showPassword ? "" : "password"}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <Typography>Confirm Password</Typography>
                        {/* <TextField
                            variant="outlined"
                            // label="Confirm Password"
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "5px",
                            }}
                            {...register("passwordConfirmation")}
                            helperText={errors.passwordConfirmation?.message}
                            error={errors.passwordConfirmation}
                          /> */}
                        <TextField
                          InputLabelProps={{
                            style: { color: "#000000", fontSize: "15px" },
                          }}
                          InputProps={{
                            style: { fontSize: "15px" },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowConfirmPassword}
                                >
                                  {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "5px",
                          }}
                          {...register("passwordConfirmation")}
                          helperText={errors.passwordConfirmation?.message}
                          error={errors.passwordConfirmation}
                          inputProps={{ style: { fontSize: "15px" } }}
                          variant="outlined"
                          fullWidth
                          type={showConfirmPassword ? "" : "password"}
                          size="small"
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
                        <Typography>Hint Question</Typography>
                        <FormControl variant="outlined" size="small" fullWidth error={!!errors.hintQuestion}>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{
                                  backgroundColor: "#FFFFFF",
                                  borderRadius: "5px",
                                }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Hint Question"
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
                        <Typography>Answer</Typography>
                        <TextField
                          variant="outlined"
                          //   label="Answer"
                          fullWidth
                          size="small"
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

                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "15px",
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          width: "50%",
                          backgroundColor: "#CAD9E5",
                          color: "black",
                          ":hover": {
                            bgcolor: "blue", // theme.palette.primary.main
                            color: "#fff",
                          },
                        }}
                        type="submit"
                      >
                        SIGN UP
                      </Button>
                    </Box>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "15px",
                      }}
                    >
                      <Typography>
                        Already have an account?
                        <Link
                          onClick={() => {
                            router.push("/login");
                          }}
                        >
                          {" "}
                          Login here
                        </Link>
                      </Typography>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <img className={styles.bgRight} src={"/sign.jpg"} alt="bg-img" style={{ width: "98%" }} />
          </div>
          <div className={styles.right}>
            <div className={styles.footer}>
              <h4>© 2022, developed by Nascent Infotechnologies Pvt. Ltd. & ATOS</h4>
            </div>
          </div>
        </Grid>
      </Grid>
    </form>
  );
};

export default Register;
