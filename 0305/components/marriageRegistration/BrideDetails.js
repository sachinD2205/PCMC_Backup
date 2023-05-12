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

// view Bride
const BrideDetails = () => {
  const {
    control,
    register,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setDisabled(false);
      console.log("enabled");
    } else {
      setDisabled(true);
      console.log("disabled");
    }
    setValue("bgender", 2);
  }, []);

  useEffect(() => {
    setValue("btitleMar", getValues("btitle"));
    // if (router.query.pageMode === 'Edit' || router.query.pageMode === 'View') {
    // }
  }, [getValues("btitle")]);

  const language = useSelector((state) => state?.labels.language);
  // gender
  const [bGenders, setBGenders] = useState([]);

  // getBGenders
  const getBGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setBGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
      );
    });
  };

  // Age Proof Document
  const [bAgeProofDocumentKey, setBAgeProofDocumentKey] = useState([]);

  // getBAgeProofDocumentKey
  const getBAgeProofDocumentKey = () => {
    axios.get(`${urls.CFCURL}/master/ageProofDocument/getAll`).then((r) => {
      setBAgeProofDocumentKey(
        r.data.map((row) => ({
          id: row.id,
          bAgeProofDocumentKey: row.typeOfDocument,
        })),
      );
    });
  };

  // Id Document
  const [BIdDocumentKeys, setBIdDocumentKeys] = useState([]);

  // getBIdDocumentKeys
  const getBIdDocumentKeys = () => {
    axios.get(`${urls.CFCURL}/master/identityProof/getAll`).then((r) => {
      setBIdDocumentKeys(
        r.data.identityProof.map((row) => ({
          id: row.id,
          BIdDocumentKey: row.typeOFDocument,
        })),
      );
    });
  };

  // resedentialDocumentkey
  const [bResidentialDocumentKeys, setBResidentialDocumentKeys] = useState([]);

  // getBResidentialDocumentKeys
  const getBResidentialDocumentKeys = () => {
    axios.get(`${urls.CFCURL}/master/residentialProof/getAll`).then((r) => {
      setBResidentialDocumentKeys(
        r.data.residentialProof.map((row) => ({
          id: row.id,
          bResidentialDocumentKey: row.typeOFDocument,
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
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.map((row) => ({
          id: row.id,
          title: row.title,
        })),
      );
    });
  };

  // Titles
  const [bTitles, setbTitles] = useState([]);

  // getTitles
  const getbTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setbTitles(
        r.data.title.map((row) => ({
          id: row.id,
          btitle: row.title,
        })),
      );
    });
  };

  // Titles
  const [bTitleMars, setbTitleMars] = useState([]);

  // getTitles
  const getbTitleMars = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setbTitleMars(
        r.data.title.map((row) => ({
          id: row.id,
          btitleMar: row.titleMr,
        })),
      );
    });
  };

  // Status at time mR
  const [bStatusAtTimeMarriageKeys, setbStatusAtTimeMarriageKeys] = useState([]);

  // getStatus at time mR
  const getbStatusAtTimeMarriageKeys = () => {
    axios.get(`${urls.MR}/master/maritalstatus/getAll`).then((r) => {
      setbStatusAtTimeMarriageKeys(
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
    setValue("isApplicantBride", e.target.checked);

    console.log("isApplicantBride", getValues("isApplicantBride"));

    if (e.target.checked) {
      setValue("btitle", getValues("atitle"));
      setValue("bfName", getValues("afName"));
      setValue("bmName", getValues("amName"));
      setValue("blName", getValues("alName"));
      setValue("bbuildingNo", getValues("aflatBuildingNo"));
      setValue("bbuildingName", getValues("abuildingName"));
      setValue("broadName", getValues("aroadName"));
      setValue("blandmark", getValues("alandmark"));
      setValue("bcityName", getValues("acityName"));
      setValue("bstate", getValues("astate"));
      setValue("bpincode", getValues("apincode"));

      setValue("btitleMar", getValues("atitleMr"));
      setValue("bfNameMr", getValues("afNameMr"));
      setValue("bmNameMr", getValues("amNameMr"));
      setValue("blNameMr", getValues("alNameMr"));
      setValue("bbuildingNoMr", getValues("aflatBuildingNoMr"));
      setValue("bbuildingNameMr", getValues("abuildingNameMr"));
      setValue("broadNameMr", getValues("aroadNameMr"));
      setValue("blandmarkMr", getValues("alandmarkMr"));
      setValue("bcityNameMr", getValues("acityNameMr"));
      // setValue('bstateMr', getValues('astateMr'))

      setValue("bbirthDate", getValues("abirthDate"));
      if (getValues("marriageDate")) {
        setValue(
          "bage",
          calculateAge(
            moment(getValues("marriageDate")).format("YYYY"),
            moment(getValues("bbirthDate")).format("YYYY"),
          ),
        );
      }
      setValue("bgender", getValues("agender"));
      setValue("bmobileNo", getValues("amobileNo"));
      setValue("bemail", getValues("aemail"));

      setTemp(true);
    } else {
      setValue("btitle", "");
      setValue("btitleMar", "");
      setValue("bfName", "");
      setValue("bmName", "");
      setValue("blName", "");
      setValue("bbuildingNo", "");
      setValue("bbuildingName", "");
      setValue("broadName", "");
      setValue("blandmark", "");
      setValue("bcityName", "");
      setValue("bstate", "");
      setValue("bpincode", "");
      setValue("bfNameMr", "");
      setValue("bmNameMr", "");
      setValue("blNameMr", "");
      setValue("bbuildingNoMr", "");
      setValue("bbuildingNameMr", "");
      setValue("broadNameMr", "");
      setValue("blandmarkMr", "");
      setValue("bcityNameMr", "");
      setValue("bstateMr", "");
      setValue("bbirthDate", null);
      setValue("bage", null);
      setValue("bgender", null);
      setValue("bmobileNo", "");
      setValue("bemail", "");

      setTemp();
    }
  };

  const disabilities = (e) => {
    // setValue('gdisabled', e.target.checked)
    console.log("bdisabled", getValues("bdisabled"));
    if (e.target.checked) {
      setValue("bdisabled", e.target.checked);

      // setTemp(true)
    } else {
      setValue("bdisabled", "");
    }
  };

  useEffect(() => {
    getBGenders();
    getBAgeProofDocumentKey();
    getBIdDocumentKeys();
    getBResidentialDocumentKeys();
    getReligions();
    getbTitles();
    getbTitles();
    getDisabilities();
    getbTitleMars();
    getbStatusAtTimeMarriageKeys();
  }, []);

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
  // view - Bride
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
            disabled={disabled ? true : getValues("isApplicantGroom") ? true : false}
            // disabled={getValues('isApplicantGroom')}
            control={<Checkbox checked={getValues("isApplicantBride")} />}
            label=<Typography>
              <b>
                {" "}
                <FormattedLabel id="ApplicatCheck2" />
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
              {" "}
              {<FormattedLabel id="brideDetails" />}{" "}
            </h3>
            <h5
              style={{
                color: "white",
                marginTop: "10px",
                marginLeft: "5px",
              }}
            >
              {<FormattedLabel id="BriNBM" />}
            </h5>
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
            <FormControl variant="standard" error={!!errors.btitle} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* {<FormattedLabel id="title" />} */}
                <FormattedLabel id="title1" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("btitleMar", value.target.value);
                    }}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {bTitles &&
                      bTitles.map((btitle, index) => (
                        <MenuItem key={index} value={btitle.id}>
                          {btitle.btitle}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="btitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.btitle ? errors.btitle.message : null}</FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bfName") ? true : false) ||
                // (router.query.bfName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="firstName" required />}
              // label={<FormattedLabel id="firstName" />}
              disabled={disabled}
              variant="standard"
              {...register("bfName")}
              error={!!errors.bfName}
              helperText={errors?.bfName ? errors.bfName.message : null}
            />
          </div>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bmName") ? true : false) ||
                // (router.query.bmName ? true : false),
              }}
              id="standard-basic"
              // label={<FormattedLabel id="middleName" />}
              disabled={disabled}
              label={<FormattedLabel id="middleName" required />}
              variant="standard"
              {...register("bmName")}
              error={!!errors.bmName}
              helperText={errors?.bmName ? errors.bmName.message : null}
            />
          </div>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("blName") ? true : false) ||
                // (router.query.blName ? true : false),
              }}
              id="standard-basic"
              // label={<FormattedLabel id="lastName" />}
              disabled={disabled}
              label={<FormattedLabel id="lastName" required />}
              variant="standard"
              {...register("blName")}
              error={!!errors.blName}
              helperText={errors?.blName ? errors.blName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl variant="standard" error={!!errors.btitleMar} sx={{ marginTop: 2 }}>
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
                      setValue("btitle", value.target.value);
                    }}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {bTitleMars &&
                      bTitleMars.map((btitleMar, index) => (
                        <MenuItem key={index} value={btitleMar.id}>
                          {btitleMar.btitleMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="btitleMar"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.btitleMar ? errors.btitleMar.message : null}</FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              id="standard-basic"
              InputLabelProps={{
                shrink: temp,
                // (watch("bfNameMr") ? true : false) ||
                // (router.query.bfNameMr ? true : false),
              }}
              // label={<FormattedLabel id="firstNameV" />}
              label={<FormattedLabel id="firstNamemr" required />}
              disabled={disabled}
              variant="standard"
              {...register("bfNameMr")}
              error={!!errors.bfNameMr}
              helperText={errors?.bfNameMr ? errors.bfNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              id="standard-basic"
              // label={<FormattedLabel id="middleNameV" />}
              disabled={disabled}
              label={<FormattedLabel id="middleNamemr" required />}
              InputLabelProps={{
                shrink: temp,
                // (watch("bmNameMr") ? true : false) ||
                // (router.query.bmNameMr ? true : false),
              }}
              variant="standard"
              {...register("bmNameMr")}
              error={!!errors.bmNameMr}
              helperText={errors?.bmNameMr ? errors.bmNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              id="standard-basic"
              InputLabelProps={{
                shrink: temp,
                // (watch("blNameMr") ? true : false) ||
                // (router.query.blNameMr ? true : false),
              }}
              // label={<FormattedLabel id="lastNameV" />}
              disabled={disabled}
              label={<FormattedLabel id="lastNamemr" required />}
              variant="standard"
              {...register("blNameMr")}
              error={!!errors.blNameMr}
              helperText={errors?.blNameMr ? errors.blNameMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl error={!!errors.bbirthDate} sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name="bbirthDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={disabled}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>{<FormattedLabel id="BirthDate" required />}</span>
                      }
                      maxDate={new Date()}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                        // setValue(
                        //   "bage",
                        //   moment(getValues("marriageDate")).format("YYYY") -
                        //     moment(getValues("bbirthDate")).format("YYYY"),
                        // );

                        setValue(
                          "bage",
                          calculateAge(
                            moment(getValues("marriageDate")).format("YYYY-MM-DD"),
                            moment(getValues("bbirthDate")).format("YYYY-MM-DD"),
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
              <FormHelperText>{errors?.bbirthDate ? errors.bbirthDate.message : null}</FormHelperText>
            </FormControl>
          </div>

          {/* <div>
            <FormControl style={{ marginTop: 0 }} error={!!errors.bbirthDate}>
              <Controller
                control={control}
                name="bbirthDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 13 }}>
                          {<FormattedLabel id="BirthDate" />}
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format('YYYY-MM-DD'))
                      }
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
              <FormHelperText>
                {errors?.bbirthDate ? errors.bbirthDate.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}
          <div>
            <TextField
              disabled
              InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="Age" required />}
              // disabled={disabled}
              variant="standard"
              {...register("bage")}
              error={!!errors.bage}
              helperText={errors?.bage ? errors.bage.message : null}
            />
          </div>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.bgender}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Gender" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Gender *"
                  >
                    {bGenders &&
                      bGenders.map((bgender, index) => (
                        <MenuItem key={index} value={bgender.id}>
                          {/* {bgender.bgender} */}
                          {language == "en" ? bgender?.gender : bgender?.genderMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="bgender"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.bgender ? errors.bgender.message : null}</FormHelperText>
            </FormControl>
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("baadharNo") ? true : false) || (router.query.baadharNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNo" required />}
              variant="standard"
              disabled={disabled}
              {...register("baadharNo")}
              error={!!errors.baadharNo}
              helperText={errors?.baadharNo ? errors.baadharNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: (watch("bemail") ? true : false) || (router.query.bemail ? true : false),
              }}
              id="standard-basic"
              disabled={disabled}
              label={<FormattedLabel id="email" />}
              variant="standard"
              {...register("bemail")}
              error={!!errors.bemail}
              helperText={errors?.bemail ? errors.bemail.message : null}
            />
          </div>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.breligionByBirth}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Religion1" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=" Religion by Birth *"
                  >
                    {religions &&
                      religions.map((breligionByBirth, index) => (
                        <MenuItem key={index} value={breligionByBirth.id}>
                          {/* {breligionByBirth.breligionByBirth} */}
                          {language == "en" ? breligionByBirth?.religion : breligionByBirth?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="breligionByBirth"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.breligionByBirth ? errors.breligionByBirth.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.breligionByAdoption}>
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
                      religions.map((breligionByAdoption, index) => (
                        <MenuItem key={index} value={breligionByAdoption.id}>
                          {/* {breligionByAdoption.breligionByAdoption} */}
                          {language == "en" ? breligionByAdoption?.religion : breligionByAdoption?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="breligionByAdoption"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.breligionByAdoption ? errors.breligionByAdoption.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.bstatusAtTimeMarriageKey}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="StatusOfMarrige" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Status at time of marriage *"
                  >
                    {bStatusAtTimeMarriageKeys &&
                      bStatusAtTimeMarriageKeys.map((bstatusAtTimeMarriageKey, index) => (
                        <MenuItem key={index} value={bstatusAtTimeMarriageKey.id}>
                          {/* {gStatusOfDocumentKey.gStatusOfDocumentKey} */}

                          {language == "en"
                            ? bstatusAtTimeMarriageKey?.statusDetails
                            : bstatusAtTimeMarriageKey?.statusDetailsMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="bstatusAtTimeMarriageKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bstatusAtTimeMarriageKey ? errors.bstatusAtTimeMarriageKey.message : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div>

        <div className={styles.rowdis}>
          {watch("bstatusAtTimeMarriageKey") && watch("bstatusAtTimeMarriageKey") == 3 && (
            <div style={{ marginLeft: "6vh" }}>
              <FormControl error={!!errors.bdivorceDate} sx={{ marginTop: 0 }}>
                <Controller
                  control={control}
                  name="bdivorceDate"
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
                <FormHelperText>{errors?.bdivorceDate ? errors.bdivorceDate.message : null}</FormHelperText>
              </FormControl>
            </div>
          )}
          {watch("bstatusAtTimeMarriageKey") && watch("bstatusAtTimeMarriageKey") == 4 && (
            <div style={{ marginLeft: "6vh" }}>
              <FormControl error={!!errors.bwidowDate} sx={{ marginTop: 0 }}>
                <Controller
                  control={control}
                  name="bwidowDate"
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
                <FormHelperText>{errors?.bwidowDate ? errors.bwidowDate.message : null}</FormHelperText>
              </FormControl>
            </div>
          )}

          <div style={{ marginLeft: "12vh" }}>
            <FormControlLabel
              // disabled={disabled ? true : getValues("gdisabled") ? true : false}
              sx={{ marginTop: "4vh" }}
              disabled={disabled ? true : getValues("bdisabled") ? true : false}
              control={<Checkbox checked={getValues("bdisabled") ? true : false} />}
              label=<Typography>
                <b>
                  {" "}
                  <FormattedLabel id="AppliToBrideD" />
                </b>
              </Typography>
              onChange={(e) => {
                disabilities(e);
              }}
            />
          </div>
          {watch("bdisabled") == true && (
            <div style={{ marginRight: "auto", marginLeft: "22vh" }}>
              <FormControl sx={{}} error={!!errors.bdisabilityType}>
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
                  name="bdisabilityType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bdisabilityType ? errors.bdisabilityType.message : null}
                </FormHelperText>
              </FormControl>
            </div>
          )}

          <div></div>
          <div></div>
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
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bbuildingNo") ? true : false) ||
                // (router.query.bbuildingNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" required />}
              disabled={disabled}
              variant="standard"
              {...register("bbuildingNo")}
              error={!!errors.bbuildingNo}
              helperText={errors?.bbuildingNo ? errors.bbuildingNo.message : null}
            />
          </div>

          <div>
            <TextField
              //   InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bbuildingName") ? true : false) ||
                // (router.query.bbuildingName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" required />}
              variant="standard"
              disabled={disabled}
              {...register("bbuildingName")}
              error={!!errors.bbuildingName}
              helperText={errors?.bbuildingName ? errors.bbuildingName.message : null}
            />
          </div>
          <div>
            <TextField
              //  InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("broadName") ? true : false) ||
                // (router.query.broadName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadName" required />}
              variant="standard"
              disabled={disabled}
              {...register("broadName")}
              error={!!errors.broadName}
              helperText={errors?.broadName ? errors.broadName.message : null}
            />
          </div>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("blandmark") ? true : false) ||
                // (router.query.blandmark ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" required />}
              disabled={disabled}
              variant="standard"
              {...register("blandmark")}
              error={!!errors.blandmark}
              helperText={errors?.blandmark ? errors.blandmark.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bbuildingNoMr") ? true : false) ||
                // (router.query.bbuildingNoMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNomr" required />}
              variant="standard"
              disabled={disabled}
              {...register("bbuildingNoMr")}
              error={!!errors.bbuildingNoMr}
              helperText={errors?.bbuildingNoMr ? errors.bbuildingNoMr.message : null}
            />
          </div>

          <div>
            <TextField
              //   InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bbuildingNameMr") ? true : false) ||
                // (router.query.bbuildingNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="buildingNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("bbuildingNameMr")}
              error={!!errors.bbuildingNameMr}
              helperText={errors?.bbuildingNameMr ? errors.bbuildingNameMr.message : null}
            />
          </div>

          <div>
            <TextField
              //  InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("broadNameMr") ? true : false) ||
                // (router.query.broadNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("broadNameMr")}
              error={!!errors.broadNameMr}
              helperText={errors?.broadNameMr ? errors.broadNameMr.message : null}
            />
          </div>

          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("blandmarkMr") ? true : false) ||
                // (router.query.blandmarkMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmarkmr" required />}
              variant="standard"
              disabled={disabled}
              {...register("blandmarkMr")}
              error={!!errors.blandmarkMr}
              helperText={errors?.blandmarkMr ? errors.blandmarkMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              //   InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bcityName") ? true : false) ||
                // (router.query.bcityName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" required />}
              variant="standard"
              disabled={disabled}
              {...register("bcityName")}
              error={!!errors.bcityName}
              helperText={errors?.bcityName ? errors.bcityName.message : null}
            />
          </div>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bstate") ? true : false) ||
                // (router.query.bstate ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="State" required />}
              disabled={disabled}
              variant="standard"
              {...register("bstate")}
              error={!!errors.bstate}
              helperText={errors?.bstate ? errors.bstate.message : null}
            />
          </div>

          <div>
            <TextField
              //   InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bcityNameMr") ? true : false) ||
                // (router.query.bcityNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("bcityNameMr")}
              error={!!errors.bcityNameMr}
              helperText={errors?.bcityNameMr ? errors.bcityNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              defaultValue="महाराष्ट्र"
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bstateMr") ? true : false) ||
                // (router.query.bstateMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="statemr" required />}
              disabled={disabled}
              variant="standard"
              {...register("bstateMr")}
              error={!!errors.bstateMr}
              helperText={errors?.bstateMr ? errors.bstateMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bpincode") ? true : false) ||
                // (router.query.bpincode ? true : false),
              }}
              id="standard-basic"
              disabled={disabled}
              label={<FormattedLabel id="pincode" required />}
              variant="standard"
              {...register("bpincode")}
              error={!!errors.bpincode}
              helperText={errors?.bpincode ? errors.bpincode.message : null}
            />
          </div>

          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: (watch("bmobileNo") ? true : false) || (router.query.bmobileNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNo" />}
              variant="standard"
              disabled={disabled}
              {...register("bmobileNo")}
              error={!!errors.bmobileNo}
              helperText={errors?.bmobileNo ? errors.bmobileNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.bAgeProofDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="AgeDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Age Proof"
                  >
                    {bAgeProofDocumentKey &&
                      bAgeProofDocumentKey.map(
                        (bAgeProofDocumentKey, index) => (
                          <MenuItem key={index} value={bAgeProofDocumentKey.id}>
                            {bAgeProofDocumentKey.bAgeProofDocumentKey}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="bAgeProofDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bAgeProofDocumentKey
                  ? errors.bAgeProofDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div> */}
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.BIdDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="IdDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  ID Document"
                  >
                    {BIdDocumentKeys &&
                      BIdDocumentKeys.map((BIdDocumentKey, index) => (
                        <MenuItem key={index} value={BIdDocumentKey.id}>
                          {BIdDocumentKey.BIdDocumentKey}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="BIdDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.BIdDocumentKey ? errors.BIdDocumentKey.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}
        </div>
        <div className={styles.row}>
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.bResidentialDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="residentialDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=" Residential Document"
                  >
                    {bResidentialDocumentKeys &&
                      bResidentialDocumentKeys.map(
                        (bResidentialDocumentKey, index) => (
                          <MenuItem
                            key={index}
                            value={bResidentialDocumentKey.id}
                          >
                            {bResidentialDocumentKey.bResidentialDocumentKey}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="bResidentialDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bResidentialDocumentKey
                  ? errors.bResidentialDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <FormControl
              variant="standard"
              sx={{ minWidth: 120, marginLeft: '2.5vw' }}
              error={!!errors.bStatusOfDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="StatusOfDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  Status of Document"
                  >
                    <MenuItem value={1}>Pending</MenuItem>
                    <MenuItem value={2}>Successful</MenuItem>
                  </Select>
                )}
                name="bStatusOfDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bStatusOfDocumentKey
                  ? errors.bStatusOfDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div> */}
        </div>

        {/* <div className={styles.row} style={{ marginTop: 30 }}>
          <h1>{<FormattedLabel id="brideParaentDetail" />}</h1>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="firstNameF" />}
              variant="standard"
              {...register('bFFName')}
              error={!!errors.bFFName}
              helperText={errors?.bFFName ? errors.bFFName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="middleNameF" />}
              variant="standard"
              {...register('bFMName')}
              error={!!errors.bFMName}
              helperText={errors?.bFMName ? errors.bFMName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="lastNameF" />}
              variant="standard"
              {...register('bFLName')}
              error={!!errors.bFLName}
              helperText={errors?.bFLName ? errors.bFLName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="AadharNoF" />}
              variant="standard"
              {...register('bFAadharNo')}
              error={!!errors.bFAadharNo}
              helperText={errors?.bFAadharNo ? errors.bFAadharNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="AgeF" />}
              variant="standard"
              {...register('bFAge')}
              error={!!errors.bFAge}
              helperText={errors?.bFAge ? errors.bFAge.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="mobileNoF" />}
              variant="standard"
              {...register('bFMobileNo')}
              error={!!errors.bFMobileNo}
              helperText={errors?.bFMobileNo ? errors.bFMobileNo.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="firstNameM" />}
              variant="standard"
              {...register('bMFName')}
              error={!!errors.bMFName}
              helperText={errors?.bMFName ? errors.bMFName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="middleNameM" />}
              variant="standard"
              {...register('bMMName')}
              error={!!errors.bMMName}
              helperText={errors?.bMMName ? errors.bMMName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="lastNameM" />}
              variant="standard"
              {...register('bMLName')}
              error={!!errors.bMLName}
              helperText={errors?.bMLName ? errors.bMLName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="AgeM" />}
              variant="standard"
              {...register('bMAge')}
              error={!!errors.bMAge}
              helperText={errors?.bMAge ? errors.bMAge.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="AadharNoM" />}
              variant="standard"
              {...register('bMAadharNo')}
              error={!!errors.bMAadharNo}
              helperText={errors?.bMAadharNo ? errors.bMAadharNo.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="mobileNoM" />}
              variant="standard"
              {...register('bMMobileNo')}
              error={!!errors.bMMobileNo}
              helperText={errors?.bMMobileNo ? errors.bMMobileNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="email" />}
              variant="standard"
              {...register('bFEmail')}
              error={!!errors.bFEmail}
              helperText={errors?.bFEmail ? errors.bFEmail.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" />}
              variant="standard"
              {...register('bFBuildingNo')}
              error={!!errors.bFBuildingNo}
              helperText={
                errors?.bFBuildingNo ? errors.bFBuildingNo.message : null
              }
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="buildingName" />}
              variant="standard"
              {...register('bFBuildingName')}
              error={!!errors.bFBuildingName}
              helperText={
                errors?.bFBuildingName ? errors.bFBuildingName.message : null
              }
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="roadName" />}
              variant="standard"
              {...register('bFRoadName')}
              error={!!errors.bFRoadName}
              helperText={errors?.bFRoadName ? errors.bFRoadName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="Landmark" />}
              bFVillageName
              variant="standard"
              {...register('bFLandmark')}
              error={!!errors.bFLandmark}
              helperText={errors?.bFLandmark ? errors.bFLandmark.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="villageName" />}
              variant="standard"
              {...register('bFVillageName')}
              error={!!errors.bFVillageName}
              helperText={
                errors?.bFVillageName ? errors.bFVillageName.message : null
              }
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="cityName" />}
              variant="standard"
              {...register('bFCityName')}
              error={!!errors.bFCityName}
              helperText={errors?.bFCityName ? errors.bFCityName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="state" />}
              variant="standard"
              {...register('bFState')}
              error={!!errors.bFState}
              helperText={errors?.bFState ? errors.bFState.message : null}
            />
          </div>
        </div>

        <div>
          <TextField
            sx={{ width: 230, marginLeft: '2.5vw' }}
            id="standard-basic"
            label={<FormattedLabel id="pincode" />}
            variant="standard"
            {...register('bFPincode')}
            error={!!errors.bFPincode}
            helperText={errors?.bFPincode ? errors.bFPincode.message : null}
          />
        </div> */}
      </div>
    </>
  );
};
export default BrideDetails;

// useEffect(() => {
//   dateConverter()
// }, [getValues("bbirthDate"),getValues("marriageDate")])

// const dateConverter = (startDate, timeEnd) => {
//   // const brideAge = Math.floor(
//   //   moment(getValues('marriageDate')).format('YYYY') -
//   //     moment(getValues('bbirthDate')).format('YYYY'),
//   // )
//   console.log('bride age', brideAge)
// }
// {...register('addressCheckBoxB')}
