import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  vehicleNumber: yup.string().required("Please Enter Vehicle Number !!!"),
  // employeeKey: yup.string().required("Please Enter Employee Key !!!"),
  employeeKey: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Employee ID required"),
  // employeeName: yup.string().required("Please Enter Employee Name !!!"),
  employeeName: yup
    .string()
    .matches(/^[A-Z a-z]+$/, "Must be only string")
    .required("Please Enter Employee Name !!!")
    .typeError(),
  employeeMobileNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Mobile number required")
    .typeError(),

  // employeeMobileNumber: yup
  //   .string()
  //   .required("Please Enter Employee Mobile Number !!!"),
  vehicleAllotedAt: yup.string().nullable().required("Please Select Vehicle Alloted At !!!"),
  departmentKey: yup.string().required("Please Select Department !!!"),
});

export default Schema;
