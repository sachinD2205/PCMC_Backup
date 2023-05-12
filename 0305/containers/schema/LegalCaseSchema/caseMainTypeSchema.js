import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({

  
  caseMainType: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="caseTypeEn" />),


    caseMainTypeMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F\s]*$/,
      'Must be only marathi characters/ फक्त मराठी शब्द',
    )
    .required(<FormattedLabel id="caseTypeMr" />),



  
});

export default schema;