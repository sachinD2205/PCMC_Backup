

import * as yup from "yup";

// schema - validation
let factorSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  factorPrefix: yup.string().required("Factor Prefix is Required"),
  // remarks: yup.string().required("Remark is Required"),
  factorName: yup.string().required("Factor is Required"),
  factorNameMr: yup.string().required("Factor (marathi) is Required"),
  applicableOn:yup.string().required("Applicable on is Required"),
});

export default factorSchema;