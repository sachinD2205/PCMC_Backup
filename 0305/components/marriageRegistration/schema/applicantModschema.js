import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// export let groomSchema = yup.object().shape({
//   gtitle: yup.string().required(<FormattedLabel id="selectTitle" />),
//   gfNameM: yup
//     .string()
//     .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="enterFName" />),
//   gmNameM: yup
//     .string()
//     .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="enterMName" />),
//   glNameM: yup
//     .string()
//     .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="enterLName" />),
//   gtitleMar: yup.string().required(<FormattedLabel id="selectTitle" />),
//   gfNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterFNameMr" />),
//   gmNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterMNameMr" />),
//   glNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterLNameMr" />),
//   gbirthDate: yup
//     .date()
//     .typeError(<FormattedLabel id="selectDate" />)
//     .required(),
//   gage: yup
//     .number()
//     .typeError()
//     .min(18, "Age must be at least 18 year")
//     .max(99, "Age not valid on above 18 year")
//     .required(<FormattedLabel id="enterAge" />),
//   ggender: yup.string().required(<FormattedLabel id="selectGender" />),
//   gaadharNo: yup
//     .string()
//     .matches(/^[0-9]+$/, "Must be only digits")
//     .typeError(<FormattedLabel id="enteraadhaarNo" />)
//     .min(12, "Adhar Number must be at least 12 number")
//     .max(12, "Adhar Number not valid on above 12 number")
//     .required(),
//   gemail: yup.string().email("Incorrect format"),
//   // .required(<FormattedLabel id="enterEmailAddress" />),
//   greligionByBirth: yup.string().required(<FormattedLabel id="selectReligionby" />),
//   greligionByAdoption: yup.string().required(<FormattedLabel id="selectAdoptionby" />),
//   gstatusAtTimeMarriageKey: yup.string().required(<FormattedLabel id="selectStatusAt" />),
//   gbuildingNo: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
//     .required(<FormattedLabel id="enterFlat" />),
//   gbuildingName: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
//     .required(<FormattedLabel id="enterApartment" />),
//   groadName: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
//     .required(<FormattedLabel id="enterRoadName" />),
//   glandmark: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
//     .required(<FormattedLabel id="enterLandmark" />),
//   gbuildingNoMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterFlatMr" />),
//   gbuildingNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterApartmentMr" />),
//   groadNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterRoadNameMr" />),
//   glandmarkMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterLandmarkMr" />),
//   gcityName: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="enterCity" />),
//   gstate: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="state" />),
//   gcityNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterCityMr" />),
//   gstateMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="stateMr" />),
//   gpincode: yup
//     .string()
//     .matches(/^[0-9]+$/, "Must be only digits")
//     .typeError(<FormattedLabel id="enterPinCode" />)
//     .min(6, "Pincode Number must be at least 6 number")
//     .max(6, "Pincode Number not valid on above 6 number")
//     .required(),
//   // .number()
//   gmobileNo: yup
//     .string()
//     .matches(/^[0-9]*$/, "Must be only digits")
//     .typeError(<FormattedLabel id="enteraadhaarNo" />)
//     // .min(10, 'Mobile Number must be at least 10 number')
//     .max(10, "Mobile Number not valid on above 10 number"),
// });

