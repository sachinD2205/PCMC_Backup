import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let Schema = yup.object().shape({
  newspaperAgencyName: yup.string().required("news paper Agency name is Required !!!"),
  newspaperName: yup.string().required("news paper Name is Required !!!"),
  contactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError()
    .required("contact Number is Required !!!"),
  emailId: yup.string().email("Incorrect format").required("Email is Required !!!"),
  address: yup.string().required("Address is Required !!!"),

  // rotationGroupKey: yup.string().nullable().required("Select rotation Group is Required !!!"),
  // newspaperLevel: yup.string().required("Select news Paper Level is Required !!!"),
  // remark: yup.string().required("Remark name is Required !!!"),
  // newsAdvertisementSubject: yup.string().required("News Advertisement Subject is Required !!!"),
  // newsAdvertisementDescription: yup.string().required("news Advertisement Description is Required !!!"),
  // rotationSubGroupKey: yup.string().required("Select rotation SubGroup is Required !!!"),
  // standardFormatSize: yup.string().required("Select standard Format Size is Required !!!"),
  // typeOfNews: yup.string().required("Select type Of News is Required !!!"),
  // newsPublishDate: yup.date().typeError("Enter Valid Date !!!").required("news Publish Date is Required !!!"),
});

export default Schema;
