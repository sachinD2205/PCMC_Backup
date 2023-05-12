import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
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
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../URLS/urls";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment/moment";
import sweetAlert from "sweetalert";
import styles from "../../../styles/[serviceCharges].module.css";

const Index = () => {
  let schema = yup.object().shape({
    // village: yup.string().required(" Village is Required !!"),
    // ward: yup.string().required(" Ward is Required !!"),
    // zone: yup.string().required(" Zone is Required !!"),
    // remark: yup.string().required(" Remark is Required !!"),
  });

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    watch,
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
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceChargeTypes, setServiceChargeTypes] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);
  const [amount, setAmount] = useState(false);

  // let check = watch("serviceChargeType");

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  useEffect(() => {
    getApplication();
    getChargeType();
    getService();
    getServiceChargeType();
  }, []);

  useEffect(() => {
    getServiceCharges();
  }, [applications, services, serviceChargeTypes, chargeTypes]);

  const getApplication = () => {
    axios.get(`${urls.BaseURL}/application/getAll`).then((r) => {
      setApplications(
        r.data.map((row) => ({
          id: row.id,
          appCode: row.appCode,
          applicationNameEng: row.applicationNameEng,
          applicationNameMr: row.applicationNameMr,
          module: row.module,
        })),
      );
    });
  };

  const getService = () => {
    axios.get(`${urls.BaseURL}/service/getAll`).then((r) => {
      setServices(
        r.data.service.map((row) => ({
          id: row.id,
          service: row.serviceName,
        })),
      );
    });
  };

  const getServiceChargeType = () => {
    axios.get(`${urls.BaseURL}/serviceChargeType/getAll`).then((r) => {
      setServiceChargeTypes(
        r.data.serviceChargeType.map((row) => ({
          id: row.id,
          serviceChargeType: row.serviceChargeType,
        })),
      );
    });
  };

  const getChargeType = () => {
    axios.get(`${urls.BaseURL}/chargeName/getAll`).then((r) => {
      setChargeTypes(
        r.data.chargeName.map((row) => ({
          id: row.id,
          charge: row.charge,
        })),
      );
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
  const getServiceCharges = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    axios
      .get(`${urls.BaseURL}/servicecharges/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        let result = res.data.serviceCharge;
        let _res = result.map((r, i) => {
          console.log("res payment mode", res);
          return {
            srNo: Number(_pageNo + "0") + i + 1,
            id: r.id,
            // srNo: i + 1,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            application: r.application,
            amount: r.amount,
            service: r.service,
            serviceChargeType: r.serviceChargeType,
            charge: r.charge,
            applicationNameEng: applications.find((obj) => obj?.id === r.application)?.applicationNameEng,
            applicationNameMr: applications.find((obj) => obj?.id === r.application)?.applicationNameMr,
            serviceName: services.find((obj) => obj?.id === r.service)?.service,
            serviceChargeTypeName: serviceChargeTypes.find((obj) => obj.id === r.serviceChargeType)
              ?.serviceChargeType,
            chargeName: chargeTypes.find((obj) => obj?.id === r.charge)?.charge,
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

  const editRecord = (rows) => {
    console.log("Edit cha data:", rows);
    setBtnSaveText("Update"), setID(rows.id), setIsOpenCollapse(true), setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const fromDate = new Date(formData.fromDate).toISOString();
    const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    axios.post(`${urls.BaseURL}/servicecharges/save`, finalBodyForApi).then((res) => {
      if (res.status == 200) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getServiceCharges();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios
  //       .delete(`${urls.BaseURL}/servicecharges/discard/${value}`)
  //       .then((res) => {
  //         if (res.status == 226) {
  //           if (willDelete) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //           } else {
  //             swal("Record is Safe");
  //           }
  //           getServiceCharges();
  //           setButtonInputState(false);
  //         }
  //       });
  //   });
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
          axios.post(`${urls.CFCURL}/master/servicecharges/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deactivated!", {
                icon: "success",
              });

              getServiceCharges();
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
          axios.post(`${urls.CFCURL}/master/servicecharges/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });

              getServiceCharges();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const handleChange = (value) => {
    // console.log("check", check);
    if (value === 1) {
      setAmount(true);
    } else {
      setAmount(false);
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
    fromDate: null,
    toDate: null,
    application: null,
    service: null,
    serviceChargeType: null,
    charge: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    application: null,
    service: null,
    serviceChargeType: null,
    charge: null,
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },
    { field: "fromDate", headerName: "fromDate" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
    {
      field: "applicationNameEng",
      headerName: "Application Name ",
      flex: 1,
    },
    {
      field: "serviceName",
      headerName: "Service",
      // type: "number",
      flex: 1,
    },
    {
      field: "serviceChargeTypeName",
      headerName: "Service Charge Type",
      // type: "number",
      flex: 1,
    },
    {
      field: "chargeName",
      headerName: "Charge Name",
      // type: "number",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      // type: "number",
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
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
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
        Service Charge
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl
                        variant="standard"
                        sx={{ minWidth: 120 }}
                        error={!!errors.applicationNameEng}
                      >
                        <InputLabel id="demo-simple-select-standard-label">Application Name</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Application Name"
                            >
                              {applications &&
                                applications.map((applicationNameEng, index) => (
                                  <MenuItem key={index} value={applicationNameEng.id}>
                                    {applicationNameEng.applicationNameEng}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="application"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.applicationNameEng ? errors.applicationNameEng.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{
                            m: 5,
                            minWidth: 120,
                            marginTop: 0,
                            marginLeft: 3,
                          }}
                          error={!!errors.charge}
                        >
                          <InputLabel id="demo-simple-select-standard-label">Charge Name</InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{
                                  width: 250,
                                  marginTop: 0.5,
                                  marginRight: "7vw",
                                }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Charge Name"
                              >
                                {chargeTypes &&
                                  chargeTypes.map((charge, index) => (
                                    <MenuItem key={index} value={charge.id}>
                                      {charge.charge}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="charge"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>{errors?.charge ? errors.charge.message : null}</FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>

                    <Grid item xs={4}>
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ minWidth: 120, marginRight: "2vw" }}
                          error={!!errors.serviceChargeType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">Service Charge Type</InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  return field.onChange(value), handleChange(value.target.value);
                                }}
                                label="Service Charge Type"
                              >
                                {serviceChargeTypes &&
                                  serviceChargeTypes.map((serviceChargeType, index) => {
                                    console.log("serviceChargeType", serviceChargeType);
                                    return (
                                      <MenuItem key={index} value={serviceChargeType.id}>
                                        {serviceChargeType.serviceChargeType}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="serviceChargeType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.serviceChargeType ? errors.serviceChargeType.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl style={{ marginTop: 10, marginRight: "2vw" }} error={!!errors.fromDate}>
                        <Controller
                          control={control}
                          name="fromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={<span style={{ fontSize: 16 }}>From Date</span>}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
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
                        <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl style={{ marginTop: 10, marginLeft: "4vw" }} error={!!errors.toDate}>
                        <Controller
                          control={control}
                          name="toDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={<span style={{ fontSize: 16 }}>To Date</span>}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
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
                        <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        // sx={{
                        //   width: 250,
                        //   marginTop: "2vh",
                        //   marginLeft: "2vw",
                        // }}
                        style={{ marginTop: 10, marginLeft: "4vw" }}
                        id="standard-basic"
                        label="Amount *"
                        variant="standard"
                        // value={dataInForm && dataInForm.religion}
                        {...register("amount")}
                        error={!!errors.amount}
                        helperText={errors?.amount ? errors.amount.message : null}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 4, minWidth: 120, marginLeft: "9vw" }}
                        error={!!errors.service}
                      >
                        <InputLabel id="demo-simple-select-standard-label">Service Name</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Service Name"
                            >
                              {services &&
                                services.map((service, index) => (
                                  <MenuItem key={index} value={service.id}>
                                    {service.service}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="service"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.service ? errors.service.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <div>
                    <div className={styles.buttons}>
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        Exit
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn}>
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
            Add{" "}
          </Button>
        </div>

        <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            // componentsProps={{
            //   toolbar: {
            //     showQuickFilter: true,
            //   },
            // }}
            getRowId={(row) => row.srNo}
            // components={{ Toolbar: GridToolbar }}
            autoHeight
            density="compact"
            sx={{
              "& .super-app-theme--cell": {
                backgroundColor: "#87E9F7",
                border: "1px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                transform: "scale(1.1)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E1FDFF",
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
              getServiceCharges(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getServiceCharges(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
