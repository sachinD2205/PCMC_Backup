import * as yup from "yup";

// schema - validation for student admission form
let studentAdmissionSchema = yup.object().shape({
  // zoneKey: yup.string().required("Zone Name is Required"),
  // wardKey: yup.string().required("Ward Name is Required"),
  schoolKey: yup.string().required("School Name is Required"),
  academicYearKey: yup.string().required("Academic Year Required"),
  classKey: yup.string().required("Class Name Required"),
  studentFirstName: yup.string().required("Student First Name Required"),
  firstNameMr: yup.string().required("Student First Name Required (In Marathi)"),
  studentMiddleName: yup.string().required("Student Middle Name Required"),
  middleNameMr: yup.string().required("Student Middle Name Required (In Marathi)"),
  studentLastName: yup.string().required("Student Last Name Required"),
  lastNameMr: yup.string().required("Student Last Name Required (In Marathi)"),
  fatherFirstName: yup.string().required("Father First Name Required"),
  fatherMiddleName: yup.string().required("Father Middle Name Required"),
  fatherLastName: yup.string().required("father Last Name Required"),
  motherName: yup.string().required("Mother Name Required"),
  motherNameMr: yup.string().required("Mother Name (In Marathi) Required"),
  motherMiddleName: yup.string().required("Mother Middle Name Required"),
  motherLastName: yup.string().required("Mother Last Name Required"),
  studentGender: yup.string().required("Select your gender"),
  religionKey: yup.string().required("Select Your Religion"),
  casteKey: yup.string().required("Enter your Caste Name"),
  citizenshipName: yup.string().required("Enter your Citizen Name"),
  motherTongueName: yup.string().required("Enter your MotherTongue Name"),
  studentBirthPlace: yup.string().required("Enter your Birthplace"),
  // birthPlacemr: yup.string().required("Enter your Birthplace (In Marathi)"),
  studentDateOfBirth: yup.string().required("Enter your Birthdate"),
  stateName: yup.string().required("Enter your Birthplace state"),
  districtName: yup.string().required("Enter your Birthplace district"),
  familyPermanentAddress: yup.string().required("Enter your Family Permanent Address"),
  parentFullName: yup.string().required("Enter your Parent Fullname"),
  parentAddress: yup.string().required("Enter your Parent Address"),
  parentOccupation: yup.string().required("Enter your Parent Occupation"),
  colonyName: yup.string().required("Enter your Area/Colony Name"),
  parentDistrictName: yup.string().required("Enter your Parent District Name"),
  parentStateName: yup.string().required("Enter your Parent State Name"),

  // Bank Ac Details

  accountNo: yup.string().required("Please Enter your account number"),

  confirmBankAcNumber: yup
    .string()
    .test("is-same-as-confirmation", "Account number and confirmation must match", function (value) {
      return value === this.parent.accountNo;
    })
    .required("Please confirm your account number"),

  accountHolderName: yup.string().required("Enter Account Holder Name"),
  bankName: yup.string().required("Enter Bank Name"),
  ifscCode: yup.string().required("Enter Bank IFSC Code"),
  bankAdderess: yup.string().required("Enter Bank Address"),

  studentContactDetails: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Mobile Number"),
  studentEmail: yup.string().email("Incorrect format").required("Enter Your EmailID"),
  parentEmailId: yup.string().email("Incorrect format").required("Enter Parent EmailID"),
  studentAadharNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(12, "Adhar Number must be at least 12 number")
    .max(12, "Adhar Number not valid on above 12 number")
    .required("Enter Your Aadhar Number"),
  fatherContactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Father Mobile Number"),
  motherContactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Mother Mobile Number"),
  parentPincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required("Enter your Parent Pincode"),

  // studentMobileNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(10, 'Mobile Number must be 10 number')
  //     .max(10, 'Mobile Number not valid on above 10 number')
  //     .required("Enter Your Mobile Number"),
  // studentEmailId: yup
  //     .string()
  //     .email('Incorrect format')
  //     .required("Enter Your EmailID"),

  // pincode: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(6, 'Pincode Number must be at least 6 number')
  //     .max(6, 'Pincode Number not valid on above 6 number')
  //     .required("Enter Pincode"),
  // contactPersonNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(10, 'Mobile Number must be 10 number')
  //     .max(10, 'Mobile Number not valid on above 10 number')
  //     .required("Enter school contact person Mobile Number"),
  // emailId: yup
  //     .string()
  //     .email('Incorrect format')
  //     .required("Enter School EmailID"),
  // contactDetails: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(10, 'Mobile Number must be 10 number')
  //     .max(10, 'Mobile Number not valid on above 10 number')
  //     .required("Enter your Mobile Number"),
  // emailDetails: yup
  //     .string()
  //     .email('Incorrect format')
  //     .required("Enter your EmailID"),
  // aadharNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(12, 'Adhar Number must be at least 12 number')
  //     .max(12, 'Adhar Number not valid on above 12 number')
  //     .required("Enter Your Aadhar Number"),
});

export default studentAdmissionSchema;
