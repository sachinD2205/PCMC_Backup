import { Button, Paper, Stack, Step, StepLabel, Stepper, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import { addIsssuanceofHawkerLicense } from "../../../redux/features/isssuanceofHawkerLicenseSlice";
import BookingDetails from "../components/BookingDetails";
import EcsDetails from "../components/EcsDetails";
import PersonalDetails from "../components/PersonalDetails";
// import GroupsDetails from "../components/GroupsDetails";
import GroupDetails from "../components/GroupDetails";
// import Group from "../components/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import axios from "axios";
import moment from "moment";
import sweetAlert from "sweetalert";
import theme from "../../../../theme.js";
import AadharAuthentication from "../components/AadharAuthentication";
import DocumentsUpload from "../components/DocumentsUpload";
// import schema from "./Schema";
import { GroupAdd } from "@mui/icons-material";
import { useRouter } from "next/router";
import URLS from "../../../../URLS/urls";

//.....
import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Check from "@mui/icons-material/Check";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import {
  AadharAuthenticationSchema,
  BookingDetailSchema,
  documentsUpload,
  EcsDetailsSchema,
  PersonalDetailsSchema,
  PersonalGroupDetailsSchema,
} from "../../../../containers/schema/sportsPortalSchema/sportBookingSchema";

// import DocumentUploadN from '../components/DocumentUploadN';
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
    1: <PermIdentityIcon />,
    2: <GroupAdd />,

    3: <BrandingWatermarkIcon />,

    4: <AccountBalanceIcon />,

    5: <AddCircleIcon />,
    6: <UploadFileIcon />,
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
  const [bookingTypeR, setBookingTypeR] = useState(null);
  switch (step) {
    case 0:
      return <BookingDetails bookingType={setBookingTypeR} />;
    // case 1:
    //   return <PersonalDetails />;

    case 1:
      if (bookingTypeR && bookingTypeR === "Individual") {
        return <PersonalDetails />;
      } else {
        return (
          <>
            <PersonalDetails />
            <GroupDetails />;
          </>
        );
      }
    case 2:
      return <AadharAuthentication />;

    case 3:
      return <EcsDetails />;

    // case 4:
    //   return <DocumentUploadN />;

    case 4:
      return <DocumentsUpload />;

    default:
      return "unknown step";
  }
}

// Linear Stepper
const LinaerStepper = () => {
  const [dataValidation, setDataValidation] = useState(BookingDetailSchema);
  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("22", router.query.fromBookingTime);
  }, []);

  useEffect(() => {
    console.log("steps", activeStep);
    if (activeStep == "0") {
      setDataValidation(BookingDetailSchema);
    } else if (activeStep == "1") {
      setDataValidation(PersonalDetailsSchema);
    } else if (activeStep == "2") {
      setDataValidation(AadharAuthenticationSchema);
    } else if (activeStep == "3") {
      setDataValidation(EcsDetailsSchema);
    } else if (activeStep == "4") {
      setDataValidation(documentsUpload);
    }
  }, [activeStep]);

  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      bookingRegistrationId: "",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      venue: "",
      title: "",
      applicantFirstName: "",
      applicantMiddleName: "",
      applicantLastName: "",
      gender: "",
      dateOfBirth: null,
      age: "",
      mobile: "",
      aadharNo: "",
      emailAddress: "",
      currentAddress: "",
      cityName: "",

      crPincode: "",
      permanentAddress: "",
      cityName: "",

      aadhaarNo: "",
      bankMaster: "",
      branchName: "",
      bankAccountHolderName: "",
      bankAccountNo: "",
      ifscCode: "",
      bankAddress: "",

      sportsBookingGroupDetailsDao: [],
      serviceName: "Sports Booking",
    },
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
  });

  const {
    reset,
    method,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const groups = useSelector((state) => {
    console.log("123", state.user.group);
  });
  let user = useSelector((state) => state.user.user);
  // Handle Next
  const handleNext = (data) => {
    let _body = {
      ...data,
      createdUserId: user?.id,
      serviceId: 29,
      // durationType: "Monthly",
      fromBookingTime: moment(data.fromBookingTime, "HH:mm:ss").format("HH:mm:ss"),

      toBookingTime: moment(data.toBookingTime, "HH:mm:ss").format("HH:mm:ss"),
    };
    console.log("DATA", _body);
    // dispatch(setGroup("Hi"));
    // console.log("1");
    // console.log("Form  Submit Data --->", data);

    if (activeStep == steps.length - 1) {
      axios
        .post(`${URLS.SPURL}/sportsBooking/saveSportsBooking`, _body, {
          headers: {
            role: "ADMIN",
          },
        })
        .then((res) => {
          let ID = Number(res.data.message.split(":")[1]);
          console.log("res.message", ID);
          if (res.status == 200) {
            data.id
              ? sweetAlert("Updated!", "Record Updated successfully !", "success")
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            router.push({
              pathname: "/sportsPortal/transaction/sportBooking/PaymentCollection",
              query: {
                applicationId: ID,
                bookingId: _body.bookingId,
                serviceId: 29,
              },
            });
            // router.push("/sportsPortal/transaction/sportBooking/PaymentCollection");
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
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
              {steps.map((label) => {
                const labelProps = {};
                const stepProps = {};

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps} StepIconComponent={ColorlibStepIcon}>
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
              <form onSubmit={methods.handleSubmit(handleNext)} sx={{ marginTop: 10 }}>
                {GetStepContent(activeStep)}
                {/* <Stack direction="row" spacing={2} style={{ marginLeft: 1000 }}> */}
                <Button
                  sx={{ marginTop: 7 }}
                  disabled={activeStep === 0}
                  // disabled
                  onClick={handleBack}
                  variant="contained"
                  style={{ marginRight: 30, marginLeft: 10 }}
                >
                  back
                </Button>
                <Button variant="contained" type="submit" sx={{ marginTop: 7 }}>
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
                {/* </Stack> */}
              </form>
            </FormProvider>
          )}
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default LinaerStepper;