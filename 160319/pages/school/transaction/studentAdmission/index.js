import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Divider } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import studentAdmissionSchema from "../../../../containers/schema/school/transactions/studentAdmissionSchema";
import urls from "../../../../URLS/urls";
import UploadButton from "../../../../containers/reuseableComponents/UploadButton";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(studentAdmissionSchema),
    mode: "onChange",
  });
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [id, setID] = useState();

  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [fetchData, setFetchData] = useState(null);

  // const [schoolId, setSchoolId] = useState("");
  // const [classId, setClassId] = useState("");
  // const [academicYearId, setAcademicYearId] = useState("");
  const schoolId = watch("schoolKey");
  const classId = watch("classKey");
  const zoneKey = watch("zoneKey");
  const wardKey = watch("wardKey");
  const religionKey = watch("religionKey");
  const academicYearId = watch("academicYearKey");
  const studentDob = watch("studentDateOfBirth");
  const lastSchoolAdmissionDate = watch("lastSchoolAdmissionDate");
  const lastSchoolLeavingDate = watch("lastSchoolLeavingDate");
  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [religions, setReligions] = useState([]);

  // const [zoneKey, setZoneKey] = useState("");
  // const [wardKey, setWardKey] = useState("");
  // const [religionKey, setReligionKey] = useState("");

  const [readonlyFields, setReadonlyFields] = useState(false);

  // const [studentDob, setStudentDob] = useState("");

  // const [lastSchoolAdmissionDate, setLastSchoolAdmissionDate] = useState("");
  // const [lastSchoolLeavingDate, setLastSchoolLeavingDate] = useState("");

  const [studentBirthCertificate, setStudentBirthCertificate] = useState();
  const [studentLeavingCerrtificate, setStudentLeavingCertificate] = useState();
  const [studentPhotograph, setStudentPhotograph] = useState();
  const [studentAadharCard, setStudentAadharCard] = useState();
  const [parentAadharCard, setParentAadharCard] = useState();
  const [studentLastYearMarksheet, setStudentLastYearMarksheet] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  //for calculate the age of the student based on their DoB selection
  const dob = watch("studentDateOfBirth");
  // const currentDate = new Date();

  console.log("dob", dob);
  // console.log("vghbjk",currentDate)

  useEffect(() => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      setValue("studentAge", age);
    }
  }, [dob, setValue]);

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

  useEffect(() => {
    const getSchoolList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstSchool/getAll`);
        const schools = data.mstSchoolList.map(({ id, schoolName }) => ({
          id,
          schoolName,
        }));
        setSchoolList(schools);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };

    const getAcademicYearList = async () => {
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstAcademicYear/getAll`);
        const academicYears = data.mstAcademicYearList.map(({ id, academicYear }) => ({ id, academicYear }));
        setAcademicYearList(academicYears);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };
    getZoneKeys();
    getReligions();
    getSchoolList();
    getAcademicYearList();
  }, [setError, setIsOpen]);

  useEffect(() => {
    const getClassList = async () => {
      setValue("classId", "");
      if (schoolId == null || schoolId === "") {
        setClassList([]);
        return;
      }
      try {
        const { data } = await axios.get(`${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`);
        const classes = data.mstClassList.map(({ id, className }) => ({
          id,
          className,
        }));
        setClassList(classes);
      } catch (e) {
        setError(e.message);
        setIsOpen(true);
      }
    };
    getClassList();
  }, [schoolId, setValue, setError, setIsOpen]);

  useEffect(() => {
    getWardKeys();
  }, [zoneKey, setValue]);
  // console.log(zoneKeys)

  // ZoneKeys
  const getZoneKeys = async () => {
    await axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneKeys(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      );
    });
  };

  //   WardKeys
  const getWardKeys = async () => {
    await axios
      .get(
        `${
          urls.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${zoneKey}`,
      )
      .then((r) => {
        setWardKeys(
          r.data.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          })),
        );
      });
  };

  // getReligion
  const getReligions = () => {
    axios.get(`${urls.CFCURL}/master/religion/getAll`).then((r) => {
      setReligions(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
          religionMr: row.religionMr,
        })),
      );
    });
  };

  useEffect(() => {
    getStudentAdmissionMaster();
  }, [fetchData]);

  // Get Table - Data
  const getStudentAdmissionMaster = (_pageSize = 10, _pageNo = 0) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.SCHOOL}/trnStudentAdmissionForm/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        let result = r.data.trnStudentAdmissionFormList;
        console.log("trnStudentAdmissionFormList", result);

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            studentFirstName: r.studentFirstName,
            studentMiddleName: r.studentMiddleName,
            studentLastName: r.studentLastName,
            fatherFirstName: r.fatherFirstName,
            fatherMiddleName: r.fatherMiddleName,
            fatherLastName: r.fatherLastName,
            motherName: r.motherName,
            studentGender: r.studentGender,
            studentContactDetails: r.studentContactDetails,
            studentAadharNumber: r.studentAadharNumber,
            religionKey: r.religionKey,
            studentBirthPlace: r.studentBirthPlace,
            studentDateOfBirth: r.studentDateOfBirth,
            familyPermanentAddress: r.familyPermanentAddress,
            parentFullName: r.parentFullName,
            parentAddress: r.parentAddress,
            parentOccupation: r.parentOccupation,
            fatherContactNumber: r.fatherContactNumber,
            motherContactNumber: r.motherContactNumber,
            colonyName: r.colonyName,
            parentPincode: r.parentPincode,
            lastSchoolName: r.lastSchoolName,
            lastSchoolAdmissionDate: r.lastSchoolAdmissionDate,
            lastClassAndFromWhenStudying: r.lastClassAndFromWhenStudying,
            lastSchoolLeavingDate: r.lastSchoolLeavingDate,
            studentBehaviour: r.studentBehaviour,
            reasonForLeavingSchool: r.reasonForLeavingSchool,
            casteName: r.casteName,
            citizenshipName: r.citizenshipName,
            motherTongueName: r.motherTongueName,
            districtName: r.districtName,
            stateName: r.stateName,
            parentDistrictName: r.parentDistrictName,
            parentStateName: r.parentStateName,
            schoolName: r.schoolName ? r.schoolName : "-",
            schoolKey: r.schoolKey,
            studentName: `${r.studentFirstName} ${r.studentMiddleName} ${r.studentLastName}`,
            studentEmail: r.studentEmail,
            className: r.className,
            classKey: r.classKey,
            academicYearKey: r.academicYearKey,
            admissionRegitrationNo: r.admissionRegitrationNo ? r.admissionRegitrationNo : "-",

            // divisionName: r.divisionName ? r.divisionName : `divisionKey ${r.divisionKey}`,
          };
        });
        console.log("Result", _res);
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

  const onSubmitForm = (formData) => {
    // console.log("formData", formData);
    // Save - DB
    let _body = {
      ...formData,
      activeFlag: formData.activeFlag,
      studentDateOfBirth: studentDob,
      academicYearKey: academicYearId,
      lastSchoolAdmissionDate,
      lastSchoolLeavingDate,
      zoneKey,
      wardKey,
      religionKey,
      schoolKey: schoolId,

      // get school name from schoolId via schoolList
      // schoolName: schoolList.find((item) => item.id === schoolId).schoolName,
      schoolName: schoolList?.find((item) => item?.id === schoolId)?.schoolName,
      // get academiYearName from academicYearId via academicYearList
      academicYearName: academicYearList?.find((item) => item?.id === academicYearId)?.academicYear,
      // get className from classId via classList
      className: classList?.find((item) => item?.id === classId)?.className,
      // get zoneName from zoneKey via zoneKeys
      zoneName: zoneKeys?.find((item) => item?.id === zoneKey)?.zoneName,
      // get wardName from wardKey via wardKeys
      wardName: wardKeys?.find((item) => item?.id === wardKey)?.wardName,

      classKey: classId,
      leavingCertificateDocuemnt: studentLeavingCerrtificate,
      studentAadharCardDocument: studentAadharCard,
      parentAadharCardDocument: parentAadharCard,
      studentLastYearMarkSheetDocument: studentLastYearMarksheet,
      studentPhotograph: studentPhotograph,
      // studentBirthCertificateDocument: studentBirthCertificate,
    };
    if (btnSaveText === "Save") {
      console.log("_body", _body);
      const tempData = axios.post(`${urls.SCHOOL}/trnStudentAdmissionForm/save`, _body).then((res) => {
        console.log("res---", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("_body", _body);
      const tempData = axios.post(`${urls.SCHOOL}/trnStudentAdmissionForm/save`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getStudentAdmissionMaster();
          // setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to Inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.SCHOOL}/trnStudentAdmissionForm/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getStudentAdmissionMaster();
              setButtonInputState(false);
              // setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to Activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.SCHOOL}/trnStudentAdmissionForm/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getPaymentRate();
              getStudentAdmissionMaster();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    schoolKey: "",
    classKey: "",
    academicYearKey: "",
    studentFirstName: "",
    studentMiddleName: "",
    studentLastName: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherName: "",
    motherMiddleName: "",
    motherLastName: "",
    studentGender: "",
    studentContactDetails: "",
    studentEmail: "",
    studentAadharNumber: "",
    casteName: "",
    citizenshipName: "",
    motherTongueName: "",
    studentBirthPlace: "",
    stateName: "",
    districtName: "",
    familyPermanentAddress: "",
    parentFullName: "",
    parentAddress: "",
    parentOccupation: "",
    fatherContactNumber: "",
    motherContactNumber: "",
    colonyName: "",
    parentDistrictName: "",
    parentStateName: "",
    parentPincode: "",
    lastSchoolName: "",
    lastClassAndFromWhenStudying: "",
    studentBehaviour: "",
    reasonForLeavingSchool: "",
    studentDateOfBirth: "",
    lastSchoolAdmissionDate: "",
    lastSchoolLeavingDate: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
    schoolKey: "",
    classKey: "",
    academicYearKey: "",
    studentFirstName: "",
    studentMiddleName: "",
    studentLastName: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherName: "",
    motherMiddleName: "",
    motherLastName: "",
    studentGender: "",
    studentContactDetails: "",
    studentEmail: "",
    studentAadharNumber: "",
    casteName: "",
    citizenshipName: "",
    studentBirthPlace: "",
    stateName: "",
    districtName: "",
    familyPermanentAddress: "",
    parentFullName: "",
    parentAddress: "",
    parentOccupation: "",
    fatherContactNumber: "",
    motherContactNumber: "",
    colonyName: "",
    parentDistrictName: "",
    parentStateName: "",
    parentPincode: "",
    lastSchoolName: "",
    lastClassAndFromWhenStudying: "",
    studentBehaviour: "",
    reasonForLeavingSchool: "",
    motherTongueName: "",
    studentDateOfBirth: "",
    lastSchoolAdmissionDate: "",
    lastSchoolLeavingDate: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: "admissionRegitrationNo",
      headerName: labels.admissionRegitrationNo,
      flex: 1,
    },
    {
      field: "schoolName",
      headerName: labels.schoolName,
      flex: 1,
    },
    {
      field: "className",
      headerName: labels.className,
      flex: 1,
    },
    {
      field: "studentName",
      headerName: labels.studentName,
      flex: 1,
    },
    {
      field: "studentContactDetails",
      headerName: labels.mobileNumber,
      flex: 1,
    },
    {
      field: "studentEmail",
      headerName: labels.emailID,
      flex: 1,
    },

    {
      field: "Actions",
      headerName: labels.actions,
      width: 220,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setReadonlyFields(false);

                // setButtonInputState(true);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  // setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
            <IconButton>
              <Button
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);

                  setButtonInputState(true);
                  console.log("params.row: ", params.row);
                  reset(params.row);
                  setReadonlyFields(true);
                }}
              >
                Approve
                {/* <FormattedLabel id="exit" /> */}
              </Button>
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        padding: 1,
        paddingBottom: "30px",
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>{labels.studentAdmissionForm}</h2>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginLeft: 30,
          marginRight: 5,
          // marginTop: 2,
          // marginBottom: 3,
          padding: 2,
          // border:1,
          // borderColor:'grey.500'
        }}
      >
        <Box p={1}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)} disabled>
              {isOpenCollapse && (
                <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                  <Grid container sx={{ padding: "10px" }}>
                    {/* Zone Name */}
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
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel required error={!!errors.zoneKey}>
                          {labels.zoneName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="zoneKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              readOnly={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.zoneKey}
                            >
                              {zoneKeys &&
                                zoneKeys.map((zone, index) => (
                                  <MenuItem key={index} value={zone.id}>
                                    {language == "en" ? zone?.zoneName : zone?.zoneNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Ward Name */}
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
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel required error={!!errors.wardKey}>
                          {labels.wardName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="wardKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              readOnly={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.wardKey}
                            >
                              {wardKeys &&
                                wardKeys.map((ward, index) => (
                                  <MenuItem key={index} value={ward.id}>
                                    {language == "en" ? ward?.wardName : ward?.wardNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Select School */}
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
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel required error={!!errors.schoolKey}>
                          {labels.selectSchool}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="schoolKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              readOnly={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.schoolKey}
                            >
                              {schoolList &&
                                schoolList.map((school) => (
                                  <MenuItem key={school.id} value={school.id}>
                                    {school.schoolName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>{errors?.schoolKey ? errors.schoolKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Select AY */}
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
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel required error={!!errors.academicYearKey}>
                          {labels.selectAcademicYear}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="academicYearKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              readOnly={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.academicYearKey}
                            >
                              {academicYearList &&
                                academicYearList.map((AY, index) => (
                                  <MenuItem key={index} value={AY.id}>
                                    {AY.academicYear}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.academicYearKey ? errors.academicYearKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Select Class */}
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
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel required error={!!errors.classKey}>
                          {labels.selectClass}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="classKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              readOnly={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.classKey}
                            >
                              {classList &&
                                classList.map((school, index) => (
                                  <MenuItem key={index} value={school.id}>
                                    {school.className}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>{errors?.classKey ? errors.classKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Divider />
                    {/* Stude 1st Name */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentFirstName}
                        {...register("studentFirstName")}
                        error={!!errors.studentFirstName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentFirstName ? errors.studentFirstName.message : null}
                      />
                    </Grid>
                    {/* stud 2nd NAme */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentMiddleName}
                        {...register("studentMiddleName")}
                        error={!!errors.studentMiddleName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentMiddleName ? errors.studentMiddleName.message : null}
                      />
                    </Grid>
                    {/* stude L Name */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentLastName}
                        {...register("studentLastName")}
                        error={!!errors.studentLastName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentLastName ? errors.studentLastName.message : null}
                      />
                    </Grid>
                    {/* Father 1st Name */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherFirstName}
                        {...register("fatherFirstName")}
                        error={!!errors.fatherFirstName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.fatherFirstName ? errors.fatherFirstName.message : null}
                      />
                    </Grid>
                    {/* Father 2nd Name */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherMiddleName}
                        {...register("fatherMiddleName")}
                        error={!!errors.fatherMiddleName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.fatherMiddleName ? errors.fatherMiddleName.message : null}
                      />
                    </Grid>
                    {/* Father L Name */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherLastName}
                        {...register("fatherLastName")}
                        error={!!errors.fatherLastName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.fatherLastName ? errors.fatherLastName.message : null}
                      />
                    </Grid>
                    {/* Mother NAme */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherName}
                        {...register("motherName")}
                        error={!!errors.motherName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.motherName ? errors.motherName.message : null}
                      />
                    </Grid>
                    {/* mother 2nd Name */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherMiddleName}
                        {...register("motherMiddleName")}
                        error={!!errors.motherMiddleName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.motherMiddleName ? errors.motherMiddleName.message : null}
                      />
                    </Grid>
                    {/* mother L Name */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherLastName}
                        {...register("motherLastName")}
                        error={!!errors.motherLastName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.motherLastName ? errors.motherLastName.message : null}
                      />
                    </Grid>
                    {/* Gender */}
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
                      <FormControl>
                        <FormLabel>{labels.gender}</FormLabel>
                        <Controller
                          name="studentGender"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              readOnly={readonlyFields}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                            >
                              <FormControlLabel value="M" control={<Radio />} label={labels.male} />
                              <FormControlLabel value="F" control={<Radio />} label={labels.female} />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText>
                          {errors?.studentGender ? errors.studentGender.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Contact Details */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.mobileNumber}
                        {...register("studentContactDetails")}
                        error={!!errors.studentContactDetails}
                        sx={{ width: 230 }}
                        // type="number"
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={
                          errors?.studentContactDetails ? errors.studentContactDetails.message : null
                        }
                      />
                    </Grid>
                    {/* studentEmail */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.emailID}
                        {...register("studentEmail")}
                        error={!!errors.studentEmail}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentEmail ? errors.studentEmail.message : null}
                      />
                    </Grid>
                    {/* Aadhar */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.aadharNumber}
                        {...register("studentAadharNumber")}
                        error={!!errors.studentAadharNumber}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentAadharNumber ? errors.studentAadharNumber.message : null}
                      />
                    </Grid>
                    <Divider />
                    {/* Religion */}
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
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel required error={!!errors.religionKey}>
                          {labels.religion}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="religionKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              readOnly={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.religionKey}
                            >
                              {religions &&
                                religions.map((religion, index) => (
                                  <MenuItem key={index} value={religion.id}>
                                    {language == "en" ? religion?.religion : religion?.religionMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.religionKey ? errors.religionKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* Cast Name */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.casteName}
                        {...register("casteName")}
                        error={!!errors.casteName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.casteName ? errors.casteName.message : null}
                      />
                    </Grid>
                    {/* CitizenShip */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.citizenship}
                        {...register("citizenshipName")}
                        error={!!errors.citizenshipName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.citizenshipName ? errors.citizenshipName.message : null}
                      />
                    </Grid>
                    {/* Mother Tongue */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherTongue}
                        {...register("motherTongueName")}
                        error={!!errors.motherTongueName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.motherTongueName ? errors.motherTongueName.message : null}
                      />
                    </Grid>
                    {/* Birth Place */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.birthPlace}
                        {...register("studentBirthPlace")}
                        error={!!errors.studentBirthPlace}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentBirthPlace ? errors.studentBirthPlace.message : null}
                      />
                    </Grid>
                    {/* DOB */}
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
                      <Controller
                        control={control}
                        name="studentDateOfBirth"
                        defaultValue=""
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  readOnly={readonlyFields}
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                />
                              )}
                              label={labels.dateOfbirth}
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                              error={errors.studentDateOfBirth}
                              helperText={
                                errors.studentDateOfBirth ? errors.studentDateOfBirth.message : null
                              }
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    {/* Age */}
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
                        id="standard-basic"
                        variant="standard"
                        label="Age"
                        {...register("studentAge")}
                        error={!!errors.studentAge}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        // helperText={errors?.studentAge ? errors.studentAge.message : null}
                      />
                    </Grid>
                    {/*birth Place State */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentState}
                        {...register("stateName")}
                        error={!!errors.stateName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                        }}
                        helperText={errors?.stateName ? errors.stateName.message : null}
                      />
                    </Grid>
                    {/*birth place Dist*/}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentDist}
                        {...register("districtName")}
                        error={!!errors.districtName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.districtName ? errors.districtName.message : null}
                      />
                    </Grid>
                    <Divider />
                    {/* Fam permanent add */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.permanentAddress}
                        {...register("familyPermanentAddress")}
                        error={!!errors.familyPermanentAddress}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                        }}
                        helperText={
                          errors?.familyPermanentAddress ? errors.familyPermanentAddress.message : null
                        }
                      />
                    </Grid>
                    {/* Parent Full Name */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.parentFullName}
                        {...register("parentFullName")}
                        error={!!errors.parentFullName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.parentFullName ? errors.parentFullName.message : null}
                      />
                    </Grid>
                    {/* Parent Address */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.parentAddress}
                        {...register("parentAddress")}
                        error={!!errors.parentAddress}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.parentAddress ? errors.parentAddress.message : null}
                      />
                    </Grid>
                    {/* Parent Occupation */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.parentOccupation}
                        {...register("parentOccupation")}
                        error={!!errors.parentOccupation}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.parentOccupation ? errors.parentOccupation.message : null}
                      />
                    </Grid>
                    {/* Father Contact Number */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.fatherMobileNumber}
                        {...register("fatherContactNumber")}
                        error={!!errors.fatherContactNumber}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.fatherContactNumber ? errors.fatherContactNumber.message : null}
                      />
                    </Grid>
                    {/* Mother Contact Number */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.motherMobileNumber}
                        {...register("motherContactNumber")}
                        error={!!errors.motherContactNumber}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.motherContactNumber ? errors.motherContactNumber.message : null}
                      />
                    </Grid>
                    {/*Colony */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.colony}
                        {...register("colonyName")}
                        error={!!errors.colonyName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.colonyName ? errors.colonyName.message : null}
                      />
                    </Grid>
                    {/*District */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.district}
                        {...register("parentDistrictName")}
                        error={!!errors.parentDistrictName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.parentDistrictName ? errors.parentDistrictName.message : null}
                      />
                    </Grid>
                    {/*state*/}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.state}
                        {...register("parentStateName")}
                        error={!!errors.parentStateName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.parentStateName ? errors.parentStateName.message : null}
                      />
                    </Grid>
                    {/*Pin Code*/}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.pincode}
                        {...register("parentPincode")}
                        error={!!errors.parentPincode}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.parentPincode ? errors.parentPincode.message : null}
                      />
                    </Grid>
                    <Divider />
                    {/*Last School Name*/}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.lastSchoolName}
                        {...register("lastSchoolName")}
                        error={!!errors.lastSchoolName}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        // helperText={
                        //   errors?.studentName ? errors.studentName.message : null
                        // }
                      />
                    </Grid>
                    {/* Last School Admission Date */}
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
                      <Controller
                        control={control}
                        name="lastSchoolAdmissionDate"
                        defaultValue=""
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  readOnly={readonlyFields}
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                />
                              )}
                              label={labels.lastSchoolAdmissionDate}
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                              error={errors.lastSchoolAdmissionDate}
                              helperText={
                                errors.lastSchoolAdmissionDate ? errors.lastSchoolAdmissionDate.message : null
                              }
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    {/* Last Class and from when Studying */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.lastSchoolAndFromWhenStudying}
                        {...register("lastClassAndFromWhenStudying")}
                        error={!!errors.lastClassAndFromWhenStudying}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        // helperText={
                        //   errors?.studentName ? errors.studentName.message : null
                        // }
                      />
                    </Grid>
                    {/* Last School Leaving Date */}
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
                      <Controller
                        control={control}
                        name="lastSchoolLeavingDate"
                        defaultValue=""
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  readOnly={readonlyFields}
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                />
                              )}
                              label={labels.lastSchoolLeavingDate}
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                              // error={errors.lastSchoolLeavingDate}
                              // helperText={
                              //   errors.lastSchoolLeavingDate
                              //     ? errors.lastSchoolLeavingDate.message
                              //     : null
                              // }
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    {/* Student Behaviour */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.studentBehaviour}
                        {...register("studentBehaviour")}
                        error={!!errors.studentBehaviour}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        // helperText={
                        //   errors?.studentName ? errors.studentName.message : null
                        // }
                      />
                    </Grid>
                    {/* Reason For Leaving School */}
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
                        id="standard-basic"
                        variant="standard"
                        label={labels.reasonForLeavingSchool}
                        {...register("reasonForLeavingSchool")}
                        error={!!errors.reasonForLeavingSchool}
                        sx={{ width: 230 }}
                        InputProps={{ style: { fontSize: 18 }, readOnly: readonlyFields }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        // helperText={
                        //   // errors?.studentName ? errors.studentName.message : null
                        //  }
                      />
                    </Grid>

                    <Divider />
                    {/* Birth Certi */}
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
                        <label>Student Birth Certificate</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          // appName="SCHOOL"
                          // serviceName="SCHOOL-NewAdmission"
                          appName="SCHOOL"
                          serviceName="SchoolAdmission"
                          fileUpdater={setStudentBirthCertificate}
                          filePath={studentBirthCertificate}
                        />
                      </Grid>
                    </Grid>
                    {/* Leaving Certificate */}
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
                        <label>Student Leaving Certificate</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          appName="SCHOOL"
                          serviceName="SchoolAdmission"
                          fileUpdater={setStudentLeavingCertificate}
                          filePath={studentLeavingCerrtificate}
                        />
                      </Grid>
                    </Grid>
                    {/* Student Photograph */}
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
                        <label>Student Photograph</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          appName="SCHOOL"
                          serviceName="SchoolAdmission"
                          fileUpdater={setStudentPhotograph}
                          filePath={studentPhotograph}
                        />
                      </Grid>
                    </Grid>
                    {/* Student AAdhar Card */}
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
                        <label>Student Aadhar Card</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          appName="SCHOOL"
                          serviceName="SchoolAdmission"
                          fileUpdater={setStudentAadharCard}
                          filePath={studentAadharCard}
                        />
                      </Grid>
                    </Grid>
                    {/* Parent Aadhar Card*/}
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
                        <label>Parent Aadhar Card</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          appName="SCHOOL"
                          serviceName="SchoolAdmission"
                          fileUpdater={setParentAadharCard}
                          filePath={parentAadharCard}
                        />
                      </Grid>
                    </Grid>
                    {/* Student Last Year Marksheet*/}
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
                        <label>Student Last Year Marksheet</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          appName="SCHOOL"
                          serviceName="SchoolAdmission"
                          fileUpdater={setStudentLastYearMarksheet}
                          filePath={studentLastYearMarksheet}
                        />
                      </Grid>
                    </Grid>
                    {/* Buttons */}
                    <Divider />
                    {readonlyFields === true ? (
                      <>
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
                          <FormControl
                            variant="outlined"
                            // variant="standard"
                            size="small"
                            // sx={{ m: 1, minWidth: 120 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // required
                                  sx={{ width: 300 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  // {...register("priority")}
                                >
                                  <MenuItem value="approvr">Approve</MenuItem>
                                  <MenuItem value="reject">Reject</MenuItem>
                                </Select>
                              )}
                              name="Status"
                              control={control}
                              defaultValue=""
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          container
                          spacing={5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            marginTop: "20px",
                          }}
                        >
                          <Grid item>
                            <Button
                              sx={{ marginRight: 8 }}
                              variant="contained"
                              color="primary"
                              endIcon={<SaveIcon />}
                            >
                              Save
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              endIcon={<ExitToAppIcon />}
                              onClick={() => exitButton()}
                            >
                              Exit
                              {/* <FormattedLabel id="exit" /> */}
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <Grid
                        container
                        spacing={5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          marginTop: "20px",
                        }}
                      >
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                          >
                            Save
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            Clear
                            {/* <FormattedLabel id="clear" /> */}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            Exit
                            {/* <FormattedLabel id="exit" /> */}
                          </Button>
                        </Grid>
                      </Grid>
                    )}

                    <Divider />
                  </Grid>
                </Slide>
              )}
            </form>
          </FormProvider>
        </Box>
      </Box>
      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          type="primary"
          disabled={buttonInputState}
          onClick={() => {
            reset({
              ...resetValuesExit,
            });
            setEditButtonInputState(true);
            setDeleteButtonState(true);
            setBtnSaveText("Save");
            setButtonInputState(true);
            setSlideChecked(true);
            setIsOpenCollapse(!isOpenCollapse);
            setReadonlyFields(false);
          }}
        >
          {labels.add}
        </Button>
      </div>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            // printOptions: { disableToolbarButton: true },
            // disableExport: true,
            // disableToolbarButton: true,
            // csvOptions: { disableToolbarButton: true },
          },
        }}
        headerName="Water"
        getRowId={(row) => row.srNo}
        autoHeight
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
        // rows={studentList}
        // columns={columns}
        pagination
        paginationMode="server"
        // loading={data.loading}
        rowCount={data.totalRows}
        rowsPerPageOptions={data.rowsPerPageOptions}
        page={data.page}
        pageSize={data.pageSize}
        rows={data.rows}
        columns={columns}
        onPageChange={(_data) => {
          getStudentAdmissionMaster(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getStudentAdmissionMaster(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
