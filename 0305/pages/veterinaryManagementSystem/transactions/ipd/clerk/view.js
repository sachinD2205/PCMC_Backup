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
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
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
  const [ipdDropDown, setIpdDropDown] = useState([
    {
      id: 1,
      ipdEn: "",
      ipdMr: "",
    },
  ]);

  let opdSchema = yup.object().shape({
    ipdKey: yup.number().required().typeError("Please select an IPD"),
    licenseNo: yup.string().required("Please enter a license no."),
    ownerFullName: yup.string().required("Please enter owner's full name"),
    ownerAddress: yup.string().required("Please enter owner's address"),
    emailAddress: yup.string().email("Email is not valid").required("Please enter an email id"),
    mobileNumber: yup
      .string()
      .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Mobile number is not valid")
      .required("Mobile number is required"),
    zoneKey: yup.number().required().typeError("Please select an zone"),
    wardKey: yup.number().required().typeError("Please select an ward"),
    areaKey: yup.number().required().typeError("Please select an area"),
    animalName: yup.string().required().typeError("Please select an animal"),
    animalAge: yup.number().required().typeError("Please enter age of the animal"),
    animalSex: yup.string().required().typeError("Please select a gender"),
    animalSpeciesKey: yup.number().required().typeError("Please select a gender"),
    animalColour: yup.string().required().typeError("Please enter the color"),
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
      setValue("narration", "IPD Registration");
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

    //Get IPD
    axios.get(`${URLs.VMS}/mstIpd/getAll`).then((res) => {
      setIpdDropDown(
        res.data.mstIpdList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          ipdEn: j.ipdName,
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
      axios.get(`${URLs.VMS}/trnAnimalTreatmentIpd/getById?id=${router.query.id}`).then((res) => {
        console.table(res.data);
        setApplicationStatus(res.data.status);
        setAllData({ ...res.data });
        reset({ ...res.data });
      });
    }
  }, [areaDropDown, wardDropDown, zoneDropDown, petBreeds, petAnimal]);

  const payment = () => {
    router.push({
      pathname: `/veterinaryManagementSystem/transactions/ipd/paymentGateway`,
      query: { id: router.query.id },
    });
  };

  const getCasePaperNoData = () => {
    let casePaperNo = watch("casePaperNo");
    axios
      .get(`${URLs.VMS}/trnAnimalTreatment/getByCasePaperNo?casePaperNo=${casePaperNo}`)
      .then((res) => {
        console.table("4343", res.data);
        const { paymentKey, id, activeFlag, ...rest } = res.data;
        reset({
          // ...res.data,
          ...rest,
          ownerFullName: res.data.ownerFullName,
          ownerAddress: res.data.ownerAddress,
          emailAddress: res.data.emailAddress,
          mobileNumber: res.data.mobileNumber,
          animalName: res.data.animalName,
          animalColour: res.data.animalColour,
          animalSex: res.data.animalSex == "Male" ? "M" : "F",
          // animalSpeciesKey: res.data.animalBreedKey,
          animalSpeciesKey: res.data.animalSpeciesKey,
          ipdKey: watch("ipdKey"),
          receiptDate: res.data.receiptDate ?? moment(new Date()).format("YYYY-MM-DD"),
          opdKey: res.data.opdKey,
          casePaperNo: res.data.casePaperNo,
          casePaperDate: res.data.casePaperDate,
          areaKey: res.data.areaKey,
        });
        setValue("casePaperNo", res.data.casePaperNo);
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

  const getPetData = () => {
    let licenseNo = watch("licenseNo");
    axios
      // .get(`${URLs.VMS}/trnPetLicence/getByPetLicenceNo?petLicenceNo=${licenseNo}`)
      .post(`${URLs.VMS}/trnPetLicence/getByPetLicenceNo`, {
        petLicenceNo: licenseNo,
      })
      .then((res) => {
        console.table("999", res.data);
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
          ipdKey: watch("ipdKey"),
          receiptDate: res.data.receiptDate ?? moment(new Date()).format("YYYY-MM-DD"),
          opdKey: res.data.opdKey,
          casePaperNo: res.data.applicationNumber,
          casePaperDate: res.data.casePaperDate,
          narration: res.data.narration ?? watch("narration"),
        });
        setValue("licenseNo", res.data.petLicenceNo);
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
    const finalBody = {
      ...data,
      // activeFlag: "Y",
    };
    console.table(data);
    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${URLs.VMS}/trnAnimalTreatmentIpd/save`, { ...finalBody, status: "Initiated" })
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert("Success!", "Patient record created successfully !", "success");
              router.push(`/veterinaryManagementSystem/transactions/ipd/clerk`);
            }
          });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Treating sick and injured animals through IPD</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Treating sick and injured animals through IPD</div>
        <form onSubmit={handleSubmit(finalSubmit)} style={{ padding: "5vh 3%" }}>
          <div className={styles.row}>
            {/* Opd number */}
            <FormControl disabled={router.query.id ? true : false} variant="standard" error={!!error.opdKey}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="opdName" />
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
                          {language === "en" ? obj.opdEn : obj.opdMr}
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
            {/* case paper number */}
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="casePaperNo" />}
              variant="standard"
              {...register("casePaperNo")}
              InputLabelProps={{
                shrink: router.query.id || watch("casePaperNo") ? true : false,
              }}
              error={!!error.casePaperNo}
              helperText={error?.casePaperNo ? error.casePaperNo.message : null}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={router.query.id ? true : false}
                      sx={{ color: "#1976D2" }}
                      onClick={() => {
                        getCasePaperNoData();
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* case paper date */}
            {/* <FormControl style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name="casePaperDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      label={<FormattedLabel id="casePaperDate" />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
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
              <FormHelperText>{errors?.casePaperDate ? errors.casePaperDate.message : null}</FormHelperText>
            </FormControl> */}
            <div style={{ width: 250 }}></div>
          </div>
          <div className={styles.row}>
            <FormControl disabled={router.query.id ? true : false} variant="standard" error={!!error.ipdKey}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="ipdName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="IpdKey"
                  >
                    {ipdDropDown &&
                      ipdDropDown.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === "en" ? obj.ipdEn : obj.ipdMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="ipdKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{error?.ipdKey ? error.ipdKey.message : null}</FormHelperText>
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
            {/* <div style={{ width: "250px" }}></div> */}
          </div>
          <div className={styles.subTitle}>
            <FormattedLabel id="caseEntry" />
          </div>

          <div className={styles.row}>
            <span style={{ opacity: router.query.id ? 0.5 : 1 }}>
              <FormattedLabel id="symptoms" /> :
            </span>
            <TextareaAutosize
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
                      query: { id: router.query.id, service: "ipd" },
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
                    query: { id: router.query.id, service: "ipd" },
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

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                router.push(`/veterinaryManagementSystem/transactions/ipd/clerk`);
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
