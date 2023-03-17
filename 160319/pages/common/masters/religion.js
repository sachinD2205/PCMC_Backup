import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import schema from "../../../containers/schema/common/Religion";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

import urls from "../../../URLS/urls";

import styles from "../../../styles/[religion].module.css";

import sweetAlert from "sweetalert";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import BasicLayout from "../../../containers/Layout/BasicLayout";


const Index = () => {
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



  // let schema = yup.object().shape({
  //   religionMr: yup
  //     .string()
  //     .required("Religion Mr is Required !!!"),
    
  //   religion: yup.string().required("Religion Name is Required !!!"),
  // });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  // Get Table - Data
  const getReligionDetails = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`)
 
      .then((res) => {
        setDataSource(
          res.data.religion.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            religionMr: r.religionMr,
            religion: r.religion,
            // toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            activeFlag: r.activeFlag,
            remark: r.remark,
          }))
        );
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getReligionDetails();
  }, [fetchData]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
     
    };

  

  axios
  .post(`${urls.CFCURL}/master/religion/save`, finalBodyForApi)
  .then((res) => {
    if (res.status == 200) {
   fromData.id?  sweetAlert("Updated!", "Record Updated successfully !", "success"):
      sweetAlert("Saved!", "Record Saved successfully !", "success");
      setButtonInputState(false);
      setIsOpenCollapse(false);
      getReligionDetails();
      setEditButtonInputState(false);
      setDeleteButtonState(false);
    }
  });
  }
  // Delete By ID
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
  //         .delete(`${urls.CFCURL}/master/religion/save/${value}`)
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             getReligionDetails();
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
            .post(`${urls.CFCURL}/master/religion/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
               
                setButtonInputState(false);
              getReligionDetails();
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
            .post(`${urls.CFCURL}/master/religion/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                setButtonInputState(false);
                getReligionDetails();
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
  
    religion: "",
    religionMr: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    
    religion: "",
    religionMr: "",
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "religion",
      headerName: "Religion",
      // type: "number",
      flex: 1,
    },
    {
      field: "religionMr",
      headerName: "Religion Mr",
      flex: 1,
    },
  

    // {
    //   field: "remark",
    //   headerName: "Remark",
    //   //type: "number",
    //   flex: 1,
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
Religion
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
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    {/* <div> */}
                    {/* <div className={styles.row}> */}
                    {/* <div className={styles.fieldss}> */}
                    <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                         autoFocus
                          sx={{
                            width: 250,
                            marginTop: "5vh",
                            marginLeft: "30",
                          }}
                          id="standard-basic"
                          label="Religion *"
                          variant="standard"
                          // value={dataInForm && dataInForm.religion}
                          {...register("religion")}
                          error={!!errors.religion}
                          helperText={
                            errors?.religion ? errors.religion.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          autoFocus
                          sx={{
                            width: 250,
                            marginTop: "5vh",
                            marginLeft: "30",
                          }}
                          id="standard-basic"
                          label="Religion Mr *"
                          variant="standard"
                          {...register("religionMr")}
                          error={!!errors.religionMr}
                          helperText={
                            errors?.religionMr
                              ? errors.religionMr.message
                              : null
                          }
                        />
                        {/* </div> */}
                      </Grid>

                      {/* <div className={styles.fieldss}> */}
                     
{/* 
                      <Grid item={4}>
                        <TextField
                          sx={{ width: 250, marginTop: "5vh" }}
                          id="standard-basic"
                          label="Remark"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </Grid> */}
                    </Grid>

                    {/* </div> */}

                    {/* <div className={styles.buttons}> */}
                    <Grid container spacing={5} style={{marginTop:"30px",marginLeft:"30%"}}>
                      <Grid item={4}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{" "}
                        {/* </div> */}
                      </Grid>
                      <Grid item={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                      </Grid>

                      <Grid item={4}>
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
          <div className={styles.addbtn}>
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

}
export default Index;
