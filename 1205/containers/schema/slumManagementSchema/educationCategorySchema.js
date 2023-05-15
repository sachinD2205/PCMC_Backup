import * as yup from "yup";

// schema - validation
let educationCategorySchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  educationCategoryPrefix: yup.string().required("Education Category Prefix is Required"),
  // remarks: yup.string().required("Remark is Required"),
  educationCategory: yup.string().required("Education Category is Required"),
  educationCategoryMr: yup.string().required("Education Category (marathi) is Required"),
  stream:yup.string().required("Stream on is Required"),
  std:yup.string().required("Std on is Required"),
});

export default educationCategorySchema;