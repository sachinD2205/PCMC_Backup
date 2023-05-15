import * as yup from "yup";

let Schema = yup.object().shape({
  // wardKey: yup.string().required("Ward name is Required !!!"),
  // budgetProvision: yup.string().required("Budget Provision is Required !!!"),
  billDescription: yup.string().required("Bill Description is Required !!!"),
  newspaperName: yup.string().required("News Paper Name is Required !!!"),
  billAmount: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError()
    .required("Bill Amount is Required !!!"),
  budgetAmountAfterPriviousBillPaymentDeduction: yup
    .string()
    .required("Budget Amount After Privious Bill Payment Deduction is Required !!!"),
  budgetAmountAfterCurrentBillPaymentDeduction: yup
    .string()
    .required("Budget Amount After Current Bill Payment Deduction is Required !!!"),
  billAppovalDate: yup
    .date()
    .typeError("Enter Valid Date !!!")
    .required("Bill Approval Date is Required !!!"),
  billAppovalOfficerName: yup.string().required("Bill Approval Officer Name is Required !!!"),
  remark: yup.string().required("Remark Name is Required !!!"),

  // newsAdvertisementSubject: yup.string().required("News Advertisement Subject is Required !!!"),
  // newsAdvertisementDescription: yup.string().required("news Advertisement Description is Required !!!"),
  // workName: yup.string().required("Work Name is Required !!!"),
  // rotationGroupKey: yup.string().required("Select rotation Group is Required !!!"),
  // rotationSubGroupKey: yup.string().required("Select rotation SubGroup is Required !!!"),
  // newsPaperLevel: yup.string().required("Select news Paper Level is Required !!!"),
  // standardFormatSize: yup.string().required("Select standard Format Size is Required !!!"),

  budgetProvision: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError()
    .required("Budget Provision is Required !!!"),
});

export default Schema;
