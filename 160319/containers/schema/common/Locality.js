import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
 
   landmark: yup.string().required("Landmark is Required !!!"),
   landmarkMr:yup.string().required("Landmark Mr is Required !!!"),
   localityPrefix:yup.string().required("Locality Prefix is Required !!!"),
   zone:yup.string().required("Zone is Required !!!"),
});

export default schema;
