import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const Index = () => {
  const {
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const language = useSelector((state) => state?.labels.language);

  const router = useRouter();

  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState([]);
  const [nocList, setNocList] = useState([]);

  const { register, control, handleSubmit, methods, reset } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  useEffect(() => {
    getVardiTypes();
    getData();
    getNocData();
  }, []);

  const getNocData = () => {
    axios
      .get(`${urls.BaseURL}/typeOfNOCMaster/getTypeOfNOCMasterData`)
      .then((res) => {
        setNocList(res.data);
        console.log("data", res.data);
      });
  };

  const onSubmitForm = (fromData) => {};

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.BaseURL}/vardiTypeMaster/getVardiTypeMasterData`)
      .then((r) => {
        let vardi = {};
        r.data.map((r) => (vardi[r.id] = r.vardiName));
        setVardiTypes(vardi);
      });
  };

  // get Table Data
  //     .get(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/saveTrnEmergencyServices`
  //     )
  //     .then((res) => {
  //       setDataSource(
  //         res.data.map((r, i) => ({
  //           id: r.id,
  //           srNo: i + 1,
  //           informerName: r.informerName,
  //           contactNumber: r.contactNumber,
  //           occurancePlace: r.occurancePlace,
  //           typeOfVardiId: r.typeOfVardiId,
  //           dateAndTimeOfVardi: moment(
  //             r.dateAndTimeOfVardi,
  //             "DD-MM-YYYY  HH:mm"
  //           ).format("DD-MM-YYYY  HH:mm"),
  //           // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
  //           // businessType: r.businessType,
  //           // businessTypeName: businessTypes?.find(
  //           //   (obj) => obj?.id === r.businessType
  //           // )?.businessType,
  //           // businessSubType: r.businessSubType,
  //           // remark: r.remark,
  //         }))
  //       );
  //     });
  // };

  // Get Table - Data
  const getData = () => {
    axios
      .get(
        `${urls.FbsURL}/transaction/trnEmergencyServices/getTrnEmergencyServicesData`
      )
      .then((res) => {
        console.log("dattaaa", res.data, vardiTypes);
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            serialNo: r.id,
            informerName: r.informerName,
            informerNameMr: r.informerNameMr,
            informerMiddleName: r.informerMiddleName,
            informerMiddleNameMr: r.informerMiddleNameMr,
            informerLastName: r.informerLastName,
            informerLastNameMr: r.informerLastNameMr,
            contactNumber: r.contactNumber,
            occurancePlace: r.occurancePlace,
            occurancePlaceMr: r.occurancePlaceMr,
            area: r.area,
            areaMr: r.areaMr,
            landmark: r.landmark,
            landmarkMr: r.landmarkMr,
            city: r.city,
            cityMr: r.cityMr,
            pinCode: r.pinCode,
            typeOfVardiId: vardiTypes[r.typeOfVardiId]
              ? vardiTypes[r.typeOfVardiId]
              : "-",

            slipHandedOverTo: r.slipHandedOverTo,
            slipHandedOverToMr: r.slipHandedOverToMr,
            dateAndTimeOfVardi: moment(
              r.dateAndTimeOfVardi,
              "YYYY-DD-MM HH:mm:ss"
            ).format("YYYY-DD-MM HH:mm:ss"),
          }))
        );
      });
  };

  // Delete
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // await
        axios
          .delete(
            `${urls.BaseURL}/transaction/trnEmergencyServices/discardTrnEmergencyServices/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
      }
    });
  };

  // View Record
  const viewRecord = (record) => {
    console.log("rec", record);
    router.push({
      pathname: "/FireBrigadeSystem/transactions/emergencyService/form",
      query: {
        btnSaveText: "Update",
        pageMode: "Edit",
        ...record,
      },
    });
  };

  // define colums table
  const columns = [
    {
      headerName: <FormattedLabel id="srNoF" />,
      field: "serialNo",
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="all" />,
      field: "all",
      // width: 150,
    },
    {
      headerName: <FormattedLabel id="cfc" />,
      field: "cfc",
    },

    {
      headerName: <FormattedLabel id="online" />,
      field: "online",
    },
    {
      headerName: <FormattedLabel id="cfcCenterName" />,
      field: "cfcCenterName",
    },
    // {
    //   headerName: <FormattedLabel id="fromDate" />,
    //   field: "fromDate",
    //   // flex: 1,
    // },
    // {
    //   headerName: <FormattedLabel id="toDate" />,
    //   field: "toDate",
    //   // flex: 1,
    // },
    {
      headerName: <FormattedLabel id="countOfReceivedApplicationsAtCfc" />,
      field: "countOfReceivedApplicationsAtCfc",
      // flex: 1,
    },
    {
      headerName: <FormattedLabel id="countOfPendingApplicationsAtCfc" />,
      field: "countOfPendingApplicationsAtCfc",
      // flex: 1,
    },
    {
      headerName: <FormattedLabel id="countOfReceivedApplicationsAtHocfc" />,
      field: "countOfReceivedApplicationsAtHocfc",
      // flex: 1,
    },
    {
      headerName: (
        <FormattedLabel id="CountOfPendingApplicationsAtDepartment" />
      ),
      field: "CountOfPendingApplicationsAtDepartment",
      // flex: 1,
    },
    {
      headerName: <FormattedLabel id="countOfPendingCertificatesAtCfc" />,
      field: "countOfPendingCertificatesAtCfc",
      // flex: 1,
    },
    {
      headerName: <FormattedLabel id="countOfIssueCertificatesByCfc" />,
      field: "countOfIssueCertificatesByCfc",
      // flex: 1,
    },
    {
      headerName: <FormattedLabel id="countOfApplicationsExceed" />,
      field: "countOfApplicationsExceed",
      // flex: 1,
    },
    {
      headerName: <FormattedLabel id="countOfRejectedApplications" />,
      field: "countOfRejectedApplications",
      // flex: 1,
    },

    {
      field: "actions",
      headerAlign: "center",

      headerName: <FormattedLabel id="actions" />,
      // width: "160",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              className={btnStyles.edit}
              disabled={editButtonInputState}
              onClick={() => {
                console.log("Record", record);
                viewRecord(record.row);
                setBtnSaveText("Update");
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              className={btnStyles.delete}
              disabled={deleteButtonInputState}
              onClick={() => deleteById(record.id)}
            >
              <DeleteIcon />
            </IconButton>
            <br />
            {/* <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(record.id)}
            >
              <DeleteIcon className={styles.delete} />
              <br />
            </IconButton> */}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Box style={{ display: "flex", marginTop: "2%" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            <Typography
              sx={{
                color: "white",
                padding: "2%",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h3",
                },
              }}
            >
              {<FormattedLabel id="nocWiseApplicationsCount" />}
            </Typography>
          </Box>
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
            className={styles.feildres}
          >
            <Grid item xs={3} className={styles.feildres}>
              <FormControl
                style={{ marginTop: 10 }}
                // error={!!errors.shiftStartTime}

                sx={{ width: "65%" }}
              >
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={<FormattedLabel id="fromDate" />}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} className={styles.feildres}>
              <FormControl
                style={{ marginTop: 10 }}
                // error={!!errors.shiftStartTime}
                sx={{ width: "65%" }}
              >
                <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={<FormattedLabel id="toDate" />}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2} className={styles.feildres}>
              <Button
                size="small"
                variant="outlined"
                className={styles.button}
                // onClick={getNOcDataOnSearch}
              >
                <FormattedLabel id="search" />
                {/* Search */}
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
            className={styles.feildres}
          >
            <Grid item xs={3} className={styles.feildres}></Grid>
            <Grid item xs={6} className={styles.feildres}>
              <FormControl
                fullWidth
                variant="standard"
                // sx={{ pr: 13 }}
                // error={!!errors.businessType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="nameOfNoc" />}
                </InputLabel>
                <Select
                  sx={{ width: 250 }}
                  // value={nocNo}
                  onChange={(e) => {}}
                  label={<FormattedLabel id="nameOfNoc" />}
                >
                  {nocList &&
                    nocList.map((nocItem, index) => (
                      // nocItem.nOCFor &&
                      <MenuItem key={index} value={nocItem.id}>
                        {nocItem.nOCName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      <Box style={{ height: 350, width: "100%", marginTop: "2rem" }}>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            paddingLeft: "1%",
            paddingRight: "1%",
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="white"
        // width={1000}
        // marginTop="1rem"
        // height="100px"
      >
        <FormProvider {...methods}>
          <form>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              className={styles.feildres}
            >
              <Grid item xs={6} className={styles.feildres}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="all"
                      control={<Radio />}
                      label={<FormattedLabel id="all" />}
                    />
                    <FormControlLabel
                      value="cfc"
                      control={<Radio />}
                      label={<FormattedLabel id="cfc" />}
                    />
                    <FormControlLabel
                      value="online"
                      control={<Radio />}
                      label={<FormattedLabel id="online" />}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6} className={styles.feildres}>
                <FormControl
                  fullWidth
                  variant="standard"
                  // sx={{ pr: 13 }}
                  // error={!!errors.businessType}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="cfcCenterName" />}
                  </InputLabel>
                  <Select
                    sx={{ width: 250 }}
                    // value={nocNo}
                    onChange={(e) => {}}
                    label={<FormattedLabel id="cfcCenterName" />}
                  >
                    {/* {nocList &&
                      nocList.map((nocItem, index) => (
                        // nocItem.nOCFor &&
                        <MenuItem key={index} value={nocItem.id}>
                          {nocItem.nOCName}
                        </MenuItem>
                      ))} */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <FormControl
                  style={{ marginTop: 10 }}
                  // error={!!errors.shiftStartTime}
                  sx={{ width: "65%" }}
                >
                  <Controller
                    control={control}
                    name="fromDate1"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={<FormattedLabel id="fromDate" />}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              fullWidth
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </FormControl>
              </Grid>
              {/* marathi */}
              <Grid item xs={4} className={styles.feildres}>
                <FormControl
                  style={{ marginTop: 10 }}
                  // error={!!errors.shiftStartTime}
                  sx={{ width: "65%" }}
                >
                  <Controller
                    control={control}
                    name="toDate1"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={<FormattedLabel id="toDate" />}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              fullWidth
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  id="standard-basic"
                  label={
                    <FormattedLabel id="countOfReceivedApplicationsAtCfc" />
                  }
                  variant="standard"
                  {...register("countOfReceivedApplicationsAtCfc")}
                  error={!!errors.countOfReceivedApplicationsAtCfc}
                  helperText={
                    errors?.countOfReceivedApplicationsAtCfc
                      ? errors.countOfReceivedApplicationsAtCfc.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  id="standard-basic"
                  label={
                    <FormattedLabel id="countOfPendingApplicationsAtCfc" />
                  }
                  variant="standard"
                  {...register("countOfPendingApplicationsAtCfc")}
                  error={!!errors.countOfPendingApplicationsAtCfc}
                  helperText={
                    errors?.countOfPendingApplicationsAtCfc
                      ? errors.countOfPendingApplicationsAtCfc.message
                      : null
                  }
                />
              </Grid>

              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  id="standard-basic"
                  label={
                    <FormattedLabel id="countOfReceivedApplicationsAtHocfc" />
                  }
                  variant="standard"
                  {...register("countOfReceivedApplicationsAtHocfc")}
                  error={!!errors.countOfReceivedApplicationsAtHocfc}
                  helperText={
                    errors?.countOfReceivedApplicationsAtHocfc
                      ? errors.countOfReceivedApplicationsAtHocfc.message
                      : null
                  }
                />
              </Grid>

              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  id="standard-basic"
                  label={
                    <FormattedLabel id="CountOfPendingApplicationsAtDepartment" />
                  }
                  variant="standard"
                  {...register("CountOfPendingApplicationsAtDepartment")}
                  error={!!errors.CountOfPendingApplicationsAtDepartment}
                  helperText={
                    errors?.CountOfPendingApplicationsAtDepartment
                      ? errors.CountOfPendingApplicationsAtDepartment.message
                      : null
                  }
                />
              </Grid>

              {/* marathi */}
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  id="standard-basic"
                  label={
                    <FormattedLabel id="countOfPendingCertificatesAtCfc" />
                  }
                  variant="standard"
                  {...register("countOfPendingCertificatesAtCfc")}
                  error={!!errors.countOfPendingCertificatesAtCfc}
                  helperText={
                    errors?.countOfPendingCertificatesAtCfc
                      ? errors.countOfPendingCertificatesAtCfc.message
                      : null
                  }
                />
              </Grid>

              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="countOfIssueCertificatesByCfc" />}
                  variant="standard"
                  {...register("countOfIssueCertificatesByCfc")}
                  error={!!errors.countOfIssueCertificatesByCfc}
                  helperText={
                    errors?.countOfIssueCertificatesByCfc
                      ? errors.countOfIssueCertificatesByCfc.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="countOfApplicationsExceed" />}
                  variant="standard"
                  {...register("countOfApplicationsExceed")}
                  error={!!errors.countOfApplicationsExceed}
                  helperText={
                    errors?.countOfApplicationsExceed
                      ? errors.countOfApplicationsExceed.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="countOfRejectedApplications" />}
                  variant="standard"
                  {...register("countOfRejectedApplications")}
                  error={!!errors.countOfRejectedApplications}
                  helperText={
                    errors?.countOfRejectedApplications
                      ? errors.countOfRejectedApplications.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={8} className={styles.feildres}></Grid>
            </Grid>

            <br />
            <br />
            <br />

            {/* <Grid container className={styles.feildres} spacing={2}>
            <Grid item>
              <Button
                type="submit"
                size="small"
                variant="outlined"
                className={styles.button}
                endIcon={<SaveIcon />}
              >
                {btnSaveText == "Update" ? (
                  "Update"
                ) : (
                  <FormattedLabel id="save" />
                )}
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="small"
                variant="outlined"
                className={styles.button}
                endIcon={<ClearIcon />}
                onClick={() => cancellButton()}
              >
                {<FormattedLabel id="clear" />}
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="small"
                variant="outlined"
                className={styles.button}
                endIcon={<ExitToAppIcon />}
                onClick={() =>
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/businessNoc",
                  })
                }
              >
                {<FormattedLabel id="exit" />}
              </Button>
            </Grid>
          </Grid> */}
          </form>
        </FormProvider>
      </Box>
    </>
  );
};

export default Index;
