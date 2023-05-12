import * as yup from "yup";

let Schema = yup.object().shape({
  // wardKey: yup.string().required("Ward name is Required !!!"),
  departmentKey: yup.string().required("Department name is Required !!!"),
  eventTime: yup.date().typeError("Enter Valid Time !!!").required("Event Time is Required !!!"),
  eventDescription: yup.string().required("Event Description is Required !!!"),
  eventDate: yup.date().typeError("Enter Valid Date !!!").required("Event Date is Required !!!"),
  eventLocationLat: yup.string().required("Event Location Lat is Required !!!"),
  eventLocationLong: yup.string().required("Event Location Long is Required !!!"),
  // newsAdvertisementSubject: yup.string().required("News Advertisement Subject is Required !!!"),
  // newsAdvertisementDescription: yup.string().required("news Advertisement Description is Required !!!"),
  // workName: yup.string().required("Work Name is Required !!!"),
  // rotationGroupKey: yup.string().required("Select rotation Group is Required !!!"),
  // rotationSubGroupKey: yup.string().required("Select rotation SubGroup is Required !!!"),
  // newsPaperLevel: yup.string().required("Select news Paper Level is Required !!!"),
  // standardFormatSize: yup.string().required("Select standard Format Size is Required !!!"),

  // workCost: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError(),
  // .required("work Cost is Required !!!"),
});

export default Schema;
