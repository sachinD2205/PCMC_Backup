import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Failed } from "../../../../components/streetVendorManagementSystem/components/commonAlert";

// style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
// NoticeDetails
const NoticeDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext({
    criteriaMode: "all",
    mode: "onChange",
  });
  const [open, setOpen] = useState(false);
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state.labels.language);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [tempRowData, setTempRowData] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  // Modal Close
  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const updateNoticeData = () => {
    setOpen(false);

    // temp Obj
    let updateConcerDept = {
      locationId: watch("locationName"),
      departmentId: watch("departmentName"),
      id: watch("id"),
      activeFlag: "Y",
      empoyeeId: null,
    };

    console.log("updateConcerDept", updateConcerDept);
    let _data = rowsData.filter((data) => {
      if (data.id != watch("id")) {
        return data;
      }
    });

    let tempTableData = [..._data, updateConcerDept];

    let updatedTableData =
      tempTableData?.length > 0 &&
      tempTableData?.map((val, i) => {
        console.log("val?.id", val?.id);
        return {
          srNo: i + 1,
          id: val?.id,
          activeFlag: val?.activeFlag,
          departmentNameEn: filteredDepartments?.find((obj) => obj?.id === val.departmentId)?.department,
          departmentNameMr: filteredDepartments?.find((obj) => obj?.id === val.departmentId)?.departmentMr,
          locationNameEn: officeLocationList?.find((obj) => obj?.id === val.locationId)?.officeLocationName,
          locationNameMr: officeLocationList?.find((obj) => obj?.id === val.locationId)
            ?.officeLocationNameMar,
          departmentId: val?.departmentId,
          locationId: val?.locationId,
        };
      });

    console.log("updatedTableData", updatedTableData);
    setRowsData(updatedTableData);
    setValue("departmentName", null);
    setValue("locationName", null);
  };

  // cols
  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "locationNameEn" : "locationNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: <FormattedLabel id="subDepartment" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    ,
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={(index) => {
                console.log("check", params.row);
                setValue("id", params.row.id);
                setValue("departmentName", params.row.departmentId);
                setValue("locationName", params.row.locationId);
                handleOpen();
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // notice number - serial number
  const getNoticeNumber = async () => {
    await axios
      .get(`${urls.LCMSURL}/notice/getNoticeNumber`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          r?.data ? setValue("serialNo", r.data) : setValue("serialNo", 0);
        } else {
          <Failed />;
        }
      })
      .catch((err) => {
        console.log("err", err);
        <Failed />;
      });
  };

  // officeLocation
  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setOfficeLocationList(r.data.officeLocation);
        } else {
          <Failed />;
        }
      })
      .catch((err) => {
        console.log("err", err);
        <Failed />;
      });
  };

  // getDepartments
  const getFilteredDepartmentsBasedonLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setFilteredDepartments(
            res.data.department.map((r, i) => ({
              id: r.id,
              department: r.department,
              departmentMr: r.departmentMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((err) => {
        <Failed />;
      });
  };

  // addMore - concerDept
  const addConcernDeptList = () => {
    // add new concerDept
    let newConcerDept = {
      departmentId: watch("departmentName"),
      locationId: watch("locationName"),
      // id: null;
      activeFlag: "Y",
      empoyeeId: null,
    };

    let tempTableData;

    let tempRow = [];
    if (
      localStorage.getItem("rowsData") != null ||
      localStorage.getItem("rowsData") != undefined
      // localStorage.getItem("rowsData") !=
    ) {
      tempRow = JSON.parse(localStorage.getItem("rowsData"));
      console.log("23432432", [...tempRow, newConcerDept]);
      tempTableData = [...tempRow, newConcerDept];
    } else {
      tempTableData = [newConcerDept];
    }

    console.log("tempTableData", tempTableData);

    let updatedTableData =
      tempTableData?.length > 0 &&
      tempTableData?.map((val, i) => {
        return {
          srNo: i + 1,
          id: val?.id,
          activeFlag: val?.activeFlag,
          departmentNameEn: filteredDepartments?.find((obj) => obj?.id === val.departmentId)?.department,
          departmentNameMr: filteredDepartments?.find((obj) => obj?.id === val.departmentId)?.departmentMr,
          locationNameEn: officeLocationList?.find((obj) => obj?.id === val.locationId)?.officeLocationName,
          locationNameMr: officeLocationList?.find((obj) => obj?.id === val.locationId)
            ?.officeLocationNameMar,
          departmentId: val?.departmentId,
          locationId: val?.locationId,
        };
      });

    console.log("newNoticesddsk", updatedTableData);
    setRowsData(updatedTableData);
    setValue("departmentName", null);
    setValue("locationName", null);
  };

  useEffect(() => {
    getNoticeNumber();
    getOfficeLocation();
  }, []);

  useEffect(() => {
    console.log("officeLocationList", officeLocationList);
    getFilteredDepartmentsBasedonLocation();
  }, [officeLocationList]);

  useEffect(() => {
    console.log("filteredDepartments", localStorage.getItem("rowsData"));
    let tableDataNew;
    let tempTableData = JSON.parse(localStorage.getItem("rowsData"));
    console.log("id", tempTableData);
    if (tempTableData != null || tempTableData != undefined) {
      tableDataNew = tempTableData?.map((val, i) => {
        return {
          srNo: i + 1,
          id: val?.id,
          activeFlag: "Y",
          departmentNameEn: filteredDepartments?.find((obj) => obj?.id === val.departmentId)?.department,
          departmentNameMr: filteredDepartments?.find((obj) => obj?.id === val.departmentId)?.departmentMr,
          locationNameEn: officeLocationList?.find((obj) => obj?.id === val.locationId)?.officeLocationName,
          locationNameMr: officeLocationList?.find((obj) => obj?.id === val.locationId)
            ?.officeLocationNameMar,
          departmentId: val?.departmentId,
          locationId: val?.locationId,
        };
      });
      setRowsData(tableDataNew);
    } else {
      setRowsData([]);
    }
    console.log("tableDataNew", tableDataNew);
  }, [filteredDepartments]);

  useEffect(() => {
    localStorage.setItem("rowsData", JSON.stringify(rowsData));
    console.log("rowsData", rowsData);
  }, [rowsData]);
  // view
  return (
    <>
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
        <strong> {<FormattedLabel id="noticeDetails" />}</strong>
      </div>

      {/* 1st Row */}
      <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
        {/* Serail Number */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            autoFocus
            disabled
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="serialNo" />}
            variant="standard"
            {...register("serialNo")}
          />
        </Grid>

        {/* Inward Number */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            autoFocus
            id="standard-basic"
            label={<FormattedLabel id="inwardNo" />}
            variant="standard"
            {...register("inwardNo")}
            error={!!errors.inwardNo}
            helperText={errors?.inwardNo ? errors.inwardNo.message : null}
          />
        </Grid>

        {/* notice Date */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl error={!!errors.noticeDate} fullWidth sx={{ width: "90%" }}>
            <Controller
              control={control}
              name="noticeDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="noticeDate" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      setValue("requisitionDate", moment(date).add(30, "days"));
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        variant="standard"
                        size="small"
                        error={!!errors.noticeDate}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText sx={{ marginLeft: 0 }}>
              {errors?.noticeDate ? errors.noticeDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      {/* 2nd Row */}
      <Grid container sx={{ padding: "10px" }}>
        {/* notice received data */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl error={!!errors.noticeRecivedDate} fullWidth sx={{ width: "90%" }}>
            <Controller
              control={control}
              name="noticeRecivedDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disableFuture
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="noticeRecivedDate" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        size="small"
                        fullWidth
                        error={!!errors.noticeRecivedDate}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText sx={{ marginLeft: 0 }}>
              {errors?.noticeRecivedDate ? errors.noticeRecivedDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Notice Received from Advocate in English */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            autoFocus
            id="standard-basic"
            label={<FormattedLabel id="noticeReceviedFromAdvocateEn" />}
            variant="standard"
            {...register("noticeRecivedFromAdvocatePerson")}
            error={!!errors.noticeRecivedFromAdvocatePerson}
            helperText={
              errors?.noticeRecivedFromAdvocatePerson ? errors.noticeRecivedFromAdvocatePerson.message : null
            }
          />
        </Grid>

        {/* Notice Recived from Advocate in Marathi */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            autoFocus
            id="standard-basic"
            label={<FormattedLabel id="noticeReceviedFromAdvocateMr" />}
            variant="standard"
            {...register("noticeRecivedFromAdvocatePersonMr")}
            error={!!errors.noticeRecivedFromAdvocatePersonMr}
            helperText={
              errors?.noticeRecivedFromAdvocatePersonMr
                ? errors.noticeRecivedFromAdvocatePersonMr.message
                : null
            }
          />
        </Grid>
      </Grid>

      {/* 3rd row */}
      <Grid container sx={{ padding: "10px" }}>
        {/* requisitionDate */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl fullWidth sx={{ width: "90%" }}>
            <Controller
              control={control}
              name="requisitionDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    disabled
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="requisitionDate" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                    renderInput={(params) => <TextField {...params} variant="standard" size="small" />}
                  />
                </LocalizationProvider>
              )}
            />
          </FormControl>
        </Grid>

        {/* noticeDetails in English */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            autoFocus
            sx={{ width: "90%" }}
            multiline
            id="standard-basic"
            label={<FormattedLabel id="noticeDetailsEn" />}
            variant="standard"
            {...register("noticeDetails")}
            error={!!errors.noticeDetails}
            helperText={errors?.noticeDetails ? errors.noticeDetails.message : null}
          />
        </Grid>

        {/* Notice Details in Marathi */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            autoFocus
            sx={{ width: "90%" }}
            multiline
            id="standard-basic"
            label={<FormattedLabel id="noticeDetailsMr" />}
            variant="standard"
            {...register("noticeDetailsMr")}
            error={!!errors.noticeDetailsMr}
            helperText={errors?.noticeDetailsMr ? errors.noticeDetailsMr.message : null}
          />
        </Grid>
      </Grid>

      {/* 4th row */}
      <Grid container sx={{ padding: "10px" }}>
        {/* advocateAddress in English */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            multiline
            fullWidth
            sx={{ width: "97%" }}
            id="standard-basic"
            label={<FormattedLabel id="advocateAddressEn" />}
            variant="standard"
            {...register("advocateAddress")}
            error={!!errors.advocateAddress}
            helperText={errors?.advocateAddress ? errors.advocateAddress.message : null}
          />
        </Grid>

        {/* Advocate Address in Marathi */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <TextField
            multiline
            fullWidth
            sx={{ width: "97%" }}
            id="standard-basic"
            label={<FormattedLabel id="advocateAddressMr" />}
            variant="standard"
            {...register("advocateAddressMr")}
            error={!!errors.advocateAddressMr}
            helperText={errors?.advocateAddressMr ? errors.advocateAddressMr.message : null}
          />
        </Grid>
      </Grid>

      {/* 5th Row */}
      <Grid container sx={{ marginTop: "25px" }}>
        {/* deptName */}
        <Grid item xs={0.4}></Grid>
        <Grid
          item
          xs={5}
          // sm={5}
          // md={5}
          // lg={5}
          // xl={5}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          // }}
        >
          {/* <FormControl variant="standard" fullWidth size="small" sx={{ width: "90%" }}>
            <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="deptName" />}</InputLabel>

            <Controller
              render={({ field }) => (
                <Select
                  label={<FormattedLabel id="deptName" />}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  style={{ backgroundColor: "white" }}
                >
                  {officeLocationList &&
                    officeLocationList.map((officeLocation, index) => (
                      <MenuItem key={index} value={officeLocation.id}>
                        {language == "en"
                          ? officeLocation?.officeLocationName
                          : officeLocation?.officeLocationNameMar}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="locationName"
              control={control}
              defaultValue=""
            />
            {/* <FormHelperText style={{ color: "red" }}>
                                  {rowsData.length === 0 && errors?.oficeLocationId
                                    ? errors.oficeLocationId.message
                                    : null}
                                </FormHelperText> */}
          {/* </FormControl>  */}


          {/* new Department Name */}
          <FormControl variant="standard"
          //  error={!!errors?.departmentName} 
          //  sx={{ width: "90%" }}
           >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="deptName" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="deptName" />}
                >
                  {officeLocationList &&
                    officeLocationList.map((officeLocation, index) => (
                      <MenuItem key={index} value={officeLocation.id}>
                        {language == "en"
                          ? officeLocation?.officeLocationName
                          : officeLocation?.officeLocationNameMar}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="locationName"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.hawkingZoneName ? errors?.hawkingZoneName?.message : null}
            </FormHelperText>
          </FormControl>


        </Grid>

        {/* sub Department name */}
        <Grid
          item
          xs={5}
          // sm={5}
          // md={5}
          // lg={5}
          // xl={5}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          // }}
        >
          <FormControl variant="standard" error={!!errors?.departmentName} sx={{ width: "90%" }}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="subDepartment" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="subDepartment" />}
                >
                  {filteredDepartments &&
                    filteredDepartments.map((filteredDepartment, index) => (
                      <MenuItem key={index} value={filteredDepartment?.id}>
                        {language == "en" ? filteredDepartment?.department : filteredDepartment?.departmentMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="departmentName"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.hawkingZoneName ? errors?.hawkingZoneName?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={1}

          sx={{
            marginTop:"20px"
          }}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
        >
          <Button
            type="Button"
            disabled={typeof watch("departmentName") == "string" && typeof watch("locationName" == "string")}
            variant="contained"
            size="small"
            onClick={() => {
              addConcernDeptList();
            }}
          >
            <FormattedLabel id="addMore" />
          </Button>
        </Grid>
      </Grid>

      {/** DataGrid */}
      <Grid container sx={{ padding: "10px" }}>
        <DataGrid
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
          autoHeight={true}
          pagination
          getRowId={(row) => row.srNo}
          paginationMode="server"
          rows={rowsData == [] || rowsData == undefined || rowsData == "" ? [] : rowsData}
          columns={_col}
          onPageChange={(_data) => {}}
          onPageSizeChange={(_data) => {}}
        />
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: "10px",
            }}
          >
            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                sx={{ width: "90%" }}
                autoFocus
                disabled
                hidden
                id="standard-basic"
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="serialNo" />}
                variant="standard"
                {...register("id")}
              />
              <FormControl fullWidth size="small" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="deptName" />}
                </InputLabel>

                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={<FormattedLabel id="deptName" />}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ backgroundColor: "white" }}
                    >
                      {officeLocationList &&
                        officeLocationList.map((officeLocation, index) => (
                          <MenuItem key={index} value={officeLocation.id}>
                            {language == "en"
                              ? officeLocation?.officeLocationName
                              : officeLocation?.officeLocationNameMar}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="locationName"
                  control={control}
                  defaultValue=""
                />
                {/* <FormHelperText style={{ color: "red" }}>
                                  {rowsData.length === 0 && errors?.oficeLocationId
                                    ? errors.oficeLocationId.message
                                    : null}
                                </FormHelperText> */}
              </FormControl>
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl variant="standard" error={!!errors?.departmentName} sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="subDepartment" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="subDepartment" />}
                    >
                      {filteredDepartments &&
                        filteredDepartments.map((filteredDepartment, index) => (
                          <MenuItem key={index} value={filteredDepartment?.id}>
                            {language == "en"
                              ? filteredDepartment?.department
                              : filteredDepartment?.departmentMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="departmentName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.hawkingZoneName ? errors?.hawkingZoneName?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              padding: "10px",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                console.log("watch212", watch("departmentName"), watch("locationName"));
                updateNoticeData();
              }}
            >
              SAVE
            </Button>
            <Button variant="outlined" size="small" onClick={handleClose}>
              CANCEL
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NoticeDetails;
