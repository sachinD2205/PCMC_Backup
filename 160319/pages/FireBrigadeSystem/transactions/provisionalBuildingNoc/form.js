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
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import OwnerDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/OwnerDetails";
// import ApplicantDetail from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/ApplicantDetail";
import ApplicantDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/ApplicantDetails";
import OwnerDetail from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/OwnerDetail";

import BuildingDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/BuildingDetails";
import FormsDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/FormsDetails";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
// import OtherDetails from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/OtherDetails";
import Document from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/Document";
// import PropertyTax from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/PropertyTax";
// import DocumentsUpload from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/DocumentsUpload";
import FormSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/FormSchema";
import OwnerSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/OwnerSchema";
import PropertySchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/PropertySchema";
// import ApplicantSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/ApplicantSchema";
import BuildingUseSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/BuildingUseSchema";
// import FormSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/FormSchema";
import OtherDetailSchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/OtherDetailSchema";
import { useSelector } from "react-redux";
// import PropertySchema from "../../../../components/fireBrigadeSystem/provisionalBuildingNoc/PropertySchema";

// Design Stepper

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
    1: <AddCircleIcon />,
    2: <PermIdentityIcon />,
    3: <PermIdentityIcon />,
    4: <HomeIcon />,
    5: <BrandingWatermarkIcon />,
    6: <AddCircleIcon />,
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

// const steps = [
//   "Select campaign settings",
//   "Create an ad group",
//   "Create an ad",
// ];

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

//var schemaStepper;
// Get Step Content Form
function getStepContent(step) {
  switch (step) {
    // case 0:
    //   // schemaStepper = PropertySchema;
    //   return <PropertyTax />;
    case 0:
      // schemaStepper = ApplicantSchema;
      return <ApplicantDetails />;
    // return <ApplicantDetail />;

    case 1:
      // schemaStepper = ApplicantSchema;
      // return <OwnerDetails />;
      // return <ApplicantDetail />;
      return <OwnerDetail />;

    case 2:
      // schemaStepper = FormSchema;
      return <FormsDetails />;

    case 3:
      // schemaStepper = BuildingUseSchema;
      // return <BuildingUse />;
      // return <BuildingUseNew />;
      return <BuildingDetails />;

    case 4:
      // schemaStepper = OtherDetailSchema;
      return <Document />;

    default:
      return "unknown step";
  }
}

