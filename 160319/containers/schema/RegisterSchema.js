import * as yup from "yup";
const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

const schema = yup
  .object({
    firstName: yup.string().required("Firstname is required"),
    middleName: "",
    lastName: yup.string().required("Lastname is required"),
    mobileNumber: yup
      .string()
      .required("Enter mobile number to proceed")
      .matches(phoneRegex, "Phone number is not valid"),
    email: yup
      .string()
      .email("Field should contain a valid e-mail")
      .max(255)
      .required("Email address required"),
    loginId: yup.string().required("Login id is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    hintQuestion: yup.string().required("Required field"),
    hintQuestionAnswer: yup.string().required("Required field"),
  })
  .required();

export default schema;
