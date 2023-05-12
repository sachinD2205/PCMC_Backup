import { Button, FormControl, Paper, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import urls from '../../../../URLS/urls'
import styles from './report.module.css'

const Index = () => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useForm()
  const [dataSource, setDataSource] = useState([])
  let router = useRouter()
  let selectedMenu = localStorage.getItem('selectedMenuFromDrawer')
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  )
  let language = useSelector((state) => state.labels.language)
  const [route, setRoute] = useState(null)
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
    }
    axios.post(`${urls.MR}/reports/getSlotInfo`, body).then((r) => {
      setDataSource(
        r.data.map((r, i) => {
          return { srNo: i + 1, ...r }
        }),
      )
    })
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
        <div style={{ padding: '13px' }}>
          <div className="report">
            <Paper>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        {this?.props?.data?.language === 'en'
                          ? 'Slot Allocated Report'
                          : 'स्लॉट वाटप अहवाल'}
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en' ? 'Sr.No' : 'अ.क्र'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Applicant No.'
                        : 'अर्जदार क्रमांक'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Applicant Name'
                        : 'अर्जदाराचे नाव'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Allocated Date'
                        : 'वाटप तारीख'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Allocated Time'
                        : 'वाटप केलेला वेळ'}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === 'en'
                        ? 'Token No'
                        : 'टोकन क्र'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                  </tr> */}
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>

                          <td>{r?.applicationNumber}</td>
                          <td>
                            {this?.props?.data?.language === 'en'
                              ? r?.applicantName
                              : r?.applicantNameMr}
                          </td>

                          <td>
                            {' '}
                            {' ' +
                              moment(r?.appointmentDate, 'YYYY-MM-DD').format(
                                'DD-MM-YYYY',
                              )}
                          </td>
                          <td>
                            {r?.appointmentFromTime} To {r?.appointmentToTime}{' '}
                          </td>
                          <td>{r?.tokenNo}</td>
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
