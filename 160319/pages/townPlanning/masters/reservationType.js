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
// import URLS from "../../../components/townPlanning/urls";
import URLS from '../../../URLS/urls'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'

const Index = () => {
  let schema = yup.object().shape({
    legend: yup.string().required('Please enter a legend.'),
    reservationNameEn: yup
      .string()
      .required('Please enter reservation name in english.'),
    reservationNameMr: yup
      .string()
      .required('Please enter reservation name in marathi.'),
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
      reservationNameEn: '',
      reservationNameMr: '',
      legend: '',
    },
  ])
  const [collapse, setCollapse] = useState(false)
  const [runAgain, setRunAgain] = useState(false)

  useEffect(() => {
    setRunAgain(false)

    axios.get(`${URLS.TPURL}/reservationTypeMaster/getAll`).then((res) => {
      console.log('Reservation Type Master: ', res.data.reservationType)
      setTable(
        res.data.reservationType.map((j, i) => ({
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
      field: 'legend',
      headerName: <FormattedLabel id='legend' />,
      flex: 0.5,
    },
    {
      field: 'reservationNameEn',
      headerName: <FormattedLabel id='reservationNameEn' />,
      flex: 1,
    },
    {
      field: 'reservationNameMr',
      headerName: <FormattedLabel id='reservationNameMr' />,
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
    // sweetAlert({
    //   title: 'Are you sure?',
    //   text: 'Once deleted, you will not be able to recover this record!',
    //   icon: 'warning',
    //   buttons: ['Cancel', 'Delete'],
    //   dangerMode: true,
    // }).then((willDelete) => {
    //   if (willDelete) {
    //     axios
    //       .delete(
    //         `${URLS.TPURL}/villageWiseLandReservationEntryMaster/delete/${id}`
    //       )
    //       .then((res) => {
    //         if (res.status == 226) {
    //           sweetAlert('Deleted!', 'Record Deleted successfully !', 'success')
    //           // setRunAgain(true)
    //         }
    //       })
    //   }
    // })
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
    legend: '',
    reservationNameEn: '',
    reservationNameMr: '',
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
      .post(`${URLS.TPURL}/reservationTypeMaster/save`, bodyForAPI)
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
        <title>Reservation Type</title>
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
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                        }}
                      >
                        <TextField
                          sx={{
                            width: '250px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={<FormattedLabel id='legend' required />}
                          variant='standard'
                          {...register('legend')}
                          error={!!errors.legend}
                          helperText={
                            errors?.legend ? errors.legend.message : null
                          }
                          defaultValue={
                            router.query.legend ? router.query.legend : ''
                          }
                        />

                        <TextField
                          sx={{
                            width: '250px',
                            marginTop: '2%',
                          }}
                          id='standard-basic'
                          label={
                            <FormattedLabel id='reservationNameEn' required />
                          }
                          variant='standard'
                          {...register('reservationNameEn')}
                          error={!!errors.reservationNameEn}
                          helperText={
                            errors?.reservationNameEn
                              ? errors.reservationNameEn.message
                              : null
                          }
                          defaultValue={
                            router.query.reservationNameEn
                              ? router.query.reservationNameEn
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
                            <FormattedLabel id='reservationNameMr' required />
                          }
                          variant='standard'
                          {...register('reservationNameMr')}
                          error={!!errors.reservationNameMr}
                          helperText={
                            errors?.reservationNameMr
                              ? errors.reservationNameMr.message
                              : null
                          }
                          defaultValue={
                            router.query.reservationNameMr
                              ? router.query.reservationNameMr
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
