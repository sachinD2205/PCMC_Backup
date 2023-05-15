import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextareaAutosize,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import SiteVisitSchedule from "../../../components/streetVendorManagementSystem/components/SiteVisitSchedule";
import VerificationAppplicationDetails from "../../../components/streetVendorManagementSystem/components/VerificationAppplicationDetails";
import { Failed } from "../../../components/streetVendorManagementSystem/components/commonAlert";
import Loader from "../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
// Main Component - Clerk
const Index = () => {
  // Methods in useForm
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [loadderState, setLoadderState] = useState(false);
  const [authority, setAuthority] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [applicationData, setApplicationData] = useState();
  const [tableData, setTableData] = useState([]);
  const [siteVisitScheduleModal, setSiteVisitScheduleModal] = useState(false);
  const [hardCodeAuthority, setHardCodeAuthority] = useState();
  const [verificationDailog, setVerificationDailog] = useState();
  const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
  const language = useSelector((state) => state?.labels.language);
  const [siteVisitPreviewButtonInputState, setSiteVisitPreviewButtonInputState] = useState(false);

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  // site Schedule Modal
  const siteVisitScheduleOpen = () => setSiteVisitScheduleModal(true);
  const siteVisitScheduleClose = () => setSiteVisitScheduleModal(false);

  // Verification AO Dialog
  const verificationOpne = () => setVerificationDailog(true);
  const verificationClose = () => setVerificationDailog(false);

  // Approve Remark Modal Close
  const approveRevertRemarkDailogOpen = () => setApproveRevertRemarkDailog(true);
  const approveRevertRemarkDailogClose = () => setApproveRevertRemarkDailog(false);

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 30,
      headerAlign: "center",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNumber" />,
      description: <FormattedLabel id="applicationNumber" />,
      width: 270,
      headerAlign: "center",
      // flex: 1,
    },
    {
      field: "applicationDate",
      headerAlign: "center",
      headerName: <FormattedLabel id="applicationDate" />,
      description: <FormattedLabel id="applicationDate" />,
      width: 120,
      // flex: 1,
    },

    {
      field: "applicantName",
      headerAlign: "center",
      headerName: <FormattedLabel id="applicantName" />,
      description: <FormattedLabel id="applicantName" />,
      width: 200,
      // flex: 1,
    },

    {
      field: language === "en" ? "serviceName" : "serviceNameMr",
      headerName: <FormattedLabel id="serviceName" />,
      headerAlign: "center",
      description: <FormattedLabel id="serviceName" />,
      width: 250,
      // flex: 1,
    },
    {
      field: "applicationStatus",
      headerAlign: "center",
      headerName: <FormattedLabel id="applicationStatus" />,
      headerName: <FormattedLabel id="applicationStatus" />,
      width: 400,
      // flex: 1,
    },

    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 400,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            {/**  Verification DEPT Cleark - Button */}
            {(record?.row?.applicationStatus === "APPLICATION_CREATED" ||
              record?.row?.applicationStatus === "APPLICATION_SENT_BACK_TO_DEPT_CLERK") &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
                <IconButton
                onClick={() => {
                  // console.log("record",record?,row);
                    reset(record.row);
                  setValue("serviceName", record.row.serviceId);
                    
                    setApplicationData(record.row);
                    setHardCodeAuthority("DEPT_CLERK_VERIFICATION");
                    setSiteVisitPreviewButtonInputState(false);
                    verificationOpne();
                  }}
                >
                  <Button variant="contained" size="small">
                    verification DEPT
                  </Button>
                </IconButton>
              )}

            {/** AO  */}
            {(record?.row?.applicationStatus === "SITE_VISIT_COMPLETED" ||
              record?.row?.applicationStatus === "APPLICATION_SENT_BACK_TO_ADMIN_OFFICER") &&
              authority?.find((r) => r === "ADMIN_OFFICER" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    setApplicationData(record.row);
                    setSiteVisitPreviewButtonInputState(true);
                    setHardCodeAuthority("ADMIN_OFFICER");
                    verificationOpne();
                  }}
                >
                  <Button variant="contained" size="small">
                    verification AO
                  </Button>
                </IconButton>
              )}
            {/**  Ward Officer */}
            {record?.row?.applicationStatus === "APPLICATION_SENT_TO_WARD_OFFICER" &&
              authority?.find((r) => r === "WARD_OFFICER" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setApplicationData(record.row);
                    setValue("serviceName", record.row.serviceId);
                    setSiteVisitPreviewButtonInputState(true);
                    setHardCodeAuthority("WARD_OFFICER");
                    verificationOpne();
                  }}
                >
                  <Button variant="contained" size="small">
                    verification WO
                  </Button>
                </IconButton>
              )}

            {/** Site Visit Schedule Button */}
            {record?.row?.applicationStatus == "DEPT_CLERK_VERIFICATION_COMPLETED" &&
              record?.row?.appointmentType != "S" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    siteVisitScheduleOpen();
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="siteVisitSchedule" />}
                  </Button>
                </IconButton>
              )}

            {/** Site Visit ReSchedule Button */}
            {record?.row?.applicationStatus == "DEPT_CLERK_VERIFICATION_COMPLETED" &&
              record?.row?.appointmentType == "S" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    siteVisitScheduleOpen();
                  }}
                >
                  <Button variant="contained" size="small">
                    Site Visit Reschdule
                  </Button>
                </IconButton>
              )}

            {/** Site Visit Button */}
            {record?.row?.applicationStatus == "SITE_VISIT_SCHEDULED" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
              <>
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/SiteVisit`,
                    );
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="siteVisit" />}
                  </Button>
              </IconButton>
               <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    siteVisitScheduleOpen();
                  }}
                >
                  <Button variant="contained" size="small">
                    Site Visit Reschdule
                  </Button>
                </IconButton>
              </>
              )}

            {/** LOI Generation Button */}
            {record?.row?.applicationStatus === "APPLICATION_VERIFICATION_COMPLETED" &&
              authority?.find((r) => r === "LOI_GENERATION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/LoiGeneration`,
                    );
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="loiGeneration" />}
                  </Button>
                </IconButton>
              )}

            {/** LOI Generation Recipt Button */}
            {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find((r) => r === "LOI_COLLECTION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/LoiGenerationRecipt`,
                    );
                  }}
                >
                  <Button variant="contained" endIcon={<VisibilityIcon />} size="small">
                    {<FormattedLabel id="loiGenerationRecipt" />}
                  </Button>
                </IconButton>
              )}

            {/** Payment Collection Button */}
            {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find((r) => r === "LOI_COLLECTION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollection`,
                    );
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="paymentCollection" />}
                  </Button>
                </IconButton>
              )}

            {/** Payment Collection Recipt Button */}

            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find((r) => r === "LOI_COLLECTION"|| r === "PAYMENT_RECEIPT" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollectionRecipt`,
                    );
                  }}
                >
                  <Button variant="contained" endIcon={<VisibilityIcon />} size="small">
                    {<FormattedLabel id="paymentReceipt" />}
                  </Button>
                </IconButton>
              )}

            {/** Generate Certitifcate */}
            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find((r) => r === "LICENSE_ISSUANCE" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    setValue("loadderState",true);
                    const finalBodyForApi = {
                      id: record?.row?.id,
                      role: "LICENSE_ISSUANCE",
                      approveRemark: "Approve Certificate",
                    };

                    axios
                      .post(
                        `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`,
                        finalBodyForApi,
                      )
                      .then((res) => {
                        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
                          setValue("loadderState",false);
                          res?.data?.id
                            ? sweetAlert("Generated!", "Certificate Generated Successfully", "success")
                            : sweetAlert("Generated !", "Certificate Generated Successfully", "success");
                          localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                          router.push(
                            `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/CertificateIssuanceOfHawkerLicense`,
                          );
                        } else {
                          setValue("loadderState",false);
                          <Failed />;
                        }
                      });
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="generateCertitifcate" />}
                  </Button>
                </IconButton>
              )}

            {/** view Certificate view */}
            {(record?.row?.applicationStatus == "LICENSE_ISSUED" ||
              record?.row?.applicationStatus == "CERTIFICATE_GENERATED" ||
              record?.row?.applicationStatus == "I_CARD_ISSUED" ||
              record?.row?.applicationStatus == "I_CARD_GENERATED") &&
              authority?.find((r) => r === "LICENSE_ISSUANCE" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/CertificateIssuanceOfHawkerLicense`,
                    );
                  }}
                >
                  <Button variant="contained" endIcon={<VisibilityIcon />} size="small">
                    {<FormattedLabel id="viewCertificate" />}
                  </Button>
                </IconButton>
              )}

            {/** Generate I card */}
            {(record?.row?.applicationStatus == "LICENSE_ISSUED" ||
              record?.row?.applicationStatus == "CERTIFICATE_GENERATED") &&
              authority?.find((r) => r === "LICENSE_ISSUANCE" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    setValue("loadderState",true);
                    const finalBodyForApi = {
                      id: record?.row?.id,
                      role: "I_CARD_ISSUANCE",
                      approveRemark: "I Card Issued",
                    };

                    axios
                      .post(
                        `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`,
                        finalBodyForApi,
                      )
                      .then((res) => {
                        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
                          setValue("loadderState",false);
                          res?.data?.id
                            ? sweetAlert("Generated!", "I Card Generated Successfully", "success")
                            : sweetAlert("Generated !", "I Card Generated Successfully", "success");
                          localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                          router.push(
                            `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/IdCardOfStreetVendor`,
                          );
                        } else {
                          setValue("loadderState",false);
                          <Failed />;
                        }
                      });
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="generateIDCard" />}
                  </Button>
                </IconButton>
              )}

            {/**  View I Card */}
            {(record?.row?.applicationStatus == "LICENSE_ISSUED" ||
              record?.row?.applicationStatus == "I_CARD_ISSUED" ||
              record?.row?.applicationStatus == "I_CARD_GENERATED") &&
              authority?.find((r) => r === "I_CARD_ISSUANCE" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/IdCardOfStreetVendor`,
                    );
                  }}
                >
                  <Button variant="contained" endIcon={<VisibilityIcon />} size="small">
                    {<FormattedLabel id="viewIDCard" />}
                  </Button>
                </IconButton>
              )}
          </>
        );
      },
    },
  ];




  // onSubmit - mainForm
  const onSubmitForm = (data) => {
    console.log("dsfldsj", data);
  };

  // getIssuanceOfHawkerLicense - tableData
  const getIssuanceOfHawkerLicense = () => {
    let tempStatues = [];
    if (
      authority.includes("I_CARD_ISSUANCE") ||
      authority.includes("LICENSE_ISSUANCE") ||
      authority.includes("LOI_COLLECTION") ||
      authority.includes("LOI_GENERATION") ||
      authority.includes("SITE_VISIT") ||
      authority.includes("ADMIN_OFFICER") ||
      authority.includes("WARD_OFFICER") ||
      authority.includes("APPLY_DIGITAL_SIGNATURE") ||
      authority.includes("VERIFICATION") ||
      authority.includes("ADMIN") ||
      authority.includes("PAYMENT_RECEIPT")
    ) {
      if (authority.includes("VERIFICATION")) {
        tempStatues.push("APPLICATION_CREATED");
        tempStatues.push("CERTIFICATE_GENERATED");
        tempStatues.push("I_CARD_GENERATED");
        tempStatues.push("APPLICATION_SENT_BACK_TO_DEPT_CLERK");
      }

      if (authority.includes("SITE_VISIT")) {
        tempStatues.push("DEPT_CLERK_VERIFICATION_COMPLETED");
        tempStatues.push("SITE_VISIT_SCHEDULED");
        tempStatues.push("SITE_VISIT_RESCHEDULED");
      }

      if (authority.includes("ADMIN_OFFICER")) {
        tempStatues.push("SITE_VISIT_COMPLETED");
        tempStatues.push("APPLICATION_SENT_TO_ADMIN_OFFICER");
        tempStatues.push("APPLICATION_SENT_BACK_TO_ADMIN_OFFICER");
      }

      if (authority.includes("WARD_OFFICER")) {
        tempStatues.push("APPLICATION_SENT_TO_WARD_OFFICER");
      }

      if (authority.includes("LOI_GENERATION")) {
        tempStatues.push("APPLICATION_VERIFICATION_COMPLETED");
      }

      if (authority.includes("LOI_COLLECTION")) {
        tempStatues.push("LOI_GENERATED");
        tempStatues.push("PAYEMENT_SUCCESSFUL");
      }

      if (authority.includes("LICENSE_ISSUANCE")) {
        tempStatues.push("PAYEMENT_SUCCESSFUL");
      }

      if (authority.includes("I_CARD_ISSUANCE")) {
        tempStatues.push("LICENSE_ISSUED");
        tempStatues.push("I_CARD_ISSUED");
      }

      if (authority.includes("PAYMENT_RECEIPT")) {
        tempStatues.push("PAYEMENT_SUCCESSFUL");
      }

      if (authority.includes("ADMIN")) {
        tempStatues.push("APPLICATION_CREATED");
        tempStatues.push("DEPT_CLERK_VERIFICATION_COMPLETED");
        tempStatues.push("APPLICATION_SENT_BACK_TO_DEPT_CLERK");
        tempStatues.push("SITE_VISIT_SCHEDULED");
        tempStatues.push("SITE_VISIT_RESCHEDULED");
        tempStatues.push("SITE_VISIT_COMPLETED");
        tempStatues.push("CERTIFICATE_GENERATED");
        tempStatues.push("I_CARD_GENERATED");
        tempStatues.push("APPLICATION_SENT_TO_ADMIN_OFFICER");
        tempStatues.push("APPLICATION_SENT_BACK_TO_ADMIN_OFFICER");
        tempStatues.push("APPLICATION_SENT_TO_WARD_OFFICER");
        tempStatues.push("APPLICATION_VERIFICATION_COMPLETED");
        tempStatues.push("LOI_GENERATED");
        tempStatues.push("PAYEMENT_SUCCESSFUL");
        tempStatues.push("LICENSE_ISSUED");
        tempStatues.push("I_CARD_ISSUED");
      }
    }

    const body = {
      applicationStatuses: tempStatues,
    };

    console.log("body4034034", body);
    // const url = `${urls.HMSURL}/IssuanceofHawkerLicense/getDetailsByStatus`;
    // const url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/getDetailsByStatus`;
    // const url = `${urls.HMSURL}/IssuanceofHawkerLicense/getDetailsByStatus`;
    // const url = `${urls.HMSURL}/IssuanceofHawkerLicense/getDetailsByStatus`;




    if (tempStatues != null &&  tempStatues != undefined  && tempStatues.length != 0) {
      axios
        .post(url, body)
        .then((resp) => {
          if (resp?.status == 200 || resp?.status == 201 || resp?.status == "SUCCESS") {
            setTableData(resp.data.issuanceOfHawkerLicense);
            setValue("loadderState",false);
          } else {
            setValue("loadderState",false);
            <Failed />;
          }
        })
        .catch(() => {
          setValue("loadderState",false);
          <Failed />;
        });
    } else {
       setValue("loadderState",false);
      <Failed />;
    }
  };

  // remarkFunction
  const remarkFun = (data) => {
    setValue("loadderState",true);
    let approveRemark;
    let rejectRemark;

    if (data == "Approve") {
      approveRemark = watch("verificationRemark");
    } else if (data == "Revert") {
      rejectRemark = watch("verificationRemark");
    }

    const finalBodyForApi = {
      approveRemark,
      rejectRemark,
      id: getValues("id"),
      id: getValues("id"),
      desg: hardCodeAuthority,
      role: hardCodeAuthority,
    };
    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setValue("loadderState",false);
          if (data == "Approve") {
            sweetAlert("Approved!", "verification successfully completed", "success");
          } else if (data == "Revert") {
            sweetAlert("Reassigned !", "application is reassigned", "error");
          }
          approveRevertRemarkDailogClose();
          router.push("/streetVendorManagementSystem/dashboards");
        } else {
          setValue("loadderState",false);
          <Failed />;
        }
      })
      .catch(() => {
        setValue("loadderState",false);
        <Failed />;
      });
  };

  //  ==============>  Use Effects <======================

  useEffect(() => {
    setValue("loadderState",true)
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("SachinUser", auth);
  }, []);
 

  useMemo(() => {
    getIssuanceOfHawkerLicense();
     console.log("32432");
  }, [authority])
  
  // loading
  useEffect(() => {
     console.log("loadderState",watch("loadderState"));
   }, [watch("loadderState")]);

  // view
  return (
    <>
      <ToastContainer />
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <>
          <div style={{ backgroundColor: "white", marginTop: "20vh" }}>
            <ToastContainer />
            <Paper
              elevation={5}
              sx={{
                backgroundColor: "#F5F5F5",
              }}
              component={Box}
            >
                {/** DashBoard Header */}
                <br/>
                   <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "65px",
              borderRadius: 100,
            }}
          >   
            <strong>{<FormattedLabel id="issuanceOfHawkerLicense" />}</strong>
                </div>
                <br/>

              <ThemeProvider theme={theme}>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    {/** DashBoard Table OK  */}
                    <DataGrid
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 100 },
                          printOptions: { disableToolbarButton: true },
                          disableExport: false,
                          disableToolbarButton: false,
                          csvOptions: { disableToolbarButton: true },
                        },
                      }}
                      components={{ Toolbar: GridToolbar }}
                      sx={{
                        backgroundColor: "white",
                        m: 2,
                        overflowY: "scroll",
                        "& .MuiDataGrid-columnHeadersInner": {
                          backgroundColor: "#0084ff",
                          color: "white",
                        },
                        "& .MuiDataGrid-cell:hover": {
                          color: "primary.main",
                        },
                      }}
                      density="density"
                      autoHeight
                      rows={tableData}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                    />

                    {/** Site Visit Schedule Modal OK*/}
                    <Modal
                      open={siteVisitScheduleModal}
                      onClose={() => siteVisitScheduleClose()}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 5,
                      }}
                    >
                      <Paper
                        sx={{
                          padding: 2,
                          height: "600px",
                          width: "500px",
                        }}
                        elevation={5}
                        component={Box}
                      >
                        <CssBaseline />
                        <SiteVisitSchedule appID={getValues("id")} />
                        <Grid container>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Button variant="contained" onClick={() => siteVisitScheduleClose()}>
                              {<FormattedLabel id="exit" />}
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Modal>

                    {/**  Verification  */}
                    <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={verificationDailog}
                      onClose={() => verificationClose()}
                    >
                      <CssBaseline />
                      <DialogTitle> {<FormattedLabel id="basicApplicationDetails" />}</DialogTitle>
                      <DialogContent>
                        <VerificationAppplicationDetails
                          props={applicationData}
                          siteVisitPreviewButtonInputState={siteVisitPreviewButtonInputState}
                        />
                      </DialogContent>
                      <DialogTitle>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <Stack
                            style={{ display: "flex", justifyContent: "center" }}
                            spacing={3}
                            direction={"row"}
                          >
                            <Button
                              variant="contained"
                              style={{ backgroundColor: "green" }}
                              onClick={() => approveRevertRemarkDailogOpen()}
                            >
                              {<FormattedLabel id="action" />}
                            </Button>
                            <Button
                              style={{ backgroundColor: "red" }}
                              variant="contained"
                              onClick={() => verificationClose()}
                            >
                              {<FormattedLabel id="exit" />}
                            </Button>
                          </Stack>
                        </Grid>
                      </DialogTitle>
                    </Dialog>

                    {/** Approve Button   Preview Dailog  */}
                    <Modal
                      open={approveRevertRemarkDailog}
                      onClose={() => approveRevertRemarkDailogClose()}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 5,
                      }}
                    >
                      <Paper
                        sx={{
                          padding: 2,
                          height: "400px",
                          width: "600px",
                        }}
                        elevation={5}
                        component={Box}
                      >
                        <Grid container>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography style={{ marginBottom: "30px", marginTop: "20px" }} variant="h6">
                              {<FormattedLabel id="enterRemarkForApplication" />}
                            </Typography>
                            <br />
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextareaAutosize
                              style={{
                                width: "550px",
                                height: "200px",
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "30px",
                              }}
                              {...register("verificationRemark")}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Stack spacing={5} direction="row">
                              <Button
                                variant="contained"
                                // type='submit'
                                style={{ backgroundColor: "green" }}
                                onClick={() => remarkFun("Approve")}
                              >
                                {<FormattedLabel id="approve" />}
                              </Button>
                              <Button variant="contained" onClick={() => remarkFun("Revert")}>
                                {<FormattedLabel id="reassign" />}
                              </Button>
                              {/** Form Preview Button */}

                              <Button
                                style={{ backgroundColor: "red" }}
                                onClick={() => approveRevertRemarkDailogClose()}
                              >
                                {<FormattedLabel id="exit" />}
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Modal>
                  </form>
                </FormProvider>
                </ThemeProvider>
                <br/>
            </Paper>
          </div>
        </>
      )}
    </>
  );
};

export default Index;
