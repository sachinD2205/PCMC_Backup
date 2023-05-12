import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  billingUnitNo: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Billing Unit is Required !!!"),

  billingUnitNoMr: yup
  .string()
  .matches(
    /^[0-9]+$/,
    'Must be only digits/ फक्त अंक असणे आवश्यक आहे',
  ).required("बिलिंग युनिट आवश्यक आहे !!!"),

  divisionName: yup.string().required("Division Name is Required !!!"),
  
  divisionNameMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("विभागाचे नाव आवश्यक आहे !!!"),
});

export default schema;