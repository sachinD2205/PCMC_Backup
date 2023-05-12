import { Button, FormControl, Paper, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import styles from './closeMembership.module.css'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import urls from '../../../../URLS/urls'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Index = () => {
  let router = useRouter()
  let selectedMenu = localStorage.getItem('selectedMenuFromDrawer')
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  )
  let language = useSelector((state) => state.labels.language)
  const [route, setRoute] = useState(null)

  // console.log("menuLabel",menuLabel);

  const {
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm()

  const componentRef = useRef()

  const [dataSource, setDataSource] = useState([])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  // useEffect(() => {
  //   getLibraryKeys()
  // }, [])



  // const getLibraryKeys = () => {
  //   axios
  //     .get(
  //       `${urls.LMSURL}/trnApplyForNewMembership/getAllByServiceId?serviceId=${85}`,

  //     )
  //     .then((r) => {
  //       setDataSource(
  //         r.data.trnApplyForNewMembershipList.map((row) => ({
  //           id: row.id,
  //           ...row
  //         })),
  //       )
  //     })
  // }

  const backToHomeButton = () => {
    router.push('/marriageRegistration/dashboard')
  }

  useEffect(() => {
    if (watch('fromDate') && watch('toDate')) {
      console.log("Inside", watch('fromDate'), watch('toDate'))

      // const finalBody = {
      //   fromDate: watch('fromDate'),
      //   toDate: watch('toDate')
      // }

      axios
        .get(
          `${urls.LMSURL}/trnCloseMembership/getbyclosemembership?fromDate=${moment(watch('fromDate')).format('DD/MM/YYYY')}&toDate=${moment(watch('toDate')).format('DD/MM/YYYY')}`,

        )
        .then((r) => {
          let res = r?.data?.map((row) => ({
            id: row.id,
            ...row
          }))
          // let temp = res.filter((obj) =>
          //   obj.applicationDate >= watch('fromDate') && obj.applicationDate <= watch('toDate')
          // )
          // console.log("show list", res, temp);

          setDataSource(res)

        })

    }
  }, [watch('fromDate'), watch('toDate')])
  return (
    <>
      <Paper
        sx={{
          padding: '5vh',
          border: 1,
          borderColor: 'grey.500',
        }}
      >
        <div style={{ padding: 10 }}>
          <Button
            variant="contained"
            color="primary"
            style={{ float: 'right' }}
            onClick={handlePrint}
          >
            {language === 'en' ? 'Print' : 'प्रत काढा'}
          </Button>
          <p>
            <center>
              <h1>
                {
                  language === 'en'
                    ? "Closed Membership Register"
                    : "सदस्यत्व रद्द नोंदणी"
                }
              </h1>
            </center>
          </p>
          <div className={styles.searchFilter}>
            <FormControl sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name="fromDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 14 }}>
                          From Date                                            </span>
                      }
                      value={field.value}

                      onChange={(date) =>
                        field.onChange(moment(date).format('YYYY-MM-DD'))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </FormControl>
            <FormControl sx={{ marginTop: 0, marginLeft: "10vh" }}>
              <Controller
                control={control}
                name="toDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 14 }}>
                          To Date                                            </span>
                      }
                      value={field.value}

                      onChange={(date) =>
                        field.onChange(moment(date).format('YYYY-MM-DD'))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </FormControl>
          </div>
          <Button
            onClick={backToHomeButton}
            variant="contained"
            color="primary"
            style={{ marginTop: '-100px' }}
          >
            {language === 'en' ? 'Back To home' : 'मुखपृष्ठ'}
          </Button>
        </div>
        <br />
        <div>
          <ComponentToPrint
            data={{ dataSource, language, ...menu, route }}
            ref={componentRef}
          />
        </div>
      </Paper>
    </>
  )
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div>
          <div>
            <Paper>
              <table className={styles.report}>
                {/* <thead className={styles.head}>
                  <tr>
                    <th colSpan={8}>
                      {
                        this?.props?.data?.language === 'en'
                          ? "Membership Register"
                          : "सदस्यत्व नोंदणी"
                      }

                    </th>
                  </tr>
                </thead> */}
                <tbody>
                  <tr>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Sr.No' : 'अ.क्र'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Application No' : 'अर्ज क्र'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Application Date' : 'अर्जाची तारीख'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Applicant Name' : 'अर्जदाराचे नाव'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Membership No' : 'अर्जदाराचे नाव'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Membership Start Date' : 'सदस्यत्व सुरू होण्याची तारीख'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Membership End Date' : 'सदस्यत्व समाप्ती तारीख'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Membership Cancelled Date' : 'सदस्यत्व रद्द तारीख'}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {/* {this?.props?.data?.language === 'en'
                              ? r?.applicationNo
                              : r?.libraryNameMr} */}
                            {r?.applicationNumber}
                          </td>
                          <td>
                            {/* {this?.props?.data?.language === 'en'
                              ? r?.address
                              : r?.addressMr} */}
                            {r.applicationDate ? moment(r?.applicationDate).format('DD-MM-YYYY') : '-'}

                          </td>
                          <td style={{textAlign:"left",paddingLeft:"5vh"}}>
                            {r?.memberName}
                          </td>
                          <td>
                            {r?.membershipNo}
                          </td>
                          <td>
                            {r.startDate ? moment(r?.startDate).format('DD-MM-YYYY') : '-'}
                          </td>
                          <td>
                            {r.endDate ? moment(r?.endDate).format('DD-MM-YYYY') : '-'}
                          </td>
                          <td>
                            {r.cancellationDate ? moment(r?.cancellationDate).format('DD-MM-YYYY') : '-'}
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    )
  }
}

export default Index
