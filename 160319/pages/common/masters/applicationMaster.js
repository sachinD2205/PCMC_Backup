import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import * as yup from "yup";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Paper,
  Select,
  MenuItem,
  Slide,
  TextField,
  Grid,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/view.module.css";
import sweetAlert from "sweetalert";
// import { ModeOutlined } from "@mui/icons-material";
// import urls from "../../../../URLS/urls";

const Index = () => {
  let schema = yup.object().shape({
     appCode: yup.string().required("AppCode  is Required !!!").matches(/^\d{6}$/, "Pin code should be 6 digits"),
     applicationNameEng: yup.string().required(" ApplicationNameEng is Required !!"),
     applicationNameMr: yup.string().required(" ApplicationNameMr is Required !!"),
     module: yup.string().required(" Module is Required !!"),
    // remark: yup.string().required(" Remark is Required !!"),
  });

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
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
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    getModuleMaster();
  }, []);

  useEffect(() => {
    getApplicationMaster();
  }, [modules]);

  const getModuleMaster = () => {
    axios.get(`${urls.BaseURL}/module/getAll`).then((r) => {
      setModules(
        r.data.map((row) => ({
          id: row.id,
          packageCode: row.packageCode,
          packageNameEng: row.packageNameEng,
          packageNameMr: row.packageNameMr,
        }))
      );
    });
  };

  // Get Table - Data
  const getApplicationMaster = () => {
    axios.get(`${urls.BaseURL}/application/getAll`).then((res) => {
      setDataSource(
        res.data.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          activeFlag:r.activeFlag,
          appCode: r.appCode,
          applicationNameEng: r.applicationNameEng,
          applicationNameMr: r.applicationNameMr,
          module: r.module,
          packageNameEng: modules?.find((obj) => obj?.id === r.module)
            ?.packageNameEng,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
        }))
      );
    });
  };

  const editRecord = (rows) => {
    console.log("Edit cha data:", rows);
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
    };

    axios
      .post(`${urls.BaseURL}/application/save`, finalBodyForApi)
      .then((res) => {
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getApplicationMaster();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };



  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/application/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getApplicationMaster();
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
            .post(`${urls.CFCURL}/master/application/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
              
                setButtonInputState(false);
                getApplicationMaster();
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
    appCode: "",
    applicationNameEng: "",
    applicationNameMr: "",
    module: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    appCode: "",
    applicationNameEng: "",
    applicationNameMr: "",
    module: null,
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },
    {
      field: "appCode",
      headerName: "App Code ",
      flex: 1,
    },
    {
      field: "applicationNameEng",
      headerName: "Application Name Eng",
      // type: "number",
      flex: 1,
    },
    {
      field: "applicationNameMr",
      headerName: "Application Name Mr",
      // type: "number",
      flex: 1,
    },
    {
      field: "packageNameEng",
      headerName: "Module",
      // type: "number",
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
    //       <>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setID(params.row.id),
    //               setIsOpenCollapse(true),
    //               setSlideChecked(true);
    //             setButtonInputState(true);
    //             console.log("params.row: ", params.row);
    //             reset(params.row);
    //           }}
    //         >
    //           <EditIcon />
    //         </IconButton>
    //         <IconButton
    //           disabled={deleteButtonInputState}
    //           onClick={() => deleteById(params.id)}
    //         >
    //           <DeleteIcon />
    //         </IconButton>
    //       </>
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
                // const { zoneName, ...rest } = params.row;
                // reset({ ...rest });
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
                // console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                // <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                // </Tooltip>
              ) : (
                // <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                // </Tooltip>
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
     Application Master
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
                    <div>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: 250, marginTop: 5 }}
                            id="standard-basic"
                            label="Application Name Eng"
                            variant="standard"
                            {...register("applicationNameEng")}
                            error={!!errors.applicationNameEng}
                            helperText={
                              errors?.applicationNameEng
                                ? errors.applicationNameEng.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: 250, marginTop: 5 }}
                            id="standard-basic"
                            label="Application Name Mr"
                            variant="standard"
                            {...register("applicationNameMr")}
                            error={!!errors.applicationNameMr}
                            helperText={
                              errors?.applicationNameMr
                                ? errors.applicationNameMr.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          xs={6}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="App Code*"
                            variant="standard"
                            {...register("appCode")}
                            error={!!errors.appCode}
                            helperText={
                              errors?.appCode ? errors.appCode.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          xs={6}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            variant="standard"
                            // sx={{ minWidth: 120 }}
                            error={!!errors.module}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Module
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Module"
                                >
                                  {modules &&
                                    modules.map((module, index) => {
                                      return (
                                        <MenuItem key={index} value={module.id}>
                                          {module.packageNameEng}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="module"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.module ? errors.module.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <div className={styles.buttons}>
                        <Button
                          sx={{ marginRight: 8 }}
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{" "}
                        <Button
                          sx={{ marginRight: 8 }}
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
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
};

export default Index;
