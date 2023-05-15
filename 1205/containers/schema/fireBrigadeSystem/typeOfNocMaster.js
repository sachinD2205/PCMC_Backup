import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  nOCName: yup.string().required("Name Of NOC is Required !!!"),
});

export default Schema;
