import {
  Grid,
  FormControl,
  TextField,
  FormHelperText,
  InputLabel,
  Paper,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import styles from "../../../../styles/fireBrigadeSystem/print.module.css";
// import Swal from "sweetalert2";
// import ComponentToPrint from "./print/ComponentToPrint";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { language } from "../../../../features/labelSlice";
import { useSelector } from "react-redux";
import style from "../../../../styles/fireBrigadeSystem/view.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const PaymentDetails = () => {
  const token = useSelector((state) => state.user.user.token);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [paymentMode, setPaymentMode] = useState();

  const language = useSelector((state) => state?.labels.language);

  const [chequeDateValue, setChequeDateValue] = React.useState(null);
  const [cashDateValue, setCashDateValue] = React.useState(null);
  const [onlineDateValue, setOnlineDateValue] = React.useState(null);
  const [rtgsDateValue, setRtgsDateValue] = React.useState(null);
  const [ddDateValue, setDdDateValue] = React.useState(null);

  const [valuePaymentMode, setValuePaymentMode] = React.useState();

  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  //Button Click Function

  const opensweetalert = () => {
    // Swal.fire({
    //   title: "Pay",
    //   text: "Are you Sure Want to Pay",
    //   type: "confirmation",
    // });
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("Table Data");

      console.log("hello", router.query);
      reset(router.query);
    }
  }, []);

  const opensweetalertdanger = () => {
    // Swal.fire({
    //   title: "Cancel",
    //   text: "Are You Sure Want To Cancel",
    //   type: "confiramtion",
    // });
  };

  //   // console.log("fromData", fromData);
  //   // const finalBody = {
  //   //   ...fromData,
  //   //   dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
  //   //     "YYYY-MM-DDThh:mm:ss"
  //   //   ),
  //   // };
  //   // axios
  //   //   .post(`${urls.BaseURL}/transaction/trnEmergencyServices/save`, finalBody)
  //   //   .then((res) => {
  //   //     if (res.status == 200) {
  //   //       fromData.id
  //   //         ? sweetAlert("Update!", "Record Updated successfully !", "success")
  //   //         : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //   //       router.back();
  //   //     }
  //   //   });
  // };

  //   const handleSubmit = () => {
  //     sweetAlert("Update!", "Record Updated successfully !", "success");
  //     sweetAlert("Saved!", "Record Saved successfully !", "success");
  //   };

  useEffect(() => {
    getUser();
    getPaymentMode();
  }, []);

  const getPaymentMode = () => {
    axios
      .get(`${urls.FbsURL}/master/paymentMode/getAll`)
      .then((res) => {
        console.log("ttttt", res?.data?.paymentMode);
        setPaymentMode(res?.data?.paymentMode);
      })
      .catch((err) => console.log(err));
  };

  // get employee from cfc
  const getUser = () => {
    axios.get(`${urls.CFCURL}transaction/paymentDetails/getAll`).then((res) => {
      setUserLst(res?.data);
      console.log(res, "payscreen data.................");
    });
  };

  var record = {
    serviceName: "priyanka aglave",
    amountInWord: "",
  };

  const onSubmitForm = (fromData) => {
    console.log("formData", fromData);

    let nonfinal = {
      ...fromData,
      id: null,
      isPayment: "Y",
      // id: router?.query?.id,
      chequeDate:
        fromData.chequeDate == "Invalid date"
          ? null
          : moment(fromData.chequeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      cashDate: fromData.cashDate
        ? moment(fromData.cashDate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : null,
      onlineDate: fromData.onlineDate
        ? moment(fromData.onlineDate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : null,
      rtgsDate: fromData.rtgsDate
        ? moment(fromData.rtgsDate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : null,
      ddDate: fromData.ddDate
        ? moment(fromData.ddDate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : null,

      // dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
      //   "YYYY-MM-DDThh:mm:ss"
      // ),
      // departureTime: moment(fromData.departureTime, "HH:mm").format("HH:mm"),
    };
    console.log("nonfinal", nonfinal);

    const finalBody = {
      id: router?.query?.id ? router.query.id : null,

      isPayment: "Y",
      role: "LOI_COLLECTION",
      desg: "LOI_COLLECTION",
      id: router?.query?.id,
      paymentDetails: nonfinal,

      // ...fromData,
      // isPayment: "Y",
      // chequeDate: moment(fromData.chequeDate, "YYYY-MM-DD").format(
      //   "YYYY-MM-DD"
      // ),
      // // dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
      // //   "YYYY-MM-DDThh:mm:ss"
      // // ),
      // departureTime: moment(fromData.departureTime, "HH:mm").format("HH:mm"),
    };

    console.log("Form Data of iod", finalBody);
    axios
      .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          // router.push({
          //   pathname: "/FireBrigadeSystem/transactions/finalAhawal/print",
          //   query: {
          //     ...finalBody,
          //   },
          // });
          router.back();
          // setFetchData(tempData);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);
        }
      });
  };
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
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Box className={style.tableHead}>
                <Box className={style.feildHead}>
                  {<FormattedLabel id='paymentDetails' />}
                </Box>
              </Box>
              <br />
              <br />
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    // size="small"
                    id='standard-basic'
                    // label={<FormattedLabel id="billPayerName" />}
                    label='First Name'
                    variant='standard'
                    {...register("billPayerName")}
                    error={!!errors.billPayerName}
                    helperText={
                      errors?.billPayerName
                        ? errors.billPayerName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    // label={<FormattedLabel id="billPayerMiddleName" />}
                    label='Middle Name'
                    variant='standard'
                    {...register("billPayerMiddleName")}
                    error={!!errors.billPayerMiddleName}
                    helperText={
                      errors?.billPayerMiddleName
                        ? errors.billPayerMiddleName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    // label={<FormattedLabel id="billPayerLastName" />}
                    label='Last Name'
                    variant='standard'
                    {...register("billPayerLastName")}
                    error={!!errors.billPayerLastName}
                    helperText={
                      errors?.billPayerLastName
                        ? errors.billPayerLastName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    // label={<FormattedLabel id="billPayerNameMr" />}
                    label='Name (In Marathi)'
                    variant='standard'
                    {...register("billPayerNameMr")}
                    error={!!errors.billPayerNameMr}
                    helperText={
                      errors?.billPayerNameMr
                        ? errors.billPayerNameMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    // label={<FormattedLabel id="billPayerMiddleMr" />}
                    label='Middle Name (In Marathi)'
                    variant='standard'
                    {...register("billPayerMiddleMr")}
                    error={!!errors.billPayerMiddleMr}
                    helperText={
                      errors?.billPayerMiddleMr
                        ? errors.billPayerMiddleMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    // label={<FormattedLabel id="billPayerLastNameMr" />}
                    label='Last Name (In Marathi)'
                    variant='standard'
                    {...register("billPayerLastNameMr")}
                    error={!!errors.billPayerLastNameMr}
                    helperText={
                      errors?.billPayerLastNameMr
                        ? errors.billPayerLastNameMr.message
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
                    id='standard-basic'
                    label={<FormattedLabel id='area' />}
                    variant='standard'
                    {...register("billPayeraddress")}
                    error={!!errors.billPayeraddress}
                    helperText={
                      errors?.billPayeraddress
                        ? errors.billPayeraddress.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='city' />}
                    variant='standard'
                    {...register("billPayerVillage")}
                    error={!!errors.billPayerVillage}
                    helperText={
                      errors?.billPayerVillage
                        ? errors.billPayerVillage.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='contactNumber' />}
                    variant='standard'
                    {...register("billPayerContact")}
                    error={!!errors.billPayerContact}
                    helperText={
                      errors?.billPayerContact
                        ? errors.billPayerContact.message
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='areaMr' />}
                    variant='standard'
                    {...register("billPayeraddressMr")}
                    error={!!errors.billPayeraddressMr}
                    helperText={
                      errors?.billPayeraddressMr
                        ? errors.billPayeraddressMr.message
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='cityMr' />}
                    variant='standard'
                    {...register("billPayerVillageMr")}
                    error={!!errors.billPayerVillageMr}
                    helperText={
                      errors?.billPayerVillageMr
                        ? errors.billPayerVillageMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='email' />}
                    variant='standard'
                    {...register("billPayerEmail")}
                    error={!!errors.billPayerEmail}
                    helperText={
                      errors?.billPayerEmail
                        ? errors.billPayerEmail.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <br />
              <br />
              <Box className={style.tableHead}>
                <Box className={style.feildHead}>
                  {/* {<FormattedLabel id="paymentDetails" />} */}
                  Payment Details
                </Box>
              </Box>
              <br />
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    id='totalAmount'
                    //   label={<FormattedLabel id="informerLastName" />}
                    label='Total amount (In Rs)'
                    variant='standard'
                    {...register("totalAmount")}
                    error={!!errors.totalAmount}
                    helperText={
                      errors?.totalAmount ? errors.totalAmount.message : null
                    }
                  />
                </Grid>
                <Grid item xs={8} className={styles.feildres}>
                  <TextField
                    sx={{ width: "80%" }}
                    fullWidth
                    id='amountInWord'
                    //   label={<FormattedLabel id="informerLastName" />}
                    label='Amount in words'
                    variant='standard'
                    {...register("amountInWord")}
                    error={!!errors.amountInWord}
                    helperText={
                      errors?.amountInWord ? errors.amountInWord.message : null
                    }
                  />
                </Grid>
                {/* <Grid item xs={} className={styles.feildres}></Grid> */}
              </Grid>
              <br />
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={4} className={styles.feildres}>
                  <FormControl
                    sx={{ width: "80%" }}
                    variant='standard'
                    error={!!errors.modeOfPayment}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      Payment Mode
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            setValuePaymentMode(value.target.value);
                          }}
                          label='Payment Mode'
                        >
                          {paymentMode &&
                            paymentMode.map((mode, index) => (
                              <MenuItem key={mode.id} value={mode.id}>
                                {language == "en"
                                  ? mode.paymentMode
                                  : mode.paymentModeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='modeOfPayment'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {errors?.modeOfPayment
                        ? errors.modeOfPayment.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4} className={styles.feildres}></Grid>
                <Grid item xs={4} className={styles.feildres}></Grid>
              </Grid>
              {/* Cheque */}
              {valuePaymentMode == 2 || valuePaymentMode == "Cheque" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='Bank Name'
                        variant='standard'
                        {...register("bankName")}
                        error={!!errors.bankName}
                        helperText={
                          errors?.bankName ? errors.bankName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='Cheque No'
                        variant='standard'
                        {...register("chequeNo")}
                        error={!!errors.chequeNo}
                        helperText={
                          errors?.chequeNo ? errors.chequeNo.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.chequeDate}
                      >
                        <Controller
                          control={control}
                          name='chequeDate'
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    cheque Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
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
                          {errors?.chequeDate
                            ? errors.chequeDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* Cash */}
              {valuePaymentMode == 1 || valuePaymentMode == "Cash" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='CFC Center/ Counter'
                        variant='standard'
                        {...register("cfcCenter")}
                        error={!!errors.cfcCenter}
                        helperText={
                          errors?.cfcCenter ? errors.cfcCenter.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.cashDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(cDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name='cashDate'
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Cash Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
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
                          {errors?.cashDate ? errors.cashDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* Online */}
              {valuePaymentMode == 3 || valuePaymentMode == "Online" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='UPI ID'
                        variant='standard'
                        {...register("onlineUpiID")}
                        error={!!errors.onlineUpiID}
                        helperText={
                          errors?.onlineUpiID
                            ? errors.onlineUpiID.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='bankName'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='Reference Number'
                        variant='standard'
                        {...register("referenceNo")}
                        error={!!errors.referenceNo}
                        helperText={
                          errors?.referenceNo
                            ? errors.referenceNo.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.onlineDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(onlineDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name='onlineDate'
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Online Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
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
                          {errors?.onlineDate
                            ? errors.onlineDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* RTGS */}
              {valuePaymentMode == 4 || valuePaymentMode == "RTGS" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='UTR ID'
                        variant='standard'
                        {...register("rtgsUtrNo")}
                        error={!!errors.rtgsUtrNo}
                        helperText={
                          errors?.rtgsUtrNo ? errors.rtgsUtrNo.message : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.rtgsDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(rtgsDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name='rtgsDate'
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    RTGS Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
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
                          {errors?.rtgsDate ? errors.rtgsDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* DD */}
              {valuePaymentMode == 5 ||
              valuePaymentMode == "DD- demand draft" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='bankName'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='DD Number'
                        variant='standard'
                        {...register("ddNo")}
                        error={!!errors.ddNo}
                        helperText={errors?.ddNo ? errors.ddNo.message : null}
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.ddDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(ddDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name='ddDate'
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>DD Date</span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
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
                          {errors?.ddDate ? errors.ddDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* ..........................................*************.................. */}

              {/* ..................******************.................. */}

              {/* ......................**********************....................... */}

              {/* <Box>
                <div>
                  Service Charges: <b>1600</b> <br />
                  Distance from fire station: 8 charges per km: 200
                </div>
                <Button
                  variant="contained"
                  //   onClick={sweetAlert("Are You Sure")}
                >
                  Pay
                </Button>
              </Box> */}
              {/* <Box
                style={{
                  margin: "4%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingTop: "6%",
                }}
              >
                <Paper
                  sx={{
                    margin: 1,
                    padding: 2,
                    backgroundColor: "#F5F5F5",
                  }}
                  elevation={5}
                > */}

              {/* </Paper> */}
              {/* </Box> */}
              <br />
              <br />

              <Grid container className={style.feildres} spacing={2}>
                <Grid item>
                  <Button
                    type='submit'
                    size='small'
                    variant='outlined'
                    className={styles.button}
                    endIcon={<SaveIcon />}
                  >
                    {btnSaveText == "Update" ? (
                      "Update"
                    ) : (
                      <FormattedLabel id='save' />
                    )}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size='small'
                    variant='outlined'
                    className={styles.button}
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    {<FormattedLabel id='clear' />}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size='small'
                    variant='outlined'
                    className={styles.button}
                    endIcon={<ExitToAppIcon />}
                    onClick={() =>
                      router.push({
                        pathname: "/FireBrigadeSystem/transactions/finalAhawal",
                      })
                    }
                  >
                    {<FormattedLabel id='exit' />}
                  </Button>
                </Grid>
                {/* <Grid item>
                  
        <Button
          variant="contained"
          onClick={() =>
            router.push({
              pathname: "/FireBrigadeSystem/transactions/finalAhawal/forPrint",
              query: {
                ...record
              },
            })
          }
        >
          View
        </Button>
        </Grid> */}
              </Grid>
            </form>
          </FormProvider>
        </Paper>
      </Box>
      {/* <Box sx={{ backgroundColor: "white", height: "50vh", paddingTop: "5%" }}>
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={styles.feildres}
        >
          <Grid item xs={4} className={styles.feildres}></Grid>
          <Grid item xs={4} className={styles.feildres}>
            <div>
              Service Charges: <b>1600</b> <br />
              Distance from fire station: 8 <br />
              charges per km: 200
            </div>
          </Grid>
          <Grid item xs={4} className={styles.feildres}></Grid>
          <Grid item xs={4} className={styles.feildres}></Grid>

          <Grid
            item
            xs={4}
            style={{ paddingTop: "4%" }}
            className={styles.feildres}
          >
            <Button
              variant="contained"
              sx={{ margin: "1%" }}
              onClick={opensweetalert}
            >
              Pay
            </Button>
            <Button variant="contained" onClick={opensweetalertdanger}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={4} className={styles.feildres}></Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={() =>
            router.push({
              pathname: "/FireBrigadeSystem/transactions/finalAhawal/forPrint",
              query: {
                ...record
              },
            })
          }
        >
          View
        </Button>
      </Box> */}
    </>
  );
};

export default PaymentDetails;
