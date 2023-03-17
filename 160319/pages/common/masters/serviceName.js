import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import {
  Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Paper,
  Select, Slide,
  TextField
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider
} from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment/moment'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import sweetAlert from 'sweetalert'
import * as yup from 'yup'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import styles from "../../../styles/[service]view.module.css"
import urls from '../../../URLS/urls'

const Index = () => {
  let schema = yup.object().shape({
    // service: yup.string().required('Service Name is Required !!!'),
    // village: yup.string().required(" Village is Required !!"),
    // ward: yup.string().required(" Ward is Required !!"),
    // zone: yup.string().required(" Zone is Required !!"),
    // remark: yup.string().required(" Remark is Required !!"),
  })

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const language = useSelector((state) => state.labels.language);

  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState(null)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [departments, setDepartments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loiGeneration, setLoiGeneration] = useState(false);
  const [scrutinyProcess, setScrutinyProcess] = useState(false);
  const [immediateAtCounter, setImmediateAtCounter] = useState(false);
  const [rtsSelection, setRtsSelection] = useState(false);


  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  // Get Table - Data
  const getServiceMaster = async (_pageSize = 10, _pageNo = 0) => {
    await axios
      .get(`${urls.BaseURL}/service/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log('For Sr.NO', Number(_pageNo + "0"))

        let _res = res.data.service.map((r, i) => ({
          srNo: Number(_pageNo + "0") + i + 1,
          id: r.id,
          ...r,
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          application: r.application,
          applicationNameEng: applications.find(
            (obj) => obj?.id === r.application
          )?.applicationNameEng,
          applicationNameMr: applications.find(
            (obj) => obj?.id === r.application
          )?.applicationNameMr,
          department: r.department,
          departmentName: departments?.find(
            (obj) => obj?.id == r.department
          )?.department,
          departmentNameMr: departments?.find(
            (obj) => obj?.id == r.department
          )?.departmentMr,
          serviceName: r.serviceName,
          serviceNameMr: r.serviceNameMr,
          serviceDays: r.serviceDays,
          scrutinyProcess: r.scrutinyProcess,
          noOfScrutinyLevel: r.noOfScrutinyLevel,
          immediateAtCounter: r.immediateAtCounter,
          rtsSelection: r.rtsSelection,
          loiGeneration: r.loiGeneration,

          scrutinyProcessOp: r.scrutinyProcess == true ? "Yes" : "No",
          immediateAtCounterOp: r.immediateAtCounter == true ? "Yes" : "No",
          rtsSelectionOp: r.rtsSelection == true ? "Yes" : "No",
          loiGenerationOp: r.loiGeneration == true ? "Yes" : "No",

          scrutinyProcessMrOp: r.scrutinyProcess == true ? "होय" : "नाही",
          immediateAtCounterMrOp: r.immediateAtCounter == true ? "होय" : "नाही",
          rtsSelectionMrOp: r.rtsSelection == true ? "होय" : "नाही",
          loiGenerationMrOp: r.loiGeneration == true ? "होय" : "नाही",

          status: r.activeFlag === 'Y' ? 'Active' : 'Inactive',
          activeFlag: r.activeFlag,

        }))

        console.log("_service res--->", res.data.service);
        console.log("_res--->", _res);
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        })
      })
  }

  const getApplication = async () => {
    await axios.get(`${urls.BaseURL}/application/getAll`).then((r) => {
      setApplications(
        r.data.map((row) => ({
          id: row.id,
          appCode: row.appCode,
          applicationNameEng: row.applicationNameEng,
          applicationNameMr: row.applicationNameMr,
          module: row.module,
        }))
      );
    });
  };

  const getDepartment = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`)

      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          }))
        );
      });
  };

  useEffect(() => {
    getDepartment();
  }, [])

  useEffect(() => {
    getApplication();
  }, [departments])

  useEffect(() => {
    getServiceMaster()
  }, [applications])

  // const editRecord = (rows) => {
  //   console.log('Edit cha data:', rows)
  //   setBtnSaveText('Update'),
  //     setID(rows.id),
  //     setIsOpenCollapse(true),
  //     setSlideChecked(true)
  //   reset(rows)
  // }


  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
      fromDate: moment(formData.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      toDate: moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
    };

    axios.post(`${urls.BaseURL}/service/save`, finalBodyForApi).then((res) => {
      if (res.status == 200) {
        formData.id
          ? sweetAlert('Updated!', 'Record Updated successfully !', 'success')
          : sweetAlert('Saved!', 'Record Saved successfully !', 'success')
        getApplication();
        setButtonInputState(false)
        setIsOpenCollapse(false)
        setEditButtonInputState(false)
        setDeleteButtonState(false)
      }
    })
  }

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    // console.log('body', body)
    if (_activeFlag === 'N') {
      swal({
        title: 'Inactivate?',
        text: 'Are you sure you want to inactivate this Record ? ',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // // console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.BaseURL}/service/save`, body)
            .then((res) => {
              // console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getApplication();
                setButtonInputState(false);
              }
            });
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
        // console.log('inn', willDelete)
        if (willDelete === true) {
          axios.post(`${urls.BaseURL}/service/save`, body).then((res) => {
            // console.log('delet res', res)
            if (res.status == 200) {
              swal('Record is Successfully activated!', {
                icon: 'success',
              })
              getServiceMaster()
              setButtonInputState(false)
            }
          })
        } else if (willDelete == null) {
          swal('Record is Safe')
        }
      })
    }
  }

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValues,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setDeleteButtonState(false)
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValues,
      id,
    })
  }

  // Reset Values Cancell || Exit
  const resetValues = {
    serviceName: '',
    serviceDays: null,
    rtsSelection: false,
    immediateAtCounter: false,
    scrutinyProcess: false,
    loiGeneration: false,
    noOfScrutinyLevel: null,
    department: null,
    application: null,
    toDate: null,
    fromDate: null,
    serviceNameMr: '',
  };

  // define colums table
  const columns = [
    {
      field: 'srNo',
      headerName: 'Sr.No',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    // {
    //   field: "departmentName",
    //   headerName: "Department",
    //   flex: 1,
    // },
    // {
    //   field: 'fromDate',
    //   headerName: 'From Date',
    //   // type: "number",
    //   flex: 3,
    //   align: 'center',
    //   headerAlign: 'center',
    // },
    // {
    //   field: 'toDate',
    //   headerName: 'To Date',
    //   // type: "number",
    //   flex: 3,
    //   align: 'center',
    //   headerAlign: 'center',
    // },

    {
      field: language == 'en' ? "departmentName" : "departmentNameMr",
      headerName: <FormattedLabel id="department" />,
      // type: "number",
      flex: 6,
      minWidth: 250,
    },

    {
      field: language == 'en' ? "serviceName" : "serviceNameMr",
      headerName: <FormattedLabel id="serviceName" />,
      // type: "number",
      flex: 6,
      align: 'center',
      headerAlign: 'center',
      minWidth: 400,
    },

    // {
    //   field: language=='en'? "applicationNameEng":"applicationNameMr",
    //   headerName: "Module Name",
    //   flex: 1,
    // },

    {
      field: "serviceDays",
      headerName: <FormattedLabel id="serviceDays" />,
      //type: "number",
      flex: 3,
      align: 'center',
      headerAlign: 'center',
      minWidth: 110,
    },

    {
      field: language == 'en' ? "scrutinyProcessOp" : "scrutinyProcessMrOp",
      headerName: <FormattedLabel id="isScrutinyBased" />,
      //type: "number",
      flex: 5,
      align: 'center',
      headerAlign: 'center',
      minWidth: 190,
    },

    {
      field: language == 'en' ? "rtsSelectionOp" : "rtsSelectionMrOp",
      headerName: <FormattedLabel id="rtsSelection" />,
      //type: "number",
      flex: 5,
      align: "center",
      headerAlign: "center",
      minWidth: 230,
    },

    {
      field: language == 'en' ? "immediateAtCounterOp" : "immediateAtCounterMrOp",
      headerName: <FormattedLabel id="isImmediateAtCounter" />,
      //type: "number",
      flex: 8,
      align: "center",
      headerAlign: "center",
      minWidth: 180,
    },

    {
      field: language == 'en' ? "loiGenerationOp" : "loiGenerationMrOp",
      headerName: <FormattedLabel id="loiGeneration" />,
      //type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 210,
    },
    // {
    //   field: "noOfScrutinyLevel",
    //   headerName: "No Of Scrutiny Level",
    //   //type: "number",
    //   flex: 1,
    //   align: 'center',
    //   headerAlign: 'center',
    // },
    {
      field: 'status',
      headerName: <FormattedLabel id="status" />,
      //type: "number",
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      minWidth: 100,
    },
    {
      field: 'actions',
      headerName: 'Actions',
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
                // // console.log('params?.row: ', params?.row)
                reset(params.row)
                setLoiGeneration(params.row.loiGeneration)
                setScrutinyProcess(params.row.scrutinyProcess)
                setImmediateAtCounter(params.row.immediateAtCounter)
                setRtsSelection(params.row.rtsSelection)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText('Update'),
                  setID(params.row.id),
                  setSlideChecked(true)
                setButtonInputState(true)
                // setIsOpenCollapse(true),
                // // console.log('params.row: ', params.row)
                // reset(params.row)
                // setLoiGeneration(params.row.loiGeneration)
                // setScrutinyProcess(params.row.scrutinyProcess)
                // setImmediateAtCounter(params.row.immediateAtCounter)
                // setRtsSelection(params.row.rtsSelection)
              }}
            >
              {params.row.activeFlag == 'Y' ? (
                <ToggleOnIcon
                  style={{ color: 'green', fontSize: 30 }}
                  onClick={() => deleteById(params.id, 'N')}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: 'red', fontSize: 30 }}
                  onClick={() => deleteById(params.id, 'Y')}
                />
              )}
            </IconButton>
          </>
        )
      },
    },
  ]

  // View
  return (
    <>

      {/* <Grid
        container

        sx={{
          backgroundColor: "#0084ff",
          // backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          marginTop: 10,
          marginBottom: 2,
          padding: 8,
          // paddingLeft: 20,
          // marginLeft: "40px",
          // marginRight: "65px",
          borderRadius: 100,
          padding: "10px"
        }}
      > */}
      {/* <Grid item xs={12}
          style={{ marginLeft: "none" }}
        > */}
      {/* <FormattedLabel id={"serviceMasterHeader"} /> */}
      {/* </Grid> */}
      {/* <Grid>
          <AddIcon></AddIcon>
        </Grid> */}
      {/* </Grid> */}

      {/* <div
        style={{
          backgroundColor: "#0084ff",
          // backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 20,
          // marginLeft: "40px",
          // marginRight: "65px",
          borderRadius: 100,
          
        }}
      > */}
      {/* Service Name */}
      {/* <FormattedLabel id='aadharAuthentication' /> */}

      {/* <AddIcon></AddIcon> */}
      {/* </div> */}

      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id='serviceMasterHeader' />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant='contained'
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValues,
              })
              setEditButtonInputState(true)
              setDeleteButtonState(true)
              setBtnSaveText('Save')
              setButtonInputState(true)
              setSlideChecked(true)
              setIsOpenCollapse(!isOpenCollapse)
            }}
          >
            <AddIcon size='70' />
          </Button>
        </Box>
      </Box>

      <Paper>
        {isOpenCollapse && (
          <Slide direction='down' in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div>

                    <Grid container sx={{ padding: '10px' }}>
                      <Grid item xs={3}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <FormControl
                          style={{ marginTop: 50 }}
                          error={!!errors.fromDate}
                        >
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date
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
                      </Grid>

                      <Grid item xs={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          style={{ marginTop: 50 }}
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
                                      To Date
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
                      </Grid>

                      <Grid item xs={3}
                        // sx={{ marginTop: 5 }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >

                        <FormControl
                          variant="standard"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 36,
                          }}
                          // sx={{ width: 250, marginTop: 5, marginLeft: 12 }}
                          error={!!errors.applicationNameEng}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Application Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Application Name"
                              >
                                {applications &&
                                  applications.map(
                                    (applicationNameEng, index) => (
                                      <MenuItem
                                        key={index}
                                        value={applicationNameEng.id}
                                      >
                                        {applicationNameEng.applicationNameEng}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="application"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.applicationNameEng
                              ? errors.applicationNameEng.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >

                        <FormControl
                          variant="outlined"
                          size="small"
                          // fullWidth
                          sx={{ width: 250, marginTop: 5 }}
                          error={!!errors.department}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="department" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                variant="standard"
                                onChange={(value) => field.onChange(value)}
                              // label="Payment Mode"
                              >
                                {departments &&
                                  departments.map((department, index) => {
                                    return (
                                      <MenuItem key={index} value={department.id}>
                                        {department.department}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="department"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.department ? errors.department.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>




                    {/* ithn khali zalet */}
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id='standard-basic'
                          label={<FormattedLabel id="serviceCode" />}
                          variant='standard'
                          {...register('serviceCode')}
                          error={!!errors.serviceCode}
                          helperText={
                            errors?.serviceCode ? errors.serviceCode.message : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id='standard-basic'
                          label={<FormattedLabel id="serviceNameEn" />}
                          variant='standard'
                          {...register('serviceName')}
                          error={!!errors.serviceName}
                          helperText={
                            errors?.serviceName ? errors.serviceName.message : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id="standard-basic"
                          label={<FormattedLabel id="serviceNameMr" />}
                          variant="standard"
                          {...register("serviceNameMr")}
                          error={!!errors.serviceNameMr}
                          helperText={
                            errors?.serviceNameMr ? errors.serviceNameMr.message : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id='standard-basic'
                          label={<FormattedLabel id="serviceDays" />}
                          variant='standard'
                          {...register('serviceDays')}
                          error={!!errors.serviceDays}
                          helperText={
                            errors?.serviceDays
                              ? errors.serviceDays.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>

                    <Grid container style={{ padding: "10px" }}>

                      <Grid
                        item
                        xs={3}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id='standard-basic'
                          label={<FormattedLabel id="url" />}
                          variant='standard'
                          {...register('clickTo')}
                          error={!!errors.clickTo}
                          helperText={
                            errors?.clickTo
                              ? errors.clickTo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id='standard-basic'
                          label={<FormattedLabel id="displayOrder" />}
                          variant='standard'
                          {...register('displayOrder')}
                          error={!!errors.displayOrder}
                          helperText={
                            errors?.displayOrder
                              ? errors.displayOrder.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={3}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <FormControl error={!!errors.scrutinyProcess}>
                          <FormControlLabel
                            control={<Checkbox disabled={immediateAtCounter} checked={scrutinyProcess} />}
                            sx={{ width: 250, marginTop: 9, marginX: 3 }}
                            label={<FormattedLabel id="isScrutinyBased" />}
                            {...register('scrutinyProcess')}
                            onChange={(e) => {
                              // console.log("[on]",e.target.checked);
                              setScrutinyProcess(e.target.checked)
                            }}
                          />
                          <FormHelperText>
                            {errors?.scrutinyProcess
                              ? errors.scrutinyProcess.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={3}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {scrutinyProcess && (
                          <>
                            <TextField
                              sx={{ width: 250, marginTop: 5 }}
                              id='standard-basic'
                              label={<FormattedLabel id="noOfScrutinyLevels" />}
                              variant='standard'
                              {...register('noOfScrutinyLevel')}
                              error={!!errors.noOfScrutinyLevel}
                              helperText={
                                errors?.noOfScrutinyLevel
                                  ? errors.noOfScrutinyLevel.message
                                  : null
                              }
                            />
                          </>)}


                      </Grid>

                    </Grid>

                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={3}
                        // style={{
                        //   display: "flex",
                        //   justifyContent: "left",
                        //   alignItems: "left",
                        // }}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <FormControl error={!!errors.rtsSelection}>
                          <FormControlLabel
                            control={<Checkbox checked={rtsSelection} />}
                            // sx={{ marginTop: 5, marginX: 3 }}
                            sx={{ width: 250, marginTop: 9, marginX: 3 }}
                            label={<FormattedLabel id="rtsSelection" />}
                            {...register('rtsSelection')}
                            onChange={(e) => {
                              setRtsSelection(e.target.checked)
                            }}
                          />
                          <FormHelperText>
                            {errors?.rtsSelection
                              ? errors.rtsSelection.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={3}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <FormControl error={!!errors.immediateAtCounter}>
                          <FormControlLabel
                            control={<Checkbox disabled={scrutinyProcess} checked={immediateAtCounter} />}
                            // sx={{ marginTop: 5, marginX: 3 }}
                            sx={{ width: 250, marginTop: 9, marginX: 3 }}
                            label={<FormattedLabel id="isImmediateAtCounter" />}
                            {...register('immediateAtCounter')}
                            onChange={(e) => {
                              setImmediateAtCounter(e.target.checked)
                            }}
                          />
                          <FormHelperText>
                            {errors?.immediateAtCounter
                              ? errors.immediateAtCounter.message
                              : null}
                          </FormHelperText>
                        </FormControl>

                      </Grid>

                      <Grid
                        item
                        xs={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl error={!!errors.loiGeneration}>
                          <FormControlLabel
                            control={<Checkbox checked={loiGeneration} />}
                            // sx={{ marginTop: 5, marginX: 3 }}
                            sx={{ width: 250, marginTop: 9, marginX: 3 }}
                            label={<FormattedLabel id="loiGeneration" />}
                            {...register('loiGeneration')}
                            onChange={(e) => {
                              setLoiGeneration(e.target.checked)
                            }}
                          />
                          <FormHelperText>
                            {errors?.loiGeneration
                              ? errors.loiGeneration.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                      </Grid>

                    </Grid>

                    {/* <div className={styles.buttons}> */}
                    <Grid container style={{ padding: "10px" }}>

                      <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >

                        <Button
                          sx={{ marginRight: 8, marginTop: 5, marginX: 3, marginBottom: 5 }}
                          type='submit'
                          variant='contained'
                          color='success'
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{' '}
                      </Grid>


                      <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <Button
                          sx={{ marginRight: 8, marginTop: 5, marginX: 3, marginBottom: 5 }}
                          variant='contained'
                          color='primary'
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                      </Grid>

                      <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <Button
                          variant='contained'
                          sx={{ marginRight: 8, marginTop: 5, marginX: 3, marginBottom: 5 }}
                          color='error'
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          Exit
                        </Button>
                      </Grid>
                    </Grid>

                    {/* </div> */}
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        {/* <Grid container sx={{ padding: '10px' }}>
          <Grid item xs={11}></Grid>
          <Grid item xs={1}>
            <Button
              variant='contained'
              endIcon={<AddIcon />}
              type='primary'
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValues,
                })
                setEditButtonInputState(true)
                setDeleteButtonState(true)
                setBtnSaveText('Save')
                setButtonInputState(true)
                setSlideChecked(true)
                setIsOpenCollapse(!isOpenCollapse)
              }}
            >
              Add{' '}
            </Button>
          </Grid>
        </Grid> */}
        {/* <Box style={{ height: 'auto', overflow: 'auto' }}>
          <DataGrid
            sx={{
              // fontSize: 16,
              // fontFamily: 'Montserrat',
              // font: 'center',
              // backgroundColor:'yellow',
              // // height:'auto',
              // border: 2,
              // borderColor: "primary.light",
              overflowY: 'scroll',

              '& .MuiDataGrid-virtualScrollerContent': {
                // backgroundColor:'red',
                // height: '800px !important',
                // display: "flex",
                // flexDirection: "column-reverse",
                // overflow:'auto !important'
              },
              '& .MuiDataGrid-columnHeadersInner': {
                backgroundColor: '#556CD6',
                color: 'white',
              },

              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
            density='compact'
            autoHeight={true}
            // rowHeight={50}
            pagination
            paginationMode='server'
            // loading={data.loading}
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getServiceMaster(data.pageSize, _data)
            }}
            onPageSizeChange={(_data) => {
              // console.log('222', _data)
              // updateData("page", 1);
              getServiceMaster(_data, data.page)
            }}
          />
        </Box> */}

        <Box style={{ height: "100%", width: "100%" }}>
          {/* For Pagination Changes in Code */}
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            components={{ Toolbar: GridToolbar }}
            autoHeight
            density='compact'
            sx={{
              paddingLeft: "1%",
              paddingRight: "1%",
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                transform: "scale(1.1)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E1FDFF",
                // position: 'sticky', left: 0, zindex: 1, background: '#fff',
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#87E9F7",
              },
            }}
            pagination
            paginationMode='server'
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getServiceMaster(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getServiceMaster(_data, data.page);
            }}
          />
        </Box>
      </Paper>

    </>
  )
}

export default Index
