import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import UploadButton from "../../../../components/streetVendorManagementSystem/fileUpload/UploadButtonHawker";
import styles from "../../../../components/streetVendorManagementSystem/styles/view.module.css";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import BasicApplicationDetails from "../../../../components/streetVendorManagementSystem/components/BasicApplicationDetails";
import HawkerDetails from "../../../../components/streetVendorManagementSystem/components/HawkerDetails";
import AddressOfHawker from "../../../../components/streetVendorManagementSystem/components/AddressOfHawker";
import AadharAuthentication from "../../../../components/streetVendorManagementSystem/components/AadharAuthentication";
import PropertyAndWaterTaxes from "../../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes";
import AdditionalDetails from "../../../../components/streetVendorManagementSystem/components/AdditionalDetails";

// func
const SiteVisit = (props) => {
  const router = useRouter();

  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;

  // File Upload
  const [siteVisitPhoto1, setSiteVisitPhoto1] = useState(null);
  const [siteVisitPhoto2, setSiteVisitPhoto2] = useState(null);
  const [siteVisitPhoto3, setSiteVisitPhoto3] = useState(null);
  const [siteVisitPhoto4, setSiteVisitPhoto4] = useState(null);
  const [siteVisitPhoto5, setSiteVisitPhoto5] = useState(null);
  const [streetVendorPhoto, setStreetVendorPhoto] = useState(null);
  const [streetVendorThumb1, setStreetVendorThumb1] = useState(null);
  const [streetVendorThumb2, setStreetVendorThumb2] = useState(null);
  const [loadderState, setLoadderState] = useState(false);
  const [shrinkTemp, setShrinkTemp] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] = useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();

  // issuance
  const getIssuanceOfHawkerLicsenseData = () => {
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          reset(r?.data);
          setValue("disabledFieldInputState", true);
          setShrinkTemp(true);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch((errors) => {
        setLoadderState(false);
        <Failed />;
      });
  };

   // renewal
  const getRenewalOfHawkerLicenseData = () => {
    axios
      .get(`${urls.HMSURL}/transaction/renewalOfHawkerLicense/getById?id=${renewalOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          reset(r?.data);
          setValue("disabledFieldInputState", true);
          setShrinkTemp(true);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch((errors) => {
        setLoadderState(false);
        <Failed />;
      });
  };

     // cancellation
  const getCancellationOfHawkerLicenseData = () => {
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          reset(r?.data);
          setValue("disabledFieldInputState", true);
          setShrinkTemp(true);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch((errors) => {
        setLoadderState(false);
        <Failed />;
      });
  };

 // transfer
  const getTransferOfHawkerLicenseData = () => {
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          reset(r?.data);
          setValue("disabledFieldInputState", true);
          setShrinkTemp(true);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch((errors) => {
        setLoadderState(false);
        <Failed />;
      });
  };




  // OnSubmit Form
  const handleNext = (formData) => {
   setLoadderState(true);
    console.log("FromData", formData); 

    let siteVisit = null;
    let finalBodyForApi= null;
    const url = null;

      // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null && 
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
       siteVisit = {
      ...formData,
      issuanceOfHawkerLicenseId,
    };

     finalBodyForApi = {
      id: issuanceOfHawkerLicenseId,
      role: "SITE_VISIT",
      appointmentType: "S",
      siteVisit: [{ ...siteVisit }],
    };
      url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
    }

    // renewal
  else if (
      localStorage.getItem("renewalOfHawkerLicenseId") != null &&
       localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
        localStorage.getItem("renewalOfHawkerLicenseId") != undefined
    ) {
       siteVisit = {
      ...formData,
      renewalOfHawkerLicenseId,
    };

     finalBodyForApi = {
      id: renewalOfHawkerLicenseId,
      role: "SITE_VISIT",
      appointmentType: "S",
      siteVisit: [{ ...siteVisit }],
    };
       url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/saveRenewalOfHawkerLicenseApprove`;
    }

    // cancelltion
   else if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
       localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
       siteVisit = {
      ...formData,
      cancellationOfHawkerLicenseId,
    };

     finalBodyForApi = {
      id: cancellationOfHawkerLicenseId,
      role: "SITE_VISIT",
      appointmentType: "S",
      siteVisit: [{ ...siteVisit }],
    };
       url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
    }


    // transfer
   else if (
      localStorage.getItem("transferOfHawkerLicenseId") != null &&
      localStorage.getItem("transferOfHawkerLicenseId") != "" && 
      localStorage.getItem("transferOfHawkerLicenseId") != undefined
    ) {
       siteVisit = {
      ...formData,
      transferOfHawkerLicenseId,
    };

     finalBodyForApi = {
      id: transferOfHawkerLicenseId,
      role: "SITE_VISIT",
      appointmentType: "S",
      siteVisit: [{ ...siteVisit }],
    };
       url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
    }

    console.log("siteVisitFinalBody ", finalBodyForApi,url);

    axios
      .post(url, finalBodyForApi)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          formData.id
            ? sweetAlert("Site Visit !", "site visit successfully conducted !", "success")
            : sweetAlert("Site Visit !", "site visit successfully conducted!", "success");
          router.push("/streetVendorManagementSystem/dashboards");
          setLoadderState(false);
        } else {
          <Failed />;
        }
      })
      .catch(() => {
        setLoadderState(false);
        <Failed />;
      });
    setLoadderState(false);
  };

  
  // idSet
  useEffect(() => {
    setLoadderState(true);
    setValue("disabledFieldInputState", true);

    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null && 
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      setIssuanceOfHawkerLicenseId(localStorage.getItem("issuanceOfHawkerLicenseId"));
    }

    // renewal
  else if (
      localStorage.getItem("renewalOfHawkerLicenseId") != null &&
       localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
        localStorage.getItem("renewalOfHawkerLicenseId") != undefined
    ) {
      setRenewalOfHawkerLicenseId(localStorage.getItem("renewalOfHawkerLicenseId"));
    }

    // cancelltion
   else if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
       localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
      setCancellationOfHawkerLicenseId(localStorage.getItem("cancellationOfHawkerLicenseId"));
    }


    // transfer
   else if (
      localStorage.getItem("transferOfHawkerLicenseId") != null &&
      localStorage.getItem("transferOfHawkerLicenseId") != "" && 
      localStorage.getItem("transferOfHawkerLicenseId") != undefined
    ) {
      setTransferOfHawkerLicenseId(localStorage.getItem("transferOfHawkerLicenseId"));
    }



    setLoadderState(false);
  }, []);

  useEffect(() => {
    console.log("disabledInputStae", watch("disabledFieldInputState"));
  }, [watch("disabledFieldInputState")]);

 // api
  useEffect(() => {

     // issuance
    if (issuanceOfHawkerLicenseId != null && issuanceOfHawkerLicenseId != undefined && issuanceOfHawkerLicenseId != ""  ) {
      getIssuanceOfHawkerLicsenseData();
    }
    // renewal
    else if (renewalOfHawkerLicenseId != null && renewalOfHawkerLicenseId != undefined && renewalOfHawkerLicenseId != "") {
      getRenewalOfHawkerLicenseData();
    }
    // cancellation
    else if (cancellationOfHawkerLicenseId != null && cancellationOfHawkerLicenseId != undefined && cancellationOfHawkerLicenseId != "") {
      getCancellationOfHawkerLicenseData();
    }
      // transfer
     else if (transferOfHawkerLicenseId != null && transferOfHawkerLicenseId != undefined  && transferOfHawkerLicenseId != "") {
      getTransferOfHawkerLicenseData();
    }

  }, [issuanceOfHawkerLicenseId,renewalOfHawkerLicenseId,cancellationOfHawkerLicenseId,transferOfHawkerLicenseId]);


  useEffect(() => {
    setValue("siteVisitPhoto1", getValues("siteVisitPhoto1"));
    setValue("siteVisitPhoto2", getValues("siteVisitPhoto2"));
    setValue("siteVisitPhoto3", getValues("siteVisitPhoto3"));
    setValue("siteVisitPhoto4", getValues("siteVisitPhoto4"));
    setValue("siteVisitPhoto5", getValues("siteVisitPhoto5"));
    setValue("streetVendorPhoto", getValues("streetVendorPhoto"));
    setValue("streetVendorThumb1", getValues("streetVendorThumb1"));
    setValue("streetVendorThumb2", getValues("streetVendorThumb2"));
  }, []);

  useEffect(() => {
    setValue("siteVisitPhoto1", siteVisitPhoto1);
    setValue("siteVisitPhoto2", siteVisitPhoto2);
    setValue("siteVisitPhoto3", siteVisitPhoto3);
    setValue("siteVisitPhoto4", siteVisitPhoto4);
    setValue("siteVisitPhoto5", siteVisitPhoto5);
    setValue("streetVendorPhoto", streetVendorPhoto);
    setValue("streetVendorThumb1", streetVendorThumb1);
    setValue("streetVendorThumb2", streetVendorThumb2);
  }, [
    siteVisitPhoto1,
    siteVisitPhoto2,
    siteVisitPhoto3,
    siteVisitPhoto4,
    siteVisitPhoto5,
    streetVendorPhoto,
    streetVendorThumb1,
    streetVendorThumb2,
  ]);

  useEffect(() => {}, [loadderState]);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          square
          sx={{
            // margin: 5,
            padding: 1,
            // paddingTop: 5,
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: "white",
          }}
          elevation={5}
        >
          <div>
            {/** Main Heading */}
            <marquee width="100%" direction="left" scrollamount="12">
              <Typography
                variant="h5"
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  marginTop: "2px",
                }}
              >
                <strong>{<FormattedLabel id="siteVisit" />}</strong>
              </Typography>
            </marquee>
            <br /> <br />
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleNext)}>
                <ThemeProvider theme={theme}>
                  {shrinkTemp && (
                    <>
                      <BasicApplicationDetails />
                      <HawkerDetails />
                      <AddressOfHawker />
                      <AadharAuthentication />
                      <PropertyAndWaterTaxes />
                      <AdditionalDetails />
                    </>
                  )}

                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "40px",
                      borderRadius: 100,
                    }}
                  >
                    <strong> {<FormattedLabel id="siteVisit" />}</strong>
                  </div>

                  <Grid
                    container
                    sx={{
                      marginTop: 5,
                      marginBottom: 5,
                      paddingLeft: "50px",
                      align: "center",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <Typography varaint="subtitle1">
                        <strong>{<FormattedLabel id="siteVisitPhotoUpload" />}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="siteVisitPhoto1" />}</strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButton
                          appName="HMS"
                          serviceName="H-HmsSiteVisit"
                          filePath={setSiteVisitPhoto1}
                          fileName={siteVisitPhoto1}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="siteVisitPhoto2" />}</strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto2}
                        fileName={siteVisitPhoto2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="siteVisitPhoto3" />}</strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto3}
                        fileName={siteVisitPhoto3}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="siteVisitPhoto4" />}</strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto4}
                        fileName={siteVisitPhoto4}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 4 }}>
                      <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="siteVisitPhoto5" />}</strong>
                      </Typography>
                      <UploadButton
                        appName="HMS"
                        serviceName="H-HmsSiteVisit"
                        filePath={setSiteVisitPhoto5}
                        fileName={siteVisitPhoto5}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "15px",
                        marginTop: "15px",
                      }}
                    >
                      <Typography variant="subtitle1">
                        <strong>{<FormattedLabel id="streetVendorInformation" />}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="streetVendorPhoto" />}</strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButton
                          appName="HMS"
                          serviceName="H-HmsSiteVisit"
                          filePath={setStreetVendorPhoto}
                          fileName={streetVendorPhoto}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="streetVendorThumb1" />}</strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButton
                          appName="HMS"
                          serviceName="H-HmsSiteVisit"
                          filePath={setStreetVendorThumb1}
                          fileName={streetVendorThumb1}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Typography variant="subtitle2">
                        <strong>{<FormattedLabel id="streetVendorThumb2" />}</strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButton
                          appName="HMS"
                          serviceName="H-HmsSiteVisit"
                          filePath={setStreetVendorThumb2}
                          fileName={streetVendorThumb2}
                        />
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "15px",
                        marginTop: "15px",
                      }}
                    >
                      <Typography variant="subtitle1">
                        <strong>{<FormattedLabel id="streetVendorQuestion" />}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                      <TextField
                        sx={{ width: "300px" }}
                        label=<FormattedLabel id="roadWithBusinessLocation" />
                        variant="standard"
                        {...register("roadWithBusinessLocation")}
                      />
                    </Grid>
                    {/**  
                    <Grid item xs={12} md={12} sm={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="additionalLabour" />}
                        </FormLabel>
                        <Controller
                          name="additionalLabour"
                          control={control}
                          defaultValue="false"
                          render={({ field }) => (
                            <RadioGroup
                              sx={{ width: "270px" }}
                              // disabled={inputState}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                // disabled={inputState}
                                value="true"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.additionalLabour}
                                helperText={errors?.additionalLabour ? errors.additionalLabour.message : null}
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.additionalLabour}
                                helperText={errors?.additionalLabour ? errors.additionalLabour.message : null}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                      </Grid>
                      */}

                    <Grid item xs={12} md={12} sm={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="businessHawkinglocation" />}
                        </FormLabel>
                        <Controller
                          name="businessHawkinglocation"
                          control={control}
                          defaultValue="false"
                          render={({ field }) => (
                            <RadioGroup
                              sx={{ width: "270px" }}
                              // disabled={inputState}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                // disabled={inputState}
                                value="Applicant itSelef"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="applicantItsSelf" />}
                                error={!!errors.businessHawkinglocation}
                                helperText={
                                  errors?.businessHawkinglocation
                                    ? errors.businessHawkinglocation.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="with Help of Family Members"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="withHelpofFamilyMembers" />}
                                error={!!errors.businessHawkinglocation}
                                helperText={
                                  errors?.businessHawkinglocation
                                    ? errors.businessHawkinglocation.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="by Keeping servant"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="byKeepingservant" />}
                                error={!!errors.businessHawkinglocation}
                                helperText={
                                  errors?.businessHawkinglocation
                                    ? errors.businessHawkinglocation.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12} sm={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="inspectionSellingGoods" />}
                        </FormLabel>
                        <Controller
                          name="inspectionSellingGoods"
                          control={control}
                          defaultValue="false"
                          render={({ field }) => (
                            <RadioGroup
                              sx={{ width: "270px" }}
                              // disabled={inputState}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                // disabled={inputState}
                                value="true"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.inspectionSellingGoods}
                                helperText={
                                  errors?.inspectionSellingGoods
                                    ? errors.inspectionSellingGoods.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.inspectionSellingGoods}
                                helperText={
                                  errors?.inspectionSellingGoods
                                    ? errors.inspectionSellingGoods.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12} sm={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="businessTrafficCongestion" />}
                        </FormLabel>
                        <Controller
                          name="businessTrafficCongestion"
                          control={control}
                          defaultValue="false"
                          render={({ field }) => (
                            <RadioGroup
                              sx={{ width: "270px" }}
                              // disabled={inputState}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                // disabled={inputState}
                                value="true"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.businessTrafficCongestion}
                                helperText={
                                  errors?.businessTrafficCongestion
                                    ? errors.businessTrafficCongestion.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                // disabled={inputState}
                                value="false"
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.businessTrafficCongestion}
                                helperText={
                                  errors?.businessTrafficCongestion
                                    ? errors.businessTrafficCongestion.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1} md={1} sm={1} lg={1} xl={1} sx={{ marginTop: 2 }}>
                      <strong>
                        <FormattedLabel id="remark" />{" "}
                      </strong>
                    </Grid>
                    <Grid item xs={6} md={6} sm={6} lg={6} xl={6} sx={{ marginTop: 1 }}>
                      <FormControl error={!!errors.siteVisitRemark} sx={{ marginTop: 0 }}>
                        <Controller
                          name="siteVisitRemark"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextareaAutosize
                              {...register("siteVisitRemark")}
                              style={{
                                width: "250px",
                                height: "50px",
                              }}
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors?.siteVisitRemark ? errors.siteVisitRemark.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <br />
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Stack spacing={5} direction="row">
                        <Button type="submit" variant="contained" color="primary">
                          {<FormattedLabel id="submit" />}
                        </Button>
                        <Button
                          onClick={() => {
                            localStorage.removeItem("issuanceOfHawkerLicenseId");
                            router.push("/streetVendorManagementSystem/dashboards");
                          }}
                          type="button"
                          variant="contained"
                          color="primary"
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </ThemeProvider>
              </form>
            </FormProvider>
          </div>
        </Paper>
      )}
    </>
  );
};

export default SiteVisit;