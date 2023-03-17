import * as yup from 'yup'

// schema - validation
let schema = yup.object().shape({
  studyCenter: yup.string().required('Library name is Required !!!'),
  shelfNo: yup.string().nullable().required('Shelf No. is Required !!!'),
  shelfCatlogSection: yup
    .string()
    .required('Shelf Catlog Section is Required !!!'),

  remark: yup.string().required('Remark is Required !!!'),
})

export default schema
