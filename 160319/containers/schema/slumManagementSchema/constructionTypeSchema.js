import * as yup from "yup";

// schema - validation
let constructionTypeSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  constructionTypePrefix: yup.string().required("Construction type Prefix is Required"),
  // remarks: yup.string().required("Remark is Required"),
  constructionType: yup.string().required("Construction type is Required"),
  constructionTypeMr: yup.string().required("Construction type (marathi) is Required"),
});

export default constructionTypeSchema;