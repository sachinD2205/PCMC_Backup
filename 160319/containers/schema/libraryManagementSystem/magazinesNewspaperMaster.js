import * as yup from 'yup'

// schema - validation
let schema = yup.object().shape({
  magazinesName: yup
    .string()
    .nullable()
    .required('Newspaper Name is Required !!!'),
  magazinesSubCategoryName: yup
    .string()
    .required('Magazines/Newspaper Sub Catagory Name is Required !!!'),
  supplierName: yup.string().required('Supplier Name is Required !!!'),
  contactNumber: yup.string().required('Contact Number is Required !!!'),
  language: yup.string().required('language is Required !!!'),
  remark: yup.string().required('Remark is Required !!!'),
})

export default schema
