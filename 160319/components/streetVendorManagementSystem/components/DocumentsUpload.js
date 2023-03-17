import { FormHelperText, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import UploadButtonHawker from "../../../components/streetVendorManagementSystem/fileUpload/UploadButtonHawker";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../styles/documentUpload.module.css";

/** Author - Sachin Durge */
// DocumentsUpload
const DocumentsUpload = () => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [panCardPhoto, setPanCardPhoto] = useState(null);
  const [aadharPhoto, setAadharPhoto] = useState(null);
  const [rationCardPhoto, setRationCardPhoto] = useState(null);
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] = useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  const [affidaviteOnRS100StampAttache, seteAffidaviteOnRS100StampAttache] = useState(null);

  // @ First UseEffect
  useEffect(() => {
    if (getValues("aadharPhoto") != null) {
      setAadharPhoto(getValues("aadharPhoto"));
    }
    if (getValues("panCardPhoto") != null) {
      setPanCardPhoto(getValues("panCardPhoto"));
    }
    if (getValues("rationCardPhoto") != null) {
      setRationCardPhoto(getValues("rationCardPhoto"));
    }
    if (getValues("disablityCertificatePhoto") != null) {
      setDisablityCertificatePhoto(getValues("disablityCertificatePhoto"));
    }
    if (getValues("otherDocumentPhoto") != null) {
      setOtherDocumentPhoto(getValues("otherDocumentPhoto"));
    }
    if (getValues("affidaviteOnRS100StampAttache") != null) {
      seteAffidaviteOnRS100StampAttache(getValues("affidaviteOnRS100StampAttache"));
    }
  }, []);

  // @ Second UseEffect
  useEffect(() => {
    setValue("aadharPhoto", aadharPhoto);
    setValue("panCardPhoto", panCardPhoto);
    setValue("rationCardPhoto", rationCardPhoto);
    setValue("disablityCertificatePhoto", disablityCertificatePhoto);
    setValue("otherDocumentPhoto", otherDocumentPhoto);
    setValue("affidaviteOnRS100StampAttache", affidaviteOnRS100StampAttache);
  }, [
    aadharPhoto,
    panCardPhoto,
    rationCardPhoto,
    disablityCertificatePhoto,
    otherDocumentPhoto,
    affidaviteOnRS100StampAttache,
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
        <strong>{<FormattedLabel id="documentUpload" />}</strong>
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
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2" error={!!errors?.disablityCertificatePhoto}>
            <strong>{<FormattedLabel id="disablityCretificatePhoto" />}</strong>
          </Typography>
          <UploadButtonHawker
            appName="HMS"
            serviceName="H-IssuanceofHawkerLicense"
            filePath={setDisablityCertificatePhoto}
            fileName={disablityCertificatePhoto}
          />
          <FormHelperText error={!!errors?.disablityCertificatePhoto}>
            {errors?.disablityCertificatePhoto ? errors?.disablityCertificatePhoto?.message : null}
          </FormHelperText>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 4 }}>
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
        <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ marginTop: 4 }}>
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
      </Grid>
    </>
  );
};
export default DocumentsUpload;
