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
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { Box, Grid, Typography } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import schema from "../../../../containers/schema/fireBrigadeSystem/fireStationDetailsMaster";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

const Index = () => {
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
  const [ward, setWard] = useState([]);
  const [zone, setZone] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [name, setName] = useState("React");

  const locateButtons = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      // setShowText(true);
    });
  };

  const showDiv = () => {
    setShowText(true);
    setShowButton(false);
    locateButtons();
  };

  const mapStyles = {
    width: 400,
    height: 200,
    position: "static",
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  useEffect(() => {
    getWard();
    getZone();
  }, []);

  // Get Table - Data
  const getData = () => {
    axios
      .get(
        `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`
      )
      .then((res) => {
        setDataSource(
          res.data.map((r, i) => {
            return { srNo: i + 1, ...r };
          })
        );
        console.log("res.data", res.data);
      });
  };

  // Get Ward
  const getWard = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      setWard(res.data.ward);
      console.log("res.data", res.data);
    });
  };

  // Get Zone
  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(res.data.zone);
      console.log("res.data", res.data);
    });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    console.log("Form Data ", fromData);
    const tempData = axios
      .post(
        `${urls.FbsURL}/fireStationDetailsMaster/saveFireStationDetailsMaster`,
        fromData
      )
      .then((res) => {
        console.log(res);
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
      });
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
            `${urls.FbsURL}/fireStationDetailsMaster/discardFireStationDetailsMaster/${value}`
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

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    gISID: "",
    fireStationName: "",
    ward: "",
    zone: "",
    address: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    gISID: "",
    fireStationName: "",
    ward: "",
    zone: "",
    address: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr. Number",
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
      field: "gISID",
      headerName: "GIS ID",
      flex: 1,
    },
    { field: "address", headerName: <FormattedLabel id="address" />, flex: 1 },
    {
      field: "addressMr",
      headerName: <FormattedLabel id="addressMr" />,
      flex: 1,
    },
    // { field: "ward", headerName: <FormattedLabel id="ward" />, flex: 1 },
    { field: "zone", headerName: <FormattedLabel id="zone" />, flex: 1 },
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
              className={styles.edit}
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
              className={styles.delete}
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
    // <Paper
    //   sx={{
    //     marginLeft: 5,
    //     marginRight: 5,
    //     marginTop: 5,
    //     marginBottom: 5,
    //     paddingBottom: 5,
    //     paddingTop: 2,
    //   }}
    //   elevation={5}
    // >
    //   {isOpenCollapse && (
    //     <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
    //       <div>
    //         <FormProvider {...methods}>
    //           <form onSubmit={handleSubmit(onSubmitForm)}>
    //             <div className={styles.small}>
    //               <div className={styles.row}>
    //                 <div>
    //                   <TextField
    //                     sx={{ width: 250 }}
    //                     id="standard-basic"
    //                     // label="GIS ID"
    //                     label={<FormattedLabel id="gISID" />}
    //                     variant="standard"
    //                     {...register("gISID")}
    //                     error={!!errors.gISID}
    //                     helperText={errors?.gISID ? errors.gISID.message : null}
    //                   />
    //                 </div>
    //                 <div>
    //                   <TextField
    //                     sx={{ width: 250 }}
    //                     id="standard-basic"
    //                     // label="Fire Station Name"
    //                     label={<FormattedLabel id="fireStationName" />}
    //                     variant="standard"
    //                     {...register("fireStationName")}
    //                     error={!!errors.fireStationName}
    //                     helperText={
    //                       errors?.fireStationName
    //                         ? errors.fireStationName.message
    //                         : null
    //                     }
    //                   />
    //                 </div>
    //                 <div>
    //                   <TextField
    //                     sx={{ width: 250 }}
    //                     id="standard-basic"
    //                     // label="फायर स्टेशनचे नाव"
    //                     label={<FormattedLabel id="fireStationNameMr" />}
    //                     variant="standard"
    //                     {...register("fireStationNameMr")}
    //                     error={!!errors.fireStationNameMr}
    //                     helperText={
    //                       errors?.fireStationNameMr
    //                         ? errors.fireStationNameMr.message
    //                         : null
    //                     }
    //                   />
    //                 </div>
    //               </div>
    //               <div className={styles.row}>
    //                 {/* <div>
    //                     <TextField
    //                       sx={{ width: 250 }}
    //                       id="standard-basic"
    //                       // label="GIS आयडी"
    //                       label={<FormattedLabel id="gISIDMr" />}
    //                       variant="standard"
    //                       {...register("gISIDMr")}
    //                       error={!!errors.gISID}
    //                       helperText={
    //                         errors?.gISID ? errors.gISID.message : null
    //                       }
    //                     />
    //                   </div> */}
    //                 <div>
    //                   <TextField
    //                     sx={{ width: 250 }}
    //                     id="standard-basic"
    //                     // label="Address"
    //                     label={<FormattedLabel id="address" />}
    //                     variant="standard"
    //                     {...register("address")}
    //                     error={!!errors.address}
    //                     helperText={
    //                       errors?.address ? errors.address.message : null
    //                     }
    //                   />
    //                 </div>
    //                 <div>
    //                   <TextField
    //                     sx={{ width: 250 }}
    //                     id="standard-basic"
    //                     // label="पत्ता"
    //                     label={<FormattedLabel id="addressMr" />}
    //                     variant="standard"
    //                     {...register("addressMr")}
    //                     error={!!errors.addressMr}
    //                     helperText={
    //                       errors?.addressMr ? errors.addressMr.message : null
    //                     }
    //                   />
    //                 </div>
    //                 <div>
    //                   <FormControl
    //                     variant="standard"
    //                     sx={{ m: 1, minWidth: 120 }}
    //                     error={!!errors.zone}
    //                   >
    //                     {/* <label>Officer Name to Release Vehicle</label><br/> */}
    //                     <InputLabel id="demo-simple-select-standard-label">
    //                       {<FormattedLabel id="zone" />}
    //                     </InputLabel>
    //                     <Controller
    //                       render={({ field }) => (
    //                         <Select
    //                           sx={{ width: 250 }}
    //                           value={field.value}
    //                           onChange={(value) => field.onChange(value)}
    //                           label={<FormattedLabel id="zone" />}
    //                         >
    //                           {zone &&
    //                             zone.map((zo, index) => (
    //                               <MenuItem key={index} value={zo.id}>
    //                                 {zo.zoneName}
    //                               </MenuItem>
    //                             ))}
    //                         </Select>
    //                       )}
    //                       name="zone"
    //                       control={control}
    //                       defaultValue=""
    //                     />
    //                     <FormHelperText>
    //                       {errors?.zone ? errors.zone.message : null}
    //                     </FormHelperText>
    //                   </FormControl>
    //                 </div>
    //               </div>
    //               <div className={styles.row}>
    //                 <div>
    //                   <TextField
    //                     sx={{ width: 250 }}
    //                     id="standard-basic"
    //                     label="Latitude"
    //                     // label={<FormattedLabel id="addressMr" />}
    //                     variant="standard"
    //                     {...register("latitude")}
    //                     error={!!errors.latitude}
    //                     helperText={
    //                       errors?.latitude ? errors.latitude.message : null
    //                     }
    //                   />
    //                 </div>
    //                 <div>
    //                   <TextField
    //                     sx={{ width: 250 }}
    //                     id="standard-basic"
    //                     label="Longitude"
    //                     // label={<FormattedLabel id="addressMr" />}
    //                     variant="standard"
    //                     {...register("longitude")}
    //                     error={!!errors.longitude}
    //                     helperText={
    //                       errors?.longitude ? errors.longitude.message : null
    //                     }
    //                   />
    //                 </div>

    //                 {/* <div>
    //                   <FormControl
    //                     variant="standard"
    //                     sx={{ m: 1, minWidth: 120 }}
    //                     error={!!errors.fireStationName}
    //                   >
    //                     <InputLabel id="demo-simple-select-standard-label">
    //                       {<FormattedLabel id="ward" />}
    //                     </InputLabel>
    //                     <Controller
    //                       render={({ field }) => (
    //                         <Select
    //                           sx={{ width: 250 }}
    //                           value={field.value}
    //                           onChange={(value) => field.onChange(value)}
    //                           label={<FormattedLabel id="ward" />}
    //                         >
    //                           {ward &&
    //                             ward.map((wa, index) => (
    //                               <MenuItem key={index} value={wa.id}>
    //                                 {wa.wardName}
    //                               </MenuItem>
    //                             ))}
    //                         </Select>
    //                       )}
    //                       name="ward"
    //                       control={control}
    //                       defaultValue=""
    //                     />
    //                     <FormHelperText>
    //                       {errors?.ward ? errors.ward.message : null}
    //                     </FormHelperText>
    //                   </FormControl>
    //                 </div> */}
    //               </div>

    //               <div className={styles.row}>
    //                 <div>
    //                   <TextField
    //                     autoFocus
    //                     sx={{ width: 250 }}
    //                     id="standard-basic"
    //                     label="GIS Location"
    //                     variant="standard"
    //                     {...register("gISLocation")}
    //                     error={!!errors.gISLocation}
    //                     helperText={
    //                       errors?.gISLocation
    //                         ? errors.gISLocation.message
    //                         : null
    //                     }
    //                   />

    //                   {/* <div className={styles.btn}> */}
    //                   <br />
    //                   <br />
    //                   {showText ? (
    //                     <div>
    //                       <Map
    //                         google={google}
    //                         zoom={10}
    //                         style={mapStyles}
    //                         center={{
    //                           lat: latitude,
    //                           lng: longitude,
    //                         }}
    //                         // zoom={locations.length === 1 ? 18 : 13}
    //                         disableDefaultUI={true}
    //                       >
    //                         {latitude && (
    //                           <Marker
    //                             name={"This is test name"}
    //                             position={{ lat: latitude, lng: longitude }}
    //                           />
    //                         )}
    //                       </Map>
    //                     </div>
    //                   ) : null}

    //                   {showButton ? (
    //                     <Button
    //                       variant="contained"
    //                       color="primary"
    //                       onClick={() => showDiv()}
    //                     >
    //                       Locate
    //                     </Button>
    //                   ) : null}
    //                   {/* </div> */}
    //                 </div>
    //               </div>
    //               <br />
    //               <br />
    //               <br />
    //               <br />
    //               <br />
    //               <br />
    //               <br />
    //               <br />
    //             </div>

    //             <div className={styles.btn}>
    //               <Button
    //                 sx={{ marginRight: 8 }}
    //                 type="submit"
    //                 variant="contained"
    //                 color="success"
    //                 endIcon={<SaveIcon />}
    //               >
    //                 {btnSaveText === "Update" ? (
    //                   <FormattedLabel id="update" />
    //                 ) : (
    //                   <FormattedLabel id="save" />
    //                 )}
    //               </Button>{" "}
    //               <Button
    //                 sx={{ marginRight: 8 }}
    //                 variant="contained"
    //                 color="primary"
    //                 endIcon={<ClearIcon />}
    //                 onClick={() => cancellButton()}
    //               >
    //                 <FormattedLabel id="clear" />
    //               </Button>
    //               <Button
    //                 variant="contained"
    //                 color="error"
    //                 endIcon={<ExitToAppIcon />}
    //                 onClick={() =>
    //                   router.push({
    //                     pathname:
    //                       "/FireBrigadeSystem/masters/fireStationDetails",
    //                   })
    //                 }
    //               >
    //                 <FormattedLabel id="exit" />
    //               </Button>
    //             </div>
    //           </form>
    //         </FormProvider>
    //       </div>
    //     </Slide>
    //   )}

    //   <div className={styles.addbtn}>
    //     <Button
    //       variant="contained"
    //       endIcon={<AddIcon />}
    //       type="primary"
    //       disabled={buttonInputState}
    //       onClick={() => {
    //         reset({
    //           ...resetValuesExit,
    //         });
    //         setEditButtonInputState(true);
    //         setDeleteButtonState(true);
    //         setBtnSaveText("Save");
    //         setButtonInputState(true);
    //         setSlideChecked(true);
    //         setIsOpenCollapse(!isOpenCollapse);
    //       }}
    //     >
    //       <FormattedLabel id="add" />
    //     </Button>
    //   </div>
    //   <DataGrid
    //     autoHeight
    //     sx={{
    //       marginLeft: 5,
    //       marginRight: 5,
    //       marginTop: 5,
    //       marginBottom: 5,
    //     }}
    //     rows={dataSource}
    //     columns={columns}
    //     pageSize={5}
    //     rowsPerPageOptions={[5]}
    //   />
    // </Paper>
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
                          <FormattedLabel id="updateFireStation" />
                        ) : (
                          <FormattedLabel id="addFireStation" />
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
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label={<FormattedLabel id="gISID" />}
                          variant="standard"
                          {...register("gISID")}
                          error={!!errors.gISID}
                          helperText={
                            errors?.gISID ? errors.gISID.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label={<FormattedLabel id="fireStationName" />}
                          variant="standard"
                          {...register("fireStationName")}
                          error={!!errors.fireStationName}
                          helperText={
                            errors?.fireStationName
                              ? errors.fireStationName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label={<FormattedLabel id="fireStationNameMr" />}
                          variant="standard"
                          {...register("fireStationNameMr")}
                          error={!!errors.fireStationNameMr}
                          helperText={
                            errors?.fireStationNameMr
                              ? errors.fireStationNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label={<FormattedLabel id="address" />}
                          variant="standard"
                          {...register("address")}
                          error={!!errors.address}
                          helperText={
                            errors?.address ? errors.address.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label={<FormattedLabel id="addressMr" />}
                          variant="standard"
                          {...register("addressMr")}
                          error={!!errors.addressMr}
                          helperText={
                            errors?.addressMr ? errors.addressMr.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.zone}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="zone" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="zone" />}
                              >
                                {console.log("234", zone)}
                                {zone &&
                                  zone.map((zo, index) => {
                                    return (
                                      <MenuItem key={index} value={zo.id}>
                                        {zo.zoneName}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="zone"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zone ? errors.zone.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      // className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.fireStationName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="ward" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="ward" />}
                              >
                                {ward &&
                                  ward.map((wa, index) => (
                                    <MenuItem key={index} value={wa.id}>
                                      {wa.wardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="ward"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.ward ? errors.ward.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          autoFocus
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="GIS Location"
                          variant="standard"
                          {...register("gISLocation")}
                          error={!!errors.gISLocation}
                          helperText={
                            errors?.gISLocation
                              ? errors.gISLocation.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      // columns={{ xs: 4, sm: 8, md: 12 }}
                      // className={styles.feildres}
                      sx={{ paddingLeft: "3%", paddingTop: "3%" }}
                    >
                      <Grid item>
                        {showText ? (
                          <div>
                            {/* <Map
                              google={google}
                              zoom={10}
                              style={mapStyles}
                              center={{
                                lat: latitude,
                                lng: longitude,
                              }}
                              disableDefaultUI={true}
                            >
                              {latitude && (
                                <Marker
                                  name={"This is test name"}
                                  position={{ lat: latitude, lng: longitude }}
                                />
                              )}
                            </Map> */}
                          </div>
                        ) : null}

                        {showButton ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => showDiv()}
                          >
                            Locate
                          </Button>
                        ) : null}
                      </Grid>

                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
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
                                "/FireBrigadeSystem/masters/fireStationDetails",
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
            {<FormattedLabel id="fireStationDetailsTitle" />}
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

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyAR6BqYhU-1TrnmRLDWbdOG9alpejmePss",
// })(index);
// export default ComplaintDetails;
