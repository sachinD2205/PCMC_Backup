import { Button, IconButton, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
//import moment from 'moment'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
//import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import axios from 'axios'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
//import styles from '../newMarriageRegistration/view.module.css'
import moment from 'moment'
import { useRouter } from 'next/router'
import styles from '../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import urls from '../../../../URLS/urls'

const Index = () => {
  const dispach = useDispatch()

  const router = useRouter()

  let user = useSelector((state) => state.user.user)

  let language = useSelector((state) => state.labels.language)
  let selectedMenuFromDrawer = localStorage.getItem('selectedMenuFromDrawer')
  const [authority, setAuthority] = useState([])
  const [serviceId, setServiceId] = useState(null)

  const [tableData, setTableData] = useState([])
  const [applicantTableData, setApplicantTableData] = useState([])

  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles
    let service = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)
      ?.serviceId
    console.log('serviceId-<>', service)
    console.log('auth0000', auth)
    setAuthority(auth)
    setServiceId(service)
  }, [])

  const getRenewalOfMBRDetails = () => {
    if (serviceId) {
      axios
        .get(
          `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/getRenwalOfMarraigeBoardCertificateDetails?serviceId=${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )

        .then((res) => {
          console.log('Renewal table', res.data)
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
  }

  useEffect(() => {
    console.log('authority', authority)
    getRenewalOfMBRDetails()
  }, [authority])

  const issueCertificate = (record) => {
    console.log('yetoy', record)
    router.push({
      pathname: '/marriageRegistration/reports/boardcertificateui',
      query: {
        // ...body,
        applicationId: record.trnApplicantId,
        serviceId: 14,
        // role: "CERTIFICATE_ISSUER",
      },
    })
  }

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
      width: 240,
      headerAlign: 'center',
    },
    {
      field: 'applicationDate',
      headerName: <FormattedLabel id="applicationDate" />,
      width: 150,
      headerAlign: 'center',
      valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY'),
    },

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
      sortable: false,
      headerAlign: 'center',
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' && (
                <IconButton>
                  {/* <Buttonremarks */}
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
                  {/* </Buttonremarks> */}
                </IconButton>
              )}

              {record?.row?.applicationStatus === 'CERTIFICATE_ISSUED' && (
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
                    DOWNLOAD CERTIFICATE
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
      <div>
        <Paper
          sx={{
            marginLeft: 2,
            marginRight: 2,
            marginTop: 5,
            marginBottom: 5,
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
                {<FormattedLabel id="onlyRMBR" />}
              </h2>
            </div>
          </div>
          <DataGrid
            sx={{
              marginLeft: 9,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
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
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Paper>
      </div>
    </>
  )
}

export default Index
