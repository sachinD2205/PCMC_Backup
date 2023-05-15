import ForwardIcon from "@mui/icons-material/Forward";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UndoIcon from "@mui/icons-material/Undo";

import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/nrms/[newMarriageRegistration]view.module.css";

import UploadButtonOP from "../../../../components/Nrms/FileUpload/DocumentsUploadOP";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/newsRotationManagementSystem/AdvertisementRotation";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { newsPapersLst: [] },
  });

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  const [modalforAprov, setmodalforAprov] = useState(false);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();

  const [dataSource, setDataSource] = useState([]);

  const [status, setStatus] = useState();
  const [wardKeys, setWardKeys] = useState([]);
  const [prioritys, setPrioritys] = useState([]);
  const [newsTypss, setNewsTypss] = useState([]);
  const [subGroup, setSubGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [newsRequest, setNewsRequest] = useState("");

  const [newsRequestDoc, setNewsRequestDoc] = useState("");
  const [zone, setZone] = useState("");
  const [valueData, setValueData] = useState();
  const [btnSaveText, setBtnSaveText] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  const { inputData, setInputData } = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();

  //file attach
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);

  const [rotationGroup, setRotationGroup] = useState([]);
  const [rotationSubGroup, setRotationSubGroup] = useState();
  const [levels, setLevels] = useState([]);
  const [newsPaperOriginal, setNewsPaperOriginal] = useState([]);
  const [newsPaperAll, setNewsPaperAll] = useState([]);
  const [selectedNewsPapers, setSelectedNewsPapers] = useState([]);
  const [standardFormatSize, setStandardFormatSize] = useState([]);

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedSubGroupId, setSelectedSubGroupId] = useState(null);
  const [selectedNewsPaperLevel, setSelectedNewsPaperLevel] = useState(null);
  const [selectedNewsPaper, setSelectedNewsPaper] = useState(null);

  // const [slideChecked, setSlideChecked] = useState(false);

  let appName = "NRMS";
  let serviceName = "N-NPR";

  const dispatch = useDispatch();
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let serviceId = (serviceId = user?.menus?.find((m) => m?.id == selectedMenuFromDrawer)?.serviceId);

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

  const getAllEditTableData = async (id) => {
    await axios.get(`${urls.NRMS}/trnNewsPublishRequest/getById?id=${id}`).then((r) => {
      console.log(":aaaa", id, r?.data);
      reset(r.data);
      if (
        r?.data?.rotationGroupKey != null &&
        r?.data?.rotationSubGroupKey != null &&
        r?.data?.newsPaperLevel != null
      ) {
        setSelectedGroupId(r?.data?.rotationGroupKey);
        setSelectedSubGroupId(r?.data?.rotationSubGroupKey);
        setSelectedNewsPaperLevel(r?.data?.newsPaperLevel);
        getRotationSubGroup(r?.data?.rotationGroupKey);
        getLevel(r?.data?.rotationGroupKey, r?.data?.rotationSubGroupKey);
        getNewsPaperOriginal(
          r?.data?.rotationGroupKey,
          r?.data?.rotationSubGroupKey,
          r?.data?.newsPaperLevel,
        );
        getStandardFormatSize(
          r?.data?.rotationGroupKey,
          r?.data?.rotationSubGroupKey,
          r?.data?.newsPaperLevel,
        );
      }

      // setSelectedNewsPapers(.filter((e) => nps.includes(e.id)).map((ee) => ee.newspaperName));

      // console.log("newsPapersssss", newsPapers);
      // let nps = r?.data?.newsPapers?.split(",");
      // console.log("newsPaperAllll", newsPaperAll);
      // if (r?.data?.attachments != null) {
      //   let flag = false;
      //   if (authority?.includes("ENTRY") && (r?.data?.status == "DRAFTED" || r?.data?.status == "null")) {
      //     flag = true;
      //   } else {
      //     flag = false;
      //   }

      //   setAuthorizedToUpload(flag);
      //   console.log("flag++++", flag);

      //   setFinalFiles(
      //     r?.data?.attachments.map((r, i) => {
      //       return {
      //         ...r,
      //         srNo: i + 1,
      //       };
      //     }),
      //   );
      // }
    });
  };

  console.log("valueData", valueData);

  // get Ward Name
  const getWard = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      setWardKeys(res.data.ward);
      console.log("res.data", res.data);
    });
  };

  // get prioritys
  const getpriority = () => {
    axios.get(`${urls.NRMS}/priority/getAll`).then((res) => {
      setPrioritys(res.data.priority);
      console.log("res.data1", res.data.priority);
    });
  };

  // get typeofnews
  const getnewsType = () => {
    axios.get(`${urls.NRMS}/newsType/getAll`).then((res) => {
      setNewsTypss(res.data.newsType);
      console.log("res.data1", res.data.newsType);
    });
  };

  // get level
  const getLevel = (selectedGroupId, value) => {
    axios
      .get(`${urls.NRMS}/newsPaperLevel/getByRotationSubGroup?groupId=${selectedGroupId}&subGroupId=${value}`)
      .then((res) => {
        console.log("res.data1npl", res.data);
        setLevels(res.data);
      });
  };

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
  const getRotationSubGroup = (value) => {
    axios.get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getByGroupId?groupId=${value}`).then((r) => {
      setRotationSubGroup(r.data.newspaperRotationSubGroupMasterList);
    });
  };

  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(res.data.zone);
      console.log("getZone.data", res.data);
    });
  };

  const getNewsPaperOriginal = async (selectedGroupId, selectedSubGroupId, value) => {
    await axios
      .get(
        `${urls.NRMS}/newspaperMaster/getNewsPaperByNewsPaperLevelAndMuchMore?groupId=${selectedGroupId}&subGroupId=${selectedSubGroupId}&newsPaperLevel=${value}`,
      )
      .then((r) => {
        setNewsPaperOriginal(r.data);
        return r.data;
      });
    // console.log("aala re", temp);
    // return temp
  };

  const getNewsPaperAll = () => {
    axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
      setNewsPaperAll(r?.data?.newspaperMasterList);
    });
  };

  const getStandardFormatSize = (selectedGroupId, selectedSubGroupId, selectedNewsPaperLevel) => {
    axios
      .get(
        `${urls.NRMS}/newsStandardFormatSizeMst/getAllByFilters?groupId=${selectedGroupId}&subGroupId=${selectedSubGroupId}&newsPaperLevel=${selectedNewsPaperLevel}`,
      )
      .then((r) => {
        setStandardFormatSize(r?.data);
      });
  };

  //view application remarks
  const remarks = async (props) => {
    let applicationId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    console.log("appid", applicationId, router?.query?.applicationId, router?.query?.id);

    const finalBody = {
      id: Number(applicationId),
      approveRemark:
        props == "APPROVE"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      rejectRemark:
        props == "REASSIGN"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,

      finalRejectionRemark:
        props == "REJECT"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
    };

    console.log("serviceId**-", serviceId);

    await axios
      .post(`${urls.NRMS}/trnNewsPublishRequest/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: `${selectedMenuFromDrawer}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          swal("Saved!", "Record Saved successfully !", "success");
          router.push(`/nrms/transaction/AdvertisementRotation`);
        }
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong!", "error");
      });
  };

  // const releasingOrderGeneration = async () => {
  //   console.log("Yetoy ka", componentRef.current);
  //   handlePrint();
  // };

  const releasingOrderGeneration = async () => {
    let applicationId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    let nps = newsPaperOriginal.filter((r) => selectedNewsPapers?.includes(r.newspaperName)).map((r) => r.id);
    let stringggg = nps.toString();
    console.log("nps.toString()", stringggg);
    console.log("appid", applicationId, router?.query?.applicationId, router?.query?.id);

    console.log("serviceId**-", serviceId);

    const generateRO = {
      id: applicationId,
      rotationGroupKey: getValues("rotationGroupKey"),
      rotationSubGroupKey: getValues("rotationSubGroupKey"),
      newsPaperLevel: getValues("newsPaperLevel"),
      newsPapers: stringggg,
      // newsPapers: getValues("newsPapers"),
      standardFormatSize: getValues("standardFormatSize"),
    };

    await axios
      .post(`${urls.NRMS}/trnNewsPublishRequest/save`, generateRO, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: `${selectedMenuFromDrawer}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          router.push({
            pathname: "/nrms/transaction/releasingOrder/news",
            query: {
              pageMode: "View",
              id: applicationId,
            },
          });
        }
      })
      .catch((err) => {
        console.log("errrrrrrr", err);
        swal("Error!", "Somethings Wrong!", err);
      });
  };

  const sendNewsToPublish = async () => {
    let applicationId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    console.log("appid", applicationId, router?.query?.applicationId, router?.query?.id);

    console.log("serviceId**-", serviceId);

    const generateRO = {
      id: applicationId,
    };

    await axios
      .post(`${urls.NRMS}/trnNewsPublishRequest/save`, generateRO, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: `${selectedMenuFromDrawer}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          swal("Successfully Done!", "SENT To NEWS AGENCIES FOR PUBLISHMENT  !", "success");
          router.push(`/nrms/transaction/AdvertisementRotation`);
        }
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong!", "error");
      });
  };

  useEffect(() => {
    if (newsPaperOriginal.length > 0 && getValues("newsPapers")) {
      let nps = getValues("newsPapers");
      setSelectedNewsPapers(newsPaperAll.filter((e) => nps.includes(e.id)).map((ee) => ee.newspaperName));
    }
  }, [newsPaperOriginal]);

  useEffect(() => {
    getWard();
    getDepartment();
    getRotationGroup();
    // getRotationSubGroup();
    // getStandardFormatSize();
    getZone();
    getpriority();
    // getLevel();
    getnewsType();
  }, []);

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      // id,
    });
  };

  useEffect(() => {
    getNewsPaperAll();
  }, []);
  useEffect(() => {
    if (router?.query?.id && router?.query?.pageMode != null && newsPaperAll?.length > 0) {
      getAllEditTableData(router.query.id);
      // setBtnSaveText("Update");
      console.log("hwllo", router.query.id);
    } else {
      if (authority.includes("ENTRY")) {
        setAuthorizedToUpload(true);
      }
    }
  }, [router.query.id, newsPaperAll]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  const onSubmitForm = (formData) => {
    console.log("btnSaveText++", btnSaveText);
    // Save - DB
    let _body = {
      ...formData,
      attachments: finalFiles,
      activeFlag: formData.activeFlag,
      createdUserId: user?.id,
      isDraft: btnSaveText == "DRAFT" ? true : false,
      isCorrection: btnSaveText == "UPDATE" ? true : false,
      department: user?.userDao?.primaryDepartment,
    };

    console.log("_body", _body);

    const tempData = axios
      .post(`${urls.NRMS}/trnNewsPublishRequest/save`, _body, {
        headers: {
          Authorization: `Bearer ${token}`,
          serviceId: `${selectedMenuFromDrawer}`,
        },
      })
      .then((res) => {
        console.log("res---", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          // sweetAlert("Saved!", "Record Saved successfully !", "success");
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

  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
      //   width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      flex: 1,
      // width: 140,
    },
    language == "en"
      ? {
          headerName: "Uploaded By",
          field: "attachedNameEn",
          flex: 2,
          // width: 300,
        }
      : {
          headerName: "द्वारे अपलोड केले",
          field: "attachedNameMr",
          flex: 2,
          // width: 300,
        },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,
      // width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`, "_blank");
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    console.log("callllll", value);

    setSelectedNewsPaper(event.target.value);

    setSelectedNewsPapers(typeof value === "string" ? value.split(",") : value);
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
          <h2>{<FormattedLabel id="newsPublish" />}</h2>
        </Box>

        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid>
                <Grid container sx={{ padding: "10px" }}>
                  {/* ward  */}
                  {/* <Grid
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
                    <FormControl variant="standard" error={!!errors.wardKey}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="ward" required />
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
                  </Grid> */}

                  {((authority?.includes("RELEASING_ORDER_ENTRY") || authority?.includes("FINAL_APPROVAL") /* && !router?.query?.pageMode */) ||
                    (!authority?.includes("ENTRY") &&
                      !authority?.includes("APPROVAL") &&
                      router?.query?.pageMode == "PROCESS")) && (
                    <>
                      {/* department */}
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
                        <FormControl variant="standard" error={!!errors.department}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="departmentName" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 300 }}
                                {...field}
                                value={field.value}
                                {...register("department")}
                                onChange={(value) => field.onChange(value)}
                              >
                                {department &&
                                  department.map((department, index) => (
                                    <MenuItem key={index} value={department.id}>
                                      {language == "en" ? department?.department : department?.departmentMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="department"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.department ? errors.department.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {/* priority */}
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
                      error={!!errors.priority}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="priority" required />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 300 }}
                            value={field.value}
                            {...register("priority")}
                            label={<FormattedLabel id="priority" />}
                          >
                            {/* <MenuItem value={1}>High</MenuItem>
                            <MenuItem value={2}>Medium</MenuItem>
                            <MenuItem value={3}>Low</MenuItem> */}

                            {prioritys &&
                              prioritys.map((priority, index) => (
                                <MenuItem key={index} value={priority.id}>
                                  {language == "en" ? priority?.priority : priority?.priorityMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="priority"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.priority ? errors.priority.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* publish date */}
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
                      variant="standard"
                      style={{ marginTop: 10 }}
                      error={!!errors.newsPublishDate}
                    >
                      <Controller
                        control={control}
                        name="newsPublishDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/yyyy"
                              // label={<FormattedLabel id="newsFromDate" />}
                              label={<FormattedLabel id="newsFromDate" required />}
                              value={field.value}
                              minDate={new Date()}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  sx={{ width: 300 }}
                                  error={!!errors.newsPublishDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.newsPublishDate ? errors.newsPublishDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* news type */}
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
                      error={!!errors.typeOfNews}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="newsTypes" required />}
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
                            {/* <MenuItem value={"Crime"}>Crime</MenuItem>
                            <MenuItem value={"Tender"}>Tender</MenuItem> */}
                            {/* <MenuItem value={1}>Crime</MenuItem>
                            <MenuItem value={2}>Tender</MenuItem> */}

                            {newsTypss &&
                              newsTypss.map((newsType, index) => (
                                <MenuItem key={index} value={newsType.id}>
                                  {language == "en" ? newsType?.newsType : newsType?.newsTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="typeOfNews"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.typeOfNews ? errors.typeOfNews.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>

                  {watch("typeOfNews") == 2 && (
                    <>
                      {/* news subject */}
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
                          sx={{ width: 300 }}
                          id="standard-textarea"
                          value={inputData}
                          label={<FormattedLabel id="newsSubject" required />}
                          multiline
                          variant="standard"
                          {...register("newsAdvertisementSubject")}
                          error={!!errors.newsAdvertisementSubject}
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

                      {/* news description */}
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
                          sx={{ width: 300 }}
                          id="standard-textarea"
                          label={<FormattedLabel id="newsDescription" required />}
                          //   label="News/Adevertisement Description"
                          multiline
                          variant="standard"
                          {...register("newsAdvertisementDescription")}
                          error={!!errors.newsAdvertisementDescription}
                          helperText={
                            errors?.newsAdvertisementDescription
                              ? errors.newsAdvertisementDescription.message
                              : null
                          }
                          // InputLabelProps={{
                          //   //true
                          //   shrink:
                          //     (watch("newsAdvertisementDescription") ? true : false) ||
                          //     (router.query.newsAdvertisementDescription ? true : false),
                          // }}
                        />
                      </Grid>
                    </>
                  )}

                  {watch("typeOfNews") == 1 && (
                    <>
                      {/* work name */}
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
                          sx={{ width: 300 }}
                          label={<FormattedLabel id="work" required />}
                          //   label="Work"
                          multiline
                          variant="standard"
                          {...register("workName")}
                          error={!!errors.workName}
                          helperText={errors?.workName ? errors.workName.message : null}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("workName") ? true : false) || (router.query.workName ? true : false),
                          }}
                        />
                      </Grid>

                      {/* work cost */}
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
                        {/* work cost */}
                        <TextField
                          id="standard-textarea"
                          sx={{ width: 300 }}
                          label={<FormattedLabel id="workCost" required />}
                          //   label="Work"
                          multiline
                          variant="standard"
                          {...register("workCost")}
                          error={!!errors.workCost}
                          helperText={errors?.workCost ? errors.workCost.message : null}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("workCost") ? true : false) || (router.query.workCost ? true : false),
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {(authority?.includes("RELEASING_ORDER_ENTRY") ||
                    authority?.includes("RELEASING_ORDER_APPROVAL") ||
                    authority?.includes("FINAL_APPROVAL")) &&
                    getValues("status") === "APPROVED" &&
                    router?.query?.pageMode == "PROCESS" && (
                      <>
                        <Grid
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
                          <FormControl variant="standard" size="small" error={!!errors.rotationGroupKey}>
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="groupName" required />}
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
                                    setSelectedGroupId(value.target.value);
                                    getRotationSubGroup(value.target.value);
                                  }}
                                >
                                  {rotationGroup &&
                                    rotationGroup.map((rotationGroupName, index) => (
                                      <MenuItem key={index} value={rotationGroupName.id}>
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
                              {errors?.rotationGroupKey ? errors.rotationGroupKey.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid
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
                          <FormControl variant="standard" size="small" error={!!errors.rotationSubGroupKey}>
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="subGroup" required />}
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
                                    setSelectedSubGroupId(value.target.value);
                                    getLevel(selectedGroupId, value.target.value);

                                    // {
                                    //   console.log(
                                    //     "sddddddd",
                                    //     newsPaper,
                                    //     value.target.value,

                                    //     newsPaper?.find((val) => val?.rotationSubGroupKey === value.target.value),
                                    //   );
                                    // }

                                    // newsPaper?.filter((val) => val?.rotationSubGroupKey === value.target.value)
                                    //   ? setNewsLevel([
                                    //       newsPaper?.filter(
                                    //         (val) => val?.rotationSubGroupKey === value.target.value,
                                    //       ),
                                    //     ])
                                    //   : [];
                                  }}
                                  // label="Select Auditorium"
                                >
                                  {/* {console.log("sss", subGroup)} */}

                                  {rotationSubGroup?.length > 0 &&
                                    rotationSubGroup?.map((each, index) => {
                                      console.log("each", each);
                                      return (
                                        <MenuItem key={index} value={each.id}>
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
                          <FormControl variant="standard" size="small" error={!!errors.newsPaperLevel}>
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="paperLevel" required />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 300 }}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    setSelectedNewsPaperLevel(value.target.value);
                                    getNewsPaperOriginal(
                                      selectedGroupId,
                                      selectedSubGroupId,
                                      value.target.value,
                                    );
                                    getStandardFormatSize(
                                      selectedGroupId,
                                      selectedSubGroupId,
                                      value.target.value,
                                    );
                                  }}
                                >
                                  {/* {console.log("ssss", newsLevel)} */}
                                  {/* {newsLevel &&
                              newsLevel[0].map((each, index) => (
                                <MenuItem key={index} value={each.newspaperLevel}>
                                  {each.newspaperLevel}
                                </MenuItem>
                              ))} */}

                                  {levels?.map((newsPaperLevel, index) => (
                                    <MenuItem key={index} value={newsPaperLevel.id}>
                                      {language == "en"
                                        ? newsPaperLevel?.newsPaperLevel
                                        : newsPaperLevel?.newsPaperLevelMr}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                              name="newsPaperLevel"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.newsPaperLevel ? errors.newsPaperLevel.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        {/* news Paper */}
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
                            error={!!errors.newsPaper}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="newsPaperName" required />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  renderValue={(selected) => selected.join(", ")}
                                  MenuProps={MenuProps}
                                  disabled={router?.query?.pageMode === "View"}
                                  labelId="demo-multiple-checkbox-label"
                                  id="demo-multiple-checkbox"
                                  multiple
                                  sx={{ width: 300 }}
                                  // value={field.value}
                                  value={selectedNewsPapers}
                                  onChange={
                                    // (value) => {
                                    handleChange
                                    // field.onChange(value);
                                    // }
                                  }
                                >
                                  {newsPaperOriginal &&
                                    newsPaperOriginal.map((newsPaper, index) => (
                                      <MenuItem key={newsPaper.id} value={newsPaper.newspaperName}>
                                        <Checkbox
                                          checked={selectedNewsPapers.indexOf(newsPaper.newspaperName) > -1}
                                        />
                                        <ListItemText primary={newsPaper.newspaperName} />
                                      </MenuItem>
                                      // <MenuItem key={index} value={newsPaper.id}>
                                      //   {language == "en" ? newsPaper.newspaperName : newsPaper.newspaperNameMr}
                                      // </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="newsPaper"
                              control={control}
                              defaultValue=""
                              InputLabelProps={{
                                shrink: watch("newsPaper") ? true : false,
                              }}
                            />
                            <FormHelperText>
                              {errors?.newsPaper ? errors.newsPaper.message : null}
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
                          <FormControl variant="standard" size="small" error={!!errors.standardFormatSize}>
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="formateSize" required />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 300 }}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  label={<FormattedLabel id="paperLevel" />}
                                >
                                  {console.log("ssss", standardFormatSize)}
                                  {standardFormatSize?.map((each, index) => (
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
                            <FormHelperText>
                              {errors?.standardFormatSize ? errors.standardFormatSize.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                </Grid>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    // paddingTop: "10px",
                    // paddingBottom: "10px",
                    background:
                      "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                  }}
                >
                  <h2> {<FormattedLabel id="newsAttachement" />}</h2>
                </Box>

                {/* Attachement */}
                <Grid
                  container
                  style={{
                    marginTop: "1vh",
                  }}
                  spacing={3}
                >
                  {/* docx news attachment */}
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{<FormattedLabel id="advirtiseMentInDocx" />} : </Typography>
                    <UploadButtonOP
                      error={!!errors?.advirtiseMentInDocx}
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("advirtiseMentInDocx")}
                      fileKey={"advirtiseMentInDocx"}
                      showDel={router?.query?.pageMode == "Add" ? false : true}
                      // showDel={true}
                    />
                    <FormHelperText error={!!errors?.advirtiseMentInDocx}>
                      {errors?.advirtiseMentInDocx ? errors?.advirtiseMentInDocx?.message : null}
                    </FormHelperText>
                  </Grid>

                  {/* pdf news attachment */}
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{<FormattedLabel id="advirtiseMentInPdf" />} : </Typography>
                    <UploadButtonOP
                      error={!!errors?.advirtiseMentInPdf}
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("advirtiseMentInPdf")}
                      fileKey={"advirtiseMentInPdf"}
                      showDel={router?.query?.pageMode == "Add" ? false : true}
                    />
                    <FormHelperText error={!!errors?.advirtiseMentInPdf}>
                      {errors?.advirtiseMentInPdf ? errors?.advirtiseMentInPdf?.message : null}
                    </FormHelperText>
                  </Grid>

                  {/* special Notice attachment */}
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{<FormattedLabel id="specialNotice" />} : </Typography>
                    <UploadButtonOP
                      error={!!errors?.advirtiseMentInPdf}
                      appName={appName}
                      serviceName={serviceName}
                      fileDtl={getValues("advirtiseMentInPdf")}
                      fileKey={"advirtiseMentInPdf"}
                      showDel={router?.query?.pageMode == "Add" ? false : true}
                    />
                    <FormHelperText error={!!errors?.advirtiseMentInPdf}>
                      {errors?.advirtiseMentInPdf ? errors?.advirtiseMentInPdf?.message : null}
                    </FormHelperText>
                  </Grid>
                </Grid>

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
                  {!router?.query?.pageMode || router?.query?.pageMode == "Edit" ? (
                    <>
                      <Grid container ml={5} border px={5}>
                        <Grid item xs={3}></Grid>
                        <Grid item>
                          <Button
                            type="submit"
                            onClick={() => setBtnSaveText("DRAFT")}
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {language == "en" ? "SAVE AS DRAFT" : "ड्राफ्ट करा"}
                          </Button>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item>
                          <Button
                            onClick={() => setBtnSaveText("CREATE")}
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {language == "en" ? "Final Submit" : "जतन करा"}
                          </Button>
                        </Grid>
                        <Grid item xs={1}></Grid>

                        <Grid item>
                          <Button
                            endIcon={<ExitToAppIcon />}
                            variant="contained"
                            color="error"
                            onClick={() => {
                              exitButton(), setBtnSaveText("CREATE");
                            }}
                          >
                            <FormattedLabel id="exit" />
                            {/* Exit */}
                          </Button>
                          <Grid item xs={1}></Grid>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid
                        container
                        spacing={5}
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          paddingTop: "10px",
                          marginTop: "60px",
                        }}
                      >
                        {(authority?.includes("APPROVAL") ||
                          authority?.includes("RELEASING_ORDER_APPROVAL") ||
                          authority?.includes("FINAL_APPROVAL")) && (
                          <>
                            <Button
                              variant="contained"
                              endIcon={<NextPlanIcon />}
                              color="success"
                              onClick={() => {
                                // alert(serviceId)
                                setmodalforAprov(true);
                              }}
                            >
                              <FormattedLabel id="actions" />
                            </Button>
                          </>
                        )}

                        {getValues("status") === "FINAL_APPROVED" &&
                          authority?.includes("SEND_TO_PUBLISH") && (
                            <>
                              <Button
                                sx={{ marginRight: 8 }}
                                endIcon={<ForwardIcon />}
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  sendNewsToPublish();
                                }}
                              >
                                Send to News Agencies
                              </Button>
                            </>
                          )}

                        {authority?.includes("RELEASING_ORDER_ENTRY") &&
                          getValues("status") === "APPROVED" && (
                            <>
                              <Button
                                sx={{ marginRight: 8 }}
                                endIcon={<NoteAddOutlinedIcon />}
                                onClick={() => {
                                  releasingOrderGeneration();
                                }}
                                variant="contained"
                                color="success"
                              >
                                Generate Releasing Order
                              </Button>
                            </>
                          )}

                        <Button
                          sx={{ marginRight: 8 }}
                          width
                          variant="contained"
                          endIcon={<ExitToAppIcon />}
                          color="error"
                          onClick={() => router.push(`/nrms/transaction/AdvertisementRotation/`)}
                        >
                          Exit
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Paper>
      <form {...methods} onSubmit={handleSubmit("remarks")}>
        <div className={styles.model}>
          <Modal
            open={modalforAprov}
            //onClose={clerkApproved}
            onCancel={() => {
              setmodalforAprov(false);
            }}
          >
            <div className={styles.boxRemark}>
              <div className={styles.titlemodelremarkAprove}>
                <Typography
                  className={styles.titleOne}
                  variant="h6"
                  component="h2"
                  color="#f7f8fa"
                  style={{ marginLeft: "25px" }}
                >
                  <FormattedLabel id="remarkModel" />
                </Typography>
                <IconButton>
                  <CloseIcon onClick={() => router.push(`/nrms/transaction/AdvertisementRotation`)} />
                </IconButton>
              </div>

              <div className={styles.btndate} style={{ marginLeft: "200px" }}>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={4}
                  placeholder="Enter a Remarks"
                  style={{ width: 700 }}
                  // onChange={(e) => {
                  //   setRemark(e.target.value)
                  // }}
                  // name="remark"
                  {...register("remark")}
                />
              </div>

              <div className={styles.btnappr}>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ThumbUpIcon />}
                  onClick={async () => {
                    remarks("APPROVE");
                    // setBtnSaveText('APPROVED')
                    // alert(serviceId)

                    {
                      router.push(`/nrms/transaction/AdvertisementRotation`);
                    }
                  }}
                >
                  <FormattedLabel id="APPROVE" />
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<UndoIcon />}
                  onClick={() => {
                    remarks("REASSIGN");
                    // alert(serviceId, 'REASSIGN')

                    router.push(`/nrms/transaction/AdvertisementRotation`);
                  }}
                >
                  <FormattedLabel id="REASSIGN" />
                </Button>
                {router.query.role == "FINAL_APPROVAL" ? (
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ReportIcon />}
                    onClick={() => {
                      remarks("REJECT");
                    }}
                  >
                    <FormattedLabel id="reject" />
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  variant="contained"
                  endIcon={<CloseIcon />}
                  color="error"
                  onClick={() => {
                    swal({
                      title: "Exit?",
                      text: "Are you sure you want to exit this Record ? ",
                      icon: "warning",
                      buttons: true,
                      dangerMode: true,
                    }).then((willDelete) => {
                      if (willDelete) {
                        swal("Record is Successfully Exit!", {
                          icon: "success",
                        });
                        router.push(`/nrms/transaction/AdvertisementRotation`);
                      } else {
                        swal("Record is Safe");
                      }
                    });
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </form>
    </>
  );
};

export default Index;
