import {
  Button,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useDispatch, useSelector } from "react-redux";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import { addIsssuanceofHawkerLicense } from "../../../redux/features/isssuanceofHawkerLicenseSlice";
import BookingDetailGym from "../components/BookingDetailsGym";
import BookingPersonDetailsGym from "../components/BookingPersonDetailsGym";
import EcsDetailsGym from "../components/EcsDetailsGym";
// import GroupsDetails from "../components/GroupsDetails";
import GroupDetailsGym from "../components/GroupDetailsGym";
// import Group from "../components/Group";
import DocumentsUploadGym from "../components/DocumentsUploadGym";
import theme from "../../../../theme.js";
import AadharAuthenticationGym from "../components/AadharAuthenticationGym";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import urls from "../../../../URLS/urls";
import { yupResolver } from "@hookform/resolvers/yup";
import URLS from "../../../../URLS/urls";

import axios from "axios";
import sweetAlert from "sweetalert";
import moment from "moment";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
import { useRouter } from "next/router";
import { Details, GroupAdd } from "@mui/icons-material";

//.....
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import HomeIcon from "@mui/icons-material/Home";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import { setGroup } from "../../../../features/userSlice";
// import { useDispatch } from "react-redux";

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
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
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
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
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
    1: <PermIdentityIcon />,
    2: <GroupAdd />,
    // 3: <HomeIcon />,

    3: <BrandingWatermarkIcon />,

    // 4: <BrandingWatermarkIcon />,
    4: <AccountBalanceIcon />,

    5: <AddCircleIcon />,
    6: <UploadFileIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
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
    // <strong>Booking Details</strong>,
    <strong key={1}>
      <FormattedLabel id="bookingDetails" />
    </strong>,

    // <strong>`${tabName}`</strong>,
    <strong key={2}>
      <FormattedLabel id="personalGroupDetails" />
    </strong>,
    <strong key={3}>
      <FormattedLabel id="aadharAuthenticationDetails" />
    </strong>,
    <strong key={4}>
      <FormattedLabel id="eCSDetails" />
    </strong>,
    <strong key={5}>
      <FormattedLabel id="documentsUpload" />
    </strong>,
  ];
}
function GetStepContent(step) {
  // const [bookingTypeR, setBookingTypeR] = useState(null);
  switch (step) {
    case 0:
      // return <BookingDetails bookingType={setBookingTypeR} />;
      // case 0:
      return <BookingDetailGym />;

    case 1:
      return <BookingPersonDetailsGym />;
    case 2:
      return <AadharAuthenticationGym />;
    case 3:
      return <EcsDetailsGym />;
    case 4:
      return <DocumentsUploadGym />;
    default:
      return "unknown step";
  }
}

// Linear Stepper
const LinaerStepper = () => {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      bookingRegistrationId: "SP00001",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      // venue: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      dateOfBirth: null,
      age: "",
      mobile: "",
      aadharNo: "",
      emailAddress: "",
      currentAddress: "",
      cityName: "",
      // crState: "",
      crPincode: "",
      permanentAddress: "",
      cityName: "",
      // prState: "",
      // prPincode: "",
      aadhaarNo: "",
      bankMaster: "",
      branchName: "",
      bankAccountHolderName: "",
      bankAccountNo: "",
      ifscCode: "",
      bankAddress: "",
    },
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(schema),
  });

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispatch = useDispatch();

  const groups = useSelector((state) => {
    console.log("123", state.user.group);
  });

  // Handle Next
  const handleNext = (data) => {
    // dispatch(setGroup('Hi')); dispatch error setgroup not a function
    console.log("1");
    console.log("Form  Submit Data --->", data);
    //   console.log("Form  Submit Data --->", JSON.stringify(data));

    if (activeStep == steps.length - 1) {
      console.log(data);
      axios
        .post(`${URLS.SPURL}/gymBooking/saveGymBooking`, data, {
          headers: {
            role: "ADMIN",
          },
        })
        .then((res) => {
          if (res.status == 200) {
            // console.log("response from save:" + res.status);
            data.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            router.push(`/dashboard`);
          }
        });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            margin: 5,
            padding: 1,
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: "#FFFFF",
          }}
          elevation={5}
        >
          {/* <Stepper
                alternativeLabel
                activeStep={activeStep}
                style={{
                  backgroundColor: "#F2F3F4",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                {steps.map((step, index) => {
                  const labelProps = {};
                  const stepProps = {};
  
                  return (
                    <Step {...stepProps} key={index}>
                      <StepLabel {...labelProps} key={index}>
                        {step}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper> */}
          <Stack sx={{ width: "100%" }} spacing={4}>
            {/* <Stepper
                  alternativeLabel
                  // activeStep={1}
                  activeStep={activeStep}
                  connector={<QontoConnector />}
                >
                  {steps.map((label) => {
                    const labelProps = {};
                    const stepProps = {};
  
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel
                          {...labelProps}
                          StepIconComponent={QontoStepIcon}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper> */}
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((label) => {
                const labelProps = {};
                const stepProps = {};

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel
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
          {activeStep === steps.length ? (
            <Typography variant="h3" align="center">
              Thank You
            </Typography>
          ) : (
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(handleNext)}
                sx={{ marginTop: 10 }}
              >
                {GetStepContent(activeStep)}
                <Stack direction="row" spacing={2} style={{ marginLeft: 1000 }}>
                  <Button
                    disabled={activeStep === 0}
                    // disabled
                    onClick={handleBack}
                    variant="contained"
                  >
                    back
                  </Button>
                  <Button
                    variant="contained"
                    // disabled={activeStep === steps.length - 1}
                    // color="primary"
                    // onClick={methods.handleSubmit(handleNext)}
                    type="submit"
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                </Stack>
              </form>
            </FormProvider>
          )}
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default LinaerStepper;
