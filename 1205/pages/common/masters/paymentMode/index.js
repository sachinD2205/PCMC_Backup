import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/common/paymentMode";
import styles from "../../../../styles/cfc/cfc.module.css";
import { useSelector } from "react-redux";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const language = useSelector((state) => state.labels.language);

  const [load, setLoad] = useState();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const handleLoad = () => {
    setLoad(false);
  };

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [paymentTypes, setpaymentTypes] = useState([]);

  const getpaymentMode = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    axios
      .get(`${urls.CFCURL}/master/paymentMode/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        let result = res.data.paymentMode;
        let _res = result.map((val, i) => {
          console.log("res payment mode", res);
          return {
            srNo: i + 1 + _pageNo * _pageSize,
            activeFlag: val.activeFlag,
            paymentMode: val.paymentMode,
            paymentModeMr: val.paymentModeMr,
            paymentType: val.paymentType,
            paymentTypeFeild: paymentTypes?.find((obj) => obj?.id == val.paymentType)?.paymentType,
            paymentTypeFeildMr: paymentTypes?.find((obj) => obj?.id == val.paymentType)?.paymentTypeMr,
            id: val.id,
            // fromDate: moment(val.fromDate).format("llll"),
            fromDate: val.fromDate,
            toDate: val.toDate,
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
      });
  };

  const getpaymentTypes = () => {
    axios.get(`${urls.CFCURL}/master/paymentType/getAll`).then((res) => {
      let result = res.data.paymentType;

      setpaymentTypes(
        // res.data.paymentType.map((row) => ({
        //   id: row.id,
        //   paymentType: row.paymentType,
        // })),
        res?.data?.paymentType,
      );
    });
  };

  useEffect(() => {
    getpaymentTypes();
    getpaymentMode();
  }, []);

  // Get Data By ID
  const getDataById = (value) => {
    setIsOpenCollapse(false);
    setID(value);
    axios.get(`${urls.BaseURL}/paymentMode/getAll/?id=${value}`).then((res) => {
      reset(res.data);
      setButtonInputState(true);
      setIsOpenCollapse(true);
      setBtnSaveText("Update");
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
        title: "Deactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.CFCURL}/master/paymentMode/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Inactivated!", {
                icon: "success",
              });
              getpaymentMode();
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
          axios.post(`${urls.CFCURL}/master/paymentMode/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });

              setButtonInputState(false);
              getpaymentMode();
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const fromDate = new Date(fromData.fromDate).toISOString();
    // const toDate = new Date(fromData.toDate).toISOString();
    const fromDate = moment(fromData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(fromData.toDate).format("YYYY-MM-DD");

    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
      // activeFlag: btnSaveText === "Update" ? null : null,
    };
    console.log("finalBodyForApi", finalBodyForApi);
    axios.post(`${urls.CFCURL}/master/paymentMode/save`, finalBodyForApi).then((res) => {
      if (res.status == 200) {
        if (res.data?.errors?.length > 0) {
          res.data?.errors?.map((x) => {
            if (x.field == "paymentMode") {
              console.log("x.code", x.code);
              setError("paymentMode", { message: x.code });
            } else if (x.field == "paymentModeMr") {
              setError("paymentModeMr", { message: x.code });
            }
          });
        } else {
          console.log("11id", id);
          id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getpaymentMode();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      }
    });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    paymentMode: "",
    paymentModePrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    paymentMode: "",
    paymentModePrefix: "",
    remark: "",
    id: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      width: 90,
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "fromDate",
      width: 230,
      flex: 1,
      headerName: <FormattedLabel id="fromDate" />,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      width: 230,
    },

    {
      field: "paymentMode",
      headerName: <FormattedLabel id="paymentMode" />,
      width: 230,
    },
    {
      field: "paymentModeMr",
      headerName: <FormattedLabel id="paymentModeMr" />,
      width: 230,
    },
    {
      field: language === "en" ? "paymentTypeFeild" : "paymentTypeFeildMr",
      headerName: <FormattedLabel id="paymentType" />,
      width: 230,
    },
    {
      field: "actions",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                //   disabled={editButtonInputState && params.row.activeFlag === "N" ? false : true}
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  console.log("params.row: ", params.row);
                  reset(params.row);
                }}
              >
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id), setSlideChecked(true);
                setButtonInputState(true);
                // setIsOpenCollapse(true),
                // // console.log('params.row: ', params.row)
                // reset(params.row)
                // setLoiGeneration(params.row.loiGeneration)
                // setScrutinyProcess(params.row.scrutinyProcess)
                // setImmediateAtCounter(params.row.immediateAtCounter)
                // setRtsSelection(params.row.rtsSelection)
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "34%" }}>
            {<FormattedLabel id="paymentMode" />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
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
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper style={{ paddingTop: isOpenCollapse ? "20px" : "0px" }}>
        {isOpenCollapse && (
          <Paper
            sx={{
              marginLeft: 3,
              marginRight: 3,
              marginBottom: 3,
              padding: 2,
              backgroundColor: "#F5F5F5",
            }}
            elevation={5}
          >
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl sx={{ width: "80%" }}>
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="fromDate" />}</span>}
                              inputFormat="dd/mm/yyyy"
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))
                              }
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    backgroundColor: "white",
                                  }}
                                  {...params}
                                  size="small"
                                  error={errors?.fromDate ? true : false}
                                  fullWidth
                                  variant="outlined"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.fromDate ? (
                          <span style={{ color: "red" }}>{errors.fromDate.message}</span>
                        ) : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl sx={{ width: "80%" }}>
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="toDate" />}</span>}
                              inputFormat="dd/mm/yyyy"
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))
                              }
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    backgroundColor: "white",
                                  }}
                                  {...params}
                                  size="small"
                                  error={errors?.toDate ? true : false}
                                  fullWidth
                                  variant="outlined"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.toDate ? (
                          <span style={{ color: "red" }}>{errors.toDate.message}</span>
                        ) : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl variant="outlined" sx={{ width: "80%" }} error={!!errors.paymentType}>
                      <InputLabel id="demo-simple-select-outlined-label">
                        {<FormattedLabel id="paymentType" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            size="small"
                            sx={{ backgroundColor: "white" }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="paymentType" />}
                          >
                            {paymentTypes &&
                              paymentTypes.map((paymentType, index) => (
                                <MenuItem key={index} value={paymentType.id}>
                                  {language === "en" ? paymentType.paymentType : paymentType.paymentTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="paymentType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.paymentType ? errors.paymentType.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      size="small"
                      sx={{ width: "80%", backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="paymentMode" />}
                      variant="outlined"
                      {...register("paymentMode")}
                      error={!!errors.paymentMode}
                      helperText={errors?.paymentMode ? errors.paymentMode.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      size="small"
                      sx={{ width: "80%", backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="paymentModeMr" />}
                      variant="outlined"
                      {...register("paymentModeMr")}
                      error={!!errors.paymentModeMr}
                      helperText={errors?.paymentModeMr ? errors.paymentModeMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <br />
                <br />
                <Grid container className={styles.feildres} spacing={2}>
                  <Grid item>
                    <Button
                      type="submit"
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<SaveIcon />}
                    >
                      <FormattedLabel id="Save" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<ClearIcon />}
                      onClick={() => {
                        reset({
                          ...resetValuesExit,
                        });
                      }}
                    >
                      {<FormattedLabel id="clear" />}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      // color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Grid>
                </Grid>
                <br />
              </form>
            </FormProvider>
          </Paper>
        )}

        <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
            autoHeight={true}
            density="compact"
            sx={{
              "& .super-app-theme--cell": {
                backgroundColor: "#E3EAEA",
                borderLeft: "10px solid white",
                borderRight: "10px solid white",
                borderTop: "4px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                // transform: "scale(1.1)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E3EAEA",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-column": {
                backgroundColor: "red",
              },
            }}
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
              getpaymentMode(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getpaymentMode(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;

// export default index
