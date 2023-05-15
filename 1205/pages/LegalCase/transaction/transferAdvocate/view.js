import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Row, Col, Table, Form, Input, Collapse } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography

} from "@mui/material";
import Stack from "@mui/material/Stack";
// import { Collapse } from "@mui/material";
import { useRouter } from "next/router";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import CaseDetails from "./CaseDetails";
import TransferDetails from "./TransferDetails";
import Document from "./Document"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import urls from "../../../../URLS/urls";


import  {
  caseDetailsSchema,
  transferDetailsSchema

  // demandBillBankDetailsSchema,
  // demandBillAdvocateDetailsSchema,
  // demandBillDetailsSchema1,
} from "../../../../containers/schema/LegalCaseSchema/transferAdvocateSchema";

// import Document from "./next/document";

const View = () => {
   
  const [dataValidation, setDataValidation] = useState(
    // transferDetailsSchema
    caseDetailsSchema,
    // transferDetailsSchema
  );

  const { Panel } = Collapse;
  const router = useRouter();
  const [selectNewDate, setSelectNewDate] = React.useState(null);
  const [filingDate, setFilingDate] = React.useState(null);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);

  const [activeStep, setActiveStep] = useState(0)





  function getSteps() {
    return [
      <FormattedLabel key={1} id='caseDetails' />,
      <FormattedLabel key={2} id='transferDetails' />,  
      <FormattedLabel key={3} id='document' />,
  
    ]
  }

  const steps = getSteps()
  const methods = useForm({
    defaultValues: {
      courtCaseNumber:"",
      caseType:"",
      court:"",
      filingDate:"",
      filedBy:"",
      filedByMr:"",
      transferFromAdvocate:"",
      transferToAdvocate:"",
      fromDate:"",
      toDate:"",
      newAppearnceDate:"",
      remark:""
        },
    mode:"onChange",

    resolver:yupResolver(dataValidation),
    criteriaMode:'all'
  })

  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1)
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <CaseDetails />
  
      case 1:
        return <TransferDetails />
  
      case 2:
        return <Document/>

    }
  }



  const handleNext = (data) => {
    
    console.log("data",JSON.stringify(data));
  console.log("handleNext",activeStep);
    const finalBody={
      ...data
    }
    if (activeStep == steps.length - 1) {
      // alert("Hei")
    axios.post(`${urls.LCMSURL}/trnsaction/transferAdvocate/save`,data
    ).then((res) => {
      if (res.status == 200) {
        swal("Submited!", "Record Submited successfully !", "success");
      }
      router.push(
        `/LegalCase/transaction/transferAdvocate/`,
      );
    })
    } else {
      setActiveStep(activeStep + 1);
    }
  }


   
  // For Validation

  useEffect(() => {
    console.log('steps', activeStep)
    if (activeStep == '0') {
      setDataValidation(caseDetailsSchema)
    } 
    else if (activeStep == '1') {
      setDataValidation(transferDetailsSchema)
    } 
    
  }, [activeStep])


  

  
  useEffect(() => {
    if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
      console.log("Data------", router.query);
      // methods.setValue("fillingDate",router.query.fillingDate)  ;
      methods.reset(router.query);
    }
  }, []);



   

  
  return (
    <>
      

        <Paper
          sx={{
            // marginLeft: 5,
            // marginRight: 5,
            // justifyContent:"center",
            // alignContent:"center",
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <Stepper
          alternativeLabel activeStep={activeStep}
          >
             {steps.map((step, index) => {
              const labelProps = {}
              const stepProps = {}

              return (
                <Step {...stepProps} key={index}>
                  <StepLabel {...labelProps}>{step}</StepLabel>
                </Step>
              )
            })}

          </Stepper>

          {activeStep === steps.length ? (
            <Typography variant='h3' align='center'>
              Thank You
            </Typography>
          ) : (
            <>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleNext)}>
                  {getStepContent(activeStep)}
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button variant='outlined' onClick={() => previousStep()}>
                      <FormattedLabel id='back' />
                    </Button>
                    <Box sx={{ flex: '1 auto' }} />
                    <Button
                      variant='contained'
                      color='primary'
                      // onClick={"./LegalCase/master/advocate"}
                      onClick={() =>
                        router.push(`/LegalCase/transaction/transferAdvocate/`)
                      }
                    >
                      <FormattedLabel id='exit' />
                    </Button>
                    <Box sx={{ flex: '0.01 auto' }} />

                    <Button
                      variant='contained'
                      color='primary'
                      type="submit"
                    >
                      {activeStep === steps.length - 1 ? (
                        <FormattedLabel id='finish' />
                      ) : (
                        <FormattedLabel id='saveAndNext' />
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
