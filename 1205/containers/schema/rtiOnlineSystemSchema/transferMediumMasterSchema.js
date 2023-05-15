import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let transferMediumMasterSchema = yup.object().shape({
    mediumPrefix: yup
        .string()
        .min(2, <FormattedLabel id="mediumPrefMinLeng" />)
        .max(100, <FormattedLabel id='mediumPrefMaxLen' />)
        .required(<FormattedLabel id="mediumPrefReq" />),
    nameOfMedium: yup.string()
        .matches(
            /^[A-Za-z@-\s]+$/,
            'Must be only in english/ फक्त इंग्लिश मध्ये',)
        .required(<FormattedLabel id="nmOfMediumReq" />)
        .min(2, <FormattedLabel id="mediumMinLeng" />)
        .max(300, <FormattedLabel id='mediumMaxLen' />),
    nameOfMediumMr: yup.string()
        .min(2, <FormattedLabel id="mediumMinLengMr" />)
        .max(300, <FormattedLabel id='mediumMaxLenMr' />)
        .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
        .required(<FormattedLabel id="nmOfMediumReqMr" />),
});

export default transferMediumMasterSchema;
