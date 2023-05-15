import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { Box, Button, FormControl, FormHelperText, Paper, Slide, TextField, Tooltip } from "@mui/material";
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
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[castCategory].module.css";
import schema from "../../../containers/schema/common/CastCategory";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const CastCategory = () => {
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

  // Get Table - Data
  const getCastCategory = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    axios
      .get(`${urls.CFCURL}/castCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      // /getCastCategoryData
      .then((res) => {
        let result = res.data.castCategory;
        let _res = result.map((r, i) => {
          console.log("44");
          return {
            id: r.id,
            srNo: i + 1,
            activeFlag: r.activeFlag,
            castCategoryPrefix: r.castCategoryPrefix,
            // toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            toDate: r.toDate,
            fromDate: r.fromDate,
            castCategory: r.castCategory,
            castCategoryMr: r.castCategoryMr,
            // remark: r.remark,
            status: r.activeFlag === "Y" ? "Activate" : "Inactivate",
          };
        });
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getCastCategory();
  }, []);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const fromDate = new Date(fromData.fromDate).toISOString();
    const fromDate = moment(fromData.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
    };

    // Save - DB
    if (btnSaveText === "Save") {
      axios.post(`${urls.CFCURL}/castCategory/save`, finalBodyForApi).then((res) => {
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          getCastCategory();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      axios.post(`${urls.CFCURL}/castCategory/save`, finalBodyForApi).then((res) => {
        if (res.status == 200) {
          sweetAlert("Updated!", "Record Updated successfully !", "success");
          getCastCategory();
          setButtonInputState(false);
          setIsOpenCollapse(false);
        }
      });
    }
  };

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
          axios.post(`${urls.CFCURL}/castCategory/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getCastCategory();
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
          axios.post(`${urls.CFCURL}/castCategory/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getCastCategory();
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
    castCategory: "",
    castCategoryMr: "",
    castCategoryPrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    castCategory: "",
    castCategoryPrefix: "",
    castCategoryMr: "",
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "id",
      headerName: "Sr.No",
      // flex: 1,
      width: 70,
    },
    {
      field: "fromDate",
      headerName: "FromDate",
      flex: 1,
      width: 130,
    },

    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
      width: 130,
    },

    {
      field: "castCategory",
      headerName: "Cast Category Eng",
      // type: "number",
      flex: 1,
      width: 240,
    },
    {
      field: "castCategoryMr",
      headerName: "Cast Category Mr",
      // type: "number",
      flex: 1,
      width: 200,
    },

    {
      field: "castCategoryPrefix",
      headerName: "Cast Category Prefix ",
      width: 200,
    },
    {
      field: "status",
      headerName: "status",
      //type: "number",
      flex: 1,
    },
    sub,
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
        Cast Category
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      <div>
                        <FormControl style={{ marginTop: 10 }} error={!!errors.fromDate}>
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={<span style={{ fontSize: 16 }}>From Date *</span>}
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
                          <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <FormControl style={{ marginTop: 10 }} error={!!errors.toDate}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={<span style={{ fontSize: 16 }}>To Date</span>}
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
                          <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          // sx={{ width: 480 }}
                          id="standard-basic"
                          label="Cast Category Eng *"
                          variant="standard"
                          {...register("castCategory")}
                          error={!!errors.castCategory}
                          helperText={errors?.castCategory ? errors.castCategory.message : null}
                        />
                      </div>
                    </div>
                    <div className={styles.row}>
                      <div>
                        <TextField
                          // sx={{ width: 480 }}
                          id="standard-basic"
                          label="Cast Category Mr *"
                          variant="standard"
                          {...register("castCategoryMr")}
                          error={!!errors.castCategoryMr}
                          helperText={errors?.castCategoryMr ? errors.castCategoryMr.message : null}
                        />
                      </div>
                      <div>
                        <TextField
                          autoFocus
                          // sx={{ width: 250 }}
                          id="standard-basic"
                          label="Cast Category Prefix *"
                          variant="standard"
                          {...register("castCategoryPrefix")}
                          error={!!errors.castCategoryPrefix}
                          helperText={errors?.castCategoryPrefix ? errors.castCategoryPrefix.message : null}
                        />
                      </div>
                      {/* <div>
                          <TextField
                            // sx={{ width: 480 }}
                            id='standard-basic'
                            label='Remark'
                            variant='standard'
                            {...register("remark")}
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
                          />
                        </div> */}
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
        {/* <DataGrid
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
        /> */}

        <Box style={{ height: "auto", overflow: "auto" }}>
          <DataGrid
            sx={{
              // fontSize: 16,
              // fontFamily: 'Montserrat',
              // font: 'center',
              // backgroundColor:'yellow',
              // // height:'auto',
              // border: 2,
              // borderColor: "primary.light",
              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {
                // backgroundColor:'red',
                // height: '800px !important',
                // display: "flex",
                // flexDirection: "column-reverse",
                // overflow:'auto !important'
              },
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
              getCastCategory(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getCastCategory(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default CastCategory;
