import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  ThemeProvider,
  Stack,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToWords } from "to-words";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import urls from "../../../../URLS/urls";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";

/** Authore - Sachin Durge */
// Loi Generation
const LoiGeneration = () => {
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

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "serviceCharges", // unique name for your Field Array
  });

  // const { serviceID } = props;
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const toWords = new ToWords();
  const [inputState, setInputState] = useState(false);
  const [durationOfLicenseValiditys, setDurationOfLicenseValiditys] = useState();
  const [titles, setTitles] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [hawkerTypes, setHawkerTypes] = useState([]);
  const [serviceCharges, setServiceCharges] = useState([]);
  const [loadderState, setLoadderState] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [shrinkTemp, setShrinkTemp] = useState(false);

  // titles
  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setTitles(
            r.data.title.map((row) => ({
              id: row.id,
              title: row.title,
              titleMr: row.titleMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // serviceNames
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // hawkerTypes
  const getHawkerType = () => {
    axios
      .get(`${urls.HMSURL}/hawkerType/getAll`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setHawkerTypes(
            r.data.hawkerType.map((row) => ({
              id: row.id,
              hawkerType: row.hawkerType,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // getHawkerLiceseData
  const getIssuanceOfHawkerLicsenseData = () => {
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          console.log("hawkerLicenseData", r?.data);
          reset(r.data);
          getDurationOfLicenseValiditys();
          getServiceCharges();
          setValue("disabledFieldInputState", true);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch(() => {
        setLoadderState(false);
        <Failed />;
      });
  };

  // durationOfLicenseValiditys
  const getDurationOfLicenseValiditys = () => {
    axios
      .get(`${urls.HMSURL}/licenseValidity/getAll`)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setDurationOfLicenseValiditys(
            res.data.licenseValidity.map((r) => ({
              id: r.id,
              licenseValidity: r.licenseValidity,
              hawkerType: r.hawkerType,
            })),
          );
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

  // serviceCharges
  const getServiceCharges = () => {
    console.log("ServiceNameGetServiceChargeAPI", watch("serviceId"));
    axios
      .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=${watch("serviceId")}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          console.log("res?data", r?.data);
          setServiceCharges(
            r.data.serviceCharge.map((row) => ({
              id: row.id,
              serviceChargeTypeName: row?.serviceChargeTypeName,
              charge: row.charge,
              servicex: row.service,
              amount: row.amount,
              chargeName: row?.chargeName,
              serviceChargeType: row?.serviceChargeType,
            })),
          );
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

  // Handle Next
  const handleNext = (data) => {
    setLoadderState(true);
    const loi = {
      ...data.loi,
      loiServiceCharges: getValues("serviceCharges"),
      issuanceOfHawker: getValues("id"),
    };

    let finalBodyForApi = {
      ...data,
      loi,
      role: "LOI_GENERATION",
    };

    axios
      .post(`${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`, finalBodyForApi, {
        headers: {
          role: "LOI_GENERATION",
          id: data.id,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setLoadderState(false);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved!", "LOI Generated successfully !", "success");
          router.push("/streetVendorManagementSystem/dashboards");
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch(() => {
        setLoadderState(false);
        <Failed />;
      });
  };

  useEffect(() => {
    setLoadderState(false);
    getTitles();
    getserviceNames();
    getHawkerType();
    setValue("disabledFieldInputState", true);
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null ||
      localStorage.getItem("issuanceOfHawkerLicenseId") != ""
    ) {
      setIssuanceOfHawkerLicenseId(localStorage.getItem("issuanceOfHawkerLicenseId"));
    }
  }, []);

  useEffect(() => {
    setInputState(getValues("inputState"));
    setValue("serviceCharges", serviceCharges);
    let total = 0;
    serviceCharges.forEach((data, index) => {
      console.log("dataSachin", data);
      total += data?.amount;
    });
    setValue("loi.totalAmount", total);
    setValue("loi.totalInWords", toWords.convert(total));
    setShrinkTemp(true);
    setLoadderState(false);
  }, [serviceCharges]);

  // License Validity -Based on Duration
  useEffect(() => {
    setValue(
      "loi.durationOfLicenseValidity",
      durationOfLicenseValiditys?.find((d) => d?.hawkerType == getValues("hawkerType"))?.id,
    );
    console.log(
      "durationLicenseValidityBasedOnHawkerDuration",
      durationOfLicenseValiditys?.find((d) => d?.hawkerType == getValues("hawkerType"))?.id,
    );
  }, [durationOfLicenseValiditys, ` ${watch("hawkerType")}`]);

  useEffect(() => {}, [loadderState]);

  useEffect(() => {
    getIssuanceOfHawkerLicsenseData();
  }, [issuanceOfHawkerLicenseId]);

  useEffect(() => {}, [shrinkTemp]);

  // view
  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(handleNext)}>
        {loadderState ? (
          <Loader />
        ) : (
          <>
            {shrinkTemp && (
              <ThemeProvider theme={theme}>
                <Paper
                  square
                  sx={{
                    padding: 1,
                    paddingTop: 5,
                    paddingBottom: 5,
                    backgroundColor: "white",
                  }}
                  elevation={5}
                >
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
                      <strong>{<FormattedLabel id="loiGeneration" />}</strong>
                    </Typography>
                  </marquee>
                  <br /> <br />
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
                    <strong>
                      <FormattedLabel id="applicantDetails" />
                    </strong>
                  </div>
                  <Grid
                    container
                    sx={{
                      marginTop: 1,
                      marginBottom: 5,
                      paddingLeft: "50px",
                      align: "center",
                    }}
                  >
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                      <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="serviceName" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled
                              sx={{ minWidth: "230px", width: "470px" }}
                              // // dissabled={inputState}
                              autoFocus
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Service Name *"
                              id="demo-simple-select-standard"
                              labelId="id='demo-simple-select-standard-label'"
                            >
                              {serviceNames &&
                                serviceNames.map((serviceName, index) => (
                                  <MenuItem key={index} value={serviceName.id}>
                                    {language == "en" ? serviceName?.serviceName : serviceName?.serviceNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="serviceId"
                          control={control}
                          defaultValue=""
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        disabled
                        InputLabelProps={{ shrink: true }}
                        label=<FormattedLabel id="applicationNo" />
                        {...register("applicationNumber")}
                        error={!!errors.applicationNumber}
                        helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <FormControl sx={{ marginTop: 0 }} error={!!errors.applicationDate}>
                        <Controller
                          name="applicationDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    {<FormattedLabel id="applicationDate" />}
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
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
                        <FormHelperText>
                          {errors?.applicationDate ? errors.applicationDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="title" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              inputFormat="DD/MM/YYYY"
                              disabled
                              autoFocus
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="title" />}
                              id="demo-simple-select-standard"
                              labelId="id='demo-simple-select-standard-label'"
                            >
                              {titles &&
                                titles.map((title, index) => (
                                  <MenuItem key={index} value={title?.id}>
                                    {language == "en" ? title?.title : title?.titleMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="title"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.title ? errors.title.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        InputLabelProps={{ shrink: true }}
                        disabled
                        label={<FormattedLabel id="firstName" />}
                        {...register("firstName")}
                        error={!!errors.firstName}
                        helperText={errors?.firstName ? errors.firstName.message : null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        InputLabelProps={{ shrink: true }}
                        disabled
                        label={<FormattedLabel id="middleName" />}
                        {...register("middleName")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        InputLabelProps={{ shrink: true }}
                        disabled
                        label={<FormattedLabel id="lastName" />}
                        {...register("lastName")}
                        error={!!errors.lastName}
                        helperText={errors?.lastName ? errors.lastName.message : null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        InputLabelProps={{ shrink: true }}
                        disabled
                        label={<FormattedLabel id="emailAddress" />}
                        {...register("emailAddress")}
                        error={!!errors.emailAddress}
                        helperText={errors?.emailAddress ? errors.emailAddress.message : null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        disabled
                        InputLabelProps={{ shrink: true }}
                        label={<FormattedLabel id="mobile" />}
                        {...register("mobile")}
                        error={!!errors.mobile}
                        helperText={errors?.mobile ? errors.mobile.message : null}
                      />
                    </Grid>
                  </Grid>
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
                    <strong>
                      <FormattedLabel id="licenseValidity" />
                    </strong>
                  </div>
                  <Grid
                    container
                    sx={{
                      marginTop: 1,
                      marginBottom: 5,
                      paddingLeft: "50px",
                      align: "center",
                    }}
                  >
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.hawkerType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">Hawker Type</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled
                              sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Hawker Type"
                            >
                              {hawkerTypes &&
                                hawkerTypes.map((hawkerType, index) => (
                                  <MenuItem key={index} value={hawkerType.id}>
                                    {hawkerType?.hawkerType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="hawkerType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.hawkerType ? errors.hawkerType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.licenseType}
                        inputProps={{ shrink: true }}
                      >
                        <InputLabel inputProps={{ shrink: true }} id="demo-simple-select-standard-label">
                          {<FormattedLabel id="durationOfLicenseValidity" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled
                              inputProps={{ shrink: true }}
                              sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label=<FormattedLabel id="durationOfLicenseValidity" />
                            >
                              {durationOfLicenseValiditys &&
                                durationOfLicenseValiditys.map((licenseValidity, index) => (
                                  <MenuItem key={index} value={licenseValidity?.id}>
                                    {licenseValidity?.licenseValidity}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="loi.durationOfLicenseValidity"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.licenseType ? errors.licenseType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <FormControl flexDirection="row">
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="licenseDuration" />}
                        </FormLabel>

                        <Controller
                          name="loi.licenseDuration"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              // disabled={inputState}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value="financial Year"
                                // disabled={inputState}
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="financialYear" />}
                                error={!!errors.licenseDuration}
                                helperText={errors?.licenseDuration ? errors.licenseDuration.message : null}
                              />
                              <FormControlLabel
                                value="calendar year"
                                // disabled={inputState}
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="calendarYear" />}
                                error={!!errors.licenseDuration}
                                helperText={errors?.licenseDuration ? errors.licenseDuration.message : null}
                              />
                              <FormControlLabel
                                value="date of issuance"
                                // disabled={inputState}
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="dateOfIssuance" />}
                                error={!!errors.licenseDuration}
                                helperText={errors?.licenseDuration ? errors.licenseDuration.message : null}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
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
                    <strong>
                      <FormattedLabel id="chargesDetails" />
                    </strong>
                  </div>
                  {serviceCharges.length > 0 && (
                    <>
                      {fields.map((serviceChargeId, index) => {
                        console.log("serviceChargeId1212", serviceChargeId);
                        return (
                          <Grid
                            container
                            key={index}
                            sx={{
                              paddingLeft: "50px",
                              align: "center",
                            }}
                          >
                            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                              <TextField
                                sx={{ width: "300px" }}
                                id="standard-basic"
                                key={serviceChargeId?.id}
                                disabled={inputState}
                                label={<FormattedLabel id="serviceChargeTypeName" />}
                                {...register(`serviceCharges.${index}.serviceChargeTypeName`)}
                                // error={!!errors.serviceChargeType}
                                // helperText={
                                //   errors?.serviceChargeType
                                //     ? errors.serviceChargeType.message
                                //     : null
                                // }
                              />
                            </Grid>
                            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                              <TextField
                                sx={{ width: "240px" }}
                                id="standard-basic"
                                disabled={inputState}
                                key={serviceChargeId.id}
                                label={<FormattedLabel id="chargeName" />}
                                {...register(`serviceCharges.${index}.chargeName`)}
                                // error={!!errors.charge}
                                // helperText={errors?.charge ? errors.charge.message : null}
                              />
                            </Grid>
                            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                              <TextField
                                sx={{ width: "250px" }}
                                id="standard-basic"
                                disabled={inputState}
                                key={serviceChargeId.id}
                                label={<FormattedLabel id="amount" />}
                                {...register(`serviceCharges.${index}.amount`)}
                                // error={!!errors.amount}
                                // helperText={errors?.amount ? errors.amount.message : null}
                              />
                            </Grid>
                          </Grid>
                        );
                      })}
                    </>
                  )}
                  <Grid
                    container
                    sx={{
                      paddingLeft: "50px",
                      align: "center",
                      backgroundColor: "primary",
                      // border: "4px solid black",
                    }}
                  >
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}></Grid>

                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        inputLabelProps={{ shrink: true }}
                        label={<FormattedLabel id="totalCharges" />}
                        disabled={inputState}
                        {...register("loi.totalAmount")}
                        error={!!errors.total}
                        helperText={errors?.total ? errors.total.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        sx={{ width: "250px" }}
                        inputLabelProps={{ shrink: true }}
                        disabled={inputState}
                        label={<FormattedLabel id="totalInWords" />}
                        {...register("loi.totalInWords")}
                        error={!!errors.totalInWords}
                        helperText={errors?.totalInWords ? errors.totalInWords.message : null}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{
                        display: "flex",
                        marginTop: "30px",
                        justifyContent: "center",
                        alignItem: "center",
                      }}
                    >
                      <Stack spacing={5} direction="row">
                        <Button type="submit" sx={{ width: "230 px" }} variant="contained">
                          <FormattedLabel id="generateLoi" />
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
                </Paper>
              </ThemeProvider>
            )}
          </>
        )}
      </form>
    </>
  );
};

export default LoiGeneration;
