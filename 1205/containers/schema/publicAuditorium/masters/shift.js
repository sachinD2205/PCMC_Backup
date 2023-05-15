import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  timeSlot: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1, "Shift hours must be at least 1 number")
    .max(2, "Shift hours not valid on above 2 number")
    .required("Shift hours required"),
  shift: yup.string().required("Shift name is Required !!!"),
});

export default Schema;
