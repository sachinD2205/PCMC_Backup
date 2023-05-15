import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let loiGeneratedSchema = yup.object().shape({
    // applicationNo: yup
    // .string()
    // .required("Application No is Required !!!"),
    // applicantFirstName: yup.string().required("Applicant First Name is Required !!!"),
    // serviceName: yup.string().required("Service Name is Required !!!"),
    // amount: yup.string().required("Amount is Required !!!"),
    // noOfPages: yup.string().required("No of pages is Required !!!"),
    chargeTypeKey: yup.string().required(<FormattedLabel id="chargeTypeReq"/>),
    // totalAmount:yup.string().required("Total Amount is Required !!!"),
    remarks:yup.string().max(2000, <FormattedLabel id='remarkMaxLen' />).required(<FormattedLabel id="remarkReq"/>),

});

export default loiGeneratedSchema;