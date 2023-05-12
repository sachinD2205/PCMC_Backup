import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import { Failed } from "./commonAlert";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "../../../containers/Layout/components/Loader";

/** Authore - Sachin Durge */
// RenewalOfHawkerLicense
const RenewalOfHawkerLicense = () => {
  const {
    control,
    register,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const [loadderState, setLoadderState] = useState(false);
  const [issuanceHawkerLicenseData, setIssuanceHawkerLicenseData] = useState();

  // handleExit
  const handleExit = () => {
    if (localStorage.getItem("loggedInUser") == "departmentUser") {
      router.push(`/streetVendorManagementSystem`);
    } else {
      router.push(`/dashboard`);
    }
  };

  // handleSerach
  const issuanceOfHakerLicenseSerach = () => {
    console.log("licenseNumber", watch("licenseNumber"));
    if (watch("licenseNumber") != null && watch("licenseNumber") != undefined) {
      axios
        .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getByLicensenNo?licensenNo=${watch("licenseNumber")}`)
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            setIssuanceHawkerLicenseData(res?.data);
            setLoadderState(false);
          } else {
            setLoadderState(false);
            <Failed />;
          }
        })
        .catch((errors) => {
          setLoadderState(false);
          <Failed />;
        });
    } else {
         setLoadderState(false);
      alert("Enter Valid Number");
    }
      setLoadderState(false);
  };

  useEffect(() => {
    console.log("issuanceHawkerLicenseData", issuanceHawkerLicenseData);
    setLoadderState(true);
    if (issuanceHawkerLicenseData != null && issuanceHawkerLicenseData != undefined) {
      reset(issuanceHawkerLicenseData);
      setValue("disabledFieldInputState", true);
      setValue("loddderStateNew", true);
    }
    setLoadderState(false)
  }, [issuanceHawkerLicenseData]);

  useEffect(() => {
    console.log("loadderStatesdlfjds", !watch("loddderStateNew"));
  }, [watch("loddderStateNew")]);

  useEffect(() => {
    console.log("Loadder State -- ",loadderState);
  },[loadderState])

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <>
      
    
          {/** 
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
        <strong>{<FormattedLabel id="basicApplicationDetails" />}</strong>
      </div>
    */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "5vh",
            }}
          >
            <TextField
              autoFocus
              style={{ width: "350px" }}
              // disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="issuanceOfHawkerLicenseNumber" />}
              {...register("licenseNumber")}
            // error={!!errors.licenseNumber}
            // helperText={errors?.licenseNumber ? errors.licenseNumber.message : null}
            />
          </div>

          {/** Button */}
          {!watch("loddderStateNew") && (
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
              // sx={{ paddingLeft: "30px", align: "center" }}
              >
                {/** Search Button */}
                <Button startIcon={<SearchIcon />}
            
                  onClick={() => {
                    setValue("newLoadderStateT",true)
                    issuanceOfHakerLicenseSerach()
                  }}
                  variant="contained">
                  {<FormattedLabel id="search" />}
                </Button>
                {/** Exit Button */}
                <Button onClick={handleExit} variant="contained">
                  {<FormattedLabel id="exit" />}
                </Button>
              </Stack>
            
            </>
          )}
        </>)}
    </>
  );
};

export default RenewalOfHawkerLicense;
