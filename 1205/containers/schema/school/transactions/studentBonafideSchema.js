import * as yup from "yup";

// schema - validation for student admission form
let studentBonafideSchema = yup.object().shape({
  schoolKey: yup.string().required("School Name is Required"),
  academicYearKey: yup.string().required("Academic Year Required"),
  classKey: yup.string().required("Class Name Required"),
  divisionKey: yup.string().required("Select Your Division"),
  studentKey: yup.string().required("Select Student Name"),
});

export default studentBonafideSchema;
