import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  gISID: yup
    .string()
    .required("required")
    .matches(/^[0-9]+$/, "must be number"),
  fireStationName: yup.string().required("Fire Station Name is Required !!!"),
  zone: yup.number().required().typeError("Zone is Required !!!"),
});

export default Schema;
