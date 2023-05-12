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
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  const [loading, setLoading] = useState(false);

  const language = useSelector((store) => store.labels.language);

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate")) {
      // alert("onSubmitFunc");
      let sendFromDate = moment(watch("fromDate")).format("YYYY-MM-DD hh:mm:ss");
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DD hh:mm:ss");

      let apiBodyToSend = {
        strFromDate: sendFromDate,
        strToDate: sendToDate,
      };

      ///////////////////////////////////////////
      setLoading(true);
      axios
        .post(`${urls.RTI}/report/getVivaranPatra01`, apiBodyToSend)
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // count: r.count,
                  // monthName: r.monthName,
                  // status: getStatusCode(r.status),
                  wardname: r.wardname,
                  // lastPendingMonth: r.status === 777 ? r.count : "-",
                  // infoDeleverdRTIAppCount: r.status === 11 ? r.count : "-",
                  // infoRejectedRTIAppCount: r.status === 15 ? r.count : "-",
                  // reportingMonthRecivedAppConunt: r.status === 999 ? r.count : "-",
                  // pendingAppCount: r.status === 888 ? r.count : "-",
                  // reportingMonthClearanceConunt:
                  //   (r.status === 11 ? r.count : 0) + (r.status === 15 ? r.count : 0),
                  lastMonthPendingApplication: r.lastMonthPendingApplication,
                  reportingMonthReceived: r.reportingMonthReceived,
                  reportingMonthApplicationClearance: r.reportingMonthApplicationClearance,
                  informationDelivered: r.informationDelivered,
                  informationRejected: r.informationRejected,
                  pendingApplicationCount: r.pendingApplicationCount,

                  // year: r.year,
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

  ///////////////////////////////////////////////////////
  function getStatusCode(code) {
    switch (code) {
      case 0:
        return "SAVE_AS_DRAFT";
      case 1:
        return "BACK_TO_CITIZEN";
      case 2:
        return "SEND_FOR_PAYMENT";
      case 3:
        return "PUBLIC_INFORMATION_OFFICER";
      case 4:
        return "LOI_GENERATED";
      case 5:
        return "LOI_RECEIPT_GENERATED";
      case 6:
        return "SEND_TO_APPELLETE_OFFICER";
      case 7:
        return "HEARING_SCHEDULED";
      case 8:
        return "HEARING_RESCHEDULED";
      case 9:
        return "DECISION_DONE";
      case 11:
        return "COMPLETE";
      case 12:
        return "CLOSE";
      case 13:
        return "DUPLICATE";

      case 14:
        return "INFORMATION_READY";

      case 15:
        return "REJECTED";

      default:
        return "unknown step";
    }
  }

  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "wardname",
    //   headerName: <FormattedLabel id="wards" />,
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "monthName",
    //   headerName: <FormattedLabel id="monthName" />,
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "year",
    //   headerName: <FormattedLabel id="year" />,
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "status",
    //   headerName: <FormattedLabel id="status" />,
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "count",
    //   headerName: <FormattedLabel id="count" />,
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "wardname",
      headerName: <FormattedLabel id="wards" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastMonthPendingApplication",
      headerName: <FormattedLabel id="lastMonthPendingAppCount" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reportingMonthReceived",
      headerName: <FormattedLabel id="reportingMonthRecivedAppConunt" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reportingMonthApplicationClearance",
      headerName: <FormattedLabel id="reportingMonthClearanceConunt" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "informationDelivered",
      headerName: <FormattedLabel id="infoDeleverdRTIAppCount" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "informationRejected",
      headerName: <FormattedLabel id="infoRejectedRTIAppCount" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pendingApplicationCount",
      headerName: <FormattedLabel id="pendingAppCount" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "Pending Application Count",
    //   headerName: <FormattedLabel id="pendingAppCount" />,
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
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
    downloadLink.download = "data.csv";
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  //////////////////////////////////////////
  function generatePDF(data) {
    const columnsData = columns.map((c) => c.headerName).map((obj) => obj?.props?.id);
    const rowsData = data.map((row) => columns.map((col) => row[col.field]));
    console.log(
      ":45",
      columns.map((c) => c.headerName).map((obj) => obj),
    );
    const doc = new jsPDF();
    doc.autoTable({
      head: [columnsData],
      body: rowsData,
    });
    doc.save("datagrid.pdf");
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
              <FormattedLabel id="vivaranPatra01" />
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
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="fromDateR" />
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
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            minDate={watch("fromDate")}
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="toDateR" />
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
                {/* <Grid
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
                </Grid> */}
                {/* ///////////////////// */}
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
                      {<FormattedLabel id="downloadEXCELL" />}
                    </Button>
                  </Paper>
                </Grid>
                {/* ////////////////////////////// */}
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
                      onClick={() => generatePDF(data)}
                    >
                      {<FormattedLabel id="downloadPDF" />}
                    </Button>
                  </Paper>
                </Grid>
                {/* //////////////////////////////////// */}

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
