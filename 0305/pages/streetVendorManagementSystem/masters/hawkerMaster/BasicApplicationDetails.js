import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import Failed from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

/** Authore - Sachin Durge */
// BasicApplicationDetails
const BasicApplicationDetails = () => {
  const {
    control,
    register,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [areaNames, setAreaName] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [hawkingZoneNames, setHawkingZoneName] = useState([]);

  // areas
  const getAreaName = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setAreaName(
            r.data.area.map((row) => ({
              id: row.id,
              areaName: row.areaName,
              areaNameMr: row.areaNameMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // serviceNames
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // hawkingZones
  const getHawkingZoneName = () => {
    axios
      .get(`${urls.HMSURL}/hawingZone/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setHawkingZoneName(
            r.data.hawkingZone.map((row) => ({
              id: row.id,
              hawkingZoneName: row.hawkingZoneName,
              hawkingZoneNameMr: row.hawkingZoneNameMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  // useEffect
  useEffect(() => {
    getserviceNames();
    getHawkingZoneName();
    getAreaName();
  }, []);

  // view
  return (
    <>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        <strong>{<FormattedLabel id="basicApplicationDetails" />}</strong>
      </div>
      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
          paddingLeft: "60px",
          display: "flex",
          justifyContent: "center",
          align: "center",
        }}
      >
        {/** 
        <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
          <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
            <InputLabel id='demo-simple-select-standard-label'>
              {<FormattedLabel id='serviceName' />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ width: "50vh" }}
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label='Service Name *'
                  id='demo-simple-select-standard'
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {serviceNames &&
                    serviceNames.map((serviceName, index) => (
                      <MenuItem key={index} value={serviceName.id}>
                        {language == "en"
                          ? serviceName?.serviceName
                          : serviceName?.serviceNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='serviceName'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.serviceName ? errors.serviceName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        */}
        {/** 
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            id='standard-basic'
            label={<FormattedLabel id='applicationNumber' />}
            disabled
            defaultValue='23848494848'
            {...register("applicationNumber")}
            error={!!errors.applicationNumber}
            helperText={
              errors?.applicationNumber
                ? errors.applicationNumber.message
                : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl
            error={!!errors.applicationDate}
            sx={{ marginTop: 0 }}
            // sx={{ border: "solid 1px yellow" }}
          >
            <Controller
              control={control}
              name='applicationDate'
              defaultValue={Date.now()}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat='DD/MM/YYYY'
                    label={
                      <span style={{ fontSize: 16 }}>
                        {<FormattedLabel id='applicationDate' />}
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
                        size='small'
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
              {errors?.applicationDate ? errors.applicationDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="hawkerPrefix" />}
            disabled={watch("disabledFieldInputState")}
            {...register("hawkerPrefix")}
            error={!!errors?.hawkerPrefix}
            helperText={errors?.hawkerPrefix ? errors?.hawkerPrefix?.message : null}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={4}
          style={{ display: "flex", justifyContent: "center", alignItem: "center" }}
        >
          <FormControl style={{ marginTop: 0 }} error={!!errors?.fromDate}>
            <Controller
              name="fromDate"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromDate" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                    selected={field.value}
                    disabled={watch("disabledFieldInputState")}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
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
            <FormHelperText>{errors?.fromDate ? errors?.fromDate?.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={4}
          style={{ display: "flex", justifyContent: "center", alignItem: "center" }}
        >
          <FormControl style={{ marginTop: 0 }} error={!!errors?.toDate}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    disabled={watch("disabledFieldInputState")}
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="toDate" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
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
            <FormHelperText>{errors?.toDate ? errors?.toDate?.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="citySurveyNo" />}
            disabled={watch("disabledFieldInputState")}
            {...register("citySurveyNo")}
            error={!!errors?.citySurveyNo}
            helperText={errors?.citySurveyNo ? errors?.citySurveyNo?.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl variant="standard" error={!!errors?.hawkingZoneName} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="hawkingZoneName" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="hawkingZoneName *"
                >
                  {hawkingZoneNames &&
                    hawkingZoneNames.map((hawkingZoneName, index) => (
                      <MenuItem key={index} value={hawkingZoneName.id}>
                        {language == "en"
                          ? hawkingZoneName?.hawkingZoneName
                          : hawkingZoneName?.hawkingZoneNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="hawkingZoneName"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.hawkingZoneName ? errors?.hawkingZoneName?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.areaName}>
            <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="areaName" />}</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="areaName" />}
                >
                  {areaNames &&
                    areaNames.map((areaName, index) => (
                      <MenuItem key={index} value={areaName.id}>
                        {language == "en" ? areaName?.areaName : areaName?.areaNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="areaName"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.areaName ? errors?.areaName?.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}></Grid>
      </Grid>
    </>
  );
};

export default BasicApplicationDetails;