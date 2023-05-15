import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let Schema = yup.object().shape({
  rotationGroupName: yup.string().required("Enter rotation Group Name is Required !!!"),
  rotationGroupNameMr: yup.string().required("Enter rotation Group Name marathi is Required !!!"),
});

export default Schema;
