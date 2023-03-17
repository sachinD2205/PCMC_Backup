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
// import URLS from "../../../components/townPlanning/urls";
import URLS from '../../../URLS/urls'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { useSelector } from 'react-redux'

const Index = () => {
  let schema = yup.object().shape({
    villageKey: yup.string().required('Please select a village name.'),
    gatName: yup.string().required('Please select a gat name.'),
    tdrZoneKey: yup.string().required('Please select zone name.'),
  })
  const {
    // register,
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
  const language = useSelector((state) => state.labels.language)

  const [ID, setID] = useState(null)
  const [villageDropDown, setVillageDropDown] = useState([
    {
      id: 1,
      villageNameEn: '',
      villageNameMr: '',
    },
  ])
  const [gatDropDown, setGatDropDown] = useState([
    { id: 1, gatNameEn: '', gatNameMr: '' },
  ])
  const [zoneDropDown, setzoneDropDown] = useState([
    { id: 1, zoneName: '', zoneNamemar: '' },
  ])
  const [table, setTable] = useState([])
  const [collapse, setCollapse] = useState(false)
  const [runAgain, setRunAgain] = useState(false)

  useEffect(() => {
    setRunAgain(false)

    //Village
    axios.get(`${URLS.CFCURL}/master/village/getAll`).then((r) => {
      setVillageDropDown(
        // @ts-ignore
        r.data.village.map((j) => ({
          id: j.id,
          villageNameEn: j.villageName,
          villageNameMr: j.villageNameMr,
        }))
      )
    })

    //Gat
    axios.get(`${URLS.CFCURL}/master/gatMaster/getAll`).then((r) => {
      setGatDropDown(
        r.data.gatMaster.map((j) => ({
          id: j.id,
          gatNameEn: j.gatNameEn,
          gatNameMr: j.gatNameMr,
        }))
      )
    })

    //Zone
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((r) => {
      setzoneDropDown(
        r.data.zone.map((j) => ({
          id: j.id,
          zoneNameEn: j.zoneName,
          zoneNameMr: j.zoneNameMr,
        }))
      )
    })
  }, [])

  useEffect(() => {
    axios
      .get(`${URLS.TPURL}/tDRZoneGatVillageMappingMaster/getAll`)
      .then((r) => {
        setTable(
          r.data.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            villageNameEn: villageDropDown.find(
              (obj) => obj?.id === j.villageKey
            )?.villageNameEn,
            villageNameMr: villageDropDown.find(
              (obj) => obj?.id === j.villageKey
            )?.villageNameMr,
            gatNameEn: gatDropDown.find((obj) => obj?.id === j.gatName)
              ?.gatNameEn,
            gatNameMr: gatDropDown.find((obj) => obj?.id === j.gatName)
              ?.gatNameMr,
            zoneNameEn: zoneDropDown.find((obj) => obj?.id === j.tdrZoneKey)
              ?.zoneNameEn,
            zoneNameMr: zoneDropDown.find((obj) => obj?.id === j.tdrZoneKey)
              ?.zoneNameMr,
          }))
        )
      })
  }, [runAgain, villageDropDown, gatDropDown, zoneDropDown])

  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      width: 100,
    },
    {
      field: language === 'en' ? 'villageNameEn' : 'villageNameMr',
      headerName: <FormattedLabel id='villageName' />,
      width: 320,
    },
    {
      field: language === 'en' ? 'gatNameEn' : 'gatNameMr',
      headerName: <FormattedLabel id='gatName' />,
      width: 320,
    },
    {
      field: language === 'en' ? 'zoneNameEn' : 'zoneNameMr',
      headerName: <FormattedLabel id='zoneName' />,
      width: 320,
    },

    {
      field: 'action',
      headerName: <FormattedLabel id='actions' />,
      flex: 1,
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
    const villageId = villageDropDown.find(
      // @ts-ignore
      (obj) => obj?.villageName === values.villageName
      // @ts-ignore
    )?.id
    const gatId = gatDropDown.find(
      // @ts-ignore
      (obj) => obj?.gatName === values.gatName
      // @ts-ignore
    )?.id
    const zoneId = zoneDropDown.find(
      // @ts-ignore
      (obj) => obj?.zoneName === values.zoneName
      // @ts-ignore
    )?.id
    setID(values.id)
    reset({
      ...values,
      villageKey: villageId,
      gatName: gatId,
      tdrZoneKey: zoneId,
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
          .delete(`${URLS.TPURL}/tDRZoneGatVillageMappingMaster/delete/${id}`)
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
      router.push(`${backUrl}`)
    } else {
      router.push('/dashboard')
    }
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    villageKey: '',
    gatName: '',
    tdrZoneKey: '',
  }

  const cancellButton = () => {
    reset({ id: ID, ...resetValuesCancell })
  }

  const onSubmit = async (data) => {
    const bodyForAPI = {
      ...data,
    }

    await axios
      .post(`${URLS.TPURL}/tDRZoneGatVillageMappingMaster/save`, bodyForAPI)
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
        <title>Zone-Gat and Village Mapping</title>
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
              <div>
                <>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className={styles.row}>
                        <FormControl
                          sx={{ width: '300px', marginTop: '2%' }}
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
                                {villageDropDown &&
                                  villageDropDown.map((value, index) => (
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
                                          ? value?.villageNameEn
                                          : value?.villageNameMr
                                      }
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
                                        language === 'en'
                                          ? value?.gatNameEn
                                          : value?.gatNameMr
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
                        <FormControl
                          sx={{ width: '200px', marginTop: '2%' }}
                          variant='standard'
                          error={!!errors.tdrZoneKey}
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
                                  router.query.tdrZoneKey
                                    ? router.query.tdrZoneKey
                                    : field.value
                                }
                                onChange={(value) => field.onChange(value)}
                                label='tdrZoneKey'
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
                                          ? value?.zoneNameEn
                                          : value?.zoneNameMr
                                      }
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='tdrZoneKey'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.tdrZoneKey
                              ? errors.tdrZoneKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
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
                height: 370.5,
                width: 1005,
              }}
              autoHeight
              rows={table}
              // @ts-ignore
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

export default Index
