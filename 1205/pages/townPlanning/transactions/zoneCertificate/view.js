import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Head from 'next/head'
import { useRouter } from 'next/router'
// @ts-ignore
// import map from '../../../../public/map.png'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import {
  Paper,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  MenuItem,
  Checkbox,
} from '@mui/material'
import { FormProvider, Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from './zoneCertificate.module.css'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import URLS from '../../../../URLS/urls'
import { useSelector } from 'react-redux'
import Image from 'next/image'

const FinalView = () => {
  const router = useRouter()

  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  // @ts-ignore
  const userDetails = useSelector((state) => state.user.user.userDao)

  const [newDate, setNewDate] = useState('')
  const [personalDetails, setPersonalDetails] = useState({})
  const [areaDetails, setAreaDetails] = useState({})
  const [runAgain, setRunAgain] = useState(false)
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [gender, setGender] = useState([
    {
      id: 1,
      genderEn: '',
      genderMr: '',
    },
  ])
  const [title, setTitle] = useState([
    {
      id: 1,
      titleEn: '',
      titleMr: '',
    },
  ])
  const [zone, setZone] = useState([
    {
      id: 1,
      zoneEn: '',
      zoneMr: '',
    },
  ])
  const [village, setVillage] = useState([
    {
      id: 1,
      villageEn: '',
      villageMr: '',
    },
  ])
  const [gat, setGat] = useState([
    {
      id: 1,
      gatEn: '',
      gatMr: '',
    },
  ])
  const [reservationName, setReservationName] = useState([
    {
      id: 1,
      reservationNameEn: '',
      reservationNameMr: '',
    },
  ])

  //Personal Details
  let personalDetailsSchema = yup.object().shape({
    title: yup.string().required('Please select a Title'),
    firstNameEn: yup.string().required('Please First name in English'),
    firstNameMr: yup.string().required('Please First name in Marathi'),
    middleNameEn: yup.string().required('Please Middle name in English'),
    middleNameMr: yup.string().required('Please Middle name in Marathi'),
    surnameEn: yup.string().required('Please Last name in English'),
    surnameMr: yup.string().required('Please Last name in Marathi'),
    gender: yup.string().required('Please select a Gender'),
    mobile: yup.number().required('Please select a Mobile'),
    panNo: yup.string().required('Please select a Pan No'),
    emailAddress: yup.string().required('Please select an Email Address'),
    aadhaarNo: yup.string().required('Please select a Aadhaar No.'),
  })

  //Area Details
  let areaDetailsSchema = yup.object().shape({
    reservationNo: yup.string().required('Please select Reservation'),
    tDRZone: yup.string().required('Please select a Zone'),
    villageName: yup.string().required('Please select a Village'),
    gatNo: yup.string().required('Please select a Gat'),
    pincode: yup.number().required('Please enter a pincode'),
    serviceCompletionDate: yup.string().required('Please select a date.'),
  })

  const {
    register,
    handleSubmit,
    // @ts-ignore
    methods,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(personalDetailsSchema),
  })

  const {
    register: register1,
    handleSubmit: handleSubmit2,
    // @ts-ignore
    methods: methods2,
    reset: reset2,
    control: control2,
    // watch,
    formState: { errors: error2 },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(areaDetailsSchema),
  })

  useEffect(() => {
    if (isCurrentUser) {
      reset({
        firstNameEn: userDetails.firstNameEn,
        middleNameEn: userDetails.middleNameEn,
        surnameEn: userDetails.lastNameEn,
        firstNameMr: userDetails.firstNameMr,
        middleNameMr: userDetails.middleNameMr,
        surnameMr: userDetails.lastNameMr,
      })
    } else {
      reset({
        firstNameEn: '',
        middleNameEn: '',
        surnameEn: '',
        firstNameMr: '',
        middleNameMr: '',
        surnameMr: '',
      })
    }
  }, [isCurrentUser, userDetails, reset])

  useEffect(() => {
    // Date
    let appDate = new Date()
    setNewDate(moment(appDate, 'YYYY-MM-DD').format('YYYY-MM-DD'))

    //Gender
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((res) => {
      setGender(
        res.data.gender.map((j) => ({
          id: j.id,
          genderEn: j.gender,
          genderMr: j.gendermr,
        }))
      )
    })

    //Title
    axios.get(`${URLS.CFCURL}/master/title/getAll`).then((res) => {
      setTitle(
        res.data.title.map((j) => ({
          id: j.id,
          titleEn: j.title,
          titleMr: j.titlemr,
        }))
      )
    })

    //Zone
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((res) => {
      console.log('Zone: ', res.data)
      setZone(
        res.data.zone.map((j) => ({
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zonenamemar,
        }))
      )
    })

    //Village
    axios.get(`${URLS.CFCURL}/master/village/getAll`).then((res) => {
      setVillage(
        res.data.village.map((j) => ({
          id: j.id,
          villageEn: j.villageName,
          villageMr: j.villageNameMr,
        }))
      )
    })

    //Gat
    axios.get(`${URLS.CFCURL}/master/gatMaster/getAll`).then((r) => {
      setGat(
        r.data.gatMaster.map((j, i) => ({
          id: j.id,
          gatEn: j.gatNameEn,
          gatMr: j.gatNameMr,
        }))
      )
    })

    //Reservation Name
    axios.get(`${URLS.TPURL}/landReservationMaster/getAll`).then((r) => {
      setReservationName(
        r.data.map((j, i) => ({
          id: i + 1,
          reservationNameEn: j.reservationNameEng,
          reservationNameMr: j.reservationNameMr,
        }))
      )
    })
  }, [])

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

  // const steps = ['Advocate Details', 'Bank Details', 'Document Upload']

  const steps = [
    <FormattedLabel key={1} id='personalDetails' />,
    <FormattedLabel key={2} id='areaDetails' />,
    <FormattedLabel key={3} id='documentUpload' />,
  ]
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState({})

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    const newCompleted = completed
    newCompleted[activeStep - 1] = false
    setCompleted(newCompleted)
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
  }

  const handleReset = () => {
    setActiveStep(0)
    setCompleted({})
  }

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

  useEffect(() => {
    setRunAgain(false)
    setActiveStep(0)
    setCompleted({})
  }, [runAgain])

  const personalSubmit = (personalData) => {
    console.log('Personal Details: ', personalData)
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()

    setPersonalDetails(personalData)
  }

  const areaSubmit = (areaData) => {
    console.log('Area Details: ', areaData)
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()

    setAreaDetails(areaData)
  }

  const finalSubmit = async () => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()

    const bodyForAPI = {
      ...personalDetails,
      ...areaDetails,
      status: 'Application Created',
      applicationDate: newDate,
      serviceName: 'Zone Certificate',
      applicationNo: router.query.length
        ? `TP/ZC/04/${router.query.length}/2022`
        : `TP/ZC/04/001/2022`,
    }

    console.log('Body For API: ', bodyForAPI)

    // if (router.query.pageMode === 'edit') {
    //   await axios
    //     .patch(
    //       `${URLS.TPURL}/zoneCertificate/updateZoneCertificate`,
    //       bodyForAPI,
    //       {
    //         headers: {
    //           // Authorization: `Bearer ${token}`,
    //           role: 'CITIZEN',
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       if (response.status === 200) {
    //         sweetAlert('Updated!', 'Record Updated successfully !', 'success')
    //         router.push('/townPlanning/transactions/zoneCertificate')
    //       }
    //     })
    // } else {
    await axios
      .post(`${URLS.TPURL}/zoneCertificate/saveZoneCertificate`, bodyForAPI, {
        headers: {
          // Authorization: `Bearer ${token}`,
          role: 'CITIZEN',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          sweetAlert('Saved!', 'Record Saved successfully !', 'success')
          router.push('/townPlanning/transactions/zoneCertificate')
        }
      })
    // }
  }

  const onBack = () => {
    const urlLength = router.asPath.split('/').length
    const urlArray = router.asPath.split('/')
    let backUrl = ''
    if (urlLength > 2) {
      for (let i = 0; i < urlLength - 1; i++) {
        backUrl += urlArray[i] + '/'
      }
      console.log('Final URL: ', backUrl)
      router.push(`${backUrl}`)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <Head>
        <title>Zone Certificate</title>
      </Head>
      {/* <Paper
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '10vh',
            marginBottom: '2vh',
          }}
        >
          <h2>ADVOCATE</h2>
        </Paper> */}
      <Paper className={styles.main}>
        <h2
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          <FormattedLabel id='zoneCertificate' />
        </h2>
        {/* <Divider textAlign='center'>
          <h2 style={{ fontWeight: 'bold' }}>ADVOCATE</h2>
          </Divider> */}
        <Box sx={{ width: '100%', marginTop: '3vh' }}>
          <Stepper nonLinear activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index} completed={completed[index]}>
                <StepButton color='inherit' onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            {allStepsCompleted() ? (
              // <>
              //   <div
              //     style={{
              //       display: 'flex',
              //       justifyContent: 'center',
              //       alignItems: 'center',
              //       padding: '2vw 2vw',
              //       marginTop: '2%',
              //     }}
              //   >
              //     <h2>
              //       <FormattedLabel id='applicationCreated' />
              //     </h2>
              //   </div>
              //   <div
              //     style={{
              //       display: 'flex',
              //       justifyContent: 'center',
              //       alignItems: 'center',
              //       width: '100%',
              //     }}
              //   >
              //     <Button
              //       color='primary'
              //       variant='contained'
              //       sx={{ marginRight: '2vw' }}
              //       onClick={onBack}
              //     >
              //       <FormattedLabel id='exit' />
              //     </Button>
              //   </div>
              // </>
              ' '
            ) : (
              <>
                {/* Advocate Details  */}
                {activeStep === 0 && (
                  <>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(personalSubmit)}>
                        <Paper className={styles.fieldsStepper}>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'flex-end',
                              marginTop: '2%',
                            }}
                          >
                            <Checkbox
                              checked={isCurrentUser}
                              onChange={() => {
                                setIsCurrentUser(!isCurrentUser)
                              }}
                            />
                            <h3>
                              <FormattedLabel id='isCurrentUser' />
                            </h3>
                          </div>
                          <div
                            className={styles.row}
                            //   style={{ marginTop: '2%' }}
                          >
                            <FormControl
                              sx={{
                                //   marginTop: '1.5%',
                                width: '230px',
                              }}
                              variant='standard'
                              error={!!errors.title}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={router.query.title ? true : false}
                              >
                                <FormattedLabel id='title' required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    disabled={router.query.title ? true : false}
                                    value={
                                      router.query.title
                                        ? router.query.title
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='title'
                                  >
                                    {title &&
                                      title.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.titleEn
                                              : value?.titleMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='title'
                                control={control}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.title ? errors.title.message : null}
                              </FormHelperText>
                            </FormControl>

                            <TextField
                              sx={{
                                width: '230px',
                              }}
                              id='standard-basic'
                              label={
                                <FormattedLabel id='firstNameEn' required />
                              }
                              variant='standard'
                              {...register('firstNameEn')}
                              error={!!errors.firstNameEn}
                              helperText={
                                errors?.firstNameEn
                                  ? errors.firstNameEn.message
                                  : null
                              }
                              InputLabelProps={{
                                shrink: watch('firstNameEn') ? true : false,
                              }}
                              disabled={
                                (router.query.firstNameEn ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.firstNameEn
                                  ? router.query.firstNameEn
                                  : ''
                              }
                            />
                            <TextField
                              sx={{
                                width: '230px',
                                // marginRight: '5%',
                              }}
                              id='standard-basic'
                              label={
                                <FormattedLabel id='middleNameEn' required />
                              }
                              variant='standard'
                              {...register('middleNameEn')}
                              error={!!errors.middleNameEn}
                              helperText={
                                errors?.middleNameEn
                                  ? errors.middleNameEn.message
                                  : null
                              }
                              InputLabelProps={{
                                shrink: watch('middleNameEn') ? true : false,
                              }}
                              disabled={
                                (router.query.middleNameEn ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.middleNameEn
                                  ? router.query.middleNameEn
                                  : ''
                              }
                            />

                            <TextField
                              sx={{
                                width: '230px',
                              }}
                              id='standard-basic'
                              label={<FormattedLabel id='surnameEn' required />}
                              variant='standard'
                              {...register('surnameEn')}
                              error={!!errors.surnameEn}
                              helperText={
                                errors?.surnameEn
                                  ? errors.surnameEn.message
                                  : null
                              }
                              InputLabelProps={{
                                shrink: watch('surnameEn') ? true : false,
                              }}
                              disabled={
                                (router.query.surnameEn ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.surnameEn
                                  ? router.query.surnameEn
                                  : ''
                              }
                            />
                          </div>
                          <div
                            className={styles.row}
                            style={{ marginTop: '2%' }}
                          >
                            <TextField
                              sx={{
                                width: '230px',
                              }}
                              id='standard-basic'
                              label={
                                <FormattedLabel id='firstNameMr' required />
                              }
                              variant='standard'
                              {...register('firstNameMr')}
                              error={!!errors.firstNameMr}
                              helperText={
                                errors?.firstNameMr
                                  ? errors.firstNameMr.message
                                  : null
                              }
                              InputLabelProps={{
                                shrink: watch('firstNameMr') ? true : false,
                              }}
                              disabled={
                                (router.query.firstNameMr ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.firstNameMr
                                  ? router.query.firstNameMr
                                  : ''
                              }
                            />
                            <TextField
                              sx={{
                                width: '230px',
                                // marginRight: '5%',
                              }}
                              id='standard-basic'
                              label={
                                <FormattedLabel id='middleNameMr' required />
                              }
                              variant='standard'
                              {...register('middleNameMr')}
                              error={!!errors.middleNameMr}
                              helperText={
                                errors?.middleNameMr
                                  ? errors.middleNameMr.message
                                  : null
                              }
                              InputLabelProps={{
                                shrink: watch('middleNameMr') ? true : false,
                              }}
                              disabled={
                                (router.query.middleNameMr ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.middleNameMr
                                  ? router.query.middleNameMr
                                  : ''
                              }
                            />

                            <TextField
                              sx={{
                                width: '230px',
                              }}
                              id='standard-basic'
                              label={<FormattedLabel id='surnameMr' required />}
                              variant='standard'
                              {...register('surnameMr')}
                              error={!!errors.surnameMr}
                              helperText={
                                errors?.surnameMr
                                  ? errors.surnameMr.message
                                  : null
                              }
                              InputLabelProps={{
                                shrink: watch('surnameMr') && true,
                              }}
                              disabled={
                                (router.query.surnameMr ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.surnameMr
                                  ? router.query.surnameMr
                                  : ''
                              }
                            />

                            <FormControl
                              sx={{
                                width: '230px',
                              }}
                              variant='standard'
                              error={!!errors.gender}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={router.query.gender ? true : false}
                              >
                                <FormattedLabel id='gender' required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    // value={field.value}
                                    disabled={
                                      router.query.gender ? true : false
                                    }
                                    value={
                                      router.query.gender
                                        ? router.query.gender
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='gender'
                                  >
                                    {gender &&
                                      gender.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.genderEn
                                              : value?.genderMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='gender'
                                control={control}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.gender ? errors.gender.message : null}
                              </FormHelperText>
                            </FormControl>
                          </div>
                          <div
                            className={styles.row}
                            style={{ marginTop: '2%' }}
                          >
                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='mobile' required />}
                              variant='standard'
                              {...register('mobile')}
                              error={!!errors.mobile}
                              helperText={
                                errors?.mobile ? errors.mobile.message : null
                              }
                              disabled={router.query.mobile ? true : false}
                              defaultValue={
                                router.query.mobile ? router.query.mobile : ''
                              }
                            />

                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='panNo' required />}
                              variant='standard'
                              {...register('panNo')}
                              error={!!errors.panNo}
                              helperText={
                                errors?.panNo ? errors.panNo.message : null
                              }
                              disabled={router.query.panNo ? true : false}
                              defaultValue={
                                router.query.panNo ? router.query.panNo : ''
                              }
                            />

                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='email' required />}
                              variant='standard'
                              {...register('emailAddress')}
                              error={!!errors.emailAddress}
                              helperText={
                                errors?.emailAddress
                                  ? errors.emailAddress.message
                                  : null
                              }
                              disabled={
                                router.query.emailAddress ? true : false
                              }
                              defaultValue={
                                router.query.emailAddress
                                  ? router.query.emailAddress
                                  : ''
                              }
                            />

                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='aadharNo' required />}
                              variant='standard'
                              {...register('aadhaarNo')}
                              error={!!errors.aadhaarNo}
                              helperText={
                                errors?.aadhaarNo
                                  ? errors.aadhaarNo.message
                                  : null
                              }
                              disabled={router.query.aadhaarNo ? true : false}
                              defaultValue={
                                router.query.aadhaarNo
                                  ? router.query.aadhaarNo
                                  : ''
                              }
                            />
                          </div>
                        </Paper>
                        {/* </div> */}

                        <div className={styles.box}>
                          <Button
                            color='primary'
                            variant='contained'
                            onClick={onBack}
                          >
                            <FormattedLabel id='exit' />
                          </Button>

                          <Button
                            color='primary'
                            variant='contained'
                            disabled
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            <FormattedLabel id='back' />
                          </Button>
                          {activeStep !== steps.length && (
                            <Button
                              style={{ marginLeft: 800 }}
                              color='primary'
                              type='submit'
                              variant='contained'
                            >
                              <FormattedLabel id='saveAndNext' />
                            </Button>
                          )}
                        </div>
                      </form>
                    </FormProvider>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    {/* Bank Details  */}
                    <FormProvider {...methods2}>
                      <form onSubmit={handleSubmit2(areaSubmit)}>
                        <div
                          className={styles.fields}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Paper className={styles.leftSide}>
                            <FormControl
                              sx={{ width: '230px', marginTop: '2%' }}
                              variant='standard'
                              error={!!errors.reservationNo}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={
                                  router.query.reservationNo ? true : false
                                }
                              >
                                <FormattedLabel id='reservationNo' required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    disabled={
                                      router.query.reservationNo ? true : false
                                    }
                                    value={
                                      router.query.reservationNo
                                        ? router.query.reservationNo
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='reservationNo'
                                  >
                                    {reservationName &&
                                      reservationName.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.reservationNameEn
                                              : value?.reservationNameMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='reservationNo'
                                control={control2}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.reservationNo
                                  ? errors.reservationNo.message
                                  : null}
                              </FormHelperText>
                            </FormControl>

                            <FormControl
                              sx={{ width: '230px', marginTop: '2%' }}
                              variant='standard'
                              error={!!errors.tDRZone}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={router.query.tDRZone ? true : false}
                              >
                                <FormattedLabel id='zoneName' required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    disabled={
                                      router.query.tDRZone ? true : false
                                    }
                                    value={
                                      router.query.tDRZone
                                        ? router.query.tDRZone
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='tDRZone'
                                  >
                                    {zone &&
                                      zone.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.zoneEn
                                              : value?.zoneMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='tDRZone'
                                control={control2}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.tDRZone
                                  ? errors.tDRZone.message
                                  : null}
                              </FormHelperText>
                            </FormControl>

                            <FormControl
                              sx={{ width: '230px', marginTop: '2%' }}
                              variant='standard'
                              error={!!errors.villageName}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={
                                  router.query.villageName ? true : false
                                }
                              >
                                <FormattedLabel id='villageName' required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    disabled={
                                      router.query.villageName ? true : false
                                    }
                                    value={
                                      router.query.villageName
                                        ? router.query.villageName
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='villageName'
                                  >
                                    {village &&
                                      village.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.villageEn
                                              : value?.villageMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='villageName'
                                control={control2}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.villageName
                                  ? errors.villageName.message
                                  : null}
                              </FormHelperText>
                            </FormControl>

                            <FormControl
                              sx={{ width: '230px', marginTop: '2%' }}
                              variant='standard'
                              error={!!errors.gatNo}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={router.query.gatNo ? true : false}
                              >
                                <FormattedLabel id='gatName' required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    disabled={router.query.gatNo ? true : false}
                                    value={
                                      router.query.gatNo
                                        ? router.query.gatNo
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='gatNo'
                                  >
                                    {gat &&
                                      gat.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.gatEn
                                              : value?.gatMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='gatNo'
                                control={control2}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.gatNo ? errors.gatNo.message : null}
                              </FormHelperText>
                            </FormControl>

                            <TextField
                              sx={{ width: '230px', marginTop: '2%' }}
                              id='standard-basic'
                              label={<FormattedLabel id='pincode' required />}
                              variant='standard'
                              {...register1('pincode')}
                              error={!!errors.pincode}
                              helperText={
                                errors?.pincode ? errors.pincode.message : null
                              }
                              disabled={router.query.pincode ? true : false}
                              defaultValue={
                                router.query.pincode ? router.query.pincode : ''
                              }
                            />

                            <FormControl
                              style={{
                                width: '230px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '2%',
                              }}
                              error={!!errors.serviceCompletionDate}
                            >
                              <Controller
                                control={control2}
                                name='serviceCompletionDate'
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <DatePicker
                                      inputFormat='dd/MM/yyyy'
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel
                                            id='serviceCompletionDate'
                                            required
                                          />
                                        </span>
                                      }
                                      disabled={
                                        router.query.serviceCompletionDate
                                          ? true
                                          : false
                                      }
                                      value={
                                        router.query.serviceCompletionDate
                                          ? router.query.serviceCompletionDate
                                          : field.value
                                      }
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date, 'YYYY-MM-DD').format(
                                            'YYYY-MM-DD'
                                          )
                                        )
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size='small'
                                          fullWidth
                                          variant='standard'
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.serviceCompletionDate
                                  ? errors.serviceCompletionDate.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Paper>
                          <div className={styles.rightSide}>
                            <div className={styles.img}>
                              <Image
                                src={'/map.png'}
                                alt='Map.png'
                                height={300}
                                width={345}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className={styles.box}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <Button
                              color='primary'
                              variant='contained'
                              sx={{ marginRight: '2vw' }}
                              onClick={onBack}
                            >
                              <FormattedLabel id='exit' />
                            </Button>
                            <Button
                              color='primary'
                              variant='contained'
                              onClick={handleBack}
                              sx={{ mr: 1 }}
                            >
                              <FormattedLabel id='back' />
                            </Button>
                          </div>

                          {activeStep !== steps.length && (
                            <Button
                              color='primary'
                              variant='contained'
                              type='submit'
                            >
                              <FormattedLabel id='saveAndNext' />
                            </Button>
                          )}
                        </div>
                      </form>
                    </FormProvider>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    {/* Documents Details  */}
                    <div className={styles.fields}>
                      Documents will be uploaded here
                    </div>
                    <div
                      className={styles.box}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <Button
                          color='primary'
                          variant='contained'
                          sx={{ marginRight: '2vw' }}
                          onClick={onBack}
                        >
                          <FormattedLabel id='exit' />
                        </Button>
                        <Button
                          color='primary'
                          variant='contained'
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          <FormattedLabel id='back' />
                        </Button>
                      </div>
                      {activeStep !== steps.length && (
                        <Button
                          color='primary'
                          variant='contained'
                          onClick={finalSubmit}
                        >
                          <FormattedLabel id='finish' />
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Box>
      </Paper>
    </>
  )
}

export default FinalView
