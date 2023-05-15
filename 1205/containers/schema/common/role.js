import * as yup from "yup";

let schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
    .required("Service Name is Required !!!"),

  nameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
    .required("Service Name is Required !!!"),

  // rolePrefix: yup.string().required(" Role Prefix is Required"),
});

export default schema;
