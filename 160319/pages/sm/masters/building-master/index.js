import styles from "../../visitorEntry.module.css";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import EditIcon from "@mui/icons-material/Edit";
import Head from "next/head";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import urls from "../../../../URLS/urls";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import schema from "../../../../containers/schema/securityManagementSystemSchema/masters/building";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

function BuildingMaster() {
  // const {
  //   control,
  //   handleSubmit,
  //   reset,
  //   register,
  //   setValue,
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

  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [rowId, setRowId] = useState("");

  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [nextEntryNumber, setNextEntryNumber] = useState();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDepartment();
    getZoneKeys();
    // getWardKeys();
  }, []);

  useEffect(() => {
    getBuildingMaster();
  }, [zoneKeys]);

  useEffect(() => {
    getNextEntryNumber();
  }, []);

  const getNextEntryNumber = () => {
    axios.get(`${urls.SMURL}/mstBuildingMaster/getAutoGenBuildingId`).then((r) => {
      console.log("Nex Entry Number", r);
      setNextEntryNumber(r.data);
    });
  };

  const getBuildingMaster = (_pageSize = 10, _pageNo = 0) => {
    axios
      // .get(`${urls.SMURL}/mstBuildingMaster/getAll`, {
      .get(`${urls.SMURL}/mstBuildingMaster/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("building master", r);
        let result = r.data.mstBuildingMasterList;
        let _res = result?.map((r, i) => {
          return {
            id: r.id,
            // srNo: i + 1,
            srNo: _pageSize * _pageNo + i + 1,
            buildingAddress: r.buildingAddress,
            buildingFloor: r.buildingFloor,
            buildingName: r.buildingName,
            buildingNumber: r.buildingNumber,
            departmentKey: departments?.find((obj) => obj?.id == r.departmentKey)?.department
              ? departments?.find((obj) => obj?.id == r.departmentKey)?.department
              : "-",
            remark: r.remark,
            wardKey: wardKeys?.find((obj) => obj?.id == r.wardKey)?.wardName
              ? wardKeys?.find((obj) => {
                  return obj?.id == r.wardKey;
                })?.wardName
              : "-",
            zoneKey: zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              : "-",
            dept: r.departmentKey,
            ward: r.wardKey,
            zone: r.zoneKey,
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

  const getZoneKeys = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        })),
      );
    });
  };

  // const getWardKeys = () => {
  //   axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
  //     setWardKeys(
  //       r.data.ward.map((row) => ({
  //         id: row.id,
  //         wardName: row.wardName,
  //       })),
  //     );
  //   });
  // };

  const getFilterWards = (value) => {
    axios
      .get(`${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`, {
        params: { departmentId: 21, zoneId: value.target.value },
      })
      .then((r) => {
        console.log("Filtered Wards", r);
        setWardKeys(r.data);
      });
  };

  const onSubmit = (formData, btnType) => {
    console.log("formData", formData);
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      _body = {
        ...formData,
      };
      console.log("1", _body);
    } else {
      _body = {
        ...formData,
        id: formData.id,
      };
      console.log("2", _body);
    }
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(`${urls.SMURL}/mstBuildingMaster/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            getBuildingMaster();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update" || btnType === "Checkout") {
      console.log("current ", formData);
      // var d = new Date(); // for now
      // const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(`${urls.SMURL}/mstBuildingMaster/save`, {
          ...formData,
        })
        .then((res) => {
          if (res.status == 201) {
            formData.id
              ? sweetAlert("Updated!", "Record Updated successfully !", "success")
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            setFetchData(tempData);
            setIsOpenCollapse(false);
            getBuildingMaster();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }
  };

  const cancellButton = () => {
    console.log("23");
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    buildingName: "",
    buildingFloor: "",
    buildingAddress: "",
    buildingNumber: "",
    departmentKey: null,
    zoneKey: null,
    wardKey: null,
    latitude: "",
    longitude: "",
    remark: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      maxWidth: 60,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "buildingName",
      headerName: <FormattedLabel id="buildingName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "buildingFloor",
      headerName: <FormattedLabel id="buildingFloor" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "buildingAddress",
      headerName: <FormattedLabel id="buildingAddress" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "buildingNumber",
      headerName: <FormattedLabel id="buildingNumber" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "zoneKey",
      headerName: <FormattedLabel id="zone" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "wardKey",
      headerName: <FormattedLabel id="ward" />,
      flex: 1,
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
                setValue("wardKey", params.row.ward);
                setValue("zoneKey", params.row.zone);
                setValue("departmentKey", params.row.dept);
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
        <title>Building Master</title>
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
          <FormattedLabel id="buildingMaster" />
        </h2>
      </Box>

      {isOpenCollapse ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="buildingId" />}
                  size="small"
                  fullWidth
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("building_id")}
                  value={nextEntryNumber}
                  sx={{ width: "90%" }}
                  error={!!errors.building_id}
                  helperText={errors?.building_id ? errors.building_id.message : null}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  // label="Building Number"
                  label={<FormattedLabel id="buildingNumber" required />}
                  size="small"
                  fullWidth
                  {...register("buildingNumber")}
                  sx={{ width: "90%" }}
                  error={!!errors.buildingNumber}
                  helperText={errors?.buildingNumber ? errors.buildingNumber.message : null}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid xs={6} item>
                <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.zoneKey}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="zoneName" required />
                  </InputLabel>
                  <Controller
                    name="zoneKey"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        onChange={(value) => {
                          field.onChange(value);
                          getFilterWards(value);
                        }}
                        value={field.value}
                        fullWidth
                        label={<FormattedLabel id="zoneName" required />}
                      >
                        {zoneKeys.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.id}>
                              {item.zoneName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.zoneKey ? errors.zoneKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid xs={6} item>
                <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.wardKey}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="wardName" required />
                  </InputLabel>
                  <Controller
                    name="wardKey"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                      <Select
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                        fullWidth
                        label={<FormattedLabel id="wardName" required />}
                      >
                        {wardKeys.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.id}>
                              {item.wardName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errors?.wardKey ? errors.wardKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid xs={6} item>
                <FormControl fullWidth size="small" sx={{ width: "90%" }} error={errors.departmentKey}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="deptName" required />
                  </InputLabel>
                  <Controller
                    name="departmentKey"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        fullWidth
                        label={<FormattedLabel id="deptName" required />}
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
                  label={<FormattedLabel id="buildingName" required />}
                  size="small"
                  fullWidth
                  {...register("buildingName")}
                  sx={{ width: "90%" }}
                  error={!!errors.buildingName}
                  helperText={errors?.buildingName ? errors.buildingName.message : null}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="floor" required />}
                  size="small"
                  fullWidth
                  {...register("buildingFloor")}
                  sx={{ width: "90%" }}
                  error={!!errors.buildingFloor}
                  helperText={errors?.buildingFloor ? errors.buildingFloor.message : null}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="buildingAddress" required />}
                  size="small"
                  fullWidth
                  {...register("buildingAddress")}
                  sx={{ width: "90%" }}
                  error={!!errors.buildingAddress}
                  helperText={errors?.buildingAddress ? errors.buildingAddress.message : null}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="latitude" />}
                  size="small"
                  fullWidth
                  {...register("latitude")}
                  sx={{ width: "90%" }}
                  error={!!errors.latitude}
                  helperText={errors?.latitude ? errors.latitude.message : null}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label={<FormattedLabel id="longitude" />}
                  size="small"
                  fullWidth
                  {...register("longitude")}
                  sx={{ width: "90%" }}
                  error={!!errors.longitude}
                  helperText={errors?.longitude ? errors.longitude.message : null}
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
                  {...register("remark")}
                  sx={{ width: "90%" }}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}
                />
              </Grid>
            </Grid>

            <Box className={styles.btns}>
              <Button variant="contained" size="small" type="submit">
                {/* <FormattedLabel id="save" /> */}
                <FormattedLabel id={btnSaveText} />
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  cancellButton();
                }}
              >
                <FormattedLabel id="clear" />
              </Button>
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
            </Box>
          </Paper>
        </form>
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
                getBuildingMaster(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getBuildingMaster(_data, data.page);
              }}
            />
          </Grid>
        </>
      )}
    </>
  );
}
export default BuildingMaster;
