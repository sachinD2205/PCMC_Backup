import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  // castMasterPrefix: yup.string().required("Cast Master Prefix is Required !!!"),

  religion: yup.string().required("Please Choose Religion !!!"),

  cast: yup
    .string()
    .required("Department Name is Required !!!")
    .matches(/^[aA-zZ\0-9\s]+$/, "Only alphabets are allowed for this field"),
  castMr: yup
    .string()
    .required("Department Name(Mr) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default schema;
