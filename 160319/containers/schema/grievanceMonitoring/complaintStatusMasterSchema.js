import * as yup from "yup";

// schema - validation
let complaintStatusMasterSchema = yup.object().shape({
    complaintStatus: yup.string().required("Complaint Status is Required !!!"),
    complaintStatusMr: yup.string().required("Complaint Status(मराठी) is Required !!!"),
    // description: yup.string().required("Description is Required !!!"),
    // descriptionMr: yup.string().required("Description(मराठी) is Required !!!"),
});

export default complaintStatusMasterSchema;