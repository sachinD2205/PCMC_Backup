import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./view.module.css";

import URLS from "../../../../URLS/urls";
import { Paper, Button, Checkbox, Grid } from "@mui/material";
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

  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Agenda",
    pageStyle: "A4",
    // onAfterPrint: () => alert('Print success'),
  });

  useEffect(() => {
    if (router.query.agendaNo) {
      axios
        .get(
          `${URLS.MSURL}/trnPrepareMeetingAgenda/getByFromDateAndToDateOrAgendaNo?agendaNo=${router.query.agendaNo}`,
        )
        .then((res) => {
          setAgendaDetails(res.data.prepareMeetingAgenda[0]);
          setMeetingScheduleLing(res?.data?.prepareMeetingAgenda?.map((obj) => obj.meetingSchedule));
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
  }, []);

  useEffect(() => {
    // let abc = meetingScheduleLing[0]?.map((obj) => obj);
    // console.log(":321", meetingScheduleLing[0][0]?.meetingDate);
  }, [meetingScheduleLing]);

  useEffect(() => {
    //Get Committee Name
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
      .then((res) => {
        res.data.committees.forEach((j) => {
          if (j.id === agendaDetails["committeeId"]) {
            // setCommitteeName({
            //   id: j.id,
            //   committeeNameEn: j.committeeName,
            //   committeeNameMr: j.committeeNameMr,
            // })
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

  /////////////////////////////////////////////////////
  let currentdate = new Date();
  console.log(":454", moment(currentdate).format("DD/MM/YYYY"));
  return (
    <>
      <Head>
        <title>Reports - Meeting Agenda</title>
      </Head>
      <Paper className={styles.main} style={{ backgroundColor: "whitesmoke" }}>
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
              //   pathname: `${URLS.APPURL}/municipalSecretariatManagement/transaction/circulatingAgenda`,
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
              marginBottom: "10%",
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
              <span style={{ textAlign: "start" }}> पिंपरी - ४११ ०१८</span>
              <span style={{ textAlign: "start" }}>
                मा. <strong>{committeeName}</strong>
                {specialMeeting && <strong> ( विशेष सभा )</strong>}
              </span>
              <span style={{ textAlign: "justify" }}>कार्यपत्रिका क्रमांक - {agendaDetails.agendaNo}</span>
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
              <span>मा._________________________________,</span>
              <span>
                सदस्य, मा. <strong>{committeeName}</strong>
                {specialMeeting && <strong> ( विशेष सभा )</strong>}
              </span>
              <span>पिंपरी चिंचवड महानगरपालिका,</span>
              <span> पिंपरी - ४११ ०१८</span>
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
              विषय - पिंपरी चिंचवड महानगरपालिका, मा. {committeeName}ची साप्ताहिक सभा दिनांक.{" "}
              {meetingScheduleLing && moment(meetingScheduleLing[0][0]?.meetingDate).format("DD/MM/YYYY")}{" "}
              रोजी आयोजित केलाबाबत.
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
              <span style={{ textAlign: "justify", textJustify: "inter-word", marginLeft: "90px" }}>
                विषय - पिंपरी चिंचवड महानगरपालिका, मा. {committeeName}ची साप्ताहिक सभा दिनांक.{" "}
                {meetingScheduleLing && moment(meetingScheduleLing[0][0]?.meetingDate).format("DD/MM/YYYY")}{" "}
                रोजी {meetingScheduleLing && meetingScheduleLing[0][0]?.meetingTime} वा. मा.अवर सचिव
                महाराष्ट्र शासन यांचेकडील पत्र क्र. कोरोना बाबत अन्वय ऑनलाईन पद्धतीने (व्हिडिओ कॉन्फरन्सिंग
                द्वारे ) आयोजित करण्यात करण्यात केली आहे.{" "}
                {meetingScheduleLing && meetingScheduleLing[0][0]?.meetingPlace} इथे हे सभा संचालित करणार
                आहेत. सोबत सभेची कार्येपत्रिका जोडली आहे. सभेस आपण ऑनलाईन पध्दतेनी सेहभागी व्हावे, हि विनंती.
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
              <span>पिंपरी - ४११ ०१८</span>
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
                <li> प्रत - १) सर्व संबंदित शाखा प्रमुख व शाखाधिकारी</li>
                <li style={{ marginLeft: "35px" }}>२) कारयालीन नोटीस बोर्ड </li>
              </ul>
            </Grid>
          </Grid>

          {/* //////////////////////////// */}
          <div className={styles.heading}>
            <span>पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८ </span>
            <span>
              मा. <strong>{committeeName}</strong>
              {specialMeeting && <strong> ( विशेष सभा )</strong>}
            </span>
            <span>कार्यपत्रिका क्रमांक - {agendaDetails.karyakramPatrikaNo}</span>
          </div>
          <div className={styles.dateAndTime} style={{ justifyContent: "space-between" }}>
            <span>
              दिनांक -{" "}
              <strong>
                {/* ०१/०२/२०२३ */}
                {moment(currentdate).format("DD/MM/YYYY")}
              </strong>
            </span>
            <span>
              वेळ -<strong> {moment(currentdate).format("LTS")}</strong>
            </span>
          </div>
          <p className={styles.description} style={{ textAlign: "justify", textJustify: "inter-word" }}>
            पिंपरी चिंचवड महानगरपालिका मा. <strong>{committeeName}</strong> समितीची सभा{" "}
            {specialMeeting && <> ( विशेष सभा )</>} दिनांक{" "}
            <strong>
              {meetingScheduleLing && moment(meetingScheduleLing[0][0]?.meetingDate).format("DD/MM/YYYY")}
            </strong>{" "}
            रोजी सकाळी <strong> {meetingScheduleLing && meetingScheduleLing[0][0]?.meetingTime} </strong>
            वा. महानगरपालिका प्रशाश्कीय हद्दी मधील{" "}
            <strong> {meetingScheduleLing && meetingScheduleLing[0][0]?.meetingPlace} </strong> ऑनलाईन
            पद्धतीने (व्हिडिओ कोन्फारन्सिंग द्वारे) आयोजित करणेत आले आहे. सभेत खालील कामकाज होईल.
          </p>
          {agendaDetails?.agendaSubjectDao &&
            // @ts-ignore
            agendaDetails?.agendaSubjectDao?.map((obj, index) => {
              return (
                <>
                  <span style={{ textAlign: "justify", textJustify: "inter-word" }}>
                    <strong>
                      विषय क्रं : {index + 1}) {obj.subject}
                    </strong>
                  </span>
                  <p
                    className={styles.description}
                    style={{ textAlign: "justify", textJustify: "inter-word" }}
                  >
                    <strong> विषय सारांश : {index + 1}) </strong>
                    {obj.subjectSummary}
                  </p>
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
              <span>पिंपरी - ४११ ०१८</span>
            </div>
          </div>
          <div className={styles.endDetails}>
            <span>पिंपरी चिंचवड महानगरपालिका</span>
            <span>पिंपरी - १८. नगरसचिव कार्यालय</span>
            <span>क्रमांक : नस/४/कवि/२९३/२०२०</span>
            <span>दिनांक : {moment(currentdate).format("DD/MM/YYYY")}</span>
            {/* /////////////////////////////////////////////// */}
            <div className={styles.tip}>
              <span className={styles.tipLeft}>टिप -</span>
              <span className={styles.tipRight}>{agendaDetails.tip}</span>
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default ToPrint;
