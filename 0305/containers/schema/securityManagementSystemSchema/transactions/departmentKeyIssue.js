import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  departmentKey: yup.string().required("Please Select Department Name !!!"),
  // mobileNumber: yup.string().required("Please Enter Mobile Number !!!"),
  mobileNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Mobile number required"),
  employeeKey: yup.string().required("Please Select Employee Name !!!"),
  buildingName: yup.string().required("Please Enter Building Name !!!"),
  wardKey: yup.string().required("Please Select ward !!!"),
  zoneKey: yup.string().required("Please Select zone !!!"),
  // keyIssueAt: yup.date().required("Date of incident is Required !!!"),
  // keyStatus: yup.string().required("Please Select Departmemt key Status !!!"),
  // keyReceivedAt: yup
  //   .string()
  //   .nullable()
  //   .required("Please Select key Recieved at !!!"),
});

export default Schema;
