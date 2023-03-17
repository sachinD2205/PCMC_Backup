import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  Typography,
  useScrollTrigger,
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { useSelector } from 'react-redux'
import theme from '../../../../../theme'
import styles from './modificationInMC.module.css'

import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import swal from 'sweetalert'
import urls from '../../../../../URLS/urls'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SaveIcon from '@mui/icons-material/Save'
import ClearIcon from '@mui/icons-material/Clear'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import UploadButton from '../../../../../components/marriageRegistration/DocumentsUploadMB'

const Index = (props) => {
  const router = useRouter()
  const disptach = useDispatch()

  const methods = useForm({})
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods

  const user = useSelector((state) => state?.user.user)

  let appName = 'MR'
  let serviceName = 'M-MMC'
  // let applicationForm=''

  const [pageMode, setPageMode] = useState(null)

  const [tempData, setTempData] = useState()

  const [showData, setShowData] = useState(false)
  const [searchDetails, setSearchDetails] = useState()

  const searchData = () => {
    console.log(
      'search',
      getValues('zoneKeyS'),
      getValues('wardKeyS'),
      getValues('registrationDateS'),
      getValues('mRegNoS'),
      getValues('marriageDateS'),
      getValues('marriageYearS'),
      getValues('groomFNameS'),
      getValues('groomMNameS'),
      getValues('groomLNameS'),
      getValues('brideFNameS'),
      getValues('brideMNameS'),
      getValues('brideLNameS'),
    )

    const finalBody = {
      zoneKey: getValues('zoneKeyS'),
      wardKey: getValues('wardKeyS'),
      registrationDate: getValues('registrationDateS'),
      registrationNumber: getValues('mRegNoS'),
      marriageDate: getValues('marriageDateS'),
      marriageYear: Number(getValues('marriageYearS')),
      gfName: getValues('groomFNameS'),
      gmName: getValues('groomMNameS'),
      glName: getValues('groomLNameS'),
      bfName: getValues('brideFNameS'),
      bmName: getValues('brideMNameS'),
      blName: getValues('brideLNameS'),
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
            setShowData(true)
            reset(res.data[0])
            setTempData(res.data[0])

            setSearchDetails(res.data[0])

            setValue('marriageDateM', res.data[0].marriageDate)
            setValue('pplaceOfMarriageM', res.data[0].pplaceOfMarriage)
            setValue('pplaceOfMarriageMrM', res.data[0].pplaceOfMarriageMr)
            setValue('gtitleM', res.data[0].gtitle)
            setValue('gtitleMar', res.data[0].gtitle)
            setValue('gtitleMarM', res.data[0].gtitle)
            setValue('gfNameM', res.data[0].gfName)
            setValue('gmNameM', res.data[0].gmName)
            setValue('glNameM', res.data[0].glName)
            setValue('gtitleMrM', res.data[0].gtitleMr)
            setValue('gfNameMrM', res.data[0].gfNameMr)
            setValue('gmNameMrM', res.data[0].gmNameMr)
            setValue('glNameMrM', res.data[0].glNameMr)
            setValue('gbuildingNoM', res.data[0].gbuildingNo)
            setValue('gbuildingNameM', res.data[0].gbuildingName)
            setValue('groadNameM', res.data[0].groadName)
            setValue('glandmarkM', res.data[0].glandmark)
            setValue('gbuildingNoMrM', res.data[0].gbuildingNoMr)
            setValue('gbuildingNameMrM', res.data[0].gbuildingNameMr)
            setValue('groadNameMrM', res.data[0].groadNameMr)
            setValue('glandmarkMrM', res.data[0].glandmarkMr)
            setValue('gcityNameM', res.data[0].gcityName)
            setValue('gstateM', res.data[0].gstate)
            setValue('gcityNameMrM', res.data[0].gcityNameMr)
            setValue('gstateMrM', res.data[0].gstateMr)
            setValue('gpincodeM', res.data[0].gpincode)
            setValue('gmobileNoM', res.data[0].gmobileNo)

            setValue('btitleM', res.data[0].btitle)
            setValue('btitleMar', res.data[0].btitle)
            setValue('btitleMarM', res.data[0].btitle)
            setValue('bfNameM', res.data[0].bfName)
            setValue('bmNameM', res.data[0].bmName)
            setValue('blNameM', res.data[0].blName)
            setValue('btitleMrM', res.data[0].btitleMr)
            setValue('bfNameMrM', res.data[0].bfNameMr)
            setValue('bmNameMrM', res.data[0].bmNameMr)
            setValue('blNameMrM', res.data[0].blNameMr)
            setValue('bbuildingNoM', res.data[0].bbuildingNo)
            setValue('bbuildingNameM', res.data[0].bbuildingName)
            setValue('broadNameM', res.data[0].broadName)
            setValue('blandmarkM', res.data[0].blandmark)
            setValue('bbuildingNoMrM', res.data[0].bbuildingNoMr)
            setValue('bbuildingNameMrM', res.data[0].bbuildingNameMr)
            setValue('broadNameMrM', res.data[0].broadNameMr)
            setValue('blandmarkMrM', res.data[0].blandmarkMr)
            setValue('bcityNameM', res.data[0].bcityName)
            setValue('bstateM', res.data[0].bstate)
            setValue('bcityNameMrM', res.data[0].bcityNameMr)
            setValue('bstateMrM', res.data[0].bstateMr)
            setValue('bpincodeM', res.data[0].bpincode)
            setValue('bmobileNoM', res.data[0].bmobileNo)
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

  useEffect(() => {
    if (router.query.pageMode === 'Add' || router.query.pageMode === 'Edit') {
      setPageMode(null)
      console.log('enabled', router.query.pageMode)
    } else {
      setPageMode(router.query.pageMode)
      console.log('disabled', router.query.pageMode)
    }
  }, [])

  useEffect(() => {
    if ((showData, router.query.pageMode == 'Edit')) {
      axios
        .get(
          `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          console.log('Modify123', resp.data)
          setTempData(resp.data)
          setShowData(true)
          reset(resp.data)
          setValue('marriageDateM', resp.data.marriageDate)
          setValue('pplaceOfMarriageM', resp.data.pplaceOfMarriage)
          setValue('pplaceOfMarriageMrM', resp.data.pplaceOfMarriageMr)
          setValue('gtitleM', resp.data.gtitle)
          setValue('gtitleMar', resp.data.gtitle)
          setValue('gtitleMarM', resp.data.gtitle)
          setValue('gfNameM', resp.data.gfName)
          setValue('gmNameM', resp.data.gmName)
          setValue('glNameM', resp.data.glName)
          setValue('gtitleMrM', resp.data.gtitleMr)
          setValue('gfNameMrM', resp.data.gfNameMr)
          setValue('gmNameMrM', resp.data.gmNameMr)
          setValue('glNameMrM', resp.data.glNameMr)
          setValue('gbuildingNoM', resp.data.gbuildingNo)
          setValue('gbuildingNameM', resp.data.gbuildingName)
          setValue('groadNameM', resp.data.groadName)
          setValue('glandmarkM', resp.data.glandmark)
          setValue('gbuildingNoMrM', resp.data.gbuildingNoMr)
          setValue('gbuildingNameMrM', resp.data.gbuildingNameMr)
          setValue('groadNameMrM', resp.data.groadNameMr)
          setValue('glandmarkMrM', resp.data.glandmarkMr)
          setValue('gcityNameM', resp.data.gcityName)
          setValue('gstateM', resp.data.gstate)
          setValue('gcityNameMrM', resp.data.gcityNameMr)
          setValue('gstateMrM', resp.data.gstateMr)
          setValue('gpincodeM', resp.data.gpincode)
          setValue('gmobileNoM', resp.data.gmobileNo)

          setValue('btitleM', resp.data.btitle)
          setValue('btitleMar', resp.data.btitle)
          setValue('btitleMarM', resp.data.btitle)
          setValue('bfNameM', resp.data.bfName)
          setValue('bmNameM', resp.data.bmName)
          setValue('blNameM', resp.data.blName)
          setValue('btitleMrM', resp.data.btitleMr)
          setValue('bfNameMrM', resp.data.bfNameMr)
          setValue('bmNameMrM', resp.data.bmNameMr)
          setValue('blNameMrM', resp.data.blNameMr)
          setValue('bbuildingNoM', resp.data.bbuildingNo)
          setValue('bbuildingNameM', resp.data.bbuildingName)
          setValue('broadNameM', resp.data.broadName)
          setValue('blandmarkM', resp.data.blandmark)
          setValue('bbuildingNoMrM', resp.data.bbuildingNoMr)
          setValue('bbuildingNameMrM', resp.data.bbuildingNameMr)
          setValue('broadNameMrM', resp.data.broadNameMr)
          setValue('blandmarkMrM', resp.data.blandmarkMr)
          setValue('bcityNameM', resp.data.bcityName)
          setValue('bstateM', resp.data.bstate)
          setValue('bcityNameMrM', resp.data.bcityNameMr)
          setValue('bstateMrM', resp.data.bstateMr)
          setValue('bpincodeM', resp.data.bpincode)
          setValue('bmobileNoM', resp.data.bmobileNo)

          setTemp(true)

          axios
            .get(
              `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${resp.data.trnApplicantId}`,
            )
            .then((rrr) => {
              reset(rrr.data)
            })
        })
        .catch((err) => {
          console.log(err.response)
          swal('Submitted!', 'Something problem with the search !', 'error')
        })
    }
  }, [showData])

  const [atitles, setatitles] = useState([])
  const [gTitleMars, setgTitleMars] = useState([])

  const [temp, setTemp] = useState()

  const [temp1, setTemp1] = useState()

  // Titles
  const [gTitles, setgTitles] = useState([])

  // getTitles
  const getgTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setgTitles(
        r.data.title.map((row) => ({
          id: row.id,
          gTitle: row.title,
          //titlemr: row.titlemr,
        })),
      )
    })
  }
  // getTitles
  const getgTitleMars = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setgTitleMars(
        r.data.title.map((row) => ({
          id: row.id,
          gTitleMar: row.titleMr,
        })),
      )
    })
  }

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
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${temp1}`,
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

  // Titles
  const [bTitles, setbTitles] = useState([])

  // getTitles
  const getbTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setbTitles(
        r.data.title.map((row) => ({
          id: row.id,
          bTitle: row.title,
        })),
      )
    })
  }

  // Titles
  const [bTitleMars, setbTitleMars] = useState([])

  // getTitles
  const getbTitleMars = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setbTitleMars(
        r.data.title.map((row) => ({
          id: row.id,
          bTitleMar: row.titleMr,
        })),
      )
    })
  }

  useEffect(() => {
    if (temp1) getWardKeys()
  }, [temp1])

  useEffect(() => {
    if (router.query.pageMode != 'Add') setTemp1(getValues('zoneKey'))
  }, [getValues('zoneKey')])
  useEffect(() => {
    getZoneKeys()
    getTitles()
    getgTitleMars()
    getgTitles()
    getbTitles()
    getbTitleMars()
  }, [user])

  const getTitles = async () => {
    await axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setatitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titlemr: row.titleMr,
        })),
      )
    })
  }

  let disabled = false

  const handleApply = () => {
    const finalBody = {
      applicationFrom: 'online' / 'cfc',
      pageMode: null,
      createdUserId: user.id,
      zoneKey: watch('zoneKey'),
      wardKey: watch('wardKey'),
      atitle: watch('atitle'),
      afName: watch('afName'),
      afNameMr: watch('afNameMr'),
      amName: watch('amName'),
      atitleMr: watch('atitleMr'),
      amNameMr: watch('amNameMr'),
      alName: watch('alName'),
      alNameMr: watch('alNameMr'),
      aemail: watch('aemail'),
      amobileNo: watch('amobileNo'),
      aflatBuildingNo: watch('aflatBuildingNo'),
      abuildingName: watch('abuildingName'),
      aroadName: watch('aroadName'),
      alandmark: watch('alandmark'),
      acityName: watch('acityName'),
      astate: watch('astate'),
      apincode: watch('apincode'),
      aflatBuildingNoMr: watch('aflatBuildingNoMr'),
      abuildingNameMr: watch('abuildingNameMr'),
      aroadNameMr: watch('aroadNameMr'),
      alandmarkMr: watch('alandmarkMr'),
      acityNameMr: watch('acityNameMr'),
      astateMr: watch('astateMr'),
      marriageDate: watch('marriageDateM'),
      pplaceOfMarriage: watch('pplaceOfMarriageM'),
      pplaceOfMarriageMr: watch('pplaceOfMarriageMrM'),
      isApplicantGroom: tempData.isApplicantGroom,
      gtitle: watch('gtitleM'),
      gfName: watch('gfNameM'),
      gmName: watch('gmNameM'),
      glName: watch('glNameM'),
      gfNameMr: watch('gfNameMrM'),
      gmNameMr: watch('gmNameMrM'),
      glNameMr: watch('glNameMrM'),
      gbirthDate: tempData.gbirthDate,
      gage: tempData.gage,
      ggender: tempData.ggender,
      gemail: tempData.gemail,
      greligionByBirth: tempData.greligionByBirth,
      greligionByAdoption: tempData.greligionByAdoption,
      gstatusAtTimeMarriageKey: tempData.gstatusAtTimeMarriageKey,
      gbuildingNo: watch('gbuildingNoM'),
      gbuildingName: watch('gbuildingNameM'),
      groadName: watch('groadNameM'),
      glandmark: watch('glandmarkM'),
      gcityName: watch('gcityNameM'),
      gstate: watch('gstateM'),
      gbuildingNoMr: watch('gbuildingNoMrM'),
      gbuildingNameMr: watch('gbuildingNameMrM'),
      groadNameMr: watch('groadNameMrM'),
      glandmarkMr: watch('glandmarkMrM'),
      gcityNameMr: watch('gcityNameMrM'),
      gstateMr: watch('gstateMrM'),
      gpincode: watch('gpincodeM'),
      gmobileNo: watch('gmobileNoM'),
      isApplicantBride: tempData.isApplicantBride,
      btitle: watch('btitleM'),
      bfName: watch('bfNameM'),
      bmName: watch('bmNameM'),
      blName: watch('blNameM'),
      bfNameMr: watch('bfNameMrM'),
      bmNameMr: watch('bmNameMrM'),
      blNameMr: watch('blNameMrM'),
      bbirthDate: tempData.bbirthDate,
      bage: tempData.bage,
      bgender: tempData.bgender,
      baadharNo: tempData.baadharNo,
      bemail: tempData.bemail,
      breligionByBirth: tempData.breligionByBirth,
      breligionByAdoption: tempData.breligionByAdoption,
      bstatusAtTimeMarriageKey: tempData.bstatusAtTimeMarriageKey,
      bbuildingNo: watch('bbuildingNoM'),
      bbuildingName: watch('bbuildingNameM'),
      broadName: watch('broadNameM'),
      blandmark: watch('blandmarkM'),
      bcityName: watch('bcityNameM'),
      bstate: watch('bstateM'),
      bbuildingNoMr: watch('bbuildingNoMrM'),
      bbuildingNameMr: watch('bbuildingNameMrM'),
      broadNameMr: watch('broadNameMrM'),
      blandmarkMr: watch('blandmarkMrM'),
      bcityNameMr: watch('bcityNameMrM'),
      bstateMr: watch('bstateMrM'),
      bpincode: watch('bpincodeM'),
      bmobileNo: watch('bmobileNoM'),
      gageProofDocumentKey: tempData.gageProofDocumentKey,
      gageProofDocument: watch('gageProofDocument'),
      gidProofDocumentKey: tempData.gidProofDocumentKey,
      gidDocument: watch('gidDocument'),
      gresidentialDocumentKey: tempData.gresidentialDocumentKey,
      gresidentialProofDocument: watch('gresidentialProofDocument'),
      bageProofDocument: watch('bageProofDocument'),
      bidProofDocumentKey: tempData.bidProofDocumentKey,
      bidDocument: watch('bidDocument'),
      bresidentialDocumentKey: tempData.bresidentialDocumentKey,
      bresidentialDocument: watch('bresidentialDocument'),
      ustampDetail: tempData.ustampDetail,
      ustampDetailPath: tempData.ustampDetailPath,
      bageProofDocumentKey: tempData.bageProofDocumentKey,
      gaadharNo: tempData.gaadharNo,
      serviceId: 12,
      trnApplicantId: getValues('id'),
    }

    axios
      .post(
        `${urls.MR}/transaction/modOfMarCertificate/saveModOfMarCertificateRegistration`,
        finalBody,
      )
      .then((res) => {
        console.log('res321', res)
        if (res.status == 200 || res.status == 201) {
          swal('Applied!', 'Application Applied Successfully !', 'success')

          router.push({
            pathname: `/marriageRegistration/Receipts/acknowledgmentReceiptmarathi`,
            query: {
              userId: user.id,
              serviceId: 12,
              id: res?.data?.message?.split('$')[1],
            },
          })
        }
      })
      .catch((err) => {
        console.log(err.response)
        swal('Submitted!', 'Something problem with the search !', 'error')
      })
  }

  return (
    <div style={{ backgroundColor: '#F5F5F5' }}>
      <div>
        <FormProvider {...methods}>
          <ThemeProvider theme={theme}>
            <>
              {!props.preview && !props.onlyDoc && (
                <>
                  <Paper
                    sx={{
                      marginLeft: 10,
                      marginRight: 2,
                      marginTop: 5,
                      marginBottom: 5,
                      padding: 1,
                      // border: 1,
                      // borderColor: 'grey.500',
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
                          <FormattedLabel id="onlyMIMC" />
                          {/* Modification of Marriage Certificate */}
                        </h3>
                      </div>
                    </div>
                    <Accordion
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
                          1) Filter (Registration Number *)
                        </Typography>
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
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
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
                    </Accordion>

                    <Accordion
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
                          2) Filter (Zone * ,marriage date *,groomFName
                          ,groomLName ,brideFName ,brideLName)
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className={styles.row}>
                          <div>
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              //error={!!errors.zoneKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="zone" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    //sx={{ width: 230 }}
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value)
                                      console.log(
                                        'Zone Key: ',
                                        value.target.value,
                                      )
                                      setTemp1(value.target.value)
                                    }}
                                    label="Zone Name *"
                                  >
                                    {zoneKeys &&
                                      zoneKeys.map((zoneKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={zoneKey.id}
                                        >
                                          {/* {zoneKey.zoneKey} */}

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
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Ward Name *"
                                  >
                                    {wardKeys &&
                                      wardKeys.map((wardKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={wardKey.id}
                                        >
                                          {/* {wardKey.wardKey} */}
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
                              {/* <FormHelperText>
                  {errors?.wardKey ? errors.wardKey.message : null}
                </FormHelperText> */}
                            </FormControl>
                          </div>
                          <div>
                            <FormControl sx={{ marginTop: 0 }}>
                              <Controller
                                control={control}
                                name="marriageDateS"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
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
                          {/* <div>
                            <FormControl sx={{ marginTop: 0 }}>
                              <Controller
                                control={control}
                                name="registrationDateS"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
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
                          </div> */}
                        </div>
                        {/* <div className={styles.row}>
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
                        </div> */}

                        <div className={styles.row}>
                          <div>
                            <TextField
                              //  disabled
                              sx={{ width: 230 }}
                              id="standard-basic"
                              // defaultValue={"abc"}
                              label={
                                <FormattedLabel id="groomFName" required />
                              }
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
                              label={
                                <FormattedLabel id="groomLName" required />
                              }
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
                              label={
                                <FormattedLabel id="brideFName" required />
                              }
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
                              label={
                                <FormattedLabel id="brideLName" required />
                              }
                              variant="standard"
                              {...register('brideLNameS')}
                            />
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>

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
                </>
              )}
              {showData ? (
                <Paper
                  sx={{
                    marginLeft: 10,
                    marginRight: 2,
                    marginTop: 5,
                    marginBottom: 5,
                    padding: 5,
                    // border: 1,
                    // borderColor: 'grey.500',
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
                        <FormattedLabel id="onlyMIMC" />
                        {/* Modification of Marriage Certificate */}
                      </h3>
                    </div>
                  </div>

                  {!props.onlyDoc && (
                    <>
                      <Accordion
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
                          expandIcon={
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                          }
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          backgroundColor="#0070f3"
                          // sx={{
                          //   backgroundColor: '0070f3',
                          // }}
                        >
                          <Typography>
                            {' '}
                            <FormattedLabel id="ApplicatDetails" />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className={styles.row}>
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
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        console.log(
                                          'Zone Key: ',
                                          value.target.value,
                                        )
                                        setTemp1(value.target.value)
                                      }}
                                      label="Zone Name *"
                                    >
                                      {zoneKeys &&
                                        zoneKeys.map((zoneKey, index) => (
                                          <MenuItem
                                            key={index}
                                            value={zoneKey.id}
                                          >
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
                                      value={field.value}
                                      onChange={(value) =>
                                        field.onChange(value)
                                      }
                                      label="Ward Name *"
                                    >
                                      {wardKeys &&
                                        wardKeys.map((wardKey, index) => (
                                          <MenuItem
                                            key={index}
                                            value={wardKey.id}
                                          >
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
                              <FormControl
                                variant="standard"
                                error={!!errors.atitle}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {<FormattedLabel id="title" required />}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      // InputLabelProps={{
                                      //   shrink:
                                      //     (watch('aTitle') ? true : false) ||
                                      //     (router.query.aTitle ? true : false),
                                      // }}
                                      // disabled={true}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        setValue('atitleMr', value.target.value)
                                      }}
                                      label="Title *"
                                    >
                                      {atitles &&
                                        atitles.map((aTitle, index) => (
                                          <MenuItem
                                            key={index}
                                            value={aTitle.id}
                                          >
                                            {/* {atitle.atitle} */}
                                            {aTitle?.title}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="atitle"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.atitle
                                    ? errors.atitle.message
                                    : null}
                                  {/* {errors.atitle && <p>{errors.atitle.message}</p>} */}
                                </FormHelperText>
                              </FormControl>
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('afName') ? true : false) ||
                                    (router.query.afName ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="firstName" required />
                                }
                                // label=" Hello"
                                variant="standard"
                                {...register('afName')}
                                error={!!errors.afName}
                                helperText={
                                  errors?.afName ? errors.afName.message : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('amName') ? true : false) ||
                                    (router?.query?.amName ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                //label="Middle Name *"
                                label={
                                  <FormattedLabel id="middleName" required />
                                }
                                variant="standard"
                                {...register('amName')}
                                error={!!errors.amName}
                                helperText={
                                  errors?.amName ? errors.amName.message : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('alName') ? true : false) ||
                                    (router.query.alName ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                //label="Last Name *"
                                label={
                                  <FormattedLabel id="lastName" required />
                                }
                                variant="standard"
                                {...register('alName')}
                                error={!!errors.alName}
                                helperText={
                                  errors?.alName ? errors.alName.message : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.row}>
                            <div>
                              <FormControl
                                variant="standard"
                                error={!!errors.atitleMr}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {<FormattedLabel id="title" required />}
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      InputLabelProps={{
                                        shrink:
                                          (watch('atitleMr') ? true : false) ||
                                          (router.query.atitleMr
                                            ? true
                                            : false),
                                      }}
                                      // disabled={true}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        setValue('atitle', value.target.value)
                                      }}
                                      label="Title *"
                                      id="demo-simple-select-standard"
                                      labelId="id='demo-simple-select-standard-label'"
                                    >
                                      {atitles &&
                                        atitles.map((aTitleMr, index) => (
                                          <MenuItem
                                            key={index}
                                            value={aTitleMr.id}
                                          >
                                            {aTitleMr?.titlemr}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="atitleMr"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.atitleMr
                                    ? errors.atitleMr.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('afNameMr') ? true : false) ||
                                    (router.query.afNameMr ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="firstNamemr" required />
                                }
                                // label=" Hello"
                                variant="standard"
                                {...register('afNameMr')}
                                error={!!errors.afNameMr}
                                helperText={
                                  errors?.afNameMr
                                    ? errors.afNameMr.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('amNameMr') ? true : false) ||
                                    (router.query.amNameMr ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                //label="Middle Name *"
                                label={
                                  <FormattedLabel id="middleNamemr" required />
                                }
                                variant="standard"
                                {...register('amNameMr')}
                                error={!!errors.amNameMr}
                                helperText={
                                  errors?.amNameMr
                                    ? errors.amNameMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('alNameMr') ? true : false) ||
                                    (router.query.alNameMr ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                //label="Last Name *"
                                label={
                                  <FormattedLabel id="lastNamemr" required />
                                }
                                variant="standard"
                                {...register('alNameMr')}
                                error={!!errors.alNameMr}
                                helperText={
                                  errors?.alNameMr
                                    ? errors.alNameMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div
                            className={styles.row}
                            style={{ marginRight: '50%' }}
                          >
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('aemail') ? true : false) ||
                                    (router.query.aemail ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={<FormattedLabel id="email" required />}
                                variant="standard"
                                {...register('aemail')}
                                error={!!errors.aemail}
                                helperText={
                                  errors?.aemail ? errors.aemail.message : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('amobileNo') ? true : false) ||
                                    (router.query.amobileNo ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="mobileNo" required />
                                }
                                variant="standard"
                                {...register('amobileNo')}
                                error={!!errors.amobileNo}
                                helperText={
                                  errors?.amobileNo
                                    ? errors.amobileNo.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('aflatBuildingNo') ? true : false) ||
                                    (router.query.aflatBuildingNo
                                      ? true
                                      : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNo"
                                    required
                                  />
                                }
                                variant="standard"
                                {...register('aflatBuildingNo')}
                                error={!!errors.aflatBuildingNo}
                                helperText={
                                  errors?.aflatBuildingNo
                                    ? errors.aflatBuildingNo.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('abuildingName') ? true : false) ||
                                    (router.query.abuildingName ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="buildingName" required />
                                }
                                variant="standard"
                                {...register('abuildingName')}
                                error={!!errors.abuildingName}
                                helperText={
                                  errors?.abuildingName
                                    ? errors.abuildingName.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('aroadName') ? true : false) ||
                                    (router.query.aroadName ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="roadName" required />
                                }
                                variant="standard"
                                {...register('aroadName')}
                                error={!!errors.aroadName}
                                helperText={
                                  errors?.aroadName
                                    ? errors.aroadName.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('alandmark') ? true : false) ||
                                    (router.query.alandmark ? true : false),
                                }}
                                //disabled
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmark" required />
                                }
                                variant="standard"
                                {...register('alandmark')}
                                error={!!errors.alandmark}
                                helperText={
                                  errors?.alandmark
                                    ? errors.alandmark.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('aflatBuildingNoMr')
                                      ? true
                                      : false) ||
                                    (router.query.aflatBuildingNoMr
                                      ? true
                                      : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNomr"
                                    required
                                  />
                                }
                                variant="standard"
                                {...register('aflatBuildingNoMr')}
                                error={!!errors.aflatBuildingNoMr}
                                helperText={
                                  errors?.aflatBuildingNoMr
                                    ? errors.aflatBuildingNoMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('abuildingNameMr') ? true : false) ||
                                    (router.query.abuildingNameMr
                                      ? true
                                      : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="buildingNamemr"
                                    required
                                  />
                                }
                                variant="standard"
                                {...register('abuildingNameMr')}
                                error={!!errors.abuildingNameMr}
                                helperText={
                                  errors?.abuildingNameMr
                                    ? errors.abuildingNameMr.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('aroadNameMr') ? true : false) ||
                                    (router.query.aroadNameMr ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="roadNamemr" required />
                                }
                                variant="standard"
                                {...register('aroadNameMr')}
                                error={!!errors.aroadNameMr}
                                helperText={
                                  errors?.aroadNameMr
                                    ? errors.aroadNameMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                //disabled
                                InputLabelProps={{
                                  shrink:
                                    (watch('alandmarkMr') ? true : false) ||
                                    (router.query.alandmarkMr ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmarkmr" required />
                                }
                                variant="standard"
                                {...register('alandmarkMr')}
                                error={!!errors.alandmarkMr}
                                helperText={
                                  errors?.alandmarkMr
                                    ? errors.alandmarkMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div
                            className={
                              styles.row
                            } /* style={{ marginRight: "25%" }} */
                          >
                            <div>
                              <TextField
                                // disabled
                                InputLabelProps={{
                                  shrink:
                                    (watch('acityName') ? true : false) ||
                                    (router.query.acityName ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityName" required />
                                }
                                variant="standard"
                                {...register('acityName')}
                                error={!!errors.acityName}
                                helperText={
                                  errors?.acityName
                                    ? errors.acityName.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('astate') ? true : false) ||
                                    (router.query.astate ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={<FormattedLabel id="state" required />}
                                variant="standard"
                                {...register('astate')}
                                error={!!errors.astate}
                                helperText={
                                  errors?.astate ? errors.astate.message : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                // disabled
                                InputLabelProps={{
                                  shrink:
                                    (watch('acityNameMr') ? true : false) ||
                                    (router.query.acityNameMr ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityNamemr" required />
                                }
                                variant="standard"
                                {...register('acityNameMr')}
                                error={!!errors.acityNameMr}
                                helperText={
                                  errors?.acityNameMr
                                    ? errors.acityNameMr.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('astateMr') ? true : false) ||
                                    (router.query.astateMr ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={<FormattedLabel id="statemr" required />}
                                variant="standard"
                                {...register('astateMr')}
                                error={!!errors.astateMr}
                                helperText={
                                  errors?.astateMr
                                    ? errors.astateMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div
                            className={styles.row}
                            style={{ marginRight: '75%' }}
                          >
                            <div>
                              <TextField
                                //disabled
                                InputLabelProps={{
                                  shrink:
                                    (watch('apincode') ? true : false) ||
                                    (router.query.apincode ? true : false),
                                }}
                                // disabled={true}
                                sx={{ width: 230 }}
                                id="standard-basic"
                                label={<FormattedLabel id="pincode" required />}
                                variant="standard"
                                {...register('apincode')}
                                error={!!errors.apincode}
                                helperText={
                                  errors?.apincode
                                    ? errors.apincode.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion
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
                          expandIcon={
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                          }
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          backgroundColor="#0070f3"
                          // sx={{
                          //   backgroundColor: '0070f3',
                          // }}
                        >
                          <Typography>
                            <FormattedLabel id="marrigeDetails" />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                sx={{ marginTop: 0 }}
                                error={!!errors.marriageDate}
                              >
                                <Controller
                                  control={control}
                                  name="marriageDate"
                                  defaultValue={null}
                                  render={({ field }) => (
                                    <LocalizationProvider
                                      dateAdapter={AdapterMoment}
                                    >
                                      <DatePicker
                                        disabled={true}
                                        inputFormat="DD/MM/YYYY"
                                        label={
                                          <span style={{ fontSize: 14 }}>
                                            {' '}
                                            {
                                              <FormattedLabel
                                                id="marrigeDate"
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
                                            disabled={true}
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
                                <FormHelperText>
                                  {errors?.marriageDate
                                    ? errors.marriageDate.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>

                            <div>
                              <TextField
                                disabled={true}
                                autoFocus
                                InputLabelProps={{
                                  shrink:
                                    (watch('pplaceOfMarriage')
                                      ? true
                                      : false) ||
                                    (router.query.pplaceOfMarriage
                                      ? true
                                      : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="placeofMarriage"
                                    required
                                  />
                                }
                                variant="standard"
                                {...register('pplaceOfMarriage')}
                                error={!!errors?.pplaceOfMarriage}
                                helperText={
                                  errors?.pplaceOfMarriage
                                    ? errors.pplaceOfMarriage.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink:
                                    (watch('pplaceOfMarriageMr')
                                      ? true
                                      : false) ||
                                    (router.query.pplaceOfMarriageMr
                                      ? true
                                      : false),
                                }}
                                disabled={true}
                                autoFocus
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="placeofMarriage1"
                                    required
                                  />
                                }
                                variant="standard"
                                {...register('pplaceOfMarriageMr')}
                                error={!!errors?.pplaceOfMarriageMr}
                                helperText={
                                  errors?.pplaceOfMarriageMr
                                    ? errors.pplaceOfMarriageMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                sx={{ marginTop: 0 }}
                                error={!!errors.marriageDate}
                              >
                                <Controller
                                  control={control}
                                  name="marriageDateM"
                                  defaultValue={null}
                                  render={({ field }) => (
                                    <LocalizationProvider
                                      dateAdapter={AdapterMoment}
                                    >
                                      <DatePicker
                                        disabled={disabled}
                                        inputFormat="DD/MM/YYYY"
                                        label={
                                          <span style={{ fontSize: 14 }}>
                                            {' '}
                                            {
                                              <FormattedLabel
                                                id="marrigeDate"
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
                                            disabled={disabled}
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
                                <FormHelperText>
                                  {errors?.marriageDateM
                                    ? errors.marriageDateM.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>

                            <div>
                              <TextField
                                disabled={disabled}
                                autoFocus
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="placeofMarriage"
                                    required
                                  />
                                }
                                variant="standard"
                                {...register('pplaceOfMarriageM')}
                                error={!!errors?.pplaceOfMarriageM}
                                helperText={
                                  errors?.pplaceOfMarriageM
                                    ? errors.pplaceOfMarriageM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                  // (watch('pplaceOfMarriageMrM')
                                  //   ? true
                                  //   : false) ||
                                  // (router.query.pplaceOfMarriageMrM
                                  //   ? true
                                  //   : false),
                                }}
                                disabled={disabled}
                                autoFocus
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="placeofMarriage1"
                                    required
                                  />
                                }
                                variant="standard"
                                {...register('pplaceOfMarriageMrM')}
                                error={!!errors?.pplaceOfMarriageMrM}
                                helperText={
                                  errors?.pplaceOfMarriageMrM
                                    ? errors.pplaceOfMarriageMrM.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion
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
                          expandIcon={
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                          }
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          backgroundColor="#0070f3"
                          // sx={{
                          //   backgroundColor: '0070f3',
                          // }}
                        >
                          <Typography>
                            {' '}
                            <FormattedLabel id="groomDetail" />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                variant="standard"
                                error={!!errors.gtitle}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="title1" required />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled={true}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        setValue(
                                          'gtitleMar',
                                          value.target.value,
                                        )
                                      }}
                                      label="Title  "
                                      id="demo-simple-select-standard"
                                      labelId="id='demo-simple-select-standard-label'"
                                    >
                                      {gTitles &&
                                        gTitles.map((gTitle, index) => (
                                          <MenuItem
                                            key={index}
                                            value={gTitle.id}
                                          >
                                            {gTitle.gTitle}

                                            {/* {language == 'en' ? gTitle?.title : gTitle?.titlemr} */}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="gtitle"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.gtitle
                                    ? errors.gtitle.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gFName") ? true : false) ||
                                  // (router.query.gFName ? true : false),
                                }}
                                disabled={true}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="firstName" required />
                                }
                                // label="First Name  "
                                variant="standard"
                                {...register('gfName')}
                                error={!!errors.gfName}
                                helperText={
                                  errors?.gfName ? errors.gfName.message : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gMName") ? true : false) ||
                                  // (router.query.gMName ? true : false),
                                }}
                                // InputLabelProps={{ shrink: true }}
                                disabled={true}
                                id="standard-basic"
                                // label="Middle Name  "
                                label={
                                  <FormattedLabel id="middleName" required />
                                }
                                variant="standard"
                                {...register('gmName')}
                                error={!!errors.gmName}
                                helperText={
                                  errors?.gmName ? errors.gmName.message : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gLName") ? true : false) ||
                                  // (router.query.gLName ? true : false),
                                }}
                                disabled={true}
                                id="standard-basic"
                                // label="Last Name  "
                                label={
                                  <FormattedLabel id="lastName" required />
                                }
                                variant="standard"
                                {...register('glName')}
                                error={!!errors.glName}
                                helperText={
                                  errors?.glName ? errors.glName.message : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                variant="standard"
                                error={!!errors.gtitleM}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="title1" required />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled={disabled}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        setValue(
                                          'gtitleMarM',
                                          value.target.value,
                                        )
                                      }}
                                      label="Title  "
                                      id="demo-simple-select-standard"
                                      labelId="id='demo-simple-select-standard-label'"
                                    >
                                      {gTitles &&
                                        gTitles.map((gTitle, index) => (
                                          <MenuItem
                                            key={index}
                                            value={gTitle.id}
                                          >
                                            {gTitle.gTitle}

                                            {/* {language == 'en' ? gTitle?.title : gTitle?.titlemr} */}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="gtitleM"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.gtitleM
                                    ? errors.gtitleM.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gFName") ? true : false) ||
                                  // (router.query.gFName ? true : false),
                                }}
                                disabled={disabled}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="firstName" required />
                                }
                                // label="First Name  "
                                variant="standard"
                                {...register('gfNameM')}
                                error={!!errors.gfNameM}
                                helperText={
                                  errors?.gfNameM
                                    ? errors.gfNameM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gMName") ? true : false) ||
                                  // (router.query.gMName ? true : false),
                                }}
                                // InputLabelProps={{ shrink: true }}
                                disabled={disabled}
                                id="standard-basic"
                                // label="Middle Name  "
                                label={
                                  <FormattedLabel id="middleName" required />
                                }
                                variant="standard"
                                {...register('gmNameM')}
                                error={!!errors.gmNameM}
                                helperText={
                                  errors?.gmNameM
                                    ? errors.gmNameM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gLName") ? true : false) ||
                                  // (router.query.gLName ? true : false),
                                }}
                                disabled={disabled}
                                id="standard-basic"
                                // label="Last Name  "
                                label={
                                  <FormattedLabel id="lastName" required />
                                }
                                variant="standard"
                                {...register('glNameM')}
                                error={!!errors.glNameM}
                                helperText={
                                  errors?.glNameM
                                    ? errors.glNameM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                variant="standard"
                                error={!!errors.gtitleMar}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="titlemr" required />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled={true}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)

                                        setValue('gtitle', value.target.value)
                                      }}
                                      label="Title  "
                                      id="demo-simple-select-standard"
                                      labelId="id='demo-simple-select-standard-label'"
                                    >
                                      {gTitleMars &&
                                        gTitleMars.map((gTitleMar, index) => (
                                          <MenuItem
                                            key={index}
                                            value={gTitleMar.id}
                                          >
                                            {gTitleMar.gTitleMar}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="gtitleMar"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.gtitleMar
                                    ? errors.gtitleMar.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gFNameMr") ? true : false) ||
                                  // (router.query.gFNameMr ? true : false),
                                }}
                                id="standard-basic"
                                // label="प्रथम नावं  "
                                label={
                                  <FormattedLabel id="firstNamemr" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('gfNameMr')}
                                error={!!errors.gfNameMr}
                                helperText={
                                  errors?.gfNameMr
                                    ? errors.gfNameMr.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                id="standard-basic"
                                // label="मधले नावं  "
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gMNameMr") ? true : false) ||
                                  // (router.query.gLNameMr ? true : false),
                                }}
                                label={
                                  <FormattedLabel id="middleNamemr" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('gmNameMr')}
                                error={!!errors.gmNameMr}
                                helperText={
                                  errors?.gmNameMr
                                    ? errors.gmNameMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gLNameMr") ? true : false) ||
                                  // (router.query.gLNameMr ? true : false),
                                }}
                                id="standard-basic"
                                // label="आडनाव  "
                                disabled={true}
                                label={
                                  <FormattedLabel id="lastNamemr" required />
                                }
                                variant="standard"
                                {...register('glNameMr')}
                                error={!!errors.glNameMr}
                                helperText={
                                  errors?.glNameMr
                                    ? errors.glNameMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                variant="standard"
                                error={!!errors.gtitleMarM}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="titlemr" required />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled={disabled}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)

                                        setValue('gtitleM', value.target.value)
                                      }}
                                      label="Title  "
                                      id="demo-simple-select-standard"
                                      labelId="id='demo-simple-select-standard-label'"
                                    >
                                      {gTitleMars &&
                                        gTitleMars.map((gTitleMar, index) => (
                                          <MenuItem
                                            key={index}
                                            value={gTitleMar.id}
                                          >
                                            {gTitleMar.gTitleMar}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="gtitleMarM"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.gtitleMarM
                                    ? errors.gtitleMarM.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gFNameMr") ? true : false) ||
                                  // (router.query.gFNameMr ? true : false),
                                }}
                                id="standard-basic"
                                // label="प्रथम नावं  "
                                label={
                                  <FormattedLabel id="firstNamemr" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('gfNameMrM')}
                                error={!!errors.gfNameMrM}
                                helperText={
                                  errors?.gfNameMrM
                                    ? errors.gfNameMrM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                id="standard-basic"
                                // label="मधले नावं  "
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gMNameMr") ? true : false) ||
                                  // (router.query.gLNameMr ? true : false),
                                }}
                                label={
                                  <FormattedLabel id="middleNamemr" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('gmNameMrM')}
                                error={!!errors.gmNameMrM}
                                helperText={
                                  errors?.gmNameMrM
                                    ? errors.gmNameMrM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gLNameMr") ? true : false) ||
                                  // (router.query.gLNameMr ? true : false),
                                }}
                                id="standard-basic"
                                // label="आडनाव  "
                                disabled={disabled}
                                label={
                                  <FormattedLabel id="lastNamemr" required />
                                }
                                variant="standard"
                                {...register('glNameMrM')}
                                error={!!errors.glNameMrM}
                                helperText={
                                  errors?.glNameMrM
                                    ? errors.glNameMrM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gBuildingNo") ? true : false) ||
                                  // (router.query.gBuildingNo ? true : false),
                                }}
                                id="standard-basic"
                                // label="Flat/Building No. *"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNo"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('gbuildingNo')}
                                error={!!errors.gbuildingNo}
                                helperText={
                                  errors?.gbuildingNo
                                    ? errors.gbuildingNo.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gBuildingName") ? true : false) ||
                                  // (router.query.gBuildingName ? true : false),
                                }}
                                id="standard-basic"
                                // label="Apartment Name"
                                label={
                                  <FormattedLabel id="buildingName" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('gbuildingName')}
                                error={!!errors.gbuildingName}
                                helperText={
                                  errors?.gbuildingName
                                    ? errors.gbuildingName.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gRoadName") ? true : false) ||
                                  // (router.query.gRoadName ? true : false),
                                }}
                                id="standard-basic"
                                //  label="Road Name"
                                label={
                                  <FormattedLabel id="roadName" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('groadName')}
                                error={!!errors.groadName}
                                helperText={
                                  errors?.groadName
                                    ? errors.groadName.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gLandmark") ? true : false) ||
                                  // (router.query.gLandmark ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmark" required />
                                }
                                // label="Landmark"
                                variant="standard"
                                disabled={true}
                                {...register('glandmark')}
                                error={!!errors.glandmark}
                                helperText={
                                  errors?.glandmark
                                    ? errors.glandmark.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gBuildingNo") ? true : false) ||
                                  // (router.query.gBuildingNo ? true : false),
                                }}
                                id="standard-basic"
                                // label="Flat/Building No. *"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNo"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('gbuildingNoM')}
                                error={!!errors.gbuildingNoM}
                                helperText={
                                  errors?.gbuildingNoM
                                    ? errors.gbuildingNoM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gBuildingName") ? true : false) ||
                                  // (router.query.gBuildingName ? true : false),
                                }}
                                id="standard-basic"
                                // label="Apartment Name"
                                label={
                                  <FormattedLabel id="buildingName" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('gbuildingNameM')}
                                error={!!errors.gbuildingNameM}
                                helperText={
                                  errors?.gbuildingNameM
                                    ? errors.gbuildingNameM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gRoadName") ? true : false) ||
                                  // (router.query.gRoadName ? true : false),
                                }}
                                id="standard-basic"
                                //  label="Road Name"
                                label={
                                  <FormattedLabel id="roadName" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('groadNameM')}
                                error={!!errors.groadNameM}
                                helperText={
                                  errors?.groadNameM
                                    ? errors.groadNameM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gLandmark") ? true : false) ||
                                  // (router.query.gLandmark ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmark" required />
                                }
                                // label="Landmark"
                                variant="standard"
                                disabled={disabled}
                                {...register('glandmarkM')}
                                error={!!errors.glandmarkM}
                                helperText={
                                  errors?.glandmarkM
                                    ? errors.glandmarkM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gBuildingNoMr") ? true : false) ||
                                  // (router.query.gBuildingNoMr ? true : false),
                                }}
                                id="standard-basic"
                                // label="Flat/Building No. *"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNomr"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('gbuildingNoMr')}
                                error={!!errors.gbuildingNoMr}
                                helperText={
                                  errors?.gbuildingNoMr
                                    ? errors.gbuildingNoMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gBuildingNameMr") ? true : false) ||
                                  // (router.query.gBuildingNameMr ? true : false),
                                }}
                                id="standard-basic"
                                // label="Apartment Name"
                                label={
                                  <FormattedLabel
                                    id="buildingNamemr"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('gbuildingNameMr')}
                                error={!!errors.gbuildingNameMr}
                                helperText={
                                  errors?.gbuildingNameMr
                                    ? errors.gbuildingNameMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gRoadNameMr") ? true : false) ||
                                  // (router.query.gRoadNameMr ? true : false),
                                }}
                                id="standard-basic"
                                //  label="Road Name"
                                label={
                                  <FormattedLabel id="roadNamemr" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('groadNameMr')}
                                error={!!errors.groadNameMr}
                                helperText={
                                  errors?.groadNameMr
                                    ? errors.groadNameMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gLandmarkMr") ? true : false) ||
                                  // (router.query.gLandmarkMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmarkmr" required />
                                }
                                // label="Landmark"
                                variant="standard"
                                disabled={true}
                                {...register('glandmarkMr')}
                                error={!!errors.glandmarkMr}
                                helperText={
                                  errors?.glandmarkMr
                                    ? errors.glandmarkMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gBuildingNoMr") ? true : false) ||
                                  // (router.query.gBuildingNoMr ? true : false),
                                }}
                                id="standard-basic"
                                // label="Flat/Building No. *"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNomr"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('gbuildingNoMrM')}
                                error={!!errors.gbuildingNoMrM}
                                helperText={
                                  errors?.gbuildingNoMrM
                                    ? errors.gbuildingNoMrM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gBuildingNameMr") ? true : false) ||
                                  // (router.query.gBuildingNameMr ? true : false),
                                }}
                                id="standard-basic"
                                // label="Apartment Name"
                                label={
                                  <FormattedLabel
                                    id="buildingNamemr"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('gbuildingNameMrM')}
                                error={!!errors.gbuildingNameMrM}
                                helperText={
                                  errors?.gbuildingNameM
                                    ? errors.gbuildingNameMrM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gRoadNameMr") ? true : false) ||
                                  // (router.query.gRoadNameMr ? true : false),
                                }}
                                id="standard-basic"
                                //  label="Road Name"
                                label={
                                  <FormattedLabel id="roadNamemr" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('groadNameMrM')}
                                error={!!errors.groadNameMrM}
                                helperText={
                                  errors?.groadNameMrM
                                    ? errors.groadNameMrM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gLandmarkMr") ? true : false) ||
                                  // (router.query.gLandmarkMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmarkmr" required />
                                }
                                // label="Landmark"
                                variant="standard"
                                disabled={disabled}
                                {...register('glandmarkMrM')}
                                error={!!errors.glandmarkMrM}
                                helperText={
                                  errors?.glandmarkMrM
                                    ? errors.glandmarkMrM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gCityName") ? true : false) ||
                                  // (router.query.gCityName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityName" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('gcityName')}
                                error={!!errors.gcityName}
                                helperText={
                                  errors?.gcityName
                                    ? errors.gcityName.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gState") ? true : false) ||
                                  // (router.query.gState ? true : false),
                                }}
                                id="standard-basic"
                                label={<FormattedLabel id="state" required />}
                                // label="State *"
                                disabled={true}
                                variant="standard"
                                {...register('gstate')}
                                error={!!errors.gstate}
                                helperText={
                                  errors?.gstate ? errors.gstate.message : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gCityNameMr") ? true : false) ||
                                  // (router.query.gCityNameMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityNamemr" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('gcityNameMr')}
                                error={!!errors.gcityNameMr}
                                helperText={
                                  errors?.gcityNameMr
                                    ? errors.gcityNameMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gStateMr") ? true : false) ||
                                  // (router.query.gStateMr ? true : false),
                                }}
                                id="standard-basic"
                                label={<FormattedLabel id="statemr" required />}
                                // label="State *"
                                disabled={true}
                                variant="standard"
                                {...register('gstateMr')}
                                error={!!errors.gstateMr}
                                helperText={
                                  errors?.gstateMr
                                    ? errors.gstateMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gCityName") ? true : false) ||
                                  // (router.query.gCityName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityName" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('gcityNameM')}
                                error={!!errors.gcityNameM}
                                helperText={
                                  errors?.gcityNameM
                                    ? errors.gcityNameM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gState") ? true : false) ||
                                  // (router.query.gState ? true : false),
                                }}
                                id="standard-basic"
                                label={<FormattedLabel id="state" required />}
                                // label="State *"
                                disabled={disabled}
                                variant="standard"
                                {...register('gstateM')}
                                error={!!errors.gstateM}
                                helperText={
                                  errors?.gstateM
                                    ? errors.gstateM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gCityNameMr") ? true : false) ||
                                  // (router.query.gCityNameMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityNamemr" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('gcityNameMrM')}
                                error={!!errors.gcityNameMrM}
                                helperText={
                                  errors?.gcityNameMrM
                                    ? errors.gcityNameMrM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gStateMr") ? true : false) ||
                                  // (router.query.gStateMr ? true : false),
                                }}
                                id="standard-basic"
                                label={<FormattedLabel id="statemr" required />}
                                // label="State *"
                                disabled={disabled}
                                variant="standard"
                                {...register('gstateMrM')}
                                error={!!errors.gstateMrM}
                                helperText={
                                  errors?.gstateMrM
                                    ? errors.gstateMrM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gPincode") ? true : false) ||
                                  // (router.query.gPincode ? true : false),
                                }}
                                id="standard-basic"
                                // label="Pin Code *"
                                label={<FormattedLabel id="pincode" required />}
                                variant="standard"
                                disabled={true}
                                {...register('gpincode')}
                                error={!!errors.gpincode}
                                helperText={
                                  errors?.gpincode
                                    ? errors.gpincode.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gMobileNo") ? true : false) ||
                                  // (router.query.gMobileNo ? true : false),
                                }}
                                id="standard-basic"
                                // label="Mobile Number"
                                label={
                                  <FormattedLabel id="mobileNo" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('gmobileNo')}
                                error={!!errors.gmobileNo}
                                helperText={
                                  errors?.gmobileNo
                                    ? errors.gmobileNo.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gPincode") ? true : false) ||
                                  // (router.query.gPincode ? true : false),
                                }}
                                id="standard-basic"
                                // label="Pin Code *"
                                label={<FormattedLabel id="pincode" required />}
                                variant="standard"
                                disabled={disabled}
                                {...register('gpincodeM')}
                                error={!!errors.gpincodeM}
                                helperText={
                                  errors?.gpincodeM
                                    ? errors.gpincodeM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("gMobileNo") ? true : false) ||
                                  // (router.query.gMobileNo ? true : false),
                                }}
                                id="standard-basic"
                                // label="Mobile Number"
                                label={
                                  <FormattedLabel id="mobileNo" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('gmobileNoM')}
                                error={!!errors.gmobileNoM}
                                helperText={
                                  errors?.gmobileNoM
                                    ? errors.gmobileNoM.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion
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
                          expandIcon={
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                          }
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          backgroundColor="#0070f3"
                          // sx={{
                          //   backgroundColor: '0070f3',
                          // }}
                        >
                          <Typography>
                            {' '}
                            <FormattedLabel id="brideDetails" />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                variant="standard"
                                error={!!errors.btitle}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {/* {<FormattedLabel id="title" />} */}
                                  <FormattedLabel id="title1" required />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled={true}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        setValue(
                                          'btitleMar',
                                          value.target.value,
                                        )
                                      }}
                                      label="Title *"
                                      id="demo-simple-select-standard"
                                      labelId="id='demo-simple-select-standard-label'"
                                    >
                                      {bTitles &&
                                        bTitles.map((bTitle, index) => (
                                          <MenuItem
                                            key={index}
                                            value={bTitle.id}
                                          >
                                            {bTitle.bTitle}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="btitle"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.btitle
                                    ? errors.btitle.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bFName") ? true : false) ||
                                  // (router.query.bFName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="firstName" required />
                                }
                                // label={<FormattedLabel id="firstName" />}
                                disabled={true}
                                variant="standard"
                                {...register('bfName')}
                                error={!!errors.bfName}
                                helperText={
                                  errors?.bfName ? errors.bfName.message : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bMName") ? true : false) ||
                                  // (router.query.bMName ? true : false),
                                }}
                                id="standard-basic"
                                // label={<FormattedLabel id="middleName" />}
                                disabled={true}
                                label={
                                  <FormattedLabel id="middleName" required />
                                }
                                variant="standard"
                                {...register('bmName')}
                                error={!!errors.bmName}
                                helperText={
                                  errors?.bmName ? errors.bmName.message : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bLName") ? true : false) ||
                                  // (router.query.bLName ? true : false),
                                }}
                                id="standard-basic"
                                // label={<FormattedLabel id="lastName" />}
                                disabled={true}
                                label={
                                  <FormattedLabel id="lastName" required />
                                }
                                variant="standard"
                                {...register('blName')}
                                error={!!errors.blName}
                                helperText={
                                  errors?.blName ? errors.blName.message : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                variant="standard"
                                error={!!errors.btitleM}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  {/* {<FormattedLabel id="title" />} */}
                                  <FormattedLabel id="title1" required />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled={disabled}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        setValue(
                                          'btitleMarM',
                                          value.target.value,
                                        )
                                      }}
                                      label="Title *"
                                      id="demo-simple-select-standard"
                                      labelId="id='demo-simple-select-standard-label'"
                                    >
                                      {bTitles &&
                                        bTitles.map((bTitle, index) => (
                                          <MenuItem
                                            key={index}
                                            value={bTitle.id}
                                          >
                                            {bTitle.bTitle}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="btitleM"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.btitleM
                                    ? errors.btitleM.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bFName") ? true : false) ||
                                  // (router.query.bFName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="firstName" required />
                                }
                                // label={<FormattedLabel id="firstName" />}
                                disabled={disabled}
                                variant="standard"
                                {...register('bfNameM')}
                                error={!!errors.bfNameM}
                                helperText={
                                  errors?.bfNameM
                                    ? errors.bfNameM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bMName") ? true : false) ||
                                  // (router.query.bMName ? true : false),
                                }}
                                id="standard-basic"
                                // label={<FormattedLabel id="middleName" />}
                                disabled={disabled}
                                label={
                                  <FormattedLabel id="middleName" required />
                                }
                                variant="standard"
                                {...register('bmNameM')}
                                error={!!errors.bmNameM}
                                helperText={
                                  errors?.bmNameM
                                    ? errors.bmNameM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bLName") ? true : false) ||
                                  // (router.query.bLName ? true : false),
                                }}
                                id="standard-basic"
                                // label={<FormattedLabel id="lastName" />}
                                disabled={disabled}
                                label={
                                  <FormattedLabel id="lastName" required />
                                }
                                variant="standard"
                                {...register('blNameM')}
                                error={!!errors.blNameM}
                                helperText={
                                  errors?.blNameM
                                    ? errors.blNameM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                variant="standard"
                                error={!!errors.btitleMar}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="titlemr" required />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled={true}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        setValue('btitle', value.target.value)
                                      }}
                                      label="Title *"
                                      id="demo-simple-select-standard"
                                      labelId="id='demo-simple-select-standard-label'"
                                    >
                                      {bTitleMars &&
                                        bTitleMars.map((bTitleMar, index) => (
                                          <MenuItem
                                            key={index}
                                            value={bTitleMar.id}
                                          >
                                            {bTitleMar.bTitleMar}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="btitleMar"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.btitleMar
                                    ? errors.btitleMar.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>
                            <div>
                              <TextField
                                id="standard-basic"
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bFNameMr") ? true : false) ||
                                  // (router.query.bFNameMr ? true : false),
                                }}
                                // label={<FormattedLabel id="firstNameV" />}
                                label={
                                  <FormattedLabel id="firstNamemr" required />
                                }
                                disabled={true}
                                variant="standard"
                                {...register('bfNameMr')}
                                error={!!errors.bfNameMr}
                                helperText={
                                  errors?.bfNameMr
                                    ? errors.bfNameMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                id="standard-basic"
                                // label={<FormattedLabel id="middleNameV" />}
                                disabled={true}
                                label={
                                  <FormattedLabel id="middleNamemr" required />
                                }
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bMNameMr") ? true : false) ||
                                  // (router.query.bMNameMr ? true : false),
                                }}
                                variant="standard"
                                {...register('bmNameMr')}
                                error={!!errors.bmNameMr}
                                helperText={
                                  errors?.bmNameMr
                                    ? errors.bmNameMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                id="standard-basic"
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bLNameMr") ? true : false) ||
                                  // (router.query.bLNameMr ? true : false),
                                }}
                                // label={<FormattedLabel id="lastNameV" />}
                                disabled={true}
                                label={
                                  <FormattedLabel id="lastNamemr" required />
                                }
                                variant="standard"
                                {...register('blNameMr')}
                                error={!!errors.blNameMr}
                                helperText={
                                  errors?.blNameMr
                                    ? errors.blNameMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <FormControl
                                variant="standard"
                                error={!!errors.btitleMarM}
                                sx={{ marginTop: 2 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="titlemr" required />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      disabled={disabled}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value)
                                        setValue('btitleM', value.target.value)
                                      }}
                                      label="Title *"
                                      id="demo-simple-select-standard"
                                      labelId="id='demo-simple-select-standard-label'"
                                    >
                                      {bTitleMars &&
                                        bTitleMars.map((bTitleMar, index) => (
                                          <MenuItem
                                            key={index}
                                            value={bTitleMar.id}
                                          >
                                            {bTitleMar.bTitleMar}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  )}
                                  name="btitleMarM"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.btitleMarM
                                    ? errors.btitleMarM.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </div>
                            <div>
                              <TextField
                                id="standard-basic"
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bFNameMr") ? true : false) ||
                                  // (router.query.bFNameMr ? true : false),
                                }}
                                // label={<FormattedLabel id="firstNameV" />}
                                label={
                                  <FormattedLabel id="firstNamemr" required />
                                }
                                disabled={disabled}
                                variant="standard"
                                {...register('bfNameMrM')}
                                error={!!errors.bfNameMrM}
                                helperText={
                                  errors?.bfNameMrM
                                    ? errors.bfNameMrM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                id="standard-basic"
                                // label={<FormattedLabel id="middleNameV" />}
                                disabled={disabled}
                                label={
                                  <FormattedLabel id="middleNamemr" required />
                                }
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bMNameMr") ? true : false) ||
                                  // (router.query.bMNameMr ? true : false),
                                }}
                                variant="standard"
                                {...register('bmNameMrM')}
                                error={!!errors.bmNameMrM}
                                helperText={
                                  errors?.bmNameMrM
                                    ? errors.bmNameMrM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                id="standard-basic"
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bLNameMr") ? true : false) ||
                                  // (router.query.bLNameMr ? true : false),
                                }}
                                // label={<FormattedLabel id="lastNameV" />}
                                disabled={disabled}
                                label={
                                  <FormattedLabel id="lastNamemr" required />
                                }
                                variant="standard"
                                {...register('blNameMrM')}
                                error={!!errors.blNameMrM}
                                helperText={
                                  errors?.blNameMrM
                                    ? errors.blNameMrM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bBuildingNo") ? true : false) ||
                                  // (router.query.bBuildingNo ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNo"
                                    required
                                  />
                                }
                                disabled={true}
                                variant="standard"
                                {...register('bbuildingNo')}
                                error={!!errors.bbuildingNo}
                                helperText={
                                  errors?.bbuildingNo
                                    ? errors.bbuildingNo.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                //   InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bBuildingName") ? true : false) ||
                                  // (router.query.bBuildingName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="buildingName" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('bbuildingName')}
                                error={!!errors.bbuildingName}
                                helperText={
                                  errors?.bbuildingName
                                    ? errors.bbuildingName.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                //  InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bRoadName") ? true : false) ||
                                  // (router.query.bRoadName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="roadName" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('broadName')}
                                error={!!errors.broadName}
                                helperText={
                                  errors?.broadName
                                    ? errors.broadName.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bLandmark") ? true : false) ||
                                  // (router.query.bLandmark ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmark" required />
                                }
                                disabled={true}
                                variant="standard"
                                {...register('blandmark')}
                                error={!!errors.blandmark}
                                helperText={
                                  errors?.blandmark
                                    ? errors.blandmark.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bBuildingNo") ? true : false) ||
                                  // (router.query.bBuildingNo ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNo"
                                    required
                                  />
                                }
                                disabled={disabled}
                                variant="standard"
                                {...register('bbuildingNoM')}
                                error={!!errors.bbuildingNoM}
                                helperText={
                                  errors?.bbuildingNoM
                                    ? errors.bbuildingNoM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                //   InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bBuildingName") ? true : false) ||
                                  // (router.query.bBuildingName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="buildingName" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('bbuildingNameM')}
                                error={!!errors.bbuildingNameM}
                                helperText={
                                  errors?.bbuildingNameM
                                    ? errors.bbuildingNameM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                //  InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bRoadName") ? true : false) ||
                                  // (router.query.bRoadName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="roadName" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('broadNameM')}
                                error={!!errors.broadNameM}
                                helperText={
                                  errors?.broadNameM
                                    ? errors.broadNameM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bLandmark") ? true : false) ||
                                  // (router.query.bLandmark ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmark" required />
                                }
                                disabled={disabled}
                                variant="standard"
                                {...register('blandmarkM')}
                                error={!!errors.blandmarkM}
                                helperText={
                                  errors?.blandmarkM
                                    ? errors.blandmarkM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bBuildingNoMr") ? true : false) ||
                                  // (router.query.bBuildingNoMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNomr"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('bbuildingNoMr')}
                                error={!!errors.bbuildingNoMr}
                                helperText={
                                  errors?.bbuildingNoMr
                                    ? errors.bbuildingNoMr.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                //   InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bBuildingNameMr") ? true : false) ||
                                  // (router.query.bBuildingNameMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="buildingNamemr"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('bbuildingNameMr')}
                                error={!!errors.bbuildingNameMr}
                                helperText={
                                  errors?.bbuildingNameMr
                                    ? errors.bbuildingNameMr.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                //  InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bRoadNameMr") ? true : false) ||
                                  // (router.query.bRoadNameMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="roadNamemr" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('broadNameMr')}
                                error={!!errors.broadNameMr}
                                helperText={
                                  errors?.broadNameMr
                                    ? errors.broadNameMr.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bLandmarkMr") ? true : false) ||
                                  // (router.query.bLandmarkMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmarkmr" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('blandmarkMr')}
                                error={!!errors.blandmarkMr}
                                helperText={
                                  errors?.blandmarkMr
                                    ? errors.blandmarkMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bBuildingNoMr") ? true : false) ||
                                  // (router.query.bBuildingNoMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="flatBuildingNomr"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('bbuildingNoMrM')}
                                error={!!errors.bbuildingNoMrM}
                                helperText={
                                  errors?.bbuildingNoMrM
                                    ? errors.bbuildingNoMrM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                //   InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bBuildingNameMr") ? true : false) ||
                                  // (router.query.bBuildingNameMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel
                                    id="buildingNamemr"
                                    required
                                  />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('bbuildingNameMrM')}
                                error={!!errors.bbuildingNameMrM}
                                helperText={
                                  errors?.bbuildingNameMrM
                                    ? errors.bbuildingNameMrM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                //  InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bRoadNameMr") ? true : false) ||
                                  // (router.query.bRoadNameMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="roadNamemr" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('broadNameMrM')}
                                error={!!errors.broadNameMrM}
                                helperText={
                                  errors?.broadNameMrM
                                    ? errors.broadNameMrM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bLandmarkMr") ? true : false) ||
                                  // (router.query.bLandmarkMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="Landmarkmr" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('blandmarkMrM')}
                                error={!!errors.blandmarkMrM}
                                helperText={
                                  errors?.blandmarkMrM
                                    ? errors.blandmarkMrM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                //   InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bCityName") ? true : false) ||
                                  // (router.query.bCityName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityName" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('bcityName')}
                                error={!!errors.bcityName}
                                helperText={
                                  errors?.bcityName
                                    ? errors.bcityName.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bState") ? true : false) ||
                                  // (router.query.bState ? true : false),
                                }}
                                id="standard-basic"
                                label={<FormattedLabel id="state" required />}
                                disabled={true}
                                variant="standard"
                                {...register('bstate')}
                                error={!!errors.bstate}
                                helperText={
                                  errors?.bstate ? errors.bstate.message : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                //   InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bCityNameMr") ? true : false) ||
                                  // (router.query.bCityNameMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityNamemr" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('bcityNameMr')}
                                error={!!errors.bcityNameMr}
                                helperText={
                                  errors?.bcityNameMr
                                    ? errors.bcityNameMr.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bStateMr") ? true : false) ||
                                  // (router.query.bStateMr ? true : false),
                                }}
                                id="standard-basic"
                                label={<FormattedLabel id="statemr" required />}
                                disabled={true}
                                variant="standard"
                                {...register('bstateMr')}
                                error={!!errors.bstateMr}
                                helperText={
                                  errors?.bstateMr
                                    ? errors.bstateMr.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                //   InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bCityName") ? true : false) ||
                                  // (router.query.bCityName ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityName" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('bcityNameM')}
                                error={!!errors.bcityNameM}
                                helperText={
                                  errors?.bcityNameM
                                    ? errors.bcityNameM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bState") ? true : false) ||
                                  // (router.query.bState ? true : false),
                                }}
                                id="standard-basic"
                                label={<FormattedLabel id="state" required />}
                                disabled={disabled}
                                variant="standard"
                                {...register('bstateM')}
                                error={!!errors.bstateM}
                                helperText={
                                  errors?.bstateM
                                    ? errors.bstateM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                //   InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bCityNameMr") ? true : false) ||
                                  // (router.query.bCityNameMr ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="cityNamemr" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('bcityNameMrM')}
                                error={!!errors.bcityNameMrM}
                                helperText={
                                  errors?.bcityNameMrM
                                    ? errors.bcityNameMrM.message
                                    : null
                                }
                              />
                            </div>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bStateMr") ? true : false) ||
                                  // (router.query.bStateMr ? true : false),
                                }}
                                id="standard-basic"
                                label={<FormattedLabel id="statemr" required />}
                                disabled={disabled}
                                variant="standard"
                                {...register('bstateMrM')}
                                error={!!errors.bstateMrM}
                                helperText={
                                  errors?.bstateMrM
                                    ? errors.bstateMrM.message
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="oldLabel" />
                                {/* Old Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bPincode") ? true : false) ||
                                  // (router.query.bPincode ? true : false),
                                }}
                                id="standard-basic"
                                disabled={true}
                                label={<FormattedLabel id="pincode" required />}
                                variant="standard"
                                {...register('bpincode')}
                                error={!!errors.bpincode}
                                helperText={
                                  errors?.bpincode
                                    ? errors.bpincode.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink:
                                    (watch('bmobileNo') ? true : false) ||
                                    (router.query.bmobileNo ? true : false),
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="mobileNo" required />
                                }
                                variant="standard"
                                disabled={true}
                                {...register('bmobileNo')}
                                error={!!errors.bmobileNo}
                                helperText={
                                  errors?.bmobileNo
                                    ? errors.bmobileNo.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="newLabel" />
                                {/* New Values*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                  // (watch("bPincode") ? true : false) ||
                                  // (router.query.bPincode ? true : false),
                                }}
                                id="standard-basic"
                                disabled={disabled}
                                label={<FormattedLabel id="pincode" required />}
                                variant="standard"
                                {...register('bpincodeM')}
                                error={!!errors.bpincodeM}
                                helperText={
                                  errors?.bpincodeM
                                    ? errors.bpincodeM.message
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <TextField
                                // InputLabelProps={{ shrink: true }}
                                InputLabelProps={{
                                  shrink: temp,
                                }}
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="mobileNo" required />
                                }
                                variant="standard"
                                disabled={disabled}
                                {...register('bmobileNoM')}
                                error={!!errors.bmobileNoM}
                                helperText={
                                  errors?.bmobileNoM
                                    ? errors.bmobileNoM.message
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  )}
                  {!props.preview && (
                    <>
                      <Accordion
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
                          expandIcon={
                            <ExpandMoreIcon sx={{ color: 'white' }} />
                          }
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          backgroundColor="#0070f3"
                          // sx={{
                          //   backgroundColor: '0070f3',
                          // }}
                        >
                          <Typography>
                            {' '}
                            <FormattedLabel id="documentsUpload" />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="gDoc" />
                                {/* Groom Documents*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div style={{ marginTop: '20px' }}>
                              <Typography>Identity Proof </Typography>

                              <UploadButton
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues('gidDocument')}
                                fileKey={'gidDocument'}
                                showDel={pageMode ? false : true}

                                // showDel={true}
                              />
                            </div>

                            <div style={{ marginTop: '20px' }}>
                              <Typography>Residential proof </Typography>
                              <UploadButton
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues('gresidentialProofDocument')}
                                fileKey={'gresidentialProofDocument'}
                                showDel={pageMode ? false : true}

                                // showDel={true}
                              />
                            </div>

                            <div style={{ marginTop: '20px' }}>
                              <Typography>Age proof </Typography>
                              <UploadButton
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues('gageProofDocument')}
                                fileKey={'gageProofDocument'}
                                showDel={pageMode ? false : true}

                                // showDel={true}
                              />
                            </div>
                          </div>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >
                                <FormattedLabel id="bDoc" />
                                {/* Bride Documents*/}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.row}>
                            <div style={{ marginTop: '20px' }}>
                              <Typography>Identity Proof </Typography>

                              <UploadButton
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues('bidDocument')}
                                fileKey={'bidDocument'}
                                showDel={pageMode ? false : true}

                                // showDel={true}
                              />
                            </div>

                            <div style={{ marginTop: '20px' }}>
                              <Typography>Residential proof </Typography>
                              <UploadButton
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues('bresidentialDocument')}
                                fileKey={'bresidentialDocument'}
                                showDel={pageMode ? false : true}

                                // showDel={true}
                              />
                            </div>

                            <div style={{ marginTop: '20px' }}>
                              <Typography>Age proof </Typography>
                              <UploadButton
                                appName={appName}
                                serviceName={serviceName}
                                fileDtl={getValues('bageProofDocument')}
                                fileKey={'bageProofDocument'}
                                showDel={pageMode ? false : true}

                                // showDel={true}
                              />
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  )}
                  {!props.preview && !props.onlyDoc && (
                    <>
                      <div className={styles.btn}>
                        <div className={styles.btn1}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                            onClick={handleApply}
                          >
                            {<FormattedLabel id="save" />}
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
                                text:
                                  'Are you sure you want to exit this Record ? ',
                                icon: 'warning',
                                buttons: true,
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) {
                                  swal('Record is Successfully Exit!', {
                                    icon: 'success',
                                  })
                                  router.push(
                                    `/marriageRegistration/transactions/modificationInMarriageCertificate`,
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
                    </>
                  )}
                </Paper>
              ) : (
                ''
              )}
            </>
          </ThemeProvider>
        </FormProvider>
      </div>
    </div>
  )
}

export default Index
