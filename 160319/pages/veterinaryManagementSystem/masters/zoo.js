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
import styles from "../../../components/veternaryManagementSystem/view.module.css"
import AddIcon from "@mui/icons-material/Add"
import React, { useEffect, useState } from "react"
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
import axios from "axios"
import sweetAlert from "sweetalert"
import Schema from "../../../containers/schema/veternaryManagementSystem/masters/zoo"
import theme from "../../../theme"
import urls from "../../../URLS/urls"
import { GridToolbar } from "@mui/x-data-grid"

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

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
    }
    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.CFCURL}/master/zoo/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success")
            getZoo()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })

      // Update Data Based On ID
    } else if (btnSaveText === "Update") {
      axios
        .post(`${urls.CFCURL}/master/zoo/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Updated!", "Record Updated successfully !", "success")
            getZoo()
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
          .delete(`${urls.CFCURL}/master/zoo/discard/${value}`)
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              })
              setButtonInputState(false)
              getZoo()
            }
          })
      } else {
        swal("Record is Safe")
      }
    })
  }

  // Get Table - Data
  const getZoo = () => {
    axios.get(`${urls.CFCURL}/master/zoo/getAll`).then((res) => {
      setDataSource(
        res.data.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          zooName: r.zooName,
          zone: r.zone,
          ward: r.ward,
          area: r.area,
          zooAddress: r.zooAddress,
          zooAddressAreaInAcres: r.zooAddressAreaInAcres,
          zooApproved: r.zooApproved,
          zooFamousFor: r.zooFamousFor,
        }))
      )
    })
  }

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getZoo()
  }, [])

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const resetValuesCancell = {
    zooName: "",
    zone: "",
    ward: "",
    area: "",
    zooAddress: "",
    zooAddressAreaInAcres: "",
    zooApproved: "",
    zooFamousFor: "",
  }

  const resetValuesExit = {
    zooName: "",
    zone: "",
    ward: "",
    area: "",
    zooAddress: "",
    zooAddressAreaInAcres: "",
    zooApproved: "",
    zooFamousFor: "",
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
      field: "zooName",
      headerName: "Zoo Name",
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
      field: "zooAddress",
      headerName: "Zoo Address",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "zooAddressAreaInAcres",
      headerName: "Zoo Area Space In Acres",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "zooApproved",
      headerName: "Zoo Approved/Recognized by",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "zooFamousFor",
      headerName: "Zoo Famous For(History Details)",
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

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    // setSlideChecked(false);
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
                ZOO MASTER
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
                        <TextField
                          id="standard-basic"
                          label="Zoo Name *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("zooName")}
                          error={!!errors.zooName}
                          helperText={
                            errors?.zooName ? errors.zooName.message : null
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
                          label="Zone *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("zone")}
                          error={!!errors.zone}
                          helperText={errors?.zone ? errors.zone.message : null}
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
                          label="Ward *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("ward")}
                          error={!!errors.ward}
                          helperText={errors?.ward ? errors.ward.message : null}
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
                          label="Area *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("area")}
                          error={!!errors.area}
                          helperText={errors?.area ? errors.area.message : null}
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
                          label="Zoo Address *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("zooAddress")}
                          error={!!errors.zooAddress}
                          helperText={
                            errors?.zooAddress
                              ? errors.zooAddress.message
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
                          id="standard-basic"
                          label="Zoo Area Space In Acres *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("zooAddressAreaInAcres")}
                          error={!!errors.zooAddressAreaInAcres}
                          helperText={
                            errors?.zooAddressAreaInAcres
                              ? errors.zooAddressAreaInAcres.message
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
                          id="standard-basic"
                          label="Zoo Approved/Recognized by *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("zooApproved")}
                          error={!!errors.zooApproved}
                          helperText={
                            errors?.zooApproved
                              ? errors.zooApproved.message
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
                          id="standard-basic"
                          label="Zoo Famous For(History Details) *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("zooFamousFor")}
                          error={!!errors.zooFamousFor}
                          helperText={
                            errors?.zooFamousFor
                              ? errors.zooFamousFor.message
                              : null
                          }
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
