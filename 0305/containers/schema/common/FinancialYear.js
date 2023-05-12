import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
    financialYearPrefix: yup
    .string()
    .required("Financial Year Prefix is Required !!!"),
 
  // remark:yup.string().required("remark is Required !!!"),
  financialYear: yup.string().required("Financial Year  is Required !!!"),
});

export default schema;
