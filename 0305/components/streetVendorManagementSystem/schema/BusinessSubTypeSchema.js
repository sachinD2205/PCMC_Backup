import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let BusinessSubTypeSchema = yup.object().shape({
  businessSubTypePrefix: yup.string().required(<FormattedLabel id="businessSubTypePrefixEnValidation" />),
  businessSubTypePrefixMr: yup.string().required(<FormattedLabel id="businessSubTypePrefixMrValidation" />),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="fromDateValidation" />),
  businessTypeId: yup.string().required(<FormattedLabel id="businessTypeValidation" />),
  businessSubType: yup.string().required(<FormattedLabel id="businessSubTypeEnValidation" />),
  businessSubTypeMr: yup.string().required(<FormattedLabel id="businessSubTypeMrValidation" />),
});

export default BusinessSubTypeSchema;
