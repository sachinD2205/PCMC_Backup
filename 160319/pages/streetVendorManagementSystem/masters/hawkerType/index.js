import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { default as swal, default as sweetAlert } from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import styles from "../../../../components/streetVendorManagementSystem/styles/HawkerType.module.css";
import schema from "../../../../components/streetVendorManagementSystem/schema/HawkerTypeSchema";

// Fun
const Index = () => {
  // import from use Form
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const deleteById = (value, _activeFlag) => {
    console.log("value", JSON.stringify(_activeFlag));
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/hawkerType/save`, body).then((res) => {
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getHawkerType();
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
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/hawkerType/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getHawkerType();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      activeFlag: btnSaveText === "Update" ? null : null,
    };

    // Save - DB
    axios
      .post(`${urls.HMSURL}/hawkerType/save`, finalBodyForApi)
      .then((res) => {
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          getHawkerType();
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        } else {
          toast.error("Filed To Save Record !! Please Try Again !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Filed To Save Record !! Please Try Again !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // Exit Button
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

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    hawkerType: "",
    hawkerTypePrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    hawkerType: "",
    hawkerTypePrefix: "",
    remark: "",
    id: null,
  };

  // Get Table -
  // Hawker Type Data
  const [hawkerTypeData, setHawkerTypeData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Hawker Data
  const getHawkerType = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.HMSURL}/hawkerType/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log("status", res.status);
        if (res.status == 200) {
          let response = res.data.hawkerType;
          let _res = response.map((r, i) => {
            return {
              id: r.id,
              srNo: i + 1,
              hawkerTypePrefix: r.hawkerTypePrefix,
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              hawkerType: r.hawkerType,
              remark: r.remark,
              activeFlag: r.activeFlag,
              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          setHawkerTypeData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        } else {
          toast.error("Filed Load Data !! Please Try Again !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Filed Load Data hdsf!! Please Try Again !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getHawkerType();
  }, [fetchData]);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
      width: "50px",
    },
    {
      field: "hawkerTypePrefix",
      headerName: "Hawker Type Prefix",
      description: "Hawker Type Prfix",
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerName: "fromDate",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: "To Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
      //type: "number",
    },
    {
      field: "hawkerType",
      headerName: "Hawker Type",
      flex: 1,
      align: "center",
      headerAlign: "center",
      // type: "number",
    },
    {
      field: "remark",
      headerName: "Remark",
      flex: 1,
      align: "center",
      headerAlign: "center",
      //type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      width: 120,
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
                reset(params.row);
              }}
            >
              <EditIcon sx={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton
            // disabled={editButtonInputState}
            // onClick={() => {
            //   setBtnSaveText("Update"),
            //   setID(params.row.id),
            //   setSlideChecked(true);
            //   setButtonInputState(true);
            //   reset(params.row);
            // }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "65px",
              borderRadius: 100,
            }}
          >
            <strong>{<FormattedLabel id='streetVendorType' />}</strong>
          </div>
          {isOpenCollapse && (
            <Slide
              direction='down'
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      ></Grid>
                    </Grid>
                    <div className={styles.small}>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            autoFocus
                            label='Hawker Type Prefix *'
                            variant='standard'
                            {...register("hawkerTypePrefix")}
                            error={!!errors.hawkerTypePrefix}
                            helperText={
                              errors?.hawkerTypePrefix
                                ? errors.hawkerTypePrefix.message
                                : null
                            }
                          />
                        </div>
                        <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.fromDate}
                          >
                            <Controller
                              name='fromDate'
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat='DD/MM/YYYY'
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
                                        size='small'
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
                              {errors?.fromDate
                                ? errors.fromDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.toDate}
                          >
                            <Controller
                              control={control}
                              name='toDate'
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat='DD/MM/YYYY'
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
                                        size='small'
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
                      <div className={styles.row}>
                        <div>
                          <TextField
                            label='Hawker Type *'
                            variant='standard'
                            {...register("hawkerType")}
                            error={!!errors.hawkerType}
                            helperText={
                              errors?.hawkerType
                                ? errors.hawkerType.message
                                : null
                            }
                          />
                        </div>
                        <div>
                          <TextField
                            label='Remark'
                            variant='standard'
                            // value={dataInForm && dataInForm.remark}
                            {...register("remark")}
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.btn}>
                        <Button
                          sx={{ marginRight: 8 }}
                          type='submit'
                          variant='contained'
                          color='success'
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{" "}
                        <Button
                          sx={{ marginRight: 8 }}
                          variant='contained'
                          color='primary'
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          Exit
                        </Button>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}
          <div className={styles.addbtn}>
            <Button
              variant='contained'
              endIcon={<AddIcon />}
              type='primary'
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              Add
            </Button>
          </div>
          <Box style={{ height: "auto", overflow: "auto" }}>
            <DataGrid
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              components={{ Toolbar: GridToolbar }}
              sx={{
                m: 5,
                overflowY: "scroll",
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              columns={columns}
              density='compact'
              autoHeight={true}
              pagination
              paginationMode='server'
              page={hawkerTypeData.page}
              rowCount={hawkerTypeData.totalRows}
              rowsPerPageOptions={hawkerTypeData.rowsPerPageOptions}
              pageSize={hawkerTypeData.pageSize}
              rows={hawkerTypeData.rows}
              onPageChange={(_data) => {
                getHawkerType(hawkerTypeData.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                getHawkerType(_data, hawkerTypeData.page);
              }}
            />
          </Box>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
