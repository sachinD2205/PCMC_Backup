import { Button, FormControl, FormHelperText, Grid, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import styles from "../../../../styles/sportsPortalStyles/sportsBookingRegister.module.css";
import urls from "../../../../URLS/urls";

function GymBooking() {
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

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) => state?.user?.user?.menus?.find((m) => m?.id == selectedMenu));
  const [route, setRoute] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDepartment();
  }, []);

  const getDepartment = () => {
    axios.get(`${urls.CfcURLMaster}/department/getAll`).then((res) => {
      console.log("dept", res);
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      );
    });
  };

  const getSportsBookingData = (fromDateMembership, toDateMembership, _pageSize = 10, _pageNo = 0) => {
    console.log("fromDate, toDate", fromDateMembership, toDateMembership);
    setLoading(true);
    axios
      .get(`${urls.SPURL}/report/getDataByGym`, {
        params: {
          fromDateMembership: moment(fromDateMembership).format("YYYY-MM-DD"),
          toDateMembership: moment(toDateMembership).format("YYYY-MM-DD"),
        },
      })
      .then((res, i) => {
        setLoading(false);
        console.log("fromTo", res);
        setDataSource(
          res?.data?.map((r, i) => {
            console.log("fromTo34", r);
            return { srNo: i + 1, ...r };
          }),
        );

        if (res?.data?.length === 0) {
          toast("No Data Available", {
            type: "error",
          });
        }

        let result = res?.data;
        let _res = result?.map((r, index) => {
          return {
            ...r,
            id: r.id,
            srNo: _pageSize * _pageNo + index + 1,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            applicationNumber: r.applicationNumber,
            name: r.applicantName,
            venue: r.venue,
            applicationDate: moment(r.applicationDate).format("YYYY-MM-DD"),
            mobileNumber: r.mobileNumber,
            fromDate: r.fromDate,
            toDate: r.toDate,
            fromBookingTime: moment(r.fromBookingTime).format("hh:mm A"),
            toBookingTime: r.toBookingTime,
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

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      flex: 1,
      maxWidth: 60,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: "From Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: "To Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
  ];

  return (
    <Paper>
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
              router.push("/sportsPortal/dashboard");
            }}
            variant="contained"
            color="primary"
          >
            {language === "en" ? "Back To home" : "मुखपृष्ठ"}
          </Button>
        </Grid>
        <Grid item xs={8} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* <h2>{language === "en" ? "Visitor In/Out Entry Report" : "अभ्यागत आत/बाहेर प्रवेश अहवाल"}</h2> */}
          <h2>Gym Details </h2>
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
              <FormControl style={{ marginTop: 10 }}>
                <Controller
                  control={control}
                  name="fromDateMembership"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}> {language === "en" ? "From Date" : "पासून"}</span>
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
                  name="toDateMembership"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}> {language === "en" ? "To Date" : "पर्यंत"}</span>
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
          disabled={watch("fromDateMembership") == null || watch("toDateMembership") == null}
          onClick={() => {
            getSportsBookingData(watch("fromDateMembership"), watch("toDateMembership"));
          }}
        >
          {language === "en" ? "Search" : "शोधा"}
        </Button>
      </Grid>

      <Box sx={{ paddingTop: "10px" }}>
        <ComponentToPrint data={{ dataSource, language, ...menu, route, departments }} ref={componentRef} />
      </Box>
    </Paper>
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
                    <th colSpan={11}>
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
                      {this?.props?.data?.language === "en" ? "Application Number" : "अर्ज क्रमांक"}
                    </th>
                    {/* <th colSpan={1}>{this?.props?.data?.language === "en" ? "To Date" : "आजपर्यंत"}</th> */}
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Applicant Name" : "अभ्यागताचे नाव"}
                    </th>
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Department Name" : "विभागाचे नाव"}
                    </th> */}
                    {/* <th colSpan={1}>{this?.props?.data?.language === "en" ? "From Date" : " तारीख"}</th>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "To Date" : "तारीख"}</th> */}
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "From Date" : "पासून"}</th>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "To Date" : "पर्यंत"}</th>
                    <th colSpan={1}>{this?.props?.data?.language === "en" ? "Status" : ""}</th>
                    {/* <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "From Booking Time" : "पर्यंत"}
                    </th> */}
                    {/* <th colSpan={1}>{this?.props?.data?.language === "en" ? "To Booking Time" : "पर्यंत"}</th> */}
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicationNumber
                              : r?.applicationNumber}
                          </td>
                          <td>
                            {" "}
                            {this?.props?.data?.language === "en"
                              ? r?.firstName + r?.middleName + r?.lastName
                              : r?.firstName + r?.middleName + r?.lastName}
                          </td>
                          {/* <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicationDate
                                  .moment(this?.props?.data?.applicationDate)
                                  .for("DD-MM-YYY")
                              : r?.applicationDate}
                          </td> */}
                          <td>{this?.props?.data?.language === "en" ? r?.fromDate : r?.fromDate}</td>
                          <td>{this?.props?.data?.language === "en" ? r?.toDate : r?.toDate}</td>
                          <td>{this?.props?.data?.language === "en" ? r?.applicationStatus : r?.toDate}</td>
                          {/* <td>
                            {this?.props?.data?.language === "en" ? r?.fromBookingTime : r?.fromBookingTime}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en" ? r?.toBookingTime : r?.toBookingTime}
                          </td> */}
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
export default GymBooking;
