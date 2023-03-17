import * as yup from 'yup'


// schema - validation for student admission form
let academicYearSchema = yup.object().shape({

    academicYear: yup.string().required("Academic Year is Required"),
    academicYearFrom: yup.string().required("Academic YearFrom Date is Required"),
    academicYearTo: yup.string().required("Academic YearTo Date is Required"),
    
    })

export default academicYearSchema;