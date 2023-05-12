import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper, ThemeProvider,
  Select,
  TextField,
} from "@mui/material";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import UploadButton from "../../singleFileUploadButton/UploadButton";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import trnNewApplicationSchema from "../../../../containers/schema/BsupNagarvasthiSchema/trnNewApplicationSchema.js"

const BachatGatCategorySchemes = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(trnNewApplicationSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [religionNames, setReligionNames] = useState([]);
  const [castNames, setCastNames] = useState([]);
  const [dependency, setDependency] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [selectedBank, setSelectedBank] = useState([]);
  const [branch, setBranch] = useState([]);
  const [textFArea, setTextFArea] = useState([]);
  const [docUpload, setDocUpload] = useState([]);
  const [docUpload1, setDocUpload1] = useState([]);

  const [dropDown, setDropDown] = useState([]);
  const [genderDetails, setGenderDetails] = useState([])
  const [divyangNames, setDivyangNames] = useState([]);
  const [areaId, setAreaId] = useState([]);
  const [areaNm, setAreaNm] = useState(null)
  const [subSchemePrefix, setSubSchemePrefix] = useState()
  //get logged in user
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  let userCitizen = useSelector((state) => {
    return state?.user?.user
  });
  const [mainSchemePrefix, setMainPrefix] = useState(null)
  const [zonePref, setZonePrefix] = useState(null)
  const language = useSelector((state) => state.labels.language);


  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
    getGenders()
    getReligionDetails()
    getBankMasters();
    setDocUpload1([{
      id: 1,
      title: "Passbook Front Page",
      documentPath: "",
    },
    {
      id: 2,
      title: "Passbook Back Page",
      documentPath: "",
    }]);

  }, []);

  useEffect(() => {
    if(watch("religionKey")){
      getCastFromReligion()

    }
  }, [watch("religionKey")])

  useEffect(() => {
    if (loggedUser === "citizenUser") {
      setValue("applicantFirstName", language == "en" ? userCitizen?.firstName : userCitizen?.firstNamemr)
      setValue("applicantMiddleName", language == "en" ? userCitizen?.middleName : userCitizen?.middleNamemr)
      setValue("applicantLastName", language == "en" ? userCitizen?.surname : userCitizen?.surnamemr)
      setValue("emailId", userCitizen?.emailID)
      setValue("pinCode", userCitizen?.ppincode)
      setValue("mobileNo", userCitizen?.mobile)
      setValue("gender", userCitizen?.gender)
      setValue("flatBuldingNo", language == "en" ? userCitizen?.pflatBuildingNo : userCitizen?.cflatBuildingNoMr)
      setValue("buildingName", language == "en" ? userCitizen?.pbuildingName : userCitizen?.cbuildingNameMr)
      setValue("roadName", language == "en" ? userCitizen?.croadName : userCitizen.croadNameMr)
      setValue("landmark", language == "en" ? userCitizen?.clandmark : userCitizen?.clandmarkMr)
      setValue("dateOfBirth", userCitizen?.dateOfBirth)
    }
  }, [userCitizen])

  useEffect(() => {
    setZonePrefix(zoneNames && zoneNames.find((r) => {
      return r.id == watch("zoneKey");
    })?.zonePrefix)
    setValue("benecode", zoneNames && zoneNames.find((r) => {
      return r.id == watch("zoneKey");
    })?.zonePrefix)
  }, [watch("zoneKey")])

  useEffect(() => {
    getMainScheme();
  }, []);


  useEffect(() => {
    setAreaNm(crAreaNames &&
      crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
      ? crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
      : "-")
  }, [watch("areaKey")]);


  useEffect(() => {
    if (areaNm != "-" && areaNm != null) {
      getAreas()
    }
  }, [areaNm])

  const getAreas = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAreaName?moduleId=23&areaName=${watch("areaName")}`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          if (res?.data.length !== 0) {
            setAreaId(
              res?.data?.map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                areaId: r.areaId,
                zoneId: r.zoneId,
                wardId: r.wardId,
                zoneName: r.zoneName,
                zoneNameMr: r.zoneNameMr,
                wardName: r.wardName,
                wardNameMr: r.wardNameMr,
                areaName: r.areaName,
                areaNameMr: r.areaNameMr,
              })),
            );
            setValue("areaName", "");
          } else {
            setValue("zoneKey", "");
            setValue("wardKey", "");
            sweetAlert({
              title: "OOPS!",
              text: "There are no areas match with your search!",
              icon: "warning",
              dangerMode: true,
              closeOnClickOutside: false,
            });
          }
        } else {
          setValue("zoneKey", "");
          setValue("wardKey", "");
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error1) => {
        setValue("zoneKey", "");
        setValue("wardKey", "");
        sweetAlert({
          title: "OOPS!",
          text: `${error1}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        });
      });
  };


  useEffect(() => {
    if (watch("areaKey")) {
      let filteredArrayZone = areaId?.filter((obj) => obj?.areaId === watch("areaKey"));

      let flArray1 = zoneNames?.filter((obj) => {
        return filteredArrayZone?.some((item) => {
          return item?.zoneId === obj?.id;
        });
      });

      let flArray2 = wardNames?.filter((obj) => {
        return filteredArrayZone?.some((item) => {
          return item?.wardId === obj?.id;
        });
      });

      setValue("zoneKey", flArray1[0]?.id);
      setValue("wardKey", flArray2[0]?.id);
    } else {
      setValue("zoneKey", "");
      setValue("wardKey", "");
    }
  }, [watch("areaKey")]);

  // cast from religion
  const getCastFromReligion = () => {
    axios.get(`${urls.SLUMURL}/master/cast/getCastFromReligion?id=${watch("religionKey")}`).then((r) => {
      setCastNames(
        r.data.mCast.map((row) => ({
          id: row.id,
          cast: row.cast,
          castMr:row.castMr
        }))
      )
    })
  };

  //load religion details
  const getReligionDetails = () => {
    axios.get(`${urls.CFCURL}/master/religion/getAll`).then((r) => {
      setReligionNames(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
          religionMr:row.religionMr
        })),
      );
    });
  };

  //  load genders
  const getGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setGenderDetails(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
      );
    });
  };

  // load zone
  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
          zonePrefix: row.zonePrefix
        })),
      );
    });
  };

  // load wards
  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        })),
      );
    });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios.get(`${urls.CfcURLMaster}/area/getAll`).then((r) => {
      setCRAreaName(
        r.data.area.map((row) => ({
          id: row.id,
          crAreaName: row.areaName,
          crAreaNameMr: row.areaNameMr,
        })),
      );
    });
  };

  // load main scheme
  const getMainScheme = () => {
    axios.get(`${urls.BSUPURL}/mstMainSchemes/getAll`).then((r) => {
      setMainNames(
        r.data.mstMainSchemesList.map((row) => ({
          id: row.id,
          schemeName: row.schemeName,
          schemeNameMr: row.schemeNameMr,
          schemePrefix: row.schemePrefix
        })),
      );
    });
  };

  // load main scheme
  const getSubScheme = () => {
    axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAllByMainSchemeKey?mainSchemeKey=${watch("mainSchemeKey")}`)
      .then((r) => {
        setSubSchemeNames(
          r.data.mstSubSchemesList.map((row) => ({
            id: row.id,
            subSchemeName: row.subSchemeName,
            subSchemeNameMr: row.subSchemeNameMr,
          })),
        );
      });
  };

  // when find mainscheme key then set bene code
  useEffect(() => {
    if (watch("mainSchemeKey")) {
      getSubScheme();
      setMainPrefix(mainNames && mainNames.find((r) => {
        return r.id == watch("mainSchemeKey");
      })?.schemePrefix)

      var a = mainNames && mainNames.find((r) => {
        return r.id == watch("mainSchemeKey");
      })?.schemePrefix
      var benecode = zonePref + " " + a
      setValue("benecode", benecode)
    }
  }, [watch("mainSchemeKey")]);

  // when find sub scheme key then set bene code
  useEffect(() => {
    if (watch("subSchemeKey")) {
      setSubSchemePrefix(subSchemeNames && subSchemeNames.find((r) => {
        return r.id == watch("subSchemeKey");
      })?.id)
      setValue("benecode", zonePref + " " + mainSchemePrefix + " " + watch("subSchemeKey"))
    }
  }, [watch("subSchemeKey")]);

  // eligiblity criteria
  const getDependency = () => {
    if (watch("mainSchemeKey") && watch("subSchemeKey")) {
      axios
        .get(
          `${urls.BSUPURL}/mstSchemesConfigData/getAllBySchemeConfigAndSubSchemeKey?schemeConfigKey=${watch(
            "mainSchemeKey",
          )}&subSchemeKey=${watch("subSchemeKey")}`,
        )
        .then((r) => {
          setDependency(
            r?.data?.mstSchemesConfigDataList?.map((row) => ({
              id: row.id,
              informationType: row.informationType,
              informationTitle: row.informationTitle,
              informationTitleMr: row.informationTitleMr,
              schemesConfigKey: row.schemesConfigKey,
              subSchemeKey: row.subSchemeKey,
              infoSelectionData: row.infoSelectionData,
            })),
          );
          setTextFArea(
            r?.data?.mstSchemesConfigDataList
              ?.filter((obj) => obj.informationType === "ft")
              .map((row) => ({
                id: row.id,
                informationType: row.informationType,
                informationTitle: row.informationTitle,
                informationTitleMr: row.informationTitleMr,
                schemesConfigKey: row.schemesConfigKey,
                subSchemeKey: row.subSchemeKey,
              })),
          );
          setDocUpload(
            r?.data?.mstSchemesConfigDataList
              ?.filter((obj) => obj.informationType === "fl")
              .map((row) => ({
                id: row.id,
                informationType: row.informationType,
                informationTitle: row.informationTitle,
                informationTitleMr: row.informationTitleMr,
                schemesConfigKey: row.schemesConfigKey,
                subSchemeKey: row.subSchemeKey,
                documentPath: "",
              })),
          );
          setDropDown(
            r?.data?.mstSchemesConfigDataList
              ?.filter((obj) => obj.informationType === "dd")
              .map((row) => ({
                id: row.id,
                informationType: row.informationType,
                informationTitle: row.informationTitle,
                informationTitleMr: row.informationTitleMr,
                schemesConfigKey: row.schemesConfigKey,
                subSchemeKey: row.subSchemeKey,
                infoSelectionData: row.infoSelectionData,
              })),
          );
        });
    }
  };

  useEffect(() => {
    getDependency();
  }, [watch("mainSchemeKey"), watch("subSchemeKey")]);

  // get bank details
  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(r.data.bank);
    });
  };

  // cancel button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    fromDate: "",
    toDate: "",
    applicationNo: "",
    subSchemeKey: "",
    mainSchemeKey: "",
    flatBuildingNo: "",
    buildingName: "",
    roadName: "",
    buildingName: "",
    roadName: "",
    mobileNo: "",
    emailId: "",
    landmark: "",
    pincode: "",
    geocode: "",
    dateOfBirth: "",
    religionKey: "",
    casteCategory: "",
    bankBranchKey: "",
    savingAccountNo: "",

    saOwnerFirstName: "",
    saOwnerMiddleName: "",
    saOwnerLastName: "",
    disabilityCertificateNo: "",
    disabilityCertificateValidity: "",
    disabilityPercentage: "5",
    disabilityDuration: "",
    schemeRenewalDate: null,
    divyangSchemeTypeKey: null,
    isBenifitedPreviously: "",
    remarks: "",
    applicantFirstName: "",
    applicantMiddleName: "",
    applicantLastName: "",
  };

  // apply new shceme button
  const onSubmitForm = (formData) => {
    const data = docUpload && docUpload.map((obj) => {
      return {
        "schemeApplicationKey": formData.mainSchemeKey,
        "trnType": "SCAP",
        "schemeApplicationNo": "",
        "schemesConfigDocumentsKey": obj.id,
        "documentFlow": "",
        "documentPath": obj.documentPath,
        "fileType": obj.documentPath && obj.documentPath.split(".").pop()
      }
    })
    const dummyDao = dependency && dependency.map((obj, index, arr) => {
      if (obj.informationType == "ft") {
        return {
          "schemeApplicationKey": formData.mainSchemeKey, //main scheme id
          "schemeRenewalKey": 0,
          "trnType": "SCAP",
          "schemesConfigDataKey": obj.id,
          "informationDetails": index != 0 && arr[index - 1].informationType == "dd" ? formData.Answer[index - 1] : formData.Answer[index],
        }
      } else if (obj.informationType == "dd") {
        return {
          "schemeApplicationKey": formData.mainSchemeKey, //main scheme id
          "schemeRenewalKey": 0,
          "trnType": "SCAP",
          "schemesConfigDataKey": obj.id,
          "informationDetails": formData.answerName,
          subSchemeKey: formData.subSchemeKey
        }
      } return null

    })

    const dataDao = dummyDao.filter(element => {
      return element !== null;
    })
    const temp = {
      ...formData,
      bankNameId: selectedBank,
      trnSchemeApplicationDataDaoList: dataDao,
      trnSchemeApplicationDocumentsList: data,
      beneficiaryCode: formData.benecode,
      "passbookFrontPage": docUpload1 && docUpload1.find((obj) =>
        obj.title == "Passbook Front Page")?.documentPath,

      "passbookLastPage": docUpload1 && docUpload1.find((obj) =>
        obj.title == "Passbook Back Page")?.documentPath,

      "frontPageFileType": docUpload1 && docUpload1.find((obj) =>
        obj.title == "Passbook Front Page")?.documentPath.split(".").pop(),
      "lastPageFileType": docUpload1 && docUpload1.find((obj) =>
        obj.title == "Passbook Back Page")?.documentPath.split(".").pop()
    };
    console.log("Temp ", temp)
    if (loggedUser === "citizenUser") {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
          headers: {
            UserId: user.id,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert({
              text: ` Your Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
              icon: "success",
              buttons: ["View Acknowledgement", "Go To Dashboard"],
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                {
                  router.push('/BsupNagarvasthi/transaction/newApplicationScheme/list')
                }
              } else {
                router.push({
                  pathname:
                    "/BsupNagarvasthi/transaction/acknowledgement",
                  query: { id: res.data.message.split('[')[1].split(']')[0], trn: "N" },
                })
              }
            })
          }
        });
    } else {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert({
              text: ` Your Application No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
              icon: "success",
              buttons: ["View Acknowledgement", "Go To Dashboard"],
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                {
                  router.push('/BsupNagarvasthi/transaction/newApplicationScheme/list')
                }
              } else {
                router.push({
                  pathname:
                    "/BsupNagarvasthi/transaction/acknowledgement",
                  query: { id: res.data.message.split('[')[1].split(']')[0], trn: "N" },
                })
              }
            })
          }
        });
    }
  }

  // UI
  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="titleNewApplicationSchemes" />
          </h2>
        </Box>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container style={{ padding: "10px" }}>
            {/* <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl error={errors.areaKey} variant="standard" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="areaNm" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: "90%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                      }

                      }
                      label="Select Auditorium"
                    >
                      {crAreaNames &&
                        crAreaNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {auditorium.crAreaName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="areaKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.areaKey ? errors.areaKey.message : null}</FormHelperText>
              </FormControl>
            </Grid> */}
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
                gap: 15,
              }}
            >
              {areaId.length === 0 ? (
                <>
                  <TextField
                    // autoFocus
                    style={{
                      backgroundColor: "white",
                      width: "300px",
                      // color: "black",
                    }}
                    id="outlined-basic"
                    label={language === "en" ? "Search By Area Name" : "क्षेत्राच्या नावाने शोधा"}
                    placeholder={
                      language === "en"
                        ? "Enter Area Name, Like 'Dehu'"
                        : "'देहू' प्रमाणे क्षेत्राचे नाव प्रविष्ट करा"
                    }
                    variant="standard"
                    {...register("areaName")}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (watch("areaName")) {
                        getAreas();
                      } else {
                        sweetAlert({
                          title: "OOPS!",
                          text: "Please Enter The Area Name first",
                          icon: "warning",
                          dangerMode: true,
                          closeOnClickOutside: false,
                        });
                      }
                    }}
                    size="small"
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    <FormattedLabel id="getDetails" />
                  </Button>
                </>
              ) : (
                <>
                  <FormControl style={{ minWidth: "200px" }} error={!!errors.areaKey}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="results" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          style={{ backgroundColor: "inherit" }}
                          fullWidth
                          variant="standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label="Complaint Type"
                        >
                          {areaId &&
                            areaId?.map((areaId, index) => (
                              <MenuItem key={index} value={areaId.areaId}>
                                {language === "en" ?areaId?.areaName:areaId?.areaNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="areaKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.areaKey ? errors.areaKey.message : null}</FormHelperText>
                  </FormControl>

                  {/* ////////////////// */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setAreaId([]);
                      setValue("areaKey", "");
                    }}
                    size="small"
                  >
                    <FormattedLabel id="searchArea" />
                  </Button>
                </>
              )}
            </Grid>
            {/* Zone Name */}

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl error={errors.zoneKey} variant="standard" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="zoneNames" /></InputLabel>
                <Controller
                  {...register("zoneKey")}
                  render={({ field }) => (

                    <Select
                      disabled={true}
                      sx={{ minWidth: "90%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        console.log(value)
                      }}
                    >
                      {zoneNames &&
                        zoneNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en" ?auditorium.zoneName:auditorium.zoneNameMr}
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
            </Grid>

            {/* Ward name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl variant="standard" sx={{ width: "100%" }} error={!!errors.wardKey}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="wardname" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ minWidth: "90%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Service"
                      watch
                    >
                      {wardNames &&
                        wardNames.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {language === "en" ?service.wardName:service.wardNameMr}
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
            </Grid>


            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl error={errors.mainSchemeKey} variant="standard" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="mainScheme" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: "90%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {mainNames &&
                        mainNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en" ?auditorium.schemeName:auditorium.schemeNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="mainSchemeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.mainSchemeKey ? errors.mainSchemeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Sub Scheme Key */}

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl error={errors.subSchemeKey} variant="standard" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="subScheme" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: "90%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {subSchemeNames &&
                        subSchemeNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en" ?auditorium.subSchemeName:auditorium.subSchemeNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="subSchemeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.subSchemeKey ? errors.subSchemeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Beneficiary Code */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="beneficiaryCode" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: watch("benecode")?true:false }}
                {...register("benecode")}
                error={!!errors.benecode}
                helperText={errors?.benecode ? errors.benecode.message : null}
              />
            </Grid>
          </Grid>

          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2><FormattedLabel id="applicantDetails" /></h2>
          </Box>
          {/* 4th Container */}
          <Grid container sx={{ padding: "10px" }}>
            {/* First Name*/}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
                label={<FormattedLabel id="applicantFirstName" />}
                variant="standard"
                {...register("applicantFirstName")}
                error={!!errors.applicantFirstName}
                helperText={errors?.applicantFirstName ? errors.applicantFirstName.message : null}
              />
            </Grid>

            {/* Middle Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}

                label={<FormattedLabel id="applicantMiddleName" />}
                variant="standard"
                {...register("applicantMiddleName")}
                error={!!errors.applicantMiddleName}
                helperText={errors?.applicantMiddleName ? errors.applicantMiddleName.message : null}
              />
            </Grid>

            {/* Last Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}

                label={<FormattedLabel id="applicantLastName" />}
                variant="standard"
                {...register("applicantLastName")}
                error={!!errors.applicantLastName}
                helperText={errors?.applicantLastName ? errors.applicantLastName.message : null}
              />
            </Grid>

            {/* Gender */}

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                sx={{ minWidth: "90%", }}
                variant="standard"
                error={!!errors.gender}
              // disabled={logedInUser === "citizenUser" ? true : false}
              // InputLabelProps={{ shrink: logedInUser === "citizenUser" ? true : false }}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                // disabled={isDisabled}
                >
                  <FormattedLabel id="gender" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={loggedUser === "citizenUser" ? true : false}

                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={
                        field.value
                      }
                      onChange={(value) => field.onChange(value)}
                    >
                      {genderDetails &&
                        genderDetails.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              value?.id
                            }
                          >
                            {
                             language=="en"? value?.gender:value?.genderMr
                            }
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
          </Grid>
          {/* 5th Container */}
          <Grid container sx={{ padding: "10px" }}>
            {/* Flat/Building No */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="flatBuildNo" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}

                {...register("flatBuldingNo")}
                error={!!errors.flatBuldingNo}
                helperText={errors?.flatBuldingNo ? errors.flatBuldingNo.message : null}
              />
            </Grid>

            {/* Building Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="buildingNm" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}

                // InputLabelProps={{
                //   shrink: true,
                // }}
                {...register("buildingName")}
                error={!!errors.buildingName}
                helperText={errors?.buildingName ? errors.buildingName.message : null}
              />
            </Grid>

            {/* Road Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="roadName" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}

                {...register("roadName")}
                error={!!errors.roadName}
                helperText={errors?.roadName ? errors.roadName.message : null}
              />
            </Grid>

            {/* LandMark */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="landmark" />}
                variant="standard"
                disabled={loggedUser === "citizenUser" ? true : false}

                // InputLabelProps={{
                //   shrink: true,
                // }}
                {...register("landmark")}
                error={!!errors.landmark}
                helperText={errors?.landmark ? errors.landmark.message : null}
              />
            </Grid>
          </Grid>
          {/* 6th Container */}
          <Grid container sx={{ padding: "10px" }}>
            {/* GIS Id/Geo Code */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"

                label={<FormattedLabel id="gisgioCode" />}
                variant="standard"

                {...register("geocode")}
                error={!!errors.geocode}
                helperText={errors?.geocode ? errors.geocode.message : null}
              />
            </Grid>

            {/* Applicant Adhaar No*/}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="applicantAdharNo" />}
                variant="standard"
                sx={{
                  width: "90%",
                }}
                {...register("applicantAadharNo")}
                error={!!errors.applicantAadharNo}
                helperText={errors?.applicantAadharNo ? errors.applicantAadharNo.message : null}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                // style={{ marginTop: 5, marginLeft: 25 }}
                style={{ marginTop: 5, marginLeft: 12, width: "90%", }}
                error={!!errors.dateOfBirth}
              >
                <Controller
                  control={control}

                  name="dateOfBirth"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        variant="standard"
                        disabled={loggedUser === "citizenUser" ? true : false}

                        inputFormat="DD/MM/YYYY"
                        label={<span style={{ fontSize: 16 }}><FormattedLabel id="dateOfBirth" /></span>}
                        value={field.value}
                        onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField {...params} size="small" variant="standard" />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>{errors?.dateOfBirth ? errors.dateOfBirth.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/*  Age */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="age" />}
                type="number"
                variant="standard"
                // InputLabelProps={{
                //   shrink: true,
                // }}
                {...register("age")}
                error={!!errors.age}
                helperText={errors?.age ? errors.age.message : null}
              />
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "10px" }}>
            {/*  Mobile*/}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}
                InputLabelProps={{
                  shrink: loggedUser === "citizenUser" ? true : false
                }
                }
                label={<FormattedLabel id="mobile" />}
                variant="standard"
                {...register("mobileNo")}
                error={!!errors.mobileNo}
                helperText={errors?.mobileNo ? errors.mobileNo.message : null}
              />
            </Grid>

            {/*  Email Address */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                disabled={loggedUser === "citizenUser" ? true : false}

                label={<FormattedLabel id="email" />}
                variant="standard"
                {...register("emailId")}
                error={!!errors.emailId}
                helperText={errors?.emailId ? errors.emailId.message : null}
              />
            </Grid>

            {/* Religion */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl error={errors.religionKey} variant="standard" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="religion" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: 220 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      {...field}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);

                      }}
                      label="Select Auditorium"
                    >
                      {religionNames &&
                        religionNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language=="en"?auditorium.religion:auditorium.religionMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="religionKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.religionKey ? errors.religionKey.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Caste Category */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl error={errors.casteCategory} variant="standard" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="castCategory" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: 220 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >

                      {castNames.length > 0 &&
                        castNames.map((auditorium, index) => {
                          return (
                            <MenuItem key={index} value={auditorium.id}>
                              {language=="en"?auditorium.cast:auditorium.castMr}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="casteCategory"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.casteCategory ? errors.casteCategory.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "10px" }}>
            {/* Disability Certificate Expiry Date */}

            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                style={{ marginTop: 5, marginLeft: 12, width: "90%", }}
                error={!!errors.disabilityCertificateValidity}
              >
                <Controller
                  control={control}
                  name="disabilityCertificateValidity"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        variant="standard"
                        inputFormat="DD/MM/YYYY"
                        label={<span style={{ fontSize: 16 }}><FormattedLabel id="disabilityCertExpDate" /></span>}
                        value={field.value}
                        onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField {...params} size="small" variant="standard" />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.disabilityCertificateValidity
                    ? errors.disabilityCertificateValidity.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Divyang Scheme Type */}

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                error={errors.divyangSchemeTypeKey}
                variant="standard"
                sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="divyangSchemeType" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: 220 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {divyangNames &&
                        divyangNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {auditorium.divyangName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="divyangSchemeTypeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.divyangSchemeTypeKey ? errors.divyangSchemeTypeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          {/* Main gap  Eligibility Criteria*/}
          <Grid container sx={{ padding: "10px" }}></Grid>

          {dependency.length != 0 && <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2><FormattedLabel id="eligibilityCriteria" /></h2>
          </Box>}
          {/* </Grid> */}

          {dependency &&
            dependency
              .filter((obj) => obj.informationType === "ft")
              .map((obj, index) => {
                return (
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      {" "}
                      <strong>{obj?.informationTitle}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="ans" />}
                        variant="standard"
                        {...register(`Answer.${index}`)}
                      // error={!!errors.def}
                      // helperText={errors?.def ? errors.def.message : null}
                      />
                    </Grid>
                  </Grid>
                );
              })}
          {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {dependency &&
            dependency
              .filter((obj) => obj.informationType === "dd")
              .map((obj, index) => {
                return (
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{obj?.informationTitle}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl style={{ minWidth: "280.2px" }} error={!!errors.departmentName}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* <FormattedLabel id="departmentName" /> */}
                          Select
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              // sx={{ width: 250 }}
                              fullWidth
                              variant="standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Select"
                            >
                              {obj &&
                                obj?.infoSelectionData?.split(",").map((department, index) => (
                                  <MenuItem key={index} value={department}>
                                    {department}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="answerName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.departmentName ? errors.departmentName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                );
              })}


          <Grid container sx={{ padding: "10px" }}></Grid>

          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2><FormattedLabel id="bankDetails" /></h2>
          </Box>
          {/* </Grid> */}

          {/* 9th container */}
          <Grid container sx={{ padding: "10px" }}>
            {/* Bank Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.bankBranchKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="bankName" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: 220 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {bankMaster &&
                        bankMaster.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {language=="en"?service.bankName:service.bankNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="bankBranchKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.bankBranchKey ? errors.bankBranchKey.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Branch Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="branchName" />}
                variant="standard"
                {...register("branchName")}
                error={!!errors.branchName}
                helperText={errors?.branchName ? errors.branchName.message : null}
              />
            </Grid>

            {/* Saving Account No */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="savingAcNo" />}
                variant="standard"
                // InputLabelProps={{
                //   shrink: true,
                // }}
                {...register("savingAccountNo")}
                error={!!errors.savingAccountNo}

                helperText={errors?.savingAccountNo ? errors.savingAccountNo.message : null}
              />
            </Grid>

            {/* Bank IFSC Code */}

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"

                label={<FormattedLabel id="bankIFSC" />}
                variant="standard"
                {...register("ifscCode")}
                error={!!errors.ifscCode}
                helperText={errors?.ifscCode ? errors.ifscCode.message : null}

              />
            </Grid>
          </Grid>

          {/* 9.1 Container */}

          <Grid container sx={{ padding: "10px" }}>
            {/* Bank Micr Code */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center", color: "black"
              }}
            >
              <TextField
                sx={{ width: "90%", }}
                id="standard-basic"
                label={<FormattedLabel id="bankMICR" />}
                variant="standard"

                {...register("micrCode")}
                error={!!errors.micrCode}
                helperText={errors?.micrCode ? errors.micrCode.message : null}
              />
            </Grid>
            {/* Saving Acc Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="savinAcFirstNm" />}
                variant="standard"

                {...register("saOwnerFirstName")}
                error={!!errors.saOwnerFirstName}
                helperText={errors?.saOwnerFirstName ? errors.saOwnerFirstName.message : null}
              />
            </Grid>

            {/* Saving Acc NO Middle Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="savingAcMiddleNm" />}
                variant="standard"

                {...register("saOwnerMiddleName")}
                error={!!errors.saOwnerMiddleName}
                helperText={errors?.saOwnerMiddleName ? errors.saOwnerMiddleName.message : null}
              />
            </Grid>

            {/* Saving Account Last Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                label={<FormattedLabel id="savingAcLastNm" />}
                variant="standard"

                {...register("saOwnerLastName")}
                error={!!errors.saOwnerLastName}
                helperText={errors?.saOwnerLastName ? errors.saOwnerLastName.message : null}
              />
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "10px" }}>
            {docUpload1 &&
              docUpload1.map((obj, index) => {
                return (
                  <Grid
                    container
                    sx={{
                      padding: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      backgroundColor: "whitesmoke",
                    }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={1}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{index + 1}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={7}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{obj?.title}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <UploadButton
                        appName="BSUP"
                        serviceName="BSUP-SchemeApplication"
                        label={<FormattedLabel id="uploadDocs" />}
                        filePath={obj.documentPath}
                        objId={obj.id}
                        uploadDoc={docUpload1}
                        setUploadDoc={setDocUpload1}
                      />
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>

          <Grid container sx={{ padding: "10px" }}></Grid>

          {docUpload.length != 0 && <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2><FormattedLabel id="eligibilityDoc" /></h2>
          </Box>}
          {/* ////////////////////////////////////////////////////////// */}
          <Grid container sx={{ padding: "10px" }}>
            {docUpload &&
              docUpload.map((obj, index) => {
                return (
                  <Grid
                    container
                    sx={{
                      padding: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      backgroundColor: "whitesmoke",
                    }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={1}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{index + 1}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={7}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                      }}
                    >
                      <strong>{obj?.informationTitle}</strong>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <UploadButton
                        appName="BSUP"
                        serviceName="BSUP-SchemeApplication"
                        label={<FormattedLabel id="uploadDocs" />}
                        filePath={obj.documentPath}
                        objId={obj.id}
                        uploadDoc={docUpload}
                        setUploadDoc={setDocUpload}
                      />
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
          <Grid
            container
            spacing={5}
            style={{
              display: "flex",
              justifyContent: "center",

            }}
          >
            <Grid item>
              <Button
                sx={{ marginRight: 8 }}
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                endIcon={<SaveIcon />}
              >
                {<FormattedLabel id="save" />
                }
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="small"
                sx={{ marginRight: 8 }}
                variant="contained"
                color="primary"
                endIcon={<ClearIcon />}
                onClick={() => cancellButton()}
              >{<FormattedLabel id="clear" />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategorySchemes;
