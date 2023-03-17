import sweetAlert from 'sweetalert'
import { Add, Delete, Visibility } from '@mui/icons-material'
import { Button, IconButton, Paper } from '@mui/material'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { DataGrid } from '@mui/x-data-grid'
import router from 'next/router'
import axios from 'axios'
import URLS from '../../../../URLS/urls'
import { useSelector } from 'react-redux'

const Index = () => {
  const [runAgain, setRunAgain] = useState(false)
  const [table, setTable] = useState([])
  const [forView, setForView] = useState([])
  const [zone, setZone] = useState([
    {
      id: 1,
      zoneEn: '',
      zoneMr: '',
    },
  ])
  const [village, setVillage] = useState([
    {
      id: 1,
      villageEn: '',
      villageMr: '',
    },
  ])

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

  useEffect(() => {
    //Zone
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((res) => {
      console.log('Zone: ', res.data)
      setZone(
        res.data.zone.map((j) => ({
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        }))
      )
    })

    //Village
    axios.get(`${URLS.CFCURL}/master/village/getAll`).then((res) => {
      console.log('Villages: ', res.data)
      setVillage(
        res.data.village.map((j) => ({
          id: j.id,
          villageEn: j.villageName,
          villageMr: j.villageNameMr,
        }))
      )
    })
  }, [])

  useEffect(() => {
    setRunAgain(false)

    axios.get(`${URLS.TPURL}/partplan/getpartplanDetails`).then((response) => {
      console.log('aalela: ', response.data)
      setForView(response.data)
      setTable(
        response.data.map((res, index) => ({
          srNo: index + 1,
          id: res.id,
          applicationDate: res.applicationDate,
          applicationNo: res.applicationNo,
          fullNameEn:
            res.firstNameEn + ' ' + res.middleNameEn + ' ' + res.surnameEn,
          fullNameMr:
            res.firstNameMr + ' ' + res.middleNameMr + ' ' + res.surnameMr,
          villageNameEn: village.find((obj) => obj?.id == res.villageName)
            ?.villageEn,
          villageNameMr: village.find((obj) => obj?.id == res.villageName)
            ?.villageMr,
          zoneNameEn: zone.find((obj) => obj?.id == res.tDRZone)?.zoneEn,
          zoneNameMr: zone.find((obj) => obj?.id == res.tDRZone)?.zoneMr,
          pincode: res.pincode,
          status: res.status,
        }))
      )
    })
  }, [runAgain, village, zone])

  const deleteRecord = async (record) => {
    sweetAlert({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${URLS.TPURL}/partplan/deletepartplan/${record.id}`)
          .then((res) => {
            if (res.status == 200) {
              sweetAlert('Deleted!', 'Record Deleted successfully !', 'success')
              setRunAgain(true)
            }
          })
      }
    })
  }

  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      width: 100,
    },
    {
      field: 'applicationDate',
      headerName: <FormattedLabel id='applicationDate' />,
      width: 150,
    },
    {
      field: 'applicationNo',
      headerName: <FormattedLabel id='applicationNo' />,
      width: 200,
    },
    {
      field: language === 'en' ? 'fullNameEn' : 'fullNameMr',
      headerName: <FormattedLabel id='fullName' />,
      width: 200,
    },
    {
      field: language === 'en' ? 'zoneNameEn' : 'zoneNameMr',
      headerName: <FormattedLabel id='zoneName' />,
      width: 200,
    },
    {
      field: language === 'en' ? 'villageNameEn' : 'villageNameMr',
      headerName: <FormattedLabel id='villageName' />,
      width: 200,
    },
    {
      field: 'pincode',
      headerName: <FormattedLabel id='pincode' />,
      width: 200,
    },
    {
      field: 'status',
      headerName: <FormattedLabel id='status' />,
      width: 200,
    },
    {
      field: 'action',
      headerName: <FormattedLabel id='actions' />,
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                const viewData = forView[params.row.srNo - 1]
                console.log('Query data: ', viewData)
                router.push({
                  pathname: `${URLS.APPURL}/townPlanning/transactions/clerk/view`,
                  query: {
                    pageMode: 'view',
                    ...viewData,
                  },
                })
              }}
            >
              <Visibility />
            </IconButton>
            {/* <IconButton onClick={() => deleteRecord(params.row)}>
              <Delete />
            </IconButton> */}
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>{'Part Map (Clerk)'}</title>
      </Head>
      <Paper style={{ padding: '3% 3%' }}>
        <div>
          <DataGrid
            autoHeight
            rows={table}
            // @ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
      </Paper>
    </>
  )
}

export default Index
