import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  fromDate: yup.string().required("From Date is Required !!!"),
  toDate: yup.string().required("To Date is Required !!!"),
  schemeName: yup.string().required("Scheme Name is Required !!!"),
  schemeNameMr: yup.string().required("Scheme Name (Marathi) is Required !!!"),
  schemePrefix: yup.string().required("Scheme Prefix is Required !!!"),
  schemeNo: yup.string().required("Scheme No. is Required !!!"),


});

export default schema;
