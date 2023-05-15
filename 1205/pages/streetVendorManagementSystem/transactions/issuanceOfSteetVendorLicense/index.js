import AddCircleIcon from "@mui/icons-material/AddCircle";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Check from "@mui/icons-material/Check";
import HomeIcon from "@mui/icons-material/Home";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SearchIcon from "@mui/icons-material/Search";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
// import { LoadingButton } from "@mui/lab";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
} from "@mui/material";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import AadharAuthentication from "../../../../components/streetVendorManagementSystem/components/AadharAuthentication";
import AdditionalDetails from "../../../../components/streetVendorManagementSystem/components/AdditionalDetails";
import AddressOfHawker from "../../../../components/streetVendorManagementSystem/components/AddressOfHawker";
import BasicApplicationDetails from "../../../../components/streetVendorManagementSystem/components/BasicApplicationDetails";
import DocumentsUpload from "../../../../components/streetVendorManagementSystem/components/DocumentsUpload";
import HawkerDetails from "../../../../components/streetVendorManagementSystem/components/HawkerDetails";
import PropertyAndWaterTaxes from "../../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes";
import UploadButton1 from "../../../../components/fileUpload/UploadButton1";
import {
  AadharAuthenticationSchema,
  AddressOfHawkerSchema,
  BasicApplicationDetailsSchema,
  BusinessDetailsSchema,
  DocumentsUploadSchema,
  HawkerDetailsSchema,
  PropertyAndWaterTaxesValidation,
} from "../../../../components/streetVendorManagementSystem/schema/issuanceOfHawkerLicenseSchema";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import {
  DraftSaveAlert,
  Failed,
} from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import DocumentsUploadWithouDeleteButton from "../../../../components/streetVendorManagementSystem/components/DocumentsUploadWithouDeleteButton";
const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    // background: rgb(9,32,121),
    // background: linear-gradient(90deg, rgba(9,32,121,1) 1%, rgba(0,212,255,1) 76%);
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
    // "radial-gradient(circle, rgba(100,255,250,1) 11%, rgba(16,21,145,1) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    // 1: <SettingsIcon />,
    1: <PermIdentityIcon />,
    2: <BabyChangingStationIcon />,
    3: <HomeIcon />,
    4: <BrandingWatermarkIcon />,
    5: <VideoLabelIcon />,
    6: <AddCircleIcon />,
    7: <UploadFileIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

// Get steps - Name
function getSteps(i) {
  return [
    <strong key={1}>{<FormattedLabel id="basicApplicationDetails" key={1} />}</strong>,
    <strong key={2}>{<FormattedLabel id="hawkerDetails" key={2} />}</strong>,
    <strong key={3}>{<FormattedLabel id="addressOfHawker" key={3} />}</strong>,
    <strong key={4}>{<FormattedLabel id="aadharAuthentication" key={4} />}</strong>,
    <strong key={5}>{<FormattedLabel id="PropertyAndWaterTaxes" key={5} />}</strong>,
    <strong key={6}>{<FormattedLabel id="additionalDetails" key={6} />}</strong>,
    <strong key={7}>{<FormattedLabel id="documentsUpload" key={7} />}</strong>,
  ];
}

// Get Step Content Form
function getStepContent(step) {
  if (localStorage.getItem("issuanceOfHawkerLicenseInputState") == "true") {
    switch (step) {
      case 0:
        return <BasicApplicationDetails key={1} />;

      case 1:
        return <HawkerDetails key={2} />;

      case 2:
        return <AddressOfHawker key={3} />;

      case 3:
        return <AadharAuthentication key={4} />;

      case 4:
        return <PropertyAndWaterTaxes key={5} />;

      case 5:
        return <AdditionalDetails key={6} />;

      case 6:
        return <DocumentsUploadWithouDeleteButton key={7} />;

      default:
        return "unknown step";
    }
  } else {
    switch (step) {
      case 0:
        return <BasicApplicationDetails key={1} />;

      case 1:
        return <HawkerDetails key={2} />;

      case 2:
        return <AddressOfHawker key={3} />;

      case 3:
        return <AadharAuthentication key={4} />;

      case 4:
        return <PropertyAndWaterTaxes key={5} />;

      case 5:
        return <AdditionalDetails key={6} />;

      case 6:
        return <DocumentsUpload key={7} />;

      default:
        return "unknown step";
    }
  }
}

