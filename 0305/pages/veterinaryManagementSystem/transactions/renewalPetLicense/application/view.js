import styles from "../vet.module.css";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import URLs from "../../../../../URLS/urls";

import Paper from "@mui/material/Paper";
import { Button, InputLabel, Select, MenuItem, InputAdornment, IconButton } from "@mui/material";
import { Clear, ExitToApp, Payment, Pets, Save, Search } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import UploadButton from "../../../../../containers/reuseableComponents/UploadButton";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";
import { sortByAsc } from "../../../../../containers/reuseableComponents/Sorter";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  // @ts-ignore
  const userId = useSelector((state) => state.user.user.id);
  // @ts-ignore
  const isDeptUser = useSelector((state) => state?.user?.user?.userDao?.deptUser);

  const [dataFetched, setDataFetched] = useState(false);
  const [enableState, setEnableState] = useState(false);
  const [vaccinationPdf, setvaccinationPdf] = useState("");
  const [petAnimalPhoto, setpetAnimalPhoto] = useState("");
  const [ownerPhotoId, setOwnerPhotoID] = useState("");
  const [oldLicence, setOldLicence] = useState("");
  const [applicationDetails, setApplicationDetails] = useState({});
  const [areaDropDown, setAreaDropDown] = useState([
    {
      id: 1,
      areaEn: "",
      areaMr: "",
    },
  ]);
  const [zoneDropDown, setZoneDropDown] = useState([
    {
      id: 1,
      zoneEn: "",
      zoneMr: "",
    },
  ]);
  const [wardDropDown, setWardDropDown] = useState([
    {
      id: 1,
      wardEn: "",
      wardMr: "",
    },
  ]);
  const [petAnimal, setPetAnimal] = useState([{ id: 1, nameEn: "", nameMr: "" }]);
  const [petBreeds, setPetBreeds] = useState([
    {
      id: 1,
      breedNameEn: "",
      breedNameMr: "",
      petAnimalKey: "",
    },
  ]);
  const [maxBdate, setMaxBdate] = useState(moment(new Date()).format("YYYY-MM-DD"));

  let petSchema = yup.object().shape({
    petAnimalKey: yup.number().required("Please select an animal"),
    zoneKey: yup.number().required("Please select a zone").typeError("Please select a zone"),
    wardKey: yup.number().required("Please select a ward").typeError("Please select a ward"),
    areaKey: yup.number().required("Please select a area").typeError("Please select a area"),
    lattitude: yup.string().required("Please enter lattitude"),
    longitude: yup.string().required("Please enter longitude"),
    cityName: yup.string().required("Please select a city"),
    pincode: yup
      .string()
      .required("Please enter a pincode")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6, "Pincode Number must be at least 6 number")
      .max(6, "Pincode Number not valid on above 6 number"),
    addrFlatOrHouseNo: yup
      .string()
      .required("Please enter flat or house no.")
      .matches(/^[A-Za-z0-9०-९\u0900-\u097F\s ,-]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
    addrBuildingName: yup
      .string()
      .required("Please enter building name")
      .matches(/^[A-Za-z0-9०-९\u0900-\u097F\s ,-]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
    detailAddress: yup
      .string()
      .required("Please enter detail address")
      .matches(/^[A-Za-z0-9०-९\u0900-\u097F\s ,-]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
    ownerName: yup
      .string()
      .required("Please enter owner name")
      .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
    ownerMobileNo: yup
      .string()
      .matches(/^[0-9]*$/, "Must be only digits")
      .required("Please enter mobile no.")
      .typeError("Please enter mobile no.")
      .min(10, "Mobile no. shouldn't be less than 10 digits")
      .max(10, "Mobile no. shouldn't be greater than 10 digits"),
    ownerEmailId: yup.string().required("Please enter email id").email("Incorrect format"),
    petName: yup
      .string()
      .required("Please enter pet name")
      .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
    petBirthdate: yup
      .date()
      .typeError(`Please select pet's birthdate`)
      .required(`Please select pet's birthdate`),
    animalBreedKey: yup
      .number()
      .required("Please select an animal breed")
      .typeError("Please select an animal breed"),
    animalColor: yup
      .string()
      .required("Please enter color of the animal")
      .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
    // animalAge: yup.number().required("Please enter the age of animal (in years)"),
    animalWeight: yup
      .number()
      .required("Please enter the weight of animal (in kg)")
      .typeError("Please enter the weight of animal (in kg)"),
    animalGender: yup.string().required("Please select the gender of the animal"),
    antiRabiesVaccinationStatus: yup.string().required("Please select whether the animal is vaccinated"),
    vaccinationDate: yup
      .date()
      .typeError(`Please select date of vaccination`)
      .required(`Please select date of vaccination`),
    vetDocName: yup
      .string()
      .required(`Please enter vet's name`)
      .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
  });

  const {
    register,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    setValue("antiRabiesVaccinationStatus", "y");

    if (petAnimalPhoto !== "" && vaccinationPdf !== "" && ownerPhotoId !== "" && oldLicence !== "") {
      console.log("Animal Photo: ", petAnimalPhoto);
      console.log("Vaccination PDF: ", vaccinationPdf);
      console.log("Owner Photo ID: ", ownerPhotoId);
      console.log("Old License: ", oldLicence);

      setEnableState(true);
    } else {
      setEnableState(false);
    }
  }, [petAnimalPhoto, vaccinationPdf, ownerPhotoId, oldLicence]);

  useEffect(() => {
    setValue("petAnimalKey", router.query.petAnimal);

    let currentDate = new Date();

    setMaxBdate(
      Number(moment(currentDate).format("MM")) - 3 >= 0
        ? moment(currentDate).format("YYYY") +
            "-" +
            (Number(moment(currentDate).format("MM")) - 3) +
            "-" +
            moment(currentDate).format("DD")
        : Number(moment(currentDate).format("YYYY")) -
            1 +
            "-" +
            (Number(moment(currentDate).format("MM")) - 3 + 12) +
            +"-" +
            moment(currentDate).format("DD"),
    );

    //Get Area
    axios.get(`${URLs.CFCURL}/master/area/getAll`).then((res) => {
      setAreaDropDown(
        res.data.area.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          areaEn: j.areaName,
          areaMr: j.areaNameMr,
        })),
      );
    });

    //Get Zone
    axios.get(`${URLs.CFCURL}/master/zone/getAll`).then((res) => {
      setZoneDropDown(
        res.data.zone.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        })),
      );
    });

    //Get Ward
    axios.get(`${URLs.CFCURL}/master/ward/getAll`).then((res) => {
      setWardDropDown(
        res.data.ward.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          wardEn: j.wardName,
          wardMr: j.wardNameMr,
        })),
      );
    });

    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setPetAnimal(
        res.data.mstPetAnimalList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          nameEn: j.nameEn,
          nameMr: j.nameMr,
        })),
      );
    });

    //Get Pet Breeds
    axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
      setPetBreeds(() => {
        sortByAsc(res.data.mstAnimalBreedList, "breedNameEn");

        return res.data.mstAnimalBreedList.map((j, i) => ({
          id: j.id,
          breedNameEn: j.breedNameEn,
          breedNameMr: j.breedNameMr,
          petAnimalKey: j.petAnimalKey,
        }));
      });
    });

    if (router.query.id) {
      axios
        .get(`${URLs.VMS}/trnRenewalPetLicence/getById?id=${router.query.id}`)
        .then((res) => {
          setApplicationDetails({ ...res.data });
          reset({ ...res.data });
          if (res.data.antiRabiesVaccinationStatus === "y") {
            setValue("antiRabiesVaccinationStatus", res.data.antiRabiesVaccinationStatus);
            setvaccinationPdf(res.data.vaccinationPdf);
          }
          setpetAnimalPhoto(res.data.petAnimalPhoto);
          setOwnerPhotoID(res.data.ownerPhotoId);
          setOldLicence(res.data.oldLicence);
          setDataFetched(true);
        })
        .catch((error) => {
          console.log("error: ", error);
          sweetAlert({
            title: "ERROR!",
            text: `${error}`,
            icon: "error",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
            dangerMode: true,
          });
        });
    }
  }, []);

  const clearFields = () => {
    reset({
      petAnimalKey: router.query.petAnimal,
      lattitude: "",
      longitude: "",
      pincode: "",
      areaKey: "",
      addrFlatOrHouseNo: "",
      addrBuildingName: "",
      detailAddress: "",
      ownerName: "",
      ownerMobileNo: "",
      ownerEmailId: "",
      petName: watch("petName"),
      petBirthdate: watch("petBirthdate"),
      // animalBreedKey: "",
      animalColor: watch("animalColor"),
      animalAge: "",
      animalWeight: "",
      antiRabiesVaccinationStatus: "y",
      vaccinationDate: null,
      vetDocName: "",
      cityName: "",
      zoneKey: "",
      wardKey: "",
      stateName: "Maharashtra",
    });
    setOwnerPhotoID("");
    setpetAnimalPhoto("");
    setvaccinationPdf("");
  };

  const payment = () => {
    router.push({
      pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/paymentGateway`,
      query: { id: router.query.id, amount: 50 },
    });
  };

  // const calcAge = (dob) => {
  //   var diff_ms = Date.now() - dob.getTime();
  //   var age_dt = new Date(diff_ms);
  //   setValue(
  //     "animalAge",
  //     Math.abs(age_dt.getUTCFullYear() - 1970) > 0 ? Math.abs(age_dt.getUTCFullYear() - 1970) : 1,
  //   );
  // };

  function calcAge(dob) {
    var properBday = "";

    if (
      Number(new Date().getFullYear) % 4 === 0 &&
      (Number(new Date().getFullYear) % 100 !== 0 || Number(new Date().getFullYear) % 400 === 0)
    ) {
      const newDate =
        Number(moment(dob).format("DD")) - 1 > 0
          ? Number(moment(dob).format("DD")) - 1
          : Number(moment(dob).format("DD"));
      properBday = moment(dob).format("YYYY-MM-") + newDate;
    } else {
      const newDate =
        Number(moment(dob).format("DD")) - 2 > 0
          ? Number(moment(dob).format("DD")) - 2
          : Number(moment(dob).format("DD"));
      properBday = moment(dob).format("YYYY-MM-") + newDate;
    }

    const duration = moment.duration(moment(new Date()).diff(moment(properBday)));
    let years = duration.years();
    let months = duration.months();
    months = months >= 10 ? months : "0" + months;
    years = years >= 10 ? years : "0" + years;
    months == 0 ? setValue("animalAge", years) : setValue("animalAge", years + ":" + months);
  }

  const getPetData = () => {
    let licenseNo = watch("licenseNo");
    axios
      // .get(`${URLs.VMS}/trnPetLicence/getByPetLicenceNo?petLicenceNo=${licenseNo}`)
      .post(`${URLs.VMS}/trnPetLicence/getByPetLicenceNo`, {
        petLicenceNo: licenseNo,
      })
      .then((res) => {
        console.table(res.data);
        if (res.data.petAnimalKey != router.query.petAnimal) {
          sweetAlert({
            title: "Incorrect Animal",
            text: "Animal selected doesnt match with the licensed pet animal",
            icon: "warning",
            buttons: ["Cancel", "Ok"],
          }).then(() => {
            router.push(`/veterinaryManagementSystem/transactions/renewalPetLicense/TnC`);
          });
        } else {
          const { paymentKey, ...rest } = res.data;
          reset({ ...rest });
          setValue("licenseNo", res.data.petLicenceNo);
          setValue("stateName", "Maharashtra");
          calcAge(res.data.petBirthdate);
          res.data.vaccinationPdf && setvaccinationPdf(res.data.vaccinationPdf);
          setpetAnimalPhoto(res.data.petAnimalPhoto);
          setOwnerPhotoID(res.data.ownerPhotoId);
          setOldLicence(res.data.oldLicence ?? "");

          setDataFetched(true);
        }
      })
      .catch(() => {
        sweetAlert({
          title: "Incorrect License No.",
          text: "Details not found for the entered license no",
          icon: "warning",
          buttons: ["Cancel", "Ok"],
        });
      });
  };

  const finalSubmit = (data) => {
    const { id, ...rest } = data;

    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        const bodyForAPI = {
          ...rest,
          createdUserId: userId,
          serviceId: 115,
          vaccinationPdf,
          petAnimalPhoto,
          ownerPhotoId,
          oldLicence,
          status: "Applied",
          scrutinyRemark: "Pending",
        };

        axios
          .post(`${URLs.VMS}/trnRenewalPetLicence/save`, bodyForAPI)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              sweetAlert("Success!", "Application saved successfully!", "success");

              isDeptUser
                ? router.push(`/veterinaryManagementSystem/transactions/renewalPetLicense/application`)
                : router.push(`/dashboard`);
            }
            clearFields();
          })
          .catch((error) => {
            console.log("error: ", error);
            sweetAlert({
              title: "ERROR!",
              text: `${error}`,
              icon: "error",
              buttons: {
                confirm: {
                  text: "OK",
                  visible: true,
                  closeModal: true,
                },
              },
              dangerMode: true,
            });
          });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Pet License Renewal</title>
      </Head>
      <Paper className={styles.main}>
        {/* <div className={styles.title}>
          <FormattedLabel id="petLicense" />
        </div> */}
        <form onSubmit={handleSubmit(finalSubmit)} style={{ padding: "5vh 3%" }}>
          <div className={styles.row} style={{ justifyContent: dataFetched ? "space-between" : "center" }}>
            {dataFetched && (
              <FormControl disabled variant="standard" error={!!error.petAnimalKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="petAnimal" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: "250px" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // @ts-ignore
                      value={router.query.petAnimal || applicationDetails.petAnimalKey}
                      onChange={(value) => field.onChange(value)}
                      label="petAnimalKey"
                    >
                      {petAnimal &&
                        petAnimal.map((obj) => (
                          <MenuItem key={1} value={obj.id}>
                            {language === "en" ? obj.nameEn : obj.nameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="petAnimalKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{error?.petAnimalKey ? error.petAnimalKey.message : null}</FormHelperText>
              </FormControl>
            )}

            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="licenseNo" />}
              variant="standard"
              {...register("licenseNo")}
              InputLabelProps={{
                shrink: router.query.id || watch("licenseNo") ? true : false,
              }}
              error={!!error.licenseNo}
              helperText={error?.licenseNo ? error.licenseNo.message : null}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={router.query.id ? true : false}
                      sx={{ color: "#1976D2" }}
                      onClick={() => {
                        getPetData();
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {dataFetched && <div style={{ width: "250px" }}></div>}
          </div>
          {dataFetched && (
            <>
              <div className={styles.row}>
                <TextField
                  disabled={router.query.id ? true : false}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="lattitude" />}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.lattitude}
                  variant="standard"
                  {...register("lattitude")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("lattitude") ? true : false,
                  }}
                  error={!!error.lattitude}
                  helperText={error?.lattitude ? error.lattitude.message : null}
                />
                <TextField
                  disabled={router.query.id ? true : false}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="longitude" />}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.longitude}
                  variant="standard"
                  {...register("longitude")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("longitude") ? true : false,
                  }}
                  error={!!error.longitude}
                  helperText={error?.longitude ? error.longitude.message : null}
                />
                <div style={{ width: "250px" }}></div>
              </div>

              <div className={styles.row}>
                <FormControl
                  disabled={router.query.id ? true : false}
                  variant="standard"
                  error={!!error.zoneKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="zone" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // @ts-ignore
                        value={applicationDetails.zoneKey ?? field.value}
                        onChange={(value) => field.onChange(value)}
                        label="zoneKey"
                      >
                        {zoneDropDown &&
                          zoneDropDown.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == "en"
                                ? //@ts-ignore
                                  value.zoneEn
                                : // @ts-ignore
                                  value?.zoneMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="zoneKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.zoneKey ? error.zoneKey.message : null}</FormHelperText>
                </FormControl>
                <FormControl
                  disabled={router.query.id ? true : false}
                  variant="standard"
                  error={!!error.wardKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="ward" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // @ts-ignore
                        value={applicationDetails.wardKey ?? field.value}
                        onChange={(value) => field.onChange(value)}
                        label="wardKey"
                      >
                        {wardDropDown &&
                          wardDropDown.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == "en"
                                ? //@ts-ignore
                                  value.wardEn
                                : // @ts-ignore
                                  value?.wardMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="wardKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.wardKey ? error.wardKey.message : null}</FormHelperText>
                </FormControl>
                <FormControl
                  disabled={router.query.id ? true : false}
                  variant="standard"
                  error={!!error.areaKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="area" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // @ts-ignore
                        value={applicationDetails.areaKey ?? field.value}
                        onChange={(value) => field.onChange(value)}
                        label="areaKey"
                      >
                        {areaDropDown &&
                          areaDropDown.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == "en"
                                ? //@ts-ignore
                                  value.areaEn
                                : // @ts-ignore
                                  value?.areaMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="areaKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.areaKey ? error.areaKey.message : null}</FormHelperText>
                </FormControl>
              </div>
              <div className={styles.row}>
                <FormControl
                  disabled={router.query.id ? true : false}
                  variant="standard"
                  error={!!error.cityName}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="city" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // @ts-ignore
                        value={applicationDetails.cityName ?? field.value}
                        onChange={(value) => field.onChange(value)}
                        label="cityName"
                      >
                        <MenuItem key={1} value={"pimpri"}>
                          {language === "en" ? "Pimpri" : "पिंपरी"}
                        </MenuItem>{" "}
                        <MenuItem key={2} value={"chinchwad"}>
                          {language === "en" ? "Chinchwad" : "चिंचवड"}
                        </MenuItem>
                      </Select>
                    )}
                    name="cityName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.cityName ? error.cityName.message : null}</FormHelperText>
                </FormControl>
                <TextField
                  disabled
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="state" />}
                  // @ts-ignore
                  // value={"Maharashtra"}
                  variant="standard"
                  {...register("stateName")}
                  InputLabelProps={{ shrink: watch("stateName") ? true : false }}
                  error={!!error.stateName}
                  helperText={error?.stateName ? error.stateName.message : null}
                />
                <TextField
                  disabled={router.query.id ? true : false}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="pincode" />}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.pincode}
                  variant="standard"
                  {...register("pincode")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("pincode") ? true : false,
                  }}
                  error={!!error.pincode}
                  helperText={error?.pincode ? error.pincode.message : null}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  disabled={router.query.id ? true : false}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="flatOrHouseNo" />}
                  id="addrFlatOrHouseNo"
                  variant="standard"
                  // @ts-ignore
                  value={router.query.id && applicationDetails.addrFlatOrHouseNo}
                  {...register("addrFlatOrHouseNo")}
                  error={!!error.addrFlatOrHouseNo}
                  InputLabelProps={{
                    shrink: router.query.id || watch("addrFlatOrHouseNo") ? true : false,
                  }}
                  helperText={error?.addrFlatOrHouseNo ? error.addrFlatOrHouseNo.message : null}
                />

                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="buildingName" />}
                  disabled={router.query.id ? true : false}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.addrBuildingName}
                  variant="standard"
                  {...register("addrBuildingName")}
                  error={!!error.addrBuildingName}
                  InputLabelProps={{
                    shrink: router.query.id || watch("addrBuildingName") ? true : false,
                  }}
                  helperText={error?.addrBuildingName ? error.addrBuildingName.message : null}
                />
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="detailAddress" />}
                  disabled={router.query.id ? true : false}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.detailAddress}
                  variant="standard"
                  {...register("detailAddress")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("detailAddress") ? true : false,
                  }}
                  error={!!error.detailAddress}
                  helperText={error?.detailAddress ? error.detailAddress.message : null}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="ownerName" />}
                  disabled={router.query.id ? true : false}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.ownerName}
                  InputLabelProps={{
                    shrink: router.query.id || watch("ownerName") ? true : false,
                  }}
                  variant="standard"
                  {...register("ownerName")}
                  error={!!error.ownerName}
                  helperText={error?.ownerName ? error.ownerName.message : null}
                />
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="mobileNo" />}
                  disabled={router.query.id ? true : false}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.ownerMobileNo}
                  InputLabelProps={{
                    shrink: router.query.id || watch("ownerMobileNo") ? true : false,
                  }}
                  variant="standard"
                  {...register("ownerMobileNo")}
                  error={!!error.ownerMobileNo}
                  helperText={error?.ownerMobileNo ? error.ownerMobileNo.message : null}
                />
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="emailId" />}
                  disabled={router.query.id ? true : false}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.ownerEmailId}
                  InputLabelProps={{
                    shrink: router.query.id || watch("ownerEmailId") ? true : false,
                  }}
                  variant="standard"
                  {...register("ownerEmailId")}
                  error={!!error.ownerEmailId}
                  helperText={error?.ownerEmailId ? error.ownerEmailId.message : null}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  disabled
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="petName" />}
                  // disabled={router.query.id ? true : false}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.petName}
                  InputLabelProps={{
                    shrink: router.query.id || watch("petName") ? true : false,
                  }}
                  variant="standard"
                  {...register("petName")}
                  error={!!error.petName}
                  helperText={error?.petName ? error.petName.message : null}
                />
                <FormControl error={!!error.petBirthdate}>
                  <Controller
                    control={control}
                    name="petBirthdate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disabled
                          disableFuture
                          maxDate={maxBdate}
                          // disabled={router.query.id ? true : false}
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="petBirthdate" />}
                          // @ts-ignore
                          value={applicationDetails.petBirthdate ?? field.value}
                          onChange={(date) => {
                            field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"));
                            calcAge(date);
                          }}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "250px" }}
                              {...params}
                              size="small"
                              fullWidth
                              variant="standard"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>{error?.petBirthdate ? error.petBirthdate.message : null}</FormHelperText>
                </FormControl>
                <FormControl disabled variant="standard" error={!!error.animalBreedKey}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="animalBreed" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // @ts-ignore
                        value={applicationDetails.animalBreedKey ?? field.value}
                        onChange={(value) => field.onChange(value)}
                        label="animalBreedKey"
                      >
                        {petBreeds &&
                          petBreeds
                            .filter((obj) => {
                              return obj.petAnimalKey == router.query.petAnimal;
                            })
                            .map((obj, index) => (
                              <MenuItem key={index} value={obj.id}>
                                {language === "en" ? obj.breedNameEn : obj.breedNameMr}
                              </MenuItem>
                            ))}
                      </Select>
                    )}
                    name="animalBreedKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {error?.animalBreedKey ? error.animalBreedKey.message : null}
                  </FormHelperText>
                </FormControl>
              </div>
              <div className={styles.row}>
                <TextField
                  disabled
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="animalColor" />}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.animalColor}
                  InputLabelProps={{
                    shrink: router.query.id || watch("animalColor") ? true : false,
                  }}
                  variant="standard"
                  {...register("animalColor")}
                  error={!!error.animalColor}
                  helperText={error?.animalColor ? error.animalColor.message : null}
                />
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="animalAge" />}
                  disabled={true}
                  // @ts-ignore
                  // value={router.query.id && calcAge(watch("petBirthdate"))}
                  // value={watch("petBirthdate") && calcAge(petDOB)}
                  InputLabelProps={{
                    shrink: router.query.id || watch("petBirthdate") ? true : false,
                  }}
                  variant="standard"
                  {...register("animalAge")}
                  error={!!error.animalAge}
                  helperText={error?.animalAge ? error.animalAge.message : null}
                />
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="animalWeight" />}
                  disabled={router.query.id ? true : false}
                  // @ts-ignore
                  value={router.query.id && applicationDetails.animalWeight}
                  InputLabelProps={{
                    shrink: router.query.id || watch("animalWeight") ? true : false,
                  }}
                  variant="standard"
                  {...register("animalWeight")}
                  error={!!error.animalWeight}
                  helperText={error?.animalWeight ? error.animalWeight.message : null}
                />
              </div>
              <div className={styles.row}>
                <FormControl disabled variant="standard" error={!!error.animalGender}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="animalGender" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // @ts-ignore
                        value={applicationDetails.animalGender ?? field.value}
                        onChange={(value) => field.onChange(value)}
                        label="animalGender"
                      >
                        <MenuItem key={1} value={"Male"}>
                          {language === "en" ? "Male" : "पुरुष"}
                        </MenuItem>
                        <MenuItem key={2} value={"Female"}>
                          {language === "en" ? "Female" : "स्त्री"}
                        </MenuItem>
                      </Select>
                    )}
                    name="animalGender"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.animalGender ? error.animalGender.message : null}</FormHelperText>
                </FormControl>
              </div>
              <div className={styles.row}>
                <FormControl
                  // disabled={router.query.id ? true : false}
                  disabled
                  variant="standard"
                  error={!!error.antiRabiesVaccinationStatus}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="antiRabiesVaccinationStatus" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={
                          // @ts-ignore
                          applicationDetails.antiRabiesVaccinationStatus ?? field.value
                        }
                        onChange={(value) => field.onChange(value)}
                        label="antiRabiesVaccinationStatus"
                      >
                        <MenuItem key={1} value={"y"}>
                          {language === "en" ? "Yes" : "हो"}
                        </MenuItem>
                        <MenuItem key={2} value={"n"}>
                          {language === "en" ? "No" : "नाही"}
                        </MenuItem>
                      </Select>
                    )}
                    name="antiRabiesVaccinationStatus"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {error?.antiRabiesVaccinationStatus ? error.antiRabiesVaccinationStatus.message : null}
                  </FormHelperText>
                </FormControl>

                {watch("antiRabiesVaccinationStatus") === "y" && (
                  <>
                    <FormControl error={!!error.vaccinationDate}>
                      <Controller
                        control={control}
                        name="vaccinationDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              disableFuture
                              minDate={watch("petBirthdate")}
                              disabled={router.query.id ? true : false}
                              inputFormat="dd/MM/yyyy"
                              label={<FormattedLabel id="vaccinationDate" />}
                              value={
                                // @ts-ignore
                                applicationDetails.vaccinationDate ?? field.value
                              }
                              onChange={(date) =>
                                field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))
                              }
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "250px" }}
                                  {...params}
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {error?.vaccinationDate ? error.vaccinationDate.message : null}
                      </FormHelperText>
                    </FormControl>
                    <TextField
                      variant="standard"
                      sx={{ width: "250px" }}
                      label={<FormattedLabel id="veterinaryDoctorsName" />}
                      disabled={router.query.id ? true : false}
                      // @ts-ignore
                      value={router.query.id && applicationDetails.vetDocName}
                      InputLabelProps={{
                        shrink: router.query.id || watch("vetDocName") ? true : false,
                      }}
                      {...register("vetDocName")}
                      error={!!error.vetDocName}
                      helperText={error?.vetDocName ? error.vetDocName.message : null}
                    />
                  </>
                )}
              </div>

              <div className={styles.subTitle}>
                <FormattedLabel id="documents" />
              </div>
              <div className={styles.row} style={{ marginTop: "1%", justifyContent: "center" }}>
                <span
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    fontStyle: "italic",
                  }}
                >
                  <FormattedLabel id="uploadWarning" />
                </span>
              </div>
              <div
                // className={styles.row}
                style={{
                  marginTop: "3%",
                  display: "flex",
                  gap: 50,
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {watch("antiRabiesVaccinationStatus") === "y" && (
                  <UploadButton
                    appName="TP"
                    serviceName="PARTMAP"
                    label={<FormattedLabel id="vaccinationPDF" />}
                    filePath={vaccinationPdf}
                    fileUpdater={setvaccinationPdf}
                    view={router.query.id ? true : false}
                    onlyPDF
                  />
                )}
                <UploadButton
                  appName="TP"
                  serviceName="PARTMAP"
                  label={<FormattedLabel id="animalPhoto" />}
                  filePath={petAnimalPhoto}
                  fileUpdater={setpetAnimalPhoto}
                  view={router.query.id ? true : false}
                  onlyImage
                />
                <UploadButton
                  appName="TP"
                  serviceName="PARTMAP"
                  label={<FormattedLabel id="ownerPhotoID" />}
                  filePath={ownerPhotoId}
                  fileUpdater={setOwnerPhotoID}
                  view={router.query.id ? true : false}
                  imageAndPDF
                />
                <UploadButton
                  appName="TP"
                  serviceName="PARTMAP"
                  label={<FormattedLabel id="oldLicense" />}
                  filePath={oldLicence}
                  fileUpdater={setOldLicence}
                  view={router.query.id ? true : false}
                  imageAndPDF
                />
                {router.query.id && (
                  <TextField
                    disabled
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="remark" />}
                    variant="standard"
                    // @ts-ignore
                    value={applicationDetails.scrutinyRemark ?? ""}
                  />
                )}
                <div style={{ width: "250px" }}></div>
              </div>
              {/* <div className={styles.row} style={{ justifyContent: "space-evenly" }}>
                <UploadButton
                  appName="TP"
                  serviceName="PARTMAP"
                  label={<FormattedLabel id="ownerPhotoID" />}
                  filePath={ownerPhotoId}
                  fileUpdater={setOwnerPhotoID}
                  view={router.query.id ? true : false}
                />
                <UploadButton
                  appName="TP"
                  serviceName="PARTMAP"
                  label={<FormattedLabel id="ownerPhotoID" />}
                  filePath={oldLicence}
                  fileUpdater={setOldLicence}
                  view={router.query.id ? true : false}
                />
              </div> */}
              {/* <div className={styles.row}>
                {router.query.id && (
                  <TextField
                    disabled
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="remark" />}
                    variant="standard"
                    // @ts-ignore
                    value={applicationDetails.scrutinyRemark ?? ""}
                  />
                )}
              </div> */}
            </>
          )}
          <div className={styles.buttons}>
            {router.query.pageMode != "view" && dataFetched && (
              <>
                <Button
                  disabled={!enableState}
                  color="success"
                  variant="contained"
                  type="submit"
                  endIcon={<Save />}
                >
                  <FormattedLabel id="save" />
                </Button>
                <Button variant="outlined" color="error" onClick={clearFields} endIcon={<Clear />}>
                  <FormattedLabel id="clear" />
                </Button>
              </>
            )}

            {
              // @ts-ignore
              applicationDetails.status === "Approved by HOD" && (
                <Button variant="contained" onClick={payment} endIcon={<Payment />}>
                  <FormattedLabel id="makePayment" />
                </Button>
              )
            }

            <Button
              variant="contained"
              color="error"
              endIcon={<ExitToApp />}
              onClick={() => {
                isDeptUser
                  ? router.push(`/veterinaryManagementSystem/transactions/renewalPetLicense/application`)
                  : router.push(`/dashboard`);
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default Index;
