import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import { Button, Paper, Slide, TextField } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import swal from 'sweetalert'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import schema from '../../../../containers/schema/marriageRegistration/maritalStatus'
import urls from '../../../../URLS/urls'
import styles from '../maritalStatus/view.module.css'

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [fetchData, setFetchData] = useState(null)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const getMaritalStatusDetails = () => {
    axios.get(`${urls.MR}/master/maritalstatus/getAll`).then((res) => {
      setDataSource(
        res.data.maritalStatus.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          statusDetails: r.statusDetails,
          statusDetailsMar: r.statusDetailsMar,
          //serialNo: r.serialNo,
          activeFlag: r.activeFlag,
        })),
      )
    })
    //   } else {
    //     toast.error('Filed Load Data !! Please Try Again !', {
    //       position: toast.POSITION.TOP_RIGHT,
    //     })
    //   }
    //   setHawkerTypeData({
    //     rows: _res,
    //     totalRows: res.data.totalElements,
    //     rowsPerPageOptions: [10, 20, 50, 100],
    //     pageSize: res.data.pageSize,
    //     page: res.data.pageNo,
    //   })
    // })
    // .catch((err) => {
    //   console.log('err', err)
    //   toast.error('Filed Load Data !! Please Try Again !', {})
    // })
  }

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getMaritalStatusDetails()
  }, [fetchData])

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Save - DB
    if (btnSaveText === 'Save') {
      axios
        .post(`${urls.MR}/master/maritalstatus/saveMaritalStatus`, fromData)
        .then((res) => {
          if (res.status == 201) {
            swal('Saved!', 'Record Saved successfully !', 'success')
            getMaritalStatusDetails()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    } else if (btnSaveText === 'Update') {
      const tempData = axios
        .post(`${urls.MR}/master/maritalstatus/saveMaritalStatus`, fromData)
        .then((res) => {
          if (res.status == 201) {
            getMaritalStatusDetails()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setFetchData(tempData)
          }
        })
    }
  }

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log('body', body)
    if (_activeFlag === 'N') {
      swal({
        title: 'Inactivate?',
        text: 'Are you sure you want to inactivate this Record ? ',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.MR}/master/maritalstatus/saveMaritalStatus`, body)
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 201) {
                swal('Record is Successfully Deleted!', {
                  icon: 'success',
                })
                getMaritalStatusDetails()
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
            .post(`${urls.CFCURL}/master/maritalstatus/saveMaritalStatus`, body)
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 201) {
                swal('Record is Successfully Deleted!', {
                  icon: 'success',
                })
                getMaritalStatusDetails()
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
      ...resetValuesExit,
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
      ...resetValuesCancell,
      id,
    })
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    statusDetails: '',
    statusDetailsMar: '',
  }

  // Reset Values Exit
  const resetValuesExit = {
    statusDetails: '',
    statusDetailsMar: '',
    id: null,
  }

  // define colums table
  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    // {
    //   field: 'serialNo',
    //   headerName: 'serialNo',
    //   flex: 1,
    // },

    {
      field: 'statusDetails',
      headerName: <FormattedLabel id="statusDetails" />,
      //type: "number",
      flex: 1,
    },

    {
      field: 'statusDetailsMar',
      headerName: 'स्थिती तपशील',
      flex: 1,
    },

    {
      field: 'actions',
      headerName: <FormattedLabel id="actions" />,
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
                reset(params.row)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.row.id, 'N')}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )
      },
    },
  ]

  // View
  return (
    <>
      {/* <BasicLayout> */}
      <Paper
        sx={{
          marginLeft: 1,
          marginRight: 1,
          marginTop: 2,
          marginBottom: 2,
          padding: 1,
          overflowY: 'scroll',

          '& .MuiDataGrid-virtualScrollerContent': {},
          '& .MuiDataGrid-columnHeadersInner': {
            backgroundColor: '#556CD6',
            color: 'white',
          },

          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
        density="compact"
        autoHeight
        // sx={{
        //   marginLeft: 1,
        //   marginRight: 1,
        //   marginTop: 1,
        //   marginBottom: 1,
        //   padding: 1,
        // }}
      >
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      {/* <div>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="serialNo *"
                            variant="standard"
                            {...register('serialNo')}
                            error={!!errors.serialNo}
                            helperText={
                              errors?.serialNo ? errors.serialNo.message : null
                            }
                          />
                        </div> */}

                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Status Details "
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register('statusDetails')}
                          error={!!errors.statusDetails}
                          helperText={
                            errors?.statusDetails
                              ? errors.statusDetails.message
                              : null
                          }
                        />
                      </div>

                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="स्थिती तपशील "
                          variant="standard"
                          {...register('statusDetailsMar')}
                          error={!!errors.statusDetailsMar}
                          helperText={
                            errors?.statusDetailsMar
                              ? errors.statusDetailsMar.message
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText == 'Save' ? (
                            <FormattedLabel id="save" />
                          ) : (
                            <FormattedLabel id="update" />
                          )}
                        </Button>{' '}
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn} style={{ marginTop: '25px' }}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
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
            <FormattedLabel id="add" />
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          //checkboxSelection
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  )
}

export default Index
