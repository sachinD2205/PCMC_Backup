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
  Grid,
  InputLabel,
  Tooltip,
  Select,
  MenuItem,
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
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstDefineOfficeSchema"
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
            .post(`${urls.MSURL}/mstDefineOfficeDetails/save`, body)
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
            .post(`${urls.MSURL}/mstDefineOfficeDetails/save`, body)
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
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(`${urls.MSURL}/mstDefineOfficeDetails/save`, finalBodyForApi)
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
        .post(`${urls.MSURL}/mstDefineOfficeDetails/save`, finalBodyForApi)
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
    axios.get(`${urls.BaseURL}/ward/getAll`).then((r) => {
      setwardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        }))
      )
    })
  }

  useEffect(() => {
    getwardNames()
  }, [])

  // const [zoneNos, setzoneNos] = useState([])

  // const getzoneNos = () => {
  //   axios.get(`${urls.BaseURL}/zone/getAll`).then((r) => {
  //     setzoneNos(
  //       r.data.zone.map((row) => ({
  //         id: row.id,
  //         zoneNo: row.zoneNo,
  //       }))
  //     )
  //   })
  // }

  // useEffect(() => {
  //   getzoneNos()
  // }, [])

  const [zoneNames, setzoneNames] = useState([])

  const getzoneNames = () => {
    axios.get(`${urls.BaseURL}/zone/getAll`).then((r) => {
      setzoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        }))
      )
    })
  }

  useEffect(() => {
    getzoneNames()
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
    axios.get(`${urls.MSURL}/mstDefineOfficeDetails/getAll`).then((res) => {
      console.log(res.data.defineOfficeDetails, "???????????????????????")
      setDataSource(
        res.data.defineOfficeDetails.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          gisId: r.gisId,
          office: r.office,
          officeMr: r.officeMr,
          officeAddress: r.officeAddress,
          officeAddressMr: r.officeAddressMr,
          officeType: r.officeType,
          officeTypeMr: r.officeTypeMr,
          ward: r.ward,
          ward1: wardNames?.find((obj) => obj.id === r.ward)?.wardName,
          zone: r.zone,
          zone1: zoneNames?.find((obj) => obj.id === r.zone)?.zoneName,
          // zoneName: r.zoneName,
          // zoneName1: zoneNames?.find((obj) => obj.id === r.zone)?.zoneName,
          latitude: r.latitude,
          longitude: r.longitude,
          activeFlag: r.activeFlag,
        }))
      )
    })
  }

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getlicenseTypeDetails()
  }, [wardNames, zoneNames])

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "office",
      headerName: "Office Name",
      // type: "number",
      flex: 1,
    },
    // {
    //   field: "officeMr",
    //   headerName: "Office Name Marathi",
    //   // type: "number",
    //   flex: 1,
    // },
    {
      field: "officeAddress",
      headerName: "Office Address English",
      // type: "number",
      flex: 1,
    },
    // {
    //   field: "officeAddressMr",
    //   headerName: "Office Address Marathi",
    //   // type: "number",
    //   flex: 1,
    // },
    {
      field: "officeType",
      headerName: "Office Type",
      // type: "number",
      flex: 1,
    },
    {
      field: "ward1",
      headerName: "Ward Name",
      //type: "number",
      flex: 1,
    },
    {
      field: "zone1",
      headerName: "Zone Name",
      //type: "number",
      flex: 1,
    },
    {
      field: "gisId",
      headerName: "GIS ID/GeoCode",
      //type: "number",
      flex: 1,
    },
    {
      field: "latitude",
      headerName: " Lattitude",
      //type: "number",
      flex: 1,
    },
    {
      field: "longitude",
      headerName: " Longitude",
      //type: "number",
      flex: 1,
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
        <center>{/* <h2>Define Office</h2> */}</center>
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
          Define Office
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
              Define Office
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
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 80 }}
                          error={!!errors.wardName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Ward Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 180 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Ward Name *"
                              >
                                {wardNames &&
                                  wardNames.map((wardName, index) => (
                                    <MenuItem key={index} value={wardName.id}>
                                      {wardName.wardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="ward"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.wardName ? errors.wardName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl
                            style={{ marginTop: 10, width: 185 }}
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.zoneName}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Zone No *
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 180 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Zone No*"
                                >
                                  {zoneNos &&
                                    zoneNos.map((zoneNo, index) => (
                                      <MenuItem key={index} value={zoneNo.id}>
                                        {zoneNo.zoneNo}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="zoneNo"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.zoneNo ? errors.zoneNo.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid> */}

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl
                          style={{ marginTop: 10, width: 185 }}
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.zoneName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Zone Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 180 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Zone Name *"
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
                          <FormHelperText>
                            {errors?.zoneName ? errors.zoneName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Office Name English *"
                          variant="standard"
                          {...register("office")}
                          error={!!errors.office}
                          helperText={
                            errors?.office ? errors.office.message : null
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            id="standard-basic"
                            label="Office Name Marathi *"
                            variant="standard"
                            {...register("officeMr")}
                            error={!!errors.officeMr}
                            helperText={
                              errors?.officeMr ? errors.officeMr.message : null
                            }
                          />
                        </Grid> */}

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Office Address English *"
                          variant="standard"
                          {...register("officeAddress")}
                          error={!!errors.officeAddress}
                          helperText={
                            errors?.officeAddress
                              ? errors.officeAddress.message
                              : null
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            id="standard-basic"
                            label="Office Address Marathi*"
                            variant="standard"
                            {...register("officeAddressMr")}
                            error={!!errors.officeAddressMr}
                            helperText={
                              errors?.officeAddressMr
                                ? errors.officeAddressMr.message
                                : null
                            }
                          />
                        </Grid> */}

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Office Type "
                          variant="standard"
                          {...register("officeType")}
                          error={!!errors.officeType}
                          helperText={
                            errors?.officeType
                              ? errors.officeType.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="GIS ID/GeoCode *"
                          variant="standard"
                          {...register("gisId")}
                          error={!!errors.gisId}
                          helperText={
                            errors?.gisId ? errors.gisId.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label=" Lattitude*"
                          variant="standard"
                          {...register("latitude")}
                          error={!!errors.latitude}
                          helperText={
                            errors?.latitude ? errors.latitude.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label=" Longitude*"
                          variant="standard"
                          {...register("longitude")}
                          error={!!errors.longitude}
                          helperText={
                            errors?.longitude ? errors.longitude.message : null
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
                      {" "}
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
