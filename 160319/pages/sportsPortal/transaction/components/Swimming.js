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

const Swimming = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [applicationList, setApplicationList] = useState([]);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    // name: "applicationName",
    name: "swimmingPoolDetailsDao",
    control,
    // defaultValues: [
    //   {applicationName:'aa',
    // }]
  });
  // Gender
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
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
  useEffect(() => {
    if (getValues(`swimmingPoolDetailsDao.length`) == 0) {
      appendUI();
    }
  }, []);

  useEffect(() => {
    getGenders();
  });

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
      {/* <div className={styles.row}>
          <Typography variant="h6" sx={{ marginTop: 4 }}>
            Personal Details
          </Typography>
        </div> */}
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
        {/* <Grid item xs={6} sm={6} md={6} lg={6} xl={6}> */}
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
          <FormControl error={!!errors.applicationDate} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {/* {<FormattedLabel id="bookingType" />} */}
              Swimming Pool Name
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  label="swimmingPoolName"
                >
                  <MenuItem value="Shivaji Maharaj Swimming Pool">Shivaji Maharaj Swimming Pool</MenuItem>
                  <MenuItem value="Rajshri Chatrapathi Sahu Maharaj Jaltaran Talav">
                    Rajshri Chatrapathi Sahu Maharaj Jaltaran Talav
                  </MenuItem>
                  {/* <MenuItem value="swimmingPoolth">Swimming Pool 3</MenuItem>
                  <MenuItem value="swimmingPoolf">Swimming Pool 4</MenuItem> */}
                </Select>
              )}
              name="swimmingPoolName"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <FormControl error={!!errors.applicationDate} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {/* {<FormattedLabel id="slots" />} */}
              Slots
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  label="slots"
                >
                  {/* <MenuItem value="Government_School">Government School</MenuItem> */}
                  <MenuItem value="1PM-2PM">1PM-2PM</MenuItem>
                  <MenuItem value="2:15PM-3:15PM">2:15PM-3:15PM</MenuItem>
                  <MenuItem value="4PM-5PM">4PM-5PM</MenuItem>
                  <MenuItem value="5:15PM-6:15PM">5:15PM-6:15PM</MenuItem>
                </Select>
              )}
              name="slots"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>

        {/* className={styles.mainMembers}> */}
        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <TextField
            id="standard-basic"
            // label={<FormattedLabel id="capacity" />}
            label="Name"
            variant="standard"
            {...register('name')}
            error={!!errors.name}
            helperText={errors?.name ? 'Name is Required !!!' : null}
          />
        </Grid>

        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">
              Gender *
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
                      <MenuItem key={index} value={gender.id}>
                        {gender.gender}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="gender"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.gender ? errors.gender.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <TextField
            id="standard-basic"
            // label={<FormattedLabel id="capacity" />}
            label="Aadhar No."
            variant="standard"
            {...register('aadharNo')}
            error={!!errors.age}
            helperText={errors?.name ? 'Aadhar Number is Required !!!' : null}
          />
        </Grid>

        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <TextField
            id="standard-basic"
            // label={<FormattedLabel id="capacity" />}
            label="Age"
            variant="standard"
            {...register('age')}
            error={!!errors.age}
            helperText={errors?.name ? 'Age is Required !!!' : null}
          />
        </Grid> */}
      </Grid>
      {/* <div className={styles.mainMembers}>
        <div>
          <TextField
            id="standard-basic"
            // label={<FormattedLabel id="capacity" />}
            label="Name"
            variant="standard"
            {...register('name')}
            error={!!errors.name}
            helperText={errors?.name ? 'Name is Required !!!' : null}
          />
        </div>
        <div>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">
              Gender *
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
                      <MenuItem key={index} value={gender.id}>
                        {gender.gender}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="gender"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.gender ? errors.gender.message : null}
            </FormHelperText>
          </FormControl>
        </div>
        <div>
          <TextField
            id="standard-basic"
            // label={<FormattedLabel id="capacity" />}
            label="Aadhar No."
            variant="standard"
            {...register('aadharNo')}
            error={!!errors.age}
            helperText={errors?.name ? 'Aadhar Number is Required !!!' : null}
          />
        </div>
        <div>
          <TextField
            id="standard-basic"
            // label={<FormattedLabel id="capacity" />}
            label="Age"
            variant="standard"
            {...register('age')}
            error={!!errors.age}
            helperText={errors?.name ? 'Age is Required !!!' : null}
          />
        </div>
      </div> */}
      <div className={styles.members}>
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Box style={{ padding: '20px' }}>
            <Typography variant="h6">Add Members</Typography>
            <Divider style={{ background: 'black' }} />
          </Box>
        </Grid> */}
        {/* <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                appendUI();
              }}
            >
              Add more
            </Button>
          </Grid>
        </Grid> */}
        {/* <Grid container style={{ padding: '10px', backgroundColor: '#F9F9F9' }}> */}
        <Grid
          container
          sx={{
            marginLeft: 5,
            marginTop: 1,
            marginBottom: 5,
            marginRight: 1,

            align: "center",
          }}
          style={{ padding: "10px" }}
        >
          {fields.map((swimmingPoolDetailsDao, index) => {
            return (
              <>
                <Grid
                  item
                  xs={12}
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
                      Member
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
                    // label={<FormattedLabel id="capacity" />}
                    label="Name"
                    variant="standard"
                    // {...register('namem')}
                    key={swimmingPoolDetailsDao.id}
                    {...register(`swimmingPoolDetailsDao.${index}.name`)}
                    error={!!errors.name}
                    helperText={errors?.name ? "Name is Required !!!" : null}
                  />
                </Grid>

                {/* <TextField
                      id="standard-basic"
                      // label={<FormattedLabel id="capacity" />}
                      label="Gender"
                      variant="standard"
                      {...register("gender")}
                      error={!!errors.gender}
                      helperText={
                        errors?.name ? "Gender is Required !!!" : null
                      }
                    /> */}
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
                    <InputLabel id="demo-simple-select-standard-label">Gender *</InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Gender *"
                        >
                          {genders &&
                            genders.map((gender, index) => (
                              <MenuItem key={index} value={gender.id}>
                                {gender.gender}
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

                {/* <FormControl
                      fullWidth
                      style={{ width: "48%" }}
                      size="small"
                    >
                      <InputLabel id="demo-simple-select-label">
                        Role name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Role name"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            style={{ backgroundColor: "white" }}
                          >
                            <MenuItem value="swimmingPoolo">
                              Swimming Pool 1
                            </MenuItem>
                            <MenuItem value="swimmingPoolt">
                              Swimming Pool 2
                            </MenuItem>
                          </Select>
                        )}
                        name={`applicationRolesList[${index}].roleName`}
                        control={control}
                        defaultValue=""
                        key={witness.id}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.roleName ? errors.roleName.message : null}
                      </FormHelperText>
                    </FormControl> */}

                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <TextField
                    id="standard-basic"
                    // label={<FormattedLabel id="capacity" />}
                    label="Adhar Number"
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
                    // label={<FormattedLabel id="capacity" />}
                    label="Age"
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
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
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
                    Add Member
                  </Button>
                </Grid>
                {/* </Grid> */}
                {/* </div> */}
              </>
            );
          })}
        </Grid>
      </div>
    </>
  );
};

export default Swimming;
