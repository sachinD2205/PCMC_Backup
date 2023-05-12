import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({

    // hodRemarkEn
    // hodRemarkEn: yup
    // .string()
    // .matches(
    //   // /^[aA-zZ\s]*$/,
    //   /^[a-zA-Z0-9 ]*$/,
 
    //   'Must be only english characters / फक्त इंग्लिश शब्द ',
    // ).required(<FormattedLabel id="enterOpinion" />),

    // hodRemarkMr
    // hodRemarkMr: yup
    // .string()
    // .matches(
    //   // /^[\u0900-\u097F\s]*$/,
    //   /^[\u0900-\u097F0-9\s]*$/,

    //   'Must be only marathi characters/ फक्त मराठी शब्द',
    // )
    // .required(<FormattedLabel id="enterOpinion" />),

    // opinionSubmisionDate
      
    opinionSubmisionDate: yup
  .date()
  .typeError(<FormattedLabel id="selectDate" />).required(<FormattedLabel id="opinionSubmissionDate" />),

//   clerkRemarkEn

clerkRemarkEn: yup
.string()
.matches(
  // /^[aA-zZ\s]*$/,
  /^[a-zA-Z0-9 ]*$/,

  'Must be only english characters / फक्त इंग्लिश शब्द ',
).required(<FormattedLabel id="enterOpinion" />),


// clerkRemarkMr

clerkRemarkMr: yup
.string()
.matches(
  // /^[\u0900-\u097F]*/,
  /^[\u0900-\u097F0-9\s]*$/,

  'Must be only marathi characters/ फक्त मराठी शब्द',
)
.required(<FormattedLabel id="enterOpinion" />),

  









});

export default schema;
