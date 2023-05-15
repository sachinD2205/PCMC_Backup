import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import theme from "../../theme";
import styles from "../marriageRegistration/documentUpload.module.css";
import UploadButton from "./DocumentsUploadOP";
const DocumentsUpload = (props) => {
  let appName = "MR",
    serviceName = "M-NMR";
  const [document, setDocument] = useState([]);
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [pageMode, setPageMode] = useState(null);
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  let user = useSelector((state) => state.user.user);
  // let pageMode = null

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setPageMode(null);
      console.log("enabled", router.query.pageMode);
    } else {
      setPageMode(router.query.pageMode);
      console.log("disabled", router.query.pageMode);
    }
  }, []);

  // const user = useSelector((state) => state?.user);
  // useEffect(()=>{
  //    console.log("bhava0000",router?.query?.pageMode);
  // },[router?.query?.pageMode])
  const methods = useFormContext();
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setDisabled(false);
      console.log("enabled");
    } else {
      setDisabled(true);
      console.log("disabled");
    }
  }, []);
  useEffect(() => {
    axios.get(`${urls.CFCURL}/master/serviceWiseChecklist/getAllByServiceId?serviceId=10`).then((r) => {
      setDocument(r.data.serviceWiseChecklist);
    });
  }, []);

  // viewForm
  const viewForm = (props) => {
    console.log("hsldjf", props);
    const ID = props;
    {
      axios
        .get(`${urls.MR}/transaction/applicant/getapplicantById?applicationId=${ID}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((resp) => {
          console.log("formdata", resp.data);
          reset(resp.data);
        });
    }

    formPreviewDailogOpen();
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className={styles.small}>
          <h4
            style={{
              marginLeft: "40px",
              color: "red",
              fontStyle: "italic",
              marginTop: "25px",
            }}
          >
            {<FormattedLabel id="onlyMHR" />}
          </h4>
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {" "}
                {<FormattedLabel id="documentsUpload" />}
              </h3>

              <h5
                style={{
                  color: "white",
                  marginTop: "10px",
                  marginLeft: "5px",
                }}
              >
                {<FormattedLabel id="docFormat" />}
              </h5>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "6px",
                }}
              >
                {<FormattedLabel id="groomDetail" />}
              </h3>
            </div>
          </div>
          <h4
            style={{
              marginLeft: "40px",
              color: "red",
              fontStyle: "italic",
              marginTop: "25px",
            }}
          >
            {<FormattedLabel id="docNote" />}
          </h4>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="DBProof" required />}</Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.gageProofDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                  {/* Birth Proof Document */}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value),
                          // setGAgeProofDocumentKey(value.target.value),
                          console.log(
                            "OnChangeqqqw",
                            document.find((r) => r.id === value.target.value).documentChecklistMr,
                          );
                      }}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gageProofDocumentKey ? errors.gageProofDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              {/* <UploadButton
              Change={(e) => {
                handleFile1(e, 'gageProofDocument')
              }}
            /> */}
              <UploadButton
                error={!!errors?.gageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("gageProofDocument")}
                fileKey={"gageProofDocument"}
                showDel={pageMode ? false : true}
              />
              <FormHelperText error={!!errors?.gageProofDocument}>
                {errors?.gageProofDocument ? errors?.gageProofDocument?.message : null}
              </FormHelperText>
            </div>
          </div>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="ResProof" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.gresidentialDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {gresidentialDocumentKey.gresidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gresidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gresidentialDocumentKey ? errors.gresidentialDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.gresidentialProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("gresidentialProofDocument")}
                fileKey={"gresidentialProofDocument"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.gresidentialProofDocument}>
                {errors?.gresidentialProofDocument ? errors?.gresidentialProofDocument?.message : null}
              </FormHelperText>
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="IdProof" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.gidProofDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="IdDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 3) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {gidProofDocumentKey.gidProofDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gidProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gidProofDocumentKey ? errors.gidProofDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.gidDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("gidDocument")}
                fileKey={"gidDocument"}
                showDel={pageMode ? false : true}

                // showDel={true}
              />
              <FormHelperText error={!!errors?.gidDocument}>
                {errors?.gidDocument ? errors?.gidDocument?.message : null}
              </FormHelperText>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="brideDetails" />}
              </h3>
            </div>
          </div>
          <h4
            style={{
              marginLeft: "40px",
              color: "red",
              fontStyle: "italic",
              marginTop: "25px",
            }}
          >
            {<FormattedLabel id="docNote" />}
          </h4>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="DBProof" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.bageProofDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                  {/* Birth Proof Document */}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {bageProofDocumentKey.bageProofDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="bageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bageProofDocumentKey ? errors.bageProofDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.bageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("bageProofDocument")}
                fileKey={"bageProofDocument"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.bageProofDocument}>
                {errors?.bageProofDocument ? errors?.bageProofDocument?.message : null}
              </FormHelperText>
            </div>
          </div>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="ResProof" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.bresidentialDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {bresidentialDocumentKey.bresidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="bresidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bresidentialDocumentKey ? errors.bresidentialDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.bresidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("bresidentialDocument")}
                fileKey={"bresidentialDocument"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.bresidentialDocument}>
                {errors?.bresidentialDocument ? errors?.bresidentialDocument?.message : null}
              </FormHelperText>
            </div>
          </div>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>{<FormattedLabel id="IdProof" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.bidProofDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="IdDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="ID Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 3) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {gIdDocumentKey.gIdDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="bidProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bidProofDocumentKey ? errors.bidProofDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.bidDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("bidDocument")}
                fileKey={"bidDocument"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.bidDocument}>
                {errors?.bidDocument ? errors?.bidDocument?.message : null}
              </FormHelperText>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="priestDetails" />}
              </h3>
            </div>
          </div>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="ResProof" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.presidentialDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {presidentialDocumentKey.presidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="presidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.presidentialDocumentKey ? errors.presidentialDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.presidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("presidentialDocument")}
                fileKey={"presidentialDocument"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.presidentialDocument}>
                {errors?.presidentialDocument ? errors?.presidentialDocument?.message : null}
              </FormHelperText>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="witnessDetails" />}
              </h3>
            </div>
          </div>
          {/* witness 1 */}
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="DBProof1" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.wfageProofDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value),
                          console.log(
                            "OnChangeqqqw",
                            document.find((r) => r.id === value.target.value).documentChecklistMr,
                          );
                      }}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wfageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wfageProofDocumentKey ? errors.wfageProofDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.wfageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wfageProofDocument")}
                fileKey={"wfageProofDocument"}
                showDel={pageMode ? false : true}
              />
              <FormHelperText error={!!errors?.wfageProofDocument}>
                {errors?.wfageProofDocument ? errors?.wfageProofDocument?.message : null}
              </FormHelperText>
            </div>
          </div>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>{<FormattedLabel id="ResProofW1" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.wfResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                              {/* {wfResidentialDocumentKey.wfResidentialDocumentKey} */}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wfResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wfResidentialDocumentKey ? errors.wfResidentialDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.wfResidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wfResidentialDocument")}
                fileKey={"wfResidentialDocument"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.wfResidentialDocument}>
                {errors?.wfResidentialDocument ? errors?.wfResidentialDocument?.message : null}
              </FormHelperText>
            </div>
          </div>

          {/* witness 2 */}

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="DBProof2" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.wsageProofDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value),
                          console.log(
                            "OnChangeqqqw",
                            document.find((r) => r.id === value.target.value).documentChecklistMr,
                          );
                      }}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wsageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wsageProofDocumentKey ? errors.wsageProofDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.wsageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wsageProofDocument")}
                fileKey={"wsageProofDocument"}
                showDel={pageMode ? false : true}
              />
              <FormHelperText error={!!errors?.wsageProofDocument}>
                {errors?.wsageProofDocument ? errors?.wsageProofDocument?.message : null}
              </FormHelperText>
            </div>
          </div>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>{<FormattedLabel id="ResProofW2" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.wsResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      //label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {wsResidentialDocumentKey.wsResidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wsResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wsResidentialDocumentKey ? errors.wsResidentialDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.wsResidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wsResidentialDocument")}
                fileKey={"wsResidentialDocument"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.wsResidentialDocument}>
                {errors?.wsResidentialDocument ? errors?.wsResidentialDocument?.message : null}
              </FormHelperText>
            </div>
          </div>

          {/* witness 3 */}

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="DBProof3" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.wtageProofDocumentKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value),
                          console.log(
                            "OnChangeqqqw",
                            document.find((r) => r.id === value.target.value).documentChecklistMr,
                          );
                      }}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wtageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wtageProofDocumentKey ? errors.wtageProofDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.wtageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wtageProofDocument")}
                fileKey={"wtageProofDocument"}
                showDel={pageMode ? false : true}
              />
              <FormHelperText error={!!errors?.wtageProofDocument}>
                {errors?.wtageProofDocument ? errors?.wtageProofDocument?.message : null}
              </FormHelperText>
            </div>
          </div>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>{<FormattedLabel id="ResProofW3" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.wtResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1) return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {wtResidentialDocumentKey.wtResidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wtResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wtResidentialDocumentKey ? errors.wtResidentialDocumentKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.wtResidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wtResidentialDocument")}
                fileKey={"wtResidentialDocument"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.wtResidentialDocument}>
                {errors?.wtResidentialDocument ? errors?.wtResidentialDocument?.message : null}
              </FormHelperText>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="marrigeRelatedDoc" />}
              </h3>
            </div>
          </div>
          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>{<FormattedLabel id="invetaionCard" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <TextField
                disabled={disabled}
                InputLabelProps={{
                  shrink:
                    (watch("uinvitationCard") ? true : false) ||
                    (router.query.uinvitationCard ? true : false),
                }}
                id="standard-basic"
                label={<FormattedLabel id="enterDoc" required />}
                variant="standard"
                {...register("uinvitationCard")}
                error={!!errors.uinvitationCard}
                helperText={errors?.uinvitationCard ? errors.uinvitationCard.message : null}
              />
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.uinvitationCardPath}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("uinvitationCardPath")}
                fileKey={"uinvitationCardPath"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.uinvitationCardPath}>
                {errors?.uinvitationCardPath ? errors?.uinvitationCardPath?.message : null}
              </FormHelperText>
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography> {<FormattedLabel id="marrigePhotoC" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <TextField
                disabled={disabled}
                id="standard-basic"
                InputLabelProps={{
                  shrink:
                    (watch("umarrigePhotoCouple") ? true : false) ||
                    (router.query.umarrigePhotoCouple ? true : false),
                }}
                // label="Enter Document"
                label={<FormattedLabel id="enterDoc" required />}
                variant="standard"
                {...register("umarrigePhotoCouple")}
                error={!!errors.umarrigePhotoCouple}
                helperText={errors?.umarrigePhotoCouple ? errors.umarrigePhotoCouple.message : null}
              />
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.umarrigePhotoCouplePath}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("umarrigePhotoCouplePath")}
                fileKey={"umarrigePhotoCouplePath"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.umarrigePhotoCouplePath}>
                {errors?.umarrigePhotoCouplePath ? errors?.umarrigePhotoCouplePath?.message : null}
              </FormHelperText>
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>{<FormattedLabel id="marDrf" required />} </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <TextField
                disabled={disabled}
                id="standard-basic"
                InputLabelProps={{
                  shrink:
                    (watch("ustampDetail") ? true : false) || (router.query.ustampDetail ? true : false),
                }}
                // label="Enter Document"
                label={<FormattedLabel id="enterDoc" required />}
                variant="standard"
                {...register("ustampDetail")}
                error={!!errors.ustampDetail}
                helperText={errors?.ustampDetail ? errors.ustampDetail.message : null}
              />
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.ustampDetailPath}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("ustampDetailPath")}
                fileKey={"ustampDetailPath"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.ustampDetailPath}>
                {errors?.ustampDetailPath ? errors?.ustampDetailPath?.message : null}
              </FormHelperText>
            </div>
          </div>
          {watch("gdisabled") == true && (
            <div className={styles.row1}>
              <div className={styles.srow} style={{ marginTop: "30px" }}>
                <Typography>Disability groom</Typography>
              </div>

              <div style={{ marginLeft: "50px" }}>
                <TextField
                  disabled={disabled}
                  id="standard-basic"
                  InputLabelProps={{
                    shrink:
                      (watch("personDisabled") ? true : false) ||
                      (router.query.personDisabled ? true : false),
                  }}
                  label={<FormattedLabel id="enterDoc" required />}
                  variant="standard"
                  {...register("personDisabled1")}
                  error={!!errors.personDisabled1}
                  helperText={errors?.personDisabled1 ? errors.personDisabled1.message : null}
                />
              </div>

              <div style={{ marginLeft: "50px", marginTop: "25px" }}>
                <UploadButton
                  appName={appName}
                  serviceName={serviceName}
                  fileDtl={getValues("ugdisabled")}
                  fileKey={"ugdisabled"}
                  showDel={pageMode ? false : true}
                />
              </div>
            </div>
          )}

          {watch("bdisabled") == true && (
            <div className={styles.row1}>
              <div className={styles.srow} style={{ marginTop: "30px" }}>
                <Typography>Disability bride</Typography>
              </div>

              <div style={{ marginLeft: "50px" }}>
                <TextField
                  disabled={disabled}
                  id="standard-basic"
                  InputLabelProps={{
                    shrink:
                      (watch("personDisabled") ? true : false) ||
                      (router.query.personDisabled ? true : false),
                  }}
                  label={<FormattedLabel id="enterDoc" required />}
                  variant="standard"
                  {...register("personDisabled")}
                  error={!!errors.personDisabled}
                  helperText={errors?.personDisabled ? errors.personDisabled.message : null}
                />
              </div>

              <div style={{ marginLeft: "50px", marginTop: "25px" }}>
                <UploadButton
                  appName={appName}
                  serviceName={serviceName}
                  fileDtl={getValues("ubdisabled")}
                  fileKey={"ubdisabled"}
                  showDel={pageMode ? false : true}
                />
              </div>
            </div>
          )}
          {getValues("udivorcePaper") != "" &&
            getValues("udeathcer") != "" &&
            getValues("ucertiReligious") != "" && (
              <>
                {/* Other Docs */}
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      {<FormattedLabel id="otherDetail" />}
                    </h3>
                  </div>
                </div>
                {/* groom divorce */}
                {watch("gstatusAtTimeMarriageKey") && watch("gstatusAtTimeMarriageKey") == 3 && (
                  <>
                    <div className={styles.row1}>
                      <div className={styles.srow} style={{ marginTop: "30px" }}>
                        <Typography>{<FormattedLabel id="DivorcePaperg" required />} </Typography>
                      </div>

                      <div style={{ marginLeft: "50px" }}>
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch("gudivorcePaper") ? true : false) ||
                              (router.query.gudivorcePaper ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                          // label="Enter Document"
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register("gudivorcePaper")}
                          error={!!errors.gudivorcePaper}
                          helperText={errors?.gudivorcePaper ? errors.gudivorcePaper.message : null}
                        />
                      </div>

                      <div style={{ marginLeft: "50px", marginTop: "25px" }}>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("gudivorcePaperPath")}
                          fileKey={"gudivorcePaperPath"}
                          showDel={pageMode ? false : true}
                          // showDel={true}
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* bride divorce */}
                {watch("bstatusAtTimeMarriageKey") && watch("bstatusAtTimeMarriageKey") == 3 && (
                  <>
                    <div className={styles.row1}>
                      <div className={styles.srow} style={{ marginTop: "30px" }}>
                        <Typography>{<FormattedLabel id="DivorcePaperb" required />} </Typography>
                      </div>

                      <div style={{ marginLeft: "50px" }}>
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch("budivorcePaper") ? true : false) ||
                              (router.query.budivorcePaper ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                          // label="Enter Document"
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register("budivorcePaper")}
                          error={!!errors.budivorcePaper}
                          helperText={errors?.budivorcePaper ? errors.budivorcePaper.message : null}
                        />
                      </div>

                      <div style={{ marginLeft: "50px", marginTop: "25px" }}>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("budivorcePaperPath")}
                          fileKey={"budivorcePaperPath"}
                          showDel={pageMode ? false : true}
                          // showDel={true}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* groom widow */}
                {watch("gstatusAtTimeMarriageKey") && watch("gstatusAtTimeMarriageKey") == 4 && (
                  <>
                    <div className={styles.row1}>
                      <div className={styles.srow} style={{ marginTop: "30px" }}>
                        <Typography>{<FormattedLabel id="DeathCg" required />} </Typography>
                      </div>

                      <div style={{ marginLeft: "50px" }}>
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch("gudeathcer") ? true : false) ||
                              (router.query.gudeathcer ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                          // label="Enter Document"
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register("gudeathcer")}
                          error={!!errors.gudeathcer}
                          helperText={errors?.gudeathcer ? errors.gudeathcer.message : null}
                        />
                      </div>

                      <div style={{ marginLeft: "50px", marginTop: "25px" }}>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("gudeathcerPath")}
                          fileKey={"gudeathcerPath"}
                          showDel={pageMode ? false : true}
                          // showDel={true}
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* bride widow */}
                {watch("bstatusAtTimeMarriageKey") && watch("bstatusAtTimeMarriageKey") == 4 && (
                  <>
                    <div className={styles.row1}>
                      <div className={styles.srow} style={{ marginTop: "30px" }}>
                        <Typography>{<FormattedLabel id="DeathCb" required />}</Typography>
                      </div>

                      <div style={{ marginLeft: "50px" }}>
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch("budeathcer") ? true : false) ||
                              (router.query.budeathcer ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                          // label="Enter Document"
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register("budeathcer")}
                          error={!!errors.budeathcer}
                          helperText={errors?.budeathcer ? errors.budeathcer.message : null}
                        />
                      </div>

                      <div style={{ marginLeft: "50px", marginTop: "25px" }}>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("budeathcerPath")}
                          fileKey={"budeathcerPath"}
                          showDel={pageMode ? false : true}
                          // showDel={true}
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* {getValues("udeathcer") != "" && (
                  <>
                    <div className={styles.row1}>
                      <div className={styles.srow} style={{ marginTop: "30px" }}>
                        <Typography>{<FormattedLabel id="DeathC" />}</Typography>
                      </div>

                      <div style={{ marginLeft: "50px" }}>
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch("udeathcer") ? true : false) || (router.query.udeathcer ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                      
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register("udeathcer")}
                          error={!!errors.udeathcer}
                          helperText={errors?.udeathcer ? errors.udeathcer.message : null}
                        />
                      </div>

                      <div style={{ marginLeft: "50px", marginTop: "25px" }}>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("udeathcerPath")}
                          fileKey={"udeathcerPath"}
                          showDel={pageMode ? false : true}
                          
                        />
                      </div>
                    </div>
                  </>
                )} */}

                {/* {getValues('ubDeathcer') != '' && (
                  <>
                    <div className={styles.row1}>
                      <div
                        className={styles.srow}
                        style={{ marginTop: '30px' }}
                      >
                        <Typography>
                          {<FormattedLabel id="DeathC" />}
                        </Typography>
                      </div>

                      <div style={{ marginLeft: '50px' }}>
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch('ubDeathcer') ? true : false) ||
                              (router.query.ubDeathcer ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                          // label="Enter Document"
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register('ubDeathcer')}
                          error={!!errors.ubDeathcer}
                          helperText={
                            errors?.ubDeathcer
                              ? errors.ubDeathcer.message
                              : null
                          }
                        />
                      </div>

                      <div style={{ marginLeft: '50px', marginTop: '25px' }}>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues('ubDeathcerPath')}
                          fileKey={'ubDeathcerPath'}
                          showDel={pageMode ? false : true}
                          // showDel={true}
                        />
                      </div>
                    </div>
                  </>
                )} */}
                {getValues("ucertiReligious") != "" && (
                  <>
                    <div className={styles.row1}>
                      <div className={styles.srow} style={{ marginTop: "30px" }}>
                        <Typography>{<FormattedLabel id="certiByReligiousPlc" />}</Typography>
                      </div>

                      <div style={{ marginLeft: "50px" }}>
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch("ucertiReligious") ? true : false) ||
                              (router.query.ucertiReligious ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                          //   label="Enter Document"
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register("ucertiReligious")}
                          error={!!errors.ucertiReligious}
                          helperText={errors?.ucertiReligious ? errors.ucertiReligious.message : null}
                        />
                      </div>

                      <div style={{ marginLeft: "50px", marginTop: "25px" }}>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("ucertiReligiousPath")}
                          fileKey={"ucertiReligiousPath"}
                          showDel={pageMode ? false : true}
                          // showDel={true}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

          {/* {!props.preview && (
            <div className={styles.viewformbtn}>
              <Button
                style={{
                  height: '40px',
                  width: '150px',
                }}
                variant="contained"
                endIcon={<VisibilityIcon />}
                size="small"
                onClick={() => {
                  const id = router.query.id
                  console.log('sddlfkjslkfdjsdlkf', router.query.id)
                  viewForm(id)
                }}
              >
                {language === 'en' ? 'Preview' : 'अर्जाचे पूर्वावलोकन'}
              </Button>
            </div>
          )} */}
        </div>
        {/* <>
          <Dialog
            fullWidth
            maxWidth={'lg'}
            open={formPreviewDailog}
            onClose={() => formPreviewDailogClose()}
          >
            <CssBaseline />
            <DialogTitle>
              <Grid container>
                <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                  Preview
                </Grid>
                <Grid
                  item
                  xs={1}
                  sm={2}
                  md={4}
                  lg={6}
                  xl={6}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <IconButton
                    aria-label="delete"
                    sx={{
                      marginLeft: '530px',
                      backgroundColor: 'primary',
                      ':hover': {
                        bgcolor: 'red', // theme.palette.primary.main
                        color: 'white',
                      },
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: 'black',
                      }}
                      onClick={() => {
                        formPreviewDailogClose()
                      }}
                    />
                  </IconButton>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <>
                <FormProvider {...methods}>
                  <form>
                    <ApplicantDetails />
                    <GroomDetails />
                    <BrideDetails />
                    <PriestDetails />
                    <WitnessDetails />
                    <DocumentsUpload preview={true} />
                  </form>
                </FormProvider>
              </>
            </DialogContent>

            <DialogTitle>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button
                  onClick={() => {
                    swal({
                      title: 'Exit?',
                      text: 'Are you sure you want to exit this Record ? ',
                      icon: 'warning',
                      buttons: true,
                      dangerMode: true,
                    }).then((willDelete) => {
                      if (willDelete) {
                        swal('Record is Successfully Exit!', {
                          icon: 'success',
                        })
                        formPreviewDailogClose()
                      } else {
                        swal('Record is Safe')
                      }
                    })
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </DialogTitle>
          </Dialog>
        </> */}
      </ThemeProvider>
    </>
  );
};

export default DocumentsUpload;
