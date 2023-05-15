import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import styles from "../../components/marriageRegistration/board.module.css";
import UploadButton from "../../components/marriageRegistration/DocumentsUploadMB";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import urls from "../../URLS/urls";

const Index = (props) => {
  let appName = "MR";
  let serviceName = "M-MBR";
  let applicationFrom = "online";
  const user = useSelector((state) => state?.user.user);

  const methods = useFormContext({
    criteriaMode: "all",
    // resolver: yupResolver(boardschema),
    mode: "onChange",
    defaultValues: {
      id: null,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const [atitles, setatitles] = useState([]);
  const [pageMode, setPageMode] = useState(null);

  const [disable, setDisable] = useState(false);

  const language = useSelector((state) => state?.labels.language);
  // zones
  const [temp, setTemp] = useState();

  const [zoneKeys, setZoneKeys] = useState([]);
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          })),
        );
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong Zones not Found!", "error");
      });
  };

  // wardKeys
  const [wardKeys, setWardKeys] = useState([]);

  // getWardKeys
  const getWardKeys = () => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${watch(
          "zoneKey",
        )}`,
      )
      .then((r) => {
        setWardKeys(
          r.data.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          })),
        );
      })
      .catch((err) => {
        // swal('Error!', 'Somethings Wrong Wards not Found!', 'error')
      });
  };

  useEffect(() => {
    getWardKeys();
  }, [watch("zoneKey")]);
  // genders
  const [genderKeys, setgenderKeys] = useState([]);

  // getgenderKeys
  const getgenderKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`)
      .then((r) => {
        setgenderKeys(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          })),
        );
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong Gender keys not Found!", "error");
      });
  };

  useEffect(() => {
    getZoneKeys();
    getWardKeys();
    getgenderKeys();
    // getDocumentKey()
    getTitles();
    getTitleMr();
  }, []);

  const getTitles = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`)
      .then((r) => {
        setatitles(
          r.data.title.map((row) => ({
            id: row.id,
            atitle: row.title,
            // titlemr: row.titlemr,
          })),
        );
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong Titles not Found!", "error");
      });
  };
  const [TitleMrs, setTitleMrs] = useState([]);
  const getTitleMr = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`)
      .then((r) => {
        setTitleMrs(
          r.data.title.map((row) => ({
            id: row.id,
            atitlemr: row.titleMr,
          })),
        );
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong Titles not Found!", "error");
      });
  };

  return (
    <>
      <div>
        <FormProvider {...methods}>
          <form>
            <div className={styles.small}>
              <>
                <Paper
                  style={{
                    backgroundColor: "RGB(240, 240, 240)",
                  }}
                >
                  <div className={styles.wardZone} style={{ alignItems: "center" }}>
                    <div>
                      <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.zoneKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zone" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              //sx={{ width: 230 }}
                              disabled={disable}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                console.log("Zone Key: ", value.target.value);
                                setTemp(value.target.value);
                              }}
                              label="Zone Name  "
                            >
                              {zoneKeys &&
                                zoneKeys.map((zoneKey, index) => (
                                  <MenuItem key={index} value={zoneKey.id}>
                                    {/*  {zoneKey.zoneKey} */}

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
                    <div className={styles.wardZone}>
                      <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.wardKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="ward" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={disable}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Ward Name  "
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
                </Paper>

                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      {<FormattedLabel id="applicantName" />}
                    </h3>
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <FormControl variant="standard" error={!!errors.atitle} sx={{ marginTop: 2 }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="titleInenglish" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // disabled
                            disabled={disable}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Title  "
                            id="demo-simple-select-standard"
                            labelId="id='demo-simple-select-standard-label'"
                          >
                            {atitles &&
                              atitles.map((atitle, index) => (
                                <MenuItem key={index} value={atitle.id}>
                                  {atitle.atitle}
                                  {/* {language == 'en'
                                        ? atitle?.title
                                        : atitle?.titleMr} */}
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
                  </div>

                  <div>
                    <TextField
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      label={<FormattedLabel id="firstName" required />}
                      // label="First Name *"
                      variant="standard"
                      {...register("afName")}
                      error={!!errors.afName}
                      helperText={errors?.afName ? errors.afName.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label="Middle Name *"
                      label={<FormattedLabel id="middleName" required />}
                      variant="standard"
                      {...register("amName")}
                      error={!!errors.amName}
                      helperText={errors?.amName ? errors.amName.message : null}
                    />
                  </div>
                  <div>
                    <TextField
                      // disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label="Last Name *"
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
                    <FormControl variant="standard" error={!!errors.atitlemr} sx={{ marginTop: 2 }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="titleInmarathi" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // disabled
                            disabled={disable}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Title  "
                            id="demo-simple-select-standard"
                            labelId="id='demo-simple-select-standard-label'"
                          >
                            {TitleMrs &&
                              TitleMrs.map((atitlemr, index) => (
                                <MenuItem key={index} value={atitlemr.id}>
                                  {atitlemr.atitlemr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="atitlemr"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.atitlemr ? errors.atitlemr.message : null}</FormHelperText>
                    </FormControl>
                  </div>

                  <div>
                    <TextField
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label="प्रथम नावं *"
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
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      //label="Middle Name *"
                      label={<FormattedLabel id="middleNamemr" required />}
                      // label="मधले नावं *"
                      variant="standard"
                      {...register("amNameMr")}
                      error={!!errors.amNameMr}
                      helperText={errors?.amNameMr ? errors.amNameMr.message : null}
                    />
                  </div>
                  <div>
                    <TextField
                      // disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      //label="Last Name *"
                      label={<FormattedLabel id="lastNamemr" required />}
                      // label="आडनाव *"
                      variant="standard"
                      {...register("alNameMr")}
                      error={!!errors.alNameMr}
                      helperText={errors?.alNameMr ? errors.alNameMr.message : null}
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
                      {<FormattedLabel id="Addrees" />}
                    </h3>
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <TextField
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
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
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
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
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadName" required />}
                      variant="standard"
                      {...register("aroadName")}
                      error={!!errors.aroadName}
                      helperText={errors?.aroadName ? errors.aroadName.message : null}
                    />
                  </div>
                </div>
                <div className={styles.row3}>
                  <div>
                    <TextField
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="Landmark" required />}
                      variant="standard"
                      {...register("alandmark")}
                      error={!!errors.alandmark}
                      helperText={errors?.alandmark ? errors.alandmark.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
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
                      defaultValue="Maharashtra"
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="State" required />}
                      variant="standard"
                      {...register("astate")}
                      error={!!errors.astate}
                      helperText={errors?.astate ? errors.astate.message : null}
                    />
                  </div>
                </div>

                {/* marathi Adress */}

                <div className={styles.row}>
                  <div>
                    <TextField
                      disabled={disable}
                      sx={{ width: 250 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="standard-basic"
                      label={<FormattedLabel id="flatBuildingNomr" required />}
                      variant="standard"
                      //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                      //  value={pflatBuildingNo}
                      // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                      {...register("aflatBuildingNoMr")}
                      error={!!errors.aflatBuildingNoMr}
                      helperText={errors?.aflatBuildingNoMr ? errors.aflatBuildingNoMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
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
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadNamemr" required />}
                      // label="गल्लीचे नाव"
                      variant="standard"
                      {...register("aroadNameMr")}
                      error={!!errors.aroadNameMr}
                      helperText={errors?.aroadNameMr ? errors.aroadNameMr.message : null}
                    />
                  </div>
                </div>
                <div className={styles.row3}>
                  <div>
                    <TextField
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="Landmarkmr" required />}
                      // label="जमीन चिन्ह"
                      variant="standard"
                      {...register("alandmarkMr")}
                      error={!!errors.alandmarkMr}
                      helperText={errors?.alandmarkMr ? errors.alandmarkMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="cityNamemr" required />}
                      // label="शहराचे नाव"
                      variant="standard"
                      {...register("acityNameMr")}
                      error={!!errors.acityNameMr}
                      helperText={errors?.acityNameMr ? errors.acityNameMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      defaultValue="महाराष्ट्र"
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                <div className={styles.row}>
                  <div>
                    <TextField
                      //  disabled
                      disabled={disable}
                      InputLabelProps={{ shrink: true }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="pincode" required />}
                      variant="standard"
                      {...register("apincode")}
                      error={!!errors.apincode}
                      helperText={errors?.apincode ? errors.apincode.message : null}
                    />
                  </div>
                  <div>
                    <TextField
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="mobileNo" required />}
                      variant="standard"
                      // value={pageType ? router.query.mobile : ''}
                      // disabled={router.query.pageMode === 'View'}
                      {...register("amobileNo")}
                      error={!!errors.amobileNo}
                      helperText={errors?.amobileNo ? errors.amobileNo.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      disabled={disable}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="email" required />}
                      variant="standard"
                      //  value={pageType ? router.query.emailAddress : ''}
                      // disabled={router.query.pageMode === 'View'}
                      {...register("aemail")}
                      error={!!errors.aemail}
                      helperText={errors?.aemail ? errors.aemail.message : null}
                    />
                  </div>
                </div>

                {/* owner details */}

                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      {<FormattedLabel id="OwnerDetails" />}
                      {/* Owner Details : */}
                    </h3>
                  </div>
                </div>

                {!disable ? (
                  <div style={{ marginLeft: "25px" }}>
                    <FormControlLabel
                      // disabled={
                      //   getValues('addressCheckBoxB') ||
                      //   router?.query?.pageMode === 'View' ||
                      //   router?.query?.pageMode === 'Edit'
                      // }
                      control={<Checkbox />}
                      label=<Typography>
                        <b>
                          {" "}
                          <FormattedLabel id="OwnerChkeck" />
                        </b>
                      </Typography>
                      {...register("addressCheckBoxG")}
                      onChange={(e) => {
                        addressChange(e);
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className={styles.row}>
                  <div>
                    <FormControl variant="standard" error={!!errors.otitle} sx={{ marginTop: 2 }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="title1" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // disabled
                            disabled={disable}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Title  "
                            id="demo-simple-select-standard"
                            labelId="id='demo-simple-select-standard-label'"
                          >
                            {atitles &&
                              atitles.map((atitle, index) => (
                                <MenuItem key={index} value={atitle.id}>
                                  {atitle.atitle}
                                  {/* {language == 'en'
                                        ? otitle?.title
                                        : otitle?.titleMr} */}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="otitle"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.otitle ? errors.otitle.message : null}</FormHelperText>
                    </FormControl>
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      label={<FormattedLabel id="firstName" required />}
                      // label="First Name *"
                      variant="standard"
                      {...register("ofName")}
                      error={!!errors.ofName}
                      helperText={errors?.ofName ? errors.ofName.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label="Middle Name *"
                      label={<FormattedLabel id="middleName" required />}
                      variant="standard"
                      {...register("omName")}
                      error={!!errors.omName}
                      helperText={errors?.omName ? errors.omName.message : null}
                    />
                  </div>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // disabled
                      disabled={disable}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label="Last Name *"
                      label={<FormattedLabel id="lastName" required />}
                      variant="standard"
                      {...register("olName")}
                      error={!!errors.olName}
                      helperText={errors?.olName ? errors.olName.message : null}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <FormControl variant="standard" error={!!errors.otitlemr} sx={{ marginTop: 2 }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="titlemr" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // disabled
                            disabled={disable}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Title  "
                            id="demo-simple-select-standard"
                            labelId="id='demo-simple-select-standard-label'"
                          >
                            {TitleMrs &&
                              TitleMrs.map((atitlemr, index) => (
                                <MenuItem key={index} value={atitlemr.id}>
                                  {atitlemr.atitlemr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="otitlemr"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.otitlemr ? errors.otitlemr.message : null}</FormHelperText>
                    </FormControl>
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label="प्रथम नावं *"
                      label={<FormattedLabel id="firstNamemr" required />}
                      // label=" Hello"
                      variant="standard"
                      {...register("ofNameMr")}
                      error={!!errors.ofNameMr}
                      helperText={errors?.ofNameMr ? errors.ofNameMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      //label="Middle Name *"
                      label={<FormattedLabel id="middleNamemr" required />}
                      // label="मधले नावं *"
                      variant="standard"
                      {...register("omNameMr")}
                      error={!!errors.omNameMr}
                      helperText={errors?.omNameMr ? errors.omNameMr.message : null}
                    />
                  </div>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // disabled
                      disabled={disable}
                      sx={{ width: 230 }}
                      id="standard-basic"
                      //label="Last Name *"
                      label={<FormattedLabel id="lastNamemr" required />}
                      // label="आडनाव *"
                      variant="standard"
                      {...register("olNameMr")}
                      error={!!errors.olNameMr}
                      helperText={errors?.olNameMr ? errors.olNameMr.message : null}
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
                      {<FormattedLabel id="Owneraddress" />}
                      {/* Owner Address: */}
                    </h3>
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="flatBuildingNo" required />}
                      variant="standard"
                      //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                      //  value={pflatBuildingNo}
                      // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                      {...register("oflatBuildingNo")}
                      error={!!errors.oflatBuildingNo}
                      helperText={errors?.oflatBuildingNo ? errors.oflatBuildingNo.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="buildingName" required />}
                      variant="standard"
                      {...register("obuildingName")}
                      error={!!errors.obuildingName}
                      helperText={errors?.obuildingName ? errors.obuildingName.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadName" required />}
                      variant="standard"
                      {...register("oroadName")}
                      error={!!errors.oroadName}
                      helperText={errors?.oroadName ? errors.oroadName.message : null}
                    />
                  </div>
                </div>
                <div className={styles.row3}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="Landmark" required />}
                      variant="standard"
                      {...register("olandmark")}
                      error={!!errors.olandmark}
                      helperText={errors?.olandmark ? errors.olandmark.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="cityName" required />}
                      variant="standard"
                      {...register("ocityName")}
                      error={!!errors.ocityName}
                      helperText={errors?.ocityName ? errors.ocityName.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      defaultValue="Maharashtra"
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="State" required />}
                      variant="standard"
                      {...register("ostate")}
                      error={!!errors.ostate}
                      helperText={errors?.ostate ? errors.ostate.message : null}
                    />
                  </div>
                </div>

                {/* marathi Adress */}

                <div className={styles.row}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="flatBuildingNomr" required />}
                      // label="फ्लॅट नंबर"
                      variant="standard"
                      //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                      //  value={pflatBuildingNo}
                      // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                      {...register("oflatBuildingNoMr")}
                      error={!!errors.oflatBuildingNoMr}
                      helperText={errors?.oflatBuildingNoMr ? errors.oflatBuildingNoMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="buildingNamemr" required />}
                      // label="अपार्टमेंट नाव"
                      variant="standard"
                      {...register("obuildingNameMr")}
                      error={!!errors.obuildingNameMr}
                      helperText={errors?.obuildingNameMr ? errors.obuildingNameMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadNamemr" required />}
                      // label="गल्लीचे नाव"
                      variant="standard"
                      {...register("oroadNameMr")}
                      error={!!errors.oroadNameMr}
                      helperText={errors?.oroadNameMr ? errors.oroadNameMr.message : null}
                    />
                  </div>
                </div>
                <div className={styles.row3}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="Landmarkmr" required />}
                      // label="जमीन चिन्ह"
                      variant="standard"
                      {...register("olandmarkMr")}
                      error={!!errors.olandmarkMr}
                      helperText={errors?.olandmarkMr ? errors.olandmarkMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="cityNamemr" required />}
                      // label="शहराचे नाव"
                      variant="standard"
                      {...register("ocityNameMr")}
                      error={!!errors.ocityNameMr}
                      helperText={errors?.ocityNameMr ? errors.ocityNameMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      defaultValue="महाराष्ट्र"
                      sx={{ width: 230 }}
                      id="standard-basic"
                      label={<FormattedLabel id="statemr" required />}
                      variant="standard"
                      {...register("ostateMr")}
                      error={!!errors.ostateMr}
                      helperText={errors?.ostateMr ? errors.ostateMr.message : null}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      //  disabled
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="pincode" required />}
                      variant="standard"
                      {...register("opincode")}
                      error={!!errors.opincode}
                      helperText={errors?.opincode ? errors.opincode.message : null}
                    />
                  </div>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="mobileNo" required />}
                      variant="standard"
                      // value={pageType ? router.query.mobile : ''}
                      // disabled={router.query.pageMode === 'View'}
                      {...register("omobileNo")}
                      error={!!errors.omobileNo}
                      helperText={errors?.omobileNo ? errors.omobileNo.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="email" required />}
                      variant="standard"
                      //  value={pageType ? router.query.emailAddress : ''}
                      // disabled={router.query.pageMode === 'View'}
                      {...register("oemail")}
                      error={!!errors.oemail}
                      helperText={errors?.oemail ? errors.oemail.message : null}
                    />
                  </div>
                </div>
                {/* </Paper> */}
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      {<FormattedLabel id="boardDetail" />}
                    </h3>
                  </div>
                </div>

                <div className={styles.row2}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="boardName" required />}
                      variant="standard"
                      // disabled={router.query.pageMode === 'View'}
                      {...register("marriageBoardName")}
                      error={!!errors.marriageBoardName}
                      helperText={errors?.marriageBoardName ? errors.marriageBoardName.message : null}
                    />
                  </div>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="boardNamemr" required />}
                      // label="विवाह मंडळचे नाव "
                      variant="standard"
                      // value={pageType ? router.query.marriageBoardName : ''}
                      // disabled={router.query.pageMode === 'View'}
                      {...register("marriageBoardNameMr")}
                      error={!!errors.marriageBoardNameMr}
                      helperText={errors?.marriageBoardNameMr ? errors.marriageBoardNameMr.message : null}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="flatBuildingNo" required />}
                      variant="standard"
                      //value={pageType ? router.query.flatBuildingNo : ''}
                      // disabled={router.query.pageMode === 'View'}
                      {...register("bflatBuildingNo")}
                      error={!!errors.bflatBuildingNo}
                      helperText={errors?.bflatBuildingNo ? errors.bflatBuildingNo.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="buildingName" required />}
                      variant="standard"
                      // value={pageType ? router.query.buildingName : ''}
                      // disabled={router.query.pageMode === 'View'}
                      {...register("bbuildingName")}
                      error={!!errors.bbuildingName}
                      helperText={errors?.bbuildingName ? errors.bbuildingName.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={disable}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadName" required />}
                      variant="standard"
                      // value={pageType ? router.query.roadName : ''}
                      {...register("broadName")}
                      error={!!errors.broadName}
                      helperText={errors?.broadName ? errors.broadName.message : null}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="Landmark" required />}
                      variant="standard"
                      // value={pageType ? router.query.landmark : ''}
                      disabled={disable}
                      {...register("blandmark")}
                      error={!!errors.blandmark}
                      helperText={errors?.blandmark ? errors.blandmark.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="cityName" required />}
                      variant="standard"
                      //   value={pageType ? router.query.city : ''}
                      disabled={disable}
                      {...register("city")}
                      error={!!errors.city}
                      helperText={errors?.city ? errors.city.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="pincode" required />}
                      variant="standard"
                      //  value={pageType ? router.query.pincode : ''}
                      disabled={disable}
                      {...register("bpincode")}
                      error={!!errors.bpincode}
                      helperText={errors?.bpincode ? errors.bpincode.message : null}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="flatBuildingNomr" required />}
                      // label="फ्लॅट नंबर"
                      variant="standard"
                      //value={pageType ? router.query.flatBuildingNo : ''}
                      disabled={disable}
                      {...register("bflatBuildingNoMr")}
                      error={!!errors.bflatBuildingNoMr}
                      helperText={errors?.bflatBuildingNoMr ? errors.bflatBuildingNoMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="buildingNamemr" required />}
                      // label="अपार्टमेंट नाव"
                      variant="standard"
                      // value={pageType ? router.query.buildingName : ''}
                      disabled={disable}
                      {...register("bbuildingNameMr")}
                      error={!!errors.bbuildingNameMr}
                      helperText={errors?.bbuildingNameMr ? errors.bbuildingNameMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadNamemr" required />}
                      // label="गल्लीचे नाव"
                      variant="standard"
                      // value={pageType ? router.query.roadName : ''}
                      disabled={disable}
                      {...register("broadNameMr")}
                      error={!!errors.broadNameMr}
                      helperText={errors?.broadNameMr ? errors.broadNameMr.message : null}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="Landmarkmr" required />}
                      // label="जमीन चिन्ह"
                      variant="standard"
                      // value={pageType ? router.query.landmark : ''}
                      disabled={disable}
                      {...register("blandmarkMr")}
                      error={!!errors.blandmarkMr}
                      helperText={errors?.blandmarkMr ? errors.blandmarkMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="cityNamemr" required />}
                      // label="शहराचे नाव"
                      variant="standard"
                      //   value={pageType ? router.query.city : ''}
                      disabled={disable}
                      {...register("cityMr")}
                      error={!!errors.cityMr}
                      helperText={errors?.cityMr ? errors.cityMr.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="AadharNo" required />}
                      variant="standard"
                      // value={pageType ? router.query.aadhaarNo : ''}
                      disabled={disable}
                      {...register("aadhaarNo")}
                      error={!!errors.aadhaarNo}
                      helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="mobileNo" required />}
                      variant="standard"
                      // value={pageType ? router.query.mobile : ''}
                      disabled={disable}
                      {...register("mobile")}
                      error={!!errors.mobile}
                      helperText={errors?.mobile ? errors.mobile.message : null}
                    />
                  </div>

                  <div>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="email" required />}
                      variant="standard"
                      //  value={pageType ? router.query.emailAddress : ''}
                      disabled={disable}
                      {...register("emailAddress")}
                      error={!!errors.emailAddress}
                      helperText={errors?.emailAddress ? errors.emailAddress.message : null}
                    />
                  </div>
                </div>
              </>

              {/* //doc start */}

              <>
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      {/* Document Tab : */}
                      {<FormattedLabel id="document" />}
                    </h3>
                  </div>
                </div>

                <div className={styles.row}>
                  <div style={{ marginTop: "20px" }}>
                    <Typography> {<FormattedLabel id="boardheadphoto" required />}</Typography>

                    <UploadButton
                      error={!!errors?.boardHeadPersonPhoto}
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("boardHeadPersonPhoto")}
                      fileKey={"boardHeadPersonPhoto"}
                      showDel={pageMode ? false : true}
                    />
                    <FormHelperText error={!!errors?.boardHeadPersonPhoto}>
                      {errors?.boardHeadPersonPhoto ? errors?.boardHeadPersonPhoto?.message : null}
                    </FormHelperText>
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <Typography>{<FormattedLabel id="boardorgphotocpy" required />}</Typography>

                    <UploadButton
                      error={!!errors?.boardOrganizationPhoto}
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("boardOrganizationPhoto")}
                      fileKey={"boardOrganizationPhoto"}
                      showDel={pageMode ? false : true}

                      // showDel={true}
                    />
                    <FormHelperText error={!!errors?.boardOrganizationPhoto}>
                      {errors?.boardOrganizationPhoto ? errors?.boardOrganizationPhoto?.message : null}
                    </FormHelperText>
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <Typography> {<FormattedLabel id="panCard" required />}</Typography>

                    <UploadButton
                      error={!!errors?.panCard}
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("panCard")}
                      fileKey={"panCard"}
                      showDel={pageMode ? false : true}

                      // showDel={true}
                    />
                    <FormHelperText error={!!errors?.panCard}>
                      {errors?.panCard ? errors?.panCard?.message : null}
                    </FormHelperText>
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <Typography> {<FormattedLabel id="adharcard" required />}</Typography>

                    <UploadButton
                      error={!!errors?.aadharCard}
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("aadharCard")}
                      fileKey={"aadharCard"}
                      showDel={pageMode ? false : true}

                      // showDel={true}
                    />
                    <FormHelperText error={!!errors?.aadharCard}>
                      {errors?.aadharCard ? errors?.aadharCard?.message : null}
                    </FormHelperText>
                  </div>
                </div>

                <div className={styles.row}>
                  <div style={{ marginTop: "20px" }}>
                    <Typography> {<FormattedLabel id="rationcard" />}</Typography>

                    <UploadButton
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("rationCard")}
                      fileKey={"rationCard"}
                      showDel={pageMode ? false : true}

                      // showDel={true}
                    />
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Typography>{<FormattedLabel id="electrbill" />}</Typography>
                    <UploadButton
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("electricityBill")}
                      fileKey={"electricityBill"}
                      showDel={pageMode ? false : true}

                      // showDel={true}
                    />
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Typography> {<FormattedLabel id="OtherDocument" />}</Typography>
                    <UploadButton
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("otherDoc")}
                      fileKey={"otherDoc"}
                      showDel={pageMode ? false : true}
                    />
                  </div>
                </div>
              </>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default Index;
