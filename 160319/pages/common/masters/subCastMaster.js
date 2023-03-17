import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[subCastMaster].module.css";
import schema from "../../../containers/schema/common/SubCastMaster";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const SubCastMaster = () => {
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

  // state for name
  const [religions, setReligions] = useState([]);

  const getReligions = () => {
    axios
      .get(`${urls.BaseURL}/religion/getAll`)

      // religionMaster/getReligionMasterData
      .then((r) => {
        setReligions(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
          })),
        );
      });
  };

  useEffect(() => {
    getReligions();
  }, []);

  // state for name
  const [casts, setCasts] = useState([]);

  const getCasts = () => {
    axios.get(`${urls.BaseURL}/cast/getAll`).then((r) => {
      setCasts(
        r.data.mcast.map((row) => ({
          id: row.id,
          cast: row.cast,
        })),
      );
    });
  };

  useEffect(() => {
    getCasts();
  }, []);

  // Get Table - Data
  const getSubCast = async () => {
    await axios.get(`${urls.BaseURL}/subCast/getAll`).then((res) => {
      setDataSource(
        res.data.subCast.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          subCastPrefix: r.subCastPrefix,
          toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          religion: r.religion,
          subCast: r.subCast,
          subCastMr:r.subCastMr,
          remark: r.remark,
          // cast: r.cast,
          activeFlag:r.activeFlag,
          religionName: religions?.find((obj) => obj?.id === r.religion)
            ?.religion,
          cast: casts?.find((obj) => obj?.id == r.cast)?.cast,
        })),
      );
    });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getSubCast();
  }, [casts, religions]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    const fromDate = new Date(fromData.fromDate).toISOString();
    const toDate = new Date(fromData.toDate).toISOString();
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
    };

    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.BaseURL}/subCast/saveSubCast`, finalBodyForApi)
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
          getSubCast();
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      axios
        .post(`${urls.BaseURL}/subCast/saveSubCast`, finalBodyForApi)
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
          }
          getSubCast();
        });
    }
  };

  // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios
  //       .delete(`${urls.BaseURL}/subCast/saveSubCast/${value}`)
  //       .then((res) => {
  //         if (res.status == 200) {
  //           if (willDelete) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //           } else {
  //             swal("Record is Safe");
  //           }
  //         }
  //         setButtonInputState(false);
  //         getSubCast();
  //       });
  //   });
  // };

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
            .post(`${urls.CFCURL}/master/subCast/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                setButtonInputState(false);
                      getSubCast();
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
            .post(`${urls.CFCURL}/master/subCast/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                setButtonInputState(false);
                       getSubCast();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
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
    subCastPrefix: "",
    fromDate: null,
    toDate: null,
    religion: "",
    cast: "",
    subCast: "",
    remark: "",
    subCastMr:""
  };

  // Reset Values Exit
  const resetValuesExit = {
    subCastPrefix: "",
    fromDate: null,
    toDate: null,
    religion: "",
    cast: "",
    subCast: "",
    id: null,
    subCastMr:""
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
     
    },
    {
      field: "fromDate",
       headerName: "FromDate",
     flex:1
     },

     {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },

    {
      field: "religionName",
      headerName: "Religion",
      // type: "number",
      flex: 1,
    },

    {
      field: "cast",
      headerName: "Cast",
      // type: "number",
      flex: 1,
    },
    {
      field: "subCast",
      headerName: "SubCast",
      // type: "number",
      flex: 1,
    },

    {
      field: "subCastMr",
      headerName: "SubCast Mr",
      // type: "number",
      flex: 2,
    },
    {
      field: "subCastPrefix",
      headerName: "Sub Cast Prefix ",
      flex: 2,
    },
    
   
  
   
   
    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      // width: 120,
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
              <EditIcon style={{ color: "#556CD6" }} />
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
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
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
Sub Cast Master
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
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
                    <div className={styles.small}>
                      <div className={styles.row}>
                      <div className={styles.fieldss}>
                          <FormControl
                            style={{ marginTop: 10 }}
                            sx={{ width: 250 }}
                            error={!!errors.fromDate}
                          >
                            <Controller
                              control={control}
                              name='fromDate'
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat='DD/MM/YYYY'
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        From Date *
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
                        <div className={styles.fieldss}>
                          <FormControl
                            style={{ marginTop: 10 }}
                            sx={{ width: 250 }}
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

                        <div className={styles.fieldss}>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.religion}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                              Religion *
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='Religion *'
                                >
                                  {religions &&
                                    religions.map((religion, index) => (
                                      <MenuItem key={index} value={religion.id}>
                                        {religion.religion}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name='religion'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.religion
                                ? errors.religion.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div className={styles.fieldss}>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.cast}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                              Cast *
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='Cast *'
                                >
                                  {casts &&
                                    casts.map((cast, index) => (
                                      <MenuItem key={index} value={cast.id}>
                                        {cast.cast}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name='cast'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.cast ? errors.cast.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250 }}
                            id='standard-basic'
                            label='Sub Cast *'
                            variant='standard'
                            {...register("subCast")}
                            error={!!errors.subCast}
                            helperText={
                              errors?.subCast ? errors.subCast.message : null
                            }
                          />
                        </div>

                        <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250 }}
                            id='standard-basic'
                            label='Sub Cast Mr*'
                            variant='standard'
                            {...register("subCastMr")}
                            error={!!errors.subCastMr}
                            helperText={
                              errors?.subCastMr ? errors.subCastMr.message : null
                            }
                          />
                        </div>

                        <div className={styles.fieldss}>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id='standard-basic'
                            label='Sub Cast Prefix *'
                            variant='standard'
                            {...register("subCastPrefix")}
                            error={!!errors.subCastPrefix}
                            helperText={
                              errors?.subCastPrefix
                                ? errors.subCastPrefix.message
                                : null
                            }
                          />
                        </div>
                      
                       
                        <div className={styles.fieldssB}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Remark'
                          variant='standard'
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </div>
                       
                      
                       
                      </div>
                     

                      <div className={styles.btn}>
                        <div className={styles.btn1}>
                          <Button
                            type='submit'
                            variant='contained'
                            color='success'
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText}
                          </Button>{" "}
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant='contained'
                            color='primary'
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            Clear
                          </Button>
                        </div>
                        <div className={styles.btn1}>
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
              Add{" "}
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
            pageSize={5}
            rowsPerPageOptions={[5]}
            //checkboxSelection
          />
        </Paper>
      </>
    
  );
};

export default SubCastMaster;
