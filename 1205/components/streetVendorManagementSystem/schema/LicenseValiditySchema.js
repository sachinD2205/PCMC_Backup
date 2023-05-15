import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let LicenseValiditySchema = yup.object().shape({
  licenseValidityPrefix: yup.string().required(<FormattedLabel id="licenseValidityPrefixValidation" />),
  licenseValidityPrefixMr: yup.string().required(<FormattedLabel id="licenseValidityPrefixMrValidation" />),
  fromDate: yup
    .date()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  hawkerType: yup.string().required(<FormattedLabel id="hawkerTypeValidationT" />),
  licenseValidity: yup.string().required(<FormattedLabel id="licenseValidityValidation" />),
  // licenseValidityMr: yup.string().required(<FormattedLabel id="licenseValidityMrValidation" />),
  // toDate
  //remark
});

export default LicenseValiditySchema;
