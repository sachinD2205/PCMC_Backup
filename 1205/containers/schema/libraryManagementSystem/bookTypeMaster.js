import * as yup from 'yup'

// schema - validation
let schema = yup.object().shape({
  bookClassification: yup
    .string()
    .required('Book Classification is Required !!!'),
  bookCategory: yup.string().required('Book Category is Required !!!'),
  bookSubCategory: yup.string().required('Book Sub Category is Required !!!'),
  language: yup.string().required('Language is Required !!!'),
  bookName: yup.string().required('Book Name is Required !!!'),
  publication: yup.string().required('Publication is Required !!!'),
  author: yup.string().required('Author is Required !!!'),
  bookEdition: yup.string().required('Book Edition is Required !!!'),
  bookPrice: yup.string().required('Book Price is Required !!!'),
  totalBookCopy: yup.string().required('Total Books Copy is Required !!!'),
  shelfNo: yup.string().required('Shelf Number is Required !!!'),
  shelfCatlogSection: yup
    .string()
    .required('Shelf Catlog Number is Required !!!'),
  barcode: yup.string().required('Barcode is Required !!!'),
})

export default schema
