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
  Grid,
  Box,
  Select,
  Slide,
  Tooltip,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import urls from "../../../../URLS/urls";
import styles from "../complaintTypeMasters/view.module.css";
import complaintSubTypeMasterSchema from "../../../../containers/schema/grievanceMonitoring/complaintSubTypeMasterSchema";
import { Language } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Form = () => {
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
    resolver: yupResolver(complaintSubTypeMasterSchema),
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
  // const [businessTypes, setBusinessTypes] = useState([]);
  const [complaintTypes, setcomplaintTypes] = useState([]);
  const router = useRouter();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();

  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
    getComplaintTypes();
  }, []);

  useEffect(() => {
    getComplaintSubType();
  }, [complaintTypes]);

  const getComplaintTypes = () => {
    axios.get(`${urls.GM}/complaintTypeMaster/getAll`).then((res) => {
      setcomplaintTypes(
        res?.data?.complaintTypeMasterList?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          complaintType: r.complaintType,
          complaintTypeMr: r.complaintTypeMr,
          description: r.description,
          descriptionMr: r.descriptionMr,
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

  // Get Table - Data
  const getComplaintSubType = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.GM}/complaintSubTypeMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        setDataSource(
          res?.data?.complaintSubTypeMasterList?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            complainType: r.complainType,
            complainTypeMr: r.complainTypeMr,
            complaintTypeId: r.complaintTypeId,
            complaintSubType: r.complaintSubType,
            complaintSubTypeMr: r.complaintSubTypeMr,
            description: r.description,
            descriptionMr: r.descriptionMr,
            categoryKey: r.categoryKey,
            activeFlag: r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
          })),
        );
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      });
  };

  const editRecord = (rows) => {
    setBtnSaveText("Update"), setID(rows.id), setIsOpenCollapse(true), setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    console.log(formData);
    const finalBodyForApi = {
      ...formData,
      activeFlag: "Y",
    };
    axios.post(`${urls.GM}/complaintSubTypeMaster/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 201) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getComplaintTypes();
        getComplaintSubType();

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
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.GM}/complaintSubTypeMaster/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deactivated!", {
                icon: "success",
              });
              getComplaintTypes();
              getComplaintSubType();
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
          axios.post(`${urls.GM}/complaintSubTypeMaster/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getComplaintTypes();
              getComplaintSubType();
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
    description: "",
    complaintSubType: "",
    descriptionMr: "",
    complaintSubTypeMr: "",
    complaintTypeId: "",
    id: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    description: "",
    complaintSubType: "",
    descriptionMr: "",
    complaintSubTypeMr: "",
    complaintTypeId: "",
    id: null,
  };
  // define colums table

  const columns = [
    {
      field: "srNo",
      // flex: 1,
      headerName: <FormattedLabel id="srNo" />,
    },
    {
      field: language == "en" ? "complainType" : "complainTypeMr",
      flex: 1,
      headerName: <FormattedLabel id="complaintType" />,
      // width: 400
    },
    {
      field: language == "en" ? "complaintSubType" : "complaintSubTypeMr",
      flex: 1,
      headerName: <FormattedLabel id="complaintSubType" />,
      // width: 400
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

  ///////////////////////////////////////
  const [categories, setCategory] = useState([]);
  const getCategory = () => {
    axios.get(`${urls.GM}/categoryTypeMaster/getAll`).then((res) => {
      setCategory(
        res.data.categoryTypeMasterList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          categoryEn: r.categoryType,
          categoryMr: r.categoryTypeMr,
        })),
      );
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

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
              <FormattedLabel id="complaintSubType" />
            </h2>
          </Box>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <div>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: "200px" }}
                        variant="standard"
                        error={!!errors.complaintTypeId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="complaintType" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              autoFocus
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              {complaintTypes &&
                                complaintTypes.map((value, index) => (
                                  <MenuItem key={index} value={value?.id}>
                                    {language == "en" ? value?.complaintType : value?.complaintTypeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="complaintTypeId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.complaintTypeId ? errors.complaintTypeId.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid> */}

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: 250 }}
                        id="standard-basic"
                        label={<FormattedLabel id="complaintSubType" />}
                        variant="standard"
                        {...register("complaintSubType")}
                        error={!!errors.complaintSubType}
                        helperText={errors?.complaintSubType ? errors.complaintSubType.message : null}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: 250 }}
                        id="standard-basic"
                        label={<FormattedLabel id="complaintSubTypeMr" />}
                        // label={<FormattedLabel id="status" />}
                        variant="standard"
                        {...register("complaintSubTypeMr")}
                        error={!!errors.complaintSubTypeMr}
                        helperText={errors?.complaintSubTypeMr ? errors.complaintSubTypeMr.message : null}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <FormControl style={{ minWidth: "200px" }} error={!!errors.categoryKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="categories" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              variant="standard"
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Category"
                            >
                              {categories &&
                                categories.map((category, index) => (
                                  <MenuItem key={index} value={category.id}>
                                    {language == "en"
                                      ? //@ts-ignore
                                        category.categoryEn
                                      : // @ts-ignore
                                        category?.categoryMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="categoryKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.categoryKey ? errors.categoryKey.message : null}
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
                </form>
                {/* </FormProvider> */}
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
            rows={dataSource}
            density="compact"
            pagination
            paginationMode="server"
            rowCount={totalElements}
            rowsPerPageOptions={[5]}
            pageSize={pageSize}
            columns={columns}
            onPageChange={(_data) => {
              getComplaintSubType(pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getComplaintSubType(pageSize, _data);
            }}
            //checkboxSelection
          />
        </Paper>
      </>
    </>
  );
};

export default Form;
