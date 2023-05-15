import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";

// Component
const PersonalDetails = () => {
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);

  // React Hook Form
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
    } else {
      console.log("disabled");
    }
  }, []);

  // useEffect(() => {

  //   if (router.query.pageMode === "Edit" || router.query.pageMode === "Add") {
  //     console.log("router.query.pageMode", router.query);
  //     console.log("atitleMr", getValues("atitleMr"));

  //     setValue("atitle", user.title);
  //     setValue("afName", user.firstName);
  //     setValue("amName", user.middleName);
  //     setValue("alName", user.surname);
  //   }
  // }, [user]);

  const [gender, setGender] = useState();
  const [title, setTitle] = useState();
  const [zone, setZone] = useState();
  const [village, setVillage] = useState();
  const [gat, setGat] = useState();
  const [reservationName, setReservationName] = useState();
  const [documents, setDocuments] = useState();
  // Titles
  const [gTitleMars, setgTitleMars] = useState([]);

  // getTitles
  const getgTitleMars = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setgTitleMars(
        r.data.title.map((row) => ({
          id: row.id,
          gtitleMar: row.titleMr,
        })),
      );
    });
  };
  useEffect(() => {
    // Date
    let appDate = new Date();
    // setNewDate(moment(appDate, "YYYY-MM-DD").format("YYYY-MM-DD"));

    //Gender
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((res) => {
      setGender(
        res.data.gender.map((j) => ({
          id: j.id,
          genderEn: j.gender,
          genderMr: j.genderMr,
        })),
      );
    });

    //Title
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((res) => {
      setTitle(
        res.data.title.map((j) => ({
          id: j.id,
          titleEn: j.title,
          titleMr: j.titleMr,
        })),
      );
    });

    //Zone
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(
        res.data.zone.map((j) => ({
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        })),
      );
    });

    //Village
    axios.get(`${urls.CFCURL}/master/village/getAll`).then((res) => {
      setVillage(
        res.data.village.map((j) => ({
          id: j.id,
          villageEn: j.villageName,
          villageMr: j.villageNameMr,
        })),
      );
    });

    //Gat
    axios.get(`${urls.CFCURL}/master/gatMaster/getAll`).then((r) => {
      setGat(
        r.data.gatMaster.map((j, i) => ({
          id: j.id,
          gatEn: j.gatNameEn,
          gatMr: j.gatNameMr,
        })),
      );
    });

    //Reservation Name
    axios.get(`${urls.TPURL}/landReservationMaster/getAll`).then((r) => {
      console.log("Table data: ", r.data);
      setReservationName(
        r.data.map((j, i) => ({
          id: j.id,
          landReservationNo: j.landReservationNo,
        })),
      );
    });

    //DocumentsList
    axios.get(`${urls.CFCURL}/master/documentMaster/getAll`).then((res) => {
      setDocuments(
        res.data.documentMaster.map((j, i) => ({
          id: j.id,
          documentNameEn: j.documentChecklistEn,
          documentNameMr: j.documentChecklistMr,
        })),
      );
    });

    getgTitleMars();
  }, []);
  // view
  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="personalDetails" />
          </h2>
        </Box>

        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{
                  width: "230px",
                }}
                variant="standard"
                error={!!errors.title}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.title ? true : false}
                >
                  <FormattedLabel id="title" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      disabled={router.query.title ? true : false}
                      value={router.query.title ? router.query.title : field.value}
                      onChange={(value) => field.onChange(value)}
                      label="title"
                    >
                      {title &&
                        title.map((value, index) => (
                          // <MenuItem key={index}  value={ value?.id}>
                          //   {gtitleMar.gtitleMar}
                          // </MenuItem>

                          <MenuItem key={index} value={value?.id}>
                            {
                              // @ts-ignore
                              language === "en" ? value?.titleEn : value?.titleEn
                            }
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

            {/* priority */}
            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="firstNameEn" required />}
                variant="standard"
                {...register("firstNameEn")}
                error={!!errors.firstNameEn}
                helperText={errors?.firstNameEn ? errors.firstNameEn.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="middleNameEn" required />}
                variant="standard"
                {...register("middleNameEn")}
                error={!!errors.middleNameEn}
                helperText={errors?.middleNameEn ? errors.middleNameEn.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="surnameEn" required />}
                variant="standard"
                {...register("surnameEn")}
                error={!!errors.surnameEn}
                helperText={errors?.surnameEn ? errors.surnameEn.message : null}
              />
            </Grid>
            {/* marathi */}

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl variant="standard" error={!!errors.titleMr} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="titlemr" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);

                        setValue("gtitle", value.target.value);
                      }}
                      label="Title  "
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      {gTitleMars &&
                        gTitleMars.map((gtitleMar, index) => (
                          <MenuItem key={index} value={gtitleMar.id}>
                            {gtitleMar.gtitleMar}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="titleMr"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.titleMr ? errors.titleMr.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="firstNameMr" required />}
                variant="standard"
                {...register("firstNameMr")}
                error={!!errors.firstNameMr}
                helperText={errors?.firstNameMr ? errors.firstNameMr.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="middleNameMr" required />}
                variant="standard"
                {...register("middleNameMr")}
                error={!!errors.middleNameMr}
                helperText={errors?.middleNameMr ? errors.middleNameMr.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="surnameMr" required />}
                variant="standard"
                {...register("surnameMr")}
                error={!!errors.surnameMr}
                helperText={errors?.surnameMr ? errors.surnameMr.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{
                  width: "230px",
                }}
                variant="standard"
                error={!!errors.gender}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.gender ? true : false}
                >
                  <FormattedLabel id="gender" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // value={field.value}
                      disabled={router.query.gender ? true : false}
                      value={router.query.gender ? router.query.gender : field.value}
                      onChange={(value) => field.onChange(value)}
                      label="gender"
                    >
                      {gender &&
                        gender.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              // @ts-ignore
                              value?.id
                            }
                          >
                            {
                              // @ts-ignore
                              language === "en" ? value?.genderEn : value?.genderMr
                            }
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

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="mobile" required />}
                variant="standard"
                {...register("mobile")}
                error={!!errors.mobile}
                helperText={errors?.mobile ? errors.mobile.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="panNo" required />}
                variant="standard"
                {...register("panNo")}
                error={!!errors.panNo}
                helperText={errors?.panNo ? errors.panNo.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="email" required />}
                variant="standard"
                {...register("emailAddress")}
                error={!!errors.emailAddress}
                helperText={errors?.emailAddress ? errors.emailAddress.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="aadharNo" required />}
                variant="standard"
                {...register("aadhaarNo")}
                error={!!errors.aadhaarNo}
                helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default PersonalDetails;
