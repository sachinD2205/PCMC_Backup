import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
    ownershipTypePrefix: yup.string().required(" Ownership Type Prefix is Required !!!"),
    ownershipType: yup.string().required(" Ownership Type is Required !!!"),
  
});

export default schema;