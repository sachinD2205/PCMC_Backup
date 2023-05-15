import { Add } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Slide,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import theme from "../../../../theme";
import UploadButton from "../../singleFileUploadButton/UploadButton";
// import UploadButton from "../.../uploadDocuments/UploadButton";
import Document from "../../uploadDocuments/UploadButton";

import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { addDocumentToLocalStorage } from "../../../../components/bsupNagarVasthi/LocalStorageFunctions/bsupDoc";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import bachatgatRegistration from "../../../../containers/schema/BsupNagarvasthiSchema/bachatgatRegistration";

const BachatGatCategory = () => {
  const {
    reset,
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bachatgatRegistration),
    defaultValues: {
      // trnBachatgatRegistrationMembersList: [
      // { fullName: "", designation: "", address: "", aadharNumber: "" },
      // ],
    },
  });

  const router = useRouter();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    name: "trnBachatgatRegistrationMembersList",
    control,
  });
  const [docs, setDocuments] = useState([]);
  const [memList, setMemberList] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [ID, setIDd] = useState();
  const [attachedFile, setAttachedFile] = useState();
  const [userLst, setUserLst] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const [label, setLabel] = useState("");
  const [remarkTableData, setRemarkData] = useState([]);
  const [memberList, setMemberData] = useState([]);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [registrationDetails, setRegistrationDetails] = useState([]);
  const [statusVal, setStatusVal] = useState(null);
  let filePath = {};

  const [areaId, setAreaId] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [bachatGatCategory, setBachatGatCategory] = useState([]);
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  const [count, setCount] = useState(0);
  const [id, setID] = useState();
  const [memberDesignation, setMemberDesignation] = useState([]);
  const [areaNm, setAreaNm] = useState(null);
  let userCitizen = useSelector((state) => {
    return state?.user?.user;
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const [docUpload, setDocUpload] = useState([]);

  const handleClose = () => {
    setFetchDocuments([
      ...fetchDocument,
      {
        srNo: fetchDocument.length != 0 ? fetchDocument[fetchDocument.length - 1].srNo + 1 : 1,
        id: fetchDocument.length != 0 ? fetchDocument[fetchDocument.length - 1].id + 1 : 1,
        documentKey: null,
        documentPath: filePath.filePath,
        fileType: filePath?.extension && filePath?.extension.split(".")[1].toUpperCase(),
        attachedDate: moment(new Date()).format("DD-MM-YYYY, h:mm:ss a"),
        fileName: filePath.fileName,
        activeFlag: "Y",
        bachatgatNo: null,
        bachatgatRegistrationKey: Number(router.query.id),
        bachatgatRenewalKey: null,
        documentFlow: null,
        documentTypeKey: null,
        serviceWiseChecklistKey: null,
        trnBachatgatRegistrationDocumentsList: null,
        trnType: "BGR",
        addUpdate: "Add",
      },
    ]);
    setAttachedFile("");
    setUploading(false);
  };

  const exitButton = () => {
    // reset({
    //   ...resetValuesExit,
    // });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const updateMember = () => {
    memberList.map((obj) => {
      if (obj.id === ID) {
        const updatedData = {
          fullName: watch("fullName"),
          address: watch("address"),
          designation: watch("designation"),
          aadharNumber: watch("aadharNumber"),
          activeFlag: obj.activeFlag,
          id: ID,
          srNo: obj.id,
          addUpdate: "Update",
        };
        setMemberData(update(memberList, ID, updatedData));
      }
    });

    if (ID == undefined) {
      setMemberData((obj) => [
        ...obj,
        {
          fullName: watch("fullName"),
          address: watch("address"),
          designation: watch("designation"),
          aadharNumber: watch("aadharNumber"),
          activeFlag: "Y",
          id: memberList.length + 1,
          srNo: memberList.length + 1,
          addUpdate: "Add",
        },
      ]);
    }
    setIDd(undefined);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };

  useEffect(() => {
    console.log("memberList ", memberList);
  }, [memberList]);

  function update(arr, id, updatedData) {
    return arr.map((item) => (item.id === id ? { ...item, ...updatedData } : item));
  }

  function temp(arg) {
    filePath = arg;
  }
  useEffect(() => {
    console.log("fetchDocument ");
  }, [fetchDocument]);

  // set citizen personal details
  useEffect(() => {
    const res = [];
    for (var i = 0; i < fields.length; i++) {
      for (var j = 0; j < memberDesignation.length; j++) {
        if (memberDesignation[j].department != fields[i].designation) {
          res.push(memberDesignation[j]);
          setMemberDesignation(res);
        }
      }
    }
  }, [fields]);

  const checkAdhar = (value) => {
    if (value != undefined && value) {
      if (loggedUser === "citizenUser") {
        const tempData = axios
          .get(`${urls.BSUPURL}/trnBachatgatRegistrationMembers/isMemberAlreadyExist?aadharNo=${value}`, {
            headers: {
              UserId: user.id,
            },
          })
          .then((res) => {
            // if (res.status == 201) {
            console.log(res.data.message);
            if (res.data.message == "Member Exist in our system..") {
              // alert("Member Exist in our system")
              sweetAlert("Member Exist in our system");
              setAlert(true);
            } else {
              setAlert(false);
            }
            // }
          });
      } else {
        const tempData = axios
          .get(`${urls.BSUPURL}/trnBachatgatRegistrationMembers/isMemberAlreadyExist?aadharNo=${value}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            // if (res.status == 201) {
            console.log(res.data.message);
            if (res.data.message == "Member Exist in our system..") {
              sweetAlert("Member Exist in our system");
              setAlert(true);
            } else {
              setAlert(false);
            }

            // }
          });
      }
    }
  };

  useEffect(() => {
    if (router.query.id != undefined) getRegistrationDetails();
  }, [router.query.id]);

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
    getBachatGatCategory();
    getBank();
    getUser();
    const array = [
      { id: 1, department: "President" },
      { id: 2, department: "Vice-President" },
      { id: 3, department: "Secretary" },
      { id: 4, department: "Member" },
    ];
    setMemberDesignation([...array]);
  }, []);

  useEffect(() => {
    setAreaNm(
      crAreaNames && crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
        ? crAreaNames?.find((obj) => obj.id == watch("areaKey"))?.crAreaName
        : "-",
    );
  }, [watch("areaKey")]);

  useEffect(() => {
    console.log("areaNm", areaNm);
    if (areaNm != "-" && areaNm != null) {
      getAreas();
    }
  }, [areaNm]);

  // load user
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((res) => {
        setUserLst(res?.data?.user);
      })
      .catch((err) => console.log(err));
  };

  const getAreas = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAreaName?moduleId=23&areaName=${watch("areaName")}`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          if (res?.data.length !== 0) {
            setAreaId(
              res?.data?.map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                areaId: r.areaId,
                zoneId: r.zoneId,
                wardId: r.wardId,
                zoneName: r.zoneName,
                zoneNameMr: r.zoneNameMr,
                wardName: r.wardName,
                wardNameMr: r.wardNameMr,
                areaName: r.areaName,
                areaNameMr: r.areaNameMr,
              })),
            );
            setValue("areaName", "");
          } else {
            setValue("zoneKey", "");
            setValue("wardKey", "");
            sweetAlert({
              title: "OOPS!",
              text: "There are no areas match with your search!",
              icon: "warning",
              dangerMode: true,
              closeOnClickOutside: false,
            });
          }
        } else {
          setValue("zoneKey", "");
          setValue("wardKey", "");
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error1) => {
        setValue("zoneKey", "");
        setValue("wardKey", "");
        sweetAlert({
          title: "OOPS!",
          text: `${error1}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        });
      });
  };

  // member columns
  const memColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: <FormattedLabel id="memFullName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: <FormattedLabel id="memFullAdd" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="memDesign" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "aadharNumber",
      headerName: <FormattedLabel id="memAdharNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setIDd(record.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                reset(record.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {record.row.activeFlag == "Y" && (
              <IconButton color="primary" onClick={() => deleteMemberById(record.id, "N")}>
                <ToggleOnIcon style={{ color: "green", fontSize: 30 }} />
              </IconButton>
            )}
            {record.row.activeFlag == "N" && (
              <IconButton color="primary" onClick={() => activeMemberById(record.id, "Y")}>
                <ToggleOffIcon style={{ color: "red", fontSize: 30 }} />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  const docColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    // {
    //     field: "title",
    //     headerName: <FormattedLabel id="docName" />,
    //     headerAlign: "center",
    //     align: "center",
    //     flex: 1,
    // },
    {
      field: "fileName",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },

    {
      field: "Action",
      headerName: <FormattedLabel id="view" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        return (
          // <div
          //     style={{
          //         display: "flex",
          //         justifyContent: "center",
          //         alignItems: "baseline",
          //         gap: 12,
          //     }}
          // >
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`, "_blank");
              }}
            >
              <VisibilityIcon />
            </IconButton>

            {record.row.activeFlag == "Y" && (
              <IconButton color="primary" onClick={() => deleteById(record.id, "N")}>
                <ToggleOnIcon style={{ color: "green", fontSize: 30 }} />
              </IconButton>
            )}
            {record.row.activeFlag == "N" && (
              <IconButton color="primary" onClick={() => activeById(record.id, "Y")}>
                <ToggleOffIcon style={{ color: "red", fontSize: 30 }} />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (watch("areaKey")) {
      let filteredArrayZone = areaId?.filter((obj) => obj?.areaId === watch("areaKey"));

      let flArray1 = zoneNames?.filter((obj) => {
        return filteredArrayZone?.some((item) => {
          return item?.zoneId === obj?.id;
        });
      });

      let flArray2 = wardNames?.filter((obj) => {
        return filteredArrayZone?.some((item) => {
          return item?.wardId === obj?.id;
        });
      });

      setValue("zoneKey", flArray1[0]?.id);
      setValue("wardKey", flArray2[0]?.id);
    } else {
      setValue("zoneKey", "");
      setValue("wardKey", "");
    }
  }, [areaId]);

  // load zone
  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      );
    });
  };

  //load ward details
  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        })),
      );
    });
  };

  // load AreaName
  const getCRAreaName = () => {
    axios.get(`${urls.CfcURLMaster}/area/getAll`).then((r) => {
      setCRAreaName(
        r.data.area.map((row) => ({
          id: row.id,
          crAreaName: row.areaName,
          crAreaNameMr: row.areaNameMr,
        })),
      );
    });
  };

  // load bank
  const getBank = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(r.data.bank);
      return r.data.bank;
    });
  };

  // load bachatgat category
  const getBachatGatCategory = () => {
    axios.get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`).then((r) => {
      setBachatGatCategory(
        r.data.mstBachatGatCategoryList.map((row) => ({
          id: row.id,
          bachatGatCategoryName: row.bgCategoryName,
          bachatGatCategoryNameMr: row.bgCategoryMr,
        })),
      );
    });
  };

  const getRegistrationDetails = () => {
    loggedUser === "citizenUser"
      ? axios
          .get(`${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${router.query.id}`, {
            headers: {
              UserId: user.id,
            },
          })
          .then((r) => {
            setDataOnForm(r.data);
            setRegistrationDetails(r.data);
          })
      : axios
          .get(`${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${router.query.id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((r) => {
            setDataOnForm(r.data);
            setRegistrationDetails(r.data);
          });
  };

  const setDataOnForm = (data) => {
    setDocuments(data.trnBachatgatRegistrationDocumentsList);
    setValue("areaKey", data.areaKey);
    setValue("zoneKey", data.zoneKey);
    setValue("wardKey", data.wardKey);
    setValue("geoCode", data.geoCode);
    setValue("bachatgatName", data.bachatgatName);
    setValue("categoryKey", data.categoryKey);
    setValue("presidentFirstName", data.presidentFirstName);
    setValue("presidentLastName", data.presidentLastName);
    setValue("presidentMiddleName", data.presidentMiddleName);
    setValue("totalMembersCount", data.totalMembersCount);
    setValue("flatBuldingNo", data.flatBuldingNo);
    setValue("buildingName", data.buildingName);
    setValue("roadName", data.roadName);
    setValue("landmark", data.landmark);
    setValue("pinCode", data.pinCode);
    setValue("landlineNo", data.landlineNo);
    setValue("applicantFirstName", data?.applicantFirstName);
    setValue("applicantMiddleName", data?.applicantMiddleName);
    setValue("applicantLastName", data?.applicantLastName);
    setValue("emailId", data?.emailId);
    setValue("mobileNo", data?.mobileNo);
    setStatusVal(data.status);
    setValue(
      "bankNameId",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        : "-",
    );
    setValue("bankBranchKey", data.bankBranchKey);
    setValue(
      "bankIFSC",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        : "-",
    );
    setValue(
      "bankMICR",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode
        : "-",
    );
    setValue("accountNo", data.accountNo);
    setValue("bankAccountFullName", data.bankAccountFullName);
    setValue("startDate", data.startDate);
    setValue("saSanghatakRemark", data.saSanghatakRemark);
    setValue("deptClerkRemark", data.deptClerkRemark);
    setValue("deptyCommissionerRemark", data.deptyCommissionerRemark);
    setValue("asstCommissionerRemark", data.asstCommissionerRemark);
    setValue("branchName", data.branchName);
    setValue("ifscCode", data.ifscCode);
    setValue("micrCode", data.micrCode);
    setMemberList(data.trnBachatgatRegistrationMembersList);
    // append(data.trnBachatgatRegistrationMembersList)
    setMemberData([]);
    let res = data.trnBachatgatRegistrationMembersList.map((r, i) => {
      return {
        bachatgatRegistrationKey: Number(router.query.id),
        id: r.id,
        srNo: i + 1,
        fullName: r.fullName,
        address: r.address,
        designation: r.designation,
        aadharNumber: r.aadharNumber,
        activeFlag: r.activeFlag,
      };
    });
    append([...res]);
    setMemberData([...res]);

    const bankDoc = [];
    setDocUpload([
      {
        id: 1,
        title: "Passbook Front Page",
        documentPath: data.passbookFrontPage,
      },
      {
        id: 2,
        title: "Passbook Back Page",
        documentPath: data.passbookLastPage,
      },
    ]);

    let _res = data.trnBachatgatRegistrationDocumentsList.map((r, i) => {
      bankDoc.push({
        id: r.id,
        srNo: i + 1,
        fileType: r.documentPath && r.documentPath.split(".").pop(),
        documentPath: r.documentPath,
        activeFlag: r.activeFlag,
        fileName: r.documentPath && r.documentPath.split("/").pop().split("_").pop(),
        bachatgatRegistrationKey: r.bachatgatRegistrationKey,
        bachatgatRenewalKey: r.bachatgatRenewalKey,
        documentFlow: r.documentFlow,
        activeFlag: r.activeFlag,
        bachatgatNo: r.bachatgatNo,
        documentTypeKey: r.documentTypeKey,
        serviceWiseChecklistKey: r.serviceWiseChecklistKey,
        trnBachatgatRegistrationDocumentsList: r.trnBachatgatRegistrationDocumentsList,
        attachedDate: r.createDtTm,
        addUpdate: "Update",
      });
    });
    setFetchDocuments([...bankDoc]);
    localStorage.removeItem("bsupAlreadyDocuments");
    addDocumentToLocalStorage("bsupAlreadyDocuments", [...bankDoc]);
  };

  useEffect(() => {
    setDataToTable();
  }, [registrationDetails]);

  const setDataToTable = () => {
    const a = [];
    console.log("saSanghatakRemark ", watch("saSanghatakRemark"));
    if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 4; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              : "-"
            : i == 1
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              : "-"
            : userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              : "-"
            : i == 1
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              : "-"
            : userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.asstCommissionerRemark
              : registrationDetails.deptyCommissionerRemark,
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Department Clerk"
              : i == 2
              ? "Assistant Commissioner"
              : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format("DD-MM-YYYY HH:mm")
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format("DD-MM-YYYY HH:mm")
              : i == 2
              ? moment(registrationDetails.asstCommissionerDate).format("DD-MM-YYYY HH:mm")
              : moment(registrationDetails.deptyCommissionerDate).format("DD-MM-YYYY HH:mm"),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1110
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              : "-"
            : i == 1
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              : "-"
            : i == 1
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.asstCommissionerRemark
              : "",
          designation:
            i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : i == 2 ? "Assistant Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format("DD-MM-YYYY HH:mm")
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format("DD-MM-YYYY HH:mm")
              : i == 2
              ? moment(registrationDetails.asstCommissionerDate).format("DD-MM-YYYY HH:mm")
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1101
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              : "-"
            : i == 1
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              : "-"
            : i == 1
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : i == 2 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format("DD-MM-YYYY HH:mm")
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format("DD-MM-YYYY HH:mm")
              : i == 2
              ? moment(registrationDetails.deptyCommissionerDate).format("DD-MM-YYYY HH:mm")
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1100
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              : "-"
            : i == 1
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              : "-"
            : i == 1
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : "",
          designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format("DD-MM-YYYY HH:mm")
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format("DD-MM-YYYY HH:mm")
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1001
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format("DD-MM-YYYY HH:mm")
              : i == 1
              ? moment(registrationDetails.deptyCommissionerDate).format("DD-MM-YYYY HH:mm")
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1000
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.saSanghatakUserId)?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.saSanghatakRemark : "",
          designation: i == 0 ? "Samuh Sanghtak" : "",
          remarkDate: i == 0 ? moment(registrationDetails.saSanghatakDate).format("DD-MM-YYYY HH:mm") : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //    0111
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              : "-"
            : userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              : "-"
            : userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.asstCommissionerRemark
              : i == 2
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Department Clerk" : i == 1 ? "Assistant Commissioner" : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format("DD-MM-YYYY HH:mm")
              : i == 1
              ? moment(registrationDetails.asstCommissionerDate).format("DD-MM-YYYY HH:mm")
              : moment(registrationDetails.deptyCommissionerDate).format("DD-MM-YYYY HH:mm"),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //0110
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.asstCommissionerRemark
              : "",
          designation: i == 0 ? "Department Clerk" : i == 1 ? "Assistant Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format("DD-MM-YYYY HH:mm")
              : i == 1
              ? moment(registrationDetails.asstCommissionerDate).format("DD-MM-YYYY HH:mm")
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 0101
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation: i == 0 ? "Department Clerk" : i == 1 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format("DD-MM-YYYY HH:mm")
              : i == 1
              ? moment(registrationDetails.deptyCommissionerDate).format("DD-MM-YYYY HH:mm")
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0100
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst && userLst.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptClerkUserId)?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.deptClerkRemark : "",
          designation: i == 0 ? "Department Clerk" : "",
          remarkDate: i == 0 ? moment(registrationDetails.deptClerkDate).format("DD-MM-YYYY HH:mm") : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0011
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              : "-"
            : userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              : "-"
            : userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
            ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.asstCommissionerRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation: i == 0 ? "Assistant Commissioner" : "Deputy Commissioner",
          remarkDate:
            i == 0
              ? moment(registrationDetails.asstCommissionerDate).format("DD-MM-YYYY HH:mm")
              : moment(registrationDetails.deptyCommissionerDate).format("DD-MM-YYYY HH:mm"),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0010
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.asstCommissionerUserId)?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.asstCommissionerRemark : "",
          designation: i == 0 ? "Assistant Commissioner" : "",
          remarkDate:
            i == 0 ? moment(registrationDetails.asstCommissionerDate).format("DD-MM-YYYY HH:mm") : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
      // 0001
    }
    // 0001
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == registrationDetails.deptyCommissionerUserId)?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.deptyCommissionerRemark : "",
          designation: i == 0 ? "Deputy Commissioner" : "",
          remarkDate:
            i == 0 ? moment(registrationDetails.deptyCommissionerDate).format("DD-MM-YYYY HH:mm") : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    setRemarkData([...a]);
  };

  // add member ui dynamically
  const appendUI = () => {
    setCount(count < 20 ? count + 1 : count);
    // if (showAlert) {
    //     sweetAlert("Member Exist in our system")
    // } else if (count <= 20) {
    append({
      // applicationName: "",
      // roleName: "",
    });

    // } else {
    //     sweetAlert("Members are less than 20")
    // }
  };

  const deleteById = (value, _activeFlag) => {
    const deleteArr = fetchDocument.map((obj) => {
      if (obj.id === value) {
        return { ...obj, activeFlag: "N" };
      }
      return obj;
    });
    setFetchDocuments([...deleteArr]);
  };

  const activeById = (value, _activeFlag) => {
    const activeArr = fetchDocument.map((obj) => {
      if (obj.id === value) {
        return { ...obj, activeFlag: "Y" };
      }
      return obj;
    });
    setFetchDocuments([...activeArr]);
  };

  const deleteMemberById = (value, _activeFlag) => {
    const deleteArr = memberList.map((obj) => {
      if (obj.id === value) {
        return { ...obj, activeFlag: "N" };
      }
      return obj;
    });
    setMemberData([...deleteArr]);
  };

  const activeMemberById = (value, _activeFlag) => {
    const activeArr = memberList.map((obj) => {
      if (obj.id === value) {
        return { ...obj, activeFlag: "Y" };
      }
      return obj;
    });
    setMemberData([...activeArr]);
  };
  // save bachatgat registration
  const onSubmitForm = (formData) => {
    const docArray = fetchDocument.map((obj) => {
      if (obj.addUpdate === "Add") {
        return { ...obj, id: null };
      }
      return obj;
    });

    const memArray = memberList.map((obj) => {
      if (obj.addUpdate === "Add") {
        return { ...obj, id: null };
      }
      return obj;
    });
    const finalBodyForApi = {
      ...registrationDetails,
      ...formData,
      trnBachatgatRegistrationDocumentsList: docArray,
      trnBachatgatRegistrationMembersList: memArray,
      passbookFrontPage:
        docUpload && docUpload.find((obj) => obj.title == "Passbook Front Page")?.documentPath,

      passbookLastPage: docUpload && docUpload.find((obj) => obj.title == "Passbook Back Page")?.documentPath,

      frontPageFileType:
        docUpload &&
        docUpload.find((obj) => obj.title == "Passbook Front Page")?.documentPath &&
        docUpload &&
        docUpload
          .find((obj) => obj.title == "Passbook Front Page")
          ?.documentPath.split(".")
          .pop(),
      lastPageFileType:
        docUpload &&
        docUpload.find((obj) => obj.title == "Passbook Back Page")?.documentPath &&
        docUpload &&
        docUpload
          .find((obj) => obj.title == "Passbook Back Page")
          ?.documentPath.split(".")
          .pop(),
      id: Number(router.query.id),
      areaKey: Number(formData.areaKey),
      wardKey: Number(formData.wardKey),
      zoneKey: Number(formData.zoneKey),
      activeFlag: "Y",
    };
    console.log("finalBodyForApi ", finalBodyForApi);
    if (loggedUser === "citizenUser") {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, finalBodyForApi, {
          headers: {
            UserId: user.id,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            localStorage.removeItem("bsupDocuments");
            localStorage.removeItem("bsupAlreadyDocuments");
            sweetAlert("Success !", "Bachatgat Updated SuccessFully");
          }
        });
    } else {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnBachatgatRegistration/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            localStorage.removeItem("bsupDocuments");
            localStorage.removeItem("bsupAlreadyDocuments");
            sweetAlert("Success !", "Bachatgat Updated SuccessFully");
            // sweetAlert({
            //     text: ` Your Bachatgat Registration No Is : ${res.data.message.split('[')[1].split(']')[0]} Updated Successfully`,
            //     icon: "success",
            //     buttons: ["View Acknowledgement", "Go To Dashboard"],
            //     dangerMode: false,
            //     closeOnClickOutside: false,
            // }).then((will) => {
            //     if (will) {
            //         {
            //             router.push('/BsupNagarvasthi/transaction/bachatgatRegistration')
            //         }
            //     } else {
            //         //   router.push({
            //         //     pathname:
            //         //       "/BsupNagarvasthi/transaction/bachatgatRegistration/view",
            //         //     query: { id: res.data.message.split('[')[1].split(']')[0] },
            //         //   })
            //     }
            // })
          }
        });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    geoCode: "",
    cfcApplicationNo: "",
    applicationNo: "",
    flatBuildingNo: "",
    buildingName: "",
    roadName: "",
    bachatgatName: "",
    landlineNo: "",
    buildingName: "",
    accountNo: "",
    bankAccountFullName: "",
    roadName: "",
    ifscCode: "",
    micrCode: "",
    flatBuldingNo: "",
    totalMembersCount: "",
    branchName: "",
    category: "",
    landmark: "",
    pinCode: "",
    presidentFirstName: "",
    presidentMiddleName: "",
    presidentLastName: "",
    startDate: null,
    areaKey: "",
    zoneKey: "",
    wardKey: "",
  };

  // UI
  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="bachatGatDetails" />
            </h2>
          </Box>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container style={{ padding: "10px" }}>
              {/* Area Name */}
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                  gap: 15,
                }}
              >
                {areaId.length === 0 ? (
                  <>
                    <TextField
                      // autoFocus
                      style={{
                        backgroundColor: "white",
                        width: "300px",
                        // color: "black",
                      }}
                      id="outlined-basic"
                      label={language === "en" ? "Search By Area Name" : "क्षेत्राच्या नावाने शोधा"}
                      placeholder={
                        language === "en"
                          ? "Enter Area Name, Like 'Dehu'"
                          : "'देहू' प्रमाणे क्षेत्राचे नाव प्रविष्ट करा"
                      }
                      variant="standard"
                      {...register("areaName")}
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (watch("areaName")) {
                          getAreas();
                        } else {
                          sweetAlert({
                            title: "OOPS!",
                            text: "Please Enter The Area Name first",
                            icon: "warning",
                            dangerMode: true,
                            closeOnClickOutside: false,
                          });
                        }
                      }}
                      size="small"
                      style={{ backgroundColor: "green", color: "white" }}
                    >
                      <FormattedLabel id="getDetails" />
                    </Button>
                  </>
                ) : (
                  <>
                    <FormControl style={{ minWidth: "200px" }} error={!!errors.areaKey}>
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="results" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            style={{ backgroundColor: "inherit" }}
                            fullWidth
                            variant="standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            label="Complaint Type"
                          >
                            {areaId &&
                              areaId?.map((areaId, index) => (
                                <MenuItem key={index} value={areaId.areaId}>
                                  {language == "en" ? areaId?.areaName : areaId?.areaNameMr}
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

                    {/* ////////////////// */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setAreaId([]);
                        setValue("areaKey", "");
                      }}
                      size="small"
                    >
                      <FormattedLabel id="searchArea" />
                    </Button>
                  </>
                )}
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
                  alignItems: "Center",
                }}
              >
                <FormControl error={errors.zoneKey} variant="standard" sx={{ width: "90%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="zoneNames" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={true}
                        sx={{ minWidth: 220 }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      >
                        {zoneNames &&
                          zoneNames.map((auditorium, index) => (
                            <MenuItem key={index} value={auditorium.id}>
                              {language == "en" ? auditorium.zoneName : auditorium.zoneNameMr}
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
                  alignItems: "Center",
                }}
              >
                <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.wardKey}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="wardname" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={true}
                        sx={{ minWidth: 220 }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      >
                        {wardNames &&
                          wardNames.map((service, index) => (
                            <MenuItem key={index} value={service.id}>
                              {language == "en" ? service.wardName : service.wardNameMr}
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

              {/* geoCode */}
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
                  alignItems: "Center",
                }}
              >
                <TextField
                  sx={{ width: "90%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="gisgioCode" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("geoCode") ? true : false }}
                  {...register("geoCode")}
                  error={!!errors.geoCode}
                  helperText={errors?.geoCode ? errors.geoCode.message : null}
                />
              </Grid>

              {/* bachatgat category name */}
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
                  alignItems: "Center",
                }}
              >
                <FormControl variant="standard" sx={{ width: "90%" }} error={!!errors.categoryKey}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="bachatgatCat" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ minWidth: 220 }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      >
                        {bachatGatCategory &&
                          bachatGatCategory.map((service, index) => (
                            <MenuItem key={index} value={service.id}>
                              {language == "en"
                                ? service.bachatGatCategoryName
                                : service.bachatGatCategoryNameMr}
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

              {/* bachatgat name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "Center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="bachatgatFullName" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("bachatgatName") ? true : false }}
                  {...register("bachatgatName")}
                  error={!!errors.bachatgatName}
                  helperText={errors?.bachatgatName ? errors.bachatgatName.message : null}
                />
              </Grid>

              {/* Bachat Gat start date */}
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
                <FormControl variant="standard" style={{ marginTop: 2 }} error={!!errors.fromDate}>
                  <Controller
                    control={control}
                    name="startDate"
                    // sx={{ minWidth: "80%" }}
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          // sx={{ minWidth: "80%" }}
                          variant="standard"
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>{<FormattedLabel id="bachatgatStartDate" />}</span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField {...params} size="small" variant="standard" sx={{ width: 280 }} />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>{errors?.startDate ? errors.startDate.message : null}</FormHelperText>
                </FormControl>
              </Grid>

              {/* {/* bachatgat  address box*/}
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="bachatgatAddress" />
                </h2>
              </Box>

              {/* president first name */}
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
                  label={<FormattedLabel id="presidentFirstName" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("presidentFirstName") ? true : false }}
                  {...register("presidentFirstName")}
                  error={!!errors.presidentFirstName}
                  helperText={errors?.presidentFirstName ? errors.presidentFirstName.message : null}
                />
              </Grid>

              {/* president middle name */}
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
                  label={<FormattedLabel id="presidentFatherName" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("presidentMiddleName") ? true : false }}
                  {...register("presidentMiddleName")}
                  error={!!errors.presidentMiddleName}
                  helperText={errors?.presidentMiddleName ? errors.presidentMiddleName.message : null}
                />
              </Grid>

              {/* president last name */}
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
                  label={<FormattedLabel id="presidentLastName" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("presidentLastName") ? true : false }}
                  {...register("presidentLastName")}
                  error={!!errors.presidentLastName}
                  helperText={errors?.presidentLastName ? errors.presidentLastName.message : null}
                />
              </Grid>

              {/* total members count */}
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
                <Tooltip title="Gat Total Members Count">
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="totalCount" />}
                    variant="standard"
                    type="number"
                    sx={{
                      width: "90%",
                    }}
                    InputLabelProps={{ shrink: watch("totalMembersCount") ? true : false }}
                    {...register("totalMembersCount")}
                    error={!!errors.totalMembersCount}
                    helperText={errors?.totalMembersCount ? errors.totalMembersCount.message : null}
                  />
                </Tooltip>
              </Grid>

              {/* building no */}
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
                  label={<FormattedLabel id="flatBuildNo" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("flatBuldingNo") ? true : false }}
                  {...register("flatBuldingNo")}
                  error={!!errors.flatBuldingNo}
                  helperText={errors?.flatBuldingNo ? errors.flatBuldingNo.message : null}
                />
              </Grid>

              {/* building name */}
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
                  label={<FormattedLabel id="buildingNm" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("buildingName") ? true : false }}
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
                  label={<FormattedLabel id="roadName" />}
                  variant="standard"
                  {...register("roadName")}
                  error={!!errors.roadName}
                  InputLabelProps={{ shrink: watch("roadName") ? true : false }}
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
                  label={<FormattedLabel id="landmark" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("landmark") ? true : false }}
                  {...register("landmark")}
                  error={!!errors.landmark}
                  helperText={errors?.landmark ? errors.landmark.message : null}
                />
              </Grid>

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
                  label={<FormattedLabel id="pincode" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("pinCode") ? true : false }}
                  {...register("pinCode")}
                  error={!!errors.pinCode}
                  helperText={errors?.pinCode ? errors.pinCode.message : null}
                />
              </Grid>

              {/*  Applicant Name Details box*/}
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="applicantDetails" />
                </h2>
              </Box>

              {/* applicant first name */}
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
                  disabled={loggedUser === "citizenUser" ? true : false}
                  label={<FormattedLabel id="applicantFirstName" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("applicantFirstName") ? true : false }}
                  {...register("applicantFirstName")}
                  error={!!errors.applicantFirstName}
                  helperText={errors?.applicantFirstName ? errors.applicantFirstName.message : null}
                />
              </Grid>

              {/* applicant middle name */}
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
                  disabled={loggedUser === "citizenUser" ? true : false}
                  label={<FormattedLabel id="applicantMiddleName" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("applicantMiddleName") ? true : false }}
                  {...register("applicantMiddleName")}
                  error={!!errors.applicantMiddleName}
                  helperText={errors?.applicantMiddleName ? errors.applicantMiddleName.message : null}
                />
              </Grid>

              {/* applicant last name */}
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
                  sx={{ width: "85%" }}
                  id="standard-basic"
                  disabled={loggedUser === "citizenUser" ? true : false}
                  label={<FormattedLabel id="applicantLastName" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("applicantLastName") ? true : false }}
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
                  sx={{ width: "85%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="landlineNo" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("landlineNo") ? true : false }}
                  {...register("landlineNo")}
                  error={!!errors.landlineNo}
                  helperText={errors?.landlineNo ? errors.landlineNo.message : null}
                />
              </Grid>

              {/* mobile no */}
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
                  disabled={loggedUser === "citizenUser" ? true : false}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("mobileNo") ? true : false }}
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
                  disabled={loggedUser === "citizenUser" ? true : false}
                  label={<FormattedLabel id="emailId" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("emailId") ? true : false }}
                  {...register("emailId")}
                  error={!!errors.emailId}
                  helperText={errors?.emailId ? errors.emailId.message : null}
                />
              </Grid>

              {/* Bank details box */}
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="bankDetails" />
                </h2>
              </Box>

              {/* Bank name */}
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
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="bankName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ minWidth: 220 }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      >
                        {bankMaster &&
                          bankMaster.map((service, index) => (
                            <MenuItem key={index} value={service.id}>
                              {language == "en" ? service.bankName : service.bankNameMr}
                            </MenuItem>
                          ))}
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
                <TextField
                  sx={{ width: "90%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="branchName" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("branchName") ? true : false }}
                  {...register("branchName")}
                  error={!!errors.branchName}
                  helperText={errors?.branchName ? errors.branchName.message : null}
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
                  sx={{ width: "90%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="accountNo" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("accountNo") ? true : false }}
                  {...register("accountNo")}
                  error={!!errors.accountNo}
                  helperText={errors?.accountNo ? errors.accountNo.message : null}
                />
              </Grid>

              {/* Saving Account Name */}
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
                  label={<FormattedLabel id="accountHolderName" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("bankAccountFullName") ? true : false }}
                  {...register("bankAccountFullName")}
                  error={!!errors.bankAccountFullName}
                  helperText={errors?.bankAccountFullName ? errors.bankAccountFullName.message : null}
                />
              </Grid>

              {/* ifsc code */}
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
                  label={<FormattedLabel id="bankIFSC" />}
                  variant="standard"
                  {...register("ifscCode")}
                  InputLabelProps={{ shrink: watch("ifscCode") ? true : false }}
                  error={!!errors.ifscCode}
                  helperText={errors?.ifscCode ? errors.bankIFSC.message : null}
                />
              </Grid>

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
                  sx={{ width: "90%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="bankMICR" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("micrCode") ? true : false }}
                  {...register("micrCode")}
                  error={!!errors.micrCode}
                  helperText={errors?.micrCode ? errors.micrCode.message : null}
                />
              </Grid>

              {/* Bachat Gat start date */}
              {/* <Grid item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}>
                            <FormControl
                                variant="standard"
                                style={{ marginTop: 2, marginLeft: 10 }}
                                error={!!errors.fromDate}
                            >
                                <Controller
                                    control={control}
                                    name="startDate"
                                    sx={{ minWidth: 100 }}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                                sx={{ minWidth: 100 }}
                                                variant="standard"
                                                inputFormat="DD/MM/YYYY"
                                                label={<span style={{ fontSize: 16 }}>
                                                    {<FormattedLabel id="startDate" />}</span>}
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
                        </Grid> */}

              <Grid container sx={{ padding: "10px" }}>
                {docUpload &&
                  docUpload.map((obj, index) => {
                    return (
                      <Grid
                      key={index}
                        container
                        sx={{
                          padding: "20px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={1}
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "baseline",
                          }}
                        >
                          <strong>{index + 1}</strong>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={7}
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "baseline",
                          }}
                        >
                          <strong>{obj?.title}</strong>
                        </Grid>
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
                            alignItems: "baseline",
                          }}
                        >
                          <UploadButton
                            appName="BSUP"
                            serviceName="BSUP-BachatgatRegistration"
                            label={<FormattedLabel id="uploadDocs" />}
                            filePath={obj.documentPath}
                            objId={obj.id}
                            uploadDoc={docUpload}
                            setUploadDoc={setDocUpload}
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
              </Grid>

              {/* Member information box */}
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="memberInfo" />
                </h2>
              </Box>

              {/* add more btn */}
              <Grid container>
                {!isOpenCollapse && (
                  <Grid item xs={12} style={{ display: "flex", justifyContent: "end", margin: "5px" }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setEditButtonInputState(true);
                        setValue("fullName", "");
                        setValue("address", "");
                        setValue("designation", "");
                        setValue("aadharNumber", "");

                        setBtnSaveText("Save");
                        // setButtonInputState(true);
                        setSlideChecked(true);
                        setIsOpenCollapse(!isOpenCollapse);
                      }}
                    >
                      <FormattedLabel id="addMore" />
                    </Button>
                  </Grid>
                )}
              </Grid>
              {/* rendering members details */}
              {
                <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
                  <Grid container style={{ backgroundColor: "white" }}>
                    <Grid
                      item
                      xs={2.5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        label={<FormattedLabel id="memFullName" />}
                        size="small"
                        {...register(`fullName`)}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={2.5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        label={<FormattedLabel id="memFullAdd" />}
                        size="small"
                        {...register(`address`)}
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
                        sx={{ marignTop: 20 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="memDesign" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 230, marignTop: "10px" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              label="Member Designation"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              {[
                                { id: 1, department: "President" },
                                { id: 2, department: "Vice-President" },
                                { id: 3, department: "Secretary" },
                                { id: 3, department: "Member" },
                              ].map((auditorium, index) => (
                                <MenuItem key={index} value={auditorium.department}>
                                  {auditorium.department}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                          {...register(`designation`)}
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
                      }}
                    >
                      <TextField
                        label={<FormattedLabel id="memAdharNo" />}
                        size="small"
                        {...register(`aadharNumber`)}
                      />
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
                          onClick={updateMember}
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText === "Update" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            <FormattedLabel id="save" />
                          )}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          sx={{ marginRight: 8 }}
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => {
                            setValue("fullName", "");
                            setValue("address", "");
                            setValue("designation", "");
                            setValue("aadharNumber", "");
                          }}
                        >
                          <FormattedLabel id="clear" />
                          {/* Clear */}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => {
                            setValue("fullName", "");
                            setValue("address", "");
                            setValue("designation", "");
                            setValue("aadharNumber", "");

                            setSlideChecked(false);
                            setSlideChecked(false);
                            setIsOpenCollapse(false);
                            setEditButtonInputState(false);
                          }}
                        >
                          <FormattedLabel id="exit" />
                          {/* Exit */}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Slide>
              }
              <DataGrid
                autoHeight
                sx={{
                  marginTop: 5,
                  overflowY: "scroll",
                  overflowX: "scroll",
                  "& .MuiDataGrid-virtualScrollerContent": {},
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  flexDirection: "column",
                  overflowX: "scroll",
                }}
                autoWidth
                density="standard"
                pageSize={10}
                rowsPerPageOptions={[10]}
                rows={memberList}
                columns={memColumns}
              />

              {/* required document box */}
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="requiredDoc" />
                </h2>
              </Box>
              {/* doc table */}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "40px" }}>
                <div>
                  <Grid
                    container
                    style={{ padding: "10px", backgroundColor: "lightblue" }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid
                      item
                      xs={10}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, marginLeft: "20%" }}>
                        <FormattedLabel id="uploadFile" />
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        endIcon={<Add />}
                        type="button"
                        color="primary"
                        onClick={handleOpen}
                        size="small"
                      >
                        {<FormattedLabel id="addDoc" />}
                      </Button>
                    </Grid>
                  </Grid>

                  <DataGrid
                    sx={{
                      overflowY: "scroll",
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },

                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                    }}
                    // getRowId={(row) => row.srNo}
                    autoHeight
                    disableSelectionOnClick
                    rows={fetchDocument}
                    columns={docColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                  />
                </div>
              </Grid>

              {/* save cancel button button */}
              <Grid container>
                <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button
                    sx={{}}
                    type="submit"
                    size="medium"
                    variant="contained"
                    color="primary"
                    endIcon={<SaveIcon />}
                  >
                    <FormattedLabel id="update" />
                  </Button>
                </Grid>
                <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                </Grid>
              </Grid>

              <Divider />
            </Grid>
          </form>
        </Paper>
      </ThemeProvider>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "15%",
        }}
      >
        <Box
          sx={{
            width: "30%",
            backgroundColor: "white",
            height: "40%",
            borderRadius: "10px",
          }}
        >
          <Grid container display="flex" justifyContent="center" alignItems="center" flexDirection="row">
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1.5%",
              }}
              //   className={styles.details1}
            >
              <Typography
                sx={{
                  fontWeight: "bolder",
                  fontSize: "large",
                  textTransform: "capitalize",
                }}
                // className={styles.fancy_link1}
              >
                fileUpload
                {/* <FormattedLabel id="fileUpload" /> */}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Document
                appName={"BSUP"}
                serviceName={"BSUP-BachatgatRegistration"}
                fileName={attachedFile} //State to attach file
                filePath={temp}
                fileLabel={setLabel}
                // newFilesFn={setAdditionalFiles} // File data function
                handleClose={handleClose}
                uploading={setUploading}
                modalState={setOpen}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleOpen(false);
                }}
                size="small"
              >
                <FormattedLabel id="cancel" />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default BachatGatCategory;
