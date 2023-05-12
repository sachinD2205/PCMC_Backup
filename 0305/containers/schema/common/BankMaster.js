import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  bankName: yup
    .string()
    .required("Bank Name is Required !!!")
    .matches(/^[aA-zZ\0-9\s]+$/, "Only alphabets are allowed for this field"),
  bankNameMr: yup
    .string()
    .required("Bank Name (In marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),

  branchName: yup.string().required("Branch Name is Required !!!"),
  branchAddress: yup.string().required("branchAddress is Required !!!"),

  ifscCode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("IFSC Code is Required"),

  micrCode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("MICR Code is Required"),

  contactDetails: yup
    .string()
    .required("contactDetails is Required !!!")
    .matches(/^\d{10}$/, "contactDetails should be 10 digits"),
});

export default schema;
