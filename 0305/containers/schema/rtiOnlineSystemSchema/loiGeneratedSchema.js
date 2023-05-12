import * as yup from "yup";

// schema - validation
let loiGeneratedSchema = yup.object().shape({
    // applicationNo: yup
    // .string()
    // .required("Application No is Required !!!"),
    // applicantFirstName: yup.string().required("Applicant First Name is Required !!!"),
    // serviceName: yup.string().required("Service Name is Required !!!"),
    // amount: yup.string().required("Amount is Required !!!"),
    // noOfPages: yup.string().required("No of pages is Required !!!"),
    chargeTypeKey: yup.string().required("Charge Type is Required !!!"),
    // totalAmount:yup.string().required("Total Amount is Required !!!"),
    remarks:yup.string().required("Remark is Required !!!"),

});

export default loiGeneratedSchema;