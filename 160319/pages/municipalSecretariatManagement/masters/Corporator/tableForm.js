import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from '../masters.module.css'
import URLS from '../../../../URLS/urls'

import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { Paper, Button } from '@mui/material'
import { Add } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import axios from 'axios'

const Table = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const [table, setTable] = useState([])
  const [genderDropDown, setGenderDropDown] = useState([
    { id: 1, genderEn: '', genderMr: '' },
  ])
  const [casteDropDown, setCasteDropDown] = useState([
    { id: 1, casteEn: '', casteMr: '' },
  ])
  const [religionDropDown, setReligionDropDown] = useState([
    { id: 1, religionEn: '', religionMr: '' },
  ])
  const [wardDropDown, setWardDropDown] = useState([
    { id: 1, wardEn: '', wardMr: '' },
  ])
  const [electedWardDropDown, setElectedWardDropDown] = useState([
    { id: 1, electedWardEn: '', electedWardMr: '' },
  ])
  const [partyNameDropDown, setPartyNameDropDown] = useState([
    { id: 1, partyNameEn: '', partyNameMr: '' },
  ])
  const [idProofCategoryDropDown, setIdProofCategoryDropDown] = useState([
    { id: 1, idProofCategoryEn: '', idProofCategoryMr: '' },
  ])
  const [bankNameDropDown, setBankNameDropDown] = useState([
    {
      id: 1,
      bankNameEn: '',
      bankNameMr: '',
      branchNameEn: '',
      branchNameMr: '',
    },
  ])
  const [branchNameDropDown, setBranchNameDropDown] = useState([
    {
      id: 1,
      bankNameEn: '',
      bankNameMr: '',
      branchNameEn: '',
      branchNameMr: '',
    },
  ])

  useEffect(() => {
    //Get Gender
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((res) => {
      console.log(res.data.gender)
      setGenderDropDown(
        res.data.gender.map((j) => ({
          id: j.id,
          genderEn: j.gender,
          genderMr: j.genderMr,
        }))
      )
    })

    //Get Caste
    axios.get(`${URLS.CFCURL}/master/cast/getAll`).then((res) => {
      console.log(res.data.mCast)
      setCasteDropDown(
        res.data.mCast.map((j) => ({
          id: j.id,
          casteEn: j.cast,
          casteMr: j.castMr,
        }))
      )
    })

    //Get Religion
    axios.get(`${URLS.CFCURL}/master/religion/getAll`).then((res) => {
      console.log(res.data.religion)
      setReligionDropDown(
        res.data.religion.map((j) => ({
          id: j.id,
          religionEn: j.religion,
          religionMr: j.religionMr,
        }))
      )
    })

    //Get Ward
    axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((res) => {
      console.log(res.data.ward)
      setWardDropDown(
        res.data.ward.map((j) => ({
          id: j.id,
          wardEn: j.wardName,
          wardMr: j.wardNameMr,
        }))
      )
    })

    //Get Elected Ward
    axios.get(`${URLS.MSURL}/mstElectoral/getAll`).then((res) => {
      console.log(res.data.electoral)
      setElectedWardDropDown(
        res.data.electoral.map((j) => ({
          id: j.id,
          electedWardEn: j.electoralWardName,
          electedWardMr: j.electoralWardNameMr,
        }))
      )
    })

    //Get Party Name
    axios.get(`${URLS.MSURL}/mstDefinePartyName/getAll`).then((res) => {
      console.log(res.data.definePartyName)
      setPartyNameDropDown(
        res.data.definePartyName.map((j) => ({
          id: j.id,
          partyNameEn: j.partyName,
          partyNameMr: j.partyNameMr,
        }))
      )
    })

    //Get ID Proof Category
    axios
      .get(`${URLS.MSURL}/mstDefineIdentificationProof/getAll`)
      .then((res) => {
        console.log(res.data.identificationProof)
        setIdProofCategoryDropDown(
          res.data.identificationProof.map((j) => ({
            id: j.id,
            idProofCategoryEn: j.identificationProofDocument,
            // identificationProofDocumentMr: j.identificationProofDocumentMr,
          }))
        )
      })

    //Get Bank Name
    axios.get(`${URLS.CFCURL}/master/bank/getAll`).then((res) => {
      console.log(res.data.bank)
      setBankNameDropDown(
        res.data.bank.map((j) => ({
          id: j.id,
          bankNameEn: j.bankName,
          bankNameMr: j.bankNameMr,
          branchNameEn: j.branchName,
          branchNameMr: j.branchNameMr,
        }))
      )
    })
  }, [])

  useEffect(() => {
    //Get Corporators
    axios.get(`${URLS.MSURL}/mstDefineCorporators/getAll`).then((res) => {
      console.log(res.data.corporator)
      setTable(
        res.data.corporator.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          fullNameEn: j.firstName + ' ' + j.middleName + ' ' + j.lastname,
          fullNameMr: j.firstNameMr + ' ' + j.middleNameMr + ' ' + j.lastnameMr,
          genderEn: genderDropDown.find((obj) => obj.id === j.gender)?.genderEn,
          genderMr: genderDropDown.find((obj) => obj.id === j.gender)?.genderMr,
          DOB: j.dateOfBirth,
          wardEn: wardDropDown.find((obj) => obj.id === j.ward)?.wardEn,
          wardMr: wardDropDown.find((obj) => obj.id === j.ward)?.wardMr,
          electedWardEn: electedWardDropDown.find(
            (obj) => obj.id === j.electedWard
          )?.electedWardEn,
          electedWardMr: electedWardDropDown.find(
            (obj) => obj.id === j.electedWard
          )?.electedWardMr,
          religionEn: religionDropDown.find((obj) => obj.id === j.religion)
            ?.religionEn,
          religionMr: religionDropDown.find((obj) => obj.id === j.religion)
            ?.religionMr,
        }))
      )
    })
  }, [
    branchNameDropDown,
    bankNameDropDown,
    idProofCategoryDropDown,
    partyNameDropDown,
    electedWardDropDown,
    wardDropDown,
    religionDropDown,
    casteDropDown,
    genderDropDown,
  ])

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 80,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'fullNameEn' : 'fullNameMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='fullName' />,
      // width: 250,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'genderEn' : 'genderMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='gender' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: 'DOB',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='dateOfBirth' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'wardEn' : 'wardMr',
      // field: 'ward',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='ward' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'electedWardEn' : 'electedWardMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='electedWard' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'religionEn' : 'religionMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='religion' />,
      width: 175,
    },
  ]

  return (
    <>
      <Head>
        <title>List of Corporators</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Define Corporators</div>
        <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() => {
              router.push(
                `${URLS.APPURL}/municipalSecretariatManagement/masters/Corporator/newIndex`
              )
            }}
          >
            <FormattedLabel id='add' />
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginTop: '5vh',
            marginBottom: '3vh',

            '& .cellColor': {
              backgroundColor: '#1976d2',
              color: 'white',
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Paper>
    </>
  )
}

export default Table
