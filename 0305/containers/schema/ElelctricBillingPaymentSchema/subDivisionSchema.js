import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  divisionKey: yup.string().required("Division is Required !!!"),

  
  divisionKeyMR: yup
  .string()
  .matches(
    /^[\u0900-\u097F]*/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("विभाग आवश्यक आहे !!!"),

  subDivision: yup.string().required("Sub Division is Required !!!"),
  
  subDivisionMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("उपविभाग आवश्यक आहे !!!"),
});

export default schema;