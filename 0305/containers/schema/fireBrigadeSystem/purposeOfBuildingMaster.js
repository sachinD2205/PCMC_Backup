import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  buildingPurpose: yup.string().required("Building Purpose is Required !!!"),
});

export default Schema;
