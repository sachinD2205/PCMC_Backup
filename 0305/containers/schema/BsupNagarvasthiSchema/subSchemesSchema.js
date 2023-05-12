import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  fromDate: yup.string().required("From Date is Required !!!"),
  toDate: yup.string().required("To Date is Required !!!"),
  subSchemeName: yup.string().required("Sub Scheme Name is Required !!!"),
  subSchemeNameMr: yup.string().required("Sub Scheme Name (Marathi) is Required !!!"),
  subSchemePrefix: yup.string().required("Sub Scheme Prefix is Required !!!"),
  subSchemeNo: yup.string().required("Sub Scheme No. is Required !!!"),
  mainSchemeKey: yup.string().required("Main Scheme is Required !!!"),
});

export default schema;
