import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Button,
  Paper,
  Slide,
  TextField,
  Tooltip,
  Box,
  Grid,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GridToolbar } from "@mui/x-data-grid";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import complaintTypeMasterSchema from "../../../../containers/schema/grievanceMonitoring/complaintTypeMasterSchema";
import urls from "../../../../URLS/urls";
import styles from "../complaintTypeMasters/view.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
const Form = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(complaintTypeMasterSchema),
    mode: "onChange",
    defaultValues: {
      complaintType: "",
      complaintTypeMr: "",
      description: "",
      descriptionMr: "",
    },
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const router = useRouter();

  const [complaintTypes, setComplaintTypes] = useState([]);

  const [departments, setDepartments] = useState([
    {
      id: 1,
      departmentEn: "",
      departmentMr: "",
    },
  ]);
  const language = useSelector((state) => state?.labels.language);
  // // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    getComplaintTypes();
  }, [departments]);

  const getComplaintTypes = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.GM}/complaintTypeMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setComplaintTypes(
            res.data.complaintTypeMasterList.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              complaintType: r.complaintType,
              complaintTypeMr: r.complaintTypeMr,
              description: r.description,
              descriptionMr: r.descriptionMr,
              departmentId: r.departmentId,
              departmentNameEn: departments?.find((obj) => obj.id === r.departmentId)?.departmentEn,
              departmentNameMr: departments?.find((obj) => obj.id === r.departmentId)?.departmentMr,
              activeFlag: r.activeFlag,
              status: r.activeFlag === "Y" ? "Active" : "InActive",
            })),
          );
          setTotalElements(res?.data?.totalElements);
          setPageSize(res?.data?.pageSize);
          setPageNo(res?.data?.pageNo);
        }
      })
      .catch((error) => {
        alert("catch((error)");
        if (error?.request?.status === 500) {
          swal(error?.response?.data?.message, {
            icon: "error",
          });
        } else {
          swal("Something went wrong!", {
            icon: "error",
          });
        }
      });
  };

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          departmentEn: r.department,
          departmentMr: r.departmentMr,
        })),
      );
    });
  };

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
    // let value = getValues('complaintType');
    const finalBodyForApi = {
      ...formData,
      activeFlag: "Y",
    };
    if (btnSaveText === "Save") {
      axios.post(`${urls.GM}/complaintTypeMaster/save`, finalBodyForApi).then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          getComplaintTypes();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
        //if you want to redirect to list page->
        // router.push({
        //   pathname:
        //     "/grievanceMonitoring/masters/complaintTypeMasters/",
        // });
        //or you can comment above code
      });
    } else if (btnSaveText === "Update") {
      axios.post(`${urls.GM}/complaintTypeMaster/save`, finalBodyForApi).then((res) => {
        if (res.status == 201) {
          sweetAlert("Updated!", "Record Updated successfully !", "success");
          getComplaintTypes();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
    }
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
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.GM}/complaintTypeMaster/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deactivated!", {
                icon: "success",
              });
              getComplaintTypes();
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
          axios.post(`${urls.GM}/complaintTypeMaster/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getComplaintTypes();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
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
    complaintType: "",
    description: "",
    complaintTypeMr: "",
    descriptionMr: "",
    id: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    businessType: "",
    businessSubType: "",
    businessSubTypePrefix: "",
    complaintType: "",
    id: null,
  };

  const editRecord = (rows) => {
    setBtnSaveText("Update"), setID(rows.id), setIsOpenCollapse(true), setSlideChecked(true);
    reset(rows);
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "complaintType" : "complaintTypeMr",
      headerName: <FormattedLabel id="complaintType" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: language === "en" ? "Department Name" : "विभागाचे नाव",
      headerAlign: "center",
      flex: 1,
    },
    // { field: 'complaintTypeMr', headerName: 'तक्रारीचा प्रकार', flex: 1 },

    // {
    //   field: 'description',
    //   headerName: <FormattedLabel id="description" />,
    //   flex: 1,
    // },
    // {
    //   field: "descriptionMr",
    //   headerName: "वर्णन",
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
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="complaintType" />
            </h2>
          </Box>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            {isOpenCollapse && (
              <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      // required
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      // label="Subject/Complaint Type"
                      label={<FormattedLabel id="complaintType" />}
                      variant="standard"
                      {...register("complaintType")}
                      error={!!errors.complaintType}
                      helperText={errors?.complaintType ? errors.complaintType.message : null}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label={<FormattedLabel id="complaintTypeMr" />}
                      variant="standard"
                      {...register("complaintTypeMr")}
                      error={!!errors.complaintTypeMr}
                      helperText={errors?.complaintTypeMr ? errors.complaintTypeMr.message : null}
                    />
                  </Grid>
                  {/* ////////////////newly added//////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl style={{ minWidth: "230px" }} error={!!errors.departmentId}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentName" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 250 }}

                            variant="standard"
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            label={<FormattedLabel id="departmentName" />}
                          >
                            {departments &&
                              departments.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {language == "en"
                                    ? //@ts-ignore
                                      department.departmentEn
                                    : // @ts-ignore
                                      department?.departmentMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="departmentId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.departmentId ? errors.departmentId.message : null}
                      </FormHelperText>
                    </FormControl>
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
                </Grid>
              </Slide>
            )}
          </form>
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
              <FormattedLabel id="add" />
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
            // density="compact"
            pagination
            paginationMode="server"
            rowCount={totalElements}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pageSize={pageSize}
            rows={complaintTypes}
            page={pageNo}
            columns={columns}
            onPageChange={(_data) => {
              getComplaintTypes(pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getComplaintTypes(pageSize, _data);
            }}
            //checkboxSelection
          />
        </Paper>
      </>
    </>
  );
};

export default Form;
