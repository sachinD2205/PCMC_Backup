import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import Stack from "@mui/material/Stack";
import { Box, Collapse, OutlinedInput } from "@mui/material";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import * as yup from "yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
// import { useEffect, useState } from "react";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/addHearing.module.css";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TextFields } from "@mui/icons-material";
import urls from "../../../../URLS/urls";

const HearingDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
    
  const router = useRouter();
  const [hearingDate, setHearingDate] = React.useState(null);
  const [nextHearingDate, setNextHearingDate] = React.useState(null);
  const [interimOrderDate, setInterimOrderDate] = React.useState(null);
  const [finalOrderDate, setFinalOrderDate] = React.useState(null);
  const [courtNames, setCourtNames] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseStages, setCaseStages] = useState([]);
  const [caseNumbers, setCaseNumbers] = useState([]);
  const [selectedCaseNo, setSelectedCaseNo] = useState(""); //for filter
  const [showDatePicker, setShowDatePicker] = useState([]);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState();


  // get Court Name

  const getCourtName = () => {
    axios.get(`${urls.LCMSURL}/master/court/getCourtData`).then((res) => {
      setCourtNames(
        res.data.map((r, i) => ({
          id: r.id,
          courtName: r.courtName,
        }))
      );
    });
  };

  // get Case Stages

  const getCaseStages = () => {
    axios.get(`${urls.LCMSURL}/master/caseStages/getAll`).then((res) => {
      setCaseStages(
        res.data.caseStages.map((r, i) => ({
          id: r.id,
          caseStages: r.caseStages,
          caseStagesMr: r.caseStagesMr,
        }))
      );
    });
  };

  // get Case Type

  const getCaseTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseMainType/getAll`).then((res) => {
      setCaseTypes(
        res.data.caseMainType.map((r, i) => ({
          id: r.id,
          caseMainType: r.caseMainType,
        }))
      );
    });
  };

  const getCourtCaseNumber = () => {
    // alert("sdf")
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`)
      .then((res) => {
        // console.log("res", res)
        setCaseNumbers(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            // courtCaseNumber: r.courtCaseNumber,
            caseNumber: r.caseNumber,
          }))
        );
      });
  };


  useEffect(() => {
    if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
      console.log("Data------", router.query);
      setValue("caseMainType", router.query.caseMainType);
      setValue("filingDate", router.query.filingDate);
      setValue("courtCaseNumber", router.query.courtCaseNumber);
      setValue("caseNumber", router.query.caseNumber);
      // reset(router.query);
    }
  }, []);


  useEffect(() => {
    getCaseTypes();
    getCaseStages();
    getCourtCaseNumber();
  }, []);

  return (
    <>
      {/* <Box sx={{ p: 3 }} boxShadow={2}> */}
      {/* Title */}

      <Box
        style={{
          display: "flex",
          // justifyContent: "center",
          // marginLeft:'50px',
          paddingTop: "10px",
          marginTop: "20px",

          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Typography
          style={{
            display: "flex",
            marginLeft: "100px",
            color: "white",
            // justifyContent: "center",
          }}
        >
          <h2>
            <FormattedLabel id="hearingDetails" />
          </h2>
        </Typography>
      </Box>

      <Divider />

      {/* 1st Row */}
      <Grid
        container
        sx={{
          // marginLeft: "70px",
          marginTop: "5px",
          marginTop: "30px",

          // padding: "30px",
        }}
        // columnSpacing={{  sm: 2, md: 3 }}
      >
        {/* Case Number */}
        <Grid
          item
          //  xs={0.7}
          xl={0.7}
          lg={0.7}
        ></Grid>

        <Grid item xl={3} lg={3} md={4} xs={12} sm={6}>
          {/* For New Selector */}

          <FormControl
            fullWidth
            // sx={{ m: 1, minWidth: 200 }}
            // size="small"
            // sx={{ width: "65%" }}
            // size=""
            variant="standard"
            error={!!errors.caseNumber}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="courtCaseNo" />
            </InputLabel>

            <Controller
              render={({ field }) => (
                <Select
                  // disabled
                  // size="small"
                  disabled={router?.query?.pageMode === "View"}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Case Number"
                >
                  {caseNumbers &&
                    caseNumbers.map((caseNumber, index) => (
                      <MenuItem key={index} value={caseNumber.id}>
                        {caseNumber.caseNumber}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="caseNumber"
              control={control}
              defaultValue=""
            />

            <FormHelperText>
              {errors?.caseNumber ? errors.caseNumber.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={0.8} xl={0.8} lg={0.8} md={1}></Grid>

        {/* Case Type */}

        <Grid
          item
          xs={12}
          xl={3}
          lg={3}
          sm={6}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
        >
          <FormControl
            fullWidth
            // sx={{ m: 1, minWidth: 200 }}
            // size="small"
            // sx={{ width: "55%" }}
            // size="small"
            variant="standard"
            error={!!errors?.caseMainType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="caseType" />
            </InputLabel>

            <Controller
              render={({ field }) => (
                <Select
                  // disabled
                  disabled={router?.query?.pageMode === "View"}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Case Type"
                >
                  {caseTypes &&
                    caseTypes.map((caseMainType, index) => (
                      <MenuItem key={index} value={caseMainType.id}>
                        {caseMainType.caseMainType}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="caseMainType"
              control={control}
              defaultValue=""
            />
              <FormHelperText>
                        {errors?.caseMainType
                          ? errors?.caseMainType?.message
                          : null}
                      </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={0.8} xl={0.8} lg={0.8}></Grid>

        {/* Filing Date */}

        <Grid
          item
          xs={12}
          xl={3}
          lg={3}
          sm={6}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
        >
          <FormControl
            fullWidth
            // sx={{ m: 1, minWidth: 200 }}
            // size="small"
            //  style={{ marginTop: 10 }}
            // sx={{ width: "55%" }}
            // size="small"
            variant="standard"
           error={!!errors.filingDate}
          >
            <Controller
              control={control}
              name="filingDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    // disabled
                    disabled={router?.query?.pageMode === "View"}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="filingDate" />
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
                        variant="standard"
                        {...params}
                        // sx={{ width: 250 }}
                        // size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
              <FormHelperText>
                        {errors?.filingDate
                          ? errors?.filingDate?.message
                          : null}
                      </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={0.7} xl={0.7} lg={0.7}></Grid>
      </Grid>

      {/* 2nd Row */}
      <Grid
        container
        sx={{
          // marginLeft: "70px",
          marginTop: "5px",
          marginTop: "30px",
          // padding: "30px",
        }}
      >
        <Grid
          item
          //  xs={0.7}
          xl={0.7}
          lg={0.7}
        ></Grid>
        <Grid item xl={3} lg={3} md={4} xs={12} sm={6}>
          <FormControl
            fullWidth
            disabled={router?.query?.pageMode === "View"}
            // style={{ marginTop: 10 }}
            // sx={{ width: "55%" }}
            // size="small"
            variant="standard"
            error={!!errors?.hearingDate}
          >
            <Controller
              disabled={router?.query?.pageMode === "View"}
              control={control}
              name="hearingDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled={router?.query?.pageMode === "View"}
                    // label="Hearing Date"
                    label={<FormattedLabel id="hearingDate"></FormattedLabel>}
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    selected={field.value}
                    renderInput={(params) => (
                      <TextField
                        disabled={router?.query?.pageMode === "View"}
                        variant="standard"
                        fullWidth
                        // style={{ marginTop: 10 }}
                        // sx={{ width: 249 }}
                        // InputProps={{ style: { fontSize: 15 } }}
                        // InputLabelProps={{ style: { fontSize: 15 } }}
                        {...params}
                        // fullWidth
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
              <FormHelperText>
                        {errors?.hearingDate
                          ? errors?.hearingDate?.message
                          : null}
                      </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={0.8} xl={0.8} lg={0.8} md={1}></Grid>

        {/* Case Status */}
        <Grid
          item
          xs={12}
          xl={3}
          lg={3}
          sm={6}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
        >
          {/* New Code */}

          <FormControl
            fullWidth
            // sx={{ width: "55%" }}
            //  size="small"
            error={!!errors?.caseStatus}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="caseStatus" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={router?.query?.pageMode === "View"}
                  variant="standard"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label={<FormattedLabel id="caseStatus" />}
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                    setShowDatePicker(value.target.value);
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {[
                    { id: 1, caseStatus: "Running" },
                    { id: 2, caseStatus: "Intrim Order" },
                    { id: 3, caseStatus: "Final Order" },
                    // { id: 4, caseStatus: "Case Dissmiss" },
                  ].map((menu, index) => {
                    return (
                      <MenuItem key={index} value={menu.id}>
                        {menu.caseStatus}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
              name="caseStatus"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
                        {errors?.caseStatus
                          ? errors?.caseStatus?.message
                          : null}
                      </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={0.8} xl={0.8} lg={0.8}></Grid>

        {/* Case Stages */}
        <Grid
          item
          xs={12}
          xl={3}
          lg={3}
          sm={6}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
        >
          <FormControl
            fullWidth
            // sx={{ width: "55%" }}
            // size="small"
            variant="standard"
            error={!!errors?.caseStage}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="caseStagesEn" />
            </InputLabel>

            <Controller
              render={({ field }) => (
                <Select
                  // sx={{ width: "55%" }}
                  disabled={router?.query?.pageMode === "View"}
                  //   sx={{ width: 500 }}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Case Stages"
                >
                  {caseStages &&
                    caseStages.map((caseStages, index) => (
                      <MenuItem key={index} value={caseStages.id}>
                        {caseStages.caseStages}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="caseStage"
              //   control={control}
              defaultValue=""
            />
              <FormHelperText>
                        {errors?.caseStage
                          ? errors?.caseStage?.message
                          : null}
                      </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      {/* 3rd Row */}
      <Grid
        container
        sx={{
          // marginLeft: "70px",
          marginTop: "5px",
          marginTop: "10px",

          // padding: "30px",
        }}
        // columnSpacing={{  sm: 2, md: 3 }}
      >
        <Grid
          item
          //  xs={0.7}
          xl={0.7}
          lg={0.7}
        ></Grid>
        <Grid item xl={3} lg={3} md={4} xs={12} sm={6}>
          {showDatePicker === 1 && (
            <FormControl
              fullWidth
              style={{ marginTop: 10 }}
              // sx={{ width: "60%" }}
              // size="small"
              variant="standard"
              error={!!errors?.nextHearingDate}
            >
              <Controller
                control={control}
                name="nextHearingDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={router?.query?.pageMode === "View"}
                      label="Next Hearing Date"
                      // InputProps={{ style: { fontSize: 5 } }}
                      // InputLabelProps={{ style: { fontSize: 50 } }}
                      // size="small"
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      renderInput={(params) => (
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          variant="standard"
                          style={{ marginTop: 10 }}
                          // sx={{ width: "60%" }}
                          // InputLabelProps={{ style: { fontSize: 13 } }}
                          InputProps={{ style: { fontSize: 20 } }}
                          InputLabelProps={{ style: { fontSize: 13 } }}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
                <FormHelperText>
                        {errors?.nextHearingDate
                          ? errors?.nextHearingDate?.message
                          : null}
                      </FormHelperText>
            </FormControl>
          )}

          {showDatePicker === 2 && (
            <FormControl
              fullWidth
              style={{ marginTop: 10 }}
              // sx={{ width: "60%" }}
              // size="small"
              variant="standard"
              error={!!errors?.interimOrderDate}
            >
              <Controller
                control={control}
                name="interimOrderDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Interim Order Date"
                      // InputProps={{ style: { fontSize: 5 } }}
                      // InputLabelProps={{ style: { fontSize: 50 } }}
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      renderInput={(params) => (
                        <TextField
                          variant="standard"
                          // sx={{ width: "60%" }}
                          // InputLabelProps={{ style: { fontSize: 13 } }}
                          InputProps={{ style: { fontSize: 20 } }}
                          InputLabelProps={{ style: { fontSize: 13 } }}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
                 <FormHelperText>
                        {errors?.interimOrderDate
                          ? errors?.interimOrderDate?.message
                          : null}
                      </FormHelperText>
            </FormControl>
          )}

          {showDatePicker === 3 && (
            <FormControl
              fullWidth
              style={{ marginTop: 10 }}
              // sx={{ width: "55%" }}
              // size="small"
              variant="standard"
              error={!!errors?.finalOrderDate}
            >
              <Controller
                control={control}
                name="finalOrderDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Final Order Date"
                      // InputProps={{ style: { fontSize: 5 } }}
                      // InputLabelProps={{ style: { fontSize: 50 } }}
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      renderInput={(params) => (
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          variant="standard"
                          // sx={{ width: "55%" }}
                          InputProps={{ style: { fontSize: 20 } }}
                          InputLabelProps={{ style: { fontSize: 13 } }}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
                <FormHelperText>
                        {errors?.finalOrderDate
                          ? errors?.finalOrderDate?.message
                          : null}
                      </FormHelperText>
            </FormControl>
          )}
        </Grid>

        <Grid
          item
          xs={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* {
            showDatePicker === 2 &&

            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Interim Order Date"
              // InputProps={{ style: { fontSize: 5 } }}
              // InputLabelProps={{ style: { fontSize: 50 } }}
              value={interimOrderDate}
              onChange={(newValue) => {
                setInterimOrderDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  sx={{ width: "55%" }}
                  // InputLabelProps={{ style: { fontSize: 13 } }}
                  InputProps={{ style: { fontSize: 20 } }}
                  InputLabelProps={{ style: { fontSize: 13 } }}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>

          } */}
        </Grid>

        <Grid
          item
          xs={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* {
            showDatePicker ===3 &&
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Final Order Date"
              // InputProps={{ style: { fontSize: 5 } }}
              // InputLabelProps={{ style: { fontSize: 50 } }}
              value={finalOrderDate}
              onChange={(newValue) => {
                setFinalOrderDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  sx={{ width: "55%" }}
                  InputProps={{ style: { fontSize: 20 } }}
                  InputLabelProps={{ style: { fontSize: 13 } }}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>

          } */}
        </Grid>
      </Grid>

      <Grid
        container
        sx={{
          // marginLeft: "70px",
          marginTop: "5px",
          marginTop: "30px",

          // padding: "30px",
        }}
        // columnSpacing={{  sm: 2, md: 3 }}
      >
        <Grid
          item
          //  xs={0.7}
          xl={0.7}
          lg={0.7}
        ></Grid>
        <Grid
          item
          // xs={11}
          xl={11}
          xs={11}
          lg={11}
          md={11}
          sm={11}
        >
          <TextField
            // fullWidth
            disabled={router?.query?.pageMode === "View"}
            variant="standard"
            sx={{ width: "100%" }}
            id="outlined-multiline-flexible"
            label={<FormattedLabel id="remarksEn" />}
            multiline
            // size="small"

            maxRows={4}
            // value={value}
            // onChange={handleChange}'
            error={!!errors?.remark}
            helperText={
              errors?.remark ? errors?.remark?.message : null
            }

            {...register("remark")}
            InputLabelProps={{
              //true
              shrink:
                (watch("remark") ? true : false) ||
                (router.query.remark ? true : false),
            }}
          />
        </Grid>
      </Grid>

      {/* Remarks  in Marathi */}

      <Grid
        container
        sx={{
          // marginLeft: "70px",
          marginTop: "5px",
          marginTop: "30px",

          // padding: "30px",
        }}
        // columnSpacing={{  sm: 2, md: 3 }}
      >
        <Grid
          item
          //  xs={0.7}
          xl={0.7}
          lg={0.7}
        ></Grid>
        <Grid
          item
          // xs={11}
          xl={11}
          xs={11}
          lg={11}
          md={11}
          sm={11}
        >
          <TextField
            disabled={router?.query?.pageMode === "View"}
            variant="standard"
            sx={{ width: "100%" }}
            id="outlined-multiline-flexible"
            label={<FormattedLabel id="remarksMr" />}
            multiline
            // size="small"
            // fullWidth
            maxRows={4}
            // value={value}
            // onChange={handleChange}
            {...register("remarkMr")}
            error={!!errors?.remarkMr}
            helperText={
              errors?.remarkMr ? errors?.remarkMr?.message : null
            }
            InputLabelProps={{
              //true
              shrink:
                (watch("remarkMr") ? true : false) ||
                (router.query.remarkMr ? true : false),
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default HearingDetails;
