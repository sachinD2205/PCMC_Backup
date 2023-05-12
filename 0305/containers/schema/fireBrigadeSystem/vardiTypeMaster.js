import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  vardiName: yup.string().required("Vardi Name is Required !!!"),
});

export default Schema;
