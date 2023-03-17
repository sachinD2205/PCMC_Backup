import { yupResolver } from "@hookform/resolvers/yup"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import PreviewIcon from "@mui/icons-material/Preview"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  Card,
  Tooltip,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"
// import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { message } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import BasicLayout from "../../../../containers/Layout/BasicLayout"
import urls from "../../../../URLS/urls"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstHonariumChargeMasterSchema"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import sweetAlert from "sweetalert"
import { LeftOutlined } from "@ant-design/icons"
import { styled, useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Drawer from "@mui/material/Drawer"

let drawerWidth

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
)

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log("body", body)
    if (_activeFlag === "N") {
      swal({
        title: "Delete?",
        text: "Are you sure you want to Delete this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/mstHonorariumCharge/save`, body)
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getlicenseTypeDetails()
                setButtonInputState(false)
              }
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    } else {
      swal({
        title: "Delete?",
        text: "Are you sure you want to Delete this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/mstHonorariumCharge/save`, body)
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getlicenseTypeDetails()
                setButtonInputState(false)
              }
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    }
  }

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const fromDate = new Date(formData.fromDate).toISOString()
    const toDate = new Date(formData.toDate).toISOString()
    console.log("From Date ${formData} ")

    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(`${urls.MSURL}/mstHonorariumCharge/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
            setIsOpenCollapse(false)
          }
        })
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("Put -----")
      axios
        .post(`${urls.MSURL}/mstHonorariumCharge/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setIsOpenCollapse(false)
          }
        })
    }
  }

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setIsOpenCollapse(false)
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const [wardNames, setwardNames] = useState([])

  const getwardNames = () => {
    axios
      .get(`${urls.BaseURL}/master/MstPaymentType/getpaymentTypeData`)
      .then((r) => {
        setwardNames(
          r.data.map((row) => ({
            id: row.id,
            wardName: row.wardName,
          }))
        )
      })
  }

  useEffect(() => {
    getwardNames()
  }, [])

  const [zoneNos, setzoneNos] = useState([])

  const getzoneNos = () => {
    axios
      .get(`${urls.BaseURL}/master/MstPaymentType/getpaymentTypeData`)
      .then((r) => {
        setzoneNos(
          r.data.map((row) => ({
            id: row.id,
            zoneNo: row.zoneNo,
          }))
        )
      })
  }

  useEffect(() => {
    getzoneNos()
  }, [])

  const [honariumNames, setHonariumNames] = useState([])

  const getHonariumNames = () => {
    axios
      .get(`${urls.BaseURL}/master/MstPaymentType/getpaymentTypeData`)
      .then((r) => {
        setHonariumNames(
          r.data.map((row) => ({
            id: row.id,
            honariumName: row.honariumName,
          }))
        )
      })
  }

  const [chargeTypes, setChargeTypes] = useState([])

  const getChargeTypes = () => {
    axios.get(`${urls.BaseURL}/serviceChargeType/getAll`).then((r) => {
      setChargeTypes(
        r.data.serviceChargeType.map((row) => ({
          id: row.id,
          chargeType: row.serviceChargeType,
        }))
      )
    })
  }

  console.log("21", chargeTypes)

  const [dependOns, setDependOns] = useState([])

  const getDependOns = () => {
    axios
      .get(`${urls.BaseURL}/master/MstPaymentType/getpaymentTypeData`)
      .then((r) => {
        setDependOns(
          r.data.map((row) => ({
            id: row.id,
            dependOn: row.dependOn,
          }))
        )
      })
  }

  useEffect(() => {
    getHonariumNames()
    getChargeTypes()
    getDependOns()
  }, [])

  // Reset Values Cancell
  const resetValuesCancell = {
    officeName: "",
    officeAddress: "",
    officeType: "",
    gisId: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    officeName: "",
    officeAddress: "",
    officeType: "",
    gisId: "",
    id: "",
  }

  // Get Table - Data
  const getlicenseTypeDetails = () => {
    console.log("getLIC ----")
    axios.get(`${urls.MSURL}/mstHonorariumCharge/getAll`).then((res) => {
      setDataSource(
        res.data.honorariumCharge.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          amount: r.amount,
          chargeType: r.chargeType,
          chargeType1: chargeTypes?.find((obj) => obj.id === r.chargeType)
            ?.chargeType,
          dependsOn: r.dependsOn,
          formula: r.formula,
          fromDate: r.fromDate,
          honorarium: r.honorarium,
          toDate: r.toDate,
          activeFlag: r.activeFlag,
        }))
      )
    })
  }

  // useEffect - Reload On update , delete ,Saved on refresh

  useEffect(() => {
    getlicenseTypeDetails()
  }, [chargeTypes])

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: "From date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "toDate",
      headerName: "To Date",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "honorarium",
      headerName: "Honarium name",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chargeType1",
      headerName: "Charge Type",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "dependsOn",
      headerName: "Depends On",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "amount",
      headerName: "Amount",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "formula",
      headerName: "Formula",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor: "whitesmoke",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title="Edit details">
              <IconButton
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setButtonInputState(true)
                  console.log("params.row: ", params.row)
                  reset(params.row)
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete details">
              <IconButton
                onClick={() => deleteById(params.id, params.activeFlag)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  // View
  return (
    <>
      <Card>
        <div
          style={{
            backgroundColor: "#0084ff",
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
          Honarium Charge Master
          {/* <strong> Document Upload</strong> */}
        </div>
      </Card>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <div>
            <div
              style={{
                backgroundColor: "#0084ff",
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
              Honarium Charge Master
              {/* <strong> Document Upload</strong> */}
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.small}>
                  <div className={styles.maindiv}>
                    <Grid
                      container
                      sx={{
                        marginLeft: 5,
                        marginTop: 2,
                        marginBottom: 5,
                        align: "center",
                      }}
                    >
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <FormControl style={{ marginTop: 10, width: 185 }}>
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date*
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
                        </FormControl>
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <FormControl style={{ marginTop: 10, width: 185 }}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
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
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        {/* <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.honorarium}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Honarium name *
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 200 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Honarium Name*"
                                >
                                  <MenuItem value={1}>
                                    honorarium test 1
                                  </MenuItem>
                                  {honariumNames &&
                                    honariumNames.map((honariumName, index) => (
                                      <MenuItem
                                        key={index}
                                        value={honariumName.id}
                                      >
                                        {honariumName.honariumName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="honorarium"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.honorarium
                                ? errors.honorarium.message
                                : null}
                            </FormHelperText>
                          </FormControl> */}

                        <TextField
                          id="standard-basic"
                          sx={{ m: 1, minWidth: 200 }}
                          label="Honarium name *"
                          variant="standard"
                          {...register("honorarium")}
                          error={!!errors.honorarium}
                          helperText={
                            errors?.honorarium
                              ? errors.honorarium.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.chargeType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Charge Type*
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 200 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Charge Type*"
                              >
                                {/* <MenuItem value={1}>charge Type 1</MenuItem> */}
                                {chargeTypes &&
                                  chargeTypes.map((chargeType, index) => (
                                    <MenuItem key={index} value={chargeType.id}>
                                      {chargeType.chargeType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="chargeType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.chargeType
                              ? errors.chargeType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.dependsOn}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Depend on*
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 200 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Depend on*"
                              >
                                <MenuItem value={1}>depends on Test1</MenuItem>
                                {dependOns &&
                                  dependOns.map((dependOn, index) => (
                                    <MenuItem key={index} value={dependOn.id}>
                                      {dependOn.dependOn}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="dependsOn"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.dependsOn
                              ? errors.dependsOn.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                          id="standard-basic"
                          sx={{ m: 1, minWidth: 200 }}
                          label=" Amount*"
                          variant="standard"
                          {...register("amount")}
                          error={!!errors.amount}
                          helperText={
                            errors?.amount ? errors.amount.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                          id="standard-basic"
                          sx={{ m: 1, minWidth: 200 }}
                          label=" Formula*"
                          variant="standard"
                          {...register("formula")}
                          error={!!errors.formula}
                          helperText={
                            errors?.formula ? errors.formula.message : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className={styles.btn}>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText}
                    </Button>{" "}
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      Exit
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        )}
        <div className={styles.addbtn}>
          <Button
            sx={{ backgroundColor: "rgb(0, 132, 255) !important" }}
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              })
              setBtnSaveText("Save")
              setIsOpenCollapse(!isOpenCollapse)
            }}
          >
            Add{" "}
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
        />
      </Paper>
    </>
  )
}

export default Index

// export default index
