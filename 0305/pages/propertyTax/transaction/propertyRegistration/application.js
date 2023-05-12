import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "../ptaxTransactions.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  TextField,
  stepConnectorClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add,
  Aod,
  Apartment,
  BrandingWatermark,
  Check,
  Clear,
  Delete,
  Home,
  Info,
  PermIdentity,
} from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import sweetAlert from "sweetalert";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [activeStep, setActiveStep] = useState(0);
  const [OTPfield, setOTPfield] = useState(false);
  const [completed, setCompleted] = useState({});
  const [titles, setTitles] = useState([{ id: 1, titleEn: "Mr", titleMr: "श्री" }]);
  const [genders, setGenders] = useState([{ id: 1, genderEn: "Male", genderMr: "पुरुष" }]);
  const [propertyHolders, setPropertyHolders] = useState([]);
  const [currentOTP, setCurrentOTP] = useState(0);
  const [sameAddress, setSameAddress] = useState(false);

  /* +-+-+-+-+-+-+-+-+-+-+-+-+- Schemas +-+-+-+-+-+-+-+-+-+-+-+-+-+ */

  let applicationInfoSchema = yup.object().shape({
    applicationDate: yup.date().required("Please select a date"),
    applicationNo: yup.string().required("Please select a number"),
    serviceID: yup.string().required("Please select a serviceId"),
  });

  let propertyHolderDetailsSchema = yup.object().shape({
    title: yup.number().required("Please select a title").typeError("Please select a title"),
    firstNameEn: yup.string().required("Please enter first name in english."),
    middleNameEn: yup.string().required("Please enter middle name in english."),
    lastNameEn: yup.string().required("Please enter last name in english."),
    firstNameMr: yup.string().required("Please enter first name in marathi."),
    middleNameMr: yup.string().required("Please enter middle name in marathi."),
    lastNameMr: yup.string().required("Please enter last name in marathi."),
    gender: yup.number().required("Please select a gender.").typeError("Please select a gender"),
    email: yup.string().required("Please enter email id").email("Incorrect format"),
    mobile: yup.number().required("Please select mobile no.").typeError("Please enter a mobile no."),
    panCard: yup.string().required("Please enter pan no."),
    aadharNo: yup.string().required("Please enter aadhar no."),
  });

  let addressSchema = yup.object().shape({
    //property
    lattitude: yup.string().required("Please enter lattitude."),
    longitude: yup.string().required("Please enter longitude."),
    circle: yup.number().required("Please select a circle").typeError("Please select a circle"),
    circleNo: yup.string().required("Please enter a circle no."),
    citySurveyNumber: yup.string().required("Please enter a city survey number."),
    flatNo: yup.string().required("Please enter a flat no."),
    buildingName: yup.string().required("Please enter a building name."),
    societyName: yup.string().required("Please enter a society name."),
    areaName: yup.string().required("Please enter an area name."),
    landmarkName: yup.string().required("Please enter a landmark name."),
    villageName: yup.string().required("Please enter a village name."),
    cityName: yup.string().required("Please enter a city name."),
    pincode: yup.string().required("Please enter a pincode."),
    //postal/billing
    lattitude2: yup.string().required("Please enter lattitude."),
    longitude2: yup.string().required("Please enter longitude."),
    circle2: yup.number().required("Please select a circle").typeError("Please select a circle"),
    circleNo2: yup.string().required("Please enter a circle no."),
    citySurveyNumber2: yup.string().required("Please enter a city survey number."),
    flatNo2: yup.string().required("Please enter a flat no."),
    buildingName2: yup.string().required("Please enter a building name."),
    societyName2: yup.string().required("Please enter a society name."),
    areaName2: yup.string().required("Please enter an area name."),
    landmarkName2: yup.string().required("Please enter a landmark name."),
    villageName2: yup.string().required("Please enter a village name."),
    cityName2: yup.string().required("Please enter a city name."),
    pincode2: yup.string().required("Please enter a pincode."),
  });

  let propertyInformationSchema = yup.object().shape({
    // applicationDate: yup.string().required("Please select a date"),
    // applicationNo: yup.string().required("Please select a number"),
    // serviceId: yup.string().required("Please select a serviceId"),
  });

  let additionalInfoSchema = yup.object().shape({
    // applicationDate: yup.string().required("Please select a date"),
    // applicationNo: yup.string().required("Please select a number"),
    // serviceId: yup.string().required("Please select a serviceId"),
  });

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    watch: watch1,
    reset: reset1,
    control: control1,
    formState: { errors: errors1 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(applicationInfoSchema),
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    watch: watch2,
    reset: reset2,
    control: control2,
    getValues: getValues2,
    formState: { errors: errors2 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(propertyHolderDetailsSchema),
  });

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    setValue: setValue3,
    watch: watch3,
    reset: reset3,
    control: control3,
    formState: { errors: errors3 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(addressSchema),
  });

  const {
    register: register4,
    handleSubmit: handleSubmit4,
    setValue: setValue4,
    watch: watch4,
    reset: reset4,
    control: control4,
    formState: { errors: errors4 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(propertyInformationSchema),
  });

  const {
    register: register5,
    handleSubmit: handleSubmit5,
    setValue: setValue5,
    watch: watch5,
    reset: reset5,
    control: control5,
    formState: { errors: errors5 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(additionalInfoSchema),
  });

  /* +-+-+-+-+-+-+-+-+-+-+-+-+- Schemas +-+-+-+-+-+-+-+-+-+-+-+-+-+ */

  useEffect(() => {
    setValue1("applicationDate", moment(new Date()).format("YYYY-MM-DD"));
    setValue1("applicationNo", "PCMCPTPR20230400001");
    setValue1("serviceID", "Property Registration");
  }, [OTPfield]);

  useEffect(() => {
    sameAddress && setBillingAddress();
  }, [sameAddress]);

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

  const ColorlibConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        background: "linear-gradient(to left, #125597, #9ccdff)",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        background: "linear-gradient(to left, #125597, #9ccdff)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: "#eaeaf0",
      borderRadius: 1,
    },
  }));

  // @ts-ignore
  const ColorlibStepIconRoot = styled("div")(({ ownerState }) => ({
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage: "linear-gradient(to right, #125597, #9ccdff)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundImage: "linear-gradient(to right, #125597, #9ccdff)",
    }),
  }));

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
      1: <BrandingWatermark />,
      2: <PermIdentity />,
      3: <Home />,
      4: <Apartment />,
      5: <Info />,
    };

    return (
      <ColorlibStepIconRoot
        // @ts-ignore
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  const steps = [
    <FormattedLabel key={1} id="applicationInfo" />,
    <FormattedLabel key={2} id="propertyHolderDetails" />,
    <FormattedLabel key={3} id="address" />,
    <FormattedLabel key={4} id="propertyInformation" />,
    <FormattedLabel key={5} id="additionalInfo" />,
  ];

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const newCompleted = completed;
    newCompleted[activeStep - 1] = false;
    setCompleted(newCompleted);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  // const handleReset = () => {
  //   setActiveStep(0)
  //   setCompleted({})
  // }

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "titleEn" : "titleMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="title" />,
      width: 80,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "fullNameEn" : "fullNameMr",
      align: "center",
      headerAlign: "center",
      headerName: language == "en" ? <FormattedLabel id="fullNameEn" /> : <FormattedLabel id="fullNameMr" />,
      // width: 200,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "genderEn" : "genderMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="gender" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",

      field: "mobile",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="mobile" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "email",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="email" />,
      width: 210,
    },
    {
      headerClassName: "cellColor",

      field: "panCard",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="panCardNo" />,
      width: 120,
    },
    {
      headerClassName: "cellColor",

      field: "aadharNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="aadharNo" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 125,
      renderCell: (params) => {
        return (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              propertyHolderDeleter(params.row.id);
            }}
            startIcon={<Clear />}
          >
            <FormattedLabel id="remove" />
          </Button>
          // <IconButton
          //   style={{ color: "red" }}
          //   onClick={() => {
          //     propertyHolderDeleter(params.row.id);
          //   }}
          // >
          //   <Delete />
          // </IconButton>
        );
      },
    },
  ];

  const generateOTP = () => {
    console.log("Mobile No.: ", watch2("mobile"));

    let generatedOTP = Math.ceil(Math.random() * 1000000);
    setValue2("otp", generatedOTP);
    setCurrentOTP(generatedOTP);
  };

  const validateOTP = () => {
    if (Number(watch2("otp")) == currentOTP) {
      sweetAlert("Success", "OTP has been validated", "success");
      setOTPfield(true);
    } else {
      sweetAlert("Error", "Incorrect OTP", "error");
    }
  };

  const setBillingAddress = () => {
    reset3({
      //property
      circle: watch3("circle"),
      lattitude: watch3("lattitude"),
      longitude: watch3("longitude"),
      circleNo: watch3("circleNo"),
      citySurveyNumber: watch3("citySurveyNumber"),
      flatNo: watch3("flatNo"),
      buildingName: watch3("buildingName"),
      societyName: watch3("societyName"),
      areaName: watch3("areaName"),
      landmarkName: watch3("landmarkName"),
      villageName: watch3("villageName"),
      cityName: watch3("cityName"),
      pincode: watch3("pincode"),
      //postal/billing
      circle2: watch3("circle"),
      lattitude2: watch3("lattitude"),
      longitude2: watch3("longitude"),
      circleNo2: watch3("circleNo"),
      citySurveyNumber2: watch3("citySurveyNumber"),
      flatNo2: watch3("flatNo"),
      buildingName2: watch3("buildingName"),
      societyName2: watch3("societyName"),
      areaName2: watch3("areaName"),
      landmarkName2: watch3("landmarkName"),
      villageName2: watch3("villageName"),
      cityName2: watch3("cityName"),
      pincode2: watch3("pincode"),
    });
  };

  const addholderDetails = () => {
    const holderValues = getValues2();
    const { otp, ...rest } = holderValues;

    if (
      !watch2("title") ||
      !watch2("firstNameEn") ||
      !watch2("middleNameEn") ||
      !watch2("lastNameEn") ||
      !watch2("firstNameMr") ||
      !watch2("middleNameMr") ||
      !watch2("lastNameMr") ||
      !watch2("gender") ||
      !watch2("mobile") ||
      !watch2("panCard") ||
      !watch2("aadharNo")
    ) {
      // sweetAlert("Incomplete!", "Please enter all the details of the property holder", "info");
      handleSubmit2(propertyHolderDetails)();
    } else {
      // @ts-ignore
      setPropertyHolders((old) => [
        ...old,
        {
          srNo: propertyHolders.length == 0 ? 1 : propertyHolders.length + 1,
          id: propertyHolders.length == 0 ? 1 : propertyHolders.length + 1,
          ...rest,
          fullNameEn:
            holderValues.firstNameEn + " " + holderValues.middleNameEn + " " + holderValues.lastNameEn,
          fullNameMr:
            holderValues.firstNameMr + " " + holderValues.middleNameMr + " " + holderValues.lastNameMr,
          titleEn: titles.find((obj) => obj.id == holderValues.title)?.titleEn,
          titleMr: titles.find((obj) => obj.id == holderValues.title)?.titleMr,
          genderEn: genders.find((obj) => obj.id == holderValues.gender)?.genderEn,
          genderMr: genders.find((obj) => obj.id == holderValues.gender)?.genderMr,
        },
      ]);
      // sweetAlert("Success!", "Successfully added details", "success");
      reset2({
        title: null,
        firstNameEn: "",
        middleNameEn: "",
        lastNameEn: "",
        firstNameMr: "",
        middleNameMr: "",
        lastNameMr: "",
        gender: null,
        mobile: "",
        panCard: "",
        aadharNo: "",
        email: "",
      });
    }
  };

  const propertyHolderDeleter = (id) => {
    // @ts-ignore
    setPropertyHolders(propertyHolders.filter((obj) => obj?.id !== id));
    // sweetAlert("Deleted!", "Record Deleted successfully !", "success");
  };

  /* +-+-+-+-+-+-+-+-+-+-+-+-+- Submitter Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+ */

  const applicationInfo = (data1) => {
    console.log("Application Info: ", data1);
    handleNext();
  };

  const propertyHolderDetails = (data2) => {
    console.log("Property Holder Details: ", data2);
  };

  const address = (data3) => {
    console.log("Address: ", data3);
    handleNext();
  };

  const propertyInformation = (data4) => {
    console.log("Property Information: ", data4);
    handleNext();
  };

  const additionalInfo = (data5) => {
    console.log("Additional Information: ", data5);
  };

  const submitter = (stepNo) => {
    console.log("Step No.: ", stepNo);

    if (stepNo == 0) {
      handleSubmit1(applicationInfo)();
    } else if (stepNo == 1) {
      if (propertyHolders.length > 0 && OTPfield) {
        handleNext();
      } else {
        if (!OTPfield) {
          sweetAlert("Info", "Please enter atleast 1 property holder's details!", "info");
        } else {
          sweetAlert("Info!", "Please validate your phone number.", "info");
        }
      }
    } else if (stepNo == 2) {
      handleSubmit3(address)();
    } else if (stepNo == 3) {
      handleSubmit4(propertyInformation)();
    } else if (stepNo == 4) {
      handleSubmit5(additionalInfo)();
    }
  };

  /* +-+-+-+-+-+-+-+-+-+-+-+-+- Submitter Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+ */

  return (
    <>
      <Head>
        <title>Property Tax - Application</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="propertyRegistration" />
        </div>

        <Stepper
          sx={{ margin: "35px 0px" }}
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => (
            <Step
              //  sx={{ cursor: "pointer" }}
              key={index}
            >
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep == 0 && (
          <>
            <form>
              <div className={styles.row} style={{ justifyContent: "center" }}>
                <span className={styles.stepperHeader}>
                  <FormattedLabel id="applicationInfo" />
                </span>
              </div>
              <div style={{ marginTop: "50px" }} className={styles.row}>
                <FormControl error={!!errors1.applicationDate}>
                  <Controller
                    control={control1}
                    name="applicationDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disabled
                          disableFuture
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="applicationDate" />}
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"));
                          }}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "250px" }}
                              {...params}
                              size="small"
                              fullWidth
                              variant="standard"
                              error={!!errors1.applicationDate}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors1?.applicationDate ? errors1.applicationDate.message : null}
                  </FormHelperText>
                </FormControl>
                <TextField
                  disabled
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="applicationNumber" />}
                  // @ts-ignore
                  variant="standard"
                  {...register1("applicationNo")}
                  InputLabelProps={{
                    shrink: router.query.id || watch1("applicationNo") ? true : false,
                  }}
                  error={!!errors1.applicationNo}
                  helperText={errors1?.applicationNo ? errors1.applicationNo.message : null}
                />
                <TextField
                  disabled
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="SubjectServiceName" />}
                  // @ts-ignore
                  variant="standard"
                  {...register1("serviceID")}
                  InputLabelProps={{
                    shrink: router.query.id || watch1("serviceID") ? true : false,
                  }}
                  error={!!errors1.serviceID}
                  helperText={errors1?.serviceID ? errors1.serviceID.message : null}
                />
              </div>
            </form>
          </>
        )}
        {activeStep == 1 && (
          <>
            <form>
              <div className={styles.row} style={{ justifyContent: "center" }}>
                <span className={styles.stepperHeader}>
                  <FormattedLabel id="propertyHolderDetails" />
                </span>
              </div>

              <div className={styles.row}>
                <FormControl
                  disabled={router.query.pageMode == "view" ? true : false}
                  variant="standard"
                  error={!!errors2.title}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="title" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="title"
                      >
                        {titles &&
                          titles.map((obj, i) => (
                            <MenuItem key={i} value={obj.id}>
                              {language == "en" ? obj.titleEn : obj.titleMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="title"
                    control={control2}
                    defaultValue=""
                  />
                  <FormHelperText>{errors2?.title ? errors2.title.message : null}</FormHelperText>
                </FormControl>

                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="firstNameEn" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("firstNameEn") ? true : false,
                  }}
                  {...register2("firstNameEn")}
                  error={!!errors2.firstNameEn}
                  helperText={errors2?.firstNameEn ? errors2.firstNameEn.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="middleNameEn" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("middleNameEn") ? true : false,
                  }}
                  {...register2("middleNameEn")}
                  error={!!errors2.middleNameEn}
                  helperText={errors2?.middleNameEn ? errors2.middleNameEn.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="lastNameEn" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("lastNameEn") ? true : false,
                  }}
                  {...register2("lastNameEn")}
                  error={!!errors2.lastNameEn}
                  helperText={errors2?.lastNameEn ? errors2.lastNameEn.message : null}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="firstNameMr" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("firstNameMr") ? true : false,
                  }}
                  {...register2("firstNameMr")}
                  error={!!errors2.firstNameMr}
                  helperText={errors2?.firstNameMr ? errors2.firstNameMr.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="middleNameMr" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("middleNameMr") ? true : false,
                  }}
                  {...register2("middleNameMr")}
                  error={!!errors2.middleNameMr}
                  helperText={errors2?.middleNameMr ? errors2.middleNameMr.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="lastNameMr" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("lastNameMr") ? true : false,
                  }}
                  {...register2("lastNameMr")}
                  error={!!errors2.lastNameMr}
                  helperText={errors2?.lastNameMr ? errors2.lastNameMr.message : null}
                />

                <FormControl
                  disabled={router.query.pageMode == "view" ? true : false}
                  variant="standard"
                  error={!!errors2.gender}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="gender" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="gender"
                      >
                        {genders &&
                          genders.map((obj, i) => (
                            <MenuItem key={i} value={obj.id}>
                              {language == "en" ? obj.genderEn : obj.genderMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="gender"
                    control={control2}
                    defaultValue=""
                  />
                  <FormHelperText>{errors2?.gender ? errors2.gender.message : null}</FormHelperText>
                </FormControl>
              </div>

              <div className={styles.row}>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="mobile" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("mobile") ? true : false,
                  }}
                  {...register2("mobile")}
                  error={!!errors2.mobile}
                  helperText={errors2?.mobile ? errors2.mobile.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="email" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("email") ? true : false,
                  }}
                  {...register2("email")}
                  error={!!errors2.email}
                  helperText={errors2?.email ? errors2.email.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="panCardNo" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("panCard") ? true : false,
                  }}
                  {...register2("panCard")}
                  error={!!errors2.panCard}
                  helperText={errors2?.panCard ? errors2.panCard.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="aadharNo" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch2("aadharNo") ? true : false,
                  }}
                  {...register2("aadharNo")}
                  error={!!errors2.aadharNo}
                  helperText={errors2?.aadharNo ? errors2.aadharNo.message : null}
                />
              </div>
              <div className={styles.row} style={{ margin: "40px 0px", justifyContent: "center" }}>
                {!OTPfield ? (
                  <>
                    <TextField
                      variant="standard"
                      sx={{ width: "250px", marginRight: "30px" }}
                      label={<FormattedLabel id="enterOTP" />}
                      disabled={currentOTP == 0 ? true : false}
                      {...register2("otp")}
                      InputLabelProps={{
                        shrink: watch2("otp") ? true : false,
                      }}
                      error={!!errors2.otp}
                      helperText={errors2?.otp ? errors2.otp.message : null}
                    />

                    {currentOTP !== 0 && (
                      <Button
                        sx={{ marginRight: "30px" }}
                        variant="contained"
                        endIcon={<Aod />}
                        onClick={validateOTP}
                      >
                        <FormattedLabel id="validateOTP" />
                      </Button>
                    )}
                    <Button
                      variant={currentOTP !== 0 ? "outlined" : "contained"}
                      endIcon={<Aod />}
                      onClick={generateOTP}
                    >
                      <FormattedLabel id="generateOTP" />
                    </Button>
                  </>
                ) : (
                  <>
                    <label
                      style={{
                        fontWeight: "bold",
                        fontSize: "large",
                        textTransform: "capitalize",
                        marginRight: "15px",
                      }}
                    >
                      <FormattedLabel id="noValidated" />
                    </label>
                    <Check sx={{ color: "green" }} />
                  </>
                )}
              </div>
              <div className={styles.row} style={{ justifyContent: "center" }}>
                <Button
                  sx={{ borderRadius: 5 }}
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addholderDetails}
                >
                  <FormattedLabel id="addHolderDetails" />
                </Button>
              </div>
              <DataGrid
                autoHeight
                sx={{
                  marginTop: "5vh",
                  width: "100%",

                  "& .cellColor": {
                    backgroundColor: "#1976d2",
                    color: "white",
                  },
                }}
                rows={propertyHolders}
                //@ts-ignore
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </form>
          </>
        )}

        {activeStep == 2 && (
          <>
            <form>
              <div className={styles.row} style={{ justifyContent: "center" }}>
                <span className={styles.stepperHeader}>
                  <FormattedLabel id="address" />
                </span>
              </div>
              <div className={styles.row} style={{ justifyContent: "center" }}>
                <label className={styles.subTitle2}>
                  <FormattedLabel id="propertyAddress" />
                </label>
              </div>
              <div className={styles.row}>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="lattitude" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("lattitude") ? true : false,
                  }}
                  {...register3("lattitude")}
                  error={!!errors3.lattitude}
                  helperText={errors3?.lattitude ? errors3.lattitude.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="longitude" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("longitude") ? true : false,
                  }}
                  {...register3("longitude")}
                  error={!!errors3.longitude}
                  helperText={errors3?.longitude ? errors3.longitude.message : null}
                />
                <div style={{ width: "250px" }}></div>
                <div style={{ width: "250px" }}></div>
              </div>
              <div className={styles.row}>
                <FormControl
                  disabled={router.query.pageMode == "view" ? true : false}
                  variant="standard"
                  error={!!errors3.circle}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="circle" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="circle"
                      >
                        {titles &&
                          titles.map((obj, i) => (
                            <MenuItem key={i} value={obj.id}>
                              {language == "en" ? obj.titleEn : obj.titleMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="circle"
                    control={control3}
                    defaultValue=""
                  />
                  <FormHelperText>{errors3?.circle ? errors3.circle.message : null}</FormHelperText>
                </FormControl>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="circleNo" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("circleNo") ? true : false,
                  }}
                  {...register3("circleNo")}
                  error={!!errors3.circleNo}
                  helperText={errors3?.circleNo ? errors3.circleNo.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="citySurveyNumber" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("citySurveyNumber") ? true : false,
                  }}
                  {...register3("citySurveyNumber")}
                  error={!!errors3.citySurveyNumber}
                  helperText={errors3?.citySurveyNumber ? errors3.citySurveyNumber.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="flatNo" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("flatNo") ? true : false,
                  }}
                  {...register3("flatNo")}
                  error={!!errors3.flatNo}
                  helperText={errors3?.flatNo ? errors3.flatNo.message : null}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="buildingName" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("buildingName") ? true : false,
                  }}
                  {...register3("buildingName")}
                  error={!!errors3.buildingName}
                  helperText={errors3?.buildingName ? errors3.buildingName.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="societyName" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("societyName") ? true : false,
                  }}
                  {...register3("societyName")}
                  error={!!errors3.societyName}
                  helperText={errors3?.societyName ? errors3.societyName.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="areaName" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("areaName") ? true : false,
                  }}
                  {...register3("areaName")}
                  error={!!errors3.areaName}
                  helperText={errors3?.areaName ? errors3.areaName.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="landmarkName" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("landmarkName") ? true : false,
                  }}
                  {...register3("landmarkName")}
                  error={!!errors3.landmarkName}
                  helperText={errors3?.landmarkName ? errors3.landmarkName.message : null}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="villageName" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("villageName") ? true : false,
                  }}
                  {...register3("villageName")}
                  error={!!errors3.villageName}
                  helperText={errors3?.villageName ? errors3.villageName.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="cityName" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("cityName") ? true : false,
                  }}
                  {...register3("cityName")}
                  error={!!errors3.cityName}
                  helperText={errors3?.cityName ? errors3.cityName.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="pincode" required />}
                  disabled={router.query.pageMode == "view" ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("pincode") ? true : false,
                  }}
                  {...register3("pincode")}
                  error={!!errors3.pincode}
                  helperText={errors3?.pincode ? errors3.pincode.message : null}
                />
                <div style={{ width: "250px" }}></div>
                <div style={{ width: "250px" }}></div>
              </div>
              <div className={styles.row} style={{ justifyContent: "center", marginTop: "6vh" }}>
                <label className={styles.subTitle2}>
                  <FormattedLabel id="postalOrBillingAddress" />
                </label>
              </div>
              {!router.query.id && (
                <div
                  className={styles.row}
                  style={{
                    margin: 0,
                    justifyContent: "left",
                    columnGap: 10,
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    <FormattedLabel id="sameAsPropertyAddress" />
                  </span>
                  <Checkbox checked={sameAddress} onChange={() => setSameAddress(!sameAddress)} />
                </div>
              )}
              <div className={styles.row}>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="lattitude" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("lattitude2") ? true : false,
                  }}
                  {...register3("lattitude2")}
                  error={!!errors3.lattitude2}
                  helperText={errors3?.lattitude2 ? errors3.lattitude2.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="longitude" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("longitude2") ? true : false,
                  }}
                  {...register3("longitude2")}
                  error={!!errors3.longitude2}
                  helperText={errors3?.longitude2 ? errors3.longitude2.message : null}
                />
                <div style={{ width: "250px" }}></div>
                <div style={{ width: "250px" }}></div>
              </div>
              <div className={styles.row}>
                <FormControl
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  variant="standard"
                  error={!!errors3.circle2}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="circle" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="circle2"
                      >
                        {titles &&
                          titles.map((obj, i) => (
                            <MenuItem key={i} value={obj.id}>
                              {language == "en" ? obj.titleEn : obj.titleMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="circle2"
                    control={control3}
                    defaultValue=""
                  />
                  <FormHelperText>{errors3?.circle2 ? errors3.circle2.message : null}</FormHelperText>
                </FormControl>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="circleNo" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("circleNo2") ? true : false,
                  }}
                  {...register3("circleNo2")}
                  error={!!errors3.circleNo2}
                  helperText={errors3?.circleNo2 ? errors3.circleNo2.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="citySurveyNumber" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("citySurveyNumber2") ? true : false,
                  }}
                  {...register3("citySurveyNumber2")}
                  error={!!errors3.citySurveyNumber2}
                  helperText={errors3?.citySurveyNumber2 ? errors3.citySurveyNumber2.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="flatNo" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("flatNo2") ? true : false,
                  }}
                  {...register3("flatNo2")}
                  error={!!errors3.flatNo2}
                  helperText={errors3?.flatNo2 ? errors3.flatNo2.message : null}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="buildingName" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("buildingName2") ? true : false,
                  }}
                  {...register3("buildingName2")}
                  error={!!errors3.buildingName2}
                  helperText={errors3?.buildingName2 ? errors3.buildingName2.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="societyName" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("societyName2") ? true : false,
                  }}
                  {...register3("societyName2")}
                  error={!!errors3.societyName2}
                  helperText={errors3?.societyName2 ? errors3.societyName2.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="areaName" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("areaName2") ? true : false,
                  }}
                  {...register3("areaName2")}
                  error={!!errors3.areaName2}
                  helperText={errors3?.areaName2 ? errors3.areaName2.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="landmarkName" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("landmarkName2") ? true : false,
                  }}
                  {...register3("landmarkName2")}
                  error={!!errors3.landmarkName2}
                  helperText={errors3?.landmarkName2 ? errors3.landmarkName2.message : null}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="villageName" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("villageName2") ? true : false,
                  }}
                  {...register3("villageName2")}
                  error={!!errors3.villageName2}
                  helperText={errors3?.villageName2 ? errors3.villageName2.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="cityName" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("cityName2") ? true : false,
                  }}
                  {...register3("cityName2")}
                  error={!!errors3.cityName2}
                  helperText={errors3?.cityName2 ? errors3.cityName2.message : null}
                />
                <TextField
                  variant="standard"
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="pincode" required />}
                  disabled={router.query.pageMode == "view" || sameAddress ? true : false}
                  InputLabelProps={{
                    shrink: router.query.id || watch3("pincode2") ? true : false,
                  }}
                  {...register3("pincode2")}
                  error={!!errors3.pincode2}
                  helperText={errors3?.pincode2 ? errors3.pincode2.message : null}
                />
                <div style={{ width: "250px" }}></div>
                <div style={{ width: "250px" }}></div>
              </div>
            </form>
          </>
        )}
        {activeStep == 3 && (
          <>
            <form>
              <div className={styles.row} style={{ justifyContent: "center" }}>
                <span className={styles.stepperHeader}>
                  <FormattedLabel id="propertyInformation" />
                </span>
              </div>
            </form>
          </>
        )}
        {activeStep == 4 && (
          <>
            <form>
              <div className={styles.row} style={{ justifyContent: "center" }}>
                <span className={styles.stepperHeader}>
                  <FormattedLabel id="additionalInfo" />
                </span>
              </div>
            </form>
          </>
        )}

        <div className={styles.stepperButtons}>
          <div className={styles.buttonGroup}>
            <Button variant="outlined" color="error" onClick={() => router.push("/propertyTax/dashboard")}>
              <FormattedLabel id="exit" />
            </Button>
            <Button disabled={activeStep == 0 ? true : false} variant="contained" onClick={handleBack}>
              <FormattedLabel id="back" />
            </Button>
          </div>
          <Button variant="contained" onClick={() => submitter(activeStep)}>
            <FormattedLabel id="saveAndNext" />
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
