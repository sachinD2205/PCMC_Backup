import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
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
  const [courtNames, setCourtNames] = useState([]);
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [disabledButtonInputState, setDisabledButtonInputState] = useState(false);
  const [dropDownValue, setDropDownValue] = useState(false);

  const caseMainType = watch("caseMainType");
  console.log("caseMainType", caseMainType);

  // Court Names
  const getCourtName = () => {
    axios.get(`${urls.LCMSURL}/master/court/getAll`).then((res) => {
      setCourtNames(
        res.data.court.map((r, i) => ({
          id: r.id,
          courtName: r.courtName,
          courtMr: r.courtMr,
        })),
      );
    });
  };

  // get Case Types
  const getCaseTypes = () => {
    axios.get(`${urls.LCMSURL}/master/caseMainType/getAll`).then((res) => {
      setCaseTypes(
        res.data.caseMainType.map((r, i) => ({
          id: r.id,
          caseMainType: r.caseMainType,
          caseMainTypeMr: r.caseMainTypeMr,
        })),
      );
    });
  };

  //get subtype based on mainTypeId
  useEffect(() => {
    const getCaseSubType = async () => {
      //  setValue("subType", "");
      if (caseMainType == null || caseMainType === "") {
        setCaseSubTypes([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.LCMSURL}/master/caseSubType/getByCaseMainType?caseMainType=${caseMainType}`,
        );
        const caseSubTypes = data.caseSubType.map((r, i) => ({
          id: r.id,
          subType: r.subType,
        }));
        console.log("caseSubTypes3232", caseSubTypes);
        setCaseSubTypes(caseSubTypes);
        // setValue("subType",caseSubTypes.find((item)=> item?.id === caseMainType).subType);
      } catch (e) {
        console.log("Error", e.message);
      }
    };
    getCaseSubType();
  }, [caseMainType]);

  // years
  const getYears = () => {
    axios.get(`${urls.CFCURL}/master/year/getAll`).then((res) => {
      setYears(res.data.year);
    });
  };

  // ------------- useEffect ------------

  useEffect(() => {
    getCourtName();
    getCaseTypes();
    // getCaseSubType();
    getYears();
    if (localStorage.getItem("disabledButtonInputState") == "true") {
      setDisabledButtonInputState(true);
    } else if (localStorage.getItem("disabledButtonInputState") == "false") {
      setDisabledButtonInputState(false);
    }
  }, []);

  useEffect(() => {}, [disabledButtonInputState]);

  // view
  return (
    <>
      {/* <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 20,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "50px",
          marginRight: "75px",
          borderRadius: 100,
        }}
      >
        <strong style={{ display: "flex", justifyContent: "center" }}>
          <FormattedLabel id="caseDetails" />
        </strong>
      </div> */}

      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 30, padding: "10px", marginTop: "20px" }}>
          {/* Case Number */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              label={<FormattedLabel id="courtCaseNo" />}
              maxRows={4}
              {...register("caseNumber")}
              error={!!errors?.caseNumber}
              helperText={errors?.caseNumber ? errors?.caseNumber?.message : null}
            />
          </Grid>

          {/* Year */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.year}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="year" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Year"
                  >
                    {years &&
                      years.map((year, index) => (
                        <MenuItem key={index} value={year?.id}>
                          {year?.year}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="year"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.year ? errors?.year?.message : null}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Court Name*/}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.court}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="courtName" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Court Name"
                  >
                    {courtNames &&
                      courtNames.map((courtName, index) => (
                        <MenuItem key={index} value={courtName?.id}>
                          {language == "en" ? courtName?.courtName : courtName?.courtMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="court"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.court ? errors?.court?.message : null}</FormHelperText>
            </FormControl>
          </Grid>

          {/* priviouseCourtName */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl variant="standard" sx={{ minWidth: 190 }} error={!!errors?.priviouseCourtName}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="prevCourtName" />
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => {
                      setDropDownValue(true);
                      field.onChange(value);
                    }}
                    label="Previous Court Name"
                  >
                    {courtNames &&
                      courtNames.map((courtName, index) => (
                        <MenuItem key={index} value={courtName?.id}>
                          {language == "en" ? courtName?.courtName : courtName?.courtMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="priviouseCourtName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.priviouseCourtName ? errors?.priviouseCourtName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Case Refrence No */}
          {/* {
            dropDownValue == true && ( */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              // readOnly={dropDownValue}
              {...register("caseReference")}
              disabled={dropDownValue == false || disabledButtonInputState}
              label={<FormattedLabel id="caseRefNo" />}
              error={!!errors?.caseReference}
              helperText={errors?.caseReference ? errors?.caseReference?.message : null}
            />
          </Grid>
          {/* )
          } */}

          {/* case Type */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.caseMainType}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="caseType" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Case Type"
                  >
                    {caseTypes &&
                      caseTypes.map((caseMainType, index) => (
                        <MenuItem key={index} value={caseMainType?.id}>
                          {language == "en" ? caseMainType?.caseMainType : caseMainType?.caseMainTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="caseMainType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.caseMainType ? errors?.caseMainType?.message : null}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Case Sub Type */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.subType}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="caseSubType" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Case Sub-Type"
                  >
                    {caseSubTypes &&
                      caseSubTypes.map((subType, index) => (
                        <MenuItem key={index} value={subType.id}>
                          {subType.subType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="subType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.subType ? errors?.subType?.message : null}</FormHelperText>
            </FormControl>
          </Grid>

          {/* Stamp No */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              label={<FormattedLabel id="stampNo" />}
              {...register("stampNo")}
              error={!!errors?.stampNo}
              helperText={errors?.stampNo ? errors?.stampNo?.message : null}
            />
          </Grid>

          {/* filing Date */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              label={<FormattedLabel id="fillingDate" />}
              sx={{ marginTop: 0 }}
              error={!!errors.fillingDate}
            >
              <Controller
                name="fillingDate"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label={
                        <span style={{ fontSize: 16 }}>
                          <FormattedLabel id="filingDate" />
                        </span>
                      }
                      disabled={disabledButtonInputState}
                      inputFormat="DD/MM/YYYY"
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                        setValue("appearanceDate", moment(date).add(30, "days"));
                      }}
                      selected={field.value}
                      center
                      renderInput={(params) => <TextField {...params} size="small" fillingDate />}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>{errors?.fillingDate ? errors?.fillingDate?.message : null}</FormHelperText>
            </FormControl>
          </Grid>

          {/* filied By */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              label={<FormattedLabel id="filedByEn" />}
              {...register("filedBy")}
              error={!!errors?.filedBy}
              helperText={errors?.filedBy ? errors?.filedBy?.message : null}
            />
          </Grid>

          {/* filied By Mr */}
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              {...register("filedByMr")}
              label={<FormattedLabel id="filedByMr" />}
              error={!!errors?.filedByMr}
              helperText={errors?.filedByMr ? errors?.filedByMr?.message : null}
            />
          </Grid>

          {/* filied Agnainst */}
          {/* <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              label={<FormattedLabel id="filedAgainstEn" />}
              {...register("filedAgainst")}
              error={!!errors?.filedAgainst}
              helperText={errors?.filedAgainst ? errors?.filedAgainst?.message : null}
            />
          </Grid> */}

          {/* filied Aginast Mr */}
          {/* <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              label={<FormattedLabel id="filedAgainstMr" />}
              {...register("filedAgainstMr")}
              error={!!errors?.filedAgainstMr}
              helperText={errors?.filedAgainstMr ? errors?.filedAgainstMr?.message : null}
            />
          </Grid> */}



         
        </Grid>



            {/* Grid container for Field Agnainst */}
            <Grid container
          style={{ marginLeft: 30, padding: "10px" }}
           >
          
              {/* filied Agnainst */}
              <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              <TextField
                disabled={disabledButtonInputState}
                label={<FormattedLabel id="filedAgainstEn" />}
                {...register("filedAgainst")}
                error={!!errors?.filedAgainst}
                helperText={errors?.filedAgainst ? errors?.filedAgainst?.message : null}
              />
            </Grid>
  
            {/* filied Aginast Mr */}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              <TextField
                disabled={disabledButtonInputState}
                label={<FormattedLabel id="filedAgainstMr" />}
                {...register("filedAgainstMr")}
                error={!!errors?.filedAgainstMr}
                helperText={errors?.filedAgainstMr ? errors?.filedAgainstMr?.message : null}
              />
            </Grid>
           
          </Grid>
        

         {/* for case Details in English*/}
         <Grid container
          style={{ marginLeft: 30, padding: "10px" }}
           >
          {/* case Details in English */}
            <Grid item 
            xl={6}
             lg={6}
             md={6}
            sm={12}
             xs={12}
            
            >
              <TextField
              style={{
                width:"90%"
              }}
                disabled={disabledButtonInputState}
                id="standard-textarea"
                label={<FormattedLabel id="caseDetails" />}
                multiline
                // rows={4}
                variant="standard"
                {...register("caseDetails")}
                error={!!errors?.caseDetails}
                helperText={errors?.caseDetails ? errors?.caseDetails?.message : null}
              />
            </Grid>

            {/* Case Details in Marathi */}
            <Grid item 
            xl={6}
             lg={6}
             md={6}
            sm={12}
             xs={12}
            
            >
              <TextField
              style={{
                width:"90%"
              }}
                disabled={disabledButtonInputState}
                id="standard-textarea"
                // label={<FormattedLabel id="caseDetails" />}
                label="Case Details in Marathi"
                multiline
                // rows={4}
                variant="standard"
                {...register("caseDetailsMr")}
                error={!!errors?.caseDetails}
                helperText={errors?.caseDetails ? errors?.caseDetails?.message : null}
              />
            </Grid>
           
          </Grid>


     

      </ThemeProvider>
    </>
  );
};

export default CaseDetails;
