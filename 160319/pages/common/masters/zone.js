import {
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
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../containers/schema/common/zone";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import styles from "../../../styles/[zone].module.css";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();

  useEffect(() => {
    getZone();
  }, []);

  const getZone = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
       
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res, i) => {
        console.log(";res", res);

        let result = res.data.zone;
        setDataSource(
          result.map((res, i) => {
            return {
              activeFlag: res.activeFlag,
              gisId: res.gisId,
              srNo: i + 1,
              id: res.id,
              fromDate: moment(res.fromDate).format("llll"),
              toDate: moment(res.toDate).format("llll"),
              zonePrefix: res.zonePrefix,
              zonePrefixMr: res.zonePrefixMr,
              status: res.status,
              zoneNo: res.zoneNo,
              zoneNoMr: res.zoneNoMr,
              zoneName: res.zoneName,
              zoneNameMr: res.zoneNameMr,
              zoneAddress: res.zoneAddress,
              zoneaddressMr: res.zoneaddressMr,
              latitude:res.latitude,
              longitude:res.longitude,
              status: res.activeFlag === "Y" ? "Active" : "InActive",
            };
          })
        );

        // setDataSource(
        //   res.data.billType.map((val, i) => {
        //     return {};
        //   })
        // );
        // setDataSource(()=>abc);
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
            .post(`${urls.CFCURL}/master/zone/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getZone();
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
            .post(`${urls.CFCURL}/master/zone/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getZone();
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
    console.log("formData", formData);
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/zone/save`, finalBodyForApi)
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getZone();
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
    gisId: "",
    zonePrefix: "",
    zonePrefixMr: "",
    zoneNo: "",
    zoneNoMr: "",
    zoneName: "",
    zoneNameMr: "",
    zoneAddress: "",
    zoneaddressMr: "",
    longitude:"",
    latitude:""
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
    gisId: "",
    zonePrefix: "",
    zonePrefixMr: "",
    zoneNo: "",
    zoneNoMr: "",
    zoneName: "",
    zoneNameMr: "",
    zoneAddress: "",
    zoneaddressMr: "",
    longitude:"",
    latitude:""
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width:10,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },

    {
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      // type: "number",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "zoneNameMr",
      headerName: <FormattedLabel id="zoneNameMr" />,
      // type: "number",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "gisId",
      headerName: <FormattedLabel id="gisId" />,
      // type: "number",
      flex: 1,
      minWidth: 70,
    },
   
    {
      field: "latitude",
      headerName: "Lat ID",
      // type: "number",
      flex: 1,
      minWidth: 70,
    },
    {
      field: "longitude",
      headerName:"Log ID",
      // type: "number",
      flex: 1,
      minWidth: 70,
    },
   
    // {
    //   field: "zonePrefix",
    //   headerName: <FormattedLabel id="zonePrefix" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 100,
    // },
    // {
    //   field: "zoneNo",
    //   headerName: <FormattedLabel id="zoneNo" />,
    //   flex: 1,
    //   minWidth: 100,
    // },
  
    // {
    //   field: "zoneAddress",
    //   headerName: "Zone Address",
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 130,
    // },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      // type: "number",
      flex: 1,
      minWidth: 80,
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
Zone
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper style={{ margin: "50px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: "10px" }}>
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
                    <FormControl
                      style={{ backgroundColor: "white" }}
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
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white" }}
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
                  <Grid
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
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="zoneName" />}
                      variant="standard"
                      {...register("zoneName")}
                      error={!!errors.zoneName}
                      helperText={
                        errors?.zoneName ? errors.zoneName.message : null
                      }
                    />
                  </Grid>
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
                    <TextField
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="zoneNameMr" />}
                      variant="standard"
                      {...register("zoneNameMr")}
                      error={!!errors.zoneNameMr}
                      helperText={
                        errors?.zoneNameMr ? errors.zoneNameMr.message : null
                      }
                    />
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
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC ID"
                    label={<FormattedLabel id="gisId" />}
                    variant="standard"
                    {...register("gisId")}
                    error={!!errors.gisId}
                    helperText={errors?.gisId ? errors.gisId.message : null}
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
                    label={<FormattedLabel id="zonePrefix" />}
                    // label="CFC Name"
                    variant="standard"
                    {...register("zonePrefix")}
                    error={!!errors.zonePrefix}
                    helperText={
                      errors?.zonePrefix ? errors.zonePrefix.message : null
                    }
                  />
                </Grid> */}
              
              <Grid
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
                    label="Lat ID"
                    variant="standard"
                    {...register("latitude")}
                    error={!!errors.latitude}
                    helperText={errors?.latitude ? errors.latitude.message : null}
                  />
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
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC ID"
                    label="Log ID"
                    variant="standard"
                    {...register("longitude")}
                    error={!!errors.longitude}
                    helperText={errors?.longitude ? errors.longitude.message : null}
                  />
                </Grid>


                <Grid container style={{ padding: "10px" }}>
               {/* <Grid
                  item
                  xs={4}
                  // sx={{ }}
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
                    label={<FormattedLabel id="zoneNo" />}
                    // label="Recharge Amount"
                    variant="standard"
                    {...register("zoneNo")}
                    error={!!errors.zoneNo}
                    helperText={errors?.zoneNo ? errors.zoneNo.message : null}
                  />
                </Grid>  */}
                  {/* <Grid
                    item
                    xs={4}
                    // sx={{ }}
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
                      label="Zone Address"
                      // label="Recharge Amount"
                      variant="standard"
                      {...register("zoneAddress")}
                      error={!!errors.zoneAddress}
                      helperText={
                        errors?.zoneAddress ? errors.zoneAddress.message : null
                      }
                    />
                  </Grid> */}
                </Grid>
              </Grid>

              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    {<FormattedLabel id={btnSaveText} />}
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
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
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={9}></Grid>
          <Grid
            item
            xs={2}
            style={{ display: "flex", justifyContent: "center" }}
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
        {console.log("11111", dataSource)}
        <DataGrid
          autoHeight
          sx={{
            margin: 5,
          }}
          rows={dataSource}
          // rows={abc}
          // rows={jugaad}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => {
            getZone(newPageSize);
            setPageSize(newPageSize);
          }}
          onPageChange={(e) => {
            console.log("event", e);
            getZone(pageSize, e);
            console.log("dataSource->", dataSource);
          }}
          // {...dataSource}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          rowCount={totalElements}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
