import React from "react";
import { useState } from "react";
import styles from "../../styles/[register].module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { toast } from "react-toastify";
import axios from "axios";

import schema from "../../containers/schema/RegisterSchema";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InsuranceTwoTone } from "@ant-design/icons";
import AppBarComponent from "../../containers/Layout/components/AppBarComponent";
import { useEffect } from "react";
import urls from "../../URLS/urls";

const Register = () => {
  const router = useRouter();

  const [hintQuestion, setHintQuestion] = useState("");
  const [emailChecked, setEmailChecked] = useState(true);
  const [resendOTP, setResendOTP] = useState(false);
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(null);

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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const verifyOTP = () => {
    setPhoneNumberVerified(true);
  };

  const getQuestions = () => {
    axios.get(`${urls.CfcURLMaster}/question/getAll`).then((r) => {
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
    axios.get(`${urls.CfcURLMaster}/zone/getAll`).then((r) => {
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
    axios.get(`${urls.CfcURLMaster}/ward/getAll`).then((r) => {
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
    axios.get(`${urls.CfcURLMaster}/title/getAll`).then((r) => {
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
    axios.get(`${urls.CfcURLMaster}/gender/getAll`).then((r) => {
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
          <div>
            <img className={styles.bgLeft} src={"/sign.jpg"} alt="test" />
          </div>
          <div className={styles.main}>
            <div className={styles.part}>
              <div className={styles.left}>
                <AppBarComponent />
                <Box className={styles.welcome} p={1}>
                  <Typography variant="h1">WELCOME TO</Typography>
                  <Typography variant="h2">Pimpri Chinchwad Citizen Service Portal</Typography>
                </Box>
                <div className={styles.form}>
                  <div className={styles.fields}>
                    <Grid
                      container
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Grid
                        xs={3}
                        item
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                        }}
                      >
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

                      <Grid
                        xs={3}
                        item
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                        }}
                      >
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

                      <Grid
                        xs={3}
                        item
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                        }}
                      >
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
                      <Grid item xs={3}>
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
                                //   size="small"
                                variant="contained"
                                // onClick={onResendOTPClick}
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
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                      py={1}
                    >
                      <Grid item xs={3}>
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

                      <Grid item xs={3}>
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
                      <Grid item xs={3}>
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
          {/* <div>
            <img className={styles.bgRight} src={"/sign.jpg"} alt="bg-img" />
          </div> */}
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
