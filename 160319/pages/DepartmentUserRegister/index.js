import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  label,
  Select,
  TextField,
  Toolbar,
  Typography,
  ListItemText,
} from '@mui/material'
import urls from '../../URLS/urls'
import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import schema from '../../containers/schema/DepartmentUserRegisterSchema'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import styles from '../../styles/[DepartmentUserRegister].module.css'
import OutlinedInput from '@mui/material/OutlinedInput'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 0
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
}

const DepartmentUserRegister = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      departmentName: 'aa',
      designationName: 'bb',
      locationName: 'cc',
    },
    defaultValues: {
      applicationRolesList: [
        { departmentName: '', designationName: '', locationName: '' },
      ],
    },
    resolver: yupResolver(schema),
  })
  const [departmentList, setDepartmentList] = useState([])
  const [designationList, setDesignationList] = useState([])
  const [applicationList, setApplicationList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [officeLocationList, setOfficeLocationList] = useState([])
  const [locationList, setLocationList] = useState([])
  const [serviceList, setServiceList] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  // const [isDepartmentChecked, setIsDepartmentChecked] = useState(false);
  const [isCFCChecked, setIsCFCChecked] = useState(false)
  const [isOtherUserChecked, setIsOtherUserChecked] = useState(false)

  const [dataFromDUR, setDataFromDUR] = useState(false)

  const [selectedRoleName, setSelectedRoleName] = useState([])
  const [selectedModuleName, setSelectedModuleName] = useState([])

  const handleChange = (event) => {
    console.log('event', event)
    const {
      target: { value },
    } = event
    setSelectedRoleName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  const _handleChange = (event) => {
    console.log('event', event)
    const {
      target: { value },
    } = event
    setSelectedModuleName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      // name: "applicationName",
      name: 'applicationRolesList',
      control,
      // defaultValues: [
      //   {applicationName:'aa',
      // }]
    }
  )

  useEffect(() => {
    console.log(
      '444',
      router.query,
      router.query.mode === 'edit'
        ? setDataFromDUR(false)
        : setDataFromDUR(true)
    )
    if (router.query.mode === 'edit') {
      setDataFromDUR(true)
    }
    if (router.query.mode === undefined) {
      setDataFromDUR(false)
    }
    reset(router.query)
    setValue('mobileNumber', router.query.mobileNo)
    setValue('userName', router.query.username)
    setValue(
      'isDepartmentChecked',
      router.query.isDepartmentUser === 'true' ? true : false
    )
    setValue('isCFCChecked', router.query.isCfcUser === 'true' ? true : false)
    setValue(
      'isOtherUserChecked',
      router.query.isOtherUser === 'true' ? true : false
    )
  }, [router.query.pageMode])

  useEffect(() => {
    if (getValues(`applicationRolesList.length`) == 0) {
      appendUI()
    }
  }, [])

  useEffect(() => {
    getDepartmentName()
    getDesignationName()
    getApplicationsName()
    getRoleName()
    getLocationName()
    getServiceList()
    getOfficeLocation()
  }, [])

  const appendUI = () => {
    append({
      applicationName: '',
      roleName: '',
    })
  }

  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res department', r)
          setDepartmentList(r.data.department)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const getDesignationName = () => {
    axios
      .get(`${urls.CFCURL}/master/designation/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res designation', r)
          setDesignationList(r.data.designation)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const getApplicationsName = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res application', r)
          setApplicationList(r.data)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const getRoleName = () => {
    axios
      .get(`${urls.CFCURL}/master/mstRole/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res role', r)
          setRoleList(r.data.mstRole)
          // setRoleList(r.data.mstRole.map((val) => val.name));
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const getLocationName = () => {
    axios
      .get(`${urls.CFCURL}/master/locality/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res location', r)
          setLocationList(r.data)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const getServiceList = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res location', r)
          setServiceList(r.data.locality)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res office location', r)
          setOfficeLocationList(
            // r.data.officeLocation.map((val) => val.officeLocationName)
            r.data.officeLocation
          )
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const onFinish = (data) => {
    console.log('data', data)

    let applicationArray = data.applicationRolesList.map((val) => {
      return {
        officeId: val.locationName,
        departmentId: val.departmentName,
        designationId: val.designationName,
      }
    })

    console.log('applicationArray', applicationArray)

    const body = {
      userName: data.userName,
      password: data.password,
      empCode: data.employeeCode,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      phoneNo: data.mobileNumber,
      // department: data.departmentName,
      // designation: data.designationName,
      officeDepartmentDesignationUserDaoLst: applicationArray,
      roles: selectedRoleName,
      applications: selectedModuleName,
      cFCUser: data.isCFCChecked,
      otherUser: data.isOtherUserChecked,
      deptUser: data.isDepartmentChecked,
    }

    console.log('body', body)

    const headers = { Accept: 'application/json' }

    axios
      .post(`${urls.AuthURL}/signup`, body, { headers })
      .then((r) => {
        if (r.status == 200) {
          console.log('res', r)
          toast('Registered Successfully', {
            type: 'success',
          })
          router.push('/login')
        }
      })
      .catch((err) => {
        console.log('err', err)
        toast('Registeration Failed ! Please Try Again !', {
          type: 'error',
        })
      })
  }

  const handleApplicationNameChange = (value) => {
    console.log('value', value)
    let test = []

    let _ch =
      serviceList &&
      serviceList.filter((txt) => {
        return value.target.value === txt.application && txt
      })
    console.log('_ch', _ch)
    test.push(..._ch)

    // applicationList &&
    // applicationList.map((val) => {
    //  let _ch =  serviceList &&
    //     serviceList.filter((txt) => {
    //       return value.target.value === txt.application && txt;
    //     });
    //     console.log('_ch',_ch)
    //     test.push(..._ch);

    // });

    setFilteredServices(test)

    console.log(
      '123',
      applicationList &&
        applicationList.map((val) => {
          let _ch =
            serviceList &&
            serviceList.filter((txt) => {
              return val.id === txt.application && txt
            })
          console.log('_ch', _ch)
        })
    )
    console.log('arr', test)
  }

  const handleDepartmentChecked = (e) => {
    console.log('e', e)
    // setIsDepartmentChecked(e.target.checked);
  }

  const handleCFCChecked = (e) => {
    setIsCFCChecked(e.target.checked)
  }

  const handleOtherUserChecked = (e) => {
    setIsOtherUserChecked(e.target.checked)
  }

  return (
    <form onSubmit={handleSubmit(onFinish)}>
      <div>
        <Grid container style={{ padding: '10px' }}>
          <Grid
            item
            xs={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              size='small'
              id='outlined-basic'
              label='First Name'
              variant='outlined'
              disabled={dataFromDUR}
              style={{ backgroundColor: 'white' }}
              {...register('firstName')}
              error={errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              size='small'
              id='outlined-basic'
              label='Middle Name'
              variant='outlined'
              disabled={dataFromDUR}
              style={{ backgroundColor: 'white' }}
              {...register('middleName')}
              error={errors.middleName}
              helperText={errors.middleName?.message}
            />
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              size='small'
              id='outlined-basic'
              label='Last Name'
              variant='outlined'
              disabled={dataFromDUR}
              style={{ backgroundColor: 'white' }}
              {...register('lastName')}
              error={errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
        </Grid>
        <Grid container style={{ padding: '10px' }}>
          <Grid
            item
            xs={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              size='small'
              id='outlined-basic'
              label='Email ID'
              disabled={dataFromDUR}
              variant='outlined'
              style={{ backgroundColor: 'white' }}
              {...register('email')}
              error={errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              size='small'
              id='outlined-basic'
              label='Phone No.'
              variant='outlined'
              disabled={dataFromDUR}
              style={{ backgroundColor: 'white' }}
              {...register('mobileNumber')}
              error={errors.mobileNumber}
              helperText={errors.mobileNumber?.message}
            />
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              size='small'
              id='outlined-basic'
              label='Employee Code'
              disabled={dataFromDUR}
              variant='outlined'
              style={{ backgroundColor: 'white' }}
              {...register('employeeCode')}
              error={errors.employeeCode}
              helperText={errors.employeeCode?.message}
            />
          </Grid>
        </Grid>
        {/* <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xs={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl style={{ width: "48%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Department name
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={dataFromDUR}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={field.value}
                    label="Department name"
                    onChange={(value) => field.onChange(value)}
                    style={{ backgroundColor: "white" }}
                  >
                    {departmentList.length > 0
                      ? departmentList.map((val, id) => {
                          return (
                            <MenuItem key={id} value={val.id}>
                              {val.department}
                            </MenuItem>
                          );
                        })
                      : "Not Available"}
                  </Select>
                )}
                name="departmentName"
                control={control}
                defaultValue=""
              />

              <FormHelperText style={{ color: "red" }}>
                {errors?.departmentName ? errors.departmentName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl style={{ width: "48%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Location name
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={dataFromDUR}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={field.value}
                    label="Location name"
                    onChange={(value) => field.onChange(value)}
                    style={{ backgroundColor: "white" }}
                  >
                    {[
                      { id: 1, department: "Location 1" },
                      { id: 2, department: "Location 2" },
                    ].length > 0
                      ? [
                          { id: 1, department: "Location 1" },
                          { id: 2, department: "Location 2" },
                        ].map((val, id) => {
                          return (
                            <MenuItem key={id} value={val.id}>
                              {val.department}
                            </MenuItem>
                          );
                        })
                      : "Not Available"}
                  </Select>
                )}
                name="locationName"
                control={control}
                defaultValue=""
              />

              <FormHelperText style={{ color: "red" }}>
                {errors?.departmentName ? errors.departmentName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl fullWidth style={{ width: "48%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Designation name
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={dataFromDUR}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Designation name"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    style={{ backgroundColor: "white" }}
                  >
                    {designationList.length > 0
                      ? designationList.map((val, id) => {
                          return (
                            <MenuItem value={val.id} key={id}>
                              {val.designation}
                            </MenuItem>
                          );
                        })
                      : "Not Available"}
                  </Select>
                )}
                name="designationName"
                control={control}
                defaultValue=""
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.designationName
                  ? errors.designationName.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid> */}
        <Grid container style={{ padding: '10px' }}>
          <Grid
            item
            xs={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              size='small'
              id='outlined-basic'
              label='User Name'
              variant='outlined'
              disabled={dataFromDUR}
              style={{ backgroundColor: 'white' }}
              {...register('userName')}
              error={errors.userName}
              helperText={errors.userName?.message}
            />
          </Grid>
          <Grid
            item
            xs={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TextField
              size='small'
              id='outlined-basic'
              label='Password'
              // disabled
              disabled={dataFromDUR}
              defaultValue='Admin@123'
              variant='outlined'
              style={{ backgroundColor: 'white' }}
              {...register('password')}
              error={errors.password}
              helperText={errors.password?.message}
              type={showPassword ? '' : 'password'}
              InputProps={{
                style: { fontSize: '15px' },
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FormControl size='small' fullWidth sx={{ width: '50%' }}>
              <InputLabel id='demo-multiple-checkbox-label'>Role</InputLabel>
              <Select
                labelId='demo-multiple-checkbox-label'
                id='demo-multiple-checkbox'
                multiple
                sx={{ backgroundColor: 'white' }}
                value={selectedRoleName}
                disabled={dataFromDUR}
                onChange={handleChange}
                label='Role'
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {roleList.length > 0
                  ? roleList.map((name, index) => {
                      return (
                        <MenuItem key={index} value={name.name}>
                          <Checkbox
                            checked={selectedRoleName.indexOf(name.name) > -1}
                          />
                          <ListItemText primary={name.name} />
                        </MenuItem>
                      )
                    })
                  : []}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container style={{ padding: '10px' }}>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FormControl size='small' fullWidth sx={{ width: '50%' }}>
              <InputLabel id='demo-multiple-checkbox-label'>
                Module Name
              </InputLabel>
              <Select
                labelId='demo-multiple-checkbox-label'
                id='demo-multiple-checkbox'
                multiple
                sx={{ backgroundColor: 'white' }}
                value={selectedModuleName}
                disabled={dataFromDUR}
                onChange={_handleChange}
                label='Module Name'
                renderValue={(selected) => selected.join(', ')}
                // MenuProps={MenuProps}
              >
                {applicationList.length > 0
                  ? applicationList.map((name, index) => {
                      return (
                        <MenuItem key={index} value={name.applicationNameEng}>
                          <Checkbox
                            checked={
                              selectedModuleName.indexOf(
                                name.applicationNameEng
                              ) > -1
                            }
                          />
                          <ListItemText primary={name.applicationNameEng} />
                        </MenuItem>
                      )
                    })
                  : []}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container style={{ padding: '10px' }}>
          <Grid
            item
            xs={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              control={<Checkbox />}
              disabled={dataFromDUR}
              {...register('isDepartmentChecked')}
              // onChange={handleDepartmentChecked}
              label='Is Department User'
            />
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              disabled={dataFromDUR}
              control={<Checkbox />}
              {...register('isCFCChecked')}
              // onChange={handleCFCChecked}
              label='Is CFC User'
            />
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              disabled={dataFromDUR}
              control={<Checkbox />}
              {...register('isOtherUserChecked')}
              // onChange={handleOtherUserChecked}
              label='Is Other User'
            />
          </Grid>
        </Grid>

        <Box style={{ padding: '20px' }}>
          <Typography variant='h6'>Applications Roles List</Typography>
          <Divider style={{ background: 'black' }} />
        </Box>
        <Grid container>
          <Grid item xs={11} style={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              variant='contained'
              size='small'
              startIcon={<AddIcon />}
              onClick={() => {
                appendUI()
              }}
            >
              Add more
            </Button>
          </Grid>
        </Grid>
        <Grid container style={{ padding: '10px', backgroundColor: '#F9F9F9' }}>
          {fields.map((witness, index) => {
            return (
              <>
                <Grid
                  item
                  xs={3.4}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <FormControl style={{ width: '48%' }} size='small'>
                    <InputLabel id='demo-simple-select-label'>
                      Location name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Department name'
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value)
                            // handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: 'white' }}
                        >
                          {officeLocationList.length > 0
                            ? officeLocationList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.officeLocationName}
                                  </MenuItem>
                                )
                              })
                            : 'Not Available'}
                        </Select>
                      )}
                      name={`applicationRolesList[${index}].locationName`}
                      control={control}
                      defaultValue=''
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {errors?.locationName
                        ? errors.locationName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={3.4}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <FormControl style={{ width: '48%' }} size='small'>
                    <InputLabel id='demo-simple-select-label'>
                      Department name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Department name'
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value)
                            // handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: 'white' }}
                        >
                          {departmentList.length > 0
                            ? departmentList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.department}
                                  </MenuItem>
                                )
                              })
                            : 'Not Available'}
                        </Select>
                      )}
                      name={`applicationRolesList[${index}].departmentName`}
                      control={control}
                      defaultValue=''
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {errors?.departmentName
                        ? errors.departmentName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={3.3}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <FormControl style={{ width: '48%' }} size='small'>
                    <InputLabel id='demo-simple-select-label'>
                      Designation name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Designation name'
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ backgroundColor: 'white' }}
                        >
                          {designationList.length > 0
                            ? designationList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.designation}
                                  </MenuItem>
                                )
                              })
                            : 'Not Available'}
                        </Select>
                      )}
                      name={`applicationRolesList[${index}].designationName`}
                      control={control}
                      defaultValue=''
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {errors?.designationName
                        ? errors.designationName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* <Grid
                  item
                  xs={4}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Department name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Department name"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            handleApplicationNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {applicationList.length > 0
                            ? applicationList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.applicationNameEng}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name={`applicationRolesList[${index}].applicationName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.applicationName
                        ? errors.applicationName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Service name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Service name"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ backgroundColor: "white" }}
                        >
                          {filteredServices.length > 0
                            ? filteredServices.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.service}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name={`applicationRolesList[${index}].serviceName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.serviceName ? errors.serviceName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                {/* <Grid
                  item
                  xs={4}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl fullWidth style={{ width: "48%" }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Role name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Role name"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          style={{ backgroundColor: "white" }}
                        >
                          {roleList.length > 0
                            ? roleList.map((val, id) => {
                                return (
                                  <MenuItem key={id} value={val.id}>
                                    {val.name}
                                  </MenuItem>
                                );
                              })
                            : "Not Available"}
                        </Select>
                      )}
                      name={`applicationRolesList[${index}].roleName`}
                      control={control}
                      defaultValue=""
                      key={witness.id}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.roleName ? errors.roleName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                <Grid
                  item
                  xs={1}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant='contained'
                    size='small'
                    startIcon={<DeleteIcon />}
                    style={{
                      color: 'white',
                      backgroundColor: 'red',
                      height: '30px',
                    }}
                    onClick={() => {
                      // remove({
                      //   applicationName: "",
                      //   roleName: "",
                      // });
                      remove(index)
                    }}
                  >
                    Delete
                  </Button>
                </Grid>
              </>
            )
          })}
        </Grid>
        <Grid
          container
          style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}
        >
          <Grid item xs={1}>
            <Button
              type='submit'
              variant='contained'
              size='small'
              style={{ color: 'white', backgroundColor: '#00A65A' }}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant='contained'
              size='small'
              style={{ color: 'white', backgroundColor: '#367FA9' }}
            >
              Reset
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant='contained'
              size='small'
              style={{ color: 'white', backgroundColor: 'red' }}
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <Toolbar />
      </div>
    </form>
  )
}

export default DepartmentUserRegister
