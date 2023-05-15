import * as yup from "yup";

// schema - validation
let applicantTypeMasterSchema = yup.object().shape({
    applicantTypeMr: yup.string().required("Applicant Type(मराठी) is Required !!!"),
    applicantType: yup.string().required("Applicant Type is Required !!!"),
    // templateData: yup.string().required("Template data is Required !!!"),

    // templateDataMr: yup.string().required("Template data (मराठी) is Required !!!"),
    // remark: yup.string().required("Remark is Required !!!"),
    // remarkMr: yup.string().required("Remark(मराठी) is Required !!!"),
});

export default applicantTypeMasterSchema