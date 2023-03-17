import * as yup from "yup";

const schema = yup
  .object({

    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
      confirmPassword: yup
      .string().required("Confirm Password is required")
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  })
  .required();

export default schema;
