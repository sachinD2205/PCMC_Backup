import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from '../masters.module.css'

import Paper from '@mui/material/Paper'
import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
} from '@mui/material'
import { Clear, ExitToApp, Save } from '@mui/icons-material'
import FormControl from '@mui/material/FormControl'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import FormHelperText from '@mui/material/FormHelperText'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import axios from 'axios'
import URLS from '../../../../URLS/urls'
import { useSelector } from 'react-redux'

const Index = () => {
  const [isNominated, setIsNominated] = useState(false)
  const [genderDropDown, setGenderDropDown] = useState([
    { id: 1, genderEn: '', genderMr: '' },
  ])
  const [casteDropDown, setCasteDropDown] = useState([
    { id: 1, casteEn: '', casteMr: '' },
  ])
  const [religionDropDown, setReligionDropDown] = useState([
    { id: 1, religionEn: '', religionMr: '' },
  ])
  const [wardDropDown, setWardDropDown] = useState([
    { id: 1, wardEn: '', wardMr: '' },
  ])
  const [electedWardDropDown, setElectedWardDropDown] = useState([
    { id: 1, electedWardEn: '', electedWardMr: '' },
  ])
  const [partyNameDropDown, setPartyNameDropDown] = useState([
    { id: 1, partyNameEn: '', partyNameMr: '' },
  ])
  const [idProofCategoryDropDown, setIdProofCategoryDropDown] = useState([
    { id: 1, idProofCategoryEn: '', idProofCategoryMr: '' },
  ])
  const [bankNameDropDown, setBankNameDropDown] = useState([
    {
      id: 1,
      bankNameEn: '',
      bankNameMr: '',
      branchNameEn: '',
      branchNameMr: '',
    },
  ])
  const [branchNameDropDown, setBranchNameDropDown] = useState([
    {
      id: 1,
      bankNameEn: '',
      bankNameMr: '',
      branchNameEn: '',
      branchNameMr: '',
    },
  ])
  const [ID, setID] = useState()

  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  let corporatorSchema = yup.object().shape({
    firstName: yup.string().required('Please enter first name in english'),
    middleName: yup.string().required('Please enter middle name in english'),
    lastname: yup.string().required('Please enter last name in english'),
    firstNameMr: yup.string().required('Please enter first name in marathi'),
    middleNameMr: yup.string().required('Please enter middle name in marathi'),
    lastnameMr: yup.string().required('Please enter last name in marathi'),
    gender: yup.number().required('Please select a gender'),
    religion: yup.number().required('Please select a religion'),
    caste: yup.number().required('Please select a caste'),
    ward: yup.number().required('Please select a ward'),
    electedWard: yup.number().required('Please select an elected ward'),
    party: yup.number().required('Please select a party name'),
    dateOfBirth: yup
      .string()
      .nullable()
      .required('Please select a date of birth'),
    casteCertificateNo: yup
      .string()
      .required('Please enter a caste certificate no.'),
    panNo: yup.string().required('Please enter a pan no.'),
    idProofCategory: yup.number().required('Please select a ID Proof Category'),
    idProofNo: yup.string().required('Please select a ID Proof No.'),
    electedDate: yup
      .string()
      .nullable()
      .required('Please select an elected date'),
    address: yup.string().required('Please enter an address'),
    monthlyHonorariumAmount: yup
      .string()
      .required('Please enter a monthly honorarium amount'),
    // resignDate: yup
    //   .string()
    //   .nullable()
    //   .required('Please select a resignation Date'),
    // reason: yup.string().required('Please enter a reason for resigning'),
    bankName: yup.number().required('Please select bank name'),
    branchName: yup.number().required('Please select a branch'),
    savingAccountNo: yup.string().required('Please enter savings account no.'),
    bankIfscCode: yup.string().required('Please enter bank IFSC code'),
    bankMicrCode: yup.string().required('Please enter bank MICR code'),
  })

  const {
    register,
    handleSubmit,
    // @ts-ignore
    reset,
    control,
    watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(corporatorSchema),
  })

  useEffect(() => {
    //Get Gender
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((res) => {
      console.log(res.data.gender)
      setGenderDropDown(
        res.data.gender.map((j) => ({
          id: j.id,
          genderEn: j.gender,
          genderMr: j.genderMr,
        }))
      )
    })

    //Get Caste
    axios.get(`${URLS.CFCURL}/master/cast/getAll`).then((res) => {
      console.log(res.data.mCast)
      setCasteDropDown(
        res.data.mCast.map((j) => ({
          id: j.id,
          casteEn: j.cast,
          casteMr: j.castMr,
        }))
      )
    })

    //Get Religion
    axios.get(`${URLS.CFCURL}/master/religion/getAll`).then((res) => {
      console.log(res.data.religion)
      setReligionDropDown(
        res.data.religion.map((j) => ({
          id: j.id,
          religionEn: j.religion,
          religionMr: j.religionMr,
        }))
      )
    })

    //Get Ward
    axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((res) => {
      console.log(res.data.ward)
      setWardDropDown(
        res.data.ward.map((j) => ({
          id: j.id,
          wardEn: j.wardName,
          wardMr: j.wardNameMr,
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

    //Get Party Name
    axios.get(`${URLS.MSURL}/mstDefinePartyName/getAll`).then((res) => {
      console.log(res.data.definePartyName)
      setPartyNameDropDown(
        res.data.definePartyName.map((j) => ({
          id: j.id,
          partyNameEn: j.partyName,
          partyNameMr: j.partyNameMr,
        }))
      )
    })

    //Get ID Proof Category
    axios
      .get(`${URLS.MSURL}/mstDefineIdentificationProof/getAll`)
      .then((res) => {
        console.log(res.data.identificationProof)
        setIdProofCategoryDropDown(
          res.data.identificationProof.map((j) => ({
            id: j.id,
            idProofCategoryEn: j.identificationProofDocument,
            // identificationProofDocumentMr: j.identificationProofDocumentMr,
          }))
        )
      })

    //Get Bank Name
    axios.get(`${URLS.CFCURL}/master/bank/getAll`).then((res) => {
      console.log(res.data.bank)
      setBankNameDropDown(
        res.data.bank.map((j) => ({
          id: j.id,
          bankNameEn: j.bankName,
          bankNameMr: j.bankNameMr,
          branchNameEn: j.branchName,
          branchNameMr: j.branchNameMr,
        }))
      )
    })
  }, [])

  const clearButton = () => {
    setIsNominated(false)
    reset({
      id: ID,
      firstName: null,
      middleName: '',
      lastname: '',
      firstNameMr: '',
      middleNameMr: '',
      lastnameMr: '',
      gender: '',
      religion: '',
      caste: '',
      ward: '',
      electedWard: '',
      party: '',
      dateOfBirth: null,
      casteCertificateNo: '',
      panNo: '',
      idProofCategory: '',
      idProofNo: '',
      electedDate: null,
      address: '',
      monthlyHonorariumAmount: null,
      resignDate: null,
      reason: '',

      bankName: '',
      branchName: '',
      savingAccountNo: '',
      bankIfscCode: '',
      bankMicrCode: '',
    })
  }

  const finalSubmit = (data) => {
    const bodyForAPI = { ...data, nominatedCorporators: isNominated }

    axios
      .post(`${URLS.MSURL}/mstDefineCorporators/save`, bodyForAPI)
      .then((res) => {
        console.log(res.data)
      })
  }

  return (
    <>
      <Head>
        <title>Define Corporators</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Define Corporators</div>

        <form style={{ padding: '0% 3%' }} onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.subTitle}>Personal Details</div>
          <div className={styles.row}>
            <div
              className={styles.row}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: 10,
              }}
            >
              <span
                style={{
                  fontWeight: 'bolder',
                  fontSize: 'medium',
                }}
              >
                <FormattedLabel id='nominatedCorporator' />
              </span>
              <Checkbox
                checked={isNominated}
                onChange={() => {
                  setIsNominated(!isNominated)
                }}
              />
            </div>
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='firstNameEn' />}
              variant='standard'
              {...register('firstName')}
              error={!!error.firstName}
              helperText={error?.firstName ? error.firstName.message : null}
            />
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='middleNameEn' />}
              variant='standard'
              {...register('middleName')}
              error={!!error.middleName}
              helperText={error?.middleName ? error.middleName.message : null}
            />
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='lastNameEn' />}
              variant='standard'
              {...register('lastname')}
              error={!!error.lastname}
              helperText={error?.lastname ? error.lastname.message : null}
            />
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='firstNameMr' />}
              variant='standard'
              {...register('firstNameMr')}
              error={!!error.firstNameMr}
              helperText={error?.firstNameMr ? error.firstNameMr.message : null}
            />
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='middleNameMr' />}
              variant='standard'
              {...register('middleNameMr')}
              error={!!error.middleNameMr}
              helperText={
                error?.middleNameMr ? error.middleNameMr.message : null
              }
            />
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='lastNameMr' />}
              variant='standard'
              {...register('lastnameMr')}
              error={!!error.lastnameMr}
              helperText={error?.lastnameMr ? error.lastnameMr.message : null}
            />
          </div>
          <div className={styles.row}>
            <FormControl variant='standard' error={!!error.gender}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='gender' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '230px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='gender'
                  >
                    {genderDropDown &&
                      genderDropDown.map((obj) => {
                        return (
                          <MenuItem value={obj.id}>
                            {language === 'en' ? obj.genderEn : obj.genderMr}
                          </MenuItem>
                        )
                      })}
                  </Select>
                )}
                name='gender'
                control={control}
              />
              <FormHelperText>
                {error?.gender ? error.gender.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.religion}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='religion' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '230px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='religion'
                  >
                    {religionDropDown &&
                      religionDropDown.map((obj) => {
                        return (
                          <MenuItem value={obj.id}>
                            {language === 'en'
                              ? obj.religionEn
                              : obj.religionMr}
                          </MenuItem>
                        )
                      })}
                  </Select>
                )}
                name='religion'
                control={control}
              />
              <FormHelperText>
                {error?.religion ? error.religion.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.caste}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='caste' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '230px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='caste'
                  >
                    {casteDropDown &&
                      casteDropDown.map((obj) => {
                        return (
                          <MenuItem value={obj.id}>
                            {language === 'en' ? obj.casteEn : obj.casteMr}
                          </MenuItem>
                        )
                      })}
                  </Select>
                )}
                name='caste'
                control={control}
              />
              <FormHelperText>
                {error?.caste ? error.caste.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div className={styles.row}>
            <FormControl variant='standard' error={!!error.ward}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='ward' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '230px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='ward'
                  >
                    {wardDropDown &&
                      wardDropDown.map((obj) => {
                        return (
                          <MenuItem value={obj.id}>
                            {language === 'en' ? obj.wardEn : obj.wardMr}
                          </MenuItem>
                        )
                      })}
                  </Select>
                )}
                name='ward'
                control={control}
              />
              <FormHelperText>
                {error?.ward ? error.ward.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.electedWard}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='electedWard' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '230px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='electedWard'
                  >
                    {electedWardDropDown &&
                      electedWardDropDown.map((obj) => {
                        return (
                          <MenuItem value={obj.id}>
                            {language === 'en'
                              ? obj.electedWardEn
                              : obj.electedWardMr}
                          </MenuItem>
                        )
                      })}
                  </Select>
                )}
                name='electedWard'
                control={control}
              />
              <FormHelperText>
                {error?.electedWard ? error.electedWard.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.party}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='partyName' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '230px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='party'
                  >
                    {partyNameDropDown &&
                      partyNameDropDown.map((obj) => {
                        return (
                          <MenuItem value={obj.id}>
                            {language === 'en'
                              ? obj.partyNameEn
                              : obj.partyNameMr}
                          </MenuItem>
                        )
                      })}
                  </Select>
                )}
                name='party'
                control={control}
              />
              <FormHelperText>
                {error?.party ? error.party.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <FormControl error={!!error.dateOfBirth}>
              <Controller
                control={control}
                name='dateOfBirth'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='dateOfBirth' />}
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(
                          moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '230px' }}
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
                {error?.dateOfBirth ? error.dateOfBirth.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='casteCertificateNo' />}
              variant='standard'
              {...register('casteCertificateNo')}
              error={!!error.casteCertificateNo}
              helperText={
                error?.casteCertificateNo
                  ? error.casteCertificateNo.message
                  : null
              }
            />
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='panNo' />}
              variant='standard'
              {...register('panNo')}
              error={!!error.panNo}
              helperText={error?.panNo ? error.panNo.message : null}
            />
          </div>
          <div className={styles.row}>
            <FormControl variant='standard' error={!!error.idProofCategory}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='idProofCategory' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '230px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='idProofCategory'
                  >
                    {idProofCategoryDropDown &&
                      idProofCategoryDropDown.map((obj) => {
                        return (
                          <MenuItem value={obj.id}>
                            {/* {language === 'en'
                              ? obj.idProofCategoryEn
                              : obj.idProofCategoryMr} */}
                            {obj.idProofCategoryEn}
                          </MenuItem>
                        )
                      })}
                  </Select>
                )}
                name='idProofCategory'
                control={control}
              />
              <FormHelperText>
                {error?.idProofCategory ? error.idProofCategory.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='idProofNo' />}
              variant='standard'
              {...register('idProofNo')}
              error={!!error.idProofNo}
              helperText={error?.idProofNo ? error.idProofNo.message : null}
            />
            <FormControl error={!!error.electedDate}>
              <Controller
                control={control}
                name='electedDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='electedDate' />}
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(
                          moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '230px' }}
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
                {error?.electedDate ? error.electedDate.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: '100%' }}
              label={<FormattedLabel id='address' />}
              variant='standard'
              {...register('address')}
              error={!!error.address}
              helperText={error?.address ? error.address.message : null}
            />
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='monthlyHonorariumAmount' />}
              type='number'
              variant='standard'
              {...register('monthlyHonorariumAmount')}
              error={!!error.monthlyHonorariumAmount}
              helperText={
                error?.monthlyHonorariumAmount
                  ? error.monthlyHonorariumAmount.message
                  : null
              }
            />
            <FormControl error={!!error.resignDate}>
              <Controller
                control={control}
                name='resignDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='resignDate' />}
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(
                          moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '230px' }}
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
                {error?.resignDate ? error.resignDate.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='reason' />}
              variant='standard'
              {...register('reason')}
              error={!!error.reason}
              helperText={error?.reason ? error.reason.message : null}
            />
          </div>
          <div className={styles.subTitle}>Bank Details</div>
          <div className={styles.row}>
            <FormControl variant='standard' error={!!error.bankName}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='bankName' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '230px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => {
                      setBranchNameDropDown(
                        bankNameDropDown.filter((obj) => {
                          return obj.id === value.target.value
                        })
                      )
                      field.onChange(value)
                    }}
                    label='bankName'
                  >
                    {bankNameDropDown &&
                      bankNameDropDown.map((obj) => {
                        return (
                          <MenuItem value={obj.id}>
                            {language === 'en'
                              ? obj.bankNameEn
                              : obj.bankNameMr}
                          </MenuItem>
                        )
                      })}
                  </Select>
                )}
                name='bankName'
                control={control}
              />
              <FormHelperText>
                {error?.bankName ? error.bankName.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={watch('bankName') ? false : true}
              variant='standard'
              error={!!error.branchName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='branchName' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '230px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='branchName'
                  >
                    {branchNameDropDown &&
                      branchNameDropDown.map((obj) => {
                        return (
                          <MenuItem value={obj.id}>
                            {language === 'en'
                              ? obj.branchNameEn
                              : obj.branchNameMr}
                          </MenuItem>
                        )
                      })}
                  </Select>
                )}
                name='branchName'
                control={control}
              />
              <FormHelperText>
                {error?.branchName ? error.branchName.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='savingAccountNo' />}
              variant='standard'
              {...register('savingAccountNo')}
              error={!!error.savingAccountNo}
              helperText={
                error?.savingAccountNo ? error.savingAccountNo.message : null
              }
            />
          </div>
          <div className={styles.twoFields}>
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='bankIFSCcode' />}
              type='number'
              variant='standard'
              {...register('bankIfscCode')}
              error={!!error.bankIfscCode}
              helperText={
                error?.bankIfscCode ? error.bankIfscCode.message : null
              }
            />
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='bankMICRcode' />}
              type='number'
              variant='standard'
              {...register('bankMicrCode')}
              error={!!error.bankMicrCode}
              helperText={
                error?.bankMicrCode ? error.bankMicrCode.message : null
              }
            />
          </div>
          <div className={styles.buttons}>
            <Button
              variant='contained'
              type='submit'
              endIcon={<Save />}
              color='success'
            >
              <FormattedLabel id='save' />
            </Button>
            <Button
              variant='outlined'
              color='error'
              endIcon={<Clear />}
              onClick={() => {
                clearButton()
              }}
            >
              <FormattedLabel id='clear' />
            </Button>
            <Button
              variant='contained'
              color='error'
              endIcon={<ExitToApp />}
              onClick={() => {
                router.back()
              }}
            >
              <FormattedLabel id='exit' />
            </Button>
          </div>
        </form>
      </Paper>
    </>
  )
}

export default Index
