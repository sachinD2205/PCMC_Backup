import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  
  title: yup.string().required("Title is Required !!!"),
  titleMr: yup.string().required("Title Mr is Required !!!"),
});

export default schema;

// yup
//   .date("Expiration Date")
//   .nullable()
//   .min(
//     yup.ref("enteredDate"),
//     ({ min }) => `Expiration Date needs to be after Entered Date`,
//   );
