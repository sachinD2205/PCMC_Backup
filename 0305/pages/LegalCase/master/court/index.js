import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Divider,
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
// import styles from "../court/view.module.css";
import styles from "../../../../styles/LegalCase_Styles/court.module.css";

import schema from "../../../../containers/schema/LegalCaseSchema/courtSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import { ElevatorOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { EyeFilled } from "@ant-design/icons";

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
  const router = useRouter();

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

  const [courtTypes, setCourtTypes] = useState([]);


  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  useEffect(() => {
    getCourtType();
  }, []);
  
  const getCourtType = () => {
    axios.get(`${urls.LCMSURL}/master/courtType/getAll`).then((res) => {
      setCourtTypes(
        res.data.courtType.map((r, i) => ({
          id: r.id,
          
          courtTypeName: r.courtTypeName,
          courtTypeNameMr: r.courtTypeNameMr,
        }))
      );
    });
  };




  useEffect(() => {
    getCourt();
  }, [fetchData]);

  const getCourt = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.court;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("i", i);

          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            // srNo: i + 1,
            srNo: i + 1 + _pageSize * _pageNo,

            courtNo: r.courtNo,

            courtName: r.courtName,
            courtMr: r.courtMr,

            area: r.area,
            areaMr: r.areaMr,

            roadName: r.roadName,
            roadNameMr: r.roadNameMr,

            landmark: r.landmark,
            landmarkMr: r.landmarkMr,

            city: r.city,
            cityMr: r.cityMr,

            pinCode: r.pinCode,
            courtTypeId:r.courtTypeId,

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

  // New
  const onSubmitForm = (fromData) => {
    // alert("1");

    // Save - DB
    let _body = {
      ...fromData,

      activeFlag: /* btnSaveText === "Update" ? null :  */ fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${urls.LCMSURL}/master/court/save`, _body)
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
        .post(`${urls.LCMSURL}/master/court/save`, _body)
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
            getCourt();
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
          axios.post(`${urls.LCMSURL}/master/court/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getPaymentRate();
              getCourt();
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
          axios.post(`${urls.LCMSURL}/master/court/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getPaymentRate();
              getCourt();
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
    courtNo: "",
    courtName: "",
    courtMr: "",
    area: "",
    areaMr: "",
    roadName: "",
    roadNameMr: "",
    landmark: "",
    landmarkMr: "",

    city: "",
    cityMr: "",
    pinCode: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    courtNo: "",
    courtName: "",
    area: "",
    roadName: "",
    landmark: "",
    city: "",
    pinCode: "",
    id: null,
  };

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
    // { field: "courtNo", headerName: "Court No", flex: 1 },
    {
      // field: "courtName",
      field: language === "en" ? "courtName" : "courtMr",

      headerName: <FormattedLabel id="courtName" />,
      flex: 1,
    },
    // { field: "courtType", headerName: "Court Type", flex: 1 },

    {
      // field: "area",
      field: language === "en" ? "area" : "areaMr",

      headerName: <FormattedLabel id="area" />,
      flex: 1,
    },
    {
      // field: "roadName",
      field: language === "en" ? "roadName" : "roadNameMr",
      headerName: <FormattedLabel id="roadName" />,
      flex: 1,
    },
    {
      // field: "landmark",
      field: language === "en" ? "landmark" : "landmarkMr",
      headerName: <FormattedLabel id="landmark" />,
      flex: 1,
    },
    {
      // field: "city",
      field: language === "en" ? "city" : "cityMr",
      headerName: <FormattedLabel id="cityOrVillage" />,
      flex: 1,
    },
    {
      field: "pinCode",
      headerName: <FormattedLabel id="pincode" />,
      flex: 1,
    },

    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="action" />,
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

            {/* for View Icon */}
            {/* 
              <IconButton
               disabled={editButtonInputState}
               onClick={() => {
                 setBtnSaveText("View"),
                   setID(params.row.id),
                   setIsOpenCollapse(true),
                   setSlideChecked(true);
                 // setButtonInputState(true);
                 console.log("params.row: ", params.row);
                 reset(params.row);
               }}
            >
              <EyeFilled style={{ color: "#556CD6" }} />
            </IconButton> */}

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
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
    // <BasicLayout>
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
          {" "}
          <FormattedLabel id="court" />
        </h2>
      </Box>

      <Divider />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Grid
                container
                sx={{
                  marginLeft: "70px",
                  marginTop: "5px",
                  padding: "30px",
                }}
              >

                {/* Selector for Court Type */}
                 
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.courtTypeId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="courtType" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="courtType" />}
                                // label="Court Type"
                                InputLabelProps={{
                                  //true
                                  shrink:
                                    (watch("courtTypeId") ? true : false) ||
                                    (router.query.courtTypeId ? true : false),
                                }}
                              >


                                {courtTypes &&
                                  courtTypes.map((courtTypeName, index) => (
                                    <MenuItem
                                      key={index}
                                     
                                      value={courtTypeName.id}
                                    >
                                     
                                      {language == "en"
                                        ? courtTypeName?.courtTypeName
                                        : courtTypeName?.courtTypeNameMr}
                                    </MenuItem>
                                  ))}



                              </Select>
                            )}
                            name="courtTypeId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.courtTypeId
                              ? errors.courtTypeId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                </Grid>
                {/* court Name in English */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    // required

                    id="standard-basic"
                    label={<FormattedLabel id="courtNameEn" required />}
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("courtName") ? true : false) ||
                        (router.query.courtName ? true : false),
                    }}
                    {...register("courtName")}
                    error={!!errors.courtName}
                    // helperText={
                    //   // errors?.studentName ? errors.studentName.message : null
                    //   errors?.courtName ? "Court Name is Required !!!" : null
                    // }

                    helperText={
                      errors?.courtName ? errors.courtName.message : " "
                    }
                  />
                </Grid>

                {/* Court Name in Marathi */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="courtNameMr" required />}
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("courtMr") ? true : false) ||
                        (router.query.courtMr ? true : false),
                    }}
                    {...register("courtMr")}
                    error={!!errors.courtMr}
                    // helperText={
                    //   // errors?.studentName ? errors.studentName.message : null
                    //   errors?.courtName ? "Court Name is Required !!!" : null
                    // }

                    helperText={errors?.courtMr ? errors.courtMr.message : " "}
                  />
                </Grid>

                {/* Area in English */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="areaEn" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("area") ? true : false) ||
                        (router.query.area ? true : false),
                    }}
                    {...register("area")}
                    error={!!errors.area}
                    helperText={errors?.area ? errors.area.message : " "}
                  />
                </Grid>

                {/* area in Marathi */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="areaMr" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("areaMr") ? true : false) ||
                        (router.query.areaMr ? true : false),
                    }}
                    {...register("areaMr")}
                    error={!!errors.area}
                    helperText={errors?.areaMr ? errors.areaMr.message : " "}
                  />
                </Grid>

                {/* 2nd Row */}

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="roadNameEn" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("roadName") ? true : false) ||
                        (router.query.roadName ? true : false),
                    }}
                    {...register("roadName")}
                    error={!!errors.roadName}
                    helperText={
                      errors?.roadName ? errors.roadName.message : " "
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    //// required
                    id="standard-basic"
                    label={<FormattedLabel id="roadNameMr" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("roadNameMr") ? true : false) ||
                        (router.query.roadNameMr ? true : false),
                    }}
                    {...register("roadNameMr")}
                    error={!!errors.roadNameMr}
                    helperText={
                      errors?.roadNameMr ? errors.roadNameMr.message : " "
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    //// required
                    id="standard-basic"
                    label={<FormattedLabel id="landmarkEn" required />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("landmark") ? true : false) ||
                        (router.query.landmark ? true : false),
                    }}
                    // {...register("landmark")}
                    // error={!!errors.landmark}
                    // helperText={
                    //   errors?.landmark ? errors.landmark.message : " "
                    // }

                    {...register("landmark")}
                    error={!!errors.landmark}
                    helperText={
                      errors?.landmark ? errors.landmark.message : " "
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    //// required
                    id="standard-basic"
                    label={<FormattedLabel id="landmarkMr" required />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("landmarkMr") ? true : false) ||
                        (router.query.landmarkMr ? true : false),
                    }}
                    {...register("landmarkMr")}
                    error={!!errors.landmarkMr}
                    helperText={
                      errors?.landmarkMr ? errors.landmarkMr.message : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="cityOrVillageEn" required />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("city") ? true : false) ||
                        (router.query.city ? true : false),
                    }}
                    {...register("city")}
                    error={!!errors.city}
                    helperText={errors?.city ? errors.city.message : null}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="cityOrVillageMr" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("cityMr") ? true : false) ||
                        (router.query.cityMr ? true : false),
                    }}
                    {...register("cityMr")}
                    error={!!errors.cityMr}
                    helperText={errors?.cityMr ? errors.cityMr.message : null}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="pincode" required />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("pinCode") ? true : false) ||
                        (router.query.pinCode ? true : false),
                    }}
                    {...register("pinCode")}
                    error={!!errors.pinCode}
                    helperText={errors?.pinCode ? errors.pinCode.message : null}
                  />
                </Grid>

                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "50px",
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
            printOptions: { disableToolbarButton: true },
            // disableExport: true,
            // disableToolbarButton: true,
            // csvOptions: { disableToolbarButton: true },
          },
        }}
        autoHeight
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
          getCourt(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getCourt(_data, data.page);
        }}
      />
    </Paper>
    // </BasicLayout>
  );
};

export default Index;
