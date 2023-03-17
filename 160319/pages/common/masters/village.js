import React, { useEffect } from 'react'
import BasicLayout from '../../../containers/Layout/BasicLayout'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from '../../../styles/view.module.css'
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
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Head from 'next/head'
import axios from 'axios'
import { Clear, Delete, Edit, ExitToApp, Save, Add } from '@mui/icons-material'
import { useState } from 'react'
import urls from '../../../URLS/urls'

let schema = yup.object().shape({
  district: yup.string().required('Please select a district.'),
  taluka: yup.string().required('Please select a district.'),
  villageNameEng: yup
    .string()
    .required('Please enter a village name in English.'),
  villageNameMr: yup
    .string()
    .required('Please enter a village name in Marathi.'),
})

const Index = () => {
  // import from use Form

  let schema = yup.object().shape({
    zoneNo: yup.string().required(' Zone Name is Required !!'),
    wardName: yup.string().required(' Ward Name is Required !!'),
    subDepartmentName: yup.string().required(' Remark is Required !!'),
    departmentName: yup.string().required('Course Selection is Required !!!'),
    description: yup.string().required(' Remark is Required !!'),
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
  const [runAgain, setRunAgain] = useState(false)
  const [collapse, setCollapse] = useState(false)
  const [villageTable, setVillageTable] = useState([])

  useEffect(() => {
    setRunAgain(false)

    axios.get(`${urls.CFCURL}/master/village/getAll`).then((r) => {
      console.log('Table data: ', r.data)
      setVillageTable(
        r.data.map((j, i) => ({
          id: j.id,
          srNo: i + 1,
          district: j.district,
          taluka: j.taluka,
          villageNameMr: j.villageNameMr,
          villageNameEng: j.villageNameEng,
        }))
      )
    })
  }, [runAgain])

  const onSubmit = async (data) => {
    console.log('Form Data ', data)

    const bodyForAPI = {
      ...data,
    }

    console.log('Sagla data append kelya nantr: ', bodyForAPI)

    await axios
      .post(`${urls.CFCURL}/master/village/save`, bodyForAPI, {
        //   .post(`${URLS.BaseURL}/tp/api/partplan/savepartplan`, bodyForAPI, {
        // headers: {
        //   // Authorization: `Bearer ${token}`,
        //   role: 'CITIZEN',
        // },
      })
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
          .delete(`${urls.CFCURL}/Village/discardVillage/${id}`)
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
      headerName: 'Sr No.',
      width: 80,
    },
    {
      field: 'district',
      headerName: 'District',
      width: 170,
    },
    {
      field: 'taluka',
      headerName: 'Taluka',
      width: 170,
    },
    {
      field: 'villageNameEng',
      headerName: 'Village Name in English',
      width: 300,
    },
    {
      field: 'villageNameMr',
      headerName: 'Village Name in Marathi',
      width: 300,
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              // backgroundColor: 'whitesmoke',
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
    taluka: '',
    villageNameEng: '',
    villageNameMr: '',
  }

  const editById = (values) => {
    console.log('Kasla data edit hotoy: ', values)
    reset({ ...values })
    setCollapse(true)
  }

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
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

  return (
    <>
      <Head>
        <title>Village Master</title>
      </Head>
      <BasicLayout titleProp={'none'}>
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
              New
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
                        <div className={styles.row}>
                          <FormControl
                            sx={{ width: '250px', marginTop: '2%' }}
                            variant='standard'
                            error={!!errors.district}
                            disabled
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                              District
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId='demo-simple-select-standard-label'
                                  id='demo-simple-select-standard'
                                  // value={field.value}
                                  disabled
                                  value={
                                    router.query.district
                                      ? router.query.district
                                      : field.value
                                  }
                                  onChange={(value) => field.onChange(value)}
                                  label='district'
                                >
                                  <MenuItem value={'Pune'}>Pune</MenuItem>
                                </Select>
                              )}
                              name='district'
                              control={control}
                              defaultValue='Pune'
                            />
                            <FormHelperText>
                              {errors?.district
                                ? errors.district.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                          <FormControl
                            sx={{ width: '250px', marginTop: '2%' }}
                            variant='standard'
                            error={!!errors.taluka}
                          >
                            <InputLabel
                              id='demo-simple-select-standard-label'
                              disabled={isDisabled}
                            >
                              Taluka
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId='demo-simple-select-standard-label'
                                  id='demo-simple-select-standard'
                                  // value={field.value}
                                  disabled={isDisabled}
                                  value={
                                    router.query.taluka
                                      ? router.query.taluka
                                      : field.value
                                  }
                                  onChange={(value) => field.onChange(value)}
                                  label='taluka'
                                >
                                  <MenuItem value={'Haveli'}>Haveli</MenuItem>
                                  {/* <MenuItem value={'Department'}>
                                    Department
                                  </MenuItem> */}
                                </Select>
                              )}
                              name='taluka'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.taluka ? errors.taluka.message : null}
                            </FormHelperText>
                          </FormControl>
                          <TextField
                            sx={{
                              width: '230px',
                              marginTop: '2%',
                            }}
                            id='standard-basic'
                            label='Village Name in English*'
                            variant='standard'
                            {...register('villageNameEng')}
                            error={!!errors.villageNameEng}
                            helperText={
                              errors?.villageNameEng
                                ? errors.villageNameEng.message
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
                            label='Village Name in Marathi*'
                            variant='standard'
                            {...register('villageNameMr')}
                            error={!!errors.villageNameMr}
                            helperText={
                              errors?.villageNameMr
                                ? errors.villageNameMr.message
                                : null
                            }
                            disabled={isDisabled}
                          />
                        </div>

                        <div className={styles.buttons}>
                          <Button
                            sx={{
                              width: '100px',
                              height: '40px',
                              // marginTop: '4%',
                            }}
                            variant='contained'
                            type='submit'
                            endIcon={<Save />}
                          >
                            Save
                          </Button>
                          <Button
                            sx={{
                              width: '100px',
                              height: '40px',
                              // marginTop: '4%',
                            }}
                            variant='outlined'
                            color='error'
                            endIcon={<Clear />}
                            onClick={cancellButton}
                          >
                            Clear
                          </Button>
                          <Button
                            sx={{
                              width: '100px',
                              height: '40px',
                              // marginTop: '4%',
                            }}
                            variant='contained'
                            color='error'
                            onClick={onBack}
                            endIcon={<ExitToApp />}
                          >
                            Exit
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
                        height: 370.5,
                        width: 1005,
                      }}
                      rows={villageTable}
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
      </BasicLayout>
    </>
  )
}

export default Index
