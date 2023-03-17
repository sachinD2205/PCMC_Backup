


import * as yup from "yup";

// schema - validation
let trnRtiApplicationSchema = yup.object().shape({
  applicantFirstName:yup.string().required("Applicant First Name is Required !!!"),
  applicantMiddleName:yup.string().required("Applicant Middle Name is Required !!!"),
  applicantLastName:yup.string().required("Applicant Last Name is Required !!!"),
  gender:yup.string().required("Gender is Required !!!"),

  // pinCode:yup.string().required("Pincode is Required !!!"),
  pinCode: yup.string().max(6).required("Pincode is Required !!!"),
  emailId: yup
    .string()
    .email("Incorrect format")
    .required("This field is Required !!!"),

  
  contactDetails:yup.string().max(10).required("Contact Details is Required !!!"),
  // emailId:yup.string().required("Email Id is Required !!!"),
  education:yup.string().required("Education is Required !!!"),

  wardKey:yup.string().required("Ward Name is Required !!!"),
  zoneKey:yup.string().required("Zone Name is Required !!!"),
  departmentKey:yup.string().required("Department Name is Required !!!"),
  // subDepartmentKey:yup.string().required("Sub department Name is Required !!!"),
  isApplicantBelowToPovertyLine:yup.string().required("Is applicant below to poverty line is Required !!!"),
  address:yup.string().required("Address is Required !!!"),
  // bplCardNo:yup.string().required("BPL Card Number is Required !!!"),
  // yearOfIssues:yup.string().required("Year of Issues is Required !!!"),
  // issuingAuthority:yup.string().required("Issuing Authority is Required !!!"),
  informationSubject:yup.string().required("Information Subject is Required !!!"),
  fromDate:yup.string().required("Related Information From Date is Required !!!"),
  toDate:yup.string().required("Related Information To Date is Required !!!"),

  description:yup.string().required("Descrition of required Information is Required !!!"),

});

export default trnRtiApplicationSchema;