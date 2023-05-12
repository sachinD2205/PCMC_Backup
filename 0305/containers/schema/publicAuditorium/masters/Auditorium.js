import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  zone: yup.string().required("Zone name is Required !!!"),
  wardName: yup.string().required("Ward name is Required !!!"),
  auditoriumNameEn: yup.string().required("Auditorium name is Required !!!"),
  auditoriumNameMr: yup.string().required("Auditorium name in marathi is Required !!!"),
  addressEn: yup.string().required("Address is Required !!!"),
  addressMr: yup.string().required("Address in marathi is Required !!!"),
  gsiIdGeocode: yup.string().required("gsiIdGeocode is Required !!!"),
  // seatingCapacity: yup.string().required("Seating Capacity is Required !!!"),
  seatingCapacity: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(3, "Seating Capacity must be at least 3 number")
    .max(5, "Seating Capacity not valid on above 5 number")
    .required("Seating Capacity required"),
});

export default Schema;
