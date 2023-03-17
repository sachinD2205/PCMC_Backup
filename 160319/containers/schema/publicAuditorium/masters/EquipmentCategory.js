import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  equipmentCategoryName: yup.string().required("Equipment category name is Required !!!"),
})

export default Schema
