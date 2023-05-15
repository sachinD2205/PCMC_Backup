import { Button, IconButton, Paper, Slide, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import router from 'next/router'

import styles from './view.module.css'
import { Add, Clear, Delete, Edit, ExitToApp, Save } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Head from 'next/head'
import sweetAlert from 'sweetalert'
import URLS from '../../../URLS/urls'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'

const Index = () => {
  let schema = yup.object().shape({
    authorityNameEn: yup.string().required('Please enter name in english.'),
    authorityNameMr: yup.string().required('Please enter name in marathi.'),
  })
  const {
    register,
    handleSubmit,
    // @ts-ignore
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  const [ID, setID] = useState(null)
  const [table, setTable] = useState([
    {
      id: 1,
      srNo: 1,
      authorityNameEn: '',
      authorityNameMr: '',
    },
  ])
  const [collapse, setCollapse] = useState(false)
  const [runAgain, setRunAgain] = useState(false)

  useEffect(() => {
    setRunAgain(false)

    axios.get(`${URLS.TPURL}/appropriateAuthorityMaster/getAll`).then((res) => {
      console.log('Authority Master: ', res.data.appropriateAuthority)
      setTable(
        res.data.appropriateAuthority.map((j, i) => ({
          srNo: i + 1,
          ...j,
        }))
      )
    })
  }, [runAgain])

  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      width: 80,
    },
    {
      field: 'authorityNameEn',
      headerName: <FormattedLabel id='authorityNameEn' />,
      flex: 1,
    },
    {
      field: 'authorityNameMr',
      headerName: <FormattedLabel id='authorityNameMr' />,
      flex: 1,
    },
    {
      field: 'action',
      headerName: <FormattedLabel id='actions' />,
      width: 130,
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
    reset({
      ...values,
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
            // `${URLS.BaseURL}/villageWiseLandReservationEntryMaster/delete/${id}`
            `${URLS.TPURL}/villageWiseLandReservationEntryMaster/delete/${id}`
          )
          .then((res) => {
            if (res.status == 226) {
              sweetAlert('Deleted!', 'Record Deleted successfully !', 'success')
              // setRunAgain(true)
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
    authorityNameEn: '',
    authorityNameMr: '',
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
        // `${URLS.BaseURL}/villageWiseLandReservationEntryMaster/save`,
        `${URLS.TPURL}/appropriateAuthorityMaster/save`,
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
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <>
      <Head>
        <title>Appropriate Authority</title>
      </Head>
      <div className={styles.main}>
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
                          justifyContent: 'space-evenly',
                          flexWrap: 'wrap',
                        }}
                      >
                        <TextField
                          sx={{
                            width: '250px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel id='authorityNameEn' required />
                          }
                          variant='standard'
                          {...register('authorityNameEn')}
                          error={!!errors.authorityNameEn}
                          helperText={
                            errors?.authorityNameEn
                              ? errors.authorityNameEn.message
                              : null
                          }
                          defaultValue={
                            router.query.authorityNameEn
                              ? router.query.authorityNameEn
                              : ''
                          }
                        />
                        <TextField
                          sx={{
                            width: '250px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel id='authorityNameMr' required />
                          }
                          variant='standard'
                          {...register('authorityNameMr')}
                          error={!!errors.authorityNameMr}
                          helperText={
                            errors?.authorityNameMr
                              ? errors.authorityNameMr.message
                              : null
                          }
                          defaultValue={
                            router.query.authorityNameMr
                              ? router.query.authorityNameMr
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
                width: 650,
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

export default Index
