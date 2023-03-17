import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
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
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import sweetAlert from "sweetalert";
import { Failed } from "../../../components/streetVendorManagementSystem/components/commonAlert";
import SiteVisitSchedule from "../../../components/streetVendorManagementSystem/components/SiteVisitSchedule";
import VerificationAppplicationDetails from "../../../components/streetVendorManagementSystem/components/VerificationAppplicationDetails";
import styles from "../../../components/streetVendorManagementSystem/styles/deparmentalCleark.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import urls from "../../../URLS/urls";
// Main Component - Clerk
const Index = () => {
  // Methods in useForm
  const methods = useForm({
    defaultValues: {
      aadhaarCardPhoto: null,
      panCardPhoto: null,
      rationCardPhoto: null,
      disablityCertificatePhoto: null,
      otherDocumentPhoto: null,
      affidaviteOnRS100StampAttache: null,
      serviceName: "",
      formPreviewDailogState: false,
      applicationNumber: "HMS089734584837",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      trackingID: "46454565454445",
      citySurveyNo: "",
      hawkingZoneName: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      religion: "",
      cast: "",
      subCast: "",
      dateOfBirth: null,
      age: "",
      typeOfDisability: "",
      mobile: "",
      emailAddress: "",
      crCitySurveyNumber: "",
      crAreaName: "",
      crLandmarkName: "",
      crVillageName: "",
      crCityName: "Pimpri-Chinchwad",
      crState: "Maharashtra",
      crPincode: "",
      crLattitude: "",
      crLogitude: "",
      addressCheckBox: "",
      prCitySurveyNumber: "",
      prAreaName: "",
      prLandmarkName: "",
      prVillageName: "",
      prCityName: "Pimpri-Chinchwad",
      prState: "Maharashtra",
      prPincode: "",
      prLattitude: "",
      prLogitude: "",
      wardNo: "",
      wardName: "",
      natureOfBusiness: "",
      hawkingDurationDaily: "",
      hawkerType: "",
      item: "",
      periodOfResidenceInMaharashtra: null,
      periodOfResidenceInPCMC: null,
      rationCardNo: "",
      bankMaster: "",
      branchName: "",
      bankAccountNo: "",
      ifscCode: "",
      crPropertyTaxNumber: "",
      proprtyAmount: "",
      crWaterConsumerNo: "",
      waterAmount: "",
      inputState: true,
      serviceName: "",
    },
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
  const [authority, setAuthority] = useState();
  const user = useSelector((state) => state.user.user);
  const [newRole, setNewRole] = useState();
  const [pendingApplication, setPendingApplication] = useState(0);
  const [rejectedApplication, setRejectedApplication] = useState(0);
  const [approvedApplication, setApprovedApplication] = useState(0);
  const [totalApplication, setTotalApplication] = useState(0);
  const [applicationData, setApplicationData] = useState();
  const [tableData, setTableData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [siteVisitScheduleModal, setSiteVisitScheduleModal] = useState(false);
  const [hardCodeAuthority, setHardCodeAuthority] = useState();
  const [verificationDailog, setVerificationDailog] = useState();
  const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointmentType, setAppointmentType] = useState([]);
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
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    setApplicationData(record.row);
                    setNewRole("DEPT_CLERK_VERIFICATION");
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
                    setNewRole("VERIFICATION");
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
                    setNewRole("VERIFICATION");
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
              authority?.find((r) => r === "LOI_COLLECTION" || r === "ADMIN") && (
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
                    setLoadderState(true);
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
                          setLoadderState(false);
                          res?.data?.id
                            ? sweetAlert("Generated!", "Certificate Generated Successfully", "success")
                            : sweetAlert("Generated !", "Certificate Generated Successfully", "success");
                          localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                          router.push(
                            `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/CertificateIssuanceOfHawkerLicense`,
                          );
                        } else {
                          setLoadderState(false);
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
              record?.row?.applicationStatus == "I_CARD_ISSUED") &&
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
            {record?.row?.applicationStatus == "LICENSE_ISSUED" &&
              authority?.find((r) => r === "I_CARD_ISSUANCE" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    setLoadderState(true);
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
                          setLoadderState(false);
                          res?.data?.id
                            ? sweetAlert("Generated!", "I Card Generated Successfully", "success")
                            : sweetAlert("Generated !", "I Card Generated Successfully", "success");
                          localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                          router.push(
                            `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/IdCardOfStreetVendor`,
                          );
                        } else {
                          setLoadderState(false);
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
            {record?.row?.applicationStatus == "I_CARD_ISSUED" &&
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

  // zones
  const getZoneKeys = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneKey: row.zoneName,
        })),
      );
    });
  };

  // wards
  const getWardKeys = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardKey: row.wardName,
        })),
      );
    });
  };

  // serviceNames
  const getServiceNames = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
      setServiceNames(
        r.data.service.map((row) => ({
          id: row.id,
          serviceName: row.serviceName,
        })),
      );
    });
  };

  // departmentsNames
  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
        })),
      );
    });
  };

  // filterDataOnFindButton
  const mrFilterTableData = () => {
    // Approved Application Count
    const tempData = dataSource.filter((data, index) => {
      return data.wardKey == getValues("wardKey");
    });
    setTableData(tempData);
  };

  // resetDataOnResetButton
  const resetFilterData = () => {};

  // approvedApplication
  const clerkTabClick = (props) => {
    const tableData = dataSource.filter((data, index) => {
      if (data.applicationVerficationStatus == props) {
        return data;
      } else if ("TotalApplications" == props) {
        return data;
      }
    });
    setTableData(tableData);
  };

  // onSubmit - mainForm
  const onSubmitForm = (data) => {
    console.log("dsfldsj", data);
  };

  // getIssuanceOfHawkerLicense - tableData
  const getIssuanceOfHawkerLicense = () => {
    setLoadderState(true);
    console.log("authority", authority);
    let tempStatues = [];
    if (
      JSON.stringify(authority) ==
      JSON.stringify([
        "I_CARD_ISSUANCE",
        "LICENSE_ISSUANCE",
        "LOI_COLLECTION",
        "VERIFICATION",
        "SITE_VISIT",
        "LOI_GENERATION",
      ])
    ) {
      // alert("dept");
      tempStatues = [
        "APPLICATION_CREATED",
        "DEPT_CLERK_VERIFICATION_COMPLETED",
        "APPLICATION_SENT_BACK_TO_DEPT_CLERK",
        "SITE_VISIT_SCHEDULED",
        "APPLICATION_VERIFICATION_COMPLETED",
        "PAYEMENT_SUCCESSFUL",
        "I_CARD_ISSUED",
        "LICENSE_ISSUED",
        "SITE_VISIT_RESCHEDULED",
        "LOI_GENERATE",
      ];
    } else if (JSON.stringify(authority) == JSON.stringify(["ADMIN_OFFICER", "VERIFICATION"])) {
      tempStatues = [
        "SITE_VISIT_COMPLETED",
        "ADMIN_OFFICER",
        "APPLICATION_SENT_TO_ADMIN_OFFICER",
        "APPLICATION_SENT_BACK_TO_ADMIN_OFFICER",
      ];
    } else if (JSON.stringify(authority) == JSON.stringify(["WARD_OFFICER", "VERIFICATION"])) {
      tempStatues = ["BILL_APPROVED", "APPLICATION_SENT_TO_WARD_OFFICER"];
    } else if (JSON.stringify(authority) == JSON.stringify(["LOI_COLLECTION"])) {
      tempStatues = ["LOI_GENERATED"];
    } else if (JSON.stringify(authority) == JSON.stringify(["ADMIN"])) {
      tempStatues = [
        "APPLICATION_CREATED",
        "APPLICATION_SENT_BACK_TO_DEPT_CLERK",
        "SITE_VISIT_SCHEDULED",
        "SITE_VISIT_COMPLETED",
        "PAYEMENT_SUCCESSFUL",
        "I_CARD_ISSUED",
        "LICENSE_ISSUED",
        "SITE_VISIT_RESCHEDULED",
        "LOI_GENERATE",
        "BILL_APPROVED",
        "APPLICATION_VERIFICATION_COMPLETED",
        "APPLICATION_SENT_TO_WARD_OFFICER",
        "ADMIN_OFFICER",
        "WARD_OFFICER",
      ];
    }

    const body = {
      applicationStatuses: tempStatues,
    };
    console.log("body4034034", body);

    if (tempStatues != null || tempStatues !== undefined) {
      axios
        .post(`${urls.HMSURL}/IssuanceofHawkerLicense/getDetailsByStatus`, body)
        .then((resp) => {
          if (resp?.status == 200 || resp?.status == 201 || resp?.status == "SUCCESS") {
            // console.log("response Data", JSON.stringify(resp.data.issuanceOfHawkerLicense));
            setDataSource(resp.data.issuanceOfHawkerLicense);
            setTableData(resp.data.issuanceOfHawkerLicense);
            // Approved Application Count
            const approvedApplicationCount = resp.data.issuanceOfHawkerLicense.filter((data, index) => {
              return data.applicationVerficationStatus == "APPROVED";
            });
            setApprovedApplication(approvedApplicationCount.length);
            // Pending Application
            const pendingApplicationCount = resp.data.issuanceOfHawkerLicense.filter((data, index) => {
              return data.applicationVerficationStatus == "PENDING";
            });
            setPendingApplication(pendingApplicationCount.length);
            // Rejected  Application
            const rejectedApplicationCount = resp.data.issuanceOfHawkerLicense.filter((data, index) => {
              return data.applicationVerficationStatus == "REJECTED";
            });
            setRejectedApplication(rejectedApplicationCount.length);
            // Total  Application
            const totalApplicationCount = resp.data.issuanceOfHawkerLicense.filter((data, index) => {
              return data.applicationVerficationStatus;
            });
            setTotalApplication(totalApplicationCount.length);
            setLoadderState(false);
          } else {
            setLoadderState(false);
            <Failed />;
          }
        })
        .catch(() => {
          setLoadderState(false);
          <Failed />;
        });
    } else {
      <Failed />;
    }

    console.log("statuses", body);

    // axios
    //   .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getIssuanceOfHawkerLicenseData`)
    //   .then((resp) => {
    //     if (resp?.status == 200 || resp?.status == 201 || resp?.status == "SUCCESS") {
    //       // console.log("response Data", JSON.stringify(resp.data.issuanceOfHawkerLicense));
    //       setDataSource(resp.data.issuanceOfHawkerLicense);
    //       setTableData(resp.data.issuanceOfHawkerLicense);

    //       // Approved Application Count
    //       const approvedApplicationCount = resp.data.issuanceOfHawkerLicense.filter((data, index) => {
    //         return data.applicationVerficationStatus == "APPROVED";
    //       });
    //       setApprovedApplication(approvedApplicationCount.length);

    //       // Pending Application
    //       const pendingApplicationCount = resp.data.issuanceOfHawkerLicense.filter((data, index) => {
    //         return data.applicationVerficationStatus == "PENDING";
    //       });
    //       setPendingApplication(pendingApplicationCount.length);

    //       // Rejected  Application
    //       const rejectedApplicationCount = resp.data.issuanceOfHawkerLicense.filter((data, index) => {
    //         return data.applicationVerficationStatus == "REJECTED";
    //       });
    //       setRejectedApplication(rejectedApplicationCount.length);

    //       // Total  Application
    //       const totalApplicationCount = resp.data.issuanceOfHawkerLicense.filter((data, index) => {
    //         return data.applicationVerficationStatus;
    //       });

    //       setTotalApplication(totalApplicationCount.length);
    //       setLoadderState(false);
    //     } else {
    //       setLoadderState(false);
    //       <Failed />;
    //     }
    //   })
    //   .catch(() => {
    //     setLoadderState(false);
    //     <Failed />;
    //   });
  };

  // remarkFunction
  const remarkFun = (data) => {
    setLoadderState(true);
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
      role: newRole,
    };
    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setLoadderState(false);

          if (data == "Approve") {
            sweetAlert("Approved!", "verification successfully completed", "success");
          } else if (data == "Revert") {
            sweetAlert("Reassigned !", "application is reassigned", "error");
          }
          approveRevertRemarkDailogClose();

          router.push("/streetVendorManagementSystem/dashboards");
        } else {
          setLoadderState(false);
          <Failed />;
        }
      });
  };

  //  ==============>  Use Effects <======================

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("SachinUser", auth);
    getWardKeys();
    getZoneKeys();
    getServiceNames();
    getDepartments();
  }, []);

  useEffect(() => {
    getIssuanceOfHawkerLicense();
  }, [wardKeys, zoneKeys, serviceNames, departments, authority]);

  useEffect(() => {
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    clerkTabClick("TotalApplications");
  }, []);

  // loading
  useEffect(() => {}, [loadderState]);

  // view
  return (
    <>
      <ToastContainer />
      {loadderState ? (
        <Loader />
      ) : (
        <>
          <div style={{ backgroundColor: "white" }}>
            <ToastContainer />
            <Paper
              elevation={5}
              sx={{
                backgroundColor: "#F5F5F5",
              }}
              component={Box}
            >
              {/** DashBoard Header */}

              <Grid container>
                {/** Clerk */}
                <Grid item xs={4}>
                  <Paper sx={{ height: "160px" }} component={Box} p={2} m={2} squar="true" elevation={5}>
                    <Typography variant="h6">
                      <strong>WelCome </strong>
                    </Typography>

                    <Typography variant="h6" style={{ justifyContent: "center" }}>
                      <strong>Officer Name</strong>
                    </Typography>
                    <Typography variant="subtitle">
                      <strong>Deparmental clark </strong>
                    </Typography>
                    <br />
                  </Paper>
                </Grid>
                {/** Applicatins Tabs */}

                <Grid item xs={8}>
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
                      <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                        <div className={styles.icono}>
                          <BabyChangingStationIcon color="primary" />
                        </div>
                        <br />
                        <div className={styles.icono}>
                          <strong align="center">Total Application</strong>
                        </div>
                        <Typography variant="h6" align="center" color="primary">
                          {totalApplication}
                        </Typography>
                      </div>

                      {/** Vertical Line */}
                      <div className={styles.jugaad}></div>

                      {/** Approved Application */}
                      <div className={styles.one} onClick={() => clerkTabClick("APPROVED")}>
                        <div className={styles.icono}>
                          <ThumbUpAltIcon color="success" />
                        </div>
                        <br />
                        <div className={styles.icono}>
                          <strong align="center">Approved Application</strong>
                        </div>
                        <Typography variant="h6" align="center" color="green">
                          {approvedApplication}
                        </Typography>
                      </div>

                      {/** Vertical Line */}
                      <div className={styles.jugaad}></div>

                      {/** Pending Applications */}
                      <div className={styles.one} onClick={() => clerkTabClick("PENDING")}>
                        <div className={styles.icono}>
                          <PendingActionsIcon color="warning" />
                        </div>
                        <br />
                        <div className={styles.icono}>
                          <strong align="center"> Pending Application</strong>
                        </div>
                        <Typography variant="h6" align="center" color="orange">
                          {pendingApplication}
                        </Typography>
                      </div>

                      {/** Vertical Line */}
                      <div className={styles.jugaad}></div>

                      {/** Rejected Application */}
                      <div className={styles.one} onClick={() => clerkTabClick("REJECTED")}>
                        <div className={styles.icono}>
                          <CancelIcon color="error" />
                        </div>
                        <br />
                        <div className={styles.icono}>
                          <strong align="center">Rejected Application</strong>
                        </div>
                        <Typography variant="h6" align="center" color="error">
                          {rejectedApplication}
                        </Typography>
                      </div>
                    </div>
                  </Paper>
                </Grid>
              </Grid>

              <ThemeProvider theme={theme}>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    {/** Filters */}
                    {/**
              <div className={styles.gridCenter}>
                <Grid container component={Paper} squar="true" elevation={5} m={2} p={2}>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        fontSize: 19,
                        // marginTop: 30,
                        // marginBottom: 30,
                        padding: 8,
                        paddingLeft: 10,
                        marginLeft: "10px",
                        marginRight: "45px",
                        borderRadius: 100,
                      }}
                    >
                      Filters
                    </Grid>
                  </Grid>
                  <Grid container ml={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.serviceName}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="serviceName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Service Name *"
                              sx={{ width: "38vw" }}
                            >
                              {serviceNames &&
                                serviceNames.map((serviceName, index) => (
                                  <MenuItem key={index} value={serviceName.id}>
                                    {serviceName.serviceName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="serviceName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.serviceName ? errors.serviceName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.zoneKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zone" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              //sx={{ width: 230 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Zone Name *"
                            >
                              {zoneKeys &&
                                zoneKeys.map((zoneKey, index) => (
                                  <MenuItem key={index} value={zoneKey.id}>
                                    {zoneKey.zoneKey}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.wardKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="ward" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Ward Name *"
                            >
                              {wardKeys &&
                                wardKeys.map((wardKey, index) => (
                                  <MenuItem key={index} value={wardKey.id}>
                                    {wardKey.wardKey}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="wardKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard">
                        <InputLabel htmlFor="standard-adornment">Application Number</InputLabel>
                        <Input
                          id="standard-adornment"
                          {...register("applicantNumber")}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard">
                        <InputLabel htmlFor="standard-adornment">Applicant Name</InputLabel>
                        <Input
                          id="standard-adornment"
                          {...register("applicantName")}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      {" "}
                      <FormControl sx={{ marginTop: 0 }} error={!!errors.fromDate}>
                        <Controller
                          name="fromDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={<span style={{ fontSize: 16, marginTop: 2 }}>From Date</span>}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl sx={{ marginTop: 0 }} error={!!errors.toDate}>
                        <Controller
                          control={control}
                          name="toDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={<span style={{ fontSize: 16, marginTop: 2 }}>To Date</span>}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container ml={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Button
                        sx={{
                          marginTop: "5vh",
                          margin: "normal",
                          width: 230,
                          size: "medium",
                        }}
                        variant="contained"
                        onClick={() => {
                          mrFilterTableData();
                        }}
                      >
                        Find
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Button
                        sx={{
                          marginTop: "5vh",
                          margin: "normal",
                          width: 230,
                          size: "medium",
                        }}
                        variant="contained"
                        onClick={() => {
                          resetFilterData();
                        }}
                      >
                        Reset
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
               */}

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
                          // backgroundColor: "#F5F5F5",
                          padding: 2,
                          height: "600px",
                          width: "500px",
                          // display: "flex",
                          // alignItems: "center",
                          // justifyContent: "center",
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
            </Paper>
          </div>
        </>
      )}
    </>
  );
};

export default Index;
