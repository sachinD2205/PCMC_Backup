import { Delete, Visibility } from "@mui/icons-material";
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
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FileTable from "../../FileUpload/FileTable";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/Close";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";
import urls from "../../../../URLS/urls";

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

const SendNotice = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    methods,
    // getValue,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(noticeSchema),
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "testconcernDeptUserList",
    }
  );

  const router = useRouter();

  useEffect(() => {
    // reset(router?.query);
    // getNotice(Number(router.query.id));
  }, [router?.query?.pageMode]);

  console.log("router.query", router.query);

  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [officeLocationList, setOfficeLocationList] = useState([]);

  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = (mode) => {
    setOpen(true);
    setMode(mode);
  };
  const handleClose = () => setOpen(false);

  const [departmentList, setDepartmentList] = useState([]);
  const [_departmentList, _setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const language = useSelector((state) => state.labels.language);

  const dispatch = useDispatch();

  const selectedNotice = useSelector((state) => {
    console.log("selectedNotice", state.user.selectedNotice);
    return state.user.selectedNotice;
  });

  const [pointsData, setPointsData] = useState(
    selectedNotice.parawiseTrnParawiseReportDaoLst
      ?.paragraphWiseAanswerDraftOfIssues
  );

  useEffect(() => {
    console.log(
      "435",
      selectedNotice.parawiseTrnParawiseReportDaoLst.map(
        (val) => val.paragraphWiseAanswerDraftOfIssues
      )
    );
    setPointsData(
      selectedNotice.parawiseTrnParawiseReportDaoLst.map((val, id) => {
        return {
          paragraphWiseAanswerDraftOfIssues:
            val.paragraphWiseAanswerDraftOfIssues,
          id: id,
          srNo: id + 1,
        };
      })
    );
  }, [selectedNotice.parawiseTrnParawiseReportDaoLst]); // set the relation between redux campaign and local state

  // setPointsData(
  //   selectedNotice.parawiseTrnParawiseReportDaoLst.map((val) => {
  //     val.paragraphWiseAanswerDraftOfIssues;
  //   })
  // );

  const selectedConcernDeptUserListToSend = useSelector((state) => {
    console.log(
      "selectedConcernDeptUserListToSend",
      state.user.selectedConcernDeptUserListToSend
    );
    return state.user.selectedConcernDeptUserListToSend;
  });

  const token = useSelector((state) => state.user.user.token);

  useEffect(() => {
    setLoading(true);
    console.log("employeeList, departmentList", employeeList, departmentList);
    const noticeAttachment = [...selectedNotice.noticeAttachment];
    const noticeHisotry = [...selectedNotice.noticeHisotry];

    if (employeeList.length > 0 && departmentList.length > 0) {
      setLoading(false);
      let _noticeAttachment = noticeAttachment.map((file, index) => {
        console.log("23", file);
        return {
          id: file.id ? file.id : "Not Available",
          srNo: file.id ? file.id : "Not Available",
          originalFileName: file.originalFileName
            ? file.originalFileName
            : "Not Available",
          extension: file.extension ? file.extension : "Not Available",
          attachedName: file.attachmentNameEng
            ? file.attachmentNameEng
            : "Not Available",
          filePath: file.filePath ? file.filePath : "-",
        };
      });

      let _noticeHisotry = noticeHisotry.map((file, index) => {
        console.log("24", file);
        return {
          id: index,
          srNo: index + 1,
          remark: file.remark ? file.remark : "-",
          department: file.department,
          // department : departmentList[file.department]
          //           ? departmentList[file.department]
          //           : "-",
          designation: file.designation ? file.designation : "Not Available",
          noticeRecivedFromPerson:
            employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)
              ?.firstNameEn +
            " " +
            employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)
              ?.lastNameEn,
          department: departmentList?.find(
            (obj) =>
              obj.id === selectedConcernDeptUserListToSend[0]?.departmentId
          )?.department,
          // noticeRecivedFromPerson: file.noticeRecivedFromPerson,
          noticeSentDate: file.noticeSentDate,
        };
      });

      _noticeAttachment !== null && setMainFiles([..._noticeAttachment]);
      console.log("test1", _noticeAttachment);
      _noticeHisotry !== null && setDataSource([..._noticeHisotry]);
      console.log("test2", _noticeHisotry);
    }
  }, [employeeList, departmentList]);

  useEffect(() => {
    console.log("Language bol: ", language);
    console.log("Table Files: ", additionalFiles);
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  // setFinalFiles(_res);

  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: "attachedName",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="action" />,
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `http://localhost:8090/cfc/api/file/preview?filePath=${record.row.filePath}`,
                  "_blank"
                );
              }}
            >
              <Visibility />
            </IconButton>

            <IconButton
              color="error"
              onClick={() =>
                discard(record.row.attachmentName, record.row.srNo)
              }
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  const _columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeRecivedFromPerson",
      headerName: <FormattedLabel id="user" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "designation",
    //   headerName: "Designation",
    //   // type: "number",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "department",
      headerName: <FormattedLabel id="deptName" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeSentDate",
      headerName: <FormattedLabel id="remarkDate" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "Remark Time",
    //   headerName: "Remark Time",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
  ];

  const column = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAanswerDraftOfIssues",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  useEffect(() => {
    getDepartmentName();
    getDesignationName();
    getUserName();
    getOfficeLocation();
  }, []);

  const [audienceSample, setAudienceSample] = useState(selectedNotice);

  useEffect(() => {
    setAudienceSample(selectedNotice);
    let _res = audienceSample;

    setValue(
      "noticeRecivedDate",
      _res.noticeRecivedDate ? _res.noticeRecivedDate : "Not Available"
    );
    setValue("noticeDate", _res.noticeDate);
    setValue(
      "noticeRecivedFromAdvocatePerson",
      _res.noticeRecivedFromAdvocatePerson
        ? _res.noticeRecivedFromAdvocatePerson
        : "Not Available"
    );
    // setValue("department", _res.department);
    setValue("requisitionDate", _res.requisitionDate);
    // setValue(
    //   "department",
    //   _res.concernDeptUserList[0]?.departmentId
    //     ? _res.concernDeptUserList[0]?.departmentId
    //     : "Not Available"
    // );
    // setValue("locationName", _res.concernDeptUserList[0]?.locationId);
    setValue(
      "noticeDetails",
      _res.noticeDetails ? _res.noticeDetails : "Not Available"
    );
    setValue("remark", _res.remark ? _res.remark : "-");
    setValue("inwardNo", _res.inwardNo ? _res.inwardNo : "-");
    selectedNotice.concernDeptUserList?.map((val, index) => {
      return append({
        issueNo: index + 1,
        departmentId: val?.departmentId,
        locationId: val?.locationId,
      });
    });
  }, [selectedNotice]);

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(r.data.officeLocation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getNotice = (noticeId) => {
    axios
      .get(`${urls.LCMSURL}/notice/getNoticeById`, {
        params: {
          noticeId: noticeId,
        },
      })
      .then((res) => {
        console.log("res notice history", res);
        let _res = res.data;

        setValue("noticeRecivedDate", _res.noticeRecivedDate);
        setValue("noticeDate", _res.noticeDate);
        setValue(
          "noticeRecivedFromAdvocatePerson",
          _res.noticeRecivedFromAdvocatePerson
        );
        setValue("department", _res.departmentName, { shouldValidate: true });
        setValue("requisitionDate", _res.requisitionDate);
        setValue("locationName", _res.concernDeptUserList[0].locationId);
        setValue("remark", _res.remark);
        setValue("noticeDetails", _res.noticeDetails);

        // setDataSource(
        //   res?.data?.map((r, i) => ({
        //     srNo: i + 1,
        //     id: r.id,
        //     noticeDate: moment(r.noticeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
        //     noticeRecivedDate: moment(r.noticeRecivedDate, "YYYY-MM-DD").format(
        //       "YYYY-MM-DD"
        //     ),
        //     requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format(
        //       "YYYY-MM-DD"
        //     ),
        //     department: r.department,
        //     noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson,
        //     requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
        //   }))
        // );
      });
  };

  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res user", r);
          setEmployeeList(r.data.user);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDesignationName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/designation/getAll`)
      .then((r) => {
        console.log("res deg", r);
        if (r.status == 200) {
          setDesignationList(r.data.designation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getDepartmentName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((r) => {
        if (r.status == 200) {
          // console.log("res department", r);
          setDepartmentList(r.data.department);
          _setDepartmentList(r.data.department);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const onFinish = (data) => {
    const _data = {
      ...data,
      pageMode: "EDIT",
      noticeAttachment: selectedNotice.noticeAttachment,
      // id: Number(router.query.id),
      id: Number(selectedNotice.id),
      receiverUser: data.employeeName,
      receiverDesignation: data.designationName,
      receiverDepartment: data.departmentName,
      remark: data.parawiseRemark,

      pageMode:
        mode === "Reassign"
          ? "PARAWISE_REPORT_REASSIGN"
          : "PARAWISE_REPORT_APPROVE",
      timeStamp: moment(new Date()).unix().toString(),
    };

    console.log("data", data, _data);

    axios
      .post(`${urls.LCMSURL}/notice/saveTrnNotice`, _data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 201) {
          console.log("res save notice", r);
          swal("Record is Successfully Saved!", {
            icon: "success",
          });
          router.push({
            pathname: "/LegalCase/transaction/newNotice",
            query: { mode: "Create" },
          });
        } else {
          console.log("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  return (
    <Box style={{}}>
      {loading ? (
        <Loader />
      ) : (
        <Box>
          <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              xl={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                style={{ marginTop: 10 }}
                error={!!errors.noticeDate}
                fullWidth
                sx={{ width: "90%" }}
              >
                <Controller
                  control={control}
                  name="noticeDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="noticeDate" />
                          </span>
                        }
                        value={field.value}
                        disabled
                        onChange={(date) => {
                          // field.onChange(date)
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        // selected={field.value}
                        // center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            size="small"
                            error={!!errors.noticeDate}
                            helperText={
                              errors?.noticeDate
                                ? errors?.noticeDate.message
                                : null
                            }
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              xl={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                sx={{ width: "90%" }}
                autoFocus
                disabled
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                label={<FormattedLabel id="inwardNo" />}
                variant="standard"
                {...register("inwardNo")}
                error={!!errors.inwardNo}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              xl={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                autoFocus
                sx={{ width: "90%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="noticeReceviedFromAdvocate" />}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                {...register("noticeRecivedFromAdvocatePerson")}
                error={!!errors.noticeRecivedFromAdvocatePerson}
                helperText={
                  errors?.noticeRecivedFromAdvocatePerson
                    ? errors.noticeRecivedFromAdvocatePerson.message
                    : null
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            style={{
              padding: "10px",
              backgroundColor: "white",
            }}
          >
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              xl={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                style={{ marginTop: 10 }}
                error={!!errors.noticeRecivedDate}
                fullWidth
                sx={{ width: "90%" }}
              >
                <Controller
                  control={control}
                  name="noticeRecivedDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        disabled
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="noticeReceviedDate" />
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format("YYYY-MM-DD"))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            size="small"
                            // fullWidth
                            error={!!errors.noticeRecivedDate}
                            helperText={
                              errors?.noticeRecivedDate
                                ? errors?.noticeRecivedDate.message
                                : null
                            }
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {/* <FormHelperText>
                                {errors?.noticeRecivedDate
                                  ? errors.noticeRecivedDate.message
                                  : null}
                              </FormHelperText> */}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
            {fields.map((parawise, index) => {
              return (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      error={!!errors.department}
                      variant="standard"
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="deptName" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="Department Name"
                            disabled
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          >
                            {departmentList &&
                              departmentList.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {department.department}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        // name="department"
                        {...register(
                          `testconcernDeptUserList.${index}.departmentId`
                        )}
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.department ? errors?.department.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      variant="standard"
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="subDepartment" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="Office Location"
                            disabled
                            InputLabelProps={{ shrink: true }}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            style={{ backgroundColor: "white" }}
                          >
                            {officeLocationList &&
                              officeLocationList.map((val, id) => (
                                <MenuItem
                                  key={id}
                                  value={val.id}
                                  style={{
                                    display: val.officeLocationName
                                      ? "flex"
                                      : "none",
                                  }}
                                >
                                  {val.officeLocationName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        // name={"locationName"}
                        {...register(
                          `testconcernDeptUserList.${index}.locationId`
                        )}
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.locationName
                          ? errors?.locationName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              );
            })}
          </Grid>
          <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                style={{ marginTop: 10 }}
                error={!!errors.requisitionDate}
                fullWidth
                size="small"
                sx={{ width: "90%" }}
              >
                <Controller
                  control={control}
                  name="requisitionDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            {" "}
                            <FormattedLabel id="requisitionDate" />
                          </span>
                        }
                        disabled
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format("YYYY-MM-DD"))
                        }
                        // selected={field.value}
                        // center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            error={!!errors.requisitionDate}
                            helperText={
                              errors?.requisitionDate
                                ? errors?.requisitionDate.message
                                : null
                            }
                            size="small"
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {/* <FormHelperText>
                                {errors?.requisitionDate
                                  ? errors?.requisitionDate.message
                                  : null}
                              </FormHelperText> */}
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                autoFocus
                fullWidth
                multiline
                sx={{ width: "90%" }}
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                disabled
                // label="Notice Details"
                label={<FormattedLabel id="noticeDetails" />}
                variant="standard"
                {...register("noticeDetails")}
                error={!!errors.noticeDetails}
                helperText={
                  errors?.noticeDetails ? errors.noticeDetails.message : null
                }
              />
            </Grid>
          </Grid>
          <Divider />
          <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Typography style={{ fontWeight: 900, fontSize: "20px" }}>
                <FormattedLabel id="noticeAttachment" />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FileTable
                appName="LCMS" //Module Name
                serviceName={"L-Notice"} //Transaction Name
                fileName={attachedFile} //State to attach file
                filePath={setAttachedFile} // File state upadtion function
                newFilesFn={setAdditionalFiles} // File data function
                columns={columns} //columns for the table
                rows={finalFiles} //state to be displayed in table
                uploading={setUploading}
              />
            </Grid>
          </Grid>
          <Divider />
          <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Typography style={{ fontWeight: 900, fontSize: "20px" }}>
                <FormattedLabel id="noticeHistory" />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <DataGrid
                disableColumnFilter
                disableColumnSelector
                // disableToolbarButton
                disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
                    // disableExport: true,
                    // disableToolbarButton: true,
                    csvOptions: { disableToolbarButton: true },
                  },
                }}
                autoHeight
                rows={dataSource}
                columns={_columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </Grid>
          </Grid>
          <Divider />

          <Grid container sx={{ padding: "10px", backgroundColor: "white" }}>
            <Grid item xs={12}>
              <DataGrid
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { disableToolbarButton: true },
                  },
                }}
                autoHeight
                rows={pointsData || []}
                columns={column}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </Grid>

            {/* <Grid item xs={12}>
          <TextField
            disabled
            fullWidth
            size="small"
            value={selectedNotice.parawiseTrnParawiseReportDaoLst[0].paragraphWiseAanswerDraftOfIssues}
            {...register("paragraphWiseAanswerDraftOfIssues")}
            InputLabelProps={{ shrink: true }}
            placeholder="Point Explaination"
            label="Point Explaination"
          />
        </Grid> */}
          </Grid>

          <Grid
            container
            style={{
              padding: "10px",
              backgroundColor: "white",
            }}
          >
            {/* <Grid item xs={4} style={{ padding: "10px" }}>
          <FormControl size="small" variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-outlined-label">
              Department Name
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  label="Department Name"
                  value={field.value}
                  onChange={(event) => {
                    setSelectedDepartment(event.target.value);
                    field.onChange(event);
                  }}
                >
                  {_departmentList &&
                    _departmentList.map((department, index) => (
                      <MenuItem key={index} value={department.id}>
                        {department.department}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="departmentName"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} style={{ padding: "10px" }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="demo-simple-select-standard-label">
              Designation Name
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Designation Name"
                  value={field.value}
                  // {...register("applicationName")}
                  onChange={(value) => {
                    field.onChange(value),
                      setSelectedDesignation(value.target.value);
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {designationList.length > 0
                    ? designationList.map((designation, index) => {
                        return (
                          <MenuItem key={index} value={designation.id}>
                            {designation.designation}
                          </MenuItem>
                        );
                      })
                    : "NA"}
                </Select>
              )}
              name="designationName"
              control={control}
              defaultValue=""
            />
            <FormHelperText style={{ color: "red" }}>
              {errors?.designationName ? errors.designationName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} style={{ padding: "10px" }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="demo-simple-select-standard-label">
              Employee Name
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Employee Name"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  style={{ backgroundColor: "white" }}
                >
                  {employeeList.length > 0
                    ? employeeList
                        .filter((user) => {
                          if (user.department === selectedDepartment) {
                            console.log("in if");
                            return user;
                          } else if (
                            user.department === selectedDepartment &&
                            user.designation === selectedDesignation
                          ) {
                            return user;
                          } else if (user.designation === selectedDesignation) {
                            console.log("else if");
                            return user;
                          } else if (
                            selectedDepartment == null &&
                            selectedDesignation == null
                          ) {
                            console.log("else");
                            return user;
                          }
                        })
                        .map((user, index) => {
                          // console.log("876", user);
                          return (
                            <MenuItem key={index} value={user.id}>
                              {user.firstNameEn +
                                " " +
                                user.middleNameEn +
                                " " +
                                user.lastNameEn}
                            </MenuItem>
                          );
                        })
                    : []}
                </Select>
              )}
              name="employeeName"
              control={control}
              defaultValue=""
            />
            <FormHelperText style={{ color: "red" }}>
              {errors?.employeeName ? errors.employeeName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
            <Grid
              style={{
                display: "flex",
                justifyContent: "space-evenly",
              }}
              xs={12}
            >
              {/* <Button
            variant="contained"
            size="small"
            onClick={handleOpen}
            sx={{ backgroundColor: "#00A65A" }}
          >
            SEND
          </Button> */}
              <Button
                variant="contained"
                size="small"
                onClick={() => handleOpen("Approve")}
                sx={{ backgroundColor: "#00A65A" }}
                name="Approve"
                endIcon={<TaskAltIcon />}
              >
                <FormattedLabel id="approve" />
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleOpen("Reassign")}
                sx={{ backgroundColor: "#00A65A" }}
                name="Reassign"
                endIcon={<UndoIcon />}
              >
                <FormattedLabel id="reassign" />
              </Button>
              <Button
                size="small"
                variant="contained"
                sx={{ backgroundColor: "#DD4B39" }}
                endIcon={<CloseIcon />}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Grid>
          </Grid>
          <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "60px",
                }}
              >
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <form onSubmit={handleSubmit(onFinish)}>
                    <Box sx={style}>
                      <Box sx={{ padding: "10px" }}>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          <FormattedLabel id="enterRemark" />
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          {...register("parawiseRemark")}
                          label={<FormattedLabel id="enterRemark" />}
                        />
                      </Box>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          padding: "10px",
                        }}
                      >
                        <Button variant="outlined" size="small" type="submit">
                          <FormattedLabel id="save" />
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleClose}
                        >
                          <FormattedLabel id="cancel" />
                        </Button>
                      </Box>
                    </Box>
                  </form>
                </Modal>
              </div>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default SendNotice;
