import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  // castMasterPrefix: yup.string().required("Cast Master Prefix is Required !!!"),
  
  religion: yup.string().required("Religion is Required !!!"),
  cast: yup.string().required("Cast Name(Eng) is Required !!!"),
  castMr: yup.string().required("Cast Name Mr is Required !!!"),
});

export default schema;
