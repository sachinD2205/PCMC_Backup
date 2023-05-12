import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import { Button, Divider, FormControl, Grid, Paper, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import * as yup from 'yup'
import sweetAlert from "sweetalert";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/LegalCaseSchema/approveOpinionSchema";
import urls from "../../../../../URLS/urls";
import styles from "../../../../../styles/LegalCase_Styles/parawiseReport.module.css"

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      parawiseRequestDao: [{ issueNo: "", answerInEnglish: "", answerInMarathi: "" }],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "parawiseRequestDao", // unique name for your Field Array
  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [dptData, setDptData] = useState([]);
  const [buttonText, setButtonText] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);
  const [caseEntryData, setCaseEntryData] = useState([]);

  const token = useSelector((state) => state.user.user.token);

  const getCaseEntryData = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router.query.caseEntryId}`)
      .then((res) => {
        console.log("res", res.data);
        setCaseEntryData(res.data);
      });
  };

  useEffect(() => {
    getCaseEntryData();
  }, []);

  useEffect(() => {
    console.log("router.query", router.query);
    setValue("courtCaseNumber", router.query.caseNumber);
    setValue("fillingDate", router.query.caseDate);
  }, []);

  const getDptDataById = () => {
    axios
      .get(`${urls.LCMSURL}/parawiseRequest/getParawiseReportByDptId?dptId=${router.query.departmentId}`)
      .then((res) => {
        let departmentData = res?.data?.find(
          (item) => item?.trnNewCourtCaseEntryDaoKey == router?.query?.caseEntryId,
        );
        //   console.log("departmentData", departmentData);
        setDptData(departmentData);
      });
  };

  useEffect(() => {
    getDptDataById();
  }, []);
  useEffect(() => {
    setValue("clerkRemarkEnglish", dptData?.clerkRemarkEnglish);
    setValue("clerkRemarkMarathi", dptData?.clerkRemarkMarathi);
    if (router.query.pageMode == "View") {
      setValue("hodRemarkEnglish", dptData?.hodRemarkEnglish);
      setValue("hodRemarkMarathi", dptData?.hodRemarkMarathi);
    }

    if (dptData?.clerkRemarkEnglish == null) {
      return;
    }

    console.log("sagarjson", dptData?.clerkRemarkEnglish);
    // convert dptData?.clerkRemarkEnglish to json array
    let clerkRemarkEnglish = dptData?.clerkRemarkEnglish;
    let jsonArray = JSON.parse(clerkRemarkEnglish);

    remove();
    // iterate jsonArray
    jsonArray.forEach((item) => {
      console.log("sagaritem", item);
      append({
        issueNo: item.issueNo,
        answerInEnglish: item.answerInEnglish,
        answerInMarathi: item.answerInMarathi,
      });
    });
  }, [dptData]);

  useEffect(() => {
    console.log("caseEntryData", caseEntryData);
    setValue("parawiseReportRemarkClerkMr", caseEntryData?.parawiseReportRemarkClerkMr);
    setValue("parawiseReportRemarkClerk", caseEntryData?.parawiseReportRemarkClerk);
    setValue("parawiseReportRemarkHod", caseEntryData?.parawiseReportRemarkHod);
    setValue("parawiseReportRemarkHodMr", caseEntryData?.parawiseReportRemarkHodMr);
  }, [caseEntryData]);

  // Save DB

  const onSubmitForm = (Data) => {
    console.log("sagardata", Data);
    let body = {
      id: router.query.id,
      hodRemarkEnglish: Data.hodRemarkEnglish,
      hodRemarkMarathi: Data.hodRemarkMarathi,
    };
    let _bodyReassign = {
      id: router.query.id,
      hodReassignRemarkEnglish: Data.hodRemarkEnglish,
      hodReassignRemarkMarathi: Data.hodRemarkMarathi,
    };

    let _bodyAprroveWrittenStatement = {
      id: router.query.id,
    };

    if (router.query.status == "WRITTEN_STATEMENT_CREATED") {
      console.log("body", _bodyAprroveWrittenStatement);
      axios
        .post(`${urls.LCMSURL}/parawiseRequest/approveWrittenStatementByHod`, _bodyAprroveWrittenStatement, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        })
        .then((res) => {
          console.log("approveWrittenStatementByHod", res);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Submitted successfully !", "success");
            router.push(`/LegalCase/transaction/newCourtCaseEntry/parawiseRequest`);
          } else if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            router.push(`/LegalCase/transaction/newCourtCaseEntry/parawiseRequest`);
          }
        });
    }

    if (buttonText == "Reassign" && router.query.status == "PARAWISE_REPORT_SENT_TO_HOD") {
      console.log("sagarreassignbody", _bodyReassign);
      axios
        .post(`${urls.LCMSURL}/parawiseRequest/reasssignParawiseReportByHod`, _bodyReassign, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        })
        .then((res) => {
          console.log("approveWrittenStatementByHod", res);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Submitted successfully !", "success");
            router.push(`/LegalCase/transaction/newCourtCaseEntry/parawiseRequest`);
          } else if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            router.push(`/LegalCase/transaction/newCourtCaseEntry/parawiseRequest`);
          }
        });
    }

    if (buttonText == "Approve" && router.query.status == "PARAWISE_REPORT_SENT_TO_HOD") {
      console.log("sagarapprovebody", body);
      axios
        .post(`${urls.LCMSURL}/parawiseRequest/approveParawiseReportByHod`, body, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        })
        .then((res) => {
          console.log("approveParawiseReportByHod", res);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Submitted successfully !", "success");
            router.push(`/LegalCase/transaction/newCourtCaseEntry/parawiseRequest`);
          } else if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            router.push(`/LegalCase/transaction/newCourtCaseEntry/parawiseRequest`);
          }
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              {" "}
              <FormattedLabel id="concDptHodRemarks" />
            </h2>
          </Box>
          <Divider />

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: 10,
              }}
            ></div>

            {/* First Row */}
            <Grid container sx={{ padding: "10px" }}>
              {/* court case no */}
              <Grid
                item
                xs={12}
                sm={8}
                md={6}
                lg={4}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  fullWidth
                  sx={{ width: "90%" }}
                  autoFocus
                  disabled
                  id="standard-basic"
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="courtCaseNumber" />}
                  variant="standard"
                  {...register("courtCaseNumber")}
                />
              </Grid>
              {/* case date */}
              <Grid
                item
                xs={12}
                sm={8}
                md={6}
                lg={4}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth sx={{ width: "90%" }}>
                  <Controller
                    control={control}
                    name="fillingDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          disabled
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="caseDate" />
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                          renderInput={(params) => <TextField {...params} variant="standard" size="small" />}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
              {/* legal clerk Remark in English */}
              <Grid
                item
                xs={12}
                xl={12}
                md={12}
                sm={12}
                sx={
                  {
                    // display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                    // border:'solid red'
                  }
                }
              >
                <TextField
                  id="standard-textarea"
                  disabled
                  // label="Legal Clerk Remark(In English)"
                  label={<FormattedLabel id="legalDeptRemarkEn" />}
                  // placeholder="Opinion"
                  multiline
                  variant="standard"
                  fullWidth
                  {...register("parawiseReportRemarkClerk")}
                  InputLabelProps={{
                    //true
                    shrink:
                      (watch("parawiseReportRemarkClerk") ? true : false) ||
                      (router.query.parawiseReportRemarkClerk ? true : false),
                  }}
                  error={!!errors.clerkRemarkEn}
                  helperText={errors?.clerkRemarkEn ? errors.clerkRemarkEn.message : null}
                />
              </Grid>

              {/* legal clerk Remark in Marathi */}

              <Grid
                item
                xs={12}
                xl={12}
                md={12}
                sm={12}
                sx={{
                  marginTop: "30px",
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                <TextField
                  id="standard-textarea"
                  disabled
                  // label="Opinion"
                  // label={<FormattedLabel id="clerkRemarkMr" />}
                  label={
                    <FormattedLabel id="legalDeptRemarkMr"/>
                  }
                  // placeholder="Opinion"
                  multiline
                  variant="standard"
                  fullWidth
                  // style={{ width: 1000 , marginTop:"30px"}}
                  {...register("parawiseReportRemarkClerkMr")}
                  InputLabelProps={{
                    //true
                    shrink:
                      (watch("parawiseReportRemarkClerkMr") ? true : false) ||
                      (router.query.parawiseReportRemarkClerkMr ? true : false),
                  }}
                  error={!!errors.clerkRemarkEn}
                  helperText={errors?.clerkRemarkEn ? errors.clerkRemarkEn.message : null}
                />
              </Grid>

              {/*legal HOD Remarks in English */}

              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  xl={12}
                  md={12}
                  sm={12}
                  sx={
                    {
                      // marginTop:"30px"
                      // display: "flex",
                      // justifyContent: "center",
                      // alignItems: "center",
                    }
                  }
                >
                  <TextField
                    id="standard-textarea"
                    disabled
                    // label={<FormattedLabel id="hodRemarksEn" />}
                    // label="Legal HOD Remark(In English)"
                    label={
                      <FormattedLabel id="legalHODRemarkEn"/>
                    }
                    multiline
                    variant="standard"
                    fullWidth
                    {...register("parawiseReportRemarkHod")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkHod") ? true : false) ||
                        (router.query.parawiseReportRemarkHod ? true : false),
                    }}
                    error={!!errors.hodRemarkEn}
                    helperText={errors?.hodRemarkEn ? errors.hodRemarkEn.message : null}
                  />
                </Grid>
                {/*legal HOD Remarks in Marathi */}

                <Grid
                  item
                  xs={12}
                  xl={12}
                  md={12}
                  sm={12}
                  sx={{
                    marginTop: "20px",
                    // display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                  }}
                >
                  <TextField
                    id="standard-textarea"
                    disabled
                    label={<FormattedLabel id="legalHODRemarkMr" />}
                    // label="Legal HOD Remark(In Marathi)"
                    multiline
                    variant="standard"
                    // style={{ width: 1000 }}
                    fullWidth
                    {...register("parawiseReportRemarkHodMr")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkHodMr") ? true : false) ||
                        (router.query.parawiseReportRemarkHodMr ? true : false),
                    }}
                    error={!!errors.hodRemarkMr}
                    helperText={errors?.hodRemarkMr ? errors.hodRemarkMr.message : null}
                  />
                </Grid>
              </Grid>
            </Grid>
          </div>

          {/* cons dpt clerk Remarks */}

          <Grid container sx={{ padding: "10px" }}>
            {/* <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // marginTop:"30px"
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="clerkRemarkEn" />}
                multiline
                variant="standard"
                fullWidth
                {...register("clerkRemarkEnglish")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("clerkRemarkEnglish") ? true : false) ||
                    (router.query.clerkRemarkEnglish ? true : false),
                }}
                error={!!errors.clerkRemarkEn}
                helperText={errors?.clerkRemarkEn ? errors.clerkRemarkEn.message : null}
              />
            </Grid> */}

            {/* <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled
                label={<FormattedLabel id="clerkRemarkMr" />}
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("clerkRemarkMarathi")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("clerkRemarkMarathi") ? true : false) ||
                    (router.query.clerkRemarkMarathi ? true : false),
                }}
                error={!!errors.clerkRemarkMr}
                helperText={errors?.clerkRemarkMr ? errors.clerkRemarkMr.message : null}
              />
            </Grid> */}
          </Grid>

          <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "10px",
                    // marginRight: "50px",
                    borderRadius: 100,
                    
                    
                  }}
                >
                  {/* <strong>Parawise Remark</strong> */}
                  <strong>
                    <FormattedLabel id="parawiseRemark"/>
                  </strong>
                </div>

          <Box
            sx={{
              border: "0.1rem outset black",
              marginTop: "10px",
            }}
          >
            <Grid container
             className={styles.theme1}
            >
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <h3>Point No</h3> */}
                <h3>
                  <FormattedLabel id="pointNo"/>
                </h3>
              </Grid>
              <Grid
                item
                xs={10}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <h3>Points Explanation</h3>
                 */}
                 <h3>
                  <FormattedLabel id="pointExp"/>
                 </h3>
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></Grid>
            </Grid>
            <Box
              overflow="auto"
              height={450}
              flex={1}
              flexDirection="column"
              display="flex"
              p={2}
              padding="0px"
              // sx={{
              //   border: "0.2rem outset black",
              //   marginTop:"10px"
              // }}
            >
              {fields.map((parawise, index) => {
                return (
                  <>
                    <Grid container component={Box} style={{ marginTop: 20 }}>
                      <Grid item xs={0.1}></Grid>

                      <Grid item xs={1.5} sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                          disabled
                          placeholder="Issue No"
                          // size="small"
                          type="number"
                          height={500}
                         
                          {...register(`parawiseRequestDao.${index}.issueNo`)}
                        ></TextField>
                      </Grid>

                      <Grid item xs={0.2}></Grid>
                      {/* para for english */}
                      <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField // style={auto_height_style}
                          // rows="1"
                          // style={{ width: 500 }}
                          disabled
                          fullWidth
                          multiline
                          rows={4}
                          style={{
                            

                            // border: "1px  solid",
                          }}
                          placeholder="Paragraph Wise Answer Draft Of Issues(In English)"
                          size="small"
                          // oninput="auto_height(this)"
                          {...register(`parawiseRequestDao.${index}.answerInEnglish`)}
                        ></TextField>
                      </Grid>

                      <Grid item xs={0.3}></Grid>

                      {/* para for Marathi */}
                      <Grid item xs={4.2} sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField // style={auto_height_style}
                          // rows="1"
                          // style={{ width: 500 }}
                          disabled
                          fullWidth
                          multiline
                          rows={4}
                          style={{
                            // background:"red"

                            // border: "1px  solid",
                          }}
                          placeholder="Paragraph Wise Answer Draft Of Issues(In Marathi)"
                          size="small"
                          // oninput="auto_height(this)"
                          {...register(`parawiseRequestDao.${index}.answerInMarathi`)}
                        ></TextField>
                      </Grid>

                      <Grid item xs={0.4}></Grid>
                    </Grid>
                  </>
                );
              })}
              {/* </ThemeProvider> */}
            </Box>
          </Box>

          {/* cons dpt hod Remarks */}
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={
                {
                  // marginTop:"30px"
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }
              }
            >
              <TextField
                id="standard-textarea"
                disabled={router?.query?.pageMode === "View"}
                label={<FormattedLabel id="hodRemarksEn" />}
                multiline
                variant="standard"
                fullWidth
                {...register("hodRemarkEnglish")}
                // InputLabelProps={{
                //true
                //   shrink:
                //     (watch("hodRemarkEnglish") ? true : false) ||
                //     (router.query.hodRemarkEnglish ? true : false),
                // }}
                // error={!!errors.hodRemarksEn}
                // helperText={errors?.hodRemarksEn ? errors.hodRemarksEn.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              sx={{
                marginTop: "20px",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                disabled={router?.query?.pageMode === "View"}
                label={<FormattedLabel id="hodRemarksMr" />}
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("hodRemarkMarathi")}
                // InputLabelProps={{
                //   //true
                //   shrink:
                //     (watch("hodRemarkMarathi") ? true : false) ||
                //     (router.query.clerkRemarkMarathi ? true : false),
                // }}
                // error={!!errors.hodRemarksMr}
                // helperText={errors?.hodRemarksMr ? errors.hodRemarksMr.message : null}
              />
            </Grid>
          </Grid>

          {/* Button Row */}

          <Grid
            container
            mt={10}
            ml={5}
            mb={5}
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
            xs={12}
          >
            <Button
              variant="contained"
              size="small"
              type="submit"
              onClick={() => setButtonText("Approve")}
              sx={{ backgroundColor: "#00A65A" }}
              name="Approve"
              endIcon={<TaskAltIcon />}
            >
              <FormattedLabel id="approve" />
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={() => setButtonText("Reassign")}
              // onClick={()=>reassign()}
              type="submit"
              sx={{ backgroundColor: "#00A65A" }}
              name="Reassign"
              endIcon={<UndoIcon />}
            >
              <FormattedLabel id="reassign" />
            </Button>
            {/* <Button
              variant="contained"
              size="small"
              //   type="submit"
              onClick={() => setButtonText("Reassign")}
              sx={{ backgroundColor: "#00A65A" }}
              name="Reassign"
              endIcon={<UndoIcon />}
            >
              <FormattedLabel id="reassign" />
            </Button> */}
            <Button
              size="small"
              variant="contained"
              sx={{ backgroundColor: "#DD4B39" }}
              endIcon={<CloseIcon />}
              onClick={() => {
                router.push("/LegalCase/transaction/newCourtCaseEntry/parawiseRequest");
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </Grid>
        </Paper>
      </form>
    </>
  );
};

export default Index;
