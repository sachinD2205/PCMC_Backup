import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/timeSlots";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[equipmentCharges].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import { Watch } from "@mui/icons-material";
import { Typography } from "antd";

const TimeSlots = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const language = useSelector((state) => state.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [loading, setLoading] = useState(false);

  const [auditoriums, setAuditoriums] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getTimeSlots();
  }, [auditoriums]);

  useEffect(() => {
    getAuditorium();
    getShifts();
  }, []);

  const getTimeSlots = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstTimeSlots/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: "desc",
        },
      })
      .then((res) => {
        console.log(";res", res);
        setLoading(false);
        let result = res.data.mstTimeSlotsList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            activeFlag: val.activeFlag,
            srNo: _pageSize * _pageNo + i + 1,
            slotId: val.slotId ? val.slotId : "-",
            slotDescription: val.slotDescription ? val.slotDescription : "-",
            from: val.slotFrom ? moment(val.slotFrom).format("DD/MM/YYYY hh:mm A") : "-",
            id: val.id,
            to: val.slotTo ? moment(val.slotTo).format("DD/MM/YYYY hh:mm A") : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            shift: val.shift
              ? shifts?.find((obj) => {
                  return obj?.id == Number(val.shift);
                })?.shift
              : "-",
            auditorium: val.auditoriumKey
              ? auditoriums?.find((obj) => {
                  return obj?.id == Number(val.auditoriumKey);
                })?.auditoriumNameEn
              : "-",
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast("Something went wrong", {
          type: "error",
        });
      });
  };

  const getAuditorium = () => {
    axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
      console.log("respe", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          id: row.id,
          auditoriumNameEn: row.auditoriumNameEn,
          auditoriumNameMr: row.auditoriumNameMr,
        })),
      );
    });
  };

  const getShifts = () => {
    axios.get(`${urls.PABBMURL}/mstEventHour/getAll`).then((r) => {
      console.log("respe shift", r);
      setShifts(
        r.data.mstEventHourList.map((row, index) => ({
          id: row.id,
          timeSlot: row.timeSlot,
          shift: row.shift,
        })),
      );
    });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.CFCURL}/master/billType/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getTimeSlots();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.CFCURL}/master/billType/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getTimeSlots();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    slotDescription: "",
    fromDate: null,
    toDate: null,
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const slotFrom = moment(formData.slotFrom).format();
    const slotTo = moment(formData.slotTo).format();

    const finalBodyForApi = {
      ...formData,
      slotFrom,
      slotTo,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
      auditoriumKey: Number(formData?.auditoriumName),
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.PABBMURL}/mstTimeSlots/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 201) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getTimeSlots();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  const resetValuesExit = {
    billPrefix: "",
    fromDate: "",
    toDate: "",
    billType: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditorium",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "shift",
      headerName: <FormattedLabel id="shift" />,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "slotDescription",
      headerName: <FormattedLabel id="slotDescription" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "from",
      headerName: <FormattedLabel id="eventTimeFrom" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "to",
      headerName: <FormattedLabel id="eventTimeTo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <div>
      <Paper style={{ margin: "50px" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="auditoriumSchedule" /> {/* New Auditorium Entry */}
          </h2>
        </Box>

        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse && (
              <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl style={{ width: "90%" }} error={errors.slotFrom}>
                        <Controller
                          control={control}
                          name="slotFrom"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => <TextField {...props} size="small" fullWidth />}
                                label={<FormattedLabel id="eventTimeFrom" />}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>{errors?.slotFrom ? errors.slotFrom.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl style={{ width: "90%" }} error={errors.slotTo}>
                        <Controller
                          control={control}
                          name="slotTo"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => <TextField {...props} size="small" fullWidth />}
                                label={<FormattedLabel id="eventTimeTo" />}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>{errors?.slotTo ? errors.slotTo.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>
                        No. of days : {watch("slotTo")?.diff(watch("slotFrom"), "days") || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.auditoriumName}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="auditorium" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="auditorium" />}
                            >
                              {auditoriums &&
                                auditoriums.map((auditorium, index) => {
                                  console.log("sd23", auditorium);
                                  return (
                                    <MenuItem key={index} value={auditorium.id}>
                                      {auditorium.auditoriumNameEn}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          )}
                          name="auditoriumName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.auditoriumName ? errors.auditoriumName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl error={errors.shift} variant="outlined" size="small" sx={{ width: "90%" }}>
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="shift" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => {
                                console.log("wwq", value.target.value, shifts);
                                return field.onChange(value);
                              }}
                              label={<FormattedLabel id="shift" />}
                            >
                              {shifts.map((auditorium, index) => {
                                return (
                                  <MenuItem key={index} value={auditorium.id}>
                                    {auditorium.shift}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="shift"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.shift ? errors.shift.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {watch("shift") == 1 && <Typography>2 Hours</Typography>}
                      {watch("shift") == 2 && <Typography>3 Hours</Typography>}
                      {watch("shift") == 3 && <Typography>5 Hours</Typography>}
                      {watch("shift") == 4 && <Typography>8 Hours</Typography>}
                      {watch("shift") == 5 && <Typography>10 Hours</Typography>}
                      {watch("shift") == 6 && <Typography>12 Hours</Typography>}
                      {watch("shift") == 7 && <Typography>15 Hours</Typography>}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{ width: "90%" }}
                        error={errors.durationOfApplicationDistributionAndAcceptance}
                      >
                        <Controller
                          control={control}
                          name="durationOfApplicationDistributionAndAcceptance"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => <TextField {...props} size="small" fullWidth />}
                                label={<FormattedLabel id="durationOfApplicationDistributionAndAcceptance" />}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.durationOfApplicationDistributionAndAcceptance
                            ? errors.durationOfApplicationDistributionAndAcceptance.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl style={{ width: "90%" }} error={errors.holidayWeekendSchedule}>
                        <Controller
                          control={control}
                          name="holidayWeekendSchedule"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => <TextField {...props} size="small" fullWidth />}
                                label={<FormattedLabel id="holidayWeekendSchedule" />}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.holidayWeekendSchedule ? errors.holidayWeekendSchedule.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label={<FormattedLabel id="slotDescription" />}
                        size="small"
                        variant="outlined"
                        sx={{ width: "90%" }}
                        {...register("slotDescription")}
                        error={!!errors.slotDescription}
                        helperText={errors?.slotDescription ? errors.slotDescription.message : null}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                        size="small"
                      >
                        {btnSaveText}
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                        size="small"
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider />
                </form>
              </Slide>
            )}

            {!isOpenCollapse && (
              <>
                <Grid container style={{ padding: "10px" }}>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      endIcon={<AddIcon />}
                      type="primary"
                      size="small"
                      disabled={buttonInputState}
                      onClick={() => {
                        reset({
                          ...resetValuesExit,
                        });
                        setEditButtonInputState(true);
                        setDeleteButtonState(true);
                        setBtnSaveText("Save");
                        setButtonInputState(true);
                        setSlideChecked(true);
                        setIsOpenCollapse(!isOpenCollapse);
                      }}
                    >
                      <FormattedLabel id="add" />
                    </Button>
                  </Grid>
                </Grid>

                <Box style={{ height: "auto", overflow: "auto" }}>
                  <DataGrid
                    sx={{
                      overflowY: "scroll",

                      "& .MuiDataGrid-virtualScrollerContent": {},
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },

                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                    }}
                    density="compact"
                    autoHeight={true}
                    // rowHeight={50}
                    pagination
                    paginationMode="server"
                    // loading={data.loading}
                    rowCount={data.totalRows}
                    rowsPerPageOptions={data.rowsPerPageOptions}
                    page={data.page}
                    pageSize={data.pageSize}
                    rows={data.rows}
                    columns={columns}
                    onPageChange={(_data) => {
                      getTimeSlots(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getTimeSlots(_data, data.page);
                    }}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default TimeSlots;
