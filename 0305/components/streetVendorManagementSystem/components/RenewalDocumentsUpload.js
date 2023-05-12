import { FormHelperText, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import UploadButtonHawker from "../fileUpload/UploadButtonHawker";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../styles/documentUpload.module.css";

/** Author - Sachin Durge */
// RenewalDocumentsUpload
const RenewalDocumentsUpload = () => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] = useState(null);
  // const [panCardPhoto, setPanCardPhoto] = useState(null);
  // const [aadharPhoto, setAadharPhoto] = useState(null);
  // const [rationCardPhoto, setRationCardPhoto] = useState(null);
  // const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
   const [affidaviteOnRS100StampAttache, seteAffidaviteOnRS100StampAttache] = useState(null);

  // @ First UseEffect
  useEffect(() => {

    
    console.log("affidaviteOnRS100StampAttache", watch("affidaviteOnRS100StampAttache"));

    //  if (
    //   getValues("affidaviteOnRS100StampAttache") != null ||
    //   getValues("affidaviteOnRS100StampAttache") != undefined
    // ) {
    //   seteAffidaviteOnRS100StampAttache(getValues("affidaviteOnRS100StampAttache"));
    // }


    // if (getValues("aadharPhoto") != null || getValues("aadharPhoto") != undefined) {
    //   setAadharPhoto(getValues("aadharPhoto"));
    // }
    // if (getValues("panCardPhoto") != null || getValues("panCardPhoto") != undefined) {
    //   setPanCardPhoto(getValues("panCardPhoto"));
    // }
    // if (getValues("rationCardPhoto") != null || getValues("rationCardPhoto") != undefined) {
    //   setRationCardPhoto(getValues("rationCardPhoto"));
    // }
    // if (
    //   getValues("disablityCertificatePhoto") != null ||
    //   getValues("disablityCertificatePhoto") != undefined
    // ) {
    //   setDisablityCertificatePhoto(getValues("disablityCertificatePhoto"));
    // }
    // if (getValues("otherDocumentPhoto") != null || getValues("otherDocumentPhoto") != undefined) {
    //   setOtherDocumentPhoto(getValues("otherDocumentPhoto"));
    // }
    if (
      getValues("affidaviteOnRS100StampAttache") != null ||
      getValues("affidaviteOnRS100StampAttache") != undefined
    ) {
      seteAffidaviteOnRS100StampAttache(getValues("affidaviteOnRS100StampAttache"));
    }
  }, []);

  // useEffect(() => {}, [watch("aadharPhoto")]);

  // @ Second UseEffect
  useEffect(() => {
    setValue("affidaviteOnRS100StampAttache", affidaviteOnRS100StampAttache);
    // setValue("aadharPhoto", aadharPhoto);
    // setValue("panCardPhoto", panCardPhoto);
    // setValue("rationCardPhoto", rationCardPhoto);
    // setValue("disablityCertificatePhoto", disablityCertificatePhoto);
    // setValue("otherDocumentPhoto", otherDocumentPhoto);
  }, [
    affidaviteOnRS100StampAttache,
    // aadharPhoto,
    // panCardPhoto,
    // rationCardPhoto,
    // disablityCertificatePhoto,
    // otherDocumentPhoto,
  ]);

  // view
  return (
    <>
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
        <strong>{<FormattedLabel id="renewalDocumentsUpload" />}</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography>
          <FormattedLabel id="fileSizeInstrction" />{" "}
        </Typography>
      </div>
      <Grid
        container
        sx={{
          marginTop: 5,
          marginBottom: 5,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        
        {/** 
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2" error={!!errors?.aadharPhoto}>
            <strong>{<FormattedLabel id="adharCard" />}</strong>
          </Typography>
          <div className={styles.attachFile}>
            <UploadButtonHawker
              appName="HMS"
              serviceName="H-IssuanceofHawkerLicense"
              filePath={setAadharPhoto}
              fileName={aadharPhoto}
              // fileData={aadhaarCardPhotoData}
            />
            <FormHelperText error={!!errors?.aadharPhoto}>
              {errors?.aadharPhoto ? errors?.aadharPhoto?.message : null}
            </FormHelperText>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2" error={!!errors?.panCardPhoto}>
            <strong>{<FormattedLabel id="panCard" />}</strong>
          </Typography>
          <UploadButtonHawker
            error={!!errors?.panCardPhoto}
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setPanCardPhoto}
            fileName={panCardPhoto}
          />
          <FormHelperText error={!!errors?.panCardPhoto}>
            {errors?.panCardPhoto ? errors?.panCardPhoto?.message : null}
          </FormHelperText>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2" error={!!errors?.rationCardPhoto}>
            <strong>{<FormattedLabel id="rationCard" />}</strong>
          </Typography>
          <UploadButtonHawker
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setRationCardPhoto}
            fileName={rationCardPhoto}
          />
          <FormHelperText error={!!errors?.rationCardPhoto}>
            {errors?.rationCardPhoto ? errors?.rationCardPhoto?.message : null}
          </FormHelperText>
        </Grid>
         */}


        {/** affidaviteOnRS100StampAttache */}
     <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 2 }}>
          <Typography variant="subtitle2" error={!!errors?.affidaviteOnRS100StampAttache}>
            <strong>{<FormattedLabel id="affidaviteOnRS100StampAttachement" />}</strong>
          </Typography>
          <UploadButtonHawker
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={seteAffidaviteOnRS100StampAttache}
            fileName={affidaviteOnRS100StampAttache}
          />
          <FormHelperText error={!!errors?.affidaviteOnRS100StampAttache}>
            {errors?.affidaviteOnRS100StampAttache ? errors?.affidaviteOnRS100StampAttache?.message : null}
          </FormHelperText>
        </Grid>
       
        

        {/**  
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
          <Typography variant="subtitle2" error={!!errors?.otherDocumentPhoto}>
            <strong>{<FormattedLabel id="otherDocumentPhoto" />}</strong>
          </Typography>
          <UploadButtonHawker
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setOtherDocumentPhoto}
            fileName={otherDocumentPhoto}
          />
          <FormHelperText error={!!errors?.otherDocumentPhoto}>
            {errors?.otherDocumentPhoto ? errors?.otherDocumentPhoto?.message : null}
          </FormHelperText>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            <strong>{<FormattedLabel id="disablityCretificatePhoto" />}</strong>
          </Typography>
          <UploadButtonHawker
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setDisablityCertificatePhoto}
            fileName={disablityCertificatePhoto}
          />
        </Grid>
        */}
      </Grid>
    </>
  );
};
export default RenewalDocumentsUpload;
