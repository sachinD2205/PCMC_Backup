import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  buildingKey: yup.string().required("Please Enter Building Name !!!"),
  // wardKey: yup.string().required("Please Select ward !!!"),
  // zoneKey: yup.string().required("Please Select zone !!!"),
  departmentKey: yup.string().required("Please Select department !!!"),
  // departmentOnOffStatus: yup.string().required("Please Enter Whom to meet !!!"),
  // lightOnOffStatus: yup.string().required("Please Select priority !!!"),
  // fanOnOffStatus: yup.string().required("Please Enter Mobile Number !!!"),
  floor: yup.string().required("Please Select floor !!!"),
  presentEmployeeCount: yup
    .string()
    .required("Please Enter Present Employee Count !!!")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1, "Present Employee Count must be at least 1 number")
    .max(5, "Present Employee Count not valid on above 5 number"),
  checkupDateTime: yup.string().nullable().required("Checkup Date & Time is Required !!!"),
  // departmentOnOffStatus: yup.boolean(),
  // // .string().required("Selecting the gender field is required")
  // // .oneOf([0, 1]),
  // lightOnOffStatus: yup.boolean(),
  // fanOnOffStatus: yup.boolean(),
});

export default Schema;
