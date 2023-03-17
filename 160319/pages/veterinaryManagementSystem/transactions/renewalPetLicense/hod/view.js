import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "../vet.module.css";
import URLs from "../../../../../URLS/urls";

import Paper from "@mui/material/Paper";
import { Button, InputLabel, Select, MenuItem } from "@mui/material";
import { Clear, ExitToApp, Pets, Save } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import { Controller, FormProvider, useForm } from "react-hook-form";
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

const View = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [enableState, setEnableState] = useState(false);
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
  const [petBreeds, setPetBreeds] = useState([
    {
      id: 1,
      breedNameEn: "",
      breedNameMr: "",
      petAnimalKey: "",
    },
  ]);

  let petSchema = yup.object().shape({
    action: yup.string().required("Please select an action"),
    scrutinyRemark: yup.string().required("Please enter a remark"),
  });

  const {
    register,
    // handleSubmit: handleSubmit,
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

  // useEffect(() => {
  //   if (petAnimalPhoto !== '' && vaccinationPdf !== '') {
  //     setEnableState(true)
  //   } else {
  //     setEnableState(false)
  //   }
  // }, [petAnimalPhoto, vaccinationPdf])

  useEffect(() => {
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
        .get(`${URLs.VMS}/trnRenewalPetLicence/getById?id=${router.query.id}`)
        .then((res) => {
          console.log("Pet Details: ", res.data);
          setApplicationDetails({ ...res.data });
          if (res.data.antiRabiesVaccinationStatus === "y") {
            setValue("antiRabiesVaccinationStatus", res.data.antiRabiesVaccinationStatus);
          }
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

  const finalSubmit = (data) => {
    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        const bodyForAPI = {
          ...applicationDetails,
          id: router.query.id,
          status: data.action,
          scrutinyRemark: data.scrutinyRemark,
          activeFlag: "Y",
        };

        axios
          .post(`${URLs.VMS}/trnRenewalPetLicence/save`, bodyForAPI)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              if (watch("action") === "Approved") {
                sweetAlert("Success!", "Application approved!", "success");
              } else {
                sweetAlert("Success!", "Application reassigned!", "success");
              }

              router.push(`/veterinaryManagementSystem/transactions/renewalPetLicense/hod`);
            }
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

  const [petAnimal, setPetAnimal] = useState([{ id: 1, nameEn: "", nameMr: "" }]);

  return (
    <>
      <Head>
        <title>Pet License Renewal</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="petLicense" />
        </div>
        <form onSubmit={handleSubmit(finalSubmit)} style={{ padding: "5vh 3%" }}>
          <div className={styles.row}>
            <FormControl
              // disabled={router.query.id ? true : false}
              disabled
              variant="standard"
              error={!!error.petAnimalKey}
            >
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
                    value={applicationDetails.petAnimalKey ?? ""}
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
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="lattitude" />}
              // @ts-ignore
              value={applicationDetails.lattitude ?? ""}
              variant="standard"
              {...register("lattitude")}
              InputLabelProps={{
                shrink: router.query.id || watch("lattitude") ? true : false,
              }}
              error={!!error.lattitude}
              helperText={error?.lattitude ? error.lattitude.message : null}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="longitude" />}
              // @ts-ignore
              value={applicationDetails.longitude ?? ""}
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
            <FormControl disabled variant="standard" error={!!error.cityName}>
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
              value={"Maharashtra"}
              variant="standard"
              {...register("stateName")}
              error={!!error.stateName}
              helperText={error?.stateName ? error.stateName.message : null}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="pincode" />}
              // @ts-ignore
              value={applicationDetails.pincode ?? ""}
              variant="standard"
              {...register("pincode")}
              error={!!error.pincode}
              helperText={error?.pincode ? error.pincode.message : null}
            />
          </div>

          <div className={styles.row}>
            <FormControl disabled={router.query.id ? true : false} variant="standard" error={!!error.zoneKey}>
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
            <FormControl disabled={router.query.id ? true : false} variant="standard" error={!!error.wardKey}>
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
            <FormControl disabled={router.query.id ? true : false} variant="standard" error={!!error.areaKey}>
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
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="flatOrHouseNo" />}
              // @ts-ignore
              value={applicationDetails.addrFlatOrHouseNo ?? ""}
              variant="standard"
              {...register("addrFlatOrHouseNo")}
              error={!!error.addrFlatOrHouseNo}
              helperText={error?.addrFlatOrHouseNo ? error.addrFlatOrHouseNo.message : null}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="buildingName" />}
              variant="standard"
              // @ts-ignore
              value={applicationDetails.addrBuildingName ?? ""}
              {...register("addrBuildingName")}
              error={!!error.addrBuildingName}
              helperText={error?.addrBuildingName ? error.addrBuildingName.message : null}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="detailAddress" />}
              variant="standard"
              // @ts-ignore
              value={applicationDetails.detailAddress ?? ""}
              {...register("detailAddress")}
              error={!!error.detailAddress}
              helperText={error?.detailAddress ? error.detailAddress.message : null}
            />
          </div>
          <div className={styles.row}>
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="ownerName" />}
              variant="standard"
              // @ts-ignore
              value={applicationDetails.ownerName ?? ""}
              {...register("ownerName")}
              error={!!error.ownerName}
              helperText={error?.ownerName ? error.ownerName.message : null}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="mobileNo" />}
              type="number"
              variant="standard"
              // @ts-ignore
              value={applicationDetails.ownerMobileNo ?? ""}
              {...register("ownerMobileNo")}
              error={!!error.ownerMobileNo}
              helperText={error?.ownerMobileNo ? error.ownerMobileNo.message : null}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="emailId" />}
              variant="standard"
              // @ts-ignore
              value={applicationDetails.ownerEmailId ?? ""}
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
              variant="standard"
              // @ts-ignore
              value={applicationDetails.petName ?? ""}
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
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="petBirthdate" />}
                      // value={field.value}
                      // @ts-ignore
                      value={applicationDetails.petBirthdate ?? field.value}
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
                    // value={field.value}
                    // @ts-ignore
                    value={applicationDetails.animalBreedKey ?? ""}
                    onChange={(value) => field.onChange(value)}
                    label="animalBreedKey"
                  >
                    {petBreeds &&
                      petBreeds.map((obj, index) => (
                        <MenuItem key={index} value={obj.id}>
                          {language === "en" ? obj.breedNameEn : obj.breedNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="animalBreedKey"
                control={control}
              />
              <FormHelperText>{error?.animalBreedKey ? error.animalBreedKey.message : null}</FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalColor" />}
              variant="standard"
              // @ts-ignore
              value={applicationDetails.animalColor ?? ""}
              {...register("animalColor")}
              error={!!error.animalColor}
              helperText={error?.animalColor ? error.animalColor.message : null}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalAge" />}
              type="number"
              variant="standard"
              // @ts-ignore
              value={applicationDetails.animalAge ?? ""}
              {...register("animalAge")}
              error={!!error.animalAge}
              helperText={error?.animalAge ? error.animalAge.message : null}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalWeight" />}
              type="number"
              variant="standard"
              // @ts-ignore
              value={applicationDetails.animalWeight ?? ""}
              {...register("animalWeight")}
              error={!!error.animalWeight}
              helperText={error?.animalWeight ? error.animalWeight.message : null}
            />
          </div>
          <div className={styles.row}>
            <FormControl variant="standard" error={!!error.animalGender} disabled>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="animalGender" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // value={field.value}
                    // @ts-ignore
                    value={applicationDetails.animalGender ?? ""}
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
              />
              <FormHelperText>{error?.animalGender ? error.animalGender.message : null}</FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <FormControl disabled variant="standard" error={!!error.antiRabiesVaccinationStatus}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="antiRabiesVaccinationStatus" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // value={field.value}
                    value={
                      // @ts-ignore
                      applicationDetails.antiRabiesVaccinationStatus ?? ""
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
                          disabled
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="vaccinationDate" />}
                          // value={field.value}
                          // @ts-ignore
                          value={
                            // @ts-ignore
                            applicationDetails.vaccinationDate ?? field.value
                          }
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
                  disabled
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="veterinaryDoctorsName" />}
                  variant="standard"
                  // @ts-ignore
                  value={applicationDetails.vetDocName ?? ""}
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
                view
              />
            )}
            <UploadButton
              appName="TP"
              serviceName="PARTMAP"
              label={<FormattedLabel id="animalPhoto" />}
              filePath={petAnimalPhoto}
              fileUpdater={setpetAnimalPhoto}
              view
            />
            <UploadButton
              appName="TP"
              serviceName="PARTMAP"
              label={<FormattedLabel id="ownerPhotoID" />}
              filePath={ownerPhotoId}
              fileUpdater={setOwnerPhotoID}
              view
            />
            {watch("antiRabiesVaccinationStatus") !== "y" && <div style={{ width: "250px" }}></div>}
          </div>
          {
            // @ts-ignore
            applicationDetails.status == "Applied" && (
              <div
                className={styles.row}
                style={{
                  justifyContent: "center",
                  columnGap: "10vw",
                  marginTop: "5vh",
                }}
              >
                {/* <FormControl variant="standard" error={!!error.action}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="actions" />
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
                        label="action"
                      >
                        <MenuItem key={1} value={"Approved"}>
                          <FormattedLabel id="approve" />
                        </MenuItem>
                        <MenuItem key={2} value={"Reassigned"}>
                          <FormattedLabel id="reassign" />
                        </MenuItem>
                      </Select>
                    )}
                    name="action"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.action ? error.action.message : null}</FormHelperText>
                </FormControl> */}
                <FormControl
                  // disabled={router.query.id ? true : false}
                  variant="standard"
                  error={!!error.action}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="actions" />
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
                        label="action"
                      >
                        <MenuItem key={1} value={"Approved"}>
                          {language === "en" ? "Approve" : "मंजूर"}
                        </MenuItem>
                        <MenuItem key={2} value={"Reassigned"}>
                          {language === "en" ? "Reassign" : "पुन्हा नियुक्त करा"}
                        </MenuItem>
                      </Select>
                    )}
                    name="action"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.action ? error.action.message : null}</FormHelperText>
                </FormControl>

                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="remark" />}
                  variant="standard"
                  {...register("scrutinyRemark")}
                  error={!!error.scrutinyRemark}
                  helperText={error?.scrutinyRemark ? error.scrutinyRemark.message : null}
                />
              </div>
            )
          }
          <div className={styles.buttons}>
            {
              // @ts-ignore
              applicationDetails.status == "Applied" && (
                <Button
                  // disabled={!enableState}
                  color="success"
                  variant="contained"
                  type="submit"
                  endIcon={<Save />}
                >
                  <FormattedLabel id="save" />
                </Button>
              )
            }
            {
              // @ts-ignore
              applicationDetails.status === "Payment Successful" && (
                <Button
                  variant="contained"
                  onClick={() => {
                    router.push({
                      pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/petLicense`,
                      query: { id: router.query.id },
                    });
                  }}
                  endIcon={<Pets />}
                >
                  <FormattedLabel id="generateLicense" />
                </Button>
              )
            }
            <Button
              variant="contained"
              color="error"
              endIcon={<ExitToApp />}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/hod`,
                });
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

export default View;
