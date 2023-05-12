import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import URLS from "../../../../URLS/urls";

const PersonalDetails = ({ readOnly = false }) => {
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  // Titles
  const [titles, setTitles] = useState([]);
  const router = useRouter();

  const language = useSelector((state) => state?.labels.language);

  // getTitles
  const getTitles = () => {
    axios.get(`${URLS.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titlemr: row.titleMr,
        })),
      );
    });
  };

  // Gender
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
      );
    });
  };

  // crPincodes
  const [crPincodes, setCrPinCodes] = useState([]);

  // getCrPinCodes
  // const getCrPinCodes = () => {
  //   axios.get(`${URLS.CFCURL}/master/pinCode/getAll`).then((r) => {
  //     setCrPinCodes(
  //       r.data.pinCode.map((row) => ({
  //         id: row.id,
  //         crPincode: row.pinCode,
  //       })),
  //     );
  //   });
  // };

  const user = useSelector((state) => state?.user.user);

  useEffect(() => {
    getTitles();

    if (router.query.pageMode === "Add") {
      // setValue("firstName", getValues("user.firstName"));
      // setValue("pState", getValues("cState"));

      setValue("title", user.title);
      setValue("firstName", user.firstName);
      setValue("middleName", user.middleName);
      setValue("lastName", user.surname);
      setValue("gender", user.gender);
      // setValue('dateOfBirth', user.dateOfBirth)
      setValue("mobileNo", user.mobile);
      setValue("emailAddress", user.emailID);
      setValue(
        "cAddress",
        user.cflatBuildingNo + "," + user.cbuildingName + "," + user.croadName + "," + user.clandmark,
      );
      setValue("cCityName", user.ccity);
      setValue("cPincode", user.cpinCode);
    }
  }, [user]);

  // useEffect(() => {
  //   getTitles();

  //   if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
  //     // setValue("firstName", getValues("user.firstName"));
  //     // setValue("pState", getValues("cState"));

  //     setValue("title", user.title);
  //     setValue("firstName", user.firstName);
  //     setValue("middleName", user.middleName);
  //     setValue("lastName", user.surname);
  //     setValue("gender", user.gender);
  //     // setValue('dateOfBirth', user.dateOfBirth)
  //     setValue("mobileNo", user.mobile);
  //     setValue("emailAddress", user.emailID);

  //     setValue(
  //       "cAddress",
  //       user.cflatBuildingNo + "," + user.cbuildingName + "," + user.croadName + "," + user.clandmark,
  //     );
  //     setValue("cCityName", user.ccity);
  //     setValue("cPincode", user.cpinCode);
  //   }
  // }, [user]);

  const addressChange = (e) => {
    console.log("Clicked");
    if (e.target.checked) {
      setValue("pCityName", getValues("cCityName"));
      setValue("pState", getValues("cState"));
      setValue("pPincode", getValues("cPincode"));
      setValue("pAddress", getValues("cAddress"));
      setValue("pLattitude", getValues("cLattitude"));
      setValue("pLongitude", getValues("cLongitude"));
      setValue("pLongitude", getValues("cLongitude"));
    } else {
      setValue("pCityName", "");
      setValue("pState", "");
      setValue("pPincode", "");
      setValue("pAddress", "");
      setValue("pLattitude", "");
      setValue("pLongitude", "");
      setValue("pLongitude", "");
    }
  };

  // useEffect
  useEffect(() => {
    getTitles();
    getGenders();
    // getCrPinCodes();
  }, []);

  return (
    <>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        <strong>
          <FormattedLabel id="personalDetails" />
        </strong>
      </div>
      <Grid container sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} error={!!errors.title} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="title" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Title *"
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles.map((title, index) => (
                      <MenuItem key={index} value={title.id}>
                        {/* {title.title} */}
                        {language == "en" ? title?.title : title?.titleMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="title"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.title ? errors.title.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="firstName" required />}
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors?.firstName ? errors.firstName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="middleName" required />}
            {...register("middleName")}
            error={!!errors.middleName}
            helperText={errors?.middleName ? errors.middleName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="lastName" required />}
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors?.lastName ? errors.lastName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="gender" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select value={field.value} onChange={(value) => field.onChange(value)} label="Gender *">
                  {genders &&
                    genders.map((gender, index) => (
                      <MenuItem key={index} value={gender.id}>
                        {language == "en" ? gender?.gender : gender?.genderMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="gender"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.gender ? errors.gender.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="dateOfBirth"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    maxDate={new Date()}
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="dateOfBirth" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      // let date1 = moment(date).format('YYYYMMDD');
                      let today = new Date();
                      let dob = new Date(date);
                      var age = today.getFullYear() - dob.getFullYear();
                      // setValue(`groupDetails.${index}.age`, age);
                      setValue("age", age);
                    }}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>{errors?.dateOfBirth ? errors.dateOfBirth.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="age" />}
            {...register("age")}
            error={!!errors.age}
            helperText={errors?.age ? errors.age.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="mobileNo" required />}
            {...register("mobileNo")}
            error={!!errors.mobileNo}
            helperText={errors?.mobileNo ? errors.mobileNo.message : null}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="aadharNo" required />}
            {...register("aadharNo")}
            error={!!errors.aadharNo}
            helperText={errors?.aadharNo ? errors.aadharNo.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="emailAddress" required />}
            {...register("emailAddress")}
            error={!!errors.emailAddress}
            helperText={errors?.emailAddress ? errors.emailAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            // InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="currentAddress" required />}
            {...register("cAddress")}
            error={!!errors.cAddress}
            helperText={errors?.cAddress ? errors.cAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            // disabled
            defaultValue={"Pimpri Chinchwad"}
            label={<FormattedLabel id="cityName" required />}
            {...register("cCityName")}
            error={!!errors.cCityName}
            helperText={errors?.cCityName ? errors.cCityName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            // disabled
            // defaultValue={"Maharashtra"}
            label={<FormattedLabel id="state" required />}
            // label="State"
            {...register("cState")}
            error={!!errors.cState}
            helperText={errors?.cState ? errors.cState.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            // label={<FormattedLabel id="crPincode" />}
            label={<FormattedLabel id="pinCode" required />}
            {...register("cPincode")}
            error={!!errors.cPincode}
            helperText={errors?.cPincode ? errors.cPincode.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControlLabel
            control={<Checkbox />}
            label={
              <Typography>
                <b>
                  <FormattedLabel id="checkBox" />
                </b>
              </Typography>
            }
            {...register("addressCheckBox")}
            onChange={(e) => {
              setValue("addressCheckBox", e.target.checked);
              addressChange(e);
              console.log("checked1", e.target.checked);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="permanentAddress" required />}
            {...register("pAddress")}
            error={!!errors.pAddress}
            helperText={errors?.pAddress ? errors.pAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="cityName" required />}
            variant="standard"
            {...register("pCityName")}
            error={!!errors.pCityName}
            helperText={errors?.pCityName ? errors.pCityName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="state" required />}
            // label="State"
            variant="standard"
            {...register("pState")}
            error={!!errors.pState}
            helperText={errors?.pState ? errors.pState.message : null}
          />
          {/* <TextField
            id="standard-basic"
            disabled
            defaultValue={"Maharashtra"}
            label="State *"
            {...register("pState")}
            error={!!errors.pState}
            helperText={errors?.pState ? errors.pState.message : null}
          /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            // label={<FormattedLabel id="crPincode" />}
            label={<FormattedLabel id="pinCode" required />}
            {...register("pPincode")}
            error={!!errors.pPincode}
            helperText={errors?.pPincode ? errors.pPincode.message : null}
          />

          {/* <TextField
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="pinCode" required />}
            variant="standard"
            {...register('pPincode')}
            error={!!errors.pPincode}
            helperText={errors?.pPincode ? 'Pin Code  is Required !!!' : null}
          /> */}
        </Grid>
      </Grid>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        <strong>Work Address</strong>
      </div>
      <Grid container sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            // label="Work Address"
            label={<FormattedLabel id="workAddress" />}
            {...register("wAddress")}
            error={!!errors.wAddress}
            helperText={errors?.wAddress ? errors.wAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="cityName" />}
            variant="standard"
            {...register("wCityName")}
            error={!!errors.wCityName}
            helperText={errors?.wCityName ? "City Name  is Required !!!" : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="state" />}
            // label="State"
            variant="standard"
            {...register("wState")}
            error={!!errors.wState}
            helperText={errors?.wState ? "State is Required !!!" : null}
          />
          {/* <TextField
            id="standard-basic"
            disabled
            defaultValue={"Maharashtra"}
            label="State *"
            {...register("pState")}
            error={!!errors.pState}
            helperText={errors?.pState ? errors.pState.message : null}
          /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            // label={<FormattedLabel id="crPincode" />}
            label={<FormattedLabel id="pinCode" />}
            {...register("wPincode")}
            error={!!errors.wPincode}
            helperText={errors?.wPincode ? errors.wPincode.message : null}
          />

          {/* <TextField
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="pinCode"  />}
            variant="standard"
            {...register('pPincode')}
            error={!!errors.pPincode}
            helperText={errors?.pPincode ? 'Pin Code  is Required !!!' : null}
          /> */}
        </Grid>
      </Grid>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        <strong>School / College Address</strong>
      </div>
      <Grid container sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            // label="School / College Address"
            label={<FormattedLabel id="schoolCollegeAddress" />}
            {...register("sAddress")}
            error={!!errors.sAddress}
            helperText={errors?.sAddress ? errors.sAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="cityName" />}
            variant="standard"
            {...register("sCityName")}
            error={!!errors.sCityName}
            helperText={errors?.sCityName ? "City Name  is Required !!!" : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="state" />}
            // label="State"
            variant="standard"
            {...register("sState")}
            error={!!errors.sState}
            helperText={errors?.sState ? "State is Required !!!" : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            // label={<FormattedLabel id="crPincode" />}
            label={<FormattedLabel id="pinCode" />}
            {...register("sPincode")}
            error={!!errors.sPincode}
            helperText={errors?.sPincode ? errors.sPincode.message : null}
          />
        </Grid>
      </Grid>

      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        <strong>Name of recommending person</strong>
      </div>
      <Grid container sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} error={!!errors.atitle} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="title" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="atitle *"
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles.map((title, index) => (
                      <MenuItem key={index} value={title.id}>
                        {/* {title.title} */}
                        {language == "en" ? title?.title : title?.titleMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="atitle"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.atitle ? errors.atitle.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="firstName" />}
            {...register("afirstName")}
            error={!!errors.afirstName}
            helperText={errors?.afirstName ? errors.afirstName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="middleName" />}
            {...register("amiddleName")}
            error={!!errors.amiddleName}
            helperText={errors?.amiddleName ? errors.amiddleName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="lastName" />}
            {...register("alastName")}
            error={!!errors.alastName}
            helperText={errors?.alastName ? errors.alastName.message : null}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PersonalDetails;
