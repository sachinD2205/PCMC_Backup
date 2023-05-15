import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({


    // panelAdvocateOpinion

    // panelAdvocateOpinion: yup
    // .string()
    // .matches(
    //   /^[aA-zZ\s]*$/,
    //   'Must be only english characters / फक्त इंग्लिश शब्द ',

    panelAdvocateOpinion: yup
      .string()
      .matches(
        // /^[aA-zZ\s]*$/,
      /^[a-zA-Z0-9 ]*$/,

        'Must be only english characters / फक्त इंग्लिश शब्द ',
      ),


      // panelAdvocateOpinionMr
      panelAdvocateOpinionMr: yup
      .string()
      .matches(
        // /^[\u0900-\u097F\s]*$/,
      /^[\u0900-\u097F0-9\s]*$/,

        'Must be only marathi characters/ फक्त मराठी शब्द',
        ),

        // reportTitleAdvocateOpinion
        reportTitleAdvocateOpinion: yup
      .string()
      .matches(
        // /^[aA-zZ\s]*$/,
      /^[a-zA-Z0-9 ]*$/,

        'Must be only english characters / फक्त इंग्लिश शब्द ',
      ),

      // reportTitleAdvocateOpinionMr
      reportTitleAdvocateOpinionMr: yup
      .string()
      .matches(
        // /^[\u0900-\u097F\s]*$/,
      /^[\u0900-\u097F0-9\s]*$/,

        'Must be only marathi characters/ फक्त मराठी शब्द',
        ),
  





});

export default schema;
