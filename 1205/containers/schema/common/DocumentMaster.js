import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  application: yup.string().required("Module name is Required !!!"),
  service: yup.string().required("Service name is Required !!!"),
  documentChecklistEn: yup.string().required("Document checklist is Required !!!"),
  typeOfDocument: yup.string().required("Type of master is Required !!!"),
});

export default schema;