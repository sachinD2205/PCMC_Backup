import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  meterStatus: yup.string().required("Meter Status is Required !!!"),

  meterStatusMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("मीटरची स्थिती आवश्यक आहे !!!"),
});

export default schema;