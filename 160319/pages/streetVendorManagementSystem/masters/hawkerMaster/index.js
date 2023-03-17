import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import styles from "../../../../components/streetVendorManagementSystem/styles/hawkerMaster.module.css";
import schema from "../../../../components/streetVendorManagementSystem/schema/HawkerMaster";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [hawkingZones, setHawkingZones] = useState([]);
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [religions, setReligions] = useState([]);
  const [casts, setCasts] = useState([]);
  const [subCasts, setSubCasts] = useState([]);
  const [typeOfDisabilitys, setTypeOfDisabilitys] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [landmarkNames, setLandmarkNames] = useState([]);
  const [villages, setVillages] = useState([]);
  const [pincodes, setPinCode] = useState([]);
  const [wardNos, setWardNo] = useState([]);
  const [hawkingDurationDailys, setHawkingDurationDailys] = useState([]);
  const [hawkerTypes, setHawkerTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [bankNames, setBankNames] = useState([]);

  // Radio Button
  const [radioButtonValue, setRadioButtonValue] = React.useState("No");

  // Radio
  const handleChangeRadio = (event) => {
    setRadioButtonValue(event.target.value);
  };

  const getHawkingZone = () => {
    axios.get(`${urls.HMSURL}/hawingZone/getHawkigZoneData`).then((r) => {
      setHawkingZones(
        r.data.map((row) => ({
          id: row.id,
          hawkingZoneName: row.hawkingZoneName,
        })),
      );
    });
  };

  const getTitle = () => {
    axios.get(`${urls.HMSURL}/MstTitle/getTitleData`).then((r) => {
      setTitles(
        r.data.map((row) => ({
          id: row.id,
          title: row.title,
        })),
      );
    });
  };

  const getGender = () => {
    axios.get(`${urls.CFCURL}/gender/getAll`).then((r) => {
      setGenders(
        r.data.map((row) => ({
          id: row.id,
          gender: row.gender,
        })),
      );
    });
  };

  const getReligion = () => {
    axios
      .get(`${urls.HMSURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setReligions(
          r.data.map((row) => ({
            id: row.id,
            religion: row.religion,
          })),
        );
      });
  };

  const getCast = () => {
    axios.get(`${urls.CFCURL}/cast/getAll`).then((r) => {
      setCasts(
        r.data.map((row) => ({
          id: row.id,
          castt: row.castt,
        })),
      );
    });
  };

  const getSubCast = () => {
    axios.get(`${urls.CFCURL}/subCast/getSubCastDetails`).then((r) => {
      setSubCasts(
        r.data.map((row) => ({
          id: row.id,
          subCast: row.subCast,
        })),
      );
    });
  };

  const getTypeOfDisability = () => {
    axios.get(`${urls.CFCURL}/typeOfDisability/getAll`).then((r) => {
      setTypeOfDisabilitys(
        r.data.map((row) => ({
          id: row.id,
          typeOfDisability: row.typeOfDisability,
        })),
      );
    });
  };

  const getAreaName = () => {
    axios.get(`${urls.CFCURL}/area/getAll`).then((r) => {
      setAreaNames(
        r.data.map((row) => ({
          id: row.id,
          areaName: row.areaName,
        })),
      );
    });
  };

  const getLandmarkName = () => {
    axios.get(`${urls.CFCURL}/landmarkMaster/getlandmarkMaster`).then((r) => {
      setLandmarkNames(
        r.data.map((row) => ({
          id: row.id,
          landmarkName: row.landmarkName,
        })),
      );
    });
  };

  const getVillageName = () => {
    axios.get(`${urls.CFCURL}/village/getAll`).then((r) => {
      setVillages(
        r.data.map((row) => ({
          id: row.id,
          villageNameEng: row.villageNameEng,
        })),
      );
    });
  };

  const getPinCode = () => {
    axios.get(`${urls.CFCURL}/pinCode/getAll`).then((r) => {
      setPinCode(
        r.data.map((row) => ({
          id: row.id,
          pincode: row.pincode,
        })),
      );
    });
  };

  const getWardNo = () => {
    axios.get(`${urls.CFCURL}/ward/getAll`).then((r) => {
      setWardNo(
        r.data.map((row) => ({
          id: row.id,
          wardNo: row.wardNo,
        })),
      );
    });
  };

  const getHawkingDurationDaily = () => {
    axios
      .get(`${urls.HMSURL}/hawkingDurationDaily/getHawkingDurationDailyData`)
      .then((r) => {
        setHawkingDurationDailys(
          r.data.map((row) => ({
            id: row.id,
            hawkingDurationDaily: row.hawkingDurationDaily,
          })),
        );
      });
  };

  const getHawkerType = () => {
    axios.get(`${urls.HMSURL}/hawkerType/getHawkerTypeData`).then((r) => {
      setHawkerTypes(
        r.data.map((row) => ({
          id: row.id,
          hawkerType: row.hawkerType,
        })),
      );
    });
  };

  const getItem = () => {
    axios.get(`${urls.HMSURL}/MstItem/getItemData`).then((r) => {
      setItems(
        r.data.map((row) => ({
          id: row.id,
          item: row.item,
        })),
      );
    });
  };

  const getBankName = () => {
    axios.get(`${urls.CFCURL}/bank/getAll`).then((r) => {
      setBankNames(
        r.data.map((row) => ({
          id: row.id,
          bankName: row.bankName,
        })),
      );
    });
  };

  useEffect(() => {
    getHawkingZone();
    getTitle();
    getGender();
    getReligion();
    getCast();
    getSubCast();
    getTypeOfDisability();
    getAreaName();
    getLandmarkName();
    getVillageName();
    getPinCode();
    getWardNo();
    getHawkingDurationDaily();
    getHawkerType();
    getItem();
    getBankName();
  }, []);

  // Get Table - Data
  const getHawkerMaster = () => {
    axios.get(`${urls.HMSURL}/hawkerMaster/getHawkerMasterData`).then((res) => {
      console.log(res);
      setDataSource(
        res.data.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          hawkerPrefix: r.hawkerPrefix,
          toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          dateOfBirth: moment(r.dateOfBirth, "YYYY-MM-DD").format("YYYY-MM-DD"),
          licenseDate: moment(r.licenseDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          mobile: r.mobile,
          licenseValidity: r.licenseValidity,
          periodOfResidenceInMaharashtra: r.periodOfResidenceInMaharashtra,
          periodOfResidenceInPCMC: r.periodOfResidenceInPCMC,
          rationCardNo: r.rationCardNo,
          AffidaviteOnRS100StampAttached: r.AffidaviteOnRS100StampAttached,
          photo: r.photo,
          bankAccountNo: r.bankAccountNo,
          ifscCode: r.ifscCode,

          //dropdown
          hawkingZone: r.hawkingZone,
          hawkingZoneName: hawkingZones?.find(
            (obj) => obj?.id === r.hawkingZone,
          )?.hawkingZoneName,

          title: r.title,
          titleName: titles?.find((obj) => obj?.id === r.title)?.title,

          gender: r.gender,
          genderName: genders?.find((obj) => obj?.id === r.gender)?.gender,

          religion: r.religion,
          religionName: religions?.find((obj) => obj?.id === r.religion)
            ?.religion,

          castt: r.castt,
          castName: casts?.find((obj) => obj?.id === r.castt)?.castt,

          subCast: r.subCast,
          subCastName: subCasts?.find((obj) => obj?.id === r.subCast)?.subCast,

          typeOfDisability: r.typeOfDisability,
          typeOfDisabilityName: typeOfDisabilitys?.find(
            (obj) => obj?.id === r.typeOfDisability,
          )?.typeOfDisability,

          areaName: r.areaName,
          areaNamee: areaNames?.find((obj) => obj?.id === r.areaName)?.areaName,

          landmarkName: r.landmarkName,
          landmarkNamee: landmarkNames?.find(
            (obj) => obj?.id === r.landmarkName,
          )?.landmarkName,

          villageNameEng: r.villageNameEng,
          villageName: villages?.find((obj) => obj?.id === r.villageNameEng)
            ?.villageNameEng,

          pincode: r.pincode,
          pincodeName: pincodes?.find((obj) => obj?.id === r.pincode)?.pincode,

          wardNo: r.wardNo,
          wardName: wardNos?.find((obj) => obj?.id === r.wardNo)?.wardNo,

          hawkingDurationDaily: r.hawkingDurationDaily,
          hawkingDurationDailyName: hawkingDurationDailys?.find(
            (obj) => obj?.id === r.hawkingDurationDaily,
          )?.hawkingDurationDaily,

          hawkerType: r.hawkerType,
          hawkerTypeName: hawkerTypes?.find((obj) => obj?.id === r.hawkerType)
            ?.hawkerType,

          item: r.item,
          itemName: items?.find((obj) => obj?.id === r.item)?.item,

          bankName: r.bankName,
          bankNamee: bankNames?.find((obj) => obj?.id === r.bankName)?.bankName,

          cityName: r.cityName, //hard code lihaycha ahe
          emailAddress: r.emailAddress,
          aadhaarNo: r.aadhaarNo,
          age: r.age,
          middleName: r.middleName,
          firstName: r.firstName,
          lastName: r.lastName,
          citySurveyNo: r.citySurveyNo,
          hawkingDetails: r.hawkingDetails,
          licenseStatus: r.licenseStatus,
          licenseNo: r.licenseNo,

          //permanant
          prCitySurveyNumber: r.prCitySurveyNumber,
          prState: r.prState,
          prlLocation: r.prlLocation,

          //temporary
          tCitySurveyNumber: r.tCitySurveyNumber,
          tState: r.tState,
          tlLocation: r.tlLocation,
        })),
      );
    });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getHawkerMaster();
    console.log("useEffect");
  }, [
    hawkingZones,
    titles,
    genders,
    religions,
    casts,
    subCasts,
    typeOfDisabilitys,
    areaNames,
    landmarkNames,
    villages,
    pincodes,
    wardNos,
    hawkingDurationDailys,
    hawkerTypes,
    items,
    bankNames,
  ]);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // const fromDate = new Date(formData.fromDate).toISOString();
    // const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // const declarationDate = moment(formData.declarationDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      // fromDate,
      // toDate,
      // declarationDate,
      ...formData,
    };

    axios
      .post(`${urls.HMSURL}/hawkerMaster/saveHawkerMaster`, finalBodyForApi)
      .then((res) => {
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getHawkerMaster();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  // Delete By ID
  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.HMSURL}/hawkerMaster/discardHawkerMaster/${value}`)
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getHawkerMaster();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
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
    fromDate: null,
    toDate: null,
    hawkerPrefix: "",
    citySurveyNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: null,
    age: "",
    disbality: "",
    mobile: "",
    emailAddress: "",
    aadhaarNo: "",
    prCitySurveyNumber: "",
    prState: "",
    prlLocation: "",
    tCitySurveyNumber: "",
    tState: "",
    tlLocation: "",
    hawkingDetails: "",
    licenseStatus: "",
    licenseNo: "",
    licenseDate: null,
    licenseValidity: "",
    periodOfResidenceInMaharashtra: "",
    periodOfResidenceInPCMC: "",
    rationCardNo: "",
    AffidaviteOnRS100StampAttached: "",
    photo: "",
    bankAccountNo: "",
    ifscCode: "",
    hawkingZone: null,
    title: null,
    gender: null,
    religion: null,
    cast: null,
    subCast: null,
    typeOfDisability: null,
    areaName: null,
    landmarkName: null,
    villageName: null,
    cityName: null,
    pincode: null,
    wardNo: null,
    hawkingDurationDaily: null,
    hawkerType: null,
    item: null,
    bankName: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    hawkerPrefix: "",
    citySurveyNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: null,
    age: "",
    disbality: "",
    mobile: "",
    emailAddress: "",
    aadhaarNo: "",
    prCitySurveyNumber: "",
    prState: "",
    prlLocation: "",
    tCitySurveyNumber: "",
    tState: "",
    tlLocation: "",
    hawkingDetails: "",
    licenseStatus: "",
    licenseNo: "",
    licenseDate: null,
    licenseValidity: "",
    periodOfResidenceInMaharashtra: "",
    periodOfResidenceInPCMC: "",
    rationCardNo: "",
    AffidaviteOnRS100StampAttached: "",
    photo: "",
    bankAccountNo: "",
    ifscCode: "",
    hawkingZone: null,
    title: null,
    gender: null,
    religion: null,
    cast: null,
    subCast: null,
    typeOfDisability: null,
    areaName: null,
    landmarkName: null,
    villageName: null,
    cityName: null,
    pincode: null,
    wardNo: null,
    hawkingDurationDaily: null,
    hawkerType: null,
    item: null,
    bankName: null,
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "hawkerPrefix",
      headerName: "Hawker Prefix",
      // flex: 3,
      width: 180,
    },
    { field: "fromDate", headerName: "fromDate" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      // flex: 2,
      width: 100,
    },
    {
      field: "citySurveyNo",
      headerName: "City Survey No",
      // type: "number",
      // flex: 2,
      width: 100,
    },
    {
      field: "firstName",
      headerName: "First Name",
      //type: "number",
      // flex: 2,
      width: 150,
    },
    {
      field: "middleName",
      headerName: "Middle Name",
      //type: "number",
      // flex: 3,
      width: 100,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      //type: "number",
      // flex: 2,
      width: 100,
    },
    {
      field: "dateOfBirth",
      headerName: "Date Of Birth",
      //type: "number",
      // flex: 3,
      width: 250,
    },
    {
      field: "age",
      headerName: "Age",
      //type: "number",
      // flex: 3,
      width: 250,
    },
    {
      field: "disbality",
      headerName: "Disbality",
      //type: "number",
      // flex: 3,
      width: 150,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      //type: "number",
      // flex: 3,
      width: 250,
    },
    {
      field: "emailAddress",
      headerName: "Email Address",
      //type: "number",
      // flex: 3,
      width: 250,
    },
    {
      field: "aadhaarNo",
      headerName: "Aadhaar No",
      //type: "number",
      // flex: 3,
      width: 100,
    },
    {
      field: "prCitySurveyNumber",
      headerName: "Permanant City Survey Number",
      //type: "number",
      // flex: 3,
      width: 150,
    },
    {
      field: "prState",
      headerName: "Permanant State",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "prlLocation",
      headerName: "Permanant Location",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "tCitySurveyNumber",
      headerName: "Temporary City Survey Number",
      //type: "number",
      // flex: 3,
      width: 150,
    },
    {
      field: "tState",
      headerName: "Temporary State",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "tlLocation",
      headerName: "Temporary Location",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "hawkingDetails",
      headerName: "Hawking Details",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "licenseStatus",
      headerName: "License Status",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "licenseNo",
      headerName: "License No",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "licenseDate",
      headerName: "License Date",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "licenseValidity",
      headerName: "License Validity",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "periodOfResidenceInMaharashtra",
      headerName: "Period Of Residence In Maharashtra",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "periodOfResidenceInPCMC",
      headerName: "Period Of Residence In PCMC",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "rationCardNo",
      headerName: "Ration Card No",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "AffidaviteOnRS100StampAttached",
      headerName: "Affidavite On RS 100 Stamp Attached",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "photo",
      headerName: "Photo",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "bankAccountNo",
      headerName: "Bank Account No",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "ifscCode",
      headerName: "IFSC Code",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "hawkingZone",
      headerName: "Hawking Zone",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "title",
      headerName: "Title",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "gender",
      headerName: "Gender",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "religion",
      headerName: "Religion",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "cast",
      headerName: "Cast",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "subCast",
      headerName: "SubCast",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "typeOfDisability",
      headerName: "Type Of Disability",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "areaName",
      headerName: "Area Name",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "landmarkName",
      headerName: "Landmark Name",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "villageName",
      headerName: "Village Name",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "cityName",
      headerName: "City Name",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "pincode",
      headerName: "Pincode",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "wardNo",
      headerName: "Ward No",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "hawkingDurationDaily",
      headerName: "Hawking Duration Daily",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "hawkerType",
      headerName: "Hawker Type",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "item",
      headerName: "Item",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "bankName",
      headerName: "Bank Name",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <Slide direction='down' in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      <div className={styles.fieldss}>
                        <TextField
                          autoFocus
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Hawker Prefix *'
                          variant='standard'
                          {...register("hawkerPrefix")}
                          error={!!errors.hawkerPrefix}
                          helperText={
                            errors?.hawkerPrefix
                              ? errors.hawkerPrefix.message
                              : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.fromDate}
                        >
                          <Controller
                            control={control}
                            name='fromDate'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='DD/MM/YYYY'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date
                                    </span>
                                  }
                                  value={field.value}
                                  // onChange={(date) => field.onChange(date)}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size='small'
                                      fullWidth
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
                            {errors?.fromDate ? errors.fromDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className={styles.fieldss}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.toDate}
                        >
                          <Controller
                            control={control}
                            name='toDate'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='DD/MM/YYYY'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
                                    )
                                  }
                                  // onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size='small'
                                      fullWidth
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
                            {errors?.toDate ? errors.toDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      {/* <div className={styles.fieldss}>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.licenseDate}
                          >
                            <Controller
                              control={control}
                              name='licenseDate'
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat='DD/MM/YYYY'
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        License Date
                                      </span>
                                    }
                                    value={field.value}
                                    // onChange={(date) => field.onChange(date)}
                                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size='small'
                                        fullWidth
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
                              {errors?.licenseDate
                                ? errors.licenseDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}

                      <div className={styles.fieldss}>
                        <FormControl
                          variant='standard'
                          sx={{ minWidth: 120 }}
                          error={!!errors.hawkingZone}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Hawking Zone
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Hawking Zone'
                              >
                                {hawkingZones &&
                                  hawkingZones.map((hawingZone, index) => (
                                    <MenuItem key={index} value={hawingZone.id}>
                                      {hawingZone.hawkingZoneName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='hawingZone'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.hawingZone
                              ? errors.hawingZone.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      {/* <div className={styles.fieldss}>
                        <FormControl
                            variant='standard'
                            sx={{ minWidth: 120 }}
                            error={!!errors.hawkingZone}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                            Hawking Zone
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='Hawking Zone'
                                >
                                  {hawkingZones &&
                                    hawkingZones.map((hawingZone, index) => (
                                      <MenuItem
                                        key={index}
                                        value={hawingZone.id}
                                      >
                                        {hawingZone.hawkingZoneName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name='hawingZone'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.hawingZone
                                ? errors.hawingZone.message
                                : null}
                            </FormHelperText>
                          </FormControl>

                        </div> */}
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='City Survey No *'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("citySurveyNo")}
                          error={!!errors.citySurveyNo}
                          helperText={
                            errors?.citySurveyNo
                              ? errors.citySurveyNo.message
                              : null
                          }
                        />
                      </div>

                      <div className={styles.fieldss}>
                        <FormControl
                          variant='standard'
                          sx={{ minWidth: 120 }}
                          error={!!errors.areaName}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Area Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Area Name'
                              >
                                {areaNames &&
                                  areaNames.map((areaName, index) => (
                                    <MenuItem key={index} value={areaName.id}>
                                      {areaName.areaName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='areaName'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.areaName ? errors.areaName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      {/* <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250, marginTop: "5vh" }}
                            id='standard-basic'
                            label='City Survey No*'
                            variant='standard'
                            // value={dataInForm && dataInForm.religion}
                            {...register("citySurveyNo")}
                            error={!!errors.citySurveyNo}
                            helperText={
                              errors?.citySurveyNo ? errors.citySurveyNo.message : null
                            }
                          />
                        </div>
                        <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250, marginTop: "5vh" }}
                            id='standard-basic'
                            label='No Hawking Zone Name*'
                            variant='standard'
                            // value={dataInForm && dataInForm.religion}
                            {...register("noHawkingZoneName")}
                            error={!!errors.noHawkingZoneName}
                            helperText={
                              errors?.noHawkingZoneName ? errors.noHawkingZoneName.message : null
                            }
                          />
                        </div>
                        <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250, marginTop: "5vh" }}
                            id='standard-basic'
                            label='Area Name*'
                            variant='standard'
                            // value={dataInForm && dataInForm.religion}
                            {...register("areaName")}
                            error={!!errors.areaName}
                            helperText={
                              errors?.areaName ? errors.areaName.message : null
                            }
                          />
                        </div>
                        <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250, marginTop: "5vh" }}
                            id='standard-basic'
                            label='Declaration Order No*'
                            variant='standard'
                            // value={dataInForm && dataInForm.religion}
                            {...register("declarationOrderNo")}
                            error={!!errors.declarationOrderNo}
                            helperText={
                              errors?.declarationOrderNo ? errors.declarationOrderNo.message : null
                            }
                          />
                        </div>
                        <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250, marginTop: "5vh" }}
                            id='standard-basic'
                            label='Declaration Order'
                            variant='standard'
                            // value={dataInForm && dataInForm.religion}
                            {...register("declarationOrder")}
                            error={!!errors.declarationOrder}
                            helperText={
                              errors?.declarationOrder ? errors.declarationOrder.message : null
                            }
                          />
                        </div> */}
                      {/* <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250, marginTop: "5vh" }}
                            id='standard-basic'
                            label='Capacity Of Hawking Zone'
                            variant='standard'
                            // value={dataInForm && dataInForm.religion}
                            {...register("capacityOfHawkingZone")}
                            error={!!errors.capacityOfHawkingZone}
                            helperText={
                              errors?.capacityOfHawkingZone ? errors.capacityOfHawkingZone.message : null
                            }
                          />
                        </div> */}

                      <div className={styles.fieldss}>
                        <FormControl
                          variant='standard'
                          sx={{ minWidth: 120 }}
                          error={!!errors.title}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Title
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Title'
                              >
                                {titles &&
                                  titles.map((title, index) => (
                                    <MenuItem key={index} value={title.id}>
                                      {title.title}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='title'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.title ? errors.title.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='First Name'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("firstName")}
                          error={!!errors.firstName}
                          helperText={
                            errors?.firstName ? errors.firstName.message : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Middle Name'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("middleName")}
                          error={!!errors.middleName}
                          helperText={
                            errors?.middleName
                              ? errors.middleName.message
                              : null
                          }
                        />
                      </div>

                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ minWidth: 250 }}
                          id='standard-basic'
                          label='Last Name'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("lastName")}
                          error={!!errors.lastName}
                          helperText={
                            errors?.lastName ? errors.lastName.message : null
                          }
                        />
                      </div>

                      <div className={styles.fieldss}>
                        <FormControl
                          variant='standard'
                          sx={{ minWidth: 120 }}
                          error={!!errors.gender}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Gender
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Gender'
                              >
                                {genders &&
                                  genders.map((gender, index) => (
                                    <MenuItem key={index} value={gender.id}>
                                      {gender.gender}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='gender'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.gender ? errors.gender.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div className={styles.fieldss}>
                        <FormControl
                          variant='standard'
                          sx={{ minWidth: 120 }}
                          error={!!errors.religion}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Religion
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Religion'
                              >
                                {religions &&
                                  religions.map((religion, index) => (
                                    <MenuItem key={index} value={religion.id}>
                                      {religion.religion}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='religion'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.religion ? errors.religion.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div className={styles.fieldss}>
                        <FormControl
                          variant='standard'
                          sx={{ minWidth: 120 }}
                          error={!!errors.castt}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Cast
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Cast'
                              >
                                {casts &&
                                  casts.map((castt, index) => (
                                    <MenuItem key={index} value={castt.id}>
                                      {castt.castt}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='castt'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.castt ? errors.castt.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div className={styles.fieldss}>
                        <FormControl
                          variant='standard'
                          sx={{ minWidth: 120 }}
                          error={!!errors.subCast}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Sub Cast
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Sub Cast'
                              >
                                {subCasts &&
                                  subCasts.map((subCast, index) => (
                                    <MenuItem key={index} value={subCast.id}>
                                      {subCast.subCast}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='subCast'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.subCast ? errors.subCast.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div className={styles.fieldss}>
                        <FormControl
                          style={{ marginTop: "3vh" }}
                          error={!!errors.dateOfBirth}
                        >
                          <Controller
                            control={control}
                            name='dateOfBirth'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='DD/MM/YYYY'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Date Of Birth
                                    </span>
                                  }
                                  value={field.value}
                                  // onChange={(date) => field.onChange(date)}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size='small'
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 5,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.dateOfBirth
                              ? errors.dateOfBirth.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Age'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("age")}
                          error={!!errors.age}
                          helperText={errors?.age ? errors.age.message : null}
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250, marginTop: "4vh" }}
                          id='standard-basic'
                          label='Mobile'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("mobile")}
                          error={!!errors.mobile}
                          helperText={
                            errors?.mobile ? errors.mobile.message : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Email Address'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("emailAddress")}
                          error={!!errors.emailAddress}
                          helperText={
                            errors?.emailAddress
                              ? errors.emailAddress.message
                              : null
                          }
                        />
                      </div>

                      <div className={styles.fieldss}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Aadhar No'
                          variant='standard'
                          // value={dataInForm && dataInForm.religion}
                          {...register("aadhaarNo")}
                          error={!!errors.aadhaarNo}
                          helperText={
                            errors?.aadhaarNo ? errors.mobile.aadhaarNo : null
                          }
                        />
                      </div>
                      <div className={styles.fieldss}>
                        <FormControl>
                          <FormLabel id='demo-controlled-radio-buttons-group'>
                            Disability
                          </FormLabel>
                          <RadioGroup
                            aria-labelledby='demo-controlled-radio-buttons-group'
                            name='controlled-radio-buttons-group'
                            value={radioButtonValue}
                            onChange={handleChangeRadio}
                          >
                            <FormControlLabel
                              value='Yes'
                              control={<Radio />}
                              label='Yes'
                            />
                            <FormControlLabel
                              value='No'
                              control={<Radio />}
                              label='No'
                            />
                          </RadioGroup>
                        </FormControl>
                      </div>

                      <div
                        className={styles.fieldss}
                        sx={{ marginLeft: "290px" }}
                      >
                        <FormControl
                          variant='standard'
                          sx={{ minWidth: 120 }}
                          error={!!errors.typeOfDisability}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Type Of Disability
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Type Of Disability'
                              >
                                {typeOfDisabilitys &&
                                  typeOfDisabilitys.map(
                                    (typeOfDisability, index) => (
                                      <MenuItem
                                        key={index}
                                        value={typeOfDisability.id}
                                      >
                                        {typeOfDisability.typeOfDisability}
                                      </MenuItem>
                                    ),
                                  )}
                              </Select>
                            )}
                            name='typeOfDisability'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.typeOfDisability
                              ? errors.typeOfDisability.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type='submit'
                          variant='contained'
                          color='success'
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{" "}
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant='contained'
                          color='primary'
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant='contained'
                          color='error'
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          Exit
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn}>
          <Button
            variant='contained'
            endIcon={<AddIcon />}
            type='primary'
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
            }}
          >
            Add{" "}
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
