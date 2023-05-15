import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./newDocketEntry.module.css";

import Paper from "@mui/material/Paper";
import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Checkbox,
  ListItemText,
  // IconButton,
} from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import { DataGrid } from '@mui/x-data-grid'
import {
  Clear,
  ExitToApp,
  Save,
  // Delete,
  // Edit,
  // Watch,
} from "@mui/icons-material";
// import Slide from '@mui/material/Slide'
import FormControl from "@mui/material/FormControl";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import URLs from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import UploadButton from "../../../../containers/reuseableComponents/UploadButton";
import VishapatraUpload from "../../documentsUpload/VishapatraUpload";
import PrapatraUpload from "../../documentsUpload/PrapatraUpload";
import OtherDocumentsUpload from "../../documentsUpload/OtherDocumentsUpload";

const Index = () => {
  // const [table, setTable] = useState([])
  const [officeName, setOfficeName] = useState([{ id: 1, officeNameEn: "", officeNameMr: "" }]);
  const [departmentName, setDepartmentName] = useState([
    {
      id: 1,
      departmentNameEn: "",
      departmentNameMr: "",
    },
  ]);
  const [committeeName, setCommitteeName] = useState([
    {
      id: 1,
      committeeNameEn: "",
      committeeNameMr: "",
    },
  ]);
  const [financialYear, setFinancialYear] = useState([
    {
      id: 1,
      financialYearEn: "",
      financialYearMr: "",
    },
  ]);
  const [docketType, setDocketType] = useState([{ id: 1, docketTypeEn: "", docketTypeMr: "" }]);
  const [docket, setDocket] = useState();
  const [attachment1, setAttachment1] = useState("");
  const [attachment2, setAttachment2] = useState("");
  const [attachment3, setAttachment3] = useState("");
  // const [runAgain, setRunAgain] = useState(false)
  // const [collapse, setCollapse] = useState(false)

  const [selectedValues, setSelectedValues] = useState([]);

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language);
  console.log("2314", router.query.agendaNo);
  //Docket Details
  let docketSchema = yup.object().shape({
    subjectDate: yup.string().required("Please select Reservation"),
    subject: yup.string().required("Please select Reservation"),
    departmentId: yup.number().required("Please select Reservation"),
    // committeeId: yup.number().required("Please select Reservation"),
    financialYear: yup.number().required("Please select Reservation"),
    docketType: yup.number().required("Please select Reservation"),
    subjectSummary: yup.string().required("Please select Reservation"),
    amount: yup.number().required("Please select Reservation"),
  });

  const {
    register,
    // handleSubmit: handleSubmit,
    handleSubmit,
    setValue,
    // @ts-ignore
    // methods,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(docketSchema),
  });

  useEffect(() => {
    axios
      .get(`${URLs.MSURL}/mstElectoral/getAll`)
      .then((r) => {
        setOfficeName(
          r.data.electoral.map((row) => ({
            id: row.id,
            officeNameEn: row.electoralWardName,
            officeNameMr: row.electoralWardNameMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Office
    // axios
    //   .get(`${URLs.MSURL}/mstDefineOfficeDetails/getAll`)
    //   .then((res) => {
    //     console.log("Office: ", res.data.defineOfficeDetails);
    //     setOfficeName(
    //       res.data.defineOfficeDetails.map((j) => ({
    //         id: j.id,
    //         officeNameEn: j.office,
    //         officeNameMr: j.officeMr,
    //       })),
    //     );
    //   })
    //   .catch((error) => {
    //     console.log("error: ", error);
    //     sweetAlert({
    //       title: "ERROR!",
    //       text: `${error}`,
    //       icon: "error",
    //       buttons: {
    //         confirm: {
    //           text: "OK",
    //           visible: true,
    //           closeModal: true,
    //         },
    //       },
    //       dangerMode: true,
    //     });
    //   });

    //Get Department

    axios
      .get(`${URLs.CFCURL}/master/department/getAll`)
      .then((res) => {
        console.log("Department: ", res.data.department);
        setDepartmentName(
          res.data.department.map((j) => ({
            id: j.id,
            departmentNameEn: j.department,
            departmentNameMr: j.departmentMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Committee
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
      .then((res) => {
        console.log("Committee: ", res.data.committees);
        setCommitteeName(
          res?.data?.committees?.map((j) => ({
            id: j.id,
            committeeNameEn: j.committeeName,
            committeeNameMr: j.committeeNameMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Financial Year
    axios
      .get(`${URLs.CFCURL}/master/financialYearMaster/getAll`)
      .then((res) => {
        console.log("Financial Year: ", res.data.financialYear);
        setFinancialYear(
          res.data.financialYear.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Docket Type
    axios
      .get(`${URLs.MSURL}/mstDocketType/getAll`)
      .then((res) => {
        console.log("Docket Type: ", res.data.docketType);
        setDocketType(
          res.data.docketType.map((j) => ({
            id: j.id,
            docketTypeEn: j.docketType,
            docketTypeMr: j.docketTypeMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });
  }, []);

  const clearButton = () => {
    reset({
      //   id: ID,
      subjectDate: null,
      subject: "",
      officeName: "",
      departmentId: "",
      financialYear: "",
      docketType: "",
      subjectSummary: "",
      amount: "",
    });
    setAttachment1("");
    setAttachment2("");
    setAttachment3("");
  };

  const finalSubmit = (data) => {
    const bodyForAPI = {
      ...data,
      committeeId: selectedValues?.join(",") + ",",
      agendaNo: router.query.agendaNo,
      vishaypatra: attachment1,
      prapatra: attachment2,
      otherDocument: attachment3,
    };
    console.log("Body: ", bodyForAPI);
    axios
      .post(`${URLs.MSURL}/trnNewDocketEntry/saveNewDocket`, bodyForAPI)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          clearButton();
          router.push({
            pathname: `/municipalSecretariatManagement/transaction/minutesOfMeeting`,
            query: { agendaNo: router.query.agendaNo },
          });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });
  };

  const handleSelect = (event) => {
    console.log(":lok3..event", event.target.value);
    setSelectedValues(event.target.value);
  };

  return (
    <>
      <Head>
        <title>New Docket Entry</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>New Docket Entry</div>
        <div style={{ marginTop: 40 }}>
          <form onSubmit={handleSubmit(finalSubmit)}>
            <div>
              <div className={styles.row} style={{ justifyContent: "center" }}>
                <TextField
                  disabled
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="agendaNo" required />}
                  variant="standard"
                  {...register("agendaNo")}
                  defaultValue={router.query.agendaNo ?? ""}
                  error={!!error.agendaNo}
                  helperText={error?.agendaNo ? error.agendaNo.message : null}
                />
              </div>
              <div className={styles.row} style={{ marginTop: 40 }}>
                <FormControl error={!!error.subjectDate}>
                  <Controller
                    control={control}
                    name="subjectDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disablePast
                          inputFormat="dd/MM/yyyy"
                          label={
                            <span>
                              <FormattedLabel id="subjectDate" required />
                            </span>
                          }
                          disabled={router.query.subjectDate ? true : false}
                          value={router.query.subjectDate ? router.query.subjectDate : field.value}
                          onChange={(date) => field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "250px" }}
                              {...params}
                              size="small"
                              fullWidth
                              variant="standard"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>{error?.subjectDate ? error.subjectDate.message : null}</FormHelperText>
                </FormControl>

                <FormControl variant="standard" error={!!error.departmentId}>
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    //   disabled={isDisabled}
                  >
                    <FormattedLabel id="departmentName" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "400px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="departmentName"
                      >
                        {departmentName &&
                          departmentName.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == "en"
                                ? //@ts-ignore
                                  value.departmentNameEn
                                : // @ts-ignore
                                  value?.departmentNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="departmentId"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.departmentId ? error.departmentId.message : null}</FormHelperText>
                </FormControl>
              </div>

              <div className={styles.row}>
                <strong>{<FormattedLabel id="reference" />}</strong>
                <TextareaAutosize
                  color="neutral"
                  disabled={false}
                  minRows={1}
                  maxRows={3}
                  placeholder={
                    language == "en" ? "Department File Reference Number" : "विभाग फाइल संदर्भ क्रमांक"
                  }
                  className={styles.bigText}
                  {...register("reference")}
                />
              </div>

              <div className={styles.row}>
                <strong>{<FormattedLabel id="subject" required />}</strong>
                <TextareaAutosize
                  color="neutral"
                  disabled={false}
                  minRows={1}
                  maxRows={3}
                  placeholder={language == "en" ? "Subject" : "विषय"}
                  className={styles.bigText}
                  {...register("subject")}
                />
              </div>

              <div className={styles.row}>
                <strong>{<FormattedLabel id="subjectSummary" required />}</strong>
                <TextareaAutosize
                  color="neutral"
                  disabled={false}
                  minRows={1}
                  style={{ overflow: "auto" }}
                  placeholder={language == "en" ? "Subject Summary" : "विषय सारांश"}
                  className={styles.bigText}
                  {...register("subjectSummary")}
                />
              </div>

              <div className={styles.row}>
                <strong>{<FormattedLabel id="subjectDetails" />}</strong>
                <TextareaAutosize
                  color="neutral"
                  disabled={false}
                  minRows={1}
                  style={{ overflow: "auto" }}
                  placeholder={language == "en" ? "subject Details" : "विषय तपशील"}
                  className={styles.bigText}
                  {...register("subjectDetails")}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 20,
                  marginTop: "20px",
                }}
              >
                {/* ////////////////// USING MULTISELECT OPTIONS /////////////// */}
                <FormControl>
                  <InputLabel>
                    <FormattedLabel id="selectCommittees" required />
                  </InputLabel>
                  <Select
                    variant="standard"
                    sx={{ width: "400px" }}
                    multiple
                    value={selectedValues}
                    onChange={handleSelect}
                    renderValue={(selected) =>
                      committeeName
                        .filter((v) => selected.includes(v.id))
                        .map((v) => (language == "en" ? v.committeeNameEn : v.committeeNameMr))
                        .join(", ")
                    }
                  >
                    {committeeName &&
                      committeeName.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          <Checkbox checked={selectedValues?.indexOf(value.id) > -1} />
                          <ListItemText
                            primary={language == "en" ? value.committeeNameEn : value.committeeNameMr}
                          />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 20,
                  marginTop: "20px",
                }}
              >
                {selectedValues?.length > 0
                  ? selectedValues.map((obj) => (
                      <TextField
                        disabled
                        sx={{ width: "320px" }}
                        value={
                          language == "en"
                            ? committeeName?.find((o) => o.id == Number(obj))?.committeeNameEn
                            : committeeName?.find((o) => o.id == Number(obj))?.committeeNameMr
                        }
                        variant="standard"
                      />
                    ))
                  : ""}
              </div>

              <div className={styles.row}>
                <FormControl variant="standard" error={!!error.financialYear}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="financialYear" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "230px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="financialYear"
                      >
                        {financialYear &&
                          financialYear.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == "en"
                                ? //@ts-ignore
                                  value.financialYearEn
                                : // @ts-ignore
                                  value?.financialYearMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="financialYear"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.financialYear ? error.financialYear.message : null}</FormHelperText>
                </FormControl>

                <FormControl variant="standard" error={!!error.docketType}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="docketType" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "230px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          setDocket(value.target.value);
                          if (value.target.value === 1) {
                            setValue("amount", 0);
                          }
                        }}
                        label="docketType"
                      >
                        {docketType &&
                          docketType.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == "en"
                                ? //@ts-ignore
                                  value.docketTypeEn
                                : // @ts-ignore
                                  value?.docketTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="docketType"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{error?.docketType ? error.docketType.message : null}</FormHelperText>
                </FormControl>

                <TextField
                  disabled={docket === 1 ? true : false}
                  sx={{ width: "230px" }}
                  label={<FormattedLabel id="amount" required />}
                  variant="standard"
                  {...register("amount")}
                  error={!!error.amount}
                  helperText={error?.amount ? error.amount.message : null}
                  InputLabelProps={{
                    shrink: watch("amount") !== "" ? true : false,
                  }}
                />
                {watch("docketType") && watch("docketType") == 2 ? (
                  <TextField
                    sx={{ width: "230px" }}
                    label={<FormattedLabel id="budgetHead" />}
                    variant="standard"
                    {...register("budgetHead")}
                  />
                ) : (
                  ""
                )}
              </div>
              <div
                // className={styles.row}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginTop: 20,
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "230px", marginBottom: "15px" }}
                  label={<FormattedLabel id="inwardNumber" />}
                  variant="standard"
                  {...register("inwardNumber")}
                />
              </div>

              {/* ////////////////////////////////////////////////////////// */}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  alignItems: "baseline",
                  marginTop: "50px",
                  gap: 50,
                }}
              >
                <VishapatraUpload
                  appName="TP"
                  serviceName="PARTMAP"
                  label={language == "en" ? "VISHYAPATRA" : "विषय पत्र"}
                  filePath={attachment1}
                  fileUpdater={setAttachment1}
                />
                {/* ///////////////////////////////////// */}
                <PrapatraUpload
                  appName="TP"
                  serviceName="PARTMAP"
                  label={language == "en" ? "PRAPATRA" : "प्रापत्र"}
                  filePath={attachment2}
                  fileUpdater={setAttachment2}
                />
                {/* ///////////////////////////////////// */}
                <OtherDocumentsUpload
                  appName="TP"
                  serviceName="PARTMAP"
                  label={language == "en" ? "OTHER DOCUMENT" : "इतर दस्तऐवज"}
                  filePath={attachment3}
                  fileUpdater={setAttachment3}
                />
              </div>
              {/* ////////////////////////////////////////////////////////// */}

              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  type="submit"
                  // disabled={attachment1 ? false : true}
                  endIcon={<Save />}
                >
                  <FormattedLabel id="save" />
                </Button>
                <Button variant="outlined" color="error" endIcon={<Clear />} onClick={clearButton}>
                  <FormattedLabel id="clear" />
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToApp />}
                  // onClick={onBack}
                  onClick={() => {
                    router.push("/municipalSecretariatManagement/dashboard");
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </div>
          </form>

          {/* <div className={styles.table}>
            <DataGrid
              autoHeight
              rows={table}
              //@ts-ignore
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div> */}
        </div>
      </Paper>
    </>
  );
};

export default Index;
