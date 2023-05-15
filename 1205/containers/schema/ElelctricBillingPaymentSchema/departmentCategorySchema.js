import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  departmentCategory: yup.string().required("Department Category is Required !!!"),

  departmentCategoryMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("विभाग श्रेणी आवश्यक आहे !!!"),
});

export default schema;