// Linear Stepper - sachin
const LinaerStepper = () => {
  const [dataValidation, setDataValidation] = useState(BasicApplicationDetailsSchema);
  const methods = useForm({
    resolver: yupResolver(dataValidation),
  });
  const { register, getValues, setValue, handleSubmit, methos, watch, reset } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadderState, setLoadderState] = useState(false);
  const [draftId, setDraftId] = useState();
  const [userType1, setuserType] = useState(null);
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  let user = useSelector((state) => state.user.user);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [issuanceOfHawkerLicenseInputState, setIssuanceOfHawkerLicenseInputState] = useState(false);

  // formPreview
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Handle Back
  const handleBack = () => {
    setLoading(false);
    setActiveStep(activeStep - 1);
  };

  // Handle Next
  const handleNext = (data) => {
    setLoadderState(true);
    console.log("issuanceOfHawkerLicenseData", data);
    console.log("activeStep", activeStep);
    console.log("steps.length", steps.length);

    console.log("activeStep == steps.length", activeStep == steps.length - 1);

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      setuserType(1);
    } else if (localStorage.getItem("loggedInUser") == "CFC_USER") {
      setuserType(2);
    } else if (localStorage.getItem("loggedInUser") == "DEPT_USER") {
      setuserType(3);
    }

    if (activeStep == steps.length - 1) {
      setLoading(true);
      let loggedInUser = localStorage.getItem("loggedInUser");
      console.log("loggedInUser++", loggedInUser);

      console.log("user.id", user?.id);

      const finalBodyForApi = {
        ...data,
        applicationStatus: "APPLICATION_CREATED",
        pageMode: "APPLICATION_CREATED",
        id: draftId,
        activeFlag: "Y",
        serviceId: 24,
        crCityNameMr: "पिंपरी चिंचवड",
        crStateMr: "महाराष्ट्र",
        serviceName: "Issuance Of Hawker License",
        createdUserId: user?.id,
        userType: userType1,
      };

      axios
        .post(`${urls.HMSURL}/IssuanceofHawkerLicense/saveIssuanceOfHawkerLicense`, finalBodyForApi, {
          headers: {
            role: "CITIZEN",
          },
        })
        .then((res) => {
          console.log("res?.stasdf", res);
          if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
            localStorage.removeItem("applicationRevertedToCititizen");
            localStorage.removeItem("issuanceOfHawkerLicenseId");
            localStorage.removeItem("Draft");
            setLoading(false);
            setLoadderState(false);
            res?.data?.id
              ? sweetAlert("Submitted!", res?.data?.message, "success")
              : sweetAlert("Submitted !", res?.data?.message, "success");
            if (localStorage.getItem("loggedInUser") == "departmentUser") {
              setLoadderState(false);
              router.push(`/streetVendorManagementSystem`);
            } else {
              setLoadderState(false);
              router.push(`/dashboard`);
            }
          } else {
            setLoadderState(false);
            setLoading(false);
            <Failed />;
          }
        })
        .catch((err) => {
          setLoadderState(false);
          setLoading(false);
          <Failed />;
        });
    } else {
      console.log("applicationRevertedToCititizen");
      if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
        setActiveStep(activeStep + 1);
        setLoadderState(false);
        setLoading(false);
      } else {
        setLoading(true);
        let finalBodyForApi;

        if (draftId != null || draftId !== undefined || draftId != NaN) {
          finalBodyForApi = {
            ...data,
            applicationStatus: "DRAFT",
            pageMode: "DRAFT",
            id: draftId,
            serviceId: 24,
            activeFlag: "Y",
            createdUserId: user?.id,
            userType: userType1,
            serviceName: "Issuance Of Hawker License",
          };
        } else {
          finalBodyForApi = {
            ...data,
            applicationStatus: "DRAFT",
            pageMode: "DRAFT",
            serviceId: 24,
            createdUserId: user?.id,
            userType: userType1,
            activeFlag: "Y",
            serviceName: "Issuance Of Hawker License",
          };
        }

        axios
          .post(`${urls.HMSURL}/IssuanceofHawkerLicense/saveIssuanceOfHawkerLicense`, finalBodyForApi, {
            headers: {
              role: "CITIZEN",
            },
          })
          .then((res) => {
            if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
              toast.success("Application Drafted Successfully !!!", {
                autoClose: "1000",
                position: toast.POSITION.TOP_RIGHT,
              });
              // res?.data?.id
              //   ? sweetAlert("Draft!", res?.data?.message, "success")
              //   : sweetAlert("Draft !", res?.data?.message, "success");
              setDraftId(res?.data?.status?.slice(8));
              setLoading(false);
              setLoadderState(false);
              setActiveStep(activeStep + 1);
            } else {
              setLoading(false);
              setLoadderState(false);
              <Failed />;
            }
          })
          .catch((err) => {
            setLoading(false);
            setLoadderState(false);
            <Failed />;
          });
      }
    }
  };

  const getHawkerCertificateData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          reset(r?.data);
          if (localStorage.getItem("issuanceOfHawkerLicenseInputState") == "true") {
            setValue("disabledFieldInputState", true);
          } else {
            setValue("disabledFieldInputState", false);
          }
          setLoadderState(false);
        } else {
          setLoadderState(false);
          <Failed />;
        }
      })
      .catch((errors) => {
        setLoadderState(false);
        <Failed />;
      });
  };

  useEffect(() => {
    setValue("disabledFieldInputState", false);
    if (localStorage.getItem("Draft") == "Draft") {
      if (
        localStorage.getItem("issuanceOfHawkerLicenseId") != null ||
        localStorage.getItem("issuanceOfHawkerLicenseId") != ""
      ) {
        setIssuanceOfHawkerLicenseId(localStorage.getItem("issuanceOfHawkerLicenseId"));
        setDraftId(localStorage.getItem("issuanceOfHawkerLicenseId"));
      }
    } else if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
      if (
        localStorage.getItem("issuanceOfHawkerLicenseId") != null ||
        localStorage.getItem("issuanceOfHawkerLicenseId") != ""
      ) {
        setIssuanceOfHawkerLicenseId(localStorage.getItem("issuanceOfHawkerLicenseId"));
        setDraftId(localStorage.getItem("issuanceOfHawkerLicenseId"));
      }
    }

    if (localStorage.getItem("issuanceOfHawkerLicenseInputState") == "true") {
      setIssuanceOfHawkerLicenseInputState(true);
    } else {
      setIssuanceOfHawkerLicenseInputState(false);
    }
  }, []);

  useEffect(() => {
    console.log("issuanceOfHawkerLicenseId", issuanceOfHawkerLicenseId);
    if (issuanceOfHawkerLicenseId != null || issuanceOfHawkerLicenseId != undefined) {
      getHawkerCertificateData();
    }
  }, [issuanceOfHawkerLicenseId]);

  // useEffect
  useEffect(() => {
    console.log("steps", activeStep);
    if (activeStep == "0") {
      setDataValidation(BasicApplicationDetailsSchema);
    } else if (activeStep == "1") {
      setDataValidation(HawkerDetailsSchema);
    } else if (activeStep == "2") {
      setDataValidation(AddressOfHawkerSchema);
    } else if (activeStep == "3") {
      setDataValidation(AadharAuthenticationSchema);
    } else if (activeStep == "4") {
      setDataValidation(PropertyAndWaterTaxesValidation);
    } else if (activeStep == "5") {
      setDataValidation(BusinessDetailsSchema);
    } else if (activeStep == "6") {
      setDataValidation(DocumentsUploadSchema);
    }
  }, [activeStep]);

  useEffect(() => {
    console.log("draftId", draftId);
  }, [draftId]);

  // loading
  useEffect(() => {}, [loading, loadderState]);

  // View
  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        {/** Provide Custmize theme using themeProvider */}
        <ThemeProvider theme={theme}>
          {loadderState ? (
            <Loader />
          ) : (
            <Paper
              square
              sx={{
                // margin: 5,
                padding: 1,
                // paddingTop: 5,
                paddingTop: 5,
                paddingBottom: 5,
                backgroundColor: "white",
              }}
              elevation={5}
            >
              {/** Main Heading */}
              <marquee>
                <Typography
                  variant="h5"
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    marginTop: "2px",
                  }}
                >
                  <strong>{<FormattedLabel id="streetVendorManagmentSystem" />}</strong>
                </Typography>
              </marquee>
              <br /> <br />
              <br />
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  {/** Steeper icons */}
                  <Stack sx={{ width: "100%" }} spacing={4}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                      {steps.map((label) => {
                        const labelProps = {};
                        const stepProps = {};

                        return (
                          <Step key={label} {...stepProps}>
                            <StepLabel
                              // error={true}
                              {...labelProps}
                              StepIconComponent={ColorlibStepIcon}
                            >
                              {label}
                            </StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Stack>
                </Grid>
              </Grid>
              {/** Main Form */}
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleNext)} sx={{ marginTop: 10 }}>
                  <div id="issuanceOfHawkerLicensePDFContent">{getStepContent(activeStep)}</div>

                  {/** Button */}
                  <Stack direction="row" spacing={5} sx={{ paddingLeft: "30px", align: "center" }}>
                    {/** Back Button */}
                    <Button
                      disabled={activeStep === 0}
                      // disabled
                      onClick={handleBack}
                      variant="contained"
                    >
                      {<FormattedLabel id="back" />}
                    </Button>

                    {/** SaveAndNext Button */}
                    {!localStorage.getItem("issuanceOfHawkerLicenseInputState") && (
                      <>
                        {activeStep != steps.length - 1 && (
                          <Button loading={loading} variant="contained" type="submit">
                            <FormattedLabel id="saveAndNext" />
                          </Button>
                        )}
                      </>
                    )}

                    {localStorage.getItem("issuanceOfHawkerLicenseInputState") && (
                      <>
                        {activeStep != steps.length - 1 && (
                          <Button loading={loading} variant="contained" type="submit">
                            <FormattedLabel id="next" />
                          </Button>
                        )}
                      </>
                    )}

                    {/**  Finish Submit */}
                    <>
                      {activeStep == steps.length - 1 && (
                        <>
                          {/** Form Preview Button */}
                          {!localStorage.getItem("issuanceOfHawkerLicenseInputState") && (
                            <Button
                              onClick={() => {
                                setValue("disabledFieldInputState", true);
                                formPreviewDailogOpen();
                              }}
                              variant="contained"
                              endIcon={<VisibilityIcon />}
                              size="small"
                            >
                              {<FormattedLabel id="viewForm" />}
                            </Button>
                          )}

                          {!localStorage.getItem("issuanceOfHawkerLicenseInputState") && (
                            <LoadingButton
                              size="small"
                              endIcon={<SendIcon />}
                              loading={loading}
                              loadingPosition="end"
                              variant="contained"
                              type="submit"
                            >
                              <span>
                                <FormattedLabel id="finish" />
                              </span>
                            </LoadingButton>
                          )}
                        </>
                      )}
                    </>

                    <div></div>

                    {/** Exit Button */}
                    <Button
                      variant="contained"
                      onClick={() => {
                        localStorage.removeItem("applicationRevertedToCititizen");
                        localStorage.removeItem("issuanceOfHawkerLicenseId");
                        localStorage.removeItem("Draft");
                        if (localStorage.getItem("loggedInUser") == "departmentUser") {
                          router.push(`/streetVendorManagementSystem`);
                        } else {
                          router.push(`/dashboard`);
                        }
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Stack>

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
                          {<FormattedLabel id="viewForm" />}
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
                            onClick={() => {
                              formPreviewDailogClose();
                            }}
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
                      <DocumentsUploadWithouDeleteButton />
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
                        <Button onClick={() => formPreviewDailogClose()}>Exit</Button>
                      </Grid>
                    </DialogTitle>
                  </Dialog>
                </form>
              </FormProvider>
            </Paper>
          )}
        </ThemeProvider>
      </div>
    </>
  );
};

export default LinaerStepper;
