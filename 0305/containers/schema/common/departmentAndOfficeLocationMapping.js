import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  //   department: yup.string().required("Department Name is Required !!!"),
  //   departmentMr:yup.string().required("Department Name(Mr) is Required !!!"),
  //   description: yup.string().required(" Description is Required !!"),
});

export default Schema;
