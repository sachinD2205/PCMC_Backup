// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import {
  Box,
  Button,
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
// import styles from "../court/view.module.css
import styles from "../../../../styles/BsupNagarvasthi/masters/[mainSchemes].module.css";
import schema from "../../../../containers/schema/BsupNagarvasthiSchema/schemeConfigData";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import moment from "moment";

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

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [showDropdown,setShowDropdown]=useState(false)
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  
  //added by satej
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [informationType, setInformationType] = useState([]);
  const [showDocuentInput,setDocuentInput]=useState(false)

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect( () => {
    getInformationType();   
  }, []);

  //added by satej on 11-04-2023
useEffect(() => {
  fetchTableData();
}, []);

const fetchTableData = async (_pageSize = 10, _pageNo = 0) => {
  var mainschemeList;
  var subschemeList;
  //fetch all main schemes to map their name by scheme id in table column
  const response1 = await axios.get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
    params: {
      pageSize: _pageSize,
      pageNo: null,
    },
  }).then( async (r) => {
    let result = r.data.mstMainSchemesList;
    let _res =
      result &&
      result.map((r, i) => {
        return {
          id: r.id,
          schemeName: r.schemeName ? r.schemeName : "-",
        };
      });
      mainschemeList = _res;
      await setMainNames(_res);
  });
  //fetch all sub schemes to map their name by scheme id in table column
  const response2 = await axios.get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
    params: {
      pageSize: _pageSize,
      pageNo: null,
    },
  }).then( async (r) => {
    let result = r.data.mstSubSchemesList;
    let _res =
      result &&
      result.map((r, i) => {
        return {
          id: r.id,
          subSchemeName: r.subSchemeName ? r.subSchemeName : "-",
        };
      });
      subschemeList = _res;
      await setSubSchemeNames(_res);
  });
  
  const response3 = axios.get(`${urls.BSUPURL}/mstSchemesConfigData/getAll`, {
    params: {
      pageSize: _pageSize,
      pageNo: _pageNo,
    },
  }).then(async (r) => {
    console.log("subschemeList "+ subschemeList);
    let result = r.data.mstSchemesConfigDataList;
    let _res =
      result &&
      result.map((r, i) => {
        return {
          id: r.id,
          srNo: i + 1,
          // schemesConfigKey: r.schemesConfigKey,
          informationTitle: r.informationTitle,
          informationType: r.informationType,
          infoSelectionData: r.infoSelectionData,
          isOptional: r.isOptional,
          infoDataSize: r.infoDataSize,
          documentTypeKey: r.documentTypeKey,
          mainSchemeName: mainschemeList?.find((obj) => obj.id == r.schemesConfigKey)?.schemeName
          ? mainschemeList?.find((obj) => obj.id == r.schemesConfigKey)?.schemeName
          : "-",
          subSchemeName: subschemeList?.find((obj) => obj.id == r.subSchemeKey)?.subSchemeName
          ? subschemeList?.find((obj) => obj.id == r.subSchemeKey)?.subSchemeName
          : "-",
          mainSchemeKey :r.schemesConfigKey,
          subSchemeKey: r.subSchemeKey,
          informationTitleMr: r.informationTitleMr,
          activeFlag: r.activeFlag,
          status: r.activeFlag === "Y" ? "Active" : "Inactive",
        };
      });
    console.log("result 2 ", _res);
    await setDataSource(_res);
    await setData({
      rows: _res,
      totalRows: r.data.totalElements,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: r.data.pageSize,
      page: r.data.pageNo,
    });
  });

};

