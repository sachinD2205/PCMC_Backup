import { Box, Button, IconButton, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import urls from "../../URLS/urls";
import { Payment } from "@mui/icons-material";

const MyApplications = () => {
  const [dataSource, setDataSource] = useState([]);
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  const [serviceList, setServiceList] = useState([]);

  // const getDepartmentName = async () => {
  //   await axios
  //     .get("http://localhost:8090/cfc/api/master/department/getAll")
  //     .then((r) => {
  //       if (r.status == 200) {
  //         // console.log("res department", r);
  //         setDepartmentList(r.data.department);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // };

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
    axios.get(`${urls.CFCURL}/transaction/citizen/myApplications?citizenId=${user?.id}`).then((res) => {
      setDataSource(
        res.data.map((r, i) => ({
          srNo: i + 1,
          ...r,
          id: r.applicationId,
          serviceName: serviceList?.find((s) => s.id == r.serviceId)?.serviceName,
          serviceNameMr: serviceList?.find((s) => s.id == r.serviceId)?.serviceNameMr,
          clickTo: serviceList?.find((s) => s.id == r.serviceId)?.clickTo,
        })),
      );
    });
  };

  // const getNMRData = async () => {
  //   axios
  //     .get(
  //       `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${finalBody.id}`
  //     )
  //     .then((ress) => {
  //       router.push({
  //         pathname: "/marriageRegistration/Receipts/ServiceChargeRecipt",
  //         query: {
  //           ...ress.data,
  //           // ...router?.query,
  //         },
  //       });
  //     });
  // };

  useEffect(() => {
    getServiceName();
  }, []);

  useEffect(() => {
    getMyApplications();
  }, [serviceList]);

  const columns = [
    {
      field: "srNo",
      headerName: language === "en" ? "Sr.No" : "अ.क्र",
      flex: 1,
      pinnable: false,
      // width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "serviceName" : "serviceNameMr",
      headerName: language === "en" ? "Service Name" : "सेवेचे नाव",
      // headerName: "Service Name",
      flex: 4,
      // width: 300,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: language === "en" ? "Application Number" : "अर्ज क्रमांक",
      // headerName: "Application Number",
      flex: 4,
      // width: 300,
      align: "left",
      headerAlign: "center",
    },

    // {
    //   field: moment('applicationDate', 'YYYY-MM-DD').format('DD-MM-YYYY'),
    //   headerName: language === 'en' ? 'Application Date' : 'अर्जाचा दिनांक',
    //   // type: "number",
    //   flex: 2,
    //   // minWidth: 250,
    //   // width: 120,
    //   align: 'center',
    //   headerAlign: 'center',
    // },

    {
      field: "applicationDate",
      headerName: language === "en" ? "Application Date" : "अर्जाचा दिनांक",
      // type: "number",
      flex: 2,
      // minWidth: 250,
      // width: 120,
      align: "center",
      headerAlign: "center",

      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "applicationStatus",
      headerName: language === "en" ? "Status" : "स्थिती",
      // type: "number",
      // width: 300,
      flex: 4,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "actions",
      headerName: language === "en" ? "Actions" : "कृती",
      // headerName: "Actions",
      // width: 225,
      flex: 4,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.applicationUniqueId == 8 && (
              <>
                <Stack direction="column">
                  {params?.row?.applicationStatus === "APPLICATION_CREATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 76) {
                            // console.log("viewFormProps", props?.props);
                            // reset(props?.props);
                            // setValue("serviceName", props.serviceId);
                            // formPreviewDailogOpen();

                            router.push({
                              pathname: "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
                              query: {
                                // ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "APPLICATION_CREATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname: "/marriageRegistration/Receipts/acknowledgmentReceiptmarathi",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "View ACKNOWLEDGMENT" : "पोच पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW APPOINTMENT LETTER" : "नियुक्ती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "LOI_GENERATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW LOI" : "स्वीकृती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                // ...params.row,
                                serviceId: params.row.serviceId,
                                id: params.row.id,
                              },
                            });
                          } else if (params.row.serviceId == 10) {
                            router.push({
                              pathname: "/marriageRegistration/Receipts/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "CERTIFICATE_ISSUED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if ([10, 11, 12].includes(params.row.serviceId)) {
                            router.push({
                              pathname: "/marriageRegistration/reports/marriageCertificate",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                                // ...params.row,
                              },
                            });
                          }
                          // else if (params.row.serviceId == 12) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/marriageCertificate",
                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // } else if (params.row.serviceId == 11) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/marriageCertificate",
                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // }
                          else if ([14, 15, 67].includes(params.row.serviceId)) {
                            router.push({
                              pathname: "/marriageRegistration/reports/boardcertificateui",

                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                                // ...params.row,
                              },
                            });
                          }
                          // else if (params.row.serviceId == 15) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/boardcertificateui",

                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // } else if (params.row.serviceId == 14) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/boardcertificateui",

                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW CERTIFICATE" : "प्रमाणपत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["SR_CLERK_SENT_BACK_TO_CITIZEN", "APPLICATION_SENT_BACK_CITIZEN"].includes(
                    params?.row?.applicationStatus,
                  ) && (
                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() =>
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                // disabled: true,
                              },
                            })
                          }
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "180px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en" ? "EDIT APPLICATION" : "त्रुटी करा"}
                          </Button>
                        </IconButton>
                      </div>
                    )}
                </Stack>
              </>
            )}

            {params?.row?.applicationUniqueId == 2 && (
              <>
                <Stack direction="column">
                  {[
                    "APPLICATION_CREATED",
                    "APPLICATION_SENT_TO_SR_CLERK",
                    "CMO_SENT_BACK_TO_SR_CLERK",
                    "CMO_APPROVED",
                    "APPLICATION_SENT_TO_CMO",
                  ].includes(params?.row?.applicationStatus) && (
                      <>
                        <div className={styles.buttonRow}>
                          <IconButton
                            onClick={() => {
                              if (params.row.serviceId == 10) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",

                                  query: {
                                    ...params.row,
                                    applicationId: params.row.applicationId,
                                    serviceId: params.row.serviceId,
                                    pageMode: "View",
                                    disabled: true,
                                  },
                                });
                              } else if (params.row.serviceId == 67) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration",

                                  query: {
                                    ...params.row,
                                    applicationId: params.row.applicationId,
                                    serviceId: params.row.serviceId,
                                    // pageMode: "View",
                                    disabled: true,
                                    // role: 'DOCUMENT_CHECKLIST',
                                    pageHeader: "View Application",
                                    pageMode: "Check",
                                    pageHeaderMr: "अर्ज पहा",
                                  },
                                });
                              }
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"}
                            </Button>
                          </IconButton>
                        </div>
                        <div className={styles.buttonRow}>
                          <IconButton
                            onClick={() =>
                              router.push({
                                pathname: "/marriageRegistration/Receipts/acknowledgmentReceiptmarathi",
                                query: {
                                  ...params.row,
                                },
                              })
                            }
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en" ? "View ACKNOWLEDGMENT" : "पोच पावती पाहा"}
                            </Button>
                          </IconButton>
                        </div>
                      </>
                    )}

                  {params?.row?.applicationStatus === "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW APPOINTMENT LETTER" : "नियुक्ती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "LOI_GENERATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW LOI" : "स्वीकृती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                // ...params.row,
                                serviceId: params.row.serviceId,
                                id: params.row.id,
                              },
                            });
                          } else if (params.row.serviceId == 10) {
                            router.push({
                              pathname: "/marriageRegistration/Receipts/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["CERTIFICATE_ISSUED", "CERTIFICATE_GENERATED"].includes(
                    params?.row?.applicationStatus,
                  ) && (
                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() => {
                            if (params.row.serviceId == 10) {
                              router.push({
                                pathname: "/marriageRegistration/reports/marriageCertificate",
                                query: {
                                  serviceId: params.row.serviceId,
                                  applicationId: params.row.applicationId,
                                  // ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 12) {
                              router.push({
                                pathname: "/marriageRegistration/reports/marriageCertificate",
                                query: {
                                  serviceId: params.row.serviceId,
                                  applicationId: params.row.applicationId,
                                  // ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 11) {
                              router.push({
                                pathname: "/marriageRegistration/reports/marriageCertificate",
                                query: {
                                  serviceId: params.row.serviceId,
                                  applicationId: params.row.applicationId,
                                  // ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 67) {
                              router.push({
                                pathname: "/marriageRegistration/reports/boardcertificateui",

                                query: {
                                  serviceId: params.row.serviceId,
                                  applicationId: params.row.applicationId,
                                  // ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 15) {
                              router.push({
                                pathname: "/marriageRegistration/reports/boardcertificateui",

                                query: {
                                  serviceId: params.row.serviceId,
                                  applicationId: params.row.applicationId,
                                  // ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 14) {
                              router.push({
                                pathname: "/marriageRegistration/reports/boardcertificateui",

                                query: {
                                  serviceId: params.row.serviceId,
                                  applicationId: params.row.applicationId,
                                  // ...params.row,
                                },
                              });
                            }
                          }}
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "200px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en" ? "VIEW CERTIFICATE" : "प्रमाणपत्र पाहा"}
                          </Button>
                        </IconButton>
                      </div>
                    )}

                  {(params?.row?.applicationStatus === "SR_CLERK_SENT_BACK_TO_CITIZEN" ||
                    params?.row?.applicationStatus === "APPLICATION_SENT_BACK_CITIZEN") && (
                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() =>
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                // disabled: true,
                              },
                            })
                          }
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "180px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en" ? "EDIT APPLICATION" : "त्रुटी करा"}
                          </Button>
                        </IconButton>
                      </div>
                    )}
                </Stack>
              </>
            )}

            {params?.row?.applicationUniqueId == 12 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {params.row.serviceId == 112 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push({
                          pathname: `/veterinaryManagementSystem/transactions/petLicense/application/view`,
                          // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                          query: { id: params.row.id, pageMode: "view" },
                        });
                      }}
                    >
                      View Application
                    </Button>
                    {params.row.applicationStatus == "Approved" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/petLicense/paymentGateway`,
                            query: { id: params.row.id, amount: 75 },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                  </>
                )}
                {params.row.serviceId == 115 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push({
                          pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
                          // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                          query: { id: params.row.id, pageMode: "view" },
                        });
                      }}
                    >
                      View Application
                    </Button>
                    {params.row.applicationStatus == "Approved" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/paymentGateway`,
                            query: { id: params.row.id, amount: 50 },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {params?.row?.applicationUniqueId == 13 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {params.row.serviceId == 85 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push({
                          pathname: `/lms/transactions/newMembershipRegistration/citizen/newMembershipRegistration`,
                          // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                          // query: { id: params.row.id, pageMode: "view" },
                          query: {
                            disabled: true,
                            // ...record.row,
                            ...params.row,
                            // role: 'DOCUMENT_CHECKLIST',
                            // pageHeader: 'DOCUMENT CHECKLIST',
                            pageMode: 'Check',
                            // pageHeaderMr: 'कागदपत्र तपासणी',
                          },
                        });
                      }}
                    >
                      View Application
                    </Button>
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              '/lms/transactions/newMembershipRegistration/scrutiny/PaymentCollection',

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: 'CASHIER',
                              applicationSide: "Citizen"
                            },
                          })
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}

                  </>
                )}

              </div>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div container>
      <Box
        style={{
          backgroundColor: "white",
          height: "auto" /* overflowY: 'auto',overflowX: 'auto' */,
          width: "auto" /* overflowY: 'auto',overflowX: 'auto' */,
          overflow: "auto",
        }}
      >
        <DataGrid
          getRowId={(row) => row.srNo}
          rowHeight={100}
          // initialState={{ pinnedColumns: { left: ['srNo'], right: ['actions'] } }}
          sx={{
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
            // overflowY: 'scroll',
            // overflowX: 'scroll',

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
          scrollbarSize={20}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </div>
  );
};

export default MyApplications;

{
  /* <Grid style={{ padding: "10px" }} container direction="row" justifyContent="center" alignItems="center">
          <Grid
                  item
                  xs={5}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl style={{ width: "50%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Department name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Department name"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                             setSelectedDepartment(value.target.value);
                            // handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {departmentList.length > 0
                            ? departmentList.map((val, id) => {
                                return (
                                  <MenuItem style={{maxWidth:"200px"}} key={id} value={val.id}>
                                    {val.department}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name={'departmentName'}
                      control={control}
                      defaultValue=""
                      key={1}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.departmentName
                        ? errors.departmentName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
          </Grid>
          

        <Grid item xs={5} style={{ display: "flex", justifyContent: "center" }}>
          <FormControl size="small" sx={{ m: 1, width: "50%" }}>
            <InputLabel id="demo-simple-select-standard-label">
              Service Name
            </InputLabel>

            <Controller
              render={({ field }) => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Service Name"
                  value={field.value}
                  // onChange={(value) => field.onChange(value)}
                  onChange={(value) => {
                    field.onChange(value);
                    setSelectedService(value.target.value);
                    // handleRoleNameChange(value);
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {serviceList.length > 0
                      ? serviceList
                        .filter((service) =>
                          service.department === selectedDepartment)
                        .map((service, index) => {
                        return (
                          <MenuItem key={index} value={service.id}>
                            {service.serviceName}
                          </MenuItem>
                        );
                      })
                    : "Choose One"}
                </Select>
              )}
              name="serviceName"
              control={control}
              defaultValue=""
            />
            <FormHelperText style={{ color: "red" }}>
              {errors?.roleName ? errors.roleName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

          
           <Grid
                  item
                  xs={2}
                  style={{ display: "flex", justifyContent: "center" }}
          >
            <Button>Search</Button>
          </Grid>
        </Grid> */
}
{
  /* <DataGrid
          sx={{
            // fontSize: 16,
            // fontFamily: 'Montserrat',
            // font: 'center',
            // backgroundColor:'yellow',
            // // height:'auto',
            // border: 2,
            // borderColor: "primary.light",
            overflowY: 'scroll',
            overflowX:"scroll",
            '& .MuiDataGrid-virtualScrollerContent': {
              // backgroundColor:'red',
              // height: '800px !important',
              // display: "flex",
              // flexDirection: "column-reverse",
              // overflow:'auto !important'
            },
            '& .MuiDataGrid-columnHeadersInner': {
              backgroundColor: '#556CD6',
              color: 'white',
            },

            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
          density="compact"
          autoHeight={true}
          // rowHeight={50}
          rows={dataSource}
          columns={columns}
        /> */
}

// axios
//   .get(
//     `http://localhost:8091/mr/api/transaction/applicant/getApplicationByCitizen?citzenNo=${user?.id}`,
//   )
//   .then((res) => {
//     setDataSource(
//       res.data.map((r, i) => ({
//         srNo: i + 1,
//         ...r,
//         // id: r.id,
//         // serviceName:
//         //   language === "en" ? "New Marriage Registration" : "विवाह नोंदणी",
//         // applicationNumber: r.applicationNumber,
//         // applicationDate: r.applicationDate,
//         // applicationStatus: r.applicationStatus,
//       })),
//     )
//   })
