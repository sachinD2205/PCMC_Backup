import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import router from 'next/router'

import styles from './view.module.css'
import { Add, Clear, Delete, Edit, ExitToApp, Save } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Head from 'next/head'
import sweetAlert from 'sweetalert'
// import URLS from '../../../components/townPlanning/urls'
import URLS from '../../../URLS/urls'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { useSelector } from 'react-redux'

const NewIndex = () => {
  let schema = yup.object().shape({
    villageKey: yup.string().required('Please select a department name.'),
    landReservationName: yup.string().required('Please select a service name.'),
    gatName: yup.string().required('Please enter remark in Marathi.'),
    surveyNo: yup.string().required('Please select type.'),
    citySurveyNo: yup.string().required('Please enter remark in Marathi.'),
    resrvationArea: yup.string().required('Please enter remark in Marathi.'),
    landReservationLegend: yup
      .string()
      .required('Please enter remark in English.'),
    landInPossession: yup.string().required('Please enter remark in Marathi.'),
    landNotInPossession: yup
      .string()
      .required('Please enter remark in Marathi.'),
  })
  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  let isDisabled = false
  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

  const [ID, setID] = useState(null)
  const [villageNameDropDown, setVillageNameDropDown] = useState([
    {
      id: 1,
      villageNameEn: '',
      villageNameMr: '',
    },
  ])
  const [gatDropDown, setGatDropDown] = useState([
    {
      id: 1,
      gatNameEn: '',
      gatNameMr: '',
    },
  ])

  const [landReservationNameDropDown, setLandReservationNameDropDown] =
    useState([
      {
        id: 1,
        reservationNameEn: '',
        reservationNameMr: '',
      },
    ])
  const [table, setTable] = useState([])
  const [collapse, setCollapse] = useState(false)
  const [runAgain, setRunAgain] = useState(false)

  useEffect(() => {
    setRunAgain(false)

    //Village
    // axios.get(`${URLS.CFCURL}/master/village/getAll`).then((r) => {
    axios.get(`${URLS.CFCURL}/master/village/getAll`).then((r) => {
      console.log('Village data: ', r.data.village)
      setVillageNameDropDown(
        // @ts-ignore
        r.data.village.map((j, i) => ({
          id: j.id,
          villageNameEn: j.villageName,
          villageNameMr: j.villageNameMr,
        }))
      )
    })

    //Gat
    axios.get(`${URLS.CFCURL}/master/gatMaster/getAll`).then((r) => {
      console.log('Gat data:', r.data.gatMaster)
      setGatDropDown(
        r.data.gatMaster.map((j, i) => ({
          id: j.id,
          gatNameEn: j.gatNameEn,
          gatNameMr: j.gatNameMr,
        }))
      )
    })

    //Land Reservation
    // axios.get(`${URLS.BaseURL}/landReservationMaster/getAll`).then((r) => {
    axios.get(`${URLS.TPURL}/landReservationMaster/getAll`).then((r) => {
      console.log('Land Reservation data:', r.data)
      setLandReservationNameDropDown(
        r.data.map((j, i) => ({
          id: j.id,
          reservationNameEn: j.reservationNameEng,
          reservationNameMr: j.reservationNameMr,
        }))
      )
    })
  }, [])

  //Table
  useEffect(() => {
    axios
      .get(`${URLS.TPURL}/villageWiseLandReservationEntryMaster/getAll`)
      .then((r) => {
        console.log('Table:', r.data)
        setTable(
          r.data.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            surveyNo: j.surveyNo,
            citySurveyNo: j.citySurveyNo,
            resrvationArea: j.resrvationArea,
            landReservationLegend: j.landReservationLegend,
            landInPossession: j.landInPossession,
            landNotInPossession: j.landNotInPossession,
            villageNameEn: villageNameDropDown.find(
              (arg) => arg.id === j.villageKey
            )?.villageNameEn,
            villageNameMr: villageNameDropDown.find(
              (arg) => arg.id === j.villageKey
            )?.villageNameMr,
            landReservationNameEn: landReservationNameDropDown?.find(
              (obj) => obj?.id === j.landReservationName
            )?.reservationNameEn,
            landReservationNameMr: landReservationNameDropDown?.find(
              (obj) => obj?.id === j.landReservationName
            )?.reservationNameMr,
            gatNameEn: gatDropDown.find((obj) => obj?.id === j.gatName)
              ?.gatNameEn,
            gatNameMr: gatDropDown.find((obj) => obj?.id === j.gatName)
              ?.gatNameMr,
          }))
        )
      })
  }, [runAgain, villageNameDropDown, landReservationNameDropDown, gatDropDown])

  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      width: 70,
    },
    {
      field: language === 'en' ? 'villageNameEn' : 'villageNameMr',
      headerName: <FormattedLabel id='villageName' />,
      width: 120,
    },
    {
      field:
        language === 'en' ? 'landReservationNameEn' : 'landReservationNameMr',
      headerName: <FormattedLabel id='landReservationName' />,
      width: 200,
    },
    {
      field: language === 'en' ? 'gatNameEn' : 'gatNameMr',
      headerName: <FormattedLabel id='gatName' />,
      width: 100,
    },
    {
      field: 'surveyNo',
      headerName: <FormattedLabel id='surveyNumber' />,
      width: 100,
    },
    {
      field: 'citySurveyNo',
      headerName: <FormattedLabel id='citySurveyNo' />,
      width: 120,
    },
    {
      field: 'resrvationArea',
      headerName: <FormattedLabel id='reservationNo' />,
      width: 150,
    },
    {
      field: 'landReservationLegend',
      headerName: <FormattedLabel id='landReservationLegend' />,
      width: 200,
    },
    {
      field: 'landInPossession',
      headerName: <FormattedLabel id='landInPossessionInHector' />,
      width: 250,
    },
    {
      field: 'landNotInPossession',
      headerName: <FormattedLabel id='landNotInPossessionInHector' />,
      width: 250,
    },

    {
      field: 'action',
      headerName: <FormattedLabel id='actions' />,
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={collapse}
              onClick={() => editById(params.row)}
            >
              <Edit />
            </IconButton>
            <IconButton
              disabled={collapse}
              onClick={() => deleteById(params.id)}
            >
              <Delete />
            </IconButton>
          </>
        )
      },
    },
  ]

  const editById = (values) => {
    setID(values.id)

    const villageID = villageNameDropDown.find(
      // @ts-ignore
      (obj) => obj?.deptName === values.deptName
      // @ts-ignore
    )?.id
    const gatID = gatDropDown.find(
      // @ts-ignore
      (obj) => obj?.gatName === values.gatName
      // @ts-ignore
    )?.id
    const landID = landReservationNameDropDown.find(
      // @ts-ignore
      (obj) => obj?.serviceName === values.serviceName
      // @ts-ignore
    )?.id

    reset({
      ...values,
      villageKey: villageID,
      landReservationName: landID,
      gatName: gatID,
    })
    setCollapse(true)
  }

  const deleteById = async (id) => {
    sweetAlert({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${URLS.TPURL}/villageWiseLandReservationEntryMaster/delete/${id}`
          )
          .then((res) => {
            if (res.status == 226) {
              sweetAlert('Deleted!', 'Record Deleted successfully !', 'success')
              setRunAgain(true)
            }
          })
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
      console.log('Final URL: ', backUrl)
      router.push(`${backUrl}`)
    } else {
      router.push('/dashboard')
    }
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    villageKey: '',
    landReservationName: '',
    gatName: '',
    surveyNo: '',
    citySurveyNo: '',
    resrvationArea: '',
    landReservationLegend: '',
    landInPossession: '',
    landNotInPossession: '',
  }

  const cancellButton = () => {
    reset({
      id: ID,
      ...resetValuesCancell,
    })
  }

  const onSubmit = async (data) => {
    console.log('Form Data: ', data)

    const bodyForAPI = {
      ...data,
    }

    console.log('Sagla data append kelya nantr: ', bodyForAPI)

    await axios
      .post(
        `${URLS.TPURL}/villageWiseLandReservationEntryMaster/save`,
        bodyForAPI
      )
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (data.id) {
            sweetAlert('Updated!', 'Record Updated successfully !', 'success')
          } else {
            sweetAlert('Saved!', 'Record Saved successfully !', 'success')
          }
          setRunAgain(true)
          reset({ ...resetValuesCancell, id: null })
          setCollapse(false)
        }
      })
  }

  return (
    <>
      <Head>
        <title>Village Wise Land Reservation Entry</title>
      </Head>
      <div className={styles.main}>
        {/* <Divider orientation='left' style={{ marginBottom: '2%' }}>
            <h3>Approval/Rejection Remarks</h3>
          </Divider> */}
        <Button
          sx={{ marginBottom: 2, marginLeft: 5 }}
          onClick={() => {
            if (!collapse) {
              setCollapse(true)
            } else {
              setCollapse(false)
            }
          }}
          variant='contained'
          endIcon={<Add />}
        >
          <FormattedLabel id='add' />
        </Button>
        <Paper style={{ padding: '3% 3%' }}>
          {collapse && (
            <Slide direction='down' in={collapse} mountOnEnter unmountOnExit>
              <div style={{ padding: '3% 3%' }}>
                <>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                        }}
                      >
                        <FormControl
                          sx={{
                            marginTop: '2%',
                          }}
                          variant='standard'
                          error={!!errors.villageKey}
                        >
                          <InputLabel
                            id='demo-simple-select-standard-label'
                            disabled={isDisabled}
                          >
                            <FormattedLabel id='villageName' required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: '250px' }}
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.villageKey
                                    ? router.query.villageKey
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label='villageKey'
                              >
                                {villageNameDropDown &&
                                  villageNameDropDown.map((value, index) => (
                                    <MenuItem key={index} value={value?.id}>
                                      {language === 'en'
                                        ? value?.villageNameEn
                                        : value?.villageNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='villageKey'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.villageKey
                              ? errors.villageKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                        <FormControl
                          sx={{ width: '250px', marginTop: '2%' }}
                          variant='standard'
                          error={!!errors.landReservationName}
                        >
                          <InputLabel
                            id='demo-simple-select-standard-label'
                            disabled={isDisabled}
                          >
                            <FormattedLabel id='landReservationName' required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: '250px' }}
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                disabled={isDisabled}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='landReservationName'
                              >
                                {landReservationNameDropDown &&
                                  landReservationNameDropDown.map(
                                    (value, index) => (
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
                                    )
                                  )}
                              </Select>
                            )}
                            name='landReservationName'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.landReservationName
                              ? errors.landReservationName.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                        <FormControl
                          sx={{ width: '250px', marginTop: '2%' }}
                          variant='standard'
                          error={!!errors.gatName}
                        >
                          <InputLabel
                            id='demo-simple-select-standard-label'
                            disabled={isDisabled}
                          >
                            <FormattedLabel id='gatName' required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: '250px' }}
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.gatName
                                    ? router.query.gatName
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label='gatName'
                              >
                                {gatDropDown &&
                                  gatDropDown.map((value, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        // @ts-ignore
                                        value?.id
                                      }
                                    >
                                      {
                                        // @ts-ignore
                                        value?.gatNameEn
                                      }
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='gatName'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.gatName ? errors.gatName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div
                        className={styles.row}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <TextField
                          sx={{
                            width: '250px',
                            // marginRight: '5%',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={<FormattedLabel id='surveyNumber' required />}
                          variant='standard'
                          {...register('surveyNo')}
                          error={!!errors.surveyNo}
                          helperText={
                            errors?.surveyNo ? errors.surveyNo.message : null
                          }
                          disabled={isDisabled}
                          defaultValue={
                            router.query.surveyNo ? router.query.surveyNo : ''
                          }
                        />
                        <TextField
                          sx={{
                            width: '250px',
                            // marginRight: '5%',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={<FormattedLabel id='citySurveyNo' required />}
                          variant='standard'
                          {...register('citySurveyNo')}
                          error={!!errors.citySurveyNo}
                          helperText={
                            errors?.citySurveyNo
                              ? errors.citySurveyNo.message
                              : null
                          }
                          disabled={isDisabled}
                          defaultValue={
                            router.query.citySurveyNo
                              ? router.query.citySurveyNo
                              : ''
                          }
                        />
                        <TextField
                          sx={{
                            width: '250px',
                            // marginRight: '5%',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={<FormattedLabel id='reservationNo' required />}
                          variant='standard'
                          {...register('resrvationArea')}
                          error={!!errors.resrvationArea}
                          helperText={
                            errors?.resrvationArea
                              ? errors.resrvationArea.message
                              : null
                          }
                          disabled={isDisabled}
                          defaultValue={
                            router.query.resrvationArea
                              ? router.query.resrvationArea
                              : ''
                          }
                        />
                      </div>
                      <div
                        className={styles.row}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <TextField
                          sx={{
                            width: '250px',
                            // marginRight: '5%',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel
                              id='landReservationLegend'
                              required
                            />
                          }
                          variant='standard'
                          {...register('landReservationLegend')}
                          error={!!errors.landReservationLegend}
                          helperText={
                            errors?.landReservationLegend
                              ? errors.landReservationLegend.message
                              : null
                          }
                          disabled={isDisabled}
                          defaultValue={
                            router.query.landReservationLegend
                              ? router.query.landReservationLegend
                              : ''
                          }
                        />
                        <TextField
                          sx={{
                            width: '250px',
                            // marginRight: '5%',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel
                              id='landInPossessionInHector'
                              required
                            />
                          }
                          variant='standard'
                          {...register('landInPossession')}
                          error={!!errors.landInPossession}
                          helperText={
                            errors?.landInPossession
                              ? errors.landInPossession.message
                              : null
                          }
                          disabled={isDisabled}
                          defaultValue={
                            router.query.landInPossession
                              ? router.query.landInPossession
                              : ''
                          }
                        />
                        <TextField
                          sx={{
                            width: '270px',
                            // marginRight: '5%',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel
                              id='landNotInPossessionInHector'
                              required
                            />
                          }
                          variant='standard'
                          {...register('landNotInPossession')}
                          error={!!errors.landNotInPossession}
                          helperText={
                            errors?.landNotInPossession
                              ? errors.landNotInPossession.message
                              : null
                          }
                          disabled={isDisabled}
                          defaultValue={
                            router.query.landNotInPossession
                              ? router.query.landNotInPossession
                              : ''
                          }
                        />
                      </div>
                      <div className={styles.buttons}>
                        <Button
                          variant='contained'
                          type='submit'
                          endIcon={<Save />}
                        >
                          <FormattedLabel id='save' />
                        </Button>
                        <Button
                          variant='outlined'
                          color='error'
                          endIcon={<Clear />}
                          onClick={cancellButton}
                        >
                          <FormattedLabel id='clear' />
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          onClick={onBack}
                          endIcon={<ExitToApp />}
                        >
                          <FormattedLabel id='exit' />
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </>
              </div>
            </Slide>
          )}

          <div
            className={styles.table}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <DataGrid
              sx={{
                marginTop: '5vh',
                marginBottom: '3vh',
                // height: 370.5,
                width: 1005,
              }}
              autoHeight
              rows={table}
              //@ts-ignore
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>
        </Paper>
      </div>
    </>
  )
}

export default NewIndex
