import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { EyeFilled } from "@ant-design/icons";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Divider } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import studentAdmissionSchema from "../../../../containers/schema/school/transactions/studentAdmissionSchema";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import UploadButton from "../fileUpload/UploadButton";

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
  const [divisionList, setDivisionList] = useState([]);
  const [fetchData, setFetchData] = useState(null);

  const schoolId = watch("schoolKey");
  const classId = watch("classKey");
  const divisionId = watch("divisionKey");
  const zoneKey = watch("zoneKey");
  const wardKey = watch("wardKey");
  const religionKey = watch("religionKey");
  const academicYearId = watch("academicYearKey");
  const studentDob = watch("studentDateOfBirth");
  const lastSchoolAdmissionDate = watch("lastSchoolAdmissionDate");
  const lastSchoolLeavingDate = watch("lastSchoolLeavingDate");
  const religionId = watch("religionKey");
  const casteId = watch("casteKey");
  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [religions, setReligions] = useState([]);
  const [castNames, setCastNames] = useState([]);
  const [subCastNames, setSubCastNames] = useState([]);

  const [citizenshipList] = useState([
    { id: 1, citizen: "Indian" },
    { id: 2, citizen: "Other" },
  ]);
  const [motherTongueList] = useState([
    { id: 1, motherTongue: "English" },
    { id: 2, motherTongue: "Marathi" },
    { id: 3, motherTongue: "Hindi" },
    { id: 4, motherTongue: "Other" },
  ]);

  const [readonlyFields, setReadonlyFields] = useState(false);
  const [rejectApplViewBtn, setRejectApplViewBtn] = useState(false);
  const [docView, setDocView] = useState(false);

  const [studentBirthCertificate, setStudentBirthCertificate] = useState();
  const [studentLeavingCerrtificate, setStudentLeavingCertificate] = useState();
  const [studentPhotograph, setStudentPhotograph] = useState();
  const [studentAadharCard, setStudentAadharCard] = useState();
  const [parentAadharCard, setParentAadharCard] = useState();
  const [studentLastYearMarksheet, setStudentLastYearMarksheet] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        console.log("r.roles", r.roles);
        return r;
      }
    })?.roles;
    console.log("auth0000", auth);
    setAuthority(auth);
  }, []);
  console.log("authority", authority);
  // -------------------------------------------------------------------
  console.log("subCastNames", subCastNames);

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

  const getSchoolList = () => {
    axios.get(`${urls.SCHOOL}/mstSchool/getAll`).then((r) => {
      setSchoolList(
        r.data.mstSchoolList.map((row) => ({
          id: row.id,
          schoolName: row.schoolName,
          schoolNameMr: row.schoolNameMr,
        })),
      );
    });
  };

  const getAcademicYearList = () => {
    axios.get(`${urls.SCHOOL}/mstAcademicYear/getAll`).then((r) => {
      setAcademicYearList(
        r.data.mstAcademicYearList.map((row) => ({
          id: row.id,
          academicYear: row.academicYear,
        })),
      );
    });
  };
  useEffect(() => {
    getZoneKeys();
    getReligions();
    getCastNames();
    getSchoolList();
    getAcademicYearList();
  }, [setError, setIsOpen]);

  const getClassList = () => {
    if (schoolId) {
      axios.get(`${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`).then((r) => {
        setClassList(
          r.data.mstClassList.map((row) => ({
            id: row.id,
            className: row.className,
          })),
        );
      });
    }
  };
  useEffect(() => {
    getClassList();
  }, [schoolId]);

  const getDivisionList = () => {
    if (schoolId && classId) {
      axios
        .get(`${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`)
        .then((r) => {
          setDivisionList(
            r.data.mstDivisionList.map((row) => ({
              id: row.id,
              divisionName: row.divisionName,
            })),
          );
        });
    }
  };
  useEffect(() => {
    getDivisionList();
  }, [classId, schoolId, setValue, setIsOpen, setError]);

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
  const getWardKeys = () => {
    if (zoneKey) {
      axios
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
    }
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
  // getCastNames
  const getCastNames = () => {
    axios.get(`${urls.BaseURL}/cast/getAll`).then((r) => {
      setCastNames(
        r.data.mCast.map((row) => ({
          id: row.id,
          cast: row.cast,
          castMr: row.castMr,
        })),
      );
    });
  };
  useEffect(() => {
    getStudentAdmissionMaster();
  }, [fetchData]);

  // get subCastNames
  const getSubCastNames = () => {
    axios.get(`${urls.BaseURL}/subCast/getAll`).then((r) => {
      setSubCastNames(
        r.data.subCast.map((row) => ({
          id: row.id,
          subCast: row.subCast,
          subCastMr: row.subCastMr,
        })),
      );
    });
  };
  useEffect(() => {
    getSubCastNames();
  }, [fetchData]);

  // reset docs after save/cancell/edit
  const docsReset = () => {
    setStudentBirthCertificate(""),
      setStudentLeavingCertificate(""),
      setStudentPhotograph(""),
      setStudentAadharCard(""),
      setParentAadharCard(""),
      setStudentLastYearMarksheet("");
  };
  // get documents for edit and view buttons
  const getDocuments = (paramData) => {
    setStudentBirthCertificate(paramData?.studentBirthCertificate),
      setStudentLeavingCertificate(paramData?.studentLeavingCerrtificate),
      setStudentPhotograph(paramData?.studentPhotograph),
      setStudentAadharCard(paramData?.studentAadharCard),
      setParentAadharCard(paramData?.parentAadharCard),
      setStudentLastYearMarksheet(paramData?.studentLastYearMarksheet);
  };
  // Get Table - Data
  const getStudentAdmissionMaster = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.SCHOOL}/trnStudentAdmissionForm/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
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
            zoneKey: r.zoneKey,
            wardKey: r.wardKey,
            zoneName: r.zoneName,
            wardKey: r.wardKey,
            studentFirstName: r.studentFirstName,
            studentMiddleName: r.studentMiddleName,
            studentLastName: r.studentLastName,
            firstNameMr: r.firstNameMr,
            middleNameMr: r.middleNameMr,
            lastNameMr: r.lastNameMr,
            fatherFirstName: r.fatherFirstName,
            fatherMiddleName: r.fatherMiddleName,
            fatherLastName: r.fatherLastName,
            motherName: r.motherName,
            motherNameMr: r.motherNameMr,
            motherMiddleName: r.motherMiddleName,
            motherLastName: r.motherLastName,
            studentGender: r.studentGender,
            studentContactDetails: r.studentContactDetails,
            studentAadharNumber: r.studentAadharNumber,
            religionKey: r.religionKey,
            studentBirthPlace: r.studentBirthPlace,
            studentDateOfBirth: r.studentDateOfBirth,
            familyPermanentAddress: r.familyPermanentAddress,
            parentFullName: r.parentFullName,
            parentEmailId: r.parentEmailId,
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
            casteKey: r.casteKey,
            citizenshipName: r.citizenshipName,
            motherTongueName: r.motherTongueName,
            districtName: r.districtName,
            stateName: r.stateName,
            parentDistrictName: r.parentDistrictName,
            parentStateName: r.parentStateName,
            schoolName: r.schoolName,
            schoolNameMr: r.schoolNameMr,
            schoolKey: r.schoolKey,
            studentName: `${r.studentFirstName} ${r.studentMiddleName} ${r.studentLastName}`,
            studentNameMr: `${r.firstNameMr} ${r.middleNameMr} ${r.lastNameMr}`,
            studentEmail: r.studentEmail,
            className: r.className,
            classKey: r.classKey,
            divisionKey: r.divisionKey,
            academicYearKey: r.academicYearKey,
            admissionRegitrationNo: r.admissionRegitrationNo ? r.admissionRegitrationNo : "-",

            // Ac Details
            accountNo: r.accountNo,
            confirmBankAcNumber: r.confirmBankAcNumber,
            accountHolderName: r.accountHolderName,
            bankName: r.bankName,
            ifscCode: r.ifscCode,
            bankAdderess: r.bankAdderess,

            applicationStatus: r.applicationStatus ? r.applicationStatus : "-",
            Status: r.applicationStatus == "REJECTED_BY_PRINCIPAL" ? "reject" : "approve",
            studentGeneralRegistrationNumber: r.studentGeneralRegistrationNumber,
            behaviourMr: r.behaviourMr,
            lastSchoolNameMr: r.lastSchoolNameMr,
            birthPlacemr: r.birthPlacemr,
            reasonForLeavingSchoolMr: r.reasonForLeavingSchoolMr,

            // documents
            studentLeavingCerrtificate: r.leavingCertificateDocuemnt,
            studentAadharCard: r.studentAadharCardDocument,
            parentAadharCard: r.parentAadharCardDocument,
            studentLastYearMarksheet: r.studentLastYearMarkSheetDocument,
            studentPhotograph: r.studentPhotograph,
            studentBirthCertificate: r.studentBirthCertficateDocument,

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
      schoolName: schoolList?.find((item) => item?.id === schoolId)?.schoolName,
      schoolNameMr: schoolList?.find((item) => item?.id === schoolId)?.schoolNameMr,
      // get academiYearName from academicYearId via academicYearList
      academicYearName: academicYearList?.find((item) => item?.id === academicYearId)?.academicYear,
      // get className from classId via classList
      className: classList?.find((item) => item?.id === classId)?.className,
      // get zoneName from zoneKey via zoneKeys
      // get wardName from wardKey via wardKeys
      zoneName: zoneKeys?.find((item) => item?.id === zoneKey)?.zoneName,
      wardName: wardKeys?.find((item) => item?.id === wardKey)?.wardName,
      casteName: castNames?.find((item) => item?.id === casteId)?.cast,
      casteNameMr: castNames?.find((item) => item?.id === casteId)?.castMr,
      religion_Name: religions?.find((item) => item?.id === religionId)?.religion,
      religionNameMr: religions?.find((item) => item?.id === religionId)?.religionMr,

      classKey: classId,
      divisionKey: divisionId,
      leavingCertificateDocuemnt: studentLeavingCerrtificate,
      studentAadharCardDocument: studentAadharCard,
      parentAadharCardDocument: parentAadharCard,
      studentLastYearMarkSheetDocument: studentLastYearMarksheet,
      studentPhotograph: studentPhotograph,
      studentBirthCertficateDocument: studentBirthCertificate,
    };
    if (btnSaveText === "Save") {
      console.log("_body", _body);
      const tempData = axios.post(`${urls.SCHOOL}/trnStudentAdmissionForm/save`, _body).then((res) => {
        console.log("res---", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setShowTable(true);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          docsReset();
        }
      });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("_body", _body);
      axios.post(`${urls.SCHOOL}/trnStudentAdmissionForm/save`, _body).then((res) => {
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
          setShowTable(true);
          docsReset();
        }
      });
    }
    // StatusByPrincipal
    else if (btnSaveText === "StatusByPrincipal") {
      let _isApproved = watch("Status");
      console.log("_body", _body);
      let _res = {
        // ..._body,
        id,
        isApproved: _isApproved == "approve" ? true : _isApproved == "reject" ? false : "",
        principalRemarksEn: _body.principalRemarksEn,
        principalRemarksMr: _body.principalRemarksMr,
        mstStudentDao: {},
      };
      console.log("_isApproved", _isApproved);
      console.log("_res", _res);
      axios.post(`${urls.SCHOOL}/trnStudentAdmissionForm/updateStatus`, _res).then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          _isApproved == "approve"
            ? sweetAlert("Approved!", "Application Approved successfully !", "success")
            : sweetAlert("Rejected!", "Application Sent to the Clerk successfully !", "success");
          getStudentAdmissionMaster();
          // setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
          setShowTable(true);
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
    setShowTable(true);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    docsReset();
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    docsReset();
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    schoolKey: "",
    zoneKey: "",
    wardKey: "",
    religionKey: "",
    casteKey: "",
    studentAge: "",
    classKey: "",
    divisionKey: "",
    academicYearKey: "",
    studentFirstName: "",
    firstNameMr: "",
    studentMiddleName: "",
    middleNameMr: "",
    studentLastName: "",
    lastNameMr: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherName: "",
    motherNameMr: "",
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
    birthPlacemr: "",
    stateName: "",
    districtName: "",
    familyPermanentAddress: "",
    parentFullName: "",
    parentEmailId: "",
    parentAddress: "",
    parentOccupation: "",
    fatherContactNumber: "",
    motherContactNumber: "",
    colonyName: "",
    parentDistrictName: "",
    parentStateName: "",
    parentPincode: "",
    lastSchoolName: "",
    lastSchoolNameMr: "",
    lastClassAndFromWhenStudying: "",
    studentBehaviour: "",
    behaviourMr: "",
    lastSchoolLeavingDate: null,
    reasonForLeavingSchool: "",
    reasonForLeavingSchoolMr: "",
    studentDateOfBirth: null,
    lastSchoolAdmissionDate: null,
    lastSchoolLeavingDate: "",
    accountNo: "",
    confirmBankAcNumber: "",
    accountHolderName: "",
    bankName: "",
    ifscCode: "",
    bankAdderess: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
    schoolKey: "",
    zoneKey: "",
    wardKey: "",
    religionKey: "",
    casteKey: "",
    studentAge: "",
    classKey: "",
    divisionKey: "",
    academicYearKey: "",
    studentFirstName: "",
    firstNameMr: "",
    studentMiddleName: "",
    middleNameMr: "",
    studentLastName: "",
    lastNameMr: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherName: "",
    motherNameMr: "",
    motherMiddleName: "",
    motherLastName: "",
    studentGender: "",
    studentContactDetails: "",
    studentEmail: "",
    studentAadharNumber: "",
    casteName: "",
    citizenshipName: "",
    studentBirthPlace: "",
    birthPlacemr: "",
    stateName: "",
    districtName: "",
    familyPermanentAddress: "",
    parentFullName: "",
    parentEmailId: "",
    parentAddress: "",
    parentOccupation: "",
    fatherContactNumber: "",
    motherContactNumber: "",
    colonyName: "",
    parentDistrictName: "",
    parentStateName: "",
    parentPincode: "",
    lastSchoolName: "",
    lastSchoolNameMr: "",
    lastClassAndFromWhenStudying: "",
    studentBehaviour: "",
    behaviourMr: "",
    lastSchoolLeavingDate: null,
    reasonForLeavingSchool: "",
    reasonForLeavingSchoolMr: "",
    motherTongueName: "",
    studentDateOfBirth: null,
    lastSchoolAdmissionDate: null,
    lastSchoolLeavingDate: "",
    accountNo: "",
    confirmBankAcNumber: "",
    accountHolderName: "",
    bankName: "",
    ifscCode: "",
    bankAdderess: "",
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
      // flex: 1,
      width: 200,
    },
    {
      field: language == "en" ? "schoolName" : "schoolNameMr",
      headerName: labels.schoolName,
      // flex: 1,
      width: 100,
    },
    {
      field: "className",
      headerName: labels.className,
      // flex: 1,
      width: 100,
    },
    {
      field: language == "en" ? "studentName" : "studentNameMr",
      headerName: labels.studentName,
      // flex: 1,
      width: 150,
    },
    {
      field: "studentContactDetails",
      headerName: labels.mobileNumber,
      // flex: 1,
      width: 150,
    },
    {
      field: "studentEmail",
      headerName: labels.emailId,
      // flex: 1,
      width: 150,
    },
    {
      field: "studentGeneralRegistrationNumber",
      headerName: labels.studentGRnumber,
      // flex: 1,
      width: 200,
    },
    {
      field: "applicationStatus",
      headerName: labels.applicationStatus,
      // headerName: labels.emailID,
      width: 200,
    },

    {
      field: "Actions",
      headerName: labels.actions,
      width: 220,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        let status = params.row.applicationStatus;
        let paramData = params.row;
        return (
          <Box>
            {/* Edit and delete accessable only clerk & admin*/}
            {authority?.includes("ADMIN_OFFICER") ||
              (authority?.includes("ENTRY") && status == "APPLICATION_CREATED" && (
                <>
                  {/* Edit */}
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      setBtnSaveText("Update"), getDocuments(paramData);
                      // setStudentBirthCertificate(params.row)
                      setID(params.row.id),
                        setIsOpenCollapse(true),
                        setShowTable(false),
                        setSlideChecked(true);
                      setReadonlyFields(false);

                      // setButtonInputState(true);
                      reset(params.row);
                    }}
                  >
                    <EditIcon style={{ color: "#556CD6" }} />
                  </IconButton>

                  {/* Delete */}
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      setBtnSaveText("Update");
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
                </>
              ))}

            {/* Approve */}
            {authority?.includes("ADMIN_OFFICER") ||
              (authority?.includes("APPROVAL") && status == "APPLICATION_CREATED" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      setBtnSaveText("StatusByPrincipal"), setID(params.row.id), getDocuments(paramData);
                      setIsOpenCollapse(true), setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
                      console.log("params.row: ", params.row);
                      reset(params.row);
                      setReadonlyFields(true);
                    }}
                  >
                    {labels.approve}
                  </Button>
                </IconButton>
              ))}
            {status == "REJECTED_BY_PRINCIPAL" && (
              <IconButton>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EyeFilled />}
                  onClick={() => {
                    setRejectApplViewBtn(true), setID(params.row.id), getDocuments(paramData);
                    setIsOpenCollapse(true), setDocView(true);
                    setSlideChecked(true);
                    setShowTable(false), setButtonInputState(true);
                    console.log("params.row: ", params.row);
                    reset(params.row);
                    setReadonlyFields(true);
                  }}
                >
                  {labels.view}
                </Button>
              </IconButton>
            )}
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
        container
        display="flex"
        justifyContent="center"
        justifyItems="center"
        padding={2}
        marginTop={2}
        sx={{
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2 style={{ marginBottom: 0 }}>{labels.studentAdmissionForm}</h2>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginLeft: 5,
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
                        <InputLabel
                        // required error={!!errors.zoneKey}
                        >
                          {labels.zoneName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="zoneKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              // error={!!errors.zoneKey}
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
                        {/* <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText> */}
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
                        <InputLabel
                        // required error={!!errors.wardKey}
                        >
                          {labels.wardName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="wardKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              // error={!!errors.wardKey}
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
                        {/* <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText> */}
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
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.schoolKey}
                            >
                              {schoolList &&
                                schoolList.map((school) => (
                                  <MenuItem key={school.id} value={school.id}>
                                    {/* {school.schoolName} */}
                                    {language == "en" ? school.schoolName : school.schoolNameMr}
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
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
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
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
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

                    {/* Select Div */}
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
                        <InputLabel required error={!!errors.divisionKey}>
                          {labels.selectDivision}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="divisionKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.divisionKey}
                            >
                              {divisionList &&
                                divisionList.map((div, index) => (
                                  <MenuItem key={index} value={div.id}>
                                    {div.divisionName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.divisionKey ? errors.divisionKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>{labels.studentPersonalInfo}</h2>
                      </Grid>
                    </Grid>
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentFirstName ? errors.studentFirstName.message : null}
                      />
                    </Grid>
                    {/* Stude 1st NameMr */}
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
                        label={labels.studentFirstNameMr}
                        {...register("firstNameMr")}
                        error={!!errors.firstNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.firstNameMr ? errors.firstNameMr.message : null}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentMiddleName ? errors.studentMiddleName.message : null}
                      />
                    </Grid>
                    {/* stud 2nd NAmeMr */}
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
                        label={labels.studentMiddleNameMr}
                        {...register("middleNameMr")}
                        error={!!errors.middleNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.middleNameMr ? errors.middleNameMr.message : null}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentLastName ? errors.studentLastName.message : null}
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
                        label={labels.studentLastNameMr}
                        {...register("lastNameMr")}
                        error={!!errors.lastNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.lastNameMr ? errors.lastNameMr.message : null}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.motherName ? errors.motherName.message : null}
                      />
                    </Grid>
                    {/* Mother NAme Mr*/}
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
                        label={labels.motherNameMr}
                        {...register("motherNameMr")}
                        error={!!errors.motherNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.motherNameMr ? errors.motherNameMr.message : null}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                      <FormControl disabled={readonlyFields}>
                        <FormLabel>{labels.gender}</FormLabel>
                        <Controller
                          name="studentGender"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        label={labels.emailId}
                        {...register("studentEmail")}
                        error={!!errors.studentEmail}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentAadharNumber ? errors.studentAadharNumber.message : null}
                      />
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>{labels.studentOthInfo}</h2>
                      </Grid>
                    </Grid>
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
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
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
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel required error={!!errors.casteKey}>
                          {labels.casteName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="casteKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.casteKey}
                            >
                              {castNames &&
                                castNames.map((cast, index) => (
                                  <MenuItem key={index} value={cast.id}>
                                    {language == "en" ? cast?.cast : cast?.castMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>{errors?.casteKey ? errors.casteKey.message : null}</FormHelperText>
                      </FormControl>
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
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel required error={!!errors.citizenshipName}>
                          {labels.citizenship}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="citizenshipName"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.citizenshipName}
                            >
                              {citizenshipList &&
                                citizenshipList.map((citizen) => (
                                  <MenuItem key={citizen.id} value={citizen.citizen}>
                                    {language == "en" ? citizen?.citizen : citizen?.citizen}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.citizenshipName ? errors.citizenshipName.message : null}
                        </FormHelperText>
                      </FormControl>
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
                      <FormControl sx={{ width: 230 }}>
                        <InputLabel required error={!!errors.motherTongueName}>
                          {labels.motherTongue}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="motherTongueName"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.motherTongueName}
                            >
                              {motherTongueList &&
                                motherTongueList.map((motherTongue) => (
                                  <MenuItem key={motherTongue.id} value={motherTongue.motherTongue}>
                                    {language == "en"
                                      ? motherTongue?.motherTongue
                                      : motherTongue?.motherTongue}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.motherTongueName ? errors.motherTongueName.message : null}
                        </FormHelperText>
                      </FormControl>
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.studentBirthPlace ? errors.studentBirthPlace.message : null}
                      />
                    </Grid>
                    {/* birthPlacemr*/}
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
                        label={labels.birthPlaceMr}
                        {...register("birthPlacemr")}
                        error={!!errors.birthPlacemr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.birthPlacemr ? errors.birthPlacemr.message : null}
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
                              disabled={readonlyFields}
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                  error={errors.studentDateOfBirth}
                                  helperText={
                                    errors.studentDateOfBirth ? errors.studentDateOfBirth.message : null
                                  }
                                />
                              )}
                              label={labels.dateOfbirth}
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
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
                        label={labels.age}
                        {...register("studentAge")}
                        error={!!errors.studentAge}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        // InputLabelProps={{ style: { fontSize: 15 } }}
                        InputLabelProps={{
                          shrink: watch("studentAge") == "" || null ? false : true,
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.districtName ? errors.districtName.message : null}
                      />
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>{labels.studentParentInfo}</h2>
                      </Grid>
                    </Grid>

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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.parentFullName ? errors.parentFullName.message : null}
                      />
                    </Grid>
                    {/* parent Email */}
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
                        label={labels.parentEmailId}
                        {...register("parentEmailId")}
                        error={!!errors.parentEmailId}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.parentEmailId ? errors.parentEmailId.message : null}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.parentPincode ? errors.parentPincode.message : null}
                      />
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>{labels.lastSchoolInfo}</h2>
                      </Grid>
                    </Grid>
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        // helperText={
                        //   errors?.studentName ? errors.studentName.message : null
                        // }
                      />
                    </Grid>
                    {/*Last School NameMr*/}
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
                        label={labels.lastSchoolNameMr}
                        {...register("lastSchoolNameMr")}
                        error={!!errors.lastSchoolNameMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                              disabled={readonlyFields}
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                  error={errors.lastSchoolAdmissionDate}
                                  helperText={
                                    errors.lastSchoolAdmissionDate
                                      ? errors.lastSchoolAdmissionDate.message
                                      : null
                                  }
                                />
                              )}
                              label={labels.lastSchoolAdmissionDate}
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                              disabled={readonlyFields}
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                  error={errors.lastSchoolLeavingDate}
                                  helperText={
                                    errors.lastSchoolLeavingDate ? errors.lastSchoolLeavingDate.message : null
                                  }
                                />
                              )}
                              label={labels.lastSchoolLeavingDate}
                              value={field.value}
                              onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        // helperText={
                        //   errors?.studentName ? errors.studentName.message : null
                        // }
                      />
                    </Grid>
                    {/* Student BehaviourMr */}
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
                        label={labels.studentBehaviourMr}
                        {...register("behaviourMr")}
                        error={!!errors.behaviourMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
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
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        // helperText={
                        //   // errors?.studentName ? errors.studentName.message : null
                        //  }
                      />
                    </Grid>
                    {/* Reason For Leaving School Mr */}
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
                        label={labels.reasonForLeavingSchoolMr}
                        {...register("reasonForLeavingSchoolMr")}
                        error={!!errors.reasonForLeavingSchoolMr}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        // helperText={
                        //   // errors?.studentName ? errors.studentName.message : null
                        //  }
                      />
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>{labels.accountDetails}</h2>
                      </Grid>
                    </Grid>
                    {/* Account Number */}
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
                        label={labels.accountNo}
                        {...register("accountNo")}
                        error={!!errors.accountNo}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.accountNo ? errors.accountNo.message : null}
                      />
                    </Grid>
                    {/* confirm Account Number */}
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
                        label={labels.confirmBankAcNumber}
                        {...register("confirmBankAcNumber")}
                        error={!!errors.confirmBankAcNumber}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.confirmBankAcNumber ? errors.confirmBankAcNumber.message : null}
                      />
                    </Grid>
                    {/* Account Holder Name */}
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
                        label={labels.accountHolderName}
                        {...register("accountHolderName")}
                        error={!!errors.accountHolderName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.accountHolderName ? errors.accountHolderName.message : null}
                      />
                    </Grid>
                    {/* bank Name */}
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
                        label={labels.bankName}
                        {...register("bankName")}
                        error={!!errors.bankName}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.bankName ? errors.bankName.message : null}
                      />
                    </Grid>
                    {/* bank ifsc Code */}
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
                        label={labels.ifscCode}
                        {...register("ifscCode")}
                        error={!!errors.ifscCode}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.ifscCode ? errors.ifscCode.message : null}
                      />
                    </Grid>
                    {/* bank Adderess */}
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
                        label={labels.bankAdderess}
                        {...register("bankAdderess")}
                        error={!!errors.bankAdderess}
                        sx={{ width: 230 }}
                        disabled={readonlyFields}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        helperText={errors?.bankAdderess ? errors.bankAdderess.message : null}
                      />
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      padding={2}
                      marginBottom={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        borderRadius: "6% / 100%",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>{labels.documents}</h2>
                      </Grid>
                    </Grid>
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
                        <label>{labels.studentBirthCertificate}</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
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
                        <label>{labels.studentSchoolLeavingCertificate}</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
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
                        <label>{labels.studentPhotograph}</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
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
                        <label>{labels.studentAadhar}</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
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
                        <label>{labels.parentAadhar}</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
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
                        <label>{labels.studentLastYearMarksheet}</label>
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <UploadButton
                          view={docView}
                          appName="TP"
                          serviceName="PARTMAP"
                          fileUpdater={setStudentLastYearMarksheet}
                          filePath={studentLastYearMarksheet}
                        />
                      </Grid>
                    </Grid>
                    {/* Buttons */}
                    <Divider />
                    {/* {readonlyFields === true ? ( */}
                    {authority?.includes("APPROVAL") || rejectApplViewBtn ? (
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
                            <InputLabel id="demo-simple-select-standard-label">{labels.action}</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // required
                                  disabled={rejectApplViewBtn}
                                  label={labels.action}
                                  sx={{ width: 300 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                >
                                  <MenuItem value="approve">{labels.approve}</MenuItem>
                                  <MenuItem value="reject">{labels.reject}</MenuItem>
                                </Select>
                              )}
                              name="Status"
                              control={control}
                              defaultValue=""
                            />
                          </FormControl>
                        </Grid>
                        {/* principalRemarksEn */}
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
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.principalRemarksEn}
                            {...register("principalRemarksEn")}
                            // error={!!errors.principalRemarksEn}
                            sx={{ width: 230 }}
                            disabled={rejectApplViewBtn}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={errors?.bankAdderess ? errors.bankAdderess.message : null}
                          />
                        </Grid>
                        {/* principalRemarksMr */}
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
                          <TextField
                            id="standard-basic"
                            variant="standard"
                            label={labels.principalRemarksMr}
                            {...register("principalRemarksMr")}
                            // error={!!errors.principalRemarksEn}
                            sx={{ width: 230 }}
                            disabled={rejectApplViewBtn}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                            // helperText={errors?.bankAdderess ? errors.bankAdderess.message : null}
                          />
                        </Grid>
                        {/* Bittons */}
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
                              disabled={rejectApplViewBtn}
                              type="submit"
                              sx={{ marginRight: 8 }}
                              variant="contained"
                              color="primary"
                              endIcon={<SaveIcon />}
                              // onClick={() => alert("Hello")}
                            >
                              {labels.submit}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              endIcon={<ExitToAppIcon />}
                              onClick={() => {
                                exitButton();
                                setRejectApplViewBtn(false);
                                setDocView(false);
                              }}
                            >
                              {labels.exit}
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
                            disabled={rejectApplViewBtn}
                            sx={{ marginRight: 8 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                          >
                            {labels.submit}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            disabled={rejectApplViewBtn}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            {labels.clear}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => {
                              exitButton(), setRejectApplViewBtn(false);
                              setDocView(false);
                            }}
                          >
                            {labels.exit}
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
      {authority?.includes("ADMIN_OFFICER") ||
        (authority?.includes("ENTRY") && (
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
                setShowTable(false);
              }}
            >
              {labels.add}
            </Button>
          </div>
        ))}
      {showTable && (
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
      )}
    </Paper>
  );
};

export default Index;
