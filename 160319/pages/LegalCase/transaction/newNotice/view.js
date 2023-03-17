import React from "react";
import { useRouter } from "next/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../../../styles/LegalCase_Styles/view.module.css";
import Modal from "@mui/material/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
// import DataLoader from '../../../../features/DataLoader'
import {
  Card,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Paper,
  IconButton,
  Stepper,
  Step,
  StepButton,
  Checkbox,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
// import BasicLayout from '../../../../containers/Layout/BasicLayout'
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import axios from "axios";
import sweetAlert from "sweetalert";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import swal from "sweetalert";
import FileTable from "../../FileUpload/FileTable copy";
import * as yup from "yup";
import moment from "moment";
import { useSelector } from "react-redux";
import OutlinedInput from "@mui/material/OutlinedInput";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import newNoticeSchema from "../../../../containers/schema/LegalCaseSchema/newNoticeSchema";
import urls from "../../../../URLS/urls";
import SelectOfficeDepartments from "./SelectOfficeDepartments";
import FooterButtons from "./FooterButtons";
import { DataGrid } from "@mui/x-data-grid";

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

const View = () => {
  const {
    register,
    control,
    handleSubmit,
    // @ts-ignore
    methods,
    watch,
    setValue,
    reset,
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

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "concernDeptUser",
      rules: {
        required: true,
        message: "At least one is required",
      },
      control,
    }
  );

  const router = useRouter();
  const [noticeDetails, setNoticeDetails] = useState({});
  const [departments, setDepartments] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [faltugiri, setfaltugiri] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const selectedNotice = useSelector((state) => {
    return state.user.selectedNotice;
  });

  const [rowsData, setRowsData] = useState([]);

  useEffect(() => {
    console.log("rowsData11", rowsData);
  }, [rowsData]);

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

  const steps = [
    <FormattedLabel key={1} id="noticeDetails" />,
    <FormattedLabel key={2} id="documentUpload" />,
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const [personName, setPersonName] = useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [courtCaseEntries, setCourtCaseEntries] = useState([]);

  const [noticeNumber, setNoticeNumber] = useState();

  const [officeLocationWiseDepartment, setOfficeLocationWiseDepartment] =
    useState([]);
  const [departmentWiseEmployee, setDepartmentWiseEmployee] = useState([]);
  const [officeDepartmentDesignationUser, setOfficeDepartmentDesignationUser] =
    useState(null);

  // let _arr = [];
  const [_arr, setArr] = useState([]);

  useEffect(() => {
    getUserName();
    getOfficeLocation();
    getCourtCaseNumber();
    getNoticeNumber();
  }, []);

  useEffect(() => {
    getOfficeDepartmentDesignationUser();
    console.log("router.query.caseNumber", router.query);
    setValue("courtCaseNumber", router.query.caseNumber);
    setValue("serialNo", 1);
  }, []);

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
        if (r.status == 200) {
          console.log("res newCourtCaseEntry", r);
          setCourtCaseEntries(r.data.newCourtCaseEntry);
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
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
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
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.API_file}/discard?filePath=${toDelete}`)
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
    //     align: "center",
    // headerAlign: "center",
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
      // field: language ==='en'?'attachedNameMr':'attachedNameEn',
      flex: 1,
      // width: 300,
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
  ];

  // useEffect(() => {
  //   if (router?.query?.pageMode === 'Edit') {
  //     setAttachedFile(router?.query?.attachedFile)
  //   }
  // }, [])

  useEffect(() => {
    getDepartments();
    if (router.query.pageMode === "Edit") {
      // reset(router.query);
      reset(selectedNotice);
      // let res;
      // officeLocationList.map((val) => {
      //   let childEle = selectedConcernDeptUserListToSend.filter((value) => {
      //     return val.id == value.locationId;
      //   });
      //   res.push(...childEle);
      // });

      // setOfficeLocationList(res);

      // selectedConcernDeptUserListToSend.map((val) => {
      //   return append({
      //     locationName: val.locationId,
      //     employeeName: val.empoyeeId,
      //     departmentName: val.departmentId,
      //   });
      // });

      append({
        locationName: "",
        employeeName: "",
        departmentName: "",
      });
      // attachedFileEdit = router.query.attachedFile
    }
  }, [officeLocationList]);

  // useEffect(() => {
  //   setValue('attachedFile', attachedFile)
  // }, [attachedFile])

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

    console.log("abc", abc);
  };
  
  // const [faltugiri, setfaltugiri] = useState([null])
  const finalSubmit = (data) => {
    console.log("additionalFiles", additionalFiles);
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();

    setfaltugiri(
      additionalFiles.map((Obj, index) => {
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

    console.log("data", noticeDetails, moment(new Date()).unix().toString());

    const bodyForAPI = {
      ...noticeDetails,
      timeStamp: moment(new Date()).unix().toString(),
      // noticeAttachment: faltugiri,

      concernDeptUser: noticeDetails?.concernDeptUser
        .map((val, index) => val.employeeName)
        .toString(),

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
      id: Number(noticeDetails.id),

      pageMode:
        data.target.textContent === "Save" ? "NOTICE_CREATE" : "NOTICE_DRAFT",
    };

    console.log("Final Data: ", bodyForAPI);
    //CREATE, EDIT,APPROVE

    //noticeDetails?.concernDeptUser

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
  return (
    <>
      {/* <Card>
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
      </Card> */}

      

      <FormProvider {...methods}>
      {/* <Box
        style={{
          display: "flex",
          justifyContent: "center",
          // marginLeft:'50px',
          paddingTop: "10px",
          marginTop: "20px",

          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Typography
          style={{
            display: "flex",
            marginLeft: "100px",
            color: "white",
            justifyContent: "center",
          }}
        >
          <h2>
            Notice
          </h2>
        </Typography>
      </Box> */}
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

               <br></br>
              <Box>
                {allStepsCompleted() ? (
                  goToNotice()
                ) : (
                  <>
                    <Box>
                      {activeStep === 0 && (
                        <>

                        
                      <Box
                        style={{
                          display: "flex",
                          // justifyContent: "center",
                          // marginLeft:'50px',
                          paddingTop: "10px",
                          // marginTop: "20px",
                                  

                          background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                      >
                        <Typography
                           style={{
                            display: "flex",
                            marginLeft: "30px",
                            color: "white",
                            float:"left"
                            // justifyContent: "center",
                          }}
                        >
                          <h2>
                            {/* Notice Details */}
                            <FormattedLabel id="noticeDetails"/>
                          </h2>
                        </Typography>
                      </Box>

                      {/* 1st Row */}
                      <Grid container sx={{ padding: "10px" , marginTop:"30px"}}>

{/* Serail Number */}
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
  />
</Grid>

{/* Inward Number */}
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
    helperText={
      errors?.inwardNo
        ? errors.inwardNo.message
        : null
    }
  />
</Grid>

{/* notice Date */}
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
              />
            )}
          />
        </LocalizationProvider>
      )}
    />
    <FormHelperText sx={{ marginLeft: 0 }}>
      {errors?.noticeDate
        ? errors.noticeDate.message
        : null}
    </FormHelperText>
  </FormControl>
</Grid>

                      </Grid>


                        {/* 2nd Row */}
                          <Grid container sx={{ padding: "10px" }}>
                            {/* notice received data */}
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
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  )}
                                />
                                <FormHelperText sx={{ marginLeft: 0 }}>
                                  {errors?.noticeRecivedDate
                                    ? errors.noticeRecivedDate.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>



                              {/* Notice Received from Advocate in English */}
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
                                  <FormattedLabel id="noticeReceviedFromAdvocateEn" />
                                }

                                // label="Notice Recived from Advocate (In English)"
                                variant="standard"
                                {...register("noticeRecivedFromAdvocatePerson")}
                                error={!!errors.noticeRecivedFromAdvocatePerson}
                                helperText={
                                  errors?.noticeRecivedFromAdvocatePerson
                                    ? errors.noticeRecivedFromAdvocatePerson
                                        .message
                                    : null
                                }
                              />
                            </Grid>


                            {/* Notice Recived from Advocate in Marathi */}
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
                                  <FormattedLabel id="noticeReceviedFromAdvocateMr" />
                                }

                                // label="Notice Recived from Advocate (In Marathi)"
                                variant="standard"
                                {...register("noticeRecivedFromAdvocatePersonMr")}
                                error={!!errors.noticeRecivedFromAdvocatePersonMr}
                                helperText={
                                  errors?.noticeRecivedFromAdvocatePersonMr
                                    ? errors.noticeRecivedFromAdvocatePersonMr
                                        .message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>

                          {/* 3rd row */}
                          <Grid container sx={{ padding: "10px" }}>
                          


                            {/* requisitionDate */}
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
                              <FormControl fullWidth sx={{ width: "90%" }}>
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
                                            size="small"
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  )}
                                />
                              </FormControl>
                            </Grid>


                            {/* noticeDetails in English */}
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
                                label={<FormattedLabel id="noticeDetailsEn" />}
                                // label="Notice Details (In English)"

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


                            {/* Notice Details in Marathi */}
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
                                label={<FormattedLabel id="noticeDetailsMr" />}
                                // label="Notice Details (In Marathi)"
                                variant="standard"
                                {...register("noticeDetailsMr")}
                                error={!!errors.noticeDetailsMr}
                                helperText={
                                  errors?.noticeDetailsMr
                                    ? errors.noticeDetailsMr.message
                                    : null
                                }
                              />
                            </Grid>

                          </Grid>

                          {/* 4th row */}
                          <Grid container sx={{ padding: "10px" }}>

                          {/* advocateAddress in English */}
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
                                label={<FormattedLabel id="advocateAddressEn" />}
                                // label="Advocate Address (In English)"

                                variant="standard"
                                {...register("advocateAddress")}
                                error={!!errors.advocateAddress}
                                helperText={
                                  errors?.advocateAddress
                                    ? errors.advocateAddress.message
                                    : null
                                }
                              />
                            </Grid>


                            {/* Advocate Address in Marathi */}
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
                                marginTop:"10px"
                              }}
                            >
                              <TextField
                                multiline
                                fullWidth
                                sx={{ width: "97%" }}
                                id="standard-basic"
                                label={<FormattedLabel id="advocateAddressMr" />}
                                // label="Advocate Address (In Marathi)"
                                variant="standard"
                                {...register("advocateAddressMr")}
                                error={!!errors.advocateAddressMr}
                                helperText={
                                  errors?.advocateAddressMr
                                    ? errors.advocateAddressMr.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>

                          {/* 5th Row */}
                          <Grid container sx={{marginTop:"25px"}}>

                          {/* deptName */}
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
                              }}
                            >
                              <FormControl
                                fullWidth
                                size="small"
                                sx={{ width: "90%" }}
                                // error={
                                //   rowsData.length === 0 && !!errors.oficeLocationId
                                // }
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="deptName" />
                                </InputLabel>

                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label={<FormattedLabel id="deptName" />}
                                      value={field.value}
                                      // onChange={(value) => field.onChange(value)}
                                      onChange={(value) => {
                                        field.onChange(value);
                                        let filteredDepartments = [
                                          ...departments,
                                        ];
                                        filteredDepartments =
                                          filteredDepartments.filter((val) => {
                                            return (
                                              val.id ===
                                                officeDepartmentDesignationUser?.find(
                                                  (r) => {
                                                    return (
                                                      r.departmentId ===
                                                      value.target.value
                                                    );
                                                  }
                                                )?.departmentId && val
                                            );
                                          });
                                        setOfficeLocationWiseDepartment(
                                          filteredDepartments
                                        );
                                      }}
                                      style={{ backgroundColor: "white" }}
                                    >
                                      {officeLocationList.length > 0
                                        ? officeLocationList.map(
                                            (department, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={department.id}
                                                >
                                                  {/* {
                                                    department.officeLocationName
                                                    
                                                  } */}

                                                 {language == "en"
                                                ? department?.officeLocationName
                                                : department?.officeLocationNameMar}
                                                
                                                </MenuItem>
                                              );
                                            }
                                          )
                                        : []}
                                    </Select>
                                  )}
                                  name="locationName"
                                  // name="oficeLocationId"
                                  control={control}
                                  defaultValue=""
                                />
                                {/* <FormHelperText style={{ color: "red" }}>
                                  {rowsData.length === 0 && errors?.oficeLocationId
                                    ? errors.oficeLocationId.message
                                    : null}
                                </FormHelperText> */}
                              </FormControl>
                            </Grid>

                            {/* sub Department name */}
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
                              }}
                            >
                              <FormControl
                                fullWidth
                                size="small"
                                sx={{ width: "90%" }}
                                // error={
                                //   rowsData.length === 0 &&
                                //   !!errors.department
                                // }
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  <FormattedLabel id="subDepartment" />
                                </InputLabel>

                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      label={
                                        <FormattedLabel id="subDepartment" />
                                      }
                                      value={field.value}
                                      // onChange={(value) => field.onChange(value)}
                                      onChange={(value) => {
                                        field.onChange(value);
                                        // setSelectedDepartment(
                                        //   value.target.value
                                        // );
                                      }}
                                      style={{ backgroundColor: "white" }}
                                    >
                                      {officeLocationWiseDepartment.length > 0
                                        ? officeLocationWiseDepartment.map(
                                            (user, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={user.id}
                                                  style={{
                                                    display: user.department
                                                      ? "flex"
                                                      : "none",
                                                  }}
                                                >
                                                  {/* {user.department} */}


                                                  {language == "en"
                                                  ? user?.department
                                                  : user?.departmentMr
                                                  }

                                                </MenuItem>
                                              );
                                            }
                                          )
                                        : []}
                                    </Select>
                                  )}
                                  name="departmentName"
                                  // name="department"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText style={{ color: "red" }}>
                                  {rowsData.length === 0 &&
                                    (errors?.departmentName
                                      ? errors.departmentName.message
                                      : null)}
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
                                disabled={
                                  typeof watch("departmentName") == "string" &&
                                  typeof watch("locationName" == "string")
                                }
                                variant="contained"
                                size="small"
                                onClick={(e, index) => {
                                  let obj = {
                                    departmentId: watch("departmentName"),
                                    locationId: watch("locationName"),
                                    empoyeeId: null,
                                    index: index,
                                  };

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
                                }}
                              >
                                <FormattedLabel id="addMore" />
                              </Button>
                            </Grid>


                            {/* <SelectOfficeDepartments
                              officeDepartmentDesignationUser={
                                officeDepartmentDesignationUser
                              }
                              officeLocationList={officeLocationList}
                              userList={userList}
                              officeLocationWiseDepartment={
                                officeLocationWiseDepartment
                              }
                              setOfficeLocationWiseDepartment={
                                setOfficeLocationWiseDepartment
                              }
                              setDepartmentWiseEmployee={
                                setDepartmentWiseEmployee
                              }
                              departments={departments}
                              control={control}
                              errors={errors}
                              fields={fields}
                              remove={remove}
                              appendUI={appendUI}
                            /> */}
                          </Grid>



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
                          {/* <div
                        className={styles.box}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Button
                            color="primary"
                            variant="contained"
                            sx={{ marginRight: "2vw" }}
                            onClick={() =>
                              router.push(`/LegalCase/transaction/newNotice/`)
                            }
                          >
                            Exit
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            Back
                          </Button>
                        </div>
                        {activeStep !== steps.length && (
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={finalSubmit}
                          >
                            Finish
                          </Button>
                        )}
                      </div> */}
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

export default View;

// import React from "react";
// import { useRouter } from "next/router";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { yupResolver } from "@hookform/resolvers/yup";
// import styles from "./view.module.css";
// import Modal from "@mui/material/Modal";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";

// // import DataLoader from '../../../../features/DataLoader'
// import {
//   Card,
//   Button,
//   FormControl,
//   FormHelperText,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Paper,
//   IconButton,
//   Stepper,
//   Step,
//   StepButton,
//   Checkbox,
//   ListItemText,
//   Box,
// } from "@mui/material";
// // import BasicLayout from '../../../../containers/Layout/BasicLayout'
// import {
//   Controller,
//   FormProvider,
//   useForm,
//   useFieldArray,
// } from "react-hook-form";
// import schema from "./schema";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import ClearIcon from "@mui/icons-material/Clear";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import SaveIcon from "@mui/icons-material/Save";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import sweetAlert from "sweetalert";
// import { Delete, Edit, Visibility } from "@mui/icons-material";
// import swal from "sweetalert";
// import FileTable from "../../FileUpload/FileTable";
// import * as yup from "yup";
// import moment from "moment";
// import { useSelector } from "react-redux";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// import newNoticeSchema from "../../../../containers/schema/LegalCaseSchema/newNoticeSchema";

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// const view = () => {
//   let noticeSchema = yup.object().shape({
//     // noticeDate: yup.string().nullable().required("Notice date is Required"),
//     // noticeRecivedDate: yup
//     //   .string()
//     //   .nullable()
//     //   .required("Notice Received date is Required"),
//     // noticeRecivedFromAdvocatePerson: yup
//     //   .string()
//     //   .required("Please enter the name of Advocate."),
//     // department: yup.string().required("Please select Department name."),
//     // requisitionDate: yup
//     //   .string()
//     //   .nullable()
//     //   .required("Requisition Date is Required"),
//   });
//   const {
//     register,
//     control,
//     handleSubmit,
//     // @ts-ignore
//     methods,
//     // setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     criteriaMode: "all",
//     resolver: yupResolver(newNoticeSchema),
//     mode: "onChange",
//     defaultValues: {
//       concernDeptUser: [
//         { locationName: "", employeeName: "", departmentName: "" },
//       ],
//     },
//   });

//   const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
//     {
//       name: "concernDeptUser",
//       rules: {
//         required: true,
//         message: "At least one is required",
//       },
//       control,
//     }
//   );

//   const router = useRouter();
//   const [noticeDetails, setNoticeDetails] = useState({});
//   const [departments, setDepartments] = useState([]);
//   const [attachedFile, setAttachedFile] = useState("");
//   const [mainFiles, setMainFiles] = useState([]);
//   const [additionalFiles, setAdditionalFiles] = useState([]);
//   const [finalFiles, setFinalFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [faltugiri, setfaltugiri] = useState([]);

//   const language = useSelector((state) => state.labels.language);
//   const token = useSelector((state) => state.user.user.token);
//   const selectedConcernDeptUserListToSend = useSelector((state) => {
//     console.log(
//       "selectedConcernDeptUserListToSend",
//       state.user.selectedConcernDeptUserListToSend
//     );
//     return state.user.selectedConcernDeptUserListToSend;
//   });

//   //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

//   const steps = ["Notice Details", "Document Upload"];
//   const [activeStep, setActiveStep] = useState(0);
//   const [completed, setCompleted] = useState({});

//   const [personName, setPersonName] = useState([]);
//   const [officeLocationList, setOfficeLocationList] = useState([]);
//   const [userList, setUserList] = useState([]);
//   const [courtCaseEntries, setCourtCaseEntries] = useState([]);

//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [officeLocationWiseDepartment, setOfficeLocationWiseDepartment] =
//     useState([]);
//   const [departmentWiseEmployee, setDepartmentWiseEmployee] = useState([]);
//   const [officeDepartmentDesignationUser, setOfficeDepartmentDesignationUser] =
//     useState(null);

//   useEffect(() => {
//     getUserName();
//     getOfficeLocation();
//     getCourtCaseNumber();
//   }, []);

//   useEffect(() => {
//     getOfficeDepartmentDesignationUser();
//   }, []);

//   const getCourtCaseNumber = async () => {
//     await axios
//       .get("http://localhost:8098/lc/api/transaction/newCourtCaseEntry/getAll")
//       .then((r) => {
//         if (r.status == 200) {
//           console.log("res newCourtCaseEntry", r);
//           setCourtCaseEntries(r.data.newCourtCaseEntry);
//         }
//       })
//       .catch((err) => {
//         console.log("err", err);
//       });
//   };

//   const getUserName = async () => {
//     await axios
//       .get("http://localhost:8090/cfc/api/master/user/getAll")
//       .then((r) => {
//         if (r.status == 200) {
//           console.log("res user", r);
//           setUserList(r.data.user);
//         }
//       })
//       .catch((err) => {
//         console.log("err", err);
//       });
//   };

//   const getOfficeLocation = () => {
//     axios
//       .get("http://localhost:8090/cfc/api/master/mstOfficeLocation/getAll")
//       .then((r) => {
//         if (r.status == 200) {
//           console.log("res office location", r);
//           setOfficeLocationList(r.data.officeLocation);
//         }
//       })
//       .catch((err) => {
//         console.log("err", err);
//       });
//   };

//   const handleChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setPersonName(
//       // On autofill we get a stringified value.
//       typeof value === "string" ? value.split(",") : value
//     );
//   };

//   const totalSteps = () => {
//     return steps.length;
//   };

//   const completedSteps = () => {
//     return Object.keys(completed).length;
//   };

//   const isLastStep = () => {
//     return activeStep === totalSteps() - 1;
//   };

//   const allStepsCompleted = () => {
//     return completedSteps() === totalSteps();
//   };

//   const handleNext = () => {
//     const newActiveStep =
//       isLastStep() && !allStepsCompleted()
//         ? // It's the last step, but not all steps have been completed,
//           // find the first step that has been completed
//           steps.findIndex((step, i) => !(i in completed))
//         : activeStep + 1;
//     setActiveStep(newActiveStep);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     const newCompleted = completed;
//     newCompleted[activeStep - 1] = false;
//     setCompleted(newCompleted);
//   };

//   const handleStep = (step) => () => {
//     setActiveStep(step);
//   };

//   // const handleReset = () => {
//   //   setActiveStep(0)
//   //   setCompleted({})
//   // }

//   //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

//   useEffect(() => {
//     console.log("Language bol: ", language);
//     console.log("Table Files: ", additionalFiles);
//     setFinalFiles([...mainFiles, ...additionalFiles]);
//   }, [mainFiles, additionalFiles]);

//   const discard = async (toDelete, srNo) => {
//     console.log("Table data:", finalFiles);
//     swal({
//       title: "Delete?",
//       text: "Are you sure you want to delete the file ? ",
//       icon: "warning",
//       buttons: ["Cancel", "Delete"],
//       dangerMode: true,
//     }).then((willDelete) => {
//       if (willDelete) {
//         axios
//           .delete(
//             `http://localhost:8090/cfc/api/file/discard?filePath=${toDelete}`
//           )
//           .then((res) => {
//             if (res.status === 200) {
//               swal("File Deleted Successfully!", { icon: "success" });

//               let tempArr = [];

//               additionalFiles.forEach((obj) => {
//                 // @ts-ignore
//                 if (obj.srNo !== srNo) {
//                   tempArr.push(obj);
//                 }
//               });

//               // @ts-ignore
//               setAdditionalFiles([...tempArr]);
//             } else {
//               swal("Something went wrong..!!!");
//             }
//           });
//       } else {
//         swal("File is Safe");
//       }
//     });
//   };

//   const columns = [
//     // {
//     //   headerName: 'Sr.No',
//     //   field: 'srNo',
//     //   width: 100,
//     //   // flex: 1,
//     // },
//     {
//       headerName: "File Name",
//       field: "originalFileName",
//       // width: 300,
//       flex: 0.7,
//     },
//     {
//       headerName: "File Type",
//       field: "extension",
//       width: 140,
//     },
//     {
//       headerName: "Uploaded By",
//       field: language === "en" ? "attachedNameEn" : "attachedNameMr",
//       // field: language ==='en'?'attachedNameMr':'attachedNameEn',
//       flex: 1,
//       // width: 300,
//     },
//     {
//       field: "Action",
//       headerName: "Action",
//       width: 200,
//       // flex: 1,

//       renderCell: (record) => {
//         return (
//           <>
//             <IconButton
//               color="primary"
//               onClick={() => {
//                 window.open(
//                   `http://localhost:8090/cfc/api/file/preview?filePath=${record.row.attachmentName}`,
//                   "_blank"
//                 );
//               }}
//             >
//               <Visibility />
//             </IconButton>

//             <IconButton
//               color="error"
//               onClick={() =>
//                 discard(record.row.attachmentName, record.row.srNo)
//               }
//             >
//               <Delete />
//             </IconButton>
//           </>
//         );
//       },
//     },
//   ];

//   // useEffect(() => {
//   //   if (router?.query?.pageMode === 'Edit') {
//   //     setAttachedFile(router?.query?.attachedFile)
//   //   }
//   // }, [])

//   useEffect(() => {
//     getDepartments();
//     console.log(
//       "router.query",
//       router.query,
//       selectedConcernDeptUserListToSend
//     );
//     if (router.query.pageMode === "Edit") {
//       // setAttachedFile(router.query.attachedFile);
//       reset(router.query);
//       // let res;
//       // officeLocationList.map((val) => {
//       //   let childEle = selectedConcernDeptUserListToSend.filter((value) => {
//       //     return val.id == value.locationId;
//       //   });
//       //   res.push(...childEle);
//       // });

//       // setOfficeLocationList(res);

//       // selectedConcernDeptUserListToSend.map((val) => {
//       //   return append({
//       //     locationName: val.locationId,
//       //     employeeName: val.empoyeeId,
//       //     departmentName: val.departmentId,
//       //   });
//       // });

//       append({
//         locationName: "",
//         employeeName: "",
//         departmentName: "",
//       });
//       // attachedFileEdit = router.query.attachedFile
//     }
//   }, [officeLocationList]);

//   // useEffect(() => {
//   //   setValue('attachedFile', attachedFile)
//   // }, [attachedFile])

//   const getOfficeDepartmentDesignationUser = () => {
//     axios
//       .get(
//         `http://localhost:8090/cfc/api/master/officeDepartmentDesignationUser/getAll`
//       )
//       .then((res) => {
//         console.log("323", res.data.officeDepartmentDesignationUser);
//         setOfficeDepartmentDesignationUser(
//           res.data.officeDepartmentDesignationUser
//         );
//       });
//   };

//   const getDepartments = () => {
//     axios
//       .get(`http://localhost:8090/cfc/api/master/department/getAll`)
//       .then((res) => {
//         setDepartments(
//           res.data.department.map((r, i) => ({
//             id: r.id,
//             department: r.department,
//             departmentMr:r.departmentMr

//           }))
//         );
//       });
//   };
//   const appendUI = () => {
//     append({
//       locationName: "",
//       employeeName: "",
//       departmentName: "",
//     });
//   };

//   const onSubmitForm = (data) => {
//     const newCompleted = completed;
//     newCompleted[activeStep] = true;
//     setCompleted(newCompleted);
//     handleNext();

//     setNoticeDetails(data);
//   };
//   // const [faltugiri, setfaltugiri] = useState([null])
//   const finalSubmit = (data) => {
//     console.log("additionalFiles", additionalFiles);
//     const newCompleted = completed;
//     newCompleted[activeStep] = true;
//     setCompleted(newCompleted);
//     handleNext();

//     setfaltugiri(
//       additionalFiles.map((Obj) => {
//         return {
//           attachedNameEn: Obj.attachedNameEn,
//           attachedNameMr: Obj.attachedNameMr,
//           attachedDate: Obj.attachedDate,
//           originalFileName: Obj.originalFileName,
//           attachmentName: Obj.attachmentName,
//           extension: Obj.extension,
//         };
//       })
//     );

//     console.log("faltugiri<->", faltugiri);

//     // const bodyForNA = {
//     //   ...additionalFiles,
//     //   id:null
//     // }

//     const bodyForAPI = {
//       ...noticeDetails,
//       // noticeAttachment: faltugiri,

//       concernDeptUser: noticeDetails?.concernDeptUser
//         .map((val) => val.employeeName)
//         .toString(),

//       concernDeptUserList: noticeDetails?.concernDeptUser.map((val) => ({
//         departmentId: val.departmentName,
//         locationId: val.locationName,
//         empoyeeId: val.employeeName,
//       })),

//       noticeAttachment: additionalFiles.map((Obj) => {
//         return {
//           attachedNameEn: Obj.attachedNameEn,
//           attachedNameMr: Obj.attachedNameMr,
//           attachedDate: Obj.attachedDate,
//           originalFileName: Obj.originalFileName,
//           attachmentName: Obj.attachmentName,
//           extension: Obj.extension,
//         };
//       }),

//       pageMode:
//         data.target.textContent === "Save" ? "NOTICE_CREATE" : "NOTICE_DRAFT",
//     };

//     console.log("Final Data: ", bodyForAPI);
//     //CREATE, EDIT,APPROVE

//     axios
//       .post(`http://localhost:8098/lc/api/notice/saveTrnNotice`, bodyForAPI, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         if (res.status == 201) {
//           sweetAlert("Saved!", "Record Saved successfully !", "success");
//           router.push(`/LegalCase/transaction/newNotice/`);
//         }
//       });
//   };

//   function goToNotice() {
//     router.push(`/LegalCase/transaction/newNotice`);
//   }
//   return (
//     <>
//       {/* {uploading && <DataLoader />} */}
//       {/* <BasicLayout titleProp={'none'}> */}
//       <Card>
//         <Grid container mt={2} ml={5} mb={5} px={5} height={10}>
//           {/* <Grid item xs={5}></Grid> */}
//           <Grid item xs={5} />
//           <Grid item xs={5.7}>
//             <h2>Notice</h2>
//           </Grid>
//         </Grid>
//       </Card>

//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmitForm)}>
//           <div className={styles.small}>
//             <Paper
//               sx={{
//                 marginLeft: 5,
//                 marginRight: 5,
//                 marginTop: 5,
//                 marginBottom: 5,
//                 padding: 1,
//               }}
//             >
//               <Stepper nonLinear activeStep={activeStep} alternativeLabel>
//                 {steps.map((label, index) => (
//                   <Step
//                     //  key={label}
//                     completed={completed[index]}
//                   >
//                     <StepButton color="inherit" onClick={handleStep(index)}>
//                       {label}
//                     </StepButton>
//                   </Step>
//                 ))}
//               </Stepper>
//               {allStepsCompleted() ? (
//                 goToNotice()
//               ) : (
//                 // <>
//                 //   <h2>Notice Submitted Successfully</h2>
//                 //   <Button
//                 //     color='primary'
//                 //     variant='contained'
//                 //     onClick={handleReset}
//                 //   >
//                 //     Reset
//                 //   </Button>
//                 // </>
//                 <>
//                   {/* Notice Details */}
//                   {activeStep === 0 && (
//                     <>
//                       <Grid container sx={{ padding: "10px" }}>
//                         <Grid
//                           item
//                           xs={4}
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FormControl style={{ width: "65%" }} size="small">
//                             <InputLabel id="demo-simple-select-standard-label">
//                               Court Case Number
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   variant="standard"
//                                   size="small"
//                                   labelId="demo-simple-select-standard-label"
//                                   id="demo-simple-select-standard"
//                                   label="Court Case Number"
//                                   // placeholder="Court Case Number"
//                                   value={field.value}
//                                   onChange={(value) => {
//                                     field.onChange(value);
//                                   }}
//                                   style={{ backgroundColor: "white" }}
//                                 >
//                                   {courtCaseEntries.length > 0
//                                     ? courtCaseEntries.map((user, index) => {
//                                         return (
//                                           <MenuItem key={index} value={user.id}>
//                                             {user.caseNumber}
//                                           </MenuItem>
//                                         );
//                                       })
//                                     : []}
//                                 </Select>
//                               )}
//                               name={`courtCaseNumber`}
//                               control={control}
//                               defaultValue={null}
//                             />
//                             <FormHelperText style={{ color: "red" }}>
//                               {errors?.courtCaseNumber
//                                 ? errors.courtCaseNumber.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </Grid>
//                         {/* <Grid
//                           item
//                           xs={4}
//                           style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FormControl
//                             size="small"
//                             sx={{ width: "50%" }}
//                             variant="standard"
//                             error={!!errors.department}
//                           >
//                             <InputLabel id="demo-simple-select-label">
//                               Court Case Number
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   labelId="demo-simple-select-label"
//                                   id="demo-simple-select"
//                                   label="Court Case Number"
//                                   placeholder="Court Case Number"
//                                   value={field.value}
//                                   onChange={(value) => {
//                                     field.onChange(value);
//                                   }}
//                                   style={{ backgroundColor: "white" }}
//                                 >
//                                   {courtCaseEntries.length > 0
//                                     ? courtCaseEntries.map((user, index) => {
//                                         return (
//                                           <MenuItem key={index} value={user.id}>
//                                             {user.caseNumber}
//                                           </MenuItem>
//                                         );
//                                       })
//                                     : []}
//                                 </Select>
//                               )}
//                               name={`courtCaseNumber`}
//                               control={control}
//                               defaultValue={null}
//                             />
//                             <FormHelperText style={{ color: "red" }}>
//                               {errors?.courtCaseNumber
//                                 ? errors.courtCaseNumber.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </Grid> */}
//                         <Grid
//                           item
//                           xs={4}
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FormControl error={!!errors.noticeDate}>
//                             <Controller
//                               control={control}
//                               name="noticeDate"
//                               defaultValue={null}
//                               render={({ field }) => (
//                                 <LocalizationProvider
//                                   dateAdapter={AdapterMoment}
//                                 >
//                                   <DatePicker
//                                     inputFormat="DD/MM/YYYY"
//                                     label={
//                                       <span style={{ fontSize: 16 }}>
//                                         {/* Notice Date */}
//                                         <FormattedLabel id="noticeDatae"/>
//                                       </span>
//                                     }
//                                     value={field.value}
//                                     onChange={(date) => {
//                                       // field.onChange(date)
//                                       field.onChange(
//                                         moment(date).format("YYYY-MM-DD")
//                                       );
//                                     }}
//                                     // selected={field.value}
//                                     // center
//                                     renderInput={(params) => (
//                                       <TextField
//                                         {...params}
//                                         variant="standard"
//                                         size="small"
//                                         error={!!errors.noticeDate}
//                                         sx={{ width: 230 }}
//                                         InputLabelProps={{
//                                           style: {
//                                             fontSize: 12,
//                                             marginTop: 3,
//                                           },
//                                         }}
//                                       />
//                                     )}
//                                   />
//                                 </LocalizationProvider>
//                               )}
//                             />
//                             <FormHelperText>
//                               {errors?.noticeDate
//                                 ? errors.noticeDate.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </Grid>

//                         <Grid
//                           item
//                           xs={4}
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FormControl error={!!errors.noticeRecivedDate}>
//                             <Controller
//                               control={control}
//                               name="noticeRecivedDate"
//                               defaultValue={null}
//                               render={({ field }) => (
//                                 <LocalizationProvider
//                                   dateAdapter={AdapterMoment}
//                                 >
//                                   <DatePicker
//                                     inputFormat="DD/MM/YYYY"
//                                     label={
//                                       <span style={{ fontSize: 16 }}>
//                                         {/* Notice Received date */}

//                                         <FormattedLabel id="noticeReceviedDate"/>
//                                       </span>
//                                     }
//                                     value={field.value}
//                                     onChange={(date) =>
//                                       field.onChange(
//                                         moment(date).format("YYYY-MM-DD")
//                                       )
//                                     }
//                                     // selected={field.value}
//                                     // center
//                                     renderInput={(params) => (
//                                       <TextField
//                                         {...params}
//                                         variant="standard"
//                                         size="small"
//                                         // fullWidth
//                                         error={!!errors.noticeRecivedDate}
//                                         sx={{ width: 230 }}
//                                         InputLabelProps={{
//                                           style: {
//                                             fontSize: 12,
//                                             marginTop: 3,
//                                           },
//                                         }}
//                                       />
//                                     )}
//                                   />
//                                 </LocalizationProvider>
//                               )}
//                             />
//                             <FormHelperText>
//                               {errors?.noticeRecivedDate
//                                 ? errors.noticeRecivedDate.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </Grid>
//                       </Grid>

//                       {/* 2nd Row */}
//                       <Grid container sx={{ padding: "10px" }}>
//                         <Grid
//                           item
//                           xs={4}
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <TextField
//                             autoFocus
//                             id="standard-basic"
//                             // label="Notice received from Advocate/Person"
//                             label={<FormattedLabel id="noticeReceviedFromAdvocate"/>}
//                             variant="standard"
//                             {...register("noticeRecivedFromAdvocatePerson")}
//                             error={!!errors.noticeRecivedFromAdvocatePerson}
//                             helperText={
//                               errors?.noticeRecivedFromAdvocatePerson
//                                 ? errors.noticeRecivedFromAdvocatePerson.message
//                                 : null
//                             }
//                           />
//                         </Grid>
//                         {/* <Grid
//                           item
//                           xs={4}
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FormControl
//                             error={!!errors.department}
//                             variant="standard"
//                             sx={{
//                               minWidth: 230,
//                             }}
//                           >
//                             <InputLabel id="demo-simple-select-standard-label">
//                               Department Name
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   labelId="demo-simple-select-standard-label"
//                                   id="demo-simple-select-standard"
//                                   label="Department Name"
//                                   value={field.value}
//                                   onChange={(value) => field.onChange(value)}
//                                 >
//                                   {departments &&
//                                     departments.map((department, index) => (
//                                       <MenuItem
//                                         key={index}
//                                         value={department.id}
//                                       >
//                                         {department.department}
//                                       </MenuItem>
//                                     ))}
//                                 </Select>
//                               )}
//                               name="department"
//                               control={control}
//                               defaultValue=""
//                             />
//                             <FormHelperText>
//                               {errors?.department
//                                 ? errors?.department.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </Grid> */}
//                         {/* <Grid
//                           item
//                           xs={4}
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FormControl size="small" fullWidth sx={{width:'50%'}}>
//                             <InputLabel id="demo-multiple-checkbox-label">
//                               Tag
//                             </InputLabel>
//                             <Select
//                               labelId="demo-multiple-checkbox-label"
//                               id="demo-multiple-checkbox"
//                               multiple

//                               value={personName}
//                               onChange={handleChange}
//                               input={<OutlinedInput label="Tag" />}
//                               renderValue={(selected) => selected.join(", ")}
//                               MenuProps={MenuProps}
//                             >
//                               {['names','afa','wddw '].map((name) => (
//                                 <MenuItem key={name} value={name}>
//                                   <Checkbox
//                                     checked={personName.indexOf(name) > -1}
//                                   />
//                                   <ListItemText primary={name} />
//                                 </MenuItem>
//                               ))}
//                             </Select>
//                           </FormControl>
//                         </Grid> */}
//                         <Grid
//                           item
//                           xs={4}
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FormControl
//                             style={{ marginTop: 10 }}
//                             error={!!errors.requisitionDate}
//                           >
//                             <Controller
//                               control={control}
//                               name="requisitionDate"
//                               defaultValue={null}
//                               render={({ field }) => (
//                                 <LocalizationProvider
//                                   dateAdapter={AdapterMoment}
//                                 >
//                                   <DatePicker
//                                     inputFormat="DD/MM/YYYY"
//                                     label={
//                                       <span style={{ fontSize: 16 }}>
//                                         {/* Requisition Date */}
//                                         <FormattedLabel id="requisitionDate"/>
//                                       </span>
//                                     }
//                                     value={field.value}
//                                     onChange={(date) =>
//                                       field.onChange(
//                                         moment(date).format("YYYY-MM-DD")
//                                       )
//                                     }
//                                     // selected={field.value}
//                                     // center
//                                     renderInput={(params) => (
//                                       <TextField
//                                         {...params}
//                                         variant="standard"
//                                         error={!!errors.requisitionDate}
//                                         size="small"
//                                         // fullWidth
//                                         sx={{ width: 230 }}
//                                         InputLabelProps={{
//                                           style: {
//                                             fontSize: 12,
//                                             marginTop: 3,
//                                           },
//                                         }}
//                                       />
//                                     )}
//                                   />
//                                 </LocalizationProvider>
//                               )}
//                             />
//                             <FormHelperText>
//                               {errors?.requisitionDate
//                                 ? errors?.requisitionDate.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </Grid>
//                       </Grid>
//                       <Grid container sx={{ padding: "10px" }}>
//                         <Grid item xs={1}></Grid>
//                         <Grid
//                           item
//                           xs={11}
//                           sx={{
//                             display: "flex",
//                             // justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <TextField
//                             autoFocus
//                             fullWidth
//                             multiline
//                             id="standard-basic"
//                             // label="Notice Details"
//                             label={<FormattedLabel id="noticeDetails"/>}

//                             variant="standard"
//                             {...register("noticeDetails")}
//                             error={!!errors.noticeDetails}
//                             helperText={
//                               errors?.noticeDetails
//                                 ? errors.noticeDetails.message
//                                 : null
//                             }
//                           />
//                         </Grid>
//                       </Grid>
//                       <Grid container>
//                         <Grid
//                           item
//                           xs={11}
//                           style={{ display: "flex", justifyContent: "end" }}
//                         >
//                           <Button
//                             variant="contained"
//                             size="small"
//                             startIcon={<AddIcon />}
//                             onClick={() => {
//                               appendUI();
//                             }}
//                           >
//                             {/* Add more */}
//                             <FormattedLabel id="addMore"/>
//                           </Button>
//                         </Grid>
//                       </Grid>
//                       <Grid
//                         container
//                         style={{ padding: "10px", backgroundColor: "#F9F9F9" }}
//                       >
//                         {fields.map((witness, index) => {
//                           return (
//                             <Box
//                               key={index}
//                               sx={{
//                                 display: "flex",
//                                 flexDirection: "row",
//                                 width: "100%",
//                               }}
//                             >
//                               <Grid
//                                 item
//                                 xs={5}
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                 }}
//                               >
//                                 <FormControl
//                                   style={{ width: "65%" }}
//                                   size="small"
//                                 >
//                                   <InputLabel id="demo-simple-select-label">
//                                     {/* Office Location */}
//                                     <FormattedLabel id="officeLocation"/>
//                                   </InputLabel>
//                                   <Controller
//                                     render={({ field }) => (
//                                       <Select
//                                         labelId="demo-simple-select-label"
//                                         id="demo-simple-select"
//                                         label="Office Location"
//                                         value={field.value}
//                                         onChange={(value) => {
//                                           field.onChange(value);

