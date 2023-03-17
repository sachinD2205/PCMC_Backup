import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import AddIcon from "@mui/icons-material/Add"
import React, { useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import dayjs from "dayjs"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { yupResolver } from "@hookform/resolvers/yup"
import styles from "../../../components/veternaryManagementSystem/view.module.css"
import Schema from "../../../containers/schema/veternaryManagementSystem/masters/opd"
import theme from "../../../theme"
import { GridToolbar } from "@mui/x-data-grid"
import urls from "../../../URLS/urls"

const OpdMaster = () => {
  const [btnSaveText, setBtnSaveText] = useState("Save")
  // const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [zoneNames, setZoneNames] = useState([])
  const [wardNames, setWardNames] = useState([])
  const [timeValue, setTimeValue] = React.useState(dayjs("2014-08-18T21:11:54"))
  const label = { inputProps: { "aria-label": "Checkbox demo" } }
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

  const onSubmitForm = (fromData) => {
    const fromDate = new Date(fromData.fromDate).toISOString()
    const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD")
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.CFCURL}/master/opd/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success")
            // getCastCategory();
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      axios
        .put(
          `${urls.CFCURL}/master/castCategory/editCastCategory`,
          finalBodyForApi
        )
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success")
            // getCastCategory();
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    }
  }

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const resetValuesCancell = {
    zoneName: "",
    wardName: "",
    opdHeadOffice: "",
    opdSectionOffice: "",
    opdId: "",
    opdPrefix: "",
    opdNo: "",
    opdName: "",
    opdOpeningTime: "",
    opdWorkingDays: "",
    opdClosingTime: "",
    labFacility: "",
    xrayFacility: "",
    opdAddressDetails: "",
    flatBuildingNo: "",
    buildingName: "",
    roadName: "",
    landmark: "",
    pincode: "",
  }

  const resetValuesExit = {
    zoneName: "",
    wardName: "",
    opdHeadOffice: "",
    opdSectionOffice: "",
    opdId: "",
    opdPrefix: "",
    opdNo: "",
    opdName: "",
    opdOpeningTime: "",
    opdWorkingDays: "",
    opdClosingTime: "",
    labFacility: "",
    xrayFacility: "",
    opdAddressDetails: "",
    flatBuildingNo: "",
    buildingName: "",
    roadName: "",
    landmark: "",
    pincode: "",
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
      field: "fromDate",
      headerName: "From Date",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "toDate",
      headerName: "To Date",
      // type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "zoneName",
      headerName: "Zone Name",
      // type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "wardName",
      headerName: "Ward Name",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "opdHeadOffice",
      headerName: "OPD Head Office",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "opdSectionOffice",
      headerName: "OPD Section Office",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "opdPrefix",
      headerName: "OPD Prefix",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "opdNo",
      headerName: "OPD No",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "opdName",
      headerName: "OPD Name",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "opdOpeningTime",
      headerName: "OPD Opening Time",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "opdWorkingDays",
      headerName: "OPD Working Days",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "opdClosingTime",
      headerName: "OPD Closing Time",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "labFacility",
      headerName: "Lab Facility",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "xrayFacility",
      headerName: "X-ray Facility",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "opdAddressDetails",
      headerName: "OPD Address Details",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "flatBuildingNo",
      headerName: "Flat/Building No",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "buildingName",
      headerName: "Building Name",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "roadName",
      headerName: "Road Name",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "landmark",
      headerName: "Land Mark",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pincode",
      headerName: "Pincode",
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
              //   onClick={() => deleteById(params.id)}
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
                OPD Master
              </strong>
            </Box>
          </Box>
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
                        <FormControl
                          style={{ backgroundColor: "white" }}
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
                                      From Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      autoFocus
                                      {...params}
                                      size="small"
                                      fullWidth
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
                                      {/* <FormattedLabel id="toDate" /> */}
                                      To Date
                                    </span>
                                  }
                                  value={field.value || null}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      InputLabelProps={
                                        {
                                          // style: {
                                          //   fontSize: 12,
                                          //   marginTop: 3,
                                          // },
                                        }
                                      }
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
                          error={!!errors.zoneName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Zone Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select variant="standard" label="zoneName">
                                {/* {zones &&
                                  zones.map((zone, index) => (
                                    <MenuItem key={index} value={zone.id}>
                                      {zone.zone}
                                    </MenuItem>
                                  ))} */}
                              </Select>
                            )}
                            name="zoneName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zoneName ? errors.zoneName.message : null}
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
                          error={!!errors.wardName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Ward Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                fullWidth
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Rotation Sub Group Name"
                              >
                                {/* {businessTypes &&
                                  businessTypes.map((businessType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={businessType.id}
                                    >
                                      {businessType.businessType}
                                    </MenuItem>
                                  ))} */}
                              </Select>
                            )}
                            name="department"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.wardName ? errors.wardName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* ...................>>>>>>>>>RadioButtonS<<<<<<<<<<<>>>>>>>>> */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            row
                          >
                            <div>
                              <FormControlLabel
                                // sx={{ width: "115px" }}
                                value="Option 1"
                                control={<Radio />}
                                label="OPD Head Office"
                                name="RadioButton"
                                {...register("radioButton")}
                                error={!!errors.radioButton}
                                helperText={
                                  errors?.radioButton
                                    ? errors.radioButton.message
                                    : null
                                }
                              />

                              <FormControlLabel
                                // style={{ paddingLeft: "240px" }}
                                // sx={{ width: "180px" }}
                                value="Option 2"
                                control={<Radio />}
                                label="OPD Section Office"
                                name="RadioButton"
                                {...register("radioButton")}
                                error={!!errors.radioButton}
                                helperText={
                                  errors?.radioButton
                                    ? errors.radioButton.message
                                    : null
                                }
                              />
                            </div>
                          </RadioGroup>
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
                          id="standard-basic"
                          label="OPD Prefix *"
                          variant="standard"
                          //   value={dataInForm && dataInForm.opdPrefix}
                          {...register("opdPrefix")}
                          error={!!errors.opdPrefix}
                          helperText={
                            errors?.opdPrefix ? errors.opdPrefix.message : null
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
                          id="standard-basic"
                          label="OPD No *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("opdNo")}
                          error={!!errors.opdNo}
                          helperText={
                            errors?.opdNo ? errors.opdNo.message : null
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
                          id="standard-basic"
                          label="OPD Name *"
                          variant="standard"
                          {...register("opdName")}
                          error={!!errors.opdName}
                          helperText={
                            errors?.opdName ? errors.opdName.message : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.meetingTime}
                        >
                          <Controller
                            format="HH:mm"
                            control={control}
                            name="opdOpeningTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  // disabled={
                                  //   data.rows.length !== 0 ? false : true
                                  // }
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      OPD Opening Time*
                                    </span>
                                  }
                                  value={field.value || null}
                                  onChange={(time) => field.onChange(time)}
                                  selected={field.value}
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
                            {errors?.meetingTime
                              ? errors.meetingTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.meetingTime}
                        >
                          <Controller
                            format="HH:mm"
                            control={control}
                            name="opdClosingTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  // disabled={
                                  //   data.rows.length !== 0 ? false : true
                                  // }
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      OPD Closing Time*
                                    </span>
                                  }
                                  value={field.value || null}
                                  onChange={(time) => field.onChange(time)}
                                  selected={field.value}
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
                            {errors?.meetingTime
                              ? errors.meetingTime.message
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
                          id="standard-basic"
                          label="OPD Working Days *"
                          variant="standard"
                          {...register("opdWorkingDays")}
                          error={!!errors.opdWorkingDays}
                          helperText={
                            errors?.opdWorkingDays
                              ? errors.opdWorkingDays.message
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
                        <FormLabel
                          id="demo-controlled-radio-buttons-group"
                          // style={{ minWidth: "230px" }}
                        >
                          Lab Facility
                          <Checkbox {...label} />
                        </FormLabel>
                        <FormLabel id="demo-controlled-radio-buttons-group">
                          X-ray Facility
                          <Checkbox {...label} />
                        </FormLabel>
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
                          id="standard-basic"
                          label="OPD Address Details"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("opdAddressDetails")}
                          error={!!errors.opdAddressDetails}
                          // helperText={
                          //   errors?.remark ? errors.remark.message : null
                          // }
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
                          id="standard-basic"
                          label="Flat/Building No"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("flatBuildingNo")}
                          error={!!errors.flatBuildingNo}
                          // helperText={
                          //   errors?.remark ? errors.remark.message : null
                          // }
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
                          id="standard-basic"
                          label="Building Name"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("buildingName")}
                          error={!!errors.buildingName}
                          // helperText={
                          //   errors?.remark ? errors.remark.message : null
                          // }
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
                          id="standard-basic"
                          label="Road Name *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("roadName")}
                          error={!!errors.roadName}
                          helperText={
                            errors?.roadName ? errors.roadName.message : null
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
                          id="standard-basic"
                          label="Landmark *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("landmark")}
                          error={!!errors.landmark}
                          helperText={
                            errors?.landmark ? errors.landmark.message : null
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
                          id="standard-basic"
                          label="Pincode *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("pincode")}
                          error={!!errors.pincode}
                          helperText={
                            errors?.pincode ? errors.pincode.message : null
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
              rows={rows}
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

export default OpdMaster
