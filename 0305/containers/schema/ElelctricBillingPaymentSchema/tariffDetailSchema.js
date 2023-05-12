import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  // caseMainType: yup.number().required("Case Type is Required !!!"),
  // courtName: yup.string().nullable().required("Court Name is Required !!!"),
  // area: yup.string().required("Area is Required !!!"),
  // roadName: yup.string().required("Road Name is Required !!!"),
  // landmark: yup.string().required("Landmark is Required !!!"),
  // city: yup.string().required("City is Required !!!"),
  // pinCode: yup.number().nullable().required("Pin Code is Required !!!"),
});

export default schema;