// Linear Stepper
const Form = () => {
  const user = useSelector((state) => state.user.user);
  const [dataValidation, setDataValidation] = useState(PropertySchema);
  const [activeStep, setActiveStep] = useState(0);
  // const [nocId, setNocId] = useState();
  // const { reset, setValue, getValues } = useForm({
  //   criteriaMode: "all",
  //   // resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
    defaultValues: { nocId: "" },
    // defaultValues: {
    //   applicantName: "",
    //   applicantMiddleName: "",
    //   applicantLastName: "",
    //   applicationDate: "",
    //   officeContactNo: "",
    //   workingSiteOnsitePersonMobileNo: "",
    //   emailId: "",
    //   appliedFor: "",
    //   architectName: "",
    //   architectFirmName: "",
    //   architectRegistrationNo: "",
    //   applicantPermanentAddress: "",
    //   siteAddress: "",
    //   applicantContactNo: "",
    //   finalPlotNo: "",
    //   revenueSurveyNo: "",
    //   buildingLocation: "",
    //   citySurveyNo: "",
    //   typeOfBuilding: "",
    //   residentialUse: "",
    //   commercialUse: "",
    //   nOCFor: "",
    //   buildingHeightFromGroundFloorInMeter: "",
    //   noOfBasement: "",
    //   totalBuildingFloor: "",
    //   basementAreaInsquareMeter: "",
    //   noOfVentilation: "",
    //   noOfTowers: "",
    //   plotAreaSquareMeter: "",
    //   drawingProvided: "",
    // },
  });

  const { setValue, getValues, register, handleSubmit, watch, reset } = methods;

  useEffect(() => {
    console.log("hello", router.query);
    reset(router.query);
  }, []);

  const [nextButtonInputStatus, setNextButtonInputStatus] = useState(true);

  // Const

  const steps = getSteps();
  // const dispach = useDispatch();

  // Const

  useEffect(() => {
    console.log("steps", activeStep);
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
    console.log("acitiveStep", activeStep);
  }, [activeStep]);

  // Const
  // const [activeStep, setActiveStep] = useState(0);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  // const steps = getSteps();
  // const dispach = useDispatch();
  const [id1, setId] = useState();

  const router = useRouter();

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("router.query", router.query);
      methods.reset(router.query);
    }
  }, [router.isReady]);

  // propertTaxStatus

  useEffect(() => {
    console.log("sdfjdsfsdklfdsl", localStorage.getItem("propertTaxStatus "));
    if (localStorage.getItem("propertTaxStatus ") != "Fail") {
      setNextButtonInputStatus(false);
    } else {
      setNextButtonInputStatus(true);
    }
  }, [localStorage.getItem("propertTaxStatus")]);

  useEffect(() => {
    if (router.query.pageMode === "View" && router.query.applicationId) {
      console.log("THIS IS THE RIGHT FILE");
      axios
        .get(
          `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${router.query.applicationId}`
        )
        .then((res) => {
          localStorage.setItem("pNocId", res?.data?.id);

          setValue("id", res.data.id);
          setValue("nocId", res?.data?.id);
          setValue("ownerDTLDao", res.data.ownerDTLDao);
          setValue("applicantDTLDao", res.data.applicantDTLDao);
          setValue("formDTLDao", res.data.formDTLDao);
          setValue("buildingDTLDao", res.data.buildingDTLDao);
          setValue("attachments", res.data.attachments);
          // setNocId(res?.data?.id);
          // console.log("res345345", res?.data?.id);
          // reset(res.data);
          // setValue("id", res.data.id);
          // setValue("applicantDTLDao", res.data.applicantDTLDao);
          // setValue("sachin", "sachin keke dsfd");
          // console.log("idaala", res.data.id);
          // console.log("getValues->", getValues("id"));
          // console.log("sachin", getValues("sachin"));
          // console.log("kayyyyyyy", res.data.buildingDTLDao);
        });
    }
  }, []);

  // Handle Next
  // if (router?.query?.pageMode != "View") {
  //   const handleNext = (data) => {
  //     console.log("getValues->", getValues("id"));
  //     console.log("ahe ka id *", data.id);
  //     console.log("activeStep", activeStep);
  //     console.log("All Data --------", data);
  //     console.log(`data --------->s ${data}`);

  //     const body = {
  //       ...data,
  //       createdUserId: user.id,
  //       id: getValues("id"),
  //       applicationStatus:
  //         activeStep == steps.length - 1
  //           ? "APPLICATION_CREATED"
  //           : data.applicationStatus,

  //       // isPlanhaveUnderGroundWaterTank:
  //       //   data.isPlanhaveUnderGroundWaterTank == "Yes" ? "Y" : "N",
  //     };

  //     axios
  //       .post(
  //         `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
  //         body
  //       )
  //       .then((res) => {
  //         let appId = res?.data?.status?.split("$")[1];
  //         axios
  //           .get(
  //             `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${appId}`
  //           )
  //           .then((res) => {
  //             localStorage.setItem("pNocId", res?.data?.id);

  //             setValue("id", res.data.id);
  //             setValue("nocId", res?.data?.id);
  //             setValue("ownerDTLDao", res.data.ownerDTLDao);
  //             setValue("applicantDTLDao", res.data.applicantDTLDao);
  //             setValue("formDTLDao", res.data.formDTLDao);
  //             setValue("buildingDTLDao", res.data.buildingDTLDao);
  //             setValue("attachments", res.data.attachments);
  //             // setNocId(res?.data?.id);
  //             // console.log("res345345", res?.data?.id);
  //             // reset(res.data);
  //             // setValue("id", res.data.id);
  //             // setValue("applicantDTLDao", res.data.applicantDTLDao);
  //             // setValue("sachin", "sachin keke dsfd");
  //             // console.log("idaala", res.data.id);
  //             // console.log("getValues->", getValues("id"));
  //             // console.log("sachin", getValues("sachin"));
  //             // console.log("kayyyyyyy", res.data.buildingDTLDao);
  //           });

  //         // setValue(nocId);
  //         // data.id;
  //         // ? sweetAlert("Update!", "Record Updated successfully !", "success")
  //         // : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         // router.push(`/FireBrigadeSystem/transactions/provisionalBuildingNoc/form`);
  //       });
  //     if (activeStep == steps.length - 1) {
  //       router.push("/dashboard");
  //     } else {
  //       setActiveStep(activeStep + 1);
  //     }
  //   };
  // } else {
  //   router.push({
  //     pathname: `/dashboard`,
  //   });
  // }

  //Changes

  const handleNext = (data) => {
    console.log("getValues->", getValues("id"));
    console.log("ahe ka id *", data.id);
    console.log("activeStep", activeStep);
    console.log("All Data --------", data);
    console.log(`data --------->s ${data}`);

    const body = {
      ...data,
      createdUserId: user.id,
      id: getValues("id"),
      applicationStatus:
        activeStep == steps.length - 1
          ? "APPLICATION_CREATED"
          : data.applicationStatus,

      // isPlanhaveUnderGroundWaterTank:
      //   data.isPlanhaveUnderGroundWaterTank == "Yes" ? "Y" : "N",
    };
    if (router?.query?.pageMode != "View") {
      axios
        .post(
          `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
          body
        )

        .then((res) => {
          let appId = res?.data?.status?.split("$")[1];

          axios
            .get(
              `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${appId}`
            )
            .then((res) => {
              localStorage.setItem("pNocId", res?.data?.id);

              setValue("id", res.data.id);
              setValue("nocId", res?.data?.id);
              setValue("ownerDTLDao", res.data.ownerDTLDao);
              setValue("applicantDTLDao", res.data.applicantDTLDao);
              setValue("formDTLDao", res.data.formDTLDao);
              setValue("buildingDTLDao", res.data.buildingDTLDao);
              setValue("attachments", res.data.attachments);
              // setNocId(res?.data?.id);
              // console.log("res345345", res?.data?.id);
              // reset(res.data);
              // setValue("id", res.data.id);
              // setValue("applicantDTLDao", res.data.applicantDTLDao);
              // setValue("sachin", "sachin keke dsfd");
              // console.log("idaala", res.data.id);
              // console.log("getValues->", getValues("id"));
              // console.log("sachin", getValues("sachin"));
              // console.log("kayyyyyyy", res.data.buildingDTLDao);
            });

          // setValue(nocId);
          // data.id;
          // ? sweetAlert("Update!", "Record Updated successfully !", "success")
          // : sweetAlert("Saved!", "Record Saved successfully !", "success");
          // router.push(`/FireBrigadeSystem/transactions/provisionalBuildingNoc/form`);
        });
    }

    // else {
    //   router.push({
    //     pathname: `/dashboard`,
    //   });
    // }
    if (activeStep == steps.length - 1) {
      router.push("/dashboard");
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
    // <>
    //   <BasicLayout>
    //     <Box sx={{ flexGrow: 1 }}>
    //       <AppBar position="static">
    //         <Toolbar variant="dense">
    //           <IconButton
    //             edge="start"
    //             color="inherit"
    //             aria-label="menu"
    //             sx={{ mr: 2 }}
    //           >
    //             <ArrowBackIcon
    //               onClick={() =>
    //                 router.push({
    //                   pathname:
    //                     "/FireBrigadeSystem/transactions/provisionalBuildingNoc",
    //                 })
    //               }
    //             />
    //           </IconButton>
    //           <Typography variant="h6" color="inherit" component="div">
    //             {<FormattedLabel id="addProvisionalBuildingNoc" />}
    //           </Typography>
    //         </Toolbar>
    //       </AppBar>
    //     </Box>
    //     <Paper
    //       sx={{
    //         marginTop: 2,
    //         // margin: 5,
    //         // padding: 1,
    //         marginLeft: 5,
    //         marginRight: 5,
    //         paddingTop: 5,
    //         paddingBottom: 2,
    //         backgroundColor: "#F5F5F5",
    //       }}
    //       elevation={5}
    //     >
    //       {/* <Stepper alternativeLabel activeStep={activeStep}>
    //         {steps.map((step, index) => {
    //           const labelProps = {};
    //           const stepProps = {};

    //           return (
    //             <Step {...stepProps} key={index}>
    //               <StepLabel {...labelProps}>{step}</StepLabel>
    //             </Step>
    //           );
    //         })}
    //       </Stepper> */}
    //       <Stack sx={{ width: "100%" }} spacing={4}>
    //         {/* <Stepper
    //             alternativeLabel
    //             // activeStep={1}
    //             activeStep={activeStep}
    //             connector={<QontoConnector />}
    //           >
    //             {steps.map((label) => {
    //               const labelProps = {};
    //               const stepProps = {};

    //               return (
    //                 <Step key={label} {...stepProps}>
    //                   <StepLabel
    //                     {...labelProps}
    //                     StepIconComponent={QontoStepIcon}
    //                   >
    //                     {label}
    //                   </StepLabel>
    //                 </Step>
    //               );
    //             })}
    //           </Stepper> */}
    //         <Stepper
    //           alternativeLabel
    //           // activeStep={1}
    //           activeStep={activeStep}
    //           connector={<ColorlibConnector />}
    //         >
    //           {steps.map((label) => {
    //             const labelProps = {};
    //             const stepProps = {};

    //             return (
    //               <Step key={label} {...stepProps}>
    //                 <StepLabel
    //                   {...labelProps}
    //                   StepIconComponent={ColorlibStepIcon}
    //                 >
    //                   {label}
    //                 </StepLabel>
    //               </Step>
    //             );
    //           })}
    //         </Stepper>
    //       </Stack>
    //       {/* {activeStep === steps.length ? ( */}
    //       {activeStep === steps.length ? (
    //         <Typography variant="h3" align="center">
    //           <br />
    //           <br />
    //           Thank You
    //         </Typography>
    //       ) : (
    //         <FormProvider {...methods}>
    //           <form onSubmit={methods.handleSubmit(handleNext)}>
    //             {getStepContent(activeStep)}
    //             <div
    //               style={{
    //                 display: "flex",
    //                 justifyContent: "flex-end",
    //                 paddingRight: 12,
    //               }}
    //             >
    //               <Button disabled={activeStep === 0} onClick={handleBack}>
    //                 back
    //               </Button>
    //               <Button
    //                 variant="contained"
    //                 color="primary"
    //                 // onClick={handleNext}
    //                 type="submit"
    //               >
    //                 {activeStep === steps.length - 1 ? "Update" : "Next"}
    //                 {/* {activeStep === steps.length - 1 ? (
    //                   "Submit"
    //                 ) : (
    //                   <FormattedLabel id="next" />
    //                 )} */}
    //               </Button>
    //             </div>
    //           </form>
    //         </FormProvider>
    //       )}
    //     </Paper>
    //   </BasicLayout>
    // </>
    <>
      <Box
        style={{
          margin: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
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
                      pathname:
                        "/FireBrigadeSystem/transactions/provisionalBuildingNoc",
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
                {/* {<FormattedLabel id="addProvisionalBuildingNoc" />} */}
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
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          {/* <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((step, index) => {
            const labelProps = {};
            const stepProps = {};

            return (
              <Step {...stepProps} key={index}>
                <StepLabel {...labelProps}>{step}</StepLabel>
              </Step>
            );
          })}
        </Stepper> */}
          <Stack
            sx={{
              width: "100%",
              paddingBottom: "5%",
            }}
            spacing={4}
          >
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
              // activeStep={1}
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
          {/* {activeStep === steps.length ? ( */}
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
                  <Button
                    variant="contained"
                    disabled={nextButtonInputStatus}
                    color="primary"
                    type="submit"
                  >
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
