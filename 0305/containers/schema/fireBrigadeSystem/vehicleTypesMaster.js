import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  vehicleType: yup.string().required("Vehicle Type is Required !!!"),
});

export default Schema;
