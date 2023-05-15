import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";
// schema - validation
let schema = yup.object().shape({
  fromDate: yup.string().required(<FormattedLabel id="bachatgatFromDate" />),
  toDate: yup.string().required(<FormattedLabel id="bachatgatToDate" />),
  schemeName: yup.string().required(<FormattedLabel id="schemeNameReq" />),
  schemeNameMr: yup.string().required(<FormattedLabel id="schemeNameReq"/>),
  schemePrefix: yup.string().required(<FormattedLabel id="schemeNamePrefix"/>),
  schemeNo: yup.string().required(<FormattedLabel id="schemeNoReq"/>),

  // bgCategoryMr: yup.string().required(<FormattedLabel id="bgCategoryMrValidation" />),
  // bgCategoryName: yup.string().required(<FormattedLabel id="bgCategoryNameValidation" />),
});

export default schema;
