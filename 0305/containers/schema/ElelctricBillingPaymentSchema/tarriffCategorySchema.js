import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  tariffCategory: yup.string().required("Tariff Category is Required !!!"),

  tariffCategoryMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("दर श्रेणी आवश्यक आहे !!!"),
});

export default schema;