import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  billingCycle: yup.string().required("Billing Cycle is Required !!!"),

  billingCycleMr: yup
  .string()
  .matches(
    // /^[\u0900-\u097F]+/ /^[0-9]+$/,
    /^[\u0900-\u097F\d]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("बिलिंग सायकल आवश्यक आहे !!!"),
});

export default schema;