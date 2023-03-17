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
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
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

const View = () => {
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

  const token = useSelector((state) => state.user.user.token);

  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);

  const [buttonText, setButtonText] = useState(null);

  const [advocateNames, setadvocateName] = useState([]);

  // const [advocateNames1, setadvocateName1] = useState([]);

  const [isOpenCollapse1, setIsOpenCollapse1] = useState(false);

  const [isOpenCollapse2, setIsOpenCollapse2] = useState(false);

  const [isOpenCollapse3, setIsOpenCollapse3] = useState(true);

  const [personName, setPersonName] = React.useState([]);

  const [personName1, setPersonName1] = React.useState([]);

  const [selected, setSelected] = useState([]);

  const [selected1, setSelected1] = useState([]);

  const [selectedID, setSelectedID] = useState([]);
  const [selectedID1, setSelectedID1] = useState([]);

  const [advPanel, setAdvPanel] = useState(false);

  // const [reportAdvPanel, setReportAdvPanel] = useState(false);


  const [reportAdvocate, setReportAdvocate] = useState(false);

  const _opinionRequestDate = watch("opinionRequestDate");

  const _concenDeptId = watch("concenDeptId");
  const _opinionSubject = watch("opinionSubject");
  const _officeLocation = watch("officeLocation");
  const _panelRemarks = watch("panelRemarks");

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // const handleChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   console.log("31", value);
  //   setPersonName(
  //     // On autofill we get a stringified value.
  //     typeof value === "string" ? value.split(",") : value
  //     // personName = "gg"
  //   );
  // };

  // New HandleChange
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    console.log("ky ahe dropdown madhi", event.target.value);
    setSelected(event.target.value);

    setSelectedID(
      event.target.value.map(
        (v) => advocateNames.find((o) => o.FullName === v).id
      )
    );
  };

  console.log("personName1", personName, "personName2", personName1);

  // const handleChange1 = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   console.log("31", value);
  //   setPersonName1(
  //    typeof value === "string" ? value.split(",") : value
  //   );
  // };

  // New HandleChange1
  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    setSelected1(event.target.value);

    setSelectedID1(
      event.target.value.map(
        (v) => advocateNames.find((o) => o.FullName === v).id
      )
    );
  };

  const checkBox1 = (e) => {
    // alert(e.target.value);
    if (e.target.checked == true) {
      
      setIsOpenCollapse1(true);
      setIsOpenCollapse3(false);

      setValue("advPanel", true);
    } else if (e.target.checked == false) {
      // console.log(" Un Checked ", e.target.value);
      setIsOpenCollapse1(false);
      setIsOpenCollapse3(true);
    }
  };

  const checkBox2 = (e) => {
    if (e.target.checked == true) {
      setIsOpenCollapse2(true);
      setIsOpenCollapse3(false);
      
      setValue("reportAdvPanel", true);

    } else if (e.target.checked == false) {
      setIsOpenCollapse2(false);
      setIsOpenCollapse3(true);
    }
  };

  const getAdvocateNames = () => {
    axios.get(`${urls.LCMSURL}/master/advocate/getAll`).then((res) => {
      // let advs=
      // setadvocateName1(
      //   advs );
      setadvocateName(
        res.data.advocate.map((r, i) => ({
          id: r.id,
          FullName: r.firstName + "  " + r.middleName + "  " + r.lastName,
          FullNameMr:
            r.firstNameMr + "  " + r.middleNameMr + "  " + r.lastNameMr,
        }))
      );
    });
  };

  useEffect(() => {
    getAdvocateNames();
    // getAdvocateNames1();
    getDeptName();
    getOfficeName();
  }, []);

  const getDeptName = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setconcenDeptName(
        res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
          departmentMr: r.departmentMr,
        }))
      );
    });
  };

  // get Office Name
  const getOfficeName = () => {
    axios.get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`).then((res) => {
      console.log("ghfgf", res);
      setOfficeName(
        res.data.officeLocation.map((r, i) => ({
          id: r.id,
          officeLocationName: r.officeLocationName,
          officeLocationNameMar: r.officeLocationNameMar,
        }))
      );
    });
  };

  // Save - DB
  const onSubmitForm = (Data) => {
    console.log("data", Data);
    let body = {
      ...Data,
      opinionAdvPanelList: selectedID.map((val) => {
        return {
          advocate: val,
        };
      }),

      // role: "OPINION_CREATE",
      sentToAdvocate: buttonText === "saveAsDraft" ? "N" : "Y",
      role: buttonText === "saveAsDraft" ? "OPINION_SAVE_AS_DRAFT":"CREATE_OPINION",

      
    
      // role:
      //   Data.target.textContent === "Submit"
      //     ? "OPINION_CREATE"
      //     : "OPINION_DRAFT",

      reportAdvPanelList: selectedID1.map((val) => {
        return {
          advocate: val,
        };
      }),

      // id: null,
      //name
      id: router.query.pageMode == "Opinion" ? null : Data.id,

      // role :"OPINION_DRAFT"

      // role:"OPINION_SAVE_AS_DRAFT"
    };

    console.log("body", body);

    axios
      .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res123", res);
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/opinion`);
        }
      });
  };

  useEffect(() => {
    if (watch("advPanel")) {
      setIsOpenCollapse1(true);
      setIsOpenCollapse3(false);
    }else {
      setIsOpenCollapse1(false);
      setIsOpenCollapse3(true);

    }
  }, [watch("advPanel")]);



  // for report panel

  useEffect(() => {
    if (watch("reportAdvPanel")) {
      setIsOpenCollapse2(true);
      setIsOpenCollapse3(false);
    } else{
      setIsOpenCollapse2(false);
      setIsOpenCollapse3(true);
    }
  }, [watch("reportAdvPanel")]);
  
  
  useEffect(() => {
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "View" ||
      router.query.pageMode == "Opinion"
    ) {
      axios
        .get(
          `${urls.LCMSURL}/transaction/opinion/getById?id=${router?.query?.id}`
        )
        .then((res) => {
          console.log("resssss", res.data);
          reset(res.data);
          // console.log("Data------", res.data);
          console.log(
            "advPanel------",
            res.data.advPanel,
            "type:",
            typeof router.query.advPanel
          );

          console.log(
            "reportAdvPanel------",
            res.data.reportAdvPanel,
            "type:",
            typeof router.query.advPanel
          );

          setValue("advPanel", true);

          setValue("reportAdvPanel",true);

          setAdvPanel(res.data.advPanel);

          setReportAdvocate(res.data.reportAdvPanel);

          setIsOpenCollapse1(res.data.advPanel);

          setReportAdvocate(res.data.reportAdvPanel);

          // setIsOpenCollapse2(res.data.reportAdvPanel);

          if (res.data.reportAdvPanel == true || res.data.advPanel == true) {
            setIsOpenCollapse3(false);
          } else {
            setIsOpenCollapse3(true);
          }

          setSelectedID(
            res?.data?.opinionAdvPanelList.map((o) => {
              return o?.advocate;
            })
          );

          let selected = res?.data?.opinionAdvPanelList?.map(
            (op) => advocateNames?.find((o) => o?.id === op?.advocate)?.FullName
          );
          setSelected(selected);

          let selected1 = res?.data?.reportAdvPanelList?.map(
            (op) => advocateNames?.find((o) => o?.id === op?.advocate)?.FullName
          );
          setSelected1(selected1);

          console.log("opinionAdvPanelList", res.data.opinionAdvPanelList);
          console.log("advocateNames", advocateNames);
          console.log("selected)))", selected);
          console.log("selected1)))", selected1);

          setSelectedID1(
            res.data.reportAdvPanelList.map((o) => {
              return o.advocate;
            })
          );
        });

      // setValue("opinionSubject", router.query.opinionSubject),

      // getValues("reportAdvPanel"),
      // setValue(Boolean(getValues(router.query.reportAdvPanel))),
      // setValue(Boolean(getValues(router.query.advPanel)))
      // setValue("advPanel",router.query.advPanel == "true" ? true : false)
    }
  }, [advocateNames]);

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
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              {" "}
              <FormattedLabel id="opinion" />
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
                  {/* First Row */}

                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        // justifyContent: "center",
                        // alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        style={{ marginTop: 10 }}
                        error={!!errors.opinionRequestDate}
                      >
                        <Controller
                          // variant="standard"
                          control={control}
                          name="opinionRequestDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled={router?.query?.pageMode === "View"}
                                variant="standard"
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 15 }}>
                                    {/* Opinion Request Date */}
                                    {<FormattedLabel id="opinionRequestDate" />}
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    variant="standard"
                                    sx={{ width: 200 }}
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },

                                      //true
                                      shrink:
                                        (watch("opinionRequestDate")
                                          ? true
                                          : false) ||
                                        (router.query.opinionRequestDate
                                          ? true
                                          : false),
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.opinionRequestDate
                            ? errors.opinionRequestDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Location Name */}

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
                        marginBottom: "1px",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="small"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.officeLocation}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Location Name */}

                          {<FormattedLabel id="locationName" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 200 }}
                              disabled={router?.query?.pageMode === "View"}
                              // sx={{ width: 200 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="locationName" />}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("officeLocation") ? true : false) ||
                                  (router.query.officeLocation ? true : false),
                              }}
                            >
                              {officeName &&
                                officeName.map((officeLocationName, index) => (
                                  <MenuItem
                                    key={index}
                                    value={officeLocationName.id}
                                  >
                                    {language == "en"
                                      ? officeLocationName?.officeLocationName
                                      : officeLocationName?.officeLocationNameMar}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="officeLocation"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.officeLocation
                            ? errors.officeLocation.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/** Concern Department ID */}
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
                        size="small"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.concenDeptId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="deptName" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              sx={{ width: 200 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="deptName" />}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("concenDeptId") ? true : false) ||
                                  (router.query.concenDeptId ? true : false),
                              }}
                            >
                              {concenDeptNames &&
                                concenDeptNames.map((department, index) => (
                                  <MenuItem key={index} value={department.id}>
                                    {/* {department.department}
                                     */}

                                    {language == "en"
                                      ? department?.department
                                      : department?.departmentMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="concenDeptId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.concenDeptId
                            ? errors.concenDeptId.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

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
                      <TextField
                        sx={{ width: 200 }}
                        disabled={router?.query?.pageMode === "View"}
                        id="standard-textarea"
                        // label="Opinion Subject"
                        label={<FormattedLabel id="opinionSubject" />}
                        placeholder="Opinion Subject"
                        multiline
                        variant="standard"
                        // style={{ width: 200 }}
                        {...register("opinionSubject")}
                        error={!!errors.opinionSubject}
                        helperText={
                          errors?.opinionSubject
                            ? errors.opinionSubject.message
                            : null
                        }
                        InputLabelProps={{
                          //true
                          shrink:
                            (watch("opinionSubject") ? true : false) ||
                            (router.query.opinionSubject ? true : false),
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Second Row */}

                  {/* ADV Panel */}

                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={3}
                      xl={3}
                      md={3}
                      sm={3}
                      sx={{
                        display: "flex",
                        // justifyContent: "center",
                        // alignItems: "center",
                      }}
                    >
                      {/* <FormControlLabel
                      control={<Checkbox defaultChecked={advPanel}/>}
                      {...register("advPanel")}
                      onChange={(e) => {
                        checkBox1(e);
                      }}
                      // label="Do you want Opinion from Panel Advocate"

                      label={<FormattedLabel id="advPanel" />}
                    /> */}

                      {/* New */}

                      {/* <FormControlLabel
                        control={
                          <Controller
                            name="advPanel"
                            control={control}
                            defaultValue={false}
                            render={({ field: { value, ref, ...field } }) => (
                              <Checkbox
                                {...register("advPanel")}
                                inputRef={ref}
                                checked={!!value}
                                onChange={(e) => {

                                  checkBox1(e);
                                  setValue("advPanel", e.target.checked);

                                  // setValue("advPanel", e.target.unchecked);


                                  console.log("checked1", e.target.checked);
                                }}
                                />
                            )}
                          />
                        }
                        label={<FormattedLabel id="advPanel" />}
                      /> */}

                      {/* New Check box */}

                      <FormControlLabel
                        // disabled={
                        //   disabled
                        //     ? true
                        //     : getValues("isApplicantBride")
                        //     ? true
                        //     : false
                        // }
                        control={
                          <Checkbox
                          {...register("advPanel")}
                          disabled={router?.query?.pageMode === "View"}


                            checked={getValues("advPanel") ? true : false}
                          />
                        }
                        label=
                           { <FormattedLabel id="advPanel" />}
                          
                        onChange={(e) => {
                          checkBox1(e);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      xl={3}
                      md={3}
                      sm={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {isOpenCollapse1 && (
                        <>
                          <Box>
                            <FormControl
                              variant="standard"
                              // sx={{ minWidth: 200 }}
                              // sx={{ m: 1, width: 200 }}
                            >
                              <InputLabel htmlFor="age-native-simple">
                                {/* Advocate Names */}
                                <FormattedLabel id="advocateName" />
                              </InputLabel>
                              <Select
                                // sx={{ minWidth: "30%" }}
                              disabled={router?.query?.pageMode === "View"}

                                multiple
                                // value={personName}
                                // defaultValue={selected}
                                value={selected}
                                name="first"
                                onChange={handleChange}
                                // input={<OutlinedInput label="Tag" />}
                                // renderValue={(selected) =>
                                //   -selected
                                //     .map(
                                //       (obj) => advocateNames[obj - 1]?.FullName
                                //     )
                                //     .join(", ")
                                // }

                                renderValue={(selected) => selected.join(", ")}
                              >
                                {advocateNames.map((advocateName) => (
                                  <MenuItem
                                    key={advocateName.id}
                                    // key={advocateName.id}
                                    // value={advocateName.id}
                                    value={advocateName.FullName}
                                  >
                                    <Checkbox
                                      checked={
                                        selected.indexOf(
                                          advocateName.FullName
                                        ) > -1
                                      }
                                    />
                                    <ListItemText
                                      primary={advocateName.FullName}
                                    />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      xl={3}
                      md={3}
                      sm={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        {isOpenCollapse1 && (
                          <TextField
                            id="standard-textarea"
                            disabled={router?.query?.pageMode === "View"}
                            // label="Remarks"
                            label={<FormattedLabel id="remarksEn" />}
                            // placeholder="Remarks"
                            multiline
                            variant="standard"
                            // style={{ width: 200, height: 35, marginTop: 10 }}
                            {...register("panelRemarks")}
                            error={!!errors.panelRemarks}
                            helperText={
                              errors?.panelRemarks
                                ? errors.panelRemarks.message
                                : null
                            }
                          />
                        )}
                      </Box>
                    </Grid>

                    <Grid
                      item
                      xs={3}
                      xl={3}
                      md={3}
                      sm={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        {isOpenCollapse1 && (
                          <TextField
                            id="standard-textarea"
                            disabled={router?.query?.pageMode === "View"}
                            // label="Remarks"
                            label={<FormattedLabel id="remarksMr" />}
                            // placeholder="Remarks"
                            multiline
                            variant="standard"
                            // style={{ width: 200, height: 35, marginTop: 10 }}
                            {...register("panelRemarksMr")}
                            error={!!errors.panelRemarksMr}
                            helperText={
                              errors?.panelRemarksMr
                                ? errors.panelRemarksMr.message
                                : null
                            }
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Report ADV Panel */}
                  {/* Third Row */}
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={3}
                      xl={3}
                      md={3}
                      sm={3}
                      sx={{
                        display: "flex",
                        // justifyContent: "center",
                        // alignItems: "center",
                      }}
                    >
                      {/* <FormControlLabel
                        control={
                          <Controller
                            name="reportAdvPanel"
                            control={control}
                            defaultValue={false}
                            render={({ field: { value, ref, ...field } }) => (
                              <Checkbox
                                // disabled={inputState}
                                {...register("reportAdvPanel")}
                                inputRef={ref}
                                checked={!!value}
                                onChange={(e) => {
                                  setValue("reportAdvPanel", e.target.checked);
                                  checkBox2(e);
                                  console.log("checked1", e.target.checked);
                                }}
                              />
                            )}
                          />
                        }
                        label={<FormattedLabel id="reportAdvPanel" />}
                      /> */}

                      {/* New Checkbox */}

                      
                      <FormControlLabel
                        // disabled={
                        //   disabled
                        //     ? true
                        //     : getValues("isApplicantBride")
                        //     ? true
                        //     : false
                        // }
                        control={
                          <Checkbox
                          {...register("reportAdvPanel")}
                          disabled={router?.query?.pageMode === "View"}


                            checked={getValues("reportAdvPanel") ? true : false}
                          />
                        }
                        label=
                           { <FormattedLabel id="reportAdvPanel" />}
                          
                        onChange={(e) => {
                          checkBox2(e);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      xl={3}
                      md={3}
                      sm={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {isOpenCollapse2 && (
                        <Box>
                          <FormControl
                            variant="standard"
                            // sx={{ m: 1, width: 200 }}
                          >
                            <InputLabel htmlFor="age-native-simple">
                              {/* Advocate Names */}
                              <FormattedLabel id="advocateName" />
                            </InputLabel>
                            <Select
                              // labelId="demo-mutiple-checkbox-label"
                              // id="demo-mutiple-checkbox"
                              // sx={{ minWidth: "30%" }}
                              multiple
                              // value={personName1}
                            disabled={router?.query?.pageMode === "View"}

                              value={selected1}
                              name="first"
                              onChange={handleChange1}
                              // input={<OutlinedInput label="Tag" />}
                              // renderValue={(selected) =>
                              //   selected
                              //     .map((obj) => advocateNames[obj - 1]?.FullName)
                              //     .join(", ")
                              // }

                              renderValue={(selected) => selected.join(", ")}
                            >
                              {advocateNames.map((advocateNames) => (
                                <MenuItem
                                  // key={advocateNames.id}
                                  key={advocateNames.id}
                                  value={advocateNames.FullName}
                                >
                                  <Checkbox
                                    checked={
                                      selected1.indexOf(
                                        advocateNames.FullName
                                      ) > -1
                                    }
                                  />
                                  <ListItemText
                                    primary={advocateNames.FullName}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      xl={3}
                      md={3}
                      sm={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {isOpenCollapse2 && (
                        <>
                          <Box>
                            <TextField
                              id="standard-textarea"
                            disabled={router?.query?.pageMode === "View"}

                              
                              // label="RemarksEn"
                              label={<FormattedLabel id="remarksEn" />}
                              // placeholder="Remarks"
                              multiline
                              variant="standard"
                              // style={{ width: 200, height: 35, marginTop: 10 }}
                              {...register("reportRemarks")}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("reportRemarks") ? true : false) ||
                                  (router.query.reportRemarks ? true : false),
                              }}
                              error={!!errors.reportRemarks}
                              helperText={
                                errors?.reportRemarks
                                  ? errors.reportRemarks.message
                                  : null
                              }
                            />
                          </Box>
                        </>
                      )}
                    </Grid>

                    {/* 
                    New */}
                    <Grid
                      item
                      xs={3}
                      xl={3}
                      md={3}
                      sm={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {isOpenCollapse2 && (
                        <>
                          <Box>
                            <TextField
                              id="standard-textarea"
                              disabled={router?.query?.pageMode === "View"}
                              label={<FormattedLabel id="remarksMr" />}
                              // placeholder="RemarksMr"
                              multiline
                              variant="standard"
                              // style={{ width: 200, height: 35, marginTop: 10 }}
                              {...register("reportRemarksMr")}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("reportRemarksMr") ? true : false) ||
                                  (router.query.reportRemarksMr ? true : false),
                              }}
                              error={!!errors.reportRemarksMr}
                              helperText={
                                errors?.reportRemarksMr
                                  ? errors.reportRemarksMr.message
                                  : null
                              }
                            />
                          </Box>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  {/* Clerk Remarks */}

                  {isOpenCollapse3 && (
                    <>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          xl={12}
                          md={12}
                          sm={12}
                          // sx={{
                          //   display: "flex",
                          //   justifyContent: "center",
                          //   alignItems: "center",
                          // }}
                        >
                          <TextField
                            id="standard-textarea"
                            label={<FormattedLabel id="clerkRemarkEn" />}
                            // label="Clerk Remark in English"
                            // placeholder="Placeholder"
                            multiline
                            style={{ width: 1000 }}
                            variant="standard"
                            {...register("clerkRemarkEn")}
                            InputLabelProps={{
                              //true
                              shrink:
                                (watch("clerkRemarkEn") ? true : false) ||
                                (router.query.clerkRemarkEn ? true : false),
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          xl={12}
                          md={12}
                          sm={12}
                          // sx={{
                          //   display: "flex",
                          //   justifyContent: "center",
                          //   alignItems: "center",
                          // }}
                        >
                          <TextField
                            id="standard-textarea"
                            label={<FormattedLabel id="clerkRemarkMr" />}
                            // label="Clerk Remark in Marathi"
                            // placeholder="Placeholder"
                            multiline
                            style={{ width: 1000, marginTop: "20px" }}
                            variant="standard"
                            {...register("clerkRemarkMr")}
                            InputLabelProps={{
                              //true
                              shrink:
                                (watch("clerkRemarkMr") ? true : false) ||
                                (router.query.clerkRemarkMr ? true : false),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {/* Fourth Row */}

                  {/* Row Button */}

                  <Grid container mt={10} ml={5} mb={5} border px={5}>
                    <Grid item xs={2}></Grid>

                    {router?.query?.pageMode!="View" && 
                    (
                      <>
                   {/* Save ad Draft */}
                   <Grid item>
                   <Button
                     onClick={() => setButtonText("saveAsDraft")}
                     type="Submit"
                     variant="contained"
                   >
                     {/* Submit */}
                     {<FormattedLabel id="saveAsDraft" />}
                   </Button>
                 </Grid>

                 <Grid item xs={2}></Grid>

                 <Grid item>
                   <Button
                     onClick={() => setButtonText("finalSubmit")}
                     type="Submit"
                     variant="contained"
                   >
                     {/* Submit */}
                     {<FormattedLabel id="save" />}
                   </Button>
                 </Grid>
                 </>
                    )}
 

                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() =>
                          router.push(`/LegalCase/transaction/opinion/`)
                        }
                      >
                        {/* Cancel */}

                        {<FormattedLabel id="cancel" />}
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

export default View;
