import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  auditoriumName: yup.string().required("Auditorium name is Required !!!"),
  shift: yup.string().required("Shift is Required !!!"),
  slotDescription: yup.string().required("Slot Description is Required !!!"),
  slotFrom: yup.string().nullable().required("Event time from is Required !!!"),
  slotTo: yup.string().nullable().required("Event time to is  Required !!!"),
});

export default Schema;
