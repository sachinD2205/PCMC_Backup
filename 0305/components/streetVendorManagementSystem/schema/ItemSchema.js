import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let ItemSchema = yup.object().shape({
  itemPrefix: yup.string().required(<FormattedLabel id="itemPrefixValidation" />),
  itemPrefixMr: yup.string().required(<FormattedLabel id="itemPrefixMrValidation" />),
  fromDate: yup
    .date()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  itemCategory: yup.string().required(<FormattedLabel id="itemCategoryValidationEn" />),
  item: yup.string().required(<FormattedLabel id="itemValidationEn" />),
  itemMr: yup.string().required(<FormattedLabel id="itemValidationMr" />),
  // remarks,
  // toDate,
  // remarksMr,
});

export default ItemSchema;
