import { yupResolver } from "@hookform/resolvers/yup";
import { GetAppRounded, Send } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import ReportIcon from "@mui/icons-material/Report";
import SaveIcon from "@mui/icons-material/Save";
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
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FileTable from "../../../../components/Nrms/FileUpload/FileTable";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/newsRotationManagementSystem/pressNoteRelease";
import styles from "../../../../styles/nrms/[newMarriageRegistration]view.module.css";

const Create = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({ criteriaMode: "all", resolver: yupResolver(schema), mode: "onChange" });
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));
  const user = useSelector((state) => state.user.user);
  const [modalforAprov, setmodalforAprov] = useState(false);
  const authority = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [priority, setPriority] = useState([]);
  const [department, setDepartment] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState();
  const [ward, setWard] = useState([]);
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);
  console.log("authority", authority);
  const token = useSelector((state) => state.user.user.token);

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

  const getPriority = () => {
    axios.get(`${urls.NRMS}/priority/getAll`).then((res) => {
      setPriority(res.data.priority);
    });
  };

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartment(res.data.department);
    });
  };

  const getWard = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      setWard(res.data.ward);
      console.log("getZone.data", res.data.ward);
    });
  };

  const [zoneDropDown, setZoneDropDown] = useState([]);

  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZoneDropDown(
        res.data.zone.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        })),
      );
    });
  };

  const getNewsPaper = () => {
    axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
      setNewsPaper(r?.data?.newspaperMasterList);
    });
  };

  const getById = async (id) => {
    axios.get(`${urls.NRMS}/trnPressNoteRequestApproval/getById?id=${id}`).then((r) => {
      reset(r.data);
      console.log(r?.data?.pressNoteRequestApprovalAttachment, "r?.data?.pressNoteRequestApprovalAttachment");
      if (r?.data?.pressNoteRequestApprovalAttachment != null) {
        let flag = false;

        if (authority?.includes("ENTRY") && (r?.data?.status == "DRAFTED" || r?.data?.status == "null")) {
          flag = true;
        } else {
          flag = false;
        }

        setAuthorizedToUpload(flag);
        console.log("flag++++", flag);

        setFinalFiles(
          r?.data?.pressNoteRequestApprovalAttachment.map((r, i) => {
            return {
              ...r,
              srNo: i + 1,
            };
          }),
        );
      }
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

    // console.log("serviceId**-", serviceId);

    await axios
      .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          setmodalforAprov(false);
          swal("Saved!", "Record Saved successfully !", "success");
          router.push(`/nrms/transaction/pressNoteRelease`);
        }
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong!", "error");
      });
  };

  const releasingOrderGeneration = async () => {
    let applicationId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    console.log("appid", applicationId, router?.query?.applicationId, router?.query?.id);

    // console.log("serviceId**-", serviceId);

    const generateRO = {
      id: applicationId,
    };

    await axios
      .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, generateRO, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          // setmodalforAprov(false)
          router.push({
            pathname: "/nrms/transaction/releasingOrder/press",
            query: {
              pageMode: "View",
              id: applicationId,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
        swal("Error!", "Somethings Wrong!", "error");
      });
  };

  const sendPressNoteToPublish = async () => {
    let applicationId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    console.log("appid", applicationId, router?.query?.applicationId, router?.query?.id);

    // console.log("serviceId**-", serviceId);

    const generateRO = {
      id: applicationId,
    };

    await axios
      .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, generateRO, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          setmodalforAprov(false);
          swal("Successfully Done!", "SENT To NEWS AGENCIES FOR PUBLISHMENT  !", "success");
          router.push(`/nrms/transaction/pressNoteRelease`);
        }
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong!", "error");
      });
  };

  const onSubmitForm = async (formData) => {
    console.log("btnSaveText", btnSaveText);
    let _body = {
      ...formData,
      id: router?.query?.id ? router?.query?.id : null,
      pressNoteRequestApprovalAttachment: finalFiles,
      activeFlag: formData.activeFlag ? formData.activeFlag : null,
      createdUserId: user?.id,
      isDraft: btnSaveText == "DRAFT" ? true : false,
      isCorrection: btnSaveText == "UPDATE" ? true : false,
    };

    console.log("_body", _body);

    await axios
      .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, _body, {
        headers: {
          Authorization: `Bearer ${token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((res) => {
        console.log("res---", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push("/nrms/transaction/pressNoteRelease");
        }
      });
  };

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("finalFiles", finalFiles);
  }, [finalFiles]);

  useEffect(() => {
    getDepartment();
    getNewsPaper();
    getWard();
    getZone();
    getPriority();
  }, []);

  useEffect(() => {
    if (router.query.id != undefined && router?.query?.pageMode != null) {
      if (ward.length > 0 && department.length > 0 && newsPaper.length > 0) {
        getById(router.query.id);
      }
    } else {
      if (authority.includes("ENTRY") && router.query.pageMode == "Add") {
        setAuthorizedToUpload(true);
      }
    }
  }, [router.query.id, ward, department, newsPaper]);

  const resetValuesExit = {
    id: null,
    wardKey: null,
    departmentKey: null,
    priority: null,
    pressNoteSubject: "",
    newsPaper: null,
    pressNoteDescription: null,
    pressNoteReleaseDate: null,
    finalFiles: [],
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    // setmodalforAprov(false)

    router.push("/nrms/transaction/pressNoteRelease/");
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
          <h2>
            <strong>
              <FormattedLabel id={"pressNoteReleaseHeading"} />
            </strong>
          </h2>
        </Box>

        <Divider />

        <Box>
          <Box p={1}>
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
                        sx={{ width: 300 }}
                        error={!!errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zone" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "250px" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              // @ts-ignore
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="zone" required />}
                            >
                              {zoneDropDown &&
                                zoneDropDown.map((value, index) => (
                                  <MenuItem
                                    key={index}
                                    value={
                                      //@ts-ignore
                                      value.id
                                    }
                                  >
                                    {language == "en"
                                      ? //@ts-ignore
                                        value.zoneEn
                                      : // @ts-ignore
                                        value?.zoneMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
                      </FormControl>
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
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="small"
                        sx={{ width: 300 }}
                        error={!!errors.wardKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Location Name */}
                          {<FormattedLabel id="ward" required />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={
                                router?.query?.pageMode === "View" || router?.query?.pageMode === "PROCESS"
                              }
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              InputLabelProps={{ shrink: watch("wardKey") ? true : false }}
                            >
                              {ward?.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en" ? each.wardName : each.wardNameMr}
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
                      <FormControl variant="standard" error={!!errors.departmentKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="department" required />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={
                                router?.query?.pageMode === "View" || router?.query?.pageMode === "PROCESS"
                              }
                              sx={{ width: 300 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              InputLabelProps={{
                                shrink: watch("departmentKey") ? true : false,
                              }}
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
                        <FormHelperText>
                          {errors?.departmentKey ? errors.departmentKey.message : null}
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
                          {/* Location Name */}
                          {<FormattedLabel required id="priority" />}
                          {/* Priority */}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={
                                router?.query?.pageMode === "View" || router?.query?.pageMode === "PROCESS"
                              }
                              sx={{ width: 300 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              {...register("priority")}
                              InputLabelProps={{
                                shrink: watch("priority") ? true : false,
                              }}
                            >
                              {priority.map((p, index) => (
                                <MenuItem key={index} value={p.id}>
                                  {language == "en" ? p.priority : p.priorityMr}
                                </MenuItem>
                              ))}
                              {/* <MenuItem value={"High"}>{language == 'en' ? "High" : "तीव्र"}</MenuItem>
                                                            <MenuItem value={"Medium"}>{language == 'en' ? "Medium" : "मध्यम"}</MenuItem>
                                                            <MenuItem value={"Low"}>{language == 'en' ? "Low" : "कमी"}</MenuItem> */}
                            </Select>
                          )}
                          name="priority"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.priority ? errors.priority.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container sx={{ padding: "10px" }}>
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
                      <FormControl
                        variant="standard"
                        style={{ marginTop: 10 }}
                        error={!!errors.pressNoteReleaseDate}
                      >
                        <Controller
                          control={control}
                          name="pressNoteReleaseDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled={
                                  router?.query?.pageMode === "View" || router?.query?.pageMode === "PROCESS"
                                }
                                variant="standard"
                                inputFormat="DD/MM/yyyy"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {<FormattedLabel required id="pressNoteReleaseDate" />}
                                  </span>
                                }
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
                                    error={!!errors.pressNoteReleaseDate}
                                  />
                                )}
                                InputLabelProps={{
                                  shrink: watch("pressNoteReleaseDate") ? true : false,
                                }}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.pressNoteReleaseDate ? errors.pressNoteReleaseDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* news Paper */}
                    <Grid
                      item
                      xl={8}
                      lg={8}
                      md={8}
                      sm={12}
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
                              disabled={
                                router?.query?.pageMode === "View" || router?.query?.pageMode === "PROCESS"
                              }
                              sx={{ width: 600 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              {newsPaper &&
                                newsPaper.map((newsPaper, index) => (
                                  <MenuItem key={index} value={newsPaper.id}>
                                    {language == "en" ? newsPaper.newspaperName : newsPaper.newspaperNameMr}
                                  </MenuItem>
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
                        <FormHelperText>{errors?.newsPaper ? errors.newsPaper.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* press note subject  */}
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled={router?.query?.pageMode === "View" || router?.query?.pageMode === "PROCESS"}
                        sx={{ width: 1200 }}
                        id="standard-textarea"
                        label={<FormattedLabel required id="pressNoteSubject" />}
                        multiline
                        variant="standard"
                        {...register("pressNoteSubject")}
                        error={!!errors.pressNoteSubject}
                        helperText={errors?.pressNoteSubject ? errors.pressNoteSubject.message : null}
                        InputLabelProps={{
                          shrink: watch("pressNoteSubject") ? true : false,
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/*press note  description  */}
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled={router?.query?.pageMode === "View" || router?.query?.pageMode === "PROCESS"}
                        sx={{ width: 1200 }}
                        id="standard-textarea"
                        label={<FormattedLabel required id="pressNoteDescription" />}
                        multiline
                        variant="standard"
                        {...register("pressNoteDescription")}
                        error={!!errors.pressNoteDescription}
                        helperText={errors?.pressNoteDescription ? errors.pressNoteDescription.message : null}
                        InputLabelProps={{
                          shrink: watch("pressNoteDescription") ? true : false,
                        }}
                      />
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
                    <h2>
                      <strong>{language == "en" ? "Attachement" : "दस्तऐवज"}</strong>
                    </h2>
                  </Box>

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
                      authorizedToUpload={authorizedToUpload}
                    />
                  </Grid>

                  {authority && (
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
                        {authority?.includes("ENTRY") &&
                          (router.query.pageMode == "Add" || router.query.pageMode == "Edit") &&
                          (getValues("status") == null || getValues("status") == "DRAFTED") && (
                            <>
                              <Grid container ml={5} border px={5}>
                                {/* Save as Draft */}
                                <Grid item xs={2}></Grid>

                                <Grid item>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<SaveIcon />}
                                    onClick={() => setBtnSaveText("DRAFT")}
                                  >
                                    {language == "en" ? "Save As Draft" : "तात्पुरते जतन करा"}
                                  </Button>
                                </Grid>
                                <Grid item xs={2}></Grid>

                                <Grid item>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    onClick={() => setBtnSaveText("CREATE")}
                                    endIcon={<SaveIcon />}
                                  >
                                    {language == "en" ? "Save" : "जतन करा"}
                                  </Button>
                                </Grid>

                                <Grid item xs={2}></Grid>

                                <Grid item>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    endIcon={<ExitToAppIcon />}
                                    onClick={() => exitButton()}
                                  >
                                    {language == "en" ? "Exit" : "बाहेर पडा"}
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          )}

                        {(authority?.includes("APPROVAL") || authority?.includes("FINAL_APPROVAL")) &&
                          router.query.pageMode == "PROCESS" && (
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

                        {authority?.includes("RELEASING_ORDER_ENTRY") &&
                          router.query.pageMode == "PROCESS" &&
                          getValues("status") == "APPROVED" && (
                            <>
                              <Button
                                sx={{ marginRight: 8 }}
                                width
                                variant="contained"
                                endIcon={<GetAppRounded />}
                                color="error"
                                onClick={() => releasingOrderGeneration()}
                              >
                                GENREATE RELEASING ORDER
                              </Button>
                            </>
                          )}

                        {authority?.includes("SEND_TO_PUBLISH") &&
                          router.query.pageMode == "PROCESS" &&
                          getValues("status") == "FINAL_APPROVED" && (
                            <Button
                              sx={{ marginRight: 8 }}
                              width
                              variant="contained"
                              endIcon={<Send />}
                              color="primary"
                              onClick={() => sendPressNoteToPublish()}
                            >
                              SEND PRESS NOTE TO PUBLISH
                            </Button>
                          )}

                        {router?.query?.pageMode == "PROCESS" &&
                          typeof getValues("status") != "undefined" &&
                          (getValues("status") == "REVERT_BY_FINAL_AUTHORITY" ||
                            getValues("status") == "REVERT_BACK_TO_CONCERN_DEPT_USER") && (
                            <>
                              <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                endIcon={<SaveIcon />}
                                onClick={() => setBtnSaveText("UPDATE")}
                              >
                                UPDATE
                              </Button>
                            </>
                          )}

                        {getValues("status") != "DRAFTED" && typeof getValues("status") != "undefined" && (
                          <Button
                            sx={{ marginRight: 8 }}
                            width
                            variant="contained"
                            endIcon={<ExitToAppIcon />}
                            color="error"
                            onClick={() => router.push(`/nrms/transaction/pressNoteRelease/`)}
                          >
                            Exit
                          </Button>
                        )}
                      </Grid>
                    </>
                  )}
                </Grid>
              </form>
            </FormProvider>
          </Box>
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
                  <CloseIcon
                    onClick={
                      () => setmodalforAprov(false) /* router.push(`/nrms/transaction/pressNoteRelease`) */
                    }
                  />
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
                      router.push(`/nrms/transaction/pressNoteRelease`);
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
                    // router.push(`/nrms/transaction/pressNoteRelease`);
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
                    // swal({
                    //     title: "Exit?",
                    //     text: "Are you sure you want to Close the window ? ",
                    //     icon: "warning",
                    //     buttons: true,
                    //     dangerMode: true,
                    // }).then((willDelete) => {
                    //     if (willDelete) {
                    //         swal("Modal Closed!", {
                    //             icon: "success",
                    //         });
                    setmodalforAprov(false);
                    //         // router.push(`/nrms/transaction/pressNoteRelease`);
                    //     } else {
                    //         swal("Modal Closed");
                    //     }
                    // });
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

export default Create;
