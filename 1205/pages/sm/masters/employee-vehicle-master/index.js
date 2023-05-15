import { options, vehicleTypes } from "../../../../components/security/contsants";
import styles from "../../visitorEntry.module.css";
import sweetAlert from "sweetalert";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import schema from "../../../../containers/schema/securityManagementSystemSchema/masters/employeeVehicle";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

function EmployeeVehicle() {
  // const {
  //   control,
  //   handleSubmit,
  //   register,
  //   watch,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
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

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [rowId, setRowId] = useState("");
  const [id, setID] = useState();
  const [slideChecked, setSlideChecked] = useState(false);
  const [nextEntryNumber, setNextEntryNumber] = useState();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getUserName();
    getDepartment();
  }, []);

  useEffect(() => {
    getNextEntryNumber();
  }, []);

  const getNextEntryNumber = () => {
    axios.get(`${urls.SMURL}/mstEmployeeVehicleMaster/getAutoGenVehicleId`).then((r) => {
      console.log("Nex Entry Number", r);
      setNextEntryNumber(r.data);
    });
  };

  useEffect(() => {
    getVehicleMaster();
    setValue("departmentKey", 27);
  }, [users]);

  const getDepartment = () => {
    axios.get(`${urls.CfcURLMaster}/department/getAll`).then((res) => {
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      );
    });
  };

  const resetValuesCancell = {
    departmentKey: "",
    vehicleNumber: "",
    vehicleId: "",
    vehicleType: "",
    employeeKey: "",
    employeeName: "",
    employeeMobileNumber: "",
    vehicleAllotedAt: null,
    remark: "",
  };

  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res user", r);
          setUsers(r.data.user);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getVehicleMaster = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.SMURL}/mstEmployeeVehicleMaster/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("vehicle master", r);
        let result = r.data.mstEmployeeVehicleMasterList;
        let _res = result?.map((r, i) => {
          return {
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            departmentKey: departments?.find((obj) => obj?.id == r.departmentKey)?.department
              ? departments?.find((obj) => obj?.id == r.departmentKey)?.department
              : "-",
            employeeKey: users?.find((obj) => obj?.id == r.employeeKey)?.firstNameEn
              ? users?.find((obj) => obj?.id == r.employeeKey)?.firstNameEn
              : "-",
            // employeeKey: r.employeeKey,
            employeeMobileNumber: r.employeeMobileNumber,
            employeeName: r.employeeName,
            vehicleAllotedAt: r.vehicleAllotedAt
              ? moment(r.vehicleAllotedAt, "DD-MM-YYYY").format("DD-MM-YYYY")
              : "-",
            vehicleNumber: r.vehicleNumber,
            vehicleType: r.vehicleType,
            remark: r.remark,
            val: r?.vehicleAllotedAt,
            dept: r?.departmentKey,
            emp: r?.employeeKey,
          };
        });
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  const onSubmit = (formData, btnType) => {
    console.log("formData", formData, btnSaveText);
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      _body = {
        ...formData,
        departmentKey: Number(formData.departmentKey),
        employeeKey: Number(formData.employeeKey),
        vehicle_id: Number(formData.vehicle_id),
        vehicleAllotedAt: moment(formData?.vehicleAllotedAt).format("YYYY-MM-DDThh:mm:ss"),
      };
      console.log("1", _body);
    } else {
      _body = {
        ...formData,
        id: formData.id,
        departmentKey: Number(formData.departmentKey),
        employeeKey: Number(formData.employeeKey),
        vehicle_id: Number(formData.vehicle_id),
        vehicleAllotedAt: moment(formData?.vehicleAllotedAt).format("YYYY-MM-DDThh:mm:ss"),
      };
      console.log("2", _body);
    }
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(`${urls.SMURL}/mstEmployeeVehicleMaster/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            getVehicleMaster();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            reset({
              ...resetValuesCancell,
            });
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update" || btnType === "Checkout") {
      console.log("current ", formData);
      // var d = new Date(); // for now
      // const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(`${urls.SMURL}/mstEmployeeVehicleMaster/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            formData.id
              ? sweetAlert("Updated!", "Record Updated successfully !", "success")
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            setFetchData(tempData);
            setIsOpenCollapse(false);
            getVehicleMaster();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      maxWidth: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "vehicleType",
      headerName: <FormattedLabel id="vehicleType" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "vehicleNumber",
      headerName: <FormattedLabel id="vehicleNumber" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "vehicleAllotedAt",
      headerName: <FormattedLabel id="vehicleAllotedAt" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "employeeName",
      headerName: <FormattedLabel id="employeeName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "employeeMobileNumber",
      headerName: <FormattedLabel id="employeeMobileNumber" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "employeeKey",
      headerName: <FormattedLabel id="employeeKey" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue("vehicleAllotedAt", params.row.val);
                setValue("departmentKey", params.row.dept);
                setValue("employeeKey", params.row.emp);
                setValue("vehicleType", params.row.vehicleType);
                setValue("remark", params.row.remark);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>PCMC Vehicle</title>
      </Head>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="employeeVehicle" />
        </h2>
      </Box>
      {isOpenCollapse ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="vehicleId" />}
                  size="small"
                  value={nextEntryNumber}
                  fullWidth
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("vehicle_id")}
                  sx={{ width: "90%" }}
                  error={!!errors.vehicle_id}
                  helperText={errors?.vehicle_id ? errors.vehicle_id.message : null}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="vehicleNumber" required />}
                  size="small"
                  fullWidth
                  {...register("vehicleNumber")}
                  sx={{ width: "90%" }}
                  error={!!errors.vehicleNumber}
                  helperText={errors?.vehicleNumber ? errors.vehicleNumber.message : null}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="driverId" required />}
                  size="small"
                  fullWidth
                  {...register("employeeKey")}
                  sx={{ width: "90%" }}
                  error={!!errors.employeeKey}
                  helperText={errors?.employeeKey ? errors.employeeKey.message : null}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="employeeMobileNumber" required />}
                  size="small"
                  fullWidth
                  {...register("employeeMobileNumber")}
                  sx={{ width: "90%" }}
                  error={!!errors.employeeMobileNumber}
                  helperText={errors?.employeeMobileNumber ? errors.employeeMobileNumber.message : null}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ width: "90%" }} error={!!errors.vehicleAllotedAt}>
                  <Controller
                    control={control}
                    name="vehicleAllotedAt"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="MM/DD/YYYY"
                          disablePast
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="vehicleAllotedDate" required />
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
                  <FormHelperText>
                    {errors?.vehicleAllotedAt ? errors.vehicleAllotedAt.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ width: "90%" }} error={!!errors.vehicleType} size="small">
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="vehicleType" required />
                  </InputLabel>
                  <Controller
                    name="vehicleType"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        // {...field}
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        size="small"
                        label={<FormattedLabel id="vehicleType" required />}
                      >
                        {vehicleTypes.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors?.vehicleType ? errors.vehicleType.message : null}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.departmentKey}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="deptName" required />
                  </InputLabel>
                  <Controller
                    name="departmentKey"
                    // defaultValue={27}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value}
                        fullWidth
                        label={<FormattedLabel id="deptName" />}
                      >
                        {departments?.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.id}>
                              {item.department}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.departmentKey ? errors.departmentKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="employeeName" required />}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("employeeName")}
                  sx={{ width: "90%" }}
                  error={!!errors.employeeName}
                  helperText={errors?.employeeName ? errors.employeeName.message : null}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="remark" />}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("remark")}
                  sx={{ width: "90%" }}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}
                />
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
                <Button variant="contained" size="small" type="submit">
                  <FormattedLabel id={btnSaveText} />
                </Button>
              </Grid>
              <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() =>
                    reset({
                      ...resetValuesCancell,
                    })
                  }
                >
                  <FormattedLabel id="clear" />
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setIsOpenCollapse(!isOpenCollapse);
                    exitButton();
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      ) : (
        <>
          <Grid container sx={{ padding: "10px" }}>
            <Grid xs={11}></Grid>
            <Grid xs={1}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                onClick={() => {
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("Save");
                  // setButtonInputState(true);
                  // setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                <FormattedLabel id="add" />
              </Button>
            </Grid>
          </Grid>
          <Grid container xs={{ padding: "10px" }}>
            <DataGrid
              // disableColumnFilter
              // disableColumnSelector
              // disableToolbarButton
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,
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
              // rows={dataSource}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              //checkboxSelection

              density="compact"
              // autoHeight={true}
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
                getVehicleMaster(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getVehicleMaster(_data, data.page);
              }}
            />
          </Grid>
        </>
      )}
    </>
  );
}
export default EmployeeVehicle;
