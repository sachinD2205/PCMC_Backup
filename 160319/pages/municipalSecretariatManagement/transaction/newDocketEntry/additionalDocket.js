import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './newDocketEntry.module.css'

import Paper from '@mui/material/Paper'
import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  // IconButton,
} from '@mui/material'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
// import { DataGrid } from '@mui/x-data-grid'
import {
  Clear,
  ExitToApp,
  Save,
  // Delete,
  // Edit,
  // Watch,
} from '@mui/icons-material'
// import Slide from '@mui/material/Slide'
import FormControl from '@mui/material/FormControl'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import URLs from '../../../../URLS/urls'
import { useSelector } from 'react-redux'
import sweetAlert from 'sweetalert'
import UploadButton from '../../../../containers/reuseableComponents/UploadButton'

const Index = () => {
  // const [table, setTable] = useState([])
  const [officeName, setOfficeName] = useState([
    { id: 1, officeNameEn: '', officeNameMr: '' },
  ])
  const [departmentName, setDepartmentName] = useState([
    {
      id: 1,
      departmentNameEn: '',
      departmentNameMr: '',
    },
  ])
  const [committeeName, setCommitteeName] = useState([
    {
      id: 1,
      committeeNameEn: '',
      committeeNameMr: '',
    },
  ])
  const [financialYear, setFinancialYear] = useState([
    {
      id: 1,
      financialYearEn: '',
      financialYearMr: '',
    },
  ])
  const [docketType, setDocketType] = useState([
    { id: 1, docketTypeEn: '', docketTypeMr: '' },
  ])
  const [docket, setDocket] = useState()
  const [attachment, setAttachment] = useState('')
  // const [runAgain, setRunAgain] = useState(false)
  // const [collapse, setCollapse] = useState(false)

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)
  console.log('2314', router.query.agendaNo)
  //Docket Details
  let docketSchema = yup.object().shape({
    subjectDate: yup.string().required('Please select Reservation'),
    subject: yup.string().required('Please select Reservation'),
    officeName: yup.number().required('Please select Reservation'),
    departmentId: yup.number().required('Please select Reservation'),
    CommitteeId: yup.number().required('Please select Reservation'),
    financialYear: yup.number().required('Please select Reservation'),
    docketType: yup.number().required('Please select Reservation'),
    subjectSummary: yup.string().required('Please select Reservation'),
    amount: yup.number().required('Please select Reservation'),
    inwardOutwardNumber: yup
      .string()
      .required('Please enter an Outward Number'),
  })

  const {
    register,
    // handleSubmit: handleSubmit,
    handleSubmit,
    setValue,
    // @ts-ignore
    // methods,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(docketSchema),
  })

  useEffect(() => {
    //Get Office
    axios
      .get(`${URLs.MSURL}/mstDefineOfficeDetails/getAll`)
      .then((res) => {
        console.log('Office: ', res.data.defineOfficeDetails)
        setOfficeName(
          res.data.defineOfficeDetails.map((j) => ({
            id: j.id,
            officeNameEn: j.office,
            officeNameMr: j.officeMr,
          }))
        )
      })
      .catch((error) => {
        console.log('error: ', error)
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
          icon: 'error',
          buttons: {
            confirm: {
              text: 'OK',
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        })
      })

    //Get Department
    axios
      .get(`${URLs.CFCURL}/master/department/getAll`)
      .then((res) => {
        console.log('Department: ', res.data.department)
        setDepartmentName(
          res.data.department.map((j) => ({
            id: j.id,
            departmentNameEn: j.department,
            departmentNameMr: j.departmentMr,
          }))
        )
      })
      .catch((error) => {
        console.log('error: ', error)
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
          icon: 'error',
          buttons: {
            confirm: {
              text: 'OK',
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        })
      })

    //Get Committee
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
      .then((res) => {
        console.log('Committee: ', res.data.committees)
        setCommitteeName(
          res.data.committees.map((j) => ({
            id: j.id,
            committeeNameEn: j.CommitteeName,
            committeeNameMr: j.CommitteeNameMr,
          }))
        )
      })
      .catch((error) => {
        console.log('error: ', error)
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
          icon: 'error',
          buttons: {
            confirm: {
              text: 'OK',
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        })
      })

    //Get Financial Year
    axios
      .get(`${URLs.CFCURL}/master/financialYearMaster/getAll`)
      .then((res) => {
        console.log('Financial Year: ', res.data.financialYear)
        setFinancialYear(
          res.data.financialYear.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
          }))
        )
      })
      .catch((error) => {
        console.log('error: ', error)
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
          icon: 'error',
          buttons: {
            confirm: {
              text: 'OK',
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        })
      })

    //Get Docket Type
    axios
      .get(`${URLs.MSURL}/mstDocketType/getAll`)
      .then((res) => {
        console.log('Docket Type: ', res.data.docketType)
        setDocketType(
          res.data.docketType.map((j) => ({
            id: j.id,
            docketTypeEn: j.docketType,
            docketTypeMr: j.docketTypeMr,
          }))
        )
      })
      .catch((error) => {
        console.log('error: ', error)
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
          icon: 'error',
          buttons: {
            confirm: {
              text: 'OK',
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        })
      })
  }, [])

  //   useEffect(() => {
  //     setRunAgain(false)
  //     //Table
  //     axios
  //       .get(`${URLs.MSURL}/trnNewDocketEntry/getAll`)
  //       .then((res) => {
  //         console.log('Table: ', res.data.newDocketEntry)

  //         setTable(
  //           res.data.newDocketEntry.map((j, i) => ({
  //             ...j,
  //             id: j.id,
  //             srNo: i + 1,
  //             attachment: j.uploadDocument,
  //             subjectStatus: j.status,
  //             subject: j.subject,
  //             description: j.subjectSummary,
  //             subjectSerialNumber: j.subjectSerialNumber,
  //             subjectDate: j.subjectDate,
  //             financialYearEn: financialYear?.find((obj) => {
  //               return obj.id === j.financialYear
  //             })?.financialYearEn,
  //             financialYearMr: financialYear?.find((obj) => {
  //               return obj.id === j.financialYear
  //             })?.financialYearMr,
  //             committeeNameEn: committeeName?.find((obj) => {
  //               return obj.id === j.CommitteeId
  //             })?.committeeNameEn,
  //             committeeNameMr: committeeName?.find((obj) => {
  //               return obj.id === j.CommitteeId
  //             })?.committeeNameMr,
  //           }))
  //         )
  //       })
  //       .catch((error) => {
  //         console.log('error: ', error)
  //         sweetAlert({
  //           title: 'ERROR!',
  //           text: `${error}`,
  //           icon: 'error',
  //           buttons: {
  //             confirm: {
  //               text: 'OK',
  //               visible: true,
  //               closeModal: true,
  //             },
  //           },
  //           dangerMode: true,
  //         })
  //       })
  //   }, [financialYear, committeeName, runAgain])

  //   const columns = [
  //     {
  //       field: 'srNo',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='srNo' />,
  //       width: 80,
  //     },
  //     {
  //       field: 'subjectSerialNumber',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='subjectSerialNumber' />,
  //       width: 200,
  //     },
  //     {
  //       field: 'subjectDate',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='subjectDate' />,
  //       width: 150,
  //     },
  //     {
  //       field: language === 'en' ? 'financialYearEn' : 'financialYearMr',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='financialYear' />,
  //       width: 150,
  //     },
  //     {
  //       field: language === 'en' ? 'committeeNameEn' : 'committeeNameMr',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='committeeName' />,
  //       width: 175,
  //     },
  //     {
  //       field: 'subject',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='subject' />,
  //       width: 200,
  //     },
  //     {
  //       field: 'description',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='description' />,
  //       width: 175,
  //     },
  //     {
  //       field: 'attachment',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='attachment' />,
  //       width: 175,
  //       renderCell: (params) => {
  //         return (
  //           <>
  //             <Button
  //               variant='contained'
  //               onClick={() => {
  //                 window.open(
  //                   `${URLs.CFCURL}/file/preview?filePath=${params.row.attachment}`,
  //                   '_blank'
  //                 )
  //               }}
  //             >
  //               {<FormattedLabel id='preview' />}
  //             </Button>
  //           </>
  //         )
  //       },
  //     },
  //     {
  //       field: 'subjectStatus',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='subjectStatus' />,
  //       width: 150,
  //     },
  //     {
  //       field: 'action',
  //       align: 'center',
  //       headerAlign: 'center',
  //       headerName: <FormattedLabel id='actions' />,
  //       width: 130,
  //       renderCell: (params) => {
  //         return (
  //           <>
  //             {(params.row.status === 'INITIATED' ||
  //               params.row.status === 'REASSIGN') && (
  //               <IconButton
  //                 disabled={collapse}
  //                 sx={{ color: '#096dd9' }}
  //                 onClick={() => editById(params.row)}
  //               >
  //                 <Edit />
  //               </IconButton>
  //             )}

  //           </>
  //         )
  //       },
  //     },
  //   ]

  //   const [ID, setID] = useState()

  //   const editById = (values) => {
  //     setID(values.id)
  //     reset({
  //       ...values,
  //     })
  //     setAttachment(values.attachment)

  //     setCollapse(true)
  //   }

  const clearButton = () => {
    reset({
      //   id: ID,
      subjectDate: null,
      subject: '',
      officeName: '',
      departmentId: '',
      CommitteeId: '',
      financialYear: '',
      docketType: '',
      subjectSummary: '',
      amount: '',
    })
    setAttachment('')
  }

  //   const deleteById = (id) => {
  //     sweetAlert({
  //       title: 'Are you sure?',
  //       text: 'Once deleted, you will not be able to recover this record!',
  //       icon: 'warning',
  //       buttons: ['Cancel', 'Delete'],
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       if (willDelete) {
  //         axios
  //           .post(`${URLs.MSURL}/trnNewDocketEntry/save`, { id, activeFlag: 'N' })
  //           .then((res) => {
  //             if (res.status === 200 || res.status === 201) {
  //               sweetAlert('Deleted!', 'Record successfully deleted!', 'success')
  //             }
  //             setRunAgain(true)
  //           })
  //           .catch((error) => {
  //             console.log('error: ', error)
  //             sweetAlert({
  //               title: 'ERROR!',
  //               text: `${error}`,
  //               icon: 'error',
  //               buttons: {
  //                 confirm: {
  //                   text: 'OK',
  //                   visible: true,
  //                   closeModal: true,
  //                 },
  //               },
  //               dangerMode: true,
  //             })
  //           })
  //       }
  //     })
  //   }

  const finalSubmit = (data) => {
    const bodyForAPI = {
      ...data,
      agendaNo: router.query.agendaNo,
      uploadDocument: attachment,
    }
    console.log('Body: ', bodyForAPI)
    axios
      .post(`${URLs.MSURL}/trnNewDocketEntry/saveNewDocket`, bodyForAPI)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          sweetAlert('Saved!', 'Record Saved successfully !', 'success')
          clearButton()
          router.push({
            pathname: `${URLs.APPURL}/municipalSecretariatManagement/transaction/meetingAgenda/meetingAgenda`,
            query: router.query.agendaNo + '',
          })
        }
      })
      .catch((error) => {
        console.log('error: ', error)
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
          icon: 'error',
          buttons: {
            confirm: {
              text: 'OK',
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        })
      })
  }

  return (
    <>
      <Head>
        <title>New Docket Entry</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>New Docket Entry</div>
        <div style={{ marginTop: 40 }}>
          <form onSubmit={handleSubmit(finalSubmit)}>
            <div>
              <div className={styles.row} style={{ justifyContent: 'center' }}>
                <TextField
                  disabled
                  sx={{ width: '250px' }}
                  label={<FormattedLabel id='agendaNo' required />}
                  variant='standard'
                  {...register('agendaNo')}
                  defaultValue={router.query.agendaNo ?? ''}
                  error={!!error.agendaNo}
                  helperText={error?.agendaNo ? error.agendaNo.message : null}
                />
              </div>
              <div className={styles.row} style={{ marginTop: 40 }}>
                <FormControl error={!!error.subjectDate}>
                  <Controller
                    control={control}
                    name='subjectDate'
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat='dd/MM/yyyy'
                          label={
                            <span>
                              <FormattedLabel id='subjectDate' required />
                            </span>
                          }
                          disabled={router.query.subjectDate ? true : false}
                          value={
                            router.query.subjectDate
                              ? router.query.subjectDate
                              : field.value
                          }
                          onChange={(date) =>
                            field.onChange(
                              moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: '250px' }}
                              {...params}
                              size='small'
                              fullWidth
                              variant='standard'
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {error?.subjectDate ? error.subjectDate.message : null}
                  </FormHelperText>
                </FormControl>
                <FormControl variant='standard' error={!!error.officeName}>
                  <InputLabel
                    id='demo-simple-select-standard-label'
                    //   disabled={isDisabled}
                  >
                    <FormattedLabel id='officeNameOrElectoralWard' required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '250px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='officeNameOrElectoralWard'
                      >
                        {officeName &&
                          officeName.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == 'en'
                                ? //@ts-ignore
                                  value.officeNameEn
                                : // @ts-ignore
                                  value?.officeNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='officeName'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.officeName ? error.officeName.message : null}
                  </FormHelperText>
                </FormControl>
                <FormControl variant='standard' error={!!error.departmentId}>
                  <InputLabel
                    id='demo-simple-select-standard-label'
                    //   disabled={isDisabled}
                  >
                    <FormattedLabel id='departmentName' required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '250px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='departmentName'
                      >
                        {departmentName &&
                          departmentName.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == 'en'
                                ? //@ts-ignore
                                  value.departmentNameEn
                                : // @ts-ignore
                                  value?.departmentNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='departmentId'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.departmentId ? error.departmentId.message : null}
                  </FormHelperText>
                </FormControl>
              </div>

              <div className={styles.row}>
                <TextareaAutosize
                  color='neutral'
                  disabled={false}
                  minRows={1}
                  maxRows={3}
                  placeholder='Subject'
                  className={styles.bigText}
                  {...register('subject')}
                />
              </div>
              <div className={styles.row}>
                <TextareaAutosize
                  color='neutral'
                  disabled={false}
                  minRows={5}
                  placeholder='Subject Summary'
                  className={styles.bigText}
                  {...register('subjectSummary')}
                />
              </div>
              <div className={styles.row}>
                <FormControl variant='standard' error={!!error.CommitteeId}>
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='committeeName' required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '230px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='CommitteeId'
                      >
                        {committeeName &&
                          committeeName.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == 'en'
                                ? //@ts-ignore
                                  value.committeeNameEn
                                : // @ts-ignore
                                  value?.committeeNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='CommitteeId'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.CommitteeId ? error.CommitteeId.message : null}
                  </FormHelperText>
                </FormControl>

                <FormControl variant='standard' error={!!error.financialYear}>
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='financialYear' required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '230px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='financialYear'
                      >
                        {financialYear &&
                          financialYear.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == 'en'
                                ? //@ts-ignore
                                  value.financialYearEn
                                : // @ts-ignore
                                  value?.financialYearMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='financialYear'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.financialYear ? error.financialYear.message : null}
                  </FormHelperText>
                </FormControl>

                <FormControl variant='standard' error={!!error.docketType}>
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='docketType' required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '230px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                          setDocket(value.target.value)
                          if (value.target.value === 1) {
                            setValue('amount', 0)
                          }
                        }}
                        label='docketType'
                      >
                        {docketType &&
                          docketType.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == 'en'
                                ? //@ts-ignore
                                  value.docketTypeEn
                                : // @ts-ignore
                                  value?.docketTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='docketType'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.docketType ? error.docketType.message : null}
                  </FormHelperText>
                </FormControl>

                <TextField
                  disabled={docket === 1 ? true : false}
                  sx={{ width: '230px' }}
                  label={<FormattedLabel id='amount' required />}
                  variant='standard'
                  {...register('amount')}
                  error={!!error.amount}
                  helperText={error?.amount ? error.amount.message : null}
                  InputLabelProps={{
                    shrink: watch('amount') !== '' ? true : false,
                  }}
                />
              </div>
              <div
                className={styles.row}
                style={{
                  // display: 'flex',
                  // flexDirection: 'row',
                  // marginTop: 20,
                  justifyContent: 'normal',
                  columnGap: 100,
                }}
              >
                <UploadButton
                  appName='TP'
                  serviceName='PARTMAP'
                  label='Concern Department Docket File'
                  filePath={attachment}
                  fileUpdater={setAttachment}
                />

                <TextField
                  id='standard-basic'
                  sx={{ width: '230px', marginBottom: '15px' }}
                  label={<FormattedLabel id='inwardNumber' required />}
                  variant='standard'
                  {...register('inwardOutwardNumber')}
                  error={!!error.inwardOutwardNumber}
                  helperText={
                    error?.inwardOutwardNumber
                      ? error.inwardOutwardNumber.message
                      : null
                  }
                />
              </div>
              <div className={styles.buttons}>
                <Button
                  variant='contained'
                  type='submit'
                  disabled={attachment ? false : true}
                  endIcon={<Save />}
                >
                  <FormattedLabel id='save' />
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  endIcon={<Clear />}
                  onClick={clearButton}
                >
                  <FormattedLabel id='clear' />
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  endIcon={<ExitToApp />}
                  // onClick={onBack}
                  onClick={() => {
                    router.push('/municipalSecretariatManagement/dashboard')
                  }}
                >
                  <FormattedLabel id='exit' />
                </Button>
              </div>
            </div>
          </form>

          {/* <div className={styles.table}>
            <DataGrid
              autoHeight
              rows={table}
              //@ts-ignore
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div> */}
        </div>
      </Paper>
    </>
  )
}

export default Index
