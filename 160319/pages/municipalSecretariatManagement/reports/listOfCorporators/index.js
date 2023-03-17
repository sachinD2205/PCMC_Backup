// /mstDefineCorporators/getByFromDateToDate?fromDate=2019-01-01&toDate=2023-01-01
import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Paper,
  TextField,
} from '@mui/material'
import styles from './view.module.css'
import router from 'next/router'
import URLS from '../../../../URLS/urls'

import axios from 'axios'
import sweetAlert from 'sweetalert'
import ReportTable from '../../../../containers/reuseableComponents/ReportTable'
import { Controller, useForm } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/node/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/node/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { ExitToApp, Print, Search, Visibility } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import Head from 'next/head'

const Index = () => {
  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'List of Corporators',
  })

  const [electedWardDropDown, setElectedWardDropDown] = useState([
    { id: 1, electedWardEn: '', electedWardMr: '' },
  ])
  const [religion, setReligion] = useState([
    {
      id: 1,
      religionEn: '',
      religionMr: '',
    },
  ])
  const [ward, setWard] = useState([
    {
      id: 1,
      wardNameEn: '',
      wardNameMr: '',
    },
  ])
  const [gender, setGender] = useState([
    {
      id: 1,
      genderEn: '',
      genderMr: '',
    },
  ])
  const [table, setTable] = useState([])
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const searchSchema = yup.object().shape({
    fromDate: yup.string().nullable(),
    toDate: yup.string().nullable(),
  })

  const {
    handleSubmit,
    register,
    // setValue,
    // @ts-ignore
    // methods,
    watch,
    // reset,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(searchSchema),
  })

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 80,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'fullName' : 'fullNameMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='fullName' />,
      width: 250,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'genderEn' : 'genderMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='gender' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: 'DOB',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='dateOfBirth' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'wardEn' : 'wardMr',
      // field: 'ward',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='ward' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'electedWardEn' : 'electedWardMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='electedWard' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'religionEn' : 'religionMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='religion' />,
      width: 175,
    },
  ]

  useEffect(() => {
    //Gender
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((res) => {
      setGender(
        res.data.gender.map((j) => ({
          id: j.id,
          genderEn: j.gender,
          genderMr: j.genderMr,
        }))
      )
    })

    //Ward
    axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((res) => {
      console.log('Yetoy na bhai', res.data.ward)
      setWard(
        res.data.ward.map((j) => ({
          id: j.id,
          wardNameEn: j.wardName,
          wardNameMr: j.wardNameMr,
        }))
      )
    })

    //Get Elected Ward
    axios.get(`${URLS.MSURL}/mstElectoral/getAll`).then((res) => {
      console.log(res.data.electoral)
      setElectedWardDropDown(
        res.data.electoral.map((j) => ({
          id: j.id,
          electedWardEn: j.electoralWardName,
          electedWardMr: j.electoralWardNameMr,
        }))
      )
    })

    //Religion
    axios.get(`${URLS.CFCURL}/master/religion/getAll`).then((res) => {
      setReligion(
        res.data.religion.map((j) => ({
          id: j.id,
          religionEn: j.religion,
          religionMr: j.religionMr,
        }))
      )
    })
  }, [])

  const submit = (data) => {
    axios
      .get(
        `${URLS.MSURL}/mstDefineCorporators/getByFromDateToDate?fromDate=${data.fromDate}&toDate=${data.toDate}&activeFlag=Y`
      )
      .then((res) => {
        console.log(res.data)
        // setTable(
        //   res.data.map((obj, index) => ({
        //     id: obj.id,
        //     srNo: index + 1,
        //     ward: obj.ward,
        //     electedWard: obj.electedWard,
        //     fullName: obj.firstName + ' ' + obj.middleName + ' ' + obj.lastname,
        //     fullNameMr:
        //       obj.firstNameMr + ' ' + obj.middleNameMr + ' ' + obj.lastnameMr,
        //     // @ts-ignore
        //     genderEn: gender.find((j) => j.id === obj.gender).genderEn,
        //     // @ts-ignore
        //     genderMr: gender.find((j) => j.id == obj.gender).genderMr,
        //     // @ts-ignore
        //     wardEn: ward.find((j) => j.id == obj.ward)?.wardNameEn,
        //     // @ts-ignore
        //     wardMr: ward.find((j) => j.id == obj.ward)?.wardNameMr,
        //     // @ts-ignore
        //     religionEn: religion.find((j) => j.id == obj.religion).religionEn,
        //     // @ts-ignore
        //     religionMr: religion.find((j) => j.id == obj.religion).religionMr,
        //     electedWardEn: electedWardDropDown.find(
        //       (j) => j.id === obj.electedWard
        //     )?.electedWardEn,
        //     electedWardMr: electedWardDropDown.find(
        //       (j) => j.id === obj.electedWard
        //     )?.electedWardMr,
        //     DOB: obj.dateOfBirth,
        //     religion: obj.religion,
        //   }))
        // )
      })
  }

  return (
    <>
      <Head>
        <title>List of Corporators</title>
      </Head>

      <Paper className={styles.main}>
        <div className={styles.title}>List of Corporators</div>
        <form onSubmit={handleSubmit(submit)}>
          <div
            className={styles.row}
            style={{
              columnGap: 100,
              rowGap: 25,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '5vh',
            }}
          >
            <FormControl error={!!error.fromDate}>
              <Controller
                control={control}
                name='fromDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={
                        <span>
                          <FormattedLabel id='fromDate' />
                        </span>
                      }
                      disabled={router.query.fromDate ? true : false}
                      value={
                        router.query.fromDate
                          ? router.query.fromDate
                          : field.value
                      }
                      onChange={(date) =>
                        field.onChange(
                          moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
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
                {error?.fromDate ? error.fromDate.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.toDate}>
              <Controller
                control={control}
                name='toDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={
                        <span>
                          <FormattedLabel id='toDate' />
                        </span>
                      }
                      disabled={router.query.toDate ? true : false}
                      value={
                        router.query.toDate ? router.query.toDate : field.value
                      }
                      onChange={(date) =>
                        field.onChange(
                          moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
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
                {error?.toDate ? error.toDate.message : null}
              </FormHelperText>
            </FormControl>
            <Button variant='contained' type='submit' endIcon={<Search />}>
              <FormattedLabel id='search' />
            </Button>
          </div>
          <div
            className={styles.row}
            style={{ justifyContent: 'center', marginBottom: '5vh' }}
          >
            <div className={styles.buttons}>
              <Button
                variant='contained'
                endIcon={<Print />}
                onClick={handleToPrint}
              >
                <FormattedLabel id='print' />
              </Button>

              <Button
                variant='contained'
                color='error'
                endIcon={<ExitToApp />}
                onClick={() => {
                  router.push(
                    `${URLS.APPURL}/municipalSecretariatManagement/dashboard`
                  )
                }}
              >
                <FormattedLabel id='back' />
              </Button>
            </div>
          </div>

          {/* <div className={styles.table} ref={componentRef}>
            <DataGrid
              className={styles.toPrint}
              sx={{
                width: '100%',
                marginTop: '5vh',
                marginBottom: '3vh',
                '& .cellColor': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                },
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
          </div> */}
        </form>
        <ReportTable rows={table} columns={columns} toPrint={componentRef} />
      </Paper>
    </>
  )
}
export default Index
