import { Button, Grid, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import urls from '../../../../URLS/urls'
import BasicLayout from '../../../../containers/Layout/BasicLayout'

const HelpdeskAndEnquiry = () => {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    getHelpdeskAndEnquiry()
  }, [])

  const getHelpdeskAndEnquiry = () => {
    axios
      .get(
        `${urls.CFCURL}/transaction/helpdeskAndEnquiry/getHelpdeskAndEnquiryDetails`
      )
      .then((res) => {
        console.log('res getHelpdeskAndEnquiry', res)
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            applicationNo: r.applicationNo,
            getDetails: r.getDetails,
            remarks: r.remarks,
          }))
        )
      })
  }

  return (
    <BasicLayout>

    <div
      style={{
        padding: '120px',
      }}
    >
      <Grid container>
        <Grid item xs={10}></Grid>
        <Grid item xs={2}>
          <Button size='small' variant='outlined' endIcon={<AddIcon />}>
            Add
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          padding: '10px',
          gap: 5,
        }}
      >
        <Grid
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <TextField
            id='outlined-basic'
            label='Application Number'
            variant='outlined'
            size='small'
            sx={{
              backgroundColor: '#FFFFFF',
            }}
          />
        </Grid>
        <Grid
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button sx={{ width: '10%' }} variant='outlined' size='small'>
            Get Details
          </Button>
        </Grid>
      </Grid>
    </div>

    </BasicLayout>
  )
}

export default HelpdeskAndEnquiry
