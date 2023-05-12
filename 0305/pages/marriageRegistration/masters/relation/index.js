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
//import urls from '../../../../URLS/urls'
import swal from 'sweetalert'
import schema from '../../../../containers/schema/marriageRegistration/relation'
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

  // Get Table - Data
  const getMaritalStatusDetails = () => {
    axios.get(`${urls.MR}/master/relation/getAll`).then((res) => {
      setDataSource(
        res.data.relation.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          relation: r.relation,
          relationMar: r.relationMar,
          //serialNo: r.serialNo,
          activeFlag: r.activeFlag,
        })),
      )
    })
  }

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getMaritalStatusDetails()
  }, [])

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Save - DB
    if (btnSaveText === 'Save' || btnSaveText === 'Update') {
      axios
        .post(`${urls.MR}/master/relation/saveRelation`, fromData)
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
    }
    // Update Data Based On ID
    else if (btnSaveText === 'delete') {
      const tempData = axios
        .post(`${urls.MR}/master/relation/saveRelation`, {
          activeFlag: N,
          id: null,
        })
        .then((res) => {
          if (res.status == 201) {
            swal('Updated!', 'Record Updated successfully !', 'success')
            getMaritalStatusDetails()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setFetchData(tempData)
          }
        })
    }
  }

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
            .post(`${urls.MR}/master/relation/saveRelation`, body)
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
            .post(`${urls.CFCURL}/master/relation/saveRelation`, body)
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

  // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: 'Delete?',
  //     text: 'Are you sure you want to delete this Record ? ',
  //     icon: 'warning',
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(`${urls.MR}/master/relation/${value}`)
  //         .then((res) => {
  //           if (res.status == 200) {
  //             swal('Record is Successfully Deleted!', {
  //               icon: 'success',
  //             })
  //             setButtonInputState(false)
  //             getAppointmentScheduleRescheduleDetails()
  //           }
  //         })
  //     } else {
  //       swal('Record is Safe')
  //     }
  //   })
  // }
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
    relation: '',
    relationMar: '',
  }

  // Reset Values Exit
  const resetValuesExit = {
    relation: '',
    relationMar: '',
    id: null,
  }

  // define colums table
  const columns = [
    {
      field: 'srNo',
      headerName: 'Sr.No',
      flex: 1,
    },
    // {
    //   field: 'serialNo',
    //   headerName: 'serialNo',
    //   flex: 1,
    // },

    {
      field: 'relation',
      headerName: 'Relation',
      //type: "number",
      flex: 1,
    },

    {
      field: 'relationMar',
      headerName: 'नाते ( मराठी )',
      //type: "number",
      flex: 1,
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
                reset(params.row)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              // type='submit'
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
      // sx={{
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
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Relation"
                          variant="standard"
                          {...register('relation')}
                          error={!!errors.relation}
                          helperText={
                            errors?.relation ? errors.relation.message : null
                          }
                        />
                      </div>

                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="नाते ( मराठी )"
                          variant="standard"
                          {...register('relationMar')}
                          error={!!errors.relationMar}
                          helperText={
                            errors?.relationMar
                              ? errors.relationMar.message
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
                          {btnSaveText}
                        </Button>{' '}
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          Exit
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn}>
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
            Add{' '}
          </Button>
        </div>
        <DataGrid
          sx={{
            marginLeft: 1,
            marginRight: 1,
            marginTop: 1,
            marginBottom: 1,
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
          //   marginLeft: 5,
          //   marginRight: 5,
          //   marginTop: 5,
          //   marginBottom: 5,
          // }}
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
