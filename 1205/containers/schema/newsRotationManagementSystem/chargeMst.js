import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let Schema = yup.object().shape({
  chargeTypePrefix: yup.string().required("Enter charge Type Prefix is Required !!!"),
  chargeName: yup.string().required("Enter charge Name english is Required !!!"),
  chargeNameMr: yup.string().required("Enter charge Name Marathi is Required !!!"),
  mapWithGlAccountCode: yup.string().required("map With Gl Account Code Required !!!"),
  remark: yup.string().required("Remark name is Required !!!"),
});

export default Schema;
