import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import BoardRegistration from '../boardRegistrations/citizen/boardRegistration'
import AccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import RenewForm from "./renewForm";
import styles from "./renewalOfMBReg.module.css";
import { useRouter } from "next/router";

const Index = () => {
  const disptach = useDispatch();
  const router = useRouter();

  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const [flagSearch, setFlagSearch] = useState(false);
  const [data, setData] = useState();

  const handleSearch = () => {
    let temp = watch("mBoardRegNo");
    console.log("type", typeof temp);
    let bodyForApi = {
      boardName: watch("mBoardRegName") !== "" ? watch("mBoardRegName") : null,
      registrationDate: watch("marriageBoardRegistrationDate"),
      registrationYear:
        watch("marriageBoardRegisterationYear") !== "" ? watch("marriageBoardRegisterationYear") : null,
      registrationNumber: temp,
    };

    axios
      .post(
        `${urls.MR}/transaction/marriageBoardRegistration/getBySearchParams`,
        bodyForApi,
        // allvalues,
      )
      .then((res) => {
        if (res.status == 200) {
          swal("Success!", "Record Searched successfully !", "success");
          setData(res.data);
          setFlagSearch(true);
        }
      })
      .catch((error) => {
        console.log("133", error);
        swal("Error!", error.response.data.message, "error");
      });
  };

  const getById = (id) => {
    axios
      .get(`${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/getapplicantById?applicationId=${id}`)
      .then((r) => {
        console.log("r.data", r.data);

        let oldAppId = r.data.trnApplicantId;

        console.log(oldAppId, "oldAppId");

        let certificateIssueDateTime;

        axios
          .get(`${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${oldAppId}`)
          .then((re) => {
            certificateIssueDateTime = re.data.certificateIssueDateTime;
            setValue("registrationDate", re.data.registrationDate);
            console.log("re.data", re.data);
          });

        reset(r.data);

        setValue("registrationDate", certificateIssueDateTime);

        setFlagSearch(true);
      });
  };

  useEffect(() => {
    console.log("router?.query?.pageMode", router?.query?.pageMode);
    getById(router?.query?.applicationId);
  }, [router?.query?.pageMode == "View"]);

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <div>
        <Paper
          sx={{
            marginLeft: 2,
            marginRight: 2,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
            border: 1,
            borderColor: "grey.500",
          }}
        >
          <>
            <div className={styles.details}>
              <div className={styles.h1Tag}>
                <h3
                  style={{
                    color: "white",
                    marginTop: "7px",
                  }}
                >
                  {<FormattedLabel id="onlyRMBR" />}

                  {/* Renewal of Marriage Board Registration */}
                </h3>
              </div>
            </div>
            {router?.query?.pageMode != "View" ? (
              <>
                <div>
                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#278bff",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#278bff"
                      // sx={{
                      //   backgroundColor: '0070f3',
                      // }}
                    >
                      <Typography> 1) Marriage Board Reg Number *</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="registerationNo" required />}
                            // label="Marriage Board Reg Number"
                            variant="standard"
                            {...register("mBoardRegNo")}
                            // error={!!errors.aFName}
                            // helperText={errors?.aFName ? errors.aFName.message : null}
                          />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#278bff",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#278bff"
                      // sx={{
                      //   backgroundColor: '0070f3',
                      // }}
                    >
                      <Typography>
                        {" "}
                        2) Marriage Board Reg Name * ,Marriage Board Registration Date *
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mbrName" required />}
                            // label={"Marriage Board Reg Name"}
                            variant="standard"
                            {...register("mBoardRegName")}
                            // error={!!errors.aFName}
                            // helperText={errors?.aFName ? errors.aFName.message : null}
                          />
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          <FormControl sx={{ marginTop: 0 }}>
                            <Controller
                              control={control}
                              name="marriageBoardRegistrationDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 14 }}>
                                        {<FormattedLabel id="mbrDate" required />}
                                        {/* Marriage Board Reg Date */}
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
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
                          </FormControl>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    sx={{
                      marginLeft: "5vh",
                      marginRight: "5vh",
                      marginTop: "2vh",
                      marginBottom: "2vh",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#278bff",
                        color: "white",
                        textTransform: "capitalize",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#278bff"
                      // sx={{
                      //   backgroundColor: '0070f3',
                      // }}
                    >
                      <Typography> 3) Marriage Board Reg Name * , Marriage Board Reg Year * </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            //  disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mbrName" required />}
                            // label={"Marriage Board Reg Name"}
                            variant="standard"
                            {...register("mBoardRegName")}
                            // error={!!errors.aFName}
                            // helperText={errors?.aFName ? errors.aFName.message : null}
                          />
                        </div>

                        <div>
                          <TextField
                            // disabled
                            sx={{ width: 230 }}
                            id="standard-basic"
                            label={<FormattedLabel id="mbrYear" required />}
                            // label={"Marriage Board Reg Year"}
                            variant="standard"
                            {...register("marriageBoardRegisterationYear")}
                          />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>

                <div className={styles.row}>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      // disabled={validateSearch()}
                      onClick={() => {
                        handleSearch();
                      }}
                    >
                      {<FormattedLabel id="search" />}
                      {/* Search */}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.row}>
                  {/* <div className={styles.row}> */}
                  <TextField
                    //  disabled
                    sx={{ width: 300 }}
                    id="standard-basic"
                    disabled={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // defaultValue={"abc"}
                    label={<FormattedLabel id="registrationNumber" required />}
                    variant="standard"
                    {...register("registrationNumber")}
                  />
                  {/* </div> */}
                  {/* <div className={styles.row}> */}
                  <FormControl sx={{ marginTop: 0 }}>
                    <Controller
                      control={control}
                      name="registrationDate"
                      defaultValue={null}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled={true}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 14 }}>
                                {<FormattedLabel id="registrationDate" required />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
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
                  </FormControl>
                  {/* </div> */}
                </div>
              </>
            )}
          </>
        </Paper>
      </div>
      {flagSearch ? <RenewForm data={data} /> : ""}
    </div>
  );
};

export default Index;
