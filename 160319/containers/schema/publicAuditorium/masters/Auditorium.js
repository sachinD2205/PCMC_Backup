import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  zone: yup.string().required("Zone name is Required !!!"),
  wardName: yup.string().required("Ward name is Required !!!"),
  auditoriumName: yup.string().required("Auditorium name is Required !!!"),
  address: yup.string().required("Address is Required !!!"),
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
