import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  auditoriumId: yup.string().required("Please select auditorium !!!"),
  eventTime: yup.string().nullable().required("Event time from is Required !!!"),
  programEventDescription: yup.string().required("Please enter program event description !!!"),
  days: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1, "Seating Capacity must be at least 1 number")
    .max(3, "Seating Capacity not valid on above 3 number")
    .required("Seating Capacity required"),
});

export default Schema;
