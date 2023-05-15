import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  equipmentNameEn: yup.string().required("Equipment name is Required !!!"),
  equipmentNameMr: yup.string().required("Equipment name in marathi is Required !!!"),
  equipmentCategory: yup.string().required("Equipment Category is Required !!!"),
})

export default Schema
