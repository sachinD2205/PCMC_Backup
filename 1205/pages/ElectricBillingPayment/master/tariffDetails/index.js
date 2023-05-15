// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";

import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";

import styles from "../../../../styles/ElectricBillingPayment_Styles/tariffDetail.module.css";
import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/tariffDetailSchema";

import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
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
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [tariffCategoryDropDown ,setTariffCategoryDropDown] = useState({
    id:1,
    tariffCategoryEn:"",
    tariffCategoryMr: "",
  })
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getTariffDetails();
  }, [fetchData]);

  useEffect(()=>{
      getTariffCategory();
  },[])

  // get Tariff Category

  const getTariffCategory = () =>{
    axios.get(`${urls.EBPSURL}/mstTariffCategory/getAll`).then((r) => {
      let result = r.data.mstTariffCategoryList;
      console.log("getTariffCategory", result);
      let res =
        result &&
        result.map((r) => {
          return {
            id: r.id,
            tariffCategoryEn : r.tariffCategory,
            tariffCategoryMr: r.tariffCategoryMr,
          };
        });
        // let temp = res && res.find((obj)=>obj.id == res?.tariffCategory)
      //   console.log('slumKey', temp?.slumEn ? temp?.slumEn : "-" )
      // setValue('slumKey', temp?.slumEn ? temp?.slumEn : "-" )
      setTariffCategoryDropDown(res);
    });
  }

  // Get Table - Data
  const getTariffDetails = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.EBPSURL}/mstTariffDetails/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.mstTariffDetailsList;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * 10,
            energyCharge: r.energyCharge,
            fixedDemandCharge: r.fixedDemandCharge,
            fromDate: r.fromDate,
            toDate: r.toDate,
            tariffCategory: r.tariffCategory,
            tariffCategoryMr: r.tariffCategoryMr,
            fromRange: r.fromRange,
            toRange: r.toRange,
            units: r.units,
            wheelingCharge: r.wheelingCharge,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: "Y",
    };
    delete _body.id;
    if (btnSaveText === "Save") {
      console.log("...save",_body)
      const tempData = axios
        .post(`${urls.EBPSURL}/mstTariffDetails/save`, _body)
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("...Update")
      const tempData = axios
        .post(`${urls.EBPSURL}/mstTariffDetails/save`, _body)
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getTariffDetails();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        });
    }
  };

  // Delete By ID
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
            .post(`${urls.EBPSURL}/mstTariffDetails/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getTariffDetails();
                // setButtonInputState(false);
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
          axios
            .post(`${urls.EBPSURL}/mstTariffDetails/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getTariffDetails();
                // setButtonInputState(false);
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
    energyCharge: "",
    fixedDemandCharge: "",
    fromDate: "",
    fromRange: "",
    tariffCategory: "",
    tariffCategoryMr: "",
    toDate: "",
    toRange: "",
    units: "",
    wheelingCharge: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    energyCharge: "",
    fixedDemandCharge: "",
    fromDate: "",
    fromRange: "",
    tariffCategory: "",
    tariffCategoryMr: "",
    toDate: "",
    toRange: "",
    units: "",
    wheelingCharge: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: "SR No",
      //   flex: 1,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "energyCharge",
      headerName: "Energy Charge",
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fixedDemandCharge",
      headerName: "Fixed Demand Charge",
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: "From Date",
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: "toDate",
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fromRange",
      headerName: "from Range",
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toRange",
      headerName: "To Range",
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tariffCategory",
      headerName: "Tariff Category",
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "units",
      headerName: "Units",
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wheelingCharge",
      headerName: "Wheeling Charge",
      //   flex: 1,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
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
          </Box>
        );
      },
    },
  ];

  // Row

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          Tarriff Details
          {/* <FormattedLabel id="LoadEquipmentDetails" /> */}
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Grid container>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                {/* for energy charge */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    label={<FormattedLabel id="energyCharge" />}
                    style={{ marginTop: 10, width:"50%" }}
                    id="standard-basic"
                    variant="standard"
                    {...register("energyCharge")}
                    error={!!errors.energyCharge}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("energyCharge") ? true : false) ||
                        (router.query.energyCharge ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.energyCharge
                        ? "Energy Charge is Required !!!"
                        : null
                    }
                  />
                </Grid>

                {/* for fixedDemandCharge */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                  id="standard-basic"
                    label={<FormattedLabel id="fixedDemandCharge" />}
                    style={{ marginTop: 10, width:"50%" }}
                    variant="standard"
                    {...register("fixedDemandCharge")}
                    error={!!errors.fixedDemandCharge}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("fixedDemandCharge") ? true : false) ||
                        (router.query.fixedDemandCharge ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.fixedDemandCharge
                        ? "Fixed Demand Charge is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                {/* for from date */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl
                    variant="standard"
                    style={{ marginTop: 10, width:"50%" }}
                    error={!!errors.fromDate}
                  >
                    <Controller
                      // variant="standard"
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="fromDate" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="standard"
                                // sx={{ width: 230 }}
                                InputLabelProps={{
                                  style: {
                                    fontSize: 12,
                                    marginTop: 3,
                                  },

                                  //true
                                  shrink: true,
                                  // (watch("fromDate") ? true : false) ||
                                  // (router.query.fromDate ? true : false),
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                  {/*for  To date */}

                  <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                  <FormControl
                    variant="standard"
                    style={{ marginTop: 10, width:"50%" }}
                    error={!!errors.toDate}
                  >
                    <Controller
                      // variant="standard"
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="toDate" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="standard"
                                // sx={{ width: 230 }}
                                InputLabelProps={{
                                  style: {
                                    fontSize: 12,
                                    marginTop: 3,
                                  },

                                  //true
                                  shrink: true,
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={3} xl={3}></Grid>

                 {/* for tariff category */}
              

                <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
            >
              <FormControl
                disabled={router.query.pageMode == "view" ? true : false}
                variant="standard"
                error={!!errors.tariffCategory}
                sx={{ width: "50%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="tariffCategoryEn" />
                </InputLabel>
                <Controller
                 
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // @ts-ignore
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="tariffCategory"
                    >
                      {tariffCategoryDropDown &&
                        tariffCategoryDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.tariffCategoryEn
                              : // @ts-ignore
                                value?.tariffCategoryMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="tariffCategory"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.tariffCategory ? errors.tariffCategory.message : null}</FormHelperText>
              </FormControl>
            </Grid>

               {/* for wheelingCharge */}

               <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                       label={<FormattedLabel id="wheelingCharge" />}
                       style={{ marginTop: 10, width:"50%" }}
                    id="standard-basic"
                    variant="standard"
                    {...register("wheelingCharge")}
                    error={!!errors.wheelingCharge}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("wheelingCharge") ? true : false) ||
                        (router.query.wheelingCharge ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.wheelingCharge
                        ? "wheelingCharge is Required !!!"
                        : null
                    }
                  />
                </Grid>

                {/* for from range */}

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                       label={<FormattedLabel id="fromRange" />}
                       style={{ marginTop: 10, width:"50%" }}
                    id="standard-basic"
                    variant="standard"
                    {...register("fromRange")}
                    error={!!errors.fromRange}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("fromRange") ? true : false) ||
                        (router.query.fromRange ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.fromRange ? "From Range is Required !!!" : null
                    }
                  />
                </Grid>

                {/* for To range */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                       label={<FormattedLabel id="toRange" />}
                       style={{ marginTop: 10, width:"50%" }}
                    id="standard-basic"
                    variant="standard"
                    {...register("toRange")}
                    error={!!errors.toRange}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("toRange") ? true : false) ||
                        (router.query.toRange ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.toRange ? "To Range is Required !!!" : null
                    }
                  />
                </Grid>


                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
                
                {/* for units */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                       label={<FormattedLabel id="unit" />}
                       style={{ marginTop: 10, width:"50%" }}
                    id="standard-basic"
                    variant="standard"
                    {...register("units")}
                    error={!!errors.units}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("units") ? true : false) ||
                        (router.query.units ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.units ? "Units is Required !!!" : null
                    }
                  />
                </Grid>

             
        


                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Grid item>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText === "Update" ? (
                        <FormattedLabel id="update" />
                      ) : (
                        <FormattedLabel id="save" />
                      )}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
                {/* </div> */}
              </Grid>
            </Slide>
          )}
        </form>
      </FormProvider>

      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          // type='primary'
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
          <FormattedLabel id="add" />
        </Button>
      </div>

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
        // columns={columns}
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
          getTariffDetails(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getTariffDetails(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
