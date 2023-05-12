import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material'
import sweetAlert from 'sweetalert'
import { ThemeProvider } from '@mui/styles'
import { Stack } from '@mui/system'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router.js'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ToWords } from 'to-words'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel.js'
import theme from '../../../../theme.js'
import urls from '../../../../URLS/urls.js'

// Loi Generation
const LoiGenerationComponent = (props) => {
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const toWords = new ToWords()
  const router = useRouter()
  const [serviceNames, setServiceNames] = useState([])
  const [serviceCharge, setServiceCharges] = useState([])
  const [serviceId, setServiceId] = useState(null)

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'serviceCharges', // unique name for your Field Array
    },
  )
  const language = useSelector((state) => state?.labels.language)

  // lOI GENERATION PREVIEW

  const [loiGenerationReceiptDailog, setLoiGenerationReceiptDailog] = useState(
    false,
  )
  const loiGenerationReceiptDailogOpen = () =>
    setLoiGenerationReceiptDailog(true)
  const loiGenerationReceiptDailogClose = () =>
    setLoiGenerationReceiptDailog(false)

  // const loi Recipit - Preview
  const loiGenerationReceipt = () => {
    loiGenerationReceiptDailogOpen()
  }
  const [inputState, setInputState] = useState(false)

  // title
  // const [titles, setTitles] = useState([])

  // // getTitles
  // const getTitles = () => {
  //   axios.get(`${urls.CfcURLMaster}/title/getAll`).then((r) => {
  //     setTitles(
  //       r.data.title.map((row) => ({
  //         id: row.id,
  //         aTitle: row.title,
  //         titleMr: row.titleMr,
  //       })),
  //     )
  //   })
  // }

  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            })),
          )
        } else {
          message.error('Filed To Load !! Please Try Again !')
        }
      })
      .catch((err) => {
        console.log(err)
        toast.success('Error !', {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const getServiceCharges = () => {
    axios
      .get(
        `${urls.CFCURL
        }/master/servicecharges/getByServiceId?serviceId=${getValues(
          'serviceId',
        )}`,
      )
      .then((r) => {
        // setValue('serviceCharges', r.data.serviceCharge)
        // setServiceCharges(r.data.serviceCharge)
      })
  }

  const getLoiGenerationData = () => {
    axios
      .get(
        `${urls.SSLM}/Trn/ApplicantDetails/getByIdAndServicIdAndID?serviceId=8&id=${router?.query?.id}`,
      )
      .then((r) => {
        // console.log('r.data.status', r)
        if (r.status === 200) {
          setServiceId(r.data.trnApplicantDetailsDao[0].serviceId)
          console.log('resp.data', r.data.trnApplicantDetailsDao[0])
          reset(r.data.trnApplicantDetailsDao[0])
          setValue('serviceName', r.data.trnApplicantDetailsDao[0].serviceId)
          setValue('applicationNumber', r.data.trnApplicantDetailsDao[0].id)
          setValue('afName', r.data.trnApplicantDetailsDao[0].firstName)
          setValue('amName', r.data.trnApplicantDetailsDao[0].middleName)
          setValue('alName', r.data.trnApplicantDetailsDao[0].lastName)
          setValue('aemail', r.data.trnApplicantDetailsDao[0].emailAddress)
          setValue('amobileNo', r.data.trnApplicantDetailsDao[0].mobile)
        }
      })
  }

  useEffect(() => {
    getserviceNames()
    getlicenseType();
    getDurationOfLicenseValiditys();
    if (router?.query?.id) getLoiGenerationData()
  }, [])

  useEffect(() => {
    getServiceCharges()
  }, [serviceId])

  useEffect(() => {
    let total = 0
    serviceCharge.forEach((data) => {
      total += data.amount
    })
    setValue('loi.amount', total)
    setValue('loi.totalInWords', toWords.convert(total))
  }, [serviceCharge])

  const [licenseTypes, setlicenseTypes] = useState([]);

  const getlicenseType = () => {
    axios.get(`${urls.SSLM}/master/MstLicenseType/getAll`).then((r) => {
      setlicenseTypes(
        r.data.MstLicenseType.map((row) => ({
          id: row.id,
          licenseType: row.licenseType,
        }))
      );
    });
  };

  const [durationOfLicenseValiditys, setDurationOfLicenseValiditys] =
    useState();

  const getDurationOfLicenseValiditys = () => {
    axios.get(`${urls.SSLM}/master/MstLicenseValidity/getAll`).then((res) => {
      if (res.status == 200) {
        setDurationOfLicenseValiditys(
          res.data.MstLicenseValidity.map((r) => ({
            id: r.id,
            licenseValidity: r.licenseValidity,
            licenseType: r.licenseType,
          }))
        );
      }
    });
  };
  // Handle Next
  const handleNext = (data) => {
    // const loi = {
    // ...data.loi,
    // amount: loi?.amount,
    // boardReg: getValues('id'),
    // }
    // loi,
    // role: 'LOI_GENERATION',
    // loiServiceCharges: getValues('serviceCharges'),
    // applicableChargesDao
    // payement: ,
    // {
    //   headers: {
    //     role: 'LOI_GENERATION',
    //     id: data.id,
    //   },
    // },

    let finalBodyForApi = {
      // ...data,
      role: router?.query?.role,
      // payment: null,
      id: router?.query?.id,
      trnLoiDao: { trnLoiServiceChargesDao: [{}] }
    }

    axios
      .post(
        `${urls.SSLM}/Trn/ApplicantDetails/saveApplicationApprove`,
        finalBodyForApi,
      )
      .then((res) => {

        if (res.status == 200 || res.status == 201) {

          router.push({
            pathname:
              '/skySignLicense/transactions/issuanceOfIndustry/LoiGenerationReciptmarathi',
            query: {
              id: router?.query?.id,
            },
          })
        }

      })

    // router.push({
    //   pathname:
    //     '/skySignLicense/transactions/issuanceOfBusinessOrIndustry/LoiGenerationReciptmarathi',
    //   query: {
    //     id: router?.query?.id,
    //   },
    // })

  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <form onSubmit={handleSubmit(handleNext)}>
          <div
            style={{
              backgroundColor: '#0084ff',
              color: 'white',
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: '40px',
              marginRight: '40px',
              borderRadius: 100,
            }}
          >
            <strong>
              {/* <FormattedLabel id="applicantDetails" /> */}
              Applicant Details
            </strong>
          </div>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: '50px',
              align: 'center',
            }}
          >
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {/* {<FormattedLabel id="serviceName" />} */}
                  Service Name
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ minWidth: '230px', width: '500px' }}
                      // // dissabled={inputState}
                      autoFocus
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Service Name *"
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      {serviceNames &&
                        serviceNames.map((serviceName, index) => (
                          <MenuItem key={index} value={serviceName.id}>
                            {language == 'en'
                              ? serviceName?.serviceName
                              : serviceName?.serviceNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="serviceName"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid>

            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch('applicationNumber') ? true : false) ||
                    (router?.query?.applicationNumber ? true : false),
                }}
                disabled={true}
                // label={<FormattedLabel id="applicationNo" />}
                label="Application No."
                {...register('applicationNumber')}
                error={!!errors.applicationNumber}
                helperText={
                  errors?.applicationNumber
                    ? errors.applicationNumber.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <FormControl
                sx={{ marginTop: 0 }}
                error={!!errors.applicationDate}
              >
                <Controller
                  name="applicationDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={true}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16, marginTop: 2 }}>
                            {/* {<FormattedLabel id="applicationDate" />} */}
                            Application Date
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format('YYYY-MM-DD'))
                        }
                        selected={field.value}
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
                  {errors?.applicationDate
                    ? errors.applicationDate.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch('afName') ? true : false) ||
                    (router?.query?.afName ? true : false),
                }}
                disabled={true}
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="firstName" />}
                label="First Name"
                {...register('afName')}
                error={!!errors.afName}
                helperText={errors?.afName ? errors.afName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch('amName') ? true : false) ||
                    (router?.query?.amName ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="middleName" />}
                label="Middle Name"
                {...register('amName')}
                error={!!errors.amName}
                helperText={errors?.amName ? errors.amName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch('alName') ? true : false) ||
                    (router?.query?.alName ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="lastName" />}
                label="Last Name"
                {...register('alName')}
                error={!!errors.alName}
                helperText={errors?.alName ? errors.alName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch('aemail') ? true : false) ||
                    (router?.query?.aemail ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="email" />}
                label="Email"
                {...register('aemail')}
                error={!!errors.aemail}
                helperText={errors?.aemail ? errors.aemail.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch('amobileNo') ? true : false) ||
                    (router?.query?.amobileNo ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                // label={<FormattedLabel id="mobileNo" />}
                label="Mobile No"
                {...register('amobileNo')}
                error={!!errors.amobileNo}
                helperText={errors?.amobileNo ? errors.amobileNo.message : null}
              />
            </Grid>
          </Grid>
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "40px",
              borderRadius: 100,
            }}
          >
            <strong>
              <FormattedLabel id="licenseValidity" />
            </strong>
          </div>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
                error={!!errors.licenseType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  license Type
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="License Type"
                    >
                      {licenseTypes &&
                        licenseTypes.map((licenseType, index) => (
                          <MenuItem key={index} value={licenseType.id}>
                            {licenseType.licenseType}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="licenseType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.licenseType ? errors.licenseType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
                error={!!errors.licenseType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="durationOfLicenseValidity" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
                      sx={{ width: 250 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="durationOfLicenseValidity" />}
                    >
                      {durationOfLicenseValiditys &&
                        durationOfLicenseValiditys.map(
                          (licenseValidity, index) => (
                            <MenuItem key={index} value={licenseValidity.id}>
                              {licenseValidity.licenseValidity}
                            </MenuItem>
                          )
                        )}
                    </Select>
                  )}
                  name="trnLoiDao.durationOfLicenseValidity"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.licenseType ? errors.licenseType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl flexDirection="row">
                <FormLabel
                  sx={{ width: "230px" }}
                  id="demo-row-radio-buttons-group-label"
                >
                  {<FormattedLabel id="licenseDuration" />}
                </FormLabel>

                <Controller
                  name="trnLoiDao.licenseDuration"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      // disabled={inputState}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        value="financial Year"
                        // disabled={inputState}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="financialYear" />}
                        error={!!errors.licenseDuration}
                        helperText={
                          errors?.licenseDuration
                            ? errors.licenseDuration.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value="calendar year"
                        // disabled={inputState}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="calendarYear" />}
                        error={!!errors.licenseDuration}
                        helperText={
                          errors?.licenseDuration
                            ? errors.licenseDuration.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value="date of issuance"
                        // disabled={inputState}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="dateOfIssuance" />}
                        error={!!errors.licenseDuration}
                        helperText={
                          errors?.licenseDuration
                            ? errors.licenseDuration.message
                            : null
                        }
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
          <div
            style={{
              backgroundColor: '#0084ff',
              color: 'white',
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: '40px',
              marginRight: '40px',
              borderRadius: 100,
            }}
          >
            <strong>
              {/* <FormattedLabel id="chargesDetails" /> */}
              Charges Details
            </strong>
          </div>
          {serviceCharge.length > 0 && (
            <>
              {fields.map((serviceChargeId, index) => {
                return (
                  <Grid
                    container
                    key={index}
                    sx={{
                      paddingLeft: '50px',
                      align: 'center',
                    }}
                  >
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        id="standard-basic"
                        key={serviceChargeId.id}
                        disabled={true}
                        label={<FormattedLabel id="serviceChargeTypeName" />}
                        {...register(
                          `serviceCharges.${index}.serviceChargeTypeName`,
                        )}

                      // error={!!errors.serviceChargeType}
                      // helperText={
                      //   errors?.serviceChargeType
                      //     ? errors.serviceChargeType.message
                      //     : null
                      // }
                      />
                    </Grid>
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        sx={{ width: '240px' }}
                        id="standard-basic"
                        disabled={true}
                        key={serviceChargeId.id}
                        label={<FormattedLabel id="chargeName" />}
                        {...register(`serviceCharges.${index}.chargeName`)}
                      // error={!!errors.charge}
                      // helperText={errors?.charge ? errors.charge.message : null}
                      />
                    </Grid>
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <TextField
                        sx={{ width: '250px' }}
                        id="standard-basic"
                        disabled={true}
                        key={serviceChargeId.id}
                        label={<FormattedLabel id="amount" />}
                        {...register(`serviceCharges.${index}.amount`)}
                      // error={!!errors.amount}
                      // helperText={errors?.amount ? errors.amount.message : null}
                      />
                    </Grid>
                  </Grid>
                )
              })}
            </>
          )}
          <Grid
            container
            sx={{
              paddingLeft: '50px',
              align: 'center',
              backgroundColor: 'primary',
              // border: "4px solid black",
            }}
          >
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}></Grid>

            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                // label={<FormattedLabel id="totalCharges" />}
                label="Total Charges"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register('loi.amount')}
                error={!!errors.total}
                helperText={errors?.total ? errors.total.message : null}
              />
            </Grid>
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                // label={<FormattedLabel id="totalInWords" />}
                label="Total in Words"
                {...register('loi.totalInWords')}
                error={!!errors.totalInWords}
                helperText={
                  errors?.totalInWords ? errors.totalInWords.message : null
                }
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: 'flex',
                marginTop: '30px',
                justifyContent: 'center',
                alignItem: 'center',
              }}
            >
              <Stack spacing={5} direction="row">
                <Button
                  type="submit"
                  sx={{ width: '230 px' }}
                  variant="contained"
                // onClick={() =>
                //   router.push({
                //     pathname:
                //       '/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationReciptmarathi',
                //     query: {
                //       applicationId: getValues('id'),
                //     },
                //   })
                // }
                >
                  {/* <FormattedLabel id="generateLoi" /> */}
                  Generate LOI
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </ThemeProvider>
    </>
  )
}

export default LoiGenerationComponent