import * as yup from "yup";

let schema = yup.object().shape({
  // department: yup.string().required("Please select a application name."),
  application: yup.string().required("Please select a application name."),
  zoneNumber: yup.string().required("Please select a zone number."),
  wardNumber: yup.string().required("Please enter a ward number."),
  officeLocation: yup.string().required("Please enter a office location number."),
});

export default schema;

