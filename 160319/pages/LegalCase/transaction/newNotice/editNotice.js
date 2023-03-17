import React from "react";
import { useRouter } from "next/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../../../styles/LegalCase_Styles/view.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  Card,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Paper,
  IconButton,
  Stepper,
  Step,
  StepButton,
  Box,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useEffect, useState } from "react";
import axios from "axios";
import sweetAlert from "sweetalert";
import { Delete, Visibility } from "@mui/icons-material";
import swal from "sweetalert";
import FileTable from "../../FileUpload/FileTable";
import moment from "moment";
import { useSelector } from "react-redux";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import newNoticeSchema from "../../../../containers/schema/LegalCaseSchema/newNoticeSchema";
import urls from "../../../../URLS/urls";
import SelectOfficeDepartments from "./SelectOfficeDepartments";
import FooterButtons from "./FooterButtons";
import { DataGrid } from "@mui/x-data-grid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditNotice = () => {
  const router = useRouter();
  const [noticeDetails, setNoticeDetails] = useState({});
  const [departments, setDepartments] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [faltugiri, setfaltugiri] = useState([]);
  const [open, setOpen] = useState(false);
  const [_arr, setArr] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [officeLocationWiseDepartment, setOfficeLocationWiseDepartment] =
    useState([]);
  const [departmentWiseEmployee, setDepartmentWiseEmployee] = useState([]);
  const [officeDepartmentDesignationUser, setOfficeDepartmentDesignationUser] =
    useState(null);

  const [dataSource, setDataSource] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [audienceSample, setAudienceSample] = useState(selectedNotice);

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(newNoticeSchema),
    mode: "onChange",
    defaultValues: {
      concernDeptUser: [
        { locationName: "", employeeName: "", departmentName: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "concernDeptUser",
    rules: {
      required: true,
      message: "At least one is required",
    },
    control,
  });

  const handleOpen = () => {
    let filteredDepartments = [...departments];
    filteredDepartments = filteredDepartments.filter((val) => {
      return (
        val.id ===
          officeDepartmentDesignationUser?.find((r) => {
            return r.departmentId === watch("locationName");
          })?.departmentId && val
      );
    });
    setOfficeLocationWiseDepartment(filteredDepartments);
  };
  const handleClose = () => setOpen(false);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const selectedNotice = useSelector((state) => {
    console.log("selectedNotice", state.user.selectedNotice);
    return state.user.selectedNotice;
  });

  useEffect(() => {
    if (officeLocationWiseDepartment.length > 0) setOpen(true);
  }, [officeLocationWiseDepartment]);

  const steps = [
    <FormattedLabel key={1} id="noticeDetails" />,
    <FormattedLabel key={2} id="documentUpload" />,
  ];

  useEffect(() => {
    getUserName();
    getOfficeLocation();
    getCourtCaseNumber();
    getNoticeNumber();
  }, []);

  useEffect(() => {
    getOfficeDepartmentDesignationUser();
  }, []);

  useEffect(() => {
    setAudienceSample(selectedNotice);
    let _res = audienceSample;

    setValue(
      "noticeRecivedDate",
      _res?.noticeRecivedDate ? _res?.noticeRecivedDate : "Loading..."
    );
    setValue("noticeDate", _res?.noticeDate);
    setValue(
      "noticeRecivedFromAdvocatePerson",
      _res?.noticeRecivedFromAdvocatePerson
        ? _res?.noticeRecivedFromAdvocatePerson
        : "Loading..."
    );
    setValue("requisitionDate", _res?.requisitionDate);
    setValue("noticeDetails", _res?.noticeDetails ? _res?.noticeDetails : "-");
    setValue("inwardNo", _res?.inwardNo ? _res?.inwardNo : "-");
    setValue(
      "advocateAddress",
      _res?.advocateAddress ? _res?.advocateAddress : "-"
    );

    let _ress = selectedNotice?.concernDeptUserList?.map((val, i) => {
      console.log("resd", val);
      return {
        srNo: i + 1,
        id: i,
        departmentName: departments?.find((obj) => obj?.id === val.departmentId)
          ?.department
          ? departments?.find((obj) => obj?.id === val.departmentId)?.department
          : "-",
        locationName: officeLocationList?.find(
          (obj) => obj?.id === val.locationId
        )?.officeLocationName
          ? officeLocationList?.find((obj) => obj?.id === val.locationId)
              ?.officeLocationName
          : "-",
        dept: val.departmentId,
        loc: val.locationId,
      };
    });

    console.log("_ress", _ress);

    setRowsData(_ress);
  }, [selectedNotice, departments, officeLocationList]);

  useEffect(() => {
    console.log("userList, departments", userList, departments);
    const noticeAttachment = [...selectedNotice.noticeAttachment];
    const noticeHisotry = [...selectedNotice.noticeHisotry];

    console.log("noticeHisotry", noticeHisotry);

    if (userList.length > 0 && departments.length > 0) {
      let _noticeAttachment = noticeAttachment.map((file, index) => {
        console.log("23", file);
        return {
          id: file.id,
          srNo: file.id,
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
        console.log("24", departments, file);
        return {
          id: index,
          srNo: index + 1,
          remark: file.remark ? file.remark : "-",
          designation: file.designation ? file.designation : "Not Available",
          noticeRecivedFromPerson: userList.find(
            (obj) => obj.id === file.noticeRecivedFromPerson
          )?.firstNameEn
            ? userList.find((obj) => obj.id === file.noticeRecivedFromPerson)
                ?.firstNameEn
            : "-",
          department: departments?.find(
            (obj) => obj.id === file.noticeRecivedFromPerson
          )?.department,
          noticeSentDate: file.noticeSentDate ? file.noticeSentDate : "-",
        };
      });

      _noticeAttachment !== null && setMainFiles([..._noticeAttachment]);
      console.log("test1", _noticeAttachment);
      _noticeHisotry !== null && setDataSource([..._noticeHisotry]);
      console.log("test2", _noticeHisotry);
    }
  }, [userList, departments]);

  const getNoticeNumber = async () => {
    await axios
      .get(`${urls.LCMSURL}/notice/getNoticeNumber`)
      .then((r) => {
        console.log("res notice no", r);
        if (r.status == 200) {
          r?.data ? setValue("serialNo", r.data) : setValue("serialNo", 0);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getCourtCaseNumber = async () => {
    await axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`)
      .then((r) => {
        if (r?.status == 200) {
          console.log("res newCourtCaseEntry", r);
          setCourtCaseEntries(r?.data?.newCourtCaseEntry);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log("res user", r);
          setUserList(r.data.user);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const newCompleted = completed;
    newCompleted[activeStep - 1] = false;
    setCompleted(newCompleted);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  useEffect(() => {
    console.log("Language bol: ", language);
    console.log("Table Files: ", additionalFiles);
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  const discard = async (toDelete, srNo) => {
    console.log("Table data:", finalFiles);
    console.log("2345",`${urls.API_file}/discard?filePath=${toDelete.filePath}`);
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
        // .delete(`${urls.API_file}/discard?filePath=${toDelete}`)
        .delete(`${urls.API_file}/discard?filePath=${toDelete.filePath}`)
        .then((res) => {
            if (res.status === 200) {
              swal("File Deleted Successfully!", { icon: "success" });

              let tempArr = [];

              additionalFiles.forEach((obj) => {
                // @ts-ignore
                if (obj.srNo !== srNo) {
                  tempArr.push(obj);
                }
              });

              // @ts-ignore
              setAdditionalFiles([...tempArr]);
            } else {
              swal("Something went wrong..!!!");
            }
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  const updateNoticeData = () => {
    setOpen(false);

    let obj = {
      departmentId: watch("departmentName"),
      locationId: watch("locationName"),
      empoyeeId: null,
    };

    console.log("_arr",_arr);

    let temp;

    if (_arr.length > 0) {
      setArr([..._arr, obj]);
      temp = [..._arr, obj];
    } else {
      setArr([obj]);
      temp = [obj];
    }

    let _res =
      temp?.length > 0 &&
      temp?.map((val, i) => {
        return {
          srNo: i + 1,
          id: i,
          departmentName: departments?.find(
            (obj) => obj?.id === val.departmentId
          )?.department,

          locationName: officeLocationList?.find(
            (obj) => obj?.id === val.locationId
          )?.officeLocationName,
        };
      });

    setRowsData(_res);

    setValue("departmentName", null);
    setValue("locationName", null);

    // let _ress = selectedNotice?.concernDeptUserList?.map((val, i) => {
    //   console.log("resd", val);
    //   return {
    //     srNo: i + 1,
    //     id: i,
    //     departmentName: departments?.find((obj) => obj?.id === val.departmentId)
    //       ?.department
    //       ? departments?.find((obj) => obj?.id === val.departmentId)?.department
    //       : "-",
    //     locationName: officeLocationList?.find(
    //       (obj) => obj?.id === val.locationId
    //     )?.officeLocationName
    //       ? officeLocationList?.find((obj) => obj?.id === val.locationId)
    //           ?.officeLocationName
    //       : "-",
    //     dept: val.departmentId,
    //     loc: val.locationId,
    //   };
    // });

    // console.log("_ress", _ress);

    // setRowsData(_ress);
  };

  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      field: "srNo",
      width: 100,
      // flex: 1,
    },
    {
      headerName: <FormattedLabel id="fileName" />,
      align: "center",
      headerAlign: "center",
      field: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    // {
    //   headerName: <FormattedLabel id="name" />,
    // align: "center",
    //   headerAlign: "center",
    //   field: "Name",
    //   flex: 0.7,
    // },
    {
      headerName: <FormattedLabel id="fileType" />,
      align: "center",
      headerAlign: "center",
      field: "extension",
      width: 140,
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      align: "center",
      headerAlign: "center",
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="action" />,
      align: "center",
      headerAlign: "center",
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.API_file}/preview?filePath=${record.row.filePath}`,
                  "_blank"
                );
              }}
            >
              <Visibility />
            </IconButton>

            <IconButton
              color="error"
              onClick={() =>
                discard(record.row, record.row.srNo)
              }
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "locationName",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="subDepartment" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={(index) => {
                console.log("check", params.row);
                handleOpen();
                setValue("locationName", params.row.loc);
                setValue("departmentName", params.row.dept);
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getDepartments();
    if (router.query.pageMode === "Edit") {
      // reset(router.query);
      // reset(selectedNotice);
      // selectedNotice.parawiseTrnParawiseReportDaoLst?.map((val, index) => {
      //   return setValue(
      //     `parawiseTrnParawiseReportDaoLst.${index}.paragraphWiseAanswerDraftOfIssues`,
      //     val.paragraphWiseAanswerDraftOfIssues
      //   );
      // });

      append({
        locationName: "",
        employeeName: "",
        departmentName: "",
      });
    }
  }, [officeLocationList]);

  const getOfficeDepartmentDesignationUser = () => {
    axios
      .get(`${urls.CFCURL}/master/officeDepartmentDesignationUser/getAll`)
      .then((res) => {
        console.log("323", res.data.officeDepartmentDesignationUser);
        setOfficeDepartmentDesignationUser(
          res.data.officeDepartmentDesignationUser
        );
      });
  };

  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      console.log("2313", res);
      setDepartments(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
          departmentMr: r.departmentMr,
          departmentMr: r.departmentMr,
        }))
      );
    });
  };
  const appendUI = () => {
    append({
      locationName: "",
      employeeName: "",
      departmentName: "",
    });
  };

  const onSubmitForm = (data) => {
    console.log("data", data);
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
    setNoticeDetails({ ...data, noticeHisotry: [] });

    let abc = _arr?.map((val, index) => {
      console.log("xyz", val);
      return {
        departmentId: val.departmentId,
        locationId: val.locationId,
        empoyeeId: null,
      };
    });
  };

  const finalSubmit = (data) => {
    console.log("additionalFiles", additionalFiles);
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();

    setfaltugiri(
      additionalFiles.map((Obj, index) => {
        console.log("obj", Obj);
        return {
          attachedNameEn: Obj.attachedNameEn,
          attachedNameMr: Obj.attachedNameMr,
          attachedDate: Obj.attachedDate,
          originalFileName: Obj.originalFileName,
          attachmentNameEng: Obj.attachmentName,
          extension: Obj.extension,
        };
      })
    );

    console.log("faltugiri<->", faltugiri);

    console.log("data", noticeDetails, moment(new Date()).unix().toString());

    const bodyForAPI = {
      ...noticeDetails,
      timeStamp: moment(new Date()).unix().toString(),
      // noticeAttachment: faltugiri,

      concernDeptUser: noticeDetails?.concernDeptUser
        ?.map((val, index) => val.employeeName)
        ?.toString(),

      concernDeptUserList: _arr?.map((val, index) => ({
        departmentId: val.departmentId,
        locationId: val.locationId,
        empoyeeId: null,
      })),

      // concernDeptUserList: noticeDetails?.concernDeptUser.map((val, index) => ({
      //   departmentId: val.departmentName,
      //   locationId: val.locationName,
      //   empoyeeId: null,
      // })),

      noticeAttachment: additionalFiles.map((Obj, index) => {
        console.log("obj33", Obj);
        return {
          originalFileName: Obj.originalFileName,
          extension: Obj.extension,
          // attachmentNameEng: Obj.attachedNameEn,
          attachmentNameEng: Obj.attachedNameEn,
          // attachedNameMr: Obj.attachedNameMr,
          filePath: Obj.filePath,
          attachedDate: Obj.attachedDate,
        };
      }),
      // id: Number(noticeDetails.id),
      id: selectedNotice.id,

      pageMode:
        data.target.textContent === "Save" ? "NOTICE_CREATE" : "NOTICE_DRAFT",
    };

    console.log("Final Data: ", bodyForAPI);

    axios
      .post(`${urls.LCMSURL}/notice/saveTrnNotice`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(`/LegalCase/transaction/newNotice/`);
        }
      });
  };

  function goToNotice() {
    router.push(`/LegalCase/transaction/newNotice`);
  }

  const onOfficeLocationChange = (event, field) => {
    field.onChange(event);
    let filteredDepartments = [...departments];
    filteredDepartments = filteredDepartments.filter((val) => {
      return (
        val.id ===
          officeDepartmentDesignationUser?.find((r) => {
            return r.departmentId === event.target.value;
          })?.departmentId && val
      );
    });
    setOfficeLocationWiseDepartment(filteredDepartments);
  };

  const onDepartmentNameChange = (event, field) => {
    field.onChange(event);
    // setDepartmentWiseEmployee(
    //   userList.map((val) => {
    //     return (
    //       val.id ===
    //         officeDepartmentDesignationUser.find((r) => {
    //           return r.userId === event.target.value;
    //         }).userId && val
    //     );
    //   })
    // );
    // setOfficeLocationWiseDepartment(departments);
  };

  return (
    <>
      <Card>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2>
              <FormattedLabel id="notice" />
            </h2>
          </Grid>
        </Grid>
      </Card>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className={styles.small}>
            <Paper
              sx={{
                marginY: "10px",
                paddingY: "10px",
              }}
            >
              <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={index} completed={completed[index]}>
                    <StepButton color="inherit" onClick={handleStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
              <Box>
                {allStepsCompleted() ? (
                  goToNotice()
                ) : (
                  <>
                    <Box>
                      {activeStep === 0 && (
                        <>
                          <Grid container sx={{ padding: "10px" }}>
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
                                id="standard-basic"
                                InputLabelProps={{ shrink: true }}
                                label={<FormattedLabel id="serialNo" />}
                                variant="standard"
                                {...register("serialNo")}
                                error={!!errors.noticeRecivedFromAdvocatePerson}
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
                                fullWidth
                                sx={{ width: "90%" }}
                                autoFocus
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
                              <FormControl
                                error={!!errors.noticeDate}
                                fullWidth
                                sx={{ width: "90%" }}
                              >
                                <Controller
                                  control={control}
                                  name="noticeDate"
                                  defaultValue={null}
                                  render={({ field }) => (
                                    <LocalizationProvider
                                      dateAdapter={AdapterMoment}
                                    >
                                      <DatePicker
                                        inputFormat="DD/MM/YYYY"
                                        label={
                                          <span style={{ fontSize: 16 }}>
                                            {/* Notice Date */}
                                            <FormattedLabel id="noticeDate" />
                                          </span>
                                        }
                                        value={field.value}
                                        onChange={(date) => {
                                          // field.onChange(date)
                                          field.onChange(
                                            moment(date).format("YYYY-MM-DD")
                                          );
                                          console.log(
                                            "moment('2010-10-20').isAfter('2010-01-01', 'year')",
                                            moment(date).isAfter(new Date())
                                          );
                                          setValue(
                                            "requisitionDate",
                                            moment(date).add(45, "days")
                                          );
                                        }}
                                        // selected={field.value}
                                        // center
                                        renderInput={(params) => (
                                          <TextField
                                            fullWidth
                                            {...params}
                                            variant="standard"
                                            size="small"
                                            error={!!errors.noticeDate}
                                            // sx={{ width: 230 }}
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
                                <FormHelperText>
                                  {errors?.noticeDate
                                    ? errors.noticeDate.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
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
                                error={!!errors.noticeRecivedDate}
                                fullWidth
                                sx={{ width: "90%" }}
                              >
                                <Controller
                                  control={control}
                                  name="noticeRecivedDate"
                                  defaultValue={null}
                                  render={({ field }) => (
                                    <LocalizationProvider
                                      dateAdapter={AdapterMoment}
                                    >
                                      <DatePicker
                                        disableFuture
                                        // disablePast={"2023-01-19"}
                                        // minDate={'10/01/2023'}
                                        inputFormat="DD/MM/YYYY"
                                        label={
                                          <span style={{ fontSize: 16 }}>
                                            <FormattedLabel id="noticeRecivedDate" />
                                          </span>
                                        }
                                        value={field.value}
                                        onChange={(date) =>
                                          field.onChange(
                                            moment(date).format("YYYY-MM-DD")
                                          )
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="standard"
                                            size="small"
                                            fullWidth
                                            error={!!errors.noticeRecivedDate}
                                            helperText={
                                              errors?.noticeRecivedDate
                                                ? errors?.noticeRecivedDate
                                                    .message
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
                                <FormHelperText>
                                  {errors?.noticeRecivedDate
                                    ? errors.noticeRecivedDate.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
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
                                id="standard-basic"
                                label={
                                  <FormattedLabel id="noticeRecivedFromAdvocatePerson" />
                                }
                                variant="standard"
                                {...register("noticeRecivedFromAdvocatePerson")}
                                error={!!errors.noticeRecivedFromAdvocatePerson}
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
                              <FormControl
                                style={{ marginTop: 10 }}
                                error={!!errors.requisitionDate}
                                fullWidth
                                sx={{ width: "90%" }}
                              >
                                <Controller
                                  control={control}
                                  name="requisitionDate"
                                  defaultValue={null}
                                  render={({ field }) => (
                                    <LocalizationProvider
                                      dateAdapter={AdapterMoment}
                                    >
                                      <DatePicker
                                        inputFormat="DD/MM/YYYY"
                                        disabled
                                        label={
                                          <span style={{ fontSize: 16 }}>
                                            <FormattedLabel id="requisitionDate" />
                                          </span>
                                        }
                                        value={field.value}
                                        onChange={(date) =>
                                          field.onChange(
                                            moment(date).format("YYYY-MM-DD")
                                          )
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="standard"
                                            error={!!errors.requisitionDate}
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
                                <FormHelperText>
                                  {errors?.requisitionDate
                                    ? errors?.requisitionDate.message
                                    : null}
                                </FormHelperText>
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
                                autoFocus
                                sx={{ width: "90%" }}
                                multiline
                                id="standard-basic"
                                label={<FormattedLabel id="noticeDetails" />}
                                variant="standard"
                                {...register("noticeDetails")}
                                error={!!errors.noticeDetails}
                                helperText={
                                  errors?.noticeDetails
                                    ? errors.noticeDetails.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                multiline
                                fullWidth
                                sx={{ width: "97%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="advocateAddress" />}
                                variant="standard"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                {...register("advocateAddress")}
                                error={!!errors.advocateAddress}
                                helperText={
                                  errors?.advocateAddress
                                    ? errors.advocateAddress.message
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
                            <Grid item xs={12}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Modal
                                  open={open}
                                  onClose={handleClose}
                                  aria-labelledby="modal-modal-title"
                                  aria-describedby="modal-modal-description"
                                >
                                  <form>
                                    <Box sx={style}>
                                      <Grid
                                        container
                                        sx={{
                                          display: "flex",
                                          flexDirection: "row",
                                          padding: "10px",
                                        }}
                                      >
                                        <Grid
                                          item
                                          xs={6}
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
                                          >
                                            <InputLabel id="demo-simple-select-label">
                                              <FormattedLabel id="deptName" />
                                            </InputLabel>
                                            <Controller
                                              render={({ field }) => (
                                                <Select
                                                  labelId="demo-simple-select-label"
                                                  id="demo-simple-select"
                                                  label="Office Location"
                                                  value={field.value}
                                                  onChange={(e) =>
                                                    onOfficeLocationChange(
                                                      e,
                                                      field
                                                    )
                                                  }
                                                  style={{
                                                    backgroundColor: "white",
                                                  }}
                                                >
                                                  {officeLocationList.length > 0
                                                    ? officeLocationList.map(
                                                        (val, id) => {
                                                          return (
                                                            <MenuItem
                                                              key={id}
                                                              value={val.id}
                                                              style={{
                                                                display:
                                                                  val.officeLocationName
                                                                    ? "flex"
                                                                    : "none",
                                                              }}
                                                            >
                                                              {
                                                                val.officeLocationName
                                                              }
                                                            </MenuItem>
                                                          );
                                                        }
                                                      )
                                                    : "Not Available"}
                                                </Select>
                                              )}
                                              name={`locationName`}
                                              control={control}
                                              defaultValue={null}
                                            />
                                            <FormHelperText
                                              style={{ color: "red" }}
                                            >
                                              {/* {`errors.concernDeptUser.[${index}].locationName` && "Required"} */}
                                            </FormHelperText>
                                          </FormControl>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={6}
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <FormControl
                                            size="small"
                                            fullWidth
                                            sx={{ width: "90%" }}
                                          >
                                            <InputLabel id="demo-simple-select-standard-label">
                                              {/* <FormattedLabel id="officeLocation" /> */}
                                              <FormattedLabel id="subDepartment" />
                                            </InputLabel>
                                            <Controller
                                              render={({ field }) => (
                                                <Select
                                                  labelId="demo-simple-select-label"
                                                  id="demo-simple-select"
                                                  label="Department Name"
                                                  value={field.value}
                                                  onChange={(e) =>
                                                    onDepartmentNameChange(
                                                      e,
                                                      field
                                                    )
                                                  }
                                                  style={{
                                                    backgroundColor: "white",
                                                  }}
                                                >
                                                  {officeLocationWiseDepartment.length >
                                                  0
                                                    ? officeLocationWiseDepartment.map(
                                                        (user, index) => {
                                                          return (
                                                            <MenuItem
                                                              key={index}
                                                              value={user.id}
                                                              style={{
                                                                display:
                                                                  user.department
                                                                    ? "flex"
                                                                    : "none",
                                                              }}
                                                            >
                                                              {user.department}
                                                            </MenuItem>
                                                          );
                                                        }
                                                      )
                                                    : []}
                                                </Select>
                                              )}
                                              name={`departmentName`}
                                              control={control}
                                              defaultValue={null}
                                            />
                                            <FormHelperText
                                              style={{ color: "red" }}
                                            >
                                              {/* {`errors.concernDeptUser.[${index}].departmentName` && "Required"} */}
                                            </FormHelperText>
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                      <Box
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-evenly",
                                          padding: "10px",
                                        }}
                                      >
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          onClick={() => {
                                            updateNoticeData();
                                          }}
                                        >
                                          SAVE
                                        </Button>
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          onClick={handleClose}
                                        >
                                          CANCEL
                                        </Button>
                                      </Box>
                                    </Box>
                                  </form>
                                </Modal>
                              </div>
                            </Grid>
                          </Grid>

                          {/* 2nd Row */}
                          <Grid container>
                            <>
                              {/* <Grid container sx={{ padding: "10px" }}>
                                <Grid item xs={10} />
                                <Grid
                                  item
                                  xs={2}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                      appendUI();
                                    }}
                                  >
                                    <FormattedLabel id="addMore" />
                                  </Button>
                                </Grid>
                              </Grid> */}
                              <Grid container sx={{ padding: "10px" }}>
                                <DataGrid
                                  sx={{
                                    overflowY: "scroll",

                                    "& .MuiDataGrid-virtualScrollerContent": {},
                                    "& .MuiDataGrid-columnHeadersInner": {
                                      backgroundColor: "#556CD6",
                                      color: "white",
                                    },

                                    "& .MuiDataGrid-cell:hover": {
                                      color: "primary.main",
                                    },
                                  }}
                                  density="compact"
                                  autoHeight={true}
                                  pagination
                                  paginationMode="server"
                                  rows={rowsData}
                                  columns={_col}
                                  onPageChange={(_data) => {}}
                                  onPageSizeChange={(_data) => {}}
                                />
                              </Grid>
                              <Grid container>
                                {/* {fields.map((witness, index) => {
                                  return (
                                    <Grid
                                      key={index}
                                      container
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        padding: "10px",
                                      }}
                                    >
                                      <Grid
                                        item
                                        xs={8}
                                        sm={5}
                                        md={5}
                                        lg={5}
                                        xl={5}
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
                                        >
                                          <InputLabel id="demo-simple-select-label">
                                            <FormattedLabel id="deptName" />
                                          </InputLabel>
                                          <Controller
                                            render={({ field }) => (
                                              <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Office Location"
                                                value={field.value}
                                                onChange={(e) => {
                                                  field.onChange(event);
                                                  let filteredDepartments = [
                                                    ...departments,
                                                  ];
                                                  filteredDepartments =
                                                    filteredDepartments.filter(
                                                      (val) => {
                                                        return (
                                                          val.id ===
                                                            officeDepartmentDesignationUser?.find(
                                                              (r) => {
                                                                return (
                                                                  r.departmentId ===
                                                                  event.target
                                                                    .value
                                                                );
                                                              }
                                                            )?.departmentId &&
                                                          val
                                                        );
                                                      }
                                                    );
                                                  setOfficeLocationWiseDepartment(
                                                    filteredDepartments
                                                  );
                                                }}
                                                style={{
                                                  backgroundColor: "white",
                                                }}
                                              >
                                                {officeLocationList.length > 0
                                                  ? officeLocationList.map(
                                                      (val, id) => {
                                                        return (
                                                          <MenuItem
                                                            key={id}
                                                            value={val.id}
                                                            style={{
                                                              display:
                                                                val.officeLocationName
                                                                  ? "flex"
                                                                  : "none",
                                                            }}
                                                          >
                                                            {
                                                              val.officeLocationName
                                                            }
                                                          </MenuItem>
                                                        );
                                                      }
                                                    )
                                                  : "Not Available"}
                                              </Select>
                                            )}
                                            name={`concernDeptUser[${index}].locationName`}
                                            control={control}
                                            defaultValue={null}
                                            key={witness.id}
                                          />
                                          <FormHelperText
                                            style={{ color: "red" }}
                                          >
                                            {`errors.concernDeptUser.[${index}].locationName` && "Required"}
                                          </FormHelperText>
                                        </FormControl>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={8}
                                        sm={5}
                                        md={5}
                                        lg={5}
                                        xl={5}
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <FormControl
                                          size="small"
                                          fullWidth
                                          sx={{ width: "90%" }}
                                        >
                                          <InputLabel id="demo-simple-select-standard-label">
                                            <FormattedLabel id="subDepartment" />
                                          </InputLabel>
                                          <Controller
                                            render={({ field }) => (
                                              <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Department Name"
                                                value={field.value}
                                                onChange={(event) =>
                                                  field.onChange(event)
                                                }
                                                style={{
                                                  backgroundColor: "white",
                                                }}
                                              >
                                                {officeLocationWiseDepartment.length >
                                                0
                                                  ? officeLocationWiseDepartment.map(
                                                      (user, index) => {
                                                        return (
                                                          <MenuItem
                                                            key={index}
                                                            value={user.id}
                                                            style={{
                                                              display:
                                                                user.department
                                                                  ? "flex"
                                                                  : "none",
                                                            }}
                                                          >
                                                            {user.department}
                                                          </MenuItem>
                                                        );
                                                      }
                                                    )
                                                  : []}
                                              </Select>
                                            )}
                                            name={`concernDeptUser[${index}].departmentName`}
                                            control={control}
                                            defaultValue={null}
                                          />
                                          <FormHelperText
                                            style={{ color: "red" }}
                                          >
                                            {`errors.concernDeptUser.[${index}].departmentName` && "Required"}
                                          </FormHelperText>
                                        </FormControl>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={2}
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Button
                                          variant="contained"
                                          size="small"
                                          startIcon={<DeleteIcon />}
                                          style={{
                                            color: "white",
                                            backgroundColor: "red",
                                            height: "30px",
                                          }}
                                          onClick={() => {
                                            remove(index);
                                          }}
                                        >
                                          <FormattedLabel id="delete" />
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  );
                                })} */}
                              </Grid>
                            </>
                            <FooterButtons
                              handleBack={handleBack}
                              activeStep={activeStep}
                              steps={steps}
                            />
                          </Grid>
                        </>
                      )}
                    </Box>
                    <Box>
                      {activeStep === 1 && (
                        <>
                          {/* File Upload */}
                          <FileTable
                            appName="LCMS" //Module Name
                            serviceName={"L-Notice"} //Transaction Name
                            fileName={attachedFile} //State to attach file
                            filePath={setAttachedFile} // File state upadtion function
                            newFilesFn={setAdditionalFiles} // File data function
                            columns={columns} //columns for the table
                            rows={finalFiles} //state to be displayed in table
                            uploading={setUploading}
                            showNoticeAttachment={
                              router.query.showNoticeAttachment
                            }
                          />
                          <div
                            className={styles.box}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Grid container sx={{ padding: "10px" }}>
                              <Grid item xs={1}>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  size="small"
                                  onClick={() =>
                                    router.push(
                                      `/LegalCase/transaction/newNotice/`
                                    )
                                  }
                                >
                                  <FormattedLabel id="exit" />
                                </Button>
                              </Grid>
                              <Grid item xs={1}>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  onClick={handleBack}
                                  size="small"
                                >
                                  <FormattedLabel id="back" />
                                </Button>
                              </Grid>
                              <Grid item xs={7}></Grid>
                              <Grid
                                item
                                xs={2}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {activeStep !== steps.length && (
                                  <Box>
                                    <Button
                                      color="primary"
                                      variant="contained"
                                      onClick={finalSubmit}
                                      size="small"
                                    >
                                      <FormattedLabel id="saveAsDraft" />
                                    </Button>
                                  </Box>
                                )}
                              </Grid>
                              <Grid item xs={1}>
                                {activeStep !== steps.length && (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                    onClick={finalSubmit}
                                    name="buttonname"
                                    value="hiddenvalue"
                                  >
                                    <FormattedLabel id="save" />
                                  </Button>
                                )}
                              </Grid>
                            </Grid>
                          </div>
                        </>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default EditNotice;
