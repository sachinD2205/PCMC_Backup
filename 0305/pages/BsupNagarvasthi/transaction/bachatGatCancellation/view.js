import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  ThemeProvider,
  Paper,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Visibility, Watch } from "@mui/icons-material";
import styles from "../acknowledgement.module.css"

const BachatGatCategory = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
  });

  const router = useRouter();
  const loggedUser = localStorage.getItem("loggedInUser");
  const [statusVal, setStatusVal] = useState(null)
  const [zone, setZone] = useState([]);
  const [ward, setWard] = useState([]);
  const [area, setArea] = useState([]);
  const [gatCategory, setGatCategory] = useState([]);
  const [valueData, setValuesData] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [regDetails, setRegDetails] = useState([]);
  const [appliNo, setApplicationNo] = useState()
  const [currentStatus1, setCurrentStatus] = useState()
  const user = useSelector((state) => state.user.user);
  const [bankMaster, setBankMasters] = useState([]);
  const [memberList, setMemberData] = useState([])
  const [fetchDocument, setFetchDocuments] = useState([])
  const [bgRegId, setId] = useState()
  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));
  const [remarkTableData, setRemarkData] = useState([])

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  useEffect(() => {

    getCRAreaName()
    getZoneName()
    getWardNames()
    getBachatGatCategory()
    getBankMasters()
    getUser()
  }, [])

  // load user
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((res) => {
        console.log("res.data", res?.data?.user);
        setUserLst(res?.data?.user);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log("valueData ", valueData)
    if (valueData.length != 0) {
      setDataOnForm()
    }
  }, [valueData])

  useEffect(() => {
    loadRegistrationDetails()
  }, [bgRegId])

  useEffect(() => {
    setDataOnForm()
  }, [language])

  // set data on form
  const setDataOnForm = () => {
    console.log("ward ", ward?.find((obj) => obj.id == valueData.wardKey)?.wardName
      ? ward?.find((obj) => obj.id == valueData.wardKey)?.wardName
      : "-")
    if (valueData != undefined && ward) {
      const data = valueData
      setId(data.bgRegistrationKey)
      setValue("areaKey", data.areaKey)
      setValue("zoneKey", data.zoneKey)
      setValue("wardKey", data.wardKey)
      setValue("areaName", language == "en" ? area?.find((obj) => obj.id == data.areaKey)?.areaName
        ? area?.find((obj) => obj.id == data.areaKey)?.areaName
        : "-" :
        area?.find((obj) => obj.id == data.areaKey)?.areaNameMr
          ? area?.find((obj) => obj.id == data.areaKey)?.areaNameMr
          : "-")
      setValue("zoneName", language == "en" ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneName
        ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneName
        : "-" : zone?.find((obj) => obj.id == data.zoneKey)?.zoneNameMr
        ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneNameMr
        : "-")
      setValue("wardname", language == "en" ? ward?.find((obj) => obj.id == data.wardKey)?.wardName
        ? ward?.find((obj) => obj.id == data.wardKey)?.wardName
        : "-" : ward?.find((obj) => obj.id == data.wardKey)?.wardNameMr
        ? ward?.find((obj) => obj.id == data.wardKey)?.wardNameMr
        : "-")
      setValue("geoCode", data.geoCode)
      setValue("bachatgatName", data.bachatgatName)
      setValue("categoryKey", language == "en" ? gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryName
        ? gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryName
        : "-" :
        gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryMr
          ? gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryMr
          : "-"
      )
      setValue("presidentFirstName", data.presidentFirstName)
      setValue("presidentLastName", data.presidentLastName)
      setValue("presidentMiddleName", data.presidentMiddleName)
      setValue("totalMembersCount", data.totalMembersCount)
      setValue("flatBuldingNo", data.flatBuldingNo)
      setValue("buildingName", data.buildingName)
      setValue("roadName", data.roadName)
      setValue("landmark", data.landmark)
      setValue("pinCode", data.pinCode)
      setValue("landlineNo", data.landlineNo)
      setValue("applicantFirstName", data?.applicantFirstName)
      setValue("applicantMiddleName", data?.applicantMiddleName)
      setValue("applicantLastName", data?.applicantLastName)
      setValue("emailId", data?.emailId)
      setValue("mobileNo", data?.mobileNo)
      setStatusVal(data.status)
      setValue("bankName", language = "en" ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        : "-" :
        bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
          ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
          : "-");
      setValue("bankBranchKey", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        : "-");
      setValue("bankIFSC", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode : "-")
      setValue("bankMICR", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode : "-")

      // setValue("bankAccountFullName", data.bankAccountFullName)
      setValue("startDate", moment(
        data.startDate
      ).format("DD-MM-YYYY HH:mm"))
      setValue("saSanghatakRemark", data.saSanghatakRemark)
      setValue("deptClerkRemark", data.deptClerkRemark)
      setValue("deptyCommissionerRemark", data.deptyCommissionerRemark)
      setValue("asstCommissionerRemark", data.asstCommissionerRemark)
      // setValue("branchName", data.branchName)
      // setValue("accountNo", data.accountNo)
      // setValue("ifscCode", data.ifscCode)
      // setValue('micrCode', data.micrCode)

      let _res = data.trnBachatgatRegistrationDocumentsList && data.trnBachatgatRegistrationDocumentsList.map((r, i) => {
        return {
          id: i + 1,
          filenm: r.documentPath && r.documentPath.split('/').pop().split("_").pop(),
          documentType: r.documentType,
          documentPath: r.documentPath,
          fileType:r.documentPath &&r.documentPath.split(".").pop()
        }
      })
      _res && setFetchDocuments([..._res])
      setApplicationNo(data.applicationNo)


      setCurrentStatus(  data.status === null
        ? "pending"
        : data.status === 0
          ? "Save As Draft"
          : data.status === 1
            ? "Send Back To Citizen For Cancel"
            : data.status === 2
              ? "Samuha Sanghatak For Cancel"
              : data.status === 3
                ? "Send To Dept. Clerk For Cancel"
                : data.status === 4
                  ? "Send Back To Dept. Clerk For Cancel"
                  : data.status === 5
                    ? "Send To Asst. Commissioner For Cancel"
                    : data.status === 6
                      ? "Send Back To Asst. Commissioner For Cancel"
                      : data.status === 7
                        ? "Send To Dy. Commissioner For Cancel"
                        : data.status === 8
                          ? "Send Back To Dy. Commissioner For Cancel"
                          : data.status === 16
                            ? "Dept. Clerk After Approval Dy. Commissioner For Cancel"
                            : data.status === 10
                              ? "Cancelled"
                              : data.status === 11
                                ? "Close"
                                : data.status === 12
                                  ? "Duplicate": data.status === 22
                                  ? "Rejected" : data.status === 23 ? "Send Back to Samuh Sanghtak"
                                  : "Invalid");
      const a = []
      if (watch("saSanghatakRemark") && watch("deptClerkRemark") && watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 4; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn
                  ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn : "-"
                : i == 2 ?
                  userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn
                    ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn : "-"
                  : userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn
                    ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn : "-";

          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn
                  ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn : "-"
                : i == 2 ?
                  userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn
                    ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn : "-"
                  : userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn
                    ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn : "-";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.saSanghatakRemark : i == 1 ? data.deptClerkRemark : i == 2 ? data.asstCommissionerRemark : data.deptyCommissionerRemark,
            designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : i == 2 ? "Assistant Commissioner" : "Deputy Commissioner",
            remarkDate: i == 0 ? moment(
              data.saSanghatakDate
            ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
              data.deptClerkDate
            ).format("DD-MM-YYYY HH:mm") : i == 2 ? moment(
              data.asstCommissionerDate
            ).format("DD-MM-YYYY HH:mm") : moment(
              data.deptyCommissionerDate
            ).format("DD-MM-YYYY HH:mm"),
            userName: firstNameEn + " " + lastNameEn
          })
        }
      }
      // 1110
      else if (watch("saSanghatakRemark") && watch("deptClerkRemark") && watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 3; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn
                  ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn : "-"
                : i == 2 ?
                  userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn
                    ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn : "-"
                  : "";
          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn
                  ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn : "-"
                : i == 2 ?
                  userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn
                    ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn : "-" : "";

          a.push({
            id: i + 1,
            remark: i == 0 ? data.saSanghatakRemark : i == 1 ? data.deptClerkRemark : i == 2 ? data.asstCommissionerRemark : "",
            designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : i == 2 ? "Assistant Commissioner" : "",
            remarkDate: i == 0 ? moment(
              data.saSanghatakDate
            ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
              data.deptClerkDate
            ).format("DD-MM-YYYY HH:mm") : i == 2 ? moment(
              data.asstCommissionerDate
            ).format("DD-MM-YYYY HH:mm") : "",
            userName: firstNameEn + " " + lastNameEn
          })
        }
      }
      // 1101
      else if (watch("saSanghatakRemark") && watch("deptClerkRemark") && !watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 3; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn
                  ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn : "-"
                : i == 2 ?
                  userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn
                    ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn : "-" : "";
          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn
                  ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn : "-"
                : i == 2 ?
                  userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn
                    ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn : "-" : ""

          a.push({
            id: i + 1,
            remark: i == 0 ? data.saSanghatakRemark : i == 1 ? data.deptClerkRemark : i == 2 ? data.deptyCommissionerRemark : "",
            designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : i == 2 ? "Deputy Commissioner" : "",
            remarkDate: i == 0 ? moment(
              data.saSanghatakDate
            ).format("DD-MM-YYYY HH:mm") : i == 1 ?
              moment(
                data.deptClerkDate
              ).format("DD-MM-YYYY HH:mm") : i == 2 ?
                moment(
                  data.deptyCommissionerDate
                ).format("DD-MM-YYYY HH:mm") : "",
            userName: firstNameEn + " " + lastNameEn

          })
        }
      }
      // 1100
      else if (watch("saSanghatakRemark") && watch("deptClerkRemark") && !watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 2; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn
                  ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn : "-" : "";

          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn
                  ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn : "-" : "";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.saSanghatakRemark : i == 1 ? data.deptClerkRemark : "",
            designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Department Clerk" : "",
            remarkDate: i == 0 ? moment(
              data.saSanghatakDate
            ).format("DD-MM-YYYY HH:mm") : i == 1 ?
              moment(
                data.deptClerkDate
              ).format("DD-MM-YYYY HH:mm") : "",
            userName: firstNameEn + " " + lastNameEn
          })
        }
      }
      // 1001
      else if (watch("saSanghatakRemark") && !watch("deptClerkRemark") && !watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 2; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn
                  ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn : "-"
                : "";

          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn
                  ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn : "-"
                : "";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.saSanghatakRemark : i == 1 ? data.deptyCommissionerRemark : "",
            designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Deputy Commissioner" : "",
            remarkDate: i == 0 ? moment(
              data.saSanghatakDate
            ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
              data.deptyCommissionerDate
            ).format("DD-MM-YYYY HH:mm") : "",
            userName: firstNameEn + " " + lastNameEn

          })
        }
      }
      // 1000
      else if (watch("saSanghatakRemark") && !watch("deptClerkRemark") && !watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 1; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.firstNameEn : "-"
              : "";

          const lastNameEn = i == 0 ?
            userLst && userLst.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn
              ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)?.lastNameEn : "-"
            : "";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.saSanghatakRemark : "",
            designation: i == 0 ? "Samuh Sanghtak" : "",
            remarkDate: i == 0 ? moment(
              data.saSanghatakDate
            ).format("DD-MM-YYYY HH:mm") : "",

            userName: firstNameEn + " " + lastNameEn

          })
        }

      }    //    0111
      else if (!watch("saSanghatakRemark") && watch("deptClerkRemark") && watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 3; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn
                  ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn : "-"
                : userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn
                  ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn : "-"

          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn
                  ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn : "-"
                : userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn
                  ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn : "-"
          a.push({
            id: i + 1,
            remark: i == 0 ? data.deptClerkRemark : i == 1 ? data.asstCommissionerRemark : i == 2 ? data.deptyCommissionerRemark : "",
            designation: i == 0 ? "Department Clerk" : i == 1 ? "Assistant Commissioner" : "Deputy Commissioner",
            remarkDate: i == 0 ? moment(
              data.deptClerkDate
            ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
              data.asstCommissionerDate
            ).format("DD-MM-YYYY HH:mm") : moment(
              data.deptyCommissionerDate
            ).format("DD-MM-YYYY HH:mm"),
            userName: firstNameEn + " " + lastNameEn
          })
        }
      }  //0110
      else if (!watch("saSanghatakRemark") && watch("deptClerkRemark") && watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 2; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn
                  ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn : "-"
                : ""

          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn
                  ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn : "-"
                : ""
          a.push({
            id: i + 1,
            remark: i == 0 ? data.deptClerkRemark : i == 1 ? data.asstCommissionerRemark : "",
            designation: i == 0 ? "Department Clerk" : i == 1 ? "Assistant Commissioner" : "",
            remarkDate: i == 0 ? moment(
              data.deptClerkDate
            ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
              data.asstCommissionerDate
            ).format("DD-MM-YYYY HH:mm") : "",
            userName: firstNameEn + " " + lastNameEn
          })
        }
      }
      // 0101
      else if (!watch("saSanghatakRemark") && watch("deptClerkRemark") && !watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 2; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn
                  ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn : "-"
                : "";
          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn : "-"
              : i == 1 ?
                userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn
                  ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn : "-"
                : ""
          a.push({
            id: i + 1,
            remark: i == 0 ? data.deptClerkRemark : i == 1 ? data.deptyCommissionerRemark : "",
            designation: i == 0 ? "Department Clerk" : i == 1 ? "Deputy Commissioner" : "",
            remarkDate: i == 0 ? moment(
              data.deptClerkDate
            ).format("DD-MM-YYYY HH:mm") : i == 1 ? moment(
              data.deptyCommissionerDate
            ).format("DD-MM-YYYY HH:mm") : "",

            userName: firstNameEn + " " + lastNameEn
          })
        }
      }
      //  0100
      else if (!watch("saSanghatakRemark") && watch("deptClerkRemark") && !watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 1; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.firstNameEn : "-"
              : "";

          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)?.lastNameEn : "-"
              : "";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.deptClerkRemark : "",
            designation: i == 0 ? "Department Clerk" : "",
            remarkDate: i == 0 ? moment(
              data.deptClerkDate
            ).format("DD-MM-YYYY HH:mm") : "",

            userName: firstNameEn + " " + lastNameEn

          })
        }
      }
      //  0011
      else if (!watch("saSanghatakRemark") && !watch("deptClerkRemark") && watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 2; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn : "-"
              : userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn : "-";

          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn : "-"
              : userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn : "-";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.asstCommissionerRemark : i == 1 ? data.deptyCommissionerRemark : "",
            designation: i == 0 ? "Assistant Commissioner" : "Deputy Commissioner",
            remarkDate: i == 0 ? moment(
              data.asstCommissionerDate
            ).format("DD-MM-YYYY HH:mm") : moment(
              data.deptyCommissionerDate
            ).format("DD-MM-YYYY HH:mm"),
            userName: firstNameEn + " " + lastNameEn

          })
        }
      }
      //  0010
      else if (!watch("saSanghatakRemark") && !watch("deptClerkRemark") && watch("asstCommissionerRemark") && !watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 1; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.firstNameEn : "-"
              : "";
          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)?.lastNameEn : "-"
              : ""
          a.push({
            id: i + 1,
            remark: i == 0 ? data.asstCommissionerRemark : "",
            designation: i == 0 ? "Assistant Commissioner" : "",
            remarkDate: i == 0 ? moment(
              data.asstCommissionerDate
            ).format("DD-MM-YYYY HH:mm") : "",

            userName: firstNameEn + " " + lastNameEn

          })
        }
        // 0001
      }
      // 0001
      else if (!watch("saSanghatakRemark") && !watch("deptClerkRemark") && !watch("asstCommissionerRemark") && watch("deptyCommissionerRemark")) {
        for (var i = 0; i < 1; i++) {
          const firstNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.firstNameEn : "-" : ""

          const lastNameEn =
            i == 0 ?
              userLst && userLst.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)?.lastNameEn : "-" : ""
          a.push({
            id: i + 1,
            remark: i == 0 ? data.deptyCommissionerRemark : "",
            designation: i == 0 ? "Deputy Commissioner" : "",
            remarkDate: i == 0 ? moment(
              data.deptyCommissionerDate
            ).format("DD-MM-YYYY HH:mm") : "",
            userName: firstNameEn + " " + lastNameEn

          })
        }
      }
      setRemarkData([...a])
      setValue("cancelReason", data.cancelReason)
      setValue("cancelDate", data.cancelDate)
    }
  }


  const loadRegistrationDetails = () => {
    loggedUser === "citizenUser"
      ? axios
        .get(`${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${bgRegId}`, {
          headers: {
            UserId: user.id
          }
        },
        )
        .then((r) => {
          // setDataOnForm(r.data)
          setRegDetails(r.data)
          setRegistrationDetails()
        })
      : axios
        .get(
          `${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${bgRegId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((r) => {
          // setDataOnForm(r.data)
          setRegDetails(r.data)
          setRegistrationDetails()
          // setRegistrationDetails(r.data)
        });
  }

  useEffect(() => {
    setRegistrationDetails()
  }, [regDetails])

  const setRegistrationDetails = () => {
    const data = regDetails
    setValue("branchName", data.branchName)
    setValue("accountNo", data.accountNo)
    setValue("ifscCode", data.ifscCode)
    setValue('micrCode', data.micrCode)
    setValue("bankAccountFullName", data.bankAccountFullName)
    const res = []
    if(data.trnBachatgatRegistrationMembersList!=[]){
      res =data.trnBachatgatRegistrationMembersList&& data.trnBachatgatRegistrationMembersList.map((r, i) => {
        return {
          id: i + 1,
          fullName: r.fullName,
          address: r.address,
          designation: r.designation,
          aadharNumber: r.aadharNumber
        }
      })
    }
    res&& setMemberData([...res])
  }

  // set reg no on ui
  useEffect(() => {
    loadCancellationById()
  }, [router.query.id && ward && zone && area]);

  // handle search connections
  const loadCancellationById = () => {
    loggedUser === "citizenUser" ? axios
      .get(`${urls.BSUPURL}/trnBachatgatCancellation/getById?id=${router.query.id}`, {
        headers: {
          UserId: user.id,
        },
      })
      .then((r) => {
        setValuesData(r.data);

      }) : axios
        .get(`${urls.BSUPURL}/trnBachatgatCancellation/getById?id=${router.query.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          setValuesData(r.data);

        });
  };

  // load zone
  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      let temp = res.data.zone;
      setZone(temp);
    });
  };

  // load ward
  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      let temp = res.data.ward;
      setWard(temp);
    });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios.get(`${urls.CfcURLMaster}/area/getAll`).then((res) => {
      let temp = res.data.area;
      setArea(temp);
    });
  };

  // load category
  const getBachatGatCategory = () => {
    axios.get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`).then((res) => {
      let temp = res.data.mstBachatGatCategoryList;
      setGatCategory(temp);
    });
  };

  // load bank details
  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(r.data.bank);
    });
  };

  // member columns
  const columns = [
    {
      field: "id",
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
  ]


  const approveSectionCol = [
    {
        field: "id",
        headerName: <FormattedLabel id="srNo" />,
        headerAlign: "center",
        align: "center",
    },
    {
        field: "userName",
        headerName: <FormattedLabel id="userName" />,
        headerAlign: "center",
        align: "left",
    },
    {
        field: "designation",
        headerName: <FormattedLabel id='design'/>,
        headerAlign: "center",
        align: "center",
        flex: 1,
    },
    {
        field: "remarkDate",
        headerName: <FormattedLabel id='remarkDate'/>,
        headerAlign: "center",
        align: "center",
        flex: 1,
    },
    {
        field: "remark",
        headerName:<FormattedLabel id="remark"/>,
        headerAlign: "center",
        align: "left",
        flex: 1,
    },
  
    
]

 

  // cancel button
  const cancelButton = () => {
    reset({
      ...resetValuesCancel,
    });
  };


  const resetValuesCancel = {
    remark: "",
  };

  const onSubmitCitizen = () => {
    // console.log("formData ", formData)
    let body = {
      ...valueData,
      cancelReason: watch("cancelReason"),
      cancelDate: watch("cancelDate")
    }


    if (loggedUser === "citizenUser") {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnBachatgatCancellation/save`, body, {
          headers: {
            UserId: user.id,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", `Application No ${res.data.message.split('[')[1].split(']')[0]} Updated succesfully !`, "success");

            router.push({
              pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation",

            });
          }
        });
    } else {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnBachatgatCancellation/save`, body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", `Application No ${res.data.message.split('[')[1].split(']')[0]} Updated succesfully !`, "success");

            router.push({
              pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation",

            });
          }
        });
    }
  }

  // save cancellation
  const onSubmitForm = (formData) => {
    let body = {
      ...valueData,
      saSanghatakRemark: watch("saSanghatakRemark"),
      deptClerkRemark: watch("deptClerkRemark"),
      asstCommissionerRemark: watch("asstCommissionerRemark"),
      deptyCommissionerRemark: watch("deptyCommissionerRemark"),
      "isApproved": formData === "Save" ? true : formData === "Revert" ? false : "false",
      isBenifitedPreviously: false,
      isComplete: statusVal == 16 ? true : false,
      isDraft: false,
      status: formData === "Reject" ? 22 : statusVal
    };

    if (loggedUser === "citizenUser") {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnBachatgatCancellation/save`, body, {
          headers: {
            UserId: user.id,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", formData === "Save" ? `Application No ${res.data.message.split('[')[1].split(']')[0]} Approved succesfully !` : formData === "Revert" ? `Application No ${res.data.message.split('[')[1].split(']')[0]} Reverted succesfully !` : `Application No ${res.data.message.split('[')[1].split(']')[0]} Rejected succesfully !`, "success");
            // loadCancellationById()
            // setDataOnForm()
            router.push({
              pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation",

            });
          }
        });
    } else {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnBachatgatCancellation/save`, body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", formData === "Save" ? `Application No ${res.data.message.split('[')[1].split(']')[0]} Approved succesfully !` : formData === "Revert" ? `Application No ${res.data.message.split('[')[1].split(']')[0]} Reverted succesfully !` : `Application No ${res.data.message.split('[')[1].split(']')[0]} Rejected succesfully !`, "success");
            // loadCancellationById()
            // setDataOnForm()
            router.push({
              pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation",

            });
          }
        });
    }
  };


  const columns2 = [
    {
      field: "documentPath",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      minWidth: 350,
      renderCell: (record) => {
        let naming = record.value
          ?.substring(record.value.lastIndexOf("__") + 2, record.value.length)
          .split(".")[0];
        return <div>{naming}</div>;
      },
    },
    {
      field: "fileType",
      headerName: <FormattedLabel id="fileType" />,
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
        console.log("record?.row?.attachmentName", record);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                console.log("record.row.filePath", record.row);
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`, "_blank");
              }}
            >
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="bachatgatCancellation" />
          </h2>
        </Box>

        <form onSubmit={handleSubmit(onSubmitForm)}>
          {/* Search registration application no */}
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "left"
              }}
            >
              <label style={{
                fontWeight: 'bold',
                fontSize: "18px",
                marginLeft: 30
              }}>
                <FormattedLabel id="applicationNo" /> :
              </label>
              <label style={{
                fontSize: "18px"
              }}>
                {appliNo}
              </label>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "left"
              }}
            >
              <label style={{
                fontWeight: 'bold',
                fontSize: "18px",
                marginLeft: 30

              }}>
                <FormattedLabel id="currentStatus" /> :

              </label>
              <label style={{
                fontSize: "18px",
                gap: 3,
              }}>
                {currentStatus1}
              </label>
            </Grid>
            {/* area name */}
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
                label={<FormattedLabel id="area" />}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
                {...register("areaName")}
                InputLabelProps={{
                  shrink: true,
                }}
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
                id="standard-basic"
                {...register("zoneName")}
                label={<FormattedLabel id="zoneNames" />}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
                control={control}
                InputLabelProps={{
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
                id="standard-basic"
                label={<FormattedLabel id="wardname" />}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
                {...register("wardname")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* gisgeo code */}
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
                label={<FormattedLabel id="gisgioCode" />}
                {...register("geoCode")}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
                InputLabelProps={{
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
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="bachatgatFullName" />}
                {...register("bachatgatName")}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
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
                id="standard-basic"
                label={<FormattedLabel id="bachatgatCat" />}
                variant="standard"
                sx={{ width: "90%" }}
                disabled={true}
                {...register("categoryKey")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

             {/* Bachat Gat start date */}
             <Grid item
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
                                style={{ marginTop: 2, }}
                                error={!!errors.fromDate}
                            >
                                <Controller
                                    control={control}
                                    name="startDate"
                                    // sx={{ minWidth: "80%" }}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker
                                            disabled={true}
                                                // sx={{ minWidth: "80%" }}
                                                variant="standard"
                                                inputFormat="DD/MM/YYYY"
                                                label={<span style={{ fontSize: 16 }}>
                                                    {<FormattedLabel id="bachatgatStartDate" />}</span>}
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

            {/* Main gap  Bachat Gat Address*/}
            <Grid container sx={{ padding: "10px" }}>
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
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              {/* BachatGat President first Name */}
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
                  label={<FormattedLabel id="presidentFirstName" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("presidentFirstName")}
                  InputLabelProps={{
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
                  id="standard-basic"
                  label={<FormattedLabel id="presidentFatherName" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("presidentMiddleName")}
                  InputLabelProps={{
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
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="presidentLastName" />}
                  variant="standard"
                  disabled={true}
                  {...register("presidentLastName")}
                  InputLabelProps={{
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
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("totalMembersCount")}
                  label={<FormattedLabel id="totalCount" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

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
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("flatBuldingNo")}
                  label={<FormattedLabel id="flatBuildNo" />}
                  InputLabelProps={{
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
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  disabled={true}
                  {...register("buildingName")}
                  label={<FormattedLabel id="buildingNm" />}
                  InputLabelProps={{
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
                  id="standard-basic"
                  label={<FormattedLabel id="roadName" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("roadName")}
                  InputLabelProps={{
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
                  id="standard-basic"
                  label={<FormattedLabel id="landmark" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  {...register("landmark")}
                  disabled={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  id="standard-basic"
                  label={<FormattedLabel id="pincode" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("pinCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
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
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              {/* Applicant first name */}
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
                  label={<FormattedLabel id="applicantFirstName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantFirstName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  label={<FormattedLabel id="applicantMiddleName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantMiddleName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  label={<FormattedLabel id="applicantLastName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantLastName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* landline */}
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
                  label={<FormattedLabel id="landlineNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("landlineNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

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
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("mobileNo")}
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
                  id="standard-basic"
                  label={<FormattedLabel id="emailId" />}
                  variant="standard"
                  sx={{ width: "90%" }}
                  disabled={true}
                  {...register("emailId")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Main gap  Bank Details*/}
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

            </Grid>
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
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="bankName" />}
                  variant="standard"
                  disabled={true}
                  {...register("bankName")}
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
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="branchName" />}
                  variant="standard"
                  disabled={true}
                  {...register("branchName")}
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
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="accountNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("accountNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="accountHolderName" />}
                  variant="standard"
                  disabled={true}
                  {...register("bankAccountFullName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
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
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="bankIFSC" />}
                  variant="standard"
                  disabled={true}
                  {...register("ifscCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="bankMICR" />}
                  variant="standard"
                  disabled={true}
                  {...register("micrCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="startDate" />}
                  variant="standard"
                  disabled={true}
                  {...register("startDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid> */}
            </Grid>

            {/* Main gap  Member Information*/}
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
            </Grid>

            {/* members show in table */}
            <DataGrid
              autoHeight
              sx={{
                // marginTop: 5,
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
              rows={memberList}
              columns={columns}
            />
            {/* Main gap  Required Documents*/}
            <Grid container sx={{ padding: "10px" }}>
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
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              {/* Documents */}
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
                <>
                  <DataGrid
                    autoHeight
                    sx={{
                      overflowY: "scroll",
                      backgroundColor: "white",
                      "& .MuiDataGrid-virtualScrollerContent": {
                      },
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },

                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                      "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                        marginTop: "17px",
                      },
                    }}
                    // density="standard"
                    rows={fetchDocument}
                    columns={columns2}
                  />
                </>
              </Grid>
            </Grid>

            {/* Main gap  Approval*/}
            <Grid container sx={{ padding: "10px" }}>
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
                  <FormattedLabel id="cancellationSection" />
                </h2>
              </Box>
            </Grid>
            <Grid container style={{ padding: "10px" }}>
              {/* cancel reason */}
              <Grid
                item
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ width: "90%" }}
                  label={<FormattedLabel id="cancelReason" />}
                  id="standard-basic"
                  variant="standard"
                  disabled={router.query.isEdit == "true" ? false : true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("cancelReason")}
                  error={!!errors.reason}
                  InputProps={{ style: { fontSize: 18 } }}
                  helperText={
                    errors?.cancelReason ? "Cancel Reason is Required !!!" : null
                  }
                />
              </Grid>

              {/* cancel date */}
              <Grid item
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <FormControl variant="standard" style={{ marginTop: 10, width: "90%" }} error={!!errors.cancelDate}>
                  <Controller
                    control={control}
                    sx={{ width: "90%" }}
                    name="cancelDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={true}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="standard"
                          inputFormat="DD/MM/YYYY"
                          label={<span style={{ fontSize: 16 }}><FormattedLabel id="cancelDate"></FormattedLabel></span>}
                          value={field.value}
                          onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField {...params} size="small" variant="standard" sx={{ width: "90%" }} />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.cancelDate ? errors?.cancelDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>


              {/* save cancel button button */}
              {router.query.isEdit == "true" && <Grid container>
                <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button
                    sx={{}}
                    // type="submit"
                    size="medium"
                    variant="contained"
                    color="primary"
                    endIcon={<SaveIcon />}
                    onClick={() => onSubmitCitizen()}
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
              </Grid>}
            </Grid>

            {/* .................................................................. */}

            {/* </Grid> */}
          </Grid>
          {/* Approval section */}
          <Grid container sx={{ padding: "10px" }}></Grid>
          {((loggedUser != 'citizenUser' && loggedUser != 'cfcUser') || ((loggedUser === 'citizenUser' || loggedUser === 'cfcUser') && (statusVal === 1 || statusVal === 23||statusVal === 22 ) && remarkTableData.length != 0)) &&
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "10px",
                background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              <h2>
                <FormattedLabel id="approvalSection" />
              </h2>
            </Box>}

          {/* samuh sanghtak remark show only citizen when status is reverted */}
          {((loggedUser === 'citizenUser' || loggedUser === 'cfcUser') && (statusVal === 22 || statusVal === 1)) && <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 4
            }}
          >
            <TextField
              sx={{ width: "90%", }}
              id="standard-basic"
              label={statusVal === 1 ? <FormattedLabel id="revertedReason" /> : <FormattedLabel id="rejectedReason" />}
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              disabled={true}
              {...register("saSanghatakRemark")}
              error={!!errors.saSanghatakRemark}
              helperText={errors?.saSanghatakRemark ? errors.saSanghatakRemark.message : null}
            />
          </Grid>}

          {/* remark table */}
          {(loggedUser != "citizenUser" && loggedUser != "cfcUser" && remarkTableData.length != 0) && <DataGrid
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
              marginTop: "10px"
            }}
            density="compact"
            rowHeight={50}
            rowCount={remarkTableData.length}
            pageSize={10}
            rows={remarkTableData}
            columns={approveSectionCol}
            onPageChange={(_data) => {
              // getBachatGatCategoryNewScheme(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // getBachatGatCategoryNewScheme(_data, data.page);
            }}
          />}

          {/* Samuh sanghtak remark */}
          {((statusVal == 2 || statusVal == 23) && authority && authority.find((val) => val === "SAMUHA SANGHATAK")) && <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 4
            }}
          >
            <TextField
              sx={{ width: "90%", }}
              id="standard-basic"
              label={<FormattedLabel id="saSanghatakRemark" />}
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              disabled={statusVal != 2 && statusVal != 23 ? true : authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? false : true}
              {...register("saSanghatakRemark")}
              error={!!errors.saSanghatakRemark}
              helperText={errors?.saSanghatakRemark ? errors.saSanghatakRemark.message : null}
            />
          </Grid>}

          {/* deparment clerk remark */}
          {((statusVal == 3 || statusVal == 4) && authority && authority.find((val) => val === "PROPOSAL APPROVAL"))
            &&
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                sx={{ width: "90%", }}
                id="standard-basic"
                label={<FormattedLabel id="deptClerkRemark" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("deptClerkRemark")}
                disabled={(statusVal != 3 && statusVal != 4) ? true : authority && authority.find((val) => val === "PROPOSAL APPROVAL") ? false : true}
                error={!!errors.deptClerkRemark}
                helperText={errors?.deptClerkRemark ? errors.deptClerkRemark.message : null}
              />
            </Grid>}

          {/* assistant commisssioner remark */}
          {((statusVal == 5 || statusVal == 6) && authority && authority.find((val) => val === "APPROVAL")) &&
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 4
              }}
            >
              <TextField
                sx={{ width: "90%", }}
                id="standard-basic"
                label={<FormattedLabel id="asstCommissionerRemark" />}
                variant="standard"
                disabled={statusVal != 5 && statusVal != 6 ? true : (authority && authority.find((val) => val === "APPROVAL")) ? false : true}
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("asstCommissionerRemark")}
                error={!!errors.asstCommissionerRemark}
                helperText={errors?.asstCommissionerRemark ? errors.asstCommissionerRemark.message : null}
              />
            </Grid>}

          {/* deputy commissioner remark */}
          {(statusVal == 7 && authority && authority.find((val) => val === "FINAL_APPROVAL")) &&
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 4
              }}
            >
              <TextField
                sx={{ width: "90%", }}
                id="standard-basic"
                label={<FormattedLabel id="deptyCommissionerRemark" />}
                variant="standard"
                disabled={statusVal != 7 ? true : false}
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("deptyCommissionerRemark")}
                error={!!errors.deptyCommissionerRemark}
                helperText={errors?.deptyCommissionerRemark ? errors.deptyCommissionerRemark.message : null}
              />
            </Grid>}


          {statusVal == 16 && authority && authority.find((val) => val === "PROPOSAL APPROVAL") && <Grid
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
              margin: 2
            }}
          >
            <Button
              onClick={() => {
                onSubmitForm("Save");
              }}
              variant="contained"
              color="success"
            >
              Complete
              {/* <FormattedLabel id="complete" /> */}
            </Button>
          </Grid>}
          {/* Approve  reject revert button */}
          {(((statusVal == 2 || statusVal == 23) && authority && authority.find((val) => val === "SAMUHA SANGHATAK")) ||
            ((statusVal == 5 || statusVal == 6) && authority && authority.find((val) => val === "APPROVAL")) ||
            ((statusVal == 3 || statusVal == 4) && authority && authority.find((val) => val === "PROPOSAL APPROVAL") ||
              (statusVal == 7 && authority && authority.find((val) => val === "FINAL_APPROVAL")))) &&
            <Grid container sx={{ padding: "10px" }}>


              <Grid
                item
                xl={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                lg={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                md={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                sm={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
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
                  color="success"
                >
                  <FormattedLabel id="approvebtn" />
                </Button>
              </Grid>
              <Grid
                item
                xl={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                lg={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                md={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                sm={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() => {
                    onSubmitForm("Revert");
                  }}
                  variant="contained"
                  color="error"
                >
                  <FormattedLabel id="revertbtn" />

                </Button>
              </Grid>

              {authority && authority.find((val) => val === "SAMUHA SANGHATAK") && <Grid
                item
                xl={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                lg={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                md={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
                sm={authority && authority.find((val) => val === "SAMUHA SANGHATAK") ? 4 : 6}
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
                  color="error"
                >
                  <FormattedLabel id="rejectBtn" />
                  {/* Reject */}
                </Button>
              </Grid>}
            </Grid>}


            {(statusVal==10 && (loggedUser === 'citizenUser' || loggedUser === 'cfcUser')) && <div className={styles.btn} >
                    <Button variant="contained" type="primary" >
                        <FormattedLabel id="print" />
                    </Button>
                    <Button
                        type="primary"
                        variant="contained"
                        onClick={() => {
                            router.push('/BsupNagarvasthi/transaction/bachatGatCancellation')
                        }}
                    >
                        <FormattedLabel id="exit" />
                    </Button>
                </div>}
          <Divider />
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategory;
