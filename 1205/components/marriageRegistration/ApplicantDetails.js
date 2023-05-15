import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../marriageRegistration/view.module.css";

// Component
const ApplicantDetails = () => {
  const router = useRouter();
  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);

  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const [atitles, setatitles] = useState([]);
  const [temp, setTemp] = useState();
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

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setDisabled(false);
      console.log("enabled");
      if (watch("zoneKey")) {
        setTemp(watch("zoneKey"));
      }
      setValue("astate", "Maharashtra");
      setValue("astateMr", "महाराष्ट्र");

      setValue("");
    } else {
      setDisabled(true);
      console.log("disabled");
      if (watch("zoneKey")) {
        setTemp(watch("zoneKey"));
      }
    }
  }, []);

  const getZoneKeys = async () => {
    await axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      );
    });
  };

  const getWardKeys = async () => {
    await axios
      .get(
        `${
          urls.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${temp}`,
      )
      .then((r) => {
        setWardKeys(
          r.data.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          })),
        );
      });
  };

  const getTitles = async () => {
    await axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setatitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titlemr: row.titleMr,
        })),
      );
    });
  };

  const validateDetails = () => {
    if (watch("pplaceOfMarriage").length > 10) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (temp) getWardKeys();
  }, [temp]);

  useEffect(() => {
    if (router.query.pageMode != "Add") setTemp(getValues("zoneKey"));
  }, [getValues("zoneKey")]);

  useEffect(() => {
    getZoneKeys();
    getTitles();
    // getWardKeys()
    // setTemp(user.zone)
    // setValue('zoneKey', user.zone)
    // setValue('wardKey', user.ward)

    // setTemp(user.zone)
    // setValue('zoneKey', user.zone)
    // setValue('wardKey', user.ward)
    if (router.query.pageMode === "Edit" || router.query.pageMode === "Add") {
      console.log("router.query.pageMode", router.query);
      console.log("atitleMr", getValues("atitleMr"));

      setValue("atitle", user.title);
      setValue("afName", user.firstName);
      setValue("amName", user.middleName);
      setValue("alName", user.surname);

      setValue("aflatBuildingNo", user.cflatBuildingNo);
      setValue("abuildingName", user.cbuildingName);
      setValue("aroadName", user.croadName);
      setValue("alandmark", user.clandmark);

      setValue("atitleMr", user.title);
      setValue("afNameMr", user.firstNamemr);
      setValue("amNameMr", user.middleNamemr);
      setValue("alNameMr", user.surnamemr);

      setValue("aflatBuildingNoMr", user.cflatBuildingNoMr);
      setValue("abuildingNameMr", user.cbuildingNameMr);
      setValue("aroadNameMr", user.croadNameMr);
      setValue("alandmarkMr", user.clandmarkMr);

      setValue("apincode", user.cpinCode);
      setValue("aemail", user.emailID);
      setValue("amobileNo", user.mobile);
      setValue("abirthDate", user.dateOfBirth);
      setValue("agender", user.gender);

      setValue("acityName", user.ccity);
      setValue("astate", user.cstate);
      setValue("acityNameMr", user.ccityMr);
      setValue("astateMr", user.cstateMr);
    }
  }, [user]);

  // view
  return (
    <>
      <div className={styles.small} style={{ marginTop: 30 }}>
        <h4
          style={{
            marginLeft: "40px",
            color: "red",
            fontStyle: "italic",
          }}
        >
          {<FormattedLabel id="onlyMHR" />}
        </h4>

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="ApplicatDetails" />}{" "}
            </h3>
          </div>
        </div>

        <div className={styles.row} style={{ marginRight: "50%" }}>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.zoneKey}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="zone" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    // InputLabelProps={{
                    //   shrink:
                    //     (watch('zoneKey') ? true : false) ||
                    //     (router.query.zoneKey ? true : false),
                    // }}
                    autoFocus
                    //sx={{ width: 230 }}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // console.log("Zone Key: ", value.target.value)
                      setTemp(value.target.value);
                    }}
                    label="Zone Name *"
                  >
                    {zoneKeys &&
                      zoneKeys.map((zoneKey, index) => (
                        <MenuItem key={index} value={zoneKey.id}>
                          {/* {zoneKey.zoneKey} */}

                          {language == "en" ? zoneKey?.zoneName : zoneKey?.zoneNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="zoneKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.wardKey}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="ward" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    // InputLabelProps={{
                    //   shrink:
                    //     (watch('wardKey') ? true : false) ||
                    //     (router.query.wardKey ? true : false),
                    // }}
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Ward Name *"
                  >
                    {wardKeys &&
                      wardKeys.map((wardKey, index) => (
                        <MenuItem key={index} value={wardKey.id}>
                          {/* {wardKey.wardKey} */}
                          {language == "en" ? wardKey?.wardName : wardKey?.wardNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="wardKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
            </FormControl>
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
            <FormControl variant="standard" error={!!errors.atitle} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="title" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    // InputLabelProps={{
                    //   shrink:
                    //     (watch('atitle') ? true : false) ||
                    //     (router.query.atitle ? true : false),
                    // }}
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("atitleMr", value.target.value);
                    }}
                    label="Title *"
                  >
                    {atitles &&
                      atitles.map((atitle, index) => (
                        <MenuItem key={index} value={atitle.id}>
                          {/* {atitle.atitle} */}
                          {atitle?.title}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="atitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.atitle ? errors.atitle.message : null}
                {/* {errors.atitle && <p>{errors.atitle.message}</p>} */}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <TextField
              // InputLabelProps={{
              //   shrink:
              //     (watch('afName') ? true : false) ||
              //     (router.query.afName ? true : false),
              // }}
              // onKeyPress={KeyPressEvents.isInputChar}
              // onKeyUp={(event) => {
              //   if (event.ctrlKey && event.key == 'Enter') alert('Valid')
              // }}

              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="firstName" required />}
              // label=" Hello"
              variant="standard"
              {...register("afName")}
              error={!!errors.afName}
              helperText={errors?.afName ? errors.afName.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("amName") ? true : false) || (router?.query?.amName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              //label="Middle Name *"
              label={<FormattedLabel id="middleName" />}
              variant="standard"
              {...register("amName")}
              error={!!errors.amName}
              helperText={errors?.amName ? errors.amName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("alName") ? true : false) || (router.query.alName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              //label="Last Name *"
              label={<FormattedLabel id="lastName" required />}
              variant="standard"
              {...register("alName")}
              error={!!errors.alName}
              helperText={errors?.alName ? errors.alName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl variant="standard" error={!!errors.atitleMr} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="title" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    InputLabelProps={{
                      shrink: (watch("atitleMr") ? true : false) || (router.query.atitleMr ? true : false),
                    }}
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("atitle", value.target.value);
                    }}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {atitles &&
                      atitles.map((atitleMr, index) => (
                        <MenuItem key={index} value={atitleMr.id}>
                          {atitleMr?.titlemr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="atitleMr"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.atitleMr ? errors.atitleMr.message : null}</FormHelperText>
            </FormControl>
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("afNameMr") ? true : false) || (router.query.afNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="firstNamemr" required />}
              // label=" Hello"
              variant="standard"
              {...register("afNameMr")}
              error={!!errors.afNameMr}
              helperText={errors?.afNameMr ? errors.afNameMr.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("amNameMr") ? true : false) || (router.query.amNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              //label="Middle Name *"
              label={<FormattedLabel id="middleNamemr" />}
              variant="standard"
              {...register("amNameMr")}
              error={!!errors.amNameMr}
              helperText={errors?.amNameMr ? errors.amNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("alNameMr") ? true : false) || (router.query.alNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              //label="Last Name *"
              label={<FormattedLabel id="lastNamemr" required />}
              variant="standard"
              {...register("alNameMr")}
              error={!!errors.alNameMr}
              helperText={errors?.alNameMr ? errors.alNameMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row} style={{ marginRight: "50%" }}>
          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("aemail") ? true : false) || (router.query.aemail ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="email" required />}
              variant="standard"
              {...register("aemail")}
              error={!!errors.aemail}
              helperText={errors?.aemail ? errors.aemail.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("amobileNo") ? true : false) || (router.query.amobileNo ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNo" required />}
              variant="standard"
              {...register("amobileNo")}
              error={!!errors.amobileNo}
              helperText={errors?.amobileNo ? errors.amobileNo.message : null}
            />
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
              {<FormattedLabel id="Adress" />}
            </h3>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("aflatBuildingNo") ? true : false) || (router.query.aflatBuildingNo ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" required />}
              variant="standard"
              {...register("aflatBuildingNo")}
              error={!!errors.aflatBuildingNo}
              helperText={errors?.aflatBuildingNo ? errors.aflatBuildingNo.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("abuildingName") ? true : false) || (router.query.abuildingName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" required />}
              variant="standard"
              {...register("abuildingName")}
              error={!!errors.abuildingName}
              helperText={errors?.abuildingName ? errors.abuildingName.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("aroadName") ? true : false) || (router.query.aroadName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="roadName" required />}
              variant="standard"
              {...register("aroadName")}
              error={!!errors.aroadName}
              helperText={errors?.aroadName ? errors.aroadName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("alandmark") ? true : false) || (router.query.alandmark ? true : false),
              }}
              //disabled
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" required />}
              variant="standard"
              {...register("alandmark")}
              error={!!errors.alandmark}
              helperText={errors?.alandmark ? errors.alandmark.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("aflatBuildingNoMr") ? true : false) ||
                  (router.query.aflatBuildingNoMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNomr" required />}
              variant="standard"
              {...register("aflatBuildingNoMr")}
              error={!!errors.aflatBuildingNoMr}
              helperText={errors?.aflatBuildingNoMr ? errors.aflatBuildingNoMr.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("abuildingNameMr") ? true : false) || (router.query.abuildingNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="buildingNamemr" required />}
              variant="standard"
              {...register("abuildingNameMr")}
              error={!!errors.abuildingNameMr}
              helperText={errors?.abuildingNameMr ? errors.abuildingNameMr.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("aroadNameMr") ? true : false) || (router.query.aroadNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="roadNamemr" required />}
              variant="standard"
              {...register("aroadNameMr")}
              error={!!errors.aroadNameMr}
              helperText={errors?.aroadNameMr ? errors.aroadNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              //disabled
              InputLabelProps={{
                shrink: (watch("alandmarkMr") ? true : false) || (router.query.alandmarkMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="Landmarkmr" required />}
              variant="standard"
              {...register("alandmarkMr")}
              error={!!errors.alandmarkMr}
              helperText={errors?.alandmarkMr ? errors.alandmarkMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row} /* style={{ marginRight: "25%" }} */>
          <div>
            <TextField
              // disabled
              InputLabelProps={{
                shrink: (watch("acityName") ? true : false) || (router.query.acityName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" required />}
              variant="standard"
              {...register("acityName")}
              error={!!errors.acityName}
              helperText={errors?.acityName ? errors.acityName.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink: (watch("astate") ? true : false) || (router.query.astate ? true : false),
              }}
              disabled={true}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="State" required />}
              variant="standard"
              {...register("astate")}
              error={!!errors.astate}
              helperText={errors?.astate ? errors.astate.message : null}
            />
          </div>

          <div>
            <TextField
              // disabled
              InputLabelProps={{
                shrink: (watch("acityNameMr") ? true : false) || (router.query.acityNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="cityNamemr" required />}
              variant="standard"
              {...register("acityNameMr")}
              error={!!errors.acityNameMr}
              helperText={errors?.acityNameMr ? errors.acityNameMr.message : null}
            />
          </div>

          <div>
            <TextField
              // InputLabelProps={{
              //   shrink:
              //     (watch('astateMr') ? true : false) ||
              //     (router.query.astateMr ? true : false),
              // }}
              disabled={true}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="statemr" required />}
              variant="standard"
              {...register("astateMr")}
              error={!!errors.astateMr}
              helperText={errors?.astateMr ? errors.astateMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row} style={{ marginRight: "75%" }}>
          <div>
            <TextField
              //disabled
              InputLabelProps={{
                shrink: (watch("apincode") ? true : false) || (router.query.apincode ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="pincode" required />}
              variant="standard"
              {...register("apincode")}
              error={!!errors.apincode}
              helperText={errors?.apincode ? errors.apincode.message : null}
            />
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
              {<FormattedLabel id="marrigeDetails" />}
            </h3>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl variant="standard" sx={{ marginTop: 0 }} error={!!errors.marriageDate}>
              <Controller
                control={control}
                name="marriageDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      variant="standard"
                      maxDate={new Date()}
                      disabled={disabled}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 14 }}> {<FormattedLabel id="marrigeDate" required />}</span>
                      }
                      value={field.value}
                      onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          variant="standard"
                          error={!!errors.marriageDate}
                          disabled={disabled}
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
              <FormHelperText>{errors?.marriageDate ? errors.marriageDate.message : null}</FormHelperText>
            </FormControl>
          </div>

          <div>
            <TextField
              disabled={disabled}
              autoFocus
              InputLabelProps={{
                shrink:
                  (watch("pplaceOfMarriage") ? true : false) ||
                  (router.query.pplaceOfMarriage ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="placeofMarriage" required />}
              variant="standard"
              {...register("pplaceOfMarriage")}
              error={!!errors?.pplaceOfMarriage}
              helperText={errors?.pplaceOfMarriage ? errors.pplaceOfMarriage.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pplaceOfMarriageMr") ? true : false) ||
                  (router.query.pplaceOfMarriageMr ? true : false),
              }}
              disabled={disabled}
              autoFocus
              id="standard-basic"
              label={<FormattedLabel id="placeofMarriage1" required />}
              variant="standard"
              {...register("pplaceOfMarriageMr")}
              error={!!errors?.pplaceOfMarriageMr}
              helperText={errors?.pplaceOfMarriageMr ? errors.pplaceOfMarriageMr.message : null}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantDetails;
