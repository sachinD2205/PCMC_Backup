import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import URLs from "../../../../URLS/urls";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { filterDocketAddToLocalStorage } from "../../../../components/redux/features/MunicipalSecretary/municipalSecreLocalStorage";

function SimpleDialog(props) {
  const { onClose, setSelectedValue, open } = props;
  const [_selectedValue, _setSelectedValue] = useState();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box>
        <DialogTitle>Event Name</DialogTitle>
        <List
          style={{
            padding: "20px",
            // paddingRight: "20px",
          }}
        >
          <TextField
            size="small"
            variant="outlined"
            placeholder="Enter event name"
            label="Enter event name"
            value={_selectedValue}
            onChange={(e) => {
              _setSelectedValue(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              setSelectedValue(_selectedValue);
              onClose();
            }}
          >
            Ok
          </Button>
        </List>
      </Box>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

const localizer = momentLocalizer(moment);

const CalenderSchedulingAndHoliday = (props) => {
  const [meetings, setMeetings] = useState([]);
  const [sendquery, setSendquery] = useState([]);
  const [queryAgendaNo, setQueryAgendaNo] = useState([]);
  const [committeName1, setCommitteName1] = useState(null);

  const [startDateLo, setstartDateLo] = useState();
  const [endDateLo, setendDateLo] = useState();
  const [isApplicable, setIsApplicable] = useState(true);
  const router = useRouter();

  const getAllMeetings = () => {
    axios
      .get(
        `${urls.MSURL}/trnPrepareMeetingAgenda/getByFromDate?fromDate=${
          startDateLo ? startDateLo : moment(new Date()).startOf("month").format("YYYY-MM-DD")
        }&toDate=${endDateLo ? endDateLo : moment(new Date()).endOf("month").format("YYYY-MM-DD")}`,
      )
      .then((r) => {
        setMeetings(
          r?.data?.map((row) => ({
            // id: row.id,
            // meetingDate: row.meetingDate,
            // meetingPlace: row.meetingPlace,
            id: row.id,
            title:
              row?.committeeName
                ?.split(" ")
                .map((word) => word.charAt(0))
                .join("") +
              " " +
              row?.meetingTime,
            start: moment(row.meetingDate).format("YYYY/MM/DD"),
            end: moment(row.meetingDate).format("YYYY/MM/DD"),
            resourceId: 1,
            agendaNo: row.agendaNo,
            title1: row?.committeeName,
            /////////////////////////
            attendancePrepared: row?.attendancePrepared,
          })),
        );
      });
  };

  useEffect(() => {
    getAllMeetings();
  }, [startDateLo, endDateLo]);

  // const events = [
  //   meetings.map((m) => {
  //     return {
  //       id: m.id,
  //       title: m.meetingPlace,
  //       start: moment(m.meetingDate).format("YYYY/MM/DD"),
  //       end: moment(m.meetingDate).format("YYYY/MM/DD"),
  //       resourceId: 1,
  //     }
  //   }),
  // ]
  // const events = [
  //   {
  //     id: 0,
  //     title: "Board meeting",
  //     start: new Date(2023, 11, 29, 9, 0, 0),
  //     end: new Date(2023, 11, 29, 13, 0, 0),
  //     resourceId: 1,
  //   },
  // ]

  // const [myEvents, setEvents] = useState(events)
  // const [myEvents, setEvents] = useState(meetings)

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [OptionsForRoute, setOptionsForRoute] = useState([
    { name: "Subject/Agenda" },
    { name: "Attendance" },
    { name: "Proceeding" },
    { name: "Reschedule Meeting" },
    { name: "Honorarium Process" },
  ]);

  const [checkAttend, setCheckAttend] = useState(null);
  const [eventDate, setEventDate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
  });

  // useEffect(() => {
  //   getCalendarAndHolidays()
  // }, [])

  // const getCalendarAndHolidays = () => {
  //   axios
  //     // .get(`http://localhost:8090/cfc/api/master/calendarAndHolidays/getAll`)
  //     .get(`${URLs.CFCURL}/master/calendarAndHolidays/getAll`)
  //     .then((res) => {
  //       console.log("data: ", res)
  //       let result = res.data.calendarAndHolidays
  //       let _res = result.map((val, i) => {
  //         // {
  //         //   id: 0,
  //         //   title: "Board meeting",
  //         //   start: new Date(2018, 11, 29, 9, 0, 0),
  //         //   end: new Date(2018, 11, 29, 13, 0, 0),
  //         //   resourceId: 1,
  //         //  }
  //         return {
  //           activeFlag: val.activeFlag,
  //           srNo: val.id,
  //           calenderPrefix: val.calenderPrefix,
  //           title: val.event,
  //           id: val.id,
  //           start: val.holidayDate,
  //           end: val.holidayDate,
  //           month: val.month,
  //           nameOfYear: val.nameOfYear,
  //           remark: val.remark,
  //           status: val.activeFlag === "Y" ? "Active" : "Inactive",
  //         }
  //       })
  //       console.log("_res ", _res)
  //       // setEvents(_res)
  //     })
  // }

  // const addEvent = (start, title) => {
  //   console.log("start,title", start, title)

  //   const bodyForAPI = {
  //     // ...formData,
  //     nameOfYear: Number(moment(start).format("YYYY")),
  //     month: Number(moment(start).format("MM")),
  //     holidayDate: start,
  //     event: title,
  //   }

  //   console.log("data ", bodyForAPI)

  //   axios
  //     .post(
  //       // `http://localhost:8090/cfc/api/master/calendarAndHolidays/save`,
  //       `${URLs.CFCURL}/master/calendarAndHolidays/save`,
  //       bodyForAPI
  //     )
  //     .then((response) => {
  //       console.log("response1", response)
  //     })
  // }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    console.log("56", value);
    setOpen(false);
  };

  // const handleSelectSlot = useCallback(
  //   ({ start, end }) => {
  //     console.log("start", start)
  //     // handleClickOpen();
  //     // if (selectedValue) {
  //     //   setEvents((prev) => [...prev, { start, end, title }]);
  //     // }
  //     const title = window.prompt("Event Name")
  //     if (title) {
  //       setEvents((prev) => [...prev, { start, end, title }])
  //       addEvent(end, title)
  //     }
  //   },
  //   [setEvents]
  // )

  const handleSelectEvent = useCallback(
    // (event) => window.alert(event.title),
    (event) => {
      loging(event), setIsModalOpen(true);
    },
    [],
  );

  // ...................>>>>>>>>>>>><<<<<<<<<<<<...................
  const loging = (event) => {
    console.log("..........events", event);
    setSendquery(event);
    setQueryAgendaNo(event.agendaNo);
    setCommitteName1(event.title1);
    // filterDocketAddToLocalStorage("startDate", event.start)
    // filterDocketAddToLocalStorage("queryParams", event)

    setCheckAttend(event?.attendancePrepared);
    setEventDate(event?.start);

    let eventDate = event?.start;
    let currDate = moment(new Date()).format("YYYY/MM/DD");
    let checkAttend = event?.attendancePrepared;
    if (eventDate != null && currDate != null && checkAttend != null) {
      console.log("all set ");
      if (eventDate > currDate) {
        console.log("ghari ja");
        setIsApplicable(true);
      } else if (eventDate < currDate) {
        console.log("kharach ghari ja");
        setIsApplicable(true);
      } else {
        console.log("tuch bhava");
        if (checkAttend) {
          console.log("gg bhava");
          setIsApplicable(true);
        } else {
          console.log("sorry bhava");
          setIsApplicable(false);
        }
      }
    }

    return event;
  };

  // ......................................................

  const _dayPropGetter = useCallback(
    (date) => ({
      ...(moment(date).day() === 6 && {
        style: {
          color: "red",
          backgroundColor: "#FFA07A",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // width: "50px",
        },
      }),
      ...(moment(date).day() === 0 && {
        style: {
          color: "red",
          backgroundColor: "#FFA07A",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          width: "50px",
        },
      }),
    }),
    [],
  );

  const onView = useCallback((newView) => console.log("newView", newView));

  //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   //
  const showModal = () => {
    setIsModalOpen(true);
    // alert("true")
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // .startOf("week")
  //  .endOf("week")
  // ...........................>>>>>>>>>>
  const onNavigate = (date, view) => {
    let start, end;

    if (view === "month") {
      // start = moment(date).startOf("month").format("YYYY-MM-DD")
      // console.log(start)
      // end = moment(date).endOf("month").format("YYYY-MM-DD")
      setstartDateLo(moment(date).startOf("month").format("YYYY-MM-DD"));
      console.log(start);
      setendDateLo(moment(date).endOf("month").format("YYYY-MM-DD"));
    }
    console.log("Navigate", start, end);

    return console.log({ start, end });
  };

  useEffect(() => {
    const date = new Date();
    setstartDateLo(moment(date).startOf("month").format("YYYY-MM-DD"));
    setendDateLo(moment(date).endOf("month").format("YYYY-MM-DD"));
  }, []);

  let currDate = moment(new Date()).format("YYYY/MM/DD");

  console.log("::kol", currDate);

  // useEffect(() => {
  //   if (eventDate != null && currDate != null && checkAttend != null) {
  //     console.log("all set ");
  //     if (eventDate > currDate) {
  //       console.log("ghari ja");
  //       setIsApplicable(false);
  //     } else if (eventDate < currDate) {
  //       console.log("kharach ghari ja");
  //       setIsApplicable(false);
  //     } else {
  //       console.log("tuch bhava");
  //       if (checkAttend) {
  //         console.log("gg bhava");
  //         setIsApplicable(true);
  //       } else {
  //         console.log("sorry bhava");
  //         setIsApplicable(false);
  //       }
  //     }
  //   }
  // }, [checkAttend, eventDate, currDate]);

  // useEffect(() => {
  //   console.log("isApplicable------", isApplicable);
  // }, [isApplicable]);

  // useEffect(() => {
  //   console.log("eventDate:-", eventDate);
  // }, [eventDate]);

  // useEffect(() => {
  //   console.log("currDate:-", currDate);
  // }, [currDate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: "center",
        padding: "10px",
      }}
    >
      <div>
        {/* <SimpleDialog
          setSelectedValue={setSelectedValue}
          open={open}
          onClose={handleClose}
        /> */}
      </div>
      {console.log("myEvents", meetings)}
      {/* {console.log("myEvents", myEvents)} */}

      <Calendar
        localizer={localizer}
        events={meetings}
        startAccessor="start"
        endAccessor="end"
        // onSelectSlot={handleSelectSlot}
        selectable={true}
        popup={true}
        style={{
          height: "100vh",
          width: "90vw",
        }}
        step={30}
        defaultView="month"
        selectRange={true}
        // views={["month", "week", "day"]}
        views={["month"]}
        defaultDate={new Date()}
        scrollToTime={new Date(1970, 1, 1, 6)}
        onSelectEvent={handleSelectEvent}
        onView={onView}
        onNavigate={onNavigate}
        dayPropGetter={_dayPropGetter}
        eventPropGetter={(event) => {
          const backgroundColor = event.allday ? "yellow" : "blue";
          return { style: { backgroundColor } };
        }}
      />

      {/* .............................MODAL............................... */}

      <Modal
        title="Agenda Modal"
        open={isModalOpen}
        onOk={true}
        // onClose={handleCancel}
        footer=""
        // width="1800px"
        // height="auto"
        sx={{
          padding: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "50vh",
            width: "20%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "8px solid blue",
            borderRadius: "24px",
            borderLeft: "1px solid blue ",
            borderRight: "1px solid blue ",
            borderBottom: "3px solid blue",
          }}
        >
          {/* {OptionsForRoute?.map((obj) => {
            return (
              <Button
                style={{
                  backgroundColor: "blue",
                  width: "13vw",
                  marginBottom: "3%",
                  color: "white",
                  // borderTop: "0.4vw solid blue",
                  // borderBottom: "0.2vw solid blue",
                  // borderLeft: "0.1vw solid blue",
                  // borderRight: "0.1vw solid blue",
                  borderRadius: "2.5vw",
                }}
              >
                {obj.name}
              </Button>
            )
          })} */}
          {/* <Button
            style={{
              backgroundColor: "blue",
              width: "13vw",
              marginBottom: "3%",
              color: "white",
              // borderTop: "0.4vw solid blue",
              // borderBottom: "0.2vw solid blue",
              // borderLeft: "0.1vw solid blue",
              // borderRight: "0.1vw solid blue",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              router.push({
                pathname: "/municipalSecretariatManagement/transaction/agenda",
              });
            }}
          >
            Subject/Agenda
          </Button> */}

          {/* ///////////////////////////////////////// */}
          <Button
            // disabled={checkAttend ? true : false}
            disabled={isApplicable}
            style={{
              backgroundColor: "blue",
              width: "13vw",
              marginBottom: "3%",
              color: "white",
              // borderTop: "0.4vw solid blue",
              // borderBottom: "0.2vw solid blue",
              // borderLeft: "0.1vw solid blue",
              // borderRight: "0.1vw solid blue",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              router.push({
                pathname: "/municipalSecretariatManagement/transaction/markAttendance",
                query: {
                  agendaNo: queryAgendaNo,
                  committeeId: committeName1 !== null ? committeName1 : "",
                },
              });
            }}
          >
            Attendance
          </Button>

          <Button
            disabled={checkAttend ? false : true}
            style={{
              backgroundColor: "blue",
              width: "13vw",
              marginBottom: "3%",
              color: "white",
              // borderTop: "0.4vw solid blue",
              // borderBottom: "0.2vw solid blue",
              // borderLeft: "0.1vw solid blue",
              // borderRight: "0.1vw solid blue",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              router.push({
                pathname: "/municipalSecretariatManagement/transaction/minutesOfMeeting",
                query: {
                  agendaNo: queryAgendaNo,
                },
              });
            }}
          >
            Proceeding
          </Button>
          <Button
            disabled={checkAttend ? true : false}
            style={{
              backgroundColor: "blue",
              width: "13vw",
              marginBottom: "3%",
              color: "white",
              // borderTop: "0.4vw solid blue",
              // borderBottom: "0.2vw solid blue",
              // borderLeft: "0.1vw solid blue",
              // borderRight: "0.1vw solid blue",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              console.log("...sendquery", sendquery);
              router.push(
                {
                  pathname: "/municipalSecretariatManagement/transaction/meetingReScheduling",
                  query: sendquery,
                },
                "/municipalSecretariatManagement/transaction/meetingReScheduling",
              );

              filterDocketAddToLocalStorage("queryParams", sendquery);
            }}
          >
            Meeting Reschedule
          </Button>
          <Button
            style={{
              backgroundColor: "blue",
              width: "13vw",
              marginBottom: "3%",
              color: "white",
              // borderTop: "0.4vw solid blue",
              // borderBottom: "0.2vw solid blue",
              // borderLeft: "0.1vw solid blue",
              // borderRight: "0.1vw solid blue",
              borderRadius: "2.5vw",
            }}
            onClick={() => {
              router.push({
                pathname: "/municipalSecretariatManagement/transaction/honorariumProcess",
              });
            }}
          >
            Honorarium Process
          </Button>

          <Button
            variant="contained"
            color="error"
            endIcon={<ExitToAppIcon />}
            style={{ marginTop: "20px", borderRadius: "20px" }}
            size="small"
            onClick={handleCancel}
          >
            Close
          </Button>
          {/* <div
            style={{
              top: "60%",
              // bottom: ,
              position: "fixed",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // gap: 90,
            }}
          >
            <Button
              variant="contained"
              color="error"
              endIcon={<ExitToAppIcon />}
              style={{ borderRadius: "20px" }}
              size="small"
              onClick={handleCancel}
            >
              Close
            </Button>
          </div> */}
        </Box>
      </Modal>
    </div>
  );
};

export default CalenderSchedulingAndHoliday;
