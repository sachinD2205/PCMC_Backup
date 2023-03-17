import * as yup from "yup";

// schema - validation
let subUsageTypeSchema = yup.object().shape({
  usageTypeKey: yup.string().required("Usage Type is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  subUsageTypePrefix: yup.string().required("Sub usage type Prefix is Required"),
  // remarks: yup.string().required("Remark is Required"),
  subUsageType: yup.string().required(" Sub usage type is Required"),
  subUsageTypeMr: yup.string().required("Sub usage type (marathi) is Required"),
});

export default subUsageTypeSchema;