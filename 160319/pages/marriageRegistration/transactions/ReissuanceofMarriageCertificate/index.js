import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import theme from '../../../../theme'
import styles from './reissuance.module.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import swal from 'sweetalert'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import urls from '../../../../URLS/urls'

const Index = () => {
  const router = useRouter()
  const [tableData, setTableData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [okText, setOkText] = useState()
  const [mDate, setMDate] = useState()
  const [activeTabKey2, setActiveTabKey2] = useState('groomDetails')
  const [searchDetails, setSearchDetails] = useState()
  const disptach = useDispatch()
  const refGroom = useRef()
  const refBride = useRef()
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm()

  const [flagSearch, setFlagSearch] = useState(false)

  useEffect(() => {}, [flagSearch])
  const [temp, setTemp] = useState()

  //zoneKeys
  const [zoneKeys, setZoneKeys] = useState([])

  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      )
    })
  }

  // wardKeys
  const [wardKeys, setWardKeys] = useState([])

  // getWardKeys
  const getWardKeys = () => {
    axios
      .get(
        `${
          urls.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${temp}`,
      )
      .then((r) => {
        setWardKeys(
          r.data.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          })),
        )
      })
  }

  const language = useSelector((state) => state?.labels.language)

  useEffect(() => {
    console.log('Bride Name 1', watch('brideName'))
  }, [
    watch('brideName'),
    watch('groomName'),
    watch('marriageDate'),
    watch('registrationDate'),
  ])

  // useEffect
  useEffect(() => {
    getZoneKeys()
    getWardKeys()
    //  getGenders()
    // getatitles()
  }, [temp])

  const searchData = async () => {
    console.log(
      'search',
      getValues('zoneKey'),
      getValues('wardKey'),
      getValues('registrationDate'),
      getValues('mRegNo'),
      getValues('marriageDate'),
      getValues('marriageYear'),
      getValues('groomFName'),
      getValues('groomMName'),
      getValues('groomLName'),
      getValues('brideFName'),
      getValues('brideMName'),
      getValues('brideLName'),
    )

    const finalBody = {
      zoneKey: getValues('zoneKey'),
      wardKey: getValues('wardKey'),
      registrationDate: getValues('registrationDate'),
      registrationNumber: getValues('mRegNo'),
      marriageDate: getValues('marriageDate'),
      marriageYear: Number(getValues('marriageYear')),
      gfName: getValues('groomFName'),
      gmName: getValues('groomMName'),
      glName: getValues('groomLName'),
      bfName: getValues('brideFName'),
      bmName: getValues('brideMName'),
      blName: getValues('brideLName'),
    }

    console.log('Search Body', finalBody)
    axios
      .post(`${urls.MR}/transaction/reIssuanceM/getreissueDetails`, finalBody)
      .then((res) => {
        console.log('reissue', res.data[0])
        if (res.status == 200) {
          // swal("Submited!", "Record Searched successfully !", "success");
          swal('Searched!', 'Record Found!', 'success')
          if (res.data.length > 0) {
            setFlagSearch(true)
            reset(res.data[0])
            setSearchDetails(res.data[0])
          } else {
            swal(
              'Error!',
              'Something problem with the searched Data !',
              'error',
            )
          }
        }
      })
      .catch((err) => {
        console.log(err.response)
        swal('Submited!', 'Something problem with the search !', 'error')
      })
  }

  const handleChange = (event) => {
    console.log('handleChange', event)
  }

  const validateSearch = () => {
    console.log(
      '22',
      'Bride Name validate',
      watch('marriageDate'),
      watch('registrationDate'),
    )

    if (
      watch('brideName') === undefined ||
      watch('brideName') === '' ||
      watch('groomName') === undefined ||
      watch('groomName') === '' ||
      watch('marriageDate') === undefined ||
      watch('marriageDate') === null ||
      watch('registrationDate') === undefined ||
      watch('registrationDate') === null
    ) {
      return true
    } else {
      return false
    }
  }

  const imageCallback = (imgsrc) => {
    console.log('imgsrc', imgsrc)
    // setValue('gPhoto', imgsrc)
  }
  const handleApply = () => {
    const finalBody = {
      ...searchDetails,
      id: null,
      serviceId: 11,
      trnApplicantId: searchDetails.id,
    }
    axios
      .post(
        `${urls.MR}/transaction/reIssuanceM/saveReIssuanceOfMarriageRegistration`,
        finalBody,
      )
      .then((res) => {
        if (res.status == 201) {
          swal('Applied!', 'Application Applied Successfully !', 'success')
          console.log('apply123', finalBody)
          let iddd = res?.data?.message?.split('$')[1]

          router.push({
            pathname:
              '/marriageRegistration/transactions/ReissuanceofMarriageCertificate/PaymentCollection',

            // '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/PaymentCollection',
            query: {
              ...searchDetails,
              id: iddd,
              serviceId: 11,
            },
          })
        }
      })
      .catch((err) => {
        console.log(err.response)
        swal('Submited!', 'Something problem with the search !', 'error')
      })
  }
  return (
    <div style={{ backgroundColor: '#F5F5F5' }}>
      <div>
        <ThemeProvider theme={theme}>
          <Paper
            sx={{
              marginLeft: 10,
              marginRight: 2,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
            }}
          >
            <div className={styles.details}>
              <div className={styles.h1Tag}>
                <h3
                  style={{
                    color: 'white',
                    marginTop: '7px',
                  }}
                >
                  <FormattedLabel id="onlyRIMC" />
                </h3>
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <FormControl variant="standard" sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="zone" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                          console.log('Zone Key: ', value.target.value)
                          setTemp(value.target.value)
                        }}
                        label="Zone Name *"
                      >
                        {zoneKeys &&
                          zoneKeys.map((zoneKey, index) => (
                            <MenuItem key={index} value={zoneKey.id}>
                              {language == 'en'
                                ? zoneKey?.zoneName
                                : zoneKey?.zoneNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="zoneKey"
                    control={control}
                    defaultValue=""
                  />
                </FormControl>
              </div>
              <div>
                <FormControl variant="standard" sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="ward" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Ward Name *"
                      >
                        {wardKeys &&
                          wardKeys.map((wardKey, index) => (
                            <MenuItem key={index} value={wardKey.id}>
                              {language == 'en'
                                ? wardKey?.wardName
                                : wardKey?.wardNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="wardKey"
                    control={control}
                    defaultValue=""
                  />
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="registrationDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 14 }}>
                              {<FormattedLabel id="regDate" />}
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
                </FormControl>
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <TextField
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="mRegNo" />}
                  variant="standard"
                  {...register('mRegNo')}
                  // error={!!errors.aFName}
                  // helperText={errors?.aFName ? errors.aFName.message : null}
                />
              </div>
              <div>
                <FormControl sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="marriageDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 14 }}>
                              {<FormattedLabel id="marriageDate" required />}
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
                </FormControl>
              </div>

              <div>
                <TextField
                  // disabled
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="marriageYear" />}
                  //label={"Marriage Year"}
                  variant="standard"
                  {...register('marriageYear')}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <TextField
                  //  disabled
                  sx={{ width: 230 }}
                  id="standard-basic"
                  // defaultValue={"abc"}
                  label={<FormattedLabel id="groomFName" required />}
                  variant="standard"
                  {...register('groomFName')}
                />
              </div>
              <div>
                <TextField
                  //  disabled
                  sx={{ width: 230 }}
                  id="standard-basic"
                  // defaultValue={"abc"}
                  label={<FormattedLabel id="groomMName" />}
                  variant="standard"
                  {...register('groomMName')}
                />
              </div>
              <div>
                <TextField
                  //  disabled
                  sx={{ width: 230 }}
                  id="standard-basic"
                  // defaultValue={"abc"}
                  label={<FormattedLabel id="groomLName" required />}
                  variant="standard"
                  {...register('groomLName')}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <TextField
                  //  disabled
                  sx={{ width: 230 }}
                  id="standard-basic"
                  // defaultValue={"abc"}
                  label={<FormattedLabel id="brideFName" required />}
                  variant="standard"
                  {...register('brideFName')}
                />
              </div>
              <div>
                <TextField
                  //  disabled
                  sx={{ width: 230 }}
                  id="standard-basic"
                  // defaultValue={"abc"}
                  label={<FormattedLabel id="brideMName" />}
                  variant="standard"
                  {...register('brideMName')}
                />
              </div>
              <div>
                <TextField
                  //  disabled
                  sx={{ width: 230 }}
                  id="standard-basic"
                  // defaultValue={"abc"}
                  label={<FormattedLabel id="brideLName" required />}
                  variant="standard"
                  {...register('brideLName')}
                />
              </div>
            </div>

            {/* <Accordion
              sx={{
                marginLeft: '5vh',
                marginRight: '5vh',
                marginTop: '2vh',
                marginBottom: '2vh',
              }}
            >
              <AccordionSummary
                sx={{
                  backgroundColor: '#0070f3',
                  color: 'white',
                  textTransform: 'uppercase',
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                backgroundColor="#0070f3"
              >
                <Typography>1) Filter (Registration Number *)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.row}>
                  <div>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      label={<FormattedLabel id="mRegNo" required />}
                      variant="standard"
                      {...register('mRegNoS')}
                      // error={!!errors.aFName}
                      // helperText={errors?.aFName ? errors.aFName.message : null}
                    />
                  </div>
                  <div>
                    <FormControl sx={{ marginTop: 0 }}>
                      <Controller
                        control={control}
                        name="registrationDateS"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 14 }}>
                                  {<FormattedLabel id="regDate" />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format('YYYY-MM-DD'),
                                )
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
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      // disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      label={<FormattedLabel id="marriageYear" />}
                      //label={"Marriage Year"}
                      variant="standard"
                      {...register('marriageYearS')}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion> */}

            {/* <Accordion
              sx={{
                marginLeft: '5vh',
                marginRight: '5vh',
                marginTop: '2vh',
                marginBottom: '2vh',
              }}
            >
              <AccordionSummary
                sx={{
                  backgroundColor: '#0070f3',
                  color: 'white',
                  textTransform: 'uppercase',
                }}
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                backgroundColor="#0070f3"
              >
                <Typography>
                  2) Filter (Zone * ,marriage date *,groomFName ,groomLName
                  ,brideFName ,brideLName)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.row}>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 2 }}
                      
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="zone" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                          
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value)
                              console.log('Zone Key: ', value.target.value)
                              setTemp1(value.target.value)
                            }}
                            label="Zone Name *"
                          >
                            {zoneKeys &&
                              zoneKeys.map((zoneKey, index) => (
                                <MenuItem key={index} value={zoneKey.id}>
                                
                                  {language == 'en'
                                    ? zoneKey?.zoneName
                                    : zoneKey?.zoneNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="zoneKeyS"
                        control={control}
                        defaultValue=""
                      />
                     
                    </FormControl>
                  </div>
                  <div>
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 2 }}
                     
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="ward" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Ward Name *"
                          >
                            {wardKeys &&
                              wardKeys.map((wardKey, index) => (
                                <MenuItem key={index} value={wardKey.id}>
                             
                                  {language == 'en'
                                    ? wardKey?.wardName
                                    : wardKey?.wardNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="wardKeyS"
                        control={control}
                        defaultValue=""
                      />
                 
                    </FormControl>
                  </div>
                  <div>
                    <FormControl sx={{ marginTop: 0 }}>
                      <Controller
                        control={control}
                        name="marriageDateS"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 14 }}>
                                  {
                                    <FormattedLabel
                                      id="marriageDate"
                                      required
                                    />
                                  }
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format('YYYY-MM-DD'),
                                )
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
                    </FormControl>
                  </div>
                  
                </div>
                

                <div className={styles.row}>
                  <div>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // defaultValue={"abc"}
                      label={<FormattedLabel id="groomFName" required />}
                      variant="standard"
                      {...register('groomFNameS')}
                    />
                  </div>
                  <div>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // defaultValue={"abc"}
                      label={<FormattedLabel id="groomMName" />}
                      variant="standard"
                      {...register('groomMNameS')}
                    />
                  </div>
                  <div>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // defaultValue={"abc"}
                      label={<FormattedLabel id="groomLName" required />}
                      variant="standard"
                      {...register('groomLNameS')}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // defaultValue={"abc"}
                      label={<FormattedLabel id="brideFName" required />}
                      variant="standard"
                      {...register('brideFNameS')}
                    />
                  </div>
                  <div>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // defaultValue={"abc"}
                      label={<FormattedLabel id="brideMName" />}
                      variant="standard"
                      {...register('brideMNameS')}
                    />
                  </div>
                  <div>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // defaultValue={"abc"}
                      label={<FormattedLabel id="brideLName" required />}
                      variant="standard"
                      {...register('brideLNameS')}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion> */}

            <div className={styles.row}>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  // disabled={validateSearch()}
                  onClick={() => {
                    searchData()
                  }}
                >
                  {<FormattedLabel id="search" />}
                  {/* Search */}
                </Button>
              </div>
            </div>
          </Paper>
        </ThemeProvider>
      </div>

      {flagSearch ? (
        <div>
          <ThemeProvider theme={theme}>
            <Paper
              sx={{
                marginLeft: 10,
                marginRight: 2,
                marginTop: 5,
                marginBottom: 20,
                padding: 1,
                border: 1,
                borderColor: 'grey.500',
              }}
            >
              <div className={styles.details}>
                <div className={styles.h1Tag}>
                  <h3
                    style={{
                      color: 'white',
                      marginTop: '7px',
                    }}
                  >
                    <FormattedLabel id="onlyApplDetail" />
                    {/* Re-Issuance of Marriage Certificate */}
                  </h3>
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <FormControl sx={{ marginTop: 0 }}>
                    <Controller
                      control={control}
                      name="marriageDate"
                      defaultValue=""
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 14 }}>
                                {<FormattedLabel id="mDate" />}
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
                  </FormControl>
                </div>
                <div>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    //error={!!errors.zoneKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="zone" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          //sx={{ width: 230 }}
                          disabled
                          value={field.value}
                          defaultValue=""
                          onChange={(value) => {
                            field.onChange(value)
                            console.log('Zone Key: ', value.target.value)
                            setTemp(value.target.value)
                          }}
                          label="Zone Name *"
                        >
                          {zoneKeys &&
                            zoneKeys.map((zoneKey, index) => (
                              <MenuItem key={index} value={zoneKey.id}>
                                {/* {zoneKey.zoneKey} */}

                                {language == 'en'
                                  ? zoneKey?.zoneName
                                  : zoneKey?.zoneNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="zoneKey"
                      control={control}
                      defaultValue=""
                    />
                    {/* <FormHelperText>
                {errors?.zoneKey ? errors.zoneKey.message : null}
              </FormHelperText> */}
                  </FormControl>
                </div>
                <div>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    //error={!!errors.wardKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="ward" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled
                          value={field.value}
                          defaultValue=""
                          onChange={(value) => field.onChange(value)}
                          label="Ward Name *"
                        >
                          {wardKeys &&
                            wardKeys.map((wardKey, index) => (
                              <MenuItem key={index} value={wardKey.id}>
                                {/* {wardKey.wardKey} */}
                                {language == 'en'
                                  ? wardKey?.wardName
                                  : wardKey?.wardNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="wardKey"
                      control={control}
                      defaultValue=""
                    />
                    {/* <FormHelperText>
                  {errors?.wardKey ? errors.wardKey.message : null}
                </FormHelperText> */}
                  </FormControl>
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    defaultValue=""
                    label={<FormattedLabel id="applFName" />}
                    variant="standard"
                    {...register('afName')}
                  />
                </div>
                <div>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    // defaultValue={"abc"}
                    defaultValue=""
                    label={<FormattedLabel id="applMName" />}
                    variant="standard"
                    {...register('amName')}
                  />
                </div>
                <div>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    // defaultValue={"abc"}
                    defaultValue=""
                    label={<FormattedLabel id="applLName" />}
                    variant="standard"
                    {...register('alName')}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    defaultValue=""
                    label={<FormattedLabel id="groomFName" />}
                    variant="standard"
                    {...register('gfName')}
                  />
                </div>
                <div>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    // defaultValue={"abc"}
                    defaultValue=""
                    label={<FormattedLabel id="groomMName" />}
                    variant="standard"
                    {...register('gmName')}
                  />
                </div>
                <div>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    // defaultValue={"abc"}
                    defaultValue=""
                    label={<FormattedLabel id="groomLName" />}
                    variant="standard"
                    {...register('glName')}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    // defaultValue={"abc"}
                    defaultValue=""
                    label={<FormattedLabel id="brideFName" />}
                    variant="standard"
                    {...register('bfName')}
                  />
                </div>
                <div>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    // defaultValue={"abc"}
                    defaultValue=""
                    label={<FormattedLabel id="brideMName" />}
                    variant="standard"
                    {...register('bmName')}
                  />
                </div>
                <div>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    // defaultValue={"abc"}
                    defaultValue=""
                    label={<FormattedLabel id="brideLName" />}
                    variant="standard"
                    {...register('blName')}
                  />
                </div>
              </div>

              <div className={styles.btn}>
                <div className={styles.btn1}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                    onClick={handleApply}
                  >
                    {<FormattedLabel id="apply" />}
                  </Button>{' '}
                </div>

                <div className={styles.btn1}>
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    // onClick={() => exitButton()}
                    onClick={() => {
                      swal({
                        title: 'Exit?',
                        text: 'Are you sure you want to exit this Record ? ',
                        icon: 'warning',
                        buttons: true,
                        dangerMode: true,
                      }).then((willDelete) => {
                        if (willDelete) {
                          swal('Record is Successfully Exit!', {
                            icon: 'success',
                          })
                          router.push(
                            `/marriageRegistration/transactions/ReissuanceofMarriageCertificate`,
                          )
                        } else {
                          swal('Record is Safe')
                        }
                      })
                    }}
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </div>
              </div>
            </Paper>
          </ThemeProvider>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Index
