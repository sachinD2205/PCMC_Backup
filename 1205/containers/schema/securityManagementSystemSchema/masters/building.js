import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  buildingAddress: yup.string().required("Please Enter Building Address !!!"),
  buildingName: yup
    .string()
    .matches(/^[a-zA-Z0-9]*$/, "Building name must only contain letters, numbers")
    .required("Please Enter Building Name !!!"),
  buildingNumber: yup
    .string()
    .matches(/^[a-zA-Z0-9]*$/, "Building number must only contain letters, numbers")
    .required("Please Enter Employee Building Number !!!"),
  wardKey: yup.string().nullable().required("Please Select Ward Name !!!"),
  zoneKey: yup.string().nullable().required("Please Select Zone Name !!!"),
  departmentKey: yup.string().nullable().required("Please Select Department Name !!!"),
  latitude: yup.string().required("Please enter latitude !!!"),

  longitude: yup.string().required("Please enter longitude !!!"),
  // buildingFloor: yup.string().required("Please Enter Building Floor !!!"),
  buildingFloor: yup
    .string()
    .matches(/^[a-zA-Z0-9]*$/, "Building floor must only contain letters, numbers")
    .required("Please Enter Building Floor !!!"),
});

export default Schema;
