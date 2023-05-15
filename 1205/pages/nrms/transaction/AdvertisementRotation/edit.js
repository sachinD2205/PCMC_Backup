import { yupResolver } from "@hookform/resolvers/yup";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
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
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FileTable from "../../../../components/Nrms/FileUpload/FileTable";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
import theme from "../../../../theme.js";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

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
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [id, setID] = useState();
  const [status, setStatus] = useState();
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [modalforAprov, setmodalforAprov] = useState(false);
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
      headerName: "Sr.No",
      field: "srNo",
      width: 100,
      // flex: 1,
    },
    {
      headerName: "File Name",
      field: "originalFileName",
      // File: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: "File Type",
      field: "extension",
      width: 140,
    },
    {
      headerName: "Uploaded By",
      field: "uploadedBy",
      flex: 1,
      // width: 300,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      // flex: 1,

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

  const onSubmitForm = (formData) => {
    console.log("yetoy ka re");
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
      attachments: finalFiles,
      activeFlag: formData.activeFlag,
      // status: status,
      createdUserId: user?.id,
    };
    // console.log("Attachement",newsAttachement)
    if (btnSaveText === "Save") {
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
        createdUserId: user?.id,
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
              pageMode: "Edit",
            },
          });
        }
      });
    }
  };

  // const getAllEditTableData = (id) => {
  //   axios.get(`${urls.NRMS}/trnNewsPublishRequest/getById?id=${id}`).then((r) => {
  //     console.log(":aaaa", id, r?.data);
  //     reset(r.data);
  //     setSubGroup([rotationSubGroup.filter((r) => r.rotationGroupKey == _res?.data.rotationGroupKey)]);
  //     setLevels([levels?.filter((val) => val?.rotationSubGroupKey == _res.data.rotationSubGroupKey)]);
  //     // setValueData(r?.data);
  //   });
  // };
  // console.log("valueData", valueData);

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

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      // id,
    });
  };

  // useEffect(() => {
  //   if (router.query.id != undefined) {
  //     getAllEditTableData(router.query.id);
  //     setBtnSaveText("Update");
  //     console.log("hwllo", router.query.id);
  //   }
  // }, [router.query.id]);
  // // View
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
                  <Grid container sx={{ padding: "10px" }}>
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
                      <FormControl
                        variant="standard"
                      
                        error={!!errors.wardKey}
                      >
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
                      <FormControl variant="standard" size="small" error={!!errors.newsPaperLevel}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="paperLevel" required />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
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
                      <FormControl variant="standard" size="small" error={!!errors.standardFormatSize}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="formateSize" required />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 300 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="paperLevel" />}
                            >
                              {console.log("ssss", newsLevel)}
                              {levels &&
                                levels.map((each, index) => (
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
                              sx={{ width: 300 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              {...register("typeOfNews")}
                              label={<FormattedLabel id="newsTypes" />}
                            >
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
                                onChange={(date) =>
                                  field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))
                                }
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
                    <Grid item xs={1}></Grid>
                    <Grid item>
                      <Button
                        // onClick={() => setStatus("DRAFTED")}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {language == "en" ? "Final Submit" : "जतन करा"}
                      </Button>
                    </Grid>
                    <Grid item xs={1}></Grid>

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
                </form>
              </FormProvider>
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default EntryForm;
