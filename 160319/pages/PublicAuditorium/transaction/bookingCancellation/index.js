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
import schema from "../../../../containers/schema/publicAuditorium/transactions/bookingCancellation";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
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

const BookingCancellation = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const [bookingFor, setBookingFor] = useState();
  const [loading, setLoading] = useState(false);

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
    getBookingCancellation();
    getAuditorium();
    getServices();
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
      console.log("respe", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          id: row.id,
          auditoriumName: row.auditoriumName,
        }))
      );
    });
  };

  const getBookingCancellation = () => {
    axios
      .get(`${urls.PABBMURL}/trnBookingCancellationProcess/getAll`)
      .then((res) => {
        console.log("respe1", res);
        let result = res.data.trnBookingCancellationProcessList;

        let _res = result?.map((row, index) => ({
          id: row.id,
          srNo: index + 1,
          // auditoriumKey: row.auditoriumKey,
          auditoriumName: row.auditoriumName ? row.auditoriumName : "-",
          // serviceKey: row.serviceKey,
          // serviceName: row.serviceName,
          cancelByApplicantOrVendor: row.cancelByApplicantOrVendor,
          cancelByDepartment: row.cancelByDepartment,
          reasonForCancellation: row.reasonForCancellation,
          auditoriumBookingKey: row.auditoriumBookingKey,
          organizationName: row.organizationName ? row.organizationName : "-",
          title: row.title,
          organizationOwnerFirstName: row.organizationOwnerFirstName
            ? row.organizationOwnerFirstName +
              " " +
              row.organizationOwnerLastName
            : "-",
          organizationOwnerMiddleName: row.organizationOwnerMiddleName,
          organizationOwnerLastName: row.organizationOwnerLastName,
          flatBuildingNo: row.flatBuildingNo,
          buildingName: row.buildingName,
          roadName: row.roadName,
          landmark: row.landmark,
          pincode: row.pincode,
          aadhaarNo: row.aadhaarNo,
          mobileNo: row.mobileNo ? row.mobileNo : "-",
          landlineNo: row.landlineNo,
          emailAddress: row.emailAddress,
          // messageDisplayKey: row.messageDisplayKey,
          // messageDisplayName: row.messageDisplayName,
          eventDetails: row.eventDetails,
          eventDate: row.eventDate ? row.eventDate : "-",
          // eventFromDate: row.eventFromDate,
          // eventToDate: row.eventToDate,
          // depositedAmount: row.depositedAmount,
          // depositReceiptNo: row.depositReceiptNo,
          rentAmount: row.rentAmount ? row.rentAmount : "-",
          status: row.activeFlag === "Y" ? "Actice" : "Inactive",
          // rentReceiptNo: row.rentReceiptNo,
          // termsAndCondition: row.termsAndCondition,
          // amountToBeReturnedAfterBookingCancellation:
          //   row.amountToBeReturnedAfterBookingCancellation,
          // budgetingUnit: row.budgetingUnit,
          // notesheetReferenceNo: row.notesheetReferenceNo,
          billDate: row.billDate,
          // ecsPaymentKey: row.ecsPaymentKey,
          // ecsPaymentName: row.ecsPaymentName,
          // remark: row.remark,
          activeFlag: row.activeFlag,
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

  const getAuditoriumBookingDetailsById = (id) => {
    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getById?id=${id}`
      )
      .then((r) => {
        if (r.status === 200) {
          console.log("By id", r.data);
          reset(r.data);
        }
      });
  };

  const getServices = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
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
                getBookingCancellation();
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
                getBookingCancellation();
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
    const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      eventDate,
      auditoriumBookingNo: Number(formData.auditoriumBookingNumber),
      auditoriumId: Number(formData.auditoriumId),
      aadhaarNo: Number(formData.aadhaarNo),
      landlineNo: Number(formData.landlineNo),
      mobile: Number(formData.mobile),
      depositAmount: Number(formData.depositAmount),
      payRentAmount: Number(formData.payRentAmount),
      pincode: Number(formData.pincode),
      rentAmount: Number(formData.rentAmount),
      extendedRentAmount: Number(formData.extendedRentAmount),
      bankaAccountNo: Number(formData.bankaAccountNo),
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.PABBMURL}/trnBookingCancellationProcess/save`,
        // "http://192.168.68.110:9003/pabbm/api/trnBookingCancellationProcess/save",

        finalBodyForApi
      )
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          // getAuditoriumBooking();
          getBookingCancellation();
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
      field: "eventDate",
      headerName: "Event Date",
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
      field: "rentAmount",
      headerName: "Rent Amount",
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
        <Paper>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              Booking Cancellation
              {/* <FormattedLabel id="bookClassification" /> */}
            </h2>
          </Box>
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
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  {/* <FormControl sx={{ width: "100%" }}>
                    <RadioGroup
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={bookingFor}
                      onChange={handleChangeRadio}
                    >
                      <FormControlLabel
                        value="Cancel by Applicant/Vendor"
                        control={<Radio />}
                        label="Cancel by Applicant/Vendor"
                      />
                      <FormControlLabel
                        value="Cancel by Department"
                        control={<Radio />}
                        label="Cancel by Department"
                      />
                    </RadioGroup>
                  </FormControl> */}
                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="cancelBy"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                          }}
                        >
                          <FormControlLabel
                            value="Cancel by Applicant/Vendor"
                            control={<Radio />}
                            label="Cancel by Applicant/Vendor"
                          />
                          <FormControlLabel
                            value="Cancel by Department"
                            control={<Radio />}
                            label="Cancel by Department"
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
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
                      InputLabelProps={{ shrink: true }}
                      label="Reason for cancellation"
                      variant="standard"
                      {...register("reasonForCancellation")}
                      error={!!errors.reasonForCancellation}
                      helperText={
                        errors?.reasonForCancellation
                          ? errors.reasonForCancellation.message
                          : null
                      }
                    />
                  </Grid>
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
                      variant="standard"
                      disabled
                      {...register("title")}
                      InputLabelProps={{ shrink: true }}
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
                      type="number"
                      {...register("flatBuildingNo")}
                      InputLabelProps={{ shrink: true }}
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
                      disabled
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
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
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      disabled
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
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("organizationOwnerLastName")}
                      error={!!errors.organizationOwnerLastName}
                      disabled
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
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("buildingName")}
                      error={!!errors.buildingName}
                      disabled
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
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      disabled
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
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      disabled
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
                      variant="standard"
                      disabled
                      type="number"
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
                      disabled
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
                      error={errors.messageDisplay}
                      variant="standard"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Message Display
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            disabled
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Message Display"
                          >
                            {[
                              { id: 1, auditoriumName: "YES" },
                              { id: 2, auditoriumName: "NO" },
                            ].map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.auditoriumName}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        name="messageDisplay"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.messageDisplay
                          ? errors.messageDisplay.message
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
                      label="Event Details"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      disabled
                      {...register("eventDetails")}
                      error={!!errors.eventDetails}
                      helperText={
                        errors?.eventDetails
                          ? errors.eventDetails.message
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
                        name="eventDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>Event Date</span>
                              }
                              value={field.value}
                              disabled
                              onChange={(date) => {
                                field.onChange(date);
                                setValue(
                                  "eventDay",
                                  moment(date).format("dddd")
                                );
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={errors.eventDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.eventDate ? errors.eventDate.message : null}
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
                      label="Event Day"
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="standard"
                      {...register("eventDay")}
                      error={!!errors.eventDay}
                      helperText={
                        errors?.eventDay ? errors.eventDay.message : null
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
                      alignItems: "end",
                    }}
                  >
                    <FormControl
                      sx={{ width: "90%" }}
                      error={!!errors.eventDate}
                    >
                      <Controller
                        name="eventTimeFrom"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              value={field.value}
                              disabled
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
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
                      error={!!errors.eventDate}
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
                      label="Deposit Amount"
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
                      {...register("depositAmount")}
                      error={!!errors.depositAmount}
                      helperText={
                        errors?.depositAmount
                          ? errors.depositAmount.message
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
                      justifyContent: "space-evenly",
                      alignItems: "end",
                    }}
                  >
                    <Typography>Pay Deposit Amount</Typography>
                    <Link href="#">Link</Link>
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
                      label="Rent amount"
                      variant="standard"
                      type="number"
                      InputLabelProps={{ shrink: true }}
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
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                      {...register("rentAmount")}
                      error={!!errors.rentAmount}
                      helperText={
                        errors?.rentAmount ? errors.rentAmount.message : null
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
                      label="Pay Rent Amount"
                      variant="standard"
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
                      {...register("payRentAmount")}
                      error={!!errors.payRentAmount}
                      helperText={
                        errors?.payRentAmount
                          ? errors.payRentAmount.message
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
                      justifyContent: "space-evenly",
                      alignItems: "end",
                    }}
                  >
                    <Typography>Deposit Receipt</Typography>
                    <Link href="#">Print</Link>
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
                      label="Extended Rent amount"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      type="number"
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
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                      {...register("extendedRentAmount")}
                      error={!!errors.extendedRentAmount}
                      helperText={
                        errors?.extendedRentAmount
                          ? errors.extendedRentAmount.message
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
                      justifyContent: "space-evenly",
                      alignItems: "end",
                    }}
                  >
                    <Typography>Rent Receipt</Typography>
                    <Link href="#">Print</Link>
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
                      disabled
                      label="Manager's Digital Signature"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
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

                <Grid
                  container
                  sx={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5">Return Amount Details</Typography>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <Typography>
                      Shown an amount to be returned after booking cancellation
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Amount to be returned"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      {...register("amountToBeReturned")}
                      error={!!errors.amountToBeReturned}
                      helperText={
                        errors?.amountToBeReturned
                          ? errors.amountToBeReturned.message
                          : null
                      }
                    />
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
                    Booking Cancellation Details
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
                      label="Notesheet / Reference number"
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
                      {...register("notesheet_ReferenceNumber")}
                      error={!!errors.notesheet_ReferenceNumber}
                      helperText={
                        errors?.notesheet_ReferenceNumber
                          ? errors.notesheet_ReferenceNumber.message
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
                    <FormControlLabel
                      control={
                        <Controller
                          name="budgetingUnit"
                          control={control}
                          render={({ field: props }) => (
                            <Checkbox
                              {...props}
                              checked={props.value}
                              onChange={(e) => props.onChange(e.target.checked)}
                            />
                          )}
                        />
                      }
                      label="Budgeting Unit"
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
                      label="Remark"
                      variant="standard"
                      {...register("remarks")}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.remarks}
                      helperText={
                        errors?.remarks ? errors.remarks.message : null
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
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getBookingCancellation(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getBookingCancellation(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      )}
    </div>
  );
};

export default BookingCancellation;
