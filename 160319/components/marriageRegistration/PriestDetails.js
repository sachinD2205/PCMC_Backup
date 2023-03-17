import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FormattedLabel from '../../containers/reuseableComponents/FormattedLabel'
import urls from '../../URLS/urls'
import styles from '../marriageRegistration/view.module.css'

// view - priest
const PriestDetails = () => {
  const language = useSelector((state) => state?.labels.language)
  const [pGenders, setPGenders] = useState([])
  const router = useRouter()
  const [disabled, setDisabled] = useState(false)
  const [religions, setReligions] = useState([])
  const [pTitles, setpTitles] = useState([])

  const {
    control,
    register,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext()

  useEffect(() => {
    if (router.query.pageMode === 'Add' || router.query.pageMode === 'Edit') {
      setDisabled(false)
      console.log('enabled')
    } else {
      setValue(
        'page',
        moment(getValues('marriageDate')).format('YYYY') -
          moment(getValues('pbirthDate')).format('YYYY'),
      )

      setDisabled(true)
      console.log('disabled')
    }
  }, [])

  // getPGenders
  const getPGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setPGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
      )
    })
  }

  // getReligion
  const getReligions = () => {
    axios.get(`${urls.CFCURL}/master/religion/getAll`).then((r) => {
      setReligions(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
          religionMr: row.religionMr,
        })),
      )
    })
  }

  // getTitles
  const getpTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setpTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titlemr: row.titleMr,
        })),
      )
    })
  }

  useEffect(() => {
    getPGenders()
    getReligions()
    getpTitles()
  }, [])

  // useEffect(() => {
  //   setValue(
  //     'page',
  //     moment(getValues('marriageDate')).format('YYYY') -
  //       moment(getValues('pbirthDate')).format('YYYY'),
  //   )
  //   // dateConverter()
  // }, [getValues('marriageDate'),getValues('pbirthDate')])

  // const dateConverter = (pBirthDates, marriageDate) => {
  //   const pristAge = Math.floor(
  //     moment(getValues('marriageDate')).format('YYYY') -
  //       moment(getValues('pbirthDate')).format('YYYY'),
  //   )

  //   console.log('a1234', pristAge)
  // }

  // view - Priest
  return (
    <>
      <div className={styles.small}>
        <h4
          style={{
            marginLeft: '40px',
            color: 'red',
            fontStyle: 'italic',
            marginTop: '25px',
          }}
        >
          {<FormattedLabel id="onlyMHR" />}
        </h4>
        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: 'white',
                marginTop: '7px',
              }}
            >
              {' '}
              {<FormattedLabel id="priestDetails" />}{' '}
            </h3>
          </div>
        </div>

        {/* <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="marrigeDetails" />}
            </h3>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl sx={{ marginTop: 0 }} error={!!errors.pbirthDate}>
              <Controller
                control={control}
                name='pbirthDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='DD/MM/YYYY'
                      label={
                        <span style={{ fontSize: 14 }}>
                          {' '}
                          {<FormattedLabel id="marrigeDate" />}
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          fullWidth
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.pbirthDate ? errors.pbirthDate.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              id='standard-basic'
              label={<FormattedLabel id='placeofMarriage' />}
              variant='standard'
              {...register("pPlaceOfMarriage")}
              error={!!errors.pPlaceOfMarriage}
              helperText={
                errors?.pPlaceOfMarriage
                  ? errors.pPlaceOfMarriage.message
                  : null
              }
            />
          </div>

          <div>
            <TextField
              id='standard-basic'
              label={<FormattedLabel id='placeofMarriage1' />}
              variant='standard'
              {...register("pPlaceOfMarriage")}
              error={!!errors.pPlaceOfMarriage}
              helperText={
                errors?.pPlaceOfMarriage
                  ? errors.pPlaceOfMarriage.message
                  : null
              }
            />
          </div>
        </div> */}

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: 'white',
                marginTop: '7px',
              }}
            >
              {' '}
              {<FormattedLabel id="personalDetails" />}
            </h3>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl
              variant="standard"
              error={!!errors.ptitle}
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="title" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {pTitles &&
                      pTitles.map((ptitle, index) => (
                        <MenuItem key={index} value={ptitle.id}>
                          {/* {title.title} */}
                          {language == 'en' ? ptitle?.title : ptitle?.titlemr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="ptitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.ptitle ? errors.ptitle.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              // InputLabelProps={{ shrink: (watch('pfName') ? true : false) || (router.query.pfName ? true : false) }}
              id="standard-basic"
              label={<FormattedLabel id="firstName" required />}
              variant="standard"
              disabled={disabled}
              {...register('pfName')}
              error={!!errors.pfName}
              helperText={errors?.pfName ? errors.pfName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('pmName') ? true : false) ||
                  (router.query.pmName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="middleName" />}
              variant="standard"
              disabled={disabled}
              {...register('pmName')}
              error={!!errors.pmName}
              helperText={errors?.pmName ? errors.pmName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('plName') ? true : false) ||
                  (router.query.plName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="lastName" required />}
              variant="standard"
              disabled={disabled}
              {...register('plName')}
              error={!!errors.plName}
              helperText={errors?.plName ? errors.plName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl sx={{ marginTop: 0 }} error={!!errors.pbirthDate}>
              <Controller
                control={control}
                name="pbirthDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={disabled}
                      maxDate={new Date()}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 13 }}>
                          {' '}
                          {<FormattedLabel id="BirthDate" required />}
                        </span>
                      }
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format('YYYY-MM-DD'))

                        setValue(
                          'page',
                          moment(getValues('marriageDate')).format('YYYY') -
                            moment(getValues('pbirthDate')).format('YYYY'),
                        )
                      }}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.pbirthDate ? errors.pbirthDate.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="Age" required />}
              variant="standard"
              disabled
              {...register('page')}
              error={!!errors.page}
              helperText={errors?.page ? errors.page.message : null}
            />
          </div>

          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.pgender}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Gender" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Gender *"
                  >
                    {pGenders &&
                      pGenders.map((pgender, index) => (
                        <MenuItem key={index} value={pgender.id}>
                          {/* {pgender.pgender} */}
                          {language == 'en'
                            ? pgender?.gender
                            : pgender?.genderMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="pgender"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.pgender ? errors.pgender.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('paadharNo') ? true : false) ||
                  (router.query.paadharNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNo" required />}
              variant="standard"
              disabled={disabled}
              {...register('paadharNo')}
              error={!!errors.paadharNo}
              helperText={errors?.paadharNo ? errors.paadharNo.message : null}
            />
          </div>
        </div>
        <div className={styles.row} style={{ marginRight: '25%' }}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('pemail') ? true : false) ||
                  (router.query.pemail ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="email" />}
              variant="standard"
              disabled={disabled}
              {...register('pemail')}
              error={!!errors.pemail}
              helperText={errors?.pemail ? errors.pemail.message : null}
            />
          </div>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.preligionByBirth}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Religion1" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=" Religion by Birth"
                  >
                    {religions &&
                      religions.map((preligionByBirth, index) => (
                        <MenuItem key={index} value={preligionByBirth.id}>
                          {/* {preligionByBirth.preligionByBirth} */}
                          {language == 'en'
                            ? preligionByBirth?.religion
                            : preligionByBirth?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="preligionByBirth"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.preligionByBirth
                  ? errors.preligionByBirth.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.preligionByAdoption}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Religion2" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  Religion by Adoption"
                  >
                    {religions &&
                      religions.map((preligionByAdoption, index) => (
                        <MenuItem key={index} value={preligionByAdoption.id}>
                          {/* {preligionByAdoption.preligionByAdoption} */}
                          {language == 'en'
                            ? preligionByAdoption?.religion
                            : preligionByAdoption?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="preligionByAdoption"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.preligionByAdoption
                  ? errors.preligionByAdoption.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: 'white',
                marginTop: '7px',
              }}
            >
              {' '}
              {<FormattedLabel id="Adress" />}
            </h3>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('pbuildingNo') ? true : false) ||
                  (router.query.pbuildingNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" required />}
              variant="standard"
              disabled={disabled}
              {...register('pbuildingNo')}
              error={!!errors.pbuildingNo}
              helperText={
                errors?.pbuildingNo ? errors.pbuildingNo.message : null
              }
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('pbuildingName') ? true : false) ||
                  (router.query.pbuildingName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" required />}
              variant="standard"
              disabled={disabled}
              {...register('pbuildingName')}
              error={!!errors.pbuildingName}
              helperText={
                errors?.pbuildingName ? errors.pbuildingName.message : null
              }
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('proadName') ? true : false) ||
                  (router.query.proadName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadName" required />}
              variant="standard"
              disabled={disabled}
              {...register('proadName')}
              error={!!errors.proadName}
              helperText={errors?.proadName ? errors.proadName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('plandmark') ? true : false) ||
                  (router.query.plandmark ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" required />}
              variant="standard"
              disabled={disabled}
              {...register('plandmark')}
              error={!!errors.plandmark}
              helperText={errors?.plandmark ? errors.plandmark.message : null}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('pcityName') ? true : false) ||
                  (router.query.pcityName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" required />}
              variant="standard"
              disabled={disabled}
              {...register('pcityName')}
              error={!!errors.pcityName}
              helperText={errors?.pcityName ? errors.pcityName.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('pstate') ? true : false) ||
                  (router.query.pstate ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="state" required />}
              variant="standard"
              disabled={disabled}
              {...register('pstate')}
              error={!!errors.pstate}
              helperText={errors?.pstate ? errors.pstate.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('ppincode') ? true : false) ||
                  (router.query.ppincode ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="pincode" required />}
              variant="standard"
              disabled={disabled}
              {...register('ppincode')}
              error={!!errors.ppincode}
              helperText={errors?.ppincode ? errors.ppincode.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch('pmobileNo') ? true : false) ||
                  (router.query.pmobileNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNo" />}
              variant="standard"
              disabled={disabled}
              {...register('pmobileNo')}
              error={!!errors.pmobileNo}
              helperText={errors?.pmobileNo ? errors.pmobileNo.message : null}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default PriestDetails
