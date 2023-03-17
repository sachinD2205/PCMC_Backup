import * as yup from "yup";

let Schema = yup.object().shape({
  designation: yup.string().required(" Designation is Required !!"),
  designationMr:yup.string().required(" Designation(Mr) is Required !!"),
  description: yup.string().required("Description is Required !!!"),
});

export default Schema;
