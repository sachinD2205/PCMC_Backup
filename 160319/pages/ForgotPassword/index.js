import React from "react";
import { useState } from "react";
import styles from "../../styles/[forgotPassword].module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
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
} from "@mui/material";
import OtpInput from "react-otp-input";
//import axios from 'axios'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InsuranceTwoTone } from "@ant-design/icons";
import { toast } from "react-toastify";
import AppBarComponent from "../../containers/Layout/components/AppBarComponent";

const ForgotPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [isValidId, setIsValidId] = useState(true);

  const onFinish = (values) => {
    console.log("values", values);
    !userId ? toast.error("Invalid Credentials") : "";
    setIsValidId(false);

    router.push("/VerificationVerify");

    // axios.post('http://localhost:5000/pcmc/loginApi', body).then((r) => {
    //   if (r.status == 200) {
    //     console.log('res', r.data.menuCodes)
    //     dispatch(login(r.data.userDetails))
    //     dispatch(setMenu(r.data.menuCodes))
    //     router.push('/')
    //   } else {
    //     message.error('Login Failed ! Please Try Again !')
    //   }
    // })

    // if (user === "Admin" && pwd === "12345") {
    if (true) {
      //   dispatch(login(userDetails));
      //   dispatch(setMenu(backEndApiMenu));
      // router.push("/ResetPassword");
    } else {
      // message.error("Login Failed ! Please Try Again !");
    }
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

                <Box className={styles.welcome} p={1}>
                  <Typography variant="h1">WELCOME TO</Typography>
                  <Typography variant="h2">Pimpri Chinchwad Citizen Service Portal</Typography>
                </Box>
                <Box className={styles.welcome} py={5}>
                  <Typography variant="h2">FORGOT PASSWORD</Typography>
                  <Typography variant="h6">Enter your registered Email ID/Phone number</Typography>
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
                      <Typography sx={{ color: "#000" }}>Email ID/Phone number</Typography>
                      <TextField
                        variant="outlined"
                        required
                        // label={name}
                        inputProps={{ maxLength: 10 }}
                        type="number"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "5px",
                        }}
                        error={isValidId === false}
                        onChange={(e) => setUserId(e.target.value)}
                        //   {...register("Username")}
                        //   helperText={errors.Username?.message}
                      />
                    </Box>

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
                          width: "100%",
                          backgroundColor: "#3B90DB",
                          color: "#FFF",
                        }}
                        className={styles.button}
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
          {/* <div>
            <img className={styles.bgRight} src={"/sign.jpg"} alt="bg-img" />
          </div> */}
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
