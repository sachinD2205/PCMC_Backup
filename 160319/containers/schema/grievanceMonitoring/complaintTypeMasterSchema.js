import * as yup from "yup";

// schema - validation
let complaintTypeMasterSchema = yup.object().shape({
    complaintType: yup.string().required("Complaint Type is Required !!!"),
    complaintTypeMr: yup.string().required("Complaint Type(मराठी) is Required !!!"),
    // description: yup.string().required("Description is Required !!!"),
    // descriptionMr: yup.string().required("Description(मराठी) is Required !!!"),
});

export default complaintTypeMasterSchema;