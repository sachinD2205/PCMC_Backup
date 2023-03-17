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
import styles from "../../../../styles/LegalCase_Styles/advocateview.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import { advocateDetailsSchema } from "../../../../containers/schema/LegalCaseSchema/advocateSchema";

const AdvocateDetails = () => {
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

  useEffect(() => {
    gettitles();
    // getBankName()
  }, []);

  // get Title
  const gettitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((res) => {
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
            <FormattedLabel id="advocateDetails" />
          </h2>
        </Typography>
      </Box>
      <Divider />

      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          {/* title */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ marginTop: "2%", width: "230px" }}
              variant="standard"
              error={!!errors.title}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="title" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="title"
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("title") ? true : false) ||
                        (router.query.title ? true : false),
                    }}
                  >
                    {titles &&
                      titles.map((title, index) => (
                        <MenuItem
                          key={index}
                          // @ts-ignore
                          value={title.id}
                        >
                          {/* @ts-ignore */}
                          {/* {title.title} */}
                          {language == "en" ? title?.title : title?.titleMr}
                        </MenuItem>
                      ))}
                    {/* <MenuItem value={1}>Mr.</MenuItem>
                                      <MenuItem value={2}>Mrs.</MenuItem>
                                      <MenuItem value={3}>Miss</MenuItem> */}
                  </Select>
                )}
                name="title"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.title ? errors.title.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* First Name in English */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              InputLabelProps={{
                //true
                shrink:
                  (watch("firstName") ? true : false) ||
                  (router.query.firstName ? true : false),
              }}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="fnameEn" required />}
              variant="standard"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors?.firstName ? errors.firstName.message : null}
            />
          </Grid>

          {/* Middle Name in English*/}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              InputLabelProps={{
                //true
                shrink:
                  (watch("middleName") ? true : false) ||
                  (router.query.middleName ? true : false),
              }}
              label={<FormattedLabel id="mnameEn" />}
              variant="standard"
              {...register("middleName")}
              error={!!errors.middleName}
              helperText={errors?.middleName ? errors.middleName.message : null}
            />
          </Grid>

          {/* Last Name in English */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="lnameEn" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("lastName") ? true : false) ||
                  (router.query.lastName ? true : false),
              }}
              variant="standard"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors?.lastName ? errors.lastName.message : null}
            />
          </Grid>

          {/* Advocate Category */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              disabled={router?.query?.pageMode === "View"}
              sx={{ marginTop: "2%", width: "230px" }}
              variant="standard"
              error={!!errors.advcoateCategory}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="advocateCategory"  />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="advcoateCategory"
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("advcoateCategory") ? true : false) ||
                        (router.query.advcoateCategory ? true : false),
                    }}
                  >
                    {[
                      { id: 1, advocateCategory: "Panel Advocate" },
                      { id: 2, advocateCategory: "Other" },
                      // { id: 3, caseStatuse: "Final Order" },
                      // { id: 4, caseStatuse: "Case Dissmiss" },
                    ].map((menu, index) => {
                      return (
                        <MenuItem key={index} value={menu.id}>
                          {menu.advocateCategory}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
                name="advocateCategory"
                control={control}
                defaultValue=""
              />
              {/* <FormHelperText>
                {errors?.advcoateCategory
                  ? errors.advcoateCategory.message
                  : null}
              </FormHelperText> */}
            </FormControl>
          </Grid>

          {/* First Name in Marathi */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="fnameMr" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("firstNameMr") ? true : false) ||
                  (router.query.firstNameMr ? true : false),
              }}
              variant="standard"
              {...register("firstNameMr")}
              error={!!errors.firstNameMr}
              helperText={
                errors?.firstNameMr ? errors.firstNameMr.message : null
              }
            />
          </Grid>

          {/* Middle Name in Marathi */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="mnameMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("middleNameMr") ? true : false) ||
                  (router.query.middleNameMr ? true : false),
              }}
              variant="standard"
              {...register("middleNameMr")}
              error={!!errors.middleNameMr}
              helperText={
                errors?.middleNameMr ? errors.middleNameMr.message : null
              }
            />
          </Grid>

          {/* Last Name in Marathi */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="lnameMr" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("lastNameMr") ? true : false) ||
                  (router.query.lastNameMr ? true : false),
              }}
              variant="standard"
              {...register("lastNameMr")}
              error={!!errors.lastNameMr}
              helperText={errors?.lastNameMr ? errors.lastNameMr.message : null}
            />
          </Grid>

          {/* Name of Bar Council in English */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="nameOfBarCouncilEn" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("nameOfBarCouncil") ? true : false) ||
                  (router.query.nameOfBarCouncil ? true : false),
              }}
              variant="standard"
              {...register("nameOfBarCouncil")}
              error={!!errors.nameOfBarCouncil}
              helperText={
                errors?.nameOfBarCouncil
                  ? errors.nameOfBarCouncil.message
                  : null
              }
            />
          </Grid>

          {/* Name of Bar Council Marathi */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="nameOfBarCouncilMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("nameOfBarCouncilMr") ? true : false) ||
                  (router.query.nameOfBarCouncilMr ? true : false),
              }}
              variant="standard"
              {...register("nameOfBarCouncilMr")}
              error={!!errors.nameOfBarCouncilMr}
              helperText={
                errors?.nameOfBarCouncilMr
                  ? errors.nameOfBarCouncilMr.message
                  : null
              }
            />
          </Grid>

          {/* Aadhar No */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="aadharNo" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("aadhaarNo") ? true : false) ||
                  (router.query.aadhaarNo ? true : false),
              }}
              variant="standard"
              {...register("aadhaarNo")}
              error={!!errors.aadhaarNo}
              helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
            />
          </Grid>

          {/* PAN No */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="panNo" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("panNo") ? true : false) ||
                  (router.query.panNo ? true : false),
              }}
              variant="standard"
              {...register("panNo")}
              error={!!errors.panNo}
              helperText={errors?.panNo ? errors.panNo.message : null}
            />
          </Grid>

          {/* City/Village in English */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityOrVillageEn" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("city") ? true : false) ||
                  (router.query.city ? true : false),
              }}
              variant="standard"
              {...register("city")}
              error={!!errors.city}
              helperText={errors?.city ? errors.city.message : null}
            />
          </Grid>

          {/* area in English */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="areaEn" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("area") ? true : false) ||
                  (router.query.area ? true : false),
              }}
              variant="standard"
              {...register("area")}
              error={!!errors.area}
              helperText={errors?.area ? errors.area.message : null}
            />
          </Grid>

          {/* Road Name in English */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadNameEn" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("roadName") ? true : false) ||
                  (router.query.roadName ? true : false),
              }}
              variant="standard"
              {...register("roadName")}
              error={!!errors.roadName}
              helperText={errors?.roadName ? errors.roadName.message : null}
            />
          </Grid>

          {/* Landmark in English */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              // required
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="landmarkEn" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("landmark") ? true : false) ||
                  (router.query.landmark ? true : false),
              }}
              variant="standard"
              {...register("landmark")}
              error={!!errors.landmark}
              helperText={errors?.landmark ? errors.landmark.message : null}
            />
          </Grid>

          {/* City/Village in Marathi */}

          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityOrVillageMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("cityMr") ? true : false) ||
                  (router.query.cityMr ? true : false),
              }}
              variant="standard"
              {...register("cityMr")}
              error={!!errors.cityMr}
              helperText={errors?.cityMr ? errors.cityMr.message : null}
            />
          </Grid>

          {/* Area in Marathi */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="areaMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("areaMr") ? true : false) ||
                  (router.query.areaMr ? true : false),
              }}
              variant="standard"
              {...register("areaMr")}
              error={!!errors.areaMr}
              helperText={errors?.areaMr ? errors.areaMr.message : null}
            />
          </Grid>

          {/* Road Name in Marathi */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadNameMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("roadNameMr") ? true : false) ||
                  (router.query.roadNameMr ? true : false),
              }}
              variant="standard"
              {...register("roadNameMr")}
              error={!!errors.roadNameMr}
              helperText={errors?.roadNameMr ? errors.roadNameMr.message : null}
            />
          </Grid>

          {/* Landmark in Marathi */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              // required
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="landmarkMr" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("landmarkMr") ? true : false) ||
                  (router.query.landmarkMr ? true : false),
              }}
              variant="standard"
              {...register("landmarkMr")}
              error={!!errors.landmarkMr}
              helperText={errors?.landmarkMr ? errors.landmarkMr.message : null}
            />
          </Grid>

          {/* PinCode  */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="pincode" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("pinCode") ? true : false) ||
                  (router.query.pinCode ? true : false),
              }}
              variant="standard"
              {...register("pinCode")}
              error={!!errors.pinCode}
              helperText={errors?.pinCode ? errors.pinCode.message : null}
            />
          </Grid>

          {/* Phone No */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="phone" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("phoneNo") ? true : false) ||
                  (router.query.phoneNo ? true : false),
              }}
              variant="standard"
              {...register("phoneNo")}
              error={!!errors.phoneNo}
              helperText={errors?.phoneNo ? errors.phoneNo.message : null}
            />
          </Grid>

          {/* Mobile No */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="mobile" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("mobileNo") ? true : false) ||
                  (router.query.mobileNo ? true : false),
              }}
              variant="standard"
              {...register("mobileNo")}
              error={!!errors.mobileNo}
              helperText={errors?.mobileNo ? errors.mobileNo.message : null}
            />
          </Grid>

          {/* Gmail */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="email" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("emailAddress") ? true : false) ||
                  (router.query.emailAddress ? true : false),
              }}
              variant="standard"
              {...register("emailAddress")}
              error={!!errors.emailAddress}
              helperText={
                errors?.emailAddress ? errors.emailAddress.message : null
              }
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default AdvocateDetails;
