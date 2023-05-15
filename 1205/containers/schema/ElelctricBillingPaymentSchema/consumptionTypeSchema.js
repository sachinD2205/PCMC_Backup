import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  consumptionType: yup.string().required("Consumption Type is Required !!!"),

  consumptionTypeMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("उपभोग प्रकार आवश्यक आहे !!!"),
});

export default schema;