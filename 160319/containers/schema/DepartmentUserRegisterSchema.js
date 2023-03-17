import * as yup from "yup";
// const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

const schema = yup.object({
  // userName: yup.string().required("User name is required"),
  // password: yup
  //   .string()
  //   .required("Password is required")
  //   .min(8, "Password is too short - should be 8 chars minimum.")
  //   .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  // employeeCode: yup.string().required("Employee code is required"),
  // firstName: yup.string().required("First name is required"),
  // middleName: yup.string().required("Middle name is required"),
  // lastName: yup.string().required("Last name is required"),
  // firstNameMr: yup.string().required("First name is required"),
  // middleNameMr: yup.string().required("Middle name is required"),
  // lastNameMr: yup.string().required("Last name is required"),
  // email: yup
  //   .string()
  //   .email("Field should contain a valid e-mail")
  //   .max(255)
  //   .required("Email address required"),
  // mobileNumber: yup
  //   .string()
  //   .required("Phone number is required")
  //   .matches(phoneRegex, "Phone number is not valid"),
});
//   .required();

// departmentName: yup.string().required("Required field"),
// designationName: yup.string().required("Required field"),
// applicationName: yup.string().required("Required field"),
// roleName: yup.string().required("Required field"),

export default schema;
