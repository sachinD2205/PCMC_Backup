{
  params?.row?.applicationUniqueId == 2 && (
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

        {["CERTIFICATE_ISSUED", "CERTIFICATE_GENERATED"].includes(params?.row?.applicationStatus) && (
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
  );
}
