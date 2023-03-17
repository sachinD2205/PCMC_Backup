import * as yup from "yup";

// schema - validation
let complaintSubTypeMasterSchema = yup.object().shape({
    complaintTypeId: yup.string().required("Complaint Type is Required !!!"),
    complaintSubType: yup.string().required("Complaint Sub Type is Required !!!"),
    complaintSubTypeMr: yup.string().required("Complaint Sub Type (मराठी) is Required !!!"),

    // description: yup.string().required("Description is Required !!!"),
    // descriptionMr: yup.string().required("Description(मराठी) is Required !!!"),
});

export default complaintSubTypeMasterSchema