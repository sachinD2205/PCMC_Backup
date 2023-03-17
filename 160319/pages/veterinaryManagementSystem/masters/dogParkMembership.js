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
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import BasicLayout from "../../../containers/Layout/BasicLayout"
import styles from "../../../components/veternaryManagementSystem/view.module.css"
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
import Schema from "../../../containers/schema/veternaryManagementSystem/masters/dogParkMembership"
import theme from "../../../theme"

const Index = () => {
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

  // const onSubmitForm = (fromData) => {
  //   const fromDate = new Date(fromData.fromDate).toISOString();
  //   const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
  //   // Update Form Data
  //   const finalBodyForApi = {
  //     ...fromData,
  //     fromDate,
  //     toDate,
  //   };
  //   if (btnSaveText === "Save") {
  //     axios
  //       .post(
  //         `${urls.CFCURL}/master/businessSubType/saveBusinessSubType`,
  //         finalBodyForApi,
  //       )
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           getBusinesSubType();
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   } else if (btnSaveText === "Update") {
  //     axios
  //       .post(
  //         `${urls.CFCURL}/master/businessSubType/saveBusinessSubType`,
  //         finalBodyForApi,
  //       )
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");
  //           getBusinesSubType();
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   }
  // };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const resetValuesCancell = {
    nameOfDogPark: "",
    nameOfMember: "",
    periodOfMembership: "",
    membershipAmount: "",
    countOfAnimals: "",
    addressOfTheAnimalsOwner: "",
    zoneName: "",
    wardName: "",
    nameOfArea: "",
    landmark: "",
    pincode: "",
    mobileNo: "",
    emailId: "",
    visitorsFee: "",
  }

  const resetValuesExit = {
    nameOfDogPark: "",
    nameOfMember: "",
    periodOfMembership: "",
    membershipAmount: "",
    countOfAnimals: "",
    addressOfTheAnimalsOwner: "",
    zoneName: "",
    wardName: "",
    nameOfArea: "",
    landmark: "",
    pincode: "",
    mobileNo: "",
    emailId: "",
    visitorsFee: "",
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
      field: "NameOfDogPark",
      headerName: "Name of Dog Park",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "nameOfMember",
      headerName: "Name of Member/Name of Animal Owner",
      // type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "periodOfMembership",
      headerName: "Period of Membership",
      // type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "membershipAmount",
      headerName: "Membership Amount",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "countOfAnimals",
      headerName: "Count of Animals",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "addressOfTheAnimalsOwner",
      headerName: "Address of the Animals Owner",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "zoneName",
      headerName: "Zone Name",
      //type: "number",
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
      field: "nameOfArea",
      headerName: "Name of Area",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "landmark",
      headerName: "Landmark",
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
      field: "mobileNo",
      headerName: "Mobile No",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "emailId",
      headerName: "Email ID",
      //type: "number",
      minWidth: 180,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "visitorsFee",
      headerName: "Visitors Fee",
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
      align: "center",
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

  const onSubmitForm = (formData) => {
    const fromDate = new Date(formData.fromDate).toISOString()
    const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD")
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    }

    // Save - DB
    axios
      .post(`${urls.CFCURL}/master/bankMaster/saveBankMaster`, finalBodyForApi)
      .then((res) => {
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success")
          getBankMasterDetails()
          setButtonInputState(false)
          setIsOpenCollapse(false)
          setEditButtonInputState(false)
          setDeleteButtonState(false)
        }
      })
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
                DOG PARK MEMBERSHIP MASTER
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
                        <FormControl
                          style={{ minWidth: "230px" }}
                          error={!!errors.nameOfDogPark}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Name of Dog Park *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                autoFocus
                                fullWidth
                                value={field.value}
                                variant="standard"
                                label="Name Of Dog Park"
                              ></Select>
                            )}
                            name="nameOfDogPark"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.nameOfDogPark
                              ? errors.nameOfDogPark.message
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
                          id="standard-basic"
                          label="Name of Animal Owner *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("periodOfMembership")}
                          error={!!errors.nameOfMember}
                          helperText={
                            errors?.nameOfMember
                              ? errors.nameOfMember.message
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
                          label="Period of Membership *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("periodOfMembership")}
                          error={!!errors.periodOfMembership}
                          helperText={
                            errors?.periodOfMembership
                              ? errors.periodOfMembership.message
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
                          label="Membership Amount *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("membershipAmount")}
                          error={!!errors.membershipAmount}
                          helperText={
                            errors?.membershipAmount
                              ? errors.membershipAmount.message
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
                          label="Count of Animals *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("countOfAnimals")}
                          error={!!errors.countOfAnimals}
                          helperText={
                            errors?.countOfAnimals
                              ? errors.countOfAnimals.message
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
                          label="Address of the Animals Owner *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("addressOfTheAnimalsOwner")}
                          error={!!errors.addressOfTheAnimalsOwner}
                          helperText={
                            errors?.addressOfTheAnimalsOwner
                              ? errors.addressOfTheAnimalsOwner.message
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
                          error={!!errors.zoneName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Zone Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                fullWidth
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                variant="standard"
                                label="Zone Name"
                              ></Select>
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
                                fullWidth
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                variant="standard"
                                label="Ward Name"
                              >
                                {/* {zones &&
                                  zones.map((zone, index) => (
                                    <MenuItem key={index} value={zone.id}>
                                      {zone.zone}
                                    </MenuItem>
                                  ))} */}
                              </Select>
                            )}
                            name="wardName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.wardName ? errors.wardName.message : null}
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
                          error={!!errors.nameOfArea}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Name of Area *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                fullWidth
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                variant="standard"
                                label="Name Of Area"
                              >
                                {/* {zones &&
                                  zones.map((zone, index) => (
                                    <MenuItem key={index} value={zone.id}>
                                      {zone.zone}
                                    </MenuItem>
                                  ))} */}
                              </Select>
                            )}
                            name="nameOfArea"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.nameOfArea
                              ? errors.nameOfArea.message
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
                          id="standard-basic"
                          label="Mobile No *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("mobileNo")}
                          error={!!errors.mobileNo}
                          helperText={
                            errors?.mobileNo ? errors.mobileNo.message : null
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
                          label="Email ID *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("emailId")}
                          error={!!errors.emailId}
                          helperText={
                            errors?.emailId ? errors.emailId.message : null
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
                          label="Visitors Fee *"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("visitorsFee")}
                          error={!!errors.visitorsFee}
                          helperText={
                            errors?.visitorsFee
                              ? errors.visitorsFee.message
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

export default Index
