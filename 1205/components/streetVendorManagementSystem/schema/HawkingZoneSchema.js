import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let HawkingZoneSchema = yup.object().shape({
  hawkingZonePrefix: yup.string().required(<FormattedLabel id="hawkingZonePrefixValidation" />),
  hawkingZonePrefixMr: yup.string().required(<FormattedLabel id="hawkingZonePrefixMrValidation" />),
  fromDate: yup
    .date()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  zone: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="zoneNameValidation" />),
  areaName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="areaNameValidation" />),
  citySurveyNo: yup
    .string()
    .required(<FormattedLabel id="citySurveyNoValdationA" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  item: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="itemValidation" />),
  gisId: yup.string().required(<FormattedLabel id="gisIdValidation" />),
  hawkingZoneName: yup.string().required(<FormattedLabel id="hawkingNameValidation" />),
  hawkingZoneNameMr: yup.string().required(<FormattedLabel id="hawkingNameMrValidation" />),
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
  capacityOfHawkingZone: yup
    .string()
    .required(<FormattedLabel id="capacityOfHawkingZoneValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  noOfHawkersPresent: yup
    .string()
    .required(<FormattedLabel id="noOfHawkersPresentValidation" />)
    .matches(/^[0-9]+$/, "only numbers are allowed / फक्त संख्यांना परवानगी आहे")
    .typeError(),
  hawkingZoneInfo: yup.string().required(<FormattedLabel id="hawkingZoneInfoValidation" />),
  hawkingZoneInfoMr: yup.string().required(<FormattedLabel id="hawkingZoneInfoMrValidation" />),
});

export default HawkingZoneSchema;
