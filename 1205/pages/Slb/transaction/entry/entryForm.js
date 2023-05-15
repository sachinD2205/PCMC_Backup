import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
// import schema from "../../../../containers/schema/SlbSchema/entryFormSchema";
import schema from "../../../../containers/schema/SlbSchema/entryFormSchema";

// entryFormSchema
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../../features/labelSlice";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
import { ContactPageSharp } from "@mui/icons-material";
// import { InputLabel } from '@mui/material';

const EntryForm = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();
  const [moduleName, setModuleName] = useState([]);
  const [selectParameterKey, setSelectParameterKey] = useState();
  const [selectParameter, setSelectParameter] = useState();
  const [id, setID] = useState();

  const [parameterNameList, setParameterNameList] = useState([]);
  const [subParameterName, setSubParameterName] = useState([]);
  const [filteredSubParameterName, setFilteredSubParameterName] = useState([]);
  const [trnEntry, setTrnEntry] = useState([]);
  const [finalEntry, setFinalEntry] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);

  // const token = useSelector((state) => state.user.user.token);

  useEffect(() => {
    getModuleName();
    getZoneList();
    getWardList();

    // getParameterName();
    //getSubParameterName();
  }, []);

  // zones

  // get Zone Keys
  const getZoneList = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      // Print r in console
      console.log("zone", r);

      setZoneList(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneKey: row.zoneId,
          zoneName: row.zoneName,
        })),
      );
    });
  };

  // get Ward Keys
  const getWardList = (selectedZoneId) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=${selectedZoneId}`,
      )
      .then((r) => {
        // Print r in console
        console.log("ward", r);

        setWardList(
          r.data.map((row) => ({
            id: row.id,
            wardKey: row.wardId,
            wardName: row.wardName,
          })),
        );
      });
  };

  // get Module Name
  const getModuleName = () => {
    axios.get(`${urls.SLB}/module/getAll`).then((res) => {
      console.log("ghfgf", res);
      setModuleName(
        res?.data?.moduleList?.map((r, i) => ({
          id: r.id,
          // name: r.name,
          moduleName: r.moduleName,
        })),
      );
    });
  };

  // get Parameter Name
  const getParameterName = () => {
    axios.get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=${watch("moduleKey")}`).then((res) => {
      console.log("ghfgf", res);
      setParameterNameList(
        res?.data?.parameterList?.map((r, i) => ({
          id: r.id,

          parameterName: r.parameterName,
          calculationMethod: r.calculationMethod,
          benchmarkType: r.benchmarkType,
        })),
      );
    });
  };

  // get sub-Parameter Name
  const getSubParameterName = (id) => {
    console.log("fetching params for - ", id);
    setSubParameterName([]);
    setTrnEntry([]);

    axios.get(`${urls.SLB}/subParameter/getByParameterKey?parameterKey=${id}`).then((res) => {
      console.log("ghfgf11", res);
      let subParamData = res?.data?.subParameterList?.map((r, i) => ({
        srNo: i + 1,
        id: r.id,
        description: r.description,
        // subParameterName: r.subParameterName,
        subParameterName: r.subParameterName,
        // subParameterName:r.subParameterName,
        parameterKey: r.parameterKey,
        groupParameter: r.groupParameter,
        calculationType: r.calculationType,
        dataStructure: r.dataStructure,
        valueType: r.valueType,
        measurementUnit: r.measurementUnit,
      }));

      // Sort the array by calculationType
      subParamData.sort((a, b) => {
        if (a.calculationType < b.calculationType) {
          return 1;
        }
        if (a.calculationType > b.calculationType) {
          return -1;
        }
        return 0;
      });

      setSubParameterName(subParamData);

      setTrnEntry(
        subParamData?.map((r, i) => ({
          srNo: i + 1,
          id: r.id,
          description: r.description,
          subParameterName: r.subParameterName,
          parameterKey: r.parameterKey,

          groupParameter: r.groupParameter,
          calculationType: r.calculationType,
          dataStructure: r.dataStructure,
          valueString: "",
          valueType: r.valueType,
          measurementUnit: r.measurementUnit,
          // get current date with moment and set hours and mins and seconds to 0 in ISODate Format

          reportedDate: moment().hours(0).minutes(0).seconds(0).milliseconds(0),
        })),
      );
    });
  };

  // const getSubParameter = (field, value) => {
  //   field.onChange(value);

  //   console.log(
  //     "11111",
  //     subParameterName.map(
  //       (obj) => obj?.parameterKey == value.target.value && obj
  //     )
  //   );

  //   setFilteredSubParameterName(
  //     subParameterName.map(
  //       (obj) => obj?.subParameterKey == value.target.value && obj
  //     )
  //   );
  // };

  // New DB Save
  const onSubmitForm = (Data) => {
    console.log("databeing-passed", Data);

    const trnEntryValues = Object.values(Data.trnEntry);
    console.log("trnEntryValues", trnEntryValues);

    console.log("subParameterName", subParameterName);

    const dataArray = trnEntryValues.reduce((acc, value) => {
      if (value.subParameterKey && value.valueString) {
        acc.push({
          moduleKey: Data.moduleKey,
          // get ModuleName from the list of Modules using moduleKey
          moduleName: moduleName.find((p) => p.id === Data.moduleKey).moduleName,
          parameterKey: Data.parameterName,
          // get ParameterName from the list of Parameters using parameterKey
          parameterName: parameterNameList.find((p) => p.id === Data.parameterName).parameterName,
          subParameterKey: value.subParameterKey,
          // get SubParameterName from the list of SubParameters using SubparameterKey

          subParameterName: value.subParameterName,
          valueString: value.valueString,
          valueType: value.valueType,
          calculationType: value.calculationType,
          entryUniqueIdentifier: "SD",
          zoneKey: Data.zoneKey,
          // get ZoneName from the list of ZoneList using zoneKey
          zoneName: zoneList.find((p) => p.id === Data.zoneKey).zoneName,
          wardKey: Data.wardKey,
          // get WardName from the list of WardList using wardKey
          wardName: wardList.find((p) => p.id === Data.wardKey).wardName,
        });
      }
      return acc;
    }, []);

    // Convert data array into the JSON array starting with [ and ending with ]
    const dataArrayJSON = JSON.stringify(dataArray);

    console.log("databeing-passed-after process", dataArrayJSON);
    let body = {
      ...dataArrayJSON,
    };

    // // Call the API for each item in the `dataArray`
    //   Promise.all(dataArray.map((item) => {
    //   return axios.post(`${urls.SLB}/trnEntry/save`, item, {
    //          headers: {},
    //        });
    // }))
    // .then((responseArray) => {
    //   console.log(responseArray);
    //   // Check if all the API calls were successful...
    //   const allSuccessful = responseArray.every((response) => (response.status === 200 || response.status === 201));
    //   if (allSuccessful) {
    //     console.log("All API calls were successful!");
    //     sweetAlert("Saved!", "Record Submitted successfully !", "success");
    //     router.push(`/Slb/transaction/entry/`);
    //     // Handle the successful response here...
    //   } else {
    //     console.log("At least one API call failed!");
    //     sweetAlert("Error!", "At least one API call failed!", "success");
    //     router.push(`/Slb/transaction/entry/`);
    //     // Handle the failed response here...
    //   }
    // }).catch((error) => {
    //   console.error(error);
    //   // Handle any errors that occurred during the API calls here...
    // });

    // console.log("body saved", body);

    axios
      .post(`${urls.SLB}/trnEntry/saveListV2`, dataArrayJSON, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res.status == 201) {
          // get parameter Name from res.data.data which is json string and set it to parameterName| decode json
          const paramaterName = res.data.parameterDao.parameterName;

          const htmlContent = "<h1>Hello world!</h1><p>This is some <strong>HTML</strong> content.</p>";

          console.log("paramaterName", paramaterName);

          sweetAlert({
            title: paramaterName + "",
            icon: "success",
            button: "OK",
            text: res.data.data,
            html: htmlContent,
            allowHtml: true,
          });

          router.push(`/Slb/transaction/entry/`);
        }
      });

    //clear trnEntry list
    setTrnEntry([]);
    setSubParameterName([]);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    parameterName: "",
    moduleName: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    parameterName: "",
    moduleName: "",
    id: null,
  };

  useEffect(() => {
    getParameterName();
    setSelectParameter(null);
    setTrnEntry([]);
  }, [watch("moduleKey")]);

  // useEffect(() => {
  //   getSubParameterName();
  //   // getParameterName();
  // }, [watch("parameterName")]);

  useEffect(() => {
    console.log("filteredSubParameterName", filteredSubParameterName);
  }, [filteredSubParameterName]);

  // View
  return (
    <>
      {/* <BasicLayout> */}
      {/* <Box display="inkenline-block"> */}
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            // marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              {" "}
              Entry Form
              {/* <FormattedLabel id="opinion" /> */}
            </h2>
          </Box>

          <Divider />

          <Box
            sx={{
              marginLeft: 5,
              marginRight: 5,
              // marginTop: 2,
              marginBottom: 5,
              padding: 1,
              // border:1,
              // borderColor:'grey.500'
            }}
          >
            <Box p={4}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* Firts Row */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* Zone Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">Zone</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                getWardList(value.target.value);
                              }}
                              label={<FormattedLabel id="locationName" />}
                            >
                              {zoneList &&
                                zoneList.map((zone, index) => (
                                  <MenuItem key={index} value={zone.id}>
                                    {zone.zoneName}

                                    {/* {language == "en"
                                      ? name?.name
                                      : name?.name} */}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          // name="moduleName"
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Ward Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl variant="standard" size="medium" error={!!errors.wardKey}>
                        <InputLabel id="demo-simple-select-standard-label">Ward</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label={<FormattedLabel id="locationName" />}
                            >
                              {wardList &&
                                wardList.map((ward, index) => (
                                  <MenuItem key={index} value={ward.id}>
                                    {ward.wardName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="wardKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Module Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.moduleName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">Module</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              // sx={{ width: 200 }}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label={<FormattedLabel id="locationName" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                            >
                              {moduleName &&
                                moduleName.map((moduleName, index) => (
                                  <MenuItem key={index} value={moduleName.id}>
                                    {moduleName.moduleName}

                                    {/* {language == "en"
                                      ? name?.name
                                      : name?.name} */}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          // name="moduleName"
                          name="moduleKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.moduleName ? errors.moduleName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Parameter Name */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.parameterName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Location Name */}
                          {/* {<FormattedLabel id="locationName" />} */}
                          Parameter
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              // sx={{ width: 200 }}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}

                              onChange={(value) => {
                                //getSubParameter(field, value);
                                field.onChange(value);
                                console.log("vtv" + value.target.value);
                                setSelectParameterKey(value.target.value);

                                // get parameter from paremeterlList
                                const param = parameterNameList.find(
                                  (parameterName) => parameterName.id === value.target.value,
                                );
                                setSelectParameter(param);
                                //setParameterName("SAgar");
                                console.log("inside selection changed", param);
                                getSubParameterName(value.target.value);
                              }}
                              // label={<FormattedLabel id="locationName" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                            >
                              {parameterNameList &&
                                parameterNameList.map((parameterName, index) => (
                                  <MenuItem key={index} value={parameterName.id}>
                                    {parameterName.parameterName}

                                    {/* {language == "en"
                                      ? officeLocationName?.officeLocationName
                                      : officeLocationName?.officeLocationNameMar} */}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="parameterName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.parameterName ? errors.parameterName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Divider />

                  <InputLabel
                    id="demo-simple-select-standard-label"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectParameter && "Benchmark Type : "}
                    {selectParameter && selectParameter.benchmarkType}
                    {selectParameter && " | Calculation Method : "}
                    {selectParameter && selectParameter.calculationMethod}
                  </InputLabel>

                  <Divider />

                  {trnEntry?.map((val, index) => {
                    //console.log("value123", val);
                    return (
                      <>
                        <Grid
                          key={index}
                          container
                          sx={{
                            // justifyContent:"center",
                            // alignContent:"center"
                            // marginTop:"30px"
                            marginLeft: "90px",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            xl={4}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              alignContent: "center",
                              //  border:"2px solid red"
                            }}
                          >
                            <Typography
                              style={{
                                // border:"2px solid black",
                                marginTop: "15px",
                              }}
                            >
                              {val.subParameterName} ({val.calculationType ? val.calculationType : "-"})
                              <br />
                              {val.measurementUnit ? " [Unit: " + val.measurementUnit + "]" : ""}
                              {/* {...register("subParameterName")} */}
                            </Typography>
                            {/* {val.description} */}
                          </Grid>

                          {/* {val.description} */}

                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            xl={4}
                            style={{
                              // marginRight:""
                              display: "flex",
                              alignItems: "center",
                              alignContent: "center",
                              // border:"2px solid yellow"
                            }}
                          >
                            <TextField
                              tooltip={val.measurementUnit ? " [Unit: " + val.measurementUnit + "]" : ""}
                              enabled={false}
                              value={val.subParameterName}
                              // label={val.description}
                              style={{
                                width: "0px",
                                // border:"2px solid green"
                              }}
                              variant="standard"
                              {...register("trnEntry[{" + val.id + "].subParameterName")}
                              helperText={errors?.valueString ? errors.valueString.message : null}
                            />
                            <TextField
                              enabled={false}
                              value={val.id}
                              // label={val.description}
                              style={{
                                width: "0px",
                                // border:"2px solid green"
                              }}
                              variant="standard"
                              {...register("trnEntry[{" + val.id + "].subParameterKey")}
                              helperText={errors?.valueString ? errors.valueString.message : null}
                            />
                            <TextField
                              enabled={false}
                              value={val.valueType}
                              // label={val.description}
                              style={{
                                width: "0px",
                                // border:"2px solid green"
                              }}
                              variant="standard"
                              {...register("trnEntry[{" + val.id + "].valueType")}
                              helperText={errors?.valueString ? errors.valueString.message : null}
                            />

                            <TextField
                              enabled={false}
                              value={val.calculationType}
                              // label={val.description}
                              style={{
                                width: "0px",
                                // border:"2px solid green"
                              }}
                              variant="standard"
                              {...register("trnEntry[{" + val.id + "].calculationType")}
                              helperText={errors?.valueString ? errors.valueString.message : null}
                            />
                            <TextField
                              // label={val.description}
                              style={
                                {
                                  // border:"2px solid green"
                                }
                              }
                              variant="standard"
                              {...register("trnEntry[{" + val.id + "].valueString")}
                              // error={!!errors.valueString}
                              helperText={errors?.valueString ? errors.valueString.message : null}
                            />
                          </Grid>
                        </Grid>
                      </>
                    );
                  })}
                  {/* Second Row */}
                  {/* Button Row */}
                  <Grid container mt={10} ml={5} mb={5} border px={5}>
                    <Grid item xs={2}></Grid>

                    {/* Save ad Draft */}
                    <Grid item>
                      <Button
                        // onClick={() => setButtonText("saveAsDraft")}
                        type="Submit"
                        variant="contained"
                      >
                        Submit
                        {/* {<FormattedLabel id="saveAsDraft" />} */}
                      </Button>
                    </Grid>

                    <Grid item xs={2}></Grid>

                    <Grid item>
                      <Button
                        // onClick={() => setButtonText("submit")}
                        type="Submit"
                        variant="contained"
                        onClick={() => cancellButton()}
                      >
                        Clear
                        {/* {<FormattedLabel id="submit" />} */}
                      </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button variant="contained" onClick={() => router.push(`/Slb/transaction/entry/`)}>
                        Cancel
                        {/* {<FormattedLabel id="cancel" />} */}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>
      {/* </Box> */}

      {/* </BasicLayout> */}
    </>
  );
};

export default EntryForm;
