import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  phaseType: yup.string().required("Phase Type is Required !!!"),

  phaseTypeMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("टप्पा प्रकार आवश्यक आहे !!!"),
});

export default schema;