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
  Slide,
  TextField,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import schema from "../../../../containers/schema/publicAuditorium/transactions/auditoriumEventsCharges";
import sweetAlert from "sweetalert";
import moment from "moment";

const AuditoriumEventsCharges = () => {
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
  const [programEventDescription, setProgramEventDescription] = useState([]);
  const [filteredProgramEventDescription, setFilteredProgramEventDescription] = useState([]);
  const [filteredEventTimes, setFilteredEventTimes] = useState([]);

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
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "programEventDescription",
      headerName: "Program Event Description",
      flex: 1.5,
      headerAlign: "center",
    },
    {
      field: "depositAmount",
      headerName: "Deposit Amount",
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "grandTotal",
      headerName: "Grand Total",
      flex: 0.8,
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
      field: "gstAmount",
      headerName: "GST Amount",
      flex: 0.8,
      headerAlign: "center",
    },
    // {
    //   field: "eventTime",
    //   headerName: "Event Time",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "rentAmount",
      headerName: "Rent Amount",
      flex: 0.8,
      headerAlign: "center",
    },
    {
      field: "securityAmount",
      headerName: "Security Amount",
      flex: 0.8,
      headerAlign: "center",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 0.8,
      headerAlign: "center",
    },
    {
      field: "noOfDays",
      headerName: "No. Of Days",
      flex: 0.8,
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
    getAuditoriumEvents();
  }, []);

  useEffect(() => {
    getAuditoriumEventsCharges();
  }, [programEventDescription]);

  const getAuditoriumEventsCharges = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumEventsCharges/getAll`).then((r) => {
      console.log("trnAuditoriumEventsCharges", r);
      let result = r.data.trnAuditoriumEventsChargesList;
      let _res = result.map((val, i) => {
        console.log("44", val);
        return {
          srNo: i + 1,
          id: val.id,
          depositAmount: val.depositAmount ? val.depositAmount : "-",
          eventTime:
            val.eventTime != null || undefined ? moment(val.eventTime, "hh:mm A").format("hh:mm A") : "-",
          grandTotal: val.grandTotal ? val.grandTotal : "-",
          gstAmount: val.gstAmount ? val.gstAmount : "-",
          auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
          noOfDays: val.noOfDays ? val.noOfDays : "-",
          programEventDescription: val.programEventDescription
            ? programEventDescription.find((obj) => obj?.id == val.programEventDescription)
                ?.programEventDescription
            : "-",
          rentAmount: val.rentAmount ? val.rentAmount : "-",
          securityAmount: val.securityAmount ? val.securityAmount : "-",
          totalAmount: val.totalAmount ? val.totalAmount : "-",
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

  const getAuditoriumEvents = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`).then((r) => {
      console.log("respe 9", r);
      setProgramEventDescription(
        r.data.trnAuditoriumEventsList.map((row, index) => ({
          ...row,
          id: row.id,
          programEventDescription: row.programEventDescription,
          eventTime: moment(row.eventTime, "hh:mm:ss").format("hh:mm:ss"),
        })),
      );
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
      noOfDays: formData.days,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.PABBMURL}/trnAuditoriumEventsCharges/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 201) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getAuditoriumEventsCharges();
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
    endTime: null,
    remark: "",
    depositAmount: "",
    rentAmount: "",
    securityAmount: "",
    gstAmount: "",
    totalAmount: "",
    grandTotal: "",
  };

  return (
    <div>
      <Paper style={{ margin: "50px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
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
                          onChange={(value) => {
                            field.onChange(value);
                            setFilteredProgramEventDescription(
                              programEventDescription.map((r) => {
                                return Number(r.auditoriumName) === value.target.value && r;
                              }),
                            );
                          }}
                          label="Select Auditorium"
                        >
                          {auditoriums &&
                            auditoriums.map((auditorium, index) => {
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
                  <FormControl
                    error={errors.programEventDescription}
                    variant="standard"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Program / Events Description
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);

                            setFilteredEventTimes(
                              filteredProgramEventDescription.map((r) => {
                                console.log("2323v", r, value.target.value);
                                return Number(r.id) === value.target.value && r;
                              }),
                            );
                          }}
                          label="Select Auditorium"
                        >
                          {filteredProgramEventDescription &&
                            filteredProgramEventDescription.map((auditorium, index) => {
                              return (
                                <MenuItem
                                  sx={{
                                    display: auditorium.programEventDescription ? "flex" : "none",
                                  }}
                                  key={index}
                                  value={auditorium.id}
                                >
                                  {auditorium.programEventDescription}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="programEventDescription"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.programEventDescription ? errors.programEventDescription.message : null}
                    </FormHelperText>
                  </FormControl>
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
                  <FormControl error={errors.days} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Days</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Days"
                        >
                          {filteredProgramEventDescription?.map((auditorium, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={auditorium.id}
                                sx={{
                                  display: auditorium.noOfDays != null || undefined ? "flex" : "none",
                                }}
                              >
                                {auditorium.noOfDays}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="days"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.days ? errors.days.message : null}</FormHelperText>
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
                  <FormControl error={errors.eventTime} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Event Time</InputLabel>
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
                          {console.log("32was", filteredEventTimes)}
                          {filteredEventTimes?.map((auditorium, index) => {
                            return (
                              <MenuItem
                                sx={{
                                  display: auditorium.eventTime != null || undefined ? "flex" : "none",
                                }}
                                key={index}
                                value={auditorium.id}
                              >
                                {auditorium.eventTime}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="eventTime"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.eventTime ? errors.eventTime.message : null}</FormHelperText>
                  </FormControl>
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
                    label="Deposit Amount in Rs"
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("depositAmount")}
                    error={!!errors.depositAmount}
                    helperText={errors?.depositAmount ? errors.depositAmount.message : null}
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
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="Rent Amount in Rs"
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("rentAmount")}
                    error={!!errors.rentAmount}
                    helperText={errors?.rentAmount ? errors.rentAmount.message : null}
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
                    label="Security Amount in Rs"
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("securityAmount")}
                    error={!!errors.securityAmount}
                    helperText={errors?.securityAmount ? errors.securityAmount.message : null}
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
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="GST Tax calculation"
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("gstAmount")}
                    error={!!errors.gstAmount}
                    helperText={errors?.gstAmount ? errors.gstAmount.message : null}
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
                    label="Total Amount"
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("totalAmount")}
                    error={!!errors.totalAmount}
                    helperText={errors?.totalAmount ? errors.totalAmount.message : null}
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
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="Grand Total"
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("grandTotal")}
                    error={!!errors.grandTotal}
                    helperText={errors?.grandTotal ? errors.grandTotal.message : null}
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
          </Slide>
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

export default AuditoriumEventsCharges;
