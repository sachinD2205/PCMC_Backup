import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // courtNo: yup.number().required("Court No is Required !!!"),
  // courtName: yup.string().nullable().required("Court Name is Required !!!"),
  // area: yup.string().required("Address is Required !!!"),
  // roadName: yup.string().required("Road Name is Required !!!"),
  // landmark: yup.string().required("Landmark is Required !!!"),
  // city: yup.string().required("City is Required !!!"),
  // pinCode: yup.number().nullable().required("Pin Code is Required !!!"),
});

export default Schema;
