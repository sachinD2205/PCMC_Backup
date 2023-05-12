import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // distanceFromMainFireStation: yup
  //   .number()
  //   .required()
  //   .typeError("Must be Number"),
  // distanceFromSubFireStation: yup.number().required("Must be number"),
  // constructionLoss: yup.number().required("Must be number"),
  // businessSubTypePrefix: yup
  //   .string()
  //   .required("Business Sub Type Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // businessType: yup.string().required("Business Type is Required !!!"),
  // businessSubType: yup.string().required("Sub Type Business is Required !!!"),
});

export default Schema;
