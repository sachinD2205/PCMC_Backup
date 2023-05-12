import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
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
  // Card,
  // Checkbox,
  // FormControl,
  // FormControlLabel,
  // FormHelperText,
  // FormLabel,
  // Grid,
  // InputLabel,
  // MenuItem,
  // Radio,
  // RadioGroup,
  // Select,
  // TextField,
  Paper,
  Select,
  TextField,
} from "@mui/material";
// import * as yup from 'yup'
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
import urls from "../../../../URLS/urls";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setId] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [isOpenCollapse1, setIsOpenCollapse1] = useState(false);
  const [isOpenCollapse2, setIsOpenCollapse2] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [personName, setPersonName] = React.useState([]);

  const [personName1, setPersonName1] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("31", value);
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // const [id,setId]= useState();
  // const getApproveOpinion = () => {
  //   axios.get
  //   reset(res.data)
  // }

  useEffect(() => {
    reset(router.query);
    // setId(router.query.id)
    //  getApproveOpinion()
  }, [router.query]);

  // console.log("personName1", personName, "personName2", personName1);

  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    console.log("31", value);
    setPersonName1(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const checkBox1 = (e) => {
    // alert(e.target.value);
    if (e.target.checked == true) {
      // console.log("Checked ", e.target.value);
      setIsOpenCollapse1(true);
    } else if (e.target.checked == false) {
      // console.log(" Un Checked ", e.target.value);
      setIsOpenCollapse1(false);
    }
  };

  const checkBox2 = (e) => {
    if (e.target.checked == true) {
      setIsOpenCollapse2(true);
    } else if (e.target.checked == false) {
      setIsOpenCollapse2(false);
    }
  };

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDeptName();
    getOfficeName();
  }, []);

  useEffect(() => {
    getAllOpinion();
  }, [concenDeptNames, officeName]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  const getAllOpinion = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/transaction/opinion/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("r222", r);
        let result = r?.data?.opinion;

        let _res = result.map((val, index) => {
          return val.opinionAdvPanelList.map((val,index) => {
            return {
              srNo : val.advocate,
              id: index,
              advocateName: val.advocate,
              advocateOpinion: val.opinion,
            };
          });
          console.log("r1111", val);
        });

        let result1 = result?.[0]?.opinionAdvPanelList;

        // reset(r.data)
        let _res1 = result1.map((r, i) => {
          console.log("44aa", r);
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            opinionRequestDate: moment(r.opinionRequestDate).format(
              "YYYY-MM-DD"
            ),

            searchTitleRptDate: moment(r.searchTitleRptDate).format(
              "YYYY-MM-DD"
            ),

            finalDraftDeliveryDate: moment(r.finalDraftDeliveryDate).format(
              "YYYY-MM-DD"
            ),
            opinionSubject: r.opinionSubject,
            // concenDeptName: r.concenDeptName,
            concenDeptId: r.concenDeptId,
            concenDeptName: concenDeptNames?.find(
              (obj) => obj?.id === r.concenDeptId
            )?.department,

            advPanel: r.advPanel,
            panelRemarks: r.panelRemarks,
            reportRemarks: r.reportRemarks,
            remarks: r.remarks,
            opinionSubmisionDate: moment(r.opinionSubmisionDate).format(
              "YYYY-MM-DD"
            ),
            opinion: r.opinion,
            officeLocation: r.officeLocation,
            officeLocationNameText: officeName?.find(
              (obj) => obj?.id === r.officeLocation
            )?.officeLocationName,
            officeLocationNameTextMr: officeName?.find(
              (obj) => obj?.id === r.officeLocation
            )?.officeLocationNameMr,

            department: r.department,
            department: concenDeptNames?.find(
              (obj) => obj?.id === r.concenDeptId
            )?.department,
            departmentMr: concenDeptNames?.find(
              (obj) => obj?.id === r.concenDeptId
            )?.department,

            opinionMr: r.opinionMr,

            panelRemarks: r.panelRemarks,
            panelRemarksMr: r.panelRemarksMr,

            courtCaseNumber: r.courtCaseNumber,

            advocateOpinion: r.advocateOpinion,

            // advocateOpinion:advocateOpinion.map((item)=>item.id),

            filedBy: r.filedBy,
            filedByMr: r.filedByMr,
            caseDetails: r.caseDetails,
            caseDetailsMr: r.caseDetailsMr,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        console.log("ddsf", _res);
        setDataSource([..._res]);

        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  const getDeptName = () => {
    // alert("HEllo");
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

  // get Location Name

  const getOfficeName = () => {
    axios.get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`).then((res) => {
      console.log("ghfgf", res);
      setOfficeName(
        res.data.officeLocation.map((r, i) => ({
          id: r.id,
          officeLocationName: r.officeLocationName,
          officeLocationNameMr: r.officeLocationNameMr,
        }))
      );
    });
  };

  //Delete By ID

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getAllOpinion();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getAllOpinion();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const columns = [
    {
      headerName: "Sr.No",
      field: "srNo",
      width: 200,
    },

    {
      // headerName: <FormattedLabel id="opinionRequestDate" />,
      headerName: "Advocate Name",
      field: "advocate",
      width: 400,
    },

    {
      // headerName: <FormattedLabel id="locationName" />,
      headerName: "Advocate Opinion",
      field: "advocateOpinion",
      width: 700,
    },
  ];

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <Divider />

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: 10,
            }}
          ></div>

          {/* Opinion Form */}

          <form
          //  onSubmit={handleSubmit(onSubmitForm)}
          >
            {/* First Row */}

            <Grid container sx={{ padding: "10px" }}>
              {/* Case Number */}
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled
                  label="Court Case Number"
                  variant="standard"
                  maxRows={4}
                  style={{ width: 200 }}
                  {...register("caseNumber")}
                />
              </Grid>

              {/* Filed By */}
              <Grid
                item
                xs={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <TextField
                  //// required
                  style={{ width: 200 }}
                  variant="standard"
                  disabled
                  label={<FormattedLabel id="filedBy" />}
                  {...register("filedBy")}
                />
              </Grid>

              {/* Case Details */}
              <Grid
                item
                xs={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <TextField
                  id="standard-textarea"
                  label={<FormattedLabel id="caseDetails" />}
                  placeholder="Placeholder"
                  multiline
                  disabled
                  style={{ width: 200 }}
                  variant="standard"
                  {...register("caseDetails")}
                />
              </Grid>
            </Grid>
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
                  justifyContent: "center",
                  alignItems: "center",
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
                            <span style={{ fontSize: 16 }}>
                              {/* Opinion Request Date */}

                              {<FormattedLabel id="opinionRequestDate" />}
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
                              variant="standard"
                              sx={{ width: 230 }}
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
                }}
              >
                <FormControl
                  // variant="outlined"
                  variant="standard"
                  size="small"
                  sx={{ m: 1, minWidth: 120 }}
                  error={!!errors.concenDeptId}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Location Name */}

                    {<FormattedLabel id="locationName" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="locationName" />}
                      >
                        {officeName &&
                          officeName.map((officeLocationName, index) => (
                            <MenuItem key={index} value={officeLocationName.id}>
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
                  {/* <FormHelperText>
                          {errors?.concenDeptId
                            ? errors.concenDeptId.message
                            : null}
                        </FormHelperText> */}
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
                  sx={{ m: 1, minWidth: 120 }}
                  error={!!errors.concenDeptId}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="deptName" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={router?.query?.pageMode === "View"}
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="deptName" />}
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
                    {errors?.concenDeptId ? errors.concenDeptId.message : null}
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
                  disabled={router?.query?.pageMode === "View"}
                  id="standard-textarea"
                  // label="Opinion Subject"
                  label={<FormattedLabel id="opinionSubject" />}
                  placeholder="Opinion Subject"
                  multiline
                  variant="standard"
                  style={{ width: 200 }}
                  {...register("opinionSubject")}
                  error={!!errors.opinionSubject}
                  helperText={
                    errors?.opinionSubject
                      ? errors.opinionSubject.message
                      : null
                  }
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
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  style={{ width: "60%" }}
                  control={<Checkbox />}
                  {...register("advPanel")}
                  onChange={(e) => {
                    checkBox1(e);
                  }}
                  // label="Do you want Opinion from Panel Advocate"

                  label={<FormattedLabel id="advPanel" />}
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
                      <FormControl variant="standard" sx={{ minWidth: 200 }}>
                        <InputLabel htmlFor="age-native-simple">
                          Advocate Names
                        </InputLabel>
                        <Select
                          sx={{ minWidth: "30%" }}
                          multiple
                          value={personName}
                          name="first"
                          onChange={handleChange}
                          // input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) =>
                            selected
                              .map((obj) => advocateNames[obj - 1]?.FullName)
                              .join(", ")
                          }
                        >
                          {advocateNames.map((advocateNames) => (
                            <MenuItem
                              key={advocateNames.id}
                              value={advocateNames.id}
                            >
                              <Checkbox
                                checked={
                                  personName.indexOf(advocateNames.id) > -1
                                }
                              />
                              <ListItemText primary={advocateNames.FullName} />
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

                {/* Button */}
                {/* <Grid
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
                          <Button
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/LegalCase/transaction/opinion/advocateOpinion",

                                query: {
                                  pageMode: "PanelAdv",

                                  opinionRequestDate: _opinionRequestDate,
                                  concenDeptId: _concenDeptId,
                                  opinionSubject: _opinionSubject,
                                  officeLocation :_officeLocation,
                                  panelRemarks:_panelRemarks

                                },
                              });
                            }}
                          >
                            Send
                          </Button>
                        )}
                      </Box>
                    </Grid> */}
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
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={<Checkbox />}
                  style={{ width: "60%" }}
                  {...register("reportAdvPanel")}
                  onChange={(e) => {
                    checkBox2(e);
                  }}
                  // label="Do you want Search Title Report from Panel Advocate"

                  label={<FormattedLabel id="reportAdvPanel" />}
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
                    {/* <FormControl
                          
                          variant="standard"
                          size="small"
                         
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="advoacteName" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 230 }}
                                disabled={router?.query?.pageMode === "View"}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="advoacteName" />}
                                InputProps={{ style: { fontSize: 15 } }}
                                InputLabelProps={{ style: { fontSize: 13 } }}
                              >
                                
                                {advocateNames1 &&
                                  advocateNames1.map((FullName1, index) => (
                                    <MenuItem key={index} value={FullName1.id}>
                                      

                                      {language == "en"
                                        ? FullName1?.FullName1
                                        : FullName1?.FullNameMr1}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="reportAdvPanel"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.reportAdvPanel
                              ? errors.reportAdvPanel.message
                              : null}
                          </FormHelperText>
                        </FormControl> */}

                    <FormControl variant="standard" sx={{ minWidth: 200 }}>
                      <InputLabel htmlFor="age-native-simple">
                        Advocate Names
                      </InputLabel>
                      <Select
                        // labelId="demo-mutiple-checkbox-label"
                        // id="demo-mutiple-checkbox"
                        sx={{ minWidth: "30%" }}
                        multiple
                        value={personName1}
                        name="first"
                        onChange={handleChange1}
                        // input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) =>
                          selected
                            .map((obj) => advocateNames[obj - 1]?.FullName)
                            .join(", ")
                        }
                      >
                        {advocateNames.map((advocateNames) => (
                          <MenuItem
                            key={advocateNames.id}
                            value={advocateNames.id}
                          >
                            <Checkbox
                              checked={
                                personName1.indexOf(advocateNames.id) > -1
                              }
                            />
                            <ListItemText primary={advocateNames.FullName} />
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
                        // label="RemarksEn"
                        label={<FormattedLabel id="remarksEn" />}
                        // placeholder="Remarks"
                        multiline
                        variant="standard"
                        // style={{ width: 200, height: 35, marginTop: 10 }}
                        {...register("reportRemarks")}
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
          </form>

          {/* </Paper> */}

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
              {/* <FormattedLabel id="approveOpinion" />
               */}
              Opinion For Panel Advocate
            </h2>
          </Box>

          <Box
            sx={{
              height: 400,
              // width: 1000,
              marginLeft: 10,

              // width: '100%',

              // overflowX: 'auto',
            }}
          >
            <DataGrid
              // disableColumnFilter
              // disableColumnSelector
              // disableToolbarButton
              // disableDensitySelector
              // components={{ Toolbar: GridToolbar }}
              // componentsProps={{
              //   toolbar: {
              //     showQuickFilter: true,
              //     quickFilterProps: { debounceMs: 500 },
              //     printOptions: { disableToolbarButton: true },

              //     csvOptions: { disableToolbarButton: true },
              //   },
              // }}
              getRowId={(row) => row.srNo}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,

                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              // autoHeight={true}
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                // getCaseType(data.pageSize, _data);
                getAllOpinion(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllOpinion(_data, data.page);
              }}
            />
          </Box>

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
              {/* <FormattedLabel id="approveOpinion" /> */}
              Opinion For Report Title Advocate
            </h2>
          </Box>

          <Box
            sx={{
              height: 400,
              // width: 1000,
              marginLeft: 10,

              // width: '100%',

              // overflowX: 'auto',
            }}
          >
            <DataGrid
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,

                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              // autoHeight={true}
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                // getCaseType(data.pageSize, _data);
                getAllOpinion(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllOpinion(_data, data.page);
              }}
            />
          </Box>
        </div>

        {/* Fourth Row */}
        <Grid container sx={{ padding: "10px" }}>
          <Grid
            item
            xs={12}
            xl={12}
            md={12}
            sm={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              id="standard-textarea"
              disabled={router?.query?.pageMode === "View"}
              // label="Opinion"
              label={<FormattedLabel id="opinionEn" />}
              // placeholder="Opinion"
              multiline
              variant="standard"
              style={{ width: 1000 }}
              {...register("opinion")}
              error={!!errors.opinion}
              helperText={errors?.opinion ? errors.opinion.message : null}
            />
          </Grid>

          <Grid
            item
            xs={12}
            xl={12}
            md={12}
            sm={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              id="standard-textarea"
              disabled={router?.query?.pageMode === "View"}
              // label="Opinion"
              label={<FormattedLabel id="opinionMr" />}
              // placeholder="Opinion"
              multiline
              variant="standard"
              style={{ width: 1000 }}
              {...register("opinionMr")}
              error={!!errors.opinionMr}
              helperText={errors?.opinionMr ? errors.opinionMr.message : null}
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
              marginLeft: "50px",
            }}
          >
            <FormControl
              style={{ marginTop: 10 }}
              error={!!errors.opinionSubmisionDate}
            >
              <Controller
                control={control}
                name="opinionSubmisionDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={router?.query?.pageMode === "View"}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>
                          Opinion Submission Date
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
                          disabled={router?.query?.pageMode === "View"}
                          {...params}
                          size="small"
                          variant="standard"
                          // fullWidth
                          sx={{ width: 230 }}
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
                {errors?.opinionRecivedDate
                  ? errors.opinionRecivedDate.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        {/* Button Row */}
        <Grid container mt={10} ml={5} mb={5} border px={5}>
          <Grid item xs={2}></Grid>

          <Grid item xs={2}></Grid>

          <Grid item>
            <Button
              // onClick={() => setButtonText("submit")}

              type="Submit"
              variant="contained"
            >
              {/* Submit */}
              {<FormattedLabel id="submit" />}
            </Button>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => router.push(`/LegalCase/transaction/opinion/`)}
            >
              {/* Cancel */}

              {<FormattedLabel id="cancel" />}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Index;
