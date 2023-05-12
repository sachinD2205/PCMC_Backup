import React, { useEffect, useState } from "react";
import router from "next/router";
import Head from "next/head";
import styles from "./honorarium.module.css";

import URLs from "../../../../URLS/urls";
import axios from "axios";
import sweetAlert from "sweetalert";
import moment from "moment";
import * as yup from "yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  Paper,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  TextareaAutosize,
  Checkbox,
  Button,
  IconButton,
  Slide,
} from "@mui/material";
import { Clear, ExitToApp, Group, Save, Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [healthInsuranceCharges, setHealthInsuranceCharges] = useState(false);
  const [corporators, setCorporators] = useState([]);
  const [year, setYear] = useState([]);
  const month = [
    { id: 1, NameEn: "January", NameMr: "जानेवारी" },
    { id: 2, NameEn: "February", NameMr: "फेब्रुवारी" },
    { id: 3, NameEn: "March", NameMr: "मार्च" },
    { id: 4, NameEn: "April", NameMr: "एप्रिल" },
    { id: 5, NameEn: "May", NameMr: "मे" },
    { id: 6, NameEn: "June", NameMr: "जून" },
    { id: 7, NameEn: "July", NameMr: "जुलै" },
    { id: 8, NameEn: "August", NameMr: "ऑगस्ट" },
    { id: 9, NameEn: "September", NameMr: "सप्टेंबर" },
    { id: 10, NameEn: "October", NameMr: "ऑक्टोबर" },
    { id: 11, NameEn: "November", NameMr: "नोव्हेंबर" },
    { id: 12, NameEn: "December", NameMr: "डिसेंबर" },
  ];
  const [fixedAmount, setFixedAmount] = useState(0);
  const [amountForMeetingAttendedInTheMonth, setAmountForMeetingAttendedInTheMonth] = useState(0);
  const [deductedOtherAmount, setDeductedOtherAmount] = useState(0);
  const [healthInsuranceChargesValue, setHealthInsuranceChargesValue] = useState(0);
  const [total, setTotal] = useState(0);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [wardDropDown, setWardDropDown] = useState([]);

  //honorariumSchema Details
  let honorariumSchema = yup.object().shape({
    selectMonth: yup.number().required("Please select a month"),
    selectYear: yup.number().required("Please select an year"),
    wardNo: yup.number().required("Please select a ward"),
    corporatorNo: yup.number().required("Please select a corporator"),
    remark: yup.string().required("Please enter a remark"),
    // dateOfHonorariumProcess: yup.string().required('Please select a date'),
    // fixedAmount: yup.number().required('Please enter a fixed amount'),
    // amountForMeetingAttendedInTheMonth: yup
    //   .number()
    //   .required('Please enter an agenda no.'),
    deductedOtherAmount: yup.number().required("Please enter some (if any) deducted amount"),
    healthInsuranceCharges: yup.number().required("Please enter health insurance charges"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    reset,
    control,
    watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(honorariumSchema),
  });

  useEffect(() => {
    setTotal(
      fixedAmount + amountForMeetingAttendedInTheMonth - deductedOtherAmount - healthInsuranceChargesValue,
    );
  }, [fixedAmount, amountForMeetingAttendedInTheMonth, deductedOtherAmount, healthInsuranceChargesValue]);

  useEffect(() => {
    //Get Ward
    axios
      .get(`${URLs.CFCURL}/master/ward/getAll`)
      .then((res) => {
        setWardDropDown(
          res.data.ward.map((j, i) => ({
            id: j.id,
            wardEn: j.wardName,
            wardMr: j.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Year
    axios
      .get(`${URLs.CFCURL}/master/year/getAll`)
      .then((res) => {
        setYear(
          res.data.year.map((j, i) => ({
            id: j.id,
            yearEn: j.year,
            yearMr: j.yearMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });

    //Get Corporators
    axios
      .get(`${URLs.MSURL}/mstDefineCorporators/getAll`)
      .then((res) => {
        setCorporators(
          res.data.corporator.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            fullNameEn: j.firstName + j.middleName + j.lastname,
            fullNameMr: j.firstNameMr + j.middleNameMr + j.lastnameMr,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });
  }, []);

  const getAttendance = () => {
    let selectedMonth = watch("selectMonth");
    let selectedYear = watch("selectYear");
    let corporatorId = watch("corporatorNo");

    var date = new Date(`${selectedYear}-${selectedMonth}- 1`);

    var fromDate = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format("YYYY-MM-DD");
    var toDate = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format("YYYY-MM-DD");
    // var fromDate = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format("DD-MM-YYYY");
    // var toDate = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format("DD-MM-YYYY");

    axios
      .get(
        `${URLs.MSURL}/trnHonorariumProcess/getByCorporateIdAndDate?corporatorNo=${corporatorId}&fromDate=${fromDate}&toDate=${toDate}`,
      )
      .then((res) => {
        if (res.data.length > 0) {
          console.log("Response: ", res.data[0]);
          setValue("amountForMeetingAttendedInTheMonth", res.data[0]["amountForMeetingAttendedInTheMonth"]);
          setValue("fixedAmount", 15000);
          setFixedAmount(15000);
          setAmountForMeetingAttendedInTheMonth(res.data[0]["amountForMeetingAttendedInTheMonth"]);
          setFetchAgain(true);
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "No amount generated for this corporator",
            icon: "warning",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
          });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });
  };

  const finalSubmit = (data) => {
    const { dateOfHonorariumProcess, ...rest } = data;

    const bodyForAPI = {
      ...rest,
      honorariumProcessDate: moment(new Date()).format("YYYY-MM-DD"),
      grandTotal: total,
    };

    console.log(bodyForAPI);

    axios.post(`${URLs.MSURL}/trnHonorariumProcess/save`, bodyForAPI).then((res) => {
      if (res.status === 200 || res.status === 201) {
        sweetAlert("Success!", "Honorarium Process for the corporator done successfully!", "success");
      }
    });
  };

  return (
    <>
      <Head>
        <title>Honorarium Process</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Honorarium Process</div>
        <form className={styles.main} onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row} style={{ justifyContent: "center" }}>
            <FormControl error={!!error.dateOfHonorariumProcess}>
              <Controller
                control={control}
                name="dateOfHonorariumProcess"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      label={
                        <span>
                          <FormattedLabel id="dateOfHonorariumProcess" />
                        </span>
                      }
                      disabled
                      value={moment(new Date()).format("YYYY-MM-DD")}
                      onChange={(date) => field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "250px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.dateOfHonorariumProcess ? error.dateOfHonorariumProcess.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <FormControl variant="standard" error={!!error.selectMonth}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="month" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "230px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="selectMonth"
                  >
                    {month &&
                      month.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.NameEn
                            : // @ts-ignore
                              value?.NameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="selectMonth"
                control={control}
              />
              <FormHelperText>{error?.selectMonth ? error.selectMonth.message : null}</FormHelperText>
            </FormControl>
            <FormControl variant="standard" error={!!error.selectYear}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="year" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "230px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="selectYear"
                  >
                    {year &&
                      year.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.yearEn
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.yearEn
                            : // @ts-ignore
                              value?.yearMr}
                        </MenuItem>
                      ))}
                    {/* <MenuItem key={1} value={2024}>
                      {language == 'en' ? '2024' : '२०२४'}
                    </MenuItem>
                    <MenuItem key={1} value={2023}>
                      {language == 'en' ? '2023' : '२०२३'}
                    </MenuItem>
                    <MenuItem key={2} value={2022}>
                      {language == 'en' ? '2022' : '२०२२'}
                    </MenuItem>
                    <MenuItem key={3} value={2021}>
                      {language == 'en' ? '2021' : '२०२१'}
                    </MenuItem>
                    <MenuItem key={4} value={2020}>
                      {language == 'en' ? '2020' : '२०२०'}
                    </MenuItem>
                    <MenuItem key={5} value={2019}>
                      {language == 'en' ? '2019' : '२०१९'}
                    </MenuItem>
                    <MenuItem key={6} value={2018}>
                      {language == 'en' ? '2018' : '२०१८'}
                    </MenuItem>
                    <MenuItem key={7} value={2017}>
                      {language == 'en' ? '2017' : '२०१७'}
                    </MenuItem>
                    <MenuItem key={8} value={2016}>
                      {language == 'en' ? '2016' : '२०१६'}
                    </MenuItem>
                    <MenuItem key={9} value={2015}>
                      {language == 'en' ? '2015' : '२०१५'}
                    </MenuItem>
                    <MenuItem key={10} value={2014}>
                      {language == 'en' ? '2014' : '२०१४'}
                    </MenuItem>
                    <MenuItem key={11} value={2013}>
                      {language == 'en' ? '2013' : '२०१३'}
                    </MenuItem>
                    <MenuItem key={12} value={2012}>
                      {language == 'en' ? '2012' : '२०१२'}
                    </MenuItem>
                    <MenuItem key={13} value={2011}>
                      {language == 'en' ? '2011' : '२०११'}
                    </MenuItem>
                    <MenuItem key={14} value={2010}>
                      {language == 'en' ? '2010' : '२०१०'}
                    </MenuItem> */}
                  </Select>
                )}
                name="selectYear"
                control={control}
              />
              <FormHelperText>{error?.selectYear ? error.selectYear.message : null}</FormHelperText>
            </FormControl>
            <FormControl variant="standard" error={!!error.wardNo}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="ward" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "230px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="wardNo"
                  >
                    {wardDropDown &&
                      wardDropDown.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.wardEn
                            : // @ts-ignore
                              value?.wardMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="wardNo"
                control={control}
              />
              <FormHelperText>{error?.wardNo ? error.wardNo.message : null}</FormHelperText>
            </FormControl>
            <FormControl variant="standard" error={!!error.corporatorNo}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="corporatorName" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "230px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setFetchAgain(false);
                    }}
                    label="corporatorNo"
                  >
                    {corporators &&
                      corporators.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.fullNameEn
                            : // @ts-ignore
                              value?.fullNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="corporatorNo"
                control={control}
              />
              <FormHelperText>{error?.corporatorNo ? error.corporatorNo.message : null}</FormHelperText>
            </FormControl>
          </div>
          <div className={styles.buttons}>
            <Button
              disabled={fetchAgain}
              variant="contained"
              endIcon={<Group />}
              onClick={() => {
                getAttendance();
              }}
            >
              <FormattedLabel id="captureAttendance" />
            </Button>
            <div className={styles.alignContainer}>
              <span className={styles.checkBoxLabel}>
                <FormattedLabel id="healthInsuranceCharges" />
              </span>
              <Checkbox
                onChange={() => {
                  setHealthInsuranceCharges(!healthInsuranceCharges);
                  if (healthInsuranceCharges) {
                    setValue("healthInsuranceCharges", 0);
                    setHealthInsuranceChargesValue(0);
                  }
                }}
              />
            </div>
          </div>
          <div className={styles.row}>
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="fixedAmountPerMonth" />}
              variant="standard"
              {...register("fixedAmount")}
              type="number"
              defaultValue={0}
              InputLabelProps={{
                // shrink: watch('fixedAmount') >= 0 ? true : false,
                shrink: true,
              }}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="amountForMeetingAttendedInTheMonth" />}
              variant="standard"
              {...register("amountForMeetingAttendedInTheMonth")}
              defaultValue={0}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="deductedOtherAmount" />}
              variant="standard"
              {...register("deductedOtherAmount")}
              onChange={(event) => {
                // @ts-ignore
                setDeductedOtherAmount(event.target.value);
              }}
              defaultValue={0}
              type="number"
              // onChange={(event) => {
              //   setTotal(total + event.target.value)
              // }}
            />
            <TextField
              disabled={!healthInsuranceCharges}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="healthInsuranceCharges" />}
              variant="standard"
              type="number"
              {...register("healthInsuranceCharges")}
              defaultValue={0}
              onChange={(event) => {
                // @ts-ignore
                setHealthInsuranceChargesValue(new Number(event.target.value));
              }}
            />
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: "70%" }}
              label={<FormattedLabel id="remark" />}
              variant="standard"
              {...register("remark")}
            />
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="grandTotal" />}
              variant="standard"
              type="number"
              {...register("grandTotal")}
              // value={
              //   watch('fixedAmount') +
              //   watch('amountForMeetingAttendedInTheMonth') +
              //   watch('deductedOtherAmount') +
              //   watch('healthInsuranceCharges')
              // }
              value={total}
              defaultValue={0}
            />
          </div>

          <div
            className={styles.row}
            style={{
              justifyContent: "center",
              margin: "10vh 0vh",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                border: "1px solid black",
                padding: 20,
                fontWeight: "bold",
              }}
            >
              DIGITAL SIGNATURE AREA
            </div>
          </div>

          <div className={styles.buttons}>
            <Button variant="contained" type="submit" endIcon={<Save />}>
              <FormattedLabel id="save" />
            </Button>
            <Button variant="outlined" color="error" endIcon={<Clear />}>
              <FormattedLabel id="clear" />
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default Index;
