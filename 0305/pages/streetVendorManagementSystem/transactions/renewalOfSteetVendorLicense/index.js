import { Button, Grid, Paper, Stack, TextField, ThemeProvider } from "@mui/material";
import React, { useEffect } from "react";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import RenewalOfHawkerLicense from "../../../../components/streetVendorManagementSystem/components/RenewalOfHawkerLicense";
import theme from "../../../../theme";
import BasicApplicationDetails from "../../../../components/streetVendorManagementSystem/components/BasicApplicationDetails";
import HawkerDetails from "../../../../components/streetVendorManagementSystem/components/HawkerDetails";
import AddressOfHawker from "../../../../components/streetVendorManagementSystem/components/AddressOfHawker";
import AadharAuthentication from "../../../../components/streetVendorManagementSystem/components/AadharAuthentication";
import PropertyAndWaterTaxes from "../../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes";
import AdditionalDetails from "../../../../components/streetVendorManagementSystem/components/AdditionalDetails";
import DocumentsUploadWithouDeleteButton from "../../../../components/streetVendorManagementSystem/components/DocumentsUploadWithouDeleteButton";
import RenewalDocumentsUpload from "../../../../components/streetVendorManagementSystem/components/RenewalDocumentsUpload";
import { useRouter } from "next/router";
import axios from "axios";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import Loader from "../../../../containers/Layout/components/Loader";
import { RenewalOfHawkerLicenseSchema } from "../../../../components/streetVendorManagementSystem/schema/RenewalOfHawkerLicenseSchema";
import { useSelector } from "react-redux";


//renewalOfIssuanceOfHawkerLicense
// http://localhost:4000/streetVendorManagementSystem/transactions/renewalOfIssuanceOfHawkerLicense
const index = () => {
  const [dataValidation, setDataValidation] = useState();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(RenewalOfHawkerLicenseSchema),
  });
  const [userType1, setuserType] = useState(null);
  const { register, getValues, setValue, handleSubmit, methos, watch, reset } = methods;
  const [loadderState, setLoadderState] = useState(false);
  let user = useSelector((state) => state.user.user);
  // handleNext
  const handleNext = (data) => {


    // siteVisit
    // hawkerLicenseHistoryLst

    console.log("data -----3324", data);



    setLoadderState(true);

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      setuserType(1);
    } else if (localStorage.getItem("loggedInUser") == "CFC_USER") {
      setuserType(2);
    } else if (localStorage.getItem("loggedInUser") == "DEPT_USER") {
      setuserType(3);
    }

    let loggedInUser = localStorage.getItem("loggedInUser");
    console.log("loggedInUser++", loggedInUser);

    const finalBodyForApi = {
      ...data,
      siteVisit: null,
      hawkerLicenseHistoryLst: null,
      loi: null,
      paymentCollection: null,
      activeFlag: "Y",
      // crCityNameMr: "पिंपरी चिंचवड",
      // id: draftId,
      // crStateMr: "महाराष्ट्र",
      // pageMode: "APPLICATION_CREATED",
      // serviceName: "Issuance Of Hawker License",
      // serviceId: 24,
      // applicationStatus: "APPLICATION_CREATED",
      createdUserId: user?.id,
      userType: userType1,
    };





    //  axios
    //   .post(`${urls.HMSURL}/renewalOfHawkerLicense/saveRenewalOfHawkerLicense`, finalBodyForApi, {
    //     headers: {
    //       role: "CITIZEN",
    //     },
    //   })
    //   .then((res) => {
    //     console.log("res?.stasdf", res);
    //     if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
    //       // localStorage.removeItem("applicationRevertedToCititizen");
    //       // localStorage.removeItem("issuanceOfHawkerLicenseId");
    //       // localStorage.removeItem("Draft");
    //       setLoadderState(false);
    //       res?.data?.id
    //         ? sweetAlert("Submitted!", res?.data?.message, "success")
    //         : sweetAlert("Submitted !", res?.data?.message, "success");
    //       if (localStorage.getItem("loggedInUser") == "departmentUser") {
    //         setLoadderState(false);
    //         router.push(`/streetVendorManagementSystem`);
    //       } else {
    //         setLoadderState(false);
    //         router.push(`/dashboard`);
    //       }
    //     } else {
    //       setLoadderState(false);
    //       <Failed />;
    //     }
    //   })
    //   .catch((err) => {
    //     setLoadderState(false);
    //     <Failed />;
    //   });



    setLoadderState(false);
    alert("Handle Next");
  };

  // handleExit
  const handleExit = () => {
    if (localStorage.getItem("loggedInUser") == "departmentUser") {
      router.push(`/streetVendorManagementSystem`);
    } else {
      router.push(`/dashboard`);
    }
    reset();
    setValue("disabledFieldInputState", false);
    setValue("loddderStateNew", false);
  };

  // handleClear
  const handleClearRecord = () => {
    reset();
    setValue("disabledFieldInputState", false);
    setValue("loddderStateNew", false);
  }


  useEffect(() => {
    console.log("loddderStateNew", watch("loddderStateNew"));
  }, [watch("loddderStateNew")]);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)} sx={{ marginTop: 10 }}>
            <ThemeProvider theme={theme}>
              <Paper
                square
                sx={{
                  padding: 1,
                  paddingTop: 5,
                  paddingBottom: 5,
                  backgroundColor: "white",
                }}
                elevation={5}
              >
                <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "40px",
                    marginRight: "65px",
                    borderRadius: 100,
                  }}
                >
                  <strong>{<FormattedLabel id="renewalOfIssuanceOfHawkerLicense" />}</strong>
                </div>
                <RenewalOfHawkerLicense />
                {watch("loddderStateNew") && (
                  <>
                    <BasicApplicationDetails />
                    <HawkerDetails />
                    <AddressOfHawker />
                    <AadharAuthentication />
                    <PropertyAndWaterTaxes />
                    <AdditionalDetails />
                    <DocumentsUploadWithouDeleteButton />
                    <RenewalDocumentsUpload />
                  </>
                )}

                {/** Button */}
                {watch("loddderStateNew") && (
                  <>
                    <Stack
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                      direction="row"
                      spacing={5}
                    >
                      {/** Search Button */}
                      <Button type="submit" variant="contained">
                        {<FormattedLabel id="submit" />}
                      </Button>

                      {/** Clear Button */}
                      <Button onClick={handleClearRecord} variant="contained">
                        {<FormattedLabel id="clear" />}
                      </Button>


                      {/** Exit Button */}
                      <Button onClick={handleExit} variant="contained">
                        {<FormattedLabel id="exit" />}
                      </Button>

                    </Stack>
                  </>
                )}
              </Paper>
            </ThemeProvider>
          </form>
        </FormProvider>
      )}
    </>
  );
};

export default index;
