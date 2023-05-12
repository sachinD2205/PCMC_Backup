import { yupResolver } from "@hookform/resolvers/yup"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import PreviewIcon from "@mui/icons-material/Preview"
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
  MenuItem,
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
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstDefineCommitteeEstablishmentSchema"
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
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"

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
  const [btnSaveText, setBtnSaveText] = useState("save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [inputState, setInputState] = useState()
  const [dataInModal, setDataInModal] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [comittees1, setcomittees1] = useState([])

  const getcomittees1 = () => {
    axios.get(`${urls.MSURL}/mstDefineCommittees/getAll`).then((r) => {
      setcomittees1(
        r.data.committees.map((row) => ({
          id: row.id,
          comittee: row.committeeName,
          comitteeMr: row.committeeNameMr,

        }))
      )
    })
  }

  useEffect(() => {
    getcomittees1()
  }, [])

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
            .post(`${urls.MSURL}/mstDefineCommitteeEstablishment/save`, body)
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
            .post(`${urls.MSURL}/mstDefineCommitteeEstablishment/save`, body)
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
    console.log("From Date ${fromDate} ")
    const committeeEstablishedDate = new Date(
      formData.committeeEstablishedDate
    ).toISOString()
    const committeeDismissedDate = new Date(
      formData.committeeDismissedDate
    ).toISOString()

    // // Update Form Data
    const finalBodyForApi = {
      ...formData,
      committeeEstablishedDate,
      committeeDismissedDate,
      activeFlag: btnSaveText === "update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(
          `${urls.MSURL}/mstDefineCommitteeEstablishment/save`,
          finalBodyForApi
        )
        .then((res) => {
          if (res.status === 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
            setIsOpenCollapse(false)
            setTimeout(() => {
              window.location.reload()
            }, 2500)
          }
        })
    }
    // Update Data Based On ID
    else if (btnSaveText === "update") {
      console.log("Put -----")
      axios
        .post(
          `${urls.MSURL}/mstDefineCommitteeEstablishment/save`,
          finalBodyForApi
        )
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

  // Get Table - Data
  const getlicenseTypeDetails = () => {
    console.log("getLIC ----")
    axios
      .get(`${urls.MSURL}/mstDefineCommitteeEstablishment/getAll`)
      .then((res) => {
        setDataSource(
          res.data.committeeEstablishment.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            committeeDismissedDate: r.committeeDismissedDate,
            committeeEstablishedDate: r.committeeEstablishedDate,
            honorariumPerMeeting: r.honorariumPerMeeting,
            // nameOfCommittee: r.nameOfCommittee?.toString(),
            nameOfCommittee: comittees1?.find((obj) => obj.id === r.committeeNo)?.comittee,
            nameOfCommitteeMr: comittees1?.find((obj) => obj.id === r.committeeNo)?.comitteeMr,
            working: r.working,
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
      // headerName: "Sr.No",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },

    {
      field: "nameOfCommittee",
      // headerName: "Name of Committee",
      headerName: <FormattedLabel id="nameOfCommitee" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "committeeEstablishedDate",
      // headerName: "Committee Established Date",
      headerName: <FormattedLabel id="committeeEstablishedDate" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "committeeDismissedDate",
      // headerName: "Committee Dismissed Date",
      headerName: <FormattedLabel id="committeeDismissedDate" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "honorariumPerMeeting",
      // headerName: "Honarium/Meeting",
      headerName: <FormattedLabel id="honorariumPerMeeting" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "working",
      // headerName: "Working/Not Working",
      headerName: <FormattedLabel id="workingNotWorking" />,
      // type: "number",
      flex: 1,
    },

    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="actions" />,
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
                  setBtnSaveText("update"),
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
          {/* Define Committee Establishment */}
          <FormattedLabel id="defineCommitteeEstablishment" />
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
            {/* <div
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
              Define Committee Establishment
            </div> */}
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid
                container
                sx={{
                  marginLeft: 12,
                  marginTop: 2,
                  marginBottom: 5,
                  align: "center",
                }}
              >
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <FormControl
                    variant="standard"
                    //  key={comittees.id}
                    // {...register(`committeeses.${index}.firstName`)}

                    sx={{ m: 1, minWidth: 120 }}
                    error={!!errors.comittee}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* Select Committee * */}
                      <FormattedLabel id="selectCommittee" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 200 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          // label="Select Committee*"
                          label={<FormattedLabel id="selectCommittee" />}
                        >
                          <MenuItem value="committee 1">comittee1</MenuItem>
                          {comittees1 &&
                            comittees1.map((comittee, index) => (
                              <MenuItem key={index} value={comittee.id}>
                                {comittee.comittee}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="committeeNo"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.comittee ? errors.comittee.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <FormControl style={{ marginTop: 10, width: 185 }}>
                    <Controller
                      control={control}
                      name="committeeEstablishedDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            // label={
                            //   <span style={{ fontSize: 16 }}>
                            //     Committee Established Date
                            //   </span>
                            // }
                            label={<FormattedLabel id="committeeEstablishedDate" />}
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

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <FormControl style={{ marginTop: 10, width: 185 }}>
                    <Controller
                      control={control}
                      name="committeeDismissedDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            // label={
                            //   <span style={{ fontSize: 16 }}>
                            //     Committee Dismissed Date
                            //   </span>
                            // }
                            label={<FormattedLabel id="committeeDismissedDate" />}
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

                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <TextField
                    id="standard-basic"
                    type="number"
                    // label="Honarium /Meeting *"
                    label={<FormattedLabel id="honorariumPerMeeting" />}
                    variant="standard"
                    {...register("honorariumPerMeeting")}
                    error={!!errors.honariumperMeeting}
                    helperText={
                      errors?.honariumperMeeting
                        ? errors.honariumperMeeting.message
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <FormControl
                    variant="standard"
                    sx={{ m: 2, minWidth: 120 }}
                    error={!!errors.workingorNot}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* Working /Not Working */}
                      <FormattedLabel id="workingNotWorking" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          //  sx={{ width: 100 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          // label=" Working/Not Working  *"
                          label={<FormattedLabel id="workingNotWorking" />}
                        >
                          <MenuItem value={"Yes"}>Yes</MenuItem>
                          <MenuItem value={"No"}>No</MenuItem>
                        </Select>
                      )}
                      name="working"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.workingorNot
                        ? errors.workingorNot.message
                        : null}
                    </FormHelperText>
                  </FormControl>
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
                  {/* {btnSaveText} */}
                  {<FormattedLabel id={btnSaveText} />}
                </Button>{" "}
                <Button
                  sx={{ marginRight: 8 }}
                  variant="contained"
                  color="primary"
                  endIcon={<ClearIcon />}
                  onClick={() => cancellButton()}
                >
                  {/* Clear */}
                  {<FormattedLabel id="clear" />}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  onClick={() => exitButton()}
                >
                  {/* Exit */}
                  {<FormattedLabel id="exit" />}
                </Button>
              </div>
            </form>
          </div>
        )}

        {!isOpenCollapse ?
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
                setBtnSaveText("save")
                setIsOpenCollapse(!isOpenCollapse)
              }}
            >
              {/* Add{" "} */}
              {<FormattedLabel id="add" />}
            </Button>
          </div>
          : ""}
        <DataGrid
          autoHeight
          // sx={{
          //   marginLeft: 5,
          //   marginRight: 5,
          //   marginTop: 5,
          //   marginBottom: 5,
          // }}
          sx={{
            // marginLeft: 5,
            // marginRight: 5,
            marginTop: 5,
            // marginBottom: 5,

            overflowY: "scroll",

            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },

            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          rows={dataSource || []}
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
