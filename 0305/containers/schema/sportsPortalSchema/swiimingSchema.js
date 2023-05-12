import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let BookingDetailSchema = yup.object().shape({
  // zone: yup.string().required(<FormattedLabel id="selectZone" />),
  facilityType: yup.string().required(<FormattedLabel id="VfacilityType" />),
  facilityName: yup.string().required(<FormattedLabel id="VfacilityName" />),
  durationType: yup.string().required(<FormattedLabel id="VdurationType" />),
  applicantType: yup.string().required(<FormattedLabel id="VapplicantType" />),
  bookingId: yup.string().required(<FormattedLabel id="VselectSlots" />),
  venue: yup.string().required(<FormattedLabel id="Vvenue" />),
  date: yup.string().required(<FormattedLabel id="Vdate" />),
});

export let PersonalDetailsSchema = yup.object().shape({
  title: yup.string().required(<FormattedLabel id="selectTitle" />),
  firstName: yup
    .string()
    .matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="enterFName" />),
  middleName: yup
    .string()
    .matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="enterMName" />),
  lastName: yup
    .string()
    .matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="enterLName" />),
  gender: yup.string().required(<FormattedLabel id="selectGender" />),
  dateOfBirth: yup
    .date()
    .typeError(<FormattedLabel id="selectDate" />)
    .required(),
  age: yup
    .number()
    .typeError()
    .min(18, "Age must be at least 18 year")
    .max(99, "Age not valid on above 18 year")
    .required(<FormattedLabel id="enterAge" />),
  aadharNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(12, "Adhar Number must be at least 12 number")
    .max(12, "Adhar Number not valid on above 12 number")
    .required(),
  mobileNo: yup
    .string()
    .matches(/^[0-9]*$/, "Must be only digits")
    .typeError(<FormattedLabel id="mobileNo" />)
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number"),
  emailAddress: yup
    .string()
    .email("Incorrect format")
    .required(<FormattedLabel id="enterEmailAddress" />),
  cAddress: yup.string().required(<FormattedLabel id="Vcaddres" />),
  cCityName: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="enterCity" />),
  cState: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="state" />),
  cPincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required(),
  // cLattitude: yup
  //   .number()
  //   .min(-90, "Latitude must be greater than or equal to -90")
  //   .max(90, "Latitude must be less than or equal to 90")
  //   .required("Latitude is required"),
  // cLongitude: yup
  //   .number()
  //   .min(-180, "Longitude must be greater than or equal to -180")
  //   .max(180, "Longitude must be less than or equal to 180")
  //   .required("Longitude is required"),
  pAddress: yup.string().required(<FormattedLabel id="Vcaddres" />),
  pCityName: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="enterCity" />),
  pState: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="state" />),
  pPincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required(),
  // pLattitude: yup
  //   .number()
  //   .min(-90, "Latitude must be greater than or equal to -90")
  //   .max(90, "Latitude must be less than or equal to 90")
  //   .required("Latitude is required"),
  // pLongitude: yup
  //   .number()
  //   .min(-180, "Longitude must be greater than or equal to -180")
  //   .max(180, "Longitude must be less than or equal to 180")
  //   .required("Longitude is required"),
});
