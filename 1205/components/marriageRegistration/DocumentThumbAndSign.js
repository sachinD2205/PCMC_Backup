//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/cleark/applicationDtlAndDoc
import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FormattedLabel from '../../containers/reuseableComponents/FormattedLabel'
import Fingerprint from '../common/fingerPrint'
import UploadButton from './DocumentsUploadOP'
import UploadButtonThumbOP from './DocumentsUploadThumbOP'
import styles from './documentUpload.module.css'

const Index = () => {
  const router = useRouter()
  let appName = 'MR'
  let serviceName = 'M-NMR'
  let pageMode = router?.query?.pageMode
  const [gbase64String, setGBase64String] = React.useState("");
  const [gfingerPrintImg, setGFingerPrintImg] = React.useState("");
  const [bbase64String, setBBase64String] = React.useState("");
  const [bfingerPrintImg, setBFingerPrintImg] = React.useState("");
  const [w1base64String, setW1Base64String] = React.useState("");
  const [w1fingerPrintImg, setW1FingerPrintImg] = React.useState("");
  const [w2base64String, setW2Base64String] = React.useState("");
  const [w2fingerPrintImg, setW2FingerPrintImg] = React.useState("");
  const [w3base64String, setW3Base64String] = React.useState("");
  const [w3fingerPrintImg, setW3FingerPrintImg] = React.useState("");

  useEffect(() => {
    console.log('router?.query?.pageMode', router?.query?.pageMode)
  }, [])

  useEffect(() => {
    setValue('gthumb', gfingerPrintImg);
  }, [gfingerPrintImg])

  useEffect(() => {
    setValue('bthumb', bfingerPrintImg);
  }, [bfingerPrintImg])

  useEffect(() => {
    setValue('wfThumb', w1fingerPrintImg);
  }, [w1fingerPrintImg])

  useEffect(() => {
    setValue('wsThumb', w2fingerPrintImg);
  }, [w2fingerPrintImg])

  useEffect(() => {
    setValue('wtThumb', w3fingerPrintImg);
  }, [w3fingerPrintImg])

  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext({
    defaultValues: {
      gphoto: null,
    },
  })

  const onSubmit = (event) => {
    event.preventDefault()
  }

  //docdument
  const user = useSelector((state) => state?.user)
  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'documents', // unique name for your Field Array
  })

  return (
    <>
      <form onSubmit={onSubmit}  >
        <div className={styles.small}>
          <h4
            style={{
              marginLeft: '40px',
              color: 'red',
              fontStyle: 'italic',
              marginTop: '25px',
            }}
          >
            {/* {<FormattedLabel id="onlyMHR" />} */}
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
                {/* {<FormattedLabel id="documentsUpload" />} */}
                {/* Document Upload on clerk screen */}
                {<FormattedLabel id="documentsUpload" />}
              </h3>

              <h5
                style={{
                  color: 'white',
                  marginTop: '10px',
                  marginLeft: '5px',
                }}
              >
                {<FormattedLabel id="docFormat" />}
              </h5>
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
                {<FormattedLabel id="groomDetail" />}
              </h3>
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: '160px' }}>
            <div className={styles.srow2}>
              <Typography>
                <FormattedLabel id="GPhoto" />
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('gPhoto')}
                fileKey={'gphoto'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <UploadButtonThumbOP appName={appName} fileName={'gphoto.png'}
                serviceName={serviceName} fileDtl={getValues('gphoto')}
                fileKey={'gphoto'} showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
            </div>
            <div className={styles.srow2}>
              <Typography>
                {' '}
                <FormattedLabel id="Gthumb" />{' '}
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('gthumb')}
                fileKey={'gthumb'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <Fingerprint
                base64String={gbase64String}
                setFingerPrintImg={setGFingerPrintImg}
                setBase64String={setGBase64String}
                appName={appName}
                serviceName={serviceName}
              />

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
                {<FormattedLabel id="brideDetails" />}
              </h3>
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: '160px' }}>
            <div className={styles.srow2}>
              <Typography>
                {' '}
                <FormattedLabel id="Bphoto" />{' '}
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('bphoto')}
                fileKey={'bphoto'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <UploadButtonThumbOP appName={appName} fileName={'bphoto.png'}
                serviceName={serviceName} fileDtl={getValues('bphoto')}
                fileKey={'bphoto'} showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
            </div>
            <div className={styles.srow2}>
              <Typography>
                {' '}
                <FormattedLabel id="Bthumb" />{' '}
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('bthumb')}
                fileKey={'bthumb'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <Fingerprint
                base64String={bbase64String}
                setFingerPrintImg={setBFingerPrintImg}
                setBase64String={setBBase64String}
                appName={appName}
                serviceName={serviceName}
              />
            </div>
          </div>{' '}
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {<FormattedLabel id="witnessDetails" />}
              </h3>
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: '160px' }}>
            <div className={styles.srow2}>
              <Typography>
                <FormattedLabel id="witnessphto1" />
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('wfPhoto')}
                fileKey={'wfPhoto'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <UploadButtonThumbOP appName={appName} fileName={'wfPhoto.png'}
                serviceName={serviceName} fileDtl={getValues('wfPhoto')}
                fileKey={'wfPhoto'} showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
            </div>
            <div className={styles.srow2}>
              <Typography>
                {' '}
                <FormattedLabel id="witnessthumb1" />
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('wfThumb')}
                fileKey={'wfThumb'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <Fingerprint
                base64String={w1base64String}
                setFingerPrintImg={setW1FingerPrintImg}
                setBase64String={setW1Base64String}
                appName={appName}
                serviceName={serviceName}
              />
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: '160px' }}>
            <div className={styles.srow2}>
              <Typography>
                {' '}
                <FormattedLabel id="witnessphto2" />
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('wsPhoto')}
                fileKey={'wsPhoto'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <UploadButtonThumbOP appName={appName} fileName={'wsPhoto.png'}
                serviceName={serviceName} fileDtl={getValues('wsPhoto')}
                fileKey={'wsPhoto'} showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
            </div>
            <div className={styles.srow2}>
              <Typography>
                {' '}
                <FormattedLabel id="witnessthumb2" />{' '}
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('wsThumb')}
                fileKey={'wsThumb'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <Fingerprint
                base64String={w2base64String}
                setFingerPrintImg={setW2FingerPrintImg}
                setBase64String={setW2Base64String}
                appName={appName}
                serviceName={serviceName}
              />
            </div>
          </div>
          <div className={styles.row2} style={{ marginLeft: '160px' }}>
            <div className={styles.srow2}>
              <Typography>
                {' '}
                <FormattedLabel id="witnessphto3" />
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('wtPhoto')}
                fileKey={'wtPhoto'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <UploadButtonThumbOP appName={appName} fileName={'wtPhoto.png'}
                serviceName={serviceName} fileDtl={getValues('wtPhoto')}
                fileKey={'wtPhoto'} showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
            </div>
            <div className={styles.srow2}>
              <Typography>
                {' '}
                <FormattedLabel id="witnessthumb3" />{' '}
              </Typography>
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues('wtThumb')}
                fileKey={'wtThumb'}
                showDel={pageMode != 'APPLICATION VERIFICATION' ? false : true}
              />
              <span style={{ marginLeft: "8vh" }}>
                <b>OR</b>
              </span>
              <Fingerprint
                base64String={w3base64String}
                setFingerPrintImg={setW3FingerPrintImg}
                setBase64String={setW3Base64String}
                appName={appName}
                serviceName={serviceName}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default Index
