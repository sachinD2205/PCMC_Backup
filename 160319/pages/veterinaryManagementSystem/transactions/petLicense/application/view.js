import styles from "../vet.module.css";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import URLs from "../../../../../URLS/urls";

import Paper from "@mui/material/Paper";
import { Button, InputLabel, Select, MenuItem } from "@mui/material";
import { Clear, ExitToApp, Payment, Pets, Save } from "@mui/icons-material";
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

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  // @ts-ignore
  const userId = useSelector((state) => state.user.user.id);

  const [enableState, setEnableState] = useState(true);
  const [vaccinationPdf, setvaccinationPdf] = useState("");
  const [petAnimalPhoto, setpetAnimalPhoto] = useState("");
  const [ownerPhotoId, setOwnerPhotoID] = useState("");
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

  let petSchema = yup.object().shape({
    petAnimalKey: yup.number().required("Please select an animal"),
    zoneKey: yup.number().required("Please select an zone"),
    wardKey: yup.number().required("Please select an ward"),
    areaKey: yup.number().required("Please select an area"),
    lattitude: yup.string().required("Please enter lattitude"),
    longitude: yup.string().required("Please enter longitude"),
    cityName: yup.string().required("Please select a city"),
    pincode: yup.string().required("Please enter a pincode"),
    addrFlatOrHouseNo: yup.string().required("Please enter flat or house no."),
    addrBuildingName: yup.string().required("Please enter building name"),
    detailAddress: yup.string().required("Please enter detail address"),
    ownerName: yup.string().required("Please enter owner name"),
    ownerMobileNo: yup.number().required("Please enter mobile no."),
    ownerEmailId: yup.string().required("Please enter email id"),
    petName: yup.string().required("Please enter pet name"),
    petBirthdate: yup.string().nullable().required(`Please select pet's birthdate`),
    animalBreedKey: yup.number().required("Please select an animal breed"),
    animalColor: yup.string().required("Please enter color of the animal"),
    // animalAge: yup.number().required("Please enter the age of animal (in years)"),
    animalWeight: yup.number().required("Please enter the weight of animal (in kg)"),
    animalGender: yup.string().required("Please enter the gender of the animal"),
    antiRabiesVaccinationStatus: yup.string().required("Please select whether the animal is vaccinated"),
    vaccinationDate: yup.string().nullable(),
    vetDocName: yup.string().nullable(),
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
    if (watch("antiRabiesVaccinationStatus") === "y") {
      if (petAnimalPhoto !== "" && vaccinationPdf !== "" && ownerPhotoId !== "") {
        setEnableState(true);
      } else {
        setEnableState(false);
      }
    } else {
      if (petAnimalPhoto !== "" && ownerPhotoId !== "") {
        setEnableState(true);
      } else {
        setEnableState(false);
      }
    }
  }, [petAnimalPhoto, vaccinationPdf, ownerPhotoId]);

  useEffect(() => {
    router.query.petAnimal && setValue("petAnimalKey", router.query.petAnimal);
    setValue("stateName", "Maharashtra");

    //Get Area
    // axios.get(`${URLs.CFCURL}/master/area/getAll`).then((res) => {
    axios.get(`${URLs.VMS}/master/area/getAll`).then((res) => {
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
    // axios.get(`${URLs.CFCURL}/master/zone/getAll`).then((res) => {
    axios.get(`${URLs.VMS}/master/zone/getAll`).then((res) => {
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
    // axios.get(`${URLs.CFCURL}/master/ward/getAll`).then((res) => {
    axios.get(`${URLs.VMS}/master/ward/getAll`).then((res) => {
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
      setPetBreeds(
        res.data.mstAnimalBreedList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          breedNameEn: j.breedNameEn,
          breedNameMr: j.breedNameMr,
          petAnimalKey: j.petAnimalKey,
        })),
      );
    });

    if (router.query.id) {
      console.log("Query ID exists");
      axios
        .get(`${URLs.VMS}/trnPetLicence/getById?id=${router.query.id}`)
        .then((res) => {
          reset({ ...res.data, petBirthdate: moment(res.data.petBirthdate).format("YYYY-MM-DD") });
          setApplicationDetails({
            ...res.data,
            petBirthdate: moment(res.data.petBirthdate).format("YYYY-MM-DD"),
          });
          setvaccinationPdf(res.data.vaccinationPdf);
          setpetAnimalPhoto(res.data.petAnimalPhoto);
          setOwnerPhotoID(res.data.ownerPhotoId);
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
      petAnimalKey: "",
      areaKey: "",
      addrFlatOrHouseNo: "",
      addrBuildingName: "",
      detailAddress: "",
      ownerName: "",
      ownerMobileNo: "",
      ownerEmailId: "",
      petName: "",
      petBirthdate: null,
      animalBreedKey: "",
      animalColor: "",
      animalAge: "",
      animalWeight: "",
      animalGender: "",
      antiRabiesVaccinationStatus: "",
      vaccinationDate: null,
      vetDocName: "",
    });
  };

  const payment = () => {
    // const bodyForAPI = {
    //   ...applicationDetails,
    //   id: router.query.id,
    //   status: "Payment Successful",
    //   activeFlag: "Y",
    // };

    // axios
    //   .post(`${URLs.VMS}/trnPetLicence/save`, bodyForAPI)
    //   .then((res) => {
    //     if (res.status === 200 || res.status === 201) {
    //       sweetAlert("Success!", "Payment done successfully!", "success");
    //       router.push({
    //         pathname: `${URLs.APPURL}/veterinaryManagementSystem/transactions/petLicense/paymentSlip`,
    //         query: { id: router.query.id },
    //       });
    //     }
    //     clearFields();
    //   })
    //   .catch((error) => {
    //     console.log("error: ", error);
    //     sweetAlert({
    //       title: "ERROR!",
    //       text: `${error}`,
    //       icon: "error",
    //       buttons: {
    //         confirm: {
    //           text: "OK",
    //           visible: true,
    //           closeModal: true,
    //         },
    //       },
    //       dangerMode: true,
    //     });
    //   });
    router.push({
      pathname: `/veterinaryManagementSystem/transactions/petLicense/paymentGateway`,
      query: { id: router.query.id, amount: 75 },
    });
  };

  const finalSubmit = (data) => {
    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        const bodyForAPI = {
          ...data,
          createdUserId: userId,
          serviceId: 112,
          vaccinationPdf,
          petAnimalPhoto,
          ownerPhotoId,
          status: "Applied",
          scrutinyRemark: "Pending",
        };

        setEnableState(false);

        axios
          .post(`${URLs.VMS}/trnPetLicence/save`, bodyForAPI)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              sweetAlert("Success!", "Application saved successfully!", "success");
              // router.push(`${URLs.APPURL}/veterinaryManagementSystem/transactions/petLicense/application`);
              router.push(`/dashboard`);
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

  const calcAge = (dob) => {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    setValue("animalAge", Math.abs(age_dt.getUTCFullYear() - 1970));
  };

  return (
    <>
      <Head>
        <title>Pet License</title>
      </Head>
      <Paper className={styles.main}>
        {/* <div className={styles.title}>
          <FormattedLabel id="petLicense" />
        </div> */}
        <form onSubmit={handleSubmit(finalSubmit)} style={{ padding: "5vh 3%" }}>
          <div className={styles.row}>
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
                    value={router.query.petAnimal ?? field.value}
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
            <div style={{ width: "250px" }}></div>
            <div style={{ width: "250px" }}></div>
          </div>

          <div className={styles.row}>
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="lattitude" />}
              // @ts-ignore
              variant="standard"
              {...register("lattitude")}
              InputLabelProps={{
                shrink: router.query.id || watch("lattitude") ? true : false,
              }}
              error={!!error.lattitude}
              helperText={error?.lattitude ? error.lattitude.message : null}
            />
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="longitude" />}
              // @ts-ignore
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
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="ownerName" />}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerName") ? true : false,
              }}
              variant="standard"
              {...register("ownerName")}
              error={!!error.ownerName}
              helperText={error?.ownerName ? error.ownerName.message : null}
            />
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="mobileNo" />}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerMobileNo") ? true : false,
              }}
              variant="standard"
              {...register("ownerMobileNo")}
              error={!!error.ownerMobileNo}
              helperText={error?.ownerMobileNo ? error.ownerMobileNo.message : null}
            />
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="emailId" />}
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
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="flatOrHouseNo" />}
              id="addrFlatOrHouseNo"
              variant="standard"
              {...register("addrFlatOrHouseNo")}
              error={!!error.addrFlatOrHouseNo}
              InputLabelProps={{
                shrink: router.query.id || watch("addrFlatOrHouseNo") ? true : false,
              }}
              helperText={error?.addrFlatOrHouseNo ? error.addrFlatOrHouseNo.message : null}
            />

            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="buildingName" />}
              variant="standard"
              {...register("addrBuildingName")}
              error={!!error.addrBuildingName}
              InputLabelProps={{
                shrink: router.query.id || watch("addrBuildingName") ? true : false,
              }}
              helperText={error?.addrBuildingName ? error.addrBuildingName.message : null}
            />
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="detailAddress" />}
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
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
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
                    value={field.value}
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
              variant="standard"
              {...register("stateName")}
              error={!!error.stateName}
              helperText={error?.stateName ? error.stateName.message : null}
            />
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="pincode" />}
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
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
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
                    value={field.value}
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
              disabled={router.query.pageMode == "view" ? true : false}
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
                    value={field.value}
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
              disabled={router.query.pageMode == "view" ? true : false}
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
                    value={field.value}
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
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="petName" />}
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
                      disableFuture
                      disabled={router.query.pageMode == "view" ? true : false}
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="petBirthdate" />}
                      value={field.value}
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
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.animalBreedKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="animalBreed" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="animalBreedKey"
                  >
                    {petBreeds &&
                      petBreeds
                        .filter((obj) => {
                          return Number(obj.petAnimalKey) == Number(watch("petAnimalKey"));
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
              <FormHelperText>{error?.animalBreedKey ? error.animalBreedKey.message : null}</FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalColor" />}
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
              InputLabelProps={{
                shrink: router.query.id || watch("petBirthdate") ? true : false,
              }}
              variant="standard"
              {...register("animalAge")}
              // error={!!error.animalAge}
              // helperText={error?.animalAge ? error.animalAge.message : null}
            />
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalWeight" />}
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
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.animalGender}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="animalGender" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
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
              disabled={router.query.pageMode == "view" ? true : false}
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
                    value={field.value}
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
                          disabled={router.query.pageMode == "view" ? true : false}
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="vaccinationDate" />}
                          value={field.value}
                          onChange={(date) => field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))}
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
                  disabled={router.query.pageMode == "view" ? true : false}
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
          <div className={styles.row} style={{ marginTop: "3%" }}>
            {watch("antiRabiesVaccinationStatus") === "y" && (
              <UploadButton
                appName="TP"
                serviceName="PARTMAP"
                label={<FormattedLabel id="vaccinationPDF" />}
                filePath={vaccinationPdf}
                fileUpdater={setvaccinationPdf}
                view={router.query.pageMode === "view" ? true : false}
              />
            )}
            <UploadButton
              appName="TP"
              serviceName="PARTMAP"
              label={<FormattedLabel id="animalPhoto" />}
              filePath={petAnimalPhoto}
              fileUpdater={setpetAnimalPhoto}
              view={router.query.pageMode === "view" ? true : false}
            />
            <UploadButton
              appName="TP"
              serviceName="PARTMAP"
              label={<FormattedLabel id="ownerPhotoID" />}
              filePath={ownerPhotoId}
              fileUpdater={setOwnerPhotoID}
              view={router.query.pageMode === "view" ? true : false}
            />
            {watch("antiRabiesVaccinationStatus") !== "y" && <div style={{ width: "250px" }}></div>}
          </div>
          <div className={styles.row}>
            {router.query.id && (
              <TextField
                disabled
                sx={{ width: "250px" }}
                label={<FormattedLabel id="remark" />}
                variant="standard"
                {...register("scrutinyRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("scrutinyRemark") ? true : false,
                }}
              />
            )}
          </div>
          <div className={styles.buttons}>
            {(router.query.pageMode === "edit" || !router.query.pageMode) && (
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
                {/* <Button variant="outlined" color="error" onClick={clearFields} endIcon={<Clear />}>
                  <FormattedLabel id="clear" />
                </Button> */}
              </>
            )}

            {
              // @ts-ignore
              applicationDetails.status === "Approved" && (
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
                // router.push(`${URLs.APPURL}/veterinaryManagementSystem/transactions/petLicense/application`);
                router.push(`/dashboard`);
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
