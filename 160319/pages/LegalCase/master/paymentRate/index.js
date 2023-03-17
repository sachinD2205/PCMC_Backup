import { yupResolver } from "@hookform/resolvers/yup";
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
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  ThemeProvider,
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
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import urls from "../../../../URLS/urls";
// import styles from "../caseMainType/view.module.css";
import styles from "../../../../styles/LegalCase_Styles/paymentRate.module.css";

import schema from "../../../../containers/schema/LegalCaseSchema/paymentRateSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import theme from "../../../../theme.js";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";

// func
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
  const [categorys, setCategorys] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getcaseMainTypes();
  }, []);

  useEffect(() => {
    getCaseSubType();
  }, [caseMainTypes]);

  useEffect(() => {
    console.log("subTypes", caseSubTypes);
    getPaymentRate();
  }, [caseSubTypes]);


  useEffect(() => {
    getPaymentRate();
  }, [fetchData]);

  const getcaseMainTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseMainType/getAll`).then((res) => {
      setCaseMainTypes(
        res.data.caseMainType.map((r, i) => ({
          id: r.id,
          caseMainType: r.caseMainType,
          caseMainTypeMr: r.caseMainTypeMr,
        }))
      );
    });
  };

  const getCaseSubType = () => {
    axios.get(`${urls.LCMSURL}/master/caseSubType/getAll`).then((res) => {
      setCaseSubTypes(
        res.data.caseSubType.map((r, i) => ({
          id: r.id,
          subType: r.subType,
          caseSubTypeMr: r.caseSubTypeMr,
        }))
      );
    });
  };

  // Get Table - Data
  const getPaymentRate = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/master/paymentRate/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.paymentRate;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            // srNo: i + 1,
            srNo: i + 1 + _pageSize * _pageNo,

            caseMainType: r.caseMainType,

            caseMainType: caseMainTypes?.find(
              (obj) => obj?.id === r.caseMainTypeId
            )?.caseMainType,

            caseMainTypeMr: caseMainTypes?.find(
              (obj) => obj?.id === r.caseMainTypeId
            )?.caseMainTypeMr,

            caseSubType: r.caseSubType,

            subType: caseSubTypes?.find((obj) => obj?.id === r.caseSubType)
              ?.subType,

            caseSubTypeMr: caseSubTypes?.find(
              (obj) => obj?.id === r.caseSubType
            )?.caseSubTypeMr,

            rate: r.rate,

            fromDate: moment(r.fromDate).format("YYYY-MM-DD"),

            toDate: moment(r.toDate).format("YYYY-MM-DD"),

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
          axios
            .post(`${urls.LCMSURL}/master/paymentRate/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getAdvertisementCategoryDetails();
                getPaymentRate();
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
          axios
            .post(`${urls.LCMSURL}/master/paymentRate/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getAdvertisementCategoryDetails();
                getPaymentRate();
                // setButtonInputState(false);
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
    console.log("fromData", fromData);
    // console.log("fromData", JSON.stringify(fromData));
    // Save - DB
    let _body = {
      ...fromData,
      // activeFlag: btnSaveText === "Update" ? fromData.activeFlag: null,
      // activeFlag: fromData.activeFlag,
      activeFlag: fromData.activeFlag,
    };

    let toDate1;

    if (fromData.toDate == "Invalid date") {
      toDate1 = null;
    } else {
      toDate1 = fromData.toDate;
    }
    let _body1 = {
      ...fromData,
      toDate: toDate1,

      // activeFlag: btnSaveText === "Update" ? fromData.activeFlag: null,
      // activeFlag: fromData.activeFlag,
      activeFlag: fromData.activeFlag,
    };

    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${urls.LCMSURL}/master/paymentRate/save`, _body)
        .then((res) => {
          if (res.status == 200) {
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
      const tempData = axios
        .post(`${urls.LCMSURL}/master/paymentRate/save`, _body1)
        .then((res) => {
          console.log("res", res);
          if (res.status == 200) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getPaymentRate();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
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
    // caseCategory: "",
    caseMainType: "",
    rate: "",
    fromDate: "",
    caseSubType: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    caseMainType: "",
    rate: "",
    caseSubType: "",
    // fromDate:""
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },

    {
      // field: "caseTypeName",
      field: language === "en" ? "caseMainType" : "caseMainTypeMr",

      headerName: <FormattedLabel id="caseType" />,
      //type: "number",
      flex: 1,
    },

    {
      // field: "caseSubTypeName",
      field: language === "en" ? "subType" : "caseSubTypeMr",

      headerName: <FormattedLabel id="caseSubType" />,
      flex: 1,
    },

    {
      field: "rate",
      headerName: <FormattedLabel id="rate" />,
      flex: 1,
    },

    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,

      // headerName: "From Date",
      flex: 1,
    },

    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,

      // headerName: "To Date",
      flex: 1,
    },
    

    {
      field: "actions",
      // headerName: "Actions",
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
                setButtonInputState(true);
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

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
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

              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="caseCharges" />
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
                  <Grid container sx={{ marginLeft: "30px" }}>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                      <FormControl
                        sx={{ marginTop: 2 }}
                        error={!!errors.caseMainTypeId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="caseType" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="caseType" />}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("T") ? true : false) ||
                                  (router.query.T ? true : false),
                              }}
                            >
                              {caseMainTypes &&
                                caseMainTypes.map((caseMainType, index) => (
                                  <MenuItem
                                    key={index}
                                    // @ts-ignore
                                    value={caseMainType.id}
                                  >
                                    {/* @ts-ignore */}
                                    {/* {title.title} */}
                                    {language == "en"
                                      ? caseMainType?.caseMainType
                                      : caseMainType?.caseMainTypeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="caseMainTypeId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.caseMainTypeId
                            ? errors.caseMainTypeId.message
                            : null}
                        </FormHelperText>

                        {/* temp remove Validation BCOZ of Field name not change */}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                      <FormControl
                        sx={{ marginTop: 2 }}
                        error={!!errors.caseSubType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="caseSubType" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              //   onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="caseSubType" />}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("caseSubType") ? true : false) ||
                                  (router.query.caseSubType ? true : false),
                              }}
                            >
                              {caseSubTypes &&
                                caseSubTypes.map((subType, index) => (
                                  <MenuItem
                                    key={index}
                                    // @ts-ignore
                                    value={subType.id}
                                  >
                                    {/* @ts-ignore */}
                                    {/* {title.title} */}
                                    {language == "en"
                                      ? subType?.subType
                                      : subType?.caseSubTypeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="caseSubType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.caseSubType
                            ? errors.caseSubType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                      <TextField
                        label={<FormattedLabel id="rate" required />}
                        InputLabelProps={{
                          //true
                          shrink:
                            (watch("rate") ? true : false) ||
                            (router.query.rate ? true : false),
                        }}
                        {...register("rate")}
                        error={!!errors.rate}
                        helperText={errors?.rate ? errors.rate.message : null}
                      />
                    </Grid>

                    {/* 2nd Row */}

                    <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.fromDate}
                      >
                        <Controller
                          name="fromDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    {/* From Date */}
                                    <FormattedLabel id="fromDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
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

                        {/* <FormHelperText>
                          {errors?.fromDate ? errors?.fromDate?.message : null}
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        //   error={!!errors.date}
                      >
                        <Controller
                          name="toDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    {/* To Date */}
                                    {<FormattedLabel id="toDate" />}
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    disabled
                                    {...params}
                                    size="small"
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
                        {/* <FormHelperText>
                      {errors?.date ? errors.date.message : null}
                    </FormHelperText> */}
                      </FormControl>
                    </Grid>
                    <Grid
                      container
                      spacing={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
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

            // autoHeight={true}
            // rowHeight={50}
            // loading={data.loading}
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
              getPaymentRate(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getPaymentRate(_data, data.page);
            }}
          />
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
