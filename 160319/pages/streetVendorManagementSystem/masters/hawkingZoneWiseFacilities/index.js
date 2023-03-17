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
import styles from "../../../../components/streetVendorManagementSystem/styles/hawkingZoneWiseFacilities.module.css";
import schema from "../../../../components/streetVendorManagementSystem/schema/HawkingZoneWiseFacilitiesSchema";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
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
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [hawkigZones, sethawkigZones] = useState([]);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getHawkingZone();
  }, []);

  useEffect(() => {
    getHawkingZoneWiseFacilities();
  }, [hawkigZones]);

  const getHawkingZone = () => {
    axios.get(`${urls.HMSURL}/hawingZone/getAll`).then((r) => {
      sethawkigZones(
        r.data.hawkingZone.map((row) => ({
          id: row.id,
          hawkigZone: row.hawkingZoneName,
        })),
      );
    });
  };

  // Get Table - Data
  const getHawkingZoneWiseFacilities = () => {
    axios.get(`${urls.HMSURL}/hawkingZoneWiseFacilities/getAll`).then((res) => {
      console.log(`Hawking Zones ----- ${res.data}`);
      setDataSource(
        res.data.hawkingZoneWiseFacilities.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          hawkingZoneWiseFacilitiesPrefix: r.hawkingZoneWiseFacilitiesPrefix,
          toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          hawkigZone: r.hawkigZone,
          hawkingZoneName: hawkigZones?.find((obj) => obj?.id === r.hawkigZone)
            ?.hawkigZone,
          facilities: r.facilities,
          remark: r.remark,
        })),
      );
    });
  };

  const editRecord = (rows) => {
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    axios
      .post(`${urls.HMSURL}/hawkingZoneWiseFacilities/save`, formData)
      .then((res) => {
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getHawkingZoneWiseFacilities();
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
          .delete(
            `${urls.HMSURL}/hawkingZoneWiseFacilities/discardHawkingZoneWiseFacilities/${value}`,
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getHawkingZoneWiseFacilities();
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
    hawkigZone: "",
    facilities: "",
    hawkingZoneWiseFacilitiesPrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    hawkigZone: "",
    facilities: "",
    hawkingZoneWiseFacilitiesPrefix: "",
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },
    {
      field: "hawkingZoneWiseFacilitiesPrefix",
      headerName: "Hawking Zone Wise Facilities Prefix ",
      flex: 2,
    },
    { field: "fromDate", headerName: "FromDate" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
    {
      field: "facilities",
      headerName: "Facilities",
      // type: "number",
      flex: 1,
    },
    {
      field: "hawkingZoneName",
      headerName: "Hawking Zone",
      // type: "number",
      flex: 1,
    },
    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
      flex: 1,
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
                      <div>
                        <TextField
                          autoFocus
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Hawking Zone Wise Facilities Prefix *'
                          variant='standard'
                          {...register("hawkingZoneWiseFacilitiesPrefix")}
                          error={!!errors.hawkingZoneWiseFacilitiesPrefix}
                          helperText={
                            errors?.hawkingZoneWiseFacilitiesPrefix
                              ? errors.hawkingZoneWiseFacilitiesPrefix.message
                              : null
                          }
                        />
                      </div>
                      <div>
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
                                      From Date *
                                    </span>
                                  }
                                  value={field.value}
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
                      <div>
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
                    </div>
                    <div className={styles.row}>
                      <div>
                        <FormControl
                          variant='standard'
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.hawkigZone}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Hawking Zone Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Hawking Zone'
                              >
                                {hawkigZones &&
                                  hawkigZones.map((hawkigZone, index) => (
                                    <MenuItem key={index} value={hawkigZone.id}>
                                      {hawkigZone.hawkigZone}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='hawkigZone'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.hawkigZone
                              ? errors.hawkigZone.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Facilities*'
                          variant='standard'
                          {...register("facilities")}
                          error={!!errors.facilities}
                          helperText={
                            errors?.facilities
                              ? errors.facilities.message
                              : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Remark'
                          variant='standard'
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <Button
                        sx={{ marginRight: 8 }}
                        type='submit'
                        variant='contained'
                        color='success'
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                      <Button
                        sx={{ marginRight: 8 }}
                        variant='contained'
                        color='primary'
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
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
