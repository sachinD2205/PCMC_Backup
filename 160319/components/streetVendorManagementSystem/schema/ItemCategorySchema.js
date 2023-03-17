import * as yup from "yup";

// schema - validation
let ItemCategorySchema = yup.object().shape({
  itemCategoryPrefix: yup
    .string()
    .required("Item Category Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  itemCategory: yup.string().required("Item Category is Required !!!"),
});

export default ItemCategorySchema;

//  toDate: yup
//     .date("toDate")
//     .min(yup.ref("fromDate"), `To Date is must be Greter than From Date !!!`),
