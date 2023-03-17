import { Button, FormControl, FormHelperText, Grid, TextField, Typography } from "@mui/material";
import Head from "next/head";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/system";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  materialEntryReportrows,
  nightDeptReportrows,
  visitorEntryReportrows,
} from "../../../../components/security/contsants";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import styles from "../../../../styles/security/reports/nightDeptCheckupEntry.module.css";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";

function NightDepartmentCheckUpReport() {
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

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
    mode: "onChange",
  });

  useEffect(() => {
    getDepartment();
    getZoneKeys();
    getWardKeys();
    getBuildings();
  }, []);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) => state?.user?.user?.menus?.find((m) => m?.id == selectedMenu));
  const [route, setRoute] = useState(null);

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDepartment = () => {
    axios.get(`${urls.CfcURLMaster}/department/getAll`).then((res) => {
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      );
    });
  };

  //buildings
  const [buildings, setBuildings] = useState([]);
  // get buildings
  const getBuildings = () => {
    axios.get(`${urls.SMURL}/mstBuildingMaster/getAll`).then((r) => {
      console.log("building master", r);
      let result = r.data.mstBuildingMasterList;
      setBuildings(result);
    });
  };

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);
  // get Zone Keys
  const getZoneKeys = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        })),
      );
    });
  };

  // Ward Keys
  const [wardKeys, setWardKeys] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [updatedWardKeys, setUpdatedWardKeys] = useState([]);
  let router = useRouter();
  // get Ward Keys
  const getWardKeys = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        })),
      );
    });
  };

  const getInOut = (fromDate, toDate, _pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    console.log("fromDate, toDate", fromDate, toDate);
    axios
      .get(`${urls.SMURL}/trnNightDepartmentCheckUpEntry/getReportByDate`, {
        params: {
          fromDate: moment(fromDate).format("DD/MM/YYYY"),
          toDate: moment(toDate).format("DD/MM/YYYY"),
        },
      })
      .then((res) => {
        console.log("fromTo", res);
        setLoading(false);
        setDataSource(
          res?.data?.trnNightDepartmentCheckUpEntryList?.map((r, i) => {
            return { srNo: i + 1, ...r };
          }),
        );

        if (res?.data?.trnNightDepartmentCheckUpEntryList.length === 0) {
          toast("No Data Available", {
            type: "error",
          });
        }
        // let result = res.data.trnNightDepartmentCheckUpEntryList;
        // console.log("result43", result);
        // let _res = result?.map((r, i) => {
        //   return {
        //     buildingKey: r.buildingKey,
        //     checkupDateAndTime: r.checkupDateTime
        //       ? moment(r.checkupDateTime).format("DD-MM-YYYY hh:mm A")
        //       : "-",
        //     departmentKey: departments?.find((obj) => obj?.id == r.departmentKey)?.department
        //       ? departments?.find((obj) => obj?.id == r.departmentKey)?.department
        //       : "-",
        //     departmentOnOffStatus: r.departmentOnOffStatus,
        //     fanOnOffStatus: r.fanOnOffStatus ? r.fanOnOffStatus : "-",
        //     floor: r.floor,
        //     id: r.id,
        //     lightOnOffStatus: r.lightOnOffStatus,
        //     presentEmployeeCount: r.presentEmployeeCount,
        //     presentEmployeeName: r.presentEmployeeName,
        //     remark: r.remark,
        //     subDepartmentKey: r.subDepartmentKey,
        //     wardKey: wardKeys?.find((obj) => obj?.id == r.wardKey)?.wardName
        //       ? wardKeys?.find((obj) => {
        //           return obj?.id == r.wardKey;
        //         })?.wardName
        //       : "-",
        //     zoneKey: zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
        //       ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
        //       : "-",
        //     srNo: _pageSize * _pageNo + i + 1,
        //     status: r.activeFlag == "Y" ? "Active" : "Inactive",
        //   };
        // });
        // setData({
        //   rows: _res,
        //   totalRows: res.data.totalElements,
        //   rowsPerPageOptions: [10, 20, 50, 100],
        //   pageSize: res.data.pageSize,
        //   page: res.data.pageNo,
        // });
      });
  };

  return (
    <>
      <Grid
        container
        sx={{
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            size="small"
            onClick={() => {
              router.push("/sm/dashboard");
            }}
            variant="contained"
            color="primary"
          >
            {language === "en" ? "Back To home" : "मुखपृष्ठ"}
          </Button>
        </Grid>
        <Grid item xs={8} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h2>
            {language === "en" ? "Night Department Checkup Entry Report" : "रात्री विभाग तपासणी नोंद अहवाल"}
            {/* <FormattedLabel id="bookClassification" /> */}
          </h2>
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            {language === "en" ? "Print" : "प्रत काढा"}
          </Button>
        </Grid>
      </Grid>

      <Box>
        {loading ? (
          <Loader />
        ) : (
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl>
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>{language === "en" ? "From Date" : "पासून"}</span>
                        }
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
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
                <FormHelperText>{/* {errors?.fromDate ? errors.fromDate.message : null} */}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl>
                <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>{language === "en" ? "To Date" : "पर्यंत"}</span>
                        }
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
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
                <FormHelperText>{/* {errors?.toDate ? errors.toDate.message : null} */}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Box>

      <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="small"
          disabled={watch("fromDate") == null || watch("toDate") == null}
          onClick={() => {
            getInOut(watch("fromDate"), watch("toDate"));
          }}
        >
          {language === "en" ? "Search" : "शोधा"}
        </Button>
      </Grid>

      <Box sx={{ paddingTop: "10px" }}>
        <ComponentToPrint
          data={{ dataSource, language, ...menu, route, departments, wardKeys, zoneKeys }}
          ref={componentRef}
        />
      </Box>
    </>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div>
          <div>
            <Paper>
              <table className={styles.report}>
                <thead className={styles.head}>
                  <tr>
                    <th colSpan={8}>
                      {
                        this?.props?.data?.language === "en"
                          ? this.props.data.menuNameEng
                          : // "Application Details Report"
                            this.props.data.menuNameMr
                        /* "अर्ज तपशील अहवाल" */
                      }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}</th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Check up Date & Time" : "तारीख आणि वेळ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Department Name" : "विभागाचे नाव"}
                    </th>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "Floor" : "मजला"}</th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Dept On Off Status" : "विभाग उघडा/बंद"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Fan On Off Status" : "पंखा ऑन/ऑफ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Light On Off Status" : "लाईट ऑन/ऑफ"}
                    </th>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "Remark" : "टिप्पणी"}</th>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "Ward" : "प्रभाग"}</th>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "Zone" : "झोन"}</th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language == "en"
                              ? moment(r.checkupDateTime).format("DD-MM-YYYY hh:mm A")
                              : "-"}
                            {/* {this?.props?.data?.language === "en" ? r?.zone?.zoneName : r?.zone?.zoneNameMr} */}
                          </td>

                          <td>
                            {this?.props?.data?.language == "en"
                              ? this?.props?.data?.departments?.find((obj) => obj?.id === r?.departmentKey)
                                  ?.department
                              : "-"}
                          </td>

                          <td>{this?.props?.data?.language === "en" ? r.floor : "-"}</td>
                          <td>{this?.props?.data?.language === "en" ? r.departmentOnOffStatus : "-"}</td>
                          <td>{this?.props?.data?.language === "en" ? r.fanOnOffStatus : "-"}</td>
                          <td> {this?.props?.data?.language === "en" ? r.lightOnOffStatus : "-"}</td>
                          <td>{this?.props?.data?.language === "en" ? r.remark : "-"}</td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? this?.props?.data?.wardKeys?.find((obj) => {
                                  return obj?.id == r.wardKey;
                                })?.wardName
                              : "-"}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? this?.props?.data?.zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
                              : "-"}
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}

export default NightDepartmentCheckUpReport;
