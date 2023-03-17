import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/Auditorium";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
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

const Auditorium = () => {
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
  const language = useSelector((state) => state.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getZoneName();
    getWardNames();
  }, []);

  useEffect(() => {
    getAuditorium();
  }, [wardNames, zoneNames]);

  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(r.data.zone);
    });
  };

  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(r.data.ward);
    });
  };

  const getAuditorium = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log("res aud", res);

        let result = res.data.mstAuditoriumList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            srNo: i + 1,
            id: val.id,
            auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
            zone: val.zoneId ? zoneNames.find((obj) => obj?.id == val.zoneId)?.zoneName : "Not Available",
            ward: val.wardId ? wardNames.find((obj) => obj?.id == val.wardId)?.wardName : "Not Available",
            address: val.address ? val.address : "-",
            gsiIdGeocode: val.gsiIdGeocode ? val.gsiIdGeocode : "-",
            seatingCapacity: val.seatingCapacity ? val.seatingCapacity : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            activeFlag: val.activeFlag,
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
              getBillType();
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
              getBillType();
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

  const getFilterWards = (value) => {
    axios
      .get(`${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`, {
        params: { departmentId: 30, zoneId: value.target.value },
      })
      .then((r) => {
        console.log("Filtered Wards", r);
        setWardNames(r.data);
      });
  };

  const resetValuesCancell = {
    zone: null,
    wardName: null,
    auditoriumName: "",
    address: "",
    gsiIdGeocode: "",
    seatingCapacity: "",
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
    const finalBodyForApi = {
      ...formData,
      zoneId: Number(formData.zone),
      wardId: Number(formData.wardName),
      seatingCapacity: Number(formData.seatingCapacity),
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.PABBMURL}/mstAuditorium/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 201) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getAuditorium();
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
      headerName: "Sr No",
      maxWidth: 60,
      headerAlign: "center",
    },
    {
      field: "ward",
      headerName: "Ward",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "zone",
      headerName: "Zone",
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: "Auditorium",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "gsiIdGeocode",
      headerName: "gsi Id Geocode",
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "seatingCapacity",
      headerName: "Seating Capacity",
      flex: 0.4,
      headerAlign: "center",
    },
  ];

  return (
    <div>
      <Paper>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {/* <FormattedLabel id="addAuditorium" />{" "} */}
            New Auditorium Entry
          </h2>
        </Box>
        {isOpenCollapse && (
          <FormProvider {...methods}>
            {/* <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit> */}
            <form onSubmit={handleSubmit(onSubmitForm)}>
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
                  }}
                >
                  <FormControl variant="standard" error={!!errors.zone} sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">zone</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // getFilterWards(value);
                          }}
                          label="zone"
                        >
                          {zoneNames &&
                            zoneNames.map((zoneName, index) => (
                              <MenuItem key={index} value={zoneName.id}>
                                {zoneName.zoneName}
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
                  <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.wardName}>
                    <InputLabel id="demo-simple-select-standard-label">ward</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="wardName"
                        >
                          {wardNames &&
                            wardNames.map((wardName, index) => (
                              <MenuItem key={index} value={wardName.id}>
                                {wardName.wardName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="wardName"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.wardName ? errors.wardName.message : null}</FormHelperText>
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
                    id="standard-basic"
                    label="Auditorium Name"
                    variant="standard"
                    sx={{ width: "90%" }}
                    {...register("auditoriumName")}
                    error={!!errors.auditoriumName}
                    helperText={errors?.auditoriumName ? errors.auditoriumName.message : null}
                  />
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
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Address"
                    variant="standard"
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors?.address ? errors.address.message : null}
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
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="gsi Id Geocode"
                    variant="standard"
                    {...register("gsiIdGeocode")}
                    error={!!errors.gsiIdGeocode}
                    helperText={errors?.gsiIdGeocode ? errors.gsiIdGeocode.message : null}
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
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Seating Capacity"
                    variant="standard"
                    {...register("seatingCapacity")}
                    error={errors.seatingCapacity}
                    helperText={errors?.seatingCapacity ? errors.seatingCapacity.message : null}
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
              <Divider />
            </form>
            {/* </Slide> */}
          </FormProvider>
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

export default Auditorium;
