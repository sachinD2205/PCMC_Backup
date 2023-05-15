import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  typeName: yup.string().required(<FormattedLabel id="VchargeType" />),
  typeNameMr: yup.string().required(<FormattedLabel id="VchargeTypeMr" />),
});

export default Schema;
