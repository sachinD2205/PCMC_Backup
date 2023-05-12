import * as yup from "yup";

// schema - validation
let totalLevelsAndDefaultDurationSchema = yup.object().shape({
  areaKey: yup.string().required("This field is required!"),
  zoneKey: yup.string().required("This field is required!"),
  wardKey: yup.string().required("This field is required!"),
  deptKey: yup.string().required("This field is required!"),
  totalLevels: yup.string().required("This field is required!"),
  areaName: yup.string().required("This field is required!"),
});

export default totalLevelsAndDefaultDurationSchema;
