import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FileTable from "../../../../components/Nrms/FileUpload/FileTable";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
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
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseStages, setCaseStages] = useState([]);
  const [cutNews, setCutNews] = useState("");
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

  const [editData, setEditData] = useState({});
  const { inputData, setInputData } = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);

  //file attach

  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);

  // const [slideChecked, setSlideChecked] = useState(false);

  let appName = "NRMS";
  let serviceName = "N-PCB";

  const dispatch = useDispatch();
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDepartment();

    getNewsPaper();
  }, []);

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
    axios.get(`${urls.NRMS}/trnPaperCuttingBook/getById?id=${router.query.id}`).then((r) => {
      // setValueData(r.data.trnPaperCuttingBookList);
      reset(r.data);
      console.log("123456789", r.data);
    });
  };

  useEffect(() => {
    axios.get(`${urls.NRMS}/trnPaperCuttingBook/getById?id=${router.query.id}`).then((res) => {
      reset(res.data);
      setFinalFiles(
        res.data.paperCuttingAttachment.map((ff, ii) => {
          return {
            ...ff,
            srNo: ii + 1,
          };
        }),
      );
      console.log("board data", res.data);
    });
  }, []);

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartment(res.data.department);
      // console.log("res.data", r.data);
    });
  };
  const getNewsPaper = () => {
    axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
      setNewsPaper(
        r?.data?.newspaperMasterList?.map((r, i) => ({
          id: r.id,
          newspaperName: r.newspaperName,
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

  // useEffect(() => {
  //   if (router.query.id != undefined) {
  //     getAllEditTableData(router.query.id);
  //     setBtnSaveText("Update");
  //     console.log("hwllo", router.query.id);
  //   }
  // }, [router.query.id]);

  useEffect(() => {
    getAllTableData();
    getAllPressData();
  }, [fetchData]);
  let approvalId = router?.query?.id;

  const getAllPressData = () => {
    axios.get(`${urls.NRMS}/trnNewsPublishRequest/getAll`).then((r) => {
      let result = r.data.trnNewsPublishRequestList;
      console.log("getAllTableData", result);

      result &&
        result.map((each) => {
          if (each.id == approvalId) {
            setSelectedObject(each);
          }
        });
    });
  };

  // Get Table - Data
  const getAllTableData = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnPaperCuttingBook/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 1102,
        },
      })
      .then((r) => {
        console.log(";rressss", r);
        let result = r.data.trnPaperCuttingBookList;
        console.log("@@@@@@", result);
        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            devisionKey: r.divisionKey,
            srNo: i + 1,
            id: r.id,
            attachement: r.attachement,
            departmentName: r.departmentName,
            newspaperName: r.newspaperName,
            sequenceNumber: r.sequenceNumber,
            publishedDate: r.publishedDate,
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  const onSubmitForm = (formData) => {
    let temp = [];
    const fileObj = {};
    temp = [{ ...fileObj, attachement: cutNews }];

    let _formData = {
      ...formData,
      paperCuttingAttachment: finalFiles,
      activeFlag: formData.activeFlag,
    };
    console.log("cutNews", temp);

    // console.log("Attachement",newsAttachement)
    if (btnSaveText === "Save") {
      console.log("_body", _formData);
      const tempData = axios
        .post(`${urls.NRMS}/trnPaperCuttingBook/save`, _formData, {
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
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            router.push({
              pathname: "/nrms/transaction/paperCuttingBook/",
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

  const [flagSearch, setFlagSearch] = useState(false);
  //   const [data, setData] = useState();

  const handleSearch = () => {
    let temp = number;
    console.log("type", temp);
    axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getDetailsByNewsPublishRequestNo?newsPublishRequestNo=${temp}`)
      .then((res) => {
        if (res.status == 200) {
          swal("Searched!", "Record Searched successfully !", "success");
          setData(res.data);
          setFlagSearch(true);
          // reset(res.data);
          setValue("newspaperName", Number(res.data.newsPapers));
          setValue("newsPublishRequestNo", res.data.newsPublishRequestNo);
          setValue("departmentName", res.data.departmentName);
        }
      })
      .catch((error) => {
        console.log("133", error);
        swal("Error!", error.response.data.message, "error");
      });
  };

  // useEffect(() => {
  //   if (router?.query?.id && router?.query?.pageMode != null) {
  //     getAllEditTableData(router.query.id);
  //     // setBtnSaveText("Update");
  //     console.log("hwllo", router.query.id);
  //   } else {
  //     if (authority.includes("ENTRY")) {
  //       setAuthorizedToUpload(true);
  //     }
  //   }
  // }, [router.query.id]);

  useEffect(() => {
    if (router?.query?.id && router?.query?.pageMode != null) {
      // getAllEditTableData(router.query.id);
      // setBtnSaveText("Update");
      console.log("hwllo", router.query.id);
    } else {
      if (authority.includes("ENTRY")) {
        setAuthorizedToUpload(true);
      }
    }
  }, [router.query.id]);

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

  useEffect(() => {
    console.log("finalFiles", finalFiles);
  }, [finalFiles]);

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
          <h2>{<FormattedLabel id="papercutting" />}</h2>
          {/* <h2>Paper Cutting Book</h2> */}
        </Box>

        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid>
                {router?.query?.pageMode != "View" ? (
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
                        label={<FormattedLabel id="newsreqsearch" />}
                        sx={{ m: 1, minWidth: "90%", width: 300 }}
                        variant="standard"
                        onChange={(e) => {
                          setNumber(e.target.value);
                        }}
                        error={!!errors.newsRotationNumber}
                        helperText={errors?.newsRotationNumber ? errors.newsRotationNumber.message : null}
                      />
                    </Grid>
                    <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                      <Button
                        variant="outlined"
                        color="success"
                        endIcon={<SearchIcon />}
                        //   onClick={handleSearchConnections}
                        onClick={handleSearch}
                      >
                        {/* Search */}
                        <FormattedLabel id="search" />
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid container sx={{ padding: "10px" }}>
                  {/* Date Picker */}
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
                      alignItems: "start",
                    }}
                  >
                    {/* <TextField
                      id="standard"
                      label="Paper Cutting Sequence Number"
                      sx={{ width: 300 }}
                      value={selectedObject?.releasingOrderNumber}
                      multiline
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    /> */}

                    <TextField
                      disabled={router?.query?.pageMode === "View"}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="standard-textarea"
                      label={<FormattedLabel id="newsreqNumber" />}
                      sx={{ width: 300 }}
                      variant="standard"
                      {...register("newsPublishRequestNo")}
                      // onChange={(e) => {
                      //   setNumber(e.target.value);
                      // }}
                      error={!!errors.newsPublishRequestNo}
                      helperText={errors?.newsPublishRequestNo ? errors.newsPublishRequestNo.message : null}
                    />
                  </Grid>

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
                    <FormControl variant="standard" size="small" error={!!errors.newspaperName}>
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="newsPaperName" />}
                        {/* Newspaper Name */}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={router?.query?.pageMode === "View"}
                            sx={{ width: 300 }}
                            value={field.value}
                            {...register("newspaperName")}
                          >
                            {newsPaper &&
                              newsPaper.map((newsPaper, index) => (
                                <MenuItem key={index} value={newsPaper.newspaperName}>
                                  {newsPaper.newspaperName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="newspaperName"
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

                  {/* from date in marathi */}

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
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      // size="small"
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.departmentName}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {<FormattedLabel id="departmentName" />}
                        {/* Department Name */}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={router?.query?.pageMode === "View"}
                            sx={{ width: 300 }}
                            value={field.value} // value={departmentName}
                            {...register("departmentName")}
                            //   label={<FormattedLabel id="department" />}
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

                  {/* to date in marathi */}

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
                    <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.publishedDate}>
                      <Controller
                        control={control}
                        name="publishedDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled={router?.query?.pageMode === "View"}
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>{<FormattedLabel id="publishDate" />}</span>
                              }
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
                        {errors?.publishedDate ? errors.publishedDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                {/* Attachement */}
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
                    {/* Attachement */}
                    <FormattedLabel id="papercutAttachement" />
                  </h2>
                </Box>

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
                      alignItems: "start",
                    }}
                    p={1}
                    style={{
                      margin: "25px",
                    }}
                  ></Grid> */}
                  <Grid item xs={12}>
                    <FileTable
                      appName="NRMS" //Module Name
                      serviceName={"N-PCB"} //Transaction Name
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
                </Grid>
                {router?.query?.pageMode != "View" ? (
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
                    <Grid container ml={5} border px={5}>
                      <Grid item xs={2}></Grid>

                      <Grid item>
                        <Button type="submit" variant="contained" color="success" endIcon={<SaveIcon />}>
                          {
                            btnSaveText === "Save" ? (
                              <FormattedLabel id="save" />
                            ) : (
                              // "Update"
                              <FormattedLabel id="update" />
                            )
                            // "Save"
                          }
                        </Button>
                      </Grid>

                      <Grid item xs={2}></Grid>

                      <Grid item>
                        <Button
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
                ) : (
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
                    <Grid container ml={12} border px={12}>
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
                )}
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Paper>
    </>
  );
};

export default Index;
