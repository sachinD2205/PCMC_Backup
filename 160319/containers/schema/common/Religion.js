import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  
       religionMr:yup.string().required("Religion Name Mr is Required !!!"),
      religion: yup.string().required("Religion Name is Required !!!"),
});

export default schema;