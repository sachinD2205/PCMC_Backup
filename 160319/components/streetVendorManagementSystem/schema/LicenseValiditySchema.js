import * as yup from "yup";

// schema - validation
let LicenseValiditySchema = yup.object().shape({
  hawkerType: yup.string().required("Hawker Type is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
});

export default LicenseValiditySchema;
