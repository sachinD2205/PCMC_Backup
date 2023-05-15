import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";
// schema - validation
let schema = yup.object().shape({
  fromDate: yup.string().required(<FormattedLabel id="bachatgatFromDate" />),
  toDate: yup.string().required(<FormattedLabel id="bachatgatToDate" />),
  subSchemeName: yup.string().required(<FormattedLabel id="subSchemeNameReq"/>),
  subSchemeNameMr: yup.string().required(<FormattedLabel id="subSchemeNameMrReq"/>),
  subSchemePrefix: yup.string().required(<FormattedLabel id="subSchemePrefReq"/>),
  subSchemeNo: yup.string().required(<FormattedLabel id="subSchemeNoReq"/>),
  mainSchemeKey: yup.string().required(<FormattedLabel id="mainSchemeReq"/>),
});

export default schema;
