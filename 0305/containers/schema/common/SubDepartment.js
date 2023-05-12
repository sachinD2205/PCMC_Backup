import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  subDepartment: yup.string().required(" Sub Deaprtment is Required !!"),
  subDepartmentMr: yup.string().required(" Sub Deaprtment(Mr) is Required !!"),
  department: yup
    .string()
    .nullable()
    .required("Department Name is Required !!!"),
  description: yup.string().required(" Description is Required !!"),
});

export default Schema;
