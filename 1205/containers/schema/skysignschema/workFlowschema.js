import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  // formTypePrefix: yup
  //   .string()
  //   .required("Form Type  Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // toDate: yup.string().nullable().required("todate is Required !!!"),
  // formType: yup.string().required("Form Type  is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default schema;
