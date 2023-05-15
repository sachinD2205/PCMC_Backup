


import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let trnRtiApplicationSchema = yup.object().shape({
  applicantFirstName:yup.string().required(<FormattedLabel id="appliFirstNmReq"/>),
  applicantMiddleName:yup.string().required(<FormattedLabel id="appliMiddNmReq"/>),
  applicantLastName:yup.string().required(<FormattedLabel id="appliLastNmReq"/>),
  gender:yup.string().required(<FormattedLabel id="genderReq"/>),
  pinCode: yup.number().max(6).required(<FormattedLabel id="pincodeReq"/>),
  emailId: yup
    .string()
    .email(<FormattedLabel id="inCorrectMsg"/>)
    .required(<FormattedLabel id='emailReq'/>),
  contactDetails:yup.string().max(10).required(<FormattedLabel id='contactReq'/>),
  education: yup.string().required(<FormattedLabel id='educationReq' />),
  areaKey: yup.string().required(<FormattedLabel id="areaNmReq"/>),
  wardKey: yup.string().required(<FormattedLabel id="wardNmReq"/>),
  zoneKey: yup.string().required(<FormattedLabel id="zoneNmReq"/>),
  departmentKey: yup.string().required(<FormattedLabel id="deptReq"/>),
  // subDepartmentKey:yup.string().required("Sub department Name is Required !!!"),
  isApplicantBelowToPovertyLine: yup.string().required(<FormattedLabel id="isBplReq"/>),
  address: yup.string().max(3000, <FormattedLabel id='addressMaxLen' />).required(<FormattedLabel id="addReq" />),

  // bplCardNo:yup.string().required("BPL Card Number is Required !!!"),
  // yearOfIssues:yup.string().required("Year of Issues is Required !!!"),
  // issuingAuthority:yup.string().required("Issuing Authority is Required !!!"),
  // informationSubject:yup.string().required("Information Subject is Required !!!"),
  // fromDate:yup.string().required("Related Information From Date is Required !!!"),
  // toDate:yup.string().required("Related Information To Date is Required !!!"),

  description: yup.string().max(3000, <FormattedLabel id='descriptionMaxLen' />)
  .required(<FormattedLabel id="descriptionReq"/>),

});

export default trnRtiApplicationSchema;