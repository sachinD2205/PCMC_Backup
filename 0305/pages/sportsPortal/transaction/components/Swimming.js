import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useForm, useFieldArray } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import URLS from "../../../../URLS/urls";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import { useSelector } from "react-redux";

const Swimming = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const [applicationList, setApplicationList] = useState([]);
  const [slots, setSlots] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [venues, setVenues] = useState([]);
  const [facilityNameField, setFacilityNameField] = useState(true);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  const [venueField, setVenueField] = useState(true);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    // name: "applicationName",
    name: "swimmingPoolDetailsDao",
    control,
    // defaultValues: [
    //   {applicationName:'aa',
    // }]
  });

  const language = useSelector((state) => state?.labels.language);

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

  // Gender
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
      );
    });
  };
  const handleOnChange = (value) => {
    // setBookingType(value);
    console.log("Select Values", value);
    // props.bookingType(value)
  };

  const appendUI = () => {
    append({
      name: "",
      gender: "",
      age: "",
      aadharNO: "",
    });
  };
  // useEffect(() => {
  //   if (getValues(`swimmingPoolDetailsDao.length`) == 0) {
  //     appendUI();
  //   }
  // }, []);

  useEffect(() => {
    getGenders();
    getAllTypes();
    getVenue();
    getFacilityTypes();
    getFacilityName();
    getDurationTypes();
    getApplicantTypes();
  }, []);
  const [zoneNames, setZoneNames] = useState([]);

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
      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityNameMr: row.facilityNameMr,
          facilityType: row.facilityType,
        })),
      );
    });
  };

  const getFacilityTypes = () => {
    axios.get(`${URLS.SPURL}/facilityType/getAll`).then((r) => {
      setValue("facilityType", r.data.facilityType?.find((ff) => ff.id === 3).id);

      setFacilityTypess(
        r.data.facilityType.map((row) => ({
          id: row.id,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        })),
      );
    });
  };

  const getSlots = (value) => {
    let body = {
      facilityType: getValues("facilityType"),
      facilityName: getValues("facilityName"),
      venue: getValues("venue"),
      date: getValues("date"),
      // fromDate: getValues("fromDate"),
      // zone: getValues("zone"),
      // month: getValues("month"),
    };
    console.log("DATA77", body);

    axios.post(`${URLS.SPURL}/swimmingPool/getSlotsByDate`, body, {}).then((res) => {
      let temp = res.data.map((row) => ({
        id: row.id,
        slot: row.fromBookingTime + "-" + row.toBookingTime,
      }));
      setSlots(temp);
      console.log("res.message", temp);
    });

    // setBookingType(value);
    // console.log("props.bookingType", value);
    // props.bookingType(value);
  };

  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`swimmingPoolDetailsDao.length`) >= 4) {
      setButtonValue(true);
    } else {
      appendUI();
      // reset();
      setButtonValue(false);
    }
  };

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
          Booking Details
          {/* <FormattedLabel id="personalDetails" /> */}
        </strong>
      </div>
      <Grid container sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.zone}
          >
            <InputLabel id="demo-simple-select-standard-label">{<FormattedLabel id="zone" />}</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="zone"
                >
                  {zoneNames &&
                    zoneNames.map((zoneName, index) => (
                      <MenuItem key={index} value={zoneName.id}>
                        {language == "en" ? zoneName?.zoneName : zoneName?.zoneNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="zone"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.zone ? errors.zone.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.applicantType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {" "}
              <FormattedLabel id="applicantType" required />
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
          <FormControl variant="standard" error={!!errors.durationType}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="durationType" required />
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
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("value: ", value.target.value);
                    setSelectedFacilityType(value.target.value);
                    setFacilityNameField(false);
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
                        return facility.facilityName === selectedFacilityName;
                        // return facility.facilityName === watch("facilityName");
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

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl style={{ marginTop: 2 }} error={!!errors.date}>
            <Controller
              control={control}
              name="date"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="date" required />}</span>}
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      getSlots();
                    }}
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
            <FormHelperText>{errors?.date ? errors.date.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl variant="standard" style={{ marginTop: 20 }} error={!!errors.bookingId}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="selectSlot" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="slots"
                >
                  {slots &&
                    slots.map((slot, index) => (
                      <MenuItem key={index} value={slot.id}>
                        {slot.slot}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="bookingId"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.bookingId ? errors.bookingId.message : null}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      <Grid
        container
        // sx={{
        //   marginLeft: 5,
        //   marginTop: 1,
        //   marginBottom: 5,
        //   marginRight: 1,

        //   align: "center",
        // }}
        style={{ marginLeft: "90px" }}
      >
        {fields.map((swimmingPoolDetailsDao, index) => {
          return (
            <>
              <Grid
                item
                xs={4}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{
                  display: "flex",
                  justifyContent: "left",
                  // marginLeft: '1vw',
                }}
              >
                <div
                  className={styles.h1Tag}
                  style={{
                    height: "40px",
                    width: "300px",
                  }}
                >
                  <h3
                    style={{
                      color: "black",
                      marginTop: "7px",
                    }}
                  >
                    {/* Member */}
                    {<FormattedLabel id="member" />}
                    {`: ${index + 1}`}
                  </h3>
                </div>
              </Grid>
              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                lg={4}
                xl={4}
                // style={{
                //   display: 'flex',
                //   justifyContent: 'center',
                //   marginLeft: '1vw',
                // }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="name" />}
                  variant="standard"
                  key={swimmingPoolDetailsDao.id}
                  {...register(`swimmingPoolDetailsDao.${index}.name`)}
                  error={!!errors.name}
                  helperText={errors?.name ? "Name is Required !!!" : null}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="gender" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Gender *"
                      >
                        {genders &&
                          genders.map((gender, index) => (
                            // <MenuItem key={index} value={gender.id}>
                            //   {gender.gender}
                            // </MenuItem>
                            <MenuItem key={index} value={gender.id}>
                              {language == "en" ? gender?.gender : gender?.genderMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`swimmingPoolDetailsDao.${index}.gender`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.gender ? errors.gender.message : null}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="aadharNo" />}
                  variant="standard"
                  // {...register('adharNom')}
                  key={swimmingPoolDetailsDao.id}
                  {...register(`swimmingPoolDetailsDao.${index}.adharNo`)}
                  error={!!errors.adharNo}
                  helperText={errors?.name ? "Aadhar no. is Required !!!" : null}
                />
              </Grid>

              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="age" />}
                  variant="standard"
                  // {...register('agem')}
                  key={swimmingPoolDetailsDao.id}
                  {...register(`swimmingPoolDetailsDao.${index}.age`)}
                  error={!!errors.age}
                  helperText={errors?.name ? "Age is Required !!!" : null}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<DeleteIcon />}
                  style={{
                    color: "white",
                    backgroundColor: "red",
                    height: "30px",
                  }}
                  onClick={() => {
                    // remove({
                    //   applicationName: "",
                    //   roleName: "",
                    // });
                    remove(index);
                  }}
                >
                  Delete
                  {/* {<FormattedLabel id="delete" />} */}
                </Button>
              </Grid>
            </>
          );
        })}
        <Grid
          item
          xs={4}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            // onClick={() => {
            //   appendUI();
            // }}
            onClick={() => buttonValueSetFun()}
          >
            {/* Add Member */}
            {<FormattedLabel id="addMember" />}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Swimming;
