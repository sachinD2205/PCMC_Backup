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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToWords } from "to-words";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme.js";
import urls from "../../../URLS/urls";
// Loi Generation
const LoiGenerationComponent = (props) => {
  const {
    control,
    register,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const toWords = new ToWords();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "serviceCharges", // unique name for your Field Array
    }
  );
  const language = useSelector((state) => state?.labels.language);

  // lOI GENERATION PREVIEW

  const [loiGenerationReceiptDailog, setLoiGenerationReceiptDailog] =
    useState(false);
  const loiGenerationReceiptDailogOpen = () =>
    setLoiGenerationReceiptDailog(true);
  const loiGenerationReceiptDailogClose = () =>
    setLoiGenerationReceiptDailog(false);

  // const loi Recipit - Preview
  const loiGenerationReceipt = () => {
    loiGenerationReceiptDailogOpen();
  };

  const [serviceCharge, setServiceCharges] = useState([]);
  useEffect(() => {
    console.log("1212121", getValues("applicationNo"));
    console.log("title", getValues("title"));
    console.log("serviceName", getValues("serviceName"));
    console.log("firstName", getValues("firstName"));
  }, []);

  // title
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        }))
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
            }))
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

  // const [hawkerTypes, setHawkerTypes] = useState([]);

  // const getHawkerType = () => {
  //   axios.get(`${urls.HMSURL}/hawkerType/getAll`).then((r) => {
  //     setHawkerTypes(
  //       r.data.hawkerType.map((row) => ({
  //         id: row.id,
  //         hawkerType: row.hawkerType,
  //       }))
  //     );
  //   });
  // };

  const [durationOfLicenseValiditys, setDurationOfLicenseValiditys] =
    useState();

  // const getDurationOfLicenseValiditys = () => {
  //   axios.get(`${urls.HMSURL}/licenseValidity/getAll`).then((res) => {
  //     if (res.status == 200) {
  //       setDurationOfLicenseValiditys(
  //         res.data.licenseValidity.map((r) => ({
  //           id: r.id,
  //           licenseValidity: r.licenseValidity,
  //           hawkerType: r.hawkerType,
  //         }))
  //       );
  //     }
  //   });
  // };

  const getServiceCharges = () => {
    console.log("serviceId", getValues("servicName"));

    axios
      .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=76`)
      .then((r) => {
        setServiceCharges(
          r.data?.serviceCharge
            .filter((d) => d.id == 27)
            .map((row) => ({
              id: row.id,
              serviceChargeType: row.serviceChargeType,
              serviceChargeTypeName: row.serviceChargeTypeName,
              serviceChargeType: row.serviceChargeType,
              charge: row.charge,
              chargeName: row.chargeName,
              amount: row.amount,
            }))
        );
      });
  };

  const [inputState, setInputState] = useState(false);

  useEffect(() => {
    getTitles;
    getserviceNames();
    getTitles;
    // getHawkerType();
    // getDurationOfLicenseValiditys();
    getServiceCharges();
  }, []);

  useEffect(() => {
    setInputState(getValues("inputState"));
    setValue("serviceCharges", serviceCharge);
    let total = 0;
    serviceCharge.forEach((data, index) => {
      total += data.amount;
    });
    setValue("loi.total", total);
    setValue("loi.totalInWords", toWords.convert(total));
  }, [serviceCharge]);

  // License Validity -Based on Duration
  useEffect(() => {
    setValue(
      "loi.durationOfLicenseValidity",
      durationOfLicenseValiditys?.find(
        (d) => d?.hawkerType == getValues("hawkerType")
      )?.id
    );
  }, [durationOfLicenseValiditys]);

  const getLoiGenerationData = () => {
    const id = getValues("id");

    axios
      .get(`${urls.FbsURL}/transaction/provisionalBuildingNoc/getById?id=76`)
      .then((res) => {
        if (res.data == 200) {
          console.log("resp.data", res.data);
          reset(res.data);
        }
      });
  };

  useEffect(() => {
    console.log("9999", getValues("id"));
    getLoiGenerationData();
  }, [getValues("id")]);

  // Handle Next
  const handleNext = (data) => {
    console.log("data7878", data);

    loi;

    const loi = {
      ...data.loi,
      loiServiceCharges: getValues("serviceCharges"),
      issuanceOfHawker: getValues("id"),
    };

    const TrnLOIServiceCharges = {};

    let finalBodyForApi = {
      ...data,
      loi,
      TrnLOIServiceCharges,
      role: "LOI_GENERATION",
    };

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            role: "LOI_GENERATION",
            id: data.id,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          console.log("backendResponse", res);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push("/FireBrigadeSystem/dashboard");
        } else if (res.status == 201) {
          console.log("backendResponse", res);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved !", "Record Saved successfully !", "success");
          router.push("/FireBrigadeSystem/dashboard");
        }
      });
  };

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
              {/* <FormattedLabel id="applicantDetails" /> */}
              Application
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
                  {/* {<FormattedLabel id="serviceName" />} */}
                  Service Name
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
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
                            {language == "en"
                              ? serviceName?.serviceName
                              : serviceName?.serviceNameMr}
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
                disabled={inputState}
                label="Application No."
                {...register("applicationNo")}
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
                  name="applicationDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={inputState}
                        inputFormat="DD/MM/YYYY"
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
                  {errors?.applicationDate
                    ? errors.applicationDate.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="title" />}
                  Title
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      inputFormat="DD/MM/YYYY"
                      disabled={inputState}
                      sx={{ width: "230px" }}
                      autoFocus
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      // label={<FormattedLabel id="title" />}
                      label="Title"
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      {titles &&
                        titles.map((title, index) => (
                          <MenuItem key={index} value={title.id}>
                            {language == "en" ? title?.title : title?.titleMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="title"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.title ? errors.title.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="firstName" />}
                label="First Name"
                {...register("applicantName")}
                error={!!errors.firstName}
                helperText={errors?.firstName ? errors.firstName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="middleName" />}
                label="Middle Name"
                {...register("applicantMiddleName")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="lastName" />}
                label="Last Name"
                {...register("applicantLastName")}
                error={!!errors.lastName}
                helperText={errors?.lastName ? errors.lastName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="emailAddress" />}
                label="emailAddress"
                {...register("emailId")}
                error={!!errors.emailId}
                helperText={errors?.emailId ? errors.emailId.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="mobile" />}
                label="Mobile"
                {...register("mobileNO")}
                error={!!errors.mobile}
                helperText={errors?.mobile ? errors.mobile.message : null}
              />
            </Grid>
          </Grid>
          {/* <div
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
              License Validity
            </strong>
          </div> */}
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          >
            {/* <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
                error={!!errors.hawkerType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Hawker Type
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Hawker Type"
                    >
                      {hawkerTypes &&
                        hawkerTypes.map((hawkerType, index) => (
                          <MenuItem key={index} value={hawkerType.id}>
                            {hawkerType.hawkerType}
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
            </Grid> */}
            {/* <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
                error={!!errors.licenseType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Duration Of License Validity
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Duration Of License Validity"
                    >
                      {durationOfLicenseValiditys &&
                        durationOfLicenseValiditys.map(
                          (licenseValidity, index) => (
                            <MenuItem key={index} value={licenseValidity.id}>
                              {licenseValidity.licenseValidity}
                            </MenuItem>
                          )
                        )}
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
            </Grid> */}
            {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl flexDirection="row">
                <FormLabel
                  sx={{ width: "230px" }}
                  id="demo-row-radio-buttons-group-label"
                >
                  License Duration
                </FormLabel>

                <Controller
                  name="loi.licenseDuration"
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
                        value="financial Year"
                        control={<Radio size="small" />}
                        label="Financial Year"
                        error={!!errors.licenseDuration}
                        helperText={
                          errors?.licenseDuration
                            ? errors.licenseDuration.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value="calendar year"
                        control={<Radio size="small" />}
                        label="Calendar Year"
                        error={!!errors.licenseDuration}
                        helperText={
                          errors?.licenseDuration
                            ? errors.licenseDuration.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value="date of issuance"
                        control={<Radio size="small" />}
                        label="Date Of Issuance"
                        error={!!errors.licenseDuration}
                        helperText={
                          errors?.licenseDuration
                            ? errors.licenseDuration.message
                            : null
                        }
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid> */}
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
              {/* <FormattedLabel id="chargesDetails" /> */}
              Charges Details
            </strong>
          </div>
          {serviceCharge.length > 0 && (
            <>
              {fields.map((serviceChargeId, index) => {
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
                        key={serviceChargeId.id}
                        disabled={inputState}
                        // label={<FormattedLabel id="serviceChargeTypeName" />}
                        label="Service Charge Type Name"
                        {...register(
                          `serviceCharges.${index}.serviceChargeTypeName`
                        )}
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
                        // label={<FormattedLabel id="chargeName" />}
                        label="chargeName"
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
                        // label={<FormattedLabel id="amount" />}
                        label="Amount"
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
                // label={<FormattedLabel id="totalCharges" />}
                label="Total Charges"
                disabled={inputState}
                {...register("loi.total")}
                error={!!errors.total}
                helperText={errors?.total ? errors.total.message : null}
              />
            </Grid>
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                disabled={inputState}
                // label={<FormattedLabel id="totalInWords" />}
                label="Total In Words"
                {...register("loi.totalInWords")}
                error={!!errors.totalInWords}
                helperText={
                  errors?.totalInWords ? errors.totalInWords.message : null
                }
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
                <Button
                  type="submit"
                  sx={{ width: "230 px" }}
                  variant="contained"
                >
                  {/* <FormattedLabel id="generateLoi" /> */}
                  Generate LOI
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
                    onClick={() => {
                      loiGenerationReceiptDailogClose();
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
