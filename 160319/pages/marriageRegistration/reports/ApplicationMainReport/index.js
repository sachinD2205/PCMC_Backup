import { Button, FormControl, Paper, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import styles from './goshwara.module.css'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import urls from '../../../../URLS/urls'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const ApplicationMain = () => {
  let router = useRouter()
  let selectedMenu = localStorage.getItem('selectedMenuFromDrawer')
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  )
  let language = useSelector((state) => state.labels.language)
  const [route, setRoute] = useState(null)

  // console.log("menuLabel",menuLabel);

  useEffect(() => {
    console.log('selected menu', menu)

    if (menu?.id == 14) {
      setRoute('ghoshwara1')
    } else if (menu?.id == 123) {
      setRoute('goshwara2')
    } else if (menu?.id == 51) {
      setRoute('marriageCertificate')
    }
    // console.log("selected menu",menus?.find((m)=>m?.id==selectedMenu));
  }, [menu, selectedMenu])

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm()

  const componentRef = useRef()

  const [dataSource, setDataSource] = useState([])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues('fromDate'),
      toDate: getValues('toDate'),
    }
    axios
      .post(`${urls.MR}/reports/getApplicationsBySearchFilter`, body)
      .then((r) => {
        setDataSource(
          r.data.map((r, i) => {
            return { srNo: i + 1, ...r }
          }),
        )
      })
  }

  const backToHomeButton = () => {
    router.push('/marriageRegistration/dashboard')
  }
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
                    ? menu.menuNameEng /* "Application Details Report" */
                    : menu.menuNameMr /* "अर्ज तपशील अहवाल" */
                }
              </h1>
            </center>
          </p>
          <Button
            onClick={backToHomeButton}
            variant="contained"
            color="primary"
            style={{ marginTop: '-100px' }}
          >
            {language === 'en' ? 'Back To home' : 'मुखपृष्ठ'}
          </Button>
        </div>

        <div className={styles.searchFilter} styles={{ marginTop: '50px' }}>
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
                        {language === 'en' ? 'From Date' : 'पासून'}
                      </span>
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
          <FormControl sx={{ marginTop: 0, marginLeft: '5vh' }}>
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
                        {language === 'en' ? 'To Date' : 'पर्यंत'}
                      </span>
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
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: '4px' }}
            onClick={getApplicationDetail}
          >
            {language === 'en' ? 'Search' : 'शोधा'}
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
                <thead className={styles.head}>
                  <tr>
                    <th colSpan={8}>
                      {
                        this?.props?.data?.language === 'en'
                          ? this.props.data.menuNameEng
                          : // "Application Details Report"
                            this.props.data.menuNameMr
                        /* "अर्ज तपशील अहवाल" */
                      }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Sr.No' : 'अ.क्र'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Zone' : 'झोन'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Ward' : 'प्रभाग'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Marriage Registration No'
                        : 'विवाह नोंदणी क्र'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Marriage Date'
                        : 'विवाह दिनांक'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Applicant Name'
                        : 'अर्जदाराच नाव'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Groom Name'
                        : 'वराचे नाव'}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Bride Name'
                        : 'वधुचे नाव'}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language === 'en'
                              ? r?.zone?.zoneName
                              : r?.zone?.zoneNameMr}
                          </td>
                          <td>
                            {this?.props?.data?.language === 'en'
                              ? r?.ward?.wardName
                              : r?.ward?.wardNameMr}
                          </td>
                          <td
                            onClick={() => {
                              localStorage.setItem('serviceId', r?.serviceId),
                                localStorage.setItem('applicationId', r?.id)
                            }}
                          >
                            <a href={this?.props?.data?.route}>
                              {r?.registrationNumber}
                            </a>
                          </td>
                          <td>
                            {' '}
                            {' ' +
                              moment(r?.marriageDate, 'YYYY-MM-DD').format(
                                'DD-MM-YYYY',
                              )}
                          </td>
                          <td>
                            {this?.props?.data?.language === 'en'
                              ? r?.applicantName
                              : r?.applicantNameMr}
                          </td>
                          <td>
                            {this?.props?.data?.language === 'en'
                              ? r?.gfName + ' ' + r?.gmName + ' ' + r?.glName
                              : r?.gfNameMr +
                                ' ' +
                                r?.gmNameMr +
                                ' ' +
                                r?.glNameMr}
                          </td>
                          <td>
                            {this?.props?.data?.language === 'en'
                              ? r?.bfName + ' ' + r?.bmName + ' ' + r?.blName
                              : r?.bfNameMr +
                                ' ' +
                                r?.bmNameMr +
                                ' ' +
                                r?.blNameMr}
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

export default ApplicationMain
