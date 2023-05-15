import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  // // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // // toDate: yup.string().nullable().required("To Date is Required !!!"),
  // wardPrefix: yup.string().required("Ward Prefix is Required"),
  // wardPrefixMr: yup.string().required("wardPrefixMr is Required"),
  // wardName: yup.string().required("Ward Name is Required"),
  // wardAddress: yup.string().required("Ward Address is Required"),
});

export default schema;
