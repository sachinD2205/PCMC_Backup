import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import URLs from "../../../../URLS/urls";
import styles from "./petIncinerator.module.css";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  Paper,
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Clear, ExitToApp, Payment, Save, Search } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";
import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  // @ts-ignore
  const userId = useSelector((state) => state.user.user.id);
  const [applicationStatus, setApplicationStatus] = useState("");
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
    petAnimalKey: yup.number().required("Please select an animal").typeError("Please select an animal"),
    zoneKey: yup.number().required("Please select a zone").typeError("Please select a zone"),
    wardKey: yup.number().required("Please select a ward").typeError("Please select a ward"),
    areaKey: yup.number().required("Please select a area").typeError("Please select a area"),
    ownerName: yup.string().required("Please enter owner's name"),
    ownerAddress: yup.string().required("Please enter owner's address"),
    ownerEmailId: yup.string().required("Please enter owner's email id"),
    ownerMobileNo: yup.string().required("Please enter owner's mobile no."),
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
        .get(`${URLs.VMS}/trnSmallPetIncineration/getById?id=${router.query.id}`)
        .then((res) => {
          reset({ ...res.data });
          setApplicationStatus(res.data.applicationStatus);
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

  const getPetData = () => {
    let licenseNo = watch("licenseNo");
    axios
      .post(`${URLs.VMS}/trnPetLicence/getByPetLicenceNo`, {
        petLicenceNo: licenseNo,
      })
      .then((res) => {
        reset({
          licenseNo: res.data.licenseNo,
          zoneKey: res.data.zoneKey,
          wardKey: res.data.wardKey,
          areaKey: res.data.areaKey,
          ownerName: res.data.ownerName,
          ownerAddress:
            res.data.addrFlatOrHouseNo + ", " + res.data.addrBuildingName + ", " + res.data.detailAddress,
          ownerEmailId: res.data.ownerEmailId,
          ownerMobileNo: res.data.ownerMobileNo,
          petAnimalKey: res.data.petAnimalKey,
          animalBreedKey: res.data.animalBreedKey,
          petName: res.data.petName,
          animalAge: res.data.animalAge,
          animalColor: res.data.animalColor,
          animalGender: res.data.animalGender,
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
    console.log("Final Data: ", data);

    axios
      .post(`${URLs.VMS}/trnSmallPetIncineration/save`, {
        ...data,
        createdUserId: userId,

        serviceId: 128,
        applicationStatus: "Application Submitted",
      })
      .then((res) => {
        sweetAlert({
          title: "Submitted",
          text: "Please move on to payment screen",
          icon: "success",
          buttons: ["Cancel", "Ok"],
        }).then((ok) => {
          if (ok) {
            router.push("/dashboard");
          }
        });
      })
      .catch((error) => {
        sweetAlert("Error", "Something went wrong", "error");
      });
  };
  return (
    <>
      <Head>
        <title>Pet Incinerator</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="smallPetIncinerator" />
        </div>

        <form onSubmit={handleSubmit(finalSubmit)}>
          {/* <div className={styles.subTitle}>Owner Details</div> */}
          <div className={styles.row}>
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
          </div>
          <div className={styles.row}>
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.zoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="zone" required />
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
                <FormattedLabel id="ward" required />
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
                <FormattedLabel id="area" required />
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
              label={<FormattedLabel id="ownerName" required />}
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
              label={<FormattedLabel id="ownerAddress" required />}
              variant="standard"
              {...register("ownerAddress")}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerAddress") ? true : false,
              }}
              error={!!error.ownerAddress}
              helperText={error?.ownerAddress ? error.ownerAddress.message : null}
            />

            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="emailId" required />}
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
              label={<FormattedLabel id="mobileNo" required />}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerMobileNo") ? true : false,
              }}
              variant="standard"
              {...register("ownerMobileNo")}
              error={!!error.ownerMobileNo}
              helperText={error?.ownerMobileNo ? error.ownerMobileNo.message : null}
            />
          </div>
          <div className={styles.subTitle}>Animal Details</div>
          <div className={styles.row}>
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
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
                    value={field.value}
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

            <FormControl
              disabled={!watch("petAnimalKey") || router.query.pageMode == "view" ? true : false}
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
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="animalBreedKey"
                  >
                    {petBreeds &&
                      petBreeds
                        .filter((obj) => {
                          return obj.petAnimalKey == watch("petAnimalKey");
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
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="petName" />}
              // disabled={router.query.id ? true : false}
              // @ts-ignore
              InputLabelProps={{
                shrink: router.query.id || watch("petName") ? true : false,
              }}
              variant="standard"
              {...register("petName")}
              error={!!error.petName}
              helperText={error?.petName ? error.petName.message : null}
            />
          </div>

          <div className={styles.row}>
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalAge" />}
              InputLabelProps={{
                shrink: router.query.id || watch("animalAge") ? true : false,
              }}
              variant="standard"
              {...register("animalAge")}
              error={!!error.animalAge}
              helperText={error?.animalAge ? error.animalAge.message : null}
            />
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="animalColor" />}
              // @ts-ignore
              InputLabelProps={{
                shrink: router.query.id || watch("animalColor") ? true : false,
              }}
              variant="standard"
              {...register("animalColor")}
              error={!!error.animalColor}
              helperText={error?.animalColor ? error.animalColor.message : null}
            />
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
                    // @ts-ignore
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

          <div className={styles.buttons}>
            {router.query.pageMode != "view" && (
              <Button variant="contained" type="submit" endIcon={<Save />} color="success">
                <FormattedLabel id="save" />
              </Button>
            )}
            {applicationStatus == "Application Submitted" && (
              <Button
                variant="contained"
                endIcon={<Payment />}
                onClick={() =>
                  router.push({
                    pathname: "/veterinaryManagementSystem/transactions/petIncinerator/paymentGateway",
                    query: { id: router.query.id },
                  })
                }
              >
                <FormattedLabel id="makePayment" />
              </Button>
            )}
            <Button variant="outlined" endIcon={<ExitToApp />} onClick={() => router.back()} color="error">
              <FormattedLabel id="exit" />
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default Index;
