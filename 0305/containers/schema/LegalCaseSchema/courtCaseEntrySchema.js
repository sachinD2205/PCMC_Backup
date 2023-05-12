import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

export let courtCaseEntryAdvocateDetailsSchema = yup.object().shape({
  // //  advocateName
  advocateName: yup
    .string()
    .required(<FormattedLabel id='advocateNameValidation' />),

    // opponentAdvocate

    opponentAdvocate: yup
    .string()
    .matches(
      // /^[aA-zZ\s]*$/,
      /^[a-zA-Z ]*$/,
  
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    ).required(<FormattedLabel id="opponentAdvocate" />),



   // opponentAdvocateMr

    opponentAdvocateMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F\s]*$/,
      /^[\u0900-\u097F\s]*$/,
 
      'Must be only marathi characters/ फक्त मराठी शब्द',
      ).required(<FormattedLabel id="opponentAdvocateMr" />),


      // concernPerson
      concernPerson: yup
    .string()
    .matches(
      // /^[aA-zZ\s]*$/,
      /^[a-zA-Z0 ]*$/,
  
      'Must be only english characters / फक्त इंग्लिश शब्द ',
    ).required(<FormattedLabel id="concernPerson" />),

    
    // concernPersonMr
    concernPersonMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F\s]*$/,
      /^[\u0900-\u097F0\s]*$/,
 
      'Must be only marathi characters/ फक्त मराठी शब्द',
      ).required(<FormattedLabel id="concernPersonMr" />),
 
   // appearanceDate
  appearanceDate: yup
    .date()
    .required(<FormattedLabel id='appearanceDateValidation' />)
    .typeError("appearance date is required/दिसण्याची तारीख आवश्यक आहे !!!"),


  // // department
  department: yup
    .string()
    .required(<FormattedLabel id='departmentValidation' />),
});

// caseDetailsSchema
export let courtCaseDetailsSchema = yup.object().shape({
  // caseNumber
  caseNumber: yup
    .string()
    .required(<FormattedLabel id='caseNumberValidation' />)
    .matches(
      /^[a-zA-Z0-9]+$/,
      // /^[0-9]+$/,
      "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
    )
    .typeError(),

//   // year
  year: yup.string().required(<FormattedLabel id='yearValidation' />),
//   // court
  court: yup.string().required(<FormattedLabel id='courtNameValidation' />),
//   // priviouseCourtName
  // priviouseCourtName: yup
  //   .string()
  //   .required(<FormattedLabel id='priviouseCourtNameValidation' />),

//   // caseReference
  // caseReference: yup
  //   .string()
  //   .required(<FormattedLabel id='caseReferenceValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),

//   // caseMainType
  caseMainType: yup
    .string()
    .required(<FormattedLabel id='caseMainTypeValidation' />),
//   // subType
  subType: yup.string().required(<FormattedLabel id='caseSubTypeValidation' />),
//   // stampNo
  stampNo: yup
    .string()
    .required(<FormattedLabel id='stampNoValidation' />)
    .matches(
      /^[0-9]+$/,
      "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
    )
    .typeError(),
//   // fillingDate
  fillingDate: yup
    .date()
    .required(<FormattedLabel id='fillingDateValidation' />)
    .typeError("filing Date is required/दाखल करण्याची तारीख आवश्यक आहे !!!"),
//   // filedBy
  filedBy: yup.string().required(<FormattedLabel id='filedByValidation' />),
//   // filedByMr
  filedByMr: yup.string().required(<FormattedLabel id='filedByValidation' />),
//   // filedAgainst
  filedAgainst: yup
    .string()
    .required(<FormattedLabel id='filedAgainstValidation' />),
//   // filedAgainstMr
  filedAgainstMr: yup
    .string()
    .required(<FormattedLabel id='filedAgainstValidation' />),
//   // caseDetails
  caseDetails: yup
    .string()
    .required(<FormattedLabel id='caseDetailsValidation' />),
});

// export let courtCaseEntryBankDetailsSchema = yup.object().shape({
//   // bankName
//   bankName: yup.string().required(<FormattedLabel id='bankNameValidation' />),
//   // accountNo
//   accountNo: yup
//     .string()
//     .required(<FormattedLabel id='accountNoValidation' />)
//     .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
//     .min(
//       12,
//       "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा",
//     )
//     .max(
//       17,
//       "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा",
//     )
//     .typeError(<FormattedLabel id='accountNoValidation' />),
//   //bankIFSCCode
//   bankIFSCCode: yup
//     .string()
//     .required(<FormattedLabel id='ifscCodeValidation' />),
//   // bankMICRCode
//   bankMICRCode: yup
//     .string()
//     .required(<FormattedLabel id='bankMICRCodeValidation' />),
// });

