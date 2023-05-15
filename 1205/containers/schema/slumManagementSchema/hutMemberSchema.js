import * as yup from "yup";

// schema - validation
let hutMemberSchema = yup.object().shape({
  title: yup.string().required("Title is Required !!!"),
  firstName: yup.string().nullable().required("First Name is Required !!!"),
  middleName: yup.string().nullable().required("Middle Name is Required !!!"),
  lastName: yup.string().required("Last Name is Required"),
  aadharNo: yup.string().required("Adhar No. is Required"),
  mobileNo: yup.string().required("Mobile No.is Required"),
  age: yup.string().required("Age is Required"),
  genderKey: yup.string().required("Gender is Required"),
   religionKey: yup.string().required("Religion is Required"),
   casteKey: yup.string().required("Caste is Required"),
   subCasteKey: yup.string().required("Sub Caste is Required"),
   educationKey: yup.string().required("Education is Required"),
});

export default hutMemberSchema;