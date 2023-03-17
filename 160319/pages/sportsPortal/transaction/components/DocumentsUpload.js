import { FormHelperText, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import UploadButton from '../../../../components/fileUpload/UploadButton'

// Documents Upload
const Document = () => {
  // UseForm Context
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext()
  // { resolver: yupResolver(schema) }

  const [aadharCard, setaadharCard] = useState(null)
  const [panCard, setpanCard] = useState(null)
  const [otherDocumentPhoto, setotherDocumentPhoto] = useState(null)

  // @ First UseEffect
  useEffect(() => {
    if (getValues('aadharCard') != null) {
      setaadharCard(getValues('aadharCard'))
    }
    if (getValues('panCard') != null) {
      setpanCard(getValues('panCard'))
    }
    if (getValues('otherDocumentPhoto') != null) {
      setotherDocumentPhoto(getValues('otherDocumentPhoto'))
    }
  }, [])

  // @ Second UseEffect
  useEffect(() => {
    setValue('aadharCard', aadharCard)
    setValue('panCard', panCard)
    setValue('otherDocumentPhoto', otherDocumentPhoto)
  }, [aadharCard, panCard, otherDocumentPhoto])

  // view
  return (
    <>
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
          marginRight: '65px',
          borderRadius: 100,
        }}
      >
        Documents Upload
      </div>
      <Grid
        container
        sx={{
          marginTop: 5,
          marginBottom: 5,
          paddingLeft: '50px',
          align: 'center',
        }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            {/* <strong>{<FormattedLabel id="adharCard" />}</strong> */}
            Aadhar Card
          </Typography>
          <div>
            <UploadButton
              error={!!errors?.aadharCard}
              appName="SP"
              serviceName="SP-SPORTSBOOKING"
              filePath={setaadharCard}
              fileName={aadharCard}
              // fileData={aadhaarCardPhotoData}
            />
            <FormHelperText error={!!errors?.aadharCard}>
              {errors?.aadharCard ? errors?.aadharCard?.message : null}
            </FormHelperText>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            {/* <strong>{<FormattedLabel id="panCard" />}</strong> */}
            Pan Card
          </Typography>
          <UploadButton
            error={!!errors?.panCard}
            appName="SP"
            serviceName="SP-SPORTSBOOKING"
            filePath={setpanCard}
            fileName={panCard}
          />
          <FormHelperText error={!!errors?.panCard}>
            {errors?.panCard ? errors?.panCard?.message : null}
          </FormHelperText>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Typography variant="subtitle2">
            {/* <strong>{<FormattedLabel id="panCard" />}</strong> */}
            Other Document Photo
          </Typography>
          <UploadButton
            error={!!errors?.otherDocumentPhoto}
            appName="SP"
            serviceName="SP-SPORTSBOOKING"
            filePath={setotherDocumentPhoto}
            fileName={otherDocumentPhoto}
          />
          <FormHelperText error={!!errors?.otherDocumentPhoto}>
            {errors?.otherDocumentPhoto
              ? errors?.otherDocumentPhoto?.message
              : null}
          </FormHelperText>
        </Grid>
      </Grid>
    </>
  )
}
export default Document

// import { Grid, Typography } from '@mui/material'
// import React, { useState } from 'react'
// import { useFieldArray, useFormContext } from 'react-hook-form'
// import UploadButton from '../../../../containers/SP_ReusableComponent/FileUpload/UploadButton'
// // import { convertBase } from "../../FileUpload/convertToBase.js";
// import axios from 'axios'
// import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
// import URLS from '../../../../URLS/urls'

// const DocumentsUpload = () => {
//   const [fileName, setFileName] = useState(null)
//   const {
//     control,
//     register,
//     reset,
//     getValues,
//     setValue,
//     formState: { errors },
//   } = useFormContext()

//   let appName = 'SP'
//   let serviceName = 'SP-SPORTSBOOKING'

//   // getBase64 ===
//   function getBase64(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onload = () => resolve(reader.result)
//       reader.onerror = (error) => reject(error)
//     })
//   }

//   const { fields } = useFieldArray({
//     control, // control props comes from useForm (optional: if you are using FormContext)
//     name: 'documents', // unique name for your Field Array
//   })

//   const handleFile1 = async (e, labelName) => {
//     let formData = new FormData()
//     formData.append('file', e.target.files[0])
//     axios
//       .post(
//         `${URLS.CFCURL}/file/upload?appName=${appName}&serviceName=${serviceName}`,
//         formData,
//       )
//       .then((r) => {
//         if (r.status === 200) {
//           if (labelName === 'panCardPhoto') {
//             setValue('panCardPhoto', r.data.filePath)
//           } else if (labelName == 'affadavitPhoto') {
//             setValue('affadavitPhoto', r.data.filePath)
//           } else if (labelName == 'otherDocumentPhoto') {
//             setValue('otherDocumentPhoto', r.data.filePath)
//           }
//         } else {
//           sweetAlert('Error')
//         }
//       })
//   }

//   return (
//     <>
//       <div
//         style={{
//           backgroundColor: '#0084ff',
//           color: 'white',
//           fontSize: 19,
//           marginTop: 30,
//           marginBottom: 30,
//           padding: 8,
//           paddingLeft: 30,
//           marginLeft: '40px',
//           marginRight: '65px',
//           borderRadius: 100,
//         }}
//       >
//         <strong>
//           <FormattedLabel id="documentUpload" />
//         </strong>
//       </div>
//       <Grid
//         container
//         sx={{
//           marginLeft: 5,
//           marginTop: 5,
//           marginBottom: 5,
//           align: 'center',
//         }}
//       >
//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//           <Typography>
//             <strong>{<FormattedLabel id="aadharCard" />}</strong>
//           </Typography>
//           <UploadButton
//             Change={(e) => {
//               handleFile1(e, 'aadharCardPhoto')
//               //setValue("aadharCardPhoto", e.target.files[0]);
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//           <Typography>
//             <strong>{<FormattedLabel id="panCard" />}</strong>
//           </Typography>
//           <UploadButton
//             Change={(e) => {
//               handleFile1(e, 'panCardPhoto')
//               // setValue("panCardPhoto", e.target.files[0]);
//             }}
//           />
//         </Grid>

//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 0 }}>
//           <Typography>
//             <strong>{<FormattedLabel id="otherDocumentPhoto" />}</strong>
//           </Typography>
//           <UploadButton
//             Change={(e) => {
//               handleFile1(e, 'otherDocumentPhoto')
//               //setValue("otherDocumentPhoto", e.target.files[0]);
//             }}
//           />
//         </Grid>
//       </Grid>
//     </>
//   )
// }

// export default DocumentsUpload
