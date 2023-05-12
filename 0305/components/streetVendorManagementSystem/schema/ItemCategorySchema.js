import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let ItemCategorySchema = yup.object().shape({
  itemCategoryPrefix: yup.string().required(<FormattedLabel id="itemCategoryPrefixValidation" />),
  itemCategoryPrefixMr: yup.string().required(<FormattedLabel id="itemCategoryPrefixMrValidation" />),
  fromDate: yup
    .date()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  itemCategory: yup.string().required(<FormattedLabel id="itemCategoryValidation" />),
  itemCategoryMr: yup.string().required(<FormattedLabel id="itemCategoryMrValidation" />),
});

export default ItemCategorySchema;

//  toDate: yup
//     .date("toDate")
//     .min(yup.ref("fromDate"), `To Date is must be Greter than From Date !!!`),

//        itemCategoryPrefix: "",
// itemCategoryPrefixMr: "",
// fromDate: null,
// toDate: null,
// itemCategory: "",
// itemCategoryMr: "",
// remarks: "",
