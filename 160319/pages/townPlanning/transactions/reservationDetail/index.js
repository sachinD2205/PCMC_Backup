import React, { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from '../../masters/view.module.css'
import router from 'next/router'
import sweetAlert from 'sweetalert'
import {
  Button,
  TextField,
  Card,
  Box,
  IconButton,
  Slide,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Head from 'next/head'
import axios from 'axios'
import URLS from '../../../../URLS/urls'
import { Clear, Delete, Edit, ExitToApp, Save, Add } from '@mui/icons-material'
import { useState } from 'react'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { useSelector } from 'react-redux'

let schema = yup.object().shape({
  landReservationNo: yup.string().required('Please enter a reservation number'),
  landReservationLegend: yup.string().required('Please enter a legend'),
  // reservationNameEn: yup.string().required('Please enter a name in english'),
  // reservationNameMr: yup.string().required('Please enter name in marathi'),
  surveyNo: yup.string().required('Please enter a survey number'),
  zone: yup.string().required('Please select a zone'),
  village: yup.string().required('Please enter a village'),
  // electoralWard: yup.string().required('Please enter an electoral ward'),
  reservationAreaInHector: yup
    .string()
    .required('Please enter reservation area'),
  landUnderPossession: yup
    .string()
    .required('Please enter area of land under possession'),
  landNotUnderPossession: yup
    .string()
    .required('Please enter area of land not under possession'),
  appropriateAuthority: yup
    .string()
    .required('Please enter the name of appropriate authority'),
  remark: yup.string().required('Please enter a remark'),
})

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    // @ts-ignore
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  let isDisabled = false
  const [ID, setID] = useState(null)
  const [runAgain, setRunAgain] = useState(false)
  const [collapse, setCollapse] = useState(false)
  const [legend, setLegend] = useState('')
  const [landReservationTable, setLandReservationTable] = useState([])
  const [legendDropDown, setLegendDropDown] = useState([])
  const [villageDropDown, setVillageNameDropDown] = useState([])
  const [zoneDropDown, setzoneDropDown] = useState([])
  const [appropriateAuthorityDropDown, setAppropriateAuthorityDropDown] =
    useState([])

  useEffect(() => {
    //Village
    axios.get(`${URLS.CFCURL}/master/village/getAll`).then((r) => {
      console.log('Village data: ', r.data)
      setVillageNameDropDown(
        r.data.village.map((j) => ({
          id: j.id,
          villageNameEn: j.villageName,
          villageNameMr: j.villageNameMr,
        }))
      )
    })

    //Zone
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((r) => {
      console.log('Zone data:', r.data)
      setzoneDropDown(
        // @ts-ignore
        r.data.zone.map((j, i) => ({
          id: j.id,
          zoneNameEn: j.zoneName,
          zoneNameMr: j.zoneNameMr,
        }))
      )
    })

    //Legend
    axios.get(`${URLS.TPURL}/reservationTypeMaster/getAll`).then((res) => {
      console.log('Reservation Type Master: ', res.data.reservationType)
      setLegendDropDown(
        res.data.reservationType.map((j, i) => ({
          srNo: i + 1,
          ...j,
        }))
      )
    })

    //Appropriate Authority
    axios.get(`${URLS.TPURL}/appropriateAuthorityMaster/getAll`).then((res) => {
      console.log('Authority Master: ', res.data.appropriateAuthority)
      setAppropriateAuthorityDropDown(
        res.data.appropriateAuthority.map((j, i) => ({
          srNo: i + 1,
          ...j,
        }))
      )
    })
  }, [])

  useEffect(() => {
    setRunAgain(false)

    axios.get(`${URLS.TPURL}/landReservationMaster/getAll`).then((r) => {
      console.log('Table data: ', r.data)
      setLandReservationTable(
        r.data.map((j, i) => ({
          id: j.id,
          srNo: i + 1,
          ...j,
          legend: legendDropDown?.find((obj) => {
            // @ts-ignore
            return obj.id === j.landReservationLegend
            // @ts-ignore
          })?.legend,
          reservationNameEn: legendDropDown?.find((obj) => {
            // @ts-ignore
            return obj.id === j.landReservationLegend
            // @ts-ignore
          })?.reservationNameEn,
          reservationNameMr: legendDropDown?.find((obj) => {
            // @ts-ignore
            return obj.id === j.landReservationLegend
            // @ts-ignore
          })?.reservationNameMr,
          zoneNameEn: zoneDropDown.find((obj) => {
            // @ts-ignore
            return obj.id === j.zone
            // @ts-ignore
          })?.zoneNameEn,
          zoneNameMr: zoneDropDown.find((obj) => {
            // @ts-ignore
            return obj.id === j.zone
            // @ts-ignore
          })?.zoneNameMr,
          villageNameEn: villageDropDown.find((obj) => {
            // @ts-ignore
            return obj.id === j.village
            // @ts-ignore
          })?.villageNameEn,
          villageNameMr: villageDropDown.find((obj) => {
            // @ts-ignore
            return obj.id === j.village
            // @ts-ignore
          })?.villageNameMr,
          appropriateAuthorityEn: appropriateAuthorityDropDown.find((obj) => {
            // @ts-ignore
            return obj.id === j.appropriateAuthority
            // @ts-ignore
          })?.authorityNameEn,
          appropriateAuthorityMr: appropriateAuthorityDropDown.find((obj) => {
            // @ts-ignore
            return obj.id === j.appropriateAuthority
            // @ts-ignore
          })?.authorityNameMr,
        }))
      )
    })
  }, [runAgain, legendDropDown])

  const onSubmit = async (data) => {
    console.log('Data for submitting: ', data)
    const bodyForAPI = {
      ...data,
    }

    await axios
      .post(`${URLS.TPURL}/landReservationMaster/save`, bodyForAPI)
      .then((response) => {
        if (response.status === 201) {
          if (data.id) {
            sweetAlert('Updated!', 'Record Updated successfully !', 'success')
          } else {
            sweetAlert('Saved!', 'Record Saved successfully !', 'success')
          }
          setRunAgain(true)
          reset({
            ...resetValuesCancell,
            id: null,
          })
          setCollapse(false)
        }
      })
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
          .delete(`${URLS.TPURL}/landReservationMaster/delete/${id}`)
          .then((res) => {
            if (res.status == 226) {
              sweetAlert('Deleted!', 'Record Deleted successfully !', 'success')
              setRunAgain(true)
            }
          })
      }
    })
  }

  const columns = [
    {
      field: 'srNo',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 85,
    },
    {
      field: 'landReservationNo',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='landReservationNo' />,
      width: 250,
    },
    {
      field: 'legend',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='landReservationLegend' />,
      width: 250,
    },
    {
      field: language === 'en' ? 'reservationNameEn' : 'reservationNameMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='reservationName' />,
      width: 200,
    },
    {
      field: 'surveyNo',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='surveyNo' />,
      width: 150,
    },
    {
      field: language === 'en' ? 'zoneNameEn' : 'zoneNameMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='zoneName' />,
      width: 150,
    },
    {
      field: language === 'en' ? 'villageNameEn' : 'villageNameMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='villageName' />,
      width: 180,
    },
    {
      field: 'electoralWard',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='electoralWard' />,
      width: 180,
    },
    {
      field: 'reservationAreaInHector',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='reservationAreaInHector' />,
      width: 280,
    },
    {
      field: 'landUnderPossession',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='landUnderPossession' />,
      width: 250,
    },
    {
      field: 'landNotUnderPossession',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='landNotUnderPossession' />,
      width: 280,
    },
    {
      field:
        language === 'en' ? 'appropriateAuthorityEn' : 'appropriateAuthorityMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='appropriateAuthority' />,
      width: 200,
    },
    {
      field: 'remark',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='remark' />,
      width: 150,
    },
    {
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              disabled={collapse}
              onClick={() => editById(params.row)}
            >
              <Edit />
            </IconButton>
            <IconButton
              disabled={collapse}
              onClick={() => deleteById(params.row.id)}
            >
              <Delete />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  // Reset Values Cancell
  const resetValuesCancell = {
    reservationName: '',
    surveyNumber: '',
    landReservationLegend: '',
    reservationAreaInHector: '',
    landInPossession: '',
    landNotUnderInPossession: '',
    remark: '',
  }

  const editById = (values) => {
    setID(values.id)
    reset({
      ...values,
      landInPossession: values.landInPossession === 'Yes' ? true : false,
    })
    setCollapse(true)
  }

  const cancellButton = () => {
    reset({
      id: ID,
      ...resetValuesCancell,
    })
    setLegend('')
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
        <title>Reservation Detail</title>
      </Head>
      <div className={styles.main}>
        <div className={styles.left}>
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
          <Card style={{ padding: '2% 2%' }}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {collapse && (
                  <Slide
                    direction='down'
                    in={collapse}
                    mountOnEnter
                    unmountOnExit
                  >
                    <div className={styles.fields}>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          columnGap: 85,
                        }}
                      >
                        <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel id='landReservationNo' required />
                          }
                          variant='standard'
                          {...register('landReservationNo')}
                          error={!!errors.landReservationNo}
                          helperText={
                            errors?.landReservationNo
                              ? errors.landReservationNo.message
                              : null
                          }
                        />

                        <FormControl
                          sx={{ width: '230px', marginTop: '2%' }}
                          variant='standard'
                          error={!!errors.landReservationLegend}
                        >
                          <InputLabel
                            id='demo-simple-select-standard-label'
                            disabled={isDisabled}
                          >
                            <FormattedLabel
                              id='landReservationLegend'
                              required
                            />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.landReservationLegend
                                    ? router.query.landReservationLegend
                                    : field.value
                                }
                                onChange={(value) => {
                                  field.onChange(value)
                                  setLegend(value.target.value)
                                }}
                                label='landReservationLegend'
                              >
                                {legendDropDown &&
                                  legendDropDown.map((value, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        // @ts-ignore
                                        value?.id
                                      }
                                    >
                                      {
                                        // @ts-ignore
                                        value?.legend
                                      }
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='landReservationLegend'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.landReservationLegend
                              ? errors.landReservationLegend.message
                              : null}
                          </FormHelperText>
                        </FormControl>

                        <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={<FormattedLabel id='reservationNameEn' />}
                          variant='standard'
                          // {...register('reservationNameEn')}
                          error={!!errors.reservationNameEn}
                          helperText={
                            errors?.reservationNameEn
                              ? errors.reservationNameEn.message
                              : null
                          }
                          // InputLabelProps={{ shrink: legend ? true : false }}
                          disabled
                          value={
                            legend
                              ? legendDropDown.find((obj) => {
                                  // @ts-ignore
                                  return obj?.id === legend
                                  // @ts-ignore
                                })?.reservationNameEn
                              : ''
                          }
                        />
                        <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={<FormattedLabel id='reservationNameMr' />}
                          variant='standard'
                          // {...register('reservationNameMr')}
                          error={!!errors.reservationNameMr}
                          helperText={
                            errors?.reservationNameMr
                              ? errors.reservationNameMr.message
                              : null
                          }
                          // InputLabelProps={{ shrink: legend ? true : false }}
                          disabled
                          value={
                            legend
                              ? legendDropDown.find((obj) => {
                                  // @ts-ignore
                                  return obj?.id === legend
                                  // @ts-ignore
                                })?.reservationNameMr
                              : ''
                          }
                        />

                        <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={<FormattedLabel id='surveyNo' required />}
                          variant='standard'
                          {...register('surveyNo')}
                          error={!!errors.surveyNo}
                          helperText={
                            errors?.surveyNo ? errors.surveyNo.message : null
                          }
                          disabled={isDisabled}
                        />

                        <FormControl
                          sx={{ width: '230px', marginTop: '2%' }}
                          variant='standard'
                          error={!!errors.zone}
                        >
                          <InputLabel
                            id='demo-simple-select-standard-label'
                            disabled={isDisabled}
                          >
                            <FormattedLabel id='zoneName' required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                // value={field.value}
                                disabled={isDisabled}
                                value={
                                  router.query.zone
                                    ? router.query.zone
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label='zone'
                              >
                                {zoneDropDown &&
                                  zoneDropDown.map((value, index) => (
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
                                          ? // @ts-ignore
                                            value?.zoneNameEn
                                          : // @ts-ignore
                                            value?.zoneNameMr
                                      }
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='zone'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.zone ? errors.zone.message : null}
                          </FormHelperText>
                        </FormControl>

                        <FormControl
                          sx={{
                            marginTop: '2%',
                          }}
                          variant='standard'
                          error={!!errors.village}
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
                                sx={{ width: '230px' }}
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                // value={field.value}
                                disabled={isDisabled}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='village'
                              >
                                {villageDropDown &&
                                  villageDropDown.map((value, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        //@ts-ignore
                                        value.id
                                      }
                                    >
                                      {language == 'en'
                                        ? //@ts-ignore
                                          value.villageNameEn
                                        : // @ts-ignore
                                          value?.villageNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='village'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.village ? errors.village.message : null}
                          </FormHelperText>
                        </FormControl>

                        <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          // label='Electoral Ward'
                          label={<FormattedLabel id='electoralWard' />}
                          variant='standard'
                          {...register('electoralWard')}
                          error={!!errors.electoralWard}
                          helperText={
                            errors?.electoralWard
                              ? errors.electoralWard.message
                              : null
                          }
                          disabled={isDisabled}
                        />

                        <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel
                              id='reservationAreaInHector'
                              required
                            />
                          }
                          variant='standard'
                          {...register('reservationAreaInHector')}
                          error={!!errors.reservationAreaInHector}
                          helperText={
                            errors?.reservationAreaInHector
                              ? errors.reservationAreaInHector.message
                              : null
                          }
                          disabled={isDisabled}
                        />

                        <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel id='landUnderPossession' required />
                          }
                          variant='standard'
                          {...register('landUnderPossession')}
                          error={!!errors.landUnderPossession}
                          helperText={
                            errors?.landUnderPossession
                              ? errors.landUnderPossession.message
                              : null
                          }
                          disabled={isDisabled}
                        />
                        <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel
                              id='landNotUnderPossession'
                              required
                            />
                          }
                          variant='standard'
                          {...register('landNotUnderPossession')}
                          error={!!errors.landNotUnderPossession}
                          helperText={
                            errors?.landNotUnderPossession
                              ? errors.landNotUnderPossession.message
                              : null
                          }
                          disabled={isDisabled}
                        />
                        {/* <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel
                              id='appropriateAuthority'
                              required
                            />
                          }
                          variant='standard'
                          {...register('appropriateAuthority')}
                          error={!!errors.appropriateAuthority}
                          helperText={
                            errors?.appropriateAuthority
                              ? errors.appropriateAuthority.message
                              : null
                          }
                          disabled={isDisabled}
                        /> */}

                        <FormControl
                          sx={{
                            marginTop: '2%',
                          }}
                          variant='standard'
                          error={!!errors.appropriateAuthority}
                        >
                          <InputLabel
                            id='demo-simple-select-standard-label'
                            disabled={isDisabled}
                          >
                            <FormattedLabel
                              id='appropriateAuthority'
                              required
                            />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: '230px' }}
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                disabled={isDisabled}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='appropriateAuthority'
                              >
                                {appropriateAuthorityDropDown &&
                                  appropriateAuthorityDropDown.map(
                                    (value, index) => (
                                      <MenuItem
                                        key={index}
                                        value={
                                          //@ts-ignore
                                          value.id
                                        }
                                      >
                                        {language == 'en'
                                          ? //@ts-ignore
                                            value.authorityNameEn
                                          : // @ts-ignore
                                            value?.authorityNameMr}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name='appropriateAuthority'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.appropriateAuthority
                              ? errors.appropriateAuthority.message
                              : null}
                          </FormHelperText>
                        </FormControl>

                        <TextField
                          sx={{
                            width: '230px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={<FormattedLabel id='remark' required />}
                          variant='standard'
                          {...register('remark')}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                          disabled={isDisabled}
                        />
                      </div>

                      <div className={styles.buttons}>
                        <Button
                          sx={{
                            height: '40px',
                          }}
                          variant='contained'
                          type='submit'
                          endIcon={<Save />}
                        >
                          <FormattedLabel id='save' />
                        </Button>
                        <Button
                          sx={{
                            height: '40px',
                          }}
                          variant='outlined'
                          color='error'
                          endIcon={<Clear />}
                          onClick={cancellButton}
                        >
                          <FormattedLabel id='clear' />
                        </Button>
                        <Button
                          sx={{
                            height: '40px',
                          }}
                          variant='contained'
                          color='error'
                          onClick={onBack}
                          endIcon={<ExitToApp />}
                        >
                          <FormattedLabel id='exit' />
                        </Button>
                      </div>
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
                      width: 1005,
                    }}
                    autoHeight
                    rows={landReservationTable}
                    // @ts-ignore
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                  />
                </div>
              </form>
            </FormProvider>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Index
