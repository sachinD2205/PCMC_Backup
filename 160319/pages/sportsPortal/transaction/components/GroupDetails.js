import {
  Button,
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
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import URLS from "../../../../URLS/urls";

const sportsBookingGroupDetailsDao = () => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Titles
  const [titles, setTitles] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  // getTitles
  const getTitles = () => {
    axios.get(`${URLS.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
        })),
      );
    });
  };
  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`sportsBookingGroupDetailsDao.length`) >= 3) {
      setButtonValue(true);
    } else {
      appendFun();
      // reset();
      setButtonValue(false);
    }
  };

  const appendFun = () => {
    append({
      title: "",
      prState: "",
      prCityName: "",
      permanentAddress: "",
      crState: "",
      crCityName: "",
      currentAddress: "",
      emailAddress: "",
      aadharNo: "",
      mobile: "",
      age: "",
      applicantLastName: "",
      applicantMiddleName: "",
      applicantFirstName: "",
      dateOfBirth: "",
    });
  };

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "sportsBookingGroupDetailsDao", // unique name for your Field Array
  });

  //useEffect
  useEffect(() => {
    if (getValues(`sportsBookingGroupDetailsDao.length`) == 0) {
      appendFun();
    }
  }, []);

  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
        })),
      );
    });
  };

  // crPincodes
  const [crPincodes, setCrPinCodes] = useState([]);

  // getCrPinCodes
  const getCrPinCodes = () => {
    axios.get(`${URLS.CFCURL}/master/pinCode/getAll`).then((r) => {
      setCrPinCodes(
        r.data.pinCode.map((row) => ({
          id: row.id,
          crPincode: row.pinCode,
        })),
      );
    });
  };

  // const addressChange = (e) => {
  //   console.log('Clicked');
  //   if (e.target.checked) {
  //     // `sportsBookingGroupDetailsDao.${index}.firstName`
  //     setValue(
  //       'sportsBookingGroupDetailsDao.${index}.prCityName',
  //       getValues('sportsBookingGroupDetailsDao.${index}.crCityName')
  //     );
  //     setValue(
  //       'sportsBookingGroupDetailsDao.${index}.prState',
  //       getValues('sportsBookingGroupDetailsDao.${index}.crState')
  //     );
  //     setValue(
  //       'sportsBookingGroupDetailsDao.${index}.prPincode',
  //       getValues('sportsBookingGroupDetailsDao.${index}.crPincode')
  //     );
  //     setValue(
  //       'sportsBookingGroupDetailsDao.${index}.permanentAddress',
  //       getValues('sportsBookingGroupDetailsDao.${index}.currentAddress')
  //     );
  //     setValue(
  //       'sportsBookingGroupDetailsDao.${index}.prLatitude',
  //       getValues('sportsBookingGroupDetailsDao.${index}.crLattitude')
  //     );
  //     setValue(
  //       'sportsBookingGroupDetailsDao.${index}.prLongitude',
  //       getValues('sportsBookingGroupDetailsDao.${index}.crLongitude')
  //     );
  //   } else {
  //     setValue('sportsBookingGroupDetailsDao.${index}.prCityName', '');
  //     setValue('sportsBookingGroupDetailsDao.${index}.prState', '');
  //     setValue('sportsBookingGroupDetailsDao.${index}.prPincode', '');
  //     setValue('sportsBookingGroupDetailsDao.${index}.permanentAddress', '');
  //     setValue('sportsBookingGroupDetailsDao.${index}.prLatitude', '');
  //     setValue('sportsBookingGroupDetailsDao.${index}.prLongitude', '');
  //   }
  // };

  // useEffect
  useEffect(() => {
    getTitles();
    getGenders();
    getCrPinCodes();
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
          <FormattedLabel id="sportsBookingGroupDetailsDao" />
        </strong>
      </div>

      {fields.map((sportsBookingGroupDetailsDao, index) => {
        return (
          <>
            {/* <div className={styles.row}>
          <Typography variant="h6" sx={{ marginTop: 4 }}>
            Group Details
          </Typography>
        </div> */}

            <div
              className={styles.row}
              // style={{
              //   height: '7px',
              //   width: '200px',
              // }}
            >
              <div
                className={styles.details}
                style={{
                  marginRight: "820px",
                }}
              >
                <div
                  className={styles.h1Tag}
                  style={{
                    height: "40px",
                    width: "300px",
                  }}
                >
                  <h3
                    style={{
                      color: "black",
                      marginTop: "7px",
                    }}
                  >
                    Member
                    {`: ${index + 1}`}
                  </h3>
                </div>
              </div>
            </div>
            <Grid
              container
              sx={{
                marginLeft: 5,
                marginTop: 1,
                marginBottom: 5,
                align: "center",
              }}
            >
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="title" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Title *"
                        key={sportsBookingGroupDetailsDao.id}
                        // {...register(`sportsBookingGroupDetailsDao.${index}.title`)}
                        // {...register('title')}
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {titles &&
                          titles.map((title, index) => (
                            <MenuItem key={index} value={title.id}>
                              {title.title}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`sportsBookingGroupDetailsDao.${index}.title`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.title ? errors.title.message : null}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="firstName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(`sportsBookingGroupDetailsDao.${index}.applicantFirstName`)}
                  error={!!errors.applicantFirstName}
                  helperText={errors?.applicantFirstName ? errors.applicantFirstName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="middleName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(`sportsBookingGroupDetailsDao.${index}.applicantMiddleName`)}
                  error={!!errors.applicantMiddleName}
                  helperText={errors?.applicantMiddleName ? errors.applicantMiddleName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="lastName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(`sportsBookingGroupDetailsDao.${index}.applicantLastName`)}
                  error={!!errors.applicantLastName}
                  helperText={errors?.applicantLastName ? errors.applicantLastName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="gender" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Gender *"
                      >
                        {genders &&
                          genders.map((gender, index) => (
                            <MenuItem key={index} value={gender.id}>
                              {gender.gender}
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
                <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
                  {/* <FormControl sx={{ marginTop: 0 }}> */}
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    defaultValue={null}
                    format="DD/MM/YYYY"
                    key={sportsBookingGroupDetailsDao.id}
                    {...register(`sportsBookingGroupDetailsDao.${index}.dateOfBirth`)}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="dateOfBirth" />}</span>}
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                            let today = new Date();
                            let dob = new Date(date);
                            var age = today.getFullYear() - dob.getFullYear();
                            setValue(`sportsBookingGroupDetailsDao.${index}.age`, age);
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
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  // label={<FormattedLabel id="Age" />}
                  label="Age"
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(`sportsBookingGroupDetailsDao.${index}.age`)}
                  error={!!errors.age}
                  helperText={errors?.age ? errors.age.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="mobileNo" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(`sportsBookingGroupDetailsDao.${index}.mobile`)}
                  error={!!errors.mobile}
                  helperText={errors?.mobile ? errors.mobile.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="aadharNo" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(`sportsBookingGroupDetailsDao.${index}.aadharNo`)}
                  error={!!errors.aadharNo}
                  helperText={errors?.aadharNo ? errors.aadharNo.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="emailAddress" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(`sportsBookingGroupDetailsDao.${index}.emailAddress`)}
                  error={!!errors.emailAddress}
                  helperText={errors?.emailAddress ? errors.emailAddress.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="currentAddress" />}
                  key={sportsBookingGroupDetailsDao.id}
                  // {...register('currentAddress')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.currentAddress`)}
                  error={!!errors.currentAddress}
                  helperText={errors?.currentAddress ? errors.currentAddress.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  // disabled
                  defaultValue={"Pimpri Chinchwad"}
                  label={<FormattedLabel id="cityName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  // {...register('crCityName')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.crCityName`)}
                  error={!!errors.crCityName}
                  helperText={errors?.crCityName ? errors.crCityName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  // disabled
                  defaultValue={"Maharashtra"}
                  label={<FormattedLabel id="state" />}
                  key={sportsBookingGroupDetailsDao.id}
                  // {...register('crState')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.crState`)}
                  error={!!errors.crState}
                  helperText={errors?.crState ? errors.crState.message : null}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.crPincode}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="pinCode" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Pin Code *"
                      >
                        {crPincodes &&
                          crPincodes.map((crPincode, index) => (
                            <MenuItem key={index} value={crPincode.id}>
                              {crPincode.crPincode}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="crPincode"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.crPincode ? errors.crPincode.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  autoFocus
                  id="standard-basic"
                  // label={<FormattedLabel id="crPincode" />}
                  label="Pincode*"
                  // {...register('crPincode')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.crPincode`)}
                  error={!!errors.crPincode}
                  helperText={errors?.crPincode ? errors.crPincode.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  // label={<FormattedLabel id="crLattitude" />}
                  label="Lattitude *"
                  // {...register('crLattitude')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.crLattitude`)}
                  error={!!errors.crLattitude}
                  helperText={errors?.crLattitude ? errors.crLattitude.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  //  InputLabelProps={{ shrink: true }}
                  id="standard-basic"
                  // label={<FormattedLabel id="crLongitud"></FormattedLabel>}
                  label="Longitute *"
                  // {...register('crLongitude')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.crLongitude`)}
                  error={!!errors.crLongitud}
                  helperText={errors?.crLongitud ? errors.crLongitud.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <Typography>
                      <FormattedLabel id="checkBox" />
                    </Typography>
                  }
                  // {...register('addressCheckBox')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.addressCheckBox`)}
                  onChange={(e) => {
                    // addressChange(e);

                    console.log("Clicked");
                    if (e.target.checked) {
                      // `sportsBookingGroupDetailsDao.${index}.firstName`
                      setValue(
                        `sportsBookingGroupDetailsDao.${index}.prCityName`,
                        getValues(`sportsBookingGroupDetailsDao.${index}.crCityName`),
                      );
                      setValue(
                        `sportsBookingGroupDetailsDao.${index}.prState`,
                        getValues(`sportsBookingGroupDetailsDao.${index}.crState`),
                      );
                      setValue(
                        `sportsBookingGroupDetailsDao.${index}.prPincode`,
                        getValues(`sportsBookingGroupDetailsDao.${index}.crPincode`),
                      );
                      setValue(
                        `sportsBookingGroupDetailsDao.${index}.permanentAddress`,
                        getValues(`sportsBookingGroupDetailsDao.${index}.currentAddress`),
                      );
                      setValue(
                        `sportsBookingGroupDetailsDao.${index}.prLatitude`,
                        getValues(`sportsBookingGroupDetailsDao.${index}.crLattitude`),
                      );
                      setValue(
                        `sportsBookingGroupDetailsDao.${index}.prLongitude`,
                        getValues(`sportsBookingGroupDetailsDao.${index}.crLongitude`),
                      );
                    } else {
                      setValue(`sportsBookingGroupDetailsDao.${index}.prCityName`, "");
                      setValue(`sportsBookingGroupDetailsDao.${index}.prState`, "");
                      setValue(`sportsBookingGroupDetailsDao.${index}.prPincode`, "");
                      setValue(`sportsBookingGroupDetailsDao.${index}.permanentAddress`, "");
                      setValue(`sportsBookingGroupDetailsDao.${index}.prLatitude`, "");
                      setValue(`sportsBookingGroupDetailsDao.${index}.prLongitude`, "");
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="permanentAddress" />}
                  key={sportsBookingGroupDetailsDao.id}
                  // {...register('permanentAddress')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.permanentAddress`)}
                  error={!!errors.permanentAddress}
                  helperText={errors?.permanentAddress ? errors.permanentAddress.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  // disabled
                  defaultValue={"Pimpri Chinchwad"}
                  InputLabelProps={{ shrink: true }}
                  key={sportsBookingGroupDetailsDao.id}
                  label={<FormattedLabel id="cityName" />}
                  {...register(`sportsBookingGroupDetailsDao.${index}.prCityName`)}
                  // {...register('prCityName')}
                  error={!!errors.prCityName}
                  helperText={errors?.prCityName ? errors.prCityName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  disabled
                  defaultValue={"Maharashtra"}
                  label={<FormattedLabel id="state" />}
                  key={sportsBookingGroupDetailsDao.id}
                  // {...register('prState')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.prState`)}
                  error={!!errors.prState}
                  helperText={errors?.prState ? errors.prState.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  label="PinCode *"
                  // {<FormattedLabel id="Latitude" />}
                  variant="standard"
                  // {...register('prPincode')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.prPincode`)}
                  error={!!errors.prPincode}
                  helperText={errors?.prPincode ? "Pin Code  is Required !!!" : null}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  label="Latitude *"
                  // {<FormattedLabel id="Latitude" />}
                  variant="standard"
                  // {...register('prLatitude')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.prLatitude`)}
                  error={!!errors.prPinCode}
                  helperText={errors?.prPinCode ? "Pin Code  is Required !!!" : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  label="Longitute *" //{<FormattedLabel id="Longitude" />}
                  variant="standard"
                  // {...register('prLongitude')}
                  {...register(`sportsBookingGroupDetailsDao.${index}.prLongitude`)}
                  error={!!errors.prPinCode}
                  helperText={errors?.prPinCode ? "Pin Code  is Required !!!" : null}
                />
              </Grid>
            </Grid>
          </>
        );
      })}
      {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.crPincode}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="pinCode" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Pin Code *"
                      >
                        {crPincodes &&
                          crPincodes.map((prPincode, index) => (
                            <MenuItem key={index} value={prPincode.id}>
                              {prPincode.prPincode}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="prPincode"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.prPincode ? errors.prPincode.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid> */}
      <div className={styles.row} style={{ marginTop: 50 }}>
        <Button disabled={btnValue} onClick={() => buttonValueSetFun()} variant="contained">
          Add Member
        </Button>
      </div>
    </>
  );
};

export default sportsBookingGroupDetailsDao;
