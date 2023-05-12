import BrushIcon from '@mui/icons-material/Brush'
import CheckIcon from '@mui/icons-material/Check'
import PaidIcon from '@mui/icons-material/Paid'
import { Button, IconButton, Paper } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import styles from '../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
// import styles from '../../../../styles/marrigeRegistration'
import urls from '../../../../../URLS/urls'

// Table _ MR
const Index = () => {
  let created = []
  let checklist = []
  // let apptScheduled = []
  let clkVerified = []
  let cmolaKonte = []
  let cmoVerified = []
  let loiGenerated = []
  let cashier = []
  let paymentCollected = []
  // let certificateIssued = []
  let certificateGenerated = []
  let merged = []

  const router = useRouter()
  const [tableData, setTableData] = useState([])
  let user = useSelector((state) => state.user.user)
  let language = useSelector((state) => state.labels.language)
  let selectedMenuFromDrawer = localStorage.getItem('selectedMenuFromDrawer')
  const [authority, setAuthority] = useState([])
  const [serviceId, setServiceId] = useState(null)

  const languages=[{ id: 1, language: "English" }, { id: 2, language: "Marathi" }, { id: 3, language: "Hindi" }]

  useEffect(() => {
    // AuthAndServicePorvider

    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles
    let service = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)
      ?.serviceId
    console.log('serviceId-<>', service)
    console.log('auth0000', auth)
    setAuthority(auth)
    setServiceId(service)
  }, [])


  // Get Table - Data
  const getNewMarriageRegistractionDetails = () => {
    console.log('userToken', user.token)

    axios
      .get(
        `${urls.LMSURL}/trnRequestBook/getAllByServiceIdAndLibrarianId?serviceId=84&librarianId=${user.id}`,
      )
      .then((res) => {
        console.log(res, "reg123")
        setTableData(
          res.data.trnRequestBookList.sort((a, b) => b.id - a.id)
            .map((r, i) => {
              return {
                srNo: i + 1,
                ...r,
                applicationDate: moment(r.applicationDate).format('DD-MM-YYYY'),
                language:languages.find((language)=>r.language==language.id)?.language
              }
            })
        )
      })
    // axios
    //   .get(
    //     `${urls.MR}/transaction/marriageBoardRegistration/getmarraigeBoardRegistrationDetails?serviceId=${serviceId}`,
    //
    //     {
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //       },
    //     },
    //   )

    //   // .then((res) => {
    //   // setTableData(
    //   //   res.data.map((r, i) => {
    //   //     return {
    //   //       srNo: i + 1,
    //   //       ...r,
    //   //     }
    //   //   }),
    //   // )
    //   // })

    //   .then((resp) => {
    //     if (
    //       authority.includes('DOCUMENT_CHECKLIST') ||
    //       authority.includes('ADMIN')
    //     ) {
    //       console.log('APPLICATION_CREATED')
    //       created = resp.data.filter(
    //         (data) => data.applicationStatus === 'APPLICATION_CREATED',
    //       )
    //     }

    //     // if (
    //     //   authority?.find(
    //     //     (r) =>
    //     //       r === 'APPOINTMENT_SCHEDULE' ||
    //     //       authority?.find((r) => r === 'ADMIN'),
    //     //   )
    //     // ) {
    //     //   console.log('APPOINTMENT_SCHEDULE')
    //     //   apptScheduled = resp.data.filter(
    //     //     (data) => data.applicationStatus === 'APPLICATION_SENT_TO_SR_CLERK',
    //     //   )
    //     // }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'DOCUMENT_VERIFICATION' ||
    //           authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       console.log('DOCUMENT_VERIFICATION')
    //       clkVerified = resp.data.filter(
    //         (data) => data.applicationStatus === 'APPLICATION_SENT_TO_SR_CLERK',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'FINAL_APPROVAL' || authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       cmolaKonte = resp.data.filter(
    //         (data) => data.applicationStatus === 'APPLICATION_SENT_TO_CMO',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'LOI_GENERATION' || authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       cmoVerified = resp.data.filter(
    //         (data) => data.applicationStatus === 'CMO_APPROVED',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) => r === 'CASHIER' || authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       cashier = resp.data.filter(
    //         (data) => data.applicationStatus === 'LOI_GENERATED',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'CERTIFICATE_ISSUER' ||
    //           authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       loiGenerated = resp.data.filter(
    //         (data) => data.applicationStatus === 'PAYEMENT_SUCCESSFULL',
    //       )
    //     }

    //     if (
    //       authority?.find(
    //         (r) =>
    //           r === 'APPLY_DIGITAL_SIGNATURE' ||
    //           authority?.find((r) => r === 'ADMIN'),
    //       )
    //     ) {
    //       certificateGenerated = resp.data.filter(
    //         (data) => data.applicationStatus === 'CERTIFICATE_GENERATED',
    //       )
    //     }

    //     merged = [
    //       ...created,
    //       ...checklist,
    //       // ...apptScheduled,
    //       ...clkVerified,
    //       ...cmolaKonte,
    //       ...cmoVerified,
    //       ...loiGenerated,
    //       ...cashier,
    //       ...paymentCollected,
    //       // ...certificateIssued,
    //       ...certificateGenerated,
    //     ]

    //     console.log('created', created)
    //     console.log('checklist', checklist)
    //     // console.log('apptScheduled', apptScheduled)
    //     console.log('clkVerified', clkVerified)
    //     console.log('cmoVerified', cmoVerified)
    //     console.log('loiGenerated', loiGenerated)
    //     console.log('paymentCollected', paymentCollected)
    //     console.log('certificateGenerated', certificateGenerated)
    //     // console.log('certificateIssued', certificateIssued)

    //   setTableData(
    //     merged.map((r, i) => {
    //       return {
    //         srNo: i + 1,
    //         ...r,
    //       }
    //     }),
    //   )
    // })

  }

  useEffect(() => {
    console.log('authority', authority)
    getNewMarriageRegistractionDetails()
  }, [authority, serviceId])

  const viewLOI = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      role: 'LOI_GENERATION',
    }
    console.log('yetoy', record)
    saveApproval(finalBody)
  }

  const issueCertificate = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      role: 'CERTIFICATE_ISSUER',
    }
    console.log('yetoy', record)
    saveApproval(finalBody)
  }

  const issueCertificate1 = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      role: 'APPLY_DIGITAL_SIGNATURE',
    }
    console.log('yetoy', record)
    saveApproval(finalBody)
  }

  const saveApproval = (body) => {
    // axios
    //   .post(
    //     `${urls.MR}/transaction/marriageBoardRegistration/saveMarraigeBoardRegistrationApprove`,
    //     body,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //       },
    //     },
    //   )
    //   .then((response) => {
    //     if (response.status === 200) {
    //       if (body.role === 'LOI_GENERATION') {
    //         router.push({
    //           pathname:
    //             '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi',
    //           query: {
    //             ...body,
    //           },
    //         })
    //       } else if (
    //         body.role === 'CERTIFICATE_ISSUER' ||
    //         body.role === 'APPLY_DIGITAL_SIGNATURE'
    //       ) {
    //         router.push({
    //           pathname: '/marriageRegistration/reports/boardcertificateui',
    //           query: {
    //             ...body,
    //             // role: "CERTIFICATE_ISSUER",
    //           },
    //         })
    //       }
    //     }
    //   })
  }

  // Columns
  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id="srNo" />,
      // headerName: "Sr No",
      // flex: 1,
      minWidth: 70,
    },
    {
      field: 'applicationNumber',
      headerName: <FormattedLabel id="applicationNo" />,
      // headerName: "Application No",
      // flex: 3,
      minWidth: 150,
    },
    {
      field: 'applicationDate',
      headerName: <FormattedLabel id="applicationDate" />,
      // headerName: "Application Date",
      // flex: 3,
      minWidth: 150,
      // valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY'),
    },

    // {
    //   field: 'libraryName',
    //   // headerName: <FormattedLabel id="boardNameT" />,
    //   headerName: "library Name",
    //   width: 240,
    // },

    // {
    //   field: 'applicantName',
    //   // headerName: <FormattedLabel id="ApplicantName" />,
    //   headerName: "Applicant Name",
    //   width: 240,
    // },

    {
      field: 'applicationStatus',
      headerName: <FormattedLabel id="applicationStatus" />,
      // headerName: "Application Status",
      width: 280,
    },
    {
      field: 'bookName',
      headerName: <FormattedLabel id="bookName" />,
      // headerName: "Book Name",
      width: 280,
    },
    {
      field: 'bookClassification',
      headerName: <FormattedLabel id="bookClassification" />,
      // headerName: "Book Classification",
      width: 280,
    },
    {
      field: 'bookType',
      headerName: <FormattedLabel id="bookType" />,
      // headerName: "Book Type",
      width: 280,
    },
    {
      field: 'bookSubType',
      headerName: <FormattedLabel id="bookSubType" />,
      // headerName: "Book SubType",
      width: 280,
    },
    {
      field: 'bookEdition',
      headerName: <FormattedLabel id="bookEdition" />,
      // headerName: "Book Edition",
      width: 280,
    },
    {
      field: 'language',
      headerName: <FormattedLabel id="language" />,
      // headerName: "Language",
      width: 280,
    },
    {
      field: 'author',
      headerName: <FormattedLabel id="author" />,
      // headerName: "Author",
      width: 280,
    },
    // {
    //   field: 'actions',
    //   // headerName: <FormattedLabel id="actions" />,
    //   headerName: "Actions",
    //   width: 280,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (record) => {
    //     return (
    //       <>
    //         <div className={styles.buttonRow}>
    //           {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
    //             (authority?.includes('DOCUMENT_CHECKLIST') ||
    //               authority?.includes('ADMIN')) && (
    //               <IconButton
    //                 onClick={() =>
    //                   router.push({
    //                     pathname:
    //                       '/lms/transactions/newMembershipRegistration/scrutiny/scrutiny',
    //                     query: {
    //                       disabled: true,
    //                       ...record.row,
    //                       role: 'DOCUMENT_CHECKLIST',
    //                       pageHeader: 'DOCUMENT CHECKLIST',
    //                       pageMode: 'Check',
    //                       pageHeaderMr: 'कागदपत्र तपासणी',
    //                     },
    //                   })
    //                 }
    //               >
    //                 <Button
    //                   style={{
    //                     height: '30px',
    //                     width: '250px',
    //                   }}
    //                   variant="contained"
    //                   color="primary"
    //                 >
    //                   Document Checklist
    //                 </Button>
    //               </IconButton>
    //             )}

    //           {/* {record?.row?.applicationStatus ===
    //             'APPLICATION_SENT_TO_SR_CLERK' &&
    //             authority?.find(
    //               (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
    //             ) && (
    //               <>
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<CheckIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     onClick={() =>
    //                       router.push({
    //                         pathname: 'scrutiny/scrutiny',
    //                         query: {
    //                           ...record.row,
    //                           role: 'DOCUMENT_VERIFICATION',

    //                           pageHeader: 'APPLICATION VERIFICATION',
    //                           // pageMode: 'Edit',
    //                           pageMode: 'Check',
    //                           pageHeaderMr: 'अर्ज पडताळणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     DOCUMENT VERIFICATION
    //                   </Button>
    //                 </IconButton>
    //               </>
    //             )}

    //           {record?.row?.applicationStatus === 'APPLICATION_SENT_TO_CMO' &&
    //             authority?.find(
    //               (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
    //             ) && (
    //               <>
    //                 <IconButton>
    //                   <Button
    //                     variant="contained"
    //                     endIcon={<CheckIcon />}
    //                     style={{
    //                       height: '30px',
    //                       width: '250px',
    //                     }}
    //                     onClick={() =>
    //                       router.push({
    //                         pathname: 'scrutiny/scrutiny',
    //                         query: {
    //                           ...record.row,
    //                           role: 'FINAL_APPROVAL',
    //                           pageHeader: 'FINAL APPROVAL',
    //                           // pageMode: 'Edit',
    //                           pageMode: 'Check',
    //                           pageHeaderMr: 'अर्ज पडताळणी',
    //                         },
    //                       })
    //                     }
    //                   >
    //                     CMO VERIFY
    //                   </Button>
    //                 </IconButton>
    //               </>
    //             )}

    //           {record?.row?.applicationStatus === 'CMO_APPROVED' &&
    //             authority?.find(
    //               (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
    //             ) && (
    //               <IconButton>
    //                 <Button
    //                   variant="contained"
    //                   endIcon={<BrushIcon />}
    //                   style={{
    //                     height: '30px',
    //                     width: '250px',
    //                   }}
    //                   onClick={() =>
    //                     router.push({
    //                       pathname:
    //                         '/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationComponent',
    //                       query: {
    //                         id: record.row.id,
    //                         serviceName: record.row.serviceId,

    //                         role: 'LOI_GENERATION',
    //                       },
    //                     })
    //                   }
    //                 >
    //                   GENERATE LOI
    //                 </Button>
    //               </IconButton>
    //             )}

    //           {record?.row?.applicationStatus === 'LOI_GENERATED' &&
    //             authority?.find((r) => r === 'CASHIER' || r === 'ADMIN') && (
    //               <IconButton>
    //                 <Button
    //                   variant="contained"
    //                   endIcon={<PaidIcon />}
    //                   style={{
    //                     height: '30px',
    //                     width: '250px',
    //                   }}
    //                   color="success"
    //                   onClick={() =>
    //                     router.push({
    //                       pathname:
    //                         '/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection',

    //                       query: {
    //                         ...record.row,
    //                         role: 'CASHIER',
    //                       },
    //                     })
    //                   }
    //                 >
    //                   Collect Payment
    //                 </Button>
    //               </IconButton>
    //             )}

    //           {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
    //             authority?.find(
    //               (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
    //             ) && (
    //               <IconButton>
    //                 <Button
    //                   variant="contained"
    //                   style={{
    //                     height: 'px',
    //                     width: '250px',
    //                   }}
    //                   color="success"
    //                   onClick={() => issueCertificate(record.row)}
    //                 >
    //                   GENERATE CERTIFICATE
    //                 </Button>
    //               </IconButton>
    //             )} */}
    //           {/* {record?.row?.applicationStatus === 'CERTIFICATE_GENERATED' &&
    //             authority?.find(
    //               (r) => r === 'APPLY_DIGITAL_SIGNATURE' || r === 'ADMIN',
    //             ) && (
    //               <IconButton>
    //                 <Button
    //                   variant="contained"
    //                   style={{
    //                     height: 'px',
    //                     width: '250px',
    //                   }}
    //                   color="success"
    //                   onClick={() => issueCertificate1(record.row)}
    //                 >
    //                   APPLY DIGITAL SIGNATURE
    //                 </Button>
    //               </IconButton>
    //             )} */}
    //         </div>
    //       </>
    //     )
    //   },
    // },
  ]

  return (
    <>
      {/* <BasicLayout> */}
      <Paper
        sx={{
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
          marginBottom: 1,
          padding: 1,
          border: 1,
          borderColor: 'grey.500',
        }}
      >
        <br />
        <div className={styles.detailsTABLE}>
          <div className={styles.h1TagTABLE}>
            <h2
              style={{
                fontSize: '20',
                color: 'white',
                marginTop: '7px',
              }}
            >
              {' '}
              {<FormattedLabel id="newBookRequest" />}
              {/* New Book Request */}
            </h2>
          </div>
        </div>

        <br />

        <DataGrid

          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              // printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              // csvOptions: { disableToolbarButton: true },
            },
          }}
          sx={{
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
            overflowY: 'scroll',

            '& .MuiDataGrid-virtualScrollerContent': {},
            '& .MuiDataGrid-columnHeadersInner': {
              backgroundColor: '#556CD6',
              color: 'white',
            },

            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
          density="compact"
          autoHeight
          scrollbarSize={17}
          rows={tableData}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  )
}
export default Index