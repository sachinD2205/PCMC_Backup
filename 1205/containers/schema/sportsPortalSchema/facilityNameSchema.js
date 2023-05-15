import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  // facilityNameId: yup.string().required("Facility Type is Required !!!"),
  zoneName: yup.string().required(<FormattedLabel id="Vzone" />),
  wardName: yup.string().required(<FormattedLabel id="Vward" />),
  facilityName: yup
    .string()
    // .matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="VfacilityName" />),
  facilityNameMr: yup
    .string()
    .matches(/^[अ-ज्ञs\u0900-\u097F]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="VfacilityNameMr" />),
  facilityType: yup.string().required(<FormattedLabel id="VfacilityType" />),
  // // subDepartment: yup.string().required("Department  is Required !!!"),
  // // department: yup.string().required("Remark  is Required !!!"),
  // geoCode: yup.string().required(<FormattedLabel id="VgeoCode" />),
  remark: yup.string().required(<FormattedLabel id="Vremark" />),
  // remarkMr: yup.string().required(<FormattedLabel id="VremarkMr" />),
});

export default Schema;
