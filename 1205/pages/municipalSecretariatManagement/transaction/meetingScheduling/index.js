import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  LinearProgress,
  ThemeProvider,
  InputAdornment,
  TextareaAutosize,
  Modal,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import Schema from "../../../containers/schema/propertyTax/masters/amenitiesMaster"
import moment from "moment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css";
import theme from "../../../../theme";
import { TimePicker } from "@mui/x-date-pickers";
import { useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [openDataGrid, setOpenDataGrid] = useState(false);
  const [showSaveButton, setshowSaveButton] = useState(true);
  const [committeeNames, setCommitteeNames] = useState([]);
  const [savingFormDataOnFIrstSubmit, setSavingFormDataOnFirstSubmit] = useState(null);

  const firstUpdate = useRef(true);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const router = useRouter();

  const language = useSelector((store) => store.labels.language);
  //////////////////////////////////partyNames ADDED IN MEETING SCHEDULE  TABLE////////////////////////////

  // // getGenders
  const getCommitteeNames = () => {
    axios.get(`${urls.MSURL}/mstDefineCommittees/getAll`).then((r) => {
      setCommitteeNames(
        r.data.committees.map((row) => ({
          id: row.id,
          committee: row.committeeName,
        })),
      );
    });
  };
  useEffect(() => {
    getCommitteeNames();
  }, []);

  useEffect(() => {
    console.log(":50", committeeNames);
  }, [committeeNames]);

  // Get Table - Data
  const getAllAgendaNumbers = (_pageSize = 10, _pageNo = 0) => {
    let _agendaNo = watch("agendaNo").toString();
    console.log("1000", typeof _agendaNo);

    axios
      .get(`${urls.MSURL}/trnPrepareMeetingAgenda/getByAgendaNo?agendaNo=${_agendaNo}`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log(";res", res);

        let result = res.data?.prepareMeetingAgenda;
        let _res = result?.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: i + 1,
            agendaNo: val.agendaNo,
            agendaDescription: val.agendaDescription,
            agendaOutwardDate: val.agendaOutwardDate,
            agendaOutwardNo: val.agendaOutwardNo,
            agendaSubject: val.agendaSubject,
            committeeId: val.committeeId,
            committeeName: committeeNames?.find((obj) => obj.id === val.committeeId)?.committee,
            coveringLetterNote: val.coveringLetterNote,
            coveringLetterSubject: val.coveringLetterSubject,
            karyakramPatrikaNo: val.karyakramPatrikaNo,
            meetingDate: val.meetingDate,
            tip: val.tip,
            // fromDate: moment(val.fromDate).format("llll"),
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        setOpenDataGrid(!openDataGrid);
      });
  };

  /////////////////////////////
  const getAllAgendaNumbersByRouter = (_pageSize = 10, _pageNo = 0) => {
    let _agendaNoByRouter = router?.query?.agendaNo?.toString();

    axios
      .get(`${urls.MSURL}/trnPrepareMeetingAgenda/getByAgendaNo?agendaNo=${_agendaNoByRouter}`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log(";res", res);

        let result = res?.data?.prepareMeetingAgenda;
        let _res = result?.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: i + 1,
            agendaDescription: val.agendaDescription,
            agendaNo: val.agendaNo,
            agendaOutwardDate: val.agendaOutwardDate,
            agendaOutwardNo: val.agendaOutwardNo,
            agendaSubject: val.agendaSubject,
            committeeId: val.committeeId,
            committeeName: committeeNames?.find((obj) => obj.id === val.committeeId)?.committee,
            coveringLetterNote: val.coveringLetterNote,
            coveringLetterSubject: val.coveringLetterSubject,
            karyakramPatrikaNo: val.karyakramPatrikaNo,
            meetingDate: val.meetingDate,

            tip: val.tip,
            // fromDate: moment(val.fromDate).format("llll"),
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        setOpenDataGrid(!openDataGrid);
      });
  };

  useEffect(() => {
    if (router?.query?.agendaNo) {
      setValue("agendaNo", router?.query?.agendaNo);
      if (committeeNames?.length > 0) {
        getAllAgendaNumbersByRouter();
      }
    }
  }, [committeeNames, router?.query?.agendaNo]);

  // console.log(":121", data.rows[0].id)
  useEffect(() => {
    if (router?.query?.agendaNo) {
      setSlideChecked(true);
      setIsOpenCollapse(true);
    } else {
      if (data?.rows?.length !== 0) {
        setSlideChecked(true);
        setIsOpenCollapse(true);
      } else if (watch("agendaNo") && data?.rows?.length === 0) {
        alert("else");
        sweetAlert({
          title: "Oops! No data match",
          text: "Try with another Agenda Number",
          icon: "warning",
          // buttons: ["Ok"],
          dangerMode: true,
        }).then((will) => {
          if (will) {
            setSlideChecked(false);
            setIsOpenCollapse(false);
          } else {
            setSlideChecked(false);
            setIsOpenCollapse(false);
          }
        });
      }
    }
  }, [openDataGrid]);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    setSavingFormDataOnFirstSubmit(formData);
    setIsModalOpen(true);
  };

  const finalSubmit = () => {
    // Save - DB

    console.log("savingFormDataOnFIrstSubmit", savingFormDataOnFIrstSubmit);

    const meetingDate = moment(watch("meetingDate")).format("YYYY-MM-DD");
    const outwardDate = moment(watch("outwardDate")).format("YYYY-MM-DD");
    const meetingTime = moment(watch("meetingTime")).format("hh:mm");
    const prepareMeetingAgendaId = data?.rows[0]?.id;
    const finalBodyForApi = {
      agendaNo: router?.query?.agendaNo,
      activeFlag: "Y",
      prepareMeetingAgendaId,
      outwardNo: watch("outwardNo"),
      outwardDate,
      meetingDate,
      meetingPlace: watch("meetingPlace"),
      meetingTime,
    };

    console.log(":420", finalBodyForApi);

    sweetAlert({
      title: "Are you sure?",
      text: "If you clicked Yes your Meeting get Scheduled otherwise not!",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((will) => {
      if (will) {
        axios
          .post(`${urls.MSURL}/trnMeetingSchedule/save`, finalBodyForApi)
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert("Saved!", "Meeting Scheduled successfully !", "success").then((will) => {
                if (will) {
                  setIsModalOpen(false);
                  setButtonInputState(false);
                  setSlideChecked(false);
                  setIsOpenCollapse(!isOpenCollapse);
                  cancellButton();
                  router.push({
                    pathname: "/municipalSecretariatManagement/transaction/calender",
                  });
                }
              });
            }
          })
          .catch((error) => {
            if (error.request.status === 500) {
              swal(error.response.data.message, {
                icon: "error",
              });
              setButtonInputState(false);
            } else {
              swal("Something went wrong!", {
                icon: "error",
              });
              setButtonInputState(false);
            }
            // console.log("error", error);
          });
      } else {
        sweetAlert("Your Meeting is still not Scheduled");
      }
    });
  };

  // cancell Button
  const cancellButton = () => {
    return (
      setValue("meetingDate", null),
      setValue("meetingTime", null),
      setValue("meetingPlace", ""),
      setValue("description", ""),
      setValue("outwardDate", null),
      setValue("outwardNo", "")
    );
  };

  // USE  EFFECT

  useEffect(() => {
    if (
      watch("agendaNo") &&
      watch("meetingPlace") &&
      watch("meetingDate") &&
      watch("meetingTime") &&
      watch("description")
    ) {
      return setshowSaveButton(false);
    } else {
      return setshowSaveButton(true);
    }
  }, [
    watch("agendaNo"),
    watch("meetingPlace"),
    watch("meetingDate"),
    watch("meetingTime"),
    watch("description"),
  ]);

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 100,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "agendaNo",
      headerName: <FormattedLabel id="agendaNo" />,
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "committeeName",
      headerName: <FormattedLabel id="committeeName" />,
      minWidth: 300,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "coveringLetterNote",
      headerName: <FormattedLabel id="coveringLetterNote" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "coveringLetterSubject",
      headerName: <FormattedLabel id="coveringLetterSubject" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  //////////////////////////////////////////////
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Row

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
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
                <FormattedLabel id="meetingSchedule" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          <div>
            <form onSubmit={handleSubmit(onSubmitForm)} autoComplete="off">
              {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {router?.query?.agendaNo ? (
                    <TextField
                      disabled
                      autoFocus
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="agendaNo" />}
                      variant="standard"
                      {...register("agendaNo")}
                    />
                  ) : (
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="agendaNo" />}
                      variant="standard"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                if (committeeNames.length > 0 && watch("agendaNo")) {
                                  getAllAgendaNumbers();
                                } else {
                                  sweetAlert("Please Enter the Agenda Number");
                                }
                              }}
                              style={{
                                // width: "32vw",
                                background: "none",
                              }}
                              edge="end"
                            >
                              <SearchIcon style={{ color: "blue", fontSize: 30, fontWeight: "bold" }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      {...register("agendaNo")}
                      error={!!errors.agendaNo}
                      helperText={errors?.agendaNo ? errors.agendaNo.message : null}
                    />
                  )}
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    // disabled={data?.rows?.length !== 0 ? false : true}
                    disabled={watch("agendaNo") ? false : true}
                    style={{ backgroundColor: "white" }}
                    InputLabelProps={{ shrink: watch("meetingPlace") ? true : false }}
                    id="outlined-basic"
                    label={<FormattedLabel id="meetingPlace" />}
                    variant="standard"
                    {...register("meetingPlace")}
                    error={!!errors.meetingPlace}
                    helperText={errors?.meetingPlace ? errors.meetingPlace.message : null}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl style={{ backgroundColor: "white" }} error={!!errors.meetingDate}>
                    <Controller
                      control={control}
                      name="meetingDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disablePast
                            disabled={watch("agendaNo") ? false : true}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="meetingDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                InputLabelProps={
                                  {
                                    // style: {
                                    //   fontSize: 12,
                                    //   marginTop: 3,
                                    // },
                                  }
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.meetingDate ? errors.meetingDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl style={{ marginTop: 10 }} error={!!errors.meetingTime}>
                    <Controller
                      format="HH:mm"
                      control={control}
                      name="meetingTime"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <TimePicker
                            disabled={watch("agendaNo") ? false : true}
                            label={
                              <span style={{ fontSize: 16 }}>{<FormattedLabel id="meetingTime" />}</span>
                            }
                            value={field.value || null}
                            onChange={(time) => field.onChange(time)}
                            selected={field.value}
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
                    <FormHelperText>{errors?.meetingTime ? errors.meetingTime.message : null}</FormHelperText>
                  </FormControl>
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
                    <span style={{ fontSize: "medium" }}>{<FormattedLabel id="description" />}</span>
                    <TextareaAutosize
                      disabled={watch("agendaNo") ? false : true}
                      style={{ overflow: "auto" }}
                      className={styles.bigText}
                      {...register("description")}
                    />
                  </Paper>
                </Grid>
              </Grid>
              {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // sx={{ marginRight: 8 }}
                    disabled={showSaveButton}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                    style={{ borderRadius: "20px" }}
                    size="small"
                  >
                    {language === "en" ? btnSaveText : btnSaveTextMr}
                  </Button>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // sx={{ marginRight: 8 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                    style={{ borderRadius: "20px" }}
                    size="small"
                  >
                    {<FormattedLabel id="clear" />}
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ width: "auto" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ChevronLeftIcon />}
                      onClick={() =>
                        router.push({
                          pathname: "/municipalSecretariatManagement/transaction/agenda",
                        })
                      }
                      size="small"
                    >
                      {<FormattedLabel id="back" />}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </div>

          {/* <Grid
            container
            style={{ padding: "10px" }}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={9}></Grid>
            <Grid
              item
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  })
                  setEditButtonInputState(true)
                  setDeleteButtonState(true)
                  setBtnSaveText("Save")
                  setBtnSaveTextMr("जतन करा")
                  setButtonInputState(true)
                  setSlideChecked(true)
                  setIsOpenCollapse(!isOpenCollapse)
                }}
              >
                {<FormattedLabel id="add" />}
              </Button>
            </Grid>
          </Grid> */}

          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
                <DataGrid
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
                  disableDensitySelector
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
                  autoHeight={true}
                  // rowHeight={50}
                  pagination
                  paginationMode="server"
                  // loading={data.loading}
                  rowCount={data?.totalRows}
                  rowsPerPageOptions={data?.rowsPerPageOptions}
                  page={data?.page}
                  pageSize={data?.pageSize}
                  rows={data?.rows || []}
                  columns={columns}
                  onPageChange={(_data) => {
                    getAllAgendaNumbers(data?.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getAllAgendaNumbers(_data, data?.page);
                  }}
                />
              </Box>
            </Slide>
          )}
          {/* ////////////////////////////////// */}

          <Modal
            title="OUTWARD DATE & OUTWARD NO. MODAL"
            open={isModalOpen}
            onOk={true}
            footer=""
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                height: "30vh",
                width: "40%",
                backgroundColor: "white",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                borderTop: "8px solid #1976D2",
                borderRadius: "24px",
                borderLeft: "1px solid #1976D2 ",
                borderRight: "1px solid #1976D2 ",
                borderBottom: "3px solid #1976D2",
              }}
            >
              <Grid
                container
                spacing={1}
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label={<FormattedLabel id="outwardNo" />}
                    variant="standard"
                    {...register("outwardNo")}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl style={{ backgroundColor: "white" }}>
                    <Controller
                      control={control}
                      name="outwardDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disablePast
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="outwardDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              {/* //////////////////////////////////////// */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                  gap: 20,
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={2}
                  md={2}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ width: "auto" }}>
                    <Button
                      variant="contained"
                      color="success"
                      // style={{ backgroundColor: "#1976D2" }}
                      endIcon={<SaveIcon />}
                      onClick={finalSubmit}
                      size="small"
                    >
                      {<FormattedLabel id="save" />}
                    </Button>
                  </Paper>
                </Grid>

                {/* ////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={2}
                  md={2}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ width: "auto" }}>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#1976D2" }}
                      endIcon={<ChevronLeftIcon />}
                      onClick={() => setIsModalOpen(false)}
                      size="small"
                    >
                      {<FormattedLabel id="back" />}
                    </Button>
                  </Paper>
                </Grid>
              </div>
            </Box>
          </Modal>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
