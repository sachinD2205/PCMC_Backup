import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/system";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { Clear, ExitToApp, Save } from "@mui/icons-material";
import moment from "moment";
import sweetAlert from "sweetalert";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";

const index = () => {
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const [siteImages, setSiteImages] = useState();
  const [dataSource, setDataSource] = useState({});
  const [hutData, setHutData] = useState({});
  const [paymentModeDropDown, setPaymentModeDropDown] = useState([]);
  const [titleDropDown, setTitleDropDown] = useState([]);

  const language = useSelector((state) => state.labels.language);

      //get logged in user
      const user = useSelector((state) => state.user.user);

      let loggedInUser = localStorage.getItem("loggedInUser");
      console.log("loggedInUser", loggedInUser);
    
      let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));
    
      const authority = user?.menus?.find((r) => {
        return r.id == selectedMenuFromDrawer;
      })?.roles;
    
      console.log("authority", authority);
  useEffect(() => {
    getPhotopassDataById(router.query.id);
    getPaymentMode();
    getTitleData();
  }, [router.query.id]);

  useEffect(() => {
    let _res = dataSource;
    setValue("applicantTitle", _res?.applicantTitle ? _res?.applicantTitle : "-");
    setValue("applicantFirstName", _res?.applicantFirstName ? _res?.applicantFirstName : "-");
    setValue("applicantMiddleName", _res?.applicantMiddleName ? _res?.applicantMiddleName : "-");
    setValue("applicantLastName", _res?.applicantLastName ? _res?.applicantLastName : "-");
    setValue("applicantMobileNo", _res?.applicantMobileNo ? _res?.applicantMobileNo : "-");
    setValue("amount", _res?.feesApplicable ? _res?.feesApplicable : "-");
    setValue("totalAmount", _res?.feesApplicable ? _res?.feesApplicable : "-");

    getTitleData()
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

    //get Payment Mode

    const getPaymentMode = () => {
      axios.get(`${urls.EBPSURL}/master/paymentMode/getAll`).then((res) => {
          console.log("getPaymentMode", res.data);
          let temp = res.data.paymentMode;
          setPaymentModeDropDown(temp);
      });
  }

  const getPhotopassDataById = (id) => {
    if (id) {
      loggedInUser !== "citizenUser" ?
    (  axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          let result = r.data;
          //   console.log("getPhotopassDataById", result);
          setDataSource(result);
        }))
        :
       ( axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
          headers: {
            UserId: user.id,
          },
        })
        .then((r) => {
          let result = r.data;
          //   console.log("getPhotopassDataById", result);
          setDataSource(result);
        }))
    }
  };

  const handleOnSubmit = (formData) => {
   let loiData = dataSource?.trnLoiList.length !== 0 ? dataSource?.trnLoiList[dataSource?.trnLoiList.length-1] : null
   if(loiData !== null) {
    let _body = {
      title: formData.applicantTitle,
      middleName: formData.applicantMiddleName,
      firstName: formData.applicantFirstName,
      lastName: formData.applicantLastName,
      mobileNo: formData.applicantMobileNo,
      ...formData,
      loiNo: loiData?.loiNo,
      transactionRefNo: loiData?.transactionRefNo,
      transactionType: loiData?.transactionType,
      referenceKey: dataSource?.id,
      isComplete:true,
      id: loiData?.id,
      status: dataSource?.status,
      activeFlag: dataSource?.activeFlag
    }
    console.log("formData", _body);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnLoi/issuePhotopass/save`, _body, {
        headers: {
          UserId: user.id,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", `LOI payment agaist ${dataSource.applicationNo} done successfully !`, "success");
          router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
        }
      });
   }
   else{
    sweetAlert("error!", "Something went wrong", "error");
   }
   
  };

  return (
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
            <FormattedLabel id="loiDetails" />
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
            }}
          >
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="applicantTitle" />}
              // @ts-ignore
              variant="standard"
              value={watch("applicantTitle")}
              error={!!errors.applicantTitle}
              helperText={errors?.applicantTitle ? errors.applicantTitle.message : null}
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
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="firstName" />}
              // @ts-ignore
              variant="standard"
              value={watch("applicantFirstName")}
              error={!!errors.applicantFirstName}
              helperText={errors?.applicantFirstName ? errors.applicantFirstName.message : null}
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
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="middleName" />}
              // @ts-ignore
              variant="standard"
              value={watch("applicantMiddleName")}
              error={!!errors.applicantMiddleName}
              helperText={errors?.applicantMiddleName ? errors.applicantMiddleName.message : null}
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
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="lastName" />}
              // @ts-ignore
              variant="standard"
              value={watch("applicantLastName")}
              error={!!errors.applicantLastName}
              helperText={errors?.applicantLastName ? errors.applicantLastName.message : null}
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
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="mobileNo" />}
              // @ts-ignore
              variant="standard"
              value={watch("applicantMobileNo")}
              error={!!errors.applicantMobileNo}
              helperText={errors?.applicantMobileNo ? errors.applicantMobileNo.message : null}
            />
          </Grid>

          {/* transaction date & time */}

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
            <Controller
              control={control}
              name="transactionTime"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        size="small"
                        variant="standard"
                        fullWidth
                        sx={{ width: "250px" }}
                        error={errors.transactionTime}
                        helperText={errors?.transactionTime ? errors.transactionTime.message : null}
                      />
                    )}
                    label={<FormattedLabel id="transactionDateTime" required />}
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                    defaultValue={null}
                    inputFormat="DD-MM-YYYY hh:mm:ss"
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          {/* amount */}
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
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="amount" />}
              // label={labels["amount"]}
              // @ts-ignore
              variant="standard"
              value={watch("amount")}
              InputLabelProps={{
                shrink: router.query.id || watch("amount") ? true : false,
              }}
              error={!!errors.amount}
              helperText={errors?.amount ? errors.amount.message : null}
            />
          </Grid>

          {/* totalAmount */}
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
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="totalAmount" />}
              // label={labels["totalAmount"]}
              // @ts-ignore
              variant="standard"
              value={watch("totalAmount")}
              InputLabelProps={{
                shrink: router.query.id || watch("totalAmount") ? true : false,
              }}
              error={!!errors.totalAmount}
              helperText={errors?.totalAmount ? errors.totalAmount.message : null}
            />
          </Grid>

          {/* receivedAmount */}
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
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="receivedAmount" />}
              variant="standard"
              {...register("receivedAmount")}
              InputLabelProps={{
                shrink: router.query.id || watch("receivedAmount") ? true : false,
              }}
              error={!!errors.receivedAmount}
              helperText={errors?.receivedAmount ? errors.receivedAmount.message : null}
            />
          </Grid> */}

          {/* paymentMode */}
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
              disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!errors.paymentModeKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="paymentModeKey" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="paymentModeKey"
                  >
                    {paymentModeDropDown &&
                      paymentModeDropDown.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            value.id
                          }
                        >
                          {language == "en"
                            ? 
                              value?.paymentMode
                            :
                              value?.paymentModeMr
                            }
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="paymentModeKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.paymentModeKey ? errors.paymentModeKey.message : null}</FormHelperText>
            </FormControl>
          </Grid> */}

          {/* paymentAmount */}
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
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="paymentAmount" />}
              variant="standard"
              {...register("paymentAmount")}
              InputLabelProps={{
                shrink: router.query.id || watch("paymentAmount") ? true : false,
              }}
              error={!!errors.paymentAmount}
              helperText={errors?.paymentAmount ? errors.paymentAmount.message : null}
            />
          </Grid> */}

           {/* transactionStatus */}
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
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="transactionStatus" />}
              variant="standard"
              {...register("transactionStatus")}
              InputLabelProps={{
                shrink: router.query.id || watch("transactionStatus") ? true : false,
              }}
              error={!!errors.transactionStatus}
              helperText={errors?.transactionStatus ? errors.transactionStatus.message : null}
            />
          </Grid> */}

           {/* remarks */}
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
              label={<FormattedLabel id="remarks" />}
              // label={labels["remarks"]}
              // @ts-ignore
              variant="standard"
              {...register("remarks")}
              InputLabelProps={{
                shrink: router.query.id || watch("remarks") ? true : false,
              }}
              error={!!errors.remarks}
              helperText={errors?.remarks ? errors.remarks.message : null}
            />
          </Grid>
        </Grid>

        <Grid container sx={{ padding: "10px" }}>
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
              marginTop: "10px",
            }}
          >
            <Button color="success" variant="contained" type="submit" endIcon={<Save />}>
              <FormattedLabel id="save" />
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
              marginTop: "10px",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                router.push({
                  pathname:
                    "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
                  query: {
                    id: router.query.id,
                  },
                })
              }
              endIcon={<Clear />}
            >
              <FormattedLabel id="back" />
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
              marginTop: "10px",
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
      </form>
    </Paper>
  );
};

export default index;
