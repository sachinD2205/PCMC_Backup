import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";
import urls from "../../../URLS/urls";

// Main Component - Clerk
const Index = () => {
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);

  const [dataSource, setDataSource] = useState([]);

  const [dataSourcei, setDataSourceI] = useState([]);
  const [dataSourcer, setDataSourceR] = useState([]);
  const [dataSourcea, setDataSourceA] = useState([]);
  const [dataSourcet, setDataSourceT] = useState([]);

  const [showIncoming, setShowIncoming] = useState();
  const [showApproved, setShowApproved] = useState();
  const [showReverted, setShowReverted] = useState();
  const [showTotal, setShowTotal] = useState();

  const [serviceList, setServiceList] = useState([]);


  const [pendingApplication, setPendingApplication] = useState(0);
  const [rejectedApplication, setRejectedApplication] = useState(0);
  const [approvedApplication, setApprovedApplication] = useState(0);
  const [totalApplication, setTotalApplication] = useState(0);
  const [nmrstatuses, setNmrStatuses] = useState([]);

  const [nmrauthority, setNmrAuthority] = useState([]);
  const [mbrauthority, setMbrAuthority] = useState([]);
  const [mmcauthority, setMmcAuthority] = useState([]);
  const [mmbcauthority, setMmbcAuthority] = useState([]);
  const [rmcauthority, setRmcAuthority] = useState([]);
  const [rmbcauthority, setRmbcAuthority] = useState([]);

  useEffect(() => {
    let nmr = user?.menus?.find((r) => r.serviceId == 10)?.roles;
    let rmc = user?.menus?.find((r) => r.serviceId == 11)?.roles;
    let mmc = user?.menus?.find((r) => r.serviceId == 12)?.roles;
    let rmbc = user?.menus?.find((r) => r.serviceId == 14)?.roles;
    let mmbc = user?.menus?.find((r) => r.serviceId == 15)?.roles;
    let mbr = user?.menus?.find((r) => r.serviceId == 67)?.roles;
    console.log("nmr", nmr);
    console.log("rmc", rmc);
    console.log("mmc", mmc);
    console.log("rmbc", rmbc);
    console.log("mmbc", mmbc);
    console.log("mbr", mbr);
    setNmrAuthority(nmr);
    setRmcAuthority(rmc);
    setMmcAuthority(mmc);
    setRmbcAuthority(rmbc);
    setMmbcAuthority(mmbc);
    setMbrAuthority(mbr);

    // let nmrStatuses = nmr.map((n) => {
    //   let stringss = "";
    //   switch (n) {
    //     case "DOCUMENT_CHECKLIST":
    //       stringss = stringss.concat("APPLICATION_CREATED,CITIZEN_SEND_TO_JR_CLERK");
    //       break;
    //     case "DOCUMENT_VERIFICATION":
    //       stringss = stringss.concat("APPOINTMENT_SCHEDULED,CITIZEN_SEND_BACK_TO_SR_CLERK");
    //       break;
    //     case "FINAL_APPROVAL":
    //       stringss = stringss.concat("APPLICATION_SENT_TO_CMO");
    //       break;
    //     case "LOI_GENERATION":
    //       stringss = stringss.concat("CMO_APPROVED");
    //       break;
    //     case "CASHIER":
    //       stringss = stringss.concat("LOI_GENERATED");
    //       break;
    //     case "CERTIFICATE_ISSUER":
    //       stringss = stringss.concat("PAYEMENT_SUCCESSFULL");
    //       break;
    //     case "APPLY_DIGITAL_SIGNATURE":
    //       stringss = stringss.concat("CERTIFICATE_GENERATED");
    //       break;
    //     case "ADMIN":
    //       stringss = stringss.concat("APPLICATION_CREATED,CITIZEN_SEND_TO_JR_CLERK,APPOINTMENT_SCHEDULED,CITIZEN_SEND_BACK_TO_SR_CLERK,APPLICATION_SENT_TO_CMO,CMO_APPROVED,LOI_GENERATED,LOI_GENERATED,PAYEMENT_SUCCESSFULL,CERTIFICATE_GENERATED")
    //   }
    //   return stringss;
    // })
    // console.log("nmrStatuses.toString()", nmrStatuses.toString());
    // setNmrStatuses(nmrStatuses.toString());
  }, [user?.menus]);

  //new marriage
  let nmrcreated = [];
  let apptScheduled = [];
  let nmrclkVerified = [];
  let nmrcmolaKonte = [];
  let nmrcmoVerified = [];
  let nmrloiGenerated = [];
  let nmrpaymentCollected = [];
  let nmrcertificateIssued = [];
  let nmrcertificateGenerated = [];

  //marriage board
  let mbrcreated = [];
  let mbrclkVerified = [];
  let mbrcmolaKonte = [];
  let mbrcmoVerified = [];
  let mbrloiGenerated = [];
  let mbrpaymentCollected = [];
  let mbrcertificateGenerated = [];
  let mbrcertificateIssued = [];

  //modification of marriage
  let mmccreated = [];
  let mmcclkVerified = [];
  let mmccmolaKonte = [];
  let mmccmoVerified = [];
  let mmcloiGenerated = [];
  let mmcpaymentCollected = [];
  let mmccertificateIssued = [];
  let mmccertificateGenerated = [];

  //modification of marriage board
  let mmbccreated = [];
  let mmbcclkVerified = [];
  let mmbccmolaKonte = [];
  let mmbccmoVerified = [];
  let mmbcloiGenerated = [];
  let mmbcpaymentCollected = [];
  let mmbccertificateIssued = [];
  let mmbccertificateGenerated = [];

  //reissue of marriage
  let rmcpaymentCollected = [];

  //renewal of marriage board
  let rmbcpaymentCollected = [];

  //finalUnsorted datasource
  let finalMerged = [];

  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getMyApplications = async () => {
    let incoming = []
    let rejected = []
    let approved = []
    //incoming
    axios
      .get(`${urls.MR}/transaction/prime/getDashboardDtlNew`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "whichOne": "INCOMING",
        },
      })
      .then((resp) => {
        incoming = resp.data.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.applicationId,
            serviceName: serviceList.find((s) => s.id == r.serviceId)?.serviceName,
            serviceNameMr: serviceList.find((s) => s.id == r.serviceId)?.serviceNameMr,
          };
        });
        setDataSource(incoming);
        setDataSourceI(incoming);
        setPendingApplication(incoming.length);
      });

    //revert
    axios
      .get(`${urls.MR}/transaction/prime/getDashboardDtlNew`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "whichOne": "REVERT",
        },
      })
      .then((resp) => {
        rejected = resp.data.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.applicationId,
            serviceName: serviceList.find((s) => s.id == r.serviceId)?.serviceName,
            serviceNameMr: serviceList.find((s) => s.id == r.serviceId)?.serviceNameMr,
          };
        })
        setDataSourceR(rejected);
        setRejectedApplication(rejected.length);
      });
    //approved
    axios
      .get(`${urls.MR}/transaction/prime/getDashboardDtlNew`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          whichOne: "APPROVED",
        },
      })
      .then((resp) => {
        approved = resp.data.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.applicationId,
            serviceName: serviceList.find((s) => s.id == r.serviceId)?.serviceName,
            serviceNameMr: serviceList.find((s) => s.id == r.serviceId)?.serviceNameMr,
          };
        });
        setDataSourceA(approved);
        setApprovedApplication(approved.length);
      });

    console.log("Total Applications", incoming.length + rejected.length + approved.length);
    setTotalApplication(incoming.length + rejected.length + approved.length);
  }






  // const getMyApplications = async () => {
  //   axios
  //     .get(`${urls.MR}/transaction/prime/getDashboardDtl`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     })
  //     .then((resp) => {
  // resp.data.map((row) => {
  // if (row.serviceId == 10) {
  //   if (
  //     (nmrauthority.includes("DOCUMENT_CHECKLIST") || nmrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_CREATED"
  //   ) {
  //     nmrcreated = [...nmrcreated, row];
  //   } else if (
  //     (nmrauthority.includes("APPOINTMENT_SCHEDULE") || nmrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK"
  //   ) {
  //     nmrclkVerified = [...nmrclkVerified, row];
  //   } else if (
  //     (nmrauthority.includes("DOCUMENT_VERIFICATION") || nmrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPOINTMENT_SCHEDULED"
  //   ) {
  //     apptScheduled = [...apptScheduled, row];
  //   } else if (
  //     (nmrauthority.includes("FINAL_APPROVAL") || nmrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_SENT_TO_CMO"
  //   ) {
  //     nmrcmolaKonte = [...nmrcmolaKonte, row];
  //   } else if (
  //     (nmrauthority.includes("LOI_GENERATION") || nmrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "CMO_APPROVED"
  //   ) {
  //     nmrcmoVerified = [...nmrcmoVerified, row];
  //   } else if (
  //     (nmrauthority.includes("CASHIER") || nmrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "LOI_GENERATED"
  //   ) {
  //     nmrloiGenerated = [...nmrloiGenerated, row];
  //   } else if (
  //     (nmrauthority.includes("CERTIFICATE_ISSUER") || nmrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "PAYEMENT_SUCCESSFULL"
  //   ) {
  //     nmrpaymentCollected = [...nmrpaymentCollected, row];
  //   }
  // } else if (row.serviceId == 11) {
  //   if (
  //     (rmcauthority.includes("CASHIER") || rmcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "PAYEMENT_SUCCESSFULL"
  //   ) {
  //     rmcpaymentCollected = [...rmcpaymentCollected, row];
  //   }
  // } else if (row.serviceId == 12) {
  //   if (
  //     (mmcauthority.includes("DOCUMENT_CHECKLIST") || mmcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_CREATED"
  //   ) {
  //     mmccreated = [...mmccreated, row];
  //   } else if (
  //     (mmcauthority.includes("DOCUMENT_VERIFICATION") || mmcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK"
  //   ) {
  //     mmcclkVerified = [...mmcclkVerified, row];
  //   } else if (
  //     (mmcauthority.includes("FINAL_APPROVAL") || mmcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_SENT_TO_CMO"
  //   ) {
  //     mmccmolaKonte = [...mmccmolaKonte, row];
  //   } else if (
  //     (mmcauthority.includes("LOI_GENERATION") || mmcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "CMO_APPROVED"
  //   ) {
  //     mmccmoVerified = [...mmccmoVerified, row];
  //   } else if (
  //     (mmcauthority.includes("CASHIER") || mmcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "LOI_GENERATED"
  //   ) {
  //     mmcloiGenerated = [...mmcloiGenerated, row];
  //   } else if (
  //     (mmcauthority.includes("CERTIFICATE_ISSUER") || mmcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "PAYEMENT_SUCCESSFULL"
  //   ) {
  //     mmcpaymentCollected = [...mmcpaymentCollected, row];
  //   }
  // } else if (row.serviceId == 14) {
  //   if (
  //     (rmbcauthority.includes("CASHIER") || rmbcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "PAYEMENT_SUCCESSFULL"
  //   ) {
  //     rmbcpaymentCollected = [...rmbcpaymentCollected, row];
  //   }
  // } else if (row.serviceId == 15) {
  //   if (
  //     (mmbcauthority.includes("DOCUMENT_CHECKLIST") || mmbcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_CREATED"
  //   ) {
  //     mmbccreated = [...mmbccreated, row];
  //   } else if (
  //     (mmbcauthority.includes("DOCUMENT_VERIFICATION") || mmbcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK"
  //   ) {
  //     mmbcclkVerified = [...mmbcclkVerified, row];
  //   } else if (
  //     (mmbcauthority.includes("FINAL_APPROVAL") || mmbcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_SENT_TO_CMO"
  //   ) {
  //     mmbccmolaKonte = [...mmbccmolaKonte, row];
  //   } else if (
  //     (mmbcauthority.includes("LOI_GENERATION") || mmbcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "CMO_APPROVED"
  //   ) {
  //     mmbccmoVerified = [...mmbccmoVerified, row];
  //   } else if (
  //     (mmbcauthority.includes("CASHIER") || mmbcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "LOI_GENERATED"
  //   ) {
  //     mmbcloiGenerated = [...mmbcloiGenerated, row];
  //   } else if (
  //     (mmbcauthority.includes("CERTIFICATE_ISSUER") || mmbcauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "PAYEMENT_SUCCESSFULL"
  //   ) {
  //     mmbcpaymentCollected = [...mmbcpaymentCollected, row];
  //   }
  // } else if (row.serviceId == 67) {
  //   if (
  //     (mbrauthority.includes("DOCUMENT_CHECKLIST") || mbrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_CREATED"
  //   ) {
  //     mbrcreated = [...mbrcreated, row];
  //   } else if (
  //     (mbrauthority.includes("DOCUMENT_VERIFICATION") || mbrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK"
  //   ) {
  //     mbrclkVerified = [...mbrclkVerified, row];
  //   } else if (
  //     (mbrauthority.includes("FINAL_APPROVAL") || mbrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "APPLICATION_SENT_TO_CMO"
  //   ) {
  //     mbrcmolaKonte = [...mbrcmolaKonte, row];
  //   } else if (
  //     (mbrauthority.includes("LOI_GENERATION") || mbrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "CMO_APPROVED"
  //   ) {
  //     mbrcmoVerified = [...mbrcmoVerified, row];
  //   } else if (
  //     (mbrauthority.includes("CASHIER") || mbrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "LOI_GENERATED"
  //   ) {
  //     mbrloiGenerated = [...mbrloiGenerated, row];
  //   } else if (
  //     (mbrauthority.includes("CERTIFICATE_ISSUER") || mbrauthority.includes("ADMIN")) &&
  //     row.applicationStatus === "PAYEMENT_SUCCESSFULL"
  //   ) {
  //     mbrpaymentCollected = [...mbrpaymentCollected, row];
  //   }
  // }
  // });
  // console.log("clg1", nmrcreated);
  // finalMerged = [
  //   ...nmrcreated,
  //   ...apptScheduled,
  //   ...nmrclkVerified,
  //   ...nmrcmolaKonte,
  //   ...nmrcmoVerified,
  //   ...nmrloiGenerated,
  //   ...nmrpaymentCollected,
  //   ...nmrcertificateIssued,
  //   ...nmrcertificateGenerated,

  //   ...mmccreated,
  //   ...mmcclkVerified,
  //   ...mmccmolaKonte,
  //   ...mmccmoVerified,
  //   ...mmcloiGenerated,
  //   ...mmcpaymentCollected,
  //   ...mmccertificateIssued,
  //   ...mmbccertificateGenerated,

  //   ...mbrcreated,
  //   ...mbrclkVerified,
  //   ...mbrcmolaKonte,
  //   ...mbrcmoVerified,
  //   ...mbrloiGenerated,
  //   ...mbrpaymentCollected,
  //   ...mbrcertificateIssued,
  //   ...mbrcertificateGenerated,

  //   ...mmbccreated,
  //   ...mmbcclkVerified,
  //   ...mmbccmolaKonte,
  //   ...mmbccmoVerified,
  //   ...mmbcloiGenerated,
  //   ...mmbcpaymentCollected,
  //   ...mmbccertificateIssued,
  //   ...mmbccertificateGenerated,

  //   ...rmcpaymentCollected,

  //   ...rmbcpaymentCollected,
  // ];


  // let sorted = finalMerged.sort((a, b) =>
  //   b.applicationDate > a.applicationDate ? 1 : a.applicationDate > b.applicationDate ? -1 : 0,
  // );

  // console.log("finalMerged", sorted);

  //   setDataSource(
  //     sorted.map((r, i) => {
  //       return {
  //         srNo: i + 1,
  //         ...r,
  //         id: r.applicationId,
  //         serviceName: serviceList.find((s) => s.id == r.serviceId)?.serviceName,
  //         serviceNameMr: serviceList.find((s) => s.id == r.serviceId)?.serviceNameMr,
  //       };
  //     }),
  //   );
  // });
  // 
  // 
  // });
  // };

  useEffect(() => {
    getServiceName();
  }, []);

  useEffect(() => {
    getMyApplications();
  }, [serviceList]);

  useEffect(() => {
    console.log("Total Applications GG", dataSourcei.length + dataSourcer.length + dataSourcea.length);
    let total = dataSourcei.length + dataSourcer.length + dataSourcea.length;
    let totalApplicationInDS = [...dataSourcei, ...dataSourcea, ...dataSourcer]

    setTotalApplication(total);

    console.log("dataSourcei", dataSourcei);
    console.log("dataSourcer", dataSourcer);
    console.log("dataSourcea", dataSourcea);
    console.log("dataSourcet", totalApplicationInDS);

    setDataSourceT(totalApplicationInDS.map((r, i) => {
      return {
        ...r,
        srNo: i + 1,
        id: r.applicationId,
        serviceName: serviceList.find((s) => s.id == r.serviceId)?.serviceName,
        serviceNameMr: serviceList.find((s) => s.id == r.serviceId)?.serviceNameMr,
      }
    }));

  }, [dataSourcei, dataSourcer, dataSourcea])

  // useEffect(() => {

  // setTotalApplication(dataSource.filter((d) => nmrstatuses.includes(d.applicationStatus)).length);

  // setPendingApplication(dataSource.filter((d) => nmrstatuses.includes(d.applicationStatus)).length);

  // }, [dataSource]);

  // Columns
  const columns = [
    {
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 90,
    },
    {
      field: "applicationNumber",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 270,
    },
    {
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="serviceName" />,
      width: 290,
    },
    {
      field: "applicationDate",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 130,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="ApplicantName" />,
      width: 270,
    },

    {
      field: "applicationStatus",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="statusDetails" />,
      width: 280,
    },

    // {
    //   field: 'actions',
    //   headerAlign: 'center',
    //   align: 'center',
    //   headerName: <FormattedLabel id="actions" />,
    //   width: 280,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (record) => {
    //     return (
    //       <>
    //         {record.row.serviceId == 10 && (
    //           <div className={styles.buttonRow}>
    //             {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //               (nmrauthority?.includes('DOCUMENT_CHECKLIST') ||
    //                 nmrauthority?.includes('ADMIN')) && (
    //                 <IconButton
    //                   onClick={() =>
    //                     router.push({
    //                       pathname:
    //                         '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny',
    //                       query: {
    //                         disabled: true,
    //                         applicationId: record.row.id,
    //                         serviceId: record.row.serviceId,
    //                         // ...record.row,
    //                         role: 'DOCUMENT_CHECKLIST',
    //                         pageMode: 'DOCUMENT CHECKLIST',
    //                         pageModeMr: 'कागदपत्र तपासणी',
    //                       },
    //                     })
    //                   }
    //                 >
    //                   <Button
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     variant="contained"
    //                     color="primary"
    //                   >
    //                     Document Checklist
    //                   </Button>
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus ===
    //               'APPLICATION_SENT_TO_SR_CLERK' &&
    //               (nmrauthority?.includes('APPOINTMENT_SCHEDULE') ||
    //                 nmrauthority?.includes('ADMIN')) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<EventIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     onClick={() =>
    //                       router.push({
    //                         pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slot`,
    //                         query: {
    //                           appId: record.row.id,
    //                           role: 'APPOINTMENT_SCHEDULE',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     Schedule
    //                   </Button>
    //                 </IconButton>
    //               )}
    //             {record?.row?.applicationStatus === 'APPOINTMENT_SCHEDULED' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //               ) && (
    //                 <>
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<CheckIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny',
    //                           query: {
    //                             ...record.row,
    //                             applicationId: record.row.id,
    //                             serviceId: record.row.serviceId,

    //                             role: 'DOCUMENT_VERIFICATION',
    //                             pageMode: 'APPLICATION VERIFICATION',
    //                             pageModeMr: 'अर्ज पडताळणी',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       Verify
    //                     </Button>
    //                   </IconButton>
    //                 </>
    //               )}

    //             {record?.row?.applicationStatus === 'APPLICATION_SENT_TO_CMO' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<CheckIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny',
    //                         query: {
    //                           ...record.row,
    //                           applicationId: record.row.id,
    //                           serviceId: record.row.serviceId,
    //                           role: 'FINAL_APPROVAL',
    //                           pageMode: 'FINAL VERIFICATION',
    //                           pageModeMr: 'अंतिम पडताळणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     CMO VERIFY
    //                   </Button>
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<BrushIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     //  color="success"
    //                     // onClick={() => viewLOI(record.row)}
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationComponent',
    //                         query: {
    //                           // ...record.row,
    //                           applicationId: record.row.id,
    //                           serviceId: record.row.serviceId,
    //                           // loiServicecharges: null,
    //                           role: 'LOI_GENERATION',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     GENERATE LOI
    //                   </Button>
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'CASHIER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<PaidIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/PaymentCollection',
    //                         query: {
    //                           ...record.row,
    //                           role: 'CASHIER',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     Collect Payment
    //                   </Button>
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   {/* <Buttonremarks */}
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     GENERATE CERTIFICATE
    //                   </Button>
    //                   {/* </Buttonremarks> */}
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'CERTIFICATE_ISSUED' &&
    //               nmrauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     DOWNLOAD CERTIFICATE
    //                   </Button>
    //                 </IconButton>
    //               )}
    //           </div>
    //         )}
    //         {record.row.serviceId == 11 && (
    //           <>
    //             {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //               rmcauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   {/* <Buttonremarks */}
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     GENERATE CERTIFICATE
    //                   </Button>
    //                   {/* </Buttonremarks> */}
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'CERTIFICATE_ISSUED' &&
    //               rmcauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     DOWNLOAD CERTIFICATE
    //                   </Button>
    //                 </IconButton>
    //               )}
    //           </>
    //         )}
    //         {record.row.serviceId == 12 && (
    //           <>
    //             <div className={styles.buttonRow}>
    //               {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //                 (mmcauthority?.includes('DOCUMENT_CHECKLIST') ||
    //                   mmcauthority?.includes('ADMIN')) && (
    //                   <IconButton
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny',
    //                         query: {
    //                           disabled: true,
    //                           ...record.row,
    //                           role: 'DOCUMENT_CHECKLIST',
    //                           pageHeader: 'DOCUMENT CHECKLIST',
    //                           pageMode: 'Edit',
    //                           pageHeaderMr: 'कागदपत्र तपासणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     <Button
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       variant="contained"
    //                       color="primary"
    //                     >
    //                       Document Checklist
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_SR_CLERK' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname:
    //                               '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny',
    //                             query: {
    //                               // ...record.row,
    //                               id: record.row.id,
    //                               serviceId: record.row.serviceId,
    //                               serviceName: record.row.serviceName,
    //                               serviceNameMr: record.row.serviceNameMr,
    //                               role: 'DOCUMENT_VERIFICATION',

    //                               pageHeader: 'APPLICATION VERIFICATION',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         DOCUMENT VERIFICATION
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_CMO' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname:
    //                               '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny',
    //                             query: {
    //                               id: record.row.id,
    //                               serviceId: record.row.serviceId,
    //                               serviceName: record.row.serviceName,
    //                               serviceNameMr: record.row.serviceNameMr,
    //                               role: 'FINAL_APPROVAL',
    //                               pageHeader: 'FINAL APPROVAL',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         CMO VERIFY
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<BrushIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       //  color="success"
    //                       // onClick={() => viewLOI(record.row)}
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationComponent',
    //                           query: {
    //                             // ...record.row,
    //                             id: record.row.id,
    //                             serviceId: record.row.serviceId,
    //                             serviceName: record.row.serviceName,
    //                             serviceNameMr: record.row.serviceNameMr,
    //                             // loiServicecharges: null,
    //                             role: 'LOI_GENERATION',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       GENERATE LOI
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'CASHIER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<PaidIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/PaymentCollection',

    //                           query: {
    //                             // ...record.row,
    //                             role: 'CASHIER',
    //                             applicationId: record.row.id,
    //                             serviceId: 12,
    //                           },
    //                         })
    //                       }
    //                     >
    //                       Collect Payment
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //                 mmcauthority?.find(
    //                   (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       style={{
    //                         height: 'px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() => issueCertificate(record.row)}
    //                     >
    //                       GENERATE CERTIFICATE
    //                     </Button>
    //                   </IconButton>
    //                 )}
    //             </div>
    //           </>
    //         )}
    //         {record.row.serviceId == 14 && (
    //           <>
    //             {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //               rmbcauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   {/* <Buttonremarks */}
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     GENERATE CERTIFICATE
    //                   </Button>
    //                   {/* </Buttonremarks> */}
    //                 </IconButton>
    //               )}

    //             {record?.row?.applicationStatus === 'CERTIFICATE_ISSUED' &&
    //               rmbcauthority?.find(
    //                 (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //               ) && (
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     style={{
    //                       height: 'px',
    //                       width: '250px',
    //                     }}
    //                     color="success"
    //                     onClick={() => issueCertificate(record.row)}
    //                   >
    //                     DOWNLOAD CERTIFICATE
    //                   </Button>
    //                 </IconButton>
    //               )}
    //           </>
    //         )}
    //         {record.row.serviceId == 15 && (
    //           <>
    //             <div className={styles.buttonRow}>
    //               {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //                 (mmbcauthority?.includes('DOCUMENT_CHECKLIST') ||
    //                   mmbcauthority?.includes('ADMIN')) && (
    //                   <IconButton
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/scrutiny',
    //                         query: {
    //                           disabled: true,
    //                           ...record.row,
    //                           role: 'DOCUMENT_CHECKLIST',
    //                           pageHeader: 'DOCUMENT CHECKLIST',
    //                           pageMode: 'Edit',
    //                           pageHeaderMr: 'कागदपत्र तपासणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     <Button
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       variant="contained"
    //                       color="primary"
    //                     >
    //                       Document Checklist
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_SR_CLERK' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname: 'scrutiny/scrutiny',
    //                             query: {
    //                               ...record.row,
    //                               role: 'DOCUMENT_VERIFICATION',

    //                               pageHeader: 'APPLICATION VERIFICATION',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         DOCUMENT VERIFICATION
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_VERIFICATION_COMPLETED' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname: 'scrutiny/scrutiny',
    //                             query: {
    //                               ...record.row,
    //                               role: 'FINAL_APPROVAL',
    //                               pageHeader: 'FINAL APPROVAL',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         CMO VERIFY
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<BrushIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       //  color="success"
    //                       // onClick={() => viewLOI(record.row)}
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/LoiGenerationComponent',
    //                           query: {
    //                             // ...record.row,
    //                             id: record.row.id,
    //                             serviceName: record.row.serviceId,
    //                             // loiServicecharges: null,
    //                             role: 'LOI_GENERATION',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       GENERATE LOI
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'CASHIER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<PaidIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/PaymentCollection',

    //                           query: {
    //                             // ...record.row,
    //                             role: 'CASHIER',
    //                             applicationId: record.row.id,
    //                             serviceId: 15,
    //                           },
    //                         })
    //                       }
    //                     >
    //                       Collect Payment
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //                 mmbcauthority?.find(
    //                   (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       style={{
    //                         height: 'px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() => issueCertificate(record.row)}
    //                     >
    //                       GENERATE CERTIFICATE
    //                     </Button>
    //                   </IconButton>
    //                 )}
    //             </div>
    //           </>
    //         )}
    //         {record.row.serviceId == 67 && (
    //           <>
    //             <div className={styles.buttonRow}>
    //               {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //                 (mbrauthority?.includes('DOCUMENT_CHECKLIST') ||
    //                   mbrauthority?.includes('ADMIN')) && (
    //                   <IconButton
    //                     onClick={() =>
    //                       router.push({
    //                         pathname:
    //                           '/marriageRegistration/transactions/boardRegistrations/scrutiny/scrutiny',
    //                         query: {
    //                           disabled: true,
    //                           ...record.row,
    //                           role: 'DOCUMENT_CHECKLIST',
    //                           pageHeader: 'DOCUMENT CHECKLIST',
    //                           pageMode: 'Edit',
    //                           pageHeaderMr: 'कागदपत्र तपासणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     <Button
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       variant="contained"
    //                       color="primary"
    //                     >
    //                       Document Checklist
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_SR_CLERK' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname: 'scrutiny/scrutiny',
    //                             query: {
    //                               ...record.row,
    //                               role: 'DOCUMENT_VERIFICATION',

    //                               pageHeader: 'APPLICATION VERIFICATION',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         DOCUMENT VERIFICATION
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus ===
    //                 'APPLICATION_SENT_TO_CMO' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //                 ) && (
    //                   <>
    //                     <IconButton>
    //                       <Button
    //                         variant="contained"
    //                         endIcon={<CheckIcon />}
    //                         style={{
    //                           height: '30px',
    //                           width: '250px',
    //                         }}
    //                         onClick={() =>
    //                           router.push({
    //                             pathname: 'scrutiny/scrutiny',
    //                             query: {
    //                               ...record.row,
    //                               role: 'FINAL_APPROVAL',
    //                               pageHeader: 'FINAL APPROVAL',
    //                               pageMode: 'Edit',
    //                               pageHeaderMr: 'अर्ज पडताळणी',
    //                             },
    //                           })
    //                         }
    //                       >
    //                         CMO VERIFY
    //                       </Button>
    //                     </IconButton>
    //                   </>
    //                 )}

    //               {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<BrushIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationComponent',
    //                           query: {
    //                             id: record.row.id,
    //                             serviceName: record.row.serviceId,

    //                             role: 'LOI_GENERATION',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       GENERATE LOI
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'CASHIER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       endIcon={<PaidIcon />}
    //                       style={{
    //                         height: '30px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() =>
    //                         router.push({
    //                           pathname:
    //                             '/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection',

    //                           query: {
    //                             ...record.row,
    //                             role: 'CASHIER',
    //                           },
    //                         })
    //                       }
    //                     >
    //                       Collect Payment
    //                     </Button>
    //                   </IconButton>
    //                 )}

    //               {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'CERTIFICATE_GENERATED' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       style={{
    //                         height: 'px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() => issueCertificate(record.row)}
    //                     >
    //                       GENERATE CERTIFICATE
    //                     </Button>
    //                   </IconButton>
    //                 )}
    //               {record?.row?.applicationStatus === 'CERTIFICATE_GENERATED' &&
    //                 mbrauthority?.find(
    //                   (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //                 ) && (
    //                   <IconButton>
    //                     <Button
    //                       variant="contained"
    //                       style={{
    //                         height: 'px',
    //                         width: '250px',
    //                       }}
    //                       color="success"
    //                       onClick={() => issueCertificate(record.row)}
    //                     >
    //                       APPLY DIGITAL SIGNATURE
    //                     </Button>
    //                   </IconButton>
    //                 )}
    //             </div>
    //           </>
    //         )}
    //       </>
    //     )
    //   },
    // },
  ];

  return (
    <>
      <div>
        <Paper component={Box} squar="true" elevation={5} m={1} pt={2} pb={2} pr={2} pl={4}>
          <Grid container>
            {/** Applications Tabs */}
            <Grid item xs={12}>
              <h2 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>
                  {language == "en"
                    ? "Marriage Registration System Dashboard"
                    : "विवाह नोंदणी प्रणाली डॅशबोर्ड"}
                </b>
              </h2>
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{ height: "160px" }}
                component={Box}
                p={2}
                m={2}
                squar="true"
                elevation={5}
              // sx={{ align: "center" }}
              >
                <div className={styles.test}>
                  {/** Total Application */}
                  <div
                    className={styles.one}
                  // onClick={() => clerkTabClick('TotalApplications')}
                  >
                    <div className={styles.icono}>
                      <WcIcon color="secondary" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <strong align="center">{language == "en" ? "Total Application" : "एकूण अर्ज"}</strong>
                    </div>
                    <Button
                      onClick={() => setDataSource(dataSourcet)}
                    >
                      <Typography variant="h6" align="center" color="secondary">
                        {totalApplication}
                      </Typography>
                    </Button>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Approved Application */}
                  <div
                    className={styles.one}
                  // onClick={() => clerkTabClick('APPROVED')}
                  >
                    <div className={styles.icono}>
                      <ThumbUpAltIcon color="success" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <strong align="center">
                        {language == "en" ? "Approved Application" : "मंजूर अर्ज"}
                      </strong>
                    </div>
                    <Button
                      onClick={() => setDataSource(dataSourcea)}
                    >
                      <Typography variant="h6" align="center" color="green">
                        {approvedApplication}
                      </Typography>
                    </Button>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Pending Applications */}
                  <div
                    className={styles.one}
                  // onClick={() => clerkTabClick('PENDING')}
                  >
                    <div className={styles.icono}>
                      <PendingActionsIcon color="warning" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <strong align="center">
                        {language == "en" ? "Pending Application" : "प्रलंबित अर्ज"}
                      </strong>
                    </div>
                    <Button
                      onClick={() => setDataSource(dataSourcei)}
                    >
                      <Typography variant="h6" align="center" color="orange">
                        {pendingApplication}
                      </Typography>
                    </Button>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Rejected Application */}
                  <div
                    className={styles.one}
                  // onClick={() => clerkTabClick('REJECTED')}
                  >
                    <div className={styles.icono}>
                      <CancelIcon color="error" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <strong align="center">
                        {language == "en" ? "Rejected Application" : "नाकारलेले अर्ज"}
                      </strong>
                    </div>
                    <Button
                      onClick={() => setDataSource(dataSourcer)}
                    >
                      <Typography variant="h6" align="center" color="error">
                        {rejectedApplication}
                      </Typography>
                    </Button>
                  </div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </div>

      <Box
        style={{
          backgroundColor: "white",
          height: "auto",
          width: "auto",
          overflow: "auto",
        }}
      >
        <DataGrid
          rowHeight={70}
          getRowId={(row) => row.srNo}
          sx={{
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },

            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          autoHeight
          scrollbarSize={17}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box>
    </>
  );
};

export default Index;