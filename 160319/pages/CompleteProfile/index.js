import React from 'react'
import { useState } from 'react'
import styles from '../../styles/[register].module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  login,
  setMenu,
  setUsersDepartmentDashboardData,
  setUsersCitizenDashboardData,
} from '../../features/userSlice'
import {
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Checkbox,
  FormHelperText,
  FormControlLabel,
} from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { toast } from 'react-toastify'
import axios from 'axios'

import schema from '../../containers/schema/RegisterSchema'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { InsuranceTwoTone } from '@ant-design/icons'
import AppBarComponent from '../../containers/Layout/components/AppBarComponent'
import { useEffect } from 'react'
import urls from '../../URLS/urls'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import moment from 'moment'

const CompleteProfile = () => {
  const router = useRouter()

  const [hintQuestion, setHintQuestion] = useState('')
  const [questions, setQuestions] = useState([])
  const [emailChecked, setEmailChecked] = useState(true)
  const [resendOTP, setResendOTP] = useState(false)
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(null)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [zoneNames, setZoneNames] = useState([])
  const [wardNames, setWardNames] = useState([])
  const [titleNames, setTitleNames] = useState([])
  const [genderNames, setGenderNames] = useState([])
  const language = useSelector((state) => state?.labels.language)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(noticeSchema),
  })

  const user = useSelector((state) => {
    return state.user.user;
  });

  const dispatch = useDispatch()

  const [checked, setChecked] = useState(false)

  const handleChange = (event) => {
    setChecked(event.target.checked)
  }

  const [audienceSample, setAudienceSample] = useState(user)

  useEffect(() => {
    setAudienceSample(user)
    let _res = audienceSample

    // reset({..._res})

    setValue('title', _res.title)
    setValue('titleMr', _res.title)
    setValue('firstName', _res.firstName)
    setValue('firstNameMr', _res.firstNamemr)
    setValue('middleName', _res.middleName)
    setValue('middleNameMr', _res.middleNamemr)
    setValue('lastName', _res.surname)
    setValue('lastNameMr', _res.surnamemr)
    setValue('mobileNumber', _res.mobile)
    setValue('email', _res.emailID)
    setValue('gender', _res.gender)
    setValue('loginId', _res.username)
    setValue('hintQuestion', _res.hintQuestion)
    setValue('hintQuestionAnswer', _res.answer)
    setValue('cBuildingNo', _res.cflatBuildingNo)
    setValue('cBuildingNoMr', _res.cflatBuildingNoMr)
    setValue('cBuildingName', _res.cbuildingName)
    setValue('cBuildingNameMr', _res.cbuildingNameMr)
    setValue('cRoadName', _res.croadName)
    setValue('cRoadNameMr', _res.croadNameMr)
    setValue('cLandmark', _res.clandmark)
    setValue('cLandmarkMr', _res.clandmarkMr)
    setValue('cCity', _res.ccity)
    setValue('cCityMr', _res.ccityMr)
    setValue('cState', _res.cstate)
    setValue('cStateMr', _res.cstateMr)
    setValue('cPinCode', _res.cpinCode)

    //permanant
    setValue('pBuildingNo', _res.pflatBuildingNo)
    setValue('pBuildingNoMr', _res.pflatBuildingNoMr)
    setValue('pBuildingName', _res.pbuildingName)
    setValue('pBuildingNameMr', _res.pbuildingNameMr)
    setValue('pRoadName', _res.proadName)
    setValue('pRoadNameMr', _res.proadNameMr)
    setValue('pLandmark', _res.plandmark)
    setValue('pLandmarkMr', _res.plandmarkMr)
    setValue('pCity', _res.pcity)
    setValue('pCityMr', _res.pcityMr)
    setValue('pState', _res.pstate)
    setValue('pStateMr', _res.pstateMr)
    setValue('pPinCode', _res.ppincode)
    setValue('permanentAddress', _res.permanentAddress)
  }, [user])

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword)

  const handleEmailCheckedChange = (event) => {
    setEmailChecked(event.target.checked)
  }
  // const {
  //   control,
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });

  useEffect(() => {
    getWardNames()
    getZoneName()
    getTitle()
    getGender()
    getQuestions()
  }, [])

  const getQuestions = () => {
    axios.get(`${urls.CfcURLMaster}/question/getAll`).then((r) => {
      console.log('rr', r)
      setQuestions(
        r.data.questionMaster.map((row) => ({
          id: row.id,
          question: row.question,
          questionMar: row.questionMar,
        }))
      )
    })
  }

  const handleSelectChange = (event) => {
    console.log('event')
    setHintQuestion(event.target.value)
  }
  const onGenerateOTPClick = () => {
    console.log('genrate otp')
    setResendOTP(true)
    toast('OTP sent', {
      type: 'success',
    })
  }

  const verifyOTP = () => {
    setPhoneNumberVerified(true)
  }

  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        }))
      )
    })
  }

  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }))
      )
    })
  }

  const getTitle = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      console.log('res title', r)
      setTitleNames(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        }))
      )
    })
  }
  const getGender = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      console.log('res title', r)
      setGenderNames(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        }))
      )
    })
  }

  const onFinish = (values) => {
    console.log('values', values)

    const body = {
      firstName: values.firstName,
      middleName: values.middleName,
      surname: values.lastName,
      emailID: values.email,
      mobile: values.mobileNumber,
      username: values.loginId,
      password: values.password,
      hintQuestion: values.hintQuestion,
      answer: values.hintQuestionAnswer,
      zone: values.zoneName,
      ward: values.wardName,
      title: values.title,
      gender: values.gender,
      cflatBuildingNo: values.cBuildingNo,
      cbuildingName: values.cBuildingName,
      croadName: values.cRoadName,
      clandmark: values.cLandmark,
      cstate: values.cState,
      ccity: values.cCity,
      cpinCode: values.cPinCode,
      firstNamemr: values.firstNameMr,
      middleNamemr: values.middleNameMr,
      surnamemr: values.lastNameMr,
      ccityMr: values.cCityMr,
      cstateMr: values.cStateMr,
      clandmarkMr: values.cLandmarkMr,
      croadNameMr: values.cRoadNameMr,
      cbuildingNameMr: values.cBuildingNameMr,
      cflatBuildingNoMr: values.cBuildingNoMr,
      //permanant Add
      pflatBuildingNo: values.pBuildingNo,
      pbuildingName: values.pBuildingName,
      proadName: values.pRoadName,
      plandmark: values.pLandmark,
      pstate: values.pState,
      pcity: values.pCity,
      ppincode: values.pPinCode,
      pcityMr: values.pCityMr,
      pstateMr: values.pStateMr,
      plandmarkMr: values.pLandmarkMr,
      proadNameMr: values.pRoadNameMr,
      pbuildingNameMr: values.pBuildingNameMr,
      pflatBuildingNoMr: values.pBuildingNoMr,
      //other
      id: audienceSample.id,
      dateOfBirth: values.dateOfBirth,
      permanentAddress: values.permanentAddress,
    }

    console.log('body', body)

    const headers = { Accept: 'application/json' }

    axios
      .post(`${urls.CFCURL}/transaction/citizen/completeProfile`, body, {
        headers,
      })
      .then((_res) => {
        if (_res.status == 200) {
          dispatch(login(_res.data))
          dispatch(setUsersCitizenDashboardData(_res.data))
          dispatch(setMenu(_res.data.menuCodes))
          localStorage.setItem('loggedInUser', 'citizenUser')
          router.push('/dashboard')

          toast('Registered Successfully', {
            type: 'success',
          })
        }
      })
      .catch((err) => {
        console.log('err', err)
        toast('Registeration Failed ! Please Try Again !', {
          type: 'error',
        })
      })
  }

  return (
    <form onSubmit={handleSubmit(onFinish)}>
      <Box
        sx={{
          backgroundColor: "#556CD6",
          width: "100%",
          display: "flex",
          alignItems: "center"

        }}
      >
        <IconButton
          sx={{ color: "white" }}
          aria-label="upload picture"
          component="label"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h5" sx={{ color: "white" }}>
            {language == "en" ? "Complete Profile" : "प्रोफाइल पूर्ण करा"}
          </Typography>
        </Box>
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <Accordion sx={{ padding: '10px' }}>
            <AccordionSummary
              sx={{
                backgroundColor: '#0070f3',
                color: 'white',
                textTransform: 'uppercase',
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              backgroundColor='#0070f3'
              // sx={{
              //   backgroundColor: '0070f3',
              // }}
            >
              <Typography>Personal Information</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <Grid
                  xs={1}
                  item
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography>Title</Typography>
                  <FormControl
                    variant='standard'
                    fullWidth
                    error={!!errors.zoneName}
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                  >
                    {/* <InputLabel id="demo-simple-select-standard-label">
                                  Title
                                </InputLabel> */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-standard-label'
                          id='demo-simple-select-standard'
                          value={field.value}
                          size='small'
                          onChange={(value) => field.onChange(value)}
                          label='title'
                        >
                          {titleNames?.map((title, index) => {
                            return (
                              <MenuItem key={index} value={title.id}>
                                {title.title}
                              </MenuItem>
                            )
                          })}
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
                </Grid>

                <Grid
                  xs={2.4}
                  item
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography>First name</Typography>
                  <TextField
                    variant='outlined'
                    disabled
                    fullWidth
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('firstName')}
                    error={errors.firstName}
                    // helperText = {`errors.${field.stateName}.message`}
                    helperText={errors.firstName?.message}
                  />
                </Grid>

                <Grid
                  xs={2.3}
                  item
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography>Middle name</Typography>
                  <TextField
                    variant='outlined'
                    disabled
                    fullWidth
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    error={errors.middleName}
                    {...register('middleName')}
                    // helperText = {`errors.${field.stateName}.message`}
                    helperText={errors.middleName?.message}
                  />
                </Grid>

                <Grid
                  xs={2.3}
                  item
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography>Last name</Typography>
                  <TextField
                    variant='outlined'
                    disabled
                    fullWidth
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('lastName')}
                    error={errors.lastName}
                    // helperText = {`errors.${field.stateName}.message`}
                    helperText={errors.lastName?.message}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <Grid
                  item
                  xs={1}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography>Title Marathi</Typography>
                  <FormControl
                    variant='standard'
                    fullWidth
                    error={!!errors.titleMr}
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                  >
                    {/* <InputLabel id="demo-simple-select-standard-label">
                                  Title(Marathi)
                                </InputLabel> */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-standard-label'
                          id='demo-simple-select-standard'
                          value={field.value}
                          size='small'
                          onChange={(value) => field.onChange(value)}
                          label='title'
                        >
                          {titleNames?.map((title, index) => {
                            return (
                              <MenuItem key={index} value={title.id}>
                                {title.titleMr}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      )}
                      name='titleMr'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {errors?.titleMr ? errors.titleMr.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  xs={2.3}
                  item
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography>First name(Marathi)</Typography>
                  <TextField
                    variant='outlined'
                    // required={field.required}
                    // label={name}
                    fullWidth
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('firstNameMr')}
                    error={errors.firstNameMr}
                    // helperText = {`errors.${field.stateName}.message`}
                    helperText={errors.firstNameMr?.message}
                  />
                </Grid>
                <Grid
                  xs={2.4}
                  item
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography>Middle name(Marathi)</Typography>
                  <TextField
                    variant='outlined'
                    // required={field.required}
                    // label={name}
                    fullWidth
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    error={errors.middleNameMr}
                    {...register('middleNameMr')}
                    // helperText = {`errors.${field.stateName}.message`}
                    helperText={errors.middleNameMr?.message}
                  />
                </Grid>
                <Grid
                  xs={2.3}
                  item
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography>Last name(Marathi)</Typography>
                  <TextField
                    variant='outlined'
                    // required={field.required}
                    // label={name}
                    fullWidth
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('lastNameMr')}
                    error={errors.lastNameMr}
                    // helperText = {`errors.${field.stateName}.message`}
                    helperText={errors.lastNameMr?.message}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={3}>
                  <Typography>Mobile Number</Typography>
                  <TextField
                    variant='outlined'
                    disabled
                    fullWidth
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('mobileNumber')}
                    error={errors.mobileNumber}
                    helperText={errors.mobileNumber?.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>Email Address</Typography>
                  <TextField
                    variant='outlined'
                    disabled
                    fullWidth
                    size='small'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                      '&.MuiFormHelperText-root.Mui-error': {
                        color: 'red',
                      },
                    }}
                    //   onChange={(e) => setUser(e.target.value)}
                    {...register('email')}
                    error={errors.email}
                    helperText={errors.email?.message}
                  />
                  {/* <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={emailChecked}
                      onChange={handleEmailCheckedChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <Typography>Use my email id as login id</Typography>
                  </Box> */}
                </Grid>
                <Grid item xs={3}>
                  <Typography>Gender</Typography>
                  <FormControl
                    variant='outlined'
                    size='small'
                    fullWidth
                    error={!!errors.gender}
                  >
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '5px',
                          }}
                          disabled
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label='Gender'
                        >
                          {genderNames?.map((val, index) => {
                            return (
                              <MenuItem key={index} value={val.id}>
                                {val.gender}
                              </MenuItem>
                            )
                          })}
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
                </Grid>
                {/* {!phoneNumberVerified ? (
                  <>
                    <Grid
                      item
                      xs={3}
                      style={{ display: "flex", alignItems: "end" }}
                    >
                      {!resendOTP ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={onGenerateOTPClick}
                          sx={{
                            backgroundColor: "#CAD9E5",
                            color: "black",
                          }}
                          className={styles.button}
                        >
                          GENERATE OTP
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            backgroundColor: "#CAD9E5",
                            color: "black",
                          }}
                          className={styles.button}
                        >
                          RESEND OTP
                        </Button>
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>Verify OTP</Typography>
                      <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "5px",
                        }}
                        error={phoneNumberVerified === false}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              onClick={() => {
                                verifyOTP();
                              }}
                            >
                              <IconButton
                                aria-label="toggle password visibility"
                                edge="end"
                              >
                                <ArrowForwardIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid
                    item
                    xs={7}
                    style={{
                      display: "flex",
                      alignItems: "end",
                    }}
                  >
                    <Box
                      p={1}
                      sx={{
                        color: "green",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                        width: "100%",
                      }}
                    >
                      Phone number verified successfully
                    </Box>
                  </Grid>
                )} */}
              </Grid>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={3}>
                  <Typography>Date of birth</Typography>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name='dateOfBirth'
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            inputFormat='yyyy/MM/dd'
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(
                                moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size='small'
                                fullWidth
                                variant='outlined'
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ padding: '10px' }}>
            <AccordionSummary
              sx={{
                backgroundColor: '#0070f3',
                color: 'white',
                textTransform: 'uppercase',
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              aria-controls='panel1a-content'
              backgroundColor='#0070f3'
              id='panel1a-header'
            >
              <Typography>Current Address</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <Grid item xs={3}>
                  <Typography>Building Number</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cBuildingNo')}
                    helperText={errors.cBuildingNo?.message}
                    error={errors.cBuildingNo}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>Building Name</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cBuildingName')}
                    helperText={errors.cBuildingName?.message}
                    error={errors.cBuildingName}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>Road Name</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cRoadName')}
                    helperText={errors.cRoadName?.message}
                    error={errors.cRoadName}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
              </Grid>

              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <Grid item xs={3}>
                  <Typography>Building Number(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cBuildingNoMr')}
                    helperText={errors.cBuildingNoMr?.message}
                    error={errors.cBuildingNoMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>Building Name(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cBuildingNameMr')}
                    helperText={errors.cBuildingNameMr?.message}
                    error={errors.cBuildingNameMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>Road Name(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cRoadNameMr')}
                    helperText={errors.cRoadNameMr?.message}
                    error={errors.cRoadNameMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={5}>
                  <Typography>Landmark</Typography>
                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cLandmark')}
                    helperText={errors.cLandmark?.message}
                    error={errors.cLandmark}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>

                <Grid item xs={5}>
                  <Typography>Landmark Marathi</Typography>
                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cLandmarkMr')}
                    helperText={errors.cLandmarkMr?.message}
                    error={errors.cLandmarkMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={3}>
                  <Typography>City</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cCity')}
                    helperText={errors.cCity?.message}
                    error={errors.cCity}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>State</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cState')}
                    helperText={errors.cState?.message}
                    error={errors.cState}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>PinCode</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    type='number'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cPinCode')}
                    helperText={errors.cPinCode?.message}
                    error={errors.cPinCode}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={4}>
                  <Typography>City(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cCityMr')}
                    helperText={errors.cCityMr?.message}
                    error={errors.cCityMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography>State(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('cStateMr')}
                    helperText={errors.cStateMr?.message}
                    error={errors.cStateMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                {/* <Grid item xs={3}>
                              <Typography>Landmark(Marathi)</Typography>
                              <TextField
                                InputLabelProps={{
                                  style: { color: '#000000', fontSize: '15px' },
                                }}
                                sx={{
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '5px',
                                }}
                                {...register('landmarkMr')}
                                helperText={errors.landmarkMr?.message}
                                error={errors.landmarkMr}
                                inputProps={{ style: { fontSize: '15px' } }}
                                variant="outlined"
                                fullWidth
                                size="small"
                              />
                            </Grid> */}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ padding: '10px' }}>
            <AccordionSummary
              sx={{
                backgroundColor: '#0070f3',
                color: 'white',
                textTransform: 'uppercase',
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              aria-controls='panel1a-content'
              backgroundColor='#0070f3'
              id='panel1a-header'
            >
              <Typography>Permanent Address</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* <Grid container>
                <Grid
                  item
                  xs={1}
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Grid>
                <Grid
                  item
                  xs={10}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography>Same as current address</Typography>
                </Grid>
              </Grid> */}
              <Grid container>
                <Grid item xs={1}></Grid>
                <Grid item xs={11}>
                  <FormControlLabel
                    control={
                      <Controller
                        name='permanentAddress'
                        control={control}
                        render={({ field: props }) => (
                          <Checkbox
                            {...props}
                            checked={props.value}
                            onChange={(e) => {
                              if (e.target.checked) {
                                //pBuildingNo: cBuildingNo
                                //pBuildingName:cBuildingName
                                //////////////////

                                setValue(
                                  'pBuildingNo',
                                  watch('cBuildingNo')
                                    ? watch('cBuildingNo')
                                    : '-'
                                )
                                setValue(
                                  'pBuildingNoMr',
                                  watch('cBuildingNoMr')
                                    ? watch('cBuildingNoMr')
                                    : '-'
                                )
                                setValue(
                                  'pBuildingName',
                                  watch('cBuildingName')
                                    ? watch('cBuildingName')
                                    : '-'
                                )
                                setValue(
                                  'pBuildingNameMr',
                                  watch('cBuildingNameMr')
                                    ? watch('cBuildingNameMr')
                                    : '-'
                                )
                                setValue(
                                  'pRoadName',
                                  watch('cRoadName') ? watch('cRoadName') : '-'
                                )
                                setValue(
                                  'pLandmark',
                                  watch('cLandmark') ? watch('cLandmark') : '-'
                                )
                                setValue(
                                  'pState',
                                  watch('cState') ? watch('cState') : '-'
                                )
                                setValue(
                                  'pCity',
                                  watch('cCity') ? watch('cCity') : '-'
                                )
                                setValue(
                                  'pPinCode',
                                  watch('cPinCode') ? watch('cPinCode') : '-'
                                )
                                setValue(
                                  'pCityMr',
                                  watch('cCityMr') ? watch('cCityMr') : '-'
                                )
                                setValue(
                                  'pStateMr',
                                  watch('cStateMr') ? watch('cStateMr') : '-'
                                )
                                setValue(
                                  'pLandmarkMr',
                                  watch('cLandmarkMr')
                                    ? watch('cLandmarkMr')
                                    : '-'
                                )
                                setValue(
                                  'pRoadNameMr',
                                  watch('cRoadNameMr')
                                    ? watch('cRoadNameMr')
                                    : '-'
                                )
                              }
                              props.onChange(e.target.checked)
                            }}
                          />
                        )}
                      />
                    }
                    label='is Permanant address same as current address?'
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <Grid item xs={3}>
                  <Typography>Building Number</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pBuildingNo')}
                    helperText={errors.pBuildingNo?.message}
                    error={errors.pBuildingNo}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>Building Name</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pBuildingName')}
                    helperText={errors.pBuildingName?.message}
                    error={errors.pBuildingName}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>Road Name</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pRoadName')}
                    helperText={errors.pRoadName?.message}
                    error={errors.pRoadName}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
              </Grid>

              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <Grid item xs={3}>
                  <Typography>Building Number(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pBuildingNoMr')}
                    helperText={errors.pBuildingNoMr?.message}
                    error={errors.pBuildingNoMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>Building Name(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pBuildingNameMr')}
                    helperText={errors.pBuildingNameMr?.message}
                    error={errors.pBuildingNameMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>Road Name(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pRoadNameMr')}
                    helperText={errors.pRoadNameMr?.message}
                    error={errors.pRoadNameMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={5}>
                  <Typography>Landmark</Typography>
                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pLandmark')}
                    helperText={errors.pLandmark?.message}
                    error={errors.pLandmark}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>

                <Grid item xs={5}>
                  <Typography>Landmark Marathi</Typography>
                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pLandmarkMr')}
                    helperText={errors.pLandmarkMr?.message}
                    error={errors.pLandmarkMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={3}>
                  <Typography>City</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pCity')}
                    helperText={errors.pCity?.message}
                    error={errors.pCity}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>State</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pState')}
                    helperText={errors.pState?.message}
                    error={errors.pState}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography>PinCode</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    type='number'
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pPinCode')}
                    helperText={errors.pPinCode?.message}
                    error={errors.pPinCode}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={4}>
                  <Typography>City(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pCityMr')}
                    helperText={errors.pCityMr?.message}
                    error={errors.pCityMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography>State(Marathi)</Typography>

                  <TextField
                    InputLabelProps={{
                      style: { color: '#000000', fontSize: '15px' },
                    }}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('pStateMr')}
                    helperText={errors.pStateMr?.message}
                    error={errors.pStateMr}
                    inputProps={{ style: { fontSize: '15px' } }}
                    variant='outlined'
                    fullWidth
                    size='small'
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ padding: '10px' }}>
            <AccordionSummary
              sx={{
                backgroundColor: '#0070f3',
                color: 'white',
                textTransform: 'uppercase',
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              backgroundColor='#0070f3'
            >
              <Typography>Credentials</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={3}>
                  <Typography>Login ID</Typography>
                  <TextField
                    variant='outlined'
                    //   label=" "
                    fullWidth
                    size='small'
                    disabled
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('loginId')}
                    helperText={errors.loginId?.message}
                    error={errors.loginId}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
                py={1}
              >
                <Grid item xs={11}>
                  <Typography>Hint Question</Typography>
                  <FormControl
                    variant='outlined'
                    size='small'
                    fullWidth
                    error={!!errors.hintQuestion}
                  >
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '5px',
                          }}
                          disabled
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label='Hint Question'
                        >
                          {questions?.map((val, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={val.id}
                                style={{
                                  display: val?.question ? 'flex' : 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                {val?.question}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      )}
                      name='hintQuestion'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {errors?.hintQuestion
                        ? errors.hintQuestion.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid
                container
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
                py={1}
              >
                <Grid item xs={11}>
                  <Typography>Answer</Typography>
                  <TextField
                    variant='outlined'
                    //   label="Answer"
                    fullWidth
                    size='small'
                    disabled
                    sx={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '5px',
                    }}
                    {...register('hintQuestionAnswer')}
                    helperText={errors.hintQuestionAnswer?.message}
                    error={errors.hintQuestionAnswer}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '15px',
            }}
          >
            <Button
              size='small'
              variant='outlined'
              sx={{
                // width: "50%",
                backgroundColor: '#CAD9E5',
                color: 'black',
                ':hover': {
                  bgcolor: 'blue',
                  color: '#fff',
                },
              }}
              type='submit'
            >
              Update
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default CompleteProfile
