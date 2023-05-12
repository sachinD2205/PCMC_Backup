import * as yup from "yup";

let Schema = yup.object().shape({
  newsPaperGroupKey: yup.string().required("Please Select News Paper Group!!!"),
  newsPaperSubGroupKey: yup.string().required("Please Select News Paper Sub-Group!!!"),
  newsPaperLevel: yup.string().required("Please Select News Paper Level!!!"),
  newsPaperName: yup.string().required("Please Select News Paper!!!"),
  chargeType: yup.string().required("Please Select Charge Type!!!"),
  amount: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError()
    .required("Amount is Required !!!"),
});

export default Schema;
