import * as yup from "yup";

// schema - validation
let decisionSchema = yup.object().shape({
    // applicationNo: yup
    // .string()
    // .required("Application No is Required !!!"),
    decisionDetails: yup.string().required("Decision taken in hearing is Required !!!"),
    // decisionOrderDocumentPath: yup.string().required("Decision order document is Required !!!"),
    decisionStatus: yup.string().required("Decision status is Required !!!"),
    // venue: yup.string().required("Venue is Required !!!"),
    // chargeTypeKey: yup.string().required("Charge Type is Required !!!"),
    // totalAmount:yup.string().required("Total Amount is Required !!!"),
    remarks:yup.string().required("Remark is Required !!!"),

});

export default decisionSchema;