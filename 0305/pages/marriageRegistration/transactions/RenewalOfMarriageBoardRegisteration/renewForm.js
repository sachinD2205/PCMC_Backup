import { ThemeProvider } from "@emotion/react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
// import styles from '../../../../../../components/marriageRegistration/board.module.css'
import styles from "../../../../components/marriageRegistration/board.module.css";
//import boardschema from '../../../../components/marriageRegistration/schema/boardschema'
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";

const Index = (props) => {
  let appName = "MR";
  let serviceName = "M-RBR";
  let applicationFrom = "online";
  const user = useSelector((state) => state?.user.user);

  const methods = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(boardschema),
    mode: "onChange",
    // defaultValues: {
    //   id: null,
    //   wardKey: '',
    //   zoneKey: '',
    //   atitle: '',
    //   afName: '',
    //   amName: '',
    //   alName: '',
    //   afNameMr: '',
    //   amNameMr: '',
    //   alNameMr: '',

    //   aCflatBuildingNo: '',
    //   aCbuildingName: '',
    //   aCroadName: '',
    //   aCLandmark: '',
    //   aCCityName: '',
    //   aCPincode: '',

    //   aPflatBuildingNo: '',
    //   aPbuildingName: '',
    //   aProadName: '',
    //   aPLandmark: '',
    //   aPCityName: '',
    //   aPPincode: '',

    //   marriageBoardName: '',
    //   genderKey: '',
    //   bflatBuildingNo: '',
    //   bbuildingName: '',
    //   broadName: '',
    //   blandmark: '',
    //   bpincode: '',
    //   aadhaarNo: '',
    //   mobile: '',
    //   emailAddress: '',
    //   city: '',
    //   // validityOfMarriageBoardRegistration: null,
    //   remarks: '',
    //   serviceCharges: '',
    //   applicationAcceptanceCharges: '',
    //   applicationNumber: '',

    //   aCflatBuildingNoMr: '',
    //   aCbuildingNameMr: '',
    //   aCroadNameMr: '',
    //   aCLandmarkMr: '',
    //   aCCityNameMr: '',

    //   //marathi permanent

    //   aPflatBuildingNoMr: '',
    //   aPbuildingNameMr: '',
    //   aProadNameMr: '',
    //   aPLandmarkMr: '',
    //   aPCityNameMr: '',

    //   //marathi board

    //   marriageBoardNameMr: '',
    //   bflatBuildingNoMr: '',
    //   bbuildingNameMr: '',
    //   broadNameMr: '',
    //   blandmarkMr: '',
    //   cityMr: '',
    //   applicationNumber: '',
    // },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const router = useRouter();
  const [atitles, setatitles] = useState([]);

  useEffect(() => {
    console.log("props.data", props.data);
    reset(props.data);
  }, []);

  // OnSubmit Form
  const onSubmitForm = (data) => {
    console.log("jml ka", getValues("boardHeadPersonPhoto"));
  };

  //file upload

  const [fileName, setFileName] = useState(null);

  const language = useSelector((state) => state?.labels.language);
  // zones
  const [temp, setTemp] = useState();
  // const [tempData, setTempData] = useState(props.photos)

  const [zoneKeys, setZoneKeys] = useState([]);
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      );
    });
  };

  // wardKeys
  const [wardKeys, setWardKeys] = useState([]);

  // getWardKeys
  const getWardKeys = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        })),
      );
    });
  };

  useEffect(() => {
    //   if (temp)
    getWardKeys();
    // }, [temp])
  }, []);
  // genders
  const [genderKeys, setgenderKeys] = useState([]);

  // getgenderKeys
  const getgenderKeys = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setgenderKeys(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
      );
    });
  };

  const [document, setDocument] = useState([]);

  // getGAgeProofDocumentKey
  const getDocumentKey = () => {
    axios.get(`${urls.CFCURL}/master/serviceWiseChecklist/getAll`).then((r) => {
      setDocument(r.data.serviceWiseChecklist);
    });
  };

  useEffect(() => {
    getZoneKeys();
    getWardKeys();
    getgenderKeys();
    getDocumentKey();
    getTitles();
    getTitleMr();
  }, [temp]);

  useEffect(() => {
    // if (router.query.pageMode === 'EDIT' || router.query.pageMode === 'View') {
    //   reset(router.query)
    // }
    console.log("user123", user);
    setValue("atitle", user.title);
    setValue("afName", user.firstName);
    setValue("amName", user.middleName);
    setValue("alName", user.surname);
    setValue("afNameMr", user.firstNamemr);
    setValue("amNameMr", user.middleNamemr);
    setValue("alNameMr", user.surnamemr);
    setValue("genderKey", user.gender);
    setValue("emailAddress", user.emailID);
    setValue("mobile", user.mobile);

    setValue("aflatBuildingNo", user.cflatBuildingNo);
    setValue("abuildingName", user.cbuildingName);
    setValue("aroadName", user.croadName);
    setValue("alandmark", user.clandmark);
    setValue("apincode", user.cpinCode);
    setValue("acityName", user.cCity);
    setValue("astate", user.cState);

    setValue("aflatBuildingNoMr", user.cflatBuildingNoMr);
    setValue("abuildingNameMr", user.cbuildingNameMr);
    setValue("aroadNameMr", user.croadNameMr);
    setValue("alandmarkMr", user.clandmarkMr);
    setValue("acityNameMr", user.cCityMr);
    setValue("astateMr", user.cStateMr);
    setValue("aemail", user.emailID);
    setValue("amobileNo", user.mobile);
  }, [user]);

  const getTitles = async () => {
    await axios.get(`${urls.BaseURL}/title/getAll`).then((r) => {
      setatitles(
        r.data.title.map((row) => ({
          id: row.id,
          atitle: row.title,
          // titlemr: row.titlemr,
        })),
      );
    });
  };
  const [TitleMrs, setTitleMrs] = useState([]);
  const getTitleMr = async () => {
    await axios.get(`${urls.BaseURL}/title/getAll`).then((r) => {
      setTitleMrs(
        r.data.title.map((row) => ({
          id: row.id,
          atitlemr: row.titleMr,
        })),
      );
    });
  };

  const handleApply = () => {
    axios
      .post(
        `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/saveMarraigeBoardCertificate`,
        {
          ...props.data,
          trnApplicantId: props.data.id,
          serviceId: 14,
          id: null,
          numberOfCopies: 1,
        },
        // allvalues,
      )
      .then((res) => {
        console.log("res000", res);
        if (res.status == 201) {
          console.log("iddddddd", res?.data?.message?.split("$")[1]);
          let iddd = res?.data?.message?.split("$")[1];
          console.log("iddd", iddd);

          swal("Success!", "Record Searched successfully !", "success");
          router.push({
            pathname:
              "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/PaymentCollection",
            // '/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection',
            query: {
              ...props.data,
              id: iddd,
              serviceId: 14,
            },
          });
        }
      })
      .catch((error) => {
        console.log("133", error);
        swal("Error!", "Error while saving", "error");
      });
  };

  const getById = (id) => {
    axios
      .get(`${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/getapplicantById?applicationId=${id}`)
      .then((r) => {
        console.log("r.data", r.data);

        let oldAppId = r.data.trnApplicantId;

        console.log(oldAppId, "oldAppId");

        let certificateIssueDateTime;

        axios
          .get(`${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${oldAppId}`)
          .then((re) => {
            certificateIssueDateTime = re.data.certificateIssueDateTime;
            setValue("registrationDate", re.data.certificateIssueDateTime);
            console.log("re.data", re.data);
          });

        reset(r.data);

        setValue("registrationDate", certificateIssueDateTime);

        // setFlagSearch(true);
      });
  };

  useEffect(() => {
    console.log("router?.query?.pageMode", router?.query?.pageMode);
    getById(router?.query?.applicationId);
  }, [router?.query?.pageMode == "View"]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 2,
            marginRight: 2,
            marginTop: 1,
            marginBottom: 2,
            padding: 1,
            border: 1,
            borderColor: "grey.500",
          }}
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.small}>
                  {!props.onlyDoc && (
                    <>
                      <Paper
                        style={{
                          backgroundColor: "RGB(240, 240, 240)",
                        }}
                      >
                        <div className={styles.wardZone}>
                          <div>
                            <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.zoneKey}>
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="zone" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    //sx={{ width: 230 }}
                                    disabled
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
                              <FormHelperText>
                                {errors?.zoneKey ? errors.zoneKey.message : null}
                              </FormHelperText>
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
                                    disabled
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
                              <FormHelperText>
                                {errors?.wardKey ? errors.wardKey.message : null}
                              </FormHelperText>
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
                              <FormattedLabel id="title1" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled
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
                            disabled
                            // disabled={router?.query?.disabled}
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
                            disabled
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
                            disabled
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
                              <FormattedLabel id="titlemr" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled
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
                            <FormHelperText>
                              {errors?.atitlemr ? errors.atitlemr.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div>
                          <TextField
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: 250 }}
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            sx={{ width: 250 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("amobileNo")}
                            error={!!errors.amobileNo}
                            helperText={errors?.amobileNo ? errors.amobileNo.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            {/* {<FormattedLabel id="applicantName" />} */}
                            Owner Details :
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <FormControl variant="standard" error={!!errors.otitle} sx={{ marginTop: 2 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="title1" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled
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
                              // defaultValue={null}
                            />
                            <FormHelperText>{errors?.otitle ? errors.otitle.message : null}</FormHelperText>
                          </FormControl>
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            // disabled={router?.query?.disabled}
                            disabled
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
                            disabled
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
                            disabled
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
                                  disabled
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
                            <FormHelperText>
                              {errors?.otitlemr ? errors.otitlemr.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
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
                            disabled
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
                            disabled
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
                            {/* {<FormattedLabel id="Addrees" />} */}
                            Owner Address:
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardName" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardNamemr" required />}
                            // label="विवाह मंडळचे नाव "
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("marriageBoardNameMr")}
                            error={!!errors.marriageBoardNameMr}
                            helperText={
                              errors?.marriageBoardNameMr ? errors.marriageBoardNameMr.message : null
                            }
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
                            label={<FormattedLabel id="flatBuildingNo" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingName" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
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
                            // disabled={router.query.pageMode === 'View'}
                            disabled
                            {...register("emailAddress")}
                            error={!!errors.emailAddress}
                            helperText={errors?.emailAddress ? errors.emailAddress.message : null}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className={styles.btn}>
                    {router?.query?.pageMode != "View" ? (
                      <>
                        <div className={styles.btn1}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                            onClick={handleApply}
                          >
                            {<FormattedLabel id="apply" />}
                          </Button>{" "}
                        </div>

                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            // onClick={() => exitButton()}
                            onClick={() => {
                              swal({
                                title: "Exit?",
                                text: "Are you sure you want to exit this Record ? ",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  swal("Record is Successfully Exit!", {
                                    icon: "success",
                                  });
                                  router.push(
                                    `/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration`,
                                  );
                                } else {
                                  swal("Record is Safe");
                                }
                              });
                            }}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            // onClick={() => exitButton()}
                            onClick={() => {
                              swal({
                                title: "Exit?",
                                text: "Are you sure you want to exit this Record ? ",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  swal("Record is Successfully Exit!", {
                                    icon: "success",
                                  });
                                  router.push(
                                    `/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration`,
                                  );
                                } else {
                                  swal("Record is Safe");
                                }
                              });
                            }}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
