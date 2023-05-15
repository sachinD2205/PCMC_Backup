import { Grid, TextField, ThemeProvider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";

// AdvocateDetails
const AdvocateDetails = (props) => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [courtNames, setCourtNames] = useState([]);
  const advocateName = getValues();
  const language = useSelector((state) => state.labels.language);
  const [departmentNames, setDepartmentNames] = useState([]);
  // departmentNames
  const getDepartmentName = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartmentNames(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
          department: r.departmentMr,
        })),
      );
    });
  };

  // courtNames
  const getCourtName = () => {
    axios.get(`${urls.LCMSURL}/master/court/getAll`).then((res) => {
      setCourtNames(
        res.data.court.map((r, i) => ({
          id: r.id,
          courtName: r.courtName,
          courtMr: r.courtMr,
        })),
      );
    });
  };

  // -------------------- useEffects --------

  useEffect(() => {
    getDepartmentName();
  }, []);

  useEffect(() => {
    getCourtName();
  }, [departmentNames]);

  // view
  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          {/** AdvocateName */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='advocateName' />}
              {...register("advocateName")}
              error={!!errors?.advocateName}
              helperText={
                errors?.advocateName ? errors?.advocateName?.message : null
              }
            />
          </Grid>

          {/** city */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='cityOrVillage' />}
              {...register("city")}
              error={!!errors?.city}
              helperText={errors?.city ? errors?.city?.message : null}
            />
          </Grid>

          {/** area */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='area' />}
              {...register("area")}
              error={!!errors?.area}
              helperText={errors?.area ? errors?.area?.message : null}
            />
          </Grid>

          {/** roadName */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='roadName' />}
              {...register("roadName")}
              error={!!errors?.roadName}
              helperText={errors?.roadName ? errors?.roadName.message : null}
            />
          </Grid>

          {/** landmark */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='landmark' />}
              {...register("landmark")}
              error={!!errors?.landmark}
              helperText={errors?.landmark ? errors?.landmark?.message : null}
            />
          </Grid>

          {/** pinCode */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='pincode' />}
              {...register("pinCode")}
              error={!!errors?.pinCode}
              helperText={errors?.pinCode ? errors?.pinCode?.message : null}
            />
          </Grid>

          {/** mobileNo */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='mobile' />}
              {...register("mobileNo")}
              error={!!errors?.mobileNo}
              helperText={errors?.mobileNo ? errors?.mobileNo?.message : null}
            />
          </Grid>

          {/** email */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id='email' />}
              {...register("emailAddress")}
              error={!!errors?.emailAddress}
              helperText={
                errors?.emailAddress ? errors?.emailAddress?.message : null
              }
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default AdvocateDetails;
