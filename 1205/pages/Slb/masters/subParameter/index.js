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
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css";
import styles from "../../../../styles/LegalCase_Styles/court.module.css";

// import schema from "../../../../containers/schema/LegalCaseSchema/courtSchema";
import schema from "../../../../containers/schema/SlbSchema/subParameterSchema";
import sweetAlert from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import { ElevatorOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { EyeFilled } from "@ant-design/icons";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

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
  const [moduleNames, setModuleName] = useState([]);
  const [allParameterNames, setAllParameterNames] = useState([]);
  const [parameterNames, setParameterNames] = useState([]);

  const language = useSelector((state) => state.labels.language);

  // const [data, setData] = useState({
  //   rows: [],
  //   totalRows: 0,
  //   rowsPerPageOptions: [10, 20, 50, 100],
  //   pageSize: 10,
  //   page: 1,column
  // });
  const [data, setData] = useState([]);

  // get Module Name
  const getModuleName = () => {
    axios.get(`${urls.SLB}/module/getAll`).then((res) => {
      console.log("ghfgf", res);
      setModuleName(
        res?.data?.moduleList?.map((r, i) => ({
          id: r.id,
          // name: r.name,
          moduleName: r.moduleName,
        })),
      );
    });
  };

  // get Parameter
  const getAllParameters = () => {
    axios.get(`${urls.SLB}/parameter/getAll`).then((res) => {
      console.log("ghfgf", res?.data);
      setAllParameterNames(
        res?.data.parameterList.map((r, i) => ({
          id: r.id,
          // name: r.name,
          parameterName: r?.parameterName,
        })),
      );
    });
  };

  // get Parameter
  const getParameter = () => {
    axios.get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=${watch("moduleKey")}`).then((res) => {
      console.log("ghfgf", res?.data);
      setParameterNames(
        res?.data.parameterList.map((r, i) => ({
          id: r.id,
          // name: r.name,
          parameterName: r?.parameterName,
        })),
      );
    });
  };

  // get sub Para
  const getSubParameter = () => {
    if (moduleNames.length == 0) {
      getModuleName();
    }

    if (allParameterNames.length == 0) {
      getAllParameters();
    }

    axios
      .get(`${urls.SLB}/subParameter/getAll`, {
        // params: {
        //   pageSize: _pageSize,
        //   pageNo: _pageNo,
        // },
      })
      .then((r) => {
        console.log(";r", r);
        // let result = r.data.parameter;
        // console.log("result", result);

        // setData(r.data.parameterList)
        setData(
          r.data.subParameterList.map((res, i) => ({
            srNo: i + 1,
            id: res.id,
            moduleKey: res.moduleKey,
            subParameterName: res.subParameterName,
            parameterKey: res.parameterKey,
            groupParameter: res.groupParameter,
            dataSource: res.dataSource,
            calculationType: res.calculationType,
            calculationTypeLabel: res.calculationType == "N" ? "Numerator" : "Denominator",
            valueType: res.valueType,
            valueTypeLabel: res.valueType == "N" ? "Negative" : "Postive",

            measurementUnit: res.measurementUnit,
            activeFlag: res.activeFlag,
            showYn: res.showYn,
            // get the module name from moduleKey from the moduleNames array

            nmModule: moduleNames?.find((module) => module.id === res.moduleKey)?.moduleName,
            // get the parameter name from parameterKey from the parameterNames array
            nmParameter: allParameterNames?.find((parameter) => parameter.id === res.parameterKey)
              ?.parameterName,
          })),
        );

        // res.data.caseMainType.map((r, i) => ({
        //   id: r.id,
        //   // caseMainType: r.caseMainType,
        //   caseMainType: r.caseMainType,
        //   caseMainTypeMr: r.caseMainTypeMr,
        // }))
      });
  };

  useEffect(() => {
    getModuleName();
    getAllParameters();
    //getSubParameter();
  }, []);

  useEffect(() => {
    getSubParameter();
  }, [moduleNames, allParameterNames]);

  // New
  const onSubmitForm = (fromData) => {
    // alert("1");

    // Save - DB

    if (btnSaveText === "Save") {
      const { id, ...newBody } = fromData;
      let _body = {
        ...newBody,
      };
      const tempData = axios.post(`${urls.SLB}/subParameter/save`, _body).then((res) => {
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
      let _body = {
        ...fromData,
      };

      console.log("Update body", _body);
      const tempData = axios.post(`${urls.SLB}/subParameter/save`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 200 || res.status == 201) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getSubParameter();
          // setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
          setSlideChecked(false);
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    setButtonInputState(false);
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
    moduleName: "",
    parameterName: "",
  };

  useEffect(() => {
    getParameter();
    console.log("parameters32323", parameterNames);
  }, [watch("moduleKey")]);

  useEffect(() => {
    getModuleName();
  }, []);

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      //activeFlag: _activeFlag,
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
        console.log("", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.SLB}/subParameter/inactivate?id=` + value).then((res) => {
            console.log("delet res", res);
            if (res.status == 200 || res.status == 201) {
              swal("Record is Successfully InActivated!", {
                icon: "success",
              });
              getSubParameter();
            }
          });
        } else if (willDelete == null) {
          //swal("Record is Safe");
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
          axios.post(`${urls.SLB}/subParameter/activate?id=` + value, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200 || res.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              getSubParameter();
            }
          });
        } else if (willDelete == null) {
          //swal("Record is Safe");
        }
      });
    }
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex:1
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // { field: "courtNo", headerName: "Court No", flex: 1 },

    {
      field: "nmModule",
      headerName: "Module Name",
      flex: 1,
      headerAlign: "center",
      align: "left",

      renderCell: (params) => (
        <Tooltip title={params.row.nmModule} placement="top">
          <span>{params.row.nmModule}</span>
        </Tooltip>
      ),
    },

    {
      field: "nmParameter",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: "Parameter Name",
      // headerName: <FormattedLabel id="courtName" />,
      // flex: 1,
      flex: 1,
      headerAlign: "center",
      align: "left",

      renderCell: (params) => (
        <Tooltip title={params.row.nmParameter} placement="top">
          <span>{params.row.nmParameter}</span>
        </Tooltip>
      ),
    },

    {
      field: "subParameterName",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: "Sub-Parameter Name",
      // headerName: <FormattedLabel id="courtName" />,
      // flex: 1,
      width: "500",
      headerAlign: "center",
      align: "left",

      renderCell: (params) => (
        <Tooltip title={params.row.subParameterName} placement="top">
          <span>{params.row.subParameterName}</span>
        </Tooltip>
      ),
    },
    //measurementUnit
    {
      field: "measurementUnit",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: "Unit",
      // headerName: <FormattedLabel id="courtName" />,
      // flex: 1,
      width: "100",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.measurementUnit} placement="top">
          <span>{params.row.measurementUnit}</span>
        </Tooltip>
      ),
    },
    {
      field: "groupParameter",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: "Group Parameter",
      // headerName: <FormattedLabel id="courtName" />,
      flex: 1,
      width: "500",
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <Tooltip title={params.row.groupParameter} placement="top">
          <span>{params.row.groupParameter}</span>
        </Tooltip>
      ),
    },
    {
      field: "dataSource",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: "Data Source",
      // headerName: <FormattedLabel id="courtName" />,
      flex: 1,
      width: "500",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.dataSource} placement="top">
          <span>{params.row.dataSource}</span>
        </Tooltip>
      ),
    },
    {
      field: "calculationTypeLabel",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: "Calculation Type",
      // headerName: <FormattedLabel id="courtName" />,
      flex: 1,
      width: "500",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.calculationTypeLabel} placement="top">
          <span>{params.row.calculationTypeLabel}</span>
        </Tooltip>
      ),
    },
    {
      field: "valueTypeLabel",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: "Value Type",
      // headerName: <FormattedLabel id="courtName" />,
      flex: 1,
      width: "500",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.valueTypeLabel} placement="top">
          <span>{params.row.valueTypeLabel}</span>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
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
                // Load values in form by calling reset

                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id), setSlideChecked(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.showYn == "N" ? (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              ) : (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Row

  // useEffect(()=> {

  // },[])

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
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>Sub-Parameter </h2>
      </Box>

      <Divider />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <Grid
                container
                sx={{
                  marginTop: "10px",
                  // padding: "30px",
                  // marginLeft:"20px",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Grid item xl={2} lg={2} md={2}></Grid>

                {/* Module Name */}
                <Grid item xl={3} lg={3} md={3} xs={12}>
                  <FormControl variant="standard" sx={{ m: 1 }} error={!!errors.moduleKey}>
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* {<FormattedLabel id="caseType" />} */}
                      Module Name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          // label={<FormattedLabel id="caseType" />}
                          label="Module Name"

                          // InputLabelProps={{
                          //   shrink: //true
                          //     (watch("caseMainType") ? true : false) ||
                          //     (router.query.caseMaiparameternType ? true : false),
                          // }}
                        >
                          {moduleNames &&
                            moduleNames.map((moduleName, index) => (
                              <MenuItem key={index} value={moduleName.id}>
                                {moduleName.moduleName}

                                {/* {language == "en"
                                      ? name?.name
                                      : name?.name} */}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="moduleKey"
                      control={control}
                      defaultValue=""
                    />
                    {/* <FormHelperText>
                      {errors?.moduleName ? errors.moduleName.message : null}
                    </FormHelperText> */}
                  </FormControl>
                </Grid>

                {/* Parameter */}
                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={3}
                  xs={12}

                  // xs={3} xl={3} lg={3} md={6}
                >
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} error={!!errors.parameterKey}>
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* {<FormattedLabel id="caseType" />} */}
                      Parameter Name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          // label={<FormattedLabel id="caseType" />}
                          label="Parameter Name"
                        >
                          {parameterNames &&
                            parameterNames.map((parameterName, index) => (
                              <MenuItem key={index} value={parameterName.id}>
                                {parameterName.parameterName}

                                {/* {language == "en"
                                      ? name?.name
                                      : name?.name} */}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="parameterKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.parameterName ? errors.parameterName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* subParameter in English */}
                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={3}
                  xs={12}

                  // xs={3} xl={3} lg={3} md={6}
                >
                  <TextField
                    // required
                    id="standard-basic"
                    label="Sub-Parameter"
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("subParameterName") ? true : false) ||
                        (router.query.subParameterName ? true : false),
                    }}
                    {...register("subParameterName")}

                    // helperText={errors?.name ? errors.name.message : " "}
                  />
                </Grid>

                {/* groupParameter in English */}
                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={3}
                  xs={12}

                  // xs={3} xl={3} lg={3} md={6}
                >
                  <TextField
                    // required
                    id="standard-basic"
                    label="Group-Parameter"
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("groupParameter") ? true : false) ||
                        (router.query.groupParameter ? true : false),
                    }}
                    {...register("groupParameter")}

                    // helperText={errors?.name ? errors.name.message : " "}
                  />
                </Grid>

                {/* measurementUnit in English */}
                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={3}
                  xs={12}

                  // xs={3} xl={3} lg={3} md={6}
                >
                  <TextField
                    // required
                    id="standard-basic"
                    label="Measurement Unit"
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("measurementUnit") ? true : false) ||
                        (router.query.measurementUnit ? true : false),
                    }}
                    {...register("measurementUnit")}

                    // helperText={errors?.name ? errors.name.message : " "}
                  />
                </Grid>

                {/* dataSource in English */}
                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={3}
                  xs={12}

                  // xs={3} xl={3} lg={3} md={6}
                >
                  <TextField
                    // required
                    id="standard-basic"
                    label="Data Source"
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("dataSource") ? true : false) || (router.query.dataSource ? true : false),
                    }}
                    {...register("dataSource")}

                    // helperText={errors?.name ? errors.name.message : " "}
                  />
                </Grid>

                {/* Calculation Type */}
                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={3}
                  xs={12}

                  // xs={3} xl={3} lg={3} md={6}
                >
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} error={!!errors.valueType}>
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* {<FormattedLabel id="caseType" />} */}
                      Calculation Type
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          // label={<FormattedLabel id="caseType" />}
                          label="Calculation Type"
                        >
                          <MenuItem value="N">Numerator</MenuItem>
                          <MenuItem value="D">Denominator</MenuItem>
                          <MenuItem value="T">Text</MenuItem>
                        </Select>
                      )}
                      name="calculationType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.calculationType ? errors.calculationType.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Value Type */}
                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={3}
                  xs={12}

                  // xs={3} xl={3} lg={3} md={6}
                >
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} error={!!errors.valueType}>
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* {<FormattedLabel id="caseType" />} */}
                      Value Type
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          // label={<FormattedLabel id="caseType" />}
                          label="Value Type"
                        >
                          <MenuItem value="P">Positive</MenuItem>
                          <MenuItem value="N">Negative</MenuItem>
                        </Select>
                      )}
                      name="valueType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.valueType ? errors.valueType.message : null}</FormHelperText>
                  </FormControl>
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
                  <Grid item xl={2} />
                  <Grid item xl={2}>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      endIcon={<SaveIcon />}
                    >
                      {/* {btnSaveText} */}
                      {btnSaveText === "Update"
                        ? // <FormattedLabel id="update" />
                          "Update"
                        : // <FormattedLabel id="save" />
                          "Save"}
                    </Button>{" "}
                  </Grid>
                  <Grid item xl={2}>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      {/* <FormattedLabel id="clear" /> */}
                      Clear
                    </Button>
                  </Grid>
                  <Grid item xl={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      {/* <FormattedLabel id="exit" /> */}
                      Exit
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
            // reset({
            //   ...resetValuesExit,
            // });
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
        getRowId={(row) => row.srNo}
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
        // pagination
        // paginationMode="server"
        // loading={data.loading}
        // rowCount={data.totalRows}
        // rowsPerPageOptions={data.rowsPerPageOptions}
        // page={data.page}
        // pageSize={data.pageSize}
        rows={data}
        columns={columns}
        // onPageChange={(_data) => {
        //   getParameter(data.pageSize, _data);
        // }}
        // onPageSizeChange={(_data) => {
        //   console.log("222", _data);
        // updateData("page", 1);
        // getParameter(_data, data.page);
        // }}
      />
    </Paper>
    // </BasicLayout>
  );
};

export default Index;
