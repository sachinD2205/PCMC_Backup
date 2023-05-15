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
// import styles from "./view.module.css";
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


  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);


  useEffect(() => {
    getAllMainSchemes();
    getAllSubSchemes();
  }, []);


const getAllMainSchemes = (_pageSize = 10, _pageNo = 0) => {  axios.get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
  params: {
    pageSize: _pageSize,
    pageNo: null,
  },
}).then( async (r) => {
  let result = r.data.mstMainSchemesList;
  let _res =
    result &&
    result.map((r, i) => {
      return {
        id: r.id,
        schemeName: r.schemeName ? r.schemeName : "-",
      };
    }); 
    // mainschemeList = _res;
     setMainNames([..._res]);
});

};

const getAllSubSchemes = (_pageSize = 10, _pageNo = 0) => { axios.get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
  params: {
    pageSize: _pageSize,
    pageNo: null,
  },
}).then( async (r) => {
  let result = r.data.mstSubSchemesList;
  let _res =
    result &&
    result.map((r, i) => {
      return {
        id: r.id,
        subSchemeName: r.subSchemeName ? r.subSchemeName : "-",
      };
    });
    // subschemeList = _res;
    await setSubSchemeNames(_res);
});

};


  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
    mainSchemeKey: null,
    subSchemeKey:null
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  ///////////// On submit method ////////////////////
  const onSubmitFunc = (formData) => {
    if (watch("fromDate") && watch("toDate")) {
      let sendFromDate = moment(watch("fromDate")).format("YYYY-MM-DDThh:mm:ss");
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DDThh:mm:ss");

      let apiBodyToSend = {
        ...formData,
        strFromDate: sendFromDate.replace("T", " "),
        strToDate: sendToDate.replace("T", " "),
      };

      ///////////////////////////////////////////
      axios
        .post(`${urls.BSUPURL}/report/getNamunaBReport`, apiBodyToSend)
        .then((res) => {
          console.log(":log", res);
          setLoading(true);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  zoneName: r.zoneName,
                  zoneNameMr: r.zoneNameMr,
                  areaName: r.areaName,
                  areaNameMr: r.areaNameMr,
                  wardName: r.wardName,
                  wardNameMr: r.wardNameMr,
                  schemeName: r.schemeName,
                  schemeNameMr: r.schemeNameMr,
                  cfcApplicationNo: r.cfcApplicationNo,
                  zoneOfficeApplicationNo: r.zoneOfficeApplicationNo,
                  beneficiaryName: r.beneficiaryName,
                  beneficiaryAddress: r.beneficiaryAddress,
                  mobileNo: r.mobileNo,
                  emailId: r.emailId,
                  aadharNo: r.aadharNo,

                  bankName: r.bankName,
                  bankNameMr: r.bankNameMr,
                  branchName: r.branchName,
                  branchNameMr:r.branchNameMr,
                  iFSCNo: r.iFSCNo,
                  mICRNo:r.mICRNo,
                  amount: r.amount,

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
        text: "Both From And To Dates Are Required!",
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
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "areaName",
      headerName: <FormattedLabel id="areaName" />,
      minWidth: 400,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "wardName",
      headerName: <FormattedLabel id="wardName" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "schemeName",
      headerName: <FormattedLabel id="schemeName" />,
      minWidth: 400,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cfcApplicationNo",
      headerName: <FormattedLabel id="cfcApplicationNo" />,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "beneficiaryName",
      headerName: <FormattedLabel id="beneficiaryName" />,
      minWidth: 400,
      headerAlign: "center",
      align: "center",
    },
    {
        field: "beneficiaryAddress",
        headerName: <FormattedLabel id="beneficiaryAddress" />,
        minWidth: 400,
        headerAlign: "center",
        align: "center",
      },
    {
      field: "mobileNo",
      headerName: <FormattedLabel id="mobileNo" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
        field: "emailId",
        headerName: <FormattedLabel id="emailId" />,
        minWidth: 200,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "aadharNo",
        headerName: <FormattedLabel id="aadharNo" />,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "bankName",
        headerName: <FormattedLabel id="bankName" />,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "branchName",
        headerName: <FormattedLabel id="branchName" />,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "iFSCNo",
        headerName: <FormattedLabel id="iFSCNo" />,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "mICRNo",
        headerName: <FormattedLabel id="mICRNo" />,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "amount",
        headerName: <FormattedLabel id="amount" />,
        minWidth: 250,
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
    downloadLink.download = data ? `Namuna B Report.csv` : "data.csv";
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
              <FormattedLabel id="namunaBReportHeading" />
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
                
              </Grid>

              {/* From date */}
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
              

                
      {/* main scheme dropdown */}

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
                  <FormControl error={errors.mainSchemeKey} variant="standard" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="mainScheme" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: "90%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      selected={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >

                      {mainNames &&
                        mainNames.map((auditorium, index) => 
                          (
                          <MenuItem key={index} value={auditorium.id}>
                            {auditorium.schemeName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="mainSchemeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.mainSchemeKey ? errors.mainSchemeKey.message : null}
                </FormHelperText>
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
                  <FormControl error={errors.subSchemeKey} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="subScheme" /></InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "90%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {subSchemeNames &&
                            subSchemeNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.subSchemeName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="subSchemeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.subSchemeKey ? errors.subSchemeKey.message : null}
                    </FormHelperText>
                  </FormControl>
                 
                </Grid>
              </Grid>
</Grid>

                {/* Buttons Section */}
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
              {/* Submit Button */}
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
                
                {/* Download Button */}
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

                {/* Cancel Button */}
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
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
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
