import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AppBarComponent from "../../containers/Layout/components/AppBarComponent";
import styles from "../../styles/[forgotPassword].module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../containers/schema/RegisterSchema";

const ForgotPassword = () => {
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

  const router = useRouter();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [isValidId, setIsValidId] = useState(true);

  const onFinish = (values) => {
    console.log("values", values);
    !userId ? toast.error("Invalid Credentials") : "";
    setIsValidId(false);

    const finalBodyForApi = {
      emailID: watch("email"),
    };
    axios
      .post(`${urls.CfcURLTransaction}/citizen/sendOtp`, finalBodyForApi)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          toast("OTP sent", {
            type: "success",
          });
          router.push("/VerificationVerify");
        }
        //  else if (res.status == 400) {
        //   sweetAlert("LOI !", `LOI Generated successfully ! `, "success");
        // }
      })
      .catch((err) => {
        console.log("Error", err?.response?.data);
        sweetAlert(err?.response?.data, "Try with different", "warning");
      });

    // // axios.post('http://localhost:5000/pcmc/loginApi', body).then((r) => {
    // //   if (r.status == 200) {
    // //     console.log('res', r.data.menuCodes)
    // //     dispatch(login(r.data.userDetails))
    // //     dispatch(setMenu(r.data.menuCodes))
    // //     router.push('/')
    // //   } else {
    // //     message.error('Login Failed ! Please Try Again !')
    // //   }
    // // })

    // // if (user === "Admin" && pwd === "12345") {
    // if (true) {
    //   //   dispatch(login(userDetails));
    //   //   dispatch(setMenu(backEndApiMenu));
    //   // router.push("/ResetPassword");
    // } else {
    //   // message.error("Login Failed ! Please Try Again !");
    // }
  };

  return (
    <Box className={styles.main}>
      <Grid container>
        <Grid item xs={6}>
          <div>
            <img className={styles.bgLeft} src={"/sign.jpg"} alt="test" />
          </div>
          <div className={styles.main}>
            <div className={styles.part}>
              <div className={styles.left}>
                <AppBarComponent />
                {/* <div className={styles.header}>
                  <div className={styles.leftHeader}>
                    <img
                      className={styles.logoLeft}
                      src={"/logo.png"}
                      alt="pcmcLogo"
                    />
                    <Typography variant="h5">
                      Pimpri Chinchwad Municipal Corporation
                    </Typography>
                  </div>
                  <img
                    className={styles.logoRight}
                    src={"/smartCityPCMC.png"}
                    alt="pcmcLogo"
                  />
                </div> */}

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
                <br />
                <Box className={styles.welcome} py={2}>
                  <Typography variant="h1">FORGOT PASSWORD</Typography>
                  <h3 style={{ fontFamily: "Arial", paddingTop: 8 }}>
                    Enter your registered Email ID/Phone number
                  </h3>
                </Box>
                <div className={styles.form}>
                  <div
                    className={styles.fields}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "60%",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h4 style={{ fontFamily: "Arial" }}>Email ID/Phone number</h4>
                      <TextField
                        variant="outlined"
                        required
                        // label={name}
                        // inputProps={{ maxLength: 10 }}
                        // type="number"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "10px",
                        }}
                        error={isValidId === false}
                        onChange={(e) => setUserId(e.target.value)}
                        {...register("email")}
                        // {...register("Username")}
                        //   helperText={errors.Username?.message}
                      />
                    </Box>
                    <br />
                    <br />
                    <br />
                    <Box
                      py={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        onClick={onFinish}
                        sx={{
                          backgroundColor: "#0070f3",
                          width: "100%",
                          color: "white",
                        }}
                        // className={styles.button}
                        type="submit"
                      >
                        NEXT
                      </Button>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <img className={styles.bgRight} src={"/sign.jpg"} alt="bg-img" />
          </div>
          <div className={styles.right}>
            <div className={styles.footer}>
              <h4>© 2022, developed by Probity Software Ltd.</h4>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;
