import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  buildingName: yup.string().required("Please Enter Building Name !!!"),
  wardKey: yup.string().required("Please Select ward !!!"),
  zoneKey: yup.string().required("Please Select zone !!!"),
  // departmentKey: yup.string().required("Please Select department !!!"),
  visitorName: yup.string().required("Please Enter Visitor Name !!!"),
  // departmentKey: yup.string().required("Please Select Department !!!"),
  toWhomWantToMeet: yup.string().required("Please Enter Whom to meet !!!"),
  priority: yup.string().required("Please Select priority !!!"),
  mobileNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Mobile number required"),
  // searchEmployeeId: yup
  // .string()
  // .matches(/^[0-9]+$/, "Must be only digits")
  // .min(10, "Mobile Number must be at least 10 number")
  // .max(10, "Mobile Number not valid on above 10 number"),
  purpose: yup.string().required("Please Enter Purpose !!!"),
  aadhar_card_no: yup.string().matches(/^[a-zA-Z0-9 ]*$/, "Special characters are not allowed"),
  // aadhar_card_no: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(12, "Aadhar Card No. must be at least 12 number")
  //   .max(12, "Aadhar Card No. not valid on above 12 number")
  //   .required("Please Enter Valid Aadhar Card No. !!!"),
  // inTime: yup
  //   .string()
  //   .nullable()
  //   .required("Visitor In Date & Time is Required !!!"),
  // searchEmployeeId: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(10, "Mobile Number must be at least 10 number")
  //   .max(10, "Mobile Number not valid on above 10 number")
  //   .required("Mobile number required"),
  visitorPhoto: yup.string().nullable().required("Visitor photo required !!!"),
});

export default Schema;
