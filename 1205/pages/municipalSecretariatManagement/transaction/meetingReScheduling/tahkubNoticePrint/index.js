import { Button, CircularProgress, Grid, Paper, ThemeProvider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import theme from "../../../../../theme";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import Send from "@mui/icons-material/Send";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useRouter } from "next/router";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import moment from "moment";
import UploadBtn from "./UploadBtn";

const Index = () => {
  const componentRef = useRef(null);

  const router = useRouter();

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: ,
    pageStyle: "A4",
    color: "color",
    // print: "color",
    // onAfterPrint: () => alert("Print success"),
  });
  const [data, setData] = useState([]);
  const [comittees1, setcomittees1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dayFromDate, setDayFromDate] = useState(null);
  const [attachment, setAttachment] = useState("");

  const getAllInfoAboutReshedule = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.MSURL}/trnMeetingSchedule/getByMeetingScheduleData?agendaNo=${router?.query?.agNo}`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let result = res?.data;
          setData(
            result?.map((r, i) => ({
              currentMeeetingDate: moment(r?.currentMeeetingDate).format("DD/MM/YYYY"),
              currentMeetingPlace: r?.currentMeetingPlace,
              currentMeetingTime: r?.currentMeetingTime,
              previousMeetingDate: moment(r?.previousMeetingDate).format("DD/MM/YYYY"),
              committeeName: comittees1?.find((obj) => obj?.id === r?.committeeId)?.committee,
              agendaOutwardNo: r?.agendaOutwardNo,
              agendaNo: r?.agendaNo,
            })),
          );
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
      })
      .catch((error) => {
        sweetAlert(error);
        setLoading(false);
      });
  };

  const getcomittees1 = () => {
    axios.get(`${urls.MSURL}/mstDefineCommittees/getAll`).then((r) => {
      setcomittees1(
        r?.data?.committees?.map((row) => ({
          id: row.id,
          committee: row.committeeNameMr,
        })),
      );
    });
  };
  useEffect(() => {
    getAllInfoAboutReshedule();
  }, [comittees1]);

  useEffect(() => {
    getcomittees1();
  }, []);

  useEffect(() => {
    if (data.length !== 0) {
      console.log(":data", data);
      // const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const weekdayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
      const dateString = data[0]?.currentMeeetingDate;
      const dateParts = dateString?.split("/");
      const dayIndex = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`).getDay();
      const dayName = weekdayNames[dayIndex];

      setDayFromDate(dayName);
    }
  }, [data]);

  let currDate = new moment(Date()).format("DD/MM/YYYY");

  ////////////////////////////////////////////////////////////
  const sendAgenda = () => {
    console.log("Filepath: ", attachment);

    let apiBody = {
      agendaNo: router?.query?.agNo,
      filePath: [attachment],
    };

    setLoading(true);
    axios
      .post(`${urls.MSURL}/trnPrepareMeetingAgenda/sendTahkubCircularOnMail`, apiBody)
      .then((res) => {
        console.log(res.data);
        if (res?.status === 200 || res?.status === 201) {
          sweetAlert("Success", "Agenda sent successfully !", "success");
          setLoading(false);
        } else {
          sweetAlert("Error", "Something Went Wrong !", "error");
          setLoading(false);
        }
      })
      .catch((error) => {
        sweetAlert("Error", error, "error");
        setLoading(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {loading ? (
          <Paper
            style={{
              display: "flex",
              justifyContent: "center",
              borderRadius: "20px",
              backgroundColor: "#1B8DF0",
              alignItems: "center",
              // textAlign: "cenetr",
            }}
          >
            <CircularProgress style={{ color: "black" }} />
          </Paper>
        ) : (
          <Paper
            style={{
              marginBottom: "30px",
              width: "65vw",
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
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2>
                      <strong>नोटीस</strong>
                    </h2>
                  </Grid>
                  {/* //////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      flexWrap: "wrap",
                      // alignItems: "start",
                      marginTop: "40px",
                    }}
                  >
                    <strong style={{ textAlign: "justify", textJustify: "inter-word" }}>
                      पिंपरी चिंचवड महानगरपालिकेची मा. {data.length !== 0 ? data[0]?.committeeName : ""}{" "}
                      समितीची
                    </strong>
                    <strong style={{ textAlign: "justify", textJustify: "inter-word" }}>
                      दि. {data.length !== 0 ? data[0]?.previousMeetingDate : ""} ची विशेष (अंदाजपत्रक) सभा
                      (कार्यपत्रिका क्र. {data.length !== 0 ? data[0]?.agendaNo : ""}){" "}
                      {dayFromDate !== null ? dayFromDate : ""} दिनांक{" "}
                      {data.length !== 0 ? data[0]?.currentMeeetingDate : ""} रोजी{" "}
                      {data.length !== 0 ? data[0]?.currentMeetingTime : ""} वा. पर्यंत तहकूब करणेत आलेली आहे.
                      तरी सन्मा. सदस्यांनी याची नोंद घेवून ठरविलेल्या दिवशी व वेळी ऑनलाईन पध्दतीने उपस्थित
                      रहावे, ही विनंती.
                    </strong>
                  </Grid>

                  {/* //////////////////////////////////// */}
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
                      marginTop: "50px",
                    }}
                  >
                    आपल्या विश्वासू ,
                    <span
                      style={{
                        height: 40,
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
                      <strong style={{ opacity: "30%" }}>इथे हस्ताक्षर करा</strong>
                    </span>
                    <strong>{"( उल्हास बबनराव जगताप )"}</strong>
                    <strong>
                      <strong>नगरसचिव</strong>
                    </strong>
                    <strong>पिंपरी चिंचवड महानगरपालिका</strong>
                    <strong>पिंपरी - ४११०१८</strong>
                  </Grid>

                  {/* ////////////////////// */}

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
                    <strong>पिंपरी चिंचवड महानगरपालिका</strong>
                    <strong>पिंपरी - १८. नगरसचिव कार्यालय</strong>
                    <strong>क्रमांक : {data.length !== 0 ? data[0]?.agendaOutwardNo : ""}</strong>
                    <strong>दिनांक : {currDate}</strong>
                  </Grid>

                  {/* /////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      alignItems: "baseline",
                      marginTop: "6px",
                    }}
                  >
                    <ul style={{ listStyle: "none" }}>
                      <li> प्रत - १) सर्व संबंदित शाखा प्रमुख व शाखाधिकारी</li>
                      <li style={{ marginLeft: "32px" }}>२) कारयालीन नोटीस बोर्ड </li>
                    </ul>
                  </Grid>

                  {/* ///////////////////////////////// */}
                </Grid>
              </form>
              <Grid
                container
                spacing={3}
                style={{
                  // padding: "10px",
                  marginTop: "10px",
                  // paddingLeft: "100px",
                  // paddingRight: "85px",
                  // pageBreakAfter: "300px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={3}
                  md={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "40px",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    sx={{ width: "auto" }}
                    // disabled={showSaveButton}
                    type="button"
                    variant="contained"
                    color="primary"
                    endIcon={<PrintIcon />}
                    style={{ borderRadius: "5px" }}
                    size="small"
                    onClick={handleToPrint}
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </Grid>
                {/* ///////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={5}
                  md={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "40px",
                    marginTop: "40px",
                  }}
                >
                  <UploadBtn
                    appName="TP"
                    serviceName="PARTMAP"
                    label="Circulate Tahkub Notice"
                    filePath={attachment}
                    fileUpdater={setAttachment}
                    // view
                  />
                  {attachment && (
                    <Button
                      variant="contained"
                      size="small"
                      // endIcon={<Send sx={{ color: '#1976d2' }} />}
                      endIcon={<Send sx={{ color: "white" }} />}
                      onClick={() => {
                        sendAgenda();
                      }}
                    >
                      send
                    </Button>
                  )}
                </Grid>
                {/* ///////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "40px",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    sx={{ width: "auto" }}
                    // disabled={showSaveButton}
                    type="button"
                    variant="contained"
                    color="secondary"
                    endIcon={<CalendarMonthIcon />}
                    style={{ borderRadius: "5px" }}
                    size="small"
                    onClick={() => {
                      router.push({
                        pathname: "/municipalSecretariatManagement/transaction/calender",
                      });
                    }}
                  >
                    <FormattedLabel id="calender" />
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Paper>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
