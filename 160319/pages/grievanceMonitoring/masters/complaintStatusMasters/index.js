import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Paper, Slide, TextField, Tooltip, Grid } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import sweetAlert from 'sweetalert'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import urls from '../../../../URLS/urls'
import styles from '../complaintTypeMasters/view.module.css'
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { GridToolbar } from "@mui/x-data-grid";
import complaintStatusMasterSchema from '../../../../containers/schema/grievanceMonitoring/complaintStatusMasterSchema'

const Form = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(complaintStatusMasterSchema),
    mode: 'onChange',
  })

  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const router = useRouter()
  const [activeStep, setActiveStep] = useState()
  const [checked, setChecked] = useState(true)
  const [complaintStatusTypes, setComplaintStatusTypes] = useState([])
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  //   const steps = getSteps();
  //   const dispach = useDispatch();

  useEffect(() => {
    getComplaintStatusTypes()
  }, [])

  const getComplaintStatusTypes = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.GM}/complaintStatusMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        setComplaintStatusTypes(
          r.data.complaintStatusMasterList.map((r, i) => ({
            id: r.id,
            activeFlag: r.activeFlag,
            srNo: i + 1,
            complaintStatus: r.complaintStatus,
            complaintStatusMr: r.complaintStatusMr,
            activeFlag: r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
          })),
        )
        setTotalElements(r.data.totalElements);
        setPageSize(r.data.pageSize);
        setPageNo(r.data.pageNo);

      })
  }

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
      activeFlag: "Y",
      // complaintName: 5,
    }
    // let value = getValues('id');
    if (btnSaveText === 'Save') {
      axios
        .post(
          `${urls.GM}/complaintStatusMaster/save`,
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert('Saved!', 'Record Saved successfully !', 'success')
            getComplaintStatusTypes()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    } else if (btnSaveText === 'Update') {
      axios
        .post(
          `${urls.GM}/complaintStatusMaster/save`,
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert('Updated!', 'Record Updated successfully !', 'success')
            getComplaintStatusTypes()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    }
  }

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.GM}/complaintStatusMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getComplaintStatusTypes();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.GM}/complaintStatusMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getComplaintStatusTypes();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
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
    complaintStatus: '',
    complaintStatusMr: "",
    id: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    complaintStatusMr: '',
    complaintStatus: '',

    id: null,
  }

  const editRecord = (rows) => {
    setBtnSaveText('Update'),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true)
    reset(rows)
  }
  // define colums table
  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id="srNo" />,
      width: 200,
    },
    // { field: "Complaint Name", headerName: "Complaint Name",
    // flex: 1,
    // },

    {
      field: 'complaintStatus',
      headerName: <FormattedLabel id="status" />,
      flex: 1,
    },
    // {
    //   field: 'complaintStatusMr',
    //   headerName: "स्थिती",
    //   flex: 1,

    // },
    {
      field: 'actions',
      headerName: <FormattedLabel id="actions" />,

      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
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
      <>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="grievanceStatus" />
            </h2>
          </Box>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container >
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4} >
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="status" />}
                      variant="standard"
                      {...register('complaintStatus')}
                      error={!!errors.complaintStatus}
                      helperText={
                        errors?.complaintStatus
                          ? errors.complaintStatus.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4} >
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="complaintStausMr" />}
                      // label={<FormattedLabel id="status" />}
                      variant="standard"
                      {...register('complaintStatusMr')}
                      error={!!errors.complaintStatusMr}
                      helperText={
                        errors?.complaintStatusMr
                          ? errors.complaintStatusMr.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Grid item>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText === "Update" ? (
                        <FormattedLabel id="update" />
                      ) : (
                        <FormattedLabel id="save" />
                      )}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
              {/* </FormProvider> */}
              {/* </div> */}
            </Slide >
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
              {/* <FormattedLabel id="add" /> */}
              Add
            </Button>
          </div>
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                // printOptions: { disableToolbarButton: true },
                // disableExport: true,
                // disableToolbarButton: true,
                // csvOptions: { disableToolbarButton: true },
              },
            }}
            autoHeight
            sx={{
              // marginLeft: 5,
              // marginRight: 5,
              // marginTop: 5,
              // marginBottom: 5,

              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            rows={complaintStatusTypes}
            density="compact"
            pagination
            paginationMode="server"
            rowCount={totalElements}
            rowsPerPageOptions={[5]}
            pageSize={pageSize}
            columns={columns}
            onPageChange={(_data) => {
              getComplaintStatusTypes(pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getComplaintStatusTypes(pageSize, _data);
            }}
          //checkboxSelection
          />
        </Paper >
      </>
    </>
  )
}

export default Form
