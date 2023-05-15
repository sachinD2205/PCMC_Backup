import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let newMembershipSchema = yup.object().shape({
    zoneKey: yup.string().required(<FormattedLabel id="selectZone" />),
    libraryKey: yup.string().required(<FormattedLabel id="selectLibrary" />),
    atitle: yup.string().required(<FormattedLabel id="selectTitle" />),
    atitlemr: yup.string().required(<FormattedLabel id="selectTitle" />),
    afName: yup
        .string()
        .matches(
            /^[aA-zZ\s]+$/,
            'Must be only english characters / फक्त इंग्लिश शब्द ',
        )
        .required(<FormattedLabel id="enterFName" />),
    amName: yup
        .string()
        .matches(
            /^[aA-zZ\s]+$/,
            'Must be only english characters / फक्त इंग्लिश शब्द ',
        )
        .required(<FormattedLabel id="enterMName" />),
    alName: yup
        .string()
        .matches(
            /^[aA-zZ\s]+$/,
            'Must be only english characters / फक्त इंग्लिश शब्द ',
        )
        .required(<FormattedLabel id="enterLName" />),
    afNameMr: yup
        .string()
        .matches(
            /^[\u0900-\u097F]+/,
            'Must be only marathi characters/ फक्त मराठी शब्द',
        )
        .required(<FormattedLabel id="enterFNameMr" />),
    amNameMr: yup
        .string()
        .matches(
            /^[\u0900-\u097F]+/,
            'Must be only marathi characters/ फक्त मराठी शब्द',
        )
        .required(<FormattedLabel id="enterMNameMr" />),
    alNameMr: yup
        .string()
        .matches(
            /^[\u0900-\u097F]+/,
            'Must be only marathi characters/ फक्त मराठी शब्द',
        )
        .required(<FormattedLabel id="enterLNameMr" />),
    aemail: yup
        .string()
        .email('Incorrect format')
        .required(<FormattedLabel id="enterEmailAddress" />),
    amobileNo: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .typeError(<FormattedLabel id="enterMobileNo" />)
        .min(10, 'Mobile Number must be at least 10 number')
        .max(10, 'Mobile Number not valid on above 10 number')
        .required(),
    aflatBuildingNo: yup
        .string()
        .matches(
            /^[A-Za-z0-9@-\s]+$/,
            'Must be only in english / फक्त इंग्लिश मध्ये ',
        )
        .required(<FormattedLabel id="enterFlat" />),
    abuildingName: yup
        .string()
        .matches(
            /^[A-Za-z0-9@-\s]+$/,
            'Must be only in english / फक्त इंग्लिश मध्ये ',
        )
        .required(<FormattedLabel id="enterApartment" />),
    aroadName: yup
        .string()
        .matches(
            /^[A-Za-z0-9@-\s]+$/,
            'Must be only in english / फक्त इंग्लिश मध्ये ',
        )
        .required(<FormattedLabel id="enterRoadName" />),
    alandmark: yup
        .string()
        .matches(
            /^[A-Za-z0-9@-\s]+$/,
            'Must be only in english / फक्त इंग्लिश मध्ये ',
        )
        .required(<FormattedLabel id="enterLandmark" />),
    aflatBuildingNoMr: yup
        .string()
        .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
        .required(<FormattedLabel id="enterFlatMr" />),
    abuildingNameMr: yup
        .string()
        .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
        .required(<FormattedLabel id="enterApartmentMr" />),
    aroadNameMr: yup
        .string()
        .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
        .required(<FormattedLabel id="enterRoadNameMr" />),
    alandmarkMr: yup
        .string()
        .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
        .required(<FormattedLabel id="enterLandmarkMr" />),
    acityName: yup
        .string()
        .matches(
            /^[A-Za-z0-9@-\s]+$/,
            'Must be only english characters / फक्त इंग्लिश शब्द ',
        )
        .required(<FormattedLabel id="enterCity" />),
    astate: yup
        .string()
        .matches(
            /^[A-Za-z0-9@-\s]+$/,
            'Must be only english characters / फक्त इंग्लिश शब्द ',
        )
        .required(<FormattedLabel id="enterState" />),
    acityNameMr: yup
        .string()
        .matches(
            /^[\u0900-\u097F]+/,
            'Must be only marathi characters/ फक्त मराठी शब्द',
        )
        .required(<FormattedLabel id="enterCityMr" />),
    astateMr: yup
        .string()
        .matches(
            /^[\u0900-\u097F]+/,
            'Must be only marathi characters/ फक्त मराठी शब्द',
        )
        .required(<FormattedLabel id="stateMr" />),
    apincode: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .typeError(<FormattedLabel id="enterPinCode" />)
        .min(6, 'Pincode Number must be at least 6 number')
        .max(6, 'Pincode Number not valid on above 6 number')
        .required(<FormattedLabel id="enterPinCode" />),
    aadharNo: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .typeError(<FormattedLabel id="enteraadhaarNo" />)
        .min(12, 'Adhar Number must be at least 12 number')
        .max(12, 'Adhar Number not valid on above 12 number')
        .required(),
    applicationDate: yup
        .date()
        .typeError(<FormattedLabel id="selectDate" />)
        .required(),
    membershipMonths: yup.string().required(<FormattedLabel id="selectMembershipMonths" />)

})