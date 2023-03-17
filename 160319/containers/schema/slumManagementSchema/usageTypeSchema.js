import * as yup from "yup";

// schema - validation
let usageTypeSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  usageTypePrefix: yup.string().required("Usage type Prefix is Required"),
  // remarks: yup.string().required("Remark is Required"),
  usageType: yup.string().required("Usage type is Required"),
  usageTypeMr: yup.string().required("Usage type (marathi) is Required"),
});

export default usageTypeSchema;