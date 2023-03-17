import * as yup from "yup";

let schema = yup.object().shape({
    
     code: yup.string().required("code is Required !!!"),
     nameEn: yup.string().required("nameEn is Required !!!"),
     nameMr: yup.string().required("nameMr is Required !!!"),
});

export default schema;