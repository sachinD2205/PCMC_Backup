import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  pinCode:yup.string().required("Pin Code is Required !!!").matches(/^\d{6}$/, "Pin code should be 6 digits"),
  pinCodeMr:yup.string().required("Pin Code Mr is Required !!!"),
  pinCodePrefix:yup.string().required("PinCode Prefix is Required !!!")
});

export default schema;
