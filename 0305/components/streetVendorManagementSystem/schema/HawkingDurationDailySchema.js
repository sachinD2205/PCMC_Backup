import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let HawkingDurationDailySchema = yup.object().shape({
  hawkingDurationDailyPrefix: yup
    .string()
    .required(<FormattedLabel id="hawkingDurationDailyPrefixValidation" />),
  hawkingDurationDailyPrefixMr: yup
    .string()
    .required(<FormattedLabel id="hawkingDurationDailyPrefixValidation" />),
  fromDate: yup
    .date()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  hawkingDurationDailyFrom: yup
    .date()
    .required(<FormattedLabel id="hawkingDurationDailyFromValidation" />)
    .typeError("please enter valid time/कृपया वैध वेळ प्रविष्ट करा !!!"),
  hawkingDurationDailyTo: yup
    .date()
    .required(<FormattedLabel id="hawkingDurationDailyToValidation" />)
    .typeError("please enter valid time/कृपया वैध वेळ प्रविष्ट करा !!!"),
  businessType: yup.string().required(<FormattedLabel id="businessTypeValidation" />),
  businessSubType: yup.string().required(<FormattedLabel id="businessSubTypeValidation" />),
});

export default HawkingDurationDailySchema;
