// import React from "react";

// function Index() {
//   return <div>hello</div>;
// }

// export default Index;

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

  const language = useSelector((state) => state.labels.language);
  const loggedUser = localStorage.getItem("loggedInUser");
  console.log("ga", loggedUser);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [remark, setRemark] = useState("");
  const [isdisabled, setIsDisabled] = useState(false);
  const [isRejDisabled, setIsRejDisabled] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);

  const [zone, setZone] = useState("");
  const [bankName, setBankName] = useState("");
  const [presidentF, setPresidentF] = useState("");
  const [desig, setDesig] = useState("");
  const [dateSplit, setDateSplit] = useState([]);
  const [dateTo, setDateTo] = useState([]);
  const [bachatGatClose, setBachatGatClose] = useState([]);
  const [bachatGatModify, setBachatGatModidy] = useState([]);
  const [bachatGatRenewal, setBachatGatRenewal] = useState([]);
  const [fetchData, setFetchData] = useState(null);

  const [docCertificate, setDocCertificate] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [ward, setWard] = useState("");
  const [area, setArea] = useState("");
  const [geocode, setgeocode] = useState("");
  const [gatCategory, setGatCategory] = useState("");
  const [bank, setBank] = useState("");
  const [designationList, setDesignation] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [bachatGatCategory, setBachatGatCategory] = useState([]);
  const [selectedBank, setSelectedBank] = useState([]);
  const [branch, setBranch] = useState("");
  const [updateData, setUpdateData] = useState([]);
  const [aa, setAA] = useState([]);
  const [loading, setLoading] = useState(true);
  const [valueData, setValuesData] = useState();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  //handle view actions as per role
  const handleViewActions = (_id) => {
    console.log("clicked ids", _id);
  };

  let abc = [];

  // useEffect(() => {
  //   getZoneName();
  //   getWardNames();
  //   getCRAreaNacme();
  //   getBachatGatCategory();
  //   getBankMasters();
  // }, [router.query.id]);

  useEffect(() => {
    if (router.query.id) {
      getBachatgatCategoryTrn();
    }
  }, [router.query.id]);

  useEffect(() => {
    getDateData(valueData);
    getToDateData(valueData);
    getBachatGatCloseDate(valueData);
    getBachatGatModifyDate(valueData);
    getBachatRenewalDate(valueData);
    getZoneName(valueData);
    getWardNames(valueData);
    getCRAreaName(valueData);
    getBachatGatCategory(valueData);
    getBankMasters(valueData);
  }, [valueData]);

  //get logged in users
  const userNew = useSelector((state) => state.user.user);

  console.log("users", userNew);

  const userToken = useSelector((state) => state.user.usersDepartmentDashboardData.token);

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

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);
  // Use Effects for disabled Approve Property
  const authority = userNew?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log(
    "///",
    // authority && authority[0] == "SAMUHA SANGHATAK" && (dataSource.status == 2 || dataSource.status == 3),
  );

  // for approval

  // for rejection
  // const validateRej = () => {
  //   return (
  //     (authority &&
  //       authority[0] == "SAMUHA SANGHATAK" &&
  //       dataSource.status == 1) ||
  //     (authority &&
  //       authority[0] == "PROPOSAL APPROVAL" &&
  //       dataSource.status == 4) ||
  //     (authority && authority[0] == "APPROVAL" && dataSource.status == 6) ||
  //     (authority && authority[0] == "FINAL_APPROVAL" && dataSource.status == 8)
  //   );
  // };

  // useEffect(() => {
  //   const isRejDisabled = validateRej();
  //   setIsRejDisabled(isRejDisabled);
  // }, [
  //   dataSource.status == 1,
  //   dataSource.status == 4,
  //   dataSource.status == 6,
  //   dataSource.status == 8,
  // ]);

  // logged in User
  const user = useSelector((state) => state.user.user);
  console.log("bb", user);

  const getDateData = (fromData) => {
    let value = fromData?.fromDate?.split("T");
    console.log("ooo", value);

    // let val = value.split("T");
    let data = value && value[0];
    setDateSplit(data);
    console.log("67", data);
  };

  const getToDateData = (toData) => {
    let value2 = toData?.toDate?.split("T");
    console.log("gg", value2);

    // let val = value.split("T");
    let data2 = value2 && value2[0];
    setDateTo(data2);
    // console.log("63", data2);
  };

  const getBachatGatCloseDate = (closeData) => {
    let value3 = closeData?.closingDate?.split("T");
    let data3 = value3 && value3[0];
    setBachatGatClose(data3);
    // console.log("3", value3);
  };

  const getBachatGatModifyDate = (modData) => {
    let value4 = modData?.modificationDate?.split("T");
    console.log("yy", value4);
    let data4 = value4 && value4[0];
    setBachatGatModidy(data4);
    console.log("4", value4);
  };

  const getBachatRenewalDate = (renData) => {
    let value5 = renData?.renewalDate?.split("T");
    let data5 = value5 && value5[0];
    setBachatGatRenewal(data5);
    // console.log("5", value5);
  };

  // const getDesignation = () => {
  //   setDesig(
  //     dataSource?.trnBachatgatRegistrationMembersList.length > 0
  //       ? dataSource?.trnBachatgatRegistrationMembersList[0]?.designation
  //       : "-"
  //   );
  // };

  const [audienceSample, setAudienceSample] = useState(valueData?.trnBachatgatRegistrationMembersList);

  console.log("554", dataSource.trnBachatgatRegistrationMembersList);

  useEffect(() => {
    setAudienceSample(valueData?.trnBachatgatRegistrationMembersList);
    let _res = audienceSample;

    valueData?.trnBachatgatRegistrationMembersList?.map((val, index) => {
      console.log("tt", val);
      return append({
        fullName: val?.fullName,
        address: val?.address,
        designation: val?.designation,
        aadharNumber: val?.aadharNumber,
      });
    });
  }, [valueData?.trnBachatgatRegistrationMembersList]);

  //       console.log("desi", r);
  //       setDesignation(
  //         r.data.designation.map((row) => ({
  //           id: row.id,
  //           description: row.description,
  //         }))
  //       );
  //     });
  //   };

  console.log("www", valueData);

  useEffect(() => {
    getSelectedObject(router.query.id);
  }, [router.query.id]);

  const getSelectedObject = (id) => {
    console.log("::333", id);
    {
      loggedUser === "citizenUserData"
        ? axios
            .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                // auth_token: userToken,
                UserId: citizenUserData && citizenUserData,
              },
            })
            .then((r) => {
              console.log("::aa", id, r);

              // console.log("ss11", id)

              setValuesData(r.data.trnBachatgatRegistrationList.find((row) => id == row.id));
            })
        : axios
            .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                // auth_token: userToken,
                UserId: deptUser && deptUser,
              },
            })
            .then((r) => {
              console.log("::aa", id, r);

              // console.log("ss11", id)

              setValuesData(r.data.trnBachatgatRegistrationList.find((row) => id == row.id));
            });
    }
    axios
      .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          // auth_token: userToken,
          UserId: citizenUserData && citizenUserData,
        },
      })
      .then((r) => {
        console.log("::aa", id, r);

        // console.log("ss11", id)

        setValuesData(r.data.trnBachatgatRegistrationList.find((row) => id == row.id));
      });
  };
  console.log(
    "ss11",
    authority &&
      authority[0] == "PROPOSAL APPROVAL" &&
      (valueData?.status == 3 || valueData?.status == 4 || valueData?.status == 16 || valueData?.status == 7),
  );

  const validate = () => {
    return (
      (authority && authority[0] == "SAMUHA SANGHATAK" && valueData?.status == 2) ||
      (authority &&
        authority[0] == "PROPOSAL APPROVAL" &&
        (valueData?.status == 3 || valueData?.status == 4 || valueData?.status == 16)) ||
      valueData?.status == 7 ||
      (authority && authority[0] == "APPROVAL" && (valueData?.status == 5 || valueData?.status == 6)) ||
      (authority && authority[0] == "FINAL_APPROVAL" && (valueData?.status == 7 || valueData?.status == 8))
    );
  };

  useEffect(() => {
    const isdisabled = validate();
    setIsDisabled(isdisabled);
  }, [valueData]);

  // old getAll Data

  // useEffect(() => {
  //   axios
  //     .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //         // auth_token: userToken,
  //         UserId: deptUser && deptUser,
  //       },
  //     })
  //     .then((r) => {
  //       let result = r.data.trnBachatgatRegistrationList;
  //       let valData = result?.find((obj) => {
  //         console.log(":ff", obj.id, id);
  //         return obj.id == id;
  //       });
  //       setUpdateData(valData);
  //       console.log("vall", valData);
  //     });
  // }, [id]);

  useEffect(() => {
    axios
      .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
        headers: {
          // auth_token: userToken,
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

    let _res = valueData;

    console.log("::_res", _res);

    setValue("zoneKey", _res?.zoneKey ? _res?.zoneKey : null);
    setValue("wardKey", _res?.wardKey ? _res?.wardKey : null);
    setValue("areaKey", _res?.areaKey ? _res?.areaKey : null);
    setValue("flatBuldingNo", _res?.flatBuldingNo ? _res?.flatBuldingNo : "-");
    setValue("categoryKey", _res?.categoryKey ? _res?.categoryKey : null);
    setValue("toDate", _res?.toDate ? _res?.toDate : null);
    setValue("bankBranchKey", _res?.bankBranchKey ? _res?.bankBranchKey : null);
  }, [valueData]);
  console.log(":ht", valueData);

  const getZoneName = (zoneData) => {
    console.log("uv", zoneData);
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      console.log("000", res);
      let temp = res.data.zone;
      console.log("kk", temp);
      let _res = temp.find((obj) => {
        // console.log("fgf", dataSourcke.zoneKeys);
        return obj.id == zoneData?.zoneKey;
      });

      console.log("po", _res);
      setZone(_res?.zoneName);
    });
  };

  const getWardNames = (wardData) => {
    console.log("jj", wardData);
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      let temp = res.data.ward;

      let _res = temp.find((obj) => {
        console.log("ff", obj.id == valueData?.wardKey);
        return obj.id == wardData?.wardKey;
      });
      console.log("ff", _res);

      setWard(_res?.wardName ? _res?.wardName : null);
    });
  };

  // getAreaName
  const getCRAreaName = (areaData) => {
    // console.log("area test", `${urls.CfcURLMaster}/area/getAll`);
    axios.get(`${urls.CfcURLMaster}/area/getAll`).then((res) => {
      let temp = res.data.area;
      console.log("hh", temp);

      let _res = temp.find((obj) => {
        console.log("ss@@", obj.id);
        return obj.id == areaData?.areaKey;
      });

      setArea(_res?.areaName ? _res?.areaName : null);
    });
  };

  // const handleBank = (e) => {
  //   axios.get(`${urls.CFCURL}/master/bank/getAll`).then((res) => {
  //     let temp = res.data.bank;
  //     console.log("44", res.data);

  //     let _res = temp.find((obj) => {
  //       return obj.id == dataSource?.wardkey;
  //     });

  //     // setWard(_res?.wardName ? _res?.wardName : "-");
  //   });
  // };

  const getBachatGatCategory = (catData) => {
    axios.get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`).then((res) => {
      let temp = res.data.mstBachatGatCategoryList;
      console.log("tk", temp);
      let _res = temp.find((obj) => {
        console.log("ii", obj.id == valueData?.categoryKey);
        return obj.id == catData?.categoryKey;
      });

      console.log("qo", _res);
      setGatCategory(_res?.bgCategoryName ? _res?.bgCategoryName : "-");
    });
  };

  const getBankMasters = (bankData) => {
    console.log("area test", `${urls.CfcURLMaster}/area/getAll`);
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      let temp = r.data.bank;
      console.log("44", temp);

      let _res = temp.find((obj) => {
        console.log("cc@@", obj.id);
        return obj.id == bankData?.bankBranchKey;
      });
      console.log("getBankMasters", _res);
      // setBank(_res.bankName);
      setBank(_res?.bankName ? _res?.bankName : null);

      // setBranch(_res.branchName);
      setBranch(_res?.branchName ? _res?.branchName : null);
    });
  };
  console.log(":561", router.query);
  const getBachatgatCategoryTrn = () => {
    let connectionId = router.query.id;
    console.log("connectionId", connectionId);
    {
      loggedUser === "citizenUser"
        ? axios
            .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
              headers: {
                // auth_token: userToken,
                UserId: citizenUserData && citizenUserData,
              },
            })
            .then((r) => {
              let result = r.data.trnBachatgatRegistrationList;
              console.log(":result", result);
              // let _res = result.find((obj) => {
              //   console.log("obj4", obj.id, connectionId);
              //   return obj.id == connectionId;
              // });
              let _res = result.find((obj) => {
                console.log("obj4", obj.id, connectionId);
                return obj.id == connectionId;
              });

              console.log("33_res", _res);

              getZoneName(_res);
              getWardNames(_res);
              getCRAreaName(_res);
              getBachatGatCategory(_res);
              getBachatGatModifyDate(_res);
              getBachatGatCloseDate(_res);
              getBachatRenewalDate(_res);
              getBankMasters(_res);
              getDateData(_res);
              getToDateData(_res);
              // getSelectedObject(_res);

              // setDataSourcje(_res);

              // _res !== undefined &&
              if (_res !== undefined) {
                setDataSource(_res);
                setValue(":zone", _res.zoneKey);
                reset(_res);
              }
              // setDocCertificate(_res?.trnBachatgatRegistrationDocumentsList);
              console.log("77", _res?.trnBachatgatRegistrationDocumentsList);
            })
        : axios
            .get(`${urls.BSUPURL}/trnBachatgatRegistration/getAll`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                // auth_token: userToken,
                UserId: deptUser && deptUser,
              },
            })
            .then((r) => {
              let result = r.data.trnBachatgatRegistrationList;
              console.log("::result", result);

              let _res = result.find((obj) => {
                console.log("obj4", obj.id, connectionId);
              });

              console.log("_resNew", _res);
              getZoneName(_res);
              getWardNames(_res);
              getCRAreaName(_res);
              getBachatGatCategory(_res);
              getBachatGatModifyDate(_res);
              getBachatGatCloseDate(_res);
              getBachatRenewalDate(_res);
              getBankMasters(_res);
              getDateData(_res);
              getToDateData(_res);

              if (_res !== undefined) {
                setDataSource(_res);
                setValue("zone", _res.zoneKey);
                reset(_res);
              }
            });
    }
  };
  // useEffect(() => {
  //   console.log("11_res", dataSource);
  // }, [valueData, valueData?.zone]);

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
          axios.post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getBachatgatCategoryTrn();
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
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
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

  const cancelButton = () => {
    reset({
      ...resetValuesCancel,
    });
    router.push("/BsupNagarvasthi/transaction/bachatGatCategory");
  };

  const clearButton = () => {
    reset({
      ...resetValuesCancel,
      id,
    });
  };
  const resetValuesCancel = {
    remark: "",
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

  const onSubmitForm = (btnType) => {
    console.log("vvv", dataSource);
    let formData;

    console.log("form data --->", formData);
    // dispatch(setNewEntryConnection(formData))
    // Save - DB

    if (btnType === "Save") {
      valueData.status != 16
        ? (formData = {
            ...valueData,
            remarks: remark,
            isApproved: true,
            isComplete: false,
          })
        : (formData = {
            ...valueData,
            remarks: remark,
            isApproved: false,
            isComplete: true,
          });
      console.log("zz", formData);
      if (loggedUser === "citizenUser") {
        const tempData = axios
          .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, formData, {
            headers: {
              // auth_token: userToken,
              UserId: citizenUserData && citizenUserData,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              sweetAlert("Saved!", "Record Approved successfully !", "success");
              getBachatgatCategoryTrn();
              setButtonInputState(false);
              setIsOpenCollapse(false);
              setFetchData(tempData);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
              setIsDisabled(false);
            }
          });
      } else {
        const tempData = axios
          .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, formData, {
            headers: {
              Authorization: `Bearer ${userToken}`,
              // auth_token: userToken,
              UserId: deptUser && deptUser,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              sweetAlert("Saved!", "Record Approved successfully !", "success");
              getBachatgatCategoryTrn();
              setButtonInputState(false);
              setIsOpenCollapse(false);
              setFetchData(tempData);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
              setIsDisabled(false);
            }
          });
      }
    }
    // Update Data Based On ID
    else if (btnType === "Reject") {
      valueData.status != 11
        ? (formData = {
            ...valueData,
            remarks: remark,
            isApproved: false,
            isComplete: false,
          })
        : (formData = {
            ...valueData,
            remarks: remark,
            isApproved: false,
            isComplete: false,
          });

      if (loggedUser === "citizenUser") {
        const tempData = axios
          .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, formData, {
            headers: {
              // auth_token: userToken,
              UserId: citizenUserData && citizenUserData,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              sweetAlert("Saved!", "Record Approved successfully !", "success");
              getBachatgatCategoryTrn();
              setButtonInputState(false);
              setIsOpenCollapse(false);
              setFetchData(tempData);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
              setIsDisabled(false);
            }
          });
      } else {
        const tempData = axios
          .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, formData, {
            headers: {
              Authorization: `Bearer ${userToken}`,
              // auth_token: userToken,
              UserId: deptUser && deptUser,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              sweetAlert("Saved!", "Record Approved successfully !", "success");
              getBachatgatCategoryTrn();
              setButtonInputState(false);
              setIsOpenCollapse(false);
              setFetchData(tempData);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
              setIsDisabled(false);
            }
          });
      }

      let _body = {
        ...formData,
        isApproved: false,
      };
      console.log("nnn", _body);
      const tempData = axios.post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, _body).then((res) => {
        console.log("res", res);
        if (res.status == 201) {
          _body.id
            ? sweetAlert("Updated!", "Record Rejected successfully !", "success")
            : sweetAlert("Saved!", "Record Rejected successfully !", "success");
          getBachatgatCategoryTrn();
          // setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      });
    }
  };

  const resetValuesExit = {
    geocode: "",
    cfcApplicationNo: "",
    onlineApplicationNo: "",
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
    remark: "",
  };

  const columns = [
    {
      field: "zonekey",
      headerName: "Zone Name",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "wardkey",
      headerName: "Ward Name",
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "areakey",
      headerName: "Area Name",
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "onlineApplicationNo",
      headerName: "OnlineApplicationNo",
      // flex: 1,
      width: 250,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "totalMembersCount",
      headerName: "Total Members Count",
      // flex: 1,
      width: 250,
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

    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   // <FormattedLabel id="actions" />,
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box>
    //         <IconButton
    //           onClick={() => {
    //             getSelectedObject(params.row.id);
    //           }}
    //         >
    //           <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
    //         </IconButton>
    //       </Box>
    //     );
    //   },
    // },
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

        {
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container style={{ padding: "10px" }}>
              {/* For Date Picker */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                {/* <FormControl
                    variant="standard"
                    style={{ marginTop: 10 }}
                    error={!!errors.startDate}
                  >
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                From Date(in English)
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="standard"
                                sx={{ width: 230 }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.startDate ? errors.startDate.message : null}
                    </FormHelperText>
                  </FormControl> */}
                <TextField
                  id="standard-textarea"
                  label="From Date"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={dateSplit}
                  //   InputLabelProps={{
                  //     //true
                  //     shrink:
                  //       (watch("label2") ? true : false) ||
                  //       (router.query.label2 ? true : false),
                  //   }}
                />
              </Grid>
              {/* To date Picker */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-textarea"
                  label="To Date"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={dateTo}
                  // {...register("dateTo")}
                  //   InputLabelProps={{
                  //     //true
                  //     shrink:
                  //       (watch("label2") ? true : false) ||
                  //       (router.query.label2 ? true : false),
                  //   }}
                />
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
                <TextField
                  id="standard-textarea"
                  name="zoneKey"
                  label="ZoneName"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={zone}
                  defaultValue=""
                  control={control}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
                />
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
                <TextField
                  id="standard-textarea"
                  label="WardName"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={ward}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
                />
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
                <TextField
                  id="standard-textarea"
                  label="AreaName"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={area}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
                />
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
                  id="standard-textarea"
                  label="GeoCode"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.geocode}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                {console.log("ds234", dataSource)}
                <TextField
                  id="standard-textarea"
                  label="BachatGatName"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.bachatgatName}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="Flat/Building No."
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.flatBuldingNo}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="Building Name"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.buildingName}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="Road Name"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.roadName}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Landmarks */}

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
                  id="standard-textarea"
                  label="Land Mark"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.landmark}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="PinCode"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.pincode}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="PresidentFirstName
                    "
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.presidentFirstName}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                {/* <Tooltip title="Online ApBachat Gat Total Members Count Application No">
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
                    helperText={
                      errors?.totalMembersCount
                        ? errors.totalMembersCount.message
                        : null
                    }
                  />
                </Tooltip> */}

                <TextField
                  id="standard-textarea"
                  label="Total Member count
                    "
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.totalMembersCount}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
                />
              </Grid>

              {/* BachatGat President Middle Name */}
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
                  id="standard-textarea"
                  label="President Middle Name"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.presidentMiddleName}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="President Last Name"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.presidentLastName}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                <Typography variant="h6">Applicant Name Details</Typography>
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
                  id="standard-textarea"
                  label="Applicant First Name"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.applicantFirstName}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="Applicant Middle Name"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.applicantMiddleName}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="Applicant Last Name"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.applicantLastName}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="Landline No."
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.landlineNo}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="Mobile
                    No."
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.mobileNo}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="Email Id
                    "
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.emailId}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                <TextField
                  id="standard-textarea"
                  label="BachatGat categorty
                    "
                  // disabled
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={gatCategory}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
                {/* <FormControl
                  variant="standard"
                  error={!!errors.bankNameId}
                  sx={{ width: "90%" }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Bank name
                  </InputLabel>
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
                  <FormHelperText>
                    {errors?.bankNameId ? errors.bankNameId.message : null}
                  </FormHelperText>
                </FormControl> */}
                <TextField
                  id="standard-textarea"
                  label="Bank Name"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={bank}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
                {/* <FormControl
                  variant="standard"
                  sx={{ width: "90%" }}
                  error={!!errors.bankBranchKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Branch name
                  </InputLabel>
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
                          branch.map((each, index) => (
                            <MenuItem key={index} value={each}>
                              {each}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="bankBranchKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.bankBranchKey
                      ? errors.bankBranchKey.message
                      : null}
                  </FormHelperText>
                </FormControl> */}

                <TextField
                  id="standard-textarea"
                  label="Branch Name"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={branch}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
                  id="standard-textarea"
                  label="saving Acc No"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.accNo}
                  //   InputLabelProps={{
                  //     //true
                  //     shrink:
                  //       (watch("label2") ? true : false) ||
                  //       (router.query.label2 ? true : false),
                  //   }}
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
                  id="standard-textarea"
                  label="Bank IFSC code"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.ifscCode}
                  //   InputLabelProps={{
                  //     //true
                  //     shrink:
                  //       (watch("label2") ? true : false) ||
                  //       (router.query.label2 ? true : false),
                  //   }}
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
                  id="standard-textarea"
                  label="Bank MICR code"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.micrCode}
                  //   InputLabelProps={{
                  //     //true
                  //     shrink:
                  //       (watch("label2") ? true : false) ||
                  //       (router.query.label2 ? true : false),
                  //   }}
                />
              </Grid>

              {/* Bachat Gat start date */}
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-textarea"
                  label="Bachatgat Start Date"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={dateSplit}
                  //   InputLabelProps={{
                  //     //true
                  //     shrink:
                  //       (watch("label2") ? true : false) ||
                  //       (router.query.label2 ? true : false),
                  //   }}
                />
              </Grid>

              {/* BachatGat close Date */}

              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-textarea"
                  label="BachatGat Close Date"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={bachatGatClose}
                  //   InputLabelProps={{
                  //     //true
                  //     shrink:
                  //       (watch("label2") ? true : false) ||
                  //       (router.query.label2 ? true : false),
                  //   }}
                />
              </Grid>

              {/* Modification date */}

              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-textarea"
                  label="Modification Date"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={bachatGatModify}
                  //   InputLabelProps={{
                  //     //true
                  //     shrink:
                  //       (watch("label2") ? true : false) ||
                  //       (router.query.label2 ? true : false),
                  //   }}
                />
              </Grid>
            </Grid>

            {/* 11th Container */}

            {/* Renewal Date */}
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  id="standard-textarea"
                  label="Renewal Date"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={bachatGatRenewal}
                  //   InputLabelProps={{
                  //     //true
                  //     shrink:
                  //       (watch("label2") ? true : false) ||
                  //       (router.query.label2 ? true : false),
                  //   }}
                />
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
                  id="standard-textarea"
                  label="Reason For Closing BachatGat"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.closingReason}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  disabled
                >
                  Add more
                </Button>
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              <Grid container style={{ padding: "10px", backgroundColor: "white" }}>
                {fields.map((_parawise, index) => {
                  console.log("_parawise", _parawise);
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
                        {/* {console.log(
                          "ww",
                          dataSource.trnBachatgatRegistrationMembersList.map(
                            (x) => x.fullName
                          )
                        )} */}
                        {/* <TextField
                          id="standard-textarea"
                          label="Member FullName"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={dataSource.trnBachatgatRegistrationMembersList.map(
                            (x) => x.fullName
                          )}
                          InputLabelProps={{
                            //true
                            shrink: true,
                          }}
                        /> */}
                        {/* <TextField
                          placeholder="MemberFullName"
                          size="small"
                          disabled
                          {...register(
                            `trnBachatgatRegistrationMembersList.${index}.fullName`
                          )}
                        /> */}
                        <TextField
                          placeholder="Designation"
                          size="small"
                          disabled
                          value={_parawise.fullName}
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
                          placeholder="Designation"
                          size="small"
                          disabled
                          value={_parawise.address}
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
                          {/* <InputLabel id="demo-simple-select-standard-label">
                            Member Designation
                          </InputLabel> */}
                          {/* <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                label="MemberDesignation"
                                disabled
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
                                      <MenuItem
                                        key={index}
                                        value={auditorium.designation}
                                      >
                                        {auditorium.designation}
                                      </MenuItem>
                                    ))
                                }
                              </Select>
                            )}
                            {...register(
                              `trnBachatgatRegistrationMembersList.${index}.designation`
                            )}
                            //
                            control={control}
                            defaultValue=""
                          /> */}

                          <TextField
                            placeholder="Designation"
                            size="small"
                            disabled
                            value={_parawise.designation}
                          />
                          <FormHelperText>
                            {errors?.designation ? errors?.designation.message : null}
                          </FormHelperText>
                        </FormControl>

                        {/* <FormControl
                        //   error={!!errors.designation}
                        //   variant="standard"
                        //   fullWidth
                        //   size="small"
                        //   sx={{ width: "90%" }}
                        // >
                        //   <InputLabel id="demo-simple-select-standard-label">
                        //     Member Designation
                        //   </InputLabel>
                        //   <Controller
                        //     render={({ field }) => (
                        //       <Select
                        //         labelId="demo-simple-select-standard-label"
                        //         id="demo-simple-select-standard"
                        //         label="MemberDesignation"
                        //         value={field.value}
                        //         onChange={(value) => field.onChange(value)}
                        //       >
                        //         {
                                  
                        //           designationList &&
                        //             designationList.map((auditorium, index) => (
                        //               <MenuItem
                        //                 key={index}
                        //                 value={auditorium.description}
                        //               >
                        //                 {auditorium.description}
                        //               </MenuItem>
                        //             ))
                        //         }
                        //       </Select>
                        //     )}
                        //     {...register(
                        //       `trnBachatgatRegistrationMembersList.${index}.designation`
                        //     )}
                        //     //
                        //     control={control}
                        //     defaultValue=""
                        //   />
                        //   <FormHelperText>
                        //     {errors?.designation
                        //       ? errors?.designation.message
                        //       : null}
                        //   </FormHelperText>
                        // </FormControl> */}
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
                        {/* <TextField
                          placeholder="MemberAdhaar"
                          size="small"
                          disabled
                          {...register(
                            `trnBachatgatRegistrationMembersList.${index}.aadharNumber`
                          )}
                        /> */}
                        <TextField
                          placeholder="Designation"
                          size="small"
                          disabled
                          value={_parawise.aadharNumber}
                        />
                        {/* <TextField
                          id="standard-textarea"
                          label="Member Aadhar Number"
                          sx={{ m: 1, minWidth: "50%" }}
                          variant="outlined"
                          value={dataSource.trnBachatgatRegistrationMembersList.map(
                            (x) => x.aadharNumber
                          )}
                          InputLabelProps={{
                            //true
                            shrink: true,
                          }}
                        /> */}
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
                          disabled
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
                  id="standard-textarea"
                  label="Document"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.documentTypeKey}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
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
                  id="standard-textarea"
                  label="Renewal Remarks"
                  sx={{ m: 1, minWidth: "50%" }}
                  variant="outlined"
                  value={valueData?.renewalRemarks}
                  InputLabelProps={{
                    //true
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Upload Button */}

              <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
                {" "}
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  {console.log("query", router.query.id)}

                  <a
                    href={`${urls.BSUPURL}/file/preview?filePath=${docCertificate?.documentPath}`}
                    target="__blank"
                  >
                    {" "}
                    <Button variant="contained">View </Button>{" "}
                  </a>
                </Grid>
                {/* <Typography variant="subtitle2">Attach Documents </Typography>{" "}
                <UploadButton
                  appName="BSUP"
                  multiple
                  serviceName="bachatGatCategory"
                  filePath={setDocCertificate}
                  fileName={docCertificate}
                /> */}
                {/* {console.log("Doc", docCertificate)} */}
              </Grid>
            </Grid>

            {/* Main gap  Approval*/}
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
                <Typography variant="h6">Approval Section</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}></Grid>
            <Grid container style={{ padding: "10px" }}>
              {/* Add Remarks */}

              {/* {user && user?.roles[1] === "ENTRY" ? (
                <></>
              ) : (
                <Grid container mt={5}>
                  <Grid
                    item
                    xl={6}
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
                    <TextField
                      id="standard-textarea"
                      label="Remarks"
                      sx={{ m: 1, minWidth: "50%" }}
                      multiline
                      value={remark}
                      variant="outlined"
                      onChange={(e) => {
                        setRemark(e.target.value);
                      }}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                    />
                  </Grid>
                </Grid>
              )} */}

              {/* Button Row */}
              {/* {console.log("role", user.roles[0])} */}

              {loggedUser !== "departmentUser" ? (
                <Grid
                  container
                  mt={5}
                  rowSpacing={2}
                  columnSpacing={1}
                  border
                  px={5}
                  sx={{ marginLeft: "110px" }}
                >
                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={cancelButton}>
                      Save
                      {/* {<FormattedLabel id="cancel" />} */}
                    </Button>
                  </Grid>
                  {/* .................................................................. */}
                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={cancelButton}>
                      Clear
                      {/* {<FormattedLabel id="cancel" />} */}
                    </Button>
                  </Grid>
                  {/* .................................................................. */}
                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={cancelButton}>
                      Exit
                      {/* {<FormattedLabel id="cancel" />} */}
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  mt={5}
                  rowSpacing={2}
                  columnSpacing={1}
                  border
                  px={5}
                  sx={{ marginLeft: "110px" }}
                >
                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={() => {
                        onSubmitForm("Save");
                      }}
                      variant="contained"
                      disabled={!isdisabled}
                    >
                      {console.log("ddd", valueData?.status)}
                      Approve
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={() => {
                        onSubmitForm("Reject");
                      }}
                      variant="contained"
                      disabled={!isdisabled}
                      // disabled={!isRejDisabled}
                    >
                      Reject
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button onClick={clearButton} variant="contained">
                      Clear
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={cancelButton}>
                      Exit
                      {/* {<FormattedLabel id="cancel" />} */}
                    </Button>
                  </Grid>
                  {/* .................................................................. */}
                </Grid>
              )}

              {/* {loggedUser == "departmentUser" && (
                <Grid
                  container
                  mt={5}
                  rowSpacing={2}
                  columnSpacing={1}
                  border
                  px={5}
                  sx={{ marginLeft: "110px" }}
                >
                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={() => {
                        onSubmitForm("Save");
                      }}
                      variant="contained"
                    >
                      Approve
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={() => {
                        onSubmitForm("Reject");
                      }}
                      variant="contained"
                    >
                      Reject
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button onClick={clearButton} variant="contained">
                      Clear
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={cancelButton}>
                      Exit
                    </Button>
                  </Grid>
             
                </Grid>
              )} */}
            </Grid>
            <Divider />
          </form>
        }

        {/* <Grid container style={{ padding: "10px" }}>
            <Grid item xs={9}></Grid>
            <Grid
              item
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
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
          </Grid> */}

        {/* <Grid container></Grid> */}

        {/* <DataGrid
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
          /> */}
      </Paper>
    </div>
  );
};

export default BachatGatCategory;
