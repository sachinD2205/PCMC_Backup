import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let decisionSchema = yup.object().shape({
    decisionDetails: yup.string()
    .matches(
        /^[A-Za-z@-\s]+$/)
    
    .max(3000, <FormattedLabel id='decisionMaxLen' />)
    .required(<FormattedLabel id="decisionReq"/>),
    decisionStatus: yup.string().max(300, <FormattedLabel id='decisionStatussMaxLen' />).required(<FormattedLabel id="decisionStatusReq"/>),
    decisionRemarks:yup.string().max(2000, <FormattedLabel id='remarkMaxLen' />).required(<FormattedLabel id="remarkReq"/>),
});

export default decisionSchema;