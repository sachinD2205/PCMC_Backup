import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let caseDetailsSchema = yup.object().shape({
    courtCaseNumber: yup.string().required(<FormattedLabel id="selectCourtCaseNumber" />),

    // courtName
    court: yup.string().required(<FormattedLabel id="selectCourtName" />),

    // caseMainType
    caseType: yup.string().required(<FormattedLabel id="selectCaseType" />),
    
    // filingDate
    filingDate: yup
    .date()
    .typeError(<FormattedLabel id="selectDate" />)
    .required(),



    // filedBy
    filedBy: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    ).required(<FormattedLabel id="fnameEn" />),


    // filedByMr

    filedByMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="filedByMr" />),

});

export let transferDetailsSchema = yup.object().shape({
  // transferFromAdvocate
  transferFromAdvocate: yup.string().required(<FormattedLabel id="selectAdvocateName" />),

  // transferToAdvocate
  transferToAdvocate: yup.string().required(<FormattedLabel id="selectAdvocateName" />),

  // fromDate
  fromDate: yup
  .date()
  .typeError(<FormattedLabel id="selectDate" />)
  .required(),

  // toDate
  toDate: yup
  .date()
  .typeError(<FormattedLabel id="selectDate" />)
  .required(),

  // newAppearnceDate
  newAppearnceDate: yup
  .date()
  .typeError(<FormattedLabel id="selectDate" />)
  .required(),

  // remark
  remark: yup
  .string()
  .matches(
    /^[aA-zZ\s]+$/,
    "Must be only english characters / फक्त इंग्लिश शब्द "
  ).required(<FormattedLabel id="enterRemarks" />),

  // remarkMr
  remarkMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="enterRemarks" />),

 


});
