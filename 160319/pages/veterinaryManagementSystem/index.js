import { Paper } from '@mui/material'
import Head from 'next/head'
import React from 'react'

const Index = () => {
  return (
    <>
      <Head>
        <title>VMS - Dashboard</title>
      </Head>
      <Paper
        style={{
          width: '100%',
          height: '75vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>Veterinary Management System Dashboard</h1>
      </Paper>
    </>
  )
}

export default Index
