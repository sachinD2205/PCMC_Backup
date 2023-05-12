import * as yup from "yup";

export let basicInformation = yup.object().shape({
  title: yup.string().required("This field is Required !!!"),
  firstName: yup.string().required("This field is Required !!!"),
  middleName: yup.string().required("This field is Required !!!"),
  surname: yup.string().required("This field is Required !!!"),
  houseNo: yup.string().max(5).required("This field is Required !!!"),
  buildingNo: yup.string().max(5).required("This field is Required !!!"),
  roadName: yup.string().required("This field is Required !!!"),
  area: yup.string().required("This field is Required !!!"),
  location: yup.string().required("This field is Required !!!"),
  city: yup.string().required("This field is Required !!!"),
  pincode: yup.string().max(6).required("This field is Required !!!"),
  email: yup.string().email("Incorrect format").required("This field is Required !!!"),
});

export let userGrievanceDetails = yup.object().shape({
  subject: yup.string().required("This field is Required !!!"),
  complaintDescription: yup.string().required("This field is Required !!!"),
  category: yup.string().required("This field is Required !!!"),
});
