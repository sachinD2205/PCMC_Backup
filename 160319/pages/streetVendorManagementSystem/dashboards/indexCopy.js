import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SearchIcon from "@mui/icons-material/Search";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styless from "../../../components/streetVendorManagementSystem/styles/table.module.css";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import UploadButton1 from "../../../components/fileUpload/UploadButton1";
import AadharAuthentication from "../../../components/streetVendorManagementSystem/components/AadharAuthentication";
import AdditionalDetails from "../../../components/streetVendorManagementSystem/components/AdditionalDetails";
import AddressOfHawker from "../../../components/streetVendorManagementSystem/components/AddressOfHawker";
import ApplicationPaymentReceipt from "../../../components/streetVendorManagementSystem/components/ApplicationPaymentReceipt";
import BasicApplicationDetails from "../../../components/streetVendorManagementSystem/components/BasicApplicationDetails";
import HawkerDetails from "../../../components/streetVendorManagementSystem/components/HawkerDetails";
import Identity from "../../../components/streetVendorManagementSystem/components/Identity";
import IssuanceOfStreetVendorLicenseCertificate from "../../../components/streetVendorManagementSystem/components/IssuanceOfStreetVendorLicenseCertificate";
import LoiCollectionComponent from "../../../components/streetVendorManagementSystem/components/LoiCollectionComponent";
import LoiGenerationComponent from "../../../components/streetVendorManagementSystem/components/LoiGenerationComponent";
import LoiGenerationRecipt from "../../../components/streetVendorManagementSystem/components/LoiGenerationRecipt";
import PropertyAndWaterTaxes from "../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes";
import SiteVisit from "../../../components/streetVendorManagementSystem/components/SiteVisit";
import SiteVisitSchedule from "../../../components/streetVendorManagementSystem/components/SiteVisitSchedule";
import VerificationAppplicationDetails from "../../../components/streetVendorManagementSystem/components/VerificationAppplicationDetails";
import styles from "../../../components/streetVendorManagementSystem/styles/deparmentalCleark.module.css";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import urls from "../../../URLS/urls";
import { useRouter } from "next/router";
import {
  DraftSaveAlert,
  Failed,
} from "../../../components/streetVendorManagementSystem/components/commonAlert";
import Loader from "../../../containers/Layout/components/Loader";
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
  const [panCardPhoto, setPanCardPhoto] = useState();
  const [aadhaarCardPhoto, setAadhaarCardPhoto] = useState(null);
  const [rationCardPhoto, setRationCardPhoto] = useState(null);
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] = useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  const [affidaviteOnRS100StampAttache, seteAffidaviteOnRS100StampAttache] = useState(null);
  const [newRole, setNewRole] = useState();
  const [pendingApplication, setPendingApplication] = useState(0);
  const [rejectedApplication, setRejectedApplication] = useState(0);
  const [approvedApplication, setApprovedApplication] = useState(0);
  const [totalApplication, setTotalApplication] = useState(0);
  const [applicationData, setApplicationData] = useState();
  const [tableData, setTableData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [appID, setappID] = useState();
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const [documentRemarkModal, DocumentModal] = useState(false);
  const [siteVisitScheduleModal, setSiteVisitScheduleModal] = useState(false);
  const [siteVisitDailog, setSetVisitDailog] = useState();
  const [loiGeneration, setLoiGeneration] = useState(false);
  const [loiGenerationRecipt, setLoiGenerationRecipt] = useState(false);
  const [loiCollection, setLoiCollection] = useState(false);
  const [hardCodeAuthority, setHardCodeAuthority] = useState();
  const [loiCollectionPaymentRecipt, setLoiCollectionPaymentRecipt] = useState(false);
  const [certificate, setCertificate] = useState(false);
  const [iCard, setICard] = useState(false);
  const [verificationDailog, setVerificationDailog] = useState();
  const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  const language = useSelector((state) => state?.labels.language);

  const [siteVisitPreviewButtonInputState, setSiteVisitPreviewButtonInputState] = useState(false);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  // Form Preview - ===================>
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Document  Preview Dailog - ===================>
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  // Remark Document Preview
  const documentRemarkModalOpen = () => DocumentModal(true);
  const documentRemarkModalClose = () => DocumentModal(false);

  // site Schedule Modal
  const siteVisitScheduleOpen = () => setSiteVisitScheduleModal(true);
  const siteVisitScheduleClose = () => setSiteVisitScheduleModal(false);

  // site Visit Dailog
  const siteVisitOpen = () => setSetVisitDailog(true);
  const siteVisitClose = () => setSetVisitDailog(false);

  // Loi Generation Open
  const loiGenerationOpen = () => setLoiGeneration(true);
  const loiGenerationClose = () => setLoiGeneration(false);

  // Loi Generation  Recipt
  const loiGenerationReciptOpen = () => setLoiGenerationRecipt(true);
  const loiGenerationReciptClose = () => setLoiGenerationRecipt(false);

  // loi Collection
  const loiCollectionOpen = () => setLoiCollection(true);
  const loiCollectionClose = () => setLoiCollection(false);

  // Loi Collection Payment Recipt
  const loiCollectionPaymentReciptOpen = () => setLoiCollectionPaymentRecipt(true);
  const loiCollectionPaymentReciptClose = () => setLoiCollectionPaymentRecipt(false);

  // I Card Certificate
  const openICard = () => setICard(true);
  const closeICard = () => setICard(false);

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
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNumber" />,
      description: <FormattedLabel id="applicationNumber" />,
      width: 180,
      // flex: 1,
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      description: <FormattedLabel id="applicationDate" />,
      width: 120,
      // flex: 1,
    },

    {
      field: "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      description: <FormattedLabel id="applicantName" />,
      width: 200,
      // flex: 1,
    },

    {
      field: language === "en" ? "serviceName" : "serviceNameMr",
      headerName: <FormattedLabel id="serviceName" />,
      description: <FormattedLabel id="serviceName" />,
      width: 250,
      // flex: 1,
    },
    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="applicationStatus" />,
      headerName: <FormattedLabel id="applicationStatus" />,
      width: 250,
      // flex: 1,
    },

    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 2000,
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
                  <Button
                    variant="contained"
                    // endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    verification DEPT
                  </Button>
                </IconButton>
              )}
            {/** Site Visit Schedule Button */}
            {record?.row?.applicationStatus == "DEPT_CLERK_VERIFICATION_COMPLETED" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    siteVisitScheduleOpen();
                  }}
                >
                  <Button variant="contained" size="small">
                    Site Visit Schedule
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
                  // onClick={() => {
                  //   reset(record.row);
                  //   setValue("serviceName", record.row.serviceId);
                  //   setValue("disabledFieldInputState", true);
                  //   siteVisitOpen();
                  // }}
                >
                  <Button variant="contained" size="small">
                    Site Visit
                  </Button>
                </IconButton>
              )}
            {/** AO  */}
            {(record?.row?.applicationStatus === "SITE_VISIT_COMPLETED" ||
              record?.row?.applicationStatus === "APPLICATION_SENT_BACK_TO_ADMIN_OFFICER") &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
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
                  <Button
                    variant="contained"
                    size="small"
                    // endIcon={<VisibilityIcon />}
                  >
                    verification AO
                  </Button>
                </IconButton>
              )}
            {/**  Ward Officer */}
            {record?.row?.applicationStatus === "APPLICATION_SENT_TO_WARD_OFFICER" &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
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
                  <Button
                    variant="contained"
                    // endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    verification WO
                  </Button>
                </IconButton>
              )}
            {/** LOI Generation Button */}
            {record?.row?.applicationStatus === "APPLICATION_VERIFICATION_COMPLETED" &&
              authority?.find((r) => r === "PAYEMENT_SUCCESSFUL" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/LoiGeneration`,
                    );
                  }}
                  // onClick={() => {
                  //   reset(record.row);
                  //   setValue("serviceName", record.row.serviceId);
                  //   setValue("disabledFieldInputState", true);
                  //   loiGenerationOpen();
                  // }}
                >
                  <Button variant="contained" size="small">
                    LOI Generation
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
                  // onClick={() => {
                  //   setApplicationData(record.row);
                  //   reset(record.row);
                  //   setValue("serviceName", record.row.serviceId);
                  //   loiGenerationReciptOpen();
                  // }}
                >
                  <Button variant="contained" endIcon={<VisibilityIcon />} size="small">
                    LOI Generation Recipt
                  </Button>
                </IconButton>
              )}
            {/** LOI Collection Button */}
            {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find((r) => r === "LOI_COLLECTION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollection`,
                    );
                  }}
                  // onClick={() => {
                  //   setApplicationData(record.row);
                  //   reset(record.row);
                  //   setValue("serviceName", record.row.serviceId);
                  //   loiCollectionOpen();
                  // }}
                >
                  <Button variant="contained" size="small">
                    LOI Collection
                  </Button>
                </IconButton>
              )}
            {/** LOI Collection Recipt Button */}
            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find((r) => r === "LOI_COLLECTION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollectionRecipt`,
                    );
                  }}
                  // onClick={() => {
                  //   setApplicationData(record.row);
                  //   reset(record.row);
                  //   setValue("serviceName", record.row.serviceId);
                  //   loiCollectionPaymentReciptOpen();
                  // }}
                >
                  <Button variant="contained" endIcon={<VisibilityIcon />} size="small">
                    Payment Recipt
                  </Button>
                </IconButton>
              )}
            {/** Certificate view certificate */}
            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find((r) => r === "LICENSE_ISSUANCE" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    setLoadderState(true);
                    const finalBodyForApi = {
                      id: record?.row?.id,
                      role: "LICENSE_ISSUANCE",
                      // desg: "LICENSE_ISSUANCE",
                      approveRemark: "Approve Certificate",
                    };

                    console.log("finalBodyForAoi", finalBodyForApi);

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
                    Generate Certitifcate
                  </Button>
                </IconButton>
              )}
            {/** Certificate view certificate */}
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
                    View Certificate
                  </Button>
                </IconButton>
              )}

            {/** Generate I card */}
            {record?.row?.applicationStatus == "LICENSE_ISSUED" &&
              authority?.find((r) => r === "LICENSE_ISSUANCE" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    setLoadderState(true);
                    const finalBodyForApi = {
                      id: record?.row?.id,
                      role: "I_CARD_ISSUANCE",
                      approveRemark: "I Card Issued",
                    };

                    console.log("finalBodyForAoi", finalBodyForApi);

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
                    Generate I Card
                  </Button>
                </IconButton>
              )}

            {/** ICard certificate */}
            {record?.row?.applicationStatus == "I_CARD_ISSUED" &&
              authority?.find((r) => r === "LICENSE_ISSUANCE" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    localStorage.setItem("issuanceOfHawkerLicenseId", record?.row?.id);
                    router.push(
                      `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/IdCardOfStreetVendor`,
                    );
                  }}
                >
                  <Button variant="contained" endIcon={<VisibilityIcon />} size="small">
                    View I Card
                  </Button>
                </IconButton>
              )}

            {/** Send To Revert Authority */}
            {/**  
            <IconButton>
              <Button variant='contained' size='small'>
                Revert
              </Button>
            </IconButton> 
          */}
            {/** Send To Next Authority */}
            {/** 
            <IconButton>
              <Button variant='contained' size='small'>
                Send Next Authority
              </Button>
            </IconButton>
            */}
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

  // loiGeneration
  const loiGenerationFun = () => {
    loiGenerationOpen();
    loiModalClose();
  };

  // saveRemark
  const viewDocumentPreviewSaveRemark = () => {
    documentRemarkModalClose();
    viewDocumentRemarkSuccessNotify();
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
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getIssuanceOfHawkerLicenseData`)
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
  };

  // approveNotification
  const sendApprovedNotify = () => {
    toast.success("Approved Successfully !!!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // viewDocumentRemarkSuccessNotify
  const viewDocumentRemarkSuccessNotify = () => {
    toast.success("Application Reverted !!!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // revertButton
  const revertButton = () => {
    documentPreviewDailogClose();
    documentRemarkModalOpen();
  };

  // approveButton
  const approveButton = () => {
    documentPreviewDailogClose();
    sendApprovedNotify();
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
          res?.data?.id
            ? sweetAlert("Approved!", "verification successfully completed", "success")
            : sweetAlert("Approved !", "verification successfully completed", "success");
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
    localStorage.removeItem("certificateIssuanceOfHawkerLicenseID");
    localStorage.removeItem("HawkerICardID");
    localStorage.removeItem("siteVisitId");
    // alert("tableData");
    clerkTabClick("TotalApplications");
  }, []);

  // loading
  useEffect(() => {}, [loadderState]);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <>
          <div style={{ backgroundColor: "white" }}>
            <ToastContainer />
            <Paper
              elevation={5}
              sx={{
                // marginLeft: "100px",
                // marginRight: "50px",
                // marginTop: "110px",
                // padding: 1,
                // paddingLeft: "20px",
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

                    {/** Form Preview Dailog  - OK */}
                    <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={formPreviewDailog}
                      onClose={() => formPreviewDailogClose()}
                    >
                      <CssBaseline />
                      <DialogTitle>
                        <Grid container>
                          <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                            Preview
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sm={2}
                            md={4}
                            lg={6}
                            xl={6}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <IconButton
                              aria-label="delete"
                              sx={{
                                marginLeft: "530px",
                                backgroundColor: "primary",
                                ":hover": {
                                  bgcolor: "red", // theme.palette.primary.main
                                  color: "white",
                                },
                              }}
                              onClick={() => formPreviewDailogClose()}
                            >
                              <CloseIcon
                                sx={{
                                  color: "black",
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </DialogTitle>
                      <DialogContent>
                        <BasicApplicationDetails />
                        <HawkerDetails />
                        <AddressOfHawker />
                        <AadharAuthentication />
                        <PropertyAndWaterTaxes />
                        <AdditionalDetails />
                      </DialogContent>

                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button onClick={formPreviewDailogClose}>Exit</Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>

                    {/** Document Preview Dailog - OK */}
                    <Dialog
                      fullWidth
                      maxWidth={"xl"}
                      open={documentPreviewDialog}
                      onClose={() => documentPreviewDailogClose()}
                    >
                      <Paper sx={{ p: 2 }}>
                        <CssBaseline />
                        <DialogTitle>
                          <Grid container>
                            <Grid
                              item
                              xs={6}
                              sm={6}
                              lg={6}
                              xl={6}
                              md={6}
                              sx={{
                                display: "flex",
                                alignItem: "left",
                                justifyContent: "left",
                              }}
                            >
                              Document Preview
                            </Grid>
                            <Grid
                              item
                              xs={1}
                              sm={2}
                              md={4}
                              lg={6}
                              xl={6}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <IconButton
                                aria-label="delete"
                                sx={{
                                  marginLeft: "530px",
                                  backgroundColor: "primary",
                                  ":hover": {
                                    bgcolor: "red", // theme.palette.primary.main
                                    color: "white",
                                  },
                                }}
                                onClick={() => documentPreviewDailogClose()}
                              >
                                <CloseIcon
                                  sx={{
                                    color: "black",
                                  }}
                                />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </DialogTitle>
                        <DialogContent
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TableContainer>
                            <Table>
                              <TableHead
                                stickyHeader={true}
                                sx={{
                                  // textDecorationColor: "white",
                                  backgroundColor: "#1890ff",
                                }}
                              >
                                <TableRow>
                                  <TableCell style={{ color: "white" }}>sr.no</TableCell>
                                  <TableCell style={{ color: "white" }}>
                                    <h3>Document Name</h3>
                                  </TableCell>
                                  <TableCell style={{ color: "white" }}>
                                    <h3>Mandatory</h3>
                                  </TableCell>
                                  <TableCell style={{ color: "white" }}>
                                    <h3>View Document</h3>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>1 </TableCell>
                                  <TableCell>Aadhaar Card</TableCell>
                                  <TableCell>Required</TableCell>
                                  <TableCell>
                                    <UploadButton1
                                      appName="HMS"
                                      serviceName="H-IssuanceofHawkerLicense"
                                      filePath={setAadhaarCardPhoto}
                                      fileName={getValues("aadhaarCardPhoto")}
                                    />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>2 </TableCell>
                                  <TableCell>Pan </TableCell>
                                  <TableCell>Required</TableCell>
                                  <TableCell>
                                    <UploadButton1
                                      appName="HMS"
                                      serviceName="H-IssuanceofHawkerLicense"
                                      filePath={setPanCardPhoto}
                                      fileName={getValues("panCardPhoto")}
                                    />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>3</TableCell>
                                  <TableCell>Ration Card</TableCell>
                                  <TableCell>Required</TableCell>
                                  <TableCell>
                                    <UploadButton1
                                      appName="HMS"
                                      serviceName="H-IssuanceofHawkerLicense"
                                      filePath={setRationCardPhoto}
                                      fileName={getValues("rationCardPhoto")}
                                    />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>4</TableCell>
                                  <TableCell>Disablity Certificate</TableCell>
                                  <TableCell>Required</TableCell>
                                  <TableCell>
                                    <UploadButton1
                                      appName="HMS"
                                      serviceName="H-IssuanceofHawkerLicense"
                                      filePath={disablityCertificatePhoto}
                                      fileName={getValues("disablityCertificatePhoto")}
                                    />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>5</TableCell>
                                  <TableCell>Affidavite </TableCell>
                                  <TableCell>Required</TableCell>
                                  <TableCell>
                                    <UploadButton1
                                      appName="HMS"
                                      serviceName="H-IssuanceofHawkerLicense"
                                      filePath={seteAffidaviteOnRS100StampAttache}
                                      fileName={getValues("affidaviteOnRS100StampAttache")}
                                    />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>6</TableCell>
                                  <TableCell>Other Documents</TableCell>
                                  <TableCell>Required</TableCell>
                                  <TableCell>
                                    <UploadButton1
                                      appName="HMS"
                                      serviceName="H-IssuanceofHawkerLicense"
                                      filePath={setOtherDocumentPhoto}
                                      fileName={getValues("otherDocumentPhoto")}
                                    />
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </DialogContent>
                        <Grid container>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Stack
                              direction="row"
                              spacing={2}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Button type="submit" variant="contained" onClick={approveButton}>
                                Approve
                              </Button>
                              <Button variant="contained" onClick={revertButton}>
                                Revert
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>
                        <DialogTitle>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Button variant="contained" onClick={() => documentPreviewDailogClose()}>
                              Exit
                            </Button>
                          </Grid>
                        </DialogTitle>
                      </Paper>
                    </Dialog>

                    {/** Site Visit Modal*/}
                    <Dialog fullWidth maxWidth={"lg"} open={siteVisitDailog} onClose={() => siteVisitClose()}>
                      <CssBaseline />
                      <DialogTitle>
                        <Grid container>
                          <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                            Site Visit
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sm={2}
                            md={4}
                            lg={6}
                            xl={6}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <IconButton
                              aria-label="delete"
                              sx={{
                                marginLeft: "530px",
                                backgroundColor: "primary",
                                ":hover": {
                                  bgcolor: "red", // theme.palette.primary.main
                                  color: "white",
                                },
                              }}
                              onClick={() => siteVisitClose()}
                            >
                              <CloseIcon
                                sx={{
                                  color: "black",
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </DialogTitle>
                      <DialogContent>
                        <BasicApplicationDetails />
                        <HawkerDetails />
                        <AddressOfHawker />
                        <AadharAuthentication />
                        <PropertyAndWaterTaxes />
                        <AdditionalDetails />
                        <SiteVisit siteVisitDailogP={setSetVisitDailog} appID={getValues("id")} />
                      </DialogContent>

                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button variant="contained" onClick={() => siteVisitClose()}>
                            Exit
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>

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
                              Exit
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Modal>

                    {/** LOI Generation OK */}
                    <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={loiGeneration}
                      onClose={() => loiGenerationClose()}
                    >
                      <CssBaseline />
                      <DialogTitle>
                        <Grid container>
                          <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                            LOI Generation
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sm={2}
                            md={4}
                            lg={6}
                            xl={6}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <IconButton
                              aria-label="delete"
                              sx={{
                                marginLeft: "530px",
                                backgroundColor: "primary",
                                ":hover": {
                                  bgcolor: "red", // theme.palette.primary.main
                                  color: "white",
                                },
                              }}
                              onClick={() => loiGenerationClose()}
                            >
                              <CloseIcon
                                sx={{
                                  color: "black",
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </DialogTitle>
                      <DialogContent>
                        <LoiGenerationComponent serviceID={watch("serviceName")} />
                      </DialogContent>
                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button variant="contained" onClick={() => loiGenerationClose()}>
                            Exit
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>

                    {/** LOI Collection Ok */}
                    <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={loiCollection}
                      onClose={() => loiCollectionClose()}
                    >
                      <CssBaseline />
                      <DialogTitle>
                        <Grid container>
                          <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                            LOI Collection
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sm={2}
                            md={4}
                            lg={6}
                            xl={6}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <IconButton
                              aria-label="delete"
                              sx={{
                                marginLeft: "530px",
                                backgroundColor: "primary",
                                ":hover": {
                                  bgcolor: "red", // theme.palette.primary.main
                                  color: "white",
                                },
                              }}
                              onClick={() => loiCollectionClose()}
                            >
                              <CloseIcon
                                sx={{
                                  color: "black",
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </DialogTitle>
                      <DialogContent>
                        <LoiCollectionComponent />
                      </DialogContent>
                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button variant="contained" onClick={() => loiCollectionClose()}>
                            Exit
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>

                    {/** LOI Collection Payment Recipt OK */}
                    <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={loiCollectionPaymentRecipt}
                      onClose={() => loiCollectionPaymentReciptClose()}
                    >
                      <CssBaseline />
                      <DialogTitle>
                        <FormattedLabel id="loiPreview" />
                      </DialogTitle>
                      <DialogContent>
                        <ApplicationPaymentReceipt id={applicationData} />
                      </DialogContent>
                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button variant="contained" onClick={() => loiCollectionPaymentReciptClose()}>
                            Exit
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>

                    {/** LOI Generation  Recipt  OK */}
                    <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={loiGenerationRecipt}
                      onClose={() => loiGenerationReciptClose()}
                    >
                      <CssBaseline />
                      <DialogTitle>
                        <FormattedLabel id="loiPreview" />
                      </DialogTitle>
                      <DialogContent>
                        <LoiGenerationRecipt props={applicationData} />
                      </DialogContent>
                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button variant="contained" onClick={() => loiGenerationReciptClose()}>
                            Exit
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>

                    {/**  Certificate */}
                    <Dialog fullWidth maxWidth={"lg"} open={certificate} onClose={() => closeCertificate()}>
                      <CssBaseline />
                      <DialogTitle>
                        <FormattedLabel id="viewCertificate" />
                      </DialogTitle>
                      <DialogContent>
                        <IssuanceOfStreetVendorLicenseCertificate props={applicationData} />
                      </DialogContent>
                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button variant="contained" onClick={() => closeCertificate()}>
                            Exit
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>

                    {/** I Card Certificate */}
                    <Dialog fullWidth maxWidth={"lg"} open={iCard} onClose={() => closeICard()}>
                      <CssBaseline />
                      <DialogTitle>
                        <FormattedLabel id="iCard" />
                      </DialogTitle>
                      <DialogContent>
                        <Identity props={applicationData} />
                      </DialogContent>
                      <DialogTitle>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Button variant="contained" onClick={() => closeICard()}>
                            Exit
                          </Button>
                        </Grid>
                      </DialogTitle>
                    </Dialog>

                    {/**  Verification  */}
                    <Dialog
                      fullWidth
                      maxWidth={"lg"}
                      open={verificationDailog}
                      onClose={() => verificationClose()}
                    >
                      <CssBaseline />
                      <DialogTitle>Basic Application Details</DialogTitle>
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
                              Action
                            </Button>
                            <Button
                              style={{ backgroundColor: "red" }}
                              variant="contained"
                              onClick={() => verificationClose()}
                            >
                              Exit
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
                          // backgroundColor: "#F5F5F5",
                          padding: 2,
                          height: "400px",
                          width: "600px",
                          // display: "flex",
                          // alignItems: "center",
                          // justifyContent: "center",
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
                              Enter Remark for Application
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
                                Approve
                              </Button>
                              <Button variant="contained" onClick={() => remarkFun("Revert")}>
                                Revert
                              </Button>
                              {/** Form Preview Button */}

                              <Button
                                style={{ backgroundColor: "red" }}
                                onClick={() => approveRevertRemarkDailogClose()}
                              >
                                Exit
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
