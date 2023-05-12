import * as yup from "yup";

// schema - validation
let mediaMasterSchema = yup.object().shape({
    mediaName: yup.string().required("Media Name is Required !!!"),
    mediaNameMr: yup.string().required("Media Name(मराठी) is Required !!!"),
    prefix: yup.string().required("Media Prefix is Required !!!"),
    prefixMr: yup.string().required("Media Prefix(मराठी) is Required !!!"),
});

export default mediaMasterSchema;