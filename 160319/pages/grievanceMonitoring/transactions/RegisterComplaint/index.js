import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  styled,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import PropTypes from "prop-types";
import urls from "../../../../URLS/urls";
import Form from "../../../../components/grievanceMonitoring/Form";
import GrievanceDetails from "../../../../components/grievanceMonitoring/GrievanceDetails";
import ComplaintDetails from "../../../../components/grievanceMonitoring/ComplaintDetails";
import theme from "../../../../theme";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import SpatialAudioIcon from "@mui/icons-material/SpatialAudio";
import { Check } from "@mui/icons-material";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import { filterDocketAddToLocalStorage } from "../../../../components/redux/features/MunicipalSecretary/municipalSecreLocalStorage";
import {
  getDocumentFromLocalStorage,
  getDocumentFromLocalStorageForSendingTheData,
  removeDocumentToLocalStorage,
} from "../../../../components/redux/features/GrievanceMonitoring/grievanceMonitoring";
import {
  basicInformation,
  userGrievanceDetails,
} from "../../../../containers/schema/grievanceMonitoring/TransactionsSchema's/raiseGrievance";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

//staper
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

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
    1: <AccountCircleIcon />,
    2: <SpatialAudioIcon />,
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
function getSteps() {
  return [
    <strong key={1}>
      <FormattedLabel id="personalDetailss" />
    </strong>,
    <strong key={2}>
      <FormattedLabel id="grievanceDetailss" />
    </strong>,

    // 'Personal Details', 'Grievance Details'
  ];
}

// Get Step Content Form
function getStepContent(step) {
  switch (step) {
    case 0:
      return <Form key={1} />;

    case 1:
      return <GrievanceDetails key={2} />;

    // case 2:
    //   return <ComplaintDetails />

    default:
      return "unknown step";
  }
}

