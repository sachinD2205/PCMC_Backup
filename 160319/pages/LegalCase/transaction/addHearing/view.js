import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import {
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Box,
} from "@mui/material";

import { useRouter } from "next/router";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import { Alert } from "antd";
import HearingDetails from "./HearingDetails";
import DocumentsUpload from "./DocumentsUpload";
import { MultilineChart } from "@mui/icons-material";
import urls from "../../../../URLS/urls";

import  {
  addHearingSchema,
  schema
} from "../../../../containers/schema/LegalCaseSchema/addHearingSchema";
import { yupResolver } from "@hookform/resolvers/yup";

const View = () => {
  const router = useRouter();
  const [dataValidation, setDataValidation] = useState(
    schema
  );
 

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(addHearingSchema),
    defaultValues: {
    },
  });

  const { register,
    control,
   watch,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors }}= methods;

    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

  function getSteps() {
    return [
      <FormattedLabel key={1} id="addHearing" />,
      <FormattedLabel key={2} id="document" />,
    ];
  }

  function getStepContent(step) {
    console.log("activeStep", step);
    switch (step) {
      case 0:
        return <HearingDetails />;
      case 1:
        return <DocumentsUpload />;
    }
  }

  const handleNext = (data) => {
    console.log("handleNext", data);
    
    const finalBody = {
      ...data,
      caseEntry: router.query.courtCaseNumber,
    };
    if (activeStep == steps.length - 1) {
      axios
        .post(
          `${urls.LCMSURL}/trnsaction/addHearing/save`,
          finalBody
        )
        .then((res) => {
          if (res.status == 200) {
            swal("Submited!", "Record Submited successfully !", "success");
          }
          router.push(`/LegalCase/transaction/addHearing/`);
        });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle Back
  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  const nextStep = () => {
    setActiveStep((activeStep) => activeStep + 1);
  };



  useEffect(() => {
    console.log("dataaaa",router.query);
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "View" ||
      router.query.pageMode == "addHearing"
    ) {
      const data = {
        ...router.query,id:null
      };
      methods.reset(data);
      methods.setValue("caseMainType", router.query.caseMainType),
        methods.setValue("filingDate", router.query.filingDate),
        methods.setValue("courtCaseNumber", router.query.courtCaseNumber);
        methods.setValue("caseStatus", router.query.caseStatus)
        
      }
    }, []);
   

  // For Validation
  useEffect(() => {
    console.log('activeStep', activeStep)
    if (activeStep == '0') {
      setDataValidation(addHearingSchema)
    } else{

    }
    // else 
    // if (activeStep == '1') {
    //   setDataValidation(bankDetailsSchema)
    // } 
    
  }, [activeStep])



  useEffect(()=> {
    console.log("query123",router.query)
   },[router.query])
 

  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
          paddingTop: 5,
          paddingBottom: 5,
        }}
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
          <>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {getStepContent(activeStep)}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button disabled={activeStep==0} variant="outlined" onClick={() => previousStep()}>
                    <FormattedLabel id="back" />
                  </Button>
                  <Box sx={{ flex: "1 auto" }} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      router.push(`/LegalCase/transaction/addHearing/`)
                    }
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                  <Box sx={{ flex: "0.01 auto" }} />

                  <Button variant="contained" color="primary" type="submit">
                    {activeStep === steps.length - 1 ? (
                      <FormattedLabel id="finish" />
                    ) : (
                      <FormattedLabel id="saveAndNext" />
                    )}
                  </Button>
                </Box>
              </form>
            </FormProvider>
          </>
        )}
      </Paper>
    </>
  );
};

export default View;
