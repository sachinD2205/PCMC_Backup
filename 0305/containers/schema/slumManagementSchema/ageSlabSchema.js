import * as yup from "yup";

// schema - validation
let ageSlabSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  ageSlabPrefix: yup.string().required("Age Slab is Required"),
  // remarks: yup.string().required("Remark is Required"),
  ageSlabName: yup.string().required("Age Slab Name is Required"),
  ageSlabNameMr: yup.string().required("Age Slab Name(marathi) is Required"),
  rangeOfAge:yup.string().required("Range of Age is Required"),
});

export default ageSlabSchema;