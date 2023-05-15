import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // attachedFile: yup
  //   .mixed()
  //   .required("You need to provide a File")
  //   .test("fileSize", "The file is too large", (value) => {
  //     return value && value[0].size <= 2000000;
  //   }),
  //   businessSubTypePrefix: yup
  //     .string()
  //     .required("Business Sub Type Prefix is Required !!!"),
  //   fromDate: yup.string().nullable().required("From Date is Required !!!"),
  //   businessType: yup.string().required("Business Type is Required !!!"),
  //   businessSubType: yup.string().required("Sub Type Business is Required !!!"),
});

export default Schema;
