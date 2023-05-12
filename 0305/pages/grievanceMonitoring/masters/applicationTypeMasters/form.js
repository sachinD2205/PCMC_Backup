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
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import sweetAlert from 'sweetalert'
import urls from '../../../../URLS/urls'

import styles from '../complaintTypeMasters/view.module.css'

const Form = () => {
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
    //resolver: yupResolver(schema),
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
  const dispach = useDispatch()

  const applicationtypes = [
    {
      value: 'General',
    },
    {
      value: 'MLA',
    },
    {
      value: 'Mayer',
    },
  ]

  const [applicationtype, setApplicationtype] = useState('')

  const handleChange = (event) => {
    setApplicationtype(event.target.value)
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
          `${urls.CFCURL}/master/businessSubType/saveBusinessSubType`,
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
          `${urls.CFCURL}/master/businessSubType/saveBusinessSubType`,
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
            `${urls.CFCURL}/master/businessSubType/discardBusinessSubType/${value}`,
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
    template: '',
    remark: '',
    applicationtype: '',
    id: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    template: '',
    businessType: '',
    businessSubType: '',
    businessSubTypePrefix: '',
    remark: '',
    applicationtype: '',
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
  // View
  return (
    <>
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
                <div className={styles.row}>
                  <div>
                    {/* <TextField
                            select
                            label="Application Type"
                            value={applicationtype}
                            onChange={handleChange}
                            helperText="Please select application type"
                            autoFocus
                            sx={{ width: 250 }}
                            id="standard-basic"
                            variant="standard"
                            // {...register("setApplicationtype")}
                            // error={!!errors.setApplicationtype}
                            // helperText={
                            //   errors?.setApplicationtype
                            //     ? errors.setApplicationtype.message
                            //     : null
                            // }
                          >
                            {applicationtypes.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.value}
                              </MenuItem>
                            ))}
                        </TextField> */}
                    <FormControl
                      variant="standard"
                      sx={{ width: 250 }}
                      error={!!errors.applicationtype}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Application Type
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="applicationtype"
                          >
                            <MenuItem value=" ">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="General">General</MenuItem>
                            <MenuItem value="MLA">MLA</MenuItem>
                            <MenuItem value="Mayer">Mayer</MenuItem>
                          </Select>
                        )}
                        name="Application Type"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.applicationtype
                          ? errors.applicationtype.message
                          : null}
                        ,
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <label> Template Data</label>
                    <br />
                    <TextField
                      required
                      multiline
                      minRows={2}
                      maxRows={2}
                      style={{
                        width: 250,
                        resize: 'vertical',
                        overflow: 'auto',
                      }}
                      autoFocus
                      sx={{ width: 250 }}
                      maxlength="50"
                      id="standard-basic"
                      variant="outlined"
                      {...register('template')}
                      error={!!errors.template}
                      helperText={
                        errors?.template ? errors.template.message : null
                      }
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <label>Remark</label>
                    <br />
                    <TextField
                      required
                      multiline
                      minRows={2}
                      maxRows={2}
                      style={{
                        width: 250,
                        resize: 'vertical',
                        overflow: 'auto',
                      }}
                      autoFocus
                      sx={{ width: 250 }}
                      maxlength="50"
                      id="standard-basic"
                      variant="outlined"
                      {...register('remark')}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
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
                        '/grievanceMonitoring/masters/applicationTypeMasters/',
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