export let coutrCaseEntryBillDetailsSchema = yup.object().shape({
  // // hawkingzoneName
  // hawkingZoneName: yup
  //   .string()
  //   .required(<FormattedLabel id='caseNumberValidation' />),
  // // paidAmount
  // paidAmount: yup
  //   .string()
  //   .required(<FormattedLabel id='paidAmountValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),
  // // billAmount
  // billAmount: yup
  //   .string()
  //   .required(<FormattedLabel id='billAmountValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),
  // // caseMainType
  // caseMainType: yup
  //   .string()
  //   .required(<FormattedLabel id='caseMainTypeValidation' />),
  // // caseSubType
  // caseSubType: yup
  //   .string()
  //   .required(<FormattedLabel id='caseSubTypeValidation' />),
  // // caseFees
  // caseFees: yup
  //   .string()
  //   .required(<FormattedLabel id='caseFeesValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   ),
  // // pendingAmount
  // pendingAmount: yup
  //   .string()
  //   .required(<FormattedLabel id='pendingAmountValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),
  // // billCreatedDateTime
  // billCreatedDateTime: yup
  //   .date()
  //   .required(<FormattedLabel id='billCreatedDateTimeValidation' />)
  //   .typeError(
  //     "bill created date is required/बिल तयार करण्याची तारीख आवश्यक आहे !!!",
  //   ),
});

export let demandBillDetailsSchema1 = yup.object().shape({
  // // hawkingzoneName
  // hawkingZoneName: yup
  //   .string()
  //   .required(<FormattedLabel id='caseNumberValidation' />),
  // // paidAmount
  // paidAmount: yup
  //   .string()
  //   .required(<FormattedLabel id='paidAmountValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),
  // // billAmount
  // billAmount: yup
  //   .string()
  //   .required(<FormattedLabel id='billAmountValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),
  // // caseMainType
  // caseMainType: yup
  //   .string()
  //   .required(<FormattedLabel id='caseMainTypeValidation' />),
  // // caseSubType
  // caseSubType: yup
  //   .string()
  //   .required(<FormattedLabel id='caseSubTypeValidation' />),
  // // caseFees
  // caseFees: yup
  //   .string()
  //   .required(<FormattedLabel id='caseFeesValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   ),
  // // pendingAmount
  // pendingAmount: yup
  //   .string()
  //   .required(<FormattedLabel id='pendingAmountValidation' />)
  //   .matches(
  //     /^[0-9]+$/,
  //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   )
  //   .typeError(),
  // // billCreatedDateTime
  // billCreatedDateTime: yup
  //   .date()
  //   .required(<FormattedLabel id='billCreatedDateTimeValidation' />)
  //   .typeError(
  //     "bill created date is required/बिल तयार करण्याची तारीख आवश्यक आहे !!!",
  //   ),
});

//   error={!!errors?.advocateName}
//             helperText={
//               errors?.advocateName ? errors?.advocateName?.message : null
// }
//           error = {!!errors?.caseNumber}
//            <FormHelperText>
//                       {errors?.caseNumber
//                         ? errors?.caseNumber?.message
//                         : null}
//                     </FormHelperText>



// parawiseReportForClerk
// export let parawiseReportForClerk = yup.object().shape({
//   // parawiseReportRemarkClerk
//   parawiseReportRemarkClerk: yup
//     .string()
//     .matches(
//       // /^[aA-zZ\s]*$/,
//       /^[a-zA-Z0-9 ]*$/,
  
//       'Must be only english characters / फक्त इंग्लिश शब्द ',
//     ).required(<FormattedLabel id="parawiseReportRemarkClerk" />),

//     // parawiseReportRemarkClerkMr
//     parawiseReportRemarkClerkMr: yup
//     .string()
//     .matches(
//       // /^[\u0900-\u097F\s]*$/,
//       /^[\u0900-\u097F0-9\s]*$/,
  
  
//       'Must be only marathi characters/ फक्त मराठी शब्द',
//       ).required(<FormattedLabel id="parawiseReportRemarkClerkMr" />),


//       // parawiseReportRemarkHod
//       parawiseReportRemarkHod: yup
//     .string()
//     .matches(
//       // /^[aA-zZ\s]*$/,
//       /^[a-zA-Z0-9 ]*$/,
  
//       'Must be only english characters / फक्त इंग्लिश शब्द ',
//     ).required(<FormattedLabel id="hodRemarksEn" />),

//     // parawiseReportRemarkHodMr
//     parawiseReportRemarkHodMr: yup
//     .string()
//     .matches(
//       // /^[\u0900-\u097F\s]*$/,
//       /^[\u0900-\u097F0-9\s]*$/,
  
  
//       'Must be only marathi characters/ फक्त मराठी शब्द',
//       ).required(<FormattedLabel id="hodRemarksMr" />),


//       // parawiseReportRemarkClerk
//       parawiseReportRemarkClerk: yup
//       .string()
//       .matches(
//         // /^[aA-zZ\s]*$/,
//         /^[a-zA-Z0-9 ]*$/,
    
//         'Must be only english characters / फक्त इंग्लिश शब्द ',
//       ).required(<FormattedLabel id="clerkRemarkEn" />),


  

// });