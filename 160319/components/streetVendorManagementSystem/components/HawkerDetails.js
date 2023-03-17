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
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import { Failed } from "./commonAlert";

/** Author - Sachin Durge */
// HawkerDetails -
const HawkerDetails = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [casts, setCasts] = useState([]);
  const [religions, setReligions] = useState([]);
  const [subCasts, setSubCast] = useState([]);
  const [typeOfDisabilitys, setTypeOfDisability] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);

  // Titles
  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setTitles(
            r.data.title.map((row) => ({
              id: row.id,
              title: row.title,
              titleMr: row.titleMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // genders
  const getGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setGenders(
            r.data.gender.map((row) => ({
              id: row.id,
              gender: row.gender,
              genderMr: row.genderMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // casts
  const getCasts = () => {
    axios
      .get(`${urls.CFCURL}/master/cast/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setCasts(
            r.data.mCast.map((row) => ({
              id: row.id,
              cast: row.cast,
              castMr: row.castMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // Religions
  const getReligions = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setReligions(
            r.data.religion.map((row) => ({
              id: row.id,
              religion: row.religion,
              religionMr: row.religionMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // subCasts
  const getSubCast = () => {
    axios
      .get(`${urls.CFCURL}/master/subCast/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setSubCast(
            r.data.subCast.map((row) => ({
              id: row.id,
              subCast: row.subCast,
              subCastMr: row.subCastMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // typeOfDisabilitys
  const getTypeOfDisability = () => {
    axios
      .get(`${urls.CFCURL}/master/typeOfDisability/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setTypeOfDisability(
            r.data.typeOfDisability.map((row) => ({
              id: row.id,
              typeOfDisability: row.typeOfDisability,
              typeOfDisabilityMr: row.typeOfDisabilityMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // applicatinType/streetVendorType
  const getApplicants = () => {
    axios
      .get(`${urls.HMSURL}/mstStreetVendorApplicantCategory/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setApplicantTypes(
            r.data.streetVendorApplicantCategory.map((row) => ({
              id: row.id,
              applicantType: row.type,
              applicantTypeMr: row.typeMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // useEffect - initial
  useEffect(() => {
    getTitles();
    getTypeOfDisability();
    getGenders();
    getCasts();
    getSubCast();
    getReligions();
    getApplicants();
  }, []);

  // voterName
  useEffect(() => {
    if (watch("disablityNameYN") == "false") {
      setValue("typeOfDisability", "");
    }
  }, [watch("disablityNameYN")]);

  // // errors
  // useEffect(() => {
  //   console.error("HawkerDetails/streetVendorDetails-Errors", errors);
  // }, [errors]);

  // useEffect(() => {
  //   console.log("age", watch("age"));
  // }, [watch("age")]);

  // view
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
        <>
          <strong>{<FormattedLabel id="hawkerDetails" />}</strong>
        </>
      </div>
      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="title" />}</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="title" />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles.map((title, index) => (
                      <MenuItem key={index} value={title.id}>
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
            id="standard-basic"
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id="firstName" />}
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors?.firstName ? errors.firstName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id="middleName" />}
            {...register("middleName")}
            error={!!errors.middleName}
            helperText={errors?.middleName ? errors.middleName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id="lastName" />}
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors?.lastName ? errors.lastName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="gender" />}</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="gender" />}
                >
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
          <FormControl sx={{ marginTop: 2 }} error={!!errors.religion}>
            <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="religion" />}</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="religion" />}
                >
                  {religions &&
                    religions.map((religion, index) => (
                      <MenuItem key={index} value={religion.id}>
                        {language == "en" ? religion?.religion : religion?.religionMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="religion"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.religion ? errors.religion.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.cast}>
            <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="caste" />}</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="caste" />}
                >
                  {casts &&
                    casts.map((caste, index) => (
                      <MenuItem key={index} value={caste.id}>
                        {language == "en" ? caste?.cast : caste?.castMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="cast"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.cast ? errors.cast.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.subCast}>
            <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="subCast" />}</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="subCast" />}
                >
                  {subCasts &&
                    subCasts.map((subCaste, index) => (
                      <MenuItem key={index} value={subCaste.id}>
                        {language == "en" ? subCaste?.subCast : subCaste?.subCastMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="subCast"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.subCast ? errors.subCast.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="dateOfBirth"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    maxDate={moment(new Date()).subtract(18, "years").calendar()}
                    // minDate={new Date()}
                    disabled={watch("disabledFieldInputState")}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16, marginTop: 2 }}>
                        {<FormattedLabel id="dateOfBirth" />}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      let date1 = moment(date).format("YYYY");
                      setValue("age", Math.floor(moment().format("YYYY") - date1));
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
            disabled={watch("disabledFieldInputState")}
            size="3"
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
            id="standard-basic"
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id="mobile" />}
            {...register("mobile")}
            error={!!errors.mobile}
            helperText={errors?.mobile ? errors.mobile.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id="emailAddress" />}
            {...register("emailAddress")}
            error={!!errors.emailAddress}
            helperText={errors?.emailAddress ? errors.emailAddress.message : null}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={watch("disabledFieldInputState")}
            id="standard-basic"
            label={<FormattedLabel id="rationCardNo" />}
            {...register("rationCardNo")}
            error={!!errors.rationCardNo}
            helperText={errors?.rationCardNo ? errors.rationCardNo.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.applicantType}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="applicantType" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="applicantType" />}
                >
                  {applicantTypes &&
                    applicantTypes.map((applicantType, index) => (
                      <MenuItem key={index} value={applicantType.id}>
                        {language == "en" ? applicantType?.applicantType : applicantType?.applicantTypeMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="applicantType"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.applicantType ? errors.applicantType.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
          <FormControl flexDirection="row">
            <FormLabel
              sx={{ width: "230px" }}
              id="demo-row-radio-buttons-group-label"
              error={!!errors.disablityNameYN}
            >
              {<FormattedLabel id="disablityNameYN" />}
            </FormLabel>

            <Controller
              name="disablityNameYN"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  disabled={watch("disabledFieldInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  selected={field.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    error={!!errors?.disablityNameYN}
                    value="true"
                    disabled={watch("disabledFieldInputState")}
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    error={!!errors?.disablityNameYN}
                    value="false"
                    disabled={watch("disabledFieldInputState")}
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.disablityNameYN}>
              {errors?.disablityNameYN ? errors?.disablityNameYN?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {watch("disablityNameYN") == "true" && (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.typeOfDisability}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="typeOfDisability" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="typeOfDisability" />}
                  >
                    {typeOfDisabilitys &&
                      typeOfDisabilitys.map((typeOfDisability, index) => (
                        <MenuItem key={index} value={typeOfDisability.id}>
                          {language == "en"
                            ? typeOfDisability?.typeOfDisability
                            : typeOfDisability?.typeOfDisabilityMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="typeOfDisability"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.typeOfDisability ? errors.typeOfDisability.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default HawkerDetails;
