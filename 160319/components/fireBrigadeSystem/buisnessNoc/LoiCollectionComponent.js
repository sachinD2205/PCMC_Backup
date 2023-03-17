import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Stack, ThemeProvider } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import urls from "../../../URLS/urls";
import router, { useRouter } from "next/router";

const LoiCollectionComponent = () => {
  const {
    setValue,
    getValues,
    methods,
    watch,
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [inputState, setInputState] = useState(false);
  // payment Mode
  const [paymentModeName, setPaymentModeName] = useState();
  // Pay
  const pay = () => {};
  useEffect(() => {
    console.log("watch", watch("paymentMode"));
  }, [watch("paymentMode")]);

  // Input State
  useEffect(() => {
    setInputState(true);
  }, []);

  const [licenseTypes, setLicenseTypes] = useState([]);

  const getLicenseTypes = () => {
    axios.get(`${urls.HMSURL}/licenseValidity/getAll`).then((r) => {
      setLicenseTypes(
        r.data.licenseValidity.map((row) => ({
          id: row.id,
          licenseType: row.licenseValidity,
          licenseTypeMr: row.licenseValidity,
        })),
      );
    });
  };

  // title
  const [titles, setTitles] = useState();

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        })),
      );
    });
  };

  const [serviceNames, setServiceNames] = useState([]);
  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            })),
          );
        } else {
          message.error("Filed To Load !! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.success("Error !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const [paymentTypes, setPaymentTypes] = useState([]);

  const getPaymentTypes = () => {
    axios.get(`${urls.CFCURL}/master/paymentType/getAll`).then((r) => {
      setPaymentTypes(
        r.data.paymentType.map((row) => ({
          id: row.id,
          paymentType: row.paymentType,
          paymentTypeMr: row.paymentTypeMr,
        })),
      );
    });
  };

  const [paymentModes, setPaymentModes] = useState([]);

  const getPaymentModes = () => {
    axios.get(`${urls.HMSURL}/master/paymentMode/getAll`).then((r) => {
      setPaymentModes(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        })),
      );
    });
  };

  // Bank Masters

  const [bankMasters, setBankMasters] = useState([]);

  // getBankMasters
  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(
        r.data.bank.map((row) => ({
          id: row.id,
          bankMaster: row.bankName,
          bankMasterMr: row.bankNameMr,
        })),
      );
    });
  };

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    getserviceNames();
    getTitles();
    getLicenseTypes();
    getBankMasters();
  }, []);

  const getLoiCollectionData = () => {
    const id = getValues("id");
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${id}`)
      .then((res) => {
        if (res.data == 200) {
          console.log("resp.data", res.data);
          reset(res.data);
        }
      });
  };

  useEffect(() => {
    getLoiCollectionData();
  }, [getValues("id")]);

  const handleNext = (data) => {
    const finalBodyForApi = {
      ...data,
      role: "LOI_COLLECTION",
    };

    axios
      .post(
        `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`,
        finalBodyForApi,
        {
          headers: {
            role: "LOI_COLLECTION",
            id: data.id,
          },
        },
      )
      .then((res) => {
        if (res.status == 200) {
          finalBodyForApi.id
            ? sweetAlert("LOI !", `LOI Generated successfully ! `, "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push("/streetVendorManagementSystem/dashboards");
        } else if (res.status == 201) {
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved !", "Record Saved successfully !", "success");
          router.push("/streetVendorManagementSystem/dashboards");
        }
      });
  };

  useEffect(() => {
    if (getValues("paymentCollection.paymentMode") == "CASH") {
      setValue("paymentCollection.receiptAmount", getValues("loi.total"));
    }
  }, [watch("paymentMode")]);

  // view
  return (
    <>
      <div>
        <ThemeProvider theme={theme}>
          <form onSubmit={handleSubmit(handleNext)}>
            <div>
              {/***
            <div
              style={{
                backgroundColor: "#0084ff",
                color: "white",
                fontSize: 19,
                marginTop: 30,
                // marginBottom: 30,
                padding: 8,
                paddingLeft: 30,
                marginLeft: "40px",
                marginRight: "40px",
                borderRadius: 100,
              }}
            >
              <strong>{<FormattedLabel id='loiCollection' />}</strong>
            </div>
            <Grid
              container
              sx={{
                marginTop: 1,
                marginBottom: "15px",
                paddingLeft: "50px",
                align: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >
                <TextField
                  label={<FormattedLabel id='applicationNumber' />}
                  {...register("applicationNumber")}
                  error={!!errors.applicationNumber}
                  helperText={
                    errors?.applicationNumber
                      ? errors.applicationNumber.message
                      : null
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                  marginTop: "20px",
                }}
              >
                <Typography variant='h1'>
                  <strong>
                    <FormattedLabel id='or' />
                  </strong>
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >

                <Stack spacing={12} direction='row'>
                  <TextField
                    label={<FormattedLabel id='loiNO' />}
                    {...register("loi.loiNo")}
                    // error={!!errors.loi.loiNo}
                    // helperText={
                    //   errors?.(loi.loiNo) ? errors.loi.loiNo.message : null
                    // }
                  />
                  <FormControl
                    sx={{ marginTop: 2 }}

                    // error={!!errors.loi.loi.loiDate}
                  >
                    <Controller
                      name='loi.loiDate'
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat='DD/MM/YYYY'
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                <FormattedLabel id='loiDate' />
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size='small'
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
                      {errors?.loiDate ? errors.loiDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >
                <Button variant='contained' sx={{ marginTop: "20px" }}>
                  <FormattedLabel id='search'></FormattedLabel>
                </Button>
              </Grid>
            </Grid>
              */}

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
                  <FormattedLabel id='applicantDetails' />
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
                  <FormControl
                    error={!!errors.serviceName}
                    sx={{ marginTop: 2 }}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='serviceName' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled={inputState}
                          sx={{ minWidth: "230px", width: "500px" }}
                          autoFocus
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label='Service Name *'
                          id='demo-simple-select-standard'
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {serviceNames &&
                            serviceNames.map((serviceName, index) => (
                              <MenuItem key={index} value={serviceName.id}>
                                {language == "en"
                                  ? serviceName?.serviceName
                                  : serviceName?.serviceNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='serviceName'
                      control={control}
                      defaultValue=''
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <TextField
                    disabled={inputState}
                    label='Application No.'
                    {...register("applicationNumber")}
                    error={!!errors.applicationNumber}
                    helperText={
                      errors?.applicationNumber
                        ? errors.applicationNumber.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <FormControl
                    sx={{ marginTop: 0 }}
                    error={!!errors.applicationDate}
                  >
                    <Controller
                      name='applicationDate'
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled={inputState}
                            inputFormat='DD/MM/YYYY'
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                Application Date
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size='small'
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
                      {errors?.applicationDate
                        ? errors.applicationDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='title' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          inputFormat='DD/MM/YYYY'
                          disabled={inputState}
                          sx={{ width: "230px" }}
                          autoFocus
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id='title' />}
                          id='demo-simple-select-standard'
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {titles &&
                            titles.map((title, index) => (
                              <MenuItem key={index} value={title.id}>
                                {language == "en"
                                  ? title?.title
                                  : title?.titleMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='title'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {errors?.title ? errors.title.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id='standard-basic'
                    disabled={inputState}
                    label={<FormattedLabel id='firstName' />}
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={
                      errors?.firstName ? errors.firstName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id='standard-basic'
                    disabled={inputState}
                    // disabled={inputState}
                    label={<FormattedLabel id='middleName' />}
                    {...register("middleName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id='standard-basic'
                    disabled={inputState}
                    label={<FormattedLabel id='lastName' />}
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={
                      errors?.lastName ? errors.lastName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id='standard-basic'
                    disabled={inputState}
                    label={<FormattedLabel id='emailAddress' />}
                    {...register("emailId")}
                    error={!!errors.emailId}
                    helperText={errors?.emailId ? errors.emailId.message : null}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    id='standard-basic'
                    disabled={inputState}
                    label={<FormattedLabel id='mobile' />}
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
                <strong>{<FormattedLabel id='loiDetails' />}</strong>
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
                  <TextField
                    label={<FormattedLabel id='loiNO' />}
                    {...register("loi.loiNo")}
                    error={!!errors.loiNO}
                    helperText={errors?.loiNO ? errors.loiNO.message : null}
                  />
                </Grid>

                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl sx={{ marginTop: 0 }} error={!!errors.loiDate}>
                    <Controller
                      name='loi.loiDate'
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat='DD/MM/YYYY'
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                <FormattedLabel id='loiDate' />
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size='small'
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
                      {errors?.loiDate ? errors.loiDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl
                    variant='standard'
                    sx={{ marginTop: 2 }}
                    error={!!errors.durationOfLicenseValidity}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='durationOfLicenseValidity' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 230 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={
                            <FormattedLabel id='durationOfLicenseValidity' />
                          }
                        >
                          {licenseTypes &&
                            licenseTypes.map((licenseType, index) => (
                              <MenuItem key={index} value={licenseType.id}>
                                {licenseType.licenseType}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='loi.durationOfLicenseValidity'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {errors?.licenseType ? errors.licenseType.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <TextField
                    label={<FormattedLabel id='totalCharges' />}
                    {...register("loi.total")}
                    error={!!errors.total}
                    helperText={errors?.total ? errors.total.message : null}
                  />
                </Grid>
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <TextField
                    label={<FormattedLabel id='totalInWords' />}
                    {...register("loi.totalInWords")}
                    error={!!errors.totalInWords}
                    helperText={
                      errors?.totalInWords ? errors.totalInWords.message : null
                    }
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
                  <FormattedLabel id='receiptModeDetails' />
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
                    error={!!errors.paymentType}
                    sx={{ marginTop: 2 }}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='paymentType' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "230px" }}
                          // // dissabled={inputState}
                          autoFocus
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label=<FormattedLabel id='paymentType' />
                          id='demo-simple-select-standard'
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {paymentTypes &&
                            paymentTypes.map((paymentType, index) => (
                              <MenuItem
                                key={index}
                                value={paymentType.paymentType}
                              >
                                {language == "en"
                                  ? paymentType?.paymentType
                                  : paymentType?.paymentTypeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='paymentCollection.paymentType'
                      control={control}
                      defaultValue=''
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl
                    error={!!errors.paymentMode}
                    sx={{ marginTop: 2 }}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='paymentMode' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "230px" }}
                          // // dissabled={inputState}
                          autoFocus
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id='paymentMode' />}
                          id='demo-simple-select-standard'
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {paymentModes &&
                            paymentModes.map((paymentMode, index) => (
                              <MenuItem
                                key={index}
                                value={paymentMode.paymentMode}
                              >
                                {language == "en"
                                  ? paymentMode?.paymentMode
                                  : paymentMode?.paymentModeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='paymentCollection.paymentMode'
                      control={control}
                      defaultValue=''
                    />
                  </FormControl>
                </Grid>

                {watch("paymentCollection.paymentMode") == "DD" && (
                  <>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='bankName' />}
                        variant='standard'
                        {...register("paymentCollection.bankName")}
                        error={!!errors.bankName}
                        helperText={
                          errors?.bankName ? errors.bankName.message : null
                        }
                      />
                    </Grid>

                    {/** 
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <TextField
                    disabled={inputState}
                    id='standard-basic'
                    label={<FormattedLabel id='branchName' />}
                    variant='standard'
                    {...register("branchName")}
                    error={!!errors.branchName}
                    helperText={
                      errors?.branchName ? errors.branchName.message : null
                    }
                  />
                </Grid>
                  */}
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='bankAccountNo' />}
                        variant='standard'
                        {...register("paymentCollection.bankAccountNo")}
                        error={!!errors.bankAccountNo}
                        helperText={
                          errors?.bankAccountNo
                            ? errors.bankAccountNo.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='ddNo' />}
                        variant='standard'
                        {...register("paymentCollection.dDNo")}
                        error={!!errors.dDNo}
                        helperText={errors?.dDNo ? errors.dDNo.message : null}
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.dDDate}
                      >
                        <Controller
                          name='paymentCollection.dDDate'
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    <FormattedLabel id='ddDate' />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD"),
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
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
                          {errors?.dDDate ? errors.dDDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {watch("paymentCollection.paymentMode") == "CASH" && (
                  <>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='receiptAmount' />}
                        variant='standard'
                        {...register("paymentCollection.receiptAmount")}
                        error={!!errors.receiptAmount}
                        helperText={
                          errors?.receiptAmount
                            ? errors.receiptAmount.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='receiptNumber' />}
                        variant='standard'
                        {...register("paymentCollection.receiptNo")}
                        error={!!errors.receiptNo}
                        helperText={
                          errors?.receiptNo ? errors.receiptNo.message : null
                        }
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.receiptDate}
                      >
                        <Controller
                          name='paymentCollection.receiptDate'
                          control={control}
                          defaultValue={moment()}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    <FormattedLabel id='receiptDate' />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD"),
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
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
                          {errors?.receiptDate
                            ? errors.receiptDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Stack
                    direction='row'
                    spacing='5'
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button type='submit'>Submit LOI </Button>
                  </Stack>
                </Grid>
              </Grid>
            </div>
          </form>
        </ThemeProvider>
      </div>
    </>
  );
};

export default LoiCollectionComponent;
