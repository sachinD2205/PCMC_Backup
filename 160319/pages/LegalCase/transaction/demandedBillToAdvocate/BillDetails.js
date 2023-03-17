import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { demandBillDetailsSchema } from "../../../../containers/schema/LegalCaseSchema/demandedBillToAdvocateSchema";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";

const BillDetails = () => {
  /** Author - Sachin Durge */
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(demandBillDetailsSchema),
  });

  // destructure methods form methods
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const [billDetailsDailog, setBillDetailsDailog] = useState(false);
  const billDetailsDailogOpen = () => setBillDetailsDailog(true);
  const billDetailsDailogClose = () => setBillDetailsDailog(false);
  const router = useRouter();
  const token = useSelector((state) => state.user.user.token);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [advocateNames, setAdvocateNames] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [slideChecked, setSlideChecked] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const [data, setData] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [newData, setNewData] = useState();
  const [caseNo, setCaseNo] = useState();
  const [caseType, setCasType] = useState();
  const [caseSubType, setCasSubType] = useState();
  const [payment, setPayment] = useState();
  const [paidFees, setPaidAmount] = useState();
  const [feesAmount, setBillAmount] = useState();
  const [pendingFees, setPendingAmount] = useState();
  const [courtCaseEntries, setCourtCaseEntries] = useState([]);
  const [selectedCaseEntry, setSelectedCaseEntry] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [courtNames, setCourtNames] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);
  const user = useSelector((state) => state.user.user.userDao);
  const [temp, setTemp] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseSubTypes, setcaseSubTypes] = useState([]);
  const [caseNumbers, setCaseNumbers] = useState([]);
  const [paymentRates, setPaymentRates] = useState([]);
  const [filterDataSource, setFilterDataSource] = useState([]);
  const [caseNoCount, setCaseNoCount] = useState([0]);
  const [billDetailComponent, setBillDetailComponent] = useState(true);
  const [approvalAmountInputState, setApprovalAmountInputState] =
    useState(true);
  const [caseNumbers1, setCaseNumbers1] = useState([]);
  const [approvalAmountDisabledState, setApprovalAmountDisabledState] =
    useState(false);

  const [paidAmountInputState, setPaidAmountInputState] = useState(true);
  let newArray = [];
  // table hide buttons
  const [approvalAmountTableState, setApprovalAmountTableState] =
    useState(true);
  const [paidAmountTableState, setPaidAmountTableState] = useState(true);
  const [
    demandedBillTableActionButtonInputState,
    setDemandedBillTableActionButtonInputState,
  ] = useState(true);

  /* Case Number  - Court Case Number*/
  const getcaseNumber = () => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCourtCaseEntryByAdvocateId?advocateId=${user.advocateId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setTemp(res.data.newCourtCaseEntry);
        console.log("newDatadfd", res?.data?.newCourtCaseEntry);
        setCaseNumbers(
          res?.data?.newCourtCaseEntry?.map((r, i) => ({
            id: r.id,
            caseNumber: r.caseNumber,
          })),
        );
      });
  };

  /* Case Type  - Case Main Type*/
  const getCaseNumberAll = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`)
      .then((res) => {
        setCaseNumbers1(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            caseNumber: r.caseNumber,
          })),
        );
      });
  };

  /* Case Type  - Case Main Type*/
  const getcaseMainTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseMainType/getAll`).then((res) => {
      setCaseMainTypes(
        res.data.caseMainType.map((r, i) => ({
          id: r.id,
          caseMainType: r.caseMainType,
          caseMainTypeMr: r.caseMainTypeMr,
        })),
      );
    });
  };

  /* Case Sub Type */
  const getCaseSubTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseSubType/getAll`).then((res) => {
      setcaseSubTypes(
        res.data.caseSubType.map((r, i) => ({
          id: r.id,
          // caseMainType: r.caseMainType,
          subType: r.subType,
          caseSubTypeMr: r.caseSubTypeMr,
        })),
      );
    });
  };

  /** Payment Rate Master */
  const getPaymentRateMaster = () => {
    axios.get(`${urls.LCMSURL}/master/paymentRate/getAll`).then((res) => {
      setPaymentRates(res.data.paymentRate);
    });
  };

  /* Based on casenumber set casemaintype and casesubtype*/
  useEffect(() => {
    temp.find((data) => {
      if (data?.id == watch("caseNumber")) {
        setValue("caseMainType", data?.caseMainType);

        setValue(
          "caseMainTypeMar",
          caseMainTypes.find((filterData) => {
            return filterData?.id == data?.caseMainType;
          })?.caseMainTypeMr,
        );

        setValue(
          "caseMainTypeEng",
          caseMainTypes.find((filterData) => {
            return filterData?.id == data?.caseMainType;
          })?.caseMainType,
        );

        setValue(
          "caseSubTypeMar",
          caseSubTypes.find((filterData) => {
            return filterData?.id == data?.subType;
          })?.caseSubTypeMr,
        );

        setValue(
          "caseSubTypeEng",
          caseSubTypes.find((filterData) => {
            return filterData?.id == data?.subType;
          })?.subType,
        );

        setValue("caseSubType", data?.subType);
        // setValue("paidFees", "0");

        return;
      }
    });
  }, [watch("caseNumber")]);

  /* Case Fees --> Based On CaseMainType and CaseSubType set Case Fees */
  useEffect(() => {
    paymentRates?.find((data) => {
      if (
        data?.caseMainTypeId == watch("caseMainType") &&
        data?.caseSubType == watch("caseSubType")
      ) {
        console.log("caseType and case Main Type Match", data.rate);
        setValue("caseFees", data?.rate);
        setValue("feesAmount", 0);
      }
    });
  }, [watch("caseSubType")]);

  /** Pending Fees ---> Calculate based on caseFees - PaidFees  */
  useEffect(() => {
    let pendingFees;

    if (
      watch("caseFees") == 0 ||
      watch("caseFees") == "" ||
      watch("caseFees") == null ||
      watch("caseFees") == undefined ||
      watch("caseFees") == NaN
    ) {
      setValue("caseFees");
      console.log("feesAmount3434", watch("feesAmount"));
    } else if (
      watch("feesAmount") == 0 ||
      watch("feesAmount") == "" ||
      watch("feesAmount") == null ||
      watch("feesAmount") == undefined ||
      watch("feesAmount") == NaN
    ) {
      setValue("feesAmount");
      console.log("feesAmount", watch("feesAmount"));
      pendingFees = watch("caseFees") - watch("paidFees");
    } else {
      console.log("feesAmount123", watch("feesAmount"));
      pendingFees = watch("caseFees") - watch("paidFees") - watch("feesAmount");
    }

    /** set updated pending fees */
    if (
      pendingFees != null ||
      pendingFees != undefined ||
      pendingFees != NaN ||
      pendingFees != 0 ||
      pendingFees != ""
    ) {
      setValue("pendingFees", pendingFees);
    }
  }, [watch("caseFees"), watch("paidFees"), watch("feesAmount")]);

  useEffect(() => {
    getcaseNumber();
    getcaseMainTypes();
    getCaseSubTypes();
    getCaseNumberAll();
    getPaymentRateMaster();

    if (localStorage.getItem("approvalAmountInputState") == "false") {
      setApprovalAmountInputState(false);
    } else {
      setApprovalAmountInputState(true);
    }

    if (localStorage.getItem("paidAmountInputState") == "false") {
      setPaidAmountInputState(false);
    } else if (localStorage.getItem("paidAmountInputState") == "true") {
      setPaidAmountInputState(true);
    } else {
      setPaidAmountInputState(true);
    }

    /** Table Action Button */
    if (
      localStorage.getItem("demandedBillTableActionButtonInputState") == "true"
    ) {
      setDemandedBillTableActionButtonInputState(true);
    } else if (
      localStorage.getItem("demandedBillTableActionButtonInputState") == "false"
    ) {
      setDemandedBillTableActionButtonInputState(false);
    } else {
      setDemandedBillTableActionButtonInputState(false);
    }

    /** Approval Amount Cols */
    if (localStorage.getItem("approvalAmountTableState") == "true") {
      setApprovalAmountTableState(true);
    } else {
      setApprovalAmountTableState(false);
    }

    /** Paid Amount Cols */
    if (localStorage.getItem("paidAmountTableState") == "true") {
      setPaidAmountTableState(true);
    } else {
      setPaidAmountTableState(false);
    }

    if (localStorage.getItem("approvalAmountDisabledState") == "true") {
      setApprovalAmountDisabledState(true);
    } else {
      setApprovalAmountDisabledState(false);
    }
  }, []);

  useEffect(() => {}, [errors]);
  useEffect(() => {
    console.log("approvalAmountDisabledState", approvalAmountDisabledState);
  }, [approvalAmountDisabledState]);

  useEffect(() => {
    console.log("paidAmountInputState", paidAmountInputState);
  }, [
    approvalAmountTableState,
    paidAmountInputState,
    approvalAmountInputState,
    paidAmountTableState,
    demandedBillTableActionButtonInputState,
  ]);

  const columns = [
    {
      field: "srNo",
      id: 1,
      headerName: <FormattedLabel id='srNo' />,
      flex: 1,
    },
    {
      field: "caseNumberName",
      headerName: <FormattedLabel id='courtCaseNo' />,
      flex: 1,
      id: 2,
    },
    {
      field: language == "en" ? "caseMainTypeEng" : "caseMainTypeMar",
      id: 3,
      headerName: <FormattedLabel id='caseType' />,
      //type: "number",
      flex: 1,
    },

    {
      field: language === "en" ? "caseSubTypeEng" : "caseSubTypeMar",
      id: 4,
      headerName: <FormattedLabel id='caseSubType' />,
      flex: 1,
    },
    {
      field: "caseFees" !== null ? "caseFees" : "",
      id: 5,
      headerName: <FormattedLabel id='caseFees' />,
      flex: 1,
    },
    {
      field: "feesAmount" !== null ? "feesAmount" : "",
      id: 5,
      headerName: <FormattedLabel id='feesAmount' />,
      flex: 1,
    },

    {
      field: "approvalAmount" !== null ? "approvalAmount" : "",
      id: 5,
      headerName: <FormattedLabel id='approvalFeesAmount' />,
      hide: approvalAmountTableState,
      flex: 1,
    },
    {
      headerName: <FormattedLabel id='paidFees' />,
      field: "paidFees" !== null ? "paidFees" : "",
      // width: 240,
      hide: paidAmountTableState,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      // field:
      hide: demandedBillTableActionButtonInputState,
      headerName: <FormattedLabel id='actions' />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {/** Action Button */}
            <IconButton>
              <Button
                variant='contained'
                size='small'
                onClick={() => {
                  billDetailsDailogOpen();
                  console.log("params?.row?ldf", params?.row);
                  reset(params?.row);
                  setValue("srNo", params?.row?.srNo);
                  setValue("id", params?.row?.id);
                }}
              >
                Action
              </Button>
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Add Bill Details on Submit
  const addBillDetailsOnSubmit = () => {
    const caseNumber = getValues("caseNumber");
    const caseNumberName = caseNumbers.find((data) => {
      if (data?.id == getValues("caseNumber")) {
        return data?.caseNumber;
      }
    })?.caseNumber;

    const caseMainType = getValues("caseMainType");
    const caseMainTypeMar = getValues("caseMainTypeMar");
    const caseMainTypeEng = getValues("caseMainTypeEng");
    const caseSubType = getValues("caseSubType");
    const caseSubTypeEng = getValues("caseSubTypeEng");
    const caseSubTypeMar = getValues("caseSubTypeMar");
    const caseFees = getValues("caseFees");
    const paidFees = getValues("paidFees");
    const feesAmount = getValues("feesAmount");
    const pendingFees = getValues("pendingFees");
    const activeFlag = getValues("activeFlag");
    const paymentDate = moment(getValues("paymentDate")).format("YYYY-MM-DD");

    let data = {
      caseNumber: caseNumber,
      caseNumberName: caseNumberName,
      caseMainType: caseMainType,
      caseMainTypeMar: caseMainTypeMar,
      caseMainTypeEng: caseMainTypeEng,
      caseSubType: caseSubType,
      caseSubTypeEng: caseSubTypeEng,
      caseSubTypeMar: caseSubTypeMar,
      caseFees: caseFees,
      paidFees: paidFees,
      feesAmount: feesAmount,
      activeFlag: activeFlag,
      pendingFees: pendingFees,
      paymentDate: paymentDate,
    };

    if (
      dataSource1.length == 0 ||
      localStorage.getItem("billDetail") !== null ||
      localStorage.getItem("billDetail") !== undefined
    ) {
      // let data1 = JSON.parse(localStorage.getItem("billDetail"));
      setDataSource1([...dataSource, data]);
    } else {
      setDataSource1([...dataSource1, data]);
    }

    if (caseNoCount.length != 0) {
      setCaseNoCount([...caseNoCount, caseNumber]);
    } else {
      setCaseNoCount([caseNumber]);
    }

    setValue("caseNumber", null);
    setValue("caseNumberName", null);
    setValue("caseMainType", "");
    setValue("caseMainTypeMr", "");
    setValue("caseMainTypeEng", "");
    setValue("caseSubType", "");
    setValue("caseSubTypeMar", "");
    setValue("caseSubTypeEng", "");
    setValue("caseFees", "");
    setValue("paidFees", "");
    setValue("feesAmount", "");
    setValue("pendingFees", "");
    setValue("activeFlag", "");
    setValue("paymentDate", moment.now());
  };

  // Submit Form 1
  const onSubmitForm1 = () => {
    const approvedAmountUpdatedData = {
      id: getValues("id"),
      caseNumber: getValues("caseNumber"),
      caseMainType: getValues("caseMainType"),
      caseMainTypeMar: getValues("caseMainTypeMar"),
      caseMainTypeEng: getValues("caseMainTypeEng"),
      caseSubType: getValues("caseSubType"),
      caseSubTypeEng: getValues("caseSubTypeEng"),
      caseSubTypeMar: getValues("caseSubTypeMar"),
      caseFees: getValues("caseFees"),
      paidFees: getValues("paidFees"),
      feesAmount: getValues("feesAmount"),
      pendingFees: getValues("pendingFees"),
      approvalAmount: getValues("approvalAmount"),
      srNo: getValues("srNo"),
      activeFlag: "Y",
      paymentDate: moment(getValues("paymentDate")).format("YYYY-MM-DD"),
    };

    let updatedDataSource = dataSource.filter((data, index) => {
      if (data.id != approvedAmountUpdatedData.id) {
        return data;
      }
    });

    setDataSource([...updatedDataSource, approvedAmountUpdatedData]);
    localStorage.setItem("billDetail", [
      ...updatedDataSource,
      approvedAmountUpdatedData,
    ]);

    billDetailsDailogClose();
  };

  useEffect(() => {}, [caseNoCount]);

  // useEffect - Testin
  useEffect(() => {
    if (dataSource1.length == 0) {
      setDataSource([]);
    } else {
      setDataSource(
        dataSource1?.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
          };
        }),
      );
    }
  }, [dataSource1]);

  useEffect(() => {
    if (dataSource.length !== 0) {
      localStorage.setItem("billDetail", JSON.stringify(dataSource));
    }
  }, [dataSource]);

  useEffect(() => {
    if (localStorage.getItem("billDetail") !== "null") {
      setDataSource(JSON.parse(localStorage.getItem("billDetail")));
    }
    if (localStorage.getItem("billDetailComponent") == "false") {
      setBillDetailComponent(false);
    } else {
      setBillDetailComponent(true);
    }
  }, []);

  useEffect(() => {}, [errors]);

  // View
  return (
    <>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 20,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "50px",
          marginRight: "75px",
          borderRadius: 100,
        }}
      >
        <strong style={{ display: "flex", justifyContent: "center" }}>
          <FormattedLabel id='paymentDetails' />
        </strong>
      </div>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(addBillDetailsOnSubmit)}>
            {billDetailComponent && (
              <>
                <Grid container style={{ marginLeft: 70, padding: "10px" }}>
                  {/* Case Number  - Court Case Number*/}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ marginTop: "2" }}
                      error={!!errors?.caseNumber}
                    >
                      <InputLabel id='demo-simple-select-standard-label'>
                        <FormattedLabel id='courtCaseNo' />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id='courtCaseNo' />}
                          >
                            {caseNumbers &&
                              caseNumbers?.map((data, index) => (
                                <MenuItem key={index} value={data?.id}>
                                  {data?.caseNumber}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name='caseNumber'
                        control={control}
                        defaultValue=''
                      />
                      <FormHelperText>
                        {errors?.caseNumber
                          ? errors?.caseNumber?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* Case Type  - Case Main Type*/}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ marginTop: "2" }}
                      error={!!errors?.caseMainType}
                    >
                      <InputLabel id='demo-simple-select-standard-label'>
                        {<FormattedLabel id='caseType' />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={true}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id='caseType' />}
                          >
                            {caseMainTypes &&
                              caseMainTypes.map((caseMainType, index) => (
                                <MenuItem key={index} value={caseMainType?.id}>
                                  {language == "en"
                                    ? caseMainType?.caseMainType
                                    : caseMainType?.caseMainTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name='caseMainType'
                        control={control}
                        defaultValue=''
                      />
                      <FormHelperText>
                        {errors?.caseMainType
                          ? errors?.caseMainType?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Case Sub Type */}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ marginTop: "2" }}
                      error={!!errors?.caseSubType}
                    >
                      <InputLabel id='demo-simple-select-standard-label'>
                        {<FormattedLabel id='caseSubType' />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={true}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id='caseSubType' />}
                          >
                            {caseSubTypes &&
                              caseSubTypes?.map((subType, index) => (
                                <MenuItem key={index} value={subType?.id}>
                                  {language == "en"
                                    ? subType?.subType
                                    : subType?.caseSubTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name='caseSubType'
                        control={control}
                        defaultValue=''
                      />
                      <FormHelperText>
                        {errors?.caseSubType
                          ? errors?.caseSubType?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Case Fees */}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      disabled={router?.query?.pageMode === "View"}
                      label={<FormattedLabel id='caseFees' />}
                      InputLabelProps={{
                        shrink: watch("caseFees") == "" || null ? false : true,
                      }}
                      {...register("caseFees")}
                      error={!!errors?.caseFees}
                      helperText={
                        errors?.caseFees ? errors?.caseFees?.message : null
                      }
                    />
                  </Grid>

                  {/** Fees Amount */}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      InputLabelProps={{
                        shrink:
                          watch("feesAmount") == "" || null ? false : true,
                      }}
                      disabled={router?.query?.pageMode === "View"}
                      label={<FormattedLabel id='feesAmount' />}
                      {...register("feesAmount")}
                      error={!!errors?.feesAmount}
                      helperText={
                        errors?.feesAmount ? errors?.feesAmount?.message : null
                      }
                    />
                  </Grid>
                  {/* Pending Fees*/}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      InputLabelProps={{
                        shrink:
                          watch("pendingFees") == "" || null ? false : true,
                      }}
                      disabled={router?.query?.pageMode === "View"}
                      defaultValue={""}
                      label={<FormattedLabel id='pendingFees' />}
                      {...register("pendingFees")}
                      error={!!errors?.pendingFees}
                      helperText={
                        errors?.pendingFees
                          ? errors?.pendingFees?.message
                          : null
                      }
                    />
                  </Grid>
                  {/* Payment Date*/}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ marginTop: 0 }}
                      error={!!errors?.paymentDate}
                    >
                      <Controller
                        control={control}
                        name='paymentDate'
                        defaultValue={moment.now()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              disabled={true}
                              hidden={true}
                              inputFormat='DD/MM/YYYY'
                              label={
                                <span style={{ fontSize: 16, marginTop: 0 }}>
                                  Bill Created Date and Time
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
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
                        {errors?.paymentDate
                          ? errors?.paymentDate?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Approvoed Amount Fees */}
                  {approvalAmountInputState && (
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                      <TextField
                        disabled={router?.query?.pageMode === "View"}
                        // label={<FormattedLabel id='approvalAmount' />}
                        label='Approved Amount'
                        {...register("approvalAmount")}
                        error={!!errors?.approvalAmount}
                        helperText={
                          errors?.approvalAmount
                            ? errors?.approvalAmount?.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  {/* Paid Fees */}
                  {paidAmountInputState && (
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                      <TextField
                        disabled={router?.query?.pageMode === "View"}
                        label={<FormattedLabel id='paidFees' />}
                        {...register("paidFees")}
                        error={!!errors?.paidFees}
                        helperText={
                          errors?.paidFees ? errors?.paidFees?.message : null
                        }
                      />
                    </Grid>
                  )}
                </Grid>

                <Grid item xs={12} sm={12} lg={4} md={4} xl={4}>
                  <Stack
                    direction='row'
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      marginRight: "7vh",
                    }}
                  >
                    <Button
                      endIcon={<AddIcon />}
                      onClick={addBillDetailsOnSubmit}
                    >
                      Add Bill Details
                    </Button>
                  </Stack>
                </Grid>
              </>
            )}
          </form>
        </FormProvider>
      </ThemeProvider>

      <div style={{ margin: "30px" }}>
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          // disableToolbarButton
          disableDensitySelector
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              csvOptions: { disableToolbarButton: true },
            },
          }}
          autoHeight
          sx={{
            overflowY: "scroll",
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          columns={columns}
          rows={dataSource}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          getRowId={(row) => row.srNo}
        />
      </div>
      {/** Bill Details Dailog - OK */}
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={billDetailsDailog}
        onClose={() => billDetailsDailogClose()}
      >
        <Paper>
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid
                item
                xs={6}
                sm={6}
                lg={6}
                xl={6}
                md={6}
                sx={{
                  display: "flex",
                  alignItem: "left",
                  justifyContent: "left",
                }}
              >
                Bill Details
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
                      billDetailsDailogClose();
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm1)}>
                  <>
                    <Grid container style={{ marginLeft: 70, padding: "10px" }}>
                      {/* Case Number  - Court Case Number*/}
                      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <FormControl
                          sx={{ marginTop: "2" }}
                          error={!!errors?.caseNumber}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            <FormattedLabel id='courtCaseNo' />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={true}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id='courtCaseNo' />}
                              >
                                {caseNumbers1 &&
                                  caseNumbers1.map((data, index) => (
                                    <MenuItem key={index} value={data?.id}>
                                      {data?.caseNumber}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='caseNumber'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.caseNumber
                              ? errors?.caseNumber?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* Case Type  - Case Main Type*/}
                      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <FormControl
                          sx={{ marginTop: "2" }}
                          error={!!errors?.caseMainType}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            {<FormattedLabel id='caseType' />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={true}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id='caseType' />}
                              >
                                {caseMainTypes &&
                                  caseMainTypes.map((caseMainType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={caseMainType.id}
                                    >
                                      {language == "en"
                                        ? caseMainType?.caseMainType
                                        : caseMainType?.caseMainTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='caseMainType'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.caseMainType
                              ? errors?.caseMainType?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Case Sub Type */}
                      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <FormControl
                          sx={{ marginTop: "2" }}
                          error={!!errors?.caseSubType}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            {<FormattedLabel id='caseSubType' />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={true}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id='caseSubType' />}
                              >
                                {caseSubTypes &&
                                  caseSubTypes.map((subType, index) => (
                                    <MenuItem key={index} value={subType?.id}>
                                      {language == "en"
                                        ? subType?.subType
                                        : subType?.caseSubTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='caseSubType'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.caseSubType
                              ? errors?.caseSubType?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Case Fees */}
                      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <TextField
                          disabled={true}
                          label={<FormattedLabel id='caseFees' />}
                          {...register("caseFees")}
                          error={!!errors?.caseFees}
                          helperText={
                            errors?.caseFees ? errors?.caseFees?.message : null
                          }
                        />
                      </Grid>

                      {/** Fees Amount */}
                      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <TextField
                          disabled={true}
                          label={<FormattedLabel id='feesAmount' />}
                          {...register("feesAmount")}
                          error={!!errors?.feesAmount}
                          helperText={
                            errors?.feesAmount
                              ? errors?.feesAmount?.message
                              : null
                          }
                          // value={feesAmount}
                          // onChange={(e) => setBillAmount(e.target.value)}
                        />
                      </Grid>

                      {/** Pending Fees */}
                      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <TextField
                          disabled={true}
                          defaultValue={""}
                          label={<FormattedLabel id='pendingFees' />}
                          {...register("pendingFees")}
                          error={!!errors?.pendingFees}
                          helperText={
                            errors?.pendingFees
                              ? errors?.pendingFees?.message
                              : null
                          }
                        />
                      </Grid>

                      {/** Payment Date */}
                      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <FormControl
                          sx={{ marginTop: 0 }}
                          error={!!errors?.paymentDate}
                        >
                          <Controller
                            control={control}
                            name='paymentDate'
                            defaultValue={moment.now()}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                  disabled={true}
                                  hidden={true}
                                  inputFormat='DD/MM/YYYY'
                                  label={
                                    <span
                                      style={{ fontSize: 16, marginTop: 0 }}
                                    >
                                      Bill Created Date and Time
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
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
                            {errors?.paymentDate
                              ? errors?.paymentDate?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Approvoed Amount Fees */}
                      {approvalAmountInputState && (
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                          <TextField
                            disabled={approvalAmountDisabledState}
                            // label={<FormattedLabel id='approvalAmount' />}
                            label='Approved Amount'
                            {...register("approvalAmount")}
                            error={!!errors?.approvalAmount}
                            helperText={
                              errors?.approvalAmount
                                ? errors?.approvalAmount?.message
                                : null
                            }
                          />
                        </Grid>
                      )}
                      {/* Paid Fees */}
                      {paidAmountInputState && (
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                          <TextField
                            label={<FormattedLabel id='paidFees' />}
                            defaultValue={"0"}
                            {...register("paidFees")}
                            error={!!errors?.paidFees}
                            helperText={
                              errors?.paidFees
                                ? errors?.paidFees?.message
                                : null
                            }
                          />
                        </Grid>
                      )}
                    </Grid>
                  </>

                  <Stack
                    direction='row'
                    spacing={5}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      // type='submit'
                      variant='contained'
                      onClick={onSubmitForm1}
                    >
                      Approve
                    </Button>
                    <Button
                      variant='contained'
                      onClick={billDetailsDailogClose}
                    >
                      Exit
                    </Button>
                  </Stack>
                </form>
              </FormProvider>
            </ThemeProvider>
          </DialogContent>
        </Paper>
      </Dialog>
    </>
  );
};

export default BillDetails;
