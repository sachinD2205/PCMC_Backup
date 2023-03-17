import * as yup from 'yup'


// schema - validation for student admission form
let schoolMasterSchema = yup.object().shape({
    schoolName: yup.string().required("School Name is Required"),
    schoolPrefix: yup.string().required("School Prefix is Required"),
    schoolAddress: yup.string().required("School Address is Required"),
    contactPersonName: yup.string().required("Enter School Contact Person Name"),
    zoneKey: yup.string().required("Zone Name is Required"),
    wardKey: yup.string().required("Ward Name is Required"),


    pincode: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(6, 'Pincode Number must be at least 6 number')
        .max(6, 'Pincode Number not valid on above 6 number')
        .required("Enter Pincode"),
    contactPersonNumber: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Mobile Number must be 10 number')
        .max(10, 'Mobile Number not valid on above 10 number')
        .required("Enter school contact person Mobile Number"),
    emailId: yup
        .string()
        .email('Incorrect format')
        .required("Enter School EmailID"),

})

export default schoolMasterSchema;