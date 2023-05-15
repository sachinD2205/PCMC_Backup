import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"

const Administrative_Zone = () => {
  const {
    control,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useFormContext()

  // Titles
  const [titles, setTitles] = useState([])

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
        }))
      )
    })
  }

  // Religions
  const [genders, setGenders] = useState([])

  // getGenders
  const getGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
        }))
      )
    })
  }

  // casts
  //const [casts, setCasts] = useState([]);

  // getCasts
  // const getCasts = () => {
  //   axios.get(`${urls.CFCUrlMaster}/cast/getAll`).then((r) => {
  //     setCasts(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         cast: row.castt,
  //       })),
  //     );
  //   });
  // };

  // Religions
  //const [religions, setReligions] = useState([]);

  // getReligions
  // const getReligions = () => {
  //   axios.get(`${urls.CFCUrlMaster}/religion/getAll`).then((r) => {
  //     setReligions(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         religion: row.religion,
  //       })),
  //     );
  //   });
  // };

  // subCasts
  //const [subCasts, setSubCast] = useState([]);

  // getSubCast
  // const getSubCast = () => {
  //   axios.get(`${urls.CFCUrlMaster}/subCast/getSubCastDetails`).then((r) => {
  //     setSubCast(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         subCast: row.subCast,
  //       })),
  //     );
  //   });
  // };

  // typeOfDisabilitys
  // const [typeOfDisabilitys, setTypeOfDisability] = useState([]);

  // getTypeOfDisability
  // const getTypeOfDisability = () => {
  //   axios.get(`${urls.CFCUrlMaster}/typeOfDisability/getAll`).then((r) => {
  //     setTypeOfDisability(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         typeOfDisability: row.typeOfDisability,
  //       })),
  //     );
  //   });
  // };

  // useEffect
  useEffect(() => {
    getTitles()
    // getTypeOfDisability();
    getGenders()
    // getCasts();
    // getSubCast();
    // getReligions();
  }, [])

  return (
    <>
      {/**
     <div className={styles.row}>
        <Typography variant='h6' sx={{ marginTop: 4 }}>
          <strong> Hawker Details</strong>
        </Typography>
      </div>
    */}

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
          <FormattedLabel id="propertyHolderDetails" />
        </strong>
      </div>

      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        {/* Titles */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="title" />
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
                        {title.title}
                      </MenuItem>
                    ))}
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
        </Grid> */}

        {/* firstName */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="firstName" />}
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors?.firstName ? errors.firstName.message : null}
          />
        </Grid>

        {/* middleName */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="middleName" />}
            {...register("middleName")}
          />
        </Grid>

        {/* lastName */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="lastName" />}
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors?.lastName ? errors.lastName.message : null}
          />
        </Grid>

        {/* gender */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="gender" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="gender" />}
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
            <FormHelperText>
              {errors?.gender ? errors.gender.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.religion}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='religion' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='religion' />
                >
                  {religions &&
                    religions.map((religion, index) => (
                      <MenuItem key={index} value={religion.id}>
                        {religion.religion}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='religion'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.religion ? errors.religion.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.cast}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='caste' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='caste' />
                >
                  {casts &&
                    casts.map((cast, index) => (
                      <MenuItem key={index} value={cast.id}>
                        {cast.cast}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='cast'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.cast ? errors.cast.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.subCast}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='subCast' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='subCast' />
                >
                  {subCasts &&
                    subCasts.map((subCast, index) => (
                      <MenuItem key={index} value={subCast.id}>
                        {subCast.subCast}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='subCast'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.subCast ? errors.subCast.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name='dateOfBirth'
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat='DD/MM/YYYY'
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id='dateOfBirth' />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      let date1 = moment(date).format("YYYYMMDD");
                      setValue(
                        "age",
                        moment(date1, "YYYYMMDD").fromNow().slice(0, 2),
                      );
                    }}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
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
            <FormHelperText>
              {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled
            size='3'
            InputLabelProps={{ shrink: true }}
            id='standard-basic'
            label=<FormattedLabel id='age' />
            {...register("age")}
            error={!!errors.age}
            helperText={errors?.age ? errors.age.message : null}
          />
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            type="text"
            InputProps={{
              inputProps: { minLength: "10", maxLength: "10", step: "1" },
            }}
            label={<FormattedLabel id="mobile" />}
            {...register("mobile")}
            error={!!errors.mobile}
            helperText={errors?.mobile ? errors.mobile.message : null}
          />
        </Grid>

        {/* email */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            type="email"
            id="standard-basic"
            label={<FormattedLabel id="emailAddress" />}
            {...register("emailAddress")}
            error={!!errors.emailAddress}
            helperText={
              errors?.emailAddress ? errors.emailAddress.message : null
            }
          />
        </Grid>

        {/* Aadharnumber */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            InputProps={{
              inputProps: { minLength: "12", maxLength: "12", step: "1" },
            }}
            label={<FormattedLabel id="aadharNoPT" />}
            {...register("aadharNoPT")}
          />
        </Grid>

        {/* generateOTP */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              <FormattedLabel id="generateOTP" />
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label={<FormattedLabel id="generateOTP" />}
                name="disbality"
                {...register("generateOTP")}
                error={!!errors.generateOTP}
                helperText={
                  errors?.generateOTP ? errors.generateOTP.message : null
                }
              />
              {/* <FormControlLabel
                value='NO'
                control={<Radio />}
                label=<FormattedLabel id='no' />
                name='disbality'
                {...register("disbality")}
                error={!!errors.disbality}
                helperText={errors?.disbality ? errors.disbality.message : null}
              /> */}
            </RadioGroup>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.typeOfDisability}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='typeOfDisability' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='typeOfDisability' />
                >
                  {typeOfDisabilitys &&
                    typeOfDisabilitys.map((typeOfDisability, index) => (
                      <MenuItem key={index} value={typeOfDisability.id}>
                        {typeOfDisability.typeOfDisability}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='typeOfDisability'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.typeOfDisability
                ? errors.typeOfDisability.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        {/* enter OTP */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="enterOTP" />}
            {...register("enterOTP")}
            error={!!errors.enterOTP}
            helperText={errors?.enterOTP ? errors.enterOTP.message : null}
          />
        </Grid>

        {/* validateOTP */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              <FormattedLabel id="validateOTP" />
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label={<FormattedLabel id="validateOTP" />}
                name="disbality"
                {...register("validateOTP")}
                error={!!errors.validateOTP}
                helperText={
                  errors?.validateOTP ? errors.validateOTP.message : null
                }
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            InputProps={{
              inputProps: { minLength: "10", maxLength: "10", step: "1" },
            }}
            label={<FormattedLabel id="panNum" />}
            {...register("panNum")}
            error={!!errors.panNum}
            helperText={errors?.panNum ? errors.panNum.message : null}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default Administrative_Zone
