import { yupResolver } from "@hookform/resolvers/yup";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ForwardIcon from "@mui/icons-material/Forward";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setApprovalOfNews } from "../../../../features/userSlice";
import styles from "./view.module.css";

import { Box, Button, Divider, Grid, InputLabel, Paper, TextField, ThemeProvider } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
const EntryForm = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();
  const [remark, setRemark] = useState("");

  const [moduleName, setModuleName] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);
  const [buttonInputState, setButtonInputState] = useState();
  const [zone, setZone] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [rotationGroup, setRotationGroup] = useState([]);
  const [rotationSubGroup, setRotationSubGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [parameterName, setParameterName] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [id, setID] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const dispatch = useDispatch();
  const [selectedObject, setSelectedObject] = useState();
  const [dataSource, setDataSource] = useState();
  const [priority, setPriority] = useState();
  const [subject, setSubject] = useState();
  const [work, setWork] = useState();
  const [description, setDescription] = useState();
  const [group, setGroup] = useState();
  const [subGroup, setSubGroup] = useState();
  const [isdisabled, setIsDisabled] = useState();
  const [releasingOrder, setReleasingOrder] = useState();
  const [sendMailChiVelAali, setSendMailChiVelAali] = useState();
  const [paperLevel, setPaperLevel] = useState();
  const [newsType, setNewsType] = useState();
  const [hodRemark, setHodRemark] = useState();
  const [date, setDate] = useState();
  const [size, setSize] = useState();
  const [from, setFrom] = useState();
  const [newsAgency, setNewsAgency] = useState();

  const [selectedFromDate, setSelectedFromDate] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [image, setImage] = useState();
  const [releaseOrder, setReleaseOrder] = useState();
  const [to, setTo] = useState();
  const [selectedtodDate, setSelectedToDate] = useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const[ data,setData]=useState([]);

  useEffect(() => {
    getNewsPublishDetails();
  }, [selectedObject]);

  useEffect(() => {
    getAllTableData();
    getRotationGroup();
    getRotationSubGroup();
    getNewsPaper();
    getNewsPaperAgency();
  }, [router.query.id]);

  const validate = () => {
    return (
      (authority && authority.includes("DEPT_USER") && selectedObject?.status == 0) ||
      (authority && authority.includes("ENTRY") && selectedObject?.status == 1) ||
      (authority && authority.includes("APPROVAL") && selectedObject?.status == 3) ||
      (authority && authority.includes("ASSISTANT_COMMISHIONER") && selectedObject?.status == 5) ||
      (authority && authority.includes("SEND_TO_PUBLISHER") && selectedObject?.status == 7)
    );
  };

  useEffect(() => {
    let isApplicable = validate();
    console.log("isApplicable", isApplicable);

    setIsDisabled(validate());
  }, [
    selectedObject?.status == 0,
    selectedObject?.status == 1,
    // selectedObject?.status == 3,
    selectedObject?.status == 5,
    // selectedObject?.status == 7,
    selectedObject?.status == 9,
  ]);

  useEffect(() => {
    let isApplicableS = validate();
    console.log("isApplicableS", isApplicableS);

    setSendMailChiVelAali(validate());
  }, [selectedObject?.status == 7]);

  useEffect(() => {
    let isApplicableR = validate();
    console.log("isApplicableR", isApplicableR);
    setReleasingOrder(validate());
  }, [selectedObject?.status == 3]);

  // dataSource.status == 2,
  // dataSource.status == 3 || dataSource.status == 4 || dataSource.status == 16,
  // dataSource.status == 5 || dataSource.status == 6,
  // dataSource.status == 7 || dataSource.status == 8,

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

  let approvalId = router?.query?.id;
  console.log("idddddddd", router?.query?.id);
  const getAllTableData = () => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getById?id=${approvalId}`, {
        params: {},
      })
      .then((r) => {
        // console.log(";rressss", r);
        // let result = r.data.trnNewsPublishRequestList;
        let result = r.data;
        // console.log("getAllTableData", result);
        // result && result.map((each) => {
        // if (each?.id == approvalId) {
        setSelectedObject(result);
        // }
        // }

        // )
      });
  };
  const getRotationGroup = () => {
    axios.get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`).then((r) => {
      console.log("a:a", r);
      setRotationGroup(
        r.data.newspaperRotationGroupMasterList.map((row) => ({
          id: row.id,
          rotationGroupName: row.rotationGroupName,

          rotationGroupKey: row.rotationGroupKey,
        })),
      );
      // console.log("res.data", r.data);
    });
  };

  const getRotationSubGroup = () => {
    axios.get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getAll`).then((r) => {
      console.log(
        "subGroup",
        r.data.newspaperRotationSubGroupMasterList.map((row) => ({
          rotationSubGroupName: row.rotationSubGroupName,
        })),
      );
      setRotationSubGroup(
        r.data.newspaperRotationSubGroupMasterList.map((row) => ({
          id: row.id,
          rotationSubGroupName: row.rotationSubGroupName,
          rotationGroupKey: row.rotationGroupKey,
          rotationSubGroupKey: row.rotationSubGroupKey,
        })),
      );
    });
  };
  const getNewsPaper = () => {
    // console.log("wafeg", groupId, subGroupId)
    // getByGroupSubGroupId?groupId=1&subGroupId=1
    // const subUrl = groupId && subGroupId ? `newspaperMaster/getByGroupSubGroupId?groupId=${groupId}&subGroupId=${subGroupId}` : `newspaperMaster/getAll`;
    axios.get(`${urls.NRMS}/newsStandardFormatSizeMst/getAll`).then((r) => {
      console.log(
        "getZone.data",
        r?.data?.newsStandardFormatSizeMstList?.map((r, i) => ({
          standardFormatSize: r.standardFormatSize,
          rotationGroupKey: r.rotationGroupKey,
          rotationSubGroupKey: r.rotationSubGroupKey,
        })),
      );
      setNewsPaper(
        r?.data?.newsStandardFormatSizeMstList?.map((r, i) => ({
          id: r.id,
          newspaperLevel: r.newspaperLevel,
          rotationGroupKey: r.rotationGroupKey,
          rotationSubGroupKey: r.rotationSubGroupKey,
          standardFormatSize: r.standardFormatSize,

          // newspaperName: r.newspaperName,
          // newspaperAgencyName: r.newspaperAgencyName,
        })),
      );
    });
  };

  const getNewsPaperAgency = () => {
    // console.log("wafeg", groupId, subGroupId)
    // getByGroupSubGroupId?groupId=1&subGroupId=1
    // const subUrl = groupId && subGroupId ? `newspaperMaster/getByGroupSubGroupId?groupId=${groupId}&subGroupId=${subGroupId}` : `newspaperMaster/getAll`;
    axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
      console.log(
        "Email",
        r?.data?.newspaperMasterList?.map((r, i) => ({
          newspaperAgencyName: r.newspaperAgencyName,
          newspaperName: r.newspaperName,
          newspaperLevel: r.newspaperLevel,
          emailId: r.emailId,
          rotationGroupKey: r.rotationGroupKey,
          rotationSubGroupKey: r.rotationSubGroupKey,
          standardFormatSize: r.standardFormatSize,
        })),
      );
      setNewsAgency(
        r?.data?.newspaperMasterList?.map((r, i) => ({
          id: r.id,
          newspaperAgencyName: r.newspaperAgencyName,
          newspaperName: r.newspaperName,
          newspaperLevel: r.newspaperLevel,
          emailId: r.emailId,
          rotationGroupKey: r.rotationGroupKey,
          rotationSubGroupKey: r.rotationSubGroupKey,
          standardFormatSize: r.standardFormatSize,

          // newspaperName: r.newspaperName,
          // newspaperAgencyName: r.newspaperAgencyName,
        })),
      );
    });
  };

  const getNewsPublishDetails = () => {
    console.log("selectedobjecxcvt", selectedObject);
    console.log(
      "selectedobsdfvgbnhjecxcvt",
      newsAgency && newsAgency.find((obj) => newsAgency[0]?.newspaperLevel == obj.newspaperLevel)
        ? newsAgency.find((obj) => selectedObject?.newsPaperLevel == obj.newspaperLevel)?.newspaperName
        : "-",
    );

    // console.log("rotationGroup",rotationSubGroup && rotationSubGroup.find((obj)=>rotationSubGroup [0]?.rotationSubGroupKey == obj.rotationSubGroupKey) ? rotationSubGroup.find((obj)=>selectedObject?.rotationSubGroupKey == obj.rotationSubGroupKey).rotationSubGroupName : "-")
    if (rotationGroup && rotationSubGroup && newsPaper) {
      setZone(selectedObject?.zoneName ? selectedObject?.zoneName : "-");
      setDepartment(selectedObject?.departmentName ? selectedObject?.departmentName : "-");
      setPriority(selectedObject?.priority ? selectedObject?.priority : "-");
      setSubject(selectedObject?.newsAdvertisementSubject ? selectedObject?.newsAdvertisementSubject : "-");
      setWork(selectedObject?.workName ? selectedObject?.workName : "-");
      setDescription(
        selectedObject?.newsAdvertisementDescription ? selectedObject?.newsAdvertisementDescription : "-",
      );
      setGroup(
        rotationGroup &&
          rotationGroup.find((obj) => rotationGroup[0]?.rotationGroupkey == obj.rotationGroupkey)
          ? rotationGroup.find((obj) => selectedObject?.rotationGroupKey == obj.rotationGroupKey)
              .rotationGroupName
          : "-",
      );
      setSubGroup(
        rotationSubGroup &&
          rotationSubGroup.find((obj) => rotationSubGroup[0]?.rotationSubGroupKey == obj.rotationSubGroupKey)
          ? rotationSubGroup.find((obj) => selectedObject?.rotationSubGroupKey == obj.rotationSubGroupKey)
              .rotationSubGroupName
          : "-",
      );
      setPaperLevel(
        newsPaper && newsPaper.find((obj) => newsPaper[0]?.id == obj.id)
          ? newsPaper.find((obj) => selectedObject?.newsPaperLevel == obj.id)?.newspaperLevel
          : "-",
      );
      // setPaperLevel(newsAgency && newsAgency.find((obj) => newsAgency[0]?.new == obj.newspaperLevel) ? newsAgency.find((obj) => selectedObject?.newsPaperLevel == obj.id)?.newspaperName : "-");
      setNewsType(selectedObject?.typeOfNews ? selectedObject?.typeOfNews : "-");
      setDate(moment(selectedObject?.createDtTm, "YYYY-MM-DD").format("DD-MM-YYYY"));
      setFrom(moment(selectedObject?.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY"));
      setTo(selectedObject?.newsPublishRequestNo ? selectedObject?.newsPublishRequestNo : "-");
      setImage(selectedObject?.attachement ? selectedObject?.attachement : "-");
      setSize(
        newsPaper && newsPaper.find((obj) => newsPaper[0]?.id == obj.id)
          ? newsPaper.find((obj) => selectedObject?.standardFormatSize == obj.id)?.standardFormatSize
          : "-",
      );

      let str = date?.split("T");
      let val = str && str[0];
      setSelectedDate(val ? val : "-");
    }
  };

  const onSubmitForm = (btnType) => {
    let temp = [];
    const fileObj = {};

    temp = [{ ...fileObj, attachement: releaseOrder }];
    // temp.push(aOneForm,proofOfOwnership,identyProof,castCertificate,statuatoryAndRegulatoryPermission,industrialRegistration,loadProfileSheet)
    console.log("temp", temp);
    // console.log("form data --->", formData)
    // console.log("fromData", formData);

    let formData = {
      ...selectedObject,
      remarks: remark,
      isApproved: true,
      attachement: temp[0].attachement,
    };
    console.log("form data --->", formData);
    dispatch(setApprovalOfNews(formData));
    // Save - DB
    if (btnType === "Save") {
      formData = {
        ...selectedObject,
        isApproved: true,
        isComplete: false,
      };
      console.log("Save New COnnection ............ 71", formData);
      const tempData = axios.post(`${urls.NRMS}/trnNewsPublishRequest/save`, formData).then((res) => {
        if (res.status == 201 && authority && authority.includes("APPROVAL")) {
          sweetAlert("Approved!", "Record Approved successfully !", "success");
          getAllTableData();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);

          router.push("/nrms/transaction/AdvertisementRotation/");
        } else if (res.status == 201 && authority && authority.includes("ENTRY")) {
          sweetAlert("Releasing Order Generated", "Record Generated successfully !", "success");
          getAllTableData();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);

          router.push("/nrms/transaction/AdvertisementRotation/");
        } else if (res.status == 201 && authority && authority.includes("DEPT_USER")) {
          sweetAlert("Approved!", "Record Approved successfully !", "success");
          getAllTableData();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);

          router.push("/nrms/transaction/AdvertisementRotation/");
        } else if (res.status == 201 && authority && authority.includes("ASSISTANT_COMMISHIONER")) {
          sweetAlert("Approved!", "Record Approved successfully !", "success");
          getAllTableData();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);

          router.push("/nrms/transaction/AdvertisementRotation/");
        } else if (res.status == 201 && authority && authority.includes("SEND_TO_PUBLISHER")) {
          sweetAlert("Sent!", "E-Mail Sent successfully !", "success");
          getAllTableData();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          router.push("/nrms/transaction/AdvertisementRotation/");
        }
      });
    }
    // Update Data Based On ID
    else if (btnType === "Reject") {
      let formData = {
        ...selectedObject,
        isApproved: false,
        remark: watch("remark"),
      };
      console.log("aaaaaa", formData);
      const tempData = axios
        .post(`${urls.NRMS}/trnNewsPublishRequest/save`)

        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            sweetAlert("Reject!", "Record Rejected successfully !", "success");
            getAllTableData();
            // setButtonInputState(false);
            // setEditButtonInputState(false);
            // setDeleteButtonState(false);
            setIsOpenCollapse(false);
            // router.push('/nrms/transaction/AdvertisementRotation/newsPublishRequest')
            router.push({
              pathname: "/nrms/transaction/AdvertisementRotation/",
            });
          }
        });
    }
  };

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",

            marginBottom: "60px",
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
            <h2> Approval Of News Rotation</h2>
          </Box>

          <Divider />

          <Box
            sx={{
              marginTop: 2,
              marginBottom: 5,
            }}
          >
            <Box p={3}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* Firts Row */}
                  <Grid>
                    <Grid container sx={{ padding: "10px" }}>
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
                          alignItems: "start",
                        }}
                      >
                        {/* {console.log("approvalId",approvalId)} */}
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Publish Request Number"
                          value={to}
                          sx={{ m: 1, minWidth: "50%" }}
                          multiline
                          variant="outlined"
                          error={!!errors.label2}
                          helperText={errors?.label2 ? errors.label2.message : null}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Zone"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={zone}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>

                      {/* Department Name */}

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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Department Name"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={department}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>
                      {/* {
                        authority && authority.includes("APPROVAL") || authority.includes("ENTRY") ?
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
                              id="standard-textarea"
                              label="News Releasing Date"
                              sx={{ m: 1, minWidth: '50%' }}
                              variant="outlined"
                              value={selectedDate}
                            // InputLabelProps={{
                            //     //true
                            //     shrink:
                            //         (watch("label2") ? true : false) ||
                            //         (router.query.label2 ? true : false),
                            // }}
                            />
                          </Grid>
                          : <></>} */}
                      {/*  */}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Priority"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={priority}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="News/Advertisement Subject"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={subject}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Work Name"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={work}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>
                      {/* News Advertisement Description */}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="outlined"
                          label="News/Advertisement Description"
                          multiline
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={description}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>
                      {/* Rotation Group */}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Rotation Group"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={group}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>
                      {/* Rotation Sub Group  */}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Rotation Sub Group"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={subGroup}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>
                      {/* News Paper Level */}

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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="News Paper Level "
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={paperLevel}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Standard Format Size "
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={size}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>
                      {/* Types Of News */}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Type Of News"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={newsType}
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>
                      {/* fro date */}
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
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          label="Publish News Date"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={from}

                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
                        />
                      </Grid>
                      {/* toDate */}
                    </Grid>
                    {authority &&
                    (authority.includes("RTI_APPEAL_ADHIKARI") || authority.includes("SEND_TO_PUBLISHER")) ? (
                      <></>
                    ) : (
                      <>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            marginTop: "30px",
                            background:
                              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          }}
                        >
                          <h2>
                            Remark
                            {/* <FormattedLabel id="addHearing" /> */}
                          </h2>
                        </Box>

                        <Grid
                          item
                          xl={6}
                          lg={6}
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
                            id="standard-textarea"
                            label="Remarks"
                            sx={{
                              width: "400px",
                              marginLeft: "65px",
                            }}
                            multiline
                            disabled={!isdisabled}
                            {...register("remark")}
                            variant="outlined"
                            helperText={errors?.remark ? errors.remark.message : null}
                          />
                        </Grid>
                      </>
                    )}
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                        marginTop: "30px",
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                      }}
                    >
                      <h2>
                        Attachement
                        {/* <FormattedLabel id="addHearing" /> */}
                      </h2>
                    </Box>

                    {(authority && authority?.includes("DEPT_USER")) || authority?.includes("ENTRY") ? (
                      <>
                        <Grid
                          container
                          rowSpacing={2}
                          columnSpacing={1}
                          className={styles.attachmentContainer}
                        >
                          <Grid
                            item
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginLeft: "70px",
                            }}
                          >
                            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                              <h2>View Attachement</h2>
                            </Grid>
                            <Grid item xl={2} lg={6} md={6} sm={6} xs={12} className={styles.viewButton}>
                              <a
                                href={`${urls.CFCURL}/file/preview?filePath=${selectedObject?.newsAttachement}`}
                                target="__blank"
                              >
                                <Button
                                  variant="contained"
                                  sx={{
                                    margin: "30px",

                                    // display: "flex",
                                    // justifyContent: "center",
                                    // alignItems: "center"
                                  }}
                                >
                                  View
                                </Button>
                              </a>
                            </Grid>

                            <Grid item xl={2} lg={6} md={6} sm={6} xs={12} className={styles.viewButton}>
                              <a
                                href={`${urls.CFCURL}/file/preview?filePath=${selectedObject?.attachement}`}
                                target="__blank"
                              >
                                <Button
                                  variant="contained"
                                  sx={{
                                    margin: "30px",

                                    // display: "flex",
                                    // justifyContent: "center",
                                    // alignItems: "center"
                                  }}
                                >
                                  View
                                </Button>
                              </a>
                            </Grid>

                            {/* doc */}
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <>
                        {" "}
                        {authority && authority.includes("APPROVAL") ? (
                          <>
                            <Grid
                              container
                              rowSpacing={2}
                              columnSpacing={1}
                              className={styles.attachmentContainer}
                            >
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
                                  <InputLabel>View Attachement</InputLabel>
                                </Grid>
                                <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.viewButton}>
                                  <a
                                    href={`${urls.CFCURL}/file/preview?filePath=${selectedObject?.newsAttachement}`}
                                    target="__blank"
                                  >
                                    <Button
                                      variant="contained"
                                      sx={{
                                        margin: "30px",

                                        // display: "flex",
                                        // justifyContent: "center",
                                        // alignItems: "center"
                                      }}
                                    >
                                      View
                                    </Button>
                                  </a>
                                </Grid>

                                {/* doc */}
                                <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={styles.viewButton}>
                                  <a
                                    href={`${urls.CFCURL}/file/preview?filePath=${selectedObject?.newsAttachement}`}
                                    target="__blank"
                                  >
                                    <Button
                                      variant="contained"
                                      sx={{
                                        margin: "30px",

                                        // display: "flex",
                                        // justifyContent: "center",
                                        // alignItems: "center"
                                      }}
                                    >
                                      View
                                    </Button>
                                  </a>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}

                    {/* 
                          
   {/* Button Row */}
                    <Grid
                      container
                      spacing={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                        marginTop: "60px",
                      }}
                    >
                      {/* <label>Generate News Releasing Order</label> */}
                      {authority && authority.includes("ENTRY") ? (
                        <>
                          {releasingOrder && console.log("releasingOrder-->", releasingOrder) && (
                            <>
                              <Button
                                sx={{ marginRight: 8 }}
                                disabled={!isdisabled}
                                endIcon={<NoteAddOutlinedIcon />}
                                onClick={() => {
                                  {
                                    onSubmitForm("Save");
                                  }
                                  const record = selectedObject;
                                  router.push({
                                    pathname: "/nrms/transaction/releasingOrder/news",
                                    query: {
                                      pageMode: "View",
                                      ...record,
                                    },
                                  });
                                }}
                                variant="contained"
                                color="success"
                              >
                                Releasing Order
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Save ad Draft */}
                          {authority && authority.includes("RTI_APPEAL_ADHIKARI") ? (
                            <></>
                          ) : (
                            <>
                              <div>
                                {authority && authority.includes("ENTRY") ? (
                                  <Button
                                    sx={{ marginRight: 8 }}
                                    variant="contained"
                                    color="success"
                                    endIcon={<DoneIcon />}
                                    onClick={() => {
                                      onSubmitForm("Save");
                                    }}
                                    disabled={!isdisabled}
                                  >
                                    Verify
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      sx={{ marginRight: 8 }}
                                      variant="contained"
                                      color="success"
                                      endIcon={<DoneIcon />}
                                      onClick={() => {
                                        onSubmitForm("Save");
                                      }}
                                      disabled={!isdisabled}
                                    >
                                      Approve
                                    </Button>
                                  </>
                                )}
                              </div>
                              <Button
                                sx={{ marginRight: 8 }}
                                variant="contained"
                                color="warning"
                                endIcon={<CancelIcon />}
                                onClick={() => {
                                  onSubmitForm("Reject");
                                }}
                                disabled={!isdisabled}
                              >
                                {/* <FormattedLabel id="clear" /> */}
                                Reject
                              </Button>
                            </>
                          )}
                        </>
                      )}

                      {sendMailChiVelAali && authority && authority.includes("ENTRY") && (
                        <>
                          {/* <label>Generate News Releasing Order</label> */}
                          <Button
                            sx={{ marginRight: 8 }}
                            // disabled={!sendMailChiVelAali}
                            endIcon={<ForwardIcon /* style={{ color: "#556CD6" }} */ />}
                            onClick={() => {
                              {
                                onSubmitForm("Save");
                              }
                              const record = selectedObject;
                              router.push({
                                pathname: "/nrms/transaction/releasingOrder/news",
                                query: {
                                  pageMode: "View",
                                  ...record,
                                },
                              });
                            }}
                            variant="contained"
                            color="success"
                          >
                            {/* <FormattedLabel id="clear" /> */}
                            Send to News Agencies
                          </Button>
                        </>
                      )}

                      {/* {authority && authority.includes("ENTRY") ? */}

                      <Button
                        sx={{ marginRight: 8 }}
                        width
                        variant="contained"
                        endIcon={<ExitToAppIcon />}
                        color="error"
                        onClick={() => router.push(`/nrms/transaction/AdvertisementRotation/`)}
                      >
                        Exit
                        {/* {<FormattedLabel id="cancel" />} */}
                      </Button>

                      {/* :

                          <></>
                      } */}
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>
      {/* </Box> */}

      {/* </BasicLayout> */}
    </>
  );
};

export default EntryForm;
