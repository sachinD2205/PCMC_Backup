import * as yup from "yup";


let bachatgatRegistration = yup.object().shape({
  areaKey: yup.string().required("Area Name is Required !!!"),
  zoneKey: yup.string().required("Zone Name is Required !!!"),
    wardKey: yup.string().required("Ward Name Required !!!"),
    geoCode: yup.string().required("Geo Code is Required !!!"),
    bachatgatName: yup.string().required("Bachat Gat is Required !!!"),
    // categoryKey: yup.string().required("Bachat Gat Category is Required !!!"),
    presidentFirstName: yup.string().required("President First Name is Required !!!"),
    presidentMiddleName: yup.string().required("President Middle Name is Required !!!"),
    presidentLastName: yup.string().required("President Last Name is Required !!!"),
    // totalMembersCount: yup.string().required("Total Members is Required !!!"),
    applicantFirstName: yup.string().required("Applicant First Name is Required !!!"),
    applicantMiddleName: yup.string().required("Applicant Middle Name is Required !!!"),
    applicantLastName: yup.string().required("Applicant Last Name is Required !!!"),
    pinCode: yup.string().required("Pincode is Required !!!"),
    landlineNo: yup.string().required("Landline No is Required !!!"),
    // gender:yup.string().required("Gender is Required !!!"),
    flatBuldingNo:yup.string().required("Flat/Building no is Required !!!"),
    buildingName:yup.string().required("Building Name is Required !!!"),
    roadName:yup.string().required("Road Name is Required !!!"),
    landmark:yup.string().required("Landmark is Required !!!"),
    geoCode:yup.string().required("Geocode is Required !!!"),
    mobileNo:yup.string().required("Mobile No is Required !!!"),
    emailId:yup.string().required("Email Id is Required !!!"),
    startDate:yup.string().required("Start Date is Required !!!"),
    accountNo:yup.string().required("Account No is Required !!!"),
    bankAccountFullName:yup.string().required("Account Full Name is Required !!!"),
   
});
  
  export default bachatgatRegistration;