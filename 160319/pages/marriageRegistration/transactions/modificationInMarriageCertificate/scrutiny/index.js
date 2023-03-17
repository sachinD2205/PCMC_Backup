// // /marriageRegistration/transactions/newMarriageRegistration/scrutiny/index.js
import BrushIcon from '@mui/icons-material/Brush'
import CheckIcon from '@mui/icons-material/Check'
import PaidIcon from '@mui/icons-material/Paid'
import { Button, IconButton, Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import styles from '../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import urls from '../../../../../URLS/urls'

// Table _ MR
const Index = () => {
  // let created = []
  // let checklist = []
  // let apptScheduled = []
  // let clkVerified = []
  // let cmolaKonte = []
  // let cmoVerified = []
  // let loiGenerated = []
  // let cashier = []
  // let paymentCollected = []
  // let certificateIssued = []
  // let merged = []

  const router = useRouter()

  const [tableData, setTableData] = useState([])
  let user = useSelector((state) => state.user.user)
  let language = useSelector((state) => state.labels.language)

  let selectedMenuFromDrawer = localStorage.getItem('selectedMenuFromDrawer')
  const [authority, setAuthority] = useState([])
  const [serviceId, setServiceId] = useState(null)
  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles
    let service = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)
      ?.serviceId
    console.log('serviceId-<>', service)
    console.log('auth0000', auth)
    setAuthority(auth)
    setServiceId(service)
  }, [])

  const getModMarriageRegistractionDetails = () => {
    console.log('userToken', user.token)
    axios
      .get(
        `${urls.MR}/transaction/modOfMarCertificate/getmodOfMarCertificateDetails?serviceId=${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      .then((res) => {
        setTableData(
          res.data.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            }
          }),
        )
      })
  }

  useEffect(() => {
    console.log('authority', authority)
    getModMarriageRegistractionDetails()
  }, [authority])

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

  const saveApproval = (body) => {
    axios
      .post(
        `${urls.MR}/transaction/modOfMarCertificate/saveApplicationApprove`,
        body,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          if (body.role === 'LOI_GENERATION') {
            router.push({
              pathname:
                '/marriageRegistration/transactions/modOfMarCertificate/scrutiny/LoiGenerationReciptmarathi',
              query: {
                ...body,
              },
            })
          } else if (body.role === 'CERTIFICATE_ISSUER') {
            router.push({
              pathname: '/marriageRegistration/reports/marriageCertificate',
              query: {
                // applicationId: record.row.id,
                serviceId: 12,
                applicationId: body.id,
                // ...body,
                // role: "CERTIFICATE_ISSUER",
              },
            })
          }
        }
      })
  }

  // Columns
  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
      headerAlign: 'center',
    },
    {
      field: 'applicationNumber',
      headerName: <FormattedLabel id="applicationNo" />,
      width: 260,
      headerAlign: 'center',
    },
    {
      field: 'applicationDate',
      headerName: <FormattedLabel id="applicationDate" />,
      width: 150,
      headerAlign: 'center',
      valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY'),
    },

    // {
    //   field: 'marriageBoardName',
    //   // headerName: <FormattedLabel id="" />,

    //   width: 240,
    // },

    {
      field: 'applicantName',
      headerName: <FormattedLabel id="ApplicantName" />,
      width: 240,
      headerAlign: 'center',
    },

    {
      field: 'applicationStatus',
      headerName: <FormattedLabel id="statusDetails" />,
      width: 280,
      headerAlign: 'center',
    },

    {
      field: 'actions',
      headerName: <FormattedLabel id="actions" />,
      width: 280,
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
                (authority?.includes('DOCUMENT_CHECKLIST') ||
                  authority?.includes('ADMIN')) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny',
                        query: {
                          disabled: true,
                          ...record.row,
                          role: 'DOCUMENT_CHECKLIST',
                          pageHeader: 'DOCUMENT CHECKLIST',
                          pageMode: 'Edit',
                          pageHeaderMr: 'कागदपत्र तपासणी',
                        },
                      })
                    }
                  >
                    <Button
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Document Checklist
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus ===
                'APPLICATION_SENT_TO_SR_CLERK' &&
                authority?.find(
                  (r) => r === 'DOCUMENT_VERIFICATION' || r === 'ADMIN',
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<CheckIcon />}
                        style={{
                          height: '30px',
                          width: '250px',
                        }}
                        onClick={() =>
                          router.push({
                            pathname:
                              '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny',
                            query: {
                              // ...record.row,
                              id: record.row.id,
                              serviceId: record.row.serviceId,
                              serviceName: record.row.serviceName,
                              serviceNameMr: record.row.serviceNameMr,
                              role: 'DOCUMENT_VERIFICATION',

                              pageHeader: 'APPLICATION VERIFICATION',
                              pageMode: 'Edit',
                              pageHeaderMr: 'अर्ज पडताळणी',
                            },
                          })
                        }
                      >
                        DOCUMENT VERIFICATION
                      </Button>
                    </IconButton>
                  </>
                )}

              {record?.row?.applicationStatus === 'APPLICATION_SENT_TO_CMO' &&
                authority?.find(
                  (r) => r === 'FINAL_APPROVAL' || r === 'ADMIN',
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<CheckIcon />}
                        style={{
                          height: '30px',
                          width: '250px',
                        }}
                        onClick={() =>
                          router.push({
                            pathname:
                              '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny',
                            query: {
                              id: record.row.id,
                              serviceId: record.row.serviceId,
                              serviceName: record.row.serviceName,
                              serviceNameMr: record.row.serviceNameMr,
                              role: 'FINAL_APPROVAL',
                              pageHeader: 'FINAL APPROVAL',
                              pageMode: 'Edit',
                              pageHeaderMr: 'अर्ज पडताळणी',
                            },
                          })
                        }
                      >
                        CMO VERIFY
                      </Button>
                    </IconButton>
                  </>
                )}

              {record?.row?.applicationStatus === 'CMO_APPROVED' &&
                authority?.find(
                  (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<BrushIcon />}
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      //  color="success"
                      // onClick={() => viewLOI(record.row)}
                      onClick={() =>
                        router.push({
                          pathname:
                            '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationComponent',
                          query: {
                            // ...record.row,
                            id: record.row.id,
                            serviceId: record.row.serviceId,
                            serviceName: record.row.serviceName,
                            serviceNameMr: record.row.serviceNameMr,
                            // loiServicecharges: null,
                            role: 'LOI_GENERATION',
                          },
                        })
                      }
                    >
                      GENERATE LOI
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === 'LOI_GENERATED' &&
                authority?.find((r) => r === 'CASHIER' || r === 'ADMIN') && (
                  <IconButton>
                    <Button
                      variant="contained"
                      // endIcon={<PaidIcon />}
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      color="success"
                      onClick={() =>
                        router.push({
                          pathname:
                            '/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/PaymentCollection',

                          query: {
                            // ...record.row,
                            role: 'CASHIER',
                            applicationId: record.row.id,
                            serviceId: 12,
                          },
                        })
                      }
                    >
                      Collect Payment
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' &&
                authority?.find(
                  (r) => r === 'CERTIFICATE_ISSUER' || r === 'ADMIN',
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: 'px',
                        width: '250px',
                      }}
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                    >
                      GENERATE CERTIFICATE
                    </Button>
                  </IconButton>
                )}
            </div>
          </>
        )
      },
    },
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
              {<FormattedLabel id="onlyMIMC" />}
            </h2>
          </div>
        </div>

        <br />

        <DataGrid
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
