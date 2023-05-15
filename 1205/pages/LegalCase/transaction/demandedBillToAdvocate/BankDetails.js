import { Grid, TextField, ThemeProvider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";

// BankDetails
const BankDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);

  // view
  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          {/** BankName */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='bankName' />}
              {...register("bankName")}
              error={!!errors?.bankName}
              helperText={errors?.bankName ? errors?.bankName?.message : null}
            />
          </Grid>

          {/** AccountNo */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='accountNo' />}
              {...register("accountNo")}
              error={!!errors?.accountNo}
              helperText={errors?.accountNo ? errors?.accountNo?.message : null}
            />
          </Grid>

          {/** IFSCCode */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='bankIFSC' />}
              {...register("bankIFSCCode")}
              error={!!errors?.bankIFSCCode}
              helperText={
                errors?.bankIFSCCode ? errors?.bankIFSCCode?.message : null
              }
            />
          </Grid>

          {/** BankMICRCode */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='bankMICR' />}
              {...register("bankMICRCode")}
              error={!!errors?.bankMICRCode}
              helperText={
                errors?.bankMICRCode ? errors?.bankMICRCode?.message : null
              }
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default BankDetails;
