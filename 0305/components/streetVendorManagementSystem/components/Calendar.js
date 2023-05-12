import React from 'react'
import { Calendar as BigCalendar,CalendarProps, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useEffect } from 'react';

// localizer
const localizer = momentLocalizer(moment);
// Calendar
const Calendar = (props) => {

    useEffect(() => {
        console.log("props323",props);
    },[props])
  // view
  return (
      <>
          <BigCalendar {...props} localizer={localizer} />
      </>
  )
}

export default Calendar