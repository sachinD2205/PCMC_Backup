import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Paper,
  Select,
  MenuItem,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[businessSubType].module.css";
import schema from "../../../containers/schema/common/businessSubType";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const BusinessSubType = () => {
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
  const [businessTypes, setBusinessTypes] = useState([]);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getBusinessTypes();
  }, []);

  useEffect(() => {
    getBusinesSubType();
  }, [businessTypes]);



  const getBusinessTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/businessType/getAll`)

      .then((r) => {
        if (r.status == 200) {
          console.log("res department", r);
          setBusinessTypes(r.data.businessType);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // Get Table - Data
  const getBusinesSubType = () => {
    axios
      .get(`${urls.CFCURL}/master/businessSubType/getAll`)
   
      .then((res) => {
        setDataSource(
          res.data.businessSubType.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            businessSubTypePrefix: r.businessSubTypePrefix,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // businessType:r. businessType,
            activeFlag: r.activeFlag,
            // businessSubType: r.businessSubType,
            // businessType:
            //   businessTypes[r.businessType] &&
            //  businessTypes[r.businessType].businessType,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            businessType: businessTypes?.find(
              (obj) => obj?.id === r.businessType
            )?.businessType,

            businessSubType: r.businessSubType,
            remark: r.remark,
          }))
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
  const onSubmitForm = (fromData) => {
    const fromDate = new Date(fromData.fromDate).toISOString();
    const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
    };
    if (btnSaveText === "Save") {
      axios
        .post(
          `${urls.CFCURL}/master/businessSubType/save`,
          finalBodyForApi
        )
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            getBusinesSubType();
            // getBusinessTypes();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    } else if (btnSaveText === "Update") {
      axios
        .post(
          `${urls.CFCURL}/master/businessSubType/save`,
          finalBodyForApi
        )
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            getBusinesSubType();
            // getBusinessTypes();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }
  };


  // const onSubmitForm = (formData) => {
  //   console.log("formData", formData);
  //   const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
  //   const toDate = moment(formData.toDate).format("YYYY-MM-DD");
  //   const finalBodyForApi = {
  //     ...formData,
  //     fromDate,
  //     toDate,
  //     // activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
  //   };

  //   console.log("finalBodyForApi", finalBodyForApi);
  //   // const data = {
  //   //     "fromDate": "2022-11-23T16:00:00",
  //   //     "toDate":"2022-11-23T16:00:00",
  //   //     "billPrefix":"Test",
  //   //     "billType":"Tust"
  //   // };

  //   axios
  //     .post(
  //       `${urls.CFCURL}/master/businessSubType/save`,
  //       finalBodyForApi
  //     )
  //     .then((res) => {
  //       console.log("save data", res);
  //       if (res.status == 200) {
  //         formData.id
  //           ? sweetAlert("Updated!", "Record Updated successfully !", "success")
  //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           getBusinesSubType();
  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };

  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${urls.CFCURL}/master/businessSubType/save/${value}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             //getcast();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
  //   });
  // };
// Delet Button

const deleteById = (value, _activeFlag) => {
  let body = {
    activeFlag: _activeFlag,
    id: value,
  };
  console.log("body", body);
  if (_activeFlag === "N") {
    swal({
      title: "Deactivate?",
      text: "Are you sure you want to deactivate this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      console.log("inn", willDelete);
      if (willDelete === true) {
        axios
          .post(`${urls.CFCURL}/master/businessSubType/save`, body)
          .then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deactivated!", {
                icon: "success",
              });
              getBusinesSubType();
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
          .post(`${urls.CFCURL}/master/businessSubType/save`, body)
          .then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getBusinesSubType();
              setButtonInputState(false);
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
    fromDate: null,
    toDate: null,
    businessType: "",
    businessSubType: "",
    businessSubTypePrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    businessType: "",
    businessSubType: "",
    businessSubTypePrefix: "",
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
    
    { field: "fromDate", headerName: "FromDate" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "businessType",
    //   headerName: "Business Type",
    //   // type: "number",
    //   flex: 1,
    // },
    {
      field: "businessSubType",
      headerName: "Business Sub Type",
      // type: "number",
      flex: 1,
    },

    {
      field: "businessSubTypePrefix",
      headerName: "Business Sub Type Prefix ",
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
Business Sub Type
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
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className={styles.small}>
                      <div className={styles.row}>
                       
                        <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            // error={!!errors.fromDate}
                            required
                          >
                            <Controller
                              control={control}
                              name="fromDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        From Date *
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
                              {errors?.fromDate
                                ? errors.fromDate.message
                                : null}
                            </FormHelperText> */}
                          </FormControl>
                        </div>
                        <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            // error={!!errors.toDate}
                            required
                          >
                            <Controller
                              control={control}
                              name="toDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
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
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="Business Sub Type*"
                            variant="standard"
                            {...register("businessSubType")}
                            error={!!errors.businessSubType}
                            helperText={
                              errors?.businessSubType
                                ? errors.businessSubType.message
                                : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.row}>
                        {/* <div>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors. businessType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Business Type
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Business Type"
                                >
                                  {businessTypes &&
                                    businessTypes.map((businessType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={businessType.id}
                                      >
                                        {businessType.businessType}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="businessType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?. businessType
                                ? errors. businessType.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}
                        
                        <div>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="Business Sub Type Prefix *"
                            variant="standard"
                            {...register("businessSubTypePrefix")}
                            error={!!errors.businessSubTypePrefix}
                            helperText={
                              errors?.businessSubTypePrefix
                                ? errors.businessSubTypePrefix.message
                                : null
                            }
                          />
                        </div>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="Remark"
                            variant="standard"
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
            </Slide>
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

export default BusinessSubType;
