import * as yup from 'yup'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'

// schema - validation
let boardschema = yup.object().shape({
  zoneKey: yup.string().required(<FormattedLabel id="selectZone" />),
  wardKey: yup.string().required(<FormattedLabel id="selectWard" />),
  //APPLICANT DETALS
  atitle: yup.string().required(<FormattedLabel id="title1" />),
  afName: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="firstName" />),
  amName: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="middleName" />),
  alName: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="lastName" />),
  atitlemr: yup.string().required(<FormattedLabel id="titlemr" />),
  afNameMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      'Must be only marathi characters/ फक्त मराठी शब्द',
    )
    .required(<FormattedLabel id="firstNamemr" />),
  amNameMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      'Must be only marathi characters/ फक्त मराठी शब्द',
    )
    .required(<FormattedLabel id="middleNamemr" />),
  alNameMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      'Must be only marathi characters/ फक्त मराठी शब्द',
    )
    .required(<FormattedLabel id="lastNamemr" />),

  //appliacnt data
  aflatBuildingNo: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="flatBuildingNo" />),
  abuildingName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="buildingName" />),
  aroadName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="roadName" />),
  alandmark: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="Landmark" />),
  acityName: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="cityName" />),
  astate: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="state" />),

  aflatBuildingNoMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="flatBuildingNomr" />),
  abuildingNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="buildingNamemr" />),
  aroadNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="roadNamemr" />),
  alandmarkMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="Landmarkmr" />),
  acityNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="cityName" />),
  astateMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="statemr" />),
  apincode: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(6, 'Pincode Number must be at least 6 number')
    .max(6, 'Pincode Number not valid on above 6 number')
    .required(<FormattedLabel id="pincode" />),
  amobileNo: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Mobile Number must be at least 10 number')
    .max(10, 'Mobile Number not valid on above 10 number')
    .required(<FormattedLabel id="mobileNo" />),
  aemail: yup
    .string()
    .email('Incorrect format')
    .required(<FormattedLabel id="email" />),
  //owner
  otitle: yup.string().required(<FormattedLabel id="title1" />),
  ofName: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="firstName" />),
  omName: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="middleName" />),
  olName: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="lastName" />),
  otitlemr: yup.string().required(<FormattedLabel id="titlemr" />),
  ofNameMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      'Must be only marathi characters/ फक्त मराठी शब्द',
    )
    .required(<FormattedLabel id="firstNamemr" />),
  omNameMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      'Must be only marathi characters/ फक्त मराठी शब्द',
    )
    .required(<FormattedLabel id="middleNamemr" />),
  olNameMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      'Must be only marathi characters/ फक्त मराठी शब्द',
    )
    .required(<FormattedLabel id="lastNamemr" />),
  //appliacnt data
  oflatBuildingNo: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="flatBuildingNo" />),
  obuildingName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="buildingName" />),
  oroadName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="roadName" />),
  olandmark: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="Landmark" />),
  ocityName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="cityName" />),
  ostate: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="state" />),
  oflatBuildingNoMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="flatBuildingNomr" />),
  obuildingNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="buildingNamemr" />),
  oroadNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="roadNamemr" />),
  olandmarkMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="Landmarkmr" />),
  ocityNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="cityName" />),
  ostateMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="statemr" />),
  opincode: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(6, 'Pincode Number must be at least 6 number')
    .max(6, 'Pincode Number not valid on above 6 number')
    .required(<FormattedLabel id="pincode" />),
  omobileNo: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Mobile Number must be at least 10 number')
    .max(10, 'Mobile Number not valid on above 10 number')
    .required(<FormattedLabel id="mobileNo" />),
  oemail: yup
    .string()
    .email('Incorrect format')
    .required(<FormattedLabel id="email" />),
  //board details
  marriageBoardName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="boardName" />),
  marriageBoardNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="boardNamemr" />),
  bflatBuildingNo: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="flatBuildingNo" />),
  bbuildingName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="buildingName" />),
  broadName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="roadName" />),
  blandmark: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="Landmark" />),
  city: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    )
    .required(<FormattedLabel id="cityName" />),
  bpincode: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(6, 'Pincode Number must be at least 6 number')
    .max(6, 'Pincode Number not valid on above 6 number')
    .required(<FormattedLabel id="pincode" />),
  bflatBuildingNoMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="flatBuildingNomr" />),
  bbuildingNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="buildingNamemr" />),
  broadNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="roadNamemr" />),
  blandmarkMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="Landmarkmr" />),
  cityMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="cityNamemr" />),
  aadhaarNo: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(12, 'Adhar Number must be at least 12 number')
    .max(12, 'Adhar Number not valid on above 12 number')
    .required(<FormattedLabel id="AadharNo" />),
  mobile: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Mobile Number must be at least 10 number')
    .max(10, 'Mobile Number not valid on above 10 number')
    .required(<FormattedLabel id="mobileNo" />),
  emailAddress: yup
    .string()
    .email('Incorrect format')
    .required(<FormattedLabel id="email" />),

  //document validation
  boardHeadPersonPhoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="boardheadphotoV" />),

  boardOrganizationPhoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="boardorgphotocpyV" />),

  panCard: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="panCardV" />),

  aadharCard: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="adharcardV" />),
})

export default boardschema
