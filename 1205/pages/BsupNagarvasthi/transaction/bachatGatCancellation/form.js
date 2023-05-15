import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  ThemeProvider,
  Paper,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Visibility, Watch } from "@mui/icons-material";

const BachatGatCategory = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
  });

  const router = useRouter();
  const loggedUser = localStorage.getItem("loggedInUser");
  const [statusVal, setStatusVal] = useState(null)
  const [zone, setZone] = useState([]);
  const [ward, setWard] = useState([]);
  const [area, setArea] = useState([]);
  const [gatCategory, setGatCategory] = useState([]);
  const [valueData, setValuesData] = useState([]);
  const [applicationNo, setApplicationNo] = useState("");
  const user = useSelector((state) => state.user.user);
  const [bankMaster, setBankMasters] = useState([]);
  const [memberList, setMemberData] = useState([])
  const [fetchDocument, setFetchDocuments] = useState([])
  const [bgRegId, setId] = useState()
  const language = useSelector((state) => state.labels.language);

  useEffect(() => {
    getCRAreaName()
    getZoneName()
    getWardNames()
    getBachatGatCategory()
    getBankMasters()
  }, [])

  useEffect(() => {
    if (valueData.length != 0) {
      setDataOnForm()
    }
  }, [language && valueData])

  useEffect(() => {
    if (valueData.length != 0) {
      setDataOnForm()
    }
  }, [language])

  // set reg no on ui
  useEffect(() => {
    setValue("applicationNo", router.query.id)
    setValue("cancelDate", new Date())
  }, [router.query.id]);

  // handle search connections
  const handleSearchConnections = () => {
    loggedUser === "citizenUser" ? axios
      .get(`${urls.BSUPURL}/trnBachatgatRegistration/getByApplicationNo?applicationNo=${watch("applicationNo")}`, {
        headers: {
          UserId: user.id,
        },
      })
      .then((r) => {
        setValuesData(r.data);
      }) : axios
        .get(`${urls.BSUPURL}/trnBachatgatRegistration/getByApplicationNo?applicationNo=${watch("applicationNo")}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          setValuesData(r.data);
        });
  };

  // set data on form
  const setDataOnForm = () => {
    if (valueData != undefined) {
      const data = valueData
      setId(data.id)
      setValue("areaKey", data.areaKey)
      setValue("zoneKey", data.zoneKey)
      setValue("wardKey", data.wardKey)
      setValue("areaName", language == "en" ? area?.find((obj) => obj.id == data.areaKey)?.areaName
        ? area?.find((obj) => obj.id == data.areaKey)?.areaName
        : "-" : area?.find((obj) => obj.id == data.areaKey)?.areaNameMr
        ? area?.find((obj) => obj.id == data.areaKey)?.areaNameMr
        : "-")
      setValue("zoneName", language == "en" ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneName
        ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneName
        : "-" : zone?.find((obj) => obj.id == data.zoneKey)?.zoneNameMr
        ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneNameMr
        : "-")
      setValue("wardname", language == "en" ? ward?.find((obj) => obj.id == data.wardKey)?.wardName
        ? ward?.find((obj) => obj.id == data.wardKey)?.wardName
        : "-" : ward?.find((obj) => obj.id == data.wardKey)?.wardNameMr
        ? ward?.find((obj) => obj.id == data.wardKey)?.wardNameMr
        : "-")
      setValue("geoCode", data.geoCode)
      setValue("bachatgatName", data.bachatgatName)
      setValue("categoryKey", language == "en" ? gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryName
        ? gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryName
        : "-" :
        gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryMr
          ? gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryMr
          : "-")
      setValue("presidentFirstName", data.presidentFirstName)
      setValue("presidentLastName", data.presidentLastName)
      setValue("presidentMiddleName", data.presidentMiddleName)
      setValue("totalMembersCount", data.totalMembersCount)
      setValue("flatBuldingNo", data.flatBuldingNo)
      setValue("buildingName", data.buildingName)
      setValue("roadName", data.roadName)
      setValue("landmark", data.landmark)
      setValue("pinCode", data.pinCode)
      setValue("landlineNo", data.landlineNo)
      setValue("applicantFirstName", data?.applicantFirstName)
      setValue("applicantMiddleName", data?.applicantMiddleName)
      setValue("applicantLastName", data?.applicantLastName)
      setValue("emailId", data?.emailId)
      setValue("mobileNo", data?.mobileNo)
      setStatusVal(data.status)
      setValue("bankName", language == "en" ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        : "-" :
        bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
          ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
          : "-");
      setValue("bankBranchKey", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        : "-");
      setValue("bankIFSC", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode : "-")
      setValue("bankMICR", bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode : "-")
      setValue("accountNo", data.accountNo)
      setValue("bankAccountFullName", data.bankAccountFullName)
      setValue("startDate", moment(
        data.startDate
      ).format("DD-MM-YYYY HH:mm"))
      setValue("saSanghatakRemark", data.saSanghatakRemark)
      setValue("deptClerkRemark", data.deptClerkRemark)
      setValue("deptyCommissionerRemark", data.deptyCommissionerRemark)
      setValue("asstCommissionerRemark", data.asstCommissionerRemark)
      setValue("branchName", data.branchName)
      setValue("ifscCode", data.ifscCode)
      setValue('micrCode', data.micrCode)

      let res = data.trnBachatgatRegistrationMembersList && data.trnBachatgatRegistrationMembersList.map((r, i) => {
        return {
          id: i + 1,
          fullName: r.fullName,
          address: r.address,
          designation: r.designation,
          aadharNumber: r.aadharNumber
        }
      })
      setMemberData(res)
      const _res = []
      _res = data.trnBachatgatRegistrationDocumentsList && data.trnBachatgatRegistrationDocumentsList.map((r, i) => {
        return {
          id: i + 1,
          filenm: r.documentPath && r.documentPath.split('/').pop().split("_").pop(),
          documentType: r.documentType,
          documentPath: r.documentPath
        }
      })
      _res && setFetchDocuments([..._res])
    }
  }

  // load zone
  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      let temp = res.data.zone;
      setZone(temp);
    });
  };

  // load ward
  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      let temp = res.data.ward;
      setWard(temp);
    });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios.get(`${urls.CfcURLMaster}/area/getAll`).then((res) => {
      let temp = res.data.area;
      setArea(temp);
    });
  };

  // load category
  const getBachatGatCategory = () => {
    axios.get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`).then((res) => {
      let temp = res.data.mstBachatGatCategoryList;
      setGatCategory(temp);
    });
  };

  // load bank details
  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(r.data.bank);
    });
  };

  // member columns
  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: <FormattedLabel id="memFullName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: <FormattedLabel id="memFullAdd" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="memDesign" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "aadharNumber",
      headerName: <FormattedLabel id="memAdharNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ]

  // cancel button
  const cancelButton = () => {
    setValue("cancelReason", "")
  };

  // save cancellation
  const onSubmitForm = (formData) => {
    console.log(router.query.isForceful)
    var forceFull = router.query.isForceful
    let body = {
      ...valueData,
      geoCode: valueData.geoCode,
      cancelReason: watch("cancelReason"),
      cancelDate: watch("cancelDate"),
      bgRegistrationKey: bgRegId,
      id: null,
      forcefullyCancelled: router.query.isForceful == "true" ? true : false,
      saSanghatakUserId: null,
      saSanghatakRemark: null,
      saSanghatakDate: null,
      deptClerkUserId: null,
      deptClerkRemark: null,
      deptClerkDate: null,
      asstCommissionerUserId: null,
      asstCommissionerRemark: null,
      asstCommissionerDate: null,
      deptyCommissionerUserId: null,
      deptyCommissionerRemark: null,
      deptyCommissionerDate: null
    };

    if (loggedUser === "citizenUser") {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnBachatgatCancellation/save`, body, {
          headers: {
            UserId: user.id,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert({
              text: ` Your Bachatgat Cancellation No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
              icon: "success",
              buttons: ["View Acknowledgement", "Go To Dashboard"],
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                {
                  router.push('/BsupNagarvasthi/transaction/bachatGatCancellation')
                }
              } else {
                router.push({
                  pathname:
                    "/BsupNagarvasthi/transaction/acknowledgement",
                  query: { id: res.data.message.split('[')[1].split(']')[0], trn: "C" },
                })
              }
            })
          }
        });
    } else {
      const tempData = axios
        .post(`${urls.BSUPURL}/trnBachatgatCancellation/save`, body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert({
              text: ` Your Bachatgat Cancellation No Is : ${res.data.message.split('[')[1].split(']')[0]}`,
              icon: "success",
              buttons: ["View Acknowledgement", "Go To Dashboard"],
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                {
                  router.push('/BsupNagarvasthi/transaction/bachatGatCancellation')
                }
              } else {
                router.push({
                  pathname:
                    "/BsupNagarvasthi/transaction/acknowledgement",
                  query: { id: res.data.message.split('[')[1].split(']')[0], trn: "C" },
                })
              }
            })
          }
        });
    }
  };

  // Doc columns
  const columns2 = [
    {
      field: "documentPath",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      minWidth: 350,
      renderCell: (record) => {
        let naming = record.value
          ?.substring(record.value.lastIndexOf("__") + 2, record.value.length)
          .split(".")[0];
        return <div>{naming}</div>;
      },
    },
    {
      field: "fileType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },

    {
      field: "Action",
      headerName: <FormattedLabel id="view" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        console.log("record?.row?.attachmentName", record);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                console.log("record.row.filePath", record.row);
                window.open(`${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`, "_blank");
              }}
            >
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
  ];

  // UI
  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="bachatgatCancellation" />
          </h2>
        </Box>

        <form onSubmit={handleSubmit(onSubmitForm)}>
          {/* Search registration application no */}
          <Grid container sx={{ padding: "10px" }}>
            <Grid item
              xs={12}
              sm={12}
              md={10}
              xl={10}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "Center"
              }}>
              <TextField
                id="standard-textarea"
                label="BachatGat Number"
                sx={{ minWidth: "90%" }}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={router.query.id ? true : false}
                {...register("applicationNo")}
                onChange={(e) => {
                  setApplicationNo(e.target.value);
                }}
                error={!!errors.applicationNo}
                helperText={errors?.applicationNo ? errors.applicationNo.message : null}
              />
            </Grid>

            {/* search btn */}
            <Grid item xs={12}
              sm={12}
              md={2}
              xl={2}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "Center"
              }}>
              <Button
                variant="contained"
                onClick={() => {
                  handleSearchConnections(applicationNo);
                }}
              >
                {<FormattedLabel id="search" />}
              </Button>
            </Grid>

            {/* area name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="area" />}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
                {...register("areaName")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Zone Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                id="standard-basic"
                {...register("zoneName")}
                label={<FormattedLabel id="zoneNames" />}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
                control={control}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Ward name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="wardname" />}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
                {...register("wardname")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* gisgeo code */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="gisgioCode" />}
                {...register("geoCode")}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* BachatGat FullName */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="bachatgatFullName" />}
                {...register("bachatgatName")}
                sx={{ width: "90%" }}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Bachat Gat category */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="bachatgatCat" />}
                variant="standard"
                disabled={true}
                {...register("categoryKey")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Bachat Gat start date */}
            <Grid item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}>
              <FormControl
                variant="standard"
                style={{ marginTop: 2, }}
                error={!!errors.fromDate}
              >
                <Controller
                  control={control}
                  name="startDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={true}
                        variant="standard"
                        inputFormat="DD/MM/YYYY"
                        label={<span style={{ fontSize: 16 }}>
                          {<FormattedLabel id="bachatgatStartDate" />}</span>}
                        value={field.value}
                        onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField {...params} size="small" variant="standard" sx={{ width: 280 }} />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>{errors?.startDate ? errors.startDate.message : null}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Main gap  Bachat Gat Address*/}
            <Grid container sx={{ padding: "10px" }}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="bachatgatAddress" />
                </h2>
              </Box>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              {/* BachatGat President first Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="presidentFirstName" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("presidentFirstName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* BachatGat President Middle Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="presidentFatherName" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("presidentMiddleName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/*  BachatGat President Surname */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="presidentLastName" />}
                  variant="standard"
                  disabled={true}
                  {...register("presidentLastName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Online ApBachat Gat Total Members Count Application No*/}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("totalMembersCount")}
                  label={<FormattedLabel id="totalCount" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Flat/BuildingNo */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("flatBuldingNo")}
                  label={<FormattedLabel id="flatBuildNo" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Building Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  disabled={true}
                  {...register("buildingName")}
                  label={<FormattedLabel id="buildingNm" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Road Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="roadName" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("roadName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Landmarks */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="landmark" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  {...register("landmark")}
                  disabled={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Pin Code */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="pincode" />}
                  sx={{ width: "90%" }}
                  variant="standard"
                  disabled={true}
                  {...register("pinCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Main gap  Applicant Name Details*/}
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={4}
                style={{ display: "flex", justifyContent: "center" }}
              ></Grid>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="applicantDetails" />
                </h2>
              </Box>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              {/* Applicant first name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  sx={{ width: "90%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantFirstName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantFirstName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Middle Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  sx={{ width: "90%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantMiddleName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantMiddleName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Last Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  sx={{ width: "90%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantLastName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantLastName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* landline */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  sx={{ width: "90%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="landlineNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("landlineNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              {/* Mobile No. */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("mobileNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Email Id */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="emailId" />}
                  variant="standard"
                  sx={{ width: "90%" }}
                  disabled={true}
                  {...register("emailId")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Main gap  Bank Details*/}
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={4}
                style={{ display: "flex", justifyContent: "center" }}
              ></Grid>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="bankDetails" />
                </h2>
              </Box>

            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              {/* Bank Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="bankName" />}
                  variant="standard"
                  disabled={true}
                  {...register("bankName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Branch Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="branchName" />}
                  variant="standard"
                  disabled={true}
                  {...register("branchName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Saving Account No */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="accountNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("accountNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Saving Account Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="accountHolderName" />}
                  variant="standard"
                  disabled={true}
                  {...register("bankAccountFullName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              {/* Bank IFSC Code */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="bankIFSC" />}
                  variant="standard"
                  disabled={true}
                  {...register("ifscCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Bank MICR Code */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  sx={{ width: "90%" }}
                  label={<FormattedLabel id="bankMICR" />}
                  variant="standard"
                  disabled={true}
                  {...register("micrCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Main gap  Member Information*/}
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={4}
                style={{ display: "flex", justifyContent: "center" }}
              ></Grid>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="memberInfo" />
                </h2>
              </Box>
            </Grid>

            {/* members show in table */}
            <DataGrid
              autoHeight
              sx={{
                marginTop: 5,
                overflowY: "scroll",
                overflowX: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
                flexDirection: "column",
                overflowX: "scroll",
              }}
              autoWidth
              density="standard"
              rows={memberList}
              columns={columns}
            />
            {/* Main gap  Required Documents*/}
            <Grid container sx={{ padding: "10px" }}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="requiredDoc" />
                </h2>
              </Box>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              {/* Documents */}
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
                <>
                  <DataGrid
                    autoHeight
                    sx={{
                      overflowY: "scroll",
                      backgroundColor: "white",
                      "& .MuiDataGrid-virtualScrollerContent": {
                      },
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },

                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                      "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                        marginTop: "17px",
                      },
                    }}
                    density="standard"
                    rows={fetchDocument}
                    columns={columns2}
                  />
                </>
              </Grid>
            </Grid>

            {/* Main gap  Approval*/}
            <Grid container sx={{ padding: "10px" }}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  width: "100vw",
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <h2>
                  <FormattedLabel id="cancellationSection" />
                </h2>
              </Box>
            </Grid>
            
            <Grid container style={{ padding: "10px" }}>
              {/* cancel reason */}
              <Grid
                item
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ width: "90%" }}
                  label={<FormattedLabel id="cancelReason" />}
                  id="standard-basic"
                  variant="standard"
                  {...register("cancelReason")}
                  error={!!errors.reason}
                  InputProps={{ style: { fontSize: 18 } }}
                  helperText={
                    errors?.cancelReason ? "Cancel Reason is Required !!!" : null
                  }
                />
              </Grid>

              {/* cancel date */}
              <Grid item
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <FormControl variant="standard" style={{ marginTop: 10, width: "90%" }} error={!!errors.cancelDate}>
                  <Controller
                    control={control}
                    sx={{ width: "90%" }}
                    name="cancelDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={true}
                          variant="standard"
                          inputFormat="YYYY-MM-DD"
                          label={<span style={{ fontSize: 16 }}><FormattedLabel id="cancelDate"></FormattedLabel></span>}
                          value={field.value}
                          onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField {...params} size="small" variant="standard" sx={{ width: "90%" }} />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.cancelDate ? errors?.cancelDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button
                sx={{}}
                type="submit"
                size="medium"
                variant="contained"
                color="primary"
                endIcon={<SaveIcon />}
              >
                <FormattedLabel id="save" />
              </Button>
            </Grid>
            {/* .................................................................. */}
            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                endIcon={<ClearIcon />}
                onClick={() => cancelButton()}
              >
                <FormattedLabel id="clear" />

              </Button>
            </Grid>
            {/* .................................................................. */}

            {/* </Grid> */}
          </Grid>
          <Divider />
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategory;
