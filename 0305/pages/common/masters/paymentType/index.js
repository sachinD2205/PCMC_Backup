import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/common/paymentType";
import styles from "../../../../styles/cfc/cfc.module.css";

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

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [load, setLoad] = useState();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const handleLoad = () => {
    setLoad(false);
  };

  // Get Data By ID
  const getDataById = (value) => {
    setIsOpenCollapse(false);
    setID(value);
    axios.get(`${urls.BaseURL}master/MstPaymentType/getpaymentTypeDaoDataById/?id=${value}`).then((res) => {
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
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/paymentType/save`, body)

            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getPaymentTypeDetails();
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
          axios.post(`${urls.CFCURL}/master/paymentType/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getPaymentTypeDetails();
              setButtonInputState(false);
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
    const fromDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    console.log("From Date ${fromDate}", fromData);

    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
      // activeFlag: btnSaveText === "Update" ? null : null,
    };

    axios.post(`${urls.CFCURL}/master/paymentType/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 200) {
        if (res.data?.errors?.length > 0) {
          res.data?.errors?.map((x) => {
            if (x.field == "paymentType") {
              console.log("x.code", x.code);
              setError("paymentType", { message: x.code });
            } else if (x.field == "paymentTypeMr") {
              setError("paymentTypeMr", { message: x.code });
            }
          });
        } else {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getPaymentTypeDetails();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
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
    paymentType: "",
    paymentTypeMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    paymentType: "",
    paymentTypeMr: "",
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getPaymentTypeDetails();
  }, []);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getPaymentTypeDetails = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        console.log("_pageNo", _pageNo);
        let result = res.data.paymentType;
        let _res = result.map((val, i) => {
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1 + _pageNo * _pageSize,
            paymentTypeMr: val.paymentTypeMr,
            paymentType: val.paymentType,
            id: val.id,
            fromDate: val.fromDate,
            toDate: val.toDate,
            // fromDate: moment(val.fromDate).format("llll"),
            // toDate: moment(val.toDate).format("llll"),
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
    { field: "fromDate", flex: 1, headerName: <FormattedLabel id="fromDate" /> },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,

      flex: 1,
    },

    {
      field: "paymentType",
      headerName: <FormattedLabel id="paymentType" />,
      // type: "number",
      flex: 1,
    },

    {
      field: "paymentTypeMr",
      headerName: <FormattedLabel id="paymentTypeMr" />,
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
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
              {<FormattedLabel id="paymentType" />}
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
                                label={
                                  <span style={{ fontSize: 16 }}>{<FormattedLabel id="fromDate" />}</span>
                                }
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
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="paymentType" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.paymentType}
                        {...register("paymentType")}
                        error={!!errors.paymentType}
                        helperText={errors?.paymentType ? errors.paymentType.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="paymentTypeMr" />}
                        variant="outlined"
                        {...register("paymentTypeMr")}
                        error={!!errors.paymentTypeMr}
                        helperText={errors?.paymentTypeMr ? errors.paymentTypeMr.message : null}
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
                getPaymentTypeDetails(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getPaymentTypeDetails(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      </>
    </>
  );
};

export default Index;

// export default index
