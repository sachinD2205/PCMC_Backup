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
import { ThemeProvider } from "@mui/styles";
import { Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router.js";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sweetAlert from "sweetalert";
import { ToWords } from "to-words";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel.js";
import theme from "../../../../../theme.js";
import urls from "../../../../../URLS/urls.js";
import styles from "../../../transaction/sportBooking/PaymentCollection.module.css";

// Loi Generation
const LoiGenerationComponent = (props) => {
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toWords = new ToWords();
  const router = useRouter();
  const [serviceNames, setServiceNames] = useState([]);
  const [serviceCharge, setServiceCharges] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [data, setData] = useState(null);
  const [applicableCharages, setApplicableCharages] = useState([]);
  const [sum, setSum] = useState(0);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "serviceCharges", // unique name for your Field Array
  });
  const language = useSelector((state) => state?.labels.language);

  // lOI GENERATION PREVIEW

  const [loiGenerationReceiptDailog, setLoiGenerationReceiptDailog] = useState(false);
  const loiGenerationReceiptDailogOpen = () => setLoiGenerationReceiptDailog(true);
  const loiGenerationReceiptDailogClose = () => setLoiGenerationReceiptDailog(false);

  // const loi Recipit - Preview
  const loiGenerationReceipt = () => {
    loiGenerationReceiptDailogOpen();
  };

  useEffect(() => {
    if (applicableCharages) {
      let deposite = 0,
        rate = 0;

      applicableCharages.forEach((charge) => {
        deposite += charge.chargeType == 2 ? charge.amountPerHead : 0;
        rate += charge.chargeType == 1 ? charge.totalAmount : 0;
      });
      console.log("Rate: ", rate);
      console.log("deposite: ", deposite);
      setSum(deposite + rate);
    }
  }, [applicableCharages]);
  const [venueNames, setVenueNames] = useState([]);

  const getVenueNames = () => {
    axios.get(`${urls.SPURL}/venueMaster/getAll`).then((r) => {
      setVenueNames(
        r.data.venue.map((row) => ({
          id: row.id,
          venue: row.venue,
        })),
      );
    });
  };
  const [inputState, setInputState] = useState(false);

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

  const getServiceCharges = () => {
    axios.get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=${68}`).then((r) => {
      setValue("serviceCharges", r.data.serviceCharge);
      setServiceCharges(r.data.serviceCharge);
    });
  };
  // useEffect(() => {
  //   console.log("router?.query?.role", router?.query?.role);
  //   reset(props?.data);
  //   console.log("propsyetoy", props);
  // }, []);
  const getLoiGenerationData = () => {
    axios.get(`${urls.SPURL}/groundBooking/getById?id=${props?.data?.id}`).then((r) => {
      if (r.status === 200) {
        const tempData = r?.data;
        setApplicableCharages(r?.data?.applicableCharages);

        console.log("getbyId", tempData);

        const _res = {
          ...tempData,
          fromBookingTime: moment(tempData.fromBookingTime).format("hh:mm A"),
          toBookingTime: moment(tempData.toBookingTime).format("hh:mm A"),
          _fromBookingTime: tempData.fromBookingTime,
          _toBookingTime: tempData.toBookingTime,
          // zone: zoneKeys?.find((obj) => obj?.id == tempData?.zone)?.zoneName,
          venue: tempData?.venue,
          // facilityName: facilityNames?.find((obj) => obj?.id == tempData?.facilityName)?.facilityName,
        };

        setData(_res);

        setValue("penaltyCharge", r.data.penaltyCharge);
        // setValue("serviceCharge", r.data.serviceCharge);
        // setData(r.data);
        setServiceId(r.data.serviceId);
        setValue("serviceName", r.data.serviceId);
        console.log("resp.data", _res);
        // reset(r.data);
        reset(_res);
      }
    });
  };

  useEffect(() => {
    console.log("45r", moment(watch("fromBookingTime")).format("hh:mm A"));
    watch("fromBookingTime") && moment("fromBookingTime", "HH:mm:ss").format("hh:mm A");
  });

  useEffect(() => {
    getserviceNames();
    getVenueNames();
  }, []);

  useEffect(() => {
    getLoiGenerationData();
  }, [serviceNames, venueNames]);

  useEffect(() => {
    setValue("serviceName", serviceId);
  }, [serviceId]);

  useEffect(() => {
    getServiceCharges();
  }, [serviceId]);

  // Handle Next
  const handleNext = (data) => {
    let finalBodyForApi = {
      ...data,
      fromBookingTime: data._fromBookingTime,
      toBookingTime: data._toBookingTime,
      id: props?.data?.id,
      role: props?.newRole,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.SPURL}/groundBooking/saveApplicationApprove`, finalBodyForApi).then((res) => {
      if (res.status == 200) {
        console.log("backendResponse", res);
        finalBodyForApi.id
          ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");

        router.push({
          pathname: "/sportsPortal/transaction/groundBookingNew/scrutiny/LoiGenerationReciptmarathi",
          query: {
            applicationId: getValues("id"),
          },
        });
      } else if (res.status == 201) {
        console.log("backendResponse", res);
        finalBodyForApi.id
          ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
          : sweetAlert("Saved !", "Record Saved successfully !", "success");

        router.push({
          pathname: "/sportsPortal/transaction/groundBookingNew/scrutiny/LoiGenerationReciptmarathi",
          query: {
            applicationId: getValues("id"),
          },
        });
      }
    });
  };

  useEffect(() => {
    console.log("venu123", watch("venue"));
  }, [watch("venue")]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <form onSubmit={handleSubmit(handleNext)}>
          {/* <h3>Application No. : {router?.query?.applicationNumber}</h3> */}
          <h3>Application No. : {getValues("applicationNumber")}</h3>
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
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch("applicationNumber") ? true : false) ||
                    (router?.query?.applicationNumber ? true : false),
                }}
                disabled={true}
                // label={<FormattedLabel id="applicationNo" />}
                label="Service Name"
                defaultValue="Ground Booking"
                // {...register("applicationNumber")}
                error={!!errors.applicationNumber}
                helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
              />
            </Grid>

            {/* <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch("applicationNumber") ? true : false) ||
                    (router?.query?.applicationNumber ? true : false),
                }}
                disabled={true}
                label={<FormattedLabel id="applicationNo" />}
                {...register("applicationNumber")}
                error={!!errors.applicationNumber}
                helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
              />
            </Grid> */}
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <FormControl sx={{ marginTop: 0 }} error={!!errors.applicationDate}>
                <Controller
                  name="applicationDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={true}
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
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink: (watch("firstName") ? true : false) || (router?.query?.firstName ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="firstName" />}
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors?.firstName ? errors.firstName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink: (watch("middleName") ? true : false) || (router?.query?.middleName ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="middleName" />}
                {...register("middleName")}
                error={!!errors.middleName}
                helperText={errors?.middleName ? errors.middleName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink: (watch("lastName") ? true : false) || (router?.query?.lastName ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="lastName" />}
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors?.lastName ? errors.lastName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch("emailAddress") ? true : false) || (router?.query?.emailAddress ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="email" />}
                {...register("emailAddress")}
                error={!!errors.emailAddress}
                helperText={errors?.emailAddress ? errors.emailAddress.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink: (watch("mobileNo") ? true : false) || (router?.query?.mobileNo ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="mobileNo" />}
                {...register("mobileNo")}
                error={!!errors.mobileNo}
                helperText={errors?.mobileNo ? errors.mobileNo.message : null}
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
              Booking Details
              {/* <FormattedLabel id="applicantDetails" /> */}
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
            {/* <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink: (watch("venue") ? true : false) || (router?.query?.venue ? true : false),
                }}
                disabled={true}
                label="Venue Name"
                {...register("venue")}
                error={!!errors.venue}
                helperText={errors?.venue ? errors.venue.message : null}
              />
            </Grid> */}
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <FormControl
                InputLabelProps={{
                  shrink: watch(router?.query?.venue),
                }}
                variant="standard"
                // sx={{ m: 1, minWidth: 120 }}
                error={!!errors.venue}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* <FormattedLabel id="zone" /> */}
                  Venue
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      {...register("venue")}
                      sx={{ minWidth: 220 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="venue"
                    >
                      {venueNames &&
                        venueNames.map((venue, index) => {
                          return (
                            <MenuItem key={index} value={venue.id}>
                              {venue.venue}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="venue"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.venue ? errors.venue.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch("applicationNumber") ? true : false) ||
                    (router?.query?.applicationNumber ? true : false),
                }}
                disabled={true}
                label={<FormattedLabel id="applicationNo" />}
                {...register("applicationNumber")}
                error={!!errors.applicationNumber}
                helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
              />
            </Grid> */}
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink: (watch("fromDate") ? true : false) || (router?.query?.fromDate ? true : false),
                }}
                disabled={true}
                // label={<FormattedLabel id="applicationNo" />}
                label="Date(From)"
                {...register("fromDate")}
                error={!!errors.fromDate}
                helperText={errors?.fromDate ? errors.fromDate.message : null}
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink: (watch("toDate") ? true : false) || (router?.query?.toDate ? true : false),
                }}
                disabled={true}
                // label={<FormattedLabel id="applicationNo" />}
                label="Date(To)"
                {...register("toDate")}
                error={!!errors.toDate}
                helperText={errors?.toDate ? errors.toDate.message : null}
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch("fromBookingTime") && moment("fromBookingTime", "HH:mm:ss").format("hh:mm A")
                      ? true
                      : false) || (router?.query?.fromBookingTime ? true : false),
                }}
                disabled={true}
                // label={<FormattedLabel id="applicationNo" />}
                label="Booking Time(From)"
                {...register("fromBookingTime")}
                error={!!errors.fromBookingTime}
                helperText={errors?.fromBookingTime ? errors.fromBookingTime.message : null}
              />
            </Grid>

            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch("toBookingTime") ? true : false) || (router?.query?.toBookingTime ? true : false),
                }}
                disabled={true}
                // label={<FormattedLabel id="applicationNo" />}
                label="Booking Time(To)"
                {...register("toBookingTime")}
                error={!!errors.toBookingTime}
                helperText={errors?.toBookingTime ? errors.toBookingTime.message : null}
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
              <FormattedLabel id="chargesDetails" />
            </strong>
          </div>

          <table id="table-to-xls" className={styles.report_table}>
            <thead>
              <tr>
                <th colSpan={2}>अ.क्र</th>
                <th colSpan={8}>शुल्काचे नाव</th>
                <th colSpan={2}>रक्कम (रु)</th>
                <th colSpan={2}>एकूण तास</th>
                <th colSpan={2}>एकूण दिवस</th>
                <th colSpan={2}>एकूण (रु)</th>
              </tr>
            </thead>
            <tbody>
              {applicableCharages?.map((r, i) => (
                <>
                  <tr>
                    <td colSpan={4}>{i + 1}</td>
                    <td colSpan={4}>{r.chargeTypeName}</td>
                    <td colSpan={4}>{r.amountPerHead}</td>
                    <td colSpan={2}>{r.chargeType == 2 ? "-" : r.hours}</td>
                    <td colSpan={2}>{r.chargeType == 2 ? "-" : r.chargableDays}</td>
                    <td colSpan={4}>{r.chargeType == 2 ? r.amountPerHead : r.totalAmount}</td>
                  </tr>
                </>
              ))}

              <tr>
                <td colSpan={4}>
                  <b></b>
                </td>
                <td colSpan={4}>
                  <b>एकूण रक्कम : </b>
                </td>
                <td colSpan={4}>
                  <b></b>
                  {/* <b>{applicableCharages?.totalAmount}</b> */}
                </td>
                <td colSpan={2}>
                  <b></b>
                  {/* <b>{applicableCharages?.totalAmount}</b> */}
                </td>
                <td colSpan={2}>
                  <b></b>
                  {/* <b>{applicableCharages?.totalAmount}</b> */}
                </td>
                <td colSpan={4}>
                  <b>{sum}</b>
                  {/* <b>{applicableCharages?.totalAmount}</b> */}
                </td>
              </tr>
            </tbody>
          </table>

          {/* <Grid
            container
            // key={index}
            sx={{
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid item xs={2} md={2} sm={2} xl={2} lg={2}></Grid>

            <Grid item xs={5} md={5} sm={5} xl={5} lg={5}>
              <TextField
                InputLabelProps={{ shrink: true }}
                // value="ग्राउंड बुकिंग"
                value="Ground Booking"
                sx={{ width: "240px" }}
                id="standard-basic"
                disabled={true}
                // key={serviceChargeId.id}
                label={<FormattedLabel id="chargeName" />}
                {...register(`serviceCharges.${0}.chargeName`)}
                // error={!!errors.charge}
                // helperText={errors?.charge ? errors.charge.message : null}
              />
            </Grid>
            <Grid item xs={5} md={5} sm={5} xl={5} lg={5}>
              <TextField
                InputLabelProps={{ shrink: true }}
                // value="50"
                sx={{ width: "250px" }}
                id="standard-basic"
                disabled={true}
                // key={serviceChargeId.id}
                // label={<FormattedLabel id="amount" />}
                label="Amount (Rs)"
                {...register("totalAmount")}
                // {...register(`serviceCharges.${0}.amount`)}
                // error={!!errors.amount}
                // helperText={errors?.amount ? errors.amount.message : null}
              />
            </Grid>
          </Grid>

          <Grid
            container
            sx={{
              paddingLeft: "50px",
              align: "center",
              backgroundColor: "primary",
              // border: "4px solid black",
            }}
          >
            <Grid item xs={2} md={2} sm={2} xl={2} lg={2}></Grid>
            <Grid item xs={5} md={5} sm={5} xl={5} lg={5}>
              <TextField
                // label={<FormattedLabel id="totalCharges" />}
                label="Total Charges (Rs)"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("totalAmount")}
                error={!!errors.total}
                helperText={errors?.total ? errors.total.message : null}
              />
            </Grid>
            <Grid item xs={5} md={5} sm={5} xl={5} lg={5}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="totalInWords" />}
                // {...register("loi.totalInWords")}
                // error={!!errors.totalInWords}
                // helperText={errors?.totalInWords ? errors.totalInWords.message : null}
              />
            </Grid>
          </Grid> */}
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
                  // onClick={() =>
                  //   router.push({
                  //     pathname:
                  //       '/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationReciptmarathi',
                  //     query: {
                  //       applicationId: getValues('id'),
                  //     },
                  //   })
                  // }
                >
                  <FormattedLabel id="generateLoi" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </ThemeProvider>
    </>
  );
};

export default LoiGenerationComponent;
