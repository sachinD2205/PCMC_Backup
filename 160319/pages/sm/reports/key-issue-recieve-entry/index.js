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
import { useReactToPrint } from "react-to-print";
import { keyIssueEntryReportrows } from "../../../../components/security/contsants";
import React, { useEffect, useState, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../../../../styles/security/reports/deptKeyIssueReceive.module.css";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";

function KeyIssueEntryReport() {
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [employee, setEmployee] = useState([]);
  let router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) => state?.user?.user?.menus?.find((m) => m?.id == selectedMenu));
  const [route, setRoute] = useState(null);

  useEffect(() => {
    console.log("selected menu", menu);

    if (menu?.id == 1110) {
      setRoute("Dept Key Issue Receive Entry");
    } else if (menu?.id == 123) {
      // setRoute("goshwara2");
    } else if (menu?.id == 51) {
      // setRoute("marriageCertificate");
    }
    // console.log("selected menu",menus?.find((m)=>m?.id==selectedMenu));
  }, [menu, selectedMenu]);

  useEffect(() => {
    console.log("1");
    getDepartment();
  }, []);

  useEffect(() => {
    console.log("2");
    getEmployee();
  }, [departments]);

  useEffect(() => {
    console.log("3");
    // getAllVisitors();
  }, [employee]);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getDepartment = () => {
    axios.get(`${urls.CfcURLMaster}/department/getAll`).then((res) => {
      console.log("res dep", res);
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      );
    });
  };

  const getEmployee = () => {
    axios.get(`${urls.CFCURL}/master/user/getAll`).then((res) => {
      console.log("user ", res);
      let _res = res.data.user;

      setEmployee(
        _res.map((val) => {
          return {
            id: val.id,
            firstNameEn: val.firstNameEn,
            lastNameEn: val.lastNameEn,
          };
        }),
      );
    });
  };

  const getInOut = (fromDate, toDate, _pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    console.log("fromDate, toDate", fromDate, toDate);
    axios
      .get(`${urls.SMURL}/trnDepartmentKeyInOut/getReportByDate`, {
        params: {
          fromDate: moment(fromDate).format("DD/MM/YYYY"),
          toDate: moment(toDate).format("DD/MM/YYYY"),
        },
      })
      .then((res) => {
        console.log("fromTo", res);
        setDataSource(
          res?.data?.trnDepartmentKeyInOutList?.map((r, i) => {
            return { srNo: i + 1, ...r };
          }),
        );
        if (res?.data?.trnDepartmentKeyInOutList.length === 0) {
          toast("No Data Available", {
            type: "error",
          });
          setLoading(false);
        }
        setLoading(false);
        // let result = res.data.trnDepartmentKeyInOutList;
        // let _res = result?.map((r, i) => {
        //   return {
        //     ...r,
        //     departmentKey: departments?.find((obj) => obj?.id === r?.departmentKey)?.department
        //       ? departments?.find((obj) => obj?.id === r?.departmentKey)?.department
        //       : "-",
        //     employeeName: employee?.find((obj) => obj?.id === r?.employeeKey)?.firstNameEn
        //       ? employee?.find((obj) => obj?.id === r?.employeeKey)?.firstNameEn +
        //         " " +
        //         employee?.find((obj) => obj?.id === r?.employeeKey)?.lastNameEn
        //       : "-",
        //     employeeKey: r.employeeKey,
        //     id: r.id,
        //     keyIssueAt: r.keyIssueAt ? moment(r.keyIssueAt).format("DD-MM-YYYY hh:mm A") : "-",
        //     keyReceivedAt: r.keyReceivedAt ? moment(r.keyReceivedAt).format("DD-MM-YYYY hh:mm A") : "-",
        //     keyStatus: r.keyStatus,
        //     mobileNumber: r.mobileNumber,
        //     subDepartmentKey: r.subDepartmentKey,
        //     id: r.id,
        //     srNo: _pageSize * _pageNo + i + 1,
        //     // srNo: i + 1,
        //     visitorStatus: r.visitorStatus === "I" ? "In" : "Out",
        //     status: r.activeFlag === "Y" ? "Active" : "Inactive",
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

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      flex: 1,
      maxWidth: 60,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: "Department Name",
      minWidth: 220,
      headerAlign: "center",
    },
    // {
    //   hide: false,
    //   field: "employeeKey",
    //   headerName: "Employee Key",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      hide: false,
      field: "employeeName",
      headerName: "Employee Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyIssueAt",
      headerName: "Key Issue At",
      // flex: 1,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyReceivedAt",
      headerName: "Key Received At",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyStatus",
      headerName: "Key Status",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "mobileNumber",
      headerName: "Mobile Number",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "subDepartmentKey",
      headerName: "Sub Department Key",
      flex: 1,
      headerAlign: "center",
    },
  ];

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
            {language === "en"
              ? "Department Key Issue Received Entry Report"
              : "विभाग चावी जारी/प्राप्त नोंद अहवाल"}
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
          // <Box sx={{}}>
          <Loader />
        ) : (
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl style={{ marginTop: 10 }}>
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
              <FormControl style={{ marginTop: 10 }}>
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

      <Box
        sx={{
          maxWidth: "83vw",
          margin: "3rem auto",
          clear: "both",
        }}
      >
        {/* <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
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
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getAllVisitors(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            getAllVisitors(_data, data.page);
          }}
        /> */}
      </Box>
      <div>
        <ComponentToPrint
          data={{ dataSource, language, ...menu, route, departments, employee }}
          ref={componentRef}
        />
      </div>
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
                      {this?.props?.data?.language === "en" ? "Department Name" : "विभागाचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Employee Name" : "कर्मचारी नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Key Issue At" : "चावी दिली ती वेळ"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Key Received At"
                        : "किल्ली प्राप्त झाली ती वेळ"}
                    </th>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "Key Status" : "चावी स्थिती"}</th>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "Mobile No" : "मोबाईल नं."}</th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Visitor Status" : "अभ्यागत स्थिती"}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language == "en"
                              ? this?.props?.data?.departments?.find((obj) => obj?.id === r?.departmentKey)
                                  ?.department
                              : "-"}
                            {/* {this?.props?.data?.language === "en" ? r?.zone?.zoneName : r?.zone?.zoneNameMr} */}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? this?.props?.data?.employee?.find((obj) => obj?.id === r?.employeeKey)
                                  ?.firstNameEn
                              : "-"}
                          </td>
                          <td>{moment(r.keyIssueAt).format("DD-MM-YYYY hh:mm A")}</td>
                          <td> {moment(r.keyReceivedAt).format("DD-MM-YYYY hh:mm A")}</td>
                          <td>{this?.props?.data?.language === "en" ? r.keyStatus : r.keyStatus}</td>
                          <td>{this?.props?.data?.language === "en" ? r.mobileNumber : mobileNumber}</td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r.visitorStatus === "I"
                                ? "In"
                                : "Out"
                              : r.visitorStatus === "I"
                              ? "In"
                              : "Out"}
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

export default KeyIssueEntryReport;
