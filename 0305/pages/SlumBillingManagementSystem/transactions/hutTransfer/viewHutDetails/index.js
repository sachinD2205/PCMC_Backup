import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Paper, TextField, IconButton, Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import router from "next/router";
import axios from "axios";
import { Clear, ExitToApp, Language, Save } from "@mui/icons-material";
import urls from "../../../../../URLS/urls";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FileTable from "../../../../../components/SlumBillingManagementSystem/FileUpload/FileTable";
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from "moment";

const Index = () => {
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

      // multiple files attach
      const [finalFiles, setFinalFiles] = useState([]);
      const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
      const [photo, setPhoto] = useState(null);

  const [dataSource, setDataSource] = useState({});
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [remark, setRemark] = useState("");
  const [hutData, setHutData] = useState({});
  const [isOverduePayment, setIsOverduePayment] = useState("");
  const [cityDropDown, setCityDropDown] = useState([
    {
      id: 1,
      cityEn: "Pimpri",
      cityMr: "पिंपरी",
    },
    {
      id: 2,
      cityEn: "Chinchwad",
      cityMr: "चिंचवड",
    },
    {
      id: 3,
      cityEn: "Bhosari",
      cityMr: "भोसरी",
    },
  ]);

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    console.log("fileNamee",fileNamee)
    return fileNamee?.length > 0 && fileNamee[1];
  }

  useEffect(() => {
    getHutTransferById(router.query.id);
  }, [router.query.id]);

  const getHutTransferById = (id) => {
    if (id) {
      loggedInUser !== "citizenUser"
        ? axios
            .get(`${urls.SLUMURL}/trnTransferHut/getById?id=${id}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((r) => {
              let result = r.data;
              console.log("getHutTransferById", result);
              setDataSource(result);
              getHutData(result?.hutKey);
            })
        : axios
            .get(`${urls.SLUMURL}/trnTransferHut/getById?id=${id}`, {
              headers: {
                UserId: user.id,
              },
            })
            .then((r) => {
              let result = r.data;
              console.log("getHutTransferById", result);
              setDataSource(result);
              getHutData(result?.hutKey);
            });
    }
  };

  useEffect(() => {
    let res = dataSource;

    setValue("currentOwnerFirstName", res ? res?.currentOwnerFirstName : "-");
    setValue("currentOwnerMiddleName", res ? res?.currentOwnerMiddleName : "-");
    setValue("currentOwnerLastName", res ? res?.currentOwnerLastName : "-");
    setValue("currentOwnerMobileNo", res ? res?.currentOwnerMobileNo : "-");
    setValue("currentOwnerEmailId", res ? res?.currentOwnerEmailId : "-");
    setValue("currentOwnerAadharNo", res ? res?.currentOwnerAadharNo : "-");

    setValue(
      "currentOccupierFirstName",
      res?.currentOccupierFirstName !== null ? res?.currentOccupierFirstName : "-",
    );
    setValue(
      "currentOccupierMiddleName",
      res?.currentOccupierMiddleName !== null ? res?.currentOccupierMiddleName : "-",
    );
    setValue(
      "currentOccupierLastName",
      res?.currentOccupierLastName !== null ? res?.currentOccupierLastName : "-",
    );
    setValue(
      "currentOccupierMobileNo",
      res?.currentOccupierMobileNo !== null ? res?.currentOccupierMobileNo : "-",
    );
    setValue(
      "currentOccupierEmailId",
      res?.currentOccupierEmailId !== null ? res?.currentOccupierEmailId : "-",
    );
    setValue(
      "currentOccupierAadharNo",
      res?.currentOccupierAadharNo !== null ? res?.currentOccupierAadharNo : "-",
    );

    setValue("newHutNo", res !== null ? res?.hutNo : "-");
    setValue("oldHutNo", res !== null ? res?.oldHutNo : "-");
    setValue("transferDate", res?.transferDate ? res?.transferDate : "-");
    setValue("saleValue", res !== null ? res?.saleValue : "-");
    setValue("marketValue", res !== null ? res?.marketValue : "-");
    setValue("areaOfHut", res !== null ? res?.areaOfHut : "-");
    setValue("transferRemarks", res !== null ? res?.transferRemarks : "-");

    setValue("proposedOwnerFirstName", res ? res?.proposedOwnerFirstName : "-");
    setValue("proposedOwnerMiddleName", res ? res?.proposedOwnerMiddleName : "-");
    setValue("proposedOwnerLastName", res ? res?.proposedOwnerLastName : "-");
    setValue("proposedOwnerMobileNo", res ? res?.proposedOwnerMobileNo : "-");
    setValue("proposedOwnerEmailId", res ? res?.proposedOwnerEmailId : "-");
    setValue("proposedOwnerAadharNo", res ? res?.proposedOwnerAadharNo : "-");
    setPhoto(res?.proposedOwnerPhoto);
    setIsOverduePayment(res?.outstandingTax);
    getTitleData(res?.currentOwnerTitle, res?.currentOccupierTitle, res?.proposedOwnerTitle);

    setValue("clerkApprovalRemark", res?.clerkApprovalRemark ? res?.clerkApprovalRemark : "-");
    setValue("headClerkApprovalRemark", res?.headClerkApprovalRemark ? res?.headClerkApprovalRemark : "-");
    setValue(
      "officeSuperintendantApprovalRemark",
      res?.officeSuperintendantApprovalRemark ? res?.officeSuperintendantApprovalRemark : "-",
    );
    setValue(
      "administrativeOfficerApprovalRemark",
      res?.administrativeOfficerApprovalRemark ? res?.administrativeOfficerApprovalRemark : "-",
    );
    setValue(
      "assistantCommissionerApprovalRemark",
      res?.assistantCommissionerApprovalRemark ? res?.assistantCommissionerApprovalRemark : "-",
    );

    setPhoto(res?.applicantPhoto);

    let siteVisitObj = dataSource?.trnVisitScheduleList && dataSource?.trnVisitScheduleList[dataSource?.trnVisitScheduleList?.length - 1];
    setFinalFiles([{srNo:1,fileName:showFileName(siteVisitObj?.siteImage1),filePath:siteVisitObj?.siteImage1},
      {srNo:2,fileName:showFileName(siteVisitObj?.siteImage2),filePath:siteVisitObj?.siteImage2},
      {srNo:3,fileName:showFileName(siteVisitObj?.siteImage3),filePath:siteVisitObj?.siteImage3},
      {srNo:4,fileName:showFileName(siteVisitObj?.siteImage4),filePath:siteVisitObj?.siteImage4},
      {srNo:5,fileName:showFileName(siteVisitObj?.siteImage5),filePath:siteVisitObj?.siteImage5},
    ])
    setValue('siteVisitRemark',siteVisitObj?.remarks)
  }, [dataSource, language]);

  useEffect(() => {
    let res = hutData;
    console.log("hutData", hutData);
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    setValue(
      "cityKey",
      language === "en"
        ? cityDropDown && cityDropDown.find((obj) => obj.id == res?.cityKey)?.cityEn
        : cityDropDown && cityDropDown.find((obj) => obj.id == res?.cityKey)?.cityMr,
    );
    getVillageData(res?.villageKey);
    getAreaData(res?.areaKey);
    getSlumData(res?.slumKey);
    getZoneData(res?.zoneKey);
  }, [hutData]);

  const getTitleData = (currentOwner, currentOccupier, proposedOwner) => {
    console.log("getTitleData");

    if (currentOwner) {
      axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
        let result = r.data.title;
        let res = result && result.find((obj) => obj.id === currentOwner);
        console.log("currentOwner",res);
        setValue(
          "currentOwnerTitle",
          currentOwner === null ? "-" : language == "en" ? res?.title : res?.titleMr,
        );
      });
    } else {
      setValue("currentOwnerTitle", "-");
    }

    if (currentOccupier) {
      axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
        let result = r.data.title;
        let res = result && result.find((obj) => obj.id == currentOccupier);
        setValue(
          "currentOccupierTitle",
          currentOccupier === null ? "-" : language == "en" ? res?.title : res?.titleMr,
        );
      });
    } else {
      setValue("currentOccupierTitle", "-");
    }

    if (proposedOwner) {
      axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
        let result = r.data.title;
        let res = result && result.find((obj) => obj.id == proposedOwner);
        console.log("proposedOwner",res)
        setValue("proposedOwnerTitleKey", language == "en" ? res?.title : res?.titleMr);
      });
    } else {
      setValue("proposedOwnerTitleKey", "-");
    }
  };

  const getHutData = (hutKey) => {
    axios.get(`${urls.SLUMURL}/mstHut/getAll`).then((r) => {
      let result = r.data.mstHutList;
      let res = result && result.find((obj) => obj.id == hutKey);
      console.log("getHutData", dataSource, res);
      setHutData(res);
      setValue("hutNo", res ? res?.hutNo : "-");
    });
  };

  const getVillageData = (villageKey) => {
    axios.get(`${urls.SLUMURL}/master/village/getAll`).then((r) => {
      let result = r.data.village;
      let res = result && result.find((obj) => obj.id == villageKey);
      console.log("getVillageData", dataSource, res);
      setValue("villageKey", !res ? "-" : language === "en" ? res?.villageName : res?.villageNameMr);
    });
  };

  const getSlumData = (slumKey) => {
    axios.get(`${urls.SLUMURL}/mstSlum/getAll`).then((r) => {
      let result = r.data.mstSlumList;
      let res = result && result.find((obj) => obj.id == slumKey);
      console.log("getSlumData", dataSource, res);
      setValue("slumKey", !res ? "-" : language === "en" ? res?.slumName : res?.slumNameMr);
    });
  };

  const getAreaData = (areaKey) => {
    axios.get(`${urls.SLUMURL}/master/area/getAll`).then((r) => {
      let result = r.data.area;
      let res = result && result.find((obj) => obj.id == areaKey);
      console.log("getAreaData", result, areaKey);
      setValue("areaKey", !res ? "-" : language === "en" ? res?.areaName : res?.areaNameMr);
    });
  };

  // get Zone Name
  const getZoneData = (zoneKey) => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      let temp = res.data.zone;
      let _res = temp.find((obj) => obj.id === zoneKey);
      console.log("getZoneData", _res, zoneKey);
      setValue("zoneKey", !_res ? "-" : language === "en" ? _res?.zoneName : _res?.zoneNameMr);
    });
  };
  console.log("dataSource", dataSource);

  const approvalValidation = () => {
    let clerk = authority && authority.find((val) => val === "CLERK");
    let headClerk = authority && authority.find((val) => val === "HEAD_CLERK");
    let officeSuperintendant = authority && authority.find((val) => val === "SUPERVISOR");
    let adminOfficer = authority && authority.find((val) => val === "ADMIN_OFFICER");
    let asstComissioner = authority && authority.find((val) => val === "ASSISTANT_COMMISHIONER");

    return clerk === "CLERK" &&
      (dataSource?.status == 14 || dataSource?.status == 22 || dataSource?.status == 4)
      ? false
      : headClerk === "HEAD_CLERK" && (dataSource?.status == 5 || dataSource?.status == 6)
      ? false
      : officeSuperintendant === "SUPERVISOR" && (dataSource?.status == 7 || dataSource?.status == 8)
      ? false
      : adminOfficer === "ADMIN_OFFICER" && (dataSource?.status == 9 || dataSource?.status == 10)
      ? false
      : asstComissioner === "ASSISTANT_COMMISHIONER" && (dataSource?.status == 11 || dataSource?.status == 12)
      ? false
      : true;
  };

  const validateIssueBtn = () => {
    let clerk = authority && authority.find((val) => val === "CLERK");

    return clerk === "CLERK" && dataSource?.status == 21 ? false : true;
  };

  const handleOnSubmit = (formData) => {
    let body;
    authority && authority.find((val) => val === "CLERK")
      ? (body = {
          ...dataSource,
          clerkApprovalRemark: remark,
          isComplete: false,
        })
      : authority && authority.find((val) => val === "HEAD_CLERK")
      ? (body = {
          ...dataSource,
          headClerkApprovalRemark: remark,
          isComplete: false,
        })
      : authority && authority.find((val) => val === "SUPERVISOR")
      ? (body = {
          ...dataSource,
          officeSuperintendantApprovalRemark: remark,
          isComplete: false,
        })
      : authority && authority.find((val) => val === "ADMIN_OFFICER")
      ? (body = {
          ...dataSource,
          administrativeOfficerApprovalRemark: remark,
          isComplete: false,
        })
      : authority && authority.find((val) => val === "ASSISTANT_COMMISHIONER")
      ? (body = {
          ...dataSource,
          assistantCommissionerApprovalRemark: remark,
          isComplete: true,
        })
      : "";

    if (btnSaveText === "Save") {
      let payload = {
        ...body,
        isApproved: true,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnTransferHut/save`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Approved!",  `Hut Transfer ${dataSource.applicationNo} Approved successfully !`, "success");
            router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails");
          }
        });
      console.log("hut transfer approved", payload);
    } else if (btnSaveText === "Revert") {
      let payload = {
        ...body,
        isApproved: false,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnTransferHut/save`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Revert!", `Hut Transfer ${dataSource.applicationNo} Revert Back successfully !`, "success");
            router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails");
          }
        });
      console.log("hut transfer rejected", payload);
    }
    else if (btnSaveText === "Reject") {
      let payload = {
        ...body,
        isApproved: null,
        rejected:true,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnTransferHut/save`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Rejected!", `Hut Transfer ${dataSource.applicationNo} Rejected successfully !`, "success");
            router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails");
          }
        });
      console.log("hut transfer rejected", payload);
    }
    else if (btnSaveText === "Complete") {
      let payload = {
        ...body,
        isApproved: null,
        isComplete: true,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnTransferHut/save`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Issued!", `Hut ${dataSource.applicationNo} Transfer  successfully !`, "success");
            router.push("/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails");
          }
        });
      console.log("hut transfer complteed", payload);
    }
  };

  
  // file attache column
  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
      //   width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      headerAlign: "center",
      align:"center",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      headerAlign: "center",
      align:"center",
      // flex: 1,
      width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`, "_blank");
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
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
        <form onSubmit={handleSubmit(handleOnSubmit)}>
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
              <FormattedLabel id="searchHutDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Hut No */}
            <Grid
              item
              xl={3}
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
              <TextField
                multiline
                sx={{ width: "250px" }}
                label={<FormattedLabel id="oldHutNo" />}
                // @ts-ignore
                variant="standard"
                {...register("oldHutNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("oldHutNo") ? true : false,
                }}
                error={!!error.oldHutNo}
                helperText={error?.oldHutNo ? error.oldHutNo.message : null}
              />
            </Grid>

            {/* Slum Name */}
            <Grid
              item
              xl={3}
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="slumName" />}
                // @ts-ignore
                variant="standard"
                value={watch("slumKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("slumKey") ? true : false,
                }}
                error={!!error.slumKey}
                helperText={error?.slumKey ? error.slumKey.message : null}
              />
            </Grid>

            {/* Zone Name */}
            <Grid
              item
              xl={3}
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="zone" />}
                // @ts-ignore
                variant="standard"
                value={watch("zoneKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("zoneKey") ? true : false,
                }}
                error={!!error.zoneKey}
                helperText={error?.zoneKey ? error.zoneKey.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
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
                variant="contained"
                onClick={() => {
                  handleSearchHut();
                }}
              >
                {<FormattedLabel id="search" />}
              </Button>
            </Grid>
          </Grid>

          {/* Hut Owners Details */}
          <Box
            style={{
              marginTop: "10px",
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
              <FormattedLabel id="hutOwnerDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* owner Title */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="title" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOwnerTitle")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOwnerTitle") ? true : false,
                }}
                error={!!error.currentOwnerTitle}
                helperText={error?.currentOwnerTitle ? error.currentOwnerTitle.message : null}
              />
            </Grid>

            {/* firstName */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="firstName" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOwnerFirstName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOwnerFirstName") ? true : false,
                }}
                error={!!error.currentOwnerFirstName}
                helperText={error?.currentOwnerFirstName ? error.currentOwnerFirstName.message : null}
              />
            </Grid>

            {/* middleName */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="middleName" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOwnerMiddleName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOwnerMiddleName") ? true : false,
                }}
                error={!!error.currentOwnerMiddleName}
                helperText={error?.currentOwnerMiddleName ? error.currentOwnerMiddleName.message : null}
              />
            </Grid>

            {/* lastName */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lastName" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOwnerLastName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOwnerLastName") ? true : false,
                }}
                error={!!error.currentOwnerLastName}
                helperText={error?.currentOwnerLastName ? error.currentOwnerLastName.message : null}
              />
            </Grid>

            {/* mobileNo */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="mobileNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOwnerMobileNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOwnerMobileNo") ? true : false,
                }}
                error={!!error.currentOwnerMobileNo}
                helperText={error?.currentOwnerMobileNo ? error.currentOwnerMobileNo.message : null}
              />
            </Grid>

            {/* emailId */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="emailId" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOwnerEmailId")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOwnerEmailId") ? true : false,
                }}
                error={!!error.currentOwnerEmailId}
                helperText={error?.currentOwnerEmailId ? error.currentOwnerEmailId.message : null}
              />
            </Grid>

            {/* aadharNo */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="aadharNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOwnerAadharNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOwnerAadharNo") ? true : false,
                }}
                error={!!error.currentOwnerAadharNo}
                helperText={error?.currentOwnerAadharNo ? error.currentOwnerAadharNo.message : null}
              />
            </Grid>
          </Grid>

          {/* Hut Occupier's Details */}

          <Box
            style={{
              marginTop: "10px",
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
              <FormattedLabel id="hutOccupiersDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* owner Title */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="title" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOccupierTitle")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOccupierTitle") ? true : false,
                }}
                error={!!error.currentOccupierTitle}
                helperText={error?.currentOccupierTitle ? error.currentOccupierTitle.message : null}
              />
            </Grid>

            {/* firstName */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="firstName" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOccupierFirstName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOccupierFirstName") ? true : false,
                }}
                error={!!error.currentOccupierFirstName}
                helperText={error?.currentOccupierFirstName ? error.currentOccupierFirstName.message : null}
              />
            </Grid>

            {/* middleName */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="middleName" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOccupierMiddleName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOccupierMiddleName") ? true : false,
                }}
                error={!!error.currentOccupierMiddleName}
                helperText={error?.currentOccupierMiddleName ? error.currentOccupierMiddleName.message : null}
              />
            </Grid>

            {/* lastName */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lastName" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOccupierLastName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOccupierLastName") ? true : false,
                }}
                error={!!error.currentOccupierLastName}
                helperText={error?.currentOccupierLastName ? error.currentOccupierLastName.message : null}
              />
            </Grid>

            {/* mobileNo */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="mobileNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOccupierMobileNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOccupierMobileNo") ? true : false,
                }}
                error={!!error.currentOccupierMobileNo}
                helperText={error?.currentOccupierMobileNo ? error.currentOccupierMobileNo.message : null}
              />
            </Grid>

            {/* emailId */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="emailId" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOccupierEmailId")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOccupierEmailId") ? true : false,
                }}
                error={!!error.currentOccupierEmailId}
                helperText={error?.currentOccupierEmailId ? error.currentOccupierEmailId.message : null}
              />
            </Grid>

            {/* aadharNo */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="aadharNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("currentOccupierAadharNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("currentOccupierAadharNo") ? true : false,
                }}
                error={!!error.currentOccupierAadharNo}
                helperText={error?.currentOccupierAadharNo ? error.currentOccupierAadharNo.message : null}
              />
            </Grid>
          </Grid>

          {/* Hut Address Details */}

          <Box
            style={{
              marginTop: "10px",
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
              <FormattedLabel id="hutAddressDetails" />
            </h2>
          </Box>

          <Grid container>
            {/* Area */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="area" />}
                // @ts-ignore
                variant="standard"
                value={watch("areaKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("areaKey") ? true : false,
                }}
                error={!!error.areaKey}
                helperText={error?.areaKey ? error.areaKey.message : null}
              />
            </Grid>

            {/* Village */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="village" />}
                // @ts-ignore
                variant="standard"
                value={watch("villageKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("villageKey") ? true : false,
                }}
                error={!!error.villageKey}
                helperText={error?.villageKey ? error.villageKey.message : null}
              />
            </Grid>

            {/* city */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="city" />}
                // @ts-ignore
                variant="standard"
                value={watch("cityKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("cityKey") ? true : false,
                }}
                error={!!error.cityKey}
                helperText={error?.cityKey ? error.cityKey.message : null}
              />
            </Grid>

            {/* pincode */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="pincode" />}
                // label={labels["pincode"]}
                // @ts-ignore
                variant="standard"
                {...register("pincode")}
                InputLabelProps={{
                  shrink: router.query.id || watch("pincode") ? true : false,
                }}
                error={!!error.pincode}
                helperText={error?.pincode ? error.pincode.message : null}
              />
            </Grid>

            {/* Lattitude */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lattitude" />}
                // label={labels["lattitude"]}
                // @ts-ignore
                variant="standard"
                {...register("lattitude")}
                InputLabelProps={{
                  shrink: router.query.id || watch("lattitude") ? true : false,
                }}
                error={!!error.lattitude}
                helperText={error?.lattitude ? error.lattitude.message : null}
              />
            </Grid>

            {/* Longitude */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="longitude" />}
                // label={labels["longitude"]}
                // @ts-ignore
                variant="standard"
                {...register("longitude")}
                InputLabelProps={{
                  shrink: router.query.id || watch("longitude") ? true : false,
                }}
                error={!!error.longitude}
                helperText={error?.longitude ? error.longitude.message : null}
              />
            </Grid>
          </Grid>

          {/********* Transfer Details *********/}

          <Box
            style={{
              marginTop: "10px",
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
              <FormattedLabel id="transferDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Hut No */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="hutNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("newHutNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("newHutNo") ? true : false,
                }}
                error={!!error.newHutNo}
                helperText={error?.newHutNo ? error.newHutNo.message : null}
              />
            </Grid>

            {/* Old Hut No */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="oldHutNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("oldHutNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("oldHutNo") ? true : false,
                }}
                error={!!error.oldHutNo}
                helperText={error?.oldHutNo ? error.oldHutNo.message : null}
              />
            </Grid>

            {/* Transfer Type */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="transferType" />}
                // @ts-ignore
                variant="standard"
                value={watch("transferTypeKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("transferTypeKey") ? true : false,
                }}
                error={!!error.transferTypeKey}
                helperText={error?.transferTypeKey ? error.transferTypeKey.message : null}
              />
            </Grid>

            {/* sub Transfer Type */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="subTransferType" />}
                // @ts-ignore
                variant="standard"
                value={watch("subTransferTypeKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("subTransferTypeKey") ? true : false,
                }}
                error={!!error.subTransferTypeKey}
                helperText={error?.subTransferTypeKey ? error.subTransferTypeKey.message : null}
              />
            </Grid>

            {/* transfer Date */}

            <Grid
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
              <TextField
                multiline
                id="standard-textarea"
                label={<FormattedLabel id="transferDate" />}
                sx={{ width: "250px" }}
                variant="standard"
                value={moment(watch("transferDate"), "YYYY-MM-DD").format("DD-MM-YYYY")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("transferDate") ? true : false) || (router.query.transferDate ? true : false),
                }}
              />
            </Grid>

            {/* Sale Value */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="saleValue" />}
                // @ts-ignore
                variant="standard"
                value={watch("saleValue")}
                InputLabelProps={{
                  shrink: router.query.id || watch("saleValue") ? true : false,
                }}
                error={!!error.saleValue}
                helperText={error?.saleValue ? error.saleValue.message : null}
              />
            </Grid>

            {/* Market Value */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="marketValue" />}
                // @ts-ignore
                variant="standard"
                value={watch("marketValue")}
                InputLabelProps={{
                  shrink: router.query.id || watch("marketValue") ? true : false,
                }}
                error={!!error.marketValue}
                helperText={error?.marketValue ? error.marketValue.message : null}
              />
            </Grid>

            {/* Hut Area */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="hutArea" />}
                // @ts-ignore
                variant="standard"
                value={watch("areaOfHut")}
                InputLabelProps={{
                  shrink: router.query.id || watch("areaOfHut") ? true : false,
                }}
                error={!!error.areaOfHut}
                helperText={error?.areaOfHut ? error.areaOfHut.message : null}
              />
            </Grid>

            {/* Transfer Remark */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="transferRemarks" />}
                // @ts-ignore
                variant="standard"
                value={watch("transferRemarks")}
                InputLabelProps={{
                  shrink: router.query.id || watch("transferRemarks") ? true : false,
                }}
                error={!!error.transferRemarks}
                helperText={error?.transferRemarks ? error.transferRemarks.message : null}
              />
            </Grid>
          </Grid>

          {/* Proposed owner Details */}

          <Box
            style={{
              marginTop: "10px",
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
              <FormattedLabel id="proposedOwnerDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* proposed Owner Title */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="proposedOwnerTitle" />}
                // @ts-ignore
                variant="standard"
                value={watch("proposedOwnerTitleKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerTitleKey") ? true : false,
                }}
                error={!!error.proposedOwnerTitleKey}
                helperText={error?.proposedOwnerTitleKey ? error.proposedOwnerTitleKey.message : null}
              />
            </Grid>

            {/* proposed Owner firstName (English) */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="proposedOwnerFirstName" />}
                // @ts-ignore
                variant="standard"
                value={watch("proposedOwnerFirstName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerFirstName") ? true : false,
                }}
                error={!!error.proposedOwnerFirstName}
                helperText={error?.proposedOwnerFirstName ? error.proposedOwnerFirstName.message : null}
              />
            </Grid>

            {/* proposed Owner middleName (English) */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="proposedOwnerMiddleName" />}
                // @ts-ignore
                variant="standard"
                value={watch("proposedOwnerMiddleName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerMiddleName") ? true : false,
                }}
                error={!!error.proposedOwnerMiddleName}
                helperText={error?.proposedOwnerMiddleName ? error.proposedOwnerMiddleName.message : null}
              />
            </Grid>

            {/* proposed Owner lastName (English) */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="proposedOwnerLastName" />}
                // @ts-ignore
                variant="standard"
                value={watch("proposedOwnerLastName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerLastName") ? true : false,
                }}
                error={!!error.proposedOwnerLastName}
                helperText={error?.proposedOwnerLastName ? error.proposedOwnerLastName.message : null}
              />
            </Grid>

            {/* proposed Owner mobileNo */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="proposedOwnerMobileNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("proposedOwnerMobileNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerMobileNo") ? true : false,
                }}
                error={!!error.proposedOwnerMobileNo}
                helperText={error?.proposedOwnerMobileNo ? error.proposedOwnerMobileNo.message : null}
              />
            </Grid>

            {/* proposed Owner emailId */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="proposedOwnerEmailId" />}
                // @ts-ignore
                variant="standard"
                value={watch("proposedOwnerEmailId")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerEmailId") ? true : false,
                }}
                error={!!error.proposedOwnerEmailId}
                helperText={error?.proposedOwnerEmailId ? error.proposedOwnerEmailId.message : null}
              />
            </Grid>

            {/* proposed Owner aadharNo */}
            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="proposedOwnerAadharNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("proposedOwnerAadharNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("proposedOwnerAadharNo") ? true : false,
                }}
                error={!!error.proposedOwnerAadharNo}
                helperText={error?.proposedOwnerAadharNo ? error.proposedOwnerAadharNo.message : null}
              />
            </Grid>

            {/*  proposed Owner Upload Photos */}
            <Grid
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
                marginTop: "20px",
              }}
            >
              <label>
                <b>
                  <FormattedLabel id="photo" />
                </b>
              </label>
              <Button variant="contained">
                {" "}
                <FormattedLabel id="preview" />
              </Button>
            </Grid>
          </Grid>

          {/* view uploaded files */}

          <Box
            style={{
              marginTop: "10px",
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
              <FormattedLabel id="attachImages" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
          <Grid
              item
              xs={12}
            >
              <FileTable
              columns={_columns} //columns for the table
              rows={finalFiles} //state to be displayed in table
              pageMode={router.query.pageMode}
              authorizedToUpload={authorizedToUpload}
            />
            </Grid>
          </Grid>

          {/* generate reports */}

          <Box
            style={{
              marginTop: "10px",
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
              <FormattedLabel id="generateReports" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Generate Inspection Report */}
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
                marginTop: "10px",
              }}
            >
              <Grid item xl={1} lg={1} md={1} sm={1} xs={1}></Grid>
              <Grid item xl={9} lg={9} md={9} sm={9} xs={9}>
                <label>
                  <b>
                    <FormattedLabel id="generateInspectionReport" />
                  </b>
                </label>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button color="primary" variant="contained">
                  <FormattedLabel id="generate" />
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Remarks */}

          <Box
            style={{
              marginTop: "10px",
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
              <FormattedLabel id="remarks" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>

              {/* site visit remark */}
              <Grid
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="siteVisitRemark" />}
                // @ts-ignore
                variant="standard"
                value={watch("siteVisitRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("siteVisitRemark") ? true : false,
                }}
                error={!!error.siteVisitRemark}
                helperText={error?.siteVisitRemark ? error.siteVisitRemark.message : null}
              />
            </Grid>

            {/* Clerk Approval Remark */}

            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="clerkApprovalRemark" />}
                // @ts-ignore
                variant="standard"
                value={watch("clerkApprovalRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("clerkApprovalRemark") ? true : false,
                }}
                error={!!error.clerkApprovalRemark}
                helperText={error?.clerkApprovalRemark ? error.clerkApprovalRemark.message : null}
              />
            </Grid>

            {/* Head Clerk Approval Remark */}

            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="headClerkApprovalRemark" />}
                // @ts-ignore
                variant="standard"
                value={watch("headClerkApprovalRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("headClerkApprovalRemark") ? true : false,
                }}
                error={!!error.headClerkApprovalRemark}
                helperText={error?.headClerkApprovalRemark ? error.headClerkApprovalRemark.message : null}
              />
            </Grid>

            {/* office superintendant Approval Remark */}

            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="officeSuperintendantApprovalRemark" />}
                // @ts-ignore
                variant="standard"
                value={watch("officeSuperintendantApprovalRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("officeSuperintendantApprovalRemark") ? true : false,
                }}
                error={!!error.officeSuperintendantApprovalRemark}
                helperText={
                  error?.officeSuperintendantApprovalRemark
                    ? error.officeSuperintendantApprovalRemark.message
                    : null
                }
              />
            </Grid>

            {/* admin officer Approval Remark */}

            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="administrativeOfficerApprovalRemark" />}
                // @ts-ignore
                variant="standard"
                value={watch("administrativeOfficerApprovalRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("administrativeOfficerApprovalRemark") ? true : false,
                }}
                error={!!error.administrativeOfficerApprovalRemark}
                helperText={
                  error?.administrativeOfficerApprovalRemark
                    ? error.administrativeOfficerApprovalRemark.message
                    : null
                }
              />
            </Grid>

            {/* assistant commisioner Approval Remark */}

            <Grid
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
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="assistantCommissionerApprovalRemark" />}
                // @ts-ignore
                variant="standard"
                value={watch("assistantCommissionerApprovalRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("assistantCommissionerApprovalRemark") ? true : false,
                }}
                error={!!error.assistantCommissionerApprovalRemark}
                helperText={
                  error?.assistantCommissionerApprovalRemark
                    ? error.assistantCommissionerApprovalRemark.message
                    : null
                }
              />
            </Grid>

            {/* ADD Remark */}

            {loggedInUser !== "citizenUser" ? (
              <Grid container mt={5}>
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
                  {" "}
                  <TextField
                    multiline
                    disabled={router.query.pageMode == "view" ? true : false}
                    sx={{ m: 1, minWidth: "81%" }}
                    label={<FormattedLabel id="remarks" />}
                    // label={labels["remarks"]}
                    // @ts-ignore
                    variant="outlined"
                    value={remark}
                    onChange={(e) => {
                      setRemark(e.target.value);
                    }}
                    InputLabelProps={{
                      shrink: router.query.id || watch("remarks") ? true : false,
                    }}
                    error={!!error.remarks}
                    helperText={error?.remarks ? error.remarks.message : null}
                  />
                </Grid>
              </Grid>
            ) : (
              <></>
            )}

            {loggedInUser === "citizenUser" ? (
              <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>
                <Grid
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
                    marginTop: "20px",
                  }}
                >
                  <Button
                    color="success"
                    variant="contained"
                    type="submit"
                    disabled
                    onClick={() => {
                      setBtnSaveText("Save");
                    }}
                    endIcon={<Save />}
                  >
                    <FormattedLabel id="APPROVE" />
                  </Button>
                </Grid>

                <Grid
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
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    disabled
                    onClick={() => {
                      setBtnSaveText("Revert");
                    }}
                  >
                    <FormattedLabel id="Revert" />
                  </Button>
                </Grid>

                <Grid
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
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      router.push(`/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails`);
                    }}
                  >
                    <FormattedLabel id="exit" />
                    {/* {labels["exit"]} */}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>
                {dataSource?.status == 21 ? (
                  <Grid
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
                      marginTop: "20px",
                    }}
                  >
                    {" "}
                    <Button
                      color="success"
                      variant="contained"
                      type="submit"
                      disabled={validateIssueBtn()}
                      onClick={() => {
                        setBtnSaveText("Complete");
                      }}
                      endIcon={<Save />}
                    >
                      <FormattedLabel id="completeAndIssueOrder" />
                    </Button>
                  </Grid>
                ) : (
                  <>
                    <Grid
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
                        marginTop: "20px",
                      }}
                    >
                      <Button
                        color="success"
                        variant="contained"
                        type="submit"
                        disabled={approvalValidation()}
                        onClick={() => {
                          setBtnSaveText("Save");
                        }}
                        endIcon={<Save />}
                      >
                        <FormattedLabel id="APPROVE" />
                      </Button>
                    </Grid>

                    {authority?.find((val) => val == "CLERK") && (dataSource?.status == 14 || dataSource?.status == 2 ||dataSource?.status == 22) ? (
                      <Grid
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
                          marginTop: "20px",
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          type="submit"
                          disabled={approvalValidation()}
                          onClick={() => {
                            setBtnSaveText("Reject");
                          }}
                        >
                          {language == "en" ? "Reject" : "नकार द्या"}
                        </Button>
                      </Grid>
                    ) : (
                      <Grid
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
                          marginTop: "20px",
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          type="submit"
                          disabled={approvalValidation()}
                          onClick={() => {
                            setBtnSaveText("Revert");
                          }}
                        >
                          <FormattedLabel id="Revert" />
                        </Button>
                      </Grid>
                    )}
                  </>
                )}

                <Grid
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
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      router.push(`/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails`);
                    }}
                  >
                    <FormattedLabel id="exit" />
                    {/* {labels["exit"]} */}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default Index;
