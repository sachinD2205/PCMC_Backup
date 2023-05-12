import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Box,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GridToolbar } from "@mui/x-data-grid";

import billingCycleSchema from "../../../../containers/schema/slumManagementSchema/billingCycleSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import styles from "../../../styles/[zone].module.css";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset, watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(billingCycleSchema) });



  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const router = useRouter();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const [applicableOnTypes, setApplicableOnTypes] = useState([]);
  const myObject = [{
    id: 'S', key: 'Slum'
  },
  { id: 'H', key: 'Hut' }];

  useEffect(() => {
    getBillingCycle();
    // getSubUsageType();
  }, []);

  const getBillingCycle = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.SLUMURL}/mstSbBillingCycle/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res, i) => {
        let result = res.data.mstSbBillingCycleList;
        const _res = result.map((res, i) => {
          return {
            srNo: i + 1,
            id: res.id,
            fromDate: moment(res.fromDate).format("llll"),
            toDate: moment(res.toDate).format("llll"),
            billingCyclePrefix: res.billingCyclePrefix,
            billingCycle: res.billingCycle,
            applicableOn: res.applicableOn,

            billingCycleMr: res.billingCycleMr,
            remarks: res.remarks,
            activeFlag: res.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          };
        })
        setDataSource([..._res]);
        setApplicableOnTypes([...myObject])
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
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
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstSbBillingCycle/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getBillingCycle();
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
          axios
            .post(`${urls.SLUMURL}/mstSbBillingCycle/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getBillingCycle();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
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
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };
    axios
      .post(`${urls.SLUMURL}/mstSbBillingCycle/save`, finalBodyForApi)
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getBillingCycle();

          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    billingCycleMr: "",
    billingCycle: "",
    remarks: "",
    billingCyclePrefix: "",

  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    billingCycleMr: "",
    billingCycle: "",
    remarks: "",
    billingCyclePrefix: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "billingCyclePrefix",
      headerName: <FormattedLabel id="billingCyclePrefix" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },

    {
      field: "billingCycle",
      headerName: <FormattedLabel id="billingCycle" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    // {
    //   field: "applicableOnName",
    //   headerName: <FormattedLabel id="applicableOn" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 150,
    // },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
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
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {/* <div
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
      > */}
      {/* Construction Type */}
      {/* <FormattedLabel id='billingCycle' />
      </div> */}
      <Paper elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}>
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
          <h2> <FormattedLabel id='billingCycle' /></h2>
        </Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl
                     style={{ backgroundColor: "white",width:250 ,paddingTop:10 }}
                    sx={{ marginTop: 5 }}
                    error={!!errors.fromDate}
                  >
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="fromDate" />}
                              </span>
                            }
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
                    <FormHelperText>
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item xs={12} sm={6} md={4} lg={4} xl={4}
                >
                  <FormControl
                    style={{ backgroundColor: "white",width:250 ,paddingTop:10 }}
                    sx={{ marginTop: 5 }}
                    error={!!errors.toDate}
                  >
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
                                {<FormattedLabel id="toDate" />}
                              </span>
                            }
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
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
          
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4} >
                <TextField
                  size="small"
                  style={{ backgroundColor: "white",width:250 ,paddingTop:10 }}
                  id="outlined-basic"
                  // label="CFC Name Mr"
                  label={<FormattedLabel id="billingCyclePrefix" />}
                  variant="standard"
                  {...register("billingCyclePrefix")}
                  error={!!errors.billingCyclePrefix}
                  helperText={
                    errors?.billingCyclePrefix ? errors.billingCyclePrefix.message : null
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}  >
                <TextField
                  size="small"
                  style={{ backgroundColor: "white",width:250 ,paddingTop:10 }}
                  id="outlined-basic"
                  // label="CFC Name Mr"
                  label={<FormattedLabel id="billingCycle" />}
                  variant="standard"
                  {...register("billingCycle")}
                  error={!!errors.billingCycle}
                  helperText={
                    errors?.billingCycle ? errors.billingCycle.message : null
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4} >
                <TextField
                  size="small"
                  style={{ backgroundColor: "white",width:250 ,paddingTop:10 }}
                  id="outlined-basic"
                  // label="CFC Name Mr"
                  label={<FormattedLabel id="billingCycleMr" />}
                  variant="standard"
                  {...register("billingCycleMr")}
                  error={!!errors.billingCycleMr}
                  helperText={
                    errors?.billingCycleMr ? errors.billingCycleMr.message : null
                  }
                />
              </Grid>
              {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC ID"
                    label={<FormattedLabel id="remarks" />}
                    variant="standard"
                    {...register("remarks")}
                    error={!!errors.remarks}
                    helperText={errors?.remarks ? errors.remarks.message : null}
                  />
                </Grid> */}


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
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "end" }}
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
                setDeleteButtonState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
        </Grid>
        <DataGrid
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
          density="compact"
          pagination
          paginationMode="server"
          rowCount={totalElements}
          rowsPerPageOptions={[5]}
          pageSize={pageSize}
          rows={dataSource}
          columns={columns}
          onPageChange={(_data) => {
            getBillingCycle(pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getBillingCycle(pageSize, _data);
          }}
        //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;