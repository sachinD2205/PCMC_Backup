import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  vehicle_number: yup.string().required("Please Enter Vehicle Number !!!"),
  departmentKey: yup.string().required("Please Select Department !!!"),
  // // departmentKey: yup.number().required("Please select an department"),
  // // mobile_number: yup.string().required("Please Enter Mobile Number !!!"),
  driver_name: yup.string().required("Please Enter Driver Name !!!"),
  buildingName: yup.string().required("Please Enter Building Name !!!"),
  wardKey: yup.string().required("Please Select ward !!!"),
  zoneKey: yup.string().required("Please Select zone !!!"),
  mobile_number: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Mobile number required"),
  // travel_destination: yup.string().required("Please Enter Travel Destination !!!"),
  // licence_number: yup.string().required("Please Enter Licence Number !!!"),
  // approx_km: yup.string().required("Please Enter Approximate kilometers !!!"),
  // approx_km: yup
  //   .required("Mobile number required")
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(1, "Mobile Number must be at least 1 number")
  //   .max(6, "Mobile Number not valid on above 6 number"),
  // current_meter_reading: yup.string().matches(/^[0-9]+$/, "Must be only digits"),
  // vehicleInDateTime: yup.string().nullable().required("Vehicle In Date & Time is Required !!!"),
  // vehicleInDateTime: yup
  //   .string()
  //   .nullable()
  //   .required("Vehicle In Date & Time is Required !!!"),
  //   vehicle: yup.boolean()
  //     .required()
  //     .oneOf([0, 1], "Selecting the vehicle field is required"),
});

export default Schema;
