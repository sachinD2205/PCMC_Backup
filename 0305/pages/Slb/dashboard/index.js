import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";

import { Box, Divider, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// import styles from "../court/view.module.css";

// import schema from "../../../../containers/schema/LegalCaseSchema/courtSchema";
import schema from "../../../containers/schema/SlbSchema/subParameterSchema";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [moduleNames, setModuleName] = useState([]);
  const [allParameterNames, setAllParameterNames] = useState([]);
  const [parameterNames, setParameterNames] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const [dataModule1, setDataModule1] = useState([]);
  const [dataModule2, setDataModule2] = useState([]);
  const [dataModule3, setDataModule3] = useState([]);
  const [dataModule4, setDataModule4] = useState([]);
  const [dataModule5, setDataModule5] = useState([]);

  const [zoneList, setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [selectedZoneKey, setSelectedZoneKey] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);
  const [selectedWardKey, setSelectedWardKey] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);

  // get Zone Keys
  const getZoneList = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      // Print r in console
      console.log("zone", r);

      const d = r.data.zone.map((row) => ({
        id: row.id + 1,
        zoneKey: row.id,
        zoneName: row.zoneName,
      }));

      // add one record to d with id as 0 and zoneKey as 0 and zoneName as All
      d.unshift({ id: 0, zoneKey: 0, zoneName: "All" });

      console.log("zone", d);
      setZoneList(d);

      setSelectedZoneKey(0);
      setSelectedZone({ id: 0, zoneKey: 0, zoneName: "All" });
    });
  };

  // get Ward Keys
  const getWardList = (selectedZoneId) => {
    //http://122.15.104.76:9090/cfc/cfc/api/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=3
    console.log(
      "get ward list " +
        "${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=" +
        selectedZoneId,
    );

    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=${selectedZoneId}`,
      )
      .then((r) => {
        // Print r in console
        console.log("ward", r);

        const d = r.data.map((row) => ({
          id: row.id + 1,
          wardKey: row.id,
          wardName: row.wardName,
        }));

        // add one record to d with id as 0 and wardKey as 0 and wardName as All
        d.unshift({ id: 0, wardKey: 0, wardName: "All" });

        setWardList(d);
      });
  };

  useEffect(() => {
    getWardList();
  }, [zoneList]);

  // get Parameter

  // get Parameter
  const getParameterModule1 = () => {
    console.log("get parameterModule1");
    axios.get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=1`).then((res) => {
      const data = res?.data.parameterList.map((r, i) => ({
        id: r.id,
        srNo: "B" + (i + 1),
        // name: r.name,
        parameterName: r?.parameterName,
        // set lastActualBenchmarkValue to 0 if null
        //lastActualBenchmarkValue: r?.lastActualBenchmarkValue,
        // Convert lastActualBenchmarkValue to double with 2 decimal places

        lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),

        benchmarkValue: r?.benchmarkValue,
        lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
      }));
      setDataModule1(data);
    });
    // iterate dataModule1 and copy the required parameters in series1
  };

  // get Parameter
  const getParameterModule2 = () => {
    console.log("get parameterModule2");
    axios.get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=2`).then((res) => {
      setDataModule2(
        res?.data.parameterList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          // name: r.name,
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),
          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
        })),
      );
    });
  };

  // get Parameter
  const getParameterModule3 = () => {
    console.log("get parameterModule3");
    axios.get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=3`).then((res) => {
      setDataModule3(
        res?.data.parameterList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          // name: r.name,
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),
          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
        })),
      );
    });
  };

  // get Parameter
  const getParameterModule4 = () => {
    console.log("get parameterModule4");
    axios.get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=4`).then((res) => {
      setDataModule4(
        res?.data.parameterList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          // name: r.name,
          parameterName: r?.parameterName,
          //lastActualBenchmarkValue: r?.lastActualBenchmarkValue,
          // Convert lastActualBenchmarkValue to double with 2 decimal places
          lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),
          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
        })),
      );
    });
  };

  // get Parameter
  const getParameterModule5 = () => {
    console.log("get parameterModule5");
    axios.get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=5`).then((res) => {
      setDataModule5(
        res?.data.parameterList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          // name: r.name,
          parameterName: r?.parameterName,
          //lastActualBenchmarkValue: r?.lastActualBenchmarkValue,
          // Convert lastActualBenchmarkValue to double with 2 decimal places
          lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),
          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
        })),
      );
    });
  };

  // getParameterModule1ForZone
  const getParameterModule1ForZone = () => {
    console.log("get getParameterModule1ForZone " + selectedZoneKey);
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=1&zoneKey=${selectedZoneKey}`)
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule1(data);
      });
  };

  // getParameterModule2ForZone
  const getParameterModule2ForZone = () => {
    console.log("get getParameterModule2ForZone " + selectedZoneKey);
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=2&zoneKey=${selectedZoneKey}`)
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule2(data);
      });
  };

  // getParameterModule3ForZone
  const getParameterModule3ForZone = () => {
    console.log("get getParameterModule3ForZone " + selectedZoneKey);
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=3&zoneKey=${selectedZoneKey}`)
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule3(data);
      });
  };

  // getParameterModule4ForZone
  const getParameterModule4ForZone = () => {
    console.log("get getParameterModule4ForZone " + selectedZoneKey);
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=4&zoneKey=${selectedZoneKey}`)
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule4(data);
      });
  };

  // getParameterModule5ForZone
  const getParameterModule5ForZone = () => {
    console.log("get getParameterModule5ForZone " + selectedZoneKey);
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=5&zoneKey=${selectedZoneKey}`)
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule5(data);
      });
  };

  const getParameterModuleForZoneWard = (mdlKey) => {
    console.log(
      "get getParameterModuleForZoneWard " + mdlKey + " " + selectedZoneKey + " " + selectedWardKey,
    );
    axios
      .get(
        `${urls.SLB}/benchmarkLiveZoneWard/getByModuleZoneWard?moduleKey=${mdlKey}&zoneKey=${selectedZoneKey}&wardKey=${selectedWardKey}`,
      )
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneWardList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        if (mdlKey === 1) setDataModule1(data);
        else if (mdlKey === 2) setDataModule2(data);
        else if (mdlKey === 3) setDataModule3(data);
        else if (mdlKey === 4) setDataModule4(data);
        else if (mdlKey === 5) setDataModule5(data);
      });
  };

  // Exit Button
  const exitButton = () => {
    setButtonInputState(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    moduleName: "",
    parameterName: "",
  };

  useEffect(() => {
    getZoneList();
    getWardList();

    getParameterModule1();
    getParameterModule2();
    getParameterModule3();
    getParameterModule4();
    getParameterModule5();

    // Set Zone and Ward to ALL value
    setSelectedZoneKey(0);
    setSelectedWardKey(0);
  }, []);

  const columnsModule1 = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex:1
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parameterName",
      headerName: "Benchmark",
      flex: 1,
      headerAlign: "center",
      align: "left",
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
  ];

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
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
        <h2>SLB Dashboard - Live</h2>
      </Box>
      <Divider />
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        {/* Add a dropdown to select from Zone list */}
        <FormControl variant="outlined" sx={{ minWidth: 120, m: 1 }}>
          <InputLabel id="zone-label">Zone</InputLabel>
          <Select
            defaultValue={selectedZone}
            labelId="zone-label"
            id="zone"
            label="Zone"
            value={selectedZone}
            onChange={(e) => {
              console.log("ZoneKey" + e.target.value.zoneKey);
              setSelectedZoneKey(e.target.value.zoneKey);
              setSelectedZone(e.target.value);

              getWardList(e.target.value.zoneKey);

              // Set value of this select to zonename

              setSelectedWardKey(0);
              setSelectedWard({ wardKey: 0, wardName: "All" });
            }}
          >
            {zoneList.map((r) => (
              <MenuItem value={r}>{r.zoneName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Add a dropdown to select from ward list */}
        <FormControl variant="outlined" sx={{ minWidth: 120, m: 1 }}>
          <InputLabel id="ward-label">Ward</InputLabel>
          <Select
            labelId="ward-label"
            id="ward"
            label="Ward"
            value={selectedWard}
            onChange={(e) => {
              setSelectedWardKey(e.target.value.wardKey);
              setSelectedWard(e.target.value);
            }}
          >
            {wardList.map((r) => (
              <MenuItem value={r}>{r.wardName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Add a button to refresh the graphs*/}
        <Button
          variant="contained"
          color="primary"
          sx={{ m: 1 }}
          onClick={() => {
            if (selectedZoneKey === 0 && selectedWardKey === 0) {
              getParameterModule1();
              getParameterModule2();
              getParameterModule3();
              getParameterModule4();
              getParameterModule5();
            } else if (selectedZoneKey !== 0 && selectedWardKey === 0) {
              getParameterModule1ForZone();
              getParameterModule2ForZone();
              getParameterModule3ForZone();
              getParameterModule4ForZone();
              getParameterModule5ForZone();
            } else if (selectedZoneKey !== 0 && selectedWardKey !== 0) {
              getParameterModuleForZoneWard(1);
              getParameterModuleForZoneWard(2);
              getParameterModuleForZoneWard(3);
              getParameterModuleForZoneWard(4);
              getParameterModuleForZoneWard(5);
              //getParameterModule2ForZoneWard();
              //getParameterModule3ForZoneWard();
              //getParameterModule4ForZoneWard();
              //getParameterModule5ForZoneWard();
            }
          }}
        >
          Fetch
        </Button>
      </Box>

      <Divider />
      <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Water Supply Management System</h2>
      </Box>
      <Divider />
      <Grid container spacing={2}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              chart: {
                stacked: false,
                xaxis: { categories: dataModule1.map((r) => r.parameterName) },
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              tooltip: {
                enabled: true,
                shared: false,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  const categoryName = w.globals.labels[dataPointIndex];
                  const seriesName = w.globals.seriesNames[seriesIndex];
                  const value = series[seriesIndex][dataPointIndex];
                  // Get sr No from dataModule1 where parameterName = categoryName
                  const srNo = dataModule1.find((r) => r.srNo === categoryName).parameterName;

                  return `
                    <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
                      <strong>Code:</strong> ${categoryName}<br />
                      <strong>Paramater Name:</strong> ${srNo}<br/>
                      <strong>${seriesName}</strong>: ${value}<br/>
                    </div>
                  `;
                },
              },
            }}
            series={[
              {
                name: "Benchmark Value",
                data: dataModule1.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: "Last Actual Benchmark Value",
                data: dataModule1.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"300px"}
          />
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
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
              rows={dataModule1}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
      <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Solid Waste Management System</h2>
      </Box>
      <Divider />
      <Grid container spacing={2}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              chart: {
                stacked: false,
                xaxis: { categories: dataModule2.map((r) => r.parameterName) },
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              tooltip: {
                enabled: true,
                shared: false,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  const categoryName = w.globals.labels[dataPointIndex];
                  const seriesName = w.globals.seriesNames[seriesIndex];
                  const value = series[seriesIndex][dataPointIndex];
                  // Get sr No from dataModule1 where parameterName = categoryName
                  const srNo = dataModule1.find((r) => r.srNo === categoryName).parameterName;

                  return `
                    <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
                      <strong>Code:</strong> ${categoryName}<br />
                      <strong>Paramater Name:</strong> ${srNo}<br/>
                      <strong>${seriesName}</strong>: ${value}<br/>
                    </div>
                  `;
                },
              },
            }}
            series={[
              {
                name: "Benchmark Value",
                data: dataModule2.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: "Last Actual Benchmark Value",
                data: dataModule2.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"300px"}
          />
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
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
              rows={dataModule2}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
      <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Solid Waste Management System (MOHUA)</h2>
      </Box>
      <Divider />
      <Grid container spacing={2}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              chart: {
                stacked: false,
                xaxis: { categories: dataModule5.map((r) => r.parameterName) },
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              tooltip: {
                enabled: true,
                shared: false,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  const categoryName = w.globals.labels[dataPointIndex];
                  const seriesName = w.globals.seriesNames[seriesIndex];
                  const value = series[seriesIndex][dataPointIndex];
                  // Get sr No from dataModule1 where parameterName = categoryName
                  const srNo = dataModule1.find((r) => r.srNo === categoryName).parameterName;

                  return `
                    <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
                      <strong>Code:</strong> ${categoryName}<br />
                      <strong>Paramater Name:</strong> ${srNo}<br/>
                      <strong>${seriesName}</strong>: ${value}<br/>
                    </div>
                  `;
                },
              },
            }}
            series={[
              {
                name: "Benchmark Value",
                data: dataModule5.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: "Last Actual Benchmark Value",
                data: dataModule5.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"300px"}
          />
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
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
              rows={dataModule5}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
      <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Sewerage Management System</h2>
      </Box>
      <Divider />
      <Grid container spacing={2}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              chart: {
                stacked: false,
                xaxis: { categories: dataModule3.map((r) => r.parameterName) },
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              tooltip: {
                enabled: true,
                shared: false,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  const categoryName = w.globals.labels[dataPointIndex];
                  const seriesName = w.globals.seriesNames[seriesIndex];
                  const value = series[seriesIndex][dataPointIndex];
                  // Get sr No from dataModule1 where parameterName = categoryName
                  const srNo = dataModule1.find((r) => r.srNo === categoryName).parameterName;

                  return `
                    <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
                      <strong>Code:</strong> ${categoryName}<br />
                      <strong>Paramater Name:</strong> ${srNo}<br/>
                      <strong>${seriesName}</strong>: ${value}<br/>
                    </div>
                  `;
                },
              },
            }}
            series={[
              {
                name: "Benchmark Value",
                data: dataModule3.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: "Last Actual Benchmark Value",
                data: dataModule3.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"300px"}
          />
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
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
              rows={dataModule3}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
      <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Storm Water Drainage Management System</h2>
      </Box>
      <Divider />
      <Grid container spacing={2}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              chart: {
                stacked: false,
                xaxis: { categories: dataModule4.map((r) => r.parameterName) },
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              tooltip: {
                enabled: true,
                shared: false,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  const categoryName = w.globals.labels[dataPointIndex];
                  const seriesName = w.globals.seriesNames[seriesIndex];
                  const value = series[seriesIndex][dataPointIndex];
                  // Get sr No from dataModule1 where parameterName = categoryName
                  const srNo = dataModule1.find((r) => r.srNo === categoryName).parameterName;

                  return `
                    <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
                      <strong>Code:</strong> ${categoryName}<br />
                      <strong>Paramater Name:</strong> ${srNo}<br/>
                      <strong>${seriesName}</strong>: ${value}<br/>
                    </div>
                  `;
                },
              },
            }}
            series={[
              {
                name: "Benchmark Value",
                data: dataModule4.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.benchmarkValue == 0 ? 0.1 : r.benchmarkValue,
                  };
                }),
              },
              {
                name: "Last Actual Benchmark Value",
                data: dataModule4.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"300px"}
          />
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
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
              rows={dataModule4}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Index;
