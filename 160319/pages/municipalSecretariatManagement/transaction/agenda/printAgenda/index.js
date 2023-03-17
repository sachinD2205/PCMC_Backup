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
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getPrepareAgendaDataFromLocalStorage } from "../../../../../components/redux/features/MunicipalSecretary/municipalSecreLocalStorage";

const Index = () => {
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
  const [recievingDataFromLocal, setRecievingDataFromLocal] = useState();
  const [meetingDateFromLocal, setMeetingDateFromLocal] = useState(
    getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")?.meetingDate,
  );
  const [agendaOutwardDateFromLocal, setAgendaOutwardDateFromLocal] = useState(
    getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")?.agendaOutwardDate,
  );
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: ,
    pageStyle: "A4",
    color: "color",
    // print: "color",
    // onAfterPrint: () => alert("Print success"),
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

  useEffect(() => {
    if (meetingDateFromLocal !== null) {
      setMeetingDateFromLocal(moment(meetingDateFromLocal && meetingDateFromLocal).format("DD-MM-YYYY"));
    }
    if (agendaOutwardDateFromLocal !== null) {
      setAgendaOutwardDateFromLocal(
        moment(agendaOutwardDateFromLocal && agendaOutwardDateFromLocal).format("DD-MM-YYYY"),
      );
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          style={{
            marginBottom: "30px",
            width: "90%",
          }}
        >
          <div
          // style={{
          //   marginBottom: "30px",
          //   width: "90%",
          // }}
          >
            <form ref={componentRef}>
              {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
              {/* <Box
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
                    {/* <FormattedLabel id="downloadAcknowledgement" /> */}
              {/* PRINT AGENDA
                  </strong>
                </Box> */}
              {/* cknowledgement */}
              {/* </Box>  */}

              {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

              <Grid
                container
                spacing={3}
                style={{
                  // padding: "10px",
                  marginTop: "10px",
                  paddingLeft: "100px",
                  paddingRight: "85px",
                  // pageBreakAfter: "300px",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "930px", textAlign: "justify", textJustify: "inter-word" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>अजेन्डा दिनांक : </label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {meetingDateFromLocal !== null ? meetingDateFromLocal : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "930px", textAlign: "justify", textJustify: "inter-word" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>अजेन्डा जावक दिनांक :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {agendaOutwardDateFromLocal !== null ? agendaOutwardDateFromLocal : ""}
                    </strong>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "930px", textAlign: "justify", textJustify: "inter-word" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>अजेन्डा ओउटवर्ड न. :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")
                        ? getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")?.agendaOutwardNo
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
                  <div style={{ width: "930px", textAlign: "justify", textJustify: "inter-word" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>अजेन्डा सुबजेक्ट :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.complaintStatusText} */}
                      {getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")
                        ? getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")?.agendaSubject
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
                  <div style={{ width: "930px", textAlign: "justify", textJustify: "inter-word" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>कव्हरिंग लेटर सुबजेक्ट :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.deptName} */}
                      {getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")
                        ? getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")?.coveringLetterSubject
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
                  <div style={{ width: "930px", textAlign: "justify", textJustify: "inter-word" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>कव्हरिंग लेटर नोट :</label>
                    <strong style={{ paddingLeft: "5px", textAlign: "justify", textJustify: "inter-word" }}>
                      {/* {checkB?.subDepartmentText} */}
                      {getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")
                        ? getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")?.coveringLetterNote
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
                  <div style={{ width: "930px", textAlign: "justify", textJustify: "inter-word" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>सभावृत्तांत :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.subject} */}
                      {getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")
                        ? getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")?.sabhavruttant
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
                  <div style={{ width: "930px", textAlign: "justify", textJustify: "inter-word" }}>
                    <label style={{ fontSize: 15, fontWeight: 500 }}>टिप :</label>
                    <strong style={{ paddingLeft: "5px" }}>
                      {/* {checkB?.complaintDescription} */}
                      {getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")
                        ? getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")?.tip
                        : ""}
                    </strong>
                  </div>
                </Grid>

                {/* //////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                {getPrepareAgendaDataFromLocalStorage("PrepareAgendaDocketData").length > 0
                  ? getPrepareAgendaDataFromLocalStorage("PrepareAgendaDocketData").map((obj, index) => {
                      // alert("obj");
                      return (
                        <Grid item xs={12} sm={12} md={12}>
                          <div
                            style={{
                              // width: "930px",
                              // height: "200px",
                              display: "flex",
                              flexDirection: "column",
                              // justifyContent: "flex-start",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                textAlign: "justify",
                                textJustify: "inter-word",
                              }}
                            >
                              <label
                                style={{
                                  fontSize: 15,
                                  fontWeight: 500,
                                  // textAlign: "justify",
                                  // textJustify: "inter-word",
                                }}
                              >
                                डोकेत सुबजेक्ट {index + 1} :
                              </label>

                              <strong
                                style={{
                                  paddingLeft: "5px",
                                  // textAlign: "justify",
                                  // textJustify: "inter-word",
                                }}
                              >
                                {/* {checkB?.subject} */}
                                {obj.subject}
                              </strong>
                            </div>
                            <br />
                            <div
                              style={{
                                textAlign: "justify",
                                textJustify: "inter-word",
                              }}
                            >
                              <label
                                style={{
                                  fontSize: 15,
                                  fontWeight: 500,
                                  // textAlign: "justify",
                                  // textJustify: "inter-word",
                                }}
                              >
                                डोकेत सुमारी {index + 1} :
                              </label>
                              <strong
                                style={{
                                  paddingTop: "30px",
                                  paddingBottom: "30px",
                                  // textAlign: "justify",
                                  // textJustify: "inter-word",
                                }}
                              >
                                {/* {checkB?.subject} */}
                                {obj.subjectSummary}
                              </strong>
                            </div>
                          </div>
                        </Grid>
                      );
                    })
                  : ""}
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

export default Index;
