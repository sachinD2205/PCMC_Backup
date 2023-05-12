import React, { useEffect, useRef, useState } from "react";
import { Paper, Button, ThemeProvider, Box, Grid } from "@mui/material";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import theme from "../../../../../theme";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import router from "next/router";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [meetSchedule, setMeetSchedule] = useState([]);
  const [attendences, setAttendences] = useState([]);
  const [agendaSubDao, setAgendaSubDao] = useState([]);
  const [agendaVerdict, setAgendaVerdict] = useState([]);
  const [commId, setCommId] = useState();
  const [committeeName, setCommitteeName] = useState([]);
  const [agendaNumber, setAgendaNumber] = useState();

  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: ,
    pageStyle: "A4",
    color: "color",
    // print: "color",
    // onAfterPrint: () => alert("Print success"),
  });

  const language = useSelector((state) => state.labels.language);

  //122.15.104.76:8099/ms/api/trnMom/getMomReportByAgenda?agendaNo=0000000049

  const getAllProceedingRelatedInform = () => {
    ///////////////////////////////////////////
    setLoading(true);
    axios
      //   .post(`${urls.MSURL}/trnMom/getMomReportByAgenda?agendaNo=${router.query.agendaNo}`)
      .get(`${urls.MSURL}/trnMom/getMomReportByAgenda?agendaNo=0000000049`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let responseRes = res?.data?.trnMom;

          if (responseRes?.length > 0) {
            setAgendaNumber(responseRes[0]?.agendaNo);

            setCommId(responseRes[0]?.trnPrepareMeetingAgendaDao[0]?.committeeId);

            setMeetSchedule(responseRes[0]?.trnPrepareMeetingAgendaDao[0]?.meetingSchedule[0]);

            setAttendences(
              responseRes[0]?.momAgendaSubjectDao?.map((r, i) => ({
                anumodak: r.anumodak,
                suchak: r.suchak,
                reference: r.reference,
                status: r.status,
                subject: r.subject,
                subjectSummary: r.subjectSummary,
                tharavNo: r.tharavNo,
              })),
            );

            setAgendaSubDao(
              responseRes[0]?.trnPrepareMeetingAgendaDao[0]?.trnMarkAttendanceProceedingAndPublishDao[0]?.committeeMembersAttendance?.map(
                (r, i) => ({
                  id: r.id,
                  action: r.action,
                  attendanceId: r.attendanceId,
                  listOfConcernCommitteeMembers: r.listOfConcernCommitteeMembers,
                }),
              ),
            );
            /////////////////////////////////////////
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

            setLoading(false);
          }
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
    getAllProceedingRelatedInform();
  }, []);
  useEffect(() => {
    if (meetSchedule !== null) {
      console.log(":lok1", meetSchedule);
    }
    console.log(
      ":lok2",
      attendences?.map((obj) => obj),
    );
    console.log(":lok12", agendaNumber);
    console.log(":lok3", agendaSubDao);
    console.log(":lok4", committeeName[0]?.committeeNameEn);
  }, [agendaNumber, meetSchedule, attendences, agendaSubDao, committeeName]);

  useEffect(() => {
    if (commId) {
      axios
        .get(`${urls.MSURL}/mstDefineCommittees/getAll`)
        .then((res) => {
          console.log("Committee: ", res.data.committees);
          setCommitteeName(
            res?.data?.committees
              ?.filter((r) => r.id === commId)
              .map((j) => ({
                id: j.id,
                committeeNameEn: j.committeeName,
                committeeNameMr: j.committeeNameMr,
              })),
          );
        })
        .catch((error) => {
          console.log("error: ", error);
          sweetAlert({
            title: "ERROR!",
            text: `${error}`,
            icon: "error",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
            dangerMode: true,
          });
        });
    }
  }, [commId]);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          style={{
            marginBottom: "30px",
            width: "70%",
          }}
        >
          <div>
            <form ref={componentRef}>
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
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "40px",
                  }}
                >
                  <h3>
                    <strong>पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११०१८ </strong>
                  </h3>
                  <h3>
                    <strong>
                      मा.{" "}
                      {language == "en"
                        ? committeeName[0]?.committeeNameEn
                        : committeeName[0]?.committeeNameMr}
                    </strong>{" "}
                  </h3>
                  <h3>
                    <strong>कार्यपत्रिका क्रमांक - "__________"</strong>{" "}
                  </h3>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",

                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginTop: "40px",
                  }}
                >
                  <span>दिनांक - "__________"</span>
                  <span>वेळ - "__________"</span>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "baseline",
                  }}
                >
                  <p style={{ textAlign: "justify", textJustify: "inter-word", textIndent: "65px" }}>
                    पिंपरी चिंचवड महापालिकेच्या, मा. "__________" ची सभा दिनांक. "__________" "__________" वा.
                    मा.अवर सचिव महाराष्ट्र शासन यांचेकडील पत्र क्र.कोरोना/२०२०/प्र.क्र.७६/नवि-१४ दि.
                    "__________" अन्वये ऑनलाईन पध्दतीने (व्हिडिओ कॉन्फरन्सिंग द्वारे) आयोजित करण्यात आली आहे.
                    महानगरपालिकेच्या प्रशासकीय इमारतीमधील व्हिडीओ कॉन्फरन्स रुम मधून मा. सभापती, स्थायी समिती
                    हे सभा संचलित करणार आहेत. सभेत खालील कामकाज होईल.
                  </p>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <strong>- - - - - - - - - - </strong>
                </Grid>

                {/* //////////////////////////////////////////////////////// 2ND Page //////////////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "40px",
                  }}
                >
                  <h3>
                    <span>खालील प्रमाणे सुचना मांडणेत आली. </span>
                  </h3>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",

                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginTop: "15px",
                  }}
                >
                  <span>सुचक - "__________"</span>
                  <span>अनुमोदक - "__________"</span>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "15px",
                  }}
                >
                  <h3>
                    <span>
                      President:______________ यांनी आजच्या मा._______ समिती सभेचे अध्यक्ष स्थान स्विकारावे.
                    </span>
                  </h3>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h3>
                    <span>सदर सुचना सर्वानुमते मान्य करण्यात आली.</span>
                  </h3>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h3>
                    <span>( President:______________ यांनी सभेचे अध्यक्ष स्थान स्विकारले.)</span>
                  </h3>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <strong>- - - - - - - - - - </strong>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h3>
                    <p style={{ textAlign: "justify", textJustify: "inter-word", textIndent: "65px" }}>
                      उपस्थित सन्मा.सदस्यांचे संमतीने खालील ऐनवेळचे विषय सभा कामकाजामध्ये दाखल करून घेणेत
                      आले.उपस्थित सन्मा.सदस्यांचे संमतीने खालील ऐनवेळचे विषय सभा कामकाजामध्ये दाखल करून घेणेत
                      आले.
                    </p>
                  </h3>
                </Grid>
                {/* //////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                {[
                  { id: 1, name: "Alice", subjectSummary: "subjectSummary", subject: "subject" },
                  { id: 2, name: "Bob", subjectSummary: "subjectSummary", subject: "subject" },
                  { id: 3, name: "Charlie", subjectSummary: "subjectSummary", subject: "subject" },
                ].map((obj, index) => {
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
                              fontWeight: 700,
                              // textAlign: "justify",
                              // textJustify: "inter-word",
                            }}
                          >
                            विषय क्र. {index + 1} ) :
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
                        {/* <div
                          style={{
                            textAlign: "justify",
                            textJustify: "inter-word",
                          }}
                        >
                          <label
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                        
                            }}
                          >
                            सारांश क्र. {index + 1}) :
                          </label>
                          <strong
                            style={{
                              paddingLeft: "5px",
                              paddingTop: "30px",
                              paddingBottom: "30px",
                              
                            }}
                          >
                            
                            {obj.subjectSummary}
                          </strong>
                        </div> */}
                      </div>
                    </Grid>
                  );
                })}

                {/* ///////////////////////////////////////////////////////////////////////////////////// */}
                {[
                  { id: 1, name: "Alice", subjectSummary: "subjectSummary", subject: "subject" },
                  { id: 2, name: "Bob", subjectSummary: "subjectSummary", subject: "subject" },
                  { id: 3, name: "Charlie", subjectSummary: "subjectSummary", subject: "subject" },
                ].map((obj, index) => {
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
                              fontWeight: 700,
                            }}
                          >
                            सारांश क्र. {index + 1}) :
                          </label>
                          <strong
                            style={{
                              paddingLeft: "5px",
                              paddingTop: "30px",
                              paddingBottom: "30px",
                            }}
                          >
                            {obj.subjectSummary}
                          </strong>
                        </div>
                        <br />
                      </div>
                    </Grid>
                  );
                })}
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
                  endIcon={<ArrowBackIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={() => {
                    router.push("/municipalSecretariatManagement/transaction/agenda");
                  }}
                >
                  <FormattedLabel id="back" />
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