// Linear Stepper
const Index = () => {
  /////////////////////////VALIDATIONS/////////////////////////////////
  const [dataValidation, setDataValidation] = useState(basicInformation);
  /////////////////////////VALIDATIONS/////////////////////////////////

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(dataValidation),
    defaultValues: {
      applicantType: "",
      area: "",
      buildingNo: "",
      category: "",
      city: "",
      complaintDescription: "",
      departmentName: "",
      email: "",
      firstName: "",
      houseNo: "",
      location: "",
      middleName: "",
      pincode: "",
      roadName: "",
      subDepartment: "",
      subject: "",
      surname: "",
      title: "",
      complaintSubTypeId: "",
      complaintTypeId: "",
      eventTypeId: "",
      mediaId: "",
      // mobileNumber: "",
      // gisLocation: "",
      // gisMap: "",
      // mediaId: "",
    },
  });

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();
  const router = useRouter();

  //////////////////////////////////// DIALOG CONTENT ////////////////////////////////////
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  const [yesNo, setYesNo] = useState(false);
  const [settingTheFormData, setSettingTheFormData] = useState(null);
  //////////////////////////////////// DIALOG CONTENT ////////////////////////////////////

  const user = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.userDao?.id);
    return state?.user?.user?.userDao?.id;
  });

  const userCitizen = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.userDao?.id);
    return state?.user?.user?.id;
  });

  const userCFC = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.userDao?.id);
    return state?.user?.user?.id;
  });

  const handelParams = (key) => {
    if (key === "departmentUser") {
      return user;
    } else if (key === "citizenUser") {
      return userCitizen;
    } else if (key === "cfcUser") {
      return userCFC;
    }
  };

  /////////////////////////////////////
  useEffect(() => {
    console.log("steps", activeStep);
    if (activeStep == "0") {
      setDataValidation(basicInformation);
    } else if (activeStep == "1") {
      setDataValidation(userGrievanceDetails);
    }
  }, [activeStep]);
  ////////////////////////////////////

  const logedInUser = localStorage.getItem("loggedInUser");

  const language = useSelector((state) => state?.labels.language);

  // let gettingData = null
  // Handle Next
  const handleNext = (data) => {
    if (activeStep == steps.length - 1) {
      sweetAlert({
        title: "Preview Grievance?",
        text: "Do you want to preview this grievance?",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((willDelete) => {
        if (willDelete) {
          // gettingData = data
          formPreviewDailogOpen();
          setSettingTheFormData(data);
          // alert(settingTheFormData)
          // alert(yesNo)
          // {
          //   yesNo &&
          //     axios
          //       .post(`${urls.GM}/trnRegisterComplaint/save`, {
          //         ...data,
          //         createdBy: handelParams(logedInUser),
          //       })
          //       .then((res) => {
          //         if (res.status == 200 || res.status == 201) {
          //           sweetAlert(
          //             "Saved!",
          //             "Grievance Saved successfully !",
          //             "success"
          //           ).then((will) => {
          //             if (will) {
          //               {
          //                 logedInUser === "departmentUser" &&
          //                   router.push({
          //                     pathname:
          //                       "/grievanceMonitoring/dashboards/deptUserDashboard",
          //                   })
          //               }
          //               {
          //                 logedInUser === "citizenUser" &&
          //                   router.push({
          //                     pathname:
          //                       "/grievanceMonitoring/dashboards/citizenUserDashboard",
          //                   })
          //               }
          //               {
          //                 logedInUser === "cfcUser" &&
          //                   router.push({
          //                     pathname:
          //                       "/grievanceMonitoring/dashboards/cfcUserDashboard",
          //                   })
          //               }
          //             } else {
          //               {
          //                 logedInUser === "departmentUser" &&
          //                   router.push({
          //                     pathname:
          //                       "/grievanceMonitoring/dashboards/deptUserDashboard",
          //                   })
          //               }
          //               {
          //                 logedInUser === "citizenUser" &&
          //                   router.push({
          //                     pathname:
          //                       "/grievanceMonitoring/dashboards/citizenUserDashboard",
          //                   })
          //               }
          //               {
          //                 logedInUser === "cfcUser" &&
          //                   router.push({
          //                     pathname:
          //                       "/grievanceMonitoring/dashboards/cfcUserDashboard",
          //                   })
          //               }
          //             }
          //           })
          //         }
          //       })
          // }
        } else {
          // sweetAlert("OK")
        }
      });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  let readOnlyInput = false;

  // let sendingToFinalSubmit = () => {
  //   getDocumentFromLocalStorage("GrievanceRelatedDocuments")?.map((obj) => {
  //     return [{
  //       applicantKey: obj.applicantKey,
  //       attachedDate: obj.attachedDate,
  //       documentKey: obj.documentKey,
  //       documentType: obj.documentType,
  //     }]
  //   })
  // }

  // console.log(":20", sendingToFinalSubmit())

  let setterFun = () => {
    // alert("setterFun Called")
    // alert("setterFun", JSON.parse(settingTheFormData))
    if (settingTheFormData != null) {
      axios
        .post(`${urls.GM}/trnRegisterComplaint/save`, {
          ...settingTheFormData,
          createdBy: handelParams(logedInUser),
          trnAttacheDocumentDtos: getDocumentFromLocalStorageForSendingTheData("GrievanceRelatedDocuments")
            ? getDocumentFromLocalStorageForSendingTheData("GrievanceRelatedDocuments")
            : "",
        })
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            sweetAlert({
              title: "Saved!",
              text: "Grievance Saved successfully !",
              icon: "success",
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              console.log(":41", res);
              // let strongChar = (res) => {
              //   return `<strong>${res?.data?.grievanceId}</strong>`
              // }
              if (will) {
                sweetAlert({
                  title: "Great!",
                  text: ` Your Grievance Id Is : ${
                    res?.data?.grievanceId !== undefined
                      ? res?.data?.grievanceId
                      : "YOUR GRIEVANCE-ID IS NOT GENERATED!"
                  }`,
                  icon: "success",
                  buttons: ["View Acknowledgement", "Go To Dashboard"],
                  dangerMode: false,
                  closeOnClickOutside: false,
                }).then((will) => {
                  if (will) {
                    {
                      logedInUser === "departmentUser" &&
                        router.push({
                          pathname: "/grievanceMonitoring/dashboards/deptUserDashboard",
                        });
                    }
                    {
                      logedInUser === "citizenUser" &&
                        router.push({
                          pathname: "/grievanceMonitoring/dashboards/citizenUserDashboard",
                        });
                    }
                    {
                      logedInUser === "cfcUser" &&
                        router.push({
                          pathname: "/grievanceMonitoring/dashboards/cfcUserDashboard",
                        });
                    }
                    removeDocumentToLocalStorage("GrievanceRelatedDocuments");
                    setSettingTheFormData(null);
                  } else {
                    router.push({
                      pathname: "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                      query: { id: res?.data?.grievanceId },
                    });
                    removeDocumentToLocalStorage("GrievanceRelatedDocuments");
                    setSettingTheFormData(null);
                  }
                });
              }
            });
          }
        })
        .catch((error) => {
          sweetAlert("Something Went Wrong!");
        });
    } else {
      sweetAlert("settingTheFormData data is null");
    }
  };

  // console.log(data)
  // if (activeStep == steps.length - 1) {
  //   axios
  //     .post(`${urls.GM}/trnRegisterComplaint/save`, {
  //       ...data,
  //       createdBy: user,
  //     })
  //     .then((res) => {
  //       if (res.status == 201) {
  //         sweetAlert("Saved!", "Record Saved successfully !", "success").then(
  //           () => {
  //             router.push({
  //               pathname: "/grievanceMonitoring/dashboard",
  //             })
  //           }
  //         )
  //       }
  //     })
  // } else {
  //   setActiveStep(activeStep + 1)
  // }

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // View
  return (
    <ThemeProvider theme={theme}>
      <Paper
        // sx={{
        //   margin: 5,
        //   padding: 1,
        //   paddingTop: 5,
        //   paddingBottom: 5,
        // }}
        style={{ margin: "30px" }}
      >
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
          style={{ paddingTop: "15px" }}
        >
          {steps.map((step, index) => {
            const labelProps = {};
            const stepProps = {};

            return (
              <Step {...stepProps} key={index}>
                <StepLabel {...labelProps} StepIconComponent={ColorlibStepIcon}>
                  {step}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <Typography variant="h3" align="center">
            Thank You
          </Typography>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}
              <div
                style={{
                  marginTop: 10,
                  paddingBottom: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 90,
                }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  // style={{ marginRight: 30, marginLeft: 10 }}
                  size="small"
                >
                  {language === "en" ? "BACK" : "मागे"}
                </Button>
                <Button variant="contained" color="primary" type="submit" size="small">
                  {activeStep === steps.length - 1
                    ? `${language === "en" ? "SAVE" : "जतन करा"}`
                    : `${language === "en" ? "NEXT" : "पुढे"}`}
                </Button>
              </div>

              {/* ///////////////////////////////////////////////////////////////////// */}
              {/** Dailog */}
              <Dialog fullWidth maxWidth={"lg"} open={formPreviewDailog} onClose={formPreviewDailogClose}>
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      <FormattedLabel id="Previews" />
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
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            formPreviewDailogClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <>
                    {/* <strong>
                      Form :
                    </strong> */}
                    <Form />
                    <GrievanceDetails />
                    {/* <strong>
                    {" "}
                    <FormattedLabel id="documentsUpload" /> :
                  </strong>
                  <DocumentsUpload preview={true} /> */}
                  </>
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
                    <Button
                      variant="contained"
                      onClick={() => {
                        swal({
                          title: "Raise Grievance?",
                          text: "Are you sure you want to raise this grievance?",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                          closeOnClickOutside: false,
                        }).then((will) => {
                          if (will) {
                            // alert("Before Setter Function")
                            setterFun();
                            // readOnlyInput = true
                            // filterDocketAddToLocalStorage("readOnlyInput")

                            // alert(yesNo)
                            formPreviewDailogClose();
                          } else {
                            setSettingTheFormData(null);
                          }
                          // swal("Record is Successfully Exit!", {
                          //   icon: "success",
                          // }).then((will) => {

                          // })
                        });
                      }}
                    >
                      {language === "en" ? "SAVE" : "जतन करा"}
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>
            </form>
          </FormProvider>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default Index;

{
  /* <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 90,
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={submitSortedValues}
                >
                  Submit Data
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={handleCancel}
                >
                  Close Modal
                </Button>
              </div> */
}
