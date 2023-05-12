import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/demandGenerationSchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import { useDispatch, useSelector } from "react-redux";
import styles from "./view.module.css";
import UploadButton from "../../../../../components/ElectricBillingComponent/uploadDocument/uploadButton";

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
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const router = useRouter();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [generateDemandLetterFlag, setGenerateDemandLetterFlag] = useState(true);
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
  const [aOneForm, setAOneForm] = useState();
  const [proofOfOwnership, setProofOfOwnership] = useState();
  const [identyProof, setIdentyProof] = useState();
  const [castCertificate, setCastCertificate] = useState();
  const [statuatoryAndRegulatoryPermission, setStatuatoryAndRegulatoryPermission] = useState();
  const [industrialRegistration, setIndustrialRegistration] = useState();
  const [loadProfileSheet, setLoadProfileSheet] = useState();
  const [allDocuments, setAllDocuments] = useState([]);
  const [mediaKey, setMediaKey] = useState(1)
  const [docRemark, setDocRemark] = useState("")
  const [buttonInputState, setButtonInputState] = useState();
  const [approvalFlag, setApprovalFlag] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [id, setId] = useState(router.query.id);
  const [fetchData, setFetchData] = useState(null);
  const [entryConnectionId, setEntryConnectionId] = useState(null);
  const [editData, setEditData] = useState({});

  let tableData = [];
  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  console.log("language", language);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  // console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  // console.log("authority", authority);

  useEffect(() => {
    // getNewConnectionsData();
    getDepartment();
    getConsumptionType();
    getBillingDivisionAndUnit();
  }, [window.location.reload]);

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
      setAOneForm(res.data && res.data.filter((obj)=> obj.usageType === 6))
      setProofOfOwnership(res.data && res.data.filter((obj)=> obj.usageType === 7))
      setIdentyProof(res.data && res.data.filter((obj)=> obj.usageType === 3))
      setCastCertificate(res.data && res.data.filter((obj)=> obj.usageType === 8))
    });
  }


  // get Ward Name
  const getZoneWiseWard = (deptId, zone_id) => {
    console.log("zoneId", deptId, zone_id.target.value);
    axios
      .get(`${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`, {
        params: {
          departmentId: deptId,
          zoneId: zone_id.target.value,
        },
      })
      .then((res) => {
        setWard(res.data);
        console.log("getZoneWiseWard", res.data);
      });
  };

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
      console.log("getDepartment.data", r.data);
      setDepartment(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
          departmentMr: row.departmentMr
        })),
      );
    
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
      setBillingDivisionAndUnit(
        temp.map((each) => {
          return {
            id: each.id,
            billingDivisionAndUnit: `${each.divisionName}/${each.billingUnit}`,
            billingDivisionAndUnitMr: `${each.divisionNameMr}/${each.billingUnit}`,
          };
        }),
      );
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
  }, [id]);

  // Get Table - Data
  const getNewConnectionsData = () => {
    axios
      .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.trnNewConnectionEntryList;
        console.log("result", result);

        let temp = result.find((obj) => obj.id == id);
        setEditData(temp);
      });
  };

  const handleUploadDocument = (path,type) =>{
    console.log("path",path, type);
    if(type === "aOneForm"){
      let temp = {
        documentPath: path,
        documentKey : 6,
        documentType : "",
        remark : watch('aOneFormKey'),
      }
    setAllDocuments([...allDocuments, temp])
    setDocRemark("");
    }
    else if(type === "proofOfOwnership"){
      let temp = {
        documentPath: path,
        documentKey :  7,
        documentType : "",
        remark : watch('proofOfOwnershipKey'),
      }
    setAllDocuments([...allDocuments, temp])
    setDocRemark("");
    }
    else if(type === "identyProof"){
      let temp = {
        documentPath: path,
        documentKey : 3,
        documentType : "",
        remark :  watch('identyProofKey'),
      }
    setAllDocuments([...allDocuments, temp])
    setDocRemark("");
    }
    else if(type === "castCertificate"){
      let temp = {
        documentPath: path,
        documentKey : 8,
        documentType : "",
        remark :  watch('castCertificateKey'),
      }
    setAllDocuments([...allDocuments, temp])
    setDocRemark("");
    }
  }

  const onSubmitForm = (formData) => {
  
    let _formData = { ...formData };

    // Save - DB
    let _body = {
      ..._formData,
      transactionDocumentsList: allDocuments,
      activeFlag: "Y",
    };

    console.log("_body",_body)

    if (btnSaveText === "Save") {
      console.log("Save New COnnection ............ 4");
      const tempData = axios
        .post(`${urls.EBPSURL}/trnNewConnectionEntry/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "New Connection Saved successfully !", "success");
            getNewConnectionsData();
            setButtonInputState(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            router.push("/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry");
          }
        });
    }
  };

  const generateDemandLetter = () => {
    setGenerateDemandLetterFlag(false);
    handleOpen();
  };

  // Exit Button
  const handleExitButton = () => {
    reset({
      ...resetValuesForClear,
      id: null,
    });
    setButtonInputState(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    router.push(`/ElectricBillingPayment/transaction/newConnectionEntry/newConnectionEntry`);
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
        remark: "",
      },
    ],
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
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="demandGenerationHeading" />
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.departmentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {<FormattedLabel id="deptName" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      // sx={{ width: 200 }}
                      // value={departmentName}
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
                        department.map((department, index) => (
                          <MenuItem key={index} value={department.id}>
                            {language == "en" ? department.department : department.departmentMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="departmentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.departmentKey ? errors.departmentKey.message : null}</FormHelperText>
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.zoneKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
                  {<FormattedLabel id="zone" />}
                </InputLabel>
                <Controller
                  name="zoneKey"
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      // sx={{ width: 200 }}
                      value={field.value}
                      // {...field}
                      onChange={(value) => {
                        console.log("called");
                        field.onChange(value);
                        getZoneWiseWard(watch("departmentKey"), value);
                      }}
                      // {...register("zoneKey")}

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
                            {language == "en" ? each.zoneName : each.zoneNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
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
                sx={{ m: 1, minWidth: "50%" }}
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
                <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
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
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                {...register("consumerName")}
                error={!!errors.consumerName}
                helperText={errors?.consumerName ? errors.consumerName.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label={<FormattedLabel id="consumerAddress" />}
                sx={{ m: 1, minWidth: "50%" }}
                multiline
                variant="standard"
                {...register("consumerAddress")}
                error={!!errors.consumerAddress}
                helperText={errors?.consumerAddress ? errors.consumerAddress.message : null}
                // InputLabelProps={{
                //     //true
                //     shrink:
                //         (watch("label2") ? true : false) ||
                //         (router.query.label2 ? true : false),
                // }}
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
                label={<FormattedLabel id="pincode" />}
                sx={{ m: 1, minWidth: "50%" }}
                variant="standard"
                {...register("pinCode")}
                error={!!errors.pinCode}
                helperText={errors?.pinCode ? errors.pinCode.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.consumptionTypeKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
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
                          <MenuItem key={index} value={type.id}>
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
                  {errors?.consumptionTypeKey ? errors.consumptionTypeKey.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.loadTypeKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
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
                          <MenuItem key={index} value={type.id}>
                            {language == "en" ? type.loadType : type.loadTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="loadTypeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.loadTypeKey ? errors.loadTypeKey.message : null}</FormHelperText>
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.phaseKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
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
                          <MenuItem key={index} value={type.id}>
                            {language == "en" ? type.phaseType : type.phaseTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="phaseKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.phaseKey ? errors.phaseKey.message : null}</FormHelperText>
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.slabTypeKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
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
                          <MenuItem key={index} value={type.id}>
                            {language == "en" ? type.slabType : type.slabTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="slabTypeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.slabTypeKey ? errors.slabTypeKey.message : null}</FormHelperText>
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.usageTypeKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
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
                      label={<FormattedLabel id="ebUsageType" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {usageType &&
                        usageType.map((type, index) => (
                          <MenuItem key={index} value={type.id}>
                              {language == "en" ? type.usageType : type.usageTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="usageTypeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.usageTypeKey ? errors.usageTypeKey.message : null}</FormHelperText>
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.msedclCategoryKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
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
                          <MenuItem key={index} value={type.id}>
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
                  {errors?.msedclCategoryKey ? errors.msedclCategoryKey.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.billingUnitKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
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
                      label={<FormattedLabel id="billingUnitAndDivision" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {billingDivisionAndUnit &&
                        billingDivisionAndUnit.map((type, index) => (
                          <MenuItem key={index} value={type.id}>
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
                  {errors?.billingUnitKey ? errors.billingUnitKey.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.subDivisionKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
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
                          <MenuItem key={index} value={type.id}>
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
                  {errors?.subDivisionKey ? errors.subDivisionKey.message : null}
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
                sx={{ m: 1, minWidth: "50%" }}
                error={!!errors.departmentCategoryKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {/* Location Name */}
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
                          <MenuItem key={index} value={type.id}>
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
                  {errors?.departmentCategoryKey ? errors.departmentCategoryKey.message : null}
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
                <b>
            <FormattedLabel id="aOneForm" />
                 </b>
                </label>

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
                      {aOneForm &&
                        aOneForm.map((type, index) => (
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
                  fileName={allDocuments.length>0 && allDocuments[0].documentPath}
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
                <b>
            <FormattedLabel id="proofOfOwnership" />
                  </b>
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
                      {proofOfOwnership &&
                        proofOfOwnership.map((type, index) => (
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
                  fileName={allDocuments.length>1 && allDocuments[1].documentPath}
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
                  <b>
                  {<FormattedLabel id="identyProof" />}
                    </b>{" "}
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
                      {identyProof &&
                        identyProof.map((type, index) => (
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
                  fileName={allDocuments.length>2 && allDocuments[2].documentPath}
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
                  <b>
                  {<FormattedLabel id="castCert" />}
                    </b>{" "}
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
                      {castCertificate &&
                        castCertificate.map((type, index) => (
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
                  fileName={allDocuments.length>3 && allDocuments[3].documentPath}
                />
              </Grid>
            </Grid>

            {/* Only For Industrial Connection */}

            {/* Statutory And Regulatory Permission */}
            <h4 style={{ marginTop: "20px" }}>
            <b>
            {<FormattedLabel id="remark" />}
             :</b>
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
                <b>
                {<FormattedLabel id="statutoryNote" />}
                 </b>
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
            <b>
            {<FormattedLabel id="industrialPurposeNote" />}            
             </b>
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
                <label style={{ textAlign: "left" }}>
                {<FormattedLabel id="industrialCertificate" />}
                  </label>
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
                <label style={{ textAlign: "left" }}>
                {<FormattedLabel id="loadProfileNote" />}
                  </label>
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
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px", 
              marginTop: "20px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="generateForms" />
            </h2>
          </Box>

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
              }}
            >
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <label>
                {<FormattedLabel id="demandLetter" />}
                 </label>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button variant="contained" onClick={generateDemandLetter}>
                {<FormattedLabel id="generate" />}
                </Button>
              </Grid>
            </Grid>

            {/* Button Row */}

            <Grid container mt={5} border px={5}>
              {/* Save ad Draft */}

              <Grid container>
                {btnSaveText === "Update" ? (
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
                    <Button type="Submit" variant="contained">
                      {<FormattedLabel id="update" />}
                    </Button>
                  </Grid>
                ) : (
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
                    <Button
                      variant="contained"
                      type="Submit"
                      disabled={generateDemandLetterFlag ? true : false}
                    >
                      {<FormattedLabel id="sendToDy" />}
                    </Button>
                  </Grid>
                )}

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
                  <Button onClick={handleClearButton} variant="contained">
                    
                    {<FormattedLabel id="clear" />}
                  </Button>
                </Grid>

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
                  <Button variant="contained" onClick={handleExitButton}>
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Grid>
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
                    <h3>Demand Letter Generated</h3>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </div>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;

