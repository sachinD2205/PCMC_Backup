import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  typeOfBusiness: yup.string().required("Type Of Business is Required !!!"),
});

export default Schema;
