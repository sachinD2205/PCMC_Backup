import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import styles from "./view.module.css";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import axios from "axios";
import index from "../../master/caseStages";
import { unstable_createStyleFunctionSx } from "@mui/system";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";

const CaseDetails = () => {
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

  const language = useSelector((state) => state.labels.language);
  const [caseSubTypes, setCaseSubTypes] = useState([]);

  const [caseNumbers, setCaseNumbers] = useState([]);

  useEffect(() => {
    // //alert("df")
    // console.log("router?.query.pageMode",router?.query.pageMode);
    // if(router?.query.pageMode==='Edit'){
    //   setValue("courtCaseNumber",router?.query?.courtCaseNumber);
    // }else{
    getCourtCaseNumber();
    // }

    getCourtName();
    getCaseTypes();
    getCaseSubType();
    getYears();
  }, []);

  const getCourtCaseNumber = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`)
      .then((res) => {
        setCaseNumbers(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            // courtCaseNumber: r.courtCaseNumber,
            caseNumber:r.caseNumber
          }))
        );
      });
  };

  // get Court Name

  const [courtNames, setCourtNames] = useState([]);

  const getCourtName = () => {
    axios.get(`${urls.LCMSURL}/master/court/getAll`).then((res) => {
      setCourtNames(
        res.data.court.map((r, i) => ({
          id: r.id,
          // caseMainType: r.caseMainType,
          courtName: r.courtName,
          courtMr: r.courtMr,
        }))
      );
    });
  };

  // get Case Type
  const [caseTypes, setCaseTypes] = useState([]);

  const getCaseTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseMainType/getAll`).then((res) => {
      setCaseTypes(
        res.data.caseMainType.map((r, i) => ({
          id: r.id,
          // caseMainType: r.caseMainType,
          caseMainType: r.caseMainType,
          caseMainTypeMr: r.caseMainTypeMr,
        }))
      );
    });
  };

  const getCaseSubType = () => {
    axios.get(`${urls.LCMSURL}/master/caseSubType/getAll`).then((res) => {
      setCaseSubTypes(
        res.data.caseSubType.map((r, i) => ({
          id: r.id,
          subType: r.subType,
        }))
      );
    });
  };

  const [years, setYears] = useState([]);

  const getYears = () => {
    axios.get(`${urls.CFCURL}i/master/year/getAll`).then((res) => {
      setYears(res.data.year);
    });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          style={{
            display: "flex",
            // justifyContent: "center",
            paddingTop: "10px",
            marginTop: "30px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <Typography style={{ marginLeft: "100px" }}>
            <h2>
              <FormattedLabel id="caseDetails" />
            </h2>
          </Typography>
        </Box>

        <Divider />

        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.courtCaseNumber}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* {<FormattedLabel id="courtName" />} */}
                Court Case Number
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    //   sx={{ width: 500 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    // label="Case Type"
                    label="Court Case Number"
                  >
                    {caseNumbers &&
                      caseNumbers.map((caseNumber, index) => (
                        <MenuItem key={index} value={caseNumber.id}>
                          {caseNumber.caseNumber}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="courtCaseNumber"
                //   control={control}
                defaultValue=""
              />

              <FormHelperText>
                {errors?.courtCaseNumber
                  ? errors.courtCaseNumber.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* courtName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.court}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="courtName" />}
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    //   sx={{ width: 500 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    // label="Case Type"
                    label="Court Name"
                  >
                    {courtNames &&
                      courtNames.map((courtName, index) => (
                        <MenuItem
                          key={index}
                          // @ts-ignore
                          value={courtName.id}
                        >
                          {/* @ts-ignore */}
                          {/* {title.title} */}
                          {language == "en"
                            ? courtName?.courtName
                            : courtName?.courtMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="court"
                //   control={control}
                defaultValue=""
              />
            </FormControl>

            <FormHelperText>
              {errors?.court ? errors.court.message : null}
            </FormHelperText>
          </Grid>

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.caseType}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="caseType" />
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    //   sx={{ width: 500 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Case Type"
                  >
                    {caseTypes &&
                      caseTypes.map((caseMainType, index) => (
                        <MenuItem
                          key={index}
                          // @ts-ignore
                          value={caseMainType.id}
                        >
                          {/* @ts-ignore */}
                          {/* {title.title} */}
                          {language == "en"
                            ? caseMainType?.caseMainType
                            : caseMainType?.caseMainTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="caseType"
                //   control={control}
                defaultValue=""
              />
            </FormControl>

            <FormHelperText>
              {errors?.caseType ? errors.caseType.message : null}
            </FormHelperText>
          </Grid>

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 0 }}
             error={!!errors.fillingDate}>
              <Controller
                //   control={control}
                name="filingDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      // disabled
                      disabled={router?.query?.pageMode === "View"}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16, marginTop: 2 }}>
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
                          {...params}
                          size="small"
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                            },

                            //true
                            shrink:
                              (watch("filingDate") ? true : false) ||
                              (router.query.filingDate ? true : false),
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />

              <FormHelperText>
                {errors?.filingDate ? errors.filingDate.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              //// required
              disabled={router?.query?.pageMode === "View"}
              label={<FormattedLabel id="filedByEn" />}
              {...register("filedBy")}
              error={!!errors.filedBy}
              helperText={errors?.filedBy ? errors.filedBy.message : null}
              InputLabelProps={{
                //true
                shrink:
                  (watch("filedBy") ? true : false) ||
                  (router.query.filedBy ? true : false),
              }}
            />
          </Grid>

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              //// required
              disabled={router?.query?.pageMode === "View"}
              label={<FormattedLabel id="filedByMr" />}
              {...register("filedByMr")}

              error={!!errors.filedByMr}
              helperText={errors?.filedByMr ? errors.filedByMr.message : null}
              InputLabelProps={{
                //true
                shrink:
                  (watch("filedByMr") ? true : false) ||
                  (router.query.filedByMr ? true : false),
              }}
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default CaseDetails;
