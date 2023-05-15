import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // shiftName: yup.string().required("Shift Name is Required !!!"),
  // shiftStartTime: yup
  //   .date()
  //   .required()
  //   .typeError("Shift Start Time is Required !!!"),
  // shiftEndTime: yup
  //   .date()
  //   .required()
  //   .typeError("Shift End Time is Required !!!"),
  // nameOfCFO: yup.string().required("Name Of CFO is Required !!!"),
  // nameOfSFO: yup.string().required("Name Of SFO is Required !!!"),
  // Employee: yup
  //   .string()
  //   .required("Name Of Other Employee is Required !!!"),
});

export default Schema;
