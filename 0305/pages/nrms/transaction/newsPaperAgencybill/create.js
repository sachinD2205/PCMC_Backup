import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
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
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import FileTable from "../../../../components/Nrms/FileUpload/FileTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NewsPaperDetails from "../../../../components/Nrms/billSubmission/newsPaperDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/newsRotationManagementSystem/BillSubmission";

const Index = () => {

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { newsPapersLst: [] },
  });

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

  const [department, setDepartment] = useState([]);

  //file attach
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);


  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [requestNo, setRequestNo] = useState(null);

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

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartment(res.data.department);
      // console.log("res.data", r.data);
    });
  };

  const getAllEditTableData = (id) => {
    axios.get(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/getById?id=${id}`).then((r) => {
      console.log(":aaaa", id, r?.data);
      reset(r.data);
      setSelectedGroupId(r?.data?.rotationGroupKey);
      setSelectedSubGroupId(r?.data?.rotationSubGroupKey);
      setSelectedNewsPaperLevel(r?.data?.newsPaperLevel);
      getRotationSubGroup(r?.data?.rotationGroupKey);
      getLevel(r?.data?.rotationGroupKey, r?.data?.rotationSubGroupKey);
      getNewsPaperOriginal(r?.data?.rotationGroupKey, r?.data?.rotationSubGroupKey, r?.data?.newsPaperLevel);
      getStandardFormatSize(r?.data?.rotationGroupKey, r?.data?.rotationSubGroupKey, r?.data?.newsPaperLevel);
      if (r?.data?.attachments != null) {
        let flag = false;

        if (authority?.includes("ENTRY") && (r?.data?.status == "DRAFTED" || r?.data?.status == "null")) {
          flag = true;
        } else {
          flag = false;
        }

        setAuthorizedToUpload(flag);
        console.log("flag++++", flag);

        setFinalFiles(
          r?.data?.attachments.map((r, i) => {
            return {
              ...r,
              srNo: i + 1,
            };
          }),
        );
      }
    });
  };

  useEffect(() => {
    // getWard();
    getDepartment();
    // getRotationGroup();
    // getRotationSubGroup();
    // getStandardFormatSize();
    // getZone();
    // getpriority();
    // getLevel();
    // getnewsType();
  }, []);

  useEffect(() => {
    if (router.query.id != undefined && router?.query?.pageMode != null) {
      getAllEditTableData(router.query.id);
      // setBtnSaveText("Update");
      console.log("hwllo", router.query.id);
    } else {
      if (authority.includes("ENTRY")) {
        setAuthorizedToUpload(true);
      }
    }
  }, [router.query.id]);



  const handleRequestNo = () => {
    axios
      .get(
        `${urls.NRMS}/trnNewsPublishRequest/getDetailsByNewsPublishRequestNo?newsPublishRequestNo=${requestNo}`,
      )
      .then((r) => {
        reset(r.data)
        setValue("newsPapersLst", r.data?.newsPapersLst?.length > 0 ? r.data?.newsPapersLst : [])
        console.log("result", r.data);
      });
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
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

  const onSubmitForm = (billData) => {
    // Save - DB
    let _body = {
      ...billData,
      activeFlag: billData.activeFlag,
    };

    if (btnSaveText === "Save") {
      console.log("_body", _body);
      axios.post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, _body).then((res) => {
        console.log("res---", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push({
            pathname: "/nrms/transaction/newsPaperAgencybill/",
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
      pathname: "/nrms/transaction/paperCuttingBook/",
      query: {
        pageMode: "View",
      },
    });
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

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

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
            News Paper Agency Bill
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
                    <TextField
                      id="standard-textarea"
                      label="Search News Request Number"
                      sx={{ marginLeft: '1px', width: "60vh" }}
                      variant="standard"
                      onChange={(e) => setRequestNo(e.target.value)}
                      error={!!errors.newsPublishRequestNo}
                      helperText={errors?.newsPublishRequestNo ? errors.newsPublishRequestNo.message : null}
                    />
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={2} xs={2}
                  // sx={{ marginLeft: '20vh' }}
                  >
                    <Button disabled={typeof watch("newsPublishRequestNo") != 'undefined' && watch("newsPublishRequestNo") != null ? true : false} variant="contained" onClick={handleRequestNo}>
                      Search
                      {/* {<FormattedLabel id="saveAsDraft" />} */}
                    </Button>
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  {/* Date Picker */}
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
                      disabled
                      id="standard-textarea"
                      label="News Rotation Request Number"
                      sx={{ width: 300 }}
                      variant="standard"
                      {...register("newsPublishRequestNo")}
                      InputLabelProps={{
                        shrink:
                          true
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
                    <TextField
                      // disabled={router?.query?.pageMode === "View"}
                      id="standard-textarea"
                      label="News Paper Name"
                      sx={{ width: 300 }}
                      variant="standard"
                      {...register("paperName")}

                    // value={paperName}
                    // InputLabelProps={{
                    //     //true
                    //     shrink:
                    //         (watch("label2") ? true : false) ||
                    //         (router.query.label2 ? true : false),
                    // }}
                    />
                  </Grid> */}

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
                            disabled
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
                      <FormHelperText>{errors?.department ? errors.department.message : null}</FormHelperText>
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
                              disabled

                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={<span style={{ fontSize: 16 }}>Publish News Date</span>}
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField {...params} size="small" variant="standard" sx={{ width: 300 }} />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.newsPublishDate
                          ? errors.newsPublishDate.message
                          : null}
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
                      disabled

                      // disabled={router?.query?.pageMode === "View"}
                      id="standard-textarea"
                      label="News Adevertisement Subject"
                      sx={{ width: 300 }}
                      variant="standard"
                      {...register("newsAdvertisementSubject")}
                      InputLabelProps={{
                        shrink:
                          true
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
                      alignItems: "start",
                    }}
                  >
                    {/* {console.log("approvalId",approvalId)} */}
                    <TextField
                      disabled

                      id="standard-textarea"
                      label="News Published in Sq.Meter"
                      // value={approvalId}
                      sx={{ width: 300 }}
                      multiline
                      variant="standard"
                      {...register("standardFormatSize")}
                      error={!!errors.standardFormatSize}
                      helperText={
                        errors?.standardFormatSize ? errors.standardFormatSize.message : null
                      }
                      InputLabelProps={{
                        shrink:
                          true
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
                      alignItems: "start",
                    }}
                  >
                    {/* {console.log("approvalId",approvalId)} */}
                    <TextField
                      disabled

                      id="standard-textarea"
                      label="Bill Amount"
                      // value={approvalId}
                      {...register("billAmount")}
                      sx={{ width: 300 }}
                      multiline
                      variant="standard"
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
                </Grid>

                <Grid item xs={12}>
                  <NewsPaperDetails />
                </Grid>

                <Box
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    background:
                      "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                  }}
                >
                  <h2> {<FormattedLabel id="newsAttachement" />}</h2>
                </Box>

                {/* Attachement */}
                <Grid item xs={12}>
                  <FileTable
                    appName="NRMS" //Module Name
                    serviceName={"N-BS"} //Transaction Name
                    fileName={attachedFile} //State to attach file
                    filePath={setAttachedFile} // File state upadtion function
                    newFilesFn={setAdditionalFiles} // File data function
                    columns={_columns} //columns for the table
                    rows={finalFiles} //state to be displayed in table
                    uploading={setUploading}
                    authorizedToUpload={authorizedToUpload}
                  // showNoticeAttachment={router.query.showNoticeAttachment}
                  />
                </Grid>

                {/* To  attachement */}
                {/* <Grid
                        item
                        xl={2}
                        lg={1}
                        md={1}
                        sm={6}
                        xs={12}
                        p={1}
                        style={{ margin: "25px" }}
                      >

                        <Typography  >
                          <b>  Attach Bill</b>
                        </Typography>

                      
                      </Grid> */}

                {/* <Grid
                        item
                        xl={2}
                        lg={1}
                        md={1}
                        sm={6}
                        xs={12}
                        p={1}
                        style={{ margin: "20px" }}
                      >
                        <UploadButton
                          // appName="News Rotation"
                          // serviceName="NewsPublishRequest"
                          appName="TP"
                          serviceName="PARTMAP"

                          fileUpdater={setBill}
                          filePath={bill}

                        />
                      </Grid> */}

                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    marginTop: "50px",
                  }}
                >
                  {/* sdfgtjhdty */}
                  <Grid container ml={5} border px={5}>
                    {/* Save ad Draft */}

                    <Grid item xs={2}></Grid>

                    <Grid item>
                      <Button
                        // sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="save" />
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
                        <FormattedLabel id="clear" />
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
                        <FormattedLabel id="exit" />
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
