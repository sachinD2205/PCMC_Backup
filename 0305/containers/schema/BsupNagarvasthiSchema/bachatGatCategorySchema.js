import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// schema - validation
export let schema = yup.object().shape({
  // caseMainType: yup.number().required("Case Type is Required !!!"),
  // courtName: yup.string().nullable().required("Court Name is Required !!!"),
  // area: yup.string().required("Area is Required !!!"),
  // roadName: yup.string().required("Road Name is Required !!!"),
  // landmark: yup.string().required("Landmark is Required !!!"),
  // city: yup.string().required("City is Required !!!"),
  // pinCode: yup.number().nullable().required("Pin Code is Required !!!"),
  // bgCategoryPrefix: yup.string().required("Category Prefix is Required !!!"),
  // bgCategoryPrefixMr: yup.string().required("श्रेणी उपसर्ग आवश्यक आहे !!!"),
  // bgCategoryMr: yup.string().required("Category Name in Marathi is Required !!!"),
  // bgCategoryName: yup.string().required("Name of Medium in English is Required !!!"),

  bgCategoryPrefix: yup.string().required(<FormattedLabel id="bgCategoryPrefixValidation" />),
  bgCategoryMr: yup.string().required(<FormattedLabel id="bgCategoryMrValidation" />),
  bgCategoryName: yup.string().required(<FormattedLabel id="bgCategoryNameValidation" />),
});

// export default schema;
