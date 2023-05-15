import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ForwardIcon from "@mui/icons-material/Forward";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import ReportIcon from "@mui/icons-material/Report";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UndoIcon from "@mui/icons-material/Undo";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FileTable from "../../../../components/Nrms/FileUpload/FileTable";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
import styles from "../../../../styles/nrms/[newMarriageRegistration]view.module.css";
import theme from "../../../../theme.js";

const EntryForm = (props) => {
  // const componentRef = useRef();
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  // const ReportFile = () => {
  //   return <div ref={componentRef}>Ithe toh report taaka</div>;
  // };

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

  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [status, setStatus] = useState();
  const [wardKeys, setWardKeys] = useState([]);
  const [prioritys, setPrioritys] = useState([]);
  const [newsTypss, setNewsTypss] = useState([]);
  const [levels, setLevels] = useState([]);
  const [rotationGroup, setRotationGroup] = useState([]);
  const [subGroup, setSubGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [newsRequest, setNewsRequest] = useState("");
  const [newsLevel, setNewsLevel] = useState("");
  const [newsRequestDoc, setNewsRequestDoc] = useState("");
  const [zone, setZone] = useState("");
  const [valueData, setValueData] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);
  const [rotationSubGroup, setRotationSubGroup] = useState();

  const [id, setID] = useState();
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [modalforAprov, setmodalforAprov] = useState(false);
  console.log("user", user);
  const language = useSelector((state) => state.labels.language);
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
    axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getById?id=${approvalId}`, {
        params: {},
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 435,
        },
      })
      .then((r) => {
        console.log("r.data123", r.data);
        let result = r.data;
        console.log("result", result);
        reset(r.data);
        setID(r.data.id);
        setFinalFiles(
          r.data.attachments.map((rr, i) => {
            return { ...rr, srNo: i + 1 };
          }),
        );
      });
  };

  useEffect(() => {
    getAllTableData();
  }, [router.query.id]);

  let serviceId = (serviceId = user?.menus?.find((m) => m?.id == selectedMenuFromDrawer)?.serviceId);

  useEffect(() => {
    console.log("selectedMenuFromDrawer:-->", selectedMenuFromDrawer);
    console.log("serviceId", serviceId);
    console.log(router.query.role, "123456");
  }, []);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

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

  // const getAllEditTableData = (id) => {
  //   axios.get(`${urls.NRMS}/trnNewsPublishRequest/getById?id=${id}`).then((r) => {
  //     console.log(":aaaa", id, r?.data);
  //     reset(r.data);
  //     setSubGroup([rotationSubGroup.filter((r) => r.rotationGroupKey == _res?.data.rotationGroupKey)]);
  //     setLevels([levels?.filter((val) => val?.rotationSubGroupKey == _res.data.rotationSubGroupKey)]);
  //     // setValueData(r?.data);
  //   });
  // };

  // useEffect(() => {
  //   getAllEditTableData(router.query.id);
  //   setBtnSaveText("Update");
  //   console.log("hwllo", router.query.id);
  // }, [router.query.id]);
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
  const getLevel = () => {
    axios.get(`${urls.NRMS}/newsPaperLevel/getAll`).then((res) => {
      setLevels(res.data.newsPaperLevel);
      console.log("res.data1", res.data.newsPaperLevel);
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

  useEffect(() => {
    getWard();
    getDepartment();
    getRotationGroup();
    getRotationSubGroup();
    getNewsPaper();
    getZone();
    getpriority();
    getLevel();
    getnewsType();
  }, []);

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
          router.push({
            pathname: "/nrms/transaction/releasingOrder/news",
            query: {
              pageMode: "View",
              id,
            },
          });
        }
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong!", "error");
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
                <form onSubmit={handleSubmit(remarks)}>
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
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          sx={{ width: 300 }}
                          id="standard-textarea"
                          label="Publish Request Number"
                          // label={<FormattedLabel id="newsSubject" required />}
                          multiline
                          variant="standard"
                          {...register("newsPublishRequestNo")}
                          error={!!errors.newsPublishRequestNo}
                          helperText={
                            errors?.newsPublishRequestNo ? errors.newsPublishRequestNo.message : null
                          }
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("newsPublishRequestNo") ? true : false) ||
                              (router.query.newsPublishRequestNo ? true : false),
                          }}
                        />
                      </Grid>

                      {/* <Grid
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
                        <FormControl variant="standard" error={!!errors.wardKey}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="ward" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
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
                        <FormControl variant="standard" error={!!errors.department}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="departmentName" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                {...field}
                                value={field.value}
                                {...register("department")}
                                onChange={(value) => field.onChange(value)}
                              >
                                {department &&
                                  department.map((department, index) => (
                                    <MenuItem key={index} value={department.id}>
                                      {/* {department.department} */}
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
                                disabled={router?.query?.pageMode === "View"}
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
                          sx={{ width: 300 }}
                          id="standard-textarea"
                          // value={inputData}
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
                        {/* disabled={router?.query?.pageMode === "View"} */}
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
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
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("newsAdvertisementDescription") ? true : false) ||
                              (router.query.newsAdvertisementDescription ? true : false),
                          }}
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
                        <FormControl variant="standard" size="small" error={!!errors.rotationGroupKey}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="groupName" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ minWidth: 300 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                {...field}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  {
                                    console.log(
                                      "rotationGroup",
                                      rotationGroup,
                                      value.target.value,

                                      rotationSubGroup?.filter(
                                        (val) => val?.rotationGroupKey === value.target.value,
                                      ),
                                    );
                                  }

                                  rotationSubGroup?.filter(
                                    (val) => val?.rotationGroupKey === value.target.value,
                                  )
                                    ? setSubGroup([
                                        rotationSubGroup?.filter(
                                          (val) => val?.rotationGroupKey === value.target.value,
                                        ),
                                      ])
                                    : [];
                                }}
                              >
                                {console.log(":subGroup", subGroup)}
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
                            {errors?.rotationGroupKey ? errors.rotationGroupKey.message : null}
                          </FormHelperText>
                        </FormControl>
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
                        <FormControl variant="standard" size="small" error={!!errors.rotationSubGroupKey}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="subGroup" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
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

                                      newsPaper?.find(
                                        (val) => val?.rotationSubGroupKey === value.target.value,
                                      ),
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

                                {rotationSubGroup?.map((each, index) => {
                                  console.log("each", each);
                                  return (
                                    <MenuItem key={index} value={each.rotationSubGroupKey}>
                                      {language == "en"
                                        ? each.rotationSubGroupName
                                        : each.rotationSubGroupNameMr}
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
                        <FormControl variant="standard" size="small" error={!!errors.newsPaperLevel}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="paperLevel" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={router?.query?.pageMode === "View"}
                                sx={{ width: 300 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                              >
                                {console.log("ssss", newsLevel)}
                                {/* {newsLevel &&
                              newsLevel[0].map((each, index) => (
                                <MenuItem key={index} value={each.newspaperLevel}>
                                  {each.newspaperLevel}
                                </MenuItem>
                              ))} */}

                                {levels &&
                                  levels.map((newsPaperLevel, index) => (
                                    <MenuItem key={index} value={newsPaperLevel.id}>
                                      {language == "en"
                                        ? newsPaperLevel?.newsPaperLevel
                                        : newsPaperLevel?.newsPaperLevelMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            newsPaperLevel
                            name="newsPaperLevel"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.newsPaperLevel ? errors.newsPaperLevel.message : null}
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
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          id="standard-textarea"
                          sx={{ width: 300 }}
                          label={<FormattedLabel id="formateSize" required />}
                          multiline
                          variant="standard"
                          {...register("standardFormatSize")}
                          error={!!errors.standardFormatSize}
                          helperText={errors?.standardFormatSize ? errors.standardFormatSize.message : null}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("standardFormatSize") ? true : false) ||
                              (router.query.standardFormatSize ? true : false),
                          }}
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
                                disabled={router?.query?.pageMode === "View"}
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
                          <FormHelperText>
                            {errors?.typeOfNews ? errors.typeOfNews.message : null}
                          </FormHelperText>
                        </FormControl>
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
                          sx={{ width: 300 }}
                          label={<FormattedLabel id="newsFromDate" required />}
                          multiline
                          variant="standard"
                          {...register("newsPublishDate")}
                          error={!!errors.newsPublishDate}
                          helperText={errors?.newsPublishDate ? errors.newsPublishDate.message : null}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("newsPublishDate") ? true : false) ||
                              (router.query.newsPublishDate ? true : false),
                          }}
                        />
                      </Grid>

                      {/* toDate */}
                    </Grid>

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
                      <h2>Attachement</h2>
                    </Box>

                    {/* Attachement */}
                    <Grid item xs={12}>
                      <FileTable
                        appName="NRMS" //Module Name
                        serviceName={"N-NPR"} //Transaction Name
                        fileName={attachedFile} //State to attach file
                        filePath={setAttachedFile} // File state upadtion function
                        newFilesFn={setAdditionalFiles} // File data function
                        columns={_columns} //columns for the table
                        rows={finalFiles} //state to be displayed in table
                        uploading={setUploading}
                        // showNoticeAttachment={router.query.showNoticeAttachment}
                      />
                    </Grid>

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
                      {(authority?.includes("NEWS_PUBLISH_REQUEST_APPROVAL") ||
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

                      {getValues("status") === "FINAL_APPROVED" && authority?.includes("SEND_TO_PUBLISH") && (
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

                      {authority?.includes("RELEASING_ORDER_ENTRY") && getValues("status") === "APPROVED" && (
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
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>

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

export default EntryForm;
