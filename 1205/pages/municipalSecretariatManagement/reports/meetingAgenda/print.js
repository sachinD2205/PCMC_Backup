import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./view.module.css";

import URLS from "../../../../URLS/urls";
import { Paper, Button, Checkbox, Grid, CircularProgress } from "@mui/material";
import { ExitToApp, Print } from "@mui/icons-material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import URLs from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import moment from "moment";

const ToPrint = () => {
  const [agendaDetails, setAgendaDetails] = useState({});
  const [committeeName, setCommitteeName] = useState("");
  const [specialMeeting, setSpecialMeeting] = useState(false);
  const [meetingScheduleLing, setMeetingScheduleLing] = useState(null);
  const [currentTimeOfTheDay, setCurrentTimeOfTheDay] = useState(null);
  /////////////////////////////////////////////
  const [dayFromDate, setDayFromDate] = useState(null);

  const [loading, setLoading] = useState(false);

  const componentRef = useRef(null); // ANWAR A. ANSARI
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Prepare Agenda",
    pageStyle: "A4",
    onAfterPrint: () =>
      sweetAlert({ title: "SUCCESS", text: "Print success,thanks for using our services.", icon: "success" }),
  });

  useEffect(() => {
    if (router?.query?.agendaNo) {
      setLoading(true);
      axios
        .get(
          `${URLS.MSURL}/trnPrepareMeetingAgenda/getByFromDateAndToDateOrAgendaNo?agendaNo=${router.query.agendaNo}`,
        )
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            setAgendaDetails(res?.data?.prepareMeetingAgenda[0]);
            setMeetingScheduleLing(
              res?.data?.prepareMeetingAgenda?.map((obj) => {
                return obj?.meetingSchedule[0];
              }),
            );
            setLoading(false);
          } else {
            sweetAlert({
              title: "ERROR!",
              text: `Something Went Wrong!`,
              icon: "error",
              buttons: {
                confirm: {
                  text: "OK",
                  visible: true,
                  closeModal: true,
                },
              },
              closeOnClickOutside: false,
              dangerMode: true,
            });
            setLoading(false);
          }
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
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    //Get Committee Name
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
      .then((res) => {
        res.data.committees.forEach((j) => {
          if (j.id === agendaDetails["committeeId"]) {
            setCommitteeName(j.committeeNameMr);
          }
        });
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
  }, [agendaDetails]);

  ////////////////////////////////////////////////////

  useEffect(() => {
    if (meetingScheduleLing !== null) {
      const timeString = meetingScheduleLing[0]?.meetingTime;

      const [hourString, minuteString] = timeString?.split(":");

      const date = new Date();
      date.setHours(parseInt(hourString));
      date.setMinutes(parseInt(minuteString));

      const currentHour = date.getHours();

      if (currentHour >= 0 && currentHour < 12) {
        setCurrentTimeOfTheDay("सकाळी");
      } else if (currentHour >= 12 && currentHour < 18) {
        setCurrentTimeOfTheDay("दुपारी");
      } else {
        setCurrentTimeOfTheDay("संध्याकाळी");
      }
    }
  }, [meetingScheduleLing]);

  ////////////////////////////////////////////////////
  useEffect(() => {
    if (meetingScheduleLing !== null) {
      // const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const weekdayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
      const dateString = moment(meetingScheduleLing[0]?.meetingDate).format("DD/MM/YYYY");
      const dateParts = dateString?.split("/");
      const dayIndex = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`).getDay();
      const dayName = weekdayNames[dayIndex];

      setDayFromDate(dayName);
    }
  }, [meetingScheduleLing]);

  // useEffect(() => {
  //   if (meetingScheduleLing !== null) {
  //     alert("if (meetingScheduleLing !== null) {");
  //     console.log(":1000", meetingScheduleLing[0].outwardNo);
  //   }
  // }, [meetingScheduleLing]);

  ////////////////////////////////////////////////////

  return (
    <>
      <Head>
        <title>Reports - Meeting Agenda</title>
      </Head>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <CircularProgress color="success" />
        </div>
      ) : (
        <Paper
          className={styles.main}
          style={{
            backgroundColor: "whitesmoke",
          }}
        >
          <div className={styles.row}>
            <Button variant="contained" endIcon={<Print />} onClick={handleToPrint}>
              <FormattedLabel id="print" />
            </Button>
            <div>
              <span
                style={{
                  fontWeight: "bolder",
                  fontSize: "large",
                }}
              >
                Special Meeting
              </span>
              <Checkbox
                onChange={() => {
                  setSpecialMeeting(!specialMeeting);
                }}
              />
            </div>
            <Button
              variant="contained"
              color="error"
              endIcon={<ExitToApp />}
              onClick={() => {
                // router.push({
                //   pathname: `/municipalSecretariatManagement/transaction/circulatingAgenda`,
                // })
                router.back();
              }}
            >
              <FormattedLabel id="back" />
            </Button>
          </div>

          {/* <div
          className={styles.row}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: 10,
            margin: 0,
          }}
        >
          <span
            style={{
              fontWeight: 'bolder',
              fontSize: 'large',
            }}
          >
            Special Meeting ?
          </span>
          <Checkbox
            onChange={() => {
              setSpecialMeeting(!specialMeeting)
            }}
          />
        </div> */}

          <div className={styles.reportWrapper} ref={componentRef}>
            <Grid
              container
              // spacing={23}
              style={{
                // padding: "10px",
                // marginTop: "10px",
                // paddingLeft: "100px",
                // paddingRight: "85px",
                // pageBreakAfter: "300px",
                marginBottom: "12%",
              }}
            >
              <Grid item xs={12} sm={12} md={8}></Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "start",
                }}
              >
                <span>पिंपरी चिंचवड महानगरपालिका,</span>
                <span style={{ textAlign: "start" }}> पिंपरी - ४११०१८</span>
                <span style={{ textAlign: "start" }}> नगरसचिव कार्यालय,</span>

                {/* <span style={{ textAlign: "start" }}>
                मा. <strong>{committeeName}</strong>
                {specialMeeting && <strong> ( विशेष सभा )</strong>}
              </span> */}

                <span style={{ textJustify: "inter-word" }}>
                  {" "}
                  क्रमांक - {meetingScheduleLing && meetingScheduleLing[0]?.outwardNo}
                </span>

                <span style={{ textAlign: "justify" }}>
                  दिनांक -{" "}
                  {moment(meetingScheduleLing && meetingScheduleLing[0]?.outwardDate).format("DD/MM/YYYY")}
                </span>
              </Grid>

              {/* ///////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "start",
                  marginTop: "20px",
                }}
              >
                <span>प्रती,</span>
                <span>माननीय, सदस्य,{committeeName} (सर्व),</span>
                <span>{committeeName},</span>

                {/* <span>
                सदस्य, मा. <strong>{committeeName}</strong>
                {specialMeeting && <strong> ( विशेष सभा )</strong>}
              </span> */}
                <span>पिंपरी चिंचवड महानगरपालिका,</span>
                <span> पिंपरी - ४११०१८</span>
              </Grid>
              {/* ///////////////////////////////////////// */}
              <Grid item xs={12} sm={12} md={2}></Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={10}
                style={{
                  display: "flex",
                  // flexDirection: "column",
                  justifyContent: "flex-start",
                  // alignItems: "center",
                  marginTop: "30px",
                }}
              >
                विषय - पिंपरी चिंचवड महानगरपालिकेच्या, मा. {committeeName}ची सभा दिनांक.{" "}
                {meetingScheduleLing && moment(meetingScheduleLing[0]?.meetingDate).format("DD/MM/YYYY")} रोजी
                आयोजित केलाबाबत.
              </Grid>

              {/* ///////////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "start",
                  marginTop: "30px",
                }}
              >
                <span style={{ textAlign: "justify", textJustify: "inter-word" }}>महोदय/महोदया,</span>
                <span style={{ textAlign: "justify", textJustify: "inter-word", textIndent: "90px" }}>
                  पिंपरी चिंचवड महानगरपालिकेच्या, मा. {committeeName}ची साप्ताहिक सभा{" "}
                  {dayFromDate !== null && dayFromDate}, दिनांक.{" "}
                  {meetingScheduleLing && moment(meetingScheduleLing[0]?.meetingDate).format("DD/MM/YYYY")}{" "}
                  रोजी {currentTimeOfTheDay !== null && currentTimeOfTheDay}{" "}
                  {meetingScheduleLing && meetingScheduleLing[0]?.meetingTime} वा.महानगरपालिकेच्या प्रशासकीय
                  इमारती मधील {meetingScheduleLing && meetingScheduleLing[0]?.meetingPlace} सभागृहात आयोजीत
                  करण्यात आली आहे. सोबत सभेची कार्यपत्रिका जोडली आहे. सभेस आपण उपस्तीत राहावे, ही विनंती.
                </span>
              </Grid>
              <Grid item xs={12} sm={12} md={6}></Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: "35px",
                }}
              >
                आपल्या विश्वासू ,
                <span
                  style={{
                    height: 50,
                    width: 200,
                    padding: "2%",
                    marginBottom: "5%",
                    marginTop: "5%",
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ opacity: "30%" }}>इथे हस्ताक्षर करा</span>
                </span>
                <span>{"( उल्हास बबनराव जगताप )"}</span>
                <span>
                  <strong>नगरसचिव</strong>
                </span>
                <span>पिंपरी चिंचवड महानगरपालिका</span>
                <span>पिंपरी - ४११०१८</span>
              </Grid>
              {/* //////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "start",
                  marginTop: "40px",
                }}
              >
                <ul style={{ listStyle: "none" }}>
                  <li> प्रत - १) सर्व सदस्य,{committeeName}, </li>
                  <li style={{ marginLeft: "35px" }}>२) सर्व संबंदित शाखा प्रमुख व शाखाधिकारी </li>
                  <li style={{ marginLeft: "35px" }}>३) कारयालीन नोटीस बोर्ड </li>
                </ul>
              </Grid>
            </Grid>

            {/* //////////////////////////// */}
            <div className={styles.heading}>
              <span>पिंपरी चिंचवड महानगरपालिका, पिंपरी-४११०१८. </span>
              <span>
                मा. <strong>{committeeName}</strong>
                {specialMeeting && <strong> ( विशेष सभा )</strong>}
              </span>
              <span>कार्यपत्रिका क्रमांक - {agendaDetails.agendaNo}</span>
            </div>
            <div className={styles.dateAndTime} style={{ justifyContent: "space-between" }}>
              <span>
                दिनांक -{" "}
                <strong>
                  {/* ०१/०२/२०२३ */}
                  {meetingScheduleLing && moment(meetingScheduleLing[0]?.meetingDate).format("DD/MM/YYYY")}
                </strong>
              </span>
              <span>
                वेळ -<strong> {meetingScheduleLing && meetingScheduleLing[0]?.meetingTime} </strong>
              </span>
            </div>
            <p className={styles.description} style={{ textAlign: "justify", textJustify: "inter-word" }}>
              पिंपरी चिंचवड महानगरपालिकेच्या मा. <strong>{committeeName}ची</strong> सभा{" "}
              {dayFromDate !== null && dayFromDate} {specialMeeting && <> ( विशेष सभा )</>}, दिनांक{" "}
              <strong>
                {meetingScheduleLing && moment(meetingScheduleLing[0]?.meetingDate).format("DD/MM/YYYY")}
              </strong>{" "}
              रोजी {currentTimeOfTheDay !== null && currentTimeOfTheDay}{" "}
              <strong> {meetingScheduleLing && meetingScheduleLing[0]?.meetingTime} </strong>
              वा. महानगरपालिकेच्या{" "}
              <strong> {meetingScheduleLing && meetingScheduleLing[0]?.meetingPlace} </strong> सभागृहात आयोजीत
              करण्यात आली आहे . सभेत खालील कामकाज होईल.
            </p>
            {agendaDetails?.agendaSubjectDao &&
              // @ts-ignore
              agendaDetails?.agendaSubjectDao?.map((obj, index) => {
                return (
                  <>
                    {/* <span style={{ textAlign: "justify", textJustify: "inter-word" }}>
                    <strong>
                      विषय क्रं : {index + 1}) {obj.subject}
                    </strong>
                  </span> */}
                    <Grid
                      container
                      // spacing={23}
                      style={{
                        // padding: "10px",
                        // marginTop: "10px",
                        // paddingLeft: "100px",
                        // paddingRight: "85px",
                        // pageBreakAfter: "300px",
                        marginBottom: "3%",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        md={2}
                        style={{
                          display: "flex",
                          // flexDirection: "column",
                          justifyContent: "flex-start",
                          // alignItems: "center",
                        }}
                      >
                        <strong>विषय क्रं : {index + 1})</strong>{" "}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={10}
                        md={10}
                        style={{
                          display: "flex",
                          // flexDirection: "column",
                          justifyContent: "flex-start",
                          // alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            textAlign: "justify",
                            textJustify: "inter-word",
                          }}
                        >
                          {obj.subjectSummary}
                        </span>
                      </Grid>
                    </Grid>
                    {/* <div style={{ textAlign: "justify", textJustify: "inter-word" }}>
                    <strong>विषय क्रं : {index + 1})</strong>{" "}
                  </div> */}

                    {/* <p
                    className={styles.description}
                    style={{ textAlign: "justify", textJustify: "inter-word" }}
                  >
                    <strong> विषय क्रं : {index + 1}) </strong>
                    {obj.subjectSummary}
                  </p> */}
                  </>
                );
              })}

            <div className={styles.signatureWrapper}>
              <div className={styles.signature}>
                <span
                  style={{
                    height: 50,
                    width: 200,
                    padding: "2%",
                    marginBottom: "5%",
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ opacity: "30%" }}>इथे हस्ताक्षर करा</span>
                </span>
                <span>{"( उल्हास बबनराव जगताप )"}</span>
                <span>
                  <strong>नगरसचिव</strong>
                </span>
                <span>पिंपरी चिंचवड महानगरपालिका</span>
                <span>पिंपरी - ४११०१८</span>
              </div>
            </div>
            <div className={styles.endDetails}>
              <span>पिंपरी चिंचवड महानगरपालिका</span>
              <span>पिंपरी - १८. नगरसचिव विभाग</span>
              <span>क्रमांक - {meetingScheduleLing && meetingScheduleLing[0]?.outwardNo}</span>
              <span>
                दिनांक -{" "}
                {moment(meetingScheduleLing && meetingScheduleLing[0]?.outwardDate).format("DD/MM/YYYY")}
              </span>
              <br />
              <span>टिप - {agendaDetails.tip}</span>
              {/* /////////////////////////////////////////////// */}
              {/* <div className={styles.tip}>
              <span className={styles.tipLeft}>टिप -</span>
              <span className={styles.tipRight}>{agendaDetails.tip}</span>
            </div> */}
            </div>
          </div>
        </Paper>
      )}
    </>
  );
};

export default ToPrint;
