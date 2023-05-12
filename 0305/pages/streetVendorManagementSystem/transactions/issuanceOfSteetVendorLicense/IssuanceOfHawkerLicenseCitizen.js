import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import { Button, Paper, Stack, ThemeProvider, Typography } from "@mui/material";
import theme from "../../../../theme";
import BasicApplicationDetails from "../../../../components/streetVendorManagementSystem/components/BasicApplicationDetails";
import {
  BasicApplicationDetailsSchema,
  IssuanceOfHawkerLicenseCitizenSchema,
} from "../../../../components/streetVendorManagementSystem/schema/issuanceOfHawkerLicenseSchema";
import HawkerDetails from "../../../../components/streetVendorManagementSystem/components/HawkerDetails";
import AddressOfHawker from "../../../../components/streetVendorManagementSystem/components/AddressOfHawker";
import AadharAuthentication from "../../../../components/streetVendorManagementSystem/components/AadharAuthentication";
import PropertyAndWaterTaxes from "../../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes";
import AdditionalDetails from "../../../../components/streetVendorManagementSystem/components/AdditionalDetails";
import DocumentsUploadWithouDeleteButton from "../../../../components/streetVendorManagementSystem/components/DocumentsUploadWithouDeleteButton";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import DocumentsUpload from "../../../../components/streetVendorManagementSystem/components/DocumentsUpload";
import { yupResolver } from "@hookform/resolvers/yup";
const IssuanceOfHawkerLicenseCitizen = () => {
  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(IssuanceOfHawkerLicenseCitizenSchema),
  });

  // destructure values from methods
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: {},
  } = methods;
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [loadderState, setLoadderState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [shrinkTemp, setShrinkTemp] = useState(false);
  const [applicationRevertedToCititizen, setApplicationRevertedToCititizen] = useState(false);
  const [applicationRevertedToCititizenNew, setApplicationRevertedToCititizenNew] = useState(true);
  let user = useSelector((state) => state.user.user);
  const handleNext = (data) => {
    let userType;

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "CFC_USER") {
      userType = 2;
    } else if (localStorage.getItem("loggedInUser") == "DEPT_USER") {
      userType = 3;
    }

    console.log("user.id", user?.id);

    const finalBodyForApi = {
      ...data,
      applicationStatus: "APPLICATION_CREATED",
      pageMode: "APPLICATION_CREATED",
      id: issuanceOfHawkerLicenseId,
      activeFlag: "Y",
      serviceId: 24,
      crCityNameMr: "पिंपरी चिंचवड",
      crStateMr: "महाराष्ट्र",
      serviceName: "Issuance Of Hawker License",
      createdUserId: user?.id,
      userType: userType,
    };

    axios
      .post(`${urls.HMSURL}/IssuanceofHawkerLicense/saveIssuanceOfHawkerLicense`, finalBodyForApi, {
        headers: {
          role: "CITIZEN",
        },
      })
      .then((res) => {
        console.log("res?.stasdf", res);
        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setLoading(false);
          res?.data?.id
            ? sweetAlert("Submitted!", res?.data?.message, "success")
            : sweetAlert("Submitted !", res?.data?.message, "success");
          if (localStorage.getItem("loggedInUser") == "departmentUser") {
            setLoadderState(false);
            router.push(`/streetVendorManagementSystem`);
          } else {
            setLoadderState(false);
            router.push(`/dashboard`);
          }
        } else {
          setLoadderState(false);
          setLoading(false);
          <Failed />;
        }
      })
      .catch((err) => {
        setLoadderState(false);
        setLoading(false);
        <Failed />;
      });
  };

  // getHawkerLiceseData
  const getIssuanceOfHawkerLicsenseData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          console.log("hawkerLicenseData", r?.data);
          reset(r.data);
          if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
            setValue("disabledFieldInputState", false);
          } else {
            setValue("disabledFieldInputState", true);
          }
          setShrinkTemp(true);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          setShrinkTemp(true);
          <Failed />;
        }
        alert("d");
        console.log("rationCardPhoto", watch("rationCardPhoto"));
      })
      .catch(() => {
        setLoadderState(false);
        setShrinkTemp(true);
        <Failed />;
      });
  };

  useEffect(() => {
    getIssuanceOfHawkerLicsenseData();
  }, [issuanceOfHawkerLicenseId]);

  // useEffect(() => {}, [watch("disabledFieldInputState")]);

  useEffect(() => {
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null ||
      localStorage.getItem("issuanceOfHawkerLicenseId") != ""
    ) {
      setIssuanceOfHawkerLicenseId(localStorage.getItem("issuanceOfHawkerLicenseId"));
    }
    if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
      setApplicationRevertedToCititizen(true);
      setApplicationRevertedToCititizenNew(false);
      setValue("disabledFieldInputState", true);
    } else {
      setApplicationRevertedToCititizen(false);
      setApplicationRevertedToCititizenNew(true);
      setValue("disabledFieldInputState", false);
    }
  }, []);

  useEffect(() => {}, [watch("disabledFieldInputState")]);
  useEffect(() => {}, [setApplicationRevertedToCititizen, setApplicationRevertedToCititizen]);

  // view
  return (
    <>
      {shrinkTemp && (
        <div>
          <ThemeProvider theme={theme}>
            {loadderState ? (
              <Loader />
            ) : (
              <Paper
                square
                sx={{
                  // margin: 5,
                  padding: 1,
                  // paddingTop: 5,
                  paddingTop: 5,
                  paddingBottom: 5,
                  backgroundColor: "white",
                }}
                elevation={5}
              >
                {/** Main Heading */}
                <marquee>
                  <Typography
                    variant="h5"
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      marginTop: "2px",
                    }}
                  >
                    <strong>{<FormattedLabel id="streetVendorManagmentSystem" />}</strong>
                  </Typography>
                </marquee>
                <br /> <br />
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handleNext)} sx={{ marginTop: 10 }}>
                    <BasicApplicationDetails />
                    <HawkerDetails />
                    <AddressOfHawker />
                    <AadharAuthentication />
                    <PropertyAndWaterTaxes />
                    <AdditionalDetails />

                    {applicationRevertedToCititizen && <DocumentsUpload />}
                    {applicationRevertedToCititizenNew && <DocumentsUploadWithouDeleteButton />}
                    <Stack
                      spacing={5}
                      direction="row"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItem: "center",
                        // marginLeft: "50px",
                      }}
                    >
                      {applicationRevertedToCititizen && (
                        <Button variant="contained" type="submit">
                          <FormattedLabel id="submit" />
                        </Button>
                      )}

                      <Button
                        onClick={() => {
                          localStorage.removeItem("issuanceOfHawkerLicenseId");
                          router.push("/dashboard");
                        }}
                        type="button"
                        variant="outlined"
                        color="primary"
                      >
                        {<FormattedLabel id="back" />}
                      </Button>
                    </Stack>
                  </form>
                </FormProvider>
              </Paper>
            )}
          </ThemeProvider>
        </div>
      )}
    </>
  );
};

export default IssuanceOfHawkerLicenseCitizen;
