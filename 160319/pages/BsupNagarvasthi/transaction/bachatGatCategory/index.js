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
import UploadButtonBsup from "../../../../components/bsupNagarVasthi/DocumentUploadButton";

const BachatGatCategory = () => {
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

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    name: "trnBachatgatRegistrationMembersList",
    control,
  });

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
  const [loading, setLoading] = useState(true);

  const [zoneNames, setZoneNames] = useState([]);
  const [docCertificate, setDocCertificate] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [designationList, setDesignation] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [bachatGatCategory, setBachatGatCategory] = useState([]);
  const [selectedBank, setSelectedBank] = useState([]);
  const [branch, setBranch] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [attachement, setAttachement] = useState("");
  const [sendData, setSendData] = useState(null);

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
    // router.push("/BsupNagarvasthi/transaction/viewSamuhaSanghatak");
    router.push({
      pathname: "/BsupNagarvasthi/transaction/viewSamuhaSanghatak",
      query: _id,
    });
  };

  let abc = [];

  let tableData = [];
  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];
  let tableData5 = [];

  //get logged in user
  const user = useSelector((state) => state.user.user);
  const userToken = useSelector((state) => state?.user?.user?.token);

  console.log("user", userToken);

  const loggedUser = localStorage.getItem("loggedInUser");
  console.log("ga", loggedUser);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  useEffect(() => {
    // getDepartment();
    // getWardKeys()

    getZoneName();
    getWardNames();
    getCRAreaName();
    getBachatGatCategory();
    getBankMasters();
    getDesignation();
  }, []);

  const [valueData, setValuesData] = useState();

  useEffect(() => {
    getBachatgatCategoryTrn();
  }, [zoneNames, wardNames, crAreaNames]);

  let citizenUserData = useSelector((state) => {
    let citzUserNew = state?.user?.user?.id;
    console.log(":12", citzUserNew);

    return citzUserNew;
  });

  let deptUser = useSelector((state) => {
    let deptUserNew = state?.user?.usersDepartmentDashboardData?.userDao?.id;
    console.log(":15", deptUserNew);

    return deptUserNew;
  });

  // cfcUser
  let cfcUserData = useSelector((state) => {
    let cfcUserNew = state?.user?.user?.token;
    console.log(":18", cfcUserNew);

    return cfcUserNew;
  });

  const getSelectedObject = (id) => {
    if (loggedUser === "citizenUser" && loggedUser !== "departmentUser") {
      axios
        .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
          headers: {
            // auth_token: userToken,
            UserId: citizenUserData && citizenUserData,
          },
        })
        .then((r) => {
          console.log(
            ":aa",
            id,
            r.data.trnBachatgatRegistrationList.find((row) => row.id),
          );
          setValuesData(r?.data?.trnBachatgatRegistrationList?.find((row) => row.id == id));
        });
    } else {
      axios
        .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
          headers: {
            // auth_token: userToken,
            UserId: cfcUserData && cfcUserData,
          },
        })
        .then((r) => {
          console.log(
            ":baa",
            id,
            r.data.trnBachatgatRegistrationList.find((row) => row.id),
          );
          setValuesData(r?.data?.trnBachatgatRegistrationList?.find((row) => row.id == id));
        });
    }
  };

  useEffect(() => {
    axios
      .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          UserId: citizenUserData && citizenUserData,
        },
      })
      .then((r) => {
        let result = r.data.trnBachatgatRegistrationList;
        let valData = result?.find((obj) => {
          console.log(":ff", obj.id, id && id);
          return obj.id == id;
        });
        setUpdateData(valData);
        console.log("vall", valData);
      });
  }, [id]);

  useEffect(() => {
    setLoading(true);

    let _res = updateData;

    console.log("::_res", _res);

    setValue("zoneKey", _res?.zoneKey ? _res?.zoneKey : null);
    setValue("flatBuldingNo", _res?.flatBuldingNo ? _res?.flatBuldingNo : "-");
    setValue("wardKey", _res?.wardKey ? _res?.wardKey : null);
    setValue("bankBranchKey", _res?.bankBranchKey ? _res?.bankBranchKey : null);
    setValue("areaKey", _res?.areaKey ? _res?.areaKey : null);
    setValue("fromDate", _res?.fromDate ? _res?.fromDate : null);
    setValue("toDate", _res?.toDate ? _res?.toDate : null);
    setValue("renewalDate", _res?.renewalDate ? _res?.renewalDate : null);
    setValue("categoryKey", _res?.categoryKey ? _res?.categoryKey : null);
    setValue("closingReason", _res?.closingReason ? _res?.closingReason : "-");
    setValue("landmark", _res?.landmark ? _res?.landmark : "-");
    setValue("micrCode", _res?.micrCode ? _res?.micrCode : "-");
    setValue("bachatgatName", _res?.bachatgatName ? _res?.bachatgatName : "-");
    setValue("presidentFirstName", _res?.presidentFirstName ? _res?.presidentFirstName : null);
    setValue("MemberList", _res?._resNew ? _res?._resNew : null);

    console.log(":ht", updateData);
  }, [updateData]);

  const [audienceSample, setAudienceSample] = useState(updateData?.trnBachatgatRegistrationMembersList);

  console.log("554", updateData?.trnBachatgatRegistrationMembersList);

  useEffect(() => {
    setAudienceSample(updateData?.trnBachatgatRegistrationMembersList);
    let _resNew = audienceSample;
    console.log(":tt", updateData);
    updateData &&
      updateData?.trnBachatgatRegistrationMembersList?.map((val, index) => {
        return append({
          fullName: val?.fullName,
          address: val?.address,
          designation: val?.designation,
          aadharNumber: val?.aadharNumber,
        });
      });
  }, [updateData]);

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
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          UserId: citizenUserData && citizenUserData,
        },
      })
      .then((r) => {
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
    axios
      .get(`${urls.CfcURLMaster}/area/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          UserId: citizenUserData && citizenUserData,
        },
      })
      .then((r) => {
        console.log("area", r);
        setCRAreaName(
          r.data.area.map((row) => ({
            id: row.id,
            crAreaName: row.areaName,
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
    console.log("branchNames", branchNames);
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

  const handleParams = (key) => {
    if (key === "Send Bank To Citizen") {
      return 1;
    }
  };

  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      console.log("dd", r.data.bank);
      setBankMasters(r.data.bank);
    });
  };

  // const getFilterWards = (value) => {
  //   axios
  //     .get(`${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`, {
  //       params: { departmentId: 31, zoneId: value.target.value },
  //     })
  //     .then((r) => {
  //       console.log("Filtered Wards", r);
  //       setWardKeys(r.data);
  //     });
  // };

  const getBachatgatCategoryTrn = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);

    {
      // loggedUser !== "User"departmentUser"
      loggedUser === "citizenUser"
        ? axios
            .get(
              // `${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${user.id}&locale=en`,
              `${urls.BSUPURL}/trnBachatgatRegistration/getAll`,

              {
                headers: {
                  // auth_token: userToken,
                  UserId: citizenUserData && citizenUserData,
                },
                params: {
                  pageSize: _pageSize,
                  pageNo: _pageNo,
                },
              },
            )

            .then((r) => {
              let result = r.data.trnBachatgatRegistrationList;
              console.log("@result", result);

              if (!r.data && r.data.length == 0) {
                return;
              }
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

              // end status

              console.log("w@");

              if (wardNames && zoneNames && crAreaNames) {
                let _res = result?.map((r, i) => {
                  {
                    console.log("stat", r.trnBachatgatRegistrationDocumentsList);
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

                    zoneKey: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
                      ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
                      : "-",
                    zoneKeyMr: r.zoneKeyMr,

                    wardKey: wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                      ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                      : "-",
                    wardkeyMr: r.wardkeyMr,
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
                    areakeyMr: r.areakeyMr,
                    geocode: r.geocode,
                    geocodeMr: r.geocodeMr,
                    mediaKey: r.mediaKey,
                    mediaKeyMr: r.mediaKeyMr,
                    cfcApplicationNo: r.cfcApplicationNo,
                    cfcApplicationNoMr: r.cfcApplicationNoMr,
                    trnBachatgatRegistrationDocumentsList: r.trnBachatgatRegistrationDocumentsList,
                    // documentPath: documentPath?.find(
                    //   (obj) => obj.id == r.trnBachatgatRegistrationDocumentsList.id,
                    // )?.documentPath
                    //   ? documentPath?.find((obj) => obj.id == r.trnBachatgatRegistrationDocumentsList.id)
                    //       ?.documentPath
                    //   : "-",

                    applicationNo: r.applicationNo,
                    applicationNoMr: r.applicationNoMr,
                    flatBuldingNo: r.flatBuldingNo,
                    flatBuldingNoMr: r.flatBuldingNoMr,
                    buildingName: r.buildingName,

                    roadName: r.roadName,
                    roadNameMr: r.roadNameMr,
                    landlineNo: r.landlineNo,

                    mobileNo: r.mobileNo,
                    mobileNoMr: r.mobileNoMr,
                    emailId: r.emailId,
                    emailIdMr: r.emailIdMr,

                    pincode: r.pincode,
                    pincodeMr: r.pincodeMr,
                    totalMembersCount: r.totalMembersCount,
                    totalMembersCountMr: r.totalMembersCountMr,
                    fullName: r.presidentFirstName + " " + r.presidentLastName,
                    // presidentFirstName: r.presidentFirstName,
                    // presidentFirstNameMr: r.presidentFirstNameMr,
                    presidentMiddleName: r.presidentMiddleName,
                    presidentMiddleNameMr: r.presidentMiddleNameMr,
                    presidentLastName: r.presidentLastName,
                    presidentLastNameMr: r.presidentLastNameMr,
                    applicantFirstName: r.applicantFirstName,
                    applicantFirstNameMr: r.applicantFirstNameMr,
                    applicantMiddleName: r.applicantMiddleName,
                    applicantMiddleNameMr: r.applicantMiddleNameMr,
                    applicantLastName: r.applicantLastName,
                    applicantLastNameMr: r.applicantLastNameMr,
                    startDate: r.startDate,
                    startDateMr: r.startDateMr,
                    renewalDate: r.renewalDate,
                    renewalDateMr: r.renewalDateMr,
                    closingDate: r.closingDate,
                    closingDateMr: r.closingDateMr,
                    modificationDate: r.modificationDate,
                    modificationDateMr: r.modificationDateMr,
                    renewalRemarks: r.renewalRemarks,
                    renewalRemarksMr: r.renewalRemarksMr,

                    currStatus:
                      r.status === null
                        ? "pending"
                        : "" || r.status === 0
                        ? "Save As Draft"
                        : "" || r.status === 1
                        ? "Send Bank To Citizen"
                        : "" || r.status === 2
                        ? "Samuha Sanghatak"
                        : "" || r.status === 3
                        ? "Send To Dept Clerk"
                        : "" || r.status === 4
                        ? "Send Back To Dept Clerk"
                        : "" || r.status === 5
                        ? "Send To Asst Commissioner"
                        : "" || r.status === 6
                        ? "Send Back To Asst Commissioner"
                        : "" || r.status === 7
                        ? "Send To Dy Commissioner"
                        : "" || r.status === 8
                        ? "Send Back To Dy Commissioner"
                        : "" || r.status === 16
                        ? "Send Back To Dept Clerk After Approval Dy Commissioner"
                        : "" || // : r.status === 9
                          // ? "Send To Accountant"
                          r.status === 10
                        ? "Complete"
                        : "" || r.status === 11
                        ? "Close"
                        : "" || r.status === 12
                        ? "Duplicate"
                        : "Invalid",

                    // status: r.activeFlag === "Y" ? "Active" : "Inactive",
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
            })
        : axios
            .get(
              `${urls.BSUPURL}/trnBachatgatRegistration/getAll`,

              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                  // auth_token: userToken,
                  UserId: deptUser && deptUser,
                },
                params: {
                  pageSize: _pageSize,
                  pageNo: _pageNo,
                },
              },
            )

            .then((r) => {
              console.log("token", user.id);
              console.log(";getr", r);

              // let result = r.data.trnBachatgatRegistrationList;

              let result = r.data.trnBachatgatRegistrationList;
              console.log("@result", result);

              if (!r.data && r.data.length == 0) {
                return;
              }
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

              //Accountant
              // if (
              //   authority &&
              //   authority.find((val) => val === "PAYMENT VERIFICATION")
              // ) {
              //   tableData5 = r?.data?.trnBachatgatRegistrationList.filter(
              //     (data, index) => {
              //       return data.status === 9;
              //     }
              //   );
              // }

              tableData = [...tableData1, ...tableData2, ...tableData3, ...tableData4, ...tableData5];

              console.log("tableData", tableData);

              tableData.sort((a, b) => {
                console.log("sortedTableData", a, b);
                // return b - a;
              });

              // end status

              console.log("w@");

              if (wardNames && zoneNames && crAreaNames) {
                let _res = result?.map((r, i) => {
                  {
                    console.log("stat", r);
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

                    zoneKey: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
                      ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
                      : "-",
                    zoneKeyMr: r.zoneKeyMr,

                    wardKey: wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                      ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
                      : "-",
                    wardkeyMr: r.wardkeyMr,
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
                    areakeyMr: r.areakeyMr,
                    geocode: r.geocode,
                    geocodeMr: r.geocodeMr,
                    mediaKey: r.mediaKey,
                    mediaKeyMr: r.mediaKeyMr,
                    cfcApplicationNo: r.cfcApplicationNo,
                    cfcApplicationNoMr: r.cfcApplicationNoMr,

                    applicationNo: r.applicationNo,
                    applicationNoMr: r.applicationNoMr,
                    flatBuldingNo: r.flatBuldingNo,
                    flatBuldingNoMr: r.flatBuldingNoMr,
                    buildingName: r.buildingName,
                    buildingNameMr: r.buildingNameMr,
                    roadName: r.roadName,
                    roadNameMr: r.roadNameMr,
                    landlineNo: r.landlineNo,
                    landlineNoMr: r.landlineNoMr,
                    mobileNo: r.mobileNo,
                    mobileNoMr: r.mobileNoMr,
                    emailId: r.emailId,
                    emailIdMr: r.emailIdMr,

                    pincode: r.pincode,
                    pincodeMr: r.pincodeMr,
                    totalMembersCount: r.totalMembersCount,
                    totalMembersCountMr: r.totalMembersCountMr,
                    fullName: r.presidentFirstName + " " + r.presidentLastName,
                    // presidentFirstName: r.presidentFirstName,
                    // presidentFirstNameMr: r.presidentFirstNameMr,
                    presidentMiddleName: r.presidentMiddleName,
                    presidentMiddleNameMr: r.presidentMiddleNameMr,
                    presidentLastName: r.presidentLastName,
                    presidentLastNameMr: r.presidentLastNameMr,
                    applicantFirstName: r.applicantFirstName,
                    applicantFirstNameMr: r.applicantFirstNameMr,
                    applicantMiddleName: r.applicantMiddleName,
                    applicantMiddleNameMr: r.applicantMiddleNameMr,
                    applicantLastName: r.applicantLastName,
                    applicantLastNameMr: r.applicantLastNameMr,
                    startDate: r.startDate,
                    startDateMr: r.startDateMr,
                    renewalDate: r.renewalDate,
                    renewalDateMr: r.renewalDateMr,
                    closingDate: r.closingDate,
                    closingDateMr: r.closingDateMr,
                    modificationDate: r.modificationDate,
                    modificationDateMr: r.modificationDateMr,
                    renewalRemarks: r.renewalRemarks,
                    renewalRemarksMr: r.renewalRemarksMr,

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

                    status: r.activeFlag === "Y" ? "Active" : "Inactive",
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
    }
  };

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
          axios
            .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                UserId: citizenUserData && citizenUserData,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });

                getBachatgatCategoryTrn();
                setButtonInputState(false);
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
          axios
            .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                UserId: citizenUserData && citizenUserData,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBachatgatCategoryTrn();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const appendUI = () => {
    append({
      applicationName: "",
      roleName: "",
    });
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    geocode: "",
    cfcApplicationNo: "",
    applicationNo: "",
    flatBuildingNo: "",
    buildingName: "",
    roadName: "",
    landlineNo: "",
    buildingName: "",
    roadName: "",
    mobileNo: "",
    emailId: "",
    category: "",
    landmark: "",
    pincode: "",
    presidentFirstName: "",
    presidentMiddleName: "",
    presidentLastName: "",
    applicantFirstName: "",
    applicantMiddleName: "",
    applicantLastName: "",
    startDate: null,
    closingDate: null,
    renewalDate: null,

    renewalRemarks: "",
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
    alert("first");
    console.log(":formData", formData);
    const finalBodyForApi = {
      // status: formData.currStatus,
      ...formData,

      // UserId: user.id,

      // activeFlag: formData.activeFlag,

      // activeFlag: btnSaveText == "Update" ? formData.activeFlag : null,
      trnBachatgatRegistrationDocumentsList: JSON.parse(localStorage.getItem("UploadedDoc"))?.map((obj) => {
        return { documentPath: obj.filePath, fileType: obj.mimeType, activeFlag: "Y" };
      }),
      //  localStorage.getItem("UploadedDoc")
      //   ? localStorage.getItem("UploadedDoc")
      //   : "",
      // [
      //   {
      //     documentTypeKey: "1",
      //     documentFlow: "1",
      //     documentPath: "documentPath",
      //     fileType: "png",
      //     activeFlag: "Y",
      //   },
      // ],
      trnBachatgatRegistrationMembersList: formData.trnBachatgatRegistrationMembersList,
      // [
      //   {
      //     fullName: "full name",
      //     designation: "1",
      //     address: "address",
      //     aadharNumber: "aadhar no",
      //   },
      // ],
    };

    if (btnSaveText === "Save") {
      console.log(":finalBodyForApi", finalBodyForApi);
      if (loggedUser === "citizenUser") {
        const tempData = axios
          .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, finalBodyForApi, {
            headers: {
              Authorization: `Bearer ${user.token}`,
              UserId: citizenUserData && citizenUserData,
            },
          })
          .then((res) => {
            console.log("--res", res);
            if (res.status == 201) {
              sweetAlert("Saved!", "Record saved succesfully !", "success");
              setButtonInputState(false);
              setIsOpenCollapse(false);
              getBachatgatCategoryTrn();
              setFetchData(tempData);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
              localStorage.removeItem("UploadedDoc");
            }
          });
      } else {
        const tempData = axios
          .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, finalBodyForApi, {
            headers: {
              Authorization: `Bearer ${user.token}`,
              // auth_token: userToken,
              UserId: citizenUserData && citizenUserData,
            },
          })
          .then((res) => {
            console.log("--res", res);
            if (res.status == 201) {
              sweetAlert("Saved!", "Record saved succesfully !", "success");
              setButtonInputState(false);
              setIsOpenCollapse(false);
              getBachatgatCategoryTrn();
              setFetchData(tempData);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
              localStorage.removeItem("UploadedDoc");
            }
          });
      }
    }

    //update Data
    else if (btnSaveText === "Update") {
      alert("update");
      console.log("DatafinalBodyApi", valueData);
      if (loggedUser === "citizenUser") {
        let payload = {
          ...formData,
          status: valueData?.status,
          activeFlag: formData.activeFlag,
          isApproved: false,
          isComplete: false,
          isDraft: true,
          // activeFlag: "Y",
          trnBachatgatRegistrationMembersList: valueData?.trnBachatgatRegistrationMembersList,
          trnBachatgatRegistrationDocumentsList: valueData?.trnBachatgatRegistrationDocumentsList,
        };
        console.log("payy", payload);

        const tempData = axios
          .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, payload, {
            headers: {
              // Authorization: `Bearer ${userToken}`,
              UserId: citizenUserData && citizenUserData,
            },
          })
          .then((res) => {
            console.log("---res", res);
            if (res.status == 201) {
              // updateData?.status,
              // status: handleParams,
              formData.id
                ? sweetAlert("Updated!", "Record Updated successfully !", "success")
                : sweetAlert("Saved!", "Record Saved successfully !", "success");
              getBachatgatCategoryTrn();
              // setButtonInputState(false);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
              setIsOpenCollapse(false);
              localStorage.removeItem("UploadedDoc");
            }
          });
      }
    }
    // else {
    //   let payload = {
    //     ...finalBodyForApi,
    //     status: 2,
    //   };
    //   const tempData = axios
    //     .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, payload, {
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //         UserId: deptUser && deptUser,
    //       },
    //     })
    //     .then((res) => {
    //       console.log("res", res);
    //       if (res.status == 201) {
    //         formData.id
    //           ? sweetAlert("Updated!", "Record Updated successfully !", "success")
    //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
    //         getBachatgatCategoryTrn();
    //         // setButtonInputState(false);
    //         setEditButtonInputState(false);
    //         setDeleteButtonState(false);
    //         setIsOpenCollapse(false);
    //       }
    //     });
    // }
  };

  const resetValuesExit = {
    geocode: "",
    cfcApplicationNo: "",
    applicationNo: "",
    flatBuildingNo: "",
    buildingName: "",
    roadName: "",
    landlineNo: "",
    buildingName: "",
    roadName: "",
    mobileNo: "",
    emailId: "",
    category: "",
    landmark: "",
    pincode: "",
    presidentFirstName: "",
    presidentMiddleName: "",
    presidentLastName: "",
    applicantFirstName: "",
    applicantMiddleName: "",
    applicantLastName: "",
    startDate: null,
    closingDate: null,
    renewalDate: null,
    renewalRemarks: "",
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

    {
      field: "totalMembersCount",
      headerName: "Total Members Count",
      // flex: 1,
      width: 220,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: "President Name",
      // flex: 1,
      width: 250,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "startDate",
      headerName: "Start Date",
      // flex: 1,
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "currStatus",
      headerName: "Status",
      // flex: 1,
      width: 250,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: "Actions",
      // <FormattedLabel id="actions" />,
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          // oldData
          <Box>
            <IconButton
              onClick={() => {
                console.log(":>74", params.row);
                handleViewActions(params.row);
                setSendData(params.row);
              }}
            >
              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
            </IconButton>

            {loggedUser !== "departmentUser" ? (
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
            ) : (
              <></>
            )}

            {/* {authority && authority[0] === "ENTRY" ? (
              <>


                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    setBtnSaveText("Update"),
                      setID(params.row.id),
                      setIsOpenCollapse(true),
                      setSlideChecked(true);

                    console.log("params.row: ", params.row);
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
                      setSlideChecked(true);

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
            ) : (
              <></>
            )} */}

            {/* for delete data Inactivate */}
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
            BachatGat Category Registration
          </h2>
        </Box>

        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: "10px" }}>
                {/* For Date Picker */}
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.startDate}>
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
                    <FormHelperText>{errors?.startDate ? errors.startDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* To date Picker */}
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.closingDate}>
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
                    <FormHelperText>{errors?.closingDate ? errors.closingDate.message : null}</FormHelperText>
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
                  <FormControl error={errors.zoneKey} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">Zone Name</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          // onChange={(value) => {
                          //   field.onChange(value);
                          //   getFilterWards(value);
                          // }}
                          onChange={(value) => field.onChange(value)}
                          label="Select Zone"
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

                {/* BachatGat GISd */}
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
                    label="Bachat Gat GISID/Geo code"
                    variant="standard"
                    {...register("geocode")}
                    error={!!errors.geocode}
                    helperText={errors?.geocode ? errors.geocode.message : null}
                  />
                </Grid>

                {/* BachatGat FullName */}
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
                    label="Bachat Gat Full Name"
                    sx={{
                      width: "90%",
                      "& .MuiInput-input": {
                        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                          "-webkit-appearance": "none",
                        },
                      },
                    }}
                    variant="standard"
                    // type="number"
                    {...register("bachatgatName")}
                    error={!!errors.bachatgatName}
                    helperText={errors?.bachatgatName ? errors.bachatgatName.message : null}
                  />
                </Grid>

                {/* CFC Application No */}

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
                    label="CFC Application No"
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
                    {...register("cfcApplicationNo")}
                    error={!!errors.cfcApplicationNo}
                    helperText={
                      errors?.cfcApplicationNo
                        ? errors.cfcApplicationNo.message
                        : null
                    }
                  />
                </Grid> */}
              </Grid>
              {/* 3rd Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Online application spacing */}
                <Grid itemm xs={6}></Grid>
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
                    alignItems: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="Online application No"
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
                    {...register("onlineApplicationNo")}
                    error={!!errors.onlineApplicationNo}
                    helperText={
                      errors?.onlineApplicationNo
                        ? errors.onlineApplicationNo.message
                        : null
                    }
                  />
                </Grid> */}
              </Grid>
              {/* Main gap  Bachat Gat Address*/}
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
                  <Typography variant="h6">Bachat Gat Address</Typography>
                </Grid>
              </Grid>
              {/* 4th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Flat/BuildingNo */}
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
                    label="Flat/Building No."
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

                {/* Landmark */}

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
                    label="Landmark"
                    variant="standard"
                    {...register("landmark")}
                    error={!!errors.landmark}
                    helperText={errors?.landmark ? errors.landmark.message : null}
                  />
                </Grid>
              </Grid>
              {/* 5th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Online Application No */}
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
                    label="Online Application No"
                    variant="standard"
                    {...register("onlineApplicationNoSE")}
                    error={!!errors.onlineApplicationNoSE}
                    helperText={
                      errors?.onlineApplicationNoSE
                        ? errors.onlineApplicationNoSE.message
                        : null
                    }
                  />
                </Grid> */}

                {/* Online Application No */}
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
                          label="Online Application No"
                          variant="standard"
                          {...register("onlineApplicationNoTE")}
                          error={!!errors.onlineApplicationNoTE}
                          helperText={
                            errors?.onlineApplicationNoTE
                              ? errors.onlineApplicationNoTE.message
                              : null
                          }
                        />
                      </Grid> */}

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

                {/* Bachat Gat Total Members Count */}
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
                    label="Bachat Gat Total Members count"
                    variant="standard"
                    type="number"
                    sx={{
                      width: "90%",
                    }}
                    {...register("totalMembersCount")}
                    error={!!errors.totalMembersCount}
                    helperText={
                      errors?.totalMembersCount
                        ? errors.totalMembersCount.message
                        : null
                    }
                  />
                </Grid> */}
              </Grid>
              {/* 6th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* BachatGat President First Name */}
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
                    label="President First Name "
                    variant="standard"
                    {...register("presidentFirstName")}
                    error={!!errors.presidentFirstName}
                    helperText={errors?.presidentFirstName ? errors.presidentFirstName.message : null}
                  />
                </Grid>

                {/* Online ApBachat Gat Total Members Count Application No*/}
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
                  <Tooltip title="Online ApBachat Gat Total Members Count Application No">
                    <TextField
                      id="standard-basic"
                      label="Online ApBachat Gat Total Members Count Application No"
                      variant="standard"
                      type="number"
                      sx={{
                        width: "90%",
                      }}
                      {...register("totalMembersCount")}
                      error={!!errors.totalMembersCount}
                      helperText={errors?.totalMembersCount ? errors.totalMembersCount.message : null}
                    />
                  </Tooltip>
                </Grid>

                {/* BachatGat President Father Name */}
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
                    label="President Father Name"
                    variant="standard"
                    {...register("presidentMiddleName")}
                    error={!!errors.presidentMiddleName}
                    helperText={errors?.presidentMiddleName ? errors.presidentMiddleName.message : null}
                  />
                </Grid>

                {/*  BachatGat President Surname */}
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
                    label="BachatGat President Surname"
                    variant="standard"
                    {...register("presidentLastName")}
                    error={!!errors.presidentLastName}
                    helperText={errors?.presidentLastName ? errors.presidentLastName.message : null}
                  />
                </Grid>
              </Grid>
              {/* Main gap  Applicant Name Details*/}
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
                  <Typography variant="h6">Applicant Details</Typography>
                </Grid>
              </Grid>
              {/* 7th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* First Name */}
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
                    label="First Name"
                    variant="standard"
                    {...register("applicantFirstName")}
                    error={!!errors.applicantFirstName}
                    helperText={errors?.applicantFirstName ? errors.applicantFirstName.message : null}
                  />
                </Grid>
                .{/* Middle Name */}
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
                    label="Middle Name"
                    variant="standard"
                    {...register("applicantMiddleName")}
                    error={!!errors.applicantMiddleName}
                    helperText={errors?.applicantMiddleName ? errors.applicantMiddleName.message : null}
                  />
                </Grid>
                {/* Surname/Lastname */}
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
                  {/* {console.log("appl", watch("applicantLastName"))} */}
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label="Surname/Lastname "
                    variant="standard"
                    {...register("applicantLastName")}
                    error={!!errors.applicantLastName}
                    helperText={errors?.applicantLastName ? errors.applicantLastName.message : null}
                  />
                </Grid>
                {/* Landline No. */}
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
                    label="Landline No. "
                    variant="standard"
                    {...register("landlineNo")}
                    error={!!errors.landlineNo}
                    helperText={errors?.landlineNo ? errors.landlineNo.message : null}
                  />
                </Grid>
              </Grid>
              {/* 8th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Mobile No. */}
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
                    label="Mobile No."
                    variant="standard"
                    {...register("mobileNo")}
                    error={!!errors.mobileNo}
                    helperText={errors?.mobileNo ? errors.mobileNo.message : null}
                  />
                </Grid>

                {/* Email Id */}
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
                    label="Email Id"
                    variant="standard"
                    {...register("emailId")}
                    error={!!errors.emailId}
                    helperText={errors?.emailId ? errors.emailId.message : null}
                  />
                </Grid>

                {/* Bachat Gat category */}

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
                  <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.categoryKey}>
                    <InputLabel id="demo-simple-select-standard-label">Bachat Gat category</InputLabel>
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
                          {bachatGatCategory &&
                            bachatGatCategory.map((service, index) => (
                              <MenuItem key={index} value={service.id}>
                                {service.bachatGatCategoryName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="categoryKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.categoryKey ? errors.categoryKey.message : null}</FormHelperText>
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
                    type="number"
                    {...register("bankAccountHolderName")}
                    error={!!errors.bankAccountHolderName}
                    helperText={errors?.bankAccountHolderName ? errors.bankAccountHolderName.message : null}
                  />
                </Grid>

                {/* Bank IFSC Code */}

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
                    label="Bank IFSC Code"
                    variant="standard"
                    {...register("ifscCode")}
                    error={!!errors.ifscCode}
                    helperText={errors?.ifscCode ? errors.ifscCode.message : null}
                  />
                </Grid>
              </Grid>
              {/* 10th Container */}
              <Grid container sx={{ padding: "10px" }}>
                {/* Bank MICR Code */}
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
                    type="number"
                    sx={{
                      width: "90%",
                      "& .MuiInput-input": {
                        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                          "-webkit-appearance": "none",
                        },
                      },
                    }}
                    label="Bank MICR Code"
                    variant="standard"
                    {...register("micrCode")}
                    error={!!errors.micrCode}
                    helperText={errors?.micrCode ? errors.micrCode.message : null}
                  />
                </Grid>

                {/* Bachat Gat start date */}
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.fromDate}>
                    <Controller
                      control={control}
                      name="startDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Bachat Gat Start date</span>}
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
                    <FormHelperText>{errors?.startDate ? errors.startDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* BachatGat close Date */}

                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.closingDate}>
                    <Controller
                      control={control}
                      name="closingDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Bachat Gat Close date</span>}
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
                    <FormHelperText>{errors?.closingDate ? errors.closingDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* Modification date */}

                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.modificationDate}>
                    <Controller
                      control={control}
                      name="modificationDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Modification Date</span>}
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
                      {errors?.modificationDate ? errors.modificationDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {/* 11th Container */}

              {/* Renewal Date */}
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <FormControl variant="standard" style={{ marginTop: 10 }} error={!!errors.renewalDate}>
                    <Controller
                      control={control}
                      name="renewalDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={<span style={{ fontSize: 16 }}>Renewal Date</span>}
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
                    <FormHelperText>{errors?.renewalDate ? errors.renewalDate.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* Reason For Closing of BachatGat */}
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
                    label="Reason For Closing of BachatGat"
                    variant="standard"
                    {...register("closingReason")}
                    error={!!errors.closingReason}
                    helperText={errors?.closingReason ? errors.closingReason.message : null}
                  />
                </Grid>
              </Grid>

              {/* Main gap  Member Information*/}
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
                  <Typography variant="h6">Member Information</Typography>
                </Grid>
              </Grid>

              {/* 12th Container */}

              <Grid container sx={{ padding: "10px" }}>
                {/* Member FullName */}
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
                    label="Member Fullname"
                    variant="standard"
                    {...register("fullName")}
                    error={!!errors.fullName}
                    helperText={
                      errors?.fullName ? errors.fullName.message : null
                    }
                  />
                </Grid> */}

                {/* Member FullAddress */}
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
                    label="Member FullAddress"
                    variant="standard"
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors?.address ? errors.address.message : null}
                  />
                </Grid> */}

                {/* Member Designation */}
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
                    error={errors.designation}
                    variant="standard"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Member Designation
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
                          {designationList &&
                            designationList.map((auditorium, index) => (
                              <MenuItem
                                key={index}
                                value={auditorium.description}
                              >
                                {auditorium.description}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="designation"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.designation ? errors.designation.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}

                {/* Member Adhhaar No */}
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
                    label="Member Adhhaar No"
                    variant="standard"
                    {...register("aadharNumber")}
                    error={!!errors.aadharNumber}
                    helperText={
                      errors?.aadharNumber ? errors.aadharNumber.message : null
                    }
                  />
                </Grid> */}

                {/* Upload Data */}

                {/* Last Container */}
              </Grid>

              <Grid container>
                <Grid item xs={11} style={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      appendUI();
                    }}
                  >
                    Add more
                  </Button>
                </Grid>
              </Grid>

              <Grid container sx={{ padding: "10px" }}>
                <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
                  {fields.map((_parawise, index) => {
                    return (
                      <>
                        <Grid
                          item
                          xs={2.5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <TextField
                            placeholder="MemberFullName"
                            size="small"
                            {...register(`trnBachatgatRegistrationMembersList.${index}.fullName`)}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={2.5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <TextField
                            placeholder="MemberFullAddress"
                            size="small"
                            {...register(`trnBachatgatRegistrationMembersList.${index}.address`)}
                          />
                        </Grid>
                        <Grid
                          xs={2.5}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl
                            error={!!errors.designation}
                            variant="standard"
                            fullWidth
                            size="small"
                            sx={{ width: "90%" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">Member Designation</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  label="MemberDesignation"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                >
                                  {
                                    // [
                                    //   { id: 1, department: "ABC" },
                                    //   { id: 2, department: "XYZ" },
                                    // ]
                                    designationList &&
                                      designationList.map((auditorium, index) => (
                                        <MenuItem key={index} value={auditorium.description}>
                                          {auditorium.description}
                                        </MenuItem>
                                      ))
                                  }
                                </Select>
                              )}
                              {...register(`trnBachatgatRegistrationMembersList.${index}.designation`)}
                              //
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.designation ? errors?.designation.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={2.5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <TextField
                            placeholder="MemberAdhaar"
                            size="small"
                            {...register(`trnBachatgatRegistrationMembersList.${index}.aadharNumber`)}
                          />
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
                            Delete
                          </Button>
                        </Grid>
                      </>
                    );
                  })}
                </Grid>
              </Grid>
              {/* Main gap  Required Documents*/}
              <Grid container sx={{ padding: "10px" }}>
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
                  <Typography variant="h6">Required Documents</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                {/* Documents */}

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
                    label="Documents"
                    variant="standard"
                    {...register("document")}
                    error={!!errors.document}
                    helperText={errors?.bankAddress ? errors.document.message : null}
                  />
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
                    {...register("renewalRemarks")}
                    error={!!errors.renewalRemarks}
                    helperText={errors?.renewalRemarks ? errors.renewalRemarks.message : null}
                  />
                </Grid>

                {/* Upload Button */}

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "40px" }}>
                  {console.log("ppp", docCertificate)}{" "}
                  <Typography variant="subtitle2">Attach Documents </Typography>{" "}
                  <UploadButtonBsup
                  // appName="BSUP-Scheme"
                  // serviceName="BSUP-NewConnection"
                  // filePath={setDocCertificate}
                  // fileName={docCertificate}
                  />{" "}
                  {/* {console.log("Doc", docCertificate)} */}
                </Grid>

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
            getBachatgatCategoryTrn(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getBachatgatCategoryTrn(_data, data.page);
          }}
        />
      </Paper>
    </div>
  );
};

export default BachatGatCategory;
