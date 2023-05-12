import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  pinCode: yup
    .string()
    .required("Pin Code is Required !!!")
    .matches(/^\d{6}$/, "Pin code should be 6 digits"),

  pinCodeMr: yup
    .string()
    .required("Pin Code (In marathi) is Required !!!")
    .typeError("only numbers are allowed"),
  // .matches(/^\d{६}$/, "Pin code should be 6 digits"),
  // pinCodePrefix:yup.string().required("PinCode Prefix is Required !!!")
});

export default schema;
