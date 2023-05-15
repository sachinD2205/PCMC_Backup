import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import AddIcon from "@mui/icons-material/Add"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import dayjs from "dayjs"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import urls from "../../../URLS/urls"
import sweetAlert from "sweetalert"
import moment from "moment"
import theme from "../../../theme"
import styles from "../../../components/veternaryManagementSystem/view.module.css"
import Schema from "../../../containers/schema/veternaryManagementSystem/masters/dogPark"

const Index = () => {
  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [zoneNames, setZoneNames] = useState([])
  const [wardNames, setWardNames] = useState([])
  const [timeValue, setTimeValue] = React.useState(dayjs(""))
  // const [timeValues, setTimeValues] = React.useState(dayjs(''));
  const label = { inputProps: { "aria-label": "Checkbox demo" } }
  const [nameOfEmployees, setNameOfEmployees] = useState([])
  const [designations, setDesignations] = useState([])
  const [wards, setWards] = useState([])
  const [zones, setZones] = useState([])
  const [areas, setAreas] = useState([])
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  })

  const handleChange = (newValue) => {
    setTimeValue(newValue)
  }

  // const handleChanges = (newValues) => {
  //   setTimeValues(newValues);
  // };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    const parkCloseTime = moment(fromData.parkCloseTime, "hh:mm:ss a").format(
      "HH:mm:ss"
    )
    const parkStartTime = moment(fromData.parkStartTime, "hh:mm:ss a").format(
      "HH:mm:ss"
    )
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      parkCloseTime,
      parkStartTime,
    }
    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.CFCURL}/master/dogpark/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success")
            getDogPark()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })

      // Update Data Based On ID
    } else if (btnSaveText === "Update") {
      axios
        .post(`${urls.CFCURL}/master/dogpark/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Updated!", "Record Updated successfully !", "success")
            getDogPark()
            setButtonInputState(false)
            setIsOpenCollapse(false)
          }
        })
    }
  }

  // Delete By ID
  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.CFCURL}/master/dogpark/discard/${value}`)
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              })
              setButtonInputState(false)
              getDogPark()
            }
          })
      } else {
        swal("Record is Safe")
      }
    })
  }

  // Get Table - Data
  const getDogPark = () => {
    axios.get(`${urls.CFCURL}/master/dogpark/getAll`).then((res) => {
      setDataSource(
        res.data.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          nameOfDogPark: r.nameOfDogPark,
          zone: r.zone,
          zone: zones?.find((obj) => obj?.id === r.zone)?.zone,
          ward: r.ward,
          ward: wards?.find((obj) => obj?.id === r.ward)?.ward,
          area: r.area,
          area: areas?.find((obj) => obj?.id === r.area)?.area,
          dogParkAddress: r.dogParkAddress,
          dogParkAreaSpaceInAcres: r.dogParkAreaSpaceInAcres,
          dogParkApproved: r.dogParkApproved,
          dogParkFamousFor: r.dogParkFamousFor,
          parkStartTime: r.parkStartTime,
          parkCloseTime: r.parkCloseTime,
          nameOfEmployee: r.nameOfEmployee,
          nameOfEmployee: nameOfEmployees?.find(
            (obj) => obj?.id === r.nameOfEmployee
          )?.nameOfEmployee,
          designation: r.designation,
          designation: designations?.find((obj) => obj?.id === r.designation)
            ?.designation,
        }))
      )
    })
  }

  useEffect(() => {
    getDogPark()
  }, [wards, zones, areas, nameOfEmployees, designations])

  const getNameOfEmployees = () => {
    axios.get(`${urls.CFCURL}/master/employee/getAll`).then((r) => {
      setNameOfEmployees(
        r.data.map((row) => ({
          id: row.id,
          nameOfEmployee:
            row.firstName + " " + row.middleName + " " + row.lastName,
        }))
      )
    })
  }

  useEffect(() => {
    getNameOfEmployees()
  }, [])

  const getdesignations = () => {
    axios.get(`${urls.CFCURL}/master/designation/getAll`).then((r) => {
      setDesignations(
        r.data.designation.map((row) => ({
          id: row.id,
          designation: row.designation,
        }))
      )
    })
  }

  useEffect(() => {
    getdesignations()
  }, [])

  const getwards = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWards(
        r.data.ward.map((row) => ({
          id: row.id,
          ward: row.wardName,
        }))
      )
    })
  }

  useEffect(() => {
    getwards()
  }, [])

  const getzones = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZones(
        r.data.zone.map((row) => ({
          id: row.id,
          zone: row.zoneName,
        }))
      )
    })
  }

  useEffect(() => {
    getzones()
  }, [])

  const getareas = () => {
    axios.get(`${urls.CFCURL}/master/area/getAll`).then((r) => {
      setAreas(
        r.data.area.map((row) => ({
          id: row.id,
          area: row.areaName,
        }))
      )
    })
  }

  useEffect(() => {
    getareas()
  }, [])

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const resetValuesCancell = {
    nameOfDogPark: "",
    zone: "",
    ward: "",
    area: "",
    dogParkAddress: "",
    dogParkAreaSpaceInAcres: "",
    dogParkApproved: "",
    dogParkFamousFor: "",
    parkStartTime: null,
    parkCloseTime: null,
    nameOfEmployee: "",
    designation: "",
  }

  const resetValuesExit = {
    nameOfDogPark: "",
    zone: "",
    ward: "",
    area: "",
    dogParkAddress: "",
    dogParkAreaSpaceInAcres: "",
    dogParkApproved: "",
    dogParkFamousFor: "",
    parkStartTime: null,
    parkCloseTime: null,
    nameOfEmployee: "",
    designation: "",
    id: null,
  }

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      minWidth: 100,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "nameOfDogPark",
      headerName: "Name of Dog Park",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "zone",
      headerName: "Zone",
      // type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "ward",
      headerName: "Ward",
      // type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "area",
      headerName: "Area",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dogParkAddress",
      headerName: "Dog Park Address",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dogParkAreaSpaceInAcres",
      headerName: "Dog Park Area Space In Acres",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dogParkApproved",
      headerName: "Dog Park Approved/Recognized by",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "dogParkFamousFor",
      headerName: "Dog Park Famous For(History Details)",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parkStartTime",
      headerName: "Park Start Time",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parkCloseTime",
      headerName: "Park Close Time",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "nameOfEmployee",
      headerName: "Name of Employee",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "designation",
      headerName: "Designation",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 140,
      maxWidth: 200,
      headerAlign: "center",
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
                  setSlideChecked(true)
                setButtonInputState(true)
                reset(params.row)
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
        )
      },
    },
  ]

  const rows = []

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setDeleteButtonState(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
                height: "auto",
                overflow: "auto",
                padding: "0.5%",
                color: "black",
                fontSize: 19,
                fontWeight: 500,
                borderRadius: 100,
              }}
            >
              <strong>
                {/* <FormattedLabel id="amenitiesMaster" /> */}
                DOG PARK MASTER
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          autoFocus
                          style={{ backgroundColor: "white" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="amenities" />}
                          label="Name of Dog Park *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("nameOfDogPark")}
                          error={!!errors.nameOfDogPark}
                          helperText={
                            errors?.nameOfDogPark
                              ? errors.nameOfDogPark.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ minWidth: "230px" }}
                          error={!!errors.zone}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Zone *
                          </InputLabel>
                          <Controller
                            control={control}
                            render={({ field }) => (
                              <Select
                                fullWidth
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Zone *"
                              >
                                {zones &&
                                  zones.map((zone, index) => (
                                    <MenuItem key={index} value={zone.id}>
                                      {zone.zone}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zone"
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zone ? errors.zone.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ minWidth: "230px" }}
                          error={!!errors.ward}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Ward *
                          </InputLabel>
                          <Controller
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Ward *"
                                variant="standard"
                              >
                                {wards &&
                                  wards.map((ward, index) => (
                                    <MenuItem key={index} value={ward.id}>
                                      {ward.ward}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="ward"
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.ward ? errors.ward.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ minWidth: "230px" }}
                          error={!!errors.area}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Area *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Area *"
                              >
                                {areas &&
                                  areas.map((area, index) => (
                                    <MenuItem key={index} value={area.id}>
                                      {area.area}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="area"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.area ? errors.area.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          style={{ backgroundColor: "white" }}
                          id="standard-basic"
                          label="Dog Park Address *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("dogParkAddress")}
                          error={!!errors.dogParkAddress}
                          helperText={
                            errors?.dogParkAddress
                              ? errors.dogParkAddress.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          style={{ backgroundColor: "white" }}
                          id="standard-basic"
                          label="Dog Park Area Space In Acres *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("dogParkAreaSpaceInAcres")}
                          error={!!errors.dogParkAreaSpaceInAcres}
                          helperText={
                            errors?.dogParkAreaSpaceInAcres
                              ? errors.dogParkAreaSpaceInAcres.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          style={{ backgroundColor: "white" }}
                          id="standard-basic"
                          label="Dog Park Approved by *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("dogParkApproved")}
                          error={!!errors.dogParkApproved}
                          helperText={
                            errors?.dogParkApproved
                              ? errors.dogParkApproved.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          style={{ backgroundColor: "white" }}
                          id="standard-basic"
                          label="Dog Park Famous For(History Details) *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("dogParkFamousFor")}
                          error={!!errors.dogParkFamousFor}
                          helperText={
                            errors?.dogParkFamousFor
                              ? errors.dogParkFamousFor.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ backgroundColor: "white" }}
                          error={!!errors.parkStartTime}
                        >
                          <Controller
                            control={control}
                            inputFormat="hh:mm:ss a"
                            name="parkStartTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Park Start Time *
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(time) => field.onChange(time)}
                                  selected={field.value}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      // InputLabelProps={{
                                      //   style: {
                                      //     fontSize: 12,
                                      //     marginTop: 3,
                                      //   },
                                      // }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.parkStartTime
                              ? errors.parkStartTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ backgroundColor: "white" }}
                          error={!!errors.parkCloseTime}
                        >
                          <Controller
                            inputFormat="hh:mm:ss a"
                            control={control}
                            name="parkCloseTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Park Close Time *
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(time) => field.onChange(time)}
                                  selected={field.value}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      // InputLabelProps={{
                                      //   style: {
                                      //     fontSize: 12,
                                      //     marginTop: 3,
                                      //   },
                                      // }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.parkCloseTime
                              ? errors.parkCloseTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ minWidth: "230px" }}
                          error={!!errors.nameOfEmployee}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Name of Employee *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Name of Employee *"
                              >
                                {nameOfEmployees &&
                                  nameOfEmployees.map(
                                    (nameOfEmployee, index) => (
                                      <MenuItem
                                        key={index}
                                        value={nameOfEmployee.id}
                                      >
                                        {nameOfEmployee.nameOfEmployee}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="nameOfEmployee"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.nameOfEmployee
                              ? errors.nameOfEmployee.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ minWidth: "230px" }}
                          error={!!errors.nameOfEmployee}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Designation *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Designation *"
                              >
                                {designations &&
                                  designations.map((designation, index) => (
                                    <MenuItem
                                      key={index}
                                      value={designation.id}
                                    >
                                      {designation.designation}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="designation"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.designation
                              ? errors.designation.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          style={{ backgroundColor: "white" }}
                          id="outlined-basic"
                          // label={<FormattedLabel id="remark" />}
                          label="Remark"
                          // variant="outlined"
                          variant="standard"
                          {...register("remark")}
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                          size="small"
                        >
                          {btnSaveText}
                        </Button>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                          size="small"
                        >
                          Clear
                        </Button>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
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
                          size="small"
                        >
                          Exit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}

          <Grid
            container
            style={{ padding: "10px" }}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={9}></Grid>
            <Grid
              item
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                size="medium"
                endIcon={<AddIcon />}
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  })
                  setEditButtonInputState(true)
                  setDeleteButtonState(true)
                  setBtnSaveText("Save")
                  // setBtnSaveTextMr("जतन करा")
                  setButtonInputState(true)
                  setSlideChecked(true)
                  setIsOpenCollapse(!isOpenCollapse)
                }}
              >
                {/* {<FormattedLabel id="add" />} */}
                Add
              </Button>
            </Grid>
          </Grid>

          <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
            <DataGrid
              sx={{
                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {
                  // backgroundColor:'red',
                  // height: '800px !important',
                  // display: "flex",
                  // flexDirection: "column-reverse",
                  // overflow:'auto !important'
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  disableExport: true,
                  disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                  printOptions: { disableToolbarButton: true },
                },
              }}
              density="compact"
              autoHeight={true}
              rows={dataSource}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              //checkboxSelection
            />
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  )
}

export default Index
