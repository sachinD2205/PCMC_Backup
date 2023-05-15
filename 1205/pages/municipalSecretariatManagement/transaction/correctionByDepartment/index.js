import React, { useEffect, useState } from "react"
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
  Select,
  FormControlLabel,
  Checkbox,
  Tooltip,
  MenuItem,
  RaisedButton,
  Preview,
} from "@mui/material"
import EditRoundedIcon from "@mui/icons-material/EditRounded"
import PreviewIcon from "@mui/icons-material/Preview"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import { DataGrid } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import BasicLayout from "../../../../containers/Layout/BasicLayout"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import sweetAlert from "sweetalert"
import { LeftOutlined } from "@ant-design/icons"
import { styled, useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Drawer from "@mui/material/Drawer"
import axios from "axios"
import moment from "moment"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/TrnCorrectionByDepartmentSchema"
import urls from "../../../../URLS/urls"

const CorrectionByDepartment = () => {
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

  const [data, setData] = useState([])

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [isOpenCollapseNew, setIsOpenCollapseNew] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [wardNames, setwardNames] = useState([])

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const dateOfBirth = new Date(formData.dateOfBirth).toISOString()
    const electedDate = new Date(formData.electedDate).toISOString()
    const fromDate = new Date(formData.fromDate).toISOString()
    const toDate = new Date(formData.toDate).toISOString()
    const nominatedAsChairperson = formData?.nominatedAsChairperson?.toString()
    const nominatedCorporators = Number(formData?.nominatedCorporators)
    const memberChange = formData?.memberChange?.toString()
    console.log("From Date ${formData} ")

    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      dateOfBirth,
      electedDate,
      fromDate,
      toDate,
      nominatedAsChairperson,
      nominatedCorporators,
      memberChange,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(
          `${urls.MSURL}/mstDefineCommitteeMembers/save`,

          finalBodyForApi
        )
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
        .post(
          `${urls.BaseURL}/master/MstLicenseType/editLicenseType/?id=${id}`,
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
            .post(`${urls.MSURL}/trnPrepareMeetingAgenda/save`, body)
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
            .post(`${urls.MSURL}/trnPrepareMeetingAgenda/save`, body)
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

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      headerAlign: "center",
      // flex: 1,
      width: 80,
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "docketNo",
      headerName: "Docket No.",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "subjectDate",
      headerName: "Subject Date",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },
    {
      field: "subject",
      headerName: "Subject",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },
    {
      field: "subjectSummary",
      headerName: "Subject Summary",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },
    {
      field: "selectCommittees",
      headerName: "Select Committees",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },
    {
      field: "financialYear",
      headerName: "Financial Year",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },
    {
      field: "subjectLetterDocket",
      headerName: "Subject Letter/Docket Type",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },
    {
      field: "uploadDocument",
      headerName: "Upload Document",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      // width:100,
      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
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

  return (
    <div>
      <BasicLayout titleProp={"none"}>
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
            Correction By Department
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
                Correction By Department
                {/* <strong> Document Upload</strong> */}
              </div>
              <FormProvider {...methods}>
                <form
                //  onSubmit={handleSubmit(onSubmitForm)}
                >
                  <div className={styles.small}>
                    <div className={styles.maindiv}>
                      <Grid
                        container
                        sx={{
                          marginLeft: 2,
                          marginTop: 2,
                          marginBottom: 5,
                          align: "center",
                        }}
                        columns={16}
                      >
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField label="Department Name" />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 40, width: 230 }}>
                            <Controller
                              control={control}
                              name="Subject Date"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY/MM/DD"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        Subject Date
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

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField label="Docket No." />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField label="Subject" />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Select Committees
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Select Committees"
                                >
                                  <MenuItem value={1}>1</MenuItem>
                                  <MenuItem value={2}>2</MenuItem>
                                </Select>
                              )}
                              name="gender"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField label="Subject Summary" />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField label="Subject Letter/Docket Type" />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 40, width: 230 }}>
                            <Controller
                              control={control}
                              name="Subject Date"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY/MM/DD"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        Financial Year
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

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField label="Amount" />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl sx={{ pt: 5, pb: 2 }}>
                            <Button
                              sx={{
                                backgroundColor: "rgb(0, 132, 255) !important",
                                color: "white !important",
                              }}
                              disabled
                              size="large"
                              variant="contained"
                            >
                              Edit <EditRoundedIcon fontSize="Medium" />
                            </Button>
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField multiline label="Reason" rows={4} />
                          </FormControl>
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
                // reset({
                //   ...resetValuesExit,
                // });
                setBtnSaveText("Save")
                setIsOpenCollapse(!isOpenCollapse)
              }}
            >
              Add{" "}
            </Button>
          </div>

          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                autoHeight
                sx={{
                  marginLeft: 5,
                  marginRight: 5,
                  marginTop: 5,
                  marginBottom: 5,
                }}
                // rows={dataSource}
                rows={[]}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                experimentalFeatures={{ newEditingApi: true }}
                //checkboxSelection
              />
            </div>
          </div>
        </Paper>
      </BasicLayout>
    </div>
  )
}

export default CorrectionByDepartment