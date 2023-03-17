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
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css
import styles from "../../../../styles/BsupNagarvasthi/masters/[subSchemes].module.css";
import schema from "../../../../containers/schema/BsupNagarvasthiSchema/subSchemesSchema";
import sweetAlert from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
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

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getSubSchemes();
    // getbillingUnitAndDivision();
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
              subSchemePrefixMr: r.subSchemePrefixMr,
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDateMr: r.fromDateMr,
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              toDateMr: r.toDateMr,
              mainSchemeKey: r.mainSchemeKey,
              mainSchemeKeyMr: r.mainSchemeKey,
              subSchemeNo: r.subSchemeNo,
              subSchemeNoMr: r.subSchemeNo,
              subSchemeName: r.subSchemeName,
              subSchemeNameMr: r.subSchemeName,
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

  // const getbillingUnitAndDivision = (_pageSize = 10000, _pageNo = 0) => {
  //   axios
  //     .get(`${urls.EBPSURL}/mstBillingUnit/getAll`, {
  //       params: {
  //         pageSize: _pageSize,
  //         pageNo: _pageNo,
  //       },
  //     })
  //     .then((r) => {
  //       let result = r.data.mstBillingUnitList;
  //       setDivision([...result]);
  //     });
  // };

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      console.log("_body", _body);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstSubSchemes/save`, _body)
        .then((res) => {
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
      const tempData = axios
        .post(`${urls.BSUPURL}/mstSubSchemes/save`, _body)
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
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
              swal("Record is Successfully Deleted!", {
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
    fromDate: "",
    fromDateMr: "",
    toDate: "",
    toDateMr: "",
    subSchemeNo: "",
    subSchemeNoMr: "",
    subSchemeName: "",
    subSchemeNameMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    mainSchemeKey: "",
    mainSchemeKeyMr: "",
    subSchemePrefix: "",
    subSchemePrefixMr: "",
    fromDate: "",
    fromDateMr: "",
    toDate: "",
    toDateMr: "",
    subSchemeNo: "",
    subSchemeNoMr: "",
    subSchemeName: "",
    subSchemeNameMr: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",

      flex: 1,
    },
    // { field: "courtNo", headerName: "Court No", flex: 1 },
    // {
    //   // field: "subDivision",
    //   field:
    //   language === "en" ? "subDivision" : "subDivisionMr",
    //   headerName:
    //    <FormattedLabel id="subDivision" />,
    //   flex: 1,
    // },

    {
      field: "fromDate",
      headerName: "From Date",

      flex: 1,
    },

    {
      field: "toDate",
      headerName: "To Date",

      flex: 1,
    },

    {
      field: "mainSchemeKey",
      headerName: "Scheme Id",

      flex: 1,
    },

    // {
    //   // field: "subDivision",
    //   field: language === "en" ? "division" : "divisionMr",
    //   headerName: <FormattedLabel id="division" />,
    //   flex: 1,
    // },

    {
      field: "subSchemeName",
      headerName: "Subscheme Name",

      flex: 1,
    },

    {
      field: "subSchemeNo",
      headerName: "Subscheme No",

      flex: 1,
    },

    {
      field: "subSchemePrefix",
      headerName: "Subscheme Prefix",

      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
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
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          {/* <FormattedLabel id="bachatgatCategory" /> */}
          Sub - Schemes
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Grid container style={{ marginLeft: "50px" }}>
                {/* Date Picker */}

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                {/* Date */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl
                    variant="standard"
                    style={{ marginTop: 10 }}
                    error={!!errors.fromDate}
                  >
                    <Controller
                      // variant="standard"
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                From Date(in English)
                                {/* Opinion Request Date */}
                                {/* {<FormattedLabel id="opinionRequestDate" />} */}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
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

                                  //true
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
                    <FormHelperText>
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl
                    variant="standard"
                    style={{ marginTop: 10 }}
                    error={!!errors.fromDate}
                  >
                    <Controller
                      // variant="standard"
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                From Date(in marathi)
                                {/* Opinion Request Date */}
                                {/* {<FormattedLabel id="opinionRequestDate" />} */}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
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

                                  //true
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
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl
                    variant="standard"
                    style={{ marginTop: 10 }}
                    error={!!errors.toDate}
                  >
                    <Controller
                      // variant="standard"
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                To Date
                                {/* Opinion Request Date */}
                                {/* {<FormattedLabel id="opinionRequestDate" />} */}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
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

                                  //true
                                  shrink:
                                    (watch("toDate") ? true : false) ||
                                    (router.query.toDate ? true : false),
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl
                    variant="standard"
                    style={{ marginTop: 10 }}
                    error={!!errors.toDate}
                  >
                    <Controller
                      // variant="standard"
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                To Date (in marathi)
                                {/* Opinion Request Date */}
                                {/* {<FormattedLabel id="opinionRequestDate" />} */}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
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

                                  //true
                                  shrink:
                                    (watch("toDate") ? true : false) ||
                                    (router.query.toDate ? true : false),
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                {/* main Scheme Key */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    label="Scheme Id (in English)"
                    id="standard-basic"
                    variant="standard"
                    {...register("mainSchemeKey")}
                    error={!!errors.mainSchemeKey}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      shrink:
                        (watch("mainSchemeKey") ? true : false) ||
                        (router.query.mainSchemeKey ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.mainSchemeKey ? "Scheme Id is Required !!!" : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryPrefixMr" />}
                    label="Scheme Id (in Marathi)"
                    id="standard-basic"
                    variant="standard"
                    {...register("mainSchemeKeyMr")}
                    error={!!errors.mainSchemeKeyMr}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("mainSchemeKeyMr") ? true : false) ||
                        (router.query.mainSchemeKeyMr ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.mainSchemeKeyMr ? "Scheme is Required !!!" : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                {/* sub scheme name */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNoEn" />}
                    label="SubSchemeName(in English)"
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
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.subSchemeName
                        ? "Scheme Name is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNoMr" />}
                    label="SubSchemeName (in Marathi)"
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemeNameMr")}
                    error={!!errors.subSchemeName}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemeNameMr") ? true : false) ||
                        (router.query.subSchemeNameMr ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.subSchemeName
                        ? "scheme Name is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
                {/* Sub Scheme No */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNameEn" />}
                    label="Sub SchemeNo (in English)"
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemeNo")}
                    error={!!errors.subSchemeNo}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemeNo") ? true : false) ||
                        (router.query.subSchemeNo ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.subSchemeNo
                        ? "Sub Scheme No is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNameMr" />}
                    label="Sub SchemeNo (in Marathi)"
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemeNoMr")}
                    error={!!errors.subSchemeNo}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemeNoMr") ? true : false) ||
                        (router.query.schemeNoMr ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.subSchemeNo
                        ? "Sub Scheme No is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

                {/* sub Scheme prefix */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNameEn" />}
                    label="subSchemePrefix (in English)"
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemePrefix")}
                    error={!!errors.schemePrefix}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemePrefix") ? true : false) ||
                        (router.query.subSchemePrefix ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.subSchemePrefix
                        ? "Subscheme Prefix is Required !!!"
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                    // label={<FormattedLabel id="categoryNameMr" />}
                    label="subSchemePrefix (in Marathi)"
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemePrefixMr")}
                    error={!!errors.subSchemePrefix}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemePrefixMr") ? true : false) ||
                        (router.query.subSchemePrefixMr ? true : false),
                    }}
                    helperText={
                      // errors?.studentName ? errors.studentName.message : null
                      errors?.schemeNo
                        ? "Subscheme Prefix is Required !!!"
                        : null
                    }
                  />
                </Grid>

                {/* <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid> */}

                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                   
                    label="subSchemeId(in English)"
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemeId")}
                    error={!!errors.subSchemeId}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemeId") ? true : false) ||
                        (router.query.subSchemeId ? true : false),
                    }}
                    helperText={
                     
                      errors?.subSchemeId
                        ? "Sub Scheme Id  is Required !!!"
                        : null
                    }
                  />
                </Grid> */}

                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    style={{ width: "75%" }}
                   
                    label="subSchemeId(in Marathi)"
                    id="standard-basic"
                    variant="standard"
                    {...register("subSchemeId")}
                    error={!!errors.subSchemeId}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subSchemeId") ? true : false) ||
                        (router.query.subSchemeId ? true : false),
                    }}
                    helperText={
                    
                      errors?.subSchemeId ? "Sub Scheme  is Required !!!" : null
                    }
                  />
                </Grid> */}

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
                      {btnSaveText === "Update"
                        ? // <FormattedLabel id="update" />
                          "Update"
                        : // <FormattedLabel id="save" />
                          "Save"}
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
                      {/* <FormattedLabel id="clear" /> */}
                      Clear
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      {/* <FormattedLabel id="exit" /> */}
                      Exit
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
          {/* <FormattedLabel id="add" /> */}
          Add
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
          getSubSchemes(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getSubSchemes(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
