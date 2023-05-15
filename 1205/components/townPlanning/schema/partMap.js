import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

//Personal Details
export let personalDetailsSchema = yup.object().shape({
  // title: yup.string().required("Please select a Title"),
  // titleMr: yup.string().required("कृपया शीर्षक निवडा"),
  // firstNameEn: yup.string().required("Please First name in English"),
  // firstNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required("Please First name in Marathi"),
  // middleNameEn: yup.string().required("Please Middle name in English"),
  // middleNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required("Please Middle name in Marathi"),
  // surnameEn: yup.string().required("Please Last name in English"),
  // surnameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required("Please Last name in Marathi"),
  // gender: yup.string().required("Please select a Gender"),
  // mobile: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError("Please select a Mobile")
  //   .min(10, "Mobile Number must be at least 10 number")
  //   .max(10, "Mobile Number not valid on above 10 number")
  //   .required(),
  // panNo: yup.string().required("Please select a Pan No"),
  // emailAddress: yup.string().required("Please select an Email Address"),
  // aadhaarNo: yup.string().required("Please select a Aadhaar No."),
});

//Area Details
export let areaDetailsSchema = yup.object().shape({
  reservationNo: yup.string().nullable().required("Please select Reservation"),
  tDRZone: yup.string().nullable().required("Please select a Zone"),
  villageName: yup.string().nullable().required("Please select a Village"),
  gatNo: yup.string().nullable().required("Please select a Gat"),
  pincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required(),
  serviceCompletionDate: yup
    .date()
    .typeError(<FormattedLabel id="selectDate" />)
    .required(),

  surveyNumber: yup.string().nullable().required("Please enter survey Number"),

  citySurveyNo: yup.string().nullable().required("Please enter city Survey No"),
});
