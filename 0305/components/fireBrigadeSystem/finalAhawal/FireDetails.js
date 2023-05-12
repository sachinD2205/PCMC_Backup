import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  handleSubmit,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import urls from "../../../URLS/urls";
import { useRouter } from "next/router";

// import style from "../../../../../styles/fireBrigadeSystem/view.module.css";

import { useSelector } from "react-redux";

// http://localhost:4000/hawkerManagementSystem/transactions/components/FireDetails
const FireDetails = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  const router = useRouter();

  const exitApp = () => {
    swal({
      title: "Are you sure you want to exit app?",
      text: "Once exit, you will not be able to recover data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // swal("Poof! Your imaginary file has been deleted!", {
        //   icon: "success",
        // });
        router.push({
          pathname: "/FireBrigadeSystem/transactions/finalAhawal",
        });
      } else {
        swal("Your data will be safe");
      }
    });
  };

  const [reason, setReason] = useState();
  const [showVardiOther, setShowVardiOther] = useState([]);
  const [showFireOther, setShowFireOther] = useState([]);
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState([]);
  const [vardiTypes, setVardiTypes] = useState();
  const [userLst, setUserLst] = useState([]);

  const [lossAmount, setLossAmount] = React.useState();
  const [insurrancePolicy, setInsurrancePolicy] = React.useState();
  const [fireEquipmentsAvailable, setFireEquipmentsAvailable] =
    React.useState();

  const language = useSelector((state) => state?.labels.language);

  useEffect(() => {
    getPinCode();
    getVardiTypes();
    getFireReason();
    getSubVardiTypes();
  }, []);

  const [subVardiType, setSubVardiType] = useState();

  // get Vardi Types
  const getSubVardiTypes = () => {
    axios
      .get(
        `${urls.FbsURL}/transaction/subTypeOfVardi/getSubTypeOfVardiMasterData`
      )
      .then((res) => {
        console.log("sub", res?.data);
        setSubVardiType(res?.data);
      });
  };

  // get reason of fire
  const getFireReason = () => {
    axios.get(`${urls.FbsURL}/mstReasonOfFire/get`).then((res) => {
      setReason(res?.data);
    });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`)
      .then((res) => {
        setVardiTypes(res?.data);
      });
  };

  // fetch pin code from cfc
  const getPinCode = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`)
      .then((res) => {
        console.log("pin", res?.data?.pinCode);
        setCrPinCodes(res?.data?.pinCode);
      })
      .catch((err) => console.log(err));
  };

  // useEffect(() => {
  //   if (router.query.pageMode == "Edit") {
  //     console.log("hello", router.query.informerName);
  //     setBtnSaveText("Update");

  //     // setValue("informerName", router.query.informerName);
  //     reset(router.query);
  //   }
  // }, []);

  useEffect(() => {
    if (router.query.pageMode === "Edit" || router.query.pageMode === "View")
      reset(router.query);
  }, []);

  // Titles
  const [titles, setTitles] = useState([]);

  //
  const [crPincodes, setCrPinCodes] = useState([]);

  // getTitles
  // const getTitles = () => {
  //   axios
  //     .get(`${urls.CFCURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setTitles(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           title: row.title,
  //         }))
  //       );
  //     });
  // };

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  // const getGenders = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setGenders(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           gender: row.gender,
  //         }))
  //       );
  //     });
  // };

  // casts
  const [casts, setCasts] = useState([]);

  // getCasts
  // const getCasts = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setCasts(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           cast: row.cast,
  //         }))
  //       );
  //     });
  // };

  // Religions
  const [religions, setReligions] = useState([]);

  // getReligions
  // const getReligions = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setReligions(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           religion: row.religion,
  //         }))
  //       );
  //     });
  // };

  // subCasts
  const [subCasts, setSubCast] = useState([]);

  // getSubCast
  // const getSubCast = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setSubCast(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           subCast: row.subCast,
  //         }))
  //       );
  //     });
  // };

  // typeOfDisabilitys
  const [typeOfDisabilitys, setTypeOfDisability] = useState([]);

  // getTypeOfDisability
  // const getTypeOfDisability = () => {
  //   axios
  //     .get(`${urls.FbsURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setTypeOfDisability(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           typeOfDisability: row.typeOfDisability,
  //         }))
  //       );
  //     });
  // };

  // useEffect
  // useEffect(() => {
  //   getTitles();
  //   getTypeOfDisability();
  //   getGenders();
  //   getCasts();
  //   getSubCast();
  //   getReligions();
  // }, []);

  return (
    <>
      <Box className={styles.tableHead}>
        <Box className={styles.feildHead}>
          {<FormattedLabel id="informerDetails" />}
        </Box>
      </Box>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            // size="small"
            id="standard-basic"
            label={<FormattedLabel id="informerName" />}
            variant="standard"
            {...register("informerName")}
            error={!!errors.informerName}
            helperText={
              errors?.informerName ? errors.informerName.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="informerMiddleName" />}
            variant="standard"
            {...register("informerMiddleName")}
            error={!!errors.informerMiddleName}
            helperText={
              errors?.informerMiddleName
                ? errors.informerMiddleName.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="informerLastName" />}
            variant="standard"
            {...register("informerLastName")}
            error={!!errors.informerLastName}
            helperText={
              errors?.informerLastName ? errors.informerLastName.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="informerNameMr" />}
            variant="standard"
            {...register("informerNameMr")}
            error={!!errors.informerNameMr}
            helperText={
              errors?.informerNameMr ? errors.informerNameMr.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="informerMiddleNameMr" />}
            variant="standard"
            {...register("informerMiddleNameMr")}
            error={!!errors.informerMiddleNameMr}
            helperText={
              errors?.informerMiddleNameMr
                ? errors.informerMiddleNameMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="informerLastNameMr" />}
            variant="standard"
            {...register("informerLastNameMr")}
            error={!!errors.informerLastNameMr}
            helperText={
              errors?.informerLastNameMr
                ? errors.informerLastNameMr.message
                : null
            }
          />
        </Grid>
      </Grid>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="area" />}
            variant="standard"
            {...register("area")}
            error={!!errors.area}
            helperText={errors?.area ? errors.area.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="city" />}
            variant="standard"
            {...register("city")}
            error={!!errors.city}
            helperText={errors?.city ? errors.city.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {/* <FormControl
                      variant="standard"
                      sx={{ width: "80%" }}
                      error={!!errors.pinCode}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="pincode" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="pincode" />}
                          >
                            {crPincodes &&
                              crPincodes.map((crPincode, index) => (
                                <MenuItem key={index} value={crPincode.id}>
                                  {crPincode.pinCode}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="pinCode"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.pinCode ? errors.pinCode.message : null}
                      </FormHelperText>
                    </FormControl> */}
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="email" />}
            variant="standard"
            {...register("mailID")}
            error={!!errors.mailID}
            helperText={errors?.mailID ? errors.mailID.message : null}
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="areaMr" />}
            variant="standard"
            {...register("areaMr")}
            error={!!errors.areaMr}
            helperText={errors?.areaMr ? errors.areaMr.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="cityMr" />}
            variant="standard"
            {...register("cityMr")}
            error={!!errors.cityMr}
            helperText={errors?.cityMr ? errors.cityMr.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="contactNumber" />}
            variant="standard"
            {...register("contactNumber")}
            error={!!errors.contactNumber}
            helperText={
              errors?.contactNumber ? errors.contactNumber.message : null
            }
          />
        </Grid>
      </Grid>

      <br />
      <br />

      <Box className={styles.tableHead}>
        <Box className={styles.feildHead}>
          {<FormattedLabel id="vardiDetails" />}
        </Box>
      </Box>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="occurancePlace" />}
            variant="standard"
            {...register("vardiPlace")}
            error={!!errors.vardiPlace}
            helperText={errors?.vardiPlace ? errors.vardiPlace.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="occurancePlaceMr" />}
            variant="standard"
            {...register("vardiPlaceMr")}
            error={!!errors.vardiPlaceMr}
            helperText={
              errors?.vardiPlaceMr ? errors.vardiPlaceMr.message : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <FormControl error={!!errors.departureTime} sx={{ width: "80%" }}>
            <Controller
              control={control}
              defaultValue={null}
              name="departureTime"
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <TimePicker
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes", "seconds"]}
                    inputFormat="HH:mm:ss"
                    mask="__:__:__"
                    label="Vardi Dispatch Time"
                    value={field.value}
                    onChange={(time) => {
                      field.onChange(time);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{ width: "80%" }}
                        size="small"
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.departureTime ? errors.departureTime.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="landmark" />}
            variant="standard"
            {...register("landmark")}
            error={!!errors.landmark}
            helperText={errors?.landmark ? errors.landmark.message : null}
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="landmarkMr" />}
            variant="standard"
            {...register("landmarkMr")}
            error={!!errors.landmarkMr}
            helperText={errors?.landmarkMr ? errors.landmarkMr.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            sx={{ minWidth: "80%" }}
            variant="standard"
            error={!!errors.typeOfVardiId}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="typeOfVardi" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  fullWidth
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                    setShowVardiOther(value.target.value);
                  }}
                  label="Type of Vardi"
                >
                  {vardiTypes &&
                    vardiTypes.map((vardi, index) => (
                      <MenuItem key={index} value={vardi.id}>
                        {language == "en" ? vardi.vardiName : vardi.vardiNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="typeOfVardiId"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.typeOfVardiId ? errors.typeOfVardiId.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            sx={{ minWidth: "80%" }}
            variant="standard"
            error={!!errors.typeOfVardiId}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="subTypesOfVardi" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  fullWidth
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                  }}
                  label="Sub Type Of Vardi"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {subVardiType &&
                    subVardiType
                      .filter((u) => u.vardiTypeId == showVardiOther)
                      .map((vardi, index) => (
                        <MenuItem key={index} value={vardi.id}>
                          {language == "en"
                            ? vardi.subVardiName
                            : vardi.subVardiNameMr}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="subTypeOfVardi"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.typeOfVardiId ? errors.typeOfVardiId.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="otherVardiType" />}
            variant="standard"
            {...register("otherVardiType")}
            error={!!errors.otherVardiType}
            helperText={
              errors?.otherVardiType ? errors.otherVardiType.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            variant="standard"
            sx={{ minWidth: "80%" }}
            // size="small"
            error={!!errors.reasonOfFire}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="reasonOfFire" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  // onChange={(value) => field.onChange(value)}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                    setShowFireOther(value.target.value);
                  }}
                  label={<FormattedLabel id="reasonOfFire" />}
                >
                  {reason &&
                    reason.map((res, index) => (
                      <MenuItem key={index} value={res.id}>
                        {language == "en"
                          ? res.reasonOfFire
                          : res.reasonOfFireMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="reasonOfFire"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.reasonOfFire ? errors.reasonOfFire.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            defaultValue={null}
            label={<FormattedLabel id="otherReasonOfFire" />}
            variant="standard"
            {...register("otherReasonOfFire")}
            error={!!errors.otherReasonOfFire}
            helperText={
              errors?.otherReasonOfFire
                ? errors.otherReasonOfFire.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            variant="standard"
            sx={{ minWidth: "80%" }}
            error={!!errors.nameOfSubFireOfficer}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* Name of Subfire Officer/Station Officer */}
              {<FormattedLabel id="nameOfSubFireOfficer" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="List"
                >
                  {/* {userLst &&
                              userLst
                                .filter((u) => u.desg === "SFO")
                                .map((user, index) => (
                                  <MenuItem key={index} value={user.id}>
                                    {user.firstName +
                                      " " +
                                      (typeof user.middleName === "string"
                                        ? user.middleName
                                        : " ") +
                                      " " +
                                      user.lastName}
                                  </MenuItem>
                                ))} */}
                  {userLst &&
                    userLst
                      .filter((u) => u.designation === 39)
                      .map((user, index) => (
                        <MenuItem
                          key={index}
                          value={user.id}
                          sx={{
                            display:
                              typeof user.firstNameEn === "string"
                                ? "flex"
                                : "none",
                          }}
                        >
                          {(typeof user.firstNameEn === "string" &&
                            user.firstNameEn) +
                            " " +
                            (typeof user.middleNameEn === "string"
                              ? user.middleNameEn
                              : " ") +
                            " " +
                            (typeof user.lastNameEn === "string" &&
                              user.lastNameEn)}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="nameOfSubFireOfficer"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.nameOfSubFireOfficer
                ? errors.nameOfSubFireOfficer.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          {" "}
          <FormControl
            variant="standard"
            sx={{ minWidth: "80%" }}
            error={!!errors.nameOfMainFireOfficer}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* Name of main Fire Officer */}
              {<FormattedLabel id="nameOfMainFireOfficer" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="List"
                >
                  {userLst &&
                    userLst
                      .filter((u) => u.designation === 40)
                      .map((user, index) => (
                        <MenuItem
                          key={index}
                          value={user.id}
                          sx={{
                            display:
                              typeof user.firstNameEn === "string"
                                ? "flex"
                                : "none",
                          }}
                        >
                          {(typeof user.firstNameEn === "string" &&
                            user.firstNameEn) +
                            " " +
                            (typeof user.middleNameEn === "string"
                              ? user.middleNameEn
                              : " ") +
                            " " +
                            (typeof user.lastNameEn === "string" &&
                              user.lastNameEn)}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="nameOfMainFireOfficer"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.nameOfMainFireOfficernameOfMainFireOfficer
                ? errors.nameOfMainFireOfficernameOfMainFireOfficer.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="manPowerLoss" />}
            variant="standard"
            {...register("manPowerLoss")}
            error={!!errors.manPowerLoss}
            helperText={
              errors?.manPowerLoss ? errors.manPowerLoss.message : null
            }
          />
        </Grid>
      </Grid>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
            <FormLabel component="legend">is tenanat have any loss</FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="isLossInAmount"
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    // setSlipHandedOverTo(value.target.value);
                    onChange={(value) => {
                      console.log("value", value.target.value);
                      // field.onChange(value);
                      setLossAmount(value.target.value);
                    }}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="No"
                    onChange={(value) => {
                      console.log("value", value.target.value);
                      // field.onChange(value);
                      setLossAmount(value.target.value);
                    }}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        {lossAmount == "yes" ? (
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "80%" }}
              id="standard-basic"
              label={<FormattedLabel id="lossInAmount" />}
              variant="standard"
              {...register("lossInAmount")}
              error={!!errors.lossInAmount}
              helperText={
                errors?.lossInAmount ? errors.lossInAmount.message : null
              }
            />
          </Grid>
        ) : (
          <Grid item xs={4} className={styles.feildres}></Grid>
        )}

        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>

      <br />
      <Box className={styles.tableHead}>
        <Box className={styles.feildHead}>
          {<FormattedLabel id="otherDetails" />}
        </Box>
      </Box>
      <br />
      <Grid
        container
        // spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={11} className={styles.feildres}>
          <TextField
            fullWidth
            id="standard-basic"
            label={<FormattedLabel id="firedThingsDuringAccuse" />}
            variant="standard"
            multiline
            maxRows={2}
            {...register("firedThingsDuringAccuse")}
            error={!!errors.firedThingsDuringAccuse}
            helperText={
              errors?.firedThingsDuringAccuse
                ? errors.firedThingsDuringAccuse.message
                : null
            }
          />
        </Grid>
        <Grid item xs={11} className={styles.feildres}>
          <TextField
            fullWidth
            id="standard-basic"
            label={<FormattedLabel id="firedThingsDuringAccuseMr" />}
            variant="standard"
            multiline
            maxRows={2}
            {...register("firedThingsDuringAccuseMr")}
            error={!!errors.firedThingsDuringAccuseMr}
            helperText={
              errors?.firedThingsDuringAccuseMr
                ? errors.firedThingsDuringAccuseMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
            <FormLabel component="legend">Have Insurrance Policy?</FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="insurancePolicyApplicable"
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    // setSlipHandedOverTo(value.target.value);
                    onChange={(value) => {
                      console.log("value", value.target.value);
                      // field.onChange(value);
                      setInsurrancePolicy(value.target.value);
                    }}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="No"
                    onChange={(value) => {
                      console.log("value", value.target.value);
                      // field.onChange(value);
                      setInsurrancePolicy(value.target.value);
                    }}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        {insurrancePolicy == "yes" ? (
          <>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                sx={{ width: "80%" }}
                multiline
                maxRows={2}
                id="standard-basic"
                label={<FormattedLabel id="insurancePolicyDetails" />}
                variant="standard"
                {...register("insurancePolicyDetails")}
                error={!!errors.insurancePolicyDetails}
                helperText={
                  errors?.insurancePolicyDetails
                    ? errors.insurancePolicyDetails.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                sx={{ width: "80%" }}
                multiline
                maxRows={2}
                id="standard-basic"
                label={<FormattedLabel id="insurancePolicyDetailsMr" />}
                variant="standard"
                {...register("insurancePolicyDetailsMr")}
                error={!!errors.insurancePolicyDetailsMr}
                helperText={
                  errors?.insurancePolicyDetailsMr
                    ? errors.insurancePolicyDetailsMr.message
                    : null
                }
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={4} className={styles.feildres}></Grid>
            <Grid item xs={4} className={styles.feildres}></Grid>
          </>
        )}

        <Grid item xs={4} className={styles.feildres}>
          <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
            <FormLabel component="legend">Have Insurrance Policy?</FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="isFireEquipmentsAvailable"
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    // setSlipHandedOverTo(value.target.value);
                    onChange={(value) => {
                      console.log("value", value.target.value);
                      // field.onChange(value);
                      setFireEquipmentsAvailable(value.target.value);
                    }}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="No"
                    onChange={(value) => {
                      console.log("value", value.target.value);
                      // field.onChange(value);
                      setFireEquipmentsAvailable(value.target.value);
                    }}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        {fireEquipmentsAvailable == "yes" ? (
          <>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                sx={{ width: "80%" }}
                multiline
                maxRows={2}
                id="standard-basic"
                label={<FormattedLabel id="fireEquipments" />}
                variant="standard"
                {...register("fireEquipments")}
                error={!!errors.fireEquipments}
                helperText={
                  errors?.fireEquipments ? errors.fireEquipments.message : null
                }
              />
            </Grid>

            <Grid item xs={4} className={styles.feildres}>
              <TextField
                sx={{ width: "80%" }}
                multiline
                maxRows={2}
                id="standard-basic"
                label={<FormattedLabel id="fireEquipmentsMr" />}
                variant="standard"
                {...register("fireEquipmentsMr")}
                error={!!errors.fireEquipmentsMr}
                helperText={
                  errors?.fireEquipmentsMr
                    ? errors.fireEquipmentsMr.message
                    : null
                }
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={4} className={styles.feildres}></Grid>
            <Grid item xs={4} className={styles.feildres}></Grid>
          </>
        )}
      </Grid>
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* <Grid container spacing={2} sx={{ paddingBottom: "0px" }}>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            className={styles.button}
            endIcon={<ExitToAppIcon />}
            onClick={exitApp}
          >
            {<FormattedLabel id="exit" />}
          </Button>
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            className={styles.button}
            endIcon={<ClearIcon />}
            onClick={() => cancellButton()}
          >
            {<FormattedLabel id="clear" />}
          </Button>
        </Grid>

      </Grid> */}
    </>
  );
};

export default FireDetails;

// Address
// House Number
// Buildig name
// Road name
// area
// city
// pincode
