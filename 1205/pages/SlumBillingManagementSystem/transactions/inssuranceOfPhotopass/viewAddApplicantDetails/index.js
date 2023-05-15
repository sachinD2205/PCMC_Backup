import React, { useEffect, useState } from "react";
import router from "next/router";
import styles from "../../sbms.module.css";
import {
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  IconButton,
  Box,
  Grid,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { useSelector } from "react-redux";
import UploadButton from "../../../../../containers/reuseableComponents/UploadButton";
import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../../../URLS/urls";

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
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  const [ID, setId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isOverduePayment, setIsOverduePayment] = useState(false);
  const [dataSource, setDataSource] = useState({});

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
  ]);

  useEffect(() => {
    getPhotopassDataById(router.query.id);
    getSlumData();
    getAreaData();
    getVillageData();
    getHutData();
    getTitleData();
  }, [router.query.id]);

  useEffect(() => {
    getTitleData();
    getSlumData();
    getAreaData();
    getVillageData();
    getHutData();
  }, [dataSource, language]);

  const getPhotopassDataById = (id) => {
    if (id) {
      loggedInUser !== "citizenUser"
        ? axios
            .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((r) => {
              let result = r.data;
              //   console.log("getPhotopassDataById", result);
              setDataSource(result);
            })
        : axios
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
    }
  };

  useEffect(() => {
    let res = dataSource;
    setValue(
      "cityKey",
      language === "en"
        ? cityDropDown && cityDropDown.find((obj) => obj.id == res?.cityKey)?.cityEn
        : cityDropDown && cityDropDown.find((obj) => obj.id == res?.cityKey)?.cityMr,
    );
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    setValue("outstandingTax", res ? res?.outstandingTax : "-");
    setValue("applicantTitle", res ? res?.applicantTitle : "-");
    setValue("applicantFirstName", res ? res?.applicantFirstName : "-");
    setValue("applicantMiddleName", res ? res?.applicantMiddleName : "-");
    setValue("applicantLastName", res ? res?.applicantLastName : "-");
    setValue("applicantMobileNo", res ? res?.applicantMobileNo : "-");
    setValue("applicantEmailId", res ? res?.applicantEmailId : "-");
    setValue("applicantAadharNo", res ? res?.applicantAadharNo : "-");
    setValue("noOfCopies", res ? res?.noOfCopies : "-");
    setPhoto(res ? res?.applicantPhoto : null);
  }, [dataSource, language]);

  const getTitleData = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      let result = r.data.title;
      // console.log("getTitleData", result);
      let res = result && result.find((obj) => obj.id == dataSource?.applicantTitle);
      console.log("getTitleData", dataSource, res);
      setValue("applicantTitle", language == "en" ? res?.title : res?.titleMr);
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

  const handleOnSubmit = (formData) => {
    if (btnSaveText === "Save") {
      router.push({
        pathname: "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/scheduleSiteVisit",
        query: {
          id: router.query.id,
        },
      });
    }
    else{
      let payload = {
        ...dataSource,
        isApproved: false,
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
            sweetAlert("Revert!", `Photopass against ${dataSource.applicationNo} Revert Back successfully !`, "success");
            router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
          }
        });
      console.log("formData", payload);
    }
  };

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
              <FormattedLabel id="slumAddress" />
            </h2>
          </Box>

          <Grid container sx={{ padding: "10px" }}>
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
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="area" />}
                // @ts-ignore
                variant="outlined"
                {...register("areaKey")}
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
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="village" />}
                // @ts-ignore
                variant="outlined"
                {...register("villageKey")}
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
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="city" />}
                // @ts-ignore
                variant="outlined"
                {...register("cityKey")}
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
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="pincode" />}
                // label={labels["pincode"]}
                // @ts-ignore
                variant="outlined"
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
                marginTop: "20px",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lattitude" />}
                // label={labels["lattitude"]}
                // @ts-ignore
                variant="outlined"
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
                marginTop: "20px",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="longitude" />}
                // label={labels["longitude"]}
                // @ts-ignore
                variant="outlined"
                {...register("longitude")}
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
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="outstandingTaxesAmount" />}
                // label={labels["outstandingTaxesAmount"]}
                // @ts-ignore
                variant="outlined"
                {...register("outstandingTax")}
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
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="slumName" />}
                // @ts-ignore
                variant="outlined"
                {...register("slumKey")}
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
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="hutNo" />}
                // @ts-ignore
                variant="outlined"
                {...register("hutNo")}
                InputLabelProps={{
                  shrink: router.query.id || watch("hutNo") ? true : false,
                }}
                error={!!error.hutNo}
                helperText={error?.hutNo ? error.hutNo.message : null}
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
              <FormattedLabel id="applicantInfo" />
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
          </Grid>

          {/* <Grid container mt={5}>
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
                    id="standard-textarea"
                    label="Remarks"
                    sx={{ m: 1, minWidth: "81%" }}
                    multiline
                    value={
                      authority && authority[0] == "ENTRY" && (dataSource?.status == 14 || dataSource?.status == 2)
                        ? clerkApprovalRemark
                        : headClerkApprovalRemark
                    }
                    variant="outlined"
                    onChange={(e) => {
                      authority && authority[0] == "ENTRY" && dataSource?.status == 14
                        ? setClerkApprovalRemark(e.target.value)
                        : setHeadClerkApprovalRemark(e.target.value);
                  
                    }}
                    error={!!error.remarks}
                    helperText={error?.remarks ? error.remarks.message : null}
                    // InputLabelProps={{
                    //     //true
                    //     shrink:
                    //         (watch("label2") ? true : false) ||
                    //         (router.query.label2 ? true : false),
                    // }}
                  />
                </Grid>
              </Grid> */}

          {/* Buttons Row */}

          <Grid container sx={{ padding: "10px" }}>
            {dataSource !== undefined && dataSource?.status === 2 ? (
              <>

<Grid
                  item
                  xl={1}
                  lg={1}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    marginTop: "10px",
                  }}
                > </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    color="success"
                    variant="contained"
                    type="submit"
                    disabled={
                      isOverduePayment ||
                      loggedInUser === "citizenUser" ||
                      (authority && authority.find((val) => val !== "CLERK") == undefined)
                    }
                    endIcon={<Save />}
                    onClick={()=>{setBtnSaveText("Save")}}
                  >
                    <FormattedLabel id="scheduleSiteVisit" />
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
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                   variant="outlined"
                   color="error"
                    type="submit"
                    disabled={
                      isOverduePayment ||
                      loggedInUser === "citizenUser" ||
                      (authority && authority.find((val) => val !== "CLERK") == undefined)
                    }
                   endIcon={<ExitToApp />}
                    onClick={()=>{setBtnSaveText("Revert")}}
                  >
                    <FormattedLabel id="Revert" />
                  </Button>
                </Grid>
              </>
            ) : (
              <></>
            )}

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
                color="error"
                endIcon={<ExitToApp />}
                onClick={() => {
                  //   isDeptUser
                  //     ? router.push(`/veterinaryManagementSystem/transactions/petLicense/application`)
                  //     : router.push(`/dashboard`);
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
        </form>
      </Paper>
    </>
  );
};

export default Index;
