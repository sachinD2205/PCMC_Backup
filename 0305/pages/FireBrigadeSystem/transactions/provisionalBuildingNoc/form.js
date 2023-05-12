import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import HomeIcon from "@mui/icons-material/Home";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
} from "@mui/material";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ApplicantDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/ApplicantDetails";
import OwnerDetail from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/OwnerDetail";
import BuildingDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/BuildingDetails";
import FormsDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/FormsDetails";
import Document from "../../../../components/fireBrigadeSystem/provisionalBuildingNocNew/Document";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import FormSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/FormSchema";
import OwnerSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/OwnerSchema";
import PropertySchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/PropertySchema";
import BuildingUseSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/BuildingUseSchema";
import OtherDetailSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/OtherDetailSchema";
import { useSelector } from "react-redux";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";

// QontoConnector
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

// QontoStepIconRoot
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

// QontoStepIcon
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

// QontoStepIcon
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
    1: <AddCircleIcon />,
    2: <PermIdentityIcon />,
    3: <PermIdentityIcon />,
    4: <HomeIcon />,
    5: <BrandingWatermarkIcon />,
    6: <AddCircleIcon />,
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
    // "Proprty Tax",
    "Applicant Details",
    "Owner Details",
    "Form Details",
    "Building Details",
    "Other Details",
  ];
}

// getStepContent
function getStepContent(step) {
  switch (step) {
    case 0:
      return <ApplicantDetails />;

    case 1:
      return <OwnerDetail />;

    case 2:
      return <FormsDetails />;

    case 3:
      return <BuildingDetails />;

    case 4:
      return <Document />;

    default:
      return "unknown step";
  }
}

// mainComponent
const Form = () => {
  const user = useSelector((state) => state.user.user);
  const [dataValidation, setDataValidation] = useState(PropertySchema);
  const [activeStep, setActiveStep] = useState(0);
  // const [provisionalBuildingNocId, setProvisionalBuildingNocId] = useState();
  const steps = getSteps();
  // useForm
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
    defaultValues: { nocId: "" },
  });
  const { setValue, getValues, register, handleSubmit, watch, reset } = methods;
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const router = useRouter();

  // getProvisionalBuildingNocId
  const getProvisionalBuildingNoc = () => {
    alert("id ala re -- bhava id party kadhi mag  ");
    axios
      .get(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${watch(
          "provisionalBuildingNocId",
        )}`,
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("res?.provisionalBuildingNocId :", res?.data);
          setValue("applicantDTLDao", res?.data?.applicantDTLDao);
          setValue("ownerDTLDao", res?.data?.ownerDTLDao);
          setValue("formDTLDao", res?.data?.formDTLDao);
          setValue("buildingDTLDao", res?.data?.buildingDTLDao);
          setValue("attachments", res?.data?.attachments);
        } else {
          <Failed />;
        }
      })
      .catch((error) => {
        console.log("Error", error);
        <Failed />;
      });
  };

  // handleNext
  const handleNext = (data) => {
    console.log("data23432", data);

    // finalBodyForApi
    const finalBodyForApi = {
      id: getValues("provisionalBuildingNocId"),
      // applicantDTLDao
      applicantDTLDao: watch("applicantDTLDao") == undefined ? {} : watch("applicantDTLDao"),
      // ownerDTLDao
      ownerDTLDao: watch("ownerDTLDao") == undefined ? [] : [...watch("ownerDTLDao")],
      // formDTLDao
      formDTLDao: watch("formDTLDao") == undefined ? {} : watch("formDTLDao"),
      // buildingDTLDao
      buildingDTLDao: watch("buildingDTLDao") == undefined ? [] : [...watch("buildingDTLDao")],
      // attachments
      attachments: watch("attachments") == undefined ? [] : [...watch("attachments")],
    };

    console.log("finalBodyForApiProvisionalBuildingNoc", finalBodyForApi);

    axios
      .post(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          // alert("d");
          setValue("provisionalBuildingNocId", res?.data?.status?.split("$")[1]);
          sweetAlert("Saved!", "Record Saved successfully !", "success");
        } else {
          <Failed />;
        }
      })
      .catch((error) => {
        console.log("Error", error);
        <Failed />;
      });

    if (activeStep == steps.length - 1) {
      console.log("provisionalBuildingNoc", data);
      // router.push("/dashboard");
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  //  -------------------------------> useEffect ----------------------------->

  useEffect(() => {
    console.log("acitiveStep", activeStep);
    if (activeStep == "0") {
      setDataValidation(PropertySchema);
    } else if (activeStep == "1") {
      setDataValidation(OwnerSchema);
    } else if (activeStep == "2") {
      setDataValidation(FormSchema);
    } else if (activeStep == "3") {
      setDataValidation(BuildingUseSchema);
    } else if (activeStep == "4") {
      setDataValidation(OtherDetailSchema);
    }
  }, [activeStep]);

  useEffect(() => {
    console.log("provisionalBuildingNocId", watch("provisionalBuildingNocId"));
    if (
      watch("provisionalBuildingNocId") == "" ||
      watch("provisionalBuildingNocId") != undefined ||
      watch("provisionalBuildingNocId") != null
    ) {
      getProvisionalBuildingNoc();
    }
  }, [watch("provisionalBuildingNocId")]);

  // View
  return (
    <>
      <Box
        style={{
          margin: "2%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC ", padding: "2vh" }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname: "/FireBrigadeSystem/transactions/provisionalBuildingNoc",
                    })
                  }
                />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "rgb(7 110 230 / 91%)",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                {btnSaveText == "Update" ? (
                  <FormattedLabel id="updateProvisionalBuildingNoc" />
                ) : (
                  <FormattedLabel id="addProvisionalBuildingNoc" />
                )}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Paper
          square
          sx={{
            // margin: 5,
            padding: 1,
            marginTop: 5,
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: "white",
          }}
          elevation={5}
        >
          <Stack
            sx={{
              width: "100%",
              paddingBottom: "5%",
            }}
            spacing={4}
          >
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
              <br />
              <br />
              <FormattedLabel id="thankYou" />
            </Typography>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {getStepContent(activeStep)}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: 12,
                  }}
                >
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    <FormattedLabel id="back" />
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    {activeStep === steps.length - 1 ? "Submit" : "Save & Next"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Form;
