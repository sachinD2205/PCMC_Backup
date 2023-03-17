import * as yup from "yup";

// schema - validation
let HawkingZoneWiseFacilitiesSchema = yup.object().shape({
  hawkingZoneWiseFacilitiesPrefix: yup
    .string()
    .required("hawking Zone Wise Facilities Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  facilities: yup.string().required("Facilities is Required !!!"),
  hawkigZone: yup.string().required("Hawking Zone is Required !!!"),
});

export default HawkingZoneWiseFacilitiesSchema;
