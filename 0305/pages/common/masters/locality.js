import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
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
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../URLS/urls";
import schema from "../../../containers/schema/common/Locality";
import styles from "../../../styles/cfc/cfc.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/router";

const Locality = () => {
  const language = useSelector((state) => state?.label?.language);

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
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
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [zones, setZone] = useState([]);
  const [circle, setCircle] = useState([]);

  const router = useRouter();

  const [load, setLoad] = useState();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const handleLoad = () => {
    setLoad(false);
  };

  useEffect(() => {
    getZone();
  }, []);

  useEffect(() => {
    getCircle();
  }, [zones]);

  useEffect(() => {
    setFetchData(false);
    getAllLocality();
  }, [circle]);

  //get All Administrative Zone
  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(
        res.data.zone.map((r, i) => ({
          id: r.id,
          zone: r.zoneName,
        })),
      );
      getCircle();
    });
  };

  //get All Circle
  const getCircle = () => {
    axios.get(`${urls.CFCURL}/master/circle/getAll`).then((res) => {
      setCircle(
        res.data.circle.map((r, i) => ({
          id: r.id,
          circle: r.circle,
        })),
      );
      getAllLocality();
    });
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getAllLocality = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    axios
      .get(`${urls.CFCURL}/master/locality/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })

      .then((res) => {
        let result = res.data.locality;
        let _res = result.map((r, i) => {
          return {
            srNo: i + 1 + _pageNo * _pageSize,
            circle: r.circle,
            localityPrefix: r.localityPrefix,
            landmark: r.landmark,
            toDate: r.toDate,
            fromDate: r.fromDate,
            // toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            landmarkMr: r.landmarkMr,
            id: r.id,
            zone: r.zone,
            zoneName: zones?.find((obj) => obj?.id === r.zone)?.zone,
            remark: r.remark,
            activeFlag: r.activeFlag,
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

  const onSubmitForm = (formData) => {
    const fromDate = new Date(formData.fromDate).toISOString();
    const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    axios.post(`${urls.CFCURL}/master/locality/save`, finalBodyForApi).then((res) => {
      if (res.status == 200) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getAllLocality();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  // // Delete By ID
  // const deleteById = async (value) => {
  //   await axios
  //     .delete(`${urls.CFCURL}/master/locality/save/${value}`)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         message.success("Record Deleted !!!");
  //         setFetchData(true);
  //         setButtonInputState(false);
  //       }
  //     });
  // };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.CFCURL}/master/locality/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deactivated!", {
                icon: "success",
              });
              getAllLocality();
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
          axios.post(`${urls.CFCURL}/master/locality/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });

              getAllLocality();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };
  // Exit Button
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

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    zone: null,
    circle: null,
    gat: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    localityPrefix: "",
    landmark: "",
    toDate: "",
    fromDate: "",
    landmarkMr: "",
    zoneName: "",
    remark: "",
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
      headerName: <FormattedLabel id="fromDate" />,
      width: 120,
    },

    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      width: 120,
    },

    {
      field: "landmark",
      headerName: <FormattedLabel id="landMark" />,
      width: 210,
    },

    {
      field: "landmarkMr",
      headerName: <FormattedLabel id="landMarkMr" />,
      width: 210,
    },

    {
      field: "localityPrefix",
      headerName: <FormattedLabel id="localityPrefix" />,
      width: 210,
    },
    {
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      width: 200,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
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
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
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

  // Row

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
          <Box className={styles.h1Tag} sx={{ paddingLeft: "39%" }}>
            <FormattedLabel id="locality" />
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
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
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
                  <br />

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      {/* <FormControl error={!!errors.fromDate} sx={{ width: "80%" }}>
                        <Controller
                          control={control}
                          name="fromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="toDate" />}</span>}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    error={errors?.fromDate ? true : false}
                                    sx={{ width: "100%", backgroundColor: "white" }}
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
                        <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                      </FormControl> */}
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
                                inputFormat="yyyy/MM/dd"
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
                    <Grid item xs={4}>
                      {/* <FormControl sx={{ width: "80%" }}>
                        <Controller
                          control={control}
                          name="toDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                inputFormat="yyyy/MM/dd"
                                // inputFormat="DD/MM/YYYY"
                                label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="toDate" />}</span>}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ width: "100%", backgroundColor: "white" }}
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
                        <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                      </FormControl> */}
                      {/* <Typography>{<FormattedLabel id="toDate" />}</Typography> */}
                      <FormControl sx={{ width: "80%" }}>
                        <Controller
                          control={control}
                          name="toDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="toDate" />}</span>}
                                inputFormat="yyyy/MM/dd"
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
                    <Grid item xs={4}>
                      <div>
                        <TextField
                          size="small"
                          sx={{ width: "80%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="landMark" />}
                          variant="outlined"
                          {...register("landmark")}
                          error={!!errors.landmark}
                          helperText={errors?.landmark ? errors.landmark.message : null}
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <div>
                        <TextField
                          size="small"
                          sx={{ width: "80%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="landMarkMr" />}
                          variant="outlined"
                          {...register("landmarkMr")}
                          error={!!errors.landmarkMr}
                          helperText={errors?.landmarkMr ? errors.landmarkMr.message : null}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={4}>
                      <div>
                        <TextField
                          size="small"
                          sx={{ width: "80%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="localityPrefix" />}
                          variant="outlined"
                          {...register("localityPrefix")}
                          error={!!errors.localityPrefix}
                          helperText={errors?.localityPrefix ? errors.localityPrefix.message : null}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl error={!!errors.zone} sx={{ width: "80%" }}>
                        <InputLabel id="demo-simple-select-outlined-label">
                          {<FormattedLabel id="zoneName" />}
                        </InputLabel>
                        <Controller
                          sx={{ backgroundColor: "white" }}
                          render={({ field }) => (
                            <Select
                              size="small"
                              sx={{ backgroundColor: "white" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="zoneName" />}
                            >
                              {zones &&
                                zones.map((zone, index) => (
                                  <MenuItem key={index} value={zone.id}>
                                    {zone.zone}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zone"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.zone ? errors.zone.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <div>
                        <TextField
                          multiline
                          rows={4}
                          size="small"
                          sx={{ width: "80%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label="Remarks"
                          variant="outlined"
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={errors?.remark ? errors.remark.message : null}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
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
                </form>
              </FormProvider>
            </Paper>
          </Slide>
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
              getAllLocality(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAllLocality(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

//

export default Locality;
