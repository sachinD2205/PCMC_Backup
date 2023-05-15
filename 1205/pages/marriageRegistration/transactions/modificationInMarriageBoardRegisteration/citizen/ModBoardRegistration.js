import { yupResolver } from "@hookform/resolvers/yup";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import {
  Accordion,
  AccordionSummary,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import UploadButton from "../../../../../components/marriageRegistration/DocumentsUploadMB";
import modOfboardschema from "../../../../../components/marriageRegistration/schema/modOfboardschema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import styles from "./modificationInMBR.module.css";

const Index = (props) => {
  const disptach = useDispatch();
  let appName = "MR";
  let serviceName = "M-MMBC";
  let applicationFrom = "online";
  const [document, setDocument] = useState([]);
  const [pageMode, setPageMode] = useState(null);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(modOfboardschema),
    mode: "onChange",
    defaultValues: {
      id: null,
      wardKey: "",
      zoneKey: "",
      atitle: "",
      afName: "",
      amName: "",
      alName: "",
      afNameMr: "",
      amNameMr: "",
      alNameMr: "",
      omNameM: "",

      aCflatBuildingNo: "",
      aCbuildingName: "",
      aCroadName: "",
      aCLandmark: "",
      aCCityName: "",
      aCPincode: "",

      aPflatBuildingNo: "",
      aPbuildingName: "",
      aProadName: "",
      aPLandmark: "",
      aPCityName: "",
      aPPincode: "",

      marriageBoardName: "",
      genderKey: "",
      bflatBuildingNo: "",
      bbuildingName: "",
      broadName: "",
      blandmark: "",
      bpincode: "",
      aadhaarNo: "",
      mobile: "",
      emailAddress: "",
      city: "",
      // validityOfMarriageBoardRegistration: null,
      remarks: "",
      serviceCharges: "",
      applicationAcceptanceCharges: "",
      applicationNumber: "",

      aCflatBuildingNoMr: "",
      aCbuildingNameMr: "",
      aCroadNameMr: "",
      aCLandmarkMr: "",
      aCCityNameMr: "",

      //marathi permanent

      aPflatBuildingNoMr: "",
      aPbuildingNameMr: "",
      aProadNameMr: "",
      aPLandmarkMr: "",
      aPCityNameMr: "",

      //marathi board

      marriageBoardNameMr: "",
      bflatBuildingNoMr: "",
      bbuildingNameMr: "",
      broadNameMr: "",
      blandmarkMr: "",
      cityMr: "",
      applicationNumber: "",
      boardOrganizationPhotoMod: "",
    },
  });
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;
  const user = useSelector((state) => state?.user.user);
  const [flagSearch, setFlagSearch] = useState(false);
  const [temp, setTemp] = useState();
  const [temp1, setTemp1] = useState();
  const [tempData, setTempData] = useState();
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const [zoneKeys, setZoneKeys] = useState([]);
  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setPageMode(null);
      console.log("enabled", router.query.pageMode);
    } else {
      setPageMode(router.query.pageMode);
      console.log("disabled", router.query.pageMode);
    }
  }, []);

  // const validateSearch = () => {
  //   if (watch('mBoardRegName') === '' || watch('mBoardRegName') === undefined) {
  //     return true
  //   }
  // }

  useEffect(() => {
    console.log("54354", getValues("mRegNo"));
  }, [flagSearch]);

  const getById = (id) => {
    axios
      .get(`${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${id}`)
      .then((r) => {
        console.log("r.data", r.data);

        let oldAppId = r.data.trnApplicantId;

        console.log(oldAppId, "oldAppId");

        let certificateIssueDateTime;

        axios
          .get(`${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${oldAppId}`)
          .then((re) => {
            certificateIssueDateTime = re.data.certificateIssueDateTime;
            setValue("registrationDate", re.data.registrationDate);
            setValue("registrationNumber", re.data.registrationNumber);
            console.log("re.data", re.data);
          });

        reset(r.data);

        setValue("registrationDate", certificateIssueDateTime);

        setFlagSearch(true);
      });
  };

  useEffect(() => {
    console.log("router?.query?.pageMode", router?.query?.pageMode);
    getById(router?.query?.applicationId);
  }, [router?.query?.pageMode == "View"]);

  const handleSearch = () => {
    let bodyForApi = {
      boardName: watch("mBoardRegName"),
      registrationDate: watch("marriageBoardRegistrationDate"),
      registrationYear:
        watch("marriageBoardRegisterationYear") !== "" ? watch("marriageBoardRegisterationYear") : null,
      registrationNumber: watch("mBoardRegNo"),
    };

    axios
      .post(
        `${urls.MR}/transaction/marriageBoardRegistration/getBySearchParams`,
        bodyForApi,
        // allvalues,
      )
      .then((resp) => {
        if (resp.status == 200) {
          swal("Success!", "Record Searched successfully !", "success");
          setTempData(resp.data);
          reset(resp.data);
          setValue("otitleM", resp.data.otitle);
          setValue("ofNameM", resp.data.ofName);
          setValue("omNameM", resp.data.omName);
          setValue("olNameM", resp.data.olName);

          setValue("otitlemrM", resp.data.otitlemr);
          setValue("ofNameMrM", resp.data.ofNameMr);
          setValue("omNameMrM", resp.data.omNameMr);
          setValue("olNameMrM", resp.data.olNameMr);

          setValue("oflatBuildingNoM", resp.data.oflatBuildingNo);
          setValue("obuildingNameM", resp.data.obuildingName);
          setValue("oroadNameM", resp.data.oroadName);
          setValue("olandmarkM", resp.data.olandmark);
          setValue("ocityNameM", resp.data.ocityName);
          setValue("ostateM", resp.data.ostate);

          setValue("oflatBuildingNoMrM", resp.data.oflatBuildingNoMr);
          setValue("obuildingNameMrM", resp.data.obuildingNameMr);
          setValue("oroadNameMrM", resp.data.oroadNameMr);
          setValue("olandmarkMrM", resp.data.olandmarkMr);
          setValue("ocityNameMrM", resp.data.ocityNameMr);
          setValue("ostateMrM", resp.data.ostateMr);

          //board
          setValue("marriageBoardNameM", resp.data.marriageBoardName);
          setValue("marriageBoardNameMrM", resp.data.marriageBoardNameMr);
          setValue("bflatBuildingNoM", resp.data.bflatBuildingNo);
          setValue("bbuildingNameM", resp.data.bbuildingName);
          setValue("broadNameM", resp.data.broadName);
          setValue("blandmarkM", resp.data.blandmark);
          setValue("cityM", resp.data.city);
          setValue("bpincodeM", resp.data.bpincode);

          setValue("bflatBuildingNoMrM", resp.data.bflatBuildingNoMr);
          setValue("bbuildingNameMrM", resp.data.bbuildingNameMr);
          setValue("broadNameMrM", resp.data.broadNameMr);
          setValue("blandmarkMrM", resp.data.blandmarkMr);
          setValue("cityMrM", resp.data.cityMr);
          setValue("aadhaarNoM", resp.data.aadhaarNo);

          setFlagSearch(true);
        }
      })
      .catch((error) => {
        console.log("133", error);
        swal("Error!", error?.response?.data?.message, "error");
      });
  };

  useEffect(() => {
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "DOCUMENT CHECKLIST" ||
      router.query.pageMode == "DOCUMENT CHECKLIST" ||
      router.query.pageMode == "DOCUMENT CHECKLIST"
    ) {
      // reset(router.query)
      axios
        .get(
          `${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${router?.query?.id}`,
        )
        .then((resp) => {
          console.log("setFlag", resp.data);
          setFlagSearch(true);
          setValue("otitleM", resp.data.otitle);
          setValue("ofNameM", resp.data.ofName);
          setValue("omNameM", resp.data.omName);
          setValue("olNameM", resp.data.olName);

          setValue("otitlemrM", resp.data.otitlemr);
          setValue("ofNameMrM", resp.data.ofNameMr);
          setValue("omNameMrM", resp.data.omNameMr);
          setValue("olNameMrM", resp.data.olNameMr);

          setValue("oflatBuildingNoM", resp.data.oflatBuildingNo);
          setValue("obuildingNameM", resp.data.obuildingName);
          setValue("oroadNameM", resp.data.oroadName);
          setValue("olandmarkM", resp.data.olandmark);
          setValue("ocityNameM", resp.data.ocityName);
          setValue("ostateM", resp.data.ostate);

          setValue("oflatBuildingNoMrM", resp.data.oflatBuildingNoMr);
          setValue("obuildingNameMrM", resp.data.obuildingNameMr);
          setValue("oroadNameMrM", resp.data.oroadNameMr);
          setValue("olandmarkMrM", resp.data.olandmarkMr);
          setValue("ocityNameMrM", resp.data.ocityNameMr);
          setValue("ostateMrM", resp.data.ostateMr);

          //board
          setValue("marriageBoardNameM", resp.data.marriageBoardName);
          setValue("marriageBoardNameMrM", resp.data.marriageBoardNameMr);
          setValue("bflatBuildingNoM", resp.data.bflatBuildingNo);
          setValue("bbuildingNameM", resp.data.bbuildingName);
          setValue("broadNameM", resp.data.broadName);
          setValue("blandmarkM", resp.data.blandmark);
          setValue("cityM", resp.data.city);
          setValue("bpincodeM", resp.data.bpincode);

          setValue("bflatBuildingNoMrM", resp.data.bflatBuildingNoMr);
          setValue("bbuildingNameMrM", resp.data.bbuildingNameMr);
          setValue("broadNameMrM", resp.data.broadNameMr);
          setValue("blandmarkMrM", resp.data.blandmarkMr);
          setValue("cityMrM", resp.data.cityMr);
          setValue("aadhaarNoM", resp.data.aadhaarNo);
          axios
            .get(
              `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${resp.data.trnApplicantId}`,
            )
            .then((rrr) => {
              reset(rrr.data);
            });
        });
    }
  }, []);

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
    axios
      .get(
        `${
          urls.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${temp1}`,
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

  const [atitles, setatitles] = useState([]);

  const getTitles = async () => {
    await axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
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
    await axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitleMrs(
        r.data.title.map((row) => ({
          id: row.id,
          atitlemr: row.titleMr,
        })),
      );
    });
  };
  useEffect(() => {
    if (temp1) getWardKeys();
  }, [temp1]);
  useEffect(() => {
    if (router.query.pageMode != "Add") setTemp1(getValues("zoneKey"));
  }, [getValues("zoneKey")]);

  useEffect(() => {
    getZoneKeys();
    getWardKeys();
    getTitleMr();
    getTitles();
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

  useEffect(() => {
    let ID;
    axios
      .get(`${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${152}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((resp) => {
        console.log("Modify123", resp.data);
        reset(resp.data);
        setValue("otitleM", resp.data.otitle);
        setValue("ofNameM", resp.data.ofName);
        setValue("omNameM", resp.data.omName);
        setValue("olNameM", resp.data.olName);

        setValue("otitlemrM", resp.data.otitlemr);
        setValue("ofNameMrM", resp.data.ofNameMr);
        setValue("omNameMrM", resp.data.omNameMr);
        setValue("olNameMrM", resp.data.olNameMr);

        setValue("oflatBuildingNoM", resp.data.oflatBuildingNo);
        setValue("obuildingNameM", resp.data.obuildingName);
        setValue("oroadNameM", resp.data.oroadName);
        setValue("olandmarkM", resp.data.olandmark);
        setValue("ocityNameM", resp.data.ocityName);
        setValue("ostateM", resp.data.ostate);

        setValue("oflatBuildingNoMrM", resp.data.oflatBuildingNoMr);
        setValue("obuildingNameMrM", resp.data.obuildingNameMr);
        setValue("oroadNameMrM", resp.data.oroadNameMr);
        setValue("olandmarkMrM", resp.data.olandmarkMr);
        setValue("ocityNameMrM", resp.data.ocityNameMr);
        setValue("ostateMrM", resp.data.ostateMr);

        //board
        setValue("marriageBoardNameM", resp.data.marriageBoardName);
        setValue("marriageBoardNameMrM", resp.data.marriageBoardNameMr);
        setValue("bflatBuildingNoM", resp.data.bflatBuildingNo);
        setValue("bbuildingNameM", resp.data.bbuildingName);
        setValue("broadNameM", resp.data.broadName);
        setValue("blandmarkM", resp.data.blandmark);
        setValue("cityM", resp.data.city);
        setValue("bpincodeM", resp.data.bpincode);

        setValue("bflatBuildingNoMrM", resp.data.bflatBuildingNoMr);
        setValue("bbuildingNameMrM", resp.data.bbuildingNameMr);
        setValue("broadNameMrM", resp.data.broadNameMr);
        setValue("blandmarkMrM", resp.data.blandmarkMr);
        setValue("cityMrM", resp.data.cityMr);
        setValue("aadhaarNoM", resp.data.aadhaarNo);

        setTemp(true);
      });
  }, []);

  //save

  const handleApply = () => {
    const finalBody = {
      applicationFrom: "online",
      pageMode: null,
      createdUserId: user.id,
      zoneKey: watch("zoneKey"),
      wardKey: watch("wardKey"),
      atitle: watch("atitle"),
      afName: watch("afName"),
      afNameMr: watch("afNameMr"),
      amName: watch("amName"),
      atitleMr: watch("atitleMr"),
      amNameMr: watch("amNameMr"),
      alName: watch("alName"),
      alNameMr: watch("alNameMr"),
      aemail: watch("aemail"),
      amobileNo: watch("amobileNo"),
      aflatBuildingNo: watch("aflatBuildingNo"),
      abuildingName: watch("abuildingName"),
      aroadName: watch("aroadName"),
      alandmark: watch("alandmark"),
      acityName: watch("acityName"),
      astate: watch("astate"),
      apincode: watch("apincode"),
      aflatBuildingNoMr: watch("aflatBuildingNoMr"),
      abuildingNameMr: watch("abuildingNameMr"),
      aroadNameMr: watch("aroadNameMr"),
      alandmarkMr: watch("alandmarkMr"),
      acityNameMr: watch("acityNameMr"),
      astateMr: watch("astateMr"),

      otitle: watch("otitleM"),
      ofName: watch("ofNameM"),
      omName: watch("omNameM"),
      olName: watch("olNameM"),

      otitlemr: watch("otitlemrM"),
      ofNameMr: watch("ofNameMrM"),
      omNameMr: watch("omNameMrM"),
      olNameMr: watch("olNameMrM"),

      oflatBuildingNo: watch("oflatBuildingNoM"),
      obuildingName: watch("obuildingNameM"),
      oroadName: watch("oroadNameM"),
      olandmark: watch("olandmarkM"),
      ocityName: watch("ocityNameM"),
      ostate: watch("ostateM"),

      oflatBuildingNoMr: watch("oflatBuildingNoMrM"),
      obuildingNameMr: watch("obuildingNameMrM"),
      oroadNameMr: watch("oroadNameMrM"),
      olandmarkMr: watch("olandmarkMrM"),
      ocityNameMr: watch("ocityNameMrM"),
      ostateMr: watch("ostateMrM"),

      //board

      marriageBoardName: watch("marriageBoardNameM"),
      marriageBoardNameMr: watch("marriageBoardNameMrM"),
      bflatBuildingNo: watch("bflatBuildingNoM"),
      bbuildingName: watch("bbuildingNameM"),
      broadName: watch("broadNameM"),
      blandmark: watch("blandmarkM"),
      city: watch("cityM"),
      bpincode: watch("bpincodeM"),

      bflatBuildingNoMr: watch("bflatBuildingNoMrM"),
      bbuildingNameMr: watch("bbuildingNameMrM"),
      broadNameMr: watch("broadNameMrM"),
      blandmarkMr: watch("blandmarkMrM"),
      cityMr: watch("cityMrM"),
      aadhaarNo: watch("aadhaarNoM"),

      // boardOrganizationPhotoMod: temp.boardOrganizationPhotoMod,
      // otherDoc: temp.otherDoc,
      // otherDoc: temp.otherDoc,
      serviceId: 15,
      trnApplicantId: getValues("id"),
      boardOrganizationPhotoMod: watch("boardOrganizationPhotoMod"),
      residentialProofMod: watch("residentialProofMod"),
      identityProofMod: watch("identityProofMod"),
      // boardOrganizationPhotoMod: tempData.boardOrganizationPhotoMod,
      // residentialProofMod: tempData.residentialProofMod,
      // identityProofMod: tempData.identityProofMod,
    };

    axios
      .post(`${urls.MR}/transaction/modOfMarBoardCertificate/saveModOfMarBoardCertificate`, finalBody)
      .then((res) => {
        console.log("res321", res);
        if (res.status == 200 || res.status == 201) {
          swal("Applied!", "Application Applied Successfully !", "success");
          router.push({
            pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
            query: {
              userId: user.id,
              serviceId: 15,
              id: res?.data?.message?.split("$")[1],
            },
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
        swal("Submitted!", "Something problem with the search !", "error");
      });
  };
  return (
    <div>
      {!props.preview && !props.onlyDoc && (
        <>
          <Paper
            sx={{
              marginLeft: 5,
              marginRight: 2,
              marginTop: 5,
              marginBottom: 2,
              padding: 1,
              border: 1,
              borderColor: "grey.500",
            }}
          >
            <>
              <div className={styles.details}>
                <div className={styles.h1Tag}>
                  <h3
                    style={{
                      color: "white",
                      marginTop: "7px",
                    }}
                  >
                    {<FormattedLabel id="onlyMMBR" />}
                  </h3>
                </div>
              </div>

              {/* filter */}
              {router?.query?.pageMode == "View" ? (
                <>
                  <div className={styles.row}>
                    {/* <div className={styles.row}> */}
                    <TextField
                      //  disabled
                      sx={{ width: 300 }}
                      id="standard-basic"
                      disabled={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // defaultValue={"abc"}
                      label={<FormattedLabel id="registrationNumber" required />}
                      variant="standard"
                      {...register("registrationNumber")}
                    />
                    {/* </div> */}
                    {/* <div className={styles.row}> */}
                    <FormControl sx={{ marginTop: 0 }}>
                      <Controller
                        control={control}
                        name="registrationDate"
                        defaultValue={null}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled={true}
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 14 }}>
                                  {<FormattedLabel id="registrationDate" required />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
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
                    </FormControl>
                  </div>
                </>
              ) : (
                <>
                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#278bff",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#278bff"
                    >
                      <Typography> 1) Marriage Board Reg Number *</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="registerationNo" required />}
                            variant="standard"
                            {...register("mBoardRegNo")}
                          />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#278bff",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#278bff"
                      // sx={{
                      //   backgroundColor: '0070f3',
                      // }}
                    >
                      <Typography>
                        {" "}
                        2) Marriage Board Reg Name * ,Marriage Board Registration Date *
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mbrName" required />}
                            // label={"Marriage Board Reg Name"}
                            variant="standard"
                            {...register("mBoardRegName")}
                            // error={!!errors.aFName}
                            // helperText={errors?.aFName ? errors.aFName.message : null}
                          />
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          <FormControl sx={{ marginTop: 0 }}>
                            <Controller
                              control={control}
                              name="marriageBoardRegistrationDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 14 }}>
                                        {<FormattedLabel id="mbrDate" required />}
                                        {/* Marriage Board Reg Date */}
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
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
                          </FormControl>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#278bff",
                        color: "white",
                        textTransform: "capitalize",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#278bff"
                    >
                      <Typography> 3) Marriage Board Reg Name * , Marriage Board Reg Year * </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mbrName" required />}
                            variant="standard"
                            {...register("mBoardRegName")}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mbrYear" required />}
                            variant="standard"
                            {...register("marriageBoardRegisterationYear")}
                          />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <div className={styles.row}>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleSearch();
                        }}
                      >
                        {<FormattedLabel id="search" />}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          </Paper>
        </>
      )}

      {flagSearch ? (
        <FormProvider {...methods}>
          <ThemeProvider theme={theme}>
            <Paper
              sx={{
                marginLeft: 5,
                marginRight: 2,
                marginTop: 2,
                marginBottom: 5,
                padding: 1,
                border: 1,
                borderColor: "grey.500",
              }}
            >
              {!props.onlyDoc && (
                <>
                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>
                        {" "}
                        <FormattedLabel id="ApplicatDetails" />
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <div className={styles.wardZone}>
                        <div>
                          <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.zoneKey}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="zone" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled={true}
                                  //sx={{ width: 230 }}
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
                                  // disabled={true}
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

                      <div className={styles.row}>
                        <div>
                          <FormControl variant="standard" error={!!errors.atitle} sx={{ marginTop: 2 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="title1" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled={true}
                                  // disabled
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
                            // disabled={true}
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
                            // disabled={true}
                            //  disabled
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
                            // disabled={true}
                            // disabled
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
                                  // disabled={true}
                                  // disabled
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
                            // disabled={true}
                            //  disabled
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
                            // disabled={true}
                            //  disabled
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
                            // disabled={true}
                            // disabled
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
                            // disabled={true}
                            //  disabled

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
                            // disabled={true}
                            //  disabled

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
                            // disabled={true}
                            //  disabled

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
                            // disabled={true}
                            //  disabled

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
                            //  disabled
                            // disabled={true}
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
                            // disabled={true}
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
                            // disabled={true}
                            //  disabled
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
                            // disabled={true}
                            //  disabled
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
                            // disabled={true}
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
                            // disabled={true}
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
                            // disabled={true}
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
                            // disabled={true}
                            //  disabled
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
                            // disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // value={pageType ? router.query.mobile : ''}
                            //
                            {...register("amobileNo")}
                            error={!!errors.amobileNo}
                            helperText={errors?.amobileNo ? errors.amobileNo.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            // disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            //  value={pageType ? router.query.emailAddress : ''}
                            //
                            {...register("aemail")}
                            error={!!errors.aemail}
                            helperText={errors?.aemail ? errors.aemail.message : null}
                          />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>
                        {" "}
                        <FormattedLabel id="OwnerDetails" />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
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
                                  disabled={true}
                                  // disabled
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
                              defaultValue="Mr"
                            />
                            <FormHelperText>{errors?.otitle ? errors.otitle.message : null}</FormHelperText>
                          </FormControl>
                        </div>

                        <div>
                          <TextField
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled
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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            // disabled
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

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <FormControl variant="standard" error={!!errors.otitleM} sx={{ marginTop: 2 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="title1" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
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
                              name="otitleM"
                              control={control}
                              defaultValue="Mr"
                            />
                            <FormHelperText>{errors?.otitleM ? errors.otitleM.message : null}</FormHelperText>
                          </FormControl>
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="firstName" required />}
                            // label="First Name *"
                            variant="standard"
                            {...register("ofNameM")}
                            error={!!errors.ofNameM}
                            helperText={errors?.ofNameM ? errors.ofNameM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Middle Name *"
                            label={<FormattedLabel id="middleName" required />}
                            variant="standard"
                            {...register("omNameM")}
                            error={!!errors.omNameM}
                            helperText={errors?.omNameM ? errors.omNameM.message : null}
                          />
                        </div>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            // disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="Last Name *"
                            label={<FormattedLabel id="lastName" required />}
                            variant="standard"
                            {...register("olNameM")}
                            error={!!errors.olNameM}
                            helperText={errors?.olNameM ? errors.olNameM.message : null}
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
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
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
                                  disabled={true}
                                  // disabled
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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled
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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled
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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            // disabled
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
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <FormControl variant="standard" error={!!errors.otitlemrM} sx={{ marginTop: 2 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="titlemr" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled
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
                              name="otitlemrM"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.otitlemrM ? errors.otitlemrM.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            // label="प्रथम नावं *"
                            label={<FormattedLabel id="firstNamemr" required />}
                            // label=" Hello"
                            variant="standard"
                            {...register("ofNameMrM")}
                            error={!!errors.ofNameMrM}
                            helperText={errors?.ofNameMrM ? errors.ofNameMrM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Middle Name *"
                            label={<FormattedLabel id="middleNamemr" required />}
                            // label="मधले नावं *"
                            variant="standard"
                            {...register("omNameMrM")}
                            error={!!errors.omNameMrM}
                            helperText={errors?.omNameMrM ? errors.omNameMrM.message : null}
                          />
                        </div>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            // disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            //label="Last Name *"
                            label={<FormattedLabel id="lastNamemr" required />}
                            // label="आडनाव *"
                            variant="standard"
                            {...register("olNameMrM")}
                            error={!!errors.olNameMrM}
                            helperText={errors?.olNameMrM ? errors.olNameMrM.message : null}
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
                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="flatBuildingNo" required />}
                            variant="standard"
                            //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                            //  value={pflatBuildingNo}
                            // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                            {...register("oflatBuildingNoM")}
                            error={!!errors.oflatBuildingNoM}
                            helperText={errors?.oflatBuildingNoM ? errors.oflatBuildingNoM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingName" required />}
                            variant="standard"
                            {...register("obuildingNameM")}
                            error={!!errors.obuildingNameM}
                            helperText={errors?.obuildingNameM ? errors.obuildingNameM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            {...register("oroadNameM")}
                            error={!!errors.oroadNameM}
                            helperText={errors?.oroadNameM ? errors.oroadNameM.message : null}
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
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div>
                          <TextField
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            {...register("olandmarkM")}
                            error={!!errors.olandmarkM}
                            helperText={errors?.olandmarkM ? errors.olandmarkM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            {...register("ocityNameM")}
                            error={!!errors.ocityNameM}
                            helperText={errors?.ocityNameM ? errors.ocityNameM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="State" required />}
                            variant="standard"
                            {...register("ostateM")}
                            error={!!errors.ostateM}
                            helperText={errors?.ostateM ? errors.ostateM.message : null}
                          />
                        </div>
                      </div>

                      {/* marathi Adress */}
                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="flatBuildingNomr" required />}
                            // label="फ्लॅट नंबर"
                            variant="standard"
                            //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                            //  value={pflatBuildingNo}
                            // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                            {...register("oflatBuildingNoMrM")}
                            error={!!errors.oflatBuildingNoMrM}
                            helperText={errors?.oflatBuildingNoMrM ? errors.oflatBuildingNoMrM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingNamemr" required />}
                            // label="अपार्टमेंट नाव"
                            variant="standard"
                            {...register("obuildingNameMrM")}
                            error={!!errors.obuildingNameMrM}
                            helperText={errors?.obuildingNameMrM ? errors.obuildingNameMrM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            {...register("oroadNameMrM")}
                            error={!!errors.oroadNameMrM}
                            helperText={errors?.oroadNameMrM ? errors.oroadNameMrM.message : null}
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
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row3}>
                        <div>
                          <TextField
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

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
                            disabled={true}
                            InputLabelProps={{
                              shrink: temp,
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

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row3}>
                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            {...register("olandmarkMrM")}
                            error={!!errors.olandmarkMrM}
                            helperText={errors?.olandmarkMrM ? errors.olandmarkMrM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            //  disabled

                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            {...register("ocityNameMrM")}
                            error={!!errors.ocityNameMrM}
                            helperText={errors?.ocityNameMrM ? errors.ocityNameMrM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            InputLabelProps={{
                              shrink: temp,
                            }}
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="statemr" required />}
                            variant="standard"
                            {...register("ostateMrM")}
                            error={!!errors.ostateMrM}
                            helperText={errors?.ostateMrM ? errors.ostateMrM.message : null}
                          />
                        </div>
                      </div>

                      {/* <div className={styles.row}>
                    <div>
                      <TextField
                        disabled={true}
                        InputLabelProps={{
                          shrink: temp,
                        }}
                        //  disabled

                        sx={{ width: 250 }}
                        id="standard-basic"
                        label={<FormattedLabel id="pincode" required />}
                        variant="standard"
                        {...register('opincode')}
                        error={!!errors.opincode}
                        helperText={
                          errors?.opincode ? errors.opincode.message : null
                        }
                      />
                    </div>
                    <div>
                      <TextField
                        disabled={true}
                        InputLabelProps={{
                          shrink: temp,
                        }}
                        sx={{ width: 250 }}
                        id="standard-basic"
                        label={<FormattedLabel id="mobileNo" required />}
                        variant="standard"
                        // value={pageType ? router.query.mobile : ''}
                        //
                        {...register('omobileNo')}
                        error={!!errors.omobileNo}
                        helperText={
                          errors?.omobileNo ? errors.omobileNo.message : null
                        }
                      />
                    </div>

                    <div>
                      <TextField
                        disabled={true}
                        InputLabelProps={{
                          shrink: temp,
                        }}
                        sx={{ width: 250 }}
                        id="standard-basic"
                        label={<FormattedLabel id="email" required />}
                        variant="standard"
                        //  value={pageType ? router.query.emailAddress : ''}
                        //
                        {...register('oemail')}
                        error={!!errors.oemail}
                        helperText={
                          errors?.oemail ? errors.oemail.message : null
                        }
                      />
                    </div>
                  </div> */}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>
                        {" "}
                        <FormattedLabel id="boardDetail" />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row2}>
                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardName" required />}
                            variant="standard"
                            {...register("marriageBoardName")}
                            error={!!errors.marriageBoardName}
                            helperText={errors?.marriageBoardName ? errors.marriageBoardName.message : null}
                          />
                        </div>
                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardNamemr" required />}
                            // label="विवाह मंडळचे नाव "
                            variant="standard"
                            // value={pageType ? router.query.marriageBoardName : ''}

                            {...register("marriageBoardNameMr")}
                            error={!!errors.marriageBoardNameMr}
                            helperText={
                              errors?.marriageBoardNameMr ? errors.marriageBoardNameMr.message : null
                            }
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
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row2}>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardName" required />}
                            variant="standard"
                            {...register("marriageBoardNameM")}
                            error={!!errors.marriageBoardNameM}
                            helperText={errors?.marriageBoardNameM ? errors.marriageBoardNameM.message : null}
                          />
                        </div>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="boardNamemr" required />}
                            // label="विवाह मंडळचे नाव "
                            variant="standard"
                            // value={pageType ? router.query.marriageBoardName : ''}

                            {...register("marriageBoardNameMrM")}
                            error={!!errors.marriageBoardNameMrM}
                            helperText={
                              errors?.marriageBoardNameMrM ? errors.marriageBoardNameMrM.message : null
                            }
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
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="flatBuildingNo" required />}
                            variant="standard"
                            //value={pageType ? router.query.flatBuildingNo : ''}

                            {...register("bflatBuildingNo")}
                            error={!!errors.bflatBuildingNo}
                            helperText={errors?.bflatBuildingNo ? errors.bflatBuildingNo.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingName" required />}
                            variant="standard"
                            // value={pageType ? router.query.buildingName : ''}

                            {...register("bbuildingName")}
                            error={!!errors.bbuildingName}
                            helperText={errors?.bbuildingName ? errors.bbuildingName.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            disabled={true}
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

                      <div className={styles.details}>
                        <div className={styles.h1Tag}>
                          <h3
                            style={{
                              color: "white",
                              marginTop: "7px",
                            }}
                          >
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="flatBuildingNo" required />}
                            variant="standard"
                            //value={pageType ? router.query.flatBuildingNo : ''}

                            {...register("bflatBuildingNoM")}
                            error={!!errors.bflatBuildingNoM}
                            helperText={errors?.bflatBuildingNoM ? errors.bflatBuildingNoM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingName" required />}
                            variant="standard"
                            // value={pageType ? router.query.buildingName : ''}

                            {...register("bbuildingNameM")}
                            error={!!errors.bbuildingNameM}
                            helperText={errors?.bbuildingNameM ? errors.bbuildingNameM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" required />}
                            variant="standard"
                            // value={pageType ? router.query.roadName : ''}

                            {...register("broadNameM")}
                            error={!!errors.broadNameM}
                            helperText={errors?.broadNameM ? errors.broadNameM.message : null}
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
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            // value={pageType ? router.query.landmark : ''}

                            {...register("blandmark")}
                            error={!!errors.blandmark}
                            helperText={errors?.blandmark ? errors.blandmark.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            //   value={pageType ? router.query.city : ''}

                            {...register("city")}
                            error={!!errors.city}
                            helperText={errors?.city ? errors.city.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="pincode" required />}
                            variant="standard"
                            //  value={pageType ? router.query.pincode : ''}

                            {...register("bpincode")}
                            error={!!errors.bpincode}
                            helperText={errors?.bpincode ? errors.bpincode.message : null}
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
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmark" required />}
                            variant="standard"
                            // value={pageType ? router.query.landmark : ''}

                            {...register("blandmarkM")}
                            error={!!errors.blandmarkM}
                            helperText={errors?.blandmarkM ? errors.blandmarkM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityName" required />}
                            variant="standard"
                            //   value={pageType ? router.query.city : ''}

                            {...register("cityM")}
                            error={!!errors.cityM}
                            helperText={errors?.cityM ? errors.cityM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="pincode" required />}
                            variant="standard"
                            //  value={pageType ? router.query.pincode : ''}

                            {...register("bpincodeM")}
                            error={!!errors.bpincodeM}
                            helperText={errors?.bpincodeM ? errors.bpincodeM.message : null}
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
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="flatBuildingNomr" required />}
                            // label="फ्लॅट नंबर"
                            variant="standard"
                            //value={pageType ? router.query.flatBuildingNo : ''}

                            {...register("bflatBuildingNoMr")}
                            error={!!errors.bflatBuildingNoMr}
                            helperText={errors?.bflatBuildingNoMr ? errors.bflatBuildingNoMr.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingNamemr" required />}
                            // label="अपार्टमेंट नाव"
                            variant="standard"
                            // value={pageType ? router.query.buildingName : ''}

                            {...register("bbuildingNameMr")}
                            error={!!errors.bbuildingNameMr}
                            helperText={errors?.bbuildingNameMr ? errors.bbuildingNameMr.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            // value={pageType ? router.query.roadName : ''}

                            {...register("broadNameMr")}
                            error={!!errors.broadNameMr}
                            helperText={errors?.broadNameMr ? errors.broadNameMr.message : null}
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
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="flatBuildingNomr" required />}
                            variant="standard"
                            {...register("bflatBuildingNoMrM")}
                            error={!!errors.bflatBuildingNoMrM}
                            helperText={errors?.bflatBuildingNoMrM ? errors.bflatBuildingNoMrM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingNamemr" required />}
                            // label="अपार्टमेंट नाव"
                            variant="standard"
                            // value={pageType ? router.query.buildingName : ''}

                            {...register("bbuildingNameMrM")}
                            error={!!errors.bbuildingNameMrM}
                            helperText={errors?.bbuildingNameMrM ? errors.bbuildingNameMrM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadNamemr" required />}
                            // label="गल्लीचे नाव"
                            variant="standard"
                            // value={pageType ? router.query.roadName : ''}

                            {...register("broadNameMrM")}
                            error={!!errors.broadNameMrM}
                            helperText={errors?.broadNameMrM ? errors.broadNameMrM.message : null}
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
                            <FormattedLabel id="oldLabel" />
                            {/* Old Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            // value={pageType ? router.query.landmark : ''}

                            {...register("blandmarkMr")}
                            error={!!errors.blandmarkMr}
                            helperText={errors?.blandmarkMr ? errors.blandmarkMr.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            //   value={pageType ? router.query.city : ''}

                            {...register("cityMr")}
                            error={!!errors.cityMr}
                            helperText={errors?.cityMr ? errors.cityMr.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="AadharNo" required />}
                            variant="standard"
                            // value={pageType ? router.query.aadhaarNo : ''}

                            {...register("aadhaarNo")}
                            error={!!errors.aadhaarNo}
                            helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
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
                            <FormattedLabel id="newLabel" />
                            {/* New Values*/}
                          </h3>
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="Landmarkmr" required />}
                            // label="जमीन चिन्ह"
                            variant="standard"
                            // value={pageType ? router.query.landmark : ''}

                            {...register("blandmarkMrM")}
                            error={!!errors.blandmarkMrM}
                            helperText={errors?.blandmarkMrM ? errors.blandmarkMrM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="cityNamemr" required />}
                            // label="शहराचे नाव"
                            variant="standard"
                            //   value={pageType ? router.query.city : ''}

                            {...register("cityMrM")}
                            error={!!errors.cityMrM}
                            helperText={errors?.cityMrM ? errors.cityMrM.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="AadharNo" required />}
                            variant="standard"
                            // value={pageType ? router.query.aadhaarNo : ''}

                            {...register("aadhaarNoM")}
                            error={!!errors.aadhaarNoM}
                            helperText={errors?.aadhaarNoM ? errors.aadhaarNoM.message : null}
                          />
                        </div>
                      </div>

                      <div className={styles.row}>
                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mobileNo" required />}
                            variant="standard"
                            // value={pageType ? router.query.mobile : ''}

                            {...register("mobile")}
                            error={!!errors.mobile}
                            helperText={errors?.mobile ? errors.mobile.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            disabled={true}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label={<FormattedLabel id="email" required />}
                            variant="standard"
                            //  value={pageType ? router.query.emailAddress : ''}

                            {...register("emailAddress")}
                            error={!!errors.emailAddress}
                            helperText={errors?.emailAddress ? errors.emailAddress.message : null}
                          />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
              {!props.preview && (
                <>
                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        textTransform: "uppercase",
                        border: "1px solid white",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#0070f3"
                    >
                      <Typography>
                        {" "}
                        <FormattedLabel id="documentsUpload" />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.row}>
                        <div style={{ marginTop: "20px" }}>
                          <Typography>Board / Organization </Typography>
                          <Typography>PhotoCopy </Typography>

                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("boardOrganizationPhotoMod")}
                            fileKey={"boardOrganizationPhotoMod"}
                            showDel={pageMode ? false : true}

                            // showDel={true}
                          />
                        </div>

                        <div style={{ marginTop: "20px" }}>
                          <Typography>Residential proof </Typography>
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("residentialProofMod")}
                            fileKey={"residentialProofMod"}
                            showDel={pageMode ? false : true}

                            // showDel={true}
                          />
                        </div>

                        <div style={{ marginTop: "20px" }}>
                          <Typography>Identity proof </Typography>
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("identityProofMod")}
                            fileKey={"identityProofMod"}
                            showDel={pageMode ? false : true}

                            // showDel={true}
                          />
                        </div>
                      </div>
                    </AccordionDetails>{" "}
                  </Accordion>
                </>
              )}
              {!props.preview && !props.onlyDoc && (
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
                                  `/marriageRegistration/transactions/modificationInMarriageBoardRegisteration`,
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
                                router.push(`/dashboard`);
                              } else {
                                // swal("Record is Safe");
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
              )}
            </Paper>
          </ThemeProvider>
        </FormProvider>
      ) : (
        ""
      )}
    </div>
  );
};

export default Index;
