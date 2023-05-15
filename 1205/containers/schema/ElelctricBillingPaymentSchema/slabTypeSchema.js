import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  slabType: yup.string().required("Slab Type is Required !!!"),

  slabTypeMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    'Must be only marathi characters/ फक्त मराठी शब्द',
  ).required("स्लॅब प्रकार आवश्यक आहे !!!"),
});

export default schema;