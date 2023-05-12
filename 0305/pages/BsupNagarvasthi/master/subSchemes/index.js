// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css
import styles from "../../../../styles/BsupNagarvasthi/masters/[subSchemes].module.css";
import schema from "../../../../containers/schema/BsupNagarvasthiSchema/subSchemesSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import moment from "moment";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
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
  const [pageNo, setPage] = useState(10);
  const [dataPageNo, setDataPage] = useState();

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  //added by satej
  const [mainNames, setMainNames] = useState([]);

  //added by satej on 11-04-2023
  useEffect(() => {
    getMainSchemes();
  }, []);

  //fetch all main schemes to map their name by scheme id in table column
  const getMainSchemes = (_pageSize = 10, _pageNo = 0) => {
    var mainschemeList;
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: null,
        },
      })
      .then(async (r) => {
        let result = r.data.mstMainSchemesList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              id: r.id,
              schemeName: r.schemeName ? r.schemeName : "-",
            };
          });
        mainschemeList = _res;
        await setMainNames(_res);
      });
  };

  useEffect(() => {
    getSubSchemes();
  }, [fetchData]);

  // Get Table - Data
  const getSubSchemes = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.mstSubSchemesList;
        console.log("result", result);

        let _res =
          result &&
          result.map((r, i) => {
            return {
              // r.data.map((r, i) => ({
              activeFlag: r.activeFlag,
              devisionKey: r.divisionKey,
              id: r.id,
              srNo: i + 1,
              subSchemePrefix: r.subSchemePrefix,
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              mainSchemeKey: r.mainSchemeKey,
              mainSchemeName: mainNames?.find((obj) => obj.id == r.mainSchemeKey)?.schemeName
                ? mainNames?.find((obj) => obj.id == r.mainSchemeKey)?.schemeName
                : "-",
              subSchemeNo: r.subSchemeNo,
              subSchemeName: r.subSchemeName,
              subSchemeNameMr: r.subSchemeNameMr,
              benefitAmount: r.benefitAmount,
              installments: r.installments,
              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };

    if (btnSaveText === "Save") {
      console.log("_body", _body);
      const tempData = axios.post(`${urls.BSUPURL}/mstSubSchemes/save`, _body).then((res) => {
        console.log("res---", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("_body", _body);
      const tempData = axios.post(`${urls.BSUPURL}/mstSubSchemes/save`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getSubSchemes();
          // setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.BSUPURL}/mstSubSchemes/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Inactivate!", {
                icon: "success",
              });
              getSubSchemes();
              // setButtonInputState(false);
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
          axios.post(`${urls.BSUPURL}/mstSubSchemes/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              // getPaymentRate();
              getSubSchemes();
              // setButtonInputState(false);
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
    mainSchemeKey: "",
    mainSchemeKeyMr: "",
    subSchemePrefix: "",
    subSchemePrefixMr: "",
    fromDate: null,
    fromDateMr: null,
    toDate: null,
    toDateMr: null,
    subSchemeNo: "",
    subSchemeNoMr: "",
    subSchemeName: "",
    subSchemeNameMr: "",
    benefitAmount: "",
    installments: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    mainSchemeKey: "",
    mainSchemeKeyMr: "",
    subSchemePrefix: "",
    subSchemePrefixMr: "",
    fromDate: null,
    fromDateMr: null,
    toDate: null,
    toDateMr: null,
    subSchemeNo: "",
    subSchemeNoMr: "",
    subSchemeName: "",
    subSchemeNameMr: "",
    benefitAmount: "",
    installments: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      // headerName: "Sr No.",
      headerName: <FormattedLabel id="srNo" />,
    },
    {
      field: "fromDate",
      // headerName: "From Date",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
    },
    {
      field: "toDate",
      // headerName: "To Date",
      headerName: <FormattedLabel id="toDate" />,
      flex: 1,
    },
    {
      field: "mainSchemeName",
      // headerName: "Scheme Name",
      headerName: <FormattedLabel id="mainSchemeNameT" />,
      flex: 3,
    },
    {
      field: "subSchemeName",
      // headerName: "Subscheme Name",
      headerName: <FormattedLabel id="subSchemeNameT" />,
      flex: 3,
    },

    // {
    //   field: "subSchemeNo",
    //   // headerName: "Subscheme No",
    //   headerName: <FormattedLabel id="subSchemeNo" />,
    //   flex: 2,
    // },
    {
      field: "subSchemePrefix",
      // headerName: "Subscheme Prefix",
      headerName: <FormattedLabel id="subSchemePrefix" />,
      flex: 2,
    },
    // {
    //   field: "benefitAmount",
    //   headerName: "benefit Amount",
    //   flex: 1,
    // },
    // {
    //   field: "installments",
    //   headerName: "No. Of Installments",
    //   flex: 1,
    // },
    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="actions" />,
      // <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
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
          </Box>
        );
      },
    },
  ];

  // Row

  return (
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
          <FormattedLabel id="subschemeTitle" />
          {/* Sub - Schemes */}
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <Grid container style={{ marginLeft: "50px" }}>
                {/* Date Picker */}

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                {/* Date */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.fromDate}>
                    <Controller
                      // variant="standard"
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disablePast
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="fromDate" required />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="standard"
                                sx={{ width: 230 }}
                                InputLabelProps={{
                                  style: {
                                    fontSize: 12,
                                    marginTop: 3,
                                  },
                                  shrink:
                                    (watch("fromDate") ? true : false) ||
                                    (router.query.fromDate ? true : false),
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.toDate}>
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disablePast
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>{<FormattedLabel id="toDate" required />}</span>
                            }
                            value={field.value}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="standard"
                                sx={{ width: 230 }}
                                InputLabelProps={{
                                  style: {
                                    fontSize: 12,
                                    marginTop: 3,
                                  },
                                  shrink:
                                    (watch("toDate") ? true : false) || (router.query.toDate ? true : false),
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                {/* main scheme dropdown */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl error={errors.mainSchemeKey} variant="standard" sx={{ width: "70%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="mainScheme" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "90%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {mainNames &&
                            mainNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.schemeName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="mainSchemeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.mainSchemeKey ? errors.mainSchemeKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* sub scheme name */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    label={<FormattedLabel id="subSchemeNameFEn" required />}
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemeName")}
                    error={!!errors.subSchemeName}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemeName") ? true : false) ||
                        (router.query.subSchemeName ? true : false),
                    }}
                    helperText={errors?.subSchemeName ? "Scheme Name is Required !!!" : null}
                  />
                </Grid>

                {/* Sub Scheme No */}

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
                {/* <TextField
                    style={{ width: "75%" }}
                    label={<FormattedLabel id="schemeNoEn" required />}
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemeNo")}
                    error={!!errors.subSchemeNo}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemeNo") ? true : false) || (router.query.subSchemeNo ? true : false),
                    }}
                    helperText={errors?.subSchemeNo ? "Sub Scheme No is Required !!!" : null}
                  /> */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    label={<FormattedLabel id="subSchemeNameMr" required />}
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemeNameMr")}
                    error={!!errors.subSchemeNameMr}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemeNameMr") ? true : false) ||
                        (router.query.subSchemeNameMr ? true : false),
                    }}
                    helperText={errors?.subSchemeNameMr ? "scheme Name is Required !!!" : null}
                  />
                </Grid>
                {/* sub Scheme prefix */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    label={<FormattedLabel id="subSchemePrefixEn" required />}
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemePrefix")}
                    error={!!errors.subSchemePrefix}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemePrefix") ? true : false) ||
                        (router.query.subSchemePrefix ? true : false),
                    }}
                    helperText={errors?.subSchemePrefix ? "Subscheme Prefix is Required !!!" : null}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                {/* benefit amount */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    label={<FormattedLabel id="benefitAmount" />}
                    id="standard-basic"
                    variant="standard"
                    {...register("benefitAmount")}
                    error={!!errors.benefitAmount}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("benefitAmount") ? true : false) ||
                        (router.query.benefitAmount ? true : false),
                    }}
                    helperText={errors?.benefitAmount ? "Benefit Amount is Required !!!" : null}
                  />
                </Grid>
                {/* no of installments for benefit amount */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    label={<FormattedLabel id="installments" />}
                    id="standard-basic"
                    variant="standard"
                    {...register("installments")}
                    error={!!errors.installments}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("installments") ? true : false) || (router.query.installments ? true : false),
                    }}
                    helperText={errors?.installments ? "Installmets No. is Required !!!" : null}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

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
                      {/* {btnSaveText === "Update"
                        ? 
                          "Update"
                        : 
                          "Save"} */}
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
                      {/* Clear */}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      {/* Exit */}
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Slide>
          )}
        </form>
      </FormProvider>

      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
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
          {/* Add */}
        </Button>
      </div>

      <DataGrid
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        autoHeight
        sx={{
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
        density="compact"
        pagination
        paginationMode="server"
        rowCount={data.totalRows}
        rowsPerPageOptions={data.rowsPerPageOptions}
        page={data.page}
        pageSize={data.pageSize}
        rows={data.rows}
        columns={columns}
        onPageChange={(_data) => {
          setPage(_data);
          getSubSchemes(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          setDataPage(_data);
          console.log("222", _data);
          getSubSchemes(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
