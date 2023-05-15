import * as yup from "yup";

let Schema = yup.object().shape({
  newsPaperGroupKey: yup.string().required("Please Select News Paper Group !!!"),
  newsPaperSubGroupKey: yup.string().required("Please Select News Paper Sub Group !!!"),
  newsPaperLevel: yup.string().required("Please Select News Paper Level !!!"),
  newsPaper: yup.string().required("Please Select NewsPaper !!!"),
  standardFormatSize: yup.string().required("Standard Format Size is Required !!!"),
});

export default Schema;
