import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Grid, Paper, Slide, Stack, TextField, ThemeProvider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schema from "../../../../components/streetVendorManagementSystem/schema/StreetvendorApplicantCategorySchema";
import styles from "../../../../components/streetVendorManagementSystem/styles/streetvendorApplicantCategory.module.css";
import theme from "../../../../theme";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { toast, ToastContainer } from "react-toastify";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// func
const Index = () => {
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

  // Hawker Type Data
  const [streetVendorApplicantType, setStreetVendorApplicantType] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
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
          axios.post(`${urls.HMSURL}/mstStreetVendorApplicantCategory/save`, body).then((res) => {
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getApplicantTypeDetails();
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
          axios.post(`${urls.HMSURL}/mstStreetVendorApplicantCategory/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              getApplicantTypeDetails();
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
      // activeFlag: btnSaveText === "Update" ? null : null,
      activeFlag: "Y",
    };

    // Save - DB
    axios
      .post(`${urls.HMSURL}/mstStreetVendorApplicantCategory/save`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getApplicantTypeDetails();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
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
    setIsOpenCollapse(false);
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
    applicantPrefix: "",
    applicantPrefixMr: "",
    type: "",
    typeMr: "",
    subtype: "",
    subtypeMr: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    applicantPrefix: "",
    applicantPrefixMr: "",
    type: "",
    typeMr: "",
    subtype: "",
    subtypeMr: "",
    remark: "",
    id: null,
  };

  // Get Table
  const getApplicantTypeDetails = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.HMSURL}/mstStreetVendorApplicantCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let response = res?.data?.streetVendorApplicantCategory;
          console.log("streetVendorApplicantCategory", response);
          let _res = response.map((r, i) => {
            return {
              id: r.id,
              srNo: i + 1,
              type: r.type,
              typeMr: r.typeMr,
              applicantPrefixMr: r.applicantPrefixMr,
              applicantPrefix: r.applicantPrefix,
              subtype: r.subtype,
              subtypeMr: r.subtypeMr,
              remarkMr: r.remarkMr,
              remark: r.remark,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          setStreetVendorApplicantType({
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
        toast.error("Filed Load Data !! Please Try Again !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      flex: 1,
      width: "50px",
    },
    // {
    //   field: "fromDate",
    //   headerName: <FormattedLabel id="fromDate" />,
    //   description: <FormattedLabel id="fromDate" />,
    //   align: "left",
    //   headerAlign: "center",
    // },
    // {
    //   field: "toDate",
    //   headerName: <FormattedLabel id="toDate" />,
    //   description: <FormattedLabel id="toDate" />,
    //   flex: 1,
    //   align: "left",
    //   headerAlign: "center",
    // },

    {
      field: "applicantPrefix",
      headerName: <FormattedLabel id="applicantPrefixEn" />,
      description: <FormattedLabel id="applicantPrefixEn" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "applicantPrefixMr",
      headerName: <FormattedLabel id="applicantPrefixMr" />,
      description: <FormattedLabel id="applicantPrefixMr" />,
      flex: 1,
      width: "50px",
    },

    {
      field: "type",
      headerName: <FormattedLabel id="applicantTypeEn" />,
      description: <FormattedLabel id="applicantTypeEn" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "typeMr",
      headerName: <FormattedLabel id="applicantTypeMr" />,
      description: <FormattedLabel id="applicantTypeMr" />,
      flex: 1,
      width: "50px",
    },

    {
      field: "subtype",
      headerName: <FormattedLabel id="applicantSubTypeEn" />,
      description: <FormattedLabel id="applicantSubTypeEn" />,
      flex: 1,
      width: "50px",
    },
    {
      field: "subtypeMr",
      headerName: <FormattedLabel id="applicantSubTypeMr" />,
      description: <FormattedLabel id="applicantSubTypeMr" />,
      flex: 1,
      width: "50px",
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
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
                  setID(params?.row?.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params?.row);
              }}
            >
              <EditIcon sx={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton>
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

  useEffect(() => {
    getApplicantTypeDetails();
  }, []);

  // View
  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 20,
            marginBottom: 5,
            padding: 1,
          }}
          elevation={5}
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
            <strong>
              <FormattedLabel id="streetVendorType" />
            </strong>
          </div>

          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid container style={{ marginBottom: "7vh" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label=<FormattedLabel id="applicantPrefixEn" />
                          {...register("applicantPrefix")}
                          error={!!errors.applicantPrefix}
                          helperText={errors?.applicantPrefix ? errors.applicantPrefix.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="applicantPrefixMr" />
                          variant="standard"
                          {...register("applicantPrefixMr")}
                          error={!!errors.applicantPrefixMr}
                          helperText={errors?.applicantPrefixMr ? errors.applicantPrefixMr.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="applicantTypeEn" />
                          variant="standard"
                          {...register("type")}
                          error={!!errors.type}
                          helperText={errors?.type ? errors.type.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="applicantTypeMr" />
                          variant="standard"
                          {...register("typeMr")}
                          error={!!errors.typeMr}
                          helperText={errors?.typeMr ? errors.typeMr.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="applicantSubTypeEn" />
                          variant="standard"
                          {...register("subtype")}
                          error={!!errors.subtype}
                          helperText={errors?.subtype ? errors.subtype.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="applicantSubTypeMr" />
                          variant="standard"
                          {...register("subtypeMr")}
                          error={!!errors.subtypeMr}
                          helperText={errors?.subtypeMr ? errors.subtypeMr.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label=<FormattedLabel id="remark" />
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={errors?.remark ? errors.remark.message : null}
                        />
                      </Grid>
                    </Grid>

                    <Stack
                      direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
                      spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                      justifyContent="center"
                      alignItems="center"
                      marginTop="5"
                    >
                      <Button type="submit" variant="contained" color="success" endIcon={<SaveIcon />}>
                        {btnSaveText == "Save" ? (
                          <FormattedLabel id="save" />
                        ) : (
                          <FormattedLabel id="update" />
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Stack>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "2vh",
              marginRight: "40px",
            }}
          >
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
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />
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
              density="compact"
              autoHeight={true}
              pagination
              paginationMode="server"
              page={streetVendorApplicantType?.page}
              rowCount={streetVendorApplicantType?.totalRows}
              rowsPerPageOptions={streetVendorApplicantType?.rowsPerPageOptions}
              pageSize={streetVendorApplicantType?.pageSize}
              rows={streetVendorApplicantType?.rows}
              onPageChange={(_data) => {
                getApplicantTypeDetails(streetVendorApplicantType?.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                getApplicantTypeDetails(_data, streetVendorApplicantType?.page);
              }}
            />
          </Box>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
