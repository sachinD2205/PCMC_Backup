//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FormProvider, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import BoardRegistration from '../../pages/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration'
import ModBoardRegistration from '../../pages/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/citizen/ModBoardRegistration'
import ModMarriageCertificate from '../../pages/marriageRegistration/transactions/modificationInMarriageCertificate/citizen/modMarriageCertificate'
import styles from '../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import theme from '../../theme'
import URLS from '../../URLS/urls'
import ApplicantDetails from './ApplicantDetails'
import BrideDetails from './BrideDetails'
import GroomDetails from './GroomDetails'
import PriestDetails from './PriestDetails'
import WitnessDetails from './WitnessDetails'

import FormattedLabel from '../../containers/reuseableComponents/FormattedLabel'
import urls from '../../URLS/urls'
const Index = () => {
  const router = useRouter()
  let user = useSelector((state) => state.user.user)
  const language = useSelector((state) => state?.labels.language)
  const [document, setDocument] = useState([])
  const [modalforAprov, setmodalforAprov] = useState(false)
  const [remark, setRemark] = useState(null)
  const [formPreviewDailog, setFormPreviewDailog] = useState(false)
  const formPreviewDailogOpen = () => setFormPreviewDailog(true)
  const formPreviewDailogClose = () => setFormPreviewDailog(false)
  const [ValueServiceNameMr, setValueServiceNameMr] = useState()
  const [ValueServiceName, setValueServiceName] = useState()
  const [ValueApplicantNameMr, setValueApplicantNameMr] = useState()
  const [ValueApplicantName, setValueApplicantName] = useState()
  // const methods = useForm();
  let serviceId = Number(router.query.serviceId)
  console.log('serviceId', serviceId, typeof serviceId)

  // let serviceId = 67
  const [data, setData] = useState()
  const methods = useFormContext()
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    method,
    handleSubmit,
    formState: { errors },
  } = methods

  useEffect(() => {
    console.log('router?.query?', router?.query)
    if (router?.query) {
      reset(router?.query)
      setData(router?.query)
    }
  }, [])

  // viewForm
  const viewForm = (props) => {
    console.log('hsldjf', props)
    const ID = props
    if (serviceId === 10) {
      axios
        .get(
          `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${ID}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          reset(resp?.data)
        })
    } else if (serviceId === 67) {
      axios
        .get(
          `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${ID}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          if (resp.status == 200) {
            // setApplicationData(resp.data)
            reset(resp.data)

            console.log('sdljfslkdfjslkdjflskdjf', JSON.stringify(resp.data))
          }
        })
    } else if (serviceId === 15) {
      axios
        .get(
          `${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${ID}`,
          // localhost:8091/mr/api/transaction/modOfMarBoardCertificate/getModOfMarCertificateById?applicationId=3
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          console.log('sdljfslkdfjslkdjflskdjf', resp.data)
          reset(resp.data)
          setData(resp.data)
        })
    } else if (serviceId === 12) {
      axios
        .get(
          `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${ID}`,

          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          console.log('MODOFCER', resp.data)
          reset(resp.data)
          setData(resp.data)
        })
    }
    formPreviewDailogOpen()
  }

  useEffect(() => {
    //DocumentsList
    if (Number(router?.query?.id) != null) {
      // reset(router.query);
      axios.get(`${URLS.CFCURL}/master/documentMaster/getAll`).then((res) => {
        setDocument(
          res.data.documentMaster.map((j, i) => ({
            id: j.id,
            documentNameEn: j.documentChecklistEn,
            documentNameMr: j.documentChecklistMr,
          })),
        )
      })
    }
  }, [])

  useEffect(() => {
    console.log('router.sdlfksldkfjlds', ValueServiceName, ValueServiceNameMr)
    // alert('language', ValueServiceName)
    setValue(
      'serviceName',
      language == 'en' ? ValueServiceName : ValueServiceNameMr,
    )
    setValue(
      'applicantName',
      language === 'en'
        ? router?.query?.applicantName
        : router?.query?.applicantNameMr,
    )
  }, [language])

  useEffect(() => {
    console.log('router?.query?', router?.query)
    if (router?.query) {
      setData(router?.query)
      reset(router?.query)
    }
  }, [])

  useEffect(() => {
    const ID = router.query.applicationId

    console.log('router?.query?', router?.query)
    {
      axios
        .get(
          `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${ID}`,

          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          console.log('MODOFCER', resp.data)
          reset(resp.data)
          setData(resp.data)
          // alert('yetay')
          // console.log('sdljfslkdfjslkdjflskdjf', resp.data)
          setValueServiceName(resp?.data?.serviceName)
          setValueServiceNameMr(resp?.data?.serviceNameMr)
          setValueApplicantName(resp?.data?.ApplicantName)
          setValueApplicantNameMr(resp?.data?.ApplicantNameMr)
        })
    }
  }, [])

  useEffect(() => {}, [ValueServiceName, ValueServiceNameMr])
  return (
    <>
      <ThemeProvider theme={theme}>
        <form /* onSubmit={handleSubmit(onFinish)} */>
          <div className={styles.small}>
            <div className={styles.detailsApot}>
              <div className={styles.h1TagApot}>
                <h1
                  style={{
                    color: 'white',
                    marginTop: '1px',
                  }}
                >
                  {language === 'en'
                    ? router?.query?.pageHeader
                    : router?.query?.pageHeaderMr}
                  {/* {
                    language === 'en' ? router?.query?.pageMode : router?.query?.pageModeMr
                  } */}
                  {/* Document Verification */}
                </h1>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.h1Tag}>
                <h3
                  style={{
                    color: 'white',
                    marginTop: '6px',
                  }}
                >
                  {language === 'en' ? 'Applicant details' : 'अर्जदार तपशील'}
                </h3>
              </div>
            </div>

            <div className={styles.row2}>
              <div>
                <TextField
                  style={{ width: 280 }}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  // label="Service Name"
                  label={<FormattedLabel id="serviceName" />}
                  variant="standard"
                  {...register('serviceName')}
                  error={!!errors.serviceName}
                  helperText={
                    errors?.serviceName ? errors.serviceName.message : null
                  }
                />
              </div>

              <div>
                <TextField
                  style={{ width: 280 }}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  // label="Applicant Name"
                  label={<FormattedLabel id="ApplicatName" />}
                  variant="standard"
                  {...register('applicantName')}
                  error={!!errors.applicantName}
                  helperText={
                    errors?.applicantName ? errors.applicantName.message : null
                  }
                />
              </div>
            </div>

            <div className={styles.row2}>
              <div>
                <TextField
                  style={{ width: 280 }}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  label={<FormattedLabel id="applicationNo" />}
                  variant="standard"
                  {...register('applicationNumber')}
                  error={!!errors.applicationNumber}
                  helperText={
                    errors?.applicationNumber
                      ? errors.applicationNumber.message
                      : null
                  }
                />
              </div>

              <div>
                <TextField
                  style={{ width: 280 }}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  label={<FormattedLabel id="applicationDate" />}
                  // label="Application Date"
                  variant="standard"
                  {...register('applicationDate')}
                  error={!!errors.applicationDate}
                  helperText={
                    errors?.applicationDate
                      ? errors.applicationDate.message
                      : null
                  }
                />
              </div>
            </div>

            <div className={styles.row2}>
              <Button
                variant="contained"
                endIcon={<VisibilityIcon />}
                size="small"
                onClick={() => {
                  const id = router.query.id
                  console.log('sddlfkjslkfdjsdlkf', router.query.id)
                  viewForm(id)
                }}
              >
                {language === 'en' ? 'View Form' : 'अर्ज पहा'}
              </Button>
            </div>
          </div>
        </form>

        {/** Form Preview Dailog */}

        <Dialog
          fullWidth
          maxWidth={'lg'}
          open={formPreviewDailog}
          onClose={() => formPreviewDailogClose()}
        >
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                Preview
              </Grid>
              <Grid
                item
                xs={1}
                sm={2}
                md={4}
                lg={6}
                xl={6}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <IconButton
                  aria-label="delete"
                  sx={{
                    marginLeft: '530px',
                    backgroundColor: 'primary',
                    ':hover': {
                      bgcolor: 'red', // theme.palette.primary.main
                      color: 'white',
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: 'black',
                    }}
                    onClick={() => {
                      formPreviewDailogClose()
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            {serviceId === 10 ? (
              <>
                <FormProvider {...methods}>
                  <form /* onSubmit={handleSubmit(onFinish)} */>
                    <ApplicantDetails />
                    <GroomDetails />
                    <BrideDetails />
                    <PriestDetails />
                    <WitnessDetails />
                  </form>
                </FormProvider>
              </>
            ) : (
              ''
            )}
            {serviceId === 67 ? (
              <>
                <BoardRegistration
                  onlyDoc={false}
                  preview={true}
                  photos={data ? data : []}
                />
              </>
            ) : (
              ''
            )}
            {serviceId === 15 ? (
              <>
                <ModBoardRegistration
                  onlyDoc={false}
                  preview={true}
                  photos={data ? data : []}
                />
              </>
            ) : (
              ''
            )}

            {serviceId === 12 ? (
              <>
                <ModMarriageCertificate
                  onlyDoc={false}
                  preview={true}
                  photos={data ? data : []}
                />
              </>
            ) : (
              ''
            )}
            {/* {serviceId === 13 && <></>}
            {serviceId === 14 && <></>}
            {serviceId === 12 && <></>} */}
          </DialogContent>

          <DialogTitle>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
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
                      formPreviewDailogClose()
                    } else {
                      swal('Record is Safe')
                    }
                  })
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Grid>
          </DialogTitle>
        </Dialog>
      </ThemeProvider>
    </>
  )
}

export default Index
