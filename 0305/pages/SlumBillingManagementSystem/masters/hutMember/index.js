import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Box,
  Slide,
  FormLabel,
  Checkbox,
  TextField,
  Tooltip,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { GridToolbar } from "@mui/x-data-grid";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import hutMemberSchema from "../../../../containers/schema/slumManagementSchema/hutMemberSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import styles from "../../../styles/[zone].module.css";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { ArrowBack } from "@mui/icons-material";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(hutMemberSchema) });

  const [genderDetails, setGender] = useState([]);
  const [religionDetails, setReligion] = useState([]);
  const [titles, setTitles] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const router = useRouter();
  const [religionId, selectReligion] = useState(null);
  const [casteDetails, setCasteDetails] = useState();
  const [casteId, selectCaste] = useState();
  const [subCastDetails, setSubCasteDetails] = useState(null);
  const [educationDetails, setEducationDetails] = useState();
  const [headOfFamily, setIsCheckedheadOfFamily] = useState(false);
  console.log(".........router", router.query.id);
  const [isCheckHeadOfFamily, setIsCheckHeadOfFamily] = useState(null);

  useEffect(() => {
    getTitles();
    getGender();
    getReligion();
    getCastFromReligion();
    getSubCasteDetails();
    getEducationDetails();
  }, []);

  useEffect(() => {
    getHutMaster(router.query.id);
  }, [router.query.id]);

  useEffect(() => {
    getHutMember();
    // getSubUsageType();
  }, []);

  const getGender = () => {
    axios.get(`${urls.SLUMURL}/master/gender/getAll`).then((r) => {
      setGender(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
        })),
      );
    });
  };
  const getCastFromReligion = () => {
    console.log("RRRRRELIGION " + religionId);
    if (religionId != null) {
      axios.get(`${urls.SLUMURL}/master/cast/getCastFromReligion?id=${religionId}`).then((r) => {
        setCasteDetails(
          r.data.mCast.map((row) => ({
            id: row.id,
            cast: row.cast,
          })),
        );
      });
    }
  };

  const getEducationDetails = () => {
    axios.get(`${urls.SLUMURL}/mstEducationCategory/getAll`).then((r) => {
      setEducationDetails(
        r.data.mstEducationCategoryList.map((row) => ({
          id: row.id,
          educationCategory: row.educationCategory,
        })),
      );
    });
  };

  const getSubCasteDetails = () => {
    if (casteId != null) {
      axios.get(`${urls.SLUMURL}/master/subCast/getSubCastFromCast?id=${casteId}`).then((r) => {
        setSubCasteDetails(
          r.data.subCast.map((row) => ({
            id: row.id,
            subCast: row.subCast,
          })),
        );
      });
    }
  };
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
        })),
      );
    });
  };

  const getReligion = () => {
    axios.get(`${urls.SLUMURL}/master/religion/getAll`).then((r) => {
      setReligion(
        r.data.religion.map((row) => ({
          id: row.id,
          religion: row.religion,
        })),
      );
    });
  };

  const getHutMember = (_pageSize = 10, _pageNo = 0) => {
    if (router.query.id != undefined) {
      axios
        .get(`${urls.SLUMURL}/mstHutMembers/getHutMemberFromHutKey?id=${router.query.id}`, {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        })
        .then((res, i) => {
          let result = res.data.mstHutMembersList;
          const _res = result.map((res, i) => {
            return {
              srNo: i + 1,
              id: res.id,
              headOfFamily: res.headOfFamily == "Yes" ? true : false,
              title: res.title,
              middleName: res.middleName,
              genderKey: res.genderKey,
              religionKey: res.religionKey,
              casteKey: res.casteKey,
              subCasteKey: res.subCasteKey,
              educationKey: res.educationKey,
              firstName: res.firstName,
              lastName: res.lastName,
              aadharNo: res.aadharNo,
              mobileNo: res.mobileNo,
              age: res.age,
              // remarks: res.remarks,
              activeFlag: res.activeFlag,
              status: res.activeFlag === "Y" ? "Active" : "InActive",
            };
          });
          setDataSource([..._res]);
          setIsCheckedheadOfFamily(res.headOfFamily === "Yes" ? true : false);
          setTotalElements(res.data.totalElements);
          setPageSize(res.data.pageSize);
          setPageNo(res.data.pageNo);
        });
      console.log("KJHGFGHJKJH " + dataSource.some((code) => JSON.stringify(code.headOfFamily) === true));
    }
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.SLUMURL}/mstHutMembers/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deactivated!", {
                icon: "success",
              });
              getHutMember();
              setButtonInputState(false);
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
          axios.post(`${urls.SLUMURL}/mstHutMembers/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully activated!", {
                icon: "success",
              });
              getHutMember();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setIsCheckedheadOfFamily(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
      hutKey: router.query.id,
      headOfFamily: headOfFamily === true ? "Yes" : "No",
    };
    axios.post(`${urls.SLUMURL}/mstHutMembers/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 201) {
        formData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getHutMember();

        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  const getHutMaster = (id) => {
    axios.get(`${urls.SLUMURL}/mstHut/getById?id=${id}`).then((res, i) => {
      console.log("getHutMaster", res.data);
      setValue("hutNo", res.data.hutNo);
      setValue("totalFamilyMembers", res.data.totalFamilyMembers);
      setValue("maleCount", res.data.maleCount);
      setValue("femaleCount", res.data.femaleCount);
    });
  };

  const handleBackButton = () => {
    router.push("/SlumBillingManagementSystem/masters/hutMaster");
  };

  const resetValuesExit = {
    hutKey: "",
    headOfFamily: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    aadharNo: "",
    mobileNo: "",
    age: "",
    genderKey: "",
    religionKey: "",
    casteKey: "",
    subCasteKey: "",
    educationKey: "",
  };

  const cancellButton = () => {
    setIsCheckedheadOfFamily(false);
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    hutKey: "",
    headOfFamily: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    aadharNo: "",
    mobileNo: "",
    age: "",
    genderKey: "",
    religionKey: "",
    casteKey: "",
    subCasteKey: "",
    educationKey: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "firstName",
      headerName: <FormattedLabel id="firstName" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },

    {
      field: "lastName",
      headerName: <FormattedLabel id="lastName" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "aadharNo",
      headerName: <FormattedLabel id="aadharNo" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "mobileNo",
      headerName: <FormattedLabel id="mobileNo" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "age",
      headerName: <FormattedLabel id="age" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
    },
    // {
    //   field: "toDate",
    //   headerName: <FormattedLabel id="toDate" />,
    //   // type: "number",
    //   flex: 1,
    //   minWidth: 250,
    // },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                setIsCheckedheadOfFamily(params.row.headOfFamily);
                reset(params.row);
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {/* <div
        style={{
     
          backgroundColor: "#757ce8",
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
        <FormattedLabel id='hutMember' />
      </div> */}
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
        <Box
          sx={{ flexGrow: 1 }}
          style={{
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <AppBar
            position="static"
            sx={{
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#000",
                }}
              >
                <ArrowBack onClick={handleBackButton} />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "#000",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h5",
                    xl: "h5",
                  },
                }}
              >
                <FormattedLabel id="hutDetails" />
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>

        <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              multiline
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="hutNo" />}
              // @ts-ignore
              variant="outlined"
              value={watch("hutNo")}
              InputLabelProps={{
                shrink: router.query.id || watch("hutNo") ? true : false,
              }}
              error={!!errors.hutNo}
              helperText={errors?.hutNo ? errors.hutNo.message : null}
            />
          </Grid>

          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              multiline
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="totalFamilyMembers" />}
              // @ts-ignore
              variant="outlined"
              value={watch("totalFamilyMembers")}
              InputLabelProps={{
                shrink: router.query.id || watch("totalFamilyMembers") ? true : false,
              }}
              error={!!errors.totalFamilyMembers}
              helperText={errors?.totalFamilyMembers ? errors.totalFamilyMembers.message : null}
            />
          </Grid>

          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              multiline
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="maleCount" />}
              // @ts-ignore
              variant="outlined"
              value={watch("maleCount")}
              InputLabelProps={{
                shrink: router.query.id || watch("maleCount") ? true : false,
              }}
              error={!!errors.maleCount}
              helperText={errors?.maleCount ? errors.maleCount.message : null}
            />
          </Grid>

          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <TextField
              multiline
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="femaleCount" />}
              // @ts-ignore
              variant="outlined"
              value={watch("femaleCount")}
              InputLabelProps={{
                shrink: router.query.id || watch("femaleCount") ? true : false,
              }}
              error={!!errors.femaleCount}
              helperText={errors?.femaleCount ? errors.femaleCount.message : null}
            />
          </Grid>
        </Grid>

        <Box
          sx={{ flexGrow: 1 }}
          style={{
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <AppBar
            position="static"
            sx={{
              background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#000",
                }}
              >
                <></>
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "#000",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h5",
                    xl: "h5",
                  },
                }}
              >
                <FormattedLabel id="hutMember" />
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: "10px" }}>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      sx={{ width: "200px", marginTop: "2%" }}
                      variant="standard"
                      error={!!errors.title}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        // disabled={isDisabled}
                      >
                        <FormattedLabel id="title" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          >
                            {titles &&
                              titles.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {value?.title}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="title"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.title ? errors.title.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ width: "200px", marginTop: "2%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="firstName" />}
                      variant="standard"
                      {...register("firstName")}
                      error={!!errors.firstName}
                      helperText={errors?.firstName ? errors.firstName.message : null}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{ width: "200px", marginTop: "2%" }}
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="CFC Name Mr"
                      label={<FormattedLabel id="middleName" />}
                      variant="standard"
                      {...register("middleName")}
                      error={!!errors.middleName}
                      helperText={errors?.middleName ? errors.middleName.message : null}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    sx={{ width: "200px", marginTop: "2%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="lastName" />}
                    variant="standard"
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={errors?.lastName ? errors.lastName.message : null}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    sx={{ width: "200px", marginTop: "2%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="aadharNo" />}
                    variant="standard"
                    {...register("aadharNo")}
                    error={!!errors.aadharNo}
                    helperText={errors?.aadharNo ? errors.aadharNo.message : null}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    sx={{ width: "200px", marginTop: "2%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC ID"
                    label={<FormattedLabel id="mobileNo" />}
                    variant="standard"
                    {...register("mobileNo")}
                    error={!!errors.mobileNo}
                    helperText={errors?.mobileNo ? errors.mobileNo.message : null}
                  />
                </Grid>
              </Grid>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    sx={{ width: "200px", marginTop: "2%" }}
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="CFC ID"
                    label={<FormattedLabel id="age" />}
                    variant="standard"
                    {...register("age")}
                    error={!!errors.age}
                    helperText={errors?.age ? errors.age.message : null}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.genderKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                      // disabled={isDisabled}
                    >
                      <FormattedLabel id="genderKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {genderDetails &&
                            genderDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.gender}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="genderKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.genderKey ? errors.genderKey.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.religionKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                      // disabled={isDisabled}
                    >
                      <FormattedLabel id="religionKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            selectReligion(value.target.value);
                            getCastFromReligion();
                          }}
                        >
                          {religionDetails &&
                            religionDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.religion}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="religionKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.religionKey ? errors.religionKey.message : null}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container style={{ paddign: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.casteKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                      // disabled={isDisabled}
                    >
                      <FormattedLabel id="casteKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            selectCaste(value.target.value);
                            getSubCasteDetails();
                          }}
                        >
                          {casteDetails &&
                            casteDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.cast}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="casteKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.casteKey ? errors.casteKey.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.subCasteKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                      // disabled={isDisabled}
                    >
                      <FormattedLabel id="subCasteKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {subCastDetails &&
                            subCastDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.subCast}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="subCasteKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.subCasteKey ? errors.subCasteKey.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    sx={{ width: "200px", marginTop: "2%" }}
                    variant="standard"
                    error={!!errors.educationKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                      // disabled={isDisabled}
                    >
                      <FormattedLabel id="educationKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {educationDetails &&
                            educationDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.educationCategory}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="educationKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.educationKey ? errors.educationKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  // style={{ minWidth: "230px" }}
                >
                  <FormattedLabel id="headOfFamily" />
                  <Checkbox
                    value={headOfFamily}
                    checked={headOfFamily ? true : false}
                    onChange={() => {
                      console.log("headOfFamily " + !headOfFamily);
                      setIsCheckedheadOfFamily(!headOfFamily);
                    }}
                  />
                </FormLabel>
              </Grid>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  // item
                  // xs={4}
                  // sx={{ marginTop: 5 }}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}

                  item
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button type="submit" variant="contained" color="success" endIcon={<SaveIcon />}>
                    {btnSaveText == "Save" ? <FormattedLabel id="save" /> : <FormattedLabel id="update" />}
                  </Button>{" "}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{ marginRight: 8 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
        </Grid>
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              // printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              // csvOptions: { disableToolbarButton: true },
            },
          }}
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
          // rows={dataSource}
          // columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          density="compact"
          pagination
          paginationMode="server"
          rowCount={totalElements}
          rowsPerPageOptions={[5]}
          pageSize={pageSize}
          rows={dataSource}
          columns={columns}
          onPageChange={(_data) => {
            getHutMember(pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getHutMember(pageSize, _data);
          }}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
