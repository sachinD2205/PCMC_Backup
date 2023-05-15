import * as yup from "yup";

let Schema = yup.object().shape({
  priority: yup.string().required("Priority in English is Required !!!"),
  priorityMr: yup.string().required("Priority in Marathi is Required !!!"),
});

export default Schema;
