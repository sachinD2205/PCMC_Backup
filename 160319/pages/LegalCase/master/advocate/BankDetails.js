import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/advocateview.module.css"

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";

const BankDetails = () => {
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();

  const [titles, settitles] = useState([]);

  const [bankNames, setBankNames] = useState([]);




  useEffect(() => {
    gettitles();
    getBankName()
  }, []);

  // get Title
  const gettitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`)
      .then((res) => {
        console.log("22", res);
        settitles(
          res.data.title.map((r, i) => ({
            id: r.id,
            title: r.title,
            titleMr: r.titleMr,
          }))
        );
      });
  };

  // bet Bank Name


  const getBankName = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`)
      .then((res) => {
        console.log("22", res);
        setBankNames(
          res.data.bank.map((r, i) => ({
            id: r.id,
           bankName:r.bankName,
            bankNameMr:r.bankNameMr,
            branchName:r.branchName,
            branchNameMr:r.branchNameMr
          }))
        );
      });
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
          // justifyContent: "center",
          // marginLeft:'50px',
          paddingTop: "10px",
          marginTop: "20px",

          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Typography
          style={{
            display: "flex",
            marginLeft: "100px",
            color: "white",
            // justifyContent: "center",
          }}
        >
          <h2>
            <FormattedLabel id="bankDetails" />
          </h2>
        </Typography>
      </Box>
      <Divider />

      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          {/* Bank Name */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
                  disabled={router?.query?.pageMode === "View"}

              variant="standard"
              sx={{ m: 1, minWidth: 120 ,marginTop:"20px"}}
              error={!!errors.bankName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* Bank Name */}
            <FormattedLabel id="bankName" />

              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Bank Name"
                    InputLabelProps={{
                      shrink: //true
                        (watch("bankName") ? true : false) ||
                        (router.query.bankName ? true : false),
                    }}


                  >
                    {bankNames &&
                      bankNames.map((bankName, index) => (
                        <MenuItem
                          key={index}
                          // @ts-ignore
                          value={bankName.id}
                        >
                          {/* @ts-ignore */}
                          {/* {title.title} */}
                          {language == "en" ? bankName?.bankName : bankName?.bankNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="bankName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bankName ? errors.bankName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Branch Name  in English*/}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
                  disabled={router?.query?.pageMode === "View"}

              variant="standard"
              sx={{ m: 1, minWidth: 120 , marginTop:"20px"}}
              error={!!errors.branchName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* Branch Name */}
                <FormattedLabel id ="branchName"></FormattedLabel>
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="branchName"

                    InputLabelProps={{
                      shrink: //true
                        (watch("branchName") ? true : false) ||
                        (router.query.branchName ? true : false),
                    }}
                  >
                   {bankNames &&
                      bankNames.map((bankName, index) => (
                        <MenuItem
                          key={index}
                          // @ts-ignore
                          value={bankName.id}
                        >
                          {/* @ts-ignore */}
                          {/* {title.title} */}
                          {language == "en" ? bankName?.branchName : bankName?.branchNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="branchName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.branchName ? errors.branchName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>


          {/* Account Name      */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
                  disabled={router?.query?.pageMode === "View"}

              autoFocus
              sx={{ width: 250 }}
              id="standard-basic"
              // label="Account No"
              label={<FormattedLabel id="accountNo"/>}

              InputLabelProps={{
                shrink: //true
                  (watch("accountNo") ? true : false) ||
                  (router.query.accountNo ? true : false),
              }}
              variant="standard"
              {...register("accountNo")}
              error={!!errors.accountNo}
              helperText={errors?.accountNo ? errors.accountNo.message : null}
            />
          </Grid>

        

          {/* Bank IFSC Code */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
                  disabled={router?.query?.pageMode === "View"}

              autoFocus
              sx={{ width: 250 }}
              id="standard-basic"
              // label="Bank IFSC Code"
              label={<FormattedLabel id="bankIFSC"/>}

              InputLabelProps={{
                shrink: //true
                  (watch("bankIFSCCode") ? true : false) ||
                  (router.query.bankIFSCCode ? true : false),
              }}
              variant="standard"
              {...register("bankIFSCCode")}
              error={!!errors.bankIFSCCode}
              helperText={
                errors?.bankIFSCCode ? errors.bankIFSCCode.message : null
              }
            />
          </Grid>
              {/* Remove Babk MICR Code  */}
          {/* Bank MICR Code */}
          {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
                  disabled={router?.query?.pageMode === "View"}

              autoFocus
              sx={{ width: 250 }}
              id="standard-basic"
              // label="Bank MICR Code"
              label ={<FormattedLabel id="bankMICR"/>}

              InputLabelProps={{
                shrink: //true
                  (watch("bankMICRCode") ? true : false) ||
                  (router.query.bankMICRCode ? true : false),
              }}
              variant="standard"
              {...register("bankMICRCode")}
              error={!!errors.bankMICRCode}
              helperText={
                errors?.bankMICRCode ? errors.bankMICRCode.message : null
              }
            />
          </Grid> */}
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default BankDetails;
