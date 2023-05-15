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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useRouter } from "next/router";
import MultipleUpload from "../depositeRefundProcessing/multipleUpload";
import FileTable from "../../../../components/publicAuditorium/FileTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const DepositeRefundProcessingByApplicant = () => {
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

  const user = useSelector((state) => state.user.user);
  console.log("useruser",user)

  const router = useRouter();

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(true);
  const [id, setID] = useState();

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [bookingCancellation, setBookingCancellation] = useState([]);
  const [services, setServices] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [bankNames, setBankNames] = useState([]);

  const [bookingFor, setBookingFor] = useState("Booking For PCMC");
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [bookedData, setBookedData] = useState([]);

  const [files, setFiles] = useState([]);

  const [electrialInspectorCertificate, setElectrialInspectorCertificate] = useState(null);

  console.log("electrialInspectorCertificate", electrialInspectorCertificate);

  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  // const [slideChecked, setSlideChecked] = useState(false);

  let appName = "PABBM";
  let serviceName = "PABBM-DRPBA";

  const _columns = [
    // {
    //   headerName: "Sr.No",
    //   field: "srNo",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: "File Name",
      field: "originalFileName",
      // File: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: "File Type",
      field: "extension",
      width: 140,
    },
    {
      headerName: "Uploaded By",
      field: "uploadedBy",
      flex: 1,
      // width: 300,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`, "_blank");
              }}
            >
              <VisibilityIcon />
            </IconButton>
            {/* <IconButton
              color="primary"
              onClick={() => {
                axios.delete(`${urls.CFCURL}/file/discard?filePath=${record.row.filePath}`).then((res) => {
                  let attachementY = JSON.parse(localStorage.getItem("noticeAttachment"))
                    ?.filter((a) => a?.filePath != record.row.filePath)
                    ?.map((a) => a);
                  setAdditionalFiles(attachementY);
                  localStorage.removeItem("noticeAttachment");
                  localStorage.setItem("noticeAttachment", JSON.stringify(attachementY));
                });
              }}
            >
              <DeleteIcon color="error" />
            </IconButton> */}
          </>
        );
      },
    },
  ];

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
    getEvents();
    getBankName();
    // getNexAuditoriumBookingNumber();
    // getServices();
  }, []);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
    localStorage.setItem("noticeAttachment", JSON.stringify([...mainFiles, ...additionalFiles]));
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    // getAuditoriumBooking();
    getDepositRefundProcessing();
  }, [auditoriums]);

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
      console.log("respe aud", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          id: row.id,
          auditoriumNameEn: row.auditoriumNameEn,
        })),
      );
    });
  };

  const getBankName = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankNames(r.data.bank);
    });
  };

  const getDepositRefundProcessing = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.PABBMURL}/trnDepositeRefundProcessByDepartment/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res, i) => {
        console.log("respe154", res);
        let result = res.data.trnDepositeRefundProcessByDepartmentList;

        let _res = result?.map((row, i) => ({
          id: row.id,
          srNo: _pageSize * _pageNo + i + 1,
          auditoriumName: row.auditoriumId
            ? auditoriums?.find((obj) => {
                return obj?.id == row.auditoriumId;
              })?.auditoriumName
            : "-",
          serviceId: row.serviceId,
          auditoriumBookingNo: row.auditoriumBookingNo,
          attachDocuments: row.attachDocuments,
          budgetingUnit: row.budgetingUnit,
          notesheetReferenceNo: row.notesheetReferenceNo,
          billDate: row.billDate ? row.billDate : "-",
          ecsPayment: row.ecsPayment,
          organizationName: row.organizationNameId ? row.organizationNameId : "-",
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

  const getEvents = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`).then((r) => {
      setEvents(
        r.data.trnAuditoriumEventsList.map((row) => ({
          ...row,
          id: row.id,
          programEventDescription: row.programEventDescription,
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

  const getAuditoriumBookingDetailsById = (id) => {
    setLoading(true);
    // axios
    //   .get(
    //     `http://192.168.68.145:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`,
    //   )
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`)
      .then((r) => {
        if (r.status === 200) {
          console.log("Byyye id", r.data.paymentDao);

          console.log("bankDao", r);
          setBookedData(r?.data);
          reset(r.data);
          setValue("organizationName", r.data.organizationName ? r.data.organizationName : "-");
          setValue("title", r.data.title ? r.data.title : "-");
          setValue("flatBuildingNo", r.data.flatBuildingNo ? r.data.flatBuildingNo : "-");
          setValue(
            "organizationOwnerFirstName",
            r.data.organizationOwnerFirstName ? r.data.organizationOwnerFirstName : "-",
          );
          setValue(
            "organizationOwnerMiddleName",
            r.data.organizationOwnerMiddleName ? r.data.organizationOwnerMiddleName : "-",
          );
          setValue(
            "organizationOwnerLastName",
            r.data.organizationOwnerLastName ? r.data.organizationOwnerLastName : "-",
          );
          setValue("buildingName", r.data.buildingName ? r.data.buildingName : "-");
          setValue("roadName", r.data.roadName ? r.data.roadName : "-");
          setValue("landmark", r.data.landmark ? r.data.landmark : "-");
          setValue("pincode", r.data.pincode ? r.data.pincode : "-");
          setValue("aadhaarNo", r.data.aadhaarNo ? r.data.aadhaarNo : "-");
          setValue("mobile", r.data.mobile ? r.data.mobile : "-");
          setValue("landlineNo", r.data.landlineNo ? r.data.landlineNo : "-");
          setValue("emailAddress", r.data.emailAddress ? r.data.emailAddress : "-");
          setValue("depositeReceiptNo", r.data.depositDeceiptId ? r.data.depositDeceiptId : "-");
          setValue("depositeAmount", r.data.depositedAmount ? r.data.depositedAmount : "-");
          setValue("eventDay", r.data.eventDay ? r.data.eventDay : "-");
          setValue("eventTimeFrom", r.data.eventTimeFrom ? r.data.eventTimeFrom : "-");
          setValue("eventTimeTo", r.data.eventTimeTo ? r.data.eventTimeTo : "-");
          setValue("depositeReceiptDate", r.data.depositReceiptDate ? r.data.depositReceiptDate : "-");

          setValue(
            "bankAccountHolderName",
            r?.data?.paymentDao?.bankAccountHolderName ? r?.data?.paymentDao?.bankAccountHolderName : "-",
          );
          setValue(
            "bankaAccountNo",
            r?.data?.paymentDao?.bankaAccountNo ? r?.data?.paymentDao?.bankaAccountNo : "-",
          );
          setValue(
            "typeOfBankAccountId",
            r?.data?.paymentDao?.typeOfBankAccountId ? r?.data?.paymentDao?.typeOfBankAccountId : "-",
          );
          setValue("bankNameId", r?.data?.paymentDao?.bankNameId ? r?.data?.paymentDao?.bankNameId : "-");
          setValue("bankAddress", r?.data?.paymentDao?.bankAddress ? r?.data?.paymentDao?.bankAddress : "-");
          setValue("ifscCode", r?.data?.paymentDao?.ifscCode ? r?.data?.paymentDao?.ifscCode : "-");
          setValue("micrCode", r?.data?.paymentDao?.micrCode ? r?.data?.paymentDao?.micrCode : "-");
          setValue("event", r?.data?.paymentDao?.event ? r?.data?.paymentDao?.event : "-");
          setValue(
            "applicantBuildingName",
            r?.data?.applicantFlatBuildingName ? r?.data?.applicantFlatBuildingName : "-",
          );
          setValue("bookingDate", r?.data?.applicationDate ? r?.data?.applicationDate : "-");
          setValue("eventTitle", r?.data?.eventTitle ? r?.data?.eventTitle : "-");

          setLoading(false);
        } else {
          setLoading(false);
          toast("Not Found !", {
            type: "error",
          });
        }
      })
      .catch((err) => {
        setLoading(false);
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
            eventDate: val.eventDate ? val.eventDate : "-",
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
          axios.post(`${urls.CFCURL}/master/billType/save`, body).then((res) => {
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
    router.push("/dashboard");
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    // const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      // ...formData,
      // ...bookedData,
      isApproved : true,
      applicationNumberKey: bookedData?.applicationNumber,
      attachDocuments: electrialInspectorCertificate,
      attachments: finalFiles,
      processType: "D",
      designation: "Citizen"
      // auditoriumBookingNo: Number(formData.auditoriumBookingNumber),
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.PABBMURL}/trnDepositeRefundProcessByDepartment/save`,
        // "http://192.168.68.145:9006/pabbm/api/trnDepositeRefundProcessByDepartment/save",
        finalBodyForApi,
      )
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAuditoriumBooking();
          router.push("/dashboard");
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
      field: "billDate",
      headerName: <FormattedLabel id="billDate" />,
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
      field: "bankAccountNo",
      headerName: <FormattedLabel id="bankAccountNumber" />,
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
              {/* <FormattedLabel id="bookingCancellation" /> */}
              Deposit Refund Process
            </h2>
          </Box>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
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
                      label={<FormattedLabel id="auditoriumBookingNumber" />}
                      variant="standard"
                      sx={{ width: "90%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      {...register("auditoriumBookingNumber")}
                      error={!!errors.auditoriumBookingNumber}
                      helperText={
                        errors?.auditoriumBookingNumber ? errors.auditoriumBookingNumber.message : null
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
                    <FormControl error={errors.auditoriumId} variant="standard" sx={{ width: "90%" }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="selectAuditorium" />
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
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.serviceId}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="selectService" />
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
                    {/* <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.serviceId}>
                      <InputLabel id="demo-simple-select-standard-label">Event</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            disabled
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Event"
                          >
                            {events &&
                              events.map((service, index) => (
                                <MenuItem
                                  key={index}
                                  sx={{
                                    display: service.eventNameEn ? "flex" : "none",
                                  }}
                                  value={service.id}
                                >
                                  {service.eventNameEn}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="serviceId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.serviceId ? errors.serviceId.message : null}</FormHelperText>
                    </FormControl> */}
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
                    <FormControl sx={{ width: "90%" }} error={errors.bookingDate}>
                      <Controller
                        name="bookingDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<span style={{ fontSize: 16 }}>Booking Date</span>}
                              value={field.value}
                              disabled
                              onChange={(date) => {
                                field.onChange(date);
                                // setValue("eventDay", moment(date).format("dddd"));
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField {...params} size="small" fullWidth error={errors.bookingDate} />
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
                      label="Event Title"
                      variant="standard"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      {...register("eventTitle")}
                      error={!!errors.eventTitle}
                      helperText={errors?.eventTitle ? errors.eventTitle.message : null}
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
                      label="Applicant Name"
                      variant="standard"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      {...register("applicantName")}
                      error={!!errors.applicantName}
                      helperText={errors?.applicantName ? errors.applicantName.message : null}
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      disabled={!watch("auditoriumBookingNumber")}
                      onClick={() => {
                        let enteredAuditoriumBookingNo = watch("auditoriumBookingNumber");
                        getAuditoriumBookingDetailsById(enteredAuditoriumBookingNo);
                      }}
                    >
                      <FormattedLabel id="searchByAuditoriumBookingNumber" />
                    </Button>
                  </Grid>
                </Grid>
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
                    <Typography>Attachement</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {/* <MultipleUpload files={files} setFiles={setFiles} /> */}

                        <FileTable
                          appName={appName} //Module Name
                          serviceName={serviceName} //Transaction Name
                          fileName={attachedFile} //State to attach file
                          filePath={setAttachedFile} // File state upadtion function
                          newFilesFn={setAdditionalFiles} // File data function
                          columns={_columns} //columns for the table
                          rows={finalFiles} //state to be displayed in table
                          uploading={setUploading}
                        />
                        {/* <UploadButton
                      appName="PABBM"
                      serviceName="depositeRefundProcessing"
                      filePath={setElectrialInspectorCertificate}
                      fileName={electrialInspectorCertificate}
                    /> */}
                      </Grid>

                      {/* <Grid item xs={2}>
                    <input accept="image/*" multiple type="file" />
                  </Grid> */}
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
                    <Typography>Bank Details</Typography>
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
                          label={<FormattedLabel id="bankAccountHolderName" />}
                          variant="standard"
                          disabled
                          InputLabelProps={{ shrink: true }}
                          {...register("bankAccountHolderName")}
                          error={!!errors.bankAccountHolderName}
                          helperText={
                            errors?.bankAccountHolderName ? errors.bankAccountHolderName.message : null
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
                          label={<FormattedLabel id="bankAccountNo" />}
                          variant="standard"
                          disabled
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("bankaAccountNo")}
                          error={!!errors.bankaAccountNo}
                          helperText={errors?.bankaAccountNo ? errors.bankaAccountNo.message : null}
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
                            <FormattedLabel id="typeOfBankAccount" />
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
                                  { id: 1, type: "Current" },
                                  { id: 2, type: "Saving" },
                                  { id: 3, type: "Other" },
                                ].map((bank, index) => (
                                  <MenuItem key={index} value={bank.id}>
                                    {bank.type}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                            name="typeOfBankAccountId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.typeOfBankAccountId ? errors.typeOfBankAccountId.message : null}
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
                        <FormControl variant="standard" error={!!errors.bankNameId} sx={{ width: "90%" }}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="bankName" />
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
                                label={<FormattedLabel id="bankName" />}
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
                          label={<FormattedLabel id="bankAddress" />}
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          {...register("bankAddress")}
                          error={!!errors.bankAddress}
                          helperText={errors?.bankAddress ? errors.bankAddress.message : null}
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
                          label={<FormattedLabel id="ifscCode" />}
                          disabled
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="standard"
                          {...register("ifscCode")}
                          error={!!errors.ifscCode}
                          helperText={errors?.ifscCode ? errors.ifscCode.message : null}
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
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          label={<FormattedLabel id="micrCode" />}
                          variant="standard"
                          {...register("micrCode")}
                          error={!!errors.micrCode}
                          helperText={errors?.micrCode ? errors.micrCode.message : null}
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
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 12);
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
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
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
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
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
                        <FormControl error={errors.messageDisplay} variant="standard" sx={{ width: "90%" }}>
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
                                    <TextField {...params} size="small" fullWidth error={errors.eventDate} />
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
                          label={<FormattedLabel id="depositAmount" />}
                          variant="standard"
                          disabled
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{
                            width: "90%",
                          }}
                          {...register("depositAmount")}
                          error={!!errors.depositAmount}
                          helperText={errors?.depositAmount ? errors.depositAmount.message : null}
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
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            disabled
                            label={<FormattedLabel id="managersDigitalSignature" />}
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
                            label={<FormattedLabel id="termsAndConditions" />}
                            variant="standard"
                            disabled
                            InputLabelProps={{ shrink: true }}
                            {...register("termsAndCondition")}
                            error={!!errors.termsAndCondition}
                            helperText={errors?.termsAndCondition ? errors.termsAndCondition.message : null}
                          />
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
                            errors?.applicantConfirmMobileNo ? errors.applicantConfirmMobileNo.message : null
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
                            errors?.relationWithOrganization ? errors.relationWithOrganization.message : null
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
                        <FormControl error={errors.applicantCountry} variant="standard" sx={{ width: "90%" }}>
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
                        <FormControl error={errors.applicantState} variant="standard" sx={{ width: "90%" }}>
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
                        <FormControl error={errors.applicantCity} variant="standard" sx={{ width: "90%" }}>
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
                </Accordion>

                <Divider />
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
          </Grid> */}

          {/* <Box style={{ height: "auto", overflow: "auto" }}>
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
          </Box> */}
        </Paper>
      )}
    </div>
  );
};

export default DepositeRefundProcessingByApplicant;
