import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  usageType: yup.string().required("Usage Type is Required !!!"),

  usageTypeMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("वापर प्रकार आवश्यक आहे !!!"),
});

export default schema;