import React from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback } from 'react';
import { useState } from 'react';
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel';
import { Button, CssBaseline, Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SiteVisitAppointmentView from '../../../components/streetVendorManagementSystem/components/SiteVisitAppointmentView';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';
import { Failed } from '../../../components/streetVendorManagementSystem/components/commonAlert';
import urls from '../../../URLS/urls';



// siteVisitDashboard
// http://localhost:4000/streetVendorManagementSystem/dashboards/siteVisitDashboard
// main Component
const siteVisitDashboard = () => {
    // localizer
    const localizer = momentLocalizer(moment);
    // date
  const [startDateMonth, setStartDateMonth] = useState();
  const [endDateMonth, setEndDateMonth] = useState();
  const [events,setEvents] = useState([])
    const [selectedEventData, setSelectedEventData] = useState();
  // Dailog
  const [siteVisitAppointmentViewDailog, setSiteVisitAppointmentViewDailog] = useState(false);
  const siteVisitAppointmentViewDailogOpen = () => setSiteVisitAppointmentViewDailog(true);
  const siteVisitAppointmentViewDailogClose = () => setSiteVisitAppointmentViewDailog(false);

    // Events 
    const eventsTest = [
        {
            //   start: new Date(2023, 10, 29, 9, 0, 0),
            //   end: new Date(2023, 10, 29, 13, 0, 0),
            start: moment("2023-04-30T10:00:00").toDate(),
            end: moment("2023-04-30T11:00:00").toDate(),
            title: "Site visit Event",
            description:"sdf"
        },

         {
            //   start: new Date(2023, 10, 29, 9, 0, 0),
            //   end: new Date(2023, 10, 29, 13, 0, 0),
            start: moment("2023-04-30T12:00:00").toDate(),
            end: moment("2023-04-30T13:00:00").toDate(),
            title: "Site visit Event 2"
        },
          {
            //   start: new Date(2023, 10, 29, 9, 0, 0),
            //   end: new Date(2023, 10, 29, 13, 0, 0),
            start: moment("2023-04-30T12:00:00").toDate(),
            end: moment("2023-04-30T13:00:00").toDate(),
            title: "Site visit Event 2"
        },
           {
            //   start: new Date(2023, 10, 29, 9, 0, 0),
            //   end: new Date(2023, 10, 29, 13, 0, 0),
            start: moment("2023-04-30T12:00:00").toDate(),
            end: moment("2023-04-30T13:00:00").toDate(),
            title: "Site visit Event 2"
        },
            {
            //   start: new Date(2023, 10, 29, 9, 0, 0),
            //   end: new Date(2023, 10, 29, 13, 0, 0),
            start: moment("2023-04-30T12:00:00").toDate(),
            end: moment("2023-04-30T13:00:00").toDate(),
            title: "Site visit Event 2"
        }
    ]

    // holidays
    const holidays =
     [
        {
            //   start: new Date(2023, 10, 29, 9, 0, 0),
            //   end: new Date(2023, 10, 29, 13, 0, 0),
            start: moment("2023-04-05T10:00:00").toDate(),
            end: moment("2023-04-05T11:00:00").toDate(),
            title: "Holiday",
            description: "sdf",
         color: 'white',
         backgroundColor: 'red',
         
        },

         {
            //   start: new Date(2023, 10, 29, 9, 0, 0),
            //   end: new Date(2023, 10, 29, 13, 0, 0),
            start: moment("2023-04-04T12:00:00").toDate(),
            end: moment("2023-04-04T13:00:00").toDate(),
              title: "Holiday",
               color: 'white',
             backgroundColor:'red',
        }
    ]
    
    // hadleSelectEvent 
    const handleSelectEvent = useCallback(
        (event) => {
            siteVisitAppointmentViewDailogOpen();
            setSelectedEventData(event)
            console.log("event handleSelect",event);
            // alert(event.title)
        },
    [],
    );

    
  // getAllSiteVisitAppointments
  const getAllSiteVisitAppointments = () => {
    console.log("startDateMonth2342",startDateMonth,endDateMonth);

    axios
      .get(`http://localhost:8095/hw/api/master/AppointmentScheduleReschedule/getAppointmentByFromDateAndToDate?fromDate=${startDateMonth}&toDate=${endDateMonth}`).then((res) => {
        if (res?.status == 200 || res?.status == 201) {
         
          // alert("df")
             console.log("res?.sdfds",res?.data);
            setEvents(
              res?.data?.map((r, index) => ({
                start:moment(r?.mstSlot?.slotDate+"T"+r?.mstSlot?.fromTime).toDate(),
                end: moment(r?.mstSlot?.slotDate+"T"+r?.mstSlot?.toTime).toDate(),
                title: r?.issuanceOfHawkerLicenseDao?.applicationNumber,
                siteVisitTime:r?.mstSlot?.fromTime+ " To "+ r?.mstSlot?.toTime,
                color: 'white',
               backgroundColor:'blue',
                applicationId: r?.applicationId,
                siteVisitDate:r?.siteVisitDate,
                id:r?.index,
               slotId:r?.mstSlot?.id,
            applicationNumber:r?.issuanceOfHawkerLicenseDao?.applicationNumber,
                applicationDate: r?.issuanceOfHawkerLicenseDao?.applicationDate,
                applicantName: r?.issuanceOfHawkerLicenseDao?.firstName + " " + r?.issuanceOfHawkerLicenseDao?.middleName + " " +r?.issuanceOfHawkerLicenseDao?.lastName ,
                applicationNameMar: r?.issuanceOfHawkerLicenseDao?.firstNameMr + " " + r?.issuanceOfHawkerLicenseDao?.middleNameMr + " " +r?.issuanceOfHawkerLicenseDao?.lastNameMr ,
            serviceName:r?.issuanceOfHawkerLicenseDao?.serviceId,
            emailAddress:r?.issuanceOfHawkerLicenseDao?.emailAddress,
            mobile:r?.issuanceOfHawkerLicenseDao?.mobile,
                addressEn: r?.issuanceOfHawkerLicenseDao?.mobile,
            deptName:"Hawker Management System",
              })),
           );
  }else {
      <Failed/>
    }
  }).catch ((error) => {
    console.log("Error", error);
    <Failed/>
 });
  };


  // weekends
  const _dayPropGetter = useCallback(
    (date) => ({
      ...(moment(date).day() === 6 && {
        style: {
          color: "red",
          backgroundColor: "#FFA07A",
        },
      }),
      ...(moment(date).day() === 0 && {
        style: {
          color: "red",
          backgroundColor: "#FFA07A"
        },
      }),
    }),
    [],
  );

 


  
    // onNavigate - Back / Next / Today Button
    const onNavigate = (date, MonthWeekDay) => {
    console.log("StartDate :",date,"MonthWeekDay:",MonthWeekDay );
    // month start Date 
    setStartDateMonth(moment(date).startOf("month").format("YYYY-MM-DD"));
    // month end Date
    setEndDateMonth(moment(date).endOf("month").format("YYYY-MM-DD"));
    };
    
    // ================== useEffects ============>


  // initial useEffect
    useEffect(() => {
      // current Date
        const date = new Date();
        // month start Date 
        setStartDateMonth(moment(date).startOf("month").format("YYYY-MM-DD"));
        // month end Date
        setEndDateMonth(moment(date).endOf("month").format("YYYY-MM-DD"));
  }, []);



  //  onNavigate Trigger 
    useEffect(() => {
       
        console.log("StartDateMonth:", startDateMonth, "endDateMonth:", endDateMonth);
        if (startDateMonth != undefined && endDateMonth != undefined) {
             getAllSiteVisitAppointments();
        }
  }, [startDateMonth, endDateMonth]);


  // Geting Events from Api 
   useEffect(() => {
    console.log("Events423423",events);
  },[events])


    // particular event pass to SiteVisitAppointmentViewComponent
    useEffect(() => {
        console.log("Selected Event Data ---> ",selectedEventData)
    },[selectedEventData])

 

    
    
 


    // view 
    return (
        <div
           
        >
      
   <Paper
              square
              sx={{
                padding: 1,
                paddingTop: 5,
                paddingBottom: 5,
                backgroundColor: "white",
                }}
                
                elevation={5}>
                 <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
          <strong>  Site Visit Dashboard </strong>
        </div>
              
                <div style={{ height: "90vh", padding:"5vh" }}>
               
                <Calendar
                // localizer
                localizer={localizer}
                // events
                events={[...events, ...holidays]}
                // popup={true}
                    onSelectEvent={handleSelectEvent}
                    // navigate
                    onNavigate={onNavigate}
                    // default
                    defaultView="month"
                    defaultDate={new Date()}
                    min={moment("2023-04-30T08:00:00").toDate()}
              max={moment("2023-04-30T23:00:00").toDate()}
              // holidays 
                dayPropGetter={_dayPropGetter}
              // Color - based on event 
              eventPropGetter={(myEventsList) => {
                 console.log("myEventsList",myEventsList);
            const backgroundColor = myEventsList.backgroundColor ? myEventsList.backgroundColor : 'blue';
            const color = myEventsList.color ? myEventsList.color : 'white';
            return { style: { backgroundColor ,color} }
          }}
                    />
                     </div>
       
            </Paper>
            
        {/** Form Preview Dailog  - OK */}
        <Dialog fullWidth maxWidth={"lg"} open={siteVisitAppointmentViewDailog} onClose={() => siteVisitAppointmentViewDailogClose()}>
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
             
            <strong>     Site Visit Appointment View
</strong>
            
              </Grid>
              <Grid
                item
                xs={1}
                sm={2}
                md={4}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  aria-label="delete"
                  sx={{
                    marginLeft: "530px",
                    backgroundColor: "primary",
                    ":hover": {
                      bgcolor: "red", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                  onClick={() => {
                    siteVisitAppointmentViewDailogClose();
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            {/** 
            <FormProvider {...methods}>*/}
            <SiteVisitAppointmentView selectedEventData={selectedEventData} />
            {/**  </FormProvider>*/}
          </DialogContent>

          {/** Exit Button */}
          {/**  
          <DialogTitle>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button onClick={() => siteVisitAppointmentViewDailogClose()}> {<FormattedLabel id="exit" />}</Button>
            </Grid>
          </DialogTitle>
          */}
        </Dialog>


        



            </div>
  )
}

export default siteVisitDashboard