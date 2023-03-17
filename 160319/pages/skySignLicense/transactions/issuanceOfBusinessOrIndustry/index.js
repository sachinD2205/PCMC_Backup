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
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from 'axios'
import { router } from 'next/router'
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

// import "./styles.css";
import ReactDOM from "react-dom";
import urls from "../../../../URLS/urls.js";

// Get steps - Name
function getSteps() {
  return [
    // <FormattedLabel key={1} id="issuanceofLicense" />,
    <FormattedLabel key={1} id="applicantDetails" />,
    <FormattedLabel key={2} id="aadharAuthentication" />,
    <FormattedLabel key={3} id="addressOfLicense" />,
    <FormattedLabel key={4} id="businessInfo" />,
    <FormattedLabel key={5} id="employeeDetaills" />,
    <FormattedLabel key={6} id="partenershipDetail" />,
    // <FormattedLabel id='documentUpload' />,
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
    //   <strong>Business Info </strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> Business And Employee Detaills</strong>
    // </Typography>,
    // <Typography variant='subtitle2' sx={{ marginTop: 2 }}>
    //   <strong> Partenership Detail</strong>
    // </Typography>,
  ];
}

// Get steps - Name
// function getSteps() {
//   return [
//     // "Issuance of  License",
//     "Applicant Details",
//     "Address Of License",
//     "Business Info",
//     "Business And Employee Detaills",
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
      serviceName: "",
      applicationNumber: "",
      applicationDate: null,
      trackingID: "",
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
      disbality: "",
      typeOfDisability: "",
      mobile: "",
      emailAddress: "",
      crWaterConsumerNo: "",
      crPropertyTaxNumber: "",
      crCitySurveyNumber: "",
      crAreaName: "",
      crLandmarkName: "",
      crVillageName: "",
      crCityName: "",
      crState: "",
      crPincode: "",
      crLattitude: "",
      addressCheckBox: "",
      prCitySurveyNumber: "",
      prAreaName: "",
      prLandmarkName: "",
      prVillageName: "",
      prCityName: "",
      prState: "",
      prPincode: "",
      prLattitude: "",
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
    },
  });

  // Const
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();
  const language = useSelector((state) => state?.labels?.language)

  // Handle Next
  // const handleNext = (data) => {
  //   dispach(addIsssuanceofLicenseSlice(data));
  //   console.log(data);
  //   if (activeStep == steps.length - 1) {
  //     fetch("https://jsonplaceholder.typicode.com/comments")
  //       .then((data) => data.json())
  //       .then((res) => {
  //         console.log(res);
  //         setActiveStep(activeStep + 1);
  //       });
  //   } else {
  //     setActiveStep(activeStep + 1);
  //   }
  // };

  const handleNext = (data) => {
    console.log('All Data --------', activeStep)
    const finalBody = {
      ...data,
      // createdUserId: user?.id,
      serviceId: 7,
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

  // View
  return (
    <>
      {/* <BasicLayout> */}
      <ThemeProvider theme={theme}>
        <Paper
          // component={Box}
          sx={{
            marginLeft: 2,
            marginRight: 2,
            marginTop: 1,
            marginBottom: 2,
            padding: 1,

            backgroundColor: '#F5F5F5',
            // border: 1,
          }}
          elevation={5}
        // square

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
                  sx={{ marginTop: 7 }}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="contained"
                  color="primary"
                  style={{ marginRight: 30, marginLeft: 10 }}
                >
                  {<FormattedLabel id="back"></FormattedLabel>}
                </Button>
                <Button
                  sx={{ marginTop: 7 }}
                  variant="contained"
                  color="primary"
                  // onClick={handleNext}
                  type="submit"
                >
                  {/* {activeStep === steps.length - 1 ? (
                    <FormattedLabel id="finish" />
                  ) : (
                    <FormattedLabel id="saveAndNext" />
                  )}{" "} */}
                  {activeStep === steps.length - 1
                    ? language != 'en'
                      ? 'जतन करा'
                      : 'submit'
                    : language == 'mr'
                      ? 'पुढे'
                      : 'next'}
                </Button>
              </form>
            </FormProvider>
          )}
        </Paper>
      </ThemeProvider>
      {/* </BasicLayout> */}
    </>
  );
};

export default LinaerStepper;
