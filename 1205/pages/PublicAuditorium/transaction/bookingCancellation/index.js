import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useRouter } from "next/router";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

const BookingCancellation = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    name: "levelsOfRolesDaoList",
    control,
  });

  const language = useSelector((state) => state.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(true);
  const [id, setID] = useState();
  const [showAccordion, setShowAccordion] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [bookingCancellation, setBookingCancellation] = useState([]);
  const [services, setServices] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);

  const [bookingFor, setBookingFor] = useState();
  const [loading, setLoading] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [bookedData, setBookedData] = useState([]);

  const router = useRouter();

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
    getAuditorium();
    getServices();
    getEquipment();
    // getNexAuditoriumBookingNumber();
    // getServices();
  }, []);

  useEffect(() => {
    // getAuditoriumBooking();
    getBookingCancellation();
  }, [auditoriums]);

  const appendUI = () => {
    append({
      equipment: "",
      quantity: "",
      rate: "",
      total: "",
    });
  };

  const getEquipment = () => {
    axios.get(`${urls.PABBMURL}/mstEquipment/getAll`).then((res) => {
      console.log("res equipment", res);
      setEquipments(res?.data?.mstEquipmentList);
    });
  };

  const getNexAuditoriumBookingNumber = () => {
    setLoading(true);
    axios.get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`).then((r) => {
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
          auditoriumNameEn: row.auditoriumNameEn,
        })),
      );
    });
  };

  const getBookingCancellation = () => {
    axios.get(`${urls.PABBMURL}/trnBookingCancellationProcess/getAll`).then((res) => {
      console.log("respe1", res);
      let result = res.data.trnBookingCancellationProcessList;

      let _res = result?.map((row, index) => ({
        id: row.id,
        srNo: index + 1,
        // auditoriumKey: row.auditoriumKey,
        auditoriumName: row.auditoriumName ? row.auditoriumName : "-",
        auditoriumName: row.auditoriumKey
          ? auditoriums.find((obj) => obj?.id == row.auditoriumKey)?.auditoriumNameEn
          : "-",

        // serviceKey: row.serviceKey,
        // serviceName: row.serviceName,
        // cancelByApplicantOrVendor: row.cancelByApplicantOrVendor,
        // cancelByDepartment: row.cancelByDepartment,
        citizenReasonForCancellation: row.citizenReasonForCancellation,
        auditoriumBookingKey: row.auditoriumBookingKey,
        organizationName: row.organizationName ? row.organizationName : "-",
        title: row.title,
        organizationOwnerFirstName: row.organizationOwnerFirstName
          ? row.organizationOwnerFirstName + " " + row.organizationOwnerLastName
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
        eventDate: row.eventDate ? moment(row.eventDate).format("DD-MM-YYYY") : "-",
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
    setLoading(true);
    console.log("oid", id);

    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`)
      // .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getById?id=${id}`)
      .then((r) => {
        setLoading(true);
        console.log("By id", r, moment(r.data.eventDate).format("dddd"));
        setLoading(false);
        if (r.status === 200) {
          setBookedData(r?.data);
          reset(r.data);
          setValue("eventDay", moment(r.data.eventDate).format("dddd"));
          setValue("auditoriumBookingNumber", r.data.applicationNumber);
          setValue("auditoriumId", r.data.auditoriumId);
          setValue("serviceId", r.data.serviceId);
          setValue("bookingDate", r.data.applicationDate);

          const levelsOfRolesDaoList = r?.data?.equipmentBookingList?.map((val) => {
            return {
              equipment: val.equipmentKey,
              rate: val.rate,
              quantity: val.quantity,
              total: val.total,
            };
          });
          appendUI();
          setValue("levelsOfRolesDaoList", levelsOfRolesDaoList);
          
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
        toast("Details Not Found !!!", {
          type: "error",
        });
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
        })),
      );
    });
  };

  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row, index) => ({
          id: row.id,
          zoneName: row.zoneName,
        })),
      );
    });
  };

  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        })),
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
              ? auditoriums.find((obj) => obj?.id == val.auditoriumId)?.auditoriumName
              : "Not Available",
            eventDate: val.eventDate ? moment(formData.eventDate).format("DD-MM-YYYY") : "-",
            mobile: val.mobile ? val.mobile : "-",
            organizationName: val.organizationName ? val.organizationName : "-",
            organizationOwnerFirstName: val.organizationOwnerFirstName
              ? val.organizationOwnerFirstName + " " + val.organizationOwnerLastName
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
          axios.post(`${urls.CFCURL}/master/billType/save`, body).then((res) => {
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
          axios.post(`${urls.CFCURL}/master/billType/save`, body).then((res) => {
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
    // setButtonInputState(false);
    // setSlideChecked(false);
    // setSlideChecked(false);
    // setIsOpenCollapse(false);
    // setEditButtonInputState(false);
    // setDeleteButtonState(false);
    router.push("/dashboard");
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...bookedData,
      citizenReasonForCancellation: formData?.citizenReasonForCancellation,
      cancelBy: "Citizen",
      cancellationRemarkByCitizen: formData?.cancellationRemarkByCitizen,
      remarks: formData?.cancellationRemarkByCitizen,
      processType: "C",
      designation: "Citizen",
      serviceId:113,
      // eventDate,
      // // auditoriumBookingNo: Number(formData.auditoriumBookingNumber),
      // // auditoriumId: Number(formData.auditoriumId),
      // serviceKey: Number(formData.serviceId),
      // auditoriumBookingKey: Number(formData.auditoriumBookingNumber),
      // auditoriumKey: Number(formData.auditoriumId),
      // aadhaarNo: Number(formData.aadhaarNo),
      // landlineNo: Number(formData.landlineNo),
      // // mobile: Number(formData.mobile),
      // mobileNo: Number(formData.mobile),
      // depositAmount: Number(formData.depositAmount),
      // payRentAmount: Number(formData.payRentAmount),
      // pincode: Number(formData.pincode),
      // rentAmount: Number(formData.rentAmount),
      // extendedRentAmount: Number(formData.extendedRentAmount),
      // bankaAccountNo: Number(formData.bankaAccountNo),
      // // amountToBeReturned: Number(formData.amountToBeReturned),
      // amountToBeReturnedAfterBookingCancellation: Number(formData.amountToBeReturned),
      // notesheetReferenceNo: Number(formData.notesheet_ReferenceNumber),
      // id: null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    // axios
    //   .post(
    //     `http://192.168.68.145:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/bookingCancellation`,
    //     finalBodyForApi,
    //   )
    //   .then((res) => {
    axios
      .post(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/bookingCancellation`, finalBodyForApi)
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push("/dashboard");
          // getAuditoriumBooking();
          // getBookingCancellation();
          // setButtonInputState(false);
          // setIsOpenCollapse(false);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);
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
      headerName: <FormattedLabel id="srNo" />,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "organizationName",
      headerName: <FormattedLabel id="organizationName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "organizationOwnerFirstName",
      headerName: <FormattedLabel id="organizationOwnerFirstName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventDate",
      headerName: <FormattedLabel id="eventDate" />,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "mobileNo",
      headerName: <FormattedLabel id="mobile" />,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "rentAmount",
      headerName: <FormattedLabel id="rentAmount" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    ,
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
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
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="bookingCancellation" />
            </h2>
          </Box>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px" }}>
                  <Grid item xs={12} sm={3} md={3} lg={3} xl={3}></Grid>
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
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label={<FormattedLabel id="auditoriumBookingNumber" />}
                      variant="outlined"
                      size="small"
                      sx={{
                        width: "90%",
                      }}
                      {...register("auditoriumBookingNumber")}
                      error={!!errors.auditoriumBookingNumber}
                      helperText={
                        errors?.auditoriumBookingNumber ? errors.auditoriumBookingNumber.message : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="outlined"
                      color="success"
                      disabled={!watch("auditoriumBookingNumber")}
                      size="small"
                      sx={{
                        "&:hover": {
                          backgroundColor: "#0A4EE8",
                          color: "#fff",
                        },
                      }}
                      onClick={() => {
                        let enteredAuditoriumBookingNo = watch("auditoriumBookingNumber");
                        getAuditoriumBookingDetailsById(enteredAuditoriumBookingNo);

                        setShowAccordion(true);
                        setOpenAccordion(true);
                      }}
                    >
                      <FormattedLabel id="searchByAuditoriumBookingNumber" />
                    </Button>
                  </Grid>
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
                    }}
                  >
                    <FormControl error={errors.auditoriumId} variant="outlined" sx={{ width: "90%" }}>
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="selectAuditorium" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={field.value}
                            size="small"
                            disabled
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="selectAuditorium" />}
                          >
                            {auditoriums &&
                              auditoriums.map((auditorium, index) => {
                                return (
                                  <MenuItem key={index} value={auditorium.id}>
                                    {auditorium.auditoriumNameEn}
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
                        {errors?.auditoriumId ? errors.auditoriumId.message : null}
                      </FormHelperText>
                    </FormControl>
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
                    }}
                  >
                    <FormControl variant="outlined" sx={{ width: "90%" }} error={!!errors.serviceId}>
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="selectService" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={field.value}
                            size="small"
                            disabled
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="selectService" />}
                          >
                            {services &&
                              services.map((service, index) => (
                                <MenuItem
                                  key={index}
                                  sx={{
                                    display: service.serviceName ? "flex" : "none",
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
                      <FormHelperText>{errors?.serviceId ? errors.serviceId.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
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
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="outlined-basic"
                      size="small"
                      label="Citizen reason for cancellation"
                      variant="outlined"
                      {...register("citizenReasonForCancellation")}
                      error={!!errors.citizenReasonForCancellation}
                      helperText={
                        errors?.citizenReasonForCancellation ? errors.citizenReasonForCancellation.message : null
                      }
                    />
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
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="outlined-basic"
                      label="Cancellation Remark"
                      size="small"
                      variant="outlined"
                      {...register("cancellationRemarkByCitizen")}
                      error={!!errors.cancellationRemarkByCitizen}
                      helperText={
                        errors?.cancellationRemarkByCitizen
                          ? errors.cancellationRemarkByCitizen.message
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
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl sx={{ width: "90%" }} error={errors.bookingDate}>
                      <Controller
                        name="bookingDate"
                        label="Booking Date"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              disabled
                              label={<span style={{ fontSize: 16 }}>Booking Date</span>}
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
                                  label="Booking Date"
                                  fullWidth
                                  error={errors.calendar}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.bookingDate ? errors.bookingDate.message : null}
                      </FormHelperText>
                    </FormControl>
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
                    }}
                  >
                    <FormControl sx={{ width: "90%" }} error={errors.cancellationDate}>
                      <Controller
                        name="cancellationDate"
                        label="Cancellation Date"
                        control={control}
                        defaultValue={new Date()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              disabled
                              label={<span style={{ fontSize: 16 }}>Cancellation Date</span>}
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
                                  label="Cancellation Date"
                                  fullWidth
                                  error={errors.calendar}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.cancellationDate ? errors.cancellationDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* <Grid container sx={{ padding: "10px" }}>
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
                            label={<FormattedLabel id="cancelByApplicant_Vendor" />}
                          />
                          <FormControlLabel
                            value="Cancel by Department"
                            control={<Radio />}
                            label={<FormattedLabel id="cancelByDepartment" />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid> */}

                {showAccordion && (
                  <>
                    <Accordion sx={{ padding: "10px" }} expanded={openAccordion}>
                      <AccordionSummary
                        sx={{
                          backgroundColor: "#0070f3",
                          color: "white",
                          textTransform: "uppercase",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        backgroundColor="#0070f3"
                        onClick={() => {
                          setOpenAccordion(!openAccordion);
                        }}
                      >
                        <Typography>Booking Auditorium Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
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
                              label={<FormattedLabel id="organizationName" />}
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              disabled
                              {...register("organizationName")}
                              error={!!errors.organizationName}
                              helperText={errors?.organizationName ? errors.organizationName.message : null}
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
                              label={<FormattedLabel id="title" />}
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
                              label={<FormattedLabel id="flat_buildingNo" />}
                              disabled
                              sx={{
                                width: "90%",
                                "& .MuiInput-input": {
                                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                  },
                                },
                              }}
                              variant="standard"
                              type="number"
                              {...register("flatBuildingNo")}
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.flatBuildingNo}
                              helperText={errors?.flatBuildingNo ? errors.flatBuildingNo.message : null}
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
                              label={<FormattedLabel id="organizationOwnerFirstName" />}
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
                              label={<FormattedLabel id="organizationOwnerMiddleName" />}
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
                              label={<FormattedLabel id="organizationOwnerLastName" />}
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
                              label={<FormattedLabel id="buildingName" />}
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              {...register("buildingName")}
                              error={!!errors.buildingName}
                              disabled
                              helperText={errors?.buildingName ? errors.buildingName.message : null}
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
                              label={<FormattedLabel id="roadName" />}
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              disabled
                              {...register("roadName")}
                              error={!!errors.roadName}
                              helperText={errors?.roadName ? errors.roadName.message : null}
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
                              label={<FormattedLabel id="landmark" />}
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              disabled
                              {...register("landmark")}
                              error={!!errors.landmark}
                              helperText={errors?.landmark ? errors.landmark.message : null}
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
                              label={<FormattedLabel id="pinCode" />}
                              variant="standard"
                              disabled
                              type="number"
                              InputLabelProps={{ shrink: true }}
                              sx={{
                                width: "90%",
                                "& .MuiInput-input": {
                                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                  },
                                },
                              }}
                              onInput={(e) => {
                                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 6);
                              }}
                              {...register("pincode")}
                              error={!!errors.pincode}
                              helperText={errors?.pincode ? errors.pincode.message : null}
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
                              label={<FormattedLabel id="aadhaarNo" />}
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
                                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                  },
                                },
                              }}
                              type="number"
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              {...register("aadhaarNo")}
                              error={!!errors.aadhaarNo}
                              helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
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
                              label={<FormattedLabel id="landline" />}
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
                                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                  },
                                },
                              }}
                              {...register("landlineNo")}
                              error={!!errors.landlineNo}
                              helperText={errors?.landlineNo ? errors.landlineNo.message : null}
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
                              label={<FormattedLabel id="mobile" />}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              type="number"
                              sx={{
                                width: "90%",
                                "& .MuiInput-input": {
                                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
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
                              label={<FormattedLabel id="emailAddress" />}
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              {...register("emailAddress")}
                              error={!!errors.emailAddress}
                              helperText={errors?.emailAddress ? errors.emailAddress.message : null}
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
                                <FormattedLabel id="messageDisplay" />
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
                                    label={<FormattedLabel id="messageDisplay" />}
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
                                {errors?.messageDisplay ? errors.messageDisplay.message : null}
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
                              label={<FormattedLabel id="eventDetails" />}
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              disabled
                              {...register("eventDetails")}
                              error={!!errors.eventDetails}
                              helperText={errors?.eventDetails ? errors.eventDetails.message : null}
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
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel id="eventDate" />
                                        </span>
                                      }
                                      value={field.value}
                                      disabled
                                      onChange={(date) => {
                                        field.onChange(date);
                                        // setValue("eventDay", moment(date).format("dddd"));
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
                              label={<FormattedLabel id="eventDay" />}
                              disabled
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="standard"
                              {...register("eventDay")}
                              error={!!errors.eventDay}
                              helperText={errors?.eventDay ? errors.eventDay.message : null}
                            />
                          </Grid>
                        </Grid>

                        {/* <Grid container sx={{ padding: "10px" }}>
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
                        <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
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
                                      <FormattedLabel id="eventTimeFrom" />
                                    </span>
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" error={!!errors.eventTimeFrom} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.eventTimeFrom ? errors.eventTimeFrom.message : null}
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
                        <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
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
                                      <FormattedLabel id="eventTimeTo" />
                                    </span>
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" error={!!errors.eventTimeTo} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.eventTimeTo ? errors.eventTimeTo.message : null}
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
                          label={<FormattedLabel id="depositAmount" />}
                          disabled
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          {...register("depositAmount")}
                          error={!!errors.depositAmount}
                          helperText={errors?.depositAmount ? errors.depositAmount.message : null}
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
                        <Typography>
                          <FormattedLabel id="payDepositAmount" />
                        </Typography>
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
                          label={<FormattedLabel id="rentAmount" />}
                          variant="standard"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                          disabled
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("rentAmount")}
                          error={!!errors.rentAmount}
                          helperText={errors?.rentAmount ? errors.rentAmount.message : null}
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
                          label={<FormattedLabel id="payRentAmount" />}
                          variant="standard"
                          type="number"
                          disabled
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("payRentAmount")}
                          error={!!errors.payRentAmount}
                          helperText={errors?.payRentAmount ? errors.payRentAmount.message : null}
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
                        <Typography>
                          <FormattedLabel id="depositReceipt" />
                        </Typography>
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
                          label={<FormattedLabel id="extendedRentAmount" />}
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          disabled
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("extendedRentAmount")}
                          error={!!errors.extendedRentAmount}
                          helperText={errors?.extendedRentAmount ? errors.extendedRentAmount.message : null}
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
                        <Typography>
                          <FormattedLabel id="rentReceipt" />
                        </Typography>
                        <Link href="#">Print</Link>
                      </Grid>
                    </Grid> */}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ padding: "10px" }}>
                      <AccordionSummary
                        sx={{
                          backgroundColor: "#0070f3",
                          color: "white",
                          textTransform: "uppercase",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        backgroundColor="#0070f3"
                      >
                        <Typography>Applicant Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
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
                              InputLabelProps={{ shrink: true }}
                              label="Applicant Name"
                              variant="standard"
                              {...register("applicantName")}
                              error={!!errors.applicantName}
                              helperText={errors?.applicantName ? errors.applicantName.message : null}
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
                              label="Mobile Number"
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              {...register("applicantMobileNo")}
                              error={!!errors.applicantMobileNo}
                              helperText={errors?.applicantMobileNo ? errors.applicantMobileNo.message : null}
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
                              label="Confirm Mobile"
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              {...register("applicantConfirmMobileNo")}
                              error={!!errors.applicantConfirmMobileNo}
                              helperText={
                                errors?.applicantConfirmMobileNo
                                  ? errors.applicantConfirmMobileNo.message
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
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              id="standard-basic"
                              label="Email Address"
                              variant="standard"
                              {...register("applicantEmail")}
                              error={!!errors.applicantEmail}
                              helperText={errors?.applicantEmail ? errors.applicantEmail.message : null}
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
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              id="standard-basic"
                              label="Confirm Email Address"
                              variant="standard"
                              {...register("applicantConfirmEmail")}
                              error={!!errors.applicantConfirmEmail}
                              helperText={
                                errors?.applicantConfirmEmail ? errors.applicantConfirmEmail.message : null
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
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              id="standard-basic"
                              label="Relation With Organization"
                              variant="standard"
                              {...register("relationWithOrganization")}
                              error={!!errors.relationWithOrganization}
                              helperText={
                                errors?.relationWithOrganization
                                  ? errors.relationWithOrganization.message
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
                              label="Flat/Building No."
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              variant="standard"
                              {...register("applicantFlatHouseNo")}
                              error={!!errors.applicantFlatHouseNo}
                              helperText={
                                errors?.applicantFlatHouseNo ? errors.applicantFlatHouseNo.message : null
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
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              id="standard-basic"
                              label="Building Name"
                              variant="standard"
                              {...register("applicantBuildingName")}
                              error={!!errors.applicantBuildingName}
                              helperText={
                                errors?.applicantBuildingName ? errors.applicantBuildingName.message : null
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
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              id="standard-basic"
                              label="Landmark"
                              variant="standard"
                              {...register("applicantLandmark")}
                              error={!!errors.applicantLandmark}
                              helperText={errors?.applicantLandmark ? errors.applicantLandmark.message : null}
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
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              id="standard-basic"
                              label="Area"
                              variant="standard"
                              {...register("applicantArea")}
                              error={!!errors.applicantArea}
                              helperText={errors?.applicantArea ? errors.applicantArea.message : null}
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
                              error={errors.applicantCountry}
                              variant="standard"
                              sx={{ width: "90%" }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">Country</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ minWidth: 220 }}
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Select Country"
                                    disabled
                                    InputLabelProps={{ shrink: true }}
                                  >
                                    {[
                                      { id: 1, name: "India" },
                                      { id: 2, name: "Other" },
                                    ].map((country, index) => {
                                      return (
                                        <MenuItem key={index} value={country.name}>
                                          {country.name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="applicantCountry"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.applicantCountry ? errors.applicantCountry.message : null}
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
                              error={errors.applicantState}
                              variant="standard"
                              sx={{ width: "90%" }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">Select State</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ minWidth: 220 }}
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Select State"
                                    disabled
                                    InputLabelProps={{ shrink: true }}
                                  >
                                    {["Maharashtra", "Other"].map((state, index) => {
                                      return (
                                        <MenuItem key={index} value={state}>
                                          {state}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="applicantState"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.applicantState ? errors.applicantState.message : null}
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
                              error={errors.applicantCity}
                              variant="standard"
                              sx={{ width: "90%" }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">City</InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ minWidth: 220 }}
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={field.value}
                                    disabled
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(value) => field.onChange(value)}
                                    label="City"
                                  >
                                    {["Pune", "Other"].map((city, index) => {
                                      return (
                                        <MenuItem key={index} value={city}>
                                          {city}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="applicantCity"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.applicantCity ? errors.applicantCity.message : null}
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
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              id="standard-basic"
                              label="Pin Code"
                              variant="standard"
                              {...register("applicantPinCode")}
                              error={!!errors.applicantPinCode}
                              helperText={errors?.applicantPinCode ? errors.applicantPinCode.message : null}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ padding: "10px" }}>
                      <AccordionSummary
                        sx={{
                          backgroundColor: "#0070f3",
                          color: "white",
                          textTransform: "uppercase",
                        }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        backgroundColor="#0070f3"
                      >
                        <Typography>Equipments</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container>
                          {fields.map((witness, index) => {
                            return (
                              <>
                                <Grid
                                  container
                                  key={index}
                                  sx={{
                                    backgroundColor: "#E8F6F3",
                                    padding: "5px",
                                  }}
                                >
                                  <Grid
                                    item
                                    xs={5}
                                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                  >
                                    <FormControl style={{ width: "90%" }} size="small">
                                      <InputLabel id="demo-simple-select-label">Equipment</InputLabel>
                                      <Controller
                                        render={({ field }) => (
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Equipment"
                                            value={field.value}
                                            disabled
                                            onChange={(value) => {
                                              field.onChange(value);
                                              // let df = equipmentCharges.find((val) => {
                                              //   return (
                                              //     val.equipmentName == value.target.value && val.totalAmount
                                              //   );
                                              // });
                                              // setValue(`levelsOfRolesDaoList.${index}.rate`, df.totalAmount);
                                            }}
                                            style={{ backgroundColor: "white" }}
                                          >
                                            {equipments.length > 0
                                              ? equipments.map((val, id) => {
                                                  return (
                                                    <MenuItem key={id} value={val.id}>
                                                      {language === "en"
                                                        ? val.equipmentNameEn
                                                        : val.equipmentNameMr}
                                                    </MenuItem>
                                                  );
                                                })
                                              : "Not Available"}
                                          </Select>
                                        )}
                                        name={`levelsOfRolesDaoList.${index}.equipment`}
                                        control={control}
                                        defaultValue=""
                                        key={witness.id}
                                      />
                                      <FormHelperText style={{ color: "red" }}>
                                        {errors?.departmentName ? errors.departmentName.message : null}
                                      </FormHelperText>
                                    </FormControl>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={2}
                                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                  >
                                    <TextField
                                      sx={{ width: "90%" }}
                                      size="small"
                                      id="outlined-basic"
                                      label="Rate"
                                      disabled
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      variant="outlined"
                                      style={{ backgroundColor: "white" }}
                                      {...register(`levelsOfRolesDaoList.${index}.rate`)}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={2}
                                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                  >
                                    <TextField
                                      sx={{ width: "90%" }}
                                      size="small"
                                      id="outlined-basic"
                                      label="Quantity"
                                      variant="outlined"
                                      // key={witness.id}
                                      disabled
                                      style={{ backgroundColor: "white" }}
                                      {...register(`levelsOfRolesDaoList.${index}.quantity`)}
                                      key={witness.id}
                                      // name={`levelsOfRolesDaoList[${index}].quantity`}
                                      inputRef={register()}
                                      onChange={(event) => {
                                        const { value } = event.target;
                                        setValue(
                                          `levelsOfRolesDaoList[${index}].total`,
                                          value * watch(`levelsOfRolesDaoList.${index}.rate`),
                                        );
                                      }}
                                      error={errors?.levelsOfRolesDaoList?.[index]?.quantity}
                                      helperText={
                                        errors?.levelsOfRolesDaoList?.[index]?.quantity
                                          ? errors.levelsOfRolesDaoList?.[index]?.quantity.message
                                          : null
                                      }
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={2}
                                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                  >
                                    <TextField
                                      sx={{ width: "90%" }}
                                      size="small"
                                      id="outlined-basic"
                                      label="Total"
                                      disabled
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      variant="outlined"
                                      style={{ backgroundColor: "white" }}
                                      {...register(`levelsOfRolesDaoList.${index}.total`)}
                                    />
                                  </Grid>
                                </Grid>
                              </>
                            );
                          })}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    {/* <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>Amount Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                        <FormattedLabel id="returnAmountDetails" />
                      </Typography>
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
                          <FormattedLabel id="shownAnAmountToBeReturnedAfterBookingCancellation" />
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
                          label={<FormattedLabel id="amountToBeReturned" />}
                          InputLabelProps={{ shrink: true }}
                          variant="standard"
                          {...register("amountToBeReturned")}
                          error={!!errors.amountToBeReturned}
                          helperText={errors?.amountToBeReturned ? errors.amountToBeReturned.message : null}
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
                        <FormattedLabel id="bookingCancellationDetails" />
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
                          label={<FormattedLabel id="budgetingUnit" />}
                          InputLabelProps={{ shrink: true }}
                          variant="standard"
                          {...register("budgetingUnit")}
                          error={!!errors.budgetingUnit}
                          helperText={errors?.budgetingUnit ? errors.budgetingUnit.message : null}
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
                          label={<FormattedLabel id="notesheet_ReferenceNumber" />}
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
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
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="billDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => {
                                    field.onChange(date);
                                  }}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" fullWidth error={errors.billDate} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>{errors?.billDate ? errors.billDate.message : null}</FormHelperText>
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
                          label={<FormattedLabel id="budgetingUnit" />}
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
                          label={<FormattedLabel id="remark" />}
                          variant="standard"
                          {...register("remarks")}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.remarks}
                          helperText={errors?.remarks ? errors.remarks.message : null}
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
                          <FormattedLabel id="clear" />
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
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion> */}
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
                          justifyContent: "end",
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
                          <FormattedLabel id="clear" />
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
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider />
                  </>
                )}
              </form>
            </Slide>
          )}

          {/* <Grid container style={{ padding: "10px" }}>
            <Grid item xs={9}></Grid>
            <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                size="small"
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
                <FormattedLabel id="add" />
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
          </Box> */}
        </Paper>
      )}
    </div>
  );
};

export default BookingCancellation;
