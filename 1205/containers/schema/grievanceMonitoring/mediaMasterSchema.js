import * as yup from "yup";

// schema - validation
let mediaMasterSchema = yup.object().shape({
  mediaName: yup.string().required("Media Name is Required !!!"),
  mediaNameMr: yup.string().required("Media Name(मराठी) is Required !!!"),
});

export default mediaMasterSchema;
