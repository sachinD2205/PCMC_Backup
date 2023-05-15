import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import AdvocateDetails from "./AdvocateDetails";
import BankDetails from "./BankDetails";
import BillDetails from "./BillDetails";
import Document from "./Document";

// DemandedBIllToAdvocateToCleark
const Scutiny = () => {
  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });
  const { contol, setValue, watch, reset, getValues, register, handleSubmit } =
    methods;
  const router = useRouter();
  const [billDetail, setBillDetail] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [advocateId, setAdvocateId] = useState();
  const user = useSelector((state) => state.user.user.userDao);
  const language = useSelector((state) => state.labels.language);
  const [billDetailComponent, setBillDetailComponent] = useState(true);

  // handleNext
  const handleNext = (data) => {
    setBillDetail(JSON.parse(localStorage.getItem("billDetail")));
    setAttachments(JSON.parse(localStorage.getItem("attachments")));
    let role = localStorage.getItem("role");

    // finalBody
    const finalBody = {
      ...data,
      id: getValues("id1"),
      role: role,
      activeFlag: getValues("activeFlag"),
      billDetail: JSON.parse(localStorage.getItem("billDetail")),
      attachments: JSON.parse(localStorage.getItem("attachments")),
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
          localStorage.removeItem("tableRowData");
          localStorage.removeItem("role");
          localStorage.removeItem("pageMode");
          localStorage.removeItem("btnInputStateDemandBill");
          localStorage.removeItem("paidAmountInputState");
          localStorage.removeItem("approvalAmountInputState");
          localStorage.removeItem("deleteButtonInputState");
          localStorage.removeItem("billDetailComponent");
          localStorage.removeItem("paidAmountTableState");
          localStorage.removeItem("demandedBillTableActionButtonInputState");
          localStorage.removeItem("approvalAmountTableState");
          localStorage.removeItem("approvalAmountDisabledState");
          swal("Submited!", "Record Submited successfully !", "success");
          router.push(
            `/LegalCase/transaction/demandedBillToAdvocate/DemandedBillToAdvocateTable`,
          );
        }
      });
  };

  //  ------------------------- useEffect ---------------

  useEffect(() => {
    if (user)
      axios
        .get(
          `${urls.LCMSURL}/master/advocate/getById?advocateId=${user?.advocateId}`,
        )
        .then((res) => {
          let response = res.data;
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
          );
        });

    setValue("disabledDemandedBillInputState", true);
    console.log("caseNumber45455", watch("caseNumberName"));
  }, []);

  useEffect(() => {
    if (localStorage.getItem("billDetailComponent") == "false") {
      setBillDetailComponent(false);
    } else {
      setBillDetailComponent(true);
    }
    let tableData = JSON.parse(localStorage.getItem("tableRowData"));
    setValue(
      "advocateName",
      tableData?.advocate?.firstName +
        " " +
        tableData?.advocate?.middleName +
        " " +
        tableData?.advocate?.lastName,
    );
    setValue("advocateId", tableData?.advocateId);
    setValue("advocateName", tableData?.advocateName);
    setValue("city", tableData?.advocate?.city);
    setValue("area", tableData?.advocate?.area);
    setValue("roadName", tableData?.advocate?.roadName);
    setValue("roadName", tableData?.advocate?.roadName);
    setValue("landmark", tableData?.advocate?.landmark);
    setValue("pinCode", tableData?.advocate?.pinCode);
    setValue("mobileNo", tableData?.advocate?.mobileNo);
    setValue("emailAddress", tableData?.advocate?.emailAddress);
    setValue("bankName", tableData?.advocate?.bankName);
    setValue("accountNo", tableData?.advocate?.accountNo);
    setValue("bankIFSCCode", tableData?.advocate?.bankIFSCCode);
    setValue("bankMICRCode", tableData?.advocate?.bankMICRCode);
    setValue("id1", tableData?.id);
    setValue("activeFlag", tableData?.activeFlag);
  }, [localStorage.getItem("nonExistent" != null)]);

  // View
  return (
    <div>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>
            <Paper
              elevation={5}
              sx={{
                p: "20px",
                paddingTop: "20px",
                height: "100%",
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
              <div
                style={{
                  margin: "50px",
                }}
              >
                {/** Advocate Details */}
                <Accordion
                  sx={{
                    margin: "40px",
                    marginLeft: "5vh",
                    marginRight: "5vh",
                    marginTop: "2vh",
                    marginBottom: "2vh",
                  }}
                  elevation={0}
                >
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      textTransform: "uppercase",
                      border: "1px solid white",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    backgroundColor='#0070f3'
                  >
                    <Typography variant='subtitle'>Advocate Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <AdvocateDetails />
                  </AccordionDetails>
                </Accordion>

                {/** Bank Details */}
                <Accordion
                  sx={{
                    margin: "40px",
                    marginLeft: "5vh",
                    marginRight: "5vh",
                    marginTop: "2vh",
                    marginBottom: "2vh",
                  }}
                  elevation={0}
                >
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      textTransform: "uppercase",
                      border: "1px solid white",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    backgroundColor='#0070f3'
                  >
                    <Typography variant='subtitle'>Bank Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <BankDetails />
                  </AccordionDetails>
                </Accordion>

                {/** Documents  */}
                <Accordion
                  sx={{
                    margin: "40px",
                    marginLeft: "5vh",
                    marginRight: "5vh",
                    marginTop: "2vh",
                    marginBottom: "2vh",
                  }}
                  elevation={0}
                >
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      textTransform: "uppercase",
                      border: "1px solid white",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    backgroundColor='#0070f3'
                  >
                    <Typography variant='subtitle'>Documents</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Document disabledInputSate={true} />
                  </AccordionDetails>
                </Accordion>

                {/** Bill Details */}
                <Accordion
                  sx={{
                    margin: "40px",
                    marginLeft: "5vh",
                    marginRight: "5vh",
                    marginTop: "2vh",
                    marginBottom: "2vh",
                  }}
                  elevation={0}
                >
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      textTransform: "uppercase",
                      border: "1px solid white",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    backgroundColor='#0070f3'
                  >
                    <Typography variant='subtitle'>Bill Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <BillDetails />
                  </AccordionDetails>
                </Accordion>
              </div>

              {/** Button **/}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Stack direction='row' spacing={5}>
                  {/** SaveButton **/}
                  <Button
                    style={{ display: "flex", justifyContent: "center" }}
                    variant='contained'
                    color='primary'
                    type='submit'
                  >
                    <FormattedLabel id='submit' />
                  </Button>
                  {/** ExitButton **/}
                  <Button
                    style={{ display: "flex", justifyContent: "center" }}
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      localStorage.removeItem("attachments");
                      localStorage.removeItem("billDetail");
                      localStorage.removeItem("attachments");
                      localStorage.removeItem("tableRowData");
                      localStorage.removeItem("role");
                      localStorage.removeItem("pageMode");
                      localStorage.removeItem("btnInputStateDemandBill");
                      localStorage.removeItem("paidAmountInputState");
                      localStorage.removeItem("approvalAmountInputState");
                      localStorage.removeItem("deleteButtonInputState");
                      localStorage.removeItem("billDetailComponent");
                      localStorage.removeItem("paidAmountTableState");
                      localStorage.removeItem("approvalAmountTableState");
                      localStorage.removeItem("approvalAmountDisabledState");
                      localStorage.removeItem(
                        "demandedBillTableActionButtonInputState",
                      );
                      router.push(`/LegalCase/dashboard`);
                    }}
                  >
                    <FormattedLabel id='exit' />
                  </Button>
                </Stack>
              </div>
            </Paper>
          </form>
        </FormProvider>
      </ThemeProvider>
    </div>
  );
};
export default Scutiny;
