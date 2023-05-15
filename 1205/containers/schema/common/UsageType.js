import * as yup from "yup";

let schema = yup.object().shape({
  // usagePrefix: yup.string().required("Usage Type Prefix is Required !!!"),
  // fromDate: yup.string().required("From dateis Required !!!"),
  // toDate: yup.string().required("To date is Required !!!"),
  usageType: yup.string().required("Usage Type is Required !!!"),
  department: yup.string().nullable().required("Department is Required !!!"),
});

export default schema;
