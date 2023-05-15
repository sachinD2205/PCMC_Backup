import * as yup from "yup";

let Schema = yup.object().shape({
  // wardKey: yup.string().required("Ward name is Required !!!"),
  // department: yup.string().required("Department name is Required !!!"),
  // priority: yup.string().required("Priority is Required !!!"),
  // newsAdvertisementSubject: yup.string().required("News Advertisement Subject is Required !!!"),
  // // workName: yup.string().required("Work Name is Required !!!"),
  // workCost: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError(),
  // // .required("work Cost is Required !!!"),
  // newsAdvertisementDescription: yup.string().required("news Advertisement Description is Required !!!"),
  // rotationGroupKey: yup.string().required("Select rotation Group is Required !!!"),
  // rotationSubGroupKey: yup.string().required("Select rotation SubGroup is Required !!!"),
  // newsPaperLevel: yup.string().required("Select news Paper Level is Required !!!"),
  // standardFormatSize: yup.string().required("Select standard Format Size is Required !!!"),
  // typeOfNews: yup.string().required("Select type Of News is Required !!!"),
  // newsPublishDate: yup.date().typeError("Enter Valid Date !!!").required("news Publish Date is Required !!!"),
});

export default Schema;
