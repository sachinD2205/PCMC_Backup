import {
  Button,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";

import { TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import URLS from "../../../../URLS/urls";

const BasicApplicationDetails = ({ readOnly = false }, { read = true }) => {
  const {
    control,
    watch,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [group, setGroup] = useState("Group");
  const [mapDrawerOpen, setMapDrawerOpen] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  const [venues, setVenues] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [venueField, setVenueField] = useState(true);
  // const [facilityNameField, setFacilityNameField] = useState(true);
  const [kayAheNaav, setKayAheNaav] = useState("Individual");
  const language = useSelector((state) => state?.labels.language);
  const [disable, setDisable] = useState(false);
  const getAllTypes = () => {
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        })),
      );
    });
  };
  const handleOnChange = (value) => {
    // setBookingType(value);
    console.log("props.bookingType", value);
    // props.bookingType(value);
  };

  const [durationTypess, setDurationTypess] = useState([]);

  const getDurationTypes = () => {
    axios.get(`${URLS.SPURL}/master/durationType/getAll`).then((r) => {
      setDurationTypess(
        r.data.durationType.map((row) => ({
          id: row.id,
          typeName: row.typeName,
          typeNameMr: row.typeNameMr,
        })),
      );
    });
  };

  const [applicantTypess, setApplicantTypess] = useState([]);

  // getApplicant Type
  const getApplicantTypes = () => {
    axios.get(`${URLS.SPURL}/applicantType/getAll`).then((r) => {
      console.log(" types :", r.data.applicantType);
      setApplicantTypess(r.data.applicantType);
      setApplicantTypess(
        r.data.applicantType.map((row) => ({
          id: row.id,
          typeName: row.typeName,
          typeNameMr: row.typeNameMr,
        })),
      );
    });
  };

  const getSubDepartments = () => {
    axios.get(`${URLS.CFCURL}/master/subDepartment/getAll`).then((r) => {
      console.log("SD: ", r.data);
      setSubDepartments(
        r.data.subDepartment.map((row) => ({
          id: row.id,
          subDepartmentName: row.subDepartment,
          subDepartmentNameMr: row.subDepartmentMr,
        })),
      );
    });
  };
  const getDepartments = () => {
    axios.get(`${URLS.CFCURL}/master/department/getAll`).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
          departmentMr: row.departmentSPURLMr,
        })),
      );
    });
  };

  const getVenue = () => {
    axios.get(`${URLS.SPURL}/venueMaster/getAll`).then((r) => {
      setVenues(
        r.data.venue.map((row) => ({
          id: row.id,
          venue: row.venue,
          venueMr: row.venueMr,
          facilityName: row.facilityName,
        })),
      );
    });
  };

  const getFacilityName = () => {
    axios.get(`${URLS.SPURL}/facilityName/getAll`).then((r) => {
      //
      setValue("facilityName", r.data.facilityName?.find((ff) => ff.id === 2).id);
      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityNameMr: row.facilityNameMr,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        })),
      );
    });
  };

  const getFacilityTypes = () => {
    axios.get(`${URLS.SPURL}/facilityType/getAll`).then((r) => {
      //
      setValue("facilityType", r.data.facilityType?.find((ff) => ff.id === 2).id);
      setFacilityTypess(
        r.data.facilityType.map((row) => ({
          id: row.id,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        })),
      );
    });
  };

  // useEffect
  useEffect(() => {
    getFacilityTypes();
    getFacilityName();
    getVenue();
    getSubDepartments();
    getAllTypes();
    getDurationTypes();
    getApplicantTypes();
  }, []);

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
        <strong>
          <FormattedLabel id="bookingDetails" />
        </strong>
      </div>
      <Grid container sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} error={!!errors.applicationDate} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="applicationDate"
              defaultValue={Date.now()}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat="DD/MM/YYYY"
                    label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="applicationDate" />}</span>}
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
            <FormHelperText>{errors?.applicationDate ? errors.applicationDate.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} style={{ marginTop: 10 }} error={!!errors.fromDate}>
            <Controller
              control={control}
              name="fromDate"
              disabled={readOnly}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromDate" required />
                        {/* Date(from) */}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(
                        moment(date).format("YYYY-MM-DD"),
                        // moment(date).format("DD-MM-YYYY")
                      )
                    }
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
            <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} style={{ marginTop: 10 }} error={!!errors.toDate}>
            <Controller
              control={control}
              name="toDate"
              disabled={readOnly}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled={disable}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="toDate" required />
                        {/* Date(to) */}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(
                        moment(date).format("YYYY-MM-DD"),
                        // moment(date).format("DD-MM-YYYY")
                      )
                    }
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
            <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} style={{ marginTop: 10 }} error={!!errors.fromBookingTime}>
            <Controller
              control={control}
              name="fromBookingTime"
              disabled={readOnly}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromBookingTime" required />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      setValue(
                        "fromBookingTime",
                        // moment(newValue).format('hh:mm a')
                        date,
                      );
                      return field.onChange(moment(date).format("YYYY-MM-DDTHH:mm"));
                    }}
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
            <FormHelperText>{errors?.fromBookingTime ? errors.fromBookingTime.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} style={{ marginTop: 10 }} error={!!errors.toBookingTime}>
            <Controller
              control={control}
              name="toBookingTime"
              disabled={readOnly}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label={
                      <span style={{ fontSize: 16 }}>{<FormattedLabel id="toBookingTime" required />}</span>
                    }
                    // value={valuee}
                    value={field.value}
                    // onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DDTHH:mm"))}
                    onChange={(newValue) => {
                      setValue(
                        "toBookingTime",
                        // moment(newValue).format('hh:mm a')
                        newValue,
                      );
                      return field.onChange(moment(newValue).format("YYYY-MM-DDTHH:mm"));
                    }}
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
            <FormHelperText>{errors?.toBookingTime ? errors.toBookingTime.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        {/* 
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.applicationDate} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="bookingType" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value), handleOnChange(value.target.value);
                    setGroup(false);
                    setKayAheNaav(value.target.value);
                  }}
                  label="bookingType"
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Group"> Group</MenuItem>
                </Select>
              )}
              name="bookingType"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              // sx={{ m: 1, minWidth: 120 }}
              error={!!errors.wardName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="ward" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ minWidth: 220 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="wardName"
                  >
                    {wardNames &&
                      wardNames.map((wardName, index) => (
                        <MenuItem key={index} value={wardName.id}>
                          {wardName.wardName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="wardName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.wardName ? errors.wardName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Department"
            value="Sports Department"
            {...register("department")}
          />
        </Grid> */}

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.bookingType} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="bookingType" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  disabled={readOnly}
                  onChange={(value) => {
                    field.onChange(value);
                    // field.onChange(value), handleOnChange(value.target.value);

                    // setGroup(false);
                    // setKayAheNaav(value.target.value);
                  }}
                  label="bookingType"
                >
                  <MenuItem value="Government_School">Government School</MenuItem>
                  <MenuItem value="Private_School">Private School</MenuItem>
                  <MenuItem value="High_School">High School</MenuItem>
                  <MenuItem value="Sports_Club">Sports Club</MenuItem>
                </Select>
              )}
              name="bookingType"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.bookingType ? errors.bookingType.message : null}</FormHelperText>
          </FormControl>
        </Grid> */}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} variant="standard" error={!!errors.durationType}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="durationType" required />
              {/* Duration Type */}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("value: ", value.target.value);
                    // setSelectedFacilityType(value.target.value);
                    // setDisableKadhnariState(false);
                  }}
                  label="durationType"
                >
                  {durationTypess &&
                    durationTypess.map((durationType, index) => (
                      <MenuItem key={index} value={durationType.id}>
                        {language == "en" ? durationType?.typeName : durationType?.typeNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="durationType"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.durationType ? errors.durationType.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={readOnly}
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.applicantType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="applicantType" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("value: ", value.target.value);
                    setSelectedFacilityType(value.target.value);
                    // setDisableKadhnariState(false);
                  }}
                  label="applicantType"
                >
                  {applicantTypess &&
                    applicantTypess.map((applicantType, index) => (
                      <MenuItem key={index} value={applicantType.id}>
                        {language == "en" ? applicantType?.typeName : applicantType?.typeNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="applicantType"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.applicantType ? errors.applicantType.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={readOnly}
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.zone}
          >
            <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="zone" />}</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={readOnly}
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="zone"
                >
                  {zoneNames &&
                    zoneNames.map((zoneName, index) => {
                      return (
                        <MenuItem key={index} value={zoneName.id}>
                          {language == "en" ? zoneName?.zoneName : zoneName?.zoneNameMr}
                        </MenuItem>
                      );
                    })}
                </Select>
              )}
              name="zone"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.zone ? errors.zone.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.department}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="department" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="department"
                >
                  {departments &&
                    departments.map((department, index) => (
                      <MenuItem key={index} value={department.id}>
                        {department.department}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="department"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.department ? errors.department.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Facility Type"
            value="Ground Booking"
            {...register("groundBooking")}
          />
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              // sx={{ m: 1, minWidth: 120 }}
              error={!!errors.subDepartment}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="subDepartment" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ minWidth: 220 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="subDepartment"
                  >
                    {subDepartments &&
                      subDepartments.map((subDepartmentName, index) => (
                        <MenuItem key={index} value={subDepartmentName.id}>
                          {subDepartmentName.subDepartmentName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="subDepartment"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.subDepartment ? errors.subDepartment.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={read}
            // disabled={(pageMode = Add)}
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.facilityType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="facilityType" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  disabled={readOnly}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("value: ", value.target.value);
                    setSelectedFacilityType(value.target.value);
                    // setFacilityNameField(false);
                  }}
                  label="facilityType"
                >
                  {facilityTypess &&
                    facilityTypess.map((facilityType, index) => (
                      <MenuItem key={index} value={facilityType.id}>
                        {language == "en" ? facilityType?.facilityType : facilityType?.facilityTypeMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="facilityType"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.facilityType ? errors.facilityType.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={readOnly}
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.facilityName}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="facilityName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={readOnly}
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  // onChange={(value) => field.onChange(value)}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("facilityName: ", value.target.value);
                    setSelectedFacilityName(value.target.value);
                    setVenueField(false);
                  }}
                  label="facilityName"
                  // disabled={facilityNameField}
                >
                  {facilityNames &&
                    facilityNames
                      .filter((facility) => {
                        // return facility.facilityType === selectedFacilityType;
                        return facility.facilityType === watch("facilityType");
                      })
                      .map((facilityName, index) => (
                        <MenuItem key={index} value={facilityName.id}>
                          {language == "en" ? facilityName?.facilityName : facilityName?.facilityNameMr}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="facilityName"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.facilityName ? errors.facilityName.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={readOnly}
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.venue}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="venue" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  disabled={readOnly}
                  labelId="demo-simple-select-standard-label"
                  Fdate
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="venue"
                >
                  {venues &&
                    venues
                      .filter((facility) => {
                        // return facility.facilityName === selectedFacilityName;
                        return facility.facilityName === watch("facilityName");
                      })
                      .map((venue, index) => (
                        <MenuItem key={index} value={venue.id}>
                          {language == "en" ? venue?.venue : venue?.venueMr}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="venue"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.venue ? errors.venue.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={kayAheNaav === "Individual" ? true : false}
            id="standard-basic"
            label={<FormattedLabel id="totalGroupMember" />}
            variant="standard"
            // value={dataInForm && dataInForm.remark}
            {...register("totalGroupMember")}
            error={!!errors.totalGroupMember}
            helperText={
              errors?.totalGroupMember ? errors.totalGroupMember.message : null
            }
          />
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={kayAheNaav === "Individual" ? true : false}
            id="standard-basic"
            label={<FormattedLabel id="groupDetails" />}
            variant="standard"
            // disabled={group}
            // value={dataInForm && dataInForm.remark}
            {...register("groupDetails")}
            error={!!errors.groupDetails}
            helperText={
              errors?.groupDetails ? errors.groupDetails.message : null
            }
          />
        </Grid> */}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} error={!!errors.purposeOfBooking} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="purposeOfBooking" required />}
              {/* Purpose Of Booking */}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  disabled={readOnly}
                  onChange={(value) => {
                    field.onChange(value);
                    // field.onChange(value), handleOnChange(value.target.value);

                    // setGroup(false);
                    // setKayAheNaav(value.target.value);
                  }}
                  label="purposeOfBooking"
                >
                  <MenuItem value={language == "en" ? "Function" : "कार्यक्रम"}>
                    {" "}
                    {language == "en" ? "Function" : "कार्यक्रम"}
                  </MenuItem>
                  <MenuItem value={language == "en" ? "Sports" : "खेळ"}>
                    {" "}
                    {language == "en" ? "Sports" : "खेळ"}
                  </MenuItem>
                  <MenuItem value={language == "en" ? "Others" : "इतर"}>
                    {" "}
                    {language == "en" ? "Others" : "इतर"}
                  </MenuItem>

                  {/* <MenuItem value="Functions">Functions</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Others">Others</MenuItem> */}
                </Select>
              )}
              name="purposeOfBooking"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.purposeOfBooking ? errors.purposeOfBooking.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setMapDrawerOpen(true);
            }}
          >
            {<FormattedLabel id="viewImage" />}
          </Button>
          <Drawer
            anchor={"right"}
            open={mapDrawerOpen}
            onClose={() => setMapDrawerOpen(false)}
            // onClose={setMapDrawerOpen(false)}
            onOpen={() => setMapDrawerOpen(true)}
          >
            <Paper>
              <img src="/grood.jpg" hegiht="1000px" paddingTop="5vh" width="500px" alt="Image Not Found" />
            </Paper>
          </Drawer>
        </Grid>
      </Grid>
    </>
  );
};

export default BasicApplicationDetails;
