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
  Grid,
  InputBase,
  InputLabel,
  Paper,
  Slide,
  Select,
  TextField,
  Toolbar,
  MenuItem,
  FormHelperText,
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
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/billingCycleSchema";
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
import schoolMasterSchema from "../../../../containers/schema/school/masters/schoolMasterSchema";

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
    resolver: yupResolver(schoolMasterSchema),
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
  const [wardKeys, setWardKeys] = useState([])
  const [zoneKeys, setZoneKeys] = useState([])

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getSchoolMaster();
  }, [fetchData]);



  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios.get(`${urls.BaseURL}/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneKey: row.zoneName,
        })),
      )
    })
  }

  const getWardKeys = () => {
    axios.get(`${urls.BaseURL}/ward/getAll`).then((r) => {
      setWardKeys(
        r.data.ward.map((row) => ({
          id: row.id,
          wardKey: row.wardName,
        })),
      )
    })
  }

  useEffect(() => {
    getZoneKeys()
    getWardKeys()
  }, [])

  // Get Table - Data
  const getSchoolMaster = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.SCHOOL}/mstSchool/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.mstSchoolList;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            schoolName: r.schoolName,
            pincode: r.pincode,
            schoolPrefix: r.schoolPrefix,
            schoolAddress: r.schoolAddress,
            contactPersonName: r.contactPersonName,
            contactPersonNumber: r.contactPersonNumber,
            wardKey: r.wardKey,
            zoneKey: r.zoneKey,





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
      const tempData = axios
        .post(`${urls.SCHOOL}/mstSchool/save`, _body)
        .then((res) => {
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
      const tempData = axios
        .post(`${urls.SCHOOL}/mstSchool/save`, _body)
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
            getSchoolMaster();
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
          axios
            .post(`${urls.SCHOOL}/mstSchool/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getSchoolMaster();
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
            .post(`${urls.SCHOOL}/mstSchool/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getSchoolMaster();
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
    schoolName: "",
    schoolPrefix: "",
    schoolAddress: "",
    pincode: "",
    contactPersonName: "",
    contactPersonNumber: "",
    emailId: "",
    wardKey: "",
    zoneKey: "",



  };

  // Reset Values Exit
  const resetValuesExit = {
    schoolName: "",
    schoolPrefix: "",
    schoolAddress: "",
    pincode: "",
    contactPersonName: "",
    contactPersonNumber: "",
    emailId: "",
    wardKey: "",
    zoneKey: "",

    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: "srNo"
      // <FormattedLabel id="srNo" />
      , flex: 1
    },
    {

      field: "schoolName",
      headerName: "School Name",

      // headerName: <FormattedLabel id="bookClassification" />,
      flex: 1,
    },


    {
      field: "pincode",
      headerName: "Pincode",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contactPersonName",
      headerName: "Contact Person Name",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contactPersonNumber",
      headerName: "Contact Person Number",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },


    {
      field: "actions",
      // headerName: <FormattedLabel id="actions" />,
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
        // marginTop: "50px",
        // marginBottom: "60px",
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
          {/* <FormattedLabel id="bookClassification" /> */}
          School Master
        </h2>
      </Box>
      <Box
        sx={{
          marginLeft: 10,
          marginRight: 5,
          // marginTop: 2,
          // marginBottom: 3,
          padding: 1,
          // border:1,
          // borderColor:'grey.500'
        }}
      >
        <Box p={1}>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              {isOpenCollapse && (
                <Slide
                  direction="down"
                  in={slideChecked}
                  mountOnEnter
                  unmountOnExit
                >
                  <Grid container>


                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                    // sx={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label="School Name"
                        {...register("schoolName")}
                        error={!!errors.schoolName}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 }
                        }}
                        helperText={
                          errors?.schoolName ? errors.schoolName.message : null
                        }
                      />
                    </Grid>


                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                    // sx={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label="Prefix"
                        {...register("schoolPrefix")}
                        error={!!errors.schoolPrefix}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 }}}
                        helperText={
                          errors?.schoolPrefix ? errors.schoolPrefix.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                    // sx={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label="School Address"
                        {...register("schoolAddress")}
                        error={!!errors.schoolAddress}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 }}}
                        helperText={
                          errors?.schoolAddress ? errors.schoolAddress.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                    // sx={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label="Pincode"
                        {...register("pincode")}
                        error={!!errors.pincode}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 }}}
                        helperText={
                          errors?.pincode ? errors.pincode.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                    // sx={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label="Contact Persone Name"
                        {...register("contactPersonName")}
                        error={!!errors.contactPersonName}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 }}}
                        helperText={
                          errors?.contactPersonName ? errors.contactPersonName.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                    // sx={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label="Contact Person Number"
                        {...register("contactPersonNumber")}
                        error={!!errors.contactPersonNumber}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 }}}
                        helperText={
                          errors?.contactPersonNumber ? errors.contactPersonNumber.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                    // sx={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    >
                      <TextField
                        // label={<FormattedLabel id="bookClassification" />}
                        id="standard-basic"
                        variant="standard"
                        label="Email Id"
                        {...register("emailId")}
                        error={!!errors.emailId}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("emailId") ? true : false) ||
                            (router.query.emailId ? true : false),
                        }}
                        helperText={
                          errors?.emailId ? errors.emailId.message : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                    // sx={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ marginTop: 2 }}
                        error={!!errors.zoneKey}

                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Zone Name
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 200 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Zone Name *"
                              InputProps={{ style: { fontSize: 18 } }}
                              InputLabelProps={{
                                style: { fontSize: 15 },
                                //true
                                shrink:
                                  (watch("zoneKey") ? true : false) ||
                                  (router.query.zoneKey ? true : false),
                              }}
                            >
                              {zoneKeys &&
                                zoneKeys.map((zoneKey, index) => (
                                  <MenuItem key={index} value={zoneKey.id}>
                                    {zoneKey.zoneKey}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.zoneKey ? errors.zoneKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>


                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                    // sx={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    // }}
                    >      <FormControl
                      variant="standard"
                      sx={{ marginTop: 2 }}
                      error={!!errors.wardKey}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("wardKey") ? true : false) ||
                          (router.query.wardKey ? true : false),
                      }}
                    >
                        <InputLabel id="demo-simple-select-standard-label">
                          Ward Name
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Ward Name *"
                              sx={{ width: 200 }}
                            >
                              {wardKeys &&
                                wardKeys.map((wardKey, index) => (
                                  <MenuItem key={index} value={wardKey.id}>
                                    {wardKey.wardKey}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="wardKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.wardKey ? errors.wardKey.message : null}
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
                          Save
                          {/* {btnSaveText === "Update" ? (
                        // <FormattedLabel id="update" />
                      ) : (
                        <FormattedLabel id="save" />
                      )} */}
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
                          Clear
                          {/* <FormattedLabel id="clear" /> */}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          Exit
                          {/* <FormattedLabel id="exit" /> */}
                        </Button>
                      </Grid>
                    </Grid>
                    {/* </div> */}
                  </Grid>
                </Slide>
              )}
            </form>
          </FormProvider>
        </Box>
      </Box>

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
          getSchoolMaster(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getSchoolMaster(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;

