import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let BusinessTypeSchema = yup.object().shape({
  businessTypePrefix: yup.string().required(<FormattedLabel id="businessTypePrefixEnValidation" />),
  businessTypePrefixMr: yup.string().required(<FormattedLabel id="businessTypePrefixMrValidation" />),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="fromDateValidation" />),
  businessType: yup.string().required(<FormattedLabel id="businessTypeEnValidation" />),
  businessTypeMr: yup.string().required(<FormattedLabel id="businessTypeMrValidation" />),
});

export default BusinessTypeSchema;
