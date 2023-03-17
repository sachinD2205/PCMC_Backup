import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  bookingRegistrationId: yup
    .string()
    .required("Booking registered id is required !!!"),
  firstName: yup.string().required("First Name is required !!!"),
  lastName: yup.string().required("Last Name is required !!!"),
  mobile: yup
    .number()
    .typeError("only numbers are allowed!!!")
    .required("Last Name is required !!!"),
  aadharNo: yup.number().min(12).required("Aadhar no. is required!!!"),
  AaadhaarNo: yup.number().min(12).required("Aadhar no. is required!!!"),
  emailAddress: yup.string().email().required("Email is required!!!"),
  currentAddress: yup.string().required("Current Address is required !!!"),
  title: yup.string().required("Title Category is Required !!!"),
  gender: yup.string().required("gender Category is Required !!!"),
  dob: yup.string().required("Date of birth is Required !!!"),
  crCityName: yup.string().required("city name is Required !!!"),
  crState: yup.string().required("state name is Required !!!"),
  pincode: yup.string().required("pin code name is Required !!!"),
  cityName: yup.string().required("city name is Required !!!"),
  state: yup.string().required("state name is Required !!!"),
  addressCheckBox: yup.string().required("Address check box is Required !!!"),
  permanentAddress: yup.string().required("permanent Address is Required !!!"),
  branchName: yup.string().required("Branch Name is Required !!!"),
  bankAccountHolderName: yup.string().required("Branch Name is Required !!!"),
  bankAccountNo: yup.string().required("Account No is Required !!!"),
  ifscCode: yup.string().required("Account No is Required !!!"),
  bankAddress: yup.string().required("Account No is Required !!!"),
});

export default Schema;
