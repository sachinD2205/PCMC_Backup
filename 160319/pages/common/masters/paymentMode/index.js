import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Label } from "../Label";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
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
// import urls from "../../../URLS/urls";
import styles from "../paymentMode/view.module.css";
import schema from "../../../../containers/schema/common/paymentMode";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [paymentTypes, setpaymentTypes] = useState([]);

  const getpaymentMode = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.CFCURL}/master/paymentMode/getAll`, {

     
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        let result = res.data.paymentMode;
        let _res = result.map((val, i) => {
          console.log("res payment mode", res);
          return {
            activeFlag: val.activeFlag,
            srNo: val.id,
            paymentMode: val.paymentMode,
            paymentModePrefix: val.paymentModePrefix,
            paymentTypeId: val.paymentTypeId,
           
           paymentTypes: paymentTypes?.find(
              (obj) => obj?.id === res.paymentTypeId
            )?.paymentTypeId,
            id: val.id,
            fromDate: moment(val.fromDate).format("llll"),
            toDate: val.toDate,
            remark: val.remark,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        // setpaymentTypes(
        //   r.data.map((row) => ({
        //     id: row.id,
        //     paymentTypes: row.paymentType,
        //   })),
        // );
      });
  };

  const getpaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`)
      .then((res) => {
        let result = res.data.paymentType;

        setpaymentTypes(
          res.data.paymentType.map((row) => ({
            id: row.id,
            paymentType: row.paymentType,
          }))
        );
      });
  };

  useEffect(() => {
    getpaymentTypes();
    getpaymentMode();
  }, []);

  // Get Data By ID
  const getDataById = (value) => {
    setIsOpenCollapse(false);
    setID(value);
    axios
      .get(
        `${urls.BaseURL}/paymentMode/getAll/?id=${value}`
      )
      .then((res) => {
        reset(res.data);
        setButtonInputState(true);
        setIsOpenCollapse(true);
        setBtnSaveText("Update");
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
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/paymentMode/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getpaymentMode();
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
          axios
            .post(`${urls.CFCURL}/master/paymentMode/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
              
                setButtonInputState(false);
                getpaymentMode();
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
    const fromDate = new Date(fromData.fromDate).toISOString();
    const toDate = new Date(fromData.toDate).toISOString();
    console.log("From Date ${fromDate} ");

    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
      // activeFlag: btnSaveText === "Update" ? null : null,
    };

    axios
      .post(
        `${urls.CFCURL}/master/paymentMode/save`,
        finalBodyForApi
      )
      .then((res) => {
        if (res.status == 200) {
          id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getpaymentMode();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
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
    paymentMode: "",
    paymentModePrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    paymentMode: "",
    paymentModePrefix: "",
    remark: "",
    id: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    { field: "fromDate", headerName: "From Date" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "paymentTypes",
    //   headerName: "Payment Type",
    //   // type: "number",
    //   flex: 1,
    // },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
      // type: "number",
      flex: 1,
    },
    {
      field: "paymentModePrefix",
      headerName: "Payment Mode Prefix",
      flex: 2,
    },
   
   

 
    
    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
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
          <>
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
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">

                
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
                </Tooltip>
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

       <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
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
       Payment Mode
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div> 
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
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      

                      <div>
                        <FormControl
                          style={{ marginTop: 10 }}
                          // error={!!errors.fromDate}
                        >
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date
                                    </span>
                                  }
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
                          {/* <FormHelperText>
                            {errors?.fromDate ? errors.fromDate.message : null}
                          </FormHelperText> */}
                        </FormControl>
                      </div>

                      <div>
                        <FormControl
                          style={{ marginTop: 10 }}
                          // error={!!errors.toDate}
                        >
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
                                    </span>
                                  }
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
                          {/* <FormHelperText>
                            {errors?.toDate ? errors.toDate.message : null}
                          </FormHelperText> */}
                        </FormControl>
                      </div>
                      {/* <div className={styles.fieldss}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.paymentType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Payment Type *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Payment Type *"
                              >
                                {paymentTypes &&
                                  paymentTypes.map((paymentType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={paymentType.id}
                                    >
                                      {paymentType.paymentType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="paymentType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.paymentType
                              ? errors.paymentType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div> */}

                    </div>


                    <div className={styles.row}>
                     

                      <div>
                        <TextField
                          id="standard-basic"
                          label="PaymentMode *"
                          variant="standard"
                          // value={dataInForm && dataInForm.paymentMode}
                          {...register("paymentMode")}
                          error={!!errors.paymentMode}
                          helperText={
                            errors?.paymentMode
                              ? errors.paymentMode.message
                              : null
                          }
                        />
                      </div>

                      <div>
                        <TextField
                          id="standard-basic"
                          label="Payment Mode Prefix *"
                          variant="standard"
                          {...register("paymentModePrefix")}
                          error={!!errors.paymentModePrefix}
                          helperText={
                            errors?.paymentModePrefix
                              ? errors.paymentModePrefix.message
                              : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Remark"
                          variant="standard"
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
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
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
          )}
          <div className={styles.addbtn}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setBtnSaveText("Save");
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              Add{" "}
            </Button>
          </div>
          <Box style={{ height: "auto", overflow: "auto" }}>
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
                getpaymentTypes(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getpaymentTypes(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      </>
    
  );
};

export default Index;

// export default index