const handleOptionChange = (event) => {
  setSelectedOption(event.target.value);
};

  useEffect(() => {
    if (watch("mainSchemeKey")) {
      getSubScheme();

      var a = mainNames && mainNames.find((r) => {
        return r.id == watch("mainSchemeKey");
      })?.schemePrefix
      
    }
  }, [watch("mainSchemeKey")]);

  const getSubScheme = () => {
    axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAllByMainSchemeKey?mainSchemeKey=${watch("mainSchemeKey")}`)
      .then((r) => {
        setSubSchemeNames(
          r.data.mstSubSchemesList.map((row) => ({
            id: row.id,
            subSchemeName: row.subSchemeName,
          })),
        );
      });
  };

  const getInformationType = () => {
    const infoType=[{value:"ft",name: "Textbox"},
                    {value:"dd",name: "Dropdown"},
                    {value:"fl",name:"File/Document"}
    ]
    setInformationType(infoType);
    // console.log("info type " + JSON.stringify(informationType))
  }
 
  const onSubmitForm = (fromData) => {
    // console.log("fromData", fromData);
    // Save - DB
    let _body = {
      "schemesConfigKey": fromData.mainSchemeKey,
      "subSchemeKey": fromData.subSchemeKey,
      "infoSelectionData": fromData.informationSelectionData,
      ...fromData,
      // activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      // console.log("_body", _body);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstSchemesConfigData/save`, _body)
        .then((res) => {
          // console.log("res ", res);
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
      // console.log("_body", _body);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstSchemesConfigData/save`, _body)
        .then((res) => {
          // console.log("res", res);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            fetchTableData();
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
    // console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.BSUPURL}/mstMainSchemes/save`, body)
            .then((res) => {
              // console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getMainSchemes();
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
        // console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.BSUPURL}/mstMainSchemes/save`, body)
            .then((res) => {
              // console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getMainSchemes();
                // setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  useEffect(()=>{
    // console.log(watch("informationType"))
    if(watch("informationType")=="dd"){
      setShowDropdown(true);
      setDocuentInput(false);
    }else if(watch("informationType")=="fl"){
      setShowDropdown(false);
      setDocuentInput(true);
    }else{
      setShowDropdown(false);
      setDocuentInput(false);
    }
  },[watch("informationType")])

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
    mainSchemeKey: "",
    subSchemeKey: "",
    informationTitle: "",
    informationType: "",
    informationTitleMr: "",
    
  };

  // Reset Values Exit
  const resetValuesExit = {
    schemePrefix: "",
    schemePrefixMr: "",
    fromDate: "",
    fromDateMr: "",
    toDate: "",
    toDateMr: "",
    schemeNo: "",
    schemeNoMr: "",
    schemeName: "",
    schemeNameMr: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,

      // flex: 1,
    },
    {
      field: "informationTitle",
      headerName: <FormattedLabel id="informationTitle" />,

      flex: 1,
    },
    {
      field: "mainSchemeName",
      headerName: <FormattedLabel id="schemeName" />,
      flex: 1,
    },
    {
      field: "subSchemeName",
      headerName: <FormattedLabel id="subSchemeName" />,
      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
      // <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>

          {/* Edit Button */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                // console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
          
          {/* Active Flag Button- green/red */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                 
                  setSlideChecked(true);
                // setButtonInputState(true);
                // console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  // onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  // onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Row
  // actual form controls here..
  return (
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
          {/* <FormattedLabel id="bachatgatCategory" /> */}
          Schemes Config Data
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >

            
              <Grid container style={{ marginLeft: "50px", marginLeft : "50px" }}>                
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>

      {/* main scheme dropdown */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <FormControl error={errors.mainSchemeKey} variant="standard" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="mainScheme" /></InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: "90%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Auditorium"
                    >
                      {mainNames &&
                        mainNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {auditorium.schemeName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="mainSchemeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.mainSchemeKey ? errors.mainSchemeKey.message : null}
                </FormHelperText>
              </FormControl>
                </Grid>
      {/* sub scheme dropdown */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl error={errors.subSchemeKey} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="subScheme" /></InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "90%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {subSchemeNames &&
                            subSchemeNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.subSchemeName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="subSchemeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.subSchemeKey ? errors.subSchemeKey.message : null}
                    </FormHelperText>
                  </FormControl>
                 </Grid>

                 <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <TextField
                      sx={{ width: "90%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="informationTitle" />}
                      variant="standard"
                      {...register("informationTitle")}
                      error={!!errors.informationTitle}
                      helperText={
                        errors?.informationTitle
                          ? errors.informationTitle.message
                          : null
                      }
                    />
                </Grid>
           
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <TextField
                      sx={{ width: "90%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="informationTitleMr" />}
                      variant="standard"
                      {...register("informationTitleMr")}
                      error={!!errors.informationTitleMr}
                      helperText={
                        errors?.informationTitleMr
                          ? errors.informationTitleMr.message
                          : null
                      }
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid>
            {/* Informatin Type dropdown */}
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <FormControl error={errors.informationType} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label"><FormattedLabel id="informationType" /></InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "90%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {informationType &&
                            informationType.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.value}>
                                {auditorium.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="informationType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.informationType ? errors.informationType.message : null}
                    </FormHelperText>
                  </FormControl>
                 </Grid>

            {/* Informatin Selection Data Textbox */}
           {showDropdown && showDocuentInput === false && <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <TextField
                      sx={{ width: "90%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="informationSelectionData" />}
                      variant="standard"
                      {...register("informationSelectionData")}
                      error={!!errors.informationSelectionData}
                      helperText={
                        errors?.informationSelectionData
                          ? errors.informationSelectionData.message
                          : null
                      }
                    />
                 </Grid>}

                 {showDocuentInput && showDropdown === false && <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <TextField
                      sx={{ width: "90%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="infoDataSize" />}
                      variant="standard"
                      {...register("infoDataSize")}
                      error={!!errors.infoDataSize}
                      helperText={
                        errors?.infoDataSize
                          ? errors.infoDataSize.message
                          : null
                      }
                    />
                 </Grid>}


{/* Buttons  */}
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
                      {btnSaveText === "Update"
                        ? // <FormattedLabel id="update" />
                          "Update"
                        : // <FormattedLabel id="save" />
                          "Save"}
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
                      {/* <FormattedLabel id="clear" /> */}
                      Clear
                    </Button>
                  </Grid>
                  <Grid item>
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
          fetchTableData(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          // console.log("222", _data);
          // updateData("page", 1);
          fetchTableData(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
