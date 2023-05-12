
import * as yup from "yup";

// schema - validation
let flagMasterSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  setFor: yup.string().required("Set for is Required"),
  // remarks: yup.string().required("Remark is Required"),
  flagName: yup.string().required("Flag Name is Required"),
  flagNameMr: yup.string().required("Flag Name (marathi) is Required"),
  applicableOn:yup.string().required("Applicable on is Required"),
});

export default flagMasterSchema;