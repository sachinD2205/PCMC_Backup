import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import schema from "../../../../containers/schema/publicAuditorium/transactions/auditoriumEvents";
import sweetAlert from "sweetalert";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const AuditoriumEvents = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   formState: { errors },
  // } = useForm({ resolver: yupResolver(schema) });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const [auditoriums, setAuditoriums] = useState([]);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      flex: 0.3,
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: "Auditorium",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventTime",
      headerName: "Event Time",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "programEventDescription",
      headerName: "Program Event Description",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noOfDays",
      headerName: "No. Of Days",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const resetValuesExit = {
    billPrefix: "",
    fromDate: "",
    toDate: "",
    billType: "",
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

  useEffect(() => {
    getAuditorium();
  }, []);

  useEffect(() => {
    getAuditoriumEvents();
  }, [auditoriums]);

  const getAuditoriumEvents = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`).then((r) => {
      let result = r.data.trnAuditoriumEventsList;
      let _res = result.map((val, i) => {
        return {
          srNo: i + 1,
          id: val.id,
          auditoriumName: val.auditoriumName
            ? auditoriums?.find((obj) => {
                return obj?.id == Number(val.auditoriumName);
              })?.auditoriumName
            : "-",
          eventTime: val.eventTime ? moment(val.eventTime, "hh:mm A").format("hh:mm A") : "-",
          fromDate: val.fromDate
            ? moment(val.fromDate, "DD-MM-YYYY hh:mm:ss").format("DD-MM-YYYY hh:mm:ss")
            : "-",
          noOfDays: val.noOfDays ? val.noOfDays : "-",
          programEventDescription: val.programEventDescription ? val.programEventDescription : "-",
          toDate: val.toDate ? moment(val.toDate, "DD-MM-YYYY hh:mm:ss").format("DD-MM-YYYY hh:mm:ss") : "-",
          status: val.activeFlag === "Y" ? "Active" : "Inactive",
          activeFlag: val.activeFlag,
        };
      });

      console.log("result", _res);

      setData({
        rows: _res,
        totalRows: r.data.totalElements,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: r.data.pageSize,
        page: r.data.pageNo,
      });
    });
  };

  const getAuditorium = () => {
    axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
      console.log("respe", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          id: row.id,
          auditoriumName: row.auditoriumName,
        })),
      );
    });
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const finalBodyForApi = {
      ...formData,
      auditoriumName: formData.auditoriumId,
      noOfDays: Number(formData.days),
      eventTime: moment(formData.eventTime).format("YYYY-MM-DDThh:mm:ss"),
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.PABBMURL}/trnAuditoriumEvents/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 201) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getAuditoriumEvents();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    auditoriumId: "",
    programEventDescription: "",
    days: null,
    toDate: null,
    remark: "",
  };

  return (
    <div>
      <Paper style={{ margin: "50px" }}>
        {isOpenCollapse && (
          // <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl error={errors.auditoriumId} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Select Auditorium</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {auditoriums &&
                            auditoriums.map((auditorium, index) => {
                              console.log("check", auditorium);
                              return (
                                <MenuItem key={index} value={auditorium.id}>
                                  {auditorium.auditoriumName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="auditoriumId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.auditoriumId ? errors.auditoriumId.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="Program/Event Description"
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("programEventDescription")}
                    error={!!errors.programEventDescription}
                    helperText={
                      errors?.programEventDescription ? errors.programEventDescription.message : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="Days"
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("days")}
                    error={!!errors.days}
                    helperText={errors?.days ? errors.days.message : null}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "end",
                  }}
                >
                  <FormControl style={{ marginTop: 0 }} error={!!errors.fromTime}>
                    <Controller
                      format="HH:mm:ss"
                      control={control}
                      name="eventTime"
                      defaultValue={null}
                      // key={slot.id}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <TimePicker
                            label={<span style={{ fontSize: 16 }}>Event Time</span>}
                            value={field.value}
                            onChange={(time) => {
                              moment(field.onChange(time), "HH:mm:ss a").format("HH:mm:ss a");
                            }}
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
                    <FormHelperText>{errors?.eventTime ? errors.eventTime.message : null}</FormHelperText>
                  </FormControl>
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
                    size="small"
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
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
                    size="small"
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    Clear
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
                    Exit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
          // </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={9}></Grid>
          <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
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
              add
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
              getBillType(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getBillType(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </div>
  );
};

export default AuditoriumEvents;
