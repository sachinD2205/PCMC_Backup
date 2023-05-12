import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import schema from "../../../../containers/schema/fireBrigadeSystem/vehicleDetailsMaster";

import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { Box, Grid, Typography } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);

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

  const router = useRouter();

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
  const [fireStation, setfireStation] = useState([]);
  const [type, setType] = useState();

  useEffect(() => {
    getData();
  }, [fetchData]);

  useEffect(() => {
    getFireStation();
    getVehicleType();
  }, []);

  // {
  // "vTSSystemID":1,
  // "gPSDeviceId":"fv",
  // "fireStationName":1,
  // "vehicleName":"dfgh",
  // "vehicleType":"dsf",
  // "vehicleNumber":"asdefg",
  // "remark":"sd"
  //  }

  // Get Table - Data
  const getData = () => {
    axios
      .get(
        `${urls.FbsURL}/VehicleDetailsMasterMaster/getVehicleDetailsMasterData`
      )
      .then((res) => {
        // setDataSource(
        //   res.data.map((r, i) => ({
        //     id: r.id,
        //     srNo: i + 1,
        //     courtNo: r.courtNo,
        //     courtName: r.courtName,
        //     area: r.area,
        //     roadName: r.roadName,
        //     landmark: r.landmark,
        //     city: r.city,
        //     pinCode: r.pinCode,
        //   }))
        // );
        console.log("Vehicle Details.....", res?.data);

        setDataSource(res?.data);
      });
  };

  // get Fire Station Name
  const getFireStation = () => {
    axios
      .get(
        `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`
      )
      .then((res) => {
        console.log(res?.data);
        setfireStation(res?.data);
      });
  };

  // get Vehicle Type
  const getVehicleType = () => {
    axios.get(`${urls.FbsURL}/mstVehicleType/get`).then((res) => {
      // console.log("Vehicle Details.....", res?.data);
      setType(res?.data);
    });
  };

  // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   alert("hiii");
  //   console.log("Form Data ", fromData.data);
  //   const id = fromData.id;
  //   // let bodyForApi = {
  //   //   ...fromData,
  //   // };
  //   // Save - DB
  //   // http://localhost:8098/lc/api/court/saveCourt
  //   if (btnSaveText === "Save") {
  //     console.log("Save Clicked !!!!");
  //     const tempData = axios
  //       // .post(`${urls.FbsURL}/religionMaster/saveReligionMaster`, fromData)
  //       .post(
  //         `${urls.FbsURL}/VehicleDetailsMasterMaster/saveVehicleDetailsMaster`,
  //         fromData
  //       )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           // message.success("Data Saved !!!");
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   }
  //   // Update Data Based On ID
  //   //   http://localhost:8098/lc/api/court/editCourt
  //   else if (btnSaveText === "Update") {
  //     console.log("Update ---");
  //     const tempData = axios
  //       .post(
  //         `${urls.FbsURL}/VehicleDetailsMasterMaster/saveVehicleDetailsMaster${id}`,
  //         fromData
  //       )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           // message.success("Data Updated !!!");
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");

  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //         }
  //       });
  //   }
  // };

  const onSubmitForm = (fromData) => {
    // console.log("Form Data ", fromData);
    const tempData = axios
      .post(
        `${urls.FbsURL}/VehicleDetailsMasterMaster/saveVehicleDetailsMaster`,
        fromData
      )
      .then((res) => {
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((err) => console.log(err));
  };

  // Delete By ID
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // await
        axios
          .delete(
            `${urls.FbsURL}/VehicleDetailsMasterMaster/discardVehicleDetailsMaster/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
      }
    });
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
    vTSSystemID: "",
    gPSDeviceId: "",
    fireStationName: "",
    fireStationNameMr: "",
    vehicleName: "",
    vehicleNameMr: "",
    vehicleType: "",
    vehicleTypeMr: "",
    vehicleNumber: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    vTSSystemID: "",
    gPSDeviceId: "",
    fireStationName: "",
    fireStationNameMr: "",
    vehicleName: "",
    vehicleNameMr: "",
    vehicleType: "",
    vehicleTypeMr: "",
    vehicleNumber: "",
  };

  const columns = [
    {
      field: "vTSSystemID",
      headerName: <FormattedLabel id="vTSSystemID" />,
      flex: 1,
    },
    {
      field: "vehicleName",
      headerName: <FormattedLabel id="vehicleName" />,
      flex: 1,
    },
    {
      field: "vehicleNameMr",
      headerName: <FormattedLabel id="vehicleNameMr" />,
      flex: 1,
    },
    {
      field: "vehicleNumber",
      headerName: <FormattedLabel id="vehicleNumber" />,
      flex: 1,
    },

    {
      field: "vehicleType",
      headerName: <FormattedLabel id="vehicleType" />,
      flex: 1,
    },
    {
      field: "vehicleTypeMr",
      headerName: <FormattedLabel id="vehicleTypeMr" />,
      flex: 1,
    },
    {
      field: "gPSDeviceId",
      headerName: <FormattedLabel id="gPSDeviceId" />,
      flex: 1,
    },
    {
      field: "fireStationName",
      headerName: <FormattedLabel id="fireStationName" />,
      flex: 1,
    },
    {
      field: "fireStationNameMr",
      headerName: <FormattedLabel id="fireStationNameMr" />,
      flex: 1,
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
                setIsOpenCollapse(false),
                  setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // Row

  return (
    <>
      {isOpenCollapse && (
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Box
                  style={{
                    margin: "4%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingBottom: "20%",
                  }}
                >
                  <Paper
                    sx={{
                      margin: 1,
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {btnSaveText == "Update" ? (
                          <FormattedLabel id="updateVehicleDetails" />
                        ) : (
                          <FormattedLabel id="addVehicleDetails" />
                        )}
                      </Box>
                    </Box>
                    <br />
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="vTSSystemID" />}
                          variant="standard"
                          {...register("vTSSystemID")}
                          error={!!errors.vTSSystemID}
                          helperText={
                            errors?.vTSSystemID
                              ? errors.vTSSystemID.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="vehicleName" />}
                          variant="standard"
                          {...register("vehicleName")}
                          error={!!errors.vehicleName}
                          helperText={
                            errors?.vehicleName
                              ? errors.vehicleName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "70%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="vehicleNameMr" />}
                          variant="standard"
                          {...register("vehicleNameMr")}
                          error={!!errors.vehicleNameMr}
                          helperText={
                            errors?.vehicleNameMr
                              ? errors.vehicleNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="vehicleNumber" />}
                          variant="standard"
                          {...register("vehicleNumber")}
                          error={!!errors.vehicleNumberEn}
                          helperText={
                            errors?.vehicleNumberEn
                              ? errors.vehicleNumberEn.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ minWidth: "70%" }}
                          error={!!errors.vehicleType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="vehicleType" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Vehicle Type"
                              >
                                {type &&
                                  type.map((typ, index) => (
                                    <MenuItem key={index} value={typ.id}>
                                      {language == "en"
                                        ? typ.vehicleType
                                        : typ.vehicleTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="vehicleType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.vehicleType
                              ? errors.vehicleType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ minWidth: "70%" }}
                          error={!!errors.fireStationName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="fireStationName" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="fireStationName" />}
                              >
                                {fireStation &&
                                  fireStation.map((fire, index) => (
                                    <MenuItem key={index} value={fire.id}>
                                      {language == "en"
                                        ? fire.fireStationName
                                        : fire.fireStationNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="fireStationName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.fireStationName
                              ? errors.fireStationName.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      // className={styles.feildres}
                    >
                      <Grid item xs={4} sx={{ paddingLeft: "5%" }}>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="gPSDeviceId" />}
                          variant="standard"
                          {...register("gPSDeviceId")}
                          error={!!errors.gPSDeviceIdEn}
                          helperText={
                            errors?.gPSDeviceId
                              ? errors.gPSDeviceId.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>

                    <br />
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
                          {btnSaveText == "Update" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            <FormattedLabel id="save" />
                          )}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() =>
                            router.push({
                              pathname:
                                "/FireBrigadeSystem/masters/vehicleDetails",
                            })
                          }
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </form>
            </FormProvider>
          </div>
        </Slide>
      )}

      <Box style={{ display: "flex", marginTop: "5%" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="vehicleDetailsTitle" />}
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
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
            className={styles.adbtn}
            sx={{
              borderRadius: 100,

              padding: 2,
              marginLeft: 1,
              textAlign: "center",
              border: "2px solid #3498DB",
            }}
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Box>
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          disableExport
          // disableToolbarButton
          // disableDensitySelector
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
          autoHeight
          density="compact"
          sx={{
            paddingLeft: "2%",
            paddingRight: "2%",
            // width: "60%",
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              // transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box>
    </>
  );
};

export default Index;
