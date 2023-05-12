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
import { Add, Clear, Delete, ExitToApp, Save, Search } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import { Controller, useForm } from "react-hook-form";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { sortByAsc } from "../../../../../containers/reuseableComponents/Sorter";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [medicineDetails, setMedicineDetails] = useState([]);

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
  const [applicationData, setApplicationData] = useState({});

  let opdSchema = yup.object().shape({
    symptoms: yup.string().required("Please enter the symptoms"),
    dignosisDetails: yup.string().required("Please enter Diagnosis Details"),
    // medicineDetails: yup.string().required("Please enter Medicine Details"),
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
    setValue("casePaperDate", moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"));

    //Get OPD
    axios.get(`${URLs.VMS}/mstOpd/getAll`).then((res) => {
      setOpdDropDown(
        res.data.mstOpdList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          opdEn: j.buildingName,
          opdMr: j.buildingNameMr,
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
      axios.get(`${URLs.VMS}/trnAnimalTreatment/getById?id=${router.query.id}`).then((res) => {
        const {
          paymentDao,
          paymentId,
          paymentKey,
          treatmentCategory,
          transactionDate,
          receiptNo,
          ipdKey,
          medicineDetails,
          digitalSignatureTreatment,
          digitalSignatureReceipt,
          aknowledgementSlipNo,
          accountGlCode,
          casePaperDate,
          medicineName,
          remark,
          days,
          dosage,
          opdNo,
          ...restData
        } = res.data;

        // reset({ ...res.data });
        // setApplicationData({ ...res.data });
        reset({ ...restData, dignosisDetails: res.data.dignosisDetails ?? watch("dignosisDetails") });
        setApplicationData({ ...restData });
        if (res.data.status == "Awaiting Payment") {
          setMedicineDetails(res.data?.opdMedicineDao);
        }
      });
    }
  }, [petBreeds, petAnimal, wardDropDown, zoneDropDown, areaDropDown, opdDropDown]);

  useEffect(() => {
    reset({
      ...applicationData,
      // @ts-ignore
      dignosisDetails: applicationData.dignosisDetails ?? watch("dignosisDetails"),
    });
  }, [medicineDetails]);

  const getOPDData = () => {
    console.log("Searching by Case No.: ", watch("casePaperNo"));

    axios.get(`${URLs.VMS}/trnAnimalTreatment/getById?id=${watch("casePaperNo")}`).then((res) => {
      const { casePaperNo, ...rest } = res.data;
      reset({ ...rest });
      setApplicationData({ ...rest });
    });
  };

  const updateMedicineList = (rowData, action) => {
    console.log(rowData, action);

    if (action == "delete") {
      setMedicineDetails(() => {
        // @ts-ignore
        return medicineDetails.filter((obj) => obj.id != rowData.id);
      });
    } else {
      // @ts-ignore
      console.log("Medicine last id: ", medicineDetails[medicineDetails.length - 1]?.id + 1);
      // @ts-ignore
      setMedicineDetails((oldData) => {
        return [
          ...oldData,
          {
            ...rowData,
            remark: rowData.remark ?? "",
            // @ts-ignore
            id: (medicineDetails[medicineDetails.length - 1]?.id ?? 0) + 1,
          },
        ];
      });
    }
  };

  const finalSubmit = (data) => {
    console.table(data);

    const { medicineName, remark, days, dosage, ...finalData } = data;

    let opdMedicineDao = medicineDetails.map((j) => {
      let { id, ...medicine } = j;

      return { ...medicine };
    });

    axios
      .post(`${URLs.VMS}/trnAnimalTreatment/save`, {
        ...applicationData,
        // ...data,
        ...finalData,
        opdMedicineDao,
        status: "Awaiting Payment",
        activeFlag: "Y",
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          console.log("Success data: ", res.data);
          sweetAlert("Success!", "Patient record created successfully !", "success");
          router.push(`/veterinaryManagementSystem/transactions/opd/doctor`);
        }
      });
  };

  const medicineColumns = [
    {
      headerClassName: "cellColor",

      field: "medicineName",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="medicine" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "days",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="days" />,
      // width: 100,
      flex: 0.4,
    },
    {
      headerClassName: "cellColor",

      field: "dosage",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="dosage" />,
      // width: 100,
      flex: 0.4,
    },
    {
      headerClassName: "cellColor",

      field: "remark",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 80,
      hide: applicationData.status == "Initiated" ? false : true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: "red" }}
              onClick={() => {
                updateMedicineList(params.row, "delete");
              }}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>Treating sick and injured animals through OPD</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Treating sick and injured animals through OPD</div>
        <form onSubmit={handleSubmit(finalSubmit)} style={{ padding: "5vh 3%" }}>
          <div className={styles.row}>
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="casePaperNo" />}
              disabled={router.query.id ? true : false}
              // @ts-ignore
              variant="standard"
              {...register("casePaperNo")}
              error={!!error.casePaperNo}
              // InputLabelProps={{ shrink: watch("casePaperNo") }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={router.query.id ? true : false}
                      sx={{ color: "#1976D2" }}
                      onClick={() => {
                        getOPDData();
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: router.query.id || watch("casePaperNo") ? true : false,
              }}
              helperText={error?.casePaperNo ? error.casePaperNo.message : null}
            />
          </div>
          <div className={styles.row}>
            <FormControl disabled variant="standard" error={!!error.opdKey}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="opd" />
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

            <TextField
              disabled
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
            />
            <div style={{ width: "250px" }}></div>
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="ownerName" />}
              disabled
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
              disabled
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
              disabled
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
              disabled
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

            <FormControl disabled variant="standard" error={!!error.zoneKey}>
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
            <FormControl disabled variant="standard" error={!!error.wardKey}>
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
            <FormControl disabled variant="standard" error={!!error.areaKey}>
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
            <FormControl disabled variant="standard" error={!!error.animalName}>
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
              disabled
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
            <FormControl disabled variant="standard" error={!!error.animalSex}>
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
            <FormControl disabled variant="standard" error={!!error.animalSpeciesKey}>
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
              disabled
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
            <div style={{ width: "250px" }}></div>
          </div>
          <div className={styles.subTitle}>
            <FormattedLabel id="treatment" />
          </div>
          {/* <div className={styles.row} style={{ justifyContent: "center" }}>
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="casePaperNo" />}
              disabled={router.query.id ? true : false}
              // @ts-ignore
              variant="standard"
              {...register("casePaperNo")}
              error={!!error.casePaperNo}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ color: "#1976D2" }}
                      onClick={() => {
                        getOPDData();
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              // InputLabelProps={{
              //   shrink: router.query.id || watch("casePaperNo") ? true : false,
              // }}
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
            <span
              style={{
                opacity:
                  // @ts-ignore
                  applicationData.status != "Initiated" ? 0.5 : 1,
              }}
            >
              <FormattedLabel id="symptoms" /> :
            </span>
            <TextareaAutosize
              color="neutral"
              // @ts-ignore
              style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1 }}
              // @ts-ignore
              disabled={applicationData.status != "Initiated" ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={language === "en" ? "Symptoms" : "लक्षणं"}
              className={styles.bigText}
              {...register("symptoms")}
            />
          </div>
          <div className={styles.row}>
            <span
              style={{
                opacity:
                  // @ts-ignore
                  applicationData.status != "Initiated" ? 0.5 : 1,
              }}
            >
              <FormattedLabel id="diagnosisDetail" /> :
            </span>
            <TextareaAutosize
              color="neutral"
              // @ts-ignore
              style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1 }}
              // @ts-ignore
              disabled={applicationData.status != "Initiated" ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={language === "en" ? "Diagnosis Details" : "निदान तपशील"}
              className={styles.bigText}
              {...register("dignosisDetails")}
            />
          </div>
          <div
            className={styles.row}
            style={{
              fontSize: "larger",
              fontWeight: "bold",
              marginBottom: 0,
              justifyContent: "center",
              textTransform: "uppercase",
            }}
          >
            <span>
              <FormattedLabel id="medicineDetails" /> :
            </span>
          </div>
          {
            // @ts-ignore
            applicationData.status == "Initiated" && (
              <div className={styles.row} style={{ alignItems: "center" }}>
                <TextField
                  sx={{ width: "200px" }}
                  label={<FormattedLabel id="medicine" />}
                  // @ts-ignore
                  variant="standard"
                  {...register("medicineName")}
                  error={!!error.medicineName}
                  helperText={error?.medicineName ? error.medicineName.message : null}
                />
                <TextField
                  sx={{ width: "200px" }}
                  label={<FormattedLabel id="days" />}
                  // @ts-ignore
                  variant="standard"
                  {...register("days")}
                  error={!!error.days}
                  helperText={error?.days ? error.days.message : null}
                />
                <TextField
                  sx={{ width: "200px" }}
                  label={<FormattedLabel id="dosage" />}
                  // @ts-ignore
                  variant="standard"
                  {...register("dosage")}
                  error={!!error.dosage}
                  helperText={error?.dosage ? error.dosage.message : null}
                />
                <TextField
                  sx={{ width: "200px" }}
                  label={<FormattedLabel id="remark" />}
                  // @ts-ignore
                  variant="standard"
                  {...register("remark")}
                  error={!!error.remark}
                  helperText={error?.remark ? error.remark.message : null}
                />
                <Button
                  // disabled={
                  //   watch("medicineName") != "" && watch("days") != "" && watch("dosage") != "" ? false : true
                  // }
                  disabled={watch("medicineName") && watch("days") && watch("dosage") ? false : true}
                  variant="contained"
                  endIcon={<Add />}
                  onClick={() => {
                    updateMedicineList(
                      {
                        medicineName: watch("medicineName"),
                        days: watch("days"),
                        dosage: watch("dosage"),
                        remark: watch("remark"),
                      },
                      "add",
                    );
                    reset({
                      medicineName: "",
                      days: "",
                      dosage: "",
                      remark: "",
                    });
                  }}
                >
                  <FormattedLabel id="addMedicine" />
                </Button>
              </div>
            )
          }
          <div className={styles.row} style={{ justifyContent: "center" }}>
            <DataGrid
              autoHeight
              sx={{
                "& .cellColor": {
                  backgroundColor: "#1976d2",
                  color: "white",
                },
              }}
              rows={medicineDetails}
              //@ts-ignore
              columns={medicineColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>
          {/* <div className={styles.row}>
            <div className={styles.column}>
              <span style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1, marginBottom: 20 }}>
                <FormattedLabel id="diagnosisDetail" /> :
              </span>
              <TextareaAutosize
                color="neutral"
                style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1 }}
                disabled={applicationData.status != "Initiated" ? true : false}
                minRows={8}
                maxRows={8}
                // placeholder={language === "en" ? "Medicine Details" : "औषध तपशील"}
                placeholder={language === "en" ? "Diagnosis Details" : "निदान तपशील"}
                className={styles.bigText}
                {...register("dignosisDetails")}
              />
            </div>
            <div className={styles.column}>
              <span style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1, marginBottom: 20 }}>
                <FormattedLabel id="medicineDetails" /> :
              </span>
              <DataGrid
                autoHeight
                sx={{
                  // marginTop: "5vh",
                  width: "100%",

                  "& .cellColor": {
                    backgroundColor: "#1976d2",
                    color: "white",
                  },
                  "& .redText": {
                    color: "red",
                  },
                  "& .orangeText": {
                    color: "orange",
                  },
                  "& .greenText": {
                    color: "green",
                  },
                  "& .blueText": {
                    color: "blue",
                  },
                }}
                getCellClassName={(params) => {
                  if (params.field === "status" && params.value == "Initiated") {
                    return "orangeText";
                  } else if (params.field === "status" && params.value == "Awaiting Payment") {
                    return "greenText";
                  } else if (params.field === "status" && params.value == "Payment Successful") {
                    return "blueText";
                  } else {
                    return "";
                  }
                }}
                rows={medicineDetails}
                //@ts-ignore
                columns={medicineColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </div>
          </div> */}

          <div className={styles.buttons}>
            {
              // @ts-ignore
              applicationData.status === "Initiated" && (
                <Button variant="contained" type="submit" color="success" endIcon={<Save />}>
                  <FormattedLabel id="save" />
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
                router.push(`/veterinaryManagementSystem/transactions/opd/doctor`);
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
