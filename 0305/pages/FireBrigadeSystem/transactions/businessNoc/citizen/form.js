import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import Toolbar from "@mui/material/Toolbar";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../../containers/schema/fireBrigadeSystem/businessNocTransaction";
import styles from "../../../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../../../URLS/urls";

const Form = (props) => {
  const language = useSelector((state) => state.labels.language);

  // Exit button Routing
  const router = useRouter();

  // Pagination
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const {
    register,
    control,
    handleSubmit,
    methods,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // document upload
  const [letterToApplicant, setLetterToApplicant] = useState(null);
  const [locationMap, setLocationMap] = useState(null);
  const [permissionFromLandOwner, setPermissionFromLandOwner] = useState(null);
  const [refellingCertificate, setRefellingCertificate] = useState(null);
  const [trainFirePersonList, setTrainFirePersonList] = useState(null);
  const [structuralStabilityCertificate, setStructuralStabilityCertificate] =
    useState(null);
  const [electrialInspectorCertificate, setElectrialInspectorCertificate] =
    useState(null);

  // @ First UseEffect
  useEffect(() => {
    if (getValues("letterToApplicant") != null) {
      setLetterToApplicant(getValues("letterToApplicant"));
    }
    if (getValues("locationMap") != null) {
      setLocationMap(getValues("locationMap"));
    }
    if (getValues("permissionFromLandOwner") != null) {
      setPermissionFromLandOwner(getValues("permissionFromLandOwner"));
    }
    if (getValues("refellingCertificate") != null) {
      setRefellingCertificate(getValues("refellingCertificate"));
    }
    if (getValues("trainFirePersonList") != null) {
      setTrainFirePersonList(getValues("trainFirePersonList"));
    }
    if (getValues("structuralStabilityCertificate") != null) {
      setStructuralStabilityCertificate(
        getValues("structuralStabilityCertificate")
      );
    }
    if (getValues("electrialInspectorCertificate") != null) {
      setElectrialInspectorCertificate(
        getValues("electrialInspectorCertificate")
      );
    }
  }, []);

  // @ Second UseEffect
  useEffect(() => {
    setValue("letterToApplicant", letterToApplicant);
    setValue("locationMap", locationMap);
    setValue("permissionFromLandOwner", permissionFromLandOwner);
    setValue("refellingCertificate", refellingCertificate);
    setValue("trainFirePersonList", trainFirePersonList);
    setValue("structuralStabilityCertificate", structuralStabilityCertificate);
    setValue("electrialInspectorCertificate", electrialInspectorCertificate);
  }, [
    letterToApplicant,
    locationMap,
    permissionFromLandOwner,
    refellingCertificate,
    trainFirePersonList,
    structuralStabilityCertificate,
    electrialInspectorCertificate,
  ]);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [vardiTypes, setVardiTypes] = useState();
  const [fireStation, setfireStation] = useState();
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState([]);
  const [showVardiOther, setShowVardiOther] = useState([]);

  // Fetch User From cfc User (Optional)
  const [userLst, setUserLst] = useState([]);
  const [date, setDate] = React.useState(dayjs("2022-04-07"));
  const [documentShow, setDocumentShow] = useState(false);

  useEffect(() => {
    console.log("props.docPriview", props?.props?.docPriview);
    if (props?.props?.docPriview) {
      setDocumentShow(true);
    }
    getUser();
    getVardiTypes();
    getBusinessTypes();
  }, []);

  // get employee from cfc
  const getUser = () => {
    axios.get(`${urls.CFCURL}/master/user/getAll`).then((res) => {
      setUserLst(res?.data);
    });
  };

  const [businessTypes, setBusinessTypes] = useState([]);

  // get Business Types
  const getBusinessTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`)
      .then((res) => {
        console.log("business", res?.data);
        setBusinessTypes(res?.data);
      })
      .catch((err) => console.log(err));
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.BaseURL}/vardiTypeMaster/getVardiTypeMasterData`)
      .then((res) => {
        setVardiTypes(res?.data);
      });
  };

  //   // Save - DB
  //   let finalBody = {
  //     ...fromData,
  //     activeFlag: btnSaveText === "Update" ? null : fromData.activeFlag,
  //   };
  //   if (btnSaveText === "Save") {
  //     const tempData = axios
  //       .post(`${urls.FbsURL}/trnBussinessNOC/save`, finalBody)
  //       .then((res) => {
  //         if (res.status == 200) {
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //           router.back();
  //         }
  //       });
  //   }
  //   // Update Data Based On ID
  //   else if (btnSaveText === "Update") {
  //     axios
  //       .post(`${urls.FbsURL}/trnBussinessNOC/save`, finalBody)
  //       .then((res) => {
  //         console.log("res", res);
  //         if (res.status == 200) {
  //           fromData.id
  //             ? sweetAlert(
  //                 "Updated!",
  //                 "Record Updated successfully !",
  //                 "success"
  //               )
  //             : sweetAlert("Saved!", "Record Saved successfully !", "success");

  //           // setButtonInputState(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //           setIsOpenCollapse(false);
  //           router.back();
  //         }
  //       });
  //   }
  // };

  const onSubmitForm = (fromData) => {
    const finalBody = {
      // role: "DOCUMENT_VERIFICATION",
      // desg: "DEPT_CLERK",
      policeComissionerLetterDate: moment(
        fromData.policeComissionerLetterDate
      ).format("YYYY-MM-DD"),
      ...fromData,
      // dateOfApplication: moment(fromData.dateOfApplication).format(
      //   "YYYY-MM-DD"
      // ),
      layOutPlan: fromData.layOutPlan == "Is Not Included" ? false : true,
      sittingArrangement:
        fromData.sittingArrangement == "Fixed sitting" ? true : false,
    };
    console.log("Form Data ", finalBody);
    axios.post(`${urls.FbsURL}/trnBussinessNOC/save`, finalBody).then((res) => {
      if (res.status == 200) {
        fromData.id
          ? sweetAlert("Application Updated")
          : swal({
              title: "Application Created Successfully",
              text: "application send to the sub fire officer",
              icon: "success",
              button: "Ok",
            });
        router.back();
      }
    });
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("hello", router.query);
      setBtnSaveText("Update");
      reset(router.query);
    }
  }, []);

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    applicantName: "",
    applicantNameMr: "",
    applicantMiddleName: "",
    nOCFor: "",
    applicantMiddleNameMr: "",
    applicantLastName: "",
    applicantLastNameMr: "",
    applicantAddress: "",
    applicantAddressMr: "",
    mobileNo: "",
    nocNo: "",
    sanctionDate: "",
    nocEndDate: "",
    bussinessAddress: "",
    bussinessAddressMr: "",
    applicationDate: "",
    typeOfNoc: "",
    typeOfBusiness: "",
    typeOfBusinessMr: "",
    documentName: "",
    remark: "",
    remarkMr: "",
    activeFlag: "",
    approveDate: "",
    fromDate: "",
    toDate: "",
    attachment: "",
    renewalDate: "",
    newFromDate: "",
    newToDate: "",
    issuedDate: "",
    paymentReceived: "",
    siteAddress: "",
    emailId: "",
    firmName: "",
    firmNameMr: "",
    lattitude: "",
    longitude: "",
    role: "",
    applicationStatus: "",
    desg: "",
    paymentDetails: "",
    rejectRemark: "",
    loi: "",
    rejected: "",
    approveRemark: "",
    siteVisit: "",
    businessId: "",
    nocName: "",
    officeContactNo: "",
    onsitePersonMobileNo: "",
    officeMailId: "",
    forTheProgram: "",
    venue: "",
    policeComissionerLetterDate: "",
    letterNoFromPoliceCommisioner: "",
    landOwnersConsent: "",
    nameOfOrganizer: "",
    addressOfOrganizer: "",
    organizersContactNo: "",
    addressOfTempararyStructureLocated: "",
    finalPlotNo: "",
    revenueSurveyNoRs: "",
    tikaNo: "",
    buildingLocation: "",
    townPlanningNo: "",
    blockNo: "",
    purposeOfStructure: "",
    oPNo: "",
    approxNumberOfPersonsToBeGathered: "",
    numberOfExit: "",
    hazardousPerformance: "",
    layOutPlan: "",
    requiredNocForPartOfArea: "",
    sittingArrangement: "",
    shamiyanaLength: "",
    shamiyanaWidth: "",
    hightOfArchGate: "",
    widthOfArchGate: "",
    approchedWaytoTheVenueOfFireBrigadeVehicles: "",
    widthOfInternalRoad: "",
    theNumberOfFightingEquipment: "",
    refellingCertificateAttachedOrNot: "",
    stageHeight: "",
    stageWidth: "",
    usageOfInflamable: "",
    security: "",
    parkingArrangement: "",
    exitOrNoSmokingSignBoard: "",
    typesOfWiringOpenClose: "",
    arrangementOfLightingArrester: "",
    communicationArrangement: "",
    whetherStandByFire: "",
    letterToApplicant: "",
    locationMap: "",
    permissionFromLandOwner: "",
    refellingCertificate: "",
    trainFirePersonList: "",
    structuralStabilityCertificate: "",
    electrialInspectorCertificate: "",
    attachments: "",
    nOCFor: "",
    opno: "",
  };

  let documentsUpload = null;

  let appName = "FBS";
  let serviceName = "M-MBR";
  let applicationFrom = "Web";

  useEffect(() => {
    reset(props?.props);
    console.log("props45", props);
  }, [props]);

  // View
  return (
    <>
      <Box
        style={{
          margin: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname: "/FireBrigadeSystem/transactions/businessNoc",
                    })
                  }
                />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "rgb(7 110 230 / 91%)",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                {btnSaveText == "Update" ? (
                  <FormattedLabel id="updateBusinessNoc" />
                ) : (
                  <FormattedLabel id="addBusinessNoc" />
                )}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="applicantDetails" />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantName" />}
                      variant="standard"
                      {...register("applicantName")}
                      error={!!errors.applicantName}
                      helperText={
                        errors?.applicantName
                          ? errors.applicantName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantMiddleName" />}
                      variant="standard"
                      {...register("applicantMiddleName")}
                      error={!!errors.applicantMiddleName}
                      helperText={
                        errors?.applicantMiddleName
                          ? errors.applicantMiddleName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantLastName" />}
                      variant="standard"
                      {...register("applicantLastName")}
                      error={!!errors.applicantLastName}
                      helperText={
                        errors?.applicantLastName
                          ? errors.applicantLastName.message
                          : null
                      }
                    />
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantNameMr" />}
                      variant="standard"
                      {...register("applicantNameMr")}
                      error={!!errors.applicantNameMr}
                      helperText={
                        errors?.applicantNameMr
                          ? errors.applicantNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantMiddleNameMr" />}
                      variant="standard"
                      {...register("applicantMiddleNameMr")}
                      error={!!errors.applicantMiddleNameMr}
                      helperText={
                        errors?.applicantMiddleNameMr
                          ? errors.applicantMiddleNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantLastNameMr" />}
                      variant="standard"
                      {...register("applicantLastNameMr")}
                      error={!!errors.applicantLastNameMr}
                      helperText={
                        errors?.applicantLastNameMr
                          ? errors.applicantLastNameMr.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantAddress" />}
                      variant="standard"
                      {...register("applicantAddress")}
                      error={!!errors.applicantAddress}
                      helperText={
                        errors?.applicantAddress
                          ? errors.applicantAddress.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicantAddress" />}
                      variant="standard"
                      {...register("applicantAddressMr")}
                      error={!!errors.applicantAddressMr}
                      helperText={
                        errors?.applicantAddressMr
                          ? errors.applicantAddressMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="mobileNo" />}
                      variant="standard"
                      {...register("mobileNo")}
                      error={!!errors.mobileNo}
                      helperText={
                        errors?.mobileNo ? errors.mobileNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="bussinessAddress" />}
                      variant="standard"
                      {...register("bussinessAddress")}
                      error={!!errors.bussinessAddress}
                      helperText={
                        errors?.bussinessAddress
                          ? errors.bussinessAddress.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="bussinessAddressMr" />}
                      variant="standard"
                      {...register("bussinessAddressMr")}
                      error={!!errors.bussinessAddressMr}
                      helperText={
                        errors?.bussinessAddressMr
                          ? errors.bussinessAddressMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="officeContactNo" />}
                      label="Office Contact Number"
                      variant="standard"
                      {...register("officeContactNo")}
                      error={!!errors.officeContactNo}
                      helperText={
                        errors?.officeContactNo
                          ? errors.officeContactNo.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="officeMailId" />}
                      label="Office Mail Id"
                      variant="standard"
                      {...register("officeMailId")}
                      error={!!errors.officeMailId}
                      helperText={
                        errors?.officeMailId
                          ? errors.officeMailId.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={
                      //   <FormattedLabel id="workingOnSidePersonMobileNo" />
                      // }
                      label="Working On Site Person Mobile Number"
                      variant="standard"
                      {...register("workingOnSidePersonMobileNo")}
                      error={!!errors.workingOnSidePersonMobileNo}
                      helperText={
                        errors?.workingOnSidePersonMobileNo
                          ? errors.workingOnSidePersonMobileNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      variant="standard"
                      sx={{ width: "80%" }}
                      error={!!errors.typeOfBussiness}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="typeOfBussiness" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="List"
                          >
                            {businessTypes &&
                              businessTypes.map((businessType, index) => (
                                <MenuItem key={index} value={businessType.id}>
                                  {language == "en"
                                    ? businessType.typeOfBusiness
                                    : businessType.typeOfBusinessMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="typeOfBusiness"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.typeOfBussiness
                          ? errors.typeOfBussiness.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label="Firm Name (In English)"
                      variant="standard"
                      {...register("firmName")}
                      error={!!errors.firmName}
                      helperText={
                        errors?.firmName ? errors.firmName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label="Firm Name (In Marathi)"
                      variant="standard"
                      {...register("firmNameMr")}
                      error={!!errors.firmNameMr}
                      helperText={
                        errors?.firmNameMr ? errors.firmNameMr.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label="Latitude"
                      variant="standard"
                      {...register("lattitude")}
                      error={!!errors.lattitude}
                      helperText={
                        errors?.lattitude ? errors.lattitude.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label="Longitude"
                      variant="standard"
                      {...register("longitude")}
                      error={!!errors.longitude}
                      helperText={
                        errors?.longitude ? errors.longitude.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={2} className={styles.feildres}>
                    <Button variant="contained">Locate</Button>
                  </Grid>
                  <Grid item xs={2} className={styles.feildres}></Grid>
                  {/* <Grid item xs={11} className={styles.feildres}>
                    <TextField
sx={{ width: "80%" }}
                      multiline
                      fullWidth
                      maxRows={4}
                      id="standard-basic"
                      label={<FormattedLabel id="remark" />}
                      variant="standard"
                      {...register("remark")}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
                    />
                  </Grid> */}
                </Grid>
                <br />
                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="formDetails" />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="For the Program"
                      variant="standard"
                      {...register("forTheProgram")}
                      error={!!errors.forTheProgram}
                      helperText={
                        errors?.forTheProgram
                          ? errors.forTheProgram.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Venue"
                      variant="standard"
                      {...register("venue")}
                      error={!!errors.venue}
                      helperText={errors?.venue ? errors.venue.message : null}
                    />
                  </Grid>
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      style={{ marginTop: 10 }}
                      sx={{ width: "65%" }}
                    >
                      <Controller
                        control={control}
                        name="policeComissionerLetterDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              InputLabelProps={{ shrink: true }}
                              inputFormat="DD/MM/YYYY"
                              label="Police Comissioner Letter Date"
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
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
                    
                    </FormControl>
                  </Grid> */}
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ width: "80%" }}
                      style={{ marginTop: 10 }}
                      error={!!errors.dateAndTimeOfVardi}
                    >
                      <Controller
                        control={control}
                        name="policeComissionerLetterDate"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disableFuture
                              label="Police Commisioner Letter Date"
                              openTo="year"
                              views={["year", "month", "day"]}
                              value={date}
                              onChange={(newValue) => {
                                setDate(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.dateAndTimeOfVardi
                          ? errors.dateAndTimeOfVardi.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Letter no from the Police commisioner"
                      variant="standard"
                      {...register("letterNoFromThePoliceCommisioner")}
                      error={!!errors.letterNoFromThePoliceCommisioner}
                      helperText={
                        errors?.letterNoFromThePoliceCommisioner
                          ? errors.letterNoFromThePoliceCommisioner.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Land Owner's Consent"
                      variant="standard"
                      {...register("venue")}
                      error={!!errors.venue}
                      helperText={errors?.venue ? errors.venue.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Name Of Organizer"
                      variant="standard"
                      {...register("nameOfOrganizer")}
                      error={!!errors.nameOfOrganizer}
                      helperText={
                        errors?.nameOfOrganizer
                          ? errors.nameOfOrganizer.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="The address of the organizer"
                      variant="standard"
                      {...register("addressOfOrganizer")}
                      error={!!errors.addressOfOrganizer}
                      helperText={
                        errors?.addressOfOrganizer
                          ? errors.addressOfOrganizer.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Organizer's Contact No."
                      variant="standard"
                      {...register("organizersContactNo")}
                      error={!!errors.organizersContactNo}
                      helperText={
                        errors?.organizersContactNo
                          ? errors.organizersContactNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="The address of Temperary Structure Located"
                      variant="standard"
                      {...register("addressOfTempararyStructureLocated")}
                      error={!!errors.addressOfTempararyStructureLocated}
                      helperText={
                        errors?.addressOfTempararyStructureLocated
                          ? errors.addressOfTempararyStructureLocated.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Final Plot No - F.P"
                      variant="standard"
                      {...register("finalPlotNo")}
                      error={!!errors.finalPlotNo}
                      helperText={
                        errors?.finalPlotNo ? errors.finalPlotNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Revenue Survey No - R.S"
                      variant="standard"
                      {...register("revenueSurveyNoRs")}
                      error={!!errors.revenueSurveyNoRs}
                      helperText={
                        errors?.revenueSurveyNoRs
                          ? errors.revenueSurveyNoRs.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Tika No"
                      variant="standard"
                      {...register("tikaNo")}
                      error={!!errors.tikaNo}
                      helperText={errors?.tikaNo ? errors.tikaNo.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Building Location"
                      variant="standard"
                      {...register("buildingLocation")}
                      error={!!errors.buildingLocation}
                      helperText={
                        errors?.buildingLocation
                          ? errors.buildingLocation.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Town Planning No"
                      variant="standard"
                      {...register("townPlanningNo")}
                      error={!!errors.townPlanningNo}
                      helperText={
                        errors?.townPlanningNo
                          ? errors.townPlanningNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Block No"
                      variant="standard"
                      {...register("blockNo")}
                      error={!!errors.blockNo}
                      helperText={
                        errors?.blockNo ? errors.blockNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Purpose Of Structure"
                      variant="standard"
                      {...register("purposeOfStructure")}
                      error={!!errors.purposeOfStructure}
                      helperText={
                        errors?.purposeOfStructure
                          ? errors.purposeOfStructure.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="O.P.No"
                      variant="standard"
                      {...register("oPNo")}
                      error={!!errors.oPNo}
                      helperText={errors?.oPNo ? errors.oPNo.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Approx Number Of Persons to be gathered"
                      variant="standard"
                      {...register("approxNumberOfPersonsToBeGathered")}
                      error={!!errors.approxNumberOfPersonsToBeGathered}
                      helperText={
                        errors?.approxNumberOfPersonsToBeGathered
                          ? errors.approxNumberOfPersonsToBeGathered.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Number Of Exit"
                      variant="standard"
                      {...register("numberOfExit")}
                      error={!!errors.numberOfExit}
                      helperText={
                        errors?.numberOfExit
                          ? errors.numberOfExit.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="If there is any hazardous performance in the stall / ground, then Details of its"
                      variant="standard"
                      {...register("hazardousPerformance")}
                      error={!!errors.hazardousPerformance}
                      helperText={
                        errors?.hazardousPerformance
                          ? errors.hazardousPerformance.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl flexDirection="row">
                      <FormLabel
                        sx={{ width: "230px" }}
                        id="demo-row-radio-buttons-group-label"
                      >
                        Layout Plan
                      </FormLabel>

                      <Controller
                        name="layOutPlan"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value="Is Included"
                              control={<Radio size="small" />}
                              // label={<FormattedLabel id="yes" />}
                              label="Yes"
                              error={!!errors.layOutPlan}
                              helperText={
                                errors?.layOutPlan
                                  ? errors.layOutPlan.message
                                  : null
                              }
                            />
                            <FormControlLabel
                              value="Is Not Included"
                              control={<Radio size="small" />}
                              // label={<FormattedLabel id="no" />}
                              label="No"
                              error={!!errors.layOutPlan}
                              helperText={
                                errors?.layOutPlan
                                  ? errors.layOutPlan.message
                                  : null
                              }
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Require NOC for Part of Area"
                      variant="standard"
                      {...register("requiredNocForPartOfArea")}
                      error={!!errors.requiredNocForPartOfArea}
                      helperText={
                        errors?.requiredNocForPartOfArea
                          ? errors.requiredNocForPartOfArea.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <FormControl>
                      <FormLabel id="demo-radio-buttons-group-label">
                        Sitting Arrangement
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        // defaultValue="female"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="fixed"
                          control={<Radio />}
                          label="Fixed sitting"
                        />
                        <FormControlLabel
                          value="temp"
                          control={<Radio />}
                          label="Temp Sitting"
                        />
                      </RadioGroup>
                    </FormControl> */}
                    <FormControl flexDirection="row">
                      <FormLabel
                        sx={{ width: "230px" }}
                        id="demo-row-radio-buttons-group-label"
                      >
                        Sitting Arrangement
                      </FormLabel>

                      <Controller
                        name="sittingArrangement"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value="Fixed sitting"
                              control={<Radio size="small" />}
                              // label={<FormattedLabel id="yes" />}
                              label="yes"
                              error={!!errors.sittingArrangement}
                              helperText={
                                errors?.sittingArrangement
                                  ? errors.sittingArrangement.message
                                  : null
                              }
                            />
                            <FormControlLabel
                              value="Temp sitting"
                              control={<Radio size="small" />}
                              label="No"
                              error={!!errors.sittingArrangement}
                              helperText={
                                errors?.sittingArrangement
                                  ? errors.sittingArrangement.message
                                  : null
                              }
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Shamiyana Length (meters)"
                      variant="standard"
                      {...register("shamiyanaLength")}
                      error={!!errors.shamiyanaLength}
                      helperText={
                        errors?.shamiyanaLength
                          ? errors.shamiyanaLength.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Shamiyana Width (meters)"
                      variant="standard"
                      {...register("shamiyanaWidth")}
                      error={!!errors.shamiyanaWidth}
                      helperText={
                        errors?.shamiyanaWidth
                          ? errors.shamiyanaWidth.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Height of Arch Gate (meters)"
                      variant="standard"
                      {...register("hightOfArchGate")}
                      error={!!errors.hightOfArchGate}
                      helperText={
                        errors?.hightOfArchGate
                          ? errors.hightOfArchGate.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Width of Arch Gate (m)"
                      variant="standard"
                      {...register("widthOfArchGate")}
                      error={!!errors.widthOfArchGate}
                      helperText={
                        errors?.widthOfArchGate
                          ? errors.widthOfArchGate.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Approched Way to The Venue Of Fire Brigade Vehicles"
                      variant="standard"
                      {...register(
                        "approchedWaytoTheVenueOfFireBrigadeVehicles"
                      )}
                      error={
                        !!errors.approchedWaytoTheVenueOfFireBrigadeVehicles
                      }
                      helperText={
                        errors?.approchedWaytoTheVenueOfFireBrigadeVehicles
                          ? errors.approchedWaytoTheVenueOfFireBrigadeVehicles
                              .message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Width Of Internal Road"
                      variant="standard"
                      {...register("widthOfInternalRoad")}
                      error={!!errors.widthOfInternalRoad}
                      helperText={
                        errors?.widthOfInternalRoad
                          ? errors.widthOfInternalRoad.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="The Number Of Fighting Equipment"
                      variant="standard"
                      {...register("theNumberOfFightingEquipment")}
                      error={!!errors.theNumberOfFightingEquipment}
                      helperText={
                        errors?.theNumberOfFightingEquipment
                          ? errors.theNumberOfFightingEquipment.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Refelling Certificate Attached Or Not"
                      variant="standard"
                      {...register("refellingCertificateAttachedOrNot")}
                      error={!!errors.refellingCertificateAttachedOrNot}
                      helperText={
                        errors?.refellingCertificateAttachedOrNot
                          ? errors.refellingCertificateAttachedOrNot.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Stage Height"
                      variant="standard"
                      {...register("stageHeight")}
                      error={!!errors.stageHeight}
                      helperText={
                        errors?.stageHeight ? errors.stageHeight.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Stage Width"
                      variant="standard"
                      {...register("stageWidth")}
                      error={!!errors.stageWidth}
                      helperText={
                        errors?.stageWidth ? errors.stageWidth.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Usage of dry grass / Cotton or the inflarable"
                      variant="standard"
                      {...register("usageOfInflamable")}
                      error={!!errors.usageOfInflamable}
                      helperText={
                        errors?.usageOfInflamable
                          ? errors.usageOfInflamable.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Security Arrangement"
                      variant="standard"
                      {...register("security")}
                      error={!!errors.security}
                      helperText={
                        errors?.security ? errors.security.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Parking Arrangement"
                      variant="standard"
                      {...register("parkingArrangement")}
                      error={!!errors.parkingArrangement}
                      helperText={
                        errors?.parkingArrangement
                          ? errors.parkingArrangement.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Exit Or No Smoking Sign Board"
                      variant="standard"
                      {...register("exitOrNoSmokingSignBoard")}
                      error={!!errors.exitOrNoSmokingSignBoard}
                      helperText={
                        errors?.exitOrNoSmokingSignBoard
                          ? errors.exitOrNoSmokingSignBoard.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label={<FormattedLabel id="mobileNo" />}
                      label="Types Of Wiring - Open | Close"
                      variant="standard"
                      {...register("typesOfWiringOpenClose")}
                      error={!!errors.typesOfWiringOpenClose}
                      helperText={
                        errors?.typesOfWiringOpenClose
                          ? errors.typesOfWiringOpenClose.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      fullWidth
                      variant="standard"
                      sx={{ width: "80%" }}
                      error={
                        !!errors.structuralStabilityCertificateFloorWiseAlsoApprovedByComplianceAuthority
                      }
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {
                          // <FormattedLabel id="structuralStabilityCertificateFloorWiseAlsoApprovedByComplianceAuthority" />
                          "Arrangement Of Lighting Arrester"
                        }
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select-Service Name"
                          >
                            <MenuItem value={1}>Yes</MenuItem>
                            <MenuItem value={2}>No</MenuItem>
                          </Select>
                        )}
                        name="arrangementOfLightingArrester"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.arrangementOfLightingArrester
                          ? errors.arrangementOfLightingArrester.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      fullWidth
                      variant="standard"
                      sx={{ width: "80%" }}
                      error={
                        !!errors.structuralStabilityCertificateFloorWiseAlsoApprovedByComplianceAuthority
                      }
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {
                          // <FormattedLabel id="structuralStabilityCertificateFloorWiseAlsoApprovedByComplianceAuthority" />
                          "Communication Arrangement"
                        }
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select-Service Name"
                          >
                            <MenuItem value={32}>Yes</MenuItem>
                            <MenuItem value={31}>No</MenuItem>
                          </Select>
                        )}
                        name="communicationArrangement"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.communicationArrangement
                          ? errors.communicationArrangement.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      fullWidth
                      variant="standard"
                      sx={{ width: "80%" }}
                      error={
                        !!errors.structuralStabilityCertificateFloorWiseAlsoApprovedByComplianceAuthority
                      }
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {
                          // <FormattedLabel id="fireDrawingFloorWiseAlsoApprovedByComplianceAuthority" />
                          "Whether Stand By Fire"
                        }
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select-Service Name"
                          >
                            <MenuItem value={10}>Yes</MenuItem>
                            <MenuItem value={20}>No</MenuItem>
                          </Select>
                        )}
                        name="whetherStandByFire"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.whetherStandByFire
                          ? errors.whetherStandByFire.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                {!documentShow && (
                  <>
                    <br />
                    <br />
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {<FormattedLabel id="documentUpload" />}
                      </Box>
                    </Box>
                    <br />
                    <br />
                    <Grid
                      container
                      sx={{
                        marginTop: 5,
                        marginBottom: 5,
                        paddingLeft: "50px",
                        align: "center",
                      }}
                    >
                      {/* 1 */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Typography variant="subtitle2">
                          {/* <strong>{<FormattedLabel id="adharCard" />}</strong> */}
                          Letter to Applicant by Police inspector, Licence
                          Branch, Vadodra City
                        </Typography>
                        <div>
                          <UploadButton
                            appName="FBS"
                            serviceName="BusinessNoc"
                            filePath={setLetterToApplicant}
                            fileName={letterToApplicant}
                            // fileData={aadhaarCardPhotoData}
                          />
                        </div>
                      </Grid>

                      {/* 2 */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Typography variant="subtitle2">
                          {/* <strong>{<FormattedLabel id="panCard" />}</strong> */}
                          Location Map / Internal Drawing with Entry or Exit
                          with measurement
                        </Typography>
                        <UploadButton
                          appName="FBS"
                          serviceName="BusinessNoc"
                          filePath={setLocationMap}
                          fileName={locationMap}
                        />
                      </Grid>

                      {/* 3 */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Typography variant="subtitle2">
                          {/* <strong>{<FormattedLabel id="rationCard" />}</strong> */}
                          Permission From Land Owner
                        </Typography>
                        <UploadButton
                          appName="FBS"
                          serviceName="BusinessNoc"
                          filePath={setPermissionFromLandOwner}
                          fileName={permissionFromLandOwner}
                        />
                      </Grid>

                      {/* 4 */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Typography variant="subtitle2">
                          {/* <strong>{<FormattedLabel id="rationCard" />}</strong> */}
                          Refelling Certificate of Fire Fightning equipments
                        </Typography>
                        <UploadButton
                          appName="FBS"
                          serviceName="BusinessNoc"
                          filePath={setRefellingCertificate}
                          fileName={refellingCertificate}
                        />
                      </Grid>

                      {/* 5 */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={2}
                        sx={{ marginTop: 4 }}
                      >
                        <Typography variant="subtitle2">
                          {/* <strong>{<FormattedLabel id="otherDocumentPhoto" />}</strong> */}
                          {/* Refeling Certificate of Fire Fightning equipments */}
                          Train Fire Persion List with their Name & Mobile
                        </Typography>
                        <UploadButton
                          appName="FBS"
                          serviceName="BusinessNoc"
                          filePath={setTrainFirePersonList}
                          fileName={trainFirePersonList}
                        />
                      </Grid>

                      {/* 6 */}
                      <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        lg={2}
                        xl={1}
                        sx={{ marginTop: 4 }}
                      >
                        <Typography variant="subtitle2">
                          {/* <strong> */}
                          {/* {<FormattedLabel id="affidaviteOnRS100StampAttachement" />} */}
                          {/* </strong> */}
                          Structural Stability Certificate From PWD Department
                        </Typography>
                        <UploadButton
                          appName="FBS"
                          serviceName="BusinessNoc"
                          filePath={setStructuralStabilityCertificate}
                          fileName={structuralStabilityCertificate}
                        />
                      </Grid>

                      {/* 7 */}
                      <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        lg={2}
                        xl={1}
                        sx={{ marginTop: 4 }}
                      >
                        <Typography variant="subtitle2">
                          {/* <strong> */}
                          {/* {<FormattedLabel id="affidaviteOnRS100StampAttachement" />} */}
                          {/* </strong> */}
                          Electrical Inspector Certificate
                        </Typography>
                        <UploadButton
                          appName="FBS"
                          serviceName="BusinessNoc"
                          filePath={setElectrialInspectorCertificate}
                          fileName={electrialInspectorCertificate}
                        />
                      </Grid>
                    </Grid>

                    <br />
                    <br />
                    <br />
                    {/* Fetch User From cfc User (Optional)*/}
                    {/* <div>
                      <FormControl
                        variant="standard"
                             sx={{ minWidth: "70%" }}
                        error={!!errors.typeOfVardiId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="slipHandedOverTo" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="slipHandedOverTo" />}
                            >
                              {userLst &&
                                userLst.map((user, index) => (
                                  <MenuItem key={index} value={user.firstName}>
                                    {user.firstName +
                                      " " +
                                      (typeof user.middleName === "string"
                                        ? user.middleName + " "
                                        : " ") +
                                      user.lastName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="slipHandedOverTo"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.slipHandedOverTo
                            ? errors.slipHandedOverTo.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div> */}

                    <Grid container className={styles.feildres} spacing={2}>
                      <Grid item>
                        <Button
                          type="submit"
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText == "Update" ? (
                            "Update"
                          ) : (
                            <FormattedLabel id="save" />
                          )}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() =>
                            router.push({
                              pathname:
                                "/FireBrigadeSystem/transactions/businessNoc",
                            })
                          }
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </form>
            </FormProvider>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default Form;
