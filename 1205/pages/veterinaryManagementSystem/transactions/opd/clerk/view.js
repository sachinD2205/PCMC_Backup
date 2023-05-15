import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "../opd.module.css";

import {
  Paper,
  Button,
  MenuItem,
  Select,
  InputLabel,
  TextareaAutosize,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Clear, Description, ExitToApp, Payment, Save, Search } from "@mui/icons-material";
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
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import URLs from "../../../../../URLS/urls";
import sweetAlert from "sweetalert";
import { sortByAsc } from "../../../../../containers/reuseableComponents/Sorter";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [allData, setAllData] = useState({});
  const [applicationStatus, setApplicationStatus] = useState("");
  const [opdDropDown, setOpdDropDown] = useState([
    {
      id: 1,
      opdEn: "",
      opdMr: "",
    },
  ]);
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

  let opdSchema = yup.object().shape({
    symptoms: yup.string().required().typeError("Please enter the symptoms"),
    paymentMode: yup.string().required("Please select a payment category"),
    payerName: yup.string().required("Please enter payer's name"),
    payerAddress: yup.string().required("Please enter payer's address"),
    receiptDate: yup.string().required("Please select a receipt date"),
    narration: yup.string().required("Please enter a narration"),
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
    resolver: yupResolver(opdSchema),
  });

  useEffect(() => {
    if (!router.query.id) {
      setValue("receiptDate", moment(new Date()).format("YYYY-MM-DD"));
      setValue("narration", "OPD Registration");
    }

    //Get OPD
    axios.get(`${URLs.VMS}/mstOpd/getAll`).then((res) => {
      setOpdDropDown(
        res.data.mstOpdList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          opdEn: j.opdName,
        })),
      );
    });

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
      setPetAnimal(() => {
        sortByAsc(res.data.mstPetAnimalList, "nameEn");
        return res.data.mstPetAnimalList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          nameEn: j.nameEn,
          nameMr: j.nameMr,
        }));
      });
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
  }, []);

  useEffect(() => {
    if (router.query.id) {
      axios.get(`${URLs.VMS}/trnAnimalTreatment/getById?id=${router.query.id}`).then((res) => {
        console.table(res.data);
        setApplicationStatus(res.data.status);
        setAllData({ ...res.data });
        console.log(res.data.status, " aahe status");
        reset({ ...res.data });
      });
    }
  }, [areaDropDown, wardDropDown, zoneDropDown, petBreeds, petAnimal]);

  const payment = () => {
    router.push({
      pathname: `/veterinaryManagementSystem/transactions/opd/paymentGateway`,
      query: { id: router.query.id },
    });
  };

  const getPetData = () => {
    let licenseNo = watch("licenseNo");
    axios
      // .get(`${URLs.VMS}/trnPetLicence/getByPetLicenceNo?petLicenceNo=${licenseNo}`)
      .post(`${URLs.VMS}/trnPetLicence/getByPetLicenceNo`, {
        petLicenceNo: licenseNo,
      })
      .then((res) => {
        console.table(res.data);
        const { paymentKey, id, activeFlag, ...rest } = res.data;
        reset({
          ...rest,
          ownerFullName: res.data.ownerName,
          ownerAddress:
            res.data.addrFlatOrHouseNo + ", " + res.data.addrBuildingName + ", " + res.data.detailAddress,
          emailAddress: res.data.ownerEmailId,
          mobileNumber: res.data.ownerMobileNo,
          animalName: res.data.petAnimalKey,
          animalColour: res.data.animalColor,
          animalSex: res.data.animalGender == "Male" ? "M" : "F",
          animalSpeciesKey: res.data.animalBreedKey,
          opdKey: watch("opdKey"),
          receiptDate: res.data.receiptDate ?? moment(new Date()).format("YYYY-MM-DD"),
        });
        setValue("licenseNo", res.data.petLicenceNo);
        // setValue("stateName", "Maharashtra");
        // setpetAnimalPhoto(res.data.petAnimalPhoto);
        // setOwnerPhotoID(res.data.ownerPhotoId);
        // setDataFetched(true);
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
    console.table(data);
    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios.post(`${URLs.VMS}/trnAnimalTreatment/save`, { ...data, status: "Initiated" }).then((res) => {
          if (res.status == 200 || res.status == 201) {
            sweetAlert("Success!", "Patient record created successfully !", "success");
            router.push(`/veterinaryManagementSystem/transactions/opd/clerk`);
          }
        });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Treating sick and injured animals through OPD</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Treating sick and injured animals through OPD</div>
        <form onSubmit={handleSubmit(finalSubmit)} style={{ padding: "5vh 3%" }}>
          <div className={styles.row}>
            <FormControl disabled={router.query.id ? true : false} variant="standard" error={!!error.opdKey}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="petAnimal" /> */}
                OPD
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="opdKey"
                  >
                    {opdDropDown &&
                      opdDropDown.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {/* {language === "en" ? obj.opdEn : obj.opdMr} */}
                          {obj.opdEn}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="opdKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{error?.opdKey ? error.opdKey.message : null}</FormHelperText>
            </FormControl>

            {/* <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="licenseNo" />}
              // @ts-ignore
              variant="standard"
              {...register("licenseNo")}
              error={!!error.licenseNo}
              InputLabelProps={{
                shrink: router.query.id || watch("licenseNo") ? true : false,
              }}
              helperText={error?.licenseNo ? error.licenseNo.message : null}
            /> */}
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
            <div style={{ width: "250px" }}></div>
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="ownerName" />}
              disabled={router.query.id ? true : false}
              // @ts-ignore
              //   value={router.query.id && applicationDetails.ownerFullName}
              variant="standard"
              {...register("ownerFullName")}
              error={!!error.ownerFullName}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerFullName") ? true : false,
              }}
              helperText={error?.ownerFullName ? error.ownerFullName.message : null}
            />
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="ownerAddress" />}
              disabled={router.query.id ? true : false}
              // @ts-ignore
              //   value={router.query.id && applicationDetails.ownerAddress}
              variant="standard"
              {...register("ownerAddress")}
              error={!!error.ownerAddress}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerAddress") ? true : false,
              }}
              helperText={error?.ownerAddress ? error.ownerAddress.message : null}
            />
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="emailId" />}
              disabled={router.query.id ? true : false}
              // @ts-ignore
              //   value={router.query.id && applicationDetails.emailAddress}
              variant="standard"
              {...register("emailAddress")}
              error={!!error.emailAddress}
              InputLabelProps={{
                shrink: router.query.id || watch("emailAddress") ? true : false,
              }}
              helperText={error?.emailAddress ? error.emailAddress.message : null}
            />
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="mobileNo" />}
              disabled={router.query.id ? true : false}
              // @ts-ignore
              //   value={router.query.id && applicationDetails.mobileNumber}
              variant="standard"
              {...register("mobileNumber")}
              error={!!error.mobileNumber}
              InputLabelProps={{
                shrink: router.query.id || watch("mobileNumber") ? true : false,
              }}
              helperText={error?.mobileNumber ? error.mobileNumber.message : null}
            />

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
          </div>
          <div className={styles.row}>
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
            <div style={{ width: "250px" }}></div>
            <div style={{ width: "250px" }}></div>
          </div>
          <div className={styles.subTitle}>Animal Details</div>
          <div className={styles.row}>
            <FormControl
              disabled={router.query.id ? true : false}
              variant="standard"
              error={!!error.animalName}
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
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="animalName"
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === "en" ? obj.nameEn : obj.nameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="animalName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{error?.animalName ? error.animalName.message : null}</FormHelperText>
            </FormControl>
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalAge" />}
              // @ts-ignore
              variant="standard"
              {...register("animalAge")}
              error={!!error.animalAge}
              InputLabelProps={{
                shrink: router.query.id || watch("animalAge") ? true : false,
              }}
              helperText={error?.animalAge ? error.animalAge.message : null}
            />
            <FormControl
              disabled={router.query.id ? true : false}
              variant="standard"
              error={!!error.animalSex}
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
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="animalSex"
                  >
                    <MenuItem key={1} value={"M"}>
                      {language === "en" ? "Male" : "पुरुष"}
                    </MenuItem>
                    <MenuItem key={2} value={"F"}>
                      {language === "en" ? "Female" : "स्त्री"}
                    </MenuItem>
                  </Select>
                )}
                name="animalSex"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{error?.animalSex ? error.animalSex.message : null}</FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <FormControl
              disabled={router.query.id ? true : false}
              variant="standard"
              error={!!error.animalSpeciesKey}
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
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="animalSpeciesKey"
                  >
                    {petBreeds &&
                      petBreeds
                        .filter((obj) => {
                          //   return obj.petAnimalKey == router.query.petAnimal;
                          return obj.petAnimalKey == watch("animalName");
                        })
                        .map((obj, index) => (
                          <MenuItem key={index} value={obj.id}>
                            {language === "en" ? obj.breedNameEn : obj.breedNameMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name="animalSpeciesKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.animalSpeciesKey ? error.animalSpeciesKey.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalColor" />}
              // @ts-ignore
              variant="standard"
              {...register("animalColour")}
              error={!!error.animalColour}
              InputLabelProps={{
                shrink: router.query.id || watch("animalColour") ? true : false,
              }}
              helperText={error?.animalColour ? error.animalColour.message : null}
            />
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="petName" />}
              // @ts-ignore
              variant="standard"
              {...register("petName")}
              error={!!error.petName}
              InputLabelProps={{
                shrink: router.query.id || watch("petName") ? true : false,
              }}
              helperText={error?.petName ? error.petName.message : null}
            />
            {/* <div style={{ width: "250px" }}></div> */}{" "}
          </div>
          <div className={styles.subTitle}>
            <FormattedLabel id="caseEntry" />
          </div>
          {/* <div className={styles.row}>
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="casePaperNo" />}
              disabled={router.query.id ? true : false}
              // @ts-ignore
              variant="standard"
              {...register("casePaperNo")}
              error={!!error.casePaperNo}
              InputLabelProps={{
                shrink: router.query.id || watch("casePaperNo") ? true : false,
              }}
              helperText={error?.casePaperNo ? error.casePaperNo.message : null}
            />
            <FormControl error={!!error.casePaperDate}>
              <Controller
                control={control}
                name="casePaperDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disabled={router.query.id ? true : false}
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="casePaperDate" />}
                      // @ts-ignore
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
              <FormHelperText>{error?.casePaperDate ? error.casePaperDate.message : null}</FormHelperText>
            </FormControl>
            <div style={{ width: "250px" }}></div>
          </div> */}
          {/* <div className={styles.row}>
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="aknowledgementSlipNo" />}
              // @ts-ignore
              variant="standard"
              {...register("aknowledgementSlipNo")}
              error={!!error.aknowledgementSlipNo}
              InputLabelProps={{
                shrink: router.query.id || watch("aknowledgementSlipNo") ? true : false,
              }}
              helperText={error?.aknowledgementSlipNo ? error.aknowledgementSlipNo.message : null}
            />
            <FormControl
              disabled={router.query.id ? true : false}
              variant="standard"
              error={!!error.treatmentCategory}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="treatmentCategory" />
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
                    label="treatmentCategory"
                  >
                    <MenuItem key={1} value={"firstAid"}>
                      {language === "en" ? "First Aid" : "प्रथमोपचार"}
                    </MenuItem>
                    <MenuItem key={2} value={"minorSurgery"}>
                      {language === "en" ? "Minor Surgery" : "किरकोळ शस्त्रक्रिया"}
                    </MenuItem>
                  </Select>
                )}
                name="treatmentCategory"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.treatmentCategory ? error.treatmentCategory.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.transactionDate}>
              <Controller
                control={control}
                name="transactionDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disabled
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="transactionDate" />}
                      // @ts-ignore
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
              <FormHelperText>{error?.transactionDate ? error.transactionDate.message : null}</FormHelperText>
            </FormControl>
          </div> */}

          <div className={styles.row}>
            <span style={{ opacity: router.query.id ? 0.5 : 1 }}>
              <FormattedLabel id="symptoms" /> :
            </span>
            <TextareaAutosize
              // nonce={undefined}
              // onResize={undefined}
              // onResizeCapture={undefined}
              style={{ opacity: router.query.id ? 0.5 : 1 }}
              color="neutral"
              disabled={router.query.id ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={language === "en" ? "Symptoms" : "लक्षणं"}
              className={styles.bigText}
              {...register("symptoms")}
            />
          </div>
          {/* <div className={styles.row}>
            <span>
              <FormattedLabel id="diagnosisDetail" /> :
            </span>
            <TextareaAutosize
              color="neutral"
              disabled={false}
              minRows={3}
              maxRows={5}
              placeholder={language === "en" ? "Diagnosis Details" : "निदान तपशील"}
              className={styles.bigText}
              {...register("dignosisDetails")}
            />
          </div>
          <div className={styles.row}>
            <span>
              <FormattedLabel id="medicineDetails" /> :
            </span>
            <TextareaAutosize
              color="neutral"
              disabled={false}
              minRows={3}
              maxRows={5}
              placeholder={language === "en" ? "Medicine Details" : "औषध तपशील"}
              className={styles.bigText}
              {...register("medicineDetails")}
            />
          </div> */}
          <>
            <div className={styles.subTitle}>
              <FormattedLabel id="payment" />
            </div>

            <div className={styles.row}>
              <FormControl
                disabled={router.query.id ? true : false}
                variant="standard"
                error={!!error.paymentMode}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="paymentMode" />
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
                      label="paymentMode"
                    >
                      <MenuItem key={1} value={"online"}>
                        Online
                      </MenuItem>
                      <MenuItem key={2} value={"cash"}>
                        Cash
                      </MenuItem>
                    </Select>
                  )}
                  name="paymentMode"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{error?.paymentMode ? error.paymentMode.message : null}</FormHelperText>
              </FormControl>
              <TextField
                disabled={router.query.id ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="payerName" />}
                // @ts-ignore
                variant="standard"
                {...register("payerName")}
                error={!!error.payerName}
                InputLabelProps={{
                  shrink: router.query.id || watch("payerName") ? true : false,
                }}
                helperText={error?.payerName ? error.payerName.message : null}
              />
              <TextField
                disabled={router.query.id ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="payerAddress" />}
                // @ts-ignore
                variant="standard"
                {...register("payerAddress")}
                error={!!error.payerAddress}
                InputLabelProps={{
                  shrink: router.query.id || watch("payerAddress") ? true : false,
                }}
                helperText={error?.payerAddress ? error.payerAddress.message : null}
              />
            </div>
            <div className={styles.row}>
              {/* <TextField
                disabled={router.query.id ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="receiptNo" />}
                // @ts-ignore
                variant="standard"
                {...register("receiptNo")}
                error={!!error.receiptNo}
                InputLabelProps={{
                  shrink: router.query.id || watch("receiptNo") ? true : false,
                }}
                helperText={error?.receiptNo ? error.receiptNo.message : null}
              /> */}
              <FormControl disabled={router.query.id ? true : false} error={!!error.receiptDate}>
                <Controller
                  control={control}
                  name="receiptDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        // disabled={router.query.id ? true : false}
                        disabled
                        inputFormat="dd/MM/yyyy"
                        label={<FormattedLabel id="receiptDate" />}
                        // @ts-ignore
                        value={field.value}
                        // value={router.query.id ? field.value : new Date()}
                        onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
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
                <FormHelperText>{error?.receiptDate ? error.receiptDate.message : null}</FormHelperText>
              </FormControl>
              <TextField
                disabled={router.query.id ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="narration" />}
                // @ts-ignore
                variant="standard"
                {...register("narration")}
                error={!!error.narration}
                InputLabelProps={{
                  shrink: router.query.id || watch("narration") ? true : false,
                }}
                helperText={error?.narration ? error.narration.message : null}
              />
              <TextField
                disabled
                sx={{ width: "250px" }}
                label={<FormattedLabel id="amount" />}
                value="Rs. 10"
                // @ts-ignore
                variant="standard"
              />
            </div>
            {/* <div className={styles.row}>
              <TextField
                disabled={router.query.id ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="accountGlCode" />}
                // @ts-ignore
                variant="standard"
                {...register("accountGlCode")}
                error={!!error.accountGlCode}
                InputLabelProps={{
                  shrink: router.query.id || watch("accountGlCode") ? true : false,
                }}
                helperText={error?.accountGlCode ? error.accountGlCode.message : null}
              />
              <div style={{ width: "250px" }}></div>
              <div style={{ width: "250px" }}></div>
            </div> */}
          </>

          <div className={styles.buttons}>
            {
              // @ts-ignore
              (allData.status == "Awaiting Payment" || allData.status == "Payment Successful") && (
                <Button
                  variant="contained"
                  endIcon={<Description />}
                  onClick={() => {
                    router.push({
                      pathname: `/veterinaryManagementSystem/transactions/prescription`,
                      query: { id: router.query.id, service: "opd" },
                    });
                  }}
                >
                  <FormattedLabel id="prescription" />
                </Button>
              )
            }

            {!router.query.id && (
              <Button variant="contained" type="submit" color="success" endIcon={<Save />}>
                <FormattedLabel id="save" />
              </Button>
            )}

            {router.query.id && (
              <Button
                variant="contained"
                endIcon={<Description />}
                onClick={() => {
                  router.push({
                    pathname: "/veterinaryManagementSystem/transactions/casePaperReceipt",
                    query: { id: router.query.id, service: "opd" },
                  });
                }}
              >
                <FormattedLabel id="casePaperReceipt" />
              </Button>
            )}

            {
              // @ts-ignore
              allData.status === "Awaiting Payment" && (
                <Button variant="contained" onClick={payment} endIcon={<Payment />}>
                  <FormattedLabel id="makePayment" />
                </Button>
              )
            }
            {/* <Button variant="outlined" color="error" endIcon={<Clear />}>
              <FormattedLabel id="clear" />
            </Button> */}
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                router.push(`/veterinaryManagementSystem/transactions/opd/clerk`);
              }}
              endIcon={<ExitToApp />}
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
