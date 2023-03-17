import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  msedclCategory: yup.string().required("MSEDCL Category is Required !!!"),

  msedclCategoryMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("MSEDCL श्रेणी आवश्यक आहे !!!"),
});

export default schema;