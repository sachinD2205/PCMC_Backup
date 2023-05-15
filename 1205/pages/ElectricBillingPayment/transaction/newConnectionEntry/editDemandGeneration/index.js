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
  import moment, { lang } from "moment";
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
        getZoneWiseWard(_res?.departmentKey, _res?.zoneKey);
        setValue("wardKey", _res?.wardKey ? _res?.wardKey : "-");
        setValue("departmentKey", _res?.departmentKey ? _res?.departmentKey : "-")
        setValue("consumerName", _res?.consumerName ? _res?.consumerName : "-");
        setValue("consumerAddress", _res?.consumerAddress ? _res?.consumerAddress : "-");
        setValue("consumerNameMr", _res?.consumerNameMr ? _res?.consumerNameMr : "-");
        setValue("consumerAddressMr", _res?.consumerAddressMr ? _res?.consumerAddressMr : "-");
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
        setAllDocuments(_res?.transactionDocumentsList);
        setValue("aOneFormKey",_res?.transactionDocumentsList ? _res?.transactionDocumentsList.find((obj)=> obj.documentKey === 6)?.remark : "-");
        setValue("proofOfOwnershipKey", _res?.transactionDocumentsList ? _res?.transactionDocumentsList.find((obj)=> obj.documentKey === 7)?.remark : "-");
        setValue("identyProofKey", _res?.transactionDocumentsList ? _res?.transactionDocumentsList.find((obj)=> obj.documentKey === 3)?.remark : "-");
        setValue("castCertificateKey", _res?.transactionDocumentsList ? _res?.transactionDocumentsList.find((obj)=> obj.documentKey === 8)?.remark : "-");
    }, [editData, language]);
  
  
  
    useEffect(() => {
      // getNewConnectionsData();
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
    const getZoneWiseWard = (deptId, zone_id) => {
      axios
        .get(`${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`, {
          params: {
            departmentId: deptId,
            zoneId: zone_id,
          },
        })
        .then((res) => {
          setWard(res.data);
        });
    };
  
    // get Department Name
    const getDepartment = () => {
      axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
        setDepartment(res.data.department);
      });
    };
  
    // get Zone Name
    const getZone = () => {
      axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
        setZone(res.data.zone);
      });
    };
  
    // get Consumption Type
    const getConsumptionType = () => {
      axios.get(`${urls.EBPSURL}/mstConsumptionType/getAll`).then((res) => {
        setConsumptionType(res.data.mstConsumptionTypeList);
      });
    };
  
    // get Load Type
    const getLoadType = () => {
      axios.get(`${urls.EBPSURL}/mstLoadType/getAll`).then((res) => {
        setLoadType(res.data.mstLoadTypeList);
      });
    };
  
    // get Phase Type
    const getPhaseType = () => {
      axios.get(`${urls.EBPSURL}/mstPhaseType/getAll`).then((res) => {
        setPhaseType(res.data.mstPhaseTypeList);
      });
    };
  
    // get Slab Type
    const getSlabType = () => {
      axios.get(`${urls.EBPSURL}/mstSlabType/getAll`).then((res) => {
        setSlabType(res.data.mstSlabTypeList);
      });
    };
  
    // get Usage Type
    const getUsageType = () => {
      axios.get(`${urls.EBPSURL}/mstEbUsageType/getAll`).then((res) => {
        setUsageType(res.data.mstEbUsageTypeList);
      });
    };
  
    // get Msedcl Category  
    const getMsedclCategory = () => {
      axios.get(`${urls.EBPSURL}/mstMsedclCategory/getAll`).then((res) => {
        setMsedclCategory(res.data.mstMsedclCategoryList);
      });
    };
  
    // get Billing Division And Unit 
    const getBillingDivisionAndUnit = () => {
      axios.get(`${urls.EBPSURL}/mstBillingUnit/getAll`).then((res) => {
        let temp = res.data.mstBillingUnitList;
        setBillingDivisionAndUnit(temp.map((each) => {
          return {
            id: each.id,
            billingDivisionAndUnit: `${each.divisionName}/${each.billingUnit}`,
            billingDivisionAndUnitMr: `${each.divisionNameMr}/${each.billingUnit}`
          }
        }));
  
      });
    };
  
    // get SubDivision
    const getSubDivision = () => {
      axios.get(`${urls.EBPSURL}/mstSubDivision/getAll`).then((res) => {
        setSubDivision(res.data.mstSubDivisionList);
      });
    };
  
    // get Department Category
    const getDepartmentCategory = () => {
      axios.get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`).then((res) => {
        setDepartmentCategory(res.data.mstDepartmentCategoryList);
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
  
          let temp = result.find((obj) => obj.id == router.query.id)
          setEditData(temp);
          setAOneForm(temp?.transactionDocumentsList && temp?.transactionDocumentsList.find((obj)=> obj.documentKey === 6))
          setProofOfOwnership(temp?.transactionDocumentsList && temp?.transactionDocumentsList.find((obj)=> obj.documentKey === 7))
          setIdentyProof(temp?.transactionDocumentsList && temp?.transactionDocumentsList.find((obj)=> obj.documentKey === 3))
          setCastCertificate(temp?.transactionDocumentsList && temp?.transactionDocumentsList.find((obj)=> obj.documentKey === 8))
        });
  
    };

    const handleUploadDocument = (path,type) =>{
      if(type === "aOneForm"){
        let temp = {
          documentPath: path,
          documentKey : 6,
          documentType : "",
          remark : watch('aOneFormKey'),
        }
      setAllDocuments([...allDocuments, temp])
      }
      else if(type === "proofOfOwnership"){
        let temp = {
          documentPath: path,
          documentKey :  7,
          documentType : "",
          remark : watch('proofOfOwnershipKey'),
        }
      setAllDocuments([...allDocuments, temp])
      }
      else if(type === "identyProof"){
        let temp = {
          documentPath: path,
          documentKey : 3,
          documentType : "",
          remark :  watch('identyProofKey'),
        }
      setAllDocuments([...allDocuments, temp])
      }
      else if(type === "castCertificate"){
        let temp = {
          documentPath: path,
          documentKey : 8,
          documentType : "",
          remark :  watch('castCertificateKey'),
        }
      setAllDocuments([...allDocuments, temp])
      }
      else if(type === "statutoryNote"){
        let temp = {
          documentPath: path,
          documentKey : 79,
          documentType : "",
          remark : "",
        }
      setAllDocuments([...allDocuments, temp])
      }
      else if(type === "industrialCertificate"){
        let temp = {
          documentPath: path,
          documentKey : 80,
          documentType : "",
          remark : "",
        }
      setAllDocuments([...allDocuments, temp])
      }
      else if(type === "loadProfileSheet"){
        let temp = {
          documentPath: path,
          documentKey : 81,
          documentType : "",
          remark : "",
        }
      setAllDocuments([...allDocuments, temp])
      }
    }
  
    const onSubmitForm = (formData) => {
  
      let _formData = {...editData, ...formData };
      console.log("update dg")
  
      // Save - DB
      let _body = {
        ..._formData,
        transactionDocumentsList: allDocuments,
        activeFlag: _formData.activeFlag,
      };
      if (btnSaveText === "Save") {
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
            <FormattedLabel id="editDemandGeneration" />
          </h2>
        </Box>
  
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            {/* Firts Row */}
            <Grid container sx={{ padding: "10px" }}>

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
                    <FormattedLabel id="deptName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        // sx={{ width: 200 }}
                        value={field.value}
                        {...register("departmentKey")}
                        label={<FormattedLabel id="deptName" />}
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
                              {language == "en" ? dept.department : dept.departmentMr}
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
                    {<FormattedLabel id="zone" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          getZoneWiseWard(watch("departmentKey"), value.target.value);
                        }}
                        label={<FormattedLabel id="zone" />}
                      >
                        {zone &&
                          zone.map((each, index) => (
                            <MenuItem key={index} value={each.id}>
                              {language == "en" ? each.zoneName : each.zoneNameMr}
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
                  {<FormattedLabel id="ward" />}
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
                              {language == "en" ? wa.wardName : wa.wardNameMr}
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
                  label={<FormattedLabel id="consumerName" />}
                  sx={{ m: 1, minWidth: '50%' }}
                  variant="standard"
                  {...register("consumerName")}
                  error={!!errors.consumerName}
                  helperText={
                    errors?.consumerName ? errors.consumerName.message : null
                  }
                InputLabelProps={{
                    //true
                    shrink:
                        (watch("consumerName") ? true : false) ||
                        (router.query.consumerName ? true : false),
                }}
                />
              </Grid>

                {/* Consumer Name Mr */}

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
                label={<FormattedLabel id="consumerNameMr" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                {...register("consumerNameMr")}
                error={!!errors.consumerNameMr}
                helperText={errors?.consumerNameMr ? errors.consumerNameMr.message : null}
                InputLabelProps={{
                    //true
                    shrink:
                        (watch("consumerNameMr") ? true : false) ||
                        (router.query.consumerNameMr ? true : false),
                }}
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
                  label={<FormattedLabel id="consumerAddress" />}
                  sx={{ m: 1, minWidth: '50%' }}
                  multiline
                  variant="standard"
                  {...register("consumerAddress")}
                  error={!!errors.consumerAddress}
                  helperText={
                    errors?.consumerAddress ? errors.consumerAddress.message : null
                  }
                InputLabelProps={{
                    //true
                    shrink:
                        (watch("consumerAddress") ? true : false) ||
                        (router.query.consumerAddress ? true : false),
                }}
                />
              </Grid>

                {/*Consumer Address Mr */}

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
                label={<FormattedLabel id="consumerAddressMr" />}
                sx={{ m: 1, minWidth: "50%" }}
                multiline
                variant="standard"
                {...register("consumerAddressMr")}
                error={!!errors.consumerAddressMr}
                helperText={errors?.consumerAddressMr ? errors.consumerAddressMr.message : null}
                InputLabelProps={{
                    //true
                    shrink:
                        (watch("consumerAddressMr") ? true : false) ||
                        (router.query.consumerAddressMr ? true : false),
                }}
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
                  label={<FormattedLabel id="pincode" />}
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
                  {<FormattedLabel id="consumptionType" />}
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
                              {language == "en" ? type.consumptionType : type.consumptionTypeMr}
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
                  {<FormattedLabel id="loadType" />}
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
                              {language == "en" ? type.loadType : type.loadTypeMr}
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
                  {<FormattedLabel id="phaseType" />}
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
                              {language == "en" ? type.phaseType : type.phaseTypeMr}
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
                  {<FormattedLabel id="slabType" />}
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
                              {language == "en" ? type.slabType : type.slabTypeMr}
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
                  {<FormattedLabel id="ebUsageType" />}
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
                              {language == "en" ? type.usageType : type.usageTypeMr}
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
                  {<FormattedLabel id="msedclCategory" />}
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
                              {language == "en" ? type.msedclCategory : type.msedclCategoryMr}
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
                  {<FormattedLabel id="billingUnitAndDivision" />}
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
                              {language == "en" ? type.billingDivisionAndUnit : type.billingDivisionAndUnitMr}
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
                  {<FormattedLabel id="subDivision" />}
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
                              {language == "en" ? type.subDivision : type.subDivisionMr}
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
                  {<FormattedLabel id="departmentCategory" />}
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
                              {language == "en" ? type.departmentCategory : type.departmentCategoryMr}
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

              </Grid>

                  {/* Attachment */}

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
            <h2>
              <FormattedLabel id="attachRequiredDocumemts" />
            </h2>
          </Box>


          <Grid
            container
            rowSpacing={2}
            columnSpacing={1}
            sx={{ paddingLeft: "110px" }}
            className={styles.attachmentContainer}
          >
            <h4 style={{ marginTop: "40px" }}>
            <FormattedLabel id="attachDocumentsNote" />
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
                  <b> <FormattedLabel id="aOneForm" /></b>
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
                  {<FormattedLabel id="purpose" />}
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
              {aOneForm ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${aOneForm?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained"><FormattedLabel id="view" /></Button>
                    </a>
                  ) : (
                    <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={(path)=>{handleUploadDocument(path,'aOneForm')}}
                    fileName={allDocuments?.length>0 && allDocuments[0]?.documentPath}
                  />
                  )}
             
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
                  <b><FormattedLabel id="proofOfOwnership" /></b>
                </label>

                <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "75%", wordBreak:'break-word'}}
                error={!!errors.proofOfOwnershipKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="selectNote" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      sx={{ wordBreak:'break-word' }}
                      value={field.value}
                      {...register("proofOfOwnershipKey")}
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
              {proofOfOwnership ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${proofOfOwnership?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained"><FormattedLabel id="view" /></Button>
                    </a>
                  ) : (
                    <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={(path)=>{handleUploadDocument(path,'proofOfOwnership')}}
                    fileName={allDocuments?.length>1 && allDocuments[1]?.documentPath}
                  />
                  )}
  
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
                  <b><FormattedLabel id="identyProof" /></b>{" "}
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
                {<FormattedLabel id="selectNote" />}
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
              {identyProof ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${identyProof?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained"><FormattedLabel id="view" /></Button>
                    </a>
                  ) : (
                    <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={(path)=>{handleUploadDocument(path,'identyProof')}}
                    fileName={allDocuments?.length>2 && allDocuments[2]?.documentPath}
                  />
                  )}
              
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
                  <b>      {<FormattedLabel id="castCert" />}</b>{" "}
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
                {<FormattedLabel id="ifApplicable" />}
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
              {castCertificate ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${castCertificate?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained"><FormattedLabel id="view" /></Button>
                    </a>
                  ) : (
                    <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={(path)=>{handleUploadDocument(path,'castCertificate')}}
                    fileName={allDocuments?.length>3 && allDocuments[3]?.documentPath}
                  />
                  )}
              
              </Grid>
            </Grid>

            {/* Only For Industrial Connection */}

            {/* Statutory And Regulatory Permission */}
            <h4 style={{ marginTop: "20px" }}>
              <b>    {<FormattedLabel id="remark" />} :</b>
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
                  <b>{<FormattedLabel id="statutoryNote" />}</b>
                </label>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              {statuatoryAndRegulatoryPermission ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${statuatoryAndRegulatoryPermission?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained"><FormattedLabel id="view" /></Button>
                    </a>
                  ) : (
                    <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={(path)=>{handleUploadDocument(path,'statutoryNote')}}
                    fileName={allDocuments?.length>4 && allDocuments[4]?.documentPath}
                  />
                  )}
               
              </Grid>
            </Grid>

            {/* Industrial Registration */}
            <label style={{ marginLeft: "8px" }}>
              <b>{<FormattedLabel id="industrialPurposeNote" />}</b>
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
                <label style={{ textAlign: "left" }}>{<FormattedLabel id="industrialCertificate" />}</label>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              {industrialRegistration ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${industrialRegistration?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained"><FormattedLabel id="view" /></Button>
                    </a>
                  ) : (
                    <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={(path)=>{handleUploadDocument(path,'industrialCertificate')}}
                    fileName={allDocuments?.length>5 && allDocuments[5]?.documentPath}
                  />
                  )}
               
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
                <label style={{ textAlign: "left" }}>  {<FormattedLabel id="loadProfileNote" />}</label>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              {loadProfileSheet ? (
                    <a
                      href={`${urls.CFCURL}/file/preview?filePath=${loadProfileSheet?.documentPath}`}
                      target="__blank"
                    >
                      <Button variant="contained"><FormattedLabel id="view" /></Button>
                    </a>
                  ) : (
                    <UploadButton
                    appName="EBP"
                    serviceName="EBP-NewConnection"
                    filePath={(path)=>{handleUploadDocument(path,'loadProfileSheet')}}
                    fileName={allDocuments?.length>6 && allDocuments[6]?.documentPath}
                  />
                  )}
             
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
                    <label >   {<FormattedLabel id="demandLetter" />}</label>
                  </Grid>
                  <Grid item xl={2}
                    lg={2}
                    md={2}
                    sm={2}
                    xs={2}>
                        {
                            generateDemandLetterFlag ? 
                            <Button variant="contained" onClick={generateDemandLetter}>
                        {<FormattedLabel id="generate" />}
                    </Button>
                    :
                    <Button variant="contained" onClick={generateDemandLetter}>
                        {<FormattedLabel id="view" />}
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
                          {<FormattedLabel id="update" />}
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
                      {<FormattedLabel id="clear" />}
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
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Grid>
  
                </Grid>
              </Grid>
  
          </form>
        </FormProvider>
  
      </Paper>
    );
  };
  
  export default Index;
  