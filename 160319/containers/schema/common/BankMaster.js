import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
   
  bankName: yup.string().required("Bank Name is Required !!!"),
  branchName: yup.string().required("Branch Name is Required !!!"),
  branchAddress:yup.string().required("branchAddress is Required !!!"),
  ifscCode:yup.string().required("IFSC Code is Required"),
  micrCode:yup.string().required("MICR Code is Required"),
  contactDetails: yup.string().required("contactDetails is Required !!!").matches(/^\d{10}$/, "contactDetails should be 10 digits"),

});

export default schema;
