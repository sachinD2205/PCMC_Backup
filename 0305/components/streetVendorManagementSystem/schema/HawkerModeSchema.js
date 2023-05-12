import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let HawkerModeSchema = yup.object().shape({
  hawkerModePrefix: yup.string().required(<FormattedLabel id="hawkerModePrefixValidation" />),
  hawkerModePrefixMr: yup.string().required(<FormattedLabel id="hawkerModePrefixMrValidation" />),
  fromDate: yup
    .date()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  hawkerMode: yup.string().required(<FormattedLabel id="hawkerModeValidation" />),
  hawkerModeMr: yup.string().required(<FormattedLabel id="hawkerModeMrValidation" />),
  hawkerType: yup.string().required(<FormattedLabel id="hawkerTypeValidation" />),
});

export default HawkerModeSchema;
