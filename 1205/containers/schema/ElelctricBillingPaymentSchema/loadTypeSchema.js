import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  loadType: yup.string().required("Load Type is Required !!!"),

  loadTypeMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("लोड प्रकार आवश्यक आहे !!!"),
});

export default schema;