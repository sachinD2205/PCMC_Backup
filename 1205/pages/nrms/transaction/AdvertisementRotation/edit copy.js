// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useDispatch } from "react-redux";
import moment from "moment";
import { EyeFilled } from "@ant-design/icons";
import CheckIcon from "@mui/icons-material/Check";
// import UploadButton from "../../../../containers/reuseableComponents/UploadButton";
import UploadButton from "../../../../containers/NRMS_ReusableComponent/UploadButton";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";

import {
  Box,
  Divider,
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
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "./index.module.css";
// import styles from "../../../../../styles/ElectricBillingPayment_Styles/subDivision.module.css";

// import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/subDivisionSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/NRMS_ReusableComponent/FormattedLable";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { setApprovalOfNews } from "../../../../features/userSlice";
import { Label, Update } from "@mui/icons-material";
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseStages, setCaseStages] = useState([]);
  const [caseEntry, setCaseEntry] = useState([]);
  const [allTabelData, setAllTabelData] = useState([]);
  const [ward, setWard] = useState([]);
  const [rotationGroup, setRotationGroup] = useState([]);
  const [subGroup, setSubGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [parameterName, setParameterName] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [number, setNumber] = useState("");
  const [aOneForm, setAOneForm] = useState();
  const [newsRequest, setNewsRequest] = useState("");
  const [newsLevel, setNewsLevel] = useState("");
  const [newsRequestDoc, setNewsRequestDoc] = useState("");
  const [zone, setZone] = useState("");
  const [image, setImage] = useState();
  const [selectedObject, setSelectedObject] = useState();
  const [valueData, setValueData] = useState();
  const [updateData, setUpdateData] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);
  const [rotationSubGroup, setRotationSubGroup] = useState();
  const [isdisabled, setIsDisabled] = useState();
  const [wardKeys, setWardKeys] = useState([]);
  const [editData, setEditData] = useState({});
  const { inputData, setInputData } = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();

  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  // const [slideChecked, setSlideChecked] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const user = useSelector((state) => state.user.user);
  console.log("user", user);
  // selected menu from drawer
  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);
  const getAllEditTableData = (id) => {
    axios.get(`${urls.NRMS}/trnNewsPublishRequest/getById?id=${id}`).then((_res) => {
      console.log("editData", _res.data);
      setValueData(_res.data);
      setValue("zoneName", _res?.data.zoneName ? _res?.data.zoneName : "-");
      setValue("departmentName", _res?.data.departmentName ? _res?.data.departmentName : "-");
      setValue("priority", _res?.data.priority ? _res?.data.priority : "-");
      setValue(
        "newsAdvertisementDescription",
        _res?.data.newsAdvertisementDescription ? _res?.data.newsAdvertisementDescription : "-",
      );
      setValue("fromDate", _res?.data.fromDate ? _res?.data.fromDate : "-");
      setValue(
        "newsAdvertisementSubject",
        _res?.data.newsAdvertisementSubject ? _res?.data.newsAdvertisementSubject : "-",
      );
      setValue("newsAttachement", _res?.data.newsAttachement ? _res?.data.newsAttachement : "-");

      setValue("newsPaperLevel", _res?.data.newsPaperLevel ? _res?.data.newsPaperLevel : "-");

      setValue("rotationGroupKey", _res?.data.rotationGroupKey ? _res?.data.rotationGroupKey : "-");

      setSubGroup([rotationSubGroup.filter((r) => r.rotationGroupKey == _res?.data.rotationGroupKey)]);

      setValue("rotationSubGroupKey", _res?.data.rotationSubGroupKey ? _res?.data.rotationSubGroupKey : "-");

      setNewsLevel([newsPaper?.filter((val) => val?.rotationSubGroupKey == _res.data.rotationSubGroupKey)]);
      //
      setValue("standardFormatSize", _res?.data.standardFormatSize ? _res?.data.standardFormatSize : "-");
      setValue("typeOfNews", _res?.data.typeOfNews ? _res?.data.typeOfNews : "-");
      setValue("workName", _res?.data.workName ? _res?.data.workName : "-");
      setValue("newsRequest", _res?.data.newsAttachement ? _res?.data.newsAttachement : "-");
      setValue("attachement", _res?.data.attachement ? _res?.data.attachement : "-");
      setNewsRequest(_res?.data.attachement);
      setNewsRequestDoc(_res?.data.newsAttachement);
    });
  };

  // useEffect(() => {
  //     console.log("valueData", valueData)
  //     let _res = valueData;
  //     console.log("editData", valueData)
  //     if (btnSaveText === "Update") {
  //         setValue("zoneName", _res?.zoneName ? _res?.zoneName : "-");
  //         setValue("departmentName", _res?.departmentName ? _res?.departmentName : "-")
  //         setValue("priority", _res?.priority ? _res?.priority : "-");
  //         setValue("newsAdvertisementDescription", _res?.newsAdvertisementDescription ? _res?.newsAdvertisementDescription : "-");
  //         setValue("fromDate", _res?.fromDate ? _res?.fromDate : "-");
  //         setValue("newsAdvertisementSubject", _res?.newsAdvertisementSubject ? _res?.newsAdvertisementSubject : "-");
  //         setValue("newsAttachement", _res?.newsAttachement ? _res?.newsAttachement : "-");
  //         // setValue("newsPaperLevel", _res?.newsPaperLevel ? _res?.newsPaperLevel : "-");
  //         setValue("rotationGroupKey", _res?.rotationGroupKey ? _res?.rotationGroupKey : "-");
  //         setValue("rotationSubGroupKey", _res?.rotationSubGroupKey ? _res?.rotationSubGroupKey : "-");
  //         // setValue("standardFormatSize", _res?.standardFormatSize ? _res?.standardFormatSize : "-");
  //         setValue("typeOfNews", _res?.typeOfNews ? _res?.typeOfNews : "-");
  //         setValue("workName", _res?.workName ? _res?.workName : "-");
  //         setValue("newsRequest", _res?.newsAttachement ? _res?.newsAttachement : "-");
  //         setValue("attachement", _res?.attachement ? _res?.attachement : "-");
  //     }
  // }
  //     , [valueData]);

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartment(res.data.department);
      // console.log("res.data", r.data);
    });
  };
  // Rotation Group
  const getRotationGroup = () => {
    axios.get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`).then((r) => {
      console.log(
        "a:a",
        r.data.newspaperRotationGroupMasterList.map((row) => ({
          rotationGroupKey: row.rotationGroupKey,
        })),
      );
      setRotationGroup(
        r.data.newspaperRotationGroupMasterList.map((row) => ({
          id: row.id,
          rotationGroupName: row.rotationGroupName,
          groupId: row.groupId,
          rotationGroupKey: row.rotationGroupKey,
        })),
      );
      // console.log("res.data", r.data);
    });
  };

  // Rotation Sub Group

  const getRotationSubGroup = () => {
    axios.get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getAll`).then((r) => {
      console.log(
        "subGrssssoup",
        r.data.newspaperRotationSubGroupMasterList.map((row) => ({
          rotationSubGroupName: row.rotationSubGroupName,
          rotationGroupKey: row.rotationGroupKey,
          rotationSubGroupKey: row.rotationSubGroupKey,
        })),
      );
      setRotationSubGroup(
        r.data.newspaperRotationSubGroupMasterList.map((row) => ({
          id: row.id,
          rotationGroupName: row.rotationGroupName,
          rotationSubGroupName: row.rotationSubGroupName,

          rotationGroupKey: row.rotationGroupKey,
          rotationSubGroupKey: row.rotationSubGroupKey,
        })),
      );
    });
  };
  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(res.data.zone);
      console.log("getZone.data", res.data);
    });
  };
  // get Ward Name
  const getWard = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      setWardKeys(res.data.ward);
      console.log("res.data", res.data);
    });
  };
  const getNewsPaper = () => {
    // console.log("wafeg", groupId, subGroupId)
    // getByGroupSubGroupId?groupId=1&subGroupId=1
    // const subUrl = groupId && subGroupId ? `newspaperMaster/getByGroupSubGroupId?groupId=${groupId}&subGroupId=${subGroupId}` : `newspaperMaster/getAll`;
    axios.get(`${urls.NRMS}/newsStandardFormatSizeMst/getAll`).then((r) => {
      console.log(
        "dfgh",
        r?.data?.newsStandardFormatSizeMstList?.map((r, i) => ({
          id: r.id,
          newspaperLevel: r.newspaperLevel,
          standardFormatSize: r.standardFormatSize,
          rotationGroupKey: r.rotationGroupKey,
          rotationSubGroupKey: r.rotationSubGroupKey,
        })),
      );
      setNewsPaper(
        r?.data?.newsStandardFormatSizeMstList?.map((r, i) => ({
          id: r.id,
          newspaperLevel: r.newspaperLevel,
          subGroupId: r.subGroupId,
          rotationGroupKey: r.rotationGroupKey,
          rotationSubGroupKey: r.rotationSubGroupKey,
          standardFormatSize: r.standardFormatSize,

          // newspaperName: r.newspaperName,
          // newspaperAgencyName: r.newspaperAgencyName,
        })),
      );
    });
  };
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  useEffect(() => {
    getZone();
  }, []);

  useEffect(() => {
    getWard();
  }, []);

  useEffect(() => {
    getDepartment();
  }, [ward]);

  useEffect(() => {
    getRotationGroup();
  }, [department]);

  useEffect(() => {
    getRotationSubGroup();
  }, [rotationGroup]);

  useEffect(() => {
    getNewsPaper();
  }, [rotationSubGroup]);

  useEffect(() => {
    if (router.query.id && newsPaper.length > 0) {
      getAllEditTableData(router.query.id);
      setBtnSaveText("Update");
      console.log("hwllo", router.query.id);
    }
  }, [newsPaper, router.query.id]);

  // useEffect(() => {
  //     getAllTableData();
  // }, [fetchData]);

  // // Get Table - Data
  // const getAllTableData = (_pageSize = 10, _pageNo = 0) => {
  //     console.log("_pageSize,_pageNo", _pageSize, _pageNo);
  //     axios
  //         .get(`${urls.NRMS}/trnNewsPublishRequest/getAll`, {
  //             params: {
  //                 pageSize: _pageSize,
  //                 pageNo: _pageNo,
  //             },
  //         })
  //         .then((r) => {
  //             console.log(";rressss", r);
  //             let result = r.data.trnNewsPublishRequestList;
  //             console.log("@@@@@@", result);

  //             // console.log("billingDivisionAndUnit", billingDivisionAndUnit)

  //             // let _res = result.map((r, i) => {
  //             let _res = result.map((r, i) => {

  //                 return {
  //                     // r.data.map((r, i) => ({
  //                     activeFlag: r.activeFlag,
  //                     srNo: i + 1,
  //                     id: r.id,
  //                     newsRotationRequestNumber: r.newsRotationRequestNumber,
  //                     wardKey: r.wardKey,
  //                     wardName: r.wardName,
  //                     departmentKey: r.departmentKey,
  //                     departmentName: r.departmentName,
  //                     priority: r.priority,
  //                     newsAdvertisementSubject: r.newsAdvertisementSubject,
  //                     workName: r.workName,
  //                     workCost: r.workCost,
  //                     newsAdvertisementDescription: r.newsAdvertisementDescription,
  //                     rotationGroupkey: r.rotationGroupkey,
  //                     rotationGroupName: r.rotationGroupName,
  //                     rotationSubGroupkey: r.rotationSubGroupkey,
  //                     rotationSubGroupName: r.rotationSubGroupName,
  //                     newsPaperLevel: r.newsPaperLevel,
  //                     typeOfNews: r.typeOfNews,
  //                     typeOfNewsId: r.typeOfNewsId,
  //                     createDtTm: r.createDtTm,
  //                     standardFormatSize: r.standardFormatSize,
  //                     fromDate: r.fromDate,
  //                     newsAttachement: r.newsAttachement,
  //                     toDate: r.toDate,
  //                     zoneName: r.zoneName,
  //                     // status: r.activeFlag === "Y" ? "Active" : "Inactive",
  //                     status: r.status === null ? "Pending" :
  //                         r.status === 0 ? "Save As Draft" :
  //                             r.status === 1 ? "Approved By HOD" :
  //                                 r.status === 2 ? "Reject By Concern Department HOD" :
  //                                     r.status === 3 ? "Releasing Order Generated" :
  //                                         r.status === 4 ? "Reject By Department Clerk" :
  //                                             r.status === 5 ? "Approved By NR HOD" :
  //                                                 r.status === 6 ? "Rejected By Department HOD" :
  //                                                     r.status === 7 ? "Waiting for Accountant Approval" :
  //                                                         r.status === 8 ? "Completed" :
  //                                                             r.status === 9 ? "Closed" :
  //                                                                 r.status === 10 ? "Duplicate" : "Invalid",

  //                 };
  //             });
  //             setDataSource([..._res]);
  //             setData({
  //                 rows: _res,
  //                 totalRows: r.data.totalElements,
  //                 rowsPerPageOptions: [10, 20, 50, 100],
  //                 pageSize: r.data.pageSize,
  //                 page: r.data.pageNo,
  //             });
  //         });
  // };

  const onSubmitForm = (formData) => {
    let temp = [];
    const fileObj = {};

    temp = [{ ...fileObj, newsAttachement: newsRequest, attachement: newsRequestDoc }];
    // temp.push(aOneForm,proofOfOwnership,identyProof,castCertificate,statuatoryAndRegulatoryPermission,industrialRegistration,loadProfileSheet)
    console.log("temp", temp);
    console.log("form data --->", formData);
    console.log("fromData", formData);
    let _formData = { ...formData };
    dispatch(setApprovalOfNews(_formData));
    // Save - DB
    let _body = {
      ...formData,
      newsAttachement: temp[0].newsAttachement,
      attachement: temp[0].attachement,
      activeFlag: formData.activeFlag,
    };
    // console.log("Attachement",newsAttachement)
    if (btnSaveText === "Save") {
      console.log("_body", _body);
      const tempData = axios.post(`${urls.NRMS}/trnNewsPublishRequest/save`, _body).then((res) => {
        console.log("res---", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          // setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          router.push({
            pathname: "/nrms/transaction/AdvertisementRotation/",
            query: {
              pageMode: "View",
            },
          });
        }
      });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("_body", valueData, _body);
      let payload = {
        ...formData,
        status: valueData?.status,
        id: valueData?.id,
        activeFlag: valueData?.activeFlag,
        isComplete: false,
        newsPublishRequestNo: valueData?.newsPublishRequestNo,
      };
      console.log("payload", payload);

      const tempData = axios.post(`${urls.NRMS}/trnNewsPublishRequest/save`, payload).then((res) => {
        console.log(":res", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAllTableData();
          // setButtonInputState(false);
          setEditButtonInputState(true);
          router.push({
            pathname: "/nrms/transaction/AdvertisementRotation/",
            query: {
              pageMode: "View",
            },
          });
        }
      });
    }
  };
  // console.log("data.status === 6",data.status ==5)
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    router.push({
      pathname: "/nrms/transaction/AdvertisementRotation/",
      query: {
        pageMode: "View",
      },
    });
    setButtonInputState(false);
    // setSlideChecked(false);
    // setSlideChecked(false);
    // setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const resetValuesCancell = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",
    newsAttachement: "",
  };

  const resetValuesExit = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",
    id: null,
    newsAttachement: "",
  };

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          // marginTop: "10px",
          // marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {/* <FormattedLabel id="newsPublish" /> */}
            News Publish Request
          </h2>
        </Box>

        <Box
          sx={{
            // marginLeft: 5,
            // marginRight: 5,
            marginTop: 2,
            // marginBottom: 5,
            // padding: 1,
            // border:1,
            // borderColor:'grey.500'
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid>
                <Grid container sx={{ padding: "10px" }}>
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
                      //   sx={{ marginTop: 2 }}
                      error={!!errors.wardKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="ward" required />
                        {/* Ward */}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 300 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Ward Name *"
                          >
                            {wardKeys &&
                              wardKeys.map((wardKey, index) => (
                                <MenuItem key={index} value={wardKey.id}>
                                  {language == "en" ? wardKey?.wardName : wardKey?.wardNameMr}
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

                  {/* from date in marathi */}
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      // size="small"
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.concenDeptId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="de     partment" />} */}
                        Department
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // required
                            // disabled={router?.query?.pageMode === "View"}
                            sx={{ width: 300 }}
                            value={field.value} // value={departmentName}
                            {...register("departmentName")}
                            label={<FormattedLabel id="department" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {department &&
                              department.map((department, index) => (
                                <MenuItem key={index} value={department.department}>
                                  {department.department}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="departmentName"
                        control={control}
                        defaultValue=""
                      />
                      {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
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
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.concenDeptId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="locationName" />} */}
                        Priority
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // required
                            // disabled={router?.query?.pageMode === "View"}
                            sx={{ width: 300 }}
                            value={field.value}
                            // onChange={(value) => field.onChange(value)}

                            {...register("priority")}
                            label={<FormattedLabel id="priority" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                          </Select>
                        )}
                        name="priority"
                        control={control}
                        defaultValue=""
                      />
                      {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                    </FormControl>
                  </Grid>
                  {/* to date in marathi */}
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      // required
                      // disabled={router?.query?.pageMode === "View"}
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      value={inputData}
                      // label={<FormattedLabel id="newsSubject" />}
                      label="News/Advertisement Subject"
                      multiline
                      variant="standard"
                      {...register("newsAdvertisementSubject")}
                      error={!!errors.label2}
                      helperText={
                        errors?.newsAdvertisementSubject ? errors.newsAdvertisementSubject.message : null
                      }
                      InputLabelProps={{
                        //true
                        shrink:
                          (watch("newsAdvertisementSubject") ? true : false) ||
                          (router.query.newsAdvertisementSubject ? true : false),
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      // required
                      // disabled={router?.query?.pageMode === "View"}
                      id="standard-textarea"
                      sx={{ width: 300 }}
                      // label={<FormattedLabel id="work" />}
                      label="Work"
                      multiline
                      variant="standard"
                      {...register("workName")}
                      error={!!errors.label2}
                      helperText={errors?.workName ? errors.workName.message : null}
                      InputLabelProps={{
                        //true
                        shrink: (watch("workName") ? true : false) || (router.query.workName ? true : false),
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      // required
                      // disabled={router?.query?.pageMode === "View"}
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      // label={<FormattedLabel id="newsDescription" />}
                      label="News/Adevertisement Description"
                      multiline
                      variant="standard"
                      {...register("newsAdvertisementDescription")}
                      error={!!errors.newsAdvertisementDescription}
                      helperText={
                        errors?.newsAdvertisementDescription
                          ? errors.newsAdvertisementDescription.message
                          : null
                      }
                      InputLabelProps={{
                        //true
                        shrink:
                          (watch("newsAdvertisementDescription") ? true : false) ||
                          (router.query.newsAdvertisementDescription ? true : false),
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
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
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.rotationGroupKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="de     partment" />} */}
                        Rotation Group
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 300 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            {...field}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              {
                                // console.log(
                                //     "kdfagsfhhk",
                                //     rotationGroup,
                                //     value.target.value,
                                //     rotationSubGroup?.filter((val) => val?.rotationGroupKey === value.target.value),
                                // );
                              }

                              rotationSubGroup?.filter((val) => val?.rotationGroupKey === value.target.value)
                                ? setSubGroup([
                                    rotationSubGroup?.filter(
                                      (val) => val?.rotationGroupKey === value.target.value,
                                    ),
                                  ])
                                : [];
                            }}
                            //   onChange={(value) => field.onChange(value)}
                            // label="Select Auditorium"
                          >
                            {console.log(":rel", subGroup)}
                            {rotationGroup &&
                              rotationGroup.map((rotationGroupName, index) => (
                                <MenuItem key={index} value={rotationGroupName.rotationGroupKey}>
                                  {rotationGroupName.rotationGroupName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="rotationGroupKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.rotationGroupName ? errors.rotationGroupName.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={6}
                    xs={12}
                    p={1}
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
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.rotationSubGroupKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="de     partment" />} */}
                        Rotation Sub Group
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 300 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            {...field}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              {
                                console.log(
                                  "sddddddd",
                                  newsPaper,
                                  value.target.value,

                                  newsPaper?.find((val) => val?.rotationSubGroupKey === value.target.value),
                                );
                              }

                              newsPaper?.filter((val) => val?.rotationSubGroupKey === value.target.value)
                                ? setNewsLevel([
                                    newsPaper?.filter(
                                      (val) => val?.rotationSubGroupKey === value.target.value,
                                    ),
                                  ])
                                : [];
                            }}
                            // label="Select Auditorium"
                          >
                            {console.log("sss", subGroup)}

                            {subGroup.length > 0 &&
                              subGroup[0].map((each, index) => {
                                console.log("each", each);
                                return (
                                  <MenuItem key={index} value={each.rotationSubGroupKey}>
                                    {each.rotationSubGroupName}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        )}
                        name="rotationSubGroupKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.rotationSubGroupKey ? errors.rotationSubGroupKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
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
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.concenDeptId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="locationName" />} */}
                        News Paper Level
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // required
                            // disabled={router?.query?.pageMode === "View"}
                            sx={{ width: 300 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            // {...register("newsPaperLevel")}
                            label={<FormattedLabel id="paperLevel" />}
                          >
                            {console.log("ssss", newsLevel)}

                            {newsLevel &&
                              newsLevel[0].map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {each.newspaperLevel}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="newsPaperLevel"
                        control={control}
                        defaultValue=""
                      />
                      {/* <FormHelperText>
{errors?.concenDeptId
? errors.concenDeptId.message
: null}
</FormHelperText> */}
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
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
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.concenDeptId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="locationName" />} */}
                        Standard Format Size
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // required
                            // disabled={router?.query?.pageMode === "View"}
                            sx={{ width: 300 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            // {...register("newsPaperLevel")}
                            label={<FormattedLabel id="paperLevel" />}
                          >
                            {console.log("ssss", newsLevel)}
                            {newsLevel &&
                              newsLevel[0].map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {each.standardFormatSize}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="standardFormatSize"
                        control={control}
                        defaultValue=""
                      />
                      {/* <FormHelperText>
{errors?.concenDeptId
? errors.concenDeptId.message
: null}
</FormHelperText> */}
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
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
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.concenDeptId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="locationName" />} */}
                        Type Of News
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // required
                            // disabled={router?.query?.pageMode === "View"}
                            sx={{ width: 300 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            {...register("typeOfNews")}
                            label={<FormattedLabel id="newsTypes" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            <MenuItem value="crime">Crime</MenuItem>
                          </Select>
                        )}
                        name="typeOfNews"
                        control={control}
                        defaultValue=""
                      />
                      {/* <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText> */}
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.fromDate}>
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/yyyy"
                              // label={<FormattedLabel id="newsFromDate" />}
                              label="Publish News Date"
                              value={field.value}
                              minDate={new Date()}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField {...params} size="small" variant="standard" sx={{ width: 300 }} />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    background:
                      "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                  }}
                >
                  <h2>
                    {/* <FormattedLabel id="attachement" /> */}
                    Attachement
                  </h2>
                </Box>

                {/* Attachement */}
                <Grid container sx={{ padding: "10px", marginTop: "20px" }}>
                  <Grid
                    item
                    xl={3}
                    lg={3}
                    md={3}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                    p={1}
                    style={{ margin: "px" }}
                  >
                    <Typography>
                      <h3>
                        {/* <FormattedLabel id="attachNews" /> */}
                        Attach News
                      </h3>
                    </Typography>

                    {/* {console.log("Doc", docCertificate)} */}
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={3} xs={12} p={1} style={{ margin: "0px" }}>
                    <UploadButton
                      // appName="News Rotation"
                      // serviceName="NewsPublishRequest"
                      appName="TP"
                      serviceName="PARTMAP"
                      fileUpdater={setNewsRequest}
                      filePath={newsRequest}
                    />
                  </Grid>
                  <Grid item xl={3} lg={3} md={3} sm={3} xs={12} p={1} style={{ margin: "0px" }}>
                    <UploadButton
                      // appName="News Rotation"
                      // serviceName="NewsPublishRequest"
                      appName="TP"
                      serviceName="PARTMAP"
                      fileUpdater={setNewsRequestDoc}
                      filePath={newsRequestDoc}
                    />
                  </Grid>
                </Grid>
                {/* Buttons */}
                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    marginTop: "50px",
                    marginBottom: "20px",
                  }}
                >
                  <Grid container ml={5} border px={5}>
                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button
                        // sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText === "Update"
                          ? //  <FormattedLabel id="update" />
                            "  Update"
                          : //  <FormattedLabel id="save" />
                            "Save"}
                        {console.log("Update", btnSaveText)}
                      </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>

                    <Grid item>
                      <Button
                        // sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        {/* <FormattedLabel id="clear" /> */}
                        Clear
                      </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button
                        endIcon={<ExitToAppIcon />}
                        variant="contained"
                        color="error"
                        c
                        onClick={() => exitButton()}
                      >
                        {/* <FormattedLabel id="exit" /> */}
                        Exit
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Paper>
    </>
  );
};

export default Index;
