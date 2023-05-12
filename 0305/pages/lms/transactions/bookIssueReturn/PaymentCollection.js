import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import swal from 'sweetalert'
import { ToWords } from 'to-words'
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import theme from '../../../../theme'
import urls from '../../../../URLS/urls'
import styles from './PaymentCollection.module.css'

const Index = () => {
  let user = useSelector((state) => state.user.user)
  const router = useRouter()
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm()

  const onlinModes = [
    {
      id: 1,
      paymentModePrefixMr: null,
      paymentModePrefix: 'Test payment Mode Prefix ',
      fromDate: '2022-12-11',
      toDate: '2022-12-12',
      paymentModeMr: null,
      paymentMode: 'UPI',
      paymentTypeId: null,
      remark: 'remark',
      remarkMr: null,
      activeFlag: 'Y',
    },
    {
      id: 2,
      paymentModePrefixMr: null,
      paymentModePrefix: 'test payment mode prefix 2',
      fromDate: '2019-02-11',
      toDate: '2022-10-10',
      paymentModeMr: null,
      paymentMode: 'Net Banking',
      paymentTypeId: null,
      remark: 'Done',
      remarkMr: null,
      activeFlag: 'Y',
    },
  ]


  const validatePay = () => {
    if (
      watch('accountNumber') === undefined ||
      watch('accountNumber') === '' ||
      watch('bankName') === undefined ||
      watch('bankName') === '' ||
      watch('branchName') === undefined ||
      watch('branchName') === '' ||
      watch('ifsc') === undefined ||
      watch('ifsc') === ''
    ) {
      return true
    } else {
      return false
    }
  }

  const handleExit = () => {
    swal('Exit!', 'Successfully Exitted  Payment!', 'success')
    if (router.query.applicationSide == "Citizen") {
      router.push({
        pathname: `/dashboard`,
      })
    } else {
      router.push(
        '/lms/transactions/bookIssueReturn',
      )
    }
  }

  const handlePay = () => {
    setValue('payment.amount', router?.query?.temp)
    // const finalBody = {
    //   id: Number(router?.query?.id),
    //   lostRemark: remark
    //   // role: 'CASHIER',
    //   // loi: getValues('loi'),
    //   // paymentDao: getValues('payment'),
    // }

    axios
      .post(
        `${urls.LMSURL}/trnBookIssueReturn/markBookAsLost?id=${Number(router?.query?.id)}&lostRemark=${router?.query?.remark}`,
      )
      .then((res) => {
        console.log(res)
        swal('Submitted!', 'Fine Collected successfully  !', 'success')
        if (res.status == 200 || res.status == 201) {
          router.push({
            pathname:
              '/lms/transactions/bookIssueReturn',
          })
        }
      })
      .catch((err) => {
        swal('Error!', 'Somethings Wrong!', 'error')
        router.push(
          '/lms/transactions/bookIssueReturn',
        )
      })
  }

  const language = useSelector((state) => state?.labels.language)

  const [paymentTypes, setPaymentTypes] = useState([])

  const getPaymentTypes = () => {
    axios.get(`${urls.CFCURL}/master/paymentType/getAll`).then((r) => {
      setPaymentTypes(
        r.data.paymentType.map((row) => ({
          id: row.id,
          paymentType: row.paymentType,
          paymentTypeMr: row.paymentTypeMr,
        })),
      )
    })
  }

  const [paymentModes, setPaymentModes] = useState([])
  const [pmode, setPmode] = useState([])
  const getPaymentModes = () => {
    axios.get(`${urls.BaseURL}/paymentMode/getAll`).then((r) => {
      setPmode(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        })),
      )
    })
  }

  const [dataa, setDataa] = useState(null)

  useEffect(() => {
    getPaymentTypes()
    getPaymentModes()
  }, [])

  useEffect(() => {
    console.log('paymenttype', watch('payment.paymentType'))
    if (watch('payment.paymentType') === 'Online') {
      setPaymentModes(onlinModes)
    } else {
      setPaymentModes(pmode)
    }
  }, [watch('payment.paymentType')])
  // const [data, setdata] = useState()





  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 10,
            marginRight: 2,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
            border: 2,
            borderColor: 'black.500',
          }}
        >
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                Payment Collection
              </h3>
            </div>
          </div>
          <div className={styles.appDetails}>
            {/* <div className={styles.row} >
                            <div > */}
            <h4>सदस्यत्व क्र : {router?.query?.membershipNo}</h4>
            {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
            <h4>सदस्यत्व नाव :{' ' + router?.query?.memberName}</h4>
            {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
            <h4>
              दिनांक :{' '}
              {moment(new Date()).format('DD-MM-YYYY')}
            </h4>
            {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
            {/* </div>
                        </div> */}
            <div className={styles.row5}></div>
            <h4>एकुण रक्कम : {router?.query?.temp}&nbsp;रु</h4>

            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={2}>अ.क्र</th>
                  <th colSpan={8}>शुल्काचे नाव</th>
                  <th colSpan={2}>रक्कम(रु)</th>
                </tr>
                <tr>
                  <td colSpan={4}>1)</td>
                  <td colSpan={4}>हरवलेल्या पुस्तकाचे तपशिल</td>
                  <td colSpan={4}>{router?.query?.temp}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4}>
                    <b></b>
                  </td>
                  <td colSpan={4}>
                    <b></b>
                  </td>
                  <td colSpan={4}>
                    <b>एकूण रक्कम : {router?.query?.temp}/-</b>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className={styles.details} style={{ marginLeft: 0, marginRight: 0 }}>
              <div className={styles.h1Tag}>
                <h3
                  style={{
                    color: 'white',
                    marginTop: '7px',
                  }}
                >
                  {/* <FormattedLabel id="receiptModeDetails" /> */}
                  Payment Details
                </h3>
              </div>
            </div>
            <Grid
              container
              sx={{
                marginTop: 1,
                marginBottom: 5,
                // paddingLeft: '50px',
                align: 'center',
              }}
            >
              <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                <FormControl error={!!errors.paymentType} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* {<FormattedLabel id="paymentType" />} */}
                    Payment Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ minWidth: '230px' }}
                        // // dissabled={inputState}
                        autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        // label=<FormattedLabel id="paymentType" />
                        label="Payment Type"
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {paymentTypes &&
                          paymentTypes.map((paymentType, index) => (
                            <MenuItem
                              key={index}
                              value={paymentType.paymentType}
                            >
                              {language == 'en'
                                ? paymentType?.paymentType
                                : paymentType?.paymentTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="payment.paymentType"
                    control={control}
                    defaultValue=""
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                <FormControl error={!!errors.paymentMode} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* {<FormattedLabel id="paymentMode" />} */}
                    Payment Mode
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ minWidth: '230px' }}
                        // // dissabled={inputState}
                        autoFocus
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                        }}
                        // label={<FormattedLabel id="paymentMode" />}
                        label="Payment Mode"
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {paymentModes &&
                          paymentModes.map((paymentMode, index) => (
                            <MenuItem
                              key={index}
                              value={paymentMode.paymentMode}
                            >
                              {language == 'en'
                                ? paymentMode?.paymentMode
                                : paymentMode?.paymentModeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="payment.paymentMode"
                    control={control}
                    defaultValue=""
                  />
                </FormControl>
              </Grid>

              {watch('payment.paymentMode') == 'DD' && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="bankName" />}
                      label="Bank Name"
                      variant="standard"
                      {...register('payment.bankName')}
                      error={!!errors.bankName}
                      helperText={
                        errors?.bankName ? errors.bankName.message : null
                      }
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="bankAccountNo" />}
                      label="Bank Account No"
                      variant="standard"
                      {...register('payment.accountNo')}
                      error={!!errors.accountNo}
                      helperText={
                        errors?.accountNo ? errors.accountNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="ddNo" />}
                      label="DD No"
                      variant="standard"
                      {...register('payment.ddNo')}
                      error={!!errors.ddNo}
                      helperText={errors?.ddNo ? errors.ddNo.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <FormControl sx={{ marginTop: 0 }} error={!!errors.dDDate}>
                      <Controller
                        name="payment.ddDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16, marginTop: 2 }}>
                                  {/* <FormattedLabel id="ddDate" /> */}
                                  DD Date
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format('YYYY-MM-DD'),
                                )
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
                        {errors?.ddDate ? errors.ddDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}



              {watch('payment.paymentMode') == 'UPI' && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      // disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="bankName" />}
                      label="UPI ID"
                      variant="standard"
                      {...register('payment.upiId')}
                      error={!!errors.upiId}
                      helperText={errors?.upiId ? errors.upiId.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 2 }}
                      error={!!errors.upilist}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        UPI LIST
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Status at time of marriage *"
                          >
                            <MenuItem value={1}>@ybl</MenuItem>
                            <MenuItem value={2}>@okaxis</MenuItem>
                            <MenuItem value={3}>@okicici</MenuItem>
                          </Select>
                        )}
                        name="upilist"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.upilist ? errors.upilist.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}

              {watch('payment.paymentMode') == 'Net Banking' && (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label={<FormattedLabel id="bankName" required />}
                      label="Bank Name"
                      variant="standard"
                      {...register('bankName')}
                    // error={!!errors.aFName}
                    // helperText={errors?.aFName ? errors.aFName.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //disabled={inputState}
                      id="standard-basic"
                      // label={<FormattedLabel id="branchName" />}
                      label="Branch Name"
                      variant="standard"
                      {...register('branchName')}
                      error={!!errors.branchName}
                      helperText={
                        errors?.branchName ? errors.branchName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label={<FormattedLabel id="ifsc" required />}
                      label="IFSC"
                      variant="standard"
                      {...register('ifsc')}
                    // error={!!errors.aFName}
                    // helperText={errors?.aFName ? errors.aFName.message : null}
                    />
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      //  disabled
                      sx={{ width: 230 }}
                      id="standard-basic"
                      // label={<FormattedLabel id="accountNumber" required />}
                      label="Account No"
                      variant="standard"
                      {...register('accountNumber')}
                    // error={!!errors.aFName}
                    // helperText={errors?.aFName ? errors.aFName.message : null}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <div>
              <div className={styles.row4}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    //disabled={validatePay()}
                    onClick={() => {
                      handlePay()
                    }}
                  >
                    {/* {<FormattedLabel id="pay" />} */}
                    Pay
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    // disabled={validateSearch()}

                    onClick={() => {
                      swal({
                        title: 'Exit?',
                        text: 'Are you sure you want to exit this Record ? ',
                        icon: 'warning',
                        buttons: true,
                        dangerMode: true,
                      }).then((willDelete) => {
                        if (willDelete) {
                          swal('Record is Successfully Exit!', {
                            icon: 'success',
                          })
                          handleExit()
                        } else {
                          swal('Record is Safe')
                        }
                      })
                    }}
                  >
                    {/* {<FormattedLabel id="exit" />} */}
                    exit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </ThemeProvider>
    </>
  )
}

export default Index
