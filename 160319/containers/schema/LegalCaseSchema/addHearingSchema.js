import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let addHearingSchema = yup.object().shape({
  // caseNumber
  caseNumber: yup.string().required(<FormattedLabel id="courtCaseNo" />),
  // caseMainType
  caseMainType: yup.string().required(<FormattedLabel id="caseType" />),
  // filingDate
  filingDate: yup
  .date()
  .typeError(<FormattedLabel id="selectDate" />).required(<FormattedLabel id="filingDate" />),
  // hearingDate
    hearingDate: yup
  .date()
  .typeError(<FormattedLabel id="selectDate" />).required(<FormattedLabel id="hearingDate" />),
  // caseStatus
  caseStatus: yup
  .date()
  .typeError(<FormattedLabel id="selectDate" />).required(<FormattedLabel id="caseStatus" />),
  // caseStages
  caseStage: yup
  .date()
  .typeError(<FormattedLabel id="selectDate" />).required(<FormattedLabel id="caseStagesEn" />),
// nextHearingDate
// interimOrderDate
// finalOrderDate
  // remark
  remark: yup
  .string()
  .matches(
    /^[aA-zZ\s]+$/,
    "Must be only english characters / फक्त इंग्लिश शब्द "
  )
  .required(<FormattedLabel id="remarksEn" />),
 // remarksMr
  remarkMr: yup
  .string()
  .matches(
    /^[\u0900-\u097F]+/,
    "Must be only marathi characters/ फक्त मराठी शब्द"
  )
  .required(<FormattedLabel id="remarksMr" />),
});

