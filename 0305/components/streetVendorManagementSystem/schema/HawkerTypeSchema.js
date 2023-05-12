import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let HawkerTypeSchema = yup.object().shape({
  hawkerTypePrefix: yup.string().required(<FormattedLabel id="hawkerTypePrefixValidation" />),
  hawkerTypePrefixMr: yup.string().required(<FormattedLabel id="hawkerTypePrefixMrValidation" />),
  fromDate: yup
    .date()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  hawkerType: yup.string().required(<FormattedLabel id="hawkerTypeValidation" />),
  hawkerTypeMr: yup.string().required(<FormattedLabel id="hawkerTypeMrValidation" />),
});

export default HawkerTypeSchema;
