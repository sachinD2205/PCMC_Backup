import { yupResolver } from "@hookform/resolvers/yup"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import PreviewIcon from "@mui/icons-material/Preview"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import { TimePicker } from "@mui/x-date-pickers"
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
  Tooltip,
  InputLabel,
  Form,
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
// import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout"
import urls from "../../../../URLS/urls"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstDefineStateCitySchema"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import sweetAlert from "sweetalert"
import { LeftOutlined } from "@ant-design/icons"
import { styled, useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Drawer from "@mui/material/Drawer"
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFieldArray,
} from "react-hook-form"

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
  const [value, setValuee] = useState(null)
  const [valuee, setValueTwo] = useState(null)
  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [inputState, setInputState] = useState()
  const [dataInModal, setDataInModal] = useState()
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
            .post(`${urls.MSURL}/mstDefineStateAndCity/save`, body)
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
            .post(`${urls.MSURL}/mstDefineStateAndCity/save`, body)
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
      console.log("Post -----")
      axios
        .post(`${urls.MSURL}/mstDefineStateAndCity/save`, finalBodyForApi)
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
        .post(`${urls.MSURL}/mstDefineStateAndCity/save`, finalBodyForApi)
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

  // Reset Values Cancell
  const resetValuesCancell = {
    state: "",
    city: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    state: "",
    city: "",
    id: "",
  }

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "cityses", // unique name for your Field Array
    }
  )
  const [cityAddBtn, setcityAddBtn] = useState(false)

  // Get Table - Data
  const getlicenseTypeDetails = () => {
    console.log("getLIC ----")
    axios.get(`${urls.MSURL}/mstDefineStateAndCity/getAll`).then((res) => {
      setDataSource(
        res.data.defineStateAndCity.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          state: r.state,
          city: r.city,
          statemar: r.stateMr,
          citymar: r.cityMr,
          activeFlag: r.activeFlag,
        }))
      )
    })
  }

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getlicenseTypeDetails()
  }, [])

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      headerAlign: "center",
      align: "center",
      width: 70,
    },

    {
      field: "state",
      headerName: "State",
      align: "center",
      headerAlign: "center",
      // type: "number",
      width: 170,
    },

    {
      field: "statemar",
      headerName: "State Marathi",
      headerAlign: "center",
      align: "center",
      // type: "number",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      headerAlign: "center",
      align: "center",
      // type: "number",
      flex: 1,
    },
    {
      field: "citymar",
      headerName: "City Marathi",
      align: "center",
      headerAlign: "center",
      // type: "number",
      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
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
          Define State City
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
              Define State City
              {/* <strong> Document Upload</strong> */}
            </div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid
                container
                sx={{
                  marginLeft: 20,
                  marginTop: 2,
                  marginBottom: 5,
                  align: "center",
                }}
              >
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <TextField
                    id="standard-basic"
                    // disabled
                    // defaultValue={values.state}
                    label="State*"
                    variant="standard"
                    {...register("state")}
                    error={!!errors.state}
                    helperText={errors?.state ? errors.state.message : null}
                  />
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <TextField
                    id="standard-basic"
                    // disabled
                    // defaultValue="महाराष्ट्र"
                    label="State Marathi *"
                    variant="standard"
                    {...register("stateMr")}
                    error={!!errors.stateMr}
                    helperText={errors?.stateMr ? errors.stateMr.message : null}
                  />
                </Grid>
              </Grid>

              {fields.map((citys, index) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <Grid
                    container
                    sx={{
                      marginLeft: 20,
                      marginTop: 2,
                      marginBottom: 5,
                      align: "center",
                    }}
                  >
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                      <TextField
                        id="standard-basic"
                        label="City *"
                        variant="standard"
                        {...register("city")}
                        error={!!errors.city}
                        helperText={errors?.city ? errors.city.message : null}
                      />
                    </Grid>

                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                      <TextField
                        id="standard-basic"
                        label="City Marathi*"
                        variant="standard"
                        {...register("cityMr")}
                        error={!!errors.cityMr}
                        helperText={
                          errors?.cityMr ? errors.cityMr.message : null
                        }
                      />
                    </Grid>
                  </Grid>
                )
              })}

              <Grid
                container
                sx={{
                  marginLeft: 20,
                  marginTop: 2,
                  marginBottom: 5,
                  align: "center",
                }}
              >
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                    onClick={() =>
                      append({
                        city: "",
                        cityMr: "",
                      })
                    }
                    variant="contained"
                  >
                    Add City
                  </Button>
                </Grid>
              </Grid>

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
            </form>
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