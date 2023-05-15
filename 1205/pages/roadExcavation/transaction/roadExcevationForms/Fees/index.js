import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useState } from "react";
import theme from "../../../../../theme";
import * as yup from "yup";
import router from "next/router";

import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { yupResolver } from "@hookform/resolvers/yup";

import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { roadExcavationCitizenSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import FileTable from "../../../../../components/roadExcevation/FileUpload/FileTable"

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    resolver: yupResolver(yup.object().shape({ ...roadExcavationCitizenSchema })),
    // mode: "onSubmit",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "witnesses", // unique name for your Field Array
  });

  console.log(":fields", fields);
  const language = useSelector((store) => store.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);


  let loggedInUser = localStorage.getItem("loggedInUser");
 
  //clear

  const [btnSaveText, setbtnSaveText] = useState("Save");
  const [paymentMode, setPaymentMode] = useState([]);
  const [paymentType, setPaymentType] = useState([]);
  const clearButton = () => {
    console.log("clear");
    reset({
      ...resetValuesClear,
    });
  };


  //common Api start
  const getPaymentMode = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    axios
      .get(`${urls.CFCURL}/master/paymentMode/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      }).then((r) => {
        let result = r.data.paymentMode;
        setPaymentMode(result)
        console.log("paymentMode",r);
     
    })
    }
  const getPaymentType = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      }).then((r) => {
        let result = r.data.paymentType;
        setPaymentType(result)
      console.log("paymentType",result);
     
    })
    }
    useEffect(()=>{
        getPaymentMode()
        getPaymentType()
    },[])
  //common Api end

  // Reset Values Clear
  const resetValuesClear = {
    companyName: "",
    roadType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    landlineNo: "",
    mobileNo: "",
    email: "",
    eligibleForSchemeYn: "",
    mainScheme: "",
    subScheme: "",
    permitPeriod: "",
    scopeOfWork: "",
    startLat: "",
    endLat: "",
    startLng: "",
    endLng: "",
    locationSameAsPcmcOrderYn: "",
    locationRemark: "",
    lengthSameAsPcmcOrderYn: "",
    lengthRemark: "",
    depthSameAsPcmcOrderYn: "",
    depthRemark: "",
    widthSameAsPcmcOrderYn: "",
    widthRemark: "",
  };

 
  //for date start
  const date = new Date();

let currentDay= String(date.getDate()).padStart(2, '0');

let currentMonth = String(date.getMonth()+1).padStart(2,"0");

let currentYear = date.getFullYear();

// we will display the date as DD-MM-YYYY 

let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;

console.log("The current date is " + currentDate); 
  //for date end

  let onSubmitFunc = (formData) => {
    console.log("onSubmitFunc", formData);
    let body={
        "id":router.query.id,
        "role":"LOI_COLLECTION",
        "trnPaymentCollectionDao":{

            ...formData,
        }
    }
    if (btnSaveText === "Save") {
      if (loggedInUser === "citizenUser") {
        const tempData = axios
          .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/saveApprove`, body, {
            headers: {
              UserId: user.id,
            },
          })
          .then((res) => {
            if (res.status == 201 || res.status == 200) {
              sweetAlert("Saved!", "Payment Details Get !", "success");
              router.push("/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails");
            }
          });
      } else {
        const tempData = axios
          .post(`${urls.RENPURL}/trnExcavationRoadCpmpletion/save`, body, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              sweetAlert("Saved!", "Road Excevation Application Saved successfully !", "success");
              // router.push("/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails");
            }
          });
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          margin: "30px",
          marginBottom: "100px",
        }}
        elevation={2}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>
              {/* <FormattedLabel id="RoadExcavation_NocPermission" /> */}
              Collection-(Fees/Penalty)
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitFunc)}>
          <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                justifyContent:"end",
                marginRight:"100px"
            }}
            >
             <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="date"
                  name="date"
                //   label={<FormattedLabel id="date" />}
                label="Date"
                  variant="standard"
                //   {...register("date")}
                value={currentDate}
                  error={!!errors.date}
                  helperText={errors?.date ? errors.date.message : null}
                />
             
            </Grid>

            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              

            
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="applicationNo"
                  name="applicationNo"
                //   label={<FormattedLabel id="applicationNo" />}
                label="application / LOI number"
                  variant="standard"
                //   {...register("applicationNo")}
                  error={!!errors.applicationNo}
                  helperText={errors?.applicationNo ? errors.applicationNo.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
             
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <FormControl xs={12}
                            sm={6}
                            md={4} error={!!errors.wardId} >
                            <InputLabel>Service Name</InputLabel>
                            <Controller
                              render={({ field }) => (
                                 <Select
                                name="Service Name"
                                  sx={{ width: 200 }}
                                >
                                  
                                      <MenuItem value="ServiceName1">
                                      ServiceName1
                                      </MenuItem>
                                      <MenuItem value="ServiceName2">
                                      ServiceName2
                                      </MenuItem>
                                    
                                </Select>
                              )}
                              name="RoadTypeId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>{errors?.RoadTypeId ? errors.RoadTypeId.message : null}</FormHelperText>
                          </FormControl>
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="applicantNameAdd"
                  name="applicantNameAdd"
                  label="applicantNameAdd" 
                  variant="standard"
                //   {...register("applicantNameAdd")}
                  error={!!errors.applicantNameAdd}
                  helperText={errors?.applicantNameAdd ? errors.applicantNameAdd.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="applicationDetails"
                  name="applicationDetails"
                  label="applicationDetails"
                //   label={<FormattedLabel id="applicationDetails" />}
                  variant="standard"
                //   {...register("applicationDetails")}
                  error={!!errors.applicationDetails}
                  helperText={errors?.applicationDetails ? errors.applicationDetails.message : null}
                />
              </Grid>

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  sx={{ width: 250 }}
                  id="duePendingAmount"
                  name="duePendingAmount"
                //   label={<FormattedLabel id="duePendingAmount" />}
                label="Dues Pending Amount"
                  variant="standard"
                //   {...register("duePendingAmount")}
                  error={!!errors.duePendingAmount}
                  helperText={errors?.duePendingAmount ? errors.duePendingAmount.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

           
          
            
              
            </Grid>

            {/* /////////////////////////////////////////////////////////////////////////////////////// */}
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
                border:"solid 2px black",
                marginTop:"20px"
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl xs={12}
                  sm={6}
                  md={4} error={!!errors.wardId}>
                  <InputLabel>chargeTypeName</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        variant="standard"
                      >

                        <MenuItem value={"chargeTypeName1"}>chargeTypeName1</MenuItem>
                        <MenuItem value={"chargeTypeName2"}>chargeTypeName2</MenuItem>
                        <MenuItem value={"chargeTypeName3"}>chargeTypeName3</MenuItem>
                        <MenuItem value={"chargeTypeName4"}>chargeTypeName4</MenuItem>
                      </Select>
                    )}
                    name="chargeTypeName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.chargeTypeName ? errors.chargeTypeName.message : null}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              > <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  label={<FormattedLabel id="amount" />}
                  // variant="outlined"
                  variant="standard"
                //   {...register("amount")}
                  error={!!errors.amount}
                  helperText={errors?.amount ? errors.amount.message : null}
                /></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              > <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  label={<FormattedLabel id="totalAmount" />}
                  // variant="outlined"
                  variant="standard"
                //   {...register("totalAmount")}
                  error={!!errors.totalAmount}
                  helperText={errors?.totalAmount ? errors.totalAmount.message : null}
                /></Grid>
            </Grid>
             
           
            {/* ////////////////////////////////////////// */}
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
                 <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl xs={12}
                            sm={6}
                            md={4} error={!!errors.wardId} >
                            <InputLabel>Payment Type</InputLabel>
                            <Controller
                              render={({ field }) => (
                                 <Select
                                    name="paymentType"
                                         sx={{ width: 200 }}
                                       {...register("paymentType")}

                                >
                                  {paymentType &&
                                    paymentType.map((paymentType, index) => (
                                      <MenuItem key={index} value={paymentType.id}>
                                        {paymentType.paymentType
}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="paymentType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>{errors?.paymentType ? errors.paymentType.message : null}</FormHelperText>
                          </FormControl>
              </Grid>
                 <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl xs={12}
                            sm={6}
                            md={4} error={!!errors.wardId} >
                            <InputLabel>Payment Mode</InputLabel>
                            <Controller
                              render={({ field }) => (
                                 <Select
                                    name="paymentMode"
                                         sx={{ width: 200 }}
                                         {...register("paymentMode")}
                                >
                                  {paymentMode &&
                                    paymentMode.map((paymentMode, index) => (
                                      <MenuItem key={index} value={paymentMode.id}>
                                        {paymentMode.paymentMode
}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="PaymentMode"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>{errors?.PaymentMode ? errors.PaymentMode.message : null}</FormHelperText>
                          </FormControl>
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                //   label={<FormattedLabel id="paymentremark" />}
                label="Remark"
                  // variant="outlined"
                  variant="standard"
                  {...register("paymentremark")}
                  error={!!errors.paymentremark}
                  helperText={errors?.paymentremark ? errors.paymentremark.message : null}
                />
              </Grid>
              
              </Grid>

            
            
                  
            <Grid
              container
              xs
              md={6}
              mdOffset={3}
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid item>
                <Button type="submit" variant="outlined">
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={clearButton}>
                  Clear
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined">Exit</Button>
              </Grid>
            </Grid>
            {/* //////////////////////////////////// */}
          </form>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
