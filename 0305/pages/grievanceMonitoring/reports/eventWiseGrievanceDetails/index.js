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
  const [loading, setLoading] = useState(false);

  const language = useSelector((store) => store.labels.language);

  const getEventTypes = () => {
    axios
      .get(`${urls.GM}/eventTypeMaster/getAll`)
      .then((res) => {
        console.log(":log", res);
        setLoading(true);
        if (res?.status === 200 || res?.status === 201) {
          setEventTypes(
            res?.data?.eventTypeMasterList?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              eventTypeEn: r.eventType,
              eventTypeMr: r.eventTypeMr,
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
    getEventTypes();
  }, []);

  //////////////////CANCEL OR CLEAR///////////////////
  let resetValuesCancell = {
    eventId: "",
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const onSubmitFunc = () => {
    if (watch("eventId") && watch("fromDate") && watch("toDate")) {
      let sendFromDate = moment(watch("fromDate")).format("YYYY-MM-DDThh:mm:ss");
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DDThh:mm:ss");

      let apiBodyToSend = {
        eventId: watch("eventId"),
        fromDate: sendFromDate,
        toDate: sendToDate,
      };

      ///////////////////////////////////////////
      axios
        .post(`${urls.GM}/report/getGrievanceDepSummeryEventWise`, apiBodyToSend)
        .then((res) => {
          console.log(":log", res);
          setLoading(true);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // srNo: i + 1,
                  complaintStatus: r.complaintStatus,
                  corporationName: r.corporationName,
                  departmentName: r.departmentName,
                  eventName: r.eventName,
                  fromDate: r.fromDate,
                  subDepartmentName: r.subDepartmentName,
                  toDate: r.toDate,
                  totalCount: r.totalCount,
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
      field: "departmentName",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "subDepartmentName",
      headerName: <FormattedLabel id="subDepartmentName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "eventName",
      headerName: <FormattedLabel id="eventName" />,
      minWidth: 180,
      headerAlign: "center",
    },
    {
      field: "complaintStatus",
      headerName: <FormattedLabel id="complaintStatus" />,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalCount",
      headerName: <FormattedLabel id="totalCount" />,
      minWidth: 100,
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
    downloadLink.download = data ? `${data[0]?.eventName}.csv` : "data.csv";
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
              <FormattedLabel id="EventWiseGrievanceDetails" />
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
                  <FormControl error={!!errors.eventId}>
                    <InputLabel>
                      <FormattedLabel id="eventName" />
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
                          {eventTypes &&
                            eventTypes.map((eventType, index) => (
                              <MenuItem key={index} value={eventType.id}>
                                {language == "en"
                                  ? //@ts-ignore
                                    eventType.eventTypeEn
                                  : // @ts-ignore
                                    eventType?.eventTypeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="eventId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.eventId ? errors.eventId.message : null}</FormHelperText>
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
                      {<FormattedLabel id="clear" />}
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
