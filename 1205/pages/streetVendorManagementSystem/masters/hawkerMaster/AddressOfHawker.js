import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import Failed from "../../../../components/streetVendorManagementSystem/components/commonAlert";
import styles from "../../../../styles/view.module.css";

let drawerWidth;

// Main
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

// DrawerHeader
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

/** Authore - Sachin Durge */
// AddressOfHawker
const AddressOfHawker = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();

  const language = useSelector((state) => state?.labels.language);
  const [addressShrink, setAddressShrink] = useState();
  const [areaNames, setAreaName] = useState([]);
  const [landmarkNames, setLandmarkNames] = useState([]);
  const [villageNames, setVilageNames] = useState([]);
  const [pincodes, setPinCodes] = useState([]);
  const [open, setOpen] = React.useState(false);

  // areas
  const getAreaName = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setAreaName(
            r.data.area.map((row) => ({
              id: row.id,
              crAreaName: row.areaName,
              crAreaNameMr: row.areaNameMr,
              prAreaName: row.areaName,
              prAreaNameMr: row.areaNameMr,
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

  // landmarks
  const getLandmark = () => {
    axios
      .get(`${urls.CFCURL}/master/locality/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setLandmarkNames(
            r.data.locality.map((row) => ({
              id: row.id,
              crLandmarkName: row.landmark,
              crLandmarkNameMr: row.landmarkMr,
              prLandmarkName: row.landmark,
              prLandmarkNameMr: row.landmarkMr,
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

  // villages
  const getVillageNames = () => {
    axios
      .get(`${urls.CFCURL}/master/village/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setVilageNames(
            r.data.village.map((row) => ({
              id: row.id,
              crVillageName: row.villageName,
              crVillageNameMr: row.villageNameMr,
              prVillageName: row.villageName,
              prVillageNameMr: row.villageNameMr,
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

  // pinCodes
  const getPinCodes = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setPinCodes(
            r.data.pinCode.map((row) => ({
              id: row.id,
              crPincode: row.pinCode,
              crPincodeMr: row.pinCodeMr,
              prPincode: row.pinCode,
              prPincodeMr: row.pinCodeMr,
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

  // Address Change
  const addressChange = (e) => {
    if (e.target.checked == true) {
      setValue("prCitySurveyNumber", getValues("crCitySurveyNumber"));
      setValue("prAreaName", getValues("crAreaName"));
      setValue("prLandmarkName", getValues("crLandmarkName"));
      setValue("prVillageName", getValues("crVillageName"));
      setValue("prPincode", getValues("crPincode"));
      setValue("prLattitude", getValues("crLattitude"));
      setValue("prLogitude", getValues("crLogitude"));
      setValue("prCityName", getValues("crCityName"));
      setValue("prState", getValues("crState"));
      setAddressShrink(true);
    } else {
      setValue("prCitySurveyNumber", "");
      setValue("prAreaName", "");
      setValue("prLandmarkName", "");
      setValue("prVillageName", "");
      setValue("prPincode", "");
      setValue("prLattitude", "");
      setValue("prLogitude", "");
      setValue("prCityName", "");
      setValue("prState", "");
      setAddressShrink(false);
      setAddressShrink();
    }
  };

  // Drawer Code

  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "50%";
  };

  // Close Drawer
  const handleDrawerClose = () => {
    setOpen(false);
    drawerWidth = 0;
  };

  // useEffect
  useEffect(() => {
    getAreaName();
    getLandmark();
    getVillageNames();
    getPinCodes();
  }, []);

  // View
  return (
    <>
      {/** Button */}
      {/** 
      <Box
        style={{
          right: 25,
          position: "absolute",
          top: "50%",
          backgroundColor: "#bdbdbd",
        }}
      >
        <IconButton
          color='inherit'
          aria-label='open drawer'
          // edge="end"
          onClick={()=>(handleDrawerOpen())}
          sx={{ width: "30px", height: "75px", borderRadius: 0 }}
        >
          <ArrowLeftIcon />
        </IconButton>
      </Box>
      */}

      {/** Main Component  */}
      <Main>
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
          <strong> {<FormattedLabel id="currentAddressofHawker" />}</strong>
        </div>
        <div className={styles.flexMain}>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                autoFocus
                disabled={watch("disabledFieldInputState")}
                id="standard-basic"
                label={<FormattedLabel id="citySurveyNumber" />}
                {...register("crCitySurveyNumber")}
                error={!!errors.crCitySurveyNumber}
                helperText={errors?.crCitySurveyNumber ? errors.crCitySurveyNumber.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <FormControl sx={{ marginTop: 2 }} error={!!errors.crAreaName}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="areaName" />}
                </InputLabel>
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
                            {language == "en" ? areaName?.crAreaName : areaName?.crAreaNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="crAreaName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.crAreaName ? errors.crAreaName.message : null}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <FormControl sx={{ marginTop: 2 }} error={!!errors.crLandmarkName}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="landmarkName" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={watch("disabledFieldInputState")}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="landmarkName" />}
                    >
                      {landmarkNames &&
                        landmarkNames.map((landmarkName, index) => (
                          <MenuItem key={index} value={landmarkName.id}>
                            {language == "en" ? landmarkName?.crLandmarkName : landmarkName?.crLandmarkNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="crLandmarkName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.crLandmarkName ? errors.crLandmarkName.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <FormControl sx={{ marginTop: 2 }} error={!!errors.crVillageName}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="villageName" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={watch("disabledFieldInputState")}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="villageName" />}
                    >
                      {villageNames &&
                        villageNames.map((villageName, index) => (
                          <MenuItem key={index} value={villageName.id}>
                            {language == "en" ? villageName?.crVillageName : villageName?.crVillageNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="crVillageName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.crVillageName ? errors.crVillageName.message : null}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                disabled={watch("disabledFieldInputState")}
                defaultValue={"Pimpri Chinchwad"}
                label={<FormattedLabel id="cityName" />}
                {...register("crCityName")}
                error={!!errors.crCityName}
                helperText={errors?.crCityName ? errors.crCityName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id="standard-basic"
                disabled={watch("disabledFieldInputState")}
                defaultValue={"Maharashtra"}
                label={<FormattedLabel id="state" />}
                {...register("crState")}
                error={!!errors.crState}
                helperText={errors?.crState ? errors.crState.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <FormControl sx={{ marginTop: 2 }} error={!!errors.crPincode}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="pinCode" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={watch("disabledFieldInputState")}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="pinCode" />}
                    >
                      {pincodes &&
                        pincodes.map((pincode, index) => (
                          <MenuItem key={index} value={pincode.id}>
                            {language == "en" ? pincode?.crPincode : pincode?.crPincodeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="crPincode"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{errors?.crPincode ? errors.crPincode.message : null}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={watch("disabledFieldInputState")}
                id="standard-basic"
                label={<FormattedLabel id="lattitude" />}
                {...register("crLattitude")}
                error={!!errors.crLattitude}
                helperText={errors?.crLattitude ? errors.crLattitude.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={watch("disabledFieldInputState")}
                id="standard-basic"
                label={<FormattedLabel id="logitude" />}
                {...register("crLogitude")}
                error={!!errors.crLogitude}
                helperText={errors?.crLogitude ? errors.crLogitude.message : null}
              />
            </Grid>
            {watch("disabledFieldInputState") ? (
              <></>
            ) : (
              <>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Button
                    sx={{
                      marginTop: "5vh",
                      margin: "normal",
                      width: 230,
                      // height: "40px",
                    }}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                      handleDrawerOpen();
                    }}
                  >
                    <FormattedLabel id="viewLocationOnMap" />
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </div>
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
          <strong>{<FormattedLabel id="permanentPostalAddressOfHawker" />}</strong>
        </div>

        <Grid container sx={{ marginTop: 1, marginBottom: 5, paddingLeft: "50px", align: "center" }}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormControlLabel
              control={
                <Controller
                  name="addressCheckBox"
                  control={control}
                  defaultValue={false}
                  render={({ field: { value, ref, ...field } }) => (
                    <Checkbox
                      disabled={watch("disabledFieldInputState")}
                      {...field}
                      inputRef={ref}
                      checked={!!value}
                      onChange={(e) => {
                        setValue("addressCheckBox", e.target.checked);
                        addressChange(e);
                      }}
                    />
                  )}
                />
              }
              label=<Typography>
                <b>{<FormattedLabel id="permanentAddressAsTheCorrespondenceAddress" />}</b>
              </Typography>
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled={watch("disabledFieldInputState")}
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              label={<FormattedLabel id="citySurveyNumber" />}
              {...register("prCitySurveyNumber")}
              error={!!errors.prCitySurveyNumber}
              helperText={errors?.prCitySurveyNumber ? errors.prCitySurveyNumber.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.prAreaName}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="areaName" />}
              </InputLabel>
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
                          {language == "en" ? areaName?.prAreaName : areaName?.prAreaNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prAreaName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.prAreaName ? errors.prAreaName.message : null}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.prLandmarkName}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="landmarkName" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="landmarkName" />}
                  >
                    {landmarkNames &&
                      landmarkNames.map((landmarkName, index) => (
                        <MenuItem key={index} value={landmarkName.id}>
                          {language == "en" ? landmarkName?.prLandmarkName : landmarkName?.prLandmarkNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prLandmarkName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.prLandmarkName ? errors.prLandmarkName.message : null}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.prVillageName}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="villageName" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="villageName" />}
                  >
                    {villageNames &&
                      villageNames.map((villageName, index) => (
                        <MenuItem key={index} value={villageName.id}>
                          {language == "en" ? villageName?.prVillageName : villageName?.prVillageNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prVillageName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.prVillageName ? errors.prVillageName.message : null}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              disabled={watch("disabledFieldInputState")}
              defaultValue={""}
              label={<FormattedLabel id="cityName" />}
              {...register("prCityName")}
              error={!!errors.prCityName}
              helperText={errors?.prCityName ? errors.prCityName.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              disabled={watch("disabledFieldInputState")}
              defaultValue={""}
              label={<FormattedLabel id="state" />}
              {...register("prState")}
              error={!!errors.prState}
              helperText={errors?.prState ? errors.prState.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.prPincode}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="pinCode" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="pinCode" />}
                  >
                    {pincodes &&
                      pincodes.map((pincode, index) => (
                        <MenuItem key={index} value={pincode.id}>
                          {language == "en" ? pincode?.prPincode : pincode?.prPincodeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prPincode"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.prPincode ? errors.prPincode.message : null}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled={watch("disabledFieldInputState")}
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              label={<FormattedLabel id="lattitude" />}
              {...register("prLattitude")}
              error={!!errors.prLattitude}
              helperText={errors?.prLattitude ? errors.prLattitude.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled={watch("disabledFieldInputState")}
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              label={<FormattedLabel id="logitude" />}
              {...register("prLogitude")}
              error={!!errors.prLogitude}
              helperText={errors?.prLogitude ? errors.prLogitude.message : null}
            />
          </Grid>
        </Grid>
      </Main>

      {/** Drawer  */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        {/* <DrawerHeader>
          <IconButton onClick={()handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader> */}
        {/* <Divider /> */}

        <Box
          style={{
            left: 0,
            position: "absolute",
            top: "50%",
            backgroundColor: "#bdbdbd",
          }}
        >
          <IconButton
            color="primary"
            aria-label="open drawer"
            // edge="end"
            onClick={() => handleDrawerClose()}
            sx={{ width: "30px", height: "75px", borderRadius: 0 }}
          >
            <ArrowRightIcon />
          </IconButton>
        </Box>
        <img
          src="/ABC.jpg"
          //hegiht='300px'
          width="800px"
          alt="Map Not Found"
          style={{ width: "100%", height: "100%" }}
        />
      </Drawer>
      {/** End Drawer  */}
    </>
  );
};

export default AddressOfHawker;
