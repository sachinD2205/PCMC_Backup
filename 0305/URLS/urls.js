// //for uat
const urls = {
  AuthURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/cfc/cfc/auth`,
  CFCURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/cfc/cfc/api`,
  MR: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/mr/mr/api`,
  FbsURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/fbs/fbs/api`,
  TPURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/tp/tp/api`,
  SSLM: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/sslm/sslm/api`,
  HMSURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/hw/hw/api`,
  SPURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/sp/sp/api`,
  PTAXURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/ptax/ptax/api`,
  LCMSURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/lc/lc/api`,
  MSURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/ms/ms/api`,
  SCHOOL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/sms/sms/api`,
  LMSURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/lms/lms/api`,
  VMS: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/vms/vms/api`,
  GM: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/gm/gm/api`,
  NRMS: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/nrms/nrms/api`,
  REURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/re/re/api`,
  PABBMURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/pabbm/pabbm/api`,
  RTI: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/rti/rti/api`,
  SLUMURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/sb/sb/api`,
  EBPSURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/ebp/ebp/api`,
  SMURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/sm/sm/api`,
  SLB: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/slb/slb/api`,
  BSUPURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/bsup/bsup/api`,
  BaseURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/cfc/cfc/api/master`,
  CfcURLMaster: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/cfc/cfc/api/master`,
  //change
  // CFCURL: `${process.env.NEXT_PUBLIC_BACKEND_API_GATEWAY}/cfc/cfc/api/file`, //replace
};

// // for local
// const urls = {
//   AuthURL: "http://localhost:8090/cfc/auth",
//   CFCURL: "http://localhost:8090/cfc/api",
//   MR: "http://localhost:8091/mr/api",
//   GM: "http://103.132.2.83:9003/gm/api",
//   FbsURL: "http://localhost:8092/fbs/api",
//   TPURL: "http://localhost:8093/tp/api",
//   SSLM: "http://localhost:8094/sslm/api",
//   HMSURL: "http://localhost:8095/hw/api",
//   SPURL: "http://localhost:8096/sp/api",
//   PTAXURL: "http://localhost:8097/ptax/api",
//   LCMSURL: "http://localhost:8098/lc/api",
//   MSURL: "http://localhost:8099/ms/api",
//   PABBMURL: "http://localhost:9003/pabbm/api",
//   BSUPURL: "http://103.132.2.83:9012/bsup/api",
//   NRMS: "http://localhost:9004/nrms/api",
//   REURL: "http://localhost:9004/re/api",
//   //change
//   API_file: "http://localhost:8090/cfc/api/file", //replace
//   BaseURL: "http://localhost:8090/cfc/api/master", //replace this to CFC url (CFCURL)
//   CfcURLMaster: "http://localhost:8090/cfc/api/master", //replace this to CFC url (CFCURL)
//   CfcURLTransaction: "http://localhost:8090/cfc/api/transaction", //replace this to CFC url (CFCURL)
//   APPURL: "http://localhost:4000",
// };

export default urls;
