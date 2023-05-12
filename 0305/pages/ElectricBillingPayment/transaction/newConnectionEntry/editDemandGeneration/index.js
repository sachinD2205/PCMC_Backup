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
    RadioGroup,
    Radio,
  } from "@mui/material";
  import SendIcon from "@mui/icons-material/Send";
  import React from "react";
  import BasicLayout from "../../../../../containers/Layout/BasicLayout";
  import { Controller, FormProvider, useForm } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/demandGenerationSchema";
  import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
  import { useState } from "react";
  import axios from "axios";
  import { useEffect } from "react";
  import { height } from "@mui/system";
  import ToggleOnIcon from "@mui/icons-material/ToggleOn";
  import ToggleOffIcon from "@mui/icons-material/ToggleOff";
  import moment from "moment";
  import sweetAlert from "sweetalert";
  import { useRouter } from "next/router";
  import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
  import { language } from "../../../../../features/labelSlice";
  import urls from "../../../../../URLS/urls";
  import { useDispatch, useSelector } from "react-redux";
  import theme from "../../../../../theme.js";
  import styles from "./view.module.css";
  import AddIcon from "@mui/icons-material/Add";
  import ClearIcon from "@mui/icons-material/Clear";
  import DeleteIcon from "@mui/icons-material/Delete";
  import EditIcon from "@mui/icons-material/Edit";
  import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
  import ExitToAppIcon from "@mui/icons-material/ExitToApp";
  import SaveIcon from "@mui/icons-material/Save";
  // import samplePdf from "../../../../../public/certificate.pdf"
  // import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
  import { setNewEntryConnection } from '../../../../../features/userSlice'
  import { DataGrid, GridToolbar } from "@mui/x-data-grid";
  import IconButton from "@mui/material/IconButton";
  import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
  import UploadButton from "../../../../../components/ElectricBillingComponent/uploadDocument/uploadButton";
  import { useLocation } from "react-router-dom";
  import { Result } from "antd";
  
  
  const Index = () => {
    const {
      register,
      control,
      handleSubmit,
      methods,
      reset,
      setValue,
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
    const [generateDemandLetterFlag, setGenerateDemandLetterFlag] = useState(false)
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [ward, setWard] = useState([]);
    const [department, setDepartment] = useState([]);
    const [zone, setZone] = useState([]);
    const [consumptionType, setConsumptionType] = useState([]);
    const [loadType, setLoadType] = useState([]);
    const [phaseType, setPhaseType] = useState([]);
    const [slabType, setSlabType] = useState([]);
    const [usageType, setUsageType] = useState([]);
    const [msedclCategory, setMsedclCategory] = useState([]);
    const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState([]);
    const [subDivision, setSubDivision] = useState([]);
    const [departmentCategory, setDepartmentCategory] = useState([]);
    const [aOneForm, setAOneForm] = useState(null)
    const [proofOfOwnership, setProofOfOwnership] = useState(null)
    const [identyProof, setIdentyProof] = useState(null)
    const [castCertificate, setCastCertificate] = useState(null)
    const [statuatoryAndRegulatoryPermission, setStatuatoryAndRegulatoryPermission] = useState(null)
    const [industrialRegistration, setIndustrialRegistration] = useState(null)
    const [loadProfileSheet, setLoadProfileSheet] = useState(null)
    const [aOneFormList, setAOneFormList] = useState([])
    const [proofOfOwnershipList, setProofOfOwnershipList] = useState([])
    const [identyProofList, setIdentyProofList] = useState([])
    const [castCertificateList, setCastCertificateList] = useState([])
    const [allDocuments, setAllDocuments] = useState([])
    const [buttonInputState, setButtonInputState] = useState();
    const [approvalFlag, setApprovalFlag] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();
    const [id, setId] = useState(router.query.id);
    const [fetchData, setFetchData] = useState(null);
    const [entryConnectionId, setEntryConnectionId] = useState(null)
    const [editData, setEditData] = useState({})
    const [isAddMode, setIsAddMode] = useState(router.query.id ? false : true)
    console.log("aOneForm", aOneForm);
    console.log("proofOfOwnership", proofOfOwnership);
    console.log("identyProof", identyProof);
    console.log("castCertificate", castCertificate);
    console.log("statuatoryAndRegulatoryPermission", statuatoryAndRegulatoryPermission);
    console.log("industrialRegistration", industrialRegistration);
    console.log("loadProfileSheet", loadProfileSheet);

    let tableData = [];
    let tableData1 = [];
    let tableData2 = [];
    let tableData3 = [];
    let tableData4 = [];
  
    const language = useSelector((state) => state.labels.language);
  
    //get logged in user
    const user = useSelector((state) => state.user.user);
  
    console.log("user", user);
  
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
      getDepartment();
      getConsumptionType();
      getBillingDivisionAndUnit();
    }, [window.location.reload])

    useEffect(() => {
        let _res = editData;

        console.log("editData",editData)

        setValue("zoneKey", _res?.zoneKey ? _res?.zoneKey : "-" );
        setValue("wardKey", _res?.wardKey ? _res?.wardKey : "-");
        setValue("departmentKey", _res?.departmentKey ? _res?.departmentKey : "-")
        setValue("consumerName", _res?.consumerName ? _res?.consumerName : "-");
        setValue("consumerAddress", _res?.consumerAddress ? _res?.consumerAddress : "-");
        setValue("pinCode", _res?.pinCode ? _res?.pinCode : "-");
        setValue("consumptionTypeKey", _res?.consumptionTypeKey ? _res?.consumptionTypeKey : "-");
        setValue("loadTypeKey", _res?.loadTypeKey ? _res?.loadTypeKey : "-");
        setValue("phaseKey", _res?.phaseKey ? _res?.phaseKey : "-");
        setValue("slabTypeKey", _res?.slabTypeKey ? _res?.slabTypeKey : "-");
        setValue("usageTypeKey", _res?.usageTypeKey ? _res?.usageTypeKey : "-");
        setValue("msedclCategoryKey", _res?.msedclCategoryKey ? _res?.msedclCategoryKey : "-");
        setValue("billingUnitKey", _res?.billingUnitKey ? _res?.billingUnitKey : "-");
        setValue("subDivisionKey", _res?.subDivisionKey ? _res?.subDivisionKey : "-");
        setValue("departmentCategoryKey", _res?.departmentCategoryKey ? _res?.departmentCategoryKey : "-");
        setValue("transactionNo", _res?.transactionNo ? _res?.transactionNo : "-");
        setValue("aOneFormKey",_res?.transactionDocumentsList ? _res?.transactionDocumentsList.find((obj)=> obj.documentKey === 6)?.remark : "-");
        setValue("proofOfOwnershipKey", _res?.transactionDocumentsList ? _res?.transactionDocumentsList.find((obj)=> obj.documentKey === 7)?.remark : "-");
        setValue("identyProofKey", _res?.transactionDocumentsList ? _res?.transactionDocumentsList.find((obj)=> obj.documentKey === 3)?.remark : "-");
        setValue("castCertificateKey", _res?.transactionDocumentsList ? _res?.transactionDocumentsList.find((obj)=> obj.documentKey === 8)?.remark : "-");
    }, [editData]);
  
  
  
    useEffect(() => {
      // getNewConnectionsData();
      getWard();
      getDepartment();
      getZone();
      getConsumptionType();
      getLoadType();
      getPhaseType();
      getSlabType();
      getUsageType();
      getMsedclCategory();
      getBillingDivisionAndUnit();
      getSubDivision();
      getDepartmentCategory();
      getDocumentsData();
    }, []);
  
    const getDocumentsData = () => {
      axios
      .post(`${urls.EBPSURL}/master/serviceWiseChecklist/getDocumentsByService?service=81`)
      .then((res) => {
        setAOneFormList(res.data && res.data.filter((obj)=> obj.usageType === 6))
        setProofOfOwnershipList(res.data && res.data.filter((obj)=> obj.usageType === 7))
        setIdentyProofList(res.data && res.data.filter((obj)=> obj.usageType === 3))
        setCastCertificateList(res.data && res.data.filter((obj)=> obj.usageType === 8))
      });
    }
  
    // get Ward Name
    const getWard = () => {
      axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
        setWard(res.data.ward);
        console.log("res.data", res.data);
      });
    };
  
    // get Department Name
    const getDepartment = () => {
      axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
        setDepartment(res.data.department);
        console.log("getDepartment", res.data);
      });
    };
  
    // get Zone Name
    const getZone = () => {
      axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
        setZone(res.data.zone);
        console.log("getZone.data", res.data);
      });
    };
  
    // get Consumption Type
    const getConsumptionType = () => {
      axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
        setConsumptionType(res.data.mstConsumptionTypeList);
        console.log("getConsumptionType", res.data);
      });
    };
  
    // get Load Type
    const getLoadType = () => {
      axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
        setLoadType(res.data.mstLoadTypeList);
        console.log("getLoadType.data", res.data);
      });
    };
  
    // get Phase Type
    const getPhaseType = () => {
      axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
        setPhaseType(res.data.mstPhaseTypeList);
        console.log("getPhaseType.data", res.data);
      });
    };
  
    // get Slab Type
    const getSlabType = () => {
      axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
        setSlabType(res.data.mstSlabTypeList);
        console.log("getSlabType.data", res.data);
      });
    };
  
    // get Usage Type
    const getUsageType = () => {
      axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
        setUsageType(res.data.mstEbUsageTypeList);
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
  
    // get Billing Division And Unit 
    const getBillingDivisionAndUnit = () => {
      axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
        let temp = res.data.mstBillingUnitList;
        console.log("getBillingDivisionAndUnit.data", temp);
        setBillingDivisionAndUnit(temp.map((each) => {
          return {
            id: each.id,
            billingDivisionAndUnit: `${each.divisionName}/${each.billingUnit}`
          }
        }));
  
      });
    };
  
    // get SubDivision
    const getSubDivision = () => {
      axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
        setSubDivision(res.data.mstSubDivisionList);
        console.log("getSubDivision.data", res.data);
      });
    };
  
    // get Department Category
    const getDepartmentCategory = () => {
      axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
        setDepartmentCategory(res.data.mstDepartmentCategoryList);
        console.log("getDepartmentCategory.data", res.data);
      });
    };
  
  
    useEffect(() => {
      getNewConnectionsData();
    }, [router.query.id]);
  
    // Get Table - Data
    const getNewConnectionsData = () => {
      axios
        .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        })
        .then((r) => {
          let result = r.data.trnNewConnectionEntryList;
          console.log("result", result);
  
          let temp = result.find((obj) => obj.id == router.query.id)
          setEditData(temp);
          setAOneForm(temp?.transactionDocumentsList && temp?.transactionDocumentsList.find((obj)=> obj.documentKey === 6))
          setProofOfOwnership(temp?.transactionDocumentsList && temp?.transactionDocumentsList.find((obj)=> obj.documentKey === 7))
          setIdentyProof(temp?.transactionDocumentsList && temp?.transactionDocumentsList.find((obj)=> obj.documentKey === 3))
          setCastCertificate(temp?.transactionDocumentsList && temp?.transactionDocumentsList.find((obj)=> obj.documentKey === 8))
        });
  
    };

    const handleUploadDocument = (path,type) =>{
      console.log("allDocuments",allDocuments);
      if(path !== null && type === "aOneForm"){
        let temp = {
          documentPath: path,
          documentKey : 6,
          documentType : "",
          remark : watch('aOneFormKey'),
        }
      setAllDocuments([...allDocuments, temp])
      }
      else if(path !== null && type === "proofOfOwnership"){
        let temp = {
          documentPath: path,
          documentKey :  7,
          documentType : "",
          remark : watch('proofOfOwnershipKey'),
        }
      setAllDocuments([...allDocuments, temp])
      }
      else if(path !== null && type === "identyProof"){
        let temp = {
          documentPath: path,
          documentKey : 3,
          documentType : "",
          remark :  watch('identyProofKey'),
        }
      setAllDocuments([...allDocuments, temp])
      }
      else if(path !== null && type === "castCertificate"){
        let temp = {
          documentPath: path,
          documentKey : 8,
          documentType : "",
          remark :  watch('castCertificateKey'),
        }
      setAllDocuments([...allDocuments, temp])
      }
    }
  
    const onSubmitForm = (formData) => {
  
      let _formData = {...editData, ...formData };
  
      // Save - DB
      let _body = {
        ..._formData,
        transactionDocumentsList: allDocuments,
        activeFlag: _formData.activeFlag,
      };
      if (btnSaveText === "Save") {
        console.log("Save New COnnection ............ 4",_body)
        const tempData = axios
          .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, _body, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            }
          })
          .then((res) => {
            if (res.status == 201) {
              sweetAlert("Updated!", `Connection ${editData?.id} Updated successfully !`, "success");
              getNewConnectionsData();
              setButtonInputState(false);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
              router.push('/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry')
            }
          });
      }
    };
  
    const generateDemandLetter = () => {
      setGenerateDemandLetterFlag(false)
      handleOpen();
    }
  
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
  
    // Reset Values Exit
    const resetValuesExit = {
      billingCycle: "",
      billingCycleMr: "",
      id: null,
    };
  
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
           Edit New Connection For Demand Generation
            {/* <FormattedLabel id="editDemandGeneration" /> */}
          </h2>
        </Box>
  
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            {/* Firts Row */}
            <Grid container sx={{ padding: "10px" }}>
  
              {/* Zone */}
  
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
                  error={!!errors.zoneKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Zone
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("zoneKey")}
                        label={<FormattedLabel id="zone" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {zone &&
                          zone.map((each, index) => (
                            <MenuItem key={index} value={each.id}>
                              {each.zoneName}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="zoneKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.zoneKey
                      ? errors.zoneKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
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
  
              {/* Department Name */}

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
                  error={!!errors.departmentKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="NewsWardName" />} */}
                    Department
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        {...register("departmentKey")}
                        label={<FormattedLabel id="department" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {department &&
                          department.map((dept, index) => (
                            <MenuItem key={index} value={dept.id}>
                              {dept.department}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="departmentKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.departmentKey
                      ? errors.departmentKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* Second Row */}
  
              {/* Consumer Name */}
  
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
                  label="Consumer Name"
                  sx={{ m: 1, minWidth: '50%' }}
                  variant="standard"
                  {...register("consumerName")}
                  error={!!errors.consumerName}
                  helperText={
                    errors?.consumerName ? errors.consumerName.message : null
                  }
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
                />
              </Grid>
  
              {/*Consumer Address */}
  
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
                  label="Consumer Address"
                  sx={{ m: 1, minWidth: '50%' }}
                  multiline
                  variant="standard"
                  {...register("consumerAddress")}
                  error={!!errors.consumerAddress}
                  helperText={
                    errors?.consumerAddress ? errors.consumerAddress.message : null
                  }
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
                />
              </Grid>
  
              {/* Pin Code */}
  
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
                  label="Pincode"
                  sx={{ m: 1, minWidth: '50%' }}
                  multiline
                  variant="standard"
                  {...register("pinCode")}
                  error={!!errors.pinCode}
                  helperText={
                    errors?.pinCode ? errors.pinCode.message : null
                  }
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
                />
              </Grid>
  
              {/* Consumption Type */}
  
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
                  error={!!errors.consumptionTypeKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Consumption Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("consumptionTypeKey")}
                        label={<FormattedLabel id="consumptionType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {consumptionType &&
                          consumptionType.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.consumptionType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="consumptionTypeKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.consumptionTypeKey
                      ? errors.consumptionTypeKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* Load Type */}
  
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
                  error={!!errors.loadTypeKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Load Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("loadTypeKey")}
                        label={<FormattedLabel id="loadType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {loadType &&
                          loadType.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.loadType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="loadTypeKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.loadTypeKey
                      ? errors.loadTypeKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* phase Type */}
  
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
                  error={!!errors.phaseKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Phase Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("phaseKey")}
                        label={<FormattedLabel id="phaseType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {phaseType &&
                          phaseType.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.phaseType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="phaseKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.phaseKey
                      ? errors.phaseKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* slab Type */}
  
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
                  error={!!errors.slabTypeKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Slab Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("slabTypeKey")}
                        label={<FormattedLabel id="slabType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {slabType &&
                          slabType.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.slabType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="slabTypeKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.slabTypeKey
                      ? errors.slabTypeKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
  
              {/* usage Type */}
  
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
                  error={!!errors.usageTypeKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Usage Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("usageTypeKey")}
                        label={<FormattedLabel id="usageTypeKey" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {usageType &&
                          usageType.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.usageType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="usageTypeKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.usageTypeKey
                      ? errors.usageTypeKey.message
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
  
              {/* Billing Division/Unit */}
  
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
                  error={!!errors.billingUnitKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Billing Division/Unit
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("billingUnitKey")}
                        label={<FormattedLabel id="billingDivisionUnit" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {billingDivisionAndUnit &&
                          billingDivisionAndUnit.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.billingDivisionAndUnit}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="billingUnitKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.billingUnitKey
                      ? errors.billingUnitKey.message
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
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
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
  
              {/* Department Category */}
  
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
                  error={!!errors.departmentCategoryKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}
                    {/* {<FormattedLabel id="locationName" />} */}
                    Department Category
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
  
                        {...register("departmentCategoryKey")}
                        label={<FormattedLabel id="departmentCategory" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                      >
                        {departmentCategory &&
                          departmentCategory.map((type, index) => (
                            <MenuItem
                              key={index}
                              value={type.id}
                            >
                              {type.departmentCategory}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="departmentCategoryKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.departmentCategoryKey
                      ? errors.departmentCategoryKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

                {/* Attachment */}


          <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            sx={{ paddingLeft: "110px" }}
            className={styles.attachmentContainer}
          >
            <h4 style={{ marginTop: "40px" }}>
              Note: Attached file should have max 2MB size in JPG, JPEG, PNG & PDF format
            </h4>

            {/* A-1 Form */}
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <label>
                  <b>A-1 Form for Power Supply:</b>
                </label>
              <br />
                <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "75%" }}
                error={!!errors.aOneFormKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {/* {<FormattedLabel id="locationName" />} */}
                  Purpose
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      // sx={{ wordBreak: 'break-all' }}
                      value={field.value}
                      // onChange={(value) => field.onChange(value)}

                      {...register("aOneFormKey")}
                      // label={<FormattedLabel id="consumptionType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {aOneFormList &&
                        aOneFormList.map((type, index) => (
                          <MenuItem key={index} value={language === "en" ? type.documentChecklistEn : type.documentChecklistMr}>
                             {language === "en" ? type.documentChecklistEn : type.documentChecklistMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="aOneFormKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.aOneFormKey ? errors.aOneFormKey.message : null}
                </FormHelperText>
              </FormControl>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <UploadButton
                  appName="EBP"
                  serviceName="EBP-NewConnection"
                  filePath={(path)=>{handleUploadDocument(path,'aOneForm')}}
                  fileName={aOneForm?.documentPath}
                />
              </Grid>
            </Grid>

            {/* Proof of Ownership */}
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10} style={{ marginRight: "15px" }}>
                <label>
                  <b>Proof of Ownership or Occupancy of Premises :</b>
                </label>

                <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "75%", wordBreak:'break-word'}}
                error={!!errors.proofOfOwnershipKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {/* {<FormattedLabel id="locationName" />} */}
                  Select any one of the following
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      sx={{ wordBreak:'break-word' }}
                      value={field.value}
                      // onChange={(value) => field.onChange(value)}

                      {...register("proofOfOwnershipKey")}
                      // label={<FormattedLabel id="consumptionType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {proofOfOwnershipList &&
                        proofOfOwnershipList.map((type, index) => (
                          <MenuItem key={index} value={language === "en" ? type.documentChecklistEn : type.documentChecklistMr}>
                             {language === "en" ? type.documentChecklistEn : type.documentChecklistMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="proofOfOwnershipKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.proofOfOwnershipKey ? errors.proofOfOwnershipKey.message : null}
                </FormHelperText>
              </FormControl>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <UploadButton
                  appName="EBP"
                  serviceName="EBP-NewConnection"
                  filePath={(path)=>{handleUploadDocument(path,'proofOfOwnership')}}
                  fileName={proofOfOwnership?.documentPath}
                />
              </Grid>
            </Grid>

            {/* Identity Proof */}
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <label style={{ textAlign: "left" }}>
                  <b>Identity Proof</b>{" "}
                </label>
                <br />
                <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "75%", wordBreak:'break-word'}}
                error={!!errors.identyProofKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {/* {<FormattedLabel id="locationName" />} */}
                Select any one of the following
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      sx={{ wordBreak:'break-word' }}
                      value={field.value}
                      // onChange={(value) => field.onChange(value)}

                      {...register("identyProofKey")}
                      // label={<FormattedLabel id="consumptionType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {identyProofList &&
                        identyProofList.map((type, index) => (
                          <MenuItem key={index} value={language === "en" ? type.documentChecklistEn : type.documentChecklistMr}>
                             {language === "en" ? type.documentChecklistEn : type.documentChecklistMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="identyProofKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.identyProofKey ? errors.identyProofKey.message : null}
                </FormHelperText>
              </FormControl>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <UploadButton
                  appName="EBP"
                  serviceName="EBP-NewConnection"
                  filePath={(path)=>{handleUploadDocument(path,'identyProof')}}
                  fileName={identyProof?.documentPath}
                />
              </Grid>
            </Grid>

            {/* Cast Certificate */}
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <label style={{ textAlign: "left" }}>
                  <b>Documents required for relevant category</b>{" "}
                </label>
                <br />
                <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "75%", wordBreak:'break-word'}}
                error={!!errors.castCertificateKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {/* {<FormattedLabel id="locationName" />} */}
                If applicable
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      sx={{ wordBreak:'break-word' }}
                      value={field.value}
                      // onChange={(value) => field.onChange(value)}

                      {...register("castCertificateKey")}
                      // label={<FormattedLabel id="consumptionType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {castCertificateList &&
                        castCertificateList.map((type, index) => (
                          <MenuItem key={index} value={language === "en" ? type.documentChecklistEn : type.documentChecklistMr}>
                             {language === "en" ? type.documentChecklistEn : type.documentChecklistMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="castCertificateKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.castCertificateKey ? errors.castCertificateKey.message : null}
                </FormHelperText>
              </FormControl>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <UploadButton
                  appName="EBP"
                  serviceName="EBP-NewConnection"
                  filePath={(path)=>{handleUploadDocument(path,'castCertificate')}}
                  fileName={castCertificate?.documentPath}
                />
              </Grid>
            </Grid>

            {/* Only For Industrial Connection */}

            {/* Statutory And Regulatory Permission */}
            <h4 style={{ marginTop: "20px" }}>
              <b>Remark :</b>
            </h4>
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <label style={{ textAlign: "left" }}>
                  <b> 1. Required Statutory & regulatory permission is to be submitted.</b>
                </label>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <UploadButton
                  appName="EBP"
                  serviceName="EBP-NewConnection"
                  filePath={handleUploadDocument}
                  fileName={allDocuments.length>5 && allDocuments[4].documentPath}
                />
              </Grid>
            </Grid>

            {/* Industrial Registration */}
            <label style={{ marginLeft: "8px" }}>
              <b>2. For industrial connection purpose following additional documents required:</b>
            </label>
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <label style={{ textAlign: "left" }}>a. Industrial Registration / DIC Certificate</label>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <UploadButton
                  appName="EBP"
                  serviceName="EBP-NewConnection"
                  filePath={handleUploadDocument}
                  fileName={allDocuments.length>5 && allDocuments[5].documentPath}
                />
              </Grid>
            </Grid>

            {/* Sheet For Load profile */}
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <label style={{ textAlign: "left" }}>b. Separate sheet for Load profile</label>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <UploadButton
                  appName="EBP"
                  serviceName="EBP-NewConnection"
                  filePath={handleUploadDocument}
                  fileName={allDocuments.length>6 && allDocuments[6].documentPath}
                />
              </Grid>
            </Grid>
          </Grid>
  
              {/* view generated forms */}
              <Grid container rowSpacing={2} columnSpacing={1} sx={{ paddingLeft: "110px", paddingTop: "40px" }}>
  
                {/* Demand Letter */}
  
                <Grid
                  item
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Grid item xl={10}
                    lg={10}
                    md={10}
                    sm={10}
                    xs={10}>
                    <label >Demand Letter</label>
                  </Grid>
                  <Grid item xl={2}
                    lg={2}
                    md={2}
                    sm={2}
                    xs={2}>
                        {
                            generateDemandLetterFlag ? 
                            <Button variant="contained" onClick={generateDemandLetter}>
                      Generate
                    </Button>
                    :
                    <Button variant="contained" onClick={generateDemandLetter}>
                      View
                    </Button>
                        }
                  </Grid>
                </Grid>
  
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
                        <h3>Demand Letter Generated</h3>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              </div>
  
              {/* Button Row */}
  
              <Grid container mt={5} border px={5}>
                {/* Save ad Draft */}
  
                <Grid container>
  
                  {
  
                      <Grid item xl={4}
                        lg={4}
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
  
                    
                  }
  
                  <Grid item xl={4}
                    lg={4}
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
                      {/* {<FormattedLabel id="clear" />} */}
                    </Button>
                  </Grid>
  
                  <Grid item xl={4}
                    lg={4}
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
                      {/* {<FormattedLabel id="exit" />} */}
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
  