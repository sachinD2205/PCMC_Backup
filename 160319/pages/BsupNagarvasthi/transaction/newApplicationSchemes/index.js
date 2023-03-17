import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
// import schema from "../../../../containers/schema/BsupNagarvasthiSchema/trnBachatGatCategorySchema";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import UploadButton from "../../../../containers/reuseableComponents/UploadButton";
import UploadButton from "../../../../components/fileUpload/UploadButton";
import { DataGrid } from "@mui/x-data-grid";
// import styles from "../../../../styles/BsupNagarvasthi/transaction/[bachatGatCategoryTrsn].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import UploadButtonBsup from "../../../../components/bsupNagarVasthi/DocumentUploadButton";

const BachatGatCategorySchemes = () => {
  const {
    register,
    control,
    handleSubmit,
    // methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    // defaultValues: {
    //   trnBachatgatRegistrationMembersList: [{ fullName: "full name", "designation": "1","address": "address","aadharNumber": "aadhar no" }],
    // },
  });

  const router = useRouter();

  // const language = useSelector((state) => state.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);

  const [zoneNames, setZoneNames] = useState([]);
  const [docCertificate, setDocCertificate] = useState([]);
  const [wardNames, setWardNames] = useState([]);

  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [subDependent, setSubDependent] = useState([]);
  const [divyangNames, setDivyangNames] = useState([]);

  const [religionNames, setReligionNames] = useState([]);
  const [castNames, setCastNames] = useState([]);
  const [castdependent, setCastDependent] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [designationList, setDesignation] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [bachatGatCategory, setBachatGatCategory] = useState([]);
  const [selectedBank, setSelectedBank] = useState([]);
  const [branch, setBranch] = useState([]);
  const [attachement, setAttachement] = useState("");
  const [updateData, setUpdateData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  //handle view actions as per role
  const handleViewActions = (_id) => {
    console.log("clicked id", _id);
    router.push({
      pathname: "/BsupNagarvasthi/transaction/viewSamuhaSanghatak",
      query: {
        id: _id,
      },
    });
  };

  //get logged in user
  const user = useSelector((state) => state.user.user);

  console.log("user", user);

  const loggedUser = localStorage.getItem("loggedInUser");
  console.log("ga", loggedUser);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  let tableData = [];
  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];
  let tableData5 = [];

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
    getBachatGatCategory();
    getMainScheme();
    getSubScheme();
    getCastDetails();
    getReligionDetails();
    getBankMasters();
    getDesignation();
  }, []);
  const [valueData, setValuesData] = useState();

  useEffect(() => {
    getBachatGatCategoryNewScheme();
  }, [zoneNames, wardNames, crAreaNames]);

  const getSelectedObject = (id) => {
    axios.get(`${urls.BSUPURL}/trnSchemeApplicationNew/getAll`).then((r) => {
      console.log(
        ":aa",
        id,
        r.data.trnSchemeApplicationNewList.find((row) => row.id),
      );
      setValuesData(r.data.trnSchemeApplicationNewList.find((row) => id == row.id));
    });
  };

  useEffect(() => {
    axios.get(`${urls.BSUPURL}/trnSchemeApplicationNew/getAll`).then((r) => {
      let result = r.data.trnSchemeApplicationNewList;
      let valData = result.find((obj) => {
        console.log(":ff", obj.id, id && id);
        return obj.id == id;
      });
      setUpdateData(valData);
      console.log("vall", valData);
    });
  }, [id]);

  useEffect(() => {
    setLoading(true);

    let _res = valueData;

    console.log("_res", _res);

    setValue("zoneKey", _res?.zoneKey ? _res?.zoneKey : null);

    setValue("wardKey", _res?.wardKey ? _res?.wardKey : null);
    setValue("areaKey", _res?.areaKey ? _res?.areaKey : null);
    setValue("landmark", _res?.landmark ? _res?.landmark : "-");
    setValue("flatBuldingNo", _res?.flatBuldingNo ? _res?.flatBuldingNo : "-");
    setValue("geocode", _res?.geocode ? _res?.geocode : "-");
    setValue("savingAccountNo", _res?.savingAccountNo ? _res?.savingAccountNo : "-");
    setValue("saOwnerFirstName", _res?.saOwnerFirstName ? _res?.saOwnerFirstName : "-");
    setValue("saOwnerMiddleName", _res?.saOwnerMiddleName ? _res?.saOwnerMiddleName : "-");
    setValue("saOwnerLastName", _res?.saOwnerLastName ? _res?.saOwnerLastName : "-");
    setValue("dateOfBirth", _res?.dateOfBirth ? _res?.dateOfBirth : null);
    setValue("remarks", _res?.remarks ? _res?.remarks : "-");

    setValue("bankBranchKey", _res?.bankBranchKey ? _res?.bankBranchKey : null);
    setValue("disabilityPercentage", _res?.disabilityPercentage ? _res?.disabilityPercentage : "-");
    setValue("disabilityDuration", _res?.disabilityDuration ? _res?.disabilityDuration : "-");
    setValue("disabilityCertificateNo", _res?.disabilityCertificateNo ? _res?.disabilityCertificateNo : "-");

    setValue("subSchemeKey", _res?.subSchemeKey ? _res?.subSchemeKey : null);
    setValue("fromDate", _res?.fromDate ? _res?.fromDate : null);
    setValue("bankBranchKey", _res?.bankBranchKey ? _res?.bankBranchKey : null);
    setValue("toDate", _res?.toDate ? _res?.toDate : null);
    setValue("schemeRenewalDate", _res?.schemeRenewalDate ? _res?.schemeRenewalDate : null);
    setValue("gender", _res?.gender ? _res?.gender : "-");
    setValue("age", _res?.age ? _res?.age : 0);
    setValue(
      "disabilityCertificateValidity",
      _res?.disabilityCertificateValidity ? _res?.disabilityCertificateValidity : null,
    );

    setValue("religionKey", _res?.religionKey ? _res?.religionKey : null);
    setValue("casteCategory", _res?.casteCategory ? _res?.casteCategory : null);
    setValue("mainSchemeKey", _res?.mainSchemeKey ? _res?.mainSchemeKey : null);

    console.log(":ht", valueData);
  }, [valueData]);

  const getDesignation = () => {
    axios.get(`${urls.CFCURL}/master/designation/getAll`).then((r) => {
      console.log("desi", r);
      setDesignation(
        r.data.designation.map((row) => ({
          id: row.id,
          description: row.description,
        })),
      );
    });
  };

  const getZoneName = () => {
    console.log("ttt", `${urls.BaseURL}/master/zone/getAll`);
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      console.log("zoneApi", r);
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          // zoneAddress: row.zoneAddress,
        })),
      );
    });
  };

  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      console.log("333", r.data.ward);
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        })),
      );
    });
  };

  // getAreaName
  const getCRAreaName = () => {
    // console.log("area test", `${urls.CfcURLMaster}/area/getAll`);
    axios.get(`${urls.CfcURLMaster}/area/getAll`).then((r) => {
      console.log("area", r);
      setCRAreaName(
        r.data.area.map((row) => ({
          id: row.id,
          crAreaName: row.areaName,
        })),
      );
    });
  };

  const getMainScheme = () => {
    console.log("ttt", `${urls.BSUPURL}/mstMainSchemes/getAll`);
    axios.get(`${urls.BSUPURL}/mstMainSchemes/getAll`).then((r) => {
      console.log("mainScheme", r.data.mstMainSchemesList);
      setMainNames(
        r.data.mstMainSchemesList.map((row) => ({
          id: row.id,
          schemeName: row.schemeName,
          // zoneAddress: row.zoneAddress,
        })),
      );
    });
  };

  const getSubScheme = () => {
    axios.get(`${urls.BSUPURL}/mstSubSchemes/getAll`).then((r) => {
      console.log("subScheme", r.data.mstSubSchemesList);
      setSubSchemeNames(
        r.data.mstSubSchemesList.map((row) => ({
          id: row.id,
          subSchemeName: row.subSchemeName,
          // zoneAddress: row.zoneAddress,
        })),
      );
    });
  };

  const getReligionDetails = () => {
    axios.get(`${urls.CFCURL}/master/religion/getAll`).then((r) => {
      console.log("religion", r.data.religion);
      setReligionNames(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
        })),
      );
    });
  };

  const getCastDetails = () => {
    axios.get(`${urls.CFCURL}/castCategory/getAll`).then((r) => {
      console.log("caste", r.data.castCategory);
      setCastNames(
        r.data.castCategory.map((row) => ({
          id: row.id,
          castCategory: row.castCategory,
        })),
      );
    });
  };
  const handleBank = (e) => {
    setSelectedBank(e.target.value);
    let bankName = e.target.value;
    let branchNames = [];
    console.log("bankMaster", bankMaster);
    bankMaster &&
      bankMaster.map((eachBank) => {
        if (eachBank.bankName === e.target.value) {
          if (!branchNames.includes(eachBank.branchName)) {
            branchNames.push(eachBank);
          }
        }
      });
    console.log("branchNames", branchNames, bankMaster);
    setBranch(branchNames);
  };

  const getBachatGatCategory = () => {
    axios.get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`).then((r) => {
      setBachatGatCategory(
        r.data.mstBachatGatCategoryList.map((row) => ({
          id: row.id,
          bachatGatCategoryName: row.bgCategoryName,
        })),
      );
    });
  };

  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      console.log("dd", r.data.bank);
      setBankMasters(r.data.bank);
    });
  };

  const getBachatGatCategoryNewScheme = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    console.log("ddd", `${urls.BSUPURL}/trnSchemeApplicationNew/getAll`);
    axios
      .get(`${urls.BSUPURL}/trnSchemeApplicationNew/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";getr", r);
        // let result = r.data.trnSchemeApplicationNewList;

        //Samuha sanghatak
        if (authority && authority?.find((val) => val === "SAMUHA SANGHATAK")) {
          tableData1 = r?.data?.trnBachatgatRegistrationList.filter((data, index) => {
            return data.status === 2;
          });
        }

        //Department Clerk
        if (authority && authority?.find((val) => val === "PROPOSAL APPROVAL")) {
          tableData2 = r?.data?.trnBachatgatRegistrationList.filter((data, index) => {
            return data.status === 3 || 4 || 16;
          });
        }

        //Asst Commissioner
        if (authority && authority?.find((val) => val === "APPROVAL")) {
          tableData3 = r?.data?.trnBachatgatRegistrationList.filter((data, index) => {
            return data.status === 5 || 6;
          });
        }

        //Dy. Commissioner
        if (authority && authority?.find((val) => val === "FINAL_APPROVAL")) {
          tableData4 = r?.data?.trnBachatgatRegistrationList.filter((data, index) => {
            return data.status === 7 || 8;
          });
        }

        tableData = [...tableData1, ...tableData2, ...tableData3, ...tableData4, ...tableData5];

        console.log("tableData", tableData);

        tableData.sort((a, b) => {
          console.log("sortedTableData", a, b);
          // return b - a;
        });

        let result = r.data.trnSchemeApplicationNewList;
        console.log("@result", updateData);

        // const [updateData, setUpdateData] = useState([]);

        if (wardNames && zoneNames && crAreaNames) {
          let _res = result?.map((r, i) => {
            {
              console.log("stat", crAreaNames);
            }
            return {
              // r.data.map((r, i) => ({
              activeFlag: r.activeFlag,
              // devisionKey: r.divisionKey,
              id: r.id,
              srNo: i + 1,
              // zonekey: r.zonekey,
              // zoneKey: zoneNames?.find((obj) => {
              //   console.log("test", obj.id, r);
              //   return obj.id == r.zoneKey;
              // })?.zoneName
              //   ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
              //   : "-",

              zoneKey: zoneNames?.find((obj) => {
                console.log("ad", obj.id, r.zoneKey);
                obj.id == r.zoneKey;
              })?.zoneName
                ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
                : "-",

              wardKey: wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                : "-",

              areaKey: crAreaNames?.find((obj) => {
                // console.log("rr", obj.id, r.areaKey);
                return obj.id == r.areaKey;
              })?.crAreaName
                ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaName
                : "-",
              // areaKey: crAreaNames.find((obj) => obj.id == r.areaKey)
              //   ?.crAreaName
              //   ? crAreaNames.find((obj) => obj.id == r.areaKey)?.crAreaName
              //   : "-",

              applicantAadharNo: r.applicantAadharNo,

              applicationNo: r.applicationNo,

              buildingName: r.buildingName,

              roadName: r.roadName,

              mobileNo: r.mobileNo,

              emailId: r.emailId,

              isBenifitedPreviously: r.isBenifitedPreviously,

              pincode: r.pincode,

              // fullName: r.applicantFirstName + " " + r.applicantLastName,

              applicantFirstName: r.applicantFirstName,

              applicantMiddleName: r.applicantMiddleName,

              applicantLastName: r.applicantLastName,

              trnSchemeApplicationDocumentsList: r.trnSchemeApplicationDocumentsList,

              currStatus:
                r.status === null
                  ? "pending"
                  : r.status === 0
                  ? "Save As Draft"
                  : r.status === 1
                  ? "Send Bank To Citizen"
                  : r.status === 2
                  ? "Samuha Sanghatak"
                  : r.status === 3
                  ? "Send To Dept Clerk"
                  : r.status === 4
                  ? "Send Back To Dept Clerk"
                  : r.status === 5
                  ? "Send To Asst Commissioner"
                  : r.status === 6
                  ? "Send Back To Asst Commissioner"
                  : r.status === 7
                  ? "Send To Dy Commissioner"
                  : r.status === 8
                  ? "Send Back To Dy Commissioner"
                  : r.status === 16
                  ? "Send Back To Dept Clerk After Approval Dy Commissioner"
                  : // : r.status === 9
                  // ? "Send To Accountant"
                  r.status === 10
                  ? "Complete"
                  : r.status === 11
                  ? "Close"
                  : r.status === 12
                  ? "Duplicate"
                  : "Invalid",

              //   status: r.activeFlag === "Y" ? "Y" : "N",
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
        }
      });
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    fromDate: "",
    toDate: "",
    applicationNo: "",
    subSchemeKey: "",
    mainSchemeKey: "",
    flatBuildingNo: "",
    buildingName: "",
    roadName: "",

    buildingName: "",
    roadName: "",
    mobileNo: "",
    emailId: "",

    landmark: "",
    pincode: "",
    geocode: "",
    dateOfBirth: "",
    religionKey: "",
    casteCategory: "",
    bankBranchKey: "",
    savingAccountNo: "",
    saOwnerFirstName: "",
    saOwnerMiddleName: "",
    saOwnerLastName: "",
    disabilityCertificateNo: "",
    disabilityCertificateValidity: "",
    disabilityPercentage: "5",
    disabilityDuration: "",
    schemeRenewalDate: null,
    divyangSchemeTypeKey: null,
    isBenifitedPreviously: "",

    remarks: "",

    applicantFirstName: "",
    applicantMiddleName: "",
    applicantLastName: "",
  };

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

  const onSubmitForm = (formData) => {
    console.log(":formData", formData, updateData);
    const temp = {
      //   id: 6,
      //   fromDate: "",
      //   toDate: "",
      //   zoneKey: "6",
      //   wardKey: "1",
      //   areaKey: null,
      //   applicationNo: "SCAP1677047624875",
      //   mainSchemeKey: null,
      //   subSchemeKey: null,
      //   applicantFirstName: "shjharmili",
      //   applicantMiddleName: "sameer",
      //   applicantLastName: "mulani",
      //   gender: "female",
      //   flatBuldingNo: "11",
      //   buildingName: "no",
      //   roadName: "kk",
      //   landmark: "1",
      //   pincode: "124512",
      //   geocode: "",
      //   dateOfBirth: "2023-04-05T00:00:00.000+00:00",
      //   age: 25,
      //   applicantAadharNo: "124578963214",
      //   mobileNo: "4578961452",
      //   emailId: "kk@gmail.com",
      //   religionKey: null,
      //   casteCategory: null,
      //   bankBranchKey: null,
      //   savingAccountNo: "",
      //   saOwnerFirstName: "",
      //   saOwnerMiddleName: "",
      //   saOwnerLastName: "",
      //   disabilityCertificateNo: "1",
      //   disabilityCertificateValidity: "1970-01-01T00:00:00.010+00:00",
      //   disabilityPercentage: "50",
      //   disabilityDuration: "",
      //   schemeRenewalDate: null,
      //   divyangSchemeTypeKey:   null,
      //   isBenifitedPreviously: "",
      //   remarks: "",
      //   activeFlag: "Y",
      //   isApproved: false,
      //   isComplete: false,
      //   isDraft: false,
      //   trnSchemeApplicationDocumentsList: [
      //     {
      //       id: 131,
      //       bachatgatRegistrationKey: 2,
      //       bachatgatModificationKey: null,
      //       bachatgatRenewalKey: null,
      //       trnType: "SCAP",
      //       bachatgatNo: "",
      //       documentTypeKey: null,
      //       documentFlow: "",
      //       documentPath: "D:PCMC-DOC,17_02_2023_12_34_43__appliPrint.pdf",
      //       fileType: "",
      //       activeFlag: "Y",
      //       trnBachatgatRegistrationDocumentsList: null,
      //     },
      //   ],
      // ...updateData,
      isApproved: false,
      isComplete: false,
      isDraft: false,
      status: updateData?.status,
      ...formData,

      //   fromDate: formData.fromDate,

      // activeFlag: formData.activeFlag,
      // isApproved: false,
      // isComplete: false,
      // isDraft: false,
      //
      //   activeFlag: formData.activeFlag ? "Y" : "N",
      //   activeFlag: "Y",
      trnSchemeApplicationDocumentsList: [
        {
          bachatgatRegistrationKey: 2,
          bachatgatModificationKey: null,
          bachatgatRenewalKey: null,
          trnType: "SCAP",
          bachatgatNo: "",
          documentTypeKey: null,
          documentFlow: "",
          documentPath: "",
          fileType: "",
          activeFlag: "Y",
          trnBachatgatRegistrationDocumentsList: null,
        },
      ],
    };

    console.log("::id", temp);
    if (btnSaveText === "Save") {
      console.log("save");
      const tempData = axios.post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp).then((res) => {
        console.log("--res", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record saved succesfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          getBachatGatCategoryNewScheme();
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
    } //update Data
    else if (btnSaveText === "Update") {
      console.log("update", temp);
      const tempData = axios.post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, temp).then((res) => {
        console.log(":res", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getBachatGatCategoryNewScheme();
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
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getBachatGatCategoryNewScheme();
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });

              getBachatGatCategoryNewScheme();
              // setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const resetValuesExit = {
    fromDate: "",
    toDate: "",
    applicationNo: "",
    subSchemeKey: "",
    mainSchemeKey: "",
    flatBuildingNo: "",
    buildingName: "",
    roadName: "",

    buildingName: "",
    roadName: "",
    mobileNo: "",
    emailId: "",
    age: "",
    landmark: "",
    pincode: "",
    geocode: "",
    dateOfBirth: "",
    religionKey: "",
    casteCategory: "",
    bankBranchKey: "",
    savingAccountNo: "",
    saOwnerFirstName: "",
    saOwnerMiddleName: "",
    saOwnerLastName: "",
    disabilityCertificateNo: "",
    disabilityCertificateValidity: "",
    disabilityPercentage: "",
    disabilityDuration: "",
    schemeRenewalDate: "",
    divyangSchemeTypeKey: "",
    isBenifitedPreviously: "",

    remarks: "",

    applicantFirstName: "",
    applicantMiddleName: "",
    applicantLastName: "",
  };

  const columns = [
    {
      field: "zoneKey",
      headerName: "Zone Name",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wardKey",
      headerName: "Ward Name",
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "areaKey",
      headerName: "Area Name",
      width: 200,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "applicationNo",
      headerName: "Application No",
      // flex: 1,
      width: 250,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   field: "fullName",
    //   headerName: "President Name",
    //   // flex: 1,
    //   width: 250,
    //   align: "center",
    //   headerAlign: "center",
    // },

    {
      field: "applicantAadharNo",
      headerName: "Applicant Aadhar No",
      // flex: 1,
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "currStatus",
    //   headerName: "Status",
    //   // flex: 1,
    //   width: 250,
    //   align: "center",
    //   headerAlign: "center",
    // },

    {
      field: "actions",
      headerName: "Actions",
      // <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          // oldData
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                getSelectedObject(params.row.id);
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
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {console.log("ll", params.row)}
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
          </Box>
        );
      },
    },
  ];

  return (
    <div>
      <Paper style={{ margin: "50px" }}>
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
          <h2>
            {/* <FormattedLabel id="bachatgatCategory" /> */}
            New Application Schemes
          </h2>
        </Box>

        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: "10px" }}>
                {/* For Date Picker */}
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.fromDate}>
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>From Date</span>}
                            value={field.value}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField {...params} size="small" variant="standard" sx={{ width: 320 }} />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* To date Picker */}
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.toDate}>
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>To Date(in English)</span>}
                            value={field.value}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField {...params} size="small" variant="standard" sx={{ width: 320 }} />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* Zone Name */}

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {console.log("zoneKeyzoneKey", watch("zoneKey"))}
                  <FormControl error={errors.zoneKey} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Zone Name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {console.log("123", zoneNames)}
                          {zoneNames &&
                            zoneNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.zoneName}
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

                {/* Ward name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.wardKey}>
                    <InputLabel id="demo-simple-select-standard-label">Ward Name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Service"
                          watch
                        >
                          {console.log("ward", wardNames)}
                          {wardNames &&
                            wardNames.map((service, index) => (
                              <MenuItem key={index} value={service.id}>
                                {service.wardName}
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
              </Grid>
              {/* 2nd container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Area Name */}

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl error={errors.areaKey} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Area Name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {console.log("Area", crAreaNames)}
                          {crAreaNames &&
                            crAreaNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.crAreaName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="areaKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.areaKey ? errors.areaKey.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* Main Scheme Key */}

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl error={errors.mainSchemeKey} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Main Scheme</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          // onChange={(value) => {
                          //   field.onChange(value);

                          //   subSchemeNames?.find(
                          //     (val) => val.id === value.target.value && val
                          //   )
                          //     ? setSubDependent([
                          //         subSchemeNames?.find(
                          //           (val) =>
                          //             val.id === value.target.value && val
                          //         ),
                          //       ])
                          //     : [];
                          // }}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {console.log(":mm", mainNames)}
                          {mainNames &&
                            mainNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.schemeName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="mainSchemeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.mainSchemeKey ? errors.mainSchemeKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Sub Scheme Key */}

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl error={errors.subSchemeKey} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Sub Scheme</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {/* {subDependent &&
                            subDependent.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.subSchemeName}
                              </MenuItem>
                            ))} */}
                          {console.log(":sub", subSchemeNames)}
                          {subSchemeNames &&
                            subSchemeNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.subSchemeName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="subSchemeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.subSchemeKey ? errors.subSchemeKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Beneficiary Code */}
                {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Beneficiary Code"
                    variant="standard"
                    {...register("geocode")}
                    error={!!errors.geocode}
                    helperText={errors?.geocode ? errors.geocode.message : null}
                  />
                </Grid> */}

                {/* 2.1 container */}

                <Grid container sx={{ padding: "10px" }}>
                  {/* Pin Code */}
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Pin Code"
                      variant="standard"
                      {...register("pincode")}
                      error={!!errors.pincode}
                      helperText={errors?.pincode ? errors.pincode.message : null}
                    />
                  </Grid>

                  {/* Reason */}
                  {/* <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Reason"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      variant="standard"
                     
                      {...register("bachatgatName")}
                      error={!!errors.bachatgatName}
                      helperText={
                        errors?.bachatgatName
                          ? errors.bachatgatName.message
                          : null
                      }
                    />
                  </Grid> */}

                  {/* Approve or rejected */}

                  {/* <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      error={errors.areaKey}
                      variant="standard"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Approve/Rejected
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
                          >
                            {console.log("Area", crAreaNames)}
                            {crAreaNames &&
                              crAreaNames.map((auditorium, index) => (
                                <MenuItem key={index} value={auditorium.id}>
                                  {auditorium.crAreaName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="areaKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.areaKey ? errors.areaKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}
                </Grid>
              </Grid>
              {/* 3rd Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Online application spacing */}
                <Grid itemm xs={6}></Grid>
              </Grid>
              {/* Main gap  Applicant Name Details*/}
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{ display: "flex", justifyContent: "center" }}
                ></Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    border: "solid grey",
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6">Applicant Name Details</Typography>
                </Grid>
              </Grid>
              {/* 4th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* First Name*/}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Applicant    First Name"
                    variant="standard"
                    {...register("applicantFirstName")}
                    error={!!errors.applicantFirstName}
                    helperText={errors?.applicantFirstName ? errors.applicantFirstName.message : null}
                  />
                </Grid>

                {/* Middle Name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Applicant Middle Name"
                    variant="standard"
                    {...register("applicantMiddleName")}
                    error={!!errors.applicantMiddleName}
                    helperText={errors?.applicantMiddleName ? errors.applicantMiddleName.message : null}
                  />
                </Grid>

                {/* Last Name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Applicant Last Name"
                    variant="standard"
                    {...register("applicantLastName")}
                    error={!!errors.applicantLastName}
                    helperText={errors?.applicantLastName ? errors.applicantLastName.message : null}
                  />
                </Grid>

                {/* Gender */}

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Gender"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("gender")}
                    error={!!errors.gender}
                    helperText={errors?.gender ? errors.gender.message : null}
                  />
                </Grid>
              </Grid>
              {/* 5th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Flat/Building No */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Flat/Building No"
                    variant="standard"
                    {...register("flatBuldingNo")}
                    error={!!errors.flatBuldingNo}
                    helperText={errors?.flatBuldingNo ? errors.flatBuldingNo.message : null}
                  />
                </Grid>

                {/* Building Name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Building Name"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("buildingName")}
                    error={!!errors.buildingName}
                    helperText={errors?.buildingName ? errors.buildingName.message : null}
                  />
                </Grid>

                {/* Road Name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Road Name"
                    variant="standard"
                    {...register("roadName")}
                    error={!!errors.roadName}
                    helperText={errors?.roadName ? errors.roadName.message : null}
                  />
                </Grid>

                {/* LandMark */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="LandMark"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("landmark")}
                    error={!!errors.landmark}
                    helperText={errors?.landmark ? errors.landmark.message : null}
                  />
                </Grid>
              </Grid>
              {/* 6th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* GIS Id/Geo Code */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="GIS ID/Geo Code"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("geocode")}
                    error={!!errors.geocode}
                    helperText={errors?.geocode ? errors.geocode.message : null}
                  />
                </Grid>

                {/* Applicant Adhaar No*/}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="Applicant Adhaar No"
                    variant="standard"
                    sx={{
                      width: "90%",
                    }}
                    {...register("applicantAadharNo")}
                    error={!!errors.applicantAadharNo}
                    helperText={errors?.applicantAadharNo ? errors.applicantAadharNo.message : null}
                  />
                </Grid>

                {/* Pin Code*/}
                {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Pin Code"
                    variant="standard"
                    {...register("pincode")}
                    error={!!errors.pincode}
                    helperText={errors?.pincode ? errors.pincode.message : null}
                  />
                </Grid> */}

                {/* Date of Birth */}

                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.dateOfBirth}>
                    <Controller
                      control={control}
                      name="dateOfBirth"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Date Of Birth</span>}
                            value={field.value}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField {...params} size="small" variant="standard" sx={{ width: 320 }} />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>{errors?.dateOfBirth ? errors.dateOfBirth.message : null}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container sx={{ padding: "10px" }}>
                {/*  Age */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Age"
                    type="number"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("age")}
                    error={!!errors.age}
                    helperText={errors?.age ? errors.age.message : null}
                  />
                </Grid>

                {/*  Mobile*/}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Mobile"
                    variant="standard"
                    {...register("mobileNo")}
                    error={!!errors.mobileNo}
                    helperText={errors?.mobileNo ? errors.mobileNo.message : null}
                  />
                </Grid>

                {/*  Email Address */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Email Address"
                    variant="standard"
                    {...register("emailId")}
                    error={!!errors.emailId}
                    helperText={errors?.emailId ? errors.emailId.message : null}
                  />
                </Grid>
              </Grid>

              <Grid container sx={{ padding: "10px" }}>
                {/* Religion */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl error={errors.religionKey} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Religion</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          {...field}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            {
                              console.log(
                                ":kk",
                                castNames,
                                value.target.value,
                                castNames?.find((val) => val.id === value.target.value && val),
                              );
                            }

                            castNames?.find((val) => val.id === value.target.value && val)
                              ? setCastDependent([
                                  castNames?.find((val) => val.id === value.target.value && val),
                                ])
                              : [];
                          }}
                          //   onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {console.log(":rel", castdependent)}
                          {religionNames &&
                            religionNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.religion}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="religionKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.religionKey ? errors.religionKey.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* Caste Category */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl error={errors.casteCategory} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Caste Category</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          {console.log("sss", castdependent)}

                          {castdependent.length > 0 &&
                            castdependent.map((auditorium, index) => {
                              return (
                                <MenuItem key={index} value={auditorium.id}>
                                  {auditorium.castCategory}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="casteCategory"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.casteCategory ? errors.casteCategory.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Main gap  Bank Details*/}
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4}></Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    border: "solid grey",
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6">Bank Details</Typography>
                </Grid>
              </Grid>
              {/* 9th container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Bank Name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl variant="standard" error={!!errors.bankNameId} sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Bank name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={selectedBank}
                          onChange={handleBank}
                          label="Bank name"
                        >
                          {bankMaster &&
                            bankMaster.map((bank, index) => {
                              return (
                                <MenuItem
                                  // sx={{
                                  //   display: bank.bankMaster ? "flex" : "none",
                                  // }}
                                  key={index}
                                  value={bank.bankName}
                                >
                                  {bank.bankName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="bankNameId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.bankNameId ? errors.bankNameId.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* Branch Name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.bankBranchKey}>
                    <InputLabel id="demo-simple-select-standard-label">Branch name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Service"
                        >
                          {branch &&
                            branch.map((each, index) => {
                              console.log("branch", each);
                              return (
                                <MenuItem key={index} value={each.id}>
                                  {each.branchName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="bankBranchKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.bankBranchKey ? errors.bankBranchKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Saving Account No */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="saving Account No"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("savingAccountNo")}
                    error={!!errors.savingAccountNo}
                    helperText={errors?.savingAccountNo ? errors.savingAccountNo.message : null}
                  />
                </Grid>

                {/* Bank IFSC Code */}

                {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Bank IFSC Code"
                    variant="standard"
                    {...register("ifscCode")}
                    error={!!errors.ifscCode}
                    helperText={
                      errors?.ifscCode ? errors.ifscCode.message : null
                    }
                  />
                </Grid> */}
              </Grid>

              {/* 9.1 Container */}

              <Grid container sx={{ padding: "10px" }}>
                {/* Saving Acc Name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Saving Acc First Name"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("saOwnerFirstName")}
                    error={!!errors.saOwnerFirstName}
                    helperText={errors?.saOwnerFirstName ? errors.saOwnerFirstName.message : null}
                  />
                </Grid>

                {/* Saving Acc NO Middle Name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Saving Acc Middle Name"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("saOwnerMiddleName")}
                    error={!!errors.saOwnerMiddleName}
                    helperText={errors?.saOwnerMiddleName ? errors.saOwnerMiddleName.message : null}
                  />
                </Grid>

                {/* Saving Account Last Name */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="saving Account Last Name"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("saOwnerLastName")}
                    error={!!errors.saOwnerLastName}
                    helperText={errors?.saOwnerLastName ? errors.saOwnerLastName.message : null}
                  />
                </Grid>

                {/* Disability Certificate No */}

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Disability Certificate No"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("disabilityCertificateNo")}
                    error={!!errors.disabilityCertificateNo}
                    helperText={
                      errors?.disabilityCertificateNo ? errors.disabilityCertificateNo.message : null
                    }
                  />
                </Grid>
              </Grid>
              {/* 10th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Disability Percentage */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Disability Percentage"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // type="number"
                    {...register("disabilityPercentage")}
                    error={!!errors.disabilityPercentage}
                    helperText={errors?.disabilityPercentage ? errors.disabilityPercentage.message : null}
                  />
                </Grid>
                {/* Disability Duration */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                  xl={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Disability Duration"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // type="number"
                    {...register("disabilityDuration")}
                    error={!!errors.disabilityDuration}
                    helperText={errors?.disabilityDuration ? errors.disabilityDuration.message : null}
                  />
                </Grid>

                {/* Scheme Renewal Date */}
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl
                    variant="standard"
                    style={{ marginTop: 10 }}
                    error={!!errors.schemeRenewalDate}
                  >
                    <Controller
                      control={control}
                      name="schemeRenewalDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Scheme Renewal Date</span>}
                            value={field.value}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField {...params} size="small" variant="standard" sx={{ width: 320 }} />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.schemeRenewalDate ? errors.schemeRenewalDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Disability Certificate Expiry Date */}

                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl
                    variant="standard"
                    style={{ marginTop: 10 }}
                    error={!!errors.disabilityCertificateValidity}
                  >
                    <Controller
                      control={control}
                      name="disabilityCertificateValidity"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Disability Certificate Expiry Date</span>}
                            value={field.value}
                            onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField {...params} size="small" variant="standard" sx={{ width: 320 }} />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.disabilityCertificateValidity
                        ? errors.disabilityCertificateValidity.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* 10.1 Container */}

                <Grid container sx={{ padding: "10px" }}>
                  {/* Divyang Scheme Type */}

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl error={errors.divyangSchemeTypeKey} variant="standard" sx={{ width: "90%" }}>
                      <InputLabel id="demo-simple-select-standard-label">Divyang Scheme Type</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
                          >
                            {divyangNames &&
                              divyangNames.map((auditorium, index) => (
                                <MenuItem key={index} value={auditorium.id}>
                                  {auditorium.divyangName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="divyangSchemeTypeKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.divyangSchemeTypeKey ? errors.divyangSchemeTypeKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Main gap  Required Documents*/}
              {/* <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4}></Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    border: "solid grey",
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6">
                    Eligibility Criteria / Required Documents
                  </Typography>
                </Grid>
              </Grid> */}
              <Grid container sx={{ padding: "10px" }}>
                {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="List Of Documents"
                    variant="standard"
                    {...register("document")}
                    error={!!errors.document}
                    helperText={
                      errors?.bankAddress ? errors.document.message : null
                    }
                  />
                </Grid> */}

                {/* Do you already applied for schemes */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {" "}
                  <Tooltip title="Do you already applied and received benefit from any Government Scheme">
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Do you already applied and received benefit from any Government Scheme"
                      variant="standard"
                      {...register("isBenifitedPreviously")}
                      error={!!errors.isBenifitedPreviously}
                      helperText={errors?.isBenifitedPreviously ? errors.isBenifitedPreviously.message : null}
                    />
                  </Tooltip>
                </Grid>

                {/* Remarks */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Remarks"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("remarks")}
                    error={!!errors.remarks}
                    helperText={errors?.remarks ? errors.remarks.message : null}
                  />
                </Grid>

                {/* Upload Button */}
                {/* 
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ marginTop: "40px" }}
                >
                  {console.log("ppp", docCertificate)}{" "}
                  <Typography variant="subtitle2">Attach Documents </Typography>{" "}
                  <UploadButtonBsup
                    appName="BSUP"
                    serviceName="bachatGatCategory"
                    filePath={setDocCertificate}
                    fileName={docCertificate}
                  />{" "}
                
                </Grid> */}

                {/* Approval */}
                {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={4}></Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        border: "solid grey",
                        borderRadius: "10px",
                      }}
                    >
                      <Typography variant="h6">Approve Section</Typography>
                    </Grid>
                  </Grid> */}

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
                      size="small"
                      error={!!errors.concenDeptId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Approval Status
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 200 }}
                            value={field.value}
                            {...register("priority")}
                            label={"Priority"}
                          >
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="reject">Reject</MenuItem>
                            <MenuItem value="reverted">Reverted</MenuItem>
                          </Select>
                        )}
                        name="status"
                        control={control}
                        defaultValue=""
                      />
                    </FormControl>
                  </Grid> */}
              </Grid>
              <Grid container sx={{ padding: "10px" }}></Grid>
              <Grid container style={{ padding: "10px" }}>
                {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    size="small"
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    {btnSaveText}
                  </Button>
                </Grid> */}

                <Grid item>
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<SaveIcon />}
                  >
                    {btnSaveText === "Update"
                      ? // <FormattedLabel id="update" />
                        "Update"
                      : // <FormattedLabel id="save" />
                        "Save"}
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    Exit
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={9}></Grid>
          <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
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
              }}
            >
              add
            </Button>
          </Grid>
        </Grid>

        {/* <Grid container></Grid> */}

        <DataGrid
          density="compact"
          autoHeight={true}
          rowHeight={50}
          pagination
          paginationMode="server"
          loading={data.loading}
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            // getBillType(data.pageSize, _data);
            getBachatGatCategoryNewScheme(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getBachatGatCategoryNewScheme(_data, data.page);
          }}
        />
      </Paper>
    </div>
  );
};

export default BachatGatCategorySchemes;
