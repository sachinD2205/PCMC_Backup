import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from '@mui/material'
import urls from '../../../../URLS/urls'
import sweetAlert from 'sweetalert'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import schema from '../../../../containers/schema/common/topUpProcess'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid } from '@mui/x-data-grid'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import axios from 'axios'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import styles from '../../../../styles/[topUpProcess].module.css'
import { useSelector } from 'react-redux'

const TopUpProcess = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const [buttonInputState, setButtonInputState] = useState()
  const [dataSource, setDataSource] = useState([])
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [slideChecked, setSlideChecked] = useState(false)
  const [id, setID] = useState()

  const [pageSize, setPageSize] = useState()
  const [totalElements, setTotalElements] = useState()
  const [pageNo, setPageNo] = useState()
  const [paymentModes, setPaymentModes] = useState([])
  const [cfcCenters, setCfcCenters] = useState([])

  // const language = useSelector((state) => state?.lables.language);
  const language = useSelector((state) => state?.labels.language)

  useEffect(() => {
    getTopUpProcess()
  }, [paymentModes, cfcCenters])

  useEffect(() => {
    getPaymentMode()
  }, [])

  useEffect(() => {
    getCfcCenter()
  }, [])

  const getTopUpProcess = (_pageSize = 10, _pageNo = 0) => {
    console.log('_pageSize,_pageNo', _pageSize, _pageNo)
    axios
      .get(`${urls.CFCURL}/trasaction/topUpProcess/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res, i) => {
        console.log(';res', res)

        let result = res.data.topUpProcess
        setDataSource(
          result.map((res, i) => {
            return {
              activeFlag: res.activeFlag,
              cfcId: res.cfcId,
              srNo: i + 1,
              cfcName: res.cfcName,
              cfcNamee: cfcCenters?.find((obj) => obj?.id === res.cfcName)
                ?.cfcName,
              id: res.id,
              // fromDate: moment(res.fromDate).format("llll"),
              // toDate: moment(res.toDate).format("llll"),
              cfcNameMr: res.cfcNameMr,
              rechargeAmount: res.rechargeAmount,
              paymentMode: res.paymentMode,
              status: res.status,
              cfcUserRemark: res.cfcUserRemark,
              clerkRemark: res.clerkRemark,
              paymentMode: res.paymentMode,
              paymentModeName: paymentModes?.find(
                (obj) => obj?.id === res.paymentMode
              )?.paymentMode,
              status: res.activeFlag === 'Y' ? 'Active' : 'InActive',
            }
          })
        )

        // setDataSource(
        //   res.data.billType.map((val, i) => {
        //     return {};
        //   })
        // );
        // setDataSource(()=>abc);
        setTotalElements(res.data.totalElements)
        setPageSize(res.data.pageSize)
        setPageNo(res.data.pageNo)
      })
  }

  const getPaymentMode = () => {
    axios.get(`${urls.CFCURL}/master/paymentMode/getAll`).then((res) => {
      setPaymentModes(
        res.data.paymentMode.map((r, i) => ({
          id: r.id,
          paymentMode: r.paymentMode,
          paymentModeMr: r.paymentModeMr,
        }))
      )
    })
  }

  const getCfcCenter = () => {
    axios.get(`${urls.CFCURL}/master/cfcCenters/getAll`).then((res) => {
      setCfcCenters(
        res.data.cfcCenters.map((r, i) => ({
          id: r.id,
          cfcName: r.cfcName,
          cfcNameMr: r.cfcNameMr,
        }))
      )
    })
  }

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log('body', body)
    if (_activeFlag === 'N') {
      swal({
        title: 'Deactivate?',
        text: 'Are you sure you want to deactivate this Record ? ',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/trasaction/topUpProcess/save`, body, {
              headers: {
                role: 'CFC_USER',
              },
            })
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 200) {
                swal('Record is Successfully Deactivated!', {
                  icon: 'success',
                })
                getTopUpProcess()
                getPaymentMode()
                setButtonInputState(false)
              }
            })
        } else if (willDelete == null) {
          swal('Record is Safe')
        }
      })
    } else {
      swal({
        title: 'Activate?',
        text: 'Are you sure you want to activate this Record ? ',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/trasaction/topUpProcess/save`, body, {
              headers: {
                role: 'CFC_USER',
              },
            })
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 200) {
                swal('Record is Successfully activated!', {
                  icon: 'success',
                })
                getTopUpProcess()
                setButtonInputState(false)
              }
            })
        } else if (willDelete == null) {
          swal('Record is Safe')
        }
      })
    }
  }

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setDeleteButtonState(false)
  }

  const onSubmitForm = (formData) => {
    console.log('formData', formData)
    // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      // fromDate,
      // toDate,
    }

    console.log('finalBodyForApi', finalBodyForApi)

    axios
      .post(`${urls.CFCURL}/trasaction/topUpProcess/save`, finalBodyForApi, {
        headers: {
          role: 'CFC_USER',
        },
      })
      .then((res) => {
        console.log('save data', res)
        if (res.status == 200) {
          formData.id
            ? sweetAlert('Updated!', 'Record Updated successfully !', 'success')
            : sweetAlert('Saved!', 'Record Saved successfully !', 'success')
          getTopUpProcess()
          setButtonInputState(false)
          setIsOpenCollapse(false)
          setEditButtonInputState(false)
          setDeleteButtonState(false)
        }
      })
  }

  const resetValuesExit = {
    // fromDate: null,
    // toDate: null,
    // cfcId: "",
    cfcName: null,
    // cfcNameMr: "",
    rechargeAmount: '',
    paymentMode: null,
    status: '',
    cfcUserRemark: '',
    clerkRemark: '',
  }

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const resetValuesCancell = {
    // fromDate: null,
    // toDate: null,
    // cfcId: "",
    cfcName: null,
    // cfcNameMr: "",
    rechargeAmount: '',
    paymentMode: null,
    status: '',
    cfcUserRemark: '',
    clerkRemark: '',
  }

  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      flex: 1,
    },
    // {
    //   field: "fromDate",
    //   headerName: <FormattedLabel id="fromDate" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 250,
    // },
    // {
    //   field: "toDate",
    //   headerName: <FormattedLabel id="toDate" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 250,
    // },
    // {
    //   field: "cfcId",
    //   headerName: <FormattedLabel id="cfcId" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 100,
    // },
    {
      field: 'cfcNamee',
      headerName: <FormattedLabel id='cfcName' />,
      // type: "number",
      flex: 1,
      minWidth: 100,
    },
    // {
    //   field: "cfcNameMr",
    //   headerName: <FormattedLabel id="cfcNameMr" />,
    //   flex: 1,
    //   minWidth: 100,
    // },
    {
      field: 'rechargeAmount',
      headerName: <FormattedLabel id='rechargeAmount' />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'paymentModeName',
      headerName: <FormattedLabel id='paymentMode' />,
      // type: "number",
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'status',
      headerName: <FormattedLabel id='status' />,
      // type: "number",
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'cfcUserRemark',
      headerName: <FormattedLabel id='cfcUserRemark' />,
      // type: "number",
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'clerkRemark',
      headerName: <FormattedLabel id='clerkRemark' />,
      // type: "number",
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'actions',
      headerName: <FormattedLabel id='actions' />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText('Update'),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log('params.row: ', params.row)
                reset(params.row)
              }}
            >
              <Tooltip title='Edit'>
                <EditIcon style={{ color: '#556CD6' }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText('Update'),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log('params.row: ', params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == 'Y' ? (
                <Tooltip title='Deactivate'>
                  <ToggleOnIcon
                    style={{ color: 'green', fontSize: 30 }}
                    onClick={() => deleteById(params.id, 'N')}
                  />
                </Tooltip>
              ) : (
                <Tooltip title='Activate'>
                  <ToggleOffIcon
                    style={{ color: 'red', fontSize: 30 }}
                    onClick={() => deleteById(params.id, 'Y')}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        )
      },
    },
  ]

  return (
    <div>
      <Paper style={{ margin: '50px' }}>
        {isOpenCollapse && (
          <Slide direction='down' in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: '10px' }}>
                {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC ID"
                    label={<FormattedLabel id="cfcId" />}
                    variant="standard"
                    {...register("cfcId")}
                    error={!!errors.cfcId}
                    helperText={errors?.cfcId ? errors.cfcId.message : null}
                  />
                </Grid> */}
                {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="cfcName" />}
                    // label="CFC Name"
                    variant="standard"
                    {...register("cfcName")}
                    error={!!errors.cfcName}
                    helperText={errors?.cfcName ? errors.cfcName.message : null}
                  />
                </Grid> */}
                <Grid
                  Citizen
                  Facilitation
                  Center
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FormControl
                    variant='outlined'
                    size='small'
                    // fullWidth
                    sx={{ width: '40%' }}
                    error={!!errors.cfcName}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      <FormattedLabel id='cfcName' />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          variant='standard'
                          onChange={(value) => field.onChange(value)}
                          // label="Payment Mode"
                        >
                          {cfcCenters &&
                            cfcCenters.map((cfcName, index) => {
                              return (
                                <MenuItem key={index} value={cfcName.id}>
                                  {language == 'en'
                                    ? cfcName?.cfcName
                                    : cfcName?.cfcNameMr}
                                  {/* {cfcName.cfcName} */}
                                </MenuItem>
                              )
                            })}
                        </Select>
                      )}
                      name='cfcName'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {errors?.cfcName ? errors.cfcName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    size='small'
                    style={{ backgroundColor: 'white' }}
                    id='outlined-basic'
                    label={<FormattedLabel id='rechargeAmount' />}
                    // label="Recharge Amount"
                    variant='standard'
                    {...register('rechargeAmount')}
                    error={!!errors.rechargeAmount}
                    helperText={
                      errors?.rechargeAmount
                        ? errors.rechargeAmount.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  Payment
                  Mode
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FormControl
                    variant='outlined'
                    size='small'
                    // fullWidth
                    sx={{ width: '40%' }}
                    error={!!errors.paymentMode}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      <FormattedLabel id='paymentMode' />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          variant='standard'
                          onChange={(value) => field.onChange(value)}
                          // label="Payment Mode"
                        >
                          {paymentModes &&
                            paymentModes.map((paymentMode, index) => {
                              return (
                                <MenuItem key={index} value={paymentMode.id}>
                                  {paymentMode.paymentMode}
                                </MenuItem>
                              )
                            })}
                        </Select>
                      )}
                      name='paymentMode'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {errors?.paymentMode ? errors.paymentMode.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="cfcNameMr" />}
                    variant="standard"
                    {...register("cfcNameMr")}
                    error={!!errors.cfcNameMr}
                    helperText={
                      errors?.cfcNameMr ? errors.cfcNameMr.message : null
                    }
                  />
                </Grid> */}
              </Grid>
              {/* <Grid container style={{ padding: "10px" }}> */}
              {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    sx={{ marginTop: 5 }}
                    error={!!errors.fromDate}
                  >
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="fromDate" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
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
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
              {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    sx={{ marginTop: 5 }}
                    error={!!errors.toDate}
                  >
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="toDate" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
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
                </Grid> */}
              {/* </Grid> */}
              <Grid container style={{ padding: '10px' }}>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5, marginLeft: 20 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    size='small'
                    style={{ backgroundColor: 'white' }}
                    id='outlined-basic'
                    // label="CFC User Remark"
                    label={<FormattedLabel id='cfcUserRemark' />}
                    variant='standard'
                    {...register('cfcUserRemark')}
                    error={!!errors.cfcUserRemark}
                    helperText={
                      errors?.cfcUserRemark
                        ? errors.cfcUserRemark.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5, marginLeft: 13 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    size='small'
                    style={{ backgroundColor: 'white' }}
                    id='outlined-basic'
                    label={<FormattedLabel id='clerkRemark' />}
                    // label="Clerk Remark"
                    variant='standard'
                    disabled
                    {...register('clerkRemark')}
                    error={!!errors.clerkRemark}
                    helperText={
                      errors?.clerkRemark ? errors.clerkRemark.message : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container style={{ padding: '10px' }}>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    sx={{ marginRight: 8 }}
                    type='submit'
                    variant='contained'
                    color='success'
                    endIcon={<SaveIcon />}
                  >
                    {<FormattedLabel id={btnSaveText} />}
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    sx={{ marginRight: 8 }}
                    variant='contained'
                    color='primary'
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id='clear' />
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant='contained'
                    color='error'
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id='exit' />
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: '10px' }}>
          <Grid item xs={9}></Grid>
          <Grid
            item
            xs={2}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant='contained'
              endIcon={<AddIcon />}
              type='primary'
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                })
                setEditButtonInputState(true)
                setDeleteButtonState(true)
                setBtnSaveText('Save')
                setButtonInputState(true)
                setSlideChecked(true)
                setIsOpenCollapse(!isOpenCollapse)
              }}
            >
              <FormattedLabel id='add' />{' '}
            </Button>
          </Grid>
        </Grid>
        {console.log('11111', dataSource)}
        <DataGrid
          autoHeight
          sx={{
            margin: 5,
          }}
          rows={dataSource}
          // rows={abc}
          // rows={jugaad}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => {
            getTopUpProcess(newPageSize)
            setPageSize(newPageSize)
          }}
          onPageChange={(e) => {
            console.log('event', e)
            getTopUpProcess(pageSize, e)
            console.log('dataSource->', dataSource)
          }}
          // {...dataSource}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          rowCount={totalElements}
          //checkboxSelection
        />
      </Paper>
    </div>
  )
}

export default TopUpProcess
