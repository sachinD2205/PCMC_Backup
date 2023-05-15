import { yupResolver } from '@hookform/resolvers/yup'
import ClearIcon from '@mui/icons-material/Clear'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import sweetAlert from 'sweetalert'

import urls from '../../../../URLS/urls'
import styles from './view.module.css'
const Form = () => {
  let documentsUpload = null
  let appName = 'MR'
  let serviceName = 'M-MBR'
  let applicationFrom = 'Web'
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    // resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [businessTypes, setBusinessTypes] = useState([])
  const router = useRouter()
  const [activeStep, setActiveStep] = useState()
  const [checked, setChecked] = useState(true)
  //   const steps = getSteps();
  const [complaintTypes, setcomplaintTypes] = useState([])
  const [complaintSubTypes, setcomplaintSubTypes] = useState([])
  const [departments, setDepartments] = useState([])
  const dispach = useDispatch()
  useEffect(() => {
    getComplaintTypes()
  }, [])

  useEffect(() => {
    getComplaintSubType()
  }, [complaintTypes])

  const getComplaintTypes = () => {
    axios
      .get(`${urls.BaseURL}/complaintTypeMaster/getComplaintTypeMasterData`)
      .then((res) => {
        // console.log("comp",res)
        setcomplaintTypes(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            id: r.id,
            complaintType: r.complaintType,
          })),
        )
      })
  }
  const getComplaintSubType = () => {
    axios
      .get(
        `${urls.BaseURL}/complaintSubTypeMaster/getComplaintSubTypeMasterData`,
      )
      .then((res) => {
        setcomplaintSubTypes(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            complaintSubType: r.complaintSubType,
            complaintType: r.complaintType,
            complaintTypeName: complaintTypes?.find(
              (obj) => obj.id === r.complaintType,
            )?.complaintType,
          })),
        )
      })
  }
  useEffect(() => {
    getDepartment()
  }, [])
  const getDepartment = () => {
    axios.get(`${urls.CfcURLMaster}/department/getAll`).then((res) => {
      setDepartments(
        res.data.map((r, i) => ({
          id: r.id,
          department: r.department,
        })),
      )
    })
  }
  const editRecord = (rows) => {
    setBtnSaveText('Update'),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true)
    reset(rows)
  }

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const fromDate = new Date(fromData.fromDate).toISOString();
    // const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      //   fromDate,
      //   toDate,
    }
    if (btnSaveText === 'Save') {
      axios
        .post(
          `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert('Saved!', 'Record Saved successfully !', 'success')
            getBusinesSubType()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    } else if (btnSaveText === 'Update') {
      axios
        .post(
          `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert('Updated!', 'Record Updated successfully !', 'success')
            getBusinesSubType()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    }
  }

  const deleteById = (value) => {
    swal({
      title: 'Delete?',
      text: 'Are you sure you want to delete this Record ? ',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.BaseURL}/businessSubType/discardBusinessSubType/${value}`,
          )
          .then((res) => {
            if (res.status == 226) {
              swal('Record is Successfully Deleted!', {
                icon: 'success',
              })
              setButtonInputState(false)
              //getcast();
            }
          })
      } else {
        swal('Record is Safe')
      }
    })
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
    subject: '',
    description: '',
    id: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    complaintType: '',
    businessSubType: '',
    businessSubTypePrefix: '',
    remark: '',
    id: null,
  }
  const locateButton = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('ActiveSteps' + activeStep + 'StepsLength' + steps.length)
      console.log('Latitude is :', position.coords.latitude)
      console.log('Longitude is :', position.coords.longitude)
    })
  }
  const handleNext = (data) => {
    dispach(addIsssuanceofHawkerLicense(data))
    console.log(data)
    if (activeStep == steps.length - 1) {
      fetch('https://jsonplaceholder.typicode.com/comments')
        .then((data) => data.json())
        .then((res) => {
          console.log(res)
          setActiveStep(activeStep + 1)
        })
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }
  const handleFile1 = async (e, labelName) => {
    let formData = new FormData()
    formData.append('file', e.target.files[0])
    axios
      .post(
        `http://localhost:8090/cfc/api/file/upload?appName=${appName}&serviceName=${serviceName}`,
        formData,
      )
      .then((r) => {
        if (r.status == 200) {
          console.log(r.data)
          console.log(r.data.filePath)
          if (labelName === 'documentsUpload') {
            console.log('File path sapadala Ka---?>', r.data.filePath)
            setValue('documentsUpload', r.data.filePath)
          }
        } else {
          sweetAlert('Error')
        }
      })
  }
  // View
  return (
    <>
      {/* <BasicLayout> */}
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className={styles.small}>
                <br />
                <Typography
                  variant="h6"
                  style={{ backgroundColor: 'darkgrey' }}
                >
                  Grievance Details:
                </Typography>

                <div className={styles.row}>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Citizen Name"
                      variant="standard"
                      // { type: 'search'}
                      // {...register("businessSubTypePrefix")}
                      // error={!!errors.businessSubTypePrefix}
                      // helperText={
                      //   errors?.businessSubTypePrefix
                      //     ? errors.businessSubTypePrefix.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Application Type"
                      variant="standard"
                      // {...register("businessSubTypePrefix")}
                      // error={!!errors.businessSubTypePrefix}
                      // helperText={
                      //   errors?.businessSubTypePrefix
                      //     ? errors.businessSubTypePrefix.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="periodOfResidenceInPCMC"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 12 }}>
                                Grievance Date
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format('YYYY-MM-DD'))
                            }
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
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <TextField
                      required
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Area"
                      variant="standard"
                      // {...register("businessSubTypePrefix")}
                      // error={!!errors.businessSubTypePrefix}
                      // helperText={
                      //   errors?.businessSubTypePrefix
                      //     ? errors.businessSubTypePrefix.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                  <div>
                    <TextField
                      required
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Category"
                      variant="standard"
                      // {...register("businessSubTypePrefix")}
                      // error={!!errors.businessSubTypePrefix}
                      // helperText={
                      //   errors?.businessSubTypePrefix
                      //     ? errors.businessSubTypePrefix.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                  <div>
                    <TextField
                      required
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Event"
                      variant="standard"
                      // {...register("businessSubTypePrefix")}
                      // error={!!errors.businessSubTypePrefix}
                      // helperText={
                      //   errors?.businessSubTypePrefix
                      //     ? errors.businessSubTypePrefix.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                </div>
                <div className={styles.row}></div>
                <div className={styles.row}>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.complaintType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Complaint Type
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Complaint Name"
                          >
                            {complaintTypes &&
                              complaintTypes.map((complaintType, index) => (
                                <MenuItem key={index} value={complaintType.id}>
                                  {complaintType.complaintType}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="complaintType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.complaintType
                          ? errors.complaintType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.businessType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Complaint Sub Type
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Complaint Sub Type"
                          >
                            {complaintSubTypes &&
                              complaintSubTypes.map(
                                (complaintSubType, index) => (
                                  <MenuItem
                                    key={index}
                                    value={complaintSubType.id}
                                  >
                                    {complaintSubType.complaintSubType}
                                  </MenuItem>
                                ),
                              )}
                          </Select>
                        )}
                        name="complaintSubType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.complaintSubType
                          ? errors.complaintSubType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>
                {/* <br/><br/> */}
                {/* <Typography variant="h6" style={{backgroundColor:'darkgrey'}}>Forward To:</Typography> */}
                <div className={styles.row}>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.department}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Department Name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Departmentname"
                          >
                            {departments &&
                              departments.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {department.department}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="department"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.department ? errors.department.message : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: 120 }}
                      error={!!errors.subDepartment}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Sub Department Name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Sub Department"
                          >
                            {/* {subDepartments &&
                                    subDepartments.map((subDepartment, index) => (
                                      <MenuItem
                                        key={index}
                                        value={subDepartment.id}
                                      >
                                        {subDepartment.subDepartment}
                                      </MenuItem>
                                    ))} */}
                          </Select>
                        )}
                        name="subDepartment"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.subDepartment
                          ? errors.subDepartment.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <TextField
                      required
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Subject"
                      variant="standard"
                      // {...register("businessSubTypePrefix")}
                      // error={!!errors.businessSubTypePrefix}
                      // helperText={
                      //   errors?.businessSubTypePrefix
                      //     ? errors.businessSubTypePrefix.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.btn}>
                <br />
                <br />
                <Button
                  sx={{ marginRight: 4 }}
                  type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                >
                  {btnSaveText}
                </Button>{' '}
                <Button
                  sx={{ marginRight: 4 }}
                  variant="contained"
                  color="primary"
                  endIcon={<ClearIcon />}
                  onClick={() => cancellButton()}
                >
                  Clear
                </Button>
                <Button
                  sx={{ marginRight: 4 }}
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  onClick={() => {
                    router.push({
                      pathname:
                        '/grievanceMonitoring/transactions/complaintAutoEscalation/',
                    })
                  }}
                >
                  Exit
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </Paper>
    </>
  )
}

export default Form
