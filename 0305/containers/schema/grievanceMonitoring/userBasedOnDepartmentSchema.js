import * as yup from "yup";

// schema - validation
let userBasedOnDepartmentSchema = yup.object().shape({
  areaName: yup.string().required("This field is required!"),
  areaKey: yup.string().required("This field is required!"),
  zoneKey: yup.string().required("This field is required!"),
  wardKey: yup.string().required("This field is required!"),
  deptKey: yup.string().required("This field is required!"),
  userKey: yup.string().required("This field is required!"),
  level: yup.string().required("This field is required!"),
});

export default userBasedOnDepartmentSchema;
