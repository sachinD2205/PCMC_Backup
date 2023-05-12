import React, { useEffect, useRef, useState } from 'react'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import TextField from '@mui/material/TextField'
import styles from './report.module.css'
import theme from '../../../../theme'
import { Controller, useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import { ThemeProvider } from '@emotion/react'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
//import urls from '../../../URLS/urls'
import urls from '../../../../URLS/urls'

const MessageDeliveredReport = () => {
  const [dataSource, setDataSource] = useState()
  const {
    control,
    register,
    methods,
    getValues,
    setValue,

    formState: { errors },
  } = useForm()
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' })
  }

  // zones
  const [zoneKeys, setZoneKeys] = useState([])

  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios.get(`${urls.BaseURL}/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneKey: row.zoneName,
        })),
      )
    })
  }

  // wardKeys
  const [wardKeys, setWardKeys] = useState([])

  // getWardKeys
  const getWardKeys = () => {
    axios.get(`${urls.BaseURL}/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardKey: row.wardName,
        })),
      )
    })
  }

  // useEffect
  useEffect(() => {
    getZoneKeys()
    getWardKeys()
  }, [])
  return (
    <>
      {/* <BasicLayout titleProp={'none'}> */}
      <ThemeProvider theme={theme}>
        <Paper>
          <div>
            <center>
              <h1>Message Delivered Report</h1>
            </center>
            {/* <div className={styles.row}>
                <div>
                  <FormControl sx={{ marginTop: 0 }} error={!!errors.formDate}>
                    <Controller
                      control={control}
                      name="formDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 14 }}> Form date</span>
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
                    <FormHelperText>
                      {errors?.formDate ? errors.formDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div>
                  <FormControl sx={{ marginTop: 0 }} error={!!errors.toDate}>
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 14 }}> To date</span>
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
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </div>
              </div>
              <div
                className={styles.row}
              
              >
                <div>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    error={!!errors.zoneKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Zone
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          //sx={{ width: 230 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Zone Name *"
                        >
                          {zoneKeys &&
                            zoneKeys.map((zoneKey, index) => (
                              <MenuItem key={index} value={zoneKey.id}>
                                {zoneKey.zoneKey}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="zoneKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.zoneKey ? errors.zoneKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    error={!!errors.wardKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Ward
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Ward Name *"
                        >
                          {wardKeys &&
                            wardKeys.map((wardKey, index) => (
                              <MenuItem key={index} value={wardKey.id}>
                                {wardKey.wardKey}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="wardKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.wardKey ? errors.wardKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </div>
              </div> */}

            <div style={{ padding: 10 }}>
              <Button
                variant="contained"
                color="primary"
                style={{ float: 'right' }}
                onClick={handlePrint}
              >
                print
              </Button>
              <Button
                onClick={backToHomeButton}
                variant="contained"
                color="primary"
              >
                back To home
              </Button>
            </div>
          </div>
        </Paper>
      </ThemeProvider>
      <ComponentToPrint ref={componentRef} />
      {/* </BasicLayout> */}
    </>
  )
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ marginTop: '13px' ,marginBottom:'13px'}}>
          <div className="report">
            <Paper>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b>Message Delivered Report</b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>Sr.No.</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Name</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Mobile Number</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Address</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Message</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Date</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                  </tr>
                  {/* {this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td></td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    )
  }
}
export default MessageDeliveredReport
