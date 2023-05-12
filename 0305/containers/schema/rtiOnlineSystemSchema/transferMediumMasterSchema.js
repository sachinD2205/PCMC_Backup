import * as yup from "yup";

// schema - validation
let transferMediumMasterSchema = yup.object().shape({
    mediumPrefix: yup
    .string()
    .required("Medium Prefix is Required !!!"),
    nameOfMedium: yup.string().required("Name of Medium is Required !!!"),
    nameOfMediumMr: yup.string().required("Name of Medium in Marathi is Required !!!"),
});

export default transferMediumMasterSchema;