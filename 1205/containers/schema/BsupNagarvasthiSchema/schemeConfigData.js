import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  informationTitle: yup.string().required("Informatrion Title is Required !!!"),
  informationTitleMr: yup.string().required("Informatrion Title (Marathi) is Required !!!"),
  informationType: yup.string().required("Informatrion Type is Required !!!"),


});

export default schema;
