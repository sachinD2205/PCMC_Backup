import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  typeName: yup.string().required(<FormattedLabel id="VdurationType" />),
  typeNameMr: yup.string().required(<FormattedLabel id="VdurationTypeMr" />),
});

export default Schema;
