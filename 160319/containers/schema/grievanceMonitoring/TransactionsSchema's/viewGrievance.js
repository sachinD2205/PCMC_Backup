import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  reply: yup.string().required("This field is Required !!!"),
})

export default Schema
