import { ThemeProvider } from "@emotion/react";
import {
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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import styles from "./view.module.css";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DetailsIcon from "@mui/icons-material/Details";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });
  const [data, setData] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const language = useSelector((store) => store.labels.language);

  const getComplaintTypes = () => {
    axios
      .get(`${urls.GM}/complaintTypeMaster/getAll`)
      .then((res) => {
        console.log(":log", res);
        setLoading(true);
        if (res?.status === 200 || res?.status === 201) {
          setComplaintTypes(
            res?.data?.complaintTypeMasterList?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              complaintTypeEn: r.complaintType,
              complaintTypeMr: r.complaintTypeMr,
              departmentId: r.departmentId,
              departmentName: r.departmentName,
            })),
          );
          setLoading(false);
        } else {
          sweetAlert("Something Went Wrong!");
          setLoading(false);
        }
      })
      .catch((error) => {
        sweetAlert(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getComplaintTypes();
  }, []);

  let resetValuesCancell = {
    complaintTypeId: "",
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  /////////////////////////////////////
  // /api/
  // const onSubmitFunc = () => {
  //   // alert("onSubmitFunc");
  //   console.log("::sendF", watch("fromDate"));

  //   let sendFromDate = moment(watch("fromDate")).format("YYYY-MM-DDThh:mm:ss");
  //   let sendToDate = moment(watch("toDate")).format("YYYY-MM-DDThh:mm:ss");

  //   let apiBodyToSend = {
  //     eventId: watch("eventId"),
  //     fromDate: sendFromDate,
  //     toDate: sendToDate,
  //   };
  //   axios
  //     .post(`${urls.GM}/report/getGrievanceDepSummeryEventWise`, apiBodyToSend)
  //     .then((res) => {
  //       console.log(":log", res);
  //       setLoading(true);
  //       if (res?.status === 200 || res?.status === 201) {
  //         if (res?.data.length > 0) {
  //           sweetAlert({
  //             icon: "success",
  //             // title: "Success",
  //             text: "Great! your data is here",
  //             // buttons: ["No", "Yes"],
  //             dangerMode: false,
  //             closeOnClickOutside: false,
  //           }).then((will) => {
  //             if (will) {
  //               setData(
  //                 res?.data?.map((r, i) => ({
  //                   id: i + 1,
  //                   // srNo: i + 1,
  //                   complaintStatus: r.complaintStatus,
  //                   corporationName: r.corporationName,
  //                   departmentName: r.departmentName,
  //                   eventName: r.eventName,
  //                   fromDate: r.fromDate,
  //                   subDepartmentName: r.subDepartmentName,
  //                   toDate: r.toDate,
  //                   totalCount: r.totalCount,
  //                 })),
  //               );
  //               setLoading(false);
  //             }
  //           });
  //         } else {
  //           sweetAlert({
  //             title: "Oops!",
  //             text: "There is nothing to show you!",
  //             icon: "warning",
  //             // buttons: ["No", "Yes"],
  //             dangerMode: false,
  //             closeOnClickOutside: false,
  //           });
  //           setData([]);
  //           setLoading(false);
  //         }
  //       } else {
  //         setData([]);
  //         sweetAlert("Something Went Wrong!");
  //         setLoading(false);
  //       }
  //     })
  //     .catch((error) => {
  //       setData([]);
  //       sweetAlert(error);
  //       setLoading(false);
  //     });
  // };
  //////////////////MODIFIED ONSUBMIT FUNC///////////////////
  const onSubmitFunc = () => {
    if (watch("complaintTypeId") && watch("fromDate") && watch("toDate")) {
      let sendFromDate = moment(watch("fromDate")).format("YYYY-MM-DDThh:mm:ss");
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DDThh:mm:ss");

      let apiBodyToSend = {
        eventId: watch("complaintTypeId"),
        fromDate: sendFromDate,
        toDate: sendToDate,
      };

      ///////////////////////////////////////////
      axios
        .post(`${urls.GM}/report/getSubjectWiseGrievanceReport`, apiBodyToSend)
        .then((res) => {
          console.log(":log", res);
          setLoading(true);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // srNo: i + 1,
                  complaintSubject: r.complaintSubject,
                  corporationName: r.corporationName,
                  departmentName: r.departmentName,
                  mediaName: r.mediaName,
                  fromDate: r.fromDate,
                  toDate: r.toDate,
                  totalComplaintsCount: r.totalComplaintsCount,
                })),
              );
              setLoading(false);
            } else {
              sweetAlert({
                title: "Oops!",
                text: "There is nothing to show you!",
                icon: "warning",
                // buttons: ["No", "Yes"],
                dangerMode: false,
                closeOnClickOutside: false,
              });
              setData([]);
              setLoading(false);
            }
          } else {
            setData([]);
            sweetAlert("Something Went Wrong!");
            setLoading(false);
          }
        })
        .catch((error) => {
          setData([]);
          sweetAlert(error);
          setLoading(false);
        });
    } else {
      sweetAlert({
        title: "Oops!",
        text: "All Three Values Are Required!",
        icon: "warning",
        // buttons: ["No", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setData([]);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "complaintSubject",
      headerName: <FormattedLabel id="complaintSubject" />,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "corporationName",
      headerName: <FormattedLabel id="corporationName" />,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="departmentName" />,
      minWidth: 250,
      headerAlign: "center",
    },

    {
      field: "mediaName",
      headerName: <FormattedLabel id="mediaName" />,
      minWidth: 150,
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "totalComplaintsCount",
      headerName: <FormattedLabel id="totalComplaintsCount" />,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    console.log(":generateCSVFile", data);

    const csv = [
      columns
        .map((c) => c.headerName)
        .map((obj) => obj?.props?.id)
        .join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    // downloadLink.download = "data.csv";
    downloadLink.download = data ? `${data[0]?.complaintSubject}.csv` : "data.csv";
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          margin: "30px",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>
              <FormattedLabel id="ComplaintWiseGrievanceDetails" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} style={{ margin: "10px", width: "80%" }}>
            <form onSubmit={handleSubmit(onSubmitFunc)}>
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <FormControl error={!!errors.complaintTypeId}>
                    <InputLabel>
                      <FormattedLabel id="complaintType" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          autoFocus
                          sx={{ width: "300px" }}
                          fullWidth
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          variant="standard"
                        >
                          {complaintTypes &&
                            complaintTypes.map((complaintType, index) => (
                              <MenuItem key={index} value={complaintType.id}>
                                {language == "en"
                                  ? //@ts-ignore
                                    complaintType.complaintTypeEn
                                  : // @ts-ignore
                                    complaintType?.complaintTypeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="complaintTypeId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.complaintTypeId ? errors.complaintTypeId.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {/* ////////////////////////////// */}
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl style={{ backgroundColor: "white" }} error={!!errors.fromDate}>
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="fromDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField {...params} size="small" fullWidth variant="standard" />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl style={{ backgroundColor: "white" }} error={!!errors.toDate}>
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="toDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField {...params} size="small" fullWidth variant="standard" />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {/* ////////////////////////////// */}

              <Grid
                container
                // spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                }}
              >
                {/* ///////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button type="submit" variant="contained" color="success" endIcon={<ArrowUpwardIcon />}>
                      {<FormattedLabel id="submit" />}
                    </Button>
                  </Paper>
                </Grid>

                {/* ///////////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      variant="contained"
                      color="success"
                      endIcon={<DownloadIcon />}
                      onClick={() => generateCSVFile(data)}
                    >
                      {<FormattedLabel id="download" />}
                    </Button>
                  </Paper>
                </Grid>
                {/* ///////////////////// */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "30px", width: "auto" }}>
                    <Button
                      // sx={{ marginRight: 8 }}
                      type="button"
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={onCancel}
                    >
                      {<FormattedLabel id="cancel" />}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </Paper>
          {loading ? (
            <CircularProgress color="success" />
          ) : data.length !== 0 ? (
            <div style={{ width: "100%" }}>
              <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",
                  "& .MuiDataGrid-virtualScrollerContent": {
                    // backgroundColor:'red',
                    // height: '800px !important',
                    // display: "flex",
                    // flexDirection: "column-reverse",
                    // overflow:'auto !important'
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
                // disableColumnFilter
                // disableColumnSelector
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 0 },
                    disableExport: true,
                    disableToolbarButton: false,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                rows={data ? data : []}
                columns={columns}
                density="standard"
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
              />
            </div>
          ) : (
            ""
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
