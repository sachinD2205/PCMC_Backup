import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  TextareaAutosize,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Visibility } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";
import router from "next/router";
import moment from "moment";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [agendaDetails, setAgendaDetails] = useState([]);
  const [comittees1, setcomittees1] = useState([]);
  const [showDocketModel, setShowDocketModel] = useState(false);

  const [particularRow, setParticularRow] = useState(null);

  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
    if (comittees1?.length > 0) {
      setLoading(true);
      axios
        .get(`${urls.MSURL}/trnPrepareMeetingAgenda/getAll`)
        .then((r) => {
          if (r.status == 200 || r.status == 201) {
            setAgendaDetails(
              r?.data?.prepareMeetingAgenda
                ?.filter((o) => o?.isMeetingScheduled == false)
                .map((r, i) => ({
                  id: r.id,
                  srNo: i + 1,
                  agendaNo: r.agendaNo,
                  comitteeEn: comittees1?.find((obj) => obj.id === r.committeeId)?.comitteeEn,
                  comitteeMr: comittees1?.find((obj) => obj.id === r.committeeId)?.comitteeMr,
                  ///////////////////////////////////////////
                  agendaOutwardDate: r.agendaOutwardDate,
                  agendaOutwardNo: r.agendaOutwardNo,
                  agendaSubject: r.agendaSubject,
                  coveringLetterNote: r.coveringLetterNote,
                  coveringLetterSubject: r.coveringLetterSubject,
                  isMeetingScheduled: r.isMeetingScheduled,
                  tip: r.tip,
                  /////////////////////////////////
                  agendaSubjectDao: r.agendaSubjectDao,
                })),
            );
            setLoading(false);
          } else {
            sweetAlert({
              title: "ERROR!",
              text: `Something Went Wrong!`,
              icon: "error",
              buttons: {
                confirm: {
                  text: "OK",
                  visible: true,
                  closeModal: true,
                },
              },
              closeOnClickOutside: false,
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
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
            closeOnClickOutside: false,
            dangerMode: true,
          });
          setLoading(false);
        });
    }
  }, [comittees1]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAll`)
      .then((r) => {
        if (r.status == 200 || r.status == 201) {
          setcomittees1(
            r?.data?.committees?.map((row) => ({
              id: row.id,
              comitteeEn: row.committeeName,
              comitteeMr: row.committeeNameMr,
            })),
          );
          setLoading(false);
        } else {
          sweetAlert({
            title: "ERROR!",
            text: `Something Went Wrong!`,
            icon: "error",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
            closeOnClickOutside: false,
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
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
          closeOnClickOutside: false,
          dangerMode: true,
        });
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerClassName: styles.header_cell,
      minWidth: 100,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "agendaNo",
      headerName: <FormattedLabel id="agendaNo" />,
      headerClassName: styles.header_cell,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            <strong> {params?.row?.agendaNo}</strong>
          </>
        );
      },
    },
    {
      field: language == "en" ? "comitteeEn" : "comitteeMr",
      headerName: <FormattedLabel id="committeeName" />,
      headerClassName: styles.header_cell,
      minWidth: 350,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        console.log(":100params", params);
        return (
          <>
            <strong> {language == "en" ? params?.row?.comitteeEn : params?.row?.comitteeMr}</strong>
          </>
        );
      },
    },
    {
      field: "coveringLetterSubject",
      headerName: <FormattedLabel id="coveringLetterSubject" />,
      headerClassName: styles.header_cell,
      minWidth: 350,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "isMeetingScheduled",
      headerName: <FormattedLabel id="meetingScheduled" />,
      headerClassName: styles.header_cell,
      minWidth: 350,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {language == "en" ? (
              <strong style={{ color: "red" }}>Not Scheduled</strong>
            ) : (
              <strong style={{ color: "red" }}>शेड्यूल केलेले नाही</strong>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      headerClassName: styles.header_cell,
      width: 130,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
            <IconButton
              sx={{ color: "#096dd9" }}
              onClick={() => {
                alert(params?.row?.agendaNo);
                // setParticularRow(params?.row);
                console.log(":10000", params?.row);
                setParticularRow(params?.row);
                setShowDocketModel(true);
              }}
            >
              <Tooltip title={language == "en" ? "VIEW THIS AGENDA'S INFO" : "या अजेंडाची माहिती पहा"}>
                <Visibility />
              </Tooltip>
            </IconButton>
            {/* /////////////////////////// */}
            <IconButton
              sx={{ color: "#096dd9" }}
              onClick={() => {
                router.push({
                  pathname: "/municipalSecretariatManagement/transaction/meetingScheduling",
                  query: {
                    agendaNo: params?.row?.agendaNo,
                  },
                });
              }}
            >
              <Tooltip
                title={
                  language == "en"
                    ? "SCHEDULE MEETING AGAINST THIS AGENDA"
                    : "या अजेंडाच्या विरोधात बैठकीचे वेळापत्रक"
                }
              >
                <ScheduleIcon />
              </Tooltip>
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ margin: "30px" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "1%",
            marginBottom: "3%",
          }}
        >
          <Box
            className={styles.details}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "white",
              fontSize: 19,
              fontWeight: 500,
              borderRadius: 100,
            }}
          >
            <strong>
              <FormattedLabel id="prepareAgenda" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
            <CircularProgress color="success" />
          </div>
        ) : (
          <>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <Grid item xs={12} md={9} lg={9}></Grid>
              <Grid
                item
                xs={12}
                md={3}
                lg={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<AddCircleIcon />}
                  onClick={() =>
                    router.push({
                      pathname: "/municipalSecretariatManagement/transaction/agenda/prepareAgenda",
                    })
                  }
                  size="small"
                >
                  {<FormattedLabel id="prepareAgenda" />}
                </Button>
              </Grid>
            </Grid>
            <DataGrid
              autoHeight
              sx={{
                overflowY: "scroll",

                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
                "& .MuiSvgIcon-root": {
                  color: "black", // change the color of the check mark here
                },
              }}
              disableColumnFilter
              disableColumnSelector
              // hideFooterPagination
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  disableExport: true,
                  disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                  printOptions: { disableToolbarButton: true },
                },
              }}
              density="compact"
              rows={agendaDetails || []}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5]}
            />
            {/* //////////////////MODEL/////////////// */}
            <Modal
              open={showDocketModel}
              sx={{
                padding: 5,
                display: "flex",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <Box
                sx={{
                  width: "90%",
                  bgcolor: "background.paper",
                  // p: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  border: "2px solid black",
                }}
              >
                <Box
                  className={styles.details}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "20%",
                    height: "auto",
                    overflow: "auto",
                    padding: "0.5%",
                    color: "white",
                    fontSize: 15,
                    fontWeight: 500,
                    borderRadius: 100,
                    border: "1px solid black",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <strong>AGENDA PREVIEW</strong>
                  </div>
                </Box>
                <form style={{ maxHeight: "calc(100vh - 170px)", overflowY: "auto" }}>
                  {/* {renderFormFields()} */}
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "1% 7%",
                      }}
                    >
                      <TextField
                        disabled
                        sx={{ width: "150px" }}
                        label={<FormattedLabel id="agendaOutwardDate" />}
                        variant="standard"
                        value={moment(particularRow?.agendaOutwardDate).format("DD-MM-YYYY")}
                      />

                      <TextField
                        disabled
                        sx={{ width: "400px" }}
                        label={<FormattedLabel id="agendaOutwardNo" />}
                        variant="standard"
                        value={particularRow?.agendaOutwardNo}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "1% 7%",
                      }}
                    >
                      <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                        <strong style={{ fontSize: "medium" }}>
                          {<FormattedLabel id="agendaSubject" />}
                        </strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.agendaSubject}
                        />
                      </Paper>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "1% 7%",
                      }}
                    >
                      <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                        <strong style={{ fontSize: "medium" }}>
                          {<FormattedLabel id="coveringLetterNote" />}
                        </strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.coveringLetterNote}
                        />
                      </Paper>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "1% 7%",
                      }}
                    >
                      <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                        <strong style={{ fontSize: "medium" }}>
                          {<FormattedLabel id="coveringLetterSubject" />}
                        </strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.coveringLetterSubject}
                        />
                      </Paper>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "1% 7%",
                      }}
                    >
                      <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                        <strong style={{ fontSize: "medium" }}>{<FormattedLabel id="tip" />}</strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.tip}
                        />
                      </Paper>
                    </Grid>

                    {language == "en" ? (
                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled
                          sx={{ width: "230px" }}
                          label={<FormattedLabel id="committeeName" />}
                          variant="standard"
                          value={particularRow?.comitteeEn}
                        />
                      </Grid>
                    ) : (
                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          disabled
                          sx={{ width: "230px" }}
                          label={<FormattedLabel id="committeeName" />}
                          variant="standard"
                          value={particularRow?.comitteeMr}
                        />
                      </Grid>
                    )}

                    {/* /////////////////////////////// */}
                    {particularRow?.agendaSubjectDao?.length > 0
                      ? particularRow?.agendaSubjectDao?.map((o, i) => {
                          return (
                            <>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "left",
                                  alignItems: "center",
                                  flexDirection: "column",
                                  margin: "1% 7%",
                                }}
                              >
                                <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                                  <strong style={{ fontSize: "medium" }}>{`Subject : ${i + 1}`}</strong>
                                  <TextareaAutosize
                                    disabled
                                    style={{ overflow: "auto" }}
                                    className={styles.bigText}
                                    value={o?.subject}
                                  />
                                </Paper>
                              </Grid>
                              {/* /////////////////////////////// */}
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "left",
                                  alignItems: "center",
                                  flexDirection: "column",
                                  margin: "1% 7%",
                                }}
                              >
                                <Paper elevation={1} style={{ width: "100%", borderRadius: "10px" }}>
                                  <strong style={{ fontSize: "medium" }}>{`Subject Summary : ${
                                    i + 1
                                  }`}</strong>
                                  <TextareaAutosize
                                    disabled
                                    style={{ overflow: "auto" }}
                                    className={styles.bigText}
                                    value={o?.subjectSummary}
                                  />
                                </Paper>
                              </Grid>
                              <br />
                            </>
                          );
                        })
                      : ""}
                  </Grid>
                </form>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => setShowDocketModel(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Modal>
          </>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
