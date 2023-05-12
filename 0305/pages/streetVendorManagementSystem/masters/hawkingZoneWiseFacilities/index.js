import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
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
  Stack,
  TextField,
  ThemeProvider,
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
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schema from "../../../../components/streetVendorManagementSystem/schema/HawkingZoneWiseFacilitiesSchema";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const language = useSelector((state) => state?.labels.language);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [hawkigZones, sethawkigZones] = useState([]);
  const [hawkingZoneWiseFacilities, setHawkingZoneWiseFacilities] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // hawkingZones
  const getHawkingZone = () => {
    axios.get(`${urls.HMSURL}/hawingZone/getAll`).then((r) => {
      console.log("getHawkingZones", r?.data?.hawkingZone);
      sethawkigZones(
        r?.data?.hawkingZone?.map((row) => ({
          id: row?.id,
          hawkingZoneNameMr: row?.hawkingZoneNameMr,
          hawkingZoneName: row?.hawkingZoneName,
        })),
      );
    });
  };

  // tableData
  const getHawkingZoneWiseFacilities = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.HMSURL}/hawkingZoneWiseFacilities/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let response = res?.data?.hawkingZoneWiseFacilities;
          let _res = response.map((r, i) => {
            return {
              id: r.id,
              srNo: i + 1,
              hawkingZoneWiseFacilitiesPrefix: r.hawkingZoneWiseFacilitiesPrefix,
              hawkingZoneWiseFacilitiesPrefixMr: r.hawkingZoneWiseFacilitiesPrefixMr,
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              hawkigZone: r.hawkigZone,
              hawkingZoneNameMr: hawkigZones?.find((obj) => obj?.id === r.hawkigZone)?.hawkingZoneNameMr,
              hawkingZoneNameEn: hawkigZones?.find((obj) => obj?.id === r.hawkigZone)?.hawkingZoneName,
              facilities: r.facilities,
              facilitiesMr: r.facilitiesMr,
              remark: r.remark,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          setHawkingZoneWiseFacilities({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        } else {
          toast.error("Filed Load Data !! Please Try Again !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Filed Load Data hdsf!! Please Try Again !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // OnSubmitForm
  const onSubmitForm = (fromData) => {
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      // activeFlag: btnSaveText === "Update" ? null : null,
      activeFlag: "Y",
    };

    // Save - DB
    axios
      .post(`${urls.HMSURL}/hawkingZoneWiseFacilities/save`, finalBodyForApi)
      .then((res) => {
        if (res.status == 200 || res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          getHawkingZoneWiseFacilities();
          setEditButtonInputState(false);
        } else {
          toast.error("Filed To Save Record !! Please Try Again !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Filed To Save Record !! Please Try Again !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // DeleteByID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/hawkingZoneWiseFacilities/save`, body).then((res) => {
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getHawkingZoneWiseFacilities();
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
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/hawkingZoneWiseFacilities/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              getHawkingZoneWiseFacilities();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // ExitButton
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

  // cancellButton
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // ResetValuesCancell
  const resetValuesCancell = {
    hawkingZoneWiseFacilitiesPrefix: "",
    hawkingZoneWiseFacilitiesPrefixMr: "",
    fromDate: null,
    toDate: null,
    hawkigZone: "",
    facilities: "",
    facilitiesMr: "",
    remark: "",
  };

  // ResetValuesExit
  const resetValuesExit = {
    hawkingZoneWiseFacilitiesPrefix: "",
    hawkingZoneWiseFacilitiesPrefixMr: "",
    fromDate: null,
    toDate: null,
    hawkigZone: "",
    facilities: "",
    facilitiesMr: "",
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "hawkingZoneWiseFacilitiesPrefix",
      headerName: <FormattedLabel id="hawkingZoneWiseFacilitiesPrefixEn" />,
      description: <FormattedLabel id="hawkingZoneWiseFacilitiesPrefixEn" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "hawkingZoneWiseFacilitiesPrefixMr",
      headerName: <FormattedLabel id="hawkingZoneWiseFacilitiesPrefixMr" />,
      description: <FormattedLabel id="hawkingZoneWiseFacilitiesPrefixMr" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      description: <FormattedLabel id="fromDate" />,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "hawkingZoneNameEn" : "hawkingZoneNameMr",
      headerName: <FormattedLabel id="hawkingZone" />,
      description: <FormattedLabel id="hawkingZone" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "facilities",
      headerName: <FormattedLabel id="facilitynameEn" />,
      description: <FormattedLabel id="facilitynameEn" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "facilitiesMr",
      headerName: <FormattedLabel id="facilitynameMr" />,
      description: <FormattedLabel id="facilitynameMr" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
      headerAlign: "center",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params?.row?.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params?.row);
              }}
            >
              <EditIcon sx={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton>
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getHawkingZone();
  }, []);

  useEffect(() => {
    console.log("hawkigZones", hawkigZones);
    getHawkingZoneWiseFacilities();
  }, [hawkigZones]);

  // View
  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 20,
            marginBottom: 5,
            padding: 1,
          }}
          elevation={5}
        >
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "65px",
              borderRadius: 100,
            }}
          >
            <strong>{<FormattedLabel id="hawkingZoneWiseFacilities" />}</strong>
          </div>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid container style={{ marginBottom: "7vh" }}>
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
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          autoFocus
                          id="standard-basic"
                          label=<FormattedLabel id="hawkingZoneWiseFacilitiesPrefixEn" />
                          variant="standard"
                          {...register("hawkingZoneWiseFacilitiesPrefix")}
                          error={!!errors.hawkingZoneWiseFacilitiesPrefix}
                          helperText={
                            errors?.hawkingZoneWiseFacilitiesPrefix
                              ? errors.hawkingZoneWiseFacilitiesPrefix.message
                              : null
                          }
                        />
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
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="hawkingZoneWiseFacilitiesPrefixMr" />
                          variant="standard"
                          {...register("hawkingZoneWiseFacilitiesPrefixMr")}
                          error={!!errors?.hawkingZoneWiseFacilitiesPrefixMr}
                          helperText={
                            errors?.hawkingZoneWiseFacilitiesPrefixMr
                              ? errors?.hawkingZoneWiseFacilitiesPrefixMr?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{ display: "flex", justifyContent: "center", alignItem: "center" }}
                      >
                        <FormControl style={{ marginTop: 0 }} error={!!errors?.fromDate}>
                          <Controller
                            name="fromDate"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="fromDate" />
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
                          <FormHelperText>
                            {errors?.fromDate ? errors?.fromDate?.message : null}
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
                        style={{ display: "flex", justifyContent: "center", alignItem: "center" }}
                      >
                        <FormControl style={{ marginTop: 0 }} error={!!errors?.toDate}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="toDate" />
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
                          <FormHelperText>{errors?.toDate ? errors?.toDate?.message : null}</FormHelperText>
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
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl variant="standard" sx={{ m: 2 }} error={!!errors.hawkigZone}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="hawkingZoneName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label=<FormattedLabel id="hawkingZone" />
                              >
                                {hawkigZones &&
                                  hawkigZones.map((hawkingZone, index) => (
                                    <MenuItem key={index} value={hawkingZone?.id}>
                                      {language == "en"
                                        ? hawkingZone?.hawkingZoneName
                                        : hawkingZone?.hawkingZoneNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hawkigZone"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hawkigZone ? errors.hawkigZone.message : null}
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
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="facilitynameEn" />
                          variant="standard"
                          {...register("facilities")}
                          error={!!errors.facilities}
                          helperText={errors?.facilities ? errors.facilities.message : null}
                        />
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
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="facilitynameMr" />
                          variant="standard"
                          {...register("facilitiesMr")}
                          error={!!errors?.facilitiesMr}
                          helperText={errors?.facilitiesMr ? errors?.facilitiesMr?.message : null}
                        />
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
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="remark" />
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={errors?.remark ? errors.remark.message : null}
                        />
                      </Grid>
                    </Grid>

                    <Stack
                      direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
                      spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                      justifyContent="center"
                      alignItems="center"
                      marginTop="5"
                    >
                      <Button type="submit" variant="contained" color="success" endIcon={<SaveIcon />}>
                        {btnSaveText == "Save" ? (
                          <FormattedLabel id="save" />
                        ) : (
                          <FormattedLabel id="update" />
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Stack>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "2vh",
              marginRight: "40px",
            }}
          >
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
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />
            </Button>
          </div>
          <Box style={{ height: "auto", overflow: "auto" }}>
            <DataGrid
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              components={{ Toolbar: GridToolbar }}
              sx={{
                m: 5,
                overflowY: "scroll",
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              columns={columns}
              density="compact"
              autoHeight={true}
              pagination
              paginationMode="server"
              page={hawkingZoneWiseFacilities?.page}
              rowCount={hawkingZoneWiseFacilities?.totalRows}
              rowsPerPageOptions={hawkingZoneWiseFacilities?.rowsPerPageOptions}
              pageSize={hawkingZoneWiseFacilities?.pageSize}
              rows={hawkingZoneWiseFacilities?.rows}
              onPageChange={(_data) => {
                getHawkingZoneWiseFacilities(hawkingZoneWiseFacilities?.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                getHawkingZoneWiseFacilities(_data, hawkingZoneWiseFacilities?.page);
              }}
            />
          </Box>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
