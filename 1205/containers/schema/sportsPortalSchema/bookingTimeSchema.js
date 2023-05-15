import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  zoneName: yup.string().required(<FormattedLabel id="Vzone" />),
  wardName: yup.string().required(<FormattedLabel id="Vward" />),
  facilityName: yup.string().required(<FormattedLabel id="VfacilityName" />),
  facilityType: yup.string().required(<FormattedLabel id="VfacilityType" />),
  venue: yup.string().required(<FormattedLabel id="Vvenue" />),
  durationType: yup.string().required(<FormattedLabel id="VdurationType" />),
  capacity: yup.string().required(<FormattedLabel id="Vcapacity" />),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="VfromDate" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="VtoDate" />),
  fromBookingTime: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="VfromBookingTime" />),
  toBookingTime: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="VtoBookingTime" />),
});

export default Schema;
