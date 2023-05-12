import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  toDate: yup.string().required("To Date is Required !!!"),
  fromDate: yup.string().required("From Date is Required !!!"),

  landmark: yup.string().required("Landmark is Required !!!"),
  landmarkMr: yup.string().required("Landmark Mr is Required !!!"),
  localityPrefix: yup.string().required("Locality Prefix is Required !!!"),
  zone: yup.string().required("Zone is Required !!!"),
});
//
export default schema;
