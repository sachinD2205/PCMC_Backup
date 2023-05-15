import * as yup from "yup";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);
// schema - validation
let schema = yup.object().shape({
  zoneKey: yup.string().required("Zone is Required !!!"),
  wardKey: yup.string().required("Ward is Required !!!"),
  areaKey: yup.string().required("Ward is Required !!!"),
  bachatgatName: yup.string().required("Bachatgat Name is Required !!!"),
  totalMembersCount: yup
    .string()
    .required("BachatGat Total Members Count is Required !!!"),
  landmark: yup.string().required("landmark is Required !!!"),
  pincode: yup
    .string()
    .required("Pin Code is required")
    .matches(/^[0-9]+$/, "please enter number only")
    .min(6, "Must be exactly 6 digits")
    .max(6, "Must be exactly 6 digits"),
  email: yup.string().email().required("Email address required"),
  surname: yup.string().required("Last Name is required"),
  presidentFirstName: yup.string().required("President First Name is required"),
  presidentMiddleName: yup
    .string()
    .required("President Middle Name is required"),
  presidentLastName: yup.string().required(" President Last Name is required"),
  applicantFirstName: yup
    .string()
    .required("Applicant  First Name is required"),
  applicantMiddleName: yup
    .string()
    .required("Applicantt Middle Name is required"),
  applicantLastName: yup.string().required("Applicant Last Name is required"),
  middleName: yup.string().required("Middle Name is required"),
  mobileNo: yup
    .string()
    .required("Enter mobile number to proceed")
    .matches(phoneRegex, "Phone number is not valid"),
  category: yup.string().required("BachatGat Category is Required !!!"),
  bankBranchKey: yup.string().required("Bank Branch is Required !!!"),
});

export default schema;
