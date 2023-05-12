import * as yup from "yup";

let Schema = yup.object().shape({
  newsType: yup.string().required("News Type in English is Required !!!"),
  newsTypeMr: yup.string().required("News Type in Marathi is Required !!!"),
});

export default Schema;
