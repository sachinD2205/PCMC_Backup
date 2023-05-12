import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let HawkingZoneWiseFacilitiesSchema = yup.object().shape({
  hawkingZoneWiseFacilitiesPrefix: yup
    .string()
    .required(<FormattedLabel id="hawkingZoneWiseFacilitiesPrefixValidation" />),
  hawkingZoneWiseFacilitiesPrefixMr: yup
    .string()
    .required(<FormattedLabel id="hawkingZoneWiseFacilitiesPrefixMrValidation" />),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="fromDateValidation" />),
  facilities: yup.string().required(<FormattedLabel id="facilitiesValidation" />),
  facilitiesMr: yup.string().required(<FormattedLabel id="facilitiesMrValidation" />),
  hawkigZone: yup.string().required(<FormattedLabel id="hawkigZoneValidation" />),
});

export default HawkingZoneWiseFacilitiesSchema;
