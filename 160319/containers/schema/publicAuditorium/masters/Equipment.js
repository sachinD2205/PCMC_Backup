import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  equipmentName: yup.string().required("Equipment name is Required !!!"),
  equipmentCategory: yup.string().required("Equipment Category is Required !!!"),
})

export default Schema
