import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import sweetAlert from "sweetalert";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import {
  Button,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";

import styles from "../../../styles/[pincode].module.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import router from "next/router";
import schema from "../../../containers/schema/common/Pincode";
import moment from "moment";
import urls from "../../../URLS/urls";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import BasicLayout from "../../../containers/Layout/BasicLayout";



const Pincode = () => {
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
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setFetchData(false);
    getAllPincode();
  }, [fetchData]);

  // Get Table - Data
  const getAllPincode = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`)
      .then((res) => {
        setDataSource(
          res.data.pinCode.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            pinCode:r.pinCode,
            pinCodeMr:r.pinCodeMr,
            pinCodePrefix:r.pinCodePrefix,
            remark:r.remark,
            activeFlag:r.activeFlag
          }))
        );
      });
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
  
    const fromDate = new Date(formData.fromDate).toISOString();
    const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

      axios.post( `${urls.CFCURL}/master/pinCode/save`,finalBodyForApi)
        .then((res) => {
          
          if (res.status == 200) {
            formData.id
              ? sweetAlert("Updated!", "Record Updated successfully !", "success")
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
              getAllPincode();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }
   
  


  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios.delete(`${urls.CFCURL}/master/pinCode/save/${value}`).then((res) => {
  //       if (res.status == 226) {
  //         if (willDelete) {
  //           swal("Record is Successfully Deleted!", {
  //             icon: "success",
  //           });
  //         } else {
  //           swal("Record is Safe");
  //         }
  //         setButtonInputState(false);
  //         setRunAgain(true);
  //       }
  //     });
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
            .post(`${urls.CFCURL}/master/pinCode/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
             
                getAllPincode();
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
            .post(`${urls.CFCURL}/master/pinCode/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
               

                getAllPincode();
                setButtonInputState(false);
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
    pinCode:"",
    pinCodeMr:"",
    pinCodePrefix:"",
    remark:"",
    activeFlag:"",
    fromDate:null,
    toDate:null

  };

  // Reset Values Exit
  const resetValuesExit = {
    pinCode:"",
    pinCodeMr:"",
    pinCodePrefix:"",
    remark:"",
    activeFlag:"",
    fromDate:null,
    toDate:null,
    id: null,
  };


  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },

    {
      field: "fromDate",
      headerName: "FromDate",
    },

    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },

    {
      field: "pinCode",
      headerName: "PinCode",
      // type: "number",
      flex: 1,
    },

    {
      field: "pinCodeMr",
      headerName: "PinCode Mr",
      // type: "number",
      flex: 1,
    },

    {
      field: "pinCodePrefix",
      headerName: "PinCode Prefix",
      flex: 1,
    },

    {
      field: "remark",
      headerName: "Remarks",
      // type: "number",
      flex: 1,
    },
    {
      field: "actions",
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

  // Row

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
Pincode
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
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        // error={!!errors.fromDate}
                      >
                        <Controller
                          control={control}
                          name="fromDate"
                          required
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                
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
                        {/* <FormHelperText>
                          {errors?.fromDate ? errors.fromDate.message : null}
                        </FormHelperText> */}

                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        // error={!!errors.toDate}
                      >
                        <Controller
                          control={control}
                          name="toDate"
                          required
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>To Date</span>
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
                        {/* <FormHelperText>
                          {errors?.toDate ? errors.toDate.message : null}
                        </FormHelperText> */}

                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="PinCode"
                          variant="standard"
                          {...register("pinCode")}
                          error={!!errors.pinCode}
                          helperText={
                            errors?.pinCode ? errors.pinCode.message : null
                          }
                        />
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="PinCode Mr"
                          variant="standard"
                          {...register("pinCodeMr")}
                          error={!!errors.pinCodeMr}
                          helperText={
                            errors?.pinCodeMr ? errors.pinCodeMr.message : null
                          }
                        />
                      </div>
                    </Grid>

                    <Grid item xs={4}>
                      <div>
                        <TextField
                          // sx={{ width: 250, marginTop: 5 }}
                          id="standard-basic"
                          label="PinCode Prefix*"
                          variant="standard"
                          {...register("pinCodePrefix")}
                          error={!!errors.pinCodePrefix}
                          helperText={
                            errors?.pinCodePrefix
                              ? errors.pinCodePrefix.message
                              : null
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Remarks"
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} style={{marginTop:"10px"}}>
                    <Grid item xs={4}>
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                    </Grid>

                    <Grid item xs={4}>
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
                    </Grid>

                    <Grid item xs={4}>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        Exit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
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

export default Pincode;
