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
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
  Tooltip,
} from "@mui/material";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
// import schema from "../../../../containers/schema/SlbSchema/entryFormSchema";
import schema from "../../../containers/schema/SlbSchema/entryFormSchema";

import { DataGrid, GridToolbar, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";

//DateRangePicker

// entryFormSchema
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../features/labelSlice";
import urls from "../../../URLS/urls";
import { useSelector } from "react-redux";
import theme from "../../../theme.js";
import { ContactPageSharp } from "@mui/icons-material";

import dynamic from "next/dynamic";
//import { StaticDateRangePicker } from "@material-ui/pickers";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
// import { InputLabel } from '@mui/material';

const HistoryDashboardV2 = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();
  const [moduleName, setModuleName] = useState([]);
  const [selectParameterKey, setSelectParameterKey] = useState();
  const [selectedZoneKey, setSelectedZoneKey] = useState();
  const [selectedWardKey, setSelectedWardKey] = useState();
  const [selectParameter, setSelectParameter] = useState();
  const [id, setID] = useState();

  const [parameterNameList, setParameterNameList] = useState([]);
  const [subParameterName, setSubParameterName] = useState([]);
  const [filteredSubParameterName, setFilteredSubParameterName] = useState([]);
  const [trnEntry, setTrnEntry] = useState([]);
  const [finalEntry, setFinalEntry] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [dataModule1, setDataModule1] = useState([]);
  const [benchmarkHistory1, setBenchmarkHistory1] = useState([]);

  const [dateRange, setDateRange] = useState([null, null]);
  const shortcutsItems = [
    { label: "Today", startDate: new Date(), endDate: new Date() },
    {
      label: "Last 7 Days",
      startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
    {
      label: "Last 30 Days",
      startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
  ];

  const handleDateChange = (dateRange) => {
    setDateRange(dateRange);
  };

  useEffect(() => {
    getModuleName();
    getZoneList();
    getWardList();
  }, []);

  // get Parameter
  const getBenchmarkHistoryByParameter = (selectedZoneKey, selectedWardKey, pmkey) => {
    console.log("get getBenchmarkHistoryByModule - " + pmkey);

    if (pmkey === null) {
      return;
    }
    let url = "";

    let mode = -1;

    if (selectedZoneKey === 0 && selectedWardKey === 0) {
      url = `${urls.SLB}/benchmarkHistoryPcmc/getAllByParameterId?parameterId=${pmkey}`;
      mode = 1;
    } else if (selectedZoneKey !== 0 && selectedWardKey === 0) {
      mode = 2;
      url = `${urls.SLB}/benchmarkHistoryZone/getAllByParameterIdZoneId?parameterId=${pmkey}&zoneId=${selectedZoneKey}`;
    } else if (selectedZoneKey !== 0 && selectedWardKey !== 0) {
      mode = 3;
      url = `${urls.SLB}/benchmarkHistory/getAllByParameterIdZoneIdWardId?parameterId=${pmkey}&zoneId=${selectedZoneKey}&wardId=${selectedWardKey}`;
    }

    console.log("Callingurl - " + url);

    axios.get(url).then((res) => {
      // assign maindata depending on mode (1,2,3)

      let mainData =
        mode == 1
          ? res?.data.benchmarkHistoryPcmcList
          : mode == 2
          ? res?.data.benchmarkHistoryZoneList
          : res?.data.benchmarkHistoryList;

      const data = mainData.map((r, i) => ({
        id: r.id,
        srNo: i + 1,
        moduleKey: r?.moduleKey,
        parameterKey: r?.parameterKey,
        parameterName: r?.parameterName,
        benchmarkValue: r?.benchmarkValue,
        calculatedBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),
        benchmarkDate: r?.benchmarkDate,

        // convert bemchmarkDate to dd/mm/yyyy HH:mm:ss format
        benchmarkDateFormatted: new Date(r?.benchmarkDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),

        entryUniqueIdentifier: r?.entryUniqueIdentifier,
      }));

      //sort data by benchmarkDate
      data.sort((a, b) => {
        return new Date(a.benchmarkDate) - new Date(b.benchmarkDate);
      });

      setBenchmarkHistory1(data);

      console.log("data", data);

      // Get list of unqiue parameterKey from data
      const parameterKeys = [...new Set(data.map((item) => item.parameterKey))];

      // Create separate lists for each paramaterKey from data by filtering by iterating through parameterKeys
      const series1 = parameterKeys.map((parameterKey) => {
        return {
          parameterKey: parameterKey,
          data: data
            .filter((item) => item.parameterKey === parameterKey)
            .map((item) => item.calculatedBenchmarkValue),
        };
      });

      console.log("series1", series1);
    });
    // iterate dataModule1 and copy the required parameters in series1
  };

  // get Zone Keys
  const getZoneList = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      // Print r in console
      console.log("zone", r);

      let list = r.data.zone.map((row) => ({
        id: row.id,
        zoneKey: row.zoneId,
        zoneName: row.zoneName,
      }));

      // Add "All" option to the list
      list.unshift({ id: 0, zoneKey: 0, zoneName: "All" });

      setZoneList(list);
    });
  };

  // get Ward Keys
  const getWardList = (selectedZoneId) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=${selectedZoneId}`,
      )
      .then((r) => {
        // Print r in console
        console.log("ward", r);

        let list = r.data.map((row) => ({
          id: row.id,
          wardKey: row.wardId,
          wardName: row.wardName,
        }));

        // Add "All" option to the list
        list.unshift({ id: 0, wardKey: 0, wardName: "All" });

        setWardList(list);
      });
  };

  // get Module Name
  const getModuleName = () => {
    axios.get(`${urls.SLB}/module/getAll`).then((res) => {
      console.log("ghfgf", res);
      setModuleName(
        res?.data?.moduleList?.map((r, i) => ({
          id: r.id,
          // name: r.name,
          moduleName: r.moduleName,
        })),
      );
    });
  };

  // get Parameter Name
  const getParameterName = () => {
    axios.get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=${watch("moduleKey")}`).then((res) => {
      console.log("ghfgf", res);
      setParameterNameList(
        res?.data?.parameterList?.map((r, i) => ({
          id: r.id,

          parameterName: r.parameterName,
          calculationMethod: r.calculationMethod,
          benchmarkType: r.benchmarkType,
        })),
      );
    });
  };

  const columnsBenchMarkHistory = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex:1
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parameterName",
      headerName: "Benchmark",
      flex: 1,
      headerAlign: "center",
      align: "center",
      //tooltip
      renderCell: (params) => (
        <Tooltip title={params.value} placement="top">
          <div>{params.value}</div>
        </Tooltip>
      ),
    },
    {
      field: "benchmarkValue",
      headerName: "Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "calculatedBenchmarkValue",
      headerName: "Actual Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benchmarkDate",
      headerName: "Entry Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "entryUniqueIdentifier",
      headerName: "UDID",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  const columnsModule1 = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex:1
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parameterName",
      headerName: "Benchmark",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benchmarkValue",
      headerName: "Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastActualBenchmarkValue",
      headerName: "Actual Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // add action column
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: 16 }}
              onClick={() => {
                console.log("params", params);
                setParamaterKey(params.row.id);

                // load next set of Data
                getBenchmarkHistoryByParameter(params.row.id);
              }}
            >
              Show History
            </Button>
          </div>
        );
      },
    },
  ];

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    parameterName: "",
    moduleName: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    parameterName: "",
    moduleName: "",
    id: null,
  };

  useEffect(() => {
    getParameterName();
    setSelectParameter(null);
  }, [watch("moduleKey")]);

  const onSubmitForm = (Data) => {
    console.log("databeing-passed", Data);

    getBenchmarkHistoryByParameter(selectedZoneKey, selectedWardKey, selectParameterKey);
    // // show alert
    // sweetAlert({
    //   title: "Are you sure?",
    //   text: "Once submitted, you will not be able to edit this entry!",
    //   icon: "warning",
    // });
  };
  // View
  return (
    <>
      {/* <BasicLayout> */}
      {/* <Box display="inkenline-block"> */}
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            // marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              {" "}
              History Dashboard
              {/* <FormattedLabel id="opinion" /> */}
            </h2>
          </Box>

          <Divider />

          <Box
            sx={{
              marginLeft: 5,
              marginRight: 5,
              // marginTop: 2,
              marginBottom: 5,
              padding: 1,
              // border:1,
              // borderColor:'grey.500'
            }}
          >
            <Box p={4}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* Firts Row */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* Zone Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">Zone</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              defaultValue={zoneList && zoneList.length > 0 ? zoneList[0].id : ""}
                              disabled={router?.query?.pageMode === "View"}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                getWardList(value.target.value);
                                setSelectedZoneKey(value.target.value);
                              }}
                              label={<FormattedLabel id="locationName" />}
                            >
                              {zoneList &&
                                zoneList.map((zone, index) => (
                                  <MenuItem key={index} value={zone.id}>
                                    {zone.zoneName}

                                    {/* {language == "en"
                                        ? name?.name
                                        : name?.name} */}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          // name="moduleName"
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Ward Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl variant="standard" size="medium" error={!!errors.wardKey}>
                        <InputLabel id="demo-simple-select-standard-label">Ward</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                setSelectedWardKey(value.target.value);
                              }}
                              label={<FormattedLabel id="locationName" />}
                            >
                              {wardList &&
                                wardList.map((ward, index) => (
                                  <MenuItem key={index} value={ward.id}>
                                    {ward.wardName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="wardKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Module Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.moduleName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">Module</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              // sx={{ width: 200 }}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label={<FormattedLabel id="locationName" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                            >
                              {moduleName &&
                                moduleName.map((moduleName, index) => (
                                  <MenuItem key={index} value={moduleName.id}>
                                    {moduleName.moduleName}

                                    {/* {language == "en"
                                        ? name?.name
                                        : name?.name} */}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          // name="moduleName"
                          name="moduleKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.moduleName ? errors.moduleName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Parameter Name */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.parameterName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Location Name */}
                          {/* {<FormattedLabel id="locationName" />} */}
                          Parameter
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              // sx={{ width: 200 }}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}

                              onChange={(value) => {
                                //getSubParameter(field, value);
                                field.onChange(value);
                                console.log("vtv" + value.target.value);
                                setSelectParameterKey(value.target.value);

                                // get parameter from paremeterlList
                                const param = parameterNameList.find(
                                  (parameterName) => parameterName.id === value.target.value,
                                );
                                setSelectParameter(param);
                                //setParameterName("SAgar");
                                console.log("inside selection changed", param);
                                //getSubParameterName(value.target.value);
                              }}
                              // label={<FormattedLabel id="locationName" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                            >
                              {parameterNameList &&
                                parameterNameList.map((parameterName, index) => (
                                  <MenuItem key={index} value={parameterName.id}>
                                    {parameterName.parameterName}

                                    {/* {language == "en"
                                        ? officeLocationName?.officeLocationName
                                        : officeLocationName?.officeLocationNameMar} */}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="parameterName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.parameterName ? errors.parameterName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Datepicker */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Controller
                        name="startDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<span style={{ fontSize: 16, marginTop: 2 }}>Start Date</span>}
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
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
                      <Grid item xl={6} lg={6} md={3} sm={3} xs={3} />
                      <Controller
                        name="endDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<span style={{ fontSize: 16, marginTop: 2 }}>End Date</span>}
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
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
                    </Grid>
                  </Grid>

                  <Divider />

                  <InputLabel
                    id="demo-simple-select-standard-label"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectParameter && "Benchmark Type : "}
                    {selectParameter && selectParameter.benchmarkType}
                    {selectParameter && " | Calculation Method : "}
                    {selectParameter && selectParameter.calculationMethod}
                  </InputLabel>

                  <Divider />

                  {/* Second Row */}
                  {/* Button Row */}
                  <Grid container mt={10} ml={5} mb={5} border px={5}>
                    <Grid item xs={5}></Grid>

                    {/* Save ad Draft */}
                    <Grid item>
                      <Button
                        // onClick={() => setButtonText("saveAsDraft")}
                        type="Submit"
                        variant="contained"
                      >
                        Submit
                        {/* {<FormattedLabel id="saveAsDraft" />} */}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>

            {/* show graph */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // flexDirection: "column",
              }}
            >
              <Grid container spacing={2}>
                <Grid item sm={12} md={12}>
                  <Divider />
                  {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        paddingTop: "10px",
                        paddingLeft: "10px",
                      }}
                    >
                      <h2>Historical Records - Graphical</h2>
                    </Box>
                  )}

                  <Divider />
                  {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
                    <Chart
                      options={{
                        chart: {
                          stacked: false,
                          xaxis: {
                            type: "category",
                            categories: benchmarkHistory1.map((r) =>
                              r.benchmarkDate ? r.benchmarkDate : r.id,
                            ),
                          },
                        },
                      }}
                      series={[
                        {
                          name: "Benchmark Value",
                          data: benchmarkHistory1.map((r) => {
                            return {
                              x: r.benchmarkDateFormatted ? r.benchmarkDateFormatted : r.id,
                              y: r.benchmarkValue,
                            };
                          }),
                        },
                        {
                          name: "Actual Benchmark Value",
                          data: benchmarkHistory1.map((r) => {
                            return {
                              x: r.benchmarkDateFormatted ? r.benchmarkDateFormatted : r.id,
                              y: r.calculatedBenchmarkValue ? r.calculatedBenchmarkValue : 0,
                            };
                          }),
                        },
                      ]}
                      type="line"
                      width={"100%"}
                      height={"500px"}
                    />
                  )}
                </Grid>

                <Grid item sm={12} md={12}>
                  <Divider />
                  {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        paddingTop: "10px",
                        paddingLeft: "10px",
                      }}
                    >
                      <h2>Historical Records - Tabular</h2>
                    </Box>
                  )}

                  <Divider />
                  {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
                    <div style={{ paddingTop: "1rem" }}>
                      <DataGrid
                        components={{ Toolbar: GridToolbar }}
                        componentsProps={{
                          toolbar: {
                            sx: {
                              backgroundColor: "#556CD6",
                              color: "white",

                              // change style of button
                              "& .MuiButton-root": {
                                color: "white",
                                backgroundColor: "#556CD6",
                                "&:hover": {
                                  backgroundColor: "#556CD6",
                                },
                              },
                            },
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },

                            printOptions: { disableToolbarButton: true },
                            // disableExport: true,
                            // disableToolbarButton: true,
                            // csvOptions: { disableToolbarButton: true },
                          },
                        }}
                        headerName="Water"
                        getRowId={(row) => row.srNo}
                        autoHeight
                        sx={{
                          // marginLeft: 5,
                          // marginRight: 5,
                          // marginTop: 5,
                          // marginBottom: 5,

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
                        rows={benchmarkHistory1}
                        columns={columnsBenchMarkHistory}
                      />
                    </div>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>
      {/* </Box> */}

      {/* </BasicLayout> */}
    </>
  );
};

export default HistoryDashboardV2;
