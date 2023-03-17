import * as yup from "yup";

// schema - validation
let ItemSchema = yup.object().shape({
  itemPrefix: yup.string().required("Item Master Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  itemCategory: yup.string().required("Iteam Category is Required !!!"),
  item: yup.string().required("item is Required !!!"),
});

export default ItemSchema;
