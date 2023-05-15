import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Paper, TextField, Button, IconButton } from "@mui/material";
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
import VisibilityIcon from "@mui/icons-material/Visibility";

const Index = () => {
  const {
    register,
    reset,
    watch,
    setValue,
    getValues,
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

  console.log("finalFiles", finalFiles);

  useEffect(() => {
    if (router.query.id) {
      getPhotopassDataById(router.query.id);
    }
  }, [router.query.id]);

  const getPhotopassDataById = (id) => {
    if (id) {
      if (loggedInUser === "citizenUser") {
        axios
          .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
            headers: {
              UserId: user.id,
            },
          })
          .then((r) => {
            let result = r.data;
            //   console.log("getPhotopassDataById", result);
            setDataSource(result);
          });
      } else {
        axios
          .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((r) => {
            let result = r.data;
            //   console.log("getPhotopassDataById", result);
            setDataSource(result);
          });
      }
    }
  };

  useEffect(() => {
    console.log("asd", dataSource, btnSaveText);
  }, [dataSource, btnSaveText]);

  const handleLOIButton = () => {
    let formData = {
      referenceKey: dataSource?.id,
      title: dataSource?.applicantTitle,
      middleName: dataSource?.applicantMiddleName,
      firstName: dataSource?.applicantFirstName,
      lastName: dataSource?.applicantLastName,
      mobileNo: dataSource?.applicantMobileNo,
    };
    const tempData = axios
      .post(`${urls.SLUMURL}/trnLoi/issuePhotopass/save`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          sweetAlert(
            "Generated!",
            `LOI Payment against ${dataSource.applicationNo} Generated Successfully !`,
            "success",
          );
          router.push({
            pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails",
            query: {
              id: router.query.id,
            },
          });
        }
      });
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    console.log("fileNamee", fileNamee);
    return fileNamee?.length > 0 && fileNamee[1];
  }

  useEffect(() => {
    let res = dataSource;
    console.log("res", res);
    setValue(
      "cityKey",
      language === "en"
        ? cityDropDown && cityDropDown.find((obj) => obj.id == res?.cityKey)?.cityEn
        : cityDropDown && cityDropDown.find((obj) => obj.id == res?.cityKey)?.cityMr,
    );
    getSlumData();
    getAreaData();
    getVillageData();
    getHutData();
    getTitleData();
    setValue("pincode", res?.pincode ? res?.pincode : "-");
    setValue("lattitude", res?.lattitude ? res?.lattitude : "-");
    setValue("longitude", res?.longitude ? res?.longitude : "-");
    setValue("outstandingTax", res?.outstandingTax ? res?.outstandingTax : "-");
    setValue("applicantTitle", res?.applicantTitle ? res?.applicantTitle : "-");
    setValue("applicantFirstName", res?.applicantFirstName ? res?.applicantFirstName : "-");
    setValue("applicantMiddleName", res?.applicantMiddleName ? res?.applicantMiddleName : "-");
    setValue("applicantLastName", res?.applicantLastName ? res?.applicantLastName : "-");
    setValue("applicantMobileNo", res?.applicantMobileNo ? res?.applicantMobileNo : "-");
    setValue("applicantEmailId", res?.applicantEmailId ? res?.applicantEmailId : "-");
    setValue("applicantAadharNo", res?.applicantAadharNo ? res?.applicantAadharNo : "-");
    setValue("noOfCopies", res?.noOfCopies ? res?.noOfCopies : "-");
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

    let siteVisitObj =
      dataSource?.trnVisitScheduleList &&
      dataSource?.trnVisitScheduleList[dataSource?.trnVisitScheduleList?.length - 1];
      // let filesArray = [];

      // filesArray = [...filesArray, siteVisitObj?.siteImage1 ? { srNo: 1, fileName: showFileName(siteVisitObj?.siteImage1), filePath: siteVisitObj?.siteImage1 } : ""]
      // filesArray = [...filesArray, siteVisitObj?.siteImage2 ? { srNo: 2, fileName: showFileName(siteVisitObj?.siteImage2), filePath: siteVisitObj?.siteImage2 } : ""]
      // filesArray = [...filesArray, siteVisitObj?.siteImage3 ? { srNo: 3, fileName: showFileName(siteVisitObj?.siteImage3), filePath: siteVisitObj?.siteImage3 } : ""]
      
      // console.log("filesArray", filesArray)
      // setFinalFiles(filesArray.length>0 && filesArray ? filesArray : { srNo: 1, fileName: showFileName(siteVisitObj?.siteImage1), filePath: siteVisitObj?.siteImage1 } );
    setFinalFiles([
      { srNo: 1, fileName: showFileName(siteVisitObj?.siteImage1), filePath: siteVisitObj?.siteImage1 },
      { srNo: 2, fileName: showFileName(siteVisitObj?.siteImage2), filePath: siteVisitObj?.siteImage2 },
      { srNo: 3, fileName: showFileName(siteVisitObj?.siteImage3), filePath: siteVisitObj?.siteImage3 },
      { srNo: 4, fileName: showFileName(siteVisitObj?.siteImage4), filePath: siteVisitObj?.siteImage4 },
      { srNo: 5, fileName: showFileName(siteVisitObj?.siteImage5), filePath: siteVisitObj?.siteImage5 },
    ]);          
    setValue("siteVisitRemark", siteVisitObj?.remarks);
  }, [dataSource, language]);

  const getTitleData = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      let result = r.data.title;
      console.log("getTitleData", result);
      let res = result && result.find((obj) => obj.id == dataSource?.applicantTitle);
      console.log("getTitleDatares", res);
      setValue("applicantTitle", language ? res?.title : res?.titleMr);
    });
  };

  const getHutData = () => {
    axios.get(`${urls.SLUMURL}/mstHut/getAll`).then((r) => {
      let result = r.data.mstHutList;
      let res = result && result.find((obj) => obj.id == dataSource?.hutKey);
      console.log("getHutData", dataSource, res);
      setValue("hutNo", res ? res?.hutNo : "-");
    });
  };

  const getVillageData = () => {
    axios.get(`${urls.SLUMURL}/master/village/getAll`).then((r) => {
      let result = r.data.village;
      console.log("getVillageData", dataSource, result);
      let res = result && result.find((obj) => obj.id == dataSource?.villageKey);
      setValue("villageKey", !res ? "-" : language === "en" ? res?.villageName : res?.villageNameMr);
    });
  };

  const getSlumData = () => {
    axios.get(`${urls.SLUMURL}/mstSlum/getAll`).then((r) => {
      let result = r.data.mstSlumList;
      let res = result && result.find((obj) => obj.id == dataSource?.slumKey);
      console.log("getSlumData", dataSource, res);
      setValue("slumKey", !res ? "-" : language === "en" ? res?.slumName : res?.slumNameMr);
    });
  };

  const getAreaData = () => {
    axios.get(`${urls.SLUMURL}/master/area/getAll`).then((r) => {
      let result = r.data.area;
      let res = result && result.find((obj) => obj.id == dataSource?.areaKey);
      console.log("getAreaData", dataSource, res);
      setValue("areaKey", language === "en" ? res?.areaName : res?.areaNameMr);
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
      (dataSource?.status == 16 || dataSource?.status == 3 || dataSource?.status == 4)
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

    return clerk === "CLERK" && dataSource?.status == 14 ? false : true;
  };

  const validateLOIBtn = () => {
    let asstCommisioner = authority && authority.find((val) => val === "ASSISTANT_COMMISHIONER");

    return asstCommisioner === "ASSISTANT_COMMISHIONER" && dataSource?.status == 11 ? false : true;
  };

  const validateLOIPaymentBtn = () => {
    return loggedInUser === "citizenUser" && dataSource?.status == 13 ? false : true;
  };

  const handleLOIPaymentButton = () => {
    router.push({
      pathname:
        "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForPhotopass",
      query: {
        id: dataSource.applicationNo,
      },
    });
  }

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
        .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              "Approved!",
              `Photopass against ${dataSource.applicationNo} Approved successfully !`,
              "success",
            );
            router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
          }
        });
      console.log("formData", payload);
    } else if (btnSaveText === "Revert") {
      let payload = {
        ...body,
        isApproved: false,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              "Revert!",
              `Photopass against ${dataSource.applicationNo} Revert Back successfully !`,
              "success",
            );
            router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
          }
        });
      console.log("formData", payload);
    } else if (btnSaveText === "Reject") {
      let payload = {
        ...body,
        isApproved: null,
        rejected: true,
        isComplete: false,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              "Reject!",
              `Photopass against ${dataSource.applicationNo} Rejected successfully !`,
              "success",
            );
            router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
          }
        });
      console.log("formData", payload);
    } else if (btnSaveText === "Complete") {
      let payload = {
        ...body,
        isApproved: null,
        isComplete: true,
        id: dataSource?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Issued!", `Photopass ${dataSource.applicationNo} Issued successfully !`, "success");
            router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
          }
        });
      console.log("photopass complteed", payload);
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
      align: "center",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      headerAlign: "center",
      align: "center",
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
              <FormattedLabel id="inssuranceOfPhotopassDetails" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Title */}
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
                label={<FormattedLabel id="title" />}
                // @ts-ignore
                variant="outlined"
                value={watch("applicantTitle")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantTitle") ? true : false,
                }}
                error={!!error.applicantTitle}
                helperText={error?.applicantTitle ? error.applicantTitle.message : null}
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="firstName" />}
                // @ts-ignore
                variant="outlined"
                value={watch("applicantFirstName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantFirstName") ? true : false,
                }}
                error={!!error.applicantFirstName}
                helperText={error?.applicantFirstName ? error.applicantFirstName.message : null}
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="middleName" />}
                // @ts-ignore
                variant="outlined"
                value={watch("applicantMiddleName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantMiddleName") ? true : false,
                }}
                error={!!error.applicantMiddleName}
                helperText={error?.applicantMiddleName ? error.applicantMiddleName.message : null}
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lastName" />}
                // @ts-ignore
                variant="outlined"
                value={watch("applicantLastName")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantLastName") ? true : false,
                }}
                error={!!error.applicantLastName}
                helperText={error?.applicantLastName ? error.applicantLastName.message : null}
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="mobileNo" />}
                // @ts-ignore
                variant="outlined"
                value={watch("applicantMobileNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantMobileNo") ? true : false,
                }}
                error={!!error.applicantMobileNo}
                helperText={error?.applicantMobileNo ? error.applicantMobileNo.message : null}
              />
            </Grid>

            {/* Upload Photos */}
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
                  <FormattedLabel id="viewPhoto" />
                </b>
              </label>
              &nbsp;
              {photo ? (
                <a href={`${urls.CFCURL}/file/preview?filePath=${photo}`} target="__blank">
                  <Button variant="contained">
                    <FormattedLabel id="preview" />
                  </Button>
                </a>
              ) : (
                <span>No file uploaded</span>
              )}
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="emailId" />}
                // @ts-ignore
                variant="outlined"
                value={watch("applicantEmailId")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantEmailId") ? true : false,
                }}
                error={!!error.applicantEmailId}
                helperText={error?.applicantEmailId ? error.applicantEmailId.message : null}
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="aadharNo" />}
                // @ts-ignore
                variant="outlined"
                value={watch("applicantAadharNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("applicantAadharNo") ? true : false,
                }}
                error={!!error.applicantAadharNo}
                helperText={error?.applicantAadharNo ? error.applicantAadharNo.message : null}
              />
            </Grid>

            {/* No of copies */}
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
                label={<FormattedLabel id="noOfCopies" />}
                // @ts-ignore
                variant="outlined"
                value={watch("noOfCopies")}
                InputLabelProps={{
                  shrink: router.query.id || watch("noOfCopies") ? true : false,
                }}
                error={!!error.noOfCopies}
                helperText={error?.noOfCopies ? error.noOfCopies.message : null}
              />
            </Grid>

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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="area" />}
                // @ts-ignore
                variant="outlined"
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="village" />}
                // @ts-ignore
                variant="outlined"
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="city" />}
                // @ts-ignore
                variant="outlined"
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="pincode" />}
                // label={labels["pincode"]}
                // @ts-ignore
                variant="outlined"
                value={watch("pincode")}
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lattitude" />}
                // label={labels["lattitude"]}
                // @ts-ignore
                variant="outlined"
                value={watch("lattitude")}
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="longitude" />}
                // label={labels["longitude"]}
                // @ts-ignore
                variant="outlined"
                value={watch("longitude")}
                InputLabelProps={{
                  shrink: router.query.id || watch("longitude") ? true : false,
                }}
                error={!!error.longitude}
                helperText={error?.longitude ? error.longitude.message : null}
              />
            </Grid>

            {/* outstanding taxes amount */}
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
                label={<FormattedLabel id="outstandingTaxesAmount" />}
                // label={labels["outstandingTaxesAmount"]}
                // @ts-ignore
                variant="outlined"
                value={watch("outstandingTax")}
                InputLabelProps={{
                  shrink: router.query.id || watch("outstandingTax") ? true : false,
                }}
                error={!!error.outstandingTax}
                helperText={error?.outstandingTax ? error.outstandingTax.message : null}
              />
            </Grid>

            {/* Slum Name */}
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
                label={<FormattedLabel id="slumName" />}
                // @ts-ignore
                variant="outlined"
                value={watch("slumKey")}
                InputLabelProps={{
                  shrink: router.query.id || watch("slumKey") ? true : false,
                }}
                error={!!error.slumKey}
                helperText={error?.slumKey ? error.slumKey.message : null}
              />
            </Grid>

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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="hutNo" />}
                // @ts-ignore
                variant="outlined"
                value={watch("hutNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("hutNo") ? true : false,
                }}
                error={!!error.hutNo}
                helperText={error?.hutNo ? error.hutNo.message : null}
              />
            </Grid>

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
                variant="outlined"
                value={watch("siteVisitRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("siteVisitRemark") ? true : false,
                }}
                error={!!error.siteVisitRemark}
                helperText={error?.siteVisitRemark ? error.siteVisitRemark.message : null}
              />
            </Grid>

            {/* clerk remark */}
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
                label={<FormattedLabel id="clerkApprovalRemark" />}
                // @ts-ignore
                variant="outlined"
                value={watch("clerkApprovalRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("clerkApprovalRemark") ? true : false,
                }}
                error={!!error.clerkApprovalRemark}
                helperText={error?.clerkApprovalRemark ? error.clerkApprovalRemark.message : null}
              />
            </Grid>

            {/* headClerkApprovalRemark */}
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
                label={<FormattedLabel id="headClerkApprovalRemark" />}
                // @ts-ignore
                variant="outlined"
                value={watch("headClerkApprovalRemark")}
                InputLabelProps={{
                  shrink: router.query.id || watch("headClerkApprovalRemark") ? true : false,
                }}
                error={!!error.headClerkApprovalRemark}
                helperText={error?.headClerkApprovalRemark ? error.headClerkApprovalRemark.message : null}
              />
            </Grid>

            {/* officeSuperintendantApprovalRemark */}
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
                label={<FormattedLabel id="officeSuperintendantApprovalRemark" />}
                // @ts-ignore
                variant="outlined"
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

            {/* administrativeOfficerApprovalRemark */}
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
                label={<FormattedLabel id="administrativeOfficerApprovalRemark" />}
                // @ts-ignore
                variant="outlined"
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

            {/* assistantCommissionerApprovalRemark */}
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
                label={<FormattedLabel id="assistantCommissionerApprovalRemark" />}
                // @ts-ignore
                variant="outlined"
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
          </Grid>

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
            <Grid item xs={12}>
              <FileTable
                // appName="SLUM" //Module Name
                // serviceName="SLUM-IssuancePhotopass" //Transaction Name
                // fileName={attachedFile} //State to attach file
                // filePath={setAttachedFile} // File state upadtion function
                // newFilesFn={setAdditionalFiles} // File data function
                columns={_columns} //columns for the table
                rows={finalFiles} //state to be displayed in table
                // uploading={setUploading}
                // getValues={getValues}
                pageMode={router.query.pageMode}
                authorizedToUpload={authorizedToUpload}
                // showNoticeAttachment={router.query.showNoticeAttachment}
              />
            </Grid>
          </Grid>

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
                    {authority && authority.find((val) => val === "CLERK") ? (
                      <FormattedLabel id="generateInspectionReport" />
                    ) : (
                      <FormattedLabel id="generatedInspectionReport" />
                    )}
                  </b>
                </label>
              </Grid>

              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button color="primary" variant="contained">
                  <FormattedLabel id="preview" />
                </Button>
              </Grid>
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
                {dataSource !== undefined && dataSource?.status === 13 ? (
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
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleLOIPaymentButton}
                      disabled={validateLOIPaymentBtn()}
                    >
                      LOI Payment
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
                      router.push(
                        `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`,
                      );
                    }}
                  >
                    <FormattedLabel id="exit" />
                    {/* {labels["exit"]} */}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container xl={12} lg={12} md={12} sm={12} xs={12}>
                {dataSource?.status == 14 ? (
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
                      <FormattedLabel id="issuePhotopass" />
                    </Button>
                  </Grid>
                ) : dataSource !== undefined && dataSource?.status === 11 ? (
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
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleLOIButton}
                      disabled={validateLOIBtn()}
                    >
                      LOI
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

                    {authority?.find((val) => val == "CLERK") && dataSource?.status == 16 ? (
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
                      router.push(
                        `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`,
                      );
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
