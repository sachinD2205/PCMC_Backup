import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  ward: yup.string().required("Ward is Required !!!"),
  zone: yup.string().required("Zone is Required !!!"),
  department: yup.string().required("Department is Required !!!"),
  subDepartment: yup.string().required(" sub Department Name is Required !!"),
  facilityType: yup.string().required("Facility Type is Required !!!"),
  facilityName: yup.string().required("Facility Name is Required !!!"),
  venue: yup.string().required(" Venue is Required !!"),
  // formDateTime: yup.string().required(" Date & Time is Required !!"),
  formDateTime: yup.string().nullable().required("From Date is Required !!!"),

  // toDateTime: yup.string().required(" Date & Time is Required !!"),

  toDateTime: yup.string().nullable().required("To Date is Required !!!"),
});

export default Schema;
