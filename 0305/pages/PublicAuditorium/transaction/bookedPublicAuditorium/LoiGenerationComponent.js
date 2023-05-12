import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { ToWords } from "to-words";
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel.js'
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import { DataGrid } from "@mui/x-data-grid";

const LoiGenerationComponent = () => {
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

  const [serviceNames, setServiceNames] = useState([]);
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [auditoriums, setAuditoriums] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [uploadedData, setUploadData] = useState();

  const [rateChartData, setRateChartData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const rateChartColumns = [
    {
      field: "srNo",
      headerName: "Sr No",
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: "Auditorium",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "eventName",
      headerName: "Event",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "chargeName",
      headerName: "Charge",
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "period",
    //   headerName: "Period (Hr)",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "price",
      headerName: "Price",
      flex: 0.4,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "gst",
      headerName: "GST",
      flex: 0.4,
      align: "right",
      headerAlign: "center",
    },
    // {
    //   field: "deposite",
    //   headerName: "Deposite",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "rent",
    //   headerName: "Rent",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "securityGuardCharges",
    //   headerName: "Security Guard Charges",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "boardCharges",
    //   headerName: "Board Charges",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
  ];

  const [events, setEvents] = useState([]);

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

  useEffect(() => {
    let data = router?.query?.data && JSON.parse(router?.query?.data);
    setUploadData(data);
    reset(data);
    getserviceNames();
    // getLoiGenerationData();
    setValue("serviceName", 113);
    console.log("router.query", data);

    let _res = [
      {
        id: 1,
        srNo: 1,
        auditoriumName: data?._auditoriumId
          ? auditoriums?.find((obj) => {
              return obj?.id == data?._auditoriumId;
            })?.auditoriumNameEn
          : "-",
        eventName: data?.eventKey
          ? events?.find((obj) => {
              return obj?.id == data?.eventKey;
            })?.eventNameEn
          : "-",
        chargeName: "Deposit Amount",
        price: data?.depositAmount,
        gst: 0,
      },
      {
        id: 2,
        srNo: 2,
        auditoriumName: data?._auditoriumId
          ? auditoriums?.find((obj) => {
              return obj?.id == data?._auditoriumId;
            })?.auditoriumNameEn
          : "-",
        eventName: data?.eventKey
          ? events?.find((obj) => {
              return obj?.id == data?.eventKey;
            })?.eventNameEn
          : "-",
        chargeName: "Rent Amount",
        price: data?.rentAmount,
        gst: data?.rentAmount * 0.18,
      },
      {
        id: 3,
        srNo: 3,
        auditoriumName: data?._auditoriumId
          ? auditoriums?.find((obj) => {
              return obj?.id == data?._auditoriumId;
            })?.auditoriumNameEn
          : "-",
        eventName: data?.eventKey
          ? events?.find((obj) => {
              return obj?.id == data?.eventKey;
            })?.eventNameEn
          : "-",
        chargeName: "Board Charges",
        price: data?.boardChargesAmount,
        gst: data?.boardChargesAmount * 0.18,
      },
      {
        id: 4,
        srNo: 4,
        auditoriumName: data?._auditoriumId
          ? auditoriums?.find((obj) => {
              return obj?.id == data?._auditoriumId;
            })?.auditoriumNameEn
          : "-",
        eventName: data?.eventKey
          ? events?.find((obj) => {
              return obj?.id == data?.eventKey;
            })?.eventNameEn
          : "-",
        chargeName: "Security Guard Charges",
        price: data?.securityGuardChargeAmount,
        gst: data?.securityGuardChargeAmount * 0.18,
      },
    ];
    setRateChartData({
      rows: _res,
      totalRows: 10,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: 1,
      page: 1,
    });
  }, [auditoriums]);

  useEffect(() => {
    getAuditorium();
    getServices();
    getEvents();
  }, []);

  const getAuditorium = () => {
    axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
      console.log("respe 4Au", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          ...row,
          id: row.id,
          auditoriumNameEn: row.auditoriumNameEn,
        })),
      );
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

  let sendData = [];

  const getAuditoriumBooking = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: "dsc",
        },
      })
      .then((res) => {
        console.log("res aud", res);
        setLoading(false);
        let result = res.data.trnAuditoriumBookingOnlineProcessList;
        result.map((item) => {
          if (uploadedData.id == item.id) {
            sendData = JSON.stringify(item);
          }
        });
        let _res = result.map((val, i) => {
          return {
            ...val,
            srNo: _pageSize * _pageNo + i + 1,
            id: val.id,
            auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
            toDate: val.toDate ? val.toDate : "-",
            fromDate: val.fromDate ? val.fromDate : "-",
            holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
            status: val?.applicationStatus?.replace(/[_]/g, " "),
            _status: val.status,
            activeFlag: val.activeFlag,
            auditoriumBookingNo: val.auditoriumBookingNo,
            // auditoriumId: val.auditoriumId
            //   ? auditoriums.find((obj) => obj?.id == val.auditoriumId)?.auditoriumNameEn
            //   : "Not Available",
            auditoriumId: val.auditoriumId,
            _auditoriumId: val.auditoriumId,
            eventDate: val.eventDate ? moment(val?.eventDate).format("DD-MM-YYYY") : "-",
            mobile: val.mobile ? val.mobile : "-",
            organizationName: val.organizationName ? val.organizationName : "-",
            organizationOwnerFirstName: val.organizationOwnerFirstName
              ? val.organizationOwnerFirstName + " " + val.organizationOwnerLastName
              : "-",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  const getLoiGenerationData = () => {
    axios
      .get(`${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router?.query?.applicationId}`)
      .then((r) => {
        // console.log('r.data.status', r)
        if (r.status === 200) {
          setValue("penaltyCharge", r.data.penaltyCharge);
          setValue("serviceCharge", r.data.serviceCharge);
          setData(r.data);
          setServiceId(r.data.serviceId);
          setValue("serviceName", r.data.serviceId);
          console.log("resp.data", r.data);
          reset(r.data);
        }
      });
  };

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

  const onSubmitForm = (formData, event) => {
    sweetAlert({
      title: "LOI Genration",
      text: "Do you really want to genrate an LOI?",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: ["No", "Yes"],
    }).then((will) => {
      if (will) {
        const finalBodyForApi = {
          ...uploadedData,
          auditoriumId: uploadedData._auditoriumId,
          eventDate: moment(uploadedData.eventDate, "DD/MM/YYYY").format(`YYYY-MM-DD`),
          status: formData._status,
          remark: formData.remark,
          serviceId: 113,
          processType: "B",
          designation: "HOD",
        };

        console.log("finalBodyForApi", finalBodyForApi);
        console.log("sendData", sendData);

        axios
          // .post(`http://192.168.68.145:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/generateLoi`, finalBodyForApi)
          .post(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/generateLoi`, finalBodyForApi)
          .then((res) => {
            console.log("save data", res);
            getAuditoriumBooking();
            if (res.status == 201) {
              finalBodyForApi.id
                ? sweetAlert("LOI !", "LOI Generated successfully !", "success").then((willDelete) => {
                    if (willDelete) {
                      router.push({
                        pathname: "./LoiGenerationReciptmarathi",
                        query: {
                          receiptData: sendData,
                        },
                      });
                    }
                  })
                : sweetAlert("Saved!", "Record Saved successfully !", "success");
            }
          });
      } else {
        router.push("../bookedPublicAuditorium");
      }
    });
  };

  // Handle Next
  const handleNext = (data) => {
    let finalBodyForApi = {
      ...data,
      role: router?.query?.role,
      payment: null,
    };

    router.push({
      pathname: "/PublicAuditorium/transaction/bookedPublicAuditorium/LoiGenerationReciptmarathi",
    });

    // axios.post(`${urls.MR}/transaction/applicant/saveApplicationApprove`, finalBodyForApi).then((res) => {
    //   if (res.status == 200) {
    //     console.log("backendResponse", res);
    //     finalBodyForApi.id
    //       ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
    //       : sweetAlert("Saved!", "Record Saved successfully !", "success");

    //     router.push({
    //       pathname:
    //         "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
    //       query: {
    //         applicationId: getValues("id"),
    //       },
    //     });
    //   } else if (res.status == 201) {
    //     console.log("backendResponse", res);
    //     finalBodyForApi.id
    //       ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
    //       : sweetAlert("Saved !", "Record Saved successfully !", "success");

    //     router.push({
    //       pathname:
    //         "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
    //       query: {
    //         applicationId: getValues("id"),
    //       },
    //     });
    //   }
    // });
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Paper sx={{ padding: "10px" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>LOI Generation</h2>
          </Box>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid
              container
              sx={{
                padding: "10px",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <TextField
                  style={{ width: "90%" }}
                  disabled={true}
                  label="Applicant Name"
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
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <FormControl error={errors.serviceName} fullWidth sx={{ width: "90%" }}>
                  <InputLabel id="demo-simple-select-standard-label">Service Name</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={true}
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
            </Grid>
            <Grid
              container
              sx={{
                padding: "10px",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <TextField
                  style={{ width: "90%" }}
                  disabled={true}
                  label="Application Number"
                  InputLabelProps={{ shrink: true }}
                  {...register("applicationNumber")}
                  error={!!errors.applicationNumber}
                  helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
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
                  alignItems: "center",
                }}
              >
                <FormControl sx={{ width: "90%" }} error={errors.applicationDate}>
                  <Controller
                    name="applicationDate"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={<span style={{ fontSize: 16 }}>Application Date</span>}
                          value={field.value}
                          disabled
                          onChange={(date) => {
                            field.onChange(date);
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
                    {errors?.applicationDate ? errors.applicationDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Accordion sx={{ padding: "10px" }} defaultExpanded>
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
                <Typography>Booking Charges</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container sx={{ padding: "10px" }}>
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
                    initialState={{
                      aggregation: {
                        model: {
                          price: "sum",
                        },
                      },
                    }}
                    autoHeight={true}
                    pagination
                    paginationMode="server"
                    rowCount={rateChartData.totalRows}
                    rowsPerPageOptions={rateChartData.rowsPerPageOptions}
                    page={rateChartData.page}
                    pageSize={rateChartData.pageSize}
                    rows={rateChartData.rows}
                    columns={rateChartColumns}
                    onPageChange={(_data) => {}}
                    onPageSizeChange={(_data) => {}}
                  />
                </Grid>
              </AccordionDetails>
            </Accordion>

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
                  <Button type="submit" size="small" variant="contained">
                    Generate LOI
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>{" "}
        </Paper>
      </ThemeProvider>
    </div>
  );
};

export default LoiGenerationComponent;
