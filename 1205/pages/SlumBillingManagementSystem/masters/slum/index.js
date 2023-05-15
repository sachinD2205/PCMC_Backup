// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
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
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import schema from "../../../../containers/schema/slumManagementSchema/slumSchema";
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
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
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
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [declarationDate, setDeclarationDate] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [editData, setEditData] = useState({});
  const [ownerShipData, setOwnerShipData] = useState([]);
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(()=>{
    getOwnerShip();
  },[])

  useEffect(() => {
    getAllSlumData();
  }, [fetchData, id]);

  useEffect(()=>{
      let _res = editData;
      console.log("_res",_res);
      setValue('slumPrefix', _res?.slumPrefix ? _res?.slumPrefix : "")
      setValue('citySurveyNo', _res?.citySurveyNo ? _res?.citySurveyNo : "")
      setValue('fromDate', _res?.fromDate ? _res?.fromDate : "")
      setValue('toDate', _res?.toDate ? _res?.toDate : "")
      setValue('declarationDate', _res?.declarationDate ? _res?.declarationDate : "")
      setValue('declarationOrderNo', _res?.declarationOrderNo ? _res?.declarationOrderNo : "")
      setValue('declarationOrder', _res?.declarationOrder ? _res?.declarationOrder : "")
      setValue('areaName', _res?.areaName ? _res?.areaName : "")
      setValue('ownershipKey', _res?.ownershipKey)
      setValue('areaOfSlum', _res?.areaOfSlum ? _res?.areaOfSlum : "")
      setValue('noOfHuts', _res?.noOfHuts ? _res?.noOfHuts : "")
      setValue('hutOccupiedArea', _res?.hutOccupiedArea ? _res?.hutOccupiedArea : "")
      setValue('totalPopulation', _res?.totalPopulation ? _res?.totalPopulation : "")
      setValue('malePopulation', _res?.malePopulation ? _res?.malePopulation : "")
      setValue('femalePopulation', _res?.femalePopulation ? _res?.femalePopulation : "")
      setValue('scPopulation', _res?.scPopulation ? _res?.scPopulation : "")
      setValue('stPopulation', _res?.stPopulation ? _res?.stPopulation : "")
      setValue('slumBoundaryInfo', _res?.slumBoundaryInfo ? _res?.slumBoundaryInfo : "")
      setValue('slumStatus', _res?.slumStatus ? _res?.slumStatus : "")
      setFromDate(_res?.fromDate ?_res?.fromDate : null);
      setToDate(_res?.toDate ? _res?.toDate : null);
      setDeclarationDate(_res?.declarationDate ? _res?.declarationDate : null);
  },[editData]);

  // Get Ownership data

  const getOwnerShip = () => {
    axios
    .get(`${urls.SLUMURL}/mstSbOwnershipType/getAll`)
    .then((res) => {
      setOwnerShipData(res.data.mstSbOwnershipTypeList);
    });
  }

  // Get Table - Data
  const getAllSlumData = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        let result = r.data.mstSlumList;
        let _res = result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            slumName: r.slumName,
            slumNameMr: r.slumNameMr,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setEditData(result && result.find((obj)=>obj.id == id));
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
      fromDate,
      toDate,
      declarationDate,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios.post(`${urls.SLUMURL}/mstSlum/save`, _body).then((res) => {
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
      const tempData = axios.post(`${urls.SLUMURL}/mstSlum/save`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAllSlumData();
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
          axios.post(`${urls.SLUMURL}/mstSlum/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {});
              getAllSlumData();
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
          axios.post(`${urls.SLUMURL}/mstSlum/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              // getPaymentRate();
              getAllSlumData();
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
    slumName: "",
    slumNameMr: "",
    slumPrefix:"",
    search:"",
    citySurveyNo: "",
    fromDate:null,
    toDate:null,
    declarationDate:null,
    declarationOrderNo:"",
    areaName:"",
    ownershipKey:null,
    areaOfSlum:"",
    declarationOrder:"",
    noOfHuts:"",
    hutOccupiedArea:"",
    totalPopulation:"",
    malePopulation:"",
    femalePopulation:"",
    scPopulation:"",
    stPopulation:"",
    slumBoundaryInfo:"",
    slumStatus:"",
  };

  // Reset Values Exit
  const resetValuesExit = {
    slumName: "",
    slumNameMr: "",
    slumPrefix:"",
    search:"",
    citySurveyNo: "",
    fromDate:null,
    toDate:null,
    declarationDate:null,
    declarationOrderNo:"",
    areaName:"",
    ownershipKey:null,
    areaOfSlum:"",
    declarationOrder:"",
    noOfHuts:"",
    hutOccupiedArea:"",
    totalPopulation:"",
    malePopulation:"",
    femalePopulation:"",
    scPopulation:"",
    stPopulation:"",
    slumBoundaryInfo:"",
    slumStatus:"",
    id: null,
  };

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, width: 70 },

    {
      field: language === "en" ? "slumName" : "slumNameMr",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="slumKey" />,
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
          <FormattedLabel id="slumKey" />
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <Grid>
                <Grid sx={{marginTop:"10px"}} container xs={12} sm={12} md={12} lg={12} xl={12}>
                  {/* slum prefix */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="slumPrefixEn" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("slumPrefix")}
                      error={!!errors.slumPrefix}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("slumPrefix") ? true : false) || (router.query.slumPrefix ? true : false),
                      }}
                      helperText={errors?.slumPrefix ? errors.slumPrefix.message : null}
                    />
                  </Grid>

                  {/* search */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="search" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("search")}
                      error={!!errors.search}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink: (watch("search") ? true : false) || (router.query.search ? true : false),
                      }}
                      helperText={errors?.search ? errors.search.message : null}
                    />
                  </Grid>

                  {/* city Survey No */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="citySurveyNo" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("citySurveyNo")}
                      error={!!errors.citySurveyNo}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("citySurveyNo") ? true : false) ||
                          (router.query.citySurveyNo ? true : false),
                      }}
                      helperText={errors?.citySurveyNo ? errors.citySurveyNo.message : null}
                    />
                  </Grid>

                  {/* from Date */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                        sx={{ m: 1, minWidth: "60%" }}
                        variant="standard"
                        disabled={router?.query?.pageMode === "View"}
                        id="standard-textarea"
                        label={<FormattedLabel id="fromDate" />}
                        inputFormat="dd/MM/yyyy"
                        value={fromDate}
                        onChange={(date) => setFromDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                        renderInput={(params) => <TextField {...params} />}
                        error={!!errors.fromDate}
                        helperText={errors?.fromDate ? errors.fromDate.message : null}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>

                <Grid sx={{marginTop:"10px"}} container xs={12} sm={12} md={12} lg={12} xl={12}>
                  {/* To Date */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                        sx={{ m: 1, minWidth: "60%" }}
                        disabled={router?.query?.pageMode === "View"}
                        id="standard-textarea"
                        label={<FormattedLabel id="toDate" />}
                        inputFormat="dd/MM/yyyy"
                        value={toDate}
                        minDate={fromDate}
                        onChange={(date) => setToDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                        renderInput={(params) => <TextField {...params} />}
                        error={!!errors.toDate}
                        helperText={errors?.toDate ? errors.toDate.message : null}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Declaration Date */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                     <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                        sx={{ m: 1, minWidth: "60%" }}
                        disabled={router?.query?.pageMode === "View"}
                        id="standard-textarea"
                        label={<FormattedLabel id="declarationDate" />}
                        inputFormat="dd/MM/yyyy"
                        value={declarationDate}
                        onChange={(date) => setDeclarationDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                        renderInput={(params) => <TextField {...params} />}
                        error={!!errors.declarationDate}
                        helperText={errors?.declarationDate ? errors.declarationDate.message : null}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Declaration order No */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="declarationOrderNo" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("declarationOrderNo")}
                      error={!!errors.declarationOrderNo}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("declarationOrderNo") ? true : false) ||
                          (router.query.declarationOrderNo ? true : false),
                      }}
                      helperText={errors?.declarationOrderNo ? errors.declarationOrderNo.message : null}
                    />
                  </Grid>

                  {/* Slum Name En */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="slumNameEn" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("slumName")}
                      error={!!errors.slumName}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink: (watch("slumName") ? true : false) || (router.query.slumName ? true : false),
                      }}
                      helperText={errors?.slumName ? errors.slumName.message : null}
                    />
                  </Grid>
                </Grid>

                <Grid sx={{marginTop:"10px"}} container xs={12} sm={12} md={12} lg={12} xl={12}>
                  {/* Slum Name Mr */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="slumNameMr" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("slumNameMr")}
                      error={!!errors.slumNameMr}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("slumNameMr") ? true : false) || (router.query.slumNameMr ? true : false),
                      }}
                      helperText={errors?.slumNameMr ? errors.slumNameMr.message : null}
                    />
                  </Grid>

                  {/* Area Name */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="areaName" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("areaName")}
                      error={!!errors.areaName}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink: (watch("areaName") ? true : false) || (router.query.areaName ? true : false),
                      }}
                      helperText={errors?.areaName ? errors.areaName.message : null}
                    />
                  </Grid>

                  {/* Ownership */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <FormControl
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "60%" }}
                      error={!!errors.ownershipKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="ownershipKey" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={router?.query?.pageMode === "View"}
                            // sx={{ width: 200 }}
                            // value={departmentName}
                            {...register("ownershipKey")}
                            InputLabelProps={{
                              //true
                              shrink:
                                (watch("ownershipKey") ? true : false) ||
                                (router.query.ownershipKey ? true : false),
                            }}
                          >
                            {ownerShipData &&
                        ownerShipData.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {each.ownershipType}
                          </MenuItem>
                        ))}
                          </Select>
                        )}
                        name="ownershipKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.ownershipKey ? errors.ownershipKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Area of Slum */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="areaOfSlum" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("areaOfSlum")}
                      error={!!errors.areaOfSlum}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("areaOfSlum") ? true : false) || (router.query.areaOfSlum ? true : false),
                      }}
                      helperText={errors?.areaOfSlum ? errors.areaOfSlum.message : null}
                    />
                  </Grid>
                </Grid>

                <Grid sx={{marginTop:"10px"}} container xs={12} sm={12} md={12} lg={12} xl={12}>
                  {/* Declaration Order */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="declarationOrder" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("declarationOrder")}
                      error={!!errors.declarationOrder}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("declarationOrder") ? true : false) ||
                          (router.query.declarationOrder ? true : false),
                      }}
                      helperText={errors?.declarationOrder ? errors.declarationOrder.message : null}
                    />
                  </Grid>

                  {/* No of Huts */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="noOfHuts" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("noOfHuts")}
                      error={!!errors.noOfHuts}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink: (watch("noOfHuts") ? true : false) || (router.query.noOfHuts ? true : false),
                      }}
                      helperText={errors?.noOfHuts ? errors.noOfHuts.message : null}
                    />
                  </Grid>

                  {/* Hut Occupied Area */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="hutOccupiedArea" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("hutOccupiedArea")}
                      error={!!errors.hutOccupiedArea}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("hutOccupiedArea") ? true : false) ||
                          (router.query.hutOccupiedArea ? true : false),
                      }}
                      helperText={errors?.hutOccupiedArea ? errors.hutOccupiedArea.message : null}
                    />
                  </Grid>

                  {/* Population */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="population" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("totalPopulation")}
                      error={!!errors.totalPopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("totalPopulation") ? true : false) ||
                          (router.query.totalPopulation ? true : false),
                      }}
                      helperText={errors?.totalPopulation ? errors.totalPopulation.message : null}
                    />
                  </Grid>
                </Grid>

                <Grid sx={{marginTop:"10px"}} container xs={12} sm={12} md={12} lg={12} xl={12}>
                  {/* Male Population */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="malePopulation" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("malePopulation")}
                      error={!!errors.malePopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("malePopulation") ? true : false) ||
                          (router.query.malePopulation ? true : false),
                      }}
                      helperText={errors?.malePopulation ? errors.malePopulation.message : null}
                    />
                  </Grid>

                  {/* Female Population */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="femalePopulation" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("femalePopulation")}
                      error={!!errors.femalePopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("femalePopulation") ? true : false) ||
                          (router.query.femalePopulation ? true : false),
                      }}
                      helperText={errors?.femalePopulation ? errors.femalePopulation.message : null}
                    />
                  </Grid>

                  {/* SC Population */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="scPopulation" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("scPopulation")}
                      error={!!errors.scPopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("scPopulation") ? true : false) ||
                          (router.query.scPopulation ? true : false),
                      }}
                      helperText={errors?.scPopulation ? errors.scPopulation.message : null}
                    />
                  </Grid>

                  {/* ST Population */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="stPopulation" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("stPopulation")}
                      error={!!errors.stPopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("stPopulation") ? true : false) ||
                          (router.query.stPopulation ? true : false),
                      }}
                      helperText={errors?.stPopulation ? errors.stPopulation.message : null}
                    />
                  </Grid>
                </Grid>

                <Grid sx={{marginTop:"10px"}} container xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  ></Grid>

                  {/* Slum Boundry Info */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="slumBoundaryInfo" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("slumBoundaryInfo")}
                      error={!!errors.slumBoundaryInfo}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("slumBoundaryInfo") ? true : false) ||
                          (router.query.slumBoundaryInfo ? true : false),
                      }}
                      helperText={errors?.slumBoundaryInfo ? errors.slumBoundaryInfo.message : null}
                    />
                  </Grid>

                  {/* Slum Status */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <TextField
                      label={<FormattedLabel id="slumStatus" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("slumStatus")}
                      error={!!errors.slumStatus}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("slumStatus") ? true : false) || (router.query.slumStatus ? true : false),
                      }}
                      helperText={errors?.slumStatus ? errors.slumStatus.message : null}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  ></Grid>
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
                {/* </div> */}
              </Grid>
            </Slide>
          )}
        </form>
      </FormProvider>

      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          // type='primary'
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
        // disableColumnFilter
        // disableColumnSelector
        // disableToolbarButton
        // disableDensitySelector
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
        // rows={dataSource}
        // columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        //checkboxSelection

        density="compact"
        // autoHeight={true}
        // rowHeight={50}
        pagination
        paginationMode="server"
        // loading={data.loading}
        rowCount={data.totalRows}
        rowsPerPageOptions={data.rowsPerPageOptions}
        page={data.page}
        pageSize={data.pageSize}
        rows={data.rows}
        columns={columns}
        onPageChange={(_data) => {
          getAllSlumData(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getAllSlumData(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
