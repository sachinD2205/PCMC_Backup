import { Button, FormControl, Paper, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
// import BoardRegistration from '../boardRegistrations/citizen/boardRegistration'
import RenewForm from './renewForm'

import styles from './renewalOfMBReg.module.css'

import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import axios from 'axios'
import urls from '../../../../URLS/urls'

const Index = () => {
  const disptach = useDispatch()

  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm()
  const [flagSearch, setFlagSearch] = useState(false)
  const [data, setData] = useState();

  // useEffect(() => {
  //     axios
  //       .get(`http://localhost:8091/mr/api/applicant/getapplicantDetails`)
  //       .then((r) => {
  //         setTableData(r.data)
  //         disptach(saveAllValuesEdit(r.data))
  //       })
  //   }, [])

  // useEffect(() => {
  //     console.log("Bride Name 1", watch('brideName'));
  //   }, [watch('brideName'), watch('groomName'), watch('marriageDate'), watch('registrationDate')])

  const validateSearch = () => {
    if (watch('mBoardRegName') === "" || watch('mBoardRegName') === undefined) {
      return true
    }
  }

  const handleSearch = () => {
    let temp = parseInt(watch('mBoardRegNo'));
    console.log("type", typeof temp);
    let bodyForApi = {
      boardName: watch('mBoardRegName') !== "" ? watch('mBoardRegName') : null,
      registrationDate: watch('marriageBoardRegistrationDate'),
      registrationYear: watch('marriageBoardRegisterationYear') !== "" ? watch('marriageBoardRegisterationYear') : null,
      registrationNumber: temp,
    }

    axios
      .post(
        `${urls.MR}/transaction/marriageBoardRegistration/getBySearchParams`,
        bodyForApi,
        // allvalues,
      )
      .then((res) => {
        if (res.status == 200) {
          swal('Success!', 'Record Searched successfully !', 'success')
          setData(res.data);
          setFlagSearch(true)
        }
      })
      .catch((error) => {
        console.log("133", error);
        swal('Error!', error.response.data.message, 'error')
      })
  }

  return (
    <div style={{ backgroundColor: '#F5F5F5' }}>
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
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {<FormattedLabel id="onlyRMBR" />}

                {/* Renewal of Marriage Board Registration */}
              </h3>
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <TextField
                //  disabled
                sx={{ width: 230 }}
                id="standard-basic"
                //label={<FormattedLabel id="mbrName" />}
                label="Marriage Board Reg Number"
                variant="standard"
                {...register('mBoardRegNo')}
              // error={!!errors.aFName}
              // helperText={errors?.aFName ? errors.aFName.message : null}
              />
            </div>
            <div>
              <TextField
                //  disabled
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="mbrName" />}
                // label={"Marriage Board Reg Name"}
                variant="standard"
                {...register('mBoardRegName')}
              // error={!!errors.aFName}
              // helperText={errors?.aFName ? errors.aFName.message : null}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <FormControl sx={{ marginTop: 0 }}>
                <Controller
                  control={control}
                  name="marriageBoardRegistrationDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 14 }}>
                            {<FormattedLabel id="mbrDate" />}
                            {/* Marriage Board Reg Date */}
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
            </div>
            <div>
              <TextField
                // disabled
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="mbrYear" />}
                // label={"Marriage Board Reg Year"}
                variant="standard"
                {...register('marriageBoardRegisterationYear')}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <Button
                variant="contained"
                color="primary"
                disabled={validateSearch()}
                onClick={() => {
                  handleSearch();

                }}
              >
                {<FormattedLabel id="search" />}
                {/* Search */}
              </Button>
            </div>
          </div>
        </Paper>
      </div>
      {flagSearch ? <RenewForm data={data} /> : ''}
    </div>
  )
}

export default Index
