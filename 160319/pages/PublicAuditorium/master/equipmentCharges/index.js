import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
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
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/EquipmentCharges";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[equipmentCharges].module.css";
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

const EquipmentCharges = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
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

  const language = useSelector((state) => state.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [equipmentCategory, setEquipmentCategory] = useState([]);
  const [equipmentName, setEquipmentName] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getEquipmentCategory();
    getEquipmentName();
    getAuditorium();
  }, []);

  useEffect(() => {
    getEquipmentCharges();
  },[equipmentCategory,equipmentName,auditoriums])

  const getEquipmentCharges = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.PABBMURL}/mstEquipmentCharges/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log(";res", res);

        let result = res.data.mstEquipmentChargesList;
        let _res = result.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1,
            auditoriumName: val.auditoriumName
              ? auditoriums?.find((obj) => {
                  return obj?.id == Number(val.auditoriumName);
                })?.auditoriumName
              : "-",
            equipmentCategory: val.equipmentCategory
              ? equipmentCategory?.find((obj) => {
                  return obj?.id == Number(val.equipmentCategory);
                })?.equipmentCategoryName
              : "-",
            price: val.price ? val.price : "-",
            corporationRate: val.corporationRate ? val.corporationRate : "-",
            id: val.id,
            multiplyingFactor: val.multiplyingFactor,
            totalAmount: val.totalAmount,
            equipmentName: val.equipmentName
              ? equipmentName?.find((obj) => {
                  return obj?.id == Number(val.equipmentName);
                })?.equipmentName
              : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
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

  const getEquipmentCategory = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.PABBMURL}/mstEquipmentCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log("11res", res);

        let result = res.data.mstEquipmentCategoryList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            activeFlag: val.activeFlag,
            srNo: val.id,
            equipmentCategoryName: val.equipmentCategoryName,
            id: val.id,
          };
        });

        setEquipmentCategory(_res);
      });
  };

  const getEquipmentName = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.PABBMURL}/mstEquipment/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log("11res", res);

        let result = res.data.mstEquipmentList;
        let _res = result.map((val, i) => {
          console.log("4214", val);
          return {
            activeFlag: val.activeFlag,
            srNo: val.id,
            equipmentName: val.equipmentName,
            id: val.id,
          };
        });

        setEquipmentName(_res);
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
              getEquipmentCharges();
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
              getEquipmentCharges();
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

  const resetValuesCancell = {
    billPrefix: "",
    billType: "",
    fromDate: null,
    toDate: null,
    remark: "",
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
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios.post(`${urls.PABBMURL}/mstEquipmentCharges/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 201) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getEquipmentCharges();
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
      field: "auditoriumName",
      headerName: "Auditorium",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "equipmentName",
      headerName: "Equipment Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "equipmentCategory",
      headerName: "Equipment Category",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "price",
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "corporationRate",
      headerName: "Corporation Rate",
      flex: 0.8,
      headerAlign: "center",
    },
    {
      field: "multiplyingFactor",
      headerName: "Multiplying Factor",
      flex: 0.8,
      headerAlign: "center",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 0.8,
      headerAlign: "center",
    },
  ];

  return (
    <div>
      <Paper style={{ marginTop: "10%" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
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
                    alignItems: "end",
                  }}
                >
                  <FormControl
                    error={errors.auditoriumName}
                    variant="outlined"
                    size="small"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">Select Auditorium</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
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
                      name="auditoriumName"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.auditoriumName ? errors.auditoriumName.message : null}
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
                    alignItems: "end",
                  }}
                >
                  <FormControl
                    error={errors.equipmentCategory}
                    variant="outlined"
                    size="small"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">Equipment Category</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Equipment Category"
                        >
                          {equipmentCategory?.map((equipmentCat, index) => {
                            return (
                              <MenuItem key={index} value={equipmentCat.id}>
                                {equipmentCat.equipmentCategoryName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="equipmentCategory"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.equipmentCategory ? errors.equipmentCategory.message : null}
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
                    alignItems: "end",
                  }}
                >
                  <FormControl
                    error={errors.equipmentName}
                    variant="outlined"
                    size="small"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">Equipment Name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Equipment Name"
                        >
                          {equipmentName?.map((equipmentCat, index) => {
                            return (
                              <MenuItem key={index} value={equipmentCat.id}>
                                {equipmentCat.equipmentName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="equipmentName"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.equipmentName ? errors.equipmentName.message : null}
                    </FormHelperText>
                  </FormControl>
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
                    id="standard-basic"
                    label="Price"
                    variant="standard"
                    sx={{ width: "90%" }}
                    {...register("price")}
                    error={!!errors.price}
                    helperText={errors?.price ? errors.price.message : null}
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
                    label="Corporation Rate"
                    variant="standard"
                    {...register("corporationRate")}
                    error={!!errors.corporationRate}
                    helperText={errors?.corporationRate ? errors.corporationRate.message : null}
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
                    label="Multiplying Factor"
                    variant="standard"
                    {...register("multiplyingFactor")}
                    error={!!errors.multiplyingFactor}
                    helperText={errors?.multiplyingFactor ? errors.multiplyingFactor.message : null}
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
                    id="standard-basic"
                    label="Total Amount"
                    sx={{
                      width: "90%",
                    }}
                    variant="standard"
                    {...register("totalAmount")}
                    error={!!errors.totalAmount}
                    helperText={errors?.totalAmount ? errors.totalAmount.message : null}
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
                    type="submit"
                    size="small"
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
                    variant="contained"
                    color="error"
                    size="small"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    Exit
                  </Button>
                </Grid>
              </Grid>
              <Divider />
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
              getEquipmentCharges(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getEquipmentCharges(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </div>
  );
};

export default EquipmentCharges;