// export let brideSchema = yup.object().shape({
//   btitle: yup.string().required(<FormattedLabel id="selectTitle" />),
//   bfName: yup
//     .string()
//     .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="enterFName" />),
//   bmName: yup
//     .string()
//     .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="enterMName" />),
//   blName: yup
//     .string()
//     .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="enterLName" />),
//   btitleMar: yup.string().required(<FormattedLabel id="selectTitle" />),
//   bfNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterFNameMr" />),
//   bmNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterMNameMr" />),
//   blNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterLNameMr" />),
//   bbirthDate: yup
//     .date()
//     .typeError(<FormattedLabel id="selectDate" />)
//     .required(),
//   bage: yup
//     .number()
//     .typeError()
//     .min(18, "Age must be at least 18 year")
//     .max(99, "Age not valid on above 18 year")
//     .required(<FormattedLabel id="enterAge" />),
//   bgender: yup.string().required(<FormattedLabel id="selectGender" />),
//   baadharNo: yup
//     .string()
//     .matches(/^[0-9]+$/, "Must be only digits")
//     .typeError(<FormattedLabel id="enteraadhaarNo" />)
//     .min(12, "Adhar Number must be at least 12 number")
//     .max(12, "Adhar Number not valid on above 12 number")
//     .required(),
//   bemail: yup.string().email("Incorrect format"),
//   // .required(<FormattedLabel id="enterEmailAddress" />),
//   breligionByBirth: yup.string().required(<FormattedLabel id="selectReligionby" />),
//   breligionByAdoption: yup.string().required(<FormattedLabel id="selectAdoptionby" />),
//   bstatusAtTimeMarriageKey: yup.string().required(<FormattedLabel id="selectStatusAt" />),
//   bbuildingNo: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
//     .required(<FormattedLabel id="enterFlat" />),
//   bbuildingName: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
//     .required(<FormattedLabel id="enterApartment" />),
//   broadName: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
//     .required(<FormattedLabel id="enterRoadName" />),
//   blandmark: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
//     .required(<FormattedLabel id="enterLandmark" />),
//   bbuildingNoMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterFlatMr" />),
//   bbuildingNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterApartmentMr" />),
//   broadNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterRoadNameMr" />),
//   blandmarkMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterLandmarkMr" />),
//   bcityName: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="enterCity" />),
//   bstate: yup
//     .string()
//     .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//     .required(<FormattedLabel id="state" />),
//   bcityNameMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="enterCityMr" />),
//   bstateMr: yup
//     .string()
//     .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
//     .required(<FormattedLabel id="stateMr" />),
//   bpincode: yup
//     .string()
//     .matches(/^[0-9]+$/, "Must be only digits")
//     .typeError(<FormattedLabel id="enterPinCode" />)
//     .min(6, "Pincode Number must be at least 6 number")
//     .max(6, "Pincode Number not valid on above 6 number")
//     .required(),
//   bmobileNo: yup
//     .string()
//     .matches(/^[0-9]*$/, "Must be only digits")
//     .typeError(<FormattedLabel id="enteraadhaarNo" />)
//     // .min(10, 'Mobile Number must be at least 10 number')
//     .max(10, "Mobile Number not valid on above 10 number"),
//   // .required(),
// });

