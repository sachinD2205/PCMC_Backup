import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  castCategoryPrefix: yup
    .string()
    .required("Cast Category Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  castCategory: yup.string().required("Cast Category is Required !!!"),
});

export default schema;
