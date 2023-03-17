import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
// import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[billingCycle].module.css";
import schema from "../../../containers/schema/common/BillingCycle";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import BasicLayout from "../../../containers/Layout/BasicLayout";

// func
const BillingCycle = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
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
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);






  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getBillingCycleDetails();
  }, []);


   // Get Table - Data
   const getBillingCycleDetails = () => {

    console.log("getLIC ----")
      axios
        .get(`${urls.CFCURL}/master/billingCycleNameMaster/getAll`)
        .then((res) => {
          setDataSource(
            res.data.billingCycleName.map((r, i) => ({
              id: r.id,
              activeFlag: r.activeFlag,
              srNo: i + 1,
             billingCyclePrefix: r.billingCyclePrefix,
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              billingCycle: r.billingCycle,
              billingCycleMr:r.billingCycleMr,
              status: r.activeFlag === "Y" ? "Active" : "Inactive",
              remark: r.remark,
            })),
          );
        });
    };

  // Get Data By ID
  const getDataById = (value) => {
    setIsOpenCollapse(false);
    setID(value);
    axios
      .get(
        `${urls.CFCURL}/master/MstBillingCycle/getbillingCycleDaoDataById/?id=${value}`,
      )
      .then((res) => {
        reset(res.data);
        setButtonInputState(true);
        setIsOpenCollapse(true);
        setBtnSaveText("Update");
      });
  };

  // // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(`${urls.CFCURL}/master/billingCycleNameMaster/save/${value}`)
  //         .then((res) => {
  //           if (res.status == 226) {
  //             getBillingCycleDetails();
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
                
  //             });
              
  //             setButtonInputState(false);
  //             //getcast();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
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
            .post(`${urls.CFCURL}/master/billingCycleNameMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getBillingCycleDetails()
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
            .post(`${urls.CFCURL}/master/billingCycleNameMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getBillingCycleDetails()
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
//   const onSubmitForm = (fromData) => {
//     const fromDate = new Date(fromData.fromDate).toISOString()
//     const toDate =new Date(fromData.toDate).toISOString()
//     console.log("From Date ${fromDate} ")
   
   
//     // Update Form Data
//     const finalBodyForApi = {
//       ...fromData,
//       fromDate,
//       toDate,
//     };

//     // Save - DB
//     if (btnSaveText === "Save") {
//       console.log("Post -----");
//       axios
//         .post(
//           `${urls.CFCURL}/master/billingCycleNameMaster/save`,
//           finalBodyForApi,
//         )
//         .then((res) => {
//           if (res.status == 200) {
//             sweetAlert("Saved!", "Record Saved successfully !", "success");
//             getBillingCycleDetails();
//             setButtonInputState(false);
//             setEditButtonInputState(false);
//             setDeleteButtonState(false);
//             setIsOpenCollapse(false);
//           }
//         });
//     }
//     // Update Data Based On ID
//     else if (btnSaveText === "Update") {
//       console.log("Put -----");
// axios
//         .put(
//           `${urls.CFCURL}/master/billingCycleNameMaster/save`,
//           finalBodyForApi,
//         )
//         .then((res) => {
//           if (res.status == 200) {
//             sweetAlert("Updated!", "Record Updated successfully !", "success");
//             getBillingCycleDetails();
//             setButtonInputState(false);
//             setIsOpenCollapse(false);
//           }
//         });
//     }
//   };
const onSubmitForm = (fromData) => {
  const fromDate = new Date(fromData.fromDate).toISOString();
  const toDate = new Date(fromData.toDate).toISOString();
  console.log("From Date ${fromDate} ");

  // Update Form Data
  const finalBodyForApi = {
    ...fromData,
    fromDate,
    toDate,
    // activeFlag: btnSaveText === "Update" ? null : null,
    // activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
  };

  axios
    .post(
      `${urls.CFCURL}/master/billingCycleNameMaster/save`,
      finalBodyForApi
    )
    .then((res) => {
      if (res.status == 200) {
        id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getBillingCycleDetails();
        setButtonInputState(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
        setIsOpenCollapse(false);
      }
    });
};

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    billingCycle: "",
   billingCyclePrefix: "",
   billingCycleMr:"",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    billingCycle: "",
    billingCycleMr:"",
   billingCyclePrefix: "",
    remark: "",
    id: "",
  };

 


  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "billingCycle",
      headerName: "Billing Cycle",
      // type: "number",
      flex: 1,
    },
    {
      field: "billingCycleMr",
      headerName: "Billing Cycle Mr",
      // type: "number",
      flex: 1,
    },
    {
      field: "billingCyclePrefix",
      headerName: "Billing Cycle Prefix",
      flex: 1,
    },
    { field: "fromDate", headerName: "From Date" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
   
    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box
    //         sx={{
    //           backgroundColor: "whitesmoke",
    //           width: "100%",
    //           height: "100%",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <IconButton onClick={() => getDataById(params.id)}>
    //           <EditIcon />
    //         </IconButton>
    //         <IconButton onClick={() => deleteById(params.id)}>
    //           <DeleteIcon />
    //         </IconButton>
    //       </Box>
    //     );
    //   },
    // },

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

  

  // View
  return (
    <>
      {/* <BasicLayout titleProp={"none"}> */}
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
  Billing Cycle
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
        <Paper
          sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 , padding:1}}
        >
          {isOpenCollapse && (
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                    <div>
                        <TextField
                          id='standard-basic'
                          label='BillingCycle *'
                          variant='standard'
                          // value={dataInForm && dataInForm.billingCycle}
                          {...register("billingCycle")}
                          error={!!errors.billingCycle}
                          helperText={
                            errors?.billingCycle ? errors.billingCycle.message : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          id='standard-basic'
                          label='BillingCycle Mr*'
                          variant='standard'
                          // value={dataInForm && dataInForm.billingCycle}
                          {...register("billingCycleMr")}
                          error={!!errors.billingCycleMr}
                          helperText={
                            errors?.billingCycleMr ? errors.billingCycleMr.message : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          id='standard-basic'
                          label='Billing Cycle Prefix *'
                          variant='standard'
                          {...register("billingCyclePrefix")}
                          error={!!errors.billingCyclePrefix}
                          helperText={
                            errors?.billingCyclePrefix
                              ? errors.billingCyclePrefix.message
                              : null
                          }
                        />
                      </div>
                      
                      
                    </div>
                    <div className={styles.row}>
                    <div>
                        <FormControl style={{ marginTop: 10 }}>
                          <Controller
                            control={control}
                            name='fromDate'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='YYYY/MM/DD'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date
                                    </span>
                                  }
                                  value={field.value}
                                  required
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
                        </FormControl>
                      </div>
                    <div>
                        <FormControl style={{ marginTop: 10 }}>
                          <Controller
                            control={control}
                            name='toDate'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='YYYY/MM/DD'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
                                    </span>
                                  }
                                  value={field.value}
                                  required
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
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          id='standard-basic'
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
                setBtnSaveText("Save");
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
      {/* </BasicLayout> */}
    </>
  );
};

export default BillingCycle;


// export default index
