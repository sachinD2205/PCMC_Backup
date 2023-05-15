import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  reasonOfFire: yup.string().required("Type Of Building is Required !!!"),
});

export default Schema;
