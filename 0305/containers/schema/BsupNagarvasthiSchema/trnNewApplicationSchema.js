import * as yup from "yup";


let trnNewApplicationSchema = yup.object().shape({
    areaKey: yup.string().required("Area Name is Required !!!"),
    zoneKey: yup.string().required("Zone Name is Required !!!"),
    wardKey: yup.string().required("Ward Name Required !!!"),
    benecode: yup.string().required("Beneficiary Code is Required !!!"),
    mainSchemeKey: yup.string().required("Main Shceme is Required !!!"),
    subSchemeKey: yup.string().required("Sub Scheme is Required !!!"),
    applicantFirstName: yup.string().required("Applicant First Name is Required !!!"),
    applicantMiddleName: yup.string().required("Applicant Middle Name is Required !!!"),
    applicantLastName: yup.string().required("Applicant Last Name is Required !!!"),
    gender:yup.string().required("Gender is Required !!!"),
    flatBuldingNo:yup.string().required("Flat/Building no is Required !!!"),
    buildingName:yup.string().required("Building Name is Required !!!"),
    roadName:yup.string().required("Road Name is Required !!!"),
    landmark:yup.string().required("Landmark is Required !!!"),
    geocode:yup.string().required("Geocode is Required !!!"),
    applicantAadharNo:yup.string().required("Applicant Adhar No is Required !!!"),
    dateOfBirth:yup.string().required("Date of Birth is Required !!!"),
    age:yup.string().required("Age is Required !!!"),
    mobileNo:yup.string().required("Mobile No is Required !!!"),
    emailId:yup.string().required("Email Id is Required !!!"),
    religionKey:yup.string().required("Religion is Required !!!"),
    casteCategory:yup.string().required("Caste Category is Required !!!"),
    disabilityCertificateValidity:yup.string().required("Disablity Certificate validity is Required !!!"),
    // divyangSchemeTypeKey:yup.string().required("Divyang Scheme type is Required !!!"),
    // bankNameId:yup.string().required("Bank Name is Required !!!"),
    bankBranchKey:yup.string().required("Bank Brank is Required !!!"),
    savingAccountNo:yup.string().required("Saving Account No is Required !!!"),
    // ifscCode:yup.string().required("IFSC code is Required !!!"),
    // micrCode:yup.string().required("MICR Code is Required !!!"),
    saOwnerFirstName:yup.string().required("Saving Account First Name is Required !!!"),
    saOwnerMiddleName:yup.string().required("Saving Account Middle Name is Required !!!"),
    saOwnerLastName:yup.string().required("Saving Account Last Name is Required !!!"),
});
  
  export default trnNewApplicationSchema;