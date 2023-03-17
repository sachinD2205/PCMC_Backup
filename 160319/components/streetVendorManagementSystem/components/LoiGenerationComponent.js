import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToWords } from "to-words";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme.js";
import urls from "../../../URLS/urls";
import { Failed } from "./commonAlert";

/** Authore - Sachin Durge */
// Loi Generation
const LoiGenerationComponent = (props) => {
  const {
    control,
    register,
    getValues,
    setValue,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useFormContext();
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
  const [loiGenerationReceiptDailog, setLoiGenerationReceiptDailog] = useState(false);
  ("");

  // lOI GENERATION PREVIEW
  const loiGenerationReceiptDailogOpen = () => setLoiGenerationReceiptDailog(true);
  const loiGenerationReceiptDailogClose = () => setLoiGenerationReceiptDailog(false);

  // const loi Recipit - Preview
  const loiGenerationReceipt = () => {
    loiGenerationReceiptDailogOpen();
  };

  // titles
  const getTitles = () => {
    // alert("tiltel");
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
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // serviceCharges
  const getServiceCharges = () => {
    console.log("ServiceNameGetServiceChargeAPI", props?.serviceID);
    axios
      .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=${props?.serviceID}`)
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
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // loiGenerationData
  const getLoiGenerationData = () => {
    const id = getValues("id");
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${id}`)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          console.log("resp.data", res.data);
          reset(res.data);
          getDurationOfLicenseValiditys();
          getServiceCharges();
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // Handle Next
  const handleNext = (data) => {
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
          console.log("backendResponse", res);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved!", "LOI Generated successfully !", "success");
          router.push("/streetVendorManagementSystem/dashboards");
        } else {
          <Failed />;
        }
      })
      .catch(() => {
        <Failed />;
      });
  };

  useEffect(() => {
    getTitles;
    getserviceNames();
    getHawkerType();
    getLoiGenerationData();
  }, []);

  useEffect(() => {
    console.log("LoiServiceChargeLoi", serviceCharges);
    setInputState(getValues("inputState"));
    setValue("serviceCharges", serviceCharges);
    let total = 0;
    serviceCharges.forEach((data, index) => {
      console.log("dataSachin", data);
      total += data?.amount;
    });

    setValue("loi.totalAmount", total);
    setValue("loi.totalInWords", toWords.convert(total));
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

  // view
  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <form onSubmit={handleSubmit(handleNext)}>
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
                      sx={{ minWidth: "230px", width: "500px" }}
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
                  name="serviceName"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                disabled
                label="Application No."
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
                        label={<span style={{ fontSize: 16, marginTop: 2 }}>Application Date</span>}
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
                      sx={{ width: "230px" }}
                      autoFocus
                      value={field?.value}
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
                disabled
                label={<FormattedLabel id="middleName" />}
                {...register("middleName")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
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
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} error={!!errors.hawkerType}>
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
                <FormHelperText>{errors?.hawkerType ? errors.hawkerType.message : null}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} error={!!errors.licenseType}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="durationOfLicenseValidity" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // disabled
                      inputProps={{ shrink: true }}
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="durationOfLicenseValidity" />}
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
                  defaultValue={null}
                />
                <FormHelperText>{errors?.licenseType ? errors.licenseType.message : null}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl flexDirection="row">
                <FormLabel sx={{ width: "230px" }} id="demo-row-radio-buttons-group-label">
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
                        id="standard-basic"
                        key={serviceChargeId?.id}
                        disabled={inputState}
                        label={<FormattedLabel id="serviceChargeTypeName" />}
                        {...register(`serviceCharges?.${index}?.serviceChargeTypeName`)}
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
                        {...register(`serviceCharges?.${index}?.chargeName`)}
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
                inputProps={{ shrink: true }}
                label={<FormattedLabel id="totalCharges" />}
                disabled={inputState}
                {...register("loi.totalAmount")}
                error={!!errors.total}
                helperText={errors?.total ? errors.total.message : null}
              />
            </Grid>
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                inputProps={{ shrink: true }}
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
              </Stack>
            </Grid>
          </Grid>
        </form>

        {/** Form Preview Dailog */}

        {/***
        <Dialog
          
          fullWidth
          maxWidth={"lg"}
          open={loiGenerationReceiptDailog}
          onClose={() => loiGenerationReceiptDailogClose()}
        >
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                Preview
              </Grid>
              <Grid
                item
                xs={1}
                sm={2}
                md={4}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  aria-label='delete'
                   onClick={() => loiGenerationReceiptDailogClose()}
                  sx={{
                    marginLeft: "530px",
                    backgroundColor: "primary",
                    ":hover": {
                      bgcolor: "red", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                   
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <LoiGenerationRecipt />
          </DialogContent>

          <DialogTitle>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                variant='contained'
                onClick={loiGenerationReceiptDailogClose}
              >
                Exit
              </Button>
            </Grid>
          </DialogTitle>
        </Dialog>
         */}
      </ThemeProvider>
    </>
  );
};

export default LoiGenerationComponent;
