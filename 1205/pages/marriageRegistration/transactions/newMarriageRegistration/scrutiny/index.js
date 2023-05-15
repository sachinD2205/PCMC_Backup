// /marriageRegistration/transactions/newMarriageRegistration/scrutiny/index.js
import BrushIcon from "@mui/icons-material/Brush";
import CheckIcon from "@mui/icons-material/Check";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import { Button, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import urls from "../../../../../URLS/urls";
// Table _ MR
const Index = () => {
  let created = [];
  let checklist = [];
  let apptScheduled = [];
  let clkVerified = [];
  let cmolaKonte = [];
  let cmoVerified = [];
  let loiGenerated = [];
  let cashier = [];
  let paymentCollected = [];
  let certificateGenerated = [];
  let certificateIssued = [];
  let merged = [];

  const router = useRouter();
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [loadderState, setLoadderState] = useState(true);
  const [serviceId, setServiceId] = useState(null);
  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.serviceId;
    console.log("serviceId-<>", service);
    console.log("auth0000", auth);
    setAuthority(auth);
    setServiceId(service);
  }, [selectedMenuFromDrawer, user?.menus]);

  // Get Table - Data
  const getNewMarriageRegistractionDetails = () => {
    console.log("loader", loadderState);
    // setLoadderState(true);
    console.log("userToken", user.token);
    axios
      .get(`${urls.MR}/transaction/applicant/getapplicantDetails?serviceId=${serviceId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((resp) => {
        setLoadderState(false);
        if (authority.includes("DOCUMENT_CHECKLIST") || authority.includes("ADMIN")) {
          console.log("APPLICATION_CREATED");
          created = resp.data.filter((data) =>
            ["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(data.applicationStatus),
          );
        }

        if (
          authority?.find(
            (r) => ["APPOINTMENT_SCHEDULE"].includes(r) || authority?.find((r) => r === "ADMIN"),
          )
        ) {
          console.log("APPOINTMENT_SCHEDULE");
          clkVerified = resp.data.filter((data) => data.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK");
        }

        if (authority?.find((r) => r === "DOCUMENT_VERIFICATION" || authority?.find((r) => r === "ADMIN"))) {
          console.log("DOCUMENT_VERIFICATION");
          apptScheduled = resp.data.filter((data) =>
            ["APPOINTMENT_SCHEDULED", "CMO_SENT_BACK_TO_SR_CLERK", "CITIZEN_SEND_BACK_TO_SR_CLERK"].includes(
              data.applicationStatus,
            ),
          );
        }

        if (authority?.find((r) => r === "FINAL_APPROVAL" || authority?.find((r) => r === "ADMIN"))) {
          cmolaKonte = resp.data.filter((data) => data.applicationStatus === "APPLICATION_SENT_TO_CMO");
        }

        if (authority?.find((r) => r === "LOI_GENERATION" || authority?.find((r) => r === "ADMIN"))) {
          cmoVerified = resp.data.filter((data) => data.applicationStatus === "CMO_APPROVED");
        }

        if (authority?.find((r) => r === "CASHIER" || authority?.find((r) => r === "ADMIN"))) {
          cashier = resp.data.filter((data) => data.applicationStatus === "LOI_GENERATED");
        }

        if (authority?.find((r) => r === "CERTIFICATE_ISSUER" || authority?.find((r) => r === "ADMIN"))) {
          loiGenerated = resp.data.filter((data) => data.applicationStatus === "PAYEMENT_SUCCESSFULL");
        }

        if (
          authority?.find((r) => r === "APPLY_DIGITAL_SIGNATURE" || authority?.find((r) => r === "ADMIN"))
        ) {
          certificateIssued = resp.data.filter((data) => data.applicationStatus === "CERTIFICATE_GENERATED");
        }

        merged = [
          ...created,
          ...checklist,
          ...apptScheduled,
          ...clkVerified,
          ...cmolaKonte,
          ...cmoVerified,
          ...loiGenerated,
          ...cashier,
          ...paymentCollected,
          ...certificateGenerated,
          ...certificateIssued,
        ];

        console.log("created", created);
        console.log("checklist", checklist);
        console.log("apptScheduled", apptScheduled);
        console.log("clkVerified", clkVerified);
        console.log("cmoVerified", cmoVerified);
        console.log("loiGenerated", loiGenerated);
        console.log("paymentCollected", paymentCollected);
        console.log("certificateIssued", certificateIssued);
        console.log("certificateGenerated", certificateGenerated);

        setTableData(
          merged.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          }),
        );
      });
  };

  useEffect(() => {
    console.log("authority", authority);
    if (authority) {
      getNewMarriageRegistractionDetails();
    }
  }, [authority]);

  const viewLOI = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      role: "LOI_GENERATION",
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  const issueCertificate = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      applicationId: record.id,
      role: "CERTIFICATE_ISSUER",
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  const applyDigitalSignature = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      applicationId: record.id,
      role: "APPLY_DIGITAL_SIGNATURE",
    };
    console.log("ads yetoy", record);
    saveApproval(finalBody);
  };

  const saveApproval = (body) => {
    axios
      .post(`${urls.MR}/transaction/applicant/saveApplicationApprove`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (body.role === "LOI_GENERATION") {
            router.push({
              pathname:
                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
              query: {
                ...body,
              },
            });
          } else if (body.role === "CERTIFICATE_ISSUER") {
            router.push({
              pathname: "/marriageRegistration/reports/marriageCertificateNew",
              query: {
                ...body,
                // role: "CERTIFICATE_ISSUER",
              },
            });
          } else if (body.role === "APPLY_DIGITAL_SIGNATURE") {
            router.push({
              pathname: "/marriageRegistration/reports/marriageCertificateNew",
              query: {
                ...body,
                // role: "CERTIFICATE_ISSUER",
              },
            });
          }
        }
      });
  };

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 260,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 130,
      headerAlign: "center",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: "applicantName",
      headerName: <FormattedLabel id="ApplicantName" />,
      width: 240,
      headerAlign: "center",
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="statusDetails" />,
      width: 280,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 280,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {/* {record?.row?.applicationStatus === "APPLICATION_CREATED" && */}
              {["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(record?.row?.applicationStatus) &&
                (authority?.includes("DOCUMENT_CHECKLIST") || authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny",
                        query: {
                          disabled: true,
                          applicationId: record.row.id,
                          serviceId: record.row.serviceId,
                          // ...record.row,
                          role: "DOCUMENT_CHECKLIST",
                          pageMode: "DOCUMENT CHECKLIST",
                          pageModeMr: "कागदपत्र तपासणी",
                          pageHeader: "DOCUMENT CHECKLIST",
                          pageHeaderMr: "कागदपत्र तपासणी",
                        },
                      })
                    }
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Document Checklist
                    </Button>
                  </IconButton>
                )}

              {/* {record?.row?.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK" && */}
              {["APPLICATION_SENT_TO_SR_CLERK", "CITIZEN_SEND_BACK_TO_SR_CLERK"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("APPOINTMENT_SCHEDULE") || authority?.includes("ADMIN")) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<EventIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slot`,
                          query: {
                            appId: record.row.id,
                            role: "APPOINTMENT_SCHEDULE",
                          },
                        })
                      }
                    >
                      Schedule
                    </Button>
                  </IconButton>
                )}
              {/* {record?.row?.applicationStatus === "APPOINTMENT_SCHEDULED" && */}
              {["CMO_SENT_BACK_TO_SR_CLERK", "APPOINTMENT_SCHEDULED"].includes(
                record?.row?.applicationStatus,
              ) &&
                authority?.find((r) => r === "DOCUMENT_VERIFICATION" || r === "ADMIN") && (
                  <>
                    <IconButton>
                      ,
                      <Button
                        variant="contained"
                        endIcon={<CheckIcon />}
                        style={{
                          height: "30px",
                          width: "250px",
                        }}
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny",
                            query: {
                              ...record.row,
                              applicationId: record.row.id,
                              serviceId: record.row.serviceId,

                              role: "DOCUMENT_VERIFICATION",
                              pageMode: "APPLICATION VERIFICATION",
                              pageModeMr: "अर्ज पडताळणी",
                            },
                          })
                        }
                      >
                        Clerk Verify
                      </Button>
                    </IconButton>
                  </>
                )}

              {/* {record?.row?.applicationStatus === "APPLICATION_SENT_TO_CMO" && */}
              {["APPLICATION_SENT_TO_CMO"].includes(record?.row?.applicationStatus) &&
                authority?.find((r) => r === "FINAL_APPROVAL" || r === "ADMIN") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<CheckIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny",
                          query: {
                            ...record.row,
                            applicationId: record.row.id,
                            serviceId: record.row.serviceId,
                            role: "FINAL_APPROVAL",
                            pageMode: "FINAL VERIFICATION",
                            pageModeMr: "अंतिम पडताळणी",
                          },
                        })
                      }
                    >
                      CMO VERIFY
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "CMO_APPROVED" &&
                authority?.find((r) => r === "LOI_GENERATION" || r === "ADMIN") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<BrushIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      //  color="success"
                      // onClick={() => viewLOI(record.row)}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationComponent",
                          query: {
                            // ...record.row,
                            applicationId: record.row.id,
                            serviceId: record.row.serviceId,
                            // loiServicecharges: null,
                            role: "LOI_GENERATION",
                          },
                        })
                      }
                    >
                      GENERATE LOI
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "LOI_GENERATED" &&
                authority?.find((r) => r === "CASHIER" || r === "ADMIN") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      // endIcon={<PaidIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() =>
                        router.push({
                          pathname:
                            "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/PaymentCollection",
                          query: {
                            ...record.row,
                            role: "CASHIER",
                          },
                        })
                      }
                    >
                      Collect Payment
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" &&
                authority?.find((r) => r === "CERTIFICATE_ISSUER" || r === "ADMIN") && (
                  <IconButton>
                    {/* <Buttonremarks */}
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                    >
                      GENERATE CERTIFICATE
                    </Button>
                    {/* </Buttonremarks> */}
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" &&
                authority?.find((r) => r === "CERTIFICATE_ISSUER" || r === "ADMIN") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                    >
                      DOWNLOAD CERTIFICATE
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "CERTIFICATE_GENERATED" &&
                authority?.find((r) => r === "APPLY_DIGITAL_SIGNATURE" || r === "ADMIN") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => applyDigitalSignature(record.row)}
                    >
                      APPLY DIGITAL SIGNATURE
                    </Button>
                  </IconButton>
                )}
            </div>
          </>
        );
      },
    },
  ];
  useEffect(() => {}, [loadderState]);
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            marginLeft: 1,
            marginRight: 1,
            marginTop: 1,
            marginBottom: 10,
            padding: 1,
            border: 1,
            borderColor: "grey.500",
          }}
        >
          <br />
          <div className={styles.detailsTABLE}>
            <div className={styles.h1TagTABLE}>
              <h2
                style={{
                  fontSize: "20",
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {" "}
                {<FormattedLabel id="newMRtable" />}
              </h2>
            </div>
          </div>
          {/* <div className={styles.titleM}>
          <Typography variant="h4" display="block" gutterBottom>
            {<FormattedLabel id="newMRtable" />}
          </Typography>
        </div> */}
          <br />

          <DataGrid
            rowHeight={70}
            sx={{
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 15,
              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            density="compact"
            autoHeight
            scrollbarSize={17}
            rows={tableData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Paper>
      )}
    </>
  );
};
export default Index;
