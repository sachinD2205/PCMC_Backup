import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
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
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../marriageRegistration/view.module.css";
// import diff from "moment";

const GroomDetails = () => {
  const newMarriageRegistration = useSelector((state) => state.newMarriageRegistration);
  console.log("newMarriageRegistration", newMarriageRegistration);

  const router = useRouter();
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setDisabled(false);
      console.log("enabled");
      setValue("astate", "Maharashtra");
      setValue("astateMr", "महाराष्ट्र");
    } else {
      setDisabled(true);
      console.log("disabled");
    }

    setValue("ggender", 1);
  }, []);

  useEffect(() => {
    setValue("gtitleMar", getValues("gtitle"));
  }, [getValues("gtitle")]);

  const language = useSelector((state) => state?.labels.language);

  // genders
  const [gGenders, setGGenders] = useState([]);

  // getGGenders
  const getGGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setGGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
      );
    });
  };

  // zones
  const [gAgeProofDocumentKey, setGAgeProofDocumentKey] = useState([]);

  // getGAgeProofDocumentKey
  const getGAgeProofDocumentKey = () => {
    axios.get(`${urls.CFCURL}/master/ageProofDocument/getAll`).then((r) => {
      setGAgeProofDocumentKey(
        r.data.map((row) => ({
          id: row.id,
          gAgeProofDocumentKey: row.typeOfDocument,
        })),
      );
    });
  };

  // documentKeys
  const [gIdDocumentKeys, setGIdDocumentKeys] = useState([]);

  // getGIdDocumentKeys
  const getGIdDocumentKeys = () => {
    axios.get(`${urls.CFCURL}/master/identityProof/getAll`).then((r) => {
      setGIdDocumentKeys(
        r.data.identityProof.map((row) => ({
          id: row.id,
          gIdDocumentKey: row.typeOFDocument,
        })),
      );
    });
  };

  // resedentialDocumentkey
  const [gResidentialDocumentKeys, setgResidentialDocumentKeys] = useState([]);

  // getgResidentialDocumentKeys
  const getgResidentialDocumentKeys = () => {
    axios.get(`${urls.CFCURL}/master/residentialProof/getAll`).then((r) => {
      setgResidentialDocumentKeys(
        r.data.residentialProof.map((row) => ({
          id: row.id,
          gResidentialDocumentKey: row.typeOFDocument,
        })),
      );
    });
  };

  // religion
  const [religions, setReligions] = useState([]);

  // getReligion
  const getReligions = () => {
    axios.get(`${urls.CFCURL}/master/religion/getAll`).then((r) => {
      setReligions(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
          religionMr: row.religionMr,
        })),
      );
    });
  };

  // Titles
  const [gTitles, setgTitles] = useState([]);

  // getTitles
  const getgTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setgTitles(
        r.data.title.map((row) => ({
          id: row.id,
          gtitle: row.title,
          //titlemr: row.titlemr,
        })),
      );
    });
  };

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

  //Mr Status
  const [gStatusAtTimeMarriageKeys, setgStatusAtTimeMarriageKeys] = useState([]);

  const getgStatusAtTimeMarriageKeys = () => {
    axios.get(`${urls.MR}/master/maritalstatus/getAll`).then((r) => {
      setgStatusAtTimeMarriageKeys(
        r.data.maritalStatus.map((row) => ({
          id: row.id,
          statusDetails: row.statusDetails,
          statusDetailsMar: row.statusDetailsMar,
        })),
      );
    });
  };

  // Disabilities
  const [Disabilities, setDisabilities] = useState([]);

  // getDisabilities
  const getDisabilities = () => {
    axios.get(`${urls.CFCURL}/master/typeOfDisability/getAll`).then((r) => {
      setDisabilities(
        r.data.typeOfDisability.map((row) => ({
          id: row.id,
          typeOfDisability: row.typeOfDisability,
          typeOfDisabilityMr: row.typeOfDisabilityMr,
        })),
      );
    });
  };

  const [temp, setTemp] = useState();
  // Address Change
  const addressChange = (e) => {
    setValue("isApplicantGroom", e.target.checked);

    console.log("isApplicantGroom", getValues("isApplicantGroom"));
    if (e.target.checked) {
      setValue("gtitle", getValues("atitle"));
      setValue("gtitleMar", getValues("atitleMr"));
      setValue("gfName", getValues("afName"));
      setValue("gmName", getValues("amName"));
      setValue("glName", getValues("alName"));
      setValue("gbuildingNo", getValues("aflatBuildingNo"));
      setValue("gbuildingName", getValues("abuildingName"));
      setValue("groadName", getValues("aroadName"));
      setValue("glandmark", getValues("alandmark"));
      setValue("gcityName", getValues("acityName"));
      setValue("gstate", getValues("astate"));
      setValue("gpincode", getValues("apincode"));
      setValue("gfNameMr", getValues("afNameMr"));
      setValue("gmNameMr", getValues("amNameMr"));
      setValue("glNameMr", getValues("alNameMr"));
      setValue("gbuildingNoMr", getValues("aflatBuildingNoMr"));
      setValue("gbuildingNameMr", getValues("abuildingNameMr"));
      setValue("groadNameMr", getValues("aroadNameMr"));
      setValue("glandmarkMr", getValues("alandmarkMr"));
      setValue("gcityNameMr", getValues("acityNameMr"));
      setValue("gstateMr", getValues("astateMr"));
      setValue("gbirthDate", getValues("abirthDate"));
      if (getValues("marriageDate")) {
        setValue(
          "gage",
          calculateAge(
            moment(getValues("marriageDate")).format("YYYY"),
            moment(getValues("gbirthDate")).format("YYYY"),
          ),
        );
      }
      setValue("ggender", getValues("agender"));
      setValue("gmobileNo", getValues("amobileNo"));
      setValue("gemail", getValues("aemail"));
      setValue("setage", getValues("age"));

      setTemp(true);
    } else {
      setValue("gtitle", "");
      setValue("gtitleMar", "");
      setValue("gfName", "");
      setValue("gmName", "");
      setValue("glName", "");
      setValue("gbuildingNo", "");
      setValue("gbuildingName", "");
      setValue("groadName", "");
      setValue("glandmark", "");
      setValue("gcityName", "");
      setValue("gstate", "");
      setValue("gpincode", "");
      setValue("gfNameMr", "");
      setValue("gmNameMr", "");
      setValue("glNameMr", "");
      setValue("gbuildingNoMr", "");
      setValue("gbuildingNameMr", "");
      setValue("groadNameMr", "");
      setValue("glandmarkMr", "");
      setValue("gcityNameMr", "");
      setValue("gstateMr", "");

      setValue("gbirthDate", null);
      setValue("gage", null);
      setValue("ggender", null);

      setValue("gmobileNo", "");
      setValue("gemail", "");

      setTemp();
    }
  };

  const disabilities = (e) => {
    // setValue('gdisabled', e.target.checked)
    console.log("gdisabled", getValues("gdisabled"));
    if (e.target.checked) {
      setValue("gdisabled", e.target.checked);

      // setTemp(true)
    } else {
      setValue("gdisabled", "");
    }
  };

  useEffect(() => {
    getGGenders();
    getGAgeProofDocumentKey();
    getGIdDocumentKeys();
    getgResidentialDocumentKeys();
    getReligions();
    getgTitleMars();
    getgTitles();
    getDisabilities();
    getgStatusAtTimeMarriageKeys();
  }, []);

  useEffect(() => {
    dateConverter();
  }, []);

  const dateConverter = (gBirthDates, marriageDate) => {
    const groomAge = Math.floor(
      moment(getValues("marriageDate")).format("YYYY-MM-DD") -
        moment(getValues("gbirthDate")).format("YYYY-MM-DD"),
    );

    console.log("a1234", groomAge);
  };

  function calculateAge(marriageDate, gbirthDate) {
    const duration = moment.duration(moment(marriageDate).diff(moment(gbirthDate)));
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();

    return years;
  }

  const ageDiff = calculateAge(
    moment(getValues("marriageDate")).format("YYYY-MM-DD"),
    moment(getValues("gbirthDate")).format("YYYY-MM-DD"),
  );

  // useEffect(() => {
  //   console.log("statusDetails", watch("maritalStatus.statusDetails"));
  //   if (watch("maritalStatus.statusDetails") === "Divorced") {
  //     setgStatusAtTimeMarriageKeys(gStatusAtTimeMarriageKeys);
  //   }
  // }, [watch("maritalStatus.statusDetails")]);
  // View -Groom
  return (
    <>
      <div className={styles.small}>
        <h4
          style={{
            marginLeft: "40px",
            color: "red",
            fontStyle: "italic",
            marginTop: "25px",
          }}
        >
          {<FormattedLabel id="onlyMHR" />}
        </h4>
        <div style={{ marginLeft: "25px" }}>
          <FormControlLabel
            disabled={disabled ? true : getValues("isApplicantBride") ? true : false}
            control={<Checkbox checked={getValues("isApplicantGroom") ? true : false} />}
            label=<Typography>
              <b>
                <FormattedLabel id="ApplicatCheck1" />
              </b>
            </Typography>
            onChange={(e) => {
              addressChange(e);
            }}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {<FormattedLabel id="groomDetail" />}
            </h3>
          </div>
        </div>
        <div className={styles.details}>
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
        </div>
        <div className={styles.row}>
          <div>
            <FormControl variant="standard" error={!!errors.gtitle} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="title1" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("gtitleMar", value.target.value);
                    }}
                    label="Title  "
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {gTitles &&
                      gTitles.map((gtitle, index) => (
                        <MenuItem key={index} value={gtitle.id}>
                          {gtitle.gtitle}

                          {/* {language == 'en' ? gtitle?.title : gtitle?.titlemr} */}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="gtitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.gtitle ? errors.gtitle.message : null}</FormHelperText>
            </FormControl>
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gfName") ? true : false) ||
                // (router.query.gfName ? true : false),
              }}
              disabled={disabled}
              id="standard-basic"
              label={<FormattedLabel id="firstName" required />}
              // label="First Name  "
              variant="standard"
              {...register("gfName")}
              error={!!errors.gfName}
              helperText={errors?.gfName ? errors.gfName.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gmName") ? true : false) ||
                // (router.query.gmName ? true : false),
              }}
              // InputLabelProps={{ shrink: true }}
              disabled={disabled}
              id="standard-basic"
              // label="Middle Name  "
              label={<FormattedLabel id="middleName" required />}
              variant="standard"
              {...register("gmName")}
              error={!!errors.gmName}
              helperText={errors?.gmName ? errors.gmName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("glName") ? true : false) ||
                // (router.query.glName ? true : false),
              }}
              disabled={disabled}
              id="standard-basic"
              // label="Last Name  "
              label={<FormattedLabel id="lastName" required />}
              variant="standard"
              {...register("glName")}
              error={!!errors.glName}
              helperText={errors?.glName ? errors.glName.message : null}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <FormControl variant="standard" error={!!errors.gtitleMar} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="titlemr" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
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
                name="gtitleMar"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.gtitleMar ? errors.gtitleMar.message : null}</FormHelperText>
            </FormControl>
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gfNameMr") ? true : false) ||
                // (router.query.gfNameMr ? true : false),
              }}
              id="standard-basic"
              // label="प्रथम नावं  "
              label={<FormattedLabel id="firstNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("gfNameMr")}
              error={!!errors.gfNameMr}
              helperText={errors?.gfNameMr ? errors.gfNameMr.message : null}
            />
          </div>

          <div>
            <TextField
              id="standard-basic"
              // label="मधले नावं  "
              InputLabelProps={{
                shrink: temp,
                // (watch("gmNameMr") ? true : false) ||
                // (router.query.glNameMr ? true : false),
              }}
              label={<FormattedLabel id="middleNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("gmNameMr")}
              error={!!errors.gmNameMr}
              helperText={errors?.gmNameMr ? errors.gmNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("glNameMr") ? true : false) ||
                // (router.query.glNameMr ? true : false),
              }}
              id="standard-basic"
              // label="आडनाव  "
              disabled={disabled}
              label={<FormattedLabel id="lastNamemr" required />}
              variant="standard"
              {...register("glNameMr")}
              error={!!errors.glNameMr}
              helperText={errors?.glNameMr ? errors.glNameMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl error={!!errors.gbirthDate} sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name="gbirthDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={disabled}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>{<FormattedLabel id="BirthDate" required />}</span>
                      }
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                        // setValue(
                        //   "gage",

                        //   moment(getValues("marriageDate")).format("YYYY") -
                        //     moment(getValues("gbirthDate")).format("YYYY"),
                        // );
                        setValue(
                          "gage",
                          calculateAge(
                            moment(getValues("marriageDate")).format("YYYY-MM-DD"),
                            moment(getValues("gbirthDate")).format("YYYY-MM-DD"),
                          ),
                        );
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
                              padding: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>{errors?.gbirthDate ? errors.gbirthDate.message : null}</FormHelperText>
            </FormControl>
          </div>

          <div>
            <TextField
              disabled
              InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="Age" required />}
              variant="standard"
              {...register("gage")}
              error={!!errors.gage}
              helperText={errors?.gage ? errors.gage.message : null}
            />
          </div>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.ggender}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Gender" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    defaultValue={language == "en" ? "Male" : "पुरुष"}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Gender  "
                  >
                    {gGenders &&
                      gGenders.map((ggender, index) => (
                        <MenuItem key={index} value={ggender.id}>
                          {/* {ggender.ggender} */}
                          {language == "en" ? ggender?.gender : ggender?.genderMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="ggender"
                control={control}
              />
              <FormHelperText>{errors?.ggender ? errors.ggender.message : null}</FormHelperText>
            </FormControl>
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("gaadharNo") ? true : false) || (router.query.gaadharNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNo" required />}
              variant="standard"
              disabled={disabled}
              {...register("gaadharNo")}
              error={!!errors.gaadharNo}
              helperText={errors?.gaadharNo ? errors.gaadharNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gemail") ? true : false) ||
                // (router.query.gemail ? true : false),
              }}
              id="standard-basic"
              // label="Email"
              label={<FormattedLabel id="email" />}
              disabled={disabled}
              variant="standard"
              {...register("gemail")}
              error={!!errors.gemail}
              helperText={errors?.gemail ? errors.gemail.message : null}
            />
          </div>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.greligionByBirth}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Religion1" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=" Religion by Birth  "
                  >
                    {religions &&
                      religions.map((greligionByBirth, index) => (
                        <MenuItem key={index} value={greligionByBirth.id}>
                          {/* {greligionByBirth.greligionByBirth} */}

                          {language == "en" ? greligionByBirth?.religion : greligionByBirth?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="greligionByBirth"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.greligionByBirth ? errors.greligionByBirth.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.greligionByAdoption}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Religion2" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  Religion by Adoption *"
                  >
                    {religions &&
                      religions.map((greligionByAdoption, index) => (
                        <MenuItem key={index} value={greligionByAdoption.id}>
                          {/* {greligionByAdoption.greligionByAdoption} */}
                          {language == "en" ? greligionByAdoption?.religion : greligionByAdoption?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="greligionByAdoption"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.greligionByAdoption ? errors.greligionByAdoption.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.gstatusAtTimeMarriageKey}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="StatusOfMarrige" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Status at time of marriage  "
                  >
                    {gStatusAtTimeMarriageKeys &&
                      gStatusAtTimeMarriageKeys.map((gstatusAtTimeMarriageKey, index) => (
                        <MenuItem key={index} value={gstatusAtTimeMarriageKey.id}>
                          {language == "en"
                            ? gstatusAtTimeMarriageKey?.statusDetails
                            : gstatusAtTimeMarriageKey?.statusDetailsMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="gstatusAtTimeMarriageKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gstatusAtTimeMarriageKey ? errors.gstatusAtTimeMarriageKey.message : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div>

        <div className={styles.rowdis}>
          {watch("gstatusAtTimeMarriageKey") && watch("gstatusAtTimeMarriageKey") == 3 && (
            <div style={{ marginLeft: "6vh" }}>
              <FormControl error={!!errors.gdivorceDate} sx={{ marginTop: 0 }}>
                <Controller
                  control={control}
                  name="gdivorceDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={disabled}
                        inputFormat="DD/MM/YYYY"
                        label={<span style={{ fontSize: 16 }}>Divorced Date</span>}
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format("YYYY-MM-DD"));
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
                                padding: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>{errors?.gdivorceDate ? errors.gdivorceDate.message : null}</FormHelperText>
              </FormControl>
            </div>
          )}
          {watch("gstatusAtTimeMarriageKey") && watch("gstatusAtTimeMarriageKey") == 4 && (
            <div style={{ marginLeft: "6vh" }}>
              <FormControl error={!!errors.gwidowDate} sx={{ marginTop: 0 }}>
                <Controller
                  control={control}
                  name="gwidowDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={disabled}
                        inputFormat="DD/MM/YYYY"
                        label={<span style={{ fontSize: 16 }}>Widow / Widower Date</span>}
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format("YYYY-MM-DD"));
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
                                padding: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>{errors?.gwidowDate ? errors.gwidowDate.message : null}</FormHelperText>
              </FormControl>
            </div>
          )}
          <div style={{ marginLeft: "12vh" }}>
            <FormControlLabel
              sx={{ marginTop: "4vh" }}
              disabled={disabled ? true : getValues("gdisabled") ? true : false}
              control={<Checkbox checked={getValues("gdisabled") ? true : false} />}
              label=<Typography>
                <b>
                  <FormattedLabel id="AppliToGroomD" />
                </b>
              </Typography>
              onChange={(e) => {
                disabilities(e);
              }}
            />
          </div>
          {watch("gdisabled") == true && (
            <div style={{ marginRight: "13vh", marginLeft: "18vh" }}>
              <FormControl sx={{}} error={!!errors.gdisabilityType}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="disablety" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="caste" />}
                    >
                      {Disabilities &&
                        Disabilities.map((typeOfDisability, index) => (
                          <MenuItem key={index} value={typeOfDisability.id}>
                            {language == "en"
                              ? typeOfDisability?.typeOfDisability
                              : typeOfDisability?.typeOfDisabilityMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="gdisabilityType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gdisabilityType ? errors.gdisabilityType.message : null}
                </FormHelperText>
              </FormControl>
            </div>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="Adress" />}
            </h3>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gbuildingNo") ? true : false) ||
                // (router.query.gbuildingNo ? true : false),
              }}
              id="standard-basic"
              // label="Flat/Building No. *"
              label={<FormattedLabel id="flatBuildingNo" required />}
              variant="standard"
              disabled={disabled}
              {...register("gbuildingNo")}
              error={!!errors.gbuildingNo}
              helperText={errors?.gbuildingNo ? errors.gbuildingNo.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gbuildingName") ? true : false) ||
                // (router.query.gbuildingName ? true : false),
              }}
              id="standard-basic"
              // label="Apartment Name"
              label={<FormattedLabel id="buildingName" required />}
              variant="standard"
              disabled={disabled}
              {...register("gbuildingName")}
              error={!!errors.gbuildingName}
              helperText={errors?.gbuildingName ? errors.gbuildingName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("groadName") ? true : false) ||
                // (router.query.groadName ? true : false),
              }}
              id="standard-basic"
              //  label="Road Name"
              label={<FormattedLabel id="roadName" required />}
              variant="standard"
              disabled={disabled}
              {...register("groadName")}
              error={!!errors.groadName}
              helperText={errors?.groadName ? errors.groadName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("glandmark") ? true : false) ||
                // (router.query.glandmark ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" required />}
              // label="Landmark"
              variant="standard"
              disabled={disabled}
              {...register("glandmark")}
              error={!!errors.glandmark}
              helperText={errors?.glandmark ? errors.glandmark.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gbuildingNoMr") ? true : false) ||
                // (router.query.gbuildingNoMr ? true : false),
              }}
              id="standard-basic"
              // label="Flat/Building No. *"
              label={<FormattedLabel id="flatBuildingNomr" required />}
              variant="standard"
              disabled={disabled}
              {...register("gbuildingNoMr")}
              error={!!errors.gbuildingNoMr}
              helperText={errors?.gbuildingNoMr ? errors.gbuildingNoMr.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gbuildingNameMr") ? true : false) ||
                // (router.query.gbuildingNameMr ? true : false),
              }}
              id="standard-basic"
              // label="Apartment Name"
              label={<FormattedLabel id="buildingNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("gbuildingNameMr")}
              error={!!errors.gbuildingNameMr}
              helperText={errors?.gbuildingName ? errors.gbuildingNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("groadNameMr") ? true : false) ||
                // (router.query.groadNameMr ? true : false),
              }}
              id="standard-basic"
              //  label="Road Name"
              label={<FormattedLabel id="roadNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("groadNameMr")}
              error={!!errors.groadNameMr}
              helperText={errors?.groadNameMr ? errors.groadNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("glandmarkMr") ? true : false) ||
                // (router.query.glandmarkMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmarkmr" required />}
              // label="Landmark"
              variant="standard"
              disabled={disabled}
              {...register("glandmarkMr")}
              error={!!errors.glandmarkMr}
              helperText={errors?.glandmarkMr ? errors.glandmarkMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gcityName") ? true : false) ||
                // (router.query.gcityName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" required />}
              variant="standard"
              disabled={disabled}
              {...register("gcityName")}
              error={!!errors.gcityName}
              helperText={errors?.gcityName ? errors.gcityName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gstate") ? true : false) ||
                // (router.query.gstate ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="State" required />}
              // label="State *"
              disabled={disabled}
              variant="standard"
              {...register("gstate")}
              error={!!errors.gstate}
              helperText={errors?.gstate ? errors.gstate.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gcityNameMr") ? true : false) ||
                // (router.query.gcityNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("gcityNameMr")}
              error={!!errors.gcityNameMr}
              helperText={errors?.gcityNameMr ? errors.gcityNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gstateMr") ? true : false) ||
                // (router.query.gstateMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="statemr" required />}
              // label="State *"
              disabled={disabled}
              variant="standard"
              {...register("gstateMr")}
              error={!!errors.gstateMr}
              helperText={errors?.gstateMr ? errors.gstateMr.message : null}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gpincode") ? true : false) ||
                // (router.query.gpincode ? true : false),
              }}
              id="standard-basic"
              // label="Pin Code *"
              label={<FormattedLabel id="pincode" required />}
              variant="standard"
              disabled={disabled}
              {...register("gpincode")}
              error={!!errors.gpincode}
              helperText={errors?.gpincode ? errors.gpincode.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gmobileNo") ? true : false) ||
                // (router.query.gmobileNo ? true : false),
              }}
              id="standard-basic"
              // label="Mobile Number"
              label={<FormattedLabel id="mobileNo" />}
              variant="standard"
              disabled={disabled}
              {...register("gmobileNo")}
              error={!!errors.gmobileNo}
              helperText={errors?.gmobileNo ? errors.gmobileNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.gAgeProofDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="AgeDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 230 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Age Proof"
                  >
                    {gAgeProofDocumentKey &&
                      gAgeProofDocumentKey.map(
                        (gAgeProofDocumentKey, index) => (
                          <MenuItem key={index} value={gAgeProofDocumentKey.id}>
                            {gAgeProofDocumentKey.gAgeProofDocumentKey}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="gAgeProofDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gAgeProofDocumentKey
                  ? errors.gAgeProofDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div> */}

          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.gIdDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="IdDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 230 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  ID Document"
                  >
                    {gIdDocumentKeys &&
                      gIdDocumentKeys.map((gIdDocumentKey, index) => (
                        <MenuItem key={index} value={gIdDocumentKey.id}>
                          {gIdDocumentKey.gIdDocumentKey}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="gIdDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gIdDocumentKey ? errors.gIdDocumentKey.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}
        </div>
        {/* <div className={styles.row}>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.gResidentialDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="residentialDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 230 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=" Residential Document"
                  >
                    {gResidentialDocumentKeys &&
                      gResidentialDocumentKeys.map(
                        (gResidentialDocumentKey, index) => (
                          <MenuItem
                            key={index}
                            value={gResidentialDocumentKey.id}
                          >
                            {gResidentialDocumentKey.gResidentialDocumentKey}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="gResidentialDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gResidentialDocumentKey
                  ? errors.gResidentialDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <FormControl
              variant="standard"
              sx={{ minWidth: 120, marginLeft: '2.5vw' }}
              error={!!errors.witnessDocument}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="StatusOfDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 230 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  Status of Document"
                  >
                    <MenuItem value={1}>Pending</MenuItem>
                    <MenuItem value={2}>Successful</MenuItem>
                  </Select>
                )}
                name="witnessDocument"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.witnessDocument
                  ? errors.witnessDocument.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div> */}

        {/* <div className={styles.row} style={{ marginTop: 30 }}>
          <h1>{<FormattedLabel id="groomParaentDetail" />}</h1>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="firstNameF" />}
              variant="standard"
              {...register('gFFName')}
              error={!!errors.gFFName}
              helperText={errors?.gFFName ? errors.gFFName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="middleNameF" />}
              variant="standard"
              {...register('gFMName')}
              error={!!errors.gFMName}
              helperText={errors?.gFMName ? errors.gFMName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="lastNameF" />}
              variant="standard"
              {...register('gFLName')}
              error={!!errors.gFLName}
              helperText={errors?.gFLName ? errors.gFLName.message : null}
            />
          </div>

          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="AgeF" />}
              variant="standard"
              {...register('gFAge')}
              error={!!errors.gFAge}
              helperText={errors?.gFAge ? errors.gFAge.message : null}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNoF" />}
              variant="standard"
              {...register('gFAadharNo')}
              error={!!errors.gFAadharNo}
              helperText={errors?.gFAadharNo ? errors.gFAadharNo.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNoF" />}
              variant="standard"
              {...register('gFMobileNo')}
              error={!!errors.gFMobileNo}
              helperText={errors?.gFMobileNo ? errors.gFMobileNo.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="firstNameM" />}
              variant="standard"
              {...register('gMFName')}
              error={!!errors.gMFName}
              helperText={errors?.gMFName ? errors.gMFName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="middleNameM" />}
              variant="standard"
              {...register('gMMName')}
              error={!!errors.gMMName}
              helperText={errors?.gMMName ? errors.gMMName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="lastNameM" />}
              variant="standard"
              {...register('gMLName')}
              error={!!errors.gMLName}
              helperText={errors?.gMLName ? errors.gMLName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="AgeM" />}
              variant="standard"
              {...register('gMAge')}
              error={!!errors.gMAge}
              helperText={errors?.gMAge ? errors.gMAge.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNoM" />}
              variant="standard"
              {...register('gMAadharNo')}
              error={!!errors.gMAadharNo}
              helperText={errors?.gMAadharNo ? errors.gMAadharNo.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNoM" />}
              variant="standard"
              {...register('gMMobileNo')}
              error={!!errors.gMMobileNo}
              helperText={errors?.gMMobileNo ? errors.gMMobileNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="email" />}
              variant="standard"
              {...register('gFEmail')}
              error={!!errors.gFEmail}
              helperText={errors?.bFEmail ? errors.gFEmail.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" />}
              variant="standard"
              {...register('gFBuildingNo')}
              error={!!errors.gFBuildingNo}
              helperText={
                errors?.gFBuildingNo ? errors.gFBuildingNo.message : null
              }
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" />}
              variant="standard"
              {...register('gFBuildingName')}
              error={!!errors.gFBuildingName}
              helperText={
                errors?.gFBuildingName ? errors.gFBuildingName.message : null
              }
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="roadName" />}
              variant="standard"
              {...register('gFRoadName')}
              error={!!errors.gFRoadName}
              helperText={errors?.gFRoadName ? errors.gFRoadName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" />}
              bFVillageName
              variant="standard"
              {...register('gFLandmark')}
              error={!!errors.gFLandmark}
              helperText={errors?.gFLandmark ? errors.gFLandmark.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="villageName" />}
              variant="standard"
              {...register('gFVillageName')}
              error={!!errors.gFVillageName}
              helperText={
                errors?.gFVillageName ? errors.gFVillageName.message : null
              }
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" />}
              variant="standard"
              {...register('gFCityName')}
              error={!!errors.gFCityName}
              helperText={errors?.gFCityName ? errors.gFCityName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="state" />}
              variant="standard"
              {...register('gFState')}
              error={!!errors.gFState}
              helperText={errors?.gFState ? errors.gFState.message : null}
            />
          </div>
        </div>

        <div>
          <TextField
            sx={{ width: 230, marginLeft: '2.5vw' }}
            id="standard-basic"
            label={<FormattedLabel id="pincode" />}
            variant="standard"
            {...register('gFPincode')}
            error={!!errors.gFPincode}
            helperText={errors?.gFPincode ? errors.gFPincode.message : null}
          />
        </div> */}
      </div>
    </>
  );
};

export default GroomDetails;
// {...register('addressCheckBoxG')}
