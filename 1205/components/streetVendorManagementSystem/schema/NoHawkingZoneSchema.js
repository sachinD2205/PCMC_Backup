import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let NoHawkingZoneSchema = yup.object().shape({
  noHawkingZoneprefix: yup.string().required(<FormattedLabel id="noHawkingZoneprefixEnValidation" />),
  noHawkingZoneprefixMr: yup.string().required(<FormattedLabel id="noHawkingZoneprefixMrValidation" />),
  noHawkingZoneName: yup.string().required(<FormattedLabel id="noHawkingZoneEnValidation" />),
  noHawkingZoneNameMr: yup.string().required(<FormattedLabel id="noHawkingZoneMrValidation" />),
  noHawkingZoneInfo: yup.string().required(<FormattedLabel id="noHawkingZoneMrValidation" />),
  noHawkingZoneInfoMr: yup.string().required(<FormattedLabel id="noHawkingZoneMrValidation" />),
  gisId: yup.string().required(<FormattedLabel id="gisIdValidation" />),
  citySurveyNo: yup
    .string()
    .required(<FormattedLabel id="citySurveyNoValdationA" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  zone: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="zoneNameValidation" />),
  areaName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="areaNameValidation" />),
  declarationDate: yup
    .date()
    .required(<FormattedLabel id="declarationDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  declarationOrder: yup.string().required(<FormattedLabel id="declarationOrderValidation" />),
  declarationOrderNo: yup
    .string()
    .required(<FormattedLabel id="declarationOrderNoValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),

  fromDate: yup
    .date()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  // constraint1: yup.string().required("Constraint is Required !!!"),
  // capacityOfHawkingZone:yup.number().typeError('you must specify a number').required("Capacity Of Hawking Zone"),
  // noOfHawkersPresent:yup.number().typeError('you must specify a number').required("No Of Hawkers Present"),
});

export default NoHawkingZoneSchema;
