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
  Typography,
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

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
    // setLoadderState(true)
    let data;
    console.log("licenseNumber2332", watch("licenseNumber"));
    if (watch("licenseNumber") != null && watch("licenseNumber") != undefined) {
 data=axios
        .get(`${urls.HMSURL}/transaction/renewalOfHawkerLicense/getByLicensenNo?licensenNo=${watch("licenseNumber")}`)
        .then((res) => {
          console.log("responseMessage324", res);
        if (res?.data != null && res?.data != undefined) {
      reset(res?.data);
      setValue("disabledFieldInputState", true);
      setValue("loddderStateNew", true);
    }
         
          else if (res?.status == 400) {
            alert("ds");
          }
         
          else {
            console.log("responseMessage",res);
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
    }
    // console.log("datadfsld",data);
  };


   // getIssuanceOfHawkerLicenseData
  const getIssuanceOfHawkerLicenseData = () => {
    console.log("issuanceOfHawkerLicenseId23", watch("hawkerId"));
    if (watch("hawkerId") != null && watch("hawkerId") != undefined) {
      axios
        .get(`${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${watch("hawkerId")}`)
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
    if (res?.data != null && res?.data != undefined) {
      reset(res?.data);
      setValue("disabledFieldInputState", true);
      setValue("loddderStateNew", true);
    }
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
    }
  };

  
  // view
  return (
    <>
      {loadderState ?  (
        <Loader />
      ) : (
        <>
      
    
         
              {/** First params */}
            <Grid container
              style={{
                // backgroundColor:"yellow",
              // display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
              // flexWrap: "wrap",
              // marginBottom: "5vh",
               }}
            >
                <Grid  style={{display:"flex",flexDirection:"row",justifyContent:"center"}} item  xs={12} sm={12} md={12} lg={12} xl={12}>
                
            <TextField
              // autoFocus
              style={{ width: "350px" }}
              // disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="issuanceOfHawkerLicenseNumber" />}
              {...register("licenseNumber")}
            // error={!!errors.licenseNumber}
            // helperText={errors?.licenseNumber ? errors.licenseNumber.message : null}
            />
                </Grid>
            </Grid>

            <Grid container >
              <Grid item
              xs={12} sm={12} md={12} xl={12} lg={12} 
              >
              
               <div
                  style={{
                  //  backgroundColor:"red",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop:"3vh"
              }}>
                <Typography
                  style={{textAlign:"center",color:"blue"}}
                >
                  <FormattedLabel id="or"/>
                  </Typography>
              </div>
              </Grid>
            </Grid>
            
            {/** Second parms */}
            <div style={{
              // backgroundColor:"yellow",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding:"0 20vw"
            }}>
              <div>
                <TextField
              autoFocus
              // style={{ width: "350px" }}
              // disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="streetVendorFullName" />}
              {...register("streetVendorFullName")}
            // error={!!errors.licenseNumber}
            // helperText={errors?.licenseNumber ? errors.licenseNumber.message : null}
            /></div>
              <div
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop:"3vh"
              }}>
                <Typography
                  style={{textAlign:"center",color:"black"}}
                >
                  <FormattedLabel id="and"/>
                  </Typography>
              </div>
              <div>
                <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name='dateOfBirth'
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    // disabled={inputState}
                    inputFormat='DD/MM/YYYY'
                    label={
                      <span style={{ fontSize: 16, marginTop: 2 }}>
                        {<FormattedLabel id='dateOfBirth' />}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      let date1 = moment(date).format("YYYY");
                      setValue(
                        "age",
                        Math.floor(moment().format("YYYY") - date1),
                      );
                    }}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
            </FormHelperText>
                </FormControl></div>
            </div>
            
              <Grid container >
              <Grid item
              xs={12} sm={12} md={12} xl={12} lg={12} 
              >
              
               <div
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop:"3vh"
              }}>
                <Typography
                  style={{textAlign:"center",color:"blue"}}
                >
                  <FormattedLabel id="or"/>
                  </Typography>
              </div>
              </Grid>
            </Grid>
          
            {/** Third params */}
             <div style={{
              display: "flex",
                //  backgroundColor:"yellow",
              justifyContent: "space-between",
              alignItems: "center",
              padding:"0 20vw"
            }}>
              <div>
                <TextField
              autoFocus
              // style={{ width: "350px" }}
              // disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="streetVendorFullName" />}
              {...register("streetVendorFullName")}
            // error={!!errors.licenseNumber}
            // helperText={errors?.licenseNumber ? errors.licenseNumber.message : null}
            /></div>
              <div
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop:"3vh"
              }}>
                <Typography
                  style={{textAlign:"center",color:"black"}}
                >
                  <FormattedLabel id="and"/>
                  </Typography>
              </div>
              <div>
                 <TextField
              autoFocus
              // style={{ width: "350px" }}
              // disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="mobile" />}
              {...register("mobile")}
            // error={!!errors.mobile}
            // helperText={errors?.mobile ? errors.mobile.message : null}
            />
                
                
                
                  </div>
              </div>
            
          {/** Button */}
          {!watch("loddderStateNew") && (
            <>
              <Stack
                  style={{
                  marginTop:"4vh",
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
                    setLoadderState(true)
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
