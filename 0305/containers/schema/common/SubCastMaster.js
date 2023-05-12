import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  subCastPrefix: yup.string().required("Sub Cast Prefix is Required !!!"),
  
  religion: yup.string().required("Religion is Required !!!"),
  cast: yup.string().required("Cast is Required !!!"),
  subCast: yup.string().required("Sub Cast Category is Required !!!"),
});

export default schema;
