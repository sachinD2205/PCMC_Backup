import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // facilityNameId: yup.string().required("Facility Type is Required !!!"),
  // zoneName: yup.string().required("Department  is Required !!!"),
  // wardName: yup.string().required("Department  is Required !!!"),
  // facilityName: yup.string().required("Remark  is Required !!!"),
  // facilityType: yup.string().required("Facility Type is Required !!!"),
  // // subDepartment: yup.string().required("Department  is Required !!!"),
  // // department: yup.string().required("Remark  is Required !!!"),
  // geoCode: yup.string().required("Facility Type is Required !!!"),
  // remark: yup.string().required("Sub-Department Name is Required !!"),
});

export default Schema;
