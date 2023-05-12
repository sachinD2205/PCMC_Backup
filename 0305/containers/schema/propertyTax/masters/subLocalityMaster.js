import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  administrativeZone: yup.string().required("This field is Required !!!"),
  circle: yup.string().required("This field is Required !!!"),
  circleGat: yup.string().required("This field is Required !!!"),
  locality: yup.string().required("This field is Required !!!"),
  subLocality: yup.string().required("This field is Required !!!"),
  fromDate: yup.string().nullable().required("This field is Required !!!"),
  toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema