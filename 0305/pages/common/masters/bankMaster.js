import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import BasicLayout from "../../../containers/Layout/BasicLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/BankMaster";
import styles from "../../../styles/cfc/cfc.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

// func
const BankMaster = () => {
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

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getBankMasterDetails = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    setLoad(true);

    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        setLoad(false);

        let result = res.data.bank;
        let _res = result
          .map((r, i) => {
            console.log("res payment mode", res);
            return {
              id: r.id,
              srNo: i + 1,
              activeFlag: r.activeFlag,
              // bankPrefix: r.bankPrefix,
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              bankName: r.bankName,
              bankNameMr: r.bankNameMr,
              branchName: r.branchName,
              branchNameMr: r.branchNameMr,
              // bankAddress: r.bankAddress,
              ifscCode: r.ifscCode,
              micrCode: r.micrCode,
              city: r.city,
              district: r.district,
              state: r.state,
              branchAddress: r.branchAddress,
              contactDetails: r.contactDetails,
              remark: r.remark,
              status: r.activeFlag === "Y" ? "Active" : "InActive",
            };
          })
          .catch((err) => {
            console.log(err);
            setLoad(false);
          });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getBankMasterDetails();
    console.log("useEffect");
  }, []);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      // fromDate,
      // toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    // Save - DB
    axios.post(`${urls.CFCURL}/master/bank/save`, finalBodyForApi).then((res) => {
      if (res.status == 200) {
        if (res.data?.errors?.length > 0) {
          res.data?.errors?.map((x) => {
            if (x.field == "bankName") {
              setError("bankName", { message: x.code });
            } else if (x.field == "bankNameMr") {
              setError("bankNameMr", { message: x.code });
            }
          });
        } else {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getBankMasterDetails();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
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
          axios.post(`${urls.CFCURL}/master/bank/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deactivated!", {
                icon: "success",
              });
              getBankMasterDetails();
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
          axios.post(`${urls.CFCURL}/master/bank/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getBankMasterDetails();
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
    fromDate: null,
    toDate: null,
    bankName: "",
    // bankPrefix: "",
    bankNameMr: "",
    branchName: "",
    branchNameMr: "",
    // bankAddress: "",
    ifscCode: "",
    micrCode: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    bankName: "",
    // bankPrefix: "",
    bankNameMr: "",
    branchName: "",
    branchNameMr: "",
    // bankAddress: "",
    ifscCode: "",
    micrCode: "",
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      width: 90,
      cellClassName: "super-app-theme--cell",
    },

    {
      field: language === "en" ? "bankName" : "bankNameMr",
      headerName: <FormattedLabel id="bankName" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "branchName",
      headerName: <FormattedLabel id="branchName" />,
      // type: "number",
      flex: 1,
    },

    {
      field: "ifscCode",
      headerName: <FormattedLabel id="ifscCode" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "micrCode",
      headerName: <FormattedLabel id="micrCode" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "city",
      headerName: <FormattedLabel id="city" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "district",
      headerName: <FormattedLabel id="district" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "state",
      headerName: <FormattedLabel id="state" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "branchAddress",
      headerName: <FormattedLabel id="branchAddress" />,
      // type: "number",
      flex: 1,
    },

    {
      field: "contactDetails",
      headerName: <FormattedLabel id="contactDetails" />,
      // type: "number",
      flex: 1,
    },

    {
      field: "actions",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                //   disabled={editButtonInputState && params.row.activeFlag === "N" ? false : true}
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
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id), setSlideChecked(true);
                setButtonInputState(true);
                // setIsOpenCollapse(true),
                // // console.log('params.row: ', params.row)
                // reset(params.row)
                // setLoiGeneration(params.row.loiGeneration)
                // setScrutinyProcess(params.row.scrutinyProcess)
                // setImmediateAtCounter(params.row.immediateAtCounter)
                // setRtsSelection(params.row.rtsSelection)
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
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
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "38%" }}>
            <FormattedLabel id="bankName" />
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
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
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper style={{ paddingTop: isOpenCollapse ? "20px" : "0px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <Paper
              sx={{
                marginLeft: 3,
                marginRight: 3,
                marginBottom: 3,
                padding: 2,
                backgroundColor: "#F5F5F5",
              }}
              elevation={5}
            >
              <br />
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="bankName" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.religion}
                        {...register("bankName")}
                        error={!!errors.bankName}
                        helperText={errors?.bankName ? errors.bankName.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="bankNameMr" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.religion}
                        {...register("bankNameMr")}
                        error={!!errors.bankNameMr}
                        helperText={errors?.bankNameMr ? errors.bankNameMr.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="branchName" />}
                        variant="outlined"
                        {...register("branchName")}
                        error={!!errors.branchName}
                        helperText={errors?.branchName ? errors.branchName.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="ifscCode" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.religion}
                        {...register("ifscCode")}
                        error={!!errors.ifscCode}
                        helperText={errors?.ifscCode ? errors.ifscCode.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="micrCode" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.religion}
                        {...register("micrCode")}
                        error={!!errors.micrCode}
                        helperText={errors?.micrCode ? errors.micrCode.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="city" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.religion}
                        {...register("city")}
                        error={!!errors.city}
                        helperText={errors?.city ? errors.city.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="district" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.remark}
                        {...register("district")}
                        error={!!errors.district}
                        helperText={errors?.district ? errors.district.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="state" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.remark}
                        {...register("state")}
                        error={!!errors.state}
                        helperText={errors?.state ? errors.state.message : null}
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="branchAddress" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.remark}
                        {...register("branchAddress")}
                        error={!!errors.branchAddress}
                        helperText={errors?.branchAddress ? errors.branchAddress.message : null}
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "80%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="contactDetails" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.remark}
                        {...register("contactDetails")}
                        error={!!errors.contactDetails}
                        helperText={errors?.contactDetails ? errors.contactDetails.message : null}
                      />
                    </Grid>
                  </Grid>

                  <br />
                  <br />
                  <Grid container className={styles.feildres} spacing={2}>
                    <Grid item>
                      <Button
                        type="submit"
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="Save" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        endIcon={<ClearIcon />}
                        onClick={() => {
                          reset({
                            ...resetValuesExit,
                          });
                        }}
                      >
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        // color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                </form>
              </FormProvider>
            </Paper>
          </Slide>
        )}

        <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
            // autoHeight={true}
            autoHeight={data.pageSize}
            density="compact"
            sx={{
              "& .super-app-theme--cell": {
                backgroundColor: "#E3EAEA",
                borderLeft: "10px solid white",
                borderRight: "10px solid white",
                borderTop: "4px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {},
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E3EAEA",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-column": {
                backgroundColor: "red",
              },
            }}
            pagination
            paginationMode="server"
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getBankMasterDetails(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              getBankMasterDetails(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default BankMaster;
