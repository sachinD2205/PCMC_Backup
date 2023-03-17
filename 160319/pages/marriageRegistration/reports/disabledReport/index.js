import { Button, Card, FormControl, Paper, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import urls from '../../../../URLS/urls'
import styles from './report.module.css'

// http://localhost:4000/marriageRegistration/reports/disabledReport

// Inter Cast Wise Report
const Index = () => {
  let language = useSelector((state) => state.labels.language)
  let selectedMenu = localStorage.getItem('selectedMenuFromDrawer')
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  )
  const [dataSource, setDataSource] = useState()
  const [route, setRoute] = useState(null)
  const {
    control,
    getValues,
    formState: { errors },
  } = useForm()
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' })
  }

  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues('fromDate'),
      toDate: getValues('toDate'),
      type: ['groom', 'bride'],
    }
    axios.post(`${urls.MR}/reports/getDisabledReportDtl`, body).then((r) => {
      setDataSource(
        r.data.map((r, i) => {
          return { srNo: i + 1, ...r }
        }),
      )
    })
  }
  // view
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
        <div style={{ padding: '13px' }}>
          <div className="report">
            <Card>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        {this?.props?.data?.language === 'en'
                          ? 'Disabled Report'
                          : 'दिव्यांग अहवाल'}
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Sr.No' : 'अ.क्र'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Registration Date'
                        : 'नोंदणी तारीख'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Registration Number'
                        : 'नोंदणी क्रमांक'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Groom Name'
                        : 'वराचे नाव'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Bride Name'
                        : 'वधूचे नाव'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Marriage Date'
                        : 'लग्नाची तारीख'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'is Groom Disable '
                        : 'वर दिव्यांग आहे का ?'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'is Bride Disable '
                        : 'वधु दिव्यांग आहे का ?'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Type of Disable (groom)'
                        : 'दिव्यांगचा प्रकार (वर)'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Type of Disable (bride)'
                        : 'दिव्यांगचा प्रकार (वधु)'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {' '}
                            {' ' +
                              moment(
                                r?.serviceCompletionDate,
                                'YYYY-MM-DD',
                              ).format('DD-MM-YYYY')}
                          </td>
                          <td>{r?.registrationNumber}</td>
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
                          <td>
                            {' '}
                            {' ' +
                              moment(r?.marriageDate, 'YYYY-MM-DD').format(
                                'DD-MM-YYYY',
                              )}
                          </td>
                          <td>
                            {r?.gdisabled === true
                              ? this?.props?.data?.language === 'en'
                                ? 'Yes'
                                : 'होय'
                              : this?.props?.data?.language === 'en'
                              ? 'No'
                              : 'नाही'}
                          </td>
                          <td>
                            {r?.bdisabled === true
                              ? this?.props?.data?.language === 'en'
                                ? 'Yes'
                                : 'होय'
                              : this?.props?.data?.language === 'en'
                              ? 'No'
                              : 'नाही'}
                          </td>
                          <td>
                            {this?.props?.data?.language === 'en'
                              ? r?.gdisabilityTypeTxt
                              : r?.gdisabilityTypeMrTxt}
                          </td>
                          <td>
                            {this?.props?.data?.language === 'en'
                              ? r?.bdisabilityTypeTxt
                              : r?.bdisabilityTypeMrTxt}
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </>
    )
  }
}

export default Index
