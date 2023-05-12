import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  courtCaseDetailsSchema,
  courtCaseEntryAdvocateDetailsSchema,
} from "../../../../containers/schema/LegalCaseSchema/courtCaseEntrySchema";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import AdvocateDetails from "./AdvocateDetails";
import CaseDetails from "./CaseDetails";
import Documents from "./Documents";
import BillDetails from "./BillDetails";

// steps
function getSteps(pageMode) {
  console.log("newPageMode", pageMode);
  if (pageMode == "Add") {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="concernAdvocate" />,
      <FormattedLabel key={3} id="document" />,
    ];
  } else if ("View") {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="concernAdvocate" />,
      <FormattedLabel key={3} id="document" />,
      <FormattedLabel key={4} id="paymentDetails" />,
    ];
  } else {
    return [
      <FormattedLabel key={1} id="caseDetails" />,
      <FormattedLabel key={2} id="concernAdvocate" />,
      <FormattedLabel key={3} id="document" />,
      // <FormattedLabel key={4} id='caseFees' />,
      <FormattedLabel key={4} id="paymentDetails" />,
      // <FormattedLabel key={2} id='advocateDetails' />,
    ];
  }
}

// getStepContent
function getStepContent(step, pageMode, buttonInputStateNew) {
  console.log("6565", step, pageMode, buttonInputStateNew);
  if (pageMode == "Add") {
    if (step == "0") {
      return <CaseDetails />;
    } else if (step == "1") {
      return <AdvocateDetails />;
    } else if (step == "2") {
      console.log("yeda aahe ka ", buttonInputStateNew);
      return <Documents buttonInputStateNew={buttonInputStateNew} />;
    }
  } else if ("View") {
    if (step == "0") {
      return <CaseDetails />;
    } else if (step == "1") {
      return <AdvocateDetails />;
    } else if (step == "2") {
      return <Documents buttonInputStateNew={buttonInputStateNew} />;
    } else if (step == "3") {
      return <BillDetails />;
    }
  } else {
    if (step == "0") {
      return <CaseDetails />;
    } else if (step == "1") {
      return <AdvocateDetails />;
    } else if (step == "2") {
      return <Documents buttonInputStateNew={buttonInputStateNew} />;
    } else if (step == "3") {
      return <BillDetails />;
    }
  }
}

