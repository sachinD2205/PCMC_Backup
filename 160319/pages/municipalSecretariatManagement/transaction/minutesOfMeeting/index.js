import React, { useEffect, useState } from "react";
import router from "next/router";
import Head from "next/head";
import styles from "./minutesOfMeeting.module.css";

import URLs from "../../../../URLS/urls";
import axios from "axios";
import sweetAlert from "sweetalert";
// import moment from 'moment'
import * as yup from "yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  Paper,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  TextareaAutosize,
  Checkbox,
  Button,
  IconButton,
  Slide,
} from "@mui/material";
import { ExitToApp, Save, Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [committeeName, setCommitteeName] = useState([]);
  const [corporators, setCorporators] = useState([]);
  const [onHoldSubjects, setOnHoldSubjects] = useState(false);
  const [cheapModal, setCheapModal] = useState(false);
  const [docketDesc, setDocketDesc] = useState("");
  const [attendanceMethod, setAttendanceMethod] = useState("");
  const [commId, setCommId] = useState();
  const [dockets, setDockets] = useState([
    {
      srNo: 1,
      id: 1,
      subjectSerialNumber: "",
      subject: "",
      description: "",
      status: "",
      suchak: 1,
      anumodak: 1,
    },
  ]);
  // const [table, setTable] = useState([])

  //MOM Details
  let momSchema = yup.object().shape({
    // agendaNo: yup.string().required('Please enter an agenda no.'),
    // verdict: yup.string().required('Please enter an agenda no.'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    reset,
    control,
    watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(momSchema),
  });

  useEffect(() => {
    //Get Committee
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
      .then((res) => {
        console.log("Committee: ", res.data.committees);
        setCommitteeName(
          res.data.committees.map((j) => ({
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

    //Get Corporators
    axios
      .get(`${URLs.MSURL}/mstDefineCorporators/getAll`)
      .then((res) => {
        setCorporators(
          res.data.corporator.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            fullNameEn: j.firstName + j.middleName + j.lastname,
            fullNameMr: j.firstNameMr + j.middleNameMr + j.lastnameMr,
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

  useEffect(() => {
    if (router.query.agendaNo) {
      //Get Agenda
      axios
        .get(`${URLs.MSURL}/trnPrepareMeetingAgenda/getByAgendaNo?agendaNo=${router.query.agendaNo}`)
        .then((res) => {
          if (res.data.prepareMeetingAgenda.length <= 0) {
            sweetAlert({
              title: "OOPS!",
              text: "No Agenda found with that id",
              icon: "warning",
              buttons: {
                confirm: {
                  text: "OK",
                  visible: true,
                  closeModal: true,
                },
              },
            });
          } else {
            console.log(res.data);

            //setting dockets for final approval or onhold
            setDockets(
              res.data.prepareMeetingAgenda[0].trnNewDocketEntryDao.map((obj, index) => ({
                srNo: index + 1,
                id: obj.id,
                subject: obj.subject,
                subjectSerialNumber: obj.subjectSerialNumber,
                description: obj.subjectSummary,
                status: "APPROVE",
              })),
            );

            //setting commId
            setCommId(res.data.prepareMeetingAgenda[0].committeeId);

            //setting attendanceMethod
            setAttendanceMethod(
              res.data.prepareMeetingAgenda[0].trnMarkAttendanceProceedingAndPublishDao[0]
                .attendanceCaptureFrom,
            );

            reset({
              subject: res.data.prepareMeetingAgenda[0].agendaSubject,
              subjectSummary: res.data.prepareMeetingAgenda[0].agendaDescription,
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
    }
  }, []);

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 80,
    },
    {
      headerClassName: "cellColor",

      field: "subjectSerialNumber",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectSerialNumber" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "subject",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      width: 300,
    },
    {
      headerClassName: "cellColor",

      field: "description",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="description" />,
      width: 180,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="contained"
              onClick={() => {
                setDocketDesc(dockets[params.row.srNo - 1]["description"]);
                setCheapModal(!cheapModal);
              }}
            >
              <FormattedLabel id="preview" />
            </Button>
          </>
        );
      },
    },
    {
      headerClassName: "cellColor",

      field: "suchak",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="nameOfSuchak" />,
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Select
              variant="standard"
              // @ts-ignore
              // defaultValue={corporators[0]?.id}
              sx={{
                width: 200,
                textAlign: "center",
              }}
              onChange={(event) => {
                dockets[params.row.srNo - 1]["suchak"] = event.target.value;
              }}
            >
              {corporators &&
                corporators.map((value, index) => (
                  <MenuItem
                    key={index}
                    value={
                      //@ts-ignore
                      value.id
                    }
                  >
                    {language == "en"
                      ? //@ts-ignore
                        value.fullNameEn
                      : // @ts-ignore
                        value?.fullNameMr}
                  </MenuItem>
                ))}
            </Select>
          </>
        );
      },
    },
    {
      headerClassName: "cellColor",

      field: "anumodak",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="nameOfAnumodak" />,
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Select
              variant="standard"
              // @ts-ignore
              // defaultValue={corporators[0]?.id}
              sx={{
                width: 200,
                textAlign: "center",
              }}
              onChange={(event) => {
                dockets[params.row.srNo - 1]["anumodak"] = event.target.value;
              }}
            >
              {corporators &&
                corporators.map((value, index) => (
                  <MenuItem
                    key={index}
                    value={
                      //@ts-ignore
                      value.id
                    }
                  >
                    {language == "en"
                      ? //@ts-ignore
                        value.fullNameEn
                      : // @ts-ignore
                        value?.fullNameMr}
                  </MenuItem>
                ))}
            </Select>
          </>
        );
      },
    },
    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Select
              variant="standard"
              defaultValue={dockets[params.row.srNo - 1]["status"]}
              sx={{
                width: 200,
                textAlign: "center",
              }}
              onChange={(event) => {
                // @ts-ignore
                dockets[params.row.srNo - 1]["status"] = event.target.value;
              }}
            >
              <MenuItem key={3} value={"APPROVE"}>
                {language === "en" ? "Approve" : "मंजूर"}
              </MenuItem>
              <MenuItem key={2} value={"ONHOLD"}>
                {language === "en" ? "On Hold" : "होल्ड"}
              </MenuItem>
            </Select>
          </>
        );
      },
    },
  ];

  const getAgenda = () => {
    const agendaNo = watch("agendaNo");

    //Get Agenda
    axios
      .get(`${URLs.MSURL}/trnPrepareMeetingAgenda/getByAgendaNoAgendaNoDocket?agendaNo=${agendaNo}`)
      .then((res) => {
        if (res.data.prepareMeetingAgenda.length <= 0) {
          sweetAlert({
            title: "OOPS!",
            text: "No Agenda found with that id",
            icon: "warning",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
          });
        } else {
          //setting dockets for final approval or onhold
          setDockets(
            res.data.prepareMeetingAgenda[0].trnNewDocketEntryDao.map((obj, index) => ({
              srNo: index + 1,
              id: obj.id,
              subject: obj.subject,
              subjectSerialNumber: obj.subjectSerialNumber,
              description: obj.subjectSummary,
              status: "APPROVED",
            })),
          );

          //setting commId
          setCommId(res.data.prepareMeetingAgenda[0].committeeId);

          //setting attendanceMethod
          setAttendanceMethod(
            res.data.prepareMeetingAgenda[0].trnMarkAttendanceProceedingAndPublishDao[0]
              .attendanceCaptureFrom,
          );

          reset({
            subject: res.data.prepareMeetingAgenda[0].agendaSubject,
            subjectSummary: res.data.prepareMeetingAgenda[0].agendaDescription,
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

  const submit = (data) => {
    const { attendanceCapturedFrom, committeeId, subject, subjectSummary, ...rest } = data;

    let agendaNo = router?.query?.agendaNo;

    let finalDockets = dockets.map((obj) => ({
      docketid: obj.id,
      status: obj.status,
      shuchak: obj.suchak,
      anumodan: obj.anumodak,
    }));

    const bodyForAPI = { ...rest, agendaNo, momAgendaSubjectDao: finalDockets };

    axios
      .post(`${URLs.MSURL}/trnMom/save`, bodyForAPI)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          sweetAlert("Success!", "Honorarium Process for the corporator done successfully!", "success");
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

  return (
    <>
      <Head>
        <title>Minutes of Meeting</title>
      </Head>
      <Paper className={styles.main} style={{ position: "relative" }}>
        <div className={styles.title}>Minutes of Meeting</div>
        <form className={styles.main} onSubmit={handleSubmit(submit)}>
          <div
            className={styles.row}
            style={{
              justifyContent: commId && attendanceMethod ? "space-between" : "center",
            }}
          >
            <div className={styles.alignContainer}>
              <TextField
                disabled={router.query.agendaNo ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="agendaNo" />}
                variant="standard"
                {...register("agendaNo")}
                defaultValue={router.query.agendaNo ?? ""}
              />

              {!router.query.agendaNo && (
                // <Button
                //   variant='contained'
                //   color='primary'
                //   endIcon={<Search />}
                //   onClick={() => getAgenda()}
                // >
                //   {<FormattedLabel id='search' />}
                // </Button>
                <IconButton
                  disabled={watch("agendaNo") !== "" ? false : true}
                  className={styles.searchIcon}
                  onClick={() => {
                    getAgenda();
                  }}
                >
                  <Search />
                </IconButton>
              )}
            </div>
            {attendanceMethod && commId && (
              <>
                <FormControl disabled variant="standard" error={!!error.attendanceCapturedFrom}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="attendanceMethod" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "230px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={attendanceMethod}
                        label="attendanceCapturedFrom"
                      >
                        <MenuItem key={1} value="BIOMETRIC">
                          {language === "en" ? "Biometric" : "बायोमेट्रिक"}
                        </MenuItem>
                        <MenuItem key={2} value="ONLINE">
                          {language === "en" ? "Online" : "ऑनलाइन"}
                        </MenuItem>
                      </Select>
                    )}
                    name="attendanceCapturedFrom"
                    control={control}
                  />
                  <FormHelperText>
                    {error?.attendanceCapturedFrom ? error.attendanceCapturedFrom.message : null}
                  </FormHelperText>
                </FormControl>
                <FormControl disabled variant="standard" error={!!error.committeeId}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="committeeName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "230px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={commId}
                        label="committeeId"
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
                              {language == "en"
                                ? //@ts-ignore
                                  value.committeeNameEn
                                : // @ts-ignore
                                  value?.committeeNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="committeeId"
                    control={control}
                  />
                  <FormHelperText>{error?.committeeId ? error.committeeId.message : null}</FormHelperText>
                </FormControl>
              </>
            )}
          </div>
          <TextareaAutosize
            color="neutral"
            disabled
            minRows={1}
            maxRows={3}
            placeholder="Subject"
            className={styles.bigText}
            {...register("subject")}
            style={{ opacity: "0.5" }}
          />
          <TextareaAutosize
            color="neutral"
            disabled
            minRows={6}
            maxRows={3}
            placeholder="Subject Summary"
            className={styles.bigText}
            {...register("subjectSummary")}
            style={{ opacity: "0.5" }}
          />
          <TextareaAutosize
            color="neutral"
            disabled={false}
            minRows={10}
            maxRows={3}
            placeholder="Add Proceeding/Verdict"
            className={styles.bigText}
            {...register("verdict")}
          />

          <div className={styles.alignContainer} style={{ marginTop: "20px" }}>
            <span className={styles.checkBoxLabel}>{<FormattedLabel id="onHoldSubjects" />}</span>
            <Checkbox
              onChange={() => {
                setOnHoldSubjects(!onHoldSubjects);
              }}
            />
          </div>
          {onHoldSubjects && (
            <DataGrid
              autoHeight
              sx={{
                marginTop: "5vh",
                marginBottom: "3vh",

                "& .cellColor": {
                  backgroundColor: "#1976d2",
                  color: "white",
                },
              }}
              rows={dockets}
              //@ts-ignore
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          )}
          <div className={styles.buttons}>
            <Button variant="contained" type="submit" endIcon={<Save />}>
              <FormattedLabel id="save" />
            </Button>
            {/* <Button
              variant='contained'
              // endIcon={<Save />}
            >
              Publish
            </Button> */}
          </div>
        </form>
        {cheapModal && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)",

              position: "absolute",

              top: "0%",
              left: "0%",
              paddingTop: "30%",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper className={styles.main} sx={{ width: "60%", minHeight: "30%", borderRadius: "25px" }}>
              <div className={styles.row} style={{ margin: "0%", justifyContent: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "large" }}>
                  <FormattedLabel id="subjectSummary" />
                </span>
              </div>
              <TextareaAutosize
                className={styles.bigText}
                style={{ opacity: "0.5" }}
                disabled
                placeholder="Subject Summary"
                value={docketDesc}
                color="neutral"
                minRows={5}
                maxRows={8}
              />
              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setCheapModal(false);
                  }}
                  color="error"
                  endIcon={<ExitToApp />}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </Paper>
          </div>
        )}
      </Paper>
    </>
  );
};

export default Index;
