import {
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  ThemeProvider,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import theme from "../../../../theme.js";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { addIsssuanceofLicenseSlice } from "../../redux/features/isssuanceofLicenseSlice";
import ApplicantDetails from "../components/ApplicantDetails";
import AddressOfLicense from "../components/AddressOfLicense";
import IssuanceOfLicense from "../components/IssuanceOfLicense";
import PartenershipDetail from "../components/PartenershipDetail";
import IndustryAndEmployeeDetaills from "../components/IndustryAndEmployeeDetaills";
import BusinessOrIndustryInfo from "../components/BusinessOrIndustryInfo";
import AadharAuthentication from "../components/AadharAuthentication";
import IndustryDocumentsUpload from "../components/IndustryDocumentsUpload";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import ClearIcon from "@mui/icons-material/Clear";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { router } from "next/router";

import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import HomeIcon from "@mui/icons-material/Home";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import urls from "../../../../URLS/urls";
import axios from "axios";

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
    // 1: <SettingsIcon />,
    1: <PermIdentityIcon />,
    2: <BabyChangingStationIcon />,
    // 3: <VideoLabelIcon />,
    3: <HomeIcon />,
    4: <BrandingWatermarkIcon />,
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
function getSteps() {
  return [
    // <FormattedLabel key={1} id="issuanceofLicense" />,
    <FormattedLabel key={1} id="applicantDetails" />,
    <FormattedLabel key={2} id="aadharAuthentication" />,
    <FormattedLabel key={3} id="addressOfLicense" />,
    <FormattedLabel key={4} id="industryInfo" />,
    <FormattedLabel key={5} id="employeeDetaills" />,
    <FormattedLabel key={6} id="partenershipDetail" />,
    <FormattedLabel key={7} id="documentUpload" />,

    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong>Issuance of  License</strong>
    // </Typography>,

    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong>Applicant Details</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> Aadhar Authentication</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong>Address Of License</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong>Industry Info </strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> Employee Detaills</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> Partenership Detail</strong>
    // </Typography>,
    //    <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //    <strong>Document Upload</strong>
    //  </Typography>,
  ];
}

// // Get steps - Name
// function getSteps() {
//   return [
//     // "Issuance of  License",
//     "Applicant Details",
//     "Address Of License",
//     "Industry Info",
//     "Industry And Employee Detaills",
//     "PartenershipDetail"
//   ];
// }

// Get Step Content Form
function getStepContent(step) {
  switch (step) {
    // case 0:
    //   return <IssuanceOfLicense />;

    case 0:
      return <ApplicantDetails />;

    case 1:
      return <AadharAuthentication />;

    case 2:
      return <AddressOfLicense />;

    case 3:
      return <BusinessOrIndustryInfo />;

    case 4:
      return <IndustryAndEmployeeDetaills />;

    case 5:
      return <PartenershipDetail />;

    case 6:
      return <IndustryDocumentsUpload />;

    //   case 5:
    //     return<SkySignRate />

    default:
      return "unknown step";
  }
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <partenershipDetailView />
//       </header>
//     </div>
//   );
// }

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

// Linear Stepper
const LinaerStepper = () => {

  const methods = useForm({
    defaultValues: {
      // "trnApplicantDetailsDao": {
      applicationNumber: "",
      // "SSLM20220001",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),

      serviceName: "",
      // trackingID: "",
      applicantType: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      dateOfBirth: null,
      age: "",
      mobile: "",
      emailAddress: "",
      panNo: "",
      registrationNo: "",
      gstNo: "",
      tanNo: "",
      aadhaarNo: "",
      crPropertyTaxNumber: "",
      proprtyAmount: "",
      crWaterConsumerNo: "",
      waterAmount: "",
      crCitySurveyNumber: "",
      crAreaName: "",
      crLandmarkName: "",
      crVillageName: "",
      crCityName: "",
      crState: "",
      crPincode: "",
      crLattitude: "",
      crLongitud: "",
      addressCheckBox: "",
      prCitySurveyNumber: "",
      prAreaName: "",
      prLandmarkName: "",
      prVillageName: "",
      prCityName: "",
      prState: "",
      prPincode: "",
      prLattitude: "",
      prLongitud: "",
      // },
      "trnIndustryBussinessDetailsDao": {
        nameOfOrganization: "",
        propertyNo: "",
        propertyStatus: "",
        ownership: "",
        totalAreaFt: "",
        totalAreaM: "",
        zone: "",
        licenseType: "",
        industryType: "",
        businessType: "",
        businessSubType: "",
        constructionType: "",
        constructionAreaFt: "",
        constructionAreaM: "",
        machineCount: "",
        businessLocationTotalCountOfMachineries: "",
        workingHours: "",
        industryDate: null,
        temporarylicDate: null,
        citysurveyno: "",
        numbertype: "",
        blockno: "",
        sectorno: "",
        surveyno: "",
        citySurveyNo: "",
        plotNo: "",
        roadName: "",
        villageName: "",
        prCityName1: "",
        prState1: "",
        Pincode: "",
        officeStaff: "",
        permanentEmployees: "",
        temporaryEmployees: "",
        contractualEmployees: "",
        totalEmployees: "",
        fireEquirepment: "",
        firstAidKit: "",
        toilets: "",
        storageofrawmaterial: "",
        disposalSystemOfWaste: "",
        nuisanceOfResidents: "",
        ObjectionCertificate: "",
        separatebusiness: "",
      },
      pttitle: "",
      ptfname: "",
      ptmname: "",
      ptlname: "",
      ptgender: "",
      ptdateofBirth: null,
      ptmobile: "",
      ptemail: "",
      ptPropertyTaxNumber: "",
      ptroadNmae: "",
      ptvillage: "",
      ptcity: "",
      ptpincode: "",
      "trnLicenseDao": {
      }
    },
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  const { getValues, setValue, register,
    reset,

  } = methods

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const [id, setID] = useState();
  const steps = getSteps();
  const dispach = useDispatch();
  const language = useSelector((state) => state?.labels.language);


  // Reset Values Cancell
  const resetValuesCancell = {
    applicationNumber: "",

    applicationDate: moment(Date.now()).format("YYYY-MM-DD"),

    serviceName: "",

    applicantType: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    age: "",
    mobile: "",
    emailAddress: "",
    panNo: "",
    registrationNo: "",
    gstNo: "",
    tanNo: "",
    aadhaarNo: "",
    crPropertyTaxNumber: "",
    proprtyAmount: "",
    crWaterConsumerNo: "",
    waterAmount: "",
    crCitySurveyNumber: "",
    crAreaName: "",
    crLandmarkName: "",
    crVillageName: "",
    crCityName: "Pimpri Chinchwad",
    crState: "Maharashtra",
    crPincode: "",
    crLattitude: "",
    crLongitud: "",
    addressCheckBox: "",
    prCitySurveyNumber: "",
    prAreaName: "",
    prLandmarkName: "",
    prVillageName: "",
    prCityName: "Pimpri Chinchwad",
    prState: "Maharashtra",
    prPincode: "",
    prLattitude: "",
    prLongitud: "",

  };
  //  cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // useEffect
  // useEffect(() => {
  //   getApplication();
  // }, []);

  // const getApplication = () => {
  //   axios
  //     .get(`${urls.SSLM}/Trn/ApplicantDetails/getApplicationNo`)
  //     .then((res) => {
  //       setValue("applicationNumber", res.data);
  //     });
  // };


  // Handle Next
  const handleNext = (data) => {
    console.log('All Data --------', activeStep)
    const finalBody = {
      ...data,
      // createdUserId: user?.id,
      serviceId: 8,
    }
    // console.log('attachements All Data --------', attachments)

    dispach(addIsssuanceofLicenseSlice(data))

    if (activeStep == steps.length - 1) {
      console.log('data123', data)

      // if (router?.query?.pageMode != 'View') {
      axios
        .post(
          `${urls.SSLM}/Trn/ApplicantDetails/saveTrnApplicantDetails`,
          finalBody,
        )
        .then((res) => {
          console.log("resp123", res)
          if (res.status == 201) {
            swal('Submited!', 'Record Submited successfully !', 'success')
            console.log('resp data', res.data)
            router.push({
              pathname: `/dashboard`,
            })
            // router.push({
            //   pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
            //   query: {
            //     id: res?.data?.message?.split('$')[1],
            //     serviceId: 10,
            //     // ...res.data[0]
            //   },
            // })

          }
        })
      // } else {
      //   router.push({
      //     pathname: `/dashboard`,
      //   })
      // }
    } else {
      setActiveStep(activeStep + 1)
    }
    // }
  }

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // preview

  const handlePreView = () => {
    setActiveStep(activeStep - 6);

  };
  // View
  return (
    <Box>
      {/* <BasicLayout> */}
      <ThemeProvider theme={theme}>
        <Paper
          component={Box}
          sx={{
            marginLeft: '10px',
            marginRight: '10px',
            padding: 1,
          }}
          square
          elevation={5}
        // sx={{
        //   margin: 5,
        //   padding: 1,
        //   paddingTop: 5,
        //   paddingBottom: 5,
        // }}
        >
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {};
              const stepProps = {};

              return (
                <Step {...stepProps} key={index}>
                  <StepLabel {...labelProps}>{step}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <Box>
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
                  {getStepContent(activeStep)}

                  <Button
                    sx={{ marginRight: 8 }}
                    disabled={activeStep === 0} onClick={handleBack}>

                    {<FormattedLabel id="back"></FormattedLabel>}
                  </Button>

                  {activeStep == steps.length - 1 ? (
                    <Button
                      sx={{ marginRight: 8 }}
                      variant='contained'
                      color='primary'
                      endIcon={<ClearIcon />}
                      // disabled={activeStep === 7}
                      onClick={() => cancellButton()}
                    >
                      {<FormattedLabel id="clear"></FormattedLabel>}
                    </Button>
                  ) : ""}


                  {/* <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 8 }}
                    // onClick={handleNext}
                    // type="submit"
                    disabled={activeStep === 6}
                  
                    onClick={handlePreView}
                    
                  > */}
                  {/* {activeStep === steps.length - 1 ? "Preview" : ""} */}
                  {activeStep == steps.length - 1 ? (
                    <Button variant='contained'
                      onClick={handlePreView}
                      sx={{ marginRight: 8 }}
                    >
                      {/* <FormattedLabel id='submit' /> */}
                      Preview
                    </Button>
                  ) : ""}

                  {/* </Button>{" "} */}
                  {/* <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 8 }}
                    // onClick={handleNext}
                    type="submit"
                  > */}
                  {/* {activeStep === steps.length - 1 ? "submit" : "saveAndNext"} */}
                  {/* {activeStep === steps.length - 1  ? <FormattedLabel id="submit" /> : <FormattedLabel id="saveAndNext" />} */}

                  {/** SaveAndNext Button */}
                  <Button
                    sx={{ marginRight: 7 }}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    {activeStep === steps.length - 1
                      ? language != 'en'
                        ? 'जतन करा'
                        : 'submit'
                      : language == 'mr'
                        ? 'पुढे'
                        : 'next'}
                  </Button>


                  {/* </Button>{" "} */}

                  {/* <div></div> */}
                  {/** Exit Button */}
                  <Button
                    sx={{ marginRight: 8 }}
                    variant='contained'
                    onClick={() => {
                      if (
                        localStorage.getItem("loggedInUser") == "departmentUser"
                      ) {
                        router.push(`/skySignLicense`);
                      } else {
                        router.push(`/dashboard`);
                      }
                    }}
                  >
                    <FormattedLabel id='exit' />
                  </Button>

                </form>
              </FormProvider>
            )}
          </Box>
        </Paper>
      </ThemeProvider>
      {/* </BasicLayout> */}
    </Box>
  );
};

export default LinaerStepper;
