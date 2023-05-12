import * as yup from "yup";

// schema - validation
let trnRtiAppealSchema = yup.object().shape({
    applicationNo: yup
    .string()
    .required("Application Number is Required !!!"),
    applicantFirstName:yup.string().required("Applicant First Name is Required !!!"),
    applicantMiddleName:yup.string().required("Applicant Middle Name is Required !!!"),
    applicantLastName:yup.string().required("Applicant Last Name is Required !!!"),
    address:yup.string().required("Address is Required !!!"),
    officerDetails:yup.string().required("Officer details is Required !!!"),
    // dateOfOrderAgainstAppeal:yup.string().required("Date of order against appeal is Required !!!"),
    informationDescription:yup.string().required("Description of Information is Required !!!"),
    // informationSubjectDesc:yup.string().required("Required information subject and description is Required !!!"),
    // concernedOfficeDetails:yup.string().required("Concern Office Or Department Name whose information is Required !!!"),
    // informationPurpose:yup.string().required("Required information purpose is Required !!!"),
    appealReason:yup.string().required("Reason for appeal is Required !!!"),
    // paymentModeKey:yup.string().required("Select payment mode is Required !!!"),
    // paymentAmount:yup.string().required("Application charges is Required !!!"),

});

export default trnRtiAppealSchema;