//                                           setSelectedLocation(
//                                             value.target.value
//                                           );

//                                           setOfficeLocationWiseDepartment(
//                                             departments.map((val) => {
//                                               return (
//                                                 val.id ===
//                                                   officeDepartmentDesignationUser.find(
//                                                     (r) => {
//                                                       return (
//                                                         r.departmentId ===
//                                                         value.target.value
//                                                       );
//                                                     }
//                                                   ).departmentId && val
//                                               );
//                                             })
//                                           );
//                                         }}
//                                         style={{ backgroundColor: "white" }}
//                                       >
//                                         {officeLocationList.length > 0
//                                           ? officeLocationList.map(
//                                               (val, id) => {
//                                                 return (
//                                                   <MenuItem
//                                                     key={id}
//                                                     value={val.id}
//                                                     style={{
//                                                       display:
//                                                         val.officeLocationName
//                                                           ? "flex"
//                                                           : "none",
//                                                     }}
//                                                   >
//                                                     {val.officeLocationName}
//                                                   </MenuItem>
//                                                 );
//                                               }
//                                             )
//                                           : "Not Available"}
//                                       </Select>
//                                     )}
//                                     name={`concernDeptUser[${index}].locationName`}
//                                     control={control}
//                                     defaultValue={null}
//                                     key={witness.id}
//                                   />
//                                   <FormHelperText style={{ color: "red" }}>
//                                   {/* {`errors.concernDeptUser.[${index}].locationName` && "Required"} */}
//                                   </FormHelperText>
//                                 </FormControl>
//                               </Grid>
//                               <Grid
//                                 item
//                                 xs={5}
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                 }}
//                               >
//                                 <FormControl size="small" sx={{ width: "65%" }}>
//                                   <InputLabel id="demo-simple-select-standard-label">
//                                     {/* Department Name */}
//                                     <FormattedLabel id="deptName"/>
//                                   </InputLabel>
//                                   <Controller
//                                     render={({ field }) => (
//                                       <Select
//                                         labelId="demo-simple-select-label"
//                                         id="demo-simple-select"
//                                         label="Department Name"
//                                         value={field.value}
//                                         onChange={(value) => {
//                                           field.onChange(value);
//                                           setDepartmentWiseEmployee(
//                                             userList.map((val) => {
//                                               return (
//                                                 val.id ===
//                                                   officeDepartmentDesignationUser.find(
//                                                     (r) => {
//                                                       return (
//                                                         r.userId ===
//                                                         value.target.value
//                                                       );
//                                                     }
//                                                   ).userId && val
//                                               );
//                                             })
//                                           );
//                                         }}
//                                         style={{ backgroundColor: "white" }}
//                                       >
//                                         {officeLocationWiseDepartment.length > 0
//                                           ? officeLocationWiseDepartment.map(
//                                               (user, index) => {
//                                                 return (
//                                                   <MenuItem
//                                                     key={index}
//                                                     value={user.id}
//                                                     style={{
//                                                       display: user.department
//                                                         ? "flex"
//                                                         : "none",
//                                                     }}
//                                                   >
//                                                     {user.department}
//                                                   </MenuItem>
//                                                 );
//                                               }
//                                             )
//                                           : []}
//                                       </Select>
//                                     )}
//                                     name={`concernDeptUser[${index}].departmentName`}
//                                     control={control}
//                                     defaultValue={null}
//                                   />
//                                   <FormHelperText style={{ color: "red" }}>
//                                   {/* {`errors.concernDeptUser.[${index}].departmentName` && "Required"} */}
//                                   </FormHelperText>
//                                 </FormControl>
//                               </Grid>
//                               {/* <Grid
//                                 item
//                                 xs={3.5}
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                 }}
//                               >
//                                 <FormControl
//                                   size="small"
//                                   sx={{ width: "100%" }}
//                                 >
//                                   <InputLabel id="demo-simple-select-standard-label">
//                                     {/* Employee Name */}
//                                     <FormattedLabel id="employeeName"/>
//                                   </InputLabel>
//                                   <Controller
//                                     render={({ field }) => (
//                                       <Select
//                                         labelId="demo-simple-select-label"
//                                         id="demo-simple-select"
//                                         label="Employee Name"
//                                         value={field.value}
//                                         onChange={(value) =>
//                                           field.onChange(value)
//                                         }
//                                         style={{ backgroundColor: "white" }}
//                                       >
//                                         {departmentWiseEmployee.length > 0
//                                           ? departmentWiseEmployee.map(
//                                               (user, index) => {
//                                                 console.log("321", user);
//                                                 return (
//                                                   <MenuItem
//                                                     key={index}
//                                                     value={user.id}
//                                                     style={{
//                                                       display: user.firstNameEn
//                                                         ? "flex"
//                                                         : "none",
//                                                     }}
//                                                   >
//                                                     {user.firstNameEn +
//                                                       " " +
//                                                       user.middleNameEn +
//                                                       " " +
//                                                       user.lastNameEn}
//                                                   </MenuItem>
//                                                 );
//                                               }
//                                             )
//                                           : []}
//                                       </Select>
//                                     )}
//                                     name={`concernDeptUser[${index}].employeeName`}
//                                     control={control}
//                                     // defaultValue={`${witness.employeeName}`}
//                                     defaultValue={null}
//                                   />
//                                   <FormHelperText style={{ color: "red" }}>
//                                     {errors?.employeeName
//                                       ? errors.employeeName.message
//                                       : null}
//                                   </FormHelperText>
//                                 </FormControl>
//                               </Grid> */}
//                               <Grid
//                                 item
//                                 xs={2}
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Button
//                                   variant="contained"
//                                   size="small"
//                                   startIcon={<DeleteIcon />}
//                                   style={{
//                                     color: "white",
//                                     backgroundColor: "red",
//                                     height: "30px",
//                                   }}
//                                   onClick={() => {
//                                     // remove({
//                                     //   applicationName: "",
//                                     //   roleName: "",
//                                     // });
//                                     remove(index);
//                                   }}
//                                 >
//                                   {/* Delete */}
//                                   <FormattedLabel id ="delete"/>
//                                 </Button>
//                               </Grid>
//                             </Box>
//                           );
//                         })}
//                       </Grid>
//                       <div
//                         className={styles.box}
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <div>
//                           <Button
//                             color="primary"
//                             variant="contained"
//                             size="small"
//                             sx={{ marginRight: "2vw" }}
//                             onClick={() =>
//                               router.push(`/LegalCase/transaction/newNotice/`)
//                             }
//                           >
//                             <FormattedLabel id='exit' />
//                             {/* Exit */}
//                           </Button>
//                           <Button
//                             color="primary"
//                             variant="contained"
//                             onClick={handleBack}
//                             disabled={activeStep == 0}
//                             sx={{ mr: 1 }}
//                             size="small"
//                           >
//                             <FormattedLabel id='back' />
//                             {/* Back */}
//                           </Button>
//                         </div>
//                         {activeStep !== steps.length && (
//                           <Button
//                             color="primary"
//                             variant="contained"
//                             type="submit"
//                             size="small"
//                           >
//                             <FormattedLabel id='saveAndNext' />
//                             {/* Save & Next */}
//                           </Button>
//                         )}
//                       </div>
//                     </>
//                   )}
//                   {activeStep === 1 && (
//                     <>
//                       {/* File Upload */}
//                       <FileTable
//                         appName="LCMS" //Module Name
//                         serviceName={"L-Notice"} //Transaction Name
//                         fileName={attachedFile} //State to attach file
//                         filePath={setAttachedFile} // File state upadtion function
//                         newFilesFn={setAdditionalFiles} // File data function
//                         columns={columns} //columns for the table
//                         rows={finalFiles} //state to be displayed in table
//                         uploading={setUploading}
//                       />
//                       <div
//                         className={styles.box}
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Grid container sx={{ padding: "10px" }}>
//                           <Grid item xs={1}>
//                             <Button
//                               color="primary"
//                               variant="contained"
//                               size="small"
//                               sx={{ marginRight: "2vw" }}
//                               onClick={() =>
//                                 router.push(`/LegalCase/transaction/newNotice/`)
//                               }
//                             >
//                               {/* <FormattedLabel id='exit' /> */}
//                               Exit
//                             </Button>
//                           </Grid>
//                           <Grid item xs={1}>
//                             <Button
//                               color="primary"
//                               variant="contained"
//                               onClick={handleBack}
//                               size="small"
//                               sx={{ mr: 1 }}
//                             >
//                               {/* <FormattedLabel id='back' /> */}
//                               Back
//                             </Button>
//                           </Grid>
//                           <Grid item xs={7}></Grid>
//                           <Grid
//                             item
//                             xs={2}
//                             sx={{ display: "flex", justifyContent: "center" }}
//                           >
//                             {activeStep !== steps.length && (
//                               <Box>
//                                 <Button
//                                   color="primary"
//                                   variant="contained"
//                                   onClick={finalSubmit}
//                                   size="small"
//                                 >
//                                   {/* <FormattedLabel id='finish' /> */}
//                                   Save As Draft
//                                 </Button>
//                               </Box>
//                             )}
//                           </Grid>
//                           <Grid item xs={1}>
//                             {activeStep !== steps.length && (
//                               <Button
//                                 color="primary"
//                                 variant="contained"
//                                 size="small"
//                                 onClick={finalSubmit}
//                                 name="buttonname"
//                                 value="hiddenvalue"
//                               >
//                                 {/* <FormattedLabel id='finish' /> */}
//                                 Save
//                               </Button>
//                             )}
//                           </Grid>
//                         </Grid>
//                       </div>
//                       {/* <div
//                         className={styles.box}
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <div>
//                           <Button
//                             color="primary"
//                             variant="contained"
//                             sx={{ marginRight: "2vw" }}
//                             onClick={() =>
//                               router.push(`/LegalCase/transaction/newNotice/`)
//                             }
//                           >
//                             Exit
//                           </Button>
//                           <Button
//                             color="primary"
//                             variant="contained"
//                             onClick={handleBack}
//                             sx={{ mr: 1 }}
//                           >
//                             Back
//                           </Button>
//                         </div>
//                         {activeStep !== steps.length && (
//                           <Button
//                             color="primary"
//                             variant="contained"
//                             onClick={finalSubmit}
//                           >
//                             Finish
//                           </Button>
//                         )}
//                       </div> */}
//                     </>
//                   )}
//                 </>
//               )}
//             </Paper>
//           </div>
//         </form>
//       </FormProvider>
//       {/* </BasicLayout> */}
//     </>
//   );
// };

// export default view;
