import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  
  opinionRequestDate: yup
  .date()
  .typeError(<FormattedLabel id="selectDate" />).required(<FormattedLabel id="opinionRequestDate" />),


  // officeLocation
  officeLocation: yup.string().required(<FormattedLabel id="selectLocation" />),


  concenDeptId: yup.string().required(<FormattedLabel id="selectDepartmet" />),

  // opinionSubject
  opinionSubject: yup
  .string()
  .matches(
    /^[aA-zZ\s]*$/,
    'Must be only english characters / फक्त इंग्लिश शब्द ',
  ).required(<FormattedLabel id="enterOpinionSubject" />),






});

export default schema;
