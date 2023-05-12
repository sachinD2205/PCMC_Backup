import * as yup from "yup";

let Schema = yup.object().shape({
  newsPaperLevel: yup.string().required("News Paper Level in English is Required !!!"),
  newsPaperLevelMr: yup.string().required("News Paper Level in Marathi is Required !!!"),
});

export default Schema;
