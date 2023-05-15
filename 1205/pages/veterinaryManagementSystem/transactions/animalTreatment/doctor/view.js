import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import URLs from "../../../../../URLS/urls";

import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import styles from "../ipd.module.css";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { Description, ExitToApp, Payment, Save } from "@mui/icons-material";
import moment from "moment";
import { useSelector } from "react-redux";
import UploadButton from "../../../../../containers/reuseableComponents/UploadButton";

const View = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [ipdDropDown, setIpdDropDown] = useState([
    {
      id: 1,
      ipdEn: "",
      ipdMr: "",
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
  const [allData, setAllData] = useState({});
  const [treatmentStatus, setTreatmentStatus] = useState("Under Treatment");
  const [animalPhoto, setAnimalPhoto] = useState("");

  const animalTreatmentSchema = yup.object().shape({
    ipdKey: yup.number().required().typeError("Please select an IPD"),
    ownerFullName: yup.string().required("Please enter owner's full name"),
    animalName: yup.string().required().typeError("Please select an animal"),
    animalSex: yup.string().required().typeError("Please select a gender"),
    animalSpeciesKey: yup.number().required().typeError("Please select a gender"),
    animalColour: yup.string().required().typeError("Please enter the color"),
    symptoms: yup.string().required().typeError("Please enter the symptoms"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(animalTreatmentSchema),
  });

  useEffect(() => {
    if (!router.query.id) {
      setValue("receiptDate", moment(new Date()).format("YYYY-MM-DD"));
      setValue("narration", "IPD Registration");
    }

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
  }, []);

  useEffect(() => {
    if (router.query.id) {
      axios.get(`${URLs.VMS}/trnAnimalTreatmentIpd/getById?id=${router.query.id}`).then((res) => {
        console.table(res.data);
        setAllData({ ...res.data });
        reset({ ...res.data });
        setAnimalPhoto(res.data.animalPhoto ?? "");
      });
    }
  }, [petBreeds, petAnimal]);

  useEffect(() => {
    // @ts-ignore
    if (allData) console.log(allData.status);
  }, [allData]);

  const finalSubmit = (data) => {
    const finalBody = {
      ...data,
      // activeFlag: "Y",
    };
    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${URLs.VMS}/trnAnimalTreatmentIpd/save`, { ...finalBody, status: treatmentStatus })
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert("Success!", "Patient record saved successfully !", "success");
              router.push(`/veterinaryManagementSystem/transactions/animalTreatment/doctor`);
            }
          });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Treating sick and injured animal through IPD</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Treating sick and injured animal through IPD</div>
        <form onSubmit={handleSubmit(finalSubmit)} style={{ padding: "5vh 3%" }}>
          <div className={styles.row}>
            <FormControl disabled={router.query.id ? true : false} variant="standard" error={!!error.ipdKey}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="ipdName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
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
            <TextField
              sx={{ width: "250px" }}
              // label={<FormattedLabel id="ownerName" />}
              label="Team Name"
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
            <div style={{ width: 200 }}></div>
            <div style={{ width: 200 }}></div>
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
                    sx={{ width: "200px" }}
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
            <FormControl
              disabled={router.query.id || !watch("animalName") ? true : false}
              variant="standard"
              error={!!error.animalSpeciesKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="animalBreed" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
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
                    sx={{ width: "200px" }}
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
            {/* <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "200px" }}
              label={<FormattedLabel id="animalAge" />}
              // @ts-ignore
              variant="standard"
              {...register("animalAge")}
              error={!!error.animalAge}
              InputLabelProps={{
                shrink: router.query.id || watch("animalAge") ? true : false,
              }}
              helperText={error?.animalAge ? error.animalAge.message : null}
            /> */}
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
          </div>

          <div className={styles.row}>
            <UploadButton
              appName="TP"
              serviceName="PARTMAP"
              label={<FormattedLabel id="animalPhoto" />}
              filePath={animalPhoto}
              fileUpdater={setAnimalPhoto}
              view
              onlyImage
            />
          </div>

          <div className={styles.subTitle}>
            <FormattedLabel id="treatment" />
          </div>

          <div className={styles.row}>
            <span
              // @ts-ignore
              style={{ opacity: allData.status == "Dead" || allData.status == "Released" ? 0.5 : 1 }}
            >
              <FormattedLabel id="symptoms" /> :
            </span>
            <TextareaAutosize
              color="neutral"
              // @ts-ignore
              style={{ opacity: allData.status == "Dead" || allData.status == "Released" ? 0.5 : 1 }}
              // @ts-ignore
              disabled={allData.status == "Dead" || allData.status == "Released" ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={language === "en" ? "Symptoms" : "लक्षणं"}
              className={styles.bigText}
              {...register("symptoms")}
            />
          </div>
          <div className={styles.row}>
            <span
              // @ts-ignore
              style={{ opacity: allData.status == "Dead" || allData.status == "Released" ? 0.5 : 1 }}
            >
              <FormattedLabel id="diagnosisDetail" /> :
            </span>
            <TextareaAutosize
              color="neutral"
              // @ts-ignore
              style={{ opacity: allData.status == "Dead" || allData.status == "Released" ? 0.5 : 1 }}
              // @ts-ignore
              disabled={allData.status == "Dead" || allData.status == "Released" ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={language === "en" ? "Diagnosis Details" : "निदान तपशील"}
              className={styles.bigText}
              {...register("dignosisDetails")}
            />
          </div>

          {/* <div className={styles.row}>
            <span style={{ opacity: router.query.id ? 0.5 : 1 }}>
              <FormattedLabel id="diagnosisDetail" /> :
            </span>
            <TextareaAutosize
              color="neutral"
              style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1 }}
              disabled={applicationData.status != "Initiated" ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={language === "en" ? "Diagnosis Details" : "निदान तपशील"}
              className={styles.bigText}
              {...register("dignosisDetails")}
            />
          </div> */}

          {
            // @ts-ignore
            allData.status == "Initiated" || allData.status == "Under Treatment" ? (
              <div className={styles.row} style={{ justifyContent: "center", marginTop: "2%" }}>
                <FormControl style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", marginRight: 60, fontWeight: "400" }}>
                    <FormattedLabel id="status" /> :
                  </span>
                  <RadioGroup
                    name="treatmentStatus"
                    sx={{ gap: 10 }}
                    onChange={(e) => {
                      setTreatmentStatus(e.target.value);
                    }}
                    defaultValue={
                      // @ts-ignore
                      allData.status != "Initiated" ? allData.status ?? "Under Treatment" : "Under Treatment"
                    }
                    row
                  >
                    <FormControlLabel value="Under Treatment" control={<Radio />} label="Under Treatment" />
                    <FormControlLabel value="Dead" control={<Radio />} label="Dead" />
                    <FormControlLabel value="Released" control={<Radio />} label="Released" />
                  </RadioGroup>
                </FormControl>
              </div>
            ) : (
              <div className={styles.row} style={{ justifyContent: "center", marginTop: "2%" }}>
                <span style={{ fontSize: "18px", marginRight: 60, fontWeight: "400" }}>
                  <FormattedLabel id="status" /> :{" "}
                  <span style={{ fontWeight: "bold" }}> {allData.status} </span>
                </span>
              </div>
            )
          }

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

            {
              // @ts-ignore
              (allData.status == "Initiated" || allData.status == "Under Treatment") && (
                <Button variant="contained" type="submit" color="success" endIcon={<Save />}>
                  <FormattedLabel id="save" />
                </Button>
              )
            }

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
                <Button
                  variant="contained"
                  onClick={() => {
                    router.push({
                      pathname: `/veterinaryManagementSystem/transactions/ipd/paymentGateway`,
                      query: { id: router.query.id },
                    });
                  }}
                  endIcon={<Payment />}
                >
                  <FormattedLabel id="makePayment" />
                </Button>
              )
            }

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                router.push(`/veterinaryManagementSystem/transactions/animalTreatment/doctor`);
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

export default View;
