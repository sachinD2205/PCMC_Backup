import * as yup from "yup";

let Schema = yup.object().shape({
  newsPaperLevel: yup.string().required("News Type in English is Required !!!"),
  // newsPapers: yup.string().required("News Type in Marathi is Required !!!"),
  rotationGroup: yup.string().required("News Type in English is Required !!!"),
  rotationSubGroup: yup.string().required("News Type in Marathi is Required !!!"),
});

export default Schema;
