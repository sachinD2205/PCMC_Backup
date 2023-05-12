import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Box,
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
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./view.module.css";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import urls from "../../URLS/urls";

const Form = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [userDetails, setUserDetails] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const router = useRouter();
  const [activeStep, setActiveStep] = useState();
  const [checked, setChecked] = useState(true);

  //   const steps = getSteps();
  const dispach = useDispatch();
  const [titles, setTitles] = useState([
    {
      id: 1,
      titleEn: "",
      titleMr: "",
    },
  ]);

  // const user = useSelector((state) => {
  //   console.log("userDetails", state?.user?.user?.userDao)
  //   return state?.user?.user?.userDao
  // })

  const userCitizen = useSelector((state) => {
    console.log("userDetails", state?.user?.user);
    return state?.user?.user;
  });

  const userCFC = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.userDao);
    return state?.user?.user?.userDao;
  });

  const logedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state?.labels.language);

  useEffect(() => {
    if (language === "en") {
      if (logedInUser === "citizenUser") {
        setValue("firstName", userCitizen?.firstName);
        setValue("middleName", userCitizen?.middleName);
        setValue("surname", userCitizen?.surname);
        setValue("email", userCitizen?.emailID);
        setValue("houseNo", userCitizen?.pflatBuildingNo);
        setValue("buildingNo", userCitizen?.pflatBuildingNo);
        setValue("roadName", userCitizen?.proadName);
        setValue("area", userCitizen?.plandmark);
        setValue("location", userCitizen?.pcity);
        setValue("city", userCitizen?.pcity);
        setValue("pincode", userCitizen?.ppincode);
        setValue("title", userCitizen?.title);
        /////////////////////////////////////////////////////////////

        setValue("title", userCitizen?.title);
        setValue("firstNameMr", userCitizen?.firstNamemr);
        setValue("middleNameMr", userCitizen?.middleNamemr);
        setValue("surnameMr", userCitizen?.surnamemr);
        setValue("email", userCitizen?.emailID);
        setValue("houseNoMr", userCitizen?.pflatBuildingNoMr);
        setValue("buildingNoMr", userCitizen?.pflatBuildingNoMr);
        setValue("roadNameMr", userCitizen?.proadNameMr);
        setValue("areaMr", userCitizen?.plandmarkMr);
        setValue("locationMr", userCitizen?.pcityMr);
        setValue("cityMr", userCitizen?.pcityMr);
        setValue("pincodeMr", userCitizen?.ppincode);
      }
    } else {
      if (logedInUser === "citizenUser") {
        setValue("title", userCitizen?.title);
        setValue("firstNameMr", userCitizen?.firstNamemr);
        setValue("middleNameMr", userCitizen?.middleNamemr);
        setValue("surnameMr", userCitizen?.surnamemr);
        setValue("email", userCitizen?.emailID);
        setValue("houseNoMr", userCitizen?.pflatBuildingNoMr);
        setValue("buildingNoMr", userCitizen?.pflatBuildingNoMr);
        setValue("roadNameMr", userCitizen?.proadNameMr);
        setValue("areaMr", userCitizen?.plandmarkMr);
        setValue("locationMr", userCitizen?.pcityMr);
        setValue("cityMr", userCitizen?.pcityMr);
        setValue("pincodeMr", userCitizen?.ppincode);
      }
    }
  }, [userCitizen, language]);

  useEffect(() => {
    if (logedInUser === "cfcUser") {
      setValue("firstName", userCFC?.firstNameEn);
      setValue("middleName", userCFC?.middleNameEn);
      setValue("surname", userCFC?.lastNameEn);
      setValue("email", userCFC?.email);
    }
  }, [userCFC]);

  useEffect(() => {
    getTitles();
  }, []);

  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r?.data?.title?.map((row) => ({
          id: row.id,
          titleEn: row.title,
          titleMr: row.titleMr,
        })),
      );
    });
  };

  const editRecord = (rows) => {
    setBtnSaveText("Update"), setID(rows.id), setIsOpenCollapse(true), setSlideChecked(true);
    reset(rows);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    businessType: "",
    businessSubType: "",
    businessSubTypePrefix: "",
    pinCode: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    businessType: "",
    businessSubType: "",
    businessSubTypePrefix: "",
    remark: "",
    id: null,
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  // View
  return (
    <Box>
      {/* <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {" "}
                {<FormattedLabel id="personalDetails" />}
              </h3>
            </div>
          </div> */}

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1%",
        }}
      >
        <Box
          className={styles.details1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "99%",
            height: "auto",
            overflow: "auto",
            padding: "0.5%",
            color: "black",
            fontSize: 17,
            fontWeight: 500,
            borderRadius: 100,
            letterSpacing: "1px",
          }}
        >
          <strong className={styles.fancy_link1}>
            <FormattedLabel id="personalDetailss" />
          </strong>
        </Box>
      </Box>

      <Grid
        container
        spacing={2}
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl error={!!errors.title}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="titles" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  autoFocus
                  // sx={{ width: "270px" }}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="titles" />}
                >
                  {titles &&
                    titles.map((title, index) => (
                      <MenuItem key={index} value={title.id}>
                        {language == "en"
                          ? //@ts-ignore
                            title.titleEn
                          : // @ts-ignore
                            title?.titleMr}
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

        {logedInUser === "departmentUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="firstName" />}
                variant="standard"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors?.firstName ? errors.firstName.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="firstNamemr" />}
                variant="standard"
                {...register("firstNameMr")}
                error={!!errors.firstNameMr}
                helperText={errors?.firstNameMr ? errors.firstNameMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="middleName" />}
                variant="standard"
                {...register("middleName")}
                error={!!errors.middleName}
                helperText={errors?.middleName ? errors.middleName.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="middleNamemr" />}
                variant="standard"
                {...register("middleNameMr")}
                error={!!errors.middleNameMr}
                helperText={errors?.middleNameMr ? errors.middleNameMr.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="lastName" />}
                variant="standard"
                {...register("surname")}
                error={!!errors.surname}
                helperText={errors?.surname ? errors.surname.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="lastNamemr" />}
                variant="standard"
                {...register("surnameMr")}
                error={!!errors.surnameMr}
                helperText={errors?.surnameMr ? errors.surnameMr.message : null}
              />
            </Grid>
          </>
        )}

        {logedInUser === "citizenUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={userCitizen ? true : false}
                InputLabelProps={{ shrink: userCitizen ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="firstName" />}
                variant="standard"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors?.firstName ? errors.firstName.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={userCitizen ? true : false}
                InputLabelProps={{ shrink: userCitizen ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="firstNamemr" />}
                variant="standard"
                {...register("firstNameMr")}
                error={!!errors.firstNameMr}
                helperText={errors?.firstNameMr ? errors.firstNameMr.message : null}
              />
            </Grid>
            {/* ////////////////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={userCitizen ? true : false}
                InputLabelProps={{ shrink: userCitizen ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="middleName" />}
                variant="standard"
                {...register("middleName")}
                error={!!errors.middleName}
                helperText={errors?.middleName ? errors.middleName.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={userCitizen ? true : false}
                InputLabelProps={{ shrink: userCitizen ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="middleNamemr" />}
                variant="standard"
                {...register("middleNameMr")}
                error={!!errors.middleNameMr}
                helperText={errors?.middleNameMr ? errors.middleNameMr.message : null}
              />
            </Grid>
            {/* ////////////////////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={userCitizen ? true : false}
                InputLabelProps={{ shrink: userCitizen ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="lastName" />}
                variant="standard"
                {...register("surname")}
                error={!!errors.surname}
                helperText={errors?.surname ? errors.surname.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={userCitizen ? true : false}
                InputLabelProps={{ shrink: userCitizen ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="lastNamemr" />}
                variant="standard"
                {...register("surnameMr")}
                error={!!errors.surnameMr}
                helperText={errors?.surnameMr ? errors.surnameMr.message : null}
              />
            </Grid>

            {/* ////////////////////////////////////////////// */}
          </>
        )}

        {logedInUser === "cfcUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="firstName" />}
                variant="standard"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors?.firstName ? errors.firstName.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="firstNamemr" />}
                variant="standard"
                {...register("firstNameMr")}
                error={!!errors.firstNameMr}
                helperText={errors?.firstNameMr ? errors.firstNameMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="middleName" />}
                variant="standard"
                {...register("middleName")}
                error={!!errors.middleName}
                helperText={errors?.middleName ? errors.middleName.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="middleNamemr" />}
                variant="standard"
                {...register("middleNameMr")}
                error={!!errors.middleNameMr}
                helperText={errors?.middleNameMr ? errors.middleNameMr.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="lastName" />}
                variant="standard"
                {...register("surname")}
                error={!!errors.surname}
                helperText={errors?.surname ? errors.surname.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // disabled={user ? true : false}
                // InputLabelProps={{ shrink: user ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="lastNamemr" />}
                variant="standard"
                {...register("surnameMr")}
                error={!!errors.surnameMr}
                helperText={errors?.surnameMr ? errors.surnameMr.message : null}
              />
            </Grid>
          </>
        )}

        {/* ///////////////////////////////ADDRESS IN citizenUser/////////////////////////////////// */}

        {logedInUser === "citizenUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled
                id="standard-basic"
                label={<FormattedLabel id="houseNumberEn" />}
                variant="standard"
                // inputProps={{ readOnly: true }}
                {...register("houseNo")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="houseNumberMr" />}
                variant="standard"
                {...register("houseNoMr")}
              />
            </Grid>
            {/* ////////////////////////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled
                id="standard-basic"
                label={<FormattedLabel id="flatBuildingNo" />}
                variant="standard"
                {...register("buildingNo")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="flatBuildingNomr" />}
                variant="standard"
                {...register("buildingNoMr")}
              />
            </Grid>

            {/* ///////////////////////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled
                id="standard-basic"
                label={<FormattedLabel id="roadName" />}
                variant="standard"
                {...register("roadName")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="roadNamesMr" />}
                variant="standard"
                {...register("roadNameMr")}
              />
            </Grid>

            {/* ///////////////////////////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled
                id="standard-basic"
                label={<FormattedLabel id="areasEn" />}
                variant="standard"
                {...register("area")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // sx={{ width: 280 }}
                id="standard-basic"
                label={<FormattedLabel id="areasMr" />}
                variant="standard"
                {...register("areaMr")}
              />
            </Grid>

            {/* ////////////////////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled
                id="standard-basic"
                label={<FormattedLabel id="lacationsEn" />}
                variant="standard"
                {...register("location")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="lacationsMr" />}
                variant="standard"
                {...register("locationMr")}
              />
            </Grid>
            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled
                id="standard-basic"
                label={<FormattedLabel id="citysEn" />}
                variant="standard"
                {...register("city")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="citysMr" />}
                variant="standard"
                {...register("cityMr")}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled
                id="standard-basic"
                label={<FormattedLabel id="pincodesEn" />}
                variant="standard"
                {...register("pincode")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="pincodesMr" />}
                variant="standard"
                {...register("pincodeMr")}
              />
            </Grid>

            {/* //////////////////////////////// */}
          </>
        )}

        {/* //////////////////////////////ADDRESS IN departmentUser//////////////////////////////////// */}

        {logedInUser === "departmentUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="houseNumberEn" />}
                variant="standard"
                {...register("houseNo")}
                error={!!errors.houseNo}
                helperText={errors?.houseNo ? errors.houseNo.message : null}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="houseNumberMr" />}
                variant="standard"
                {...register("houseNoMr")}
                error={!!errors.houseNoMr}
                helperText={errors?.houseNoMr ? errors.houseNoMr.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="flatBuildingNo" />}
                variant="standard"
                {...register("buildingNo")}
                error={!!errors.buildingNo}
                helperText={errors?.buildingNo ? errors.buildingNo.message : null}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="flatBuildingNomr" />}
                variant="standard"
                {...register("buildingNoMr")}
                error={!!errors.buildingNoMr}
                helperText={errors?.buildingNoMr ? errors.buildingNoMr.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="roadNamesEn" />}
                variant="standard"
                {...register("roadName")}
                error={!!errors.roadName}
                helperText={errors?.roadName ? errors.roadName.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="roadNamesMr" />}
                variant="standard"
                {...register("roadNameMr")}
                error={!!errors.roadNameMr}
                helperText={errors?.roadNameMr ? errors.roadNameMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // sx={{ width: 280 }}
                id="standard-basic"
                label={<FormattedLabel id="areasEn" />}
                variant="standard"
                {...register("area")}
                error={!!errors.area}
                helperText={errors?.area ? errors.area.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // sx={{ width: 280 }}
                id="standard-basic"
                label={<FormattedLabel id="areasMr" />}
                variant="standard"
                {...register("areaMr")}
                error={!!errors.areaMr}
                helperText={errors?.areaMr ? errors.areaMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="lacationsEn" />}
                variant="standard"
                {...register("location")}
                error={!!errors.location}
                helperText={errors?.location ? errors.location.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="lacationsMr" />}
                variant="standard"
                {...register("locationMr")}
                error={!!errors.locationMr}
                helperText={errors?.locationMr ? errors.locationMr.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="citysEn" />}
                variant="standard"
                {...register("city")}
                error={!!errors.city}
                helperText={errors?.city ? errors.city.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="citysMr" />}
                variant="standard"
                {...register("cityMr")}
                error={!!errors.cityMr}
                helperText={errors?.cityMr ? errors.cityMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="pincodesEn" />}
                variant="standard"
                {...register("pincode")}
                error={!!errors.pincode}
                helperText={errors?.pincode ? errors.pincode.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="pincodesMr" />}
                variant="standard"
                {...register("pincodeMr")}
                error={!!errors.pincodeMr}
                helperText={errors?.pincodeMr ? errors.pincodeMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}
          </>
        )}

        {/* //////////////////////////////ADDRESS IN departmentUser//////////////////////////////////// */}
        {logedInUser === "cfcUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="houseNumberEn" />}
                variant="standard"
                {...register("houseNo")}
                error={!!errors.houseNo}
                helperText={errors?.houseNo ? errors.houseNo.message : null}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="houseNumberMr" />}
                variant="standard"
                {...register("houseNoMr")}
                error={!!errors.houseNoMr}
                helperText={errors?.houseNoMr ? errors.houseNoMr.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="flatBuildingNo" />}
                variant="standard"
                {...register("buildingNo")}
                error={!!errors.buildingNo}
                helperText={errors?.buildingNo ? errors.buildingNo.message : null}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="flatBuildingNomr" />}
                variant="standard"
                {...register("buildingNoMr")}
                error={!!errors.buildingNoMr}
                helperText={errors?.buildingNoMr ? errors.buildingNoMr.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="roadNamesEn" />}
                variant="standard"
                {...register("roadName")}
                error={!!errors.roadName}
                helperText={errors?.roadName ? errors.roadName.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="roadNamesMr" />}
                variant="standard"
                {...register("roadNameMr")}
                error={!!errors.roadNameMr}
                helperText={errors?.roadNameMr ? errors.roadNameMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // sx={{ width: 280 }}
                id="standard-basic"
                label={<FormattedLabel id="areasEn" />}
                variant="standard"
                {...register("area")}
                error={!!errors.area}
                helperText={errors?.area ? errors.area.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                // sx={{ width: 280 }}
                id="standard-basic"
                label={<FormattedLabel id="areasMr" />}
                variant="standard"
                {...register("areaMr")}
                error={!!errors.areaMr}
                helperText={errors?.areaMr ? errors.areaMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="lacationsEn" />}
                variant="standard"
                {...register("location")}
                error={!!errors.location}
                helperText={errors?.location ? errors.location.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="lacationsMr" />}
                variant="standard"
                {...register("locationMr")}
                error={!!errors.locationMr}
                helperText={errors?.locationMr ? errors.locationMr.message : null}
              />
            </Grid>
            {/* //////////////////////////////// */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="citysEn" />}
                variant="standard"
                {...register("city")}
                error={!!errors.city}
                helperText={errors?.city ? errors.city.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="citysMr" />}
                variant="standard"
                {...register("cityMr")}
                error={!!errors.cityMr}
                helperText={errors?.cityMr ? errors.cityMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="pincodesEn" />}
                variant="standard"
                {...register("pincode")}
                error={!!errors.pincode}
                helperText={errors?.pincode ? errors.pincode.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="pincodesMr" />}
                variant="standard"
                {...register("pincodeMr")}
                error={!!errors.pincodeMr}
                helperText={errors?.pincodeMr ? errors.pincodeMr.message : null}
              />
            </Grid>

            {/* //////////////////////////////// */}
          </>
        )}

        {/* ////////////////////////////// EMAIL IN departmentUser //////////////////////////////////// */}
        {logedInUser === "departmentUser" && (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              // disabled={user ? true : false}
              // InputLabelProps={{ shrink: user ? true : false }}
              // sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="emailIds" />}
              variant="standard"
              {...register("email")}
              error={!!errors.email}
              helperText={errors?.email ? errors.email.message : null}
            />
          </Grid>
        )}
        {/* ////////////////////////////// EMAIL IN departmentUser //////////////////////////////////// */}
        {logedInUser === "citizenUser" && (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              disabled={userCitizen ? true : false}
              InputLabelProps={{ shrink: userCitizen ? true : false }}
              // sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="emailIds" />}
              variant="standard"
              {...register("email")}
              error={!!errors.email}
              helperText={errors?.email ? errors.email.message : null}
            />
          </Grid>
        )}
        {/* ////////////////////////////// EMAIL IN departmentUser //////////////////////////////////// */}
        {logedInUser === "cfcUser" && (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              // disabled={userCFC ? true : false}
              // InputLabelProps={{ shrink: userCFC ? true : false }}
              // sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="emailIds" />}
              variant="standard"
              {...register("email")}
              error={!!errors.email}
              helperText={errors?.email ? errors.email.message : null}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Form;
