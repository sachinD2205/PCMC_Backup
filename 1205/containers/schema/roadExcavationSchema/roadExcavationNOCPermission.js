import * as yup from "yup"
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/




export let roadExcavationCitizenSchema = {
// companyName: yup
//   .string()
//   .required("Company Name is required"),
// roadType: yup
//   .string()
//   .required("readtype required"),
// FName: yup
//   .string()
//   .required('Enter First name'),
// MName: yup
//   .string()
//   .required('Enter Middle name'),
// LName: yup
//   .string()
//   .required('Enter Last name'),
// landLineNumber: yup
//   .string()
//   .matches(/^[0-9]{11}$/, "Number valid."),
// phoneNumber: yup
//   .string()
//   .required("phone number is required")
//   .matches(phoneRegExp, 'Phone number is not valid'),
// email: yup
//   .string()
//   .email("Enter a valid email")
//   .required("Email is required"),

// eligibilityForScheme: yup
//   .string()
//   .required("eligibilityForScheme required"),
// mainScheme: yup
//   .string()
//   .required("Main Scheme is required")
//   .matches(/^[0-9a-zA-Z]+$/, "Main Scheme can only contain alphanumeric value."),
// subScheme: yup
//   .string()
//   .required("Sub Scheme is required")
//   .matches(/^[0-9a-zA-Z]+$/, "Sub Scheme can only contain alphanumeric value."),

// permitPeriod: yup
//   .string()
//   .required("Permit Road is required")
//   .matches(/^[0-9a-zA-Z]+$/, "Main Scheme can only contain alphanumeric value."),
// scopeOfWork: yup
//   .string()
//   .required("Scope of work is required"),
//   sLatitude: yup
//     .string()
//     .required("Starting latitude is required")
//     .matches(/^[0-9a-zA-Z]+$/, "Starting latitude can only contain alphanumeric value."),
//   eLatitude: yup
//     .string()
//     .required("Ending latitude is required")
//     .matches(/^[0-9a-zA-Z]+$/, "Ending latitude can only contain alphanumeric value."),
//   sLongitude: yup
//     .string()
//     .required("Starting Longitude is required")
//     .matches(/^[0-9a-zA-Z]+$/, "Starting Longitude can only contain alphanumeric value."),
//   eLongitude: yup
//     .string()
//     .required("Ending Longitude is required")
//     .matches(/^[0-9a-zA-Z]+$/, "Ending Longitude can only contain alphanumeric value."),
//     remarkQ1: yup
//     .string()
//     .required("Remark is required"),
//   remarkQ2: yup
//     .string()
//     .required("Remark is required"),
//   remarkQ3: yup
//     .string()
//     .required("Remark is required"),
//   remarkQ4: yup
//     .string()
//     .required("Remark is required"),
//   q1: yup
//     .string()
//     .required("Remark is required"),
//   q2: yup
//     .string()
//     .required("Remark is required"),
//   q3: yup
//     .string()
//     .required("Remark is required"),
//   q4: yup
//     .string()
//     .required("Remark is required"),

}


export let roadExcavationJuniorEngineerSchema =  {
 
  RoadTypeId: yup
    .string()
    .required("Scope of work is required"),
  zoneId: yup
    .string()
    .required("Scope of work is required"),
  wardId: yup
    .string()
    .required("Scope of work is required"),
  locationOfExcavation: yup
    .string()
    .required("location is required")
    .matches(/^[0-9a-zA-Z]+$/, "Main Scheme can only contain alphanumeric value."),

  lengthOfRoad: yup
    .number()
    .required("Length is required"),
  widthOfRoad: yup
    .number()
    .required("Width is required"),
  rdepth: yup
    .number()
    .required("Depth is required"),
  excavationPattern: yup
    .string()
    .required("Pattern is required"),
  
  chargeTypeName: yup
    .string()
    .required("Charge Type Name is required"),
  amount: yup
    .number()
    .required("Amount is required"),
  totalAmount: yup
    .string()
    .required("Total Amount is required"),
    remarks: yup
    .string()
    .required("Remarks required")
  

}


