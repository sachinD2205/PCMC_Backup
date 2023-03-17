import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  businessCategoryPrefix: yup.string().required("Business Category Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // toDate: yup.string().nullable().required(" toDate is Required !!!"),
  businessName: yup.string().required("Business Name is Required !!!"),
  // subBusinessType: yup.string().nullable().required("Sub Business Type is Required !!!"),
});

export default schema;
