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
  // const [nmrstatuses, setNmrStatuses] = useState([]);

  // const [nmrauthority, setNmrAuthority] = useState([]);
  // const [mbrauthority, setMbrAuthority] = useState([]);
  // const [mmcauthority, setMmcAuthority] = useState([]);
  // const [mmbcauthority, setMmbcAuthority] = useState([]);
  // const [rmcauthority, setRmcAuthority] = useState([]);
  // const [rmbcauthority, setRmbcAuthority] = useState([]);

  // useEffect(() => {
  //   let nmr = user?.menus?.find((r) => r.serviceId == 10)?.roles;
  //   let rmc = user?.menus?.find((r) => r.serviceId == 11)?.roles;
  //   let mmc = user?.menus?.find((r) => r.serviceId == 12)?.roles;
  //   let rmbc = user?.menus?.find((r) => r.serviceId == 14)?.roles;
  //   let mmbc = user?.menus?.find((r) => r.serviceId == 15)?.roles;
  //   let mbr = user?.menus?.find((r) => r.serviceId == 67)?.roles;
  //   console.log("nmr", nmr);
  //   console.log("rmc", rmc);
  //   console.log("mmc", mmc);
  //   console.log("rmbc", rmbc);
  //   console.log("mmbc", mmbc);
  //   console.log("mbr", mbr);
  //   setNmrAuthority(nmr);
  //   setRmcAuthority(rmc);
  //   setMmcAuthority(mmc);
  //   setRmbcAuthority(rmbc);
  //   setMmbcAuthority(mmbc);
  //   setMbrAuthority(mbr);

  //   // let nmrStatuses = nmr.map((n) => {
  //   //   let stringss = "";
  //   //   switch (n) {
  //   //     case "DOCUMENT_CHECKLIST":
  //   //       stringss = stringss.concat("APPLICATION_CREATED,CITIZEN_SEND_TO_JR_CLERK");
  //   //       break;
  //   //     case "DOCUMENT_VERIFICATION":
  //   //       stringss = stringss.concat("APPOINTMENT_SCHEDULED,CITIZEN_SEND_BACK_TO_SR_CLERK");
  //   //       break;
  //   //     case "FINAL_APPROVAL":
  //   //       stringss = stringss.concat("APPLICATION_SENT_TO_CMO");
  //   //       break;
  //   //     case "LOI_GENERATION":
  //   //       stringss = stringss.concat("CMO_APPROVED");
  //   //       break;
  //   //     case "CASHIER":
  //   //       stringss = stringss.concat("LOI_GENERATED");
  //   //       break;
  //   //     case "CERTIFICATE_ISSUER":
  //   //       stringss = stringss.concat("PAYEMENT_SUCCESSFULL");
  //   //       break;
  //   //     case "APPLY_DIGITAL_SIGNATURE":
  //   //       stringss = stringss.concat("CERTIFICATE_GENERATED");
  //   //       break;
  //   //     case "ADMIN":
  //   //       stringss = stringss.concat("APPLICATION_CREATED,CITIZEN_SEND_TO_JR_CLERK,APPOINTMENT_SCHEDULED,CITIZEN_SEND_BACK_TO_SR_CLERK,APPLICATION_SENT_TO_CMO,CMO_APPROVED,LOI_GENERATED,LOI_GENERATED,PAYEMENT_SUCCESSFULL,CERTIFICATE_GENERATED")
  //   //   }
  //   //   return stringss;
  //   // })
  //   // console.log("nmrStatuses.toString()", nmrStatuses.toString());
  //   // setNmrStatuses(nmrStatuses.toString());
  // }, [user?.menus]);

  //new marriage
  // let nmrcreated = [];
  // let apptScheduled = [];
  // let nmrclkVerified = [];
  // let nmrcmolaKonte = [];
  // let nmrcmoVerified = [];
  // let nmrloiGenerated = [];
  // let nmrpaymentCollected = [];
  // let nmrcertificateIssued = [];
  // let nmrcertificateGenerated = [];

  //marriage board
  // let mbrcreated = [];
  // let mbrclkVerified = [];
  // let mbrcmolaKonte = [];
  // let mbrcmoVerified = [];
  // let mbrloiGenerated = [];
  // let mbrpaymentCollected = [];
  // let mbrcertificateGenerated = [];
  // let mbrcertificateIssued = [];

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

  // const getMyApplications = async () => {
  //   let incoming = [];
  //   let rejected = [];
  //   let approved = [];
  //   //incoming
  //   axios
  //     .get(`${urls.MR}/transaction/prime/getDashboardDtlNew`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //         whichOne: "INCOMING",
  //       },
  //     })
  //     .then((resp) => {
  //       incoming = resp.data.map((r, i) => {
  //         return {
  //           srNo: i + 1,
  //           ...r,
  //           id: r.applicationId,
  //           serviceName: serviceList.find((s) => s.id == r.serviceId)?.serviceName,
  //           serviceNameMr: serviceList.find((s) => s.id == r.serviceId)?.serviceNameMr,
  //         };
  //       });
  //       setDataSource(incoming);
  //       setDataSourceI(incoming);
  //       setPendingApplication(incoming.length);
  //     });

  //   //revert
  //   axios
  //     .get(`${urls.MR}/transaction/prime/getDashboardDtlNew`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //         whichOne: "REVERT",
  //       },
  //     })
  //     .then((resp) => {
  //       rejected = resp.data.map((r, i) => {
  //         return {
  //           srNo: i + 1,
  //           ...r,
  //           id: r.applicationId,
  //           serviceName: serviceList.find((s) => s.id == r.serviceId)?.serviceName,
  //           serviceNameMr: serviceList.find((s) => s.id == r.serviceId)?.serviceNameMr,
  //         };
  //       });
  //       setDataSourceR(rejected);
  //       setRejectedApplication(rejected.length);
  //     });
  //   //approved
  //   axios
  //     .get(`${urls.MR}/transaction/prime/getDashboardDtlNew`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //         whichOne: "APPROVED",
  //       },
  //     })
  //     .then((resp) => {
  //       approved = resp.data.map((r, i) => {
  //         return {
  //           srNo: i + 1,
  //           ...r,
  //           id: r.applicationId,
  //           serviceName: serviceList.find((s) => s.id == r.serviceId)?.serviceName,
  //           serviceNameMr: serviceList.find((s) => s.id == r.serviceId)?.serviceNameMr,
  //         };
  //       });
  //       setDataSourceA(approved);
  //       setApprovedApplication(approved.length);
  //     });

  //   console.log("Total Applications", incoming.length + rejected.length + approved.length);
  //   setTotalApplication(incoming.length + rejected.length + approved.length);
  // };

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

  // useEffect(() => {
  //   getMyApplications();
  // }, [serviceList]);

  useEffect(() => {
    console.log("Total Applications GG", dataSourcei.length + dataSourcer.length + dataSourcea.length);
    let total = dataSourcei.length + dataSourcer.length + dataSourcea.length;
    let totalApplicationInDS = [...dataSourcei, ...dataSourcea, ...dataSourcer];

    setTotalApplication(total);

    console.log("dataSourcei", dataSourcei);
    console.log("dataSourcer", dataSourcer);
    console.log("dataSourcea", dataSourcea);
    console.log("dataSourcet", totalApplicationInDS);

    setDataSourceT(
      totalApplicationInDS.map((r, i) => {
        return {
          ...r,
          srNo: i + 1,
          id: r.applicationId,
          serviceName: serviceList.find((s) => s.id == r.serviceId)?.serviceName,
          serviceNameMr: serviceList.find((s) => s.id == r.serviceId)?.serviceNameMr,
        };
      }),
    );
  }, [dataSourcei, dataSourcer, dataSourcea]);

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
  ];

  return (
    <>
      <div>
        <Paper component={Box} squar="true" elevation={5} m={1} pt={2} pb={2} pr={2} pl={4}>
          <Grid container>
            {/** Applications Tabs */}
            <Grid item xs={12}>
              <h2 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>{language == "en" ? "Town Planning System Dashboard" : "नगर नियोजन प्रणाली डॅशबोर्ड"}</b>
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
                    <Button onClick={() => setDataSource(dataSourcet)}>
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
                    <Button onClick={() => setDataSource(dataSourcea)}>
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
                    <Button onClick={() => setDataSource(dataSourcei)}>
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
                    <Button onClick={() => setDataSource(dataSourcer)}>
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
