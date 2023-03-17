import * as yup from "yup";

let schema = yup.object().shape({
    name:yup.string().required("Name is Required"),
    nameMr:yup.string().required("Name Mr is Required"),
    rolePrefix:yup.string().required(" Role Prefix is Required"),
});

export default schema;
