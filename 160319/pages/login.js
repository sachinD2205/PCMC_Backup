import React from "react";
import { useRef, useState, useEffect } from "react";
import styles from "../styles/[login].module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  setMenu,
  setUsersDepartmentDashboardData,
  setUsersCitizenDashboardData,
} from "../features/userSlice";
import backEndApiMenu from "../containers/Layout/backEndApiMenu";
import { Box, Tab, Tabs, Typography, Grid, Link, Avatar } from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";
import CitizenLogin from "../containers/Layout/components/CitizenLogin";
import DepartmentLogin from "../containers/Layout/components/DepartmentLogin";
import CfcLogin from "../containers/Layout/components/CfcLogin";
import AppBarComponent from "../containers/Layout/components/AppBarComponent";
import { toast } from "react-toastify";
import { mountLabels, language } from "../features/labelSlice";
import labels from "../containers/reuseableComponents/newLabels";
import loginLabels from "../containers/reuseableComponents/labels/common/loginLabels";
import urls from "../URLS/urls";
import Head from "next/head";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showOTPCitizen, setShowOTPCitizen] = useState(false);
  const [otp, setOtp] = useState(null);
  const [otpCitizen, setOtpCitizen] = useState(null);
  const [isVerified, setIsVerified] = useState(true);
  const [isVerifiedCitizen, setIsVerifiedCitizen] = useState(true);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpVerifiedCitizen, setIsOtpVerifiedCitizen] = useState(false);
  const [cfcUser, setCfcUser] = useState("");
  const [cfcPwd, setCfcPwd] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  // const [LoginForm] = Form.useForm();
  const router = useRouter();
  // const [activeTabKey2, setActiveTabKey2] = useState("citizen");

  const [value, setValue] = useState(0);
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [disableLoginButton, setDisableLoginButton] = useState(false);

  const _language = useSelector((state) => {
    return state.labels.language;
  });

  const [checkedLanguage, setCheckedLanguage] = useState(
    _language == "en" ? true : false
  );
  const dispatch = useDispatch();

  const handleChangeLanguage = (e) => {
    // setCheckedLanguage(e.target.checked);
    e == "ENG" ? dispatch(language("en")) : dispatch(language("mr"));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    //    resolver: yupResolver(schema),
  });

  // useEffect(() => {
  //   dispatch(mountLabels(labels))
  // }, [])

  const onSubmit = (data) => console.log("entered data", data);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRememberMe = (event) => {
    setChecked(event.target.checked);
  };

  const handleForgotPasswordClick = () => {
    router.push("/ForgotPassword");
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    router.push("/Register");
  };

  const checkLoginState = useSelector((state) => {
    return state.user.isLoggedIn;
  });
  useEffect(() => {
    // redirect to home if already logged in
    if (checkLoginState) {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  const findLoginLabel = (id) => {
    if (_language) {
      return loginLabels[_language][id];
    } else {
      return loginLabels["mr"][id];
    }
  };
  const onFinish = (values) => {
    setDisableLoginButton(true);
    const body = {
      username: values.Username,
      password: values.password,
    };
    axios
      .post(`${urls.CFCURL}/transaction/citizen/login`, body)
      .then((r) => {
        if (r.status == 200) {
          console.log("res", r);
          dispatch(login(r.data));
          dispatch(setMenu(backEndApiMenu));
          dispatch(mountLabels(labels));
          dispatch(setUsersCitizenDashboardData(r.data));
          localStorage.setItem("loggedInUser", "citizenUser");
          dispatch(setMenu(r.data.menuCodes));
          router.push("/dashboard");
          setDisableLoginButton(false);
        } else {
          console.log("Ashish", r.data);
          message.error(r.data);
          setDisableLoginButton(false);
        }
      })
      .catch((err) => {
        setDisableLoginButton(false);
        console.log("Ashish", err?.response?.data);
        toast(err?.response?.data?.message, {
          type: "error",
        });
      });

    // if (values.Username === "Admin" && values.password === "12345") {
    //   dispatch(login(userDetails));
    //   dispatch(setMenu(backEndApiMenu));
    //   router.push("/ResetPassword");
    //   router.push("/Verification");
    //   router.push("/ResetPassword");
    //   router.push("/ForgotPassword");
    //   router.push("/dashboard");
    //   router.push("/DepartmentDashboard")
    // }
  };

  const onDepartmentLogin = (e) => {
    e.preventDefault();
    setDisableLoginButton(true);
    const body = {
      userName: user,
      password: pwd,
    };

    axios
      .post(`${urls.AuthURL}/signinNew`, body)
      .then((r) => {
        if (r.status == 200) {
          // console.log('res dep login',r);
          // setLoading(true);

          router.push("/DepartmentDashboard");
          setDisableLoginButton(false);
          dispatch(login(r.data));
          dispatch(setMenu(backEndApiMenu));
          dispatch(setUsersDepartmentDashboardData(r.data));
          dispatch(mountLabels(labels));
          localStorage.setItem("loggedInUser", "departmentUser");
          setShowOTP(true);
          setIsVerified(false);
        }
      })
      .catch((err) => {
        console.log("erre", err);
        setDisableLoginButton(false);
        toast('Login Failed ! Please Try Again !', {
          type: 'error',
        })
        // toast(err.response.data.message, {
        //   type: "error",
        // });
      });
  };

  const onCfcUserLogin = (e) => {
    setLoading(true);
    e.preventDefault();
    setDisableLoginButton(true);
    const body = {
      userName: cfcUser,
      password: cfcPwd,
    };

    axios
      .post(`${urls.AuthURL}/signinNew`, body)
      .then((r) => {
        if (r.status == 200) {
          dispatch(login(r.data));
          dispatch(setMenu(backEndApiMenu));
          dispatch(setUsersDepartmentDashboardData(r.data));
          dispatch(mountLabels(labels));
          router.push("/CFC_Dashboard");
          setDisableLoginButton(false);
          console.log("cfc login response", r);
          localStorage.setItem("loggedInUser", "cfcUser");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("errw", err);
        setDisableLoginButton(false);
        setLoading(false);
        toast("Login Failed ! Please Try Again !", {
          type: "error",
        });
      });

    // if (user == "Admin" && pwd == 12345) {
    //   router.push("/DepartmentDashboard");
    // }
  };

  const handleVerifyOtp = () => {
    console.log("123", otp);
    setIsOtpVerified(true);
  };

  const handleVerifyOtpCitizen = () => {
    console.log("123", otp);
    setIsOtpVerifiedCitizen(true);
  };

  
  useEffect(()=>{
    console.log("env from local",process.env.NEXT_PUBLIC_BACK_END_PROBITY_POINT);
  },[])

  return (
    <>
      <Head>
        {/* <title>{findLoginLabel('pcmcTitle')}</title> */}
        <title>PCMC - Login</title>
      </Head>
      <form onSubmit={handleSubmit(onFinish)}>
        <Box>
          <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box style={{ width: "100%" }}>
                  <AppBarComponent />
                  <Box
                    p={2}
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "5%",
                        right: "1%",
                        // width: '100%',
                        // display: 'flex',
                        // justifyContent: 'end',
                      }}
                    >
                      {_language == "en" ? (
                        <Avatar
                          onClick={() => {
                            handleChangeLanguage("MAR");
                          }}
                          sx={{
                            width: "35px",
                            height: "35px",
                            bgcolor: "#3B90DB",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                        >
                          म
                        </Avatar>
                      ) : (
                        <Avatar
                          onClick={() => {
                            handleChangeLanguage("ENG");
                          }}
                          sx={{
                            width: "35px",
                            height: "35px",

                            bgcolor: "#3B90DB",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                        >
                          ENG
                        </Avatar>
                      )}
                    </Box>
                    <Typography
                      sx={{ typography: { sm: "h6", xs: "subtitle1" } }}
                    >
                      {findLoginLabel("welcomeTo")}
                    </Typography>
                    <Typography
                      sx={{ typography: { sm: "h5", xs: "subtitle1" } }}
                    >
                      {findLoginLabel("pcmcNameNew")}
                    </Typography>
                  </Box>

                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        sx={{
                          color: "#000000",
                          backgroundColor: "#FFFFFF",
                          "& .Mui-selected": {
                            color: "#FFFFFF !important",
                            backgroundColor: "#3B90DB",
                          },
                        }}
                        TabIndicatorProps={{
                          style: {
                            display: "none",
                          },
                        }}
                        variant="fullWidth"
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                      >
                        <Tab
                          label={findLoginLabel("citizen")}
                          {...a11yProps(0)}
                        />
                        <Tab
                          label={findLoginLabel("department")}
                          {...a11yProps(1)}
                        />
                        <Tab
                          label={findLoginLabel("cfcUser")}
                          {...a11yProps(2)}
                        />
                      </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                      <Box
                        sx={{
                          paddingX: "20%",
                        }}
                      >
                        <CitizenLogin
                          showOTPCitizen={showOTPCitizen}
                          setOtpCitizen={setOtpCitizen}
                          isVerifiedCitizen={isVerifiedCitizen}
                          isOtpVerifiedCitizen={isOtpVerifiedCitizen}
                          handleVerifyOtpCitizen={handleVerifyOtpCitizen}
                          register={register}
                          errors={errors}
                          handleClickShowPassword={handleClickShowPassword}
                          showPassword={showPassword}
                          handleRememberMe={handleRememberMe}
                          handleForgotPasswordClick={handleForgotPasswordClick}
                          handleRegisterClick={handleRegisterClick}
                          disableLoginButton={disableLoginButton}
                        />
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <Box
                        sx={{
                          paddingX: "20%",
                        }}
                      >
                        <DepartmentLogin
                          onDepartmentLogin={onDepartmentLogin}
                          setUser={setUser}
                          setPwd={setPwd}
                          showOTP={showOTP}
                          setOtp={setOtp}
                          isVerified={isVerified}
                          handleVerifyOtp={handleVerifyOtp}
                          handleClickShowPassword={handleClickShowPassword}
                          showPassword={showPassword}
                          // handleRegisterClick={handleRegisterClick}
                          isOtpVerified={isOtpVerified}
                          handleForgotPasswordClick={handleForgotPasswordClick}
                        />
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <Box
                        sx={{
                          paddingX: "20%",
                        }}
                      >
                        <CfcLogin
                          handleClickShowPassword={handleClickShowPassword}
                          showPassword={showPassword}
                          onCfcUserLogin={onCfcUserLogin}
                          setCfcUser={setCfcUser}
                          setCfcPwd={setCfcPwd}
                        />
                      </Box>
                    </TabPanel>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={0}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              display={{
                xs: "none",
                sm: "none",
                md: "block",
                lg: "block",
                xl: "block",
              }}

              // style={{
              //   "@media (min-width: 120px)": {
              //     backgroundColor: "red",
              //   },
              // }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  backgroundColor: "#B5B5B5",
                }}
              >
                <Box>
                  <Link
                    href="https://drive.google.com/u/0/uc?id=1AodMBTimjwcisfdNsPprClpk5ViMOJFr&export=download"
                    target="_blank"
                  >
                    {findLoginLabel("googleMarthiTrans")}
                  </Link>
                </Box>
                {/* <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Marathi</Typography>
                <Switch
                  checked={checkedLanguage}
                  onChange={handleChangeLanguage}
                  inputProps={{ "aria-label": "controlled" }}
                  size="small"
                />
                <Typography variant="subtitle2">English</Typography>
              </Box> */}
              </Box>
              <Box>
                <Image
                  src="/sign.jpg"
                  alt="PP"
                  width="100%"
                  height="80%"
                  layout="responsive"
                />
              </Box>
              <Box>
                <div className={styles.right}>
                  <div className={styles.footer}>
                    <h4>{findLoginLabel("footer")}</h4>
                  </div>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* <Box className={styles.main}>
        <Grid container>
          <Grid item xs={6}>
            <div>
              <Image
                src="/sign.jpg"
                className={styles.bgLeft}
                width="50%"
                height="50%"
                layout="responsive"
              />
            </div>
            <div className={styles.main}>


              <div className={styles.part}>
                <div className={styles.left}>
                  <AppBarComponent />
                  <Box className={styles.welcome} p={2}>
                    <Typography variant="h1">
                      <FormattedLabel id="welcomeTo" />
                    </Typography>
                    <Typography variant="h2">
                      <FormattedLabel id="pcmcName" />
                    </Typography>
                  </Box>


                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        sx={{
                          color: "#000000",
                          backgroundColor: "#FFFFFF",
                          "& .Mui-selected": {
                            color: "#FFFFFF !important",
                            backgroundColor: "#3B90DB",
                          },
                        }}
                        TabIndicatorProps={{
                          style: {
                            display: "none",
                          },
                        }}
                        variant="fullWidth"
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                      >
                        <Tab
                          label={<FormattedLabel id="citizen" />}
                          {...a11yProps(0)}
                        />
                        <Tab
                          label={<FormattedLabel id="department" />}
                          {...a11yProps(1)}
                        />
                        <Tab
                          label={<FormattedLabel id="cfcUser" />}
                          {...a11yProps(2)}
                        />
                      </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                      <Box
                        sx={{
                          paddingX: "20%",
                        }}
                      >
                        <CitizenLogin
                          showOTPCitizen={showOTPCitizen}
                          setOtpCitizen={setOtpCitizen}
                          isVerifiedCitizen={isVerifiedCitizen}
                          isOtpVerifiedCitizen={isOtpVerifiedCitizen}
                          handleVerifyOtpCitizen={handleVerifyOtpCitizen}
                          register={register}
                          errors={errors}
                          handleClickShowPassword={handleClickShowPassword}
                          showPassword={showPassword}
                          handleRememberMe={handleRememberMe}
                          handleForgotPasswordClick={handleForgotPasswordClick}
                          handleRegisterClick={handleRegisterClick}
                        />
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <Box
                        sx={{
                          paddingX: "20%",
                        }}
                      >
                        <DepartmentLogin
                          onDepartmentLogin={onDepartmentLogin}
                          setUser={setUser}
                          setPwd={setPwd}
                          showOTP={showOTP}
                          setOtp={setOtp}
                          isVerified={isVerified}
                          handleVerifyOtp={handleVerifyOtp}
                          handleClickShowPassword={handleClickShowPassword}
                          showPassword={showPassword}
                          // handleRegisterClick={handleRegisterClick}
                          isOtpVerified={isOtpVerified}
                          handleForgotPasswordClick={handleForgotPasswordClick}
                        />
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <Box
                        sx={{
                          paddingX: "20%",
                        }}
                      >
                        <CfcLogin
                          handleClickShowPassword={handleClickShowPassword}
                          showPassword={showPassword}
                          onCfcUserLogin={onCfcUserLogin}
                          setCfcUser={setCfcUser}
                          setCfcPwd={setCfcPwd}
                        />
                      </Box>
                    </TabPanel>
                  </Box>
                </div>
              </div>
            </div>
          </Grid>
          <Grid
            item
            xs={6}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Box>
                <Link
                  href="https://drive.google.com/u/0/uc?id=1AodMBTimjwcisfdNsPprClpk5ViMOJFr&export=download"
                  target="_blank"
                >
                  <FormattedLabel id="googleMarthiTrans" />
                </Link>
              </Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Marathi</Typography>
                <Switch
                  checked={checkedLanguage}
                  onChange={handleChangeLanguage}
                  inputProps={{ "aria-label": "controlled" }}
                  size="small"
                />
                <Typography variant="subtitle2">English</Typography>
              </Box>
            </Box>
            <div>
              <Image
                src="/sign.jpg"
                alt="PP"
                width="100%"
                height="100%"
                layout="responsive"
              />
            </div>
            <div className={styles.right}>
              <div className={styles.footer}>
                <h4>
                  <FormattedLabel id="footer" />
                </h4>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box> */}
      </form>
    </>
  );
};

export default Login;
