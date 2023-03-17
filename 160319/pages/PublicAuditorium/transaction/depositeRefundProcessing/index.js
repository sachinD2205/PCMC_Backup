import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/depositeRefundProcessing";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UploadButton from "../../../../components/fileUpload/UploadButton";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";

const DepositeRefundProcessing = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const language = useSelector((state) => state.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [bookingCancellation, setBookingCancellation] = useState([]);
  const [services, setServices] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [bankNames, setBankNames] = useState([]);

  const [bookingFor, setBookingFor] = useState("Booking For PCMC");
  const [loading, setLoading] = useState(false);

  const [electrialInspectorCertificate, setElectrialInspectorCertificate] =
    useState(null);

  console.log("electrialInspectorCertificate", electrialInspectorCertificate);

  const handleChangeRadio = (event) => {
    setBookingFor(event.target.value);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    // getZoneName();
    // getWardNames();
    getDepositRefundProcessing();
    getAuditorium();
    getServices();
    getBankName();
    // getNexAuditoriumBookingNumber();
    // getServices();
  }, []);

  useEffect(() => {
    // getAuditoriumBooking();
  }, []);

  const getNexAuditoriumBookingNumber = () => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`)
      .then((r) => {
        let val = r?.data;
        setValue("auditoriumBookingNo", r?.data);
        setLoading(false);
      });
  };

  const getAuditorium = () => {
    axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
      console.log("respe aud", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          id: row.id,
          auditoriumName: row.auditoriumName,
        }))
      );
    });
  };

  const getBankName = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankNames(r.data.bank);
    });
  };

  const getDepositRefundProcessing = () => {
    axios
      .get(`${urls.PABBMURL}/trnDepositeRefundProcessByDepartment/getAll`)
      .then((res) => {
        console.log("respe154", res);
        let result = res.data.trnDepositeRefundProcessByDepartmentList;

        let _res = result?.map((row, index) => ({
          id: row.id,
          srNo: index + 1,
          auditoriumName: row.auditoriumId,
          serviceId: row.serviceId,
          auditoriumBookingNo: row.auditoriumBookingNo,
          attachDocuments: row.attachDocuments,
          budgetingUnit: row.budgetingUnit,
          notesheetReferenceNo: row.notesheetReferenceNo,
          billDate: row.billDate ? row.billDate : "-",
          ecsPayment: row.ecsPayment,
          organizationName: row.organizationNameId,
          title: row.title,
          organizationOwnerFirstName: row.organizationOwnerFirstName,
          organizationOwnerLastName: row.organizationOwnerLastName,
          organizationOwnerMiddleName: row.organizationOwnerMiddleName,
          flatBuildingNo: row.flatBuildingNo,
          buildingName: row.buildingName,
          roadName: row.roadName,
          landmark: row.landmark,
          pincode: row.pincode,
          aadhaarNo: row.aadhaarNo,
          mobileNo: row.mobile,
          landlineNo: row.landlineNo,
          emailAddress: row.emailAddress,
          depositDeceiptId: row.depositDeceiptId,
          depositedAmount: row.depositedAmount,
          depositReceiptDate: row.depositReceiptDate,
          eventDay: row.eventDay,
          eventTimeFrom: row.eventTimeFrom,
          eventTimeTo: row.eventTimeTo,
          termsAndCondition: row.termsAndCondition,
          managersDigitalSignature: row.managersDigitalSignature,
          bankAccountHolderName: row.bankAccountHolderName,
          bankAccountNo: row.bankAccountNo,
          typeOfBankAccountKey: row.typeOfBankAccountKey,
          typeOfBankAccountName: row.typeOfBankAccountName,
          bankNameId: row.bankNameId,
          bankName: row.bankName,
          bankAddress: row.bankAddress,
          ifscCode: row.ifscCode,
          micrCode: row.micrCode,
          activeFlag: row.activeFlag,
          status: row.activeFlag === "Y" ? "Active" : "Inactive",
        }));

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        console.log("respe ser", r);
        setServices(
          r.data.service.map((row, index) => ({
            id: row.id,
            serviceName: row.serviceName,
            serviceNameMr: row.serviceNameMr,
          }))
        );
      });
  };

  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row, index) => ({
          id: row.id,
          zoneName: row.zoneName,
        }))
      );
    });
  };

  const getAuditoriumBookingDetailsById = (id) => {
    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getById?id=${id}`
      )
      .then((r) => {
        if (r.status === 200) {
          console.log("By id", r);
          reset(r.data);
          setValue(
            "organizationName",
            r.data.organizationName ? r.data.organizationName : "-"
          );
          setValue("title", r.data.title ? r.data.title : "-");
          setValue(
            "flatBuildingNo",
            r.data.flatBuildingNo ? r.data.flatBuildingNo : "-"
          );
          setValue(
            "organizationOwnerFirstName",
            r.data.organizationOwnerFirstName
              ? r.data.organizationOwnerFirstName
              : "-"
          );
          setValue(
            "organizationOwnerMiddleName",
            r.data.organizationOwnerMiddleName
              ? r.data.organizationOwnerMiddleName
              : "-"
          );
          setValue(
            "organizationOwnerLastName",
            r.data.organizationOwnerLastName
              ? r.data.organizationOwnerLastName
              : "-"
          );
          setValue(
            "buildingName",
            r.data.buildingName ? r.data.buildingName : "-"
          );
          setValue("roadName", r.data.roadName ? r.data.roadName : "-");
          setValue("landmark", r.data.landmark ? r.data.landmark : "-");
          setValue("pincode", r.data.pincode ? r.data.pincode : "-");
          setValue("aadhaarNo", r.data.aadhaarNo ? r.data.aadhaarNo : "-");
          setValue("mobile", r.data.mobile ? r.data.mobile : "-");
          setValue("landlineNo", r.data.landlineNo ? r.data.landlineNo : "-");
          setValue(
            "emailAddress",
            r.data.emailAddress ? r.data.emailAddress : "-"
          );
          setValue(
            "depositeReceiptNo",
            r.data.depositDeceiptId ? r.data.depositDeceiptId : "-"
          );
          setValue(
            "depositeAmount",
            r.data.depositedAmount ? r.data.depositedAmount : "-"
          );
          setValue("eventDay", r.data.eventDay ? r.data.eventDay : "-");
          setValue(
            "eventTimeFrom",
            r.data.eventTimeFrom ? r.data.eventTimeFrom : "-"
          );
          setValue(
            "eventTimeTo",
            r.data.eventTimeTo ? r.data.eventTimeTo : "-"
          );
          setValue(
            "depositeReceiptDate",
            r.data.depositReceiptDate ? r.data.depositReceiptDate : "-"
          );

          setValue(
            "bankAccountHolderName",
            r.data.bankAccountHolderName ? r.data.bankAccountHolderName: "-"
          );
          setValue(
            "bankaAccountNo",
            r.data.bankaAccountNo ? r.data.bankaAccountNo : "-"
          );
          setValue(
            "typeOfBankAccountId",
            r.data.typeOfBankAccountKey ? r.data.typeOfBankAccountKey : "-"
          );
          setValue("bankNameId", r.data.bankNameId ? r.data.bankNameId : "-");
          setValue(
            "bankAddress",
            r.data.bankAddress ? r.data.bankAddress : "-"
          );
          setValue("ifscCode", r.data.ifscCode ? r.data.ifscCode : "-");
          setValue("micrCode", r.data.micrCode ? r.data.micrCode : "-");
        } else {
          toast("Not Found !", {
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast("Not Found !", {
          type: "error",
        });
      });
  };

  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        }))
      );
    });
  };

  const getAuditoriumBooking = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log("res aud", res);

        setLoading(false);
        let result = res.data.trnAuditoriumBookingOnlineProcessList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            srNo: val.id,
            id: val.id,
            auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
            toDate: val.toDate ? val.toDate : "-",
            fromDate: val.fromDate ? val.fromDate : "-",
            holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            activeFlag: val.activeFlag,

            auditoriumId: val.auditoriumId
              ? auditoriums.find((obj) => obj?.id == val.auditoriumId)
                  ?.auditoriumName
              : "Not Available",
            eventDate: val.eventDate ? val.eventDate : "-",
            mobile: val.mobile ? val.mobile : "-",
            organizationName: val.organizationName ? val.organizationName : "-",
            organizationOwnerFirstName: val.organizationOwnerFirstName
              ? val.organizationOwnerFirstName +
                " " +
                val.organizationOwnerLastName
              : "-",
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/billType/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBillType();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/billType/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBillType();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    billPrefix: "",
    billType: "",
    fromDate: null,
    toDate: null,
    remark: "",
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    // const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      auditoriumBookingNo: Number(formData.auditoriumBookingNumber),
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.PABBMURL}/trnDepositeRefundProcessByDepartment/save`,
        // "http://192.168.68.110:9003/pabbm/api/trnDepositeRefundProcessByDepartment/save",
        finalBodyForApi
      )
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAuditoriumBooking();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const resetValuesExit = {
    billPrefix: "",
    fromDate: "",
    toDate: "",
    billType: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: "Auditorium Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "organizationName",
      headerName: "Organization Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "organizationOwnerFirstName",
      headerName: "Organization Owner Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "billDate",
      headerName: "Bill Date",
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "bankAccountNo",
      headerName: "Account Number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    ,
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Paper style={{ paddingTop: "50px" }}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Auditorium Booking Number"
                      variant="standard"
                      sx={{ width: "90%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      {...register("auditoriumBookingNumber")}
                      error={!!errors.auditoriumBookingNumber}
                      helperText={
                        errors?.auditoriumBookingNumber
                          ? errors.auditoriumBookingNumber.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      error={errors.auditoriumId}
                      variant="standard"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Select Auditorium
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
                          >
                            {auditoriums &&
                              auditoriums.map((auditorium, index) => {
                                return (
                                  <MenuItem key={index} value={auditorium.id}>
                                    {auditorium.auditoriumName}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        )}
                        name="auditoriumId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.auditoriumId
                          ? errors.auditoriumId.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      sx={{ width: "90%" }}
                      error={!!errors.serviceId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Select Service
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Service"
                          >
                            {services &&
                              services.map((service, index) => (
                                <MenuItem
                                  key={index}
                                  sx={{
                                    display: service.serviceName
                                      ? "flex"
                                      : "none",
                                  }}
                                  value={service.id}
                                >
                                  {service.serviceName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="serviceId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.serviceId ? errors.serviceId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
                    <Typography variant="subtitle2">
                      Attach Documents
                    </Typography>
                    <UploadButton
                      appName="PABBM"
                      serviceName="depositeRefundProcessing"
                      filePath={setElectrialInspectorCertificate}
                      fileName={electrialInspectorCertificate}
                    />
                  </Grid>

                  {/* <Grid item xs={2}>
                    <input accept="image/*" multiple type="file" />
                  </Grid> */}
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      disabled={!watch("auditoriumBookingNumber")}
                      onClick={() => {
                        let enteredAuditoriumBookingNo = watch(
                          "auditoriumBookingNumber"
                        );
                        getAuditoriumBookingDetailsById(
                          enteredAuditoriumBookingNo
                        );
                      }}
                    >
                      Search By Auditorium Booking Number
                    </Button>
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5">
                    Deposit Refund Bill Details
                  </Typography>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Budgeting Unit"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("budgetingUnit")}
                      error={!!errors.budgetingUnit}
                      helperText={
                        errors?.budgetingUnit
                          ? errors.budgetingUnit.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Notesheet / Refrence Number"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      {...register("notesheetReferenceNo")}
                      error={!!errors.notesheetReferenceNo}
                      helperText={
                        errors?.notesheetReferenceNo
                          ? errors.notesheetReferenceNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <FormControl sx={{ width: "90%" }} error={errors.billDate}>
                      <Controller
                        name="billDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>Bill Date</span>
                              }
                              value={field.value}
                              onChange={(date) => {
                                field.onChange(date);
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={errors.billDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.billDate ? errors.billDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={4}>
                    <FormControl
                      component="fieldset"
                      error={!!errors?.ecsPayment}
                    >
                      <Controller
                        name="ecsPayment"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Controller
                                name="ecsPayment"
                                control={control}
                                render={({ field: props }) => (
                                  <Checkbox
                                    {...props}
                                    checked={props.value}
                                    onChange={(e) =>
                                      props.onChange(e.target.checked)
                                    }
                                  />
                                )}
                              />
                            }
                            label="ECS Payment"
                          />
                        )}
                      />
                      <FormHelperText>
                        {errors?.ecsPayment?.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Organization Name"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      disabled
                      {...register("organizationName")}
                      error={!!errors.organizationName}
                      helperText={
                        errors?.organizationName
                          ? errors.organizationName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Title"
                      disabled
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      {...register("title")}
                      error={!!errors.title}
                      helperText={errors?.title ? errors.title.message : null}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Flat/Building No."
                      disabled
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      type="number"
                      {...register("flatBuildingNo")}
                      error={!!errors.flatBuildingNo}
                      helperText={
                        errors?.flatBuildingNo
                          ? errors.flatBuildingNo.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Organization Owner First Name"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      disabled
                      {...register("organizationOwnerFirstName")}
                      error={!!errors.organizationOwnerFirstName}
                      helperText={
                        errors?.organizationOwnerFirstName
                          ? errors.organizationOwnerFirstName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Organization Owner Middle Name"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("organizationOwnerMiddleName")}
                      error={!!errors.organizationOwnerMiddleName}
                      helperText={
                        errors?.organizationOwnerMiddleName
                          ? errors.organizationOwnerMiddleName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Organization Owner Last Name"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("organizationOwnerLastName")}
                      error={!!errors.organizationOwnerLastName}
                      helperText={
                        errors?.organizationOwnerLastName
                          ? errors.organizationOwnerLastName.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Building Name"
                      disabled
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      {...register("buildingName")}
                      error={!!errors.buildingName}
                      helperText={
                        errors?.buildingName
                          ? errors.buildingName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Road Name"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("roadName")}
                      error={!!errors.roadName}
                      helperText={
                        errors?.roadName ? errors.roadName.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Landmark"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("landmark")}
                      error={!!errors.landmark}
                      helperText={
                        errors?.landmark ? errors.landmark.message : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Pin Code"
                      disabled
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 6);
                      }}
                      {...register("pincode")}
                      error={!!errors.pincode}
                      helperText={
                        errors?.pincode ? errors.pincode.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Aadhaar Number"
                      disabled
                      // inputProps={{ maxLength: 12 }}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 12);
                      }}
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("aadhaarNo")}
                      error={!!errors.aadhaarNo}
                      helperText={
                        errors?.aadhaarNo ? errors.aadhaarNo.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Landline Number"
                      variant="standard"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      type="number"
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      {...register("landlineNo")}
                      error={!!errors.landlineNo}
                      helperText={
                        errors?.landlineNo ? errors.landlineNo.message : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Mobile"
                      type="number"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                      variant="standard"
                      {...register("mobile")}
                      error={!!errors.mobile}
                      helperText={errors?.mobile ? errors.mobile.message : null}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      disabled
                      label="Email Address"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("emailAddress")}
                      error={!!errors.emailAddress}
                      helperText={
                        errors?.emailAddress
                          ? errors.emailAddress.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Deposite receipt number"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      disabled
                      {...register("depositeReceiptNo")}
                      error={!!errors.depositeReceiptNo}
                      helperText={
                        errors?.depositeReceiptNo
                          ? errors.depositeReceiptNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      InputLabelProps={{ shrink: true }}
                      label="Deposite amount"
                      disabled
                      variant="standard"
                      {...register("depositeAmount")}
                      error={!!errors.depositeAmount}
                      helperText={
                        errors?.depositeAmount
                          ? errors.depositeAmount.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <FormControl sx={{ width: "90%" }} error={errors.eventDate}>
                      <Controller
                        name="depositeReceiptDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  Deposite Receipt Date
                                </span>
                              }
                              disabled
                              value={field.value}
                              onChange={(date) => {
                                field.onChange(date);
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={errors.depositeReceiptDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.depositeReceiptDate
                          ? errors.depositeReceiptDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Event Day"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("eventDay")}
                      error={!!errors.eventDay}
                      helperText={
                        errors?.eventDay ? errors.eventDay.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <FormControl
                      sx={{ width: "90%" }}
                      error={!!errors.eventTimeFrom}
                    >
                      <Controller
                        name="eventTimeFrom"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              disabled
                              label={
                                <span style={{ fontSize: 16 }}>
                                  Event Time From
                                </span>
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  error={!!errors.eventTimeFrom}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.eventTimeFrom
                          ? errors.eventTimeFrom.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <FormControl
                      sx={{ width: "90%" }}
                      error={!!errors.eventTimeTo}
                    >
                      <Controller
                        name="eventTimeTo"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              disabled
                              label={
                                <span style={{ fontSize: 16 }}>
                                  Event Time To
                                </span>
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  error={!!errors.eventTimeTo}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.eventTimeTo
                          ? errors.eventTimeTo.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Manager's Digital Signature"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      disabled
                      {...register("managersDigitalSignature")}
                      error={!!errors.managersDigitalSignature}
                      helperText={
                        errors?.managersDigitalSignature
                          ? errors.managersDigitalSignature.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Terms And Conditions"
                      variant="standard"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      {...register("termsAndCondition")}
                      error={!!errors.termsAndCondition}
                      helperText={
                        errors?.termsAndCondition
                          ? errors.termsAndCondition.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Bank account holder name"
                      variant="standard"
                      disabled
                      InputLabelProps={{shrink : true}}
                      {...register("bankAccountHolderName")}
                      error={!!errors.bankAccountHolderName}
                      helperText={
                        errors?.bankAccountHolderName
                          ? errors.bankAccountHolderName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Bank account number"
                      variant="standard"
                      disabled
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      {...register("bankaAccountNo")}
                      error={!!errors.bankaAccountNo}
                      helperText={
                        errors?.bankaAccountNo
                          ? errors.bankaAccountNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      error={!!errors.typeOfBankAccountId}
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Type of bank account
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            disabled
                            onChange={(value) => field.onChange(value)}
                            label="Type of bank account"
                          >
                            {[
                              { id: 1, bankAcc: "Current" },
                              { id: 2, bankAcc: "Saving" },
                            ].map((bank, index) => (
                              <MenuItem key={index} value={bank.id}>
                                {bank.bankAcc}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        name="typeOfBankAccountId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.typeOfBankAccountId
                          ? errors.typeOfBankAccountId.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      error={!!errors.bankNameId}
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Bank name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            d
                            onChange={(value) => field.onChange(value)}
                            label="Bank name"
                            disabled
                          >
                            {bankNames?.map((bank, index) => (
                              <MenuItem
                                sx={{
                                  display: bank.bankName ? "flex" : "none",
                                }}
                                key={index}
                                value={bank.id}
                              >
                                {bank.bankName}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        name="bankNameId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.bankNameId ? errors.bankNameId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Bank address"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                      {...register("bankAddress")}
                      error={!!errors.bankAddress}
                      helperText={
                        errors?.bankAddress ? errors.bankAddress.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="IFSC Code"
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="standard"
                      {...register("ifscCode")}
                      error={!!errors.ifscCode}
                      helperText={
                        errors?.ifscCode ? errors.ifscCode.message : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      type="number"
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      label="MICR Code"
                      variant="standard"
                      {...register("micrCode")}
                      error={!!errors.micrCode}
                      helperText={
                        errors?.micrCode ? errors.micrCode.message : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      size="small"
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      Clear
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </Grid>
                <Divider />
              </form>
            </Slide>
          )}

          <Grid container style={{ padding: "10px" }}>
            <Grid item xs={9}></Grid>
            <Grid
              item
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  });
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("Save");
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                add
              </Button>
            </Grid>
          </Grid>

          <Box style={{ height: "auto", overflow: "auto" }}>
            <DataGrid
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
              density="compact"
              autoHeight={true}
              pagination
              paginationMode="server"
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getBillType(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                getBillType(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      )}
    </div>
  );
};

export default DepositeRefundProcessing;
