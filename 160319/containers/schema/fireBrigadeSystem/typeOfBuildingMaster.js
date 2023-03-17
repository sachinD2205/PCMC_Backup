import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  typeOfBuilding: yup.string().required("Type Of Building is Required !!!"),
});

export default Schema;
