import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Head from 'next/head'
import { useRouter } from 'next/router'

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
import styles from './view.module.css'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import URLS from '../../../../URLS/urls'
import { useSelector } from 'react-redux'
import DocumentVerificationTable from '../../../../containers/reuseableComponents/DocumentVerificationTable'
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
    // {
    //   id: 1,
    //   reservationNameEn: '',
    //   reservationNameMr: '',
    // },
  ])

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentChecklistEn: '',
      documentChecklistMr: '',
    },
  ])
  const [files, setFiles] = useState([
    {
      id: 1,
      srNo: 1,
      isDocumentMandetory: true,
      docKey: 1,
      documentNameEn: '',
      documentNameMr: '',
      filePath: '',
      status: '',
      remark: '',
    },
  ])
  const [filesAale, setFilesAale] = useState(false)

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
    setValue,
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

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

  const steps = [
    <FormattedLabel key={1} id='personalDetails' />,
    <FormattedLabel key={2} id='areaDetails' />,
    <FormattedLabel key={3} id='documentVerification' />,
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

  // const handleReset = () => {
  //   setActiveStep(0)
  //   setCompleted({})
  // }

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

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
          genderMr: j.genderMr,
        }))
      )
    })

    //Title
    axios.get(`${URLS.CFCURL}/master/title/getAll`).then((res) => {
      setTitle(
        res.data.title.map((j) => ({
          id: j.id,
          titleEn: j.title,
          titleMr: j.titleMr,
        }))
      )
    })

    //Zone
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(
        res.data.zone.map((j) => ({
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
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
      console.log('Table data: ', r.data)
      setReservationName(
        r.data.map((j, i) => ({
          id: j.id,
          landReservationNo: j.landReservationNo,
        }))
      )
    })

    //DocumentsList
    axios.get(`${URLS.CFCURL}/master/documentMaster/getAll`).then((res) => {
      setDocuments(
        res.data.documentMaster.map((j, i) => ({
          id: j.id,
          documentNameEn: j.documentChecklistEn,
          documentNameMr: j.documentChecklistMr,
        }))
      )
    })
  }, [])

  useEffect(() => {
    //Document Checklist
    axios
      .post(
        `${
          URLS.CFCURL
        }/master/serviceWiseChecklist/getDocumentsByService?service=${17}`
      )
      .then((r) => {
        if (router.query.id) {
          axios
            .get(`${URLS.TPURL}/partplan/getpartplan/${router.query.id}`)
            .then((res) => {
              setFiles(
                r.data.map((r, i) => ({
                  id: res.data.files.find((file) => file.docKey === r.document)
                    .id,
                  srNo: i + 1,
                  isDocumentMandetory: r.isDocumentMandetory,
                  docKey: r.document,
                  documentNameEn: documents.find((arg) => arg.id === r.document)
                    ?.documentNameEn,
                  documentNameMr: documents.find((arg) => arg.id === r.document)
                    ?.documentNameMr,
                  filePath: res.data.files.find(
                    (file) => file.docKey === r.document
                  ).partPlanAttachmentPath,
                  status: res.data.files.find(
                    (file) => file.docKey === r.document
                  ).status,
                  remark: res.data.files.find(
                    (file) => file.docKey === r.document
                  ).remark,
                }))
              )
              setFilesAale(true)
            })
        } else {
          setFiles(
            r.data.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              isDocumentMandetory: j.isDocumentMandetory,
              docKey: j.document,
              documentNameEn: documents.find((arg) => arg.id === j.document)
                ?.documentNameEn,
              documentNameMr: documents.find((arg) => arg.id === j.document)
                ?.documentNameMr,
              filePath: '',
              status: 'upload',
              remark: '',
            }))
          )
          setFilesAale(true)
        }
      })
  }, [documents, router.query])

  useEffect(() => {
    setRunAgain(false)
    setActiveStep(0)
    setCompleted({})
  }, [runAgain])

  const personalSubmit = (personalData) => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()

    setPersonalDetails(personalData)
  }

  const areaSubmit = (areaData) => {
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
    // handleNext()

    let filesToSend = []

    filesToSend = files.map((j) => ({
      // @ts-ignore
      docKey: j.docKey,
      // @ts-ignore
      partPlanAttachmentPath: j.filePath,
      // status: j.status,
      status: j.status === 'upload' ? 'pending' : j.status,
    }))

    const bodyForAPI = {
      ...personalDetails,
      ...areaDetails,
      files: filesToSend,
      status: 'Application Created',
      applicationDate: newDate,
      serviceName: 'Part Map',
      applicationNo: router.query.length
        ? `TP/PM/04/${router.query.length}/2022`
        : `TP/PM/04/001/2022`,
    }

    console.log('Body For API: ', bodyForAPI)

    if (router.query.pageMode === 'edit') {
      await axios
        .post(`${URLS.TPURL}/partplan/updatepartplan`, bodyForAPI, {
          headers: {
            // Authorization: `Bearer ${token}`,
            role: 'CITIZEN',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            handleNext()

            sweetAlert('Updated!', 'Record Updated successfully !', 'success')
            router.push('/townPlanning/transactions/clerk')
          }
        })
    } else {
      await axios
        .post(`${URLS.TPURL}/partplan/savepartplan`, bodyForAPI, {
          headers: {
            // Authorization: `Bearer ${token}`,
            role: 'CITIZEN',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            sweetAlert('Saved!', 'Record Saved successfully !', 'success')
            router.push('/townPlanning/transactions/acknowledgmentReceipt')
          }
        })
    }
  }

  const verification = async () => {
    let tempNewFiles = files.map((j) => ({
      id: j.id,
      docKey: j.docKey,
      partPlanAttachmentPath: j.filePath,
      status: j.status === 'rejected' ? 'upload' : 'verified',
      remark: j.remark,
    }))

    let status = tempNewFiles.find((obj) => obj.status === 'upload')
      ? 'Clerk Rejected'
      : 'Clerk Approved'

    const statusUpdation = { id: router.query.id, files: tempNewFiles, status }

    await axios
      .post(`${URLS.TPURL}/partplan/savepartplan`, statusUpdation, {
        headers: {
          // Authorization: `Bearer ${token}`,
          role: 'CITIZEN',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          sweetAlert('Saved!', 'Record Saved successfully !', 'success')
          router.push('/townPlanning/transactions/clerk')
        }
      })
  }

  const onBack = () => {
    const urlLength = router.asPath.split('/').length
    const urlArray = router.asPath.split('/')
    let backUrl = ''
    if (urlLength > 2) {
      for (let i = 0; i < urlLength - 1; i++) {
        backUrl += urlArray[i] + '/'
      }
      router.push(`${backUrl}`)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <Head>
        <title>{'Part Map (Clerk)'}</title>
      </Head>
      <Paper className={styles.main}>
        <h2
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          <FormattedLabel id='partMap' />
        </h2>

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
                {/* Personal Details  */}
                {activeStep === 0 && (
                  <>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(personalSubmit)}>
                        {/* <div className={styles.fields}> */}
                        <Paper className={styles.fieldsStepper}>
                          {router.query.pageMode === 'new' && (
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
                          )}
                          <div className={styles.row}>
                            <FormControl
                              sx={{
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
                              // id='standard-basic'
                              id='karanName'
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
                              value={
                                router.query.firstNameEn &&
                                router.query.firstNameEn
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('firstNameEn') ? true : false) ||
                                  (router.query.firstNameEn ? true : false) ||
                                  (isCurrentUser ? true : false),
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
                              value={
                                router.query.middleNameEn &&
                                router.query.middleNameEn
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('middleNameEn') ? true : false) ||
                                  (router.query.middleNameEn ? true : false),
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
                              value={
                                router.query.surnameEn && router.query.surnameEn
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('surnameEn') ? true : false) ||
                                  (router.query.surnameEn ? true : false),
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
                              value={
                                router.query.firstNameMr &&
                                router.query.firstNameMr
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('firstNameMr') ? true : false) ||
                                  (router.query.firstNameMr ? true : false),
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
                              value={
                                router.query.middleNameMr &&
                                router.query.middleNameMr
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('middleNameMr') ? true : false) ||
                                  (router.query.middleNameMr ? true : false),
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
                              value={
                                router.query.surnameMr && router.query.surnameMr
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('surnameMr') ? true : false) ||
                                  (router.query.surnameMr ? true : false),
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
                            style={{
                              marginTop: '2%',
                              display: 'flex',
                              gap: 98,
                            }}
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
                          {activeStep !== steps.length &&
                            router.query.pageMode === 'new' && (
                              <Button
                                style={{ marginLeft: 800 }}
                                color='primary'
                                type='submit'
                                variant='contained'
                              >
                                <FormattedLabel id='saveAndNext' />
                              </Button>
                            )}
                          {activeStep !== steps.length &&
                            router.query.pageMode === 'view' && (
                              <Button
                                style={{ marginLeft: 800 }}
                                color='primary'
                                variant='contained'
                                onClick={handleNext}
                              >
                                <FormattedLabel id='next' />
                              </Button>
                            )}
                        </div>
                      </form>
                    </FormProvider>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    {/* Address Details  */}
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
                            {/* <div
                              style={{ width: '100%', marginBottom: '-4vh' }}
                            >
                              <Button color='primary' variant='contained'>
                                Locate
                              </Button>
                            </div> */}

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
                                          {/* {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.reservationNameEn
                                              : value?.reservationNameMr
                                          } */}
                                          {value?.landReservationNo}
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
                                      // selected={field.value}
                                      // center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size='small'
                                          fullWidth
                                          variant='standard'
                                          // InputLabelProps={{
                                          //   style: {
                                          //     fontSize: 15,
                                          //     marginTop: 4,
                                          //   },
                                          // }}
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
                                // src={map}
                                src={'/map.png'}
                                alt='Map.png'
                                height={300}
                                width={345}
                                // priority
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

                          {activeStep !== steps.length &&
                            router.query.pageMode === 'new' && (
                              <Button
                                color='primary'
                                variant='contained'
                                type='submit'
                              >
                                <FormattedLabel id='saveAndNext' />
                              </Button>
                            )}
                          {activeStep !== steps.length &&
                            router.query.pageMode === 'view' && (
                              <Button
                                style={{ marginLeft: 800 }}
                                color='primary'
                                variant='contained'
                                onClick={handleNext}
                              >
                                <FormattedLabel id='next' />
                              </Button>
                            )}
                        </div>
                      </form>
                    </FormProvider>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    {filesAale && (
                      <Paper>
                        {/* Documents Details  */}
                        <div
                          className={styles.fieldsStepper}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <DocumentVerificationTable
                            appName='TP'
                            serviceName='PARTMAP'
                            rows={files}
                            rowUpdation={setFiles}
                            save={verification}
                          />
                        </div>
                      </Paper>
                    )}

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
                      {activeStep !== steps.length &&
                        router.query.pageMode === 'new' && (
                          <Button
                            color='primary'
                            variant='contained'
                            onClick={finalSubmit}
                          >
                            <FormattedLabel id='finish' />
                          </Button>
                        )}
                      {/* {activeStep !== steps.length &&
                          router.query.pageMode === 'view' && (
                            <Button
                              style={{ marginLeft: 800 }}
                              color='primary'
                              variant='contained'
                              onClick={handleNext}
                            >
                              <FormattedLabel id='next' />
                            </Button>
                          )} */}
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
