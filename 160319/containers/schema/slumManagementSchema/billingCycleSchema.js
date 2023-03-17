import * as yup from "yup";

// schema - validation
let billingCycleSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  billingCyclePrefix: yup.string().required("Billing Cycle is Required"),
  // remarks: yup.string().required("Remark is Required"),
  billingCycle: yup.string().required("Billing Cycle is Required"),
  billingCycleMr: yup.string().required("Billing Cycle (marathi) is Required"),
//   applicableOn:yup.string().required("Applicable on is Required"),
});

export default billingCycleSchema;