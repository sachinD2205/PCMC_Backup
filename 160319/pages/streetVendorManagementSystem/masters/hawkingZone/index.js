import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import styles from "../../../../components/streetVendorManagementSystem/styles/hawkingZone.module.css";
import schema from "../../../../components/streetVendorManagementSystem/schema/HawkingZoneSchema";

// func
const Index = () => {
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
  const [zones, setZones] = useState([]);
  const [items, setItems] = useState([]);

  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZones(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        })),
      );
    });
  };

  const getItem = () => {
    axios.get(`${urls.HMSURL}/item/getAll`).then((r) => {
      setItems(
        r.data.item.map((row) => ({
          id: row.id,
          item: row.item,
        })),
      );
    });
  };

  useEffect(() => {
    getZone();
    getItem();
  }, []);

  // Get Table - Data
  const getHawkingZone = () => {
    axios.get(`${urls.HMSURL}/hawingZone/getAll`).then((res) => {
      console.log(res);
      setDataSource(
        res.data.hawkingZone.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          hawkingZonePrefix: r.hawkingZonePrefix,
          toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          gisId: r.gisId,
          zone: r.zone,
          item: r.item,
          zoneName: zones?.find((obj) => obj?.id === r.zone)?.zoneName,
          itemName: items?.find((obj) => obj?.id === r.item)?.item,
          remark: r.remark,
          citySurveyNo: r.citySurveyNo,
          hawkingZoneName: r.hawkingZoneName,
          areaName: r.areaName,
          declarationDate: moment(r.declarationDate, "YYYY-MM-DD").format(
            "YYYY-MM-DD",
          ),
          declarationOrderNo: r.declarationOrderNo,
          declarationOrder: r.declarationOrder,
          capacityOfHawkingZone: r.capacityOfHawkingZone,
          noOfHawkersPresent: r.noOfHawkersPresent,
          // constraint1:r.constraint1,
          hawkingZoneInfo: r.hawkingZoneInfo,
        })),
      );
    });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getHawkingZone();
    console.log("useEffect");
  }, [zones, items]);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // const fromDate = new Date(formData.fromDate).toISOString();
    // const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // const declarationDate = moment(formData.declarationDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      // fromDate,
      // toDate,
      // declarationDate,
      ...formData,
    };

    axios
      .post(`${urls.HMSURL}/hawingZone/save`, finalBodyForApi)
      .then((res) => {
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getHawkingZone();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  // Delete By ID
  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.HMSURL}/hawingZone/discardHawkigZone/${value}`)
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getHawkingZone();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
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
    gisId: "",
    hawkingZonePrefix: "",
    citySurveyNo: "",
    hawkingZoneName: "",
    areaName: "",
    declarationDate: null,
    declarationOrderNo: "",
    declarationOrder: "",
    capacityOfHawkingZone: "",
    noOfHawkersPresent: "",
    item: null,
    hawkingZoneInfo: "",
    zone: null,
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    gisId: "",
    hawkingZonePrefix: "",
    citySurveyNo: "",
    hawkingZoneName: "",
    areaName: "",
    declarationDate: null,
    declarationOrderNo: "",
    declarationOrder: "",
    capacityOfHawkingZone: "",
    noOfHawkersPresent: "",
    item: null,
    hawkingZoneInfo: "",
    zone: null,
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "hawkingZonePrefix",
      headerName: "Hawking Zone Prefix",
      // flex: 3,
      width: 150,
    },
    { field: "fromDate", headerName: "fromDate" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      // flex: 2,
      width: 100,
    },
    {
      field: "gisId",
      headerName: "GIS Id",
      // type: "number",
      // flex: 2,
      width: 100,
    },
    {
      field: "citySurveyNo",
      headerName: "City Survey No",
      //type: "number",
      // flex: 2,
      width: 150,
    },
    {
      field: "hawkingZoneName",
      headerName: "Hawking Zone Name",
      //type: "number",
      // flex: 3,
      width: 100,
    },
    {
      field: "areaName",
      headerName: "Area Name",
      //type: "number",
      // flex: 2,
      width: 100,
    },
    {
      field: "declarationDate",
      headerName: "Declaration Date",
      //type: "number",
      // flex: 3,
      width: 200,
    },
    {
      field: "declarationOrderNo",
      headerName: "Declaration Order No",
      //type: "number",
      // flex: 3,
      width: 200,
    },
    {
      field: "declarationOrder",
      headerName: "Declaration Order",
      //type: "number",
      // flex: 3,
      width: 150,
    },
    {
      field: "capacityOfHawkingZone",
      headerName: "Capacity Of Hawking Zone",
      //type: "number",
      // flex: 3,
      width: 200,
    },
    {
      field: "noOfHawkersPresent",
      headerName: "No Of Hawkers Present",
      //type: "number",
      // flex: 3,
      width: 200,
    },
    {
      field: "itemName",
      headerName: "Constraint",
      //type: "number",
      // flex: 3,
      width: 100,
    },
    {
      field: "hawkingZoneInfo",
      headerName: "Hawking Zone Info",
      //type: "number",
      // flex: 3,
      width: 150,
    },
    {
      field: "zoneName",
      headerName: "Zone",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
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
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <Slide direction='down' in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      <div className={styles.fieldss}>
                        <TextField
                          autoFocus
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Hawking Zone Prefix *'
                          variant='standard'
                          {...register("hawkingZonePrefix")}
                          error={!!errors.hawkingZonePrefix}
                          helperText={
                            errors?.hawkingZonePrefix
                              ? errors.hawkingZonePrefix.message
                              : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.fromDate}
                        >
                          <Controller
                            control={control}
                            name='fromDate'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='DD/MM/YYYY'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date
                                    </span>
                                  }
                                  value={field.value}
                                  // onChange={(date) => field.onChange(date)}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size='small'
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
                          <FormHelperText>
                            {errors?.fromDate ? errors.fromDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className={styles.fieldss}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.toDate}
                        >
                          <Controller
                            control={control}
                            name='toDate'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='DD/MM/YYYY'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
                                    )
                                  }
                                  // onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size='small'
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
                          <FormHelperText>
                            {errors?.toDate ? errors.toDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div className={styles.fieldss}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.declarationDate}
                        >
                          <Controller
                            control={control}
                            name='declarationDate'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='DD/MM/YYYY'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Declaration Date
                                    </span>
                                  }
                                  value={field.value}
                                  // onChange={(date) => field.onChange(date)}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size='small'
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
                          <FormHelperText>
                            {errors?.declarationDate
                              ? errors.declarationDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div className={styles.fieldss}>
                        <FormControl
                          variant='standard'
                          sx={{ minWidth: 120 }}
                          error={!!errors.zone}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Zone
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Zone Name'
                              >
                                {zones &&
                                  zones.map((zone, index) => (
                                    <MenuItem key={index} value={zone.id}>
                                      {zone.zoneName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='zone'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.zone ? errors.zone.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='GIS Id *'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("gisId")}
                          error={!!errors.gisId}
                          helperText={
                            errors?.gisId ? errors.gisId.message : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='City Survey No*'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("citySurveyNo")}
                          error={!!errors.citySurveyNo}
                          helperText={
                            errors?.citySurveyNo
                              ? errors.citySurveyNo.message
                              : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Hawking Zone Name*'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("hawkingZoneName")}
                          error={!!errors.hawkingZoneName}
                          helperText={
                            errors?.hawkingZoneName
                              ? errors.hawkingZoneName.message
                              : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Area Name*'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("areaName")}
                          error={!!errors.areaName}
                          helperText={
                            errors?.areaName ? errors.areaName.message : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Declaration Order No*'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("declarationOrderNo")}
                          error={!!errors.declarationOrderNo}
                          helperText={
                            errors?.declarationOrderNo
                              ? errors.declarationOrderNo.message
                              : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Declaration Order'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("declarationOrder")}
                          error={!!errors.declarationOrder}
                          helperText={
                            errors?.declarationOrder
                              ? errors.declarationOrder.message
                              : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Capacity Of Hawking Zone'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("capacityOfHawkingZone")}
                          error={!!errors.capacityOfHawkingZone}
                          helperText={
                            errors?.capacityOfHawkingZone
                              ? errors.capacityOfHawkingZone.message
                              : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='No Of Hawkers Present'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("noOfHawkersPresent")}
                          error={!!errors.noOfHawkersPresent}
                          helperText={
                            errors?.noOfHawkersPresent
                              ? errors.noOfHawkersPresent.message
                              : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <FormControl
                          variant='standard'
                          sx={{}}
                          error={!!errors.item}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Constraint
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Constraint'
                              >
                                {items &&
                                  items.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>
                                      {item.item}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='item'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.item ? errors.item.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Hawking Zone Info'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("hawkingZoneInfo")}
                          error={!!errors.hawkingZoneInfo}
                          helperText={
                            errors?.hawkingZoneInfo
                              ? errors.hawkingZoneInfo.message
                              : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Remark'
                          variant='standard'
                          // value={dataInForm && dataInForm.remark}
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type='submit'
                          variant='contained'
                          color='success'
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{" "}
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant='contained'
                          color='primary'
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant='contained'
                          color='error'
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          Exit
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn}>
          <Button
            variant='contained'
            endIcon={<AddIcon />}
            type='primary'
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
            Add{" "}
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
