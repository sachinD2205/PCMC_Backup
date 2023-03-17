
import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Cancel'
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { styled, ThemeProvider } from '@mui/material/styles'
import {
  CalendarPicker,
  LocalizationProvider,
  TimePicker
} from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import swal from 'sweetalert'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import styles from '../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import theme from '../../../theme'
import urls from '../../../URLS/urls'

const SlotMaster = () => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { tokenNo: '' },
  })

  
  const router = useRouter()
  
  let language = useSelector((state) => state.labels.language)
  
  const [suffiecient, setSuffiecient] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalforBook, setmodalforBook] = useState(false)
  const { fields, append, remove } = useFieldArray({ name: 'slotss', control })
  const [btnValue, setButtonValue] = useState(false)
  
  const CustomizedCalendarPicker = styled(CalendarPicker)`
    & .css-1n2mv2k {
      display: 'flex',
      justifyContent: 'spaceAround',
      backgroundColor: 'red',
    }
    & mui-style-mvmu1r{
      display: 'flex',
      justifyContent: 'spaceAround',
      backgroundColor: 'red',
    }
  `

  const isWeekend = (date) => {
    const day = date.day()
    return day === 0 || day === 6
  }

  // Append UI
  const appendUI = (id, fromTime, toTime, noOfSlots) => {
    console.log('id', id)
    console.log(`sdf ${getValues(`slotss.length`)}`)
    console.log('fromTime,toTime', fromTime, toTime)
    append({
      id: id,
      fromTime: fromTime,
      toTime: toTime,
      noOfSlots: noOfSlots,
    })
  }

  // Button
  const buttonValueSetFun = () => {
    if (getValues(`slotss.length`) >= 7) {
      setButtonValue(true)
    } else {
      appendUI(null, null, null, null)
      setButtonValue(false)
    }
  }
 
  // Final Data
  const onFinish = (data) => {

    console.log('yetoy ka deta ki nhi ', data)

    let slots = []

    let selectedDate = data.slotDate

    // Array - Updated Data
    data.slotss.forEach((data, i) => {
      slots.push({
        i: i + 1,
        fromTime: data.fromTime?moment(data.fromTime).format('HH:mm:ss'):null,
        toTime: data.toTime?moment(data.toTime).format('HH:mm:ss'):null,
        noOfSlots: data.noOfSlots?data.noOfSlots:null,
        slotDate: selectedDate,
      })
    })

    const reqBody = { slots: [...slots],slotDate: selectedDate }
    console.log('reqBody', reqBody)
    // if (btnSaveText === 'Save') {
        axios.post(`${urls.MR}/master/slot/save`, reqBody).then((r) => {
        if (r.status == 200) {
          swal('Submited!', 'Record Submited successfully !', 'success')
          console.log('res', r)
          setValue("slotss",[]);
          setmodalforBook(false);
        }
      })
    // }
  }

  const getSlot = (selectedDate) => {
    axios
      .get(`${urls.MR}/master/slot/getByDate?slotDate=${selectedDate}`)
      .then((r) => {
        if (r.data.slots.length != 0) {
          r.data.slots.map((row) => {
            appendUI(
              row.id,
              moment(row.fromTime, 'HH:mm:ss'),
              moment(row.toTime, 'HH:mm:ss') /* .format('hh:mm:ss A') */,
              row.noOfSlots,
            )
          })
          if (r.data.slots.length < 7) {
            setSuffiecient(false)
            appendUI(null, null, null, null)
          } else {
            setSuffiecient(true)
          }
        } else {
          setSuffiecient(false)
          appendUI(null, null, null, null)
        }
      })
  }

  return (
    <>
      <div className={styles.model}>
        {/* Slot View/Add */}
        <Modal
          open={modalforBook}
          onClose={()=>{setValue("slotss",[]),setmodalforBook(false)}}
        >
          <form onSubmit={handleSubmit(onFinish)}>
            <div className={styles.box}>
              <div
                className={styles.titlemodelT}
                style={{ marginLeft: '25px' }}
              >
                <Typography
                  className={styles.titleOne}
                  variant="h6"
                  component="h2"
                  color="#f7f8fa"
                  style={{ marginLeft: '25px' }}
                >
                  <FormattedLabel id="SlotMasterHead" /> {' '}{selectedDate}
                </Typography>
                <IconButton>
                  <CloseIcon
                    onClick={() => {setValue("slotss",[]),setmodalforBook(false)}}
                  />
                </IconButton>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  marginRight: '20px',
                }}
              >
                {!suffiecient && (
                  <Button
                    disabled={btnValue}
                    variant="contained"
                    size="small"
                    type="button"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      buttonValueSetFun()
                    }}
                  >
                    Add more
                  </Button>
                )}
              </div>

              <div
                container
                style={{ padding: '10px', backgroundColor: '#F9F9F9' }}
              >
                {fields.map((slot, index) => {
                  return (
                    <>
                      <div className={styles.row1}>
                        <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.fromTime}
                          >
                            <Controller
                              format="HH:mm:ss"
                              control={control}
                              name={`slotss.${index}.fromTime`}
                              defaultValue={null}
                              key={slot.id}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <TimePicker
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        From Time
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(time) => {
                                      moment(
                                        field.onChange(time),
                                        'HH:mm:ss a',
                                      ).format('HH:mm:ss a')
                                    }}
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
                              {errors?.fromTime
                                ? errors.fromTime.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div style={{ marginLeft: '50px' }}>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.toTime}
                          >
                            <Controller
                              control={control}
                              name={`slotss.${index}.toTime`}
                              defaultValue={null}
                              key={slot.id}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <TimePicker
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        To Time
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(time) => {
                                      moment(
                                        field.onChange(time),
                                        'HH:mm:ss a',
                                      ).format('HH:mm:ss a')
                                    }}
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
                              {errors?.toTime ? errors.toTime.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div style={{ marginLeft: '50px' }}>
                          <TextField
                            defaultValue={null}
                            key={slot.id}
                            id="standard-basic"
                            label={
                              language === 'en'
                                ? "Add No.Of Slot's"
                                : 'No.Of Available Slots'
                            }
                            variant="standard"
                            {...register(`slotss.${index}.noOfSlots`)}
                          // error={!!errors.noOfSlots}
                          // helperText={
                          //   errors?.noOfSlots
                          //     ? errors.noOfSlots.message
                          //     : null
                          // }
                          />
                          <TextField
                            hidden
                            sx={{ opacity: '0%' }}
                            key={slot.id}
                            {...register(`slotss.${index}.id`)}
                          />
                        </div>
                        <div
                          item
                          xs={4}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: '50px',
                          }}
                        >
                            <Button
                              variant="contained"
                              size="small"
                              // startIcon={<DeleteIcon />}
                              style={{
                                color: 'white',
                                backgroundColor: 'red',
                                height: '30px',
                              }}
                              onClick={() => {
                                remove(index)
                              }}
                            >
                              Delete
                            </Button>
                        </div>
                      </div>
                    </>
                  )
                })}
              </div>

            
                <div className={styles.btnappr}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<CancelIcon />}
                    // type="primary"
                    onClick={() => {
                      // setBtnSaveText('Save')
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<CancelIcon />}
                    onClick={() =>{{setValue("slotss",[]),setmodalforBook(false)}}
                    }
                  >
                    Exit
                  </Button>
                </div>
            </div>
          </form>
       
        </Modal>
      </div>

      {/* <BasicLayout> */}
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 4,
            marginRight: 4,
            marginTop: 2,
            marginBottom: 1,
            padding: 5,
            border: 1,
          }}
        >
          <div className={styles.small}>
            <div className={styles.detailsApot}>
              <div className={styles.h1TagApot}>
                <h1
                  style={{
                    color: 'white',
                    marginTop: '1px',
                  }}
                >
                  {/* <FormattedLabel id="SlotMasterHead" /> */}
                  {language=='en'?'Slot Master':'स्लॉट मास्टर'}
                </h1>
              </div>
            </div>

            <div className={styles.appoitment} style={{ marginTop: '25px' }}>
              <Controller
                control={control}
                name="slotDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <CustomizedCalendarPicker
                      sx={{
                        '.mui-style-1n2mv2k': {
                          display: 'flex',
                          justifyContent: 'space-evenly',
                        },
                        '.css-mvmu1r': {
                          display: 'flex',
                          justifyContent: 'space-evenly',
                        },
                        '.css-1dozdou': {
                          backgroundColor: 'red',
                          marginLeft: '5px',
                        },
                        '.mui-style-mvmu1r': {
                          display: 'flex',
                          justifyContent: 'space-evenly',
                        },
                      }}
                      orientation="landscape"
                      openTo="day"
                      inputFormat="DD/MM/YYYY"
                      shouldDisableDate={isWeekend}
                      minDate={new Date()}
                      value={field.value}
                      onChange={(date) => {
                        setSelectedDate(moment(date).format('DD-MM-YY'))
                        getSlot(moment(date).format('YYYY-MM-DD'))
                        setmodalforBook(true),
                          field.onChange(moment(date).format('YYYY-MM-DD'))
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
          </div>
        </Paper>
      </ThemeProvider>
      {/* </BasicLayout> */}
    </>
  )
}

export default SlotMaster;
