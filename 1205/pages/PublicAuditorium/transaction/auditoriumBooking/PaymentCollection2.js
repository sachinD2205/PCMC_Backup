import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { ToWords } from "to-words";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";

import styles from "./PaymentCollection.module.css";

const Index = (props) => {
  let user = useSelector((state) => state.user.user);
  const router = useRouter();
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  const [id, setid] = useState();

  const [total, setTotal] = useState();
  const [totalWord, setTotalWord] = useState("zero");
  const [chargePerCopy, setChargePerCopy] = useState(0);

  const [paymentNo, setPaymentNo] = useState();

  const onlinModes = [
    {
      id: 11,
      paymentModePrefixMr: null,
      paymentModePrefix: "Test payment Mode Prefix ",
      fromDate: "2022-12-11",
      toDate: "2022-12-12",
      paymentModeMr: null,
      paymentMode: "UPI",
      paymentTypeId: null,
      remark: "remark",
      remarkMr: null,
      activeFlag: "Y",
    },
    {
      id: 22,
      paymentModePrefixMr: null,
      paymentModePrefix: "test payment mode prefix 2",
      fromDate: "2019-02-11",
      toDate: "2022-10-10",
      paymentModeMr: null,
      paymentMode: "Net Banking",
      paymentTypeId: null,
      remark: "Done",
      remarkMr: null,
      activeFlag: "Y",
    },
  ];

  const [dataa, setDataa] = useState(null);
  const [showData, setShowData] = useState(null);
  const isDeptUser = useSelector((state) => state?.user?.user?.userDao?.deptUser);

  useEffect(() => {
    console.log("router.query", router?.query?.data && JSON.parse(router?.query?.data));
    router?.query?.data && setDataa(JSON.parse(router?.query?.data));
  }, []);

  const getAllData = () => {
    let id = dataa && dataa.applicationNumber;
    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`,
      )
      .then((res) => {
        console.log("respinse", res);
        setShowData(res?.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };




  useEffect(() => {
    getAllData();
  }, [dataa]);

  // useEffect(() => {
  //   if (localStorage.getItem("id") != null || localStorage.getItem("id") != "") {
  //     setid(localStorage.getItem("id"));
  //   }
  //   if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
  //     setApplicationRevertedToCititizen(true);
  //     setApplicationRevertedToCititizenNew(false);
  //     setValue("disabledFieldInputState", true);
  //   } else {
  //     //   setApplicationRevertedToCititizen(false);
  //     //   setApplicationRevertedToCititizenNew(true);
  //     //   setValue("disabledFieldInputState", false);
  //   }
  // }, []);

  // useEffect
  useEffect(() => {
    // getFacilityTypes();
    // getFacilityName();
  }, []);
  const [facilityNames, setFacilityNames] = useState([]);
  const getFacilityName = () => {
    axios.get(`${urls.SPURL}/facilityName/getAll`).then((r) => {
      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityNameMr: row.facilityNameMr,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        })),
      );
    });
  };

  const toWords = new ToWords();
  useEffect(() => {
    // getSwimmingData();
  }, [facilityNames]);

  // useEffect(() => {
  //   axios.get(`${urls.SPURL}/swimmingPool/getById?id=${props?.id}`).then((res) => {
  //     console.log("vghsvxha", res);
  //     reset(res.data);
  //     setDataa(res.data);
  //   });
  // }, []);

  useEffect(() => {
    if (total) {
      if (router.query.serviceId != 9) {
        console.log("total", total, typeof total);
        setTotalWord(toWords.convert(total));
      }
    }
  }, [total]);

  useEffect(() => {
    if (watch("charges")) {
      if (watch("charges") == undefined || watch("charges") === 0) {
        setTotalWord("zero");
      } else {
        setTotalWord(toWords.convert(watch("charges")));
      }
    } else {
      setTotalWord("zero");
    }
  }, [watch("charges")]);

  useEffect(() => {
    console.log("deid");
    let tempCharges = watch("noOfCopies") * chargePerCopy;
    setValue("charges", tempCharges);
  }, [watch("noOfCopies")]);

  const validatePay = () => {
    if (
      watch("accountNumber") === undefined ||
      watch("accountNumber") === "" ||
      watch("bankName") === undefined ||
      watch("bankName") === "" ||
      watch("branchName") === undefined ||
      watch("branchName") === "" ||
      watch("ifsc") === undefined ||
      watch("ifsc") === ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const getNextKey = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`).then((res) => {
      console.log("Swimming Data", res);
      const tempData = res?.data;
      setPaymentNo(tempData);
    });
  };

  const handleExit = () => {
    swal("Exit!", "Successfully Exitted  Payment!", "success");
    isDeptUser
      ? router.push(`/PublicAuditorium/transaction/bookedPublicAuditorium`)
      : router.push(`/dashboard`);
  };

  const handlePay = () => {
    // router.push({
    //   pathname: "./paymentSlip",
    //   query: {
    //     dataa : JSON.stringify(dataa),
    //   },
    // });
    // router.push("/sportsPortal/transaction/swimmingPool/ServiceChargeRecipt");
    // setValue('payment.amount', dataa?.loi?.amount)
    // console.log(' dataa?.id', dataa?.id)
    // const finalBody = {
    //   id: Number(dataa?.id),
    //   role: 'CASHIER',
    //   loi: getValues('loi'),
    //   payment: getValues('payment'),
    // }
    console.log("first",showData)

    const _paymentType = watch("payment.paymentType")
    const _paymentMode = watch("payment.paymentMode")

    const finalBody = {
      ...showData,
      auditoriumId: showData._auditoriumId,
      eventDate: moment(showData.eventDate, "YYYY/MM/DD").format(`YYYY-MM-DD`),
      id: showData.id,
      paymentDao: {
        depositAmount: showData.depositAmount,
        rentAmount: showData.rentAmount,
        paymentNumber: paymentNo,
        paymentType : _paymentType,
        paymentMode : _paymentMode
      },
      processType: "B",
      designation:"Citizen"
    };

    console.log("finalBody", finalBody);

    axios
      // .post(
      //   `http://192.168.68.145:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/processPaymentCollection`,
      //   finalBody,
      // )
      .post(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/processPaymentCollection`, finalBody)
      .then((res) => {
        console.log("omkar",{...router?.query},router);
        swal("Submitted!", "Payment Collected successfully !", "success");
        router.push({
          pathname: "./paymentSlip",
          query: {
            ...router?.query,
          },
        });
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong!", "error");
        // router.push('/sportsPortal/transaction/groundBookingNew/scrutiny')
      });
  };

  const language = useSelector((state) => state?.labels.language);

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
  const [pmode, setPmode] = useState([]);
  const getPaymentModes = () => {
    axios.get(`${urls.BaseURL}/paymentMode/getAll`).then((r) => {
      setPmode(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        })),
      );
    });
  };

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    getNextKey();
  }, []);

  useEffect(() => {
    console.log("paymenttype", watch("payment.paymentType"));
    if (watch("payment.paymentType") == 2) {
      setPaymentModes(onlinModes);
    } else {
      setPaymentModes(pmode);
    }
  }, [watch("payment.paymentType")]);
  // const [data, setdata] = useState()

  useEffect(() => {}, [dataa]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 10,
            marginRight: 2,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
            border: 2,
            borderColor: "black.500",
          }}
        >
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                Payment Collection
              </h3>
            </div>
          </div>
          <div className={styles.appDetails}>
            {/* <div className={styles.row} >
                              <div > */}
            <h4>अर्जाचा क्रमांक : {showData?.applicationNumber}</h4>
            {/* </div>
                          </div>
                          <div className={styles.row1}>
                              <div > */}
            <h4>अर्जादारचे नाव :{" " + showData?.applicantName}</h4>
            <h4>मोबाईल नंबर:{" " + showData?.applicantMobileNo}</h4>

            {/* </div>
                          </div>
                          <div className={styles.row1}>
                              <div > */}
            {/* <h4>
                अर्ज दिनांक : {} {" " + moment(showData?.applicationDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
              </h4> */}
            {/* </div>
                          </div>
                          <div className={styles.row1}>
                              <div > */}
            {/* </div>
                          </div> */}
            <div className={styles.row5}></div>
            {/* <h4>एकुण रक्कम : {showData?.totalAmount} रु</h4> */}
            {/* <h4>एकुण रक्कम : 10 रु</h4> */}

            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={2}>अ.क्र</th>
                  <th colSpan={8}> नाव</th>
                  <th colSpan={2}>रक्कम (रु)</th>
                </tr>
                <tr>
                  <td colSpan={4}>1)</td>
                  <td colSpan={4}>Deposite</td>
                  <td colSpan={4}>{showData?.depositAmount} रु</td>
                </tr>
                <tr>
                  <td colSpan={4}>2)</td>
                  <td colSpan={4}>Rent</td>
                  <td colSpan={4}>{showData?.rentAmount} रु</td>
                </tr>
                <tr>
                  <td colSpan={4}>3)</td>
                  <td colSpan={4}>Security Guard Charges</td>
                  <td colSpan={4}>{showData?.securityGuardChargeAmount} रु</td>
                </tr>
                <tr>
                  <td colSpan={4}>4)</td>
                  <td colSpan={4}>Board Charges</td>
                  <td colSpan={4}>{showData?.boardChargesAmount} रु</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4}>
                    <b></b>
                  </td>
                  <td colSpan={4}>
                    <b></b>
                  </td>
                  <td colSpan={4}>
                    <b>एकूण रक्कम : {showData?.totalAmount} रु (18% GST (CGST + SGST))</b>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className={styles.details}>
              <div className={styles.h1Tag}>
                <h3
                  style={{
                    color: "white",
                    marginTop: "7px",
                  }}
                >
                  Receipt Mode Details
                  {/* <FormattedLabel id="receiptModeDetails" /> */}
                </h3>
              </div>
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
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <FormControl error={!!errors.paymentType} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* {<FormattedLabel id="paymentType" />} */}
                    Payment Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ minWidth: "230px" }}
                        // // dissabled={inputState}
                        autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Payment Type"
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {paymentTypes &&
                          paymentTypes.map((paymentType, index) => (
                            <MenuItem key={index} value={paymentType.id}>
                              {language == "en" ? paymentType?.paymentType : paymentType?.paymentTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="payment.paymentType"
                    control={control}
                    defaultValue=""
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <FormControl error={!!errors.paymentMode} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* {<FormattedLabel id="paymentMode" />} */}
                    Payment Mode
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
                        // label={<FormattedLabel id="paymentMode" />}
                        label="Payment Mode"
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {paymentModes &&
                          paymentModes.map((paymentMode, index) => (
                            <MenuItem key={index} value={paymentMode.id}>
                              {language == "en" ? paymentMode?.paymentMode : paymentMode?.paymentModeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="payment.paymentMode"
                    control={control}
                    defaultValue=""
                  />
                </FormControl>
              </Grid>

              {/* {watch("payment.paymentMode") == "DD" && ( */}
              {watch("payment.paymentMode") == 1 && (
                <>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      label="Bank Name"
                      variant="standard"
                      {...register("payment.bankName")}
                      error={!!errors.bankName}
                      helperText={errors?.bankName ? errors.bankName.message : null}
                    />
                  </Grid>

                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      label="Bank Account No"
                      variant="standard"
                      {...register("payment.accountNo")}
                      error={!!errors.accountNo}
                      helperText={errors?.accountNo ? errors.accountNo.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      label="DD No"
                      variant="standard"
                      {...register("payment.ddNo")}
                      error={!!errors.ddNo}
                      helperText={errors?.ddNo ? errors.ddNo.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <FormControl sx={{ marginTop: 0 }} error={!!errors.dDDate}>
                      <Controller
                        name="payment.ddDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16, marginTop: 2 }}>
                                  {/* <FormattedLabel id="ddDate" /> */}
                                  DD Date
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
                      <FormHelperText>{errors?.ddDate ? errors.ddDate.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}

              {/* {watch("payment.paymentMode") == "CASH" && ( */}
              {watch("payment.paymentMode") == 2 && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="receiptAmount" />}
                      label="Receipt Amount"
                      variant="standard"
                      {...register("payment.receiptAmount")}
                      error={!!errors.receiptAmount}
                      helperText={errors?.receiptAmount ? errors.receiptAmount.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="receiptNumber" />}
                      label="Receipt Number"
                      variant="standard"
                      {...register("payment.receiptNo")}
                      error={!!errors.receiptNo}
                      helperText={errors?.receiptNo ? errors.receiptNo.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <FormControl sx={{ marginTop: 0 }} error={!!errors.receiptDate}>
                      <Controller
                        name="payment.receiptDate"
                        control={control}
                        defaultValue={moment()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16, marginTop: 2 }}>
                                  {/* <FormattedLabel id="receiptDate" /> */}
                                  Receipt Date
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
                        {errors?.receiptDate ? errors.receiptDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}

              {/* {watch("payment.paymentMode") == "UPI" && ( */}
              {watch("payment.paymentMode") == 11 && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="bankName" />}
                      label="UPI ID"
                      variant="standard"
                      {...register("payment.upiId")}
                      error={!!errors.upiId}
                      helperText={errors?.upiId ? errors.upiId.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                    <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.upilist}>
                      <InputLabel id="demo-simple-select-standard-label">UPI LIST</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Status at time of marriage *"
                          >
                            <MenuItem value={1}>@ybl</MenuItem>
                            <MenuItem value={2}>@okaxis</MenuItem>
                            <MenuItem value={3}>@okicici</MenuItem>
                          </Select>
                        )}
                        name="upilist"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.upilist ? errors.upilist.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}

              {/* {watch("payment.paymentMode") == "Net Banking" && ( */}
              {watch("payment.paymentMode") == 22 && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label={<FormattedLabel id="bankName" required />}
                      label="Bank Name"
                      variant="standard"
                      {...register("bankName")}
                      // error={!!errors.aFName}
                      // helperText={errors?.aFName ? errors.aFName.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="branchName" />}
                      label="Branch Name"
                      variant="standard"
                      {...register("branchName")}
                      error={!!errors.branchName}
                      helperText={errors?.branchName ? errors.branchName.message : null}
                    />
                  </Grid>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label={<FormattedLabel id="ifsc" required />}
                      label="ifsc"
                      variant="standard"
                      {...register("ifsc")}
                      // error={!!errors.aFName}
                      // helperText={errors?.aFName ? errors.aFName.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      label="Account Number"
                      variant="standard"
                      {...register("accountNumber")}
                      // error={!!errors.aFName}
                      // helperText={errors?.aFName ? errors.aFName.message : null}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <div>
              <div className={styles.row4}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    //disabled={validatePay()}
                    onClick={() => {
                      handlePay();
                    }}
                  >
                    {/* {<FormattedLabel id="pay" />} */}
                    Pay
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    // disabled={validateSearch()}
                    onClick={() => {
                      swal({
                        title: "Exit?",
                        text: "Are you sure you want to exit this Record ? ",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      }).then((willDelete) => {
                        if (willDelete) {
                          swal("Record is Successfully Exit!", {
                            icon: "success",
                          });
                          handleExit();
                        } else {
                          swal("Record is Safe");
                        }
                      });
                    }}
                    // onClick={() => {
                    //   handleExit()
                    // }}
                  >
                    {/* {<FormattedLabel id="exit" />} */}
                    Exit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
