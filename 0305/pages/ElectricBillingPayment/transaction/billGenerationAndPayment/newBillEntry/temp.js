import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Slide,
    InputLabel,
    ListItemText,
    Menu,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextareaAutosize,
    TextField,
    ThemeProvider,
    Typography,
  } from "@mui/material";
  import SendIcon from "@mui/icons-material/Send";
  import React from "react";
  import { Controller, FormProvider, useForm } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/demandGenerationSchema";
  import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
  import { useState } from "react";
  import { useEffect } from "react";
  import moment from "moment";
  import sweetAlert from "sweetalert";
  import axios from "axios";
  import { useRouter } from "next/router";
  import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
  import urls from "../../../../../URLS/urls";
  import { useDispatch, useSelector } from "react-redux";
  import { DataGrid, GridToolbar } from "@mui/x-data-grid";
  
  
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
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
    const router = useRouter();
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [generateFormLetterFlag, setGenerateFormLetterFlag] = useState(true)
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [consumerNo, setConsumerNo] = useState("")
    const [ward, setWard] = useState([]);
    const [msedclCategory, setMsedclCategory] = useState([]);
    const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState([]);
    const [subDivision, setSubDivision] = useState([]);
    const [division, setDivision] = useState([]);
    const [meterStatus, setMeterStatus] = useState([]);
    const [previousReadingDate, setPreviousReadingDate] = useState();
    const [currentReadingDate, setCurrentReadingDate] = useState();
    const [billDueDate, setBillDueDate] = useState();
    const [searchedConnections, setSearchedConnections] = useState({
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: 10,
      page: 1,
    });
    const [selectedConnection,setSelectedConnection] = useState({})
    const [showTable, setShowTable] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();
    const [id, setId] = useState(router.query.id);
    const [fetchData, setFetchData] = useState(null);
    const [editData, setEditData] = useState({})
    const [isAddMode, setIsAddMode] = useState(router.query.id ? false : true)
  
  
    let tableData = [];
    let tableData1 = [];
    let tableData2 = [];
    let tableData3 = [];
    let tableData4 = [];
  
    const language = useSelector((state) => state.labels.language);
  
    //get logged in user
    const user = useSelector((state) => state.user.user);
  
    // selected menu from drawer
  
    let selectedMenuFromDrawer = Number(
      localStorage.getItem("selectedMenuFromDrawer")
    );
  
    // console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);
  
    // get authority of selected user
  
    const authority = user?.menus?.find((r) => {
      return r.id == selectedMenuFromDrawer;
    })?.roles;
  
    // console.log("authority", authority);
  
  
    useEffect(() => {
      getNewConnectionsData();
      getWard();
      getMeterStatus();
      getMsedclCategory();
      getSubDivision();
    }, []);
  
  
    // get Ward Name
    const getWard = () => {
      axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
        setWard(res.data.ward);
        console.log("res.data", res.data);
      });
    };
  
    // get Meter Status
    const getMeterStatus = () => {
      axios.get(`${urls.EBPSURL}/mstMeterStatus/getAll`).then((res) => {
        setMeterStatus(res.data.mstMeterStatusList);
        console.log("getUsageType.data", res.data);
      });
    };
  
    // get Msedcl Category  
    const getMsedclCategory = () => {
      axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
        setMsedclCategory(res.data.mstMsedclCategoryList);
        console.log("getMsedclCategory.data", res.data);
      });
    };
  
    // get SubDivision
    const getSubDivision = () => {
      axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
        setSubDivision(res.data.mstSubDivisionList);
        console.log("getSubDivision.data", res.data);
      });
    };
  
    // handle search connections
    const handleSearchConnections = (_pageSize=10, _pageNo=0) => {
      setShowTable(true)
      console.log("consumerNo",consumerNo)
      axios.get(`${urls.EBPSURL}/trnNewConnectionEntry/search/consumerNo`, {
        params: {
          consumerNo:1,
        },
      })
      .then((r) => {
        let result = r.data.trnNewConnectionEntryList;
        console.log("result", result);
  
        if (subDivision) {
          let _res = result.map((r, i) => {
            console.log("r", r)
            return {
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: (i + 1) + (_pageNo * _pageSize),
              consumerNo: r.consumerNo,
              consumerName: r.consumerName,
              consumerNameMr: r.consumerNameMr,
              consumerAddress: r.consumerAddress,
              consumerAddressMr: r.consumerAddressMr,
              subDivision: subDivision.find((obj) => { return obj.id == r.subDivisionKey }) ? subDivision.find((obj) => { return obj.id == r.subDivisionKey }).subDivision : "-",
            };
          });
  
          setSearchedConnections({
            rows: _res,
            totalRows: r.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          });
        }
      });
    }
  
    const handleSelectConnection = () => {
  
    }
  
  
    useEffect(() => {
      getNewConnectionsData();
    }, [id]);
  
    // Get Table - Data
    const getNewConnectionsData = () => {
      axios
        .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`)
        .then((r) => {
          let result = r.data.trnNewConnectionEntryList;
          console.log("result", result);
  
          let temp = result.find((obj) => obj.id == id)
          setEditData(temp);
        });
  
    };
  
    const onSubmitForm = (formData) => {
      let _formData = {
        ...formData,
        previousReadingDate,
        currentReadingDate,
        billDueDate
      };
  
      console.log("form data --->", _formData)
  
      // Save - DB
      let _body = {
        ..._formData,
        activeFlag: _formData.activeFlag,
      };
      // if (btnSaveText === "Save") {
      //   console.log("Save New COnnection ............ 4")
      //   const tempData = axios
      //     .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, _body)
      //     .then((res) => {
      //       if (res.status == 201) {
      //         sweetAlert("Saved!", "Record Saved successfully !", "success");
      //         getNewConnectionsData();
      //         setButtonInputState(false);
      //         setFetchData(tempData);
      //         setEditButtonInputState(false);
      //         setDeleteButtonState(false);
      //         router.push('/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry')
      //       }
      //     });
      // }
      // // Update Data Based On ID
      // else if (btnSaveText === "Update") {
      //   console.log("Save New COnnection ............ 5")
      //   let payload = {
      //     ..._body,
      //     status: 17,
      //   }
      //   const tempData = axios
      //     .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, payload)
      //     .then((res) => {
      //       console.log("res", res);
      //       if (res.status == 201) {
      //         _body.id
      //           ? sweetAlert(
      //             "Updated!",
      //             "Record Updated successfully !",
      //             "success"
      //           )
      //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
      //         getNewConnectionsData();
      //         // setButtonInputState(false);
      //         setEditButtonInputState(false);
      //         setDeleteButtonState(false);
      //       }
      //     });
      // }
    };
  
    const generateForm = () => {
      setGenerateFormLetterFlag(false)
      handleOpen();
    }
  
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
            console.log("Save New COnnection ............ 6")
            axios
              .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, body)
              .then((res) => {
                console.log("delet res", res);
                if (res.status == 201) {
                  swal("Record is Successfully Deleted!", {
                    icon: "success",
                  });
                  getNewConnectionsData();
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
            console.log("Save New COnnection ............ 7")
            axios
              .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, body)
              .then((res) => {
                console.log("delet res", res);
                if (res.status == 201) {
                  swal("Record is Successfully Activated!", {
                    icon: "success",
                  });
                  // getPaymentRate();
                  getNewConnectionsData();
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
    const handleExitButton = () => {
      reset({
        ...resetValuesForClear,
        id: null
      });
      setButtonInputState(false);
      setEditButtonInputState(false);
      setDeleteButtonState(false);
      router.push(
        `/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry`
      )
    };
  
    // cancell Button
    const handleClearButton = () => {
      reset({
        ...resetValuesForClear,
        id: id ? id : null,
      });
    };
  
    // Reset Values Cancell
    const resetValuesForClear = {
      consumerName: "",
      consumerAddress: "",
      pinCode: "",
      zoneKey: "",
      wardKey: "",
      departmentKey: "",
      consumptionTypeKey: "",
      loadTypeKey: "",
      phaseKey: "",
      slabTypeKey: "",
      usageTypeKey: "",
      msedclCategoryKey: "",
      billingUnitKey: "",
      subDivisionKey: "",
      departmentCategoryKey: "",
      transactionDocumentsList: [
        {
          documentPath: "",
          mediaKey: "",
          mediaType: "",
          remark: ""
        }
      ]
    };
  
    const columns = [
      //Sr No
      { field: "srNo", width: 50, headerName: <FormattedLabel id="srNo" />, flex: 1 },
  
        // consumerNo
        {
          field: language === "en" ? "consumerNo" : "consumerNoMr",
          // headerName: <FormattedLabel id="consumerName" />,
          headerName: <label>Consumer Number</label>,
          flex: 1,
        },
  
      // consumerName
      {
        field: language === "en" ? "consumerName" : "consumerNameMr",
        // headerName: <FormattedLabel id="consumerName" />,
        headerName: <label>Consumer Name</label>,
        flex: 1,
      },
  
      // consumerAddress
      {
        field: language === "en" ? "consumerAddress" : "consumerAddressMr",
        // headerName: <FormattedLabel id="consumerAddress" />,
        headerName: <label>Consumer Address</label>,
        flex: 1,
      },

       // meterNo
       {
        field: language === "en" ? "meterNo" : "=meterNoMr",
        // headerName: <FormattedLabel id="MeterNumber" />,
        headerName: <label>Meter Number</label>,
        flex: 1,
      },
  
      {
        field: "actions",
        headerName: <FormattedLabel id="actions" />,
        width: 130,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <Box>
              <Button variant="contained" onClick={()=>{handleSelectConnection(params.row.id)}}>Select</Button>
            </Box>
          );
        },
      },
    ];
  
    // Row
  
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
            Bill Generation
            {/* <FormattedLabel id="billingCycle" /> */}
          </h2>
        </Box>
  
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            {/* Firts Row */}
  
              {/* Consumer Number */}
              <Grid container sx={{ padding: "10px" }}>
  
                <Grid
                  item
                  xl={9}
                  lg={9}
                  md={9}
                  sm={9}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={router?.query?.pageMode === "View"}
                    id="standard-textarea"
                    label="Consumer Number"
                    sx={{ m: 1, minWidth: '75%' }}
                    variant="standard"
                    value={consumerNo}
                    onChange={(e)=>{setConsumerNo(e.target.value)}}
                    error={!!errors.consumerNo}
                    helperText={
                      errors?.consumerNo ? errors.consumerNo.message : null
                    }
                  />
  
                </Grid>
  
                <Grid item xl={3}
                        lg={3}
                        md={3}
                        sm={3}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <Button variant="contained" onClick={handleSearchConnections}>
                         Search
                          {/* {<FormattedLabel id="saveAsDraft" />} */}
                        </Button>
                      </Grid>
  
              </Grid>
  
              {
                showTable ? 
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
                // loading={searchedConnections.loading}
                rowCount={searchedConnections.totalRows}
                rowsPerPageOptions={searchedConnections.rowsPerPageOptions}
                page={searchedConnections.page}
                pageSize={searchedConnections.pageSize}
                rows={searchedConnections.rows}
                columns={columns}
                onPageChange={(_searchedConnections) => {
                  handleSearchConnections(searchedConnections.pageSize, _searchedConnections);
                }}
                onPageSizeChange={(_searchedConnections) => {
                  console.log("222", _searchedConnections);
                  // updateData("page", 1);
                  handleSearchConnections(_searchedConnections, searchedConnections.page);
                }}
              />
              : 
              <></>
              }
  
            <Grid container sx={{ padding: "10px" }}>
  
              {/* Ward Name */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  // variant="outlined"
                  variant="standard"
                  size="small"
                  sx={{ m: 1, minWidth: '50%' }}
                  error={!!errors.wardKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="NewsWardName" />} */}
                    Ward
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        {...register("wardKey")}
                        label={<FormattedLabel id="ward" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {ward &&
                          ward.map((wa, index) => (
                            <MenuItem key={index} value={wa.id}>
                              {wa.wardName}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="wardKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.wardKey
                      ? errors.wardKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* MSEDCL Category */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  // variant="outlined"
                  variant="standard"
                  size="small"
                  sx={{ m: 1, minWidth: '50%' }}
                  error={!!errors.msedclCategoryKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    MSEDCL Category
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("msedclCategoryKey")}
                        label={<FormattedLabel id="msedclCategory" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {msedclCategory &&
                          msedclCategory.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.msedclCategory}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="msedclCategoryKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.msedclCategoryKey
                      ? errors.msedclCategoryKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* SubDivision */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  // variant="outlined"
                  variant="standard"
                  size="small"
                  sx={{ m: 1, minWidth: '50%' }}
                  error={!!errors.subDivisionKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Sub Division
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("subDivisionKey")}
                        label={<FormattedLabel id="subDivision" />}
                      >
                        {subDivision &&
                          subDivision.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.subDivision}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="subDivisionKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.subDivisionKey
                      ? errors.subDivisionKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* Second Row */}
  
              {/*Previous Reading Date */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: '50%' }}
                  error={!!errors.previousReadingDate}
                >
                  <Controller
                    // variant="standard"
                    control={control}
                    name="Previous Reading Date"
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          variant="standard"
                          inputFormat="YYYY/MM/DD"
                          label={
                            <span style={{ fontSize: 16 }}>
                              Previous Reading Date
                              {/* Opinion Request Date */}
                              {/* {<FormattedLabel id="opinionRequestDate" />} */}
                            </span>
                          }
                          value={previousReadingDate}
                          onChange={(date) =>
                            setPreviousReadingDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                          }
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="standard"
                              sx={{ width: 230 }}
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
  
                                //true
                                // shrink:
                                //     (watch("meterConnectionDate") ? true : false) ||
                                //     (router.query.meterConnectionDate
                                //         ? true
                                //         : false),
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.previousReadingDate ? errors.previousReadingDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/*Previous Reading */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  label="Previous Reading"
                  sx={{ m: 1, minWidth: '50%' }}
                  multiline
                  variant="standard"
                  {...register("previousReading")}
                  error={!!errors.previousReading}
                  helperText={
                    errors?.previousReading ? errors.previousReading.message : null
                  }
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
                />
              </Grid>
  
              {/*current Reading Date */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: '50%' }}
                  error={!!errors.currentReadingDate}
                >
                  <Controller
                    // variant="standard"
                    control={control}
                    name="Current Reading Date"
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          variant="standard"
                          inputFormat="YYYY/MM/DD"
                          label={
                            <span style={{ fontSize: 16 }}>
                              Current Reading Date
                              {/* Opinion Request Date */}
                              {/* {<FormattedLabel id="opinionRequestDate" />} */}
                            </span>
                          }
                          value={currentReadingDate}
                          onChange={(date) =>
                            setCurrentReadingDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                          }
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="standard"
                              sx={{ width: 230 }}
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
  
                                //true
                                // shrink:
                                //     (watch("meterConnectionDate") ? true : false) ||
                                //     (router.query.meterConnectionDate
                                //         ? true
                                //         : false),
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.currentReadingDate ? errors.currentReadingDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/*current Reading */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  label="Current Reading"
                  sx={{ m: 1, minWidth: '50%' }}
                  multiline
                  variant="standard"
                  {...register("currentReading")}
                  error={!!errors.currentReading}
                  helperText={
                    errors?.currentReading ? errors.currentReading.message : null
                  }
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
                />
              </Grid>
  
              {/* Consumed Unit */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  label="Consumed Unit"
                  sx={{ m: 1, minWidth: '50%' }}
                  multiline
                  variant="standard"
                  {...register("consumedUnit")}
                  error={!!errors.consumedUnit}
                  helperText={
                    errors?.consumedUnit ? errors.consumedUnit.message : null
                  }
                />
              </Grid>
  
              {/* To Be Paid Amount */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  label="To Be Paid Amount"
                  sx={{ m: 1, minWidth: '50%' }}
                  multiline
                  variant="standard"
                  {...register("toBePaidAmount")}
                  error={!!errors.toBePaidAmount}
                  helperText={
                    errors?.toBePaidAmount ? errors.toBePaidAmount.message : null
                  }
                />
              </Grid>
  
              {/*Bill Due Date */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: '50%' }}
                  error={!!errors.billDueDate}
                >
                  <Controller
                    // variant="standard"
                    control={control}
                    name="Bill Due Date"
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          variant="standard"
                          inputFormat="YYYY/MM/DD"
                          label={
                            <span style={{ fontSize: 16 }}>
                              Bill Due Date
                              {/* Opinion Request Date */}
                              {/* {<FormattedLabel id="opinionRequestDate" />} */}
                            </span>
                          }
                          value={billDueDate}
                          onChange={(date) =>
                            setBillDueDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                          }
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="standard"
                              sx={{ width: 230 }}
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
  
                                //true
                                // shrink:
                                //     (watch("meterConnectionDate") ? true : false) ||
                                //     (router.query.meterConnectionDate
                                //         ? true
                                //         : false),
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.billDueDate ? errors.billDueDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* Meter Status */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  // variant="outlined"
                  variant="standard"
                  size="small"
                  sx={{ m: 1, minWidth: '50%' }}
                  error={!!errors.meterStatusKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Meter Status
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("meterStatusKey")}
                        label={<FormattedLabel id="subDivision" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {meterStatus &&
                          meterStatus.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.meterStatus}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="meterStatusKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.meterStatusKey
                      ? errors.meterStatusKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* Arrears */}
  
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  label="Arrears"
                  sx={{ m: 1, minWidth: '50%' }}
                  multiline
                  variant="standard"
                  {...register("arrears")}
                  error={!!errors.arrears}
                  helperText={
                    errors?.arrears ? errors.arrears.message : null
                  }
                />
              </Grid>
  
              {/* View Demand Letter */}
  
              <div>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    {/* <center>
                                  <div>
                                    <Document file={samplePdf} onLoadSuccess={onDocumentLoadSuccess} />
                                    {Array.from(
                                      new Array(numPages),
                                      (el, next) => (
                                        <Page key={`Page_${index + 1}`} pageNumber={index + 1} />
                                      )
                                    )}
      
                                  </div>
                                </center> */}
  
                    <Grid container rowSpacing={5}>
  
                      <Grid item xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <h3>FORM-22 Letter Generated</h3>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              </div>
  
              {/* Button Row */}
  
              <Grid container mt={5} border px={5}>
                {/* Save ad Draft */}
  
                <Grid container>
  
                  <Grid item xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Button variant="contained" onClick={generateForm}>
                      Generate Form-22
                      {/* {<FormattedLabel id="saveAsDraft" />} */}
                    </Button>
                  </Grid>
  
                  {
                    btnSaveText === "Update" ?
  
                      <Grid item xl={6}
                        lg={6}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <Button type="Submit" variant="contained">
                          Update
                          {/* {<FormattedLabel id="saveAsDraft" />} */}
                        </Button>
                      </Grid>
  
                      :
  
                      <Grid item xl={6}
                        lg={6}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button variant="contained" type="Submit" disabled={generateFormLetterFlag ? true : false}>
                          Send to Dy. Engineer for Approval
                          {/* {<FormattedLabel id="saveAsDraft" />} */}
                        </Button>
                      </Grid>
                  }
  
                </Grid>
  
                <Grid container mt={5}>
  
                  <Grid item xl={6}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Button
                      onClick={handleClearButton}
                      variant="contained"
                    >
                      Clear
                      {/* {<FormattedLabel id="submit" />} */}
                    </Button>
                  </Grid>
  
                  <Grid item xl={6}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Button
                      variant="contained"
                      onClick={handleExitButton}
                    >
                      Exit
                      {/* {<FormattedLabel id="cancel" />} */}
                    </Button>
                  </Grid>
  
                </Grid>
              </Grid>
  
            </Grid>
          </form>
        </FormProvider>
  
      </Paper>
    );
  };
  
  export default Index;
  