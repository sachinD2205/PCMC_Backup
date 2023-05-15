import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "../../../../../components/grievanceMonitoring/view.module.css";

import URLS from "../../../../../URLS/urls";
import { Paper, Button, Checkbox, ThemeProvider, Box, Grid, FormControl, TextField } from "@mui/material";
import { ExitToApp, Print } from "@mui/icons-material";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import sweetAlert from "sweetalert";
import theme from "../../../../../theme";
import { Controller, useForm } from "react-hook-form";
import DownloadIcon from "@mui/icons-material/Download";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import PrintIcon from "@mui/icons-material/Print";
import {
  getQueryDataFromLocalStorage,
  removeQueryDataToLocalStorage,
} from "../../../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ToPrint = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({});

  // const [checkB, setCheckB] = useState(null)

  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Download Acknowledgement",

    // onAfterPrint: () => alert('Print success'),
  });
  const logedInUser = localStorage.getItem("loggedInUser");

  // let checkB = JSON.parse(router?.query?.dataForDownload) //Ye problem solve karna hai ki double parse ko kaise roksakte hai

  // useEffect(() => {
  //   console.log(":20", router?.query?.dataForDownload)
  //   if (router?.query?.dataForDownload !== undefined) {
  //     setCheckB(JSON.parse(router?.query?.dataForDownload))
  //   }
  // }, [router?.query?.dataForDownload])

  //   useEffect(() => {
  //     console.log(":20", checkB)
  //   }, [router?.query?.dataForDownload])

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          style={{
            margin: "30px",
            width: "70%",
          }}
        >
          <div>
            <form ref={componentRef} style={{ marginBottom: "40px" }}>
              {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1%",
                  marginBottom: "10px",
                }}
              >
                <Box
                  className={styles.details1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "90%",
                    height: "auto",
                    overflow: "auto",
                    padding: "0.5%",
                    color: "white",
                    fontSize: 18,
                    fontWeight: 400,
                    marginTop: "7px",
                    // borderRadius: 100,
                  }}
                >
                  <strong>
                    <FormattedLabel id="downloadAcknowledgement" />
                  </strong>
                </Box>
                {/* cknowledgement */}
              </Box>
              {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  paddingLeft: "100px",
                  paddingRight: "85px",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>complaintRaisedBy :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB !== null ? checkB?.grievanceRaiseDate : ""} */}
                      {getQueryDataFromLocalStorage("QueryParamsData")
                        ? getQueryDataFromLocalStorage("QueryParamsData")?.complaintRaisedBy
                        : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>Grievance Raise Date :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB !== null ? checkB?.grievanceRaiseDate : ""} */}
                      {getQueryDataFromLocalStorage("QueryParamsData")
                        ? getQueryDataFromLocalStorage("QueryParamsData")?.grievanceRaiseDate
                        : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>Application Number :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.grievanceId} */}
                      {getQueryDataFromLocalStorage("QueryParamsData")
                        ? getQueryDataFromLocalStorage("QueryParamsData")?.grievanceId
                        : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>Grievance Status :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.complaintStatusText} */}
                      {getQueryDataFromLocalStorage("QueryParamsData")
                        ? getQueryDataFromLocalStorage("QueryParamsData")?.complaintStatusText
                        : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>Department Name :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.deptName} */}
                      {getQueryDataFromLocalStorage("QueryParamsData")
                        ? getQueryDataFromLocalStorage("QueryParamsData")?.deptName
                        : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>Sub-Department Name :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.subDepartmentText} */}
                      {getQueryDataFromLocalStorage("QueryParamsData")
                        ? getQueryDataFromLocalStorage("QueryParamsData")?.subDepartmentText
                        : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>Complaint Type :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.complaintType} */}
                      {getQueryDataFromLocalStorage("QueryParamsData")
                        ? getQueryDataFromLocalStorage("QueryParamsData")?.complaintType
                        : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "930px" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>Subject :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.subject} */}
                      {getQueryDataFromLocalStorage("QueryParamsData")
                        ? getQueryDataFromLocalStorage("QueryParamsData")?.subject
                        : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "930px" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>Complaint Description :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.complaintDescription} */}
                      {getQueryDataFromLocalStorage("QueryParamsData")
                        ? getQueryDataFromLocalStorage("QueryParamsData")?.complaintDescription
                        : ""}
                    </strong>
                  </div>
                </Grid>
              </Grid>

              {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}
            </form>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                <Button
                  // sx={{ marginRight: 8 }}
                  // disabled={showSaveButton}
                  type="button"
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={() => {
                    // router.push({
                    //   pathname: "/grievanceMonitoring/dashboard",
                    // })
                    removeQueryDataToLocalStorage("QueryParamsData");
                    {
                      logedInUser === "departmentUser" &&
                        router.push({
                          pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
                        });
                    }
                    {
                      logedInUser === "citizenUser" &&
                        router.push({
                          pathname: "/grievanceMonitoring/dashboards/citizenUserDashboard",
                        });
                    }
                    {
                      logedInUser === "cfcUser" &&
                        router.push({
                          pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
                        });
                    }
                  }}
                >
                  <FormattedLabel id="backToDashboard" />
                </Button>
              </Grid>

              {/* //////////////////////////////////////////////////////////////////////////// */}

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
                <Button
                  sx={{ width: "100px" }}
                  // disabled={showSaveButton}
                  type="button"
                  variant="contained"
                  color="primary"
                  endIcon={<PrintIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={handleToPrint}
                >
                  <FormattedLabel id="print" />
                </Button>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default ToPrint;
