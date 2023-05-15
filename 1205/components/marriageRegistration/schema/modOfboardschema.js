import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let modOfboardschema = yup.object().shape({
  // zoneKey: yup.string().required(<FormattedLabel id="selectZone" />),
  // wardKey: yup.string().required(<FormattedLabel id="selectWard" />),
  // //APPLICANT DETALS
  // atitle: yup.string().required(<FormattedLabel id="title1" />),
  // afName: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="firstName" />),
  // amName: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="middleName" />),
  // alName: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="lastName" />),
  // atitlemr: yup.string().required(<FormattedLabel id="titlemr" />),
  // afNameMr: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="firstNamemr" />),
  // amNameMr: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="middleNamemr" />),
  // alNameMr: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="lastNamemr" />),
  // //appliacnt data
  // aflatBuildingNo: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // abuildingName: yup
  //   .string()
  //   // .matches(
  //   //   /^[aA-zZ\s]+$/,
  //   //   'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   // )
  //   .required(<FormattedLabel id="buildingName" />),
  // aroadName: yup
  //   .string()
  //   // .matches(
  //   //   /^[aA-zZ\s]+$/,
  //   //   'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   // )
  //   .required(<FormattedLabel id="roadName" />),
  // alandmark: yup
  //   .string()
  //   // .matches(
  //   //   /^[aA-zZ\s]+$/,
  //   //   'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   // )
  //   .required(<FormattedLabel id="Landmark" />),
  // acityName: yup
  //   .string()
  //   // .matches(
  //   //   /^[aA-zZ\s]+$/,
  //   //   'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   // )
  //   .required(<FormattedLabel id="cityName" />),
  // astate: yup
  //   .string()
  //   // .matches(
  //   //   /^[aA-zZ\s]+$/,
  //   //   'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   // )
  //   .required(<FormattedLabel id="state" />),
  // aflatBuildingNoMr: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // abuildingNameMr: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  // aroadNameMr: yup.string().required(<FormattedLabel id="roadNamemr" />),
  // alandmarkMr: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  // acityNameMr: yup.string().required(<FormattedLabel id="cityName" />),
  // astateMr: yup.string().required(<FormattedLabel id="statemr" />),
  // apincode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(6, 'Pincode Number must be at least 6 number')
  //   .max(6, 'Pincode Number not valid on above 6 number')
  //   .required(<FormattedLabel id="pincode" />),
  // amobileNo: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, 'Mobile Number not valid on above 10 number')
  //   .required(<FormattedLabel id="mobileNo" />),
  // aemail: yup
  //   .string()
  //   .email('Incorrect format')
  //   .required(<FormattedLabel id="email" />),
  // //owner
  // otitle: yup.string().required(<FormattedLabel id="title1" />),
  // ofName: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="firstName" />),
  // omName: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="middleName" />),
  // olName: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="lastName" />),
  // otitlemr: yup.string().required(<FormattedLabel id="titlemr" />),
  // ofNameMr: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="firstNamemr" />),
  // omNameMr: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="middleNamemr" />),
  // olNameMr: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="lastNamemr" />),
  // //appliacnt data
  // oflatBuildingNo: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // obuildingName: yup.string().required(<FormattedLabel id="buildingName" />),
  // oroadName: yup.string().required(<FormattedLabel id="roadName" />),
  // olandmark: yup.string().required(<FormattedLabel id="Landmark" />),
  // ocityName: yup.string().required(<FormattedLabel id="cityName" />),
  // ostate: yup.string().required(<FormattedLabel id="state" />),
  // oflatBuildingNoMr: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // obuildingNameMr: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  // oroadNameMr: yup.string().required(<FormattedLabel id="roadNamemr" />),
  // olandmarkMr: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  // ocityNameMr: yup.string().required(<FormattedLabel id="cityName" />),
  // ostateMr: yup.string().required(<FormattedLabel id="statemr" />),
  // opincode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(6, 'Pincode Number must be at least 6 number')
  //   .max(6, 'Pincode Number not valid on above 6 number')
  //   .required(<FormattedLabel id="pincode" />),
  // omobileNo: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, 'Mobile Number not valid on above 10 number')
  //   .required(<FormattedLabel id="mobileNo" />),
  // oemail: yup
  //   .string()
  //   .email('Incorrect format')
  //   .required(<FormattedLabel id="email" />),
  // //owner in modification
  // otitleM: yup.string().required(<FormattedLabel id="title1" />),
  // ofNameM: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="firstName" />),
  // omNameM: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="middleName" />),
  // olNameM: yup
  //   .string()
  //   .matches(
  //     /^[aA-zZ\s]+$/,
  //     'Must be only english characters / फक्त इंग्लिश शब्द ',
  //   )
  //   .required(<FormattedLabel id="lastName" />),
  // otitlemrM: yup.string().required(<FormattedLabel id="titlemr" />),
  // ofNameMrM: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="firstNamemr" />),
  // omNameMrM: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="middleNamemr" />),
  // olNameMrM: yup
  //   .string()
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     'Must be only marathi characters/ फक्त मराठी शब्द',
  //   )
  //   .required(<FormattedLabel id="lastNamemr" />),
  // oflatBuildingNoM: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // obuildingNameM: yup.string().required(<FormattedLabel id="buildingName" />),
  // oroadNameM: yup.string().required(<FormattedLabel id="roadName" />),
  // olandmarkM: yup.string().required(<FormattedLabel id="Landmark" />),
  // ocityNameM: yup.string().required(<FormattedLabel id="cityName" />),
  // ostateM: yup.string().required(<FormattedLabel id="state" />),
  // oflatBuildingNoMrM: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // obuildingNameMrM: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  // oroadNameMrM: yup.string().required(<FormattedLabel id="roadNamemr" />),
  // olandmarkMrM: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  // ocityNameMrM: yup.string().required(<FormattedLabel id="cityName" />),
  // ostateMrM: yup.string().required(<FormattedLabel id="statemr" />),
  // // opincode: yup
  // //   .string()
  // //   .matches(/^[0-9]+$/, 'Must be only digits')
  // //   .min(6, 'Pincode Number must be at least 6 number')
  // //   .max(6, 'Pincode Number not valid on above 6 number')
  // //   .required(<FormattedLabel id="pincode" />),
  // // omobileNo: yup
  // //   .string()
  // //   .matches(/^[0-9]+$/, 'Must be only digits')
  // //   .min(10, 'Mobile Number must be at least 10 number')
  // //   .max(10, 'Mobile Number not valid on above 10 number')
  // //   .required(<FormattedLabel id="mobileNo" />),
  // // oemail: yup
  // //   .string()
  // //   .email('Incorrect format')
  // //   .required(<FormattedLabel id="email" />),
  // //board details
  // marriageBoardName: yup.string().required(<FormattedLabel id="boardName" />),
  // marriageBoardNameMr: yup
  //   .string()
  //   .required(<FormattedLabel id="boardNamemr" />),
  // bflatBuildingNo: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // bbuildingName: yup.string().required(<FormattedLabel id="buildingName" />),
  // broadName: yup.string().required(<FormattedLabel id="roadName" />),
  // blandmark: yup.string().required(<FormattedLabel id="Landmark" />),
  // city: yup.string().required(<FormattedLabel id="cityName" />),
  // bpincode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(6, 'Pincode Number must be at least 6 number')
  //   .max(6, 'Pincode Number not valid on above 6 number')
  //   .required(<FormattedLabel id="pincode" />),
  // bflatBuildingNoMr: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // bbuildingNameMr: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  // broadNameMr: yup.string().required(<FormattedLabel id="roadNamemr" />),
  // blandmarkMr: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  // cityMr: yup.string().required(<FormattedLabel id="cityNamemr" />),
  // aadhaarNo: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(12, 'Adhar Number must be at least 12 number')
  //   .max(12, 'Adhar Number not valid on above 12 number')
  //   .required(<FormattedLabel id="AadharNo" />),
  // mobile: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, 'Mobile Number not valid on above 10 number')
  //   .required(<FormattedLabel id="mobileNo" />),
  // emailAddress: yup
  //   .string()
  //   .email('Incorrect format')
  //   .required(<FormattedLabel id="email" />),
  // //board modification
  // marriageBoardNameM: yup.string().required(<FormattedLabel id="boardName" />),
  // marriageBoardNameMrM: yup
  //   .string()
  //   .required(<FormattedLabel id="boardNamemr" />),
  // bflatBuildingNoM: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNo" />),
  // bbuildingNameM: yup.string().required(<FormattedLabel id="buildingName" />),
  // broadNameM: yup.string().required(<FormattedLabel id="roadName" />),
  // blandmarkM: yup.string().required(<FormattedLabel id="Landmark" />),
  // cityM: yup.string().required(<FormattedLabel id="cityName" />),
  // bpincodeM: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(6, 'Pincode Number must be at least 6 number')
  //   .max(6, 'Pincode Number not valid on above 6 number')
  //   .required(<FormattedLabel id="pincode" />),
  // bflatBuildingNoMrM: yup
  //   .string()
  //   .required(<FormattedLabel id="flatBuildingNomr" />),
  // bbuildingNameMrM: yup
  //   .string()
  //   .required(<FormattedLabel id="buildingNamemr" />),
  // broadNameMrM: yup.string().required(<FormattedLabel id="roadNamemr" />),
  // blandmarkMrM: yup.string().required(<FormattedLabel id="Landmarkmr" />),
  // cityMrM: yup.string().required(<FormattedLabel id="cityNamemr" />),
  // aadhaarNoM: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(12, 'Adhar Number must be at least 12 number')
  //   .max(12, 'Adhar Number not valid on above 12 number')
  //   .required(<FormattedLabel id="AadharNo" />),
  // mobileM: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, 'Mobile Number not valid on above 10 number')
  //   .required(<FormattedLabel id="mobileNo" />),
  // emailAddressM: yup
  //   .string()
  //   .email('Incorrect format')
  //   .required(<FormattedLabel id="email" />),
});

export default modOfboardschema;