// Main Component
const View = () => {
  const [dataValidation, setDataValidation] = useState(courtCaseDetailsSchema);
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
      // Advocate Details
      advocateName: "",
      opponentAdvocate: "",
      concernPerson: "",
      appearanceDate: null,
      department: "",
      courtName: "",
    },
    mode: "onChange",
    resolver: yupResolver(dataValidation),
    criteriaMode: "all",
  });
  const { register, reset, setValue, getValues, method, watch } = methods;
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [courtCaseNumbers, setcourtCaseNumbers] = useState([]);
  const [newCourtCaseEntry, setNewCourtCaseEntry] = useState();
  const [NewCourtCaseEntryAttachmentList, setNewCourtCaseEntryAttachmentList] = useState([]);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [pageMode, setPageMode] = useState("Add");

  //  courtNames
  const getCourtName = () => {
    axios.get(`${urls.LCMSURL}/master/court/getAll`).then((res) => {
      setCourtNames(
        res.data.court.map((r, i) => ({
          id: r.id,
          // caseMainType: r.caseMainType,
          courtNameEn: r.courtName,
          courtNameMr: r.courtMr,
        })),
      );
    });
  };

  // TableData
  const getAddHearingData = () => {
    axios.get(`${urls.LCMSURL}/trnsaction/addHearing/getAll`).then((res) => {
      setDataSource(
        res.data.addHearing.map((r, i) => ({
          // console.log(i+1),
          srNo: i + 1,
          id: r.id,
          caseEntry: courtCaseNumbers?.find((obj) => obj.id === r.caseStages)?.courtCaseNumber,
          caseEntry1: r.caseStages,
          fillingDate: moment(r.fillingDate).format("YYYY-MM-DD"),
          courtCaseNumber: r.courtCaseNumber,
          courtCaseNumbers: courtCaseNumbers?.find((obj) => obj.id === r.courtCaseNumber)?.courtCaseNumber,
          courtNameMr: courtNames?.find((obj) => obj.id === r.court)?.courtNameMr,
          courtNameEn: courtNames?.find((obj) => obj.id === r.court)?.courtNameEn,
          hearingDate: moment(r.hearingDate).format("YYYY-MM-DD"),
        })),
      );
    });
  };

  // deleteById
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${urls.LCMSURL}/courtCaseEntry/discardcourtCaseEntry/${value}`).then((res) => {
          if (res.status == 226) {
            swal("Record is Successfully Deleted!", {
              icon: "success",
            });
          }
        });
      }
    });
  };

  // columns
  const columns = [
    // old
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    {
      field: "courtNameEn",
      headerName: <FormattedLabel id="courtCaseNumber" />,
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "fillingDate",
      headerName: <FormattedLabel id="fillingDate" />,
      width: 170,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    ,
    {
      field: "hearingDate",
      headerName: <FormattedLabel id="hearingDate" />,
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      width: 650,
      headerAlign: "center",
      align: "center",
      // flex: 5,
      renderCell: (record) => {
        return (
          <>
            <IconButton>
              <Button
                variant="contained"
                endIcon={<VisibilityIcon />}
                onClick={() => actionOnRecord(record.row, "View")}
              >
                view
              </Button>
            </IconButton>
          </>
        );
      },
    },
  ];

  const steps = getSteps(localStorage.getItem("pageMode"));

  // handleNext
  const handleNext = (data) => {
    console.log("Data -------->", data);
    let paidAmountDate = null;
    setNewCourtCaseEntryAttachmentList(JSON.parse(localStorage.getItem("NewCourtCaseEntryAttachmentList")));

    // finalBody
    const finalBody = {
      ...data,
      paidAmountDate,
      NewCourtCaseEntryAttachmentList: JSON.parse(localStorage.getItem("NewCourtCaseEntryAttachmentList")),
    };

    if (activeStep == steps.length - 1) {
      axios.post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/save`, finalBody).then((res) => {
        if (res.status == 200 || res.status == 201) {
          localStorage.removeItem("newCourtCaseEntry");
          localStorage.removeItem("NewCourtCaseEntryAttachmentList");
          localStorage.removeItem("buttonInputStateNew");
          localStorage.removeItem("pageMode");
          localStorage.removeItem("deleteButtonInputState");
          localStorage.removeItem("addButtonInputState");
          localStorage.removeItem("buttonInputState");
          localStorage.removeItem("btnInputStateDemandBill");
          localStorage.removeItem("disabledButtonInputState");
          if (data.id) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
          } else {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
          }
        }
        router.push(`/LegalCase/transaction/newCourtCaseEntry/`);
      });
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // handleBack
  const previousStep = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  useEffect(() => {
    setButtonInputStateNew(localStorage.getItem("buttonInputStateNew"));
    setPageMode(localStorage.getItem("pageMode"));
    setNewCourtCaseEntry(localStorage.getItem("newCourtCaseEntry"));
    setNewCourtCaseEntryAttachmentList(localStorage.getItem("NewCourtCaseEntryAttachmentList"));
    reset(JSON.parse(localStorage.getItem("newCourtCaseEntry")));
    getCourtName();
  }, []);

  useEffect(() => {
    if (activeStep == "0") {
      setDataValidation(courtCaseDetailsSchema);
    } else if (activeStep == "1") {
      setDataValidation(courtCaseEntryAdvocateDetailsSchema);
    }
    // else if (activeStep == "2") {
    //   setDataValidation(demandBillDetailsSchema1);
    // }
  }, [activeStep]);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAddHearingData();
  }, [courtNames]);

  useEffect(() => {
    console.log("pageMode12121", pageMode);
  }, [pageMode]);

  // view
  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
          paddingTop: 3,
          paddingBottom: 5,
        }}
      >
        {/* <marquee> */}
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "8px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            // background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            backgroundColor: "#0084ff",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="newCourtCaseEntry" />
          </h2>
        </Box>
        {/* <h2 style={{ marginBottom: "20Px" }}>
            {" "}
            {<FormattedLabel id='newCourtCaseEntry' />}
          </h2> */}
        {/* </marquee> */}
        <Stepper
          style={{
            marginTop: "50px",
          }}
          alternativeLabel
          activeStep={activeStep}
        >
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
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleNext)}>
                  {getStepContent(activeStep, localStorage.getItem("pageMode"), buttonInputStateNew)}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      ml: "40px",
                      mr: "40px",
                      pt: 2,
                    }}
                  >
                    <Button disabled={activeStep === 0} variant="contained" onClick={() => previousStep()}>
                      <FormattedLabel id="back" />
                    </Button>

                    <Box sx={{ flex: "1 auto" }} />

                    {/** SaveAndNext Button */}
                    <>
                      {activeStep != steps.length - 1 && (
                        <>
                          {localStorage.getItem("pageMode") !== "View" && (
                            <Button variant="contained" type="submit">
                              <FormattedLabel id="saveAndNext" />
                            </Button>
                          )}
                          {localStorage.getItem("pageMode") == "View" && (
                            <Button variant="contained" type="submit">
                              <FormattedLabel id="next" />
                            </Button>
                          )}
                        </>
                      )}
                  

                    <Box sx={{ flex: "0.01 auto" }} />

                    {/* Exit Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        localStorage.removeItem("newCourtCaseEntry");
                        localStorage.removeItem("buttonInputStateNew");
                        localStorage.removeItem("pageMode");
                        localStorage.removeItem("deleteButtonInputState");
                        localStorage.removeItem("addButtonInputState");
                        localStorage.removeItem("buttonInputState");
                        localStorage.removeItem("btnInputStateDemandBill");
                        localStorage.removeItem("disabledButtonInputState");
                        localStorage.removeItem("NewCourtCaseEntryAttachmentList");
                        router.push(`/LegalCase/transaction/newCourtCaseEntry/`);
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>


                      </>

                    {/**  Finish Submit */}
                    <>
                      {localStorage.getItem("pageMode") !== "View" && (
                        <>
                          {activeStep == steps.length - 1 && (
                            <Button variant="contained" type="submit">
                              <FormattedLabel id="finish" />
                            </Button>
                          )}
                        </>
                      )}
                    </>
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
