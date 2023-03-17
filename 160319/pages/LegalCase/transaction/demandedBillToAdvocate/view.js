import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  demandBillAdvocateDetailsSchema,
  demandBillBankDetailsSchema,
  demandBillDetailsSchema1,
} from "../../../../containers/schema/LegalCaseSchema/demandedBillToAdvocateSchema";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import AdvocateDetails from "./AdvocateDetails";
import BankDetails from "./BankDetails";
import BillDetails from "./BillDetails";
import Document from "./Document";

// Get Steps
function getSteps() {
  return [
    <FormattedLabel key={1} id='advocateDetails' />,
    <FormattedLabel key={2} id='bankDetails' />,
    <FormattedLabel key={3} id='billDetails' />,
    <FormattedLabel key={4} id='document' />,
  ];
}

// Setep Content
function getStepContent(step, pageMode, buttonInputStateNew) {
  switch (step) {
    case 0:
      return <AdvocateDetails />;

    case 1:
      return <BankDetails />;

    case 2:
      return <BillDetails />;

    case 3:
      return <Document buttonInputStateNew={buttonInputStateNew} />;
  }
}

// Main Component - View
const View = () => {
  const [dataValidation, setDataValidation] = useState(
    demandBillAdvocateDetailsSchema,
  );
  const methods = useForm({
    defaultValues: {
      courtName: "",
      caseMainType: "",
      subType: "",
      year: "",
      stampNo: "",
      fillingDate: null,
      filedBy: "",
      filedAgainst: "",
      caseDetails: "",
      advocateName: "",
      opponentAdvocate: "",
      concernPerson: "",
      appearanceDate: null,
      department: "",
      courtName: "",
    },
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
  });
  const { setValue, getValues, reset, register, handleSubmit, watch } = methods;
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [courtCaseNumbers, setcourtCaseNumbers] = useState([]);
  const steps = getSteps();
  const user = useSelector((state) => state.user.user.userDao);
  const language = useSelector((state) => state.labels.language);
  const [billDetail, setBillDetail] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [advocateId, setAdvocateId] = useState();
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [pageMode, setPageMode] = useState("Add");
  const [authority, setAuthority] = useState();
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const user1 = useSelector((state) => state?.user?.user);

  // handleNext
  const handleNext = (data) => {
    setBillDetail(JSON.parse(localStorage.getItem("billDetail")));
    setAttachments(JSON.parse(localStorage.getItem("attachments")));

    if (activeStep == steps.length - 1) {
      // advocateDetails
      let advocate = {
        advocateName: getValues("advocateName"),
        city: getValues("city"),
        area: getValues("area"),
        roadName: getValues("roadName"),
        landmark: getValues("landmark"),
        pinCode: getValues("pinCode"),
        mobileNo: getValues("mobileNo"),
        emailAddress: getValues("emailAddress"),
        bankName: getValues("bankName"),
        accountNo: getValues("accountNo"),
        bankIFSCCode: getValues("bankIFSCCode"),
        bankMICRCode: getValues("bankMICRCode"),
      };

      // finalBody
      const finalBody = {
        ...data,
        id: null,
        role: "BILL_RAISED",
        billDetail,
        attachments: JSON.parse(localStorage.getItem("attachments")),
        advocate,
        advocateName: getValues("advocateName"),
        advocateId: advocateId,
      };

      axios
        .post(
          `${urls.LCMSURL}/transaction/demandedBillAndPaymentToAdvocate/save`,
          finalBody,
        )
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
            localStorage.removeItem("attachments");
            localStorage.removeItem("billDetail");
            localStorage.removeItem("buttonInputState");
            localStorage.removeItem("tableRowData");
            localStorage.removeItem("role");
            localStorage.removeItem("pageMode");
            localStorage.removeItem("btnInputStateDemandBill");
            localStorage.removeItem("paidAmountInputState");
            localStorage.removeItem("approvalAmountInputState");
            swal("Submited!", "Record Submited successfully !", "success");
            localStorage.removeItem("deleteButtonInputState");

            localStorage.removeItem("paidAmountTableState");
            localStorage.removeItem("demandedBillTableActionButtonInputState");
            localStorage.removeItem("billDetailComponent");
            localStorage.removeItem("approvalAmountTableState");
            router.push(`/LegalCase/dashboard`);
          }
        });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // handleBack
  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  // ---------------------- useEffect -----------

  // useEffect
  useEffect(() => {
    let auth = user1?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("SachinUser", auth);

    localStorage.setItem("approvalAmountInputState", false);
    localStorage.setItem("approvalAmountTableState", true);
    localStorage.setItem("paidAmountInputState", false);
    localStorage.setItem("paidAmountTableState", true);
    localStorage.setItem("demandedBillTableActionButtonInputState", true);
    localStorage.setItem("billDetailComponent", true);
    localStorage.setItem("billDetail", JSON.stringify([]));
    localStorage.setItem("deleteButtonInputState", true);
    localStorage.removeItem("role");

    // user
    if (user)
      axios
        .get(
          `${urls.LCMSURL}/master/advocate/getById?advocateId=${user?.advocateId}`,
        )
        .then((res) => {
          let response = res.data;
          console.log("res.data", res.data);
          reset(response);
          setAdvocateId(response?.id);
          setValue(
            "advocateName",
            language === "en"
              ? response.firstName +
                  " " +
                  response.middleName +
                  " " +
                  response.lastName
              : response.firstNameMr +
                  " " +
                  response.middleNameMr +
                  " " +
                  response.lastNameMr,
            setValue("shrink", true),
          );
        });

    setValue("disabledDemandedBillInputState", false);
  }, []);

  useEffect(() => {
    if (activeStep == "0") {
      setDataValidation(demandBillAdvocateDetailsSchema);
    } else if (activeStep == "1") {
      setDataValidation(demandBillBankDetailsSchema);
    } else if (activeStep == "2") {
      setDataValidation(demandBillDetailsSchema1);
    }
  }, [activeStep]);

  useEffect(() => {}, [methods]);

  useEffect(() => {
    localStorage.setItem("pageMode", pageMode);
  }, [pageMode]);

  useEffect(() => {}, [buttonInputStateNew]);

  useEffect(() => {
    if (router?.query?.pageMode == "Add") {
      setPageMode("Add");
    } else if (router?.query?.pageMode == "View") {
      setPageMode("View");
    }
  }, [router.isReady]);

  // View
  return (
    <>
      <Paper
        sx={{
          margin: 5,
          padding: 1,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginBottom: 40,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "50px",
            marginRight: "75px",
            borderRadius: 100,
          }}
        >
          <strong style={{ display: "flex", justifyContent: "center" }}>
            Demand Bill To Advocate
          </strong>
        </div>
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
          <Typography variant='h3' align='center'>
            Thank You
          </Typography>
        ) : (
          <>
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleNext)}>
                  {getStepContent(
                    activeStep,
                    router?.query?.pageMode,
                    buttonInputStateNew,
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginRight: "12vh",
                      marginLeft: "12vh",
                      pt: 2,
                    }}
                  >
                    <Button
                      disabled={activeStep === 0}
                      variant='contained'
                      color='primary'
                      onClick={() => previousStep()}
                    >
                      <FormattedLabel id='back' />
                    </Button>
                    <Box sx={{ flex: "1 auto" }} />
                    {/** SaveAndNext Button */}
                    <>
                      {activeStep != steps.length - 1 && (
                        <Button variant='contained' type='submit'>
                          <FormattedLabel id='saveAndNext' />
                        </Button>
                      )}
                    </>

                    {/**  Finish Submit */}
                    <>
                      {activeStep == steps.length - 1 && (
                        <Button variant='contained' type='submit'>
                          <FormattedLabel id='finish' />
                        </Button>
                      )}
                    </>
                    <Box sx={{ flex: "0.01 auto" }} />
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => {
                        localStorage.removeItem("attachments");
                        localStorage.removeItem("billDetail");
                        localStorage.removeItem("buttonInputState");
                        localStorage.removeItem("tableRowData");
                        localStorage.removeItem("role");
                        localStorage.removeItem("pageMode");
                        localStorage.removeItem("btnInputStateDemandBill");
                        localStorage.removeItem("paidAmountInputState");
                        localStorage.removeItem("approvalAmountInputState");
                        localStorage.removeItem("paidAmountInputState");
                        localStorage.removeItem("buttonInputstateNew");
                        localStorage.removeItem("paidAmountTableState");
                        localStorage.removeItem(
                          "approvalAmountTableState",
                          true,
                        );
                        localStorage.removeItem("billDetailComponent");
                        localStorage.removeItem("deleteButtonInputState");

                        localStorage.removeItem(
                          "demandedBillTableActionButtonInputState",
                        );
                        router.push(`/LegalCase/dashboard`);
                      }}
                    >
                      <FormattedLabel id='exit' />
                    </Button>
                  </Box>
                </form>
              </FormProvider>
            </ThemeProvider>
          </>
        )}
      </Paper>
    </>
  );
};

export default View;
