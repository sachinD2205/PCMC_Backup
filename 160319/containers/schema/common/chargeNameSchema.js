import * as yup from "yup";

let schema = yup.object().shape({
    chargeNamePrefix: yup
    .string()
    .required("ChargeName Prefix is Required !!!"),
//   fromDate: yup.string().nullable().required("From Date is Required !!!"),
//   toDate: yup.string().nullable().required("To Date is Required !!!"),
  charge:yup.string().required("Bill Type is Required"),
});

export default schema;