// modification
let applicantModschema = yup.object().shape({
  // marriageDateM: yup
  //   .date()
  //   .typeError(<FormattedLabel id="selectDate" />)
  //   .required(),
  // pplaceOfMarriageM: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="placeMarriage" />),
  // pplaceOfMarriageMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="placeMarriageMr" />),
  // gtitleM: yup.string().required(<FormattedLabel id="selectTitle" />),
  // gfNameM: yup
  //   .string()
  //   .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="enterFName" />),
  // gmNameM: yup
  //   .string()
  //   .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="enterMName" />),
  // glNameM: yup
  //   .string()
  //   .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="enterLName" />),
  // gtitleMarM: yup.string().required(<FormattedLabel id="selectTitle" />),
  // gfNameMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterFNameMr" />),
  // gmNameMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterMNameMr" />),
  // glNameMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterLNameMr" />),
  // gbuildingNoM: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required(<FormattedLabel id="enterFlat" />),
  // gbuildingNameM: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required(<FormattedLabel id="enterApartment" />),
  // groadNameM: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required(<FormattedLabel id="enterRoadName" />),
  // glandmarkM: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required(<FormattedLabel id="enterLandmark" />),
  // gbuildingNoMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterFlatMr" />),
  // gbuildingNameMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterApartmentMr" />),
  // groadNameMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterRoadNameMr" />),
  // glandmarkMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterLandmarkMr" />),
  // gcityNameM: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="enterCity" />),
  // gstateM: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="state" />),
  // gcityNameMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterCityMr" />),
  // gstateMrM: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="stateMr" />),
  // gpincodeM: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError(<FormattedLabel id="enterPinCode" />)
  //   .min(6, "Pincode Number must be at least 6 number")
  //   .max(6, "Pincode Number not valid on above 6 number")
  //   .required(),
  // // .number()
  // gmobileNoM: yup
  //   .string()
  //   .matches(/^[0-9]*$/, "Must be only digits")
  //   .typeError(<FormattedLabel id="enteraadhaarNo" />)
  //   // .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, "Mobile Number not valid on above 10 number"),
  // gaadharNoM: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError(<FormattedLabel id="enteraadhaarNo" />)
  //   .min(12, "Adhar Number must be at least 12 number")
  //   .max(12, "Adhar Number not valid on above 12 number")
  //   .required(),
  // btitle: yup.string().required(<FormattedLabel id="selectTitle" />),
  // bfName: yup
  //   .string()
  //   .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="enterFName" />),
  // bmName: yup
  //   .string()
  //   .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="enterMName" />),
  // blName: yup
  //   .string()
  //   .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="enterLName" />),
  // btitleMar: yup.string().required(<FormattedLabel id="selectTitle" />),
  // bfNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterFNameMr" />),
  // bmNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterMNameMr" />),
  // blNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterLNameMr" />),
  // bbirthDate: yup
  //   .date()
  //   .typeError(<FormattedLabel id="selectDate" />)
  //   .required(),
  // bage: yup
  //   .number()
  //   .typeError()
  //   .min(18, "Age must be at least 18 year")
  //   .max(99, "Age not valid on above 18 year")
  //   .required(<FormattedLabel id="enterAge" />),
  // bgender: yup.string().required(<FormattedLabel id="selectGender" />),
  // baadharNo: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError(<FormattedLabel id="enteraadhaarNo" />)
  //   .min(12, "Adhar Number must be at least 12 number")
  //   .max(12, "Adhar Number not valid on above 12 number")
  //   .required(),
  // bemail: yup.string().email("Incorrect format"),
  // // .required(<FormattedLabel id="enterEmailAddress" />),
  // breligionByBirth: yup.string().required(<FormattedLabel id="selectReligionby" />),
  // breligionByAdoption: yup.string().required(<FormattedLabel id="selectAdoptionby" />),
  // bstatusAtTimeMarriageKey: yup.string().required(<FormattedLabel id="selectStatusAt" />),
  // bbuildingNo: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required(<FormattedLabel id="enterFlat" />),
  // bbuildingName: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required(<FormattedLabel id="enterApartment" />),
  // broadName: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required(<FormattedLabel id="enterRoadName" />),
  // blandmark: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required(<FormattedLabel id="enterLandmark" />),
  // bbuildingNoMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterFlatMr" />),
  // bbuildingNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterApartmentMr" />),
  // broadNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterRoadNameMr" />),
  // blandmarkMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterLandmarkMr" />),
  // bcityName: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="enterCity" />),
  // bstate: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required(<FormattedLabel id="state" />),
  // bcityNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="enterCityMr" />),
  // bstateMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required(<FormattedLabel id="stateMr" />),
  // bpincode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError(<FormattedLabel id="enterPinCode" />)
  //   .min(6, "Pincode Number must be at least 6 number")
  //   .max(6, "Pincode Number not valid on above 6 number")
  //   .required(),
  // bmobileNo: yup
  //   .string()
  //   .matches(/^[0-9]*$/, "Must be only digits")
  //   .typeError(<FormattedLabel id="enteraadhaarNo" />)
  //   // .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, "Mobile Number not valid on above 10 number"),
  // // .required(),
});

export default applicantModschema;
