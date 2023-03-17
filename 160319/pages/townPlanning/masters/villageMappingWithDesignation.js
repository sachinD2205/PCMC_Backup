import { yupResolver } from '@hookform/resolvers/yup'
import sweetAlert from 'sweetalert'
import { Add, Clear, Delete, Edit, ExitToApp, Save } from '@mui/icons-material'
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
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import styles from './view.module.css'
import { DataGrid } from '@mui/x-data-grid'
import router from 'next/router'
import axios from 'axios'
// import URLS from "../../../components/townPlanning/urls";
import URLS from '../../../URLS/urls'
import { useSelector } from 'react-redux'

const Index = () => {
  let schema = yup.object().shape({
    villageName: yup.string().required('Please select a Village name.'),
    ddtp: yup.string().required('Please select a DDTP name.'),
    deAndTp: yup.string().required('Please select DE or TP name.'),
    atpAndJe: yup.string().required('Please select a ATP or JE name.'),
  })

  const {
    // register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    // watch,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

  const [ID, setID] = useState(null)
  const [collapse, setCollapse] = useState(false)
  const [runAgain, setRunAgain] = useState(false)

  const [villageNameDropDown, setVillageNameDropDown] = useState([
    { id: 1, villageNameEn: '', villageNameMr: '' },
  ])
  const [employeeNameDropDown, setEmployeeNameDropDown] = useState([
    {
      id: 1,
      name: '',
      designation: '',
    },
  ])
  const [table, setTable] = useState([
    {
      id: 1,
      srNo: 1,
      villageNameEn: '',
      villageNameMr: '',
      ddtpEn: '',
      ddtpMr: '',
      deAndTpEn: '',
      deAndTpMr: '',
      atpAndJeEn: '',
      atpAndJeMr: '',
    },
  ])

  let isDisabled = false

  useEffect(() => {
    //Village
    axios.get(`${URLS.CFCURL}/master/village/getAll`).then((r) => {
      setVillageNameDropDown(
        r.data.village.map((j) => ({
          id: j.id,
          villageNameEn: j.villageName,
          villageNameMr: j.villageNameMr,
        }))
      )
    })

    //User
    axios.get(`${URLS.CFCURL}/master/user/getAll`).then((r) => {
      setEmployeeNameDropDown(
        r.data.user.map((j) => ({
          id: j.id,
          nameEn: j.firstNameEn + ' ' + j.lastNameEn,
          nameMr: j.firstNameMr + ' ' + j.lastNameMr,
          designation: j.desg,
        }))
      )
    })
  }, [])

  useEffect(() => {
    setRunAgain(false)

    axios
      .get(
        `${URLS.TPURL}/villageMappingWithDesignation/getVillageMappingWithDesignationData`
      )
      .then((r) => {
        setTable(
          r.data.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            villageNameEn: villageNameDropDown.find(
              (arg) => arg.id === j.villageName
            )?.villageNameEn,
            villageNameMr: villageNameDropDown.find(
              (arg) => arg.id === j.villageName
            )?.villageNameMr,
            ddtpEn: employeeNameDropDown.find((arg) => arg.id === j.ddtp)
              ?.nameEn,
            ddtpMr: employeeNameDropDown.find((arg) => arg.id === j.ddtp)
              ?.nameMr,
            deAndTpEn: employeeNameDropDown.find((arg) => arg.id === j.deAndTp)
              ?.nameEn,
            deAndTpMr: employeeNameDropDown.find((arg) => arg.id === j.deAndTp)
              ?.nameMr,
            atpAndJeEn: employeeNameDropDown.find(
              (arg) => arg.id === j.atpAndJe
            )?.nameEn,
            atpAndJeMr: employeeNameDropDown.find(
              (arg) => arg.id === j.atpAndJe
            )?.nameMr,
          }))
        )
      })
  }, [runAgain, employeeNameDropDown, villageNameDropDown])

  const resetValuesCancell = {
    villageName: '',
    ddtp: '',
    deAndTp: '',
    atpAndJe: '',
  }

  const cancellButton = () => {
    reset({ id: ID, ...resetValuesCancell })
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

  const onSubmit = async (data) => {
    console.log('Data: ', data)

    const bodyForAPI = {
      ...data,
    }

    await axios
      .post(
        `${URLS.TPURL}/villageMappingWithDesignation/saveVillageMappingWithDesignation`,
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

  const editById = (values) => {
    setID(values.id)
    console.log('Edit sathi cha data: ', values)

    const villageID =
      language === 'en'
        ? villageNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.villageNameEn === values.villageNameEn
            // @ts-ignore
          )?.id
        : villageNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.villageNameEn === values.villageNameEn
            // @ts-ignore
          )?.id
    const ddtpID =
      language === 'en'
        ? employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameEn === values.ddtpEn
            // @ts-ignore
          )?.id
        : employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameMr === values.ddtpMr
            // @ts-ignore
          )?.id
    const deAndTpID =
      language === 'en'
        ? employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameEn === values.deAndTpEn
            // @ts-ignore
          )?.id
        : employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameMr === values.deAndTpMr
            // @ts-ignore
          )?.id
    const atpAndJeID =
      language === 'en'
        ? employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameEn === values.atpAndJeEn
            // @ts-ignore
          )?.id
        : employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameMr === values.atpAndJeMr
            // @ts-ignore
          )?.id

    console.log('IDya: ', { villageID, ddtpID, deAndTpID, atpAndJeID })

    reset({
      ...values,
      villageName: villageID,
      ddtp: ddtpID,
      deAndTp: deAndTpID,
      atpAndJe: atpAndJeID,
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
            `${URLS.TPURL}/villageMappingWithDesignation/discardVillageMappingWithDesignation/${id}`
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

  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      width: 100,
    },
    {
      field: language === 'en' ? 'villageNameEn' : 'villageNameMr',
      headerName: <FormattedLabel id='villageName' />,
      width: 200,
    },
    {
      field: language === 'en' ? 'ddtpEn' : 'ddtpMr',
      headerName: <FormattedLabel id='ddtp' />,
      width: 200,
    },
    {
      field: language === 'en' ? 'deAndTpEn' : 'deAndTpMr',
      headerName: <FormattedLabel id='deAndTp' />,
      width: 250,
    },
    {
      field: language === 'en' ? 'atpAndJeEn' : 'atpAndJeMr',
      headerName: <FormattedLabel id='atpAndJe' />,
      width: 300,
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

  return (
    <>
      <Head>
        <title>Village Mapping with Designation</title>
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
              reset({ id: null, ...resetValuesCancell })
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
                          justifyContent: 'space-evenly',
                          flexWrap: 'wrap',
                        }}
                      >
                        <FormControl
                          sx={{
                            marginTop: '2%',
                          }}
                          variant='standard'
                          error={!!errors.villageName}
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
                                sx={{ width: '180px' }}
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                // value={field.value}
                                disabled={isDisabled}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='villageName'
                              >
                                {villageNameDropDown &&
                                  villageNameDropDown.map((value, index) => (
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
                            name='villageName'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.villageName
                              ? errors.villageName.message
                              : null}
                          </FormHelperText>
                        </FormControl>

                        <FormControl
                          sx={{
                            marginTop: '2%',
                          }}
                          variant='standard'
                          error={!!errors.ddtp}
                        >
                          <InputLabel
                            id='demo-simple-select-standard-label'
                            disabled={isDisabled}
                          >
                            <FormattedLabel id='ddtp' required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: '180px' }}
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                // value={field.value}
                                disabled={isDisabled}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='ddtp'
                              >
                                {employeeNameDropDown &&
                                  employeeNameDropDown
                                    .filter((arg) => {
                                      // @ts-ignore
                                      return arg.designation === 'DDTP'
                                    })
                                    .map((value, index) => (
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
                                            ? value?.nameEn
                                            : value?.nameMr
                                        }
                                      </MenuItem>
                                    ))}
                              </Select>
                            )}
                            name='ddtp'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.ddtp ? errors.ddtp.message : null}
                          </FormHelperText>
                        </FormControl>

                        <FormControl
                          sx={{
                            marginTop: '2%',
                          }}
                          variant='standard'
                          error={!!errors.deAndTp}
                        >
                          <InputLabel
                            id='demo-simple-select-standard-label'
                            disabled={isDisabled}
                          >
                            <FormattedLabel id='deAndTp' required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: '250px' }}
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                // value={field.value}
                                disabled={isDisabled}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='deAndTp'
                              >
                                {employeeNameDropDown &&
                                  employeeNameDropDown
                                    .filter((arg) => {
                                      // @ts-ignore
                                      return (
                                        arg.designation === 'DE' ||
                                        arg.designation === 'TP'
                                      )
                                    })
                                    .map((value, index) => (
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
                                            ? value?.nameEn
                                            : value?.nameMr
                                        }
                                      </MenuItem>
                                    ))}
                              </Select>
                            )}
                            name='deAndTp'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.deAndTp ? errors.deAndTp.message : null}
                          </FormHelperText>
                        </FormControl>

                        <FormControl
                          sx={{
                            marginTop: '2%',
                          }}
                          variant='standard'
                          error={!!errors.atpAndJe}
                        >
                          <InputLabel
                            id='demo-simple-select-standard-label'
                            disabled={isDisabled}
                          >
                            <FormattedLabel id='atpAndJe' required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: '300px' }}
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                // value={field.value}
                                disabled={isDisabled}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='atpAndJe'
                              >
                                {employeeNameDropDown &&
                                  employeeNameDropDown
                                    .filter((arg) => {
                                      // @ts-ignore
                                      return (
                                        arg.designation === 'ATP' ||
                                        arg.designation === 'JE'
                                      )
                                    })
                                    .map((value, index) => (
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
                                            ? value?.nameEn
                                            : value?.nameMr
                                        }
                                      </MenuItem>
                                    ))}
                              </Select>
                            )}
                            name='atpAndJe'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.atpAndJe ? errors.atpAndJe.message : null}
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
                // height: 370.5,
                width: 1005,
              }}
              autoHeight
              rows={table}
              // @ts-ignore
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </div>
        </Paper>
      </div>
    </>
  )
}

export default Index
