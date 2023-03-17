import * as yup from "yup";

// schema - validation
let categoryMasterSchema = yup.object().shape({
    categoryType: yup.string().required("Category Type is Required !!!"),
    categoryTypeMr: yup.string().required("Category Type(मराठी) is Required !!!"),
    // description: yup.string().required("Description is Required !!!"),
    // descriptionMr: yup.string().required("Description(मराठी) is Required !!!"),

});

export default categoryMasterSchema