import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  geoCode: yup.string().required("GIS Code is Required !!!"),
  facilityTypeMr: yup.string().required("Course Selection is Required !!!"),
  faciltyName: yup.string().required(" Facility Name is Required !!"),
  facilityType: yup.string().required(" Facility Type is Required !!"),
  remark: yup.string().required(" Remark is Required !!"),
  // facilityId: yup.string().required(" Facility Id is Required !!"),
  zoneName: yup.string().required(" Zone Name is Required !!"),
  wardName: yup.string().required(" Ward Name is Required !!"),
});

export default Schema;
