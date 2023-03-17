import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  buildingAddress: yup.string().required("Please Enter Building Address !!!"),
  buildingName: yup.string().required("Please Enter Building Name !!!"),
  buildingNumber: yup
    .string()
    .required("Please Enter Employee Building Number !!!"),
  wardKey: yup.string().nullable().required("Please Select Ward Name !!!"),
  zoneKey: yup.string().nullable().required("Please Select Zone Name !!!"),
  departmentKey: yup
    .string()
    .nullable()
    .required("Please Select Department Name !!!"),
  buildingFloor: yup.string().required("Please Enter Building Floor !!!"),
});

export default Schema;
