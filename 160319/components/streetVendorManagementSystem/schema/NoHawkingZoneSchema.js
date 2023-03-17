import * as yup from "yup";

// schema - validation
let NoHawkingZoneSchema = yup.object().shape({
  noHawkingZoneprefix: yup
    .string()
    .required("No Hawking Zone Prefix is Required !!!"),
  gisId: yup.string().required("GIS Id is Required !!!"),
  zone: yup.string().nullable().required("Zone  is Required !!!"),
  citySurveyNo: yup.string().required("City Survey No is Required !!!"),
  noHawkingZoneName: yup
    .string()
    .required("No Hawking Zone Name is Required !!!"),
  areaName: yup.string().required("Area Name is Required !!!"),
  // capacityOfHawkingZone:yup.number().typeError('you must specify a number').required("Capacity Of Hawking Zone"),
  // noOfHawkersPresent:yup.number().typeError('you must specify a number').required("No Of Hawkers Present"),
  declarationOrderNo: yup
    .string()
    .required("Declaration Order No is Required !!!"),
  declarationOrder: yup.string().required("Declaration Order is Required !!!"),
  // constraint1: yup.string().required("Constraint is Required !!!"),
  noHawkingZoneInfo: yup
    .string()
    .required("No Hawking Zone Info is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  declarationDate: yup
    .string()
    .nullable()
    .required("Declaration Date is Required !!!"),
});

export default NoHawkingZoneSchema;
